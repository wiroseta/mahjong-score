-- Mahjong Score v15.6.40 — Upgrade ONLY (run once in Supabase SQL Editor)
-- Adds admin-issued remote diagnostic requests to the existing RLS-protected target row.
-- Requires the existing v15.6.38 schema and Realtime publication.
ALTER TABLE public.mahjong_ai_diagnostic_targets
 ADD COLUMN IF NOT EXISTS request_id uuid,
 ADD COLUMN IF NOT EXISTS request_at timestamptz;
-- Existing RLS: only admin may UPDATE targets, users may SELECT only their own row.
-- Existing report insert RLS: target user may insert only when monitoring enabled.
