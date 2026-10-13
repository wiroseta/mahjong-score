# Stage 17 — Real Auth two-device acceptance protocol (NOT EXECUTED)

## Hard stop
No deployment or modification of production Supabase functions, tables, grants, policies, or live games. The five RPCs are absent; the candidate is deliberately fail-closed. Real end-to-end testing requires a separate **isolated Supabase project** with throwaway accounts, or separately approved staging setup. Do not paste candidate SQL into production SQL Editor.

## Preconditions (record evidence)
1. Create an isolated Supabase staging project with no real user/game data; configure matching auth role metadata and schema from reviewed migrations. Do not clone secrets or real user rows.
2. Independent security review must approve a staging-only migration with the deliberate exception sentinel removed **only in staging**, after checking token issuance, grants, function owners, auth.sessions dependencies, default columns, and validator.
3. Create two disposable Auth logins for the **same** scorekeeper, with distinct JWT `session_id`, plus separate administrator account. Record only opaque test IDs; never record JWTs, passwords or session tokens.
4. Connect two browser profiles/devices to staging, disable production connectivity and service-worker caches, use a disposable game fixture.

## Acceptance matrix (each requires evidence, otherwise BLOCKED)
| ID | Action | Expected result |
|---|---|---|
| A01 | Login scorekeeper on device A, open a test game | A is sole writer; game revision and ownership established |
| A02 | Login same scorekeeper on B (multi-device OFF) | B takes writer; A loses write permission |
| A03 | Attempt A commit using pre-transfer token | Rejected; revision unchanged; no conflict payload leak |
| A04 | B read after transfer | Same names, score, rounds, dealer, winds, quads, history, sharing metadata |
| A05 | Concurrent A/B commits from same revision | Exactly one accepted, no lost update |
| A06 | Revoke B Auth session then commit | Rejected; no write access via cached JWT |
| A07 | Reconnect A after offline edits | No stale overwrite; explicit safe recovery path |
| A08 | Multi-device ON for disposable scorekeeper | Behavior matches product policy; no writer collision |
| A09 | Administrator logins on two devices | Admin exempt from single-device restriction |
| A10 | Reader without valid Auth and cross-account reader | Denied; no private game data disclosed |
| A11 | Test game malformed history/Unicode/unsafe integers | Rejected without mutation |
| A12 | Repeat A01–A11 on iPhone Safari and Android Chrome | UI and server behavior consistent |

## Exit criteria
A01–A12 must be observed on staging with real Auth JWTs, network requests, database revision checks, and no production mutations. Mark release BLOCKED if any fails or remains unexecuted. Deploy only after explicit user approval and reviewed migration/rollback plan. Current result: **0/12 executed**.
