# v15.6.86 — Gemini Auto-Fix (parser only)

## Scope
Only `js/voice-parser.js` may be changed by Gemini. `index.html`, SQL, Supabase functions, score logic, and UI remain unchanged. Infrastructure files (`.github/workflows`, `scripts`, `tests`) are created once by this release, not edited by Gemini.

## Required GitHub setup (one-time)
1. Upload the ZIP contents to the repository default branch (`main` expected; if using another branch, adjust `voice-parser-guard.yml`). Enable GitHub Actions.
2. Add GitHub Actions repository secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, and `VOICE_AUTOFIX_GH_TOKEN` (a fine-grained GitHub token with repository Contents read/write and Pull requests read/write). **Never put secrets in frontend code.** The existing Supabase Gemini secret does NOT automatically transfer to GitHub.
3. Enable repository **Allow auto-merge**. Protect `main` with required status check `regression` from `Voice Parser Guard`, require pull requests before merging, and disable bypass for the bot. Otherwise the auto-merge step will not safely complete. Verify actual workflow check name in GitHub.
4. The workflow runs daily 02:17 UTC, or manually from Actions → Gemini Voice Parser Auto-Fix → Run workflow.
5. Confirm the Supabase table `mahjong_voice_diagnostics` has `created_at`, `kind`, `details`, `id` columns; the workflow reads recent `voice_debug` rows.

## Critical limitation: no confirmed corrections yet
v15.6.85 logs raw voice debug but does not yet produce `details.confirmed_correction`. The worker **deliberately does nothing** until a human-confirmed correction exists, in this exact JSON format:

```json
{
  "confirmed_correction": {
    "confirmed_by_user": true,
    "input": "Andi Huda Yeni",
    "names": ["Andi", "Yenny", "Ferry", "Ari"],
    "expected": {"method":"hu","winner":0,"discarder":1}
  }
}
```

Do not fabricate `confirmed_by_user` or treat AI guesses as truth. Capturing confirmation automatically from final user-approved score requires a future **separate application integration**, which is explicitly outside the parser-only-change restriction. Without that integration or verified data, the scheduled pipeline is a safe no-op.

## Safeguards
- Baseline regression must pass *before* and *after* a proposal.
- All confirmed examples from the last 100 reports are tested against the proposed parser.
- Gemini returns one exact search/replace; rejected if ambiguous, too large, changes function declarations, or introduces obvious dangerous APIs.
- Only `js/voice-parser.js` is included in PR; separate PR guard rejects all other changed files.
- Auto-merge requires repository protection and successful checks; failed tests stop the workflow.
- These checks reduce risk, but cannot prove semantic correctness or automatically roll back an undetected regression. Consider a staging/canary workflow before enabling unattended production merges.
