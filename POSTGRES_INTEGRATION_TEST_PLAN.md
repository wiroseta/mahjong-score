# Tahap 13 — PostgreSQL isolated integration gate (NOT EXECUTED)

**Production prohibition:** Never run `supabase_sync_rpc_draft.sql` in a production database. It intentionally raises `UNSAFE DRAFT` before `BEGIN`. Do not remove this guard until all integration and security gates are reviewed.

## Environment prerequisites

- Disposable PostgreSQL database/cluster, never production or staging with real users.
- Supabase-compatible `auth.users`, `auth.sessions`, `auth.uid()` and `auth.jwt()` behavior; ordinary PostgreSQL alone cannot accurately simulate Supabase Auth without test-only fixtures.
- Separate test roles (`anon`, `authenticated`) and RLS policy setup matching the actual Supabase deployment.
- Test identities: admin, scorekeeper A (single-device), scorekeeper B (multi-device), inactive account; two distinct Auth sessions for A.
- All SQL applied within a disposable environment; database dropped after testing. No real credentials or production data.

## Required integration scenarios (not PASS until run)

1. Install/migrate schema twice on disposable database; verify signatures, grants, RLS, uniqueness, and idempotence.
2. Anonymous RPC access denied, including direct function calls and direct table access.
3. Scorekeeper A opens first device and commits a complete valid game; read back exact names, scores, dealer, history, Quad and combinations.
4. Second device logs in with a newer Auth session, atomically takes writer lease, receives current game and history, and commits a new revision.
5. Old device cannot commit, reopen writer lease, read private game or regain access after newer session expiry/revocation.
6. Concurrent commit at identical expected revision: exactly one succeeds; no lost updates or partial rows.
7. Concurrent device takeover and commit: serial order must be consistent; no two active writers.
8. Replayed or wrong writer token rejected; stale revision rejected without changing game.
9. Multi-device scorekeeper: one writer and permitted readers; reader never revokes or writes through writer lease.
10. Admin sessions retain intended multi-device rights without leaking scorekeeper game ownership.
11. Inactive/banned/deleted user cannot open/read/commit; privileges and error payloads reveal no other user's game.
12. Network retry and offline recovery: identical request replay must not double-apply scores or Quad; conflicting local revisions must not overwrite cloud history.
13. Invalid payloads rejected server-side (wrong arrays, huge JSON, non-integer points, invalid winds, malformed history), with no mutation.
14. Forced exception mid-transaction rolls back both session and game changes.
15. Token, Auth session, lease status, and audit trail behave correctly after logout and reconnection.

## Completion evidence

Record actual PostgreSQL/Supabase version, test fixture migration hash, SQL hash, individual PASS/FAIL logs, concurrency timings, rollback proof, and evidence that production project was never targeted. A Node.js mock or static SQL inspection does not satisfy this gate.
