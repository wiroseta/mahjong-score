-- Reviewed schema draft, not yet deployed; migration tooling is not installed.
-- Apply only together with worker and admin UI changes. Existing candidates require re-review.
alter table public.mahjong_training_jobs
 add column if not exists capture_group text,
 add column if not exists approved_by uuid references auth.users(id),
 add column if not exists approved_at timestamptz,
 add column if not exists approved_payload text,
 add column if not exists approved_snapshot text,
 add column if not exists review_decision text check(review_decision in ('approved','rejected')),
 add column if not exists review_history jsonb not null default '[]';

create or replace function public.mahjong_training_approval_guard()
returns trigger language plpgsql security invoker set search_path=public,extensions as $$
begin
 if TG_OP='INSERT' then
  if new.review_decision is not null or new.review_history<>'[]'::jsonb or new.state<>'pending' or new.approved_by is not null or new.approved_at is not null or new.approved_payload is not null or new.approved_snapshot is not null then
   raise exception 'Approval cannot be supplied by a submitter';
  end if;
  return new;
 end if;
 if new.review_history is distinct from old.review_history then raise exception 'Review history is server controlled';end if;
 if current_setting('mahjong.admin_review',true)='approve' then
  if auth.uid() is null or not public.mahjong_sync_is_admin() then raise exception 'Administrator required'; end if;
  new.approved_by:=auth.uid();new.approved_at:=clock_timestamp();
  new.approved_payload:=jsonb_build_object('id',new.id,'image',new.image_sha256,'width',new.width,'height',new.height,'labels',new.labels,'captureGroup',new.capture_group,'approvedBy',new.approved_by,'approvedAtMillis',floor(extract(epoch from new.approved_at)*1000))::text;
  new.approved_snapshot:=encode(sha256(convert_to(new.approved_payload,'UTF8')),'hex');
  new.review_decision:='approved';
  new.review_history:=old.review_history||jsonb_build_array(jsonb_build_object('action','approved','actor',auth.uid(),'at',new.approved_at,'snapshot',new.approved_snapshot));
 elsif current_setting('mahjong.admin_review',true)='reject' then
  if auth.uid() is null or not public.mahjong_sync_is_admin() then raise exception 'Administrator required';end if;
  new.approved_by:=null;new.approved_at:=null;new.approved_payload:=null;new.approved_snapshot:=null;new.review_decision:='rejected';
  new.review_history:=old.review_history||jsonb_build_array(jsonb_build_object('action','rejected','actor',auth.uid(),'at',clock_timestamp(),'reason',current_setting('mahjong.review_reason',true),'previousSnapshot',old.approved_snapshot));
 elsif new.photo_data is distinct from old.photo_data or new.labels is distinct from old.labels or new.capture_group is distinct from old.capture_group or new.image_sha256 is distinct from old.image_sha256 or new.width is distinct from old.width or new.height is distinct from old.height then
  new.approved_by:=null;new.approved_at:=null;new.approved_payload:=null;new.approved_snapshot:=null;new.review_decision:=null;
  new.review_history:=old.review_history||jsonb_build_array(jsonb_build_object('action','edited','actor',auth.uid(),'at',clock_timestamp(),'previousSnapshot',old.approved_snapshot));
  if new.state='candidate' then new.state:='needs_admin';end if;
 elsif new.review_decision is distinct from old.review_decision or new.approved_by is distinct from old.approved_by or new.approved_at is distinct from old.approved_at or new.approved_payload is distinct from old.approved_payload or new.approved_snapshot is distinct from old.approved_snapshot then
  raise exception 'Approval fields are server controlled';
 end if;
 if new.state='candidate' and (new.approved_by is null or new.approved_snapshot is null) then raise exception 'Explicit administrator approval required';end if;
 return new;
end;
$$;
revoke all on function public.mahjong_training_approval_guard() from public,anon,authenticated;
drop trigger if exists mahjong_training_approval_guard on public.mahjong_training_jobs;
create trigger mahjong_training_approval_guard before insert or update on public.mahjong_training_jobs for each row execute function public.mahjong_training_approval_guard();

