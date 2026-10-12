-- Mahjong Score v15.7.14 — ADDITIVE CLOUD SYNC FOUNDATION (NOT ACTIVATED)
-- Run ONLY after reviewing against production schema. No existing game rows are modified.
-- Server-side RPCs are intentionally NOT published in this migration: no application
-- writer is allowed until atomic revision, transfer and offline conflict rules are tested.
BEGIN;
CREATE TABLE IF NOT EXISTS public.mahjong_device_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id uuid NOT NULL,
  session_generation bigint NOT NULL DEFAULT 1 CHECK (session_generation > 0),
  is_active boolean NOT NULL DEFAULT false,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id,device_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS mahjong_one_active_device_per_user
  ON public.mahjong_device_sessions(user_id) WHERE is_active;
CREATE INDEX IF NOT EXISTS mahjong_device_sessions_user_idx
  ON public.mahjong_device_sessions(user_id,updated_at DESC);

CREATE TABLE IF NOT EXISTS public.mahjong_game_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  game_data jsonb NOT NULL CHECK (jsonb_typeof(game_data)='object'),
  revision bigint NOT NULL DEFAULT 0 CHECK (revision>=0),
  writer_session_id uuid REFERENCES public.mahjong_device_sessions(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mahjong_game_states_owner_idx
  ON public.mahjong_game_states(owner_id,updated_at DESC);

CREATE TABLE IF NOT EXISTS public.mahjong_sync_conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES public.mahjong_game_states(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  device_id uuid NOT NULL,
  base_revision bigint NOT NULL CHECK (base_revision>=0),
  proposed_game_data jsonb NOT NULL CHECK (jsonb_typeof(proposed_game_data)='object'),
  reason text NOT NULL,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mahjong_sync_conflicts_open_idx
  ON public.mahjong_sync_conflicts(game_id,created_at DESC) WHERE resolved_at IS NULL;

CREATE TABLE IF NOT EXISTS public.mahjong_session_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  subject_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  device_id uuid,
  event_type text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mahjong_session_audit_subject_idx
  ON public.mahjong_session_audit(subject_id,created_at DESC);

ALTER TABLE public.mahjong_device_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mahjong_game_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mahjong_sync_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mahjong_session_audit ENABLE ROW LEVEL SECURITY;
-- Fail closed: no browser table access until reviewed server RPCs are deployed.
REVOKE ALL ON public.mahjong_device_sessions FROM PUBLIC,anon,authenticated;
REVOKE ALL ON public.mahjong_game_states FROM PUBLIC,anon,authenticated;
REVOKE ALL ON public.mahjong_sync_conflicts FROM PUBLIC,anon,authenticated;
REVOKE ALL ON public.mahjong_session_audit FROM PUBLIC,anon,authenticated;
REVOKE ALL ON SEQUENCE public.mahjong_session_audit_id_seq FROM PUBLIC,anon,authenticated;
COMMIT;
