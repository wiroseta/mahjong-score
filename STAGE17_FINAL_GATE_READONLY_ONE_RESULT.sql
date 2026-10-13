-- ONE RESULT SET; metadata only. Safe to run in Supabase SQL Editor.
-- No migration, no function calls, no data reads from Mahjong games.
WITH names(name) AS (VALUES
 ('mahjong_sync_account_permissions'),('mahjong_sync_generate_token'),
 ('mahjong_sync_is_admin'),('mahjong_sync_peek'),('mahjong_sync_valid_game'),
 ('mahjong_sync_open'),('mahjong_sync_commit'),('mahjong_sync_open_reader'),
 ('mahjong_sync_read'),('mahjong_sync_lease_status')
), f AS (
 SELECT p.oid,p.proname,p.prosecdef,p.proacl,p.proowner,p.proconfig,
        pg_get_function_identity_arguments(p.oid) AS arguments
 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public'
)
SELECT names.name AS rpc, COALESCE(f.oid IS NOT NULL,false) AS installed,
       COALESCE(f.arguments,'') AS arguments,
       CASE WHEN f.oid IS NULL THEN NULL ELSE pg_get_userbyid(f.proowner) END AS owner,
       f.prosecdef AS security_definer,
       CASE WHEN f.oid IS NULL THEN NULL ELSE EXISTS (
         SELECT 1 FROM aclexplode(COALESCE(f.proacl,acldefault('f',f.proowner))) acl
         WHERE acl.grantee=0 AND acl.privilege_type='EXECUTE'
       ) END AS public_execute_direct,
       CASE WHEN f.oid IS NULL THEN NULL ELSE has_function_privilege('anon',f.oid,'EXECUTE') END AS anon_effective_execute,
       CASE WHEN f.oid IS NULL THEN NULL ELSE has_function_privilege('authenticated',f.oid,'EXECUTE') END AS authenticated_effective_execute,
       f.proconfig AS function_config
FROM names LEFT JOIN f ON f.proname=names.name ORDER BY names.name, f.arguments;
