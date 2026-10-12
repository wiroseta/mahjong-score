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
