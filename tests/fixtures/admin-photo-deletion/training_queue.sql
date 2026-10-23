-- New private, bounded photo training queue. No migration of old descriptor records.
create table public.mahjong_training_jobs (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 image_sha256 text not null check(image_sha256 ~ '^[a-f0-9]{64}$'),
 slot integer unique check(slot between 1 and 128),
 created_at timestamptz not null default now(),
 state text not null default 'pending' check(state in ('pending','analyzing','waiting_quota','needs_admin','candidate','training','accepted','purged')),
 reason text not null check(reason in ('invalid','unused','error')),
 photo_data text check(length(photo_data) between 100 and 800000 and photo_data ~ '^data:image/jpeg;base64,[A-Za-z0-9+/]+={0,2}$'),
 width integer not null check(width between 1 and 4096),
 height integer not null check(height between 1 and 4096),
 observations jsonb not null default '[]' check(jsonb_typeof(observations)='array' and jsonb_array_length(observations)<=26 and octet_length(observations::text)<=30000),
 proposals jsonb not null default '[]' check(jsonb_typeof(proposals)='array' and octet_length(proposals::text)<=60000),
 labels jsonb not null default '[]' check(jsonb_typeof(labels)='array' and jsonb_array_length(labels)<=26 and octet_length(labels::text)<=30000),
 is_winner boolean not null,
 seat integer not null check(seat between 0 and 3),
 next_attempt_at timestamptz not null default now(),
 attempts integer not null default 0 check(attempts between 0 and 100),
 lease_until timestamptz,
 training_consumed boolean not null default false,
 evaluation_complete boolean not null default false,
 model_accepted boolean not null default false,
 no_other_dataset_references boolean not null default false,
 keep_for_evaluation boolean not null default false,
 model_version text,
 unique(owner_id,image_sha256),
 check(width::bigint*height<=16000000),
 check((state='purged' and photo_data is null and slot is null and training_consumed and evaluation_complete and model_accepted and no_other_dataset_references and not keep_for_evaluation) or (state<>'purged' and photo_data is not null and slot is not null))
);
alter table public.mahjong_training_jobs enable row level security;
revoke all on public.mahjong_training_jobs from anon,authenticated;
grant select,insert on public.mahjong_training_jobs to authenticated;
grant update(state,proposals,labels,next_attempt_at,attempts,lease_until,training_consumed,evaluation_complete,model_accepted,no_other_dataset_references,keep_for_evaluation,model_version,photo_data,slot) on public.mahjong_training_jobs to authenticated;
create policy training_job_read on public.mahjong_training_jobs for select to authenticated using(owner_id=(select auth.uid()) or (select public.mahjong_sync_is_admin()));
create policy training_job_insert on public.mahjong_training_jobs for insert to authenticated with check(owner_id=(select auth.uid()) and state='pending' and attempts=0 and proposals='[]'::jsonb and labels='[]'::jsonb and not training_consumed and not evaluation_complete and not model_accepted and not no_other_dataset_references and not keep_for_evaluation and model_version is null and lease_until is null and next_attempt_at<=now()+interval '1 minute' and created_at between now()-interval '1 minute' and now()+interval '1 minute');
create policy training_job_update on public.mahjong_training_jobs for update to authenticated using((select public.mahjong_sync_is_admin())) with check((select public.mahjong_sync_is_admin()));
create index mahjong_training_jobs_ready on public.mahjong_training_jobs(next_attempt_at,created_at) where state in ('pending','waiting_quota');

-- INVOKER preserves RLS. Collisions are skipped atomically; 128 occupied slots cap raw data near 100 MB.
create function public.mahjong_enqueue_training(p_sha text,p_photo text,p_width integer,p_height integer,p_reason text,p_observations jsonb,p_winner boolean,p_seat integer)
returns uuid language plpgsql security invoker set search_path=public as $$
declare existing uuid; candidate uuid; i integer;
begin
 if auth.uid() is null then raise exception 'Login required'; end if;
 select id into existing from public.mahjong_training_jobs where owner_id=auth.uid() and image_sha256=p_sha;
 if existing is not null then return existing; end if;
 for i in 1..128 loop
  insert into public.mahjong_training_jobs(image_sha256,slot,photo_data,width,height,reason,observations,is_winner,seat)
  values(p_sha,i,p_photo,p_width,p_height,p_reason,p_observations,p_winner,p_seat)
  on conflict do nothing returning id into candidate;
  if candidate is not null then return candidate; end if;
 end loop;
 select id into existing from public.mahjong_training_jobs where owner_id=auth.uid() and image_sha256=p_sha;
 if existing is not null then return existing; end if;
 raise exception 'Training queue full';
end;
$$;
revoke all on function public.mahjong_enqueue_training(text,text,integer,integer,text,jsonb,boolean,integer) from public,anon;
grant execute on function public.mahjong_enqueue_training(text,text,integer,integer,text,jsonb,boolean,integer) to authenticated;
