-- MAHJONG SCORE v15.6.33 | CURRENT DATABASE UPGRADE ONLY
-- Jalankan file ini SATU KALI di Supabase SQL Editor setelah schema v15.6.31 terpasang.
-- File ini tidak mengulang migrasi lama. Backup database sebelum menjalankan.
-- Riwayat SQL lama tersedia di supabase_scheme_history.sql (JANGAN jalankan semuanya).

-- Run after existing v15.6.31 schema. Admin authorization derives from auth.users app_metadata.
create table if not exists public.mahjong_ai_diagnostic_targets (
 user_id uuid primary key references auth.users(id) on delete cascade,
 enabled boolean not null default false,
 updated_by uuid references auth.users(id),
 updated_at timestamptz not null default now()
);
create table if not exists public.mahjong_ai_diagnostic_reports (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 device_id text not null,
 app_version text not null,
 report jsonb not null,
 ai_result jsonb,
 created_at timestamptz not null default now(),
 constraint diagnostic_report_size check (octet_length(report::text) <= 16000)
);
create index if not exists mahjong_ai_reports_created on public.mahjong_ai_diagnostic_reports(created_at desc);
alter table public.mahjong_ai_diagnostic_targets enable row level security;
alter table public.mahjong_ai_diagnostic_reports enable row level security;
create or replace function public.mahjong_diagnostic_is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select coalesce((select raw_app_meta_data->>'role'='admin' from auth.users where id=auth.uid()),false)
$$;
revoke all on function public.mahjong_diagnostic_is_admin() from public;
grant execute on function public.mahjong_diagnostic_is_admin() to authenticated;
drop policy if exists diag_target_read on public.mahjong_ai_diagnostic_targets;
create policy diag_target_read on public.mahjong_ai_diagnostic_targets for select to authenticated using (user_id=auth.uid() or public.mahjong_diagnostic_is_admin());
drop policy if exists diag_target_admin_insert on public.mahjong_ai_diagnostic_targets;
create policy diag_target_admin_insert on public.mahjong_ai_diagnostic_targets for insert to authenticated with check (public.mahjong_diagnostic_is_admin() and updated_by=auth.uid());
drop policy if exists diag_target_admin_update on public.mahjong_ai_diagnostic_targets;
create policy diag_target_admin_update on public.mahjong_ai_diagnostic_targets for update to authenticated using (public.mahjong_diagnostic_is_admin()) with check (public.mahjong_diagnostic_is_admin() and updated_by=auth.uid());
drop policy if exists diag_report_read on public.mahjong_ai_diagnostic_reports;
create policy diag_report_read on public.mahjong_ai_diagnostic_reports for select to authenticated using (public.mahjong_diagnostic_is_admin());
drop policy if exists diag_report_insert on public.mahjong_ai_diagnostic_reports;
create policy diag_report_insert on public.mahjong_ai_diagnostic_reports for insert to authenticated with check (user_id=auth.uid() and (public.mahjong_diagnostic_is_admin() or exists(select 1 from public.mahjong_ai_diagnostic_targets where user_id=auth.uid() and enabled)));
revoke all on public.mahjong_ai_diagnostic_targets, public.mahjong_ai_diagnostic_reports from anon;
grant select,insert,update on public.mahjong_ai_diagnostic_targets to authenticated;
grant select,insert on public.mahjong_ai_diagnostic_reports to authenticated;
