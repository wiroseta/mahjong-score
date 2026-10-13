# Stage 21 — Local logout isolation (13 October 2026)

- Changed `index.html` `logoutMahjong()` to call `mahjongSupabase.auth.signOut({scope:'local'})` explicitly.
- This prevents intentional global Supabase sign-out from revoking other browser refresh sessions. It does **not** implement single-device enforcement, session takeover, or server-side writer revocation.
- `preview_test.html` remains an independent preview fixture, not changed.
- Cloud Sync safety gate remains OFF; DO NOT DEPLOY pending two-browser manual acceptance and server-side enforcement.
- Local command: `node --test tests/*.test.cjs` -> 623 PASS, 0 FAIL.
- Manual checks required: login same scorekeeper Chrome/Firefox; logout Chrome; Firefox remains authenticated; test reverse direction; verify old-device writer revocation separately after server-side integration.

GitHub Desktop Summary: `Stage 21: Scope logout to current browser`
GitHub Desktop Description: `Use explicit Supabase local sign-out in production app to avoid cross-browser global logout. 623 local tests pass. Cloud Sync remains disabled; automatic takeover still pending.`
