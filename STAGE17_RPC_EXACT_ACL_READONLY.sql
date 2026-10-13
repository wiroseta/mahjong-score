-- Stage 17: Exact RPC ACL inspection (READ ONLY). No changes to database.
-- Note: PUBLIC grants do not imply anon can execute if anon role is not a member / ACL differs.
WITH funcs AS (
 SELECT p.oid, p.proname, pg_get_function_identity_arguments(p.oid) AS args,
        p.proacl, p.proowner, p.prosecdef, p.proconfig
 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname LIKE 'mahjong_sync_%'
), acl AS (
 SELECT f.oid, a.grantee, a.grantor, a.privilege_type, a.is_grantable
 FROM funcs f CROSS JOIN LATERAL aclexplode(COALESCE(f.proacl, acldefault('f',f.proowner))) a
)
SELECT f.proname, f.args, pg_get_userbyid(f.proowner) AS owner,
       f.prosecdef AS security_definer,
       COALESCE('search_path=' = ANY(f.proconfig),false) AS empty_search_path,
       has_function_privilege('anon',f.oid,'EXECUTE') AS anon_execute,
       has_function_privilege('authenticated',f.oid,'EXECUTE') AS authenticated_execute,
       EXISTS (SELECT 1 FROM acl a WHERE a.oid=f.oid AND a.grantee=0 AND a.privilege_type='EXECUTE') AS public_execute,
       COALESCE((SELECT string_agg(CASE WHEN a.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(a.grantee) END || ':' || a.privilege_type || CASE WHEN a.is_grantable THEN ':GRANTABLE' ELSE '' END, ', ' ORDER BY a.grantee)
                 FROM acl a WHERE a.oid=f.oid),'') AS effective_acl_entries
FROM funcs f ORDER BY f.proname,f.args;

-- Required tables and RLS: output independently from the function query.
WITH required(name) AS (VALUES ('mahjong_device_sessions'),('mahjong_game_states'),('mahjong_session_audit'),('mahjong_sync_conflicts'))
SELECT r.name, c.oid IS NOT NULL AS exists, COALESCE(c.relrowsecurity,false) AS rls_enabled,
       COALESCE(c.relforcerowsecurity,false) AS rls_forced,
       COALESCE((SELECT count(*) FROM pg_policy po WHERE po.polrelid=c.oid),0) AS policy_count
FROM required r LEFT JOIN pg_namespace n ON n.nspname='public'
LEFT JOIN pg_class c ON c.relnamespace=n.oid AND c.relname=r.name AND c.relkind IN ('r','p')
ORDER BY r.name;
