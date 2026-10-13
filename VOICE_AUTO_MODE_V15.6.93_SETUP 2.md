# v15.6.93 — deployment checklist

1. Upload the changed application files and the new `supabase/functions/mahjong-voice-auto-mode/index.ts` plus updated `mahjong-voice-autofix-trigger/index.ts` to the repository main branch. Do not overwrite `js/voice-parser.js` with an older revision.
2. Deploy both Supabase Edge Functions: `mahjong-voice-auto-mode` (new) and `mahjong-voice-autofix-trigger` (updated). JWT verification must remain enabled. No SQL migration is required.
3. The existing Supabase secret `GITHUB_AUTOFIX_TOKEN` must permit GitHub Actions **Variables: Read and write** and **Actions: Write** on `wiroseta/mahjong-score`. Fine-grained tokens may need an updated permission grant. Never put the token in the frontend.
4. Keep GitHub Actions repository variable `MAHJONG_VOICE_AUTO_MODE` set to `development` or `stable`. The UI updates this variable; scheduled workflow already checks it.
5. Test admin Setting: switch to Stable, verify the GitHub variable becomes `stable`, and confirm the scheduled job is skipped and the manual trigger refuses to dispatch. Switch back to Development and confirm variable `development`. Confirm non-admin cannot invoke the mode endpoint.
6. Important limitation: a workflow that has already started before a mode switch may finish; the current workflow checks the variable only at job start. For strict mid-run cancellation, add a pre-push mode recheck in a later controlled change.
7. Version is v15.6.93 throughout active app surfaces. Historical changelog and setup documents retain historical version labels intentionally.
