-- Apply once to existing installations. New installations use invitations.sql.
alter table public.mahjong_invitations alter column expires_at set default (now() + interval '15 minutes');
update public.mahjong_invitations set expires_at=least(expires_at,created_at + interval '15 minutes') where status='available';
