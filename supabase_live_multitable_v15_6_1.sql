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
