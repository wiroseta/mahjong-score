-- DEVELOPMENT DRAFT ONLY. Do not deploy before full integration testing.
-- Read-only recovery endpoint. Does not activate, revoke or modify a writer lease.
BEGIN;
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_auth_session uuid;
  v_role text;
  v_multi boolean;
  v_game public.mahjong_game_states%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  -- JWT must represent a currently valid, non-expired Supabase Auth session.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (
    SELECT 1 FROM auth.sessions s WHERE s.id=v_auth_session AND s.user_id=v_uid
      AND (s.not_after IS NULL OR s.not_after>now())
  ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT u.raw_app_meta_data->>'role',
    COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)
    INTO v_role,v_multi FROM auth.users u
    WHERE u.id=v_uid AND u.deleted_at IS NULL
      AND (u.banned_until IS NULL OR u.banned_until<=now());
  IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL THEN
    RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501';
  END IF;
  -- Old single-device scorekeeper sessions must not read the active game
  -- after a newer Supabase Auth login, even if their JWT has not expired.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id)
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok',true,'hasGame',false); END IF;
  RETURN jsonb_build_object('ok',true,'hasGame',true,'gameId',v_game.id,
    'revision',v_game.revision,'game',v_game.game_data);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;
COMMIT;
