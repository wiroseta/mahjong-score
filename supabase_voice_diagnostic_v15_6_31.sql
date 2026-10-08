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
