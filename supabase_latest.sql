-- MAHJONG SCORE v15.6.37 | CURRENT DATABASE UPGRADE ONLY
-- Enables Realtime for remote diagnostic target changes and preserves v15.6.36 delete access.
-- Run once in Supabase SQL Editor. No game score tables are modified.

-- Existing v15.6.36 permission (idempotent).
GRANT DELETE ON TABLE public.mahjong_ai_diagnostic_reports TO authenticated;
DROP POLICY IF EXISTS diag_report_admin_delete ON public.mahjong_ai_diagnostic_reports;
CREATE POLICY diag_report_admin_delete
 ON public.mahjong_ai_diagnostic_reports FOR DELETE TO authenticated
 USING (public.mahjong_diagnostic_is_admin());

-- Postgres Changes needs this table in the supabase_realtime publication.
-- Existing RLS diag_target_read limits users to their own row (admin can read all).
DO $$
BEGIN
 IF NOT EXISTS (
  SELECT 1 FROM pg_publication_tables
  WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
    AND tablename = 'mahjong_ai_diagnostic_targets'
 ) THEN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.mahjong_ai_diagnostic_targets;
 END IF;
END $$;
