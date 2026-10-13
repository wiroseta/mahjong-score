-- REVIEW ONLY — DO NOT RUN ON PRODUCTION. Validated in temporary schema (12/12), not deployed.
-- Extracted from Stage14 candidate; inspect dependencies and approval before any installation.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN false
  WHEN jsonb_array_length(p_game->'history')>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(ltrim(x::text, '-'))>12) THEN false
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
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(ltrim(n::text, '-'))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(ltrim(n::text, '-'))>12)))
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
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(ltrim(p->>'points', '-'))>12))))
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

