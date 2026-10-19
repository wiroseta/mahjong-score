-- Additive schema for administrator-curated visual tile examples. No original photos or user identities.
create table public.mahjong_photo_examples (
 id text primary key check (id ~ '^[a-f0-9]{64}$'),
 batch_id uuid not null,
 label text not null check (label ~ '^(char[1-9]|dot[1-9]|bam[1-9]|east|south|west|north|red|green|white)$'),
 features smallint[] not null check (array_ndims(features)=1 and cardinality(features)=576 and array_position(features,null) is null and 0 <= all(features) and 255 >= all(features)),
 active boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.mahjong_photo_examples enable row level security;
revoke all on public.mahjong_photo_examples from anon,authenticated;
grant select,insert,update on public.mahjong_photo_examples to authenticated;
create policy photo_examples_member_read on public.mahjong_photo_examples for select to authenticated using (active and (select auth.uid()) is not null);
-- Existing helper checks the current auth.users app metadata on the server, not a client role flag or stale JWT role.
create policy photo_examples_admin_read on public.mahjong_photo_examples for select to authenticated using ((select public.mahjong_sync_is_admin()));
create policy photo_examples_admin_insert on public.mahjong_photo_examples for insert to authenticated with check ((select public.mahjong_sync_is_admin()));
create policy photo_examples_admin_update on public.mahjong_photo_examples for update to authenticated using ((select public.mahjong_sync_is_admin())) with check ((select public.mahjong_sync_is_admin()));
create index mahjong_photo_examples_active_created_idx on public.mahjong_photo_examples (created_at desc) where active;
create index mahjong_photo_examples_batch_idx on public.mahjong_photo_examples (batch_id);
