# Stage 20 — Session Transfer Audit (13 October 2026)

Input: mahjong-score-main(6).zip. No production deployment, Supabase write, or live game mutation performed.

## Verified source observations
- index.html loginMahjong invokes Supabase auth.signInWithPassword; device writer activation is deferred via scheduleMahjongCloudAuth / bridge.onSession.
- js/sync-app-bridge.js already schedules lease checks at 15 seconds while active. js/sync-engine.js fails closed on rejected lease. The UI auth session is NOT automatically signed out by this lease logic.
- The uploaded index.html had MAHJONG_CLOUD_SYNC_ENABLED=true despite prior DO NOT DEPLOY constraints. Changed to false in this safety checkpoint.
- Chrome staying logged in after Firefox login is NOT proof that Chrome retains writer rights. Supabase Auth login and the application's writer lease are distinct concepts.
- Earlier 6 release-gate test failures were caused by the true flag; retest results are in STAGE20_TEST_RESULTS.txt.

## Remaining blockers
- Do not promise logout merely from writer revocation: add explicit account-session revocation UX after verified backend response and consider Auth token invalidation semantics.
- Confirm five RPCs are installed and secure before any cloud-on release.
- Verify new browser obtains writer lease, old browser receives revoked response, and no old writes succeed; test with disposable game only.
- No automatic forced signOut implemented: the proper server contract and race behavior require validation first.

## GitHub Desktop
Summary: Stage 20 restore cloud release safety gate
Description: Restore cloud sync OFF in index.html, preserve existing transfer implementation, document session versus writer lease distinction and test results. DO NOT DEPLOY.
