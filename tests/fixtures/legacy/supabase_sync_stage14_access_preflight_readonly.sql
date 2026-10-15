-- STAGE14 READ ONLY. Run separately; never deploy candidate SQL.
-- Checks direct table privileges, RLS policies, uniqueness of current game,
-- and executable privileges for sync RPCs. Does not read game data.
WITH expected_tables(name) AS (
 VALUES ('mahjong_device_sessions'),('mahjong_game_states'),
        ('mahjong_sync_conflicts'),('mahjong_session_audit')
), target_tables AS (
 SELECT c.oid, c.relname, c.relrowsecurity,
        c.relforcerowsecurity
 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='public' AND c.relname IN
 ('mahjong_device_sessions','mahjong_game_states','mahjong_sync_conflicts','mahjong_session_audit')
 AND c.relkind IN ('r','p')
), presence AS (
 SELECT 'TABLE_PRESENCE'::text AS category, e.name::text AS object_name,
  jsonb_build_object('installed',t.oid IS NOT NULL) AS details
 FROM expected_tables e LEFT JOIN target_tables t ON t.relname=e.name
), grants AS (
 SELECT 'TABLE_PRIVILEGE'::text AS category, t.relname::text AS object_name,
  jsonb_build_object('rls',t.relrowsecurity,'forced',t.relforcerowsecurity,
   'anon_select',has_table_privilege('anon',t.oid,'SELECT'),
   'anon_insert',has_table_privilege('anon',t.oid,'INSERT'),
   'anon_update',has_table_privilege('anon',t.oid,'UPDATE'),
   'anon_delete',has_table_privilege('anon',t.oid,'DELETE'),
   'authenticated_select',has_table_privilege('authenticated',t.oid,'SELECT'),
   'authenticated_insert',has_table_privilege('authenticated',t.oid,'INSERT'),
   'authenticated_update',has_table_privilege('authenticated',t.oid,'UPDATE'),
   'authenticated_delete',has_table_privilege('authenticated',t.oid,'DELETE')) AS details
 FROM target_tables t
), policies AS (
 SELECT 'POLICY'::text AS category, tablename || '.' || policyname AS object_name,
  jsonb_build_object('cmd',cmd,'roles',roles,'using',qual,'check',with_check) AS details
 FROM pg_policies WHERE schemaname='public' AND tablename IN (SELECT relname FROM target_tables)
), indexes AS (
 SELECT 'INDEX'::text AS category, i.indexname AS object_name,
  jsonb_build_object('table',i.tablename,'definition',i.indexdef) AS details
 FROM pg_indexes i WHERE i.schemaname='public' AND i.tablename IN (SELECT relname FROM target_tables)
), rpcs AS (
 SELECT 'RPC_PRIVILEGE'::text AS category,
  p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' AS object_name,
  jsonb_build_object('security_definer',p.prosecdef,
   'anon_execute',has_function_privilege('anon',p.oid,'EXECUTE'),
   'authenticated_execute',has_function_privilege('authenticated',p.oid,'EXECUTE')) AS details
 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname LIKE 'mahjong_sync_%'
)
SELECT * FROM presence UNION ALL SELECT * FROM grants UNION ALL SELECT * FROM policies UNION ALL
SELECT * FROM indexes UNION ALL SELECT * FROM rpcs
ORDER BY category,object_name;

-- Stage14 schema alignment (second read-only result set).
-- Missing columns are visible even when the table itself is absent.
WITH required_columns(table_name,column_name) AS (
 VALUES
 ('mahjong_device_sessions','auth_session_id'),
 ('mahjong_device_sessions','auth_session_created_at'),
 ('mahjong_device_sessions','ever_writer'),
 ('mahjong_device_sessions','session_generation'),
 ('mahjong_device_sessions','session_token_hash'),
 ('mahjong_game_states','is_current'),
 ('mahjong_game_states','revision'),
 ('mahjong_game_states','writer_session_id')
), column_inventory AS (
 SELECT c.table_name,c.column_name,c.data_type,c.column_default
 FROM information_schema.columns c
 WHERE c.table_schema='public'
)
SELECT r.table_name,r.column_name,
       (i.column_name IS NOT NULL) AS installed,
       i.data_type,i.column_default
FROM required_columns r
LEFT JOIN column_inventory i
 ON i.table_name=r.table_name AND i.column_name=r.column_name
ORDER BY r.table_name,r.column_name;
