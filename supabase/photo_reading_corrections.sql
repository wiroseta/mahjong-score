-- Complete administrator-approved geometry/labels for an identical photo.
-- No photo pixels, filenames, player names or account identifiers are stored.
create function public.mahjong_valid_photo_correction(data jsonb,w integer,h integer)
returns boolean language sql immutable set search_path=pg_catalog as $$
 select case when jsonb_typeof(data) is distinct from 'array' then false else
 jsonb_array_length(data) between 1 and 26 and not exists (
 select 1 from jsonb_array_elements(data) a where
 jsonb_typeof(a) is distinct from 'object' or coalesce(a->>'tile','') !~ '^(char[1-9]|dot[1-9]|bam[1-9]|east|south|west|north|red|green|white|flower)$' or
 case when jsonb_typeof(a->'box') is distinct from 'array' or jsonb_array_length(a->'box') <> 4 then true else
 case when jsonb_typeof(a->'box'->0)='number' and jsonb_typeof(a->'box'->1)='number' and jsonb_typeof(a->'box'->2)='number' and jsonb_typeof(a->'box'->3)='number' then not ((a->'box'->>0)::numeric>=0 and (a->'box'->>1)::numeric>=0 and (a->'box'->>2)::numeric>(a->'box'->>0)::numeric and (a->'box'->>3)::numeric>(a->'box'->>1)::numeric and (a->'box'->>2)::numeric<=w and (a->'box'->>3)::numeric<=h) else true end end
 ) end
$$;
revoke all on function public.mahjong_valid_photo_correction(jsonb,integer,integer) from public;
grant execute on function public.mahjong_valid_photo_correction(jsonb,integer,integer) to authenticated;
create table public.mahjong_photo_corrections (
 image_sha256 text primary key check(image_sha256 ~ '^[a-f0-9]{64}$'),
 pipeline text not null check(pipeline='mahjong-local-v2'),
 batch_id uuid not null,
 width integer not null check(width between 1 and 40000),
 height integer not null check(height between 1 and 40000 and width::bigint*height<=40000000),
 region jsonb,
 annotations jsonb not null check(public.mahjong_valid_photo_correction(annotations,width,height)),
 active boolean not null default false,
 created_at timestamptz not null default now(),
 check(region is null or public.mahjong_valid_photo_correction(jsonb_build_array(jsonb_build_object('tile','east','box',region)),width,height))
);
alter table public.mahjong_photo_corrections enable row level security;
revoke all on public.mahjong_photo_corrections from anon,authenticated;
grant select,insert,update on public.mahjong_photo_corrections to authenticated;
create policy photo_corrections_member_read on public.mahjong_photo_corrections for select to authenticated using(active and (select auth.uid()) is not null);
create policy photo_corrections_admin_read on public.mahjong_photo_corrections for select to authenticated using((select public.mahjong_sync_is_admin()));
create policy photo_corrections_admin_insert on public.mahjong_photo_corrections for insert to authenticated with check((select public.mahjong_sync_is_admin()));
create policy photo_corrections_admin_update on public.mahjong_photo_corrections for update to authenticated using((select public.mahjong_sync_is_admin())) with check((select public.mahjong_sync_is_admin()));
create index mahjong_photo_corrections_batch_idx on public.mahjong_photo_corrections(batch_id);
-- Activating/deactivating descriptors and complete corrections is one transaction.
create function public.mahjong_set_photo_batch_active(batch uuid,enabled boolean)
returns void language plpgsql security invoker set search_path=public,pg_catalog as $$
begin
 if not public.mahjong_sync_is_admin() then raise exception 'Administrator required' using errcode='42501'; end if;
 update public.mahjong_photo_examples set active=enabled where batch_id=batch;
 update public.mahjong_photo_corrections set active=enabled where batch_id=batch;
end;
$$;
revoke all on function public.mahjong_set_photo_batch_active(uuid,boolean) from public,anon;
grant execute on function public.mahjong_set_photo_batch_active(uuid,boolean) to authenticated;
