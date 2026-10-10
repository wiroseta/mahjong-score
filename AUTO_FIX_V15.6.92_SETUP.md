# Mahjong Score v15.6.92 — Automatic Voice Correction Trigger

## Deployment prerequisites (required for immediate trigger)

The ZIP includes a new Supabase Edge Function and SQL schema. Uploading the ZIP to GitHub **does not deploy Supabase Edge Functions or run SQL**. Until the steps below are completed, the existing scheduled 06:00 WIB GitHub workflow remains available and new confirmed corrections still save to Supabase.

1. Run the **single active** `supabase_latest.sql` in Supabase SQL Editor (after reviewing against the current database). It adds `mahjong_voice_autofix_dispatches`, an RLS-protected deduplication ledger. Do not add a separate versioned SQL file.
2. Create a **fine-grained GitHub Personal Access Token** scoped **only** to `wiroseta/mahjong-score`, with **Actions: Read and write** repository permission. Keep it private. Do not put it in GitHub repository files, the browser, or this chat.
3. In Supabase project → Edge Functions → Secrets, set `GITHUB_AUTOFIX_TOKEN` to that token. Set `MAHJONG_VOICE_AUTO_MODE` to `development` for immediate triggering, or `stable` to disable it. Keep this value synchronized with the GitHub Actions repository variable of the same name.
4. Deploy `supabase/functions/mahjong-voice-autofix-trigger/index.ts` as Edge Function named **`mahjong-voice-autofix-trigger`** with JWT verification enabled. The function needs existing Supabase-provided `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` environment variables.
5. Confirm that the existing GitHub Actions `Gemini Voice Parser Auto-Fix` workflow is enabled, that `MAHJONG_VOICE_AUTO_MODE=development` is configured in repository variables, and the workflow secrets required by `scripts/voice-autofix.mjs` are present.
6. Test with a genuine user-confirmed correction: the browser inserts `voice_debug` to Supabase, then calls the Edge Function with the saved report ID. Check Edge Function logs and the new GitHub Actions run. The GitHub workflow performs baseline/regression tests and commits **only** `js/voice-parser.js` if verified; otherwise it safely does nothing.

## Security and behavior

- A signed-in admin/scorekeeper can request dispatch only for their **own**, recently inserted, explicitly confirmed correction. The server re-reads the report; the browser never supplies the correction contents to GitHub.
- Dispatch is deduplicated by report ID in the server-side ledger. GitHub Actions concurrency serializes workflow runs.
- In Stable mode, the server does not dispatch and GitHub workflow job is also skipped. Keep both mode settings synchronized.
- GitHub token is stored only in Supabase Edge Function secrets. The app remains usable if the Edge Function is not deployed or the dispatch fails; confirmed corrections remain saved for the daily scheduled workflow.
- A network timeout after GitHub accepted dispatch may cause a retry; GitHub workflow concurrency and regression checks are the final safeguards.
- No live device/browser/Supabase integration tests were performed in the ZIP build environment. Verify on iPhone Safari and Android after deployment.
