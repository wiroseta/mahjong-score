# v15.6.86 — Gemini Auto-Fix (parser only)

## Scope
Only `js/voice-parser.js` may be changed by Gemini. `index.html`, SQL, Supabase functions, score logic, and UI remain unchanged. Infrastructure files (`.github/workflows`, `scripts`, `tests`) are created once by this release, not edited by Gemini.

## Required GitHub setup (one-time)
1. Upload the ZIP contents to the repository default branch (`main` expected; if using another branch, adjust `voice-parser-guard.yml`). Enable GitHub Actions.
2. Add GitHub Actions repository secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, and `VOICE_AUTOFIX_GH_TOKEN` (a fine-grained GitHub token with repository Contents read/write and Pull requests read/write). **Never put secrets in frontend code.** The existing Supabase Gemini secret does NOT automatically transfer to GitHub.
3. Keep automatic merge DISABLED. Protect `main` with the required check **Voice Parser Regression** (job `Voice Parser Regression` from `Voice Parser Guard`), and require pull-request review before merging. If an old required check is stuck at “Expected”, update its name in GitHub branch protection to match the actual reported check.
4. Auto-Fix runs **manually only** from Actions → Gemini Voice Parser Auto-Fix → Run workflow. There is no scheduled trigger.
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

Do not fabricate `confirmed_by_user` or treat AI guesses as truth. Capturing confirmation automatically from final user-approved score requires a future **separate application integration**, which is explicitly outside the parser-only-change restriction. Without that integration or verified data, the manual pipeline is a safe no-op.

## Safeguards
- Baseline regression must pass *before* and *after* a proposal.
- All confirmed examples from the last 100 reports are tested against the proposed parser.
- Gemini returns one exact search/replace; rejected if ambiguous, too large, changes function declarations, or introduces obvious dangerous APIs.
- Only `js/voice-parser.js` is included in PR; separate PR guard rejects all other changed files.
- Automatic merge is disabled. A proposed Pull Request must be reviewed and merged manually after required checks pass.
- These checks reduce risk, but cannot prove semantic correctness or automatically roll back an undetected regression. Consider a staging/canary workflow before enabling unattended production merges.


## v15.6.90
Workflow now runs daily at 02:00 UTC (09:00 WIB) or manually; only creates a parser-only PR, never merges. In Voice Diagnostic > Voice Debug, administrator may explicitly confirm a failed Safari Quad transcript with player and count. This uses existing Supabase diagnostic queue and human-confirmed schema.
