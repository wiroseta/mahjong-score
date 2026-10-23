-- Local deployment draft: server-only leases. No model activation endpoint here.
create table public.mahjong_model_runs (
 id uuid primary key default gen_random_uuid(),
 dataset_key text not null,
 config_revision text not null,
 dataset_snapshot jsonb not null,
 runner_id text not null,
 lease_token uuid not null default gen_random_uuid(),
 lease_until timestamptz not null,
 state text not null default 'running' check(state in ('running','rejected','failed','active')),
 stage text not null default 'claimed',
 reason text,
 report jsonb,
 created_at timestamptz not null default now(),
 finished_at timestamptz
);
alter table public.mahjong_model_runs enable row level security;
revoke all on public.mahjong_model_runs from public,anon,authenticated;
grant select(id,dataset_key,state,stage,reason,created_at,finished_at) on public.mahjong_model_runs to authenticated;
create policy model_run_admin_read on public.mahjong_model_runs for select to authenticated using((select public.mahjong_sync_is_admin()));
grant all on public.mahjong_model_runs to service_role;
grant select on public.mahjong_training_jobs to service_role;

create function public.mahjong_claim_model_run(p_runner text,p_lease_seconds integer default 600,p_config_revision text default repeat('0',64))
returns setof public.mahjong_model_runs language plpgsql security invoker set search_path=public as $$
declare snapshot jsonb; fingerprint text;
begin
 if p_config_revision is null or p_config_revision !~ '^[a-f0-9]{64}$' then raise exception 'Invalid evaluation configuration';end if;
 if p_runner is null or length(p_runner) not between 1 and 100 or p_lease_seconds not between 60 and 1800 then raise exception 'Invalid runner lease';end if;
 perform pg_advisory_xact_lock(hashtext('mahjong-model-training'));
 update public.mahjong_model_runs set state='failed',reason='lease-expired',finished_at=now() where state='running' and lease_until<=now();
 if exists(select 1 from public.mahjong_model_runs where state='running') then return;end if;
 select jsonb_agg(jsonb_build_object('id',id,'snapshot',approved_snapshot) order by id) into snapshot from public.mahjong_training_jobs where state='candidate' and approved_by is not null and approved_snapshot is not null and photo_data is not null;
 if snapshot is null then return;end if;
 fingerprint:=encode(sha256(convert_to(p_config_revision||':'||snapshot::text,'UTF8')),'hex');
 if exists(select 1 from public.mahjong_model_runs where dataset_key=fingerprint and state in ('active','rejected')) or (select count(*) from public.mahjong_model_runs where dataset_key=fingerprint and state='failed' and created_at>now()-interval '1 day')>=3 then return;end if;
 return query insert into public.mahjong_model_runs(dataset_key,config_revision,dataset_snapshot,runner_id,lease_until) values(fingerprint,p_config_revision,snapshot,p_runner,now()+make_interval(secs=>p_lease_seconds)) returning *;
end;
$$;
revoke all on function public.mahjong_claim_model_run(text,integer,text) from public,anon,authenticated;
grant execute on function public.mahjong_claim_model_run(text,integer,text) to service_role;

create function public.mahjong_renew_model_run(p_id uuid,p_token uuid,p_lease_seconds integer default 600)
returns boolean language plpgsql security invoker set search_path=public as $$
declare changed integer;
begin
 if p_lease_seconds not between 60 and 1800 then raise exception 'Invalid runner lease';end if;
 update public.mahjong_model_runs set lease_until=now()+make_interval(secs=>p_lease_seconds) where id=p_id and lease_token=p_token and state='running' and lease_until>now();get diagnostics changed=row_count;return changed=1;
end;
$$;
revoke all on function public.mahjong_renew_model_run(uuid,uuid,integer) from public,anon,authenticated;
grant execute on function public.mahjong_renew_model_run(uuid,uuid,integer) to service_role;

create function public.mahjong_finish_model_run(p_id uuid,p_token uuid,p_state text,p_stage text,p_reason text,p_report jsonb default null)
returns boolean language plpgsql security invoker set search_path=public as $$
declare changed integer;
begin
 if p_state not in ('failed','rejected') or p_stage is null or length(p_stage)>100 or p_reason is null or length(p_reason)>100 or (p_report is not null and octet_length(p_report::text)>60000) then raise exception 'Invalid run result';end if;
 update public.mahjong_model_runs set state=p_state,stage=p_stage,reason=p_reason,report=p_report,finished_at=now() where id=p_id and lease_token=p_token and state='running' and lease_until>now();get diagnostics changed=row_count;return changed=1;
end;
$$;
revoke all on function public.mahjong_finish_model_run(uuid,uuid,text,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.mahjong_finish_model_run(uuid,uuid,text,text,text,jsonb) to service_role;

create function public.mahjong_progress_model_run(p_id uuid,p_token uuid,p_stage text)
returns boolean language plpgsql security invoker set search_path=public as $$
declare changed integer;
begin
 if p_stage is null or p_stage not in ('evaluation-preflight','training','validating-artifact','evaluating','checking-approvals','staging-artifact','activating') then raise exception 'Invalid pipeline stage';end if;
 update public.mahjong_model_runs set stage=p_stage where id=p_id and lease_token=p_token and state='running' and lease_until>now();get diagnostics changed=row_count;return changed=1;
end;
$$;
revoke all on function public.mahjong_progress_model_run(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.mahjong_progress_model_run(uuid,uuid,text) to service_role;

create function public.mahjong_model_run_owned(p_id uuid,p_token uuid)
returns boolean language sql stable security invoker set search_path=public as $$
 select exists(select 1 from public.mahjong_model_runs where id=p_id and lease_token=p_token and state='running' and lease_until>now())
$$;
revoke all on function public.mahjong_model_run_owned(uuid,uuid) from public,anon,authenticated;
grant execute on function public.mahjong_model_run_owned(uuid,uuid) to service_role;
