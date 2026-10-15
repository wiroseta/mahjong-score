Stage 241 — Cloud Trial session takeover UI fix (candidate; DO NOT DEPLOY production)

Change: cloud-trial/index.html only. On a conflict whose error message explicitly contains "Newer login session exists", invalidate the pending activation, reset the cloud bridge, synchronously show the login gate and message, then call Supabase auth.signOut({scope:'local'}) to clear only this browser. Other conflicts remain non-logout events. Existing game storage is not deleted.

Local regression: node --test tests/sync-app-bridge.test.cjs tests/sync-engine.test.cjs: 92 PASS, 0 FAIL.
Live Chrome/Firefox transfer verification: NOT YET RUN. Production Cloud Sync remains OFF. DO NOT DEPLOY production.

GitHub Desktop Summary:
Stage 241: lock superseded cloud-trial session UI

GitHub Desktop Description:
Detect newer-login rejection and immediately return stale browser to login. Clear only local Supabase session, preserve game storage and active browser. Cloud-trial candidate only; production sync remains OFF. 92 targeted tests PASS; live two-browser verification pending.
