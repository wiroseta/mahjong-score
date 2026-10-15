# Stage 253 — Trial-only writer UI state refresh (candidate)

Status: STATIC CHECK PASS; LIVE BROWSER REGRESSION PENDING; DO NOT DEPLOY PRODUCTION.

Changes: ONLY `cloud-trial/index.html` compared with Stage 230 baseline. On bridge `ready`/`read-only` status or conflict, schedule a UI `update()` microtask so the writer-dependent controls refresh after `canWrite` changes. Avoid re-entrant render, no new sync RPCs, no SQL or auth changes. The root `/mahjong-score/` remains Cloud Sync OFF and unchanged.

Important: This targets a suspected missing UI refresh, not yet confirmed as the cause of the observed reload requirement. `update()` is intentionally used rather than full `render()` to avoid wiping user input. If a browser test still requires refresh, investigate the auth/session lifecycle rather than stacking patches.

Security: A writer token was exposed in chat during testing; revoke/rotate that session before release. Stale-session commit denial and other security/regression tests remain pending.

Validation: Node `--check` passed for all 4 inline JavaScript blocks in the modified trial HTML. No live browser test or GitHub push performed.

GitHub Desktop Summary: fix(trial): refresh writer-dependent UI after cloud activation
GitHub Desktop Description: Update only cloud-trial/index.html to refresh UI controls when cloud bridge reports ready/read-only or loses its lease. Keep root Cloud Sync OFF. Static syntax checks pass; live verification and security release gates pending. Do not deploy production.

Rollback: restore `cloud-trial/index.html` from Stage 230 ZIP.
