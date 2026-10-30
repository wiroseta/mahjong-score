-- Only the authenticated server handles invitation secrets. No browser table access.
create table public.mahjong_invitations (
 id uuid primary key default gen_random_uuid(),
 code_hash text not null unique,
 created_by uuid not null,
 created_at timestamptz not null default now(),
 expires_at timestamptz not null default now() + interval '7 days',
 status text not null default 'available' check (status in ('available','pending','used','revoked')),
 used_by uuid,
 used_at timestamptz
);
alter table public.mahjong_invitations enable row level security;
revoke all on public.mahjong_invitations from public, anon, authenticated;
grant select, insert, update on public.mahjong_invitations to service_role;
