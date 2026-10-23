-- Administrator-requested pixel deletion, independent of training success.
-- Retain job identity, labels, review history and model run reports for audit.
alter table public.mahjong_training_jobs add column admin_deleted_at timestamptz, add column admin_deleted_by uuid;
alter table public.mahjong_training_jobs drop constraint mahjong_training_jobs_check1;
alter table public.mahjong_training_jobs add constraint mahjong_training_jobs_pixel_lifecycle check (
 (state='purged' and photo_data is null and slot is null and (
   (admin_deleted_at is not null and admin_deleted_by is not null) or
   (training_consumed and evaluation_complete and model_accepted and no_other_dataset_references and not keep_for_evaluation))) or
 (state<>'purged' and photo_data is not null and slot is not null and admin_deleted_at is null and admin_deleted_by is null)
);
create function public.mahjong_training_admin_delete_guard() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if TG_OP='INSERT' then
  if new.admin_deleted_at is not null or new.admin_deleted_by is not null then raise exception 'Deletion metadata is server controlled';end if;
 else
  if old.state='purged' then raise exception 'Deleted photo cannot be changed';end if;
  if new.admin_deleted_at is distinct from old.admin_deleted_at or new.admin_deleted_by is distinct from old.admin_deleted_by then
   if current_setting('mahjong.admin_delete',true) is distinct from 'true' or auth.uid() is null or not public.mahjong_sync_is_admin() or new.state<>'purged' or new.admin_deleted_by is distinct from auth.uid() then raise exception 'Deletion metadata is server controlled';end if;
  end if;
 end if;
 return new;
end;
$$;
revoke all on function public.mahjong_training_admin_delete_guard() from public,anon,authenticated;
create trigger mahjong_training_admin_delete_guard before insert or update on public.mahjong_training_jobs for each row execute function public.mahjong_training_admin_delete_guard();
-- Definer is limited to this checked operation: model-run lease/snapshot columns
-- are deliberately not exposed to browser roles. No new table write grant is made.
create function public.mahjong_delete_training_photo(p_id uuid,p_expected_labels jsonb,p_expected_snapshot text)
returns boolean language plpgsql security definer set search_path='' as $$
declare job public.mahjong_training_jobs;
begin
 if auth.uid() is null or not public.mahjong_sync_is_admin() then raise exception 'Administrator required';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('mahjong-model-training'));
 select * into job from public.mahjong_training_jobs where id=p_id for update;
 if not found or job.state='purged' or job.labels is distinct from p_expected_labels or job.approved_snapshot is distinct from p_expected_snapshot then raise exception 'Photo changed; reload review';end if;
 if job.state in ('analyzing','training') then raise exception 'Photo is being processed; try again after it finishes';end if;
 if exists(select 1 from public.mahjong_model_runs r where r.state='running' and r.lease_until>pg_catalog.now() and r.dataset_snapshot @> pg_catalog.jsonb_build_array(pg_catalog.jsonb_build_object('id',p_id))) then raise exception 'Photo is being used by training; try again after it finishes';end if;
 perform pg_catalog.set_config('mahjong.admin_delete','true',true);
 update public.mahjong_training_jobs set state='purged',photo_data=null,slot=null,lease_until=null,observations='[]'::jsonb,proposals='[]'::jsonb,admin_deleted_at=pg_catalog.clock_timestamp(),admin_deleted_by=auth.uid() where id=p_id;
 perform pg_catalog.set_config('mahjong.admin_delete','',true);
 return true;
end;
$$;
revoke all on function public.mahjong_delete_training_photo(uuid,jsonb,text) from public,anon;
grant execute on function public.mahjong_delete_training_photo(uuid,jsonb,text) to authenticated;
