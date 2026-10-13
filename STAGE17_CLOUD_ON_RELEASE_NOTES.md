# Stage 17 — Cloud ON deployment candidate (not verified final)

User reports five RPCs INSTALLED in existing Supabase, based on name-only pg_proc query. This does NOT verify signatures, grants, server logic, Auth JWT or actual device takeover. No direct access to live Supabase is available here.

This package sets MAHJONG_CLOUD_SYNC_ENABLED=true. It can make scorekeeping read-only when RPCs reject sessions or game adoption fails. Do not present as proven working. Preserve a verified backup of the current local game before deploying; browser/localStorage data may be at risk if replacing state.

Node test run on cloud-enabled code: 617 PASS / 6 FAIL (623 total). The six failed tests assert Cloud Sync must remain OFF and have NOT been removed or rewritten to artificially pass. This is a release-gate failure, not a certified green build. See tests/cloud_on_test_run.txt.

No Supabase SQL executed by this ZIP. The five RPCs were reported installed by the user. Two-device automatic takeover, old writer revocation, game persistence and recovery remain untested.

GitHub Desktop Summary: v15.7.15 - Cloud ON automatic transfer candidate
GitHub Desktop Description: Enable cloud bridge after user-reported installation of five Supabase RPCs. Preserve six failing release-gate tests as explicit blockers. No live Auth/two-device acceptance yet. Back up game state before use.
