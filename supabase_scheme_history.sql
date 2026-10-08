-- MAHJONG SCORE | SQL SCHEMA HISTORY (ARCHIVE ONLY)
-- JANGAN jalankan file ini secara keseluruhan di SQL Editor.
-- Ini adalah arsip SQL v15.6.1, v15.6.24, v15.6.31, v15.6.33.


-- =================================================================
-- HISTORY: supabase_live_multitable_v15_6_1.sql
-- =================================================================
-- Mahjong Score v15.6.1: multi-table live score foundation
create table if not exists public.mahjong_live_games (
  id uuid primary key default gen_random_uuid(),
  table_name text not null default 'Meja',
  game_label text not null default '',
  scorekeeper_id uuid not null references auth.users(id) on delete cascade,
  viewer_token text not null unique,
  snapshot jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.mahjong_live_games enable row level security;
drop policy if exists "live games owner select" on public.mahjong_live_games;
create policy "live games owner select" on public.mahjong_live_games for select to authenticated using (scorekeeper_id=auth.uid());
drop policy if exists "live games owner insert" on public.mahjong_live_games;
create policy "live games owner insert" on public.mahjong_live_games for insert to authenticated with check (scorekeeper_id=auth.uid() and coalesce(auth.jwt()->'app_metadata'->>'role','') in ('admin','scorekeeper'));
drop policy if exists "live games owner update" on public.mahjong_live_games;
create policy "live games owner update" on public.mahjong_live_games for update to authenticated using (scorekeeper_id=auth.uid() and coalesce(auth.jwt()->'app_metadata'->>'role','') in ('admin','scorekeeper')) with check (scorekeeper_id=auth.uid());
create or replace function public.mahjong_get_live_game(p_token text)
returns table(table_name text, game_label text, snapshot jsonb, active boolean, updated_at timestamptz)
language sql security definer set search_path=public as $$
 select g.table_name,g.game_label,g.snapshot,g.active,g.updated_at from public.mahjong_live_games g where g.viewer_token=p_token limit 1;
$$;
revoke all on function public.mahjong_get_live_game(text) from public;
grant execute on function public.mahjong_get_live_game(text) to anon, authenticated;


-- =================================================================
-- HISTORY: supabase_live_unique_tables_v15_6_24.sql
-- =================================================================
-- Run once in Supabase SQL Editor before using v15.6.24 Live Sharing.
-- Existing duplicate active names must be resolved before creating the index.
-- List duplicates first:
select lower(btrim(table_name)) as name, count(*) from public.mahjong_live_games where active=true group by 1 having count(*)>1;
-- The unique index protects against simultaneous creation from separate devices.
create unique index if not exists mahjong_live_unique_active_table_name
on public.mahjong_live_games (lower(btrim(table_name))) where active=true;
-- Expose ONLY active table names and IDs to authenticated Score Keepers (no tokens/snapshots).
create or replace function public.mahjong_active_table_names()
returns table(id uuid, table_name text)
language sql security definer set search_path=public as $$
 select g.id,g.table_name from public.mahjong_live_games g where g.active=true;
$$;
revoke all on function public.mahjong_active_table_names() from public;
grant execute on function public.mahjong_active_table_names() to authenticated;


-- =================================================================
-- HISTORY: supabase_voice_diagnostic_v15_6_31.sql
-- =================================================================
-- Run once in Supabase SQL Editor before cloud reporting can upload.
-- Admin-only access enforced using signed JWT app_metadata.role.
create table if not exists public.mahjong_voice_diagnostics (
 id uuid primary key, user_id uuid not null references auth.users(id) on delete cascade,
 app_version text not null, language text not null, user_agent text not null,
 kind text not null check (kind in ('speech_test','speech_error','parser_self_test')),
 details jsonb not null, created_at timestamptz not null default now()
);
alter table public.mahjong_voice_diagnostics enable row level security;
revoke all on public.mahjong_voice_diagnostics from anon;
grant select, insert on public.mahjong_voice_diagnostics to authenticated;
drop policy if exists voice_diagnostic_admin_insert on public.mahjong_voice_diagnostics;
create policy voice_diagnostic_admin_insert on public.mahjong_voice_diagnostics for insert to authenticated
with check (user_id = (select auth.uid()) and (select auth.jwt())->'app_metadata'->>'role' = 'admin');
drop policy if exists voice_diagnostic_admin_select on public.mahjong_voice_diagnostics;
create policy voice_diagnostic_admin_select on public.mahjong_voice_diagnostics for select to authenticated
using ((select auth.jwt())->'app_metadata'->>'role' = 'admin');
create index if not exists mahjong_voice_diagnostics_created_idx on public.mahjong_voice_diagnostics(created_at desc);


-- =================================================================
-- HISTORY: supabase_ai_diagnostic_v15_6_33.sql
-- =================================================================
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


-- v15.6.36: Admin-only deletion of diagnostic reports; see supabase_latest.sql for current upgrade.

-- v15.6.38: Realtime publication for mahjong_ai_diagnostic_targets; see supabase_latest.sql.

-- v15.6.40: Admin-triggered on-demand diagnostic; see supabase_latest.sql.
-- ALTER TABLE public.mahjong_ai_diagnostic_targets ADD COLUMN request_id uuid, ADD COLUMN request_at timestamptz;
