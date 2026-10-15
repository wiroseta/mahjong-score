-- Mahjong Score 4P — server RPC candidate for controlled integration testing.
-- Requires existing foundation (tables, is_writer, token_hash, revoked_at, account_permissions, token generator).
-- No changes to existing Mahjong Live Sharing / Voice tables.
-- Do not deploy to production until live database integration and app integration are verified.
-- FAIL-CLOSED: this review RPC is incompatible with the active client adapter.
-- Do not execute; the next migration must preserve expected revision/game ID
-- and must include the high-water session guard from the protected draft.
DO $$ BEGIN RAISE EXCEPTION 'UNSAFE REVIEW: RPC open signature/preflight incompatible with client; DO NOT DEPLOY'; END $$;
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT true;
-- Reuse the canonical unique partial index from supabase_latest.sql.
-- Do not create a second equivalent current-game index.
-- Prerequisite: mahjong_game_states_one_current_per_owner_idx on (owner_id) WHERE is_current = true.

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  IF jsonb_typeof(p_local_game) IS DISTINCT FROM 'object' OR octet_length(p_local_game::text)>2000000
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id)
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,session_token_hash)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,encode(extensions.digest(v_token,'sha256'),'hex'))
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,auth_session_id=v_auth_session,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id)
    VALUES(v_uid,p_local_game,0,v_session.id) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id)
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
    VALUES(v_game.id,v_uid,p_device_id,GREATEST(0,p_base_revision),p_game,v_reason);
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;
COMMIT;
