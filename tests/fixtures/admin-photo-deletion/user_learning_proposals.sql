-- Local schema draft. Untrusted user feedback is separate from administrator labels.
create table public.mahjong_user_confirmations (
 job_id uuid primary key references public.mahjong_training_jobs(id) on delete cascade,
 owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 observations jsonb not null check(jsonb_typeof(observations)='array' and jsonb_array_length(observations) between 1 and 26 and octet_length(observations::text)<=30000),
 updated_at timestamptz not null default now()
);
alter table public.mahjong_user_confirmations enable row level security;
revoke all on public.mahjong_user_confirmations from public,anon,authenticated;
grant select,insert on public.mahjong_user_confirmations to authenticated;
grant update(observations,updated_at) on public.mahjong_user_confirmations to authenticated;
create policy confirmation_read on public.mahjong_user_confirmations for select to authenticated using(owner_id=(select auth.uid()) or (select public.mahjong_sync_is_admin()));
create policy confirmation_insert on public.mahjong_user_confirmations for insert to authenticated with check(owner_id=(select auth.uid()) and updated_at between now()-interval '1 minute' and now()+interval '1 minute' and exists(select 1 from public.mahjong_training_jobs j where j.id=job_id and j.owner_id=(select auth.uid()) and j.photo_data is not null));
create policy confirmation_update on public.mahjong_user_confirmations for update to authenticated using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()) and updated_at between now()-interval '1 minute' and now()+interval '1 minute' and exists(select 1 from public.mahjong_training_jobs j where j.id=job_id and j.owner_id=(select auth.uid()) and j.photo_data is not null));
create function public.mahjong_submit_confirmation(p_job_id uuid,p_observations jsonb)
returns uuid language plpgsql security invoker set search_path=public as $$
begin
 if auth.uid() is null then raise exception 'Login required';end if;
 if not exists(select 1 from public.mahjong_training_jobs where id=p_job_id and owner_id=auth.uid() and photo_data is not null) then raise exception 'Photo not owned by current account';end if;
 insert into public.mahjong_user_confirmations(job_id,observations) values(p_job_id,p_observations)
 on conflict(job_id) do update set observations=excluded.observations,updated_at=now();
 return p_job_id;
end;
$$;
revoke all on function public.mahjong_submit_confirmation(uuid,jsonb) from public,anon;
grant execute on function public.mahjong_submit_confirmation(uuid,jsonb) to authenticated;
