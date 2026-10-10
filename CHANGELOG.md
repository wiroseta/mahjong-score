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
