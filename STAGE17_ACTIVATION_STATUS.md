# Stage 17 — Automatic transfer activation candidate

This ZIP contains an application with `MAHJONG_CLOUD_SYNC_ENABLED=true` and a separate **unverified** SQL install candidate. **DO NOT deploy the app before installing and verifying the five RPCs.** This package is NOT a claim of production readiness.

## Critical sequence
1. Back up the current Supabase database, confirm the existing tables/indexes and current game are recoverable.
2. Review `STAGE17_DIRECT_INSTALL_CANDIDATE_REVIEW_FIRST.sql` against actual production schema and function definitions. It replaces the existing `mahjong_sync_peek` and `mahjong_sync_valid_game` definitions and adds/changes table columns. Do not execute blindly.
3. Install only after reviewing dependencies and security. If installation fails, transaction should roll back, but an external verified backup is still needed.
4. Test RPC access, signed Auth session takeover and recovery with two devices.
5. Only then deploy this enabled app to GitHub Pages. If cloud RPCs are absent or fail, scorekeeping can become read-only.

## Current evidence
- Previous baseline: 623 Node tests PASS, zero failures. These are not a live Supabase acceptance test.
- Production ACL: no PUBLIC or anon EXECUTE on five currently installed helpers.
- Production RLS: four tables enabled, zero policies.
- Five transfer RPCs: not installed as of the last user-provided database report.
- Real two-device transfer: not verified.

## GitHub Desktop
Summary: `v15.7.15 - Prepare automatic cloud session transfer activation`
Description: `Enable cloud bridge in activation candidate; include separate SQL installation candidate and safety handoff. Requires server RPC installation and live two-device verification before deployment.`
