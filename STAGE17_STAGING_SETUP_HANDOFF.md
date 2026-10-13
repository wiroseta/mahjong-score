# Stage 17 — Isolated staging setup and hard release gate

## Status
**PREPARATION ONLY.** No staging project was created; no real Auth sessions or two-device tests were run. Production remains unchanged, Cloud Sync OFF.

## One-time user action needed
Create a **new, empty Supabase project** dedicated to Mahjong staging (not the production project). Do not copy production credentials, user rows, game rows, JWTs or service-role keys. When it is ready, provide only confirmation and the staging project reference (not a secret). Do not paste candidate SQL anywhere yet.

## Implementation gates (all mandatory)
1. Verify project isolation and versioned schema dependencies in staging using read-only catalog queries.
2. Independently review all SECURITY DEFINER bodies and Auth session semantics, especially role metadata and revoke behavior; explicitly check for privilege escalation and bypasses.
3. Build staging-only migration **after** review. Current transfer SQL contains an intentional RAISE EXCEPTION and is not executable as-is. Never remove that guard in production or execute the candidate without review.
4. Run SQL integration with disposable Auth accounts and transaction-safe fixtures; capture non-sensitive PASS/FAIL evidence.
5. Execute A01–A12 from STAGE17_REAL_AUTH_TWO_DEVICE_TEST_PROTOCOL.md with real devices. Reject release on any untested case.
6. Require explicit production deployment approval and a rollback plan. Keep Cloud Sync OFF until approved and verified.

## Existing production evidence (13 Oct 2026)
- Four tables exist with RLS enabled; FORCE RLS disabled; zero policies. This is not a complete SECURITY DEFINER safety proof.
- Five existing helper RPCs are owned by postgres; no ACL grant to PUBLIC or anon; three grant authenticated, two internal-only.
- Five transfer RPCs not installed. 618 local Node tests previously passed. No real transfer proof.

## Security caution
Never send API keys, session tokens, JWTs, passwords, database connection strings or game data in chat. A staging project reference alone is not an authentication secret. The setup is an external user action, not something that can be done from local ZIP processing.
