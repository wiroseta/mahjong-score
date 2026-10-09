# Upload v15.6.90 through GitHub Desktop

1. Extract this ZIP; copy its **contents** (not the enclosing folder) into your local `mahjong-score` repository. Do not delete `.git` or any existing files first.
2. In GitHub Desktop: Fetch origin, switch to `main`, Pull origin, then create a new branch `update-v15.6.90` **from the updated main**. Do this before copying files if possible.
3. Review Changes, uncheck `.DS_Store` files, commit `Update Mahjong Score v15.6.90 Quad Auto-Fix`, Publish branch, Create Pull Request into `main`.
4. Wait for `Voice Parser Regression` to pass, inspect Files changed, then merge manually.
5. Confirm GitHub Pages displays v15.6.90. In Administrator > Voice Diagnostic > Voice Debug, test Safari voice and choose `Konfirmasi Koreksi Quad`; confirm only after reviewing player and amount. This sends text only, does not change score.
6. Gemini Auto-Fix scheduled daily 09:00 WIB; check Actions logs and PRs. Requires configured SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY, VOICE_AUTOFIX_GH_TOKEN. GitHub Actions schedules may be delayed. Automatic merge remains disabled.

No SQL or Edge Function deployment is included. Existing v15.6.89 features remain unchanged except documented changes.
