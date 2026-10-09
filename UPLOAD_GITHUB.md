# Mahjong Score v15.6.91 — GitHub Desktop

1. In GitHub Desktop, Fetch origin and switch to **main**, then Pull origin.
2. Create a new branch from main named `update-v15.6.91`.
3. Click **Show in Finder** and copy ALL contents of this ZIP into the repository root (not a nested folder). Replace matching files. Do not copy .DS_Store.
4. Review Changes; commit `Update Mahjong Score to v15.6.91`.
5. Publish branch, create a Pull Request targeting main, wait for Voice Parser Regression green, then merge.
6. Wait for Pages deployment; test Free Voice correction with admin and confirm Supabase queue status.

No new SQL/Edge Function is included. Existing voice diagnostic table, grants and GitHub Actions secrets must be configured as in v15.6.90. No automatic merge.
