# Mahjong Score v15.6.92 — Upload via GitHub Desktop

1. Clone the repository using GitHub Desktop if not already cloned.
2. Select **main** in Current Branch. Do not create another branch.
3. Extract this ZIP into a temporary folder, then copy its **contents** (including hidden `.github`, `.gitignore`, `.nojekyll`) into the local repository folder. Do not replace/delete the local `.git` folder.
4. GitHub Desktop → Changes: review changes; commit `Update Mahjong Score to v15.6.92`; Push origin.
5. Server-side setup is separately required: apply `supabase_latest.sql`, deploy Edge Function `mahjong-voice-autofix-trigger`, and configure Supabase secrets `GITHUB_AUTOFIX_TOKEN` and `MAHJONG_VOICE_AUTO_MODE=development` (or `stable`). Do not put secrets in frontend/GitHub repository.
6. Check GitHub Actions and Supabase Function logs. Browser cache/PWA may require reload after deployment.

Important: GitHub ZIP is a source snapshot, not a Git repository. Never overwrite the `.git` folder.
