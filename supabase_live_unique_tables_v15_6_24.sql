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
