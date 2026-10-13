-- Stage 14: READ ONLY pg_proc signature inventory. No schema/data changes.
-- Export the resulting JSON array and feed it to stage14-review-rpc-overloads.cjs.
-- search_path_safe is conservative: only explicitly fixed pg_catalog/public paths pass.
WITH target(name) AS (VALUES
 ('mahjong_sync_open'),('mahjong_sync_commit'),('mahjong_sync_open_reader'),
 ('mahjong_sync_read'),('mahjong_sync_lease_status')
), inventory AS (
 SELECT n.nspname AS schema_name, p.proname AS function_name,
 pg_get_function_identity_arguments(p.oid) AS identity_arguments,
 p.prokind AS function_kind, p.prosecdef AS security_definer,
 EXISTS (
  SELECT 1 FROM unnest(coalesce(p.proconfig,ARRAY[]::text[])) AS cfg(setting)
  WHERE setting IN ('search_path=pg_catalog, public','search_path=pg_catalog,public',
                    'search_path=public, pg_catalog','search_path=public,pg_catalog',
                    'search_path=pg_catalog')
 ) AS search_path_safe
 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 JOIN target t ON t.name=p.proname
)
SELECT coalesce(jsonb_agg(to_jsonb(inventory) ORDER BY schema_name,function_name,identity_arguments),'[]'::jsonb)
AS rpc_signature_evidence FROM inventory;
