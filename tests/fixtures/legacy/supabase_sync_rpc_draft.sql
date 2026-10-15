-- STAGING ONLY: NOT FOR PRODUCTION UNTIL POSTGRES/SUPABASE INTEGRATION TESTS PASS.
-- Depends on v15.7.14 foundation tables.
-- FAIL-CLOSED: token issuance and authentication not yet integrated.
-- This file is deliberately NOT executable in production.
-- REVIEW: existing auth.sessions created_at ordering alone is insufficient to prove
-- the new session owns the writer lease; auth session ID must match on every commit.
DO $$ BEGIN RAISE EXCEPTION 'UNSAFE DRAFT: do not deploy; session-token validation incomplete'; END $$;
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
-- Preserve historical writer binding independently of read-only enrollments.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false;
-- Match the guarded alignment candidate: never auto-promote legacy games.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
-- Requires the foundation's existing partial unique index:
-- mahjong_game_states_one_current_per_owner_idx (owner_id WHERE is_current = true).
-- Do not create an equivalent second index here: fail closed until the
-- foundation migration is independently verified in the target environment.

-- Server-side schema validation mirrors the essential four-player client invariants.
-- Do not trust a browser-side validator as a security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN jsonb_array_length(p_game->'history') ELSE NULL END)>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(trim(leading '-' from x::text))>12) THEN false
  WHEN p_game ? 'roundWind' AND (jsonb_typeof(p_game->'roundWind') IS DISTINCT FROM 'number'
    OR (p_game->>'roundWind') !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (jsonb_typeof(p_game->'seatWinds') IS DISTINCT FROM 'array'
    OR (CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN jsonb_array_length(p_game->'seatWinds') ELSE NULL END)<>4) THEN false
  WHEN p_game ? 'seatWinds' AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number' OR x::text !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (SELECT count(DISTINCT x) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x)<>4 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'object') THEN false
  -- Keep server-side history checks aligned with the client recovery ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE (x ? 'delta' AND (jsonb_typeof(x->'delta') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN jsonb_array_length(x->'delta') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'quads' AND (jsonb_typeof(x->'quads') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN jsonb_array_length(x->'quads') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN x->'quads' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-4]$')))
    OR (x ? 'winner' AND x->'winner'<>'null'::jsonb AND (jsonb_typeof(x->'winner') IS DISTINCT FROM 'number' OR x->>'winner' !~ '^[0-3]$'))
    OR (x ? 'dealer' AND x->'dealer'<>'null'::jsonb AND (jsonb_typeof(x->'dealer') IS DISTINCT FROM 'number' OR x->>'dealer' !~ '^[0-3]$'))
    OR (x ? 'discarder' AND x->'discarder'<>'null'::jsonb AND (jsonb_typeof(x->'discarder') IS DISTINCT FROM 'number' OR x->>'discarder' !~ '^[0-3]$'))
    OR (x ? 'roundWind' AND (jsonb_typeof(x->'roundWind') IS DISTINCT FROM 'number' OR x->>'roundWind' !~ '^[0-3]$'))
    OR (x ? 'method' AND jsonb_typeof(x->'method') IS DISTINCT FROM 'string')
    OR (x ? 'playerPatterns' AND (jsonb_typeof(x->'playerPatterns') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN jsonb_array_length(x->'playerPatterns') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN x->'playerPatterns' ELSE '[]'::jsonb END) p WHERE p <> 'null'::jsonb AND
       (jsonb_typeof(p) IS DISTINCT FROM 'object' OR jsonb_typeof(p->'name') IS DISTINCT FROM 'string'
        OR length(p->>'name')>100 OR jsonb_typeof(p->'points') IS DISTINCT FROM 'number'
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM p->>'points'))>12))))
    OR (x ? 'patterns' AND (jsonb_typeof(x->'patterns') IS DISTINCT FROM 'array'
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'patterns') = 'array' THEN x->'patterns' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string')))
    OR (x ? 'seatWindsBefore' AND (jsonb_typeof(x->'seatWindsBefore') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN jsonb_array_length(x->'seatWindsBefore') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-3]$')
      OR (SELECT count(DISTINCT n) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n)<>4))
    OR (x ? 'namesAtTime' AND (jsonb_typeof(x->'namesAtTime') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN jsonb_array_length(x->'namesAtTime') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN x->'namesAtTime' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string' OR length(n #>> '{}')>100)))
  ) THEN false

  ELSE true END;
$$;
REVOKE ALL ON FUNCTION public.mahjong_sync_valid_game(jsonb) FROM PUBLIC,anon,authenticated;

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid; v_auth_created_at timestamptz;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT created_at INTO v_auth_created_at FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid;
  IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  -- NULL means this device has no local game to upload. It may adopt an existing
  -- cloud game, but must never create an empty cloud game implicitly.
  IF p_local_game IS NOT NULL AND NOT public.mahjong_sync_valid_game(p_local_game)
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
    WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  -- Persistent high-water mark: a displaced older Auth session must not
  -- reclaim the writer lease even after the newer Auth session expires or
  -- its auth.sessions row is deleted. Keep historical device rows for this guard.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501';
  END IF;
  -- Do not downgrade the persistent login high-water mark when an admin or
  -- multi-device scorekeeper reuses a device ID from an older Auth session.
  -- This also matters if multi-device permission is disabled later.
  IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
      AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','newer-login');
  END IF;
  -- A caller that supplied a preflight identity must match it regardless
  -- of whether it is adopting cloud data or already holds a local copy.
  -- Otherwise a stale client can take over a different current game.
  IF p_expected_revision IS NOT NULL AND p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Expected revision must not be negative';
  END IF;
  IF (p_expected_revision IS NULL) IS DISTINCT FROM (p_expected_game_id IS NULL) THEN
    RAISE EXCEPTION 'Both expected game ID and revision are required together';
  END IF;
  -- BETA SINGLE-DEVICE LOCK: fail closed for a DIFFERENT device.
  -- A fresh Auth session on the SAME bound device may safely rotate its lease;
  -- old credentials are revoked atomically below under the account row lock.
  -- Check under the auth.users FOR UPDATE lock above; rejected opens MUST NOT
  -- revoke or rotate the existing writer. An administrator may later provide
  -- an audited device-unlock flow; this draft intentionally does not.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.is_active AND prior.is_writer
      AND prior.device_id IS DISTINCT FROM p_device_id
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','device-locked');
  END IF;
  -- BETA DEVICE BINDING: the first registered device remains bound even if
  -- its writer lease expires or the browser signs out. A different device
  -- cannot silently become the writer just because is_active became false.
  -- Existing installations with multiple historical device IDs fail closed;
  -- administrator review/unlock is required before beta rollout.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.ever_writer AND prior.device_id IS DISTINCT FROM p_device_id
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','device-bound-to-other-device');
  END IF;
  -- Safety preflight: never revoke an existing writer before checking whether
  -- this device has a different game. The client must reconcile explicitly.
  -- A rejected takeover must leave the current writer fully operational.
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  -- Existing cloud state always requires a matching preflight, even when
  -- the caller submits an identical local snapshot. Otherwise a stale client
  -- could rotate the writer lease without first observing the current revision.
  IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  IF FOUND AND p_expected_game_id IS NOT NULL AND
     (v_game.id IS DISTINCT FROM p_expected_game_id OR
      v_game.revision IS DISTINCT FROM p_expected_revision) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- Compare local payload only after validating the cloud identity/revision.
  -- A stale preflight must not receive the full current game snapshot via
  -- the mismatch response; it must refresh and reconcile explicitly.
  IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN
    RETURN jsonb_build_object('ok',false,'reason','local-cloud-mismatch',
      'gameId',v_game.id,'revision',v_game.revision,'game',v_game.game_data);
  END IF;
  -- A takeover that adopts cloud state must be based on a prior read of its
  -- exact revision. This prevents a concurrent commit between peek and open
  -- from silently changing the state accepted by the new device.
  IF FOUND AND p_local_game IS NULL AND
     (p_expected_revision IS NULL OR p_expected_revision IS DISTINCT FROM v_game.revision
      OR p_expected_game_id IS NULL OR p_expected_game_id IS DISTINCT FROM v_game.id) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A prior peek that saw a cloud game must never fall back to creating a
  -- new game if the original game disappeared or was replaced in the interim.
  -- This is a preflight failure, not permission to bootstrap new cloud state.
  IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed');
  END IF;
  IF NOT FOUND AND p_local_game IS NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','no-cloud-game');
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      -- Revoke the credential itself, not just the writer flag. A displaced
      -- device must never retain a reusable token hash in the database.
      session_token_hash=NULL,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,ever_writer)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,v_auth_created_at,encode(extensions.digest(v_token,'sha256'),'hex'),true)
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,ever_writer=true,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id,is_current)
    VALUES(v_uid,p_local_game,0,v_session.id,true) RETURNING * INTO v_game;
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
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF NOT public.mahjong_sync_valid_game(p_game)
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
     AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 -- Persistent login high-water guard also protects writes when the newer
 -- Auth session has expired or disappeared. A stale writer token alone is
 -- insufficient to prove that an older login still owns the account.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
   JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.auth_session_created_at IS NOT NULL
     AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 -- Device binding must also be checked at COMMIT time: an administrator may
 -- disable multi-device access after a writer lease was issued. Never let a
 -- previously authorized second device continue writing under the new policy.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN public.mahjong_device_sessions prior ON prior.user_id=u.id
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.ever_writer AND prior.device_id IS DISTINCT FROM p_device_id
 ) THEN
   RETURN jsonb_build_object('ok',false,'reason','device-bound-to-other-device');
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

