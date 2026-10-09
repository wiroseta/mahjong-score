-- Mahjong Score v15.6.85: run this active SQL in Supabase SQL Editor.
-- Voice debug is write-only for scorekeepers; only admins can SELECT.
-- Preserves previous schema upgrades.
-- Mahjong Score v15.6.40 — Upgrade ONLY (run once in Supabase SQL Editor)
-- Adds admin-issued remote diagnostic requests to the existing RLS-protected target row.
-- Requires the existing v15.6.38 schema and Realtime publication.
ALTER TABLE public.mahjong_ai_diagnostic_targets
 ADD COLUMN IF NOT EXISTS request_id uuid,
 ADD COLUMN IF NOT EXISTS request_at timestamptz;
-- Existing RLS: only admin may UPDATE targets, users may SELECT only their own row.
-- Existing report insert RLS: target user may insert only when monitoring enabled.

-- Add a new allowed event kind without changing existing diagnostic records.
ALTER TABLE public.mahjong_voice_diagnostics DROP CONSTRAINT IF EXISTS mahjong_voice_diagnostics_kind_check;
ALTER TABLE public.mahjong_voice_diagnostics ADD CONSTRAINT mahjong_voice_diagnostics_kind_check
 CHECK (kind IN ('speech_test','speech_error','parser_self_test','voice_debug'));
ALTER TABLE public.mahjong_voice_diagnostics ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.mahjong_voice_diagnostics FROM anon;
REVOKE ALL ON public.mahjong_voice_diagnostics FROM authenticated;
GRANT INSERT, SELECT ON public.mahjong_voice_diagnostics TO authenticated;
DROP POLICY IF EXISTS voice_diagnostic_admin_insert ON public.mahjong_voice_diagnostics;
DROP POLICY IF EXISTS voice_diagnostic_scorekeeper_insert ON public.mahjong_voice_diagnostics;
CREATE POLICY voice_diagnostic_scorekeeper_insert ON public.mahjong_voice_diagnostics
 FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid())
 AND (SELECT auth.jwt())->'app_metadata'->>'role' IN ('admin','scorekeeper'));
DROP POLICY IF EXISTS voice_diagnostic_admin_select ON public.mahjong_voice_diagnostics;
CREATE POLICY voice_diagnostic_admin_select ON public.mahjong_voice_diagnostics
 FOR SELECT TO authenticated USING ((SELECT auth.jwt())->'app_metadata'->>'role' = 'admin');
-- No UPDATE or DELETE privileges for scorekeepers.
