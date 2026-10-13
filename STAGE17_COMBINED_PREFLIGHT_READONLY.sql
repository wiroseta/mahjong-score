-- READ-ONLY catalog inspection: no DDL, DML or session impersonation.
SELECT p.proname, pg_get_function_identity_arguments(p.oid) AS arguments,
       p.prosecdef AS security_definer, p.provolatile AS volatility,
       pg_get_userbyid(p.proowner) AS owner,
       p.proconfig AS settings
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname IN
('mahjong_sync_valid_game','mahjong_sync_open','mahjong_sync_commit',
 'mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status','mahjong_sync_peek')
ORDER BY p.proname, arguments;
SELECT c.relname, c.relrowsecurity AS rls_enabled, c.relforcerowsecurity AS force_rls
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relname IN
('mahjong_device_sessions','mahjong_game_states','mahjong_sync_conflicts','mahjong_session_audit')
AND c.relkind IN ('r','p') ORDER BY c.relname;
SELECT routine_name, grantee, privilege_type
FROM information_schema.routine_privileges
WHERE specific_schema='public' AND routine_name LIKE 'mahjong_sync_%'
ORDER BY routine_name, grantee;