create or replace function public.mahjong_approve_training(p_id uuid,p_expected_labels jsonb,p_labels jsonb,p_capture_group text)
returns setof public.mahjong_training_jobs language plpgsql security invoker set search_path=public as $$
declare job public.mahjong_training_jobs; item jsonb; x numeric;y numeric;r numeric;b numeric;
begin
 if auth.uid() is null or not public.mahjong_sync_is_admin() then raise exception 'Administrator required';end if;
 if p_capture_group is null or length(trim(p_capture_group)) not between 1 and 200 then raise exception 'Capture session required';end if;
 select * into job from public.mahjong_training_jobs where id=p_id for update;
 if not found or job.state not in ('pending','waiting_quota','needs_admin','candidate') or job.labels is distinct from p_expected_labels then raise exception 'Photo changed; reload review';end if;
 if jsonb_typeof(p_labels) is distinct from 'array' or jsonb_array_length(p_labels) not between 1 and 26 then raise exception 'Complete labels required';end if;
 for item in select value from jsonb_array_elements(p_labels) loop
  if jsonb_typeof(item->'tile') is distinct from 'string' or (item->>'tile') !~ '^(char[1-9]|dot[1-9]|bam[1-9]|east|south|west|north|red|green|white|flower[1-4]|season[1-4])$' or jsonb_typeof(item->'box') is distinct from 'array' or jsonb_array_length(item->'box')<>4 then raise exception 'Invalid tile label';end if;
  if exists(select 1 from jsonb_array_elements(item->'box') v where jsonb_typeof(v) is distinct from 'number') then raise exception 'Numeric bounds required';end if;
  x:=(item->'box'->>0)::numeric;y:=(item->'box'->>1)::numeric;r:=(item->'box'->>2)::numeric;b:=(item->'box'->>3)::numeric;
  if x<0 or y<0 or r>job.width or b>job.height or r-x<2 or b-y<2 then raise exception 'Invalid tile bounds';end if;
 end loop;
 if exists(select 1 from jsonb_array_elements(p_labels) a group by a->>'tile' having count(*)>case when a->>'tile' ~ '^(flower|season)' then 1 else 4 end) then raise exception 'Too many matching tiles';end if;
 if exists(select 1 from jsonb_array_elements(p_labels) with ordinality a(v,i),jsonb_array_elements(p_labels) with ordinality b(v,i) where a.i<b.i and greatest(0,least((a.v->'box'->>2)::numeric,(b.v->'box'->>2)::numeric)-greatest((a.v->'box'->>0)::numeric,(b.v->'box'->>0)::numeric))*greatest(0,least((a.v->'box'->>3)::numeric,(b.v->'box'->>3)::numeric)-greatest((a.v->'box'->>1)::numeric,(b.v->'box'->>1)::numeric)) > .5*least(((a.v->'box'->>2)::numeric-(a.v->'box'->>0)::numeric)*((a.v->'box'->>3)::numeric-(a.v->'box'->>1)::numeric),((b.v->'box'->>2)::numeric-(b.v->'box'->>0)::numeric)*((b.v->'box'->>3)::numeric-(b.v->'box'->>1)::numeric))) then raise exception 'Overlapping tile bounds';end if;
 perform set_config('mahjong.admin_review','approve',true);
 return query update public.mahjong_training_jobs set labels=p_labels,capture_group=trim(p_capture_group),state='candidate',lease_until=null where id=p_id returning *;
 perform set_config('mahjong.admin_review','',true);
end;
$$;
revoke all on function public.mahjong_approve_training(uuid,jsonb,jsonb,text) from public,anon;
grant execute on function public.mahjong_approve_training(uuid,jsonb,jsonb,text) to authenticated;
grant update(capture_group) on public.mahjong_training_jobs to authenticated;
-- No backfill of approval: legacy candidate rows stay ineligible until explicitly reviewed.

create or replace function public.mahjong_reject_training(p_id uuid,p_expected_labels jsonb,p_expected_snapshot text,p_reason text)
returns setof public.mahjong_training_jobs language plpgsql security invoker set search_path=public as $$
declare job public.mahjong_training_jobs;
begin
 if auth.uid() is null or not public.mahjong_sync_is_admin() then raise exception 'Administrator required';end if;
 if p_reason is null or length(trim(p_reason)) not between 1 and 500 then raise exception 'Rejection reason required';end if;
 select * into job from public.mahjong_training_jobs where id=p_id for update;
 if not found or job.state not in ('pending','waiting_quota','needs_admin','candidate') or job.labels is distinct from p_expected_labels or job.approved_snapshot is distinct from p_expected_snapshot then raise exception 'Photo changed; reload review';end if;
 perform set_config('mahjong.admin_review','reject',true);perform set_config('mahjong.review_reason',trim(p_reason),true);
 return query update public.mahjong_training_jobs set state='needs_admin',lease_until=null where id=p_id returning *;
 perform set_config('mahjong.admin_review','',true);perform set_config('mahjong.review_reason','',true);
end;
$$;
revoke all on function public.mahjong_reject_training(uuid,jsonb,text,text) from public,anon;
grant execute on function public.mahjong_reject_training(uuid,jsonb,text,text) to authenticated;
