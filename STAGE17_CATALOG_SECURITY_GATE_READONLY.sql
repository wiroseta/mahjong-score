-- STAGE 17: catalog-only security gate; SELECT statements only.
-- Run in Supabase SQL Editor; no functions/tables/roles are modified.
-- PASS means catalog prerequisites, NOT runtime safety or permission to deploy.
WITH required(name) AS (VALUES
 ('mahjong_device_sessions'),('mahjong_game_states'),
 ('mahjong_session_audit'),('mahjong_sync_conflicts')
), catalog AS (
 SELECT r.name, c.oid, c.relrowsecurity, c.relforcerowsecurity
 FROM required r LEFT JOIN pg_namespace n ON n.nspname='public'
 LEFT JOIN pg_class c ON c.relnamespace=n.oid AND c.relname=r.name AND c.relkind IN ('r','p')
) SELECT 'table_rls' AS gate, name AS item,
 CASE WHEN oid IS NULL THEN 'MISSING' WHEN NOT relrowsecurity THEN 'FAIL_RLS_OFF' ELSE 'PASS' END AS status
FROM catalog
UNION ALL
SELECT 'function', r.name, CASE WHEN p.oid IS NULL THEN 'NOT_INSTALLED'
 WHEN NOT p.prosecdef THEN 'CHECK_NON_DEFINER'
 WHEN p.proconfig IS NULL OR NOT ('search_path=' = ANY(p.proconfig)) THEN 'FAIL_SEARCH_PATH'
 ELSE 'PRESENT_REVIEW_PRIVILEGES' END
FROM (VALUES ('mahjong_sync_peek'),('mahjong_sync_valid_game'),('mahjong_sync_open'),
 ('mahjong_sync_commit'),('mahjong_sync_open_reader'),('mahjong_sync_read'),
 ('mahjong_sync_lease_status')) r(name)
LEFT JOIN pg_namespace n ON n.nspname='public'
LEFT JOIN pg_proc p ON p.pronamespace=n.oid AND p.proname=r.name
ORDER BY gate,item;
-- Explicit privileges on every overload; identify unintended PUBLIC / anon grants.
SELECT p.proname, pg_get_function_identity_arguments(p.oid) AS args,
 p.prosecdef AS security_definer, p.proconfig AS config,
 has_function_privilege('anon',p.oid,'EXECUTE') AS anon_can_execute,
 has_function_privilege('authenticated',p.oid,'EXECUTE') AS authenticated_can_execute,
 (COALESCE(p.proacl::text,'') LIKE '%=X/%') AS explicit_public_grant_heuristic
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname LIKE 'mahjong_sync_%'
ORDER BY p.proname,args;