-- Explicit reader enrollment. A read-only device must never call mahjong_sync_open,
-- because that operation transfers the sole writer lease.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_auth_created_at timestamptz;
 v_game public.mahjong_game_states%ROWTYPE;
 v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT created_at INTO v_auth_created_at FROM auth.sessions
  WHERE id=v_auth_session AND user_id=v_uid;
 IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
 -- Serialize with writer takeovers and commits for this account.
 SELECT raw_app_meta_data->>'role',
  COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false),
  banned_until,deleted_at INTO v_role,v_multi,v_banned,v_deleted
 FROM auth.users WHERE id=v_uid FOR UPDATE;
 IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL
  OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role<>'admin' AND NOT v_multi THEN
  RAISE EXCEPTION 'Multi-device reading not permitted' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 -- Never replace a newer recorded Auth session with an older one on a
 -- reused device ID. That would erase the persistent takeover high-water
 -- mark if multi-device access is subsequently disabled.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
  WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','newer-login');
 END IF;
 -- Never downgrade a current writer on this device. Require a separate
 -- device ID for a read-only enrollment, rather than clobber its token.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active AND is_writer
   AND revoked_at IS NULL) THEN
  RETURN jsonb_build_object('ok',false,'reason','device-already-writer');
 END IF;
 INSERT INTO public.mahjong_device_sessions
  (user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,revoked_at)
 VALUES(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL)
 ON CONFLICT(user_id,device_id) DO UPDATE SET
  is_active=true,is_writer=false,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,
  session_generation=public.mahjong_device_sessions.session_generation+1,
  session_token_hash=NULL,revoked_at=NULL,last_seen_at=now(),updated_at=now()
 RETURNING * INTO v_lease;
 INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
 VALUES(v_uid,v_uid,p_device_id,'reader-open',jsonb_build_object('game_id',v_game.id));
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',false,'generation',v_lease.session_generation);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open_reader(uuid) TO authenticated;

