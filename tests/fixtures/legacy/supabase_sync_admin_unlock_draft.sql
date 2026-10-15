-- STAGING DESIGN ONLY. NEVER EXECUTE ON PRODUCTION.
-- Explicit review required: administrator-controlled device recovery.
DO $$ BEGIN RAISE EXCEPTION 'UNSAFE DRAFT: admin device unlock not verified on PostgreSQL'; END $$;
BEGIN;
-- Append-only recovery trail; never delete historical sessions or game data.
CREATE TABLE IF NOT EXISTS public.mahjong_device_unlock_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  administrator_id uuid NOT NULL REFERENCES auth.users(id),
  scorekeeper_id uuid NOT NULL REFERENCES auth.users(id),
  expected_device_id uuid NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mahjong_device_unlock_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.mahjong_device_unlock_audit FROM PUBLIC, anon, authenticated;
-- WARNING: this RPC is a draft; role/auth-session verification needs runtime review.
CREATE OR REPLACE FUNCTION public.mahjong_sync_admin_unlock_device(
  p_scorekeeper_id uuid, p_expected_device_id uuid
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_admin uuid := auth.uid(); v_admin_role text; v_target_role text;
BEGIN
  IF v_admin IS NULL OR p_scorekeeper_id IS NULL OR p_expected_device_id IS NULL
    THEN RAISE EXCEPTION 'Unauthorized or invalid request' USING ERRCODE='42501'; END IF;
  -- Serialize with writer-open / commit, which lock the same auth.users row.
  SELECT raw_app_meta_data->>'role' INTO v_admin_role
    FROM auth.users WHERE id=v_admin FOR UPDATE;
  IF v_admin_role IS DISTINCT FROM 'admin' OR v_admin=p_scorekeeper_id
    THEN RAISE EXCEPTION 'Administrator required' USING ERRCODE='42501'; END IF;
  SELECT raw_app_meta_data->>'role' INTO v_target_role
    FROM auth.users WHERE id=p_scorekeeper_id FOR UPDATE;
  IF v_target_role IS DISTINCT FROM 'scorekeeper'
    THEN RAISE EXCEPTION 'Target must be scorekeeper' USING ERRCODE='42501'; END IF;
  -- Fail closed: refuse stale unlock requests and ambiguous historical bindings.
  IF NOT EXISTS (SELECT 1 FROM public.mahjong_device_sessions
    WHERE user_id=p_scorekeeper_id AND device_id=p_expected_device_id AND ever_writer)
    OR EXISTS (SELECT 1 FROM public.mahjong_device_sessions
    WHERE user_id=p_scorekeeper_id AND ever_writer AND device_id<>p_expected_device_id)
    THEN RETURN jsonb_build_object('ok',false,'reason','binding-changed-or-ambiguous'); END IF;
  -- This clears writer rights, NOT scores, history, game identity or revisions.
  UPDATE public.mahjong_device_sessions
    SET is_active=false,is_writer=false,ever_writer=false,
        session_generation=session_generation+1,
        session_token_hash=NULL,revoked_at=now(),updated_at=now()
    WHERE user_id=p_scorekeeper_id;
  -- Preserve auth-session high-water marks so an older session cannot reclaim.
  INSERT INTO public.mahjong_device_unlock_audit
    (administrator_id,scorekeeper_id,expected_device_id)
    VALUES(v_admin,p_scorekeeper_id,p_expected_device_id);
  RETURN jsonb_build_object('ok',true,'status','unlocked');
END $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_admin_unlock_device(uuid,uuid) FROM PUBLIC,anon,authenticated;
-- GRANT withheld intentionally until isolated PostgreSQL authorization tests pass.
ROLLBACK;
