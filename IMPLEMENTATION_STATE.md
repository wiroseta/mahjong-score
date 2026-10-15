## v15.8 — Stage 284 repository cleanup and unified version (2026-10-15)

- Versi aktif aplikasi: **v15.8** (UI utama dan Cloud Trial, About, voice diagnostic, manifest, service-worker cache).
- Stage 282–284: konsolidasi dokumentasi/SQL historis, relokasi fixture pengujian, penghapusan duplikat `sw 2.js`, dan pembaruan jalur referensi.
- Tidak mengubah database Supabase atau menjalankan deployment.
- Riwayat versi sebelumnya di bawah dipertahankan sebagai catatan historis.

## Stage 17 activation candidate (2026-10-13)
Cloud bridge enabled in candidate ONLY; production RPCs remain unverified and may not be installed. See STAGE17_ACTIVATION_STATUS.md.


## Stage 17 — Isolated staging handoff (2026-10-13)
Prepared isolated staging setup checklist and 5 new release-guard regression tests. No staging project created, no real Auth sessions, no SQL installed, and no two-device acceptance tests executed. Awaiting user creation of empty staging project. Cloud Sync OFF / DO NOT DEPLOY.

## Stage 17 — Staging Auth test handoff (2026-10-13)
- Added real Auth two-device acceptance protocol (12 scenarios), **not executed**.
- Supabase production ACL and RLS previously inspected; no new production operations.
- Candidate five-RPC SQL still blocked by fail-closed sentinel. Cloud Sync OFF / DO NOT DEPLOY.

## Stage 17 final security gate — 2026-10-13
See `STAGE17_FINAL_RELEASE_GATE.md`; Supabase ACL/RLS evidence reviewed, five transfer RPCs still not installed, DO NOT DEPLOY.


## Stage 17 — ACL exact read-only follow-up (2026-10-13)
- User supplied 5 RPC catalog rows: anon EXECUTE false on all; authenticated true for account_permissions, is_admin, peek.
- `explicit_public_grant_heuristic=true` for all five is **not conclusive**. It is a string heuristic, not exact ACL parsing.
- Added `STAGE17_RPC_EXACT_ACL_READONLY.sql`, using `aclexplode(COALESCE(proacl, acldefault(...)))` to inspect PUBLIC, owner, privileges and required table RLS independently.
- This is SELECT-only; it does not install the five transfer RPCs or update the production validator.
- **Pending**: user executes and returns BOTH result sets; verify ACL and RLS before installation review.
- GitHub Desktop Summary: `v15.7.15 - Add exact RPC ACL and RLS read-only verification`
- GitHub Desktop Description: `Replace inconclusive PUBLIC grant heuristic with exact catalog ACL inspection; inspect RLS of four tables; no production changes, cloud sync remains off.`

# Stage 17 — Catalog security preflight gate (2026-10-13)

- New `STAGE17_CATALOG_SECURITY_GATE_READONLY.sql` checks four required tables/RLS and installed RPC catalog signatures/privileges using read-only SELECTs.
- This is an inspection tool, **not** proof that the five RPCs are safe. `NOT_INSTALLED` for five RPCs is expected.
- Prior temporary validator: 12/12 PASS. Production validator: nine malformed payloads still accepted.
- Candidate remains fail-closed; `supabase_latest.sql` unchanged and not install-ready.
- No PostgreSQL execution performed in this step. No changes to Supabase or deployment.
- GitHub Desktop Summary: `v15.7.15 - Add read-only RPC catalog security gate`
- GitHub Desktop Description: `Inspect RLS, installed functions and EXECUTE permissions without writes; retain fail-closed candidate and Cloud Sync OFF.`


---
# Stage 17 — Combined integration/security gate (2026-10-13)

**Result:** Local static contract and Node regression only. Real PostgreSQL five-RPC runtime and two-device Auth takeover NOT tested. **DO NOT DEPLOY; Cloud Sync OFF.**

- Bundled fail-closed five-RPC review candidate: `STAGE17_COMBINED_FIVE_RPC_INTEGRATION_REVIEW_ONLY.sql`; sentinel intentionally prevents execution.
- Added catalog-only SQL `STAGE17_COMBINED_PREFLIGHT_READONLY.sql` to inspect installed RPC signatures, security-definer, owner, RLS, and routine privileges without mutations.
- `supabase_latest.sql` deliberately unchanged: old foundation, **not** a final deployable migration.
- User-confirmed temporary hardened validator: 12/12 PASS. Existing production validator: 9 malformed-history cases incorrectly accepted; not fixed in production.
- Remaining mandatory gates: PostgreSQL compile/transaction test of complete RPC candidate on isolated clone; verify Auth privileges, grants, RLS, concurrency, role toggles, revocation; verified restore; real two-device takeover and lossless history; explicit installation/deployment approval.
- GitHub Desktop Summary: `v15.7.15 - Combined five RPC integration safety gate (no deploy)`
- GitHub Desktop Description: `Add fail-closed consolidated RPC review and read-only catalog preflight; add static regression tests and preserve unchanged production SQL. No deploy.`

---

## Stage 17 Step 35 — RPC static security contract audit

9 new static contract tests added. Five RPC reviewed; real Auth / PostgreSQL concurrency not yet proven. Production SQL unchanged. See STAGE17_STEP35_RPC_SECURITY_AUDIT.md. DO NOT DEPLOY.

# Stage 17 — Step 34: Candidate validator consolidation and RPC security gate (2026-10-13)

## Confirmed
- User-provided PostgreSQL output: 12/12 temporary validator fixtures match expectations; nine malformed history payloads rejected.
- Exact normalized SQL body of candidate `public.mahjong_sync_valid_game(jsonb)` now equals the `pg_temp` function exercised by Step 32, after replacing schema qualifier (whitespace-normalized comparison).
- Four `trim(leading...)` occurrences standardized to `ltrim(...)` for parity with the tested temporary function. Note: unqualified PostgreSQL `trim(leading...)` is not intrinsically invalid syntax; this is a consistency edit, not evidence of a SQL syntax failure.
- Existing production validator is still weaker (nine invalid history cases accepted in Step 29). Production has not been updated.
- `supabase_latest.sql` remains byte-identical to the previous checkpoint. The Stage 14 candidate retains its intentional fail-closed exception at the top; DO NOT EXECUTE.

## Still blocked
- No live PostgreSQL execution of the combined five-RPC candidate, no transaction/privilege security proof for full installation, no authenticated two-device takeover test, no restore drill.
- `pg_temp` validator success does NOT certify the entire candidate or install readiness. Cloud Sync OFF, DO NOT DEPLOY.
- Do not remove fail-closed guard, install candidate, modify production schema, or enable cloud sync without explicit approval and full integration gates.

## GitHub Desktop (only if user elects to commit local work)
Summary: `v15.7.15 - Consolidate validated SQL candidate without deployment`
Description: `Align isolated PostgreSQL-tested history validator with fail-closed RPC candidate; preserve production SQL; document 12/12 temporary fixture results and remaining security gates. Cloud Sync OFF, DO NOT DEPLOY.`

---

Node regression executed: 581 PASS, 0 FAIL.

# Stage 17 Step 32 — candidate validator runtime parity gate

- Confirmed user-reported production mismatch: **9/12** invalid history fixtures accepted by production validator; 3/12 match.
- Created `STAGE17_STEP32_CANDIDATE_PARITY_ROLLBACK_REVIEW_ONLY.sql` to compare the **candidate full-game validator** with 12 fixtures in `pg_temp`, inside `BEGIN ... ROLLBACK`. No permanent database objects intended.
- The source function is extracted from `supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql`; its four integer-trimming expressions are rewritten to unqualified `ltrim` in the isolated copy. Original draft is not changed.
- **PostgreSQL execution NOT DONE**. 12/12 candidate parity NOT claimed; SQL must be reviewed before running.
- The existing draft's history checks are a candidate only; three-way equivalence remains unproven. `supabase_latest.sql` unchanged.
- Do not install the five RPCs, enable Cloud Sync, or deploy.
- GitHub Desktop Summary: `v15.7.15 - Add isolated candidate history parity test`
- GitHub Desktop Description: `Prepare 12-fixture rollback-only PostgreSQL candidate validator test; document production 9/12 gap; preserve inactive SQL and deployment block.`

---
# IMPLEMENTATION STATE — Stage 17 Step 31 (2026-10-13)

- Cloud Sync OFF; DO NOT DEPLOY. No Supabase SQL installed or production changes.
- Production validator mismatch: 9 of 12 shared fixtures accepted when hardened validator expected rejection (user-supplied SQL results). 3 of 12 match.
- Isolated hardened validator: 12/12 PASS (user-supplied results). Candidate-vs-hardened runtime parity remains OPEN.
- Documentation: archived original stage/checkpoint markdown verbatim into CHANGELOG.md; removed originals except 5 legacy Markdown files still required by regression/preflight checks.
- SQL: unreferenced historical SQL moved losslessly as base64-encoded, SHA256-tagged comments in supabase_schema_history.sql. Test-referenced historical SQL retained as fixtures until tests are refactored; NOT executable.
- supabase_latest.sql unchanged; not approved for execution.
- Next: refactor SQL fixture tests to use explicit fixture locations; prove candidate validator parity using PostgreSQL rollback harness; then review one active SQL.
- GitHub Desktop Summary: `v15.7.15 - Consolidate stage notes and archive unused SQL`
- GitHub Desktop Description: `Merge historical stage notes into CHANGELOG; archive unreferenced SQL losslessly; retain test-dependent SQL; document 9 production validator mismatches. No deploy or Supabase changes.`

---

# IMPLEMENTATION STATE — CURRENT GATE (2026-10-13, Stage 17 Step 29)

- Cloud Sync OFF; DO NOT DEPLOY. No Supabase writes or installation authorized.
- Node baseline: 581 PASS previously reported; new test run status recorded below.
- Isolated history validator: 12/12 PASS **as reported by user from Supabase**.
- New file `STAGE17_STEP29_PRODUCTION_VALIDATOR_GAP_READONLY.sql`: read-only, 12 shared fixtures against the **existing production** `public.mahjong_sync_valid_game`; this does NOT compare the uninstalled candidate RPC validator. The expected mismatch for malformed history is diagnostic.
- Three-way parity remains OPEN: production, isolated, and candidate RPC validator have not been executed side-by-side in PostgreSQL.
- `supabase_latest.sql` intentionally unchanged; do not paste unapproved candidate RPCs into active SQL.
- Next: collect Step29 read-only output, compare observed gaps, then construct a safe isolated candidate parity harness.
- GitHub Desktop Summary: `Stage 17 Step 29 - Add read-only production validator gap audit`
- GitHub Desktop Description: `Add 12-fixture read-only SQL audit and update implementation state; no runtime, production SQL, or deployment changes.`

---

# Mahjong Score — Implementation State

Updated: 2026-10-13 | v15.7.15 | STAGE17 Step 28

- Re-ran Node regression: **581 PASS / 0 FAIL**.
- Static comparison of candidate validator vs isolated history validator; **PostgreSQL parity NOT YET TESTED**.
- Fixed four `trim(leading...)` calls only in a **review-only SQL copy**; original candidate retained.
- Added `STEP28_VALIDATOR_PARITY_FINDINGS.md`; no database changes.
- `supabase_latest.sql` remains unchanged and NOT APPROVED FOR EXECUTION.
- Five RPCs remain uninstalled, Cloud Sync OFF, DO NOT DEPLOY.

GitHub Desktop Summary: `v15.7.15 - Review validator parity and correct draft SQL syntax`
GitHub Desktop Description: `Review Stage 14/17 validator differences, correct four ltrim expressions in non-deployable review copy, rerun 581 Node tests. No production SQL or cloud sync changes.`

## Earlier state

# Mahjong Score — Implementation State

Updated: 2026-10-13 | v15.7.15 | STAGE17 Step 27

## Current checkpoint and cleanup
- **581/581 Node tests PASS**, rerun after removing historical `*.log` snapshots (not test sources).
- **12/12 isolated PostgreSQL fixtures PASS**, based on user-provided results; not rerun in this step.
- Removed **76 archived `.log` files** from ZIP after verifying tests pass without them. Kept SQL draft/test fixtures and regression source files; no SQL files deleted.
- SQL candidate `supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql` contains detailed history validation; production `supabase_latest.sql` is an older foundation. Parity NOT established.
- Candidate validator uses `trim(leading ...)` in SQL expressions; isolated fixture required `ltrim` correction. **Do not execute candidate** until compilation and parity checks complete.
- `supabase_latest.sql`: old foundation, **DO NOT EXECUTE**. `supabase_schema_history.sql`: archive. No production changes.
- Five transfer RPCs not installed; Cloud Sync OFF; **DO NOT DEPLOY**.

## GitHub Desktop (checkpoint only; no deployment)
Summary: `v15.7.15 - Remove redundant test logs and track validator parity`
Description: `Remove historical .log snapshots after 581 passing Node tests. Document SQL candidate/production parity gaps and preserve all SQL drafts and regression tests. Cloud Sync remains off; do not deploy.`

## Historical implementation state
# Mahjong Score — Implementation State

Updated: 2026-10-13 | v15.7.15 | STAGE17 Step 26

## Deployment gate
- Cloud Sync: OFF. DO NOT DEPLOY.
- Five transfer RPCs: not installed in production (per last read-only verification).
- Existing `supabase_latest.sql` is an older v15.7.14 foundation and **NOT approved for execution**. It has not been replaced with unverified candidate SQL.
- Isolated PostgreSQL validator: 12/12 PASS as reported by user. Node suite: 581 PASS previously reported, not rerun in this packaging step.
- Parity of production/candidate/isolated validators remains unproven.
- Actual two-device login, revocation, and cloud game restore still untested.

## Step 26 packaging actions
- Consolidated individual stage reports into this file, preserving their full text below.
- Consolidated SQL candidates and rollback-only tests into `SQL_REVIEW_ARCHIVE_DO_NOT_EXECUTE.md`; no SQL logic modified.
- Renamed misspelled `supabase_scheme_history.sql` to `supabase_schema_history.sql`.
- Kept source code, regression tests, assets, tools, README and CHANGELOG.
- `supabase_latest.sql` intentionally unchanged, with an explicit safety banner.

## Next actions
1. Verify validator parity with identical PostgreSQL fixtures; resolve differences in a single candidate.
2. Audit exact five RPC bodies against actual production schema and auth semantics.
3. Only after review, prepare a *new* executable `supabase_latest.sql` and request explicit approval before installation.
4. Perform real two-device end-to-end tests before enabling sync.

## Historical implementation notes (verbatim)

---

### Source: AUTO_FIX_SETUP.md

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


---

### Source: AUTO_FIX_V15.6.92_SETUP.md

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


---

### Source: CHECKPOINT_STAGE13_357_CONCURRENT_COMMIT.md

# Checkpoint Stage 13 — 357 PASS — 12 Oktober 2026

Status: pengembangan lokal saja. Cloud Sync OFF. DO NOT DEPLOY.

## Pekerjaan
- Menambahkan `tests/sync-stage13-concurrent-commit-guards.test.cjs` berisi 3 pengujian regresi statis.
- Memeriksa urutan kunci baris pemilik akun sebelum kunci baris game dan UPDATE game pada `mahjong_sync_commit`.
- Memeriksa validasi writer aktif, revoked_at, hash token, generation, identitas sesi Auth, dan relasi writer game sebelum UPDATE.
- Memeriksa penolakan konflik revision sebelum UPDATE serta increment revision pada jalur sukses.
- Menjalankan `node --test tests/*.test.cjs`: 357 PASS, 0 FAIL. Log `tests/stage13_concurrent_commit_20261012.log`.

## Batasan
- Pengujian adalah audit statis struktur SQL; tidak mensimulasikan dua transaksi PostgreSQL sungguhan.
- Tidak ada PostgreSQL langsung, Supabase produksi, atau deploy.
- Audit ini tidak membuktikan serialisasi runtime, validasi payload penuh, atau penolakan race dalam lingkungan nyata.
- Tahap 13 masih berjalan; tahap lain yang belum selesai tidak berubah.

## Berikutnya
- Siapkan skenario integrasi transaksi paralel yang aman di PostgreSQL terisolasi bila runtime tersedia.
- Tinjau konsistensi SQL draft/review dan otorisasi seluruh RPC sebelum migrasi.

## GitHub Desktop
Summary: `v15.7.15 - Add concurrent commit safety guards`

Description: `Add 3 static regression tests for owner/game lock order, exact writer lease validation, and stale revision rejection before score update. 357 local Node tests PASS, 0 FAIL. Cloud Sync OFF. DO NOT DEPLOY.`


---

### Source: CHECKPOINT_V15.7.15_PENGEMBANGAN.md

# CHECKPOINT — Mahjong Score 4P PWA v15.7.15 (12 Oktober 2026)

**PENTING: ZIP INI UNTUK MELANJUTKAN PENGEMBANGAN, BUKAN UNTUK DEPLOY KE GITHUB PAGES.**
Jangan menjalankan `supabase_sync_rpc_draft.sql`: terdapat pengaman `RAISE EXCEPTION` dan fungsi RPC belum disetujui untuk production.

## Supabase production (berdasarkan hasil SQL yang dikirim pengguna)
- SELESAI: 4 tabel fondasi `mahjong_device_sessions`, `mahjong_game_states`, `mahjong_sync_conflicts`, `mahjong_session_audit`; RLS ON, akses tabel langsung ditutup.
- SELESAI: fungsi `mahjong_sync_is_admin`, `mahjong_sync_generate_token`, `mahjong_sync_account_permissions`.
- SELESAI: kolom `auth_session_id` dan `is_current`, serta perintah pembuatan indeks unique current-game dijalankan tanpa error.
- SELESAI: `mahjong_sync_valid_game(jsonb)` terpasang dan 4 contoh validasi PASS.
- SELESAI: `mahjong_sync_peek()` terpasang dan permission authenticated diverifikasi; BELUM ada bukti uji panggilan autentikasi dari browser.
- SELESAI: SQL compile dry-run dan runtime smoke dry-run di Supabase; keduanya ROLLBACK.
- Tabel sinkronisasi seluruhnya kosong saat terakhir diperiksa (0 sesi, 0 game, 0 konflik).
- Satu admin aktif memiliki 2 sesi belum kedaluwarsa; empat scorekeeper diblokir. Jangan mengubah status akun tanpa izin.
- BELUM: RPC open/commit/lease/read/open_reader terpasang permanen, uji Supabase Auth end-to-end, dan uji 2 perangkat.

## Implementasi lokal
- Ada `js/sync-engine.js`, `js/sync-app-bridge.js`, `js/sync-supabase-adapter.js`, `js/sync-device-id.js`, dan integrasi di `index.html`.
- `MAHJONG_CLOUD_SYNC_ENABLED=false` — harus tetap OFF sampai acceptance test nyata selesai.
- Pengambilalihan cloud dengan backup lokal, penolakan lease yang tidak valid, serta antrean penyimpanan sedang dikembangkan.
- Draf SQL masih diawali pengaman yang sengaja membuatnya gagal bila dijalankan.

## Hasil verifikasi terbaru yang JUJUR
- `node --test tests/sync-engine.test.cjs tests/sync-app-bridge.test.cjs`: 88/88 PASS.
- `node --test tests/*.test.cjs`: **175 PASS, 8 FAIL dari 183** (pengujian adopsi identik, tes statis save() yang sudah berubah, dan transport mock yang belum mengikuti `mahjong_sync_peek`). Jangan mengklaim seluruh tes PASS.
- Kegagalan ini harus diaudit; jangan asal menyesuaikan tes agar hijau.

## Tahap pekerjaan tersisa
1. Audit dan perbaiki 8 pengujian gagal, periksa apakah bug aktual atau test fixture usang.
2. Cocokkan skema state asli Mahjong (termasuk riwayat, Quad, kombinasi, dealer, angin) dengan validator SQL dan JS.
3. Audit keamanan RPC SQL (auth session, banned accounts, token hash, writer lease, serialisasi login, revision CAS, RLS, conflict persistence), tanpa mengubah data production.
4. Jalankan pengujian integrasi PostgreSQL yang representatif dan uji skenario auth/token secara non-destruktif.
5. Berikan SQL final satu blok siap copy-paste untuk pemasangan RPC; tunggu hasil pengguna, jangan pasang draf.
6. Uji pemanggilan RPC authenticated dan penolakan sesi lama, termasuk scorekeeper multi-device dan admin.
7. Audit dan rapikan bridge index.html: penyimpanan/antrean atomik, backup/adoption, logout, cache PWA, mode offline, dan Live Sharing.
8. Uji dua perangkat: login baru mengambil permainan lengkap, perangkat lama tak bisa menulis, riwayat aman, konflik dan pemulihan teruji.
9. Uji regresi keseluruhan, audit file/version/cache, aktifkan feature gate hanya setelah tahap 1–8 lolos.
10. Buat ZIP production final dan sertakan GitHub Desktop Summary + Description.

## Ketentuan pengguna
- Ketika pengguna mengetik `l`, lanjutkan pengerjaan dalam giliran tersebut; jangan memberi laporan progres kecuali interaksi diperlukan atau ZIP final siap.
- SQL berikutnya harus berupa blok kode langsung, bukan file unduhan.
- Untuk setiap ZIP versi baru, selalu sertakan GitHub Desktop Summary dan Description.
- Jangan menghapus skor/riwayat, mengubah permainan aktif, live sharing, akun, atau database production tanpa alasan dan verifikasi.

## Pembaruan 12 Oktober — audit test transport
- Simulasi transport `tests/sync-transport-integration.test.cjs` kini mengimplementasikan RPC `mahjong_sync_peek` yang memang dipanggil adapter aktual; menguji preflight -> open -> commit.
- Uji takeover yang tadinya mengharapkan penolakan permainan lokal berbeda kini memeriksa adopsi cloud yang otoritatif dan backup lokal, sesuai keputusan produk terbaru.
- Tiga pengujian transport terisolasi PASS. Ini bukan pengujian PostgreSQL nyata.
- **Sisa pengujian gagal** perlu diselidiki, khususnya test statis `save()` dan handler adopsi; jangan menganggap kode benar hanya karena fixture diperbarui.
- Urutan prioritas tetap: (1) audit kegagalan aktual, (2) validator skema riil, (3) audit RPC, (4) PostgreSQL integration, (5) SQL pemasangan, (6) auth, (7) bridge/offline, (8) dua perangkat, (9) regresi final, (10) ZIP final.

## PAUSE — 12 Oktober 2026 (checkpoint terbaru)
- Pengguna meminta PAUSE dan ZIP checkpoint untuk melanjutkan nanti.
- Pengujian ulang aktual pada worktree saat pause: `node --test tests/*.test.cjs` **186/186 PASS** (lihat `latest_sync_test_run.txt`). Ini menggantikan angka 175/183 lama dalam catatan historis; belum membuktikan integrasi PostgreSQL atau perangkat.
- Tahap 9 Sync Engine/Application Bridge: implementasi lokal dan pengujian lokal tersedia, belum production-verified.
- Tahap 10 pengujian regresi lokal: 186/186 PASS; regresi end-to-end belum.
- Tahap 11 kompatibilitas skor/Quad/kombinasi/riwayat: masih dalam pengerjaan, jangan nyatakan selesai.
- Tahap 12–19 audit RPC, PostgreSQL integration, pemasangan server, pengujian sesi, offline, dua perangkat, aktivasi, dan ZIP final masih terbuka.
- Supabase production terakhir: kolom auth_session_id dan is_current sudah dipasang, valid_game dan peek terpasang, tabel sinkronisasi kosong. Jangan ulang migrasi awal.
- Sinkronisasi tetap OFF; jangan deploy ZIP checkpoint ke GitHub Pages.
- Pengguna ingin SQL berikutnya langsung dalam blok kode copy-paste, satu langkah per giliran. Saat memberi ZIP versi baru sertakan GitHub Desktop Summary dan Description.

## PAUSE terbaru — 12 Oktober 2026 (setelah tahap 11)
- Tahap 11 (kompatibilitas skor, Quad, kombinasi, riwayat) MASIH DALAM PENGERJAAN; perlindungan metadata riwayat dan validasi Unicode JS/SQL telah dikembangkan secara lokal.
- Pengujian ulang nyata saat membuat checkpoint: `node --test tests/*.test.cjs` = 203 PASS, 0 FAIL (lihat `tests/checkpoint_test_run_20261012.txt`). Hasil ini BUKAN pengujian server PostgreSQL maupun perangkat nyata.
- Tahap 1–8 selesai sesuai laporan SQL Supabase pengguna; tahap 9 implementasi lokal; tahap 10 regresi lokal PASS; tahap 12–19 belum selesai.
- Database produksi: empat tabel sync RLS aktif, kolom `auth_session_id` dan `is_current` sudah ada, fungsi pendukung dan `mahjong_sync_peek()` terpasang; RPC open/commit/read/lease belum dipasang permanen.
- `MAHJONG_CLOUD_SYNC_ENABLED=false`; ZIP ini TIDAK BOLEH DEPLOY. `supabase_sync_rpc_draft.sql` adalah DRAF, jangan jalankan di production.
- Lanjut tepat dari Tahap 11, verifikasi kompatibilitas format data riil dan validasi SQL, lalu tahap 12 audit RPC keamanan. Jangan ulangi SQL yang sudah berhasil. SQL baru harus diberikan langsung sebagai blok copy-paste, satu langkah per giliran.
- Setiap ZIP production nanti sertakan GitHub Desktop Summary dan Description.

## LANJUT — 12 Oktober 2026 (checkpoint 236 PASS)
- Memulai dari ZIP pengguna bernama `233PASS_DO_NOT_DEPLOY(1).zip`; pengujian ulang 233/233 PASS.
- Tambah 3 regresi terisolasi untuk Unicode NUL/surrogate pada key dan value riwayat, Unicode supplementary valid, dan objek non-JSON dalam metadata riwayat. Pengujian ulang 236/236 PASS; log `tests/checkpoint_test_run_20261012_236.txt`.
- Review kode `js/sync-engine.js`, validator SQL draft, dan alur RPC open/commit: pemeriksaan lokal tidak sama dengan pengujian PostgreSQL, Supabase Auth, maupun dua perangkat. Tahap 11 tetap belum disahkan sampai uji data riil; Tahap 12 audit RPC masih terbuka.
- Tidak mengubah SQL production, tidak menyalakan feature flag, tidak deploy. Draf RPC tetap fail-closed.

## LANJUT — 12 Oktober 2026 (checkpoint 239 PASS)
- Melanjutkan dari checkpoint ZIP 236 PASS; seluruh 236 tes baseline diverifikasi ulang PASS.
- Audit statis keamanan RPC menemukan bahwa REVOKE untuk `mahjong_sync_open` dan `mahjong_sync_commit` ditempatkan di bagian akhir draf SQL, bukan langsung setelah definisi fungsi; pengujian awal yang mengasumsikan posisi REVOKE dekat fungsi dikoreksi setelah memeriksa file lengkap. Tidak ada perubahan SQL.
- Tambahkan 3 pengujian kontrak keamanan `tests/sync-rpc-security-contract.test.cjs`: pengaman fail-closed SQL, pengikatan commit ke Auth session/token/generation, dan SECURITY DEFINER/search_path serta REVOKE. Ini tes statis, BUKAN bukti keamanan PostgreSQL nyata.
- `node --test tests/*.test.cjs`: **239 PASS, 0 FAIL**; log `tests/checkpoint_test_run_20261012_239.txt`.
- Tahap 11 masih perlu verifikasi data riil; Tahap 12 audit RPC sedang berjalan; SQL draf tidak boleh dijalankan. Cloud sync tetap OFF. Tidak ada perubahan production/GitHub.

## LANJUT — 12 Oktober 2026 (checkpoint 241 PASS)
- Mulai dari ZIP 239 PASS yang diberikan pengguna; tambah dua tes kontrak statis `tests/sync-rpc-takeover-guards.test.cjs` untuk urutan preflight sebelum revokasi writer, serta lock account/game dan CAS revision sebelum commit.
- Satu asumsi tes awal keliru tentang format pengembalian `revision-conflict`; diperbaiki setelah inspeksi SQL nyata (bukan mengubah kode SQL).
- `node --test tests/*.test.cjs`: 241 PASS, 0 FAIL; log `tests/checkpoint_test_run_20261012_241.txt`.
- Belum ada uji PostgreSQL nyata, Supabase Auth, atau dua perangkat. Tahap 11/12 belum dinyatakan selesai. Cloud sync OFF; SQL draft fail-closed; DO NOT DEPLOY.

## LANJUT — 12 Oktober 2026 (Tahap 13 readiness, belum acceptance)
- Baseline ZIP 241 PASS diekstrak. Pengujian lokal dijalankan ulang.
- Pemeriksaan lingkungan: `psql`, `pg_ctl`/`initdb`, dan `docker` tidak tersedia. Tidak ada koneksi PostgreSQL/Supabase Auth uji; Tahap 13 **BLOCKED**, bukan PASS.
- Tambah tiga tes statis kesiapan Tahap 13: SQL fail-closed, rencana fixture disposable Supabase Auth, dan keberadaan RPC utama. Tes ini **tidak menggantikan** integrasi database nyata.
- Dilarang menghapus guard `UNSAFE DRAFT` atau memasang SQL pada production. Sinkronisasi tetap OFF.
- Untuk menuntaskan Tahap 13 diperlukan disposable Supabase/PostgreSQL yang kompatibel dengan auth/RLS, kemudian jalankan 15 skenario pada `POSTGRES_INTEGRATION_TEST_PLAN.md` dan simpan bukti PASS/FAIL.

## LANJUT — 12 Oktober 2026 (audit gerbang Tahap 13)
- Baseline 244 PASS diuji ulang: 244 PASS, 0 FAIL; log `tests/checkpoint_test_run_20261012_stage13_continued.txt`.
- Audit lanjutan dicatat pada `STAGE13_INTEGRATION_BLOCKERS.md`. Tahap 13 masih BLOCKED karena tidak ada disposable Supabase/PostgreSQL Auth+RLS untuk uji integrasi nyata.
- SQL draft tetap fail-closed; cloud sync OFF; tidak ada perubahan production atau deployment.

## LANJUT otomatis — 12 Oktober 2026 (checkpoint 248 PASS)
- Baseline checkpoint 244 PASS diuji ulang dan berhasil 244 PASS.
- Menambahkan preflight lingkungan Tahap 13 yang sepenuhnya read-only (`scripts/stage13-environment-preflight.cjs`) dan empat pengujian (`tests/sync-stage13-environment-preflight.test.cjs`). Tidak ada koneksi database, migrasi, atau deployment.
- Hasil aktual `node --test tests/*.test.cjs`: **248 PASS, 0 FAIL**. Log `tests/stage13_preflight_248pass.log`.
- Tahap 11 kompatibilitas data dan Tahap 12 audit RPC belum final; Tahap 13 BLOCKED sampai tersedia disposable PostgreSQL/Supabase Auth + RLS dan 15 skenario dijalankan. Cloud sync OFF, SQL draft fail-closed.
- GitHub Summary: `v15.7.15 - Add Stage 13 isolated environment preflight`
- GitHub Description: `Add read-only disposable PostgreSQL environment preflight and four regression tests. Verify 248 local tests pass. Stage 13 integration remains blocked; no production changes or deployment.`

## Checkpoint lanjutan 251 PASS — 12 Oktober 2026
Tahap 13: preflight target database diperketat (nama disposable, kredensial eksplisit, dan acknowledgment remote). Tiga tes ditambahkan. `node --test tests/*.test.cjs`: 251 PASS, 0 FAIL. Bukti `tests/stage13_preflight_251pass.log`. Tahap 11/12 belum final; Tahap 13 tetap BLOCKED menunggu disposable Supabase Auth/RLS. Tidak ada perubahan production/deploy. Rincian: `STAGE13_INTEGRATION_BLOCKERS.md`.

## Lanjutan Stage 13 — 254 PASS (12 Oktober 2026)
- Memperketat `scripts/stage13-environment-preflight.cjs` untuk menolak parameter query koneksi (termasuk potensi override host), fragmen URL, nama database dengan separator ter-encode, dan hostname multi-target ambigu.
- Menambahkan 3 tes regresi untuk query override, fragmen URL, dan separator nama database ter-encode.
- Pengujian aktual `node --test tests/*.test.cjs`: **254 PASS, 0 FAIL**; log `tests/stage13_preflight_254pass.log`.
- Tahap 11 dan 12 belum final; Tahap 13 tetap BLOCKED karena tidak ada PostgreSQL/Supabase Auth terisolasi. Pemeriksaan URL bukan bukti database aman. SQL guard tetap utuh; cloud sync OFF; tidak ada deployment atau perubahan production.

## Lanjutan otomatis — 12 Oktober 2026 (validasi path ter-encode)
- Melanjutkan dari arsip berlabel 258 PASS. Hasil eksekusi ulang aktual pada worktree ini: **256 PASS, 0 FAIL** setelah dua pengujian baru; label 258 pada arsip sumber belum sesuai jumlah tes yang ditemukan, sehingga tidak diklaim 260 PASS.
- Memperketat `scripts/stage13-environment-preflight.cjs` agar menolak `%2e` (dot ter-encode) dan `%25` (percent ter-encode, termasuk double encoding) pada path database. Ini konservatif untuk target disposable.
- Menambahkan dua pengujian regresi di `tests/sync-stage13-environment-preflight.test.cjs`.
- Log pengujian: `tests/stage13_preflight_256_verified.log`.
- Tahap 13 masih BLOCKED: belum ada PostgreSQL/Supabase Auth disposable. Cloud Sync OFF, SQL guard tidak diubah, tidak ada deployment.

## Lanjutan 12 Oktober 2026 — 258 PASS terverifikasi
- Baseline ZIP `STAGE13_PATH_AUDIT_256VERIFIED_DO_NOT_DEPLOY.zip` diekstrak dan diuji ulang: 256 PASS, 0 FAIL.
- Ditemukan potensi `decodeURIComponent` melempar exception pada path URL database dengan percent encoding UTF-8 rusak. Preflight kini menangkap error dan menolak target secara fail-closed, tanpa menampilkan kredensial.
- Ditambahkan `tests/sync-stage13-malformed-url.test.cjs`: penolakan encoding rusak dan penerimaan konfigurasi disposable valid. Total tes `node --test tests/*.test.cjs`: **258 PASS, 0 FAIL**; log `tests/stage13_preflight_258verified.log`.
- Tidak ada koneksi PostgreSQL, pemasangan SQL, perubahan Supabase/GitHub, atau aktivasi cloud sync. Tahap 13 tetap BLOCKED sampai database Auth/RLS terisolasi tersedia.

## Lanjutan otomatis — 12 Oktober 2026 (261 PASS terverifikasi)
- Baseline 258 PASS dilanjutkan; preflight read-only menolak path database bertingkat, path dengan slash ganda, dan kredensial yang hanya berisi spasi setelah URL decoding.
- Tiga regresi baru ditambahkan di `tests/sync-stage13-environment-preflight.test.cjs`. Kegagalan awal pada kredensial `%20` ditemukan lalu diperbaiki menggunakan `decodeURIComponent` secara fail-closed.
- Pengujian aktual: `node --test tests/*.test.cjs`: **261 PASS, 0 FAIL**, bukti `tests/stage13_preflight_261verified.log`.
- Tahap 11/12 belum final; Tahap 13 BLOCKED sampai disposable PostgreSQL/Supabase Auth+RLS tersedia. Tidak ada database tersambung, SQL dijalankan, perubahan production, ataupun deploy. Cloud sync OFF.
- GitHub Summary: `v15.7.15 - Validate Stage 13 database paths and credentials`
- GitHub Description: `Reject nested and double-slash database paths and encoded blank credentials. Add three regression tests; verify 261 PASS. Cloud sync disabled; no production changes.`

## Lanjutan otomatis — 262 PASS (12 Oktober 2026)
- Baseline 261 PASS diuji ulang, kemudian preflight URL diperketat untuk menolak karakter kontrol pada kredensial PostgreSQL yang di-URL-encode.
- Satu tes regresi ditambahkan di `tests/sync-stage13-malformed-url.test.cjs`.
- Pengujian aktual `node --test tests/*.test.cjs`: **262 PASS, 0 FAIL**; log `tests/stage13_preflight_262verified.log`.
- Tahap 11 dan 12 belum final. Tahap 13 masih BLOCKED sampai ada Supabase/PostgreSQL Auth+RLS disposable; preflight tidak melakukan koneksi. Cloud sync OFF, SQL draft tidak dijalankan, tidak ada deployment.

## 12 Oktober 2026 — Pemeriksaan lokal PostgreSQL setelah 262 PASS
Lihat `STAGE13_LOCAL_POSTGRES_NEXT.md`. Suite 262 PASS, 0 FAIL dijalankan ulang. Pengguna mengonfirmasi PostgreSQL 17.11, database `mahjong_sync_test`, dan 0 tabel public. Migrasi fondasi memerlukan Supabase Auth roles dan schema; RPC draft masih fail-closed. Tidak ada SQL dipasang ke database pengguna dan tidak ada perubahan production.

## Lanjutan 12 Oktober — review RPC setelah PostgreSQL lokal dihapus
- Bukti pengujian Terminal PostgreSQL yang dilaporkan pengguna dan batasannya dirinci dalam `STAGE13_SECURITY_REVIEW_2026-10-12.md`.
- `supabase_sync_rpc_review.sql` diperbaiki untuk menolak role NULL dan tidak lagi membuat indeks current-game duplikat.
- Tiga tes regresi statis baru; `node --test tests/*.test.cjs` dijalankan aktual: **265 PASS, 0 FAIL**. Log `tests/stage13_review_security_20261012.log`.
- PostgreSQL lokal pengguna telah dihapus. Tidak ada verifikasi ulang PostgreSQL untuk file kandidat yang telah diperbarui.
- **DO NOT DEPLOY.** Cloud Sync OFF. Tahap 11/12/13 belum final.

## LANJUT — 12 Oktober 2026 (Stage 13: audit kontrak RPC)
- Ditemukan **ketidakcocokan serius**: `js/sync-supabase-adapter.js` memanggil `mahjong_sync_open` dengan empat parameter (`p_device_id`, `p_local_game`, `p_expected_revision`, `p_expected_game_id`), tetapi `supabase_sync_rpc_review.sql` hanya mendefinisikan dua parameter. Jika dipasang, panggilan RPC klien tidak cocok.
- Kandidat review juga tidak memiliki preflight revisi/game dan high-water mark sesi login yang terdapat pada `supabase_sync_rpc_draft.sql`. Menggunakan review SQL sebagai pengganti draft dapat menghilangkan perlindungan takeover dan sesi lama.
- Untuk mencegah eksekusi tak sengaja, `supabase_sync_rpc_review.sql` kini diawali `DO $$ ... RAISE EXCEPTION 'UNSAFE REVIEW...' $$;` sebelum perubahan schema; **file ini sengaja tidak dapat dijalankan**. Draft tetap fail-closed.
- Tambah 3 tes kontrak `tests/sync-rpc-review-compatibility.test.cjs` yang memverifikasi pengaman dan mendokumentasikan ketidakcocokan; ini tes statis, bukan uji PostgreSQL.
- Tindak lanjut: desain SQL kandidat terpadu dengan signature empat parameter, preflight atomik, high-water mark dan validasi skema, lalu uji PostgreSQL/Supabase Auth disposable sebelum deployment.
- Tidak ada perubahan production, Cloud Sync tetap OFF, DO NOT DEPLOY.

## LANJUT — 12 Oktober 2026 (Stage 13: client preflight pair, 271 PASS)
- Melanjutkan dari checkpoint 268 PASS tanpa menyentuh database pengguna maupun Supabase.
- Audit kontrak menemukan bahwa adapter JavaScript menerima `expectedRevision` tanpa `expectedGameId` (atau sebaliknya), sedangkan draft SQL secara eksplisit mewajibkan kedua parameter preflight bersama. Ketidaksesuaian ini menghasilkan request yang pasti ditolak oleh RPC server.
- `js/sync-supabase-adapter.js`: menolak pasangan preflight tidak lengkap **sebelum** memanggil jaringan. Nilai `(null,null)` tetap diperbolehkan untuk skenario bootstrap; `(revision,gameId)` diteruskan tanpa modifikasi.
- Menambah tiga tes perilaku `tests/sync-rpc-preflight-pair.test.cjs`, memperbarui satu tes adapter lama agar sesuai dengan kontrak server. Pengujian aktual `node --test tests/*.test.cjs`: **271 PASS, 0 FAIL**; log `tests/stage13_preflight_pair_20261012.log`.
- SQL draft dan review tetap **fail-closed** dan tidak diaktifkan. Audit SQL/security dan integrasi Supabase Auth nyata belum final; Tahap 11–13 tetap dalam pengerjaan. Tidak ada deployment.
- GitHub Summary: `v15.7.15 - Validate paired cloud preflight identity`
- GitHub Description: `Reject incomplete expected cloud game ID/revision pairs in the sync adapter before RPC transport. Add three regression tests and align the existing adapter test with the server contract. 271 local Node tests PASS. Cloud Sync OFF; DO NOT DEPLOY.`

## LANJUT — 12 Oktober 2026 (Stage 13: commit numeric guards, 274 PASS)
- Baseline: ZIP Stage 13 Preflight Pair, 271 PASS.
- Audit adapter `js/sync-supabase-adapter.js`: `commit()` hanya menguji apakah generation dan baseRevision merupakan safe integer; nilai `generation=0`, negatif, dan `baseRevision` negatif masih bisa dikirim ke RPC walaupun server akan menolaknya.
- Perbaikan: tolak `generation < 1` dan `baseRevision < 0` secara sinkron sebelum panggilan jaringan; kontrak server tidak diubah.
- Tiga tes baru `tests/sync-commit-nonnegative-lease.test.cjs` memastikan ketiga kasus tidak mengirim RPC.
- Pengujian aktual: `node --test tests/*.test.cjs` **274 PASS, 0 FAIL**. Log `tests/stage13_commit_numeric_guards_20261012.log`.
- Batasan: pengujian ini adalah regresi Node lokal, **bukan** uji PostgreSQL/Supabase Auth nyata. SQL draft/review tetap fail-closed, Tahap 11–13 belum final, Cloud Sync OFF. **DO NOT DEPLOY**.
- GitHub Desktop Summary: `v15.7.15 - Reject invalid sync commit generation and revision`
- GitHub Desktop Description: `Validate commit generation >= 1 and base revision >= 0 before Supabase RPC. Add three regression tests. 274 local Node tests PASS, 0 FAIL. Development checkpoint only; Cloud Sync OFF; DO NOT DEPLOY.`

## LANJUT — 12 Oktober 2026 (Stage 13: whitespace credential guards, 279 PASS)
- Baseline: Stage 13 Commit Guards 274 PASS.
- Audit adapter menemukan ID perangkat, ID game cloud, dan writer token berisi spasi/tab saja diterima sebagai string nonkosong, sehingga request invalid masih mencapai RPC.
- `js/sync-supabase-adapter.js`: helper `nonblank` menolak string whitespace-only pada device ID (`open`, `openReader`, `read`, `leaseStatus`, `commit`), expected cloud game ID, game ID commit, dan writer token commit. String ID valid tidak diubah; tidak ada perubahan SQL, gameplay, maupun pengaktifan sync.
- Tambah 5 pengujian regresi `tests/sync-adapter-blank-credentials.test.cjs` memastikan request ditolak sebelum jaringan.
- Eksekusi aktual `node --test tests/*.test.cjs`: **279 PASS, 0 FAIL**; log `tests/stage13_blank_credentials_20261012.log`.
- Batasan: ini guard transport lokal, bukan validasi UUID/token kriptografis atau uji Supabase Auth nyata. SQL review/draft tetap fail-closed. Tahap 11–13 belum final. Cloud Sync OFF. DO NOT DEPLOY.
- GitHub Summary: `v15.7.15 - Reject blank sync RPC credentials`
- GitHub Description: `Reject whitespace-only device IDs, game IDs, writer tokens, and expected cloud game IDs before RPC calls. Add five regression tests; 279 local Node tests PASS, 0 FAIL. Development checkpoint only; Cloud Sync OFF; DO NOT DEPLOY.`

## Tahap 13 — Payload UTF-8 guard (checkpoint 282 PASS, 12 Oktober 2026)
- `js/sync-supabase-adapter.js`: sebelum memanggil RPC, snapshot JSON sekarang dibatasi **2.000.000 byte UTF-8**, konsisten dengan `octet_length(p_game::text)>2000000` di kandidat SQL. `TextEncoder` dipakai agar karakter multibyte tidak salah dihitung sebagai satu byte.
- `tests/sync-rpc-payload-size.test.cjs`: tiga tes baru: open ASCII terlalu besar ditolak sebelum RPC, commit Unicode multibyte terlalu besar ditolak sebelum RPC, dan open kecil tetap dikirim.
- `node --test tests/*.test.cjs`: **282 PASS, 0 FAIL**. Log: `tests/stage13_payload_limit_20261012.log`.
- Batas ukuran ini adalah guard client tambahan, bukan pengganti validasi server. RPC empat parameter, migrasi Supabase Auth/RLS, dan pengujian perangkat nyata **belum final**.
- **Cloud Sync OFF. DO NOT DEPLOY.** Tidak ada koneksi ke Supabase production.

## LANJUT — 12 Oktober 2026 (Stage 13: RPC response shape, 285 PASS)
- Baseline: Stage 13 UTF-8 Payload 282 PASS.
- Audit transport menemukan adapter menerima objek RPC tanpa properti `ok` boolean; response malformed bisa lolos ke lapisan sinkronisasi dan menyebabkan keputusan tidak jelas.
- `js/sync-supabase-adapter.js`: fail-closed bila `data.ok` tidak bertipe boolean, sambil mempertahankan response `{ok:false,reason:...}` yang valid sebagai hasil penolakan server.
- Tambah `tests/sync-rpc-response-shape.test.cjs`: 3 kasus (tanpa `ok`, `ok` string, penolakan boolean valid).
- `node --test tests/*.test.cjs`: **285 PASS, 0 FAIL**; log `tests/stage13_rpc_response_shape_20261012.log`.
- Belum mengubah SQL draft/review yang tetap fail-closed. Kontrak RPC empat parameter dan Supabase Auth nyata masih belum final. PostgreSQL lokal pengguna sudah dihapus; tidak ada pengujian database pada checkpoint ini.
- **Cloud Sync OFF. DO NOT DEPLOY.**
- GitHub Desktop Summary: `v15.7.15 - Reject malformed sync RPC responses`
- GitHub Desktop Description: `Require a boolean ok flag in sync RPC responses; reject missing or string flags while preserving explicit server rejections. Add three regression tests. 285 local Node tests PASS, 0 FAIL. Cloud Sync OFF; DO NOT DEPLOY.`

## 12 Oktober 2026 — Tahap 13: Kontrak enam RPC (288 PASS)
- Tambah `tests/sync-rpc-six-operation-contract.test.cjs` (3 regresi): cocokkan nama dan urutan parameter enam RPC pada adapter JS vs SQL draft; verifikasi REVOKE/GRANT tiap signature; pastikan SQL draft masih fail-closed sebelum BEGIN dan mempertahankan guard role NULL serta pasangan preflight.
- Saat penulisan tes pertama, ditemukan asumsi urutan parameter commit pada tes yang salah; diselaraskan dengan urutan SQL aktual. Adapter memakai argumen bernama sehingga tidak perlu mengubah kode aplikasi.
- `node --test tests/*.test.cjs`: **288 PASS, 0 FAIL** (log `tests/stage13_six_rpc_contract_20261012.log`). Ini tes Node/static, BUKAN integrasi PostgreSQL/Supabase nyata.
- Kontrak SQL draft empat-parameter tetap DIBLOKIR untuk deployment; SQL review dua-parameter tidak boleh dijalankan sebagai pengganti. Belum ada SQL final production.
- Tahap 11/12/13 belum final; tahap 14–19 belum dijalankan. PostgreSQL lokal MacBook sudah dihapus atas permintaan pengguna. Tidak ada perubahan Supabase, GitHub Pages, maupun Cloud Sync.
- GitHub Desktop Summary: `v15.7.15 - Add six-RPC contract and privilege regression tests`
- GitHub Desktop Description: `Verify six adapter/SQL RPC signatures, authenticated-only grants, and fail-closed draft guards. 288 Node tests PASS, 0 FAIL. Development checkpoint only; Cloud Sync OFF; DO NOT DEPLOY.`

## 12 Oktober 2026 — Tahap 13: Non-finite JSON transport guard (291 PASS)
- Baseline: Stage 13 Six RPC Contract, 288 PASS.
- `js/sync-supabase-adapter.js`: serialisasi snapshot game sekarang menolak `NaN`, `Infinity`, dan `-Infinity` pada kedalaman mana pun sebelum `JSON.stringify` diam-diam mengubah nilai tersebut menjadi `null`. Tidak ada perubahan perhitungan skor, Quad, kombinasi, atau riwayat.
- Tambah `tests/sync-rpc-nonfinite-numbers.test.cjs`: 3 tes (NaN pada scores ditolak, Infinity pada history ditolak, angka finite dipertahankan dalam snapshot).
- `node --test tests/*.test.cjs`: **291 PASS, 0 FAIL**; log `tests/stage13_nonfinite_numbers_20261012.log`.
- Batasan: tes lokal Node.js; SQL draft tetap fail-closed dan belum diuji dengan Supabase Auth nyata. Nilai fractional pada tes transport bukan validasi skema game; validasi skor integer tetap tanggung jawab schema/server.
- Tahap 11–13 belum final, tahap 14–19 belum dilakukan. Tidak ada perubahan production. **Cloud Sync OFF. DO NOT DEPLOY.**
- GitHub Desktop Summary: `v15.7.15 - Reject non-finite numbers in sync snapshots`
- GitHub Desktop Description: `Prevent JSON serialization from silently converting NaN and Infinity into null in sync payloads. Add three regression tests. 291 local Node tests PASS, 0 FAIL. Cloud Sync OFF; DO NOT DEPLOY.`

## Tahap 13 — Safe integer payload guard (lanjutan 291 PASS)
- Adapter menolak integer JS di luar `Number.MAX_SAFE_INTEGER` (positif maupun negatif) sebelum RPC. Angka seperti ini tidak dapat direpresentasikan secara tepat dalam JavaScript dan berisiko mengubah skor/riwayat tanpa terlihat.
- Pemeriksaan rekursif melalui replacer JSON, tanpa mengubah aturan skor dan tanpa mengaktifkan cloud sync.
- Tambahan tiga pengujian: skor nested terlalu besar, delta riwayat negatif terlalu besar, dan batas integer aman + pecahan valid.
- SQL RPC tetap draft fail-closed, integrasi Supabase Auth nyata belum diverifikasi.

## 2026-10-12 — Stage 13 Serialized JSON Root (297 PASS)
- Sync adapter rejects root objects that serialize into JSON null/array/non-object, preventing invalid payloads from reaching RPC.
- Added three regression tests; actual `node --test tests/*.test.cjs`: 297 PASS, 0 FAIL.
- Log: `tests/stage13_json_root_20261012.log`; details: `STAGE13_JSON_ROOT_CHECKPOINT.md`.
- No Supabase production changes. Cloud Sync OFF. DO NOT DEPLOY.

## 2026-10-12 — Stage 13 Draft Index Safety
- Removed redundant `mahjong_one_current_game_per_owner` partial unique index creation from guarded six-RPC SQL draft; the foundation index `mahjong_game_states_one_current_per_owner_idx` remains the required prerequisite.
- Added regression tests for duplicate-index avoidance, explicit NULL role rejection, and draft/review fail-closed guards.
- No Supabase SQL was executed, no cloud sync was activated, and no production deployment was performed.
- Local Node test results are recorded in `tests/stage13_draft_index_20261012.log`; this does not validate real Supabase Auth or PostgreSQL execution.

## Audit Tahap 13 — 12 Oktober 2026 (301–303)
- Ditemukan blocker kompatibilitas skema fondasi dengan enam RPC: indeks unik satu sesi aktif bertentangan dengan multi-device reader; kolom writer/token/revocation belum ada di fondasi; indeks unik game saat ini belum dibuat; helper token memerlukan verifikasi.
- Rincian: `STAGE13_SCHEMA_BLOCKERS_20261012.md`. Tiga tes audit statis baru mendokumentasikan gap, **bukan** menyatakan SQL siap deploy.
- Semua pekerjaan lokal; SQL draft tetap fail-closed; Supabase production dan Cloud Sync tidak disentuh.

## 2026-10-12 — Stage 13 Read-only Index Preflight (306 PASS)
- `supabase_sync_preflight_readonly.sql` now reports whether the blocking single-active-device index exists, whether the current-game owner partial unique index is present, and whether the session lookup index is present.
- No schema writes; the preflight only inspects `pg_indexes` and returns diagnostics. Its results are NOT proof that an index has the correct predicate or that a migration is safe.
- Updated the prior gap test to require the new preflight diagnostics; added three static regression tests in `tests/sync-preflight-index-audit.test.cjs`.
- `node --test tests/*.test.cjs`: 306 PASS, 0 FAIL; log `tests/stage13_index_preflight_20261012.log`.
- No live PostgreSQL/Supabase test, no production change. Cloud Sync OFF; DO NOT DEPLOY.
- GitHub Desktop Summary: `v15.7.15 - Extend read-only Supabase index preflight`
- GitHub Desktop Description: `Report blocking single-device index and required current-game/session indexes in read-only preflight. Add three static regression tests. 306 local Node tests PASS, 0 FAIL. No production changes. Cloud Sync OFF; DO NOT DEPLOY.`


### 12 Oktober 2026 — Stage 13 schema alignment candidate, 309 PASS
- Guarded, NON-DEPLOYABLE `supabase_sync_schema_alignment_candidate.sql` prepared for schema blockers.
- Three new static tests; full local suite 309 PASS, 0 FAIL.
- Current-game selection and live PostgreSQL/Supabase verification remain open. DO NOT DEPLOY.

### 12 Oktober 2026 — Tahap 13: Current-game bootstrap (312 PASS)
- Konsistensi SQL kandidat: `is_current` untuk data lama default `false`, tidak otomatis dipromosikan.
- RPC open pertama kali sekarang menyimpan game baru dengan `is_current=true` secara eksplisit, agar bisa ditemukan oleh peek/read/commit.
- 3 pengujian statis tambahan PASS; total 312 PASS, 0 FAIL (`tests/stage13_current_game_bootstrap_20261012.log`).
- SQL tetap memiliki guard eksekusi; PostgreSQL nyata/Supabase Auth belum diuji. DO NOT DEPLOY, Cloud Sync OFF.

## LANJUT — 12 Oktober 2026 (315 PASS, verifikasi definisi indeks)
- Audit migrasi menemukan `CREATE UNIQUE INDEX IF NOT EXISTS` dapat diam-diam menerima indeks bernama sama dengan definisi salah. Tambah verifikasi katalog PostgreSQL untuk indeks current-game: unik, valid, siap, tepat satu key `owner_id`, dan predikat `is_current`.
- Jika definisi tidak cocok, kandidat migrasi membatalkan transaksi dengan pesan untuk review manual. Guard unconditional DO NOT DEPLOY tetap aktif.
- Tambah 3 tes statis `tests/sync-schema-index-definition.test.cjs`. `node --test tests/*.test.cjs`: **315 PASS, 0 FAIL**; log `tests/stage13_index_definition_20261012.log`.
- Belum ada pengujian PostgreSQL nyata; ekspresi predikat dan semantik katalog tetap perlu dibuktikan di database disposable. Production tidak diubah, Cloud Sync OFF.

## 12 Oktober 2026 — Stage 13: Archive Preservation (318 PASS)
- Koreksi kandidat migrasi: pemeriksaan duplikasi `owner_id` sebelumnya menolak pemilik yang memiliki >1 game historis, walaupun semua `is_current=false`. Itu terlalu ketat dan menghalangi preservasi arsip.
- Tambah `is_current boolean NOT NULL DEFAULT false` **sebelum** pemeriksaan; sekarang hanya menolak >1 baris `is_current=true` untuk owner yang sama.
- Tidak mengangkat game lama menjadi current secara otomatis, tidak menghapus arsip, tidak menyentuh database produksi.
- Tambah 3 pengujian statis regresi `tests/sync-schema-archive-preservation.test.cjs`; perbarui pengujian kandidat terdahulu. `node --test tests/*.test.cjs`: **318 PASS, 0 FAIL**; log `tests/stage13_archive_preservation_20261012.log`.
- Migrasi tetap fail-closed/DO NOT DEPLOY; belum diverifikasi dengan PostgreSQL nyata, Supabase Auth/RLS, atau data produksi.

## 12 Oktober 2026 — Tahap 13: Validasi tipe kolom migrasi (321 PASS)
- SQL alignment kandidat sekarang memeriksa katalog PostgreSQL untuk enam kolom sync: nama saja tidak cukup karena `ADD COLUMN IF NOT EXISTS` dapat melewati kolom yang memiliki tipe keliru.
- Periksa tipe data dan NOT NULL pada `is_current`/`is_writer`; tolak skema tidak sesuai dengan exception dan rollback transaksi.
- Tiga pengujian statis baru `tests/sync-schema-column-types.test.cjs`, suite lokal **321 PASS, 0 FAIL** (`tests/stage13_column_types_20261012.log`).
- SQL tetap sengaja tidak dapat dijalankan; pengujian katalog PostgreSQL nyata, Supabase Auth, RLS, dan migrasi data masih belum dilakukan. Cloud Sync OFF, DO NOT DEPLOY.
- GitHub Desktop Summary: `v15.7.15 - Guard sync migration column types`
- Description: `Validate types and nullability of six sync columns in guarded schema alignment candidate. Reject existing mismatched columns. Add 3 static regression tests. 321 local tests PASS, 0 FAIL. Cloud Sync OFF. DO NOT DEPLOY.`

### Stage 13 — Legacy active-device index guard (12 Oktober 2026)
SQL migrasi kandidat sekarang memeriksa bentuk indeks `mahjong_one_active_device_per_user` sebelum `DROP INDEX IF EXISTS`. Nama yang sama dengan definisi berbeda harus menghentikan migrasi, bukan menghapus indeks tak terkait. Pengujian lokal 324 PASS / 0 FAIL (`tests/stage13_legacy_index_guard_20261012.log`). Ini hanya pemeriksaan statis; belum diuji pada PostgreSQL atau Supabase nyata. Pengaman SQL tetap aktif, Cloud Sync OFF, DO NOT DEPLOY.

GitHub Desktop Summary: `v15.7.15 - Guard legacy active-device index removal`

GitHub Desktop Description:
`Validate the legacy single-device index definition before any candidate DROP INDEX. Fail closed for a reused or incompatible index name. Add three static tests. 324 local Node tests PASS, 0 FAIL. SQL guard remains active; Cloud Sync OFF; DO NOT DEPLOY.`

### Stage 13 — Cloud revision preflight precedence (327 PASS, 12 Oktober 2026)
- Audit `mahjong_sync_open`: sebelumnya mismatch payload lokal dievaluasi sebelum pemeriksaan identitas/revisi cloud. Untuk klien dengan preflight usang, respons dapat menyertakan snapshot cloud saat seharusnya hanya menolak revisi usang.
- Ubah urutan: validasi `p_expected_game_id` dan `p_expected_revision` lebih dahulu; hanya bila cocok, evaluasi `local-cloud-mismatch` yang mengembalikan snapshot untuk rekonsiliasi.
- Semua pemeriksaan tetap sebelum pencabutan lease penulis. Tambah tiga tes statis `tests/sync-rpc-preflight-order.test.cjs`; suite lokal 327 PASS / 0 FAIL, log `tests/stage13_preflight_order_20261012.log`.
- Perilaku PostgreSQL/Supabase nyata BELUM diuji. SQL masih fail-closed, Cloud Sync OFF, DO NOT DEPLOY.
- GitHub Desktop Summary: `v15.7.15 - Prioritize cloud revision preflight before mismatch`
- Description: `Check expected cloud identity/revision before returning local/cloud mismatch data. Keep lease revocation after all preflight checks. Add three static regression tests. 327 local PASS, 0 FAIL. Cloud Sync OFF. DO NOT DEPLOY.`

### Stage 13 — PostgreSQL read-only preflight helper (339 PASS, 12 Oktober 2026)
- Tambah `tools/stage13_pg_readonly_preflight.cjs`: inventaris PostgreSQL lokal menggunakan transaksi `BEGIN READ ONLY` dan `ROLLBACK`, tanpa memasang SQL/membuat objek.
- Helper memeriksa nama database, tabel public, role anon/authenticated, schema auth, extension pgcrypto. Default database `mahjong_sync_test`; `PSQL_BIN` dan `PG_TEST_DB` dapat diatur lewat environment. Koneksi gagal => exit nonzero.
- Tambah tiga tes regresi `tests/stage13-pg-readonly-preflight.test.cjs`. Suite `node --test tests/*.test.cjs`: **339 PASS, 0 FAIL**. Log: `tests/stage13_pg_readonly_preflight_20261012.log`.
- Helper belum dieksekusi terhadap PostgreSQL karena binary psql tidak tersedia pada lingkungan pengembangan ini. Ini bukan bukti keamanan runtime SQL atau Supabase Auth. SQL draft masih fail-closed; Cloud Sync OFF; DO NOT DEPLOY.
- GitHub Summary: `v15.7.15 - Add read-only PostgreSQL preflight helper`
- GitHub Description: `Add fail-closed read-only PostgreSQL inventory helper for isolated Stage 13 verification. Add three tests; 339 local PASS, 0 FAIL. No live PostgreSQL/Supabase tests or deployment. Cloud Sync OFF; DO NOT DEPLOY.`

## Update checkpoint Stage 13 — 360 PASS (12 Oktober 2026)
Lihat `STAGE13_DRAFT_REVIEW_CONSISTENCY_CHECKPOINT.md`. Tambah 3 tes untuk fail-closed kedua berkas SQL, beda kontrak open 2 vs 4 argumen, dan high-water/expected game checks. Full suite 360 PASS, 0 FAIL, log `tests/stage13_draft_review_consistency_20261012.log`. SQL review tetap usang dan tidak boleh dijalankan. Tidak ada perubahan produksi; Cloud Sync OFF; DO NOT DEPLOY.

## Update Stage 13 — 363 PASS (12 Oktober 2026)
- Sumber: checkpoint 360 PASS.
- Dibuat rencana pengujian dua koneksi PostgreSQL disposable: competing commits, stale revision, takeover sesi, identitas current game, rollback, dan hak admin/scorekeeper.
- Ditambahkan 3 tes Node statis untuk menjaga kelengkapan rencana dan larangan produksi.
- Eksekusi aktual `node --test tests/*.test.cjs`: **363 PASS, 0 FAIL**, log `tests/stage13_parallel_plan_20261012.log`.
- Tidak ada PostgreSQL disposable yang dijalankan; draft SQL masih fail-closed, kontrak RPC review lama belum selaras. **Belum ada bukti concurrency runtime.**
- Cloud Sync OFF; tidak ada deployment; **DO NOT DEPLOY**.
- Selanjutnya: siapkan harness disposable hanya setelah SQL schema/RPC diselaraskan dan dievaluasi aman.

## Fast-track gate checkpoint — 2026-10-12
- User requests one-hour acceleration target; not a guarantee of complete release.
- Re-extracted 363 checkpoint and reran `node --test tests/*.test.cjs`: **363 PASS, 0 FAIL** (log `test_run_fast.log`).
- Confirmed sync flag OFF and SQL intentional exception guard intact.
- Added `STAGE13_FAST_TRACK_GATE.md` specifying minimum real integration evidence and blocking dependencies.
- No production Supabase connection, migration, or deployment performed.

## 2026-10-12 — 365 PASS, Stage 13 Single Device Lock Beta
Lihat `STAGE13_SINGLE_DEVICE_BETA_CHECKPOINT.md`: penolakan writer berbeda pada SQL draft sebelum takeover; dua tes regresi baru, 365 PASS/0 FAIL. Masih draft, Cloud Sync OFF, tidak deploy.

## Stage 13 — Persistent Device Binding (368 PASS)
Lihat `STAGE13_PERSISTENT_DEVICE_BINDING_CHECKPOINT.md`. Menambah device binding lintas logout pada SQL draft dan tiga tes statis. `node --test tests/*.test.cjs`: 368 PASS / 0 FAIL. Cloud Sync OFF, SQL draft UNSAFE, DO NOT DEPLOY. Belum diuji PostgreSQL nyata.

## 2026-10-12 — 369 PASS fast-track commit-time device binding
See `STAGE13_FAST_TRACK_COMMIT_BINDING.md`. Added commit-time historical device-binding guard to the blocked SQL draft, with one regression test. `node --test tests/*.test.cjs`: 369 PASS / 0 FAIL. Cloud Sync OFF; PostgreSQL runtime untested; DO NOT DEPLOY.

## Stage 13 — 370 PASS: Same-device re-login
Lihat `STAGE13_SAME_DEVICE_RELOGIN_CHECKPOINT.md`. Memperbaiki SQL draft yang menolak sesi baru pada device ID sama. Satu tes ekspektasi lama diperbarui dan satu tes regresi baru ditambahkan. Node 370 PASS, 0 FAIL. PostgreSQL belum diuji. Cloud Sync OFF; DO NOT DEPLOY.

## Checkpoint 372 — Reader/Writer Binding Isolation
Lihat `STAGE13_READER_BINDING_ISOLATION.md`. Menambahkan `ever_writer` pada SQL draft agar sesi reader tidak menyebabkan penguncian writer permanen; dua tes baru, satu tes diselaraskan. 372 PASS / 0 FAIL. PostgreSQL belum diuji, DO NOT DEPLOY.

## Stage 13 — 375 PASS — Administrator Unlock Draft (12 Oct 2026)
- Added `supabase_sync_admin_unlock_draft.sql` as **non-executable, fail-closed, ungranted** recovery proposal.
- Administrator and target Scorekeeper roles validated; account locks serialize with writer operations; expected registered device must match; ambiguous history rejected.
- Unlock revokes writer leases and increments generations without touching game rows; audit table records administrator, target and expected device.
- Added three static regression tests; actual command `node --test tests/*.test.cjs` resulted in **375 PASS, 0 FAIL**; log `tests/stage13_admin_unlock_run.log`.
- **Unresolved:** Auth-session revocation and older-session reclaim prevention after admin unlock require independent PostgreSQL integration verification; current proposal MUST NOT be deployed or granted. UI integration not started.
- Cloud Sync remains OFF; no Supabase production changes.

## Stage 13 — 377 PASS / 0 FAIL — unlock revocation
- Strengthened admin unlock draft to invalidate writer token hash and mark revocation timestamp; preserve Auth session history for high-water-mark logic.
- Added two static tests; `node --test tests/*.test.cjs` 377 PASS, 0 FAIL. Log: `tests/stage13_unlock_revocation_run.log`.
- Still blocked: disposable PostgreSQL integration, Admin UI, Cloud Sync. DO NOT DEPLOY.

## Stage 13 — 389 PASS — Runtime integration gate preparation
See `STAGE13_RUNTIME_GATE_CHECKPOINT.md`. Four regression tests added; Node 389 PASS, 0 FAIL. Found RPC draft includes grants and COMMIT after deliberate UNSAFE DRAFT exception: never bypass guard or deploy. PostgreSQL runtime still NOT EXECUTED. Cloud Sync OFF.

## Checkpoint 394 — 2026-10-12 (audit-only)
- Supabase installed validator nested-history gap confirmed by user's read-only results (3 negative cases wrongly accepted).
- Added `STAGE13_SUPABASE_VALIDATOR_GAP_CHECKPOINT_394.md` and `STAGE13_VALIDATOR_NESTED_READONLY_394.sql`.
- No app or production SQL modifications; DO NOT DEPLOY.


## Checkpoint 395 — SQL validator type guards (LOCAL ONLY)
Guarded JSON array functions in SQL draft. See STAGE13_VALIDATOR_TYPE_GUARD_CHECKPOINT_395.md. No production SQL or deployment.

## Checkpoint 396 — Test compatibility (12 October 2026)
Updated three regex-based SQL tests for guarded array access in draft. `node --test tests/*.test.cjs`: 393 PASS, 0 FAIL. No runtime application or SQL draft changes from checkpoint 395. PostgreSQL runtime testing and production validator fixes remain pending. DO NOT DEPLOY.

## 13 October 2026 — Stage 14 459 PASS
- Added fail-closed second-result-set column inventory evidence reviewer and seven tests.
- Verified 459 PASS / 0 FAIL (local Node). No Supabase connection, SQL deployment or production changes.
- See `STAGE14_COLUMN_EVIDENCE_GATE_20261013.md`. Cloud Sync OFF, DO NOT DEPLOY.

## 13 Oct 2026 — Stage14 465 PASS
Added candidate column type evidence gate and 6 tests. See STAGE14_COLUMN_TYPE_GATE_20261013.md. No Supabase production changes; Cloud Sync OFF; DO NOT DEPLOY.

## 2026-10-13 — Stage 14 default/nullability gate
473 local Node PASS / 0 FAIL; see STAGE14_DEFAULT_NULLABILITY_GATE_20261013.md. No production changes.

## 2026-10-13 — Stage14 479 PASS
Consolidated fail-closed offline evidence bundle reviewer; 6 tests; 479 PASS / 0 FAIL. See STAGE14_EVIDENCE_BUNDLE_20261013.md. Awaiting real Supabase read-only evidence; no production change. DO NOT DEPLOY.

## 2026-10-13 Stage 14 — 487 PASS
Added offline RPC exposure metadata gate and eight tests. `node --test tests/*.test.cjs` = 487 PASS / 0 FAIL. See `STAGE14_RPC_EXPOSURE_GATE_20261013.md`. No actual Supabase evidence verified, no SQL applied, Cloud Sync OFF. DO NOT DEPLOY.


---

### Source: POSTGRES_INTEGRATION_TEST_PLAN.md

# Tahap 13 — PostgreSQL isolated integration gate (NOT EXECUTED)

**Production prohibition:** Never run `supabase_sync_rpc_draft.sql` in a production database. It intentionally raises `UNSAFE DRAFT` before `BEGIN`. Do not remove this guard until all integration and security gates are reviewed.

## Environment prerequisites

- Disposable PostgreSQL database/cluster, never production or staging with real users.
- Supabase-compatible `auth.users`, `auth.sessions`, `auth.uid()` and `auth.jwt()` behavior; ordinary PostgreSQL alone cannot accurately simulate Supabase Auth without test-only fixtures.
- Separate test roles (`anon`, `authenticated`) and RLS policy setup matching the actual Supabase deployment.
- Test identities: admin, scorekeeper A (single-device), scorekeeper B (multi-device), inactive account; two distinct Auth sessions for A.
- All SQL applied within a disposable environment; database dropped after testing. No real credentials or production data.

## Required integration scenarios (not PASS until run)

1. Install/migrate schema twice on disposable database; verify signatures, grants, RLS, uniqueness, and idempotence.
2. Anonymous RPC access denied, including direct function calls and direct table access.
3. Scorekeeper A opens first device and commits a complete valid game; read back exact names, scores, dealer, history, Quad and combinations.
4. Second device logs in with a newer Auth session, atomically takes writer lease, receives current game and history, and commits a new revision.
5. Old device cannot commit, reopen writer lease, read private game or regain access after newer session expiry/revocation.
6. Concurrent commit at identical expected revision: exactly one succeeds; no lost updates or partial rows.
7. Concurrent device takeover and commit: serial order must be consistent; no two active writers.
8. Replayed or wrong writer token rejected; stale revision rejected without changing game.
9. Multi-device scorekeeper: one writer and permitted readers; reader never revokes or writes through writer lease.
10. Admin sessions retain intended multi-device rights without leaking scorekeeper game ownership.
11. Inactive/banned/deleted user cannot open/read/commit; privileges and error payloads reveal no other user's game.
12. Network retry and offline recovery: identical request replay must not double-apply scores or Quad; conflicting local revisions must not overwrite cloud history.
13. Invalid payloads rejected server-side (wrong arrays, huge JSON, non-integer points, invalid winds, malformed history), with no mutation.
14. Forced exception mid-transaction rolls back both session and game changes.
15. Token, Auth session, lease status, and audit trail behave correctly after logout and reconnection.

## Completion evidence

Record actual PostgreSQL/Supabase version, test fixture migration hash, SQL hash, individual PASS/FAIL logs, concurrency timings, rollback proof, and evidence that production project was never targeted. A Node.js mock or static SQL inspection does not satisfy this gate.


---

### Source: STAGE13_CROSS_RPC_CHECKPOINT.md

# Stage 13 — Cross-RPC unlock safety (static verification)
Date: 2026-10-12. Starting checkpoint: 377 PASS. Added four cross-file Node regression tests verifying admin unlock and writer-open serialize on auth.users row, preserved Auth session high-water checked in open/commit, revoked lease cannot commit, and unlock SQL remains fail-closed with no GRANT or game-state mutation. Actual run: `node --test tests/*.test.cjs` -> 381 PASS, 0 FAIL. Log: `tests/stage13_cross_rpc_run.log`.
Limitations: these are static checks, NOT PostgreSQL integration or Supabase runtime verification. Existing SQL remains an unsafe draft; no production deployment or cloud changes. Next requires disposable PostgreSQL/Supabase test environment to validate role permissions, row locking, stale login and concurrency before wiring UI.


---

### Source: STAGE13_DEPLOY_BOUNDARY_CHECKPOINT.md

# Stage 13 — Deployment boundary static guard (393 PASS)
Date: 2026-10-12. Source: 389 PASS ZIP.

## Completed
- Inspected PostgreSQL integration plan and blocked RPC/admin unlock SQL drafts.
- Added four Node tests in `tests/sync-stage13-deploy-boundary.test.cjs`: guard precedes grants/transaction, unconditional top-level exception, no unlock executable grants, and runtime gate explicitly NOT EXECUTED.
- Executed `node --test tests/*.test.cjs`: **393 PASS, 0 FAIL**. Full log: `tests/stage13_deploy_boundary_run.log`.

## Important limits
- These are static checks, NOT PostgreSQL runtime verification.
- No PostgreSQL/Supabase-compatible disposable server available in this environment. No SQL executed against any database.
- RPC draft still contains GRANT/COMMIT following an intentional blocking exception; never remove or bypass the guard or deploy this draft.
- Cloud Sync remains OFF; production unchanged. **DO NOT DEPLOY**.

## Next
Provision disposable Supabase-compatible test instance with isolated Auth fixtures; verify database fingerprint, then run the 15 runtime scenarios in `POSTGRES_INTEGRATION_TEST_PLAN.md` and preserve evidence.


---

### Source: STAGE13_DRAFT_REVIEW_CONSISTENCY_CHECKPOINT.md

# Stage 13 — Draft / Review consistency (360 PASS)

12 Oktober 2026. Pemeriksaan lokal non-destruktif terhadap `supabase_sync_rpc_draft.sql` dan `supabase_sync_rpc_review.sql`.

- Menambahkan `tests/sync-stage13-draft-review-consistency.test.cjs` dengan 3 kasus.
- Memastikan kedua SQL fail-closed sebelum `BEGIN`/DDL; keduanya **tidak boleh dijalankan**.
- Mengidentifikasi review SQL sebagai kontrak usang: `mahjong_sync_open` hanya 2 argumen, sedangkan draft menggunakan 4 argumen termasuk expected revision dan expected game ID.
- Memastikan draft tetap memuat high-water Auth session, pemeriksaan identitas cloud, dan penolakan login lebih lama.
- Tidak mengubah SQL produksi atau menghapus pengaman draft.
- Pengujian aktual `node --test tests/*.test.cjs`: **360 PASS, 0 FAIL**; log `tests/stage13_draft_review_consistency_20261012.log`.
- PostgreSQL runtime, concurrency riil, Auth, dan Supabase tetap belum diuji. Cloud Sync OFF. DO NOT DEPLOY.

## Tahap selanjutnya
Rancang pengujian transaksi PostgreSQL disposable dengan sesi paralel setelah `psql` dan server uji terisolasi tersedia. Jangan jalankan SQL draft/review pada produksi.


---

### Source: STAGE13_EDIT_QUAD_SAFETY_CHECKPOINT.md

# STAGE 13 — Score Edit / Quad Save Rollback
2026-10-12. DO NOT DEPLOY.
- `saveScoreEdit()`: snapshot before mutation, rollback state and keep edit dialog open on failed save.
- `deleteQuad()`: snapshot before mutation, rollback state on failed save.
- Isolated real-function tests: four new cases (success/failure each).
- Local `node --test tests/*.test.cjs`: 404 PASS, 0 FAIL. Log: tests/stage13_edit_quad_regression_20261012.log.
- Remaining: audit score history snapshot chain after editing earlier entries; malformed historical quad delta; browser/device and Supabase integration. No production deployment.


---

### Source: STAGE13_FAST_TRACK_COMMIT_BINDING.md

# Stage 13 Fast Track — Commit-Time Device Binding

Date: 2026-10-12. Version v15.7.15. Local checkpoint: 369 PASS / 0 FAIL.

## Implemented
- Added an additional fail-closed device-binding check to `mahjong_sync_commit` in `supabase_sync_rpc_draft.sql`.
- The check executes after the account authorization row lock and before the game row lock or any game-state update.
- When a scorekeeper's multi-device privilege is disabled, an already-issued writer on another device cannot continue committing merely because the lease was issued under the old policy.
- Added `tests/sync-stage13-commit-device-binding.test.cjs` to assert placement and contract.
- Ran `node --test tests/*.test.cjs`: 369 PASS, 0 FAIL; log `tests/fast_track_run.log`.

## Not completed / limitations
- The SQL is a **deliberately non-executable draft**, beginning with a fail-closed exception. This is NOT deployed and must not be run in production.
- No PostgreSQL runtime, concurrent connection, device integration, or production Supabase test was performed.
- Current historical-device binding policy fails closed if more than one device ID exists, including historical multi-device records. Administrator recovery/unlock is not yet implemented.
- A login on a different device is not globally blocked at Supabase Auth level; the intended restriction applies to Mahjong writer RPCs.
- `MAHJONG_CLOUD_SYNC_ENABLED=false` remains unchanged. No score data was modified.

## Next priority
- Validate RPC draft in a disposable PostgreSQL/Supabase environment, fix identified schema incompatibilities, add audited admin recovery, then test scorekeeper one-device writes and conflict rejection. Do not enable cloud sync until those pass.


---

### Source: STAGE13_FAST_TRACK_GATE.md

# Stage 13–16 Fast-track functional beta gate — 2026-10-12

## Verified now
- Baseline 363 Node tests PASS / 0 FAIL, executed against this extracted ZIP.
- `MAHJONG_CLOUD_SYNC_ENABLED=false` in `index.html`.
- `supabase_sync_rpc_draft.sql` begins with an intentional exception guard.
- No `psql` binary or disposable Supabase/PostgreSQL credentials were supplied in this environment.

## Minimum release-blocking evidence
1. Dedicated disposable Supabase project with Auth schema and test accounts; confirm no production data.
2. Apply reviewed migrations only to disposable environment; resolve review/draft signature mismatch before any release.
3. Verify SQL RLS/EXECUTE permissions and session identity with admin, scorekeeper, disabled user, anonymous user.
4. Two independent auth sessions: login takeover, stale writer rejection, concurrent commits, stale revision, rollback, reconnect/offline conflict.
5. Restore full game state (players, scores, rounds, winds, history, quad, live metadata), compare before/after and verify legacy local data retained.
6. iPhone Safari and Android end-to-end acceptance, including administrator multi-device exception.
7. Keep production sync OFF and do not deploy until evidence passes and user explicitly approves.

## Fast-track decision
Stop expanding static-test counts merely for milestones. Next work should be an executable disposable integration harness and fixing actual runtime failures. No claim of functional beta readiness until database and two-device tests pass.


---

### Source: STAGE13_HISTORY_REBASE_CHECKPOINT.md

# Stage 13 history rebase checkpoint (DO NOT DEPLOY)
2026-10-12. Baseline: Stage 13 Edit & Quad Safety 404 PASS.
- Newest-first history: edits/deletions to an older entry shift `before` snapshots for all newer entries (indices lower than edited index) by the net score change.
- Reject malformed/missing newer `before` snapshots rather than applying an unsafe edit/deletion.
- Preserve existing save-failure rollback protection.
- Tests: 410 PASS, 0 FAIL (`node --test tests/*.test.cjs`, from repository root).
- Includes six targeted history-rebase tests, and adjusts the pre-existing isolated test harness to include the new helper function.
- Caveat: local JS tests only; full integration and real-device verification outstanding. No production database changes.


---

### Source: STAGE13_INDEX_PREFLIGHT_20261012.md

# Stage 13 — Read-only index preflight

Status: local checkpoint; **DO NOT DEPLOY**.

The read-only SQL preflight now includes an `indexes` result with:
- `blocking_single_active_index_present`
- `current_game_unique_index_present`
- `session_lookup_index_present`

This does **not** modify schema or solve the four blockers. `pg_indexes.indexdef` is inspected statically and must be independently reviewed before any migration. No production query was executed. Real Supabase Auth and RPC integration remain untested.

Tests: `node --test tests/*.test.cjs` — 306 PASS, 0 FAIL.


---

### Source: STAGE13_INTEGRATION_BLOCKERS.md

# Tahap 13 — Audit lanjutan dan gerbang integrasi (12 Oktober 2026)

## Status: BLOCKED — bukan PASS

Baseline checkpoint `244PASS_DO_NOT_DEPLOY` diuji ulang: `node --test tests/*.test.cjs` menghasilkan 244 PASS, 0 FAIL. Angka tersebut hanya mencakup tes Node lokal.

## Pemeriksaan kode aktual

- `supabase_sync_rpc_draft.sql` sengaja berhenti pada perintah `RAISE EXCEPTION 'UNSAFE DRAFT...'` sebelum transaksi. **Jangan hapus guard atau jalankan pada production.**
- `mahjong_sync_open` memeriksa `auth.uid()`, `auth.jwt().session_id`, baris `auth.sessions`, role dan status akun; menggunakan `FOR UPDATE` untuk serialisasi serta preflight revisi sebelum mengambil alih writer.
- `mahjong_sync_commit` memeriksa token hash, generasi sesi, Auth session, writer lease, dan revisi sebelum mutasi. Pengujian konkuren sungguhan tetap diperlukan.
- Tes statis dan mock tidak membuktikan `SECURITY DEFINER`, RLS, GRANT/REVOKE, keunikan index, ataupun serialisasi pada database aktual.

## Prasyarat yang belum dipenuhi

1. Disposable Supabase/PostgreSQL yang kompatibel dengan Auth dan RLS (bukan production).
2. Kredensial pengujian terpisah untuk admin, scorekeeper single-device/multi-device, dan akun nonaktif.
3. Eksekusi 15 skenario dalam `POSTGRES_INTEGRATION_TEST_PLAN.md` disertai log dan bukti rollback.

## Keputusan keselamatan

Cloud sync tetap OFF. Tidak ada SQL yang dipasang, akun yang diubah, atau GitHub deployment. Tahap 11 dan 12 juga belum dinyatakan selesai karena memerlukan verifikasi data nyata dan server.

## Lanjutan otomatis — checkpoint 248 PASS (12 Oktober 2026)
- Ditambahkan `scripts/stage13-environment-preflight.cjs`, pemeriksaan **read-only tanpa koneksi** untuk memastikan URL PostgreSQL disposable eksplisit, acknowledgment, penolakan target production, dan keberadaan dokumen integrasi. URL/password tidak dicetak.
- Ditambahkan empat tes regresi di `tests/sync-stage13-environment-preflight.test.cjs` untuk konfigurasi kosong, target disposable, target production, serta protokol/acknowledgment tidak valid.
- `node --test tests/*.test.cjs`: **248 PASS, 0 FAIL**; log `tests/stage13_preflight_248pass.log`.
- Skrip ini **bukan** bukti keamanan target database dan **tidak menjalankan** 15 skenario PostgreSQL. Belum tersedia disposable Supabase dengan Auth/RLS. Tahap 13 tetap BLOCKED. Draf SQL tetap tidak boleh dieksekusi.

## Lanjutan otomatis — 251 PASS (12 Oktober 2026)
- Memperketat preflight agar nama database wajib menandakan target disposable (`disposable`, `ephemeral`, `throwaway`, atau `test_`/`test-`).
- Menolak koneksi tanpa username/password eksplisit; target remote membutuhkan pengakuan isolasi terpisah `MAHJONG_STAGE13_REMOTE_ISOLATED=I_VERIFIED_NO_PRODUCTION_DATA`.
- Menambahkan 3 tes regresi baru, total **251 PASS, 0 FAIL** (`tests/stage13_preflight_251pass.log`).
- Preflight tetap **hanya pemeriksaan konfigurasi, tidak melakukan koneksi**. Persetujuan eksplisit dan nama disposable **tidak membuktikan** target aman; integrasi nyata belum dijalankan. Cloud sync OFF, SQL guard utuh, tidak deploy.

## Checkpoint 254 PASS
- Read-only URL preflight diperketat terhadap query connection overrides, fragmen, separator database ter-encode, dan hostname ambigu; 3 tes baru PASS.
- Tidak tersedia database pengujian terisolasi; Tahap 13 tetap BLOCKED. Tidak boleh menggunakan production untuk mengatasi hambatan ini.

## Checkpoint 258 PASS terverifikasi
Validasi percent-encoding path database kini fail-closed saat UTF-8 rusak; dua tes regresi ditambahkan. Pengujian PostgreSQL/Supabase Auth/RLS nyata masih membutuhkan lingkungan terisolasi. Tidak ada koneksi atau mutasi production.

## Checkpoint 262 PASS
Karakter kontrol ter-encode dalam username/password database ditolak oleh preflight read-only. 262 tes lokal PASS. Integrasi PostgreSQL/Supabase Auth+RLS tetap terblokir sampai lingkungan disposable tersedia.


---

### Source: STAGE13_JSON_ROOT_CHECKPOINT.md

# Stage 13 — Serialized JSON Root Validation
Date: 2026-10-12. Version: v15.7.15. DO NOT DEPLOY.

- Fixed `js/sync-supabase-adapter.js` to reject a game whose `toJSON()` transforms the original object root into `null`, an array, or another non-object, before RPC transport.
- Added `tests/sync-json-root-guard.test.cjs` with three tests (null, array, valid object).
- Ran `node --test tests/*.test.cjs`: 297 PASS, 0 FAIL; log `tests/stage13_json_root_20261012.log`.
- SQL RPC four-argument implementation, server-side auth and takeover semantics remain under review; not validated on actual Supabase. Stages 11–13 incomplete; 14–19 pending.
- Supabase production unchanged, Cloud Sync OFF.

GitHub Desktop Summary:
v15.7.15 - Validate serialized sync game root

GitHub Desktop Description:
Reject sync game objects that serialize into null or array via custom toJSON before RPC. Add 3 regression tests. 297 local Node tests PASS, 0 FAIL. Development checkpoint only. Cloud Sync OFF. DO NOT DEPLOY.


---

### Source: STAGE13_LOCAL_POSTGRES_NEXT.md

# Tahap 13 — PostgreSQL lokal, checkpoint verifikasi

Tanggal: 12 Oktober 2026. Sumber: ZIP 262 VERIFIED dari pengguna.

## Yang sudah diperiksa
- ZIP diekstrak dan suite `node --test tests/*.test.cjs` dijalankan ulang: **262 PASS, 0 FAIL**.
- Pengguna telah menjalankan PostgreSQL Homebrew 17.11 dan memverifikasi database `mahjong_sync_test` berisi **0 tabel public** (berdasarkan keluaran Terminal yang dikirim).
- `supabase_latest.sql` bergantung pada `auth.users`, role `anon`/`authenticated`, dan RLS; tidak cocok langsung dipasang pada PostgreSQL Homebrew kosong.
- `supabase_sync_rpc_draft.sql` sengaja memiliki `RAISE EXCEPTION 'UNSAFE DRAFT'`; jangan dihapus untuk instalasi cepat.
- `supabase_sync_rpc_review.sql` juga membutuhkan Supabase Auth (`auth.uid()`, `auth.jwt()`, `auth.sessions`), extension digest dan fondasi.

## Keputusan keselamatan
Tidak memasang SQL apa pun pada database pengguna. Tidak membuat auth palsu atau menyatakan tes Auth Supabase PASS. Tidak menyentuh production.

## Langkah pengguna berikutnya
Jalankan perintah read-only berikut untuk memverifikasi ekstensi dan role lokal sebelum membuat fixture khusus yang terisolasi:

`/opt/homebrew/opt/postgresql@17/bin/psql -X -P pager=off -d mahjong_sync_test -c "SELECT current_database() AS db, current_user AS db_user, (SELECT count(*) FROM pg_tables WHERE schemaname='public') AS public_tables, (SELECT count(*) FROM pg_roles WHERE rolname IN ('anon','authenticated')) AS supabase_roles, (SELECT count(*) FROM pg_namespace WHERE nspname='auth') AS auth_schemas;"`

Harapan: db mahjong_sync_test, public_tables 0. Role dan auth schema boleh 0. Jangan kirim password atau connection URL.

## Pekerjaan tersisa
Bangun fixture PostgreSQL lokal dengan isolasi dan rollback, lalu uji fondasi SQL dan validator secara nyata. RPC session/Auth/Realtime end-to-end tetap membutuhkan lingkungan Supabase-compatible yang terisolasi. Tahap 11/12/13 belum final.


---

### Source: STAGE13_NEXT_CHECKPOINT.md

# Stage 13 next checkpoint — 339 PASS
Run on a local disposable PostgreSQL installation only, when available:
`PSQL_BIN=/opt/homebrew/opt/postgresql@17/bin/psql PG_TEST_DB=mahjong_sync_test node tools/stage13_pg_readonly_preflight.cjs`
The helper is read-only; do not apply draft SQL or production migrations. Await inventory result before isolated fixture planning. Supabase Auth/RLS/Realtime remain unverified. Cloud Sync OFF; DO NOT DEPLOY.


---

### Source: STAGE13_PARALLEL_PG_TEST_PLAN.md

# Tahap 13 — Rencana pengujian PostgreSQL paralel (belum dijalankan)

**DO NOT DEPLOY.** Jangan gunakan database produksi, Supabase produksi, atau data permainan aktif.

## Prasyarat
- Sediakan instance PostgreSQL **disposable** terisolasi, dua koneksi SQL independen, dan schema pengujian yang dapat dihapus seluruhnya.
- Pastikan schema dasar, auth fixture, dan enam RPC telah direview untuk kompatibilitas PostgreSQL; draft SQL saat ini sengaja fail-closed dan **tidak boleh** dieksekusi apa adanya.
- Gunakan hanya akun, sesi, permainan, dan skor sintetis. Simpan log tanpa token rahasia.

## Matriks skenario yang harus diuji
1. **Dua koneksi** mencoba commit pada game/revisi yang sama. Sinkronkan kedua transaksi sebelum commit; hanya **satu yang berhasil**, lainnya ditolak karena **stale revision**, tanpa kehilangan update.
2. Perangkat baru mengambil writer lease; **perangkat lama** mencoba commit dengan token/sesi terdahulu dan harus ditolak oleh server.
3. Commit dengan game ID yang berbeda dari current game harus ditolak, tanpa membuat atau mengganti game aktif.
4. Transaksi yang gagal harus **ROLLBACK** dan mempertahankan seluruh nilai skor, riwayat, revisi, serta lease.
5. Uji admin multi-device terpisah dari scorekeeper single-device dan periksa otorisasi di semua RPC.

## Kriteria kelulusan
- Semua hasil diverifikasi lewat query state database sebelum/sesudah, bukan hanya respons RPC.
- Jalankan beberapa interleaving (A dahulu, B dahulu, simultan) dan cek tidak ada deadlock atau overwrite.
- Jika ada kegagalan, jangan aktifkan Cloud Sync; dokumentasikan SQLSTATE dan perubahan state.

**Status:** belum dijalankan karena lingkungan PostgreSQL disposable dan kontrak RPC deployable belum tersedia. Ini dokumen persiapan, bukan bukti keamanan runtime.


---

### Source: STAGE13_PERSISTENT_DEVICE_BINDING_CHECKPOINT.md

# Stage 13 — Persistent Device Binding (2026-10-12)

## Perubahan
- Menambah pemeriksaan SQL draft `mahjong_sync_open` yang menolak Scorekeeper single-device membuka writer dari device ID berbeda dari **semua** riwayat device terdaftar, termasuk lease tidak aktif/keluar akun.
- Guard berada setelah lock `auth.users FOR UPDATE` dan sebelum perubahan game/lease. Admin serta Scorekeeper dengan izin multi-device dikecualikan.
- Menambah 3 regression tests, semua Node tests: **368 PASS, 0 FAIL** (`tests/stage13_persistent_device_binding.log`).

## Batasan dan keputusan sebelum uji coba
- Binding ini fail-closed; akun dengan riwayat beberapa device ID akan ditolak sampai administrator meninjau/membersihkan binding melalui prosedur aman yang BELUM dibuat. Menghapus localStorage atau mengganti browser juga dapat mengganti device ID dan memicu lock.
- Supabase Auth masih dapat login di device lain; yang ditolak adalah hak membuka writer pada SQL draft. Guard tidak mengamankan login secara global.
- SQL draft diawali exception `UNSAFE DRAFT`; tidak boleh dieksekusi. Cloud Sync tetap OFF. PostgreSQL/RLS/perangkat nyata BELUM diuji.
- Jangan memasang draft langsung ke produksi. Selanjutnya: prosedur admin unlock transaksional dan uji di database disposable; verifikasi seluruh RPC dan UI sebelum beta.


---

### Source: STAGE13_READER_BINDING_ISOLATION.md

# Stage 13 — Reader/Writer binding isolation (372 PASS)

## Temuan dan perbaikan
Pada checkpoint 370, guard permanen memeriksa *semua* `mahjong_device_sessions`, termasuk baris yang hanya pernah digunakan sebagai reader. Akibatnya, enrollment reader pada perangkat lain dapat mengunci writer Scorekeeper secara tidak sengaja. Draft SQL kini menambahkan `ever_writer boolean NOT NULL DEFAULT false`, menandainya true saat writer berhasil dibuka, dan hanya menggunakan baris `ever_writer` untuk penguncian perangkat permanen. Reader tidak mengubah flag ini. Regression test lama diselaraskan dan dua tes baru ditambahkan.

## Verifikasi
`node --test tests/*.test.cjs`: **372 PASS / 0 FAIL**. Masih pengujian lokal/statis; belum PostgreSQL runtime. SQL draft tetap memiliki hard-stop `UNSAFE DRAFT`, Cloud Sync OFF, DO NOT DEPLOY.

## Risiko yang masih terbuka
Migrasi dari sesi writer historis belum bisa mengidentifikasi secara pasti mana yang pernah menjadi writer, sehingga perlu rencana backfill aman dan verifikasi pada staging sebelum aktivasi. Admin unlock device belum tersedia. Jangan menjalankan SQL draft pada produksi.


---

### Source: STAGE13_READONLY_CONTRACT_CHECKPOINT_20261012.md

# Stage 13 — Read-only SQL contract checkpoint (2026-10-12)

Local-only review; Cloud Sync OFF; DO NOT DEPLOY.

Added `tests/sync-stage13-readonly-contract.test.cjs` with three static checks: (1) read-only preflight has no unquoted SQL mutation/privilege commands, (2) preflight references the four required tables and two primary RPC entrypoints, (3) RPC draft retains its unconditional RAISE EXCEPTION deployment blocker. The checks do not establish PostgreSQL execution safety or effective grants/RLS and are not a substitute for isolated integration testing. The read-only preflight does not currently inventory all six RPC entrypoints; this remains a review item.

Verified command: `node --test tests/*.test.cjs` — 342 PASS, 0 FAIL. Log: `tests/stage13_readonly_contract_20261012.log`.

No production Supabase, GitHub deployment, or live-game changes. Next: expand read-only inventory coverage and run negative authorization/session tests against disposable PostgreSQL/Supabase when available.


---

### Source: STAGE13_RPC_AUTHORIZATION_CHECKPOINT_20261012.md

# Stage 13 — RPC authorization checkpoint (2026-10-12)

Status: LOCAL REVIEW ONLY; DO NOT DEPLOY. Cloud Sync OFF.

Reviewed six RPC signatures in `supabase_sync_rpc_draft.sql`: open, commit, open_reader, peek, read, lease_status. Added `tests/sync-rpc-authorization-boundaries.test.cjs` with three static regression tests asserting explicit EXECUTE revoke/grant boundaries, Supabase Auth session binding, and pinned SECURITY DEFINER search paths for all six entrypoints.

Actual command: `node --test tests/*.test.cjs` — 336 PASS, 0 FAIL. Log: `tests/stage13_rpc_auth_boundaries_20261012.log`.

Important limitation: static assertions do not prove effective database privileges, PostgreSQL parser/runtime behavior, RLS correctness, token/session revocation races, or live integration. The SQL draft retains its deliberate unconditional deployment blocker. No production SQL or remote Supabase changes performed.

Next: test in isolated disposable PostgreSQL/Supabase environment with negative permissions/session tests before considering any migration. Do not execute draft on production.


---

### Source: STAGE13_RPC_INVENTORY_CHECKPOINT_20261012.md

# Tahap 13 — RPC inventory read-only

- Menambahkan inventaris enam RPC pada SQL preflight read-only: signature, installed, hak EXECUTE anon/authenticated, SECURITY DEFINER.
- Menambahkan tiga tes regresi statis untuk kelengkapan inventaris dan larangan SQL mutasi.
- Semua hasil ini adalah pemeriksaan statis lokal; belum ada PostgreSQL langsung.
- Jangan jalankan draft deployment pada Supabase produksi. Cloud Sync OFF. DO NOT DEPLOY.


---

### Source: STAGE13_RUNTIME_GATE_CHECKPOINT.md

# Stage 13 — PostgreSQL Runtime Gate Preparation (389 PASS)
Date: 2026-10-12. Source: 385 PASS checkpoint.

## Completed
- Re-extracted checkpoint and inspected PostgreSQL integration plan, administrator unlock draft, and writer RPC draft.
- Added four Node regression checks in `tests/sync-stage13-unlock-runtime-gate.test.cjs` for explicit unexecuted gate, disposable Auth fixtures, append-only audit, game preservation, and UNSAFE DRAFT blockers.
- Ran `node --test tests/*.test.cjs`: **389 PASS, 0 FAIL**; log `tests/stage13_runtime_gate_run.log`.

## Critical review finding
`supabase_sync_rpc_draft.sql` contains an intentional `UNSAFE DRAFT` exception but also GRANT EXECUTE statements and COMMIT later in the file. This is NOT a deployable migration. Its guard must not be removed or bypassed. The admin unlock draft separately ends with ROLLBACK and no GRANT.

## Not completed
No PostgreSQL server or Supabase-compatible disposable test instance was available. No real database integration, concurrency timing, RLS, rollback or session-revocation evidence obtained. Cloud Sync remains OFF. No production database or deployment touched.

## Next gate
Provision isolated Supabase-compatible test database, verify destination fingerprint, run reviewed fixture-only migrations and auth-session/RLS scenarios, record actual logs. Do not run any draft against production.


---

### Source: STAGE13_SAFE_INTEGER_CHECKPOINT.md

# Stage 13 — Safe Integer Payload Guard
Date: 2026-10-12. Version: v15.7.15. Status: DO NOT DEPLOY.

Changes:
- js/sync-supabase-adapter.js: reject integer Number values outside safe range before RPC serialization, including nested game state.
- tests/sync-unsafe-integer-payload.test.cjs: 3 regression tests.
- tests/stage13_safe_integer_20261012.log: actual local Node test run 294 PASS, 0 FAIL.
- CHECKPOINT_V15.7.15_PENGEMBANGAN.md updated.

Limits: no PostgreSQL or Supabase integration run for this checkpoint; SQL drafts remain fail-closed, Cloud Sync OFF. Stages 11–13 not finalized, 14–19 pending.

GitHub Desktop Summary:
v15.7.15 - Guard unsafe integer values in sync payloads

GitHub Desktop Description:
Reject integers outside JavaScript's safe precision range in sync snapshots before RPC. Add 3 regression tests. 294 Node tests PASS, 0 FAIL. Development checkpoint only; Cloud Sync OFF. DO NOT DEPLOY.


---

### Source: STAGE13_SAME_DEVICE_RELOGIN_CHECKPOINT.md

# Stage 13 — Same-device re-login (370 PASS)

## Masalah ditemukan
SQL draft sebelumnya menolak pembukaan writer oleh sesi Auth baru walaupun `device_id` tetap sama. Ini membuat Scorekeeper yang logout lalu login kembali pada HP yang sama terkunci permanen, padahal kebijakan beta hanya melarang pindah perangkat.

## Perbaikan
- `mahjong_sync_open` menolak writer aktif dari device ID **berbeda**, bukan sekadar session ID berbeda.
- Pembukaan sesi baru di perangkat sama tetap melalui account-row lock, pemeriksaan sesi terbaru/high-water, validasi revisi permainan, serta rotasi token writer dan pencabutan token lama secara atomik.
- Ubah satu tes statis lama yang mengharapkan larangan sesi berbeda menjadi pemeriksaan device ID; tambah tes regresi untuk re-login perangkat sama.

## Batasan
370 tes Node PASS, 0 FAIL. Belum diuji pada PostgreSQL runtime; SQL tetap memuat guard `UNSAFE DRAFT`, Cloud Sync OFF, DO NOT DEPLOY. `device_id` merupakan identitas browser yang belum dapat membuktikan perangkat fisik secara kriptografis. Mekanisme admin unlock dan uji dua perangkat belum selesai.


---

### Source: STAGE13_SCHEMA_BLOCKERS_20261012.md

# Tahap 13 — blocker kompatibilitas skema (12 Oktober 2026)

**Status: BLOCKED / DO NOT DEPLOY.** Audit statis menemukan ketidakcocokan material antara `supabase_latest.sql` dan `supabase_sync_rpc_draft.sql`:

1. Fondasi membuat indeks unik `mahjong_one_active_device_per_user` untuk setiap baris `is_active=true`. RPC `open_reader` justru mengizinkan beberapa sesi pembaca aktif pada akun admin atau scorekeeper dengan izin multi-device. Tanpa migrasi yang diuji, penambahan reader kedua akan melanggar indeks.
2. Fondasi tidak mendefinisikan kolom `is_writer`, `session_token_hash`, `revoked_at` pada `mahjong_device_sessions`, sedangkan draft RPC menggunakannya. Draft hanya menambah `auth_session_id` dan `auth_session_created_at`.
3. Draft mengasumsikan indeks parsial `mahjong_game_states_one_current_per_owner_idx`, tetapi `supabase_latest.sql` tidak membuatnya; draft menambah `is_current` saja. Diperlukan migrasi eksplisit yang aman untuk data yang sudah ada, termasuk pemeriksaan duplikasi sebelum membangun indeks unik.
4. Helper `mahjong_sync_generate_token()` dipanggil RPC, tetapi tidak dibuat oleh kedua berkas tersebut. Harus diverifikasi dari skema target lewat preflight.

**Langkah aman selanjutnya:** audit skema target melalui query hanya-baca, tentukan migrasi aditif dan prosedur untuk indeks lama, verifikasi transaksi pada database disposable dengan Auth/RLS nyata. Jangan mengeksekusi SQL draft yang sengaja digagalkan. Jangan mengubah produksi atau menyalakan Cloud Sync.

Tes baru di `tests/sync-foundation-schema-gap.test.cjs` sengaja memotret blocker ini; jika migrasi fondasi direkonsiliasi, tes harus diperbarui menjadi tes positif, bukan dibiarkan mengabadikan ketidakcocokan.


---

### Source: STAGE13_SECURITY_REVIEW_2026-10-12.md

# Tahap 13 — Hasil pengujian PostgreSQL lokal dan perbaikan SQL kandidat

Tanggal: 12 Oktober 2026. **DO NOT DEPLOY**. Cloud Sync tetap OFF.

## Bukti pengujian yang dilaporkan pengguna dari MacBook Air
- JWT user scorekeeper dengan Auth session milik admin: ditolak (`Valid auth session required`).
- JWT tanpa user id: ditolak (`Authentication required`).
- Ditemukan kondisi role NULL pada `mahjong_sync_open`; SQL fungsi di PostgreSQL lokal diperbaiki, lalu role kosong dengan sesi valid ditolak (`Account inactive or unauthorized`).
- Fixture role kosong dibersihkan: users=0, sessions=0, games=0.
- Empat sesi tersimpan memiliki token hash 64 digit hex, tanpa NULL; format saja tidak membuktikan algoritme hashing.
- Token palsu ditolak (`writer-revoked`), device id tak terdaftar ditolak, generation salah dengan token valid ditolak.
- Setelah rollback: game revision=0, round=1, active_writers=1.
- PostgreSQL Homebrew dan direktori data lokal di Mac sudah dihapus oleh pengguna setelah pengujian. Tidak tersedia lagi untuk pengujian langsung.

## Perbaikan di ZIP ini
1. `supabase_sync_rpc_review.sql`: eksplisit menolak role NULL pada RPC open.
2. Menghapus CREATE INDEX kedua yang redundan (`mahjong_one_current_game_per_owner`); mengandalkan indeks kanonik fondasi `mahjong_game_states_one_current_per_owner_idx`.
3. Menambah tes regresi statis untuk dua perbaikan tersebut dan pembatasan akses RPC.
4. Pengujian ulang Node: **265 PASS, 0 FAIL** (`tests/stage13_review_security_20261012.log`). Ini bukan pengujian PostgreSQL/Supabase end-to-end.

## Belum selesai / risiko
- SQL review ini **bukan** SQL deployment final; jangan pasang ke production.
- Pastikan indeks kanonik ada sebelum menjalankan RPC review pada lingkungan terisolasi.
- RPC lain pada draft dan validasi payload penuh, role/session edge cases, race/revocation, serta integrasi Supabase Auth nyata masih perlu audit.
- Tahap 11 dan 12 belum final; Tahap 13 belum final; Tahap 14–19 belum selesai.
- Tidak ada perubahan cloud, GitHub, atau permainan pengguna.

## GitHub Desktop (HANYA untuk commit ketika pengembangan disetujui, bukan deploy)
Summary: `v15.7.15 - Harden Stage 13 RPC review and add security tests`
Description: `Reject NULL roles in mahjong_sync_open, remove redundant current-game index creation from review SQL, and add regression tests. 265 local Node tests pass. Development checkpoint only; cloud sync disabled; do not deploy.`


---

### Source: STAGE13_SESSION_INVENTORY_CHECKPOINT_20261012.md

# Tahap 13 — Checkpoint RPC Session Inventory (348 PASS)

- Baseline: ZIP 345 PASS; tidak ada perubahan pada Supabase produksi.
- Menambahkan `tests/sync-stage13-rpc-session-inventory.test.cjs` berisi tiga pengujian statis: enam nama RPC, hak EXECUTE anon/authenticated, serta SECURITY DEFINER dan resolusi signature tepat.
- Perintah verifikasi: `node --test tests/*.test.cjs`.
- Hasil aktual: 348 PASS, 0 FAIL. Log: `tests/checkpoint_test_run_20261012_348.txt`.
- Batasan: pemeriksaan statis belum memverifikasi keamanan sesi pada PostgreSQL runtime. `psql` tidak tersedia. Audit perlu berlanjut dengan database terisolasi dan uji pencabutan hak tulis perangkat lama.
- Cloud Sync OFF. DO NOT DEPLOY. Tidak ada SQL yang dieksekusi ke Supabase.


---

### Source: STAGE13_SINGLE_DEVICE_BETA_CHECKPOINT.md

# Stage 13 — Single Device Lock Beta (2026-10-12)

## Perubahan aktual
- Pada `supabase_sync_rpc_draft.sql`, `mahjong_sync_open` kini menolak permintaan scorekeeper single-device bila sudah ada writer aktif pada device atau Supabase Auth session berbeda (`device-locked`). Pemeriksaan berlangsung setelah penguncian row owner `auth.users FOR UPDATE` dan sebelum perubahan lease. Admin dan scorekeeper multi-device tidak diubah.
- Ditambahkan `tests/sync-stage13-device-lock-beta.test.cjs` dengan dua pemeriksaan regresi untuk urutan lock dan gerbang deployment.
- Menjalankan `node --test tests/*.test.cjs`: 365 PASS, 0 FAIL (lihat `tests/stage13_single_device_beta_365.log`).

## Batasan dan risiko
- Ini hanya fondasi SQL draft dan tes statis, BUKAN login lock yang sudah berfungsi di server.
- SQL draft masih memuat fail-closed `RAISE EXCEPTION UNSAFE DRAFT`; tidak boleh dipasang ke Supabase produksi.
- Cloud Sync pada `index.html` tetap OFF. Belum ada uji PostgreSQL/Supabase Auth/RLS ataupun dua perangkat nyata.
- Kebijakan device lock harus diverifikasi juga pada jalur reader, commit, lease, dan perilaku akun multi-device. Login Auth sendiri belum ditolak; yang ditolak oleh draft adalah pembukaan writer lease.
- Untuk beta aman diperlukan database disposable, pengujian transaksi bersamaan, dan prosedur admin unlock yang tervalidasi.

## Lanjutan
1. Uji SQL dan RPC pada disposable Supabase/PostgreSQL Auth+RLS.
2. Periksa semua jalur writer, offline/reconnect dan kunci device yang tetap bertahan setelah restart.
3. Baru aktifkan integrasi browser secara terbatas setelah semua tes wajib lulus.


---

### Source: STAGE13_SUPABASE_VALIDATOR_GAP_CHECKPOINT_394.md

# Stage 13 — Checkpoint 394: Supabase validator gap (DO NOT DEPLOY)

Source: checkpoint 393 ZIP. No application code, production SQL, game data, or existing history modified.

## Verified on actual Supabase by user (12 October 2026)

The installed `public.mahjong_sync_valid_game(jsonb)` checks the history array and entry object types, but **does not inspect nested scoring fields**. Read-only tests showed:

- `history[].quads=[1,0,0,0]` => true (expected)
- `history[].quads=[5,0,0,0]` => true (should be false)
- `history[].delta=[1,2,3]` => true (should be false)
- `history[].seatWindsBefore=[0,0,2,3]` => true (should be false)

Result: 1 PASS / 3 FAIL for nested history cases. This is a validation gap, not proof that live data was corrupted.

## Important distinction

The **local** `supabase_sync_rpc_draft.sql` already contains deeper history validation, but is intentionally fail-closed and NOT executable in production. Its content must not be confused with the installed Supabase function. The draft must not be copied wholesale to SQL Editor.

## Next safe steps

1. Review draft nested history checks against `js/sync-engine.js` and historical snapshots, including optional/missing/null fields, Unicode, safe integer boundaries and preservation of unknown metadata.
2. Create a separately reviewed, isolated validator-only migration candidate, without installing Open/Commit/Read/Lease RPCs.
3. Test candidate against a disposable local PostgreSQL database and read-only fixtures before requesting permission for any live SQL changes.
4. Verify actual live function again only after explicit deployment approval.

No SQL changes, ZIP deployment, or production data changes are authorized by this checkpoint.


---

### Source: STAGE13_TAKEOVER_GUARDS_CHECKPOINT_20261012.md

# Stage 13 — Takeover guards (351 PASS)

Tanggal: 2026-10-12. Basis: checkpoint 348 PASS.

## Pekerjaan aktual
- Audit statis SQL draft `mahjong_sync_commit`: token SHA-256, generasi sesi, Auth session, dan writer lease game wajib cocok.
- Audit guard high-water login: sesi lama ditolak meskipun Auth session yang lebih baru sudah hilang.
- Audit `mahjong_sync_lease_status`: revoked/inactive/generation mismatch dan newer login ditolak.
- Tambah `tests/sync-stage13-takeover-guards.test.cjs` berisi tiga regression tests.
- Jalankan `node --test tests/*.test.cjs`: **351 PASS, 0 FAIL**; log `tests/stage13_351_test_run.txt`.

## Batas verifikasi
Semua pemeriksaan baru adalah inspeksi statis terhadap SQL draft; tidak ada PostgreSQL/Supabase runtime test, perubahan cloud, ataupun deployment. Test statis tidak membuktikan perilaku konkurensi sesungguhnya. Cloud Sync tetap OFF. DO NOT DEPLOY.

## Berikutnya
Siapkan matriks skenario uji PostgreSQL terisolasi (takeover dua perangkat, revoke, race commit, rollback) sebelum mengaktifkan Cloud Sync.


---

### Source: STAGE13_TEST_COMPATIBILITY_CHECKPOINT_396.md

# Checkpoint 396 — SQL Guard Test Compatibility

- Updated three source-pattern tests to recognize type-guarded `CASE WHEN jsonb_typeof(...) = 'array'` expressions.
- No changes to application runtime or SQL draft relative to checkpoint 395.
- Local `node --test tests/*.test.cjs`: 393 PASS, 0 FAIL.
- These are local tests, not a PostgreSQL execution of the draft or a live Supabase validation.
- Active Supabase validator still has the previously confirmed nested-history gaps; do not deploy the draft.
- Stage 13 ongoing; DO NOT DEPLOY.


---

### Source: STAGE13_TRANSACTION_ORDER_CHECKPOINT_20261012.md

# Stage 13 — Transaction ordering checkpoint (2026-10-12)

Baseline: 351 PASS. Added `tests/sync-stage13-transaction-order.test.cjs` (3 static regression checks): (1) account owner row lock precedes current-game lock, (2) writer lease and base revision validated before updating game state, (3) revision conflict is logged and returns before game overwrite. Ran `node --test tests/*.test.cjs`: **354 PASS, 0 FAIL**, recorded in `tests/stage13_transaction_order_20261012.log`.

These are static contract tests only; they do not establish real concurrent PostgreSQL transaction behavior. No production database touched, no RPC deployed. `psql` unavailable. Cloud Sync OFF. DO NOT DEPLOY. Next: isolated PostgreSQL concurrency tests when a disposable database is available; verify stale writer vs takeover and simultaneous commits.


---

### Source: STAGE13_UNLOCK_CONCURRENCY_REVIEW_CHECKPOINT.md

# Stage 13 — Unlock concurrency static review (2026-10-12)

Source checkpoint: v15.7.15 381 PASS. Added four isolated Node regression assertions in `tests/sync-stage13-unlock-concurrency-review.test.cjs`: administrator self-unlock rejection, target auth-row lock ordering before binding inspection and revocation, ambiguous historical binding refusal without game-state modification, and non-deployable SQL guards/no execution grants. Full `node --test tests/*.test.cjs` run: **385 PASS / 0 FAIL** (see `tests/stage13_unlock_concurrency_review_run.log`).

**Limitations:** These are static checks only; PostgreSQL/psql/docker are unavailable in this environment. They do not prove concurrent transaction behavior, Supabase Auth claims, RLS, or server-side role enforcement at runtime. The SQL drafts remain unsafe/non-executable; no production database changes, deployments, or cloud sync activation. **DO NOT DEPLOY.** Next: disposable PostgreSQL/Supabase runtime integration, transaction race tests, and authorization review before wiring UI.


---

### Source: STAGE13_UNLOCK_REVOCATION_CHECKPOINT.md

# Stage 13 — Admin unlock revocation checkpoint

2026-10-12. Source: 375 PASS ZIP. Hardened the *non-executable* admin unlock SQL draft to clear `session_token_hash` and set `revoked_at=now()` when invalidating writer leases; increments `session_generation` and marks writer inactive. Preserves `auth_session_id` and `auth_session_created_at` history to support stale-login rejection. Added two static regression tests (`tests/sync-stage13-unlock-revocation.test.cjs`). Ran `node --test tests/*.test.cjs`: **377 PASS, 0 FAIL**; log `tests/stage13_unlock_revocation_run.log`. No PostgreSQL runtime tests. No Cloud Sync enablement or production modifications. SQL draft retains explicit UNSAFE DRAFT guard, ROLLBACK and no GRANT. **DO NOT DEPLOY.** Next: verify cross-RPC unlock/relogin invariants in disposable PostgreSQL, then wire admin UI and cloud transport after runtime checks.


---

### Source: STAGE13_VALIDATOR_TYPE_GUARD_CHECKPOINT_395.md

# Stage 13 — Checkpoint 395: Local SQL draft type guards

DO NOT DEPLOY. No production Supabase changes.

Changes only in the `mahjong_sync_valid_game` definition of `supabase_sync_rpc_draft.sql`:
- `jsonb_array_length` now receives only arrays via CASE; wrong types return NULL.
- `jsonb_array_elements` now receives a guarded array, with `[]` for nonarrays.
- Existing type checks reject wrong types; optional historical fields remain optional.
- This is a local draft, not a verified Postgres integration run. No claim of SQL runtime PASS.

Next: execute tests against disposable local Postgres or isolated transaction before any production SQL.
No changes to live games, application JS, scoring, or cloud.


---

### Source: STAGE14_16_ACTIVATION_LOSSLESS_20261013.md

# Stage 14–16 — Activation-time lossless save guard

Status: local verification 572 PASS / 0 FAIL. Cloud Sync OFF. DO NOT DEPLOY.

## Problem found
`js/sync-app-bridge.js` already validated and cloned ordinary saves, but the special `adopting` branch enqueued the original mutable game object without the same validation. This could permit lossy values or a subsequent mutation during an in-flight activation.

## Change
The `adopting` branch now validates and deep-clones via `cloneSaveLosslessly` before durable enqueue. Invalid snapshots fail with `invalid-snapshot` without entering the queue or marking a valid activation as changed. Valid snapshots are frozen by value before enqueue; adoption is deliberately failed closed if a local save arrives during activation.

## Tests
Added `tests/sync-bridge-activation-lossless-stage14.test.cjs`: invalid nested undefined, custom serializer, and mutable snapshot capture. Run: `node --test tests/*.test.cjs` => 572 pass, 0 fail; log `/mnt/data/mahjong_572_verify.log` (not shipped as absolute path).

## Unverified
Signed JWT end-to-end; permanent installation of five RPCs; actual two-phone login and UI adoption; realtime and offline conflict behavior. PostgreSQL rollback-only results previously reported 29/29 PASS. Do not deploy or enable cloud sync.


---

### Source: STAGE14_16_ARRAY_METADATA_INTEGRITY_20261013.md

# Stage 14–16 — Array metadata integrity (2026-10-13)

## Perubahan aktual
- Memperketat `js/sync-supabase-adapter.js` pada validasi snapshot sebelum RPC: array dengan properti bernama atau kunci indeks nonkanonis ditolak, termasuk array bertingkat. `JSON.stringify` akan membuang properti ini tanpa peringatan, berisiko menghilangkan metadata permainan/riwayat.
- Menambahkan `tests/sync-adapter-array-properties-stage14.test.cjs`: 3 pengujian yang memastikan penolakan dilakukan sebelum request jaringan.
- Menjalankan `node --test tests/*.test.cjs`: **559 PASS / 0 FAIL**; log `/mnt/data/mahjong_559_verify.log`.

## Bukti Supabase dari pengguna (sebelumnya, bukan pengujian ulang)
- Negative Runtime Security: 11/11 PASS.
- Writer Lifecycle: 6/6 PASS.
- Cross-Session: 5/5 PASS.
- Two-Device Same-Auth Takeover: 7/7 PASS.
- Total: 29/29, rollback-only dengan klaim JWT simulasi.

## Batasan
- Belum ada uji signed JWT browser end-to-end / dua sesi login perangkat nyata.
- Lima RPC transfer belum dipasang permanen; migration tetap `UNSAFE DRAFT`.
- Cloud Sync OFF, tidak deploy.

## GitHub Desktop
Summary: `v15.7.15 - Reject lossy array metadata before cloud sync`
Description: `Reject named and noncanonical array properties in Supabase snapshot transport before network writes. Add three regression tests covering nested arrays and silent JSON metadata loss. 559 Node tests PASS, 0 FAIL. Cloud Sync OFF; no deployment.`


---

### Source: STAGE14_16_AUTH_NEGATIVE_RUNTIME_GATE_20261013.md

# Stage 14–16: auth-negative runtime gate (rollback only)

## Evidence
- Supabase compilation script: user reported `Success. No rows returned`.
- Post-rollback inspection: five RPC names absent (5/5 PASS).
- 540 PASS local test count inherited from previous checkpoint, not rerun here.
- NEW runtime negative test: **prepared but NOT EXECUTED**; requires user to run SQL Editor.

## Run
Run `supabase_sync_stage14_auth_negative_rollback_ONLY.sql` as one whole script in existing `mahjong score` SQL Editor. It compiles candidate functions in BEGIN, checks each rejects a missing JWT, and ROLLBACKs. Expected: five `NOTICE AUTH NEGATIVE PASS` lines, final `5/5 PASS`, and `Success`.

**Limitations:** SQL Editor postgres bypasses normal API auth; missing-JWT test is only a limited fail-closed smoke test, not role/ownership/token/concurrency validation. No real two-device transfer has been tested. No permanent install. If error, do not run fragments; report exact error.

## GitHub Desktop
Summary: `v15.7.15 - Add rollback-only RPC negative-auth runtime gate`
Description: `Prepare five-RPC missing-JWT runtime smoke test inside BEGIN/ROLLBACK; document prior 5/5 absence verification; keep Cloud Sync OFF and DO NOT DEPLOY.`


---

### Source: STAGE14_16_AUTH_SESSION_NULL_TIMESTAMP_FIX_20261013.md

# Stage 14–16: Auth session ordering hardening (13 Oct 2026)

## Actual code change
Both guarded SQL drafts now reject other active auth.sessions records whose `created_at` is NULL during single-device newer-login checks. Previously tuple comparisons with NULL returned UNKNOWN and could silently skip an ambiguous session, potentially allowing writer takeover. This is fail-closed; no production SQL was executed.

## Remaining release blockers
The SQL remains guarded by the intentional UNSAFE DRAFT exception. PostgreSQL transaction tests and two-device integration on the existing Supabase project have not been performed. Do not remove the guard, deploy the SQL, or enable cloud sync before those tests and user authorization.


---

### Source: STAGE14_16_BACKUP_RESTORE_DRILL_2026-10-13.md

# Stage 14–16 — Backup restore drill preparation (2026-10-13)

## Evidence provided by operator
- Supabase Free Plan; manual PostgreSQL 18.6 custom-format dump created 2026-10-13.
- `pg_restore --list` PASS and `pg_restore --file=/dev/null` PASS.
- Backup inventory includes Mahjong public tables/functions and auth schema data.
- File permissions verified `0600`.
- 8/8 live read-only dependency checks PASS.

## Added artifact
`tools/stage14-verify-local-backup.sh /path/to/backup.dump` verifies archive extraction and a minimum Mahjong inventory, **without network or database changes**. It does not prove recoverability.

## Restoration drill (NOT EXECUTED)
A meaningful recovery test requires an isolated LOCAL PostgreSQL server compatible with the Supabase schema/extensions and careful handling of privileged `auth`, `storage`, `realtime`, and `vault` schemas. Do not restore this full dump into the live Supabase project. A direct full restore into a stock local PostgreSQL may fail on Supabase-specific roles/extensions; that does not necessarily indicate corrupt data. Record failures and validate app-owned public objects/data separately. Do not copy credentials or private dump into GitHub.

## Release gate
- Existing five-RPC candidate remains deliberately fail-closed; DO NOT remove guard.
- Live PostgreSQL concurrent-session and two-device tests not executed.
- Cloud Sync OFF; no production deployment.
- No additional local Node test PASS claimed for this documentation-only checkpoint.


---

### Source: STAGE14_16_BACKUP_VERIFIED_INSTALL_GATE_20261013.md

# Stage 14–16 — Verified backup evidence and installation gate (2026-10-13)

## Evidence supplied by operator (existing Supabase project `mahjong score`)
- `pg_dump` 18.6 custom archive: `~/Documents/Mahjong_Supabase_Backup/mahjong_backup_2026-10-13.dump`, 369560 bytes, mode 0600.
- `pg_restore --list` succeeded; eight Mahjong function definitions and nine Mahjong TABLE DATA entries were listed.
- `pg_restore --file=/dev/null` succeeded (`BACKUP CONTENT PASS`).
- Existing four session/game tables confirmed; `auth_session_created_at` and `ever_writer` added to device sessions.
- Device sessions count: 0; token-generator sample: 64 lower-case hex characters.

## Critical limitations
- Archive read/extract is NOT proof of a successful PostgreSQL restore. Restore rehearsals remain pending.
- Database dump may contain Auth/Vault secrets; never commit or share it. Storage objects themselves and external configuration are not included in this database archive.
- The backup was made AFTER the two new columns were added; it cannot alone restore the exact schema from before that earlier alteration.
- No five-RPC deployment, live SQL transaction test, or two-device validation has occurred.

## Reviewed SQL candidate
`supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql` contains a deliberate `RAISE EXCEPTION` installation guard. Keep it. It replaces `mahjong_sync_valid_game` and `mahjong_sync_peek` in addition to adding five RPCs. Mismatch responses now return identity/revision only. Source review is NOT proof of PostgreSQL correctness, privileges, or concurrent takeover behavior.

## Deployment gate
1. Establish a *tested* restoration plan for the target database and verify critical live data separately.
2. Run isolated PostgreSQL execution tests for function compilation, grants, token binding, atomic takeover and rejection, read permissions, rollback and concurrent sessions.
3. Review and approve an executable migration derived from the guarded draft; do not execute the guarded draft or remove its guard blindly.
4. Deploy only after explicit confirmation; Cloud Sync OFF until two real devices pass end-to-end tests.

## Local verification
`node --test tests/*.test.cjs`: 528 PASS, 0 FAIL on this worktree. See `tests/stage14_16_install_gate_test_run_20261013.txt`.


---

### Source: STAGE14_16_BATCH_IMPLEMENTATION_20261013.md

# Stage 14–16 fast-track implementation checkpoint — 13 October 2026

## Actual code change
- `index.html`: in the cloud adoption branch where persisted game JSON already equals the cloud snapshot but in-memory state is stale, now calls `scheduleLivePublish()` after `render()`. This keeps live viewers in sync following automatic session transfer. Previously only the differing-snapshot branch published live updates.
- `tests/sync-adoption-live-publish.test.cjs`: two regression checks for both adoption paths.
- `tests/stage14-existing-default-alignment.test.cjs`: restrict non-destructive migration assertion to relevant SQL section and remove comments before checking UPDATE statements. The previous test matched unrelated later SQL.

## Verification
`node --test tests/*.test.cjs`: 503 PASS / 0 FAIL (log `tests/stage14_16_batch_20261013.log`). These are local tests, not live PostgreSQL integration tests.

## Release blockers
Five RPCs remain uninstalled in the existing Supabase project. SQL candidate intentionally retains a RAISE EXCEPTION deployment guard. Two-device acceptance and transaction/security tests have NOT been run. Cloud Sync remains OFF (`MAHJONG_CLOUD_SYNC_ENABLED=false`). No production changes or deployments were made. This is NOT a completed Stage 14–16 release.


---

### Source: STAGE14_16_BRIDGE_LEASE_NEUTRAL_20261013.md

# Stage 14–16: Bridge lease concurrency correction (2026-10-13)

## Actual change
- `js/sync-app-bridge.js`: treat `lease-check-busy` (commit/activation in progress) and `lease-superseded` (newer probe won) as neutral local scheduling outcomes. Neither represents a remote lease revocation. Do not withdraw writer privilege or fire a conflict for these two outcomes.
- `tests/sync-bridge-neutral-lease.test.cjs`: two regression tests verifying that a valid writer remains active and no conflict callback fires for these neutral outcomes.
- Test command: `node --test tests/*.test.cjs` => 520 PASS / 0 FAIL. Full log `tests/stage14_16_bridge_lease_neutral_20261013.log`.

## Security / release boundary
- This does not override actual server revocation or failure. Any other non-OK lease result continues to withdraw local write access.
- Supabase was not contacted or modified. Five RPCs remain uninstalled; real PostgreSQL transactions and two-device takeover untested.
- `MAHJONG_CLOUD_SYNC_ENABLED=false`. SQL guard intentionally retained. DO NOT DEPLOY.
- Do not claim Stage 14–16 complete or cloud transfer production-ready.


---

### Source: STAGE14_16_BRIDGE_LOSSLESS_SAVE_20261013.md

# Stage 14–16 — Lossless local save before durable queue (13 Oct 2026)

Status: DEVELOPMENT ONLY — Cloud Sync OFF — DO NOT DEPLOY.

## Change
- `js/sync-app-bridge.js`: check local save object for JSON-lossy properties and invalid numbers **before** enqueueing the durable queue. Previously JSON.stringify/parse silently removed undefined values, named array metadata, hidden properties and sparse array holes before the Supabase RPC adapter could inspect them.
- Reject non-JSON prototypes, circular references, symbols, accessors, unsafe integer and non-finite numbers; return `invalid-snapshot` without writing to queue.
- `tests/sync-bridge-lossless-save-stage14.test.cjs`: six new negative tests assert no durable enqueue.

## Verification
- `node --test tests/*.test.cjs`: **565 PASS, 0 FAIL**, executed locally, log `/mnt/data/mahjong_565_verify.log`.
- PostgreSQL results supplied by user: 29/29 PASS (11 runtime, 6 lifecycle, 5 cross-session, 7 device takeover); these were not re-run in this checkpoint.
- Signed JWT and two-real-device UI acceptance not yet performed. Five RPCs not installed permanently. Do not enable Cloud Sync or deploy.

## GitHub Desktop
Summary: `v15.7.15 - Prevent lossy cloud saves before durable queue`
Description: `Validate local game snapshots before durable enqueue; reject hidden metadata, sparse arrays, undefined values and unsafe numbers. Add six regression tests. 565 Node PASS, 0 FAIL. Cloud Sync OFF; no deployment.`


---

### Source: STAGE14_16_BRIDGE_UNICODE_SERIALIZER_20261013.md

# Stage 14–16 — Bridge Unicode and Serializer Integrity (2026-10-13)

Status: LOCAL ONLY, DO NOT DEPLOY. Cloud Sync remains OFF.

## Changes
- `js/sync-app-bridge.js`: reject Unicode NUL and unpaired UTF-16 surrogate sequences in game snapshots, including object keys, before durable enqueue. PostgreSQL JSONB rejects NUL and invalid Unicode sequences.
- Reject own or inherited custom `toJSON` serializers at any depth, preventing a serialized snapshot from diverging from the inspected snapshot.
- Inspect JSON object keys as well as values for Unicode safety.
- `tests/sync-bridge-lossless-save-stage14.test.cjs`: add four regression tests for Unicode NUL, high surrogate, low-surrogate key and custom serializer; assert no durable enqueue.

## Verification
`node --test tests/*.test.cjs`: 569 PASS, 0 FAIL (log `/mnt/data/mahjong_569_verify.log`). Prior checkpoint: 565 PASS.
PostgreSQL tests (user reported): 29/29 PASS, including 7/7 device takeover. Not rerun here.

## Remaining
Five RPCs not installed permanently; signed JWT, two real devices, UI auto-adoption, offline and Realtime still require acceptance tests. Never activate Cloud Sync before explicit approval.

## GitHub Desktop
Summary: `v15.7.15 - Guard bridge snapshots against Unicode and serializers`
Description: `Reject invalid Unicode and custom JSON serializers before durable cloud queue. Add four lossless-save regression cases. 569 Node tests PASS, 0 FAIL. Cloud Sync OFF; no deployment.`


---

### Source: STAGE14_16_COMMIT_ACK_BATCH_20261013.md

# Stage 14–16 — Commit acknowledgement fail-closed batch

## Actual implementation
- `js/sync-app-bridge.js`: a missing or malformed commit response can no longer be treated as success. The bridge withdraws writer permission, emits a conflict, and returns `invalid-sync-acknowledgement`.
- When 33 bounded flushes cannot drain edits added during an in-flight commit, return `sync-still-pending` instead of falsely reporting success. The engine's durable queue is preserved; the bridge blocks further writes pending explicit recovery.
- `tests/sync-app-bridge.test.cjs`: two targeted regression tests covering undefined commit acknowledgements and permanently pending flushes.

## Verification
`node --test tests/*.test.cjs`: 518 PASS / 0 FAIL on 2026-10-13. Log: `tests/fasttrack_batch_20261013.log`.

## Unfinished and safety boundary
- This is a local client-side implementation improvement, NOT PostgreSQL RPC integration or proof of automatic device transfer.
- Existing five RPC SQL drafts remain guarded and **must not be deployed**. Cloud Sync remains OFF.
- PostgreSQL integration and real two-device tests are still required. Do not claim Stages 14–16 complete.
- Existing Supabase project and production data were not touched.


---

### Source: STAGE14_16_COMPILE_ROLLBACK_HANDOFF_2026-10-13.md

# Stage 14–16 — PostgreSQL compilation drill (DO NOT DEPLOY)

Checkpoint baseline: 540 local Node PASS / 0 FAIL from prior checkpoint. No new local Node test result is claimed in this handoff.

Verified by user on existing Supabase project `mahjong score`: backup archive list/content checks PASS; 8/8 readiness checks PASS; temp transaction and rollback cleanup PASS. These checks do not prove restore, concurrent takeover, or RPC runtime behavior. Existing session rows and sync conflicts were zero at last check. Cloud Sync OFF. Five new RPCs not installed.

## New artifact
`supabase_sync_stage14_compile_rollback_ONLY.sql` is derived from `supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql`. The deliberate abort guard is removed ONLY in this derived compilation drill, and final COMMIT is replaced with ROLLBACK. Original guarded candidate is unchanged. Execute the ENTIRE script in one Supabase SQL Editor run; NEVER run fragments. If SQL errors, transaction must be rolled back (new editor query session if necessary). This drill temporarily creates/replaces SQL functions within the transaction and rolls back; no permanent deployment is intended. It tests DDL compilation only, not RPC correctness or privileges after commit. The SQL Editor may show success without rows on successful completion.

## Remaining gates
1. Verify the compile-only drill succeeds and no new RPC persists afterwards.
2. Independently audit SECURITY DEFINER code, auth/session validity, transaction lock order, SQL semantics, response data, and Supabase function privileges.
3. Develop isolated authenticated runtime tests including simultaneous writers, revoked session, stale revisions, reader, and administrator policy.
4. Perform a restore drill where feasible; archive extraction alone is not restore validation.
5. Only after passing gates, prepare reviewed production migration and explicitly authorize execution. Do not enable Cloud Sync or deploy app yet.

GitHub Desktop Summary: `v15.7.15 - Prepare rollback-only RPC compilation drill`
GitHub Desktop Description: `Add isolated PostgreSQL five-RPC DDL compilation drill ending in ROLLBACK; preserve guarded production candidate; document verification and remaining gates; Cloud Sync OFF; DO NOT DEPLOY.`


---

### Source: STAGE14_16_DEVICE_TAKEOVER_HANDOFF_20261013.md

# Stage 14–16 — Device takeover handoff (2026-10-13)

## Verified in Supabase SQL Editor (user supplied result)
- Two device IDs, one newest Auth session, rollback-only: 7/7 PASS.
- Device A open, Device B writer takeover, A stale write rejected `writer-revoked`, B read, exact JSONB snapshot match, revision unchanged.
- Prior gates: 11/11 runtime negative, 6/6 writer lifecycle, 5/5 cross-session = 29/29 including takeover.
- JWT claims were simulated within SQL Editor; **no signed-JWT two-device browser test**.

## Release blocker / next action
- Five transfer RPCs have NOT been permanently installed; SQL draft retains UNSAFE DRAFT guard.
- `index.html` sets `MAHJONG_CLOUD_SYNC_ENABLED=false`; no production activation.
- Real cross-auth-session automatic transfer and UI old-device revocation have NOT been tested.
- Test both signed browser sessions after a separately reviewed migration and explicit staging activation, with game backup and rollback procedure. Do not enable cloud sync or deploy prematurely.

## New local regression gate
`tests/stage14-16-release-gate.test.cjs` checks disabled release switch, bridge wiring, writer gating, five transport RPC references, and lease monitor. These are static tests, NOT server integration evidence.


---

### Source: STAGE14_16_FASTTRACK_AUTH_GUARD_20261013.md

# Stage 14–16 — consolidated auth session timestamp guard

## Actual implementation
Both intentionally non-deployable SQL drafts now require `auth.sessions.created_at IS NOT NULL` in the active auth-session lookup in each of six RPCs (open, commit, open_reader, peek, read, lease_status). This closes the inconsistency where the `open`/`open_reader` paths rejected a missing timestamp, while commit and read paths could accept it. Session creation timestamps are used for single-device login ordering, so NULL cannot be treated as valid.

## Verification
`node --test tests/*.test.cjs`: 513 PASS / 0 FAIL, local only. Two new contract tests assert all six checks in each draft. No live Supabase execution or device tests have occurred.

## Deployment boundary
Both drafts retain their unconditional exception guard. Do not run on the existing project until SQL transaction/security testing, explicit approval, and two-device validation are completed. Cloud Sync remains OFF. No existing user/game/session data changed.

## Outstanding
Actual PostgreSQL integration and 2-device takeover, reader behavior, offline conflict/revision, and logout behavior remain unverified. This is not a final production release.


---

### Source: STAGE14_16_FASTTRACK_HANDOFF_20261013.md

# Stage 14–16 — Fast-track integration handoff (2026-10-13)

## Verified evidence from user-supplied Supabase read-only queries
- Four tables exist; RLS enabled; no direct anon/authenticated table privileges.
- Unique indexes for one active writer per user and one current game per owner.
- Five target RPCs are absent; helper RPCs and peek are present.
- pgcrypto and extensions.digest are available.
- `auth_session_created_at` and `ever_writer` are missing; current-game default is true.

## Critical blockers to activating cloud sync
1. Candidate SQL intentionally aborts; never remove the fail-closed guard merely to install it.
2. Verify exact token-generator output format/entropy and secure hashing, not just regex presence.
3. Reconcile schema additions and `is_current` default with existing records and constraints.
4. Verify `mahjong_sync_is_admin` checks banned accounts, and assess helper EXECUTE grants.
5. Execute concurrency, stale-session, stale-revision, and two-device tests on the existing Supabase project with dedicated test accounts and disposable game data.
6. Confirm client bridge remains disabled until all gates pass.

## Status
Local automated regression tests are not live Supabase integration tests. No production SQL executed, no app deployment, no cloud sync activation. The next step requires a reviewed installation migration and live verification; this package is **DO NOT DEPLOY**.


---

### Source: STAGE14_16_FASTTRACK_PAYLOAD_HARDENING_20261013.md

# Stage 14–16 — Browser RPC payload hardening

Status: local implementation only, **DO NOT DEPLOY**. Source: previous 513 PASS checkpoint.

## Implemented
- Hardened `js/sync-supabase-adapter.js` to reject before RPC: Unicode NUL, unpaired UTF-16 surrogates in keys and values, undefined/functions/symbols/bigints, sparse arrays, non-JSON object prototypes, custom `toJSON` coercion, and circular references.
- Prevents silently changed game/history snapshots from being sent to PostgreSQL; accepts valid supplementary Unicode.
- Added `tests/sync-adapter-json-safety-batch.test.cjs` with three test cases.
- Ran `node --test tests/*.test.cjs`: **516 PASS, 0 FAIL** (see `fasttrack_batch_test.log`).

## Release gate
- Existing guarded SQL remains intentionally non-executable. No Supabase changes, no deployment, Cloud Sync OFF.
- This does not establish PostgreSQL RPC correctness or two-device acceptance. Stage 14–16 remain incomplete.
- Future required work: finalize and authorize RPC migration on existing Supabase project, integration tests with isolated accounts and two devices, rollback and recovery verification.


---

### Source: STAGE14_16_FASTTRACK_SNAPSHOT_INTEGRITY_20261013.md

# Stage 14–16 — Snapshot integrity batch (2026-10-13)

## Implemented
- Reject own symbol-keyed fields instead of silently omitting them during JSON serialization.
- Reject accessor/getter fields without executing user-defined getter code.
- Reject non-enumerable own fields (except the intrinsic `length` descriptor on arrays).
- Preserve normal dense-array and plain-object serialization.
- Added four Node tests for symbol, getter, hidden field, and normal payload behavior.
- Verified `node --test tests/*.test.cjs`: 524 PASS / 0 FAIL.

## Release boundary
- Existing guarded SQL draft remains intentionally non-executable. Do not remove its fail-closed guard.
- Five RPCs not installed. No PostgreSQL or two-device acceptance tests have run.
- Cloud Sync OFF, no production changes. Stage 14–16 not complete.
- Next true blocker is approval and controlled database integration on existing project after backup and rollback readiness.


---

### Source: STAGE14_16_FIVE_RPC_ROLLBACK_HARNESS_20261013.md

# Stage 14–16 — Five-RPC rollback-only compile/security harness

- New SQL: `supabase_sync_stage14_five_rpc_compile_security_ROLLBACK_ONLY.sql`.
- Compiles the current five-RPC candidate in one PostgreSQL transaction, checks all five are SECURITY DEFINER with empty search_path, confirms authenticated EXECUTE and no anon EXECUTE, then ROLLBACK.
- The original guarded candidate remains unchanged and MUST NOT be installed.
- IMPORTANT: This harness has NOT been run on the live Supabase project. PostgreSQL compile and runtime results are pending.
- WARNING: the SQL temporarily takes schema/function locks; run only during a quiet maintenance window. Never deploy the harness as migration.
- The SQL Editor simulates JWT claims and cannot verify JWT signatures or real two-device behavior.
- Existing 547 local tests from the previous checkpoint are historical until rerun; no new PASS count asserted without execution.
- Cloud Sync OFF, no production deploy.

GitHub Desktop Summary: v15.7.15 - Add rollback-only five RPC security gate

GitHub Desktop Description: Add one transaction-scoped SQL harness compiling five transfer RPCs and asserting secure function grants; always ROLLBACK. Preserve guarded deployment candidate and Cloud Sync OFF.


---

### Source: STAGE14_16_IMPLEMENTATION_AUDIT_20261013.md

# Stage 14–16 implementation audit — 13 October 2026

## Verified locally
- 501 automated tests PASS / 0 FAIL (FASTTRACK_VERIFICATION.txt).
- Five RPC candidate bodies exist but the migration deliberately raises an exception before BEGIN. **Do not remove guard.**
- Existing-project unique index name corrected in the candidate comments.
- Writer-token format is now explicitly checked before use in candidate RPC open; actual generator output remains unverified.
- Browser integration has auth lifecycle wiring, but MAHJONG_CLOUD_SYNC_ENABLED=false.

## Blocking items before safe activation
1. Live PostgreSQL transactional/concurrency tests with disposable accounts on the existing project.
2. Confirm generator actually returns 64 lower-case hex characters and sufficient entropy.
3. Review and safely migrate existing game/session rows and new column defaults.
4. Review server authorization, function permissions and admin ban checks.
5. Test two devices, stale token, stale revision, offline recovery and full game history.

No SQL was executed against Supabase. No cloud sync enabled. This is a meaningful source audit/hardening checkpoint, **not a completed feature**.


---

### Source: STAGE14_16_INSTALL_GATE_2026-10-13.md

# Stage 14–16 — Real Supabase installation gate (2026-10-13)

## Evidence from existing project `mahjong score` (user-supplied SQL results)
- Four existing tables, one deployed RPC `mahjong_sync_peek`; five RPCs not installed.
- Two columns `auth_session_created_at` and `ever_writer` added successfully.
- `mahjong_device_sessions` contains zero rows; no old leases need backfill.
- `mahjong_sync_generate_token()` returned 64 lowercase hexadecimal characters on one invocation. This is a format check, **not** an entropy/security proof.
- Existing `mahjong_game_states.is_current` DEFAULT remains `true` unless explicitly altered. Candidate SQL changes future default to false; no current rows should be modified without a separate migration decision.

## Candidate review and exact scope
File: `supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql`.
- Has intentional top-level `RAISE EXCEPTION` guard. Must not run as production migration.
- In addition to adding five RPCs, it replaces `mahjong_sync_valid_game(jsonb)` and `mahjong_sync_peek()` and alters game default.
- Writer `open` uses account-level `auth.users FOR UPDATE`, cloud revision preflight, writer-token rotation, and audit insert in one function transaction.
- `commit` checks Auth session ID, generation, hashed token, writer ownership and revision before mutation.
- `open_reader` refuses single-device scorekeeper access and refuses overwriting a writer enrollment.
- Local Node tests are not equivalent to PostgreSQL execution, SECURITY DEFINER privilege tests, or simultaneous real-device sessions.

## Required gate before removing the SQL guard
1. Confirm recoverable Supabase backup/snapshot and document restoration path. No backup was performed by this assistant.
2. Run transaction-scoped schema/privilege test on the **existing** Supabase project using isolated test identities; do not test against real scorekeeper/game data.
3. Verify Auth/JWT role checks and function owner privileges, no public/anon EXECUTE, safe search_path, and RLS bypass assumptions.
4. Exercise two independent Auth sessions: takeover, stale writer commit denial, failed takeover preserving writer, reader isolation, revision conflict, logout/revocation, and network retry.
5. Only after tests pass, explicitly approve final install script and app rollout. Keep Cloud Sync OFF meanwhile.

## Local verification
`node --test tests/*.test.cjs`: 526 PASS / 0 FAIL on 2026-10-13 (log: `tests/stage14_16_install_gate_526.log`). No new test cases added. No SQL installed. DO NOT DEPLOY.


---

### Source: STAGE14_16_INSTALL_READINESS_20261013.md

# Stage 14–16: integration readiness (2026-10-13)

## Evidence from actual Supabase SQL Editor (provided by operator)
- Four required tables and `mahjong_sync_peek()` present; five transfer RPCs absent.
- `auth_session_created_at` and `ever_writer` columns were added successfully.
- `mahjong_device_sessions`: 0 total rows, 0 active sessions, 0 writers.
- Token generator returned a 64-character lowercase hexadecimal token in one test. This does **not** establish unpredictability.
- Operator created local `pg_dump` custom archive on Mac, 369560 bytes, chmod 600. `pg_restore --list` and `pg_restore --file=/dev/null` returned PASS; catalog includes Mahjong table data and functions.
- No restore into a running PostgreSQL database has been demonstrated. Storage object bytes and external settings may be outside the dump.

## Safety boundaries
- The SQL candidate starts with an intentional `RAISE EXCEPTION` guard. It remains intact.
- Candidate alters existing validator and peek functions in addition to creating five new RPCs.
- `mahjong_game_states.is_current` currently defaults true; candidate proposes changing future default to false.
- Static unit tests are not equivalent to live Postgres concurrency / two-device testing.
- Run `supabase_sync_stage14_install_readiness_readonly.sql` to confirm dependencies on the live project; it does not change data.
- Do not install candidate, switch on Cloud Sync, or deploy until rollback and restore procedures are rehearsed and function bodies reviewed.

## Recommended next integration milestone
1. Obtain read-only readiness results and resolve discrepancies.
2. Test restoration in isolated local PostgreSQL (not another Supabase project) or obtain a proven restore plan.
3. Validate corrected SQL in a rollback-only transaction with test identities, then execute concurrency tests on the existing project only with explicit controlled test fixtures.
4. Only after all gates pass, prepare a separate installable migration and an explicit rollback script; do not remove the draft guard in-place.


---

### Source: STAGE14_16_JWT_USER_BINDING_20261013.md

# Stage 14–16 — JWT user binding, 2026-10-13

## Implemented in this checkpoint
- `js/sync-app-bridge.js`: if JWT contains a `sub` claim, it must match the Supabase session `user.id` before any cloud engine initialization or adoption. A mismatch fails closed.
- Reject JWT `exp` claims with an invalid type or non-finite value, rather than interpreting them as an unexpired token.
- `tests/sync-app-bridge.test.cjs`: regression coverage for mismatched subject and invalid expiration.
- Full local Node suite: 507 PASS, 0 FAIL (`tests/stage14_16_batch_20261013.log`).

## Release boundary
- This is local application hardening, **not** proof that Stage 14–16 are complete.
- Cloud sync remains explicitly OFF in `index.html`.
- No Supabase database or live deployment was modified.
- SQL RPC draft retains the deliberate fail-closed guard; do not execute it.
- Required before release: guarded SQL review, authorized migration in the existing Supabase project, database integration tests, and two-device transfer/old-writer revocation acceptance tests.


---

### Source: STAGE14_16_LEASE_COMMIT_RACE_FIX_20261013.md

# Stage 14–16 — Lease/Commit concurrency protection

Actual implementation change in `js/sync-engine.js`:
- A lease check is deferred while a commit or activation is in progress.
- An in-flight lease check records the revision at dispatch; if a commit advances the revision before the lease reply arrives, the stale reply is ignored rather than revoking the valid writer.
- Existing explicit server revocations still fail closed when no concurrent commit/activation has superseded the check.

New tests: `tests/sync-lease-commit-race.test.cjs`, covering both concurrent scheduling orders.
Full local run: 509 PASS / 0 FAIL (`tests/stage14_16_lease_commit_race_20261013.log`).

LIMITATIONS: No real PostgreSQL/Supabase RPC deployment or two-device test. The SQL candidate remains intentionally guarded, cloud sync disabled, production unchanged. Do not deploy.


---

### Source: STAGE14_16_LEASE_PROBE_ORDER_20261013.md

# Stage 14–16: Lease probe response ordering (local-only)

## Change
- `js/sync-engine.js`: assign monotonic `leaseProbeSequence` for each lease-status RPC call; ignore stale responses and stale errors from an older overlapping probe.
- `tests/sync-lease-probe-order.test.cjs`: two new regression cases: stale revocation and stale network failure after newer successful probe.
- Rationale: concurrent lease probes can complete out of order. Without ordering, an earlier transient failure or stale server response could revoke a valid local writer state after a later successful probe.

## Verification
- `node --test tests/*.test.cjs`: 511 PASS / 0 FAIL (local Node tests only).
- No actual PostgreSQL integration or two-device test performed.
- Cloud Sync remains disabled; existing Supabase project unchanged.
- Candidate SQL remains guarded DO NOT DEPLOY.

## Remaining blockers
- Finalize and test five RPCs against PostgreSQL with isolated test accounts in existing project.
- Validate actual old-device revocation, new-device adoption and full game history/Quad persistence across two devices.
- Do not deploy or enable Cloud Sync without explicit approval.


---

### Source: STAGE14_16_LIVE_POSTGRES_GATE_20261013.md

# Stage 14–16: Live PostgreSQL gate (13 Oct 2026)

## Confirmed by user in existing Supabase project
- Four sync tables and mahjong_sync_peek exist; five new RPCs absent.
- Added auth_session_created_at and ever_writer to mahjong_device_sessions.
- No device sessions or sync conflicts at verification time.
- Token generator returned 64 lowercase hexadecimal characters (one sample; entropy not established).
- Eight read-only readiness checks returned true.
- Mac backup: mahjong_backup_2026-10-13.dump, 369560 bytes, chmod 600. pg_restore --list and pg_restore --file=/dev/null passed. Full database restore has NOT been demonstrated.

## SQL source inspection
- Candidate supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql retains deliberate exception guard and MUST NOT be executed as a production migration.
- Five RPCs are declared SECURITY DEFINER with empty search_path, and execute is explicitly revoked from PUBLIC and anon.
- Candidate also replaces existing mahjong_sync_peek and mahjong_sync_valid_game. Review backward compatibility and function owner/permissions before changing deployed functions.
- open and commit lock auth.users rows and game rows, but no real concurrent PostgreSQL transaction testing has been performed.
- Open rejects local-cloud mismatch without returning full cloud snapshot.

## Remaining release gates
1. Demonstrate actual restore into an isolated local PostgreSQL instance, verify Mahjong table counts, functions and roles. Avoid restoring auth internals into a running Supabase project.
2. Review function owner and grants, SQL parse/type checks, migration rollback and dependency effects.
3. Execute transaction tests with synthetic test users in a controlled PostgreSQL/Supabase environment, including concurrent writer takeovers, stale tokens, replay, conflicts, revoked sessions, and role changes.
4. Test two real devices with live Supabase before enabling Cloud Sync.
5. Explicit approval for final SQL installation; do not silently remove guard.

## Safety
Cloud Sync OFF. Five RPCs NOT installed. No production changes performed by this checkpoint. This is an evidence handoff, not an installation-ready release.


---

### Source: STAGE14_16_LIVE_PREFLIGHT_EVIDENCE_20261013.md

# Stage 14–16 — Existing Supabase project evidence and deployment gate

Status: DO NOT DEPLOY. Cloud Sync OFF. This file records user-supplied SQL results, not a live database connection by the assistant.

## Confirmed by user in SQL Editor
- public.mahjong_device_sessions, mahjong_game_states, mahjong_session_audit, mahjong_sync_conflicts exist.
- public.mahjong_sync_peek exists as SECURITY DEFINER; the other five RPCs were absent at inspection.
- Two ALTER TABLE ADD COLUMN IF NOT EXISTS operations succeeded: auth_session_created_at timestamptz; ever_writer boolean NOT NULL DEFAULT false.
- Device session count 0, active sessions 0, active writers 0, missing active timestamps 0, historical writer flags to review 0.
- mahjong_sync_generate_token() returned a 64-character lowercase hex token in one execution. This is only a format test, not proof of randomness.
- public.mahjong_game_states.is_current default remains true until explicitly changed (not yet done).

## Local SQL candidate audit
- Candidate begins with intentional RAISE EXCEPTION, so it is not installable; guard must not be removed without server-backed tests.
- Candidate replaces deployed mahjong_sync_valid_game and mahjong_sync_peek, so scope extends beyond five new RPCs.
- SECURITY DEFINER and auth.sessions reads require role/ownership/EXECUTE review.
- Reader enrollment has an ON CONFLICT UPDATE path; test concurrent reader/writer enrollment and uniqueness constraints on real PostgreSQL.
- Test token entropy independently, revoked auth session handling, JWT binding, concurrent writer takeover, stale commit rejection, transaction rollback, permissions and RLS.
- Before migration obtain backup / restore point for the existing project. The zero-row device session count does not establish zero game states.

## Next gate
Run isolated PostgreSQL/Supabase transaction and role tests with nonproduction test accounts in the existing project, without changing real games. Do not turn Cloud Sync ON or deploy PWA until two-device tests pass. No new automated test PASS count claimed in this note.


---

### Source: STAGE14_16_NESTED_SERIALIZER_GUARD_20261013.md

# Stage 14–16 — Nested serializer guard (2026-10-13)

## Perubahan
- `js/sync-supabase-adapter.js`: periksa `toJSON` pada seluruh objek dan array bersarang sebelum `JSON.stringify`, termasuk metode yang diwarisi. Mencegah payload terserialisasi berbeda dari snapshot tervalidasi.
- `tests/sync-supabase-adapter.test.cjs`: tiga kasus regresi baru untuk nested object, nested array, dan inherited serializer. Memastikan tidak ada RPC dipanggil saat ditolak.

## Verifikasi
- `node --test tests/*.test.cjs`: **575 PASS, 0 FAIL** (log `/mnt/data/mahjong_575_verify.log`).
- PostgreSQL: hasil terakhir dari pengguna **29/29 PASS**, bukan diuji ulang pada checkpoint ini.
- Lima RPC permanen belum dipasang; signed JWT dan perangkat nyata belum diverifikasi.
- Cloud Sync tetap OFF. **DO NOT DEPLOY**.

## GitHub Desktop
Summary: `v15.7.15 - Block nested JSON serializers in cloud snapshots`
Description: `Reject nested and inherited toJSON serializers before Supabase transport. Add three regression tests; 575 Node tests PASS, 0 FAIL. Cloud Sync OFF, no deployment.`


---

### Source: STAGE14_16_NULL_SESSION_ID_GUARD_20261013.md

# Stage 14–16 — Historical session UUID guard

## Implemented
- Both guarded SQL drafts now fail closed if a historical session has a timestamp but a NULL `auth_session_id`. Previously PostgreSQL row comparisons returned NULL (not TRUE), potentially bypassing the newer-session check.
- Applied to all seven high-water checks in each draft (writer, reader, peek, read, lease).
- Added two static regression checks.

## Boundary
- These are **guarded drafts**, not deployable migrations. No live database modification.
- Legacy records without `auth_session_created_at` still require a separate migration policy.
- PostgreSQL execution and two-device validation remain outstanding.
- Cloud Sync remains OFF.


---

### Source: STAGE14_16_POSTLOCK_AUTH_REVALIDATION_20261013.md

# Stage 14–16 — Post-lock Auth revalidation (candidate only)

- Hardened **guarded, non-deployable** `supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql`.
- Recheck `auth.sessions` ownership, creation time and expiry **after** locking `auth.users` in `mahjong_sync_open`, `mahjong_sync_commit`, and `mahjong_sync_open_reader`.
- Reject missing/expired sessions with SQLSTATE `28000`; use `clock_timestamp()` for expiry rechecks.
- Preserve the original top-level `UNSAFE DRAFT` guard. No database deployment.
- This reduces the pre-lock/post-lock validation gap, but **does not** prove Supabase Auth session revocation concurrency or signed JWT verification. A live integration test remains required.
- No application changes; Cloud Sync OFF.

GitHub Desktop Summary: `v15.7.15 - Revalidate RPC Auth sessions after account lock`

Description: `Harden guarded Stage 14 transfer SQL candidate with post-lock Auth session checks for writer open, commit and reader open. Preserve UNSAFE DRAFT guard and Cloud Sync OFF; no deployment.`


---

### Source: STAGE14_16_REAL_AUTH_INTEGRATION_GATE_20261013.md

# Stage 14–16 — accelerated integration gate (2026-10-13)

## Code inspected
- `index.html`: `MAHJONG_CLOUD_SYNC_ENABLED=false`; `scheduleMahjongCloudAuth` receives Supabase auth session and calls bridge only if enabled; `save()` prevents writes when lease not writable.
- `js/sync-app-bridge.js`: session identity is parsed from JWT payload, epoch protects stale async adoption; lease monitor and queue exist. **Parsing JWT locally does not verify its signature**; signed JWT verification must occur in Supabase Auth/PostgREST.
- `js/sync-engine.js`: `peek -> open` with expected cloud game identity/revision; durable pending queue refuses takeover until reconciled.
- `js/sync-supabase-adapter.js`: five RPC calls and peek wired to client.
- `supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql`: starts with an intentional exception; not installable as-is.

## Confirmed from user-supplied Supabase SQL Editor results
- Runtime security 11/11, writer lifecycle 6/6, cross-session 5/5, same-auth two-device takeover 7/7 = **29/29** rollback-only checks.
- These are SQL Editor simulations, **not** signed-JWT client integration tests or permanent RPC deployment.

## Gate before deployment
1. Run `supabase_sync_stage14_REAL_AUTH_PREFLIGHT_READONLY.sql` and review results; **no database writes**.
2. Independently security-review migration before removing deployment guard; obtain explicit authorization before permanent installation.
3. Use authenticated client with real JWT, validate server `auth.uid()` and `auth.jwt()->>'session_id'`, account/role/multi-device policy; do not paste JWT into chat or SQL Editor.
4. Test two real browser devices: transfer, old device read/write denial, newest device exact snapshot recovery, offline edits conflict resolution, refresh and Realtime, admin multi-device.
5. Keep cloud sync OFF until acceptance; never enable by changing the flag alone.

## Risk requiring integration acceptance
Current client `sessionIdentity()` parses the token's payload without signature verification; server must independently authenticate every RPC. The client also supports explicit `session_id` fallback for test compatibility; production signed-token acceptance must be verified before enablement. A `ROLLBACK` SQL Editor test cannot establish real-device logout UX.


---

### Source: STAGE14_16_RESUME_AUDIT_2026-10-13.md

# Stage 14–16 — Resume audit (13 October 2026)

## Verified in this resumed work session
- Opened original 540 PASS BACKUP_DRILL_PREP ZIP and inspected the actual `supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql`.
- Executed `node --test tests/*.test.cjs`: **540 PASS, 0 FAIL**. This is local Node verification, **not** live PostgreSQL RPC testing.
- SQL candidate contains five intended RPCs, replaces existing `mahjong_sync_peek()` and `mahjong_sync_valid_game(jsonb)`, and changes future `mahjong_game_states.is_current` default to false.
- First SQL statement intentionally raises `UNSAFE DRAFT`; **do not remove this guard or run the candidate as-is**.
- Candidate has a transaction ending with COMMIT. A rollback-only rehearsal must be separately constructed, audited and executed before permanent installation.
- Candidate writer open serializes per-account takeovers via `auth.users FOR UPDATE`, compares game ID/revision, and redacts cloud snapshot from local mismatch responses.
- Commit validates JWT Auth session, lease generation, token digest, writer ownership, and game revision. These are **code observations**, not verified live semantics.

## Supabase facts provided by user (do not re-request)
- Four sync tables exist, plus two added session columns (`auth_session_created_at`, `ever_writer`).
- 0 device sessions and 0 sync conflicts; token generator returns 64 lowercase hex characters.
- 8/8 installation-readiness checks PASS.
- Transaction and rollback-cleanup smoke checks PASS.
- Local backup `~/Documents/Mahjong_Supabase_Backup/mahjong_backup_2026-10-13.dump` (369560 bytes, mode 600) passed `pg_restore --list` and extraction to `/dev/null`. A full restore has NOT been proven.
- User wants same Supabase project, no staging project and no Mac PostgreSQL server. Data is not yet final; temporary test data acceptable. No permission for indiscriminate database deletion.

## Outstanding gate before live install
1. Construct and inspect rollback-only compilation rehearsal against existing Supabase; ensure it does not persist schema/function changes.
2. Validate PostgreSQL function compilation, signature and grants, including restored function definitions after rollback.
3. Test authenticated RPC behavior using isolated real Supabase Auth accounts/sessions and two devices; SQL Editor as postgres cannot by itself simulate trusted end-user JWTs.
4. Confirm client adapter end-to-end behavior and old-device write revocation; keep Cloud Sync OFF until completed.
5. Only then approve and execute an audited migration, with explicit rollback and backup handling.

## Release controls
Cloud Sync OFF. Five RPCs not installed as of latest user evidence. DO NOT DEPLOY. No new tests added in this resume; 540 PASS / 0 FAIL rerun.


---

### Source: STAGE14_16_RPC_INSTALL_READINESS_20261013.md

# Stage 14–16 — RPC install readiness / 2026-10-13

## Scope and verification
- Verified existing candidate migration still deliberately raises `UNSAFE DRAFT` before any DDL. **DO NOT execute as deployment.**
- Added `tests/stage14-16-rpc-install-readiness.test.cjs` with four local safety assertions: guard placement, five RPC security-definer/search-path declarations, post-lock Auth session expiry revalidation for open/commit, production cloud flag OFF.
- Full local `node --test tests/*.test.cjs`: **556 PASS, 0 FAIL** (log available separately at `/mnt/data/mahjong_556_verify.log`). These are local tests, not Supabase or device evidence.
- User-reported rollback-only Supabase results: 11/11 negative security, 6/6 writer lifecycle, 5/5 cross-session, 7/7 two-device same-Auth takeover = 29/29. Claims simulated in SQL Editor, not signed browser JWT.

## Release blockers
1. Do not install five RPCs permanently or remove migration guard without explicit staging approval and reviewed migration/rollback plan.
2. Real signed-JWT browser test across two Auth sessions and two physical devices pending.
3. Verify old device UI immediately becomes read-only, session transfer preserves game state and offline edits are safely reconciled.
4. Verify Auth sign-in semantics and Realtime before enabling cloud feature.
5. Cloud Sync flag remains OFF. No deployment.

## GitHub Desktop
Summary: `v15.7.15 - Add RPC installation safety regression gates`
Description: `Add four local RPC migration safety tests covering draft guard, definer search paths, post-lock Auth checks, and Cloud Sync OFF. Document signed-JWT staging blockers. 556 Node tests PASS, 0 FAIL. No deployment.`


---

### Source: STAGE14_16_RPC_INSTALL_REVIEW_2026-10-13.md

# Stage 14–16 — RPC installation review (2026-10-13)

## Evidence from actual Supabase SQL Editor (user-provided)
- Four foundation tables exist; only `mahjong_sync_peek` is installed.
- `mahjong_device_sessions` was initially missing `auth_session_created_at` and `ever_writer`; user ran additive ALTER TABLE successfully.
- Device session counts: total=0, active=0, writers=0. This does NOT prove there are no Supabase Auth sessions.
- `mahjong_sync_generate_token()` returned a 64-character lowercase hex token in one invocation. This validates output shape, not entropy.

## Candidate code audit
File: `supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql`.
- Deliberate top-level `RAISE EXCEPTION` guard remains. Do not remove for production.
- Candidate modifies existing `mahjong_sync_valid_game` and `mahjong_sync_peek` as well as adding five RPCs.
- It changes future default `mahjong_game_states.is_current` from true to false; existing rows are not rewritten.
- `open` uses auth.users FOR UPDATE to serialize writers, checks Auth session, game ID/revision before revoking prior lease, and rotates token.
- `commit` checks current Auth session, owner, device ID, generation, hashed token, writer flag, game ownership, and revision.
- SQL is not proven by execution on PostgreSQL; static inspection cannot establish PL/pgSQL correctness or concurrent behavior.

## Blocking issues before production installation
1. Obtain a restorable database backup/snapshot and document recovery procedure for the existing project.
2. Run guarded candidate in a disposable transaction / isolated test account with real PostgreSQL, validating create/commit/read/takeover and rollback on errors. Never run the intentionally guarded candidate as an installation script.
3. Verify Supabase Auth account/JWT session semantics, grants and SECURITY DEFINER owner, including malicious account attempts.
4. Test two devices, simultaneous writes, offline stale writer, multi-device permission change, and reader-only mode.
5. Confirm application-side client uses RPC signatures and persists game state correctly before enabling Cloud Sync.

## Deployment boundary
No SQL migration was executed as part of this ZIP creation. No RPC was installed. Cloud Sync stays OFF. DO NOT DEPLOY.

## Testing statement
The 526 PASS count is carried forward from the previous checkpoint; no additional PASS tests are claimed by this review.


---

### Source: STAGE14_16_RPC_STATIC_FINDINGS_2026-10-13.md

# Stage 14–16 — Static RPC audit findings (2026-10-13)

Scope: `supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql` (548 lines). This is a source inspection, not a PostgreSQL execution test.

## Actionable finding 1 — mismatch response includes cloud payload
In `mahjong_sync_open`, the `local-cloud-mismatch` branch returns `'game',v_game.game_data` after validating preflight game ID and revision but **before** issuing a writer/reader lease. The adjacent comment explicitly states a stale preflight must not receive a full current snapshot; the implementation contradicts that stated intention. The caller is authenticated as the game owner, so this is not proven cross-account exposure, but it bypasses the intended explicit reader-enrollment/reconciliation flow. Proposed fix: omit the `game` field from this rejection and require a separate authorized read/reconcile operation. Must regression-test clients that consume this field before changing behavior.

## Actionable finding 2 — archive restore not yet demonstrated
The user has verified a local PostgreSQL custom-format backup, `pg_restore --list` PASS, and `pg_restore --file=/dev/null` PASS. Neither validates restoration into a real database, roles, extensions, storage object contents, or service settings. Do not characterize as a tested disaster recovery path.

## Integration gates
- SQL draft begins with intentional `RAISE EXCEPTION`; leave guard intact.
- The draft replaces existing `mahjong_sync_peek` and `mahjong_sync_valid_game`, alters default `is_current`, and adds five RPCs. Installation is not limited to five new functions.
- No PostgreSQL runtime concurrency, privilege, or two-device test has been performed.
- Cloud Sync remains OFF; no deploy.

## Next safe batch
1. Make an isolated copy of SQL candidate and fix the mismatch-response contract, then add a static regression assertion.
2. Review all error branches for returned game data and compare against client handling.
3. Run isolated PostgreSQL transactional tests against dedicated test identities on existing project, after verifying restore strategy.


---

### Source: STAGE14_16_SECURITY_CONTRACT_2026-10-13.md

# Stage 14–16 security contract checkpoint — 2026-10-13

## Actual changes
- Added `tests/sync-stage14-install-security-contract.test.cjs` (12 new static contract assertions).
- Full local Node suite: **540 PASS / 0 FAIL**, log `tests/stage14_16_install_security_540.log`.
- Verified that five candidate RPCs declare `SECURITY DEFINER SET search_path = ''`, explicitly revoke PUBLIC/anon/authenticated and grant authenticated only.
- Verified candidate retains its intentional `UNSAFE DRAFT` exception guard.
- Verified `local-cloud-mismatch` response does not expose cloud game payload.

## Verified live environment evidence (user supplied)
- Four core tables exist; two additional device-session columns added.
- Eight installation-readiness checks returned true.
- Device session and conflict tables empty at inspection.
- PostgreSQL backup at user's Mac: archive list and content extraction PASS; file permissions 0600. Restore into a PostgreSQL instance **NOT TESTED**.

## Not verified / deployment gates
- No live RPC migration, no real PostgreSQL transaction concurrency tests, no two-device tests.
- Static tests are NOT proof of PostgreSQL semantics or secure function ownership.
- Confirm recovery plan and actual restore test before a risky live migration.
- Verify SQL owner privileges, Auth session revocation behavior, client wiring, and RLS before installing.
- Candidate SQL remains **DO NOT DEPLOY**; Cloud Sync remains OFF.

## GitHub Desktop
Summary: `v15.7.15 - Add RPC Installation Security Contracts`
Description: `Add twelve fail-closed SQL security contract tests; verify 540 PASS / 0 FAIL; document remaining live PostgreSQL gates; preserve SQL installation guard and Cloud Sync OFF; DO NOT DEPLOY.`


---

### Source: STAGE14_16_SIGNED_JWT_PREFLIGHT_20261013.md

# Stage 14–16 — Signed JWT browser preflight (2026-10-13)

## Changes
- Added `STAGE14_16_SIGNED_JWT_BROWSER_PREFLIGHT_20261013.js`, a read-only browser-console test that uses the **existing logged-in Mahjong Supabase client**.
- The browser test checks actual Supabase Auth session, verifies user via `auth.getUser()` (server round-trip), checks JWT payload consistency/expiry locally (NOT signature validation), and calls the existing `mahjong_sync_peek` via PostgREST with the real access token.
- No JWT, PIN, user ID, game payload, or token is printed. Only check names, PASS/FAIL, and safe details.
- Added three static safety tests covering read-only RPC scope and privacy.
- Node test command: `node --test tests/*.test.cjs` => **578 PASS, 0 FAIL**.
- Previous Supabase user results: 29/29 rollback-only RPC tests, 16/16 read-only schema checks.

## User action needed
1. Open the currently deployed Mahjong app in a browser, log in as the authorized test scorekeeper.
2. Open browser DevTools Console and paste the complete content of `STAGE14_16_SIGNED_JWT_BROWSER_PREFLIGHT_20261013.js`.
3. Share only the PASS/FAIL table; never share access token, PIN, or browser storage.
4. Expect `mahjong_sync_peek` to return `ok:false, reason:no-cloud-game` when there is no active cloud game: this is a PASS if the RPC returns a structured response without PostgREST error.

## Deployment boundary
- The preflight **does not** install the other five RPCs, create leases, mutate scores, or activate Cloud Sync.
- Local JWT payload decoding is **not** signature verification. The actual signed token is forwarded by the Supabase client and validated by PostgREST; `getUser` verifies the user via Supabase Auth.
- A successful preflight does not prove automatic two-device transfer, server session invalidation, or logout UX.
- **Cloud Sync OFF; DO NOT DEPLOY**.


---

### Source: STAGE14_16_SIGNED_JWT_SEMANTICS_20261013.md

# Stage 14–16 — Signed JWT diagnostic semantics

- Browser screenshot from 2026-10-13: 6/6 preflight checks PASS; `mahjong_sync_peek` returned `ok=false, reason=no-cloud-game`.
- This proves the signed session reaches an authenticated RPC and receives a valid contract; it does **not** mean a cloud game or writer lease exists.
- Corrected browser diagnostic distinguishes RPC contract, outcome classification, and cloud game availability. `no-cloud-game` is reported NOT READY for cloud-game availability, while auth verification remains PASS.
- Three regression tests added for accurate classification and read-only operation.
- Five transfer RPCs are not permanently installed; no live device transfer tested. No migration/deploy or cloud activation.
- Next blocker: security review and explicitly authorized permanent installation of the five RPCs, followed by actual two-device tests. Do not treat browser preflight as end-to-end transfer proof.


---

### Source: STAGE14_16_SNAPSHOT_REDACTION_2026-10-13.md

# Stage 14–16 — Snapshot redaction checkpoint (2026-10-13)

## Verified changes
- Removed `game: v_game.game_data` from the `local-cloud-mismatch` rejection returned by `mahjong_sync_open` in `supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql`.
- Retained reason, gameId, revision for client-side explicit reconciliation.
- Added `tests/stage14-mismatch-no-snapshot.test.cjs` with two regression checks: mismatch rejection does not embed the cloud game snapshot; installation fail-closed guard remains present.
- Actual local run: `node --test tests/*.test.cjs` => **528 PASS, 0 FAIL**, log `tests/stage14_16_snapshot_redaction_run.log`.

## Supabase evidence supplied by user
- Existing Supabase project `mahjong score`: 4 tables, existing peek RPC, other five RPCs not installed.
- `auth_session_created_at` and `ever_writer` columns added successfully; device_sessions has zero rows.
- Token format check: 64 hexadecimal characters (does not establish cryptographic strength).
- Local `pg_dump` backup created, TOC listing and archive extraction succeeded. Full database restore has **not** been tested.

## Remaining blockers
- This is a **static regression** only; no PostgreSQL integration or two-device test performed.
- SQL candidate retains `RAISE EXCEPTION 'UNSAFE DRAFT...'` and MUST NOT be installed as-is.
- Cloud Sync remains OFF; no production SQL deployed by this checkpoint.
- Audit all RPC responses and privileges, and verify transaction semantics on actual PostgreSQL before removing guard.


---

### Source: STAGE14_16_STRICT_AUTH_HANDOFF_20261013.md

# Tahap 14–16: Strict authenticated-role missing-JWT gate

- Bukti sebelumnya: 540 PASS lokal; kompilasi 5 RPC berhasil; rollback 5/5 fungsi absent; missing-JWT negative gate sebelumnya sukses.
- Temuan audit: negative gate lama menganggap respons `ok:false` sebagai penolakan autentikasi, sehingga terlalu longgar.
- Perbaikan: `supabase_sync_stage14_auth_strict_rollback_ONLY.sql` menuntut SQLSTATE 28000 pada kelima RPC, menggunakan `SET LOCAL ROLE authenticated` dengan JWT kosong, dan mengakhiri transaksi dengan ROLLBACK.
- Jalankan seluruh file sekali di Supabase SQL Editor. Harapkan Success; Notice PASS dapat diperiksa di Messages. Bila error, kirim error persis.
- Batas bukti: role yang disimulasikan di SQL Editor BUKAN signed JWT asli. Pengujian JWT nyata, role admin/scorekeeper, dua perangkat dan konflik masih tertunda.
- Perubahan aplikasi produksi: nihil. Cloud Sync OFF, DO NOT DEPLOY.

GitHub Desktop Summary: `v15.7.15 - Harden strict RPC authentication rollback gate`
Description: `Add strict SQLSTATE 28000 checks for all five RPCs under authenticated DB role without JWT. Preserve ROLLBACK and Cloud Sync OFF. No production deployment.`


---

### Source: STAGE14_ACCESS_EVIDENCE_REVIEW_CHECKPOINT_20261013.md

# Stage 14 — Evidence review continuation, 13 October 2026

Baseline restored from user-uploaded 444 PASS ZIP; baseline re-run 444 PASS / 0 FAIL.
Added conservative, offline JSON review utility `tools/stage14-review-access.cjs` for output rows of first result set from `supabase_sync_stage14_access_preflight_readonly.sql`. It refuses missing/duplicate evidence, absent tables, disabled RLS, unknown or granted direct INSERT/UPDATE/DELETE for anon/authenticated. Eight isolated tests added. Full suite: 452 PASS / 0 FAIL.

IMPORTANT: A passing reviewer means ONLY that table-level evidence is restrictive; it does not validate policies, SECURITY DEFINER behavior, RPC grants, index integrity, Auth session semantics, concurrency or two-device runtime. Do not paste real game data; preflight returns metadata only. SQL preflight is read-only. No database was contacted. No SQL deployed; cloud sync remains OFF. Candidate remains DO NOT DEPLOY.

Next required user action: execute `supabase_sync_stage14_access_preflight_readonly.sql` in Supabase SQL Editor (read-only) and return BOTH result sets, or export results as JSON. Review policies/indexes/RPC privileges and reconcile actual definitions before staging-only migration and real-device tests.


---

### Source: STAGE14_ACCESS_PREFLIGHT_CHECKPOINT.md

# Stage 14 — access-boundary preflight (read only)

Added `supabase_sync_stage14_access_preflight_readonly.sql` to inspect actual table DML grants, RLS policies, indexes (including current-game uniqueness), and RPC execution grants. It does **not** query user/game rows or modify Supabase.

Why: `RLS enabled=true` by itself does not establish that direct API writes are impossible. Any permissive RLS policies or direct grants must be reviewed before enabling SECURITY DEFINER writer RPCs. No production conclusion is claimed from static contract tests.

Pending: run the read-only preflight and inspect output, verify SQL candidate against real PostgreSQL with two-device concurrency, test offline and realtime revocation, verify exact UI recovery, then approve a separate deployment migration. Cloud sync and SQL candidate remain blocked.


---

### Source: STAGE14_AUTOMATIC_TRANSFER_CANDIDATE.md

# Stage 14 — Automatic Session Transfer candidate (local only)

Baseline: v15.7.15 Stage14 415 PASS checkpoint. This work adds an **alternative** SQL candidate; the Stage13 device-binding SQL is retained unchanged as historical reference.

## Change
- Remove the permanent cross-device writer lock from `mahjong_sync_open` in the candidate.
- Remove historical `ever_writer` blocking from `mahjong_sync_commit` in the candidate.
- Keep newer-auth-session rejection and persistent login high-water guard, account row serialization, cloud game/revision preflight, local/cloud mismatch rejection, atomic writer-token revocation, auth-session binding, generation and revision checks.
- Keep fail-closed `DO $$ RAISE EXCEPTION ... $$` guard. **Do not run this SQL.**

## Known blockers
1. No live PostgreSQL execution, concurrency proof, two-device integration or RLS/grant audit; SQL candidate is **not deployable**.
2. New device must first obtain the exact cloud game ID and revision via `mahjong_sync_peek`, then open with `p_local_game=NULL`; existing local game mismatch must be reconciled, not silently overwritten.
3. Auth-session high-water mark is per historical device row; assess new sessions with no prior device row, same-device session reuse, and session revocation lifecycle in integration tests.
4. `is_current` default differs between production and draft; schema alignment must be explicitly reviewed.
5. Existing Stage13 regression tests intentionally test permanent binding and therefore remain attached to the original draft. New Stage14 tests verify candidate source contracts only, not server runtime behavior.
6. Cloud sync flag remains OFF; do not deploy to GitHub Pages or production Supabase.

## Next gate
A dedicated PostgreSQL staging environment with test users and two devices; validate takeover, revoked writer, offline stale writes, concurrent open/commit, admin and multi-device permissions, and current-game resume before production enablement.


---

### Source: STAGE14_COLUMN_EVIDENCE_GATE_20261013.md

# Stage 14 — Column Evidence Gate (13 October 2026)

Continued from uploaded 452 PASS checkpoint. Added independent offline metadata reviewer `tools/stage14-review-columns.cjs` for the **second result set** of `supabase_sync_stage14_access_preflight_readonly.sql`. Seven isolated tests check complete evidence, missing/duplicate rows, absent columns, unknown installed flags and missing data types. `node --test tests/*.test.cjs`: **459 PASS / 0 FAIL**.

Usage: export the second SQL result set as a JSON array and run `node tools/stage14-review-columns.cjs columns.json`. First result set remains reviewed with `node tools/stage14-review-access.cjs access.json`. No production database access or migration was performed. Passing both tools is **not** authorization to deploy: actual types/defaults, policies, indexes, RPC implementations/grants, Auth session behavior and two-device tests are still outstanding. Cloud Sync remains OFF. DO NOT DEPLOY.

Next action: user provides BOTH read-only Supabase SQL result sets; reconcile observed metadata and candidate SQL before any staging-only execution.


---

### Source: STAGE14_COLUMN_PREFLIGHT_CHECKPOINT.md

# Stage 14 — Column visibility checkpoint (434 PASS)

2026-10-12. Added a second read-only SQL result set to `supabase_sync_stage14_access_preflight_readonly.sql` which explicitly reports whether each of eight sync/transfer columns exists, including `auth_session_created_at`, `ever_writer`, and the current default of `mahjong_game_states.is_current`. Missing columns remain visible via LEFT JOIN. No database writes or app behavior changes. Three new local contract tests; `node --test tests/*.test.cjs`: 434 PASS, 0 FAIL. Actual Supabase preflight execution and two-device integration remain outstanding. Cloud sync OFF; guarded candidate SQL remains non-deployable.


---

### Source: STAGE14_COLUMN_TYPE_GATE_20261013.md

# Stage 14 — Candidate Column Type Gate

Continued from 459 PASS. Added independent fail-closed reviewer `tools/stage14-review-column-types.cjs` comparing second read-only Supabase SQL result set against candidate PostgreSQL column type assumptions. Added six isolated regression tests. `node --test tests/*.test.cjs`: 465 PASS / 0 FAIL.

**Important:** Expected types are candidate assumptions, not verified live Supabase schema. A mismatch means investigate and reconcile, NOT automatically ALTER production. Run `node tools/stage14-review-column-types.cjs columns.json` after exporting second read-only result set. Column defaults, constraints, policies, RPC privileges and actual two-device transfer still require evidence. No SQL applied; Cloud Sync OFF; DO NOT DEPLOY.


---

### Source: STAGE14_CONSOLIDATED_SECURITY_HANDOFF.md

# Stage 14 — Consolidated Security Handoff (DO NOT DEPLOY)

## Evidence and scope
- Latest user-supplied production metadata (2026-10-12): `mahjong_device_sessions`, `mahjong_game_states`, `mahjong_session_audit`, `mahjong_sync_conflicts` exist with RLS enabled. `mahjong_sync_peek` exists; open/commit/open_reader/read/lease_status were not installed at the time of inspection.
- Production `mahjong_device_sessions` metadata did **not** list `auth_session_created_at` or `ever_writer`; candidate migration adds both.
- Production `mahjong_game_states.is_current` has DEFAULT true; candidate aligns the default to false for future implicit inserts. Existing rows are not rewritten.
- Production RLS enabled does **not** prove direct table grants or RLS policies safe. User has not returned access-preflight results.
- `supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql` is an **unexecutable candidate**, intentionally guarded by an unconditional exception before BEGIN.
- `MAHJONG_CLOUD_SYNC_ENABLED=false` in index.html. Do not change this until real two-device integration succeeds.

## Security invariants reviewed locally
1. A writer takeover compares current cloud game ID and revision **before** revoking the previous writer.
2. A successful takeover rotates the writer token, binds its Auth session, and invalidates the previous writer's token.
3. Commits require matching game ID, owner, current writer session, device ID, Auth session, token hash, generation, and revision.
4. A revoked writer cannot persist its rejected game payload to the conflict ledger; only a valid writer's stale-revision attempt may do so.
5. Reader enrollment must not downgrade a current writer and reader permissions are checked again on reads.
6. Older scorekeeper Auth sessions are rejected when a newer login owns the account; admins and explicitly multi-device scorekeepers have different policies.

These are **static code-contract checks**, not proof of transaction isolation or authorization on PostgreSQL.

## Release blockers — must be resolved as a single integration batch
- Verify real production schema indexes, grants, policies, and helper function permissions, including that authenticated users cannot directly INSERT/UPDATE/DELETE session/game/conflict tables.
- Reconcile existing deployed `mahjong_sync_peek` and `mahjong_sync_valid_game` definitions with the candidate in a **staging** database.
- Validate auth.sessions and JWT session binding in staging with the actual Supabase Postgres version and Auth behavior.
- Execute concurrent two-device scenarios: old device commit after takeover, stale revision, new-device read/adoption, lost network, reconnect, same-device relogin, multi-device toggled OFF, admin multi-device, reader enrollment, revocation and unlock.
- Verify that cloud snapshot contains all score/players/round/dealer/winds/Quad/history/live-sharing semantics, and that no local active game is overwritten without reconciliation.
- Verify rollback strategy, backup, and UI revocation/logout on iPhone Safari and Android.

## Deployment boundary
No SQL was run against Supabase. No production data was changed. This ZIP is a review checkpoint only. DO NOT DEPLOY.


---

### Source: STAGE14_DEFAULT_NULLABILITY_GATE_20261013.md

# Stage 14 — Default and nullability evidence gate (473 PASS)

Resumed from 465 PASS. Added read-only metadata SQL `supabase_sync_stage14_defaults_preflight_readonly.sql`, fail-closed reviewer `tools/stage14-review-defaults.cjs`, and eight isolated regression tests. `node --test tests/*.test.cjs`: 473 PASS / 0 FAIL.

Expected defaults (`is_current=false`, `ever_writer=false`) are **candidate assumptions**, not verified live database values. The existing `is_current=true` default previously observed on Supabase remains a known discrepancy until read-only evidence confirms correction; do not modify production to satisfy a test. Reviewer only accepts explicit evidence and does not perform DDL. Export query results to JSON and run `node tools/stage14-review-defaults.cjs evidence.json`. This gate does not establish RLS, RPC permissions, indexes, transaction safety or two-device transfer. Cloud Sync OFF. DO NOT DEPLOY.


---

### Source: STAGE14_EVIDENCE_BUNDLE_20261013.md

# Stage 14 — Consolidated offline evidence gate (479 PASS)

Continued from 473 PASS. Added `tools/stage14-review-evidence-bundle.cjs` to aggregate four independent read-only evidence reviewers (access, columns, types, defaults) without silently accepting missing sections. Added six isolated regression tests. `node --test tests/*.test.cjs`: 479 PASS / 0 FAIL.

## Usage
Export the Supabase **read-only** SQL results to JSON files following the individual reviewers' required schemas. Combine them into one JSON object with `access`, `columns`, `types`, `defaults` properties; run `node tools/stage14-review-evidence-bundle.cjs bundle.json`. No live evidence has been provided or checked in this checkpoint. A passing metadata bundle is NOT proof of policy semantics, RPC execution safety, PostgreSQL transactions, or two-device transfer. Known `is_current` default mismatch remains unresolved. No SQL deployed, no production changes, Cloud Sync OFF. DO NOT DEPLOY.


---

### Source: STAGE14_EXISTING_DEFAULT_ALIGNMENT.md

# Stage 14 — Existing default alignment (427 PASS)

Date: 2026-10-12. Source: Stage14 424 PASS checkpoint.

## Verified defect and local correction

Supabase metadata supplied by the user shows `public.mahjong_game_states.is_current` already exists with DEFAULT true. The candidate previously used `ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false`; PostgreSQL does **not** change an existing column default when `IF NOT EXISTS` skips creation. This left the actual default true, contrary to the candidate's documented fail-closed intention.

The candidate now explicitly executes `ALTER TABLE public.mahjong_game_states ALTER COLUMN is_current SET DEFAULT false;` following the idempotent column addition. It does **not** update existing game rows. The intended writer RPC still explicitly inserts `is_current=true` after its checks. Three new contract tests verify this behavior and the draft's blocking guard.

## Safety and remaining blockers

- **DO NOT DEPLOY**. Candidate SQL deliberately raises an exception before DDL; no SQL was executed on Supabase.
- Cloud synchronization stays disabled. No active game, score, player or history was changed.
- 427 local Node tests PASS / 0 FAIL. These are not live PostgreSQL concurrency or two-device integration tests.
- Still required: verify indexes, grants/RLS, auth session transfer, token revocation, concurrency and end-to-end device recovery in an isolated Supabase test environment.


---

### Source: STAGE14_EXISTING_PROJECT_BATCH_DECISION_20261013.md

# Stage 14 — Existing Supabase Project, Consolidated Integration Decision (2026-10-13)

## Confirmed actual Supabase evidence supplied by user
- Existing project `mahjong score` only; do NOT create staging project.
- Four tables have RLS enabled and no direct anon/authenticated table privileges; no pg_policies rows in supplied inventory.
- Unique partial indexes: `mahjong_one_writer_per_user` and `mahjong_one_current_game_per_owner` (candidate comment naming another index is stale).
- Device sessions lack `auth_session_created_at` and `ever_writer`; `auth_session_id` exists.
- `mahjong_game_states.is_current` default is TRUE; candidate changes future default to FALSE, without rewriting rows.
- Existing public functions: account_permissions, generate_token, is_admin, peek, valid_game; other five RPCs absent.
- `pgcrypto` 1.3 and `digest(bytea,text)` / `digest(text,text)` are installed in `extensions`.
- Auth sessions include id/user_id/created_at/not_after; no revoked_at.

## Critical unresolved issues before any write SQL
1. Existing `mahjong_sync_is_admin()` does not check banned_until, unlike account_permissions(). Align authorization before allowing elevated operations.
2. Existing `mahjong_sync_peek()` uses auth.sessions ordering; review its session invalidation and older-login policy with actual transaction behavior.
3. Candidate begins with an unconditional RAISE EXCEPTION guard. Do not remove guard merely to make SQL executable.
4. Candidate `CREATE OR REPLACE` modifies deployed `mahjong_sync_peek()` and `mahjong_sync_valid_game()`; this is a production behavior change, not just adding five RPCs. Require verified rollback definitions and change review.
5. Existing project must be tested without affecting live scorekeepers, games or sessions: use a dedicated test account and game with explicit user authorization, backup, transaction plan and clear rollback; avoid any live-account takeover.
6. Real concurrency, browser two-device and post-logout tests are unverified. No claims of safe deployment.

## Next consolidated gate
Review actual five RPC bodies against observed metadata, produce a non-executable migration and rollback plan, and only then request explicit approval for changes to existing Supabase project. Keep cloud sync OFF. No SQL deployed by this review.


---

### Source: STAGE14_HISTORY_VALIDATOR_HARDENING.md

# Stage 14 — History validator hardening

- Fixed a SQL three-valued-logic edge case in the candidate validator: missing/null `history` could fall through the combined type/length predicate because `false OR NULL` is NULL.
- Split the type rejection and length check into separate `WHEN` clauses.
- Added three static contract tests.
- Confirmed prior suspected duplicate Auth session assignment was a display overlap, not a source defect; no unnecessary change made.
- Production Supabase untouched; cloud sync disabled; candidate SQL intentionally fails closed.
- PostgreSQL execution, RLS permission checks, concurrency and real two-device tests remain blockers.


---

### Source: STAGE14_PREFLIGHT_MISSING_TABLE_VISIBILITY.md

# Stage 14 — Preflight missing-table visibility (431 PASS)

## Actual change
- Read-only SQL `supabase_sync_stage14_access_preflight_readonly.sql` now emits an explicit `TABLE_PRESENCE` row for each of the four required foundation tables, even when the table does not exist. Previously the query silently omitted absent tables, which could be mistaken for a complete inspection.
- Added a regression contract test for the missing-table reporting path.
- Full local Node suite: 431 PASS, 0 FAIL (`node --test tests/*.test.cjs`).

## Boundaries
- No production Supabase changes, no live game modifications.
- The preflight has not been run against Supabase in this checkpoint.
- SQL transfer candidate is NOT production approved; cloud sync remains disabled.
- Still requires review of real preflight output, PostgreSQL two-device concurrency and offline/realtime integration tests.


---

### Source: STAGE14_REVOKED_WRITER_STORAGE_GUARD.md

# Stage 14 — Revoked writer storage guard (2026-10-12)

Baseline: 434 PASS / 0 FAIL. Current: 440 PASS / 0 FAIL.

## Implemented (local SQL candidate only)
- In `supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql`, reject revoked or displaced writer commits without inserting the submitted game payload into `mahjong_sync_conflicts`.
- Preserve conflict logging for a valid current writer with an out-of-date base revision (`revision-conflict`).
- Preserve server-side auth session, token hash, generation, game ownership, and writer lease checks.
- Added six focused regression contract tests in `tests/stage14-revoked-writer-storage-guard.test.cjs`.
- Full Node test suite: 440 PASS / 0 FAIL. Verified 434 PASS on source ZIP before changes.

## Security rationale
Before this change, every rejected `writer-revoked` commit could append up to a 2 MB proposed game payload to the conflict table. A displaced device should not have the ability to fill the conflict ledger through repeated rejected writes. The canonical game was already protected; this change also protects conflict storage. SQL contract tests are not substitutes for PostgreSQL concurrency tests.

## Remaining release blockers
- Candidate SQL deliberately starts with an exception; do not execute on production.
- Production schema requires verification/migration for `auth_session_created_at`, `ever_writer`, default `is_current`, grants, indexes, and RLS.
- No real Supabase two-device takeover, stale writer, offline reconnect, realtime logout, or full game resume tests have been completed.
- Cloud sync stays OFF in index.html. Do not deploy or enable it.

## GitHub Desktop
Summary: `v15.7.15 - Stage 14 Revoked Writer Storage Guard`
Description:
- Prevent revoked writer attempts from filling the conflict ledger
- Keep conflict records for valid writers with stale revisions
- Add six focused SQL contract tests
- Verify full regression: 440 PASS / 0 FAIL
- Keep cloud sync disabled and SQL fail-closed
- No production changes; DO NOT DEPLOY


---

### Source: STAGE14_RPC_EXPOSURE_GATE_20261013.md

# Stage 14 — RPC exposure offline evidence gate (487 PASS)

Added `tools/stage14-review-rpc-exposure.cjs` and eight isolated regression tests. This gate requires explicit evidence of five proposed RPCs, rejects duplicate/missing records, anonymous or PUBLIC EXECUTE grants, absent authenticated grants, unsafe search paths, and unconfirmed SECURITY DEFINER. Input is a manually assembled JSON array of metadata records; the checker does NOT query Supabase and no live RPC evidence was supplied. A successful result is NOT proof that the function body correctly enforces authentication, device revocation, lease ownership, concurrency, or transaction safety. PostgreSQL integration and two-device testing remain mandatory. Cloud Sync OFF, no SQL deployed, DO NOT DEPLOY.


---

### Source: STAGE14_SUPABASE_METADATA_ALIGNMENT_2026-10-12.md

# Tahap 14 — audit kesesuaian metadata Supabase (12 Oktober 2026)

Status: **AUDIT LOKAL / DO NOT DEPLOY**. Sumber: metadata read-only yang diberikan pengguna di percakapan. Tidak ada SQL yang dijalankan pada Supabase dalam paket ini.

## Terverifikasi dari metadata aktual
- Ada tabel `mahjong_device_sessions`, `mahjong_game_states`, `mahjong_session_audit`, `mahjong_sync_conflicts`; semuanya RLS enabled.
- `mahjong_device_sessions` **belum** memiliki `auth_session_created_at` dan `ever_writer`; draft SQL menggunakan keduanya.
- `mahjong_game_states.is_current` **sudah ada**, default `true`. Perintah `ADD COLUMN IF NOT EXISTS ... DEFAULT false` dalam draft **tidak mengubah** default existing. Jangan berasumsi perubahan terjadi.
- Fungsi pendukung `mahjong_sync_peek`, `mahjong_sync_valid_game`, `mahjong_sync_account_permissions`, `mahjong_sync_generate_token`, `mahjong_sync_is_admin` ada. Lima RPC open/commit/open_reader/read/lease_status belum terpasang berdasarkan hasil query sebelumnya.
- Tidak terlihat kebijakan RLS untuk empat tabel sync dalam hasil yang dibagikan. Ini **tidak membuktikan** semua akses ditutup: audit GRANT, owner, view, fungsi SECURITY DEFINER dan default privilege tetap diperlukan.

## BLOCKER KRITIS: desain tidak sesuai kebutuhan pengguna
Pengguna meminta **automatic session transfer** ketika Scorekeeper login dari perangkat baru. Draft `mahjong_sync_open` saat ini justru mengembalikan `device-locked` atau `device-bound-to-other-device` untuk Scorekeeper single-device, termasuk ketika login baru sah. Jadi desain saat ini adalah **permanent device binding**, bukan automatic transfer. Jangan aktifkan atau klaim Tahap 14 selesai sebelum kontradiksi ini diperbaiki dan diuji pada dua perangkat.

## Konsekuensi teknis
1. Penyelarasan schema harus non-destruktif, termasuk migrasi historis `ever_writer` yang tidak boleh mengunci user secara salah.
2. Transfer perlu satu transaksi serialisasi pemilik akun: verifikasi sesi Supabase terbaru, cek revisi cloud, cabut lease/token lama, beri lease baru, dan cegah commit dari sesi lama; rollback seluruh transaksi bila preflight gagal.
3. Hindari kehilangan permainan lokal ketika cloud berbeda: tampilkan konflik dan jangan otomatis overwrite.
4. Audit langsung hak SELECT/INSERT/UPDATE/DELETE pada tabel dan izin EXECUTE fungsi; RLS enabled saja tidak cukup.
5. Uji Postgres nyata, Auth sessions, Realtime, offline reconnect, iPhone Safari, Android, serta dua perangkat sebelum deploy.

## Batasan paket
Dokumen dan test kontrak ditambahkan; tidak ada perubahan perilaku aplikasi, migrasi produksi, atau pengaktifan cloud. Draft SQL tetap sengaja fail-closed.


---

### Source: STAGE16_FINAL_SECURITY_AUDIT_AND_TEST_GATE_20261013.md

# Stage 16 — Final offline security review and testing gate (2026-10-13)

## Scope completed in this checkpoint
- Reviewed five RPC definitions (open, commit, open_reader, read, lease_status), security-definer search_path and grants, token issuance/hash checks, auth-session binding, takeover revocation, revision guards, and writer/reader paths.
- Verified existing draft is intentionally fail-closed: initial DO block raises UNSAFE DRAFT; it is **not an installation script**.
- Confirmed schema prerequisites documented by prior live read-only checks: auth_session_created_at and ever_writer absent; is_current existing default true requires alignment.
- Re-ran entire local Node suite on uploaded archive: 581 PASS / 0 FAIL (tests/stage16_final_local_run.log).
- Prepared deployment/rollback decision gate below; no remote changes performed.

## Critical unresolved gates before any installation
1. Verify actual definition and entropy of public.mahjong_sync_generate_token() and ensure helper permissions are least-privilege.
2. Verify public.mahjong_sync_is_admin() respects account bans and revocation; verify auth-session checks under real signed JWTs.
3. Independently inspect live table structure, indexes, RLS, grants, existing rows and backups before migration.
4. Produce separate reviewed migration, with transaction and tested rollback strategy. **Do not strip fail-closed guard from the candidate** as a shortcut.
5. Run isolated real Supabase two-device session takeover and stale-session/stale-revision/concurrency tests before Cloud Sync ON.

## Safe installation / rollback plan (NOT EXECUTED)
A. Capture schema snapshot, grants and row counts, confirm dedicated test identities and disposable data.
B. Review candidate with exact live schema; produce an explicit migration and independent reverse migration.
C. Test on disposable database/project first; execute negative cases and transaction rollback.
D. Request explicit user approval before applying to live project; keep Cloud Sync OFF throughout.
E. After successful live verification, separately approve client activation and two-device end-to-end testing.

## Test status
Local automated tests: 581 PASS, 0 FAIL. Historical PostgreSQL 45/45 and Safari 6/6 are previous checkpoint evidence, **not rerun** here. No PostgreSQL connection or actual two-device browser test was performed in this run.

## GitHub Desktop
Summary: `v15.7.15 - Stage 16 final security gate and local regression`
Description: `Document five-RPC security review, migration/rollback blockers, and rerun 581 local tests. No production SQL, cloud activation or deployment.`

**DO NOT DEPLOY. Cloud Sync OFF.**


---

### Source: STAGE17_FINAL_RPC_AUDIT_2026-10-13.md

# Stage 17 — Audit instalasi lima RPC (13 Oktober 2026)

Status: DO NOT DEPLOY; Cloud Sync OFF. Tidak ada SQL yang dijalankan pada Supabase selama tahap ini.

## Sumber
ZIP unggahan: Mahjong_Score_4P_PWA_v15.7.15_581_STAGE16_FINAL_SECURITY_GATE_PASS_DO_NOT_DEPLOY(1).zip.
Kandidat: supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql.

## Pemeriksaan aktual
- Node: `node --test tests/*.test.cjs` = 581 PASS, 0 FAIL (log: tests/STAGE17_NODE_TEST_RUN.log).
- Kandidat berisi lima fungsi transfer: mahjong_sync_open, mahjong_sync_commit, mahjong_sync_open_reader, mahjong_sync_read, mahjong_sync_lease_status.
- Kandidat dimulai dengan `DO $$ BEGIN RAISE EXCEPTION 'UNSAFE DRAFT...'`; tidak dapat dieksekusi langsung.
- Kandidat memodifikasi objek eksisting, bukan hanya menambah lima RPC: ALTER TABLE mahjong_device_sessions, ALTER TABLE mahjong_game_states termasuk mengubah DEFAULT is_current menjadi false, CREATE OR REPLACE mahjong_sync_valid_game dan mahjong_sync_peek, perubahan GRANT/REVOKE.
- Kondisi live yang dilaporkan pengguna: kolom auth_session_id, auth_session_created_at, ever_writer sudah ada; is_current DEFAULT true; empat tabel cloud kosong; lima RPC belum terpasang.
- Backup lokal `mahjong_backup_2026-10-13.dump` terbaca melalui pg_restore --list; empat tabel, TABLE DATA, PK/FK, RLS dan fungsi pendukung tercatat. Restore penuh belum diuji.

## Risiko/gate
1. Jangan melepas fail-closed guard dan memasang draft mentah: ALTER DEFAULT is_current dapat mengubah perilaku aplikasi lain; perubahan fungsi eksisting perlu diff semantik dan audit grant.
2. SQL instalasi minimal harus mempertahankan skema/default dan fungsi existing kecuali perubahan terbukti diperlukan, serta memeriksa fingerprint/definisi target sebelum perubahan.
3. Rollback harus menghapus hanya lima fungsi yang benar-benar baru dan mengembalikan definisi objek existing yang sengaja diganti; backup bukan bukti restore.
4. Wajib pengujian SQL pada transaksi rollback, kemudian uji dua perangkat dengan sesi Auth nyata, takeover, stale writer, revisi, offline recovery sebelum Cloud Sync ON.
5. Tidak ada klaim PASS PostgreSQL live baru dalam tahap ini.

## GitHub Desktop (jika nanti di-commit)
Summary: `v15.7.15 - Document Stage 17 RPC installation safety audit`
Description: `Re-run 581 Node tests and document unsafe draft schema/default changes, backup verification scope, and prerequisites for a minimal five-RPC install and rollback. No Supabase changes or cloud sync activation.`


---

### Source: STAGE17_HISTORY_VALIDATOR_IMPLEMENTATION_20261013.md

# Stage 17 — Isolated history validator prototype

Status: PROTOTYPE ONLY / DO NOT DEPLOY.

File: `STAGE17_HISTORY_VALIDATOR_ISOLATED_ROLLBACK_ONLY.sql`. It creates only pg_temp helper functions inside a transaction, runs 12 positive/negative vectors, then ROLLBACK. It does NOT modify the live validator, install five RPCs, or modify game data. Do not run in production until SQL has been independently reviewed.

Scope: known optional history fields from `js/sync-engine.js`; unknown legacy fields and empty objects accepted. Unicode length via PostgreSQL char_length. Test results from Supabase have NOT been received, so PostgreSQL PASS is NOT claimed.

Important limitations: helper is not yet wired to `mahjong_sync_commit` or `mahjong_sync_open`; existing `public.mahjong_sync_valid_game` remains unchanged. Existing app JS `quads` score-vector check accepts negative safe integers before its separate 0..4 bound check; SQL prototype rejects negatives. PostgreSQL jsonb numeric formatting and Unicode normalization require live differential tests. Backup restore drill and real-auth two-device tests pending.

GitHub Desktop Summary: `v15.7.15 - Prototype isolated history validation tests`
GitHub Desktop Description: `Add rollback-only pg_temp SQL validator and 12 test vectors; document compatibility, risks and deployment blockers. No production SQL changes; Cloud Sync OFF.`


---

### Source: STAGE17_HISTORY_VALIDATOR_PLAN_20261013.md

# Stage 17 — History validator compatibility audit (13 October 2026)

Status: DESIGN ONLY — DO NOT DEPLOY. Cloud Sync OFF.

## Verified from actual js/sync-engine.js
History entries may be empty objects or contain unknown legacy keys. Known optional keys are checked if present:
- delta, before: arrays of exactly four safe integers, absolute value <= 999999999999.
- quads: arrays of exactly four integers, each 0..4.
- seatWindsBefore: four distinct integers 0..3.
- winner, dealer, discarder: null or integer 0..3.
- playerPatterns: array of four nulls or objects with name string <=100 Unicode code points, points safe integer <=999999999999.
- roundWind: integer 0..3.
- method: string; patterns: array of strings; namesAtTime: four strings <=100 Unicode code points.
- Unknown keys must be preserved. Empty object is intentionally permitted for legacy compatibility.

## Confirmed live server gap
public.mahjong_sync_valid_game(jsonb) validates history only as an array of objects. A payload with history:[{}] returned true; this is compatible with client, NOT in itself a vulnerability.

## Proposed safe design (not implemented)
Implement a separate immutable, SECURITY INVOKER helper for optional known history keys, with qualified built-in references/search_path empty. Do not replace the live validator until complete test vectors and rollback have been checked. Align Unicode code point counts with JS Array.from, not SQL length() blindly. PostgreSQL JSONB number/string semantics and safe-integer range must match JS. Include explicit JSON null vs missing key behavior. Enforce a bounded total payload size and preserve all unknown fields. Any server-side enforcement must be in RPC commit/open server trust boundary.

## Required tests before installation
Valid: empty history object; legacy unknown fields; full real game snapshot with Unicode; nullable winner; 4 quads; all known optional fields. Invalid: wrong delta/before/quads lengths; float/string/null score values; out-of-range values; repeated seat winds; malformed patterns/playerPatterns; Unicode overflow; oversized payload. Confirm no changes to existing games and that rollbacks restore exact definitions and grants. Then isolated PostgreSQL tests and real-auth two-device tests.

## Deployment boundary
No SQL installed, no Supabase mutations, no GitHub deploy. Historical 581 PASS refers to prior checkpoint, not this document.

## GitHub Desktop
Summary: `v15.7.15 - Document Stage 17 history validator compatibility gate`
Description: `Audit client history validation against live PostgreSQL validator; document optional-field compatibility and required security tests. Cloud Sync remains OFF; DO NOT DEPLOY.`


---

### Source: STAGE17_STEP24_RPC_INTEGRATION_AUDIT_20261013.md

# Stage 17 — Step 24: RPC integration security audit (2026-10-13)

Status: LOCAL AUDIT ONLY. Supabase Stage 17 history validator: user reported 12/12 PASS after manual `ltrim` syntax correction. No SQL installation.

## Confirmed source review
- `supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql` defines `mahjong_sync_commit` with auth session checks, account row lock, session high-water check, current game row lock, writer lease generation/token hash checks, and optimistic base revision check.
- `mahjong_sync_commit` calls `public.mahjong_sync_valid_game(p_game)` only. It DOES NOT call `pg_temp.mahjong_history_known_fields_valid` or an equivalent persistent helper. Therefore 12/12 isolated tests DO NOT protect actual cloud commits.
- Candidate is blocked and five transfer RPCs are not installed, per earlier live Supabase inspection. No end-to-end writer/device guarantee is established.
- `STAGE17_HISTORY_VALIDATOR_ISOLATED_ROLLBACK_ONLY.sql` fixed `pg_catalog.trim(leading...)` to `pg_catalog.ltrim(v::text, '-')` for future reproducible tests.

## Security issues to resolve before installation
1. Promote tested helper only after explicit approval and design review; integrate history checks into both open (local seed) and commit, not commit alone.
2. Do not call `pg_temp` helpers from production SECURITY DEFINER RPCs. Use schema-qualified permanent helper with restricted EXECUTE and locked search_path.
3. Test malformed JSON, numeric bounds, Unicode, unknown legacy metadata and old snapshots; 12 vectors are not comprehensive.
4. Test real authenticated two-device takeover, revoked writer, reader restrictions, simultaneous commits and revision conflict storage limits.
5. Verify full database restore drill. Backup catalog listing alone is not restore validation.

## GitHub Desktop
Summary: `v15.7.15 - Audit Stage17 RPC history validation integration`
Description: `Fix isolated SQL ltrim syntax; document gap between 12 passing pg_temp vectors and uninstalled open/commit RPCs. No Supabase installation or deployment; Cloud Sync OFF.`


---

### Source: STAGE17_STEP25_CORRECTED_HISTORY_INTEGRATION_AUDIT_20261013.md

# Stage 17 — Step 25: Corrected source audit (2026-10-13)

Status: LOCAL STATIC AUDIT ONLY. DO NOT DEPLOY.

## Correction to Step 24
The previous statement that the Stage14 `mahjong_sync_commit` candidate only performs structural history checks was incomplete. Inspection of `supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql` confirms that its **own definition** of `public.mahjong_sync_valid_game` already validates many known history fields (`delta`, `before`, `quads`, `winner`, `dealer`, `discarder`, `roundWind`, `method`, `playerPatterns`, `patterns`, `seatWindsBefore`, `namesAtTime`). Both `mahjong_sync_open` and `mahjong_sync_commit` call `public.mahjong_sync_valid_game`.

The LIVE database function inspected via SQL Editor is weaker and accepts `history:[{}]`. The new isolated `pg_temp` helper passed 12/12 user-run cases, but it is NOT integrated or installed. There is therefore a **version/parity discrepancy** between draft and live validator, not a total absence of draft history validation.

## Confirmed blockers
- The Stage14 candidate starts with an unconditional `RAISE EXCEPTION` guard and must not be deployed.
- Candidate uses a separate, large inline validator, not the tested pg_temp helper. Passing isolated helper tests does NOT prove the candidate validator passes them.
- Candidate validator includes `trim(leading ...)` expressions; avoid assuming the fixed pg_temp helper also fixes the candidate.
- Five RPCs not installed according to previous live inventory; two-device and concurrent writer tests not performed.
- No production SQL changes made.

## Next gate
Create isolated read-only comparison vectors that execute both validator bodies inside a rollback transaction, without replacing public functions. Validate differences before choosing one implementation. Audit all five RPCs before installation approval.

GitHub Desktop summary: `v15.7.15 - Correct Stage17 RPC validator parity audit`
Description: `Document inline history checks already present in blocked Stage14 candidate; distinguish live validator, candidate validator and isolated pg_temp helper. No deployment or Supabase changes.`


---

### Source: SYNC_RELEASE_STATUS.md

# Mahjong Score v15.7.15 — STATUS: DEVELOPMENT / DO NOT DEPLOY

Single Device Login + Automatic Session Transfer **BELUM SELESAI**.

- JavaScript sync bridge dan auth wiring ada tetapi sengaja dinonaktifkan melalui `MAHJONG_CLOUD_SYNC_ENABLED=false`.
- `supabase_sync_rpc_draft.sql` sengaja mengeluarkan exception dan tidak boleh dijalankan pada Supabase production.
- Pengujian lokal bukan pengganti tes Postgres RPC, Supabase Auth, Realtime, Safari iPhone, dan dua perangkat.
- Jangan deploy ZIP ini ke GitHub Pages dan jangan jalankan SQL draf.
- Baseline aplikasi production tetap v15.7.14 sampai seluruh pengujian selesai.

## Stage 14 427 PASS — existing column default alignment
Candidate explicitly sets `mahjong_game_states.is_current` DEFAULT false when column already exists; no data rewrite. See `STAGE14_EXISTING_DEFAULT_ALIGNMENT.md`. Remains DO NOT DEPLOY.

## Stage14 access preflight — 430 local tests
Read-only metadata query `supabase_sync_stage14_access_preflight_readonly.sql` added for direct table grants, policies, indexes, and RPC EXECUTE rights. 430 PASS / 0 FAIL locally. No Supabase execution; production sync remains disabled and SQL draft guarded. See STAGE14_ACCESS_PREFLIGHT_CHECKPOINT.md.

## Stage 14 checkpoint — 431 PASS
Read-only access preflight now reports absent foundation tables explicitly via `TABLE_PRESENCE` (previously missing tables were silently omitted). Local Node regression: 431 PASS / 0 FAIL. No Supabase integration test or deployment; DO NOT DEPLOY. See `STAGE14_PREFLIGHT_MISSING_TABLE_VISIBILITY.md`.

## Stage 14 — 434 PASS column preflight
Added read-only visibility for eight expected schema columns and `is_current` default, with 3 new tests. Actual Supabase execution pending. No production changes. See `STAGE14_COLUMN_PREFLIGHT_CHECKPOINT.md`.

## Stage 14 checkpoint 440 (2026-10-12)
Revoked writer payloads are no longer persisted as conflict rows in the local SQL candidate; authorized revision conflicts remain logged. Six contract tests added, 440 Node tests PASS, 0 FAIL. Cloud sync remains OFF; production integration not verified. See STAGE14_REVOKED_WRITER_STORAGE_GUARD.md.

## Stage14 consolidated checkpoint — 444 PASS (2026-10-12)
Static cross-RPC release-gate regression tests added; see `STAGE14_CONSOLIDATED_SECURITY_HANDOFF.md`. These tests do not constitute real PostgreSQL/Supabase or two-device verification. Cloud sync stays disabled and SQL candidate stays blocked. DO NOT DEPLOY.


---

### Source: UPLOAD_GITHUB.md

# Mahjong Score v15.7.0 — Upload via GitHub Desktop

1. Extract ZIP dan salin seluruh ISI folder `mahjong-score-main` ke root repo, termasuk file tersembunyi.
2. Commit: `v15.7.0 — Manual Points Inner Switch UI`; Push origin ke `main`.
3. Setelah deploy, uji toggle hanya bekerja saat switch ditekan.


---

### Source: VOICE_AUTO_MODE_V15.6.93_SETUP.md

# v15.6.93 — deployment checklist

1. Upload the changed application files and the new `supabase/functions/mahjong-voice-auto-mode/index.ts` plus updated `mahjong-voice-autofix-trigger/index.ts` to the repository main branch. Do not overwrite `js/voice-parser.js` with an older revision.
2. Deploy both Supabase Edge Functions: `mahjong-voice-auto-mode` (new) and `mahjong-voice-autofix-trigger` (updated). JWT verification must remain enabled. No SQL migration is required.
3. The existing Supabase secret `GITHUB_AUTOFIX_TOKEN` must permit GitHub Actions **Variables: Read and write** and **Actions: Write** on `wiroseta/mahjong-score`. Fine-grained tokens may need an updated permission grant. Never put the token in the frontend.
4. Keep GitHub Actions repository variable `MAHJONG_VOICE_AUTO_MODE` set to `development` or `stable`. The UI updates this variable; scheduled workflow already checks it.
5. Test admin Setting: switch to Stable, verify the GitHub variable becomes `stable`, and confirm the scheduled job is skipped and the manual trigger refuses to dispatch. Switch back to Development and confirm variable `development`. Confirm non-admin cannot invoke the mode endpoint.
6. Important limitation: a workflow that has already started before a mode switch may finish; the current workflow checks the variable only at job start. For strict mid-run cancellation, add a pre-push mode recheck in a later controlled change.
7. Version is v15.6.93 throughout active app surfaces. Historical changelog and setup documents retain historical version labels intentionally.


---

### Source: VOICE_CORRECTION_SETUP.md

# v15.6.88 — Voice correction consent (Tahap 4)

After a score is successfully recorded, if one or more Voice transcripts differ from the recorded hand, the scorekeeper may explicitly approve sharing a **text-only** correction. Cancel means no training record is created. The hand is already recorded regardless of consent. No raw audio is saved.

The report uses the existing `mahjong_voice_diagnostics` table, `kind=voice_debug`, and `details.confirmed_correction` with `confirmed_by_user=true`, `input`, four `names`, and `expected` (method, winner, discarder, quads, patterns). It uses the existing queued insert mechanism, including offline retry. The Gemini Auto-Fix worker already filters for this exact format.

**No new SQL or Edge Function required** if `supabase_latest.sql` for v15.6.85 has already been applied and authenticated scorekeepers can insert into `mahjong_voice_diagnostics`. Do not re-run unrelated migrations.

Important limitations: This is an opt-in text correction, not an audio transcription truth oracle. The user must verify the ASR text corresponds to the spoken intent. Multiple utterances are joined in sequence; only the last eight (max 400 characters) are retained for this hand. Auto-Fix remains subject to parser regression checks; a successful GitHub Actions run with no confirmed cases makes no changes.

Test on iPhone Safari and Samsung A17 after deployment: (1) correct voice score should not prompt, (2) misrecognized voice followed by manual correction should prompt after recording, (3) Cancel should not send confirmed_correction, (4) OK should queue and upload a voice_debug record, (5) offline confirmation should queue until online, (6) scoring and dealer rotation must remain correct. These browser tests have NOT been performed in this environment.


## Stage 254 — 2026-10-15 — Cloud Trial newer-login UI handoff
- Firefox live test identified normalized `Error: newer-login` from lease monitoring; Stage 241 UI callback only recognized the long-form `Newer login session exists` message.
- Updated existing `mahjongCloudTrialIsSupersededSession()` in `cloud-trial/index.html` to recognize both exact forms; unrelated network and lease-check errors remain non-logout.
- Existing local-only signOut and UI gate preserved; no database or production changes.
- Tests: 92 bridge/engine regression PASS, plus 11 targeted handler checks PASS. Live no-reload browser takeover remains PENDING.
- Cloud Sync production OFF. DO NOT DEPLOY production.

GitHub Desktop Summary: `Stage 254: recognize newer-login session takeover`
GitHub Desktop Description: `Normalize Cloud Trial session takeover detection for both newer-login and Newer login session exists; keep local-only logout, preserve game data, do not log out on network errors. 103 tests PASS; live two-browser no-reload verification pending. Production Cloud Sync OFF.`


## Stage 278C (2026-10-15) — pre-release integration, DO NOT DEPLOY
- Integrated verified trial takeover handling into main index.html while keeping production Cloud Sync OFF.
- Cloud Trial remains ON solely for verification.
- Removed 220 byte-identical numbered duplicate files from candidate package.
- This is NOT a production release; runtime regression and stale-token RPC rejection remain pending.


## Stage 282 — Historical file archive (base64, exact original bytes)
These entries are historical, not current instructions. Decode base64 to restore originals.

### ARCHIVED FILE: AUTO_FIX_SETUP.md | SHA256 d952fa88f4730d5a89f72feddce325b2c065f15d8d88a475874ab9fa8a76218b

```base64
IyB2MTUuNi44NiDigJQgR2VtaW5pIEF1dG8tRml4IChwYXJzZXIgb25seSkKCiMjIFNjb3BlCk9u
bHkgYGpzL3ZvaWNlLXBhcnNlci5qc2AgbWF5IGJlIGNoYW5nZWQgYnkgR2VtaW5pLiBgaW5kZXgu
aHRtbGAsIFNRTCwgU3VwYWJhc2UgZnVuY3Rpb25zLCBzY29yZSBsb2dpYywgYW5kIFVJIHJlbWFp
biB1bmNoYW5nZWQuIEluZnJhc3RydWN0dXJlIGZpbGVzIChgLmdpdGh1Yi93b3JrZmxvd3NgLCBg
c2NyaXB0c2AsIGB0ZXN0c2ApIGFyZSBjcmVhdGVkIG9uY2UgYnkgdGhpcyByZWxlYXNlLCBub3Qg
ZWRpdGVkIGJ5IEdlbWluaS4KCiMjIFJlcXVpcmVkIEdpdEh1YiBzZXR1cCAob25lLXRpbWUpCjEu
IFVwbG9hZCB0aGUgWklQIGNvbnRlbnRzIHRvIHRoZSByZXBvc2l0b3J5IGRlZmF1bHQgYnJhbmNo
IChgbWFpbmAgZXhwZWN0ZWQ7IGlmIHVzaW5nIGFub3RoZXIgYnJhbmNoLCBhZGp1c3QgYHZvaWNl
LXBhcnNlci1ndWFyZC55bWxgKS4gRW5hYmxlIEdpdEh1YiBBY3Rpb25zLgoyLiBBZGQgR2l0SHVi
IEFjdGlvbnMgcmVwb3NpdG9yeSBzZWNyZXRzOiBgU1VQQUJBU0VfVVJMYCwgYFNVUEFCQVNFX1NF
UlZJQ0VfUk9MRV9LRVlgLCBgR0VNSU5JX0FQSV9LRVlgLCBhbmQgYFZPSUNFX0FVVE9GSVhfR0hf
VE9LRU5gIChhIGZpbmUtZ3JhaW5lZCBHaXRIdWIgdG9rZW4gd2l0aCByZXBvc2l0b3J5IENvbnRl
bnRzIHJlYWQvd3JpdGUgYW5kIFB1bGwgcmVxdWVzdHMgcmVhZC93cml0ZSkuICoqTmV2ZXIgcHV0
IHNlY3JldHMgaW4gZnJvbnRlbmQgY29kZS4qKiBUaGUgZXhpc3RpbmcgU3VwYWJhc2UgR2VtaW5p
IHNlY3JldCBkb2VzIE5PVCBhdXRvbWF0aWNhbGx5IHRyYW5zZmVyIHRvIEdpdEh1Yi4KMy4gS2Vl
cCBhdXRvbWF0aWMgbWVyZ2UgRElTQUJMRUQuIFByb3RlY3QgYG1haW5gIHdpdGggdGhlIHJlcXVp
cmVkIGNoZWNrICoqVm9pY2UgUGFyc2VyIFJlZ3Jlc3Npb24qKiAoam9iIGBWb2ljZSBQYXJzZXIg
UmVncmVzc2lvbmAgZnJvbSBgVm9pY2UgUGFyc2VyIEd1YXJkYCksIGFuZCByZXF1aXJlIHB1bGwt
cmVxdWVzdCByZXZpZXcgYmVmb3JlIG1lcmdpbmcuIElmIGFuIG9sZCByZXF1aXJlZCBjaGVjayBp
cyBzdHVjayBhdCDigJxFeHBlY3RlZOKAnSwgdXBkYXRlIGl0cyBuYW1lIGluIEdpdEh1YiBicmFu
Y2ggcHJvdGVjdGlvbiB0byBtYXRjaCB0aGUgYWN0dWFsIHJlcG9ydGVkIGNoZWNrLgo0LiBBdXRv
LUZpeCBydW5zICoqbWFudWFsbHkgb25seSoqIGZyb20gQWN0aW9ucyDihpIgR2VtaW5pIFZvaWNl
IFBhcnNlciBBdXRvLUZpeCDihpIgUnVuIHdvcmtmbG93LiBUaGVyZSBpcyBubyBzY2hlZHVsZWQg
dHJpZ2dlci4KNS4gQ29uZmlybSB0aGUgU3VwYWJhc2UgdGFibGUgYG1haGpvbmdfdm9pY2VfZGlh
Z25vc3RpY3NgIGhhcyBgY3JlYXRlZF9hdGAsIGBraW5kYCwgYGRldGFpbHNgLCBgaWRgIGNvbHVt
bnM7IHRoZSB3b3JrZmxvdyByZWFkcyByZWNlbnQgYHZvaWNlX2RlYnVnYCByb3dzLgoKIyMgQ3Jp
dGljYWwgbGltaXRhdGlvbjogbm8gY29uZmlybWVkIGNvcnJlY3Rpb25zIHlldAp2MTUuNi44NSBs
b2dzIHJhdyB2b2ljZSBkZWJ1ZyBidXQgZG9lcyBub3QgeWV0IHByb2R1Y2UgYGRldGFpbHMuY29u
ZmlybWVkX2NvcnJlY3Rpb25gLiBUaGUgd29ya2VyICoqZGVsaWJlcmF0ZWx5IGRvZXMgbm90aGlu
ZyoqIHVudGlsIGEgaHVtYW4tY29uZmlybWVkIGNvcnJlY3Rpb24gZXhpc3RzLCBpbiB0aGlzIGV4
YWN0IEpTT04gZm9ybWF0OgoKYGBganNvbgp7CiAgImNvbmZpcm1lZF9jb3JyZWN0aW9uIjogewog
ICAgImNvbmZpcm1lZF9ieV91c2VyIjogdHJ1ZSwKICAgICJpbnB1dCI6ICJBbmRpIEh1ZGEgWWVu
aSIsCiAgICAibmFtZXMiOiBbIkFuZGkiLCAiWWVubnkiLCAiRmVycnkiLCAiQXJpIl0sCiAgICAi
ZXhwZWN0ZWQiOiB7Im1ldGhvZCI6Imh1Iiwid2lubmVyIjowLCJkaXNjYXJkZXIiOjF9CiAgfQp9
CmBgYAoKRG8gbm90IGZhYnJpY2F0ZSBgY29uZmlybWVkX2J5X3VzZXJgIG9yIHRyZWF0IEFJIGd1
ZXNzZXMgYXMgdHJ1dGguIENhcHR1cmluZyBjb25maXJtYXRpb24gYXV0b21hdGljYWxseSBmcm9t
IGZpbmFsIHVzZXItYXBwcm92ZWQgc2NvcmUgcmVxdWlyZXMgYSBmdXR1cmUgKipzZXBhcmF0ZSBh
cHBsaWNhdGlvbiBpbnRlZ3JhdGlvbioqLCB3aGljaCBpcyBleHBsaWNpdGx5IG91dHNpZGUgdGhl
IHBhcnNlci1vbmx5LWNoYW5nZSByZXN0cmljdGlvbi4gV2l0aG91dCB0aGF0IGludGVncmF0aW9u
IG9yIHZlcmlmaWVkIGRhdGEsIHRoZSBtYW51YWwgcGlwZWxpbmUgaXMgYSBzYWZlIG5vLW9wLgoK
IyMgU2FmZWd1YXJkcwotIEJhc2VsaW5lIHJlZ3Jlc3Npb24gbXVzdCBwYXNzICpiZWZvcmUqIGFu
ZCAqYWZ0ZXIqIGEgcHJvcG9zYWwuCi0gQWxsIGNvbmZpcm1lZCBleGFtcGxlcyBmcm9tIHRoZSBs
YXN0IDEwMCByZXBvcnRzIGFyZSB0ZXN0ZWQgYWdhaW5zdCB0aGUgcHJvcG9zZWQgcGFyc2VyLgot
IEdlbWluaSByZXR1cm5zIG9uZSBleGFjdCBzZWFyY2gvcmVwbGFjZTsgcmVqZWN0ZWQgaWYgYW1i
aWd1b3VzLCB0b28gbGFyZ2UsIGNoYW5nZXMgZnVuY3Rpb24gZGVjbGFyYXRpb25zLCBvciBpbnRy
b2R1Y2VzIG9idmlvdXMgZGFuZ2Vyb3VzIEFQSXMuCi0gT25seSBganMvdm9pY2UtcGFyc2VyLmpz
YCBpcyBpbmNsdWRlZCBpbiBQUjsgc2VwYXJhdGUgUFIgZ3VhcmQgcmVqZWN0cyBhbGwgb3RoZXIg
Y2hhbmdlZCBmaWxlcy4KLSBBdXRvbWF0aWMgbWVyZ2UgaXMgZGlzYWJsZWQuIEEgcHJvcG9zZWQg
UHVsbCBSZXF1ZXN0IG11c3QgYmUgcmV2aWV3ZWQgYW5kIG1lcmdlZCBtYW51YWxseSBhZnRlciBy
ZXF1aXJlZCBjaGVja3MgcGFzcy4KLSBUaGVzZSBjaGVja3MgcmVkdWNlIHJpc2ssIGJ1dCBjYW5u
b3QgcHJvdmUgc2VtYW50aWMgY29ycmVjdG5lc3Mgb3IgYXV0b21hdGljYWxseSByb2xsIGJhY2sg
YW4gdW5kZXRlY3RlZCByZWdyZXNzaW9uLiBDb25zaWRlciBhIHN0YWdpbmcvY2FuYXJ5IHdvcmtm
bG93IGJlZm9yZSBlbmFibGluZyB1bmF0dGVuZGVkIHByb2R1Y3Rpb24gbWVyZ2VzLgoKCiMjIHYx
NS42LjkwCldvcmtmbG93IG5vdyBydW5zIGRhaWx5IGF0IDAyOjAwIFVUQyAoMDk6MDAgV0lCKSBv
ciBtYW51YWxseTsgb25seSBjcmVhdGVzIGEgcGFyc2VyLW9ubHkgUFIsIG5ldmVyIG1lcmdlcy4g
SW4gVm9pY2UgRGlhZ25vc3RpYyA+IFZvaWNlIERlYnVnLCBhZG1pbmlzdHJhdG9yIG1heSBleHBs
aWNpdGx5IGNvbmZpcm0gYSBmYWlsZWQgU2FmYXJpIFF1YWQgdHJhbnNjcmlwdCB3aXRoIHBsYXll
ciBhbmQgY291bnQuIFRoaXMgdXNlcyBleGlzdGluZyBTdXBhYmFzZSBkaWFnbm9zdGljIHF1ZXVl
IGFuZCBodW1hbi1jb25maXJtZWQgc2NoZW1hLgo=
```

### ARCHIVED FILE: AUTO_FIX_V15.6.92_SETUP.md | SHA256 9da49e3d84d38008e40a8a5f404b4fced2dae72eab3940ac278907d9a7843da2

```base64
IyBNYWhqb25nIFNjb3JlIHYxNS42LjkyIOKAlCBBdXRvbWF0aWMgVm9pY2UgQ29ycmVjdGlvbiBU
cmlnZ2VyCgojIyBEZXBsb3ltZW50IHByZXJlcXVpc2l0ZXMgKHJlcXVpcmVkIGZvciBpbW1lZGlh
dGUgdHJpZ2dlcikKClRoZSBaSVAgaW5jbHVkZXMgYSBuZXcgU3VwYWJhc2UgRWRnZSBGdW5jdGlv
biBhbmQgU1FMIHNjaGVtYS4gVXBsb2FkaW5nIHRoZSBaSVAgdG8gR2l0SHViICoqZG9lcyBub3Qg
ZGVwbG95IFN1cGFiYXNlIEVkZ2UgRnVuY3Rpb25zIG9yIHJ1biBTUUwqKi4gVW50aWwgdGhlIHN0
ZXBzIGJlbG93IGFyZSBjb21wbGV0ZWQsIHRoZSBleGlzdGluZyBzY2hlZHVsZWQgMDY6MDAgV0lC
IEdpdEh1YiB3b3JrZmxvdyByZW1haW5zIGF2YWlsYWJsZSBhbmQgbmV3IGNvbmZpcm1lZCBjb3Jy
ZWN0aW9ucyBzdGlsbCBzYXZlIHRvIFN1cGFiYXNlLgoKMS4gUnVuIHRoZSAqKnNpbmdsZSBhY3Rp
dmUqKiBgc3VwYWJhc2VfbGF0ZXN0LnNxbGAgaW4gU3VwYWJhc2UgU1FMIEVkaXRvciAoYWZ0ZXIg
cmV2aWV3aW5nIGFnYWluc3QgdGhlIGN1cnJlbnQgZGF0YWJhc2UpLiBJdCBhZGRzIGBtYWhqb25n
X3ZvaWNlX2F1dG9maXhfZGlzcGF0Y2hlc2AsIGFuIFJMUy1wcm90ZWN0ZWQgZGVkdXBsaWNhdGlv
biBsZWRnZXIuIERvIG5vdCBhZGQgYSBzZXBhcmF0ZSB2ZXJzaW9uZWQgU1FMIGZpbGUuCjIuIENy
ZWF0ZSBhICoqZmluZS1ncmFpbmVkIEdpdEh1YiBQZXJzb25hbCBBY2Nlc3MgVG9rZW4qKiBzY29w
ZWQgKipvbmx5KiogdG8gYHdpcm9zZXRhL21haGpvbmctc2NvcmVgLCB3aXRoICoqQWN0aW9uczog
UmVhZCBhbmQgd3JpdGUqKiByZXBvc2l0b3J5IHBlcm1pc3Npb24uIEtlZXAgaXQgcHJpdmF0ZS4g
RG8gbm90IHB1dCBpdCBpbiBHaXRIdWIgcmVwb3NpdG9yeSBmaWxlcywgdGhlIGJyb3dzZXIsIG9y
IHRoaXMgY2hhdC4KMy4gSW4gU3VwYWJhc2UgcHJvamVjdCDihpIgRWRnZSBGdW5jdGlvbnMg4oaS
IFNlY3JldHMsIHNldCBgR0lUSFVCX0FVVE9GSVhfVE9LRU5gIHRvIHRoYXQgdG9rZW4uIFNldCBg
TUFISk9OR19WT0lDRV9BVVRPX01PREVgIHRvIGBkZXZlbG9wbWVudGAgZm9yIGltbWVkaWF0ZSB0
cmlnZ2VyaW5nLCBvciBgc3RhYmxlYCB0byBkaXNhYmxlIGl0LiBLZWVwIHRoaXMgdmFsdWUgc3lu
Y2hyb25pemVkIHdpdGggdGhlIEdpdEh1YiBBY3Rpb25zIHJlcG9zaXRvcnkgdmFyaWFibGUgb2Yg
dGhlIHNhbWUgbmFtZS4KNC4gRGVwbG95IGBzdXBhYmFzZS9mdW5jdGlvbnMvbWFoam9uZy12b2lj
ZS1hdXRvZml4LXRyaWdnZXIvaW5kZXgudHNgIGFzIEVkZ2UgRnVuY3Rpb24gbmFtZWQgKipgbWFo
am9uZy12b2ljZS1hdXRvZml4LXRyaWdnZXJgKiogd2l0aCBKV1QgdmVyaWZpY2F0aW9uIGVuYWJs
ZWQuIFRoZSBmdW5jdGlvbiBuZWVkcyBleGlzdGluZyBTdXBhYmFzZS1wcm92aWRlZCBgU1VQQUJB
U0VfVVJMYCwgYFNVUEFCQVNFX0FOT05fS0VZYCwgYW5kIGBTVVBBQkFTRV9TRVJWSUNFX1JPTEVf
S0VZYCBlbnZpcm9ubWVudCB2YXJpYWJsZXMuCjUuIENvbmZpcm0gdGhhdCB0aGUgZXhpc3Rpbmcg
R2l0SHViIEFjdGlvbnMgYEdlbWluaSBWb2ljZSBQYXJzZXIgQXV0by1GaXhgIHdvcmtmbG93IGlz
IGVuYWJsZWQsIHRoYXQgYE1BSEpPTkdfVk9JQ0VfQVVUT19NT0RFPWRldmVsb3BtZW50YCBpcyBj
b25maWd1cmVkIGluIHJlcG9zaXRvcnkgdmFyaWFibGVzLCBhbmQgdGhlIHdvcmtmbG93IHNlY3Jl
dHMgcmVxdWlyZWQgYnkgYHNjcmlwdHMvdm9pY2UtYXV0b2ZpeC5tanNgIGFyZSBwcmVzZW50Lgo2
LiBUZXN0IHdpdGggYSBnZW51aW5lIHVzZXItY29uZmlybWVkIGNvcnJlY3Rpb246IHRoZSBicm93
c2VyIGluc2VydHMgYHZvaWNlX2RlYnVnYCB0byBTdXBhYmFzZSwgdGhlbiBjYWxscyB0aGUgRWRn
ZSBGdW5jdGlvbiB3aXRoIHRoZSBzYXZlZCByZXBvcnQgSUQuIENoZWNrIEVkZ2UgRnVuY3Rpb24g
bG9ncyBhbmQgdGhlIG5ldyBHaXRIdWIgQWN0aW9ucyBydW4uIFRoZSBHaXRIdWIgd29ya2Zsb3cg
cGVyZm9ybXMgYmFzZWxpbmUvcmVncmVzc2lvbiB0ZXN0cyBhbmQgY29tbWl0cyAqKm9ubHkqKiBg
anMvdm9pY2UtcGFyc2VyLmpzYCBpZiB2ZXJpZmllZDsgb3RoZXJ3aXNlIGl0IHNhZmVseSBkb2Vz
IG5vdGhpbmcuCgojIyBTZWN1cml0eSBhbmQgYmVoYXZpb3IKCi0gQSBzaWduZWQtaW4gYWRtaW4v
c2NvcmVrZWVwZXIgY2FuIHJlcXVlc3QgZGlzcGF0Y2ggb25seSBmb3IgdGhlaXIgKipvd24qKiwg
cmVjZW50bHkgaW5zZXJ0ZWQsIGV4cGxpY2l0bHkgY29uZmlybWVkIGNvcnJlY3Rpb24uIFRoZSBz
ZXJ2ZXIgcmUtcmVhZHMgdGhlIHJlcG9ydDsgdGhlIGJyb3dzZXIgbmV2ZXIgc3VwcGxpZXMgdGhl
IGNvcnJlY3Rpb24gY29udGVudHMgdG8gR2l0SHViLgotIERpc3BhdGNoIGlzIGRlZHVwbGljYXRl
ZCBieSByZXBvcnQgSUQgaW4gdGhlIHNlcnZlci1zaWRlIGxlZGdlci4gR2l0SHViIEFjdGlvbnMg
Y29uY3VycmVuY3kgc2VyaWFsaXplcyB3b3JrZmxvdyBydW5zLgotIEluIFN0YWJsZSBtb2RlLCB0
aGUgc2VydmVyIGRvZXMgbm90IGRpc3BhdGNoIGFuZCBHaXRIdWIgd29ya2Zsb3cgam9iIGlzIGFs
c28gc2tpcHBlZC4gS2VlcCBib3RoIG1vZGUgc2V0dGluZ3Mgc3luY2hyb25pemVkLgotIEdpdEh1
YiB0b2tlbiBpcyBzdG9yZWQgb25seSBpbiBTdXBhYmFzZSBFZGdlIEZ1bmN0aW9uIHNlY3JldHMu
IFRoZSBhcHAgcmVtYWlucyB1c2FibGUgaWYgdGhlIEVkZ2UgRnVuY3Rpb24gaXMgbm90IGRlcGxv
eWVkIG9yIHRoZSBkaXNwYXRjaCBmYWlsczsgY29uZmlybWVkIGNvcnJlY3Rpb25zIHJlbWFpbiBz
YXZlZCBmb3IgdGhlIGRhaWx5IHNjaGVkdWxlZCB3b3JrZmxvdy4KLSBBIG5ldHdvcmsgdGltZW91
dCBhZnRlciBHaXRIdWIgYWNjZXB0ZWQgZGlzcGF0Y2ggbWF5IGNhdXNlIGEgcmV0cnk7IEdpdEh1
YiB3b3JrZmxvdyBjb25jdXJyZW5jeSBhbmQgcmVncmVzc2lvbiBjaGVja3MgYXJlIHRoZSBmaW5h
bCBzYWZlZ3VhcmRzLgotIE5vIGxpdmUgZGV2aWNlL2Jyb3dzZXIvU3VwYWJhc2UgaW50ZWdyYXRp
b24gdGVzdHMgd2VyZSBwZXJmb3JtZWQgaW4gdGhlIFpJUCBidWlsZCBlbnZpcm9ubWVudC4gVmVy
aWZ5IG9uIGlQaG9uZSBTYWZhcmkgYW5kIEFuZHJvaWQgYWZ0ZXIgZGVwbG95bWVudC4K
```

### ARCHIVED FILE: CLOUD_ON_ACTIVATION_NOTICE.md | SHA256 792b1295df4763a4e582d1a46d4ba14a799fdd0bd4e838e1d405c89df398aaf4

```base64
TWFoam9uZyBTY29yZSB2MTUuNy4xNSDigJQgQ0xPVUQgT04gY2FuZGlkYXRlCgpDaGFuZ2VkIG9u
bHkgaW5kZXguaHRtbCBjbG91ZCBmZWF0dXJlIGZsYWcgZnJvbSBmYWxzZSB0byB0cnVlIHJlbGF0
aXZlIHRvIHRoZSBsYXN0IHB1c2hlZCBzYWZlIHBhY2thZ2UuIE5vIFNRTCBleGVjdXRpb24gb3Ig
bGl2ZSB0d28tZGV2aWNlIHZlcmlmaWNhdGlvbiBwZXJmb3JtZWQuIEFsbCA1IFJQQ3Mgd2VyZSBy
ZXBvcnRlZCBpbnN0YWxsZWQgYnkgdXNlcjsgdGhpcyBpcyBub3QgcHJvb2Ygb2Ygd29ya2luZyBl
bmQtdG8tZW5kIHRyYW5zZmVyLiBDbG91ZCBtb2RlIHJlZnVzZXMgc2NvcmUgd3JpdGVzIHVubGVz
cyBzZXJ2ZXIgd3JpdGVyIGxlYXNlIGlzIGdyYW50ZWQuIEJhY2sgdXAgYWN0aXZlIGdhbWUgYW5k
IHZhbGlkYXRlIG9uIHR3byBkZXZpY2VzIGJlZm9yZSByZWx5aW5nIG9uIHRoaXMgYnVpbGQuIFJl
dmVydCBmbGFnIHRvIGZhbHNlIGlmIGxvY2tvdXQgb2NjdXJzLgo=
```

### ARCHIVED FILE: FASTTRACK_VERIFICATION.txt | SHA256 ca9d8d14e6496fbc4ee8fb4dc8b04bcf0123b40af5d22cbc28ea293253509549

```base64
VEFQIHZlcnNpb24gMTMKIyBTdWJ0ZXN0OiBQb3N0Z3JlU1FMIHByZWZsaWdodCBvcGVucyBhbiBl
eHBsaWNpdCByZWFkLW9ubHkgdHJhbnNhY3Rpb24Kb2sgMSAtIFBvc3RncmVTUUwgcHJlZmxpZ2h0
IG9wZW5zIGFuIGV4cGxpY2l0IHJlYWQtb25seSB0cmFuc2FjdGlvbgogIC0tLQogIGR1cmF0aW9u
X21zOiAxLjAzMjM5OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFBvc3RncmVTUUwg
cHJlZmxpZ2h0IG5ldmVyIHNlbmRzIG1pZ3JhdGlvbnMgb3Igd3JpdGVzCm9rIDIgLSBQb3N0Z3Jl
U1FMIHByZWZsaWdodCBuZXZlciBzZW5kcyBtaWdyYXRpb25zIG9yIHdyaXRlcwogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjUzNjU4NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFBvc3Rn
cmVTUUwgcHJlZmxpZ2h0IHZhbGlkYXRlcyBkYXRhYmFzZSBpZGVudGlmaWVyIGFuZCBmYWlscyBj
bG9zZWQgb24gY29ubmVjdGlvbiBlcnJvcnMKb2sgMyAtIFBvc3RncmVTUUwgcHJlZmxpZ2h0IHZh
bGlkYXRlcyBkYXRhYmFzZSBpZGVudGlmaWVyIGFuZCBmYWlscyBjbG9zZWQgb24gY29ubmVjdGlv
biBlcnJvcnMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNjY2NAogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IFNjb3JlIGVkaXQgcm9sbHMgYmFjayBjb21wbGV0ZSBzdGF0ZSBvbiBzYXZl
IGZhaWx1cmUKb2sgNCAtIFNjb3JlIGVkaXQgcm9sbHMgYmFjayBjb21wbGV0ZSBzdGF0ZSBvbiBz
YXZlIGZhaWx1cmUKICAtLS0KICBkdXJhdGlvbl9tczogMy42MTkzNDEKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBTY29yZSBlZGl0IHBlcnNpc3RzIG5ldyByZXN1bHQgb24gc2F2ZSBz
dWNjZXNzCm9rIDUgLSBTY29yZSBlZGl0IHBlcnNpc3RzIG5ldyByZXN1bHQgb24gc2F2ZSBzdWNj
ZXNzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODk1MjY0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogUXVhZCBkZWxldGlvbiByb2xscyBiYWNrIGNvbXBsZXRlIHN0YXRlIG9uIHNhdmUg
ZmFpbHVyZQpvayA2IC0gUXVhZCBkZWxldGlvbiByb2xscyBiYWNrIGNvbXBsZXRlIHN0YXRlIG9u
IHNhdmUgZmFpbHVyZQogIC0tLQogIGR1cmF0aW9uX21zOiAxLjQ5NTA1NAogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IFF1YWQgZGVsZXRpb24gcGVyc2lzdHMgb24gc2F2ZSBzdWNjZXNz
Cm9rIDcgLSBRdWFkIGRlbGV0aW9uIHBlcnNpc3RzIG9uIHNhdmUgc3VjY2VzcwogIC0tLQogIGR1
cmF0aW9uX21zOiAxLjc2NjgxMQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG9sZCBz
Y29yZSBlZGl0IHJlYmFzZXMgbmV3ZXIgYmVmb3JlCm9rIDggLSBvbGQgc2NvcmUgZWRpdCByZWJh
c2VzIG5ld2VyIGJlZm9yZQogIC0tLQogIGR1cmF0aW9uX21zOiAzLjM2NDgwOQogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG9sZCBzY29yZSBlZGl0IHNhdmUgZmFpbHVyZSByb2xscyBi
YWNrIHJlYmFzaW5nCm9rIDkgLSBvbGQgc2NvcmUgZWRpdCBzYXZlIGZhaWx1cmUgcm9sbHMgYmFj
ayByZWJhc2luZwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjk4ODQwMwogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IG9sZCBxdWFkIGRlbGV0aW9uIHJlYmFzZXMgbmV3ZXIgYmVmb3JlCm9r
IDEwIC0gb2xkIHF1YWQgZGVsZXRpb24gcmViYXNlcyBuZXdlciBiZWZvcmUKICAtLS0KICBkdXJh
dGlvbl9tczogMS4wMzA3NDcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBvbGQgcXVh
ZCBkZWxldGlvbiBzYXZlIGZhaWx1cmUgcm9sbHMgYmFjayByZWJhc2luZwpvayAxMSAtIG9sZCBx
dWFkIGRlbGV0aW9uIHNhdmUgZmFpbHVyZSByb2xscyBiYWNrIHJlYmFzaW5nCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDIuMjQzMzE2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbGVnYWN5
IG1pc3NpbmcgbmV3ZXIgYmVmb3JlIGJsb2NrcyBzY29yZSBlZGl0Cm9rIDEyIC0gbGVnYWN5IG1p
c3NpbmcgbmV3ZXIgYmVmb3JlIGJsb2NrcyBzY29yZSBlZGl0CiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuOTAyMjg0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbGVnYWN5IG1pc3Npbmcg
bmV3ZXIgYmVmb3JlIGJsb2NrcyBxdWFkIGRlbGV0aW9uCm9rIDEzIC0gbGVnYWN5IG1pc3Npbmcg
bmV3ZXIgYmVmb3JlIGJsb2NrcyBxdWFkIGRlbGV0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
ODY3MDQxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCBwcmVmbGlnaHQg
ZXhhbWluZXMgYWxsIGZvdXIgc3luYyBmb3VuZGF0aW9uIHRhYmxlcwpvayAxNCAtIFN0YWdlMTQg
cHJlZmxpZ2h0IGV4YW1pbmVzIGFsbCBmb3VyIHN5bmMgZm91bmRhdGlvbiB0YWJsZXMKICAtLS0K
ICBkdXJhdGlvbl9tczogMC43MzUxNzQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBT
dGFnZTE0IHByZWZsaWdodCBjaGVja3MgZGlyZWN0IERNTCBwcml2aWxlZ2VzIGZvciBib3RoIEFQ
SSByb2xlcwpvayAxNSAtIFN0YWdlMTQgcHJlZmxpZ2h0IGNoZWNrcyBkaXJlY3QgRE1MIHByaXZp
bGVnZXMgZm9yIGJvdGggQVBJIHJvbGVzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTQ4NTkzCiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCBwcmVmbGlnaHQgYXVkaXRzIHBv
bGljaWVzLCBpbmRleGVzIGFuZCBSUEMgZXhlY3V0ZSBncmFudHMgd2l0aG91dCBtdXRhdGlvbnMK
b2sgMTYgLSBTdGFnZTE0IHByZWZsaWdodCBhdWRpdHMgcG9saWNpZXMsIGluZGV4ZXMgYW5kIFJQ
QyBleGVjdXRlIGdyYW50cyB3aXRob3V0IG11dGF0aW9ucwogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjQwNTA0OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgcHJlZmxpZ2h0
IGV4cGxpY2l0bHkgcmVwb3J0cyBtaXNzaW5nIGZvdW5kYXRpb24gdGFibGVzIHJhdGhlciB0aGFu
IHNpbGVudGx5IG9taXR0aW5nIHRoZW0Kb2sgMTcgLSBTdGFnZTE0IHByZWZsaWdodCBleHBsaWNp
dGx5IHJlcG9ydHMgbWlzc2luZyBmb3VuZGF0aW9uIHRhYmxlcyByYXRoZXIgdGhhbiBzaWxlbnRs
eSBvbWl0dGluZyB0aGVtCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTQ1MDQ4CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogZW1wdHkgZXZpZGVuY2UgaXMgYmxvY2tlZApvayAxOCAtIGVt
cHR5IGV2aWRlbmNlIGlzIGJsb2NrZWQKICAtLS0KICBkdXJhdGlvbl9tczogMC44NjcxMjEKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjb21wbGV0ZSByZXN0cmljdGl2ZSB0YWJsZSBl
dmlkZW5jZSBwYXNzZXMgcHJvdmlzaW9uYWwgYWNjZXNzIGNoZWNrcwpvayAxOSAtIGNvbXBsZXRl
IHJlc3RyaWN0aXZlIHRhYmxlIGV2aWRlbmNlIHBhc3NlcyBwcm92aXNpb25hbCBhY2Nlc3MgY2hl
Y2tzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTkwNzU2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogbWlzc2luZyB0YWJsZSBldmlkZW5jZSBibG9ja3MKb2sgMjAgLSBtaXNzaW5nIHRh
YmxlIGV2aWRlbmNlIGJsb2NrcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEwNTU5OQogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGRpcmVjdCBhdXRoZW50aWNhdGVkIHVwZGF0ZSBibG9j
a3MKb2sgMjEgLSBkaXJlY3QgYXV0aGVudGljYXRlZCB1cGRhdGUgYmxvY2tzCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMjI1Nzc5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogZGlyZWN0
IGFub24gaW5zZXJ0IGJsb2NrcwpvayAyMiAtIGRpcmVjdCBhbm9uIGluc2VydCBibG9ja3MKICAt
LS0KICBkdXJhdGlvbl9tczogMC4xMjcwNzEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBkaXNhYmxlZCBSTFMgYmxvY2tzCm9rIDIzIC0gZGlzYWJsZWQgUkxTIGJsb2NrcwogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjk0NDQ3OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVu
a25vd24gcHJpdmlsZWdlIGJsb2NrcwpvayAyNCAtIHVua25vd24gcHJpdmlsZWdlIGJsb2Nrcwog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjE4NTQ0OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IGR1cGxpY2F0ZSBjb25mbGljdGluZyBldmlkZW5jZSBibG9ja3MKb2sgMjUgLSBkdXBsaWNh
dGUgY29uZmxpY3RpbmcgZXZpZGVuY2UgYmxvY2tzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTk2
MjQ1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCBjYW5kaWRhdGUgaXMg
YmxvY2tlZCBmcm9tIHByb2R1Y3Rpb24gZXhlY3V0aW9uCm9rIDI2IC0gU3RhZ2UxNCBjYW5kaWRh
dGUgaXMgYmxvY2tlZCBmcm9tIHByb2R1Y3Rpb24gZXhlY3V0aW9uCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDEuMTQ3NTAyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCBuZXdl
ciBzZXNzaW9uIG1heSBwYXNzIHdpdGhvdXQgaGlzdG9yaWNhbCBkZXZpY2UgbG9jawpvayAyNyAt
IFN0YWdlMTQgbmV3ZXIgc2Vzc2lvbiBtYXkgcGFzcyB3aXRob3V0IGhpc3RvcmljYWwgZGV2aWNl
IGxvY2sKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNTA3NTYKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBTdGFnZTE0IHByZWZsaWdodCBwcmVjZWRlcyB3cml0ZXIgcmV2b2NhdGlvbgpv
ayAyOCAtIFN0YWdlMTQgcHJlZmxpZ2h0IHByZWNlZGVzIHdyaXRlciByZXZvY2F0aW9uCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMjQwOTcxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
U3RhZ2UxNCBvbGQgd3JpdGVyIHRva2VuIHJldm9rZWQgYW5kIHNlc3Npb24gZ2VuZXJhdGlvbiBy
b3RhdGVkCm9rIDI5IC0gU3RhZ2UxNCBvbGQgd3JpdGVyIHRva2VuIHJldm9rZWQgYW5kIHNlc3Np
b24gZ2VuZXJhdGlvbiByb3RhdGVkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzU3MDc2CiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCBjb21taXQgdmFsaWRhdGVzIHNlc3Np
b24gdG9rZW4gZ2VuZXJhdGlvbiBhbmQgY2xvdWQgcmV2aXNpb24Kb2sgMzAgLSBTdGFnZTE0IGNv
bW1pdCB2YWxpZGF0ZXMgc2Vzc2lvbiB0b2tlbiBnZW5lcmF0aW9uIGFuZCBjbG91ZCByZXZpc2lv
bgogIC0tLQogIGR1cmF0aW9uX21zOiAxLjg1MjY5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogU3RhZ2UxNCBjYW5kaWRhdGUgcmVqZWN0cyBvbGRlciBhdXRoIGxvZ2luIGV2ZW4gYWZ0
ZXIgbmV3ZXIgc2Vzc2lvbiBleHBpcmVzCm9rIDMxIC0gU3RhZ2UxNCBjYW5kaWRhdGUgcmVqZWN0
cyBvbGRlciBhdXRoIGxvZ2luIGV2ZW4gYWZ0ZXIgbmV3ZXIgc2Vzc2lvbiBleHBpcmVzCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMTc0NzMyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
Y29tcGxldGUgaW52ZW50b3J5IHBhc3NlcyBwcmVzZW5jZS1vbmx5IGdhdGUKb2sgMzIgLSBjb21w
bGV0ZSBpbnZlbnRvcnkgcGFzc2VzIHByZXNlbmNlLW9ubHkgZ2F0ZQogIC0tLQogIGR1cmF0aW9u
X21zOiAxLjM5MDI1NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG1pc3NpbmcgZXZp
ZGVuY2UgZmFpbHMgY2xvc2VkCm9rIDMzIC0gbWlzc2luZyBldmlkZW5jZSBmYWlscyBjbG9zZWQK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4yNzEwNjYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBkdXBsaWNhdGUgY29sdW1uIGV2aWRlbmNlIGZhaWxzCm9rIDM0IC0gZHVwbGljYXRlIGNv
bHVtbiBldmlkZW5jZSBmYWlscwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIyMTY1MwogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG1pc3NpbmcgaW5zdGFsbGVkIGNvbHVtbiBmYWlscwpv
ayAzNSAtIG1pc3NpbmcgaW5zdGFsbGVkIGNvbHVtbiBmYWlscwogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjI2NTQ1OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVua25vd24gaW5zdGFs
bGVkIHN0YXRlIGZhaWxzCm9rIDM2IC0gdW5rbm93biBpbnN0YWxsZWQgc3RhdGUgZmFpbHMKICAt
LS0KICBkdXJhdGlvbl9tczogMC4yMDA5NjEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiB1bmtub3duIGRhdGEgdHlwZSBmYWlscwpvayAzNyAtIHVua25vd24gZGF0YSB0eXBlIGZhaWxz
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTM4MDQ3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogbm9uLWFycmF5IGV2aWRlbmNlIGZhaWxzCm9rIDM4IC0gbm9uLWFycmF5IGV2aWRlbmNl
IGZhaWxzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjM2NDE1CiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogc3RhZ2UxNCB0eXBlIGdhdGUgYWNjZXB0cyBleGFjdCBleHBlY3RlZCB0eXBl
cwpvayAzOSAtIHN0YWdlMTQgdHlwZSBnYXRlIGFjY2VwdHMgZXhhY3QgZXhwZWN0ZWQgdHlwZXMK
ICAtLS0KICBkdXJhdGlvbl9tczogMS4xMjQxNzcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBzdGFnZTE0IHR5cGUgZ2F0ZSByZWplY3RzIG1pc3NpbmcgZXZpZGVuY2UKb2sgNDAgLSBz
dGFnZTE0IHR5cGUgZ2F0ZSByZWplY3RzIG1pc3NpbmcgZXZpZGVuY2UKICAtLS0KICBkdXJhdGlv
bl9tczogMC4yMDA1NzEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdGFnZTE0IHR5
cGUgZ2F0ZSByZWplY3RzIGR1cGxpY2F0ZSBldmlkZW5jZQpvayA0MSAtIHN0YWdlMTQgdHlwZSBn
YXRlIHJlamVjdHMgZHVwbGljYXRlIGV2aWRlbmNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTI1
ODI4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3RhZ2UxNCB0eXBlIGdhdGUgcmVq
ZWN0cyBtaXNzaW5nIGluc3RhbGxlZCBmbGFnCm9rIDQyIC0gc3RhZ2UxNCB0eXBlIGdhdGUgcmVq
ZWN0cyBtaXNzaW5nIGluc3RhbGxlZCBmbGFnCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTU4NDE4
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3RhZ2UxNCB0eXBlIGdhdGUgcmVqZWN0
cyBpbmNvbXBhdGlibGUgdXVpZCB0eXBlCm9rIDQzIC0gc3RhZ2UxNCB0eXBlIGdhdGUgcmVqZWN0
cyBpbmNvbXBhdGlibGUgdXVpZCB0eXBlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTIxNTcyCiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3RhZ2UxNCB0eXBlIGdhdGUgcmVqZWN0cyBp
bnZhbGlkIGlucHV0Cm9rIDQ0IC0gc3RhZ2UxNCB0eXBlIGdhdGUgcmVqZWN0cyBpbnZhbGlkIGlu
cHV0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMDgzOTY2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogU3RhZ2UxNCBTUUwgY2FuZGlkYXRlIHJldGFpbnMgbm9uLWRlcGxveWFibGUgZmly
c3Qtc3RhdGVtZW50IGdhdGUKb2sgNDUgLSBTdGFnZTE0IFNRTCBjYW5kaWRhdGUgcmV0YWlucyBu
b24tZGVwbG95YWJsZSBmaXJzdC1zdGF0ZW1lbnQgZ2F0ZQogIC0tLQogIGR1cmF0aW9uX21zOiAx
LjIxNTEzNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgd3JpdGVyIHRh
a2VvdmVyIHZhbGlkYXRlcyBjbG91ZCBwcmVmbGlnaHQgYmVmb3JlIHJldm9raW5nIHByZXZpb3Vz
IHdyaXRlcgpvayA0NiAtIFN0YWdlMTQgd3JpdGVyIHRha2VvdmVyIHZhbGlkYXRlcyBjbG91ZCBw
cmVmbGlnaHQgYmVmb3JlIHJldm9raW5nIHByZXZpb3VzIHdyaXRlcgogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjI5MjUyOQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgY29t
bWl0IG5ldmVyIHN0b3JlcyByZWplY3RlZCByZXZva2VkLXdyaXRlciBwYXlsb2FkIGluIGNvbmZs
aWN0IGxlZGdlcgpvayA0NyAtIFN0YWdlMTQgY29tbWl0IG5ldmVyIHN0b3JlcyByZWplY3RlZCBy
ZXZva2VkLXdyaXRlciBwYXlsb2FkIGluIGNvbmZsaWN0IGxlZGdlcgogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjI2Mjc2NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgcmVh
ZC1vbmx5IGVucm9sbG1lbnQgY2Fubm90IGRvd25ncmFkZSBhY3RpdmUgd3JpdGVyLCBhbmQgcmVh
ZGVyIGFjY2VzcyByZWNoZWNrcyBwZXJtaXNzaW9uCm9rIDQ4IC0gU3RhZ2UxNCByZWFkLW9ubHkg
ZW5yb2xsbWVudCBjYW5ub3QgZG93bmdyYWRlIGFjdGl2ZSB3cml0ZXIsIGFuZCByZWFkZXIgYWNj
ZXNzIHJlY2hlY2tzIHBlcm1pc3Npb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4xOTUzNDMKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdGFnZTE0IGRlZmF1bHRzIGFjY2VwdCBjYW5k
aWRhdGUgbWV0YWRhdGEKb2sgNDkgLSBzdGFnZTE0IGRlZmF1bHRzIGFjY2VwdCBjYW5kaWRhdGUg
bWV0YWRhdGEKICAtLS0KICBkdXJhdGlvbl9tczogMy41MTY4MzcKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBzdGFnZTE0IGRlZmF1bHRzIHJlamVjdCBhYnNlbnQgcm93Cm9rIDUwIC0g
c3RhZ2UxNCBkZWZhdWx0cyByZWplY3QgYWJzZW50IHJvdwogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjMwMjgwNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0YWdlMTQgZGVmYXVsdHMg
cmVqZWN0IGR1cGxpY2F0ZSByb3cKb2sgNTEgLSBzdGFnZTE0IGRlZmF1bHRzIHJlamVjdCBkdXBs
aWNhdGUgcm93CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjI2MTgKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBzdGFnZTE0IGRlZmF1bHRzIHJlamVjdCBudWxsYWJsZSBib29sZWFuCm9r
IDUyIC0gc3RhZ2UxNCBkZWZhdWx0cyByZWplY3QgbnVsbGFibGUgYm9vbGVhbgogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjI5NjgzNQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0YWdl
MTQgZGVmYXVsdHMgcmVqZWN0IHRydWUgZGVmYXVsdApvayA1MyAtIHN0YWdlMTQgZGVmYXVsdHMg
cmVqZWN0IHRydWUgZGVmYXVsdAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI0NDIwNwogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0YWdlMTQgZGVmYXVsdHMgcmVqZWN0IG51bGwgZGVm
YXVsdApvayA1NCAtIHN0YWdlMTQgZGVmYXVsdHMgcmVqZWN0IG51bGwgZGVmYXVsdAogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjE3MDQ2NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0
YWdlMTQgZGVmYXVsdHMgcmVqZWN0IHVudHJ1c3RlZCBleHByZXNzaW9uCm9rIDU1IC0gc3RhZ2Ux
NCBkZWZhdWx0cyByZWplY3QgdW50cnVzdGVkIGV4cHJlc3Npb24KICAtLS0KICBkdXJhdGlvbl9t
czogMS4xNzI5OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0YWdlMTQgZGVmYXVs
dHMgcmVqZWN0IG1hbGZvcm1lZCBldmlkZW5jZQpvayA1NiAtIHN0YWdlMTQgZGVmYXVsdHMgcmVq
ZWN0IG1hbGZvcm1lZCBldmlkZW5jZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE0NjQ0CiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYnVuZGxlIG1pc3NpbmcgYWxsIGV2aWRlbmNlIGZh
aWxzIGNsb3NlZApvayA1NyAtIGJ1bmRsZSBtaXNzaW5nIGFsbCBldmlkZW5jZSBmYWlscyBjbG9z
ZWQKICAtLS0KICBkdXJhdGlvbl9tczogMi4yNDg1MzQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBidW5kbGUgbnVsbCBmYWlscyBjbG9zZWQKb2sgNTggLSBidW5kbGUgbnVsbCBmYWls
cyBjbG9zZWQKICAtLS0KICBkdXJhdGlvbl9tczogMC40MDIyNTQKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBidW5kbGUgcmVwb3J0cyBmb3VyIGluZGVwZW5kZW50IGdhdGVzCm9rIDU5
IC0gYnVuZGxlIHJlcG9ydHMgZm91ciBpbmRlcGVuZGVudCBnYXRlcwogIC0tLQogIGR1cmF0aW9u
X21zOiAyLjAzNjIwNgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGJ1bmRsZSBtaXNz
aW5nIGRlZmF1bHRzIGZhaWxzIGV2ZW4gaWYgb3RoZXIgc2VjdGlvbnMgcHJvdmlkZWQKb2sgNjAg
LSBidW5kbGUgbWlzc2luZyBkZWZhdWx0cyBmYWlscyBldmVuIGlmIG90aGVyIHNlY3Rpb25zIHBy
b3ZpZGVkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODA5MDc0CiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogYnVuZGxlIG1hbGZvcm1lZCBzZWN0aW9uIGNhbm5vdCBwYXNzCm9rIDYxIC0g
YnVuZGxlIG1hbGZvcm1lZCBzZWN0aW9uIGNhbm5vdCBwYXNzCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDIuMTEwNDY3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYnVuZGxlIGRvZXMgbm90
IGNsYWltIHJ1bnRpbWUgdmFsaWRhdGlvbgpvayA2MiAtIGJ1bmRsZSBkb2VzIG5vdCBjbGFpbSBy
dW50aW1lIHZhbGlkYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC41NDkzMjQKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZTE0IGV4aXN0aW5nIGlzX2N1cnJlbnQgZGVmYXVs
dCBleHBsaWNpdGx5IHNldCBmYWxzZQpvayA2MyAtIFN0YWdlMTQgZXhpc3RpbmcgaXNfY3VycmVu
dCBkZWZhdWx0IGV4cGxpY2l0bHkgc2V0IGZhbHNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMDQx
MjUzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCBkZWZhdWx0IGFsaWdu
bWVudCBkb2VzIG5vdCB1cGRhdGUgaGlzdG9yaWNhbCBnYW1lIHJvd3MKb2sgNjQgLSBTdGFnZTE0
IGRlZmF1bHQgYWxpZ25tZW50IGRvZXMgbm90IHVwZGF0ZSBoaXN0b3JpY2FsIGdhbWUgcm93cwog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjM1MzM4MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IFN0YWdlMTQgY2FuZGlkYXRlIHJldGFpbnMgZmFpbC1jbG9zZWQgZ3VhcmQgYWhlYWQgb2Yg
ZGVmYXVsdCBtaWdyYXRpb24Kb2sgNjUgLSBTdGFnZTE0IGNhbmRpZGF0ZSByZXRhaW5zIGZhaWwt
Y2xvc2VkIGd1YXJkIGFoZWFkIG9mIGRlZmF1bHQgbWlncmF0aW9uCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMTU0NDYyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCBoaXN0
b3J5IHJlamVjdHMgbWlzc2luZywgbnVsbCBhbmQgbm9uLWFycmF5IEpTT04Kb2sgNjYgLSBTdGFn
ZTE0IGhpc3RvcnkgcmVqZWN0cyBtaXNzaW5nLCBudWxsIGFuZCBub24tYXJyYXkgSlNPTgogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjk3ODgxOQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IFN0YWdlMTQgaGlzdG9yeSBhcnJheSBsZW5ndGggY2hlY2tlZCBvbmx5IGFmdGVyIHR5cGUgZ3Vh
cmQKb2sgNjcgLSBTdGFnZTE0IGhpc3RvcnkgYXJyYXkgbGVuZ3RoIGNoZWNrZWQgb25seSBhZnRl
ciB0eXBlIGd1YXJkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTYxMTkyCiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCBjYW5kaWRhdGUgcmVtYWlucyBibG9ja2VkIGJlZm9y
ZSBEREwKb2sgNjggLSBTdGFnZTE0IGNhbmRpZGF0ZSByZW1haW5zIGJsb2NrZWQgYmVmb3JlIERE
TAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjA5ODMzNwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IFN0YWdlMTQgcHJvZHVjdGlvbiBib3VuZGFyeSByZW1haW5zIGZhaWwgY2xvc2VkCm9r
IDY5IC0gU3RhZ2UxNCBwcm9kdWN0aW9uIGJvdW5kYXJ5IHJlbWFpbnMgZmFpbCBjbG9zZWQKICAt
LS0KICBkdXJhdGlvbl9tczogMS4wMDgyODMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBTdGFnZTE0IGRyYWZ0IHJlcXVpcmVzIHNjaGVtYSBjb2x1bW5zIGFic2VudCBmcm9tIHByb2R1
Y3Rpb24gbWV0YWRhdGEgZXhwb3J0Cm9rIDcwIC0gU3RhZ2UxNCBkcmFmdCByZXF1aXJlcyBzY2hl
bWEgY29sdW1ucyBhYnNlbnQgZnJvbSBwcm9kdWN0aW9uIG1ldGFkYXRhIGV4cG9ydAogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjE2ODg4MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0
YWdlMTQgZHJhZnQgZG9lcyBub3Qgc2lsZW50bHkgcmVwbGFjZSBleGlzdGluZyBjdXJyZW50LWdh
bWUgZGVmYXVsdApvayA3MSAtIFN0YWdlMTQgZHJhZnQgZG9lcyBub3Qgc2lsZW50bHkgcmVwbGFj
ZSBleGlzdGluZyBjdXJyZW50LWdhbWUgZGVmYXVsdAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEy
MTgyMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgc2luZ2xlLWRldmlj
ZSB3cml0ZXIgdGFrZW92ZXIgaXMgaW50ZW50aW9uYWxseSBibG9ja2VkLCBub3QgYXV0b21hdGlj
Cm9rIDcyIC0gU3RhZ2UxNCBzaW5nbGUtZGV2aWNlIHdyaXRlciB0YWtlb3ZlciBpcyBpbnRlbnRp
b25hbGx5IGJsb2NrZWQsIG5vdCBhdXRvbWF0aWMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMTAy
NDUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZTE0IGNvbW1pdCB2YWxpZGF0
ZXMgdG9rZW4gYW5kIGF1dGgtc2Vzc2lvbiBiaW5kaW5nCm9rIDczIC0gU3RhZ2UxNCBjb21taXQg
dmFsaWRhdGVzIHRva2VuIGFuZCBhdXRoLXNlc3Npb24gYmluZGluZwogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjE5NzI2NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJldm9rZWQgd3Jp
dGVyIGF0dGVtcHRzIG5ldmVyIHBlcnNpc3QgcHJvcG9zZWQgc25hcHNob3RzCm9rIDc0IC0gcmV2
b2tlZCB3cml0ZXIgYXR0ZW1wdHMgbmV2ZXIgcGVyc2lzdCBwcm9wb3NlZCBzbmFwc2hvdHMKICAt
LS0KICBkdXJhdGlvbl9tczogNC45NTU1NjcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiByZWplY3RlZCB3cml0ZXIgc3RpbGwgcmVjZWl2ZXMgZXhwbGljaXQgcmV2b2NhdGlvbiByZWFz
b24Kb2sgNzUgLSByZWplY3RlZCB3cml0ZXIgc3RpbGwgcmVjZWl2ZXMgZXhwbGljaXQgcmV2b2Nh
dGlvbiByZWFzb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4xODA3ODIKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiByZXZpc2lvbi1jb25mbGljdCByZXRhaW5zIGF1dGhvcml6ZWQgY29u
ZmxpY3QgbGVkZ2VyCm9rIDc2IC0gcmV2aXNpb24tY29uZmxpY3QgcmV0YWlucyBhdXRob3JpemVk
IGNvbmZsaWN0IGxlZGdlcgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE1MjA0OAogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJldm9rZWQgd3JpdGVyIGNhbm5vdCB1cGRhdGUgY2Fub25p
Y2FsIGdhbWUgZGF0YQpvayA3NyAtIHJldm9rZWQgd3JpdGVyIGNhbm5vdCB1cGRhdGUgY2Fub25p
Y2FsIGdhbWUgZGF0YQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE2MTI1MgogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IGNvbW1pdCByZW1haW5zIGJvdW5kIHRvIGF1dGggc2Vzc2lvbgpv
ayA3OCAtIGNvbW1pdCByZW1haW5zIGJvdW5kIHRvIGF1dGggc2Vzc2lvbgogIC0tLQogIGR1cmF0
aW9uX21zOiA2LjQ1NTMxNwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNhbmRpZGF0
ZSByZW1haW5zIGJsb2NrZWQgZnJvbSBkZXBsb3ltZW50Cm9rIDc5IC0gY2FuZGlkYXRlIHJlbWFp
bnMgYmxvY2tlZCBmcm9tIGRlcGxveW1lbnQKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMzY0MTUK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBycGMgZXZpZGVuY2UgYWNjZXB0cyBjb21w
bGV0ZSBjYW5kaWRhdGUgbWV0YWRhdGEKb2sgODAgLSBycGMgZXZpZGVuY2UgYWNjZXB0cyBjb21w
bGV0ZSBjYW5kaWRhdGUgbWV0YWRhdGEKICAtLS0KICBkdXJhdGlvbl9tczogMC45MTMxCiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcnBjIGV2aWRlbmNlIGZhaWxzIGNsb3NlZCB3aXRo
b3V0IHJvd3MKb2sgODEgLSBycGMgZXZpZGVuY2UgZmFpbHMgY2xvc2VkIHdpdGhvdXQgcm93cwog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjE3MjM3OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IHJwYyBldmlkZW5jZSByZWplY3RzIG1pc3NpbmcgZnVuY3Rpb24Kb2sgODIgLSBycGMgZXZp
ZGVuY2UgcmVqZWN0cyBtaXNzaW5nIGZ1bmN0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTA4
ODE0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcnBjIGV2aWRlbmNlIHJlamVjdHMg
ZHVwbGljYXRlIGZ1bmN0aW9uCm9rIDgzIC0gcnBjIGV2aWRlbmNlIHJlamVjdHMgZHVwbGljYXRl
IGZ1bmN0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTE0MDEyCiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogcnBjIGV2aWRlbmNlIHJlamVjdHMgYW5vbnltb3VzIGV4ZWN1dGlvbgpv
ayA4NCAtIHJwYyBldmlkZW5jZSByZWplY3RzIGFub255bW91cyBleGVjdXRpb24KICAtLS0KICBk
dXJhdGlvbl9tczogMC4xMDE1NjMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBycGMg
ZXZpZGVuY2UgcmVqZWN0cyBQVUJMSUMgZXhlY3V0aW9uCm9rIDg1IC0gcnBjIGV2aWRlbmNlIHJl
amVjdHMgUFVCTElDIGV4ZWN1dGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjA4MjE5MwogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJwYyBldmlkZW5jZSByZWplY3RzIG1pc3Npbmcg
c2VjdXJlIHNlYXJjaCBwYXRoCm9rIDg2IC0gcnBjIGV2aWRlbmNlIHJlamVjdHMgbWlzc2luZyBz
ZWN1cmUgc2VhcmNoIHBhdGgKICAtLS0KICBkdXJhdGlvbl9tczogMS4wNzExNjcKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBycGMgZXZpZGVuY2UgcmVqZWN0cyB1bmNvbmZpcm1lZCBz
ZWN1cml0eSBkZWZpbmVyCm9rIDg3IC0gcnBjIGV2aWRlbmNlIHJlamVjdHMgdW5jb25maXJtZWQg
c2VjdXJpdHkgZGVmaW5lcgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE0ODM2MwogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpZ25hdHVyZSBpbnZlbnRvcnkgYWNjZXB0cyB1bmlxdWUg
Y29tcGxldGUgY2FuZGlkYXRlCm9rIDg4IC0gc2lnbmF0dXJlIGludmVudG9yeSBhY2NlcHRzIHVu
aXF1ZSBjb21wbGV0ZSBjYW5kaWRhdGUKICAtLS0KICBkdXJhdGlvbl9tczogMS44NzAwNDYKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzaWduYXR1cmUgaW52ZW50b3J5IGZhaWxzIGNs
b3NlZCBvbiBtaXNzaW5nIGlucHV0Cm9rIDg5IC0gc2lnbmF0dXJlIGludmVudG9yeSBmYWlscyBj
bG9zZWQgb24gbWlzc2luZyBpbnB1dAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE0OTk4NgogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpZ25hdHVyZSBpbnZlbnRvcnkgcmVqZWN0cyBt
aXNzaW5nIFJQQwpvayA5MCAtIHNpZ25hdHVyZSBpbnZlbnRvcnkgcmVqZWN0cyBtaXNzaW5nIFJQ
QwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE5NDQzMgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IHNpZ25hdHVyZSBpbnZlbnRvcnkgcmVqZWN0cyBvdmVybG9hZGVkIFJQQwpvayA5MSAt
IHNpZ25hdHVyZSBpbnZlbnRvcnkgcmVqZWN0cyBvdmVybG9hZGVkIFJQQwogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjIxNTg1NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpZ25hdHVy
ZSBpbnZlbnRvcnkgcmVqZWN0cyBjcm9zcy1zY2hlbWEgc2hhZG93Cm9rIDkyIC0gc2lnbmF0dXJl
IGludmVudG9yeSByZWplY3RzIGNyb3NzLXNjaGVtYSBzaGFkb3cKICAtLS0KICBkdXJhdGlvbl9t
czogMC4xMTQ2MjIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzaWduYXR1cmUgaW52
ZW50b3J5IHJlamVjdHMgcHJvY2VkdXJlIGtpbmQKb2sgOTMgLSBzaWduYXR1cmUgaW52ZW50b3J5
IHJlamVjdHMgcHJvY2VkdXJlIGtpbmQKICAtLS0KICBkdXJhdGlvbl9tczogMS4xNzc1MzcKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzaWduYXR1cmUgaW52ZW50b3J5IHJlamVjdHMg
YWJzZW50IGlkZW50aXR5IGFyZ3VtZW50cwpvayA5NCAtIHNpZ25hdHVyZSBpbnZlbnRvcnkgcmVq
ZWN0cyBhYnNlbnQgaWRlbnRpdHkgYXJndW1lbnRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTcz
NDgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzaWduYXR1cmUgaW52ZW50b3J5IHJl
amVjdHMgdW5zYWZlIHNlYXJjaCBwYXRoCm9rIDk1IC0gc2lnbmF0dXJlIGludmVudG9yeSByZWpl
Y3RzIHVuc2FmZSBzZWFyY2ggcGF0aAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEwNjY4MQogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpZ25hdHVyZSBpbnZlbnRvcnkgcmVqZWN0cyBp
bnZva2VyIHJpZ2h0cwpvayA5NiAtIHNpZ25hdHVyZSBpbnZlbnRvcnkgcmVqZWN0cyBpbnZva2Vy
IHJpZ2h0cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjMxODMyOAogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IFJQQyBpbnZlbnRvcnkgcXVlcnkgaXMgU0VMRUNULW9ubHkKb2sgOTcgLSBS
UEMgaW52ZW50b3J5IHF1ZXJ5IGlzIFNFTEVDVC1vbmx5CiAgLS0tCiAgZHVyYXRpb25fbXM6IDIu
NTUxMTI4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogUlBDIGludmVudG9yeSBpbmNs
dWRlcyBhbGwgZml2ZSB0YXJnZXQgZnVuY3Rpb25zCm9rIDk4IC0gUlBDIGludmVudG9yeSBpbmNs
dWRlcyBhbGwgZml2ZSB0YXJnZXQgZnVuY3Rpb25zCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTc4
Mzc4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogUlBDIGludmVudG9yeSBpbmNsdWRl
cyBjcm9zcy1zY2hlbWEgc2hhZG93IGZ1bmN0aW9ucwpvayA5OSAtIFJQQyBpbnZlbnRvcnkgaW5j
bHVkZXMgY3Jvc3Mtc2NoZW1hIHNoYWRvdyBmdW5jdGlvbnMKICAtLS0KICBkdXJhdGlvbl9tczog
MC4xMzE4MTgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBSUEMgaW52ZW50b3J5IHJl
YWRzIHBnX3Byb2MgZnVuY3Rpb24gaWRlbnRpdHkgYW5kIGRlZmluZXIKb2sgMTAwIC0gUlBDIGlu
dmVudG9yeSByZWFkcyBwZ19wcm9jIGZ1bmN0aW9uIGlkZW50aXR5IGFuZCBkZWZpbmVyCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuNTc5NzgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBS
UEMgaW52ZW50b3J5IGNvbnNlcnZhdGl2ZWx5IGNoZWNrcyBjb25maWd1cmVkIHNlYXJjaF9wYXRo
Cm9rIDEwMSAtIFJQQyBpbnZlbnRvcnkgY29uc2VydmF0aXZlbHkgY2hlY2tzIGNvbmZpZ3VyZWQg
c2VhcmNoX3BhdGgKICAtLS0KICBkdXJhdGlvbl9tczogMC4xOTM1OQogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgcmVhZC1vbmx5IHByZWZsaWdodCBleHBvc2VzIGJvdGgg
bWlzc2luZyB0cmFuc2ZlciBjb2x1bW5zCm9rIDEwMiAtIFN0YWdlMTQgcmVhZC1vbmx5IHByZWZs
aWdodCBleHBvc2VzIGJvdGggbWlzc2luZyB0cmFuc2ZlciBjb2x1bW5zCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDEuMzcyOAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgcHJl
ZmxpZ2h0IHJlcG9ydHMgZXhpc3RpbmcgaXNfY3VycmVudCBkZWZhdWx0IGZvciBhbGlnbm1lbnQK
b2sgMTAzIC0gU3RhZ2UxNCBwcmVmbGlnaHQgcmVwb3J0cyBleGlzdGluZyBpc19jdXJyZW50IGRl
ZmF1bHQgZm9yIGFsaWdubWVudAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM4OTI5NAogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgc2NoZW1hIGludmVudG9yeSByZXRhaW5z
IGFic2VudCBjb2x1bW5zIHRocm91Z2ggbGVmdCBqb2luCm9rIDEwNCAtIFN0YWdlMTQgc2NoZW1h
IGludmVudG9yeSByZXRhaW5zIGFic2VudCBjb2x1bW5zIHRocm91Z2ggbGVmdCBqb2luCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMTA4MDkyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
b3BlbiByZWplY3RzIHdoaXRlc3BhY2Utb25seSBkZXZpY2UgSUQgYmVmb3JlIHRyYW5zcG9ydApv
ayAxMDUgLSBvcGVuIHJlamVjdHMgd2hpdGVzcGFjZS1vbmx5IGRldmljZSBJRCBiZWZvcmUgdHJh
bnNwb3J0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMTY5OTA2CiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogcmVhZCBhbmQgb3BlblJlYWRlciByZWplY3Qgd2hpdGVzcGFjZS1vbmx5IGRl
dmljZSBJRApvayAxMDYgLSByZWFkIGFuZCBvcGVuUmVhZGVyIHJlamVjdCB3aGl0ZXNwYWNlLW9u
bHkgZGV2aWNlIElECiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTkyNjkKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBvcGVuIHJlamVjdHMgd2hpdGVzcGFjZS1vbmx5IGV4cGVjdGVkIGNs
b3VkIGdhbWUgSUQKb2sgMTA3IC0gb3BlbiByZWplY3RzIHdoaXRlc3BhY2Utb25seSBleHBlY3Rl
ZCBjbG91ZCBnYW1lIElECiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTI2OTgxCiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogY29tbWl0IHJlamVjdHMgd2hpdGVzcGFjZS1vbmx5IGdhbWUs
IGRldmljZSBhbmQgdG9rZW4gY3JlZGVudGlhbHMKb2sgMTA4IC0gY29tbWl0IHJlamVjdHMgd2hp
dGVzcGFjZS1vbmx5IGdhbWUsIGRldmljZSBhbmQgdG9rZW4gY3JlZGVudGlhbHMKICAtLS0KICBk
dXJhdGlvbl9tczogMC4zMTAzMjUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBsZWFz
ZVN0YXR1cyByZWplY3RzIHdoaXRlc3BhY2Utb25seSBkZXZpY2UgSUQKb2sgMTA5IC0gbGVhc2VT
dGF0dXMgcmVqZWN0cyB3aGl0ZXNwYWNlLW9ubHkgZGV2aWNlIElECiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMjU5NTIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBtYXRjaGluZyBleGlz
dGluZyBjbG91ZCBnYW1lIGlzIGFjY2VwdGVkIHdpdGhvdXQgd3JpdGluZyBzdG9yYWdlCm9rIDEx
MCAtIG1hdGNoaW5nIGV4aXN0aW5nIGNsb3VkIGdhbWUgaXMgYWNjZXB0ZWQgd2l0aG91dCB3cml0
aW5nIHN0b3JhZ2UKICAtLS0KICBkdXJhdGlvbl9tczogMS4yMzY3MjYKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBkaWZmZXJlbnQgZXhpc3RpbmcgZ2FtZSBpcyBuZXZlciBvdmVyd3Jp
dHRlbiBieSBjbG91ZCBhZG9wdGlvbgpvayAxMTEgLSBkaWZmZXJlbnQgZXhpc3RpbmcgZ2FtZSBp
cyBuZXZlciBvdmVyd3JpdHRlbiBieSBjbG91ZCBhZG9wdGlvbgogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjczNDE5MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGRpc2FibGVkIGJyaWRn
ZSBjYW5ub3QgYWNjZXNzIHNlcnZlciBvciB3cml0ZSBhcHBsaWNhdGlvbgpvayAxMTIgLSBkaXNh
YmxlZCBicmlkZ2UgY2Fubm90IGFjY2VzcyBzZXJ2ZXIgb3Igd3JpdGUgYXBwbGljYXRpb24KICAt
LS0KICBkdXJhdGlvbl9tczogMi4xODgxNzMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBjbG91ZCBhZG9wdGlvbiBtdXN0IGJlIGNvbmZpcm1lZCBiZWZvcmUgcmVwb3J0aW5nIGFjdGl2
YXRpb24gc3VjY2VzcwpvayAxMTMgLSBjbG91ZCBhZG9wdGlvbiBtdXN0IGJlIGNvbmZpcm1lZCBi
ZWZvcmUgcmVwb3J0aW5nIGFjdGl2YXRpb24gc3VjY2VzcwogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjM3MDM3NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpZ25vdXQgaW52YWxpZGF0
ZXMgcGVuZGluZyBjbG91ZCBhY3RpdmF0aW9uCm9rIDExNCAtIHNpZ25vdXQgaW52YWxpZGF0ZXMg
cGVuZGluZyBjbG91ZCBhY3RpdmF0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjIwOTMxCiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbG9nb3V0IHN1cHByZXNzZXMgbGF0ZSBzeW5j
IHN1Y2Nlc3MgZnJvbSBwcmV2aW91cyBhY2NvdW50Cm9rIDExNSAtIGxvZ291dCBzdXBwcmVzc2Vz
IGxhdGUgc3luYyBzdWNjZXNzIGZyb20gcHJldmlvdXMgYWNjb3VudAogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjQ5OTU2OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxvZ291dCBzdXBw
cmVzc2VzIGxhdGUgc3luYyByZWplY3Rpb24gZnJvbSBwcmV2aW91cyBhY2NvdW50Cm9rIDExNiAt
IGxvZ291dCBzdXBwcmVzc2VzIGxhdGUgc3luYyByZWplY3Rpb24gZnJvbSBwcmV2aW91cyBhY2Nv
dW50CiAgLS0tCiAgZHVyYXRpb25fbXM6IDE3LjAzNzg4NwogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IG5ldyBsb2dpbiBmb3Igc2FtZSB1c2VyIGludmFsaWRhdGVzIHByZXZpb3VzIHdy
aXRlciBsZWFzZQpvayAxMTcgLSBuZXcgbG9naW4gZm9yIHNhbWUgdXNlciBpbnZhbGlkYXRlcyBw
cmV2aW91cyB3cml0ZXIgbGVhc2UKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNzY2MzUKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBtaXNzaW5nIGF1dGggc2Vzc2lvbiBpZCBjYW5ub3Qg
cmV1c2UgYSB3cml0ZXIgbGVhc2UKb2sgMTE4IC0gbWlzc2luZyBhdXRoIHNlc3Npb24gaWQgY2Fu
bm90IHJldXNlIGEgd3JpdGVyIGxlYXNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjAwMjYKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBKV1Qgc2Vzc2lvbiBpZGVudGl0eSBjaGFuZ2Vz
IGludmFsaWRhdGUgZWFybGllciB3cml0ZXIgbGVhc2UKb2sgMTE5IC0gSldUIHNlc3Npb24gaWRl
bnRpdHkgY2hhbmdlcyBpbnZhbGlkYXRlIGVhcmxpZXIgd3JpdGVyIGxlYXNlCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuNDY1ODU5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbG9jYWwg
c2NvcmUgc2F2ZWQgZHVyaW5nIGFjdGl2YXRpb24gcHJldmVudHMgc3RhbGUgY2xvdWQgYWRvcHRp
b24Kb2sgMTIwIC0gbG9jYWwgc2NvcmUgc2F2ZWQgZHVyaW5nIGFjdGl2YXRpb24gcHJldmVudHMg
c3RhbGUgY2xvdWQgYWRvcHRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMS4xNDcwMDEKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBsb2NhbCBzY29yZSBjaGFuZ2VkIGR1cmluZyBhY3Rp
dmF0aW9uIGJsb2NrcyBjbG91ZCBhZG9wdGlvbiBhbmQgcmV0YWlucyBsb2NhbCBzdGF0ZQpvayAx
MjEgLSBsb2NhbCBzY29yZSBjaGFuZ2VkIGR1cmluZyBhY3RpdmF0aW9uIGJsb2NrcyBjbG91ZCBh
ZG9wdGlvbiBhbmQgcmV0YWlucyBsb2NhbCBzdGF0ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjU0
OTk0NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNjb3JlIHJlY29yZGVkIGR1cmlu
ZyBhY3RpdmF0aW9uIGlzIGR1cmFibHkgcXVldWVkIGJlZm9yZSB0YWtlb3ZlciBpcyBibG9ja2Vk
Cm9rIDEyMiAtIHNjb3JlIHJlY29yZGVkIGR1cmluZyBhY3RpdmF0aW9uIGlzIGR1cmFibHkgcXVl
dWVkIGJlZm9yZSB0YWtlb3ZlciBpcyBibG9ja2VkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzY3
NTUyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3luY2hyb25vdXMgZW5naW5lIHB1
c2ggZmFpbHVyZSBiZWNvbWVzIGEgY29udHJvbGxlZCBzeW5jIGVycm9yCm9rIDEyMyAtIHN5bmNo
cm9ub3VzIGVuZ2luZSBwdXNoIGZhaWx1cmUgYmVjb21lcyBhIGNvbnRyb2xsZWQgc3luYyBlcnJv
cgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIyNjQ2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogYXN5bmNocm9ub3VzIGFkb3B0aW9uIGlzIGludmFsaWRhdGVkIHdoZW4gdXNlciBsb2dz
IG91dApvayAxMjQgLSBhc3luY2hyb25vdXMgYWRvcHRpb24gaXMgaW52YWxpZGF0ZWQgd2hlbiB1
c2VyIGxvZ3Mgb3V0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjUyMDA4CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogcmVwZWF0ZWQgYXV0aCBub3RpZmljYXRpb24gY2Fubm90IHJlcG9y
dCByZWFkeSBiZWZvcmUgY2xvdWQgYWRvcHRpb24gY29tcGxldGVzCm9rIDEyNSAtIHJlcGVhdGVk
IGF1dGggbm90aWZpY2F0aW9uIGNhbm5vdCByZXBvcnQgcmVhZHkgYmVmb3JlIGNsb3VkIGFkb3B0
aW9uIGNvbXBsZXRlcwogIC0tLQogIGR1cmF0aW9uX21zOiAzLjkxMTEyOQogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IHJlYWQtb25seSBjbG91ZCBzZXNzaW9uIG5ldmVyIGludm9rZXMg
c2NvcmUgY29tbWl0Cm9rIDEyNiAtIHJlYWQtb25seSBjbG91ZCBzZXNzaW9uIG5ldmVyIGludm9r
ZXMgc2NvcmUgY29tbWl0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzQ2OTQxCiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogc2VydmVyIHdyaXRlciByZXZvY2F0aW9uIGRpc2FibGVzIGZ1
dHVyZSBzZW5kcyBhbmQgcmVhZGluZXNzCm9rIDEyNyAtIHNlcnZlciB3cml0ZXIgcmV2b2NhdGlv
biBkaXNhYmxlcyBmdXR1cmUgc2VuZHMgYW5kIHJlYWRpbmVzcwogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjM4NzYyMgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVuaGFuZGxlZCBxdWV1
ZSBmYWlsdXJlIGRpc2FibGVzIHdyaXRlciBsZWFzZSB1bnRpbCByZWFjdGl2YXRpb24Kb2sgMTI4
IC0gdW5oYW5kbGVkIHF1ZXVlIGZhaWx1cmUgZGlzYWJsZXMgd3JpdGVyIGxlYXNlIHVudGlsIHJl
YWN0aXZhdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjMxMDI4NQogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IGxvZ291dCBiZWZvcmUgZGVmZXJyZWQgcHVzaCBkb2VzIG5vdCBlbnF1
ZXVlIG9yIGNvbnRhY3Qgb2xkIHNlc3Npb24Kb2sgMTI5IC0gbG9nb3V0IGJlZm9yZSBkZWZlcnJl
ZCBwdXNoIGRvZXMgbm90IGVucXVldWUgb3IgY29udGFjdCBvbGQgc2Vzc2lvbgogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjM3ODM3OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFjdGl2
YXRpb24gcmVmdXNlcyBhIHdyaXRlciBsZWFzZSB3aGVuIGVuZ2luZSByZXBvcnRzIGNvbmZsaWN0
Cm9rIDEzMCAtIGFjdGl2YXRpb24gcmVmdXNlcyBhIHdyaXRlciBsZWFzZSB3aGVuIGVuZ2luZSBy
ZXBvcnRzIGNvbmZsaWN0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjk3MzU3CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogdW5wYWRkZWQgYmFzZTY0dXJsIEpXVCBzZXNzaW9uIGlkZW50
aXR5IHdvcmtzIHdpdGggc3RyaWN0IFNhZmFyaS1zdHlsZSBhdG9iCm9rIDEzMSAtIHVucGFkZGVk
IGJhc2U2NHVybCBKV1Qgc2Vzc2lvbiBpZGVudGl0eSB3b3JrcyB3aXRoIHN0cmljdCBTYWZhcmkt
c3R5bGUgYXRvYgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM0NjI4CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogZGVmZXJyZWQgY2xvdWQgc2VuZCBjYXB0dXJlcyB0aGUgZXhhY3Qgc2F2
ZWQgc2NvcmUgYmVmb3JlIGxhdGVyIG11dGF0aW9uCm9rIDEzMiAtIGRlZmVycmVkIGNsb3VkIHNl
bmQgY2FwdHVyZXMgdGhlIGV4YWN0IHNhdmVkIHNjb3JlIGJlZm9yZSBsYXRlciBtdXRhdGlvbgog
IC0tLQogIGR1cmF0aW9uX21zOiA0LjYzODI1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogZGV2aWNlIGlkZW50aXR5IHN0b3JhZ2UgZmFpbHVyZSBjbGVhcnMgdGVudGF0aXZlIGF1dGgg
YW5kIHJldHVybnMgY29udHJvbGxlZCBlcnJvcgpvayAxMzMgLSBkZXZpY2UgaWRlbnRpdHkgc3Rv
cmFnZSBmYWlsdXJlIGNsZWFycyB0ZW50YXRpdmUgYXV0aCBhbmQgcmV0dXJucyBjb250cm9sbGVk
IGVycm9yCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjY2NjcxCiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogYWRhcHRlciBpbml0aWFsaXphdGlvbiBmYWlsdXJlIG5ldmVyIHJldGFpbnMg
cGhhbnRvbSBhY2NvdW50IGxlYXNlCm9rIDEzNCAtIGFkYXB0ZXIgaW5pdGlhbGl6YXRpb24gZmFp
bHVyZSBuZXZlciByZXRhaW5zIHBoYW50b20gYWNjb3VudCBsZWFzZQogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjM0NjU3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29uZmxpY3Rpbmcg
ZXhwbGljaXQgc2Vzc2lvbiBhbmQgSldUIHNlc3Npb24gaWRlbnRpZmllcnMgZmFpbCBjbG9zZWQK
b2sgMTM1IC0gY29uZmxpY3RpbmcgZXhwbGljaXQgc2Vzc2lvbiBhbmQgSldUIHNlc3Npb24gaWRl
bnRpZmllcnMgZmFpbCBjbG9zZWQKICAtLS0KICBkdXJhdGlvbl9tczogMC40MTQyOTEKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBleHBpcmVkIEpXVCBjYW5ub3QgYWN0aXZhdGUgYSBj
bG91ZCB3cml0ZXIgbGVhc2UKb2sgMTM2IC0gZXhwaXJlZCBKV1QgY2Fubm90IGFjdGl2YXRlIGEg
Y2xvdWQgd3JpdGVyIGxlYXNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjY1Nzg5CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogZmFpbGVkIGFjdGl2YXRpb24gY2xlYXJzIGFjY291bnQg
YW5kIGF1dGggc2Vzc2lvbiBpZGVudGl0eSBiZWZvcmUgcmV0cnkKb2sgMTM3IC0gZmFpbGVkIGFj
dGl2YXRpb24gY2xlYXJzIGFjY291bnQgYW5kIGF1dGggc2Vzc2lvbiBpZGVudGl0eSBiZWZvcmUg
cmV0cnkKICAtLS0KICBkdXJhdGlvbl9tczogMC4zODc1MDEKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiByZXBlYXRlZCBhdXRoIG5vdGlmaWNhdGlvbiBjYW5ub3QgcmV2aXZlIGEgcmV2
b2tlZCBlbmdpbmUgd3JpdGVyIGxlYXNlCm9rIDEzOCAtIHJlcGVhdGVkIGF1dGggbm90aWZpY2F0
aW9uIGNhbm5vdCByZXZpdmUgYSByZXZva2VkIGVuZ2luZSB3cml0ZXIgbGVhc2UKICAtLS0KICBk
dXJhdGlvbl9tczogMC4yOTQ3MTIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBsZWFz
ZSBtb25pdG9yIHN0YXJ0cyBhZnRlciBhY3RpdmF0aW9uLCBhdm9pZHMgb3ZlcmxhcHBpbmcgY2hl
Y2tzIGFuZCBzdG9wcyBvbiBsb2dvdXQKb2sgMTM5IC0gbGVhc2UgbW9uaXRvciBzdGFydHMgYWZ0
ZXIgYWN0aXZhdGlvbiwgYXZvaWRzIG92ZXJsYXBwaW5nIGNoZWNrcyBhbmQgc3RvcHMgb24gbG9n
b3V0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDMyLjYxNzk4NwogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IGxlYXNlIG1vbml0b3IgbmV2ZXIgc2NoZWR1bGVzIGZvciBkaXNhYmxlZCBzeW5j
Cm9rIDE0MCAtIGxlYXNlIG1vbml0b3IgbmV2ZXIgc2NoZWR1bGVzIGZvciBkaXNhYmxlZCBzeW5j
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjI5MjU0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogbGF0ZSBsZWFzZSByZWplY3Rpb24gZnJvbSBwcmV2aW91cyBsb2dpbiBjYW5ub3QgcmV2
b2tlIHJlcGxhY2VtZW50IHdyaXRlcgpvayAxNDEgLSBsYXRlIGxlYXNlIHJlamVjdGlvbiBmcm9t
IHByZXZpb3VzIGxvZ2luIGNhbm5vdCByZXZva2UgcmVwbGFjZW1lbnQgd3JpdGVyCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDEuMDc2MDQ1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3Vj
Y2Vzc2Z1bCBsZWFzZSBjaGVjayB3aXRoIHJldm9rZWQgd3JpdGVyIHBlcm1pc3Npb24gZmFpbHMg
Y2xvc2VkCm9rIDE0MiAtIHN1Y2Nlc3NmdWwgbGVhc2UgY2hlY2sgd2l0aCByZXZva2VkIHdyaXRl
ciBwZXJtaXNzaW9uIGZhaWxzIGNsb3NlZAogIC0tLQogIGR1cmF0aW9uX21zOiA0LjYwOTU2Nwog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlamVjdGVkIGRpcmVjdCBsZWFzZSBjaGVj
ayByZXZva2VzIHdyaXRlciBzdGF0dXMgd2l0aG91dCB0aHJvd2luZwpvayAxNDMgLSByZWplY3Rl
ZCBkaXJlY3QgbGVhc2UgY2hlY2sgcmV2b2tlcyB3cml0ZXIgc3RhdHVzIHdpdGhvdXQgdGhyb3dp
bmcKICAtLS0KICBkdXJhdGlvbl9tczogMC4zMzk1MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IHN0cnVjdHVyZWQgbGVhc2UgbmV0d29yayBmYWlsdXJlIHJldm9rZXMgYnJpZGdlIHdy
aXRlciBwZXJtaXNzaW9uCm9rIDE0NCAtIHN0cnVjdHVyZWQgbGVhc2UgbmV0d29yayBmYWlsdXJl
IHJldm9rZXMgYnJpZGdlIHdyaXRlciBwZXJtaXNzaW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MjYwMjkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBuZXR3b3JrIGZhaWx1cmUgYWZ0
ZXIgZHVyYWJsZSBlbnF1ZXVlIHdpdGhkcmF3cyB3cml0ZSBwZXJtaXNzaW9uIGFuZCBwcmVzZXJ2
ZXMgcXVldWUKb2sgMTQ1IC0gbmV0d29yayBmYWlsdXJlIGFmdGVyIGR1cmFibGUgZW5xdWV1ZSB3
aXRoZHJhd3Mgd3JpdGUgcGVybWlzc2lvbiBhbmQgcHJlc2VydmVzIHF1ZXVlCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuNTg4OTg0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2VydmVy
IHBlcm1pdHMgTlVMTCBvbmx5IGZvciBhZG9wdGluZyBleGlzdGluZyBjbG91ZCBnYW1lCm9rIDE0
NiAtIHNlcnZlciBwZXJtaXRzIE5VTEwgb25seSBmb3IgYWRvcHRpbmcgZXhpc3RpbmcgY2xvdWQg
Z2FtZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjkzNTgwNAogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IHRyYW5zcG9ydCBzZW5kcyBudWxsIGZvciBhIG5ldyBkZXZpY2Ugd2l0aCBubyBs
b2NhbCBnYW1lCm9rIDE0NyAtIHRyYW5zcG9ydCBzZW5kcyBudWxsIGZvciBhIG5ldyBkZXZpY2Ug
d2l0aCBubyBsb2NhbCBnYW1lCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzQyMTg0CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogdHJhbnNwb3J0IHJlamVjdHMgYXJyYXlzIGFzIGluaXRp
YWwgZ2FtZXMKb2sgMTQ4IC0gdHJhbnNwb3J0IHJlamVjdHMgYXJyYXlzIGFzIGluaXRpYWwgZ2Ft
ZXMKICAtLS0KICBkdXJhdGlvbl9tczogMC4zNjM4OTYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBjb21taXQgcmVqZWN0cyBnZW5lcmF0aW9uIHplcm8gd2l0aG91dCBSUEMgY2FsbApv
ayAxNDkgLSBjb21taXQgcmVqZWN0cyBnZW5lcmF0aW9uIHplcm8gd2l0aG91dCBSUEMgY2FsbAog
IC0tLQogIGR1cmF0aW9uX21zOiA0LjcyNTQyMQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IGNvbW1pdCByZWplY3RzIG5lZ2F0aXZlIGdlbmVyYXRpb24gd2l0aG91dCBSUEMgY2FsbApv
ayAxNTAgLSBjb21taXQgcmVqZWN0cyBuZWdhdGl2ZSBnZW5lcmF0aW9uIHdpdGhvdXQgUlBDIGNh
bGwKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMTcyMzYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBjb21taXQgcmVqZWN0cyBuZWdhdGl2ZSBiYXNlIHJldmlzaW9uIHdpdGhvdXQgUlBD
IGNhbGwKb2sgMTUxIC0gY29tbWl0IHJlamVjdHMgbmVnYXRpdmUgYmFzZSByZXZpc2lvbiB3aXRo
b3V0IFJQQyBjYWxsCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjUzOTMxCiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogcGVyc2lzdHMgYSBzdGFibGUgZGV2aWNlIElEIGFjcm9zcyByZXBl
YXRlZCBzZXNzaW9ucwpvayAxNTIgLSBwZXJzaXN0cyBhIHN0YWJsZSBkZXZpY2UgSUQgYWNyb3Nz
IHJlcGVhdGVkIHNlc3Npb25zCiAgLS0tCiAgZHVyYXRpb25fbXM6IDIuNTg5Mjg2CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogZG9lcyBub3Qgb3ZlcndyaXRlIGludmFsaWQgZXhpc3Rp
bmcgaWRlbnRpZmllcgpvayAxNTMgLSBkb2VzIG5vdCBvdmVyd3JpdGUgaW52YWxpZCBleGlzdGlu
ZyBpZGVudGlmaWVyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzU3NjQ3CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogZmFpbHMgY2xvc2VkIHdoZW4gc3RvcmFnZSBjYW5ub3QgcGVyc2lz
dApvayAxNTQgLSBmYWlscyBjbG9zZWQgd2hlbiBzdG9yYWdlIGNhbm5vdCBwZXJzaXN0CiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMTUwMDg1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
cmVxdWlyZXMgc2VjdXJlIHJhbmRvbSBVVUlECm9rIDE1NSAtIHJlcXVpcmVzIHNlY3VyZSByYW5k
b20gVVVJRAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE3MjU5OQogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IGZhaWxzIGNsb3NlZCBvbiB1bnJlYWRhYmxlIHN0b3JhZ2UKb2sgMTU2IC0g
ZmFpbHMgY2xvc2VkIG9uIHVucmVhZGFibGUgc3RvcmFnZQogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjEzODA1NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlamVjdHMgaW52YWxpZCBv
ciBub24tZmluaXRlIHNjb3JlcyBhbmQgaW52YWxpZCBoaXN0b3J5Cm9rIDE1NyAtIHJlamVjdHMg
aW52YWxpZCBvciBub24tZmluaXRlIHNjb3JlcyBhbmQgaW52YWxpZCBoaXN0b3J5CiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDEuNTI1NzA5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWN0
aXZhdGlvbiBiYWNrcyB1cCBleGlzdGluZyBsb2NhbCBnYW1lIGJlZm9yZSBhY2NlcHRpbmcgY2xv
dWQKb2sgMTU4IC0gYWN0aXZhdGlvbiBiYWNrcyB1cCBleGlzdGluZyBsb2NhbCBnYW1lIGJlZm9y
ZSBhY2NlcHRpbmcgY2xvdWQKICAtLS0KICBkdXJhdGlvbl9tczogMS42NDY1MTEKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBvZmZsaW5lIG5ldHdvcmsgZmFpbHVyZSBwZXJzaXN0cyBz
Y29yZSBxdWV1ZSwgbGF0ZXIgZmx1c2ggY29tbWl0cwpvayAxNTkgLSBvZmZsaW5lIG5ldHdvcmsg
ZmFpbHVyZSBwZXJzaXN0cyBzY29yZSBxdWV1ZSwgbGF0ZXIgZmx1c2ggY29tbWl0cwogIC0tLQog
IGR1cmF0aW9uX21zOiAxLjc5OTI2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29u
ZmxpY3Rpbmcgd3JpdGUgbmV2ZXIgb3ZlcndyaXRlcyBsb2NhbCBkYXRhIG9yIHNpbGVudGx5IGNs
ZWFycyBxdWV1ZQpvayAxNjAgLSBjb25mbGljdGluZyB3cml0ZSBuZXZlciBvdmVyd3JpdGVzIGxv
Y2FsIGRhdGEgb3Igc2lsZW50bHkgY2xlYXJzIHF1ZXVlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MzkwNDE2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZC1vbmx5IHNlc3Npb24g
Y2Fubm90IHdyaXRlIG9yIGVucXVldWUgbmV3IGRhdGEKb2sgMTYxIC0gcmVhZC1vbmx5IHNlc3Np
b24gY2Fubm90IHdyaXRlIG9yIGVucXVldWUgbmV3IGRhdGEKICAtLS0KICBkdXJhdGlvbl9tczog
MC4zNjcyOTEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBiYWNrdXAgYW5kIHBlbmRp
bmcga2V5cyBhcmUgc2NvcGVkIGJ5IGFjY291bnQgYW5kIGRldmljZQpvayAxNjIgLSBiYWNrdXAg
YW5kIHBlbmRpbmcga2V5cyBhcmUgc2NvcGVkIGJ5IGFjY291bnQgYW5kIGRldmljZQogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjIwNTk2OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNp
bXVsdGFuZW91cyBmbHVzaGVzIGRvIG5vdCBpc3N1ZSBkdXBsaWNhdGUgcmV2aXNpb24gd3JpdGVz
Cm9rIDE2MyAtIHNpbXVsdGFuZW91cyBmbHVzaGVzIGRvIG5vdCBpc3N1ZSBkdXBsaWNhdGUgcmV2
aXNpb24gd3JpdGVzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuOTA2MzMKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBlZGl0cyBxdWV1ZWQgZHVyaW5nIG5ldHdvcmsgY29tbWl0IHN1cnZp
dmUgc3VjY2Vzc2Z1bCByZXNwb25zZQpvayAxNjQgLSBlZGl0cyBxdWV1ZWQgZHVyaW5nIG5ldHdv
cmsgY29tbWl0IHN1cnZpdmUgc3VjY2Vzc2Z1bCByZXNwb25zZQogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjM2MTg2MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG5ldyBhY3RpdmF0aW9u
IHJlZnVzZXMgdG8gbWFzayBvZmZsaW5lIGNoYW5nZXMgYXdhaXRpbmcgcmVjb25jaWxpYXRpb24K
b2sgMTY1IC0gbmV3IGFjdGl2YXRpb24gcmVmdXNlcyB0byBtYXNrIG9mZmxpbmUgY2hhbmdlcyBh
d2FpdGluZyByZWNvbmNpbGlhdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjY2ODg5MwogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGZsdXNoIHJldGFpbnMgbmV3bHkgZW5xdWV1ZWQg
ZW50cmllcyBldmVuIGlmIHF1ZXVlIGxlbmd0aCBjaGFuZ2VzCm9rIDE2NiAtIGZsdXNoIHJldGFp
bnMgbmV3bHkgZW5xdWV1ZWQgZW50cmllcyBldmVuIGlmIHF1ZXVlIGxlbmd0aCBjaGFuZ2VzCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuNjcyNTg5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogY29tbWl0IGNhcnJpZXMgZ2VuZXJhdGlvbiBmcm9tIHNlcnZlciBsZWFzZQpvayAxNjcgLSBj
b21taXQgY2FycmllcyBnZW5lcmF0aW9uIGZyb20gc2VydmVyIGxlYXNlCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuNjk5OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFjdGl2YXRpb24g
cmVqZWN0cyBtaXNzaW5nIGdlbmVyYXRpb24gZnJvbSBSUEMKb2sgMTY4IC0gYWN0aXZhdGlvbiBy
ZWplY3RzIG1pc3NpbmcgZ2VuZXJhdGlvbiBmcm9tIFJQQwogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjI0MTg4MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFjdGl2YXRpb24gcmVmdXNl
cyBjbG91ZCBzbmFwc2hvdCBpZiBsb2NhbCBlZGl0cyBhcnJpdmUgd2hpbGUgUlBDIGlzIHBlbmRp
bmcKb2sgMTY5IC0gYWN0aXZhdGlvbiByZWZ1c2VzIGNsb3VkIHNuYXBzaG90IGlmIGxvY2FsIGVk
aXRzIGFycml2ZSB3aGlsZSBSUEMgaXMgcGVuZGluZwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI5
NTk4NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFjdGl2YXRpb24gcmVmdXNlcyB0
byBzaWxlbnRseSByZXBsYWNlIGRpc3RpbmN0IGxvY2FsIHNjb3JlIHdpdGggY2xvdWQKb2sgMTcw
IC0gYWN0aXZhdGlvbiByZWZ1c2VzIHRvIHNpbGVudGx5IHJlcGxhY2UgZGlzdGluY3QgbG9jYWwg
c2NvcmUgd2l0aCBjbG91ZAogIC0tLQogIGR1cmF0aW9uX21zOiAyLjI5MDg3OAogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFjdGl2YXRpb24gcmVmdXNlcyB3cml0ZXIgbGVhc2Ugd2l0
aG91dCBzZXJ2ZXItaXNzdWVkIHRva2VuCm9rIDE3MSAtIGFjdGl2YXRpb24gcmVmdXNlcyB3cml0
ZXIgbGVhc2Ugd2l0aG91dCBzZXJ2ZXItaXNzdWVkIHRva2VuCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMjc3MTg2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmV2aXNpb24gemVybyBj
YW5ub3Qgc2lsZW50bHkgb3ZlcndyaXRlIGEgZGlmZmVyZW50IGxvY2FsIGdhbWUKb2sgMTcyIC0g
cmV2aXNpb24gemVybyBjYW5ub3Qgc2lsZW50bHkgb3ZlcndyaXRlIGEgZGlmZmVyZW50IGxvY2Fs
IGdhbWUKICAtLS0KICBkdXJhdGlvbl9tczogMC44MDkwNzQKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiByZXZpc2lvbiBjb25mbGljdCBmcmVlemVzIGFsbCBmdXJ0aGVyIHdyaXRlcyB1
bnRpbCBleHBsaWNpdCByZWNvbmNpbGlhdGlvbgpvayAxNzMgLSByZXZpc2lvbiBjb25mbGljdCBm
cmVlemVzIGFsbCBmdXJ0aGVyIHdyaXRlcyB1bnRpbCBleHBsaWNpdCByZWNvbmNpbGlhdGlvbgog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjQ1NDcwMgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IHdyaXRlciByZXZvY2F0aW9uIGZyZWV6ZXMgc3Vic2VxdWVudCB3cml0ZXMgYW5kIHJldGFp
bnMgYWxsIHF1ZXVlZCBjaGFuZ2VzCm9rIDE3NCAtIHdyaXRlciByZXZvY2F0aW9uIGZyZWV6ZXMg
c3Vic2VxdWVudCB3cml0ZXMgYW5kIHJldGFpbnMgYWxsIHF1ZXVlZCBjaGFuZ2VzCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDUuNTU1OTM3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcGFy
YWxsZWwgYWN0aXZhdGlvbnMgY2Fubm90IGNyZWF0ZSBjb21wZXRpbmcgc2VydmVyIGxlYXNlcwpv
ayAxNzUgLSBwYXJhbGxlbCBhY3RpdmF0aW9ucyBjYW5ub3QgY3JlYXRlIGNvbXBldGluZyBzZXJ2
ZXIgbGVhc2VzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDc4MzA4CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogYSBxdWV1ZWQgZWRpdCBjYW5ub3QgYmUgc2VudCBkdXJpbmcgYWN0aXZh
dGlvbiBiZWZvcmUgbGVhc2UgaXMgYWNjZXB0ZWQKb2sgMTc2IC0gYSBxdWV1ZWQgZWRpdCBjYW5u
b3QgYmUgc2VudCBkdXJpbmcgYWN0aXZhdGlvbiBiZWZvcmUgbGVhc2UgaXMgYWNjZXB0ZWQKICAt
LS0KICBkdXJhdGlvbl9tczogMC4yOTYwMTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBuZXcgYWN0aXZhdGlvbiBjYW5ub3Qgb3ZlcmxhcCBhIG5ldHdvcmsgY29tbWl0Cm9rIDE3NyAt
IG5ldyBhY3RpdmF0aW9uIGNhbm5vdCBvdmVybGFwIGEgbmV0d29yayBjb21taXQKICAtLS0KICBk
dXJhdGlvbl9tczogMC40MTU2OTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdXBh
YmFzZSBwZXJtaXNzaW9uIGRlbmlhbCBmcmVlemVzIHdyaXRlcyBhbmQgcHJlc2VydmVzIHF1ZXVl
ZCBzY29yZQpvayAxNzggLSBTdXBhYmFzZSBwZXJtaXNzaW9uIGRlbmlhbCBmcmVlemVzIHdyaXRl
cyBhbmQgcHJlc2VydmVzIHF1ZXVlZCBzY29yZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQxOTAx
OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHRlbXBvcmFyeSBTdXBhYmFzZSB0cmFu
c3BvcnQgZXJyb3JzIHJlbWFpbiByZXRyeWFibGUKb2sgMTc5IC0gdGVtcG9yYXJ5IFN1cGFiYXNl
IHRyYW5zcG9ydCBlcnJvcnMgcmVtYWluIHJldHJ5YWJsZQogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjM3NjkwNgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvcnJ1cHQgcGVyc2lzdGVu
dCBxdWV1ZSBibG9ja3MgYWN0aXZhdGlvbiB3aXRob3V0IGNvbnRhY3Rpbmcgc2VydmVyCm9rIDE4
MCAtIGNvcnJ1cHQgcGVyc2lzdGVudCBxdWV1ZSBibG9ja3MgYWN0aXZhdGlvbiB3aXRob3V0IGNv
bnRhY3Rpbmcgc2VydmVyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTgxMDQyCiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogcXVldWUgd2l0aCB3cm9uZyBKU09OIHR5cGUgaXMgbmV2ZXIg
b3ZlcndyaXR0ZW4Kb2sgMTgxIC0gcXVldWUgd2l0aCB3cm9uZyBKU09OIHR5cGUgaXMgbmV2ZXIg
b3ZlcndyaXR0ZW4KICAtLS0KICBkdXJhdGlvbl9tczogMC4xODUzNTgKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBmYWlsZWQgcmVhY3RpdmF0aW9uIGludmFsaWRhdGVzIHByZXZpb3Vz
IHdyaXRlciBsZWFzZSBiZWZvcmUgYW5vdGhlciBzY29yZSBjYW4gYmUgc2VudApvayAxODIgLSBm
YWlsZWQgcmVhY3RpdmF0aW9uIGludmFsaWRhdGVzIHByZXZpb3VzIHdyaXRlciBsZWFzZSBiZWZv
cmUgYW5vdGhlciBzY29yZSBjYW4gYmUgc2VudAogIC0tLQogIGR1cmF0aW9uX21zOiAyLjE2NTQy
OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbmZsaWN0aW5nIHJlYWN0aXZhdGlv
biBjYW5ub3QgcmV1c2UgZWFybGllciB3cml0ZXIgdG9rZW4Kb2sgMTgzIC0gY29uZmxpY3Rpbmcg
cmVhY3RpdmF0aW9uIGNhbm5vdCByZXVzZSBlYXJsaWVyIHdyaXRlciB0b2tlbgogIC0tLQogIGR1
cmF0aW9uX21zOiAxLjg3Mjg3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2VydmVy
IHJlc3BvbnNlIGF1dGhvcml6YXRpb24tcmVqZWN0ZWQgZnJlZXplcyBzdWJzZXF1ZW50IGNvbW1p
dHMKb2sgMTg0IC0gc2VydmVyIHJlc3BvbnNlIGF1dGhvcml6YXRpb24tcmVqZWN0ZWQgZnJlZXpl
cyBzdWJzZXF1ZW50IGNvbW1pdHMKICAtLS0KICBkdXJhdGlvbl9tczogMC40NzY2NjUKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzZXJ2ZXIgcmVzcG9uc2Ugc2Vzc2lvbi1yZXZva2Vk
IGZyZWV6ZXMgc3Vic2VxdWVudCBjb21taXRzCm9rIDE4NSAtIHNlcnZlciByZXNwb25zZSBzZXNz
aW9uLXJldm9rZWQgZnJlZXplcyBzdWJzZXF1ZW50IGNvbW1pdHMKICAtLS0KICBkdXJhdGlvbl9t
czogMC41Mzk3NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNlcnZlciByZXNwb25z
ZSBhY2NvdW50LWluYWN0aXZlIGZyZWV6ZXMgc3Vic2VxdWVudCBjb21taXRzCm9rIDE4NiAtIHNl
cnZlciByZXNwb25zZSBhY2NvdW50LWluYWN0aXZlIGZyZWV6ZXMgc3Vic2VxdWVudCBjb21taXRz
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjg4MDYyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogcmVjb3ZlcnkgZXhwb3J0IHByZXNlcnZlcyBvZmZsaW5lIHNjb3JlcyBhbmQgZXhjbHVk
ZXMgc2Vzc2lvbiBzZWNyZXRzCm9rIDE4NyAtIHJlY292ZXJ5IGV4cG9ydCBwcmVzZXJ2ZXMgb2Zm
bGluZSBzY29yZXMgYW5kIGV4Y2x1ZGVzIHNlc3Npb24gc2VjcmV0cwogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjY5MjEzOQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlY292ZXJ5IGV4
cG9ydCBmYWlscyBjbG9zZWQgd2hlbiBiYWNrdXAgZW50cmllcyBhcmUgY29ycnVwdGVkCm9rIDE4
OCAtIHJlY292ZXJ5IGV4cG9ydCBmYWlscyBjbG9zZWQgd2hlbiBiYWNrdXAgZW50cmllcyBhcmUg
Y29ycnVwdGVkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTM0NzMzCiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogdW5leHBlY3RlZCBzdWNjZXNzZnVsIHJldmlzaW9uIGZyZWV6ZXMgd3Jp
dGVzIHJhdGhlciB0aGFuIHJldHJ5aW5nIGFuIGFtYmlndW91cyBjb21taXQKb2sgMTg5IC0gdW5l
eHBlY3RlZCBzdWNjZXNzZnVsIHJldmlzaW9uIGZyZWV6ZXMgd3JpdGVzIHJhdGhlciB0aGFuIHJl
dHJ5aW5nIGFuIGFtYmlndW91cyBjb21taXQKICAtLS0KICBkdXJhdGlvbl9tczogMC4zOTk2OAog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGZsdXNoIHJlZnVzZXMgbWFsZm9ybWVkIHF1
ZXVlZCBzbmFwc2hvdHMgYmVmb3JlIG5ldHdvcmsgd3JpdGUKb2sgMTkwIC0gZmx1c2ggcmVmdXNl
cyBtYWxmb3JtZWQgcXVldWVkIHNuYXBzaG90cyBiZWZvcmUgbmV0d29yayB3cml0ZQogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjMwMTc4MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGZs
dXNoIHJlZnVzZXMgZHVwbGljYXRlIHBlbmRpbmcgSURzIHRvIHByZXZlbnQgZHJvcHBpbmcgdW5z
ZW50IGVkaXRzCm9rIDE5MSAtIGZsdXNoIHJlZnVzZXMgZHVwbGljYXRlIHBlbmRpbmcgSURzIHRv
IHByZXZlbnQgZHJvcHBpbmcgdW5zZW50IGVkaXRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODQ5
NzA2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWNrbm93bGVkZ2VkIFJQQyB3aXRo
IGxvY2FsIHF1ZXVlIGNsZWFudXAgZmFpbHVyZSBtdXN0IG5ldmVyIHJldHJ5IG5ldHdvcmsgY29t
bWl0Cm9rIDE5MiAtIGFja25vd2xlZGdlZCBSUEMgd2l0aCBsb2NhbCBxdWV1ZSBjbGVhbnVwIGZh
aWx1cmUgbXVzdCBuZXZlciByZXRyeSBuZXR3b3JrIGNvbW1pdAogIC0tLQogIGR1cmF0aW9uX21z
OiA0LjUyOTk1OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFjdGl2YXRpb24gcmVq
ZWN0cyBhbWJpZ3VvdXMgd3JpdGUgcGVybWlzc2lvbiBhbmQgbmV2ZXIgZ3JhbnRzIGEgd3JpdGVy
Cm9rIDE5MyAtIGFjdGl2YXRpb24gcmVqZWN0cyBhbWJpZ3VvdXMgd3JpdGUgcGVybWlzc2lvbiBh
bmQgbmV2ZXIgZ3JhbnRzIGEgd3JpdGVyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDEwMDY2CiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWN0aXZhdGlvbiByZWplY3RzIGEgd3JpdGVy
IHRva2VuIGF0dGFjaGVkIHRvIHJlYWQtb25seSBsZWFzZQpvayAxOTQgLSBhY3RpdmF0aW9uIHJl
amVjdHMgYSB3cml0ZXIgdG9rZW4gYXR0YWNoZWQgdG8gcmVhZC1vbmx5IGxlYXNlCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuMjM1NTUzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29u
Y3VycmVudCBzY29yZSBlZGl0cyBxdWV1ZWQgZHVyaW5nIG5ldHdvcmsgY29tbWl0IGFyZSBkcmFp
bmVkCm9rIDE5NSAtIGNvbmN1cnJlbnQgc2NvcmUgZWRpdHMgcXVldWVkIGR1cmluZyBuZXR3b3Jr
IGNvbW1pdCBhcmUgZHJhaW5lZAogIC0tLQogIGR1cmF0aW9uX21zOiA1My40MDMzODIKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBuZXcgZGV2aWNlIHdpdGhvdXQgYSBsb2NhbCBnYW1l
IGNhbiBhZG9wdCBjb21wbGV0ZSBjbG91ZCBnYW1lCm9rIDE5NiAtIG5ldyBkZXZpY2Ugd2l0aG91
dCBhIGxvY2FsIGdhbWUgY2FuIGFkb3B0IGNvbXBsZXRlIGNsb3VkIGdhbWUKICAtLS0KICBkdXJh
dGlvbl9tczogMC40MTA4MDcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBuZXcgZGV2
aWNlIHdpdGhvdXQgbG9jYWwgZ2FtZSBkb2VzIG5vdCBpbnZlbnQgYW4gZW1wdHkgZ2FtZSB3aGVu
IGNsb3VkIGlzIGFic2VudApvayAxOTcgLSBuZXcgZGV2aWNlIHdpdGhvdXQgbG9jYWwgZ2FtZSBk
b2VzIG5vdCBpbnZlbnQgYW4gZW1wdHkgZ2FtZSB3aGVuIGNsb3VkIGlzIGFic2VudAogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjE0OTMyNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNs
b3VkIHByZWZsaWdodCBtaXNtYXRjaCBpcyBhIHRlcm1pbmFsIGNvbmZsaWN0IGFuZCBkb2VzIG5v
dCByZXRyeSB0YWtlb3ZlcgpvayAxOTggLSBjbG91ZCBwcmVmbGlnaHQgbWlzbWF0Y2ggaXMgYSB0
ZXJtaW5hbCBjb25mbGljdCBhbmQgZG9lcyBub3QgcmV0cnkgdGFrZW92ZXIKICAtLS0KICBkdXJh
dGlvbl9tczogMC4yNDk2NDQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjbG91ZCBy
ZXZpc2lvbiBjaGFuZ2UgZHVyaW5nIHRha2VvdmVyIGlzIGEgdGVybWluYWwgY29uZmxpY3QKb2sg
MTk5IC0gY2xvdWQgcmV2aXNpb24gY2hhbmdlIGR1cmluZyB0YWtlb3ZlciBpcyBhIHRlcm1pbmFs
IGNvbmZsaWN0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTgyMDkzCiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogY2xpZW50IHJlamVjdHMgZnJhY3Rpb25hbCBhbmQgdW5zYWZlIHNjb3Jl
cyBiZWZvcmUgYW55IG5ldHdvcmsgd3JpdGUKb2sgMjAwIC0gY2xpZW50IHJlamVjdHMgZnJhY3Rp
b25hbCBhbmQgdW5zYWZlIHNjb3JlcyBiZWZvcmUgYW55IG5ldHdvcmsgd3JpdGUKICAtLS0KICBk
dXJhdGlvbl9tczogMC4zMDExODIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFk
LW9ubHkgcHVzaCBwcmVzZXJ2ZXMgcHJlLWV4aXN0aW5nIHJlY292ZXJ5IHF1ZXVlIHdpdGhvdXQg
YWRkaW5nIGEgbmV3IGVkaXQKb2sgMjAxIC0gcmVhZC1vbmx5IHB1c2ggcHJlc2VydmVzIHByZS1l
eGlzdGluZyByZWNvdmVyeSBxdWV1ZSB3aXRob3V0IGFkZGluZyBhIG5ldyBlZGl0CiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDcuODE1OTg4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3Vw
YWJhc2UganNvbmIga2V5IHJlb3JkZXJpbmcgZG9lcyBub3QgY3JlYXRlIGEgZmFsc2UgZ2FtZSBj
b25mbGljdApvayAyMDIgLSBTdXBhYmFzZSBqc29uYiBrZXkgcmVvcmRlcmluZyBkb2VzIG5vdCBj
cmVhdGUgYSBmYWxzZSBnYW1lIGNvbmZsaWN0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjc4NDU4
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3RydWN0dXJhbCBjb21wYXJpc29uIHN0
aWxsIGRldGVjdHMgc2NvcmUgYW5kIGFycmF5IG9yZGVyIGNoYW5nZXMKb2sgMjAzIC0gc3RydWN0
dXJhbCBjb21wYXJpc29uIHN0aWxsIGRldGVjdHMgc2NvcmUgYW5kIGFycmF5IG9yZGVyIGNoYW5n
ZXMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMjkzMDQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiByb3VuZCBjb3VudCBtdXN0IGJlIGEgYm91bmRlZCBzYWZlIGludGVnZXIsIG1hdGNo
aW5nIHNlcnZlciBTUUwKb2sgMjA0IC0gcm91bmQgY291bnQgbXVzdCBiZSBhIGJvdW5kZWQgc2Fm
ZSBpbnRlZ2VyLCBtYXRjaGluZyBzZXJ2ZXIgU1FMCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNTc3
OTA3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbGVhc2UgcG9sbGluZyB0cmFuc3Bv
cnQgZmFpbHVyZSByZXZva2VzIGxvY2FsIHdyaXRlciB3aXRob3V0IGxvc2luZyBwZW5kaW5nIGRh
dGEKb2sgMjA1IC0gbGVhc2UgcG9sbGluZyB0cmFuc3BvcnQgZmFpbHVyZSByZXZva2VzIGxvY2Fs
IHdyaXRlciB3aXRob3V0IGxvc2luZyBwZW5kaW5nIGRhdGEKICAtLS0KICBkdXJhdGlvbl9tczog
MC4zNzY3MzYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBsYXRlIGxlYXNlIHJlamVj
dGlvbiBmcm9tIGFuIGVhcmxpZXIgYWN0aXZhdGlvbiBjYW5ub3QgcmV2b2tlIGEgcmVwbGFjZW1l
bnQgd3JpdGVyCm9rIDIwNiAtIGxhdGUgbGVhc2UgcmVqZWN0aW9uIGZyb20gYW4gZWFybGllciBh
Y3RpdmF0aW9uIGNhbm5vdCByZXZva2UgYSByZXBsYWNlbWVudCB3cml0ZXIKICAtLS0KICBkdXJh
dGlvbl9tczogMC4zNTExODcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBsYXRlIGxl
YXNlIG5ldHdvcmsgZXJyb3IgZnJvbSBhbiBlYXJsaWVyIGFjdGl2YXRpb24gY2Fubm90IHJldm9r
ZSBhIHJlcGxhY2VtZW50IHdyaXRlcgpvayAyMDcgLSBsYXRlIGxlYXNlIG5ldHdvcmsgZXJyb3Ig
ZnJvbSBhbiBlYXJsaWVyIGFjdGl2YXRpb24gY2Fubm90IHJldm9rZSBhIHJlcGxhY2VtZW50IHdy
aXRlcgogIC0tLQogIGR1cmF0aW9uX21zOiAyLjg2MTkyNAogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IGxlYXNlIHBvbGwgcmVmdXNlcyBhIG5ld2VyIGNsb3VkIHJldmlzaW9uIHdpdGhv
dXQgZGlzY2FyZGluZyBsb2NhbCByZWNvdmVyeSBkYXRhCm9rIDIwOCAtIGxlYXNlIHBvbGwgcmVm
dXNlcyBhIG5ld2VyIGNsb3VkIHJldmlzaW9uIHdpdGhvdXQgZGlzY2FyZGluZyBsb2NhbCByZWNv
dmVyeSBkYXRhCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNzgxMTEyCiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogbmV3LWRldmljZSB0YWtlb3ZlciBwcmVzZXJ2ZXMgZGlmZmVyaW5nIGxv
Y2FsIGdhbWUgaW4gcmVjb3ZlcnkgYmFja3VwCm9rIDIwOSAtIG5ldy1kZXZpY2UgdGFrZW92ZXIg
cHJlc2VydmVzIGRpZmZlcmluZyBsb2NhbCBnYW1lIGluIHJlY292ZXJ5IGJhY2t1cAogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjI3MzQ1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogZmly
c3QgZ2FtZSBib290c3RyYXBzIG9ubHkgd2hlbiBwZWVrIGNvbmZpcm1zIGNsb3VkIGlzIGFic2Vu
dApvayAyMTAgLSBmaXJzdCBnYW1lIGJvb3RzdHJhcHMgb25seSB3aGVuIHBlZWsgY29uZmlybXMg
Y2xvdWQgaXMgYWJzZW50CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjAyMzYzCiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogZm91bmRhdGlvbiBoYXMgc2luZ2xlLWFjdGl2ZS1kZXZpY2Ug
aW5kZXggaW5jb21wYXRpYmxlIHdpdGggbXVsdGktZGV2aWNlIHJlYWRlciBsZWFzZXMKb2sgMjEx
IC0gZm91bmRhdGlvbiBoYXMgc2luZ2xlLWFjdGl2ZS1kZXZpY2UgaW5kZXggaW5jb21wYXRpYmxl
IHdpdGggbXVsdGktZGV2aWNlIHJlYWRlciBsZWFzZXMKICAtLS0KICBkdXJhdGlvbl9tczogNS4x
MDk4NjcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBkcmFmdCBkZXBlbmRzIG9uIGxl
YXNlIGNvbHVtbnMgYWJzZW50IGZyb20gZm91bmRhdGlvbiBtaWdyYXRpb24Kb2sgMjEyIC0gZHJh
ZnQgZGVwZW5kcyBvbiBsZWFzZSBjb2x1bW5zIGFic2VudCBmcm9tIGZvdW5kYXRpb24gbWlncmF0
aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzYyMzM0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogcmVhZC1vbmx5IHByZWZsaWdodCBtdXN0IGJlIGV4dGVuZGVkIHRvIGRldGVjdCBi
bG9ja2luZyB1bmlxdWUgaW5kZXggYW5kIHJlcXVpcmVkIHBhcnRpYWwgaW5kZXgKb2sgMjEzIC0g
cmVhZC1vbmx5IHByZWZsaWdodCBtdXN0IGJlIGV4dGVuZGVkIHRvIGRldGVjdCBibG9ja2luZyB1
bmlxdWUgaW5kZXggYW5kIHJlcXVpcmVkIHBhcnRpYWwgaW5kZXgKICAtLS0KICBkdXJhdGlvbl9t
czogMC4xOTcxNjYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBQQVNTOiBzeW5jIGZvdW5kYXRpb24g
c2NoZW1hIGZhaWwtY2xvc2VkLCBvcmlnaW5hbCBhcHAgdW50b3VjaGVkCiMgU3VidGVzdDogdGVz
dHMvc3luYy1mb3VuZGF0aW9uLnRlc3QuY2pzCm9rIDI4IC0gdGVzdHMvc3luYy1mb3VuZGF0aW9u
LnRlc3QuY2pzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDk1LjI0OTkzOAogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IGZpeHR1cmUgbWF0Y2hlcyBhY3R1YWwgYXBwbGljYXRpb24gZGVmYXVs
dCBzdGF0ZQpvayAyMTUgLSBmaXh0dXJlIG1hdGNoZXMgYWN0dWFsIGFwcGxpY2F0aW9uIGRlZmF1
bHQgc3RhdGUKICAtLS0KICBkdXJhdGlvbl9tczogMTYuOTk1NTc0CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogcmVqZWN0IGludmFsaWQgd2luZCBhc3NpZ25tZW50cyB3aXRob3V0IGNo
YW5naW5nIGNhbGxlciBzdGF0ZQpvayAyMTYgLSByZWplY3QgaW52YWxpZCB3aW5kIGFzc2lnbm1l
bnRzIHdpdGhvdXQgY2hhbmdpbmcgY2FsbGVyIHN0YXRlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
NDcyOTkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWplY3QgbWFsZm9ybWVkIGhp
c3RvcnkgYW5kIHJvdW5kIHdpbmQKb2sgMjE3IC0gcmVqZWN0IG1hbGZvcm1lZCBoaXN0b3J5IGFu
ZCByb3VuZCB3aW5kCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTk1ODg0CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IFVURi04IG92ZXJzaXplZCBoaXN0b3J5IGV2ZW4gd2hl
biBKYXZhU2NyaXB0IFVURi0xNiBsZW5ndGggaXMgdW5kZXIgbGltaXQKb2sgMjE4IC0gcmVqZWN0
IFVURi04IG92ZXJzaXplZCBoaXN0b3J5IGV2ZW4gd2hlbiBKYXZhU2NyaXB0IFVURi0xNiBsZW5n
dGggaXMgdW5kZXIgbGltaXQKICAtLS0KICBkdXJhdGlvbl9tczogMTE4LjM3OTQ2NwogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHByZXNlcnZlIHJlYWxpc3RpYyBIdSwgWmkgTW8sIFF1
YWQsIHBhdHRlcm5zLCBhbmQgaGlzdG9yaWNhbCBzZWF0IG1ldGFkYXRhIGluIGEgY2xvdWQgc25h
cHNob3QKb2sgMjE5IC0gcHJlc2VydmUgcmVhbGlzdGljIEh1LCBaaSBNbywgUXVhZCwgcGF0dGVy
bnMsIGFuZCBoaXN0b3JpY2FsIHNlYXQgbWV0YWRhdGEgaW4gYSBjbG91ZCBzbmFwc2hvdAogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjY3OTExOQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IHJlamVjdCBtYWxmb3JtZWQgaGlzdG9yeSBlbnRyaWVzIHdoaWxlIHByZXNlcnZpbmcgb3JpZ2lu
YWwgc291cmNlIGRhdGEKb2sgMjIwIC0gcmVqZWN0IG1hbGZvcm1lZCBoaXN0b3J5IGVudHJpZXMg
d2hpbGUgcHJlc2VydmluZyBvcmlnaW5hbCBzb3VyY2UgZGF0YQogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjE4NjI1OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlYWxpc3RpYyBtdWx0
aS1yb3VuZCBzY29yZSBzbmFwc2hvdCBzdXJ2aXZlcyBKU09OIHNlcmlhbGl6YXRpb24gd2l0aG91
dCBsb3NpbmcgTWFoam9uZyBoaXN0b3J5Cm9rIDIyMSAtIHJlYWxpc3RpYyBtdWx0aS1yb3VuZCBz
Y29yZSBzbmFwc2hvdCBzdXJ2aXZlcyBKU09OIHNlcmlhbGl6YXRpb24gd2l0aG91dCBsb3Npbmcg
TWFoam9uZyBoaXN0b3J5CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDg3ODQyCiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogZnVsbCByZWNvcmRlZCBoYW5kIHBheWxvYWQgcmV0YWlucyBh
Y3R1YWwgYXBwbGljYXRpb24gaGlzdG9yeSBmaWVsZHMgdGhyb3VnaCBjbG91ZCB2YWxpZGF0aW9u
Cm9rIDIyMiAtIGZ1bGwgcmVjb3JkZWQgaGFuZCBwYXlsb2FkIHJldGFpbnMgYWN0dWFsIGFwcGxp
Y2F0aW9uIGhpc3RvcnkgZmllbGRzIHRocm91Z2ggY2xvdWQgdmFsaWRhdGlvbgogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjM3Nzg1NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlamVj
dCBjb3JydXB0IHNjb3JpbmcgdmVjdG9ycyBhbmQgcXVhZCBjb3VudHMgaW5zaWRlIHJlY29yZGVk
IGhhbmRzCm9rIDIyMyAtIHJlamVjdCBjb3JydXB0IHNjb3JpbmcgdmVjdG9ycyBhbmQgcXVhZCBj
b3VudHMgaW5zaWRlIHJlY29yZGVkIGhhbmRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNTQ3NTcx
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29tcGxldGUgcmVjb3JkZWQtaGFuZCBy
ZWNvdmVyeSBwcmVzZXJ2ZXMgb3B0aW9uYWwgY29tYmluYXRpb24gYW5kIHF1YWQgbWV0YWRhdGEK
b2sgMjI0IC0gY29tcGxldGUgcmVjb3JkZWQtaGFuZCByZWNvdmVyeSBwcmVzZXJ2ZXMgb3B0aW9u
YWwgY29tYmluYXRpb24gYW5kIHF1YWQgbWV0YWRhdGEKICAtLS0KICBkdXJhdGlvbl9tczogMC40
NzEyMTcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWplY3Qgbm9uLWZpbml0ZSBu
ZXN0ZWQgaGlzdG9yeSBtZXRhZGF0YSByYXRoZXIgdGhhbiBzaWxlbnRseSByZXBsYWNpbmcgaXQg
d2l0aCBudWxsCm9rIDIyNSAtIHJlamVjdCBub24tZmluaXRlIG5lc3RlZCBoaXN0b3J5IG1ldGFk
YXRhIHJhdGhlciB0aGFuIHNpbGVudGx5IHJlcGxhY2luZyBpdCB3aXRoIG51bGwKICAtLS0KICBk
dXJhdGlvbl9tczogMC4yOTg4ODgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWpl
Y3Qgc2lsZW50bHkgZGlzY2FyZGVkIG5lc3RlZCBoaXN0b3J5IG1ldGFkYXRhIGFuZCBwcmVzZXJ2
ZSBzb3VyY2UKb2sgMjI2IC0gcmVqZWN0IHNpbGVudGx5IGRpc2NhcmRlZCBuZXN0ZWQgaGlzdG9y
eSBtZXRhZGF0YSBhbmQgcHJlc2VydmUgc291cmNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzIw
NTcxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IGNvcnJ1cHQgaGlzdG9y
aWNhbCB3aW5kIHNuYXBzaG90IHdpdGhvdXQgbW9kaWZ5aW5nIG9yaWdpbmFsIGdhbWUKb2sgMjI3
IC0gcmVqZWN0IGNvcnJ1cHQgaGlzdG9yaWNhbCB3aW5kIHNuYXBzaG90IHdpdGhvdXQgbW9kaWZ5
aW5nIG9yaWdpbmFsIGdhbWUKICAtLS0KICBkdXJhdGlvbl9tczogMC4xOTIzNDgKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWplY3QgaGlzdG9yaWNhbCBwbGF5ZXIgbmFtZXMgZXhj
ZWVkaW5nIHRoZSBzZXJ2ZXItc2lkZSAxMDAtY2hhcmFjdGVyIGxpbWl0Cm9rIDIyOCAtIHJlamVj
dCBoaXN0b3JpY2FsIHBsYXllciBuYW1lcyBleGNlZWRpbmcgdGhlIHNlcnZlci1zaWRlIDEwMC1j
aGFyYWN0ZXIgbGltaXQKICAtLS0KICBkdXJhdGlvbl9tczogMjAuNzQ2NjkyCiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IG1hbGZvcm1lZCBwbGF5ZXItc3BlY2lmaWMgY29t
YmluYXRpb25zIHdpdGhvdXQgbG9zaW5nIHRoZSBzb3VyY2UgaGlzdG9yeQpvayAyMjkgLSByZWpl
Y3QgbWFsZm9ybWVkIHBsYXllci1zcGVjaWZpYyBjb21iaW5hdGlvbnMgd2l0aG91dCBsb3Npbmcg
dGhlIHNvdXJjZSBoaXN0b3J5CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjY1MjU4CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IFVuaWNvZGUgTlVMIGFuZCB1bnBhaXJlZCBz
dXJyb2dhdGVzIGluIGhpc3RvcmljYWwgbWV0YWRhdGEga2V5cyBhbmQgdmFsdWVzCm9rIDIzMCAt
IHJlamVjdCBVbmljb2RlIE5VTCBhbmQgdW5wYWlyZWQgc3Vycm9nYXRlcyBpbiBoaXN0b3JpY2Fs
IG1ldGFkYXRhIGtleXMgYW5kIHZhbHVlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQ3MjY4OQog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFjY2VwdCB2YWxpZCBzdXBwbGVtZW50YXJ5
IFVuaWNvZGUgY2hhcmFjdGVycyBpbiBoaXN0b3JpY2FsIG1ldGFkYXRhCm9rIDIzMSAtIGFjY2Vw
dCB2YWxpZCBzdXBwbGVtZW50YXJ5IFVuaWNvZGUgY2hhcmFjdGVycyBpbiBoaXN0b3JpY2FsIG1l
dGFkYXRhCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTg4MzQyCiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogcmVqZWN0IG5vbi1KU09OIGxlZ2FjeSBvYmplY3RzIHJhdGhlciB0aGFuIHNp
bGVudGx5IGVyYXNpbmcgaGlzdG9yeQpvayAyMzIgLSByZWplY3Qgbm9uLUpTT04gbGVnYWN5IG9i
amVjdHMgcmF0aGVyIHRoYW4gc2lsZW50bHkgZXJhc2luZyBoaXN0b3J5CiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuNjAwMjQxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb3B0aW9uYWwg
aGlzdG9yeSBwbGF5ZXIgaW5kZXhlcyBhY2NlcHQgbnVsbCwgYnV0IG5ldmVyIGludmFsaWQgdmFs
dWVzCm9rIDIzMyAtIG9wdGlvbmFsIGhpc3RvcnkgcGxheWVyIGluZGV4ZXMgYWNjZXB0IG51bGws
IGJ1dCBuZXZlciBpbnZhbGlkIHZhbHVlcwogIC0tLQogIGR1cmF0aW9uX21zOiAxNC44MTA4MzYK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBoaXN0b3J5IHVua25vd24gZmllbGRzIHN1
cnZpdmUgSlNPTiByb3VuZHRyaXAgd2hpbGUgbWFsZm9ybWVkIGtub3duIHZlY3RvcnMgYXJlIHJl
amVjdGVkCm9rIDIzNCAtIGhpc3RvcnkgdW5rbm93biBmaWVsZHMgc3Vydml2ZSBKU09OIHJvdW5k
dHJpcCB3aGlsZSBtYWxmb3JtZWQga25vd24gdmVjdG9ycyBhcmUgcmVqZWN0ZWQKICAtLS0KICBk
dXJhdGlvbl9tczogMC41MjU4OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlamVj
dCBoaXN0b3J5IG1ldGFkYXRhIHRoYXQgSlNPTiB3b3VsZCBzaWxlbnRseSB0cmFuc2Zvcm0Kb2sg
MjM1IC0gcmVqZWN0IGhpc3RvcnkgbWV0YWRhdGEgdGhhdCBKU09OIHdvdWxkIHNpbGVudGx5IHRy
YW5zZm9ybQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI4MzMwNQogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IHJlamVjdCBzcGFyc2UgaGlzdG9yeSBtZXRhZGF0YSBhcnJheXMgYW5kIG5v
bi1pbmRleCBhcnJheSBwcm9wZXJ0aWVzIGJlZm9yZSBKU09OIHNuYXBzaG90Cm9rIDIzNiAtIHJl
amVjdCBzcGFyc2UgaGlzdG9yeSBtZXRhZGF0YSBhcnJheXMgYW5kIG5vbi1pbmRleCBhcnJheSBw
cm9wZXJ0aWVzIGJlZm9yZSBKU09OIHNuYXBzaG90CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzA3
MzgxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IG1hbGZvcm1lZCBVbmlj
b2RlIGJlZm9yZSBTdXBhYmFzZSBqc29uYiBjb252ZXJzaW9uIHdoaWxlIHJldGFpbmluZyB2YWxp
ZCBlbW9qaQpvayAyMzcgLSByZWplY3QgbWFsZm9ybWVkIFVuaWNvZGUgYmVmb3JlIFN1cGFiYXNl
IGpzb25iIGNvbnZlcnNpb24gd2hpbGUgcmV0YWluaW5nIHZhbGlkIGVtb2ppCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuNDUzMDIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWplY3Qg
dW5wYWlyZWQgVW5pY29kZSBzdXJyb2dhdGVzIGluIG5lc3RlZCBoaXN0b3J5IG9iamVjdCBrZXlz
Cm9rIDIzOCAtIHJlamVjdCB1bnBhaXJlZCBVbmljb2RlIHN1cnJvZ2F0ZXMgaW4gbmVzdGVkIGhp
c3Rvcnkgb2JqZWN0IGtleXMKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMzI5OTkKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBVbmljb2RlIG5hbWUgbGltaXRzIGNvdW50IGNvZGUgcG9p
bnRzIGxpa2UgUG9zdGdyZVNRTCBsZW5ndGgsIG5vdCBVVEYtMTYgdW5pdHMKb2sgMjM5IC0gVW5p
Y29kZSBuYW1lIGxpbWl0cyBjb3VudCBjb2RlIHBvaW50cyBsaWtlIFBvc3RncmVTUUwgbGVuZ3Ro
LCBub3QgVVRGLTE2IHVuaXRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNjIwMjExCiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IFBvc3RncmVTUUwtaW5jb21wYXRpYmxlIFVu
aWNvZGUgTlVMIGluIHZhbHVlcyBhbmQgb2JqZWN0IGtleXMKb2sgMjQwIC0gcmVqZWN0IFBvc3Rn
cmVTUUwtaW5jb21wYXRpYmxlIFVuaWNvZGUgTlVMIGluIHZhbHVlcyBhbmQgb2JqZWN0IGtleXMK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4zMjUyNzgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBzdHJ1Y3R1cmFsIGNvbXBhcmlzb24gcHJlc2VydmVzIEpTT04ga2V5cyBuYW1lZCBfX3By
b3RvX18Kb2sgMjQxIC0gc3RydWN0dXJhbCBjb21wYXJpc29uIHByZXNlcnZlcyBKU09OIGtleXMg
bmFtZWQgX19wcm90b19fCiAgLS0tCiAgZHVyYXRpb25fbXM6IDguNTc3MDcxCiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogUG9zdGdyZVNRTCBqc29uYiBzcGFjaW5nIGNhbm5vdCBwdXNo
IG5lYXItbGltaXQgY29tcGFjdCBKU09OIG92ZXIgMk1CCm9rIDI0MiAtIFBvc3RncmVTUUwganNv
bmIgc3BhY2luZyBjYW5ub3QgcHVzaCBuZWFyLWxpbWl0IGNvbXBhY3QgSlNPTiBvdmVyIDJNQgog
IC0tLQogIGR1cmF0aW9uX21zOiA3NjguMDE0MDkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBoaXN0b3JpY2FsIHJvdW5kIHdpbmQgbWF0Y2hlcyBhY3R1YWwgc2F2ZWQgaGFuZCBmb3Jt
YXQgYW5kIHJlamVjdHMgaW52YWxpZCB3aW5kcwpvayAyNDMgLSBoaXN0b3JpY2FsIHJvdW5kIHdp
bmQgbWF0Y2hlcyBhY3R1YWwgc2F2ZWQgaGFuZCBmb3JtYXQgYW5kIHJlamVjdHMgaW52YWxpZCB3
aW5kcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjYxODUxOAogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IHJlamVjdHMgZ2FtZSByb290IHRyYW5zZm9ybWVkIHRvIEpTT04gbnVsbCBieSB0
b0pTT04gYmVmb3JlIFJQQwpvayAyNDQgLSByZWplY3RzIGdhbWUgcm9vdCB0cmFuc2Zvcm1lZCB0
byBKU09OIG51bGwgYnkgdG9KU09OIGJlZm9yZSBSUEMKICAtLS0KICBkdXJhdGlvbl9tczogMS4w
NjcwMjEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWplY3RzIGdhbWUgcm9vdCB0
cmFuc2Zvcm1lZCB0byBKU09OIGFycmF5IGJ5IHRvSlNPTiBiZWZvcmUgUlBDCm9rIDI0NSAtIHJl
amVjdHMgZ2FtZSByb290IHRyYW5zZm9ybWVkIHRvIEpTT04gYXJyYXkgYnkgdG9KU09OIGJlZm9y
ZSBSUEMKICAtLS0KICBkdXJhdGlvbl9tczogMC4zMDE2NzMKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBhY2NlcHRzIG9yZGluYXJ5IEpTT04gb2JqZWN0IHJvb3QgYW5kIHByZXNlcnZl
cyBwYXlsb2FkCm9rIDI0NiAtIGFjY2VwdHMgb3JkaW5hcnkgSlNPTiBvYmplY3Qgcm9vdCBhbmQg
cHJlc2VydmVzIHBheWxvYWQKICAtLS0KICBkdXJhdGlvbl9tczogMC43Mjg0MzMKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzZXJ2ZXIgcmV2b2NhdGlvbiBkaXNhYmxlcyB3cml0ZXIg
d2l0aG91dCBjbGVhcmluZyBiYWNrdXBzCm9rIDI0NyAtIHNlcnZlciByZXZvY2F0aW9uIGRpc2Fi
bGVzIHdyaXRlciB3aXRob3V0IGNsZWFyaW5nIGJhY2t1cHMKICAtLS0KICBkdXJhdGlvbl9tczog
Mi4zOTQyNzMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiB3cml0ZXIgbGVhc2UgZG93
bmdyYWRlZCB0byByZWFkZXIgaXMgbmV2ZXIgYXV0b21hdGljYWxseSByZXN0b3JlZApvayAyNDgg
LSB3cml0ZXIgbGVhc2UgZG93bmdyYWRlZCB0byByZWFkZXIgaXMgbmV2ZXIgYXV0b21hdGljYWxs
eSByZXN0b3JlZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQ1NDcwMwogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IG5ldHdvcmsgaW50ZXJydXB0aW9uIGRvZXMgbm90IHNpbGVudGx5IHJl
dm9rZSBvciByZW5ldyB3cml0ZXIKb2sgMjQ5IC0gbmV0d29yayBpbnRlcnJ1cHRpb24gZG9lcyBu
b3Qgc2lsZW50bHkgcmV2b2tlIG9yIHJlbmV3IHdyaXRlcgogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjQyNzU2MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN5bmMgbW9kdWxlcyBsb2Fk
ZWQgYmVmb3JlIG1haW4gYXV0aCBjb2RlCm9rIDI1MCAtIHN5bmMgbW9kdWxlcyBsb2FkZWQgYmVm
b3JlIG1haW4gYXV0aCBjb2RlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMDEzNTUxCiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3luYyByZW1haW5zIGZhaWwtY2xvc2VkIGFuZCBjbG91
ZCBhZG9wdGlvbiByZXF1aXJlcyBzYWZlIGxvY2FsIHBlcnNpc3RlbmNlCm9rIDI1MSAtIHN5bmMg
cmVtYWlucyBmYWlsLWNsb3NlZCBhbmQgY2xvdWQgYWRvcHRpb24gcmVxdWlyZXMgc2FmZSBsb2Nh
bCBwZXJzaXN0ZW5jZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjc3MjEzOQogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IGV4aXN0aW5nIHNhdmUgd3JpdGVzIGxvY2FsbHkgYmVmb3JlIGFu
eSBvcHRpb25hbCBjbG91ZCBzZW5kCm9rIDI1MiAtIGV4aXN0aW5nIHNhdmUgd3JpdGVzIGxvY2Fs
bHkgYmVmb3JlIGFueSBvcHRpb25hbCBjbG91ZCBzZW5kCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEu
Nzg3MjIyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbG9nb3V0IHJlc2V0cyBicmlk
Z2UgYW5kIGNhbm5vdCBsZWF2ZSBzdGFsZSBhY3RpdmUgc2Vzc2lvbgpvayAyNTMgLSBsb2dvdXQg
cmVzZXRzIGJyaWRnZSBhbmQgY2Fubm90IGxlYXZlIHN0YWxlIGFjdGl2ZSBzZXNzaW9uCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMTk3MjE2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
Y2xvdWQtZW5hYmxlZCBtb2RlIHJlZnVzZXMgbG9jYWwgc2NvcmUgcGVyc2lzdGVuY2Ugd2l0aG91
dCBhbiBhY3RpdmUgd3JpdGVyIGxlYXNlCm9rIDI1NCAtIGNsb3VkLWVuYWJsZWQgbW9kZSByZWZ1
c2VzIGxvY2FsIHNjb3JlIHBlcnNpc3RlbmNlIHdpdGhvdXQgYW4gYWN0aXZlIHdyaXRlciBsZWFz
ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM1MjgyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogYSB2YW5pc2hlZCBjbG91ZCBnYW1lIG5ldmVyIHNpbGVudGx5IGJvb3RzdHJhcHMgYSBu
ZXcgZ2FtZSBhZnRlciBwcmVmbGlnaHQKb2sgMjU1IC0gYSB2YW5pc2hlZCBjbG91ZCBnYW1lIG5l
dmVyIHNpbGVudGx5IGJvb3RzdHJhcHMgYSBuZXcgZ2FtZSBhZnRlciBwcmVmbGlnaHQKICAtLS0K
ICBkdXJhdGlvbl9tczogMS4yMDM2OTcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBw
ZWVrIFJQQyBleGlzdHMgYW5kIHJlcXVpcmVzIGF1dGhlbnRpY2F0ZWQgY2FsbGVyCm9rIDI1NiAt
IHBlZWsgUlBDIGV4aXN0cyBhbmQgcmVxdWlyZXMgYXV0aGVudGljYXRlZCBjYWxsZXIKICAtLS0K
ICBkdXJhdGlvbl9tczogMC45NzcyMjYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBw
ZWVrIHJlZnVzZXMgYmFubmVkLCBkZWxldGVkLCBvciBvbGRlciBzY29yZWtlZXBlciBsb2dpbgpv
ayAyNTcgLSBwZWVrIHJlZnVzZXMgYmFubmVkLCBkZWxldGVkLCBvciBvbGRlciBzY29yZWtlZXBl
ciBsb2dpbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE4NTk2OQogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IHBlZWsgcmV0dXJucyByZXZpc2lvbiB3aXRob3V0IGFueSBkYXRhIG11dGF0
aW9uCm9rIDI1OCAtIHBlZWsgcmV0dXJucyByZXZpc2lvbiB3aXRob3V0IGFueSBkYXRhIG11dGF0
aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjM0ODEzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogcGVlayBjYWxsYWJsZSBieSBhdXRoZW50aWNhdGVkIG9ubHkKb2sgMjU5IC0gcGVl
ayBjYWxsYWJsZSBieSBhdXRoZW50aWNhdGVkIG9ubHkKICAtLS0KICBkdXJhdGlvbl9tczogMC4x
MTgyMjcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBkcmFmdCBmYWlscyBjbG9zZWQg
YmVmb3JlIGJlZ2lubmluZyBhbnkgc2NoZW1hIHRyYW5zYWN0aW9uCm9rIDI2MCAtIGRyYWZ0IGZh
aWxzIGNsb3NlZCBiZWZvcmUgYmVnaW5uaW5nIGFueSBzY2hlbWEgdHJhbnNhY3Rpb24KICAtLS0K
ICBkdXJhdGlvbl9tczogMC44ODI0MjQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBz
aXggUlBDIGVudHJ5cG9pbnRzIGFyZSBwcmVzZW50IGV4YWN0bHkgb25jZQpvayAyNjEgLSBzaXgg
UlBDIGVudHJ5cG9pbnRzIGFyZSBwcmVzZW50IGV4YWN0bHkgb25jZQogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjQyODA3MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFsbCBSUEMgZW50
cnlwb2ludHMgZXhwbGljaXRseSBjb25zdHJhaW4gc2VhcmNoX3BhdGgKb2sgMjYyIC0gYWxsIFJQ
QyBlbnRyeXBvaW50cyBleHBsaWNpdGx5IGNvbnN0cmFpbiBzZWFyY2hfcGF0aAogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjI1Nzc1NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFsbCBz
aXggUlBDcyBleHBsaWNpdGx5IHJldm9rZSBhbm9ueW1vdXMgYW5kIHB1YmxpYyBleGVjdXRpb24K
b2sgMjYzIC0gYWxsIHNpeCBSUENzIGV4cGxpY2l0bHkgcmV2b2tlIGFub255bW91cyBhbmQgcHVi
bGljIGV4ZWN1dGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI1MDU0NgogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IHdyaXRlciBvcGVuIGFuZCBjb21taXQgc2VyaWFsaXplIG9uIGxv
Y2tlZCBhY2NvdW50IHJvdwpvayAyNjQgLSB3cml0ZXIgb3BlbiBhbmQgY29tbWl0IHNlcmlhbGl6
ZSBvbiBsb2NrZWQgYWNjb3VudCByb3cKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMzcxODUKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFkLW9ubHkgcHJlZmxpZ2h0IGNoZWNrcyBi
bG9ja2luZyBzaW5nbGUtZGV2aWNlIGluZGV4IHdpdGhvdXQgbW9kaWZ5aW5nIHNjaGVtYQpvayAy
NjUgLSByZWFkLW9ubHkgcHJlZmxpZ2h0IGNoZWNrcyBibG9ja2luZyBzaW5nbGUtZGV2aWNlIGlu
ZGV4IHdpdGhvdXQgbW9kaWZ5aW5nIHNjaGVtYQogIC0tLQogIGR1cmF0aW9uX21zOiAxLjExOTkw
MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHByZWZsaWdodCBjaGVja3MgcmVxdWly
ZWQgY3VycmVudC1nYW1lIHVuaXF1ZW5lc3MgYW5kIHNlc3Npb24gbG9va3VwIGluZGV4ZXMKb2sg
MjY2IC0gcHJlZmxpZ2h0IGNoZWNrcyByZXF1aXJlZCBjdXJyZW50LWdhbWUgdW5pcXVlbmVzcyBh
bmQgc2Vzc2lvbiBsb29rdXAgaW5kZXhlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE4MjQwMwog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHByZWZsaWdodCByZXR1cm5zIGluZGV4IHJl
c3VsdHMgd2l0aCBleGlzdGluZyB0YWJsZSBjb2x1bW4gZnVuY3Rpb24gYW5kIFJQQyBkaWFnbm9z
dGljcwpvayAyNjcgLSBwcmVmbGlnaHQgcmV0dXJucyBpbmRleCByZXN1bHRzIHdpdGggZXhpc3Rp
bmcgdGFibGUgY29sdW1uIGZ1bmN0aW9uIGFuZCBSUEMgZGlhZ25vc3RpY3MKICAtLS0KICBkdXJh
dGlvbl9tczogMC4yMTQ5MjMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBwcmVmbGln
aHQgaXMgcmVhZC1vbmx5IGFuZCBuZXZlciBydW5zIERETCBvciB3cml0ZXMKb2sgMjY4IC0gcHJl
ZmxpZ2h0IGlzIHJlYWQtb25seSBhbmQgbmV2ZXIgcnVucyBEREwgb3Igd3JpdGVzCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDEuMDg5NDM1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcHJl
ZmxpZ2h0IGNoZWNrcyBhbGwgZm91ciB0YWJsZXMsIFJMUywgcHJpdmlsZWdlcywgYW5kIHJlcXVp
cmVkIGNvbHVtbnMKb2sgMjY5IC0gcHJlZmxpZ2h0IGNoZWNrcyBhbGwgZm91ciB0YWJsZXMsIFJM
UywgcHJpdmlsZWdlcywgYW5kIHJlcXVpcmVkIGNvbHVtbnMKICAtLS0KICBkdXJhdGlvbl9tczog
MC4yMjg2NjMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBwcmVmbGlnaHQgcmVqZWN0
cyB3cm9uZyBnYW1lIGluIFJQQyByZXNwb25zZSBldmVuIGlmIHNlcnZlciBlcnJvbmVvdXNseSBh
Y2NlcHRzIHRha2VvdmVyCm9rIDI3MCAtIHByZWZsaWdodCByZWplY3RzIHdyb25nIGdhbWUgaW4g
UlBDIHJlc3BvbnNlIGV2ZW4gaWYgc2VydmVyIGVycm9uZW91c2x5IGFjY2VwdHMgdGFrZW92ZXIK
ICAtLS0KICBkdXJhdGlvbl9tczogMi4zNDQ4OTkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBwcmVmbGlnaHQgcmVqZWN0cyB3cm9uZyByZXZpc2lvbiBpbiBSUEMgcmVzcG9uc2UgZXZl
biBpZiBzZXJ2ZXIgZXJyb25lb3VzbHkgYWNjZXB0cyB0YWtlb3ZlcgpvayAyNzEgLSBwcmVmbGln
aHQgcmVqZWN0cyB3cm9uZyByZXZpc2lvbiBpbiBSUEMgcmVzcG9uc2UgZXZlbiBpZiBzZXJ2ZXIg
ZXJyb25lb3VzbHkgYWNjZXB0cyB0YWtlb3ZlcgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE4NzM1
MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHB1c2ggZHJhaW5zIGVkaXRzIGFycml2
aW5nIGR1cmluZyB0d28gc3VjY2Vzc2l2ZSBuZXR3b3JrIGNvbW1pdHMKb2sgMjcyIC0gcHVzaCBk
cmFpbnMgZWRpdHMgYXJyaXZpbmcgZHVyaW5nIHR3byBzdWNjZXNzaXZlIG5ldHdvcmsgY29tbWl0
cwogIC0tLQogIGR1cmF0aW9uX21zOiA5LjE4Njg0NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IHJlYWQgUlBDIGlzIHJlc3RyaWN0ZWQgdG8gdGhlIGV4YWN0IGFjdGl2ZSBhdXRoIHNl
c3Npb24gYW5kIGRldmljZQpvayAyNzMgLSByZWFkIFJQQyBpcyByZXN0cmljdGVkIHRvIHRoZSBl
eGFjdCBhY3RpdmUgYXV0aCBzZXNzaW9uIGFuZCBkZXZpY2UKICAtLS0KICBkdXJhdGlvbl9tczog
MC45NzA3NDcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFkIFJQQyByZWplY3Rz
IGluYWN0aXZlIGFuZCBzdXBlcnNlZGVkIHNjb3Jla2VlcGVyIGFjY291bnRzCm9rIDI3NCAtIHJl
YWQgUlBDIHJlamVjdHMgaW5hY3RpdmUgYW5kIHN1cGVyc2VkZWQgc2NvcmVrZWVwZXIgYWNjb3Vu
dHMKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMjE1NjIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiByZWFkIFJQQyBuZXZlciBncmFudHMgYSB3cml0ZXIgbGVhc2Ugb3IgbXV0YXRlcyBj
bG91ZCBzdGF0ZQpvayAyNzUgLSByZWFkIFJQQyBuZXZlciBncmFudHMgYSB3cml0ZXIgbGVhc2Ug
b3IgbXV0YXRlcyBjbG91ZCBzdGF0ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM2MTM1MgogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNsb3VkIHJlYWQgb25seSByZXBvcnRzIHdyaXRl
ciBjYXBhYmlsaXR5IGZvciBhIHRva2VuLWJhY2tlZCB3cml0ZXIgbGVhc2UKb2sgMjc2IC0gY2xv
dWQgcmVhZCBvbmx5IHJlcG9ydHMgd3JpdGVyIGNhcGFiaWxpdHkgZm9yIGEgdG9rZW4tYmFja2Vk
IHdyaXRlciBsZWFzZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjk5MTk0OQogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IGNsb3VkIHJlYWQgcmVxdWlyZXMgY3VycmVudCBhY3RpdmUgbm9u
cmV2b2tlZCBhdXRoLWJvdW5kIGxlYXNlCm9rIDI3NyAtIGNsb3VkIHJlYWQgcmVxdWlyZXMgY3Vy
cmVudCBhY3RpdmUgbm9ucmV2b2tlZCBhdXRoLWJvdW5kIGxlYXNlCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMTk1NzEzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZGVyIGVucm9s
bG1lbnQgY2Fubm90IGdyYW50IHdyaXRlciByaWdodHMgb3Igd3JpdGVyIHRva2VuCm9rIDI3OCAt
IHJlYWRlciBlbnJvbGxtZW50IGNhbm5vdCBncmFudCB3cml0ZXIgcmlnaHRzIG9yIHdyaXRlciB0
b2tlbgogIC0tLQogIGR1cmF0aW9uX21zOiAxMy42NjU2NTcKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiByZWFkZXIgZW5yb2xsbWVudCBpcyByZXN0cmljdGVkIHRvIGFkbWluIG9yIGVu
YWJsZWQgbXVsdGktZGV2aWNlIGFjY291bnRzCm9rIDI3OSAtIHJlYWRlciBlbnJvbGxtZW50IGlz
IHJlc3RyaWN0ZWQgdG8gYWRtaW4gb3IgZW5hYmxlZCBtdWx0aS1kZXZpY2UgYWNjb3VudHMKICAt
LS0KICBkdXJhdGlvbl9tczogMC4xNjMxNDUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBhZGFwdGVyIHVzZXMgc2VwYXJhdGUgcmVhZGVyIFJQQywgbmV2ZXIgd3JpdGVyIHRha2VvdmVy
Cm9rIDI4MCAtIGFkYXB0ZXIgdXNlcyBzZXBhcmF0ZSByZWFkZXIgUlBDLCBuZXZlciB3cml0ZXIg
dGFrZW92ZXIKICAtLS0KICBkdXJhdGlvbl9tczogMS4xNzA3MjcKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiByZWFkIHJlamVjdHMgZXhpc3RpbmcgcmVhZGVyIGxlYXNlIHdoZW4gbXVs
dGktZGV2aWNlIHBlcm1pc3Npb24gaXMgcmV2b2tlZApvayAyODEgLSByZWFkIHJlamVjdHMgZXhp
c3RpbmcgcmVhZGVyIGxlYXNlIHdoZW4gbXVsdGktZGV2aWNlIHBlcm1pc3Npb24gaXMgcmV2b2tl
ZAogIC0tLQogIGR1cmF0aW9uX21zOiAxLjE4NTg2OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IHdyaXRlciByZW1haW5zIGVsaWdpYmxlIGZvciByZWFkIGFmdGVyIG11bHRpLWRldmlj
ZSBwZXJtaXNzaW9uIGlzIGRpc2FibGVkCm9rIDI4MiAtIHdyaXRlciByZW1haW5zIGVsaWdpYmxl
IGZvciByZWFkIGFmdGVyIG11bHRpLWRldmljZSBwZXJtaXNzaW9uIGlzIGRpc2FibGVkCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMjMwNTk3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
cGVlayBlbmZvcmNlcyBKV1QtYm91bmQgYWN0aXZlIHNlc3Npb24gYW5kIGFjY291bnQgc3RhdHVz
Cm9rIDI4MyAtIHBlZWsgZW5mb3JjZXMgSldULWJvdW5kIGFjdGl2ZSBzZXNzaW9uIGFuZCBhY2Nv
dW50IHN0YXR1cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjc0MDgxMgogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IHBlZWsgb25seSBzZWxlY3RzIGdhbWUgc3RhdGUgYW5kIG5ldmVyIHdy
aXRlcy9yZXZva2VzIGxlYXNlcwpvayAyODQgLSBwZWVrIG9ubHkgc2VsZWN0cyBnYW1lIHN0YXRl
IGFuZCBuZXZlciB3cml0ZXMvcmV2b2tlcyBsZWFzZXMKICAtLS0KICBkdXJhdGlvbl9tczogMC4y
OTE3MTgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBwZWVrIGxpbWl0cyBSUEMgZXhl
Y3V0aW9uIHRvIGF1dGhlbnRpY2F0ZWQgdXNlcnMKb2sgMjg1IC0gcGVlayBsaW1pdHMgUlBDIGV4
ZWN1dGlvbiB0byBhdXRoZW50aWNhdGVkIHVzZXJzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTUx
Nzc3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWRhcHRlciBleHBvc2VzIHJlYWQt
b25seSBwZWVrIHdpdGhvdXQgd3JpdGVyIHRva2VuCm9rIDI4NiAtIGFkYXB0ZXIgZXhwb3NlcyBy
ZWFkLW9ubHkgcGVlayB3aXRob3V0IHdyaXRlciB0b2tlbgogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjYyMjk1NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpbmdsZS1kZXZpY2Ugc2Nv
cmVrZWVwZXIgb2xkIGxvZ2luIGNhbm5vdCBwZWVrIGFjdGl2ZSBnYW1lCm9rIDI4NyAtIHNpbmds
ZS1kZXZpY2Ugc2NvcmVrZWVwZXIgb2xkIGxvZ2luIGNhbm5vdCBwZWVrIGFjdGl2ZSBnYW1lCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMTIwMTYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiByZWFsIHJlY29yZGVkIGhhbmQgZmllbGRzIGluIGFwcCBhcmUgcHJlc2VydmVkIGJ5IHN5bmMg
dmFsaWRhdGlvbgpvayAyODggLSByZWFsIHJlY29yZGVkIGhhbmQgZmllbGRzIGluIGFwcCBhcmUg
cHJlc2VydmVkIGJ5IHN5bmMgdmFsaWRhdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiA1LjE1NjE1
OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlY29yZCByZXN0b3JlcyBzY29yZSBh
bmQgZnVsbCBoaXN0b3J5IGlmIGR1cmFibGUgc2F2ZSBvciBzeW5jIGVucXVldWUgZmFpbHMKb2sg
Mjg5IC0gcmVjb3JkIHJlc3RvcmVzIHNjb3JlIGFuZCBmdWxsIGhpc3RvcnkgaWYgZHVyYWJsZSBz
YXZlIG9yIHN5bmMgZW5xdWV1ZSBmYWlscwogIC0tLQogIGR1cmF0aW9uX21zOiAxLjA3MzI2CiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbWFoam9uZ19zeW5jX29wZW46IHJlc3RyaWN0
ZWQgU0VDVVJJVFkgREVGSU5FUiBhbmQgYXV0aGVudGljYXRlZC1vbmx5IEVYRUNVVEUKb2sgMjkw
IC0gbWFoam9uZ19zeW5jX29wZW46IHJlc3RyaWN0ZWQgU0VDVVJJVFkgREVGSU5FUiBhbmQgYXV0
aGVudGljYXRlZC1vbmx5IEVYRUNVVEUKICAtLS0KICBkdXJhdGlvbl9tczogMC44MDMzMjYKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBtYWhqb25nX3N5bmNfY29tbWl0OiByZXN0cmlj
dGVkIFNFQ1VSSVRZIERFRklORVIgYW5kIGF1dGhlbnRpY2F0ZWQtb25seSBFWEVDVVRFCm9rIDI5
MSAtIG1haGpvbmdfc3luY19jb21taXQ6IHJlc3RyaWN0ZWQgU0VDVVJJVFkgREVGSU5FUiBhbmQg
YXV0aGVudGljYXRlZC1vbmx5IEVYRUNVVEUKICAtLS0KICBkdXJhdGlvbl9tczogMC4xODcxMTEK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBtYWhqb25nX3N5bmNfb3Blbl9yZWFkZXI6
IHJlc3RyaWN0ZWQgU0VDVVJJVFkgREVGSU5FUiBhbmQgYXV0aGVudGljYXRlZC1vbmx5IEVYRUNV
VEUKb2sgMjkyIC0gbWFoam9uZ19zeW5jX29wZW5fcmVhZGVyOiByZXN0cmljdGVkIFNFQ1VSSVRZ
IERFRklORVIgYW5kIGF1dGhlbnRpY2F0ZWQtb25seSBFWEVDVVRFCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMDkxMzU3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbWFoam9uZ19zeW5j
X3BlZWs6IHJlc3RyaWN0ZWQgU0VDVVJJVFkgREVGSU5FUiBhbmQgYXV0aGVudGljYXRlZC1vbmx5
IEVYRUNVVEUKb2sgMjkzIC0gbWFoam9uZ19zeW5jX3BlZWs6IHJlc3RyaWN0ZWQgU0VDVVJJVFkg
REVGSU5FUiBhbmQgYXV0aGVudGljYXRlZC1vbmx5IEVYRUNVVEUKICAtLS0KICBkdXJhdGlvbl9t
czogMC4wODQ1NzcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBtYWhqb25nX3N5bmNf
cmVhZDogcmVzdHJpY3RlZCBTRUNVUklUWSBERUZJTkVSIGFuZCBhdXRoZW50aWNhdGVkLW9ubHkg
RVhFQ1VURQpvayAyOTQgLSBtYWhqb25nX3N5bmNfcmVhZDogcmVzdHJpY3RlZCBTRUNVUklUWSBE
RUZJTkVSIGFuZCBhdXRoZW50aWNhdGVkLW9ubHkgRVhFQ1VURQogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjA5NzE2NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG1haGpvbmdfc3luY19s
ZWFzZV9zdGF0dXM6IHJlc3RyaWN0ZWQgU0VDVVJJVFkgREVGSU5FUiBhbmQgYXV0aGVudGljYXRl
ZC1vbmx5IEVYRUNVVEUKb2sgMjk1IC0gbWFoam9uZ19zeW5jX2xlYXNlX3N0YXR1czogcmVzdHJp
Y3RlZCBTRUNVUklUWSBERUZJTkVSIGFuZCBhdXRoZW50aWNhdGVkLW9ubHkgRVhFQ1VURQogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjA3MDg4NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IGRyYWZ0IHN0YXlzIGJsb2NrZWQgZnJvbSBwcm9kdWN0aW9uIGV4ZWN1dGlvbgpvayAyOTYgLSBk
cmFmdCBzdGF5cyBibG9ja2VkIGZyb20gcHJvZHVjdGlvbiBleGVjdXRpb24KICAtLS0KICBkdXJh
dGlvbl9tczogMC40NTgzMDcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhbGwgc2l4
IFJQQyBlbnRyeXBvaW50cyBhcmUgZXhwbGljaXRseSBhdXRoZW50aWNhdGVkLW9ubHksIG5vdCBh
bm9uIG9yIFBVQkxJQwpvayAyOTcgLSBhbGwgc2l4IFJQQyBlbnRyeXBvaW50cyBhcmUgZXhwbGlj
aXRseSBhdXRoZW50aWNhdGVkLW9ubHksIG5vdCBhbm9uIG9yIFBVQkxJQwogIC0tLQogIGR1cmF0
aW9uX21zOiAxLjMzMzc5MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFsbCBzaXgg
UlBDcyBiaW5kIGlkZW50aXR5IHRvIHZlcmlmaWVkIFN1cGFiYXNlIEF1dGggc2Vzc2lvbgpvayAy
OTggLSBhbGwgc2l4IFJQQ3MgYmluZCBpZGVudGl0eSB0byB2ZXJpZmllZCBTdXBhYmFzZSBBdXRo
IHNlc3Npb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4yNzI5NDkKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBhbGwgc2l4IFJQQ3MgcGluIFNFQ1VSSVRZIERFRklORVIgc2VhcmNoIHBh
dGgKb2sgMjk5IC0gYWxsIHNpeCBSUENzIHBpbiBTRUNVUklUWSBERUZJTkVSIHNlYXJjaCBwYXRo
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTgwMTcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBSUEMgZHJhZnQgYW5kIHNjaGVtYSBhbGlnbm1lbnQgbmV2ZXIgYXV0by1wcm9tb3RlIGxl
Z2FjeSBnYW1lcwpvayAzMDAgLSBSUEMgZHJhZnQgYW5kIHNjaGVtYSBhbGlnbm1lbnQgbmV2ZXIg
YXV0by1wcm9tb3RlIGxlZ2FjeSBnYW1lcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjk5NjMzNQog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG5ldyBjbG91ZCBnYW1lIGlzIGV4cGxpY2l0
bHkgY3VycmVudCBhdCBmaXJzdCBib290c3RyYXAKb2sgMzAxIC0gbmV3IGNsb3VkIGdhbWUgaXMg
ZXhwbGljaXRseSBjdXJyZW50IGF0IGZpcnN0IGJvb3RzdHJhcAogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjI0MDU1MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGN1cnJlbnQgZ2FtZSBi
b290c3RyYXAgcmVtYWlucyBwcm90ZWN0ZWQgYnkgcHJlZmxpZ2h0IGFuZCBmYWlsLWNsb3NlZCBn
dWFyZApvayAzMDIgLSBjdXJyZW50IGdhbWUgYm9vdHN0cmFwIHJlbWFpbnMgcHJvdGVjdGVkIGJ5
IHByZWZsaWdodCBhbmQgZmFpbC1jbG9zZWQgZ3VhcmQKICAtLS0KICBkdXJhdGlvbl9tczogMC40
NTg5NjgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzaXgtUlBDIGRyYWZ0IGRvZXMg
bm90IGNyZWF0ZSByZWR1bmRhbnQgY3VycmVudC1nYW1lIHVuaXF1ZSBpbmRleApvayAzMDMgLSBz
aXgtUlBDIGRyYWZ0IGRvZXMgbm90IGNyZWF0ZSByZWR1bmRhbnQgY3VycmVudC1nYW1lIHVuaXF1
ZSBpbmRleAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjg4ODMxMwogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IG9wZW4gUlBDIGV4cGxpY2l0bHkgZGVuaWVzIE5VTEwgYWNjb3VudCByb2xl
cwpvayAzMDQgLSBvcGVuIFJQQyBleHBsaWNpdGx5IGRlbmllcyBOVUxMIGFjY291bnQgcm9sZXMK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4yMDc0MDIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBkcmFmdCBhbmQgcmV2aWV3IHJlbWFpbiBmYWlsLWNsb3NlZCBhZ2FpbnN0IGFjY2lkZW50
YWwgZGVwbG95bWVudApvayAzMDUgLSBkcmFmdCBhbmQgcmV2aWV3IHJlbWFpbiBmYWlsLWNsb3Nl
ZCBhZ2FpbnN0IGFjY2lkZW50YWwgZGVwbG95bWVudAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE4
MjI1MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNlcnZlciBSUEMgaGFzIGV4cGxp
Y2l0IGFjY291bnQgbG9jayBhbmQgcmV2aXNpb24gbG9jawpvayAzMDYgLSBzZXJ2ZXIgUlBDIGhh
cyBleHBsaWNpdCBhY2NvdW50IGxvY2sgYW5kIHJldmlzaW9uIGxvY2sKICAtLS0KICBkdXJhdGlv
bl9tczogMC45NzM3NDEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzZXJ2ZXIgUlBD
IGRvZXMgbm90IG92ZXJ3cml0ZSBjbG91ZCBvbiByZWplY3RlZCBjb21taXQKb2sgMzA3IC0gc2Vy
dmVyIFJQQyBkb2VzIG5vdCBvdmVyd3JpdGUgY2xvdWQgb24gcmVqZWN0ZWQgY29tbWl0CiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMTcxMjM3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
c2VydmVyIGZ1bmN0aW9ucyBhcmUgYXV0aC1ib3VuZCBhbmQgbm8gc2VydmljZSByb2xlIGNyZWRl
bnRpYWxzIGluIGJyb3dzZXIKb2sgMzA4IC0gc2VydmVyIGZ1bmN0aW9ucyBhcmUgYXV0aC1ib3Vu
ZCBhbmQgbm8gc2VydmljZSByb2xlIGNyZWRlbnRpYWxzIGluIGJyb3dzZXIKICAtLS0KICBkdXJh
dGlvbl9tczogMC4zMzIyNDkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjbG91ZCBh
ZG9wdGlvbiBpcyBndWFyZGVkIGJ5IGV4cGVjdGVkIHJldmlzaW9uIGJlZm9yZSB3cml0ZXIgcmV2
b2NhdGlvbgpvayAzMDkgLSBjbG91ZCBhZG9wdGlvbiBpcyBndWFyZGVkIGJ5IGV4cGVjdGVkIHJl
dmlzaW9uIGJlZm9yZSB3cml0ZXIgcmV2b2NhdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI1
MTc4NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN1cHBsaWVkIHByZWZsaWdodCBn
YW1lIGlkZW50aXR5IGlzIGNoZWNrZWQgZm9yIGJvdGggbG9jYWwgYW5kIGNsb3VkIGFkb3B0aW9u
IGJlZm9yZSByZXZva2luZyB3cml0ZXIKb2sgMzEwIC0gc3VwcGxpZWQgcHJlZmxpZ2h0IGdhbWUg
aWRlbnRpdHkgaXMgY2hlY2tlZCBmb3IgYm90aCBsb2NhbCBhbmQgY2xvdWQgYWRvcHRpb24gYmVm
b3JlIHJldm9raW5nIHdyaXRlcgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE0NTUxOAogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG9wZW4gcmVqZWN0cyBOYU4gc2NvcmUgYmVmb3JlIFJQ
QyByYXRoZXIgdGhhbiBzaWxlbnRseSBjb252ZXJ0aW5nIGl0IHRvIG51bGwKb2sgMzExIC0gb3Bl
biByZWplY3RzIE5hTiBzY29yZSBiZWZvcmUgUlBDIHJhdGhlciB0aGFuIHNpbGVudGx5IGNvbnZl
cnRpbmcgaXQgdG8gbnVsbAogIC0tLQogIGR1cmF0aW9uX21zOiAxLjE3OTQ1CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogY29tbWl0IHJlamVjdHMgbmVzdGVkIEluZmluaXR5IGluIGhp
c3RvcnkgYmVmb3JlIFJQQwpvayAzMTIgLSBjb21taXQgcmVqZWN0cyBuZXN0ZWQgSW5maW5pdHkg
aW4gaGlzdG9yeSBiZWZvcmUgUlBDCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjEzMzcKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBmaW5pdGUgbmVnYXRpdmUgYW5kIGZyYWN0aW9uYWwg
bnVtYmVycyByZXRhaW4gSlNPTiB2YWx1ZXMgaW4gc25hcHNob3QKb2sgMzEzIC0gZmluaXRlIG5l
Z2F0aXZlIGFuZCBmcmFjdGlvbmFsIG51bWJlcnMgcmV0YWluIEpTT04gdmFsdWVzIGluIHNuYXBz
aG90CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNzMxNjg4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogb3BlbiByZWplY3RzIG92ZXJzaXplZCBBU0NJSSBnYW1lIGJlZm9yZSBuZXR3b3Jr
IFJQQwpvayAzMTQgLSBvcGVuIHJlamVjdHMgb3ZlcnNpemVkIEFTQ0lJIGdhbWUgYmVmb3JlIG5l
dHdvcmsgUlBDCiAgLS0tCiAgZHVyYXRpb25fbXM6IDExLjY5OTYzNwogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IGNvbW1pdCByZWplY3RzIG92ZXJzaXplZCBtdWx0aWJ5dGUgVVRGLTgg
Z2FtZSBiZWZvcmUgbmV0d29yayBSUEMKb2sgMzE1IC0gY29tbWl0IHJlamVjdHMgb3ZlcnNpemVk
IG11bHRpYnl0ZSBVVEYtOCBnYW1lIGJlZm9yZSBuZXR3b3JrIFJQQwogIC0tLQogIGR1cmF0aW9u
X21zOiA2Ljc1NzU5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb3BlbiBhY2NlcHRz
IGEgc21hbGwgZ2FtZSBhbmQgcGFzc2VzIHRoZSBzbmFwc2hvdCB0byBSUEMKb2sgMzE2IC0gb3Bl
biBhY2NlcHRzIGEgc21hbGwgZ2FtZSBhbmQgcGFzc2VzIHRoZSBzbmFwc2hvdCB0byBSUEMKICAt
LS0KICBkdXJhdGlvbl9tczogMC4zMDA0OTEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBvcGVuIGNoZWNrcyBjbG91ZCBpZGVudGl0eSBhbmQgcmV2aXNpb24gYmVmb3JlIHJldHVybmlu
ZyBsb2NhbCBtaXNtYXRjaCBzbmFwc2hvdApvayAzMTcgLSBvcGVuIGNoZWNrcyBjbG91ZCBpZGVu
dGl0eSBhbmQgcmV2aXNpb24gYmVmb3JlIHJldHVybmluZyBsb2NhbCBtaXNtYXRjaCBzbmFwc2hv
dAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjc3NjA5NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IHN0YWxlIHJldmlzaW9uIHJlc3BvbnNlIGNvbnRhaW5zIG1ldGFkYXRhIGJ1dCBubyBj
bG91ZCBnYW1lIHNuYXBzaG90Cm9rIDMxOCAtIHN0YWxlIHJldmlzaW9uIHJlc3BvbnNlIGNvbnRh
aW5zIG1ldGFkYXRhIGJ1dCBubyBjbG91ZCBnYW1lIHNuYXBzaG90CiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMjM1NzI0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWxsIHByZWZsaWdo
dCByZWplY3Rpb24gY2hlY2tzIHJlbWFpbiBiZWZvcmUgd3JpdGVyIGxlYXNlIHJldm9jYXRpb24K
b2sgMzE5IC0gYWxsIHByZWZsaWdodCByZWplY3Rpb24gY2hlY2tzIHJlbWFpbiBiZWZvcmUgd3Jp
dGVyIGxlYXNlIHJldm9jYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4xNDg3MTMKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBvcGVuIHJlamVjdHMgYSByZXZpc2lvbiB3aXRob3V0
IGNsb3VkIGdhbWUgSUQgYmVmb3JlIGludm9raW5nIFJQQwpvayAzMjAgLSBvcGVuIHJlamVjdHMg
YSByZXZpc2lvbiB3aXRob3V0IGNsb3VkIGdhbWUgSUQgYmVmb3JlIGludm9raW5nIFJQQwogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjk4NTMyOAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IG9wZW4gcmVqZWN0cyBhIGNsb3VkIGdhbWUgSUQgd2l0aG91dCByZXZpc2lvbiBiZWZvcmUgaW52
b2tpbmcgUlBDCm9rIDMyMSAtIG9wZW4gcmVqZWN0cyBhIGNsb3VkIGdhbWUgSUQgd2l0aG91dCBy
ZXZpc2lvbiBiZWZvcmUgaW52b2tpbmcgUlBDCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTUxNDk4
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb3BlbiBwYXNzZXMgbWF0Y2hpbmcgY2xv
dWQgcHJlZmxpZ2h0IElEIGFuZCByZXZpc2lvbiB1bmNoYW5nZWQKb2sgMzIyIC0gb3BlbiBwYXNz
ZXMgbWF0Y2hpbmcgY2xvdWQgcHJlZmxpZ2h0IElEIGFuZCByZXZpc2lvbiB1bmNoYW5nZWQKICAt
LS0KICBkdXJhdGlvbl9tczogMC4yMjk2OTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiByZWplY3RzIFJQQyBvYmplY3QgbWlzc2luZyBvayBmbGFnIGluc3RlYWQgb2YgdHJlYXRpbmcg
aXQgYXMgYSB2YWxpZCByZXN1bHQKb2sgMzIzIC0gcmVqZWN0cyBSUEMgb2JqZWN0IG1pc3Npbmcg
b2sgZmxhZyBpbnN0ZWFkIG9mIHRyZWF0aW5nIGl0IGFzIGEgdmFsaWQgcmVzdWx0CiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDEuMDQzNTg3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVq
ZWN0cyBSUEMgb2sgZmxhZyBlbmNvZGVkIGFzIHN0cmluZyBpbnN0ZWFkIG9mIGJvb2xlYW4Kb2sg
MzI0IC0gcmVqZWN0cyBSUEMgb2sgZmxhZyBlbmNvZGVkIGFzIHN0cmluZyBpbnN0ZWFkIG9mIGJv
b2xlYW4KICAtLS0KICBkdXJhdGlvbl9tczogMC4zNDkyNjQKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBwcmVzZXJ2ZXMgZXhwbGljaXQgUlBDIHJlamVjdGlvbiB3aXRoIGJvb2xlYW4g
b2sgZmFsc2UKb2sgMzI1IC0gcHJlc2VydmVzIGV4cGxpY2l0IFJQQyByZWplY3Rpb24gd2l0aCBi
b29sZWFuIG9rIGZhbHNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzIzMzE1CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogcmV2aWV3IGNhbmRpZGF0ZSBpcyBmYWlsLWNsb3NlZCBiZWZv
cmUgYW55IHNjaGVtYSBtdXRhdGlvbgpvayAzMjYgLSByZXZpZXcgY2FuZGlkYXRlIGlzIGZhaWwt
Y2xvc2VkIGJlZm9yZSBhbnkgc2NoZW1hIG11dGF0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEu
MTMwNDk3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogaW5jb21wYXRpYmxlIHJldmll
dyBvcGVuIHNpZ25hdHVyZSBjYW5ub3QgYmUgbWlzdGFrZW4gZm9yIGRlcGxveWFibGUgYWRhcHRl
ciBjb250cmFjdApvayAzMjcgLSBpbmNvbXBhdGlibGUgcmV2aWV3IG9wZW4gc2lnbmF0dXJlIGNh
bm5vdCBiZSBtaXN0YWtlbiBmb3IgZGVwbG95YWJsZSBhZGFwdGVyIGNvbnRyYWN0CiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuMzIyMjI0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmV2
aWV3IGxhY2tzIGRyYWZ0IHByZWZsaWdodCBhbmQgaGlnaC13YXRlciBndWFyZHMgYW5kIG11c3Qg
cmVtYWluIGJsb2NrZWQKb2sgMzI4IC0gcmV2aWV3IGxhY2tzIGRyYWZ0IHByZWZsaWdodCBhbmQg
aGlnaC13YXRlciBndWFyZHMgYW5kIG11c3QgcmVtYWluIGJsb2NrZWQKICAtLS0KICBkdXJhdGlv
bl9tczogMC4xNzk0MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJldmlldyBSUEMg
b3BlbiBleHBsaWNpdGx5IHJlamVjdHMgTlVMTCByb2xlCm9rIDMyOSAtIHJldmlldyBSUEMgb3Bl
biBleHBsaWNpdGx5IHJlamVjdHMgTlVMTCByb2xlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNzM2
NTU2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmV2aWV3IFJQQyBkb2VzIG5vdCBy
ZWNyZWF0ZSBkdXBsaWNhdGUgY3VycmVudC1nYW1lIGluZGV4Cm9rIDMzMCAtIHJldmlldyBSUEMg
ZG9lcyBub3QgcmVjcmVhdGUgZHVwbGljYXRlIGN1cnJlbnQtZ2FtZSBpbmRleAogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjI4OTExNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJldmll
dyBSUEMgcmVtYWlucyBhdXRoZW50aWNhdGVkLW9ubHkgYW5kIHVzZXMgc2Vzc2lvbi1ib3VuZCBs
ZWFzZQpvayAzMzEgLSByZXZpZXcgUlBDIHJlbWFpbnMgYXV0aGVudGljYXRlZC1vbmx5IGFuZCB1
c2VzIHNlc3Npb24tYm91bmQgbGVhc2UKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMjU2NzkKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBkcmFmdCBSUEMgcmVtYWlucyBleHBsaWNpdGx5
IGZhaWwtY2xvc2VkIGZvciBwcm9kdWN0aW9uCm9rIDMzMiAtIGRyYWZ0IFJQQyByZW1haW5zIGV4
cGxpY2l0bHkgZmFpbC1jbG9zZWQgZm9yIHByb2R1Y3Rpb24KICAtLS0KICBkdXJhdGlvbl9tczog
MC44OTU2NzQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiB3cml0ZXIgY29tbWl0IGJp
bmRzIEpXVCBBdXRoIHNlc3Npb24sIGRldmljZSwgZ2VuZXJhdGlvbiBhbmQgdG9rZW4gaGFzaApv
ayAzMzMgLSB3cml0ZXIgY29tbWl0IGJpbmRzIEpXVCBBdXRoIHNlc3Npb24sIGRldmljZSwgZ2Vu
ZXJhdGlvbiBhbmQgdG9rZW4gaGFzaAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIzMDY0NgogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFJQQyBkZWZpbmVyIGZ1bmN0aW9ucyBwaW4gc2Vh
cmNoX3BhdGggYW5kIHJlc3RyaWN0IGFub255bW91cyBleGVjdXRpb24Kb2sgMzM0IC0gUlBDIGRl
ZmluZXIgZnVuY3Rpb25zIHBpbiBzZWFyY2hfcGF0aCBhbmQgcmVzdHJpY3QgYW5vbnltb3VzIGV4
ZWN1dGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQyODI2MwogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IGFsbCBzaXggY2xpZW50IFJQQyBuYW1lcyBhbmQgU1FMIGZ1bmN0aW9uIHBh
cmFtZXRlciBuYW1lcyBhZ3JlZQpvayAzMzUgLSBhbGwgc2l4IGNsaWVudCBSUEMgbmFtZXMgYW5k
IFNRTCBmdW5jdGlvbiBwYXJhbWV0ZXIgbmFtZXMgYWdyZWUKICAtLS0KICBkdXJhdGlvbl9tczog
MS40NDc4NjMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhbGwgc2l4IFJQQyBzaWdu
YXR1cmVzIGdyYW50IGV4ZWN1dGUgb25seSB0byBhdXRoZW50aWNhdGVkIGluIGRyYWZ0Cm9rIDMz
NiAtIGFsbCBzaXggUlBDIHNpZ25hdHVyZXMgZ3JhbnQgZXhlY3V0ZSBvbmx5IHRvIGF1dGhlbnRp
Y2F0ZWQgaW4gZHJhZnQKICAtLS0KICBkdXJhdGlvbl9tczogMC4xOTEwMjcKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiB1bnZlcmlmaWVkIGZvdXItcGFyYW1ldGVyIFJQQyBkcmFmdCBy
ZW1haW5zIGZhaWwtY2xvc2VkIGJlZm9yZSBTUUwgdHJhbnNhY3Rpb24Kb2sgMzM3IC0gdW52ZXJp
ZmllZCBmb3VyLXBhcmFtZXRlciBSUEMgZHJhZnQgcmVtYWlucyBmYWlsLWNsb3NlZCBiZWZvcmUg
U1FMIHRyYW5zYWN0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjY1NzM5CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogd3JpdGVyIHRha2VvdmVyIGNoZWNrcyBjbG91ZCBwcmVmbGln
aHQgYmVmb3JlIHJldm9raW5nIG9sZCB3cml0ZXIKb2sgMzM4IC0gd3JpdGVyIHRha2VvdmVyIGNo
ZWNrcyBjbG91ZCBwcmVmbGlnaHQgYmVmb3JlIHJldm9raW5nIG9sZCB3cml0ZXIKICAtLS0KICBk
dXJhdGlvbl9tczogMS4xNDk1MzUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjb21t
aXQgc2VyaWFsaXplcyBvbiBhY2NvdW50IGFuZCBnYW1lIGJlZm9yZSBhY2NlcHRpbmcgd3JpdGVy
IGxlYXNlCm9rIDMzOSAtIGNvbW1pdCBzZXJpYWxpemVzIG9uIGFjY291bnQgYW5kIGdhbWUgYmVm
b3JlIGFjY2VwdGluZyB3cml0ZXIgbGVhc2UKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNjQ5MjgK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdWNjZXNzZnVsIGxvY2FsIHNhdmUgcmVm
cmVzaGVzIHNhdmVkLXN0YXRlIG1hcmtlciBhZnRlciBkdXJhYmxlIGNsb3VkIGVucXVldWUKb2sg
MzQwIC0gc3VjY2Vzc2Z1bCBsb2NhbCBzYXZlIHJlZnJlc2hlcyBzYXZlZC1zdGF0ZSBtYXJrZXIg
YWZ0ZXIgZHVyYWJsZSBjbG91ZCBlbnF1ZXVlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODI5MzQ1
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogZmFpbGVkIGxvY2FsIHNhdmUgb3IgcXVl
dWUgZmFpbHVyZSBjYW5ub3QgcmVmcmVzaCBzYXZlZC1zdGF0ZSBtYXJrZXIKb2sgMzQxIC0gZmFp
bGVkIGxvY2FsIHNhdmUgb3IgcXVldWUgZmFpbHVyZSBjYW5ub3QgcmVmcmVzaCBzYXZlZC1zdGF0
ZSBtYXJrZXIKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMjEwODIKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBhbGlnbm1lbnQgY2FuZGlkYXRlIHJlbWFpbnMgdW5jb25kaXRpb25hbGx5
IGJsb2NrZWQgYmVmb3JlIGFueSBEREwKb2sgMzQyIC0gYWxpZ25tZW50IGNhbmRpZGF0ZSByZW1h
aW5zIHVuY29uZGl0aW9uYWxseSBibG9ja2VkIGJlZm9yZSBhbnkgRERMCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuOTg0MTk3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY2FuZGlkYXRl
IGFkZHMgcmVxdWlyZWQgd3JpdGVyIGFuZCBBdXRoIGJpbmRpbmcgY29sdW1ucyB3aXRob3V0IGNs
ZWFyaW5nIGV4aXN0aW5nIHNlc3Npb25zCm9rIDM0MyAtIGNhbmRpZGF0ZSBhZGRzIHJlcXVpcmVk
IHdyaXRlciBhbmQgQXV0aCBiaW5kaW5nIGNvbHVtbnMgd2l0aG91dCBjbGVhcmluZyBleGlzdGlu
ZyBzZXNzaW9ucwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQ4NDkxOAogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IGNhbmRpZGF0ZSBwcmV2ZW50cyBhY2NpZGVudGFsIGN1cnJlbnQtZ2Ft
ZSBwcm9tb3Rpb24gYW5kIGNoZWNrcyBkdXBsaWNhdGVzIGJlZm9yZSBpbmRleApvayAzNDQgLSBj
YW5kaWRhdGUgcHJldmVudHMgYWNjaWRlbnRhbCBjdXJyZW50LWdhbWUgcHJvbW90aW9uIGFuZCBj
aGVja3MgZHVwbGljYXRlcyBiZWZvcmUgaW5kZXgKICAtLS0KICBkdXJhdGlvbl9tczogMC41Nzk5
MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGhpc3RvcmljYWwgbXVsdGktZ2FtZSBv
d25lcnMgYXJlIG5vdCByZWplY3RlZCBtZXJlbHkgZm9yIGhhdmluZyBhcmNoaXZlcwpvayAzNDUg
LSBoaXN0b3JpY2FsIG11bHRpLWdhbWUgb3duZXJzIGFyZSBub3QgcmVqZWN0ZWQgbWVyZWx5IGZv
ciBoYXZpbmcgYXJjaGl2ZXMKICAtLS0KICBkdXJhdGlvbl9tczogMi44NzgwNTkKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjdXJyZW50IGZsYWcgZXhpc3RzIGJlZm9yZSBjdXJyZW50
LW9ubHkgZHVwbGljYXRlIGNoZWNrIGFuZCBpcyBub3QgYXV0by1wcm9tb3RlZApvayAzNDYgLSBj
dXJyZW50IGZsYWcgZXhpc3RzIGJlZm9yZSBjdXJyZW50LW9ubHkgZHVwbGljYXRlIGNoZWNrIGFu
ZCBpcyBub3QgYXV0by1wcm9tb3RlZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI1Mjc0OQogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFyY2hpdmUtZnJpZW5kbHkgY2FuZGlkYXRlIHJl
bWFpbnMgYmxvY2tlZCBhbmQgbm9uLWRlc3RydWN0aXZlCm9rIDM0NyAtIGFyY2hpdmUtZnJpZW5k
bHkgY2FuZGlkYXRlIHJlbWFpbnMgYmxvY2tlZCBhbmQgbm9uLWRlc3RydWN0aXZlCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuMjc0ODgzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY2Fu
ZGlkYXRlIHJldGFpbnMgdW5jb25kaXRpb25hbCBmYWlsLWNsb3NlZCBndWFyZCBiZWZvcmUgRERM
Cm9rIDM0OCAtIGNhbmRpZGF0ZSByZXRhaW5zIHVuY29uZGl0aW9uYWwgZmFpbC1jbG9zZWQgZ3Vh
cmQgYmVmb3JlIERETAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjgxNDM0MgogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IGFsbCBzaXggc3luYyBjb2x1bW5zIGhhdmUgY2F0YWxvZyB0eXBl
IGFzc2VydGlvbnMgYWZ0ZXIgYWxpZ25tZW50IERETApvayAzNDkgLSBhbGwgc2l4IHN5bmMgY29s
dW1ucyBoYXZlIGNhdGFsb2cgdHlwZSBhc3NlcnRpb25zIGFmdGVyIGFsaWdubWVudCBEREwKICAt
LS0KICBkdXJhdGlvbl9tczogMC4zMjg1NDMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBjcml0aWNhbCBib29sZWFuIGNvbHVtbnMgbXVzdCBiZSBub24tbnVsbCwgb3B0aW9uYWwgbGVh
c2UgbWV0YWRhdGEgbWF5IGJlIG51bGwKb2sgMzUwIC0gY3JpdGljYWwgYm9vbGVhbiBjb2x1bW5z
IG11c3QgYmUgbm9uLW51bGwsIG9wdGlvbmFsIGxlYXNlIG1ldGFkYXRhIG1heSBiZSBudWxsCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMTI4MjgzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogY3VycmVudC1nYW1lIGluZGV4IGF1ZGl0IGNoZWNrcyBpbmRleCBuYW1lc3BhY2UgaW5kZXBl
bmRlbnRseSBmcm9tIHRhYmxlIG5hbWVzcGFjZQpvayAzNTEgLSBjdXJyZW50LWdhbWUgaW5kZXgg
YXVkaXQgY2hlY2tzIGluZGV4IG5hbWVzcGFjZSBpbmRlcGVuZGVudGx5IGZyb20gdGFibGUgbmFt
ZXNwYWNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNjkzMzMxCiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogY3VycmVudC1nYW1lIGluZGV4IGF1ZGl0IHN0aWxsIHJlcXVpcmVzIHVuaXF1
ZSB2YWxpZCByZWFkeSBvd25lci1rZXkgcGFydGlhbCBpbmRleApvayAzNTIgLSBjdXJyZW50LWdh
bWUgaW5kZXggYXVkaXQgc3RpbGwgcmVxdWlyZXMgdW5pcXVlIHZhbGlkIHJlYWR5IG93bmVyLWtl
eSBwYXJ0aWFsIGluZGV4CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTE1ODQ0CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogc2NoZW1hIGNhbmRpZGF0ZSByZXRhaW5zIHVuY29uZGl0aW9u
YWwgbm9uLWRlcGxveSBndWFyZApvayAzNTMgLSBzY2hlbWEgY2FuZGlkYXRlIHJldGFpbnMgdW5j
b25kaXRpb25hbCBub24tZGVwbG95IGd1YXJkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMDk1NzIz
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogaW5kZXggbmFtZSByZXVzZSBjYW5ub3Qg
YnlwYXNzIHVuaXF1ZSBpbmRleCBkZWZpbml0aW9uIHZlcmlmaWNhdGlvbgpvayAzNTQgLSBpbmRl
eCBuYW1lIHJldXNlIGNhbm5vdCBieXBhc3MgdW5pcXVlIGluZGV4IGRlZmluaXRpb24gdmVyaWZp
Y2F0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODk3MjU2CiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogY3VycmVudCBnYW1lIGluZGV4IHByZWRpY2F0ZSBpcyBjaGVja2VkLCBub3Qg
anVzdCBpdHMgbmFtZQpvayAzNTUgLSBjdXJyZW50IGdhbWUgaW5kZXggcHJlZGljYXRlIGlzIGNo
ZWNrZWQsIG5vdCBqdXN0IGl0cyBuYW1lCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjI5NDE0CiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogaW5kZXggZGVmaW5pdGlvbiBjaGVjayByZW1h
aW5zIGluc2lkZSBndWFyZGVkIGF0b21pYyBtaWdyYXRpb24Kb2sgMzU2IC0gaW5kZXggZGVmaW5p
dGlvbiBjaGVjayByZW1haW5zIGluc2lkZSBndWFyZGVkIGF0b21pYyBtaWdyYXRpb24KICAtLS0K
ICBkdXJhdGlvbl9tczogMC4xNzYyNTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBi
b3RoIGd1YXJkZWQgaW5kZXggY2hlY2tzIHZhbGlkYXRlIGJ0cmVlIGFjY2VzcyBtZXRob2QKb2sg
MzU3IC0gYm90aCBndWFyZGVkIGluZGV4IGNoZWNrcyB2YWxpZGF0ZSBidHJlZSBhY2Nlc3MgbWV0
aG9kCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODc5MTI5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogYm90aCBndWFyZGVkIGluZGV4IGNoZWNrcyByZWplY3QgZXhwcmVzc2lvbiBhbmQg
SU5DTFVERSBpbmRleGVzCm9rIDM1OCAtIGJvdGggZ3VhcmRlZCBpbmRleCBjaGVja3MgcmVqZWN0
IGV4cHJlc3Npb24gYW5kIElOQ0xVREUgaW5kZXhlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEy
MTY5MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVuY29uZGl0aW9uYWwgbm9uLWRl
cGxveSBndWFyZCByZW1haW5zIGZpcnN0IFNRTCBzdGF0ZW1lbnQKb2sgMzU5IC0gdW5jb25kaXRp
b25hbCBub24tZGVwbG95IGd1YXJkIHJlbWFpbnMgZmlyc3QgU1FMIHN0YXRlbWVudAogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjI4NjI2OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxl
Z2FjeSBpbmRleCBkcm9wIGlzIHByZWNlZGVkIGJ5IHN0cmljdCBjYXRhbG9nIHNoYXBlIHZlcmlm
aWNhdGlvbgpvayAzNjAgLSBsZWdhY3kgaW5kZXggZHJvcCBpcyBwcmVjZWRlZCBieSBzdHJpY3Qg
Y2F0YWxvZyBzaGFwZSB2ZXJpZmljYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC44OTEwMTcK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBsZWdhY3kgaW5kZXggbXVzdCBiZSB1bmlx
dWUgYW5kIHNjb3BlZCB0byBhY3RpdmUgdXNlciBzZXNzaW9ucwpvayAzNjEgLSBsZWdhY3kgaW5k
ZXggbXVzdCBiZSB1bmlxdWUgYW5kIHNjb3BlZCB0byBhY3RpdmUgdXNlciBzZXNzaW9ucwogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjE3MDU0NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IGxlZ2FjeSBpbmRleCBkcm9wIHByb3RlY3Rpb24gcmVtYWlucyBmYWlsLWNsb3NlZCBhbmQgYXRv
bWljCm9rIDM2MiAtIGxlZ2FjeSBpbmRleCBkcm9wIHByb3RlY3Rpb24gcmVtYWlucyBmYWlsLWNs
b3NlZCBhbmQgYXRvbWljCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTEwNzc2CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogZGVwbG95bWVudCBpbnRlbnRpb25hbGx5IGJsb2NrZWQgdW50
aWwgcmVhbCBpbnRlZ3JhdGlvbiB2ZXJpZmljYXRpb24Kb2sgMzYzIC0gZGVwbG95bWVudCBpbnRl
bnRpb25hbGx5IGJsb2NrZWQgdW50aWwgcmVhbCBpbnRlZ3JhdGlvbiB2ZXJpZmljYXRpb24KICAt
LS0KICBkdXJhdGlvbl9tczogMC45Nzg0NzgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBvcGVuIGFuZCBjb21taXQgcmVxdWlyZSB2YWxpZCBtYXRjaGluZyBTdXBhYmFzZSBBdXRoIHNl
c3Npb24Kb2sgMzY0IC0gb3BlbiBhbmQgY29tbWl0IHJlcXVpcmUgdmFsaWQgbWF0Y2hpbmcgU3Vw
YWJhc2UgQXV0aCBzZXNzaW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjIzMjA1CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYm90aCBlbmRwb2ludHMgcmVqZWN0IGJhbm5lZCBvciBk
ZWxldGVkIGFjY291bnRzCm9rIDM2NSAtIGJvdGggZW5kcG9pbnRzIHJlamVjdCBiYW5uZWQgb3Ig
ZGVsZXRlZCBhY2NvdW50cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIzMDc1NwogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHdyaXRlIHJlcXVpcmVzIGRldmljZSB0b2tlbiwgZ2VuZXJh
dGlvbiBhbmQgYXV0aCBzZXNzaW9uIGJpbmRpbmcKb2sgMzY2IC0gd3JpdGUgcmVxdWlyZXMgZGV2
aWNlIHRva2VuLCBnZW5lcmF0aW9uIGFuZCBhdXRoIHNlc3Npb24gYmluZGluZwogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjEzMTMwNwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbmZs
aWN0aW5nIHVwZGF0ZXMgcHJlc2VydmUgY2xvdWQgc3RhdGUgYW5kIHJlY29yZCBjb25mbGljdApv
ayAzNjcgLSBjb25mbGljdGluZyB1cGRhdGVzIHByZXNlcnZlIGNsb3VkIHN0YXRlIGFuZCByZWNv
cmQgY29uZmxpY3QKICAtLS0KICBkdXJhdGlvbl9tczogMC4xOTk2NTkKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiB0YWtlb3ZlciByb3RhdGVzIHRva2VuIGFuZCBpbmNyZW1lbnRzIGdl
bmVyYXRpb24Kb2sgMzY4IC0gdGFrZW92ZXIgcm90YXRlcyB0b2tlbiBhbmQgaW5jcmVtZW50cyBn
ZW5lcmF0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTA1MTA4CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogb2xkIGFuZCBuZXcgc2Vzc2lvbnMgc2VyaWFsaXplZCB2aWEgdXNlciBy
b3cgbG9jawpvayAzNjkgLSBvbGQgYW5kIG5ldyBzZXNzaW9ucyBzZXJpYWxpemVkIHZpYSB1c2Vy
IHJvdyBsb2NrCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMDkyNTA4CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogYWxsIHNpeCBwdWJsaWMgUlBDIGVuZHBvaW50cyBhcmUgc2VhcmNoLXBh
dGggaGFyZGVuZWQgYW5kIGV4cGxpY2l0bHkgcmVzdHJpY3RlZApvayAzNzAgLSBhbGwgc2l4IHB1
YmxpYyBSUEMgZW5kcG9pbnRzIGFyZSBzZWFyY2gtcGF0aCBoYXJkZW5lZCBhbmQgZXhwbGljaXRs
eSByZXN0cmljdGVkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDc3MzM3CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogb2xkZXIgYXV0aCBzZXNzaW9ucyBjYW5ub3QgcmVjbGFpbSBsZWFz
ZSBhZnRlciBuZXdlciBhdXRoIHNlc3Npb24gZXhwaXJlcwpvayAzNzEgLSBvbGRlciBhdXRoIHNl
c3Npb25zIGNhbm5vdCByZWNsYWltIGxlYXNlIGFmdGVyIG5ld2VyIGF1dGggc2Vzc2lvbiBleHBp
cmVzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjQ2NTkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBwZWVrIHJlamVjdHMgZGlzcGxhY2VkIG9sZGVyIGF1dGggc2Vzc2lvbnMgZXZlbiBh
ZnRlciBuZXdlciBsb2dpbiBleHBpcmVzCm9rIDM3MiAtIHBlZWsgcmVqZWN0cyBkaXNwbGFjZWQg
b2xkZXIgYXV0aCBzZXNzaW9ucyBldmVuIGFmdGVyIG5ld2VyIGxvZ2luIGV4cGlyZXMKICAtLS0K
ICBkdXJhdGlvbl9tczogMC4zNDgwMDIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBy
ZWFkZXIgZW5yb2xsbWVudCB1cGRhdGVzIGF1dGgtc2Vzc2lvbiBoaWdoLXdhdGVyIHRpbWVzdGFt
cCBvbiByZXVzZWQgZGV2aWNlIElEcwpvayAzNzMgLSByZWFkZXIgZW5yb2xsbWVudCB1cGRhdGVz
IGF1dGgtc2Vzc2lvbiBoaWdoLXdhdGVyIHRpbWVzdGFtcCBvbiByZXVzZWQgZGV2aWNlIElEcwog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjE5MTUzOAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IHJlYWRlciBlbnJvbGxtZW50IGNhbm5vdCBvdmVyd3JpdGUgbmV3ZXIgQXV0aC1zZXNzaW9u
IGhpZ2gtd2F0ZXIgbWFyayB3aXRoIG9sZGVyIHNlc3Npb24Kb2sgMzc0IC0gcmVhZGVyIGVucm9s
bG1lbnQgY2Fubm90IG92ZXJ3cml0ZSBuZXdlciBBdXRoLXNlc3Npb24gaGlnaC13YXRlciBtYXJr
IHdpdGggb2xkZXIgc2Vzc2lvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEwNjU1CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZCBhbmQgbGVhc2Ugc3RhdHVzIHJlamVjdCBkaXNw
bGFjZWQgb2xkZXIgbG9naW4gdXNpbmcgcGVyc2lzdGVudCBzZXNzaW9uIGhpZ2gtd2F0ZXIgbWFy
awpvayAzNzUgLSByZWFkIGFuZCBsZWFzZSBzdGF0dXMgcmVqZWN0IGRpc3BsYWNlZCBvbGRlciBs
b2dpbiB1c2luZyBwZXJzaXN0ZW50IHNlc3Npb24gaGlnaC13YXRlciBtYXJrCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMTIyNzQ0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29tbWl0
IHJlamVjdHMgZGlzcGxhY2VkIG9sZGVyIGxvZ2luIGFmdGVyIG5ld2VyIGF1dGggc2Vzc2lvbiBl
eHBpcmVzCm9rIDM3NiAtIGNvbW1pdCByZWplY3RzIGRpc3BsYWNlZCBvbGRlciBsb2dpbiBhZnRl
ciBuZXdlciBhdXRoIHNlc3Npb24gZXhwaXJlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjA5NDIz
MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHdyaXRlciBvcGVuIGNhbm5vdCBkb3du
Z3JhZGUgbmV3ZXIgcmVjb3JkZWQgbG9naW4gb24gcmV1c2VkIGRldmljZSBpbiBtdWx0aS1kZXZp
Y2UgbW9kZQpvayAzNzcgLSB3cml0ZXIgb3BlbiBjYW5ub3QgZG93bmdyYWRlIG5ld2VyIHJlY29y
ZGVkIGxvZ2luIG9uIHJldXNlZCBkZXZpY2UgaW4gbXVsdGktZGV2aWNlIG1vZGUKICAtLS0KICBk
dXJhdGlvbl9tczogMC4wODI4MzQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFk
ZXIgZW5yb2xsbWVudCBjYW5ub3QgcmV2b2tlIGFuIGV4aXN0aW5nIHdyaXRlciBsZWFzZSB1c2lu
ZyBpdHMgZGV2aWNlIElECm9rIDM3OCAtIHJlYWRlciBlbnJvbGxtZW50IGNhbm5vdCByZXZva2Ug
YW4gZXhpc3Rpbmcgd3JpdGVyIGxlYXNlIHVzaW5nIGl0cyBkZXZpY2UgSUQKICAtLS0KICBkdXJh
dGlvbl9tczogMC4xOTEzMjcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBvcGVuIHJl
amVjdHMgbmVnYXRpdmUgcHJlZmxpZ2h0IHJldmlzaW9ucyBiZWZvcmUgd3JpdGVyIHJldm9jYXRp
b24Kb2sgMzc5IC0gb3BlbiByZWplY3RzIG5lZ2F0aXZlIHByZWZsaWdodCByZXZpc2lvbnMgYmVm
b3JlIHdyaXRlciByZXZvY2F0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMDc5NDEKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBleGlzdGluZyBjbG91ZCBnYW1lIHJlcXVpcmVzIGV4
cGxpY2l0IHJldmlzaW9uIHByZWZsaWdodCBiZWZvcmUgd3JpdGVyIHRha2VvdmVyCm9rIDM4MCAt
IGV4aXN0aW5nIGNsb3VkIGdhbWUgcmVxdWlyZXMgZXhwbGljaXQgcmV2aXNpb24gcHJlZmxpZ2h0
IGJlZm9yZSB3cml0ZXIgdGFrZW92ZXIKICAtLS0KICBkdXJhdGlvbl9tczogMC4wNzQ1MzIKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdXBhYmFzZV9zeW5jX3JwY19kcmFmdC5zcWw6
IHNlc3Npb24gb3JkZXJpbmcgaXMgZGV0ZXJtaW5pc3RpYyB3aGVuIHRpbWVzdGFtcHMgdGllCm9r
IDM4MSAtIHN1cGFiYXNlX3N5bmNfcnBjX2RyYWZ0LnNxbDogc2Vzc2lvbiBvcmRlcmluZyBpcyBk
ZXRlcm1pbmlzdGljIHdoZW4gdGltZXN0YW1wcyB0aWUKICAtLS0KICBkdXJhdGlvbl9tczogMS4x
MDk1NDUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdXBhYmFzZV9zeW5jX3JlYWRv
bmx5X2RyYWZ0LnNxbDogc2Vzc2lvbiBvcmRlcmluZyBpcyBkZXRlcm1pbmlzdGljIHdoZW4gdGlt
ZXN0YW1wcyB0aWUKb2sgMzgyIC0gc3VwYWJhc2Vfc3luY19yZWFkb25seV9kcmFmdC5zcWw6IHNl
c3Npb24gb3JkZXJpbmcgaXMgZGV0ZXJtaW5pc3RpYyB3aGVuIHRpbWVzdGFtcHMgdGllCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMTk5NDk5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
b3BlbiByZWplY3RzIGEgbWlzc2luZyB1c2VyIHJvbGUgZXhwbGljaXRseQpvayAzODMgLSBvcGVu
IHJlamVjdHMgYSBtaXNzaW5nIHVzZXIgcm9sZSBleHBsaWNpdGx5CiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMTgwMDkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdGFnZWQgc2VydmVy
IHZhbGlkYXRvciBjaGVja3MgdGhlIHJlY29yZGVkLWhhbmQgZmllbGRzIGNoZWNrZWQgYnkgSlMK
b2sgMzg0IC0gc3RhZ2VkIHNlcnZlciB2YWxpZGF0b3IgY2hlY2tzIHRoZSByZWNvcmRlZC1oYW5k
IGZpZWxkcyBjaGVja2VkIGJ5IEpTCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNzQ1NzA5CiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU1FMIHJlamVjdHMgZHVwbGljYXRlIGhpc3Rvcmlj
YWwgc2VhdCB3aW5kcwpvayAzODUgLSBTUUwgcmVqZWN0cyBkdXBsaWNhdGUgaGlzdG9yaWNhbCBz
ZWF0IHdpbmRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjE3NDI2CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogU1FMIGhpc3RvcmljYWwgcGxheWVyIG5hbWVzIGhhdmUgc2FtZSAxMDAt
Y2hhcmFjdGVyIGNlaWxpbmcgYXMgY3VycmVudCBuYW1lcwpvayAzODYgLSBTUUwgaGlzdG9yaWNh
bCBwbGF5ZXIgbmFtZXMgaGF2ZSBzYW1lIDEwMC1jaGFyYWN0ZXIgY2VpbGluZyBhcyBjdXJyZW50
IG5hbWVzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjM5ODkKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBTUUwgdmFsaWRhdG9yIHJlamVjdHMgbWlzc2luZyBhbmQgSlNPTi1udWxsIHJl
cXVpcmVkIGZpZWxkcyBleHBsaWNpdGx5Cm9rIDM4NyAtIFNRTCB2YWxpZGF0b3IgcmVqZWN0cyBt
aXNzaW5nIGFuZCBKU09OLW51bGwgcmVxdWlyZWQgZmllbGRzIGV4cGxpY2l0bHkKICAtLS0KICBk
dXJhdGlvbl9tczogMC43MTE0NjgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTUUwg
dmFsaWRhdG9yIHJlamVjdHMgdG9wLWxldmVsIFNRTCBOVUxMIGFuZCBKU09OIG51bGwKb2sgMzg4
IC0gU1FMIHZhbGlkYXRvciByZWplY3RzIHRvcC1sZXZlbCBTUUwgTlVMTCBhbmQgSlNPTiBudWxs
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDE5MDU5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogU1FMIHZhbGlkYXRvciBzdGF5cyBub25kZXBsb3lhYmxlIHdoaWxlIGludGVncmF0aW9u
IGlzIHBlbmRpbmcKb2sgMzg5IC0gU1FMIHZhbGlkYXRvciBzdGF5cyBub25kZXBsb3lhYmxlIHdo
aWxlIGludGVncmF0aW9uIGlzIHBlbmRpbmcKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMDMyODUK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjbG91ZCBzY29yZSB2YWxpZGF0b3IgcmVq
ZWN0cyBmcmFjdGlvbmFsIHNjb3JlcwpvayAzOTAgLSBjbG91ZCBzY29yZSB2YWxpZGF0b3IgcmVq
ZWN0cyBmcmFjdGlvbmFsIHNjb3JlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjgzMDYwNgogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNsb3VkIHNjb3JlIHZhbGlkYXRvciBib3VuZHMg
aW50ZWdlciBtYWduaXR1ZGUKb2sgMzkxIC0gY2xvdWQgc2NvcmUgdmFsaWRhdG9yIGJvdW5kcyBp
bnRlZ2VyIG1hZ25pdHVkZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE4NTQxOQogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFNRTCBkcmFmdCByZW1haW5zIGZhaWwtY2xvc2VkIGZvciBw
cm9kdWN0aW9uCm9rIDM5MiAtIFNRTCBkcmFmdCByZW1haW5zIGZhaWwtY2xvc2VkIGZvciBwcm9k
dWN0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTA3NzcxCiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogc2VydmVyIGNoZWNrcyBvcHRpb25hbCByb3VuZFdpbmQgaXMgYSB3aW5kIGlu
dGVnZXIKb2sgMzkzIC0gc2VydmVyIGNoZWNrcyBvcHRpb25hbCByb3VuZFdpbmQgaXMgYSB3aW5k
IGludGVnZXIKICAtLS0KICBkdXJhdGlvbl9tczogMC44NDgzMjMKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBzZXJ2ZXIgY2hlY2tzIG9wdGlvbmFsIHNlYXRXaW5kcyBjb250YWlucyBm
b3VyIGRpc3RpbmN0IHdpbmQgaW50ZWdlcnMKb2sgMzk0IC0gc2VydmVyIGNoZWNrcyBvcHRpb25h
bCBzZWF0V2luZHMgY29udGFpbnMgZm91ciBkaXN0aW5jdCB3aW5kIGludGVnZXJzCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuMjA3MzcxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU1FM
IHJlbWFpbnMgYmxvY2tlZCBmcm9tIHByb2R1Y3Rpb24Kb2sgMzk1IC0gU1FMIHJlbWFpbnMgYmxv
Y2tlZCBmcm9tIHByb2R1Y3Rpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4xNDIwMDMKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhZG1pbiB1bmxvY2sgZHJhZnQgY2Fubm90IGJlIGRl
cGxveWVkIGFjY2lkZW50YWxseQpvayAzOTYgLSBhZG1pbiB1bmxvY2sgZHJhZnQgY2Fubm90IGJl
IGRlcGxveWVkIGFjY2lkZW50YWxseQogIC0tLQogIGR1cmF0aW9uX21zOiAxLjM1MzAzCiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWRtaW4gdW5sb2NrIGRyYWZ0IGNoZWNrcyBhY3Rv
ciwgdGFyZ2V0IGFuZCBzdGFsZSBiaW5kaW5nIGJlZm9yZSBtdXRhdGlvbgpvayAzOTcgLSBhZG1p
biB1bmxvY2sgZHJhZnQgY2hlY2tzIGFjdG9yLCB0YXJnZXQgYW5kIHN0YWxlIGJpbmRpbmcgYmVm
b3JlIG11dGF0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjYzNDI1CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogYWRtaW4gdW5sb2NrIGRyYWZ0IHByZXNlcnZlcyBnYW1lIHJvd3Mg
YW5kIHJlY29yZHMgcmVjb3ZlcnkgYXVkaXQKb2sgMzk4IC0gYWRtaW4gdW5sb2NrIGRyYWZ0IHBy
ZXNlcnZlcyBnYW1lIHJvd3MgYW5kIHJlY29yZHMgcmVjb3ZlcnkgYXVkaXQKICAtLS0KICBkdXJh
dGlvbl9tczogMC4xODI5OTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjb21taXQg
ZW5mb3JjZXMgZGV2aWNlIGJpbmRpbmcgYWZ0ZXIgbXVsdGktZGV2aWNlIHBlcm1pc3Npb24gaXMg
cmV2b2tlZApvayAzOTkgLSBjb21taXQgZW5mb3JjZXMgZGV2aWNlIGJpbmRpbmcgYWZ0ZXIgbXVs
dGktZGV2aWNlIHBlcm1pc3Npb24gaXMgcmV2b2tlZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjk2
ODU0NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbW1pdCBob2xkcyBvd25lciBs
b2NrIGJlZm9yZSBnYW1lIGxvY2sgYW5kIGd1YXJkZWQgdXBkYXRlCm9rIDQwMCAtIGNvbW1pdCBo
b2xkcyBvd25lciBsb2NrIGJlZm9yZSBnYW1lIGxvY2sgYW5kIGd1YXJkZWQgdXBkYXRlCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuNzc4NDQ4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
Y29tbWl0IHZlcmlmaWVzIGV4YWN0IHdyaXRlciB0b2tlbiBnZW5lcmF0aW9uIGFuZCBhdXRoIHNl
c3Npb24gYmVmb3JlIHdyaXRlCm9rIDQwMSAtIGNvbW1pdCB2ZXJpZmllcyBleGFjdCB3cml0ZXIg
dG9rZW4gZ2VuZXJhdGlvbiBhbmQgYXV0aCBzZXNzaW9uIGJlZm9yZSB3cml0ZQogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjEzMzE4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmV2aXNp
b24gbWlzbWF0Y2ggcmV0dXJucyBiZWZvcmUgZ2FtZSB1cGRhdGUgYW5kIGluY3JlbWVudHMgcmV2
aXNpb24gb24gc3VjY2VzcwpvayA0MDIgLSByZXZpc2lvbiBtaXNtYXRjaCByZXR1cm5zIGJlZm9y
ZSBnYW1lIHVwZGF0ZSBhbmQgaW5jcmVtZW50cyByZXZpc2lvbiBvbiBzdWNjZXNzCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuMTE4NDc4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogdW5z
YWZlIFJQQyBndWFyZCBwcmVjZWRlcyB0cmFuc2FjdGlvbiBhbmQgYW55IGdyYW50Cm9rIDQwMyAt
IHVuc2FmZSBSUEMgZ3VhcmQgcHJlY2VkZXMgdHJhbnNhY3Rpb24gYW5kIGFueSBncmFudAogIC0t
LQogIGR1cmF0aW9uX21zOiAxLjAwNDQ5NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IHVuc2FmZSBSUEMgZ3VhcmQgaXMgdW5jb25kaXRpb25hbCB0b3AtbGV2ZWwgZXhjZXB0aW9uCm9r
IDQwNCAtIHVuc2FmZSBSUEMgZ3VhcmQgaXMgdW5jb25kaXRpb25hbCB0b3AtbGV2ZWwgZXhjZXB0
aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjQ2OTExCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogYWRtaW4gdW5sb2NrIGRyYWZ0IGNvbnRhaW5zIG5vIGV4ZWN1dGFibGUgZ3JhbnQK
b2sgNDA1IC0gYWRtaW4gdW5sb2NrIGRyYWZ0IGNvbnRhaW5zIG5vIGV4ZWN1dGFibGUgZ3JhbnQK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4xNTcyMzYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBpbnRlZ3JhdGlvbiBnYXRlIGNhbm5vdCBiZSBjbGFpbWVkIGZyb20gc3RhdGljIE5vZGUg
dGVzdHMKb2sgNDA2IC0gaW50ZWdyYXRpb24gZ2F0ZSBjYW5ub3QgYmUgY2xhaW1lZCBmcm9tIHN0
YXRpYyBOb2RlIHRlc3RzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTA2MDQ5CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogYmV0YSByZWplY3RzIGFub3RoZXIgd3JpdGVyIGRldmljZSB1
bmRlciBvd25lciBsb2NrIGJlZm9yZSBsZWFzZSByZXZvY2F0aW9uCm9rIDQwNyAtIGJldGEgcmVq
ZWN0cyBhbm90aGVyIHdyaXRlciBkZXZpY2UgdW5kZXIgb3duZXIgbG9jayBiZWZvcmUgbGVhc2Ug
cmV2b2NhdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjgwOTI4NQogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IHByb2R1Y3Rpb24gZGVwbG95bWVudCBhbmQgYnJvd3NlciBjbG91ZCBz
eW5jIHJlbWFpbiBkaXNhYmxlZApvayA0MDggLSBwcm9kdWN0aW9uIGRlcGxveW1lbnQgYW5kIGJy
b3dzZXIgY2xvdWQgc3luYyByZW1haW4gZGlzYWJsZWQKICAtLS0KICBkdXJhdGlvbl9tczogMS44
NzY3OTYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzaW5nbGUgZGV2aWNlIGJldGEg
bXVzdCBub3QgYmxvY2sgc2FtZSBkZXZpY2UgYWZ0ZXIgbG9nb3V0IGFuZCBmcmVzaCBsb2dpbgpv
ayA0MDkgLSBzaW5nbGUgZGV2aWNlIGJldGEgbXVzdCBub3QgYmxvY2sgc2FtZSBkZXZpY2UgYWZ0
ZXIgbG9nb3V0IGFuZCBmcmVzaCBsb2dpbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjc1MDA5Ngog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGRyYWZ0IGFuZCBvYnNvbGV0ZSByZXZpZXcg
Ym90aCByZWZ1c2UgZXhlY3V0aW9uIGJlZm9yZSB0cmFuc2FjdGlvbiBvciBEREwKb2sgNDEwIC0g
ZHJhZnQgYW5kIG9ic29sZXRlIHJldmlldyBib3RoIHJlZnVzZSBleGVjdXRpb24gYmVmb3JlIHRy
YW5zYWN0aW9uIG9yIERETAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjk3MzcyMQogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJldmlldyBvcGVuIGNvbnRyYWN0IGlzIGluY29tcGF0aWJs
ZSB3aXRoIHByb3RlY3RlZCBmb3VyLWFyZ3VtZW50IGRyYWZ0Cm9rIDQxMSAtIHJldmlldyBvcGVu
IGNvbnRyYWN0IGlzIGluY29tcGF0aWJsZSB3aXRoIHByb3RlY3RlZCBmb3VyLWFyZ3VtZW50IGRy
YWZ0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTM1ODU0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogZHJhZnQgcmV0YWlucyBoaWdoLXdhdGVyIGF1dGggc2Vzc2lvbiBhbmQgZXhwZWN0
ZWQgY2xvdWQgaWRlbnRpdHkgY2hlY2tzCm9rIDQxMiAtIGRyYWZ0IHJldGFpbnMgaGlnaC13YXRl
ciBhdXRoIHNlc3Npb24gYW5kIGV4cGVjdGVkIGNsb3VkIGlkZW50aXR5IGNoZWNrcwogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjExNDYwMgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0
YWdlIDEzIHByZWZsaWdodCBkZW5pZXMgbWlzc2luZyBlbnZpcm9ubWVudCBhbmQgbmV2ZXIgY29u
bmVjdHMKb2sgNDEzIC0gU3RhZ2UgMTMgcHJlZmxpZ2h0IGRlbmllcyBtaXNzaW5nIGVudmlyb25t
ZW50IGFuZCBuZXZlciBjb25uZWN0cwogIC0tLQogIGR1cmF0aW9uX21zOiAxLjMzODg5OQogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlIDEzIHByZWZsaWdodCBhY2NlcHRzIGV4
cGxpY2l0IGRpc3Bvc2FibGUgbG9jYWwgdGFyZ2V0Cm9rIDQxNCAtIFN0YWdlIDEzIHByZWZsaWdo
dCBhY2NlcHRzIGV4cGxpY2l0IGRpc3Bvc2FibGUgbG9jYWwgdGFyZ2V0CiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuNzU2NDQ1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTMg
cHJlZmxpZ2h0IGJsb2NrcyBwcm9kdWN0aW9uLW1hcmtlZCB0YXJnZXQKb2sgNDE1IC0gU3RhZ2Ug
MTMgcHJlZmxpZ2h0IGJsb2NrcyBwcm9kdWN0aW9uLW1hcmtlZCB0YXJnZXQKICAtLS0KICBkdXJh
dGlvbl9tczogMC40NTY5MzYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZSAx
MyBwcmVmbGlnaHQgYmxvY2tzIG5vbi1wb3N0Z3JlcyBVUkxzIGFuZCBtaXNzaW5nIGFja25vd2xl
ZGdtZW50Cm9rIDQxNiAtIFN0YWdlIDEzIHByZWZsaWdodCBibG9ja3Mgbm9uLXBvc3RncmVzIFVS
THMgYW5kIG1pc3NpbmcgYWNrbm93bGVkZ21lbnQKICAtLS0KICBkdXJhdGlvbl9tczogMC4zNTUw
NTMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZSAxMyBwcmVmbGlnaHQgcmVq
ZWN0cyBub24tZGlzcG9zYWJsZSBkYXRhYmFzZSBuYW1lcwpvayA0MTcgLSBTdGFnZSAxMyBwcmVm
bGlnaHQgcmVqZWN0cyBub24tZGlzcG9zYWJsZSBkYXRhYmFzZSBuYW1lcwogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjM1NTgwNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlIDEz
IHByZWZsaWdodCByZXF1aXJlcyBzZXBhcmF0ZSBhY2tub3dsZWRnbWVudCBmb3IgcmVtb3RlIHRh
cmdldHMKb2sgNDE4IC0gU3RhZ2UgMTMgcHJlZmxpZ2h0IHJlcXVpcmVzIHNlcGFyYXRlIGFja25v
d2xlZGdtZW50IGZvciByZW1vdGUgdGFyZ2V0cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIxNjU2
NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlIDEzIHByZWZsaWdodCByZWpl
Y3RzIG1pc3NpbmcgaXNvbGF0ZWQgY3JlZGVudGlhbHMKb2sgNDE5IC0gU3RhZ2UgMTMgcHJlZmxp
Z2h0IHJlamVjdHMgbWlzc2luZyBpc29sYXRlZCBjcmVkZW50aWFscwogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjM0MDcwMQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlIDEzIHBy
ZWZsaWdodCByZWplY3RzIGNvbm5lY3Rpb24gcXVlcnkgb3ZlcnJpZGVzCm9rIDQyMCAtIFN0YWdl
IDEzIHByZWZsaWdodCByZWplY3RzIGNvbm5lY3Rpb24gcXVlcnkgb3ZlcnJpZGVzCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuNDY1ODc5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3Rh
Z2UgMTMgcHJlZmxpZ2h0IHJlamVjdHMgVVJMIGZyYWdtZW50cwpvayA0MjEgLSBTdGFnZSAxMyBw
cmVmbGlnaHQgcmVqZWN0cyBVUkwgZnJhZ21lbnRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDcz
MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlIDEzIHByZWZsaWdodCByZWpl
Y3RzIGVuY29kZWQgZGF0YWJhc2Ugc2VwYXJhdG9ycwpvayA0MjIgLSBTdGFnZSAxMyBwcmVmbGln
aHQgcmVqZWN0cyBlbmNvZGVkIGRhdGFiYXNlIHNlcGFyYXRvcnMKICAtLS0KICBkdXJhdGlvbl9t
czogMC41MDIyMTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZSAxMyBwcmVm
bGlnaHQgcmVqZWN0cyBlbmNvZGVkIGRvdCBzZWdtZW50cwpvayA0MjMgLSBTdGFnZSAxMyBwcmVm
bGlnaHQgcmVqZWN0cyBlbmNvZGVkIGRvdCBzZWdtZW50cwogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjI2MjYyNQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlIDEzIHByZWZsaWdo
dCByZWplY3RzIGRvdWJsZS1lbmNvZGVkIGNvbnRyb2wgc2VxdWVuY2VzCm9rIDQyNCAtIFN0YWdl
IDEzIHByZWZsaWdodCByZWplY3RzIGRvdWJsZS1lbmNvZGVkIGNvbnRyb2wgc2VxdWVuY2VzCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMTg4MDMyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogU3RhZ2UgMTMgcHJlZmxpZ2h0IHJlamVjdHMgbmVzdGVkIGRhdGFiYXNlIHBhdGhzCm9rIDQy
NSAtIFN0YWdlIDEzIHByZWZsaWdodCByZWplY3RzIG5lc3RlZCBkYXRhYmFzZSBwYXRocwogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjIxNTUxMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IFN0YWdlIDEzIHByZWZsaWdodCByZWplY3RzIGRvdWJsZS1zbGFzaCBkYXRhYmFzZSBwYXRocwpv
ayA0MjYgLSBTdGFnZSAxMyBwcmVmbGlnaHQgcmVqZWN0cyBkb3VibGUtc2xhc2ggZGF0YWJhc2Ug
cGF0aHMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNTgxMzcKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBTdGFnZSAxMyBwcmVmbGlnaHQgcmVqZWN0cyBibGFuayBjcmVkZW50aWFscwpv
ayA0MjcgLSBTdGFnZSAxMyBwcmVmbGlnaHQgcmVqZWN0cyBibGFuayBjcmVkZW50aWFscwogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjIyMTQxMgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IG1hbGZvcm1lZCBwZXJjZW50IGVuY29kZWQgZGF0YWJhc2UgbmFtZSBmYWlscyBjbG9zZWQgd2l0
aG91dCB0aHJvd2luZwpvayA0MjggLSBtYWxmb3JtZWQgcGVyY2VudCBlbmNvZGVkIGRhdGFiYXNl
IG5hbWUgZmFpbHMgY2xvc2VkIHdpdGhvdXQgdGhyb3dpbmcKICAtLS0KICBkdXJhdGlvbl9tczog
MS4xOTMzMgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHZhbGlkIGRpc3Bvc2FibGUg
cGF0aCByZW1haW5zIGFjY2VwdGVkIGJ5IHJlYWQtb25seSBwcmVmbGlnaHQKb2sgNDI5IC0gdmFs
aWQgZGlzcG9zYWJsZSBwYXRoIHJlbWFpbnMgYWNjZXB0ZWQgYnkgcmVhZC1vbmx5IHByZWZsaWdo
dAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM3MjE4OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IHJlamVjdHMgVVJMIGNyZWRlbnRpYWxzIGNvbnRhaW5pbmcgZW5jb2RlZCBjb250cm9s
IGNoYXJhY3RlcnMKb2sgNDMwIC0gcmVqZWN0cyBVUkwgY3JlZGVudGlhbHMgY29udGFpbmluZyBl
bmNvZGVkIGNvbnRyb2wgY2hhcmFjdGVycwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIwOTM1NAog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHBhcmFsbGVsIFBvc3RncmVTUUwgdGVzdCBw
bGFuIGV4cGxpY2l0bHkgZm9yYmlkcyBwcm9kdWN0aW9uIGFuZCByZXF1aXJlcyBkaXNwb3NhYmxl
IGRhdGFiYXNlCm9rIDQzMSAtIHBhcmFsbGVsIFBvc3RncmVTUUwgdGVzdCBwbGFuIGV4cGxpY2l0
bHkgZm9yYmlkcyBwcm9kdWN0aW9uIGFuZCByZXF1aXJlcyBkaXNwb3NhYmxlIGRhdGFiYXNlCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDEuMjM5MTE5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogcGFyYWxsZWwgcGxhbiBjb3ZlcnMgY29tcGV0aW5nIGNvbW1pdHMgYW5kIHN0YWxlIHJldmlz
aW9uIHJlamVjdGlvbgpvayA0MzIgLSBwYXJhbGxlbCBwbGFuIGNvdmVycyBjb21wZXRpbmcgY29t
bWl0cyBhbmQgc3RhbGUgcmV2aXNpb24gcmVqZWN0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MTY4NDQzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcGFyYWxsZWwgcGxhbiBjb3Zl
cnMgZGlzcGxhY2VkIHNlc3Npb24gYW5kIHJvbGxiYWNrIHdpdGhvdXQgcmVseWluZyBvbiBzdGF0
aWMgdGVzdHMKb2sgNDMzIC0gcGFyYWxsZWwgcGxhbiBjb3ZlcnMgZGlzcGxhY2VkIHNlc3Npb24g
YW5kIHJvbGxiYWNrIHdpdGhvdXQgcmVseWluZyBvbiBzdGF0aWMgdGVzdHMKICAtLS0KICBkdXJh
dGlvbl9tczogMC4yMTAyOTYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzaW5nbGUt
ZGV2aWNlIGJldGEgYmluZHMgdG8gcmVnaXN0ZXJlZCBkZXZpY2UgZXZlbiBhZnRlciBsb2dvdXQK
b2sgNDM0IC0gc2luZ2xlLWRldmljZSBiZXRhIGJpbmRzIHRvIHJlZ2lzdGVyZWQgZGV2aWNlIGV2
ZW4gYWZ0ZXIgbG9nb3V0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMTIwNjYyCiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogZGV2aWNlIGJpbmRpbmcgb2NjdXJzIHVuZGVyIGFjY291bnQg
bG9jayBiZWZvcmUgY2xvdWQgc3RhdGUgbXV0YXRpb24Kb2sgNDM1IC0gZGV2aWNlIGJpbmRpbmcg
b2NjdXJzIHVuZGVyIGFjY291bnQgbG9jayBiZWZvcmUgY2xvdWQgc3RhdGUgbXV0YXRpb24KICAt
LS0KICBkdXJhdGlvbl9tczogMC4xNTU5OTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBuZXcgYmV0YSBndWFyZCBpcyBub3QgZGVwbG95YWJsZSBvciBhY3RpdmUgaW4gYnJvd3Nlcgpv
ayA0MzYgLSBuZXcgYmV0YSBndWFyZCBpcyBub3QgZGVwbG95YWJsZSBvciBhY3RpdmUgaW4gYnJv
d3NlcgogIC0tLQogIGR1cmF0aW9uX21zOiAxLjcyNTc4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogaGlzdG9yaWNhbCBkZXZpY2UgbG9jayBvbmx5IGNvbnNpZGVycyBkZXZpY2VzIHRo
YXQgaGF2ZSBoZWxkIHdyaXRlciByaWdodHMKb2sgNDM3IC0gaGlzdG9yaWNhbCBkZXZpY2UgbG9j
ayBvbmx5IGNvbnNpZGVycyBkZXZpY2VzIHRoYXQgaGF2ZSBoZWxkIHdyaXRlciByaWdodHMKICAt
LS0KICBkdXJhdGlvbl9tczogMS4wOTAyMTYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiByZWFkZXIgZW5yb2xsbWVudCBjYW5ub3QgcHJvbW90ZSBpdHNlbGYgaW50byBhIHBlcm1hbmVu
dCB3cml0ZXIgYmluZGluZwpvayA0MzggLSByZWFkZXIgZW5yb2xsbWVudCBjYW5ub3QgcHJvbW90
ZSBpdHNlbGYgaW50byBhIHBlcm1hbmVudCB3cml0ZXIgYmluZGluZwogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjM0NTk1OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlIDEzOiBk
cmFmdCBTUUwgcmVtYWlucyBmYWlsLWNsb3NlZCBiZWZvcmUgdHJhbnNhY3Rpb24Kb2sgNDM5IC0g
U3RhZ2UgMTM6IGRyYWZ0IFNRTCByZW1haW5zIGZhaWwtY2xvc2VkIGJlZm9yZSB0cmFuc2FjdGlv
bgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjcxOTA1OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IFN0YWdlIDEzOiBwbGFuIHJlcXVpcmVzIGRpc3Bvc2FibGUgZGF0YWJhc2UgYW5kIFN1
cGFiYXNlIEF1dGggZml4dHVyZXMKb2sgNDQwIC0gU3RhZ2UgMTM6IHBsYW4gcmVxdWlyZXMgZGlz
cG9zYWJsZSBkYXRhYmFzZSBhbmQgU3VwYWJhc2UgQXV0aCBmaXh0dXJlcwogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjU1MzA3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTM6
IGFsbCBrZXkgUlBDIGRlZmluaXRpb25zIHJlbWFpbiBwcmVzZW50IGZvciBmdXR1cmUgaW50ZWdy
YXRpb24Kb2sgNDQxIC0gU3RhZ2UgMTM6IGFsbCBrZXkgUlBDIGRlZmluaXRpb25zIHJlbWFpbiBw
cmVzZW50IGZvciBmdXR1cmUgaW50ZWdyYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4yNzI2
NDkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFkLW9ubHkgcHJlZmxpZ2h0IGNv
bnRhaW5zIG5vIFNRTCBtdXRhdGlvbiBvciBwcml2aWxlZ2UtY2hhbmdpbmcgY29tbWFuZHMKb2sg
NDQyIC0gcmVhZC1vbmx5IHByZWZsaWdodCBjb250YWlucyBubyBTUUwgbXV0YXRpb24gb3IgcHJp
dmlsZWdlLWNoYW5naW5nIGNvbW1hbmRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuOTYwNDIxCiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZC1vbmx5IHByZWZsaWdodCBlbnVtZXJh
dGVzIHJlcXVpcmVkIHRhYmxlcyBhbmQgYWxsIHNpeCBSUEMgZW50cnlwb2ludHMKb2sgNDQzIC0g
cmVhZC1vbmx5IHByZWZsaWdodCBlbnVtZXJhdGVzIHJlcXVpcmVkIHRhYmxlcyBhbmQgYWxsIHNp
eCBSUEMgZW50cnlwb2ludHMKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNDk5MzUKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBSUEMgZHJhZnQgcmVtYWlucyBleHBsaWNpdGx5IGJsb2Nr
ZWQgZnJvbSBhY2NpZGVudGFsIGRlcGxveW1lbnQKb2sgNDQ0IC0gUlBDIGRyYWZ0IHJlbWFpbnMg
ZXhwbGljaXRseSBibG9ja2VkIGZyb20gYWNjaWRlbnRhbCBkZXBsb3ltZW50CiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMTYxOTYzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZC1v
bmx5IGludmVudG9yeSBsaXN0cyBleGFjdGx5IHNpeCBzeW5jIFJQQyBuYW1lcwpvayA0NDUgLSBy
ZWFkLW9ubHkgaW52ZW50b3J5IGxpc3RzIGV4YWN0bHkgc2l4IHN5bmMgUlBDIG5hbWVzCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDEuMjM4MTU4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
UlBDIGludmVudG9yeSBjaGVja3MgZWZmZWN0aXZlIGFub24gYW5kIGF1dGhlbnRpY2F0ZWQgRVhF
Q1VURSByaWdodHMKb2sgNDQ2IC0gUlBDIGludmVudG9yeSBjaGVja3MgZWZmZWN0aXZlIGFub24g
YW5kIGF1dGhlbnRpY2F0ZWQgRVhFQ1VURSByaWdodHMKICAtLS0KICBkdXJhdGlvbl9tczogMC4x
NzgyOTcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBSUEMgaW52ZW50b3J5IHJlY29y
ZHMgc2VjdXJpdHkgZGVmaW5lciBzdGF0dXMgd2l0aG91dCB3cml0aW5nCm9rIDQ0NyAtIFJQQyBp
bnZlbnRvcnkgcmVjb3JkcyBzZWN1cml0eSBkZWZpbmVyIHN0YXR1cyB3aXRob3V0IHdyaXRpbmcK
ICAtLS0KICBkdXJhdGlvbl9tczogMC41NzAzMzYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBSUEMgaW52ZW50b3J5IGluY2x1ZGVzIGFsbCBzaXggc3luYyBlbnRyeSBwb2ludHMKb2sg
NDQ4IC0gUlBDIGludmVudG9yeSBpbmNsdWRlcyBhbGwgc2l4IHN5bmMgZW50cnkgcG9pbnRzCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDEuMDAxODUzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogUlBDIGludmVudG9yeSByZXBvcnRzIGFub255bW91cyBhbmQgYXV0aGVudGljYXRlZCBleGVj
dXRlIHByaXZpbGVnZXMKb2sgNDQ5IC0gUlBDIGludmVudG9yeSByZXBvcnRzIGFub255bW91cyBh
bmQgYXV0aGVudGljYXRlZCBleGVjdXRlIHByaXZpbGVnZXMKICAtLS0KICBkdXJhdGlvbl9tczog
MC4xNzgxMTcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBSUEMgaW52ZW50b3J5IGlk
ZW50aWZpZXMgU0VDVVJJVFkgREVGSU5FUiBzdGF0dXMgYW5kIGV4YWN0IHNpZ25hdHVyZXMKb2sg
NDUwIC0gUlBDIGludmVudG9yeSBpZGVudGlmaWVzIFNFQ1VSSVRZIERFRklORVIgc3RhdHVzIGFu
ZCBleGFjdCBzaWduYXR1cmVzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjAzNTg2CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogd3JpdGVyIGNvbW1pdCBiaW5kcyB0b2tlbiwgZ2VuZXJh
dGlvbiwgYXV0aCBzZXNzaW9uIGFuZCBnYW1lIHdyaXRlciBsZWFzZQpvayA0NTEgLSB3cml0ZXIg
Y29tbWl0IGJpbmRzIHRva2VuLCBnZW5lcmF0aW9uLCBhdXRoIHNlc3Npb24gYW5kIGdhbWUgd3Jp
dGVyIGxlYXNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNzk1MDEzCiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogY29tbWl0IHJlamVjdHMgZGlzcGxhY2VkIGxvZ2luIGV2ZW4gYWZ0ZXIg
bmV3ZXIgYXV0aCBzZXNzaW9uIGRpc2FwcGVhcnMKb2sgNDUyIC0gY29tbWl0IHJlamVjdHMgZGlz
cGxhY2VkIGxvZ2luIGV2ZW4gYWZ0ZXIgbmV3ZXIgYXV0aCBzZXNzaW9uIGRpc2FwcGVhcnMKICAt
LS0KICBkdXJhdGlvbl9tczogMC4xNzU0NTMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBsZWFzZSBzdGF0dXMgcmVmdXNlcyByZXZva2VkIGFuZCBkaXNwbGFjZWQgc2Vzc2lvbnMKb2sg
NDUzIC0gbGVhc2Ugc3RhdHVzIHJlZnVzZXMgcmV2b2tlZCBhbmQgZGlzcGxhY2VkIHNlc3Npb25z
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTIwMjAxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogY29tbWl0IHNlcmlhbGl6ZXMgb3duZXIgYmVmb3JlIGxvY2tpbmcgY3VycmVudCBnYW1l
Cm9rIDQ1NCAtIGNvbW1pdCBzZXJpYWxpemVzIG93bmVyIGJlZm9yZSBsb2NraW5nIGN1cnJlbnQg
Z2FtZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjc3NzUxNwogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IGNvbW1pdCB2YWxpZGF0ZXMgd3JpdGVyIGxlYXNlIGFuZCByZXZpc2lvbiBiZWZv
cmUgY2hhbmdpbmcgZ2FtZSBkYXRhCm9rIDQ1NSAtIGNvbW1pdCB2YWxpZGF0ZXMgd3JpdGVyIGxl
YXNlIGFuZCByZXZpc2lvbiBiZWZvcmUgY2hhbmdpbmcgZ2FtZSBkYXRhCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuMTU3Mzg3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29tbWl0IHJl
amVjdHMgc3RhbGUgcmV2aXNpb25zIGFuZCByZWNvcmRzIGNvbmZsaWN0cyB3aXRob3V0IG92ZXJ3
cml0aW5nIHNjb3JlCm9rIDQ1NiAtIGNvbW1pdCByZWplY3RzIHN0YWxlIHJldmlzaW9ucyBhbmQg
cmVjb3JkcyBjb25mbGljdHMgd2l0aG91dCBvdmVyd3JpdGluZyBzY29yZQogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjEyMTEzMgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFkbWluIHVu
bG9jayByZWZ1c2VzIHRhcmdldCBhZG1pbiBhbmQgc2VsZiB1bmxvY2sKb2sgNDU3IC0gYWRtaW4g
dW5sb2NrIHJlZnVzZXMgdGFyZ2V0IGFkbWluIGFuZCBzZWxmIHVubG9jawogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjgwNTQxOAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVubG9jayBz
ZXJpYWxpemVzIHRhcmdldCB3cml0ZXIgYmluZGluZyBiZWZvcmUgY2hlY2tpbmcgYW5kIHJldm9r
aW5nCm9rIDQ1OCAtIHVubG9jayBzZXJpYWxpemVzIHRhcmdldCB3cml0ZXIgYmluZGluZyBiZWZv
cmUgY2hlY2tpbmcgYW5kIHJldm9raW5nCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjY2OTAxCiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogdW5sb2NrIGlzIGZhaWwtY2xvc2VkIGZvciBh
bWJpZ3VvdXMgd3JpdGVyIGJpbmRpbmcgYW5kIGRvZXMgbm90IGRlbGV0ZSBnYW1lIHN0YXRlCm9r
IDQ1OSAtIHVubG9jayBpcyBmYWlsLWNsb3NlZCBmb3IgYW1iaWd1b3VzIHdyaXRlciBiaW5kaW5n
IGFuZCBkb2VzIG5vdCBkZWxldGUgZ2FtZSBzdGF0ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM3
NTgxNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVubG9jayBTUUwgY2Fubm90IHJ1
biBhY2NpZGVudGFsbHkgYW5kIGxhY2tzIGV4ZWN1dGUgZ3JhbnRzCm9rIDQ2MCAtIHVubG9jayBT
UUwgY2Fubm90IHJ1biBhY2NpZGVudGFsbHkgYW5kIGxhY2tzIGV4ZWN1dGUgZ3JhbnRzCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMzMwNTk2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
dW5sb2NrIGFuZCB3cml0ZXItb3BlbiBzZXJpYWxpemUgb24gdGhlIHNhbWUgYWNjb3VudCByb3cK
b2sgNDYxIC0gdW5sb2NrIGFuZCB3cml0ZXItb3BlbiBzZXJpYWxpemUgb24gdGhlIHNhbWUgYWNj
b3VudCByb3cKICAtLS0KICBkdXJhdGlvbl9tczogMC45MjcxMDEKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiB1bmxvY2sgcHJlc2VydmVzIGF1dGggbG9naW4gaGlnaC13YXRlciBjaGVj
a2VkIGJ5IG9wZW4gYW5kIGNvbW1pdApvayA0NjIgLSB1bmxvY2sgcHJlc2VydmVzIGF1dGggbG9n
aW4gaGlnaC13YXRlciBjaGVja2VkIGJ5IG9wZW4gYW5kIGNvbW1pdAogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjkzOTA3OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJldm9rZWQgd3Jp
dGVyIGNhbm5vdCBjb21taXQgd2l0aG91dCBhY3RpdmUgd3JpdGVyLCB2YWxpZCB0b2tlbiwgZ2Vu
ZXJhdGlvbiBhbmQgYXV0aCBzZXNzaW9uCm9rIDQ2MyAtIHJldm9rZWQgd3JpdGVyIGNhbm5vdCBj
b21taXQgd2l0aG91dCBhY3RpdmUgd3JpdGVyLCB2YWxpZCB0b2tlbiwgZ2VuZXJhdGlvbiBhbmQg
YXV0aCBzZXNzaW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuOTQyNTk1CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogYWRtaW4gdW5sb2NrIGhhcyBubyBwcm9kdWN0aW9uIGdyYW50IGFu
ZCBjYW5ub3QgbW9kaWZ5IGdhbWUgZGF0YQpvayA0NjQgLSBhZG1pbiB1bmxvY2sgaGFzIG5vIHBy
b2R1Y3Rpb24gZ3JhbnQgYW5kIGNhbm5vdCBtb2RpZnkgZ2FtZSBkYXRhCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuOTAzMzc1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWRtaW4gdW5s
b2NrIHJldm9rZXMgd3JpdGVyIGNyZWRlbnRpYWxzIGF0b21pY2FsbHkKb2sgNDY1IC0gYWRtaW4g
dW5sb2NrIHJldm9rZXMgd3JpdGVyIGNyZWRlbnRpYWxzIGF0b21pY2FsbHkKICAtLS0KICBkdXJh
dGlvbl9tczogMS4wMTU2MzQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhZG1pbiB1
bmxvY2sgcHJlc2VydmVzIHNlc3Npb24gaGlzdG9yeSBmb3Igc3RhbGUtbG9naW4gcmVqZWN0aW9u
Cm9rIDQ2NiAtIGFkbWluIHVubG9jayBwcmVzZXJ2ZXMgc2Vzc2lvbiBoaXN0b3J5IGZvciBzdGFs
ZS1sb2dpbiByZWplY3Rpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC40NTM1NDEKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBydW50aW1lIGdhdGUgcmVtYWlucyBleHBsaWNpdGx5IE5P
VCBFWEVDVVRFRApvayA0NjcgLSBydW50aW1lIGdhdGUgcmVtYWlucyBleHBsaWNpdGx5IE5PVCBF
WEVDVVRFRAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjk5MTIyNwogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IHJ1bnRpbWUgZ2F0ZSByZXF1aXJlcyBkaXNwb3NhYmxlIGRhdGFiYXNlIGFu
ZCBhdXRoLXNlc3Npb24gZml4dHVyZXMKb2sgNDY4IC0gcnVudGltZSBnYXRlIHJlcXVpcmVzIGRp
c3Bvc2FibGUgZGF0YWJhc2UgYW5kIGF1dGgtc2Vzc2lvbiBmaXh0dXJlcwogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjM0NTgxOQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVubG9jayBh
dWRpdCBpcyBhcHBlbmQtb25seSBhbmQgcHJlc2VydmVzIGdhbWUgc3RhdGUKb2sgNDY5IC0gdW5s
b2NrIGF1ZGl0IGlzIGFwcGVuZC1vbmx5IGFuZCBwcmVzZXJ2ZXMgZ2FtZSBzdGF0ZQogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjQyMDQ3MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVu
bG9jayBhbmQgUlBDIGRyYWZ0cyByZW1haW4gaW50ZW50aW9uYWxseSBibG9ja2VkCm9rIDQ3MCAt
IHVubG9jayBhbmQgUlBDIGRyYWZ0cyByZW1haW4gaW50ZW50aW9uYWxseSBibG9ja2VkCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuNzkyNDU5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
b3BlbiBtYXBzIGRldmljZSBhbmQgZ2FtZSB0byBuYW1lZCBSUEMgYXJndW1lbnRzCm9rIDQ3MSAt
IG9wZW4gbWFwcyBkZXZpY2UgYW5kIGdhbWUgdG8gbmFtZWQgUlBDIGFyZ3VtZW50cwogIC0tLQog
IGR1cmF0aW9uX21zOiAyLjMzMDU1NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNv
bW1pdCBtYXBzIGdlbmVyYXRpb24gdG9rZW4gcmV2aXNpb24gYW5kIGdhbWUgZXhhY3RseQpvayA0
NzIgLSBjb21taXQgbWFwcyBnZW5lcmF0aW9uIHRva2VuIHJldmlzaW9uIGFuZCBnYW1lIGV4YWN0
bHkKICAtLS0KICBkdXJhdGlvbl9tczogMC4zODk1MDQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBwZXJtaXNzaW9uIGVycm9yIHJldGFpbnMgU3VwYWJhc2UgY29kZQpvayA0NzMgLSBw
ZXJtaXNzaW9uIGVycm9yIHJldGFpbnMgU3VwYWJhc2UgY29kZQogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjY1MjYxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbWFsZm9ybWVkIHNlcnZl
ciByZXNwb25zZSBpcyByZWplY3RlZApvayA0NzQgLSBtYWxmb3JtZWQgc2VydmVyIHJlc3BvbnNl
IGlzIHJlamVjdGVkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuODA1MzU5CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogbm8gbmV0d29yayByZXF1ZXN0IG9uIG1pc3NpbmcgY29tbWl0IGNy
ZWRlbnRpYWxzCm9rIDQ3NSAtIG5vIG5ldHdvcmsgcmVxdWVzdCBvbiBtaXNzaW5nIGNvbW1pdCBj
cmVkZW50aWFscwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIzMDM5NgogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IG9wZW4gc25hcHNob3RzIGdhbWUgYmVmb3JlIGFzeW5jaHJvbm91cyB0
cmFuc3BvcnQgdXNlcyBpdApvayA0NzYgLSBvcGVuIHNuYXBzaG90cyBnYW1lIGJlZm9yZSBhc3lu
Y2hyb25vdXMgdHJhbnNwb3J0IHVzZXMgaXQKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNzcyNzYK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjb21taXQgc25hcHNob3RzIGdhbWUgYW5k
IHJlZnVzZXMgbm9uLW9iamVjdCBwYXlsb2FkIGJlZm9yZSBuZXR3b3JrIGNhbGwKb2sgNDc3IC0g
Y29tbWl0IHNuYXBzaG90cyBnYW1lIGFuZCByZWZ1c2VzIG5vbi1vYmplY3QgcGF5bG9hZCBiZWZv
cmUgbmV0d29yayBjYWxsCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjU5NjEKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiBjbG91ZCBhZG9wdGlvbiByZXF1aXJlcyBtYXRjaGluZyBnYW1l
IGlkZW50aXR5IGFuZCByZXZpc2lvbiBiZWZvcmUgUlBDCm9rIDQ3OCAtIGNsb3VkIGFkb3B0aW9u
IHJlcXVpcmVzIG1hdGNoaW5nIGdhbWUgaWRlbnRpdHkgYW5kIHJldmlzaW9uIGJlZm9yZSBSUEMK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4zMDI0NjQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBjbG91ZCBhZG9wdGlvbiBmb3J3YXJkcyBib3RoIGV4cGVjdGVkIGdhbWUgaWRlbnRpdHkg
YW5kIHJldmlzaW9uCm9rIDQ3OSAtIGNsb3VkIGFkb3B0aW9uIGZvcndhcmRzIGJvdGggZXhwZWN0
ZWQgZ2FtZSBpZGVudGl0eSBhbmQgcmV2aXNpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4zMjEx
NDEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFkLW9ubHkgc2Vzc2lvbiBmZXRj
aCBtYXBzIGRldmljZSBJRCB0byBtYWhqb25nX3N5bmNfcmVhZApvayA0ODAgLSByZWFkLW9ubHkg
c2Vzc2lvbiBmZXRjaCBtYXBzIGRldmljZSBJRCB0byBtYWhqb25nX3N5bmNfcmVhZAogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjUxNzYyNwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJl
YWQgcmVmdXNlcyBhYnNlbnQgZGV2aWNlIElEIGJlZm9yZSBuZXR3b3JrIGFjY2VzcwpvayA0ODEg
LSByZWFkIHJlZnVzZXMgYWJzZW50IGRldmljZSBJRCBiZWZvcmUgbmV0d29yayBhY2Nlc3MKICAt
LS0KICBkdXJhdGlvbl9tczogMC4xODk1NzUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBsZWFzZSBwcm9iZSBtYXBzIGlkZW50aXR5IGFuZCBnZW5lcmF0aW9uIHdpdGhvdXQgd3JpdGVy
IGNyZWRlbnRpYWxzCm9rIDQ4MiAtIGxlYXNlIHByb2JlIG1hcHMgaWRlbnRpdHkgYW5kIGdlbmVy
YXRpb24gd2l0aG91dCB3cml0ZXIgY3JlZGVudGlhbHMKICAtLS0KICBkdXJhdGlvbl9tczogMC4x
NzI5NzkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBsZWFzZSBwcm9iZSByZWplY3Rz
IG1hbGZvcm1lZCBnZW5lcmF0aW9uIGJlZm9yZSBSUEMKb2sgNDgzIC0gbGVhc2UgcHJvYmUgcmVq
ZWN0cyBtYWxmb3JtZWQgZ2VuZXJhdGlvbiBiZWZvcmUgUlBDCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMTQ4MTEzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2VydmVyIGNoZWNrcyBj
bG91ZCBtaXNtYXRjaCBiZWZvcmUgcmV2b2tpbmcgcHJldmlvdXMgd3JpdGVyCm9rIDQ4NCAtIHNl
cnZlciBjaGVja3MgY2xvdWQgbWlzbWF0Y2ggYmVmb3JlIHJldm9raW5nIHByZXZpb3VzIHdyaXRl
cgogIC0tLQogIGR1cmF0aW9uX21zOiAzLjE3MzUwMgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IHVuc2FmZSBkcmFmdCByZW1haW5zIGJsb2NrZWQgZnJvbSBwcm9kdWN0aW9uIGRlcGxv
eW1lbnQKb2sgNDg1IC0gdW5zYWZlIGRyYWZ0IHJlbWFpbnMgYmxvY2tlZCBmcm9tIHByb2R1Y3Rp
b24gZGVwbG95bWVudAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIyMTAxMgogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IHdyaXRlciB0YWtlb3ZlciBpbnZhbGlkYXRlcyBkaXNwbGFjZWQg
ZGV2aWNlIGNyZWRlbnRpYWwgaGFzaGVzCm9rIDQ4NiAtIHdyaXRlciB0YWtlb3ZlciBpbnZhbGlk
YXRlcyBkaXNwbGFjZWQgZGV2aWNlIGNyZWRlbnRpYWwgaGFzaGVzCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDEuMjIyMTI0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZC1vbmx5IGVu
cm9sbG1lbnQgbmV2ZXIgcmVjZWl2ZXMgYSB3cml0ZXIgY3JlZGVudGlhbApvayA0ODcgLSByZWFk
LW9ubHkgZW5yb2xsbWVudCBuZXZlciByZWNlaXZlcyBhIHdyaXRlciBjcmVkZW50aWFsCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMjA1MTE4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
YWRhcHRlciBhbmQgZW5naW5lIHBlcmZvcm0gb3Blbiwgc2NvcmUgY29tbWl0LCByZXZpc2lvbiBp
bmNyZW1lbnQKb2sgNDg4IC0gYWRhcHRlciBhbmQgZW5naW5lIHBlcmZvcm0gb3Blbiwgc2NvcmUg
Y29tbWl0LCByZXZpc2lvbiBpbmNyZW1lbnQKICAtLS0KICBkdXJhdGlvbl9tczogMy43MjY4NDIK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBkZXZpY2UgdGFrZW92ZXIgcmV2b2tlcyBw
cmV2aW91cyB3cml0ZXIgYW5kIHByZXNlcnZlcyBpdHMgdW5jb21taXR0ZWQgc2NvcmUKb2sgNDg5
IC0gZGV2aWNlIHRha2VvdmVyIHJldm9rZXMgcHJldmlvdXMgd3JpdGVyIGFuZCBwcmVzZXJ2ZXMg
aXRzIHVuY29tbWl0dGVkIHNjb3JlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuOTAzMjM2CiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbmV3IGRldmljZSB3aXRoIGRpZmZlcmVudCBsb2Nh
bCBnYW1lIGFkb3B0cyBhdXRob3JpdGF0aXZlIGNsb3VkIGFuZCByZXRhaW5zIGJhY2t1cApvayA0
OTAgLSBuZXcgZGV2aWNlIHdpdGggZGlmZmVyZW50IGxvY2FsIGdhbWUgYWRvcHRzIGF1dGhvcml0
YXRpdmUgY2xvdWQgYW5kIHJldGFpbnMgYmFja3VwCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNzY2
MDcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzeW5jIG9wZW4gcmVqZWN0cyB1bnNh
ZmUgaW50ZWdlciBpbiBuZXN0ZWQgc2NvcmUgd2l0aG91dCBSUEMKb2sgNDkxIC0gc3luYyBvcGVu
IHJlamVjdHMgdW5zYWZlIGludGVnZXIgaW4gbmVzdGVkIHNjb3JlIHdpdGhvdXQgUlBDCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDEuMTkzMTkxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
c3luYyBjb21taXQgcmVqZWN0cyB1bnNhZmUgbmVnYXRpdmUgaW50ZWdlciBpbiBoaXN0b3J5IHdp
dGhvdXQgUlBDCm9rIDQ5MiAtIHN5bmMgY29tbWl0IHJlamVjdHMgdW5zYWZlIG5lZ2F0aXZlIGlu
dGVnZXIgaW4gaGlzdG9yeSB3aXRob3V0IFJQQwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIxNDAz
MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN5bmMgb3BlbiBwcmVzZXJ2ZXMgc2Fm
ZSBpbnRlZ2VyIGJvdW5kYXJ5IGFuZCBmcmFjdGlvbmFsIHZhbHVlcwpvayA0OTMgLSBzeW5jIG9w
ZW4gcHJlc2VydmVzIHNhZmUgaW50ZWdlciBib3VuZGFyeSBhbmQgZnJhY3Rpb25hbCB2YWx1ZXMK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4yODM0NzYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBVbmRvIHJlc3RvcmVzIHNjb3JlcywgZGVhbGVyLCByb3VuZCwgYW5kIHdpbmRzIGFuZCBr
ZWVwcyBvbGRlciBoaXN0b3J5Cm9rIDQ5NCAtIFVuZG8gcmVzdG9yZXMgc2NvcmVzLCBkZWFsZXIs
IHJvdW5kLCBhbmQgd2luZHMgYW5kIGtlZXBzIG9sZGVyIGhpc3RvcnkKICAtLS0KICBkdXJhdGlv
bl9tczogMi44MjE5MTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBVbmRvIGZhaWxl
ZCBzYXZlIHJlc3RvcmVzIGVudGlyZSBzdGF0ZQpvayA0OTUgLSBVbmRvIGZhaWxlZCBzYXZlIHJl
c3RvcmVzIGVudGlyZSBzdGF0ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjg0ODIyMwogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFVuZG8gbWlzc2luZyBiZWZvcmUgZG9lcyBub3QgY2hh
bmdlIHN0YXRlCm9rIDQ5NiAtIFVuZG8gbWlzc2luZyBiZWZvcmUgZG9lcyBub3QgY2hhbmdlIHN0
YXRlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNzk1MTAzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogVW5kbyBtYWxmb3JtZWQgYmVmb3JlIGRvZXMgbm90IGNoYW5nZSBzdGF0ZQpvayA0
OTcgLSBVbmRvIG1hbGZvcm1lZCBiZWZvcmUgZG9lcyBub3QgY2hhbmdlIHN0YXRlCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDEuNjA5NDA2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogVW5k
byBtaXNzaW5nIGRlYWxlciBkb2VzIG5vdCBjaGFuZ2Ugc3RhdGUKb2sgNDk4IC0gVW5kbyBtaXNz
aW5nIGRlYWxlciBkb2VzIG5vdCBjaGFuZ2Ugc3RhdGUKICAtLS0KICBkdXJhdGlvbl9tczogMC42
MjQzMzcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBVbmRvIG5vdCByZWFkeSBkb2Vz
IG5vdCBjaGFuZ2Ugc3RhdGUKb2sgNDk5IC0gVW5kbyBub3QgcmVhZHkgZG9lcyBub3QgY2hhbmdl
IHN0YXRlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNTMyNzcKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBVbmRvIGVtcHR5IGhpc3RvcnkgZG9lcyBub3QgY2hhbmdlIHN0YXRlCm9rIDUw
MCAtIFVuZG8gZW1wdHkgaGlzdG9yeSBkb2VzIG5vdCBjaGFuZ2Ugc3RhdGUKICAtLS0KICBkdXJh
dGlvbl9tczogMC42MzE1NzgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBQQVNTOiAyOSBiYXNlbGlu
ZSBjYXNlcyArIGNvbmZpcm1lZCBmaXh0dXJlcwojIFN1YnRlc3Q6IHRlc3RzL3ZvaWNlLXBhcnNl
ci50ZXN0LmNqcwpvayAxMDUgLSB0ZXN0cy92b2ljZS1wYXJzZXIudGVzdC5janMKICAtLS0KICBk
dXJhdGlvbl9tczogOTYuOTc1OTEyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCjEuLjUwMQojIHRlc3Rz
IDUwMQojIHN1aXRlcyAwCiMgcGFzcyA1MDEKIyBmYWlsIDAKIyBjYW5jZWxsZWQgMAojIHNraXBw
ZWQgMAojIHRvZG8gMAojIGR1cmF0aW9uX21zIDI2NjguMjA1OTc2Cg==
```

### ARCHIVED FILE: GITHUB_DESKTOP_COMMIT.txt | SHA256 b67e3c1ee9c4613873e634deecab3be419f1890fe83ab68c483a2cbbfc027815

```base64
U3VtbWFyeTogU3RhZ2UgMjgwIHByb2R1Y3Rpb24gQ2xvdWQgU3luYyBPTiByZWxlYXNlIGNhbmRp
ZGF0ZQpEZXNjcmlwdGlvbjogRW5hYmxlIGF1dG9tYXRpYyBzZXNzaW9uIHRyYW5zZmVyIGluIG1h
aW4gYXBwIGFmdGVyIGNyb3NzLWJyb3dzZXIgYW5kIGRhdGFiYXNlIHZlcmlmaWNhdGlvbjsgdXBk
YXRlIGhpc3RvcmljYWwgT0ZGLWdhdGUgYXNzZXJ0aW9uczsgcHJlc2VydmUgQ2xvdWQgVHJpYWwg
YW5kIGRvY3VtZW50IHJlc2lkdWFsIHNlY3VyaXR5IHRlc3QgZXhjZXB0aW9ucy4gTm8gU1FMIG1p
Z3JhdGlvbi4K
```

### ARCHIVED FILE: GITHUB_RELEASE_TEST_RESULT.txt | SHA256 e56900a4964ef7ab382b04aa06854f7b86a86e953b18aa76f0b526fbe36a25b8

```base64
ZSB3cml0ZXIsIHZhbGlkIHRva2VuLCBnZW5lcmF0aW9uIGFuZCBhdXRoIHNlc3Npb24KICAtLS0K
ICBkdXJhdGlvbl9tczogMC4yNjY1NjQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBh
ZG1pbiB1bmxvY2sgaGFzIG5vIHByb2R1Y3Rpb24gZ3JhbnQgYW5kIGNhbm5vdCBtb2RpZnkgZ2Ft
ZSBkYXRhCm9rIDU3MSAtIGFkbWluIHVubG9jayBoYXMgbm8gcHJvZHVjdGlvbiBncmFudCBhbmQg
Y2Fubm90IG1vZGlmeSBnYW1lIGRhdGEKICAtLS0KICBkdXJhdGlvbl9tczogMC4zMDA0ODQKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhZG1pbiB1bmxvY2sgcmV2b2tlcyB3cml0ZXIg
Y3JlZGVudGlhbHMgYXRvbWljYWxseQpvayA1NzIgLSBhZG1pbiB1bmxvY2sgcmV2b2tlcyB3cml0
ZXIgY3JlZGVudGlhbHMgYXRvbWljYWxseQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjcxODg4Mgog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFkbWluIHVubG9jayBwcmVzZXJ2ZXMgc2Vz
c2lvbiBoaXN0b3J5IGZvciBzdGFsZS1sb2dpbiByZWplY3Rpb24Kb2sgNTczIC0gYWRtaW4gdW5s
b2NrIHByZXNlcnZlcyBzZXNzaW9uIGhpc3RvcnkgZm9yIHN0YWxlLWxvZ2luIHJlamVjdGlvbgog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjI1NDQwNgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IHJ1bnRpbWUgZ2F0ZSByZW1haW5zIGV4cGxpY2l0bHkgTk9UIEVYRUNVVEVECm9rIDU3NCAt
IHJ1bnRpbWUgZ2F0ZSByZW1haW5zIGV4cGxpY2l0bHkgTk9UIEVYRUNVVEVECiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuNzgyOTY3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcnVudGlt
ZSBnYXRlIHJlcXVpcmVzIGRpc3Bvc2FibGUgZGF0YWJhc2UgYW5kIGF1dGgtc2Vzc2lvbiBmaXh0
dXJlcwpvayA1NzUgLSBydW50aW1lIGdhdGUgcmVxdWlyZXMgZGlzcG9zYWJsZSBkYXRhYmFzZSBh
bmQgYXV0aC1zZXNzaW9uIGZpeHR1cmVzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTE2OTQyCiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogdW5sb2NrIGF1ZGl0IGlzIGFwcGVuZC1vbmx5
IGFuZCBwcmVzZXJ2ZXMgZ2FtZSBzdGF0ZQpvayA1NzYgLSB1bmxvY2sgYXVkaXQgaXMgYXBwZW5k
LW9ubHkgYW5kIHByZXNlcnZlcyBnYW1lIHN0YXRlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjcy
NDIyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogdW5sb2NrIGFuZCBSUEMgZHJhZnRz
IHJlbWFpbiBpbnRlbnRpb25hbGx5IGJsb2NrZWQKb2sgNTc3IC0gdW5sb2NrIGFuZCBSUEMgZHJh
ZnRzIHJlbWFpbiBpbnRlbnRpb25hbGx5IGJsb2NrZWQKICAtLS0KICBkdXJhdGlvbl9tczogMC4x
MTgwMTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBpbnN0YWxsIGNhbmRpZGF0ZSBy
ZW1haW5zIGZhaWwtY2xvc2VkIHVudGlsIGxpdmUgUG9zdGdyZVNRTCB2ZXJpZmljYXRpb24Kb2sg
NTc4IC0gaW5zdGFsbCBjYW5kaWRhdGUgcmVtYWlucyBmYWlsLWNsb3NlZCB1bnRpbCBsaXZlIFBv
c3RncmVTUUwgdmVyaWZpY2F0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMTA4NDA3CiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbWFoam9uZ19zeW5jX29wZW46IGludm9rZXIgY2Fu
bm90IHVzZSBhbm9ueW1vdXMgcm9sZQpvayA1NzkgLSBtYWhqb25nX3N5bmNfb3BlbjogaW52b2tl
ciBjYW5ub3QgdXNlIGFub255bW91cyByb2xlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjAyMzU5
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbWFoam9uZ19zeW5jX29wZW46IHNlY3Vy
aXR5IGRlZmluZXIgaGFzIGVtcHR5IHNlYXJjaCBwYXRoCm9rIDU4MCAtIG1haGpvbmdfc3luY19v
cGVuOiBzZWN1cml0eSBkZWZpbmVyIGhhcyBlbXB0eSBzZWFyY2ggcGF0aAogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjg3MDM0NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG1haGpvbmdf
c3luY19jb21taXQ6IGludm9rZXIgY2Fubm90IHVzZSBhbm9ueW1vdXMgcm9sZQpvayA1ODEgLSBt
YWhqb25nX3N5bmNfY29tbWl0OiBpbnZva2VyIGNhbm5vdCB1c2UgYW5vbnltb3VzIHJvbGUKICAt
LS0KICBkdXJhdGlvbl9tczogMC4wODg1MDEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBtYWhqb25nX3N5bmNfY29tbWl0OiBzZWN1cml0eSBkZWZpbmVyIGhhcyBlbXB0eSBzZWFyY2gg
cGF0aApvayA1ODIgLSBtYWhqb25nX3N5bmNfY29tbWl0OiBzZWN1cml0eSBkZWZpbmVyIGhhcyBl
bXB0eSBzZWFyY2ggcGF0aAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE3Njk4MQogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG1haGpvbmdfc3luY19vcGVuX3JlYWRlcjogaW52b2tlciBj
YW5ub3QgdXNlIGFub255bW91cyByb2xlCm9rIDU4MyAtIG1haGpvbmdfc3luY19vcGVuX3JlYWRl
cjogaW52b2tlciBjYW5ub3QgdXNlIGFub255bW91cyByb2xlCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMDcxMDk1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbWFoam9uZ19zeW5jX29w
ZW5fcmVhZGVyOiBzZWN1cml0eSBkZWZpbmVyIGhhcyBlbXB0eSBzZWFyY2ggcGF0aApvayA1ODQg
LSBtYWhqb25nX3N5bmNfb3Blbl9yZWFkZXI6IHNlY3VyaXR5IGRlZmluZXIgaGFzIGVtcHR5IHNl
YXJjaCBwYXRoCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTE3NTA0CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogbWFoam9uZ19zeW5jX3JlYWQ6IGludm9rZXIgY2Fubm90IHVzZSBhbm9u
eW1vdXMgcm9sZQpvayA1ODUgLSBtYWhqb25nX3N5bmNfcmVhZDogaW52b2tlciBjYW5ub3QgdXNl
IGFub255bW91cyByb2xlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMDY0MjA0CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogbWFoam9uZ19zeW5jX3JlYWQ6IHNlY3VyaXR5IGRlZmluZXIg
aGFzIGVtcHR5IHNlYXJjaCBwYXRoCm9rIDU4NiAtIG1haGpvbmdfc3luY19yZWFkOiBzZWN1cml0
eSBkZWZpbmVyIGhhcyBlbXB0eSBzZWFyY2ggcGF0aAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIy
MjEwOAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG1haGpvbmdfc3luY19sZWFzZV9z
dGF0dXM6IGludm9rZXIgY2Fubm90IHVzZSBhbm9ueW1vdXMgcm9sZQpvayA1ODcgLSBtYWhqb25n
X3N5bmNfbGVhc2Vfc3RhdHVzOiBpbnZva2VyIGNhbm5vdCB1c2UgYW5vbnltb3VzIHJvbGUKICAt
LS0KICBkdXJhdGlvbl9tczogMC4yOTIzNjIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBtYWhqb25nX3N5bmNfbGVhc2Vfc3RhdHVzOiBzZWN1cml0eSBkZWZpbmVyIGhhcyBlbXB0eSBz
ZWFyY2ggcGF0aApvayA1ODggLSBtYWhqb25nX3N5bmNfbGVhc2Vfc3RhdHVzOiBzZWN1cml0eSBk
ZWZpbmVyIGhhcyBlbXB0eSBzZWFyY2ggcGF0aAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEyNDc2
NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG9wZW4gbWlzbWF0Y2ggZG9lcyBub3Qg
cmV0dXJuIGNsb3VkIHNuYXBzaG90Cm9rIDU4OSAtIG9wZW4gbWlzbWF0Y2ggZG9lcyBub3QgcmV0
dXJuIGNsb3VkIHNuYXBzaG90CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTg3Mjk3CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb3BlbiBtYXBzIGRldmljZSBhbmQgZ2FtZSB0byBuYW1l
ZCBSUEMgYXJndW1lbnRzCm9rIDU5MCAtIG9wZW4gbWFwcyBkZXZpY2UgYW5kIGdhbWUgdG8gbmFt
ZWQgUlBDIGFyZ3VtZW50cwogIC0tLQogIGR1cmF0aW9uX21zOiAxLjg1MDIzMwogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbW1pdCBtYXBzIGdlbmVyYXRpb24gdG9rZW4gcmV2aXNp
b24gYW5kIGdhbWUgZXhhY3RseQpvayA1OTEgLSBjb21taXQgbWFwcyBnZW5lcmF0aW9uIHRva2Vu
IHJldmlzaW9uIGFuZCBnYW1lIGV4YWN0bHkKICAtLS0KICBkdXJhdGlvbl9tczogMC43NDAxNzMK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBwZXJtaXNzaW9uIGVycm9yIHJldGFpbnMg
U3VwYWJhc2UgY29kZQpvayA1OTIgLSBwZXJtaXNzaW9uIGVycm9yIHJldGFpbnMgU3VwYWJhc2Ug
Y29kZQogIC0tLQogIGR1cmF0aW9uX21zOiAxLjM3NDUzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogbWFsZm9ybWVkIHNlcnZlciByZXNwb25zZSBpcyByZWplY3RlZApvayA1OTMgLSBt
YWxmb3JtZWQgc2VydmVyIHJlc3BvbnNlIGlzIHJlamVjdGVkCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMzA0NzQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBubyBuZXR3b3JrIHJlcXVl
c3Qgb24gbWlzc2luZyBjb21taXQgY3JlZGVudGlhbHMKb2sgNTk0IC0gbm8gbmV0d29yayByZXF1
ZXN0IG9uIG1pc3NpbmcgY29tbWl0IGNyZWRlbnRpYWxzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
Mjk0OTI1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb3BlbiBzbmFwc2hvdHMgZ2Ft
ZSBiZWZvcmUgYXN5bmNocm9ub3VzIHRyYW5zcG9ydCB1c2VzIGl0Cm9rIDU5NSAtIG9wZW4gc25h
cHNob3RzIGdhbWUgYmVmb3JlIGFzeW5jaHJvbm91cyB0cmFuc3BvcnQgdXNlcyBpdAogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjE5NTYyOQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNv
bW1pdCBzbmFwc2hvdHMgZ2FtZSBhbmQgcmVmdXNlcyBub24tb2JqZWN0IHBheWxvYWQgYmVmb3Jl
IG5ldHdvcmsgY2FsbApvayA1OTYgLSBjb21taXQgc25hcHNob3RzIGdhbWUgYW5kIHJlZnVzZXMg
bm9uLW9iamVjdCBwYXlsb2FkIGJlZm9yZSBuZXR3b3JrIGNhbGwKICAtLS0KICBkdXJhdGlvbl9t
czogMC4zMDc4NzUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjbG91ZCBhZG9wdGlv
biByZXF1aXJlcyBtYXRjaGluZyBnYW1lIGlkZW50aXR5IGFuZCByZXZpc2lvbiBiZWZvcmUgUlBD
Cm9rIDU5NyAtIGNsb3VkIGFkb3B0aW9uIHJlcXVpcmVzIG1hdGNoaW5nIGdhbWUgaWRlbnRpdHkg
YW5kIHJldmlzaW9uIGJlZm9yZSBSUEMKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMjY5MTYKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjbG91ZCBhZG9wdGlvbiBmb3J3YXJkcyBib3Ro
IGV4cGVjdGVkIGdhbWUgaWRlbnRpdHkgYW5kIHJldmlzaW9uCm9rIDU5OCAtIGNsb3VkIGFkb3B0
aW9uIGZvcndhcmRzIGJvdGggZXhwZWN0ZWQgZ2FtZSBpZGVudGl0eSBhbmQgcmV2aXNpb24KICAt
LS0KICBkdXJhdGlvbl9tczogMC4zODg2NzQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiByZWFkLW9ubHkgc2Vzc2lvbiBmZXRjaCBtYXBzIGRldmljZSBJRCB0byBtYWhqb25nX3N5bmNf
cmVhZApvayA1OTkgLSByZWFkLW9ubHkgc2Vzc2lvbiBmZXRjaCBtYXBzIGRldmljZSBJRCB0byBt
YWhqb25nX3N5bmNfcmVhZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQ2OTI1MwogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlYWQgcmVmdXNlcyBhYnNlbnQgZGV2aWNlIElEIGJlZm9y
ZSBuZXR3b3JrIGFjY2VzcwpvayA2MDAgLSByZWFkIHJlZnVzZXMgYWJzZW50IGRldmljZSBJRCBi
ZWZvcmUgbmV0d29yayBhY2Nlc3MKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMzA1MTEKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBsZWFzZSBwcm9iZSBtYXBzIGlkZW50aXR5IGFuZCBn
ZW5lcmF0aW9uIHdpdGhvdXQgd3JpdGVyIGNyZWRlbnRpYWxzCm9rIDYwMSAtIGxlYXNlIHByb2Jl
IG1hcHMgaWRlbnRpdHkgYW5kIGdlbmVyYXRpb24gd2l0aG91dCB3cml0ZXIgY3JlZGVudGlhbHMK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4xNzk5MzUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBsZWFzZSBwcm9iZSByZWplY3RzIG1hbGZvcm1lZCBnZW5lcmF0aW9uIGJlZm9yZSBSUEMK
b2sgNjAyIC0gbGVhc2UgcHJvYmUgcmVqZWN0cyBtYWxmb3JtZWQgZ2VuZXJhdGlvbiBiZWZvcmUg
UlBDCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjMwMzcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiByZWplY3QgbmVzdGVkIG9iamVjdCB0b0pTT04gYmVmb3JlIGFueSBjbG91ZCBSUEMK
b2sgNjAzIC0gcmVqZWN0IG5lc3RlZCBvYmplY3QgdG9KU09OIGJlZm9yZSBhbnkgY2xvdWQgUlBD
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTkxMzQyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogcmVqZWN0IG5lc3RlZCBhcnJheSB0b0pTT04gYmVmb3JlIGFueSBjbG91ZCBSUEMKb2sg
NjA0IC0gcmVqZWN0IG5lc3RlZCBhcnJheSB0b0pTT04gYmVmb3JlIGFueSBjbG91ZCBSUEMKICAt
LS0KICBkdXJhdGlvbl9tczogMC4xMzIyODUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiByZWplY3QgaW5oZXJpdGVkIG5lc3RlZCBzZXJpYWxpemVyIHRvSlNPTiBiZWZvcmUgYW55IGNs
b3VkIFJQQwpvayA2MDUgLSByZWplY3QgaW5oZXJpdGVkIG5lc3RlZCBzZXJpYWxpemVyIHRvSlNP
TiBiZWZvcmUgYW55IGNsb3VkIFJQQwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIwOTM4OQogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNlcnZlciBjaGVja3MgY2xvdWQgbWlzbWF0Y2gg
YmVmb3JlIHJldm9raW5nIHByZXZpb3VzIHdyaXRlcgpvayA2MDYgLSBzZXJ2ZXIgY2hlY2tzIGNs
b3VkIG1pc21hdGNoIGJlZm9yZSByZXZva2luZyBwcmV2aW91cyB3cml0ZXIKICAtLS0KICBkdXJh
dGlvbl9tczogMC45Nzg3MDUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiB1bnNhZmUg
ZHJhZnQgcmVtYWlucyBibG9ja2VkIGZyb20gcHJvZHVjdGlvbiBkZXBsb3ltZW50Cm9rIDYwNyAt
IHVuc2FmZSBkcmFmdCByZW1haW5zIGJsb2NrZWQgZnJvbSBwcm9kdWN0aW9uIGRlcGxveW1lbnQK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4xODE0NjgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiB3cml0ZXIgdGFrZW92ZXIgaW52YWxpZGF0ZXMgZGlzcGxhY2VkIGRldmljZSBjcmVkZW50
aWFsIGhhc2hlcwpvayA2MDggLSB3cml0ZXIgdGFrZW92ZXIgaW52YWxpZGF0ZXMgZGlzcGxhY2Vk
IGRldmljZSBjcmVkZW50aWFsIGhhc2hlcwogIC0tLQogIGR1cmF0aW9uX21zOiAxLjI3ODYwOQog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlYWQtb25seSBlbnJvbGxtZW50IG5ldmVy
IHJlY2VpdmVzIGEgd3JpdGVyIGNyZWRlbnRpYWwKb2sgNjA5IC0gcmVhZC1vbmx5IGVucm9sbG1l
bnQgbmV2ZXIgcmVjZWl2ZXMgYSB3cml0ZXIgY3JlZGVudGlhbAogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjE2MTY4OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFkYXB0ZXIgYW5kIGVu
Z2luZSBwZXJmb3JtIG9wZW4sIHNjb3JlIGNvbW1pdCwgcmV2aXNpb24gaW5jcmVtZW50Cm9rIDYx
MCAtIGFkYXB0ZXIgYW5kIGVuZ2luZSBwZXJmb3JtIG9wZW4sIHNjb3JlIGNvbW1pdCwgcmV2aXNp
b24gaW5jcmVtZW50CiAgLS0tCiAgZHVyYXRpb25fbXM6IDQuODg0MzEzCiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogZGV2aWNlIHRha2VvdmVyIHJldm9rZXMgcHJldmlvdXMgd3JpdGVy
IGFuZCBwcmVzZXJ2ZXMgaXRzIHVuY29tbWl0dGVkIHNjb3JlCm9rIDYxMSAtIGRldmljZSB0YWtl
b3ZlciByZXZva2VzIHByZXZpb3VzIHdyaXRlciBhbmQgcHJlc2VydmVzIGl0cyB1bmNvbW1pdHRl
ZCBzY29yZQogIC0tLQogIGR1cmF0aW9uX21zOiAyLjg1MDgzCiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogbmV3IGRldmljZSB3aXRoIGRpZmZlcmVudCBsb2NhbCBnYW1lIGFkb3B0cyBh
dXRob3JpdGF0aXZlIGNsb3VkIGFuZCByZXRhaW5zIGJhY2t1cApvayA2MTIgLSBuZXcgZGV2aWNl
IHdpdGggZGlmZmVyZW50IGxvY2FsIGdhbWUgYWRvcHRzIGF1dGhvcml0YXRpdmUgY2xvdWQgYW5k
IHJldGFpbnMgYmFja3VwCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuOTc1MTgxCiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogc3luYyBvcGVuIHJlamVjdHMgdW5zYWZlIGludGVnZXIgaW4g
bmVzdGVkIHNjb3JlIHdpdGhvdXQgUlBDCm9rIDYxMyAtIHN5bmMgb3BlbiByZWplY3RzIHVuc2Fm
ZSBpbnRlZ2VyIGluIG5lc3RlZCBzY29yZSB3aXRob3V0IFJQQwogIC0tLQogIGR1cmF0aW9uX21z
OiAxLjcwOTc0NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN5bmMgY29tbWl0IHJl
amVjdHMgdW5zYWZlIG5lZ2F0aXZlIGludGVnZXIgaW4gaGlzdG9yeSB3aXRob3V0IFJQQwpvayA2
MTQgLSBzeW5jIGNvbW1pdCByZWplY3RzIHVuc2FmZSBuZWdhdGl2ZSBpbnRlZ2VyIGluIGhpc3Rv
cnkgd2l0aG91dCBSUEMKICAtLS0KICBkdXJhdGlvbl9tczogMC4zMTEzNQogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IHN5bmMgb3BlbiBwcmVzZXJ2ZXMgc2FmZSBpbnRlZ2VyIGJvdW5k
YXJ5IGFuZCBmcmFjdGlvbmFsIHZhbHVlcwpvayA2MTUgLSBzeW5jIG9wZW4gcHJlc2VydmVzIHNh
ZmUgaW50ZWdlciBib3VuZGFyeSBhbmQgZnJhY3Rpb25hbCB2YWx1ZXMKICAtLS0KICBkdXJhdGlv
bl9tczogMC4zODQxOTgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBVbmRvIHJlc3Rv
cmVzIHNjb3JlcywgZGVhbGVyLCByb3VuZCwgYW5kIHdpbmRzIGFuZCBrZWVwcyBvbGRlciBoaXN0
b3J5Cm9rIDYxNiAtIFVuZG8gcmVzdG9yZXMgc2NvcmVzLCBkZWFsZXIsIHJvdW5kLCBhbmQgd2lu
ZHMgYW5kIGtlZXBzIG9sZGVyIGhpc3RvcnkKICAtLS0KICBkdXJhdGlvbl9tczogMi4xMDI2NDYK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBVbmRvIGZhaWxlZCBzYXZlIHJlc3RvcmVz
IGVudGlyZSBzdGF0ZQpvayA2MTcgLSBVbmRvIGZhaWxlZCBzYXZlIHJlc3RvcmVzIGVudGlyZSBz
dGF0ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjcwODY3NwogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IFVuZG8gbWlzc2luZyBiZWZvcmUgZG9lcyBub3QgY2hhbmdlIHN0YXRlCm9rIDYx
OCAtIFVuZG8gbWlzc2luZyBiZWZvcmUgZG9lcyBub3QgY2hhbmdlIHN0YXRlCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuNTUzMTg3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogVW5kbyBt
YWxmb3JtZWQgYmVmb3JlIGRvZXMgbm90IGNoYW5nZSBzdGF0ZQpvayA2MTkgLSBVbmRvIG1hbGZv
cm1lZCBiZWZvcmUgZG9lcyBub3QgY2hhbmdlIHN0YXRlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDIu
MTg1NDIyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogVW5kbyBtaXNzaW5nIGRlYWxl
ciBkb2VzIG5vdCBjaGFuZ2Ugc3RhdGUKb2sgNjIwIC0gVW5kbyBtaXNzaW5nIGRlYWxlciBkb2Vz
IG5vdCBjaGFuZ2Ugc3RhdGUKICAtLS0KICBkdXJhdGlvbl9tczogMC43MTQ5ODYKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBVbmRvIG5vdCByZWFkeSBkb2VzIG5vdCBjaGFuZ2Ugc3Rh
dGUKb2sgNjIxIC0gVW5kbyBub3QgcmVhZHkgZG9lcyBub3QgY2hhbmdlIHN0YXRlCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuNTkxNzQ0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogVW5k
byBlbXB0eSBoaXN0b3J5IGRvZXMgbm90IGNoYW5nZSBzdGF0ZQpvayA2MjIgLSBVbmRvIGVtcHR5
IGhpc3RvcnkgZG9lcyBub3QgY2hhbmdlIHN0YXRlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNjQy
OTEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBQQVNTOiAyOSBiYXNlbGluZSBjYXNlcyArIGNvbmZp
cm1lZCBmaXh0dXJlcwojIFN1YnRlc3Q6IHRlc3RzL3ZvaWNlLXBhcnNlci50ZXN0LmNqcwpvayAx
MjkgLSB0ZXN0cy92b2ljZS1wYXJzZXIudGVzdC5janMKICAtLS0KICBkdXJhdGlvbl9tczogODYu
NDc5MjgxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCjEuLjYyMwojIHRlc3RzIDYyMwojIHN1aXRlcyAw
CiMgcGFzcyA2MjMKIyBmYWlsIDAKIyBjYW5jZWxsZWQgMAojIHNraXBwZWQgMAojIHRvZG8gMAoj
IGR1cmF0aW9uX21zIDI1MjYuODAzMjI4Cg==
```

### ARCHIVED FILE: GITHUB_RELEASE_VERIFICATION.md | SHA256 c8c8fcc70699d241621e83512fb92b51bfd9ca37ab2abae9c7640fb3e92c2d59

```base64
IyBQZW1lcmlrc2FhbiBwZXJiYW5kaW5nYW4gZHVhIFpJUCAoMTMgT2t0b2JlciAyMDI2KQoKU3Vt
YmVyIEE6IG1haGpvbmctc2NvcmUtbWFpbig0KS56aXAg4oCUIGJhc2VsaW5lIEdpdEh1YiBwZW5n
Z3VuYSwgYXBsaWthc2kgdjE1LjcuMTMsIGJlcmlzaSAuZ2l0aHViL3dvcmtmbG93cywgLmdpdGln
bm9yZSwgLm5vamVreWxsOyBaSVAgbWVtaWxpa2kgZGlyZWt0b3JpIG1haGpvbmctc2NvcmUtbWFp
biBiZXJzYXJhbmcgZHVwbGlrYXQuClN1bWJlciBCOiBNYWhqb25nX1Njb3JlXzRQX1BXQV92MTUu
Ny4xNV82MTdQQVNTXzZGQUlMX1NUQUdFMTdfQ0xPVURfT05fVU5WRVJJRklFRF9DQU5ESURBVEUo
MikuemlwIOKAlCBrb2RlIHYxNS43LjE1IGRhbiBtb2R1bCBzeW5jIGJhcnUsIG5hbXVuIGtlaGls
YW5nYW4gZmlsZSBkb3RmaWxlcy93b3JrZmxvd3MuIENsb3VkIE9OIGNhbmRpZGF0ZSBzZWJlbHVt
bnlhIDYxNyBQQVNTIC8gNiBGQUlMLgoKUGFrZXQgaW5pOiBrb2RlIGthbmRpZGF0IHYxNS43LjE1
IGRpcGVydGFoYW5rYW4sIGVtcGF0IGZpbGUga29uZmlndXJhc2kgR2l0SHViIGFzbGkgZGlwdWxp
aGthbiwgQ2xvdWQgU3luYyBESVNBQkxFRCBkZW1pIG1lbmNlZ2FoIHBlbmd1bmNpYW4gc2tvciBz
ZWJlbHVtIHVqaSBBdXRoIG55YXRhLiBUaWRhayBtZW1hc3Vra2FuIGZvbGRlciBtYWhqb25nLXNj
b3JlLW1haW4gYmVyc2FyYW5nLgoKUEVOVElORzogQnVrYW4gcmlsaXMgdHJhbnNmZXIgb3RvbWF0
aXMgYWt0aWYuIEphbmdhbiBtZW5na2xhaW0gcGVyYW5na2F0IGJhcnUgb3RvbWF0aXMgbWVtdWxp
aGthbiBwZXJtYWluYW4gc2FtcGFpIHVqaSBlbmQtdG8tZW5kIGx1bHVzLiBMaW1hIFJQQyB0ZWxh
aCBkaWxhcG9ya2FuIHRlcnBhc2FuZyBvbGVoIHBlbmdndW5hLCB0ZXRhcGkgYmVsdW0gZGl1amkg
bGV3YXQgZHVhIHNlc2kgbnlhdGEuIFBlbmd1amlhbiBOb2RlIHRpZGFrIG1lbmphbWluIFNhZmFy
aSBhdGF1IFN1cGFiYXNlLgoKR2l0SHViIERlc2t0b3AgU3VtbWFyeTogdjE1LjcuMTUgLSBSZXN0
b3JlIGNvbXBsZXRlIHJlcG8gYW5kIGtlZXAgc2NvcmUgZW50cnkgc2FmZQpHaXRIdWIgRGVza3Rv
cCBEZXNjcmlwdGlvbjogTWVyZ2UgbGF0ZXN0IGFwcCBjb2RlIHdpdGggb3JpZ2luYWwgR2l0SHVi
IHdvcmtmbG93cyBhbmQgZG90ZmlsZXMuIEtlZXAgQ2xvdWQgU3luYyBPRkYgcGVuZGluZyBsaXZl
IEF1dGggdHJhbnNmZXIgdmVyaWZpY2F0aW9uLiBQcmVzZXJ2ZSBleGlzdGluZyByZXBvc2l0b3J5
IGZpbGVzIHdoZW4gY29weWluZy4K
```

### ARCHIVED FILE: IMPLEMENTATION_STATE_STAGE279_NOTE.txt | SHA256 581e6812dc43c4dd08e834a1eb5835f98e1fa740baf1b015c9a576827c1fa45e

```base64
U3RhZ2UgMjc5QjogZG9jdW1lbnRhdGlvbiBhbmQgbGVnYWN5IFNRTCBkcmFmdHMgYXJjaGl2ZWQs
IGFjdGl2ZSBTUUwgcmVtYWlucyBzdXBhYmFzZV9sYXRlc3Quc3FsLCBoaXN0b3J5IHJlbWFpbnMg
c3VwYWJhc2Vfc2NoZW1hX2hpc3Rvcnkuc3FsLiBNYWluIENsb3VkIFN5bmMgT0ZGLCBDbG91ZCBU
cmlhbCBPTi4gTm9kZSB0ZXN0IHN1aXRlIDYyNCBQQVNTIC8gMCBGQUlMLiBEaXJlY3Qgc3RhbGUt
dG9rZW4gbWFoam9uZ19zeW5jX2NvbW1pdCBydW50aW1lIHJlamVjdGlvbiBub3QgeWV0IHByb3Zl
bi4gRE8gTk9UIERFUExPWS4K
```

### ARCHIVED FILE: README_STAGE230.md | SHA256 708728c70ea01a81d572a305304452bccc1f5ecfda93fe2332b41a0b4f46d6f2

```base64
IyBTdGFnZSAyMzAg4oCUIElzb2xhdGVkIGJyb3dzZXIgdHJpYWwsIE5PVCBwcm9kdWN0aW9uIHJl
bGVhc2UKCkRlcGxveSB0aGlzIGFyY2hpdmUgdG8gR2l0SHViIFBhZ2VzIHJlcG9zaXRvcnkgcm9v
dCBvbmx5IGlmIHlvdSBhY2NlcHQgdGVzdGluZyBhZ2FpbnN0IHRoZSBFWElTVElORyBTdXBhYmFz
ZSBwcm9qZWN0LiBSb290IGAvbWFoam9uZy1zY29yZS9gIHN0YXlzIENsb3VkIFN5bmMgT0ZGOyBg
L21haGpvbmctc2NvcmUvY2xvdWQtdHJpYWwvYCBoYXMgQ2xvdWQgU3luYyBPTi4gRG8gbm90IGNv
cHkgdHJpYWwgZmlsZXMgb3ZlciByb290LgoKVGhpcyBpcyBhbiBpbnRlbnRpb25hbGx5IHNlcGFy
YXRlIGJyb3dzZXIgdHJpYWwgcGF0aCwgbm90IGEgdmFsaWRhdGVkIENsb3VkIFN5bmMgcHJvZHVj
dGlvbiByZWxlYXNlLiBTZXJ2ZXItc2lkZSBSUEMgbWlncmF0aW9uIGlzIE5PVCBpbmNsdWRlZC4g
RXhpc3RpbmcgZGF0YWJhc2Ugc2Vzc2lvbnMgYW5kIGdhbWUgc3RhdGUgYXJlIHNoYXJlZCB3aXRo
IHRoZSBwcm9kdWN0aW9uIHBhdGg7IHRlc3QgdXNpbmcgYSBkaXNwb3NhYmxlIGdhbWUgYW5kIGFj
Y291bnQgb25seS4gSW4gcGFydGljdWxhciwgZG8gbm90IHRlc3Qgd2l0aCBhbnkgdmFsdWFibGUg
b25nb2luZyBnYW1lLgoKTm8gR2l0SHViIHB1c2ggb3IgbGl2ZSBicm93c2VyIHRlc3QgaGFzIGJl
ZW4gcGVyZm9ybWVkIGJ5IHRoZSBhc3Npc3RhbnQuIFJlbGVhc2UgZ2F0ZXMgcmVxdWlyaW5nIENs
b3VkIFN5bmMgT0ZGIGFyZSBub3QgcHJvb2YgdGhhdCB0cmlhbCBDbG91ZCBTeW5jIE9OIGlzIHNh
ZmUuIFRoZSB0cmlhbCB1c2VzIHRoZSBzYW1lIGFwcCBvcmlnaW4gYW5kIGJyb3dzZXIgc3RvcmFn
ZSBhcyByb290OyBhdm9pZCBvcGVuaW5nIGJvdGggcGF0aHMgd2l0aGluIHRoZSBzYW1lIGJyb3dz
ZXIgcHJvZmlsZS4gUHJlZmVyIENocm9tZSBhbmQgRmlyZWZveCBhcyBzZXBhcmF0ZSBicm93c2Vy
cy4gQ2xvdWQgU3luYyB0cmlhbCBjYW4gcmV2b2tlIGEgY3VycmVudCB3cml0ZXIgc2Vzc2lvbi4K
CkdpdEh1YiBEZXNrdG9wIFN1bW1hcnk6IHRlc3Q6IGFkZCBpc29sYXRlZCBDbG91ZCBTeW5jIGJy
b3dzZXIgdHJpYWwgcm91dGUKR2l0SHViIERlc2t0b3AgRGVzY3JpcHRpb246IEtlZXAgcm9vdCBD
bG91ZCBTeW5jIE9GRiBhbmQgYWRkIGNsb3VkLXRyaWFsLyB3aXRoIENsb3VkIFN5bmMgT04gZm9y
IGNvbnRyb2xsZWQgQ2hyb21lLXRvLUZpcmVmb3ggYnJvd3NlciB0ZXN0aW5nIGFnYWluc3QgZXhp
c3RpbmcgU3VwYWJhc2UuIE5vIGRhdGFiYXNlIG1pZ3JhdGlvbi4gTm90IGFwcHJvdmVkIGZvciBw
cm9kdWN0aW9uIHNjb3JpbmcuCgpSb2xsYmFjazogZGVsZXRlIGNsb3VkLXRyaWFsLzsgcm9vdCBp
bmRleC5odG1sIHJlbWFpbnMgQ2xvdWQgU3luYyBPRkYuCg==
```

### ARCHIVED FILE: README_STAGE253.md | SHA256 f71699bddb9d6c456f0eebdc87454c6f4c0a02f992c58a8f034c4931188af9df

```base64
IyBTdGFnZSAyNTMg4oCUIFRyaWFsLW9ubHkgd3JpdGVyIFVJIHN0YXRlIHJlZnJlc2ggKGNhbmRp
ZGF0ZSkKClN0YXR1czogU1RBVElDIENIRUNLIFBBU1M7IExJVkUgQlJPV1NFUiBSRUdSRVNTSU9O
IFBFTkRJTkc7IERPIE5PVCBERVBMT1kgUFJPRFVDVElPTi4KCkNoYW5nZXM6IE9OTFkgYGNsb3Vk
LXRyaWFsL2luZGV4Lmh0bWxgIGNvbXBhcmVkIHdpdGggU3RhZ2UgMjMwIGJhc2VsaW5lLiBPbiBi
cmlkZ2UgYHJlYWR5YC9gcmVhZC1vbmx5YCBzdGF0dXMgb3IgY29uZmxpY3QsIHNjaGVkdWxlIGEg
VUkgYHVwZGF0ZSgpYCBtaWNyb3Rhc2sgc28gdGhlIHdyaXRlci1kZXBlbmRlbnQgY29udHJvbHMg
cmVmcmVzaCBhZnRlciBgY2FuV3JpdGVgIGNoYW5nZXMuIEF2b2lkIHJlLWVudHJhbnQgcmVuZGVy
LCBubyBuZXcgc3luYyBSUENzLCBubyBTUUwgb3IgYXV0aCBjaGFuZ2VzLiBUaGUgcm9vdCBgL21h
aGpvbmctc2NvcmUvYCByZW1haW5zIENsb3VkIFN5bmMgT0ZGIGFuZCB1bmNoYW5nZWQuCgpJbXBv
cnRhbnQ6IFRoaXMgdGFyZ2V0cyBhIHN1c3BlY3RlZCBtaXNzaW5nIFVJIHJlZnJlc2gsIG5vdCB5
ZXQgY29uZmlybWVkIGFzIHRoZSBjYXVzZSBvZiB0aGUgb2JzZXJ2ZWQgcmVsb2FkIHJlcXVpcmVt
ZW50LiBgdXBkYXRlKClgIGlzIGludGVudGlvbmFsbHkgdXNlZCByYXRoZXIgdGhhbiBmdWxsIGBy
ZW5kZXIoKWAgdG8gYXZvaWQgd2lwaW5nIHVzZXIgaW5wdXQuIElmIGEgYnJvd3NlciB0ZXN0IHN0
aWxsIHJlcXVpcmVzIHJlZnJlc2gsIGludmVzdGlnYXRlIHRoZSBhdXRoL3Nlc3Npb24gbGlmZWN5
Y2xlIHJhdGhlciB0aGFuIHN0YWNraW5nIHBhdGNoZXMuCgpTZWN1cml0eTogQSB3cml0ZXIgdG9r
ZW4gd2FzIGV4cG9zZWQgaW4gY2hhdCBkdXJpbmcgdGVzdGluZzsgcmV2b2tlL3JvdGF0ZSB0aGF0
IHNlc3Npb24gYmVmb3JlIHJlbGVhc2UuIFN0YWxlLXNlc3Npb24gY29tbWl0IGRlbmlhbCBhbmQg
b3RoZXIgc2VjdXJpdHkvcmVncmVzc2lvbiB0ZXN0cyByZW1haW4gcGVuZGluZy4KClZhbGlkYXRp
b246IE5vZGUgYC0tY2hlY2tgIHBhc3NlZCBmb3IgYWxsIDQgaW5saW5lIEphdmFTY3JpcHQgYmxv
Y2tzIGluIHRoZSBtb2RpZmllZCB0cmlhbCBIVE1MLiBObyBsaXZlIGJyb3dzZXIgdGVzdCBvciBH
aXRIdWIgcHVzaCBwZXJmb3JtZWQuCgpHaXRIdWIgRGVza3RvcCBTdW1tYXJ5OiBmaXgodHJpYWwp
OiByZWZyZXNoIHdyaXRlci1kZXBlbmRlbnQgVUkgYWZ0ZXIgY2xvdWQgYWN0aXZhdGlvbgpHaXRI
dWIgRGVza3RvcCBEZXNjcmlwdGlvbjogVXBkYXRlIG9ubHkgY2xvdWQtdHJpYWwvaW5kZXguaHRt
bCB0byByZWZyZXNoIFVJIGNvbnRyb2xzIHdoZW4gY2xvdWQgYnJpZGdlIHJlcG9ydHMgcmVhZHkv
cmVhZC1vbmx5IG9yIGxvc2VzIGl0cyBsZWFzZS4gS2VlcCByb290IENsb3VkIFN5bmMgT0ZGLiBT
dGF0aWMgc3ludGF4IGNoZWNrcyBwYXNzOyBsaXZlIHZlcmlmaWNhdGlvbiBhbmQgc2VjdXJpdHkg
cmVsZWFzZSBnYXRlcyBwZW5kaW5nLiBEbyBub3QgZGVwbG95IHByb2R1Y3Rpb24uCgpSb2xsYmFj
azogcmVzdG9yZSBgY2xvdWQtdHJpYWwvaW5kZXguaHRtbGAgZnJvbSBTdGFnZSAyMzAgWklQLgo=
```

### ARCHIVED FILE: STAGE13_DEPLOY_BOUNDARY_CHECKPOINT.md | SHA256 23afd403f9f6e9b7d4748114068bad2013beebd6348b0b5ae16c8799b63983a6

```base64
IyBTdGFnZSAxMyDigJQgRGVwbG95bWVudCBib3VuZGFyeSBzdGF0aWMgZ3VhcmQgKDM5MyBQQVNT
KQpEYXRlOiAyMDI2LTEwLTEyLiBTb3VyY2U6IDM4OSBQQVNTIFpJUC4KCiMjIENvbXBsZXRlZAot
IEluc3BlY3RlZCBQb3N0Z3JlU1FMIGludGVncmF0aW9uIHBsYW4gYW5kIGJsb2NrZWQgUlBDL2Fk
bWluIHVubG9jayBTUUwgZHJhZnRzLgotIEFkZGVkIGZvdXIgTm9kZSB0ZXN0cyBpbiBgdGVzdHMv
c3luYy1zdGFnZTEzLWRlcGxveS1ib3VuZGFyeS50ZXN0LmNqc2A6IGd1YXJkIHByZWNlZGVzIGdy
YW50cy90cmFuc2FjdGlvbiwgdW5jb25kaXRpb25hbCB0b3AtbGV2ZWwgZXhjZXB0aW9uLCBubyB1
bmxvY2sgZXhlY3V0YWJsZSBncmFudHMsIGFuZCBydW50aW1lIGdhdGUgZXhwbGljaXRseSBOT1Qg
RVhFQ1VURUQuCi0gRXhlY3V0ZWQgYG5vZGUgLS10ZXN0IHRlc3RzLyoudGVzdC5janNgOiAqKjM5
MyBQQVNTLCAwIEZBSUwqKi4gRnVsbCBsb2c6IGB0ZXN0cy9zdGFnZTEzX2RlcGxveV9ib3VuZGFy
eV9ydW4ubG9nYC4KCiMjIEltcG9ydGFudCBsaW1pdHMKLSBUaGVzZSBhcmUgc3RhdGljIGNoZWNr
cywgTk9UIFBvc3RncmVTUUwgcnVudGltZSB2ZXJpZmljYXRpb24uCi0gTm8gUG9zdGdyZVNRTC9T
dXBhYmFzZS1jb21wYXRpYmxlIGRpc3Bvc2FibGUgc2VydmVyIGF2YWlsYWJsZSBpbiB0aGlzIGVu
dmlyb25tZW50LiBObyBTUUwgZXhlY3V0ZWQgYWdhaW5zdCBhbnkgZGF0YWJhc2UuCi0gUlBDIGRy
YWZ0IHN0aWxsIGNvbnRhaW5zIEdSQU5UL0NPTU1JVCBmb2xsb3dpbmcgYW4gaW50ZW50aW9uYWwg
YmxvY2tpbmcgZXhjZXB0aW9uOyBuZXZlciByZW1vdmUgb3IgYnlwYXNzIHRoZSBndWFyZCBvciBk
ZXBsb3kgdGhpcyBkcmFmdC4KLSBDbG91ZCBTeW5jIHJlbWFpbnMgT0ZGOyBwcm9kdWN0aW9uIHVu
Y2hhbmdlZC4gKipETyBOT1QgREVQTE9ZKiouCgojIyBOZXh0ClByb3Zpc2lvbiBkaXNwb3NhYmxl
IFN1cGFiYXNlLWNvbXBhdGlibGUgdGVzdCBpbnN0YW5jZSB3aXRoIGlzb2xhdGVkIEF1dGggZml4
dHVyZXM7IHZlcmlmeSBkYXRhYmFzZSBmaW5nZXJwcmludCwgdGhlbiBydW4gdGhlIDE1IHJ1bnRp
bWUgc2NlbmFyaW9zIGluIGBQT1NUR1JFU19JTlRFR1JBVElPTl9URVNUX1BMQU4ubWRgIGFuZCBw
cmVzZXJ2ZSBldmlkZW5jZS4K
```

### ARCHIVED FILE: STAGE13_RUNTIME_GATE_CHECKPOINT.md | SHA256 39ac366a0b8c6f46f95a75ed35512d46c36a73980dd3c4cef6d8ccc56beeac1f

```base64
IyBTdGFnZSAxMyDigJQgUG9zdGdyZVNRTCBSdW50aW1lIEdhdGUgUHJlcGFyYXRpb24gKDM4OSBQ
QVNTKQpEYXRlOiAyMDI2LTEwLTEyLiBTb3VyY2U6IDM4NSBQQVNTIGNoZWNrcG9pbnQuCgojIyBD
b21wbGV0ZWQKLSBSZS1leHRyYWN0ZWQgY2hlY2twb2ludCBhbmQgaW5zcGVjdGVkIFBvc3RncmVT
UUwgaW50ZWdyYXRpb24gcGxhbiwgYWRtaW5pc3RyYXRvciB1bmxvY2sgZHJhZnQsIGFuZCB3cml0
ZXIgUlBDIGRyYWZ0LgotIEFkZGVkIGZvdXIgTm9kZSByZWdyZXNzaW9uIGNoZWNrcyBpbiBgdGVz
dHMvc3luYy1zdGFnZTEzLXVubG9jay1ydW50aW1lLWdhdGUudGVzdC5janNgIGZvciBleHBsaWNp
dCB1bmV4ZWN1dGVkIGdhdGUsIGRpc3Bvc2FibGUgQXV0aCBmaXh0dXJlcywgYXBwZW5kLW9ubHkg
YXVkaXQsIGdhbWUgcHJlc2VydmF0aW9uLCBhbmQgVU5TQUZFIERSQUZUIGJsb2NrZXJzLgotIFJh
biBgbm9kZSAtLXRlc3QgdGVzdHMvKi50ZXN0LmNqc2A6ICoqMzg5IFBBU1MsIDAgRkFJTCoqOyBs
b2cgYHRlc3RzL3N0YWdlMTNfcnVudGltZV9nYXRlX3J1bi5sb2dgLgoKIyMgQ3JpdGljYWwgcmV2
aWV3IGZpbmRpbmcKYHN1cGFiYXNlX3N5bmNfcnBjX2RyYWZ0LnNxbGAgY29udGFpbnMgYW4gaW50
ZW50aW9uYWwgYFVOU0FGRSBEUkFGVGAgZXhjZXB0aW9uIGJ1dCBhbHNvIEdSQU5UIEVYRUNVVEUg
c3RhdGVtZW50cyBhbmQgQ09NTUlUIGxhdGVyIGluIHRoZSBmaWxlLiBUaGlzIGlzIE5PVCBhIGRl
cGxveWFibGUgbWlncmF0aW9uLiBJdHMgZ3VhcmQgbXVzdCBub3QgYmUgcmVtb3ZlZCBvciBieXBh
c3NlZC4gVGhlIGFkbWluIHVubG9jayBkcmFmdCBzZXBhcmF0ZWx5IGVuZHMgd2l0aCBST0xMQkFD
SyBhbmQgbm8gR1JBTlQuCgojIyBOb3QgY29tcGxldGVkCk5vIFBvc3RncmVTUUwgc2VydmVyIG9y
IFN1cGFiYXNlLWNvbXBhdGlibGUgZGlzcG9zYWJsZSB0ZXN0IGluc3RhbmNlIHdhcyBhdmFpbGFi
bGUuIE5vIHJlYWwgZGF0YWJhc2UgaW50ZWdyYXRpb24sIGNvbmN1cnJlbmN5IHRpbWluZywgUkxT
LCByb2xsYmFjayBvciBzZXNzaW9uLXJldm9jYXRpb24gZXZpZGVuY2Ugb2J0YWluZWQuIENsb3Vk
IFN5bmMgcmVtYWlucyBPRkYuIE5vIHByb2R1Y3Rpb24gZGF0YWJhc2Ugb3IgZGVwbG95bWVudCB0
b3VjaGVkLgoKIyMgTmV4dCBnYXRlClByb3Zpc2lvbiBpc29sYXRlZCBTdXBhYmFzZS1jb21wYXRp
YmxlIHRlc3QgZGF0YWJhc2UsIHZlcmlmeSBkZXN0aW5hdGlvbiBmaW5nZXJwcmludCwgcnVuIHJl
dmlld2VkIGZpeHR1cmUtb25seSBtaWdyYXRpb25zIGFuZCBhdXRoLXNlc3Npb24vUkxTIHNjZW5h
cmlvcywgcmVjb3JkIGFjdHVhbCBsb2dzLiBEbyBub3QgcnVuIGFueSBkcmFmdCBhZ2FpbnN0IHBy
b2R1Y3Rpb24uCg==
```

### ARCHIVED FILE: STAGE14_16_TEST_RESULTS.txt | SHA256 03d2d777b6b2c7dda41308b72d9653bda467cafa44f83eb7db9024d819333c5e

```base64
VEFQIHZlcnNpb24gMTMKIyBTdWJ0ZXN0OiBQb3N0Z3JlU1FMIHByZWZsaWdodCBvcGVucyBhbiBl
eHBsaWNpdCByZWFkLW9ubHkgdHJhbnNhY3Rpb24Kb2sgMSAtIFBvc3RncmVTUUwgcHJlZmxpZ2h0
IG9wZW5zIGFuIGV4cGxpY2l0IHJlYWQtb25seSB0cmFuc2FjdGlvbgogIC0tLQogIGR1cmF0aW9u
X21zOiAxLjE0NTUwOQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFBvc3RncmVTUUwg
cHJlZmxpZ2h0IG5ldmVyIHNlbmRzIG1pZ3JhdGlvbnMgb3Igd3JpdGVzCm9rIDIgLSBQb3N0Z3Jl
U1FMIHByZWZsaWdodCBuZXZlciBzZW5kcyBtaWdyYXRpb25zIG9yIHdyaXRlcwogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjQ2NDQ5NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFBvc3Rn
cmVTUUwgcHJlZmxpZ2h0IHZhbGlkYXRlcyBkYXRhYmFzZSBpZGVudGlmaWVyIGFuZCBmYWlscyBj
bG9zZWQgb24gY29ubmVjdGlvbiBlcnJvcnMKb2sgMyAtIFBvc3RncmVTUUwgcHJlZmxpZ2h0IHZh
bGlkYXRlcyBkYXRhYmFzZSBpZGVudGlmaWVyIGFuZCBmYWlscyBjbG9zZWQgb24gY29ubmVjdGlv
biBlcnJvcnMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNjY4MwogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IFNjb3JlIGVkaXQgcm9sbHMgYmFjayBjb21wbGV0ZSBzdGF0ZSBvbiBzYXZl
IGZhaWx1cmUKb2sgNCAtIFNjb3JlIGVkaXQgcm9sbHMgYmFjayBjb21wbGV0ZSBzdGF0ZSBvbiBz
YXZlIGZhaWx1cmUKICAtLS0KICBkdXJhdGlvbl9tczogMi43MTE3NAogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IFNjb3JlIGVkaXQgcGVyc2lzdHMgbmV3IHJlc3VsdCBvbiBzYXZlIHN1
Y2Nlc3MKb2sgNSAtIFNjb3JlIGVkaXQgcGVyc2lzdHMgbmV3IHJlc3VsdCBvbiBzYXZlIHN1Y2Nl
c3MKICAtLS0KICBkdXJhdGlvbl9tczogMS43Nzk1OTEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBRdWFkIGRlbGV0aW9uIHJvbGxzIGJhY2sgY29tcGxldGUgc3RhdGUgb24gc2F2ZSBm
YWlsdXJlCm9rIDYgLSBRdWFkIGRlbGV0aW9uIHJvbGxzIGJhY2sgY29tcGxldGUgc3RhdGUgb24g
c2F2ZSBmYWlsdXJlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMDI0OTI4CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogUXVhZCBkZWxldGlvbiBwZXJzaXN0cyBvbiBzYXZlIHN1Y2Nlc3MK
b2sgNyAtIFF1YWQgZGVsZXRpb24gcGVyc2lzdHMgb24gc2F2ZSBzdWNjZXNzCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDEuODY0NDc4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb2xkIHNj
b3JlIGVkaXQgcmViYXNlcyBuZXdlciBiZWZvcmUKb2sgOCAtIG9sZCBzY29yZSBlZGl0IHJlYmFz
ZXMgbmV3ZXIgYmVmb3JlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDMuMzEzNjkyCiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogb2xkIHNjb3JlIGVkaXQgc2F2ZSBmYWlsdXJlIHJvbGxzIGJh
Y2sgcmViYXNpbmcKb2sgOSAtIG9sZCBzY29yZSBlZGl0IHNhdmUgZmFpbHVyZSByb2xscyBiYWNr
IHJlYmFzaW5nCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuOTI1MjA5CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogb2xkIHF1YWQgZGVsZXRpb24gcmViYXNlcyBuZXdlciBiZWZvcmUKb2sg
MTAgLSBvbGQgcXVhZCBkZWxldGlvbiByZWJhc2VzIG5ld2VyIGJlZm9yZQogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjkwNjE1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb2xkIHF1YWQg
ZGVsZXRpb24gc2F2ZSBmYWlsdXJlIHJvbGxzIGJhY2sgcmViYXNpbmcKb2sgMTEgLSBvbGQgcXVh
ZCBkZWxldGlvbiBzYXZlIGZhaWx1cmUgcm9sbHMgYmFjayByZWJhc2luZwogIC0tLQogIGR1cmF0
aW9uX21zOiAxLjY1NjQ2NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxlZ2FjeSBt
aXNzaW5nIG5ld2VyIGJlZm9yZSBibG9ja3Mgc2NvcmUgZWRpdApvayAxMiAtIGxlZ2FjeSBtaXNz
aW5nIG5ld2VyIGJlZm9yZSBibG9ja3Mgc2NvcmUgZWRpdAogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjY1MjA3OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxlZ2FjeSBtaXNzaW5nIG5l
d2VyIGJlZm9yZSBibG9ja3MgcXVhZCBkZWxldGlvbgpvayAxMyAtIGxlZ2FjeSBtaXNzaW5nIG5l
d2VyIGJlZm9yZSBibG9ja3MgcXVhZCBkZWxldGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjcw
MjUxNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgcHJlZmxpZ2h0IGV4
YW1pbmVzIGFsbCBmb3VyIHN5bmMgZm91bmRhdGlvbiB0YWJsZXMKb2sgMTQgLSBTdGFnZTE0IHBy
ZWZsaWdodCBleGFtaW5lcyBhbGwgZm91ciBzeW5jIGZvdW5kYXRpb24gdGFibGVzCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuOTQ0NzQ4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3Rh
Z2UxNCBwcmVmbGlnaHQgY2hlY2tzIGRpcmVjdCBETUwgcHJpdmlsZWdlcyBmb3IgYm90aCBBUEkg
cm9sZXMKb2sgMTUgLSBTdGFnZTE0IHByZWZsaWdodCBjaGVja3MgZGlyZWN0IERNTCBwcml2aWxl
Z2VzIGZvciBib3RoIEFQSSByb2xlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE5OTEzOQogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgcHJlZmxpZ2h0IGF1ZGl0cyBwb2xp
Y2llcywgaW5kZXhlcyBhbmQgUlBDIGV4ZWN1dGUgZ3JhbnRzIHdpdGhvdXQgbXV0YXRpb25zCm9r
IDE2IC0gU3RhZ2UxNCBwcmVmbGlnaHQgYXVkaXRzIHBvbGljaWVzLCBpbmRleGVzIGFuZCBSUEMg
ZXhlY3V0ZSBncmFudHMgd2l0aG91dCBtdXRhdGlvbnMKICAtLS0KICBkdXJhdGlvbl9tczogMC41
NjI1OTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZTE0IHByZWZsaWdodCBl
eHBsaWNpdGx5IHJlcG9ydHMgbWlzc2luZyBmb3VuZGF0aW9uIHRhYmxlcyByYXRoZXIgdGhhbiBz
aWxlbnRseSBvbWl0dGluZyB0aGVtCm9rIDE3IC0gU3RhZ2UxNCBwcmVmbGlnaHQgZXhwbGljaXRs
eSByZXBvcnRzIG1pc3NpbmcgZm91bmRhdGlvbiB0YWJsZXMgcmF0aGVyIHRoYW4gc2lsZW50bHkg
b21pdHRpbmcgdGhlbQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE2ODU1MwogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IGVtcHR5IGV2aWRlbmNlIGlzIGJsb2NrZWQKb2sgMTggLSBlbXB0
eSBldmlkZW5jZSBpcyBibG9ja2VkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODE1MDQzCiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29tcGxldGUgcmVzdHJpY3RpdmUgdGFibGUgZXZp
ZGVuY2UgcGFzc2VzIHByb3Zpc2lvbmFsIGFjY2VzcyBjaGVja3MKb2sgMTkgLSBjb21wbGV0ZSBy
ZXN0cmljdGl2ZSB0YWJsZSBldmlkZW5jZSBwYXNzZXMgcHJvdmlzaW9uYWwgYWNjZXNzIGNoZWNr
cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE4ODQ3MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IG1pc3NpbmcgdGFibGUgZXZpZGVuY2UgYmxvY2tzCm9rIDIwIC0gbWlzc2luZyB0YWJs
ZSBldmlkZW5jZSBibG9ja3MKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMDY1NQogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGRpcmVjdCBhdXRoZW50aWNhdGVkIHVwZGF0ZSBibG9ja3MK
b2sgMjEgLSBkaXJlY3QgYXV0aGVudGljYXRlZCB1cGRhdGUgYmxvY2tzCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuMTg2OTkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBkaXJlY3QgYW5v
biBpbnNlcnQgYmxvY2tzCm9rIDIyIC0gZGlyZWN0IGFub24gaW5zZXJ0IGJsb2NrcwogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjEzMTA2NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGRp
c2FibGVkIFJMUyBibG9ja3MKb2sgMjMgLSBkaXNhYmxlZCBSTFMgYmxvY2tzCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDEuMDUzNTIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiB1bmtub3du
IHByaXZpbGVnZSBibG9ja3MKb2sgMjQgLSB1bmtub3duIHByaXZpbGVnZSBibG9ja3MKICAtLS0K
ICBkdXJhdGlvbl9tczogMC4xNTQyMjIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBk
dXBsaWNhdGUgY29uZmxpY3RpbmcgZXZpZGVuY2UgYmxvY2tzCm9rIDI1IC0gZHVwbGljYXRlIGNv
bmZsaWN0aW5nIGV2aWRlbmNlIGJsb2NrcwogIC0tLQogIGR1cmF0aW9uX21zOiAyLjA0OTUwNQog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgY2FuZGlkYXRlIGlzIGJsb2Nr
ZWQgZnJvbSBwcm9kdWN0aW9uIGV4ZWN1dGlvbgpvayAyNiAtIFN0YWdlMTQgY2FuZGlkYXRlIGlz
IGJsb2NrZWQgZnJvbSBwcm9kdWN0aW9uIGV4ZWN1dGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjcxNjA2NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgbmV3ZXIgc2Vz
c2lvbiBtYXkgcGFzcyB3aXRob3V0IGhpc3RvcmljYWwgZGV2aWNlIGxvY2sKb2sgMjcgLSBTdGFn
ZTE0IG5ld2VyIHNlc3Npb24gbWF5IHBhc3Mgd2l0aG91dCBoaXN0b3JpY2FsIGRldmljZSBsb2Nr
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTc0NTQyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogU3RhZ2UxNCBwcmVmbGlnaHQgcHJlY2VkZXMgd3JpdGVyIHJldm9jYXRpb24Kb2sgMjgg
LSBTdGFnZTE0IHByZWZsaWdodCBwcmVjZWRlcyB3cml0ZXIgcmV2b2NhdGlvbgogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjE0ODQzMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdl
MTQgb2xkIHdyaXRlciB0b2tlbiByZXZva2VkIGFuZCBzZXNzaW9uIGdlbmVyYXRpb24gcm90YXRl
ZApvayAyOSAtIFN0YWdlMTQgb2xkIHdyaXRlciB0b2tlbiByZXZva2VkIGFuZCBzZXNzaW9uIGdl
bmVyYXRpb24gcm90YXRlZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIwMDE2CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCBjb21taXQgdmFsaWRhdGVzIHNlc3Npb24gdG9r
ZW4gZ2VuZXJhdGlvbiBhbmQgY2xvdWQgcmV2aXNpb24Kb2sgMzAgLSBTdGFnZTE0IGNvbW1pdCB2
YWxpZGF0ZXMgc2Vzc2lvbiB0b2tlbiBnZW5lcmF0aW9uIGFuZCBjbG91ZCByZXZpc2lvbgogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjg0ODk0MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IFN0YWdlMTQgY2FuZGlkYXRlIHJlamVjdHMgb2xkZXIgYXV0aCBsb2dpbiBldmVuIGFmdGVyIG5l
d2VyIHNlc3Npb24gZXhwaXJlcwpvayAzMSAtIFN0YWdlMTQgY2FuZGlkYXRlIHJlamVjdHMgb2xk
ZXIgYXV0aCBsb2dpbiBldmVuIGFmdGVyIG5ld2VyIHNlc3Npb24gZXhwaXJlcwogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjE1NTE3MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbXBs
ZXRlIGludmVudG9yeSBwYXNzZXMgcHJlc2VuY2Utb25seSBnYXRlCm9rIDMyIC0gY29tcGxldGUg
aW52ZW50b3J5IHBhc3NlcyBwcmVzZW5jZS1vbmx5IGdhdGUKICAtLS0KICBkdXJhdGlvbl9tczog
MC43OTk4MjEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBtaXNzaW5nIGV2aWRlbmNl
IGZhaWxzIGNsb3NlZApvayAzMyAtIG1pc3NpbmcgZXZpZGVuY2UgZmFpbHMgY2xvc2VkCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMTcyMTM5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
ZHVwbGljYXRlIGNvbHVtbiBldmlkZW5jZSBmYWlscwpvayAzNCAtIGR1cGxpY2F0ZSBjb2x1bW4g
ZXZpZGVuY2UgZmFpbHMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMjc4NzIKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiBtaXNzaW5nIGluc3RhbGxlZCBjb2x1bW4gZmFpbHMKb2sgMzUg
LSBtaXNzaW5nIGluc3RhbGxlZCBjb2x1bW4gZmFpbHMKICAtLS0KICBkdXJhdGlvbl9tczogMC4z
Njk3MzUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiB1bmtub3duIGluc3RhbGxlZCBz
dGF0ZSBmYWlscwpvayAzNiAtIHVua25vd24gaW5zdGFsbGVkIHN0YXRlIGZhaWxzCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuMTQ3MzUxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogdW5r
bm93biBkYXRhIHR5cGUgZmFpbHMKb2sgMzcgLSB1bmtub3duIGRhdGEgdHlwZSBmYWlscwogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjExMzU3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
bm9uLWFycmF5IGV2aWRlbmNlIGZhaWxzCm9rIDM4IC0gbm9uLWFycmF5IGV2aWRlbmNlIGZhaWxz
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTgxNDQyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogc3RhZ2UxNCB0eXBlIGdhdGUgYWNjZXB0cyBleGFjdCBleHBlY3RlZCB0eXBlcwpvayAz
OSAtIHN0YWdlMTQgdHlwZSBnYXRlIGFjY2VwdHMgZXhhY3QgZXhwZWN0ZWQgdHlwZXMKICAtLS0K
ICBkdXJhdGlvbl9tczogMS4yNTg0MTkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBz
dGFnZTE0IHR5cGUgZ2F0ZSByZWplY3RzIG1pc3NpbmcgZXZpZGVuY2UKb2sgNDAgLSBzdGFnZTE0
IHR5cGUgZ2F0ZSByZWplY3RzIG1pc3NpbmcgZXZpZGVuY2UKICAtLS0KICBkdXJhdGlvbl9tczog
MC4yNjY5MTEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdGFnZTE0IHR5cGUgZ2F0
ZSByZWplY3RzIGR1cGxpY2F0ZSBldmlkZW5jZQpvayA0MSAtIHN0YWdlMTQgdHlwZSBnYXRlIHJl
amVjdHMgZHVwbGljYXRlIGV2aWRlbmNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTk1ODQ0CiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3RhZ2UxNCB0eXBlIGdhdGUgcmVqZWN0cyBt
aXNzaW5nIGluc3RhbGxlZCBmbGFnCm9rIDQyIC0gc3RhZ2UxNCB0eXBlIGdhdGUgcmVqZWN0cyBt
aXNzaW5nIGluc3RhbGxlZCBmbGFnCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjY2NjcxCiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3RhZ2UxNCB0eXBlIGdhdGUgcmVqZWN0cyBpbmNv
bXBhdGlibGUgdXVpZCB0eXBlCm9rIDQzIC0gc3RhZ2UxNCB0eXBlIGdhdGUgcmVqZWN0cyBpbmNv
bXBhdGlibGUgdXVpZCB0eXBlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjA5ODc1CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3RhZ2UxNCB0eXBlIGdhdGUgcmVqZWN0cyBpbnZhbGlk
IGlucHV0Cm9rIDQ0IC0gc3RhZ2UxNCB0eXBlIGdhdGUgcmVqZWN0cyBpbnZhbGlkIGlucHV0CiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMTQ4MzkzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogU3RhZ2UxNCBTUUwgY2FuZGlkYXRlIHJldGFpbnMgbm9uLWRlcGxveWFibGUgZmlyc3Qtc3Rh
dGVtZW50IGdhdGUKb2sgNDUgLSBTdGFnZTE0IFNRTCBjYW5kaWRhdGUgcmV0YWlucyBub24tZGVw
bG95YWJsZSBmaXJzdC1zdGF0ZW1lbnQgZ2F0ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjk1Mzk5
MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgd3JpdGVyIHRha2VvdmVy
IHZhbGlkYXRlcyBjbG91ZCBwcmVmbGlnaHQgYmVmb3JlIHJldm9raW5nIHByZXZpb3VzIHdyaXRl
cgpvayA0NiAtIFN0YWdlMTQgd3JpdGVyIHRha2VvdmVyIHZhbGlkYXRlcyBjbG91ZCBwcmVmbGln
aHQgYmVmb3JlIHJldm9raW5nIHByZXZpb3VzIHdyaXRlcgogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjE4MzA5NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgY29tbWl0IG5l
dmVyIHN0b3JlcyByZWplY3RlZCByZXZva2VkLXdyaXRlciBwYXlsb2FkIGluIGNvbmZsaWN0IGxl
ZGdlcgpvayA0NyAtIFN0YWdlMTQgY29tbWl0IG5ldmVyIHN0b3JlcyByZWplY3RlZCByZXZva2Vk
LXdyaXRlciBwYXlsb2FkIGluIGNvbmZsaWN0IGxlZGdlcgogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjE0MjQ0NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgcmVhZC1vbmx5
IGVucm9sbG1lbnQgY2Fubm90IGRvd25ncmFkZSBhY3RpdmUgd3JpdGVyLCBhbmQgcmVhZGVyIGFj
Y2VzcyByZWNoZWNrcyBwZXJtaXNzaW9uCm9rIDQ4IC0gU3RhZ2UxNCByZWFkLW9ubHkgZW5yb2xs
bWVudCBjYW5ub3QgZG93bmdyYWRlIGFjdGl2ZSB3cml0ZXIsIGFuZCByZWFkZXIgYWNjZXNzIHJl
Y2hlY2tzIHBlcm1pc3Npb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4xMTEwNzcKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdGFnZTE0IGRlZmF1bHRzIGFjY2VwdCBjYW5kaWRhdGUg
bWV0YWRhdGEKb2sgNDkgLSBzdGFnZTE0IGRlZmF1bHRzIGFjY2VwdCBjYW5kaWRhdGUgbWV0YWRh
dGEKICAtLS0KICBkdXJhdGlvbl9tczogMS4wOTAyMjYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBzdGFnZTE0IGRlZmF1bHRzIHJlamVjdCBhYnNlbnQgcm93Cm9rIDUwIC0gc3RhZ2Ux
NCBkZWZhdWx0cyByZWplY3QgYWJzZW50IHJvdwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE2OTIz
NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0YWdlMTQgZGVmYXVsdHMgcmVqZWN0
IGR1cGxpY2F0ZSByb3cKb2sgNTEgLSBzdGFnZTE0IGRlZmF1bHRzIHJlamVjdCBkdXBsaWNhdGUg
cm93CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTM1NDYzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogc3RhZ2UxNCBkZWZhdWx0cyByZWplY3QgbnVsbGFibGUgYm9vbGVhbgpvayA1MiAt
IHN0YWdlMTQgZGVmYXVsdHMgcmVqZWN0IG51bGxhYmxlIGJvb2xlYW4KICAtLS0KICBkdXJhdGlv
bl9tczogMC4yMjE3MjIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdGFnZTE0IGRl
ZmF1bHRzIHJlamVjdCB0cnVlIGRlZmF1bHQKb2sgNTMgLSBzdGFnZTE0IGRlZmF1bHRzIHJlamVj
dCB0cnVlIGRlZmF1bHQKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNDMxMTUKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiBzdGFnZTE0IGRlZmF1bHRzIHJlamVjdCBudWxsIGRlZmF1bHQK
b2sgNTQgLSBzdGFnZTE0IGRlZmF1bHRzIHJlamVjdCBudWxsIGRlZmF1bHQKICAtLS0KICBkdXJh
dGlvbl9tczogMC4xMDUxODgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdGFnZTE0
IGRlZmF1bHRzIHJlamVjdCB1bnRydXN0ZWQgZXhwcmVzc2lvbgpvayA1NSAtIHN0YWdlMTQgZGVm
YXVsdHMgcmVqZWN0IHVudHJ1c3RlZCBleHByZXNzaW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
ODAzNjU2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3RhZ2UxNCBkZWZhdWx0cyBy
ZWplY3QgbWFsZm9ybWVkIGV2aWRlbmNlCm9rIDU2IC0gc3RhZ2UxNCBkZWZhdWx0cyByZWplY3Qg
bWFsZm9ybWVkIGV2aWRlbmNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTAxNzYzCiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYnVuZGxlIG1pc3NpbmcgYWxsIGV2aWRlbmNlIGZhaWxz
IGNsb3NlZApvayA1NyAtIGJ1bmRsZSBtaXNzaW5nIGFsbCBldmlkZW5jZSBmYWlscyBjbG9zZWQK
ICAtLS0KICBkdXJhdGlvbl9tczogMC44NTQ1NjIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBidW5kbGUgbnVsbCBmYWlscyBjbG9zZWQKb2sgNTggLSBidW5kbGUgbnVsbCBmYWlscyBj
bG9zZWQKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMDk5MDUKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBidW5kbGUgcmVwb3J0cyBmb3VyIGluZGVwZW5kZW50IGdhdGVzCm9rIDU5IC0g
YnVuZGxlIHJlcG9ydHMgZm91ciBpbmRlcGVuZGVudCBnYXRlcwogIC0tLQogIGR1cmF0aW9uX21z
OiAxLjQ5OTE5OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGJ1bmRsZSBtaXNzaW5n
IGRlZmF1bHRzIGZhaWxzIGV2ZW4gaWYgb3RoZXIgc2VjdGlvbnMgcHJvdmlkZWQKb2sgNjAgLSBi
dW5kbGUgbWlzc2luZyBkZWZhdWx0cyBmYWlscyBldmVuIGlmIG90aGVyIHNlY3Rpb25zIHByb3Zp
ZGVkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDIxNzUzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogYnVuZGxlIG1hbGZvcm1lZCBzZWN0aW9uIGNhbm5vdCBwYXNzCm9rIDYxIC0gYnVu
ZGxlIG1hbGZvcm1lZCBzZWN0aW9uIGNhbm5vdCBwYXNzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
OTA4MTQzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYnVuZGxlIGRvZXMgbm90IGNs
YWltIHJ1bnRpbWUgdmFsaWRhdGlvbgpvayA2MiAtIGJ1bmRsZSBkb2VzIG5vdCBjbGFpbSBydW50
aW1lIHZhbGlkYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4xNzk4MgogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgZXhpc3RpbmcgaXNfY3VycmVudCBkZWZhdWx0IGV4
cGxpY2l0bHkgc2V0IGZhbHNlCm9rIDYzIC0gU3RhZ2UxNCBleGlzdGluZyBpc19jdXJyZW50IGRl
ZmF1bHQgZXhwbGljaXRseSBzZXQgZmFsc2UKICAtLS0KICBkdXJhdGlvbl9tczogMC43MzE4ODgK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZTE0IGRlZmF1bHQgYWxpZ25tZW50
IGRvZXMgbm90IHVwZGF0ZSBoaXN0b3JpY2FsIGdhbWUgcm93cwpvayA2NCAtIFN0YWdlMTQgZGVm
YXVsdCBhbGlnbm1lbnQgZG9lcyBub3QgdXBkYXRlIGhpc3RvcmljYWwgZ2FtZSByb3dzCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMjY1ODY5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
U3RhZ2UxNCBjYW5kaWRhdGUgcmV0YWlucyBmYWlsLWNsb3NlZCBndWFyZCBhaGVhZCBvZiBkZWZh
dWx0IG1pZ3JhdGlvbgpvayA2NSAtIFN0YWdlMTQgY2FuZGlkYXRlIHJldGFpbnMgZmFpbC1jbG9z
ZWQgZ3VhcmQgYWhlYWQgb2YgZGVmYXVsdCBtaWdyYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczog
MC4xNDk5NTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZTE0IGhpc3Rvcnkg
cmVqZWN0cyBtaXNzaW5nLCBudWxsIGFuZCBub24tYXJyYXkgSlNPTgpvayA2NiAtIFN0YWdlMTQg
aGlzdG9yeSByZWplY3RzIG1pc3NpbmcsIG51bGwgYW5kIG5vbi1hcnJheSBKU09OCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDEuMTA2NDUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFn
ZTE0IGhpc3RvcnkgYXJyYXkgbGVuZ3RoIGNoZWNrZWQgb25seSBhZnRlciB0eXBlIGd1YXJkCm9r
IDY3IC0gU3RhZ2UxNCBoaXN0b3J5IGFycmF5IGxlbmd0aCBjaGVja2VkIG9ubHkgYWZ0ZXIgdHlw
ZSBndWFyZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI2ODg4NAogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IFN0YWdlMTQgY2FuZGlkYXRlIHJlbWFpbnMgYmxvY2tlZCBiZWZvcmUgRERM
Cm9rIDY4IC0gU3RhZ2UxNCBjYW5kaWRhdGUgcmVtYWlucyBibG9ja2VkIGJlZm9yZSBEREwKICAt
LS0KICBkdXJhdGlvbl9tczogMC4xNjMzNjUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBTdGFnZTE0IHByb2R1Y3Rpb24gYm91bmRhcnkgcmVtYWlucyBmYWlsIGNsb3NlZApvayA2OSAt
IFN0YWdlMTQgcHJvZHVjdGlvbiBib3VuZGFyeSByZW1haW5zIGZhaWwgY2xvc2VkCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDEuMDYzMTU2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3Rh
Z2UxNCBkcmFmdCByZXF1aXJlcyBzY2hlbWEgY29sdW1ucyBhYnNlbnQgZnJvbSBwcm9kdWN0aW9u
IG1ldGFkYXRhIGV4cG9ydApvayA3MCAtIFN0YWdlMTQgZHJhZnQgcmVxdWlyZXMgc2NoZW1hIGNv
bHVtbnMgYWJzZW50IGZyb20gcHJvZHVjdGlvbiBtZXRhZGF0YSBleHBvcnQKICAtLS0KICBkdXJh
dGlvbl9tczogMC4xNjYwNjkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZTE0
IGRyYWZ0IGRvZXMgbm90IHNpbGVudGx5IHJlcGxhY2UgZXhpc3RpbmcgY3VycmVudC1nYW1lIGRl
ZmF1bHQKb2sgNzEgLSBTdGFnZTE0IGRyYWZ0IGRvZXMgbm90IHNpbGVudGx5IHJlcGxhY2UgZXhp
c3RpbmcgY3VycmVudC1nYW1lIGRlZmF1bHQKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMTY1OTUK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZTE0IHNpbmdsZS1kZXZpY2Ugd3Jp
dGVyIHRha2VvdmVyIGlzIGludGVudGlvbmFsbHkgYmxvY2tlZCwgbm90IGF1dG9tYXRpYwpvayA3
MiAtIFN0YWdlMTQgc2luZ2xlLWRldmljZSB3cml0ZXIgdGFrZW92ZXIgaXMgaW50ZW50aW9uYWxs
eSBibG9ja2VkLCBub3QgYXV0b21hdGljCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTA4MjUzCiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCBjb21taXQgdmFsaWRhdGVzIHRv
a2VuIGFuZCBhdXRoLXNlc3Npb24gYmluZGluZwpvayA3MyAtIFN0YWdlMTQgY29tbWl0IHZhbGlk
YXRlcyB0b2tlbiBhbmQgYXV0aC1zZXNzaW9uIGJpbmRpbmcKICAtLS0KICBkdXJhdGlvbl9tczog
MC4yMzU2NzQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZXZva2VkIHdyaXRlciBh
dHRlbXB0cyBuZXZlciBwZXJzaXN0IHByb3Bvc2VkIHNuYXBzaG90cwpvayA3NCAtIHJldm9rZWQg
d3JpdGVyIGF0dGVtcHRzIG5ldmVyIHBlcnNpc3QgcHJvcG9zZWQgc25hcHNob3RzCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuODczMzQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWpl
Y3RlZCB3cml0ZXIgc3RpbGwgcmVjZWl2ZXMgZXhwbGljaXQgcmV2b2NhdGlvbiByZWFzb24Kb2sg
NzUgLSByZWplY3RlZCB3cml0ZXIgc3RpbGwgcmVjZWl2ZXMgZXhwbGljaXQgcmV2b2NhdGlvbiBy
ZWFzb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4xNTI2ODkKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiByZXZpc2lvbi1jb25mbGljdCByZXRhaW5zIGF1dGhvcml6ZWQgY29uZmxpY3Qg
bGVkZ2VyCm9rIDc2IC0gcmV2aXNpb24tY29uZmxpY3QgcmV0YWlucyBhdXRob3JpemVkIGNvbmZs
aWN0IGxlZGdlcgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEyMjA2MwogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IHJldm9rZWQgd3JpdGVyIGNhbm5vdCB1cGRhdGUgY2Fub25pY2FsIGdh
bWUgZGF0YQpvayA3NyAtIHJldm9rZWQgd3JpdGVyIGNhbm5vdCB1cGRhdGUgY2Fub25pY2FsIGdh
bWUgZGF0YQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEzNjE0NAogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IGNvbW1pdCByZW1haW5zIGJvdW5kIHRvIGF1dGggc2Vzc2lvbgpvayA3OCAt
IGNvbW1pdCByZW1haW5zIGJvdW5kIHRvIGF1dGggc2Vzc2lvbgogIC0tLQogIGR1cmF0aW9uX21z
OiAxLjA2NTA1OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNhbmRpZGF0ZSByZW1h
aW5zIGJsb2NrZWQgZnJvbSBkZXBsb3ltZW50Cm9rIDc5IC0gY2FuZGlkYXRlIHJlbWFpbnMgYmxv
Y2tlZCBmcm9tIGRlcGxveW1lbnQKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNTI2MDkKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBycGMgZXZpZGVuY2UgYWNjZXB0cyBjb21wbGV0ZSBj
YW5kaWRhdGUgbWV0YWRhdGEKb2sgODAgLSBycGMgZXZpZGVuY2UgYWNjZXB0cyBjb21wbGV0ZSBj
YW5kaWRhdGUgbWV0YWRhdGEKICAtLS0KICBkdXJhdGlvbl9tczogMC44MDM3MjYKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBycGMgZXZpZGVuY2UgZmFpbHMgY2xvc2VkIHdpdGhvdXQg
cm93cwpvayA4MSAtIHJwYyBldmlkZW5jZSBmYWlscyBjbG9zZWQgd2l0aG91dCByb3dzCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMTU0MzUyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
cnBjIGV2aWRlbmNlIHJlamVjdHMgbWlzc2luZyBmdW5jdGlvbgpvayA4MiAtIHJwYyBldmlkZW5j
ZSByZWplY3RzIG1pc3NpbmcgZnVuY3Rpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4xMDkwMjQK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBycGMgZXZpZGVuY2UgcmVqZWN0cyBkdXBs
aWNhdGUgZnVuY3Rpb24Kb2sgODMgLSBycGMgZXZpZGVuY2UgcmVqZWN0cyBkdXBsaWNhdGUgZnVu
Y3Rpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4xNDI3OTQKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBycGMgZXZpZGVuY2UgcmVqZWN0cyBhbm9ueW1vdXMgZXhlY3V0aW9uCm9rIDg0
IC0gcnBjIGV2aWRlbmNlIHJlamVjdHMgYW5vbnltb3VzIGV4ZWN1dGlvbgogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjExODE2NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJwYyBldmlk
ZW5jZSByZWplY3RzIFBVQkxJQyBleGVjdXRpb24Kb2sgODUgLSBycGMgZXZpZGVuY2UgcmVqZWN0
cyBQVUJMSUMgZXhlY3V0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMDgzODE2CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcnBjIGV2aWRlbmNlIHJlamVjdHMgbWlzc2luZyBzZWN1
cmUgc2VhcmNoIHBhdGgKb2sgODYgLSBycGMgZXZpZGVuY2UgcmVqZWN0cyBtaXNzaW5nIHNlY3Vy
ZSBzZWFyY2ggcGF0aAogIC0tLQogIGR1cmF0aW9uX21zOiAxLjg0MTgzNAogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IHJwYyBldmlkZW5jZSByZWplY3RzIHVuY29uZmlybWVkIHNlY3Vy
aXR5IGRlZmluZXIKb2sgODcgLSBycGMgZXZpZGVuY2UgcmVqZWN0cyB1bmNvbmZpcm1lZCBzZWN1
cml0eSBkZWZpbmVyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTE1NzUzCiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogc2lnbmF0dXJlIGludmVudG9yeSBhY2NlcHRzIHVuaXF1ZSBjb21w
bGV0ZSBjYW5kaWRhdGUKb2sgODggLSBzaWduYXR1cmUgaW52ZW50b3J5IGFjY2VwdHMgdW5pcXVl
IGNvbXBsZXRlIGNhbmRpZGF0ZQogIC0tLQogIGR1cmF0aW9uX21zOiAxLjQzMjQ4CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2lnbmF0dXJlIGludmVudG9yeSBmYWlscyBjbG9zZWQg
b24gbWlzc2luZyBpbnB1dApvayA4OSAtIHNpZ25hdHVyZSBpbnZlbnRvcnkgZmFpbHMgY2xvc2Vk
IG9uIG1pc3NpbmcgaW5wdXQKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMzQzNjIKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzaWduYXR1cmUgaW52ZW50b3J5IHJlamVjdHMgbWlzc2lu
ZyBSUEMKb2sgOTAgLSBzaWduYXR1cmUgaW52ZW50b3J5IHJlamVjdHMgbWlzc2luZyBSUEMKICAt
LS0KICBkdXJhdGlvbl9tczogMC4xODcwODEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBzaWduYXR1cmUgaW52ZW50b3J5IHJlamVjdHMgb3ZlcmxvYWRlZCBSUEMKb2sgOTEgLSBzaWdu
YXR1cmUgaW52ZW50b3J5IHJlamVjdHMgb3ZlcmxvYWRlZCBSUEMKICAtLS0KICBkdXJhdGlvbl9t
czogMC4yNjc2NjEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzaWduYXR1cmUgaW52
ZW50b3J5IHJlamVjdHMgY3Jvc3Mtc2NoZW1hIHNoYWRvdwpvayA5MiAtIHNpZ25hdHVyZSBpbnZl
bnRvcnkgcmVqZWN0cyBjcm9zcy1zY2hlbWEgc2hhZG93CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MTgzNjI2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2lnbmF0dXJlIGludmVudG9y
eSByZWplY3RzIHByb2NlZHVyZSBraW5kCm9rIDkzIC0gc2lnbmF0dXJlIGludmVudG9yeSByZWpl
Y3RzIHByb2NlZHVyZSBraW5kCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMTAyMTI0CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2lnbmF0dXJlIGludmVudG9yeSByZWplY3RzIGFic2Vu
dCBpZGVudGl0eSBhcmd1bWVudHMKb2sgOTQgLSBzaWduYXR1cmUgaW52ZW50b3J5IHJlamVjdHMg
YWJzZW50IGlkZW50aXR5IGFyZ3VtZW50cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjMwMDEyMQog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpZ25hdHVyZSBpbnZlbnRvcnkgcmVqZWN0
cyB1bnNhZmUgc2VhcmNoIHBhdGgKb2sgOTUgLSBzaWduYXR1cmUgaW52ZW50b3J5IHJlamVjdHMg
dW5zYWZlIHNlYXJjaCBwYXRoCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTY4NzY0CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2lnbmF0dXJlIGludmVudG9yeSByZWplY3RzIGludm9r
ZXIgcmlnaHRzCm9rIDk2IC0gc2lnbmF0dXJlIGludmVudG9yeSByZWplY3RzIGludm9rZXIgcmln
aHRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDI0MDc2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogUlBDIGludmVudG9yeSBxdWVyeSBpcyBTRUxFQ1Qtb25seQpvayA5NyAtIFJQQyBp
bnZlbnRvcnkgcXVlcnkgaXMgU0VMRUNULW9ubHkKICAtLS0KICBkdXJhdGlvbl9tczogMC45OTAz
OTYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBSUEMgaW52ZW50b3J5IGluY2x1ZGVz
IGFsbCBmaXZlIHRhcmdldCBmdW5jdGlvbnMKb2sgOTggLSBSUEMgaW52ZW50b3J5IGluY2x1ZGVz
IGFsbCBmaXZlIHRhcmdldCBmdW5jdGlvbnMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNDM5NjYK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBSUEMgaW52ZW50b3J5IGluY2x1ZGVzIGNy
b3NzLXNjaGVtYSBzaGFkb3cgZnVuY3Rpb25zCm9rIDk5IC0gUlBDIGludmVudG9yeSBpbmNsdWRl
cyBjcm9zcy1zY2hlbWEgc2hhZG93IGZ1bmN0aW9ucwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEx
NTk1NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFJQQyBpbnZlbnRvcnkgcmVhZHMg
cGdfcHJvYyBmdW5jdGlvbiBpZGVudGl0eSBhbmQgZGVmaW5lcgpvayAxMDAgLSBSUEMgaW52ZW50
b3J5IHJlYWRzIHBnX3Byb2MgZnVuY3Rpb24gaWRlbnRpdHkgYW5kIGRlZmluZXIKICAtLS0KICBk
dXJhdGlvbl9tczogMC4xNDkwODQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBSUEMg
aW52ZW50b3J5IGNvbnNlcnZhdGl2ZWx5IGNoZWNrcyBjb25maWd1cmVkIHNlYXJjaF9wYXRoCm9r
IDEwMSAtIFJQQyBpbnZlbnRvcnkgY29uc2VydmF0aXZlbHkgY2hlY2tzIGNvbmZpZ3VyZWQgc2Vh
cmNoX3BhdGgKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMDQ4MDcKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBTdGFnZTE0IHJlYWQtb25seSBwcmVmbGlnaHQgZXhwb3NlcyBib3RoIG1p
c3NpbmcgdHJhbnNmZXIgY29sdW1ucwpvayAxMDIgLSBTdGFnZTE0IHJlYWQtb25seSBwcmVmbGln
aHQgZXhwb3NlcyBib3RoIG1pc3NpbmcgdHJhbnNmZXIgY29sdW1ucwogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjc1NzkxOAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgcHJl
ZmxpZ2h0IHJlcG9ydHMgZXhpc3RpbmcgaXNfY3VycmVudCBkZWZhdWx0IGZvciBhbGlnbm1lbnQK
b2sgMTAzIC0gU3RhZ2UxNCBwcmVmbGlnaHQgcmVwb3J0cyBleGlzdGluZyBpc19jdXJyZW50IGRl
ZmF1bHQgZm9yIGFsaWdubWVudAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjExNjU3NQogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgc2NoZW1hIGludmVudG9yeSByZXRhaW5z
IGFic2VudCBjb2x1bW5zIHRocm91Z2ggbGVmdCBqb2luCm9rIDEwNCAtIFN0YWdlMTQgc2NoZW1h
IGludmVudG9yeSByZXRhaW5zIGFic2VudCBjb2x1bW5zIHRocm91Z2ggbGVmdCBqb2luCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMDk5ODUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBv
cGVuIHJlamVjdHMgd2hpdGVzcGFjZS1vbmx5IGRldmljZSBJRCBiZWZvcmUgdHJhbnNwb3J0Cm9r
IDEwNSAtIG9wZW4gcmVqZWN0cyB3aGl0ZXNwYWNlLW9ubHkgZGV2aWNlIElEIGJlZm9yZSB0cmFu
c3BvcnQKICAtLS0KICBkdXJhdGlvbl9tczogMS4xNTc2NjgKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiByZWFkIGFuZCBvcGVuUmVhZGVyIHJlamVjdCB3aGl0ZXNwYWNlLW9ubHkgZGV2
aWNlIElECm9rIDEwNiAtIHJlYWQgYW5kIG9wZW5SZWFkZXIgcmVqZWN0IHdoaXRlc3BhY2Utb25s
eSBkZXZpY2UgSUQKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNzU1NzMKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBvcGVuIHJlamVjdHMgd2hpdGVzcGFjZS1vbmx5IGV4cGVjdGVkIGNs
b3VkIGdhbWUgSUQKb2sgMTA3IC0gb3BlbiByZWplY3RzIHdoaXRlc3BhY2Utb25seSBleHBlY3Rl
ZCBjbG91ZCBnYW1lIElECiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTI0MjE2CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogY29tbWl0IHJlamVjdHMgd2hpdGVzcGFjZS1vbmx5IGdhbWUs
IGRldmljZSBhbmQgdG9rZW4gY3JlZGVudGlhbHMKb2sgMTA4IC0gY29tbWl0IHJlamVjdHMgd2hp
dGVzcGFjZS1vbmx5IGdhbWUsIGRldmljZSBhbmQgdG9rZW4gY3JlZGVudGlhbHMKICAtLS0KICBk
dXJhdGlvbl9tczogMC4yMTI5ODkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBsZWFz
ZVN0YXR1cyByZWplY3RzIHdoaXRlc3BhY2Utb25seSBkZXZpY2UgSUQKb2sgMTA5IC0gbGVhc2VT
dGF0dXMgcmVqZWN0cyB3aGl0ZXNwYWNlLW9ubHkgZGV2aWNlIElECiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMTQ4NzkzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbWF0Y2hpbmcgZXhp
c3RpbmcgY2xvdWQgZ2FtZSBpcyBhY2NlcHRlZCB3aXRob3V0IHdyaXRpbmcgc3RvcmFnZQpvayAx
MTAgLSBtYXRjaGluZyBleGlzdGluZyBjbG91ZCBnYW1lIGlzIGFjY2VwdGVkIHdpdGhvdXQgd3Jp
dGluZyBzdG9yYWdlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMjAxMDgyCiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogZGlmZmVyZW50IGV4aXN0aW5nIGdhbWUgaXMgbmV2ZXIgb3Zlcndy
aXR0ZW4gYnkgY2xvdWQgYWRvcHRpb24Kb2sgMTExIC0gZGlmZmVyZW50IGV4aXN0aW5nIGdhbWUg
aXMgbmV2ZXIgb3ZlcndyaXR0ZW4gYnkgY2xvdWQgYWRvcHRpb24KICAtLS0KICBkdXJhdGlvbl9t
czogMC43MjI4MzQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBkaXNhYmxlZCBicmlk
Z2UgY2Fubm90IGFjY2VzcyBzZXJ2ZXIgb3Igd3JpdGUgYXBwbGljYXRpb24Kb2sgMTEyIC0gZGlz
YWJsZWQgYnJpZGdlIGNhbm5vdCBhY2Nlc3Mgc2VydmVyIG9yIHdyaXRlIGFwcGxpY2F0aW9uCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDIuMzk3MjA4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogY2xvdWQgYWRvcHRpb24gbXVzdCBiZSBjb25maXJtZWQgYmVmb3JlIHJlcG9ydGluZyBhY3Rp
dmF0aW9uIHN1Y2Nlc3MKb2sgMTEzIC0gY2xvdWQgYWRvcHRpb24gbXVzdCBiZSBjb25maXJtZWQg
YmVmb3JlIHJlcG9ydGluZyBhY3RpdmF0aW9uIHN1Y2Nlc3MKICAtLS0KICBkdXJhdGlvbl9tczog
MC4zOTQ4ODIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzaWdub3V0IGludmFsaWRh
dGVzIHBlbmRpbmcgY2xvdWQgYWN0aXZhdGlvbgpvayAxMTQgLSBzaWdub3V0IGludmFsaWRhdGVz
IHBlbmRpbmcgY2xvdWQgYWN0aXZhdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE4NzEzMQog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxvZ291dCBzdXBwcmVzc2VzIGxhdGUgc3lu
YyBzdWNjZXNzIGZyb20gcHJldmlvdXMgYWNjb3VudApvayAxMTUgLSBsb2dvdXQgc3VwcHJlc3Nl
cyBsYXRlIHN5bmMgc3VjY2VzcyBmcm9tIHByZXZpb3VzIGFjY291bnQKICAtLS0KICBkdXJhdGlv
bl9tczogMC41MTQ3OTMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBsb2dvdXQgc3Vw
cHJlc3NlcyBsYXRlIHN5bmMgcmVqZWN0aW9uIGZyb20gcHJldmlvdXMgYWNjb3VudApvayAxMTYg
LSBsb2dvdXQgc3VwcHJlc3NlcyBsYXRlIHN5bmMgcmVqZWN0aW9uIGZyb20gcHJldmlvdXMgYWNj
b3VudAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQyMDUwMQogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IG5ldyBsb2dpbiBmb3Igc2FtZSB1c2VyIGludmFsaWRhdGVzIHByZXZpb3VzIHdy
aXRlciBsZWFzZQpvayAxMTcgLSBuZXcgbG9naW4gZm9yIHNhbWUgdXNlciBpbnZhbGlkYXRlcyBw
cmV2aW91cyB3cml0ZXIgbGVhc2UKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMTQ2ODIKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBtaXNzaW5nIGF1dGggc2Vzc2lvbiBpZCBjYW5ub3Qg
cmV1c2UgYSB3cml0ZXIgbGVhc2UKb2sgMTE4IC0gbWlzc2luZyBhdXRoIHNlc3Npb24gaWQgY2Fu
bm90IHJldXNlIGEgd3JpdGVyIGxlYXNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjI4ODEzCiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogSldUIHNlc3Npb24gaWRlbnRpdHkgY2hhbmdl
cyBpbnZhbGlkYXRlIGVhcmxpZXIgd3JpdGVyIGxlYXNlCm9rIDExOSAtIEpXVCBzZXNzaW9uIGlk
ZW50aXR5IGNoYW5nZXMgaW52YWxpZGF0ZSBlYXJsaWVyIHdyaXRlciBsZWFzZQogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjQ1MzE1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbG9jYWwg
c2NvcmUgc2F2ZWQgZHVyaW5nIGFjdGl2YXRpb24gcHJldmVudHMgc3RhbGUgY2xvdWQgYWRvcHRp
b24Kb2sgMTIwIC0gbG9jYWwgc2NvcmUgc2F2ZWQgZHVyaW5nIGFjdGl2YXRpb24gcHJldmVudHMg
c3RhbGUgY2xvdWQgYWRvcHRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC40NTU3MjMKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBsb2NhbCBzY29yZSBjaGFuZ2VkIGR1cmluZyBhY3Rp
dmF0aW9uIGJsb2NrcyBjbG91ZCBhZG9wdGlvbiBhbmQgcmV0YWlucyBsb2NhbCBzdGF0ZQpvayAx
MjEgLSBsb2NhbCBzY29yZSBjaGFuZ2VkIGR1cmluZyBhY3RpdmF0aW9uIGJsb2NrcyBjbG91ZCBh
ZG9wdGlvbiBhbmQgcmV0YWlucyBsb2NhbCBzdGF0ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQ5
OTY5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2NvcmUgcmVjb3JkZWQgZHVyaW5n
IGFjdGl2YXRpb24gaXMgZHVyYWJseSBxdWV1ZWQgYmVmb3JlIHRha2VvdmVyIGlzIGJsb2NrZWQK
b2sgMTIyIC0gc2NvcmUgcmVjb3JkZWQgZHVyaW5nIGFjdGl2YXRpb24gaXMgZHVyYWJseSBxdWV1
ZWQgYmVmb3JlIHRha2VvdmVyIGlzIGJsb2NrZWQKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNzUy
ODMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzeW5jaHJvbm91cyBlbmdpbmUgcHVz
aCBmYWlsdXJlIGJlY29tZXMgYSBjb250cm9sbGVkIHN5bmMgZXJyb3IKb2sgMTIzIC0gc3luY2hy
b25vdXMgZW5naW5lIHB1c2ggZmFpbHVyZSBiZWNvbWVzIGEgY29udHJvbGxlZCBzeW5jIGVycm9y
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjQ2MDM5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogYXN5bmNocm9ub3VzIGFkb3B0aW9uIGlzIGludmFsaWRhdGVkIHdoZW4gdXNlciBsb2dz
IG91dApvayAxMjQgLSBhc3luY2hyb25vdXMgYWRvcHRpb24gaXMgaW52YWxpZGF0ZWQgd2hlbiB1
c2VyIGxvZ3Mgb3V0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTc5NzcKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiByZXBlYXRlZCBhdXRoIG5vdGlmaWNhdGlvbiBjYW5ub3QgcmVwb3J0
IHJlYWR5IGJlZm9yZSBjbG91ZCBhZG9wdGlvbiBjb21wbGV0ZXMKb2sgMTI1IC0gcmVwZWF0ZWQg
YXV0aCBub3RpZmljYXRpb24gY2Fubm90IHJlcG9ydCByZWFkeSBiZWZvcmUgY2xvdWQgYWRvcHRp
b24gY29tcGxldGVzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODQ5OTI1CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogcmVhZC1vbmx5IGNsb3VkIHNlc3Npb24gbmV2ZXIgaW52b2tlcyBz
Y29yZSBjb21taXQKb2sgMTI2IC0gcmVhZC1vbmx5IGNsb3VkIHNlc3Npb24gbmV2ZXIgaW52b2tl
cyBzY29yZSBjb21taXQKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNTM1NDEKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiBzZXJ2ZXIgd3JpdGVyIHJldm9jYXRpb24gZGlzYWJsZXMgZnV0
dXJlIHNlbmRzIGFuZCByZWFkaW5lc3MKb2sgMTI3IC0gc2VydmVyIHdyaXRlciByZXZvY2F0aW9u
IGRpc2FibGVzIGZ1dHVyZSBzZW5kcyBhbmQgcmVhZGluZXNzCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMjM0MTIxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogdW5oYW5kbGVkIHF1ZXVl
IGZhaWx1cmUgZGlzYWJsZXMgd3JpdGVyIGxlYXNlIHVudGlsIHJlYWN0aXZhdGlvbgpvayAxMjgg
LSB1bmhhbmRsZWQgcXVldWUgZmFpbHVyZSBkaXNhYmxlcyB3cml0ZXIgbGVhc2UgdW50aWwgcmVh
Y3RpdmF0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjUyNzE5CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogbG9nb3V0IGJlZm9yZSBkZWZlcnJlZCBwdXNoIGRvZXMgbm90IGVucXVl
dWUgb3IgY29udGFjdCBvbGQgc2Vzc2lvbgpvayAxMjkgLSBsb2dvdXQgYmVmb3JlIGRlZmVycmVk
IHB1c2ggZG9lcyBub3QgZW5xdWV1ZSBvciBjb250YWN0IG9sZCBzZXNzaW9uCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMjA1Mjg4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWN0aXZh
dGlvbiByZWZ1c2VzIGEgd3JpdGVyIGxlYXNlIHdoZW4gZW5naW5lIHJlcG9ydHMgY29uZmxpY3QK
b2sgMTMwIC0gYWN0aXZhdGlvbiByZWZ1c2VzIGEgd3JpdGVyIGxlYXNlIHdoZW4gZW5naW5lIHJl
cG9ydHMgY29uZmxpY3QKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNzIyNTgKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiB1bnBhZGRlZCBiYXNlNjR1cmwgSldUIHNlc3Npb24gaWRlbnRp
dHkgd29ya3Mgd2l0aCBzdHJpY3QgU2FmYXJpLXN0eWxlIGF0b2IKb2sgMTMxIC0gdW5wYWRkZWQg
YmFzZTY0dXJsIEpXVCBzZXNzaW9uIGlkZW50aXR5IHdvcmtzIHdpdGggc3RyaWN0IFNhZmFyaS1z
dHlsZSBhdG9iCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjIxODAzCiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogZGVmZXJyZWQgY2xvdWQgc2VuZCBjYXB0dXJlcyB0aGUgZXhhY3Qgc2F2
ZWQgc2NvcmUgYmVmb3JlIGxhdGVyIG11dGF0aW9uCm9rIDEzMiAtIGRlZmVycmVkIGNsb3VkIHNl
bmQgY2FwdHVyZXMgdGhlIGV4YWN0IHNhdmVkIHNjb3JlIGJlZm9yZSBsYXRlciBtdXRhdGlvbgog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjY3MzI3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogZGV2aWNlIGlkZW50aXR5IHN0b3JhZ2UgZmFpbHVyZSBjbGVhcnMgdGVudGF0aXZlIGF1dGgg
YW5kIHJldHVybnMgY29udHJvbGxlZCBlcnJvcgpvayAxMzMgLSBkZXZpY2UgaWRlbnRpdHkgc3Rv
cmFnZSBmYWlsdXJlIGNsZWFycyB0ZW50YXRpdmUgYXV0aCBhbmQgcmV0dXJucyBjb250cm9sbGVk
IGVycm9yCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTc2MDY0CiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogYWRhcHRlciBpbml0aWFsaXphdGlvbiBmYWlsdXJlIG5ldmVyIHJldGFpbnMg
cGhhbnRvbSBhY2NvdW50IGxlYXNlCm9rIDEzNCAtIGFkYXB0ZXIgaW5pdGlhbGl6YXRpb24gZmFp
bHVyZSBuZXZlciByZXRhaW5zIHBoYW50b20gYWNjb3VudCBsZWFzZQogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjExODk4OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbmZsaWN0aW5n
IGV4cGxpY2l0IHNlc3Npb24gYW5kIEpXVCBzZXNzaW9uIGlkZW50aWZpZXJzIGZhaWwgY2xvc2Vk
Cm9rIDEzNSAtIGNvbmZsaWN0aW5nIGV4cGxpY2l0IHNlc3Npb24gYW5kIEpXVCBzZXNzaW9uIGlk
ZW50aWZpZXJzIGZhaWwgY2xvc2VkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzAyNjk1CiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogZXhwaXJlZCBKV1QgY2Fubm90IGFjdGl2YXRlIGEg
Y2xvdWQgd3JpdGVyIGxlYXNlCm9rIDEzNiAtIGV4cGlyZWQgSldUIGNhbm5vdCBhY3RpdmF0ZSBh
IGNsb3VkIHdyaXRlciBsZWFzZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjk4NzQwMQogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGZhaWxlZCBhY3RpdmF0aW9uIGNsZWFycyBhY2NvdW50
IGFuZCBhdXRoIHNlc3Npb24gaWRlbnRpdHkgYmVmb3JlIHJldHJ5Cm9rIDEzNyAtIGZhaWxlZCBh
Y3RpdmF0aW9uIGNsZWFycyBhY2NvdW50IGFuZCBhdXRoIHNlc3Npb24gaWRlbnRpdHkgYmVmb3Jl
IHJldHJ5CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjc5ODMKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiByZXBlYXRlZCBhdXRoIG5vdGlmaWNhdGlvbiBjYW5ub3QgcmV2aXZlIGEgcmV2
b2tlZCBlbmdpbmUgd3JpdGVyIGxlYXNlCm9rIDEzOCAtIHJlcGVhdGVkIGF1dGggbm90aWZpY2F0
aW9uIGNhbm5vdCByZXZpdmUgYSByZXZva2VkIGVuZ2luZSB3cml0ZXIgbGVhc2UKICAtLS0KICBk
dXJhdGlvbl9tczogMC4yMDM0MDYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBsZWFz
ZSBtb25pdG9yIHN0YXJ0cyBhZnRlciBhY3RpdmF0aW9uLCBhdm9pZHMgb3ZlcmxhcHBpbmcgY2hl
Y2tzIGFuZCBzdG9wcyBvbiBsb2dvdXQKb2sgMTM5IC0gbGVhc2UgbW9uaXRvciBzdGFydHMgYWZ0
ZXIgYWN0aXZhdGlvbiwgYXZvaWRzIG92ZXJsYXBwaW5nIGNoZWNrcyBhbmQgc3RvcHMgb24gbG9n
b3V0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDE3LjUyNzc2MwogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IGxlYXNlIG1vbml0b3IgbmV2ZXIgc2NoZWR1bGVzIGZvciBkaXNhYmxlZCBzeW5j
Cm9rIDE0MCAtIGxlYXNlIG1vbml0b3IgbmV2ZXIgc2NoZWR1bGVzIGZvciBkaXNhYmxlZCBzeW5j
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjE2MDM0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogbGF0ZSBsZWFzZSByZWplY3Rpb24gZnJvbSBwcmV2aW91cyBsb2dpbiBjYW5ub3QgcmV2
b2tlIHJlcGxhY2VtZW50IHdyaXRlcgpvayAxNDEgLSBsYXRlIGxlYXNlIHJlamVjdGlvbiBmcm9t
IHByZXZpb3VzIGxvZ2luIGNhbm5vdCByZXZva2UgcmVwbGFjZW1lbnQgd3JpdGVyCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuODIyMDA0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3Vj
Y2Vzc2Z1bCBsZWFzZSBjaGVjayB3aXRoIHJldm9rZWQgd3JpdGVyIHBlcm1pc3Npb24gZmFpbHMg
Y2xvc2VkCm9rIDE0MiAtIHN1Y2Nlc3NmdWwgbGVhc2UgY2hlY2sgd2l0aCByZXZva2VkIHdyaXRl
ciBwZXJtaXNzaW9uIGZhaWxzIGNsb3NlZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI5OTI3OQog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlamVjdGVkIGRpcmVjdCBsZWFzZSBjaGVj
ayByZXZva2VzIHdyaXRlciBzdGF0dXMgd2l0aG91dCB0aHJvd2luZwpvayAxNDMgLSByZWplY3Rl
ZCBkaXJlY3QgbGVhc2UgY2hlY2sgcmV2b2tlcyB3cml0ZXIgc3RhdHVzIHdpdGhvdXQgdGhyb3dp
bmcKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNDQ0MjcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBzdHJ1Y3R1cmVkIGxlYXNlIG5ldHdvcmsgZmFpbHVyZSByZXZva2VzIGJyaWRnZSB3
cml0ZXIgcGVybWlzc2lvbgpvayAxNDQgLSBzdHJ1Y3R1cmVkIGxlYXNlIG5ldHdvcmsgZmFpbHVy
ZSByZXZva2VzIGJyaWRnZSB3cml0ZXIgcGVybWlzc2lvbgogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjE3MzI3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbmV0d29yayBmYWlsdXJlIGFm
dGVyIGR1cmFibGUgZW5xdWV1ZSB3aXRoZHJhd3Mgd3JpdGUgcGVybWlzc2lvbiBhbmQgcHJlc2Vy
dmVzIHF1ZXVlCm9rIDE0NSAtIG5ldHdvcmsgZmFpbHVyZSBhZnRlciBkdXJhYmxlIGVucXVldWUg
d2l0aGRyYXdzIHdyaXRlIHBlcm1pc3Npb24gYW5kIHByZXNlcnZlcyBxdWV1ZQogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjM2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2VydmVyIHBl
cm1pdHMgTlVMTCBvbmx5IGZvciBhZG9wdGluZyBleGlzdGluZyBjbG91ZCBnYW1lCm9rIDE0NiAt
IHNlcnZlciBwZXJtaXRzIE5VTEwgb25seSBmb3IgYWRvcHRpbmcgZXhpc3RpbmcgY2xvdWQgZ2Ft
ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjc2NDgzOAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IHRyYW5zcG9ydCBzZW5kcyBudWxsIGZvciBhIG5ldyBkZXZpY2Ugd2l0aCBubyBsb2Nh
bCBnYW1lCm9rIDE0NyAtIHRyYW5zcG9ydCBzZW5kcyBudWxsIGZvciBhIG5ldyBkZXZpY2Ugd2l0
aCBubyBsb2NhbCBnYW1lCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjg2MDY5CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogdHJhbnNwb3J0IHJlamVjdHMgYXJyYXlzIGFzIGluaXRpYWwg
Z2FtZXMKb2sgMTQ4IC0gdHJhbnNwb3J0IHJlamVjdHMgYXJyYXlzIGFzIGluaXRpYWwgZ2FtZXMK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4zNTg3MTgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBjb21taXQgcmVqZWN0cyBnZW5lcmF0aW9uIHplcm8gd2l0aG91dCBSUEMgY2FsbApvayAx
NDkgLSBjb21taXQgcmVqZWN0cyBnZW5lcmF0aW9uIHplcm8gd2l0aG91dCBSUEMgY2FsbAogIC0t
LQogIGR1cmF0aW9uX21zOiAxLjA0MTM2MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IGNvbW1pdCByZWplY3RzIG5lZ2F0aXZlIGdlbmVyYXRpb24gd2l0aG91dCBSUEMgY2FsbApvayAx
NTAgLSBjb21taXQgcmVqZWN0cyBuZWdhdGl2ZSBnZW5lcmF0aW9uIHdpdGhvdXQgUlBDIGNhbGwK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4xNjU1MjkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBjb21taXQgcmVqZWN0cyBuZWdhdGl2ZSBiYXNlIHJldmlzaW9uIHdpdGhvdXQgUlBDIGNh
bGwKb2sgMTUxIC0gY29tbWl0IHJlamVjdHMgbmVnYXRpdmUgYmFzZSByZXZpc2lvbiB3aXRob3V0
IFJQQyBjYWxsCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTQyNDg0CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogcGVyc2lzdHMgYSBzdGFibGUgZGV2aWNlIElEIGFjcm9zcyByZXBlYXRl
ZCBzZXNzaW9ucwpvayAxNTIgLSBwZXJzaXN0cyBhIHN0YWJsZSBkZXZpY2UgSUQgYWNyb3NzIHJl
cGVhdGVkIHNlc3Npb25zCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODg1NTY5CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogZG9lcyBub3Qgb3ZlcndyaXRlIGludmFsaWQgZXhpc3Rpbmcg
aWRlbnRpZmllcgpvayAxNTMgLSBkb2VzIG5vdCBvdmVyd3JpdGUgaW52YWxpZCBleGlzdGluZyBp
ZGVudGlmaWVyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzMxNDk3CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogZmFpbHMgY2xvc2VkIHdoZW4gc3RvcmFnZSBjYW5ub3QgcGVyc2lzdApv
ayAxNTQgLSBmYWlscyBjbG9zZWQgd2hlbiBzdG9yYWdlIGNhbm5vdCBwZXJzaXN0CiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuMTQyMjUzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVx
dWlyZXMgc2VjdXJlIHJhbmRvbSBVVUlECm9rIDE1NSAtIHJlcXVpcmVzIHNlY3VyZSByYW5kb20g
VVVJRAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjExNDg1MgogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IGZhaWxzIGNsb3NlZCBvbiB1bnJlYWRhYmxlIHN0b3JhZ2UKb2sgMTU2IC0gZmFp
bHMgY2xvc2VkIG9uIHVucmVhZGFibGUgc3RvcmFnZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE2
Mzg3NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlamVjdHMgaW52YWxpZCBvciBu
b24tZmluaXRlIHNjb3JlcyBhbmQgaW52YWxpZCBoaXN0b3J5Cm9rIDE1NyAtIHJlamVjdHMgaW52
YWxpZCBvciBub24tZmluaXRlIHNjb3JlcyBhbmQgaW52YWxpZCBoaXN0b3J5CiAgLS0tCiAgZHVy
YXRpb25fbXM6IDEuNTQ1OTMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhY3RpdmF0
aW9uIGJhY2tzIHVwIGV4aXN0aW5nIGxvY2FsIGdhbWUgYmVmb3JlIGFjY2VwdGluZyBjbG91ZApv
ayAxNTggLSBhY3RpdmF0aW9uIGJhY2tzIHVwIGV4aXN0aW5nIGxvY2FsIGdhbWUgYmVmb3JlIGFj
Y2VwdGluZyBjbG91ZAogIC0tLQogIGR1cmF0aW9uX21zOiAxLjY0NzMxMgogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IG9mZmxpbmUgbmV0d29yayBmYWlsdXJlIHBlcnNpc3RzIHNjb3Jl
IHF1ZXVlLCBsYXRlciBmbHVzaCBjb21taXRzCm9rIDE1OSAtIG9mZmxpbmUgbmV0d29yayBmYWls
dXJlIHBlcnNpc3RzIHNjb3JlIHF1ZXVlLCBsYXRlciBmbHVzaCBjb21taXRzCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuOTA5MjY0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29uZmxp
Y3Rpbmcgd3JpdGUgbmV2ZXIgb3ZlcndyaXRlcyBsb2NhbCBkYXRhIG9yIHNpbGVudGx5IGNsZWFy
cyBxdWV1ZQpvayAxNjAgLSBjb25mbGljdGluZyB3cml0ZSBuZXZlciBvdmVyd3JpdGVzIGxvY2Fs
IGRhdGEgb3Igc2lsZW50bHkgY2xlYXJzIHF1ZXVlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDIy
MTM0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZC1vbmx5IHNlc3Npb24gY2Fu
bm90IHdyaXRlIG9yIGVucXVldWUgbmV3IGRhdGEKb2sgMTYxIC0gcmVhZC1vbmx5IHNlc3Npb24g
Y2Fubm90IHdyaXRlIG9yIGVucXVldWUgbmV3IGRhdGEKICAtLS0KICBkdXJhdGlvbl9tczogMC44
NzM3NTEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBiYWNrdXAgYW5kIHBlbmRpbmcg
a2V5cyBhcmUgc2NvcGVkIGJ5IGFjY291bnQgYW5kIGRldmljZQpvayAxNjIgLSBiYWNrdXAgYW5k
IHBlbmRpbmcga2V5cyBhcmUgc2NvcGVkIGJ5IGFjY291bnQgYW5kIGRldmljZQogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjMxNjc5NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpbXVs
dGFuZW91cyBmbHVzaGVzIGRvIG5vdCBpc3N1ZSBkdXBsaWNhdGUgcmV2aXNpb24gd3JpdGVzCm9r
IDE2MyAtIHNpbXVsdGFuZW91cyBmbHVzaGVzIGRvIG5vdCBpc3N1ZSBkdXBsaWNhdGUgcmV2aXNp
b24gd3JpdGVzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNjIzOTI2CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogZWRpdHMgcXVldWVkIGR1cmluZyBuZXR3b3JrIGNvbW1pdCBzdXJ2aXZl
IHN1Y2Nlc3NmdWwgcmVzcG9uc2UKb2sgMTY0IC0gZWRpdHMgcXVldWVkIGR1cmluZyBuZXR3b3Jr
IGNvbW1pdCBzdXJ2aXZlIHN1Y2Nlc3NmdWwgcmVzcG9uc2UKICAtLS0KICBkdXJhdGlvbl9tczog
MC40MjU3ODkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBuZXcgYWN0aXZhdGlvbiBy
ZWZ1c2VzIHRvIG1hc2sgb2ZmbGluZSBjaGFuZ2VzIGF3YWl0aW5nIHJlY29uY2lsaWF0aW9uCm9r
IDE2NSAtIG5ldyBhY3RpdmF0aW9uIHJlZnVzZXMgdG8gbWFzayBvZmZsaW5lIGNoYW5nZXMgYXdh
aXRpbmcgcmVjb25jaWxpYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC41MzI5OQogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGZsdXNoIHJldGFpbnMgbmV3bHkgZW5xdWV1ZWQgZW50
cmllcyBldmVuIGlmIHF1ZXVlIGxlbmd0aCBjaGFuZ2VzCm9rIDE2NiAtIGZsdXNoIHJldGFpbnMg
bmV3bHkgZW5xdWV1ZWQgZW50cmllcyBldmVuIGlmIHF1ZXVlIGxlbmd0aCBjaGFuZ2VzCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuNjg5NTU1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
Y29tbWl0IGNhcnJpZXMgZ2VuZXJhdGlvbiBmcm9tIHNlcnZlciBsZWFzZQpvayAxNjcgLSBjb21t
aXQgY2FycmllcyBnZW5lcmF0aW9uIGZyb20gc2VydmVyIGxlYXNlCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuNDExNzM4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWN0aXZhdGlvbiBy
ZWplY3RzIG1pc3NpbmcgZ2VuZXJhdGlvbiBmcm9tIFJQQwpvayAxNjggLSBhY3RpdmF0aW9uIHJl
amVjdHMgbWlzc2luZyBnZW5lcmF0aW9uIGZyb20gUlBDCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MzA3NTkyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWN0aXZhdGlvbiByZWZ1c2Vz
IGNsb3VkIHNuYXBzaG90IGlmIGxvY2FsIGVkaXRzIGFycml2ZSB3aGlsZSBSUEMgaXMgcGVuZGlu
ZwpvayAxNjkgLSBhY3RpdmF0aW9uIHJlZnVzZXMgY2xvdWQgc25hcHNob3QgaWYgbG9jYWwgZWRp
dHMgYXJyaXZlIHdoaWxlIFJQQyBpcyBwZW5kaW5nCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjgy
NDM0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWN0aXZhdGlvbiByZWZ1c2VzIHRv
IHNpbGVudGx5IHJlcGxhY2UgZGlzdGluY3QgbG9jYWwgc2NvcmUgd2l0aCBjbG91ZApvayAxNzAg
LSBhY3RpdmF0aW9uIHJlZnVzZXMgdG8gc2lsZW50bHkgcmVwbGFjZSBkaXN0aW5jdCBsb2NhbCBz
Y29yZSB3aXRoIGNsb3VkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNTY5NDc1CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogYWN0aXZhdGlvbiByZWZ1c2VzIHdyaXRlciBsZWFzZSB3aXRo
b3V0IHNlcnZlci1pc3N1ZWQgdG9rZW4Kb2sgMTcxIC0gYWN0aXZhdGlvbiByZWZ1c2VzIHdyaXRl
ciBsZWFzZSB3aXRob3V0IHNlcnZlci1pc3N1ZWQgdG9rZW4KICAtLS0KICBkdXJhdGlvbl9tczog
MC4zMzIwNTgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZXZpc2lvbiB6ZXJvIGNh
bm5vdCBzaWxlbnRseSBvdmVyd3JpdGUgYSBkaWZmZXJlbnQgbG9jYWwgZ2FtZQpvayAxNzIgLSBy
ZXZpc2lvbiB6ZXJvIGNhbm5vdCBzaWxlbnRseSBvdmVyd3JpdGUgYSBkaWZmZXJlbnQgbG9jYWwg
Z2FtZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjczNDk4MwogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IHJldmlzaW9uIGNvbmZsaWN0IGZyZWV6ZXMgYWxsIGZ1cnRoZXIgd3JpdGVzIHVu
dGlsIGV4cGxpY2l0IHJlY29uY2lsaWF0aW9uCm9rIDE3MyAtIHJldmlzaW9uIGNvbmZsaWN0IGZy
ZWV6ZXMgYWxsIGZ1cnRoZXIgd3JpdGVzIHVudGlsIGV4cGxpY2l0IHJlY29uY2lsaWF0aW9uCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMzkzOTExCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogd3JpdGVyIHJldm9jYXRpb24gZnJlZXplcyBzdWJzZXF1ZW50IHdyaXRlcyBhbmQgcmV0YWlu
cyBhbGwgcXVldWVkIGNoYW5nZXMKb2sgMTc0IC0gd3JpdGVyIHJldm9jYXRpb24gZnJlZXplcyBz
dWJzZXF1ZW50IHdyaXRlcyBhbmQgcmV0YWlucyBhbGwgcXVldWVkIGNoYW5nZXMKICAtLS0KICBk
dXJhdGlvbl9tczogNS40NTA4OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHBhcmFs
bGVsIGFjdGl2YXRpb25zIGNhbm5vdCBjcmVhdGUgY29tcGV0aW5nIHNlcnZlciBsZWFzZXMKb2sg
MTc1IC0gcGFyYWxsZWwgYWN0aXZhdGlvbnMgY2Fubm90IGNyZWF0ZSBjb21wZXRpbmcgc2VydmVy
IGxlYXNlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM0OTQyNAogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IGEgcXVldWVkIGVkaXQgY2Fubm90IGJlIHNlbnQgZHVyaW5nIGFjdGl2YXRp
b24gYmVmb3JlIGxlYXNlIGlzIGFjY2VwdGVkCm9rIDE3NiAtIGEgcXVldWVkIGVkaXQgY2Fubm90
IGJlIHNlbnQgZHVyaW5nIGFjdGl2YXRpb24gYmVmb3JlIGxlYXNlIGlzIGFjY2VwdGVkCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMjg0OTE4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
bmV3IGFjdGl2YXRpb24gY2Fubm90IG92ZXJsYXAgYSBuZXR3b3JrIGNvbW1pdApvayAxNzcgLSBu
ZXcgYWN0aXZhdGlvbiBjYW5ub3Qgb3ZlcmxhcCBhIG5ldHdvcmsgY29tbWl0CiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMzMzMjUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdXBhYmFz
ZSBwZXJtaXNzaW9uIGRlbmlhbCBmcmVlemVzIHdyaXRlcyBhbmQgcHJlc2VydmVzIHF1ZXVlZCBz
Y29yZQpvayAxNzggLSBTdXBhYmFzZSBwZXJtaXNzaW9uIGRlbmlhbCBmcmVlemVzIHdyaXRlcyBh
bmQgcHJlc2VydmVzIHF1ZXVlZCBzY29yZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjYxNzE4Ngog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHRlbXBvcmFyeSBTdXBhYmFzZSB0cmFuc3Bv
cnQgZXJyb3JzIHJlbWFpbiByZXRyeWFibGUKb2sgMTc5IC0gdGVtcG9yYXJ5IFN1cGFiYXNlIHRy
YW5zcG9ydCBlcnJvcnMgcmVtYWluIHJldHJ5YWJsZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjYy
OTI1NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvcnJ1cHQgcGVyc2lzdGVudCBx
dWV1ZSBibG9ja3MgYWN0aXZhdGlvbiB3aXRob3V0IGNvbnRhY3Rpbmcgc2VydmVyCm9rIDE4MCAt
IGNvcnJ1cHQgcGVyc2lzdGVudCBxdWV1ZSBibG9ja3MgYWN0aXZhdGlvbiB3aXRob3V0IGNvbnRh
Y3Rpbmcgc2VydmVyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTc4MzQ3CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogcXVldWUgd2l0aCB3cm9uZyBKU09OIHR5cGUgaXMgbmV2ZXIgb3Zl
cndyaXR0ZW4Kb2sgMTgxIC0gcXVldWUgd2l0aCB3cm9uZyBKU09OIHR5cGUgaXMgbmV2ZXIgb3Zl
cndyaXR0ZW4KICAtLS0KICBkdXJhdGlvbl9tczogMC4xMzc1NDcKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBmYWlsZWQgcmVhY3RpdmF0aW9uIGludmFsaWRhdGVzIHByZXZpb3VzIHdy
aXRlciBsZWFzZSBiZWZvcmUgYW5vdGhlciBzY29yZSBjYW4gYmUgc2VudApvayAxODIgLSBmYWls
ZWQgcmVhY3RpdmF0aW9uIGludmFsaWRhdGVzIHByZXZpb3VzIHdyaXRlciBsZWFzZSBiZWZvcmUg
YW5vdGhlciBzY29yZSBjYW4gYmUgc2VudAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjUwNTY4OQog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbmZsaWN0aW5nIHJlYWN0aXZhdGlvbiBj
YW5ub3QgcmV1c2UgZWFybGllciB3cml0ZXIgdG9rZW4Kb2sgMTgzIC0gY29uZmxpY3RpbmcgcmVh
Y3RpdmF0aW9uIGNhbm5vdCByZXVzZSBlYXJsaWVyIHdyaXRlciB0b2tlbgogIC0tLQogIGR1cmF0
aW9uX21zOiAzLjMzMjUwMQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNlcnZlciBy
ZXNwb25zZSBhdXRob3JpemF0aW9uLXJlamVjdGVkIGZyZWV6ZXMgc3Vic2VxdWVudCBjb21taXRz
Cm9rIDE4NCAtIHNlcnZlciByZXNwb25zZSBhdXRob3JpemF0aW9uLXJlamVjdGVkIGZyZWV6ZXMg
c3Vic2VxdWVudCBjb21taXRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzU3Mzc2CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2VydmVyIHJlc3BvbnNlIHNlc3Npb24tcmV2b2tlZCBm
cmVlemVzIHN1YnNlcXVlbnQgY29tbWl0cwpvayAxODUgLSBzZXJ2ZXIgcmVzcG9uc2Ugc2Vzc2lv
bi1yZXZva2VkIGZyZWV6ZXMgc3Vic2VxdWVudCBjb21taXRzCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMzgwNTIxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2VydmVyIHJlc3BvbnNl
IGFjY291bnQtaW5hY3RpdmUgZnJlZXplcyBzdWJzZXF1ZW50IGNvbW1pdHMKb2sgMTg2IC0gc2Vy
dmVyIHJlc3BvbnNlIGFjY291bnQtaW5hY3RpdmUgZnJlZXplcyBzdWJzZXF1ZW50IGNvbW1pdHMK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4yMDk0ODUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiByZWNvdmVyeSBleHBvcnQgcHJlc2VydmVzIG9mZmxpbmUgc2NvcmVzIGFuZCBleGNsdWRl
cyBzZXNzaW9uIHNlY3JldHMKb2sgMTg3IC0gcmVjb3ZlcnkgZXhwb3J0IHByZXNlcnZlcyBvZmZs
aW5lIHNjb3JlcyBhbmQgZXhjbHVkZXMgc2Vzc2lvbiBzZWNyZXRzCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuNjA0OTI3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVjb3ZlcnkgZXhw
b3J0IGZhaWxzIGNsb3NlZCB3aGVuIGJhY2t1cCBlbnRyaWVzIGFyZSBjb3JydXB0ZWQKb2sgMTg4
IC0gcmVjb3ZlcnkgZXhwb3J0IGZhaWxzIGNsb3NlZCB3aGVuIGJhY2t1cCBlbnRyaWVzIGFyZSBj
b3JydXB0ZWQKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMzkwNjkKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiB1bmV4cGVjdGVkIHN1Y2Nlc3NmdWwgcmV2aXNpb24gZnJlZXplcyB3cml0
ZXMgcmF0aGVyIHRoYW4gcmV0cnlpbmcgYW4gYW1iaWd1b3VzIGNvbW1pdApvayAxODkgLSB1bmV4
cGVjdGVkIHN1Y2Nlc3NmdWwgcmV2aXNpb24gZnJlZXplcyB3cml0ZXMgcmF0aGVyIHRoYW4gcmV0
cnlpbmcgYW4gYW1iaWd1b3VzIGNvbW1pdAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjMxNjg4Ngog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGZsdXNoIHJlZnVzZXMgbWFsZm9ybWVkIHF1
ZXVlZCBzbmFwc2hvdHMgYmVmb3JlIG5ldHdvcmsgd3JpdGUKb2sgMTkwIC0gZmx1c2ggcmVmdXNl
cyBtYWxmb3JtZWQgcXVldWVkIHNuYXBzaG90cyBiZWZvcmUgbmV0d29yayB3cml0ZQogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjI4MTc3MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGZs
dXNoIHJlZnVzZXMgZHVwbGljYXRlIHBlbmRpbmcgSURzIHRvIHByZXZlbnQgZHJvcHBpbmcgdW5z
ZW50IGVkaXRzCm9rIDE5MSAtIGZsdXNoIHJlZnVzZXMgZHVwbGljYXRlIHBlbmRpbmcgSURzIHRv
IHByZXZlbnQgZHJvcHBpbmcgdW5zZW50IGVkaXRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzUw
MjM2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWNrbm93bGVkZ2VkIFJQQyB3aXRo
IGxvY2FsIHF1ZXVlIGNsZWFudXAgZmFpbHVyZSBtdXN0IG5ldmVyIHJldHJ5IG5ldHdvcmsgY29t
bWl0Cm9rIDE5MiAtIGFja25vd2xlZGdlZCBSUEMgd2l0aCBsb2NhbCBxdWV1ZSBjbGVhbnVwIGZh
aWx1cmUgbXVzdCBuZXZlciByZXRyeSBuZXR3b3JrIGNvbW1pdAogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjM1MzUyMQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFjdGl2YXRpb24gcmVq
ZWN0cyBhbWJpZ3VvdXMgd3JpdGUgcGVybWlzc2lvbiBhbmQgbmV2ZXIgZ3JhbnRzIGEgd3JpdGVy
Cm9rIDE5MyAtIGFjdGl2YXRpb24gcmVqZWN0cyBhbWJpZ3VvdXMgd3JpdGUgcGVybWlzc2lvbiBh
bmQgbmV2ZXIgZ3JhbnRzIGEgd3JpdGVyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODY3NjkyCiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWN0aXZhdGlvbiByZWplY3RzIGEgd3JpdGVy
IHRva2VuIGF0dGFjaGVkIHRvIHJlYWQtb25seSBsZWFzZQpvayAxOTQgLSBhY3RpdmF0aW9uIHJl
amVjdHMgYSB3cml0ZXIgdG9rZW4gYXR0YWNoZWQgdG8gcmVhZC1vbmx5IGxlYXNlCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuMjE5MjY5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29u
Y3VycmVudCBzY29yZSBlZGl0cyBxdWV1ZWQgZHVyaW5nIG5ldHdvcmsgY29tbWl0IGFyZSBkcmFp
bmVkCm9rIDE5NSAtIGNvbmN1cnJlbnQgc2NvcmUgZWRpdHMgcXVldWVkIGR1cmluZyBuZXR3b3Jr
IGNvbW1pdCBhcmUgZHJhaW5lZAogIC0tLQogIGR1cmF0aW9uX21zOiA0My45NjUxMzYKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBuZXcgZGV2aWNlIHdpdGhvdXQgYSBsb2NhbCBnYW1l
IGNhbiBhZG9wdCBjb21wbGV0ZSBjbG91ZCBnYW1lCm9rIDE5NiAtIG5ldyBkZXZpY2Ugd2l0aG91
dCBhIGxvY2FsIGdhbWUgY2FuIGFkb3B0IGNvbXBsZXRlIGNsb3VkIGdhbWUKICAtLS0KICBkdXJh
dGlvbl9tczogMC40Njc0OTIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBuZXcgZGV2
aWNlIHdpdGhvdXQgbG9jYWwgZ2FtZSBkb2VzIG5vdCBpbnZlbnQgYW4gZW1wdHkgZ2FtZSB3aGVu
IGNsb3VkIGlzIGFic2VudApvayAxOTcgLSBuZXcgZGV2aWNlIHdpdGhvdXQgbG9jYWwgZ2FtZSBk
b2VzIG5vdCBpbnZlbnQgYW4gZW1wdHkgZ2FtZSB3aGVuIGNsb3VkIGlzIGFic2VudAogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjE2MDAxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY2xv
dWQgcHJlZmxpZ2h0IG1pc21hdGNoIGlzIGEgdGVybWluYWwgY29uZmxpY3QgYW5kIGRvZXMgbm90
IHJldHJ5IHRha2VvdmVyCm9rIDE5OCAtIGNsb3VkIHByZWZsaWdodCBtaXNtYXRjaCBpcyBhIHRl
cm1pbmFsIGNvbmZsaWN0IGFuZCBkb2VzIG5vdCByZXRyeSB0YWtlb3ZlcgogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjIwMzEwNQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNsb3VkIHJl
dmlzaW9uIGNoYW5nZSBkdXJpbmcgdGFrZW92ZXIgaXMgYSB0ZXJtaW5hbCBjb25mbGljdApvayAx
OTkgLSBjbG91ZCByZXZpc2lvbiBjaGFuZ2UgZHVyaW5nIHRha2VvdmVyIGlzIGEgdGVybWluYWwg
Y29uZmxpY3QKICAtLS0KICBkdXJhdGlvbl9tczogMC4xODAxNQogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IGNsaWVudCByZWplY3RzIGZyYWN0aW9uYWwgYW5kIHVuc2FmZSBzY29yZXMg
YmVmb3JlIGFueSBuZXR3b3JrIHdyaXRlCm9rIDIwMCAtIGNsaWVudCByZWplY3RzIGZyYWN0aW9u
YWwgYW5kIHVuc2FmZSBzY29yZXMgYmVmb3JlIGFueSBuZXR3b3JrIHdyaXRlCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMzE4MTk4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZC1v
bmx5IHB1c2ggcHJlc2VydmVzIHByZS1leGlzdGluZyByZWNvdmVyeSBxdWV1ZSB3aXRob3V0IGFk
ZGluZyBhIG5ldyBlZGl0Cm9rIDIwMSAtIHJlYWQtb25seSBwdXNoIHByZXNlcnZlcyBwcmUtZXhp
c3RpbmcgcmVjb3ZlcnkgcXVldWUgd2l0aG91dCBhZGRpbmcgYSBuZXcgZWRpdAogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjMxNDk5MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN1cGFi
YXNlIGpzb25iIGtleSByZW9yZGVyaW5nIGRvZXMgbm90IGNyZWF0ZSBhIGZhbHNlIGdhbWUgY29u
ZmxpY3QKb2sgMjAyIC0gU3VwYWJhc2UganNvbmIga2V5IHJlb3JkZXJpbmcgZG9lcyBub3QgY3Jl
YXRlIGEgZmFsc2UgZ2FtZSBjb25mbGljdAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI2MDQxMQog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0cnVjdHVyYWwgY29tcGFyaXNvbiBzdGls
bCBkZXRlY3RzIHNjb3JlIGFuZCBhcnJheSBvcmRlciBjaGFuZ2VzCm9rIDIwMyAtIHN0cnVjdHVy
YWwgY29tcGFyaXNvbiBzdGlsbCBkZXRlY3RzIHNjb3JlIGFuZCBhcnJheSBvcmRlciBjaGFuZ2Vz
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDQ4MzczCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogcm91bmQgY291bnQgbXVzdCBiZSBhIGJvdW5kZWQgc2FmZSBpbnRlZ2VyLCBtYXRjaGlu
ZyBzZXJ2ZXIgU1FMCm9rIDIwNCAtIHJvdW5kIGNvdW50IG11c3QgYmUgYSBib3VuZGVkIHNhZmUg
aW50ZWdlciwgbWF0Y2hpbmcgc2VydmVyIFNRTAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjMwMjUw
NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxlYXNlIHBvbGxpbmcgdHJhbnNwb3J0
IGZhaWx1cmUgcmV2b2tlcyBsb2NhbCB3cml0ZXIgd2l0aG91dCBsb3NpbmcgcGVuZGluZyBkYXRh
Cm9rIDIwNSAtIGxlYXNlIHBvbGxpbmcgdHJhbnNwb3J0IGZhaWx1cmUgcmV2b2tlcyBsb2NhbCB3
cml0ZXIgd2l0aG91dCBsb3NpbmcgcGVuZGluZyBkYXRhCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
NDExOTc4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbGF0ZSBsZWFzZSByZWplY3Rp
b24gZnJvbSBhbiBlYXJsaWVyIGFjdGl2YXRpb24gY2Fubm90IHJldm9rZSBhIHJlcGxhY2VtZW50
IHdyaXRlcgpvayAyMDYgLSBsYXRlIGxlYXNlIHJlamVjdGlvbiBmcm9tIGFuIGVhcmxpZXIgYWN0
aXZhdGlvbiBjYW5ub3QgcmV2b2tlIGEgcmVwbGFjZW1lbnQgd3JpdGVyCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuMzAyMDMzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbGF0ZSBsZWFz
ZSBuZXR3b3JrIGVycm9yIGZyb20gYW4gZWFybGllciBhY3RpdmF0aW9uIGNhbm5vdCByZXZva2Ug
YSByZXBsYWNlbWVudCB3cml0ZXIKb2sgMjA3IC0gbGF0ZSBsZWFzZSBuZXR3b3JrIGVycm9yIGZy
b20gYW4gZWFybGllciBhY3RpdmF0aW9uIGNhbm5vdCByZXZva2UgYSByZXBsYWNlbWVudCB3cml0
ZXIKICAtLS0KICBkdXJhdGlvbl9tczogMS41Nzc0MTcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBsZWFzZSBwb2xsIHJlZnVzZXMgYSBuZXdlciBjbG91ZCByZXZpc2lvbiB3aXRob3V0
IGRpc2NhcmRpbmcgbG9jYWwgcmVjb3ZlcnkgZGF0YQpvayAyMDggLSBsZWFzZSBwb2xsIHJlZnVz
ZXMgYSBuZXdlciBjbG91ZCByZXZpc2lvbiB3aXRob3V0IGRpc2NhcmRpbmcgbG9jYWwgcmVjb3Zl
cnkgZGF0YQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjMwOTUxNQogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IG5ldy1kZXZpY2UgdGFrZW92ZXIgcHJlc2VydmVzIGRpZmZlcmluZyBsb2Nh
bCBnYW1lIGluIHJlY292ZXJ5IGJhY2t1cApvayAyMDkgLSBuZXctZGV2aWNlIHRha2VvdmVyIHBy
ZXNlcnZlcyBkaWZmZXJpbmcgbG9jYWwgZ2FtZSBpbiByZWNvdmVyeSBiYWNrdXAKICAtLS0KICBk
dXJhdGlvbl9tczogMC4zODI4OTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBmaXJz
dCBnYW1lIGJvb3RzdHJhcHMgb25seSB3aGVuIHBlZWsgY29uZmlybXMgY2xvdWQgaXMgYWJzZW50
Cm9rIDIxMCAtIGZpcnN0IGdhbWUgYm9vdHN0cmFwcyBvbmx5IHdoZW4gcGVlayBjb25maXJtcyBj
bG91ZCBpcyBhYnNlbnQKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNzc1MjcKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiBmb3VuZGF0aW9uIGhhcyBzaW5nbGUtYWN0aXZlLWRldmljZSBp
bmRleCBpbmNvbXBhdGlibGUgd2l0aCBtdWx0aS1kZXZpY2UgcmVhZGVyIGxlYXNlcwpvayAyMTEg
LSBmb3VuZGF0aW9uIGhhcyBzaW5nbGUtYWN0aXZlLWRldmljZSBpbmRleCBpbmNvbXBhdGlibGUg
d2l0aCBtdWx0aS1kZXZpY2UgcmVhZGVyIGxlYXNlcwogIC0tLQogIGR1cmF0aW9uX21zOiAxLjA3
Njg2NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGRyYWZ0IGRlcGVuZHMgb24gbGVh
c2UgY29sdW1ucyBhYnNlbnQgZnJvbSBmb3VuZGF0aW9uIG1pZ3JhdGlvbgpvayAyMTIgLSBkcmFm
dCBkZXBlbmRzIG9uIGxlYXNlIGNvbHVtbnMgYWJzZW50IGZyb20gZm91bmRhdGlvbiBtaWdyYXRp
b24KICAtLS0KICBkdXJhdGlvbl9tczogMC4zNTY3OTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiByZWFkLW9ubHkgcHJlZmxpZ2h0IG11c3QgYmUgZXh0ZW5kZWQgdG8gZGV0ZWN0IGJs
b2NraW5nIHVuaXF1ZSBpbmRleCBhbmQgcmVxdWlyZWQgcGFydGlhbCBpbmRleApvayAyMTMgLSBy
ZWFkLW9ubHkgcHJlZmxpZ2h0IG11c3QgYmUgZXh0ZW5kZWQgdG8gZGV0ZWN0IGJsb2NraW5nIHVu
aXF1ZSBpbmRleCBhbmQgcmVxdWlyZWQgcGFydGlhbCBpbmRleAogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjIzMjI1OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFBBU1M6IHN5bmMgZm91bmRhdGlvbiBz
Y2hlbWEgZmFpbC1jbG9zZWQsIG9yaWdpbmFsIGFwcCB1bnRvdWNoZWQKIyBTdWJ0ZXN0OiB0ZXN0
cy9zeW5jLWZvdW5kYXRpb24udGVzdC5janMKb2sgMjggLSB0ZXN0cy9zeW5jLWZvdW5kYXRpb24u
dGVzdC5janMKICAtLS0KICBkdXJhdGlvbl9tczogNjUuNzkxMzkxCiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogZml4dHVyZSBtYXRjaGVzIGFjdHVhbCBhcHBsaWNhdGlvbiBkZWZhdWx0
IHN0YXRlCm9rIDIxNSAtIGZpeHR1cmUgbWF0Y2hlcyBhY3R1YWwgYXBwbGljYXRpb24gZGVmYXVs
dCBzdGF0ZQogIC0tLQogIGR1cmF0aW9uX21zOiA0Ljk3ODg2MQogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IHJlamVjdCBpbnZhbGlkIHdpbmQgYXNzaWdubWVudHMgd2l0aG91dCBjaGFu
Z2luZyBjYWxsZXIgc3RhdGUKb2sgMjE2IC0gcmVqZWN0IGludmFsaWQgd2luZCBhc3NpZ25tZW50
cyB3aXRob3V0IGNoYW5naW5nIGNhbGxlciBzdGF0ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjU5
OTYyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IG1hbGZvcm1lZCBoaXN0
b3J5IGFuZCByb3VuZCB3aW5kCm9rIDIxNyAtIHJlamVjdCBtYWxmb3JtZWQgaGlzdG9yeSBhbmQg
cm91bmQgd2luZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjMzNDg1MwogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IHJlamVjdCBVVEYtOCBvdmVyc2l6ZWQgaGlzdG9yeSBldmVuIHdoZW4g
SmF2YVNjcmlwdCBVVEYtMTYgbGVuZ3RoIGlzIHVuZGVyIGxpbWl0Cm9rIDIxOCAtIHJlamVjdCBV
VEYtOCBvdmVyc2l6ZWQgaGlzdG9yeSBldmVuIHdoZW4gSmF2YVNjcmlwdCBVVEYtMTYgbGVuZ3Ro
IGlzIHVuZGVyIGxpbWl0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDY3LjA3MDM4CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogcHJlc2VydmUgcmVhbGlzdGljIEh1LCBaaSBNbywgUXVhZCwg
cGF0dGVybnMsIGFuZCBoaXN0b3JpY2FsIHNlYXQgbWV0YWRhdGEgaW4gYSBjbG91ZCBzbmFwc2hv
dApvayAyMTkgLSBwcmVzZXJ2ZSByZWFsaXN0aWMgSHUsIFppIE1vLCBRdWFkLCBwYXR0ZXJucywg
YW5kIGhpc3RvcmljYWwgc2VhdCBtZXRhZGF0YSBpbiBhIGNsb3VkIHNuYXBzaG90CiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuNTUwMTg1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVq
ZWN0IG1hbGZvcm1lZCBoaXN0b3J5IGVudHJpZXMgd2hpbGUgcHJlc2VydmluZyBvcmlnaW5hbCBz
b3VyY2UgZGF0YQpvayAyMjAgLSByZWplY3QgbWFsZm9ybWVkIGhpc3RvcnkgZW50cmllcyB3aGls
ZSBwcmVzZXJ2aW5nIG9yaWdpbmFsIHNvdXJjZSBkYXRhCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MjIyMjAzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhbGlzdGljIG11bHRpLXJv
dW5kIHNjb3JlIHNuYXBzaG90IHN1cnZpdmVzIEpTT04gc2VyaWFsaXphdGlvbiB3aXRob3V0IGxv
c2luZyBNYWhqb25nIGhpc3RvcnkKb2sgMjIxIC0gcmVhbGlzdGljIG11bHRpLXJvdW5kIHNjb3Jl
IHNuYXBzaG90IHN1cnZpdmVzIEpTT04gc2VyaWFsaXphdGlvbiB3aXRob3V0IGxvc2luZyBNYWhq
b25nIGhpc3RvcnkKICAtLS0KICBkdXJhdGlvbl9tczogMC40NDY2OAogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IGZ1bGwgcmVjb3JkZWQgaGFuZCBwYXlsb2FkIHJldGFpbnMgYWN0dWFs
IGFwcGxpY2F0aW9uIGhpc3RvcnkgZmllbGRzIHRocm91Z2ggY2xvdWQgdmFsaWRhdGlvbgpvayAy
MjIgLSBmdWxsIHJlY29yZGVkIGhhbmQgcGF5bG9hZCByZXRhaW5zIGFjdHVhbCBhcHBsaWNhdGlv
biBoaXN0b3J5IGZpZWxkcyB0aHJvdWdoIGNsb3VkIHZhbGlkYXRpb24KICAtLS0KICBkdXJhdGlv
bl9tczogMC4zNzA2OTYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWplY3QgY29y
cnVwdCBzY29yaW5nIHZlY3RvcnMgYW5kIHF1YWQgY291bnRzIGluc2lkZSByZWNvcmRlZCBoYW5k
cwpvayAyMjMgLSByZWplY3QgY29ycnVwdCBzY29yaW5nIHZlY3RvcnMgYW5kIHF1YWQgY291bnRz
IGluc2lkZSByZWNvcmRlZCBoYW5kcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQ3MTU5NwogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbXBsZXRlIHJlY29yZGVkLWhhbmQgcmVjb3Zl
cnkgcHJlc2VydmVzIG9wdGlvbmFsIGNvbWJpbmF0aW9uIGFuZCBxdWFkIG1ldGFkYXRhCm9rIDIy
NCAtIGNvbXBsZXRlIHJlY29yZGVkLWhhbmQgcmVjb3ZlcnkgcHJlc2VydmVzIG9wdGlvbmFsIGNv
bWJpbmF0aW9uIGFuZCBxdWFkIG1ldGFkYXRhCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDgwNzcx
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IG5vbi1maW5pdGUgbmVzdGVk
IGhpc3RvcnkgbWV0YWRhdGEgcmF0aGVyIHRoYW4gc2lsZW50bHkgcmVwbGFjaW5nIGl0IHdpdGgg
bnVsbApvayAyMjUgLSByZWplY3Qgbm9uLWZpbml0ZSBuZXN0ZWQgaGlzdG9yeSBtZXRhZGF0YSBy
YXRoZXIgdGhhbiBzaWxlbnRseSByZXBsYWNpbmcgaXQgd2l0aCBudWxsCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuMjc5MzE5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IHNp
bGVudGx5IGRpc2NhcmRlZCBuZXN0ZWQgaGlzdG9yeSBtZXRhZGF0YSBhbmQgcHJlc2VydmUgc291
cmNlCm9rIDIyNiAtIHJlamVjdCBzaWxlbnRseSBkaXNjYXJkZWQgbmVzdGVkIGhpc3RvcnkgbWV0
YWRhdGEgYW5kIHByZXNlcnZlIHNvdXJjZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjMxNTk1NAog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlamVjdCBjb3JydXB0IGhpc3RvcmljYWwg
d2luZCBzbmFwc2hvdCB3aXRob3V0IG1vZGlmeWluZyBvcmlnaW5hbCBnYW1lCm9rIDIyNyAtIHJl
amVjdCBjb3JydXB0IGhpc3RvcmljYWwgd2luZCBzbmFwc2hvdCB3aXRob3V0IG1vZGlmeWluZyBv
cmlnaW5hbCBnYW1lCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTk3MjE2CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IGhpc3RvcmljYWwgcGxheWVyIG5hbWVzIGV4Y2VlZGlu
ZyB0aGUgc2VydmVyLXNpZGUgMTAwLWNoYXJhY3RlciBsaW1pdApvayAyMjggLSByZWplY3QgaGlz
dG9yaWNhbCBwbGF5ZXIgbmFtZXMgZXhjZWVkaW5nIHRoZSBzZXJ2ZXItc2lkZSAxMDAtY2hhcmFj
dGVyIGxpbWl0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTQ0NjA3CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogcmVqZWN0IG1hbGZvcm1lZCBwbGF5ZXItc3BlY2lmaWMgY29tYmluYXRp
b25zIHdpdGhvdXQgbG9zaW5nIHRoZSBzb3VyY2UgaGlzdG9yeQpvayAyMjkgLSByZWplY3QgbWFs
Zm9ybWVkIHBsYXllci1zcGVjaWZpYyBjb21iaW5hdGlvbnMgd2l0aG91dCBsb3NpbmcgdGhlIHNv
dXJjZSBoaXN0b3J5CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjE1MDYzCiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IFVuaWNvZGUgTlVMIGFuZCB1bnBhaXJlZCBzdXJyb2dh
dGVzIGluIGhpc3RvcmljYWwgbWV0YWRhdGEga2V5cyBhbmQgdmFsdWVzCm9rIDIzMCAtIHJlamVj
dCBVbmljb2RlIE5VTCBhbmQgdW5wYWlyZWQgc3Vycm9nYXRlcyBpbiBoaXN0b3JpY2FsIG1ldGFk
YXRhIGtleXMgYW5kIHZhbHVlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM2NDM1NwogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFjY2VwdCB2YWxpZCBzdXBwbGVtZW50YXJ5IFVuaWNv
ZGUgY2hhcmFjdGVycyBpbiBoaXN0b3JpY2FsIG1ldGFkYXRhCm9rIDIzMSAtIGFjY2VwdCB2YWxp
ZCBzdXBwbGVtZW50YXJ5IFVuaWNvZGUgY2hhcmFjdGVycyBpbiBoaXN0b3JpY2FsIG1ldGFkYXRh
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjA4MjgzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogcmVqZWN0IG5vbi1KU09OIGxlZ2FjeSBvYmplY3RzIHJhdGhlciB0aGFuIHNpbGVudGx5
IGVyYXNpbmcgaGlzdG9yeQpvayAyMzIgLSByZWplY3Qgbm9uLUpTT04gbGVnYWN5IG9iamVjdHMg
cmF0aGVyIHRoYW4gc2lsZW50bHkgZXJhc2luZyBoaXN0b3J5CiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMjk5NzA5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb3B0aW9uYWwgaGlzdG9y
eSBwbGF5ZXIgaW5kZXhlcyBhY2NlcHQgbnVsbCwgYnV0IG5ldmVyIGludmFsaWQgdmFsdWVzCm9r
IDIzMyAtIG9wdGlvbmFsIGhpc3RvcnkgcGxheWVyIGluZGV4ZXMgYWNjZXB0IG51bGwsIGJ1dCBu
ZXZlciBpbnZhbGlkIHZhbHVlcwogIC0tLQogIGR1cmF0aW9uX21zOiA5LjI3ODM5NAogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGhpc3RvcnkgdW5rbm93biBmaWVsZHMgc3Vydml2ZSBK
U09OIHJvdW5kdHJpcCB3aGlsZSBtYWxmb3JtZWQga25vd24gdmVjdG9ycyBhcmUgcmVqZWN0ZWQK
b2sgMjM0IC0gaGlzdG9yeSB1bmtub3duIGZpZWxkcyBzdXJ2aXZlIEpTT04gcm91bmR0cmlwIHdo
aWxlIG1hbGZvcm1lZCBrbm93biB2ZWN0b3JzIGFyZSByZWplY3RlZAogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjY2MTYxMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlamVjdCBoaXN0
b3J5IG1ldGFkYXRhIHRoYXQgSlNPTiB3b3VsZCBzaWxlbnRseSB0cmFuc2Zvcm0Kb2sgMjM1IC0g
cmVqZWN0IGhpc3RvcnkgbWV0YWRhdGEgdGhhdCBKU09OIHdvdWxkIHNpbGVudGx5IHRyYW5zZm9y
bQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQyOTYxNQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IHJlamVjdCBzcGFyc2UgaGlzdG9yeSBtZXRhZGF0YSBhcnJheXMgYW5kIG5vbi1pbmRl
eCBhcnJheSBwcm9wZXJ0aWVzIGJlZm9yZSBKU09OIHNuYXBzaG90Cm9rIDIzNiAtIHJlamVjdCBz
cGFyc2UgaGlzdG9yeSBtZXRhZGF0YSBhcnJheXMgYW5kIG5vbi1pbmRleCBhcnJheSBwcm9wZXJ0
aWVzIGJlZm9yZSBKU09OIHNuYXBzaG90CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzMwNzc3CiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IG1hbGZvcm1lZCBVbmljb2RlIGJl
Zm9yZSBTdXBhYmFzZSBqc29uYiBjb252ZXJzaW9uIHdoaWxlIHJldGFpbmluZyB2YWxpZCBlbW9q
aQpvayAyMzcgLSByZWplY3QgbWFsZm9ybWVkIFVuaWNvZGUgYmVmb3JlIFN1cGFiYXNlIGpzb25i
IGNvbnZlcnNpb24gd2hpbGUgcmV0YWluaW5nIHZhbGlkIGVtb2ppCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuNDE4OTI5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IHVucGFp
cmVkIFVuaWNvZGUgc3Vycm9nYXRlcyBpbiBuZXN0ZWQgaGlzdG9yeSBvYmplY3Qga2V5cwpvayAy
MzggLSByZWplY3QgdW5wYWlyZWQgVW5pY29kZSBzdXJyb2dhdGVzIGluIG5lc3RlZCBoaXN0b3J5
IG9iamVjdCBrZXlzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjc4NjA4CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogVW5pY29kZSBuYW1lIGxpbWl0cyBjb3VudCBjb2RlIHBvaW50cyBs
aWtlIFBvc3RncmVTUUwgbGVuZ3RoLCBub3QgVVRGLTE2IHVuaXRzCm9rIDIzOSAtIFVuaWNvZGUg
bmFtZSBsaW1pdHMgY291bnQgY29kZSBwb2ludHMgbGlrZSBQb3N0Z3JlU1FMIGxlbmd0aCwgbm90
IFVURi0xNiB1bml0cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQ4NDgzNwogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IHJlamVjdCBQb3N0Z3JlU1FMLWluY29tcGF0aWJsZSBVbmljb2Rl
IE5VTCBpbiB2YWx1ZXMgYW5kIG9iamVjdCBrZXlzCm9rIDI0MCAtIHJlamVjdCBQb3N0Z3JlU1FM
LWluY29tcGF0aWJsZSBVbmljb2RlIE5VTCBpbiB2YWx1ZXMgYW5kIG9iamVjdCBrZXlzCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMzU4MzY4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
c3RydWN0dXJhbCBjb21wYXJpc29uIHByZXNlcnZlcyBKU09OIGtleXMgbmFtZWQgX19wcm90b19f
Cm9rIDI0MSAtIHN0cnVjdHVyYWwgY29tcGFyaXNvbiBwcmVzZXJ2ZXMgSlNPTiBrZXlzIG5hbWVk
IF9fcHJvdG9fXwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQxNjM1NQogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IFBvc3RncmVTUUwganNvbmIgc3BhY2luZyBjYW5ub3QgcHVzaCBuZWFy
LWxpbWl0IGNvbXBhY3QgSlNPTiBvdmVyIDJNQgpvayAyNDIgLSBQb3N0Z3JlU1FMIGpzb25iIHNw
YWNpbmcgY2Fubm90IHB1c2ggbmVhci1saW1pdCBjb21wYWN0IEpTT04gb3ZlciAyTUIKICAtLS0K
ICBkdXJhdGlvbl9tczogNjk1Ljc2MDQzMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IGhpc3RvcmljYWwgcm91bmQgd2luZCBtYXRjaGVzIGFjdHVhbCBzYXZlZCBoYW5kIGZvcm1hdCBh
bmQgcmVqZWN0cyBpbnZhbGlkIHdpbmRzCm9rIDI0MyAtIGhpc3RvcmljYWwgcm91bmQgd2luZCBt
YXRjaGVzIGFjdHVhbCBzYXZlZCBoYW5kIGZvcm1hdCBhbmQgcmVqZWN0cyBpbnZhbGlkIHdpbmRz
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNjYwNzAyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogcmVqZWN0cyBnYW1lIHJvb3QgdHJhbnNmb3JtZWQgdG8gSlNPTiBudWxsIGJ5IHRvSlNP
TiBiZWZvcmUgUlBDCm9rIDI0NCAtIHJlamVjdHMgZ2FtZSByb290IHRyYW5zZm9ybWVkIHRvIEpT
T04gbnVsbCBieSB0b0pTT04gYmVmb3JlIFJQQwogIC0tLQogIGR1cmF0aW9uX21zOiAxLjMwMTcx
NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlamVjdHMgZ2FtZSByb290IHRyYW5z
Zm9ybWVkIHRvIEpTT04gYXJyYXkgYnkgdG9KU09OIGJlZm9yZSBSUEMKb2sgMjQ1IC0gcmVqZWN0
cyBnYW1lIHJvb3QgdHJhbnNmb3JtZWQgdG8gSlNPTiBhcnJheSBieSB0b0pTT04gYmVmb3JlIFJQ
QwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIyNzQxMQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IGFjY2VwdHMgb3JkaW5hcnkgSlNPTiBvYmplY3Qgcm9vdCBhbmQgcHJlc2VydmVzIHBh
eWxvYWQKb2sgMjQ2IC0gYWNjZXB0cyBvcmRpbmFyeSBKU09OIG9iamVjdCByb290IGFuZCBwcmVz
ZXJ2ZXMgcGF5bG9hZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjgxNzE5NgogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IHNlcnZlciByZXZvY2F0aW9uIGRpc2FibGVzIHdyaXRlciB3aXRo
b3V0IGNsZWFyaW5nIGJhY2t1cHMKb2sgMjQ3IC0gc2VydmVyIHJldm9jYXRpb24gZGlzYWJsZXMg
d3JpdGVyIHdpdGhvdXQgY2xlYXJpbmcgYmFja3VwcwogIC0tLQogIGR1cmF0aW9uX21zOiAyLjQ0
NzcyMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHdyaXRlciBsZWFzZSBkb3duZ3Jh
ZGVkIHRvIHJlYWRlciBpcyBuZXZlciBhdXRvbWF0aWNhbGx5IHJlc3RvcmVkCm9rIDI0OCAtIHdy
aXRlciBsZWFzZSBkb3duZ3JhZGVkIHRvIHJlYWRlciBpcyBuZXZlciBhdXRvbWF0aWNhbGx5IHJl
c3RvcmVkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDQ2OAogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IG5ldHdvcmsgaW50ZXJydXB0aW9uIGRvZXMgbm90IHNpbGVudGx5IHJldm9rZSBv
ciByZW5ldyB3cml0ZXIKb2sgMjQ5IC0gbmV0d29yayBpbnRlcnJ1cHRpb24gZG9lcyBub3Qgc2ls
ZW50bHkgcmV2b2tlIG9yIHJlbmV3IHdyaXRlcgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM2MzM5
NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN5bmMgbW9kdWxlcyBsb2FkZWQgYmVm
b3JlIG1haW4gYXV0aCBjb2RlCm9rIDI1MCAtIHN5bmMgbW9kdWxlcyBsb2FkZWQgYmVmb3JlIG1h
aW4gYXV0aCBjb2RlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuNDcyNAogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IHN5bmMgcmVtYWlucyBmYWlsLWNsb3NlZCBhbmQgY2xvdWQgYWRvcHRp
b24gcmVxdWlyZXMgc2FmZSBsb2NhbCBwZXJzaXN0ZW5jZQpvayAyNTEgLSBzeW5jIHJlbWFpbnMg
ZmFpbC1jbG9zZWQgYW5kIGNsb3VkIGFkb3B0aW9uIHJlcXVpcmVzIHNhZmUgbG9jYWwgcGVyc2lz
dGVuY2UKICAtLS0KICBkdXJhdGlvbl9tczogMC45NDAyMzEKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBleGlzdGluZyBzYXZlIHdyaXRlcyBsb2NhbGx5IGJlZm9yZSBhbnkgb3B0aW9u
YWwgY2xvdWQgc2VuZApvayAyNTIgLSBleGlzdGluZyBzYXZlIHdyaXRlcyBsb2NhbGx5IGJlZm9y
ZSBhbnkgb3B0aW9uYWwgY2xvdWQgc2VuZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjMyMzI4Ngog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxvZ291dCByZXNldHMgYnJpZGdlIGFuZCBj
YW5ub3QgbGVhdmUgc3RhbGUgYWN0aXZlIHNlc3Npb24Kb2sgMjUzIC0gbG9nb3V0IHJlc2V0cyBi
cmlkZ2UgYW5kIGNhbm5vdCBsZWF2ZSBzdGFsZSBhY3RpdmUgc2Vzc2lvbgogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjI3NzM5NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNsb3VkLWVu
YWJsZWQgbW9kZSByZWZ1c2VzIGxvY2FsIHNjb3JlIHBlcnNpc3RlbmNlIHdpdGhvdXQgYW4gYWN0
aXZlIHdyaXRlciBsZWFzZQpvayAyNTQgLSBjbG91ZC1lbmFibGVkIG1vZGUgcmVmdXNlcyBsb2Nh
bCBzY29yZSBwZXJzaXN0ZW5jZSB3aXRob3V0IGFuIGFjdGl2ZSB3cml0ZXIgbGVhc2UKICAtLS0K
ICBkdXJhdGlvbl9tczogMC40NjE2MjMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBh
IHZhbmlzaGVkIGNsb3VkIGdhbWUgbmV2ZXIgc2lsZW50bHkgYm9vdHN0cmFwcyBhIG5ldyBnYW1l
IGFmdGVyIHByZWZsaWdodApvayAyNTUgLSBhIHZhbmlzaGVkIGNsb3VkIGdhbWUgbmV2ZXIgc2ls
ZW50bHkgYm9vdHN0cmFwcyBhIG5ldyBnYW1lIGFmdGVyIHByZWZsaWdodAogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjg5NzMyNwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHBlZWsgUlBD
IGV4aXN0cyBhbmQgcmVxdWlyZXMgYXV0aGVudGljYXRlZCBjYWxsZXIKb2sgMjU2IC0gcGVlayBS
UEMgZXhpc3RzIGFuZCByZXF1aXJlcyBhdXRoZW50aWNhdGVkIGNhbGxlcgogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjg2NTE3OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHBlZWsgcmVm
dXNlcyBiYW5uZWQsIGRlbGV0ZWQsIG9yIG9sZGVyIHNjb3Jla2VlcGVyIGxvZ2luCm9rIDI1NyAt
IHBlZWsgcmVmdXNlcyBiYW5uZWQsIGRlbGV0ZWQsIG9yIG9sZGVyIHNjb3Jla2VlcGVyIGxvZ2lu
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTQyOTQ0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogcGVlayByZXR1cm5zIHJldmlzaW9uIHdpdGhvdXQgYW55IGRhdGEgbXV0YXRpb24Kb2sg
MjU4IC0gcGVlayByZXR1cm5zIHJldmlzaW9uIHdpdGhvdXQgYW55IGRhdGEgbXV0YXRpb24KICAt
LS0KICBkdXJhdGlvbl9tczogMC4yOTExNjcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBwZWVrIGNhbGxhYmxlIGJ5IGF1dGhlbnRpY2F0ZWQgb25seQpvayAyNTkgLSBwZWVrIGNhbGxh
YmxlIGJ5IGF1dGhlbnRpY2F0ZWQgb25seQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEzMTI2Nwog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGRyYWZ0IGZhaWxzIGNsb3NlZCBiZWZvcmUg
YmVnaW5uaW5nIGFueSBzY2hlbWEgdHJhbnNhY3Rpb24Kb2sgMjYwIC0gZHJhZnQgZmFpbHMgY2xv
c2VkIGJlZm9yZSBiZWdpbm5pbmcgYW55IHNjaGVtYSB0cmFuc2FjdGlvbgogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjY2Mjg1NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpeCBSUEMg
ZW50cnlwb2ludHMgYXJlIHByZXNlbnQgZXhhY3RseSBvbmNlCm9rIDI2MSAtIHNpeCBSUEMgZW50
cnlwb2ludHMgYXJlIHByZXNlbnQgZXhhY3RseSBvbmNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
NTIyNzQ1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWxsIFJQQyBlbnRyeXBvaW50
cyBleHBsaWNpdGx5IGNvbnN0cmFpbiBzZWFyY2hfcGF0aApvayAyNjIgLSBhbGwgUlBDIGVudHJ5
cG9pbnRzIGV4cGxpY2l0bHkgY29uc3RyYWluIHNlYXJjaF9wYXRoCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMjYwNTIxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWxsIHNpeCBSUENz
IGV4cGxpY2l0bHkgcmV2b2tlIGFub255bW91cyBhbmQgcHVibGljIGV4ZWN1dGlvbgpvayAyNjMg
LSBhbGwgc2l4IFJQQ3MgZXhwbGljaXRseSByZXZva2UgYW5vbnltb3VzIGFuZCBwdWJsaWMgZXhl
Y3V0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzA5NzU1CiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogd3JpdGVyIG9wZW4gYW5kIGNvbW1pdCBzZXJpYWxpemUgb24gbG9ja2VkIGFj
Y291bnQgcm93Cm9rIDI2NCAtIHdyaXRlciBvcGVuIGFuZCBjb21taXQgc2VyaWFsaXplIG9uIGxv
Y2tlZCBhY2NvdW50IHJvdwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI0NjU2CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZC1vbmx5IHByZWZsaWdodCBjaGVja3MgYmxvY2tpbmcg
c2luZ2xlLWRldmljZSBpbmRleCB3aXRob3V0IG1vZGlmeWluZyBzY2hlbWEKb2sgMjY1IC0gcmVh
ZC1vbmx5IHByZWZsaWdodCBjaGVja3MgYmxvY2tpbmcgc2luZ2xlLWRldmljZSBpbmRleCB3aXRo
b3V0IG1vZGlmeWluZyBzY2hlbWEKICAtLS0KICBkdXJhdGlvbl9tczogMS4zNTIxODkKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBwcmVmbGlnaHQgY2hlY2tzIHJlcXVpcmVkIGN1cnJl
bnQtZ2FtZSB1bmlxdWVuZXNzIGFuZCBzZXNzaW9uIGxvb2t1cCBpbmRleGVzCm9rIDI2NiAtIHBy
ZWZsaWdodCBjaGVja3MgcmVxdWlyZWQgY3VycmVudC1nYW1lIHVuaXF1ZW5lc3MgYW5kIHNlc3Np
b24gbG9va3VwIGluZGV4ZXMKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMzAwNjYKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBwcmVmbGlnaHQgcmV0dXJucyBpbmRleCByZXN1bHRzIHdp
dGggZXhpc3RpbmcgdGFibGUgY29sdW1uIGZ1bmN0aW9uIGFuZCBSUEMgZGlhZ25vc3RpY3MKb2sg
MjY3IC0gcHJlZmxpZ2h0IHJldHVybnMgaW5kZXggcmVzdWx0cyB3aXRoIGV4aXN0aW5nIHRhYmxl
IGNvbHVtbiBmdW5jdGlvbiBhbmQgUlBDIGRpYWdub3N0aWNzCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMjQ3MDcxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcHJlZmxpZ2h0IGlzIHJl
YWQtb25seSBhbmQgbmV2ZXIgcnVucyBEREwgb3Igd3JpdGVzCm9rIDI2OCAtIHByZWZsaWdodCBp
cyByZWFkLW9ubHkgYW5kIG5ldmVyIHJ1bnMgRERMIG9yIHdyaXRlcwogIC0tLQogIGR1cmF0aW9u
X21zOiA0LjM4NDQ0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcHJlZmxpZ2h0IGNo
ZWNrcyBhbGwgZm91ciB0YWJsZXMsIFJMUywgcHJpdmlsZWdlcywgYW5kIHJlcXVpcmVkIGNvbHVt
bnMKb2sgMjY5IC0gcHJlZmxpZ2h0IGNoZWNrcyBhbGwgZm91ciB0YWJsZXMsIFJMUywgcHJpdmls
ZWdlcywgYW5kIHJlcXVpcmVkIGNvbHVtbnMKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNzk5MQog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHByZWZsaWdodCByZWplY3RzIHdyb25nIGdh
bWUgaW4gUlBDIHJlc3BvbnNlIGV2ZW4gaWYgc2VydmVyIGVycm9uZW91c2x5IGFjY2VwdHMgdGFr
ZW92ZXIKb2sgMjcwIC0gcHJlZmxpZ2h0IHJlamVjdHMgd3JvbmcgZ2FtZSBpbiBSUEMgcmVzcG9u
c2UgZXZlbiBpZiBzZXJ2ZXIgZXJyb25lb3VzbHkgYWNjZXB0cyB0YWtlb3ZlcgogIC0tLQogIGR1
cmF0aW9uX21zOiAxLjMxMzM4MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHByZWZs
aWdodCByZWplY3RzIHdyb25nIHJldmlzaW9uIGluIFJQQyByZXNwb25zZSBldmVuIGlmIHNlcnZl
ciBlcnJvbmVvdXNseSBhY2NlcHRzIHRha2VvdmVyCm9rIDI3MSAtIHByZWZsaWdodCByZWplY3Rz
IHdyb25nIHJldmlzaW9uIGluIFJQQyByZXNwb25zZSBldmVuIGlmIHNlcnZlciBlcnJvbmVvdXNs
eSBhY2NlcHRzIHRha2VvdmVyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTgyNTU0CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcHVzaCBkcmFpbnMgZWRpdHMgYXJyaXZpbmcgZHVyaW5n
IHR3byBzdWNjZXNzaXZlIG5ldHdvcmsgY29tbWl0cwpvayAyNzIgLSBwdXNoIGRyYWlucyBlZGl0
cyBhcnJpdmluZyBkdXJpbmcgdHdvIHN1Y2Nlc3NpdmUgbmV0d29yayBjb21taXRzCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDYuNDM5MzU0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVh
ZCBSUEMgaXMgcmVzdHJpY3RlZCB0byB0aGUgZXhhY3QgYWN0aXZlIGF1dGggc2Vzc2lvbiBhbmQg
ZGV2aWNlCm9rIDI3MyAtIHJlYWQgUlBDIGlzIHJlc3RyaWN0ZWQgdG8gdGhlIGV4YWN0IGFjdGl2
ZSBhdXRoIHNlc3Npb24gYW5kIGRldmljZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjg3NTM5NAog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlYWQgUlBDIHJlamVjdHMgaW5hY3RpdmUg
YW5kIHN1cGVyc2VkZWQgc2NvcmVrZWVwZXIgYWNjb3VudHMKb2sgMjc0IC0gcmVhZCBSUEMgcmVq
ZWN0cyBpbmFjdGl2ZSBhbmQgc3VwZXJzZWRlZCBzY29yZWtlZXBlciBhY2NvdW50cwogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjE4NjgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFk
IFJQQyBuZXZlciBncmFudHMgYSB3cml0ZXIgbGVhc2Ugb3IgbXV0YXRlcyBjbG91ZCBzdGF0ZQpv
ayAyNzUgLSByZWFkIFJQQyBuZXZlciBncmFudHMgYSB3cml0ZXIgbGVhc2Ugb3IgbXV0YXRlcyBj
bG91ZCBzdGF0ZQogIC0tLQogIGR1cmF0aW9uX21zOiAxMy41MjgxODEKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBjbG91ZCByZWFkIG9ubHkgcmVwb3J0cyB3cml0ZXIgY2FwYWJpbGl0
eSBmb3IgYSB0b2tlbi1iYWNrZWQgd3JpdGVyIGxlYXNlCm9rIDI3NiAtIGNsb3VkIHJlYWQgb25s
eSByZXBvcnRzIHdyaXRlciBjYXBhYmlsaXR5IGZvciBhIHRva2VuLWJhY2tlZCB3cml0ZXIgbGVh
c2UKICAtLS0KICBkdXJhdGlvbl9tczogMS4wNDYxMTkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBjbG91ZCByZWFkIHJlcXVpcmVzIGN1cnJlbnQgYWN0aXZlIG5vbnJldm9rZWQgYXV0
aC1ib3VuZCBsZWFzZQpvayAyNzcgLSBjbG91ZCByZWFkIHJlcXVpcmVzIGN1cnJlbnQgYWN0aXZl
IG5vbnJldm9rZWQgYXV0aC1ib3VuZCBsZWFzZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE5Mzcz
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZGVyIGVucm9sbG1lbnQgY2Fubm90
IGdyYW50IHdyaXRlciByaWdodHMgb3Igd3JpdGVyIHRva2VuCm9rIDI3OCAtIHJlYWRlciBlbnJv
bGxtZW50IGNhbm5vdCBncmFudCB3cml0ZXIgcmlnaHRzIG9yIHdyaXRlciB0b2tlbgogIC0tLQog
IGR1cmF0aW9uX21zOiAxLjMxMjY4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVh
ZGVyIGVucm9sbG1lbnQgaXMgcmVzdHJpY3RlZCB0byBhZG1pbiBvciBlbmFibGVkIG11bHRpLWRl
dmljZSBhY2NvdW50cwpvayAyNzkgLSByZWFkZXIgZW5yb2xsbWVudCBpcyByZXN0cmljdGVkIHRv
IGFkbWluIG9yIGVuYWJsZWQgbXVsdGktZGV2aWNlIGFjY291bnRzCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMTUzNTcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhZGFwdGVyIHVzZXMg
c2VwYXJhdGUgcmVhZGVyIFJQQywgbmV2ZXIgd3JpdGVyIHRha2VvdmVyCm9rIDI4MCAtIGFkYXB0
ZXIgdXNlcyBzZXBhcmF0ZSByZWFkZXIgUlBDLCBuZXZlciB3cml0ZXIgdGFrZW92ZXIKICAtLS0K
ICBkdXJhdGlvbl9tczogMS44NTUxMjQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBy
ZWFkIHJlamVjdHMgZXhpc3RpbmcgcmVhZGVyIGxlYXNlIHdoZW4gbXVsdGktZGV2aWNlIHBlcm1p
c3Npb24gaXMgcmV2b2tlZApvayAyODEgLSByZWFkIHJlamVjdHMgZXhpc3RpbmcgcmVhZGVyIGxl
YXNlIHdoZW4gbXVsdGktZGV2aWNlIHBlcm1pc3Npb24gaXMgcmV2b2tlZAogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjgzODI0OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHdyaXRlciBy
ZW1haW5zIGVsaWdpYmxlIGZvciByZWFkIGFmdGVyIG11bHRpLWRldmljZSBwZXJtaXNzaW9uIGlz
IGRpc2FibGVkCm9rIDI4MiAtIHdyaXRlciByZW1haW5zIGVsaWdpYmxlIGZvciByZWFkIGFmdGVy
IG11bHRpLWRldmljZSBwZXJtaXNzaW9uIGlzIGRpc2FibGVkCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMTYyMDQzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcGVlayBlbmZvcmNlcyBK
V1QtYm91bmQgYWN0aXZlIHNlc3Npb24gYW5kIGFjY291bnQgc3RhdHVzCm9rIDI4MyAtIHBlZWsg
ZW5mb3JjZXMgSldULWJvdW5kIGFjdGl2ZSBzZXNzaW9uIGFuZCBhY2NvdW50IHN0YXR1cwogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjcyOTU4NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IHBlZWsgb25seSBzZWxlY3RzIGdhbWUgc3RhdGUgYW5kIG5ldmVyIHdyaXRlcy9yZXZva2VzIGxl
YXNlcwpvayAyODQgLSBwZWVrIG9ubHkgc2VsZWN0cyBnYW1lIHN0YXRlIGFuZCBuZXZlciB3cml0
ZXMvcmV2b2tlcyBsZWFzZXMKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNzcwNzYKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBwZWVrIGxpbWl0cyBSUEMgZXhlY3V0aW9uIHRvIGF1dGhl
bnRpY2F0ZWQgdXNlcnMKb2sgMjg1IC0gcGVlayBsaW1pdHMgUlBDIGV4ZWN1dGlvbiB0byBhdXRo
ZW50aWNhdGVkIHVzZXJzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTQ5Nzg1CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogYWRhcHRlciBleHBvc2VzIHJlYWQtb25seSBwZWVrIHdpdGhv
dXQgd3JpdGVyIHRva2VuCm9rIDI4NiAtIGFkYXB0ZXIgZXhwb3NlcyByZWFkLW9ubHkgcGVlayB3
aXRob3V0IHdyaXRlciB0b2tlbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjcyNTE2OAogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpbmdsZS1kZXZpY2Ugc2NvcmVrZWVwZXIgb2xkIGxv
Z2luIGNhbm5vdCBwZWVrIGFjdGl2ZSBnYW1lCm9rIDI4NyAtIHNpbmdsZS1kZXZpY2Ugc2NvcmVr
ZWVwZXIgb2xkIGxvZ2luIGNhbm5vdCBwZWVrIGFjdGl2ZSBnYW1lCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMTIwNDcxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhbCByZWNvcmRl
ZCBoYW5kIGZpZWxkcyBpbiBhcHAgYXJlIHByZXNlcnZlZCBieSBzeW5jIHZhbGlkYXRpb24Kb2sg
Mjg4IC0gcmVhbCByZWNvcmRlZCBoYW5kIGZpZWxkcyBpbiBhcHAgYXJlIHByZXNlcnZlZCBieSBz
eW5jIHZhbGlkYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogNC40NzE3MQogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IHJlY29yZCByZXN0b3JlcyBzY29yZSBhbmQgZnVsbCBoaXN0b3J5
IGlmIGR1cmFibGUgc2F2ZSBvciBzeW5jIGVucXVldWUgZmFpbHMKb2sgMjg5IC0gcmVjb3JkIHJl
c3RvcmVzIHNjb3JlIGFuZCBmdWxsIGhpc3RvcnkgaWYgZHVyYWJsZSBzYXZlIG9yIHN5bmMgZW5x
dWV1ZSBmYWlscwogIC0tLQogIGR1cmF0aW9uX21zOiAxLjAzNDcwMwogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IG1haGpvbmdfc3luY19vcGVuOiByZXN0cmljdGVkIFNFQ1VSSVRZIERF
RklORVIgYW5kIGF1dGhlbnRpY2F0ZWQtb25seSBFWEVDVVRFCm9rIDI5MCAtIG1haGpvbmdfc3lu
Y19vcGVuOiByZXN0cmljdGVkIFNFQ1VSSVRZIERFRklORVIgYW5kIGF1dGhlbnRpY2F0ZWQtb25s
eSBFWEVDVVRFCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODQ1MDA5CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogbWFoam9uZ19zeW5jX2NvbW1pdDogcmVzdHJpY3RlZCBTRUNVUklUWSBE
RUZJTkVSIGFuZCBhdXRoZW50aWNhdGVkLW9ubHkgRVhFQ1VURQpvayAyOTEgLSBtYWhqb25nX3N5
bmNfY29tbWl0OiByZXN0cmljdGVkIFNFQ1VSSVRZIERFRklORVIgYW5kIGF1dGhlbnRpY2F0ZWQt
b25seSBFWEVDVVRFCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTc1NjQzCiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogbWFoam9uZ19zeW5jX29wZW5fcmVhZGVyOiByZXN0cmljdGVkIFNF
Q1VSSVRZIERFRklORVIgYW5kIGF1dGhlbnRpY2F0ZWQtb25seSBFWEVDVVRFCm9rIDI5MiAtIG1h
aGpvbmdfc3luY19vcGVuX3JlYWRlcjogcmVzdHJpY3RlZCBTRUNVUklUWSBERUZJTkVSIGFuZCBh
dXRoZW50aWNhdGVkLW9ubHkgRVhFQ1VURQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjA5MjE2OAog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG1haGpvbmdfc3luY19wZWVrOiByZXN0cmlj
dGVkIFNFQ1VSSVRZIERFRklORVIgYW5kIGF1dGhlbnRpY2F0ZWQtb25seSBFWEVDVVRFCm9rIDI5
MyAtIG1haGpvbmdfc3luY19wZWVrOiByZXN0cmljdGVkIFNFQ1VSSVRZIERFRklORVIgYW5kIGF1
dGhlbnRpY2F0ZWQtb25seSBFWEVDVVRFCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTE4MjQ4CiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbWFoam9uZ19zeW5jX3JlYWQ6IHJlc3RyaWN0
ZWQgU0VDVVJJVFkgREVGSU5FUiBhbmQgYXV0aGVudGljYXRlZC1vbmx5IEVYRUNVVEUKb2sgMjk0
IC0gbWFoam9uZ19zeW5jX3JlYWQ6IHJlc3RyaWN0ZWQgU0VDVVJJVFkgREVGSU5FUiBhbmQgYXV0
aGVudGljYXRlZC1vbmx5IEVYRUNVVEUKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMDExMDIKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBtYWhqb25nX3N5bmNfbGVhc2Vfc3RhdHVzOiBy
ZXN0cmljdGVkIFNFQ1VSSVRZIERFRklORVIgYW5kIGF1dGhlbnRpY2F0ZWQtb25seSBFWEVDVVRF
Cm9rIDI5NSAtIG1haGpvbmdfc3luY19sZWFzZV9zdGF0dXM6IHJlc3RyaWN0ZWQgU0VDVVJJVFkg
REVGSU5FUiBhbmQgYXV0aGVudGljYXRlZC1vbmx5IEVYRUNVVEUKICAtLS0KICBkdXJhdGlvbl9t
czogMC4wNzI3NTkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBkcmFmdCBzdGF5cyBi
bG9ja2VkIGZyb20gcHJvZHVjdGlvbiBleGVjdXRpb24Kb2sgMjk2IC0gZHJhZnQgc3RheXMgYmxv
Y2tlZCBmcm9tIHByb2R1Y3Rpb24gZXhlY3V0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzA0
NDE3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWxsIHNpeCBSUEMgZW50cnlwb2lu
dHMgYXJlIGV4cGxpY2l0bHkgYXV0aGVudGljYXRlZC1vbmx5LCBub3QgYW5vbiBvciBQVUJMSUMK
b2sgMjk3IC0gYWxsIHNpeCBSUEMgZW50cnlwb2ludHMgYXJlIGV4cGxpY2l0bHkgYXV0aGVudGlj
YXRlZC1vbmx5LCBub3QgYW5vbiBvciBQVUJMSUMKICAtLS0KICBkdXJhdGlvbl9tczogMS44NDA1
MzIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhbGwgc2l4IFJQQ3MgYmluZCBpZGVu
dGl0eSB0byB2ZXJpZmllZCBTdXBhYmFzZSBBdXRoIHNlc3Npb24Kb2sgMjk4IC0gYWxsIHNpeCBS
UENzIGJpbmQgaWRlbnRpdHkgdG8gdmVyaWZpZWQgU3VwYWJhc2UgQXV0aCBzZXNzaW9uCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMzkzODAxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
YWxsIHNpeCBSUENzIHBpbiBTRUNVUklUWSBERUZJTkVSIHNlYXJjaCBwYXRoCm9rIDI5OSAtIGFs
bCBzaXggUlBDcyBwaW4gU0VDVVJJVFkgREVGSU5FUiBzZWFyY2ggcGF0aAogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjIyMDYzMQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFJQQyBkcmFm
dCBhbmQgc2NoZW1hIGFsaWdubWVudCBuZXZlciBhdXRvLXByb21vdGUgbGVnYWN5IGdhbWVzCm9r
IDMwMCAtIFJQQyBkcmFmdCBhbmQgc2NoZW1hIGFsaWdubWVudCBuZXZlciBhdXRvLXByb21vdGUg
bGVnYWN5IGdhbWVzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMDg5ODM1CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogbmV3IGNsb3VkIGdhbWUgaXMgZXhwbGljaXRseSBjdXJyZW50IGF0
IGZpcnN0IGJvb3RzdHJhcApvayAzMDEgLSBuZXcgY2xvdWQgZ2FtZSBpcyBleHBsaWNpdGx5IGN1
cnJlbnQgYXQgZmlyc3QgYm9vdHN0cmFwCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjk3MTk2CiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY3VycmVudCBnYW1lIGJvb3RzdHJhcCByZW1h
aW5zIHByb3RlY3RlZCBieSBwcmVmbGlnaHQgYW5kIGZhaWwtY2xvc2VkIGd1YXJkCm9rIDMwMiAt
IGN1cnJlbnQgZ2FtZSBib290c3RyYXAgcmVtYWlucyBwcm90ZWN0ZWQgYnkgcHJlZmxpZ2h0IGFu
ZCBmYWlsLWNsb3NlZCBndWFyZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjY4ODU5MwogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpeC1SUEMgZHJhZnQgZG9lcyBub3QgY3JlYXRlIHJl
ZHVuZGFudCBjdXJyZW50LWdhbWUgdW5pcXVlIGluZGV4Cm9rIDMwMyAtIHNpeC1SUEMgZHJhZnQg
ZG9lcyBub3QgY3JlYXRlIHJlZHVuZGFudCBjdXJyZW50LWdhbWUgdW5pcXVlIGluZGV4CiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuOTQzMjA1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
b3BlbiBSUEMgZXhwbGljaXRseSBkZW5pZXMgTlVMTCBhY2NvdW50IHJvbGVzCm9rIDMwNCAtIG9w
ZW4gUlBDIGV4cGxpY2l0bHkgZGVuaWVzIE5VTEwgYWNjb3VudCByb2xlcwogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjIyMjMxNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGRyYWZ0IGFu
ZCByZXZpZXcgcmVtYWluIGZhaWwtY2xvc2VkIGFnYWluc3QgYWNjaWRlbnRhbCBkZXBsb3ltZW50
Cm9rIDMwNSAtIGRyYWZ0IGFuZCByZXZpZXcgcmVtYWluIGZhaWwtY2xvc2VkIGFnYWluc3QgYWNj
aWRlbnRhbCBkZXBsb3ltZW50CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTc4MzU3CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2VydmVyIFJQQyBoYXMgZXhwbGljaXQgYWNjb3VudCBs
b2NrIGFuZCByZXZpc2lvbiBsb2NrCm9rIDMwNiAtIHNlcnZlciBSUEMgaGFzIGV4cGxpY2l0IGFj
Y291bnQgbG9jayBhbmQgcmV2aXNpb24gbG9jawogIC0tLQogIGR1cmF0aW9uX21zOiAwLjgzMzcx
MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNlcnZlciBSUEMgZG9lcyBub3Qgb3Zl
cndyaXRlIGNsb3VkIG9uIHJlamVjdGVkIGNvbW1pdApvayAzMDcgLSBzZXJ2ZXIgUlBDIGRvZXMg
bm90IG92ZXJ3cml0ZSBjbG91ZCBvbiByZWplY3RlZCBjb21taXQKICAtLS0KICBkdXJhdGlvbl9t
czogMC4xODQ3NDgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzZXJ2ZXIgZnVuY3Rp
b25zIGFyZSBhdXRoLWJvdW5kIGFuZCBubyBzZXJ2aWNlIHJvbGUgY3JlZGVudGlhbHMgaW4gYnJv
d3NlcgpvayAzMDggLSBzZXJ2ZXIgZnVuY3Rpb25zIGFyZSBhdXRoLWJvdW5kIGFuZCBubyBzZXJ2
aWNlIHJvbGUgY3JlZGVudGlhbHMgaW4gYnJvd3NlcgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM2
OTIyNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNsb3VkIGFkb3B0aW9uIGlzIGd1
YXJkZWQgYnkgZXhwZWN0ZWQgcmV2aXNpb24gYmVmb3JlIHdyaXRlciByZXZvY2F0aW9uCm9rIDMw
OSAtIGNsb3VkIGFkb3B0aW9uIGlzIGd1YXJkZWQgYnkgZXhwZWN0ZWQgcmV2aXNpb24gYmVmb3Jl
IHdyaXRlciByZXZvY2F0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTUxMjI3CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3VwcGxpZWQgcHJlZmxpZ2h0IGdhbWUgaWRlbnRpdHkg
aXMgY2hlY2tlZCBmb3IgYm90aCBsb2NhbCBhbmQgY2xvdWQgYWRvcHRpb24gYmVmb3JlIHJldm9r
aW5nIHdyaXRlcgpvayAzMTAgLSBzdXBwbGllZCBwcmVmbGlnaHQgZ2FtZSBpZGVudGl0eSBpcyBj
aGVja2VkIGZvciBib3RoIGxvY2FsIGFuZCBjbG91ZCBhZG9wdGlvbiBiZWZvcmUgcmV2b2tpbmcg
d3JpdGVyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTMyNzUKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBvcGVuIHJlamVjdHMgTmFOIHNjb3JlIGJlZm9yZSBSUEMgcmF0aGVyIHRoYW4g
c2lsZW50bHkgY29udmVydGluZyBpdCB0byBudWxsCm9rIDMxMSAtIG9wZW4gcmVqZWN0cyBOYU4g
c2NvcmUgYmVmb3JlIFJQQyByYXRoZXIgdGhhbiBzaWxlbnRseSBjb252ZXJ0aW5nIGl0IHRvIG51
bGwKICAtLS0KICBkdXJhdGlvbl9tczogMS4zMzkzMgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IGNvbW1pdCByZWplY3RzIG5lc3RlZCBJbmZpbml0eSBpbiBoaXN0b3J5IGJlZm9yZSBS
UEMKb2sgMzEyIC0gY29tbWl0IHJlamVjdHMgbmVzdGVkIEluZmluaXR5IGluIGhpc3RvcnkgYmVm
b3JlIFJQQwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI3ODQ4NwogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IGZpbml0ZSBuZWdhdGl2ZSBhbmQgZnJhY3Rpb25hbCBudW1iZXJzIHJldGFp
biBKU09OIHZhbHVlcyBpbiBzbmFwc2hvdApvayAzMTMgLSBmaW5pdGUgbmVnYXRpdmUgYW5kIGZy
YWN0aW9uYWwgbnVtYmVycyByZXRhaW4gSlNPTiB2YWx1ZXMgaW4gc25hcHNob3QKICAtLS0KICBk
dXJhdGlvbl9tczogMC45MTg3NDkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBvcGVu
IHJlamVjdHMgb3ZlcnNpemVkIEFTQ0lJIGdhbWUgYmVmb3JlIG5ldHdvcmsgUlBDCm9rIDMxNCAt
IG9wZW4gcmVqZWN0cyBvdmVyc2l6ZWQgQVNDSUkgZ2FtZSBiZWZvcmUgbmV0d29yayBSUEMKICAt
LS0KICBkdXJhdGlvbl9tczogMTIuMTUxOTg2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogY29tbWl0IHJlamVjdHMgb3ZlcnNpemVkIG11bHRpYnl0ZSBVVEYtOCBnYW1lIGJlZm9yZSBu
ZXR3b3JrIFJQQwpvayAzMTUgLSBjb21taXQgcmVqZWN0cyBvdmVyc2l6ZWQgbXVsdGlieXRlIFVU
Ri04IGdhbWUgYmVmb3JlIG5ldHdvcmsgUlBDCiAgLS0tCiAgZHVyYXRpb25fbXM6IDExLjMzODMx
NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG9wZW4gYWNjZXB0cyBhIHNtYWxsIGdh
bWUgYW5kIHBhc3NlcyB0aGUgc25hcHNob3QgdG8gUlBDCm9rIDMxNiAtIG9wZW4gYWNjZXB0cyBh
IHNtYWxsIGdhbWUgYW5kIHBhc3NlcyB0aGUgc25hcHNob3QgdG8gUlBDCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuMjcxOTA4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb3BlbiBjaGVj
a3MgY2xvdWQgaWRlbnRpdHkgYW5kIHJldmlzaW9uIGJlZm9yZSByZXR1cm5pbmcgbG9jYWwgbWlz
bWF0Y2ggc25hcHNob3QKb2sgMzE3IC0gb3BlbiBjaGVja3MgY2xvdWQgaWRlbnRpdHkgYW5kIHJl
dmlzaW9uIGJlZm9yZSByZXR1cm5pbmcgbG9jYWwgbWlzbWF0Y2ggc25hcHNob3QKICAtLS0KICBk
dXJhdGlvbl9tczogMS42NjMyMDYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdGFs
ZSByZXZpc2lvbiByZXNwb25zZSBjb250YWlucyBtZXRhZGF0YSBidXQgbm8gY2xvdWQgZ2FtZSBz
bmFwc2hvdApvayAzMTggLSBzdGFsZSByZXZpc2lvbiByZXNwb25zZSBjb250YWlucyBtZXRhZGF0
YSBidXQgbm8gY2xvdWQgZ2FtZSBzbmFwc2hvdAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjMzOTIx
OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFsbCBwcmVmbGlnaHQgcmVqZWN0aW9u
IGNoZWNrcyByZW1haW4gYmVmb3JlIHdyaXRlciBsZWFzZSByZXZvY2F0aW9uCm9rIDMxOSAtIGFs
bCBwcmVmbGlnaHQgcmVqZWN0aW9uIGNoZWNrcyByZW1haW4gYmVmb3JlIHdyaXRlciBsZWFzZSBy
ZXZvY2F0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTcyODY5CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogb3BlbiByZWplY3RzIGEgcmV2aXNpb24gd2l0aG91dCBjbG91ZCBnYW1l
IElEIGJlZm9yZSBpbnZva2luZyBSUEMKb2sgMzIwIC0gb3BlbiByZWplY3RzIGEgcmV2aXNpb24g
d2l0aG91dCBjbG91ZCBnYW1lIElEIGJlZm9yZSBpbnZva2luZyBSUEMKICAtLS0KICBkdXJhdGlv
bl9tczogMS4zNDg3MTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBvcGVuIHJlamVj
dHMgYSBjbG91ZCBnYW1lIElEIHdpdGhvdXQgcmV2aXNpb24gYmVmb3JlIGludm9raW5nIFJQQwpv
ayAzMjEgLSBvcGVuIHJlamVjdHMgYSBjbG91ZCBnYW1lIElEIHdpdGhvdXQgcmV2aXNpb24gYmVm
b3JlIGludm9raW5nIFJQQwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIzNDU2MgogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG9wZW4gcGFzc2VzIG1hdGNoaW5nIGNsb3VkIHByZWZsaWdo
dCBJRCBhbmQgcmV2aXNpb24gdW5jaGFuZ2VkCm9rIDMyMiAtIG9wZW4gcGFzc2VzIG1hdGNoaW5n
IGNsb3VkIHByZWZsaWdodCBJRCBhbmQgcmV2aXNpb24gdW5jaGFuZ2VkCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuMjg5OTM1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0cyBS
UEMgb2JqZWN0IG1pc3Npbmcgb2sgZmxhZyBpbnN0ZWFkIG9mIHRyZWF0aW5nIGl0IGFzIGEgdmFs
aWQgcmVzdWx0Cm9rIDMyMyAtIHJlamVjdHMgUlBDIG9iamVjdCBtaXNzaW5nIG9rIGZsYWcgaW5z
dGVhZCBvZiB0cmVhdGluZyBpdCBhcyBhIHZhbGlkIHJlc3VsdAogIC0tLQogIGR1cmF0aW9uX21z
OiAxLjc0NzQ0MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlamVjdHMgUlBDIG9r
IGZsYWcgZW5jb2RlZCBhcyBzdHJpbmcgaW5zdGVhZCBvZiBib29sZWFuCm9rIDMyNCAtIHJlamVj
dHMgUlBDIG9rIGZsYWcgZW5jb2RlZCBhcyBzdHJpbmcgaW5zdGVhZCBvZiBib29sZWFuCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMzAzMzI1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
cHJlc2VydmVzIGV4cGxpY2l0IFJQQyByZWplY3Rpb24gd2l0aCBib29sZWFuIG9rIGZhbHNlCm9r
IDMyNSAtIHByZXNlcnZlcyBleHBsaWNpdCBSUEMgcmVqZWN0aW9uIHdpdGggYm9vbGVhbiBvayBm
YWxzZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM1NDgwMgogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IHJldmlldyBjYW5kaWRhdGUgaXMgZmFpbC1jbG9zZWQgYmVmb3JlIGFueSBzY2hl
bWEgbXV0YXRpb24Kb2sgMzI2IC0gcmV2aWV3IGNhbmRpZGF0ZSBpcyBmYWlsLWNsb3NlZCBiZWZv
cmUgYW55IHNjaGVtYSBtdXRhdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjcxNzY1NwogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGluY29tcGF0aWJsZSByZXZpZXcgb3BlbiBzaWdu
YXR1cmUgY2Fubm90IGJlIG1pc3Rha2VuIGZvciBkZXBsb3lhYmxlIGFkYXB0ZXIgY29udHJhY3QK
b2sgMzI3IC0gaW5jb21wYXRpYmxlIHJldmlldyBvcGVuIHNpZ25hdHVyZSBjYW5ub3QgYmUgbWlz
dGFrZW4gZm9yIGRlcGxveWFibGUgYWRhcHRlciBjb250cmFjdAogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjI1MzA1OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJldmlldyBsYWNrcyBk
cmFmdCBwcmVmbGlnaHQgYW5kIGhpZ2gtd2F0ZXIgZ3VhcmRzIGFuZCBtdXN0IHJlbWFpbiBibG9j
a2VkCm9rIDMyOCAtIHJldmlldyBsYWNrcyBkcmFmdCBwcmVmbGlnaHQgYW5kIGhpZ2gtd2F0ZXIg
Z3VhcmRzIGFuZCBtdXN0IHJlbWFpbiBibG9ja2VkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTc2
MDg1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmV2aWV3IFJQQyBvcGVuIGV4cGxp
Y2l0bHkgcmVqZWN0cyBOVUxMIHJvbGUKb2sgMzI5IC0gcmV2aWV3IFJQQyBvcGVuIGV4cGxpY2l0
bHkgcmVqZWN0cyBOVUxMIHJvbGUKICAtLS0KICBkdXJhdGlvbl9tczogMC43OTM1MQogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJldmlldyBSUEMgZG9lcyBub3QgcmVjcmVhdGUgZHVw
bGljYXRlIGN1cnJlbnQtZ2FtZSBpbmRleApvayAzMzAgLSByZXZpZXcgUlBDIGRvZXMgbm90IHJl
Y3JlYXRlIGR1cGxpY2F0ZSBjdXJyZW50LWdhbWUgaW5kZXgKICAtLS0KICBkdXJhdGlvbl9tczog
MC4zMjczMTEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZXZpZXcgUlBDIHJlbWFp
bnMgYXV0aGVudGljYXRlZC1vbmx5IGFuZCB1c2VzIHNlc3Npb24tYm91bmQgbGVhc2UKb2sgMzMx
IC0gcmV2aWV3IFJQQyByZW1haW5zIGF1dGhlbnRpY2F0ZWQtb25seSBhbmQgdXNlcyBzZXNzaW9u
LWJvdW5kIGxlYXNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTYyMzY0CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogZHJhZnQgUlBDIHJlbWFpbnMgZXhwbGljaXRseSBmYWlsLWNsb3Nl
ZCBmb3IgcHJvZHVjdGlvbgpvayAzMzIgLSBkcmFmdCBSUEMgcmVtYWlucyBleHBsaWNpdGx5IGZh
aWwtY2xvc2VkIGZvciBwcm9kdWN0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMjMyMzc5CiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogd3JpdGVyIGNvbW1pdCBiaW5kcyBKV1QgQXV0
aCBzZXNzaW9uLCBkZXZpY2UsIGdlbmVyYXRpb24gYW5kIHRva2VuIGhhc2gKb2sgMzMzIC0gd3Jp
dGVyIGNvbW1pdCBiaW5kcyBKV1QgQXV0aCBzZXNzaW9uLCBkZXZpY2UsIGdlbmVyYXRpb24gYW5k
IHRva2VuIGhhc2gKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNTM1MDEKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBSUEMgZGVmaW5lciBmdW5jdGlvbnMgcGluIHNlYXJjaF9wYXRoIGFu
ZCByZXN0cmljdCBhbm9ueW1vdXMgZXhlY3V0aW9uCm9rIDMzNCAtIFJQQyBkZWZpbmVyIGZ1bmN0
aW9ucyBwaW4gc2VhcmNoX3BhdGggYW5kIHJlc3RyaWN0IGFub255bW91cyBleGVjdXRpb24KICAt
LS0KICBkdXJhdGlvbl9tczogMC40MDEyNzIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBhbGwgc2l4IGNsaWVudCBSUEMgbmFtZXMgYW5kIFNRTCBmdW5jdGlvbiBwYXJhbWV0ZXIgbmFt
ZXMgYWdyZWUKb2sgMzM1IC0gYWxsIHNpeCBjbGllbnQgUlBDIG5hbWVzIGFuZCBTUUwgZnVuY3Rp
b24gcGFyYW1ldGVyIG5hbWVzIGFncmVlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDIuMDE1MDc0CiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWxsIHNpeCBSUEMgc2lnbmF0dXJlcyBncmFu
dCBleGVjdXRlIG9ubHkgdG8gYXV0aGVudGljYXRlZCBpbiBkcmFmdApvayAzMzYgLSBhbGwgc2l4
IFJQQyBzaWduYXR1cmVzIGdyYW50IGV4ZWN1dGUgb25seSB0byBhdXRoZW50aWNhdGVkIGluIGRy
YWZ0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzI5Mjk0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogdW52ZXJpZmllZCBmb3VyLXBhcmFtZXRlciBSUEMgZHJhZnQgcmVtYWlucyBmYWls
LWNsb3NlZCBiZWZvcmUgU1FMIHRyYW5zYWN0aW9uCm9rIDMzNyAtIHVudmVyaWZpZWQgZm91ci1w
YXJhbWV0ZXIgUlBDIGRyYWZ0IHJlbWFpbnMgZmFpbC1jbG9zZWQgYmVmb3JlIFNRTCB0cmFuc2Fj
dGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI3NjU0NQogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IHdyaXRlciB0YWtlb3ZlciBjaGVja3MgY2xvdWQgcHJlZmxpZ2h0IGJlZm9yZSBy
ZXZva2luZyBvbGQgd3JpdGVyCm9rIDMzOCAtIHdyaXRlciB0YWtlb3ZlciBjaGVja3MgY2xvdWQg
cHJlZmxpZ2h0IGJlZm9yZSByZXZva2luZyBvbGQgd3JpdGVyCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDEuMzQ3NzEyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29tbWl0IHNlcmlhbGl6
ZXMgb24gYWNjb3VudCBhbmQgZ2FtZSBiZWZvcmUgYWNjZXB0aW5nIHdyaXRlciBsZWFzZQpvayAz
MzkgLSBjb21taXQgc2VyaWFsaXplcyBvbiBhY2NvdW50IGFuZCBnYW1lIGJlZm9yZSBhY2NlcHRp
bmcgd3JpdGVyIGxlYXNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjYyNDg0CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogc3VjY2Vzc2Z1bCBsb2NhbCBzYXZlIHJlZnJlc2hlcyBzYXZl
ZC1zdGF0ZSBtYXJrZXIgYWZ0ZXIgZHVyYWJsZSBjbG91ZCBlbnF1ZXVlCm9rIDM0MCAtIHN1Y2Nl
c3NmdWwgbG9jYWwgc2F2ZSByZWZyZXNoZXMgc2F2ZWQtc3RhdGUgbWFya2VyIGFmdGVyIGR1cmFi
bGUgY2xvdWQgZW5xdWV1ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjc5MTIyOAogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGZhaWxlZCBsb2NhbCBzYXZlIG9yIHF1ZXVlIGZhaWx1cmUg
Y2Fubm90IHJlZnJlc2ggc2F2ZWQtc3RhdGUgbWFya2VyCm9rIDM0MSAtIGZhaWxlZCBsb2NhbCBz
YXZlIG9yIHF1ZXVlIGZhaWx1cmUgY2Fubm90IHJlZnJlc2ggc2F2ZWQtc3RhdGUgbWFya2VyCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMTczNTgxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogYWxpZ25tZW50IGNhbmRpZGF0ZSByZW1haW5zIHVuY29uZGl0aW9uYWxseSBibG9ja2VkIGJl
Zm9yZSBhbnkgRERMCm9rIDM0MiAtIGFsaWdubWVudCBjYW5kaWRhdGUgcmVtYWlucyB1bmNvbmRp
dGlvbmFsbHkgYmxvY2tlZCBiZWZvcmUgYW55IERETAogIC0tLQogIGR1cmF0aW9uX21zOiAxLjA1
MDI5NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNhbmRpZGF0ZSBhZGRzIHJlcXVp
cmVkIHdyaXRlciBhbmQgQXV0aCBiaW5kaW5nIGNvbHVtbnMgd2l0aG91dCBjbGVhcmluZyBleGlz
dGluZyBzZXNzaW9ucwpvayAzNDMgLSBjYW5kaWRhdGUgYWRkcyByZXF1aXJlZCB3cml0ZXIgYW5k
IEF1dGggYmluZGluZyBjb2x1bW5zIHdpdGhvdXQgY2xlYXJpbmcgZXhpc3Rpbmcgc2Vzc2lvbnMK
ICAtLS0KICBkdXJhdGlvbl9tczogMC40NDA4OTEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBjYW5kaWRhdGUgcHJldmVudHMgYWNjaWRlbnRhbCBjdXJyZW50LWdhbWUgcHJvbW90aW9u
IGFuZCBjaGVja3MgZHVwbGljYXRlcyBiZWZvcmUgaW5kZXgKb2sgMzQ0IC0gY2FuZGlkYXRlIHBy
ZXZlbnRzIGFjY2lkZW50YWwgY3VycmVudC1nYW1lIHByb21vdGlvbiBhbmQgY2hlY2tzIGR1cGxp
Y2F0ZXMgYmVmb3JlIGluZGV4CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzAzMzc1CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogaGlzdG9yaWNhbCBtdWx0aS1nYW1lIG93bmVycyBhcmUg
bm90IHJlamVjdGVkIG1lcmVseSBmb3IgaGF2aW5nIGFyY2hpdmVzCm9rIDM0NSAtIGhpc3Rvcmlj
YWwgbXVsdGktZ2FtZSBvd25lcnMgYXJlIG5vdCByZWplY3RlZCBtZXJlbHkgZm9yIGhhdmluZyBh
cmNoaXZlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjg5Njc0NgogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IGN1cnJlbnQgZmxhZyBleGlzdHMgYmVmb3JlIGN1cnJlbnQtb25seSBkdXBs
aWNhdGUgY2hlY2sgYW5kIGlzIG5vdCBhdXRvLXByb21vdGVkCm9rIDM0NiAtIGN1cnJlbnQgZmxh
ZyBleGlzdHMgYmVmb3JlIGN1cnJlbnQtb25seSBkdXBsaWNhdGUgY2hlY2sgYW5kIGlzIG5vdCBh
dXRvLXByb21vdGVkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjI4ODc0CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogYXJjaGl2ZS1mcmllbmRseSBjYW5kaWRhdGUgcmVtYWlucyBibG9j
a2VkIGFuZCBub24tZGVzdHJ1Y3RpdmUKb2sgMzQ3IC0gYXJjaGl2ZS1mcmllbmRseSBjYW5kaWRh
dGUgcmVtYWlucyBibG9ja2VkIGFuZCBub24tZGVzdHJ1Y3RpdmUKICAtLS0KICBkdXJhdGlvbl9t
czogMC4yMzEwOTcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjYW5kaWRhdGUgcmV0
YWlucyB1bmNvbmRpdGlvbmFsIGZhaWwtY2xvc2VkIGd1YXJkIGJlZm9yZSBEREwKb2sgMzQ4IC0g
Y2FuZGlkYXRlIHJldGFpbnMgdW5jb25kaXRpb25hbCBmYWlsLWNsb3NlZCBndWFyZCBiZWZvcmUg
RERMCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNzMwMjE2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogYWxsIHNpeCBzeW5jIGNvbHVtbnMgaGF2ZSBjYXRhbG9nIHR5cGUgYXNzZXJ0aW9u
cyBhZnRlciBhbGlnbm1lbnQgRERMCm9rIDM0OSAtIGFsbCBzaXggc3luYyBjb2x1bW5zIGhhdmUg
Y2F0YWxvZyB0eXBlIGFzc2VydGlvbnMgYWZ0ZXIgYWxpZ25tZW50IERETAogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjMzMTI3NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNyaXRpY2Fs
IGJvb2xlYW4gY29sdW1ucyBtdXN0IGJlIG5vbi1udWxsLCBvcHRpb25hbCBsZWFzZSBtZXRhZGF0
YSBtYXkgYmUgbnVsbApvayAzNTAgLSBjcml0aWNhbCBib29sZWFuIGNvbHVtbnMgbXVzdCBiZSBu
b24tbnVsbCwgb3B0aW9uYWwgbGVhc2UgbWV0YWRhdGEgbWF5IGJlIG51bGwKICAtLS0KICBkdXJh
dGlvbl9tczogMC4xMTQ4MzIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjdXJyZW50
LWdhbWUgaW5kZXggYXVkaXQgY2hlY2tzIGluZGV4IG5hbWVzcGFjZSBpbmRlcGVuZGVudGx5IGZy
b20gdGFibGUgbmFtZXNwYWNlCm9rIDM1MSAtIGN1cnJlbnQtZ2FtZSBpbmRleCBhdWRpdCBjaGVj
a3MgaW5kZXggbmFtZXNwYWNlIGluZGVwZW5kZW50bHkgZnJvbSB0YWJsZSBuYW1lc3BhY2UKICAt
LS0KICBkdXJhdGlvbl9tczogMC43NDIzNjQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBjdXJyZW50LWdhbWUgaW5kZXggYXVkaXQgc3RpbGwgcmVxdWlyZXMgdW5pcXVlIHZhbGlkIHJl
YWR5IG93bmVyLWtleSBwYXJ0aWFsIGluZGV4Cm9rIDM1MiAtIGN1cnJlbnQtZ2FtZSBpbmRleCBh
dWRpdCBzdGlsbCByZXF1aXJlcyB1bmlxdWUgdmFsaWQgcmVhZHkgb3duZXIta2V5IHBhcnRpYWwg
aW5kZXgKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMjcyMDEKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBzY2hlbWEgY2FuZGlkYXRlIHJldGFpbnMgdW5jb25kaXRpb25hbCBub24tZGVw
bG95IGd1YXJkCm9rIDM1MyAtIHNjaGVtYSBjYW5kaWRhdGUgcmV0YWlucyB1bmNvbmRpdGlvbmFs
IG5vbi1kZXBsb3kgZ3VhcmQKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMDM3NTYKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBpbmRleCBuYW1lIHJldXNlIGNhbm5vdCBieXBhc3MgdW5p
cXVlIGluZGV4IGRlZmluaXRpb24gdmVyaWZpY2F0aW9uCm9rIDM1NCAtIGluZGV4IG5hbWUgcmV1
c2UgY2Fubm90IGJ5cGFzcyB1bmlxdWUgaW5kZXggZGVmaW5pdGlvbiB2ZXJpZmljYXRpb24KICAt
LS0KICBkdXJhdGlvbl9tczogMC45MzI3OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IGN1cnJlbnQgZ2FtZSBpbmRleCBwcmVkaWNhdGUgaXMgY2hlY2tlZCwgbm90IGp1c3QgaXRzIG5h
bWUKb2sgMzU1IC0gY3VycmVudCBnYW1lIGluZGV4IHByZWRpY2F0ZSBpcyBjaGVja2VkLCBub3Qg
anVzdCBpdHMgbmFtZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIxNTA5MwogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IGluZGV4IGRlZmluaXRpb24gY2hlY2sgcmVtYWlucyBpbnNpZGUg
Z3VhcmRlZCBhdG9taWMgbWlncmF0aW9uCm9rIDM1NiAtIGluZGV4IGRlZmluaXRpb24gY2hlY2sg
cmVtYWlucyBpbnNpZGUgZ3VhcmRlZCBhdG9taWMgbWlncmF0aW9uCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMTUwOTQ2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYm90aCBndWFyZGVk
IGluZGV4IGNoZWNrcyB2YWxpZGF0ZSBidHJlZSBhY2Nlc3MgbWV0aG9kCm9rIDM1NyAtIGJvdGgg
Z3VhcmRlZCBpbmRleCBjaGVja3MgdmFsaWRhdGUgYnRyZWUgYWNjZXNzIG1ldGhvZAogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjc2MDM3MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGJv
dGggZ3VhcmRlZCBpbmRleCBjaGVja3MgcmVqZWN0IGV4cHJlc3Npb24gYW5kIElOQ0xVREUgaW5k
ZXhlcwpvayAzNTggLSBib3RoIGd1YXJkZWQgaW5kZXggY2hlY2tzIHJlamVjdCBleHByZXNzaW9u
IGFuZCBJTkNMVURFIGluZGV4ZXMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMTk4NQogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVuY29uZGl0aW9uYWwgbm9uLWRlcGxveSBndWFyZCBy
ZW1haW5zIGZpcnN0IFNRTCBzdGF0ZW1lbnQKb2sgMzU5IC0gdW5jb25kaXRpb25hbCBub24tZGVw
bG95IGd1YXJkIHJlbWFpbnMgZmlyc3QgU1FMIHN0YXRlbWVudAogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjIwMjAwNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxlZ2FjeSBpbmRleCBk
cm9wIGlzIHByZWNlZGVkIGJ5IHN0cmljdCBjYXRhbG9nIHNoYXBlIHZlcmlmaWNhdGlvbgpvayAz
NjAgLSBsZWdhY3kgaW5kZXggZHJvcCBpcyBwcmVjZWRlZCBieSBzdHJpY3QgY2F0YWxvZyBzaGFw
ZSB2ZXJpZmljYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC43NjUxMzgKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiBsZWdhY3kgaW5kZXggbXVzdCBiZSB1bmlxdWUgYW5kIHNjb3Bl
ZCB0byBhY3RpdmUgdXNlciBzZXNzaW9ucwpvayAzNjEgLSBsZWdhY3kgaW5kZXggbXVzdCBiZSB1
bmlxdWUgYW5kIHNjb3BlZCB0byBhY3RpdmUgdXNlciBzZXNzaW9ucwogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjE3OTI0OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxlZ2FjeSBpbmRl
eCBkcm9wIHByb3RlY3Rpb24gcmVtYWlucyBmYWlsLWNsb3NlZCBhbmQgYXRvbWljCm9rIDM2MiAt
IGxlZ2FjeSBpbmRleCBkcm9wIHByb3RlY3Rpb24gcmVtYWlucyBmYWlsLWNsb3NlZCBhbmQgYXRv
bWljCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTM2MjM0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogZGVwbG95bWVudCBpbnRlbnRpb25hbGx5IGJsb2NrZWQgdW50aWwgcmVhbCBpbnRl
Z3JhdGlvbiB2ZXJpZmljYXRpb24Kb2sgMzYzIC0gZGVwbG95bWVudCBpbnRlbnRpb25hbGx5IGJs
b2NrZWQgdW50aWwgcmVhbCBpbnRlZ3JhdGlvbiB2ZXJpZmljYXRpb24KICAtLS0KICBkdXJhdGlv
bl9tczogMC44OTgwNDcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBvcGVuIGFuZCBj
b21taXQgcmVxdWlyZSB2YWxpZCBtYXRjaGluZyBTdXBhYmFzZSBBdXRoIHNlc3Npb24Kb2sgMzY0
IC0gb3BlbiBhbmQgY29tbWl0IHJlcXVpcmUgdmFsaWQgbWF0Y2hpbmcgU3VwYWJhc2UgQXV0aCBz
ZXNzaW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjcxNzk4CiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogYm90aCBlbmRwb2ludHMgcmVqZWN0IGJhbm5lZCBvciBkZWxldGVkIGFjY291
bnRzCm9rIDM2NSAtIGJvdGggZW5kcG9pbnRzIHJlamVjdCBiYW5uZWQgb3IgZGVsZXRlZCBhY2Nv
dW50cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIxNDQ1MQogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IHdyaXRlIHJlcXVpcmVzIGRldmljZSB0b2tlbiwgZ2VuZXJhdGlvbiBhbmQgYXV0
aCBzZXNzaW9uIGJpbmRpbmcKb2sgMzY2IC0gd3JpdGUgcmVxdWlyZXMgZGV2aWNlIHRva2VuLCBn
ZW5lcmF0aW9uIGFuZCBhdXRoIHNlc3Npb24gYmluZGluZwogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjEzMTgzOAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbmZsaWN0aW5nIHVwZGF0
ZXMgcHJlc2VydmUgY2xvdWQgc3RhdGUgYW5kIHJlY29yZCBjb25mbGljdApvayAzNjcgLSBjb25m
bGljdGluZyB1cGRhdGVzIHByZXNlcnZlIGNsb3VkIHN0YXRlIGFuZCByZWNvcmQgY29uZmxpY3QK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4xNTY2OTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiB0YWtlb3ZlciByb3RhdGVzIHRva2VuIGFuZCBpbmNyZW1lbnRzIGdlbmVyYXRpb24Kb2sg
MzY4IC0gdGFrZW92ZXIgcm90YXRlcyB0b2tlbiBhbmQgaW5jcmVtZW50cyBnZW5lcmF0aW9uCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMDk4MDg3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogb2xkIGFuZCBuZXcgc2Vzc2lvbnMgc2VyaWFsaXplZCB2aWEgdXNlciByb3cgbG9jawpvayAz
NjkgLSBvbGQgYW5kIG5ldyBzZXNzaW9ucyBzZXJpYWxpemVkIHZpYSB1c2VyIHJvdyBsb2NrCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMDc3Mjk2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogYWxsIHNpeCBwdWJsaWMgUlBDIGVuZHBvaW50cyBhcmUgc2VhcmNoLXBhdGggaGFyZGVuZWQg
YW5kIGV4cGxpY2l0bHkgcmVzdHJpY3RlZApvayAzNzAgLSBhbGwgc2l4IHB1YmxpYyBSUEMgZW5k
cG9pbnRzIGFyZSBzZWFyY2gtcGF0aCBoYXJkZW5lZCBhbmQgZXhwbGljaXRseSByZXN0cmljdGVk
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDUzNjcxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogb2xkZXIgYXV0aCBzZXNzaW9ucyBjYW5ub3QgcmVjbGFpbSBsZWFzZSBhZnRlciBuZXdl
ciBhdXRoIHNlc3Npb24gZXhwaXJlcwpvayAzNzEgLSBvbGRlciBhdXRoIHNlc3Npb25zIGNhbm5v
dCByZWNsYWltIGxlYXNlIGFmdGVyIG5ld2VyIGF1dGggc2Vzc2lvbiBleHBpcmVzCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuMjQxNDAyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcGVl
ayByZWplY3RzIGRpc3BsYWNlZCBvbGRlciBhdXRoIHNlc3Npb25zIGV2ZW4gYWZ0ZXIgbmV3ZXIg
bG9naW4gZXhwaXJlcwpvayAzNzIgLSBwZWVrIHJlamVjdHMgZGlzcGxhY2VkIG9sZGVyIGF1dGgg
c2Vzc2lvbnMgZXZlbiBhZnRlciBuZXdlciBsb2dpbiBleHBpcmVzCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMzAzOTk2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZGVyIGVucm9s
bG1lbnQgdXBkYXRlcyBhdXRoLXNlc3Npb24gaGlnaC13YXRlciB0aW1lc3RhbXAgb24gcmV1c2Vk
IGRldmljZSBJRHMKb2sgMzczIC0gcmVhZGVyIGVucm9sbG1lbnQgdXBkYXRlcyBhdXRoLXNlc3Np
b24gaGlnaC13YXRlciB0aW1lc3RhbXAgb24gcmV1c2VkIGRldmljZSBJRHMKICAtLS0KICBkdXJh
dGlvbl9tczogMC4zMDM0OTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFkZXIg
ZW5yb2xsbWVudCBjYW5ub3Qgb3ZlcndyaXRlIG5ld2VyIEF1dGgtc2Vzc2lvbiBoaWdoLXdhdGVy
IG1hcmsgd2l0aCBvbGRlciBzZXNzaW9uCm9rIDM3NCAtIHJlYWRlciBlbnJvbGxtZW50IGNhbm5v
dCBvdmVyd3JpdGUgbmV3ZXIgQXV0aC1zZXNzaW9uIGhpZ2gtd2F0ZXIgbWFyayB3aXRoIG9sZGVy
IHNlc3Npb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4xMTE2MTgKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiByZWFkIGFuZCBsZWFzZSBzdGF0dXMgcmVqZWN0IGRpc3BsYWNlZCBvbGRl
ciBsb2dpbiB1c2luZyBwZXJzaXN0ZW50IHNlc3Npb24gaGlnaC13YXRlciBtYXJrCm9rIDM3NSAt
IHJlYWQgYW5kIGxlYXNlIHN0YXR1cyByZWplY3QgZGlzcGxhY2VkIG9sZGVyIGxvZ2luIHVzaW5n
IHBlcnNpc3RlbnQgc2Vzc2lvbiBoaWdoLXdhdGVyIG1hcmsKICAtLS0KICBkdXJhdGlvbl9tczog
MC4xMjA5OTIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjb21taXQgcmVqZWN0cyBk
aXNwbGFjZWQgb2xkZXIgbG9naW4gYWZ0ZXIgbmV3ZXIgYXV0aCBzZXNzaW9uIGV4cGlyZXMKb2sg
Mzc2IC0gY29tbWl0IHJlamVjdHMgZGlzcGxhY2VkIG9sZGVyIGxvZ2luIGFmdGVyIG5ld2VyIGF1
dGggc2Vzc2lvbiBleHBpcmVzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMDkyODc5CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogd3JpdGVyIG9wZW4gY2Fubm90IGRvd25ncmFkZSBuZXdl
ciByZWNvcmRlZCBsb2dpbiBvbiByZXVzZWQgZGV2aWNlIGluIG11bHRpLWRldmljZSBtb2RlCm9r
IDM3NyAtIHdyaXRlciBvcGVuIGNhbm5vdCBkb3duZ3JhZGUgbmV3ZXIgcmVjb3JkZWQgbG9naW4g
b24gcmV1c2VkIGRldmljZSBpbiBtdWx0aS1kZXZpY2UgbW9kZQogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjA4MzQ5NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlYWRlciBlbnJvbGxt
ZW50IGNhbm5vdCByZXZva2UgYW4gZXhpc3Rpbmcgd3JpdGVyIGxlYXNlIHVzaW5nIGl0cyBkZXZp
Y2UgSUQKb2sgMzc4IC0gcmVhZGVyIGVucm9sbG1lbnQgY2Fubm90IHJldm9rZSBhbiBleGlzdGlu
ZyB3cml0ZXIgbGVhc2UgdXNpbmcgaXRzIGRldmljZSBJRAogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjEzNTMyMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG9wZW4gcmVqZWN0cyBuZWdh
dGl2ZSBwcmVmbGlnaHQgcmV2aXNpb25zIGJlZm9yZSB3cml0ZXIgcmV2b2NhdGlvbgpvayAzNzkg
LSBvcGVuIHJlamVjdHMgbmVnYXRpdmUgcHJlZmxpZ2h0IHJldmlzaW9ucyBiZWZvcmUgd3JpdGVy
IHJldm9jYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4wNjk5NzUKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBleGlzdGluZyBjbG91ZCBnYW1lIHJlcXVpcmVzIGV4cGxpY2l0IHJl
dmlzaW9uIHByZWZsaWdodCBiZWZvcmUgd3JpdGVyIHRha2VvdmVyCm9rIDM4MCAtIGV4aXN0aW5n
IGNsb3VkIGdhbWUgcmVxdWlyZXMgZXhwbGljaXQgcmV2aXNpb24gcHJlZmxpZ2h0IGJlZm9yZSB3
cml0ZXIgdGFrZW92ZXIKICAtLS0KICBkdXJhdGlvbl9tczogMC4wODk1OTUKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiBzdXBhYmFzZV9zeW5jX3JwY19kcmFmdC5zcWw6IHNlc3Npb24g
b3JkZXJpbmcgaXMgZGV0ZXJtaW5pc3RpYyB3aGVuIHRpbWVzdGFtcHMgdGllCm9rIDM4MSAtIHN1
cGFiYXNlX3N5bmNfcnBjX2RyYWZ0LnNxbDogc2Vzc2lvbiBvcmRlcmluZyBpcyBkZXRlcm1pbmlz
dGljIHdoZW4gdGltZXN0YW1wcyB0aWUKICAtLS0KICBkdXJhdGlvbl9tczogMC44ODEwNTIKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdXBhYmFzZV9zeW5jX3JlYWRvbmx5X2RyYWZ0
LnNxbDogc2Vzc2lvbiBvcmRlcmluZyBpcyBkZXRlcm1pbmlzdGljIHdoZW4gdGltZXN0YW1wcyB0
aWUKb2sgMzgyIC0gc3VwYWJhc2Vfc3luY19yZWFkb25seV9kcmFmdC5zcWw6IHNlc3Npb24gb3Jk
ZXJpbmcgaXMgZGV0ZXJtaW5pc3RpYyB3aGVuIHRpbWVzdGFtcHMgdGllCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuMTc1MzgzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb3BlbiByZWpl
Y3RzIGEgbWlzc2luZyB1c2VyIHJvbGUgZXhwbGljaXRseQpvayAzODMgLSBvcGVuIHJlamVjdHMg
YSBtaXNzaW5nIHVzZXIgcm9sZSBleHBsaWNpdGx5CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTU5
NjMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdGFnZWQgc2VydmVyIHZhbGlkYXRv
ciBjaGVja3MgdGhlIHJlY29yZGVkLWhhbmQgZmllbGRzIGNoZWNrZWQgYnkgSlMKb2sgMzg0IC0g
c3RhZ2VkIHNlcnZlciB2YWxpZGF0b3IgY2hlY2tzIHRoZSByZWNvcmRlZC1oYW5kIGZpZWxkcyBj
aGVja2VkIGJ5IEpTCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODg0NTc3CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogU1FMIHJlamVjdHMgZHVwbGljYXRlIGhpc3RvcmljYWwgc2VhdCB3
aW5kcwpvayAzODUgLSBTUUwgcmVqZWN0cyBkdXBsaWNhdGUgaGlzdG9yaWNhbCBzZWF0IHdpbmRz
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDU0MDUyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogU1FMIGhpc3RvcmljYWwgcGxheWVyIG5hbWVzIGhhdmUgc2FtZSAxMDAtY2hhcmFjdGVy
IGNlaWxpbmcgYXMgY3VycmVudCBuYW1lcwpvayAzODYgLSBTUUwgaGlzdG9yaWNhbCBwbGF5ZXIg
bmFtZXMgaGF2ZSBzYW1lIDEwMC1jaGFyYWN0ZXIgY2VpbGluZyBhcyBjdXJyZW50IG5hbWVzCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMjEwMjM1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogU1FMIHZhbGlkYXRvciByZWplY3RzIG1pc3NpbmcgYW5kIEpTT04tbnVsbCByZXF1aXJlZCBm
aWVsZHMgZXhwbGljaXRseQpvayAzODcgLSBTUUwgdmFsaWRhdG9yIHJlamVjdHMgbWlzc2luZyBh
bmQgSlNPTi1udWxsIHJlcXVpcmVkIGZpZWxkcyBleHBsaWNpdGx5CiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuNjk3NjU4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU1FMIHZhbGlkYXRv
ciByZWplY3RzIHRvcC1sZXZlbCBTUUwgTlVMTCBhbmQgSlNPTiBudWxsCm9rIDM4OCAtIFNRTCB2
YWxpZGF0b3IgcmVqZWN0cyB0b3AtbGV2ZWwgU1FMIE5VTEwgYW5kIEpTT04gbnVsbAogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjIyMjg1NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFNR
TCB2YWxpZGF0b3Igc3RheXMgbm9uZGVwbG95YWJsZSB3aGlsZSBpbnRlZ3JhdGlvbiBpcyBwZW5k
aW5nCm9rIDM4OSAtIFNRTCB2YWxpZGF0b3Igc3RheXMgbm9uZGVwbG95YWJsZSB3aGlsZSBpbnRl
Z3JhdGlvbiBpcyBwZW5kaW5nCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTAxNTMyCiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY2xvdWQgc2NvcmUgdmFsaWRhdG9yIHJlamVjdHMgZnJh
Y3Rpb25hbCBzY29yZXMKb2sgMzkwIC0gY2xvdWQgc2NvcmUgdmFsaWRhdG9yIHJlamVjdHMgZnJh
Y3Rpb25hbCBzY29yZXMKICAtLS0KICBkdXJhdGlvbl9tczogMS4wMjMwNDUKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiBjbG91ZCBzY29yZSB2YWxpZGF0b3IgYm91bmRzIGludGVnZXIg
bWFnbml0dWRlCm9rIDM5MSAtIGNsb3VkIHNjb3JlIHZhbGlkYXRvciBib3VuZHMgaW50ZWdlciBt
YWduaXR1ZGUKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNzc2NDcKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBTUUwgZHJhZnQgcmVtYWlucyBmYWlsLWNsb3NlZCBmb3IgcHJvZHVjdGlv
bgpvayAzOTIgLSBTUUwgZHJhZnQgcmVtYWlucyBmYWlsLWNsb3NlZCBmb3IgcHJvZHVjdGlvbgog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjE1MDM3NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IHNlcnZlciBjaGVja3Mgb3B0aW9uYWwgcm91bmRXaW5kIGlzIGEgd2luZCBpbnRlZ2VyCm9r
IDM5MyAtIHNlcnZlciBjaGVja3Mgb3B0aW9uYWwgcm91bmRXaW5kIGlzIGEgd2luZCBpbnRlZ2Vy
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNzA5MTQ1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogc2VydmVyIGNoZWNrcyBvcHRpb25hbCBzZWF0V2luZHMgY29udGFpbnMgZm91ciBkaXN0
aW5jdCB3aW5kIGludGVnZXJzCm9rIDM5NCAtIHNlcnZlciBjaGVja3Mgb3B0aW9uYWwgc2VhdFdp
bmRzIGNvbnRhaW5zIGZvdXIgZGlzdGluY3Qgd2luZCBpbnRlZ2VycwogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjE2MjAzMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFNRTCByZW1haW5z
IGJsb2NrZWQgZnJvbSBwcm9kdWN0aW9uCm9rIDM5NSAtIFNRTCByZW1haW5zIGJsb2NrZWQgZnJv
bSBwcm9kdWN0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMDk2NjU1CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogYWRtaW4gdW5sb2NrIGRyYWZ0IGNhbm5vdCBiZSBkZXBsb3llZCBh
Y2NpZGVudGFsbHkKb2sgMzk2IC0gYWRtaW4gdW5sb2NrIGRyYWZ0IGNhbm5vdCBiZSBkZXBsb3ll
ZCBhY2NpZGVudGFsbHkKICAtLS0KICBkdXJhdGlvbl9tczogMS4xMDY3CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogYWRtaW4gdW5sb2NrIGRyYWZ0IGNoZWNrcyBhY3RvciwgdGFyZ2V0
IGFuZCBzdGFsZSBiaW5kaW5nIGJlZm9yZSBtdXRhdGlvbgpvayAzOTcgLSBhZG1pbiB1bmxvY2sg
ZHJhZnQgY2hlY2tzIGFjdG9yLCB0YXJnZXQgYW5kIHN0YWxlIGJpbmRpbmcgYmVmb3JlIG11dGF0
aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjI1OTY5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogYWRtaW4gdW5sb2NrIGRyYWZ0IHByZXNlcnZlcyBnYW1lIHJvd3MgYW5kIHJlY29y
ZHMgcmVjb3ZlcnkgYXVkaXQKb2sgMzk4IC0gYWRtaW4gdW5sb2NrIGRyYWZ0IHByZXNlcnZlcyBn
YW1lIHJvd3MgYW5kIHJlY29yZHMgcmVjb3ZlcnkgYXVkaXQKICAtLS0KICBkdXJhdGlvbl9tczog
MC4yNzU0MTMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjb21taXQgZW5mb3JjZXMg
ZGV2aWNlIGJpbmRpbmcgYWZ0ZXIgbXVsdGktZGV2aWNlIHBlcm1pc3Npb24gaXMgcmV2b2tlZApv
ayAzOTkgLSBjb21taXQgZW5mb3JjZXMgZGV2aWNlIGJpbmRpbmcgYWZ0ZXIgbXVsdGktZGV2aWNl
IHBlcm1pc3Npb24gaXMgcmV2b2tlZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjczNzczNwogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbW1pdCBob2xkcyBvd25lciBsb2NrIGJlZm9y
ZSBnYW1lIGxvY2sgYW5kIGd1YXJkZWQgdXBkYXRlCm9rIDQwMCAtIGNvbW1pdCBob2xkcyBvd25l
ciBsb2NrIGJlZm9yZSBnYW1lIGxvY2sgYW5kIGd1YXJkZWQgdXBkYXRlCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDEuMDI5NTM1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29tbWl0IHZl
cmlmaWVzIGV4YWN0IHdyaXRlciB0b2tlbiBnZW5lcmF0aW9uIGFuZCBhdXRoIHNlc3Npb24gYmVm
b3JlIHdyaXRlCm9rIDQwMSAtIGNvbW1pdCB2ZXJpZmllcyBleGFjdCB3cml0ZXIgdG9rZW4gZ2Vu
ZXJhdGlvbiBhbmQgYXV0aCBzZXNzaW9uIGJlZm9yZSB3cml0ZQogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjE5NDcyMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJldmlzaW9uIG1pc21h
dGNoIHJldHVybnMgYmVmb3JlIGdhbWUgdXBkYXRlIGFuZCBpbmNyZW1lbnRzIHJldmlzaW9uIG9u
IHN1Y2Nlc3MKb2sgNDAyIC0gcmV2aXNpb24gbWlzbWF0Y2ggcmV0dXJucyBiZWZvcmUgZ2FtZSB1
cGRhdGUgYW5kIGluY3JlbWVudHMgcmV2aXNpb24gb24gc3VjY2VzcwogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjE3MjQyOAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVuc2FmZSBSUEMg
Z3VhcmQgcHJlY2VkZXMgdHJhbnNhY3Rpb24gYW5kIGFueSBncmFudApvayA0MDMgLSB1bnNhZmUg
UlBDIGd1YXJkIHByZWNlZGVzIHRyYW5zYWN0aW9uIGFuZCBhbnkgZ3JhbnQKICAtLS0KICBkdXJh
dGlvbl9tczogMC43OTIzNjkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiB1bnNhZmUg
UlBDIGd1YXJkIGlzIHVuY29uZGl0aW9uYWwgdG9wLWxldmVsIGV4Y2VwdGlvbgpvayA0MDQgLSB1
bnNhZmUgUlBDIGd1YXJkIGlzIHVuY29uZGl0aW9uYWwgdG9wLWxldmVsIGV4Y2VwdGlvbgogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjQwNDY2NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IGFkbWluIHVubG9jayBkcmFmdCBjb250YWlucyBubyBleGVjdXRhYmxlIGdyYW50Cm9rIDQwNSAt
IGFkbWluIHVubG9jayBkcmFmdCBjb250YWlucyBubyBleGVjdXRhYmxlIGdyYW50CiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuMTY4MzAzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogaW50
ZWdyYXRpb24gZ2F0ZSBjYW5ub3QgYmUgY2xhaW1lZCBmcm9tIHN0YXRpYyBOb2RlIHRlc3RzCm9r
IDQwNiAtIGludGVncmF0aW9uIGdhdGUgY2Fubm90IGJlIGNsYWltZWQgZnJvbSBzdGF0aWMgTm9k
ZSB0ZXN0cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEwNTE1OAogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IGJldGEgcmVqZWN0cyBhbm90aGVyIHdyaXRlciBkZXZpY2UgdW5kZXIgb3du
ZXIgbG9jayBiZWZvcmUgbGVhc2UgcmV2b2NhdGlvbgpvayA0MDcgLSBiZXRhIHJlamVjdHMgYW5v
dGhlciB3cml0ZXIgZGV2aWNlIHVuZGVyIG93bmVyIGxvY2sgYmVmb3JlIGxlYXNlIHJldm9jYXRp
b24KICAtLS0KICBkdXJhdGlvbl9tczogMC44ODI2NDUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBwcm9kdWN0aW9uIGRlcGxveW1lbnQgYW5kIGJyb3dzZXIgY2xvdWQgc3luYyByZW1h
aW4gZGlzYWJsZWQKb2sgNDA4IC0gcHJvZHVjdGlvbiBkZXBsb3ltZW50IGFuZCBicm93c2VyIGNs
b3VkIHN5bmMgcmVtYWluIGRpc2FibGVkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuNDc5MzcKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzaW5nbGUgZGV2aWNlIGJldGEgbXVzdCBub3Qg
YmxvY2sgc2FtZSBkZXZpY2UgYWZ0ZXIgbG9nb3V0IGFuZCBmcmVzaCBsb2dpbgpvayA0MDkgLSBz
aW5nbGUgZGV2aWNlIGJldGEgbXVzdCBub3QgYmxvY2sgc2FtZSBkZXZpY2UgYWZ0ZXIgbG9nb3V0
IGFuZCBmcmVzaCBsb2dpbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjcwNDA0NgogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGRyYWZ0IGFuZCBvYnNvbGV0ZSByZXZpZXcgYm90aCByZWZ1
c2UgZXhlY3V0aW9uIGJlZm9yZSB0cmFuc2FjdGlvbiBvciBEREwKb2sgNDEwIC0gZHJhZnQgYW5k
IG9ic29sZXRlIHJldmlldyBib3RoIHJlZnVzZSBleGVjdXRpb24gYmVmb3JlIHRyYW5zYWN0aW9u
IG9yIERETAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjg5MTQyOAogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IHJldmlldyBvcGVuIGNvbnRyYWN0IGlzIGluY29tcGF0aWJsZSB3aXRoIHBy
b3RlY3RlZCBmb3VyLWFyZ3VtZW50IGRyYWZ0Cm9rIDQxMSAtIHJldmlldyBvcGVuIGNvbnRyYWN0
IGlzIGluY29tcGF0aWJsZSB3aXRoIHByb3RlY3RlZCBmb3VyLWFyZ3VtZW50IGRyYWZ0CiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMTU0ODcyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
ZHJhZnQgcmV0YWlucyBoaWdoLXdhdGVyIGF1dGggc2Vzc2lvbiBhbmQgZXhwZWN0ZWQgY2xvdWQg
aWRlbnRpdHkgY2hlY2tzCm9rIDQxMiAtIGRyYWZ0IHJldGFpbnMgaGlnaC13YXRlciBhdXRoIHNl
c3Npb24gYW5kIGV4cGVjdGVkIGNsb3VkIGlkZW50aXR5IGNoZWNrcwogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjExNzU4NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlIDEzIHBy
ZWZsaWdodCBkZW5pZXMgbWlzc2luZyBlbnZpcm9ubWVudCBhbmQgbmV2ZXIgY29ubmVjdHMKb2sg
NDEzIC0gU3RhZ2UgMTMgcHJlZmxpZ2h0IGRlbmllcyBtaXNzaW5nIGVudmlyb25tZW50IGFuZCBu
ZXZlciBjb25uZWN0cwogIC0tLQogIGR1cmF0aW9uX21zOiAxLjQ5Njc3NwogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlIDEzIHByZWZsaWdodCBhY2NlcHRzIGV4cGxpY2l0IGRp
c3Bvc2FibGUgbG9jYWwgdGFyZ2V0Cm9rIDQxNCAtIFN0YWdlIDEzIHByZWZsaWdodCBhY2NlcHRz
IGV4cGxpY2l0IGRpc3Bvc2FibGUgbG9jYWwgdGFyZ2V0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
ODY0MTg3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTMgcHJlZmxpZ2h0
IGJsb2NrcyBwcm9kdWN0aW9uLW1hcmtlZCB0YXJnZXQKb2sgNDE1IC0gU3RhZ2UgMTMgcHJlZmxp
Z2h0IGJsb2NrcyBwcm9kdWN0aW9uLW1hcmtlZCB0YXJnZXQKICAtLS0KICBkdXJhdGlvbl9tczog
MC44MjczOTIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZSAxMyBwcmVmbGln
aHQgYmxvY2tzIG5vbi1wb3N0Z3JlcyBVUkxzIGFuZCBtaXNzaW5nIGFja25vd2xlZGdtZW50Cm9r
IDQxNiAtIFN0YWdlIDEzIHByZWZsaWdodCBibG9ja3Mgbm9uLXBvc3RncmVzIFVSTHMgYW5kIG1p
c3NpbmcgYWNrbm93bGVkZ21lbnQKICAtLS0KICBkdXJhdGlvbl9tczogMC4zNzQyMTIKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZSAxMyBwcmVmbGlnaHQgcmVqZWN0cyBub24t
ZGlzcG9zYWJsZSBkYXRhYmFzZSBuYW1lcwpvayA0MTcgLSBTdGFnZSAxMyBwcmVmbGlnaHQgcmVq
ZWN0cyBub24tZGlzcG9zYWJsZSBkYXRhYmFzZSBuYW1lcwogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjMzMDM2NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlIDEzIHByZWZsaWdo
dCByZXF1aXJlcyBzZXBhcmF0ZSBhY2tub3dsZWRnbWVudCBmb3IgcmVtb3RlIHRhcmdldHMKb2sg
NDE4IC0gU3RhZ2UgMTMgcHJlZmxpZ2h0IHJlcXVpcmVzIHNlcGFyYXRlIGFja25vd2xlZGdtZW50
IGZvciByZW1vdGUgdGFyZ2V0cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjU0ODIwMgogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlIDEzIHByZWZsaWdodCByZWplY3RzIG1pc3Np
bmcgaXNvbGF0ZWQgY3JlZGVudGlhbHMKb2sgNDE5IC0gU3RhZ2UgMTMgcHJlZmxpZ2h0IHJlamVj
dHMgbWlzc2luZyBpc29sYXRlZCBjcmVkZW50aWFscwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM4
MzIwNQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlIDEzIHByZWZsaWdodCBy
ZWplY3RzIGNvbm5lY3Rpb24gcXVlcnkgb3ZlcnJpZGVzCm9rIDQyMCAtIFN0YWdlIDEzIHByZWZs
aWdodCByZWplY3RzIGNvbm5lY3Rpb24gcXVlcnkgb3ZlcnJpZGVzCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMjQ5MDc0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTMgcHJl
ZmxpZ2h0IHJlamVjdHMgVVJMIGZyYWdtZW50cwpvayA0MjEgLSBTdGFnZSAxMyBwcmVmbGlnaHQg
cmVqZWN0cyBVUkwgZnJhZ21lbnRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDQzMjI1CiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTMgcHJlZmxpZ2h0IHJlamVjdHMgZW5j
b2RlZCBkYXRhYmFzZSBzZXBhcmF0b3JzCm9rIDQyMiAtIFN0YWdlIDEzIHByZWZsaWdodCByZWpl
Y3RzIGVuY29kZWQgZGF0YWJhc2Ugc2VwYXJhdG9ycwogIC0tLQogIGR1cmF0aW9uX21zOiAxLjQz
NjU1NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlIDEzIHByZWZsaWdodCBy
ZWplY3RzIGVuY29kZWQgZG90IHNlZ21lbnRzCm9rIDQyMyAtIFN0YWdlIDEzIHByZWZsaWdodCBy
ZWplY3RzIGVuY29kZWQgZG90IHNlZ21lbnRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTg1NDg5
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTMgcHJlZmxpZ2h0IHJlamVj
dHMgZG91YmxlLWVuY29kZWQgY29udHJvbCBzZXF1ZW5jZXMKb2sgNDI0IC0gU3RhZ2UgMTMgcHJl
ZmxpZ2h0IHJlamVjdHMgZG91YmxlLWVuY29kZWQgY29udHJvbCBzZXF1ZW5jZXMKICAtLS0KICBk
dXJhdGlvbl9tczogMC4xODc0NjEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFn
ZSAxMyBwcmVmbGlnaHQgcmVqZWN0cyBuZXN0ZWQgZGF0YWJhc2UgcGF0aHMKb2sgNDI1IC0gU3Rh
Z2UgMTMgcHJlZmxpZ2h0IHJlamVjdHMgbmVzdGVkIGRhdGFiYXNlIHBhdGhzCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMTM1NTg0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2Ug
MTMgcHJlZmxpZ2h0IHJlamVjdHMgZG91YmxlLXNsYXNoIGRhdGFiYXNlIHBhdGhzCm9rIDQyNiAt
IFN0YWdlIDEzIHByZWZsaWdodCByZWplY3RzIGRvdWJsZS1zbGFzaCBkYXRhYmFzZSBwYXRocwog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjExNDIwMQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IFN0YWdlIDEzIHByZWZsaWdodCByZWplY3RzIGJsYW5rIGNyZWRlbnRpYWxzCm9rIDQyNyAt
IFN0YWdlIDEzIHByZWZsaWdodCByZWplY3RzIGJsYW5rIGNyZWRlbnRpYWxzCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMTEyMDY5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbWFsZm9y
bWVkIHBlcmNlbnQgZW5jb2RlZCBkYXRhYmFzZSBuYW1lIGZhaWxzIGNsb3NlZCB3aXRob3V0IHRo
cm93aW5nCm9rIDQyOCAtIG1hbGZvcm1lZCBwZXJjZW50IGVuY29kZWQgZGF0YWJhc2UgbmFtZSBm
YWlscyBjbG9zZWQgd2l0aG91dCB0aHJvd2luZwogIC0tLQogIGR1cmF0aW9uX21zOiAxLjI0NzI1
MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHZhbGlkIGRpc3Bvc2FibGUgcGF0aCBy
ZW1haW5zIGFjY2VwdGVkIGJ5IHJlYWQtb25seSBwcmVmbGlnaHQKb2sgNDI5IC0gdmFsaWQgZGlz
cG9zYWJsZSBwYXRoIHJlbWFpbnMgYWNjZXB0ZWQgYnkgcmVhZC1vbmx5IHByZWZsaWdodAogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjM5OTQ0OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IHJlamVjdHMgVVJMIGNyZWRlbnRpYWxzIGNvbnRhaW5pbmcgZW5jb2RlZCBjb250cm9sIGNoYXJh
Y3RlcnMKb2sgNDMwIC0gcmVqZWN0cyBVUkwgY3JlZGVudGlhbHMgY29udGFpbmluZyBlbmNvZGVk
IGNvbnRyb2wgY2hhcmFjdGVycwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIxMDg1NwogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHBhcmFsbGVsIFBvc3RncmVTUUwgdGVzdCBwbGFuIGV4
cGxpY2l0bHkgZm9yYmlkcyBwcm9kdWN0aW9uIGFuZCByZXF1aXJlcyBkaXNwb3NhYmxlIGRhdGFi
YXNlCm9rIDQzMSAtIHBhcmFsbGVsIFBvc3RncmVTUUwgdGVzdCBwbGFuIGV4cGxpY2l0bHkgZm9y
YmlkcyBwcm9kdWN0aW9uIGFuZCByZXF1aXJlcyBkaXNwb3NhYmxlIGRhdGFiYXNlCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDEuMTUxNTg4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcGFy
YWxsZWwgcGxhbiBjb3ZlcnMgY29tcGV0aW5nIGNvbW1pdHMgYW5kIHN0YWxlIHJldmlzaW9uIHJl
amVjdGlvbgpvayA0MzIgLSBwYXJhbGxlbCBwbGFuIGNvdmVycyBjb21wZXRpbmcgY29tbWl0cyBh
bmQgc3RhbGUgcmV2aXNpb24gcmVqZWN0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzE5NzgK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBwYXJhbGxlbCBwbGFuIGNvdmVycyBkaXNw
bGFjZWQgc2Vzc2lvbiBhbmQgcm9sbGJhY2sgd2l0aG91dCByZWx5aW5nIG9uIHN0YXRpYyB0ZXN0
cwpvayA0MzMgLSBwYXJhbGxlbCBwbGFuIGNvdmVycyBkaXNwbGFjZWQgc2Vzc2lvbiBhbmQgcm9s
bGJhY2sgd2l0aG91dCByZWx5aW5nIG9uIHN0YXRpYyB0ZXN0cwogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjIwMDM1MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpbmdsZS1kZXZpY2Ug
YmV0YSBiaW5kcyB0byByZWdpc3RlcmVkIGRldmljZSBldmVuIGFmdGVyIGxvZ291dApvayA0MzQg
LSBzaW5nbGUtZGV2aWNlIGJldGEgYmluZHMgdG8gcmVnaXN0ZXJlZCBkZXZpY2UgZXZlbiBhZnRl
ciBsb2dvdXQKICAtLS0KICBkdXJhdGlvbl9tczogMC44MjcwNDEKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBkZXZpY2UgYmluZGluZyBvY2N1cnMgdW5kZXIgYWNjb3VudCBsb2NrIGJl
Zm9yZSBjbG91ZCBzdGF0ZSBtdXRhdGlvbgpvayA0MzUgLSBkZXZpY2UgYmluZGluZyBvY2N1cnMg
dW5kZXIgYWNjb3VudCBsb2NrIGJlZm9yZSBjbG91ZCBzdGF0ZSBtdXRhdGlvbgogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjE5MjEwOAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG5ldyBi
ZXRhIGd1YXJkIGlzIG5vdCBkZXBsb3lhYmxlIG9yIGFjdGl2ZSBpbiBicm93c2VyCm9rIDQzNiAt
IG5ldyBiZXRhIGd1YXJkIGlzIG5vdCBkZXBsb3lhYmxlIG9yIGFjdGl2ZSBpbiBicm93c2VyCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDEuNDk2NzI2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogaGlzdG9yaWNhbCBkZXZpY2UgbG9jayBvbmx5IGNvbnNpZGVycyBkZXZpY2VzIHRoYXQgaGF2
ZSBoZWxkIHdyaXRlciByaWdodHMKb2sgNDM3IC0gaGlzdG9yaWNhbCBkZXZpY2UgbG9jayBvbmx5
IGNvbnNpZGVycyBkZXZpY2VzIHRoYXQgaGF2ZSBoZWxkIHdyaXRlciByaWdodHMKICAtLS0KICBk
dXJhdGlvbl9tczogMC43Mzk1OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlYWRl
ciBlbnJvbGxtZW50IGNhbm5vdCBwcm9tb3RlIGl0c2VsZiBpbnRvIGEgcGVybWFuZW50IHdyaXRl
ciBiaW5kaW5nCm9rIDQzOCAtIHJlYWRlciBlbnJvbGxtZW50IGNhbm5vdCBwcm9tb3RlIGl0c2Vs
ZiBpbnRvIGEgcGVybWFuZW50IHdyaXRlciBiaW5kaW5nCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MjM0ODgyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTM6IGRyYWZ0IFNR
TCByZW1haW5zIGZhaWwtY2xvc2VkIGJlZm9yZSB0cmFuc2FjdGlvbgpvayA0MzkgLSBTdGFnZSAx
MzogZHJhZnQgU1FMIHJlbWFpbnMgZmFpbC1jbG9zZWQgYmVmb3JlIHRyYW5zYWN0aW9uCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuNzg4NDEzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
U3RhZ2UgMTM6IHBsYW4gcmVxdWlyZXMgZGlzcG9zYWJsZSBkYXRhYmFzZSBhbmQgU3VwYWJhc2Ug
QXV0aCBmaXh0dXJlcwpvayA0NDAgLSBTdGFnZSAxMzogcGxhbiByZXF1aXJlcyBkaXNwb3NhYmxl
IGRhdGFiYXNlIGFuZCBTdXBhYmFzZSBBdXRoIGZpeHR1cmVzCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMzQ0OTI3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTM6IGFsbCBr
ZXkgUlBDIGRlZmluaXRpb25zIHJlbWFpbiBwcmVzZW50IGZvciBmdXR1cmUgaW50ZWdyYXRpb24K
b2sgNDQxIC0gU3RhZ2UgMTM6IGFsbCBrZXkgUlBDIGRlZmluaXRpb25zIHJlbWFpbiBwcmVzZW50
IGZvciBmdXR1cmUgaW50ZWdyYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4xNjU5MTkKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFkLW9ubHkgcHJlZmxpZ2h0IGNvbnRhaW5z
IG5vIFNRTCBtdXRhdGlvbiBvciBwcml2aWxlZ2UtY2hhbmdpbmcgY29tbWFuZHMKb2sgNDQyIC0g
cmVhZC1vbmx5IHByZWZsaWdodCBjb250YWlucyBubyBTUUwgbXV0YXRpb24gb3IgcHJpdmlsZWdl
LWNoYW5naW5nIGNvbW1hbmRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMzM3MDM2CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZC1vbmx5IHByZWZsaWdodCBlbnVtZXJhdGVzIHJl
cXVpcmVkIHRhYmxlcyBhbmQgYWxsIHNpeCBSUEMgZW50cnlwb2ludHMKb2sgNDQzIC0gcmVhZC1v
bmx5IHByZWZsaWdodCBlbnVtZXJhdGVzIHJlcXVpcmVkIHRhYmxlcyBhbmQgYWxsIHNpeCBSUEMg
ZW50cnlwb2ludHMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xOTM0NQogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IFJQQyBkcmFmdCByZW1haW5zIGV4cGxpY2l0bHkgYmxvY2tlZCBmcm9t
IGFjY2lkZW50YWwgZGVwbG95bWVudApvayA0NDQgLSBSUEMgZHJhZnQgcmVtYWlucyBleHBsaWNp
dGx5IGJsb2NrZWQgZnJvbSBhY2NpZGVudGFsIGRlcGxveW1lbnQKICAtLS0KICBkdXJhdGlvbl9t
czogMC4yMTIyODkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFkLW9ubHkgaW52
ZW50b3J5IGxpc3RzIGV4YWN0bHkgc2l4IHN5bmMgUlBDIG5hbWVzCm9rIDQ0NSAtIHJlYWQtb25s
eSBpbnZlbnRvcnkgbGlzdHMgZXhhY3RseSBzaXggc3luYyBSUEMgbmFtZXMKICAtLS0KICBkdXJh
dGlvbl9tczogMC44NTQ3MjMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBSUEMgaW52
ZW50b3J5IGNoZWNrcyBlZmZlY3RpdmUgYW5vbiBhbmQgYXV0aGVudGljYXRlZCBFWEVDVVRFIHJp
Z2h0cwpvayA0NDYgLSBSUEMgaW52ZW50b3J5IGNoZWNrcyBlZmZlY3RpdmUgYW5vbiBhbmQgYXV0
aGVudGljYXRlZCBFWEVDVVRFIHJpZ2h0cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE1NzYxNwog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFJQQyBpbnZlbnRvcnkgcmVjb3JkcyBzZWN1
cml0eSBkZWZpbmVyIHN0YXR1cyB3aXRob3V0IHdyaXRpbmcKb2sgNDQ3IC0gUlBDIGludmVudG9y
eSByZWNvcmRzIHNlY3VyaXR5IGRlZmluZXIgc3RhdHVzIHdpdGhvdXQgd3JpdGluZwogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjM2NDY2NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFJQ
QyBpbnZlbnRvcnkgaW5jbHVkZXMgYWxsIHNpeCBzeW5jIGVudHJ5IHBvaW50cwpvayA0NDggLSBS
UEMgaW52ZW50b3J5IGluY2x1ZGVzIGFsbCBzaXggc3luYyBlbnRyeSBwb2ludHMKICAtLS0KICBk
dXJhdGlvbl9tczogMC43MTE0MDgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBSUEMg
aW52ZW50b3J5IHJlcG9ydHMgYW5vbnltb3VzIGFuZCBhdXRoZW50aWNhdGVkIGV4ZWN1dGUgcHJp
dmlsZWdlcwpvayA0NDkgLSBSUEMgaW52ZW50b3J5IHJlcG9ydHMgYW5vbnltb3VzIGFuZCBhdXRo
ZW50aWNhdGVkIGV4ZWN1dGUgcHJpdmlsZWdlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjExMjgy
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogUlBDIGludmVudG9yeSBpZGVudGlmaWVz
IFNFQ1VSSVRZIERFRklORVIgc3RhdHVzIGFuZCBleGFjdCBzaWduYXR1cmVzCm9rIDQ1MCAtIFJQ
QyBpbnZlbnRvcnkgaWRlbnRpZmllcyBTRUNVUklUWSBERUZJTkVSIHN0YXR1cyBhbmQgZXhhY3Qg
c2lnbmF0dXJlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE0NDAxNwogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IHdyaXRlciBjb21taXQgYmluZHMgdG9rZW4sIGdlbmVyYXRpb24sIGF1
dGggc2Vzc2lvbiBhbmQgZ2FtZSB3cml0ZXIgbGVhc2UKb2sgNDUxIC0gd3JpdGVyIGNvbW1pdCBi
aW5kcyB0b2tlbiwgZ2VuZXJhdGlvbiwgYXV0aCBzZXNzaW9uIGFuZCBnYW1lIHdyaXRlciBsZWFz
ZQogIC0tLQogIGR1cmF0aW9uX21zOiAxLjA3MTg5OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IGNvbW1pdCByZWplY3RzIGRpc3BsYWNlZCBsb2dpbiBldmVuIGFmdGVyIG5ld2VyIGF1
dGggc2Vzc2lvbiBkaXNhcHBlYXJzCm9rIDQ1MiAtIGNvbW1pdCByZWplY3RzIGRpc3BsYWNlZCBs
b2dpbiBldmVuIGFmdGVyIG5ld2VyIGF1dGggc2Vzc2lvbiBkaXNhcHBlYXJzCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMjI3MjUxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbGVhc2Ug
c3RhdHVzIHJlZnVzZXMgcmV2b2tlZCBhbmQgZGlzcGxhY2VkIHNlc3Npb25zCm9rIDQ1MyAtIGxl
YXNlIHN0YXR1cyByZWZ1c2VzIHJldm9rZWQgYW5kIGRpc3BsYWNlZCBzZXNzaW9ucwogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjE2NDIwNwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNv
bW1pdCBzZXJpYWxpemVzIG93bmVyIGJlZm9yZSBsb2NraW5nIGN1cnJlbnQgZ2FtZQpvayA0NTQg
LSBjb21taXQgc2VyaWFsaXplcyBvd25lciBiZWZvcmUgbG9ja2luZyBjdXJyZW50IGdhbWUKICAt
LS0KICBkdXJhdGlvbl9tczogMC45NDExNjIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBjb21taXQgdmFsaWRhdGVzIHdyaXRlciBsZWFzZSBhbmQgcmV2aXNpb24gYmVmb3JlIGNoYW5n
aW5nIGdhbWUgZGF0YQpvayA0NTUgLSBjb21taXQgdmFsaWRhdGVzIHdyaXRlciBsZWFzZSBhbmQg
cmV2aXNpb24gYmVmb3JlIGNoYW5naW5nIGdhbWUgZGF0YQogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjE0NDI0NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbW1pdCByZWplY3RzIHN0
YWxlIHJldmlzaW9ucyBhbmQgcmVjb3JkcyBjb25mbGljdHMgd2l0aG91dCBvdmVyd3JpdGluZyBz
Y29yZQpvayA0NTYgLSBjb21taXQgcmVqZWN0cyBzdGFsZSByZXZpc2lvbnMgYW5kIHJlY29yZHMg
Y29uZmxpY3RzIHdpdGhvdXQgb3ZlcndyaXRpbmcgc2NvcmUKICAtLS0KICBkdXJhdGlvbl9tczog
MC4xNDYwNTkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhZG1pbiB1bmxvY2sgcmVm
dXNlcyB0YXJnZXQgYWRtaW4gYW5kIHNlbGYgdW5sb2NrCm9rIDQ1NyAtIGFkbWluIHVubG9jayBy
ZWZ1c2VzIHRhcmdldCBhZG1pbiBhbmQgc2VsZiB1bmxvY2sKICAtLS0KICBkdXJhdGlvbl9tczog
MC43NTYwNTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiB1bmxvY2sgc2VyaWFsaXpl
cyB0YXJnZXQgd3JpdGVyIGJpbmRpbmcgYmVmb3JlIGNoZWNraW5nIGFuZCByZXZva2luZwpvayA0
NTggLSB1bmxvY2sgc2VyaWFsaXplcyB0YXJnZXQgd3JpdGVyIGJpbmRpbmcgYmVmb3JlIGNoZWNr
aW5nIGFuZCByZXZva2luZwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE2MjMwNAogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVubG9jayBpcyBmYWlsLWNsb3NlZCBmb3IgYW1iaWd1b3Vz
IHdyaXRlciBiaW5kaW5nIGFuZCBkb2VzIG5vdCBkZWxldGUgZ2FtZSBzdGF0ZQpvayA0NTkgLSB1
bmxvY2sgaXMgZmFpbC1jbG9zZWQgZm9yIGFtYmlndW91cyB3cml0ZXIgYmluZGluZyBhbmQgZG9l
cyBub3QgZGVsZXRlIGdhbWUgc3RhdGUKICAtLS0KICBkdXJhdGlvbl9tczogMC4zNzI3OQogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVubG9jayBTUUwgY2Fubm90IHJ1biBhY2NpZGVu
dGFsbHkgYW5kIGxhY2tzIGV4ZWN1dGUgZ3JhbnRzCm9rIDQ2MCAtIHVubG9jayBTUUwgY2Fubm90
IHJ1biBhY2NpZGVudGFsbHkgYW5kIGxhY2tzIGV4ZWN1dGUgZ3JhbnRzCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuMjMyOTE5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogdW5sb2NrIGFu
ZCB3cml0ZXItb3BlbiBzZXJpYWxpemUgb24gdGhlIHNhbWUgYWNjb3VudCByb3cKb2sgNDYxIC0g
dW5sb2NrIGFuZCB3cml0ZXItb3BlbiBzZXJpYWxpemUgb24gdGhlIHNhbWUgYWNjb3VudCByb3cK
ICAtLS0KICBkdXJhdGlvbl9tczogMC45NTM1OTEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiB1bmxvY2sgcHJlc2VydmVzIGF1dGggbG9naW4gaGlnaC13YXRlciBjaGVja2VkIGJ5IG9w
ZW4gYW5kIGNvbW1pdApvayA0NjIgLSB1bmxvY2sgcHJlc2VydmVzIGF1dGggbG9naW4gaGlnaC13
YXRlciBjaGVja2VkIGJ5IG9wZW4gYW5kIGNvbW1pdAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI2
NDk1OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJldm9rZWQgd3JpdGVyIGNhbm5v
dCBjb21taXQgd2l0aG91dCBhY3RpdmUgd3JpdGVyLCB2YWxpZCB0b2tlbiwgZ2VuZXJhdGlvbiBh
bmQgYXV0aCBzZXNzaW9uCm9rIDQ2MyAtIHJldm9rZWQgd3JpdGVyIGNhbm5vdCBjb21taXQgd2l0
aG91dCBhY3RpdmUgd3JpdGVyLCB2YWxpZCB0b2tlbiwgZ2VuZXJhdGlvbiBhbmQgYXV0aCBzZXNz
aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzA4NzkzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogYWRtaW4gdW5sb2NrIGhhcyBubyBwcm9kdWN0aW9uIGdyYW50IGFuZCBjYW5ub3Qg
bW9kaWZ5IGdhbWUgZGF0YQpvayA0NjQgLSBhZG1pbiB1bmxvY2sgaGFzIG5vIHByb2R1Y3Rpb24g
Z3JhbnQgYW5kIGNhbm5vdCBtb2RpZnkgZ2FtZSBkYXRhCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
NDgwOTQyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWRtaW4gdW5sb2NrIHJldm9r
ZXMgd3JpdGVyIGNyZWRlbnRpYWxzIGF0b21pY2FsbHkKb2sgNDY1IC0gYWRtaW4gdW5sb2NrIHJl
dm9rZXMgd3JpdGVyIGNyZWRlbnRpYWxzIGF0b21pY2FsbHkKICAtLS0KICBkdXJhdGlvbl9tczog
MC45NzYwODUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhZG1pbiB1bmxvY2sgcHJl
c2VydmVzIHNlc3Npb24gaGlzdG9yeSBmb3Igc3RhbGUtbG9naW4gcmVqZWN0aW9uCm9rIDQ2NiAt
IGFkbWluIHVubG9jayBwcmVzZXJ2ZXMgc2Vzc2lvbiBoaXN0b3J5IGZvciBzdGFsZS1sb2dpbiBy
ZWplY3Rpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4zNTE3OTgKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBydW50aW1lIGdhdGUgcmVtYWlucyBleHBsaWNpdGx5IE5PVCBFWEVDVVRF
RApvayA0NjcgLSBydW50aW1lIGdhdGUgcmVtYWlucyBleHBsaWNpdGx5IE5PVCBFWEVDVVRFRAog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjY0NjI0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogcnVudGltZSBnYXRlIHJlcXVpcmVzIGRpc3Bvc2FibGUgZGF0YWJhc2UgYW5kIGF1dGgtc2Vz
c2lvbiBmaXh0dXJlcwpvayA0NjggLSBydW50aW1lIGdhdGUgcmVxdWlyZXMgZGlzcG9zYWJsZSBk
YXRhYmFzZSBhbmQgYXV0aC1zZXNzaW9uIGZpeHR1cmVzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MTIyMDYzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogdW5sb2NrIGF1ZGl0IGlzIGFw
cGVuZC1vbmx5IGFuZCBwcmVzZXJ2ZXMgZ2FtZSBzdGF0ZQpvayA0NjkgLSB1bmxvY2sgYXVkaXQg
aXMgYXBwZW5kLW9ubHkgYW5kIHByZXNlcnZlcyBnYW1lIHN0YXRlCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMjU3NjY3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogdW5sb2NrIGFuZCBS
UEMgZHJhZnRzIHJlbWFpbiBpbnRlbnRpb25hbGx5IGJsb2NrZWQKb2sgNDcwIC0gdW5sb2NrIGFu
ZCBSUEMgZHJhZnRzIHJlbWFpbiBpbnRlbnRpb25hbGx5IGJsb2NrZWQKICAtLS0KICBkdXJhdGlv
bl9tczogMC4xNjQ2NjcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBvcGVuIG1hcHMg
ZGV2aWNlIGFuZCBnYW1lIHRvIG5hbWVkIFJQQyBhcmd1bWVudHMKb2sgNDcxIC0gb3BlbiBtYXBz
IGRldmljZSBhbmQgZ2FtZSB0byBuYW1lZCBSUEMgYXJndW1lbnRzCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDEuNjAwMjAyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29tbWl0IG1hcHMg
Z2VuZXJhdGlvbiB0b2tlbiByZXZpc2lvbiBhbmQgZ2FtZSBleGFjdGx5Cm9rIDQ3MiAtIGNvbW1p
dCBtYXBzIGdlbmVyYXRpb24gdG9rZW4gcmV2aXNpb24gYW5kIGdhbWUgZXhhY3RseQogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjMzNzQ1NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHBl
cm1pc3Npb24gZXJyb3IgcmV0YWlucyBTdXBhYmFzZSBjb2RlCm9rIDQ3MyAtIHBlcm1pc3Npb24g
ZXJyb3IgcmV0YWlucyBTdXBhYmFzZSBjb2RlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDQ1NjU5
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbWFsZm9ybWVkIHNlcnZlciByZXNwb25z
ZSBpcyByZWplY3RlZApvayA0NzQgLSBtYWxmb3JtZWQgc2VydmVyIHJlc3BvbnNlIGlzIHJlamVj
dGVkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMTQ1MDI5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogbm8gbmV0d29yayByZXF1ZXN0IG9uIG1pc3NpbmcgY29tbWl0IGNyZWRlbnRpYWxz
Cm9rIDQ3NSAtIG5vIG5ldHdvcmsgcmVxdWVzdCBvbiBtaXNzaW5nIGNvbW1pdCBjcmVkZW50aWFs
cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIyMjI3MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IG9wZW4gc25hcHNob3RzIGdhbWUgYmVmb3JlIGFzeW5jaHJvbm91cyB0cmFuc3BvcnQg
dXNlcyBpdApvayA0NzYgLSBvcGVuIHNuYXBzaG90cyBnYW1lIGJlZm9yZSBhc3luY2hyb25vdXMg
dHJhbnNwb3J0IHVzZXMgaXQKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNjk4MjQKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjb21taXQgc25hcHNob3RzIGdhbWUgYW5kIHJlZnVzZXMg
bm9uLW9iamVjdCBwYXlsb2FkIGJlZm9yZSBuZXR3b3JrIGNhbGwKb2sgNDc3IC0gY29tbWl0IHNu
YXBzaG90cyBnYW1lIGFuZCByZWZ1c2VzIG5vbi1vYmplY3QgcGF5bG9hZCBiZWZvcmUgbmV0d29y
ayBjYWxsCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzEzODMxCiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogY2xvdWQgYWRvcHRpb24gcmVxdWlyZXMgbWF0Y2hpbmcgZ2FtZSBpZGVudGl0
eSBhbmQgcmV2aXNpb24gYmVmb3JlIFJQQwpvayA0NzggLSBjbG91ZCBhZG9wdGlvbiByZXF1aXJl
cyBtYXRjaGluZyBnYW1lIGlkZW50aXR5IGFuZCByZXZpc2lvbiBiZWZvcmUgUlBDCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuMTcxMTY3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY2xv
dWQgYWRvcHRpb24gZm9yd2FyZHMgYm90aCBleHBlY3RlZCBnYW1lIGlkZW50aXR5IGFuZCByZXZp
c2lvbgpvayA0NzkgLSBjbG91ZCBhZG9wdGlvbiBmb3J3YXJkcyBib3RoIGV4cGVjdGVkIGdhbWUg
aWRlbnRpdHkgYW5kIHJldmlzaW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzgzMTM1CiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZC1vbmx5IHNlc3Npb24gZmV0Y2ggbWFwcyBk
ZXZpY2UgSUQgdG8gbWFoam9uZ19zeW5jX3JlYWQKb2sgNDgwIC0gcmVhZC1vbmx5IHNlc3Npb24g
ZmV0Y2ggbWFwcyBkZXZpY2UgSUQgdG8gbWFoam9uZ19zeW5jX3JlYWQKICAtLS0KICBkdXJhdGlv
bl9tczogMC40MzExMjYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFkIHJlZnVz
ZXMgYWJzZW50IGRldmljZSBJRCBiZWZvcmUgbmV0d29yayBhY2Nlc3MKb2sgNDgxIC0gcmVhZCBy
ZWZ1c2VzIGFic2VudCBkZXZpY2UgSUQgYmVmb3JlIG5ldHdvcmsgYWNjZXNzCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMTgzNzY1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbGVhc2Ug
cHJvYmUgbWFwcyBpZGVudGl0eSBhbmQgZ2VuZXJhdGlvbiB3aXRob3V0IHdyaXRlciBjcmVkZW50
aWFscwpvayA0ODIgLSBsZWFzZSBwcm9iZSBtYXBzIGlkZW50aXR5IGFuZCBnZW5lcmF0aW9uIHdp
dGhvdXQgd3JpdGVyIGNyZWRlbnRpYWxzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTY5Mjg0CiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbGVhc2UgcHJvYmUgcmVqZWN0cyBtYWxmb3Jt
ZWQgZ2VuZXJhdGlvbiBiZWZvcmUgUlBDCm9rIDQ4MyAtIGxlYXNlIHByb2JlIHJlamVjdHMgbWFs
Zm9ybWVkIGdlbmVyYXRpb24gYmVmb3JlIFJQQwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE3Mjkx
OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNlcnZlciBjaGVja3MgY2xvdWQgbWlz
bWF0Y2ggYmVmb3JlIHJldm9raW5nIHByZXZpb3VzIHdyaXRlcgpvayA0ODQgLSBzZXJ2ZXIgY2hl
Y2tzIGNsb3VkIG1pc21hdGNoIGJlZm9yZSByZXZva2luZyBwcmV2aW91cyB3cml0ZXIKICAtLS0K
ICBkdXJhdGlvbl9tczogMC45NzcyNDYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiB1
bnNhZmUgZHJhZnQgcmVtYWlucyBibG9ja2VkIGZyb20gcHJvZHVjdGlvbiBkZXBsb3ltZW50Cm9r
IDQ4NSAtIHVuc2FmZSBkcmFmdCByZW1haW5zIGJsb2NrZWQgZnJvbSBwcm9kdWN0aW9uIGRlcGxv
eW1lbnQKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNjkzMTQKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiB3cml0ZXIgdGFrZW92ZXIgaW52YWxpZGF0ZXMgZGlzcGxhY2VkIGRldmljZSBj
cmVkZW50aWFsIGhhc2hlcwpvayA0ODYgLSB3cml0ZXIgdGFrZW92ZXIgaW52YWxpZGF0ZXMgZGlz
cGxhY2VkIGRldmljZSBjcmVkZW50aWFsIGhhc2hlcwogIC0tLQogIGR1cmF0aW9uX21zOiAxLjE2
ODA5MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlYWQtb25seSBlbnJvbGxtZW50
IG5ldmVyIHJlY2VpdmVzIGEgd3JpdGVyIGNyZWRlbnRpYWwKb2sgNDg3IC0gcmVhZC1vbmx5IGVu
cm9sbG1lbnQgbmV2ZXIgcmVjZWl2ZXMgYSB3cml0ZXIgY3JlZGVudGlhbAogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjIwNjkwMQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFkYXB0ZXIg
YW5kIGVuZ2luZSBwZXJmb3JtIG9wZW4sIHNjb3JlIGNvbW1pdCwgcmV2aXNpb24gaW5jcmVtZW50
Cm9rIDQ4OCAtIGFkYXB0ZXIgYW5kIGVuZ2luZSBwZXJmb3JtIG9wZW4sIHNjb3JlIGNvbW1pdCwg
cmV2aXNpb24gaW5jcmVtZW50CiAgLS0tCiAgZHVyYXRpb25fbXM6IDMuMzA1ODIxCiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogZGV2aWNlIHRha2VvdmVyIHJldm9rZXMgcHJldmlvdXMg
d3JpdGVyIGFuZCBwcmVzZXJ2ZXMgaXRzIHVuY29tbWl0dGVkIHNjb3JlCm9rIDQ4OSAtIGRldmlj
ZSB0YWtlb3ZlciByZXZva2VzIHByZXZpb3VzIHdyaXRlciBhbmQgcHJlc2VydmVzIGl0cyB1bmNv
bW1pdHRlZCBzY29yZQogIC0tLQogIGR1cmF0aW9uX21zOiAxLjYyMTA5MwogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IG5ldyBkZXZpY2Ugd2l0aCBkaWZmZXJlbnQgbG9jYWwgZ2FtZSBh
ZG9wdHMgYXV0aG9yaXRhdGl2ZSBjbG91ZCBhbmQgcmV0YWlucyBiYWNrdXAKb2sgNDkwIC0gbmV3
IGRldmljZSB3aXRoIGRpZmZlcmVudCBsb2NhbCBnYW1lIGFkb3B0cyBhdXRob3JpdGF0aXZlIGNs
b3VkIGFuZCByZXRhaW5zIGJhY2t1cAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjczNzcyNwogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN5bmMgb3BlbiByZWplY3RzIHVuc2FmZSBpbnRl
Z2VyIGluIG5lc3RlZCBzY29yZSB3aXRob3V0IFJQQwpvayA0OTEgLSBzeW5jIG9wZW4gcmVqZWN0
cyB1bnNhZmUgaW50ZWdlciBpbiBuZXN0ZWQgc2NvcmUgd2l0aG91dCBSUEMKICAtLS0KICBkdXJh
dGlvbl9tczogMS43NjgyOTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzeW5jIGNv
bW1pdCByZWplY3RzIHVuc2FmZSBuZWdhdGl2ZSBpbnRlZ2VyIGluIGhpc3Rvcnkgd2l0aG91dCBS
UEMKb2sgNDkyIC0gc3luYyBjb21taXQgcmVqZWN0cyB1bnNhZmUgbmVnYXRpdmUgaW50ZWdlciBp
biBoaXN0b3J5IHdpdGhvdXQgUlBDCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjI0NzI3CiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3luYyBvcGVuIHByZXNlcnZlcyBzYWZlIGludGVn
ZXIgYm91bmRhcnkgYW5kIGZyYWN0aW9uYWwgdmFsdWVzCm9rIDQ5MyAtIHN5bmMgb3BlbiBwcmVz
ZXJ2ZXMgc2FmZSBpbnRlZ2VyIGJvdW5kYXJ5IGFuZCBmcmFjdGlvbmFsIHZhbHVlcwogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjU3MzQyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogVW5k
byByZXN0b3JlcyBzY29yZXMsIGRlYWxlciwgcm91bmQsIGFuZCB3aW5kcyBhbmQga2VlcHMgb2xk
ZXIgaGlzdG9yeQpvayA0OTQgLSBVbmRvIHJlc3RvcmVzIHNjb3JlcywgZGVhbGVyLCByb3VuZCwg
YW5kIHdpbmRzIGFuZCBrZWVwcyBvbGRlciBoaXN0b3J5CiAgLS0tCiAgZHVyYXRpb25fbXM6IDIu
MjI5MjU1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogVW5kbyBmYWlsZWQgc2F2ZSBy
ZXN0b3JlcyBlbnRpcmUgc3RhdGUKb2sgNDk1IC0gVW5kbyBmYWlsZWQgc2F2ZSByZXN0b3JlcyBl
bnRpcmUgc3RhdGUKICAtLS0KICBkdXJhdGlvbl9tczogMC43MzAzMzYKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBVbmRvIG1pc3NpbmcgYmVmb3JlIGRvZXMgbm90IGNoYW5nZSBzdGF0
ZQpvayA0OTYgLSBVbmRvIG1pc3NpbmcgYmVmb3JlIGRvZXMgbm90IGNoYW5nZSBzdGF0ZQogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjY1OTcxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
VW5kbyBtYWxmb3JtZWQgYmVmb3JlIGRvZXMgbm90IGNoYW5nZSBzdGF0ZQpvayA0OTcgLSBVbmRv
IG1hbGZvcm1lZCBiZWZvcmUgZG9lcyBub3QgY2hhbmdlIHN0YXRlCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDEuMzM2MDA1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogVW5kbyBtaXNzaW5n
IGRlYWxlciBkb2VzIG5vdCBjaGFuZ2Ugc3RhdGUKb2sgNDk4IC0gVW5kbyBtaXNzaW5nIGRlYWxl
ciBkb2VzIG5vdCBjaGFuZ2Ugc3RhdGUKICAtLS0KICBkdXJhdGlvbl9tczogMC43MDc0NjIKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBVbmRvIG5vdCByZWFkeSBkb2VzIG5vdCBjaGFu
Z2Ugc3RhdGUKb2sgNDk5IC0gVW5kbyBub3QgcmVhZHkgZG9lcyBub3QgY2hhbmdlIHN0YXRlCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuNjM1MDIzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogVW5kbyBlbXB0eSBoaXN0b3J5IGRvZXMgbm90IGNoYW5nZSBzdGF0ZQpvayA1MDAgLSBVbmRv
IGVtcHR5IGhpc3RvcnkgZG9lcyBub3QgY2hhbmdlIHN0YXRlCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuNDg2MDY5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgUEFTUzogMjkgYmFzZWxpbmUgY2FzZXMg
KyBjb25maXJtZWQgZml4dHVyZXMKIyBTdWJ0ZXN0OiB0ZXN0cy92b2ljZS1wYXJzZXIudGVzdC5j
anMKb2sgMTA1IC0gdGVzdHMvdm9pY2UtcGFyc2VyLnRlc3QuY2pzCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDg4LjQxMTY0NwogIHR5cGU6ICd0ZXN0JwogIC4uLgoxLi41MDEKIyB0ZXN0cyA1MDEKIyBz
dWl0ZXMgMAojIHBhc3MgNTAxCiMgZmFpbCAwCiMgY2FuY2VsbGVkIDAKIyBza2lwcGVkIDAKIyB0
b2RvIDAKIyBkdXJhdGlvbl9tcyAyMjk3LjY5MzAxOAo=
```

### ARCHIVED FILE: STAGE17_ACTIVATION_STATUS.md | SHA256 d37c1377ed81bb0c9d19b7af268680fe7fa8885e5a5263022f7cc9b112b7ee8f

```base64
IyBTdGFnZSAxNyDigJQgQXV0b21hdGljIHRyYW5zZmVyIGFjdGl2YXRpb24gY2FuZGlkYXRlCgpU
aGlzIFpJUCBjb250YWlucyBhbiBhcHBsaWNhdGlvbiB3aXRoIGBNQUhKT05HX0NMT1VEX1NZTkNf
RU5BQkxFRD10cnVlYCBhbmQgYSBzZXBhcmF0ZSAqKnVudmVyaWZpZWQqKiBTUUwgaW5zdGFsbCBj
YW5kaWRhdGUuICoqRE8gTk9UIGRlcGxveSB0aGUgYXBwIGJlZm9yZSBpbnN0YWxsaW5nIGFuZCB2
ZXJpZnlpbmcgdGhlIGZpdmUgUlBDcy4qKiBUaGlzIHBhY2thZ2UgaXMgTk9UIGEgY2xhaW0gb2Yg
cHJvZHVjdGlvbiByZWFkaW5lc3MuCgojIyBDcml0aWNhbCBzZXF1ZW5jZQoxLiBCYWNrIHVwIHRo
ZSBjdXJyZW50IFN1cGFiYXNlIGRhdGFiYXNlLCBjb25maXJtIHRoZSBleGlzdGluZyB0YWJsZXMv
aW5kZXhlcyBhbmQgY3VycmVudCBnYW1lIGFyZSByZWNvdmVyYWJsZS4KMi4gUmV2aWV3IGBTVEFH
RTE3X0RJUkVDVF9JTlNUQUxMX0NBTkRJREFURV9SRVZJRVdfRklSU1Quc3FsYCBhZ2FpbnN0IGFj
dHVhbCBwcm9kdWN0aW9uIHNjaGVtYSBhbmQgZnVuY3Rpb24gZGVmaW5pdGlvbnMuIEl0IHJlcGxh
Y2VzIHRoZSBleGlzdGluZyBgbWFoam9uZ19zeW5jX3BlZWtgIGFuZCBgbWFoam9uZ19zeW5jX3Zh
bGlkX2dhbWVgIGRlZmluaXRpb25zIGFuZCBhZGRzL2NoYW5nZXMgdGFibGUgY29sdW1ucy4gRG8g
bm90IGV4ZWN1dGUgYmxpbmRseS4KMy4gSW5zdGFsbCBvbmx5IGFmdGVyIHJldmlld2luZyBkZXBl
bmRlbmNpZXMgYW5kIHNlY3VyaXR5LiBJZiBpbnN0YWxsYXRpb24gZmFpbHMsIHRyYW5zYWN0aW9u
IHNob3VsZCByb2xsIGJhY2ssIGJ1dCBhbiBleHRlcm5hbCB2ZXJpZmllZCBiYWNrdXAgaXMgc3Rp
bGwgbmVlZGVkLgo0LiBUZXN0IFJQQyBhY2Nlc3MsIHNpZ25lZCBBdXRoIHNlc3Npb24gdGFrZW92
ZXIgYW5kIHJlY292ZXJ5IHdpdGggdHdvIGRldmljZXMuCjUuIE9ubHkgdGhlbiBkZXBsb3kgdGhp
cyBlbmFibGVkIGFwcCB0byBHaXRIdWIgUGFnZXMuIElmIGNsb3VkIFJQQ3MgYXJlIGFic2VudCBv
ciBmYWlsLCBzY29yZWtlZXBpbmcgY2FuIGJlY29tZSByZWFkLW9ubHkuCgojIyBDdXJyZW50IGV2
aWRlbmNlCi0gUHJldmlvdXMgYmFzZWxpbmU6IDYyMyBOb2RlIHRlc3RzIFBBU1MsIHplcm8gZmFp
bHVyZXMuIFRoZXNlIGFyZSBub3QgYSBsaXZlIFN1cGFiYXNlIGFjY2VwdGFuY2UgdGVzdC4KLSBQ
cm9kdWN0aW9uIEFDTDogbm8gUFVCTElDIG9yIGFub24gRVhFQ1VURSBvbiBmaXZlIGN1cnJlbnRs
eSBpbnN0YWxsZWQgaGVscGVycy4KLSBQcm9kdWN0aW9uIFJMUzogZm91ciB0YWJsZXMgZW5hYmxl
ZCwgemVybyBwb2xpY2llcy4KLSBGaXZlIHRyYW5zZmVyIFJQQ3M6IG5vdCBpbnN0YWxsZWQgYXMg
b2YgdGhlIGxhc3QgdXNlci1wcm92aWRlZCBkYXRhYmFzZSByZXBvcnQuCi0gUmVhbCB0d28tZGV2
aWNlIHRyYW5zZmVyOiBub3QgdmVyaWZpZWQuCgojIyBHaXRIdWIgRGVza3RvcApTdW1tYXJ5OiBg
djE1LjcuMTUgLSBQcmVwYXJlIGF1dG9tYXRpYyBjbG91ZCBzZXNzaW9uIHRyYW5zZmVyIGFjdGl2
YXRpb25gCkRlc2NyaXB0aW9uOiBgRW5hYmxlIGNsb3VkIGJyaWRnZSBpbiBhY3RpdmF0aW9uIGNh
bmRpZGF0ZTsgaW5jbHVkZSBzZXBhcmF0ZSBTUUwgaW5zdGFsbGF0aW9uIGNhbmRpZGF0ZSBhbmQg
c2FmZXR5IGhhbmRvZmYuIFJlcXVpcmVzIHNlcnZlciBSUEMgaW5zdGFsbGF0aW9uIGFuZCBsaXZl
IHR3by1kZXZpY2UgdmVyaWZpY2F0aW9uIGJlZm9yZSBkZXBsb3ltZW50LmAK
```

### ARCHIVED FILE: STAGE17_CLOUD_ON_RELEASE_NOTES.md | SHA256 6ca8aaee856f34c3ba35e596b0ae2a63d858706fa279017c327ea461c0e33485

```base64
IyBTdGFnZSAxNyDigJQgQ2xvdWQgT04gZGVwbG95bWVudCBjYW5kaWRhdGUgKG5vdCB2ZXJpZmll
ZCBmaW5hbCkKClVzZXIgcmVwb3J0cyBmaXZlIFJQQ3MgSU5TVEFMTEVEIGluIGV4aXN0aW5nIFN1
cGFiYXNlLCBiYXNlZCBvbiBuYW1lLW9ubHkgcGdfcHJvYyBxdWVyeS4gVGhpcyBkb2VzIE5PVCB2
ZXJpZnkgc2lnbmF0dXJlcywgZ3JhbnRzLCBzZXJ2ZXIgbG9naWMsIEF1dGggSldUIG9yIGFjdHVh
bCBkZXZpY2UgdGFrZW92ZXIuIE5vIGRpcmVjdCBhY2Nlc3MgdG8gbGl2ZSBTdXBhYmFzZSBpcyBh
dmFpbGFibGUgaGVyZS4KClRoaXMgcGFja2FnZSBzZXRzIE1BSEpPTkdfQ0xPVURfU1lOQ19FTkFC
TEVEPXRydWUuIEl0IGNhbiBtYWtlIHNjb3Jla2VlcGluZyByZWFkLW9ubHkgd2hlbiBSUENzIHJl
amVjdCBzZXNzaW9ucyBvciBnYW1lIGFkb3B0aW9uIGZhaWxzLiBEbyBub3QgcHJlc2VudCBhcyBw
cm92ZW4gd29ya2luZy4gUHJlc2VydmUgYSB2ZXJpZmllZCBiYWNrdXAgb2YgdGhlIGN1cnJlbnQg
bG9jYWwgZ2FtZSBiZWZvcmUgZGVwbG95aW5nOyBicm93c2VyL2xvY2FsU3RvcmFnZSBkYXRhIG1h
eSBiZSBhdCByaXNrIGlmIHJlcGxhY2luZyBzdGF0ZS4KCk5vZGUgdGVzdCBydW4gb24gY2xvdWQt
ZW5hYmxlZCBjb2RlOiA2MTcgUEFTUyAvIDYgRkFJTCAoNjIzIHRvdGFsKS4gVGhlIHNpeCBmYWls
ZWQgdGVzdHMgYXNzZXJ0IENsb3VkIFN5bmMgbXVzdCByZW1haW4gT0ZGIGFuZCBoYXZlIE5PVCBi
ZWVuIHJlbW92ZWQgb3IgcmV3cml0dGVuIHRvIGFydGlmaWNpYWxseSBwYXNzLiBUaGlzIGlzIGEg
cmVsZWFzZS1nYXRlIGZhaWx1cmUsIG5vdCBhIGNlcnRpZmllZCBncmVlbiBidWlsZC4gU2VlIHRl
c3RzL2Nsb3VkX29uX3Rlc3RfcnVuLnR4dC4KCk5vIFN1cGFiYXNlIFNRTCBleGVjdXRlZCBieSB0
aGlzIFpJUC4gVGhlIGZpdmUgUlBDcyB3ZXJlIHJlcG9ydGVkIGluc3RhbGxlZCBieSB0aGUgdXNl
ci4gVHdvLWRldmljZSBhdXRvbWF0aWMgdGFrZW92ZXIsIG9sZCB3cml0ZXIgcmV2b2NhdGlvbiwg
Z2FtZSBwZXJzaXN0ZW5jZSBhbmQgcmVjb3ZlcnkgcmVtYWluIHVudGVzdGVkLgoKR2l0SHViIERl
c2t0b3AgU3VtbWFyeTogdjE1LjcuMTUgLSBDbG91ZCBPTiBhdXRvbWF0aWMgdHJhbnNmZXIgY2Fu
ZGlkYXRlCkdpdEh1YiBEZXNrdG9wIERlc2NyaXB0aW9uOiBFbmFibGUgY2xvdWQgYnJpZGdlIGFm
dGVyIHVzZXItcmVwb3J0ZWQgaW5zdGFsbGF0aW9uIG9mIGZpdmUgU3VwYWJhc2UgUlBDcy4gUHJl
c2VydmUgc2l4IGZhaWxpbmcgcmVsZWFzZS1nYXRlIHRlc3RzIGFzIGV4cGxpY2l0IGJsb2NrZXJz
LiBObyBsaXZlIEF1dGgvdHdvLWRldmljZSBhY2NlcHRhbmNlIHlldC4gQmFjayB1cCBnYW1lIHN0
YXRlIGJlZm9yZSB1c2UuCg==
```

### ARCHIVED FILE: STAGE17_STEP35_RPC_SECURITY_AUDIT.md | SHA256 7b496ca1f78a5bfd198278656c28430f296e32e06afa4ffc7c594a9fe45c5b90

```base64
IyBUYWhhcCAxNyDigJQgTGFuZ2thaCAzNTogQXVkaXQga29udHJhayBrZWFtYW5hbiBsaW1hIFJQ
QyAobG9rYWwpCgoqKlN0YXR1czoqKiBwZW1lcmlrc2FhbiBzdGF0aXMga29udHJhayBrZWFtYW5h
biBzZWxlc2FpOyAqKmJ1a2FuKiogYXVkaXQga2VhbWFuYW4gZmluYWwgYXRhdSBidWt0aSBpbnRl
Z3Jhc2kgcnVudGltZS4KCiMjIFlhbmcgZGlwZXJpa3NhCi0gYG9wZW5gOiB2YWxpZGFzaSBzZXNp
IEF1dGgsIHBlbmd1bmNpYW4gYWt1biwgcGVuZ2VjZWthbiB1bGFuZyBzZXRlbGFoIGxvY2ssIGhp
Z2gtd2F0ZXIgc2VzaSBsYW1hLCB0b2tlbiB3cml0ZXIuCi0gYGNvbW1pdGA6IHZhbGlkYXNpIHBh
eWxvYWQgaGFyZGVuZWQsIGxvY2sgYWt1biwgdmFsaWRhc2kgc2VzaSB1bGFuZywga2VwZW1pbGlr
YW4gbGVhc2UsIHRva2VuIGhhc2gsIGdlbmVyYXRpb24sIENBUyByZXZpc2lvbjsgcGF5bG9hZCBw
ZW51bGlzIGRpY2FidXQgdGlkYWsgZGlzaW1wYW4gZGFsYW0gdGFiZWwga29uZmxpay4KLSBgb3Bl
bl9yZWFkZXJgOiBwZW1pc2FoYW4gaGFrIGJhY2EgZGFyaSB3cml0ZXI7IGJ1dHVoIHVqaSBydW50
aW1lIGtlYmlqYWthbiByb2xlIGRhbiBwZXJnYW50aWFuIHBlcmFuZ2thdC4KLSBgcmVhZGA6IHZl
cmlmaWthc2kgbGVhc2UgdGVya2FpdCBzZXNpIEF1dGgsIHBlbWJhdGFsYW4gaGFrIHJlYWRlciBq
aWthIGl6aW4gbXVsdGktZGV2aWNlIGRpbWF0aWthbi4KLSBgbGVhc2Vfc3RhdHVzYDogcGVtZXJp
a3NhYW4gc2VzaSBkYW4gZ2VuZXJhdGlvbjsgc3RhdHVzIGhhbnlhIGFkdmlzb3J5LCBgY29tbWl0
YCB0ZXRhcCBib3VuZGFyeSB0dWxpcy4KLSBFa3Nla3VzaSBTUUwga2FuZGlkYXQgbWFzaWggZGlo
ZW50aWthbiBvbGVoIHNlbnRpbmVsIGBSQUlTRSBFWENFUFRJT05gIGRpIGJhZ2lhbiBhdGFzOyAq
KmphbmdhbiBoYXB1cyBzZW50aW5lbCBhdGF1IGRlcGxveSoqLgoKIyMgQmF0YXMgcGVtYnVrdGlh
biBkYW4gdGVtdWFuCjEuIEtvbnRyYWsgZGljZWsgc2VjYXJhIHN0YXRpcyBkYW4gcmVncmVzaSBO
b2RlOyBwZW5ndWppYW4gc2VzaSBBdXRoIHN1bmdndWhhbiwgcmFjZSBsaW50YXMgcGVyYW5na2F0
LCByb2xlIHRvZ2dsaW5nLCB0b2tlbiBleHBpcnkgZGFuIHRha2VvdmVyICoqYmVsdW0gZGlsYWtz
YW5ha2FuKiouCjIuIEtlc2VzdWFpYW4gMTIvMTIgZml4dHVyZSBQb3N0Z3JlU1FMIGhhbnlhIGJl
cmxha3UgdW50dWsgdmFsaWRhdG9yIHNlbWVudGFyYTsgcHJvZHVrc2kgdGV0YXAgbWVuZXJpbWEg
OSBwYXlsb2FkIGludmFsaWQuCjMuIGBzdXBhYmFzZV9sYXRlc3Quc3FsYCAqKnRpZGFrIGRpdWJh
aCoqLCBrYXJlbmEgYmVsdW0gYWRhIHBlcnNldHVqdWFuIG1pZ3Jhc2kgZGFuIHBlbmd1amlhbiBy
b2xsYmFjayBpbnN0YWxhc2kuCjQuIFVqaSBTUUwgYFNFQ1VSSVRZIERFRklORVJgIHRlcmhhZGFw
IHByaXZpbGVnZSBgYXV0aC5zZXNzaW9uc2AsIHBlcnViYWhhbiBncmFudCwgUkxTLCBkYW4gYmF0
YXMga29ua3VyZW5zaSB3YWppYiBzZWJlbHVtIGRlcGxveS4KNS4gYG9wZW5fcmVhZGVyYCBkYW4g
YHJlYWRgIHBlcmx1IHZlcmlmaWthc2kgcnVudGltZSBraHVzdXMgc2tlbmFyaW8gcGVub25ha3Rp
ZmFuIGl6aW4gbXVsdGktZGV2aWNlIGRhbiBzZXNpIGxhbWEuCgojIyBMYW5na2FoIGJlcmlrdXRu
eWEKQXVkaXQgaW50ZXJha3NpIGxpbWEgUlBDIG1lbmdndW5ha2FuIFBvc3RncmVTUUwgdHJhbnNh
Y3Rpb24gcm9sbGJhY2sgZGFuIHNlc2kgQXV0aCBueWF0YSBwYWRhIGxpbmdrdW5nYW4gdWppLCBs
YWx1IHJldmlldyBtaWdyYXNpIGBzdXBhYmFzZV9sYXRlc3Quc3FsYCBzZWNhcmEgdGVycGlzYWgu
IENsb3VkIFN5bmMgT0ZGIC8gRE8gTk9UIERFUExPWS4KCiMjIEdpdEh1YiBEZXNrdG9wClN1bW1h
cnk6IGB2MTUuNy4xNSAtIFN0YWdlIDE3IFJQQyBzZWN1cml0eSBjb250cmFjdCBhdWRpdCAobm8g
ZGVwbG95KWAKRGVzY3JpcHRpb246IGBBZGQgc3RhdGljIHJlZ3Jlc3Npb24gdGVzdHMgZm9yIGZp
dmUgUlBDIHNlY3VyaXR5IGNvbnRyYWN0czsgZG9jdW1lbnQgcmVtYWluaW5nIGxpdmUgQXV0aCBh
bmQgY29uY3VycmVuY3kgZ2F0ZXMuIEtlZXAgY2xvdWQgc3luYyBkaXNhYmxlZCBhbmQgU1FMIHBy
b2R1Y3Rpb24gdW5jaGFuZ2VkLmAK
```

### ARCHIVED FILE: STAGE20_SECURITY_AUDIT.md | SHA256 d10d57c21ef362dbf1016ebd2d41efd5b1aa757e5a9e21738e1f35c395a02c66

```base64
IyBTdGFnZSAyMCDigJQgU2Vzc2lvbiBUcmFuc2ZlciBBdWRpdCAoMTMgT2N0b2JlciAyMDI2KQoK
SW5wdXQ6IG1haGpvbmctc2NvcmUtbWFpbig2KS56aXAuIE5vIHByb2R1Y3Rpb24gZGVwbG95bWVu
dCwgU3VwYWJhc2Ugd3JpdGUsIG9yIGxpdmUgZ2FtZSBtdXRhdGlvbiBwZXJmb3JtZWQuCgojIyBW
ZXJpZmllZCBzb3VyY2Ugb2JzZXJ2YXRpb25zCi0gaW5kZXguaHRtbCBsb2dpbk1haGpvbmcgaW52
b2tlcyBTdXBhYmFzZSBhdXRoLnNpZ25JbldpdGhQYXNzd29yZDsgZGV2aWNlIHdyaXRlciBhY3Rp
dmF0aW9uIGlzIGRlZmVycmVkIHZpYSBzY2hlZHVsZU1haGpvbmdDbG91ZEF1dGggLyBicmlkZ2Uu
b25TZXNzaW9uLgotIGpzL3N5bmMtYXBwLWJyaWRnZS5qcyBhbHJlYWR5IHNjaGVkdWxlcyBsZWFz
ZSBjaGVja3MgYXQgMTUgc2Vjb25kcyB3aGlsZSBhY3RpdmUuIGpzL3N5bmMtZW5naW5lLmpzIGZh
aWxzIGNsb3NlZCBvbiByZWplY3RlZCBsZWFzZS4gVGhlIFVJIGF1dGggc2Vzc2lvbiBpcyBOT1Qg
YXV0b21hdGljYWxseSBzaWduZWQgb3V0IGJ5IHRoaXMgbGVhc2UgbG9naWMuCi0gVGhlIHVwbG9h
ZGVkIGluZGV4Lmh0bWwgaGFkIE1BSEpPTkdfQ0xPVURfU1lOQ19FTkFCTEVEPXRydWUgZGVzcGl0
ZSBwcmlvciBETyBOT1QgREVQTE9ZIGNvbnN0cmFpbnRzLiBDaGFuZ2VkIHRvIGZhbHNlIGluIHRo
aXMgc2FmZXR5IGNoZWNrcG9pbnQuCi0gQ2hyb21lIHN0YXlpbmcgbG9nZ2VkIGluIGFmdGVyIEZp
cmVmb3ggbG9naW4gaXMgTk9UIHByb29mIHRoYXQgQ2hyb21lIHJldGFpbnMgd3JpdGVyIHJpZ2h0
cy4gU3VwYWJhc2UgQXV0aCBsb2dpbiBhbmQgdGhlIGFwcGxpY2F0aW9uJ3Mgd3JpdGVyIGxlYXNl
IGFyZSBkaXN0aW5jdCBjb25jZXB0cy4KLSBFYXJsaWVyIDYgcmVsZWFzZS1nYXRlIHRlc3QgZmFp
bHVyZXMgd2VyZSBjYXVzZWQgYnkgdGhlIHRydWUgZmxhZzsgcmV0ZXN0IHJlc3VsdHMgYXJlIGlu
IFNUQUdFMjBfVEVTVF9SRVNVTFRTLnR4dC4KCiMjIFJlbWFpbmluZyBibG9ja2VycwotIERvIG5v
dCBwcm9taXNlIGxvZ291dCBtZXJlbHkgZnJvbSB3cml0ZXIgcmV2b2NhdGlvbjogYWRkIGV4cGxp
Y2l0IGFjY291bnQtc2Vzc2lvbiByZXZvY2F0aW9uIFVYIGFmdGVyIHZlcmlmaWVkIGJhY2tlbmQg
cmVzcG9uc2UgYW5kIGNvbnNpZGVyIEF1dGggdG9rZW4gaW52YWxpZGF0aW9uIHNlbWFudGljcy4K
LSBDb25maXJtIGZpdmUgUlBDcyBhcmUgaW5zdGFsbGVkIGFuZCBzZWN1cmUgYmVmb3JlIGFueSBj
bG91ZC1vbiByZWxlYXNlLgotIFZlcmlmeSBuZXcgYnJvd3NlciBvYnRhaW5zIHdyaXRlciBsZWFz
ZSwgb2xkIGJyb3dzZXIgcmVjZWl2ZXMgcmV2b2tlZCByZXNwb25zZSwgYW5kIG5vIG9sZCB3cml0
ZXMgc3VjY2VlZDsgdGVzdCB3aXRoIGRpc3Bvc2FibGUgZ2FtZSBvbmx5LgotIE5vIGF1dG9tYXRp
YyBmb3JjZWQgc2lnbk91dCBpbXBsZW1lbnRlZDogdGhlIHByb3BlciBzZXJ2ZXIgY29udHJhY3Qg
YW5kIHJhY2UgYmVoYXZpb3IgcmVxdWlyZSB2YWxpZGF0aW9uIGZpcnN0LgoKIyMgR2l0SHViIERl
c2t0b3AKU3VtbWFyeTogU3RhZ2UgMjAgcmVzdG9yZSBjbG91ZCByZWxlYXNlIHNhZmV0eSBnYXRl
CkRlc2NyaXB0aW9uOiBSZXN0b3JlIGNsb3VkIHN5bmMgT0ZGIGluIGluZGV4Lmh0bWwsIHByZXNl
cnZlIGV4aXN0aW5nIHRyYW5zZmVyIGltcGxlbWVudGF0aW9uLCBkb2N1bWVudCBzZXNzaW9uIHZl
cnN1cyB3cml0ZXIgbGVhc2UgZGlzdGluY3Rpb24gYW5kIHRlc3QgcmVzdWx0cy4gRE8gTk9UIERF
UExPWS4K
```

### ARCHIVED FILE: STAGE20_TEST_RESULTS.txt | SHA256 9e7ef591ce2a9936aab5cc821a1293b4529f20d442c5dce8c9f3566b4b8a9dd0

```base64
VEFQIHZlcnNpb24gMTMKIyBTdWJ0ZXN0OiBicm93c2VyIGRpYWdub3N0aWMgZGlzdGluZ3Vpc2hl
cyBSUEMgY29udHJhY3QgZnJvbSBjbG91ZCBnYW1lCm9rIDEgLSBicm93c2VyIGRpYWdub3N0aWMg
ZGlzdGluZ3Vpc2hlcyBSUEMgY29udHJhY3QgZnJvbSBjbG91ZCBnYW1lCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDEuMDA0Mzg0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbm8tY2xvdWQt
Z2FtZSBleHBsaWNpdGx5IG1lYW5zIG5vdCByZWFkeQpvayAyIC0gbm8tY2xvdWQtZ2FtZSBleHBs
aWNpdGx5IG1lYW5zIG5vdCByZWFkeQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE5Njg4NwogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGRpYWdub3N0aWMgbmV2ZXIgd3JpdGVzIHRvIFJQ
QwpvayAzIC0gZGlhZ25vc3RpYyBuZXZlciB3cml0ZXMgdG8gUlBDCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMjg2OTkyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogUG9zdGdyZVNRTCBw
cmVmbGlnaHQgb3BlbnMgYW4gZXhwbGljaXQgcmVhZC1vbmx5IHRyYW5zYWN0aW9uCm9rIDQgLSBQ
b3N0Z3JlU1FMIHByZWZsaWdodCBvcGVucyBhbiBleHBsaWNpdCByZWFkLW9ubHkgdHJhbnNhY3Rp
b24KICAtLS0KICBkdXJhdGlvbl9tczogMC45ODYxNTcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBQb3N0Z3JlU1FMIHByZWZsaWdodCBuZXZlciBzZW5kcyBtaWdyYXRpb25zIG9yIHdy
aXRlcwpvayA1IC0gUG9zdGdyZVNRTCBwcmVmbGlnaHQgbmV2ZXIgc2VuZHMgbWlncmF0aW9ucyBv
ciB3cml0ZXMKICAtLS0KICBkdXJhdGlvbl9tczogMC40NTg0NTEKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBQb3N0Z3JlU1FMIHByZWZsaWdodCB2YWxpZGF0ZXMgZGF0YWJhc2UgaWRl
bnRpZmllciBhbmQgZmFpbHMgY2xvc2VkIG9uIGNvbm5lY3Rpb24gZXJyb3JzCm9rIDYgLSBQb3N0
Z3JlU1FMIHByZWZsaWdodCB2YWxpZGF0ZXMgZGF0YWJhc2UgaWRlbnRpZmllciBhbmQgZmFpbHMg
Y2xvc2VkIG9uIGNvbm5lY3Rpb24gZXJyb3JzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTUzMDEx
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU2NvcmUgZWRpdCByb2xscyBiYWNrIGNv
bXBsZXRlIHN0YXRlIG9uIHNhdmUgZmFpbHVyZQpvayA3IC0gU2NvcmUgZWRpdCByb2xscyBiYWNr
IGNvbXBsZXRlIHN0YXRlIG9uIHNhdmUgZmFpbHVyZQogIC0tLQogIGR1cmF0aW9uX21zOiAyLjQ5
NzEyNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFNjb3JlIGVkaXQgcGVyc2lzdHMg
bmV3IHJlc3VsdCBvbiBzYXZlIHN1Y2Nlc3MKb2sgOCAtIFNjb3JlIGVkaXQgcGVyc2lzdHMgbmV3
IHJlc3VsdCBvbiBzYXZlIHN1Y2Nlc3MKICAtLS0KICBkdXJhdGlvbl9tczogMC41OTcxCiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogUXVhZCBkZWxldGlvbiByb2xscyBiYWNrIGNvbXBs
ZXRlIHN0YXRlIG9uIHNhdmUgZmFpbHVyZQpvayA5IC0gUXVhZCBkZWxldGlvbiByb2xscyBiYWNr
IGNvbXBsZXRlIHN0YXRlIG9uIHNhdmUgZmFpbHVyZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjgy
MzUyMQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFF1YWQgZGVsZXRpb24gcGVyc2lz
dHMgb24gc2F2ZSBzdWNjZXNzCm9rIDEwIC0gUXVhZCBkZWxldGlvbiBwZXJzaXN0cyBvbiBzYXZl
IHN1Y2Nlc3MKICAtLS0KICBkdXJhdGlvbl9tczogMS40NzcwOTYKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBvbGQgc2NvcmUgZWRpdCByZWJhc2VzIG5ld2VyIGJlZm9yZQpvayAxMSAt
IG9sZCBzY29yZSBlZGl0IHJlYmFzZXMgbmV3ZXIgYmVmb3JlCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDMuNDI4MjQ4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb2xkIHNjb3JlIGVkaXQg
c2F2ZSBmYWlsdXJlIHJvbGxzIGJhY2sgcmViYXNpbmcKb2sgMTIgLSBvbGQgc2NvcmUgZWRpdCBz
YXZlIGZhaWx1cmUgcm9sbHMgYmFjayByZWJhc2luZwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjg1
Njk4MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG9sZCBxdWFkIGRlbGV0aW9uIHJl
YmFzZXMgbmV3ZXIgYmVmb3JlCm9rIDEzIC0gb2xkIHF1YWQgZGVsZXRpb24gcmViYXNlcyBuZXdl
ciBiZWZvcmUKICAtLS0KICBkdXJhdGlvbl9tczogMC44NDM2MzIKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBvbGQgcXVhZCBkZWxldGlvbiBzYXZlIGZhaWx1cmUgcm9sbHMgYmFjayBy
ZWJhc2luZwpvayAxNCAtIG9sZCBxdWFkIGRlbGV0aW9uIHNhdmUgZmFpbHVyZSByb2xscyBiYWNr
IHJlYmFzaW5nCiAgLS0tCiAgZHVyYXRpb25fbXM6IDIuNjA2NjY5CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogbGVnYWN5IG1pc3NpbmcgbmV3ZXIgYmVmb3JlIGJsb2NrcyBzY29yZSBl
ZGl0Cm9rIDE1IC0gbGVnYWN5IG1pc3NpbmcgbmV3ZXIgYmVmb3JlIGJsb2NrcyBzY29yZSBlZGl0
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNzc2NzUxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogbGVnYWN5IG1pc3NpbmcgbmV3ZXIgYmVmb3JlIGJsb2NrcyBxdWFkIGRlbGV0aW9uCm9r
IDE2IC0gbGVnYWN5IG1pc3NpbmcgbmV3ZXIgYmVmb3JlIGJsb2NrcyBxdWFkIGRlbGV0aW9uCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuNjI4MTI3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogcHJvZHVjdGlvbiBjbG91ZCByZWxlYXNlIGdhdGUgc3RheXMgT0ZGCm9rIDE3IC0gcHJvZHVj
dGlvbiBjbG91ZCByZWxlYXNlIGdhdGUgc3RheXMgT0ZGCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
OTMyNjk2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcHJvZHVjdGlvbiBicmlkZ2Ug
aW5oZXJpdHMgT0ZGIHJlbGVhc2UgZ2F0ZQpvayAxOCAtIHByb2R1Y3Rpb24gYnJpZGdlIGluaGVy
aXRzIE9GRiByZWxlYXNlIGdhdGUKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNzc2MjgKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhcHBsaWNhdGlvbiBzY29yZSB3cml0ZSBpcyBnYXRl
ZCBieSBjbG91ZCB3cml0ZXIgcGVybWlzc2lvbiB3aGVuIGVuYWJsZWQKb2sgMTkgLSBhcHBsaWNh
dGlvbiBzY29yZSB3cml0ZSBpcyBnYXRlZCBieSBjbG91ZCB3cml0ZXIgcGVybWlzc2lvbiB3aGVu
IGVuYWJsZWQKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNzI3CiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogYWxsIGZpdmUgdHJhbnNmZXIgUlBDIG5hbWVzIGFyZSByZWZlcmVuY2VkIGJ5
IHRyYW5zcG9ydApvayAyMCAtIGFsbCBmaXZlIHRyYW5zZmVyIFJQQyBuYW1lcyBhcmUgcmVmZXJl
bmNlZCBieSB0cmFuc3BvcnQKICAtLS0KICBkdXJhdGlvbl9tczogMC40NzE5OTIKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBicmlkZ2UgZG9lcyBub3QgcGVyc2lzdCB3cml0ZXIgdG9r
ZW5zIGFuZCBtb25pdG9ycyBsZWFzZXMKb2sgMjEgLSBicmlkZ2UgZG9lcyBub3QgcGVyc2lzdCB3
cml0ZXIgdG9rZW5zIGFuZCBtb25pdG9ycyBsZWFzZXMKICAtLS0KICBkdXJhdGlvbl9tczogMC4x
NjYwMQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGRyYWZ0IG1pZ3JhdGlvbiBibG9j
a3MgYWNjaWRlbnRhbCBleGVjdXRpb24gYmVmb3JlIGFueSBEREwKb2sgMjIgLSBkcmFmdCBtaWdy
YXRpb24gYmxvY2tzIGFjY2lkZW50YWwgZXhlY3V0aW9uIGJlZm9yZSBhbnkgRERMCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuNzQ0ODkzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWxs
IGZpdmUgdHJhbnNmZXIgUlBDcyBkZWNsYXJlIGRlZmluZXIgYW5kIGVtcHR5IHNlYXJjaF9wYXRo
Cm9rIDIzIC0gYWxsIGZpdmUgdHJhbnNmZXIgUlBDcyBkZWNsYXJlIGRlZmluZXIgYW5kIGVtcHR5
IHNlYXJjaF9wYXRoCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzc0MTg0CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogd3JpdGVyIG9wZW4gYW5kIGNvbW1pdCByZXZhbGlkYXRlIEF1dGgg
c2Vzc2lvbiBhZnRlciBhY2NvdW50IHJvdyBsb2NrCm9rIDI0IC0gd3JpdGVyIG9wZW4gYW5kIGNv
bW1pdCByZXZhbGlkYXRlIEF1dGggc2Vzc2lvbiBhZnRlciBhY2NvdW50IHJvdyBsb2NrCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMTQ4NzI1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
cmVsZWFzZSBnYXRlIHJlbWFpbnMgZGlzYWJsZWQgcGVuZGluZyBzaWduZWQtSldUIGJyb3dzZXIg
YWNjZXB0YW5jZQpvayAyNSAtIHJlbGVhc2UgZ2F0ZSByZW1haW5zIGRpc2FibGVkIHBlbmRpbmcg
c2lnbmVkLUpXVCBicm93c2VyIGFjY2VwdGFuY2UKICAtLS0KICBkdXJhdGlvbl9tczogMC4zMTkw
NzEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZTE0IHByZWZsaWdodCBleGFt
aW5lcyBhbGwgZm91ciBzeW5jIGZvdW5kYXRpb24gdGFibGVzCm9rIDI2IC0gU3RhZ2UxNCBwcmVm
bGlnaHQgZXhhbWluZXMgYWxsIGZvdXIgc3luYyBmb3VuZGF0aW9uIHRhYmxlcwogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjY3NDY4NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdl
MTQgcHJlZmxpZ2h0IGNoZWNrcyBkaXJlY3QgRE1MIHByaXZpbGVnZXMgZm9yIGJvdGggQVBJIHJv
bGVzCm9rIDI3IC0gU3RhZ2UxNCBwcmVmbGlnaHQgY2hlY2tzIGRpcmVjdCBETUwgcHJpdmlsZWdl
cyBmb3IgYm90aCBBUEkgcm9sZXMKICAtLS0KICBkdXJhdGlvbl9tczogMi4wNzEwNTIKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZTE0IHByZWZsaWdodCBhdWRpdHMgcG9saWNp
ZXMsIGluZGV4ZXMgYW5kIFJQQyBleGVjdXRlIGdyYW50cyB3aXRob3V0IG11dGF0aW9ucwpvayAy
OCAtIFN0YWdlMTQgcHJlZmxpZ2h0IGF1ZGl0cyBwb2xpY2llcywgaW5kZXhlcyBhbmQgUlBDIGV4
ZWN1dGUgZ3JhbnRzIHdpdGhvdXQgbXV0YXRpb25zCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuOTQx
MDY4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCBwcmVmbGlnaHQgZXhw
bGljaXRseSByZXBvcnRzIG1pc3NpbmcgZm91bmRhdGlvbiB0YWJsZXMgcmF0aGVyIHRoYW4gc2ls
ZW50bHkgb21pdHRpbmcgdGhlbQpvayAyOSAtIFN0YWdlMTQgcHJlZmxpZ2h0IGV4cGxpY2l0bHkg
cmVwb3J0cyBtaXNzaW5nIGZvdW5kYXRpb24gdGFibGVzIHJhdGhlciB0aGFuIHNpbGVudGx5IG9t
aXR0aW5nIHRoZW0KICAtLS0KICBkdXJhdGlvbl9tczogMC4xNTQwMzIKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBlbXB0eSBldmlkZW5jZSBpcyBibG9ja2VkCm9rIDMwIC0gZW1wdHkg
ZXZpZGVuY2UgaXMgYmxvY2tlZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjgxMzMxNgogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbXBsZXRlIHJlc3RyaWN0aXZlIHRhYmxlIGV2aWRl
bmNlIHBhc3NlcyBwcm92aXNpb25hbCBhY2Nlc3MgY2hlY2tzCm9rIDMxIC0gY29tcGxldGUgcmVz
dHJpY3RpdmUgdGFibGUgZXZpZGVuY2UgcGFzc2VzIHByb3Zpc2lvbmFsIGFjY2VzcyBjaGVja3MK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4xNzMyNTEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBtaXNzaW5nIHRhYmxlIGV2aWRlbmNlIGJsb2NrcwpvayAzMiAtIG1pc3NpbmcgdGFibGUg
ZXZpZGVuY2UgYmxvY2tzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTA4MzAzCiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogZGlyZWN0IGF1dGhlbnRpY2F0ZWQgdXBkYXRlIGJsb2Nrcwpv
ayAzMyAtIGRpcmVjdCBhdXRoZW50aWNhdGVkIHVwZGF0ZSBibG9ja3MKICAtLS0KICBkdXJhdGlv
bl9tczogMC4yMzM4MjMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBkaXJlY3QgYW5v
biBpbnNlcnQgYmxvY2tzCm9rIDM0IC0gZGlyZWN0IGFub24gaW5zZXJ0IGJsb2NrcwogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjEzNTMzNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGRp
c2FibGVkIFJMUyBibG9ja3MKb2sgMzUgLSBkaXNhYmxlZCBSTFMgYmxvY2tzCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDEuMDA4OTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiB1bmtub3du
IHByaXZpbGVnZSBibG9ja3MKb2sgMzYgLSB1bmtub3duIHByaXZpbGVnZSBibG9ja3MKICAtLS0K
ICBkdXJhdGlvbl9tczogMC4xODAyNDIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBk
dXBsaWNhdGUgY29uZmxpY3RpbmcgZXZpZGVuY2UgYmxvY2tzCm9rIDM3IC0gZHVwbGljYXRlIGNv
bmZsaWN0aW5nIGV2aWRlbmNlIGJsb2NrcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE4MDgzMwog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgY2FuZGlkYXRlIGlzIGJsb2Nr
ZWQgZnJvbSBwcm9kdWN0aW9uIGV4ZWN1dGlvbgpvayAzOCAtIFN0YWdlMTQgY2FuZGlkYXRlIGlz
IGJsb2NrZWQgZnJvbSBwcm9kdWN0aW9uIGV4ZWN1dGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAw
Ljc1MTI0MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgbmV3ZXIgc2Vz
c2lvbiBtYXkgcGFzcyB3aXRob3V0IGhpc3RvcmljYWwgZGV2aWNlIGxvY2sKb2sgMzkgLSBTdGFn
ZTE0IG5ld2VyIHNlc3Npb24gbWF5IHBhc3Mgd2l0aG91dCBoaXN0b3JpY2FsIGRldmljZSBsb2Nr
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjE0NTM0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogU3RhZ2UxNCBwcmVmbGlnaHQgcHJlY2VkZXMgd3JpdGVyIHJldm9jYXRpb24Kb2sgNDAg
LSBTdGFnZTE0IHByZWZsaWdodCBwcmVjZWRlcyB3cml0ZXIgcmV2b2NhdGlvbgogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjIyNTEwOQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdl
MTQgb2xkIHdyaXRlciB0b2tlbiByZXZva2VkIGFuZCBzZXNzaW9uIGdlbmVyYXRpb24gcm90YXRl
ZApvayA0MSAtIFN0YWdlMTQgb2xkIHdyaXRlciB0b2tlbiByZXZva2VkIGFuZCBzZXNzaW9uIGdl
bmVyYXRpb24gcm90YXRlZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI1MzA5MQogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgY29tbWl0IHZhbGlkYXRlcyBzZXNzaW9uIHRv
a2VuIGdlbmVyYXRpb24gYW5kIGNsb3VkIHJldmlzaW9uCm9rIDQyIC0gU3RhZ2UxNCBjb21taXQg
dmFsaWRhdGVzIHNlc3Npb24gdG9rZW4gZ2VuZXJhdGlvbiBhbmQgY2xvdWQgcmV2aXNpb24KICAt
LS0KICBkdXJhdGlvbl9tczogMS4xNTM3NDkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBTdGFnZTE0IGNhbmRpZGF0ZSByZWplY3RzIG9sZGVyIGF1dGggbG9naW4gZXZlbiBhZnRlciBu
ZXdlciBzZXNzaW9uIGV4cGlyZXMKb2sgNDMgLSBTdGFnZTE0IGNhbmRpZGF0ZSByZWplY3RzIG9s
ZGVyIGF1dGggbG9naW4gZXZlbiBhZnRlciBuZXdlciBzZXNzaW9uIGV4cGlyZXMKICAtLS0KICBk
dXJhdGlvbl9tczogMC4xMDYxOAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbXBs
ZXRlIGludmVudG9yeSBwYXNzZXMgcHJlc2VuY2Utb25seSBnYXRlCm9rIDQ0IC0gY29tcGxldGUg
aW52ZW50b3J5IHBhc3NlcyBwcmVzZW5jZS1vbmx5IGdhdGUKICAtLS0KICBkdXJhdGlvbl9tczog
MC44NDkxMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG1pc3NpbmcgZXZpZGVuY2Ug
ZmFpbHMgY2xvc2VkCm9rIDQ1IC0gbWlzc2luZyBldmlkZW5jZSBmYWlscyBjbG9zZWQKICAtLS0K
ICBkdXJhdGlvbl9tczogMS4xODEzNTEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBk
dXBsaWNhdGUgY29sdW1uIGV2aWRlbmNlIGZhaWxzCm9rIDQ2IC0gZHVwbGljYXRlIGNvbHVtbiBl
dmlkZW5jZSBmYWlscwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEzMjgwMQogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IG1pc3NpbmcgaW5zdGFsbGVkIGNvbHVtbiBmYWlscwpvayA0NyAt
IG1pc3NpbmcgaW5zdGFsbGVkIGNvbHVtbiBmYWlscwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIy
MTM0NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVua25vd24gaW5zdGFsbGVkIHN0
YXRlIGZhaWxzCm9rIDQ4IC0gdW5rbm93biBpbnN0YWxsZWQgc3RhdGUgZmFpbHMKICAtLS0KICBk
dXJhdGlvbl9tczogMC4xMzUzMDQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiB1bmtu
b3duIGRhdGEgdHlwZSBmYWlscwpvayA0OSAtIHVua25vd24gZGF0YSB0eXBlIGZhaWxzCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMTgxMzQzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
bm9uLWFycmF5IGV2aWRlbmNlIGZhaWxzCm9rIDUwIC0gbm9uLWFycmF5IGV2aWRlbmNlIGZhaWxz
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjE4OTYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBzdGFnZTE0IHR5cGUgZ2F0ZSBhY2NlcHRzIGV4YWN0IGV4cGVjdGVkIHR5cGVzCm9rIDUx
IC0gc3RhZ2UxNCB0eXBlIGdhdGUgYWNjZXB0cyBleGFjdCBleHBlY3RlZCB0eXBlcwogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjc2ODgzOQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0
YWdlMTQgdHlwZSBnYXRlIHJlamVjdHMgbWlzc2luZyBldmlkZW5jZQpvayA1MiAtIHN0YWdlMTQg
dHlwZSBnYXRlIHJlamVjdHMgbWlzc2luZyBldmlkZW5jZQogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjE5MzQyMgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0YWdlMTQgdHlwZSBnYXRl
IHJlamVjdHMgZHVwbGljYXRlIGV2aWRlbmNlCm9rIDUzIC0gc3RhZ2UxNCB0eXBlIGdhdGUgcmVq
ZWN0cyBkdXBsaWNhdGUgZXZpZGVuY2UKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMDc0NDIKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdGFnZTE0IHR5cGUgZ2F0ZSByZWplY3RzIG1p
c3NpbmcgaW5zdGFsbGVkIGZsYWcKb2sgNTQgLSBzdGFnZTE0IHR5cGUgZ2F0ZSByZWplY3RzIG1p
c3NpbmcgaW5zdGFsbGVkIGZsYWcKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNjAyMzIKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdGFnZTE0IHR5cGUgZ2F0ZSByZWplY3RzIGluY29t
cGF0aWJsZSB1dWlkIHR5cGUKb2sgNTUgLSBzdGFnZTE0IHR5cGUgZ2F0ZSByZWplY3RzIGluY29t
cGF0aWJsZSB1dWlkIHR5cGUKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMTUxNTQKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdGFnZTE0IHR5cGUgZ2F0ZSByZWplY3RzIGludmFsaWQg
aW5wdXQKb2sgNTYgLSBzdGFnZTE0IHR5cGUgZ2F0ZSByZWplY3RzIGludmFsaWQgaW5wdXQKICAt
LS0KICBkdXJhdGlvbl9tczogMC4wOTIyODkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBTdGFnZTE0IFNRTCBjYW5kaWRhdGUgcmV0YWlucyBub24tZGVwbG95YWJsZSBmaXJzdC1zdGF0
ZW1lbnQgZ2F0ZQpvayA1NyAtIFN0YWdlMTQgU1FMIGNhbmRpZGF0ZSByZXRhaW5zIG5vbi1kZXBs
b3lhYmxlIGZpcnN0LXN0YXRlbWVudCBnYXRlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNzM0MTU3
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCB3cml0ZXIgdGFrZW92ZXIg
dmFsaWRhdGVzIGNsb3VkIHByZWZsaWdodCBiZWZvcmUgcmV2b2tpbmcgcHJldmlvdXMgd3JpdGVy
Cm9rIDU4IC0gU3RhZ2UxNCB3cml0ZXIgdGFrZW92ZXIgdmFsaWRhdGVzIGNsb3VkIHByZWZsaWdo
dCBiZWZvcmUgcmV2b2tpbmcgcHJldmlvdXMgd3JpdGVyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MTczMDcxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCBjb21taXQgbmV2
ZXIgc3RvcmVzIHJlamVjdGVkIHJldm9rZWQtd3JpdGVyIHBheWxvYWQgaW4gY29uZmxpY3QgbGVk
Z2VyCm9rIDU5IC0gU3RhZ2UxNCBjb21taXQgbmV2ZXIgc3RvcmVzIHJlamVjdGVkIHJldm9rZWQt
d3JpdGVyIHBheWxvYWQgaW4gY29uZmxpY3QgbGVkZ2VyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MTQ0OTk5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCByZWFkLW9ubHkg
ZW5yb2xsbWVudCBjYW5ub3QgZG93bmdyYWRlIGFjdGl2ZSB3cml0ZXIsIGFuZCByZWFkZXIgYWNj
ZXNzIHJlY2hlY2tzIHBlcm1pc3Npb24Kb2sgNjAgLSBTdGFnZTE0IHJlYWQtb25seSBlbnJvbGxt
ZW50IGNhbm5vdCBkb3duZ3JhZGUgYWN0aXZlIHdyaXRlciwgYW5kIHJlYWRlciBhY2Nlc3MgcmVj
aGVja3MgcGVybWlzc2lvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEwOTYzNgogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0YWdlMTQgZGVmYXVsdHMgYWNjZXB0IGNhbmRpZGF0ZSBt
ZXRhZGF0YQpvayA2MSAtIHN0YWdlMTQgZGVmYXVsdHMgYWNjZXB0IGNhbmRpZGF0ZSBtZXRhZGF0
YQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjgzODE1MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IHN0YWdlMTQgZGVmYXVsdHMgcmVqZWN0IGFic2VudCByb3cKb2sgNjIgLSBzdGFnZTE0
IGRlZmF1bHRzIHJlamVjdCBhYnNlbnQgcm93CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTUwMTc2
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3RhZ2UxNCBkZWZhdWx0cyByZWplY3Qg
ZHVwbGljYXRlIHJvdwpvayA2MyAtIHN0YWdlMTQgZGVmYXVsdHMgcmVqZWN0IGR1cGxpY2F0ZSBy
b3cKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMDI1MTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBzdGFnZTE0IGRlZmF1bHRzIHJlamVjdCBudWxsYWJsZSBib29sZWFuCm9rIDY0IC0g
c3RhZ2UxNCBkZWZhdWx0cyByZWplY3QgbnVsbGFibGUgYm9vbGVhbgogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjIwOTQ5NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0YWdlMTQgZGVm
YXVsdHMgcmVqZWN0IHRydWUgZGVmYXVsdApvayA2NSAtIHN0YWdlMTQgZGVmYXVsdHMgcmVqZWN0
IHRydWUgZGVmYXVsdAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEzMjE0OQogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IHN0YWdlMTQgZGVmYXVsdHMgcmVqZWN0IG51bGwgZGVmYXVsdApv
ayA2NiAtIHN0YWdlMTQgZGVmYXVsdHMgcmVqZWN0IG51bGwgZGVmYXVsdAogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjE3Mjc1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3RhZ2UxNCBk
ZWZhdWx0cyByZWplY3QgdW50cnVzdGVkIGV4cHJlc3Npb24Kb2sgNjcgLSBzdGFnZTE0IGRlZmF1
bHRzIHJlamVjdCB1bnRydXN0ZWQgZXhwcmVzc2lvbgogIC0tLQogIGR1cmF0aW9uX21zOiAxLjA3
OTgyOAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0YWdlMTQgZGVmYXVsdHMgcmVq
ZWN0IG1hbGZvcm1lZCBldmlkZW5jZQpvayA2OCAtIHN0YWdlMTQgZGVmYXVsdHMgcmVqZWN0IG1h
bGZvcm1lZCBldmlkZW5jZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEyMzYyNgogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGJ1bmRsZSBtaXNzaW5nIGFsbCBldmlkZW5jZSBmYWlscyBj
bG9zZWQKb2sgNjkgLSBidW5kbGUgbWlzc2luZyBhbGwgZXZpZGVuY2UgZmFpbHMgY2xvc2VkCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuNzgzNzAyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogYnVuZGxlIG51bGwgZmFpbHMgY2xvc2VkCm9rIDcwIC0gYnVuZGxlIG51bGwgZmFpbHMgY2xv
c2VkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTE3NDk3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogYnVuZGxlIHJlcG9ydHMgZm91ciBpbmRlcGVuZGVudCBnYXRlcwpvayA3MSAtIGJ1
bmRsZSByZXBvcnRzIGZvdXIgaW5kZXBlbmRlbnQgZ2F0ZXMKICAtLS0KICBkdXJhdGlvbl9tczog
MC43MTI1NTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBidW5kbGUgbWlzc2luZyBk
ZWZhdWx0cyBmYWlscyBldmVuIGlmIG90aGVyIHNlY3Rpb25zIHByb3ZpZGVkCm9rIDcyIC0gYnVu
ZGxlIG1pc3NpbmcgZGVmYXVsdHMgZmFpbHMgZXZlbiBpZiBvdGhlciBzZWN0aW9ucyBwcm92aWRl
ZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQzOTQ4MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IGJ1bmRsZSBtYWxmb3JtZWQgc2VjdGlvbiBjYW5ub3QgcGFzcwpvayA3MyAtIGJ1bmRs
ZSBtYWxmb3JtZWQgc2VjdGlvbiBjYW5ub3QgcGFzcwogIC0tLQogIGR1cmF0aW9uX21zOiAxLjM1
MjI3OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGJ1bmRsZSBkb2VzIG5vdCBjbGFp
bSBydW50aW1lIHZhbGlkYXRpb24Kb2sgNzQgLSBidW5kbGUgZG9lcyBub3QgY2xhaW0gcnVudGlt
ZSB2YWxpZGF0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTc3MDA3CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCBleGlzdGluZyBpc19jdXJyZW50IGRlZmF1bHQgZXhw
bGljaXRseSBzZXQgZmFsc2UKb2sgNzUgLSBTdGFnZTE0IGV4aXN0aW5nIGlzX2N1cnJlbnQgZGVm
YXVsdCBleHBsaWNpdGx5IHNldCBmYWxzZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjgwMDQ4Ngog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgZGVmYXVsdCBhbGlnbm1lbnQg
ZG9lcyBub3QgdXBkYXRlIGhpc3RvcmljYWwgZ2FtZSByb3dzCm9rIDc2IC0gU3RhZ2UxNCBkZWZh
dWx0IGFsaWdubWVudCBkb2VzIG5vdCB1cGRhdGUgaGlzdG9yaWNhbCBnYW1lIHJvd3MKICAtLS0K
ICBkdXJhdGlvbl9tczogMC4zNDEzODUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBT
dGFnZTE0IGNhbmRpZGF0ZSByZXRhaW5zIGZhaWwtY2xvc2VkIGd1YXJkIGFoZWFkIG9mIGRlZmF1
bHQgbWlncmF0aW9uCm9rIDc3IC0gU3RhZ2UxNCBjYW5kaWRhdGUgcmV0YWlucyBmYWlsLWNsb3Nl
ZCBndWFyZCBhaGVhZCBvZiBkZWZhdWx0IG1pZ3JhdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjE0NjM2MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgaGlzdG9yeSBy
ZWplY3RzIG1pc3NpbmcsIG51bGwgYW5kIG5vbi1hcnJheSBKU09OCm9rIDc4IC0gU3RhZ2UxNCBo
aXN0b3J5IHJlamVjdHMgbWlzc2luZywgbnVsbCBhbmQgbm9uLWFycmF5IEpTT04KICAtLS0KICBk
dXJhdGlvbl9tczogMC43NTEzNTIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFn
ZTE0IGhpc3RvcnkgYXJyYXkgbGVuZ3RoIGNoZWNrZWQgb25seSBhZnRlciB0eXBlIGd1YXJkCm9r
IDc5IC0gU3RhZ2UxNCBoaXN0b3J5IGFycmF5IGxlbmd0aCBjaGVja2VkIG9ubHkgYWZ0ZXIgdHlw
ZSBndWFyZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIxMjMzCiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogU3RhZ2UxNCBjYW5kaWRhdGUgcmVtYWlucyBibG9ja2VkIGJlZm9yZSBEREwK
b2sgODAgLSBTdGFnZTE0IGNhbmRpZGF0ZSByZW1haW5zIGJsb2NrZWQgYmVmb3JlIERETAogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjA5OTE1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
bWlzbWF0Y2ggcmVzcG9uc2UgZG9lcyBub3QgcmV0dXJuIGNsb3VkIGdhbWUgc25hcHNob3QKb2sg
ODEgLSBtaXNtYXRjaCByZXNwb25zZSBkb2VzIG5vdCByZXR1cm4gY2xvdWQgZ2FtZSBzbmFwc2hv
dAogIC0tLQogIGR1cmF0aW9uX21zOiAxLjEyMDI5OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IGRlcGxveW1lbnQgZ3VhcmQgcmVtYWlucyBpbnRhY3QKb2sgODIgLSBkZXBsb3ltZW50
IGd1YXJkIHJlbWFpbnMgaW50YWN0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTY4MTMzCiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCBwcm9kdWN0aW9uIGJvdW5kYXJ5IHJl
bWFpbnMgZmFpbCBjbG9zZWQKb2sgODMgLSBTdGFnZTE0IHByb2R1Y3Rpb24gYm91bmRhcnkgcmVt
YWlucyBmYWlsIGNsb3NlZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjk0MDQ3OAogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlMTQgZHJhZnQgcmVxdWlyZXMgc2NoZW1hIGNvbHVt
bnMgYWJzZW50IGZyb20gcHJvZHVjdGlvbiBtZXRhZGF0YSBleHBvcnQKb2sgODQgLSBTdGFnZTE0
IGRyYWZ0IHJlcXVpcmVzIHNjaGVtYSBjb2x1bW5zIGFic2VudCBmcm9tIHByb2R1Y3Rpb24gbWV0
YWRhdGEgZXhwb3J0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTQ0NDI4CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogU3RhZ2UxNCBkcmFmdCBkb2VzIG5vdCBzaWxlbnRseSByZXBsYWNl
IGV4aXN0aW5nIGN1cnJlbnQtZ2FtZSBkZWZhdWx0Cm9rIDg1IC0gU3RhZ2UxNCBkcmFmdCBkb2Vz
IG5vdCBzaWxlbnRseSByZXBsYWNlIGV4aXN0aW5nIGN1cnJlbnQtZ2FtZSBkZWZhdWx0CiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMTExOTQ5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
U3RhZ2UxNCBzaW5nbGUtZGV2aWNlIHdyaXRlciB0YWtlb3ZlciBpcyBpbnRlbnRpb25hbGx5IGJs
b2NrZWQsIG5vdCBhdXRvbWF0aWMKb2sgODYgLSBTdGFnZTE0IHNpbmdsZS1kZXZpY2Ugd3JpdGVy
IHRha2VvdmVyIGlzIGludGVudGlvbmFsbHkgYmxvY2tlZCwgbm90IGF1dG9tYXRpYwogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjA5NzQ5NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0
YWdlMTQgY29tbWl0IHZhbGlkYXRlcyB0b2tlbiBhbmQgYXV0aC1zZXNzaW9uIGJpbmRpbmcKb2sg
ODcgLSBTdGFnZTE0IGNvbW1pdCB2YWxpZGF0ZXMgdG9rZW4gYW5kIGF1dGgtc2Vzc2lvbiBiaW5k
aW5nCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTk0MDEyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogcmV2b2tlZCB3cml0ZXIgYXR0ZW1wdHMgbmV2ZXIgcGVyc2lzdCBwcm9wb3NlZCBz
bmFwc2hvdHMKb2sgODggLSByZXZva2VkIHdyaXRlciBhdHRlbXB0cyBuZXZlciBwZXJzaXN0IHBy
b3Bvc2VkIHNuYXBzaG90cwogIC0tLQogIGR1cmF0aW9uX21zOiAxLjA0NjU2OAogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlamVjdGVkIHdyaXRlciBzdGlsbCByZWNlaXZlcyBleHBs
aWNpdCByZXZvY2F0aW9uIHJlYXNvbgpvayA4OSAtIHJlamVjdGVkIHdyaXRlciBzdGlsbCByZWNl
aXZlcyBleHBsaWNpdCByZXZvY2F0aW9uIHJlYXNvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIz
ODkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZXZpc2lvbi1jb25mbGljdCByZXRh
aW5zIGF1dGhvcml6ZWQgY29uZmxpY3QgbGVkZ2VyCm9rIDkwIC0gcmV2aXNpb24tY29uZmxpY3Qg
cmV0YWlucyBhdXRob3JpemVkIGNvbmZsaWN0IGxlZGdlcgogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjE4MjExNQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJldm9rZWQgd3JpdGVyIGNh
bm5vdCB1cGRhdGUgY2Fub25pY2FsIGdhbWUgZGF0YQpvayA5MSAtIHJldm9rZWQgd3JpdGVyIGNh
bm5vdCB1cGRhdGUgY2Fub25pY2FsIGdhbWUgZGF0YQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE5
MTEwOAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbW1pdCByZW1haW5zIGJvdW5k
IHRvIGF1dGggc2Vzc2lvbgpvayA5MiAtIGNvbW1pdCByZW1haW5zIGJvdW5kIHRvIGF1dGggc2Vz
c2lvbgogIC0tLQogIGR1cmF0aW9uX21zOiAxLjEwODIzMQogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IGNhbmRpZGF0ZSByZW1haW5zIGJsb2NrZWQgZnJvbSBkZXBsb3ltZW50Cm9rIDkz
IC0gY2FuZGlkYXRlIHJlbWFpbnMgYmxvY2tlZCBmcm9tIGRlcGxveW1lbnQKICAtLS0KICBkdXJh
dGlvbl9tczogMC4xMzc5NTgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBycGMgZXZp
ZGVuY2UgYWNjZXB0cyBjb21wbGV0ZSBjYW5kaWRhdGUgbWV0YWRhdGEKb2sgOTQgLSBycGMgZXZp
ZGVuY2UgYWNjZXB0cyBjb21wbGV0ZSBjYW5kaWRhdGUgbWV0YWRhdGEKICAtLS0KICBkdXJhdGlv
bl9tczogMS4yMzQyNgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJwYyBldmlkZW5j
ZSBmYWlscyBjbG9zZWQgd2l0aG91dCByb3dzCm9rIDk1IC0gcnBjIGV2aWRlbmNlIGZhaWxzIGNs
b3NlZCB3aXRob3V0IHJvd3MKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMDUyMjkKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBycGMgZXZpZGVuY2UgcmVqZWN0cyBtaXNzaW5nIGZ1bmN0
aW9uCm9rIDk2IC0gcnBjIGV2aWRlbmNlIHJlamVjdHMgbWlzc2luZyBmdW5jdGlvbgogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjE3NjM1NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJw
YyBldmlkZW5jZSByZWplY3RzIGR1cGxpY2F0ZSBmdW5jdGlvbgpvayA5NyAtIHJwYyBldmlkZW5j
ZSByZWplY3RzIGR1cGxpY2F0ZSBmdW5jdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIyNDEx
OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJwYyBldmlkZW5jZSByZWplY3RzIGFu
b255bW91cyBleGVjdXRpb24Kb2sgOTggLSBycGMgZXZpZGVuY2UgcmVqZWN0cyBhbm9ueW1vdXMg
ZXhlY3V0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTc4NjA5CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogcnBjIGV2aWRlbmNlIHJlamVjdHMgUFVCTElDIGV4ZWN1dGlvbgpvayA5
OSAtIHJwYyBldmlkZW5jZSByZWplY3RzIFBVQkxJQyBleGVjdXRpb24KICAtLS0KICBkdXJhdGlv
bl9tczogMC4xODc1NzIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBycGMgZXZpZGVu
Y2UgcmVqZWN0cyBtaXNzaW5nIHNlY3VyZSBzZWFyY2ggcGF0aApvayAxMDAgLSBycGMgZXZpZGVu
Y2UgcmVqZWN0cyBtaXNzaW5nIHNlY3VyZSBzZWFyY2ggcGF0aAogIC0tLQogIGR1cmF0aW9uX21z
OiAzLjY0MzI1MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJwYyBldmlkZW5jZSBy
ZWplY3RzIHVuY29uZmlybWVkIHNlY3VyaXR5IGRlZmluZXIKb2sgMTAxIC0gcnBjIGV2aWRlbmNl
IHJlamVjdHMgdW5jb25maXJtZWQgc2VjdXJpdHkgZGVmaW5lcgogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjE2NzI2MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpZ25hdHVyZSBpbnZl
bnRvcnkgYWNjZXB0cyB1bmlxdWUgY29tcGxldGUgY2FuZGlkYXRlCm9rIDEwMiAtIHNpZ25hdHVy
ZSBpbnZlbnRvcnkgYWNjZXB0cyB1bmlxdWUgY29tcGxldGUgY2FuZGlkYXRlCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuODI3MjE3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2lnbmF0
dXJlIGludmVudG9yeSBmYWlscyBjbG9zZWQgb24gbWlzc2luZyBpbnB1dApvayAxMDMgLSBzaWdu
YXR1cmUgaW52ZW50b3J5IGZhaWxzIGNsb3NlZCBvbiBtaXNzaW5nIGlucHV0CiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMTM3MDA2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2lnbmF0
dXJlIGludmVudG9yeSByZWplY3RzIG1pc3NpbmcgUlBDCm9rIDEwNCAtIHNpZ25hdHVyZSBpbnZl
bnRvcnkgcmVqZWN0cyBtaXNzaW5nIFJQQwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjA5OTM0CiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2lnbmF0dXJlIGludmVudG9yeSByZWplY3Rz
IG92ZXJsb2FkZWQgUlBDCm9rIDEwNSAtIHNpZ25hdHVyZSBpbnZlbnRvcnkgcmVqZWN0cyBvdmVy
bG9hZGVkIFJQQwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE1NzkxOQogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IHNpZ25hdHVyZSBpbnZlbnRvcnkgcmVqZWN0cyBjcm9zcy1zY2hlbWEg
c2hhZG93Cm9rIDEwNiAtIHNpZ25hdHVyZSBpbnZlbnRvcnkgcmVqZWN0cyBjcm9zcy1zY2hlbWEg
c2hhZG93CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTAzNzE2CiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogc2lnbmF0dXJlIGludmVudG9yeSByZWplY3RzIHByb2NlZHVyZSBraW5kCm9r
IDEwNyAtIHNpZ25hdHVyZSBpbnZlbnRvcnkgcmVqZWN0cyBwcm9jZWR1cmUga2luZAogIC0tLQog
IGR1cmF0aW9uX21zOiAxLjIxMzQzOQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNp
Z25hdHVyZSBpbnZlbnRvcnkgcmVqZWN0cyBhYnNlbnQgaWRlbnRpdHkgYXJndW1lbnRzCm9rIDEw
OCAtIHNpZ25hdHVyZSBpbnZlbnRvcnkgcmVqZWN0cyBhYnNlbnQgaWRlbnRpdHkgYXJndW1lbnRz
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTcxMTg4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogc2lnbmF0dXJlIGludmVudG9yeSByZWplY3RzIHVuc2FmZSBzZWFyY2ggcGF0aApvayAx
MDkgLSBzaWduYXR1cmUgaW52ZW50b3J5IHJlamVjdHMgdW5zYWZlIHNlYXJjaCBwYXRoCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMDg5ODI2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
c2lnbmF0dXJlIGludmVudG9yeSByZWplY3RzIGludm9rZXIgcmlnaHRzCm9rIDExMCAtIHNpZ25h
dHVyZSBpbnZlbnRvcnkgcmVqZWN0cyBpbnZva2VyIHJpZ2h0cwogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjI1MzIxMgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFJQQyBpbnZlbnRvcnkg
cXVlcnkgaXMgU0VMRUNULW9ubHkKb2sgMTExIC0gUlBDIGludmVudG9yeSBxdWVyeSBpcyBTRUxF
Q1Qtb25seQogIC0tLQogIGR1cmF0aW9uX21zOiAxLjMyMTYzMgogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IFJQQyBpbnZlbnRvcnkgaW5jbHVkZXMgYWxsIGZpdmUgdGFyZ2V0IGZ1bmN0
aW9ucwpvayAxMTIgLSBSUEMgaW52ZW50b3J5IGluY2x1ZGVzIGFsbCBmaXZlIHRhcmdldCBmdW5j
dGlvbnMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNDc5NzMKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBSUEMgaW52ZW50b3J5IGluY2x1ZGVzIGNyb3NzLXNjaGVtYSBzaGFkb3cgZnVu
Y3Rpb25zCm9rIDExMyAtIFJQQyBpbnZlbnRvcnkgaW5jbHVkZXMgY3Jvc3Mtc2NoZW1hIHNoYWRv
dyBmdW5jdGlvbnMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMTU2ODUKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBSUEMgaW52ZW50b3J5IHJlYWRzIHBnX3Byb2MgZnVuY3Rpb24gaWRl
bnRpdHkgYW5kIGRlZmluZXIKb2sgMTE0IC0gUlBDIGludmVudG9yeSByZWFkcyBwZ19wcm9jIGZ1
bmN0aW9uIGlkZW50aXR5IGFuZCBkZWZpbmVyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTM4NDU5
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogUlBDIGludmVudG9yeSBjb25zZXJ2YXRp
dmVseSBjaGVja3MgY29uZmlndXJlZCBzZWFyY2hfcGF0aApvayAxMTUgLSBSUEMgaW52ZW50b3J5
IGNvbnNlcnZhdGl2ZWx5IGNoZWNrcyBjb25maWd1cmVkIHNlYXJjaF9wYXRoCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMTY1MTk5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2Ux
NCByZWFkLW9ubHkgcHJlZmxpZ2h0IGV4cG9zZXMgYm90aCBtaXNzaW5nIHRyYW5zZmVyIGNvbHVt
bnMKb2sgMTE2IC0gU3RhZ2UxNCByZWFkLW9ubHkgcHJlZmxpZ2h0IGV4cG9zZXMgYm90aCBtaXNz
aW5nIHRyYW5zZmVyIGNvbHVtbnMKICAtLS0KICBkdXJhdGlvbl9tczogMS4zOTg2MTgKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZTE0IHByZWZsaWdodCByZXBvcnRzIGV4aXN0
aW5nIGlzX2N1cnJlbnQgZGVmYXVsdCBmb3IgYWxpZ25tZW50Cm9rIDExNyAtIFN0YWdlMTQgcHJl
ZmxpZ2h0IHJlcG9ydHMgZXhpc3RpbmcgaXNfY3VycmVudCBkZWZhdWx0IGZvciBhbGlnbm1lbnQK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4xNjI5NDUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBTdGFnZTE0IHNjaGVtYSBpbnZlbnRvcnkgcmV0YWlucyBhYnNlbnQgY29sdW1ucyB0aHJv
dWdoIGxlZnQgam9pbgpvayAxMTggLSBTdGFnZTE0IHNjaGVtYSBpbnZlbnRvcnkgcmV0YWlucyBh
YnNlbnQgY29sdW1ucyB0aHJvdWdoIGxlZnQgam9pbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE1
MzY0MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0cmljdCBnYXRlIHVzZXMgYXV0
aGVudGljYXRlZCByb2xlIGFuZCByb2xsYmFjawpvayAxMTkgLSBzdHJpY3QgZ2F0ZSB1c2VzIGF1
dGhlbnRpY2F0ZWQgcm9sZSBhbmQgcm9sbGJhY2sKICAtLS0KICBkdXJhdGlvbl9tczogMC43Mzk4
MjUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdHJpY3Qgb3BlbiByZXF1aXJlcyAy
ODAwMApvayAxMjAgLSBzdHJpY3Qgb3BlbiByZXF1aXJlcyAyODAwMAogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjE2MTIzMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0cmljdCBjb21t
aXQgcmVxdWlyZXMgMjgwMDAKb2sgMTIxIC0gc3RyaWN0IGNvbW1pdCByZXF1aXJlcyAyODAwMAog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjA4NTk5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogc3RyaWN0IG9wZW5fcmVhZGVyIHJlcXVpcmVzIDI4MDAwCm9rIDEyMiAtIHN0cmljdCBvcGVu
X3JlYWRlciByZXF1aXJlcyAyODAwMAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjA3MTM0NwogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0cmljdCByZWFkIHJlcXVpcmVzIDI4MDAwCm9r
IDEyMyAtIHN0cmljdCByZWFkIHJlcXVpcmVzIDI4MDAwCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MTY3ODMzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3RyaWN0IGxlYXNlX3N0YXR1
cyByZXF1aXJlcyAyODAwMApvayAxMjQgLSBzdHJpY3QgbGVhc2Vfc3RhdHVzIHJlcXVpcmVzIDI4
MDAwCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMDgzNjM2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogc3RyaWN0IGdhdGUgZG9lcyBub3QgdHJlYXQgb2s6ZmFsc2UgYXMgc3VjY2Vzcwpv
ayAxMjUgLSBzdHJpY3QgZ2F0ZSBkb2VzIG5vdCB0cmVhdCBvazpmYWxzZSBhcyBzdWNjZXNzCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMTUzOTUyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogc3VwYWJhc2Vfc3luY19zdGFnZTE0X3RyYW5zZmVyX2NhbmRpZGF0ZV9ET19OT1RfREVQTE9Z
LnNxbDogYWxsIHNpeCBSUEMgYXV0aCBjaGVja3MgZmFpbCBjbG9zZWQgZm9yIE5VTEwgY3JlYXRl
ZF9hdApvayAxMjYgLSBzdXBhYmFzZV9zeW5jX3N0YWdlMTRfdHJhbnNmZXJfY2FuZGlkYXRlX0RP
X05PVF9ERVBMT1kuc3FsOiBhbGwgc2l4IFJQQyBhdXRoIGNoZWNrcyBmYWlsIGNsb3NlZCBmb3Ig
TlVMTCBjcmVhdGVkX2F0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuOTIxNDY5CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogc3VwYWJhc2Vfc3luY19ycGNfZHJhZnQuc3FsOiBhbGwgc2l4
IFJQQyBhdXRoIGNoZWNrcyBmYWlsIGNsb3NlZCBmb3IgTlVMTCBjcmVhdGVkX2F0Cm9rIDEyNyAt
IHN1cGFiYXNlX3N5bmNfcnBjX2RyYWZ0LnNxbDogYWxsIHNpeCBSUEMgYXV0aCBjaGVja3MgZmFp
bCBjbG9zZWQgZm9yIE5VTEwgY3JlYXRlZF9hdAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI2OTgw
NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNhdGFsb2cgZ2F0ZSBpbmNsdWRlcyBt
YWhqb25nX2RldmljZV9zZXNzaW9ucwpvayAxMjggLSBjYXRhbG9nIGdhdGUgaW5jbHVkZXMgbWFo
am9uZ19kZXZpY2Vfc2Vzc2lvbnMKICAtLS0KICBkdXJhdGlvbl9tczogMC45OTA4MzQKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjYXRhbG9nIGdhdGUgaW5jbHVkZXMgbWFoam9uZ19n
YW1lX3N0YXRlcwpvayAxMjkgLSBjYXRhbG9nIGdhdGUgaW5jbHVkZXMgbWFoam9uZ19nYW1lX3N0
YXRlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE0OTcwNgogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IGNhdGFsb2cgZ2F0ZSBpbmNsdWRlcyBtYWhqb25nX3Nlc3Npb25fYXVkaXQKb2sg
MTMwIC0gY2F0YWxvZyBnYXRlIGluY2x1ZGVzIG1haGpvbmdfc2Vzc2lvbl9hdWRpdAogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjA3Mjk5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY2F0
YWxvZyBnYXRlIGluY2x1ZGVzIG1haGpvbmdfc3luY19jb25mbGljdHMKb2sgMTMxIC0gY2F0YWxv
ZyBnYXRlIGluY2x1ZGVzIG1haGpvbmdfc3luY19jb25mbGljdHMKICAtLS0KICBkdXJhdGlvbl9t
czogMC4wNjc5NjMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjYXRhbG9nIGdhdGUg
aW5jbHVkZXMgbWFoam9uZ19zeW5jX29wZW4Kb2sgMTMyIC0gY2F0YWxvZyBnYXRlIGluY2x1ZGVz
IG1haGpvbmdfc3luY19vcGVuCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjA1MTk5CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY2F0YWxvZyBnYXRlIGluY2x1ZGVzIG1haGpvbmdfc3lu
Y19jb21taXQKb2sgMTMzIC0gY2F0YWxvZyBnYXRlIGluY2x1ZGVzIG1haGpvbmdfc3luY19jb21t
aXQKICAtLS0KICBkdXJhdGlvbl9tczogMC4wNjQ2MDgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBjYXRhbG9nIGdhdGUgaW5jbHVkZXMgbWFoam9uZ19zeW5jX29wZW5fcmVhZGVyCm9r
IDEzNCAtIGNhdGFsb2cgZ2F0ZSBpbmNsdWRlcyBtYWhqb25nX3N5bmNfb3Blbl9yZWFkZXIKICAt
LS0KICBkdXJhdGlvbl9tczogMC45MDA2NDcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBjYXRhbG9nIGdhdGUgaW5jbHVkZXMgbWFoam9uZ19zeW5jX3JlYWQKb2sgMTM1IC0gY2F0YWxv
ZyBnYXRlIGluY2x1ZGVzIG1haGpvbmdfc3luY19yZWFkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MDg3NTUyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY2F0YWxvZyBnYXRlIGluY2x1
ZGVzIG1haGpvbmdfc3luY19sZWFzZV9zdGF0dXMKb2sgMTM2IC0gY2F0YWxvZyBnYXRlIGluY2x1
ZGVzIG1haGpvbmdfc3luY19sZWFzZV9zdGF0dXMKICAtLS0KICBkdXJhdGlvbl9tczogMC4zNTE2
MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNhdGFsb2cgZ2F0ZSBoYXMgbm8gRERM
IG9yIERNTCBzdGF0ZW1lbnRzCm9rIDEzNyAtIGNhdGFsb2cgZ2F0ZSBoYXMgbm8gRERMIG9yIERN
TCBzdGF0ZW1lbnRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNjYxMzU3CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogY29tYmluZWQgcmV2aWV3IGhhcyBleHBsaWNpdCBibG9ja2luZyBz
ZW50aW5lbApvayAxMzggLSBjb21iaW5lZCByZXZpZXcgaGFzIGV4cGxpY2l0IGJsb2NraW5nIHNl
bnRpbmVsCiAgLS0tCiAgZHVyYXRpb25fbXM6IDIuMTk2MDYKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBjb21iaW5lZCBjYW5kaWRhdGUgcHJlc2VydmVzIGZpdmUgUlBDIGRlZmluaXRp
b25zCm9rIDEzOSAtIGNvbWJpbmVkIGNhbmRpZGF0ZSBwcmVzZXJ2ZXMgZml2ZSBSUEMgZGVmaW5p
dGlvbnMKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNTIwNQogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IGNvbWJpbmVkIGNhbmRpZGF0ZSBwcmVzZXJ2ZXMgc3RyaWN0IHZhbGlkYXRvcgpv
ayAxNDAgLSBjb21iaW5lZCBjYW5kaWRhdGUgcHJlc2VydmVzIHN0cmljdCB2YWxpZGF0b3IKICAt
LS0KICBkdXJhdGlvbl9tczogMC4xMzE2ODkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBjb21iaW5lZCBjYW5kaWRhdGUgaGFzIHRyYW5zYWN0aW9uIGVuZCBidXQgY2Fubm90IGJ5cGFz
cyBzZW50aW5lbApvayAxNDEgLSBjb21iaW5lZCBjYW5kaWRhdGUgaGFzIHRyYW5zYWN0aW9uIGVu
ZCBidXQgY2Fubm90IGJ5cGFzcyBzZW50aW5lbAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI5NDc3
NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNhdGFsb2cgcHJlZmxpZ2h0IG9ubHkg
dXNlcyBTRUxFQ1QKb2sgMTQyIC0gY2F0YWxvZyBwcmVmbGlnaHQgb25seSB1c2VzIFNFTEVDVAog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjQzNzMyOQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IGFjdGl2ZSBmb3VuZGF0aW9uIGV4Y2x1ZGVzIGZpdmUgdW5pbnN0YWxsZWQgUlBDcwpvayAx
NDMgLSBhY3RpdmUgZm91bmRhdGlvbiBleGNsdWRlcyBmaXZlIHVuaW5zdGFsbGVkIFJQQ3MKICAt
LS0KICBkdXJhdGlvbl9tczogMC4xNDY0OTEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBjYW5kaWRhdGUgcmVxdWlyZXMgcmVhbCBhdXRoIHNlc3Npb24gdmFsaWRhdGlvbgpvayAxNDQg
LSBjYW5kaWRhdGUgcmVxdWlyZXMgcmVhbCBhdXRoIHNlc3Npb24gdmFsaWRhdGlvbgogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjE3MzMzMQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNh
bmRpZGF0ZSBiaW5kcyB3cml0ZXIgdG9rZW4gdG8gZ2VuZXJhdGlvbiBhbmQgcmV2aXNpb24Kb2sg
MTQ1IC0gY2FuZGlkYXRlIGJpbmRzIHdyaXRlciB0b2tlbiB0byBnZW5lcmF0aW9uIGFuZCByZXZp
c2lvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE0ODY0NAogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IGNhbmRpZGF0ZSBjaGVja3Mgd3JpdGVyIGF1dGggYWdhaW4gYWZ0ZXIgbG9ja2lu
ZwpvayAxNDYgLSBjYW5kaWRhdGUgY2hlY2tzIHdyaXRlciBhdXRoIGFnYWluIGFmdGVyIGxvY2tp
bmcKICAtLS0KICBkdXJhdGlvbl9tczogMC40MTE4NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IGZpbmFsIGNhdGFsb2cgcXVlcnkgaGFzIG9uZSBTRUxFQ1QgcmVzdWx0IHN0YXRlbWVu
dApvayAxNDcgLSBmaW5hbCBjYXRhbG9nIHF1ZXJ5IGhhcyBvbmUgU0VMRUNUIHJlc3VsdCBzdGF0
ZW1lbnQKICAtLS0KICBkdXJhdGlvbl9tczogMC45NjY0MDYKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBjYXRhbG9nIHF1ZXJ5IGhhcyBubyB3cml0ZSBzdGF0ZW1lbnRzCm9rIDE0OCAt
IGNhdGFsb2cgcXVlcnkgaGFzIG5vIHdyaXRlIHN0YXRlbWVudHMKICAtLS0KICBkdXJhdGlvbl9t
czogMC4zNTMwMTIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjYXRhbG9nIGNoZWNr
cyBQVUJMSUMgZGlyZWN0IEFDTCBub3QgUG9zdGdyZVNRTCBwdWJsaWMgcm9sZQpvayAxNDkgLSBj
YXRhbG9nIGNoZWNrcyBQVUJMSUMgZGlyZWN0IEFDTCBub3QgUG9zdGdyZVNRTCBwdWJsaWMgcm9s
ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEyMjMxNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IGNhdGFsb2cgY2hlY2tzIGVmZmVjdGl2ZSBhbm9uIGFjY2VzcwpvayAxNTAgLSBjYXRh
bG9nIGNoZWNrcyBlZmZlY3RpdmUgYW5vbiBhY2Nlc3MKICAtLS0KICBkdXJhdGlvbl9tczogMC4x
NTQ0MTMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjYXRhbG9nIGNoZWNrcyBlZmZl
Y3RpdmUgYXV0aGVudGljYXRlZCBhY2Nlc3MKb2sgMTUxIC0gY2F0YWxvZyBjaGVja3MgZWZmZWN0
aXZlIGF1dGhlbnRpY2F0ZWQgYWNjZXNzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTExMTM4CiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY2F0YWxvZyBsaXN0cyBmaXZlIHRyYW5zZmVy
IFJQQ3MKb2sgMTUyIC0gY2F0YWxvZyBsaXN0cyBmaXZlIHRyYW5zZmVyIFJQQ3MKICAtLS0KICBk
dXJhdGlvbl9tczogMC4xNTU4NDUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjYW5k
aWRhdGUgcmV0YWlucyBmYWlsLWNsb3NlZCBzZW50aW5lbApvayAxNTMgLSBjYW5kaWRhdGUgcmV0
YWlucyBmYWlsLWNsb3NlZCBzZW50aW5lbAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjA4MzY3Ngog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlbGVhc2UgZ2F0ZSBleHBsaWNpdGx5IGJs
b2NrcyBkZXBsb3ltZW50Cm9rIDE1NCAtIHJlbGVhc2UgZ2F0ZSBleHBsaWNpdGx5IGJsb2NrcyBk
ZXBsb3ltZW50CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTYzNjM3CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogcmVsZWFzZSBnYXRlIGRvY3VtZW50cyB0d28tZGV2aWNlIHRlc3Rpbmcg
YmxvY2tlcgpvayAxNTUgLSByZWxlYXNlIGdhdGUgZG9jdW1lbnRzIHR3by1kZXZpY2UgdGVzdGlu
ZyBibG9ja2VyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzI3NTEzCiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogc3RhZ2luZyBoYW5kb2ZmIGV4cGxpY2l0bHkgcHJvaGliaXRzIHByb2R1
Y3Rpb24gbWlncmF0aW9uCm9rIDE1NiAtIHN0YWdpbmcgaGFuZG9mZiBleHBsaWNpdGx5IHByb2hp
Yml0cyBwcm9kdWN0aW9uIG1pZ3JhdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjc3MTIwMgog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHRyYW5zZmVyIGNhbmRpZGF0ZSBzdGlsbCBh
Ym9ydHMgYmVmb3JlIGFueSBtaWdyYXRpb24Kb2sgMTU3IC0gdHJhbnNmZXIgY2FuZGlkYXRlIHN0
aWxsIGFib3J0cyBiZWZvcmUgYW55IG1pZ3JhdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQx
NDYxNQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbWJpbmVkIGludGVncmF0aW9u
IGNhbmRpZGF0ZSBzdGlsbCBhYm9ydHMKb2sgMTU4IC0gY29tYmluZWQgaW50ZWdyYXRpb24gY2Fu
ZGlkYXRlIHN0aWxsIGFib3J0cwogIC0tLQogIGR1cmF0aW9uX21zOiAxLjQ0NDQ5OAogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHByb3RvY29sIHJlcXVpcmVzIGFsbCAxMiBhY2NlcHRh
bmNlIHNjZW5hcmlvcwpvayAxNTkgLSBwcm90b2NvbCByZXF1aXJlcyBhbGwgMTIgYWNjZXB0YW5j
ZSBzY2VuYXJpb3MKICAtLS0KICBkdXJhdGlvbl9tczogMC4xOTkzNzEKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBzdGFnaW5nIGhhbmRvZmYgZm9yYmlkcyBjb3B5aW5nIHNlY3JldHMg
b3IgbGl2ZSBkYXRhCm9rIDE2MCAtIHN0YWdpbmcgaGFuZG9mZiBmb3JiaWRzIGNvcHlpbmcgc2Vj
cmV0cyBvciBsaXZlIGRhdGEKICAtLS0KICBkdXJhdGlvbl9tczogMC4zMTM4MjMKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBkZXBsb3ltZW50IGZhaWwtY2xvc2VkIHNlbnRpbmVsCm9r
IDE2MSAtIGRlcGxveW1lbnQgZmFpbC1jbG9zZWQgc2VudGluZWwKICAtLS0KICBkdXJhdGlvbl9t
czogMS4xMTIzMzcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzaWduZWQgYXV0aCBz
ZXNzaW9uIGJpbmRpbmdzCm9rIDE2MiAtIHNpZ25lZCBhdXRoIHNlc3Npb24gYmluZGluZ3MKICAt
LS0KICBkdXJhdGlvbl9tczogMC4xNTU2MjUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBvd25lciByb3cgbG9jayBmb3IgY29uY3VycmVudCB3cml0ZXJzCm9rIDE2MyAtIG93bmVyIHJv
dyBsb2NrIGZvciBjb25jdXJyZW50IHdyaXRlcnMKICAtLS0KICBkdXJhdGlvbl9tczogMC4wNzMz
NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHBvc3QtbG9jayBhdXRoIHNlc3Npb24g
cmV2YWxpZGF0aW9uCm9rIDE2NCAtIHBvc3QtbG9jayBhdXRoIHNlc3Npb24gcmV2YWxpZGF0aW9u
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNzk1NTM5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogcGVyc2lzdGVudCBuZXdlci1zZXNzaW9uIGhpZ2gtd2F0ZXIKb2sgMTY1IC0gcGVyc2lz
dGVudCBuZXdlci1zZXNzaW9uIGhpZ2gtd2F0ZXIKICAtLS0KICBkdXJhdGlvbl9tczogMC4wODQw
MjcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZXZva2VkIHdyaXRlciBwcm9wb3Nh
bCBub3QgcGVyc2lzdGVkCm9rIDE2NiAtIHJldm9rZWQgd3JpdGVyIHByb3Bvc2FsIG5vdCBwZXJz
aXN0ZWQKICAtLS0KICBkdXJhdGlvbl9tczogMC4wNjUzNTgKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiByZXZpc2lvbiBjb25mbGljdCBkZXRlY3Rpb24Kb2sgMTY3IC0gcmV2aXNpb24g
Y29uZmxpY3QgZGV0ZWN0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMDUxNzA4CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZGVyIGFjY2VzcyByZXZva2VkIHdoZW4gcGVybWlz
c2lvbiBkaXNhYmxlZApvayAxNjggLSByZWFkZXIgYWNjZXNzIHJldm9rZWQgd2hlbiBwZXJtaXNz
aW9uIGRpc2FibGVkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMDU4MDI4CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogaGFyZGVuZWQgaGlzdG9yeSB2YWxpZGF0b3IKb2sgMTY5IC0gaGFy
ZGVuZWQgaGlzdG9yeSB2YWxpZGF0b3IKICAtLS0KICBkdXJhdGlvbl9tczogMC4xOTAwODcKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhZGFwdGVyIHJlamVjdHMgbmFtZWQgYXJyYXkg
bWV0YWRhdGEgYmVmb3JlIG5ldHdvcmsgcmVxdWVzdApvayAxNzAgLSBhZGFwdGVyIHJlamVjdHMg
bmFtZWQgYXJyYXkgbWV0YWRhdGEgYmVmb3JlIG5ldHdvcmsgcmVxdWVzdAogIC0tLQogIGR1cmF0
aW9uX21zOiAxLjMwOTA3MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFkYXB0ZXIg
cmVqZWN0cyBub25jYW5vbmljYWwgbnVtZXJpYyBhcnJheSBrZXkgYmVmb3JlIG5ldHdvcmsgcmVx
dWVzdApvayAxNzEgLSBhZGFwdGVyIHJlamVjdHMgbm9uY2Fub25pY2FsIG51bWVyaWMgYXJyYXkg
a2V5IGJlZm9yZSBuZXR3b3JrIHJlcXVlc3QKICAtLS0KICBkdXJhdGlvbl9tczogMC4zMzk3NTIK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhZGFwdGVyIHJlamVjdHMgbmVzdGVkIG5h
bWVkIGFycmF5IG1ldGFkYXRhIGJlZm9yZSBuZXR3b3JrIHJlcXVlc3QKb2sgMTcyIC0gYWRhcHRl
ciByZWplY3RzIG5lc3RlZCBuYW1lZCBhcnJheSBtZXRhZGF0YSBiZWZvcmUgbmV0d29yayByZXF1
ZXN0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjYzMDM3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogb3BlbiByZWplY3RzIHdoaXRlc3BhY2Utb25seSBkZXZpY2UgSUQgYmVmb3JlIHRy
YW5zcG9ydApvayAxNzMgLSBvcGVuIHJlamVjdHMgd2hpdGVzcGFjZS1vbmx5IGRldmljZSBJRCBi
ZWZvcmUgdHJhbnNwb3J0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMjUwMzE1CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZCBhbmQgb3BlblJlYWRlciByZWplY3Qgd2hpdGVzcGFj
ZS1vbmx5IGRldmljZSBJRApvayAxNzQgLSByZWFkIGFuZCBvcGVuUmVhZGVyIHJlamVjdCB3aGl0
ZXNwYWNlLW9ubHkgZGV2aWNlIElECiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNTQ1MTMyCiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb3BlbiByZWplY3RzIHdoaXRlc3BhY2Utb25seSBl
eHBlY3RlZCBjbG91ZCBnYW1lIElECm9rIDE3NSAtIG9wZW4gcmVqZWN0cyB3aGl0ZXNwYWNlLW9u
bHkgZXhwZWN0ZWQgY2xvdWQgZ2FtZSBJRAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIxNjcyNwog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbW1pdCByZWplY3RzIHdoaXRlc3BhY2Ut
b25seSBnYW1lLCBkZXZpY2UgYW5kIHRva2VuIGNyZWRlbnRpYWxzCm9rIDE3NiAtIGNvbW1pdCBy
ZWplY3RzIHdoaXRlc3BhY2Utb25seSBnYW1lLCBkZXZpY2UgYW5kIHRva2VuIGNyZWRlbnRpYWxz
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDExNzUxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogbGVhc2VTdGF0dXMgcmVqZWN0cyB3aGl0ZXNwYWNlLW9ubHkgZGV2aWNlIElECm9rIDE3
NyAtIGxlYXNlU3RhdHVzIHJlamVjdHMgd2hpdGVzcGFjZS1vbmx5IGRldmljZSBJRAogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjE5OTQyMQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFk
YXB0ZXIgcmVqZWN0cyB1bnBhaXJlZCBVbmljb2RlLCBOVUwgYW5kIG1hbGZvcm1lZCBvYmplY3Qg
a2V5cyBiZWZvcmUgbmV0d29yawpvayAxNzggLSBhZGFwdGVyIHJlamVjdHMgdW5wYWlyZWQgVW5p
Y29kZSwgTlVMIGFuZCBtYWxmb3JtZWQgb2JqZWN0IGtleXMgYmVmb3JlIG5ldHdvcmsKICAtLS0K
ICBkdXJhdGlvbl9tczogMS43NjcxMDMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBh
ZGFwdGVyIHJlamVjdHMgc2lsZW50IEpTT04gY29lcmNpb25zLCBzcGFyc2UgYXJyYXlzIGFuZCBu
b24tSlNPTiB2YWx1ZXMKb2sgMTc5IC0gYWRhcHRlciByZWplY3RzIHNpbGVudCBKU09OIGNvZXJj
aW9ucywgc3BhcnNlIGFycmF5cyBhbmQgbm9uLUpTT04gdmFsdWVzCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuNTQ0OTgxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWRhcHRlciBhY2Nl
cHRzIHZhbGlkIHN1cHBsZW1lbnRhcnkgVW5pY29kZSBhbmQgb3JkaW5hcnkgbmVzdGVkIGhpc3Rv
cnkKb2sgMTgwIC0gYWRhcHRlciBhY2NlcHRzIHZhbGlkIHN1cHBsZW1lbnRhcnkgVW5pY29kZSBh
bmQgb3JkaW5hcnkgbmVzdGVkIGhpc3RvcnkKICAtLS0KICBkdXJhdGlvbl9tczogMC4zNDI1MzYK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBtYXRjaGluZyBleGlzdGluZyBjbG91ZCBn
YW1lIGlzIGFjY2VwdGVkIHdpdGhvdXQgd3JpdGluZyBzdG9yYWdlCm9rIDE4MSAtIG1hdGNoaW5n
IGV4aXN0aW5nIGNsb3VkIGdhbWUgaXMgYWNjZXB0ZWQgd2l0aG91dCB3cml0aW5nIHN0b3JhZ2UK
ICAtLS0KICBkdXJhdGlvbl9tczogMS4xOTE5OTcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBkaWZmZXJlbnQgZXhpc3RpbmcgZ2FtZSBpcyBuZXZlciBvdmVyd3JpdHRlbiBieSBjbG91
ZCBhZG9wdGlvbgpvayAxODIgLSBkaWZmZXJlbnQgZXhpc3RpbmcgZ2FtZSBpcyBuZXZlciBvdmVy
d3JpdHRlbiBieSBjbG91ZCBhZG9wdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjY3Nzg3Mgog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNsb3VkIHRha2VvdmVyIHJlcHVibGlzaGVz
IGxpdmUgc2NvcmUgd2hlbiBkaXNrIHNuYXBzaG90IG1hdGNoZXMgYnV0IG1lbW9yeSBpcyBzdGFs
ZQpvayAxODMgLSBjbG91ZCB0YWtlb3ZlciByZXB1Ymxpc2hlcyBsaXZlIHNjb3JlIHdoZW4gZGlz
ayBzbmFwc2hvdCBtYXRjaGVzIGJ1dCBtZW1vcnkgaXMgc3RhbGUKICAtLS0KICBkdXJhdGlvbl9t
czogMC45NzMyMDcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjbG91ZCB0YWtlb3Zl
ciBwZXJzaXN0cyBhbmQgcmVwdWJsaXNoZXMgZGlmZmVyaW5nIHNuYXBzaG90Cm9rIDE4NCAtIGNs
b3VkIHRha2VvdmVyIHBlcnNpc3RzIGFuZCByZXB1Ymxpc2hlcyBkaWZmZXJpbmcgc25hcHNob3QK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4yNzI0NzEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBkaXNhYmxlZCBicmlkZ2UgY2Fubm90IGFjY2VzcyBzZXJ2ZXIgb3Igd3JpdGUgYXBwbGlj
YXRpb24Kb2sgMTg1IC0gZGlzYWJsZWQgYnJpZGdlIGNhbm5vdCBhY2Nlc3Mgc2VydmVyIG9yIHdy
aXRlIGFwcGxpY2F0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuODAyMTc2CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogY2xvdWQgYWRvcHRpb24gbXVzdCBiZSBjb25maXJtZWQgYmVm
b3JlIHJlcG9ydGluZyBhY3RpdmF0aW9uIHN1Y2Nlc3MKb2sgMTg2IC0gY2xvdWQgYWRvcHRpb24g
bXVzdCBiZSBjb25maXJtZWQgYmVmb3JlIHJlcG9ydGluZyBhY3RpdmF0aW9uIHN1Y2Nlc3MKICAt
LS0KICBkdXJhdGlvbl9tczogMC42MDk1ODgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBzaWdub3V0IGludmFsaWRhdGVzIHBlbmRpbmcgY2xvdWQgYWN0aXZhdGlvbgpvayAxODcgLSBz
aWdub3V0IGludmFsaWRhdGVzIHBlbmRpbmcgY2xvdWQgYWN0aXZhdGlvbgogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjI3ODUzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbG9nb3V0IHN1
cHByZXNzZXMgbGF0ZSBzeW5jIHN1Y2Nlc3MgZnJvbSBwcmV2aW91cyBhY2NvdW50Cm9rIDE4OCAt
IGxvZ291dCBzdXBwcmVzc2VzIGxhdGUgc3luYyBzdWNjZXNzIGZyb20gcHJldmlvdXMgYWNjb3Vu
dAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjkzNzUzMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IGxvZ291dCBzdXBwcmVzc2VzIGxhdGUgc3luYyByZWplY3Rpb24gZnJvbSBwcmV2aW91
cyBhY2NvdW50Cm9rIDE4OSAtIGxvZ291dCBzdXBwcmVzc2VzIGxhdGUgc3luYyByZWplY3Rpb24g
ZnJvbSBwcmV2aW91cyBhY2NvdW50CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNTY0MzgKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBuZXcgbG9naW4gZm9yIHNhbWUgdXNlciBpbnZhbGlk
YXRlcyBwcmV2aW91cyB3cml0ZXIgbGVhc2UKb2sgMTkwIC0gbmV3IGxvZ2luIGZvciBzYW1lIHVz
ZXIgaW52YWxpZGF0ZXMgcHJldmlvdXMgd3JpdGVyIGxlYXNlCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMjg0NjE5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbWlzc2luZyBhdXRoIHNl
c3Npb24gaWQgY2Fubm90IHJldXNlIGEgd3JpdGVyIGxlYXNlCm9rIDE5MSAtIG1pc3NpbmcgYXV0
aCBzZXNzaW9uIGlkIGNhbm5vdCByZXVzZSBhIHdyaXRlciBsZWFzZQogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjI5OTY1MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IEpXVCBzZXNzaW9u
IGlkZW50aXR5IGNoYW5nZXMgaW52YWxpZGF0ZSBlYXJsaWVyIHdyaXRlciBsZWFzZQpvayAxOTIg
LSBKV1Qgc2Vzc2lvbiBpZGVudGl0eSBjaGFuZ2VzIGludmFsaWRhdGUgZWFybGllciB3cml0ZXIg
bGVhc2UKICAtLS0KICBkdXJhdGlvbl9tczogMC43MTc2OTIKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBsb2NhbCBzY29yZSBzYXZlZCBkdXJpbmcgYWN0aXZhdGlvbiBwcmV2ZW50cyBz
dGFsZSBjbG91ZCBhZG9wdGlvbgpvayAxOTMgLSBsb2NhbCBzY29yZSBzYXZlZCBkdXJpbmcgYWN0
aXZhdGlvbiBwcmV2ZW50cyBzdGFsZSBjbG91ZCBhZG9wdGlvbgogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjU3NjM5OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxvY2FsIHNjb3JlIGNo
YW5nZWQgZHVyaW5nIGFjdGl2YXRpb24gYmxvY2tzIGNsb3VkIGFkb3B0aW9uIGFuZCByZXRhaW5z
IGxvY2FsIHN0YXRlCm9rIDE5NCAtIGxvY2FsIHNjb3JlIGNoYW5nZWQgZHVyaW5nIGFjdGl2YXRp
b24gYmxvY2tzIGNsb3VkIGFkb3B0aW9uIGFuZCByZXRhaW5zIGxvY2FsIHN0YXRlCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuNjk2Mzk5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2Nv
cmUgcmVjb3JkZWQgZHVyaW5nIGFjdGl2YXRpb24gaXMgZHVyYWJseSBxdWV1ZWQgYmVmb3JlIHRh
a2VvdmVyIGlzIGJsb2NrZWQKb2sgMTk1IC0gc2NvcmUgcmVjb3JkZWQgZHVyaW5nIGFjdGl2YXRp
b24gaXMgZHVyYWJseSBxdWV1ZWQgYmVmb3JlIHRha2VvdmVyIGlzIGJsb2NrZWQKICAtLS0KICBk
dXJhdGlvbl9tczogMS40MDAxMzEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzeW5j
aHJvbm91cyBlbmdpbmUgcHVzaCBmYWlsdXJlIGJlY29tZXMgYSBjb250cm9sbGVkIHN5bmMgZXJy
b3IKb2sgMTk2IC0gc3luY2hyb25vdXMgZW5naW5lIHB1c2ggZmFpbHVyZSBiZWNvbWVzIGEgY29u
dHJvbGxlZCBzeW5jIGVycm9yCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzY0MDU4CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYXN5bmNocm9ub3VzIGFkb3B0aW9uIGlzIGludmFsaWRh
dGVkIHdoZW4gdXNlciBsb2dzIG91dApvayAxOTcgLSBhc3luY2hyb25vdXMgYWRvcHRpb24gaXMg
aW52YWxpZGF0ZWQgd2hlbiB1c2VyIGxvZ3Mgb3V0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzEw
NTI4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVwZWF0ZWQgYXV0aCBub3RpZmlj
YXRpb24gY2Fubm90IHJlcG9ydCByZWFkeSBiZWZvcmUgY2xvdWQgYWRvcHRpb24gY29tcGxldGVz
Cm9rIDE5OCAtIHJlcGVhdGVkIGF1dGggbm90aWZpY2F0aW9uIGNhbm5vdCByZXBvcnQgcmVhZHkg
YmVmb3JlIGNsb3VkIGFkb3B0aW9uIGNvbXBsZXRlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI3
MDcxOAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlYWQtb25seSBjbG91ZCBzZXNz
aW9uIG5ldmVyIGludm9rZXMgc2NvcmUgY29tbWl0Cm9rIDE5OSAtIHJlYWQtb25seSBjbG91ZCBz
ZXNzaW9uIG5ldmVyIGludm9rZXMgc2NvcmUgY29tbWl0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MzQ3NDM0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2VydmVyIHdyaXRlciByZXZv
Y2F0aW9uIGRpc2FibGVzIGZ1dHVyZSBzZW5kcyBhbmQgcmVhZGluZXNzCm9rIDIwMCAtIHNlcnZl
ciB3cml0ZXIgcmV2b2NhdGlvbiBkaXNhYmxlcyBmdXR1cmUgc2VuZHMgYW5kIHJlYWRpbmVzcwog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjM4Mzk2OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IHVuaGFuZGxlZCBxdWV1ZSBmYWlsdXJlIGRpc2FibGVzIHdyaXRlciBsZWFzZSB1bnRpbCBy
ZWFjdGl2YXRpb24Kb2sgMjAxIC0gdW5oYW5kbGVkIHF1ZXVlIGZhaWx1cmUgZGlzYWJsZXMgd3Jp
dGVyIGxlYXNlIHVudGlsIHJlYWN0aXZhdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI3NjAw
NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxvZ291dCBiZWZvcmUgZGVmZXJyZWQg
cHVzaCBkb2VzIG5vdCBlbnF1ZXVlIG9yIGNvbnRhY3Qgb2xkIHNlc3Npb24Kb2sgMjAyIC0gbG9n
b3V0IGJlZm9yZSBkZWZlcnJlZCBwdXNoIGRvZXMgbm90IGVucXVldWUgb3IgY29udGFjdCBvbGQg
c2Vzc2lvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjMwMDMxMwogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IGFjdGl2YXRpb24gcmVmdXNlcyBhIHdyaXRlciBsZWFzZSB3aGVuIGVuZ2lu
ZSByZXBvcnRzIGNvbmZsaWN0Cm9rIDIwMyAtIGFjdGl2YXRpb24gcmVmdXNlcyBhIHdyaXRlciBs
ZWFzZSB3aGVuIGVuZ2luZSByZXBvcnRzIGNvbmZsaWN0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
Mjc4NDE5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogdW5wYWRkZWQgYmFzZTY0dXJs
IEpXVCBzZXNzaW9uIGlkZW50aXR5IHdvcmtzIHdpdGggc3RyaWN0IFNhZmFyaS1zdHlsZSBhdG9i
Cm9rIDIwNCAtIHVucGFkZGVkIGJhc2U2NHVybCBKV1Qgc2Vzc2lvbiBpZGVudGl0eSB3b3JrcyB3
aXRoIHN0cmljdCBTYWZhcmktc3R5bGUgYXRvYgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjMwMDUy
MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGRlZmVycmVkIGNsb3VkIHNlbmQgY2Fw
dHVyZXMgdGhlIGV4YWN0IHNhdmVkIHNjb3JlIGJlZm9yZSBsYXRlciBtdXRhdGlvbgpvayAyMDUg
LSBkZWZlcnJlZCBjbG91ZCBzZW5kIGNhcHR1cmVzIHRoZSBleGFjdCBzYXZlZCBzY29yZSBiZWZv
cmUgbGF0ZXIgbXV0YXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC43OTI1NDUKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBkZXZpY2UgaWRlbnRpdHkgc3RvcmFnZSBmYWlsdXJlIGNs
ZWFycyB0ZW50YXRpdmUgYXV0aCBhbmQgcmV0dXJucyBjb250cm9sbGVkIGVycm9yCm9rIDIwNiAt
IGRldmljZSBpZGVudGl0eSBzdG9yYWdlIGZhaWx1cmUgY2xlYXJzIHRlbnRhdGl2ZSBhdXRoIGFu
ZCByZXR1cm5zIGNvbnRyb2xsZWQgZXJyb3IKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNzk5OTEK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhZGFwdGVyIGluaXRpYWxpemF0aW9uIGZh
aWx1cmUgbmV2ZXIgcmV0YWlucyBwaGFudG9tIGFjY291bnQgbGVhc2UKb2sgMjA3IC0gYWRhcHRl
ciBpbml0aWFsaXphdGlvbiBmYWlsdXJlIG5ldmVyIHJldGFpbnMgcGhhbnRvbSBhY2NvdW50IGxl
YXNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTgyNzM2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogY29uZmxpY3RpbmcgZXhwbGljaXQgc2Vzc2lvbiBhbmQgSldUIHNlc3Npb24gaWRl
bnRpZmllcnMgZmFpbCBjbG9zZWQKb2sgMjA4IC0gY29uZmxpY3RpbmcgZXhwbGljaXQgc2Vzc2lv
biBhbmQgSldUIHNlc3Npb24gaWRlbnRpZmllcnMgZmFpbCBjbG9zZWQKICAtLS0KICBkdXJhdGlv
bl9tczogMC4yMzcwMzcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBleHBpcmVkIEpX
VCBjYW5ub3QgYWN0aXZhdGUgYSBjbG91ZCB3cml0ZXIgbGVhc2UKb2sgMjA5IC0gZXhwaXJlZCBK
V1QgY2Fubm90IGFjdGl2YXRlIGEgY2xvdWQgd3JpdGVyIGxlYXNlCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMjI2NDEyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogZmFpbGVkIGFjdGl2
YXRpb24gY2xlYXJzIGFjY291bnQgYW5kIGF1dGggc2Vzc2lvbiBpZGVudGl0eSBiZWZvcmUgcmV0
cnkKb2sgMjEwIC0gZmFpbGVkIGFjdGl2YXRpb24gY2xlYXJzIGFjY291bnQgYW5kIGF1dGggc2Vz
c2lvbiBpZGVudGl0eSBiZWZvcmUgcmV0cnkKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMTU5MTUK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZXBlYXRlZCBhdXRoIG5vdGlmaWNhdGlv
biBjYW5ub3QgcmV2aXZlIGEgcmV2b2tlZCBlbmdpbmUgd3JpdGVyIGxlYXNlCm9rIDIxMSAtIHJl
cGVhdGVkIGF1dGggbm90aWZpY2F0aW9uIGNhbm5vdCByZXZpdmUgYSByZXZva2VkIGVuZ2luZSB3
cml0ZXIgbGVhc2UKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNzQzNjMKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBsZWFzZSBtb25pdG9yIHN0YXJ0cyBhZnRlciBhY3RpdmF0aW9uLCBh
dm9pZHMgb3ZlcmxhcHBpbmcgY2hlY2tzIGFuZCBzdG9wcyBvbiBsb2dvdXQKb2sgMjEyIC0gbGVh
c2UgbW9uaXRvciBzdGFydHMgYWZ0ZXIgYWN0aXZhdGlvbiwgYXZvaWRzIG92ZXJsYXBwaW5nIGNo
ZWNrcyBhbmQgc3RvcHMgb24gbG9nb3V0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDE0Ljc2MTY2MQog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxlYXNlIG1vbml0b3IgbmV2ZXIgc2NoZWR1
bGVzIGZvciBkaXNhYmxlZCBzeW5jCm9rIDIxMyAtIGxlYXNlIG1vbml0b3IgbmV2ZXIgc2NoZWR1
bGVzIGZvciBkaXNhYmxlZCBzeW5jCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjk5MTIKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBsYXRlIGxlYXNlIHJlamVjdGlvbiBmcm9tIHByZXZp
b3VzIGxvZ2luIGNhbm5vdCByZXZva2UgcmVwbGFjZW1lbnQgd3JpdGVyCm9rIDIxNCAtIGxhdGUg
bGVhc2UgcmVqZWN0aW9uIGZyb20gcHJldmlvdXMgbG9naW4gY2Fubm90IHJldm9rZSByZXBsYWNl
bWVudCB3cml0ZXIKICAtLS0KICBkdXJhdGlvbl9tczogMi4zODUzMjUKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBzdWNjZXNzZnVsIGxlYXNlIGNoZWNrIHdpdGggcmV2b2tlZCB3cml0
ZXIgcGVybWlzc2lvbiBmYWlscyBjbG9zZWQKb2sgMjE1IC0gc3VjY2Vzc2Z1bCBsZWFzZSBjaGVj
ayB3aXRoIHJldm9rZWQgd3JpdGVyIHBlcm1pc3Npb24gZmFpbHMgY2xvc2VkCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMzYxMTU1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0
ZWQgZGlyZWN0IGxlYXNlIGNoZWNrIHJldm9rZXMgd3JpdGVyIHN0YXR1cyB3aXRob3V0IHRocm93
aW5nCm9rIDIxNiAtIHJlamVjdGVkIGRpcmVjdCBsZWFzZSBjaGVjayByZXZva2VzIHdyaXRlciBz
dGF0dXMgd2l0aG91dCB0aHJvd2luZwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI2ODYyNQogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN0cnVjdHVyZWQgbGVhc2UgbmV0d29yayBmYWls
dXJlIHJldm9rZXMgYnJpZGdlIHdyaXRlciBwZXJtaXNzaW9uCm9rIDIxNyAtIHN0cnVjdHVyZWQg
bGVhc2UgbmV0d29yayBmYWlsdXJlIHJldm9rZXMgYnJpZGdlIHdyaXRlciBwZXJtaXNzaW9uCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMjY5MjQ2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogbmV0d29yayBmYWlsdXJlIGFmdGVyIGR1cmFibGUgZW5xdWV1ZSB3aXRoZHJhd3Mgd3JpdGUg
cGVybWlzc2lvbiBhbmQgcHJlc2VydmVzIHF1ZXVlCm9rIDIxOCAtIG5ldHdvcmsgZmFpbHVyZSBh
ZnRlciBkdXJhYmxlIGVucXVldWUgd2l0aGRyYXdzIHdyaXRlIHBlcm1pc3Npb24gYW5kIHByZXNl
cnZlcyBxdWV1ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjUzNzE3OQogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IEpXVCBzdWJqZWN0IGRpc2FncmVlcyB3aXRoIHNpZ25lZC1pbiB1c2Vy
IHByZXZlbnRzIGNsb3VkIGFjdGl2YXRpb24Kb2sgMjE5IC0gSldUIHN1YmplY3QgZGlzYWdyZWVz
IHdpdGggc2lnbmVkLWluIHVzZXIgcHJldmVudHMgY2xvdWQgYWN0aXZhdGlvbgogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjIyMzQ1NwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IEpXVCBl
eHBpcnkgaXMgaW52YWxpZCBwcmV2ZW50cyBjbG91ZCBhY3RpdmF0aW9uCm9rIDIyMCAtIEpXVCBl
eHBpcnkgaXMgaW52YWxpZCBwcmV2ZW50cyBjbG91ZCBhY3RpdmF0aW9uCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuMTMxNzE4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbWlzc2luZyBj
b21taXQgYWNrbm93bGVkZ2VtZW50IHdpdGhkcmF3cyB3cml0ZXIgcGVybWlzc2lvbgpvayAyMjEg
LSBtaXNzaW5nIGNvbW1pdCBhY2tub3dsZWRnZW1lbnQgd2l0aGRyYXdzIHdyaXRlciBwZXJtaXNz
aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjc3MDM4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogYm91bmRlZCBmbHVzaCBjYW5ub3QgcmVwb3J0IHN1Y2Nlc3Mgd2hpbGUgZWRpdHMg
cmVtYWluIHBlbmRpbmcKb2sgMjIyIC0gYm91bmRlZCBmbHVzaCBjYW5ub3QgcmVwb3J0IHN1Y2Nl
c3Mgd2hpbGUgZWRpdHMgcmVtYWluIHBlbmRpbmcKICAtLS0KICBkdXJhdGlvbl9tczogMC41MTMw
NjMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhY3RpdmF0aW9uIHJlamVjdHMgaW52
YWxpZCBzbmFwc2hvdCB3aXRob3V0IGR1cmFibGUgZW5xdWV1ZQpvayAyMjMgLSBhY3RpdmF0aW9u
IHJlamVjdHMgaW52YWxpZCBzbmFwc2hvdCB3aXRob3V0IGR1cmFibGUgZW5xdWV1ZQogIC0tLQog
IGR1cmF0aW9uX21zOiAxLjcwNDExOQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFj
dGl2YXRpb24gcmVqZWN0cyBjdXN0b20gc2VyaWFsaXplciBiZWZvcmUgZHVyYWJsZSBlbnF1ZXVl
Cm9rIDIyNCAtIGFjdGl2YXRpb24gcmVqZWN0cyBjdXN0b20gc2VyaWFsaXplciBiZWZvcmUgZHVy
YWJsZSBlbnF1ZXVlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjI3MDMyCiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogYWN0aXZhdGlvbiBzbmFwc2hvdHMgbXV0YWJsZSBpbnB1dCBiZWZv
cmUgZHVyYWJsZSBlbnF1ZXVlCm9rIDIyNSAtIGFjdGl2YXRpb24gc25hcHNob3RzIG11dGFibGUg
aW5wdXQgYmVmb3JlIGR1cmFibGUgZW5xdWV1ZQogIC0tLQogIGR1cmF0aW9uX21zOiAxLjEzNjU4
MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGJyaWRnZSByZWplY3RzIG5hbWVkIGFy
cmF5IG1ldGFkYXRhIGJlZm9yZSBkdXJhYmxlIHF1ZXVlCm9rIDIyNiAtIGJyaWRnZSByZWplY3Rz
IG5hbWVkIGFycmF5IG1ldGFkYXRhIGJlZm9yZSBkdXJhYmxlIHF1ZXVlCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDIuMDYwNzg2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYnJpZGdlIHJl
amVjdHMgbmVzdGVkIHVuZGVmaW5lZCBiZWZvcmUgZHVyYWJsZSBxdWV1ZQpvayAyMjcgLSBicmlk
Z2UgcmVqZWN0cyBuZXN0ZWQgdW5kZWZpbmVkIGJlZm9yZSBkdXJhYmxlIHF1ZXVlCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuMzcxNzIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBicmlk
Z2UgcmVqZWN0cyBub24tZmluaXRlIG51bWJlciBiZWZvcmUgZHVyYWJsZSBxdWV1ZQpvayAyMjgg
LSBicmlkZ2UgcmVqZWN0cyBub24tZmluaXRlIG51bWJlciBiZWZvcmUgZHVyYWJsZSBxdWV1ZQog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjIxMjEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBicmlkZ2UgcmVqZWN0cyB1bnNhZmUgaW50ZWdlciBiZWZvcmUgZHVyYWJsZSBxdWV1ZQpvayAy
MjkgLSBicmlkZ2UgcmVqZWN0cyB1bnNhZmUgaW50ZWdlciBiZWZvcmUgZHVyYWJsZSBxdWV1ZQog
IC0tLQogIGR1cmF0aW9uX21zOiAxLjcwOTEzNwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IGJyaWRnZSByZWplY3RzIHNwYXJzZSBhcnJheSBiZWZvcmUgZHVyYWJsZSBxdWV1ZQpvayAy
MzAgLSBicmlkZ2UgcmVqZWN0cyBzcGFyc2UgYXJyYXkgYmVmb3JlIGR1cmFibGUgcXVldWUKICAt
LS0KICBkdXJhdGlvbl9tczogMC4yNDYyMDEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBicmlkZ2UgcmVqZWN0cyBoaWRkZW4gcHJvcGVydHkgYmVmb3JlIGR1cmFibGUgcXVldWUKb2sg
MjMxIC0gYnJpZGdlIHJlamVjdHMgaGlkZGVuIHByb3BlcnR5IGJlZm9yZSBkdXJhYmxlIHF1ZXVl
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjUwOTk5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogYnJpZGdlIHJlamVjdHMgVW5pY29kZSBOVUwgYmVmb3JlIGR1cmFibGUgcXVldWUKb2sg
MjMyIC0gYnJpZGdlIHJlamVjdHMgVW5pY29kZSBOVUwgYmVmb3JlIGR1cmFibGUgcXVldWUKICAt
LS0KICBkdXJhdGlvbl9tczogMC4yNzU4MTYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBicmlkZ2UgcmVqZWN0cyB1bnBhaXJlZCBoaWdoIHN1cnJvZ2F0ZSBiZWZvcmUgZHVyYWJsZSBx
dWV1ZQpvayAyMzMgLSBicmlkZ2UgcmVqZWN0cyB1bnBhaXJlZCBoaWdoIHN1cnJvZ2F0ZSBiZWZv
cmUgZHVyYWJsZSBxdWV1ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIyNjg1MgogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGJyaWRnZSByZWplY3RzIHVucGFpcmVkIGxvdyBzdXJyb2dh
dGUgaW4ga2V5IGJlZm9yZSBkdXJhYmxlIHF1ZXVlCm9rIDIzNCAtIGJyaWRnZSByZWplY3RzIHVu
cGFpcmVkIGxvdyBzdXJyb2dhdGUgaW4ga2V5IGJlZm9yZSBkdXJhYmxlIHF1ZXVlCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuNzAzMTMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBicmlk
Z2UgcmVqZWN0cyBjdXN0b20gdG9KU09OIHNlcmlhbGl6ZXIgYmVmb3JlIGR1cmFibGUgcXVldWUK
b2sgMjM1IC0gYnJpZGdlIHJlamVjdHMgY3VzdG9tIHRvSlNPTiBzZXJpYWxpemVyIGJlZm9yZSBk
dXJhYmxlIHF1ZXVlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNTcwOTgxCiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogYnJpZGdlIHByZXNlcnZlcyB2YWxpZCB3cml0ZXIgb24gbm9uLWF1
dGhvcml0YXRpdmUgbGVhc2UtY2hlY2stYnVzeQpvayAyMzYgLSBicmlkZ2UgcHJlc2VydmVzIHZh
bGlkIHdyaXRlciBvbiBub24tYXV0aG9yaXRhdGl2ZSBsZWFzZS1jaGVjay1idXN5CiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDEuMzQ2MTg5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYnJp
ZGdlIHByZXNlcnZlcyB2YWxpZCB3cml0ZXIgb24gbm9uLWF1dGhvcml0YXRpdmUgbGVhc2Utc3Vw
ZXJzZWRlZApvayAyMzcgLSBicmlkZ2UgcHJlc2VydmVzIHZhbGlkIHdyaXRlciBvbiBub24tYXV0
aG9yaXRhdGl2ZSBsZWFzZS1zdXBlcnNlZGVkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTQzODU2
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2VydmVyIHBlcm1pdHMgTlVMTCBvbmx5
IGZvciBhZG9wdGluZyBleGlzdGluZyBjbG91ZCBnYW1lCm9rIDIzOCAtIHNlcnZlciBwZXJtaXRz
IE5VTEwgb25seSBmb3IgYWRvcHRpbmcgZXhpc3RpbmcgY2xvdWQgZ2FtZQogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjgwODY2OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHRyYW5zcG9y
dCBzZW5kcyBudWxsIGZvciBhIG5ldyBkZXZpY2Ugd2l0aCBubyBsb2NhbCBnYW1lCm9rIDIzOSAt
IHRyYW5zcG9ydCBzZW5kcyBudWxsIGZvciBhIG5ldyBkZXZpY2Ugd2l0aCBubyBsb2NhbCBnYW1l
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjg5OTM3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogdHJhbnNwb3J0IHJlamVjdHMgYXJyYXlzIGFzIGluaXRpYWwgZ2FtZXMKb2sgMjQwIC0g
dHJhbnNwb3J0IHJlamVjdHMgYXJyYXlzIGFzIGluaXRpYWwgZ2FtZXMKICAtLS0KICBkdXJhdGlv
bl9tczogMC4zOTQ1NTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjb21taXQgcmVq
ZWN0cyBnZW5lcmF0aW9uIHplcm8gd2l0aG91dCBSUEMgY2FsbApvayAyNDEgLSBjb21taXQgcmVq
ZWN0cyBnZW5lcmF0aW9uIHplcm8gd2l0aG91dCBSUEMgY2FsbAogIC0tLQogIGR1cmF0aW9uX21z
OiAxLjUyODkwNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbW1pdCByZWplY3Rz
IG5lZ2F0aXZlIGdlbmVyYXRpb24gd2l0aG91dCBSUEMgY2FsbApvayAyNDIgLSBjb21taXQgcmVq
ZWN0cyBuZWdhdGl2ZSBnZW5lcmF0aW9uIHdpdGhvdXQgUlBDIGNhbGwKICAtLS0KICBkdXJhdGlv
bl9tczogMC4yMzQ3OTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjb21taXQgcmVq
ZWN0cyBuZWdhdGl2ZSBiYXNlIHJldmlzaW9uIHdpdGhvdXQgUlBDIGNhbGwKb2sgMjQzIC0gY29t
bWl0IHJlamVjdHMgbmVnYXRpdmUgYmFzZSByZXZpc2lvbiB3aXRob3V0IFJQQyBjYWxsCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMjI3OTU0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
cGVyc2lzdHMgYSBzdGFibGUgZGV2aWNlIElEIGFjcm9zcyByZXBlYXRlZCBzZXNzaW9ucwpvayAy
NDQgLSBwZXJzaXN0cyBhIHN0YWJsZSBkZXZpY2UgSUQgYWNyb3NzIHJlcGVhdGVkIHNlc3Npb25z
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMjc0MjgxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogZG9lcyBub3Qgb3ZlcndyaXRlIGludmFsaWQgZXhpc3RpbmcgaWRlbnRpZmllcgpvayAy
NDUgLSBkb2VzIG5vdCBvdmVyd3JpdGUgaW52YWxpZCBleGlzdGluZyBpZGVudGlmaWVyCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuNDk5MDQyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
ZmFpbHMgY2xvc2VkIHdoZW4gc3RvcmFnZSBjYW5ub3QgcGVyc2lzdApvayAyNDYgLSBmYWlscyBj
bG9zZWQgd2hlbiBzdG9yYWdlIGNhbm5vdCBwZXJzaXN0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MjQ4ODI1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVxdWlyZXMgc2VjdXJlIHJh
bmRvbSBVVUlECm9rIDI0NyAtIHJlcXVpcmVzIHNlY3VyZSByYW5kb20gVVVJRAogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjE1NjcwNgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGZhaWxz
IGNsb3NlZCBvbiB1bnJlYWRhYmxlIHN0b3JhZ2UKb2sgMjQ4IC0gZmFpbHMgY2xvc2VkIG9uIHVu
cmVhZGFibGUgc3RvcmFnZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIzMTY3CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0cyBpbnZhbGlkIG9yIG5vbi1maW5pdGUgc2NvcmVz
IGFuZCBpbnZhbGlkIGhpc3RvcnkKb2sgMjQ5IC0gcmVqZWN0cyBpbnZhbGlkIG9yIG5vbi1maW5p
dGUgc2NvcmVzIGFuZCBpbnZhbGlkIGhpc3RvcnkKICAtLS0KICBkdXJhdGlvbl9tczogMS40NDI5
MTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhY3RpdmF0aW9uIGJhY2tzIHVwIGV4
aXN0aW5nIGxvY2FsIGdhbWUgYmVmb3JlIGFjY2VwdGluZyBjbG91ZApvayAyNTAgLSBhY3RpdmF0
aW9uIGJhY2tzIHVwIGV4aXN0aW5nIGxvY2FsIGdhbWUgYmVmb3JlIGFjY2VwdGluZyBjbG91ZAog
IC0tLQogIGR1cmF0aW9uX21zOiAxLjY5MzAwMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IG9mZmxpbmUgbmV0d29yayBmYWlsdXJlIHBlcnNpc3RzIHNjb3JlIHF1ZXVlLCBsYXRlciBm
bHVzaCBjb21taXRzCm9rIDI1MSAtIG9mZmxpbmUgbmV0d29yayBmYWlsdXJlIHBlcnNpc3RzIHNj
b3JlIHF1ZXVlLCBsYXRlciBmbHVzaCBjb21taXRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuNzgx
OTI2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29uZmxpY3Rpbmcgd3JpdGUgbmV2
ZXIgb3ZlcndyaXRlcyBsb2NhbCBkYXRhIG9yIHNpbGVudGx5IGNsZWFycyBxdWV1ZQpvayAyNTIg
LSBjb25mbGljdGluZyB3cml0ZSBuZXZlciBvdmVyd3JpdGVzIGxvY2FsIGRhdGEgb3Igc2lsZW50
bHkgY2xlYXJzIHF1ZXVlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNjEzNDk1CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZC1vbmx5IHNlc3Npb24gY2Fubm90IHdyaXRlIG9yIGVu
cXVldWUgbmV3IGRhdGEKb2sgMjUzIC0gcmVhZC1vbmx5IHNlc3Npb24gY2Fubm90IHdyaXRlIG9y
IGVucXVldWUgbmV3IGRhdGEKICAtLS0KICBkdXJhdGlvbl9tczogMC41ODAyMjQKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBiYWNrdXAgYW5kIHBlbmRpbmcga2V5cyBhcmUgc2NvcGVk
IGJ5IGFjY291bnQgYW5kIGRldmljZQpvayAyNTQgLSBiYWNrdXAgYW5kIHBlbmRpbmcga2V5cyBh
cmUgc2NvcGVkIGJ5IGFjY291bnQgYW5kIGRldmljZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjMw
ODQ1NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpbXVsdGFuZW91cyBmbHVzaGVz
IGRvIG5vdCBpc3N1ZSBkdXBsaWNhdGUgcmV2aXNpb24gd3JpdGVzCm9rIDI1NSAtIHNpbXVsdGFu
ZW91cyBmbHVzaGVzIGRvIG5vdCBpc3N1ZSBkdXBsaWNhdGUgcmV2aXNpb24gd3JpdGVzCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuNzA5ODE5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
ZWRpdHMgcXVldWVkIGR1cmluZyBuZXR3b3JrIGNvbW1pdCBzdXJ2aXZlIHN1Y2Nlc3NmdWwgcmVz
cG9uc2UKb2sgMjU2IC0gZWRpdHMgcXVldWVkIGR1cmluZyBuZXR3b3JrIGNvbW1pdCBzdXJ2aXZl
IHN1Y2Nlc3NmdWwgcmVzcG9uc2UKICAtLS0KICBkdXJhdGlvbl9tczogMC41Njc4NjYKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBuZXcgYWN0aXZhdGlvbiByZWZ1c2VzIHRvIG1hc2sg
b2ZmbGluZSBjaGFuZ2VzIGF3YWl0aW5nIHJlY29uY2lsaWF0aW9uCm9rIDI1NyAtIG5ldyBhY3Rp
dmF0aW9uIHJlZnVzZXMgdG8gbWFzayBvZmZsaW5lIGNoYW5nZXMgYXdhaXRpbmcgcmVjb25jaWxp
YXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC43MzI2OTQKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBmbHVzaCByZXRhaW5zIG5ld2x5IGVucXVldWVkIGVudHJpZXMgZXZlbiBpZiBx
dWV1ZSBsZW5ndGggY2hhbmdlcwpvayAyNTggLSBmbHVzaCByZXRhaW5zIG5ld2x5IGVucXVldWVk
IGVudHJpZXMgZXZlbiBpZiBxdWV1ZSBsZW5ndGggY2hhbmdlcwogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjgzNzQzMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbW1pdCBjYXJyaWVz
IGdlbmVyYXRpb24gZnJvbSBzZXJ2ZXIgbGVhc2UKb2sgMjU5IC0gY29tbWl0IGNhcnJpZXMgZ2Vu
ZXJhdGlvbiBmcm9tIHNlcnZlciBsZWFzZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQ5Mjc3Mwog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFjdGl2YXRpb24gcmVqZWN0cyBtaXNzaW5n
IGdlbmVyYXRpb24gZnJvbSBSUEMKb2sgMjYwIC0gYWN0aXZhdGlvbiByZWplY3RzIG1pc3Npbmcg
Z2VuZXJhdGlvbiBmcm9tIFJQQwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIxNTM2NAogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFjdGl2YXRpb24gcmVmdXNlcyBjbG91ZCBzbmFwc2hv
dCBpZiBsb2NhbCBlZGl0cyBhcnJpdmUgd2hpbGUgUlBDIGlzIHBlbmRpbmcKb2sgMjYxIC0gYWN0
aXZhdGlvbiByZWZ1c2VzIGNsb3VkIHNuYXBzaG90IGlmIGxvY2FsIGVkaXRzIGFycml2ZSB3aGls
ZSBSUEMgaXMgcGVuZGluZwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQ0NzAwNAogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFjdGl2YXRpb24gcmVmdXNlcyB0byBzaWxlbnRseSByZXBs
YWNlIGRpc3RpbmN0IGxvY2FsIHNjb3JlIHdpdGggY2xvdWQKb2sgMjYyIC0gYWN0aXZhdGlvbiBy
ZWZ1c2VzIHRvIHNpbGVudGx5IHJlcGxhY2UgZGlzdGluY3QgbG9jYWwgc2NvcmUgd2l0aCBjbG91
ZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI3NjcyNwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IGFjdGl2YXRpb24gcmVmdXNlcyB3cml0ZXIgbGVhc2Ugd2l0aG91dCBzZXJ2ZXItaXNz
dWVkIHRva2VuCm9rIDI2MyAtIGFjdGl2YXRpb24gcmVmdXNlcyB3cml0ZXIgbGVhc2Ugd2l0aG91
dCBzZXJ2ZXItaXNzdWVkIHRva2VuCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjc2MDk3CiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmV2aXNpb24gemVybyBjYW5ub3Qgc2lsZW50bHkg
b3ZlcndyaXRlIGEgZGlmZmVyZW50IGxvY2FsIGdhbWUKb2sgMjY0IC0gcmV2aXNpb24gemVybyBj
YW5ub3Qgc2lsZW50bHkgb3ZlcndyaXRlIGEgZGlmZmVyZW50IGxvY2FsIGdhbWUKICAtLS0KICBk
dXJhdGlvbl9tczogMC43MDU2MTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZXZp
c2lvbiBjb25mbGljdCBmcmVlemVzIGFsbCBmdXJ0aGVyIHdyaXRlcyB1bnRpbCBleHBsaWNpdCBy
ZWNvbmNpbGlhdGlvbgpvayAyNjUgLSByZXZpc2lvbiBjb25mbGljdCBmcmVlemVzIGFsbCBmdXJ0
aGVyIHdyaXRlcyB1bnRpbCBleHBsaWNpdCByZWNvbmNpbGlhdGlvbgogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjU5MTA5MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHdyaXRlciByZXZv
Y2F0aW9uIGZyZWV6ZXMgc3Vic2VxdWVudCB3cml0ZXMgYW5kIHJldGFpbnMgYWxsIHF1ZXVlZCBj
aGFuZ2VzCm9rIDI2NiAtIHdyaXRlciByZXZvY2F0aW9uIGZyZWV6ZXMgc3Vic2VxdWVudCB3cml0
ZXMgYW5kIHJldGFpbnMgYWxsIHF1ZXVlZCBjaGFuZ2VzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
OTg5NzEyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcGFyYWxsZWwgYWN0aXZhdGlv
bnMgY2Fubm90IGNyZWF0ZSBjb21wZXRpbmcgc2VydmVyIGxlYXNlcwpvayAyNjcgLSBwYXJhbGxl
bCBhY3RpdmF0aW9ucyBjYW5ub3QgY3JlYXRlIGNvbXBldGluZyBzZXJ2ZXIgbGVhc2VzCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMzg5NDY3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
YSBxdWV1ZWQgZWRpdCBjYW5ub3QgYmUgc2VudCBkdXJpbmcgYWN0aXZhdGlvbiBiZWZvcmUgbGVh
c2UgaXMgYWNjZXB0ZWQKb2sgMjY4IC0gYSBxdWV1ZWQgZWRpdCBjYW5ub3QgYmUgc2VudCBkdXJp
bmcgYWN0aXZhdGlvbiBiZWZvcmUgbGVhc2UgaXMgYWNjZXB0ZWQKICAtLS0KICBkdXJhdGlvbl9t
czogMC40NTEwMzkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBuZXcgYWN0aXZhdGlv
biBjYW5ub3Qgb3ZlcmxhcCBhIG5ldHdvcmsgY29tbWl0Cm9rIDI2OSAtIG5ldyBhY3RpdmF0aW9u
IGNhbm5vdCBvdmVybGFwIGEgbmV0d29yayBjb21taXQKICAtLS0KICBkdXJhdGlvbl9tczogMC41
MDc4NjYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdXBhYmFzZSBwZXJtaXNzaW9u
IGRlbmlhbCBmcmVlemVzIHdyaXRlcyBhbmQgcHJlc2VydmVzIHF1ZXVlZCBzY29yZQpvayAyNzAg
LSBTdXBhYmFzZSBwZXJtaXNzaW9uIGRlbmlhbCBmcmVlemVzIHdyaXRlcyBhbmQgcHJlc2VydmVz
IHF1ZXVlZCBzY29yZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjY1NzU4MQogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IHRlbXBvcmFyeSBTdXBhYmFzZSB0cmFuc3BvcnQgZXJyb3JzIHJl
bWFpbiByZXRyeWFibGUKb2sgMjcxIC0gdGVtcG9yYXJ5IFN1cGFiYXNlIHRyYW5zcG9ydCBlcnJv
cnMgcmVtYWluIHJldHJ5YWJsZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjU2NjY0NAogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvcnJ1cHQgcGVyc2lzdGVudCBxdWV1ZSBibG9ja3Mg
YWN0aXZhdGlvbiB3aXRob3V0IGNvbnRhY3Rpbmcgc2VydmVyCm9rIDI3MiAtIGNvcnJ1cHQgcGVy
c2lzdGVudCBxdWV1ZSBibG9ja3MgYWN0aXZhdGlvbiB3aXRob3V0IGNvbnRhY3Rpbmcgc2VydmVy
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjgxNzY1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogcXVldWUgd2l0aCB3cm9uZyBKU09OIHR5cGUgaXMgbmV2ZXIgb3ZlcndyaXR0ZW4Kb2sg
MjczIC0gcXVldWUgd2l0aCB3cm9uZyBKU09OIHR5cGUgaXMgbmV2ZXIgb3ZlcndyaXR0ZW4KICAt
LS0KICBkdXJhdGlvbl9tczogMC4yMDU2MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IGZhaWxlZCByZWFjdGl2YXRpb24gaW52YWxpZGF0ZXMgcHJldmlvdXMgd3JpdGVyIGxlYXNlIGJl
Zm9yZSBhbm90aGVyIHNjb3JlIGNhbiBiZSBzZW50Cm9rIDI3NCAtIGZhaWxlZCByZWFjdGl2YXRp
b24gaW52YWxpZGF0ZXMgcHJldmlvdXMgd3JpdGVyIGxlYXNlIGJlZm9yZSBhbm90aGVyIHNjb3Jl
IGNhbiBiZSBzZW50CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNjE3MzQKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBjb25mbGljdGluZyByZWFjdGl2YXRpb24gY2Fubm90IHJldXNlIGVh
cmxpZXIgd3JpdGVyIHRva2VuCm9rIDI3NSAtIGNvbmZsaWN0aW5nIHJlYWN0aXZhdGlvbiBjYW5u
b3QgcmV1c2UgZWFybGllciB3cml0ZXIgdG9rZW4KICAtLS0KICBkdXJhdGlvbl9tczogMC42OTc5
NzIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzZXJ2ZXIgcmVzcG9uc2UgYXV0aG9y
aXphdGlvbi1yZWplY3RlZCBmcmVlemVzIHN1YnNlcXVlbnQgY29tbWl0cwpvayAyNzYgLSBzZXJ2
ZXIgcmVzcG9uc2UgYXV0aG9yaXphdGlvbi1yZWplY3RlZCBmcmVlemVzIHN1YnNlcXVlbnQgY29t
bWl0cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjU0MzE1OAogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IHNlcnZlciByZXNwb25zZSBzZXNzaW9uLXJldm9rZWQgZnJlZXplcyBzdWJzZXF1
ZW50IGNvbW1pdHMKb2sgMjc3IC0gc2VydmVyIHJlc3BvbnNlIHNlc3Npb24tcmV2b2tlZCBmcmVl
emVzIHN1YnNlcXVlbnQgY29tbWl0cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQzMjE3MQogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNlcnZlciByZXNwb25zZSBhY2NvdW50LWluYWN0
aXZlIGZyZWV6ZXMgc3Vic2VxdWVudCBjb21taXRzCm9rIDI3OCAtIHNlcnZlciByZXNwb25zZSBh
Y2NvdW50LWluYWN0aXZlIGZyZWV6ZXMgc3Vic2VxdWVudCBjb21taXRzCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuNDEwMjc4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVjb3Zlcnkg
ZXhwb3J0IHByZXNlcnZlcyBvZmZsaW5lIHNjb3JlcyBhbmQgZXhjbHVkZXMgc2Vzc2lvbiBzZWNy
ZXRzCm9rIDI3OSAtIHJlY292ZXJ5IGV4cG9ydCBwcmVzZXJ2ZXMgb2ZmbGluZSBzY29yZXMgYW5k
IGV4Y2x1ZGVzIHNlc3Npb24gc2VjcmV0cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjkxNTYxCiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVjb3ZlcnkgZXhwb3J0IGZhaWxzIGNsb3Nl
ZCB3aGVuIGJhY2t1cCBlbnRyaWVzIGFyZSBjb3JydXB0ZWQKb2sgMjgwIC0gcmVjb3ZlcnkgZXhw
b3J0IGZhaWxzIGNsb3NlZCB3aGVuIGJhY2t1cCBlbnRyaWVzIGFyZSBjb3JydXB0ZWQKICAtLS0K
ICBkdXJhdGlvbl9tczogMC4xODcxOTIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiB1
bmV4cGVjdGVkIHN1Y2Nlc3NmdWwgcmV2aXNpb24gZnJlZXplcyB3cml0ZXMgcmF0aGVyIHRoYW4g
cmV0cnlpbmcgYW4gYW1iaWd1b3VzIGNvbW1pdApvayAyODEgLSB1bmV4cGVjdGVkIHN1Y2Nlc3Nm
dWwgcmV2aXNpb24gZnJlZXplcyB3cml0ZXMgcmF0aGVyIHRoYW4gcmV0cnlpbmcgYW4gYW1iaWd1
b3VzIGNvbW1pdAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjYwOTYwOQogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IGZsdXNoIHJlZnVzZXMgbWFsZm9ybWVkIHF1ZXVlZCBzbmFwc2hvdHMg
YmVmb3JlIG5ldHdvcmsgd3JpdGUKb2sgMjgyIC0gZmx1c2ggcmVmdXNlcyBtYWxmb3JtZWQgcXVl
dWVkIHNuYXBzaG90cyBiZWZvcmUgbmV0d29yayB3cml0ZQogIC0tLQogIGR1cmF0aW9uX21zOiAx
LjA4Nzc1OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGZsdXNoIHJlZnVzZXMgZHVw
bGljYXRlIHBlbmRpbmcgSURzIHRvIHByZXZlbnQgZHJvcHBpbmcgdW5zZW50IGVkaXRzCm9rIDI4
MyAtIGZsdXNoIHJlZnVzZXMgZHVwbGljYXRlIHBlbmRpbmcgSURzIHRvIHByZXZlbnQgZHJvcHBp
bmcgdW5zZW50IGVkaXRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDg2MTYzCiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogYWNrbm93bGVkZ2VkIFJQQyB3aXRoIGxvY2FsIHF1ZXVlIGNs
ZWFudXAgZmFpbHVyZSBtdXN0IG5ldmVyIHJldHJ5IG5ldHdvcmsgY29tbWl0Cm9rIDI4NCAtIGFj
a25vd2xlZGdlZCBSUEMgd2l0aCBsb2NhbCBxdWV1ZSBjbGVhbnVwIGZhaWx1cmUgbXVzdCBuZXZl
ciByZXRyeSBuZXR3b3JrIGNvbW1pdAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM2MjM5NwogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFjdGl2YXRpb24gcmVqZWN0cyBhbWJpZ3VvdXMg
d3JpdGUgcGVybWlzc2lvbiBhbmQgbmV2ZXIgZ3JhbnRzIGEgd3JpdGVyCm9rIDI4NSAtIGFjdGl2
YXRpb24gcmVqZWN0cyBhbWJpZ3VvdXMgd3JpdGUgcGVybWlzc2lvbiBhbmQgbmV2ZXIgZ3JhbnRz
IGEgd3JpdGVyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzYxMTA0CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogYWN0aXZhdGlvbiByZWplY3RzIGEgd3JpdGVyIHRva2VuIGF0dGFjaGVk
IHRvIHJlYWQtb25seSBsZWFzZQpvayAyODYgLSBhY3RpdmF0aW9uIHJlamVjdHMgYSB3cml0ZXIg
dG9rZW4gYXR0YWNoZWQgdG8gcmVhZC1vbmx5IGxlYXNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MzI0MDg5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29uY3VycmVudCBzY29yZSBl
ZGl0cyBxdWV1ZWQgZHVyaW5nIG5ldHdvcmsgY29tbWl0IGFyZSBkcmFpbmVkCm9rIDI4NyAtIGNv
bmN1cnJlbnQgc2NvcmUgZWRpdHMgcXVldWVkIGR1cmluZyBuZXR3b3JrIGNvbW1pdCBhcmUgZHJh
aW5lZAogIC0tLQogIGR1cmF0aW9uX21zOiAyMC42NTI3MDIKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBuZXcgZGV2aWNlIHdpdGhvdXQgYSBsb2NhbCBnYW1lIGNhbiBhZG9wdCBjb21w
bGV0ZSBjbG91ZCBnYW1lCm9rIDI4OCAtIG5ldyBkZXZpY2Ugd2l0aG91dCBhIGxvY2FsIGdhbWUg
Y2FuIGFkb3B0IGNvbXBsZXRlIGNsb3VkIGdhbWUKICAtLS0KICBkdXJhdGlvbl9tczogMC42MzM1
MjUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBuZXcgZGV2aWNlIHdpdGhvdXQgbG9j
YWwgZ2FtZSBkb2VzIG5vdCBpbnZlbnQgYW4gZW1wdHkgZ2FtZSB3aGVuIGNsb3VkIGlzIGFic2Vu
dApvayAyODkgLSBuZXcgZGV2aWNlIHdpdGhvdXQgbG9jYWwgZ2FtZSBkb2VzIG5vdCBpbnZlbnQg
YW4gZW1wdHkgZ2FtZSB3aGVuIGNsb3VkIGlzIGFic2VudAogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjI0NDc5OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNsb3VkIHByZWZsaWdodCBt
aXNtYXRjaCBpcyBhIHRlcm1pbmFsIGNvbmZsaWN0IGFuZCBkb2VzIG5vdCByZXRyeSB0YWtlb3Zl
cgpvayAyOTAgLSBjbG91ZCBwcmVmbGlnaHQgbWlzbWF0Y2ggaXMgYSB0ZXJtaW5hbCBjb25mbGlj
dCBhbmQgZG9lcyBub3QgcmV0cnkgdGFrZW92ZXIKICAtLS0KICBkdXJhdGlvbl9tczogMC40MDEz
MTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjbG91ZCByZXZpc2lvbiBjaGFuZ2Ug
ZHVyaW5nIHRha2VvdmVyIGlzIGEgdGVybWluYWwgY29uZmxpY3QKb2sgMjkxIC0gY2xvdWQgcmV2
aXNpb24gY2hhbmdlIGR1cmluZyB0YWtlb3ZlciBpcyBhIHRlcm1pbmFsIGNvbmZsaWN0CiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMzU1ODQ2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
Y2xpZW50IHJlamVjdHMgZnJhY3Rpb25hbCBhbmQgdW5zYWZlIHNjb3JlcyBiZWZvcmUgYW55IG5l
dHdvcmsgd3JpdGUKb2sgMjkyIC0gY2xpZW50IHJlamVjdHMgZnJhY3Rpb25hbCBhbmQgdW5zYWZl
IHNjb3JlcyBiZWZvcmUgYW55IG5ldHdvcmsgd3JpdGUKICAtLS0KICBkdXJhdGlvbl9tczogMC41
Mzc1NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlYWQtb25seSBwdXNoIHByZXNl
cnZlcyBwcmUtZXhpc3RpbmcgcmVjb3ZlcnkgcXVldWUgd2l0aG91dCBhZGRpbmcgYSBuZXcgZWRp
dApvayAyOTMgLSByZWFkLW9ubHkgcHVzaCBwcmVzZXJ2ZXMgcHJlLWV4aXN0aW5nIHJlY292ZXJ5
IHF1ZXVlIHdpdGhvdXQgYWRkaW5nIGEgbmV3IGVkaXQKICAtLS0KICBkdXJhdGlvbl9tczogMC40
ODc5NjYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdXBhYmFzZSBqc29uYiBrZXkg
cmVvcmRlcmluZyBkb2VzIG5vdCBjcmVhdGUgYSBmYWxzZSBnYW1lIGNvbmZsaWN0Cm9rIDI5NCAt
IFN1cGFiYXNlIGpzb25iIGtleSByZW9yZGVyaW5nIGRvZXMgbm90IGNyZWF0ZSBhIGZhbHNlIGdh
bWUgY29uZmxpY3QKICAtLS0KICBkdXJhdGlvbl9tczogMC40NDk5ODgKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBzdHJ1Y3R1cmFsIGNvbXBhcmlzb24gc3RpbGwgZGV0ZWN0cyBzY29y
ZSBhbmQgYXJyYXkgb3JkZXIgY2hhbmdlcwpvayAyOTUgLSBzdHJ1Y3R1cmFsIGNvbXBhcmlzb24g
c3RpbGwgZGV0ZWN0cyBzY29yZSBhbmQgYXJyYXkgb3JkZXIgY2hhbmdlcwogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjE1OTc4MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJvdW5kIGNv
dW50IG11c3QgYmUgYSBib3VuZGVkIHNhZmUgaW50ZWdlciwgbWF0Y2hpbmcgc2VydmVyIFNRTApv
ayAyOTYgLSByb3VuZCBjb3VudCBtdXN0IGJlIGEgYm91bmRlZCBzYWZlIGludGVnZXIsIG1hdGNo
aW5nIHNlcnZlciBTUUwKICAtLS0KICBkdXJhdGlvbl9tczogMC41MDgyNTYKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiBsZWFzZSBwb2xsaW5nIHRyYW5zcG9ydCBmYWlsdXJlIHJldm9r
ZXMgbG9jYWwgd3JpdGVyIHdpdGhvdXQgbG9zaW5nIHBlbmRpbmcgZGF0YQpvayAyOTcgLSBsZWFz
ZSBwb2xsaW5nIHRyYW5zcG9ydCBmYWlsdXJlIHJldm9rZXMgbG9jYWwgd3JpdGVyIHdpdGhvdXQg
bG9zaW5nIHBlbmRpbmcgZGF0YQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjU3OTQ4MwogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxhdGUgbGVhc2UgcmVqZWN0aW9uIGZyb20gYW4gZWFy
bGllciBhY3RpdmF0aW9uIGNhbm5vdCByZXZva2UgYSByZXBsYWNlbWVudCB3cml0ZXIKb2sgMjk4
IC0gbGF0ZSBsZWFzZSByZWplY3Rpb24gZnJvbSBhbiBlYXJsaWVyIGFjdGl2YXRpb24gY2Fubm90
IHJldm9rZSBhIHJlcGxhY2VtZW50IHdyaXRlcgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQyNzMw
NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxhdGUgbGVhc2UgbmV0d29yayBlcnJv
ciBmcm9tIGFuIGVhcmxpZXIgYWN0aXZhdGlvbiBjYW5ub3QgcmV2b2tlIGEgcmVwbGFjZW1lbnQg
d3JpdGVyCm9rIDI5OSAtIGxhdGUgbGVhc2UgbmV0d29yayBlcnJvciBmcm9tIGFuIGVhcmxpZXIg
YWN0aXZhdGlvbiBjYW5ub3QgcmV2b2tlIGEgcmVwbGFjZW1lbnQgd3JpdGVyCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuNTQyMDA3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbGVhc2Ug
cG9sbCByZWZ1c2VzIGEgbmV3ZXIgY2xvdWQgcmV2aXNpb24gd2l0aG91dCBkaXNjYXJkaW5nIGxv
Y2FsIHJlY292ZXJ5IGRhdGEKb2sgMzAwIC0gbGVhc2UgcG9sbCByZWZ1c2VzIGEgbmV3ZXIgY2xv
dWQgcmV2aXNpb24gd2l0aG91dCBkaXNjYXJkaW5nIGxvY2FsIHJlY292ZXJ5IGRhdGEKICAtLS0K
ICBkdXJhdGlvbl9tczogMC43MTI0MDQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBu
ZXctZGV2aWNlIHRha2VvdmVyIHByZXNlcnZlcyBkaWZmZXJpbmcgbG9jYWwgZ2FtZSBpbiByZWNv
dmVyeSBiYWNrdXAKb2sgMzAxIC0gbmV3LWRldmljZSB0YWtlb3ZlciBwcmVzZXJ2ZXMgZGlmZmVy
aW5nIGxvY2FsIGdhbWUgaW4gcmVjb3ZlcnkgYmFja3VwCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
NDI2MTgyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogZmlyc3QgZ2FtZSBib290c3Ry
YXBzIG9ubHkgd2hlbiBwZWVrIGNvbmZpcm1zIGNsb3VkIGlzIGFic2VudApvayAzMDIgLSBmaXJz
dCBnYW1lIGJvb3RzdHJhcHMgb25seSB3aGVuIHBlZWsgY29uZmlybXMgY2xvdWQgaXMgYWJzZW50
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDIuNTM2Njg0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogZm91bmRhdGlvbiBoYXMgc2luZ2xlLWFjdGl2ZS1kZXZpY2UgaW5kZXggaW5jb21wYXRp
YmxlIHdpdGggbXVsdGktZGV2aWNlIHJlYWRlciBsZWFzZXMKb2sgMzAzIC0gZm91bmRhdGlvbiBo
YXMgc2luZ2xlLWFjdGl2ZS1kZXZpY2UgaW5kZXggaW5jb21wYXRpYmxlIHdpdGggbXVsdGktZGV2
aWNlIHJlYWRlciBsZWFzZXMKICAtLS0KICBkdXJhdGlvbl9tczogMS4zNzA1ODYKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBkcmFmdCBkZXBlbmRzIG9uIGxlYXNlIGNvbHVtbnMgYWJz
ZW50IGZyb20gZm91bmRhdGlvbiBtaWdyYXRpb24Kb2sgMzA0IC0gZHJhZnQgZGVwZW5kcyBvbiBs
ZWFzZSBjb2x1bW5zIGFic2VudCBmcm9tIGZvdW5kYXRpb24gbWlncmF0aW9uCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuNDk2Nzg5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZC1v
bmx5IHByZWZsaWdodCBtdXN0IGJlIGV4dGVuZGVkIHRvIGRldGVjdCBibG9ja2luZyB1bmlxdWUg
aW5kZXggYW5kIHJlcXVpcmVkIHBhcnRpYWwgaW5kZXgKb2sgMzA1IC0gcmVhZC1vbmx5IHByZWZs
aWdodCBtdXN0IGJlIGV4dGVuZGVkIHRvIGRldGVjdCBibG9ja2luZyB1bmlxdWUgaW5kZXggYW5k
IHJlcXVpcmVkIHBhcnRpYWwgaW5kZXgKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNzEyMzkKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBQQVNTOiBzeW5jIGZvdW5kYXRpb24gc2NoZW1hIGZhaWwtY2xv
c2VkLCBvcmlnaW5hbCBhcHAgdW50b3VjaGVkCiMgU3VidGVzdDogdGVzdHMvc3luYy1mb3VuZGF0
aW9uLnRlc3QuY2pzCm9rIDQ1IC0gdGVzdHMvc3luYy1mb3VuZGF0aW9uLnRlc3QuY2pzCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDQwLjM1NzgyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
Zml4dHVyZSBtYXRjaGVzIGFjdHVhbCBhcHBsaWNhdGlvbiBkZWZhdWx0IHN0YXRlCm9rIDMwNyAt
IGZpeHR1cmUgbWF0Y2hlcyBhY3R1YWwgYXBwbGljYXRpb24gZGVmYXVsdCBzdGF0ZQogIC0tLQog
IGR1cmF0aW9uX21zOiA0LjI5Mzc3MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJl
amVjdCBpbnZhbGlkIHdpbmQgYXNzaWdubWVudHMgd2l0aG91dCBjaGFuZ2luZyBjYWxsZXIgc3Rh
dGUKb2sgMzA4IC0gcmVqZWN0IGludmFsaWQgd2luZCBhc3NpZ25tZW50cyB3aXRob3V0IGNoYW5n
aW5nIGNhbGxlciBzdGF0ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjU0MTc2NwogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlamVjdCBtYWxmb3JtZWQgaGlzdG9yeSBhbmQgcm91bmQg
d2luZApvayAzMDkgLSByZWplY3QgbWFsZm9ybWVkIGhpc3RvcnkgYW5kIHJvdW5kIHdpbmQKICAt
LS0KICBkdXJhdGlvbl9tczogMC4yODM5ODgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiByZWplY3QgVVRGLTggb3ZlcnNpemVkIGhpc3RvcnkgZXZlbiB3aGVuIEphdmFTY3JpcHQgVVRG
LTE2IGxlbmd0aCBpcyB1bmRlciBsaW1pdApvayAzMTAgLSByZWplY3QgVVRGLTggb3ZlcnNpemVk
IGhpc3RvcnkgZXZlbiB3aGVuIEphdmFTY3JpcHQgVVRGLTE2IGxlbmd0aCBpcyB1bmRlciBsaW1p
dAogIC0tLQogIGR1cmF0aW9uX21zOiA1MS4yNjkzMDMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBwcmVzZXJ2ZSByZWFsaXN0aWMgSHUsIFppIE1vLCBRdWFkLCBwYXR0ZXJucywgYW5k
IGhpc3RvcmljYWwgc2VhdCBtZXRhZGF0YSBpbiBhIGNsb3VkIHNuYXBzaG90Cm9rIDMxMSAtIHBy
ZXNlcnZlIHJlYWxpc3RpYyBIdSwgWmkgTW8sIFF1YWQsIHBhdHRlcm5zLCBhbmQgaGlzdG9yaWNh
bCBzZWF0IG1ldGFkYXRhIGluIGEgY2xvdWQgc25hcHNob3QKICAtLS0KICBkdXJhdGlvbl9tczog
MC42MzM2MzYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWplY3QgbWFsZm9ybWVk
IGhpc3RvcnkgZW50cmllcyB3aGlsZSBwcmVzZXJ2aW5nIG9yaWdpbmFsIHNvdXJjZSBkYXRhCm9r
IDMxMiAtIHJlamVjdCBtYWxmb3JtZWQgaGlzdG9yeSBlbnRyaWVzIHdoaWxlIHByZXNlcnZpbmcg
b3JpZ2luYWwgc291cmNlIGRhdGEKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNzAzNDcKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFsaXN0aWMgbXVsdGktcm91bmQgc2NvcmUgc25h
cHNob3Qgc3Vydml2ZXMgSlNPTiBzZXJpYWxpemF0aW9uIHdpdGhvdXQgbG9zaW5nIE1haGpvbmcg
aGlzdG9yeQpvayAzMTMgLSByZWFsaXN0aWMgbXVsdGktcm91bmQgc2NvcmUgc25hcHNob3Qgc3Vy
dml2ZXMgSlNPTiBzZXJpYWxpemF0aW9uIHdpdGhvdXQgbG9zaW5nIE1haGpvbmcgaGlzdG9yeQog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjYyOTM4OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IGZ1bGwgcmVjb3JkZWQgaGFuZCBwYXlsb2FkIHJldGFpbnMgYWN0dWFsIGFwcGxpY2F0aW9u
IGhpc3RvcnkgZmllbGRzIHRocm91Z2ggY2xvdWQgdmFsaWRhdGlvbgpvayAzMTQgLSBmdWxsIHJl
Y29yZGVkIGhhbmQgcGF5bG9hZCByZXRhaW5zIGFjdHVhbCBhcHBsaWNhdGlvbiBoaXN0b3J5IGZp
ZWxkcyB0aHJvdWdoIGNsb3VkIHZhbGlkYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4zODI0
NjYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWplY3QgY29ycnVwdCBzY29yaW5n
IHZlY3RvcnMgYW5kIHF1YWQgY291bnRzIGluc2lkZSByZWNvcmRlZCBoYW5kcwpvayAzMTUgLSBy
ZWplY3QgY29ycnVwdCBzY29yaW5nIHZlY3RvcnMgYW5kIHF1YWQgY291bnRzIGluc2lkZSByZWNv
cmRlZCBoYW5kcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQyNzM1NQogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IGNvbXBsZXRlIHJlY29yZGVkLWhhbmQgcmVjb3ZlcnkgcHJlc2VydmVz
IG9wdGlvbmFsIGNvbWJpbmF0aW9uIGFuZCBxdWFkIG1ldGFkYXRhCm9rIDMxNiAtIGNvbXBsZXRl
IHJlY29yZGVkLWhhbmQgcmVjb3ZlcnkgcHJlc2VydmVzIG9wdGlvbmFsIGNvbWJpbmF0aW9uIGFu
ZCBxdWFkIG1ldGFkYXRhCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDgwMTM0CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IG5vbi1maW5pdGUgbmVzdGVkIGhpc3RvcnkgbWV0
YWRhdGEgcmF0aGVyIHRoYW4gc2lsZW50bHkgcmVwbGFjaW5nIGl0IHdpdGggbnVsbApvayAzMTcg
LSByZWplY3Qgbm9uLWZpbml0ZSBuZXN0ZWQgaGlzdG9yeSBtZXRhZGF0YSByYXRoZXIgdGhhbiBz
aWxlbnRseSByZXBsYWNpbmcgaXQgd2l0aCBudWxsCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjYx
MTE0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IHNpbGVudGx5IGRpc2Nh
cmRlZCBuZXN0ZWQgaGlzdG9yeSBtZXRhZGF0YSBhbmQgcHJlc2VydmUgc291cmNlCm9rIDMxOCAt
IHJlamVjdCBzaWxlbnRseSBkaXNjYXJkZWQgbmVzdGVkIGhpc3RvcnkgbWV0YWRhdGEgYW5kIHBy
ZXNlcnZlIHNvdXJjZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM2NjUwMgogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IHJlamVjdCBjb3JydXB0IGhpc3RvcmljYWwgd2luZCBzbmFwc2hv
dCB3aXRob3V0IG1vZGlmeWluZyBvcmlnaW5hbCBnYW1lCm9rIDMxOSAtIHJlamVjdCBjb3JydXB0
IGhpc3RvcmljYWwgd2luZCBzbmFwc2hvdCB3aXRob3V0IG1vZGlmeWluZyBvcmlnaW5hbCBnYW1l
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjIyMTA1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogcmVqZWN0IGhpc3RvcmljYWwgcGxheWVyIG5hbWVzIGV4Y2VlZGluZyB0aGUgc2VydmVy
LXNpZGUgMTAwLWNoYXJhY3RlciBsaW1pdApvayAzMjAgLSByZWplY3QgaGlzdG9yaWNhbCBwbGF5
ZXIgbmFtZXMgZXhjZWVkaW5nIHRoZSBzZXJ2ZXItc2lkZSAxMDAtY2hhcmFjdGVyIGxpbWl0CiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMTE3MjE2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogcmVqZWN0IG1hbGZvcm1lZCBwbGF5ZXItc3BlY2lmaWMgY29tYmluYXRpb25zIHdpdGhvdXQg
bG9zaW5nIHRoZSBzb3VyY2UgaGlzdG9yeQpvayAzMjEgLSByZWplY3QgbWFsZm9ybWVkIHBsYXll
ci1zcGVjaWZpYyBjb21iaW5hdGlvbnMgd2l0aG91dCBsb3NpbmcgdGhlIHNvdXJjZSBoaXN0b3J5
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjA3OTUzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogcmVqZWN0IFVuaWNvZGUgTlVMIGFuZCB1bnBhaXJlZCBzdXJyb2dhdGVzIGluIGhpc3Rv
cmljYWwgbWV0YWRhdGEga2V5cyBhbmQgdmFsdWVzCm9rIDMyMiAtIHJlamVjdCBVbmljb2RlIE5V
TCBhbmQgdW5wYWlyZWQgc3Vycm9nYXRlcyBpbiBoaXN0b3JpY2FsIG1ldGFkYXRhIGtleXMgYW5k
IHZhbHVlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjYyNzQ0NgogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IGFjY2VwdCB2YWxpZCBzdXBwbGVtZW50YXJ5IFVuaWNvZGUgY2hhcmFjdGVy
cyBpbiBoaXN0b3JpY2FsIG1ldGFkYXRhCm9rIDMyMyAtIGFjY2VwdCB2YWxpZCBzdXBwbGVtZW50
YXJ5IFVuaWNvZGUgY2hhcmFjdGVycyBpbiBoaXN0b3JpY2FsIG1ldGFkYXRhCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMTc0OTA0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0
IG5vbi1KU09OIGxlZ2FjeSBvYmplY3RzIHJhdGhlciB0aGFuIHNpbGVudGx5IGVyYXNpbmcgaGlz
dG9yeQpvayAzMjQgLSByZWplY3Qgbm9uLUpTT04gbGVnYWN5IG9iamVjdHMgcmF0aGVyIHRoYW4g
c2lsZW50bHkgZXJhc2luZyBoaXN0b3J5CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzAyNTI2CiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb3B0aW9uYWwgaGlzdG9yeSBwbGF5ZXIgaW5k
ZXhlcyBhY2NlcHQgbnVsbCwgYnV0IG5ldmVyIGludmFsaWQgdmFsdWVzCm9rIDMyNSAtIG9wdGlv
bmFsIGhpc3RvcnkgcGxheWVyIGluZGV4ZXMgYWNjZXB0IG51bGwsIGJ1dCBuZXZlciBpbnZhbGlk
IHZhbHVlcwogIC0tLQogIGR1cmF0aW9uX21zOiAzLjM5NDUwNwogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IGhpc3RvcnkgdW5rbm93biBmaWVsZHMgc3Vydml2ZSBKU09OIHJvdW5kdHJp
cCB3aGlsZSBtYWxmb3JtZWQga25vd24gdmVjdG9ycyBhcmUgcmVqZWN0ZWQKb2sgMzI2IC0gaGlz
dG9yeSB1bmtub3duIGZpZWxkcyBzdXJ2aXZlIEpTT04gcm91bmR0cmlwIHdoaWxlIG1hbGZvcm1l
ZCBrbm93biB2ZWN0b3JzIGFyZSByZWplY3RlZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQ3MDg0
OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlamVjdCBoaXN0b3J5IG1ldGFkYXRh
IHRoYXQgSlNPTiB3b3VsZCBzaWxlbnRseSB0cmFuc2Zvcm0Kb2sgMzI3IC0gcmVqZWN0IGhpc3Rv
cnkgbWV0YWRhdGEgdGhhdCBKU09OIHdvdWxkIHNpbGVudGx5IHRyYW5zZm9ybQogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjYwNzY1NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlamVj
dCBzcGFyc2UgaGlzdG9yeSBtZXRhZGF0YSBhcnJheXMgYW5kIG5vbi1pbmRleCBhcnJheSBwcm9w
ZXJ0aWVzIGJlZm9yZSBKU09OIHNuYXBzaG90Cm9rIDMyOCAtIHJlamVjdCBzcGFyc2UgaGlzdG9y
eSBtZXRhZGF0YSBhcnJheXMgYW5kIG5vbi1pbmRleCBhcnJheSBwcm9wZXJ0aWVzIGJlZm9yZSBK
U09OIHNuYXBzaG90CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzMzOTI0CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IG1hbGZvcm1lZCBVbmljb2RlIGJlZm9yZSBTdXBhYmFz
ZSBqc29uYiBjb252ZXJzaW9uIHdoaWxlIHJldGFpbmluZyB2YWxpZCBlbW9qaQpvayAzMjkgLSBy
ZWplY3QgbWFsZm9ybWVkIFVuaWNvZGUgYmVmb3JlIFN1cGFiYXNlIGpzb25iIGNvbnZlcnNpb24g
d2hpbGUgcmV0YWluaW5nIHZhbGlkIGVtb2ppCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDE5MDIy
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IHVucGFpcmVkIFVuaWNvZGUg
c3Vycm9nYXRlcyBpbiBuZXN0ZWQgaGlzdG9yeSBvYmplY3Qga2V5cwpvayAzMzAgLSByZWplY3Qg
dW5wYWlyZWQgVW5pY29kZSBzdXJyb2dhdGVzIGluIG5lc3RlZCBoaXN0b3J5IG9iamVjdCBrZXlz
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjMxNjk5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogVW5pY29kZSBuYW1lIGxpbWl0cyBjb3VudCBjb2RlIHBvaW50cyBsaWtlIFBvc3RncmVT
UUwgbGVuZ3RoLCBub3QgVVRGLTE2IHVuaXRzCm9rIDMzMSAtIFVuaWNvZGUgbmFtZSBsaW1pdHMg
Y291bnQgY29kZSBwb2ludHMgbGlrZSBQb3N0Z3JlU1FMIGxlbmd0aCwgbm90IFVURi0xNiB1bml0
cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjUyODcwNwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IHJlamVjdCBQb3N0Z3JlU1FMLWluY29tcGF0aWJsZSBVbmljb2RlIE5VTCBpbiB2YWx1
ZXMgYW5kIG9iamVjdCBrZXlzCm9rIDMzMiAtIHJlamVjdCBQb3N0Z3JlU1FMLWluY29tcGF0aWJs
ZSBVbmljb2RlIE5VTCBpbiB2YWx1ZXMgYW5kIG9iamVjdCBrZXlzCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMzIwNjYzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3RydWN0dXJhbCBj
b21wYXJpc29uIHByZXNlcnZlcyBKU09OIGtleXMgbmFtZWQgX19wcm90b19fCm9rIDMzMyAtIHN0
cnVjdHVyYWwgY29tcGFyaXNvbiBwcmVzZXJ2ZXMgSlNPTiBrZXlzIG5hbWVkIF9fcHJvdG9fXwog
IC0tLQogIGR1cmF0aW9uX21zOiAxLjIzMDE5NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IFBvc3RncmVTUUwganNvbmIgc3BhY2luZyBjYW5ub3QgcHVzaCBuZWFyLWxpbWl0IGNvbXBh
Y3QgSlNPTiBvdmVyIDJNQgpvayAzMzQgLSBQb3N0Z3JlU1FMIGpzb25iIHNwYWNpbmcgY2Fubm90
IHB1c2ggbmVhci1saW1pdCBjb21wYWN0IEpTT04gb3ZlciAyTUIKICAtLS0KICBkdXJhdGlvbl9t
czogNTQ2LjgxMTg1NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGhpc3RvcmljYWwg
cm91bmQgd2luZCBtYXRjaGVzIGFjdHVhbCBzYXZlZCBoYW5kIGZvcm1hdCBhbmQgcmVqZWN0cyBp
bnZhbGlkIHdpbmRzCm9rIDMzNSAtIGhpc3RvcmljYWwgcm91bmQgd2luZCBtYXRjaGVzIGFjdHVh
bCBzYXZlZCBoYW5kIGZvcm1hdCBhbmQgcmVqZWN0cyBpbnZhbGlkIHdpbmRzCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuODU2MzYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWplY3Rz
IGdhbWUgcm9vdCB0cmFuc2Zvcm1lZCB0byBKU09OIG51bGwgYnkgdG9KU09OIGJlZm9yZSBSUEMK
b2sgMzM2IC0gcmVqZWN0cyBnYW1lIHJvb3QgdHJhbnNmb3JtZWQgdG8gSlNPTiBudWxsIGJ5IHRv
SlNPTiBiZWZvcmUgUlBDCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuNTI5NTA2CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0cyBnYW1lIHJvb3QgdHJhbnNmb3JtZWQgdG8gSlNP
TiBhcnJheSBieSB0b0pTT04gYmVmb3JlIFJQQwpvayAzMzcgLSByZWplY3RzIGdhbWUgcm9vdCB0
cmFuc2Zvcm1lZCB0byBKU09OIGFycmF5IGJ5IHRvSlNPTiBiZWZvcmUgUlBDCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMjY1NTEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhY2NlcHRz
IG9yZGluYXJ5IEpTT04gb2JqZWN0IHJvb3QgYW5kIHByZXNlcnZlcyBwYXlsb2FkCm9rIDMzOCAt
IGFjY2VwdHMgb3JkaW5hcnkgSlNPTiBvYmplY3Qgcm9vdCBhbmQgcHJlc2VydmVzIHBheWxvYWQK
ICAtLS0KICBkdXJhdGlvbl9tczogMS40OTE1NDgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBzZXJ2ZXIgcmV2b2NhdGlvbiBkaXNhYmxlcyB3cml0ZXIgd2l0aG91dCBjbGVhcmluZyBi
YWNrdXBzCm9rIDMzOSAtIHNlcnZlciByZXZvY2F0aW9uIGRpc2FibGVzIHdyaXRlciB3aXRob3V0
IGNsZWFyaW5nIGJhY2t1cHMKICAtLS0KICBkdXJhdGlvbl9tczogMS45OTU3MjgKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiB3cml0ZXIgbGVhc2UgZG93bmdyYWRlZCB0byByZWFkZXIg
aXMgbmV2ZXIgYXV0b21hdGljYWxseSByZXN0b3JlZApvayAzNDAgLSB3cml0ZXIgbGVhc2UgZG93
bmdyYWRlZCB0byByZWFkZXIgaXMgbmV2ZXIgYXV0b21hdGljYWxseSByZXN0b3JlZAogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjMyNzY5NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG5l
dHdvcmsgaW50ZXJydXB0aW9uIGRvZXMgbm90IHNpbGVudGx5IHJldm9rZSBvciByZW5ldyB3cml0
ZXIKb2sgMzQxIC0gbmV0d29yayBpbnRlcnJ1cHRpb24gZG9lcyBub3Qgc2lsZW50bHkgcmV2b2tl
IG9yIHJlbmV3IHdyaXRlcgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI0ODg3NgogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxlYXNlIHByb2JlIGNhbm5vdCByZXZva2Ugd3JpdGVyIGR1
cmluZyBhbiBpbi1mbGlnaHQgY29tbWl0Cm9rIDM0MiAtIGxlYXNlIHByb2JlIGNhbm5vdCByZXZv
a2Ugd3JpdGVyIGR1cmluZyBhbiBpbi1mbGlnaHQgY29tbWl0CiAgLS0tCiAgZHVyYXRpb25fbXM6
IDMuMTEzODA0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbGVhc2UgcHJvYmUgc3Rh
cnRlZCBiZWZvcmUgY29tbWl0IGNhbm5vdCBpbnZhbGlkYXRlIGFja25vd2xlZGdlZCByZXZpc2lv
bgpvayAzNDMgLSBsZWFzZSBwcm9iZSBzdGFydGVkIGJlZm9yZSBjb21taXQgY2Fubm90IGludmFs
aWRhdGUgYWNrbm93bGVkZ2VkIHJldmlzaW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNTg2MjM0
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb2xkZXIgcmV2b2tlZCBsZWFzZSByZXNw
b25zZSBjYW5ub3Qgb3ZlcnJpZGUgbmV3ZXIgdmFsaWQgbGVhc2UgcmVzcG9uc2UKb2sgMzQ0IC0g
b2xkZXIgcmV2b2tlZCBsZWFzZSByZXNwb25zZSBjYW5ub3Qgb3ZlcnJpZGUgbmV3ZXIgdmFsaWQg
bGVhc2UgcmVzcG9uc2UKICAtLS0KICBkdXJhdGlvbl9tczogMS44NDg1OTYKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiBvbGRlciBsZWFzZSBuZXR3b3JrIGVycm9yIGNhbm5vdCBvdmVy
cmlkZSBuZXdlciB2YWxpZCBsZWFzZSByZXNwb25zZQpvayAzNDUgLSBvbGRlciBsZWFzZSBuZXR3
b3JrIGVycm9yIGNhbm5vdCBvdmVycmlkZSBuZXdlciB2YWxpZCBsZWFzZSByZXNwb25zZQogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjM5MTYxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
c3luYyBtb2R1bGVzIGxvYWRlZCBiZWZvcmUgbWFpbiBhdXRoIGNvZGUKb2sgMzQ2IC0gc3luYyBt
b2R1bGVzIGxvYWRlZCBiZWZvcmUgbWFpbiBhdXRoIGNvZGUKICAtLS0KICBkdXJhdGlvbl9tczog
MS4yNzMwMjkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzeW5jIHJlbWFpbnMgZmFp
bC1jbG9zZWQgYW5kIGNsb3VkIGFkb3B0aW9uIHJlcXVpcmVzIHNhZmUgbG9jYWwgcGVyc2lzdGVu
Y2UKb2sgMzQ3IC0gc3luYyByZW1haW5zIGZhaWwtY2xvc2VkIGFuZCBjbG91ZCBhZG9wdGlvbiBy
ZXF1aXJlcyBzYWZlIGxvY2FsIHBlcnNpc3RlbmNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODQ5
NTcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBleGlzdGluZyBzYXZlIHdyaXRlcyBs
b2NhbGx5IGJlZm9yZSBhbnkgb3B0aW9uYWwgY2xvdWQgc2VuZApvayAzNDggLSBleGlzdGluZyBz
YXZlIHdyaXRlcyBsb2NhbGx5IGJlZm9yZSBhbnkgb3B0aW9uYWwgY2xvdWQgc2VuZAogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjI4NTg2MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxv
Z291dCByZXNldHMgYnJpZGdlIGFuZCBjYW5ub3QgbGVhdmUgc3RhbGUgYWN0aXZlIHNlc3Npb24K
b2sgMzQ5IC0gbG9nb3V0IHJlc2V0cyBicmlkZ2UgYW5kIGNhbm5vdCBsZWF2ZSBzdGFsZSBhY3Rp
dmUgc2Vzc2lvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI0MzQwNwogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IGNsb3VkLWVuYWJsZWQgbW9kZSByZWZ1c2VzIGxvY2FsIHNjb3JlIHBl
cnNpc3RlbmNlIHdpdGhvdXQgYW4gYWN0aXZlIHdyaXRlciBsZWFzZQpvayAzNTAgLSBjbG91ZC1l
bmFibGVkIG1vZGUgcmVmdXNlcyBsb2NhbCBzY29yZSBwZXJzaXN0ZW5jZSB3aXRob3V0IGFuIGFj
dGl2ZSB3cml0ZXIgbGVhc2UKICAtLS0KICBkdXJhdGlvbl9tczogMC40MDMwMTgKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhIHZhbmlzaGVkIGNsb3VkIGdhbWUgbmV2ZXIgc2lsZW50
bHkgYm9vdHN0cmFwcyBhIG5ldyBnYW1lIGFmdGVyIHByZWZsaWdodApvayAzNTEgLSBhIHZhbmlz
aGVkIGNsb3VkIGdhbWUgbmV2ZXIgc2lsZW50bHkgYm9vdHN0cmFwcyBhIG5ldyBnYW1lIGFmdGVy
IHByZWZsaWdodAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjcxMjA0MwogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IHN1cGFiYXNlX3N5bmNfcnBjX2RyYWZ0LnNxbDogcmVqZWN0IGFtYmln
dW91cyBhdXRoIHNlc3Npb25zIHdpdGggbnVsbCBjcmVhdGlvbiB0aW1lc3RhbXBzCm9rIDM1MiAt
IHN1cGFiYXNlX3N5bmNfcnBjX2RyYWZ0LnNxbDogcmVqZWN0IGFtYmlndW91cyBhdXRoIHNlc3Np
b25zIHdpdGggbnVsbCBjcmVhdGlvbiB0aW1lc3RhbXBzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEu
MzU2Nzc1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3VwYWJhc2Vfc3luY19zdGFn
ZTE0X3RyYW5zZmVyX2NhbmRpZGF0ZV9ET19OT1RfREVQTE9ZLnNxbDogcmVqZWN0IGFtYmlndW91
cyBhdXRoIHNlc3Npb25zIHdpdGggbnVsbCBjcmVhdGlvbiB0aW1lc3RhbXBzCm9rIDM1MyAtIHN1
cGFiYXNlX3N5bmNfc3RhZ2UxNF90cmFuc2Zlcl9jYW5kaWRhdGVfRE9fTk9UX0RFUExPWS5zcWw6
IHJlamVjdCBhbWJpZ3VvdXMgYXV0aCBzZXNzaW9ucyB3aXRoIG51bGwgY3JlYXRpb24gdGltZXN0
YW1wcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQxODA0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogc3VwYWJhc2Vfc3luY19ycGNfZHJhZnQuc3FsOiBhbGwgaGlzdG9yaWNhbCBzZXNz
aW9uIGNvbXBhcmlzb25zIGZhaWwgY2xvc2VkIGZvciBtaXNzaW5nIHNlc3Npb24gVVVJRApvayAz
NTQgLSBzdXBhYmFzZV9zeW5jX3JwY19kcmFmdC5zcWw6IGFsbCBoaXN0b3JpY2FsIHNlc3Npb24g
Y29tcGFyaXNvbnMgZmFpbCBjbG9zZWQgZm9yIG1pc3Npbmcgc2Vzc2lvbiBVVUlECiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDEuMjk3Mzc2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3Vw
YWJhc2Vfc3luY19zdGFnZTE0X3RyYW5zZmVyX2NhbmRpZGF0ZV9ET19OT1RfREVQTE9ZLnNxbDog
YWxsIGhpc3RvcmljYWwgc2Vzc2lvbiBjb21wYXJpc29ucyBmYWlsIGNsb3NlZCBmb3IgbWlzc2lu
ZyBzZXNzaW9uIFVVSUQKb2sgMzU1IC0gc3VwYWJhc2Vfc3luY19zdGFnZTE0X3RyYW5zZmVyX2Nh
bmRpZGF0ZV9ET19OT1RfREVQTE9ZLnNxbDogYWxsIGhpc3RvcmljYWwgc2Vzc2lvbiBjb21wYXJp
c29ucyBmYWlsIGNsb3NlZCBmb3IgbWlzc2luZyBzZXNzaW9uIFVVSUQKICAtLS0KICBkdXJhdGlv
bl9tczogMC4zNzY2MTcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBwZWVrIFJQQyBl
eGlzdHMgYW5kIHJlcXVpcmVzIGF1dGhlbnRpY2F0ZWQgY2FsbGVyCm9rIDM1NiAtIHBlZWsgUlBD
IGV4aXN0cyBhbmQgcmVxdWlyZXMgYXV0aGVudGljYXRlZCBjYWxsZXIKICAtLS0KICBkdXJhdGlv
bl9tczogMC42ODUzNTMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBwZWVrIHJlZnVz
ZXMgYmFubmVkLCBkZWxldGVkLCBvciBvbGRlciBzY29yZWtlZXBlciBsb2dpbgpvayAzNTcgLSBw
ZWVrIHJlZnVzZXMgYmFubmVkLCBkZWxldGVkLCBvciBvbGRlciBzY29yZWtlZXBlciBsb2dpbgog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjEzNzgwOAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IHBlZWsgcmV0dXJucyByZXZpc2lvbiB3aXRob3V0IGFueSBkYXRhIG11dGF0aW9uCm9rIDM1
OCAtIHBlZWsgcmV0dXJucyByZXZpc2lvbiB3aXRob3V0IGFueSBkYXRhIG11dGF0aW9uCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMzM5NjQyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
cGVlayBjYWxsYWJsZSBieSBhdXRoZW50aWNhdGVkIG9ubHkKb2sgMzU5IC0gcGVlayBjYWxsYWJs
ZSBieSBhdXRoZW50aWNhdGVkIG9ubHkKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMjUwMzgKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBkcmFmdCBmYWlscyBjbG9zZWQgYmVmb3JlIGJl
Z2lubmluZyBhbnkgc2NoZW1hIHRyYW5zYWN0aW9uCm9rIDM2MCAtIGRyYWZ0IGZhaWxzIGNsb3Nl
ZCBiZWZvcmUgYmVnaW5uaW5nIGFueSBzY2hlbWEgdHJhbnNhY3Rpb24KICAtLS0KICBkdXJhdGlv
bl9tczogMC44ODIyNwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpeCBSUEMgZW50
cnlwb2ludHMgYXJlIHByZXNlbnQgZXhhY3RseSBvbmNlCm9rIDM2MSAtIHNpeCBSUEMgZW50cnlw
b2ludHMgYXJlIHByZXNlbnQgZXhhY3RseSBvbmNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNTIx
OTc3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWxsIFJQQyBlbnRyeXBvaW50cyBl
eHBsaWNpdGx5IGNvbnN0cmFpbiBzZWFyY2hfcGF0aApvayAzNjIgLSBhbGwgUlBDIGVudHJ5cG9p
bnRzIGV4cGxpY2l0bHkgY29uc3RyYWluIHNlYXJjaF9wYXRoCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMzYyMjA2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWxsIHNpeCBSUENzIGV4
cGxpY2l0bHkgcmV2b2tlIGFub255bW91cyBhbmQgcHVibGljIGV4ZWN1dGlvbgpvayAzNjMgLSBh
bGwgc2l4IFJQQ3MgZXhwbGljaXRseSByZXZva2UgYW5vbnltb3VzIGFuZCBwdWJsaWMgZXhlY3V0
aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzI2OTAzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogd3JpdGVyIG9wZW4gYW5kIGNvbW1pdCBzZXJpYWxpemUgb24gbG9ja2VkIGFjY291
bnQgcm93Cm9rIDM2NCAtIHdyaXRlciBvcGVuIGFuZCBjb21taXQgc2VyaWFsaXplIG9uIGxvY2tl
ZCBhY2NvdW50IHJvdwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM0MDE4MwogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IHJlYWQtb25seSBwcmVmbGlnaHQgY2hlY2tzIGJsb2NraW5nIHNp
bmdsZS1kZXZpY2UgaW5kZXggd2l0aG91dCBtb2RpZnlpbmcgc2NoZW1hCm9rIDM2NSAtIHJlYWQt
b25seSBwcmVmbGlnaHQgY2hlY2tzIGJsb2NraW5nIHNpbmdsZS1kZXZpY2UgaW5kZXggd2l0aG91
dCBtb2RpZnlpbmcgc2NoZW1hCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuOTY0Mjg0CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcHJlZmxpZ2h0IGNoZWNrcyByZXF1aXJlZCBjdXJyZW50
LWdhbWUgdW5pcXVlbmVzcyBhbmQgc2Vzc2lvbiBsb29rdXAgaW5kZXhlcwpvayAzNjYgLSBwcmVm
bGlnaHQgY2hlY2tzIHJlcXVpcmVkIGN1cnJlbnQtZ2FtZSB1bmlxdWVuZXNzIGFuZCBzZXNzaW9u
IGxvb2t1cCBpbmRleGVzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNzE1NDU5CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogcHJlZmxpZ2h0IHJldHVybnMgaW5kZXggcmVzdWx0cyB3aXRo
IGV4aXN0aW5nIHRhYmxlIGNvbHVtbiBmdW5jdGlvbiBhbmQgUlBDIGRpYWdub3N0aWNzCm9rIDM2
NyAtIHByZWZsaWdodCByZXR1cm5zIGluZGV4IHJlc3VsdHMgd2l0aCBleGlzdGluZyB0YWJsZSBj
b2x1bW4gZnVuY3Rpb24gYW5kIFJQQyBkaWFnbm9zdGljcwogIC0tLQogIGR1cmF0aW9uX21zOiAw
LjE5NTkyNgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHByZWZsaWdodCBpcyByZWFk
LW9ubHkgYW5kIG5ldmVyIHJ1bnMgRERMIG9yIHdyaXRlcwpvayAzNjggLSBwcmVmbGlnaHQgaXMg
cmVhZC1vbmx5IGFuZCBuZXZlciBydW5zIERETCBvciB3cml0ZXMKICAtLS0KICBkdXJhdGlvbl9t
czogMC45Nzg3NTYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBwcmVmbGlnaHQgY2hl
Y2tzIGFsbCBmb3VyIHRhYmxlcywgUkxTLCBwcml2aWxlZ2VzLCBhbmQgcmVxdWlyZWQgY29sdW1u
cwpvayAzNjkgLSBwcmVmbGlnaHQgY2hlY2tzIGFsbCBmb3VyIHRhYmxlcywgUkxTLCBwcml2aWxl
Z2VzLCBhbmQgcmVxdWlyZWQgY29sdW1ucwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIyMzMyNwog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHByZWZsaWdodCByZWplY3RzIHdyb25nIGdh
bWUgaW4gUlBDIHJlc3BvbnNlIGV2ZW4gaWYgc2VydmVyIGVycm9uZW91c2x5IGFjY2VwdHMgdGFr
ZW92ZXIKb2sgMzcwIC0gcHJlZmxpZ2h0IHJlamVjdHMgd3JvbmcgZ2FtZSBpbiBSUEMgcmVzcG9u
c2UgZXZlbiBpZiBzZXJ2ZXIgZXJyb25lb3VzbHkgYWNjZXB0cyB0YWtlb3ZlcgogIC0tLQogIGR1
cmF0aW9uX21zOiAxLjg4MDc4NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHByZWZs
aWdodCByZWplY3RzIHdyb25nIHJldmlzaW9uIGluIFJQQyByZXNwb25zZSBldmVuIGlmIHNlcnZl
ciBlcnJvbmVvdXNseSBhY2NlcHRzIHRha2VvdmVyCm9rIDM3MSAtIHByZWZsaWdodCByZWplY3Rz
IHdyb25nIHJldmlzaW9uIGluIFJQQyByZXNwb25zZSBldmVuIGlmIHNlcnZlciBlcnJvbmVvdXNs
eSBhY2NlcHRzIHRha2VvdmVyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjEwNDA3CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcHVzaCBkcmFpbnMgZWRpdHMgYXJyaXZpbmcgZHVyaW5n
IHR3byBzdWNjZXNzaXZlIG5ldHdvcmsgY29tbWl0cwpvayAzNzIgLSBwdXNoIGRyYWlucyBlZGl0
cyBhcnJpdmluZyBkdXJpbmcgdHdvIHN1Y2Nlc3NpdmUgbmV0d29yayBjb21taXRzCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDYuMjI3NTk4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVh
ZCBSUEMgaXMgcmVzdHJpY3RlZCB0byB0aGUgZXhhY3QgYWN0aXZlIGF1dGggc2Vzc2lvbiBhbmQg
ZGV2aWNlCm9rIDM3MyAtIHJlYWQgUlBDIGlzIHJlc3RyaWN0ZWQgdG8gdGhlIGV4YWN0IGFjdGl2
ZSBhdXRoIHNlc3Npb24gYW5kIGRldmljZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjc2NzAyNwog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlYWQgUlBDIHJlamVjdHMgaW5hY3RpdmUg
YW5kIHN1cGVyc2VkZWQgc2NvcmVrZWVwZXIgYWNjb3VudHMKb2sgMzc0IC0gcmVhZCBSUEMgcmVq
ZWN0cyBpbmFjdGl2ZSBhbmQgc3VwZXJzZWRlZCBzY29yZWtlZXBlciBhY2NvdW50cwogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjIwMjg3NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJl
YWQgUlBDIG5ldmVyIGdyYW50cyBhIHdyaXRlciBsZWFzZSBvciBtdXRhdGVzIGNsb3VkIHN0YXRl
Cm9rIDM3NSAtIHJlYWQgUlBDIG5ldmVyIGdyYW50cyBhIHdyaXRlciBsZWFzZSBvciBtdXRhdGVz
IGNsb3VkIHN0YXRlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMzEyNjMyCiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogY2xvdWQgcmVhZCBvbmx5IHJlcG9ydHMgd3JpdGVyIGNhcGFiaWxp
dHkgZm9yIGEgdG9rZW4tYmFja2VkIHdyaXRlciBsZWFzZQpvayAzNzYgLSBjbG91ZCByZWFkIG9u
bHkgcmVwb3J0cyB3cml0ZXIgY2FwYWJpbGl0eSBmb3IgYSB0b2tlbi1iYWNrZWQgd3JpdGVyIGxl
YXNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODc3OTQ0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogY2xvdWQgcmVhZCByZXF1aXJlcyBjdXJyZW50IGFjdGl2ZSBub25yZXZva2VkIGF1
dGgtYm91bmQgbGVhc2UKb2sgMzc3IC0gY2xvdWQgcmVhZCByZXF1aXJlcyBjdXJyZW50IGFjdGl2
ZSBub25yZXZva2VkIGF1dGgtYm91bmQgbGVhc2UKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMzk0
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZGVyIGVucm9sbG1lbnQgY2Fubm90
IGdyYW50IHdyaXRlciByaWdodHMgb3Igd3JpdGVyIHRva2VuCm9rIDM3OCAtIHJlYWRlciBlbnJv
bGxtZW50IGNhbm5vdCBncmFudCB3cml0ZXIgcmlnaHRzIG9yIHdyaXRlciB0b2tlbgogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjg2NDkwNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJl
YWRlciBlbnJvbGxtZW50IGlzIHJlc3RyaWN0ZWQgdG8gYWRtaW4gb3IgZW5hYmxlZCBtdWx0aS1k
ZXZpY2UgYWNjb3VudHMKb2sgMzc5IC0gcmVhZGVyIGVucm9sbG1lbnQgaXMgcmVzdHJpY3RlZCB0
byBhZG1pbiBvciBlbmFibGVkIG11bHRpLWRldmljZSBhY2NvdW50cwogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjE2MTk0NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFkYXB0ZXIgdXNl
cyBzZXBhcmF0ZSByZWFkZXIgUlBDLCBuZXZlciB3cml0ZXIgdGFrZW92ZXIKb2sgMzgwIC0gYWRh
cHRlciB1c2VzIHNlcGFyYXRlIHJlYWRlciBSUEMsIG5ldmVyIHdyaXRlciB0YWtlb3ZlcgogIC0t
LQogIGR1cmF0aW9uX21zOiAwLjg4NzQ1OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6
IHJlYWQgcmVqZWN0cyBleGlzdGluZyByZWFkZXIgbGVhc2Ugd2hlbiBtdWx0aS1kZXZpY2UgcGVy
bWlzc2lvbiBpcyByZXZva2VkCm9rIDM4MSAtIHJlYWQgcmVqZWN0cyBleGlzdGluZyByZWFkZXIg
bGVhc2Ugd2hlbiBtdWx0aS1kZXZpY2UgcGVybWlzc2lvbiBpcyByZXZva2VkCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDEuNDkzMjAxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogd3JpdGVy
IHJlbWFpbnMgZWxpZ2libGUgZm9yIHJlYWQgYWZ0ZXIgbXVsdGktZGV2aWNlIHBlcm1pc3Npb24g
aXMgZGlzYWJsZWQKb2sgMzgyIC0gd3JpdGVyIHJlbWFpbnMgZWxpZ2libGUgZm9yIHJlYWQgYWZ0
ZXIgbXVsdGktZGV2aWNlIHBlcm1pc3Npb24gaXMgZGlzYWJsZWQKICAtLS0KICBkdXJhdGlvbl9t
czogMC4xMzM5NzIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBwZWVrIGVuZm9yY2Vz
IEpXVC1ib3VuZCBhY3RpdmUgc2Vzc2lvbiBhbmQgYWNjb3VudCBzdGF0dXMKb2sgMzgzIC0gcGVl
ayBlbmZvcmNlcyBKV1QtYm91bmQgYWN0aXZlIHNlc3Npb24gYW5kIGFjY291bnQgc3RhdHVzCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuNzc1MDk4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogcGVlayBvbmx5IHNlbGVjdHMgZ2FtZSBzdGF0ZSBhbmQgbmV2ZXIgd3JpdGVzL3Jldm9rZXMg
bGVhc2VzCm9rIDM4NCAtIHBlZWsgb25seSBzZWxlY3RzIGdhbWUgc3RhdGUgYW5kIG5ldmVyIHdy
aXRlcy9yZXZva2VzIGxlYXNlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI3NDU3NAogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHBlZWsgbGltaXRzIFJQQyBleGVjdXRpb24gdG8gYXV0
aGVudGljYXRlZCB1c2VycwpvayAzODUgLSBwZWVrIGxpbWl0cyBSUEMgZXhlY3V0aW9uIHRvIGF1
dGhlbnRpY2F0ZWQgdXNlcnMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNzk4MTEKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhZGFwdGVyIGV4cG9zZXMgcmVhZC1vbmx5IHBlZWsgd2l0
aG91dCB3cml0ZXIgdG9rZW4Kb2sgMzg2IC0gYWRhcHRlciBleHBvc2VzIHJlYWQtb25seSBwZWVr
IHdpdGhvdXQgd3JpdGVyIHRva2VuCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNjcxMDkxCiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2luZ2xlLWRldmljZSBzY29yZWtlZXBlciBvbGQg
bG9naW4gY2Fubm90IHBlZWsgYWN0aXZlIGdhbWUKb2sgMzg3IC0gc2luZ2xlLWRldmljZSBzY29y
ZWtlZXBlciBvbGQgbG9naW4gY2Fubm90IHBlZWsgYWN0aXZlIGdhbWUKICAtLS0KICBkdXJhdGlv
bl9tczogMC4xMTk4MjEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFsIHJlY29y
ZGVkIGhhbmQgZmllbGRzIGluIGFwcCBhcmUgcHJlc2VydmVkIGJ5IHN5bmMgdmFsaWRhdGlvbgpv
ayAzODggLSByZWFsIHJlY29yZGVkIGhhbmQgZmllbGRzIGluIGFwcCBhcmUgcHJlc2VydmVkIGJ5
IHN5bmMgdmFsaWRhdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiA1LjIzODkyOAogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlY29yZCByZXN0b3JlcyBzY29yZSBhbmQgZnVsbCBoaXN0
b3J5IGlmIGR1cmFibGUgc2F2ZSBvciBzeW5jIGVucXVldWUgZmFpbHMKb2sgMzg5IC0gcmVjb3Jk
IHJlc3RvcmVzIHNjb3JlIGFuZCBmdWxsIGhpc3RvcnkgaWYgZHVyYWJsZSBzYXZlIG9yIHN5bmMg
ZW5xdWV1ZSBmYWlscwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjk5Mzk1OAogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IG1haGpvbmdfc3luY19vcGVuOiByZXN0cmljdGVkIFNFQ1VSSVRZ
IERFRklORVIgYW5kIGF1dGhlbnRpY2F0ZWQtb25seSBFWEVDVVRFCm9rIDM5MCAtIG1haGpvbmdf
c3luY19vcGVuOiByZXN0cmljdGVkIFNFQ1VSSVRZIERFRklORVIgYW5kIGF1dGhlbnRpY2F0ZWQt
b25seSBFWEVDVVRFCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNzk5NDI1CiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogbWFoam9uZ19zeW5jX2NvbW1pdDogcmVzdHJpY3RlZCBTRUNVUklU
WSBERUZJTkVSIGFuZCBhdXRoZW50aWNhdGVkLW9ubHkgRVhFQ1VURQpvayAzOTEgLSBtYWhqb25n
X3N5bmNfY29tbWl0OiByZXN0cmljdGVkIFNFQ1VSSVRZIERFRklORVIgYW5kIGF1dGhlbnRpY2F0
ZWQtb25seSBFWEVDVVRFCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTY1MTU5CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogbWFoam9uZ19zeW5jX29wZW5fcmVhZGVyOiByZXN0cmljdGVk
IFNFQ1VSSVRZIERFRklORVIgYW5kIGF1dGhlbnRpY2F0ZWQtb25seSBFWEVDVVRFCm9rIDM5MiAt
IG1haGpvbmdfc3luY19vcGVuX3JlYWRlcjogcmVzdHJpY3RlZCBTRUNVUklUWSBERUZJTkVSIGFu
ZCBhdXRoZW50aWNhdGVkLW9ubHkgRVhFQ1VURQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjA4Nzk2
MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG1haGpvbmdfc3luY19wZWVrOiByZXN0
cmljdGVkIFNFQ1VSSVRZIERFRklORVIgYW5kIGF1dGhlbnRpY2F0ZWQtb25seSBFWEVDVVRFCm9r
IDM5MyAtIG1haGpvbmdfc3luY19wZWVrOiByZXN0cmljdGVkIFNFQ1VSSVRZIERFRklORVIgYW5k
IGF1dGhlbnRpY2F0ZWQtb25seSBFWEVDVVRFCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMDg2ODAx
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbWFoam9uZ19zeW5jX3JlYWQ6IHJlc3Ry
aWN0ZWQgU0VDVVJJVFkgREVGSU5FUiBhbmQgYXV0aGVudGljYXRlZC1vbmx5IEVYRUNVVEUKb2sg
Mzk0IC0gbWFoam9uZ19zeW5jX3JlYWQ6IHJlc3RyaWN0ZWQgU0VDVVJJVFkgREVGSU5FUiBhbmQg
YXV0aGVudGljYXRlZC1vbmx5IEVYRUNVVEUKICAtLS0KICBkdXJhdGlvbl9tczogMC4wOTg4MzkK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBtYWhqb25nX3N5bmNfbGVhc2Vfc3RhdHVz
OiByZXN0cmljdGVkIFNFQ1VSSVRZIERFRklORVIgYW5kIGF1dGhlbnRpY2F0ZWQtb25seSBFWEVD
VVRFCm9rIDM5NSAtIG1haGpvbmdfc3luY19sZWFzZV9zdGF0dXM6IHJlc3RyaWN0ZWQgU0VDVVJJ
VFkgREVGSU5FUiBhbmQgYXV0aGVudGljYXRlZC1vbmx5IEVYRUNVVEUKICAtLS0KICBkdXJhdGlv
bl9tczogMC4wNjg3OTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBkcmFmdCBzdGF5
cyBibG9ja2VkIGZyb20gcHJvZHVjdGlvbiBleGVjdXRpb24Kb2sgMzk2IC0gZHJhZnQgc3RheXMg
YmxvY2tlZCBmcm9tIHByb2R1Y3Rpb24gZXhlY3V0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MTgxMDgzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWxsIHNpeCBSUEMgZW50cnlw
b2ludHMgYXJlIGV4cGxpY2l0bHkgYXV0aGVudGljYXRlZC1vbmx5LCBub3QgYW5vbiBvciBQVUJM
SUMKb2sgMzk3IC0gYWxsIHNpeCBSUEMgZW50cnlwb2ludHMgYXJlIGV4cGxpY2l0bHkgYXV0aGVu
dGljYXRlZC1vbmx5LCBub3QgYW5vbiBvciBQVUJMSUMKICAtLS0KICBkdXJhdGlvbl9tczogMS41
MzUwNzQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBhbGwgc2l4IFJQQ3MgYmluZCBp
ZGVudGl0eSB0byB2ZXJpZmllZCBTdXBhYmFzZSBBdXRoIHNlc3Npb24Kb2sgMzk4IC0gYWxsIHNp
eCBSUENzIGJpbmQgaWRlbnRpdHkgdG8gdmVyaWZpZWQgU3VwYWJhc2UgQXV0aCBzZXNzaW9uCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMzQ2NDkzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogYWxsIHNpeCBSUENzIHBpbiBTRUNVUklUWSBERUZJTkVSIHNlYXJjaCBwYXRoCm9rIDM5OSAt
IGFsbCBzaXggUlBDcyBwaW4gU0VDVVJJVFkgREVGSU5FUiBzZWFyY2ggcGF0aAogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjIxOTI3MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFJQQyBk
cmFmdCBhbmQgc2NoZW1hIGFsaWdubWVudCBuZXZlciBhdXRvLXByb21vdGUgbGVnYWN5IGdhbWVz
Cm9rIDQwMCAtIFJQQyBkcmFmdCBhbmQgc2NoZW1hIGFsaWdubWVudCBuZXZlciBhdXRvLXByb21v
dGUgbGVnYWN5IGdhbWVzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMTE1NjMyCiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogbmV3IGNsb3VkIGdhbWUgaXMgZXhwbGljaXRseSBjdXJyZW50
IGF0IGZpcnN0IGJvb3RzdHJhcApvayA0MDEgLSBuZXcgY2xvdWQgZ2FtZSBpcyBleHBsaWNpdGx5
IGN1cnJlbnQgYXQgZmlyc3QgYm9vdHN0cmFwCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTk4NTk5
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY3VycmVudCBnYW1lIGJvb3RzdHJhcCBy
ZW1haW5zIHByb3RlY3RlZCBieSBwcmVmbGlnaHQgYW5kIGZhaWwtY2xvc2VkIGd1YXJkCm9rIDQw
MiAtIGN1cnJlbnQgZ2FtZSBib290c3RyYXAgcmVtYWlucyBwcm90ZWN0ZWQgYnkgcHJlZmxpZ2h0
IGFuZCBmYWlsLWNsb3NlZCBndWFyZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQ5NjM0OAogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpeC1SUEMgZHJhZnQgZG9lcyBub3QgY3JlYXRl
IHJlZHVuZGFudCBjdXJyZW50LWdhbWUgdW5pcXVlIGluZGV4Cm9rIDQwMyAtIHNpeC1SUEMgZHJh
ZnQgZG9lcyBub3QgY3JlYXRlIHJlZHVuZGFudCBjdXJyZW50LWdhbWUgdW5pcXVlIGluZGV4CiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuOTk1MDIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBvcGVuIFJQQyBleHBsaWNpdGx5IGRlbmllcyBOVUxMIGFjY291bnQgcm9sZXMKb2sgNDA0IC0g
b3BlbiBSUEMgZXhwbGljaXRseSBkZW5pZXMgTlVMTCBhY2NvdW50IHJvbGVzCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMjA5NjQ2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogZHJhZnQg
YW5kIHJldmlldyByZW1haW4gZmFpbC1jbG9zZWQgYWdhaW5zdCBhY2NpZGVudGFsIGRlcGxveW1l
bnQKb2sgNDA1IC0gZHJhZnQgYW5kIHJldmlldyByZW1haW4gZmFpbC1jbG9zZWQgYWdhaW5zdCBh
Y2NpZGVudGFsIGRlcGxveW1lbnQKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNDQ1OTkKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzZXJ2ZXIgUlBDIGhhcyBleHBsaWNpdCBhY2NvdW50
IGxvY2sgYW5kIHJldmlzaW9uIGxvY2sKb2sgNDA2IC0gc2VydmVyIFJQQyBoYXMgZXhwbGljaXQg
YWNjb3VudCBsb2NrIGFuZCByZXZpc2lvbiBsb2NrCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMDEx
MjM1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2VydmVyIFJQQyBkb2VzIG5vdCBv
dmVyd3JpdGUgY2xvdWQgb24gcmVqZWN0ZWQgY29tbWl0Cm9rIDQwNyAtIHNlcnZlciBSUEMgZG9l
cyBub3Qgb3ZlcndyaXRlIGNsb3VkIG9uIHJlamVjdGVkIGNvbW1pdAogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjIzOTQwMQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNlcnZlciBmdW5j
dGlvbnMgYXJlIGF1dGgtYm91bmQgYW5kIG5vIHNlcnZpY2Ugcm9sZSBjcmVkZW50aWFscyBpbiBi
cm93c2VyCm9rIDQwOCAtIHNlcnZlciBmdW5jdGlvbnMgYXJlIGF1dGgtYm91bmQgYW5kIG5vIHNl
cnZpY2Ugcm9sZSBjcmVkZW50aWFscyBpbiBicm93c2VyCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
NDY2NjI0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY2xvdWQgYWRvcHRpb24gaXMg
Z3VhcmRlZCBieSBleHBlY3RlZCByZXZpc2lvbiBiZWZvcmUgd3JpdGVyIHJldm9jYXRpb24Kb2sg
NDA5IC0gY2xvdWQgYWRvcHRpb24gaXMgZ3VhcmRlZCBieSBleHBlY3RlZCByZXZpc2lvbiBiZWZv
cmUgd3JpdGVyIHJldm9jYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4yMDg5NzUKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdXBwbGllZCBwcmVmbGlnaHQgZ2FtZSBpZGVudGl0
eSBpcyBjaGVja2VkIGZvciBib3RoIGxvY2FsIGFuZCBjbG91ZCBhZG9wdGlvbiBiZWZvcmUgcmV2
b2tpbmcgd3JpdGVyCm9rIDQxMCAtIHN1cHBsaWVkIHByZWZsaWdodCBnYW1lIGlkZW50aXR5IGlz
IGNoZWNrZWQgZm9yIGJvdGggbG9jYWwgYW5kIGNsb3VkIGFkb3B0aW9uIGJlZm9yZSByZXZva2lu
ZyB3cml0ZXIKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMTE0MjkKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBvcGVuIHJlamVjdHMgTmFOIHNjb3JlIGJlZm9yZSBSUEMgcmF0aGVyIHRo
YW4gc2lsZW50bHkgY29udmVydGluZyBpdCB0byBudWxsCm9rIDQxMSAtIG9wZW4gcmVqZWN0cyBO
YU4gc2NvcmUgYmVmb3JlIFJQQyByYXRoZXIgdGhhbiBzaWxlbnRseSBjb252ZXJ0aW5nIGl0IHRv
IG51bGwKICAtLS0KICBkdXJhdGlvbl9tczogMS43NTA3MwogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IGNvbW1pdCByZWplY3RzIG5lc3RlZCBJbmZpbml0eSBpbiBoaXN0b3J5IGJlZm9y
ZSBSUEMKb2sgNDEyIC0gY29tbWl0IHJlamVjdHMgbmVzdGVkIEluZmluaXR5IGluIGhpc3Rvcnkg
YmVmb3JlIFJQQwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQzODc3MgogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IGZpbml0ZSBuZWdhdGl2ZSBhbmQgZnJhY3Rpb25hbCBudW1iZXJzIHJl
dGFpbiBKU09OIHZhbHVlcyBpbiBzbmFwc2hvdApvayA0MTMgLSBmaW5pdGUgbmVnYXRpdmUgYW5k
IGZyYWN0aW9uYWwgbnVtYmVycyByZXRhaW4gSlNPTiB2YWx1ZXMgaW4gc25hcHNob3QKICAtLS0K
ICBkdXJhdGlvbl9tczogMS4wMzAxMDIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBv
cGVuIHJlamVjdHMgb3ZlcnNpemVkIEFTQ0lJIGdhbWUgYmVmb3JlIG5ldHdvcmsgUlBDCm9rIDQx
NCAtIG9wZW4gcmVqZWN0cyBvdmVyc2l6ZWQgQVNDSUkgZ2FtZSBiZWZvcmUgbmV0d29yayBSUEMK
ICAtLS0KICBkdXJhdGlvbl9tczogMjMuNjQ3Mzk2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogY29tbWl0IHJlamVjdHMgb3ZlcnNpemVkIG11bHRpYnl0ZSBVVEYtOCBnYW1lIGJlZm9y
ZSBuZXR3b3JrIFJQQwpvayA0MTUgLSBjb21taXQgcmVqZWN0cyBvdmVyc2l6ZWQgbXVsdGlieXRl
IFVURi04IGdhbWUgYmVmb3JlIG5ldHdvcmsgUlBDCiAgLS0tCiAgZHVyYXRpb25fbXM6IDExLjg2
MzA0MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG9wZW4gYWNjZXB0cyBhIHNtYWxs
IGdhbWUgYW5kIHBhc3NlcyB0aGUgc25hcHNob3QgdG8gUlBDCm9rIDQxNiAtIG9wZW4gYWNjZXB0
cyBhIHNtYWxsIGdhbWUgYW5kIHBhc3NlcyB0aGUgc25hcHNob3QgdG8gUlBDCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMzA5MDA1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb3BlbiBj
aGVja3MgY2xvdWQgaWRlbnRpdHkgYW5kIHJldmlzaW9uIGJlZm9yZSByZXR1cm5pbmcgbG9jYWwg
bWlzbWF0Y2ggc25hcHNob3QKb2sgNDE3IC0gb3BlbiBjaGVja3MgY2xvdWQgaWRlbnRpdHkgYW5k
IHJldmlzaW9uIGJlZm9yZSByZXR1cm5pbmcgbG9jYWwgbWlzbWF0Y2ggc25hcHNob3QKICAtLS0K
ICBkdXJhdGlvbl9tczogMC45Njc3NTkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBz
dGFsZSByZXZpc2lvbiByZXNwb25zZSBjb250YWlucyBtZXRhZGF0YSBidXQgbm8gY2xvdWQgZ2Ft
ZSBzbmFwc2hvdApvayA0MTggLSBzdGFsZSByZXZpc2lvbiByZXNwb25zZSBjb250YWlucyBtZXRh
ZGF0YSBidXQgbm8gY2xvdWQgZ2FtZSBzbmFwc2hvdAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM0
NzAzMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFsbCBwcmVmbGlnaHQgcmVqZWN0
aW9uIGNoZWNrcyByZW1haW4gYmVmb3JlIHdyaXRlciBsZWFzZSByZXZvY2F0aW9uCm9rIDQxOSAt
IGFsbCBwcmVmbGlnaHQgcmVqZWN0aW9uIGNoZWNrcyByZW1haW4gYmVmb3JlIHdyaXRlciBsZWFz
ZSByZXZvY2F0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTczMDIxCiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogb3BlbiByZWplY3RzIGEgcmV2aXNpb24gd2l0aG91dCBjbG91ZCBn
YW1lIElEIGJlZm9yZSBpbnZva2luZyBSUEMKb2sgNDIwIC0gb3BlbiByZWplY3RzIGEgcmV2aXNp
b24gd2l0aG91dCBjbG91ZCBnYW1lIElEIGJlZm9yZSBpbnZva2luZyBSUEMKICAtLS0KICBkdXJh
dGlvbl9tczogMS40NDgxNTMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBvcGVuIHJl
amVjdHMgYSBjbG91ZCBnYW1lIElEIHdpdGhvdXQgcmV2aXNpb24gYmVmb3JlIGludm9raW5nIFJQ
QwpvayA0MjEgLSBvcGVuIHJlamVjdHMgYSBjbG91ZCBnYW1lIElEIHdpdGhvdXQgcmV2aXNpb24g
YmVmb3JlIGludm9raW5nIFJQQwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIxNzk1OQogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG9wZW4gcGFzc2VzIG1hdGNoaW5nIGNsb3VkIHByZWZs
aWdodCBJRCBhbmQgcmV2aXNpb24gdW5jaGFuZ2VkCm9rIDQyMiAtIG9wZW4gcGFzc2VzIG1hdGNo
aW5nIGNsb3VkIHByZWZsaWdodCBJRCBhbmQgcmV2aXNpb24gdW5jaGFuZ2VkCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMzA4NDM1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0
cyBSUEMgb2JqZWN0IG1pc3Npbmcgb2sgZmxhZyBpbnN0ZWFkIG9mIHRyZWF0aW5nIGl0IGFzIGEg
dmFsaWQgcmVzdWx0Cm9rIDQyMyAtIHJlamVjdHMgUlBDIG9iamVjdCBtaXNzaW5nIG9rIGZsYWcg
aW5zdGVhZCBvZiB0cmVhdGluZyBpdCBhcyBhIHZhbGlkIHJlc3VsdAogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjk4MDU2OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlamVjdHMgUlBD
IG9rIGZsYWcgZW5jb2RlZCBhcyBzdHJpbmcgaW5zdGVhZCBvZiBib29sZWFuCm9rIDQyNCAtIHJl
amVjdHMgUlBDIG9rIGZsYWcgZW5jb2RlZCBhcyBzdHJpbmcgaW5zdGVhZCBvZiBib29sZWFuCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMzY0MTQ4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogcHJlc2VydmVzIGV4cGxpY2l0IFJQQyByZWplY3Rpb24gd2l0aCBib29sZWFuIG9rIGZhbHNl
Cm9rIDQyNSAtIHByZXNlcnZlcyBleHBsaWNpdCBSUEMgcmVqZWN0aW9uIHdpdGggYm9vbGVhbiBv
ayBmYWxzZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjMyMjUzNgogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IHJldmlldyBjYW5kaWRhdGUgaXMgZmFpbC1jbG9zZWQgYmVmb3JlIGFueSBz
Y2hlbWEgbXV0YXRpb24Kb2sgNDI2IC0gcmV2aWV3IGNhbmRpZGF0ZSBpcyBmYWlsLWNsb3NlZCBi
ZWZvcmUgYW55IHNjaGVtYSBtdXRhdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjY0MjI3OAog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGluY29tcGF0aWJsZSByZXZpZXcgb3BlbiBz
aWduYXR1cmUgY2Fubm90IGJlIG1pc3Rha2VuIGZvciBkZXBsb3lhYmxlIGFkYXB0ZXIgY29udHJh
Y3QKb2sgNDI3IC0gaW5jb21wYXRpYmxlIHJldmlldyBvcGVuIHNpZ25hdHVyZSBjYW5ub3QgYmUg
bWlzdGFrZW4gZm9yIGRlcGxveWFibGUgYWRhcHRlciBjb250cmFjdAogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjI2MTQ1NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJldmlldyBsYWNr
cyBkcmFmdCBwcmVmbGlnaHQgYW5kIGhpZ2gtd2F0ZXIgZ3VhcmRzIGFuZCBtdXN0IHJlbWFpbiBi
bG9ja2VkCm9rIDQyOCAtIHJldmlldyBsYWNrcyBkcmFmdCBwcmVmbGlnaHQgYW5kIGhpZ2gtd2F0
ZXIgZ3VhcmRzIGFuZCBtdXN0IHJlbWFpbiBibG9ja2VkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MTI4MjkzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmV2aWV3IFJQQyBvcGVuIGV4
cGxpY2l0bHkgcmVqZWN0cyBOVUxMIHJvbGUKb2sgNDI5IC0gcmV2aWV3IFJQQyBvcGVuIGV4cGxp
Y2l0bHkgcmVqZWN0cyBOVUxMIHJvbGUKICAtLS0KICBkdXJhdGlvbl9tczogMC44Njk0NQogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJldmlldyBSUEMgZG9lcyBub3QgcmVjcmVhdGUg
ZHVwbGljYXRlIGN1cnJlbnQtZ2FtZSBpbmRleApvayA0MzAgLSByZXZpZXcgUlBDIGRvZXMgbm90
IHJlY3JlYXRlIGR1cGxpY2F0ZSBjdXJyZW50LWdhbWUgaW5kZXgKICAtLS0KICBkdXJhdGlvbl9t
czogMC4yNjYwMjEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZXZpZXcgUlBDIHJl
bWFpbnMgYXV0aGVudGljYXRlZC1vbmx5IGFuZCB1c2VzIHNlc3Npb24tYm91bmQgbGVhc2UKb2sg
NDMxIC0gcmV2aWV3IFJQQyByZW1haW5zIGF1dGhlbnRpY2F0ZWQtb25seSBhbmQgdXNlcyBzZXNz
aW9uLWJvdW5kIGxlYXNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTIyOTI2CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogZHJhZnQgUlBDIHJlbWFpbnMgZXhwbGljaXRseSBmYWlsLWNs
b3NlZCBmb3IgcHJvZHVjdGlvbgpvayA0MzIgLSBkcmFmdCBSUEMgcmVtYWlucyBleHBsaWNpdGx5
IGZhaWwtY2xvc2VkIGZvciBwcm9kdWN0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODQ2MTA1
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogd3JpdGVyIGNvbW1pdCBiaW5kcyBKV1Qg
QXV0aCBzZXNzaW9uLCBkZXZpY2UsIGdlbmVyYXRpb24gYW5kIHRva2VuIGhhc2gKb2sgNDMzIC0g
d3JpdGVyIGNvbW1pdCBiaW5kcyBKV1QgQXV0aCBzZXNzaW9uLCBkZXZpY2UsIGdlbmVyYXRpb24g
YW5kIHRva2VuIGhhc2gKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMzA4NDgKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiBSUEMgZGVmaW5lciBmdW5jdGlvbnMgcGluIHNlYXJjaF9wYXRo
IGFuZCByZXN0cmljdCBhbm9ueW1vdXMgZXhlY3V0aW9uCm9rIDQzNCAtIFJQQyBkZWZpbmVyIGZ1
bmN0aW9ucyBwaW4gc2VhcmNoX3BhdGggYW5kIHJlc3RyaWN0IGFub255bW91cyBleGVjdXRpb24K
ICAtLS0KICBkdXJhdGlvbl9tczogMC40NTg3MzEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBhbGwgc2l4IGNsaWVudCBSUEMgbmFtZXMgYW5kIFNRTCBmdW5jdGlvbiBwYXJhbWV0ZXIg
bmFtZXMgYWdyZWUKb2sgNDM1IC0gYWxsIHNpeCBjbGllbnQgUlBDIG5hbWVzIGFuZCBTUUwgZnVu
Y3Rpb24gcGFyYW1ldGVyIG5hbWVzIGFncmVlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuNDk1MjY0
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWxsIHNpeCBSUEMgc2lnbmF0dXJlcyBn
cmFudCBleGVjdXRlIG9ubHkgdG8gYXV0aGVudGljYXRlZCBpbiBkcmFmdApvayA0MzYgLSBhbGwg
c2l4IFJQQyBzaWduYXR1cmVzIGdyYW50IGV4ZWN1dGUgb25seSB0byBhdXRoZW50aWNhdGVkIGlu
IGRyYWZ0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTg2MzYxCiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogdW52ZXJpZmllZCBmb3VyLXBhcmFtZXRlciBSUEMgZHJhZnQgcmVtYWlucyBm
YWlsLWNsb3NlZCBiZWZvcmUgU1FMIHRyYW5zYWN0aW9uCm9rIDQzNyAtIHVudmVyaWZpZWQgZm91
ci1wYXJhbWV0ZXIgUlBDIGRyYWZ0IHJlbWFpbnMgZmFpbC1jbG9zZWQgYmVmb3JlIFNRTCB0cmFu
c2FjdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE2NzE2MgogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IHdyaXRlciB0YWtlb3ZlciBjaGVja3MgY2xvdWQgcHJlZmxpZ2h0IGJlZm9y
ZSByZXZva2luZyBvbGQgd3JpdGVyCm9rIDQzOCAtIHdyaXRlciB0YWtlb3ZlciBjaGVja3MgY2xv
dWQgcHJlZmxpZ2h0IGJlZm9yZSByZXZva2luZyBvbGQgd3JpdGVyCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDEuMTIwOTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjb21taXQgc2VyaWFs
aXplcyBvbiBhY2NvdW50IGFuZCBnYW1lIGJlZm9yZSBhY2NlcHRpbmcgd3JpdGVyIGxlYXNlCm9r
IDQzOSAtIGNvbW1pdCBzZXJpYWxpemVzIG9uIGFjY291bnQgYW5kIGdhbWUgYmVmb3JlIGFjY2Vw
dGluZyB3cml0ZXIgbGVhc2UKICAtLS0KICBkdXJhdGlvbl9tczogMC4yODc5NDQKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzdWNjZXNzZnVsIGxvY2FsIHNhdmUgcmVmcmVzaGVzIHNh
dmVkLXN0YXRlIG1hcmtlciBhZnRlciBkdXJhYmxlIGNsb3VkIGVucXVldWUKb2sgNDQwIC0gc3Vj
Y2Vzc2Z1bCBsb2NhbCBzYXZlIHJlZnJlc2hlcyBzYXZlZC1zdGF0ZSBtYXJrZXIgYWZ0ZXIgZHVy
YWJsZSBjbG91ZCBlbnF1ZXVlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODQ0OTkzCiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogZmFpbGVkIGxvY2FsIHNhdmUgb3IgcXVldWUgZmFpbHVy
ZSBjYW5ub3QgcmVmcmVzaCBzYXZlZC1zdGF0ZSBtYXJrZXIKb2sgNDQxIC0gZmFpbGVkIGxvY2Fs
IHNhdmUgb3IgcXVldWUgZmFpbHVyZSBjYW5ub3QgcmVmcmVzaCBzYXZlZC1zdGF0ZSBtYXJrZXIK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4xODA2NjIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBhbGlnbm1lbnQgY2FuZGlkYXRlIHJlbWFpbnMgdW5jb25kaXRpb25hbGx5IGJsb2NrZWQg
YmVmb3JlIGFueSBEREwKb2sgNDQyIC0gYWxpZ25tZW50IGNhbmRpZGF0ZSByZW1haW5zIHVuY29u
ZGl0aW9uYWxseSBibG9ja2VkIGJlZm9yZSBhbnkgRERMCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEu
MDAzMjgzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY2FuZGlkYXRlIGFkZHMgcmVx
dWlyZWQgd3JpdGVyIGFuZCBBdXRoIGJpbmRpbmcgY29sdW1ucyB3aXRob3V0IGNsZWFyaW5nIGV4
aXN0aW5nIHNlc3Npb25zCm9rIDQ0MyAtIGNhbmRpZGF0ZSBhZGRzIHJlcXVpcmVkIHdyaXRlciBh
bmQgQXV0aCBiaW5kaW5nIGNvbHVtbnMgd2l0aG91dCBjbGVhcmluZyBleGlzdGluZyBzZXNzaW9u
cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjQ2NDg1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogY2FuZGlkYXRlIHByZXZlbnRzIGFjY2lkZW50YWwgY3VycmVudC1nYW1lIHByb21vdGlv
biBhbmQgY2hlY2tzIGR1cGxpY2F0ZXMgYmVmb3JlIGluZGV4Cm9rIDQ0NCAtIGNhbmRpZGF0ZSBw
cmV2ZW50cyBhY2NpZGVudGFsIGN1cnJlbnQtZ2FtZSBwcm9tb3Rpb24gYW5kIGNoZWNrcyBkdXBs
aWNhdGVzIGJlZm9yZSBpbmRleAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjU1MTEyMQogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGhpc3RvcmljYWwgbXVsdGktZ2FtZSBvd25lcnMgYXJl
IG5vdCByZWplY3RlZCBtZXJlbHkgZm9yIGhhdmluZyBhcmNoaXZlcwpvayA0NDUgLSBoaXN0b3Jp
Y2FsIG11bHRpLWdhbWUgb3duZXJzIGFyZSBub3QgcmVqZWN0ZWQgbWVyZWx5IGZvciBoYXZpbmcg
YXJjaGl2ZXMKICAtLS0KICBkdXJhdGlvbl9tczogMS4xODkwMDIKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBjdXJyZW50IGZsYWcgZXhpc3RzIGJlZm9yZSBjdXJyZW50LW9ubHkgZHVw
bGljYXRlIGNoZWNrIGFuZCBpcyBub3QgYXV0by1wcm9tb3RlZApvayA0NDYgLSBjdXJyZW50IGZs
YWcgZXhpc3RzIGJlZm9yZSBjdXJyZW50LW9ubHkgZHVwbGljYXRlIGNoZWNrIGFuZCBpcyBub3Qg
YXV0by1wcm9tb3RlZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI3NTQwNQogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IGFyY2hpdmUtZnJpZW5kbHkgY2FuZGlkYXRlIHJlbWFpbnMgYmxv
Y2tlZCBhbmQgbm9uLWRlc3RydWN0aXZlCm9rIDQ0NyAtIGFyY2hpdmUtZnJpZW5kbHkgY2FuZGlk
YXRlIHJlbWFpbnMgYmxvY2tlZCBhbmQgbm9uLWRlc3RydWN0aXZlCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMjU1ODc2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY2FuZGlkYXRlIHJl
dGFpbnMgdW5jb25kaXRpb25hbCBmYWlsLWNsb3NlZCBndWFyZCBiZWZvcmUgRERMCm9rIDQ0OCAt
IGNhbmRpZGF0ZSByZXRhaW5zIHVuY29uZGl0aW9uYWwgZmFpbC1jbG9zZWQgZ3VhcmQgYmVmb3Jl
IERETAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjk5MzMzNwogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IGFsbCBzaXggc3luYyBjb2x1bW5zIGhhdmUgY2F0YWxvZyB0eXBlIGFzc2VydGlv
bnMgYWZ0ZXIgYWxpZ25tZW50IERETApvayA0NDkgLSBhbGwgc2l4IHN5bmMgY29sdW1ucyBoYXZl
IGNhdGFsb2cgdHlwZSBhc3NlcnRpb25zIGFmdGVyIGFsaWdubWVudCBEREwKICAtLS0KICBkdXJh
dGlvbl9tczogMC40MjE5MTYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjcml0aWNh
bCBib29sZWFuIGNvbHVtbnMgbXVzdCBiZSBub24tbnVsbCwgb3B0aW9uYWwgbGVhc2UgbWV0YWRh
dGEgbWF5IGJlIG51bGwKb2sgNDUwIC0gY3JpdGljYWwgYm9vbGVhbiBjb2x1bW5zIG11c3QgYmUg
bm9uLW51bGwsIG9wdGlvbmFsIGxlYXNlIG1ldGFkYXRhIG1heSBiZSBudWxsCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMTU3Mzg3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY3VycmVu
dC1nYW1lIGluZGV4IGF1ZGl0IGNoZWNrcyBpbmRleCBuYW1lc3BhY2UgaW5kZXBlbmRlbnRseSBm
cm9tIHRhYmxlIG5hbWVzcGFjZQpvayA0NTEgLSBjdXJyZW50LWdhbWUgaW5kZXggYXVkaXQgY2hl
Y2tzIGluZGV4IG5hbWVzcGFjZSBpbmRlcGVuZGVudGx5IGZyb20gdGFibGUgbmFtZXNwYWNlCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuOTU3MDQzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogY3VycmVudC1nYW1lIGluZGV4IGF1ZGl0IHN0aWxsIHJlcXVpcmVzIHVuaXF1ZSB2YWxpZCBy
ZWFkeSBvd25lci1rZXkgcGFydGlhbCBpbmRleApvayA0NTIgLSBjdXJyZW50LWdhbWUgaW5kZXgg
YXVkaXQgc3RpbGwgcmVxdWlyZXMgdW5pcXVlIHZhbGlkIHJlYWR5IG93bmVyLWtleSBwYXJ0aWFs
IGluZGV4CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTIyNjg1CiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogc2NoZW1hIGNhbmRpZGF0ZSByZXRhaW5zIHVuY29uZGl0aW9uYWwgbm9uLWRl
cGxveSBndWFyZApvayA0NTMgLSBzY2hlbWEgY2FuZGlkYXRlIHJldGFpbnMgdW5jb25kaXRpb25h
bCBub24tZGVwbG95IGd1YXJkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTY3MDMyCiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogaW5kZXggbmFtZSByZXVzZSBjYW5ub3QgYnlwYXNzIHVu
aXF1ZSBpbmRleCBkZWZpbml0aW9uIHZlcmlmaWNhdGlvbgpvayA0NTQgLSBpbmRleCBuYW1lIHJl
dXNlIGNhbm5vdCBieXBhc3MgdW5pcXVlIGluZGV4IGRlZmluaXRpb24gdmVyaWZpY2F0aW9uCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuOTYxNTQ5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogY3VycmVudCBnYW1lIGluZGV4IHByZWRpY2F0ZSBpcyBjaGVja2VkLCBub3QganVzdCBpdHMg
bmFtZQpvayA0NTUgLSBjdXJyZW50IGdhbWUgaW5kZXggcHJlZGljYXRlIGlzIGNoZWNrZWQsIG5v
dCBqdXN0IGl0cyBuYW1lCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjAzMDY2CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogaW5kZXggZGVmaW5pdGlvbiBjaGVjayByZW1haW5zIGluc2lk
ZSBndWFyZGVkIGF0b21pYyBtaWdyYXRpb24Kb2sgNDU2IC0gaW5kZXggZGVmaW5pdGlvbiBjaGVj
ayByZW1haW5zIGluc2lkZSBndWFyZGVkIGF0b21pYyBtaWdyYXRpb24KICAtLS0KICBkdXJhdGlv
bl9tczogMC4xNDM0MTYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBib3RoIGd1YXJk
ZWQgaW5kZXggY2hlY2tzIHZhbGlkYXRlIGJ0cmVlIGFjY2VzcyBtZXRob2QKb2sgNDU3IC0gYm90
aCBndWFyZGVkIGluZGV4IGNoZWNrcyB2YWxpZGF0ZSBidHJlZSBhY2Nlc3MgbWV0aG9kCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDEuMDk4MjU2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
Ym90aCBndWFyZGVkIGluZGV4IGNoZWNrcyByZWplY3QgZXhwcmVzc2lvbiBhbmQgSU5DTFVERSBp
bmRleGVzCm9rIDQ1OCAtIGJvdGggZ3VhcmRlZCBpbmRleCBjaGVja3MgcmVqZWN0IGV4cHJlc3Np
b24gYW5kIElOQ0xVREUgaW5kZXhlcwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEzMDAxNgogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVuY29uZGl0aW9uYWwgbm9uLWRlcGxveSBndWFy
ZCByZW1haW5zIGZpcnN0IFNRTCBzdGF0ZW1lbnQKb2sgNDU5IC0gdW5jb25kaXRpb25hbCBub24t
ZGVwbG95IGd1YXJkIHJlbWFpbnMgZmlyc3QgU1FMIHN0YXRlbWVudAogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjIxNzY1OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGxlZ2FjeSBpbmRl
eCBkcm9wIGlzIHByZWNlZGVkIGJ5IHN0cmljdCBjYXRhbG9nIHNoYXBlIHZlcmlmaWNhdGlvbgpv
ayA0NjAgLSBsZWdhY3kgaW5kZXggZHJvcCBpcyBwcmVjZWRlZCBieSBzdHJpY3QgY2F0YWxvZyBz
aGFwZSB2ZXJpZmljYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC44NjcxMTcKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBsZWdhY3kgaW5kZXggbXVzdCBiZSB1bmlxdWUgYW5kIHNj
b3BlZCB0byBhY3RpdmUgdXNlciBzZXNzaW9ucwpvayA0NjEgLSBsZWdhY3kgaW5kZXggbXVzdCBi
ZSB1bmlxdWUgYW5kIHNjb3BlZCB0byBhY3RpdmUgdXNlciBzZXNzaW9ucwogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjI2NTE4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbGVnYWN5IGlu
ZGV4IGRyb3AgcHJvdGVjdGlvbiByZW1haW5zIGZhaWwtY2xvc2VkIGFuZCBhdG9taWMKb2sgNDYy
IC0gbGVnYWN5IGluZGV4IGRyb3AgcHJvdGVjdGlvbiByZW1haW5zIGZhaWwtY2xvc2VkIGFuZCBh
dG9taWMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMTM2ODEKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBkZXBsb3ltZW50IGludGVudGlvbmFsbHkgYmxvY2tlZCB1bnRpbCByZWFsIGlu
dGVncmF0aW9uIHZlcmlmaWNhdGlvbgpvayA0NjMgLSBkZXBsb3ltZW50IGludGVudGlvbmFsbHkg
YmxvY2tlZCB1bnRpbCByZWFsIGludGVncmF0aW9uIHZlcmlmaWNhdGlvbgogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjg5MDIxMgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG9wZW4gYW5k
IGNvbW1pdCByZXF1aXJlIHZhbGlkIG1hdGNoaW5nIFN1cGFiYXNlIEF1dGggc2Vzc2lvbgpvayA0
NjQgLSBvcGVuIGFuZCBjb21taXQgcmVxdWlyZSB2YWxpZCBtYXRjaGluZyBTdXBhYmFzZSBBdXRo
IHNlc3Npb24KICAtLS0KICBkdXJhdGlvbl9tczogMS4wMzE4MDUKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBib3RoIGVuZHBvaW50cyByZWplY3QgYmFubmVkIG9yIGRlbGV0ZWQgYWNj
b3VudHMKb2sgNDY1IC0gYm90aCBlbmRwb2ludHMgcmVqZWN0IGJhbm5lZCBvciBkZWxldGVkIGFj
Y291bnRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTY4MDMzCiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogd3JpdGUgcmVxdWlyZXMgZGV2aWNlIHRva2VuLCBnZW5lcmF0aW9uIGFuZCBh
dXRoIHNlc3Npb24gYmluZGluZwpvayA0NjYgLSB3cml0ZSByZXF1aXJlcyBkZXZpY2UgdG9rZW4s
IGdlbmVyYXRpb24gYW5kIGF1dGggc2Vzc2lvbiBiaW5kaW5nCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMTIwNDAyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29uZmxpY3RpbmcgdXBk
YXRlcyBwcmVzZXJ2ZSBjbG91ZCBzdGF0ZSBhbmQgcmVjb3JkIGNvbmZsaWN0Cm9rIDQ2NyAtIGNv
bmZsaWN0aW5nIHVwZGF0ZXMgcHJlc2VydmUgY2xvdWQgc3RhdGUgYW5kIHJlY29yZCBjb25mbGlj
dAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE2MDI3MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IHRha2VvdmVyIHJvdGF0ZXMgdG9rZW4gYW5kIGluY3JlbWVudHMgZ2VuZXJhdGlvbgpv
ayA0NjggLSB0YWtlb3ZlciByb3RhdGVzIHRva2VuIGFuZCBpbmNyZW1lbnRzIGdlbmVyYXRpb24K
ICAtLS0KICBkdXJhdGlvbl9tczogMC4wOTYxNTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBvbGQgYW5kIG5ldyBzZXNzaW9ucyBzZXJpYWxpemVkIHZpYSB1c2VyIHJvdyBsb2NrCm9r
IDQ2OSAtIG9sZCBhbmQgbmV3IHNlc3Npb25zIHNlcmlhbGl6ZWQgdmlhIHVzZXIgcm93IGxvY2sK
ICAtLS0KICBkdXJhdGlvbl9tczogMC4wNzIyNjkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBhbGwgc2l4IHB1YmxpYyBSUEMgZW5kcG9pbnRzIGFyZSBzZWFyY2gtcGF0aCBoYXJkZW5l
ZCBhbmQgZXhwbGljaXRseSByZXN0cmljdGVkCm9rIDQ3MCAtIGFsbCBzaXggcHVibGljIFJQQyBl
bmRwb2ludHMgYXJlIHNlYXJjaC1wYXRoIGhhcmRlbmVkIGFuZCBleHBsaWNpdGx5IHJlc3RyaWN0
ZWQKICAtLS0KICBkdXJhdGlvbl9tczogMC40MjQ4ODEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBT
dWJ0ZXN0OiBvbGRlciBhdXRoIHNlc3Npb25zIGNhbm5vdCByZWNsYWltIGxlYXNlIGFmdGVyIG5l
d2VyIGF1dGggc2Vzc2lvbiBleHBpcmVzCm9rIDQ3MSAtIG9sZGVyIGF1dGggc2Vzc2lvbnMgY2Fu
bm90IHJlY2xhaW0gbGVhc2UgYWZ0ZXIgbmV3ZXIgYXV0aCBzZXNzaW9uIGV4cGlyZXMKICAtLS0K
ICBkdXJhdGlvbl9tczogMC4yNDQxNjgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBw
ZWVrIHJlamVjdHMgZGlzcGxhY2VkIG9sZGVyIGF1dGggc2Vzc2lvbnMgZXZlbiBhZnRlciBuZXdl
ciBsb2dpbiBleHBpcmVzCm9rIDQ3MiAtIHBlZWsgcmVqZWN0cyBkaXNwbGFjZWQgb2xkZXIgYXV0
aCBzZXNzaW9ucyBldmVuIGFmdGVyIG5ld2VyIGxvZ2luIGV4cGlyZXMKICAtLS0KICBkdXJhdGlv
bl9tczogMC4yOTYwOTcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFkZXIgZW5y
b2xsbWVudCB1cGRhdGVzIGF1dGgtc2Vzc2lvbiBoaWdoLXdhdGVyIHRpbWVzdGFtcCBvbiByZXVz
ZWQgZGV2aWNlIElEcwpvayA0NzMgLSByZWFkZXIgZW5yb2xsbWVudCB1cGRhdGVzIGF1dGgtc2Vz
c2lvbiBoaWdoLXdhdGVyIHRpbWVzdGFtcCBvbiByZXVzZWQgZGV2aWNlIElEcwogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjE4MDEyMgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlYWRl
ciBlbnJvbGxtZW50IGNhbm5vdCBvdmVyd3JpdGUgbmV3ZXIgQXV0aC1zZXNzaW9uIGhpZ2gtd2F0
ZXIgbWFyayB3aXRoIG9sZGVyIHNlc3Npb24Kb2sgNDc0IC0gcmVhZGVyIGVucm9sbG1lbnQgY2Fu
bm90IG92ZXJ3cml0ZSBuZXdlciBBdXRoLXNlc3Npb24gaGlnaC13YXRlciBtYXJrIHdpdGggb2xk
ZXIgc2Vzc2lvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEyOTk4NgogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IHJlYWQgYW5kIGxlYXNlIHN0YXR1cyByZWplY3QgZGlzcGxhY2VkIG9s
ZGVyIGxvZ2luIHVzaW5nIHBlcnNpc3RlbnQgc2Vzc2lvbiBoaWdoLXdhdGVyIG1hcmsKb2sgNDc1
IC0gcmVhZCBhbmQgbGVhc2Ugc3RhdHVzIHJlamVjdCBkaXNwbGFjZWQgb2xkZXIgbG9naW4gdXNp
bmcgcGVyc2lzdGVudCBzZXNzaW9uIGhpZ2gtd2F0ZXIgbWFyawogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjEyODkxNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbW1pdCByZWplY3Rz
IGRpc3BsYWNlZCBvbGRlciBsb2dpbiBhZnRlciBuZXdlciBhdXRoIHNlc3Npb24gZXhwaXJlcwpv
ayA0NzYgLSBjb21taXQgcmVqZWN0cyBkaXNwbGFjZWQgb2xkZXIgbG9naW4gYWZ0ZXIgbmV3ZXIg
YXV0aCBzZXNzaW9uIGV4cGlyZXMKICAtLS0KICBkdXJhdGlvbl9tczogMC4wODgxMTMKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiB3cml0ZXIgb3BlbiBjYW5ub3QgZG93bmdyYWRlIG5l
d2VyIHJlY29yZGVkIGxvZ2luIG9uIHJldXNlZCBkZXZpY2UgaW4gbXVsdGktZGV2aWNlIG1vZGUK
b2sgNDc3IC0gd3JpdGVyIG9wZW4gY2Fubm90IGRvd25ncmFkZSBuZXdlciByZWNvcmRlZCBsb2dp
biBvbiByZXVzZWQgZGV2aWNlIGluIG11bHRpLWRldmljZSBtb2RlCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMDc4OTA5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZGVyIGVucm9s
bG1lbnQgY2Fubm90IHJldm9rZSBhbiBleGlzdGluZyB3cml0ZXIgbGVhc2UgdXNpbmcgaXRzIGRl
dmljZSBJRApvayA0NzggLSByZWFkZXIgZW5yb2xsbWVudCBjYW5ub3QgcmV2b2tlIGFuIGV4aXN0
aW5nIHdyaXRlciBsZWFzZSB1c2luZyBpdHMgZGV2aWNlIElECiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMTM1MDM0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb3BlbiByZWplY3RzIG5l
Z2F0aXZlIHByZWZsaWdodCByZXZpc2lvbnMgYmVmb3JlIHdyaXRlciByZXZvY2F0aW9uCm9rIDQ3
OSAtIG9wZW4gcmVqZWN0cyBuZWdhdGl2ZSBwcmVmbGlnaHQgcmV2aXNpb25zIGJlZm9yZSB3cml0
ZXIgcmV2b2NhdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjA2Njg3MQogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IGV4aXN0aW5nIGNsb3VkIGdhbWUgcmVxdWlyZXMgZXhwbGljaXQg
cmV2aXNpb24gcHJlZmxpZ2h0IGJlZm9yZSB3cml0ZXIgdGFrZW92ZXIKb2sgNDgwIC0gZXhpc3Rp
bmcgY2xvdWQgZ2FtZSByZXF1aXJlcyBleHBsaWNpdCByZXZpc2lvbiBwcmVmbGlnaHQgYmVmb3Jl
IHdyaXRlciB0YWtlb3ZlcgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjA3MDE0NgogIHR5cGU6ICd0
ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN1cGFiYXNlX3N5bmNfcnBjX2RyYWZ0LnNxbDogc2Vzc2lv
biBvcmRlcmluZyBpcyBkZXRlcm1pbmlzdGljIHdoZW4gdGltZXN0YW1wcyB0aWUKb2sgNDgxIC0g
c3VwYWJhc2Vfc3luY19ycGNfZHJhZnQuc3FsOiBzZXNzaW9uIG9yZGVyaW5nIGlzIGRldGVybWlu
aXN0aWMgd2hlbiB0aW1lc3RhbXBzIHRpZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjkzMDU1Mwog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN1cGFiYXNlX3N5bmNfcmVhZG9ubHlfZHJh
ZnQuc3FsOiBzZXNzaW9uIG9yZGVyaW5nIGlzIGRldGVybWluaXN0aWMgd2hlbiB0aW1lc3RhbXBz
IHRpZQpvayA0ODIgLSBzdXBhYmFzZV9zeW5jX3JlYWRvbmx5X2RyYWZ0LnNxbDogc2Vzc2lvbiBv
cmRlcmluZyBpcyBkZXRlcm1pbmlzdGljIHdoZW4gdGltZXN0YW1wcyB0aWUKICAtLS0KICBkdXJh
dGlvbl9tczogMC4xNzYwMTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBvcGVuIHJl
amVjdHMgYSBtaXNzaW5nIHVzZXIgcm9sZSBleHBsaWNpdGx5Cm9rIDQ4MyAtIG9wZW4gcmVqZWN0
cyBhIG1pc3NpbmcgdXNlciByb2xlIGV4cGxpY2l0bHkKICAtLS0KICBkdXJhdGlvbl9tczogMC40
MzQ3NzUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFsIEpXVCBwcmVmbGlnaHQg
dXNlcyBnZXRVc2VyIHNlcnZlciB2YWxpZGF0aW9uIGFuZCBhdXRoZW50aWNhdGVkIFJQQwpvayA0
ODQgLSByZWFsIEpXVCBwcmVmbGlnaHQgdXNlcyBnZXRVc2VyIHNlcnZlciB2YWxpZGF0aW9uIGFu
ZCBhdXRoZW50aWNhdGVkIFJQQwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjg5MDIwMQogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlYWwgSldUIHByZWZsaWdodCBkb2VzIG5vdCBpbnZv
a2Ugd3JpdGUgUlBDcyBvciBjaGFuZ2Ugc3luYyBmbGFnCm9rIDQ4NSAtIHJlYWwgSldUIHByZWZs
aWdodCBkb2VzIG5vdCBpbnZva2Ugd3JpdGUgUlBDcyBvciBjaGFuZ2Ugc3luYyBmbGFnCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuMjUyNzIxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
cmVhbCBKV1QgcHJlZmxpZ2h0IGRvZXMgbm90IHByaW50IHJhdyBKV1Qgb3IgaWRlbnRpZnlpbmcg
dXNlciBkYXRhCm9rIDQ4NiAtIHJlYWwgSldUIHByZWZsaWdodCBkb2VzIG5vdCBwcmludCByYXcg
SldUIG9yIGlkZW50aWZ5aW5nIHVzZXIgZGF0YQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE3MzE4
MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG9wZW4gcmVqZWN0cyBzeW1ib2wta2V5
ZWQgc25hcHNob3QgYmVmb3JlIG5ldHdvcmsKb2sgNDg3IC0gb3BlbiByZWplY3RzIHN5bWJvbC1r
ZXllZCBzbmFwc2hvdCBiZWZvcmUgbmV0d29yawogIC0tLQogIGR1cmF0aW9uX21zOiAxLjA2MTYy
MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbW1pdCByZWplY3RzIGdldHRlciB3
aXRob3V0IGludm9raW5nIGl0Cm9rIDQ4OCAtIGNvbW1pdCByZWplY3RzIGdldHRlciB3aXRob3V0
IGludm9raW5nIGl0CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjI3MTQyCiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogb3BlbiByZWplY3RzIGhpZGRlbiBvd24gcHJvcGVydHkgaW5zdGVh
ZCBvZiBzaWxlbnRseSBkcm9wcGluZyBpdApvayA0ODkgLSBvcGVuIHJlamVjdHMgaGlkZGVuIG93
biBwcm9wZXJ0eSBpbnN0ZWFkIG9mIHNpbGVudGx5IGRyb3BwaW5nIGl0CiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuMTUyOTExCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb3BlbiBwcmVz
ZXJ2ZXMgb3JkaW5hcnkgSlNPTiBvYmplY3QgcGF5bG9hZApvayA0OTAgLSBvcGVuIHByZXNlcnZl
cyBvcmRpbmFyeSBKU09OIG9iamVjdCBwYXlsb2FkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDA1
OTUyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3RhZ2VkIHNlcnZlciB2YWxpZGF0
b3IgY2hlY2tzIHRoZSByZWNvcmRlZC1oYW5kIGZpZWxkcyBjaGVja2VkIGJ5IEpTCm9rIDQ5MSAt
IHN0YWdlZCBzZXJ2ZXIgdmFsaWRhdG9yIGNoZWNrcyB0aGUgcmVjb3JkZWQtaGFuZCBmaWVsZHMg
Y2hlY2tlZCBieSBKUwogIC0tLQogIGR1cmF0aW9uX21zOiAxLjAxMjUzNwogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IFNRTCByZWplY3RzIGR1cGxpY2F0ZSBoaXN0b3JpY2FsIHNlYXQg
d2luZHMKb2sgNDkyIC0gU1FMIHJlamVjdHMgZHVwbGljYXRlIGhpc3RvcmljYWwgc2VhdCB3aW5k
cwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjI4OTI3NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IFNRTCBoaXN0b3JpY2FsIHBsYXllciBuYW1lcyBoYXZlIHNhbWUgMTAwLWNoYXJhY3Rl
ciBjZWlsaW5nIGFzIGN1cnJlbnQgbmFtZXMKb2sgNDkzIC0gU1FMIGhpc3RvcmljYWwgcGxheWVy
IG5hbWVzIGhhdmUgc2FtZSAxMDAtY2hhcmFjdGVyIGNlaWxpbmcgYXMgY3VycmVudCBuYW1lcwog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjM0OTA4NgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IFNRTCB2YWxpZGF0b3IgcmVqZWN0cyBtaXNzaW5nIGFuZCBKU09OLW51bGwgcmVxdWlyZWQg
ZmllbGRzIGV4cGxpY2l0bHkKb2sgNDk0IC0gU1FMIHZhbGlkYXRvciByZWplY3RzIG1pc3Npbmcg
YW5kIEpTT04tbnVsbCByZXF1aXJlZCBmaWVsZHMgZXhwbGljaXRseQogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjk3NjI4MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFNRTCB2YWxpZGF0
b3IgcmVqZWN0cyB0b3AtbGV2ZWwgU1FMIE5VTEwgYW5kIEpTT04gbnVsbApvayA0OTUgLSBTUUwg
dmFsaWRhdG9yIHJlamVjdHMgdG9wLWxldmVsIFNRTCBOVUxMIGFuZCBKU09OIG51bGwKICAtLS0K
ICBkdXJhdGlvbl9tczogMC4yOTExNTkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBT
UUwgdmFsaWRhdG9yIHN0YXlzIG5vbmRlcGxveWFibGUgd2hpbGUgaW50ZWdyYXRpb24gaXMgcGVu
ZGluZwpvayA0OTYgLSBTUUwgdmFsaWRhdG9yIHN0YXlzIG5vbmRlcGxveWFibGUgd2hpbGUgaW50
ZWdyYXRpb24gaXMgcGVuZGluZwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE2ODk2NAogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNsb3VkIHNjb3JlIHZhbGlkYXRvciByZWplY3RzIGZy
YWN0aW9uYWwgc2NvcmVzCm9rIDQ5NyAtIGNsb3VkIHNjb3JlIHZhbGlkYXRvciByZWplY3RzIGZy
YWN0aW9uYWwgc2NvcmVzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODAyOTMKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiBjbG91ZCBzY29yZSB2YWxpZGF0b3IgYm91bmRzIGludGVnZXIg
bWFnbml0dWRlCm9rIDQ5OCAtIGNsb3VkIHNjb3JlIHZhbGlkYXRvciBib3VuZHMgaW50ZWdlciBt
YWduaXR1ZGUKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNTc2NzgKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBTUUwgZHJhZnQgcmVtYWlucyBmYWlsLWNsb3NlZCBmb3IgcHJvZHVjdGlv
bgpvayA0OTkgLSBTUUwgZHJhZnQgcmVtYWlucyBmYWlsLWNsb3NlZCBmb3IgcHJvZHVjdGlvbgog
IC0tLQogIGR1cmF0aW9uX21zOiAwLjA5Mzc0MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRl
c3Q6IHNlcnZlciBjaGVja3Mgb3B0aW9uYWwgcm91bmRXaW5kIGlzIGEgd2luZCBpbnRlZ2VyCm9r
IDUwMCAtIHNlcnZlciBjaGVja3Mgb3B0aW9uYWwgcm91bmRXaW5kIGlzIGEgd2luZCBpbnRlZ2Vy
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNzMxMTUzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogc2VydmVyIGNoZWNrcyBvcHRpb25hbCBzZWF0V2luZHMgY29udGFpbnMgZm91ciBkaXN0
aW5jdCB3aW5kIGludGVnZXJzCm9rIDUwMSAtIHNlcnZlciBjaGVja3Mgb3B0aW9uYWwgc2VhdFdp
bmRzIGNvbnRhaW5zIGZvdXIgZGlzdGluY3Qgd2luZCBpbnRlZ2VycwogIC0tLQogIGR1cmF0aW9u
X21zOiAwLjE2MzMzNgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFNRTCByZW1haW5z
IGJsb2NrZWQgZnJvbSBwcm9kdWN0aW9uCm9rIDUwMiAtIFNRTCByZW1haW5zIGJsb2NrZWQgZnJv
bSBwcm9kdWN0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMDk0NTUyCiAgdHlwZTogJ3Rlc3Qn
CiAgLi4uCiMgU3VidGVzdDogYWRtaW4gdW5sb2NrIGRyYWZ0IGNhbm5vdCBiZSBkZXBsb3llZCBh
Y2NpZGVudGFsbHkKb2sgNTAzIC0gYWRtaW4gdW5sb2NrIGRyYWZ0IGNhbm5vdCBiZSBkZXBsb3ll
ZCBhY2NpZGVudGFsbHkKICAtLS0KICBkdXJhdGlvbl9tczogMC44MDk1NzEKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiBhZG1pbiB1bmxvY2sgZHJhZnQgY2hlY2tzIGFjdG9yLCB0YXJn
ZXQgYW5kIHN0YWxlIGJpbmRpbmcgYmVmb3JlIG11dGF0aW9uCm9rIDUwNCAtIGFkbWluIHVubG9j
ayBkcmFmdCBjaGVja3MgYWN0b3IsIHRhcmdldCBhbmQgc3RhbGUgYmluZGluZyBiZWZvcmUgbXV0
YXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4xNTM4NjIKICB0eXBlOiAndGVzdCcKICAuLi4K
IyBTdWJ0ZXN0OiBhZG1pbiB1bmxvY2sgZHJhZnQgcHJlc2VydmVzIGdhbWUgcm93cyBhbmQgcmVj
b3JkcyByZWNvdmVyeSBhdWRpdApvayA1MDUgLSBhZG1pbiB1bmxvY2sgZHJhZnQgcHJlc2VydmVz
IGdhbWUgcm93cyBhbmQgcmVjb3JkcyByZWNvdmVyeSBhdWRpdAogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjE2ODU1NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGNvbW1pdCBlbmZvcmNl
cyBkZXZpY2UgYmluZGluZyBhZnRlciBtdWx0aS1kZXZpY2UgcGVybWlzc2lvbiBpcyByZXZva2Vk
Cm9rIDUwNiAtIGNvbW1pdCBlbmZvcmNlcyBkZXZpY2UgYmluZGluZyBhZnRlciBtdWx0aS1kZXZp
Y2UgcGVybWlzc2lvbiBpcyByZXZva2VkCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNjgyMzM4CiAg
dHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogY29tbWl0IGhvbGRzIG93bmVyIGxvY2sgYmVm
b3JlIGdhbWUgbG9jayBhbmQgZ3VhcmRlZCB1cGRhdGUKb2sgNTA3IC0gY29tbWl0IGhvbGRzIG93
bmVyIGxvY2sgYmVmb3JlIGdhbWUgbG9jayBhbmQgZ3VhcmRlZCB1cGRhdGUKICAtLS0KICBkdXJh
dGlvbl9tczogMC44OTEwMjMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjb21taXQg
dmVyaWZpZXMgZXhhY3Qgd3JpdGVyIHRva2VuIGdlbmVyYXRpb24gYW5kIGF1dGggc2Vzc2lvbiBi
ZWZvcmUgd3JpdGUKb2sgNTA4IC0gY29tbWl0IHZlcmlmaWVzIGV4YWN0IHdyaXRlciB0b2tlbiBn
ZW5lcmF0aW9uIGFuZCBhdXRoIHNlc3Npb24gYmVmb3JlIHdyaXRlCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMTI3OTczCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmV2aXNpb24gbWlz
bWF0Y2ggcmV0dXJucyBiZWZvcmUgZ2FtZSB1cGRhdGUgYW5kIGluY3JlbWVudHMgcmV2aXNpb24g
b24gc3VjY2VzcwpvayA1MDkgLSByZXZpc2lvbiBtaXNtYXRjaCByZXR1cm5zIGJlZm9yZSBnYW1l
IHVwZGF0ZSBhbmQgaW5jcmVtZW50cyByZXZpc2lvbiBvbiBzdWNjZXNzCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuMTIzMjU2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogdW5zYWZlIFJQ
QyBndWFyZCBwcmVjZWRlcyB0cmFuc2FjdGlvbiBhbmQgYW55IGdyYW50Cm9rIDUxMCAtIHVuc2Fm
ZSBSUEMgZ3VhcmQgcHJlY2VkZXMgdHJhbnNhY3Rpb24gYW5kIGFueSBncmFudAogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjg0MjAxOQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVuc2Fm
ZSBSUEMgZ3VhcmQgaXMgdW5jb25kaXRpb25hbCB0b3AtbGV2ZWwgZXhjZXB0aW9uCm9rIDUxMSAt
IHVuc2FmZSBSUEMgZ3VhcmQgaXMgdW5jb25kaXRpb25hbCB0b3AtbGV2ZWwgZXhjZXB0aW9uCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMjE4NDE5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogYWRtaW4gdW5sb2NrIGRyYWZ0IGNvbnRhaW5zIG5vIGV4ZWN1dGFibGUgZ3JhbnQKb2sgNTEy
IC0gYWRtaW4gdW5sb2NrIGRyYWZ0IGNvbnRhaW5zIG5vIGV4ZWN1dGFibGUgZ3JhbnQKICAtLS0K
ICBkdXJhdGlvbl9tczogMC4xNDU1NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGlu
dGVncmF0aW9uIGdhdGUgY2Fubm90IGJlIGNsYWltZWQgZnJvbSBzdGF0aWMgTm9kZSB0ZXN0cwpv
ayA1MTMgLSBpbnRlZ3JhdGlvbiBnYXRlIGNhbm5vdCBiZSBjbGFpbWVkIGZyb20gc3RhdGljIE5v
ZGUgdGVzdHMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xMDE2MDMKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiBiZXRhIHJlamVjdHMgYW5vdGhlciB3cml0ZXIgZGV2aWNlIHVuZGVyIG93
bmVyIGxvY2sgYmVmb3JlIGxlYXNlIHJldm9jYXRpb24Kb2sgNTE0IC0gYmV0YSByZWplY3RzIGFu
b3RoZXIgd3JpdGVyIGRldmljZSB1bmRlciBvd25lciBsb2NrIGJlZm9yZSBsZWFzZSByZXZvY2F0
aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMjIxMTgxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogcHJvZHVjdGlvbiBkZXBsb3ltZW50IGFuZCBicm93c2VyIGNsb3VkIHN5bmMgcmVt
YWluIGRpc2FibGVkCm9rIDUxNSAtIHByb2R1Y3Rpb24gZGVwbG95bWVudCBhbmQgYnJvd3NlciBj
bG91ZCBzeW5jIHJlbWFpbiBkaXNhYmxlZAogIC0tLQogIGR1cmF0aW9uX21zOiAxLjc1ODI4MQog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHNpbmdsZSBkZXZpY2UgYmV0YSBtdXN0IG5v
dCBibG9jayBzYW1lIGRldmljZSBhZnRlciBsb2dvdXQgYW5kIGZyZXNoIGxvZ2luCm9rIDUxNiAt
IHNpbmdsZSBkZXZpY2UgYmV0YSBtdXN0IG5vdCBibG9jayBzYW1lIGRldmljZSBhZnRlciBsb2dv
dXQgYW5kIGZyZXNoIGxvZ2luCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNjgyMDU4CiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogZHJhZnQgYW5kIG9ic29sZXRlIHJldmlldyBib3RoIHJl
ZnVzZSBleGVjdXRpb24gYmVmb3JlIHRyYW5zYWN0aW9uIG9yIERETApvayA1MTcgLSBkcmFmdCBh
bmQgb2Jzb2xldGUgcmV2aWV3IGJvdGggcmVmdXNlIGV4ZWN1dGlvbiBiZWZvcmUgdHJhbnNhY3Rp
b24gb3IgRERMCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMDA0ODE1CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogcmV2aWV3IG9wZW4gY29udHJhY3QgaXMgaW5jb21wYXRpYmxlIHdpdGgg
cHJvdGVjdGVkIGZvdXItYXJndW1lbnQgZHJhZnQKb2sgNTE4IC0gcmV2aWV3IG9wZW4gY29udHJh
Y3QgaXMgaW5jb21wYXRpYmxlIHdpdGggcHJvdGVjdGVkIGZvdXItYXJndW1lbnQgZHJhZnQKICAt
LS0KICBkdXJhdGlvbl9tczogMC4xMjE3NTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBkcmFmdCByZXRhaW5zIGhpZ2gtd2F0ZXIgYXV0aCBzZXNzaW9uIGFuZCBleHBlY3RlZCBjbG91
ZCBpZGVudGl0eSBjaGVja3MKb2sgNTE5IC0gZHJhZnQgcmV0YWlucyBoaWdoLXdhdGVyIGF1dGgg
c2Vzc2lvbiBhbmQgZXhwZWN0ZWQgY2xvdWQgaWRlbnRpdHkgY2hlY2tzCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuMTA1Njc5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTMg
cHJlZmxpZ2h0IGRlbmllcyBtaXNzaW5nIGVudmlyb25tZW50IGFuZCBuZXZlciBjb25uZWN0cwpv
ayA1MjAgLSBTdGFnZSAxMyBwcmVmbGlnaHQgZGVuaWVzIG1pc3NpbmcgZW52aXJvbm1lbnQgYW5k
IG5ldmVyIGNvbm5lY3RzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuOTYwODg4CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTMgcHJlZmxpZ2h0IGFjY2VwdHMgZXhwbGljaXQg
ZGlzcG9zYWJsZSBsb2NhbCB0YXJnZXQKb2sgNTIxIC0gU3RhZ2UgMTMgcHJlZmxpZ2h0IGFjY2Vw
dHMgZXhwbGljaXQgZGlzcG9zYWJsZSBsb2NhbCB0YXJnZXQKICAtLS0KICBkdXJhdGlvbl9tczog
MC41NzM1MjUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZSAxMyBwcmVmbGln
aHQgYmxvY2tzIHByb2R1Y3Rpb24tbWFya2VkIHRhcmdldApvayA1MjIgLSBTdGFnZSAxMyBwcmVm
bGlnaHQgYmxvY2tzIHByb2R1Y3Rpb24tbWFya2VkIHRhcmdldAogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjQ3NDAzNAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlIDEzIHByZWZs
aWdodCBibG9ja3Mgbm9uLXBvc3RncmVzIFVSTHMgYW5kIG1pc3NpbmcgYWNrbm93bGVkZ21lbnQK
b2sgNTIzIC0gU3RhZ2UgMTMgcHJlZmxpZ2h0IGJsb2NrcyBub24tcG9zdGdyZXMgVVJMcyBhbmQg
bWlzc2luZyBhY2tub3dsZWRnbWVudAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIzNDUxNAogIHR5
cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0YWdlIDEzIHByZWZsaWdodCByZWplY3RzIG5v
bi1kaXNwb3NhYmxlIGRhdGFiYXNlIG5hbWVzCm9rIDUyNCAtIFN0YWdlIDEzIHByZWZsaWdodCBy
ZWplY3RzIG5vbi1kaXNwb3NhYmxlIGRhdGFiYXNlIG5hbWVzCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMjg2NDAyCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTMgcHJlZmxp
Z2h0IHJlcXVpcmVzIHNlcGFyYXRlIGFja25vd2xlZGdtZW50IGZvciByZW1vdGUgdGFyZ2V0cwpv
ayA1MjUgLSBTdGFnZSAxMyBwcmVmbGlnaHQgcmVxdWlyZXMgc2VwYXJhdGUgYWNrbm93bGVkZ21l
bnQgZm9yIHJlbW90ZSB0YXJnZXRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNTEzMDc0CiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTMgcHJlZmxpZ2h0IHJlamVjdHMgbWlz
c2luZyBpc29sYXRlZCBjcmVkZW50aWFscwpvayA1MjYgLSBTdGFnZSAxMyBwcmVmbGlnaHQgcmVq
ZWN0cyBtaXNzaW5nIGlzb2xhdGVkIGNyZWRlbnRpYWxzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MjMxNTQ5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTMgcHJlZmxpZ2h0
IHJlamVjdHMgY29ubmVjdGlvbiBxdWVyeSBvdmVycmlkZXMKb2sgNTI3IC0gU3RhZ2UgMTMgcHJl
ZmxpZ2h0IHJlamVjdHMgY29ubmVjdGlvbiBxdWVyeSBvdmVycmlkZXMKICAtLS0KICBkdXJhdGlv
bl9tczogMC4yMTA4ODgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZSAxMyBw
cmVmbGlnaHQgcmVqZWN0cyBVUkwgZnJhZ21lbnRzCm9rIDUyOCAtIFN0YWdlIDEzIHByZWZsaWdo
dCByZWplY3RzIFVSTCBmcmFnbWVudHMKICAtLS0KICBkdXJhdGlvbl9tczogMC4zMDc2ODMKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZSAxMyBwcmVmbGlnaHQgcmVqZWN0cyBl
bmNvZGVkIGRhdGFiYXNlIHNlcGFyYXRvcnMKb2sgNTI5IC0gU3RhZ2UgMTMgcHJlZmxpZ2h0IHJl
amVjdHMgZW5jb2RlZCBkYXRhYmFzZSBzZXBhcmF0b3JzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAu
MzQ4MDc1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTMgcHJlZmxpZ2h0
IHJlamVjdHMgZW5jb2RlZCBkb3Qgc2VnbWVudHMKb2sgNTMwIC0gU3RhZ2UgMTMgcHJlZmxpZ2h0
IHJlamVjdHMgZW5jb2RlZCBkb3Qgc2VnbWVudHMKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMjUx
NTkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFnZSAxMyBwcmVmbGlnaHQgcmVq
ZWN0cyBkb3VibGUtZW5jb2RlZCBjb250cm9sIHNlcXVlbmNlcwpvayA1MzEgLSBTdGFnZSAxMyBw
cmVmbGlnaHQgcmVqZWN0cyBkb3VibGUtZW5jb2RlZCBjb250cm9sIHNlcXVlbmNlcwogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjEyMjc5NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFN0
YWdlIDEzIHByZWZsaWdodCByZWplY3RzIG5lc3RlZCBkYXRhYmFzZSBwYXRocwpvayA1MzIgLSBT
dGFnZSAxMyBwcmVmbGlnaHQgcmVqZWN0cyBuZXN0ZWQgZGF0YWJhc2UgcGF0aHMKICAtLS0KICBk
dXJhdGlvbl9tczogMC4yNTI4MDEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBTdGFn
ZSAxMyBwcmVmbGlnaHQgcmVqZWN0cyBkb3VibGUtc2xhc2ggZGF0YWJhc2UgcGF0aHMKb2sgNTMz
IC0gU3RhZ2UgMTMgcHJlZmxpZ2h0IHJlamVjdHMgZG91YmxlLXNsYXNoIGRhdGFiYXNlIHBhdGhz
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTE1ODc1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogU3RhZ2UgMTMgcHJlZmxpZ2h0IHJlamVjdHMgYmxhbmsgY3JlZGVudGlhbHMKb2sgNTM0
IC0gU3RhZ2UgMTMgcHJlZmxpZ2h0IHJlamVjdHMgYmxhbmsgY3JlZGVudGlhbHMKICAtLS0KICBk
dXJhdGlvbl9tczogMC4xMDY2MwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG1hbGZv
cm1lZCBwZXJjZW50IGVuY29kZWQgZGF0YWJhc2UgbmFtZSBmYWlscyBjbG9zZWQgd2l0aG91dCB0
aHJvd2luZwpvayA1MzUgLSBtYWxmb3JtZWQgcGVyY2VudCBlbmNvZGVkIGRhdGFiYXNlIG5hbWUg
ZmFpbHMgY2xvc2VkIHdpdGhvdXQgdGhyb3dpbmcKICAtLS0KICBkdXJhdGlvbl9tczogMS4zMjIz
NjMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiB2YWxpZCBkaXNwb3NhYmxlIHBhdGgg
cmVtYWlucyBhY2NlcHRlZCBieSByZWFkLW9ubHkgcHJlZmxpZ2h0Cm9rIDUzNiAtIHZhbGlkIGRp
c3Bvc2FibGUgcGF0aCByZW1haW5zIGFjY2VwdGVkIGJ5IHJlYWQtb25seSBwcmVmbGlnaHQKICAt
LS0KICBkdXJhdGlvbl9tczogMC40NDI0NTcKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiByZWplY3RzIFVSTCBjcmVkZW50aWFscyBjb250YWluaW5nIGVuY29kZWQgY29udHJvbCBjaGFy
YWN0ZXJzCm9rIDUzNyAtIHJlamVjdHMgVVJMIGNyZWRlbnRpYWxzIGNvbnRhaW5pbmcgZW5jb2Rl
ZCBjb250cm9sIGNoYXJhY3RlcnMKICAtLS0KICBkdXJhdGlvbl9tczogMC4zMTA0NjgKICB0eXBl
OiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBwYXJhbGxlbCBQb3N0Z3JlU1FMIHRlc3QgcGxhbiBl
eHBsaWNpdGx5IGZvcmJpZHMgcHJvZHVjdGlvbiBhbmQgcmVxdWlyZXMgZGlzcG9zYWJsZSBkYXRh
YmFzZQpvayA1MzggLSBwYXJhbGxlbCBQb3N0Z3JlU1FMIHRlc3QgcGxhbiBleHBsaWNpdGx5IGZv
cmJpZHMgcHJvZHVjdGlvbiBhbmQgcmVxdWlyZXMgZGlzcG9zYWJsZSBkYXRhYmFzZQogIC0tLQog
IGR1cmF0aW9uX21zOiAxLjg2NTI5MgogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHBh
cmFsbGVsIHBsYW4gY292ZXJzIGNvbXBldGluZyBjb21taXRzIGFuZCBzdGFsZSByZXZpc2lvbiBy
ZWplY3Rpb24Kb2sgNTM5IC0gcGFyYWxsZWwgcGxhbiBjb3ZlcnMgY29tcGV0aW5nIGNvbW1pdHMg
YW5kIHN0YWxlIHJldmlzaW9uIHJlamVjdGlvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE4ODE0
NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHBhcmFsbGVsIHBsYW4gY292ZXJzIGRp
c3BsYWNlZCBzZXNzaW9uIGFuZCByb2xsYmFjayB3aXRob3V0IHJlbHlpbmcgb24gc3RhdGljIHRl
c3RzCm9rIDU0MCAtIHBhcmFsbGVsIHBsYW4gY292ZXJzIGRpc3BsYWNlZCBzZXNzaW9uIGFuZCBy
b2xsYmFjayB3aXRob3V0IHJlbHlpbmcgb24gc3RhdGljIHRlc3RzCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMTg4MDQzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc2luZ2xlLWRldmlj
ZSBiZXRhIGJpbmRzIHRvIHJlZ2lzdGVyZWQgZGV2aWNlIGV2ZW4gYWZ0ZXIgbG9nb3V0Cm9rIDU0
MSAtIHNpbmdsZS1kZXZpY2UgYmV0YSBiaW5kcyB0byByZWdpc3RlcmVkIGRldmljZSBldmVuIGFm
dGVyIGxvZ291dAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjc4ODQzOAogIHR5cGU6ICd0ZXN0Jwog
IC4uLgojIFN1YnRlc3Q6IGRldmljZSBiaW5kaW5nIG9jY3VycyB1bmRlciBhY2NvdW50IGxvY2sg
YmVmb3JlIGNsb3VkIHN0YXRlIG11dGF0aW9uCm9rIDU0MiAtIGRldmljZSBiaW5kaW5nIG9jY3Vy
cyB1bmRlciBhY2NvdW50IGxvY2sgYmVmb3JlIGNsb3VkIHN0YXRlIG11dGF0aW9uCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuMTUxNjI4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbmV3
IGJldGEgZ3VhcmQgaXMgbm90IGRlcGxveWFibGUgb3IgYWN0aXZlIGluIGJyb3dzZXIKb2sgNTQz
IC0gbmV3IGJldGEgZ3VhcmQgaXMgbm90IGRlcGxveWFibGUgb3IgYWN0aXZlIGluIGJyb3dzZXIK
ICAtLS0KICBkdXJhdGlvbl9tczogMS4zOTU1ODQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0
ZXN0OiBoaXN0b3JpY2FsIGRldmljZSBsb2NrIG9ubHkgY29uc2lkZXJzIGRldmljZXMgdGhhdCBo
YXZlIGhlbGQgd3JpdGVyIHJpZ2h0cwpvayA1NDQgLSBoaXN0b3JpY2FsIGRldmljZSBsb2NrIG9u
bHkgY29uc2lkZXJzIGRldmljZXMgdGhhdCBoYXZlIGhlbGQgd3JpdGVyIHJpZ2h0cwogIC0tLQog
IGR1cmF0aW9uX21zOiAwLjcyNTAxMwogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJl
YWRlciBlbnJvbGxtZW50IGNhbm5vdCBwcm9tb3RlIGl0c2VsZiBpbnRvIGEgcGVybWFuZW50IHdy
aXRlciBiaW5kaW5nCm9rIDU0NSAtIHJlYWRlciBlbnJvbGxtZW50IGNhbm5vdCBwcm9tb3RlIGl0
c2VsZiBpbnRvIGEgcGVybWFuZW50IHdyaXRlciBiaW5kaW5nCiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuMzI3Njg0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTM6IGRyYWZ0
IFNRTCByZW1haW5zIGZhaWwtY2xvc2VkIGJlZm9yZSB0cmFuc2FjdGlvbgpvayA1NDYgLSBTdGFn
ZSAxMzogZHJhZnQgU1FMIHJlbWFpbnMgZmFpbC1jbG9zZWQgYmVmb3JlIHRyYW5zYWN0aW9uCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuNzA4NTA4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogU3RhZ2UgMTM6IHBsYW4gcmVxdWlyZXMgZGlzcG9zYWJsZSBkYXRhYmFzZSBhbmQgU3VwYWJh
c2UgQXV0aCBmaXh0dXJlcwpvayA1NDcgLSBTdGFnZSAxMzogcGxhbiByZXF1aXJlcyBkaXNwb3Nh
YmxlIGRhdGFiYXNlIGFuZCBTdXBhYmFzZSBBdXRoIGZpeHR1cmVzCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMjc3ODc5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogU3RhZ2UgMTM6IGFs
bCBrZXkgUlBDIGRlZmluaXRpb25zIHJlbWFpbiBwcmVzZW50IGZvciBmdXR1cmUgaW50ZWdyYXRp
b24Kb2sgNTQ4IC0gU3RhZ2UgMTM6IGFsbCBrZXkgUlBDIGRlZmluaXRpb25zIHJlbWFpbiBwcmVz
ZW50IGZvciBmdXR1cmUgaW50ZWdyYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4xNTc5MjgK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZWFkLW9ubHkgcHJlZmxpZ2h0IGNvbnRh
aW5zIG5vIFNRTCBtdXRhdGlvbiBvciBwcml2aWxlZ2UtY2hhbmdpbmcgY29tbWFuZHMKb2sgNTQ5
IC0gcmVhZC1vbmx5IHByZWZsaWdodCBjb250YWlucyBubyBTUUwgbXV0YXRpb24gb3IgcHJpdmls
ZWdlLWNoYW5naW5nIGNvbW1hbmRzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMjc0NTMxCiAgdHlw
ZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZC1vbmx5IHByZWZsaWdodCBlbnVtZXJhdGVz
IHJlcXVpcmVkIHRhYmxlcyBhbmQgYWxsIHNpeCBSUEMgZW50cnlwb2ludHMKb2sgNTUwIC0gcmVh
ZC1vbmx5IHByZWZsaWdodCBlbnVtZXJhdGVzIHJlcXVpcmVkIHRhYmxlcyBhbmQgYWxsIHNpeCBS
UEMgZW50cnlwb2ludHMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNTM4MjEKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiBSUEMgZHJhZnQgcmVtYWlucyBleHBsaWNpdGx5IGJsb2NrZWQg
ZnJvbSBhY2NpZGVudGFsIGRlcGxveW1lbnQKb2sgNTUxIC0gUlBDIGRyYWZ0IHJlbWFpbnMgZXhw
bGljaXRseSBibG9ja2VkIGZyb20gYWNjaWRlbnRhbCBkZXBsb3ltZW50CiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuMTYwMTgxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZC1vbmx5
IGludmVudG9yeSBsaXN0cyBleGFjdGx5IHNpeCBzeW5jIFJQQyBuYW1lcwpvayA1NTIgLSByZWFk
LW9ubHkgaW52ZW50b3J5IGxpc3RzIGV4YWN0bHkgc2l4IHN5bmMgUlBDIG5hbWVzCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuODAzNTIxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogUlBD
IGludmVudG9yeSBjaGVja3MgZWZmZWN0aXZlIGFub24gYW5kIGF1dGhlbnRpY2F0ZWQgRVhFQ1VU
RSByaWdodHMKb2sgNTUzIC0gUlBDIGludmVudG9yeSBjaGVja3MgZWZmZWN0aXZlIGFub24gYW5k
IGF1dGhlbnRpY2F0ZWQgRVhFQ1VURSByaWdodHMKICAtLS0KICBkdXJhdGlvbl9tczogMC4xNjUz
NDkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBSUEMgaW52ZW50b3J5IHJlY29yZHMg
c2VjdXJpdHkgZGVmaW5lciBzdGF0dXMgd2l0aG91dCB3cml0aW5nCm9rIDU1NCAtIFJQQyBpbnZl
bnRvcnkgcmVjb3JkcyBzZWN1cml0eSBkZWZpbmVyIHN0YXR1cyB3aXRob3V0IHdyaXRpbmcKICAt
LS0KICBkdXJhdGlvbl9tczogMC4zNTUxNzUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0
OiBSUEMgaW52ZW50b3J5IGluY2x1ZGVzIGFsbCBzaXggc3luYyBlbnRyeSBwb2ludHMKb2sgNTU1
IC0gUlBDIGludmVudG9yeSBpbmNsdWRlcyBhbGwgc2l4IHN5bmMgZW50cnkgcG9pbnRzCiAgLS0t
CiAgZHVyYXRpb25fbXM6IDAuNzQ1MzkzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDog
UlBDIGludmVudG9yeSByZXBvcnRzIGFub255bW91cyBhbmQgYXV0aGVudGljYXRlZCBleGVjdXRl
IHByaXZpbGVnZXMKb2sgNTU2IC0gUlBDIGludmVudG9yeSByZXBvcnRzIGFub255bW91cyBhbmQg
YXV0aGVudGljYXRlZCBleGVjdXRlIHByaXZpbGVnZXMKICAtLS0KICBkdXJhdGlvbl9tczogMC4x
MjE1NzQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBSUEMgaW52ZW50b3J5IGlkZW50
aWZpZXMgU0VDVVJJVFkgREVGSU5FUiBzdGF0dXMgYW5kIGV4YWN0IHNpZ25hdHVyZXMKb2sgNTU3
IC0gUlBDIGludmVudG9yeSBpZGVudGlmaWVzIFNFQ1VSSVRZIERFRklORVIgc3RhdHVzIGFuZCBl
eGFjdCBzaWduYXR1cmVzCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTU0NTAzCiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogd3JpdGVyIGNvbW1pdCBiaW5kcyB0b2tlbiwgZ2VuZXJhdGlv
biwgYXV0aCBzZXNzaW9uIGFuZCBnYW1lIHdyaXRlciBsZWFzZQpvayA1NTggLSB3cml0ZXIgY29t
bWl0IGJpbmRzIHRva2VuLCBnZW5lcmF0aW9uLCBhdXRoIHNlc3Npb24gYW5kIGdhbWUgd3JpdGVy
IGxlYXNlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMDUyMDI2CiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogY29tbWl0IHJlamVjdHMgZGlzcGxhY2VkIGxvZ2luIGV2ZW4gYWZ0ZXIgbmV3
ZXIgYXV0aCBzZXNzaW9uIGRpc2FwcGVhcnMKb2sgNTU5IC0gY29tbWl0IHJlamVjdHMgZGlzcGxh
Y2VkIGxvZ2luIGV2ZW4gYWZ0ZXIgbmV3ZXIgYXV0aCBzZXNzaW9uIGRpc2FwcGVhcnMKICAtLS0K
ICBkdXJhdGlvbl9tczogMC4yMzk5MjIKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBs
ZWFzZSBzdGF0dXMgcmVmdXNlcyByZXZva2VkIGFuZCBkaXNwbGFjZWQgc2Vzc2lvbnMKb2sgNTYw
IC0gbGVhc2Ugc3RhdHVzIHJlZnVzZXMgcmV2b2tlZCBhbmQgZGlzcGxhY2VkIHNlc3Npb25zCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMTc3MzU3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogY29tbWl0IHNlcmlhbGl6ZXMgb3duZXIgYmVmb3JlIGxvY2tpbmcgY3VycmVudCBnYW1lCm9r
IDU2MSAtIGNvbW1pdCBzZXJpYWxpemVzIG93bmVyIGJlZm9yZSBsb2NraW5nIGN1cnJlbnQgZ2Ft
ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjcyOTc5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogY29tbWl0IHZhbGlkYXRlcyB3cml0ZXIgbGVhc2UgYW5kIHJldmlzaW9uIGJlZm9yZSBj
aGFuZ2luZyBnYW1lIGRhdGEKb2sgNTYyIC0gY29tbWl0IHZhbGlkYXRlcyB3cml0ZXIgbGVhc2Ug
YW5kIHJldmlzaW9uIGJlZm9yZSBjaGFuZ2luZyBnYW1lIGRhdGEKICAtLS0KICBkdXJhdGlvbl9t
czogMC4xMTc5NDgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjb21taXQgcmVqZWN0
cyBzdGFsZSByZXZpc2lvbnMgYW5kIHJlY29yZHMgY29uZmxpY3RzIHdpdGhvdXQgb3ZlcndyaXRp
bmcgc2NvcmUKb2sgNTYzIC0gY29tbWl0IHJlamVjdHMgc3RhbGUgcmV2aXNpb25zIGFuZCByZWNv
cmRzIGNvbmZsaWN0cyB3aXRob3V0IG92ZXJ3cml0aW5nIHNjb3JlCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuMTE1MjU0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWRtaW4gdW5sb2Nr
IHJlZnVzZXMgdGFyZ2V0IGFkbWluIGFuZCBzZWxmIHVubG9jawpvayA1NjQgLSBhZG1pbiB1bmxv
Y2sgcmVmdXNlcyB0YXJnZXQgYWRtaW4gYW5kIHNlbGYgdW5sb2NrCiAgLS0tCiAgZHVyYXRpb25f
bXM6IDEuMDAxNzcxCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogdW5sb2NrIHNlcmlh
bGl6ZXMgdGFyZ2V0IHdyaXRlciBiaW5kaW5nIGJlZm9yZSBjaGVja2luZyBhbmQgcmV2b2tpbmcK
b2sgNTY1IC0gdW5sb2NrIHNlcmlhbGl6ZXMgdGFyZ2V0IHdyaXRlciBiaW5kaW5nIGJlZm9yZSBj
aGVja2luZyBhbmQgcmV2b2tpbmcKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNTE5OAogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVubG9jayBpcyBmYWlsLWNsb3NlZCBmb3IgYW1iaWd1
b3VzIHdyaXRlciBiaW5kaW5nIGFuZCBkb2VzIG5vdCBkZWxldGUgZ2FtZSBzdGF0ZQpvayA1NjYg
LSB1bmxvY2sgaXMgZmFpbC1jbG9zZWQgZm9yIGFtYmlndW91cyB3cml0ZXIgYmluZGluZyBhbmQg
ZG9lcyBub3QgZGVsZXRlIGdhbWUgc3RhdGUKICAtLS0KICBkdXJhdGlvbl9tczogMC40MTAxMDgK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiB1bmxvY2sgU1FMIGNhbm5vdCBydW4gYWNj
aWRlbnRhbGx5IGFuZCBsYWNrcyBleGVjdXRlIGdyYW50cwpvayA1NjcgLSB1bmxvY2sgU1FMIGNh
bm5vdCBydW4gYWNjaWRlbnRhbGx5IGFuZCBsYWNrcyBleGVjdXRlIGdyYW50cwogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjI4NDI5OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHVubG9j
ayBhbmQgd3JpdGVyLW9wZW4gc2VyaWFsaXplIG9uIHRoZSBzYW1lIGFjY291bnQgcm93Cm9rIDU2
OCAtIHVubG9jayBhbmQgd3JpdGVyLW9wZW4gc2VyaWFsaXplIG9uIHRoZSBzYW1lIGFjY291bnQg
cm93CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuODAwMjY2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMg
U3VidGVzdDogdW5sb2NrIHByZXNlcnZlcyBhdXRoIGxvZ2luIGhpZ2gtd2F0ZXIgY2hlY2tlZCBi
eSBvcGVuIGFuZCBjb21taXQKb2sgNTY5IC0gdW5sb2NrIHByZXNlcnZlcyBhdXRoIGxvZ2luIGhp
Z2gtd2F0ZXIgY2hlY2tlZCBieSBvcGVuIGFuZCBjb21taXQKICAtLS0KICBkdXJhdGlvbl9tczog
MC4yMDczNDMKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiByZXZva2VkIHdyaXRlciBj
YW5ub3QgY29tbWl0IHdpdGhvdXQgYWN0aXZlIHdyaXRlciwgdmFsaWQgdG9rZW4sIGdlbmVyYXRp
b24gYW5kIGF1dGggc2Vzc2lvbgpvayA1NzAgLSByZXZva2VkIHdyaXRlciBjYW5ub3QgY29tbWl0
IHdpdGhvdXQgYWN0aXZlIHdyaXRlciwgdmFsaWQgdG9rZW4sIGdlbmVyYXRpb24gYW5kIGF1dGgg
c2Vzc2lvbgogIC0tLQogIGR1cmF0aW9uX21zOiAwLjU1NzgwMQogIHR5cGU6ICd0ZXN0JwogIC4u
LgojIFN1YnRlc3Q6IGFkbWluIHVubG9jayBoYXMgbm8gcHJvZHVjdGlvbiBncmFudCBhbmQgY2Fu
bm90IG1vZGlmeSBnYW1lIGRhdGEKb2sgNTcxIC0gYWRtaW4gdW5sb2NrIGhhcyBubyBwcm9kdWN0
aW9uIGdyYW50IGFuZCBjYW5ub3QgbW9kaWZ5IGdhbWUgZGF0YQogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjI4MjA3NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGFkbWluIHVubG9jayBy
ZXZva2VzIHdyaXRlciBjcmVkZW50aWFscyBhdG9taWNhbGx5Cm9rIDU3MiAtIGFkbWluIHVubG9j
ayByZXZva2VzIHdyaXRlciBjcmVkZW50aWFscyBhdG9taWNhbGx5CiAgLS0tCiAgZHVyYXRpb25f
bXM6IDAuODM4NTc0CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWRtaW4gdW5sb2Nr
IHByZXNlcnZlcyBzZXNzaW9uIGhpc3RvcnkgZm9yIHN0YWxlLWxvZ2luIHJlamVjdGlvbgpvayA1
NzMgLSBhZG1pbiB1bmxvY2sgcHJlc2VydmVzIHNlc3Npb24gaGlzdG9yeSBmb3Igc3RhbGUtbG9n
aW4gcmVqZWN0aW9uCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjk4MzgKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBydW50aW1lIGdhdGUgcmVtYWlucyBleHBsaWNpdGx5IE5PVCBFWEVD
VVRFRApvayA1NzQgLSBydW50aW1lIGdhdGUgcmVtYWlucyBleHBsaWNpdGx5IE5PVCBFWEVDVVRF
RAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjcyODU5OAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IHJ1bnRpbWUgZ2F0ZSByZXF1aXJlcyBkaXNwb3NhYmxlIGRhdGFiYXNlIGFuZCBhdXRo
LXNlc3Npb24gZml4dHVyZXMKb2sgNTc1IC0gcnVudGltZSBnYXRlIHJlcXVpcmVzIGRpc3Bvc2Fi
bGUgZGF0YWJhc2UgYW5kIGF1dGgtc2Vzc2lvbiBmaXh0dXJlcwogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjEzODg5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogdW5sb2NrIGF1ZGl0IGlz
IGFwcGVuZC1vbmx5IGFuZCBwcmVzZXJ2ZXMgZ2FtZSBzdGF0ZQpvayA1NzYgLSB1bmxvY2sgYXVk
aXQgaXMgYXBwZW5kLW9ubHkgYW5kIHByZXNlcnZlcyBnYW1lIHN0YXRlCiAgLS0tCiAgZHVyYXRp
b25fbXM6IDAuMzM3NDU4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogdW5sb2NrIGFu
ZCBSUEMgZHJhZnRzIHJlbWFpbiBpbnRlbnRpb25hbGx5IGJsb2NrZWQKb2sgNTc3IC0gdW5sb2Nr
IGFuZCBSUEMgZHJhZnRzIHJlbWFpbiBpbnRlbnRpb25hbGx5IGJsb2NrZWQKICAtLS0KICBkdXJh
dGlvbl9tczogMC4xNzI2NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IGluc3RhbGwg
Y2FuZGlkYXRlIHJlbWFpbnMgZmFpbC1jbG9zZWQgdW50aWwgbGl2ZSBQb3N0Z3JlU1FMIHZlcmlm
aWNhdGlvbgpvayA1NzggLSBpbnN0YWxsIGNhbmRpZGF0ZSByZW1haW5zIGZhaWwtY2xvc2VkIHVu
dGlsIGxpdmUgUG9zdGdyZVNRTCB2ZXJpZmljYXRpb24KICAtLS0KICBkdXJhdGlvbl9tczogMS4y
MjMzOTQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBtYWhqb25nX3N5bmNfb3Blbjog
aW52b2tlciBjYW5ub3QgdXNlIGFub255bW91cyByb2xlCm9rIDU3OSAtIG1haGpvbmdfc3luY19v
cGVuOiBpbnZva2VyIGNhbm5vdCB1c2UgYW5vbnltb3VzIHJvbGUKICAtLS0KICBkdXJhdGlvbl9t
czogMC4yNzcxOTgKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBtYWhqb25nX3N5bmNf
b3Blbjogc2VjdXJpdHkgZGVmaW5lciBoYXMgZW1wdHkgc2VhcmNoIHBhdGgKb2sgNTgwIC0gbWFo
am9uZ19zeW5jX29wZW46IHNlY3VyaXR5IGRlZmluZXIgaGFzIGVtcHR5IHNlYXJjaCBwYXRoCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDEuMDIzNDUzCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogbWFoam9uZ19zeW5jX2NvbW1pdDogaW52b2tlciBjYW5ub3QgdXNlIGFub255bW91cyByb2xl
Cm9rIDU4MSAtIG1haGpvbmdfc3luY19jb21taXQ6IGludm9rZXIgY2Fubm90IHVzZSBhbm9ueW1v
dXMgcm9sZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjEzODkxCiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogbWFoam9uZ19zeW5jX2NvbW1pdDogc2VjdXJpdHkgZGVmaW5lciBoYXMgZW1w
dHkgc2VhcmNoIHBhdGgKb2sgNTgyIC0gbWFoam9uZ19zeW5jX2NvbW1pdDogc2VjdXJpdHkgZGVm
aW5lciBoYXMgZW1wdHkgc2VhcmNoIHBhdGgKICAtLS0KICBkdXJhdGlvbl9tczogMC4yMDgyMzQK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBtYWhqb25nX3N5bmNfb3Blbl9yZWFkZXI6
IGludm9rZXIgY2Fubm90IHVzZSBhbm9ueW1vdXMgcm9sZQpvayA1ODMgLSBtYWhqb25nX3N5bmNf
b3Blbl9yZWFkZXI6IGludm9rZXIgY2Fubm90IHVzZSBhbm9ueW1vdXMgcm9sZQogIC0tLQogIGR1
cmF0aW9uX21zOiAwLjE1MTU0OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG1haGpv
bmdfc3luY19vcGVuX3JlYWRlcjogc2VjdXJpdHkgZGVmaW5lciBoYXMgZW1wdHkgc2VhcmNoIHBh
dGgKb2sgNTg0IC0gbWFoam9uZ19zeW5jX29wZW5fcmVhZGVyOiBzZWN1cml0eSBkZWZpbmVyIGhh
cyBlbXB0eSBzZWFyY2ggcGF0aAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE3OTc4MQogIHR5cGU6
ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG1haGpvbmdfc3luY19yZWFkOiBpbnZva2VyIGNhbm5v
dCB1c2UgYW5vbnltb3VzIHJvbGUKb2sgNTg1IC0gbWFoam9uZ19zeW5jX3JlYWQ6IGludm9rZXIg
Y2Fubm90IHVzZSBhbm9ueW1vdXMgcm9sZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjExNTA4NAog
IHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG1haGpvbmdfc3luY19yZWFkOiBzZWN1cml0
eSBkZWZpbmVyIGhhcyBlbXB0eSBzZWFyY2ggcGF0aApvayA1ODYgLSBtYWhqb25nX3N5bmNfcmVh
ZDogc2VjdXJpdHkgZGVmaW5lciBoYXMgZW1wdHkgc2VhcmNoIHBhdGgKICAtLS0KICBkdXJhdGlv
bl9tczogMC4zNTQxNjQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBtYWhqb25nX3N5
bmNfbGVhc2Vfc3RhdHVzOiBpbnZva2VyIGNhbm5vdCB1c2UgYW5vbnltb3VzIHJvbGUKb2sgNTg3
IC0gbWFoam9uZ19zeW5jX2xlYXNlX3N0YXR1czogaW52b2tlciBjYW5ub3QgdXNlIGFub255bW91
cyByb2xlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNDAwOTk1CiAgdHlwZTogJ3Rlc3QnCiAgLi4u
CiMgU3VidGVzdDogbWFoam9uZ19zeW5jX2xlYXNlX3N0YXR1czogc2VjdXJpdHkgZGVmaW5lciBo
YXMgZW1wdHkgc2VhcmNoIHBhdGgKb2sgNTg4IC0gbWFoam9uZ19zeW5jX2xlYXNlX3N0YXR1czog
c2VjdXJpdHkgZGVmaW5lciBoYXMgZW1wdHkgc2VhcmNoIHBhdGgKICAtLS0KICBkdXJhdGlvbl9t
czogMC4xNzE4NzkKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBvcGVuIG1pc21hdGNo
IGRvZXMgbm90IHJldHVybiBjbG91ZCBzbmFwc2hvdApvayA1ODkgLSBvcGVuIG1pc21hdGNoIGRv
ZXMgbm90IHJldHVybiBjbG91ZCBzbmFwc2hvdAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjIzODQ0
OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IG9wZW4gbWFwcyBkZXZpY2UgYW5kIGdh
bWUgdG8gbmFtZWQgUlBDIGFyZ3VtZW50cwpvayA1OTAgLSBvcGVuIG1hcHMgZGV2aWNlIGFuZCBn
YW1lIHRvIG5hbWVkIFJQQyBhcmd1bWVudHMKICAtLS0KICBkdXJhdGlvbl9tczogMS43NDYxMzIK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjb21taXQgbWFwcyBnZW5lcmF0aW9uIHRv
a2VuIHJldmlzaW9uIGFuZCBnYW1lIGV4YWN0bHkKb2sgNTkxIC0gY29tbWl0IG1hcHMgZ2VuZXJh
dGlvbiB0b2tlbiByZXZpc2lvbiBhbmQgZ2FtZSBleGFjdGx5CiAgLS0tCiAgZHVyYXRpb25fbXM6
IDAuNTEwNDA5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcGVybWlzc2lvbiBlcnJv
ciByZXRhaW5zIFN1cGFiYXNlIGNvZGUKb2sgNTkyIC0gcGVybWlzc2lvbiBlcnJvciByZXRhaW5z
IFN1cGFiYXNlIGNvZGUKICAtLS0KICBkdXJhdGlvbl9tczogMS4xMzUzNTIKICB0eXBlOiAndGVz
dCcKICAuLi4KIyBTdWJ0ZXN0OiBtYWxmb3JtZWQgc2VydmVyIHJlc3BvbnNlIGlzIHJlamVjdGVk
Cm9rIDU5MyAtIG1hbGZvcm1lZCBzZXJ2ZXIgcmVzcG9uc2UgaXMgcmVqZWN0ZWQKICAtLS0KICBk
dXJhdGlvbl9tczogMC4xNzY0NjYKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBubyBu
ZXR3b3JrIHJlcXVlc3Qgb24gbWlzc2luZyBjb21taXQgY3JlZGVudGlhbHMKb2sgNTk0IC0gbm8g
bmV0d29yayByZXF1ZXN0IG9uIG1pc3NpbmcgY29tbWl0IGNyZWRlbnRpYWxzCiAgLS0tCiAgZHVy
YXRpb25fbXM6IDAuMjQ5Mjk2CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogb3BlbiBz
bmFwc2hvdHMgZ2FtZSBiZWZvcmUgYXN5bmNocm9ub3VzIHRyYW5zcG9ydCB1c2VzIGl0Cm9rIDU5
NSAtIG9wZW4gc25hcHNob3RzIGdhbWUgYmVmb3JlIGFzeW5jaHJvbm91cyB0cmFuc3BvcnQgdXNl
cyBpdAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE5MTg1OQogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IGNvbW1pdCBzbmFwc2hvdHMgZ2FtZSBhbmQgcmVmdXNlcyBub24tb2JqZWN0IHBh
eWxvYWQgYmVmb3JlIG5ldHdvcmsgY2FsbApvayA1OTYgLSBjb21taXQgc25hcHNob3RzIGdhbWUg
YW5kIHJlZnVzZXMgbm9uLW9iamVjdCBwYXlsb2FkIGJlZm9yZSBuZXR3b3JrIGNhbGwKICAtLS0K
ICBkdXJhdGlvbl9tczogMC4yNTI3NTEKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBj
bG91ZCBhZG9wdGlvbiByZXF1aXJlcyBtYXRjaGluZyBnYW1lIGlkZW50aXR5IGFuZCByZXZpc2lv
biBiZWZvcmUgUlBDCm9rIDU5NyAtIGNsb3VkIGFkb3B0aW9uIHJlcXVpcmVzIG1hdGNoaW5nIGdh
bWUgaWRlbnRpdHkgYW5kIHJldmlzaW9uIGJlZm9yZSBSUEMKICAtLS0KICBkdXJhdGlvbl9tczog
MC4xNjg3MDQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBjbG91ZCBhZG9wdGlvbiBm
b3J3YXJkcyBib3RoIGV4cGVjdGVkIGdhbWUgaWRlbnRpdHkgYW5kIHJldmlzaW9uCm9rIDU5OCAt
IGNsb3VkIGFkb3B0aW9uIGZvcndhcmRzIGJvdGggZXhwZWN0ZWQgZ2FtZSBpZGVudGl0eSBhbmQg
cmV2aXNpb24KICAtLS0KICBkdXJhdGlvbl9tczogMC4zMzYyMzcKICB0eXBlOiAndGVzdCcKICAu
Li4KIyBTdWJ0ZXN0OiByZWFkLW9ubHkgc2Vzc2lvbiBmZXRjaCBtYXBzIGRldmljZSBJRCB0byBt
YWhqb25nX3N5bmNfcmVhZApvayA1OTkgLSByZWFkLW9ubHkgc2Vzc2lvbiBmZXRjaCBtYXBzIGRl
dmljZSBJRCB0byBtYWhqb25nX3N5bmNfcmVhZAogIC0tLQogIGR1cmF0aW9uX21zOiAwLjM2NTE5
MQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHJlYWQgcmVmdXNlcyBhYnNlbnQgZGV2
aWNlIElEIGJlZm9yZSBuZXR3b3JrIGFjY2VzcwpvayA2MDAgLSByZWFkIHJlZnVzZXMgYWJzZW50
IGRldmljZSBJRCBiZWZvcmUgbmV0d29yayBhY2Nlc3MKICAtLS0KICBkdXJhdGlvbl9tczogMC4x
OTUwNzQKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBsZWFzZSBwcm9iZSBtYXBzIGlk
ZW50aXR5IGFuZCBnZW5lcmF0aW9uIHdpdGhvdXQgd3JpdGVyIGNyZWRlbnRpYWxzCm9rIDYwMSAt
IGxlYXNlIHByb2JlIG1hcHMgaWRlbnRpdHkgYW5kIGdlbmVyYXRpb24gd2l0aG91dCB3cml0ZXIg
Y3JlZGVudGlhbHMKICAtLS0KICBkdXJhdGlvbl9tczogMC4yNTM3NjMKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiBsZWFzZSBwcm9iZSByZWplY3RzIG1hbGZvcm1lZCBnZW5lcmF0aW9u
IGJlZm9yZSBSUEMKb2sgNjAyIC0gbGVhc2UgcHJvYmUgcmVqZWN0cyBtYWxmb3JtZWQgZ2VuZXJh
dGlvbiBiZWZvcmUgUlBDCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTgxNDU0CiAgdHlwZTogJ3Rl
c3QnCiAgLi4uCiMgU3VidGVzdDogcmVqZWN0IG5lc3RlZCBvYmplY3QgdG9KU09OIGJlZm9yZSBh
bnkgY2xvdWQgUlBDCm9rIDYwMyAtIHJlamVjdCBuZXN0ZWQgb2JqZWN0IHRvSlNPTiBiZWZvcmUg
YW55IGNsb3VkIFJQQwogIC0tLQogIGR1cmF0aW9uX21zOiAwLjE4OTA2NQogIHR5cGU6ICd0ZXN0
JwogIC4uLgojIFN1YnRlc3Q6IHJlamVjdCBuZXN0ZWQgYXJyYXkgdG9KU09OIGJlZm9yZSBhbnkg
Y2xvdWQgUlBDCm9rIDYwNCAtIHJlamVjdCBuZXN0ZWQgYXJyYXkgdG9KU09OIGJlZm9yZSBhbnkg
Y2xvdWQgUlBDCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMTQyOTg2CiAgdHlwZTogJ3Rlc3QnCiAg
Li4uCiMgU3VidGVzdDogcmVqZWN0IGluaGVyaXRlZCBuZXN0ZWQgc2VyaWFsaXplciB0b0pTT04g
YmVmb3JlIGFueSBjbG91ZCBSUEMKb2sgNjA1IC0gcmVqZWN0IGluaGVyaXRlZCBuZXN0ZWQgc2Vy
aWFsaXplciB0b0pTT04gYmVmb3JlIGFueSBjbG91ZCBSUEMKICAtLS0KICBkdXJhdGlvbl9tczog
MC4xNDg4NTUKICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzZXJ2ZXIgY2hlY2tzIGNs
b3VkIG1pc21hdGNoIGJlZm9yZSByZXZva2luZyBwcmV2aW91cyB3cml0ZXIKb2sgNjA2IC0gc2Vy
dmVyIGNoZWNrcyBjbG91ZCBtaXNtYXRjaCBiZWZvcmUgcmV2b2tpbmcgcHJldmlvdXMgd3JpdGVy
CiAgLS0tCiAgZHVyYXRpb25fbXM6IDEuMTk2MDczCiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3Vi
dGVzdDogdW5zYWZlIGRyYWZ0IHJlbWFpbnMgYmxvY2tlZCBmcm9tIHByb2R1Y3Rpb24gZGVwbG95
bWVudApvayA2MDcgLSB1bnNhZmUgZHJhZnQgcmVtYWlucyBibG9ja2VkIGZyb20gcHJvZHVjdGlv
biBkZXBsb3ltZW50CiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuMjI1NzkKICB0eXBlOiAndGVzdCcK
ICAuLi4KIyBTdWJ0ZXN0OiB3cml0ZXIgdGFrZW92ZXIgaW52YWxpZGF0ZXMgZGlzcGxhY2VkIGRl
dmljZSBjcmVkZW50aWFsIGhhc2hlcwpvayA2MDggLSB3cml0ZXIgdGFrZW92ZXIgaW52YWxpZGF0
ZXMgZGlzcGxhY2VkIGRldmljZSBjcmVkZW50aWFsIGhhc2hlcwogIC0tLQogIGR1cmF0aW9uX21z
OiAwLjkxNTU3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogcmVhZC1vbmx5IGVucm9s
bG1lbnQgbmV2ZXIgcmVjZWl2ZXMgYSB3cml0ZXIgY3JlZGVudGlhbApvayA2MDkgLSByZWFkLW9u
bHkgZW5yb2xsbWVudCBuZXZlciByZWNlaXZlcyBhIHdyaXRlciBjcmVkZW50aWFsCiAgLS0tCiAg
ZHVyYXRpb25fbXM6IDAuMTQ1NDU5CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogYWRh
cHRlciBhbmQgZW5naW5lIHBlcmZvcm0gb3Blbiwgc2NvcmUgY29tbWl0LCByZXZpc2lvbiBpbmNy
ZW1lbnQKb2sgNjEwIC0gYWRhcHRlciBhbmQgZW5naW5lIHBlcmZvcm0gb3Blbiwgc2NvcmUgY29t
bWl0LCByZXZpc2lvbiBpbmNyZW1lbnQKICAtLS0KICBkdXJhdGlvbl9tczogNC42NTA5NTEKICB0
eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBkZXZpY2UgdGFrZW92ZXIgcmV2b2tlcyBwcmV2
aW91cyB3cml0ZXIgYW5kIHByZXNlcnZlcyBpdHMgdW5jb21taXR0ZWQgc2NvcmUKb2sgNjExIC0g
ZGV2aWNlIHRha2VvdmVyIHJldm9rZXMgcHJldmlvdXMgd3JpdGVyIGFuZCBwcmVzZXJ2ZXMgaXRz
IHVuY29tbWl0dGVkIHNjb3JlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDIuMzQyMTgxCiAgdHlwZTog
J3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogbmV3IGRldmljZSB3aXRoIGRpZmZlcmVudCBsb2NhbCBn
YW1lIGFkb3B0cyBhdXRob3JpdGF0aXZlIGNsb3VkIGFuZCByZXRhaW5zIGJhY2t1cApvayA2MTIg
LSBuZXcgZGV2aWNlIHdpdGggZGlmZmVyZW50IGxvY2FsIGdhbWUgYWRvcHRzIGF1dGhvcml0YXRp
dmUgY2xvdWQgYW5kIHJldGFpbnMgYmFja3VwCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuOTMyMjQ1
CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogc3luYyBvcGVuIHJlamVjdHMgdW5zYWZl
IGludGVnZXIgaW4gbmVzdGVkIHNjb3JlIHdpdGhvdXQgUlBDCm9rIDYxMyAtIHN5bmMgb3BlbiBy
ZWplY3RzIHVuc2FmZSBpbnRlZ2VyIGluIG5lc3RlZCBzY29yZSB3aXRob3V0IFJQQwogIC0tLQog
IGR1cmF0aW9uX21zOiAyLjI5NDE0OQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IHN5
bmMgY29tbWl0IHJlamVjdHMgdW5zYWZlIG5lZ2F0aXZlIGludGVnZXIgaW4gaGlzdG9yeSB3aXRo
b3V0IFJQQwpvayA2MTQgLSBzeW5jIGNvbW1pdCByZWplY3RzIHVuc2FmZSBuZWdhdGl2ZSBpbnRl
Z2VyIGluIGhpc3Rvcnkgd2l0aG91dCBSUEMKICAtLS0KICBkdXJhdGlvbl9tczogMC40NjU3NjMK
ICB0eXBlOiAndGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBzeW5jIG9wZW4gcHJlc2VydmVzIHNhZmUg
aW50ZWdlciBib3VuZGFyeSBhbmQgZnJhY3Rpb25hbCB2YWx1ZXMKb2sgNjE1IC0gc3luYyBvcGVu
IHByZXNlcnZlcyBzYWZlIGludGVnZXIgYm91bmRhcnkgYW5kIGZyYWN0aW9uYWwgdmFsdWVzCiAg
LS0tCiAgZHVyYXRpb25fbXM6IDAuMzYxNjQ1CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVz
dDogVW5kbyByZXN0b3JlcyBzY29yZXMsIGRlYWxlciwgcm91bmQsIGFuZCB3aW5kcyBhbmQga2Vl
cHMgb2xkZXIgaGlzdG9yeQpvayA2MTYgLSBVbmRvIHJlc3RvcmVzIHNjb3JlcywgZGVhbGVyLCBy
b3VuZCwgYW5kIHdpbmRzIGFuZCBrZWVwcyBvbGRlciBoaXN0b3J5CiAgLS0tCiAgZHVyYXRpb25f
bXM6IDIuMjkzMjA3CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogVW5kbyBmYWlsZWQg
c2F2ZSByZXN0b3JlcyBlbnRpcmUgc3RhdGUKb2sgNjE3IC0gVW5kbyBmYWlsZWQgc2F2ZSByZXN0
b3JlcyBlbnRpcmUgc3RhdGUKICAtLS0KICBkdXJhdGlvbl9tczogMC43MzAyMDEKICB0eXBlOiAn
dGVzdCcKICAuLi4KIyBTdWJ0ZXN0OiBVbmRvIG1pc3NpbmcgYmVmb3JlIGRvZXMgbm90IGNoYW5n
ZSBzdGF0ZQpvayA2MTggLSBVbmRvIG1pc3NpbmcgYmVmb3JlIGRvZXMgbm90IGNoYW5nZSBzdGF0
ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjUzMzE1NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1
YnRlc3Q6IFVuZG8gbWFsZm9ybWVkIGJlZm9yZSBkb2VzIG5vdCBjaGFuZ2Ugc3RhdGUKb2sgNjE5
IC0gVW5kbyBtYWxmb3JtZWQgYmVmb3JlIGRvZXMgbm90IGNoYW5nZSBzdGF0ZQogIC0tLQogIGR1
cmF0aW9uX21zOiAxLjIyOTY3NAogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFN1YnRlc3Q6IFVuZG8g
bWlzc2luZyBkZWFsZXIgZG9lcyBub3QgY2hhbmdlIHN0YXRlCm9rIDYyMCAtIFVuZG8gbWlzc2lu
ZyBkZWFsZXIgZG9lcyBub3QgY2hhbmdlIHN0YXRlCiAgLS0tCiAgZHVyYXRpb25fbXM6IDAuNjA4
NzU4CiAgdHlwZTogJ3Rlc3QnCiAgLi4uCiMgU3VidGVzdDogVW5kbyBub3QgcmVhZHkgZG9lcyBu
b3QgY2hhbmdlIHN0YXRlCm9rIDYyMSAtIFVuZG8gbm90IHJlYWR5IGRvZXMgbm90IGNoYW5nZSBz
dGF0ZQogIC0tLQogIGR1cmF0aW9uX21zOiAwLjU0NTU4MwogIHR5cGU6ICd0ZXN0JwogIC4uLgoj
IFN1YnRlc3Q6IFVuZG8gZW1wdHkgaGlzdG9yeSBkb2VzIG5vdCBjaGFuZ2Ugc3RhdGUKb2sgNjIy
IC0gVW5kbyBlbXB0eSBoaXN0b3J5IGRvZXMgbm90IGNoYW5nZSBzdGF0ZQogIC0tLQogIGR1cmF0
aW9uX21zOiAwLjU4MDI1NQogIHR5cGU6ICd0ZXN0JwogIC4uLgojIFBBU1M6IDI5IGJhc2VsaW5l
IGNhc2VzICsgY29uZmlybWVkIGZpeHR1cmVzCiMgU3VidGVzdDogdGVzdHMvdm9pY2UtcGFyc2Vy
LnRlc3QuY2pzCm9rIDEyOSAtIHRlc3RzL3ZvaWNlLXBhcnNlci50ZXN0LmNqcwogIC0tLQogIGR1
cmF0aW9uX21zOiA3Ni4wNzE5NAogIHR5cGU6ICd0ZXN0JwogIC4uLgoxLi42MjMKIyB0ZXN0cyA2
MjMKIyBzdWl0ZXMgMAojIHBhc3MgNjIzCiMgZmFpbCAwCiMgY2FuY2VsbGVkIDAKIyBza2lwcGVk
IDAKIyB0b2RvIDAKIyBkdXJhdGlvbl9tcyAyNDAwLjE2OTUxNAo=
```

### ARCHIVED FILE: STAGE21_LOCAL_LOGOUT_FIX.md | SHA256 55427c4d75ef13f10cd5fca0882cbd4bd1f6467f0da517270f47af5a4c1d47b4

```base64
IyBTdGFnZSAyMSDigJQgTG9jYWwgbG9nb3V0IGlzb2xhdGlvbiAoMTMgT2N0b2JlciAyMDI2KQoK
LSBDaGFuZ2VkIGBpbmRleC5odG1sYCBgbG9nb3V0TWFoam9uZygpYCB0byBjYWxsIGBtYWhqb25n
U3VwYWJhc2UuYXV0aC5zaWduT3V0KHtzY29wZTonbG9jYWwnfSlgIGV4cGxpY2l0bHkuCi0gVGhp
cyBwcmV2ZW50cyBpbnRlbnRpb25hbCBnbG9iYWwgU3VwYWJhc2Ugc2lnbi1vdXQgZnJvbSByZXZv
a2luZyBvdGhlciBicm93c2VyIHJlZnJlc2ggc2Vzc2lvbnMuIEl0IGRvZXMgKipub3QqKiBpbXBs
ZW1lbnQgc2luZ2xlLWRldmljZSBlbmZvcmNlbWVudCwgc2Vzc2lvbiB0YWtlb3Zlciwgb3Igc2Vy
dmVyLXNpZGUgd3JpdGVyIHJldm9jYXRpb24uCi0gYHByZXZpZXdfdGVzdC5odG1sYCByZW1haW5z
IGFuIGluZGVwZW5kZW50IHByZXZpZXcgZml4dHVyZSwgbm90IGNoYW5nZWQuCi0gQ2xvdWQgU3lu
YyBzYWZldHkgZ2F0ZSByZW1haW5zIE9GRjsgRE8gTk9UIERFUExPWSBwZW5kaW5nIHR3by1icm93
c2VyIG1hbnVhbCBhY2NlcHRhbmNlIGFuZCBzZXJ2ZXItc2lkZSBlbmZvcmNlbWVudC4KLSBMb2Nh
bCBjb21tYW5kOiBgbm9kZSAtLXRlc3QgdGVzdHMvKi50ZXN0LmNqc2AgLT4gNjIzIFBBU1MsIDAg
RkFJTC4KLSBNYW51YWwgY2hlY2tzIHJlcXVpcmVkOiBsb2dpbiBzYW1lIHNjb3Jla2VlcGVyIENo
cm9tZS9GaXJlZm94OyBsb2dvdXQgQ2hyb21lOyBGaXJlZm94IHJlbWFpbnMgYXV0aGVudGljYXRl
ZDsgdGVzdCByZXZlcnNlIGRpcmVjdGlvbjsgdmVyaWZ5IG9sZC1kZXZpY2Ugd3JpdGVyIHJldm9j
YXRpb24gc2VwYXJhdGVseSBhZnRlciBzZXJ2ZXItc2lkZSBpbnRlZ3JhdGlvbi4KCkdpdEh1YiBE
ZXNrdG9wIFN1bW1hcnk6IGBTdGFnZSAyMTogU2NvcGUgbG9nb3V0IHRvIGN1cnJlbnQgYnJvd3Nl
cmAKR2l0SHViIERlc2t0b3AgRGVzY3JpcHRpb246IGBVc2UgZXhwbGljaXQgU3VwYWJhc2UgbG9j
YWwgc2lnbi1vdXQgaW4gcHJvZHVjdGlvbiBhcHAgdG8gYXZvaWQgY3Jvc3MtYnJvd3NlciBnbG9i
YWwgbG9nb3V0LiA2MjMgbG9jYWwgdGVzdHMgcGFzcy4gQ2xvdWQgU3luYyByZW1haW5zIGRpc2Fi
bGVkOyBhdXRvbWF0aWMgdGFrZW92ZXIgc3RpbGwgcGVuZGluZy5gCg==
```

### ARCHIVED FILE: STAGE21_SESSION_TRANSFER_AUDIT.md | SHA256 df7dbadb6d77285429d5c185d9e23c790c634cbdda95913442dedb1448914e80

```base64
IyBTdGFnZSAyMSDigJQgQXVkaXQgYXdhbCBzZXNpIGxpbnRhcy1icm93c2VyICgxMyBPa3RvYmVy
IDIwMjYpCgpTdW1iZXI6IFpJUCBwZW5nZ3VuYSBtYWhqb25nLXNjb3JlLW1haW4oNykuemlwLiBU
aWRhayBhZGEgcGVydWJhaGFuIHJ1bnRpbWUsIFNRTCwgRWRnZSBGdW5jdGlvbiwgYXRhdSBkZXBs
b3ltZW50LgoKIyMgQnVrdGkga29kZQotIGluZGV4Lmh0bWw6MjMwMyBgbG9nb3V0TWFoam9uZygp
YCBtZW1ha2FpIGBtYWhqb25nU3VwYWJhc2UuYXV0aC5zaWduT3V0KClgIHRhbnBhIHNjb3BlLiBT
dXBhYmFzZSBBdXRoIHNpZ25PdXQgZGVmYXVsdCBtZW5nZ3VuYWthbiBnbG9iYWwgc2NvcGUgc2Vo
aW5nZ2Egc2VzaSByZWZyZXNoIGxpbnRhcy1icm93c2VyIGRhcGF0IGRpY2FidXQ7IGluaSBrb25z
aXN0ZW4gZGVuZ2FuIG9ic2VydmFzaSBsb2dvdXQgQ2hyb21lIGJlcnBlbmdhcnVoIHBhZGEgRmly
ZWZveC4gUGVybHUgdmFsaWRhc2kgcnVudGltZSBrYXJlbmEgYWNjZXNzIHRva2VuIHlhbmcgc3Vk
YWggdGVyYml0IGRhcGF0IHRldGFwIHZhbGlkIHNhbXBhaSBleHBpcnkuCi0gaW5kZXguaHRtbDoy
MTc1IGBNQUhKT05HX0NMT1VEX1NZTkNfRU5BQkxFRD1mYWxzZWAsIHNlaGluZ2dhIGBzY2hlZHVs
ZU1haGpvbmdDbG91ZEF1dGgoKWAgcGFkYSBiYXJpcyB+MjIzMCB0aWRhayBtZW5nYWt0aWZrYW4g
YnJpZGdlLiBBdXRvbWF0aWMgU2Vzc2lvbiBUcmFuc2ZlciBiZWx1bSBiZXJqYWxhbiBwYWRhIGFw
bGlrYXNpIHNhYXQgaW5pLgotIGluZGV4Lmh0bWw6MjI0OCBsaXN0ZW5lciBhdXRoIGhhbnlhIG1l
bmVyYXBrYW4gZXZlbnQgU0lHTkVEX0lOL1RPS0VOX1JFRlJFU0hFRDsgdGlkYWsgYWRhIHBlbWVy
aWtzYWFuIG93bmVyc2hpcCBwZXJhbmdrYXQgc2FhdCBsb2dpbiBkYWxhbSBqYWx1ciBhcGxpa2Fz
aSBha3RpZi4KLSBzdXBhYmFzZS9mdW5jdGlvbnMvbWFoam9uZy11c2VyLWFkbWluL2luZGV4LnRz
Ojc34oCTODEgdG9nZ2xlIG11bHRpLWRldmljZSBtZW5ndWJhaCBhcHBfbWV0YWRhdGE7IGluaSBi
dWthbiBlbmZvcmNlbWVudCBzZXNpIHNhYXQgc2lnbi1pbi4KCiMjIFRlbXVhbgoxLiBMb2dvdXQg
bGludGFzLWJyb3dzZXI6IG1la2FuaXNtZSBkZWZhdWx0IHNpZ25PdXQgZ2xvYmFsIGtlbXVuZ2tp
bmFuIHBlbnllYmFiIHV0YW1hLCBiZWx1bSBkaWJ1a3Rpa2FuIGRhcmkgbG9nIFN1cGFiYXNlLgoy
LiBMb2dpbiBwZXJhbmdrYXQga2VkdWEgdGlkYWsgb3RvbWF0aXMgbWVub25ha3RpZmthbiBwZXJh
bmdrYXQgcGVydGFtYSBrYXJlbmEgY2xvdWQgYWN0aXZhdGlvbiBkaWdhdGUgT0ZGLgozLiBNZW5n
dWJhaCBsb2dvdXQgbWVuamFkaSBsb2NhbCBzYWphIHRpZGFrIGN1a3VwIHVudHVrIHNpbmdsZS1k
ZXZpY2UgZW5mb3JjZW1lbnQ7IHBlcmx1IHNlcnZlci1zaWRlIGRldmljZSBiaW5kaW5nLCByZXZv
a2VkIHdyaXRlciBhdXRob3JpemF0aW9uLCBwb2xsaW5nL2ZvY3VzIGd1YXJkLCBkYW4gdWppIG55
YXRhLgo0LiBKYW5nYW4gbWVuZ2FrdGlma2FuIENsb3VkIFN5bmMgaGFueWEgdW50dWsgbWVuZ3Vq
aSBsb2dvdXQ7IGtlc2VsYW1hdGFuIGRhdGEgcGVybWFpbmFuIHRldGFwIHByaW9yaXRhcy4KCiMj
IFBlbmd1amlhbgpgbm9kZSAtLXRlc3QgdGVzdHMvKi50ZXN0LmNqc2A6IDYyMyBQQVNTIC8gMCBG
QUlMIHBhZGEgc291cmNlIFpJUCBpbmkuCgojIyBSZW5jYW5hIHBlcmJhaWthbiBhbWFuCi0gUGlz
YWhrYW4gbG9nb3V0IGxva2FsIGJyb3dzZXIgZGFyaSBhZG1pbmlzdHJhdG9yL2dsb2JhbCBzZXNz
aW9uIHJldm9jYXRpb24sIHNldGVsYWggYXVkaXQgc2VtdWEgYWx1ciBzaWdub3V0IGRhbiB0ZXN0
IHlhbmcgcmVsZXZhbi4KLSBFbmZvcmNlIHNpbmdsZS1kZXZpY2UgT0ZGIHBhZGEgbG9naW4gYmFy
dSBtZWxhbHVpIG9wZXJhc2kgc2VydmVyIHlhbmcgYXRvbWlrLCBidWthbiBtZXRhZGF0YSBVSSBz
YWphLgotIE9sZCBicm93c2VyIGhhcnVzIG1lbmRldGVrc2kgcmV2b2tlIHBhZGEgZm9jdXMvcG9s
bGluZyBkYW4gZmFpbCBjbG9zZWQgdW50dWsgc2VtdWEgb3BlcmFzaSBtZW51bGlzLgotIFZlcmlm
aWthc2kgbG9naW4gQ2hyb21lIOKGkiBGaXJlZm94LCByZWxvYWQsIGxvZ291dCBDaHJvbWUsIGxv
Z291dCBGaXJlZm94LCBzZXJ0YSBwZXJtYWluYW4gY2xvdWQgcGVudWggc2ViZWx1bSBkZXBsb3lt
ZW50LgoKU1RBVFVTOiBBVURJVCBTQUpBOyBETyBOT1QgREVQTE9ZOyBTdGFnZSAyMSBiZWx1bSBz
ZWxlc2FpLgo=
```

### ARCHIVED FILE: STAGE241_CHECKPOINT.md | SHA256 1c861cacec15788aabe5d04e811c0915de2012b789dc9de6df0c054f09fa8d59

```base64
U3RhZ2UgMjQxIOKAlCBDbG91ZCBUcmlhbCBzZXNzaW9uIHRha2VvdmVyIFVJIGZpeCAoY2FuZGlk
YXRlOyBETyBOT1QgREVQTE9ZIHByb2R1Y3Rpb24pCgpDaGFuZ2U6IGNsb3VkLXRyaWFsL2luZGV4
Lmh0bWwgb25seS4gT24gYSBjb25mbGljdCB3aG9zZSBlcnJvciBtZXNzYWdlIGV4cGxpY2l0bHkg
Y29udGFpbnMgIk5ld2VyIGxvZ2luIHNlc3Npb24gZXhpc3RzIiwgaW52YWxpZGF0ZSB0aGUgcGVu
ZGluZyBhY3RpdmF0aW9uLCByZXNldCB0aGUgY2xvdWQgYnJpZGdlLCBzeW5jaHJvbm91c2x5IHNo
b3cgdGhlIGxvZ2luIGdhdGUgYW5kIG1lc3NhZ2UsIHRoZW4gY2FsbCBTdXBhYmFzZSBhdXRoLnNp
Z25PdXQoe3Njb3BlOidsb2NhbCd9KSB0byBjbGVhciBvbmx5IHRoaXMgYnJvd3Nlci4gT3RoZXIg
Y29uZmxpY3RzIHJlbWFpbiBub24tbG9nb3V0IGV2ZW50cy4gRXhpc3RpbmcgZ2FtZSBzdG9yYWdl
IGlzIG5vdCBkZWxldGVkLgoKTG9jYWwgcmVncmVzc2lvbjogbm9kZSAtLXRlc3QgdGVzdHMvc3lu
Yy1hcHAtYnJpZGdlLnRlc3QuY2pzIHRlc3RzL3N5bmMtZW5naW5lLnRlc3QuY2pzOiA5MiBQQVNT
LCAwIEZBSUwuCkxpdmUgQ2hyb21lL0ZpcmVmb3ggdHJhbnNmZXIgdmVyaWZpY2F0aW9uOiBOT1Qg
WUVUIFJVTi4gUHJvZHVjdGlvbiBDbG91ZCBTeW5jIHJlbWFpbnMgT0ZGLiBETyBOT1QgREVQTE9Z
IHByb2R1Y3Rpb24uCgpHaXRIdWIgRGVza3RvcCBTdW1tYXJ5OgpTdGFnZSAyNDE6IGxvY2sgc3Vw
ZXJzZWRlZCBjbG91ZC10cmlhbCBzZXNzaW9uIFVJCgpHaXRIdWIgRGVza3RvcCBEZXNjcmlwdGlv
bjoKRGV0ZWN0IG5ld2VyLWxvZ2luIHJlamVjdGlvbiBhbmQgaW1tZWRpYXRlbHkgcmV0dXJuIHN0
YWxlIGJyb3dzZXIgdG8gbG9naW4uIENsZWFyIG9ubHkgbG9jYWwgU3VwYWJhc2Ugc2Vzc2lvbiwg
cHJlc2VydmUgZ2FtZSBzdG9yYWdlIGFuZCBhY3RpdmUgYnJvd3Nlci4gQ2xvdWQtdHJpYWwgY2Fu
ZGlkYXRlIG9ubHk7IHByb2R1Y3Rpb24gc3luYyByZW1haW5zIE9GRi4gOTIgdGFyZ2V0ZWQgdGVz
dHMgUEFTUzsgbGl2ZSB0d28tYnJvd3NlciB2ZXJpZmljYXRpb24gcGVuZGluZy4K
```

### ARCHIVED FILE: STAGE278C_CHECKPOINT.txt | SHA256 cac2b383c6124f75b80562c5bace77163e6521fb3c4928533fb418d844416501

```base64
U3RhZ2UgMjc4QyBQUkUtUkVMRUFTRSBDQU5ESURBVEUg4oCUIERPIE5PVCBERVBMT1kKUHJvZHVj
dGlvbiBDbG91ZCBTeW5jIE9GRjsgQ2xvdWQgVHJpYWwgT04uCkludGVncmF0ZWQgQ2xvdWQgVHJp
YWwgc2Vzc2lvbiB0YWtlb3ZlciBoYW5kbGluZyBpbnRvIG1haW4gaW5kZXguaHRtbC4KUmVtb3Zl
ZCAyMjAgYnl0ZS1pZGVudGljYWwgbnVtYmVyZWQgZHVwbGljYXRlIGZpbGVzLgpQZW5kaW5nOiBm
dWxsIHJlZ3Jlc3Npb24sIHN0YWxlLXRva2VuIFJQQyByZWplY3Rpb24sIHByb2R1Y3Rpb24gYWN0
aXZhdGlvbiBhcHByb3ZhbC4KR2l0SHViIERlc2t0b3AgU3VtbWFyeTogU3RhZ2UgMjc4QyBpbnRl
Z3JhdGUgdmVyaWZpZWQgc2Vzc2lvbiB0YWtlb3ZlciBoYW5kbGluZyAoQ2xvdWQgU3luYyBPRkYp
CkdpdEh1YiBEZXNrdG9wIERlc2NyaXB0aW9uOiBJbnRlZ3JhdGUgQ2xvdWQgVHJpYWwgbmV3ZXIt
bG9naW4gbG9jYWwgc2lnbi1vdXQgYW5kIHdyaXRlciBVSSByZWZyZXNoIGludG8gbWFpbiBhcHAg
d2l0aG91dCBhY3RpdmF0aW5nIHByb2R1Y3Rpb24gQ2xvdWQgU3luYy4gQ2xlYW4gYnl0ZS1pZGVu
dGljYWwgZHVwbGljYXRlIGZpbGVzLiBETyBOT1QgREVQTE9ZLgo=
```

### ARCHIVED FILE: STAGE279C_CHECKPOINT.md | SHA256 03a92df8b9becf9522195d8fef819de7d95a2305fabdd16f4be9c322cdd9fcdd

```base64
IyBTdGFnZSAyNzlDIOKAlCBEZXBlbmRlbmN5IEF1ZGl0ICYgUmVncmVzc2lvbiBHYXRlCgpEYXRl
OiAyMDI2LTEwLTE1ClN0YXR1czogUEFTUyBmb3IgcGFja2FnZSBpbnRlZ3JpdHkgYW5kIGF1dG9t
YXRlZCB0ZXN0czsgcHJvZHVjdGlvbiByZWxlYXNlIEJMT0NLRUQuCgojIyBWZXJpZmllZCBsb2Nh
bGx5Ci0gU3RhZ2UgMjc5QiBpbnB1dCBaSVAgZXh0cmFjdGVkIHN1Y2Nlc3NmdWxseS4KLSBgbm9k
ZSAtLXRlc3QgdGVzdHMvKi50ZXN0LmNqc2A6IDYyNCBQQVNTLCAwIEZBSUwsIDAgU0tJUCAoMTMw
IHRlc3QgZmlsZXMpLgotIGBzdXBhYmFzZV9sYXRlc3Quc3FsYCBhbmQgYHN1cGFiYXNlX3NjaGVt
YV9oaXN0b3J5LnNxbGAgcHJlc2VudC4KLSAyNDAgZmlsZXMgcHJlc2VudCBiZWZvcmUgdGhpcyBj
aGVja3BvaW50IG5vdGU7IHplcm8gYCogMi4qYCBkdXBsaWNhdGUtbmFtZWQgZmlsZXMuCi0gRXhp
c3RpbmcgaGlzdG9yaWNhbCBTUUwgYW5kIHN0YWdpbmcgbm90ZXMgcmV0YWluZWQ6IHNldmVyYWwg
YXV0b21hdGVkIHRlc3RzIHJlYWQgaGlzdG9yaWNhbCBTUUwgZmlsZXMgZGlyZWN0bHkgKGUuZy4g
YHN1cGFiYXNlX3N5bmNfcnBjX2RyYWZ0LnNxbGApLiBSZW1vdmluZyBvciByZWxvY2F0aW5nIHRo
ZW0gd291bGQgYnJlYWsgdGVzdCBkZXBlbmRlbmNpZXMuCgojIyBSZWxlYXNlIGJsb2NrZXJzCi0g
RGlyZWN0IGF1dGhlbnRpY2F0ZWQgc3RhbGUtdG9rZW4gYG1haGpvbmdfc3luY19jb21taXRgIHJl
amVjdGlvbiBoYXMgTk9UIGJlZW4gZGVtb25zdHJhdGVkLiBUaGUgb2JzZXJ2ZWQgYG1haGpvbmdf
c3luY19sZWFzZV9zdGF0dXNgIHJlc3BvbnNlIGB7Im9rIjpmYWxzZSwicmVhc29uIjoibmV3ZXIt
bG9naW4ifWAgaXMgZXZpZGVuY2UgZm9yIGxlYXNlIHJlamVjdGlvbiBvbmx5LgotIE5vIHByb2R1
Y3Rpb24gQ2xvdWQgU3luYyBhY3RpdmF0aW9uIGFuZCBubyBHaXRIdWIgZGVwbG95bWVudCBhdXRo
b3JpemVkLgotIE5vIGRhdGFiYXNlIGNoYW5nZXMgbWFkZS4KCiMjIE5leHQKLSBVc2UgYW4gaXNv
bGF0ZWQsIGF1dGhlbnRpY2F0ZWQgUlBDIGludGVncmF0aW9uIGhhcm5lc3Mgd2l0aCBhIGRpc3Bv
c2FibGUgZ2FtZS9zZXNzaW9uLCB2ZXJpZnkgc3RhbGUgd3JpdGVyIGNvbW1pdCByZWplY3Rpb24s
IGFuZCBjbGVhbiB1cCBzYWZlbHkuCi0gVmVyaWZ5IHRoZSBmaW5hbCBjYW5kaWRhdGUncyBydW50
aW1lIGludGVncmF0aW9uIG9uIHN1cHBvcnRlZCBicm93c2VycyBiZWZvcmUgYW55IHByb2R1Y3Rp
b24gZW5hYmxlbWVudC4K
```

### ARCHIVED FILE: STAGE280_RELEASE_CANDIDATE.md | SHA256 c70416ed09ca6167134e16a21cf46c7f69ed8d5abd07b8ae0c6f42fa7a2abdb7

```base64
IyBTdGFnZSAyODAg4oCUIENsb3VkIFN5bmMgT04gUmVsZWFzZSBDYW5kaWRhdGUKClVzZXIgYXBw
cm92ZWQgcHJvZHVjdGlvbiBDbG91ZCBTeW5jIE9OIG9uIDIwMjYtMTAtMTUuIE5vIGRlcGxveW1l
bnQgcGVyZm9ybWVkLgoKQ2hhbmdlczogbWFpbiBgaW5kZXguaHRtbGAgZ2F0ZSBzZXQgdG8gdHJ1
ZTsgZml2ZSBoaXN0b3JpY2FsIHRlc3RzIGV4cGVjdGluZyBPRkYgdXBkYXRlZCB0byBhc3NlcnQg
YXBwcm92ZWQgT04uIGBjbG91ZC10cmlhbC9gIHJlbWFpbnMgc2VwYXJhdGUuIE5vIFN1cGFiYXNl
IFNRTCBhcHBsaWVkLgoKUmVsZWFzZSBsaW1pdGF0aW9uOiBkaXJlY3QgbGl2ZSBzdGFsZS10b2tl
biBjb21taXQgcmVqZWN0aW9uIG5vdCBkeW5hbWljYWxseSBkZW1vbnN0cmF0ZWQ7IHByaW9yIGNy
b3NzLWFjY291bnQgQ2hyb21lIHJlc3BvbnNlIHByb3ZlbmFuY2UgcmVtYWlucyB1bmNlcnRhaW4u
IFJlbGVhc2UgaXMgdXNlci1hY2NlcHRlZCB3aXRoIHRoZXNlIGRvY3VtZW50ZWQgZXhjZXB0aW9u
cy4KCkRlcGxveW1lbnQ6IGV4dHJhY3QgWklQIGFuZCByZXBsYWNlIHRyYWNrZWQgR2l0SHViIHJl
cG8gZmlsZXMsIHZlcmlmeSBkaWZmIGFuZCBkZXBsb3kgdmlhIEdpdEh1YiBEZXNrdG9wIG9ubHkg
YWZ0ZXIgZXhwbGljaXQgY29uZmlybWF0aW9uLgo=
```

### ARCHIVED FILE: UPLOAD_GITHUB 2.md | SHA256 f956385aa9184334029473542258f2b28953b8ee534b05dec793d76f0ac8fdcd

```base64
IyBNYWhqb25nIFNjb3JlIHYxNS43LjAg4oCUIFVwbG9hZCB2aWEgR2l0SHViIERlc2t0b3AKCjEu
IEV4dHJhY3QgWklQIGRhbiBzYWxpbiBzZWx1cnVoIElTSSBmb2xkZXIgYG1haGpvbmctc2NvcmUt
bWFpbmAga2Ugcm9vdCByZXBvLCB0ZXJtYXN1ayBmaWxlIHRlcnNlbWJ1bnlpLgoyLiBDb21taXQ6
IGB2MTUuNy4wIOKAlCBNYW51YWwgUG9pbnRzIElubmVyIFN3aXRjaCBVSWA7IFB1c2ggb3JpZ2lu
IGtlIGBtYWluYC4KMy4gU2V0ZWxhaCBkZXBsb3ksIHVqaSB0b2dnbGUgaGFueWEgYmVrZXJqYSBz
YWF0IHN3aXRjaCBkaXRla2FuLgo=
```

### ARCHIVED FILE: UPLOAD_GITHUB 3.md | SHA256 f956385aa9184334029473542258f2b28953b8ee534b05dec793d76f0ac8fdcd

```base64
IyBNYWhqb25nIFNjb3JlIHYxNS43LjAg4oCUIFVwbG9hZCB2aWEgR2l0SHViIERlc2t0b3AKCjEu
IEV4dHJhY3QgWklQIGRhbiBzYWxpbiBzZWx1cnVoIElTSSBmb2xkZXIgYG1haGpvbmctc2NvcmUt
bWFpbmAga2Ugcm9vdCByZXBvLCB0ZXJtYXN1ayBmaWxlIHRlcnNlbWJ1bnlpLgoyLiBDb21taXQ6
IGB2MTUuNy4wIOKAlCBNYW51YWwgUG9pbnRzIElubmVyIFN3aXRjaCBVSWA7IFB1c2ggb3JpZ2lu
IGtlIGBtYWluYC4KMy4gU2V0ZWxhaCBkZXBsb3ksIHVqaSB0b2dnbGUgaGFueWEgYmVrZXJqYSBz
YWF0IHN3aXRjaCBkaXRla2FuLgo=
```

### ARCHIVED FILE: UPLOAD_GITHUB.md | SHA256 f956385aa9184334029473542258f2b28953b8ee534b05dec793d76f0ac8fdcd

```base64
IyBNYWhqb25nIFNjb3JlIHYxNS43LjAg4oCUIFVwbG9hZCB2aWEgR2l0SHViIERlc2t0b3AKCjEu
IEV4dHJhY3QgWklQIGRhbiBzYWxpbiBzZWx1cnVoIElTSSBmb2xkZXIgYG1haGpvbmctc2NvcmUt
bWFpbmAga2Ugcm9vdCByZXBvLCB0ZXJtYXN1ayBmaWxlIHRlcnNlbWJ1bnlpLgoyLiBDb21taXQ6
IGB2MTUuNy4wIOKAlCBNYW51YWwgUG9pbnRzIElubmVyIFN3aXRjaCBVSWA7IFB1c2ggb3JpZ2lu
IGtlIGBtYWluYC4KMy4gU2V0ZWxhaCBkZXBsb3ksIHVqaSB0b2dnbGUgaGFueWEgYmVrZXJqYSBz
YWF0IHN3aXRjaCBkaXRla2FuLgo=
```

### ARCHIVED FILE: VOICE_AUTO_MODE_V15.6.93_SETUP 2.md | SHA256 8971116e2f5021dae928ff59edad5a6deb288fd73ce20275fd0a02e7cc7c24fd

```base64
IyB2MTUuNi45MyDigJQgZGVwbG95bWVudCBjaGVja2xpc3QKCjEuIFVwbG9hZCB0aGUgY2hhbmdl
ZCBhcHBsaWNhdGlvbiBmaWxlcyBhbmQgdGhlIG5ldyBgc3VwYWJhc2UvZnVuY3Rpb25zL21haGpv
bmctdm9pY2UtYXV0by1tb2RlL2luZGV4LnRzYCBwbHVzIHVwZGF0ZWQgYG1haGpvbmctdm9pY2Ut
YXV0b2ZpeC10cmlnZ2VyL2luZGV4LnRzYCB0byB0aGUgcmVwb3NpdG9yeSBtYWluIGJyYW5jaC4g
RG8gbm90IG92ZXJ3cml0ZSBganMvdm9pY2UtcGFyc2VyLmpzYCB3aXRoIGFuIG9sZGVyIHJldmlz
aW9uLgoyLiBEZXBsb3kgYm90aCBTdXBhYmFzZSBFZGdlIEZ1bmN0aW9uczogYG1haGpvbmctdm9p
Y2UtYXV0by1tb2RlYCAobmV3KSBhbmQgYG1haGpvbmctdm9pY2UtYXV0b2ZpeC10cmlnZ2VyYCAo
dXBkYXRlZCkuIEpXVCB2ZXJpZmljYXRpb24gbXVzdCByZW1haW4gZW5hYmxlZC4gTm8gU1FMIG1p
Z3JhdGlvbiBpcyByZXF1aXJlZC4KMy4gVGhlIGV4aXN0aW5nIFN1cGFiYXNlIHNlY3JldCBgR0lU
SFVCX0FVVE9GSVhfVE9LRU5gIG11c3QgcGVybWl0IEdpdEh1YiBBY3Rpb25zICoqVmFyaWFibGVz
OiBSZWFkIGFuZCB3cml0ZSoqIGFuZCAqKkFjdGlvbnM6IFdyaXRlKiogb24gYHdpcm9zZXRhL21h
aGpvbmctc2NvcmVgLiBGaW5lLWdyYWluZWQgdG9rZW5zIG1heSBuZWVkIGFuIHVwZGF0ZWQgcGVy
bWlzc2lvbiBncmFudC4gTmV2ZXIgcHV0IHRoZSB0b2tlbiBpbiB0aGUgZnJvbnRlbmQuCjQuIEtl
ZXAgR2l0SHViIEFjdGlvbnMgcmVwb3NpdG9yeSB2YXJpYWJsZSBgTUFISk9OR19WT0lDRV9BVVRP
X01PREVgIHNldCB0byBgZGV2ZWxvcG1lbnRgIG9yIGBzdGFibGVgLiBUaGUgVUkgdXBkYXRlcyB0
aGlzIHZhcmlhYmxlOyBzY2hlZHVsZWQgd29ya2Zsb3cgYWxyZWFkeSBjaGVja3MgaXQuCjUuIFRl
c3QgYWRtaW4gU2V0dGluZzogc3dpdGNoIHRvIFN0YWJsZSwgdmVyaWZ5IHRoZSBHaXRIdWIgdmFy
aWFibGUgYmVjb21lcyBgc3RhYmxlYCwgYW5kIGNvbmZpcm0gdGhlIHNjaGVkdWxlZCBqb2IgaXMg
c2tpcHBlZCBhbmQgdGhlIG1hbnVhbCB0cmlnZ2VyIHJlZnVzZXMgdG8gZGlzcGF0Y2guIFN3aXRj
aCBiYWNrIHRvIERldmVsb3BtZW50IGFuZCBjb25maXJtIHZhcmlhYmxlIGBkZXZlbG9wbWVudGAu
IENvbmZpcm0gbm9uLWFkbWluIGNhbm5vdCBpbnZva2UgdGhlIG1vZGUgZW5kcG9pbnQuCjYuIElt
cG9ydGFudCBsaW1pdGF0aW9uOiBhIHdvcmtmbG93IHRoYXQgaGFzIGFscmVhZHkgc3RhcnRlZCBi
ZWZvcmUgYSBtb2RlIHN3aXRjaCBtYXkgZmluaXNoOyB0aGUgY3VycmVudCB3b3JrZmxvdyBjaGVj
a3MgdGhlIHZhcmlhYmxlIG9ubHkgYXQgam9iIHN0YXJ0LiBGb3Igc3RyaWN0IG1pZC1ydW4gY2Fu
Y2VsbGF0aW9uLCBhZGQgYSBwcmUtcHVzaCBtb2RlIHJlY2hlY2sgaW4gYSBsYXRlciBjb250cm9s
bGVkIGNoYW5nZS4KNy4gVmVyc2lvbiBpcyB2MTUuNi45MyB0aHJvdWdob3V0IGFjdGl2ZSBhcHAg
c3VyZmFjZXMuIEhpc3RvcmljYWwgY2hhbmdlbG9nIGFuZCBzZXR1cCBkb2N1bWVudHMgcmV0YWlu
IGhpc3RvcmljYWwgdmVyc2lvbiBsYWJlbHMgaW50ZW50aW9uYWxseS4K
```

### ARCHIVED FILE: VOICE_AUTO_MODE_V15.6.93_SETUP 3.md | SHA256 8971116e2f5021dae928ff59edad5a6deb288fd73ce20275fd0a02e7cc7c24fd

```base64
IyB2MTUuNi45MyDigJQgZGVwbG95bWVudCBjaGVja2xpc3QKCjEuIFVwbG9hZCB0aGUgY2hhbmdl
ZCBhcHBsaWNhdGlvbiBmaWxlcyBhbmQgdGhlIG5ldyBgc3VwYWJhc2UvZnVuY3Rpb25zL21haGpv
bmctdm9pY2UtYXV0by1tb2RlL2luZGV4LnRzYCBwbHVzIHVwZGF0ZWQgYG1haGpvbmctdm9pY2Ut
YXV0b2ZpeC10cmlnZ2VyL2luZGV4LnRzYCB0byB0aGUgcmVwb3NpdG9yeSBtYWluIGJyYW5jaC4g
RG8gbm90IG92ZXJ3cml0ZSBganMvdm9pY2UtcGFyc2VyLmpzYCB3aXRoIGFuIG9sZGVyIHJldmlz
aW9uLgoyLiBEZXBsb3kgYm90aCBTdXBhYmFzZSBFZGdlIEZ1bmN0aW9uczogYG1haGpvbmctdm9p
Y2UtYXV0by1tb2RlYCAobmV3KSBhbmQgYG1haGpvbmctdm9pY2UtYXV0b2ZpeC10cmlnZ2VyYCAo
dXBkYXRlZCkuIEpXVCB2ZXJpZmljYXRpb24gbXVzdCByZW1haW4gZW5hYmxlZC4gTm8gU1FMIG1p
Z3JhdGlvbiBpcyByZXF1aXJlZC4KMy4gVGhlIGV4aXN0aW5nIFN1cGFiYXNlIHNlY3JldCBgR0lU
SFVCX0FVVE9GSVhfVE9LRU5gIG11c3QgcGVybWl0IEdpdEh1YiBBY3Rpb25zICoqVmFyaWFibGVz
OiBSZWFkIGFuZCB3cml0ZSoqIGFuZCAqKkFjdGlvbnM6IFdyaXRlKiogb24gYHdpcm9zZXRhL21h
aGpvbmctc2NvcmVgLiBGaW5lLWdyYWluZWQgdG9rZW5zIG1heSBuZWVkIGFuIHVwZGF0ZWQgcGVy
bWlzc2lvbiBncmFudC4gTmV2ZXIgcHV0IHRoZSB0b2tlbiBpbiB0aGUgZnJvbnRlbmQuCjQuIEtl
ZXAgR2l0SHViIEFjdGlvbnMgcmVwb3NpdG9yeSB2YXJpYWJsZSBgTUFISk9OR19WT0lDRV9BVVRP
X01PREVgIHNldCB0byBgZGV2ZWxvcG1lbnRgIG9yIGBzdGFibGVgLiBUaGUgVUkgdXBkYXRlcyB0
aGlzIHZhcmlhYmxlOyBzY2hlZHVsZWQgd29ya2Zsb3cgYWxyZWFkeSBjaGVja3MgaXQuCjUuIFRl
c3QgYWRtaW4gU2V0dGluZzogc3dpdGNoIHRvIFN0YWJsZSwgdmVyaWZ5IHRoZSBHaXRIdWIgdmFy
aWFibGUgYmVjb21lcyBgc3RhYmxlYCwgYW5kIGNvbmZpcm0gdGhlIHNjaGVkdWxlZCBqb2IgaXMg
c2tpcHBlZCBhbmQgdGhlIG1hbnVhbCB0cmlnZ2VyIHJlZnVzZXMgdG8gZGlzcGF0Y2guIFN3aXRj
aCBiYWNrIHRvIERldmVsb3BtZW50IGFuZCBjb25maXJtIHZhcmlhYmxlIGBkZXZlbG9wbWVudGAu
IENvbmZpcm0gbm9uLWFkbWluIGNhbm5vdCBpbnZva2UgdGhlIG1vZGUgZW5kcG9pbnQuCjYuIElt
cG9ydGFudCBsaW1pdGF0aW9uOiBhIHdvcmtmbG93IHRoYXQgaGFzIGFscmVhZHkgc3RhcnRlZCBi
ZWZvcmUgYSBtb2RlIHN3aXRjaCBtYXkgZmluaXNoOyB0aGUgY3VycmVudCB3b3JrZmxvdyBjaGVj
a3MgdGhlIHZhcmlhYmxlIG9ubHkgYXQgam9iIHN0YXJ0LiBGb3Igc3RyaWN0IG1pZC1ydW4gY2Fu
Y2VsbGF0aW9uLCBhZGQgYSBwcmUtcHVzaCBtb2RlIHJlY2hlY2sgaW4gYSBsYXRlciBjb250cm9s
bGVkIGNoYW5nZS4KNy4gVmVyc2lvbiBpcyB2MTUuNi45MyB0aHJvdWdob3V0IGFjdGl2ZSBhcHAg
c3VyZmFjZXMuIEhpc3RvcmljYWwgY2hhbmdlbG9nIGFuZCBzZXR1cCBkb2N1bWVudHMgcmV0YWlu
IGhpc3RvcmljYWwgdmVyc2lvbiBsYWJlbHMgaW50ZW50aW9uYWxseS4K
```

### ARCHIVED FILE: VOICE_AUTO_MODE_V15.6.93_SETUP.md | SHA256 8971116e2f5021dae928ff59edad5a6deb288fd73ce20275fd0a02e7cc7c24fd

```base64
IyB2MTUuNi45MyDigJQgZGVwbG95bWVudCBjaGVja2xpc3QKCjEuIFVwbG9hZCB0aGUgY2hhbmdl
ZCBhcHBsaWNhdGlvbiBmaWxlcyBhbmQgdGhlIG5ldyBgc3VwYWJhc2UvZnVuY3Rpb25zL21haGpv
bmctdm9pY2UtYXV0by1tb2RlL2luZGV4LnRzYCBwbHVzIHVwZGF0ZWQgYG1haGpvbmctdm9pY2Ut
YXV0b2ZpeC10cmlnZ2VyL2luZGV4LnRzYCB0byB0aGUgcmVwb3NpdG9yeSBtYWluIGJyYW5jaC4g
RG8gbm90IG92ZXJ3cml0ZSBganMvdm9pY2UtcGFyc2VyLmpzYCB3aXRoIGFuIG9sZGVyIHJldmlz
aW9uLgoyLiBEZXBsb3kgYm90aCBTdXBhYmFzZSBFZGdlIEZ1bmN0aW9uczogYG1haGpvbmctdm9p
Y2UtYXV0by1tb2RlYCAobmV3KSBhbmQgYG1haGpvbmctdm9pY2UtYXV0b2ZpeC10cmlnZ2VyYCAo
dXBkYXRlZCkuIEpXVCB2ZXJpZmljYXRpb24gbXVzdCByZW1haW4gZW5hYmxlZC4gTm8gU1FMIG1p
Z3JhdGlvbiBpcyByZXF1aXJlZC4KMy4gVGhlIGV4aXN0aW5nIFN1cGFiYXNlIHNlY3JldCBgR0lU
SFVCX0FVVE9GSVhfVE9LRU5gIG11c3QgcGVybWl0IEdpdEh1YiBBY3Rpb25zICoqVmFyaWFibGVz
OiBSZWFkIGFuZCB3cml0ZSoqIGFuZCAqKkFjdGlvbnM6IFdyaXRlKiogb24gYHdpcm9zZXRhL21h
aGpvbmctc2NvcmVgLiBGaW5lLWdyYWluZWQgdG9rZW5zIG1heSBuZWVkIGFuIHVwZGF0ZWQgcGVy
bWlzc2lvbiBncmFudC4gTmV2ZXIgcHV0IHRoZSB0b2tlbiBpbiB0aGUgZnJvbnRlbmQuCjQuIEtl
ZXAgR2l0SHViIEFjdGlvbnMgcmVwb3NpdG9yeSB2YXJpYWJsZSBgTUFISk9OR19WT0lDRV9BVVRP
X01PREVgIHNldCB0byBgZGV2ZWxvcG1lbnRgIG9yIGBzdGFibGVgLiBUaGUgVUkgdXBkYXRlcyB0
aGlzIHZhcmlhYmxlOyBzY2hlZHVsZWQgd29ya2Zsb3cgYWxyZWFkeSBjaGVja3MgaXQuCjUuIFRl
c3QgYWRtaW4gU2V0dGluZzogc3dpdGNoIHRvIFN0YWJsZSwgdmVyaWZ5IHRoZSBHaXRIdWIgdmFy
aWFibGUgYmVjb21lcyBgc3RhYmxlYCwgYW5kIGNvbmZpcm0gdGhlIHNjaGVkdWxlZCBqb2IgaXMg
c2tpcHBlZCBhbmQgdGhlIG1hbnVhbCB0cmlnZ2VyIHJlZnVzZXMgdG8gZGlzcGF0Y2guIFN3aXRj
aCBiYWNrIHRvIERldmVsb3BtZW50IGFuZCBjb25maXJtIHZhcmlhYmxlIGBkZXZlbG9wbWVudGAu
IENvbmZpcm0gbm9uLWFkbWluIGNhbm5vdCBpbnZva2UgdGhlIG1vZGUgZW5kcG9pbnQuCjYuIElt
cG9ydGFudCBsaW1pdGF0aW9uOiBhIHdvcmtmbG93IHRoYXQgaGFzIGFscmVhZHkgc3RhcnRlZCBi
ZWZvcmUgYSBtb2RlIHN3aXRjaCBtYXkgZmluaXNoOyB0aGUgY3VycmVudCB3b3JrZmxvdyBjaGVj
a3MgdGhlIHZhcmlhYmxlIG9ubHkgYXQgam9iIHN0YXJ0LiBGb3Igc3RyaWN0IG1pZC1ydW4gY2Fu
Y2VsbGF0aW9uLCBhZGQgYSBwcmUtcHVzaCBtb2RlIHJlY2hlY2sgaW4gYSBsYXRlciBjb250cm9s
bGVkIGNoYW5nZS4KNy4gVmVyc2lvbiBpcyB2MTUuNi45MyB0aHJvdWdob3V0IGFjdGl2ZSBhcHAg
c3VyZmFjZXMuIEhpc3RvcmljYWwgY2hhbmdlbG9nIGFuZCBzZXR1cCBkb2N1bWVudHMgcmV0YWlu
IGhpc3RvcmljYWwgdmVyc2lvbiBsYWJlbHMgaW50ZW50aW9uYWxseS4K
```

### ARCHIVED FILE: VOICE_CORRECTION_SETUP 2.md | SHA256 779d5c0a54a72dc1ff653fd826a23ad57afd4a0d1f76d2313d07d4464184207f

```base64
IyB2MTUuNi44OCDigJQgVm9pY2UgY29ycmVjdGlvbiBjb25zZW50IChUYWhhcCA0KQoKQWZ0ZXIg
YSBzY29yZSBpcyBzdWNjZXNzZnVsbHkgcmVjb3JkZWQsIGlmIG9uZSBvciBtb3JlIFZvaWNlIHRy
YW5zY3JpcHRzIGRpZmZlciBmcm9tIHRoZSByZWNvcmRlZCBoYW5kLCB0aGUgc2NvcmVrZWVwZXIg
bWF5IGV4cGxpY2l0bHkgYXBwcm92ZSBzaGFyaW5nIGEgKip0ZXh0LW9ubHkqKiBjb3JyZWN0aW9u
LiBDYW5jZWwgbWVhbnMgbm8gdHJhaW5pbmcgcmVjb3JkIGlzIGNyZWF0ZWQuIFRoZSBoYW5kIGlz
IGFscmVhZHkgcmVjb3JkZWQgcmVnYXJkbGVzcyBvZiBjb25zZW50LiBObyByYXcgYXVkaW8gaXMg
c2F2ZWQuCgpUaGUgcmVwb3J0IHVzZXMgdGhlIGV4aXN0aW5nIGBtYWhqb25nX3ZvaWNlX2RpYWdu
b3N0aWNzYCB0YWJsZSwgYGtpbmQ9dm9pY2VfZGVidWdgLCBhbmQgYGRldGFpbHMuY29uZmlybWVk
X2NvcnJlY3Rpb25gIHdpdGggYGNvbmZpcm1lZF9ieV91c2VyPXRydWVgLCBgaW5wdXRgLCBmb3Vy
IGBuYW1lc2AsIGFuZCBgZXhwZWN0ZWRgIChtZXRob2QsIHdpbm5lciwgZGlzY2FyZGVyLCBxdWFk
cywgcGF0dGVybnMpLiBJdCB1c2VzIHRoZSBleGlzdGluZyBxdWV1ZWQgaW5zZXJ0IG1lY2hhbmlz
bSwgaW5jbHVkaW5nIG9mZmxpbmUgcmV0cnkuIFRoZSBHZW1pbmkgQXV0by1GaXggd29ya2VyIGFs
cmVhZHkgZmlsdGVycyBmb3IgdGhpcyBleGFjdCBmb3JtYXQuCgoqKk5vIG5ldyBTUUwgb3IgRWRn
ZSBGdW5jdGlvbiByZXF1aXJlZCoqIGlmIGBzdXBhYmFzZV9sYXRlc3Quc3FsYCBmb3IgdjE1LjYu
ODUgaGFzIGFscmVhZHkgYmVlbiBhcHBsaWVkIGFuZCBhdXRoZW50aWNhdGVkIHNjb3Jla2VlcGVy
cyBjYW4gaW5zZXJ0IGludG8gYG1haGpvbmdfdm9pY2VfZGlhZ25vc3RpY3NgLiBEbyBub3QgcmUt
cnVuIHVucmVsYXRlZCBtaWdyYXRpb25zLgoKSW1wb3J0YW50IGxpbWl0YXRpb25zOiBUaGlzIGlz
IGFuIG9wdC1pbiB0ZXh0IGNvcnJlY3Rpb24sIG5vdCBhbiBhdWRpbyB0cmFuc2NyaXB0aW9uIHRy
dXRoIG9yYWNsZS4gVGhlIHVzZXIgbXVzdCB2ZXJpZnkgdGhlIEFTUiB0ZXh0IGNvcnJlc3BvbmRz
IHRvIHRoZSBzcG9rZW4gaW50ZW50LiBNdWx0aXBsZSB1dHRlcmFuY2VzIGFyZSBqb2luZWQgaW4g
c2VxdWVuY2U7IG9ubHkgdGhlIGxhc3QgZWlnaHQgKG1heCA0MDAgY2hhcmFjdGVycykgYXJlIHJl
dGFpbmVkIGZvciB0aGlzIGhhbmQuIEF1dG8tRml4IHJlbWFpbnMgc3ViamVjdCB0byBwYXJzZXIg
cmVncmVzc2lvbiBjaGVja3M7IGEgc3VjY2Vzc2Z1bCBHaXRIdWIgQWN0aW9ucyBydW4gd2l0aCBu
byBjb25maXJtZWQgY2FzZXMgbWFrZXMgbm8gY2hhbmdlcy4KClRlc3Qgb24gaVBob25lIFNhZmFy
aSBhbmQgU2Ftc3VuZyBBMTcgYWZ0ZXIgZGVwbG95bWVudDogKDEpIGNvcnJlY3Qgdm9pY2Ugc2Nv
cmUgc2hvdWxkIG5vdCBwcm9tcHQsICgyKSBtaXNyZWNvZ25pemVkIHZvaWNlIGZvbGxvd2VkIGJ5
IG1hbnVhbCBjb3JyZWN0aW9uIHNob3VsZCBwcm9tcHQgYWZ0ZXIgcmVjb3JkaW5nLCAoMykgQ2Fu
Y2VsIHNob3VsZCBub3Qgc2VuZCBjb25maXJtZWRfY29ycmVjdGlvbiwgKDQpIE9LIHNob3VsZCBx
dWV1ZSBhbmQgdXBsb2FkIGEgdm9pY2VfZGVidWcgcmVjb3JkLCAoNSkgb2ZmbGluZSBjb25maXJt
YXRpb24gc2hvdWxkIHF1ZXVlIHVudGlsIG9ubGluZSwgKDYpIHNjb3JpbmcgYW5kIGRlYWxlciBy
b3RhdGlvbiBtdXN0IHJlbWFpbiBjb3JyZWN0LiBUaGVzZSBicm93c2VyIHRlc3RzIGhhdmUgTk9U
IGJlZW4gcGVyZm9ybWVkIGluIHRoaXMgZW52aXJvbm1lbnQuCg==
```

### ARCHIVED FILE: VOICE_CORRECTION_SETUP.md | SHA256 779d5c0a54a72dc1ff653fd826a23ad57afd4a0d1f76d2313d07d4464184207f

```base64
IyB2MTUuNi44OCDigJQgVm9pY2UgY29ycmVjdGlvbiBjb25zZW50IChUYWhhcCA0KQoKQWZ0ZXIg
YSBzY29yZSBpcyBzdWNjZXNzZnVsbHkgcmVjb3JkZWQsIGlmIG9uZSBvciBtb3JlIFZvaWNlIHRy
YW5zY3JpcHRzIGRpZmZlciBmcm9tIHRoZSByZWNvcmRlZCBoYW5kLCB0aGUgc2NvcmVrZWVwZXIg
bWF5IGV4cGxpY2l0bHkgYXBwcm92ZSBzaGFyaW5nIGEgKip0ZXh0LW9ubHkqKiBjb3JyZWN0aW9u
LiBDYW5jZWwgbWVhbnMgbm8gdHJhaW5pbmcgcmVjb3JkIGlzIGNyZWF0ZWQuIFRoZSBoYW5kIGlz
IGFscmVhZHkgcmVjb3JkZWQgcmVnYXJkbGVzcyBvZiBjb25zZW50LiBObyByYXcgYXVkaW8gaXMg
c2F2ZWQuCgpUaGUgcmVwb3J0IHVzZXMgdGhlIGV4aXN0aW5nIGBtYWhqb25nX3ZvaWNlX2RpYWdu
b3N0aWNzYCB0YWJsZSwgYGtpbmQ9dm9pY2VfZGVidWdgLCBhbmQgYGRldGFpbHMuY29uZmlybWVk
X2NvcnJlY3Rpb25gIHdpdGggYGNvbmZpcm1lZF9ieV91c2VyPXRydWVgLCBgaW5wdXRgLCBmb3Vy
IGBuYW1lc2AsIGFuZCBgZXhwZWN0ZWRgIChtZXRob2QsIHdpbm5lciwgZGlzY2FyZGVyLCBxdWFk
cywgcGF0dGVybnMpLiBJdCB1c2VzIHRoZSBleGlzdGluZyBxdWV1ZWQgaW5zZXJ0IG1lY2hhbmlz
bSwgaW5jbHVkaW5nIG9mZmxpbmUgcmV0cnkuIFRoZSBHZW1pbmkgQXV0by1GaXggd29ya2VyIGFs
cmVhZHkgZmlsdGVycyBmb3IgdGhpcyBleGFjdCBmb3JtYXQuCgoqKk5vIG5ldyBTUUwgb3IgRWRn
ZSBGdW5jdGlvbiByZXF1aXJlZCoqIGlmIGBzdXBhYmFzZV9sYXRlc3Quc3FsYCBmb3IgdjE1LjYu
ODUgaGFzIGFscmVhZHkgYmVlbiBhcHBsaWVkIGFuZCBhdXRoZW50aWNhdGVkIHNjb3Jla2VlcGVy
cyBjYW4gaW5zZXJ0IGludG8gYG1haGpvbmdfdm9pY2VfZGlhZ25vc3RpY3NgLiBEbyBub3QgcmUt
cnVuIHVucmVsYXRlZCBtaWdyYXRpb25zLgoKSW1wb3J0YW50IGxpbWl0YXRpb25zOiBUaGlzIGlz
IGFuIG9wdC1pbiB0ZXh0IGNvcnJlY3Rpb24sIG5vdCBhbiBhdWRpbyB0cmFuc2NyaXB0aW9uIHRy
dXRoIG9yYWNsZS4gVGhlIHVzZXIgbXVzdCB2ZXJpZnkgdGhlIEFTUiB0ZXh0IGNvcnJlc3BvbmRz
IHRvIHRoZSBzcG9rZW4gaW50ZW50LiBNdWx0aXBsZSB1dHRlcmFuY2VzIGFyZSBqb2luZWQgaW4g
c2VxdWVuY2U7IG9ubHkgdGhlIGxhc3QgZWlnaHQgKG1heCA0MDAgY2hhcmFjdGVycykgYXJlIHJl
dGFpbmVkIGZvciB0aGlzIGhhbmQuIEF1dG8tRml4IHJlbWFpbnMgc3ViamVjdCB0byBwYXJzZXIg
cmVncmVzc2lvbiBjaGVja3M7IGEgc3VjY2Vzc2Z1bCBHaXRIdWIgQWN0aW9ucyBydW4gd2l0aCBu
byBjb25maXJtZWQgY2FzZXMgbWFrZXMgbm8gY2hhbmdlcy4KClRlc3Qgb24gaVBob25lIFNhZmFy
aSBhbmQgU2Ftc3VuZyBBMTcgYWZ0ZXIgZGVwbG95bWVudDogKDEpIGNvcnJlY3Qgdm9pY2Ugc2Nv
cmUgc2hvdWxkIG5vdCBwcm9tcHQsICgyKSBtaXNyZWNvZ25pemVkIHZvaWNlIGZvbGxvd2VkIGJ5
IG1hbnVhbCBjb3JyZWN0aW9uIHNob3VsZCBwcm9tcHQgYWZ0ZXIgcmVjb3JkaW5nLCAoMykgQ2Fu
Y2VsIHNob3VsZCBub3Qgc2VuZCBjb25maXJtZWRfY29ycmVjdGlvbiwgKDQpIE9LIHNob3VsZCBx
dWV1ZSBhbmQgdXBsb2FkIGEgdm9pY2VfZGVidWcgcmVjb3JkLCAoNSkgb2ZmbGluZSBjb25maXJt
YXRpb24gc2hvdWxkIHF1ZXVlIHVudGlsIG9ubGluZSwgKDYpIHNjb3JpbmcgYW5kIGRlYWxlciBy
b3RhdGlvbiBtdXN0IHJlbWFpbiBjb3JyZWN0LiBUaGVzZSBicm93c2VyIHRlc3RzIGhhdmUgTk9U
IGJlZW4gcGVyZm9ybWVkIGluIHRoaXMgZW52aXJvbm1lbnQuCg==
```