-- Read-only preflight: verify the exact Supabase Auth session and account status.
-- This does not create a device session, rotate a token, or modify game state.
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
    AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
 INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid;
 IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL
    OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM auth.sessions newer JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- A displaced old login must not resume metadata reads after the newer
 -- Auth session expires. The historical writer lease is the high-water mark.
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM public.mahjong_device_sessions prior
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision);
END; $$;
-- Read-only refresh for an already opened device session. Unlike peek, this
-- requires a registered, active lease for this exact Supabase Auth session.
-- It never grants writer privileges or rotates writer credentials.
CREATE OR REPLACE FUNCTION public.mahjong_sync_read(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid;
 v_game public.mahjong_game_states%ROWTYPE; v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- A newer login invalidates an older scorekeeper session unless explicitly
 -- allowed by administrator, even if its old lease has not yet been revoked.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active=true
   AND revoked_at IS NULL AND auth_session_id=v_auth_session;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 -- A reader lease is not a permanent entitlement. If the administrator
 -- disables multi-device access, reject previously enrolled reader sessions
 -- immediately instead of allowing continued cloud reads.
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
      AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',v_lease.is_writer
   AND v_lease.session_token_hash IS NOT NULL
   AND v_lease.session_generation>0
   AND v_game.writer_session_id=v_lease.id);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_read(uuid) TO authenticated;

-- Lightweight lease probe for foreground/periodic client checks. A stale device
-- must learn that its writer lease was revoked without waiting for a score edit.
-- This is advisory UI state; commit() remains the server-side security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_lease_status(p_device_id uuid,p_generation bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_auth_session uuid; v_lease public.mahjong_device_sessions%ROWTYPE;
 v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_generation<1 THEN
  RAISE EXCEPTION 'Authentication and valid lease identity required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
  RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND auth_session_id=v_auth_session
   AND session_generation=p_generation AND is_active=true AND revoked_at IS NULL;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked'); END IF;
 RETURN jsonb_build_object('ok',true,'canWrite',v_lease.is_writer
  AND v_lease.session_token_hash IS NOT NULL
  AND v_game.writer_session_id=v_lease.id,
  'gameId',v_game.id,'revision',v_game.revision);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;
COMMIT;
