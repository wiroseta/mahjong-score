# Stage 230 — Isolated browser trial, NOT production release

Deploy this archive to GitHub Pages repository root only if you accept testing against the EXISTING Supabase project. Root `/mahjong-score/` stays Cloud Sync OFF; `/mahjong-score/cloud-trial/` has Cloud Sync ON. Do not copy trial files over root.

This is an intentionally separate browser trial path, not a validated Cloud Sync production release. Server-side RPC migration is NOT included. Existing database sessions and game state are shared with the production path; test using a disposable game and account only. In particular, do not test with any valuable ongoing game.

No GitHub push or live browser test has been performed by the assistant. Release gates requiring Cloud Sync OFF are not proof that trial Cloud Sync ON is safe. The trial uses the same app origin and browser storage as root; avoid opening both paths within the same browser profile. Prefer Chrome and Firefox as separate browsers. Cloud Sync trial can revoke a current writer session.

GitHub Desktop Summary: test: add isolated Cloud Sync browser trial route
GitHub Desktop Description: Keep root Cloud Sync OFF and add cloud-trial/ with Cloud Sync ON for controlled Chrome-to-Firefox browser testing against existing Supabase. No database migration. Not approved for production scoring.

Rollback: delete cloud-trial/; root index.html remains Cloud Sync OFF.
