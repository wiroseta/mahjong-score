// Optional isolated PostgreSQL test; use @electric-sql/pglite 0.5.11. Synthetic data only.
const {PGlite}=await import(process.env.MAHJONG_PGLITE_MODULE||'@electric-sql/pglite');
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const db=new PGlite();
await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create schema extensions;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('test.user',true),'')::uuid$$;
create function public.mahjong_sync_is_admin() returns boolean language sql stable as $$select coalesce(current_setting('test.admin',true),'false')='true'$$;
grant usage on schema auth to authenticated;grant select on auth.users to authenticated;
insert into auth.users values('11111111-1111-4111-8111-111111111111'),('22222222-2222-4222-8222-222222222222');`);
await db.exec(await fs.readFile(new URL('../tests/fixtures/admin-photo-deletion/training_queue.sql',import.meta.url),'utf8'));
await db.exec(await fs.readFile(new URL('../tests/fixtures/admin-photo-deletion/admin_learning_approval.sql',import.meta.url),'utf8'));
await db.exec(await fs.readFile(new URL('../tests/fixtures/admin-photo-deletion/user_learning_proposals.sql',import.meta.url),'utf8'));
await db.exec(await fs.readFile(new URL('../tests/fixtures/admin-photo-deletion/model_training_runs.sql',import.meta.url),'utf8'));
await db.exec(await fs.readFile(new URL('../supabase/admin_photo_deletion.sql',import.meta.url),'utf8'));
async function role(admin=false){await db.exec(`reset role;select set_config('test.user','${admin?'22222222-2222-4222-8222-222222222222':'11111111-1111-4111-8111-111111111111'}',false);select set_config('test.admin','${admin}',false);set role authenticated;`);}
const labels=[{tile:'east',box:[1,2,20,30]}],photo='data:image/jpeg;base64,'+'A'.repeat(120);let seq=0;
async function enqueue(){await role();return (await db.query(`select public.mahjong_enqueue_training($1,$2,100,100,'invalid','[]',false,0) as id`,[(++seq).toString(16).padStart(64,'0'),photo])).rows[0].id;}
async function remove(id,ls=[],snap=null){return (await db.query(`select public.mahjong_delete_training_photo($1,$2,$3) as deleted`,[id,JSON.stringify(ls),snap])).rows[0].deleted;}
const id=await enqueue();await assert.rejects(()=>remove(id),/Administrator required/);
await db.exec('reset role;set role anon');await assert.rejects(()=>remove(id),/permission denied/);
await role(true);const approved=(await db.query(`select * from public.mahjong_approve_training($1,'[]',$2,'session-A')`,[id,JSON.stringify(labels)])).rows[0];
await assert.rejects(()=>remove(id,labels,'0'.repeat(64)),/Photo changed/);
await db.exec('reset role;set role service_role');const run=(await db.query("select * from public.mahjong_claim_model_run('test-runner',600)")).rows[0];
await role(true);await assert.rejects(()=>remove(id,labels,approved.approved_snapshot),/being used by training/);
await db.exec('reset role');await db.query("update public.mahjong_model_runs set state='rejected',report='{"+'"failure":"regression"'+"}',finished_at=now() where id=$1",[run.id]);
await role(true);assert.equal(await remove(id,labels,approved.approved_snapshot),true);
const deleted=(await db.query('select * from public.mahjong_training_jobs where id=$1',[id])).rows[0];assert.equal(deleted.state,'purged');assert.equal(deleted.photo_data,null);assert.equal(deleted.slot,null);assert.equal(deleted.training_consumed,false);assert.equal(deleted.model_accepted,false);assert.ok(deleted.admin_deleted_at);assert.equal(deleted.admin_deleted_by,'22222222-2222-4222-8222-222222222222');assert.equal(deleted.approved_snapshot,null);assert.ok(deleted.review_history.some(e=>e.action==='approved'));assert.deepEqual(deleted.labels,labels);
await assert.rejects(()=>remove(id,labels),/Photo changed/);await assert.rejects(()=>db.query("update public.mahjong_training_jobs set state='pending',photo_data=$2,slot=99 where id=$1",[id,photo]),/Deleted photo cannot/);
await db.exec('reset role');assert.equal((await db.query('select report from public.mahjong_model_runs where id=$1',[run.id])).rows[0].report.failure,'regression');
const processing=await enqueue();await role(true);await db.query("update public.mahjong_training_jobs set state='analyzing' where id=$1",[processing]);await assert.rejects(()=>remove(processing),/being processed/);
const accepted=await enqueue();await role(true);await db.query("update public.mahjong_training_jobs set state='accepted' where id=$1",[accepted]);assert.equal(await remove(accepted),true);
const pending=await enqueue();await role(true);await assert.rejects(()=>db.query('update public.mahjong_training_jobs set admin_deleted_at=now() where id=$1',[pending]),/permission denied/);assert.equal(await remove(pending),true);
console.log('PASS: administrator-only deletion, stale snapshot, running training exclusion, failed-training deletion, audit retention, unchanged success flags, accepted and pending deletion, terminal tombstone and protected metadata');await db.close();
