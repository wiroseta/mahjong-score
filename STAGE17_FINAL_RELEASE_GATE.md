# Stage 17 — Consolidated release gate (2026-10-13)

## Evidence actually received from Supabase
- Four tables exist and have RLS enabled; FORCE RLS false, policy count zero. This is default-deny for normal RLS-subject roles, **not** proof SECURITY DEFINER authorization is correct.
- Five existing functions owned by postgres: account_permissions, generate_token, is_admin, peek, valid_game.
- Explicit ACL: account_permissions/is_admin/peek grant authenticated; generate_token/valid_game grant postgres only. No PUBLIC or anon grants shown.
- Five transfer RPCs open/commit/open_reader/read/lease_status **not installed** according to last inventory.

## Release blockers (no production changes authorized)
1. Transfer SQL candidate deliberately raises UNSAFE DRAFT before BEGIN; must **not** remove the sentinel or install it until independent code review and real Auth-session integration tests.
2. Production validator is known to accept nine malformed payloads; candidate 12/12 fixture tests do not close production gap.
3. Real two-device Auth session takeover, revocation, crash/offline/reconnect, CAS conflicts, live sharing and recovery have not been verified.
4. `supabase_latest.sql` is historical foundation, **not** a reviewed production deployment script.
5. Browser application writer/read integration and session transfer remain unproven.

## Next user interaction — ONE step only
If further catalog confirmation is needed, run `STAGE17_FINAL_GATE_READONLY_ONE_RESULT.sql` in Supabase SQL Editor and send its **single result table**. No need to repeat RLS or previous ACL outputs.

## GitHub Desktop (checkpoint only; DO NOT PUSH/DEPLOY)
Summary: `v15.7.15 - Consolidate Stage 17 security release gate`
Description: `Record verified Supabase RLS/ACL evidence; add single-result read-only RPC inventory; preserve blocked transfer SQL and Cloud Sync OFF; document real Auth and two-device release blockers.`
