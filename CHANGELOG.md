## v15.8 — Stage 284 repository cleanup and unified version (2026-10-15)

- Versi aktif aplikasi: **v15.8** (UI utama dan Cloud Trial, About, voice diagnostic, manifest, service-worker cache).
- Stage 282–284: konsolidasi dokumentasi/SQL historis, relokasi fixture pengujian, penghapusan duplikat `sw 2.js`, dan pembaruan jalur referensi.
- Tidak mengubah database Supabase atau menjalankan deployment.
- Riwayat versi sebelumnya di bawah dipertahankan sebagai catatan historis.

## v15.7.15 — Stage 17 activation candidate (not yet deployed)
- Cloud bridge activation flag enabled in candidate build; separate direct SQL installer prepared for operator review.
- No claim of server installation or two-device verification.


## Stage 17 — Isolated staging handoff (2026-10-13)
Prepared isolated staging setup checklist and 5 new release-guard regression tests. No staging project created, no real Auth sessions, no SQL installed, and no two-device acceptance tests executed. Awaiting user creation of empty staging project. Cloud Sync OFF / DO NOT DEPLOY.

## 2026-10-13 — Stage 17 real Auth test handoff
- Added staging-only 12-case two-device test protocol with strict no-production-change boundaries. No live Auth testing performed.

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
## v15.7.15 — Stage 17 combined integration gate (2026-10-13)
- Prepared fail-closed five-RPC review bundle and read-only catalog inspection.
- Retained `supabase_latest.sql` unchanged pending runtime and approval.
- Real two-device, full RPC PostgreSQL and production installation remain blocked; Cloud Sync OFF.

## v15.7.15 — Stage 17 Step 35 (local only)
- Audit static contract of five RPC and add nine Node regression assertions; production unchanged, no deployment.

## v15.7.15 — Stage 17 Step 34 (2026-10-13)

Candidate validator synchronized with 12/12 PostgreSQL-tested temporary function. Production unchanged; full RPC candidate still blocked. See IMPLEMENTATION_STATE.md.

Node regression: 581 PASS, 0 FAIL.

## Stage 17 Step 32 — Candidate validator parity harness (DO NOT DEPLOY)

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
## v15.7.15 — Stage 14–16 Signed JWT diagnostic classification (DO NOT DEPLOY)
- Correct browser preflight distinction: signed RPC contract PASS does not imply active cloud game; `no-cloud-game` is NOT READY for game availability.
- Add three read-only diagnostic regression tests; preserve Cloud Sync OFF.

## v15.7.15 — Stage 14–16 Signed JWT browser preflight (2026-10-13)
- Added read-only real-login browser preflight (Supabase getUser + mahjong_sync_peek); no secrets printed.
- Added 3 static privacy/read-only checks; 578 Node tests PASS, 0 FAIL.
- No RPC installation or Cloud Sync activation.

## 2026-10-13 — Stage 14–16 real-auth integration readiness (DO NOT DEPLOY)
- Audited actual client-to-RPC wiring, session identity, lease gating and cloud activation.
- Added read-only 16-point Supabase real-auth preflight SQL; no RPC installation or Cloud Sync activation.
- Documented signed JWT / real-device acceptance gates. Node regression rerun: 575 PASS, 0 FAIL.

## v15.7.15 — Stage 14–16 Nested Serializer Guard (2026-10-13)
- Reject nested and inherited `toJSON` serializers before cloud snapshot transport. Three regression tests; 575 Node PASS / 0 FAIL. Cloud Sync OFF; DO NOT DEPLOY.

## v15.7.15 — Stage 13 RPC review security checkpoint (12 Oktober 2026, DO NOT DEPLOY)
- SQL review menolak role NULL secara eksplisit dan menghapus CREATE INDEX current-game redundan.
- Tambah tiga pengujian statis; 265 PASS, 0 FAIL lokal Node. PostgreSQL/Supabase belum diuji ulang setelah perubahan.
- Tidak mengubah aplikasi live atau mengaktifkan Cloud Sync.

## v15.7.15 — Integrasi sinkronisasi tahap pengujian (belum diaktifkan)
- Menambahkan modul penghubung login, identitas perangkat, antrean perubahan, dan penerimaan permainan cloud ke halaman utama.
- Memperbaiki konsistensi nomor versi yang masih menampilkan v15.7.13 pada paket v15.7.14.
- Memperbarui cache PWA dan daftar berkas offline untuk modul sinkronisasi.
- Pengaman sinkronisasi tetap OFF; RPC Supabase masih draf, bukan migrasi siap production.
- ZIP ini untuk pemeriksaan dan pengujian, **bukan untuk deploy**.

## v15.7.14 — Fondasi sinkronisasi (belum diaktifkan)
- Menambahkan rancangan migrasi aditif empat tabel cloud dengan RLS dan akses browser ditutup secara default.
- SQL aktif hanya memuat migrasi baru; SQL aktif sebelumnya diarsipkan pada berkas riwayat.
- Tidak mengubah HTML, JavaScript, Edge Functions, Live Sharing, maupun data permainan.
- Implementasi sesi perangkat dan pemulihan cloud belum diaktifkan sampai RPC atomik dan uji Supabase selesai.

## v15.7.13 — Modal layout and Settings typography (11 Oktober 2026)
- Aturan Bermain: scrollbar dipindah ke area konten agar header mengisi lebar modal termasuk sudut kanan.
- About This Program: header tidak terpotong; tinggi jendela mengikuti konten dengan batas tinggi dan scroll saat diperlukan. Seluruh teks legal dipertahankan.
- Setting: tipografi Tambahan Poin Manual disamakan dengan tombol lain tanpa mengubah perilaku switch.
- Versi dan identitas cache PWA diperbarui; aturan skor dan Gemini Auto-Fix tidak diubah.

## v15.7.12 — Edge-to-edge dark-glass modal headers
- Align Setting and settings submenu header backgrounds to modal top corners and side edges, matching Aturan Bermain Mahjong.
- Preserve modal contents, controls, scrolling, scoring and Voice Auto-Fix.
- Refresh PWA cache identifier and app version.

## v15.7.12 — Voice Diagnostic Quad/Kombinasi visibility (11 Oktober 2026)

- Show parsed Quad and Kombinasi values, recognized action status, and resolved player names for each Free Voice Test alternative.
- Preserve existing parser logic, scoring rules, and Gemini Auto-Fix workflows.
- Update displayed app version and PWA cache identifier to v15.7.12.

## v15.7.10 — Safari “singkong” Quad recognition correction (11 Oktober 2026)

- Accept Safari Indonesian speech drift `Yeni singkong dua` as Yenny Quad 2 only with a valid active player anchor and explicit count.
- Extend tightly scoped Yenny/Hari name repairs and Quad keyword matching; preserve bare `Singkong dua` as non-action.
- Add regression tests for player-anchored and unanchored cases; preserve application version and existing Supabase Edge Function and Gemini workflows.

## v15.7.10 — Safari “kongs” Quad recognition correction (11 Oktober 2026)

- Audit of confirmed correction `Yeni kongs dua` identified missing `kongs` recognition in the parser's tightly scoped Quad vocabulary; the saved expected count is now 2.
- Recognize `kongs` only in existing player-anchored Quad parsing and transcript-repair contexts; preserve the prohibition on assigning bare Kong commands to a player.
- Add four verified Yenny/Quad speech cases and a bare `Kongs dua` safety regression; 23 parser cases and 7 isolated Auto-Fix integration scenarios pass locally.
- Keep existing Gemini Auto-Fix workflow, latest Supabase Edge Function, application version v15.7.10, and other gameplay/UI unchanged.
- Live Gemini/Supabase workflow and mobile-device tests remain pending.

## v15.7.10 — Gemini Auto-Fix structured validation feedback (11 Oktober 2026)

- Provide Gemini with confirmed expected values, actual parser results, and field-level differences for each pending correction.
- When a candidate fails confirmed-case validation, include that candidate’s actual-vs-expected differences in the second attempt so Gemini can target the failing behavior.
- Keep the two-attempt limit, safe no-op on unresolved corrections, strict parser-only changes, and existing regression gates.
- Preserve the latest diagnostic Supabase Edge Function source in the ZIP; no redeploy needed if the deployed code is unchanged.
- Offline syntax, 18 parser baseline cases, and 7 integration scenarios pass. Live Gemini remediation remains unverified.
- Application version remains v15.7.10.

## v15.7.10 — Gemini Auto-Fix line-anchored proposal reliability (11 Oktober 2026)

- Gemini may propose a bounded numbered source-line replacement; original text is extracted locally rather than copied approximately by AI.
- Preserve exact-string proposals for backward compatibility; rejected first proposal is included as retry feedback.
- Keep fail-closed syntax/confirmed-correction/regression checks and no-op on unresolved corrections; application version remains v15.7.10.
- Synchronize repository Edge Function `mahjong-voice-autofix-trigger/index.ts` with the latest deployed diagnostic version, including safe GitHub dispatch error classification. No Edge Function redeploy required if cloud code already matches.
- Offline tests extended to seven integration scenarios, including line-anchored fix and retry. Live Gemini outcome still requires verification.

## v15.7.10 — Cross-device Voice Recognition permission refresh (11 Oktober 2026)

- Reconcile the server-authoritative Voice Recognition claim from Supabase Auth with the active session and JWT on Scorekeeper devices.
- When the permission changes, update Voice button visibility immediately and refresh the session token so subsequent auth callbacks and voice-start checks do not reuse stale metadata.
- Recheck permissions at startup and after sign-in/token refresh, as well as existing 15-second polling and foreground/focus checks.
- Preserve v15.7.9 immediate User Management switch saving and the verified iPhone Voice Diagnostic and Quad layouts.
- Cross-device behavior still requires live two-device verification before declaring PASS.

## v15.7.9 — User Management Voice switch immediate save (11 Oktober 2026)

- Voice Recognition switch in User Management now saves immediately to Supabase without requiring the separate Simpan Pengaturan button.
- When editing the logged-in account, apply Voice button visibility immediately after successful save; stop active recording on OFF.
- Prevent a pre-existing permission refresh request from overwriting the just-saved local permission.
- Restore switch state and show an error if server save fails; retain all other user settings and v15.7.7 iPhone diagnostic layout.
- Update displayed version, manifest, diagnostic version and service worker cache to v15.7.9.

## v15.7.8 — Voice Recognition permission synchronization (11 Oktober 2026)
- Apply Voice ON/OFF immediately when Administrator saves their own user settings, without logout/login.
- Poll server-authoritative Supabase Auth user metadata every 15 seconds and refresh on tab focus/visibility for other active devices.
- Stop active Voice recognition when permission becomes OFF; keep voice buttons hidden before login.
- Preserve iPhone Voice Diagnostic v15.7.7 layout. iPhone and live Supabase verification pending.

## v15.7.7 — iPhone Voice Diagnostic content-fit and version identification (11 Oktober 2026)
- Fix iPhone Safari Voice Diagnostic filling nearly the entire screen when all panels are collapsed. Use a centered content-sized grid card with a maximum viewport height and one scroll container.
- Keep all five panels, sticky close header, Dark Glass styling, and expanded-panel scrolling. Remove obsolete Voice Diagnostic geometry rules rather than stacking new overrides.
- Update displayed version, About, diagnostic metadata, manifest and service-worker cache key to v15.7.7 for unambiguous device testing.
- Preserve User Management, Quad overlay, Voice Recognition initial hiding, and Gemini safety updates from v15.7.6. Device and live-service verification remain pending.

## v15.7.6 — Voice Diagnostic content-fit modal correction (11 Oktober 2026)
- Voice Diagnostic modal now uses intrinsic height (`height: auto`) with a viewport `max-height`; short panels no longer stretch to the full screen and leave a large empty area.
- Long diagnostic content still scrolls within the modal; the sticky header and existing Dark Glass layout are preserved.
- Narrow-screen rule respects intrinsic height; About modal behavior remains unchanged.
- Local parser/integration regression tests run; device scroll verification remains pending.

## v15.7.6 — Voice Diagnostic native scroll & version consistency (2026-10-11)
- Replaced zero-height nested flex scrolling in Voice Diagnostic with one native modal scroll container and sticky header. Five diagnostic sections retain natural document flow; fixes giant blank vertical gap seen on mobile.
- Synchronized visible application version, About, diagnostics, generated guides, diagnostic report metadata, PWA manifest and service-worker cache to v15.7.6.
- Preserved User Management, Mahjong scoring, Voice Parser and Gemini Auto-Fix behavior. Device verification still required.

## v15.7.6 candidate — Voice Diagnostic flex scroll sizing (not deployed)
- Fix the Voice Diagnostic scroll viewport collapsing to a narrow strip: make the content pane flex:1 1 0% with zero base height, while keeping the header non-shrinking.
- Scope changes to Voice Diagnostic; User Management and Mahjong rules remain untouched.
- Device/browser verification remains pending.

## v15.7.6 — Voice Diagnostic scroll candidate (11 Oktober 2026)
- Menyatukan scroll Voice Diagnostic di area konten, bukan modal; header tetap di atas.
- Menghilangkan tinggi nol paksa pada area scroll, mempertahankan min-height:0 dan menambah ruang bawah safe-area untuk Safari iPhone.
- Tidak mengubah User Management, Voice Parser, aturan skor, atau fitur lain.
- Pengujian pada perangkat asli masih diperlukan.

## v15.7.6 candidate — User Management CSS consolidation (not deployed)
- Remove obsolete conflicting mobile list-scroll declarations; retain scrolling on the User Management modal and the existing expanded-list presentation.
- No changes to scoring, authentication, or Voice Parser.

## v15.7.6 Candidate — Voice integration fixture maintenance (2026-10-11)
- Replace obsolete simulated unresolved command `Yeni cemok` with synthetic `Yenny pisang aja` in isolated Gemini integration tests. `Yeni cemok` is now a supported parser regression case.
- No changes to Mahjong scoring rules or production Voice Parser in this step.
- Production Gemini/Supabase and device testing remain pending.

## v15.7.6 candidate — GitHub outcome regression verification (11 October 2026)
- Extend isolated Gemini Auto-Fix integration tests to verify GitHub Actions output and summary for UNRESOLVED and VERIFIED_PATCH.
- No changes to parser, score calculations, or application version marker.
- Production Supabase/Gemini and device behavior still require validation.

## v15.7.6 candidate — Explicit Gemini Auto-Fix outcome reporting (belum deploy)
- Catat status NO_CHANGE, UNRESOLVED, atau VERIFIED_PATCH dalam GitHub Actions summary/output; koreksi belum selesai tidak dilaporkan sebagai perbaikan berhasil.
- UNRESOLVED tetap safe no-op tanpa perubahan parser atau commit; VERIFIED_PATCH masih memerlukan validasi dan push.
- Tambah pemeriksaan regresi status UNRESOLVED pada simulasi; tidak mengubah versi runtime atau skor.

## v15.7.6 candidate — Gemini rejected-proposal regression verification (belum deploy)
- Tambah skenario integrasi untuk proposal Gemini yang sintaksnya valid tetapi tidak memperbaiki koreksi terkonfirmasi; wajib ditolak tanpa mengubah parser atau membuat fixture runtime.
- Tidak ada perubahan pada aturan skor, versi runtime aplikasi, atau konfigurasi Supabase.

## v15.7.6 candidate — Quad guide overlay audit (belum deploy)
- Pindahkan garis indikator wheel Quad dari pseudo-element di dalam scroll container menjadi elemen overlay saudara di luar area scroll.
- Pertahankan Voice startup visibility fix dari kandidat sebelumnya.
- Pengujian parser dan simulasi Auto-Fix PASS; integrasi Supabase/Gemini produksi serta uji visual perangkat belum diverifikasi.

## v15.7.6 — Voice button startup visibility and Quad wheel indicator (local candidate)
- Voice buttons start hidden until account session permissions are resolved, avoiding a brief visible button on refresh before Voice OFF is applied.
- Quad wheel selection guide uses a fixed absolute overlay rather than a sticky scrolling pseudo-element to reduce line alignment artifacts on mobile.
- Verified existing Gemini Auto-Fix safe no-op handling and isolated regression tests; live Gemini/Supabase and mobile rendering still require verification.

## v15.7.3 — Modal Header Containment Fix
- Unified Settings and User Management modal header layout; removed old negative top offset for User Management on mobile.
- Kept header and close button within modal scroll container and safe-area bounds. No changes to user management behavior or rules content.

## v15.7.2 — Fixed Dark Glass Settings, Compact Header & Auto-Fix Safety (2026-10-11)
- Perbaiki header Setting agar ringkas dan tetap di dalam jendela, dengan satu area scroll dan batas tinggi layar.
- Samakan penanda versi aplikasi, About, diagnostik, manifest dan cache PWA ke v15.7.2.
- Cegah koreksi Gemini yang belum lolos verifikasi masuk ke fixture regresi sementara; pengujian awal dan akhir tetap konsisten.
- Tambahkan pengujian integrasi agar proposal gagal/no-op tidak meninggalkan fixture.
- Kunci tampilan gelap seluruh modal Setting dan submenu agar tidak berubah mengikuti Light/Dark Mode iPhone, Android, atau desktop.
- Header transparan dengan blur; tombol Setting dan teks tetap kontras.
- Tambahan Poin Manual satu baris dengan ukuran teks selaras dan switch ON/OFF tetap hanya area interaktif.
- Aturan Bermain Mahjong: hanya warna/material jendela, panel dan teks yang disesuaikan; isi, gambar, susunan dan logika tidak diubah.

## v15.7.1 — Settings, User Management & Voice Visibility (2026-10-11)
- Tambahan Poin Manual: label normal seperti menu lain; switch kanan menampilkan ON/OFF, hanya switch interaktif.
- User Management: baris gelap modern, tanpa switch pada daftar; ikon gear diperkecil 2px.
- Navigasi Setting → User Management langsung tampil; X User Management kembali ke Setting.
- Voice Recognition OFF: tombol Voice permainan, Game Baru, dan Edit Nama disembunyikan, tanpa pesan peringatan; Feedback lokal otomatis dipaksa OFF dan disabled di Pengaturan Pengguna.
- Header modal Setting dan submenunya menggunakan latar solid agar isi tidak menembus saat scroll.
- Tidak ada perubahan SQL, Edge Functions, workflow, atau voice parser.

## v15.7.0 — Manual Points Switch Inside Setting Button
- Tombol Tambahan Poin Manual kini satu area tombol penuh yang konsisten dengan tombol Setting lainnya. Hanya switch ON/OFF di dalam sisi kanan yang interaktif; teks dan area kosong tidak dapat ditekan.
- Seluruh fungsi dan fitur v15.6.99 dipertahankan.

## v15.7.0 — Voice mode inside Diagnostic and manual points switch
- Moved authoritative Voice Parser mode control into Voice Diagnostic section 5; Stable mode keeps only section 5 accessible to administrators, with voice tests and Auto-Fix disabled.
- Replaced Settings manual points checkbox row with a non-clickable standard button and adjacent accessible ON/OFF switch.
- Preserved Supabase-backed mode updates, settings navigation, parser logic, and previous features.

## v15.6.98 — Settings & Voice Diagnostic navigation
- Setting closes with ×; submenu close returns to Setting.
- Gemini Auto-Update details grouped under collapsible Voice Diagnostic section, with one server-backed mode control retained in Setting for Stable-mode recovery.
- Removed obsolete Quad correction button and handler.

## v15.6.97 — Voice Parser Auto-Fix offline integration audit (2026-10-10)
- Add isolated mock Supabase/Gemini integration tests for the Auto-Fix workflow.
- Regression cases ensure ownerless Kong/Quad/Gang commands do not assign a player.
- Empty Gemini responses now retry once; explicit safe no-op reports unresolved corrections.
- Preserve all parser behavior and exact-match safeguards; no live Supabase/GitHub credentials used in offline tests.

## v15.6.96 — Confirmed Quad zero normalization (2026-10-10)
- Normalize confirmed diagnostic Quad values of 0 to null in memory when preparing Gemini regression fixtures; positive counts remain unchanged.
- Preserve original Supabase diagnostics and strict parser output contract; do not silently equate 0 and null in the parser itself.
- Add a regression check that “Yeni cemok” does not fabricate a Kong; Zi Mo correction remains pending for Gemini to solve.
- Preserve exact-match patch safety, retries, existing gameplay and UI. Cloud Gemini run not yet verified.

## v15.6.95 — Gemini Auto-Fix verified patch retry (2026-10-10)
- Strengthened Gemini prompt to require an exact, unique source substring.
- Added one bounded retry for malformed, unmatched, or failing Gemini proposals, with diagnostic reason but no source/voice-data logging.
- Preserved exact-once replacement, function preservation, prohibited-capability checks, syntax and confirmed-case checks, and GitHub regression tests before commit.
- Rejected bare Kong/Quad commands that attempt to assign a player without naming one.
- No Supabase schema, Edge Function, or GitHub Actions changes required for this release.

## v15.6.94 — Gemini Auto-Fix workflow cleanup (2026-10-10)
- Removed obsolete Pull Request trigger and bot PR-only restriction from Voice Parser Guard; retained push-to-main, manual trigger, syntax checks and regression tests.
- Kept required dot-prefixed `.github/`, `.gitignore`, `.nojekyll` names unchanged.
- Preserved Gemini safe no-op response handling and all existing parser and application functionality.
- Updated visible app version and PWA cache identifier; no Supabase schema or Edge Function changes.
- The separate Supabase GitHub dispatch HTTP 403 issue is not resolved by this workflow cleanup.

## Maintenance — 10 Oktober 2026 (tetap v15.6.93)
- Gemini Voice Auto-Fix: instruksi format JSON konsisten; respons kosong, bukan JSON, atau tanpa usulan perubahan ditangani sebagai safe no-op. Patch parsial/bertipe salah tetap ditolak. Diagnostik finishReason tanpa membocorkan respons Gemini.
- Tidak mengubah parser, UI, versi aplikasi, atau pengaturan GitHub/Supabase. HTTP 403 dispatch Supabase perlu pemeriksaan terpisah.

## v15.6.93 — Administrator Voice Auto-Update Mode (2026-10-10)

- Added Administrator Setting to switch Gemini Voice Parser Auto-Update between Development and Stable.
- Added authenticated `mahjong-voice-auto-mode` Edge Function to read/update and verify the GitHub Actions variable.
- Manual trigger checks the same GitHub mode as the scheduled workflow, failing closed on lookup errors.
- Stable mode hides Voice Diagnostic but keeps ordinary voice scoring available.
- Preserved Gemini parser fix from commit `217739f` and all existing gameplay features.
- Updated application version references, PWA manifest, and service worker cache.

## v15.6.92 — Verified correction-triggered Gemini Auto-Fix
- After confirmed correction is saved to Supabase, request authenticated server-side dispatch.
- Edge Function validates correction ownership and contents, checks Mode Pengembangan, and dispatches GitHub Actions without browser secrets.
- SQL ledger prevents repeat dispatch per correction; scheduled 06.00 WIB Auto-Fix remains.
- Requires Edge Function deployment and GitHub token Supabase secret; until configured, daily workflow remains available.

## v15.6.91 — Administrator confirmed voice corrections
- Voice Diagnostic now supports explicit correction confirmation for latest Free/Test Voice or Safari game recognition transcript, including Quad count, Zi Mo winner and HU winner/discarder.
- Confirmed examples use the existing voice_debug confirmed_correction schema and offline queue, consumed by the existing Gemini proposal workflow. No score changes; no auto-merge.
- Existing v15.6.90 features preserved.
- Static JavaScript syntax and voice parser regression tests passed; device/browser integration remains untested.

## v15.6.90 — Confirmed Safari Quad corrections + scheduled Gemini proposals
- Admin Voice Debug: explicit confirmation of latest Safari transcript as Quad for a selected active player and count. Text-only, no scoring action; queued via existing Supabase diagnostic pipeline.
- Gemini workflow checks daily at 09:00 WIB (02:00 UTC) and supports manual runs; opens PR only for parser changes, never auto-merges.
- No database schema or Edge Function changes. Requires existing diagnostics insert permissions and GitHub secrets.
- Manual browser testing and scheduled cloud execution remain to be verified after deployment.

## v15.6.89 — GitHub Desktop workflow safety correction (packaging revision)
- Gemini Auto-Fix manual-only; automatic schedule and automatic merge removed.
- Voice Parser Regression runs for every pull request targeting main; parser-only restriction applies to bot proposals.
- Ignore macOS .DS_Store files; update GitHub setup guidance.
- No application, scoring, parser, Supabase SQL, or Edge Function changes.

## v15.6.89 — Safari Voice Quad recognition
- Contextual Safari correction: Hari kuat/kong/cong satu -> Ari Quad 1 only if Ari is an active player and Hari is not.
- Bare Hari satu and Aliong satu remain unrecognized (no speculative Quad ownership).
- Login, header and About version display synchronized to v15.6.89; service worker cache bumped.
- Voice one-button flow and prior features preserved.
- No Supabase SQL or Edge Function changes.

## v15.6.87 — Workflow Packaging Fix
- Ensure `.github/workflows/gemini-voice-autofix.yml` and `voice-parser-guard.yml` are included.
- Preserve required `tests/` and `scripts/`; add upload guidance for hidden `.github` directory.
- No changes to `index.html`, `js/voice-parser.js`, scoring or Supabase.

## v15.6.83 — Safari stage retry and contextual HU
- Remove permanent Mulai ulang tahap button; Voice retries the current stage.
- Stage indicators can be tapped to revisit earlier stages without clearing other fields.
- Dedicated Safari winner parser for HU/Huda/dari and Zi Mo; uses active player names.
- Evaluate up to five Safari alternatives; reject ties between conflicting valid interpretations rather than requiring every alternative to match.
- No SQL or Edge Function changes from v15.6.82.

## v15.6.82 — Gemini fleksibel, hanya dua engine admin
- Administrator memilih Safari bertahap atau Gemini fleksibel; mode Gemini lama dimigrasikan pada pembacaan.
- Gemini menerima ucapan lengkap maupun beberapa ucapan; hasil ditambahkan ke preview tanpa mencatat skor.
- Stage hint membantu interpretasi nama + angka sebagai Quad hanya pada konteks Quad.
- Edge Function tetap memverifikasi izin admin dan validasi pemain.
- Memerlukan deploy ulang mahjong-user-admin dan mahjong-voice-interpret.

# v15.6.81 — Administrator-Assigned Voice Modes (9 Oktober 2026)

- Administrator menetapkan satu dari tiga mode Voice per akun: Safari 3 tahap, Gemini 3 tahap, Gemini sekaligus.
- Pengguna tidak dapat memilih engine; mode disimpan dalam app_metadata Supabase dan ditegakkan ulang oleh Edge Function Gemini.
- Safari tahap 1 pemenang HU/Zi Mo, tahap 2 nama + jumlah Quad (tanpa perlu menyebut Quad), tahap 3 kombinasi. Tahap 2/3 dapat dilewati.
- Gemini mode bertahap menafsirkan hanya perintah tahap aktif; mode sekaligus menafsirkan seluruh ucapan. Model menerima alternatif transkripsi dan daftar nama/kombinasi.
- Voice tetap hanya mengisi preview; tombol Catat Hasil Tangan tetap manual.
- Mode lama tanpa metadata baru default Safari bertahap. Pengaturan lama Gemini Voice digantikan pilihan mode.
- Perlu deploy ulang dua Edge Function: mahjong-user-admin dan mahjong-voice-interpret; tanpa perubahan SQL.
- Pemeriksaan sintaks JS dan struktur ZIP dilakukan; uji mikrofon Safari/Android dan Supabase aktual masih diperlukan.

## v15.6.80
- Contextual Safari Huda → HU dari, only with unique active players.
- Gemini grounding checks all Safari alternatives.
- Two player + number phrases can appear as provisional Quad values in preview, with uncertainty warning; never auto-record.
- Preserve v15.6.79 features.

## v15.6.78 — Quad Ownership Validation

- Parser diagnostik Quad memakai hasil segmen berjangkar pemain, bukan fuzzy hit yang dapat mengalihkan Quad ke Ari.
- Ejaan Fery dipetakan ke Ferry hanya dalam konteks perintah Quad lengkap dan unik.
- Grounding Gemini menolak pemilik Quad yang salah dan mencatat konflik yang sudah terselesaikan secara terpisah dari konflik belum pasti.
- Seluruh fitur v15.6.77 dipertahankan.

## v15.6.77 — Contextual Multi-Command Grounding
- Exact player-anchored HU/Quad/combination recognition, unique active-name matching for Safari drift, safe Gemini/local merge.
- No SQL or Edge Function changes.

v15.6.76 — Voice Debug dipisahkan sebagai panel keempat yang mandiri (setelah Test Voice), dengan hitungan riwayat 0–5. Tidak ada perubahan parser/AI.

## v15.6.75 — Contextual Voice Grounding and Debug Placement
- Voice Debug moved immediately below Mulai Test Voice / Hapus Hasil; dark, legible header.
- Context-scoped Safari HU repair: `<active player> ibu dari Yeni/Yenny` only when Yenny is an active player.
- Context-scoped Quad phonetic `quot` and anchored per-player validation.
- Grounding diagnostics include rejection reasons and segments.
- No SQL or Edge Function changes.

## v15.6.74 — Voice Debug & Contextual HU

- Administrator Voice Diagnostic now includes a collapsible read-only **Voice Debug · Voice permainan** panel.
- Captures Safari/Android speech transcription alternatives, local parser interpretation, local decision, Gemini response/error, and per-command grounding decisions for the most recent five debug events in browser localStorage only. No audio is recorded or uploaded by this debug panel.
- Adds a context-dependent HU correction for `Andi ku dari Yenny` / `Andi ku dari Yeni`, only when the two distinct active players can be recognized on either side of the phrase. `ku` is not a global HU alias.
- Existing voice score button, manual score confirmation, Gemini permissions, Supabase functions, and all previous features remain in place.
- No SQL or Edge Function redeployment required for this release.
- JavaScript syntax and representative parser test cases checked; live Safari/Android microphone tests pending.

## v15.6.79
- Game Baru Voice accepts four short names in 東/南/西/北 order, with or without separators, and retains numbered names.
- Edit Nama Pemain now has its own Voice button: “Ari diganti Yenny”; duplicate names require explicit resolution and save validation.
- Voice recognition shares the existing microphone lifecycle, with no automatic saving.

## v15.6.85 — Voice otomatis satu tombol
- Hapus pemilihan tahap, indikator 1/3–3/3, dan tombol Lewati tahap.
- Safari mengenali HU/Zi Mo, Quad eksplisit, dan kombinasi dari setiap ucapan dalam urutan bebas; memeriksa hingga lima alternatif transkripsi.
- Gemini menerima perintah campuran maupun perintah terpisah, tanpa petunjuk tahap yang membatasi interpretasi.
- Hasil Voice melengkapi preview, tidak otomatis mencatat tangan. Quad tanpa kata perintah yang ambigu tidak diterapkan otomatis.
- Pengaturan engine Safari/Gemini tetap hanya oleh Administrator. Tidak ada perubahan Edge Function/SQL.

## v15.6.85 — Auto-upload Voice Debug for scorekeepers
- Every authenticated administrator/scorekeeper automatically queues voice-debug text events to Supabase (including offline retry); no scorekeeper diagnostic UI.
- Admin Voice Diagnostic can view 50 newest cloud reports and request Gemini analysis of the latest report.
- RLS migration in the single active supabase_latest.sql permits INSERT of own events by scorekeepers; only admins can SELECT.
- New admin-only Edge Function `mahjong-voice-review` requires deployment and GEMINI_API_KEY.
- No automatic GitHub code modifications, rule deployment, or PR creation in this release; Gemini analysis provides suggestions only.
- Text transcripts and technical metadata are transmitted; raw audio is not uploaded. Login UI contains diagnostic notice.

## v15.6.86 — Gemini Voice Parser Auto-Fix infrastructure
- Added GitHub Actions proposal/PR/auto-merge workflow and parser-only guard; `index.html` unchanged.
- Added baseline parser regression and verified-correction gate. No confirmed correction means no code changes.
- Requires one-time GitHub secrets and branch protection configuration; see AUTO_FIX_SETUP.md.

### Stage 14 evidence bundle — 13 October 2026 (DO NOT DEPLOY)
- Added offline consolidated access/schema/type/default evidence gate; six tests; 479 local PASS, 0 FAIL. Cloud Sync OFF.

- Stage 14 local checkpoint (487 PASS): add fail-closed RPC exposure evidence reviewer and 8 isolated tests; no production changes.

### Stage 14–16 — Activation lossless queue guard (DO NOT DEPLOY, 2026-10-13)
- Apply lossless JSON snapshot validation/cloning to saves received during cloud activation, not just ordinary saves.
- Reject invalid snapshots before durable enqueue; preserve point-in-time snapshots when input objects are mutated.
- Added 3 tests; local Node suite 572 PASS / 0 FAIL. Cloud Sync remains OFF.


# Archived Stage and Checkpoint Notes (verbatim, Stage 17 Step 31)


---

## SOURCE: CHECKPOINT_STAGE13_357_CONCURRENT_COMMIT.md

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

## SOURCE: CHECKPOINT_V15.7.15_PENGEMBANGAN.md

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

## SOURCE: POSTGRES_INTEGRATION_TEST_PLAN.md

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

## SOURCE: SQL_REVIEW_ARCHIVE_DO_NOT_EXECUTE.md

# SQL candidate and test archive — DO NOT EXECUTE

Historical source preserved for audit. Code fences are not executable migrations.

## STAGE13_VALIDATOR_NESTED_READONLY_394.sql

```sql
-- READ ONLY: regression characterization of the *installed* validator.
-- Expected under desired behavior: true, false, false, false.
-- Current installed Supabase behavior as of 2026-10-12: true, true, true, true.
-- Do not mistake this for a migration; it contains no writes.
WITH cases(label, entry, expected) AS (
 VALUES
  ('valid_history_quads', '{"quads":[1,0,0,0]}'::jsonb, true),
  ('invalid_history_quads', '{"quads":[5,0,0,0]}'::jsonb, false),
  ('invalid_history_delta', '{"delta":[1,2,3]}'::jsonb, false),
  ('invalid_history_winds', '{"seatWindsBefore":[0,0,2,3]}'::jsonb, false)
)
SELECT label, expected,
 public.mahjong_sync_valid_game(jsonb_build_object(
  'names', jsonb_build_array('Ari','Yenny','Budi','Susi'),
  'scores', jsonb_build_array(0,0,0,0),
  'history', jsonb_build_array(entry), 'dealer', 0, 'round', 1
 )) AS actual
FROM cases ORDER BY label;

```

## STAGE14_16_EXISTING_PROJECT_SAFE_PREFLIGHT.sql

```sql
-- STAGE 14-16: SAFE TRANSACTIONAL REHEARSAL (NO PERSISTENT CHANGES)
-- Run ONLY after independent review of the candidate and backup confirmation.
-- This script is a preflight wrapper, NOT an installation migration.
-- It intentionally does not call any write RPC or mutate data.
SELECT current_database() AS database_name, current_user AS executor,
       (SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
        WHERE n.nspname='public' AND p.proname IN
        ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader',
         'mahjong_sync_read','mahjong_sync_lease_status')) AS installed_target_rpc_count;

```

## STAGE17_HISTORY_VALIDATOR_ISOLATED_ROLLBACK_ONLY.sql

```sql
-- STAGE 17: ISOLATED PostgreSQL TEST ONLY. DO NOT DEPLOY.
-- BEGIN/ROLLBACK guarantee that pg_temp function and any transaction-local effects do not persist.
-- This does NOT modify public.mahjong_sync_valid_game or install five RPCs.
BEGIN;
CREATE FUNCTION pg_temp.mahjong_history_integer_valid(v jsonb, max_abs bigint)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $int$
 SELECT pg_catalog.jsonb_typeof(v)='number'
    AND v::text ~ '^-?[0-9]+$'
    AND pg_catalog.length(pg_catalog.ltrim(v::text, '-'))<=12
    AND CASE WHEN v::text ~ '^-?[0-9]{1,12}$' THEN (v::text)::numeric BETWEEN -max_abs AND max_abs ELSE false END;
$int$;
CREATE FUNCTION pg_temp.mahjong_history_known_fields_valid(p_game jsonb)
RETURNS boolean LANGUAGE plpgsql IMMUTABLE SET search_path = '' AS $fn$
DECLARE e jsonb; v jsonb; k text; item jsonb; n integer;
BEGIN
 IF pg_catalog.jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR pg_catalog.jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN RETURN false; END IF;
 FOR e IN SELECT value FROM pg_catalog.jsonb_array_elements(p_game->'history') LOOP
  IF pg_catalog.jsonb_typeof(e) IS DISTINCT FROM 'object' THEN RETURN false; END IF;
  FOREACH k IN ARRAY ARRAY['delta','before','quads','seatWindsBefore','namesAtTime','playerPatterns'] LOOP
   IF e ? k THEN
    v := e->k;
    IF pg_catalog.jsonb_typeof(v) IS DISTINCT FROM 'array' OR pg_catalog.jsonb_array_length(v) <> 4 THEN RETURN false; END IF;
    FOR item IN SELECT value FROM pg_catalog.jsonb_array_elements(v) LOOP
     IF k='namesAtTime' THEN
      IF pg_catalog.jsonb_typeof(item) IS DISTINCT FROM 'string' OR pg_catalog.char_length(item #>> '{}')>100 THEN RETURN false; END IF;
     ELSIF k='playerPatterns' THEN
      IF pg_catalog.jsonb_typeof(item) <> 'null' THEN
       IF pg_catalog.jsonb_typeof(item) IS DISTINCT FROM 'object' OR pg_catalog.jsonb_typeof(item->'name') IS DISTINCT FROM 'string' OR pg_catalog.char_length(item->>'name')>100 OR NOT pg_temp.mahjong_history_integer_valid(item->'points',999999999999) THEN RETURN false; END IF;
      END IF;
     ELSE
      IF NOT pg_temp.mahjong_history_integer_valid(item, CASE WHEN k='quads' THEN 4 WHEN k='seatWindsBefore' THEN 3 ELSE 999999999999 END) THEN RETURN false; END IF;
      IF k IN ('quads','seatWindsBefore') AND item::text LIKE '-%' THEN RETURN false; END IF;
     END IF;
    END LOOP;
    IF k='seatWindsBefore' AND (SELECT count(DISTINCT value) FROM pg_catalog.jsonb_array_elements(v)) <> 4 THEN RETURN false; END IF;
   END IF;
  END LOOP;
  FOREACH k IN ARRAY ARRAY['winner','dealer','discarder','roundWind'] LOOP
   IF e ? k AND NOT (k<>'roundWind' AND pg_catalog.jsonb_typeof(e->k)='null') THEN
    IF NOT pg_temp.mahjong_history_integer_valid(e->k,3) OR (e->>k) LIKE '-%' THEN RETURN false; END IF;
   END IF;
  END LOOP;
  IF e ? 'method' AND pg_catalog.jsonb_typeof(e->'method') IS DISTINCT FROM 'string' THEN RETURN false; END IF;
  IF e ? 'patterns' THEN
   IF pg_catalog.jsonb_typeof(e->'patterns') IS DISTINCT FROM 'array' THEN RETURN false; END IF;
   FOR item IN SELECT value FROM pg_catalog.jsonb_array_elements(e->'patterns') LOOP
    IF pg_catalog.jsonb_typeof(item) IS DISTINCT FROM 'string' THEN RETURN false; END IF;
   END LOOP;
  END IF;
 END LOOP;
 RETURN true;
END $fn$;

-- Self-test: expected values (read-only test fixtures)
WITH cases(label, history, expected) AS (VALUES
 ('empty legacy', '[{}]'::jsonb, true),
 ('unknown metadata', '[{"old":{"x":1}}]'::jsonb, true),
 ('valid full', '[{"delta":[0,1,-1,0],"before":[0,0,0,0],"quads":[0,1,2,4],"seatWindsBefore":[0,1,2,3],"winner":null,"playerPatterns":[null,{"name":"龍🐉","points":2},null,null],"method":"hu","patterns":["a"],"namesAtTime":["甲","乙","丙","丁"]}]'::jsonb, true),
 ('bad delta length', '[{"delta":[1]}]'::jsonb, false),
 ('bad quad range', '[{"quads":[0,1,2,5]}]'::jsonb, false),
 ('duplicate winds', '[{"seatWindsBefore":[0,0,2,3]}]'::jsonb, false),
 ('bad player patterns', '[{"playerPatterns":[{},null,null,null]}]'::jsonb, false),
 ('bad float', '[{"before":[0,1.5,0,0]}]'::jsonb, false),
 ('bad null delta', '[{"delta":[0,null,0,0]}]'::jsonb, false),
 ('bad method', '[{"method":2}]'::jsonb, false),
 ('bad patterns', '[{"patterns":[1]}]'::jsonb, false),
 ('bad roundWind null', '[{"roundWind":null}]'::jsonb, false)
)
SELECT label, expected, pg_temp.mahjong_history_known_fields_valid(pg_catalog.jsonb_build_object('history',history)) AS actual,
 expected=pg_temp.mahjong_history_known_fields_valid(pg_catalog.jsonb_build_object('history',history)) AS pass
FROM cases;
ROLLBACK;

```

## supabase_sync_admin_unlock_draft.sql

```sql
-- STAGING DESIGN ONLY. NEVER EXECUTE ON PRODUCTION.
-- Explicit review required: administrator-controlled device recovery.
DO $$ BEGIN RAISE EXCEPTION 'UNSAFE DRAFT: admin device unlock not verified on PostgreSQL'; END $$;
BEGIN;
-- Append-only recovery trail; never delete historical sessions or game data.
CREATE TABLE IF NOT EXISTS public.mahjong_device_unlock_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  administrator_id uuid NOT NULL REFERENCES auth.users(id),
  scorekeeper_id uuid NOT NULL REFERENCES auth.users(id),
  expected_device_id uuid NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mahjong_device_unlock_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.mahjong_device_unlock_audit FROM PUBLIC, anon, authenticated;
-- WARNING: this RPC is a draft; role/auth-session verification needs runtime review.
CREATE OR REPLACE FUNCTION public.mahjong_sync_admin_unlock_device(
  p_scorekeeper_id uuid, p_expected_device_id uuid
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_admin uuid := auth.uid(); v_admin_role text; v_target_role text;
BEGIN
  IF v_admin IS NULL OR p_scorekeeper_id IS NULL OR p_expected_device_id IS NULL
    THEN RAISE EXCEPTION 'Unauthorized or invalid request' USING ERRCODE='42501'; END IF;
  -- Serialize with writer-open / commit, which lock the same auth.users row.
  SELECT raw_app_meta_data->>'role' INTO v_admin_role
    FROM auth.users WHERE id=v_admin FOR UPDATE;
  IF v_admin_role IS DISTINCT FROM 'admin' OR v_admin=p_scorekeeper_id
    THEN RAISE EXCEPTION 'Administrator required' USING ERRCODE='42501'; END IF;
  SELECT raw_app_meta_data->>'role' INTO v_target_role
    FROM auth.users WHERE id=p_scorekeeper_id FOR UPDATE;
  IF v_target_role IS DISTINCT FROM 'scorekeeper'
    THEN RAISE EXCEPTION 'Target must be scorekeeper' USING ERRCODE='42501'; END IF;
  -- Fail closed: refuse stale unlock requests and ambiguous historical bindings.
  IF NOT EXISTS (SELECT 1 FROM public.mahjong_device_sessions
    WHERE user_id=p_scorekeeper_id AND device_id=p_expected_device_id AND ever_writer)
    OR EXISTS (SELECT 1 FROM public.mahjong_device_sessions
    WHERE user_id=p_scorekeeper_id AND ever_writer AND device_id<>p_expected_device_id)
    THEN RETURN jsonb_build_object('ok',false,'reason','binding-changed-or-ambiguous'); END IF;
  -- This clears writer rights, NOT scores, history, game identity or revisions.
  UPDATE public.mahjong_device_sessions
    SET is_active=false,is_writer=false,ever_writer=false,
        session_generation=session_generation+1,
        session_token_hash=NULL,revoked_at=now(),updated_at=now()
    WHERE user_id=p_scorekeeper_id;
  -- Preserve auth-session high-water marks so an older session cannot reclaim.
  INSERT INTO public.mahjong_device_unlock_audit
    (administrator_id,scorekeeper_id,expected_device_id)
    VALUES(v_admin,p_scorekeeper_id,p_expected_device_id);
  RETURN jsonb_build_object('ok',true,'status','unlocked');
END $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_admin_unlock_device(uuid,uuid) FROM PUBLIC,anon,authenticated;
-- GRANT withheld intentionally until isolated PostgreSQL authorization tests pass.
ROLLBACK;

```

## supabase_sync_preflight_readonly.sql

```sql
-- Mahjong Score Cloud Sync: READ-ONLY production preflight.
-- Safe to run in Supabase SQL Editor. No writes, no schema changes, no secrets.
-- Returns a single JSON object; share the result before any RPC deployment.
WITH required_tables(name) AS (
 VALUES ('mahjong_device_sessions'),('mahjong_game_states'),
        ('mahjong_sync_conflicts'),('mahjong_session_audit')
), table_checks AS (
 SELECT t.name, c.oid IS NOT NULL AS exists,
        COALESCE(c.relrowsecurity,false) AS rls_enabled,
        COALESCE(has_table_privilege('anon',c.oid,'SELECT'),false) AS anon_can_select,
        COALESCE(has_table_privilege('authenticated',c.oid,'SELECT'),false) AS authenticated_can_select,
        COALESCE(has_table_privilege('authenticated',c.oid,'INSERT'),false) AS authenticated_can_insert,
        COALESCE(has_table_privilege('authenticated',c.oid,'UPDATE'),false) AS authenticated_can_update
 FROM required_tables t
 LEFT JOIN pg_namespace n ON n.nspname='public'
 LEFT JOIN pg_class c ON c.relnamespace=n.oid AND c.relname=t.name AND c.relkind IN ('r','p')
), required_columns(table_name,column_name) AS (
 VALUES ('mahjong_device_sessions','auth_session_id'),
 ('mahjong_device_sessions','is_writer'),('mahjong_device_sessions','session_token_hash'),
 ('mahjong_device_sessions','revoked_at'),('mahjong_game_states','is_current')
), column_checks AS (
 SELECT table_name,column_name, EXISTS (
  SELECT 1 FROM information_schema.columns c WHERE c.table_schema='public'
   AND c.table_name=r.table_name AND c.column_name=r.column_name
 ) AS exists FROM required_columns r
), index_checks AS (
 SELECT i.indexname, i.indexdef,
        (i.indexname='mahjong_one_active_device_per_user') AS blocks_multi_device_readers
 FROM pg_indexes i
 WHERE i.schemaname='public' AND i.tablename IN ('mahjong_device_sessions','mahjong_game_states')
), index_requirements AS (
 SELECT EXISTS (SELECT 1 FROM index_checks WHERE indexname='mahjong_one_active_device_per_user') AS blocking_single_active_index_present,
        EXISTS (SELECT 1 FROM index_checks WHERE indexname='mahjong_game_states_one_current_per_owner_idx'
          AND indexdef ILIKE '%UNIQUE%' AND indexdef ILIKE '%owner_id%' AND indexdef ILIKE '%is_current%') AS current_game_unique_index_present,
        EXISTS (SELECT 1 FROM index_checks WHERE indexname='mahjong_device_sessions_user_idx') AS session_lookup_index_present
), required_rpc(name,args) AS (
 VALUES ('mahjong_sync_open','uuid,jsonb,bigint,uuid'),
        ('mahjong_sync_commit','uuid,uuid,bigint,text,bigint,jsonb'),
        ('mahjong_sync_open_reader','uuid'),
        ('mahjong_sync_peek',''),
        ('mahjong_sync_read','uuid'),
        ('mahjong_sync_lease_status','uuid,bigint')
), rpc_checks AS (
 SELECT r.name, r.args, p.oid IS NOT NULL AS installed,
        COALESCE(has_function_privilege('anon',p.oid,'EXECUTE'),false) AS anon_can_execute,
        COALESCE(has_function_privilege('authenticated',p.oid,'EXECUTE'),false) AS authenticated_can_execute,
        COALESCE(p.prosecdef,false) AS security_definer
 FROM required_rpc r
 LEFT JOIN pg_proc p ON p.oid=to_regprocedure('public.'||r.name||'('||r.args||')')
), required_functions(name,args) AS (
 VALUES ('mahjong_sync_account_permissions',''),
        ('mahjong_sync_generate_token',''),('mahjong_sync_is_admin','')
), function_checks AS (
 SELECT f.name, to_regprocedure('public.'||f.name||'('||f.args||')') IS NOT NULL AS exists
 FROM required_functions f
)
SELECT jsonb_pretty(jsonb_build_object(
 'tables', (SELECT jsonb_agg(to_jsonb(t) ORDER BY name) FROM table_checks t),
 'columns', (SELECT jsonb_agg(to_jsonb(c) ORDER BY table_name,column_name) FROM column_checks c),
 'indexes', (SELECT to_jsonb(i) FROM index_requirements i),
 'functions', (SELECT jsonb_agg(to_jsonb(f) ORDER BY name) FROM function_checks f),
 'rpc_inventory', (SELECT jsonb_agg(to_jsonb(r) ORDER BY name) FROM rpc_checks r),
 'rpc_already_installed', (SELECT jsonb_build_object(
  'open',to_regprocedure('public.mahjong_sync_open(uuid,jsonb,bigint,uuid)') IS NOT NULL,
  'commit',to_regprocedure('public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb)') IS NOT NULL,
  'peek',to_regprocedure('public.mahjong_sync_peek()') IS NOT NULL))
)) AS mahjong_sync_preflight;

```

## supabase_sync_readonly_draft.sql

```sql
-- DEVELOPMENT DRAFT ONLY. Do not deploy before full integration testing.
-- Read-only recovery endpoint. Does not activate, revoke or modify a writer lease.
BEGIN;
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_auth_session uuid;
  v_role text;
  v_multi boolean;
  v_game public.mahjong_game_states%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  -- JWT must represent a currently valid, non-expired Supabase Auth session.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (
    SELECT 1 FROM auth.sessions s WHERE s.id=v_auth_session AND s.user_id=v_uid
      AND (s.not_after IS NULL OR s.not_after>now())
  ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT u.raw_app_meta_data->>'role',
    COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)
    INTO v_role,v_multi FROM auth.users u
    WHERE u.id=v_uid AND u.deleted_at IS NULL
      AND (u.banned_until IS NULL OR u.banned_until<=now());
  IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL THEN
    RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501';
  END IF;
  -- Old single-device scorekeeper sessions must not read the active game
  -- after a newer Supabase Auth login, even if their JWT has not expired.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id)
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok',true,'hasGame',false); END IF;
  RETURN jsonb_build_object('ok',true,'hasGame',true,'gameId',v_game.id,
    'revision',v_game.revision,'game',v_game.game_data);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;
COMMIT;

```

## supabase_sync_rpc_draft.sql

```sql
-- STAGING ONLY: NOT FOR PRODUCTION UNTIL POSTGRES/SUPABASE INTEGRATION TESTS PASS.
-- Depends on v15.7.14 foundation tables.
-- FAIL-CLOSED: token issuance and authentication not yet integrated.
-- This file is deliberately NOT executable in production.
-- REVIEW: existing auth.sessions created_at ordering alone is insufficient to prove
-- the new session owns the writer lease; auth session ID must match on every commit.
DO $$ BEGIN RAISE EXCEPTION 'UNSAFE DRAFT: do not deploy; session-token validation incomplete'; END $$;
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
-- Preserve historical writer binding independently of read-only enrollments.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false;
-- Match the guarded alignment candidate: never auto-promote legacy games.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
-- Requires the foundation's existing partial unique index:
-- mahjong_game_states_one_current_per_owner_idx (owner_id WHERE is_current = true).
-- Do not create an equivalent second index here: fail closed until the
-- foundation migration is independently verified in the target environment.

-- Server-side schema validation mirrors the essential four-player client invariants.
-- Do not trust a browser-side validator as a security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN jsonb_array_length(p_game->'history') ELSE NULL END)>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(trim(leading '-' from x::text))>12) THEN false
  WHEN p_game ? 'roundWind' AND (jsonb_typeof(p_game->'roundWind') IS DISTINCT FROM 'number'
    OR (p_game->>'roundWind') !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (jsonb_typeof(p_game->'seatWinds') IS DISTINCT FROM 'array'
    OR (CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN jsonb_array_length(p_game->'seatWinds') ELSE NULL END)<>4) THEN false
  WHEN p_game ? 'seatWinds' AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number' OR x::text !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (SELECT count(DISTINCT x) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x)<>4 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'object') THEN false
  -- Keep server-side history checks aligned with the client recovery ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE (x ? 'delta' AND (jsonb_typeof(x->'delta') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN jsonb_array_length(x->'delta') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'quads' AND (jsonb_typeof(x->'quads') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN jsonb_array_length(x->'quads') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN x->'quads' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-4]$')))
    OR (x ? 'winner' AND x->'winner'<>'null'::jsonb AND (jsonb_typeof(x->'winner') IS DISTINCT FROM 'number' OR x->>'winner' !~ '^[0-3]$'))
    OR (x ? 'dealer' AND x->'dealer'<>'null'::jsonb AND (jsonb_typeof(x->'dealer') IS DISTINCT FROM 'number' OR x->>'dealer' !~ '^[0-3]$'))
    OR (x ? 'discarder' AND x->'discarder'<>'null'::jsonb AND (jsonb_typeof(x->'discarder') IS DISTINCT FROM 'number' OR x->>'discarder' !~ '^[0-3]$'))
    OR (x ? 'roundWind' AND (jsonb_typeof(x->'roundWind') IS DISTINCT FROM 'number' OR x->>'roundWind' !~ '^[0-3]$'))
    OR (x ? 'method' AND jsonb_typeof(x->'method') IS DISTINCT FROM 'string')
    OR (x ? 'playerPatterns' AND (jsonb_typeof(x->'playerPatterns') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN jsonb_array_length(x->'playerPatterns') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN x->'playerPatterns' ELSE '[]'::jsonb END) p WHERE p <> 'null'::jsonb AND
       (jsonb_typeof(p) IS DISTINCT FROM 'object' OR jsonb_typeof(p->'name') IS DISTINCT FROM 'string'
        OR length(p->>'name')>100 OR jsonb_typeof(p->'points') IS DISTINCT FROM 'number'
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM p->>'points'))>12))))
    OR (x ? 'patterns' AND (jsonb_typeof(x->'patterns') IS DISTINCT FROM 'array'
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'patterns') = 'array' THEN x->'patterns' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string')))
    OR (x ? 'seatWindsBefore' AND (jsonb_typeof(x->'seatWindsBefore') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN jsonb_array_length(x->'seatWindsBefore') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-3]$')
      OR (SELECT count(DISTINCT n) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n)<>4))
    OR (x ? 'namesAtTime' AND (jsonb_typeof(x->'namesAtTime') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN jsonb_array_length(x->'namesAtTime') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN x->'namesAtTime' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string' OR length(n #>> '{}')>100)))
  ) THEN false

  ELSE true END;
$$;
REVOKE ALL ON FUNCTION public.mahjong_sync_valid_game(jsonb) FROM PUBLIC,anon,authenticated;

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid; v_auth_created_at timestamptz;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT created_at INTO v_auth_created_at FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid;
  IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  -- NULL means this device has no local game to upload. It may adopt an existing
  -- cloud game, but must never create an empty cloud game implicitly.
  IF p_local_game IS NOT NULL AND NOT public.mahjong_sync_valid_game(p_local_game)
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  -- Persistent high-water mark: a displaced older Auth session must not
  -- reclaim the writer lease even after the newer Auth session expires or
  -- its auth.sessions row is deleted. Keep historical device rows for this guard.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501';
  END IF;
  -- Do not downgrade the persistent login high-water mark when an admin or
  -- multi-device scorekeeper reuses a device ID from an older Auth session.
  -- This also matters if multi-device permission is disabled later.
  IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
      AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','newer-login');
  END IF;
  -- A caller that supplied a preflight identity must match it regardless
  -- of whether it is adopting cloud data or already holds a local copy.
  -- Otherwise a stale client can take over a different current game.
  IF p_expected_revision IS NOT NULL AND p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Expected revision must not be negative';
  END IF;
  IF (p_expected_revision IS NULL) IS DISTINCT FROM (p_expected_game_id IS NULL) THEN
    RAISE EXCEPTION 'Both expected game ID and revision are required together';
  END IF;
  -- BETA SINGLE-DEVICE LOCK: fail closed for a DIFFERENT device.
  -- A fresh Auth session on the SAME bound device may safely rotate its lease;
  -- old credentials are revoked atomically below under the account row lock.
  -- Check under the auth.users FOR UPDATE lock above; rejected opens MUST NOT
  -- revoke or rotate the existing writer. An administrator may later provide
  -- an audited device-unlock flow; this draft intentionally does not.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.is_active AND prior.is_writer
      AND prior.device_id IS DISTINCT FROM p_device_id
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','device-locked');
  END IF;
  -- BETA DEVICE BINDING: the first registered device remains bound even if
  -- its writer lease expires or the browser signs out. A different device
  -- cannot silently become the writer just because is_active became false.
  -- Existing installations with multiple historical device IDs fail closed;
  -- administrator review/unlock is required before beta rollout.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.ever_writer AND prior.device_id IS DISTINCT FROM p_device_id
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','device-bound-to-other-device');
  END IF;
  -- Safety preflight: never revoke an existing writer before checking whether
  -- this device has a different game. The client must reconcile explicitly.
  -- A rejected takeover must leave the current writer fully operational.
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  -- Existing cloud state always requires a matching preflight, even when
  -- the caller submits an identical local snapshot. Otherwise a stale client
  -- could rotate the writer lease without first observing the current revision.
  IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  IF FOUND AND p_expected_game_id IS NOT NULL AND
     (v_game.id IS DISTINCT FROM p_expected_game_id OR
      v_game.revision IS DISTINCT FROM p_expected_revision) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- Compare local payload only after validating the cloud identity/revision.
  -- A stale preflight must not receive the full current game snapshot via
  -- the mismatch response; it must refresh and reconcile explicitly.
  IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN
    RETURN jsonb_build_object('ok',false,'reason','local-cloud-mismatch',
      'gameId',v_game.id,'revision',v_game.revision,'game',v_game.game_data);
  END IF;
  -- A takeover that adopts cloud state must be based on a prior read of its
  -- exact revision. This prevents a concurrent commit between peek and open
  -- from silently changing the state accepted by the new device.
  IF FOUND AND p_local_game IS NULL AND
     (p_expected_revision IS NULL OR p_expected_revision IS DISTINCT FROM v_game.revision
      OR p_expected_game_id IS NULL OR p_expected_game_id IS DISTINCT FROM v_game.id) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A prior peek that saw a cloud game must never fall back to creating a
  -- new game if the original game disappeared or was replaced in the interim.
  -- This is a preflight failure, not permission to bootstrap new cloud state.
  IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed');
  END IF;
  IF NOT FOUND AND p_local_game IS NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','no-cloud-game');
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      -- Revoke the credential itself, not just the writer flag. A displaced
      -- device must never retain a reusable token hash in the database.
      session_token_hash=NULL,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,ever_writer)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,v_auth_created_at,encode(extensions.digest(v_token,'sha256'),'hex'),true)
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,ever_writer=true,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id,is_current)
    VALUES(v_uid,p_local_game,0,v_session.id,true) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF NOT public.mahjong_sync_valid_game(p_game)
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 -- Persistent login high-water guard also protects writes when the newer
 -- Auth session has expired or disappeared. A stale writer token alone is
 -- insufficient to prove that an older login still owns the account.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
   JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.auth_session_created_at IS NOT NULL
     AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 -- Device binding must also be checked at COMMIT time: an administrator may
 -- disable multi-device access after a writer lease was issued. Never let a
 -- previously authorized second device continue writing under the new policy.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN public.mahjong_device_sessions prior ON prior.user_id=u.id
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.ever_writer AND prior.device_id IS DISTINCT FROM p_device_id
 ) THEN
   RETURN jsonb_build_object('ok',false,'reason','device-bound-to-other-device');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
    VALUES(v_game.id,v_uid,p_device_id,GREATEST(0,p_base_revision),p_game,v_reason);
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

-- Explicit reader enrollment. A read-only device must never call mahjong_sync_open,
-- because that operation transfers the sole writer lease.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_auth_created_at timestamptz;
 v_game public.mahjong_game_states%ROWTYPE;
 v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT created_at INTO v_auth_created_at FROM auth.sessions
  WHERE id=v_auth_session AND user_id=v_uid;
 IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
 -- Serialize with writer takeovers and commits for this account.
 SELECT raw_app_meta_data->>'role',
  COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false),
  banned_until,deleted_at INTO v_role,v_multi,v_banned,v_deleted
 FROM auth.users WHERE id=v_uid FOR UPDATE;
 IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL
  OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role<>'admin' AND NOT v_multi THEN
  RAISE EXCEPTION 'Multi-device reading not permitted' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 -- Never replace a newer recorded Auth session with an older one on a
 -- reused device ID. That would erase the persistent takeover high-water
 -- mark if multi-device access is subsequently disabled.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
  WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','newer-login');
 END IF;
 -- Never downgrade a current writer on this device. Require a separate
 -- device ID for a read-only enrollment, rather than clobber its token.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active AND is_writer
   AND revoked_at IS NULL) THEN
  RETURN jsonb_build_object('ok',false,'reason','device-already-writer');
 END IF;
 INSERT INTO public.mahjong_device_sessions
  (user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,revoked_at)
 VALUES(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL)
 ON CONFLICT(user_id,device_id) DO UPDATE SET
  is_active=true,is_writer=false,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,
  session_generation=public.mahjong_device_sessions.session_generation+1,
  session_token_hash=NULL,revoked_at=NULL,last_seen_at=now(),updated_at=now()
 RETURNING * INTO v_lease;
 INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
 VALUES(v_uid,v_uid,p_device_id,'reader-open',jsonb_build_object('game_id',v_game.id));
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',false,'generation',v_lease.session_generation);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open_reader(uuid) TO authenticated;

-- Read-only preflight: verify the exact Supabase Auth session and account status.
-- This does not create a device session, rotate a token, or modify game state.
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
    AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
 INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid;
 IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL
    OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM auth.sessions newer JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- A displaced old login must not resume metadata reads after the newer
 -- Auth session expires. The historical writer lease is the high-water mark.
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM public.mahjong_device_sessions prior
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision);
END; $$;
-- Read-only refresh for an already opened device session. Unlike peek, this
-- requires a registered, active lease for this exact Supabase Auth session.
-- It never grants writer privileges or rotates writer credentials.
CREATE OR REPLACE FUNCTION public.mahjong_sync_read(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid;
 v_game public.mahjong_game_states%ROWTYPE; v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- A newer login invalidates an older scorekeeper session unless explicitly
 -- allowed by administrator, even if its old lease has not yet been revoked.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active=true
   AND revoked_at IS NULL AND auth_session_id=v_auth_session;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 -- A reader lease is not a permanent entitlement. If the administrator
 -- disables multi-device access, reject previously enrolled reader sessions
 -- immediately instead of allowing continued cloud reads.
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
      AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',v_lease.is_writer
   AND v_lease.session_token_hash IS NOT NULL
   AND v_lease.session_generation>0
   AND v_game.writer_session_id=v_lease.id);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_read(uuid) TO authenticated;

-- Lightweight lease probe for foreground/periodic client checks. A stale device
-- must learn that its writer lease was revoked without waiting for a score edit.
-- This is advisory UI state; commit() remains the server-side security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_lease_status(p_device_id uuid,p_generation bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_auth_session uuid; v_lease public.mahjong_device_sessions%ROWTYPE;
 v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_generation<1 THEN
  RAISE EXCEPTION 'Authentication and valid lease identity required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
  RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND auth_session_id=v_auth_session
   AND session_generation=p_generation AND is_active=true AND revoked_at IS NULL;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked'); END IF;
 RETURN jsonb_build_object('ok',true,'canWrite',v_lease.is_writer
  AND v_lease.session_token_hash IS NOT NULL
  AND v_game.writer_session_id=v_lease.id,
  'gameId',v_game.id,'revision',v_game.revision);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;
COMMIT;

```

## supabase_sync_rpc_review.sql

```sql
-- Mahjong Score 4P — server RPC candidate for controlled integration testing.
-- Requires existing foundation (tables, is_writer, token_hash, revoked_at, account_permissions, token generator).
-- No changes to existing Mahjong Live Sharing / Voice tables.
-- Do not deploy to production until live database integration and app integration are verified.
-- FAIL-CLOSED: this review RPC is incompatible with the active client adapter.
-- Do not execute; the next migration must preserve expected revision/game ID
-- and must include the high-water session guard from the protected draft.
DO $$ BEGIN RAISE EXCEPTION 'UNSAFE REVIEW: RPC open signature/preflight incompatible with client; DO NOT DEPLOY'; END $$;
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT true;
-- Reuse the canonical unique partial index from supabase_latest.sql.
-- Do not create a second equivalent current-game index.
-- Prerequisite: mahjong_game_states_one_current_per_owner_idx on (owner_id) WHERE is_current = true.

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  IF jsonb_typeof(p_local_game) IS DISTINCT FROM 'object' OR octet_length(p_local_game::text)>2000000
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id)
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,session_token_hash)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,encode(extensions.digest(v_token,'sha256'),'hex'))
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,auth_session_id=v_auth_session,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id)
    VALUES(v_uid,p_local_game,0,v_session.id) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id)
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
    VALUES(v_game.id,v_uid,p_device_id,GREATEST(0,p_base_revision),p_game,v_reason);
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;
COMMIT;

```

## supabase_sync_schema_alignment_candidate.sql

```sql
-- v15.7.15 STAGING CANDIDATE ONLY — DO NOT DEPLOY.
-- Review and test in a disposable PostgreSQL/Supabase environment first.
-- Deliberate unconditional guard: must stop execution before any DDL; never run statements separately.
DO $$ BEGIN RAISE EXCEPTION 'UNSAFE SCHEMA ALIGNMENT CANDIDATE — DO NOT EXECUTE'; END $$;
BEGIN;
-- All operations below are intentionally unreachable while guard remains.
-- Historical games may legitimately share an owner. Do not reject or modify archives.
-- Existing rows are deliberately left non-current; selection requires a separately
-- reviewed, explicit reconciliation. Only multiple already-current games are unsafe.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM public.mahjong_game_states WHERE is_current=true
            GROUP BY owner_id HAVING count(*) > 1) THEN
  RAISE EXCEPTION 'Multiple current games per owner: manual is_current reconciliation required';
 END IF;
END $$;
-- Preserve existing sessions, but drop the index that blocks permitted multi-device readers.
-- Writer exclusivity must be enforced atomically in RPC with owner row lock,
-- never by this legacy active-session index.
-- Never drop an index solely by name. A reused name could belong to an
-- unrelated table or enforce a different invariant; require the legacy shape.
DO $$ BEGIN
 IF EXISTS (
   SELECT 1 FROM pg_catalog.pg_class idx
   JOIN pg_catalog.pg_namespace ins ON ins.oid=idx.relnamespace
   WHERE ins.nspname='public' AND idx.relname='mahjong_one_active_device_per_user'
 ) AND NOT EXISTS (
   SELECT 1 FROM pg_catalog.pg_index i
   JOIN pg_catalog.pg_class idx ON idx.oid=i.indexrelid
   JOIN pg_catalog.pg_namespace ins ON ins.oid=idx.relnamespace
   JOIN pg_catalog.pg_am am ON am.oid=idx.relam
   JOIN pg_catalog.pg_class tbl ON tbl.oid=i.indrelid
   JOIN pg_catalog.pg_namespace tns ON tns.oid=tbl.relnamespace
   JOIN pg_catalog.pg_attribute col ON col.attrelid=tbl.oid AND col.attnum=i.indkey[0]
   WHERE ins.nspname='public' AND idx.relname='mahjong_one_active_device_per_user'
     AND tns.nspname='public' AND tbl.relname='mahjong_device_sessions'
     AND i.indisunique AND i.indisvalid AND i.indisready AND i.indnkeyatts=1
     AND i.indnatts=1 AND i.indexprs IS NULL AND am.amname='btree'
     AND col.attname='user_id'
     AND pg_catalog.pg_get_expr(i.indpred,i.indrelid) IN ('is_active','(is_active = true)')
 ) THEN
   RAISE EXCEPTION 'Legacy active-device index definition mismatch; manual review required';
 END IF;
END $$;
DROP INDEX IF EXISTS public.mahjong_one_active_device_per_user;
ALTER TABLE public.mahjong_device_sessions ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
ALTER TABLE public.mahjong_device_sessions ADD COLUMN IF NOT EXISTS is_writer boolean NOT NULL DEFAULT false;
ALTER TABLE public.mahjong_device_sessions ADD COLUMN IF NOT EXISTS session_token_hash text;
ALTER TABLE public.mahjong_device_sessions ADD COLUMN IF NOT EXISTS revoked_at timestamptz;
-- ADD COLUMN IF NOT EXISTS is name-based only. A pre-existing column with the
-- wrong type/nullability must stop migration rather than silently corrupt leases.
DO $$ BEGIN
 IF EXISTS (
   SELECT 1 FROM (VALUES
     ('mahjong_game_states','is_current','boolean',true),
     ('mahjong_device_sessions','auth_session_id','uuid',false),
     ('mahjong_device_sessions','auth_session_created_at','timestamp with time zone',false),
     ('mahjong_device_sessions','is_writer','boolean',true),
     ('mahjong_device_sessions','session_token_hash','text',false),
     ('mahjong_device_sessions','revoked_at','timestamp with time zone',false)
   ) expected(table_name,column_name,type_name,must_not_null)
   LEFT JOIN pg_catalog.pg_namespace ns ON ns.nspname='public'
   LEFT JOIN pg_catalog.pg_class tbl ON tbl.relnamespace=ns.oid AND tbl.relname=expected.table_name AND tbl.relkind IN ('r','p')
   LEFT JOIN pg_catalog.pg_attribute attr ON attr.attrelid=tbl.oid AND attr.attname=expected.column_name AND attr.attnum>0 AND NOT attr.attisdropped
   WHERE attr.attnum IS NULL OR pg_catalog.format_type(attr.atttypid,attr.atttypmod)<>expected.type_name
      OR (expected.must_not_null AND NOT attr.attnotnull)
 ) THEN
   RAISE EXCEPTION 'Sync schema column type/nullability mismatch; manual review required';
 END IF;
END $$;
-- Existing historical games remain non-current unless explicitly reconciled.
-- A game must be explicitly selected as current in a separately reviewed migration.
CREATE UNIQUE INDEX IF NOT EXISTS mahjong_game_states_one_current_per_owner_idx
 ON public.mahjong_game_states(owner_id) WHERE is_current = true;
-- IF NOT EXISTS only checks an index name; it does not validate its definition.
-- Abort atomically if an unrelated/non-unique index occupies the required name.
DO $$ BEGIN
 IF NOT EXISTS (
  SELECT 1 FROM pg_catalog.pg_index i
  JOIN pg_catalog.pg_class idx ON idx.oid=i.indexrelid
  JOIN pg_catalog.pg_namespace idx_ns ON idx_ns.oid=idx.relnamespace
  JOIN pg_catalog.pg_am am ON am.oid=idx.relam
  JOIN pg_catalog.pg_class tbl ON tbl.oid=i.indrelid
  JOIN pg_catalog.pg_namespace ns ON ns.oid=tbl.relnamespace
  JOIN pg_catalog.pg_attribute col ON col.attrelid=tbl.oid AND col.attnum=i.indkey[0]
  WHERE ns.nspname='public' AND idx_ns.nspname='public' AND tbl.relname='mahjong_game_states'
    AND idx.relname='mahjong_game_states_one_current_per_owner_idx'
    AND i.indisunique AND i.indisvalid AND i.indisready
    AND i.indnkeyatts=1 AND col.attname='owner_id'
    AND i.indnatts=1 AND i.indexprs IS NULL AND am.amname='btree'
    AND pg_catalog.pg_get_expr(i.indpred,i.indrelid) IN ('(is_current = true)','is_current')
 ) THEN
  RAISE EXCEPTION 'Current-game index definition mismatch; manual review required';
 END IF;
END $$;
-- No grants, RPC activation, or Cloud Sync activation in this candidate.
COMMIT;

```

## supabase_sync_stage14_CROSS_SESSION_ISOLATED_ROLLBACK_ONLY.sql

```sql
-- ROLLBACK-ONLY RPC INTEGRATION TEST: NEVER DEPLOY.
-- All CREATE/ALTER/GRANT statements are transaction-scoped and rolled back.
-- Existing Supabase project only: requires isolated test accounts and two-device verification.
-- Depends on v15.7.14 foundation tables.
-- FAIL-CLOSED: token issuance and authentication not yet integrated.
-- This file is deliberately NOT executable in production.
-- REVIEW: existing auth.sessions created_at ordering alone is insufficient to prove
-- the new session owns the writer lease; auth session ID must match on every commit.
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
-- Preserve historical writer binding independently of read-only enrollments.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false;
-- Match the guarded alignment candidate: never auto-promote legacy games.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
-- ADD COLUMN IF NOT EXISTS does not alter an existing DEFAULT true.
-- Explicitly align future implicit inserts; do not rewrite existing game rows.
ALTER TABLE public.mahjong_game_states ALTER COLUMN is_current SET DEFAULT false;
-- Existing verified index: mahjong_one_current_game_per_owner (owner_id WHERE is_current = true).
-- Do not create an equivalent second index here: fail closed until the
-- foundation migration is independently verified in the target environment.

-- Server-side schema validation mirrors the essential four-player client invariants.
-- Do not trust a browser-side validator as a security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN false
  WHEN jsonb_array_length(p_game->'history')>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(trim(leading '-' from x::text))>12) THEN false
  WHEN p_game ? 'roundWind' AND (jsonb_typeof(p_game->'roundWind') IS DISTINCT FROM 'number'
    OR (p_game->>'roundWind') !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (jsonb_typeof(p_game->'seatWinds') IS DISTINCT FROM 'array'
    OR (CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN jsonb_array_length(p_game->'seatWinds') ELSE NULL END)<>4) THEN false
  WHEN p_game ? 'seatWinds' AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number' OR x::text !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (SELECT count(DISTINCT x) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x)<>4 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'object') THEN false
  -- Keep server-side history checks aligned with the client recovery ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE (x ? 'delta' AND (jsonb_typeof(x->'delta') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN jsonb_array_length(x->'delta') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'quads' AND (jsonb_typeof(x->'quads') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN jsonb_array_length(x->'quads') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN x->'quads' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-4]$')))
    OR (x ? 'winner' AND x->'winner'<>'null'::jsonb AND (jsonb_typeof(x->'winner') IS DISTINCT FROM 'number' OR x->>'winner' !~ '^[0-3]$'))
    OR (x ? 'dealer' AND x->'dealer'<>'null'::jsonb AND (jsonb_typeof(x->'dealer') IS DISTINCT FROM 'number' OR x->>'dealer' !~ '^[0-3]$'))
    OR (x ? 'discarder' AND x->'discarder'<>'null'::jsonb AND (jsonb_typeof(x->'discarder') IS DISTINCT FROM 'number' OR x->>'discarder' !~ '^[0-3]$'))
    OR (x ? 'roundWind' AND (jsonb_typeof(x->'roundWind') IS DISTINCT FROM 'number' OR x->>'roundWind' !~ '^[0-3]$'))
    OR (x ? 'method' AND jsonb_typeof(x->'method') IS DISTINCT FROM 'string')
    OR (x ? 'playerPatterns' AND (jsonb_typeof(x->'playerPatterns') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN jsonb_array_length(x->'playerPatterns') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN x->'playerPatterns' ELSE '[]'::jsonb END) p WHERE p <> 'null'::jsonb AND
       (jsonb_typeof(p) IS DISTINCT FROM 'object' OR jsonb_typeof(p->'name') IS DISTINCT FROM 'string'
        OR length(p->>'name')>100 OR jsonb_typeof(p->'points') IS DISTINCT FROM 'number'
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM p->>'points'))>12))))
    OR (x ? 'patterns' AND (jsonb_typeof(x->'patterns') IS DISTINCT FROM 'array'
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'patterns') = 'array' THEN x->'patterns' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string')))
    OR (x ? 'seatWindsBefore' AND (jsonb_typeof(x->'seatWindsBefore') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN jsonb_array_length(x->'seatWindsBefore') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-3]$')
      OR (SELECT count(DISTINCT n) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n)<>4))
    OR (x ? 'namesAtTime' AND (jsonb_typeof(x->'namesAtTime') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN jsonb_array_length(x->'namesAtTime') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN x->'namesAtTime' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string' OR length(n #>> '{}')>100)))
  ) THEN false

  ELSE true END;
$$;
REVOKE ALL ON FUNCTION public.mahjong_sync_valid_game(jsonb) FROM PUBLIC,anon,authenticated;

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid; v_auth_created_at timestamptz;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT created_at INTO v_auth_created_at FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid;
  IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  IF v_token IS NULL OR v_token !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Token generator contract invalid' USING ERRCODE='22023';
  END IF;
  -- NULL means this device has no local game to upload. It may adopt an existing
  -- cloud game, but must never create an empty cloud game implicitly.
  IF p_local_game IS NOT NULL AND NOT public.mahjong_sync_valid_game(p_local_game)
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Revalidate the caller's Auth session AFTER acquiring the account lock.
  -- A pre-lock lookup alone cannot establish that the session remains eligible.
  IF NOT EXISTS (
    SELECT 1 FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid
      AND created_at=v_auth_created_at
      AND (not_after IS NULL OR not_after>clock_timestamp())
  ) THEN
    RAISE EXCEPTION 'Auth session expired or removed during takeover' USING ERRCODE='28000';
  END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  -- Persistent high-water mark: a displaced older Auth session must not
  -- reclaim the writer lease even after the newer Auth session expires or
  -- its auth.sessions row is deleted. Keep historical device rows for this guard.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501';
  END IF;
  -- Do not downgrade the persistent login high-water mark when an admin or
  -- multi-device scorekeeper reuses a device ID from an older Auth session.
  -- This also matters if multi-device permission is disabled later.
  IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
      AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','newer-login');
  END IF;
  -- A caller that supplied a preflight identity must match it regardless
  -- of whether it is adopting cloud data or already holds a local copy.
  -- Otherwise a stale client can take over a different current game.
  IF p_expected_revision IS NOT NULL AND p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Expected revision must not be negative';
  END IF;
  IF (p_expected_revision IS NULL) IS DISTINCT FROM (p_expected_game_id IS NULL) THEN
    RAISE EXCEPTION 'Both expected game ID and revision are required together';
  END IF;
  -- STAGE14 CANDIDATE: an authenticated newer session may take over a
  -- different device after matching cloud game identity/revision below.
  -- The older session is revoked only after all preflight checks pass.
  -- Safety preflight: never revoke an existing writer before checking whether
  -- this device has a different game. The client must reconcile explicitly.
  -- A rejected takeover must leave the current writer fully operational.
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  -- Existing cloud state always requires a matching preflight, even when
  -- the caller submits an identical local snapshot. Otherwise a stale client
  -- could rotate the writer lease without first observing the current revision.
  IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  IF FOUND AND p_expected_game_id IS NOT NULL AND
     (v_game.id IS DISTINCT FROM p_expected_game_id OR
      v_game.revision IS DISTINCT FROM p_expected_revision) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- Compare local payload only after validating the cloud identity/revision.
  -- A stale preflight must not receive the full current game snapshot via
  -- the mismatch response; it must refresh and reconcile explicitly.
  IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN
    RETURN jsonb_build_object('ok',false,'reason','local-cloud-mismatch',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A takeover that adopts cloud state must be based on a prior read of its
  -- exact revision. This prevents a concurrent commit between peek and open
  -- from silently changing the state accepted by the new device.
  IF FOUND AND p_local_game IS NULL AND
     (p_expected_revision IS NULL OR p_expected_revision IS DISTINCT FROM v_game.revision
      OR p_expected_game_id IS NULL OR p_expected_game_id IS DISTINCT FROM v_game.id) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A prior peek that saw a cloud game must never fall back to creating a
  -- new game if the original game disappeared or was replaced in the interim.
  -- This is a preflight failure, not permission to bootstrap new cloud state.
  IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed');
  END IF;
  IF NOT FOUND AND p_local_game IS NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','no-cloud-game');
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      -- Revoke the credential itself, not just the writer flag. A displaced
      -- device must never retain a reusable token hash in the database.
      session_token_hash=NULL,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,ever_writer)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,v_auth_created_at,encode(extensions.digest(v_token,'sha256'),'hex'),true)
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,ever_writer=true,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id,is_current)
    VALUES(v_uid,p_local_game,0,v_session.id,true) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF NOT public.mahjong_sync_valid_game(p_game)
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Recheck Auth session under the same account lock used by takeover.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at IS NOT NULL
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during commit' USING ERRCODE='28000'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 -- Persistent login high-water guard also protects writes when the newer
 -- Auth session has expired or disappeared. A stale writer token alone is
 -- insufficient to prove that an older login still owns the account.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
   JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.auth_session_created_at IS NOT NULL
     AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 -- STAGE14: no historical device binding at commit; enforce current
 -- Auth session, writer lease, generation and token below instead.
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   -- A revoked or displaced device is no longer authorized to submit game
   -- payloads. Do not persist its proposed snapshot in the conflict ledger:
   -- that would permit repeated rejected writes to fill server storage.
   -- Only an authenticated CURRENT writer may record a revision conflict.
   IF v_reason='revision-conflict' THEN
     INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
       VALUES(v_game.id,v_uid,p_device_id,p_base_revision,p_game,v_reason);
   END IF;
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

-- Explicit reader enrollment. A read-only device must never call mahjong_sync_open,
-- because that operation transfers the sole writer lease.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_auth_created_at timestamptz;
 v_game public.mahjong_game_states%ROWTYPE;
 v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT created_at INTO v_auth_created_at FROM auth.sessions
  WHERE id=v_auth_session AND user_id=v_uid;
 IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
 -- Serialize with writer takeovers and commits for this account.
 SELECT raw_app_meta_data->>'role',
  COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false),
  banned_until,deleted_at INTO v_role,v_multi,v_banned,v_deleted
 FROM auth.users WHERE id=v_uid FOR UPDATE;
 IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL
  OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Reader enrollment also must not rely only on pre-lock Auth checks.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at=v_auth_created_at
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during reader open' USING ERRCODE='28000'; END IF;
 IF v_role<>'admin' AND NOT v_multi THEN
  RAISE EXCEPTION 'Multi-device reading not permitted' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 -- Never replace a newer recorded Auth session with an older one on a
 -- reused device ID. That would erase the persistent takeover high-water
 -- mark if multi-device access is subsequently disabled.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
  WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','newer-login');
 END IF;
 -- Never downgrade a current writer on this device. Require a separate
 -- device ID for a read-only enrollment, rather than clobber its token.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active AND is_writer
   AND revoked_at IS NULL) THEN
  RETURN jsonb_build_object('ok',false,'reason','device-already-writer');
 END IF;
 INSERT INTO public.mahjong_device_sessions
  (user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,revoked_at)
 VALUES(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL)
 ON CONFLICT(user_id,device_id) DO UPDATE SET
  is_active=true,is_writer=false,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,
  session_generation=public.mahjong_device_sessions.session_generation+1,
  session_token_hash=NULL,revoked_at=NULL,last_seen_at=now(),updated_at=now()
 RETURNING * INTO v_lease;
 INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
 VALUES(v_uid,v_uid,p_device_id,'reader-open',jsonb_build_object('game_id',v_game.id));
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',false,'generation',v_lease.session_generation);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open_reader(uuid) TO authenticated;

-- Read-only preflight: verify the exact Supabase Auth session and account status.
-- This does not create a device session, rotate a token, or modify game state.
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
    AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
 INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid;
 IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL
    OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM auth.sessions newer JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- A displaced old login must not resume metadata reads after the newer
 -- Auth session expires. The historical writer lease is the high-water mark.
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM public.mahjong_device_sessions prior
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision);
END; $$;
-- Read-only refresh for an already opened device session. Unlike peek, this
-- requires a registered, active lease for this exact Supabase Auth session.
-- It never grants writer privileges or rotates writer credentials.
CREATE OR REPLACE FUNCTION public.mahjong_sync_read(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid;
 v_game public.mahjong_game_states%ROWTYPE; v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- A newer login invalidates an older scorekeeper session unless explicitly
 -- allowed by administrator, even if its old lease has not yet been revoked.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active=true
   AND revoked_at IS NULL AND auth_session_id=v_auth_session;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 -- A reader lease is not a permanent entitlement. If the administrator
 -- disables multi-device access, reject previously enrolled reader sessions
 -- immediately instead of allowing continued cloud reads.
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
      AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',v_lease.is_writer
   AND v_lease.session_token_hash IS NOT NULL
   AND v_lease.session_generation>0
   AND v_game.writer_session_id=v_lease.id);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_read(uuid) TO authenticated;

-- Lightweight lease probe for foreground/periodic client checks. A stale device
-- must learn that its writer lease was revoked without waiting for a score edit.
-- This is advisory UI state; commit() remains the server-side security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_lease_status(p_device_id uuid,p_generation bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_auth_session uuid; v_lease public.mahjong_device_sessions%ROWTYPE;
 v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_generation<1 THEN
  RAISE EXCEPTION 'Authentication and valid lease identity required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
  RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND auth_session_id=v_auth_session
   AND session_generation=p_generation AND is_active=true AND revoked_at IS NULL;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked'); END IF;
 RETURN jsonb_build_object('ok',true,'canWrite',v_lease.is_writer
  AND v_lease.session_token_hash IS NOT NULL
  AND v_game.writer_session_id=v_lease.id,
  'gameId',v_game.id,'revision',v_game.revision);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;

-- ROLLBACK-ONLY TEST ASSERTIONS (no persistent schema/data changes)
DO $gate$
DECLARE v_count integer; v_exposed integer;
BEGIN
 SELECT count(*) INTO v_count FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND p.prosecdef AND EXISTS (SELECT 1 FROM unnest(COALESCE(p.proconfig, ARRAY[]::text[])) AS cfg(value) WHERE cfg.value IN ('search_path=', 'search_path=""'));
 IF v_count <> 5 THEN RAISE EXCEPTION 'RPC SECURITY GATE FAIL: expected 5 secure definer functions, found %',v_count; END IF;
 SELECT count(*) INTO v_exposed FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND (has_function_privilege('anon',p.oid,'EXECUTE') OR NOT has_function_privilege('authenticated',p.oid,'EXECUTE'));
 IF v_exposed <> 0 THEN RAISE EXCEPTION 'RPC GRANTS GATE FAIL: % functions exposed or missing auth grant',v_exposed; END IF;
 RAISE NOTICE 'PASS: five RPCs compiled, SECURITY DEFINER/search_path hardened, authenticated-only EXECUTE; ROLLBACK pending';
END $gate$;


-- Isolated latest-session write lifecycle. All changes are rolled back.
-- Lifecycle test intentionally omitted: it creates a current game inside the same transaction.
-- Lifecycle was already verified separately (6/6 PASS).

-- Cross-session isolation: newer session owns a valid token; older session tries to reuse it.
CREATE TEMP TABLE mahjong_cross_session_results (scenario text, observed text, status text) ON COMMIT DROP;
DO $cross$
DECLARE
 u uuid; newest uuid; oldest uuid; n int; device uuid:=gen_random_uuid();
 initial jsonb:='{"names":["A","B","C","D"],"scores":[0,0,0,0],"history":[],"dealer":0,"round":1}'::jsonb;
 changed jsonb:='{"names":["A","B","C","D"],"scores":[3,-1,-1,-1],"history":[{"delta":[3,-1,-1,-1]}],"dealer":0,"round":2}'::jsonb;
 opened jsonb; denied jsonb; readback jsonb; lease jsonb; gid uuid; tok text; generation bigint; err text;
BEGIN
 SELECT id INTO STRICT u FROM auth.users WHERE raw_app_meta_data->>'role'='scorekeeper'
 AND (lower(raw_user_meta_data->>'username')='wiroseta' OR lower(raw_app_meta_data->>'username')='wiroseta' OR lower(split_part(email,'@',1))='wiroseta');
 SELECT count(*) INTO n FROM auth.sessions WHERE user_id=u AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now());
 IF n<>2 THEN RAISE EXCEPTION 'STOP: exactly two active Auth sessions required, found %',n; END IF;
 SELECT id INTO newest FROM auth.sessions WHERE user_id=u AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now()) ORDER BY created_at DESC,id DESC LIMIT 1;
 SELECT id INTO oldest FROM auth.sessions WHERE user_id=u AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now()) ORDER BY created_at,id LIMIT 1;
 IF EXISTS(SELECT 1 FROM public.mahjong_game_states WHERE owner_id=u AND is_current)
 OR EXISTS(SELECT 1 FROM public.mahjong_device_sessions WHERE user_id=u AND is_active)
 THEN RAISE EXCEPTION 'STOP: existing active game/lease'; END IF;
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',u,'role','authenticated','session_id',newest)::text,true);
 PERFORM set_config('request.jwt.claim.sub',u::text,true);
 opened:=public.mahjong_sync_open(device,initial,NULL,NULL);
 INSERT INTO mahjong_cross_session_results VALUES ('NEWEST SESSION OPEN',coalesce(opened->>'reason','ok='||(opened->>'ok')),
 CASE WHEN opened->>'ok'='true' THEN 'PASS' ELSE 'FAIL' END);
 IF opened->>'ok' IS DISTINCT FROM 'true' THEN RETURN; END IF;
 gid:=(opened->>'gameId')::uuid; tok:=opened->>'writerToken'; generation:=(opened->>'generation')::bigint;
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',u,'role','authenticated','session_id',oldest)::text,true);
 err:=NULL; denied:=NULL;
 BEGIN denied:=public.mahjong_sync_commit(gid,device,generation,tok,0,changed);
 EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS err=RETURNED_SQLSTATE; END;
 INSERT INTO mahjong_cross_session_results VALUES ('OLDER SESSION REUSES VALID TOKEN',coalesce(err,denied::text,'NULL'),
 CASE WHEN err='42501' OR (denied->>'ok'='false' AND denied->>'reason' IN ('newer-login','writer-revoked','session-revoked')) THEN 'PASS' ELSE 'FAIL' END);
 err:=NULL; readback:=NULL;
 BEGIN readback:=public.mahjong_sync_read(device);
 EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS err=RETURNED_SQLSTATE; END;
 INSERT INTO mahjong_cross_session_results VALUES ('OLDER SESSION CANNOT READ',coalesce(err,readback::text,'NULL'),
 CASE WHEN err='42501' OR (readback->>'ok'='false') THEN 'PASS' ELSE 'FAIL' END);
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',u,'role','authenticated','session_id',newest)::text,true);
 readback:=public.mahjong_sync_read(device);
 INSERT INTO mahjong_cross_session_results VALUES ('NEWEST SESSION RECOVERS GAME',
 coalesce(readback->>'reason','ok='||(readback->>'ok')),
 CASE WHEN readback->>'ok'='true' AND readback->'game'=initial AND readback->>'revision'='0' THEN 'PASS' ELSE 'FAIL' END);
 INSERT INTO mahjong_cross_session_results VALUES ('OLD WRITE DID NOT MUTATE',
 (SELECT 'revision='||revision FROM public.mahjong_game_states WHERE id=gid),
 CASE WHEN (SELECT revision=0 AND game_data=initial FROM public.mahjong_game_states WHERE id=gid) THEN 'PASS' ELSE 'FAIL' END);
END $cross$;
SELECT scenario,observed,status FROM mahjong_cross_session_results;
-- The entire test fixture, temporary game, lease and function definitions disappear.
ROLLBACK;

```

## supabase_sync_stage14_CROSS_SESSION_VALID_TOKEN_ROLLBACK_ONLY.sql

```sql
-- ROLLBACK-ONLY RPC INTEGRATION TEST: NEVER DEPLOY.
-- All CREATE/ALTER/GRANT statements are transaction-scoped and rolled back.
-- Existing Supabase project only: requires isolated test accounts and two-device verification.
-- Depends on v15.7.14 foundation tables.
-- FAIL-CLOSED: token issuance and authentication not yet integrated.
-- This file is deliberately NOT executable in production.
-- REVIEW: existing auth.sessions created_at ordering alone is insufficient to prove
-- the new session owns the writer lease; auth session ID must match on every commit.
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
-- Preserve historical writer binding independently of read-only enrollments.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false;
-- Match the guarded alignment candidate: never auto-promote legacy games.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
-- ADD COLUMN IF NOT EXISTS does not alter an existing DEFAULT true.
-- Explicitly align future implicit inserts; do not rewrite existing game rows.
ALTER TABLE public.mahjong_game_states ALTER COLUMN is_current SET DEFAULT false;
-- Existing verified index: mahjong_one_current_game_per_owner (owner_id WHERE is_current = true).
-- Do not create an equivalent second index here: fail closed until the
-- foundation migration is independently verified in the target environment.

-- Server-side schema validation mirrors the essential four-player client invariants.
-- Do not trust a browser-side validator as a security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN false
  WHEN jsonb_array_length(p_game->'history')>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(trim(leading '-' from x::text))>12) THEN false
  WHEN p_game ? 'roundWind' AND (jsonb_typeof(p_game->'roundWind') IS DISTINCT FROM 'number'
    OR (p_game->>'roundWind') !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (jsonb_typeof(p_game->'seatWinds') IS DISTINCT FROM 'array'
    OR (CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN jsonb_array_length(p_game->'seatWinds') ELSE NULL END)<>4) THEN false
  WHEN p_game ? 'seatWinds' AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number' OR x::text !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (SELECT count(DISTINCT x) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x)<>4 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'object') THEN false
  -- Keep server-side history checks aligned with the client recovery ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE (x ? 'delta' AND (jsonb_typeof(x->'delta') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN jsonb_array_length(x->'delta') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'quads' AND (jsonb_typeof(x->'quads') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN jsonb_array_length(x->'quads') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN x->'quads' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-4]$')))
    OR (x ? 'winner' AND x->'winner'<>'null'::jsonb AND (jsonb_typeof(x->'winner') IS DISTINCT FROM 'number' OR x->>'winner' !~ '^[0-3]$'))
    OR (x ? 'dealer' AND x->'dealer'<>'null'::jsonb AND (jsonb_typeof(x->'dealer') IS DISTINCT FROM 'number' OR x->>'dealer' !~ '^[0-3]$'))
    OR (x ? 'discarder' AND x->'discarder'<>'null'::jsonb AND (jsonb_typeof(x->'discarder') IS DISTINCT FROM 'number' OR x->>'discarder' !~ '^[0-3]$'))
    OR (x ? 'roundWind' AND (jsonb_typeof(x->'roundWind') IS DISTINCT FROM 'number' OR x->>'roundWind' !~ '^[0-3]$'))
    OR (x ? 'method' AND jsonb_typeof(x->'method') IS DISTINCT FROM 'string')
    OR (x ? 'playerPatterns' AND (jsonb_typeof(x->'playerPatterns') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN jsonb_array_length(x->'playerPatterns') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN x->'playerPatterns' ELSE '[]'::jsonb END) p WHERE p <> 'null'::jsonb AND
       (jsonb_typeof(p) IS DISTINCT FROM 'object' OR jsonb_typeof(p->'name') IS DISTINCT FROM 'string'
        OR length(p->>'name')>100 OR jsonb_typeof(p->'points') IS DISTINCT FROM 'number'
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM p->>'points'))>12))))
    OR (x ? 'patterns' AND (jsonb_typeof(x->'patterns') IS DISTINCT FROM 'array'
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'patterns') = 'array' THEN x->'patterns' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string')))
    OR (x ? 'seatWindsBefore' AND (jsonb_typeof(x->'seatWindsBefore') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN jsonb_array_length(x->'seatWindsBefore') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-3]$')
      OR (SELECT count(DISTINCT n) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n)<>4))
    OR (x ? 'namesAtTime' AND (jsonb_typeof(x->'namesAtTime') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN jsonb_array_length(x->'namesAtTime') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN x->'namesAtTime' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string' OR length(n #>> '{}')>100)))
  ) THEN false

  ELSE true END;
$$;
REVOKE ALL ON FUNCTION public.mahjong_sync_valid_game(jsonb) FROM PUBLIC,anon,authenticated;

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid; v_auth_created_at timestamptz;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT created_at INTO v_auth_created_at FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid;
  IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  IF v_token IS NULL OR v_token !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Token generator contract invalid' USING ERRCODE='22023';
  END IF;
  -- NULL means this device has no local game to upload. It may adopt an existing
  -- cloud game, but must never create an empty cloud game implicitly.
  IF p_local_game IS NOT NULL AND NOT public.mahjong_sync_valid_game(p_local_game)
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Revalidate the caller's Auth session AFTER acquiring the account lock.
  -- A pre-lock lookup alone cannot establish that the session remains eligible.
  IF NOT EXISTS (
    SELECT 1 FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid
      AND created_at=v_auth_created_at
      AND (not_after IS NULL OR not_after>clock_timestamp())
  ) THEN
    RAISE EXCEPTION 'Auth session expired or removed during takeover' USING ERRCODE='28000';
  END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  -- Persistent high-water mark: a displaced older Auth session must not
  -- reclaim the writer lease even after the newer Auth session expires or
  -- its auth.sessions row is deleted. Keep historical device rows for this guard.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501';
  END IF;
  -- Do not downgrade the persistent login high-water mark when an admin or
  -- multi-device scorekeeper reuses a device ID from an older Auth session.
  -- This also matters if multi-device permission is disabled later.
  IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
      AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','newer-login');
  END IF;
  -- A caller that supplied a preflight identity must match it regardless
  -- of whether it is adopting cloud data or already holds a local copy.
  -- Otherwise a stale client can take over a different current game.
  IF p_expected_revision IS NOT NULL AND p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Expected revision must not be negative';
  END IF;
  IF (p_expected_revision IS NULL) IS DISTINCT FROM (p_expected_game_id IS NULL) THEN
    RAISE EXCEPTION 'Both expected game ID and revision are required together';
  END IF;
  -- STAGE14 CANDIDATE: an authenticated newer session may take over a
  -- different device after matching cloud game identity/revision below.
  -- The older session is revoked only after all preflight checks pass.
  -- Safety preflight: never revoke an existing writer before checking whether
  -- this device has a different game. The client must reconcile explicitly.
  -- A rejected takeover must leave the current writer fully operational.
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  -- Existing cloud state always requires a matching preflight, even when
  -- the caller submits an identical local snapshot. Otherwise a stale client
  -- could rotate the writer lease without first observing the current revision.
  IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  IF FOUND AND p_expected_game_id IS NOT NULL AND
     (v_game.id IS DISTINCT FROM p_expected_game_id OR
      v_game.revision IS DISTINCT FROM p_expected_revision) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- Compare local payload only after validating the cloud identity/revision.
  -- A stale preflight must not receive the full current game snapshot via
  -- the mismatch response; it must refresh and reconcile explicitly.
  IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN
    RETURN jsonb_build_object('ok',false,'reason','local-cloud-mismatch',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A takeover that adopts cloud state must be based on a prior read of its
  -- exact revision. This prevents a concurrent commit between peek and open
  -- from silently changing the state accepted by the new device.
  IF FOUND AND p_local_game IS NULL AND
     (p_expected_revision IS NULL OR p_expected_revision IS DISTINCT FROM v_game.revision
      OR p_expected_game_id IS NULL OR p_expected_game_id IS DISTINCT FROM v_game.id) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A prior peek that saw a cloud game must never fall back to creating a
  -- new game if the original game disappeared or was replaced in the interim.
  -- This is a preflight failure, not permission to bootstrap new cloud state.
  IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed');
  END IF;
  IF NOT FOUND AND p_local_game IS NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','no-cloud-game');
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      -- Revoke the credential itself, not just the writer flag. A displaced
      -- device must never retain a reusable token hash in the database.
      session_token_hash=NULL,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,ever_writer)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,v_auth_created_at,encode(extensions.digest(v_token,'sha256'),'hex'),true)
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,ever_writer=true,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id,is_current)
    VALUES(v_uid,p_local_game,0,v_session.id,true) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF NOT public.mahjong_sync_valid_game(p_game)
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Recheck Auth session under the same account lock used by takeover.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at IS NOT NULL
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during commit' USING ERRCODE='28000'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 -- Persistent login high-water guard also protects writes when the newer
 -- Auth session has expired or disappeared. A stale writer token alone is
 -- insufficient to prove that an older login still owns the account.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
   JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.auth_session_created_at IS NOT NULL
     AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 -- STAGE14: no historical device binding at commit; enforce current
 -- Auth session, writer lease, generation and token below instead.
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   -- A revoked or displaced device is no longer authorized to submit game
   -- payloads. Do not persist its proposed snapshot in the conflict ledger:
   -- that would permit repeated rejected writes to fill server storage.
   -- Only an authenticated CURRENT writer may record a revision conflict.
   IF v_reason='revision-conflict' THEN
     INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
       VALUES(v_game.id,v_uid,p_device_id,p_base_revision,p_game,v_reason);
   END IF;
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

-- Explicit reader enrollment. A read-only device must never call mahjong_sync_open,
-- because that operation transfers the sole writer lease.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_auth_created_at timestamptz;
 v_game public.mahjong_game_states%ROWTYPE;
 v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT created_at INTO v_auth_created_at FROM auth.sessions
  WHERE id=v_auth_session AND user_id=v_uid;
 IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
 -- Serialize with writer takeovers and commits for this account.
 SELECT raw_app_meta_data->>'role',
  COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false),
  banned_until,deleted_at INTO v_role,v_multi,v_banned,v_deleted
 FROM auth.users WHERE id=v_uid FOR UPDATE;
 IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL
  OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Reader enrollment also must not rely only on pre-lock Auth checks.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at=v_auth_created_at
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during reader open' USING ERRCODE='28000'; END IF;
 IF v_role<>'admin' AND NOT v_multi THEN
  RAISE EXCEPTION 'Multi-device reading not permitted' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 -- Never replace a newer recorded Auth session with an older one on a
 -- reused device ID. That would erase the persistent takeover high-water
 -- mark if multi-device access is subsequently disabled.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
  WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','newer-login');
 END IF;
 -- Never downgrade a current writer on this device. Require a separate
 -- device ID for a read-only enrollment, rather than clobber its token.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active AND is_writer
   AND revoked_at IS NULL) THEN
  RETURN jsonb_build_object('ok',false,'reason','device-already-writer');
 END IF;
 INSERT INTO public.mahjong_device_sessions
  (user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,revoked_at)
 VALUES(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL)
 ON CONFLICT(user_id,device_id) DO UPDATE SET
  is_active=true,is_writer=false,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,
  session_generation=public.mahjong_device_sessions.session_generation+1,
  session_token_hash=NULL,revoked_at=NULL,last_seen_at=now(),updated_at=now()
 RETURNING * INTO v_lease;
 INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
 VALUES(v_uid,v_uid,p_device_id,'reader-open',jsonb_build_object('game_id',v_game.id));
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',false,'generation',v_lease.session_generation);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open_reader(uuid) TO authenticated;

-- Read-only preflight: verify the exact Supabase Auth session and account status.
-- This does not create a device session, rotate a token, or modify game state.
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
    AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
 INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid;
 IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL
    OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM auth.sessions newer JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- A displaced old login must not resume metadata reads after the newer
 -- Auth session expires. The historical writer lease is the high-water mark.
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM public.mahjong_device_sessions prior
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision);
END; $$;
-- Read-only refresh for an already opened device session. Unlike peek, this
-- requires a registered, active lease for this exact Supabase Auth session.
-- It never grants writer privileges or rotates writer credentials.
CREATE OR REPLACE FUNCTION public.mahjong_sync_read(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid;
 v_game public.mahjong_game_states%ROWTYPE; v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- A newer login invalidates an older scorekeeper session unless explicitly
 -- allowed by administrator, even if its old lease has not yet been revoked.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active=true
   AND revoked_at IS NULL AND auth_session_id=v_auth_session;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 -- A reader lease is not a permanent entitlement. If the administrator
 -- disables multi-device access, reject previously enrolled reader sessions
 -- immediately instead of allowing continued cloud reads.
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
      AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',v_lease.is_writer
   AND v_lease.session_token_hash IS NOT NULL
   AND v_lease.session_generation>0
   AND v_game.writer_session_id=v_lease.id);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_read(uuid) TO authenticated;

-- Lightweight lease probe for foreground/periodic client checks. A stale device
-- must learn that its writer lease was revoked without waiting for a score edit.
-- This is advisory UI state; commit() remains the server-side security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_lease_status(p_device_id uuid,p_generation bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_auth_session uuid; v_lease public.mahjong_device_sessions%ROWTYPE;
 v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_generation<1 THEN
  RAISE EXCEPTION 'Authentication and valid lease identity required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
  RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND auth_session_id=v_auth_session
   AND session_generation=p_generation AND is_active=true AND revoked_at IS NULL;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked'); END IF;
 RETURN jsonb_build_object('ok',true,'canWrite',v_lease.is_writer
  AND v_lease.session_token_hash IS NOT NULL
  AND v_game.writer_session_id=v_lease.id,
  'gameId',v_game.id,'revision',v_game.revision);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;

-- ROLLBACK-ONLY TEST ASSERTIONS (no persistent schema/data changes)
DO $gate$
DECLARE v_count integer; v_exposed integer;
BEGIN
 SELECT count(*) INTO v_count FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND p.prosecdef AND EXISTS (SELECT 1 FROM unnest(COALESCE(p.proconfig, ARRAY[]::text[])) AS cfg(value) WHERE cfg.value IN ('search_path=', 'search_path=""'));
 IF v_count <> 5 THEN RAISE EXCEPTION 'RPC SECURITY GATE FAIL: expected 5 secure definer functions, found %',v_count; END IF;
 SELECT count(*) INTO v_exposed FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND (has_function_privilege('anon',p.oid,'EXECUTE') OR NOT has_function_privilege('authenticated',p.oid,'EXECUTE'));
 IF v_exposed <> 0 THEN RAISE EXCEPTION 'RPC GRANTS GATE FAIL: % functions exposed or missing auth grant',v_exposed; END IF;
 RAISE NOTICE 'PASS: five RPCs compiled, SECURITY DEFINER/search_path hardened, authenticated-only EXECUTE; ROLLBACK pending';
END $gate$;


-- Isolated latest-session write lifecycle. All changes are rolled back.
CREATE TEMP TABLE mahjong_lifecycle_results (scenario text, observed text, status text) ON COMMIT DROP;
DO $lifecycle$
DECLARE
 v_uid uuid; v_session uuid; v_count int; v_device uuid := gen_random_uuid();
 v_initial jsonb := '{"names":["A","B","C","D"],"scores":[0,0,0,0],"history":[],"dealer":0,"round":1}'::jsonb;
 v_next jsonb := '{"names":["A","B","C","D"],"scores":[3,-1,-1,-1],"history":[{"delta":[3,-1,-1,-1]}],"dealer":0,"round":2}'::jsonb;
 v_open jsonb; v_commit jsonb; v_rotated jsonb; v_old jsonb; v_recovered jsonb;
 v_gid uuid; v_token text; v_gen bigint; v_state text;
BEGIN
 SELECT count(*), (array_agg(id))[1] INTO v_count,v_uid FROM auth.users
 WHERE raw_app_meta_data->>'role'='scorekeeper' AND deleted_at IS NULL
 AND (lower(raw_user_meta_data->>'username')='wiroseta' OR lower(raw_app_meta_data->>'username')='wiroseta' OR lower(split_part(email,'@',1))='wiroseta');
 IF v_count<>1 THEN RAISE EXCEPTION 'Exactly one test account required'; END IF;
 SELECT id INTO v_session FROM auth.sessions WHERE user_id=v_uid
 AND (not_after IS NULL OR not_after>now()) ORDER BY created_at DESC,id DESC LIMIT 1;
 IF v_session IS NULL THEN RAISE EXCEPTION 'No latest session'; END IF;
 IF EXISTS(SELECT 1 FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current) THEN
   RAISE EXCEPTION 'STOP: test account already owns current cloud game; do not touch existing data';
 END IF;
 IF EXISTS(SELECT 1 FROM public.mahjong_device_sessions WHERE user_id=v_uid AND is_active) THEN
   RAISE EXCEPTION 'STOP: test account has active device lease; do not revoke existing device';
 END IF;
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',v_uid,'role','authenticated','session_id',v_session)::text,true);
 PERFORM set_config('request.jwt.claim.sub',v_uid::text,true);
 IF NOT public.mahjong_sync_valid_game(v_initial) OR NOT public.mahjong_sync_valid_game(v_next) THEN
   RAISE EXCEPTION 'Test fixtures invalid';
 END IF;
 v_open:=public.mahjong_sync_open(v_device,v_initial,NULL,NULL);
 INSERT INTO mahjong_lifecycle_results VALUES ('OPEN INITIAL',coalesce(v_open->>'reason','ok='||(v_open->>'ok')),
 CASE WHEN v_open->>'ok'='true' AND length(v_open->>'writerToken')=64 THEN 'PASS' ELSE 'FAIL' END);
 IF v_open->>'ok' IS DISTINCT FROM 'true' THEN RETURN; END IF;
 v_gid:=(v_open->>'gameId')::uuid; v_token:=v_open->>'writerToken'; v_gen:=(v_open->>'generation')::bigint;
 v_commit:=public.mahjong_sync_commit(v_gid,v_device,v_gen,v_token,0,v_next);
 INSERT INTO mahjong_lifecycle_results VALUES ('COMMIT SCORE HISTORY',v_commit::text,
 CASE WHEN v_commit->>'ok'='true' AND v_commit->>'revision'='1' THEN 'PASS' ELSE 'FAIL' END);
 v_recovered:=(SELECT game_data FROM public.mahjong_game_states WHERE id=v_gid);
 INSERT INTO mahjong_lifecycle_results VALUES ('PERSIST SCORE HISTORY',CASE WHEN v_recovered=v_next THEN 'exact snapshot' ELSE 'snapshot differs' END,
 CASE WHEN v_recovered=v_next THEN 'PASS' ELSE 'FAIL' END);
 -- Rotate the token on the SAME device/session; stale token must never write.
 v_rotated:=public.mahjong_sync_open(v_device,NULL,1,v_gid);
 INSERT INTO mahjong_lifecycle_results VALUES ('ROTATE WRITER TOKEN',coalesce(v_rotated->>'reason','ok='||(v_rotated->>'ok')),
 CASE WHEN v_rotated->>'ok'='true' AND v_rotated->>'writerToken'<>v_token AND (v_rotated->>'generation')::bigint>v_gen THEN 'PASS' ELSE 'FAIL' END);
 IF v_rotated->>'ok' IS DISTINCT FROM 'true' THEN RETURN; END IF;
 v_state:=NULL;
 BEGIN v_old:=public.mahjong_sync_commit(v_gid,v_device,v_gen,v_token,1,v_initial);
 EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS v_state=RETURNED_SQLSTATE; END;
 INSERT INTO mahjong_lifecycle_results VALUES ('STALE TOKEN REJECTED',coalesce(v_state,v_old::text),
 CASE WHEN v_state IS NOT NULL OR (v_old->>'ok'='false' AND v_old->>'reason'='writer-revoked') THEN 'PASS' ELSE 'FAIL' END);
 INSERT INTO mahjong_lifecycle_results VALUES ('NO STALE SCORE OVERWRITE',
  (SELECT 'revision='||revision FROM public.mahjong_game_states WHERE id=v_gid),
 CASE WHEN (SELECT revision=1 AND game_data=v_next FROM public.mahjong_game_states WHERE id=v_gid) THEN 'PASS' ELSE 'FAIL' END);
END $lifecycle$;
SELECT scenario,observed,status FROM mahjong_lifecycle_results;
-- NO COMMIT. The entire temporary game, token, lease and RPC DDL disappear.

-- Cross-session isolation: newer session owns a valid token; older session tries to reuse it.
CREATE TEMP TABLE mahjong_cross_session_results (scenario text, observed text, status text) ON COMMIT DROP;
DO $cross$
DECLARE
 u uuid; newest uuid; oldest uuid; n int; device uuid:=gen_random_uuid();
 initial jsonb:='{"names":["A","B","C","D"],"scores":[0,0,0,0],"history":[],"dealer":0,"round":1}'::jsonb;
 changed jsonb:='{"names":["A","B","C","D"],"scores":[3,-1,-1,-1],"history":[{"delta":[3,-1,-1,-1]}],"dealer":0,"round":2}'::jsonb;
 opened jsonb; denied jsonb; readback jsonb; lease jsonb; gid uuid; tok text; generation bigint; err text;
BEGIN
 SELECT id INTO STRICT u FROM auth.users WHERE raw_app_meta_data->>'role'='scorekeeper'
 AND (lower(raw_user_meta_data->>'username')='wiroseta' OR lower(raw_app_meta_data->>'username')='wiroseta' OR lower(split_part(email,'@',1))='wiroseta');
 SELECT count(*) INTO n FROM auth.sessions WHERE user_id=u AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now());
 IF n<>2 THEN RAISE EXCEPTION 'STOP: exactly two active Auth sessions required, found %',n; END IF;
 SELECT id INTO newest FROM auth.sessions WHERE user_id=u AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now()) ORDER BY created_at DESC,id DESC LIMIT 1;
 SELECT id INTO oldest FROM auth.sessions WHERE user_id=u AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now()) ORDER BY created_at,id LIMIT 1;
 IF EXISTS(SELECT 1 FROM public.mahjong_game_states WHERE owner_id=u AND is_current)
 OR EXISTS(SELECT 1 FROM public.mahjong_device_sessions WHERE user_id=u AND is_active)
 THEN RAISE EXCEPTION 'STOP: existing active game/lease'; END IF;
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',u,'role','authenticated','session_id',newest)::text,true);
 PERFORM set_config('request.jwt.claim.sub',u::text,true);
 opened:=public.mahjong_sync_open(device,initial,NULL,NULL);
 INSERT INTO mahjong_cross_session_results VALUES ('NEWEST SESSION OPEN',coalesce(opened->>'reason','ok='||(opened->>'ok')),
 CASE WHEN opened->>'ok'='true' THEN 'PASS' ELSE 'FAIL' END);
 IF opened->>'ok' IS DISTINCT FROM 'true' THEN RETURN; END IF;
 gid:=(opened->>'gameId')::uuid; tok:=opened->>'writerToken'; generation:=(opened->>'generation')::bigint;
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',u,'role','authenticated','session_id',oldest)::text,true);
 err:=NULL; denied:=NULL;
 BEGIN denied:=public.mahjong_sync_commit(gid,device,generation,tok,0,changed);
 EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS err=RETURNED_SQLSTATE; END;
 INSERT INTO mahjong_cross_session_results VALUES ('OLDER SESSION REUSES VALID TOKEN',coalesce(err,denied::text,'NULL'),
 CASE WHEN err='42501' OR (denied->>'ok'='false' AND denied->>'reason' IN ('newer-login','writer-revoked','session-revoked')) THEN 'PASS' ELSE 'FAIL' END);
 err:=NULL; readback:=NULL;
 BEGIN readback:=public.mahjong_sync_read(device);
 EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS err=RETURNED_SQLSTATE; END;
 INSERT INTO mahjong_cross_session_results VALUES ('OLDER SESSION CANNOT READ',coalesce(err,readback::text,'NULL'),
 CASE WHEN err='42501' OR (readback->>'ok'='false') THEN 'PASS' ELSE 'FAIL' END);
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',u,'role','authenticated','session_id',newest)::text,true);
 readback:=public.mahjong_sync_read(device);
 INSERT INTO mahjong_cross_session_results VALUES ('NEWEST SESSION RECOVERS GAME',
 coalesce(readback->>'reason','ok='||(readback->>'ok')),
 CASE WHEN readback->>'ok'='true' AND readback->'game'=initial AND readback->>'revision'='0' THEN 'PASS' ELSE 'FAIL' END);
 INSERT INTO mahjong_cross_session_results VALUES ('OLD WRITE DID NOT MUTATE',
 (SELECT 'revision='||revision FROM public.mahjong_game_states WHERE id=gid),
 CASE WHEN (SELECT revision=0 AND game_data=initial FROM public.mahjong_game_states WHERE id=gid) THEN 'PASS' ELSE 'FAIL' END);
END $cross$;
SELECT scenario,observed,status FROM mahjong_cross_session_results;
-- The entire test fixture, temporary game, lease and function definitions disappear.
ROLLBACK;

```

## supabase_sync_stage14_REAL_AUTH_PREFLIGHT_READONLY.sql

```sql
-- Mahjong v15.7.15 Stage 14-16: real authentication readiness, READ ONLY.
-- Does not install RPCs, modify accounts, or reveal access tokens.
BEGIN TRANSACTION READ ONLY;
WITH checks AS (
 SELECT 'auth.users exists' name, to_regclass('auth.users') IS NOT NULL passed
 UNION ALL SELECT 'auth.sessions exists',to_regclass('auth.sessions') IS NOT NULL
 UNION ALL SELECT 'device sessions table',to_regclass('public.mahjong_device_sessions') IS NOT NULL
 UNION ALL SELECT 'game states table',to_regclass('public.mahjong_game_states') IS NOT NULL
 UNION ALL SELECT 'session audit table',to_regclass('public.mahjong_session_audit') IS NOT NULL
 UNION ALL SELECT 'sync conflicts table',to_regclass('public.mahjong_sync_conflicts') IS NOT NULL
 UNION ALL SELECT 'JWT peek available',to_regprocedure('public.mahjong_sync_peek()') IS NOT NULL
 UNION ALL SELECT 'open not permanently installed',to_regprocedure('public.mahjong_sync_open(uuid,jsonb,bigint,uuid)') IS NULL
 UNION ALL SELECT 'commit not permanently installed',to_regprocedure('public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb)') IS NULL
 UNION ALL SELECT 'reader not permanently installed',to_regprocedure('public.mahjong_sync_open_reader(uuid)') IS NULL
 UNION ALL SELECT 'read not permanently installed',to_regprocedure('public.mahjong_sync_read(uuid)') IS NULL
 UNION ALL SELECT 'lease status not permanently installed',to_regprocedure('public.mahjong_sync_lease_status(uuid,bigint)') IS NULL
 UNION ALL SELECT 'auth session timestamp column', EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='mahjong_device_sessions' AND column_name='auth_session_created_at')
 UNION ALL SELECT 'writer history column', EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='mahjong_device_sessions' AND column_name='ever_writer')
 UNION ALL SELECT 'device sessions RLS',COALESCE((SELECT relrowsecurity FROM pg_class WHERE oid='public.mahjong_device_sessions'::regclass),false)
 UNION ALL SELECT 'game states RLS',COALESCE((SELECT relrowsecurity FROM pg_class WHERE oid='public.mahjong_game_states'::regclass),false)
)
SELECT name, CASE WHEN passed THEN 'PASS' ELSE 'REVIEW' END status FROM checks ORDER BY name;
COMMIT;
-- Note: PASS for 'not permanently installed' confirms safe pre-deployment state,
-- NOT readiness to enable cloud sync. Real signed JWT and device testing remain pending.

```

## supabase_sync_stage14_TWO_DEVICE_SAME_AUTH_TAKEOVER_ROLLBACK_ONLY.sql

```sql
-- ROLLBACK-ONLY RPC INTEGRATION TEST: NEVER DEPLOY.
-- All CREATE/ALTER/GRANT statements are transaction-scoped and rolled back.
-- Existing Supabase project only: requires isolated test accounts and two-device verification.
-- Depends on v15.7.14 foundation tables.
-- FAIL-CLOSED: token issuance and authentication not yet integrated.
-- This file is deliberately NOT executable in production.
-- REVIEW: existing auth.sessions created_at ordering alone is insufficient to prove
-- the new session owns the writer lease; auth session ID must match on every commit.
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
-- Preserve historical writer binding independently of read-only enrollments.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false;
-- Match the guarded alignment candidate: never auto-promote legacy games.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
-- ADD COLUMN IF NOT EXISTS does not alter an existing DEFAULT true.
-- Explicitly align future implicit inserts; do not rewrite existing game rows.
ALTER TABLE public.mahjong_game_states ALTER COLUMN is_current SET DEFAULT false;
-- Existing verified index: mahjong_one_current_game_per_owner (owner_id WHERE is_current = true).
-- Do not create an equivalent second index here: fail closed until the
-- foundation migration is independently verified in the target environment.

-- Server-side schema validation mirrors the essential four-player client invariants.
-- Do not trust a browser-side validator as a security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN false
  WHEN jsonb_array_length(p_game->'history')>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(trim(leading '-' from x::text))>12) THEN false
  WHEN p_game ? 'roundWind' AND (jsonb_typeof(p_game->'roundWind') IS DISTINCT FROM 'number'
    OR (p_game->>'roundWind') !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (jsonb_typeof(p_game->'seatWinds') IS DISTINCT FROM 'array'
    OR (CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN jsonb_array_length(p_game->'seatWinds') ELSE NULL END)<>4) THEN false
  WHEN p_game ? 'seatWinds' AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number' OR x::text !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (SELECT count(DISTINCT x) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x)<>4 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'object') THEN false
  -- Keep server-side history checks aligned with the client recovery ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE (x ? 'delta' AND (jsonb_typeof(x->'delta') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN jsonb_array_length(x->'delta') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'quads' AND (jsonb_typeof(x->'quads') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN jsonb_array_length(x->'quads') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN x->'quads' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-4]$')))
    OR (x ? 'winner' AND x->'winner'<>'null'::jsonb AND (jsonb_typeof(x->'winner') IS DISTINCT FROM 'number' OR x->>'winner' !~ '^[0-3]$'))
    OR (x ? 'dealer' AND x->'dealer'<>'null'::jsonb AND (jsonb_typeof(x->'dealer') IS DISTINCT FROM 'number' OR x->>'dealer' !~ '^[0-3]$'))
    OR (x ? 'discarder' AND x->'discarder'<>'null'::jsonb AND (jsonb_typeof(x->'discarder') IS DISTINCT FROM 'number' OR x->>'discarder' !~ '^[0-3]$'))
    OR (x ? 'roundWind' AND (jsonb_typeof(x->'roundWind') IS DISTINCT FROM 'number' OR x->>'roundWind' !~ '^[0-3]$'))
    OR (x ? 'method' AND jsonb_typeof(x->'method') IS DISTINCT FROM 'string')
    OR (x ? 'playerPatterns' AND (jsonb_typeof(x->'playerPatterns') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN jsonb_array_length(x->'playerPatterns') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN x->'playerPatterns' ELSE '[]'::jsonb END) p WHERE p <> 'null'::jsonb AND
       (jsonb_typeof(p) IS DISTINCT FROM 'object' OR jsonb_typeof(p->'name') IS DISTINCT FROM 'string'
        OR length(p->>'name')>100 OR jsonb_typeof(p->'points') IS DISTINCT FROM 'number'
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM p->>'points'))>12))))
    OR (x ? 'patterns' AND (jsonb_typeof(x->'patterns') IS DISTINCT FROM 'array'
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'patterns') = 'array' THEN x->'patterns' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string')))
    OR (x ? 'seatWindsBefore' AND (jsonb_typeof(x->'seatWindsBefore') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN jsonb_array_length(x->'seatWindsBefore') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-3]$')
      OR (SELECT count(DISTINCT n) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n)<>4))
    OR (x ? 'namesAtTime' AND (jsonb_typeof(x->'namesAtTime') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN jsonb_array_length(x->'namesAtTime') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN x->'namesAtTime' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string' OR length(n #>> '{}')>100)))
  ) THEN false

  ELSE true END;
$$;
REVOKE ALL ON FUNCTION public.mahjong_sync_valid_game(jsonb) FROM PUBLIC,anon,authenticated;

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid; v_auth_created_at timestamptz;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT created_at INTO v_auth_created_at FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid;
  IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  IF v_token IS NULL OR v_token !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Token generator contract invalid' USING ERRCODE='22023';
  END IF;
  -- NULL means this device has no local game to upload. It may adopt an existing
  -- cloud game, but must never create an empty cloud game implicitly.
  IF p_local_game IS NOT NULL AND NOT public.mahjong_sync_valid_game(p_local_game)
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Revalidate the caller's Auth session AFTER acquiring the account lock.
  -- A pre-lock lookup alone cannot establish that the session remains eligible.
  IF NOT EXISTS (
    SELECT 1 FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid
      AND created_at=v_auth_created_at
      AND (not_after IS NULL OR not_after>clock_timestamp())
  ) THEN
    RAISE EXCEPTION 'Auth session expired or removed during takeover' USING ERRCODE='28000';
  END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  -- Persistent high-water mark: a displaced older Auth session must not
  -- reclaim the writer lease even after the newer Auth session expires or
  -- its auth.sessions row is deleted. Keep historical device rows for this guard.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501';
  END IF;
  -- Do not downgrade the persistent login high-water mark when an admin or
  -- multi-device scorekeeper reuses a device ID from an older Auth session.
  -- This also matters if multi-device permission is disabled later.
  IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
      AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','newer-login');
  END IF;
  -- A caller that supplied a preflight identity must match it regardless
  -- of whether it is adopting cloud data or already holds a local copy.
  -- Otherwise a stale client can take over a different current game.
  IF p_expected_revision IS NOT NULL AND p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Expected revision must not be negative';
  END IF;
  IF (p_expected_revision IS NULL) IS DISTINCT FROM (p_expected_game_id IS NULL) THEN
    RAISE EXCEPTION 'Both expected game ID and revision are required together';
  END IF;
  -- STAGE14 CANDIDATE: an authenticated newer session may take over a
  -- different device after matching cloud game identity/revision below.
  -- The older session is revoked only after all preflight checks pass.
  -- Safety preflight: never revoke an existing writer before checking whether
  -- this device has a different game. The client must reconcile explicitly.
  -- A rejected takeover must leave the current writer fully operational.
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  -- Existing cloud state always requires a matching preflight, even when
  -- the caller submits an identical local snapshot. Otherwise a stale client
  -- could rotate the writer lease without first observing the current revision.
  IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  IF FOUND AND p_expected_game_id IS NOT NULL AND
     (v_game.id IS DISTINCT FROM p_expected_game_id OR
      v_game.revision IS DISTINCT FROM p_expected_revision) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- Compare local payload only after validating the cloud identity/revision.
  -- A stale preflight must not receive the full current game snapshot via
  -- the mismatch response; it must refresh and reconcile explicitly.
  IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN
    RETURN jsonb_build_object('ok',false,'reason','local-cloud-mismatch',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A takeover that adopts cloud state must be based on a prior read of its
  -- exact revision. This prevents a concurrent commit between peek and open
  -- from silently changing the state accepted by the new device.
  IF FOUND AND p_local_game IS NULL AND
     (p_expected_revision IS NULL OR p_expected_revision IS DISTINCT FROM v_game.revision
      OR p_expected_game_id IS NULL OR p_expected_game_id IS DISTINCT FROM v_game.id) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A prior peek that saw a cloud game must never fall back to creating a
  -- new game if the original game disappeared or was replaced in the interim.
  -- This is a preflight failure, not permission to bootstrap new cloud state.
  IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed');
  END IF;
  IF NOT FOUND AND p_local_game IS NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','no-cloud-game');
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      -- Revoke the credential itself, not just the writer flag. A displaced
      -- device must never retain a reusable token hash in the database.
      session_token_hash=NULL,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,ever_writer)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,v_auth_created_at,encode(extensions.digest(v_token,'sha256'),'hex'),true)
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,ever_writer=true,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id,is_current)
    VALUES(v_uid,p_local_game,0,v_session.id,true) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF NOT public.mahjong_sync_valid_game(p_game)
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Recheck Auth session under the same account lock used by takeover.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at IS NOT NULL
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during commit' USING ERRCODE='28000'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 -- Persistent login high-water guard also protects writes when the newer
 -- Auth session has expired or disappeared. A stale writer token alone is
 -- insufficient to prove that an older login still owns the account.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
   JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.auth_session_created_at IS NOT NULL
     AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 -- STAGE14: no historical device binding at commit; enforce current
 -- Auth session, writer lease, generation and token below instead.
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   -- A revoked or displaced device is no longer authorized to submit game
   -- payloads. Do not persist its proposed snapshot in the conflict ledger:
   -- that would permit repeated rejected writes to fill server storage.
   -- Only an authenticated CURRENT writer may record a revision conflict.
   IF v_reason='revision-conflict' THEN
     INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
       VALUES(v_game.id,v_uid,p_device_id,p_base_revision,p_game,v_reason);
   END IF;
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

-- Explicit reader enrollment. A read-only device must never call mahjong_sync_open,
-- because that operation transfers the sole writer lease.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_auth_created_at timestamptz;
 v_game public.mahjong_game_states%ROWTYPE;
 v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT created_at INTO v_auth_created_at FROM auth.sessions
  WHERE id=v_auth_session AND user_id=v_uid;
 IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
 -- Serialize with writer takeovers and commits for this account.
 SELECT raw_app_meta_data->>'role',
  COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false),
  banned_until,deleted_at INTO v_role,v_multi,v_banned,v_deleted
 FROM auth.users WHERE id=v_uid FOR UPDATE;
 IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL
  OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Reader enrollment also must not rely only on pre-lock Auth checks.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at=v_auth_created_at
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during reader open' USING ERRCODE='28000'; END IF;
 IF v_role<>'admin' AND NOT v_multi THEN
  RAISE EXCEPTION 'Multi-device reading not permitted' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 -- Never replace a newer recorded Auth session with an older one on a
 -- reused device ID. That would erase the persistent takeover high-water
 -- mark if multi-device access is subsequently disabled.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
  WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','newer-login');
 END IF;
 -- Never downgrade a current writer on this device. Require a separate
 -- device ID for a read-only enrollment, rather than clobber its token.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active AND is_writer
   AND revoked_at IS NULL) THEN
  RETURN jsonb_build_object('ok',false,'reason','device-already-writer');
 END IF;
 INSERT INTO public.mahjong_device_sessions
  (user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,revoked_at)
 VALUES(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL)
 ON CONFLICT(user_id,device_id) DO UPDATE SET
  is_active=true,is_writer=false,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,
  session_generation=public.mahjong_device_sessions.session_generation+1,
  session_token_hash=NULL,revoked_at=NULL,last_seen_at=now(),updated_at=now()
 RETURNING * INTO v_lease;
 INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
 VALUES(v_uid,v_uid,p_device_id,'reader-open',jsonb_build_object('game_id',v_game.id));
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',false,'generation',v_lease.session_generation);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open_reader(uuid) TO authenticated;

-- Read-only preflight: verify the exact Supabase Auth session and account status.
-- This does not create a device session, rotate a token, or modify game state.
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
    AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
 INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid;
 IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL
    OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM auth.sessions newer JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- A displaced old login must not resume metadata reads after the newer
 -- Auth session expires. The historical writer lease is the high-water mark.
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM public.mahjong_device_sessions prior
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision);
END; $$;
-- Read-only refresh for an already opened device session. Unlike peek, this
-- requires a registered, active lease for this exact Supabase Auth session.
-- It never grants writer privileges or rotates writer credentials.
CREATE OR REPLACE FUNCTION public.mahjong_sync_read(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid;
 v_game public.mahjong_game_states%ROWTYPE; v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- A newer login invalidates an older scorekeeper session unless explicitly
 -- allowed by administrator, even if its old lease has not yet been revoked.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active=true
   AND revoked_at IS NULL AND auth_session_id=v_auth_session;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 -- A reader lease is not a permanent entitlement. If the administrator
 -- disables multi-device access, reject previously enrolled reader sessions
 -- immediately instead of allowing continued cloud reads.
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
      AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',v_lease.is_writer
   AND v_lease.session_token_hash IS NOT NULL
   AND v_lease.session_generation>0
   AND v_game.writer_session_id=v_lease.id);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_read(uuid) TO authenticated;

-- Lightweight lease probe for foreground/periodic client checks. A stale device
-- must learn that its writer lease was revoked without waiting for a score edit.
-- This is advisory UI state; commit() remains the server-side security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_lease_status(p_device_id uuid,p_generation bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_auth_session uuid; v_lease public.mahjong_device_sessions%ROWTYPE;
 v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_generation<1 THEN
  RAISE EXCEPTION 'Authentication and valid lease identity required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
  RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND auth_session_id=v_auth_session
   AND session_generation=p_generation AND is_active=true AND revoked_at IS NULL;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked'); END IF;
 RETURN jsonb_build_object('ok',true,'canWrite',v_lease.is_writer
  AND v_lease.session_token_hash IS NOT NULL
  AND v_game.writer_session_id=v_lease.id,
  'gameId',v_game.id,'revision',v_game.revision);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;

-- ROLLBACK-ONLY TEST ASSERTIONS (no persistent schema/data changes)
DO $gate$
DECLARE v_count integer; v_exposed integer;
BEGIN
 SELECT count(*) INTO v_count FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND p.prosecdef AND EXISTS (SELECT 1 FROM unnest(COALESCE(p.proconfig, ARRAY[]::text[])) AS cfg(value) WHERE cfg.value IN ('search_path=', 'search_path=""'));
 IF v_count <> 5 THEN RAISE EXCEPTION 'RPC SECURITY GATE FAIL: expected 5 secure definer functions, found %',v_count; END IF;
 SELECT count(*) INTO v_exposed FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND (has_function_privilege('anon',p.oid,'EXECUTE') OR NOT has_function_privilege('authenticated',p.oid,'EXECUTE'));
 IF v_exposed <> 0 THEN RAISE EXCEPTION 'RPC GRANTS GATE FAIL: % functions exposed or missing auth grant',v_exposed; END IF;
 RAISE NOTICE 'PASS: five RPCs compiled, SECURITY DEFINER/search_path hardened, authenticated-only EXECUTE; ROLLBACK pending';
END $gate$;


-- Isolated latest-session write lifecycle. All changes are rolled back.
-- Lifecycle test intentionally omitted: it creates a current game inside the same transaction.
-- Lifecycle was already verified separately (6/6 PASS).

-- Same authenticated session, distinct device takeover and complete snapshot preservation.
-- This does NOT simulate a newly issued Supabase Auth session.
CREATE TEMP TABLE mahjong_device_takeover_results (scenario text, observed text, status text) ON COMMIT DROP;
DO $test$
DECLARE
 u uuid; sid uuid; device_a uuid:=gen_random_uuid(); device_b uuid:=gen_random_uuid(); n int;
 initial jsonb:='{"names":["Tong","Nan","Xi","Bei"],"scores":[5,-2,-2,-1],"history":[{"delta":[5,-2,-2,-1],"before":[0,0,0,0],"quads":[1,0,0,0],"winner":0,"dealer":0,"namesAtTime":["Tong","Nan","Xi","Bei"]}],"dealer":0,"round":2,"roundWind":0,"seatWinds":[0,1,2,3],"quads":[1,0,0,0]}'::jsonb;
 changed jsonb; a jsonb; b jsonb; stale jsonb; recovered jsonb; gid uuid; tok text; gen bigint; err text;
BEGIN
 SELECT count(*),(array_agg(id))[1] INTO n,u FROM auth.users WHERE raw_app_meta_data->>'role'='scorekeeper' AND deleted_at IS NULL AND (lower(raw_user_meta_data->>'username')='wiroseta' OR lower(raw_app_meta_data->>'username')='wiroseta' OR lower(split_part(email,'@',1))='wiroseta');
 IF n<>1 THEN RAISE EXCEPTION 'STOP: expected one test account'; END IF;
 SELECT id INTO sid FROM auth.sessions WHERE user_id=u AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now()) ORDER BY created_at DESC,id DESC LIMIT 1;
 IF sid IS NULL THEN RAISE EXCEPTION 'STOP: no active session'; END IF;
 IF EXISTS(SELECT 1 FROM public.mahjong_game_states WHERE owner_id=u AND is_current) OR EXISTS(SELECT 1 FROM public.mahjong_device_sessions WHERE user_id=u AND is_active) THEN RAISE EXCEPTION 'STOP: existing active game/lease'; END IF;
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',u,'role','authenticated','session_id',sid)::text,true);
 PERFORM set_config('request.jwt.claim.sub',u::text,true);
 INSERT INTO mahjong_device_takeover_results VALUES ('SNAPSHOT VALID', 'validator='||public.mahjong_sync_valid_game(initial), CASE WHEN public.mahjong_sync_valid_game(initial) THEN 'PASS' ELSE 'FAIL' END);
 IF NOT public.mahjong_sync_valid_game(initial) THEN RETURN; END IF;
 a:=public.mahjong_sync_open(device_a,initial,NULL,NULL);
 INSERT INTO mahjong_device_takeover_results VALUES ('DEVICE A OPEN',coalesce(a->>'reason','ok='||(a->>'ok')),CASE WHEN a->>'ok'='true' THEN 'PASS' ELSE 'FAIL' END);
 IF a->>'ok' IS DISTINCT FROM 'true' THEN RETURN; END IF;
 gid:=(a->>'gameId')::uuid; tok:=a->>'writerToken'; gen:=(a->>'generation')::bigint;
 b:=public.mahjong_sync_open(device_b,NULL,0,gid);
 INSERT INTO mahjong_device_takeover_results VALUES ('DEVICE B TAKES WRITER',coalesce(b->>'reason','ok='||(b->>'ok')),CASE WHEN b->>'ok'='true' AND b->>'writerToken'<>tok THEN 'PASS' ELSE 'FAIL' END);
 IF b->>'ok' IS DISTINCT FROM 'true' THEN RETURN; END IF;
 changed:=jsonb_set(initial,'{scores}','[0,0,0,0]'::jsonb);
 err:=NULL; stale:=NULL;
 BEGIN stale:=public.mahjong_sync_commit(gid,device_a,gen,tok,0,changed);
 EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS err=RETURNED_SQLSTATE; END;
 INSERT INTO mahjong_device_takeover_results VALUES ('DEVICE A STALE WRITE DENIED',coalesce(err,stale->>'reason','NULL'),CASE WHEN err IN ('42501','28000') OR (stale->>'ok'='false') THEN 'PASS' ELSE 'FAIL' END);
 recovered:=public.mahjong_sync_read(device_b);
 INSERT INTO mahjong_device_takeover_results VALUES ('DEVICE B READ',coalesce(recovered->>'reason','ok='||(recovered->>'ok')),CASE WHEN recovered->>'ok'='true' THEN 'PASS' ELSE 'FAIL' END);
 INSERT INTO mahjong_device_takeover_results VALUES ('FULL SNAPSHOT PRESERVED',CASE WHEN (SELECT game_data=initial FROM public.mahjong_game_states WHERE id=gid) THEN 'exact JSONB match' ELSE 'mismatch' END,CASE WHEN (SELECT game_data=initial FROM public.mahjong_game_states WHERE id=gid) THEN 'PASS' ELSE 'FAIL' END);
 INSERT INTO mahjong_device_takeover_results VALUES ('REVISION UNCHANGED', (SELECT revision::text FROM public.mahjong_game_states WHERE id=gid),CASE WHEN (SELECT revision=0 FROM public.mahjong_game_states WHERE id=gid) THEN 'PASS' ELSE 'FAIL' END);
END $test$;
SELECT scenario,observed,status FROM mahjong_device_takeover_results;
ROLLBACK;

```

## supabase_sync_stage14_access_preflight_readonly.sql

```sql
-- STAGE14 READ ONLY. Run separately; never deploy candidate SQL.
-- Checks direct table privileges, RLS policies, uniqueness of current game,
-- and executable privileges for sync RPCs. Does not read game data.
WITH expected_tables(name) AS (
 VALUES ('mahjong_device_sessions'),('mahjong_game_states'),
        ('mahjong_sync_conflicts'),('mahjong_session_audit')
), target_tables AS (
 SELECT c.oid, c.relname, c.relrowsecurity,
        c.relforcerowsecurity
 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='public' AND c.relname IN
 ('mahjong_device_sessions','mahjong_game_states','mahjong_sync_conflicts','mahjong_session_audit')
 AND c.relkind IN ('r','p')
), presence AS (
 SELECT 'TABLE_PRESENCE'::text AS category, e.name::text AS object_name,
  jsonb_build_object('installed',t.oid IS NOT NULL) AS details
 FROM expected_tables e LEFT JOIN target_tables t ON t.relname=e.name
), grants AS (
 SELECT 'TABLE_PRIVILEGE'::text AS category, t.relname::text AS object_name,
  jsonb_build_object('rls',t.relrowsecurity,'forced',t.relforcerowsecurity,
   'anon_select',has_table_privilege('anon',t.oid,'SELECT'),
   'anon_insert',has_table_privilege('anon',t.oid,'INSERT'),
   'anon_update',has_table_privilege('anon',t.oid,'UPDATE'),
   'anon_delete',has_table_privilege('anon',t.oid,'DELETE'),
   'authenticated_select',has_table_privilege('authenticated',t.oid,'SELECT'),
   'authenticated_insert',has_table_privilege('authenticated',t.oid,'INSERT'),
   'authenticated_update',has_table_privilege('authenticated',t.oid,'UPDATE'),
   'authenticated_delete',has_table_privilege('authenticated',t.oid,'DELETE')) AS details
 FROM target_tables t
), policies AS (
 SELECT 'POLICY'::text AS category, tablename || '.' || policyname AS object_name,
  jsonb_build_object('cmd',cmd,'roles',roles,'using',qual,'check',with_check) AS details
 FROM pg_policies WHERE schemaname='public' AND tablename IN (SELECT relname FROM target_tables)
), indexes AS (
 SELECT 'INDEX'::text AS category, i.indexname AS object_name,
  jsonb_build_object('table',i.tablename,'definition',i.indexdef) AS details
 FROM pg_indexes i WHERE i.schemaname='public' AND i.tablename IN (SELECT relname FROM target_tables)
), rpcs AS (
 SELECT 'RPC_PRIVILEGE'::text AS category,
  p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' AS object_name,
  jsonb_build_object('security_definer',p.prosecdef,
   'anon_execute',has_function_privilege('anon',p.oid,'EXECUTE'),
   'authenticated_execute',has_function_privilege('authenticated',p.oid,'EXECUTE')) AS details
 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname LIKE 'mahjong_sync_%'
)
SELECT * FROM presence UNION ALL SELECT * FROM grants UNION ALL SELECT * FROM policies UNION ALL
SELECT * FROM indexes UNION ALL SELECT * FROM rpcs
ORDER BY category,object_name;

-- Stage14 schema alignment (second read-only result set).
-- Missing columns are visible even when the table itself is absent.
WITH required_columns(table_name,column_name) AS (
 VALUES
 ('mahjong_device_sessions','auth_session_id'),
 ('mahjong_device_sessions','auth_session_created_at'),
 ('mahjong_device_sessions','ever_writer'),
 ('mahjong_device_sessions','session_generation'),
 ('mahjong_device_sessions','session_token_hash'),
 ('mahjong_game_states','is_current'),
 ('mahjong_game_states','revision'),
 ('mahjong_game_states','writer_session_id')
), column_inventory AS (
 SELECT c.table_name,c.column_name,c.data_type,c.column_default
 FROM information_schema.columns c
 WHERE c.table_schema='public'
)
SELECT r.table_name,r.column_name,
       (i.column_name IS NOT NULL) AS installed,
       i.data_type,i.column_default
FROM required_columns r
LEFT JOIN column_inventory i
 ON i.table_name=r.table_name AND i.column_name=r.column_name
ORDER BY r.table_name,r.column_name;

```

## supabase_sync_stage14_auth_negative_rollback_ONLY.sql

```sql
-- ISOLATED COMPILATION DRILL ONLY. DO NOT USE AS INSTALLATION MIGRATION.
-- Run the ENTIRE script in one SQL Editor execution. Never execute fragments.
-- PostgreSQL transactional DDL rolls back all function/table modifications.
-- Does not test runtime RPC authentication, concurrency, or restore capability.
-- STAGE14 AUTOMATIC TRANSFER CANDIDATE — NOT FOR PRODUCTION.
-- Existing Supabase project only: requires isolated test accounts and two-device verification.
-- Depends on v15.7.14 foundation tables.
-- FAIL-CLOSED: token issuance and authentication not yet integrated.
-- This file is deliberately NOT executable in production.
-- REVIEW: existing auth.sessions created_at ordering alone is insufficient to prove
-- the new session owns the writer lease; auth session ID must match on every commit.
-- Original production installation guard intentionally removed ONLY in this rollback-only compilation drill.
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
-- Preserve historical writer binding independently of read-only enrollments.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false;
-- Match the guarded alignment candidate: never auto-promote legacy games.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
-- ADD COLUMN IF NOT EXISTS does not alter an existing DEFAULT true.
-- Explicitly align future implicit inserts; do not rewrite existing game rows.
ALTER TABLE public.mahjong_game_states ALTER COLUMN is_current SET DEFAULT false;
-- Existing verified index: mahjong_one_current_game_per_owner (owner_id WHERE is_current = true).
-- Do not create an equivalent second index here: fail closed until the
-- foundation migration is independently verified in the target environment.

-- Server-side schema validation mirrors the essential four-player client invariants.
-- Do not trust a browser-side validator as a security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN false
  WHEN jsonb_array_length(p_game->'history')>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(trim(leading '-' from x::text))>12) THEN false
  WHEN p_game ? 'roundWind' AND (jsonb_typeof(p_game->'roundWind') IS DISTINCT FROM 'number'
    OR (p_game->>'roundWind') !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (jsonb_typeof(p_game->'seatWinds') IS DISTINCT FROM 'array'
    OR (CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN jsonb_array_length(p_game->'seatWinds') ELSE NULL END)<>4) THEN false
  WHEN p_game ? 'seatWinds' AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number' OR x::text !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (SELECT count(DISTINCT x) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x)<>4 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'object') THEN false
  -- Keep server-side history checks aligned with the client recovery ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE (x ? 'delta' AND (jsonb_typeof(x->'delta') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN jsonb_array_length(x->'delta') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'quads' AND (jsonb_typeof(x->'quads') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN jsonb_array_length(x->'quads') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN x->'quads' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-4]$')))
    OR (x ? 'winner' AND x->'winner'<>'null'::jsonb AND (jsonb_typeof(x->'winner') IS DISTINCT FROM 'number' OR x->>'winner' !~ '^[0-3]$'))
    OR (x ? 'dealer' AND x->'dealer'<>'null'::jsonb AND (jsonb_typeof(x->'dealer') IS DISTINCT FROM 'number' OR x->>'dealer' !~ '^[0-3]$'))
    OR (x ? 'discarder' AND x->'discarder'<>'null'::jsonb AND (jsonb_typeof(x->'discarder') IS DISTINCT FROM 'number' OR x->>'discarder' !~ '^[0-3]$'))
    OR (x ? 'roundWind' AND (jsonb_typeof(x->'roundWind') IS DISTINCT FROM 'number' OR x->>'roundWind' !~ '^[0-3]$'))
    OR (x ? 'method' AND jsonb_typeof(x->'method') IS DISTINCT FROM 'string')
    OR (x ? 'playerPatterns' AND (jsonb_typeof(x->'playerPatterns') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN jsonb_array_length(x->'playerPatterns') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN x->'playerPatterns' ELSE '[]'::jsonb END) p WHERE p <> 'null'::jsonb AND
       (jsonb_typeof(p) IS DISTINCT FROM 'object' OR jsonb_typeof(p->'name') IS DISTINCT FROM 'string'
        OR length(p->>'name')>100 OR jsonb_typeof(p->'points') IS DISTINCT FROM 'number'
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM p->>'points'))>12))))
    OR (x ? 'patterns' AND (jsonb_typeof(x->'patterns') IS DISTINCT FROM 'array'
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'patterns') = 'array' THEN x->'patterns' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string')))
    OR (x ? 'seatWindsBefore' AND (jsonb_typeof(x->'seatWindsBefore') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN jsonb_array_length(x->'seatWindsBefore') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-3]$')
      OR (SELECT count(DISTINCT n) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n)<>4))
    OR (x ? 'namesAtTime' AND (jsonb_typeof(x->'namesAtTime') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN jsonb_array_length(x->'namesAtTime') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN x->'namesAtTime' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string' OR length(n #>> '{}')>100)))
  ) THEN false

  ELSE true END;
$$;
REVOKE ALL ON FUNCTION public.mahjong_sync_valid_game(jsonb) FROM PUBLIC,anon,authenticated;

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid; v_auth_created_at timestamptz;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT created_at INTO v_auth_created_at FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid;
  IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  IF v_token IS NULL OR v_token !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Token generator contract invalid' USING ERRCODE='22023';
  END IF;
  -- NULL means this device has no local game to upload. It may adopt an existing
  -- cloud game, but must never create an empty cloud game implicitly.
  IF p_local_game IS NOT NULL AND NOT public.mahjong_sync_valid_game(p_local_game)
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  -- Persistent high-water mark: a displaced older Auth session must not
  -- reclaim the writer lease even after the newer Auth session expires or
  -- its auth.sessions row is deleted. Keep historical device rows for this guard.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501';
  END IF;
  -- Do not downgrade the persistent login high-water mark when an admin or
  -- multi-device scorekeeper reuses a device ID from an older Auth session.
  -- This also matters if multi-device permission is disabled later.
  IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
      AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','newer-login');
  END IF;
  -- A caller that supplied a preflight identity must match it regardless
  -- of whether it is adopting cloud data or already holds a local copy.
  -- Otherwise a stale client can take over a different current game.
  IF p_expected_revision IS NOT NULL AND p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Expected revision must not be negative';
  END IF;
  IF (p_expected_revision IS NULL) IS DISTINCT FROM (p_expected_game_id IS NULL) THEN
    RAISE EXCEPTION 'Both expected game ID and revision are required together';
  END IF;
  -- STAGE14 CANDIDATE: an authenticated newer session may take over a
  -- different device after matching cloud game identity/revision below.
  -- The older session is revoked only after all preflight checks pass.
  -- Safety preflight: never revoke an existing writer before checking whether
  -- this device has a different game. The client must reconcile explicitly.
  -- A rejected takeover must leave the current writer fully operational.
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  -- Existing cloud state always requires a matching preflight, even when
  -- the caller submits an identical local snapshot. Otherwise a stale client
  -- could rotate the writer lease without first observing the current revision.
  IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  IF FOUND AND p_expected_game_id IS NOT NULL AND
     (v_game.id IS DISTINCT FROM p_expected_game_id OR
      v_game.revision IS DISTINCT FROM p_expected_revision) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- Compare local payload only after validating the cloud identity/revision.
  -- A stale preflight must not receive the full current game snapshot via
  -- the mismatch response; it must refresh and reconcile explicitly.
  IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN
    RETURN jsonb_build_object('ok',false,'reason','local-cloud-mismatch',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A takeover that adopts cloud state must be based on a prior read of its
  -- exact revision. This prevents a concurrent commit between peek and open
  -- from silently changing the state accepted by the new device.
  IF FOUND AND p_local_game IS NULL AND
     (p_expected_revision IS NULL OR p_expected_revision IS DISTINCT FROM v_game.revision
      OR p_expected_game_id IS NULL OR p_expected_game_id IS DISTINCT FROM v_game.id) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A prior peek that saw a cloud game must never fall back to creating a
  -- new game if the original game disappeared or was replaced in the interim.
  -- This is a preflight failure, not permission to bootstrap new cloud state.
  IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed');
  END IF;
  IF NOT FOUND AND p_local_game IS NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','no-cloud-game');
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      -- Revoke the credential itself, not just the writer flag. A displaced
      -- device must never retain a reusable token hash in the database.
      session_token_hash=NULL,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,ever_writer)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,v_auth_created_at,encode(extensions.digest(v_token,'sha256'),'hex'),true)
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,ever_writer=true,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id,is_current)
    VALUES(v_uid,p_local_game,0,v_session.id,true) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF NOT public.mahjong_sync_valid_game(p_game)
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 -- Persistent login high-water guard also protects writes when the newer
 -- Auth session has expired or disappeared. A stale writer token alone is
 -- insufficient to prove that an older login still owns the account.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
   JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.auth_session_created_at IS NOT NULL
     AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 -- STAGE14: no historical device binding at commit; enforce current
 -- Auth session, writer lease, generation and token below instead.
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   -- A revoked or displaced device is no longer authorized to submit game
   -- payloads. Do not persist its proposed snapshot in the conflict ledger:
   -- that would permit repeated rejected writes to fill server storage.
   -- Only an authenticated CURRENT writer may record a revision conflict.
   IF v_reason='revision-conflict' THEN
     INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
       VALUES(v_game.id,v_uid,p_device_id,p_base_revision,p_game,v_reason);
   END IF;
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

-- Explicit reader enrollment. A read-only device must never call mahjong_sync_open,
-- because that operation transfers the sole writer lease.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_auth_created_at timestamptz;
 v_game public.mahjong_game_states%ROWTYPE;
 v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT created_at INTO v_auth_created_at FROM auth.sessions
  WHERE id=v_auth_session AND user_id=v_uid;
 IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
 -- Serialize with writer takeovers and commits for this account.
 SELECT raw_app_meta_data->>'role',
  COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false),
  banned_until,deleted_at INTO v_role,v_multi,v_banned,v_deleted
 FROM auth.users WHERE id=v_uid FOR UPDATE;
 IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL
  OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role<>'admin' AND NOT v_multi THEN
  RAISE EXCEPTION 'Multi-device reading not permitted' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 -- Never replace a newer recorded Auth session with an older one on a
 -- reused device ID. That would erase the persistent takeover high-water
 -- mark if multi-device access is subsequently disabled.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
  WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','newer-login');
 END IF;
 -- Never downgrade a current writer on this device. Require a separate
 -- device ID for a read-only enrollment, rather than clobber its token.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active AND is_writer
   AND revoked_at IS NULL) THEN
  RETURN jsonb_build_object('ok',false,'reason','device-already-writer');
 END IF;
 INSERT INTO public.mahjong_device_sessions
  (user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,revoked_at)
 VALUES(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL)
 ON CONFLICT(user_id,device_id) DO UPDATE SET
  is_active=true,is_writer=false,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,
  session_generation=public.mahjong_device_sessions.session_generation+1,
  session_token_hash=NULL,revoked_at=NULL,last_seen_at=now(),updated_at=now()
 RETURNING * INTO v_lease;
 INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
 VALUES(v_uid,v_uid,p_device_id,'reader-open',jsonb_build_object('game_id',v_game.id));
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',false,'generation',v_lease.session_generation);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open_reader(uuid) TO authenticated;

-- Read-only preflight: verify the exact Supabase Auth session and account status.
-- This does not create a device session, rotate a token, or modify game state.
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
    AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
 INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid;
 IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL
    OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM auth.sessions newer JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- A displaced old login must not resume metadata reads after the newer
 -- Auth session expires. The historical writer lease is the high-water mark.
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM public.mahjong_device_sessions prior
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision);
END; $$;
-- Read-only refresh for an already opened device session. Unlike peek, this
-- requires a registered, active lease for this exact Supabase Auth session.
-- It never grants writer privileges or rotates writer credentials.
CREATE OR REPLACE FUNCTION public.mahjong_sync_read(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid;
 v_game public.mahjong_game_states%ROWTYPE; v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- A newer login invalidates an older scorekeeper session unless explicitly
 -- allowed by administrator, even if its old lease has not yet been revoked.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active=true
   AND revoked_at IS NULL AND auth_session_id=v_auth_session;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 -- A reader lease is not a permanent entitlement. If the administrator
 -- disables multi-device access, reject previously enrolled reader sessions
 -- immediately instead of allowing continued cloud reads.
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
      AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',v_lease.is_writer
   AND v_lease.session_token_hash IS NOT NULL
   AND v_lease.session_generation>0
   AND v_game.writer_session_id=v_lease.id);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_read(uuid) TO authenticated;

-- Lightweight lease probe for foreground/periodic client checks. A stale device
-- must learn that its writer lease was revoked without waiting for a score edit.
-- This is advisory UI state; commit() remains the server-side security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_lease_status(p_device_id uuid,p_generation bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_auth_session uuid; v_lease public.mahjong_device_sessions%ROWTYPE;
 v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_generation<1 THEN
  RAISE EXCEPTION 'Authentication and valid lease identity required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
  RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND auth_session_id=v_auth_session
   AND session_generation=p_generation AND is_active=true AND revoked_at IS NULL;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked'); END IF;
 RETURN jsonb_build_object('ok',true,'canWrite',v_lease.is_writer
  AND v_lease.session_token_hash IS NOT NULL
  AND v_game.writer_session_id=v_lease.id,
  'gameId',v_game.id,'revision',v_game.revision);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;

-- Runtime negative-auth checks within the same rollback transaction.
-- Run as Supabase SQL Editor postgres. Simulates absence of JWT only; NOT proof of full authenticated role/JWT security.
DO $gate$
DECLARE v_result jsonb; v_rejected boolean; v_pass int := 0;
BEGIN
  v_rejected := false;
  BEGIN
    v_result := public.mahjong_sync_open('11111111-1111-4111-8111-111111111111'::uuid,NULL::jsonb,NULL::bigint,NULL::uuid);
    IF COALESCE(v_result->>'ok','false') <> 'true' THEN v_rejected := true; END IF;
  EXCEPTION WHEN OTHERS THEN
    IF SQLSTATE IN ('28000','42501') OR SQLERRM ILIKE '%auth%' OR SQLERRM ILIKE '%session%' THEN v_rejected := true; ELSE RAISE; END IF;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'AUTH NEGATIVE GATE FAIL: open'; END IF;
  v_pass := v_pass + 1;
  RAISE NOTICE 'AUTH NEGATIVE PASS: open';
  v_rejected := false;
  BEGIN
    v_result := public.mahjong_sync_commit('11111111-1111-4111-8111-111111111111'::uuid,'22222222-2222-4222-8222-222222222222'::uuid,1,'invalid',0,'{}'::jsonb);
    IF COALESCE(v_result->>'ok','false') <> 'true' THEN v_rejected := true; END IF;
  EXCEPTION WHEN OTHERS THEN
    IF SQLSTATE IN ('28000','42501') OR SQLERRM ILIKE '%auth%' OR SQLERRM ILIKE '%session%' THEN v_rejected := true; ELSE RAISE; END IF;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'AUTH NEGATIVE GATE FAIL: commit'; END IF;
  v_pass := v_pass + 1;
  RAISE NOTICE 'AUTH NEGATIVE PASS: commit';
  v_rejected := false;
  BEGIN
    v_result := public.mahjong_sync_open_reader('11111111-1111-4111-8111-111111111111'::uuid);
    IF COALESCE(v_result->>'ok','false') <> 'true' THEN v_rejected := true; END IF;
  EXCEPTION WHEN OTHERS THEN
    IF SQLSTATE IN ('28000','42501') OR SQLERRM ILIKE '%auth%' OR SQLERRM ILIKE '%session%' THEN v_rejected := true; ELSE RAISE; END IF;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'AUTH NEGATIVE GATE FAIL: open_reader'; END IF;
  v_pass := v_pass + 1;
  RAISE NOTICE 'AUTH NEGATIVE PASS: open_reader';
  v_rejected := false;
  BEGIN
    v_result := public.mahjong_sync_read('11111111-1111-4111-8111-111111111111'::uuid);
    IF COALESCE(v_result->>'ok','false') <> 'true' THEN v_rejected := true; END IF;
  EXCEPTION WHEN OTHERS THEN
    IF SQLSTATE IN ('28000','42501') OR SQLERRM ILIKE '%auth%' OR SQLERRM ILIKE '%session%' THEN v_rejected := true; ELSE RAISE; END IF;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'AUTH NEGATIVE GATE FAIL: read'; END IF;
  v_pass := v_pass + 1;
  RAISE NOTICE 'AUTH NEGATIVE PASS: read';
  v_rejected := false;
  BEGIN
    v_result := public.mahjong_sync_lease_status('11111111-1111-4111-8111-111111111111'::uuid,1);
    IF COALESCE(v_result->>'ok','false') <> 'true' THEN v_rejected := true; END IF;
  EXCEPTION WHEN OTHERS THEN
    IF SQLSTATE IN ('28000','42501') OR SQLERRM ILIKE '%auth%' OR SQLERRM ILIKE '%session%' THEN v_rejected := true; ELSE RAISE; END IF;
  END;
  IF NOT v_rejected THEN RAISE EXCEPTION 'AUTH NEGATIVE GATE FAIL: lease_status'; END IF;
  v_pass := v_pass + 1;
  RAISE NOTICE 'AUTH NEGATIVE PASS: lease_status';
  IF v_pass <> 5 THEN RAISE EXCEPTION 'Only % negative gates passed', v_pass; END IF;
  RAISE NOTICE 'AUTH NEGATIVE GATE: 5/5 PASS (missing JWT only)';
END;
$gate$;
ROLLBACK;

```

## supabase_sync_stage14_auth_strict_rollback_ONLY.sql

```sql
-- ISOLATED COMPILATION DRILL ONLY. DO NOT USE AS INSTALLATION MIGRATION.
-- Run the ENTIRE script in one SQL Editor execution. Never execute fragments.
-- PostgreSQL transactional DDL rolls back all function/table modifications.
-- Does not test runtime RPC authentication, concurrency, or restore capability.
-- STAGE14 AUTOMATIC TRANSFER CANDIDATE — NOT FOR PRODUCTION.
-- Existing Supabase project only: requires isolated test accounts and two-device verification.
-- Depends on v15.7.14 foundation tables.
-- FAIL-CLOSED: token issuance and authentication not yet integrated.
-- This file is deliberately NOT executable in production.
-- REVIEW: existing auth.sessions created_at ordering alone is insufficient to prove
-- the new session owns the writer lease; auth session ID must match on every commit.
-- Original production installation guard intentionally removed ONLY in this rollback-only compilation drill.
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
-- Preserve historical writer binding independently of read-only enrollments.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false;
-- Match the guarded alignment candidate: never auto-promote legacy games.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
-- ADD COLUMN IF NOT EXISTS does not alter an existing DEFAULT true.
-- Explicitly align future implicit inserts; do not rewrite existing game rows.
ALTER TABLE public.mahjong_game_states ALTER COLUMN is_current SET DEFAULT false;
-- Existing verified index: mahjong_one_current_game_per_owner (owner_id WHERE is_current = true).
-- Do not create an equivalent second index here: fail closed until the
-- foundation migration is independently verified in the target environment.

-- Server-side schema validation mirrors the essential four-player client invariants.
-- Do not trust a browser-side validator as a security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN false
  WHEN jsonb_array_length(p_game->'history')>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(trim(leading '-' from x::text))>12) THEN false
  WHEN p_game ? 'roundWind' AND (jsonb_typeof(p_game->'roundWind') IS DISTINCT FROM 'number'
    OR (p_game->>'roundWind') !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (jsonb_typeof(p_game->'seatWinds') IS DISTINCT FROM 'array'
    OR (CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN jsonb_array_length(p_game->'seatWinds') ELSE NULL END)<>4) THEN false
  WHEN p_game ? 'seatWinds' AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number' OR x::text !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (SELECT count(DISTINCT x) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x)<>4 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'object') THEN false
  -- Keep server-side history checks aligned with the client recovery ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE (x ? 'delta' AND (jsonb_typeof(x->'delta') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN jsonb_array_length(x->'delta') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'quads' AND (jsonb_typeof(x->'quads') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN jsonb_array_length(x->'quads') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN x->'quads' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-4]$')))
    OR (x ? 'winner' AND x->'winner'<>'null'::jsonb AND (jsonb_typeof(x->'winner') IS DISTINCT FROM 'number' OR x->>'winner' !~ '^[0-3]$'))
    OR (x ? 'dealer' AND x->'dealer'<>'null'::jsonb AND (jsonb_typeof(x->'dealer') IS DISTINCT FROM 'number' OR x->>'dealer' !~ '^[0-3]$'))
    OR (x ? 'discarder' AND x->'discarder'<>'null'::jsonb AND (jsonb_typeof(x->'discarder') IS DISTINCT FROM 'number' OR x->>'discarder' !~ '^[0-3]$'))
    OR (x ? 'roundWind' AND (jsonb_typeof(x->'roundWind') IS DISTINCT FROM 'number' OR x->>'roundWind' !~ '^[0-3]$'))
    OR (x ? 'method' AND jsonb_typeof(x->'method') IS DISTINCT FROM 'string')
    OR (x ? 'playerPatterns' AND (jsonb_typeof(x->'playerPatterns') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN jsonb_array_length(x->'playerPatterns') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN x->'playerPatterns' ELSE '[]'::jsonb END) p WHERE p <> 'null'::jsonb AND
       (jsonb_typeof(p) IS DISTINCT FROM 'object' OR jsonb_typeof(p->'name') IS DISTINCT FROM 'string'
        OR length(p->>'name')>100 OR jsonb_typeof(p->'points') IS DISTINCT FROM 'number'
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM p->>'points'))>12))))
    OR (x ? 'patterns' AND (jsonb_typeof(x->'patterns') IS DISTINCT FROM 'array'
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'patterns') = 'array' THEN x->'patterns' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string')))
    OR (x ? 'seatWindsBefore' AND (jsonb_typeof(x->'seatWindsBefore') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN jsonb_array_length(x->'seatWindsBefore') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-3]$')
      OR (SELECT count(DISTINCT n) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n)<>4))
    OR (x ? 'namesAtTime' AND (jsonb_typeof(x->'namesAtTime') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN jsonb_array_length(x->'namesAtTime') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN x->'namesAtTime' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string' OR length(n #>> '{}')>100)))
  ) THEN false

  ELSE true END;
$$;
REVOKE ALL ON FUNCTION public.mahjong_sync_valid_game(jsonb) FROM PUBLIC,anon,authenticated;

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid; v_auth_created_at timestamptz;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT created_at INTO v_auth_created_at FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid;
  IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  IF v_token IS NULL OR v_token !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Token generator contract invalid' USING ERRCODE='22023';
  END IF;
  -- NULL means this device has no local game to upload. It may adopt an existing
  -- cloud game, but must never create an empty cloud game implicitly.
  IF p_local_game IS NOT NULL AND NOT public.mahjong_sync_valid_game(p_local_game)
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  -- Persistent high-water mark: a displaced older Auth session must not
  -- reclaim the writer lease even after the newer Auth session expires or
  -- its auth.sessions row is deleted. Keep historical device rows for this guard.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501';
  END IF;
  -- Do not downgrade the persistent login high-water mark when an admin or
  -- multi-device scorekeeper reuses a device ID from an older Auth session.
  -- This also matters if multi-device permission is disabled later.
  IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
      AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','newer-login');
  END IF;
  -- A caller that supplied a preflight identity must match it regardless
  -- of whether it is adopting cloud data or already holds a local copy.
  -- Otherwise a stale client can take over a different current game.
  IF p_expected_revision IS NOT NULL AND p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Expected revision must not be negative';
  END IF;
  IF (p_expected_revision IS NULL) IS DISTINCT FROM (p_expected_game_id IS NULL) THEN
    RAISE EXCEPTION 'Both expected game ID and revision are required together';
  END IF;
  -- STAGE14 CANDIDATE: an authenticated newer session may take over a
  -- different device after matching cloud game identity/revision below.
  -- The older session is revoked only after all preflight checks pass.
  -- Safety preflight: never revoke an existing writer before checking whether
  -- this device has a different game. The client must reconcile explicitly.
  -- A rejected takeover must leave the current writer fully operational.
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  -- Existing cloud state always requires a matching preflight, even when
  -- the caller submits an identical local snapshot. Otherwise a stale client
  -- could rotate the writer lease without first observing the current revision.
  IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  IF FOUND AND p_expected_game_id IS NOT NULL AND
     (v_game.id IS DISTINCT FROM p_expected_game_id OR
      v_game.revision IS DISTINCT FROM p_expected_revision) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- Compare local payload only after validating the cloud identity/revision.
  -- A stale preflight must not receive the full current game snapshot via
  -- the mismatch response; it must refresh and reconcile explicitly.
  IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN
    RETURN jsonb_build_object('ok',false,'reason','local-cloud-mismatch',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A takeover that adopts cloud state must be based on a prior read of its
  -- exact revision. This prevents a concurrent commit between peek and open
  -- from silently changing the state accepted by the new device.
  IF FOUND AND p_local_game IS NULL AND
     (p_expected_revision IS NULL OR p_expected_revision IS DISTINCT FROM v_game.revision
      OR p_expected_game_id IS NULL OR p_expected_game_id IS DISTINCT FROM v_game.id) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A prior peek that saw a cloud game must never fall back to creating a
  -- new game if the original game disappeared or was replaced in the interim.
  -- This is a preflight failure, not permission to bootstrap new cloud state.
  IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed');
  END IF;
  IF NOT FOUND AND p_local_game IS NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','no-cloud-game');
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      -- Revoke the credential itself, not just the writer flag. A displaced
      -- device must never retain a reusable token hash in the database.
      session_token_hash=NULL,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,ever_writer)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,v_auth_created_at,encode(extensions.digest(v_token,'sha256'),'hex'),true)
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,ever_writer=true,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id,is_current)
    VALUES(v_uid,p_local_game,0,v_session.id,true) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF NOT public.mahjong_sync_valid_game(p_game)
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 -- Persistent login high-water guard also protects writes when the newer
 -- Auth session has expired or disappeared. A stale writer token alone is
 -- insufficient to prove that an older login still owns the account.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
   JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.auth_session_created_at IS NOT NULL
     AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 -- STAGE14: no historical device binding at commit; enforce current
 -- Auth session, writer lease, generation and token below instead.
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   -- A revoked or displaced device is no longer authorized to submit game
   -- payloads. Do not persist its proposed snapshot in the conflict ledger:
   -- that would permit repeated rejected writes to fill server storage.
   -- Only an authenticated CURRENT writer may record a revision conflict.
   IF v_reason='revision-conflict' THEN
     INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
       VALUES(v_game.id,v_uid,p_device_id,p_base_revision,p_game,v_reason);
   END IF;
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

-- Explicit reader enrollment. A read-only device must never call mahjong_sync_open,
-- because that operation transfers the sole writer lease.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_auth_created_at timestamptz;
 v_game public.mahjong_game_states%ROWTYPE;
 v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT created_at INTO v_auth_created_at FROM auth.sessions
  WHERE id=v_auth_session AND user_id=v_uid;
 IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
 -- Serialize with writer takeovers and commits for this account.
 SELECT raw_app_meta_data->>'role',
  COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false),
  banned_until,deleted_at INTO v_role,v_multi,v_banned,v_deleted
 FROM auth.users WHERE id=v_uid FOR UPDATE;
 IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL
  OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role<>'admin' AND NOT v_multi THEN
  RAISE EXCEPTION 'Multi-device reading not permitted' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 -- Never replace a newer recorded Auth session with an older one on a
 -- reused device ID. That would erase the persistent takeover high-water
 -- mark if multi-device access is subsequently disabled.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
  WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','newer-login');
 END IF;
 -- Never downgrade a current writer on this device. Require a separate
 -- device ID for a read-only enrollment, rather than clobber its token.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active AND is_writer
   AND revoked_at IS NULL) THEN
  RETURN jsonb_build_object('ok',false,'reason','device-already-writer');
 END IF;
 INSERT INTO public.mahjong_device_sessions
  (user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,revoked_at)
 VALUES(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL)
 ON CONFLICT(user_id,device_id) DO UPDATE SET
  is_active=true,is_writer=false,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,
  session_generation=public.mahjong_device_sessions.session_generation+1,
  session_token_hash=NULL,revoked_at=NULL,last_seen_at=now(),updated_at=now()
 RETURNING * INTO v_lease;
 INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
 VALUES(v_uid,v_uid,p_device_id,'reader-open',jsonb_build_object('game_id',v_game.id));
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',false,'generation',v_lease.session_generation);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open_reader(uuid) TO authenticated;

-- Read-only preflight: verify the exact Supabase Auth session and account status.
-- This does not create a device session, rotate a token, or modify game state.
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
    AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
 INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid;
 IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL
    OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM auth.sessions newer JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- A displaced old login must not resume metadata reads after the newer
 -- Auth session expires. The historical writer lease is the high-water mark.
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM public.mahjong_device_sessions prior
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision);
END; $$;
-- Read-only refresh for an already opened device session. Unlike peek, this
-- requires a registered, active lease for this exact Supabase Auth session.
-- It never grants writer privileges or rotates writer credentials.
CREATE OR REPLACE FUNCTION public.mahjong_sync_read(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid;
 v_game public.mahjong_game_states%ROWTYPE; v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- A newer login invalidates an older scorekeeper session unless explicitly
 -- allowed by administrator, even if its old lease has not yet been revoked.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active=true
   AND revoked_at IS NULL AND auth_session_id=v_auth_session;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 -- A reader lease is not a permanent entitlement. If the administrator
 -- disables multi-device access, reject previously enrolled reader sessions
 -- immediately instead of allowing continued cloud reads.
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
      AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',v_lease.is_writer
   AND v_lease.session_token_hash IS NOT NULL
   AND v_lease.session_generation>0
   AND v_game.writer_session_id=v_lease.id);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_read(uuid) TO authenticated;

-- Lightweight lease probe for foreground/periodic client checks. A stale device
-- must learn that its writer lease was revoked without waiting for a score edit.
-- This is advisory UI state; commit() remains the server-side security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_lease_status(p_device_id uuid,p_generation bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_auth_session uuid; v_lease public.mahjong_device_sessions%ROWTYPE;
 v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_generation<1 THEN
  RAISE EXCEPTION 'Authentication and valid lease identity required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
  RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND auth_session_id=v_auth_session
   AND session_generation=p_generation AND is_active=true AND revoked_at IS NULL;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked'); END IF;
 RETURN jsonb_build_object('ok',true,'canWrite',v_lease.is_writer
  AND v_lease.session_token_hash IS NOT NULL
  AND v_game.writer_session_id=v_lease.id,
  'gameId',v_game.id,'revision',v_game.revision);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;

-- Strict negative gate: database role authenticated, but no JWT claims.
-- A failure is accepted ONLY with SQLSTATE 28000, not with generic ok:false.
-- SQL Editor runs with elevated permissions; this is not a genuine signed JWT test.
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims','{}',true);
SELECT set_config('request.jwt.claim.sub','',true);
DO $strict$
DECLARE v_state text; v_response jsonb; v_pass integer := 0;
BEGIN
  v_state := NULL;
  BEGIN
    v_response := public.mahjong_sync_open('11111111-1111-4111-8111-111111111111'::uuid,NULL::jsonb,NULL::bigint,NULL::uuid);
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_state = RETURNED_SQLSTATE;
  END;
  IF v_state IS DISTINCT FROM '28000' THEN RAISE EXCEPTION 'STRICT AUTH FAIL open: expected 28000, got %',coalesce(v_state,'NO ERROR'); END IF;
  v_pass := v_pass + 1;
  RAISE NOTICE 'STRICT AUTH PASS: open';
  v_state := NULL;
  BEGIN
    v_response := public.mahjong_sync_commit('11111111-1111-4111-8111-111111111111'::uuid,'22222222-2222-4222-8222-222222222222'::uuid,1,'invalid',0,'{}'::jsonb);
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_state = RETURNED_SQLSTATE;
  END;
  IF v_state IS DISTINCT FROM '28000' THEN RAISE EXCEPTION 'STRICT AUTH FAIL commit: expected 28000, got %',coalesce(v_state,'NO ERROR'); END IF;
  v_pass := v_pass + 1;
  RAISE NOTICE 'STRICT AUTH PASS: commit';
  v_state := NULL;
  BEGIN
    v_response := public.mahjong_sync_open_reader('11111111-1111-4111-8111-111111111111'::uuid);
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_state = RETURNED_SQLSTATE;
  END;
  IF v_state IS DISTINCT FROM '28000' THEN RAISE EXCEPTION 'STRICT AUTH FAIL open_reader: expected 28000, got %',coalesce(v_state,'NO ERROR'); END IF;
  v_pass := v_pass + 1;
  RAISE NOTICE 'STRICT AUTH PASS: open_reader';
  v_state := NULL;
  BEGIN
    v_response := public.mahjong_sync_read('11111111-1111-4111-8111-111111111111'::uuid);
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_state = RETURNED_SQLSTATE;
  END;
  IF v_state IS DISTINCT FROM '28000' THEN RAISE EXCEPTION 'STRICT AUTH FAIL read: expected 28000, got %',coalesce(v_state,'NO ERROR'); END IF;
  v_pass := v_pass + 1;
  RAISE NOTICE 'STRICT AUTH PASS: read';
  v_state := NULL;
  BEGIN
    v_response := public.mahjong_sync_lease_status('11111111-1111-4111-8111-111111111111'::uuid,1);
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_state = RETURNED_SQLSTATE;
  END;
  IF v_state IS DISTINCT FROM '28000' THEN RAISE EXCEPTION 'STRICT AUTH FAIL lease_status: expected 28000, got %',coalesce(v_state,'NO ERROR'); END IF;
  v_pass := v_pass + 1;
  RAISE NOTICE 'STRICT AUTH PASS: lease_status';
  IF v_pass <> 5 THEN RAISE EXCEPTION 'STRICT AUTH FAIL: %',v_pass; END IF;
  RAISE NOTICE 'STRICT AUTH 5/5 PASS';
END $strict$;
RESET ROLE;
ROLLBACK;

```

## supabase_sync_stage14_compile_rollback_ONLY.sql

```sql
-- ISOLATED COMPILATION DRILL ONLY. DO NOT USE AS INSTALLATION MIGRATION.
-- Run the ENTIRE script in one SQL Editor execution. Never execute fragments.
-- PostgreSQL transactional DDL rolls back all function/table modifications.
-- Does not test runtime RPC authentication, concurrency, or restore capability.
-- STAGE14 AUTOMATIC TRANSFER CANDIDATE — NOT FOR PRODUCTION.
-- Existing Supabase project only: requires isolated test accounts and two-device verification.
-- Depends on v15.7.14 foundation tables.
-- FAIL-CLOSED: token issuance and authentication not yet integrated.
-- This file is deliberately NOT executable in production.
-- REVIEW: existing auth.sessions created_at ordering alone is insufficient to prove
-- the new session owns the writer lease; auth session ID must match on every commit.
-- Original production installation guard intentionally removed ONLY in this rollback-only compilation drill.
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
-- Preserve historical writer binding independently of read-only enrollments.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false;
-- Match the guarded alignment candidate: never auto-promote legacy games.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
-- ADD COLUMN IF NOT EXISTS does not alter an existing DEFAULT true.
-- Explicitly align future implicit inserts; do not rewrite existing game rows.
ALTER TABLE public.mahjong_game_states ALTER COLUMN is_current SET DEFAULT false;
-- Existing verified index: mahjong_one_current_game_per_owner (owner_id WHERE is_current = true).
-- Do not create an equivalent second index here: fail closed until the
-- foundation migration is independently verified in the target environment.

-- Server-side schema validation mirrors the essential four-player client invariants.
-- Do not trust a browser-side validator as a security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN false
  WHEN jsonb_array_length(p_game->'history')>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(trim(leading '-' from x::text))>12) THEN false
  WHEN p_game ? 'roundWind' AND (jsonb_typeof(p_game->'roundWind') IS DISTINCT FROM 'number'
    OR (p_game->>'roundWind') !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (jsonb_typeof(p_game->'seatWinds') IS DISTINCT FROM 'array'
    OR (CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN jsonb_array_length(p_game->'seatWinds') ELSE NULL END)<>4) THEN false
  WHEN p_game ? 'seatWinds' AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number' OR x::text !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (SELECT count(DISTINCT x) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x)<>4 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'object') THEN false
  -- Keep server-side history checks aligned with the client recovery ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE (x ? 'delta' AND (jsonb_typeof(x->'delta') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN jsonb_array_length(x->'delta') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'quads' AND (jsonb_typeof(x->'quads') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN jsonb_array_length(x->'quads') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN x->'quads' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-4]$')))
    OR (x ? 'winner' AND x->'winner'<>'null'::jsonb AND (jsonb_typeof(x->'winner') IS DISTINCT FROM 'number' OR x->>'winner' !~ '^[0-3]$'))
    OR (x ? 'dealer' AND x->'dealer'<>'null'::jsonb AND (jsonb_typeof(x->'dealer') IS DISTINCT FROM 'number' OR x->>'dealer' !~ '^[0-3]$'))
    OR (x ? 'discarder' AND x->'discarder'<>'null'::jsonb AND (jsonb_typeof(x->'discarder') IS DISTINCT FROM 'number' OR x->>'discarder' !~ '^[0-3]$'))
    OR (x ? 'roundWind' AND (jsonb_typeof(x->'roundWind') IS DISTINCT FROM 'number' OR x->>'roundWind' !~ '^[0-3]$'))
    OR (x ? 'method' AND jsonb_typeof(x->'method') IS DISTINCT FROM 'string')
    OR (x ? 'playerPatterns' AND (jsonb_typeof(x->'playerPatterns') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN jsonb_array_length(x->'playerPatterns') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN x->'playerPatterns' ELSE '[]'::jsonb END) p WHERE p <> 'null'::jsonb AND
       (jsonb_typeof(p) IS DISTINCT FROM 'object' OR jsonb_typeof(p->'name') IS DISTINCT FROM 'string'
        OR length(p->>'name')>100 OR jsonb_typeof(p->'points') IS DISTINCT FROM 'number'
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM p->>'points'))>12))))
    OR (x ? 'patterns' AND (jsonb_typeof(x->'patterns') IS DISTINCT FROM 'array'
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'patterns') = 'array' THEN x->'patterns' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string')))
    OR (x ? 'seatWindsBefore' AND (jsonb_typeof(x->'seatWindsBefore') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN jsonb_array_length(x->'seatWindsBefore') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-3]$')
      OR (SELECT count(DISTINCT n) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n)<>4))
    OR (x ? 'namesAtTime' AND (jsonb_typeof(x->'namesAtTime') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN jsonb_array_length(x->'namesAtTime') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN x->'namesAtTime' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string' OR length(n #>> '{}')>100)))
  ) THEN false

  ELSE true END;
$$;
REVOKE ALL ON FUNCTION public.mahjong_sync_valid_game(jsonb) FROM PUBLIC,anon,authenticated;

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid; v_auth_created_at timestamptz;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT created_at INTO v_auth_created_at FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid;
  IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  IF v_token IS NULL OR v_token !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Token generator contract invalid' USING ERRCODE='22023';
  END IF;
  -- NULL means this device has no local game to upload. It may adopt an existing
  -- cloud game, but must never create an empty cloud game implicitly.
  IF p_local_game IS NOT NULL AND NOT public.mahjong_sync_valid_game(p_local_game)
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  -- Persistent high-water mark: a displaced older Auth session must not
  -- reclaim the writer lease even after the newer Auth session expires or
  -- its auth.sessions row is deleted. Keep historical device rows for this guard.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501';
  END IF;
  -- Do not downgrade the persistent login high-water mark when an admin or
  -- multi-device scorekeeper reuses a device ID from an older Auth session.
  -- This also matters if multi-device permission is disabled later.
  IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
      AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','newer-login');
  END IF;
  -- A caller that supplied a preflight identity must match it regardless
  -- of whether it is adopting cloud data or already holds a local copy.
  -- Otherwise a stale client can take over a different current game.
  IF p_expected_revision IS NOT NULL AND p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Expected revision must not be negative';
  END IF;
  IF (p_expected_revision IS NULL) IS DISTINCT FROM (p_expected_game_id IS NULL) THEN
    RAISE EXCEPTION 'Both expected game ID and revision are required together';
  END IF;
  -- STAGE14 CANDIDATE: an authenticated newer session may take over a
  -- different device after matching cloud game identity/revision below.
  -- The older session is revoked only after all preflight checks pass.
  -- Safety preflight: never revoke an existing writer before checking whether
  -- this device has a different game. The client must reconcile explicitly.
  -- A rejected takeover must leave the current writer fully operational.
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  -- Existing cloud state always requires a matching preflight, even when
  -- the caller submits an identical local snapshot. Otherwise a stale client
  -- could rotate the writer lease without first observing the current revision.
  IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  IF FOUND AND p_expected_game_id IS NOT NULL AND
     (v_game.id IS DISTINCT FROM p_expected_game_id OR
      v_game.revision IS DISTINCT FROM p_expected_revision) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- Compare local payload only after validating the cloud identity/revision.
  -- A stale preflight must not receive the full current game snapshot via
  -- the mismatch response; it must refresh and reconcile explicitly.
  IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN
    RETURN jsonb_build_object('ok',false,'reason','local-cloud-mismatch',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A takeover that adopts cloud state must be based on a prior read of its
  -- exact revision. This prevents a concurrent commit between peek and open
  -- from silently changing the state accepted by the new device.
  IF FOUND AND p_local_game IS NULL AND
     (p_expected_revision IS NULL OR p_expected_revision IS DISTINCT FROM v_game.revision
      OR p_expected_game_id IS NULL OR p_expected_game_id IS DISTINCT FROM v_game.id) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A prior peek that saw a cloud game must never fall back to creating a
  -- new game if the original game disappeared or was replaced in the interim.
  -- This is a preflight failure, not permission to bootstrap new cloud state.
  IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed');
  END IF;
  IF NOT FOUND AND p_local_game IS NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','no-cloud-game');
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      -- Revoke the credential itself, not just the writer flag. A displaced
      -- device must never retain a reusable token hash in the database.
      session_token_hash=NULL,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,ever_writer)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,v_auth_created_at,encode(extensions.digest(v_token,'sha256'),'hex'),true)
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,ever_writer=true,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id,is_current)
    VALUES(v_uid,p_local_game,0,v_session.id,true) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF NOT public.mahjong_sync_valid_game(p_game)
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 -- Persistent login high-water guard also protects writes when the newer
 -- Auth session has expired or disappeared. A stale writer token alone is
 -- insufficient to prove that an older login still owns the account.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
   JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.auth_session_created_at IS NOT NULL
     AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 -- STAGE14: no historical device binding at commit; enforce current
 -- Auth session, writer lease, generation and token below instead.
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   -- A revoked or displaced device is no longer authorized to submit game
   -- payloads. Do not persist its proposed snapshot in the conflict ledger:
   -- that would permit repeated rejected writes to fill server storage.
   -- Only an authenticated CURRENT writer may record a revision conflict.
   IF v_reason='revision-conflict' THEN
     INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
       VALUES(v_game.id,v_uid,p_device_id,p_base_revision,p_game,v_reason);
   END IF;
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

-- Explicit reader enrollment. A read-only device must never call mahjong_sync_open,
-- because that operation transfers the sole writer lease.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_auth_created_at timestamptz;
 v_game public.mahjong_game_states%ROWTYPE;
 v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT created_at INTO v_auth_created_at FROM auth.sessions
  WHERE id=v_auth_session AND user_id=v_uid;
 IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
 -- Serialize with writer takeovers and commits for this account.
 SELECT raw_app_meta_data->>'role',
  COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false),
  banned_until,deleted_at INTO v_role,v_multi,v_banned,v_deleted
 FROM auth.users WHERE id=v_uid FOR UPDATE;
 IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL
  OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role<>'admin' AND NOT v_multi THEN
  RAISE EXCEPTION 'Multi-device reading not permitted' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 -- Never replace a newer recorded Auth session with an older one on a
 -- reused device ID. That would erase the persistent takeover high-water
 -- mark if multi-device access is subsequently disabled.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
  WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','newer-login');
 END IF;
 -- Never downgrade a current writer on this device. Require a separate
 -- device ID for a read-only enrollment, rather than clobber its token.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active AND is_writer
   AND revoked_at IS NULL) THEN
  RETURN jsonb_build_object('ok',false,'reason','device-already-writer');
 END IF;
 INSERT INTO public.mahjong_device_sessions
  (user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,revoked_at)
 VALUES(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL)
 ON CONFLICT(user_id,device_id) DO UPDATE SET
  is_active=true,is_writer=false,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,
  session_generation=public.mahjong_device_sessions.session_generation+1,
  session_token_hash=NULL,revoked_at=NULL,last_seen_at=now(),updated_at=now()
 RETURNING * INTO v_lease;
 INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
 VALUES(v_uid,v_uid,p_device_id,'reader-open',jsonb_build_object('game_id',v_game.id));
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',false,'generation',v_lease.session_generation);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open_reader(uuid) TO authenticated;

-- Read-only preflight: verify the exact Supabase Auth session and account status.
-- This does not create a device session, rotate a token, or modify game state.
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
    AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
 INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid;
 IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL
    OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM auth.sessions newer JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- A displaced old login must not resume metadata reads after the newer
 -- Auth session expires. The historical writer lease is the high-water mark.
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM public.mahjong_device_sessions prior
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision);
END; $$;
-- Read-only refresh for an already opened device session. Unlike peek, this
-- requires a registered, active lease for this exact Supabase Auth session.
-- It never grants writer privileges or rotates writer credentials.
CREATE OR REPLACE FUNCTION public.mahjong_sync_read(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid;
 v_game public.mahjong_game_states%ROWTYPE; v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- A newer login invalidates an older scorekeeper session unless explicitly
 -- allowed by administrator, even if its old lease has not yet been revoked.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active=true
   AND revoked_at IS NULL AND auth_session_id=v_auth_session;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 -- A reader lease is not a permanent entitlement. If the administrator
 -- disables multi-device access, reject previously enrolled reader sessions
 -- immediately instead of allowing continued cloud reads.
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
      AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',v_lease.is_writer
   AND v_lease.session_token_hash IS NOT NULL
   AND v_lease.session_generation>0
   AND v_game.writer_session_id=v_lease.id);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_read(uuid) TO authenticated;

-- Lightweight lease probe for foreground/periodic client checks. A stale device
-- must learn that its writer lease was revoked without waiting for a score edit.
-- This is advisory UI state; commit() remains the server-side security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_lease_status(p_device_id uuid,p_generation bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_auth_session uuid; v_lease public.mahjong_device_sessions%ROWTYPE;
 v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_generation<1 THEN
  RAISE EXCEPTION 'Authentication and valid lease identity required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
  RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND auth_session_id=v_auth_session
   AND session_generation=p_generation AND is_active=true AND revoked_at IS NULL;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked'); END IF;
 RETURN jsonb_build_object('ok',true,'canWrite',v_lease.is_writer
  AND v_lease.session_token_hash IS NOT NULL
  AND v_game.writer_session_id=v_lease.id,
  'gameId',v_game.id,'revision',v_game.revision);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;
ROLLBACK;

```

## supabase_sync_stage14_defaults_preflight_readonly.sql

```sql
-- Stage 14 read-only evidence: export rows as JSON for tools/stage14-review-defaults.cjs.
-- Do not apply candidate DDL or change production settings.
SELECT required.table_name, required.column_name,
       (cols.column_name IS NOT NULL) AS installed,
       cols.is_nullable, cols.column_default
FROM (VALUES
 ('mahjong_game_states','is_current'),
 ('mahjong_device_sessions','ever_writer')
) AS required(table_name,column_name)
LEFT JOIN information_schema.columns AS cols
 ON cols.table_schema='public'
 AND cols.table_name=required.table_name AND cols.column_name=required.column_name
ORDER BY required.table_name,required.column_name;

```

## supabase_sync_stage14_five_rpc_RUNTIME_DIAGNOSTIC_ROLLBACK_ONLY.sql

```sql
-- ROLLBACK-ONLY RPC INTEGRATION TEST: NEVER DEPLOY.
-- All CREATE/ALTER/GRANT statements are transaction-scoped and rolled back.
-- Existing Supabase project only: requires isolated test accounts and two-device verification.
-- Depends on v15.7.14 foundation tables.
-- FAIL-CLOSED: token issuance and authentication not yet integrated.
-- This file is deliberately NOT executable in production.
-- REVIEW: existing auth.sessions created_at ordering alone is insufficient to prove
-- the new session owns the writer lease; auth session ID must match on every commit.
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
-- Preserve historical writer binding independently of read-only enrollments.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false;
-- Match the guarded alignment candidate: never auto-promote legacy games.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
-- ADD COLUMN IF NOT EXISTS does not alter an existing DEFAULT true.
-- Explicitly align future implicit inserts; do not rewrite existing game rows.
ALTER TABLE public.mahjong_game_states ALTER COLUMN is_current SET DEFAULT false;
-- Existing verified index: mahjong_one_current_game_per_owner (owner_id WHERE is_current = true).
-- Do not create an equivalent second index here: fail closed until the
-- foundation migration is independently verified in the target environment.

-- Server-side schema validation mirrors the essential four-player client invariants.
-- Do not trust a browser-side validator as a security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN false
  WHEN jsonb_array_length(p_game->'history')>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(trim(leading '-' from x::text))>12) THEN false
  WHEN p_game ? 'roundWind' AND (jsonb_typeof(p_game->'roundWind') IS DISTINCT FROM 'number'
    OR (p_game->>'roundWind') !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (jsonb_typeof(p_game->'seatWinds') IS DISTINCT FROM 'array'
    OR (CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN jsonb_array_length(p_game->'seatWinds') ELSE NULL END)<>4) THEN false
  WHEN p_game ? 'seatWinds' AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number' OR x::text !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (SELECT count(DISTINCT x) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x)<>4 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'object') THEN false
  -- Keep server-side history checks aligned with the client recovery ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE (x ? 'delta' AND (jsonb_typeof(x->'delta') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN jsonb_array_length(x->'delta') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'quads' AND (jsonb_typeof(x->'quads') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN jsonb_array_length(x->'quads') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN x->'quads' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-4]$')))
    OR (x ? 'winner' AND x->'winner'<>'null'::jsonb AND (jsonb_typeof(x->'winner') IS DISTINCT FROM 'number' OR x->>'winner' !~ '^[0-3]$'))
    OR (x ? 'dealer' AND x->'dealer'<>'null'::jsonb AND (jsonb_typeof(x->'dealer') IS DISTINCT FROM 'number' OR x->>'dealer' !~ '^[0-3]$'))
    OR (x ? 'discarder' AND x->'discarder'<>'null'::jsonb AND (jsonb_typeof(x->'discarder') IS DISTINCT FROM 'number' OR x->>'discarder' !~ '^[0-3]$'))
    OR (x ? 'roundWind' AND (jsonb_typeof(x->'roundWind') IS DISTINCT FROM 'number' OR x->>'roundWind' !~ '^[0-3]$'))
    OR (x ? 'method' AND jsonb_typeof(x->'method') IS DISTINCT FROM 'string')
    OR (x ? 'playerPatterns' AND (jsonb_typeof(x->'playerPatterns') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN jsonb_array_length(x->'playerPatterns') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN x->'playerPatterns' ELSE '[]'::jsonb END) p WHERE p <> 'null'::jsonb AND
       (jsonb_typeof(p) IS DISTINCT FROM 'object' OR jsonb_typeof(p->'name') IS DISTINCT FROM 'string'
        OR length(p->>'name')>100 OR jsonb_typeof(p->'points') IS DISTINCT FROM 'number'
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM p->>'points'))>12))))
    OR (x ? 'patterns' AND (jsonb_typeof(x->'patterns') IS DISTINCT FROM 'array'
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'patterns') = 'array' THEN x->'patterns' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string')))
    OR (x ? 'seatWindsBefore' AND (jsonb_typeof(x->'seatWindsBefore') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN jsonb_array_length(x->'seatWindsBefore') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-3]$')
      OR (SELECT count(DISTINCT n) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n)<>4))
    OR (x ? 'namesAtTime' AND (jsonb_typeof(x->'namesAtTime') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN jsonb_array_length(x->'namesAtTime') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN x->'namesAtTime' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string' OR length(n #>> '{}')>100)))
  ) THEN false

  ELSE true END;
$$;
REVOKE ALL ON FUNCTION public.mahjong_sync_valid_game(jsonb) FROM PUBLIC,anon,authenticated;

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid; v_auth_created_at timestamptz;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT created_at INTO v_auth_created_at FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid;
  IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  IF v_token IS NULL OR v_token !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Token generator contract invalid' USING ERRCODE='22023';
  END IF;
  -- NULL means this device has no local game to upload. It may adopt an existing
  -- cloud game, but must never create an empty cloud game implicitly.
  IF p_local_game IS NOT NULL AND NOT public.mahjong_sync_valid_game(p_local_game)
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Revalidate the caller's Auth session AFTER acquiring the account lock.
  -- A pre-lock lookup alone cannot establish that the session remains eligible.
  IF NOT EXISTS (
    SELECT 1 FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid
      AND created_at=v_auth_created_at
      AND (not_after IS NULL OR not_after>clock_timestamp())
  ) THEN
    RAISE EXCEPTION 'Auth session expired or removed during takeover' USING ERRCODE='28000';
  END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  -- Persistent high-water mark: a displaced older Auth session must not
  -- reclaim the writer lease even after the newer Auth session expires or
  -- its auth.sessions row is deleted. Keep historical device rows for this guard.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501';
  END IF;
  -- Do not downgrade the persistent login high-water mark when an admin or
  -- multi-device scorekeeper reuses a device ID from an older Auth session.
  -- This also matters if multi-device permission is disabled later.
  IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
      AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','newer-login');
  END IF;
  -- A caller that supplied a preflight identity must match it regardless
  -- of whether it is adopting cloud data or already holds a local copy.
  -- Otherwise a stale client can take over a different current game.
  IF p_expected_revision IS NOT NULL AND p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Expected revision must not be negative';
  END IF;
  IF (p_expected_revision IS NULL) IS DISTINCT FROM (p_expected_game_id IS NULL) THEN
    RAISE EXCEPTION 'Both expected game ID and revision are required together';
  END IF;
  -- STAGE14 CANDIDATE: an authenticated newer session may take over a
  -- different device after matching cloud game identity/revision below.
  -- The older session is revoked only after all preflight checks pass.
  -- Safety preflight: never revoke an existing writer before checking whether
  -- this device has a different game. The client must reconcile explicitly.
  -- A rejected takeover must leave the current writer fully operational.
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  -- Existing cloud state always requires a matching preflight, even when
  -- the caller submits an identical local snapshot. Otherwise a stale client
  -- could rotate the writer lease without first observing the current revision.
  IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  IF FOUND AND p_expected_game_id IS NOT NULL AND
     (v_game.id IS DISTINCT FROM p_expected_game_id OR
      v_game.revision IS DISTINCT FROM p_expected_revision) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- Compare local payload only after validating the cloud identity/revision.
  -- A stale preflight must not receive the full current game snapshot via
  -- the mismatch response; it must refresh and reconcile explicitly.
  IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN
    RETURN jsonb_build_object('ok',false,'reason','local-cloud-mismatch',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A takeover that adopts cloud state must be based on a prior read of its
  -- exact revision. This prevents a concurrent commit between peek and open
  -- from silently changing the state accepted by the new device.
  IF FOUND AND p_local_game IS NULL AND
     (p_expected_revision IS NULL OR p_expected_revision IS DISTINCT FROM v_game.revision
      OR p_expected_game_id IS NULL OR p_expected_game_id IS DISTINCT FROM v_game.id) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A prior peek that saw a cloud game must never fall back to creating a
  -- new game if the original game disappeared or was replaced in the interim.
  -- This is a preflight failure, not permission to bootstrap new cloud state.
  IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed');
  END IF;
  IF NOT FOUND AND p_local_game IS NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','no-cloud-game');
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      -- Revoke the credential itself, not just the writer flag. A displaced
      -- device must never retain a reusable token hash in the database.
      session_token_hash=NULL,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,ever_writer)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,v_auth_created_at,encode(extensions.digest(v_token,'sha256'),'hex'),true)
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,ever_writer=true,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id,is_current)
    VALUES(v_uid,p_local_game,0,v_session.id,true) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF NOT public.mahjong_sync_valid_game(p_game)
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Recheck Auth session under the same account lock used by takeover.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at IS NOT NULL
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during commit' USING ERRCODE='28000'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 -- Persistent login high-water guard also protects writes when the newer
 -- Auth session has expired or disappeared. A stale writer token alone is
 -- insufficient to prove that an older login still owns the account.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
   JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.auth_session_created_at IS NOT NULL
     AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 -- STAGE14: no historical device binding at commit; enforce current
 -- Auth session, writer lease, generation and token below instead.
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   -- A revoked or displaced device is no longer authorized to submit game
   -- payloads. Do not persist its proposed snapshot in the conflict ledger:
   -- that would permit repeated rejected writes to fill server storage.
   -- Only an authenticated CURRENT writer may record a revision conflict.
   IF v_reason='revision-conflict' THEN
     INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
       VALUES(v_game.id,v_uid,p_device_id,p_base_revision,p_game,v_reason);
   END IF;
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

-- Explicit reader enrollment. A read-only device must never call mahjong_sync_open,
-- because that operation transfers the sole writer lease.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_auth_created_at timestamptz;
 v_game public.mahjong_game_states%ROWTYPE;
 v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT created_at INTO v_auth_created_at FROM auth.sessions
  WHERE id=v_auth_session AND user_id=v_uid;
 IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
 -- Serialize with writer takeovers and commits for this account.
 SELECT raw_app_meta_data->>'role',
  COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false),
  banned_until,deleted_at INTO v_role,v_multi,v_banned,v_deleted
 FROM auth.users WHERE id=v_uid FOR UPDATE;
 IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL
  OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Reader enrollment also must not rely only on pre-lock Auth checks.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at=v_auth_created_at
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during reader open' USING ERRCODE='28000'; END IF;
 IF v_role<>'admin' AND NOT v_multi THEN
  RAISE EXCEPTION 'Multi-device reading not permitted' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 -- Never replace a newer recorded Auth session with an older one on a
 -- reused device ID. That would erase the persistent takeover high-water
 -- mark if multi-device access is subsequently disabled.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
  WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','newer-login');
 END IF;
 -- Never downgrade a current writer on this device. Require a separate
 -- device ID for a read-only enrollment, rather than clobber its token.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active AND is_writer
   AND revoked_at IS NULL) THEN
  RETURN jsonb_build_object('ok',false,'reason','device-already-writer');
 END IF;
 INSERT INTO public.mahjong_device_sessions
  (user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,revoked_at)
 VALUES(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL)
 ON CONFLICT(user_id,device_id) DO UPDATE SET
  is_active=true,is_writer=false,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,
  session_generation=public.mahjong_device_sessions.session_generation+1,
  session_token_hash=NULL,revoked_at=NULL,last_seen_at=now(),updated_at=now()
 RETURNING * INTO v_lease;
 INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
 VALUES(v_uid,v_uid,p_device_id,'reader-open',jsonb_build_object('game_id',v_game.id));
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',false,'generation',v_lease.session_generation);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open_reader(uuid) TO authenticated;

-- Read-only preflight: verify the exact Supabase Auth session and account status.
-- This does not create a device session, rotate a token, or modify game state.
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
    AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
 INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid;
 IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL
    OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM auth.sessions newer JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- A displaced old login must not resume metadata reads after the newer
 -- Auth session expires. The historical writer lease is the high-water mark.
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM public.mahjong_device_sessions prior
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision);
END; $$;
-- Read-only refresh for an already opened device session. Unlike peek, this
-- requires a registered, active lease for this exact Supabase Auth session.
-- It never grants writer privileges or rotates writer credentials.
CREATE OR REPLACE FUNCTION public.mahjong_sync_read(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid;
 v_game public.mahjong_game_states%ROWTYPE; v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- A newer login invalidates an older scorekeeper session unless explicitly
 -- allowed by administrator, even if its old lease has not yet been revoked.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active=true
   AND revoked_at IS NULL AND auth_session_id=v_auth_session;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 -- A reader lease is not a permanent entitlement. If the administrator
 -- disables multi-device access, reject previously enrolled reader sessions
 -- immediately instead of allowing continued cloud reads.
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
      AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',v_lease.is_writer
   AND v_lease.session_token_hash IS NOT NULL
   AND v_lease.session_generation>0
   AND v_game.writer_session_id=v_lease.id);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_read(uuid) TO authenticated;

-- Lightweight lease probe for foreground/periodic client checks. A stale device
-- must learn that its writer lease was revoked without waiting for a score edit.
-- This is advisory UI state; commit() remains the server-side security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_lease_status(p_device_id uuid,p_generation bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_auth_session uuid; v_lease public.mahjong_device_sessions%ROWTYPE;
 v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_generation<1 THEN
  RAISE EXCEPTION 'Authentication and valid lease identity required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
  RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND auth_session_id=v_auth_session
   AND session_generation=p_generation AND is_active=true AND revoked_at IS NULL;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked'); END IF;
 RETURN jsonb_build_object('ok',true,'canWrite',v_lease.is_writer
  AND v_lease.session_token_hash IS NOT NULL
  AND v_game.writer_session_id=v_lease.id,
  'gameId',v_game.id,'revision',v_game.revision);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;

-- ROLLBACK-ONLY TEST ASSERTIONS (no persistent schema/data changes)
DO $gate$
DECLARE v_count integer; v_exposed integer;
BEGIN
 SELECT count(*) INTO v_count FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND p.prosecdef AND EXISTS (SELECT 1 FROM unnest(COALESCE(p.proconfig, ARRAY[]::text[])) AS cfg(value) WHERE cfg.value IN ('search_path=', 'search_path=""'));
 IF v_count <> 5 THEN RAISE EXCEPTION 'RPC SECURITY GATE FAIL: expected 5 secure definer functions, found %',v_count; END IF;
 SELECT count(*) INTO v_exposed FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND (has_function_privilege('anon',p.oid,'EXECUTE') OR NOT has_function_privilege('authenticated',p.oid,'EXECUTE'));
 IF v_exposed <> 0 THEN RAISE EXCEPTION 'RPC GRANTS GATE FAIL: % functions exposed or missing auth grant',v_exposed; END IF;
 RAISE NOTICE 'PASS: five RPCs compiled, SECURITY DEFINER/search_path hardened, authenticated-only EXECUTE; ROLLBACK pending';
END $gate$;


-- RUNTIME NEGATIVE GATE: zero writes to existing game data; all DDL rolls back.
CREATE TEMP TABLE mahjong_rpc_runtime_gate (
  scenario text NOT NULL, rpc text NOT NULL, expected text NOT NULL,
  observed text NOT NULL, status text NOT NULL
) ON COMMIT DROP;
DO $runtime$
DECLARE
 v_uid uuid; v_old uuid; v_new uuid; v_count integer;
 v_rpc text; v_sql text; v_state text; v_result jsonb;
BEGIN
 SELECT count(*), (array_agg(id))[1] INTO v_count,v_uid FROM auth.users
 WHERE raw_app_meta_data->>'role'='scorekeeper' AND deleted_at IS NULL
 AND (lower(raw_user_meta_data->>'username')='wiroseta'
   OR lower(raw_app_meta_data->>'username')='wiroseta'
   OR lower(split_part(email,'@',1))='wiroseta');
 IF v_count<>1 THEN RAISE EXCEPTION 'Test account must resolve uniquely (found %)',v_count; END IF;
 IF EXISTS(SELECT 1 FROM auth.users WHERE id=v_uid AND
    (banned_until>now() OR COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 THEN RAISE EXCEPTION 'Test account must be active and single-device'; END IF;
 SELECT count(*) INTO v_count FROM auth.sessions WHERE user_id=v_uid
 AND (not_after IS NULL OR not_after>now());
 IF v_count<>2 THEN RAISE EXCEPTION 'Expected exactly two live sessions, found %',v_count; END IF;
 SELECT id INTO v_old FROM auth.sessions WHERE user_id=v_uid
 AND (not_after IS NULL OR not_after>now()) ORDER BY created_at,id LIMIT 1;
 SELECT id INTO v_new FROM auth.sessions WHERE user_id=v_uid
 AND (not_after IS NULL OR not_after>now()) ORDER BY created_at DESC,id DESC LIMIT 1;
 IF v_old=v_new THEN RAISE EXCEPTION 'Distinct sessions required'; END IF;
 FOREACH v_rpc IN ARRAY ARRAY['open','commit','open_reader','read','lease_status'] LOOP
   v_sql:=CASE v_rpc
    WHEN 'open' THEN 'SELECT public.mahjong_sync_open(''00000000-0000-0000-0000-000000000001''::uuid,''{}''::jsonb,NULL,NULL)'
    WHEN 'commit' THEN 'SELECT public.mahjong_sync_commit(''00000000-0000-0000-0000-000000000002''::uuid,''00000000-0000-0000-0000-000000000001''::uuid,1,''invalid'',0,''{}''::jsonb)'
    WHEN 'open_reader' THEN 'SELECT public.mahjong_sync_open_reader(''00000000-0000-0000-0000-000000000001''::uuid)'
    WHEN 'read' THEN 'SELECT public.mahjong_sync_read(''00000000-0000-0000-0000-000000000001''::uuid)'
    ELSE 'SELECT public.mahjong_sync_lease_status(''00000000-0000-0000-0000-000000000001''::uuid,1)' END;
   PERFORM set_config('request.jwt.claims','{}',true);
   PERFORM set_config('request.jwt.claim.sub','',true);
   v_state:=NULL;
   BEGIN EXECUTE v_sql INTO v_result;
   EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS v_state=RETURNED_SQLSTATE; END;
   INSERT INTO mahjong_rpc_runtime_gate VALUES('NO JWT',v_rpc,'28000',COALESCE(v_state,'NO ERROR'),
     CASE WHEN v_state='28000' THEN 'PASS' ELSE 'FAIL' END);
   PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',v_uid,'role','authenticated','session_id',v_old)::text,true);
   PERFORM set_config('request.jwt.claim.sub',v_uid::text,true);
   v_state:=NULL; v_result:=NULL;
   BEGIN EXECUTE v_sql INTO v_result;
   EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS v_state=RETURNED_SQLSTATE; END;
   INSERT INTO mahjong_rpc_runtime_gate VALUES('OLDER JWT CLAIM',v_rpc,'42501',COALESCE(v_state,COALESCE(v_result::text,'NULL')),
     CASE WHEN v_state='42501' THEN 'PASS' ELSE 'FAIL' END);
 END LOOP;
 -- The latest session may read peek metadata; it must not write anything here.
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',v_uid,'role','authenticated','session_id',v_new)::text,true);
 PERFORM set_config('request.jwt.claim.sub',v_uid::text,true);
 v_state:=NULL; v_result:=NULL;
 BEGIN SELECT public.mahjong_sync_peek() INTO v_result;
 EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS v_state=RETURNED_SQLSTATE; END;
 INSERT INTO mahjong_rpc_runtime_gate VALUES('LATEST JWT CLAIM','peek','NO ERROR',COALESCE(v_state,'NO ERROR'),
  CASE WHEN v_state IS NULL THEN 'PASS' ELSE 'FAIL' END);
 RAISE NOTICE 'DIAGNOSTIC ONLY: scenario results follow; all DDL will ROLLBACK';
END $runtime$;
SELECT scenario,rpc,expected,observed,status FROM mahjong_rpc_runtime_gate
ORDER BY CASE scenario WHEN 'NO JWT' THEN 1 WHEN 'OLDER JWT CLAIM' THEN 2 ELSE 3 END,rpc;
-- Never leave claims or DDL behind.

ROLLBACK;

```

## supabase_sync_stage14_five_rpc_RUNTIME_DIAGNOSTIC_VALID_INPUT_ROLLBACK_ONLY.sql

```sql
-- ROLLBACK-ONLY RPC INTEGRATION TEST: NEVER DEPLOY.
-- All CREATE/ALTER/GRANT statements are transaction-scoped and rolled back.
-- Existing Supabase project only: requires isolated test accounts and two-device verification.
-- Depends on v15.7.14 foundation tables.
-- FAIL-CLOSED: token issuance and authentication not yet integrated.
-- This file is deliberately NOT executable in production.
-- REVIEW: existing auth.sessions created_at ordering alone is insufficient to prove
-- the new session owns the writer lease; auth session ID must match on every commit.
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
-- Preserve historical writer binding independently of read-only enrollments.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false;
-- Match the guarded alignment candidate: never auto-promote legacy games.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
-- ADD COLUMN IF NOT EXISTS does not alter an existing DEFAULT true.
-- Explicitly align future implicit inserts; do not rewrite existing game rows.
ALTER TABLE public.mahjong_game_states ALTER COLUMN is_current SET DEFAULT false;
-- Existing verified index: mahjong_one_current_game_per_owner (owner_id WHERE is_current = true).
-- Do not create an equivalent second index here: fail closed until the
-- foundation migration is independently verified in the target environment.

-- Server-side schema validation mirrors the essential four-player client invariants.
-- Do not trust a browser-side validator as a security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN false
  WHEN jsonb_array_length(p_game->'history')>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(trim(leading '-' from x::text))>12) THEN false
  WHEN p_game ? 'roundWind' AND (jsonb_typeof(p_game->'roundWind') IS DISTINCT FROM 'number'
    OR (p_game->>'roundWind') !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (jsonb_typeof(p_game->'seatWinds') IS DISTINCT FROM 'array'
    OR (CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN jsonb_array_length(p_game->'seatWinds') ELSE NULL END)<>4) THEN false
  WHEN p_game ? 'seatWinds' AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number' OR x::text !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (SELECT count(DISTINCT x) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x)<>4 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'object') THEN false
  -- Keep server-side history checks aligned with the client recovery ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE (x ? 'delta' AND (jsonb_typeof(x->'delta') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN jsonb_array_length(x->'delta') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'quads' AND (jsonb_typeof(x->'quads') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN jsonb_array_length(x->'quads') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN x->'quads' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-4]$')))
    OR (x ? 'winner' AND x->'winner'<>'null'::jsonb AND (jsonb_typeof(x->'winner') IS DISTINCT FROM 'number' OR x->>'winner' !~ '^[0-3]$'))
    OR (x ? 'dealer' AND x->'dealer'<>'null'::jsonb AND (jsonb_typeof(x->'dealer') IS DISTINCT FROM 'number' OR x->>'dealer' !~ '^[0-3]$'))
    OR (x ? 'discarder' AND x->'discarder'<>'null'::jsonb AND (jsonb_typeof(x->'discarder') IS DISTINCT FROM 'number' OR x->>'discarder' !~ '^[0-3]$'))
    OR (x ? 'roundWind' AND (jsonb_typeof(x->'roundWind') IS DISTINCT FROM 'number' OR x->>'roundWind' !~ '^[0-3]$'))
    OR (x ? 'method' AND jsonb_typeof(x->'method') IS DISTINCT FROM 'string')
    OR (x ? 'playerPatterns' AND (jsonb_typeof(x->'playerPatterns') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN jsonb_array_length(x->'playerPatterns') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN x->'playerPatterns' ELSE '[]'::jsonb END) p WHERE p <> 'null'::jsonb AND
       (jsonb_typeof(p) IS DISTINCT FROM 'object' OR jsonb_typeof(p->'name') IS DISTINCT FROM 'string'
        OR length(p->>'name')>100 OR jsonb_typeof(p->'points') IS DISTINCT FROM 'number'
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM p->>'points'))>12))))
    OR (x ? 'patterns' AND (jsonb_typeof(x->'patterns') IS DISTINCT FROM 'array'
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'patterns') = 'array' THEN x->'patterns' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string')))
    OR (x ? 'seatWindsBefore' AND (jsonb_typeof(x->'seatWindsBefore') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN jsonb_array_length(x->'seatWindsBefore') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-3]$')
      OR (SELECT count(DISTINCT n) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n)<>4))
    OR (x ? 'namesAtTime' AND (jsonb_typeof(x->'namesAtTime') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN jsonb_array_length(x->'namesAtTime') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN x->'namesAtTime' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string' OR length(n #>> '{}')>100)))
  ) THEN false

  ELSE true END;
$$;
REVOKE ALL ON FUNCTION public.mahjong_sync_valid_game(jsonb) FROM PUBLIC,anon,authenticated;

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid; v_auth_created_at timestamptz;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT created_at INTO v_auth_created_at FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid;
  IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  IF v_token IS NULL OR v_token !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Token generator contract invalid' USING ERRCODE='22023';
  END IF;
  -- NULL means this device has no local game to upload. It may adopt an existing
  -- cloud game, but must never create an empty cloud game implicitly.
  IF p_local_game IS NOT NULL AND NOT public.mahjong_sync_valid_game(p_local_game)
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Revalidate the caller's Auth session AFTER acquiring the account lock.
  -- A pre-lock lookup alone cannot establish that the session remains eligible.
  IF NOT EXISTS (
    SELECT 1 FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid
      AND created_at=v_auth_created_at
      AND (not_after IS NULL OR not_after>clock_timestamp())
  ) THEN
    RAISE EXCEPTION 'Auth session expired or removed during takeover' USING ERRCODE='28000';
  END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  -- Persistent high-water mark: a displaced older Auth session must not
  -- reclaim the writer lease even after the newer Auth session expires or
  -- its auth.sessions row is deleted. Keep historical device rows for this guard.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501';
  END IF;
  -- Do not downgrade the persistent login high-water mark when an admin or
  -- multi-device scorekeeper reuses a device ID from an older Auth session.
  -- This also matters if multi-device permission is disabled later.
  IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
      AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','newer-login');
  END IF;
  -- A caller that supplied a preflight identity must match it regardless
  -- of whether it is adopting cloud data or already holds a local copy.
  -- Otherwise a stale client can take over a different current game.
  IF p_expected_revision IS NOT NULL AND p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Expected revision must not be negative';
  END IF;
  IF (p_expected_revision IS NULL) IS DISTINCT FROM (p_expected_game_id IS NULL) THEN
    RAISE EXCEPTION 'Both expected game ID and revision are required together';
  END IF;
  -- STAGE14 CANDIDATE: an authenticated newer session may take over a
  -- different device after matching cloud game identity/revision below.
  -- The older session is revoked only after all preflight checks pass.
  -- Safety preflight: never revoke an existing writer before checking whether
  -- this device has a different game. The client must reconcile explicitly.
  -- A rejected takeover must leave the current writer fully operational.
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  -- Existing cloud state always requires a matching preflight, even when
  -- the caller submits an identical local snapshot. Otherwise a stale client
  -- could rotate the writer lease without first observing the current revision.
  IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  IF FOUND AND p_expected_game_id IS NOT NULL AND
     (v_game.id IS DISTINCT FROM p_expected_game_id OR
      v_game.revision IS DISTINCT FROM p_expected_revision) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- Compare local payload only after validating the cloud identity/revision.
  -- A stale preflight must not receive the full current game snapshot via
  -- the mismatch response; it must refresh and reconcile explicitly.
  IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN
    RETURN jsonb_build_object('ok',false,'reason','local-cloud-mismatch',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A takeover that adopts cloud state must be based on a prior read of its
  -- exact revision. This prevents a concurrent commit between peek and open
  -- from silently changing the state accepted by the new device.
  IF FOUND AND p_local_game IS NULL AND
     (p_expected_revision IS NULL OR p_expected_revision IS DISTINCT FROM v_game.revision
      OR p_expected_game_id IS NULL OR p_expected_game_id IS DISTINCT FROM v_game.id) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A prior peek that saw a cloud game must never fall back to creating a
  -- new game if the original game disappeared or was replaced in the interim.
  -- This is a preflight failure, not permission to bootstrap new cloud state.
  IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed');
  END IF;
  IF NOT FOUND AND p_local_game IS NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','no-cloud-game');
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      -- Revoke the credential itself, not just the writer flag. A displaced
      -- device must never retain a reusable token hash in the database.
      session_token_hash=NULL,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,ever_writer)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,v_auth_created_at,encode(extensions.digest(v_token,'sha256'),'hex'),true)
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,ever_writer=true,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id,is_current)
    VALUES(v_uid,p_local_game,0,v_session.id,true) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF NOT public.mahjong_sync_valid_game(p_game)
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Recheck Auth session under the same account lock used by takeover.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at IS NOT NULL
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during commit' USING ERRCODE='28000'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 -- Persistent login high-water guard also protects writes when the newer
 -- Auth session has expired or disappeared. A stale writer token alone is
 -- insufficient to prove that an older login still owns the account.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
   JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.auth_session_created_at IS NOT NULL
     AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 -- STAGE14: no historical device binding at commit; enforce current
 -- Auth session, writer lease, generation and token below instead.
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   -- A revoked or displaced device is no longer authorized to submit game
   -- payloads. Do not persist its proposed snapshot in the conflict ledger:
   -- that would permit repeated rejected writes to fill server storage.
   -- Only an authenticated CURRENT writer may record a revision conflict.
   IF v_reason='revision-conflict' THEN
     INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
       VALUES(v_game.id,v_uid,p_device_id,p_base_revision,p_game,v_reason);
   END IF;
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

-- Explicit reader enrollment. A read-only device must never call mahjong_sync_open,
-- because that operation transfers the sole writer lease.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_auth_created_at timestamptz;
 v_game public.mahjong_game_states%ROWTYPE;
 v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT created_at INTO v_auth_created_at FROM auth.sessions
  WHERE id=v_auth_session AND user_id=v_uid;
 IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
 -- Serialize with writer takeovers and commits for this account.
 SELECT raw_app_meta_data->>'role',
  COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false),
  banned_until,deleted_at INTO v_role,v_multi,v_banned,v_deleted
 FROM auth.users WHERE id=v_uid FOR UPDATE;
 IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL
  OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Reader enrollment also must not rely only on pre-lock Auth checks.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at=v_auth_created_at
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during reader open' USING ERRCODE='28000'; END IF;
 IF v_role<>'admin' AND NOT v_multi THEN
  RAISE EXCEPTION 'Multi-device reading not permitted' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 -- Never replace a newer recorded Auth session with an older one on a
 -- reused device ID. That would erase the persistent takeover high-water
 -- mark if multi-device access is subsequently disabled.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
  WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','newer-login');
 END IF;
 -- Never downgrade a current writer on this device. Require a separate
 -- device ID for a read-only enrollment, rather than clobber its token.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active AND is_writer
   AND revoked_at IS NULL) THEN
  RETURN jsonb_build_object('ok',false,'reason','device-already-writer');
 END IF;
 INSERT INTO public.mahjong_device_sessions
  (user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,revoked_at)
 VALUES(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL)
 ON CONFLICT(user_id,device_id) DO UPDATE SET
  is_active=true,is_writer=false,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,
  session_generation=public.mahjong_device_sessions.session_generation+1,
  session_token_hash=NULL,revoked_at=NULL,last_seen_at=now(),updated_at=now()
 RETURNING * INTO v_lease;
 INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
 VALUES(v_uid,v_uid,p_device_id,'reader-open',jsonb_build_object('game_id',v_game.id));
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',false,'generation',v_lease.session_generation);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open_reader(uuid) TO authenticated;

-- Read-only preflight: verify the exact Supabase Auth session and account status.
-- This does not create a device session, rotate a token, or modify game state.
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
    AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
 INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid;
 IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL
    OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM auth.sessions newer JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- A displaced old login must not resume metadata reads after the newer
 -- Auth session expires. The historical writer lease is the high-water mark.
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM public.mahjong_device_sessions prior
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision);
END; $$;
-- Read-only refresh for an already opened device session. Unlike peek, this
-- requires a registered, active lease for this exact Supabase Auth session.
-- It never grants writer privileges or rotates writer credentials.
CREATE OR REPLACE FUNCTION public.mahjong_sync_read(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid;
 v_game public.mahjong_game_states%ROWTYPE; v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- A newer login invalidates an older scorekeeper session unless explicitly
 -- allowed by administrator, even if its old lease has not yet been revoked.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active=true
   AND revoked_at IS NULL AND auth_session_id=v_auth_session;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 -- A reader lease is not a permanent entitlement. If the administrator
 -- disables multi-device access, reject previously enrolled reader sessions
 -- immediately instead of allowing continued cloud reads.
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
      AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',v_lease.is_writer
   AND v_lease.session_token_hash IS NOT NULL
   AND v_lease.session_generation>0
   AND v_game.writer_session_id=v_lease.id);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_read(uuid) TO authenticated;

-- Lightweight lease probe for foreground/periodic client checks. A stale device
-- must learn that its writer lease was revoked without waiting for a score edit.
-- This is advisory UI state; commit() remains the server-side security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_lease_status(p_device_id uuid,p_generation bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_auth_session uuid; v_lease public.mahjong_device_sessions%ROWTYPE;
 v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_generation<1 THEN
  RAISE EXCEPTION 'Authentication and valid lease identity required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
  RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND auth_session_id=v_auth_session
   AND session_generation=p_generation AND is_active=true AND revoked_at IS NULL;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked'); END IF;
 RETURN jsonb_build_object('ok',true,'canWrite',v_lease.is_writer
  AND v_lease.session_token_hash IS NOT NULL
  AND v_game.writer_session_id=v_lease.id,
  'gameId',v_game.id,'revision',v_game.revision);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;

-- ROLLBACK-ONLY TEST ASSERTIONS (no persistent schema/data changes)
DO $gate$
DECLARE v_count integer; v_exposed integer;
BEGIN
 SELECT count(*) INTO v_count FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND p.prosecdef AND EXISTS (SELECT 1 FROM unnest(COALESCE(p.proconfig, ARRAY[]::text[])) AS cfg(value) WHERE cfg.value IN ('search_path=', 'search_path=""'));
 IF v_count <> 5 THEN RAISE EXCEPTION 'RPC SECURITY GATE FAIL: expected 5 secure definer functions, found %',v_count; END IF;
 SELECT count(*) INTO v_exposed FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND (has_function_privilege('anon',p.oid,'EXECUTE') OR NOT has_function_privilege('authenticated',p.oid,'EXECUTE'));
 IF v_exposed <> 0 THEN RAISE EXCEPTION 'RPC GRANTS GATE FAIL: % functions exposed or missing auth grant',v_exposed; END IF;
 RAISE NOTICE 'PASS: five RPCs compiled, SECURITY DEFINER/search_path hardened, authenticated-only EXECUTE; ROLLBACK pending';
END $gate$;


-- RUNTIME NEGATIVE GATE: use valid open/commit input to reach auth checks; zero writes to existing game data; all DDL rolls back.
CREATE TEMP TABLE mahjong_rpc_runtime_gate (
  scenario text NOT NULL, rpc text NOT NULL, expected text NOT NULL,
  observed text NOT NULL, status text NOT NULL
) ON COMMIT DROP;
DO $runtime$
DECLARE
 v_uid uuid; v_old uuid; v_new uuid; v_count integer;
 v_rpc text; v_sql text; v_state text; v_result jsonb;
BEGIN
 SELECT count(*), (array_agg(id))[1] INTO v_count,v_uid FROM auth.users
 WHERE raw_app_meta_data->>'role'='scorekeeper' AND deleted_at IS NULL
 AND (lower(raw_user_meta_data->>'username')='wiroseta'
   OR lower(raw_app_meta_data->>'username')='wiroseta'
   OR lower(split_part(email,'@',1))='wiroseta');
 IF v_count<>1 THEN RAISE EXCEPTION 'Test account must resolve uniquely (found %)',v_count; END IF;
 IF EXISTS(SELECT 1 FROM auth.users WHERE id=v_uid AND
    (banned_until>now() OR COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 THEN RAISE EXCEPTION 'Test account must be active and single-device'; END IF;
 SELECT count(*) INTO v_count FROM auth.sessions WHERE user_id=v_uid
 AND (not_after IS NULL OR not_after>now());
 IF v_count<>2 THEN RAISE EXCEPTION 'Expected exactly two live sessions, found %',v_count; END IF;
 SELECT id INTO v_old FROM auth.sessions WHERE user_id=v_uid
 AND (not_after IS NULL OR not_after>now()) ORDER BY created_at,id LIMIT 1;
 SELECT id INTO v_new FROM auth.sessions WHERE user_id=v_uid
 AND (not_after IS NULL OR not_after>now()) ORDER BY created_at DESC,id DESC LIMIT 1;
 IF v_old=v_new THEN RAISE EXCEPTION 'Distinct sessions required'; END IF;
 FOREACH v_rpc IN ARRAY ARRAY['open','commit','open_reader','read','lease_status'] LOOP
   v_sql:=CASE v_rpc
    WHEN 'open' THEN 'SELECT public.mahjong_sync_open(''00000000-0000-0000-0000-000000000001''::uuid,NULL::jsonb,NULL,NULL)'
    WHEN 'commit' THEN 'SELECT public.mahjong_sync_commit(''00000000-0000-0000-0000-000000000002''::uuid,''00000000-0000-0000-0000-000000000001''::uuid,1,repeat(''a'',64),0,''{"names":["A","B","C","D"],"scores":[0,0,0,0],"history":[],"dealer":0,"round":1}''::jsonb)'
    WHEN 'open_reader' THEN 'SELECT public.mahjong_sync_open_reader(''00000000-0000-0000-0000-000000000001''::uuid)'
    WHEN 'read' THEN 'SELECT public.mahjong_sync_read(''00000000-0000-0000-0000-000000000001''::uuid)'
    ELSE 'SELECT public.mahjong_sync_lease_status(''00000000-0000-0000-0000-000000000001''::uuid,1)' END;
   PERFORM set_config('request.jwt.claims','{}',true);
   PERFORM set_config('request.jwt.claim.sub','',true);
   v_state:=NULL;
   BEGIN EXECUTE v_sql INTO v_result;
   EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS v_state=RETURNED_SQLSTATE; END;
   INSERT INTO mahjong_rpc_runtime_gate VALUES('NO JWT',v_rpc,'28000',COALESCE(v_state,'NO ERROR'),
     CASE WHEN v_state='28000' THEN 'PASS' ELSE 'FAIL' END);
   PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',v_uid,'role','authenticated','session_id',v_old)::text,true);
   PERFORM set_config('request.jwt.claim.sub',v_uid::text,true);
   v_state:=NULL; v_result:=NULL;
   BEGIN EXECUTE v_sql INTO v_result;
   EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS v_state=RETURNED_SQLSTATE; END;
   INSERT INTO mahjong_rpc_runtime_gate VALUES('OLDER JWT CLAIM',v_rpc,
     CASE WHEN v_rpc='lease_status' THEN 'JSON newer-login' ELSE '42501' END,
     COALESCE(v_state,COALESCE(v_result::text,'NULL')),
     CASE WHEN v_rpc='lease_status' AND v_state IS NULL
       AND v_result->>'ok'='false' AND v_result->>'reason'='newer-login' THEN 'PASS'
       WHEN v_rpc<>'lease_status' AND v_state='42501' THEN 'PASS'
       ELSE 'FAIL' END);
 END LOOP;
 -- The latest session may read peek metadata; it must not write anything here.
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',v_uid,'role','authenticated','session_id',v_new)::text,true);
 PERFORM set_config('request.jwt.claim.sub',v_uid::text,true);
 v_state:=NULL; v_result:=NULL;
 BEGIN SELECT public.mahjong_sync_peek() INTO v_result;
 EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS v_state=RETURNED_SQLSTATE; END;
 INSERT INTO mahjong_rpc_runtime_gate VALUES('LATEST JWT CLAIM','peek','NO ERROR',COALESCE(v_state,'NO ERROR'),
  CASE WHEN v_state IS NULL THEN 'PASS' ELSE 'FAIL' END);
 RAISE NOTICE 'DIAGNOSTIC ONLY: scenario results follow; all DDL will ROLLBACK';
END $runtime$;
SELECT scenario,rpc,expected,observed,status FROM mahjong_rpc_runtime_gate
ORDER BY CASE scenario WHEN 'NO JWT' THEN 1 WHEN 'OLDER JWT CLAIM' THEN 2 ELSE 3 END,rpc;
-- Never leave claims or DDL behind.

ROLLBACK;

```

## supabase_sync_stage14_five_rpc_RUNTIME_NEGATIVE_ROLLBACK_ONLY.sql

```sql
-- ROLLBACK-ONLY RPC INTEGRATION TEST: NEVER DEPLOY.
-- All CREATE/ALTER/GRANT statements are transaction-scoped and rolled back.
-- Existing Supabase project only: requires isolated test accounts and two-device verification.
-- Depends on v15.7.14 foundation tables.
-- FAIL-CLOSED: token issuance and authentication not yet integrated.
-- This file is deliberately NOT executable in production.
-- REVIEW: existing auth.sessions created_at ordering alone is insufficient to prove
-- the new session owns the writer lease; auth session ID must match on every commit.
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
-- Preserve historical writer binding independently of read-only enrollments.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false;
-- Match the guarded alignment candidate: never auto-promote legacy games.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
-- ADD COLUMN IF NOT EXISTS does not alter an existing DEFAULT true.
-- Explicitly align future implicit inserts; do not rewrite existing game rows.
ALTER TABLE public.mahjong_game_states ALTER COLUMN is_current SET DEFAULT false;
-- Existing verified index: mahjong_one_current_game_per_owner (owner_id WHERE is_current = true).
-- Do not create an equivalent second index here: fail closed until the
-- foundation migration is independently verified in the target environment.

-- Server-side schema validation mirrors the essential four-player client invariants.
-- Do not trust a browser-side validator as a security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN false
  WHEN jsonb_array_length(p_game->'history')>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(trim(leading '-' from x::text))>12) THEN false
  WHEN p_game ? 'roundWind' AND (jsonb_typeof(p_game->'roundWind') IS DISTINCT FROM 'number'
    OR (p_game->>'roundWind') !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (jsonb_typeof(p_game->'seatWinds') IS DISTINCT FROM 'array'
    OR (CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN jsonb_array_length(p_game->'seatWinds') ELSE NULL END)<>4) THEN false
  WHEN p_game ? 'seatWinds' AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number' OR x::text !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (SELECT count(DISTINCT x) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x)<>4 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'object') THEN false
  -- Keep server-side history checks aligned with the client recovery ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE (x ? 'delta' AND (jsonb_typeof(x->'delta') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN jsonb_array_length(x->'delta') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'quads' AND (jsonb_typeof(x->'quads') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN jsonb_array_length(x->'quads') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN x->'quads' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-4]$')))
    OR (x ? 'winner' AND x->'winner'<>'null'::jsonb AND (jsonb_typeof(x->'winner') IS DISTINCT FROM 'number' OR x->>'winner' !~ '^[0-3]$'))
    OR (x ? 'dealer' AND x->'dealer'<>'null'::jsonb AND (jsonb_typeof(x->'dealer') IS DISTINCT FROM 'number' OR x->>'dealer' !~ '^[0-3]$'))
    OR (x ? 'discarder' AND x->'discarder'<>'null'::jsonb AND (jsonb_typeof(x->'discarder') IS DISTINCT FROM 'number' OR x->>'discarder' !~ '^[0-3]$'))
    OR (x ? 'roundWind' AND (jsonb_typeof(x->'roundWind') IS DISTINCT FROM 'number' OR x->>'roundWind' !~ '^[0-3]$'))
    OR (x ? 'method' AND jsonb_typeof(x->'method') IS DISTINCT FROM 'string')
    OR (x ? 'playerPatterns' AND (jsonb_typeof(x->'playerPatterns') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN jsonb_array_length(x->'playerPatterns') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN x->'playerPatterns' ELSE '[]'::jsonb END) p WHERE p <> 'null'::jsonb AND
       (jsonb_typeof(p) IS DISTINCT FROM 'object' OR jsonb_typeof(p->'name') IS DISTINCT FROM 'string'
        OR length(p->>'name')>100 OR jsonb_typeof(p->'points') IS DISTINCT FROM 'number'
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM p->>'points'))>12))))
    OR (x ? 'patterns' AND (jsonb_typeof(x->'patterns') IS DISTINCT FROM 'array'
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'patterns') = 'array' THEN x->'patterns' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string')))
    OR (x ? 'seatWindsBefore' AND (jsonb_typeof(x->'seatWindsBefore') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN jsonb_array_length(x->'seatWindsBefore') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-3]$')
      OR (SELECT count(DISTINCT n) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n)<>4))
    OR (x ? 'namesAtTime' AND (jsonb_typeof(x->'namesAtTime') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN jsonb_array_length(x->'namesAtTime') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN x->'namesAtTime' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string' OR length(n #>> '{}')>100)))
  ) THEN false

  ELSE true END;
$$;
REVOKE ALL ON FUNCTION public.mahjong_sync_valid_game(jsonb) FROM PUBLIC,anon,authenticated;

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid; v_auth_created_at timestamptz;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT created_at INTO v_auth_created_at FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid;
  IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  IF v_token IS NULL OR v_token !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Token generator contract invalid' USING ERRCODE='22023';
  END IF;
  -- NULL means this device has no local game to upload. It may adopt an existing
  -- cloud game, but must never create an empty cloud game implicitly.
  IF p_local_game IS NOT NULL AND NOT public.mahjong_sync_valid_game(p_local_game)
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Revalidate the caller's Auth session AFTER acquiring the account lock.
  -- A pre-lock lookup alone cannot establish that the session remains eligible.
  IF NOT EXISTS (
    SELECT 1 FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid
      AND created_at=v_auth_created_at
      AND (not_after IS NULL OR not_after>clock_timestamp())
  ) THEN
    RAISE EXCEPTION 'Auth session expired or removed during takeover' USING ERRCODE='28000';
  END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  -- Persistent high-water mark: a displaced older Auth session must not
  -- reclaim the writer lease even after the newer Auth session expires or
  -- its auth.sessions row is deleted. Keep historical device rows for this guard.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501';
  END IF;
  -- Do not downgrade the persistent login high-water mark when an admin or
  -- multi-device scorekeeper reuses a device ID from an older Auth session.
  -- This also matters if multi-device permission is disabled later.
  IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
      AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','newer-login');
  END IF;
  -- A caller that supplied a preflight identity must match it regardless
  -- of whether it is adopting cloud data or already holds a local copy.
  -- Otherwise a stale client can take over a different current game.
  IF p_expected_revision IS NOT NULL AND p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Expected revision must not be negative';
  END IF;
  IF (p_expected_revision IS NULL) IS DISTINCT FROM (p_expected_game_id IS NULL) THEN
    RAISE EXCEPTION 'Both expected game ID and revision are required together';
  END IF;
  -- STAGE14 CANDIDATE: an authenticated newer session may take over a
  -- different device after matching cloud game identity/revision below.
  -- The older session is revoked only after all preflight checks pass.
  -- Safety preflight: never revoke an existing writer before checking whether
  -- this device has a different game. The client must reconcile explicitly.
  -- A rejected takeover must leave the current writer fully operational.
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  -- Existing cloud state always requires a matching preflight, even when
  -- the caller submits an identical local snapshot. Otherwise a stale client
  -- could rotate the writer lease without first observing the current revision.
  IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  IF FOUND AND p_expected_game_id IS NOT NULL AND
     (v_game.id IS DISTINCT FROM p_expected_game_id OR
      v_game.revision IS DISTINCT FROM p_expected_revision) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- Compare local payload only after validating the cloud identity/revision.
  -- A stale preflight must not receive the full current game snapshot via
  -- the mismatch response; it must refresh and reconcile explicitly.
  IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN
    RETURN jsonb_build_object('ok',false,'reason','local-cloud-mismatch',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A takeover that adopts cloud state must be based on a prior read of its
  -- exact revision. This prevents a concurrent commit between peek and open
  -- from silently changing the state accepted by the new device.
  IF FOUND AND p_local_game IS NULL AND
     (p_expected_revision IS NULL OR p_expected_revision IS DISTINCT FROM v_game.revision
      OR p_expected_game_id IS NULL OR p_expected_game_id IS DISTINCT FROM v_game.id) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A prior peek that saw a cloud game must never fall back to creating a
  -- new game if the original game disappeared or was replaced in the interim.
  -- This is a preflight failure, not permission to bootstrap new cloud state.
  IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed');
  END IF;
  IF NOT FOUND AND p_local_game IS NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','no-cloud-game');
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      -- Revoke the credential itself, not just the writer flag. A displaced
      -- device must never retain a reusable token hash in the database.
      session_token_hash=NULL,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,ever_writer)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,v_auth_created_at,encode(extensions.digest(v_token,'sha256'),'hex'),true)
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,ever_writer=true,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id,is_current)
    VALUES(v_uid,p_local_game,0,v_session.id,true) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF NOT public.mahjong_sync_valid_game(p_game)
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Recheck Auth session under the same account lock used by takeover.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at IS NOT NULL
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during commit' USING ERRCODE='28000'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 -- Persistent login high-water guard also protects writes when the newer
 -- Auth session has expired or disappeared. A stale writer token alone is
 -- insufficient to prove that an older login still owns the account.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
   JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.auth_session_created_at IS NOT NULL
     AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 -- STAGE14: no historical device binding at commit; enforce current
 -- Auth session, writer lease, generation and token below instead.
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   -- A revoked or displaced device is no longer authorized to submit game
   -- payloads. Do not persist its proposed snapshot in the conflict ledger:
   -- that would permit repeated rejected writes to fill server storage.
   -- Only an authenticated CURRENT writer may record a revision conflict.
   IF v_reason='revision-conflict' THEN
     INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
       VALUES(v_game.id,v_uid,p_device_id,p_base_revision,p_game,v_reason);
   END IF;
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

-- Explicit reader enrollment. A read-only device must never call mahjong_sync_open,
-- because that operation transfers the sole writer lease.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_auth_created_at timestamptz;
 v_game public.mahjong_game_states%ROWTYPE;
 v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT created_at INTO v_auth_created_at FROM auth.sessions
  WHERE id=v_auth_session AND user_id=v_uid;
 IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
 -- Serialize with writer takeovers and commits for this account.
 SELECT raw_app_meta_data->>'role',
  COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false),
  banned_until,deleted_at INTO v_role,v_multi,v_banned,v_deleted
 FROM auth.users WHERE id=v_uid FOR UPDATE;
 IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL
  OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Reader enrollment also must not rely only on pre-lock Auth checks.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at=v_auth_created_at
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during reader open' USING ERRCODE='28000'; END IF;
 IF v_role<>'admin' AND NOT v_multi THEN
  RAISE EXCEPTION 'Multi-device reading not permitted' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 -- Never replace a newer recorded Auth session with an older one on a
 -- reused device ID. That would erase the persistent takeover high-water
 -- mark if multi-device access is subsequently disabled.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
  WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','newer-login');
 END IF;
 -- Never downgrade a current writer on this device. Require a separate
 -- device ID for a read-only enrollment, rather than clobber its token.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active AND is_writer
   AND revoked_at IS NULL) THEN
  RETURN jsonb_build_object('ok',false,'reason','device-already-writer');
 END IF;
 INSERT INTO public.mahjong_device_sessions
  (user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,revoked_at)
 VALUES(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL)
 ON CONFLICT(user_id,device_id) DO UPDATE SET
  is_active=true,is_writer=false,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,
  session_generation=public.mahjong_device_sessions.session_generation+1,
  session_token_hash=NULL,revoked_at=NULL,last_seen_at=now(),updated_at=now()
 RETURNING * INTO v_lease;
 INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
 VALUES(v_uid,v_uid,p_device_id,'reader-open',jsonb_build_object('game_id',v_game.id));
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',false,'generation',v_lease.session_generation);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open_reader(uuid) TO authenticated;

-- Read-only preflight: verify the exact Supabase Auth session and account status.
-- This does not create a device session, rotate a token, or modify game state.
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
    AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
 INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid;
 IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL
    OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM auth.sessions newer JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- A displaced old login must not resume metadata reads after the newer
 -- Auth session expires. The historical writer lease is the high-water mark.
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM public.mahjong_device_sessions prior
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision);
END; $$;
-- Read-only refresh for an already opened device session. Unlike peek, this
-- requires a registered, active lease for this exact Supabase Auth session.
-- It never grants writer privileges or rotates writer credentials.
CREATE OR REPLACE FUNCTION public.mahjong_sync_read(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid;
 v_game public.mahjong_game_states%ROWTYPE; v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- A newer login invalidates an older scorekeeper session unless explicitly
 -- allowed by administrator, even if its old lease has not yet been revoked.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active=true
   AND revoked_at IS NULL AND auth_session_id=v_auth_session;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 -- A reader lease is not a permanent entitlement. If the administrator
 -- disables multi-device access, reject previously enrolled reader sessions
 -- immediately instead of allowing continued cloud reads.
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
      AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',v_lease.is_writer
   AND v_lease.session_token_hash IS NOT NULL
   AND v_lease.session_generation>0
   AND v_game.writer_session_id=v_lease.id);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_read(uuid) TO authenticated;

-- Lightweight lease probe for foreground/periodic client checks. A stale device
-- must learn that its writer lease was revoked without waiting for a score edit.
-- This is advisory UI state; commit() remains the server-side security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_lease_status(p_device_id uuid,p_generation bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_auth_session uuid; v_lease public.mahjong_device_sessions%ROWTYPE;
 v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_generation<1 THEN
  RAISE EXCEPTION 'Authentication and valid lease identity required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
  RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND auth_session_id=v_auth_session
   AND session_generation=p_generation AND is_active=true AND revoked_at IS NULL;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked'); END IF;
 RETURN jsonb_build_object('ok',true,'canWrite',v_lease.is_writer
  AND v_lease.session_token_hash IS NOT NULL
  AND v_game.writer_session_id=v_lease.id,
  'gameId',v_game.id,'revision',v_game.revision);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;

-- ROLLBACK-ONLY TEST ASSERTIONS (no persistent schema/data changes)
DO $gate$
DECLARE v_count integer; v_exposed integer;
BEGIN
 SELECT count(*) INTO v_count FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND p.prosecdef AND EXISTS (SELECT 1 FROM unnest(COALESCE(p.proconfig, ARRAY[]::text[])) AS cfg(value) WHERE cfg.value IN ('search_path=', 'search_path=""'));
 IF v_count <> 5 THEN RAISE EXCEPTION 'RPC SECURITY GATE FAIL: expected 5 secure definer functions, found %',v_count; END IF;
 SELECT count(*) INTO v_exposed FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND (has_function_privilege('anon',p.oid,'EXECUTE') OR NOT has_function_privilege('authenticated',p.oid,'EXECUTE'));
 IF v_exposed <> 0 THEN RAISE EXCEPTION 'RPC GRANTS GATE FAIL: % functions exposed or missing auth grant',v_exposed; END IF;
 RAISE NOTICE 'PASS: five RPCs compiled, SECURITY DEFINER/search_path hardened, authenticated-only EXECUTE; ROLLBACK pending';
END $gate$;


-- RUNTIME NEGATIVE GATE: zero writes to existing game data; all DDL rolls back.
CREATE TEMP TABLE mahjong_rpc_runtime_gate (
  scenario text NOT NULL, rpc text NOT NULL, expected text NOT NULL,
  observed text NOT NULL, status text NOT NULL
) ON COMMIT DROP;
DO $runtime$
DECLARE
 v_uid uuid; v_old uuid; v_new uuid; v_count integer;
 v_rpc text; v_sql text; v_state text; v_result jsonb;
BEGIN
 SELECT count(*), (array_agg(id))[1] INTO v_count,v_uid FROM auth.users
 WHERE raw_app_meta_data->>'role'='scorekeeper' AND deleted_at IS NULL
 AND (lower(raw_user_meta_data->>'username')='wiroseta'
   OR lower(raw_app_meta_data->>'username')='wiroseta'
   OR lower(split_part(email,'@',1))='wiroseta');
 IF v_count<>1 THEN RAISE EXCEPTION 'Test account must resolve uniquely (found %)',v_count; END IF;
 IF EXISTS(SELECT 1 FROM auth.users WHERE id=v_uid AND
    (banned_until>now() OR COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 THEN RAISE EXCEPTION 'Test account must be active and single-device'; END IF;
 SELECT count(*) INTO v_count FROM auth.sessions WHERE user_id=v_uid
 AND (not_after IS NULL OR not_after>now());
 IF v_count<>2 THEN RAISE EXCEPTION 'Expected exactly two live sessions, found %',v_count; END IF;
 SELECT id INTO v_old FROM auth.sessions WHERE user_id=v_uid
 AND (not_after IS NULL OR not_after>now()) ORDER BY created_at,id LIMIT 1;
 SELECT id INTO v_new FROM auth.sessions WHERE user_id=v_uid
 AND (not_after IS NULL OR not_after>now()) ORDER BY created_at DESC,id DESC LIMIT 1;
 IF v_old=v_new THEN RAISE EXCEPTION 'Distinct sessions required'; END IF;
 FOREACH v_rpc IN ARRAY ARRAY['open','commit','open_reader','read','lease_status'] LOOP
   v_sql:=CASE v_rpc
    WHEN 'open' THEN 'SELECT public.mahjong_sync_open(''00000000-0000-0000-0000-000000000001''::uuid,''{}''::jsonb,NULL,NULL)'
    WHEN 'commit' THEN 'SELECT public.mahjong_sync_commit(''00000000-0000-0000-0000-000000000002''::uuid,''00000000-0000-0000-0000-000000000001''::uuid,1,''invalid'',0,''{}''::jsonb)'
    WHEN 'open_reader' THEN 'SELECT public.mahjong_sync_open_reader(''00000000-0000-0000-0000-000000000001''::uuid)'
    WHEN 'read' THEN 'SELECT public.mahjong_sync_read(''00000000-0000-0000-0000-000000000001''::uuid)'
    ELSE 'SELECT public.mahjong_sync_lease_status(''00000000-0000-0000-0000-000000000001''::uuid,1)' END;
   PERFORM set_config('request.jwt.claims','{}',true);
   PERFORM set_config('request.jwt.claim.sub','',true);
   v_state:=NULL;
   BEGIN EXECUTE v_sql INTO v_result;
   EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS v_state=RETURNED_SQLSTATE; END;
   INSERT INTO mahjong_rpc_runtime_gate VALUES('NO JWT',v_rpc,'28000',COALESCE(v_state,'NO ERROR'),
     CASE WHEN v_state='28000' THEN 'PASS' ELSE 'FAIL' END);
   PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',v_uid,'role','authenticated','session_id',v_old)::text,true);
   PERFORM set_config('request.jwt.claim.sub',v_uid::text,true);
   v_state:=NULL; v_result:=NULL;
   BEGIN EXECUTE v_sql INTO v_result;
   EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS v_state=RETURNED_SQLSTATE; END;
   INSERT INTO mahjong_rpc_runtime_gate VALUES('OLDER JWT CLAIM',v_rpc,'42501',COALESCE(v_state,COALESCE(v_result::text,'NULL')),
     CASE WHEN v_state='42501' THEN 'PASS' ELSE 'FAIL' END);
 END LOOP;
 -- The latest session may read peek metadata; it must not write anything here.
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',v_uid,'role','authenticated','session_id',v_new)::text,true);
 PERFORM set_config('request.jwt.claim.sub',v_uid::text,true);
 v_state:=NULL; v_result:=NULL;
 BEGIN SELECT public.mahjong_sync_peek() INTO v_result;
 EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS v_state=RETURNED_SQLSTATE; END;
 INSERT INTO mahjong_rpc_runtime_gate VALUES('LATEST JWT CLAIM','peek','NO ERROR',COALESCE(v_state,'NO ERROR'),
  CASE WHEN v_state IS NULL THEN 'PASS' ELSE 'FAIL' END);
 IF EXISTS(SELECT 1 FROM mahjong_rpc_runtime_gate WHERE status='FAIL') THEN
  RAISE EXCEPTION 'RPC NEGATIVE GATE FAIL: one or more scenarios failed';
 END IF;
 RAISE NOTICE 'PASS: 11 runtime negative/peek scenarios; all DDL will ROLLBACK';
END $runtime$;
SELECT scenario,rpc,expected,observed,status FROM mahjong_rpc_runtime_gate
ORDER BY scenario,rpc;
-- Never leave claims or DDL behind.

ROLLBACK;

```

## supabase_sync_stage14_five_rpc_compile_security_ROLLBACK_ONLY.sql

```sql
-- ROLLBACK-ONLY RPC INTEGRATION TEST: NEVER DEPLOY.
-- All CREATE/ALTER/GRANT statements are transaction-scoped and rolled back.
-- Existing Supabase project only: requires isolated test accounts and two-device verification.
-- Depends on v15.7.14 foundation tables.
-- FAIL-CLOSED: token issuance and authentication not yet integrated.
-- This file is deliberately NOT executable in production.
-- REVIEW: existing auth.sessions created_at ordering alone is insufficient to prove
-- the new session owns the writer lease; auth session ID must match on every commit.
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
-- Preserve historical writer binding independently of read-only enrollments.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false;
-- Match the guarded alignment candidate: never auto-promote legacy games.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
-- ADD COLUMN IF NOT EXISTS does not alter an existing DEFAULT true.
-- Explicitly align future implicit inserts; do not rewrite existing game rows.
ALTER TABLE public.mahjong_game_states ALTER COLUMN is_current SET DEFAULT false;
-- Existing verified index: mahjong_one_current_game_per_owner (owner_id WHERE is_current = true).
-- Do not create an equivalent second index here: fail closed until the
-- foundation migration is independently verified in the target environment.

-- Server-side schema validation mirrors the essential four-player client invariants.
-- Do not trust a browser-side validator as a security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN false
  WHEN jsonb_array_length(p_game->'history')>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(trim(leading '-' from x::text))>12) THEN false
  WHEN p_game ? 'roundWind' AND (jsonb_typeof(p_game->'roundWind') IS DISTINCT FROM 'number'
    OR (p_game->>'roundWind') !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (jsonb_typeof(p_game->'seatWinds') IS DISTINCT FROM 'array'
    OR (CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN jsonb_array_length(p_game->'seatWinds') ELSE NULL END)<>4) THEN false
  WHEN p_game ? 'seatWinds' AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number' OR x::text !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (SELECT count(DISTINCT x) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x)<>4 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'object') THEN false
  -- Keep server-side history checks aligned with the client recovery ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE (x ? 'delta' AND (jsonb_typeof(x->'delta') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN jsonb_array_length(x->'delta') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'quads' AND (jsonb_typeof(x->'quads') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN jsonb_array_length(x->'quads') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN x->'quads' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-4]$')))
    OR (x ? 'winner' AND x->'winner'<>'null'::jsonb AND (jsonb_typeof(x->'winner') IS DISTINCT FROM 'number' OR x->>'winner' !~ '^[0-3]$'))
    OR (x ? 'dealer' AND x->'dealer'<>'null'::jsonb AND (jsonb_typeof(x->'dealer') IS DISTINCT FROM 'number' OR x->>'dealer' !~ '^[0-3]$'))
    OR (x ? 'discarder' AND x->'discarder'<>'null'::jsonb AND (jsonb_typeof(x->'discarder') IS DISTINCT FROM 'number' OR x->>'discarder' !~ '^[0-3]$'))
    OR (x ? 'roundWind' AND (jsonb_typeof(x->'roundWind') IS DISTINCT FROM 'number' OR x->>'roundWind' !~ '^[0-3]$'))
    OR (x ? 'method' AND jsonb_typeof(x->'method') IS DISTINCT FROM 'string')
    OR (x ? 'playerPatterns' AND (jsonb_typeof(x->'playerPatterns') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN jsonb_array_length(x->'playerPatterns') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN x->'playerPatterns' ELSE '[]'::jsonb END) p WHERE p <> 'null'::jsonb AND
       (jsonb_typeof(p) IS DISTINCT FROM 'object' OR jsonb_typeof(p->'name') IS DISTINCT FROM 'string'
        OR length(p->>'name')>100 OR jsonb_typeof(p->'points') IS DISTINCT FROM 'number'
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM p->>'points'))>12))))
    OR (x ? 'patterns' AND (jsonb_typeof(x->'patterns') IS DISTINCT FROM 'array'
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'patterns') = 'array' THEN x->'patterns' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string')))
    OR (x ? 'seatWindsBefore' AND (jsonb_typeof(x->'seatWindsBefore') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN jsonb_array_length(x->'seatWindsBefore') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-3]$')
      OR (SELECT count(DISTINCT n) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n)<>4))
    OR (x ? 'namesAtTime' AND (jsonb_typeof(x->'namesAtTime') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN jsonb_array_length(x->'namesAtTime') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN x->'namesAtTime' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string' OR length(n #>> '{}')>100)))
  ) THEN false

  ELSE true END;
$$;
REVOKE ALL ON FUNCTION public.mahjong_sync_valid_game(jsonb) FROM PUBLIC,anon,authenticated;

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid; v_auth_created_at timestamptz;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT created_at INTO v_auth_created_at FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid;
  IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  IF v_token IS NULL OR v_token !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Token generator contract invalid' USING ERRCODE='22023';
  END IF;
  -- NULL means this device has no local game to upload. It may adopt an existing
  -- cloud game, but must never create an empty cloud game implicitly.
  IF p_local_game IS NOT NULL AND NOT public.mahjong_sync_valid_game(p_local_game)
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Revalidate the caller's Auth session AFTER acquiring the account lock.
  -- A pre-lock lookup alone cannot establish that the session remains eligible.
  IF NOT EXISTS (
    SELECT 1 FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid
      AND created_at=v_auth_created_at
      AND (not_after IS NULL OR not_after>clock_timestamp())
  ) THEN
    RAISE EXCEPTION 'Auth session expired or removed during takeover' USING ERRCODE='28000';
  END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  -- Persistent high-water mark: a displaced older Auth session must not
  -- reclaim the writer lease even after the newer Auth session expires or
  -- its auth.sessions row is deleted. Keep historical device rows for this guard.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501';
  END IF;
  -- Do not downgrade the persistent login high-water mark when an admin or
  -- multi-device scorekeeper reuses a device ID from an older Auth session.
  -- This also matters if multi-device permission is disabled later.
  IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
      AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','newer-login');
  END IF;
  -- A caller that supplied a preflight identity must match it regardless
  -- of whether it is adopting cloud data or already holds a local copy.
  -- Otherwise a stale client can take over a different current game.
  IF p_expected_revision IS NOT NULL AND p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Expected revision must not be negative';
  END IF;
  IF (p_expected_revision IS NULL) IS DISTINCT FROM (p_expected_game_id IS NULL) THEN
    RAISE EXCEPTION 'Both expected game ID and revision are required together';
  END IF;
  -- STAGE14 CANDIDATE: an authenticated newer session may take over a
  -- different device after matching cloud game identity/revision below.
  -- The older session is revoked only after all preflight checks pass.
  -- Safety preflight: never revoke an existing writer before checking whether
  -- this device has a different game. The client must reconcile explicitly.
  -- A rejected takeover must leave the current writer fully operational.
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  -- Existing cloud state always requires a matching preflight, even when
  -- the caller submits an identical local snapshot. Otherwise a stale client
  -- could rotate the writer lease without first observing the current revision.
  IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  IF FOUND AND p_expected_game_id IS NOT NULL AND
     (v_game.id IS DISTINCT FROM p_expected_game_id OR
      v_game.revision IS DISTINCT FROM p_expected_revision) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- Compare local payload only after validating the cloud identity/revision.
  -- A stale preflight must not receive the full current game snapshot via
  -- the mismatch response; it must refresh and reconcile explicitly.
  IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN
    RETURN jsonb_build_object('ok',false,'reason','local-cloud-mismatch',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A takeover that adopts cloud state must be based on a prior read of its
  -- exact revision. This prevents a concurrent commit between peek and open
  -- from silently changing the state accepted by the new device.
  IF FOUND AND p_local_game IS NULL AND
     (p_expected_revision IS NULL OR p_expected_revision IS DISTINCT FROM v_game.revision
      OR p_expected_game_id IS NULL OR p_expected_game_id IS DISTINCT FROM v_game.id) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A prior peek that saw a cloud game must never fall back to creating a
  -- new game if the original game disappeared or was replaced in the interim.
  -- This is a preflight failure, not permission to bootstrap new cloud state.
  IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed');
  END IF;
  IF NOT FOUND AND p_local_game IS NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','no-cloud-game');
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      -- Revoke the credential itself, not just the writer flag. A displaced
      -- device must never retain a reusable token hash in the database.
      session_token_hash=NULL,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,ever_writer)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,v_auth_created_at,encode(extensions.digest(v_token,'sha256'),'hex'),true)
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,ever_writer=true,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id,is_current)
    VALUES(v_uid,p_local_game,0,v_session.id,true) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF NOT public.mahjong_sync_valid_game(p_game)
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Recheck Auth session under the same account lock used by takeover.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at IS NOT NULL
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during commit' USING ERRCODE='28000'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 -- Persistent login high-water guard also protects writes when the newer
 -- Auth session has expired or disappeared. A stale writer token alone is
 -- insufficient to prove that an older login still owns the account.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
   JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.auth_session_created_at IS NOT NULL
     AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 -- STAGE14: no historical device binding at commit; enforce current
 -- Auth session, writer lease, generation and token below instead.
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   -- A revoked or displaced device is no longer authorized to submit game
   -- payloads. Do not persist its proposed snapshot in the conflict ledger:
   -- that would permit repeated rejected writes to fill server storage.
   -- Only an authenticated CURRENT writer may record a revision conflict.
   IF v_reason='revision-conflict' THEN
     INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
       VALUES(v_game.id,v_uid,p_device_id,p_base_revision,p_game,v_reason);
   END IF;
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

-- Explicit reader enrollment. A read-only device must never call mahjong_sync_open,
-- because that operation transfers the sole writer lease.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_auth_created_at timestamptz;
 v_game public.mahjong_game_states%ROWTYPE;
 v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT created_at INTO v_auth_created_at FROM auth.sessions
  WHERE id=v_auth_session AND user_id=v_uid;
 IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
 -- Serialize with writer takeovers and commits for this account.
 SELECT raw_app_meta_data->>'role',
  COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false),
  banned_until,deleted_at INTO v_role,v_multi,v_banned,v_deleted
 FROM auth.users WHERE id=v_uid FOR UPDATE;
 IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL
  OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Reader enrollment also must not rely only on pre-lock Auth checks.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at=v_auth_created_at
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during reader open' USING ERRCODE='28000'; END IF;
 IF v_role<>'admin' AND NOT v_multi THEN
  RAISE EXCEPTION 'Multi-device reading not permitted' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 -- Never replace a newer recorded Auth session with an older one on a
 -- reused device ID. That would erase the persistent takeover high-water
 -- mark if multi-device access is subsequently disabled.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
  WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','newer-login');
 END IF;
 -- Never downgrade a current writer on this device. Require a separate
 -- device ID for a read-only enrollment, rather than clobber its token.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active AND is_writer
   AND revoked_at IS NULL) THEN
  RETURN jsonb_build_object('ok',false,'reason','device-already-writer');
 END IF;
 INSERT INTO public.mahjong_device_sessions
  (user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,revoked_at)
 VALUES(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL)
 ON CONFLICT(user_id,device_id) DO UPDATE SET
  is_active=true,is_writer=false,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,
  session_generation=public.mahjong_device_sessions.session_generation+1,
  session_token_hash=NULL,revoked_at=NULL,last_seen_at=now(),updated_at=now()
 RETURNING * INTO v_lease;
 INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
 VALUES(v_uid,v_uid,p_device_id,'reader-open',jsonb_build_object('game_id',v_game.id));
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',false,'generation',v_lease.session_generation);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open_reader(uuid) TO authenticated;

-- Read-only preflight: verify the exact Supabase Auth session and account status.
-- This does not create a device session, rotate a token, or modify game state.
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
    AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
 INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid;
 IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL
    OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM auth.sessions newer JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- A displaced old login must not resume metadata reads after the newer
 -- Auth session expires. The historical writer lease is the high-water mark.
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM public.mahjong_device_sessions prior
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision);
END; $$;
-- Read-only refresh for an already opened device session. Unlike peek, this
-- requires a registered, active lease for this exact Supabase Auth session.
-- It never grants writer privileges or rotates writer credentials.
CREATE OR REPLACE FUNCTION public.mahjong_sync_read(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid;
 v_game public.mahjong_game_states%ROWTYPE; v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- A newer login invalidates an older scorekeeper session unless explicitly
 -- allowed by administrator, even if its old lease has not yet been revoked.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active=true
   AND revoked_at IS NULL AND auth_session_id=v_auth_session;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 -- A reader lease is not a permanent entitlement. If the administrator
 -- disables multi-device access, reject previously enrolled reader sessions
 -- immediately instead of allowing continued cloud reads.
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
      AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',v_lease.is_writer
   AND v_lease.session_token_hash IS NOT NULL
   AND v_lease.session_generation>0
   AND v_game.writer_session_id=v_lease.id);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_read(uuid) TO authenticated;

-- Lightweight lease probe for foreground/periodic client checks. A stale device
-- must learn that its writer lease was revoked without waiting for a score edit.
-- This is advisory UI state; commit() remains the server-side security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_lease_status(p_device_id uuid,p_generation bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_auth_session uuid; v_lease public.mahjong_device_sessions%ROWTYPE;
 v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_generation<1 THEN
  RAISE EXCEPTION 'Authentication and valid lease identity required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
  RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND auth_session_id=v_auth_session
   AND session_generation=p_generation AND is_active=true AND revoked_at IS NULL;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked'); END IF;
 RETURN jsonb_build_object('ok',true,'canWrite',v_lease.is_writer
  AND v_lease.session_token_hash IS NOT NULL
  AND v_game.writer_session_id=v_lease.id,
  'gameId',v_game.id,'revision',v_game.revision);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;

-- ROLLBACK-ONLY TEST ASSERTIONS (no persistent schema/data changes)
DO $gate$
DECLARE v_count integer; v_exposed integer;
BEGIN
 SELECT count(*) INTO v_count FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND p.prosecdef AND p.proconfig @> ARRAY['search_path=']::text[];
 IF v_count <> 5 THEN RAISE EXCEPTION 'RPC SECURITY GATE FAIL: expected 5 secure definer functions, found %',v_count; END IF;
 SELECT count(*) INTO v_exposed FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND (has_function_privilege('anon',p.oid,'EXECUTE') OR NOT has_function_privilege('authenticated',p.oid,'EXECUTE'));
 IF v_exposed <> 0 THEN RAISE EXCEPTION 'RPC GRANTS GATE FAIL: % functions exposed or missing auth grant',v_exposed; END IF;
 RAISE NOTICE 'PASS: five RPCs compiled, SECURITY DEFINER/search_path hardened, authenticated-only EXECUTE; ROLLBACK pending';
END $gate$;

ROLLBACK;

```

## supabase_sync_stage14_five_rpc_compile_security_ROLLBACK_ONLY_FIXED.sql

```sql
-- ROLLBACK-ONLY RPC INTEGRATION TEST: NEVER DEPLOY.
-- All CREATE/ALTER/GRANT statements are transaction-scoped and rolled back.
-- Existing Supabase project only: requires isolated test accounts and two-device verification.
-- Depends on v15.7.14 foundation tables.
-- FAIL-CLOSED: token issuance and authentication not yet integrated.
-- This file is deliberately NOT executable in production.
-- REVIEW: existing auth.sessions created_at ordering alone is insufficient to prove
-- the new session owns the writer lease; auth session ID must match on every commit.
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
-- Preserve historical writer binding independently of read-only enrollments.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false;
-- Match the guarded alignment candidate: never auto-promote legacy games.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
-- ADD COLUMN IF NOT EXISTS does not alter an existing DEFAULT true.
-- Explicitly align future implicit inserts; do not rewrite existing game rows.
ALTER TABLE public.mahjong_game_states ALTER COLUMN is_current SET DEFAULT false;
-- Existing verified index: mahjong_one_current_game_per_owner (owner_id WHERE is_current = true).
-- Do not create an equivalent second index here: fail closed until the
-- foundation migration is independently verified in the target environment.

-- Server-side schema validation mirrors the essential four-player client invariants.
-- Do not trust a browser-side validator as a security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN false
  WHEN jsonb_array_length(p_game->'history')>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(trim(leading '-' from x::text))>12) THEN false
  WHEN p_game ? 'roundWind' AND (jsonb_typeof(p_game->'roundWind') IS DISTINCT FROM 'number'
    OR (p_game->>'roundWind') !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (jsonb_typeof(p_game->'seatWinds') IS DISTINCT FROM 'array'
    OR (CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN jsonb_array_length(p_game->'seatWinds') ELSE NULL END)<>4) THEN false
  WHEN p_game ? 'seatWinds' AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number' OR x::text !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (SELECT count(DISTINCT x) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x)<>4 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'object') THEN false
  -- Keep server-side history checks aligned with the client recovery ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE (x ? 'delta' AND (jsonb_typeof(x->'delta') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN jsonb_array_length(x->'delta') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'quads' AND (jsonb_typeof(x->'quads') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN jsonb_array_length(x->'quads') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN x->'quads' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-4]$')))
    OR (x ? 'winner' AND x->'winner'<>'null'::jsonb AND (jsonb_typeof(x->'winner') IS DISTINCT FROM 'number' OR x->>'winner' !~ '^[0-3]$'))
    OR (x ? 'dealer' AND x->'dealer'<>'null'::jsonb AND (jsonb_typeof(x->'dealer') IS DISTINCT FROM 'number' OR x->>'dealer' !~ '^[0-3]$'))
    OR (x ? 'discarder' AND x->'discarder'<>'null'::jsonb AND (jsonb_typeof(x->'discarder') IS DISTINCT FROM 'number' OR x->>'discarder' !~ '^[0-3]$'))
    OR (x ? 'roundWind' AND (jsonb_typeof(x->'roundWind') IS DISTINCT FROM 'number' OR x->>'roundWind' !~ '^[0-3]$'))
    OR (x ? 'method' AND jsonb_typeof(x->'method') IS DISTINCT FROM 'string')
    OR (x ? 'playerPatterns' AND (jsonb_typeof(x->'playerPatterns') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN jsonb_array_length(x->'playerPatterns') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN x->'playerPatterns' ELSE '[]'::jsonb END) p WHERE p <> 'null'::jsonb AND
       (jsonb_typeof(p) IS DISTINCT FROM 'object' OR jsonb_typeof(p->'name') IS DISTINCT FROM 'string'
        OR length(p->>'name')>100 OR jsonb_typeof(p->'points') IS DISTINCT FROM 'number'
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM p->>'points'))>12))))
    OR (x ? 'patterns' AND (jsonb_typeof(x->'patterns') IS DISTINCT FROM 'array'
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'patterns') = 'array' THEN x->'patterns' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string')))
    OR (x ? 'seatWindsBefore' AND (jsonb_typeof(x->'seatWindsBefore') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN jsonb_array_length(x->'seatWindsBefore') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-3]$')
      OR (SELECT count(DISTINCT n) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n)<>4))
    OR (x ? 'namesAtTime' AND (jsonb_typeof(x->'namesAtTime') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN jsonb_array_length(x->'namesAtTime') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN x->'namesAtTime' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string' OR length(n #>> '{}')>100)))
  ) THEN false

  ELSE true END;
$$;
REVOKE ALL ON FUNCTION public.mahjong_sync_valid_game(jsonb) FROM PUBLIC,anon,authenticated;

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid; v_auth_created_at timestamptz;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT created_at INTO v_auth_created_at FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid;
  IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  IF v_token IS NULL OR v_token !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Token generator contract invalid' USING ERRCODE='22023';
  END IF;
  -- NULL means this device has no local game to upload. It may adopt an existing
  -- cloud game, but must never create an empty cloud game implicitly.
  IF p_local_game IS NOT NULL AND NOT public.mahjong_sync_valid_game(p_local_game)
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Revalidate the caller's Auth session AFTER acquiring the account lock.
  -- A pre-lock lookup alone cannot establish that the session remains eligible.
  IF NOT EXISTS (
    SELECT 1 FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid
      AND created_at=v_auth_created_at
      AND (not_after IS NULL OR not_after>clock_timestamp())
  ) THEN
    RAISE EXCEPTION 'Auth session expired or removed during takeover' USING ERRCODE='28000';
  END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  -- Persistent high-water mark: a displaced older Auth session must not
  -- reclaim the writer lease even after the newer Auth session expires or
  -- its auth.sessions row is deleted. Keep historical device rows for this guard.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501';
  END IF;
  -- Do not downgrade the persistent login high-water mark when an admin or
  -- multi-device scorekeeper reuses a device ID from an older Auth session.
  -- This also matters if multi-device permission is disabled later.
  IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
      AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','newer-login');
  END IF;
  -- A caller that supplied a preflight identity must match it regardless
  -- of whether it is adopting cloud data or already holds a local copy.
  -- Otherwise a stale client can take over a different current game.
  IF p_expected_revision IS NOT NULL AND p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Expected revision must not be negative';
  END IF;
  IF (p_expected_revision IS NULL) IS DISTINCT FROM (p_expected_game_id IS NULL) THEN
    RAISE EXCEPTION 'Both expected game ID and revision are required together';
  END IF;
  -- STAGE14 CANDIDATE: an authenticated newer session may take over a
  -- different device after matching cloud game identity/revision below.
  -- The older session is revoked only after all preflight checks pass.
  -- Safety preflight: never revoke an existing writer before checking whether
  -- this device has a different game. The client must reconcile explicitly.
  -- A rejected takeover must leave the current writer fully operational.
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  -- Existing cloud state always requires a matching preflight, even when
  -- the caller submits an identical local snapshot. Otherwise a stale client
  -- could rotate the writer lease without first observing the current revision.
  IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  IF FOUND AND p_expected_game_id IS NOT NULL AND
     (v_game.id IS DISTINCT FROM p_expected_game_id OR
      v_game.revision IS DISTINCT FROM p_expected_revision) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- Compare local payload only after validating the cloud identity/revision.
  -- A stale preflight must not receive the full current game snapshot via
  -- the mismatch response; it must refresh and reconcile explicitly.
  IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN
    RETURN jsonb_build_object('ok',false,'reason','local-cloud-mismatch',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A takeover that adopts cloud state must be based on a prior read of its
  -- exact revision. This prevents a concurrent commit between peek and open
  -- from silently changing the state accepted by the new device.
  IF FOUND AND p_local_game IS NULL AND
     (p_expected_revision IS NULL OR p_expected_revision IS DISTINCT FROM v_game.revision
      OR p_expected_game_id IS NULL OR p_expected_game_id IS DISTINCT FROM v_game.id) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A prior peek that saw a cloud game must never fall back to creating a
  -- new game if the original game disappeared or was replaced in the interim.
  -- This is a preflight failure, not permission to bootstrap new cloud state.
  IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed');
  END IF;
  IF NOT FOUND AND p_local_game IS NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','no-cloud-game');
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      -- Revoke the credential itself, not just the writer flag. A displaced
      -- device must never retain a reusable token hash in the database.
      session_token_hash=NULL,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,ever_writer)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,v_auth_created_at,encode(extensions.digest(v_token,'sha256'),'hex'),true)
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,ever_writer=true,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id,is_current)
    VALUES(v_uid,p_local_game,0,v_session.id,true) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF NOT public.mahjong_sync_valid_game(p_game)
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Recheck Auth session under the same account lock used by takeover.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at IS NOT NULL
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during commit' USING ERRCODE='28000'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 -- Persistent login high-water guard also protects writes when the newer
 -- Auth session has expired or disappeared. A stale writer token alone is
 -- insufficient to prove that an older login still owns the account.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
   JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.auth_session_created_at IS NOT NULL
     AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 -- STAGE14: no historical device binding at commit; enforce current
 -- Auth session, writer lease, generation and token below instead.
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   -- A revoked or displaced device is no longer authorized to submit game
   -- payloads. Do not persist its proposed snapshot in the conflict ledger:
   -- that would permit repeated rejected writes to fill server storage.
   -- Only an authenticated CURRENT writer may record a revision conflict.
   IF v_reason='revision-conflict' THEN
     INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
       VALUES(v_game.id,v_uid,p_device_id,p_base_revision,p_game,v_reason);
   END IF;
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

-- Explicit reader enrollment. A read-only device must never call mahjong_sync_open,
-- because that operation transfers the sole writer lease.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_auth_created_at timestamptz;
 v_game public.mahjong_game_states%ROWTYPE;
 v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT created_at INTO v_auth_created_at FROM auth.sessions
  WHERE id=v_auth_session AND user_id=v_uid;
 IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
 -- Serialize with writer takeovers and commits for this account.
 SELECT raw_app_meta_data->>'role',
  COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false),
  banned_until,deleted_at INTO v_role,v_multi,v_banned,v_deleted
 FROM auth.users WHERE id=v_uid FOR UPDATE;
 IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL
  OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Reader enrollment also must not rely only on pre-lock Auth checks.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at=v_auth_created_at
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during reader open' USING ERRCODE='28000'; END IF;
 IF v_role<>'admin' AND NOT v_multi THEN
  RAISE EXCEPTION 'Multi-device reading not permitted' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 -- Never replace a newer recorded Auth session with an older one on a
 -- reused device ID. That would erase the persistent takeover high-water
 -- mark if multi-device access is subsequently disabled.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
  WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','newer-login');
 END IF;
 -- Never downgrade a current writer on this device. Require a separate
 -- device ID for a read-only enrollment, rather than clobber its token.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active AND is_writer
   AND revoked_at IS NULL) THEN
  RETURN jsonb_build_object('ok',false,'reason','device-already-writer');
 END IF;
 INSERT INTO public.mahjong_device_sessions
  (user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,revoked_at)
 VALUES(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL)
 ON CONFLICT(user_id,device_id) DO UPDATE SET
  is_active=true,is_writer=false,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,
  session_generation=public.mahjong_device_sessions.session_generation+1,
  session_token_hash=NULL,revoked_at=NULL,last_seen_at=now(),updated_at=now()
 RETURNING * INTO v_lease;
 INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
 VALUES(v_uid,v_uid,p_device_id,'reader-open',jsonb_build_object('game_id',v_game.id));
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',false,'generation',v_lease.session_generation);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open_reader(uuid) TO authenticated;

-- Read-only preflight: verify the exact Supabase Auth session and account status.
-- This does not create a device session, rotate a token, or modify game state.
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
    AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
 INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid;
 IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL
    OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM auth.sessions newer JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- A displaced old login must not resume metadata reads after the newer
 -- Auth session expires. The historical writer lease is the high-water mark.
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM public.mahjong_device_sessions prior
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision);
END; $$;
-- Read-only refresh for an already opened device session. Unlike peek, this
-- requires a registered, active lease for this exact Supabase Auth session.
-- It never grants writer privileges or rotates writer credentials.
CREATE OR REPLACE FUNCTION public.mahjong_sync_read(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid;
 v_game public.mahjong_game_states%ROWTYPE; v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- A newer login invalidates an older scorekeeper session unless explicitly
 -- allowed by administrator, even if its old lease has not yet been revoked.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active=true
   AND revoked_at IS NULL AND auth_session_id=v_auth_session;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 -- A reader lease is not a permanent entitlement. If the administrator
 -- disables multi-device access, reject previously enrolled reader sessions
 -- immediately instead of allowing continued cloud reads.
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
      AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',v_lease.is_writer
   AND v_lease.session_token_hash IS NOT NULL
   AND v_lease.session_generation>0
   AND v_game.writer_session_id=v_lease.id);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_read(uuid) TO authenticated;

-- Lightweight lease probe for foreground/periodic client checks. A stale device
-- must learn that its writer lease was revoked without waiting for a score edit.
-- This is advisory UI state; commit() remains the server-side security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_lease_status(p_device_id uuid,p_generation bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_auth_session uuid; v_lease public.mahjong_device_sessions%ROWTYPE;
 v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_generation<1 THEN
  RAISE EXCEPTION 'Authentication and valid lease identity required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
  RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND auth_session_id=v_auth_session
   AND session_generation=p_generation AND is_active=true AND revoked_at IS NULL;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked'); END IF;
 RETURN jsonb_build_object('ok',true,'canWrite',v_lease.is_writer
  AND v_lease.session_token_hash IS NOT NULL
  AND v_game.writer_session_id=v_lease.id,
  'gameId',v_game.id,'revision',v_game.revision);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;

-- ROLLBACK-ONLY TEST ASSERTIONS (no persistent schema/data changes)
DO $gate$
DECLARE v_count integer; v_exposed integer;
BEGIN
 SELECT count(*) INTO v_count FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND p.prosecdef AND EXISTS (SELECT 1 FROM unnest(COALESCE(p.proconfig, ARRAY[]::text[])) AS cfg(value) WHERE cfg.value IN ('search_path=', 'search_path=""'));
 IF v_count <> 5 THEN RAISE EXCEPTION 'RPC SECURITY GATE FAIL: expected 5 secure definer functions, found %',v_count; END IF;
 SELECT count(*) INTO v_exposed FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND (has_function_privilege('anon',p.oid,'EXECUTE') OR NOT has_function_privilege('authenticated',p.oid,'EXECUTE'));
 IF v_exposed <> 0 THEN RAISE EXCEPTION 'RPC GRANTS GATE FAIL: % functions exposed or missing auth grant',v_exposed; END IF;
 RAISE NOTICE 'PASS: five RPCs compiled, SECURITY DEFINER/search_path hardened, authenticated-only EXECUTE; ROLLBACK pending';
END $gate$;

ROLLBACK;

```

## supabase_sync_stage14_install_readiness_readonly.sql

```sql
-- Mahjong Score v15.7.15 / Stage 14-16
-- READ ONLY. Checks live dependencies before any RPC installation.
-- Never paste secret tokens or passwords into SQL Editor.
BEGIN TRANSACTION READ ONLY;
SELECT 'required_extension_digest' AS check_name,
 EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='extensions' AND p.proname='digest' AND pg_get_function_identity_arguments(p.oid)='text, text') AS passed
UNION ALL SELECT 'auth_sessions_created_at', EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='auth' AND table_name='sessions' AND column_name='created_at')
UNION ALL SELECT 'device_session_auth_timestamp', EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='mahjong_device_sessions' AND column_name='auth_session_created_at')
UNION ALL SELECT 'device_session_ever_writer', EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='mahjong_device_sessions' AND column_name='ever_writer')
UNION ALL SELECT 'game_current_default_true', EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='mahjong_game_states' AND column_name='is_current' AND column_default='true')
UNION ALL SELECT 'no_existing_device_sessions', NOT EXISTS (SELECT 1 FROM public.mahjong_device_sessions)
UNION ALL SELECT 'no_existing_sync_conflicts', NOT EXISTS (SELECT 1 FROM public.mahjong_sync_conflicts)
UNION ALL SELECT 'sync_open_absent', NOT EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='mahjong_sync_open');
COMMIT;

```

## supabase_sync_stage14_rpc_signature_readonly.sql

```sql
-- Stage 14: READ ONLY pg_proc signature inventory. No schema/data changes.
-- Export the resulting JSON array and feed it to stage14-review-rpc-overloads.cjs.
-- search_path_safe is conservative: only explicitly fixed pg_catalog/public paths pass.
WITH target(name) AS (VALUES
 ('mahjong_sync_open'),('mahjong_sync_commit'),('mahjong_sync_open_reader'),
 ('mahjong_sync_read'),('mahjong_sync_lease_status')
), inventory AS (
 SELECT n.nspname AS schema_name, p.proname AS function_name,
 pg_get_function_identity_arguments(p.oid) AS identity_arguments,
 p.prokind AS function_kind, p.prosecdef AS security_definer,
 EXISTS (
  SELECT 1 FROM unnest(coalesce(p.proconfig,ARRAY[]::text[])) AS cfg(setting)
  WHERE setting IN ('search_path=pg_catalog, public','search_path=pg_catalog,public',
                    'search_path=public, pg_catalog','search_path=public,pg_catalog',
                    'search_path=pg_catalog')
 ) AS search_path_safe
 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 JOIN target t ON t.name=p.proname
)
SELECT coalesce(jsonb_agg(to_jsonb(inventory) ORDER BY schema_name,function_name,identity_arguments),'[]'::jsonb)
AS rpc_signature_evidence FROM inventory;

```

## supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql

```sql
-- STAGE14 AUTOMATIC TRANSFER CANDIDATE — NOT FOR PRODUCTION.
-- Existing Supabase project only: requires isolated test accounts and two-device verification.
-- Depends on v15.7.14 foundation tables.
-- FAIL-CLOSED: token issuance and authentication not yet integrated.
-- This file is deliberately NOT executable in production.
-- REVIEW: existing auth.sessions created_at ordering alone is insufficient to prove
-- the new session owns the writer lease; auth session ID must match on every commit.
DO $$ BEGIN RAISE EXCEPTION 'UNSAFE DRAFT: do not deploy; session-token validation incomplete'; END $$;
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
-- Preserve historical writer binding independently of read-only enrollments.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false;
-- Match the guarded alignment candidate: never auto-promote legacy games.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
-- ADD COLUMN IF NOT EXISTS does not alter an existing DEFAULT true.
-- Explicitly align future implicit inserts; do not rewrite existing game rows.
ALTER TABLE public.mahjong_game_states ALTER COLUMN is_current SET DEFAULT false;
-- Existing verified index: mahjong_one_current_game_per_owner (owner_id WHERE is_current = true).
-- Do not create an equivalent second index here: fail closed until the
-- foundation migration is independently verified in the target environment.

-- Server-side schema validation mirrors the essential four-player client invariants.
-- Do not trust a browser-side validator as a security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN false
  WHEN jsonb_array_length(p_game->'history')>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(trim(leading '-' from x::text))>12) THEN false
  WHEN p_game ? 'roundWind' AND (jsonb_typeof(p_game->'roundWind') IS DISTINCT FROM 'number'
    OR (p_game->>'roundWind') !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (jsonb_typeof(p_game->'seatWinds') IS DISTINCT FROM 'array'
    OR (CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN jsonb_array_length(p_game->'seatWinds') ELSE NULL END)<>4) THEN false
  WHEN p_game ? 'seatWinds' AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number' OR x::text !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (SELECT count(DISTINCT x) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x)<>4 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'object') THEN false
  -- Keep server-side history checks aligned with the client recovery ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE (x ? 'delta' AND (jsonb_typeof(x->'delta') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN jsonb_array_length(x->'delta') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'quads' AND (jsonb_typeof(x->'quads') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN jsonb_array_length(x->'quads') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN x->'quads' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-4]$')))
    OR (x ? 'winner' AND x->'winner'<>'null'::jsonb AND (jsonb_typeof(x->'winner') IS DISTINCT FROM 'number' OR x->>'winner' !~ '^[0-3]$'))
    OR (x ? 'dealer' AND x->'dealer'<>'null'::jsonb AND (jsonb_typeof(x->'dealer') IS DISTINCT FROM 'number' OR x->>'dealer' !~ '^[0-3]$'))
    OR (x ? 'discarder' AND x->'discarder'<>'null'::jsonb AND (jsonb_typeof(x->'discarder') IS DISTINCT FROM 'number' OR x->>'discarder' !~ '^[0-3]$'))
    OR (x ? 'roundWind' AND (jsonb_typeof(x->'roundWind') IS DISTINCT FROM 'number' OR x->>'roundWind' !~ '^[0-3]$'))
    OR (x ? 'method' AND jsonb_typeof(x->'method') IS DISTINCT FROM 'string')
    OR (x ? 'playerPatterns' AND (jsonb_typeof(x->'playerPatterns') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN jsonb_array_length(x->'playerPatterns') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN x->'playerPatterns' ELSE '[]'::jsonb END) p WHERE p <> 'null'::jsonb AND
       (jsonb_typeof(p) IS DISTINCT FROM 'object' OR jsonb_typeof(p->'name') IS DISTINCT FROM 'string'
        OR length(p->>'name')>100 OR jsonb_typeof(p->'points') IS DISTINCT FROM 'number'
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM p->>'points'))>12))))
    OR (x ? 'patterns' AND (jsonb_typeof(x->'patterns') IS DISTINCT FROM 'array'
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'patterns') = 'array' THEN x->'patterns' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string')))
    OR (x ? 'seatWindsBefore' AND (jsonb_typeof(x->'seatWindsBefore') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN jsonb_array_length(x->'seatWindsBefore') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-3]$')
      OR (SELECT count(DISTINCT n) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n)<>4))
    OR (x ? 'namesAtTime' AND (jsonb_typeof(x->'namesAtTime') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN jsonb_array_length(x->'namesAtTime') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN x->'namesAtTime' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string' OR length(n #>> '{}')>100)))
  ) THEN false

  ELSE true END;
$$;
REVOKE ALL ON FUNCTION public.mahjong_sync_valid_game(jsonb) FROM PUBLIC,anon,authenticated;

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid; v_auth_created_at timestamptz;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT created_at INTO v_auth_created_at FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid;
  IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  IF v_token IS NULL OR v_token !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Token generator contract invalid' USING ERRCODE='22023';
  END IF;
  -- NULL means this device has no local game to upload. It may adopt an existing
  -- cloud game, but must never create an empty cloud game implicitly.
  IF p_local_game IS NOT NULL AND NOT public.mahjong_sync_valid_game(p_local_game)
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Revalidate the caller's Auth session AFTER acquiring the account lock.
  -- A pre-lock lookup alone cannot establish that the session remains eligible.
  IF NOT EXISTS (
    SELECT 1 FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid
      AND created_at=v_auth_created_at
      AND (not_after IS NULL OR not_after>clock_timestamp())
  ) THEN
    RAISE EXCEPTION 'Auth session expired or removed during takeover' USING ERRCODE='28000';
  END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  -- Persistent high-water mark: a displaced older Auth session must not
  -- reclaim the writer lease even after the newer Auth session expires or
  -- its auth.sessions row is deleted. Keep historical device rows for this guard.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501';
  END IF;
  -- Do not downgrade the persistent login high-water mark when an admin or
  -- multi-device scorekeeper reuses a device ID from an older Auth session.
  -- This also matters if multi-device permission is disabled later.
  IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
      AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','newer-login');
  END IF;
  -- A caller that supplied a preflight identity must match it regardless
  -- of whether it is adopting cloud data or already holds a local copy.
  -- Otherwise a stale client can take over a different current game.
  IF p_expected_revision IS NOT NULL AND p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Expected revision must not be negative';
  END IF;
  IF (p_expected_revision IS NULL) IS DISTINCT FROM (p_expected_game_id IS NULL) THEN
    RAISE EXCEPTION 'Both expected game ID and revision are required together';
  END IF;
  -- STAGE14 CANDIDATE: an authenticated newer session may take over a
  -- different device after matching cloud game identity/revision below.
  -- The older session is revoked only after all preflight checks pass.
  -- Safety preflight: never revoke an existing writer before checking whether
  -- this device has a different game. The client must reconcile explicitly.
  -- A rejected takeover must leave the current writer fully operational.
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  -- Existing cloud state always requires a matching preflight, even when
  -- the caller submits an identical local snapshot. Otherwise a stale client
  -- could rotate the writer lease without first observing the current revision.
  IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  IF FOUND AND p_expected_game_id IS NOT NULL AND
     (v_game.id IS DISTINCT FROM p_expected_game_id OR
      v_game.revision IS DISTINCT FROM p_expected_revision) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- Compare local payload only after validating the cloud identity/revision.
  -- A stale preflight must not receive the full current game snapshot via
  -- the mismatch response; it must refresh and reconcile explicitly.
  IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN
    RETURN jsonb_build_object('ok',false,'reason','local-cloud-mismatch',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A takeover that adopts cloud state must be based on a prior read of its
  -- exact revision. This prevents a concurrent commit between peek and open
  -- from silently changing the state accepted by the new device.
  IF FOUND AND p_local_game IS NULL AND
     (p_expected_revision IS NULL OR p_expected_revision IS DISTINCT FROM v_game.revision
      OR p_expected_game_id IS NULL OR p_expected_game_id IS DISTINCT FROM v_game.id) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A prior peek that saw a cloud game must never fall back to creating a
  -- new game if the original game disappeared or was replaced in the interim.
  -- This is a preflight failure, not permission to bootstrap new cloud state.
  IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed');
  END IF;
  IF NOT FOUND AND p_local_game IS NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','no-cloud-game');
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      -- Revoke the credential itself, not just the writer flag. A displaced
      -- device must never retain a reusable token hash in the database.
      session_token_hash=NULL,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,ever_writer)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,v_auth_created_at,encode(extensions.digest(v_token,'sha256'),'hex'),true)
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,ever_writer=true,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id,is_current)
    VALUES(v_uid,p_local_game,0,v_session.id,true) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF NOT public.mahjong_sync_valid_game(p_game)
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Recheck Auth session under the same account lock used by takeover.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at IS NOT NULL
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during commit' USING ERRCODE='28000'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 -- Persistent login high-water guard also protects writes when the newer
 -- Auth session has expired or disappeared. A stale writer token alone is
 -- insufficient to prove that an older login still owns the account.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
   JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.auth_session_created_at IS NOT NULL
     AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 -- STAGE14: no historical device binding at commit; enforce current
 -- Auth session, writer lease, generation and token below instead.
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   -- A revoked or displaced device is no longer authorized to submit game
   -- payloads. Do not persist its proposed snapshot in the conflict ledger:
   -- that would permit repeated rejected writes to fill server storage.
   -- Only an authenticated CURRENT writer may record a revision conflict.
   IF v_reason='revision-conflict' THEN
     INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
       VALUES(v_game.id,v_uid,p_device_id,p_base_revision,p_game,v_reason);
   END IF;
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

-- Explicit reader enrollment. A read-only device must never call mahjong_sync_open,
-- because that operation transfers the sole writer lease.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_auth_created_at timestamptz;
 v_game public.mahjong_game_states%ROWTYPE;
 v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT created_at INTO v_auth_created_at FROM auth.sessions
  WHERE id=v_auth_session AND user_id=v_uid;
 IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
 -- Serialize with writer takeovers and commits for this account.
 SELECT raw_app_meta_data->>'role',
  COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false),
  banned_until,deleted_at INTO v_role,v_multi,v_banned,v_deleted
 FROM auth.users WHERE id=v_uid FOR UPDATE;
 IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL
  OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Reader enrollment also must not rely only on pre-lock Auth checks.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at=v_auth_created_at
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during reader open' USING ERRCODE='28000'; END IF;
 IF v_role<>'admin' AND NOT v_multi THEN
  RAISE EXCEPTION 'Multi-device reading not permitted' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 -- Never replace a newer recorded Auth session with an older one on a
 -- reused device ID. That would erase the persistent takeover high-water
 -- mark if multi-device access is subsequently disabled.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
  WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','newer-login');
 END IF;
 -- Never downgrade a current writer on this device. Require a separate
 -- device ID for a read-only enrollment, rather than clobber its token.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active AND is_writer
   AND revoked_at IS NULL) THEN
  RETURN jsonb_build_object('ok',false,'reason','device-already-writer');
 END IF;
 INSERT INTO public.mahjong_device_sessions
  (user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,revoked_at)
 VALUES(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL)
 ON CONFLICT(user_id,device_id) DO UPDATE SET
  is_active=true,is_writer=false,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,
  session_generation=public.mahjong_device_sessions.session_generation+1,
  session_token_hash=NULL,revoked_at=NULL,last_seen_at=now(),updated_at=now()
 RETURNING * INTO v_lease;
 INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
 VALUES(v_uid,v_uid,p_device_id,'reader-open',jsonb_build_object('game_id',v_game.id));
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',false,'generation',v_lease.session_generation);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open_reader(uuid) TO authenticated;

-- Read-only preflight: verify the exact Supabase Auth session and account status.
-- This does not create a device session, rotate a token, or modify game state.
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
    AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
 INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid;
 IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL
    OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM auth.sessions newer JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- A displaced old login must not resume metadata reads after the newer
 -- Auth session expires. The historical writer lease is the high-water mark.
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM public.mahjong_device_sessions prior
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision);
END; $$;
-- Read-only refresh for an already opened device session. Unlike peek, this
-- requires a registered, active lease for this exact Supabase Auth session.
-- It never grants writer privileges or rotates writer credentials.
CREATE OR REPLACE FUNCTION public.mahjong_sync_read(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid;
 v_game public.mahjong_game_states%ROWTYPE; v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- A newer login invalidates an older scorekeeper session unless explicitly
 -- allowed by administrator, even if its old lease has not yet been revoked.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active=true
   AND revoked_at IS NULL AND auth_session_id=v_auth_session;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 -- A reader lease is not a permanent entitlement. If the administrator
 -- disables multi-device access, reject previously enrolled reader sessions
 -- immediately instead of allowing continued cloud reads.
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
      AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',v_lease.is_writer
   AND v_lease.session_token_hash IS NOT NULL
   AND v_lease.session_generation>0
   AND v_game.writer_session_id=v_lease.id);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_read(uuid) TO authenticated;

-- Lightweight lease probe for foreground/periodic client checks. A stale device
-- must learn that its writer lease was revoked without waiting for a score edit.
-- This is advisory UI state; commit() remains the server-side security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_lease_status(p_device_id uuid,p_generation bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_auth_session uuid; v_lease public.mahjong_device_sessions%ROWTYPE;
 v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_generation<1 THEN
  RAISE EXCEPTION 'Authentication and valid lease identity required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
  RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND auth_session_id=v_auth_session
   AND session_generation=p_generation AND is_active=true AND revoked_at IS NULL;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked'); END IF;
 RETURN jsonb_build_object('ok',true,'canWrite',v_lease.is_writer
  AND v_lease.session_token_hash IS NOT NULL
  AND v_game.writer_session_id=v_lease.id,
  'gameId',v_game.id,'revision',v_game.revision);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;
COMMIT;

```

## supabase_sync_stage14_writer_lifecycle_ROLLBACK_ONLY.sql

```sql
-- ROLLBACK-ONLY RPC INTEGRATION TEST: NEVER DEPLOY.
-- All CREATE/ALTER/GRANT statements are transaction-scoped and rolled back.
-- Existing Supabase project only: requires isolated test accounts and two-device verification.
-- Depends on v15.7.14 foundation tables.
-- FAIL-CLOSED: token issuance and authentication not yet integrated.
-- This file is deliberately NOT executable in production.
-- REVIEW: existing auth.sessions created_at ordering alone is insufficient to prove
-- the new session owns the writer lease; auth session ID must match on every commit.
BEGIN;
-- Bind each device lease to the actual Supabase Auth session that opened it.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_id uuid;
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz;
-- Preserve historical writer binding independently of read-only enrollments.
ALTER TABLE public.mahjong_device_sessions
  ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false;
-- Match the guarded alignment candidate: never auto-promote legacy games.
ALTER TABLE public.mahjong_game_states ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false;
-- ADD COLUMN IF NOT EXISTS does not alter an existing DEFAULT true.
-- Explicitly align future implicit inserts; do not rewrite existing game rows.
ALTER TABLE public.mahjong_game_states ALTER COLUMN is_current SET DEFAULT false;
-- Existing verified index: mahjong_one_current_game_per_owner (owner_id WHERE is_current = true).
-- Do not create an equivalent second index here: fail closed until the
-- foundation migration is independently verified in the target environment.

-- Server-side schema validation mirrors the essential four-player client invariants.
-- Do not trust a browser-side validator as a security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game(p_game jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
 SELECT CASE WHEN jsonb_typeof(p_game) IS DISTINCT FROM 'object' OR octet_length(p_game::text)>2000000 THEN false
  WHEN jsonb_typeof(p_game->'names') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN jsonb_array_length(p_game->'names') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'scores') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN jsonb_array_length(p_game->'scores') ELSE NULL END)<>4 THEN false
  WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN false
  WHEN jsonb_array_length(p_game->'history')>20000 THEN false
  WHEN jsonb_typeof(p_game->'dealer') IS DISTINCT FROM 'number' OR (p_game->>'dealer') !~ '^[0-3]$' THEN false
  WHEN jsonb_typeof(p_game->'round') IS DISTINCT FROM 'number' OR (p_game->>'round') !~ '^[1-9][0-9]*$' OR length(p_game->>'round')>15 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'names') = 'array' THEN p_game->'names' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'string' OR length(x #>> '{}')>100) THEN false
  -- Score totals must be bounded integers; fractional or exponential payloads
  -- are not valid Mahjong score totals and must never enter the cloud ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'scores') = 'array' THEN p_game->'scores' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number'
      OR x::text !~ '^-?[0-9]+$'
      OR length(trim(leading '-' from x::text))>12) THEN false
  WHEN p_game ? 'roundWind' AND (jsonb_typeof(p_game->'roundWind') IS DISTINCT FROM 'number'
    OR (p_game->>'roundWind') !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (jsonb_typeof(p_game->'seatWinds') IS DISTINCT FROM 'array'
    OR (CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN jsonb_array_length(p_game->'seatWinds') ELSE NULL END)<>4) THEN false
  WHEN p_game ? 'seatWinds' AND EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'number' OR x::text !~ '^[0-3]$') THEN false
  WHEN p_game ? 'seatWinds' AND (SELECT count(DISTINCT x) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'seatWinds') = 'array' THEN p_game->'seatWinds' ELSE '[]'::jsonb END) x)<>4 THEN false
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE jsonb_typeof(x) IS DISTINCT FROM 'object') THEN false
  -- Keep server-side history checks aligned with the client recovery ledger.
  WHEN EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_game->'history') = 'array' THEN p_game->'history' ELSE '[]'::jsonb END) x
    WHERE (x ? 'delta' AND (jsonb_typeof(x->'delta') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN jsonb_array_length(x->'delta') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'delta') = 'array' THEN x->'delta' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'before' AND (jsonb_typeof(x->'before') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'before') = 'array' THEN jsonb_array_length(x->'before') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'before') = 'array' THEN x->'before' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM n::text))>12)))
    OR (x ? 'quads' AND (jsonb_typeof(x->'quads') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN jsonb_array_length(x->'quads') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'quads') = 'array' THEN x->'quads' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-4]$')))
    OR (x ? 'winner' AND x->'winner'<>'null'::jsonb AND (jsonb_typeof(x->'winner') IS DISTINCT FROM 'number' OR x->>'winner' !~ '^[0-3]$'))
    OR (x ? 'dealer' AND x->'dealer'<>'null'::jsonb AND (jsonb_typeof(x->'dealer') IS DISTINCT FROM 'number' OR x->>'dealer' !~ '^[0-3]$'))
    OR (x ? 'discarder' AND x->'discarder'<>'null'::jsonb AND (jsonb_typeof(x->'discarder') IS DISTINCT FROM 'number' OR x->>'discarder' !~ '^[0-3]$'))
    OR (x ? 'roundWind' AND (jsonb_typeof(x->'roundWind') IS DISTINCT FROM 'number' OR x->>'roundWind' !~ '^[0-3]$'))
    OR (x ? 'method' AND jsonb_typeof(x->'method') IS DISTINCT FROM 'string')
    OR (x ? 'playerPatterns' AND (jsonb_typeof(x->'playerPatterns') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN jsonb_array_length(x->'playerPatterns') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'playerPatterns') = 'array' THEN x->'playerPatterns' ELSE '[]'::jsonb END) p WHERE p <> 'null'::jsonb AND
       (jsonb_typeof(p) IS DISTINCT FROM 'object' OR jsonb_typeof(p->'name') IS DISTINCT FROM 'string'
        OR length(p->>'name')>100 OR jsonb_typeof(p->'points') IS DISTINCT FROM 'number'
        OR (p->>'points') !~ '^-?[0-9]+$' OR length(trim(leading '-' FROM p->>'points'))>12))))
    OR (x ? 'patterns' AND (jsonb_typeof(x->'patterns') IS DISTINCT FROM 'array'
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'patterns') = 'array' THEN x->'patterns' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string')))
    OR (x ? 'seatWindsBefore' AND (jsonb_typeof(x->'seatWindsBefore') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN jsonb_array_length(x->'seatWindsBefore') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'number' OR n::text !~ '^[0-3]$')
      OR (SELECT count(DISTINCT n) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'seatWindsBefore') = 'array' THEN x->'seatWindsBefore' ELSE '[]'::jsonb END) n)<>4))
    OR (x ? 'namesAtTime' AND (jsonb_typeof(x->'namesAtTime') IS DISTINCT FROM 'array' OR (CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN jsonb_array_length(x->'namesAtTime') ELSE NULL END)<>4
      OR EXISTS (SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(x->'namesAtTime') = 'array' THEN x->'namesAtTime' ELSE '[]'::jsonb END) n WHERE jsonb_typeof(n) IS DISTINCT FROM 'string' OR length(n #>> '{}')>100)))
  ) THEN false

  ELSE true END;
$$;
REVOKE ALL ON FUNCTION public.mahjong_sync_valid_game(jsonb) FROM PUBLIC,anon,authenticated;

-- Only one writer at a time, even when account has multiple signed-in devices.
-- Row-level owner lock serializes takeovers and prevents dual-writer races.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid(); v_role text; v_multi boolean; v_banned timestamptz; v_deleted timestamptz; v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_previous uuid; v_token text; v_auth_session uuid; v_auth_created_at timestamptz;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_device_id IS NULL THEN RAISE EXCEPTION 'Device identifier required'; END IF;
  -- Reject callers without a currently valid auth session before acquiring locks.
  v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
  IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
    RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
  SELECT created_at INTO v_auth_created_at FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid;
  IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
  v_token := public.mahjong_sync_generate_token();
  IF v_token IS NULL OR v_token !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Token generator contract invalid' USING ERRCODE='22023';
  END IF;
  -- NULL means this device has no local game to upload. It may adopt an existing
  -- cloud game, but must never create an empty cloud game implicitly.
  IF p_local_game IS NOT NULL AND NOT public.mahjong_sync_valid_game(p_local_game)
    THEN RAISE EXCEPTION 'Invalid initial game'; END IF;
  -- Lock the auth.users row to serialize all sessions for the same account.
  SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
    INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid FOR UPDATE;
  IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now())
    THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
  -- Revalidate the caller's Auth session AFTER acquiring the account lock.
  -- A pre-lock lookup alone cannot establish that the session remains eligible.
  IF NOT EXISTS (
    SELECT 1 FROM auth.sessions
    WHERE id=v_auth_session AND user_id=v_uid
      AND created_at=v_auth_created_at
      AND (not_after IS NULL OR not_after>clock_timestamp())
  ) THEN
    RAISE EXCEPTION 'Auth session expired or removed during takeover' USING ERRCODE='28000';
  END IF;
  -- Only single-device scorekeepers are barred from reclaiming a lease with an older Auth session.
  -- Admins and explicitly multi-device scorekeepers may keep multiple Auth sessions.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM auth.sessions newer
    JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
    WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
      AND (newer.not_after IS NULL OR newer.not_after>now())
  ) THEN
    RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
  END IF;
  -- Persistent high-water mark: a displaced older Auth session must not
  -- reclaim the writer lease even after the newer Auth session expires or
  -- its auth.sessions row is deleted. Keep historical device rows for this guard.
  IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
    SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501';
  END IF;
  -- Do not downgrade the persistent login high-water mark when an admin or
  -- multi-device scorekeeper reuses a device ID from an older Auth session.
  -- This also matters if multi-device permission is disabled later.
  IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
    WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
      AND prior.auth_session_created_at IS NOT NULL
      AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
  ) THEN
    RETURN jsonb_build_object('ok',false,'reason','newer-login');
  END IF;
  -- A caller that supplied a preflight identity must match it regardless
  -- of whether it is adopting cloud data or already holds a local copy.
  -- Otherwise a stale client can take over a different current game.
  IF p_expected_revision IS NOT NULL AND p_expected_revision < 0 THEN
    RAISE EXCEPTION 'Expected revision must not be negative';
  END IF;
  IF (p_expected_revision IS NULL) IS DISTINCT FROM (p_expected_game_id IS NULL) THEN
    RAISE EXCEPTION 'Both expected game ID and revision are required together';
  END IF;
  -- STAGE14 CANDIDATE: an authenticated newer session may take over a
  -- different device after matching cloud game identity/revision below.
  -- The older session is revoked only after all preflight checks pass.
  -- Safety preflight: never revoke an existing writer before checking whether
  -- this device has a different game. The client must reconcile explicitly.
  -- A rejected takeover must leave the current writer fully operational.
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  -- Existing cloud state always requires a matching preflight, even when
  -- the caller submits an identical local snapshot. Otherwise a stale client
  -- could rotate the writer lease without first observing the current revision.
  IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  IF FOUND AND p_expected_game_id IS NOT NULL AND
     (v_game.id IS DISTINCT FROM p_expected_game_id OR
      v_game.revision IS DISTINCT FROM p_expected_revision) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- Compare local payload only after validating the cloud identity/revision.
  -- A stale preflight must not receive the full current game snapshot via
  -- the mismatch response; it must refresh and reconcile explicitly.
  IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN
    RETURN jsonb_build_object('ok',false,'reason','local-cloud-mismatch',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A takeover that adopts cloud state must be based on a prior read of its
  -- exact revision. This prevents a concurrent commit between peek and open
  -- from silently changing the state accepted by the new device.
  IF FOUND AND p_local_game IS NULL AND
     (p_expected_revision IS NULL OR p_expected_revision IS DISTINCT FROM v_game.revision
      OR p_expected_game_id IS NULL OR p_expected_game_id IS DISTINCT FROM v_game.id) THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed',
      'gameId',v_game.id,'revision',v_game.revision);
  END IF;
  -- A prior peek that saw a cloud game must never fall back to creating a
  -- new game if the original game disappeared or was replaced in the interim.
  -- This is a preflight failure, not permission to bootstrap new cloud state.
  IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','cloud-revision-changed');
  END IF;
  IF NOT FOUND AND p_local_game IS NULL THEN
    RETURN jsonb_build_object('ok',false,'reason','no-cloud-game');
  END IF;
  SELECT id INTO v_previous FROM public.mahjong_device_sessions
    WHERE user_id=v_uid AND is_active AND device_id<>p_device_id LIMIT 1;
  -- Even for multi-device accounts, revoke previous writer rights atomically.
  UPDATE public.mahjong_device_sessions SET is_writer=false,
      -- Revoke the credential itself, not just the writer flag. A displaced
      -- device must never retain a reusable token hash in the database.
      session_token_hash=NULL,
      is_active=CASE WHEN v_role='admin' OR v_multi THEN is_active ELSE false END,
      revoked_at=CASE WHEN v_role='admin' OR v_multi THEN revoked_at ELSE now() END,
      updated_at=now()
    WHERE user_id=v_uid AND is_active AND (device_id<>p_device_id OR auth_session_id IS DISTINCT FROM v_auth_session);
  -- Token is rotated on each device open; stale holders cannot commit.
  INSERT INTO public.mahjong_device_sessions(user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,ever_writer)
    VALUES(v_uid,p_device_id,true,true,1,v_auth_session,v_auth_created_at,encode(extensions.digest(v_token,'sha256'),'hex'),true)
    ON CONFLICT(user_id,device_id) DO UPDATE SET
      is_active=true,is_writer=true,ever_writer=true,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,revoked_at=null,session_generation=public.mahjong_device_sessions.session_generation+1,
      session_token_hash=encode(extensions.digest(v_token,'sha256'),'hex'),last_seen_at=now(),updated_at=now()
    RETURNING * INTO v_session;
  SELECT * INTO v_game FROM public.mahjong_game_states
    WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.mahjong_game_states(owner_id,game_data,revision,writer_session_id,is_current)
    VALUES(v_uid,p_local_game,0,v_session.id,true) RETURNING * INTO v_game;
  ELSE
    UPDATE public.mahjong_game_states SET writer_session_id=v_session.id,updated_at=now()
      WHERE id=v_game.id;
  END IF;
  INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
    VALUES(v_uid,v_uid,p_device_id,'session-open',jsonb_build_object('previous_session',v_previous,'game_id',v_game.id));
  RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
    'writerToken',v_token,'generation',v_session.session_generation,'canWrite',true,'game',v_game.game_data);
END; $$;

CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(
 p_game_id uuid,p_device_id uuid,p_generation bigint,p_token text,p_base_revision bigint,p_game jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_session public.mahjong_device_sessions%ROWTYPE;
  v_game public.mahjong_game_states%ROWTYPE; v_reason text; v_auth_session uuid;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
   RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 IF p_game_id IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_token IS NULL OR p_base_revision IS NULL
   THEN RAISE EXCEPTION 'Invalid commit arguments'; END IF;
 IF p_generation < 1 OR p_base_revision < 0 OR length(p_token) <> 64 OR p_token !~ '^[0-9a-f]{64}$'
   THEN RAISE EXCEPTION 'Invalid session token or revision'; END IF;
 IF NOT public.mahjong_sync_valid_game(p_game)
   THEN RAISE EXCEPTION 'Invalid game payload'; END IF;
 -- Owner row lock serializes this commit with concurrent device takeovers.
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
   AND (banned_until IS NULL OR banned_until <= now())
   AND raw_app_meta_data->>'role' IN ('admin','scorekeeper') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Recheck Auth session under the same account lock used by takeover.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at IS NOT NULL
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during commit' USING ERRCODE='28000'; END IF;
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions newer ON newer.user_id=u.id
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
     AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN
   RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501';
 END IF;
 -- Persistent login high-water guard also protects writes when the newer
 -- Auth session has expired or disappeared. A stale writer token alone is
 -- insufficient to prove that an older login still owns the account.
 IF EXISTS (
   SELECT 1 FROM auth.users u
   JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
   JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
   WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
     AND prior.auth_session_created_at IS NOT NULL
     AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 -- STAGE14: no historical device binding at commit; enforce current
 -- Auth session, writer lease, generation and token below instead.
 SELECT * INTO v_game FROM public.mahjong_game_states
   WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','game-not-found'); END IF;
 SELECT * INTO v_session FROM public.mahjong_device_sessions
   WHERE user_id=v_uid AND device_id=p_device_id;
 IF NOT FOUND OR NOT v_session.is_active OR NOT v_session.is_writer OR v_session.revoked_at IS NOT NULL
   OR v_session.session_token_hash IS DISTINCT FROM encode(extensions.digest(p_token,'sha256'),'hex')
   OR v_session.session_generation<>p_generation
   OR v_session.auth_session_id IS DISTINCT FROM v_auth_session
   OR v_game.writer_session_id IS DISTINCT FROM v_session.id THEN
    v_reason:='writer-revoked';
 ELSIF v_game.revision<>p_base_revision THEN v_reason:='revision-conflict';
 END IF;
 IF v_reason IS NOT NULL THEN
   -- A revoked or displaced device is no longer authorized to submit game
   -- payloads. Do not persist its proposed snapshot in the conflict ledger:
   -- that would permit repeated rejected writes to fill server storage.
   -- Only an authenticated CURRENT writer may record a revision conflict.
   IF v_reason='revision-conflict' THEN
     INSERT INTO public.mahjong_sync_conflicts(game_id,user_id,device_id,base_revision,proposed_game_data,reason)
       VALUES(v_game.id,v_uid,p_device_id,p_base_revision,p_game,v_reason);
   END IF;
   RETURN jsonb_build_object('ok',false,'reason',v_reason,'cloudRevision',v_game.revision);
 END IF;
 UPDATE public.mahjong_game_states
   SET game_data=p_game,revision=revision+1,updated_at=now() WHERE id=v_game.id;
 UPDATE public.mahjong_device_sessions SET last_seen_at=now(),updated_at=now() WHERE id=v_session.id;
 RETURN jsonb_build_object('ok',true,'revision',v_game.revision+1);
END; $$;

-- Explicit reader enrollment. A read-only device must never call mahjong_sync_open,
-- because that operation transfers the sole writer lease.
CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_auth_created_at timestamptz;
 v_game public.mahjong_game_states%ROWTYPE;
 v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT created_at INTO v_auth_created_at FROM auth.sessions
  WHERE id=v_auth_session AND user_id=v_uid;
 IF v_auth_created_at IS NULL THEN RAISE EXCEPTION 'Auth session timestamp unavailable' USING ERRCODE='28000'; END IF;
 -- Serialize with writer takeovers and commits for this account.
 SELECT raw_app_meta_data->>'role',
  COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false),
  banned_until,deleted_at INTO v_role,v_multi,v_banned,v_deleted
 FROM auth.users WHERE id=v_uid FOR UPDATE;
 IF v_role NOT IN ('admin','scorekeeper') OR v_role IS NULL
  OR v_deleted IS NOT NULL OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- Reader enrollment also must not rely only on pre-lock Auth checks.
 IF NOT EXISTS (
   SELECT 1 FROM auth.sessions
   WHERE id=v_auth_session AND user_id=v_uid
     AND created_at=v_auth_created_at
     AND (not_after IS NULL OR not_after>clock_timestamp())
 ) THEN RAISE EXCEPTION 'Auth session expired or removed during reader open' USING ERRCODE='28000'; END IF;
 IF v_role<>'admin' AND NOT v_multi THEN
  RAISE EXCEPTION 'Multi-device reading not permitted' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 -- Never replace a newer recorded Auth session with an older one on a
 -- reused device ID. That would erase the persistent takeover high-water
 -- mark if multi-device access is subsequently disabled.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions prior
  WHERE prior.user_id=v_uid AND prior.device_id=p_device_id
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(v_auth_created_at,v_auth_session))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','newer-login');
 END IF;
 -- Never downgrade a current writer on this device. Require a separate
 -- device ID for a read-only enrollment, rather than clobber its token.
 IF EXISTS (SELECT 1 FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active AND is_writer
   AND revoked_at IS NULL) THEN
  RETURN jsonb_build_object('ok',false,'reason','device-already-writer');
 END IF;
 INSERT INTO public.mahjong_device_sessions
  (user_id,device_id,is_active,is_writer,session_generation,auth_session_id,auth_session_created_at,session_token_hash,revoked_at)
 VALUES(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL)
 ON CONFLICT(user_id,device_id) DO UPDATE SET
  is_active=true,is_writer=false,auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at,
  session_generation=public.mahjong_device_sessions.session_generation+1,
  session_token_hash=NULL,revoked_at=NULL,last_seen_at=now(),updated_at=now()
 RETURNING * INTO v_lease;
 INSERT INTO public.mahjong_session_audit(actor_id,subject_id,device_id,event_type,details)
 VALUES(v_uid,v_uid,p_device_id,'reader-open',jsonb_build_object('game_id',v_game.id));
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',false,'generation',v_lease.session_generation);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open_reader(uuid) TO authenticated;

-- Read-only preflight: verify the exact Supabase Auth session and account status.
-- This does not create a device session, rotate a token, or modify game state.
CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid; v_role text; v_multi boolean;
 v_banned timestamptz; v_deleted timestamptz; v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
    AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 SELECT raw_app_meta_data->>'role', COALESCE((raw_app_meta_data->>'mahjong_multi_device')::boolean,false), banned_until, deleted_at
 INTO v_role,v_multi,v_banned,v_deleted FROM auth.users WHERE id=v_uid;
 IF v_role IS NULL OR v_role NOT IN ('admin','scorekeeper') OR v_deleted IS NOT NULL
    OR (v_banned IS NOT NULL AND v_banned>now()) THEN
  RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM auth.sessions newer JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE newer.user_id=v_uid AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- A displaced old login must not resume metadata reads after the newer
 -- Auth session expires. The historical writer lease is the high-water mark.
 IF v_role='scorekeeper' AND NOT v_multi AND EXISTS (
  SELECT 1 FROM public.mahjong_device_sessions prior
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE prior.user_id=v_uid AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RAISE EXCEPTION 'A newer login previously took ownership' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision);
END; $$;
-- Read-only refresh for an already opened device session. Unlike peek, this
-- requires a registered, active lease for this exact Supabase Auth session.
-- It never grants writer privileges or rotates writer credentials.
CREATE OR REPLACE FUNCTION public.mahjong_sync_read(p_device_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_uid uuid := auth.uid(); v_auth_session uuid;
 v_game public.mahjong_game_states%ROWTYPE; v_lease public.mahjong_device_sessions%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL THEN
  RAISE EXCEPTION 'Authentication and device identifier required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())
 ) THEN RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 -- A newer login invalidates an older scorekeeper session unless explicitly
 -- allowed by administrator, even if its old lease has not yet been revoked.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RAISE EXCEPTION 'Newer login session exists' USING ERRCODE='42501'; END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND is_active=true
   AND revoked_at IS NULL AND auth_session_id=v_auth_session;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 -- A reader lease is not a permanent entitlement. If the administrator
 -- disables multi-device access, reject previously enrolled reader sessions
 -- immediately instead of allowing continued cloud reads.
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
      AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN
  RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked');
 END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 RETURN jsonb_build_object('ok',true,'gameId',v_game.id,'revision',v_game.revision,
  'game',v_game.game_data,'canWrite',v_lease.is_writer
   AND v_lease.session_token_hash IS NOT NULL
   AND v_lease.session_generation>0
   AND v_game.writer_session_id=v_lease.id);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_read(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_read(uuid) TO authenticated;

-- Lightweight lease probe for foreground/periodic client checks. A stale device
-- must learn that its writer lease was revoked without waiting for a score edit.
-- This is advisory UI state; commit() remains the server-side security boundary.
CREATE OR REPLACE FUNCTION public.mahjong_sync_lease_status(p_device_id uuid,p_generation bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_auth_session uuid; v_lease public.mahjong_device_sessions%ROWTYPE;
 v_game public.mahjong_game_states%ROWTYPE;
BEGIN
 IF v_uid IS NULL OR p_device_id IS NULL OR p_generation IS NULL OR p_generation<1 THEN
  RAISE EXCEPTION 'Authentication and valid lease identity required' USING ERRCODE='28000'; END IF;
 v_auth_session := NULLIF(auth.jwt()->>'session_id','')::uuid;
 IF v_auth_session IS NULL OR NOT EXISTS (
  SELECT 1 FROM auth.sessions WHERE id=v_auth_session AND user_id=v_uid
   AND created_at IS NOT NULL AND (not_after IS NULL OR not_after>now())) THEN
  RAISE EXCEPTION 'Valid auth session required' USING ERRCODE='28000'; END IF;
 PERFORM 1 FROM auth.users WHERE id=v_uid AND deleted_at IS NULL
  AND (banned_until IS NULL OR banned_until<=now())
  AND raw_app_meta_data->>'role' IN ('admin','scorekeeper');
 IF NOT FOUND THEN RAISE EXCEPTION 'Account inactive or unauthorized' USING ERRCODE='42501'; END IF;
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions newer ON newer.user_id=u.id
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND (newer.created_at IS NULL OR (newer.created_at,newer.id)>(current_auth.created_at,current_auth.id))
   AND (newer.not_after IS NULL OR newer.not_after>now())
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 -- Persistently reject a displaced older login even if the newer Auth session
 -- has expired or was deleted; do not rely only on live auth.sessions rows.
 IF EXISTS (
  SELECT 1 FROM auth.users u
  JOIN auth.sessions current_auth ON current_auth.id=v_auth_session AND current_auth.user_id=v_uid
  JOIN public.mahjong_device_sessions prior ON prior.user_id=v_uid
  WHERE u.id=v_uid AND u.raw_app_meta_data->>'role'='scorekeeper'
   AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)=false
   AND prior.auth_session_created_at IS NOT NULL
   AND (prior.auth_session_id IS NULL OR (prior.auth_session_created_at,prior.auth_session_id)>(current_auth.created_at,v_auth_session))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','newer-login'); END IF;
 SELECT * INTO v_lease FROM public.mahjong_device_sessions
  WHERE user_id=v_uid AND device_id=p_device_id AND auth_session_id=v_auth_session
   AND session_generation=p_generation AND is_active=true AND revoked_at IS NULL;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','session-revoked'); END IF;
 SELECT * INTO v_game FROM public.mahjong_game_states
  WHERE owner_id=v_uid AND is_current=true;
 IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'reason','no-cloud-game'); END IF;
 IF NOT v_lease.is_writer AND NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id=v_uid
   AND (u.raw_app_meta_data->>'role'='admin'
    OR (u.raw_app_meta_data->>'role'='scorekeeper'
     AND COALESCE((u.raw_app_meta_data->>'mahjong_multi_device')::boolean,false)))
 ) THEN RETURN jsonb_build_object('ok',false,'reason','reader-permission-revoked'); END IF;
 RETURN jsonb_build_object('ok',true,'canWrite',v_lease.is_writer
  AND v_lease.session_token_hash IS NOT NULL
  AND v_game.writer_session_id=v_lease.id,
  'gameId',v_game.id,'revision',v_game.revision);
END; $$;
REVOKE ALL ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_lease_status(uuid,bigint) TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_peek() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_peek() TO authenticated;

REVOKE ALL ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_open(uuid,jsonb,bigint,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mahjong_sync_commit(uuid,uuid,bigint,text,bigint,jsonb) TO authenticated;

-- ROLLBACK-ONLY TEST ASSERTIONS (no persistent schema/data changes)
DO $gate$
DECLARE v_count integer; v_exposed integer;
BEGIN
 SELECT count(*) INTO v_count FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND p.prosecdef AND EXISTS (SELECT 1 FROM unnest(COALESCE(p.proconfig, ARRAY[]::text[])) AS cfg(value) WHERE cfg.value IN ('search_path=', 'search_path=""'));
 IF v_count <> 5 THEN RAISE EXCEPTION 'RPC SECURITY GATE FAIL: expected 5 secure definer functions, found %',v_count; END IF;
 SELECT count(*) INTO v_exposed FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN
 ('mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status')
 AND (has_function_privilege('anon',p.oid,'EXECUTE') OR NOT has_function_privilege('authenticated',p.oid,'EXECUTE'));
 IF v_exposed <> 0 THEN RAISE EXCEPTION 'RPC GRANTS GATE FAIL: % functions exposed or missing auth grant',v_exposed; END IF;
 RAISE NOTICE 'PASS: five RPCs compiled, SECURITY DEFINER/search_path hardened, authenticated-only EXECUTE; ROLLBACK pending';
END $gate$;


-- Isolated latest-session write lifecycle. All changes are rolled back.
CREATE TEMP TABLE mahjong_lifecycle_results (scenario text, observed text, status text) ON COMMIT DROP;
DO $lifecycle$
DECLARE
 v_uid uuid; v_session uuid; v_count int; v_device uuid := gen_random_uuid();
 v_initial jsonb := '{"names":["A","B","C","D"],"scores":[0,0,0,0],"history":[],"dealer":0,"round":1}'::jsonb;
 v_next jsonb := '{"names":["A","B","C","D"],"scores":[3,-1,-1,-1],"history":[{"delta":[3,-1,-1,-1]}],"dealer":0,"round":2}'::jsonb;
 v_open jsonb; v_commit jsonb; v_rotated jsonb; v_old jsonb; v_recovered jsonb;
 v_gid uuid; v_token text; v_gen bigint; v_state text;
BEGIN
 SELECT count(*), (array_agg(id))[1] INTO v_count,v_uid FROM auth.users
 WHERE raw_app_meta_data->>'role'='scorekeeper' AND deleted_at IS NULL
 AND (lower(raw_user_meta_data->>'username')='wiroseta' OR lower(raw_app_meta_data->>'username')='wiroseta' OR lower(split_part(email,'@',1))='wiroseta');
 IF v_count<>1 THEN RAISE EXCEPTION 'Exactly one test account required'; END IF;
 SELECT id INTO v_session FROM auth.sessions WHERE user_id=v_uid
 AND (not_after IS NULL OR not_after>now()) ORDER BY created_at DESC,id DESC LIMIT 1;
 IF v_session IS NULL THEN RAISE EXCEPTION 'No latest session'; END IF;
 IF EXISTS(SELECT 1 FROM public.mahjong_game_states WHERE owner_id=v_uid AND is_current) THEN
   RAISE EXCEPTION 'STOP: test account already owns current cloud game; do not touch existing data';
 END IF;
 IF EXISTS(SELECT 1 FROM public.mahjong_device_sessions WHERE user_id=v_uid AND is_active) THEN
   RAISE EXCEPTION 'STOP: test account has active device lease; do not revoke existing device';
 END IF;
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',v_uid,'role','authenticated','session_id',v_session)::text,true);
 PERFORM set_config('request.jwt.claim.sub',v_uid::text,true);
 IF NOT public.mahjong_sync_valid_game(v_initial) OR NOT public.mahjong_sync_valid_game(v_next) THEN
   RAISE EXCEPTION 'Test fixtures invalid';
 END IF;
 v_open:=public.mahjong_sync_open(v_device,v_initial,NULL,NULL);
 INSERT INTO mahjong_lifecycle_results VALUES ('OPEN INITIAL',coalesce(v_open->>'reason','ok='||(v_open->>'ok')),
 CASE WHEN v_open->>'ok'='true' AND length(v_open->>'writerToken')=64 THEN 'PASS' ELSE 'FAIL' END);
 IF v_open->>'ok' IS DISTINCT FROM 'true' THEN RETURN; END IF;
 v_gid:=(v_open->>'gameId')::uuid; v_token:=v_open->>'writerToken'; v_gen:=(v_open->>'generation')::bigint;
 v_commit:=public.mahjong_sync_commit(v_gid,v_device,v_gen,v_token,0,v_next);
 INSERT INTO mahjong_lifecycle_results VALUES ('COMMIT SCORE HISTORY',v_commit::text,
 CASE WHEN v_commit->>'ok'='true' AND v_commit->>'revision'='1' THEN 'PASS' ELSE 'FAIL' END);
 v_recovered:=(SELECT game_data FROM public.mahjong_game_states WHERE id=v_gid);
 INSERT INTO mahjong_lifecycle_results VALUES ('PERSIST SCORE HISTORY',CASE WHEN v_recovered=v_next THEN 'exact snapshot' ELSE 'snapshot differs' END,
 CASE WHEN v_recovered=v_next THEN 'PASS' ELSE 'FAIL' END);
 -- Rotate the token on the SAME device/session; stale token must never write.
 v_rotated:=public.mahjong_sync_open(v_device,NULL,1,v_gid);
 INSERT INTO mahjong_lifecycle_results VALUES ('ROTATE WRITER TOKEN',coalesce(v_rotated->>'reason','ok='||(v_rotated->>'ok')),
 CASE WHEN v_rotated->>'ok'='true' AND v_rotated->>'writerToken'<>v_token AND (v_rotated->>'generation')::bigint>v_gen THEN 'PASS' ELSE 'FAIL' END);
 IF v_rotated->>'ok' IS DISTINCT FROM 'true' THEN RETURN; END IF;
 v_state:=NULL;
 BEGIN v_old:=public.mahjong_sync_commit(v_gid,v_device,v_gen,v_token,1,v_initial);
 EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS v_state=RETURNED_SQLSTATE; END;
 INSERT INTO mahjong_lifecycle_results VALUES ('STALE TOKEN REJECTED',coalesce(v_state,v_old::text),
 CASE WHEN v_state IS NOT NULL OR (v_old->>'ok'='false' AND v_old->>'reason'='writer-revoked') THEN 'PASS' ELSE 'FAIL' END);
 INSERT INTO mahjong_lifecycle_results VALUES ('NO STALE SCORE OVERWRITE',
  (SELECT 'revision='||revision FROM public.mahjong_game_states WHERE id=v_gid),
 CASE WHEN (SELECT revision=1 AND game_data=v_next FROM public.mahjong_game_states WHERE id=v_gid) THEN 'PASS' ELSE 'FAIL' END);
END $lifecycle$;
SELECT scenario,observed,status FROM mahjong_lifecycle_results;
-- NO COMMIT. The entire temporary game, token, lease and RPC DDL disappear.
ROLLBACK;

```



---

## SOURCE: STAGE13_CROSS_RPC_CHECKPOINT.md

# Stage 13 — Cross-RPC unlock safety (static verification)
Date: 2026-10-12. Starting checkpoint: 377 PASS. Added four cross-file Node regression tests verifying admin unlock and writer-open serialize on auth.users row, preserved Auth session high-water checked in open/commit, revoked lease cannot commit, and unlock SQL remains fail-closed with no GRANT or game-state mutation. Actual run: `node --test tests/*.test.cjs` -> 381 PASS, 0 FAIL. Log: `tests/stage13_cross_rpc_run.log`.
Limitations: these are static checks, NOT PostgreSQL integration or Supabase runtime verification. Existing SQL remains an unsafe draft; no production deployment or cloud changes. Next requires disposable PostgreSQL/Supabase test environment to validate role permissions, row locking, stale login and concurrency before wiring UI.



---

## SOURCE: STAGE13_DEPLOY_BOUNDARY_CHECKPOINT.md

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

## SOURCE: STAGE13_DRAFT_REVIEW_CONSISTENCY_CHECKPOINT.md

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

## SOURCE: STAGE13_EDIT_QUAD_SAFETY_CHECKPOINT.md

# STAGE 13 — Score Edit / Quad Save Rollback
2026-10-12. DO NOT DEPLOY.
- `saveScoreEdit()`: snapshot before mutation, rollback state and keep edit dialog open on failed save.
- `deleteQuad()`: snapshot before mutation, rollback state on failed save.
- Isolated real-function tests: four new cases (success/failure each).
- Local `node --test tests/*.test.cjs`: 404 PASS, 0 FAIL. Log: tests/stage13_edit_quad_regression_20261012.log.
- Remaining: audit score history snapshot chain after editing earlier entries; malformed historical quad delta; browser/device and Supabase integration. No production deployment.



---

## SOURCE: STAGE13_FAST_TRACK_COMMIT_BINDING.md

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

## SOURCE: STAGE13_FAST_TRACK_GATE.md

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

## SOURCE: STAGE13_HISTORY_REBASE_CHECKPOINT.md

# Stage 13 history rebase checkpoint (DO NOT DEPLOY)
2026-10-12. Baseline: Stage 13 Edit & Quad Safety 404 PASS.
- Newest-first history: edits/deletions to an older entry shift `before` snapshots for all newer entries (indices lower than edited index) by the net score change.
- Reject malformed/missing newer `before` snapshots rather than applying an unsafe edit/deletion.
- Preserve existing save-failure rollback protection.
- Tests: 410 PASS, 0 FAIL (`node --test tests/*.test.cjs`, from repository root).
- Includes six targeted history-rebase tests, and adjusts the pre-existing isolated test harness to include the new helper function.
- Caveat: local JS tests only; full integration and real-device verification outstanding. No production database changes.



---

## SOURCE: STAGE13_INDEX_PREFLIGHT_20261012.md

# Stage 13 — Read-only index preflight

Status: local checkpoint; **DO NOT DEPLOY**.

The read-only SQL preflight now includes an `indexes` result with:
- `blocking_single_active_index_present`
- `current_game_unique_index_present`
- `session_lookup_index_present`

This does **not** modify schema or solve the four blockers. `pg_indexes.indexdef` is inspected statically and must be independently reviewed before any migration. No production query was executed. Real Supabase Auth and RPC integration remain untested.

Tests: `node --test tests/*.test.cjs` — 306 PASS, 0 FAIL.



---

## SOURCE: STAGE13_INTEGRATION_BLOCKERS.md

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

## SOURCE: STAGE13_JSON_ROOT_CHECKPOINT.md

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

## SOURCE: STAGE13_LOCAL_POSTGRES_NEXT.md

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

## SOURCE: STAGE13_NEXT_CHECKPOINT.md

# Stage 13 next checkpoint — 339 PASS
Run on a local disposable PostgreSQL installation only, when available:
`PSQL_BIN=/opt/homebrew/opt/postgresql@17/bin/psql PG_TEST_DB=mahjong_sync_test node tools/stage13_pg_readonly_preflight.cjs`
The helper is read-only; do not apply draft SQL or production migrations. Await inventory result before isolated fixture planning. Supabase Auth/RLS/Realtime remain unverified. Cloud Sync OFF; DO NOT DEPLOY.



---

## SOURCE: STAGE13_PARALLEL_PG_TEST_PLAN.md

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

## SOURCE: STAGE13_PERSISTENT_DEVICE_BINDING_CHECKPOINT.md

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

## SOURCE: STAGE13_READER_BINDING_ISOLATION.md

# Stage 13 — Reader/Writer binding isolation (372 PASS)

## Temuan dan perbaikan
Pada checkpoint 370, guard permanen memeriksa *semua* `mahjong_device_sessions`, termasuk baris yang hanya pernah digunakan sebagai reader. Akibatnya, enrollment reader pada perangkat lain dapat mengunci writer Scorekeeper secara tidak sengaja. Draft SQL kini menambahkan `ever_writer boolean NOT NULL DEFAULT false`, menandainya true saat writer berhasil dibuka, dan hanya menggunakan baris `ever_writer` untuk penguncian perangkat permanen. Reader tidak mengubah flag ini. Regression test lama diselaraskan dan dua tes baru ditambahkan.

## Verifikasi
`node --test tests/*.test.cjs`: **372 PASS / 0 FAIL**. Masih pengujian lokal/statis; belum PostgreSQL runtime. SQL draft tetap memiliki hard-stop `UNSAFE DRAFT`, Cloud Sync OFF, DO NOT DEPLOY.

## Risiko yang masih terbuka
Migrasi dari sesi writer historis belum bisa mengidentifikasi secara pasti mana yang pernah menjadi writer, sehingga perlu rencana backfill aman dan verifikasi pada staging sebelum aktivasi. Admin unlock device belum tersedia. Jangan menjalankan SQL draft pada produksi.



---

## SOURCE: STAGE13_READONLY_CONTRACT_CHECKPOINT_20261012.md

# Stage 13 — Read-only SQL contract checkpoint (2026-10-12)

Local-only review; Cloud Sync OFF; DO NOT DEPLOY.

Added `tests/sync-stage13-readonly-contract.test.cjs` with three static checks: (1) read-only preflight has no unquoted SQL mutation/privilege commands, (2) preflight references the four required tables and two primary RPC entrypoints, (3) RPC draft retains its unconditional RAISE EXCEPTION deployment blocker. The checks do not establish PostgreSQL execution safety or effective grants/RLS and are not a substitute for isolated integration testing. The read-only preflight does not currently inventory all six RPC entrypoints; this remains a review item.

Verified command: `node --test tests/*.test.cjs` — 342 PASS, 0 FAIL. Log: `tests/stage13_readonly_contract_20261012.log`.

No production Supabase, GitHub deployment, or live-game changes. Next: expand read-only inventory coverage and run negative authorization/session tests against disposable PostgreSQL/Supabase when available.



---

## SOURCE: STAGE13_RPC_AUTHORIZATION_CHECKPOINT_20261012.md

# Stage 13 — RPC authorization checkpoint (2026-10-12)

Status: LOCAL REVIEW ONLY; DO NOT DEPLOY. Cloud Sync OFF.

Reviewed six RPC signatures in `supabase_sync_rpc_draft.sql`: open, commit, open_reader, peek, read, lease_status. Added `tests/sync-rpc-authorization-boundaries.test.cjs` with three static regression tests asserting explicit EXECUTE revoke/grant boundaries, Supabase Auth session binding, and pinned SECURITY DEFINER search paths for all six entrypoints.

Actual command: `node --test tests/*.test.cjs` — 336 PASS, 0 FAIL. Log: `tests/stage13_rpc_auth_boundaries_20261012.log`.

Important limitation: static assertions do not prove effective database privileges, PostgreSQL parser/runtime behavior, RLS correctness, token/session revocation races, or live integration. The SQL draft retains its deliberate unconditional deployment blocker. No production SQL or remote Supabase changes performed.

Next: test in isolated disposable PostgreSQL/Supabase environment with negative permissions/session tests before considering any migration. Do not execute draft on production.



---

## SOURCE: STAGE13_RPC_INVENTORY_CHECKPOINT_20261012.md

# Tahap 13 — RPC inventory read-only

- Menambahkan inventaris enam RPC pada SQL preflight read-only: signature, installed, hak EXECUTE anon/authenticated, SECURITY DEFINER.
- Menambahkan tiga tes regresi statis untuk kelengkapan inventaris dan larangan SQL mutasi.
- Semua hasil ini adalah pemeriksaan statis lokal; belum ada PostgreSQL langsung.
- Jangan jalankan draft deployment pada Supabase produksi. Cloud Sync OFF. DO NOT DEPLOY.



---

## SOURCE: STAGE13_RUNTIME_GATE_CHECKPOINT.md

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

## SOURCE: STAGE13_SAFE_INTEGER_CHECKPOINT.md

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

## SOURCE: STAGE13_SAME_DEVICE_RELOGIN_CHECKPOINT.md

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

## SOURCE: STAGE13_SCHEMA_BLOCKERS_20261012.md

# Tahap 13 — blocker kompatibilitas skema (12 Oktober 2026)

**Status: BLOCKED / DO NOT DEPLOY.** Audit statis menemukan ketidakcocokan material antara `supabase_latest.sql` dan `supabase_sync_rpc_draft.sql`:

1. Fondasi membuat indeks unik `mahjong_one_active_device_per_user` untuk setiap baris `is_active=true`. RPC `open_reader` justru mengizinkan beberapa sesi pembaca aktif pada akun admin atau scorekeeper dengan izin multi-device. Tanpa migrasi yang diuji, penambahan reader kedua akan melanggar indeks.
2. Fondasi tidak mendefinisikan kolom `is_writer`, `session_token_hash`, `revoked_at` pada `mahjong_device_sessions`, sedangkan draft RPC menggunakannya. Draft hanya menambah `auth_session_id` dan `auth_session_created_at`.
3. Draft mengasumsikan indeks parsial `mahjong_game_states_one_current_per_owner_idx`, tetapi `supabase_latest.sql` tidak membuatnya; draft menambah `is_current` saja. Diperlukan migrasi eksplisit yang aman untuk data yang sudah ada, termasuk pemeriksaan duplikasi sebelum membangun indeks unik.
4. Helper `mahjong_sync_generate_token()` dipanggil RPC, tetapi tidak dibuat oleh kedua berkas tersebut. Harus diverifikasi dari skema target lewat preflight.

**Langkah aman selanjutnya:** audit skema target melalui query hanya-baca, tentukan migrasi aditif dan prosedur untuk indeks lama, verifikasi transaksi pada database disposable dengan Auth/RLS nyata. Jangan mengeksekusi SQL draft yang sengaja digagalkan. Jangan mengubah produksi atau menyalakan Cloud Sync.

Tes baru di `tests/sync-foundation-schema-gap.test.cjs` sengaja memotret blocker ini; jika migrasi fondasi direkonsiliasi, tes harus diperbarui menjadi tes positif, bukan dibiarkan mengabadikan ketidakcocokan.



---

## SOURCE: STAGE13_SECURITY_REVIEW_2026-10-12.md

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

## SOURCE: STAGE13_SESSION_INVENTORY_CHECKPOINT_20261012.md

# Tahap 13 — Checkpoint RPC Session Inventory (348 PASS)

- Baseline: ZIP 345 PASS; tidak ada perubahan pada Supabase produksi.
- Menambahkan `tests/sync-stage13-rpc-session-inventory.test.cjs` berisi tiga pengujian statis: enam nama RPC, hak EXECUTE anon/authenticated, serta SECURITY DEFINER dan resolusi signature tepat.
- Perintah verifikasi: `node --test tests/*.test.cjs`.
- Hasil aktual: 348 PASS, 0 FAIL. Log: `tests/checkpoint_test_run_20261012_348.txt`.
- Batasan: pemeriksaan statis belum memverifikasi keamanan sesi pada PostgreSQL runtime. `psql` tidak tersedia. Audit perlu berlanjut dengan database terisolasi dan uji pencabutan hak tulis perangkat lama.
- Cloud Sync OFF. DO NOT DEPLOY. Tidak ada SQL yang dieksekusi ke Supabase.



---

## SOURCE: STAGE13_SINGLE_DEVICE_BETA_CHECKPOINT.md

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

## SOURCE: STAGE13_SUPABASE_VALIDATOR_GAP_CHECKPOINT_394.md

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

## SOURCE: STAGE13_TAKEOVER_GUARDS_CHECKPOINT_20261012.md

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

## SOURCE: STAGE13_TEST_COMPATIBILITY_CHECKPOINT_396.md

# Checkpoint 396 — SQL Guard Test Compatibility

- Updated three source-pattern tests to recognize type-guarded `CASE WHEN jsonb_typeof(...) = 'array'` expressions.
- No changes to application runtime or SQL draft relative to checkpoint 395.
- Local `node --test tests/*.test.cjs`: 393 PASS, 0 FAIL.
- These are local tests, not a PostgreSQL execution of the draft or a live Supabase validation.
- Active Supabase validator still has the previously confirmed nested-history gaps; do not deploy the draft.
- Stage 13 ongoing; DO NOT DEPLOY.



---

## SOURCE: STAGE13_TRANSACTION_ORDER_CHECKPOINT_20261012.md

# Stage 13 — Transaction ordering checkpoint (2026-10-12)

Baseline: 351 PASS. Added `tests/sync-stage13-transaction-order.test.cjs` (3 static regression checks): (1) account owner row lock precedes current-game lock, (2) writer lease and base revision validated before updating game state, (3) revision conflict is logged and returns before game overwrite. Ran `node --test tests/*.test.cjs`: **354 PASS, 0 FAIL**, recorded in `tests/stage13_transaction_order_20261012.log`.

These are static contract tests only; they do not establish real concurrent PostgreSQL transaction behavior. No production database touched, no RPC deployed. `psql` unavailable. Cloud Sync OFF. DO NOT DEPLOY. Next: isolated PostgreSQL concurrency tests when a disposable database is available; verify stale writer vs takeover and simultaneous commits.



---

## SOURCE: STAGE13_UNLOCK_CONCURRENCY_REVIEW_CHECKPOINT.md

# Stage 13 — Unlock concurrency static review (2026-10-12)

Source checkpoint: v15.7.15 381 PASS. Added four isolated Node regression assertions in `tests/sync-stage13-unlock-concurrency-review.test.cjs`: administrator self-unlock rejection, target auth-row lock ordering before binding inspection and revocation, ambiguous historical binding refusal without game-state modification, and non-deployable SQL guards/no execution grants. Full `node --test tests/*.test.cjs` run: **385 PASS / 0 FAIL** (see `tests/stage13_unlock_concurrency_review_run.log`).

**Limitations:** These are static checks only; PostgreSQL/psql/docker are unavailable in this environment. They do not prove concurrent transaction behavior, Supabase Auth claims, RLS, or server-side role enforcement at runtime. The SQL drafts remain unsafe/non-executable; no production database changes, deployments, or cloud sync activation. **DO NOT DEPLOY.** Next: disposable PostgreSQL/Supabase runtime integration, transaction race tests, and authorization review before wiring UI.



---

## SOURCE: STAGE13_UNLOCK_REVOCATION_CHECKPOINT.md

# Stage 13 — Admin unlock revocation checkpoint

2026-10-12. Source: 375 PASS ZIP. Hardened the *non-executable* admin unlock SQL draft to clear `session_token_hash` and set `revoked_at=now()` when invalidating writer leases; increments `session_generation` and marks writer inactive. Preserves `auth_session_id` and `auth_session_created_at` history to support stale-login rejection. Added two static regression tests (`tests/sync-stage13-unlock-revocation.test.cjs`). Ran `node --test tests/*.test.cjs`: **377 PASS, 0 FAIL**; log `tests/stage13_unlock_revocation_run.log`. No PostgreSQL runtime tests. No Cloud Sync enablement or production modifications. SQL draft retains explicit UNSAFE DRAFT guard, ROLLBACK and no GRANT. **DO NOT DEPLOY.** Next: verify cross-RPC unlock/relogin invariants in disposable PostgreSQL, then wire admin UI and cloud transport after runtime checks.



---

## SOURCE: STAGE13_VALIDATOR_TYPE_GUARD_CHECKPOINT_395.md

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

## SOURCE: STAGE14_16_ACTIVATION_LOSSLESS_20261013.md

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

## SOURCE: STAGE14_16_ARRAY_METADATA_INTEGRITY_20261013.md

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

## SOURCE: STAGE14_16_AUTH_NEGATIVE_RUNTIME_GATE_20261013.md

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

## SOURCE: STAGE14_16_AUTH_SESSION_NULL_TIMESTAMP_FIX_20261013.md

# Stage 14–16: Auth session ordering hardening (13 Oct 2026)

## Actual code change
Both guarded SQL drafts now reject other active auth.sessions records whose `created_at` is NULL during single-device newer-login checks. Previously tuple comparisons with NULL returned UNKNOWN and could silently skip an ambiguous session, potentially allowing writer takeover. This is fail-closed; no production SQL was executed.

## Remaining release blockers
The SQL remains guarded by the intentional UNSAFE DRAFT exception. PostgreSQL transaction tests and two-device integration on the existing Supabase project have not been performed. Do not remove the guard, deploy the SQL, or enable cloud sync before those tests and user authorization.



---

## SOURCE: STAGE14_16_BACKUP_RESTORE_DRILL_2026-10-13.md

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

## SOURCE: STAGE14_16_BACKUP_VERIFIED_INSTALL_GATE_20261013.md

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

## SOURCE: STAGE14_16_BATCH_IMPLEMENTATION_20261013.md

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

## SOURCE: STAGE14_16_BRIDGE_LEASE_NEUTRAL_20261013.md

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

## SOURCE: STAGE14_16_BRIDGE_LOSSLESS_SAVE_20261013.md

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

## SOURCE: STAGE14_16_BRIDGE_UNICODE_SERIALIZER_20261013.md

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

## SOURCE: STAGE14_16_COMMIT_ACK_BATCH_20261013.md

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

## SOURCE: STAGE14_16_COMPILE_ROLLBACK_HANDOFF_2026-10-13.md

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

## SOURCE: STAGE14_16_DEVICE_TAKEOVER_HANDOFF_20261013.md

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

## SOURCE: STAGE14_16_FASTTRACK_AUTH_GUARD_20261013.md

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

## SOURCE: STAGE14_16_FASTTRACK_HANDOFF_20261013.md

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

## SOURCE: STAGE14_16_FASTTRACK_PAYLOAD_HARDENING_20261013.md

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

## SOURCE: STAGE14_16_FASTTRACK_SNAPSHOT_INTEGRITY_20261013.md

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

## SOURCE: STAGE14_16_FIVE_RPC_ROLLBACK_HARNESS_20261013.md

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

## SOURCE: STAGE14_16_IMPLEMENTATION_AUDIT_20261013.md

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

## SOURCE: STAGE14_16_INSTALL_GATE_2026-10-13.md

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

## SOURCE: STAGE14_16_INSTALL_READINESS_20261013.md

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

## SOURCE: STAGE14_16_JWT_USER_BINDING_20261013.md

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

## SOURCE: STAGE14_16_LEASE_COMMIT_RACE_FIX_20261013.md

# Stage 14–16 — Lease/Commit concurrency protection

Actual implementation change in `js/sync-engine.js`:
- A lease check is deferred while a commit or activation is in progress.
- An in-flight lease check records the revision at dispatch; if a commit advances the revision before the lease reply arrives, the stale reply is ignored rather than revoking the valid writer.
- Existing explicit server revocations still fail closed when no concurrent commit/activation has superseded the check.

New tests: `tests/sync-lease-commit-race.test.cjs`, covering both concurrent scheduling orders.
Full local run: 509 PASS / 0 FAIL (`tests/stage14_16_lease_commit_race_20261013.log`).

LIMITATIONS: No real PostgreSQL/Supabase RPC deployment or two-device test. The SQL candidate remains intentionally guarded, cloud sync disabled, production unchanged. Do not deploy.



---

## SOURCE: STAGE14_16_LEASE_PROBE_ORDER_20261013.md

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

## SOURCE: STAGE14_16_LIVE_POSTGRES_GATE_20261013.md

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

## SOURCE: STAGE14_16_LIVE_PREFLIGHT_EVIDENCE_20261013.md

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

## SOURCE: STAGE14_16_NESTED_SERIALIZER_GUARD_20261013.md

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

## SOURCE: STAGE14_16_NULL_SESSION_ID_GUARD_20261013.md

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

## SOURCE: STAGE14_16_POSTLOCK_AUTH_REVALIDATION_20261013.md

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

## SOURCE: STAGE14_16_REAL_AUTH_INTEGRATION_GATE_20261013.md

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

## SOURCE: STAGE14_16_RESUME_AUDIT_2026-10-13.md

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

## SOURCE: STAGE14_16_RPC_INSTALL_READINESS_20261013.md

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

## SOURCE: STAGE14_16_RPC_INSTALL_REVIEW_2026-10-13.md

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

## SOURCE: STAGE14_16_RPC_STATIC_FINDINGS_2026-10-13.md

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

## SOURCE: STAGE14_16_SECURITY_CONTRACT_2026-10-13.md

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

## SOURCE: STAGE14_16_SIGNED_JWT_PREFLIGHT_20261013.md

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

## SOURCE: STAGE14_16_SIGNED_JWT_SEMANTICS_20261013.md

# Stage 14–16 — Signed JWT diagnostic semantics

- Browser screenshot from 2026-10-13: 6/6 preflight checks PASS; `mahjong_sync_peek` returned `ok=false, reason=no-cloud-game`.
- This proves the signed session reaches an authenticated RPC and receives a valid contract; it does **not** mean a cloud game or writer lease exists.
- Corrected browser diagnostic distinguishes RPC contract, outcome classification, and cloud game availability. `no-cloud-game` is reported NOT READY for cloud-game availability, while auth verification remains PASS.
- Three regression tests added for accurate classification and read-only operation.
- Five transfer RPCs are not permanently installed; no live device transfer tested. No migration/deploy or cloud activation.
- Next blocker: security review and explicitly authorized permanent installation of the five RPCs, followed by actual two-device tests. Do not treat browser preflight as end-to-end transfer proof.



---

## SOURCE: STAGE14_16_SNAPSHOT_REDACTION_2026-10-13.md

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

## SOURCE: STAGE14_16_STRICT_AUTH_HANDOFF_20261013.md

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

## SOURCE: STAGE14_ACCESS_EVIDENCE_REVIEW_CHECKPOINT_20261013.md

# Stage 14 — Evidence review continuation, 13 October 2026

Baseline restored from user-uploaded 444 PASS ZIP; baseline re-run 444 PASS / 0 FAIL.
Added conservative, offline JSON review utility `tools/stage14-review-access.cjs` for output rows of first result set from `supabase_sync_stage14_access_preflight_readonly.sql`. It refuses missing/duplicate evidence, absent tables, disabled RLS, unknown or granted direct INSERT/UPDATE/DELETE for anon/authenticated. Eight isolated tests added. Full suite: 452 PASS / 0 FAIL.

IMPORTANT: A passing reviewer means ONLY that table-level evidence is restrictive; it does not validate policies, SECURITY DEFINER behavior, RPC grants, index integrity, Auth session semantics, concurrency or two-device runtime. Do not paste real game data; preflight returns metadata only. SQL preflight is read-only. No database was contacted. No SQL deployed; cloud sync remains OFF. Candidate remains DO NOT DEPLOY.

Next required user action: execute `supabase_sync_stage14_access_preflight_readonly.sql` in Supabase SQL Editor (read-only) and return BOTH result sets, or export results as JSON. Review policies/indexes/RPC privileges and reconcile actual definitions before staging-only migration and real-device tests.



---

## SOURCE: STAGE14_ACCESS_PREFLIGHT_CHECKPOINT.md

# Stage 14 — access-boundary preflight (read only)

Added `supabase_sync_stage14_access_preflight_readonly.sql` to inspect actual table DML grants, RLS policies, indexes (including current-game uniqueness), and RPC execution grants. It does **not** query user/game rows or modify Supabase.

Why: `RLS enabled=true` by itself does not establish that direct API writes are impossible. Any permissive RLS policies or direct grants must be reviewed before enabling SECURITY DEFINER writer RPCs. No production conclusion is claimed from static contract tests.

Pending: run the read-only preflight and inspect output, verify SQL candidate against real PostgreSQL with two-device concurrency, test offline and realtime revocation, verify exact UI recovery, then approve a separate deployment migration. Cloud sync and SQL candidate remain blocked.



---

## SOURCE: STAGE14_AUTOMATIC_TRANSFER_CANDIDATE.md

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

## SOURCE: STAGE14_COLUMN_EVIDENCE_GATE_20261013.md

# Stage 14 — Column Evidence Gate (13 October 2026)

Continued from uploaded 452 PASS checkpoint. Added independent offline metadata reviewer `tools/stage14-review-columns.cjs` for the **second result set** of `supabase_sync_stage14_access_preflight_readonly.sql`. Seven isolated tests check complete evidence, missing/duplicate rows, absent columns, unknown installed flags and missing data types. `node --test tests/*.test.cjs`: **459 PASS / 0 FAIL**.

Usage: export the second SQL result set as a JSON array and run `node tools/stage14-review-columns.cjs columns.json`. First result set remains reviewed with `node tools/stage14-review-access.cjs access.json`. No production database access or migration was performed. Passing both tools is **not** authorization to deploy: actual types/defaults, policies, indexes, RPC implementations/grants, Auth session behavior and two-device tests are still outstanding. Cloud Sync remains OFF. DO NOT DEPLOY.

Next action: user provides BOTH read-only Supabase SQL result sets; reconcile observed metadata and candidate SQL before any staging-only execution.



---

## SOURCE: STAGE14_COLUMN_PREFLIGHT_CHECKPOINT.md

# Stage 14 — Column visibility checkpoint (434 PASS)

2026-10-12. Added a second read-only SQL result set to `supabase_sync_stage14_access_preflight_readonly.sql` which explicitly reports whether each of eight sync/transfer columns exists, including `auth_session_created_at`, `ever_writer`, and the current default of `mahjong_game_states.is_current`. Missing columns remain visible via LEFT JOIN. No database writes or app behavior changes. Three new local contract tests; `node --test tests/*.test.cjs`: 434 PASS, 0 FAIL. Actual Supabase preflight execution and two-device integration remain outstanding. Cloud sync OFF; guarded candidate SQL remains non-deployable.



---

## SOURCE: STAGE14_COLUMN_TYPE_GATE_20261013.md

# Stage 14 — Candidate Column Type Gate

Continued from 459 PASS. Added independent fail-closed reviewer `tools/stage14-review-column-types.cjs` comparing second read-only Supabase SQL result set against candidate PostgreSQL column type assumptions. Added six isolated regression tests. `node --test tests/*.test.cjs`: 465 PASS / 0 FAIL.

**Important:** Expected types are candidate assumptions, not verified live Supabase schema. A mismatch means investigate and reconcile, NOT automatically ALTER production. Run `node tools/stage14-review-column-types.cjs columns.json` after exporting second read-only result set. Column defaults, constraints, policies, RPC privileges and actual two-device transfer still require evidence. No SQL applied; Cloud Sync OFF; DO NOT DEPLOY.



---

## SOURCE: STAGE14_CONSOLIDATED_SECURITY_HANDOFF.md

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

## SOURCE: STAGE14_DEFAULT_NULLABILITY_GATE_20261013.md

# Stage 14 — Default and nullability evidence gate (473 PASS)

Resumed from 465 PASS. Added read-only metadata SQL `supabase_sync_stage14_defaults_preflight_readonly.sql`, fail-closed reviewer `tools/stage14-review-defaults.cjs`, and eight isolated regression tests. `node --test tests/*.test.cjs`: 473 PASS / 0 FAIL.

Expected defaults (`is_current=false`, `ever_writer=false`) are **candidate assumptions**, not verified live database values. The existing `is_current=true` default previously observed on Supabase remains a known discrepancy until read-only evidence confirms correction; do not modify production to satisfy a test. Reviewer only accepts explicit evidence and does not perform DDL. Export query results to JSON and run `node tools/stage14-review-defaults.cjs evidence.json`. This gate does not establish RLS, RPC permissions, indexes, transaction safety or two-device transfer. Cloud Sync OFF. DO NOT DEPLOY.



---

## SOURCE: STAGE14_EVIDENCE_BUNDLE_20261013.md

# Stage 14 — Consolidated offline evidence gate (479 PASS)

Continued from 473 PASS. Added `tools/stage14-review-evidence-bundle.cjs` to aggregate four independent read-only evidence reviewers (access, columns, types, defaults) without silently accepting missing sections. Added six isolated regression tests. `node --test tests/*.test.cjs`: 479 PASS / 0 FAIL.

## Usage
Export the Supabase **read-only** SQL results to JSON files following the individual reviewers' required schemas. Combine them into one JSON object with `access`, `columns`, `types`, `defaults` properties; run `node tools/stage14-review-evidence-bundle.cjs bundle.json`. No live evidence has been provided or checked in this checkpoint. A passing metadata bundle is NOT proof of policy semantics, RPC execution safety, PostgreSQL transactions, or two-device transfer. Known `is_current` default mismatch remains unresolved. No SQL deployed, no production changes, Cloud Sync OFF. DO NOT DEPLOY.



---

## SOURCE: STAGE14_EXISTING_DEFAULT_ALIGNMENT.md

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

## SOURCE: STAGE14_EXISTING_PROJECT_BATCH_DECISION_20261013.md

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

## SOURCE: STAGE14_HISTORY_VALIDATOR_HARDENING.md

# Stage 14 — History validator hardening

- Fixed a SQL three-valued-logic edge case in the candidate validator: missing/null `history` could fall through the combined type/length predicate because `false OR NULL` is NULL.
- Split the type rejection and length check into separate `WHEN` clauses.
- Added three static contract tests.
- Confirmed prior suspected duplicate Auth session assignment was a display overlap, not a source defect; no unnecessary change made.
- Production Supabase untouched; cloud sync disabled; candidate SQL intentionally fails closed.
- PostgreSQL execution, RLS permission checks, concurrency and real two-device tests remain blockers.



---

## SOURCE: STAGE14_PREFLIGHT_MISSING_TABLE_VISIBILITY.md

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

## SOURCE: STAGE14_REVOKED_WRITER_STORAGE_GUARD.md

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

## SOURCE: STAGE14_RPC_EXPOSURE_GATE_20261013.md

# Stage 14 — RPC exposure offline evidence gate (487 PASS)

Added `tools/stage14-review-rpc-exposure.cjs` and eight isolated regression tests. This gate requires explicit evidence of five proposed RPCs, rejects duplicate/missing records, anonymous or PUBLIC EXECUTE grants, absent authenticated grants, unsafe search paths, and unconfirmed SECURITY DEFINER. Input is a manually assembled JSON array of metadata records; the checker does NOT query Supabase and no live RPC evidence was supplied. A successful result is NOT proof that the function body correctly enforces authentication, device revocation, lease ownership, concurrency, or transaction safety. PostgreSQL integration and two-device testing remain mandatory. Cloud Sync OFF, no SQL deployed, DO NOT DEPLOY.



---

## SOURCE: STAGE14_SUPABASE_METADATA_ALIGNMENT_2026-10-12.md

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

## SOURCE: STAGE16_FINAL_SECURITY_AUDIT_AND_TEST_GATE_20261013.md

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

## SOURCE: STAGE17_FINAL_RPC_AUDIT_2026-10-13.md

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

## SOURCE: STAGE17_HISTORY_VALIDATOR_IMPLEMENTATION_20261013.md

# Stage 17 — Isolated history validator prototype

Status: PROTOTYPE ONLY / DO NOT DEPLOY.

File: `STAGE17_HISTORY_VALIDATOR_ISOLATED_ROLLBACK_ONLY.sql`. It creates only pg_temp helper functions inside a transaction, runs 12 positive/negative vectors, then ROLLBACK. It does NOT modify the live validator, install five RPCs, or modify game data. Do not run in production until SQL has been independently reviewed.

Scope: known optional history fields from `js/sync-engine.js`; unknown legacy fields and empty objects accepted. Unicode length via PostgreSQL char_length. Test results from Supabase have NOT been received, so PostgreSQL PASS is NOT claimed.

Important limitations: helper is not yet wired to `mahjong_sync_commit` or `mahjong_sync_open`; existing `public.mahjong_sync_valid_game` remains unchanged. Existing app JS `quads` score-vector check accepts negative safe integers before its separate 0..4 bound check; SQL prototype rejects negatives. PostgreSQL jsonb numeric formatting and Unicode normalization require live differential tests. Backup restore drill and real-auth two-device tests pending.

GitHub Desktop Summary: `v15.7.15 - Prototype isolated history validation tests`
GitHub Desktop Description: `Add rollback-only pg_temp SQL validator and 12 test vectors; document compatibility, risks and deployment blockers. No production SQL changes; Cloud Sync OFF.`



---

## SOURCE: STAGE17_HISTORY_VALIDATOR_PLAN_20261013.md

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

## SOURCE: STAGE17_STEP24_RPC_INTEGRATION_AUDIT_20261013.md

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

## SOURCE: STAGE17_STEP25_CORRECTED_HISTORY_INTEGRATION_AUDIT_20261013.md

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

## SOURCE: STEP28_VALIDATOR_PARITY_FINDINGS.md

# Stage 17 Step 28 — Validator parity (static review)

Date: 2026-10-13. Cloud Sync OFF. DO NOT DEPLOY.

## Verified actions
- Reviewed Stage14 candidate `mahjong_sync_valid_game` and isolated `pg_temp.mahjong_history_known_fields_valid`.
- Corrected four `trim(leading '-' from ...)` expressions to `ltrim(..., '-')` in a **separate review-only candidate** (`SQL_REVIEW_CANDIDATE_LTRIM_FIXED_DO_NOT_EXECUTE.sql`). Original candidate preserved.
- Node suite rerun: 581 PASS / 0 FAIL. No PostgreSQL parity execution in this step.

## Differences / outstanding risks
- The isolated function only validates history known fields, while candidate validates entire game; direct equality of return values is not a meaningful parity test without a shared fixture wrapper.
- Candidate `playerPatterns` permits JSON null; isolated function also permits it. Check actual application payloads before strengthening.
- Candidate `roundWind` / `seatWindsBefore` and numeric rules require dedicated edge-case fixtures, including large integer boundaries and JSON null.
- Candidate includes deliberate top-level `RAISE EXCEPTION` and is not deployable; corrected review copy remains deliberately blocked.
- Production `supabase_latest.sql` is not changed. Do not run candidate or copy its body into production until compiler and same-fixture PostgreSQL parity tests pass.

## Next
Create a read-only / rollback-only shared-fixture parity harness, run on Supabase with user approval, then reconcile any mismatches before consolidating active SQL.



---

## SOURCE: SYNC_RELEASE_STATUS.md

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


### Stage 254 — 2026-10-15 (Cloud Trial candidate; DO NOT DEPLOY production)
- Fixed existing Cloud Trial session takeover handler to recognize normalized `newer-login` errors in addition to `Newer login session exists`.
- Network failures do not trigger logout. Added targeted regression tests; 103 PASS / 0 FAIL across targeted and bridge/engine suites.
- Awaiting live Chrome/Firefox no-reload confirmation.
