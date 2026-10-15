-- Mahjong Score Cloud Sync: READ-ONLY production preflight.
-- Safe to run in Supabase SQL Editor. No writes, no schema changes, no secrets.
-- Returns a single JSON object; share the result before any RPC deployment.
WITH required_tables(name) AS (
 VALUES ('mahjong_device_sessions'),('mahjong_game_states'),
        ('mahjong_sync_conflicts'),('mahjong_session_audit')
), table_checks AS (
 SELECT t.name, c.oid IS NOT NULL AS exists,
        COALESCE(c.relrowsecurity,false) AS rls_enabled,
        COALESCE(has_table_privilege('anon',c.oid,'SELECT'),false) AS anon_can_select,
        COALESCE(has_table_privilege('authenticated',c.oid,'SELECT'),false) AS authenticated_can_select,
        COALESCE(has_table_privilege('authenticated',c.oid,'INSERT'),false) AS authenticated_can_insert,
        COALESCE(has_table_privilege('authenticated',c.oid,'UPDATE'),false) AS authenticated_can_update
 FROM required_tables t
 LEFT JOIN pg_namespace n ON n.nspname='public'
 LEFT JOIN pg_class c ON c.relnamespace=n.oid AND c.relname=t.name AND c.relkind IN ('r','p')
), required_columns(table_name,column_name) AS (
 VALUES ('mahjong_device_sessions','auth_session_id'),
 ('mahjong_device_sessions','is_writer'),('mahjong_device_sessions','session_token_hash'),
 ('mahjong_device_sessions','revoked_at'),('mahjong_game_states','is_current')
), column_checks AS (
 SELECT table_name,column_name, EXISTS (
  SELECT 1 FROM information_schema.columns c WHERE c.table_schema='public'
   AND c.table_name=r.table_name AND c.column_name=r.column_name
 ) AS exists FROM required_columns r
), index_checks AS (
 SELECT i.indexname, i.indexdef,
        (i.indexname='mahjong_one_active_device_per_user') AS blocks_multi_device_readers
 FROM pg_indexes i
 WHERE i.schemaname='public' AND i.tablename IN ('mahjong_device_sessions','mahjong_game_states')
), index_requirements AS (
 SELECT EXISTS (SELECT 1 FROM index_checks WHERE indexname='mahjong_one_active_device_per_user') AS blocking_single_active_index_present,
        EXISTS (SELECT 1 FROM index_checks WHERE indexname='mahjong_game_states_one_current_per_owner_idx'
          AND indexdef ILIKE '%UNIQUE%' AND indexdef ILIKE '%owner_id%' AND indexdef ILIKE '%is_current%') AS current_game_unique_index_present,
        EXISTS (SELECT 1 FROM index_checks WHERE indexname='mahjong_device_sessions_user_idx') AS session_lookup_index_present
), required_rpc(name,args) AS (
 VALUES ('mahjong_sync_open','uuid,jsonb,bigint,uuid'),
        ('mahjong_sync_commit','uuid,uuid,bigint,text,bigint,jsonb'),
        ('mahjong_sync_open_reader','uuid'),
        ('mahjong_sync_peek',''),
        ('mahjong_sync_read','uuid'),
        ('mahjong_sync_lease_status','uuid,bigint')
), rpc_checks AS (
 SELECT r.name, r.args, p.oid IS NOT NULL AS installed,
        COALESCE(has_function_privilege('anon',p.oid,'EXECUTE'),false) AS anon_can_execute,
        COALESCE(has_function_privilege('authenticated',p.oid,'EXECUTE'),false) AS authenticated_can_execute,
        COALESCE(p.prosecdef,false) AS security_definer
 FROM required_rpc r
 LEFT JOIN pg_proc p ON p.oid=to_regprocedure('public.'||r.name||'('||r.args||')')
), required_functions(name,args) AS (
 VALUES ('mahjong_sync_account_permissions',''),
        ('mahjong_sync_generate_token',''),('mahjong_sync_is_admin','')
), function_checks AS (
 SELECT f.name, to_regprocedure('public.'||f.name||'('||f.args||')') IS NOT NULL AS exists
 FROM required_functions f
)
SELECT jsonb_pretty(jsonb_build_object(
 'tables', (SELECT jsonb_agg(to_jsonb(t) ORDER BY name) FROM table_checks t),
 'columns', (SELECT jsonb_agg(to_jsonb(c) ORDER BY table_name,column_name) FROM column_checks c),
 'indexes', (SELECT to_jsonb(i) FROM index_requirements i),
 'functions', (SELECT jsonb_agg(to_jsonb(f) ORDER BY name) FROM function_checks f),
 'rpc_inventory', (SELECT jsonb_agg(to_jsonb(r) ORDER BY name) FROM rpc_checks r),
 'rpc_already_installed', (SELECT jsonb_build_object(
  'open',to_regprocedure('public.mahjong_sync_open(uuid,jsonb,bigint,uuid)') IS NOT NULL,
  'commit',to_regprocedure('public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb)') IS NOT NULL,
  'peek',to_regprocedure('public.mahjong_sync_peek()') IS NOT NULL))
)) AS mahjong_sync_preflight;
