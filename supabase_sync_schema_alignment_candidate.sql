-- v15.7.15 STAGING CANDIDATE ONLY — DO NOT DEPLOY.
-- Review and test in a disposable PostgreSQL/Supabase environment first.
-- Deliberate unconditional guard: must stop execution before any DDL; never run statements separately.
DO $$ BEGIN RAISE EXCEPTION 'UNSAFE SCHEMA ALIGNMENT CANDIDATE — DO NOT EXECUTE'; END $$;
BEGIN;
-- All operations below are intentionally unreachable while guard remains.
-- Historical games may legitimately share an owner. Do not reject or modify archives.
-- Existing rows are deliberately left non-current; selection requires a separately
-- reviewed, explicit reconciliation. Only multiple already-current games are unsafe.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM public.mahjong_game_states WHERE is_current=true
            GROUP BY owner_id HAVING count(*) > 1) THEN
  RAISE EXCEPTION 'Multiple current games per owner: manual is_current reconciliation required';
 END IF;
END $$;
-- Preserve existing sessions, but drop the index that blocks permitted multi-device readers.
-- Writer exclusivity must be enforced atomically in RPC with owner row lock,
-- never by this legacy active-session index.
-- Never drop an index solely by name. A reused name could belong to an
-- unrelated table or enforce a different invariant; require the legacy shape.
DO $$ BEGIN
 IF EXISTS (
   SELECT 1 FROM pg_catalog.pg_class idx
   JOIN pg_catalog.pg_namespace ins ON ins.oid=idx.relnamespace
   WHERE ins.nspname='public' AND idx.relname='mahjong_one_active_device_per_user'
 ) AND NOT EXISTS (
   SELECT 1 FROM pg_catalog.pg_index i
   JOIN pg_catalog.pg_class idx ON idx.oid=i.indexrelid
   JOIN pg_catalog.pg_namespace ins ON ins.oid=idx.relnamespace
   JOIN pg_catalog.pg_am am ON am.oid=idx.relam
   JOIN pg_catalog.pg_class tbl ON tbl.oid=i.indrelid
   JOIN pg_catalog.pg_namespace tns ON tns.oid=tbl.relnamespace
   JOIN pg_catalog.pg_attribute col ON col.attrelid=tbl.oid AND col.attnum=i.indkey[0]
   WHERE ins.nspname='public' AND idx.relname='mahjong_one_active_device_per_user'
     AND tns.nspname='public' AND tbl.relname='mahjong_device_sessions'
     AND i.indisunique AND i.indisvalid AND i.indisready AND i.indnkeyatts=1
     AND i.indnatts=1 AND i.indexprs IS NULL AND am.amname='btree'
     AND col.attname='user_id'
     AND pg_catalog.pg_get_expr(i.indpred,i.indrelid) IN ('is_active','(is_active = true)')
 ) THEN
   RAISE EXCEPTION 'Legacy active-device index definition mismatch; manual review required';
 END IF;
END $$;
DROP INDEX IF EXISTS public.mahjong_one_active_device_per_user;
ALTER TABLE public.mahjong_device_sessions ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
ALTER TABLE public.mahjong_device_sessions ADD COLUMN IF NOT EXISTS is_writer boolean NOT NULL DEFAULT false;
ALTER TABLE public.mahjong_device_sessions ADD COLUMN IF NOT EXISTS session_token_hash text;
ALTER TABLE public.mahjong_device_sessions ADD COLUMN IF NOT EXISTS revoked_at timestamptz;
-- ADD COLUMN IF NOT EXISTS is name-based only. A pre-existing column with the
-- wrong type/nullability must stop migration rather than silently corrupt leases.
DO $$ BEGIN
 IF EXISTS (
   SELECT 1 FROM (VALUES
     ('mahjong_game_states','is_current','boolean',true),
     ('mahjong_device_sessions','auth_session_id','uuid',false),
     ('mahjong_device_sessions','auth_session_created_at','timestamp with time zone',false),
     ('mahjong_device_sessions','is_writer','boolean',true),
     ('mahjong_device_sessions','session_token_hash','text',false),
     ('mahjong_device_sessions','revoked_at','timestamp with time zone',false)
   ) expected(table_name,column_name,type_name,must_not_null)
   LEFT JOIN pg_catalog.pg_namespace ns ON ns.nspname='public'
   LEFT JOIN pg_catalog.pg_class tbl ON tbl.relnamespace=ns.oid AND tbl.relname=expected.table_name AND tbl.relkind IN ('r','p')
   LEFT JOIN pg_catalog.pg_attribute attr ON attr.attrelid=tbl.oid AND attr.attname=expected.column_name AND attr.attnum>0 AND NOT attr.attisdropped
   WHERE attr.attnum IS NULL OR pg_catalog.format_type(attr.atttypid,attr.atttypmod)<>expected.type_name
      OR (expected.must_not_null AND NOT attr.attnotnull)
 ) THEN
   RAISE EXCEPTION 'Sync schema column type/nullability mismatch; manual review required';
 END IF;
END $$;
-- Existing historical games remain non-current unless explicitly reconciled.
-- A game must be explicitly selected as current in a separately reviewed migration.
CREATE UNIQUE INDEX IF NOT EXISTS mahjong_game_states_one_current_per_owner_idx
 ON public.mahjong_game_states(owner_id) WHERE is_current = true;
-- IF NOT EXISTS only checks an index name; it does not validate its definition.
-- Abort atomically if an unrelated/non-unique index occupies the required name.
DO $$ BEGIN
 IF NOT EXISTS (
  SELECT 1 FROM pg_catalog.pg_index i
  JOIN pg_catalog.pg_class idx ON idx.oid=i.indexrelid
  JOIN pg_catalog.pg_namespace idx_ns ON idx_ns.oid=idx.relnamespace
  JOIN pg_catalog.pg_am am ON am.oid=idx.relam
  JOIN pg_catalog.pg_class tbl ON tbl.oid=i.indrelid
  JOIN pg_catalog.pg_namespace ns ON ns.oid=tbl.relnamespace
  JOIN pg_catalog.pg_attribute col ON col.attrelid=tbl.oid AND col.attnum=i.indkey[0]
  WHERE ns.nspname='public' AND idx_ns.nspname='public' AND tbl.relname='mahjong_game_states'
    AND idx.relname='mahjong_game_states_one_current_per_owner_idx'
    AND i.indisunique AND i.indisvalid AND i.indisready
    AND i.indnkeyatts=1 AND col.attname='owner_id'
    AND i.indnatts=1 AND i.indexprs IS NULL AND am.amname='btree'
    AND pg_catalog.pg_get_expr(i.indpred,i.indrelid) IN ('(is_current = true)','is_current')
 ) THEN
  RAISE EXCEPTION 'Current-game index definition mismatch; manual review required';
 END IF;
END $$;
-- No grants, RPC activation, or Cloud Sync activation in this candidate.
COMMIT;
