## Voice v15.6.81

Administrator memilih Voice Mode pada Pengaturan Pengguna: Safari 3 tahap, Gemini 3 tahap, atau Gemini Sekaligus. Deploy ulang `mahjong-user-admin` dan `mahjong-voice-interpret` dari folder `supabase/functions`. Tidak ada SQL baru. Pengguna lama default Safari 3 tahap sampai Administrator menyimpan mode baru. Pengujian browser nyata tetap diperlukan.

## v15.6.78 — Quad Ownership Validation

- Parser diagnostik Quad memakai hasil segmen berjangkar pemain, bukan fuzzy hit yang dapat mengalihkan Quad ke Ari.
- Ejaan Fery dipetakan ke Ferry hanya dalam konteks perintah Quad lengkap dan unik.
- Grounding Gemini menolak pemilik Quad yang salah dan mencatat konflik yang sudah terselesaikan secara terpisah dari konflik belum pasti.
- Seluruh fitur v15.6.77 dipertahankan.

## v15.6.77 — Contextual Multi-Command Grounding
- Exact player-anchored HU/Quad/combination recognition, unique active-name matching for Safari drift, safe Gemini/local merge.
- No SQL or Edge Function changes.

v15.6.76 — Voice Debug dipisahkan sebagai panel keempat yang mandiri (setelah Test Voice), dengan hitungan riwayat 0–5. Tidak ada perubahan parser/AI.

Mahjong Score 4P PWA v15.6.75 — Structured Multi-Command Voice.

Deploy changed GitHub files: index.html, js/voice-parser.js, sw.js.
Redeploy Supabase Edge Function: supabase/functions/mahjong-voice-interpret/index.ts.
No SQL migration required.

v15.6.71 — Hybrid Multi-Command Voice: per-player command segmentation, conservative partial preview, Gemini source grounding, no automatic score recording. Test on devices before production.

Mahjong Score v15.6.70 — Multi-command Voice. Deploy updated supabase/functions/mahjong-voice-interpret/index.ts. No SQL changes.

## v15.6.65 — Setup
Deploy ulang dua Edge Functions: `mahjong-user-admin` dan `mahjong-voice-interpret`. Login sebagai Administrator, buka User Management → Pengaturan masing-masing akun → aktifkan Gemini Voice → Simpan. Default OFF. Pengiriman teks transkripsi/nama pemain/daftar kombinasi ke Gemini otomatis saat parser lokal gagal; audio tidak dikirim. Tidak ada perubahan SQL. Refresh/login ulang perangkat setelah perubahan jika perlu.

## v15.6.63 — Gemini Voice fallback setup
Deploy `supabase/functions/mahjong-voice-interpret/index.ts` as the new Supabase Edge Function `mahjong-voice-interpret` with JWT verification enabled. Use the existing `GEMINI_API_KEY` Supabase secret; optionally `GEMINI_MODEL`. The application sends only transcription alternatives and active player/pattern names, after consent, when local Voice parsing is ambiguous or fails. Gemini cannot directly change scores; the user must confirm. No SQL required. The local feedback log is not uploaded or used to train Gemini. Audio fallback and adaptive rule training are NOT implemented in this version.

v15.6.61 — Header Title Alignment: title height matches Hong Zhong tile; version remains original size and appears superscript at upper-right. No functional changes.

## v15.6.59 — Dealer & Wind Synchronization Fix

- Dealer is always Dong (East), including after Hu/Zi Mo and Ronde Baru.
- Correct counterclockwise seat-wind mapping; preserve physical player indices.
- Repair inconsistent persisted dealer/wind states without changing dealer, and normalize imported games.
- Undo restores the historical dealer and seat winds. Live Viewer uses the corrected snapshot.

# Mahjong Score v15.6.58 — Voice Diagnostic Improvement & Guest Viewer

Versi aktif: **v15.6.58**. Voice Diagnostic memiliki Free Test, nama pemain aktif, test HU/Zi Mo terstruktur, Self Diagnostic, dan pemeriksaan alternatif Speech Recognition. Guest Live Viewer menggunakan See More / See Less dengan garis simetris. Seluruh fitur v15.6.57 dipertahankan.

## v15.6.48 — Fixed Recap Header and Column Labels

- Rekap Semua Pemain: judul, header kolom Pemain / Skor / Hu / Zi Mo / Total dan tombol tutup tetap terlihat ketika daftar digulir.
- Hanya daftar pemain yang scroll; header tidak menutupi baris pertama. Tampilan kolom tetap sejajar pada layar kecil.
- Cleanup terarah: aturan CSS rekap lama yang tumpang tindih dihapus dan diganti satu kelompok aturan khusus modal rekap. Tidak mengubah perhitungan skor, riwayat, Gemini, atau Supabase.
- Tidak memerlukan SQL maupun redeploy Edge Function.

## v15.6.41 — Compact Remote Diagnostic Indicator

- Indikator Remote Diagnostic ON hanya menampilkan ikon 🔍 kecil di pojok kiri atas, mengikuti safe area perangkat.
- Indikator tidak dapat diklik dan tidak memengaruhi tombol atau alur skor; saat OFF ikon disembunyikan.
- Realtime, polling 60 detik, Gemini, serta seluruh fitur v15.6.38 tetap dipertahankan.
- Tidak ada perubahan SQL atau Edge Function; `supabase_latest.sql` tetap merupakan upgrade database terakhir v15.6.38.

## v15.6.38 — Realtime Remote Monitoring
- Remote Diagnostic targets now use a per-user Supabase Realtime `postgres_changes` subscription to detect enable/disable without reloading the player's page.
- The existing 60-second polling and foreground refresh remain as fallbacks; a disconnected channel is retried on the next poll.
- Realtime notifications trigger an authenticated RLS-protected refresh; no score, audio or game state is transmitted through the channel.
- Run `supabase_latest.sql` once to enable publication of the diagnostic target table and preserve admin-only diagnostic report deletion permissions from v15.6.36.
- Keep the already-working Gemini Edge Function and secrets unchanged. No Edge Function redeployment required.

## v15.6.36 — Hapus laporan AI Diagnostic (Administrator)
- Tombol **🗑️ Hapus Laporan** per item di AI Diagnostic → Laporan Terbaru.
- Konfirmasi sebelum penghapusan permanen, hanya Administrator melalui RLS Supabase.
- Jalankan `supabase_latest.sql` v15.6.36 **sekali** sebelum memakai tombol Hapus.
- Tidak ada tombol Hapus Semua. Skor permainan, riwayat, Voice, dan Live Sharing tidak berubah.
- Edge Function Gemini yang sudah aktif di Supabase **jangan ditimpa** oleh berkas di ZIP ini.

## v15.6.36 — Tampilan AI Diagnostic

Hasil analisis Gemini/OpenAI sekarang ditampilkan sebagai Ringkasan, Kemungkinan Penyebab, Pemeriksaan yang Disarankan, Tingkat Keyakinan, dan provider. Output JSON berlapis dan blok Markdown JSON ditangani dengan aman menggunakan DOM textContent. Logika permainan, SQL, dan Edge Function tidak diubah. **Edge Function dalam paket adalah salinan baseline v15.6.34; jangan deploy ulang Edge Function dari ZIP ini karena Edge Function yang sudah berjalan di Supabase telah diperbarui secara terpisah untuk Gemini Model Discovery.**

# v15.6.36 — Gemini Diagnostic Fix & Version Synchronization

- Gemini is attempted first with a 20-second timeout, 1500 output tokens and disabled thinking budget; OpenAI remains fallback. Provider failure diagnostics are logged server-side.
- Application version markers, AI Diagnostic report version, PDF/rules labels, manifest description and PWA cache synchronized to v15.6.36.
- No SQL migration required when v15.6.33 database setup already exists; deploy updated Edge Function and site files only. Existing scoring, voice, remote monitoring, and historical schema references remain unchanged.

## v15.6.33 — AI Diagnostic & Remote Monitoring

This build adds admin-only AI Diagnostic in Setting. Remote targets persist in Supabase; enabled users report lightweight browser checks while the page is visible. Gemini is primary; OpenAI is a technical fallback. The separate arithmetic simulation is not a full game-engine test. Existing scoring and voice logic are unchanged.

## Deployment steps (in order)
1. Backup the existing site and Supabase data.
2. Run `supabase_latest.sql` in Supabase SQL Editor once, only if the v15.6.31 schema is already applied. `supabase_scheme_history.sql` is an archive only; DO NOT execute the whole history file. Do not run earlier SQL again if already applied.
3. Deploy Edge Function `mahjong-ai-diagnostic` with JWT verification enabled.
4. Set Edge Function secrets `GEMINI_API_KEY` and `OPENAI_API_KEY` in Supabase; optionally `GEMINI_MODEL`, `OPENAI_MODEL`, `MAHJONG_AI_MONTHLY_LIMIT` (default 100). Never put keys in auth-config.js or index.html.
5. Upload changed website files `index.html`, `js/ai-diagnostic.js`, `sw.js`, `manifest.webmanifest`, and updated README to GitHub Pages. Retain all other existing files.
6. Sign in as Admin, open Setting → AI Diagnostic, run local check, enable one test user, open the app on that user's device, wait up to 60 seconds, then verify reports. Press Analisis AI to test Gemini; temporarily disabling Gemini on the server can test OpenAI fallback.

## Limitations
Remote monitoring requires a signed-in, active PWA, network access for reports, and is not persistent execution while the app is closed. It does not activate microphones or transmit raw audio. User-visible notice and privacy policy should be reviewed before enabling remote monitoring. Monthly limit counts saved AI analyses, not every API attempt; enforce provider-side spending limits too. No automatic code fixes.

---

## v15.6.32 — Isolated Voice Diagnostic dan fonetik Zi Mo

- Alias tambahan: jemuk dan cukem (cemuk dan cemok tetap didukung).
- Voice Diagnostic meminta satu target per percobaan, menyimpan target yang dipilih dan status PASS/FAIL/INFO tiap alternatif.
- PASS untuk HU/ZI MO mensyaratkan metode cocok dan tidak ada kata tambahan; sinonim lain tidak boleh menyembunyikan kegagalan pengenalan fonetik.
- Self Diagnostic menambahkan pengujian alias mandiri dan penolakan target yang tercampur sinonim.
- Cloud reporting tetap opt-in dan memakai tabel SQL v15.6.31 yang sama; tidak perlu migrasi database baru.
- Self Diagnostic offline tidak dapat menguji mikrofon perangkat secara nyata.

## v15.6.32 — Zi Mo Voice aliases dan Parser Self Diagnostic
- Zi Mo menerima variasi fonetik Bahasa Indonesia, Self Draw, Ambil Sendiri, dan Menang Sendiri.
- Parser HU tetap terpisah; satu sumber daftar alias, tanpa perubahan perhitungan skor.
- Voice Diagnostic (Administrator) menampilkan hasil parser untuk alternatif transkripsi, serta tombol Self Diagnostic Parser (Offline) dengan PASS/FAIL untuk variasi Zi Mo, HU, dan pemeriksaan tidak ada pencatatan otomatis.
- Self Diagnostic tidak membutuhkan mikrofon dan tidak mengubah skor, nama, atau riwayat.
- Versi UI dan cache PWA dinaikkan ke v15.6.32.

## v15.6.28 — Pembuang HU urut Dong → Nan → Xi → Bei
- Tombol pembuang HU mengikuti urutan angin aktual Dong, Nan, Xi, Bei, tanpa pemenang.
- Dropdown pembuang dalam Koreksi Hasil memakai posisi angin yang tersimpan pada tangan tersebut.
- Tidak mengubah siapa yang boleh membuang, skor, atau pilihan pembuang yang tersimpan.

## v15.6.28 — Urutan Kombinasi Poin mengikuti mata angin
- Input Kombinasi Poin utama dan Koreksi Hasil kini diurutkan menurut seatWinds aktual: Dong → Nan → Xi → Bei, sama seperti Quad. Nilai dan identitas pemain tetap terikat ke indeks pemain masing-masing; tidak mengubah skor maupun data tersimpan.

## v15.6.28 — Stop Voice on Record (semua perangkat)
- Setelah hasil tangan valid dan tombol Catat Hasil Tangan ditekan, seluruh sesi Voice dihentikan sebelum skor disimpan.
- Callback hasil recognition terlambat diabaikan melalui voiceSessionId; indikator Recording dimatikan.
- Voice hanya mulai lagi setelah pengguna menekan tombol Voice. Berlaku pada Safari iPhone/iPad/Mac dan Android/Chrome.
- Input yang belum valid tidak mematikan Voice; pengguna dapat menyelesaikan input sebelum mencatat.

## v15.6.28 — Guest fullscreen button visibility fix
Tombol ⛶ ditampilkan di Live Viewer Android dan Mac, termasuk saat PWA standalone. iPhone tetap tanpa tombol. Safari Mac tanpa Fullscreen API menampilkan shortcut Control + Command + F.

## v15.6.28 — Guest Live Viewer: Riwayat Ringkas
- Riwayat Permainan pada tampilan pemain menampilkan 2 entri terbaru secara default.
- Tombol Lihat lebih banyak membuka entri lainnya, dan Lihat lebih sedikit menutupnya kembali.
- Kondisi buka/tutup tetap terjaga ketika Live Viewer menerima pembaruan skor.
- Score Keeper dan semua fungsi versi sebelumnya tetap dipertahankan.

## v15.6.28 — Smart Voice Input (Sekaligus / Bertahap)
- Voice Score dapat menyebut satu hasil lengkap atau beberapa ucapan terpisah.
- Perintah baru hanya mengubah informasi yang disebut; Quad/pola yang sudah ada dipertahankan.
- Pengulangan perintah identik tidak menambah Quad; koreksi pemenang, pembuang, atau nilai Quad mengganti nilai lama.
- Voice tidak pernah menekan Catat Hasil Tangan otomatis.
- Seluruh fitur v15.6.15 tetap tersedia.

## v15.6.28 — Compact Horizontal Guest Live Viewer
- Live Viewer pemain memakai satu baris horizontal berdasarkan seatWinds aktual: Dong → Nan → Xi → Bei.
- Pemenang yang menjadi Dong otomatis tampil paling kiri tanpa menghitung angin terpisah.
- Ronde/Tangan dipindahkan ke kanan atas meja Live Viewer; indikator LIVE tetap kecil di kiri atas.
- Layar Score Keeper tidak diubah.
- Cache PWA dinaikkan ke v15.6.28.

## v15.6.14 — Guest Live UI Isolation Fix

- QR Guest Live Viewer is now the only application UI visible in `?live=` mode.
- Score Keeper sticky footer, Catat Hasil Tangan, bottom menu, Voice, score toast, and action menus are force-hidden with a final-cascade guest-mode rule.
- Fixes the mobile Safari case where a later `!important` footer rule overrode JavaScript `display:none`.
- `Keluar Live` remains local to the viewer and does not stop the Supabase live session.

## v15.6.14 — About This Program & Proprietary Legal Terms

- Added `Setting → About This Program`.
- Displays application version, Author / Developer: Ariawan, and © 2026 Ariawan. All Rights Reserved.
- Added proprietary-software legal terms covering ownership, copying, modification, redistribution, commercial use, derivative works, disclaimer, limitation of liability, and written-permission requirement.
- Preserves the dedicated read-only QR Guest Live Viewer and all previous fixes.

## v15.6.14 — Dedicated Read-Only QR Guest Live Viewer

- QR Guest sekarang memiliki tampilan khusus pemain, bukan UI Score Keeper yang disembunyikan sebagian.
- Live Viewer menampilkan meja 4 pemain, skor, dealer, ronde/tangan, Riwayat Permainan read-only, dan Rekap Semua Pemain.
- Tidak ada tombol Koreksi, Hapus, Catat Hasil Tangan, Voice, Game Baru, Edit Nama, atau menu Score Keeper.
- Tombol `Keluar Live` hanya menutup Live Viewer pada perangkat pemain; tidak mengubah sesi Live di Supabase.
- Viewer memperbarui state dari RPC read-only `mahjong_get_live_game` setiap 2 detik.
- Sesi yang diakhiri Score Keeper menampilkan status berakhir dan menghentikan polling viewer.

## v15.6.10 — Compact In-Table Live Indicator

- Dashboard Score Keeper menampilkan indikator LIVE dengan titik hijau pulse saat sinkronisasi sehat.
- Jika publish snapshot ke Supabase gagal, indikator berubah oranye menjadi LIVE · Gangguan Koneksi.
- Menekan indikator tetap membuka kontrol Live Sharing/QR.

## v15.6.8 — Persistent Live Sharing + QR / Share Link

- Live Sharing cukup diaktifkan sekali; modal boleh ditutup dan pencatatan skor berjalan seperti biasa.
- Selama sesi Live aktif, setiap perubahan state yang tersimpan otomatis dipublikasikan ke Supabase untuk viewer QR.
- Modal Live Score menampilkan QR Code besar, Bagikan Link, dan Salin Link; pemain tidak perlu mengetik URL atau login.
- Layar utama menampilkan indikator `LIVE · Nama Meja` yang dapat ditekan untuk membuka kembali kontrol Live Sharing.
- Akhiri Live Sharing menonaktifkan token/QR lama.
- Fondasi Administrator / Score Keeper, User Management, Voice, Quad wheel, transfer permainan, dan seluruh fix v15.6.7 dipertahankan.

## v15.6.5 — Mobile Quad Wheel Picker

- iPhone/Android: Quad utama dan Koreksi Hasil memakai custom vertical wheel 0–4; swipe atas/bawah, tanpa input keyboard.
- Mobile tidak lagi menampilkan tombol +/− untuk Quad. Desktop mempertahankan − / nilai / +.
- Perhitungan Quad dan batas 0–4 tidak berubah; seluruh Voice v15.5.17 dipertahankan.

## v15.6.5 — Voice Diagnostic / Raw Recognition Learning

- Menambahkan Voice Diagnostic di Setting tanpa mengubah layout layar skor utama.
- Diagnostic merekam transcript mentah SpeechRecognition sebelum parser Mahjong, termasuk hingga 5 alternatif dan confidence bila browser menyediakannya.
- Setiap test terpisah; dianjurkan mengucapkan ZI MO 10–20 kali untuk melihat variasi nyata Safari/WebKit.
- Tombol Salin Hasil Diagnostic menghasilkan laporan yang dapat di-paste ke ChatGPT untuk analisis.
- Diagnostic tidak mengubah winner, HU/ZI MO, discarder, Quad, kombinasi, skor, atau riwayat permainan.
- Seluruh fitur/fix v15.5.14 dipertahankan.

## v15.5.14 — Voice Quad/Gang + ZI MO Recognition Fix

- Memperbaiki pemilihan alternatif SpeechRecognition: hasil Voice paling lengkap diprioritaskan, termasuk Quad/Gang dan kombinasi, bukan berhenti pada alternatif pertama yang hanya mengenali winner/method.
- Memperkuat pengenalan Quad/Gang dengan variasi transkripsi umum: quad/kuad/quat/kwad/kwat/guad dan gang/kang/kong/gong.
- Memperkuat ZI MO agar ucapan “zhi mo” cukup; tetap menerima variasi zi mo/ji mo/ci mo/si mo/chi mo/shi mo serta bentuk rapat.
- “zhi zi mo” tetap kompatibel.
- HU/discarder, kombinasi multi-player, score engine, dan konfirmasi Catat Hasil Tangan tidak diubah.

## v15.5.13 — Voice Kombinasi Poin Multi-Player

- Voice dapat memilih kombinasi untuk beberapa pemain dalam satu ucapan dengan format nama pemain + nama kombinasi, misalnya `Yenny Set Mulia, Alan Petapa, Budi Triplet Murni`.
- Daftar nama kombinasi diambil langsung dari `pats` yang digunakan UI/scoring, sehingga tidak ada daftar poin Voice terpisah.
- Sesuai UI saat ini, setiap pemain tetap memilih maksimum SATU kombinasi; beberapa pemain dapat masing-masing memiliki kombinasinya sendiri.
- Mendukung nama/alias penting seperti Pinhu, Tiga Belas Rakyat, Tujuh Tangga Surga, Tiga Naga Besar, Empat Angin, dan Quad Murni.
- `Quad Murni` dilindungi agar tidak salah dibaca sebagai input jumlah Quad/Gang biasa.
- HU/ZI MO/discarder v15.5.11 dan Quad/Gang multi-player v15.5.12 tetap dipertahankan. Voice tidak pernah otomatis mencatat hasil.

## v15.5.12 — Voice Quad / Gang Multi-Player Parser

- Mempertahankan Smart Context Voice Parser v15.5.11 untuk winner, HU/ZI MO, dan pemberi HU.
- Voice Quad menerima istilah Quad atau Gang, termasuk variasi transkripsi umum: quad/kuad/quat dan gang/kang/kong.
- Beberapa pemain dapat menyebut Quad/Gang dalam satu perintah; setiap nama dipasangkan dengan nilai 0–4 masing-masing.
- Mendukung pola “Yenny Gang dua”, “Yenny dua Gang”, “Gang dua Yenny”, dan “dua Gang Yenny”.
- Voice hanya mengisi UI/preview; pencatatan skor tetap memerlukan tombol Catat Hasil Tangan.

## v15.5.12 — Smart Context Voice Parser

- Voice Score now uses the four active player names as a constrained dynamic vocabulary for contextual/fuzzy matching.
- Winner is resolved from spoken order and HU/ZI MO position; for HU, the second distinct player can be resolved as discarder even when Safari omits “dari/from” or mistranscribes the Mahjong keyword.
- Two distinct player names in a short score command can contextually recover HU when the HU token is lost; one-player commands are not silently guessed as ZI MO.
- Existing exact aliases (Player/Pemain 1–4 and current seat winds), Apple HU/ZI MO variants, Quad parsing, one-button UI, microphone preflight, and Android/Chrome behavior are retained.
- Voice still only fills the score UI/preview and never records a hand automatically.

## v15.5.12 — Apple HU / ZI MO / Discarder + Microphone Permission Fix

- Memperkuat satu tombol Voice untuk Safari/WebKit (iPhone/iPad/Mac) dan Chrome/Android tanpa dialog Dictation tambahan.
- Setiap tap Voice membuang recognizer lama dan membuat instance SpeechRecognition baru, lalu menerapkan bahasa aplikasi sebelum start.
- Audio/video halaman dan Web Speech synthesis yang dapat mengganggu WebKit dihentikan sebelum sesi recognition baru.
- Score Voice dan Voice Game Baru saling membersihkan sesi lama agar tidak berebut mikrofon.
- Menambah lifecycle cleanup, timeout sesi 15 detik, maxAlternatives 5, pemilihan alternatif hasil terbaik, serta pesan error izin/mikrofon/network yang lebih jelas.
- Voice tetap tidak pernah mencatat skor atau memulai Game Baru secara otomatis.
- Bahasa tetap mengikuti aplikasi: Indonesia id-ID, English en-US/en-GB, Mandarin zh-CN.
- Seluruh fitur/fix v15.5.8 dan versi sebelumnya dipertahankan.

## v15.5.8 — One-Button Voice Apple/Safari + Voice Game Baru

- Apple/iPhone/iPad/Mac Safari UI dikembalikan ke satu tombol Voice: dialog Voice Apple/Safari dan kolom Dictation khusus dihapus.
- Tombol Voice sekarang langsung mencoba `SpeechRecognition` / `webkitSpeechRecognition` yang tersedia di browser, termasuk Safari bila API tersedia.
- Jika browser tidak menyediakan direct Speech Recognition, aplikasi menampilkan status bahwa voice langsung tidak didukung dan input manual tetap tersedia; tidak membuka dialog tambahan.
- Bahasa recognition tetap mengikuti bahasa aplikasi (id-ID / en-US / zh-CN).
- Voice Game Baru tetap hanya mengisi nama Pemain 1–4 dan tidak pernah otomatis memulai game.

- Game Baru now has Voice name entry for Pemain/Player 1–4. Voice fills the four name fields only; user must still press Mulai.
- Supports labeled Indonesian/English player commands and Mandarin 玩家/选手 1–4, plus a four-name separated fallback.
- Player names remain limited to 10 characters.
- Preserves v15.5.6 language-following recognition and all prior v15.5.5 score voice fixes.

## v15.5.6 — Voice Language Follows App Language

- Bahasa speech recognition tidak lagi mengikuti bahasa sistem iPhone/browser dan tidak lagi dikunci langsung di engine voice.
- Bahasa voice sekarang mengikuti bahasa aplikasi/dokumen: Indonesia (`id`/`id-ID`) → `id-ID`, English (`en`) → `en-US` atau `en-GB`, Mandarin/Chinese (`zh`) → `zh-CN`.
- Jalur Android/desktop menerapkan locale tersebut langsung ke `SpeechRecognition.lang`.
- Jalur Apple/Safari Dictation menyinkronkan atribut bahasa field Voice dengan bahasa aplikasi; parser voice dan fallback v15.5.5 tetap dipertahankan.
- Seluruh fix HU/discarder lintas platform dan fitur v15.5.5 tetap dipertahankan.

## v15.5.5 — Cross-Platform HU Discarder Voice Parser Fix

- Memperbaiki parser voice pembuang HU untuk Android Speech Recognition dan jalur input Apple/Safari.
- Mendukung bentuk: “Yenny HU dari Herman”, “Yenny HU Herman”, “Yenny HU yang buang Herman”, “Yenny HU yang membuang Herman”, “Yenny HU pembuang Herman”, “Yenny HU dibuang oleh Herman”, dan “Yenny HU from Herman”.
- Nama pemain, Pemain/Player 1–4, serta alias mata angin Indonesia/Inggris/Mandarin tetap mengikuti posisi `seatWinds` aktual.
- Parser yang sama digunakan lintas platform; tidak ada engine skor terpisah.
- Voice tetap hanya mengisi UI/preview dan tidak mencatat skor otomatis.
- Layout footer tetap: `•••` → `CATAT HASIL TANGAN` → `🎙️ Voice`.
- Seluruh fitur dan fix v15.5.4 serta versi sebelumnya dipertahankan.

- iPhone/iPad: tombol Voice membuka input khusus yang memakai Dictation dari keyboard iOS, sehingga tidak bergantung pada Web Speech API Safari yang dapat gagal/hang.
- Setelah Dictation menghasilkan teks, tombol Gunakan Voice meneruskan teks ke parser voice Mahjong yang sama; skor tetap tidak dicatat otomatis.
- Android/desktop tetap memakai SpeechRecognition bila tersedia.
- Parser nama pemain, Pemain/Player 1–4, mata angin Indonesia/Inggris/Mandarin, HU/ZI MO, pembuang, dan Quad dipertahankan.
- Footer tetap: menu ••• → CATAT HASIL TANGAN → Voice.

- Khusus mobile, tombol CATAT HASIL TANGAN dibuat lebih sempit/fleksibel agar tombol Catat, Voice, dan menu bawah tidak bertumpuk.
- Fungsi voice, alias nama/nomor/mata angin, rule skor, dan seluruh fitur v15.5.0 tetap dipertahankan.

## v15.5.0 — Voice Score Input

- Tambah tombol mikrofon untuk mengisi hasil tangan dengan suara tanpa mencatat otomatis.
- Voice mengenali nama pemain aktif, Pemain/Player 1–4, serta mata angin Indonesia/Inggris/Mandarin (Timur/East/Dong, Selatan/South/Nan, Barat/West/Xi, Utara/North/Bei). Alias mata angin mengikuti `seatWinds` permainan aktif.
- Mendukung HU, ZI MO, pemain pembuang, dan Quad 0–4. Hasil voice masuk ke UI/preview yang sama dan pengguna tetap menekan Catat Hasil Tangan sebagai konfirmasi.
- Input manual dan seluruh fitur transfer v15.4.7 tetap dipertahankan.

## v15.4.7 — Receive QR from Shared Image
- `Terima Permainan via QR Code` sekarang memiliki dua pilihan: scan QR dengan Kamera, atau pilih gambar QR dari Foto / File.
- Gambar QR PNG/JPG/WebP yang diterima melalui WhatsApp, Messages, Telegram, AirDrop, email, atau aplikasi lain dapat dibaca langsung dari device penerima.
- Pembacaan gambar dilakukan lokal di browser/device dan menggunakan alur validasi serta konfirmasi yang sama sebelum permainan aktif diganti.
- Metode kamera dan transfer File / Dokumen tetap dipertahankan sebagai pilihan/fallback.
- Seluruh fungsi/fix v15.4.6 dan sebelumnya dipertahankan.

## v15.4.6 — Transfer Close Button Consistency
- Semua tombol X pada modal Transfer Permainan sekarang menggunakan komponen `modal-x` global yang sama dengan halaman/modal lain, sehingga bentuknya bulat dan konsisten.
- Menghapus style `transfer-x` khusus agar tidak ada dua sumber style untuk tombol tutup.
- Seluruh fungsi v15.4.5 tetap dipertahankan.

## v15.4.6 — Share QR Code
- Menambahkan tombol Bagikan QR Code pada dialog Kirim Permainan via QR Code.
- Membagikan QR sebagai file PNG melalui share sheet bawaan iPhone/Android (WhatsApp, Messages, AirDrop, Telegram, email, dan target lain yang tersedia).
- Jika file sharing tidak didukung, aplikasi mencoba membagikan link transfer; fallback terakhir menyimpan PNG.
- Seluruh fungsi/fix v15.4.4 dan sebelumnya dipertahankan.

## Version v15.4.6

## v15.4.6 — User Management moved into Settings
- User Management dipindahkan dari menu global `...` ke dalam `Setting`.
- Tombol User Management di Setting hanya tampil untuk Administrator; user biasa tidak melihatnya.
- Seluruh fungsi/fix v15.4.3 tetap dipertahankan.

## v15.4.3 — QR Compression & Transfer Header Fix
- Tombol × pada dialog Transfer/Kirim/Terima QR sejajar di kanan title.
- Payload QR dikompresi gzip secara lokal sebelum dibuat QR agar riwayat permainan yang lebih panjang tetap dapat masuk dalam QR.
- Penerima mendukung QR terkompresi serta format QR v15.4.2 dan tetap meminta konfirmasi sebelum mengganti permainan aktif.
- Transfer file/dokumen tetap tersedia sebagai fallback untuk permainan yang ekstrem panjangnya.


- Menambahkan **Kirim Permainan** dan **Terima Permainan** pada menu utama untuk memindahkan permainan aktif antar user/device.
- Transfer membawa nama 4 pemain, skor, ronde/tangan, dealer/seat wind, dan riwayat permainan sehingga permainan dapat dilanjutkan pada device penerima.
- Pengiriman menggunakan file transfer `.mahjong.json` melalui Share Sheet bila didukung; fallback mengunduh file untuk dikirim manual.
- Penerima wajib mengonfirmasi sebelum state permainan lokal diganti.
- Tidak memerlukan service-role key, tabel database baru, atau perubahan Edge Function Supabase.

- Step 1 is now a dynamic status/instruction line: winner, HU/ZI MO, and discarder are shown as selections progress.
- The next required action is shown inline in red; redundant red validation text at the bottom of the score panel is removed.
- Completed HU status shows e.g. `Pemain yang menang: Ari (Barat), menang dengan HU dari Yenny`; ZI MO shows the corresponding ZI MO status.
- Winner status wraps safely on mobile and cannot overflow horizontally.
- Tall mobile screens such as Samsung A17 use more available viewport height for the table while preserving compact iPhone behavior.
- Score preview remains visible after the required HU/ZI MO selections are complete.


Approved responsive header/footer navigation and fluid four-player table.

# Mahjong Score 4P PWA

Files are ready for GitHub Pages.

## Publish
1. Create a GitHub repository, for example `mahjong-score`.
2. Upload all files from this package to the repository root.
3. Open Settings > Pages.
4. Under Build and deployment choose **Deploy from a branch**.
5. Select **main** and **/(root)**, then Save.
6. Open the GitHub Pages address shown in Settings > Pages.

On iPhone: open the site in Safari > Share > Add to Home Screen > Open as Web App.
On Android: open in Chrome and use Add to Home screen / Install app.

Scores are stored locally on each device/browser.

Update istilah permainan:
- Tombol “CATAT HASIL RONDE” diubah menjadi “CATAT HASIL TANGAN”.
- TANGAN dihitung per ronde dan kembali ke Tangan 1 saat Ronde + ditekan.
- Riwayat menampilkan nomor Ronde dan Tangan.

Update: grid Poin Kombinasi sekarang fluid berdasarkan lebar aktual area yang tersedia menggunakan CSS auto-fit/minmax, bukan jumlah kolom tetap per device.


### v12
- Setelah Catat Hasil Tangan berhasil, tampil notifikasi non-blocking “✓ Skor sudah tercatat”.
- Notifikasi hilang otomatis sekitar 2,8 detik tanpa tap/klik.


## v12.1
- 8 UI/UX improvements: proportional desktop table, history/recap modals in global menu, icons, conditional combination total, auto-collapse combination panel after record, safer footer menu placement, and stronger winner highlight.

- v12.1 UI refinement: compact, high-contrast titled headers for Riwayat Permainan and Rekap Semua Pemain modals on desktop/mobile.

## v12.3
- Aturan Bermain: tombol Share PDF di kiri atas, X tetap di kanan atas.
- Menambahkan katalog lengkap 34 jenis tile (Dots, Characters, Bamboo, Winds, Dragons) memakai aset tile aplikasi sendiri beserta label nama.
- Katalog tile ikut dimasukkan ke PDF Aturan Bermain.
- Menghapus tombol bawah “Tutup Aturan”; penutupan menggunakan X.


## v12.6
- iPhone/mobile: header dibuat lebih compact tanpa mengubah proporsi meja/panel; versi dipindahkan ke bawah judul Mahjong Score.
- iPhone/mobile: tombol Catat Hasil Tangan digeser ke kiri setelah tombol menu footer dengan jarak yang jelas.
- Desktop tetap menggunakan layout sebelumnya.


## v12.7
- Fix iPhone: tombol menu `...` di footer kembali dapat ditekan.
- Popup Undo/Reset dipaksa terbuka ke atas footer dan tidak lagi terkena aturan posisi menu header v12.6.
- Tidak mengubah fungsi Undo, Reset, Catat Hasil Tangan, atau layout lain.

## v12.8 — Login Admin/User
- Login persisten memakai Supabase Auth; Game Baru tidak logout.
- Tidak ada pendaftaran publik. User baru dibuat dari User Management oleh Administrator.
- User Management hanya terlihat untuk akun dengan app_metadata.role = admin.
- Logout tersedia di menu utama.
- Konfigurasi frontend ada di auth-config.js. Jangan pernah memasukkan service_role key ke file frontend.
- Edge Function supabase/functions/mahjong-user-admin menangani create/list/enable-disable user dengan service role hanya di server.


## v12.9 — Supabase Production Configuration
- Project URL dan publishable key Supabase Mahjong Score sudah dipasang di `js/auth-config.js`.
- Login Admin/User v12.8 dipertahankan.
- Cache PWA dinaikkan ke v12.9.
- Edge Function yang digunakan: `mahjong-user-admin`.

## v13.0 — User Delete, iPhone User Management, PIN 4 Digit
- User Management menambahkan tombol minus merah untuk menghapus user non-Administrator, dengan konfirmasi; Administrator dilindungi dari delete di UI dan Edge Function.
- Layout User Management iPhone dibuat lebih compact agar daftar user dan action lebih mudah terlihat dalam viewport.
- Login menggunakan PIN tepat 4 digit. PIN dikirim ke Supabase Auth sebagai password internal berawalan `mj` agar tetap memenuhi minimum password Supabase; pengguna hanya melihat/mengetik 4 digit.
- Pembuatan user baru menggunakan PIN awal tepat 4 digit.
- Edge Function `mahjong-user-admin` menambahkan action `delete` dan `set-pin` serta create berbasis PIN.


## v13.1 — Ubah PIN dari User Management
- Administrator dapat menekan **Ubah PIN** pada setiap akun, termasuk akun Administrator sendiri.
- PIN baru wajib tepat 4 digit dan diminta dua kali untuk konfirmasi.
- Akun Administrator tetap tidak dapat dinonaktifkan atau dihapus dari User Management.
- Layout tombol User Management di iPhone dibuat lebih compact agar aksi Ubah PIN, Aktif/Nonaktif, dan hapus tetap muat.

## v15.0 — Approved Header + iPhone User Management Layout
- Browser/desktop: logo Mahjong Score sedikit diperbesar; instruksi ditempatkan tepat di bawah title dengan jarak vertikal lebih lega.
- iPhone: header memakai safe-area atas agar logo/title tidak bertabrakan dengan status bar; logo sedikit diperbesar tanpa memperbesar header secara berlebihan; nomor versi berada tepat di bawah title.
- iPhone User Management: setiap user memakai baris compact; username/status fleksibel di kiri, tombol Ubah PIN, Aktifkan/Nonaktifkan, dan minus tetap satu baris di kanan; admin hanya memiliki Ubah PIN.
- Daftar User Management tidak horizontal overflow dan dapat scroll vertikal bila user banyak.
- Seluruh fungsi/fix v13.1 dan sebelumnya dipertahankan.


## v15.2
- Reset mempertahankan nama pemain, tetapi mengulang skor, ronde/tangan, dealer, riwayat, Quad, kombinasi poin, dan state permainan aktif ke awal.
- Game Baru kembali memulai dengan nama default Pemain 1–Pemain 4 dan state permainan baru.
- Input Quad iPhone/desktop otomatis select-all saat dipilih; iPhone meminta keyboard digit.
- Spinner number bawaan Quad diganti kontrol minus di kiri dan plus di kanan, termasuk Koreksi Hasil.


## v15.2 Cleanup
- Konsolidasi 21 blok CSS menjadi satu stylesheet internal tanpa mengubah urutan cascade.
- Hapus folder tile SVG eksternal yang tidak direferensikan; katalog tile menggunakan TILE_IMAGES embedded.
- Rapikan penamaan blok auth/Quad legacy.
- Sinkronkan label versi PDF panduan/aturan ke v15.2.
- Sederhanakan service worker dengan menghapus daftar TILE_ASSETS kosong dan naikkan cache ke v15.2.
- Tidak ada perubahan aturan skor, layout, atau workflow dibanding v15.1.


## v15.2.2 Regression Fix
- Perbaiki angka Quad yang tidak terlihat pada kontrol `− angka +`, termasuk Koreksi Hasil, dengan warna teks eksplisit yang aman untuk Safari/iPhone dan desktop.
- Tampilkan nomor versi v15.2.2 pada header browser/desktop dan pertahankan tampilannya di bawah title pada iPhone.
- Naikkan cache PWA ke v15.2.2 agar perbaikan UI segera terambil.


## v15.2.2 iPhone Quad Value Visibility Fix
- Memperbaiki nilai Quad pada Koreksi Hasil yang tidak terlihat di iPhone/Safari.
- Input Quad memakai field numeric-keyboard berbasis text agar angka dirender stabil, dengan nilai terpusat dan kontras eksplisit.
- Kontrol − [angka] +, select-all, perhitungan, dan seluruh fungsi v15.2.1 dipertahankan.


## v15.2.3 History Divider Cleanup
- Riwayat Permainan tidak lagi menampilkan dua garis mendatar berdekatan tepat di bawah header modal.
- Border atas pada entri riwayat pertama dihilangkan; garis pemisah antar-entri berikutnya tetap dipertahankan.
- Seluruh perbaikan v15.2.2, termasuk visibilitas nilai Quad pada iPhone/Safari, tetap dipertahankan.
- Cache PWA dan label versi disinkronkan ke v15.2.3.


### v15.2.4
- Mobile header keeps the Mahjong logo and title side-by-side to save vertical space, including iPhone Display Zoom Larger Text.
- Quad controls on phones (iPhone/Android) use direct numeric fields only; minus/plus remain on desktop.
- The same mobile Quad behavior applies in Koreksi Hasil.


### v15.2.5
- Quad per pemain dibatasi 0–4 sesuai struktur tangan Mahjong standar (4 set + 1 pair).
- Input Quad Catat Hasil Tangan dan Koreksi Hasil otomatis membatasi nilai maksimum 4 dan minimum 0.
- Tombol + desktop berhenti di 4 dan tombol − berhenti di 0; mobile tetap memakai field angka langsung tanpa tombol ±.


### v15.2.7
- Alignment nomor langkah 1, 2, 3, dan 4 pada panel Catat Hasil Tangan diseragamkan pada satu sumbu kiri di desktop dan mobile, termasuk iPhone Display Zoom Larger Text.
- Bagian Quad menampilkan petunjuk `0–4 per pemain`; jika pengguna mencoba memasukkan nilai di atas 4, nilai tetap dibatasi ke 4 dan petunjuk sementara berubah menjadi peringatan `Maksimum 4 Quad per pemain`.
- Sinkronisasi versi diperbaiki: heading README, aplikasi, PDF/Rules, dan cache PWA mengikuti v15.2.7.


### v15.2.13
- Khusus mobile phone (≤600px), kontrol Quad dibuat vertikal: `+` di atas, nilai Quad di tengah, dan `−` di bawah. Desktop tetap memakai `− [nilai] +`. Batas Quad tetap 0–4.
- Pada dialog Game Baru, tap/click field nama pemain langsung memilih seluruh nama (select-all) agar nama default Pemain 1–4 dapat langsung diganti. Berlaku pada mobile dan desktop.
- Seluruh fix v15.2.12, termasuk keterbacaan status Android dan instruksi langkah berikutnya berwarna merah, dipertahankan.
- Versi aplikasi, PDF/Rules, README, dan cache PWA disinkronkan ke v15.2.13.

### v15.2.12
- Fix khusus Android/Samsung untuk petunjuk Langkah 1: `Lanjut pilih HU atau ZI MO` dan `Lanjut pilih pemain yang membuang kartu` dipaksa merah, termasuk `-webkit-text-fill-color` agar tidak tertimpa warna gelap parent pada browser Android/WebKit/Blink.
- Teks utama status Langkah 1 tetap gelap dan kontras; hanya petunjuk `Lanjut ...` yang merah.
- Tidak ada perubahan tinggi, spacing, atau layout Samsung A17/mobile.
- Versi aplikasi, PDF/Rules, README, dan cache PWA disinkronkan ke v15.2.12.

### v15.2.11
- Fix khusus keterbacaan Langkah 1 pada Android/Samsung: teks utama status pemenang dipaksa warna gelap dan tidak lagi menjadi putih/pucat.
- Warna merah tetap hanya untuk petunjuk tindakan berikutnya (`Lanjut ...`).
- Tinggi/layout mobile v15.2.10 sengaja tidak diubah agar ruang tetap tersedia saat summary skor muncul.
- Versi aplikasi, PDF/Rules, README, dan cache PWA disinkronkan ke v15.2.11.

### v15.2.10
- Langkah 1 dipindahkan dari panel skor ke area meja: petunjuk `Tap pemain yang menang` dan status pemenang sekarang tampil di tengah meja sehingga panel bawah lebih ringkas.
- Urutan langkah diubah menjadi 1 Pilih pemenang → 2 Cara menang → 3 Quad → 4 Kombinasi poin.
- Kombinasi poin tetap collapsible dan sekarang menjadi langkah terakhir agar alur input lebih natural dan hemat ruang vertikal.
- Pesan peringatan merah pada mobile diperbesar sedikit agar lebih mudah dibaca.
- Compact layout tetap mempertahankan kontrol Quad mobile berupa field angka langsung dan desktop berupa − / angka / +.
- Versi aplikasi, PDF/Rules, README, dan cache PWA disinkronkan ke v15.2.10.


### v15.4.0

- Edit Nama Pemain: saat field nama ditap/diklik atau mendapat fokus, seluruh nama langsung terseleksi (select-all) agar dapat langsung diganti; berlaku mobile dan desktop.
- Transfer permainan antar user/device melalui menu Kirim Permainan / Terima Permainan.
- Seluruh fix dan requirement v15.2.13 dipertahankan.
- Versi aplikasi, PDF/Rules, README, dan cache PWA disinkronkan ke v15.4.0.

## v15.4.0 — Transfer Permainan via QR Code
- Menu baru **Kirim via QR Code** menampilkan QR dari permainan aktif tanpa membuat/download file.
- Device penerima cukup scan dengan kamera iPhone/Android; Mahjong Score terbuka dan meminta konfirmasi sebelum mengganti permainan aktif.
- Data pada device pengirim tidak dihapus atau diubah.
- QR langsung dibatasi untuk payload yang aman; jika riwayat terlalu panjang, aplikasi meminta memakai transfer file sebagai fallback.


## v15.4.2 — Transfer Permainan Menu & Local QR Fix
- Menu global `•••` sekarang hanya menampilkan satu menu induk `Transfer Permainan`.
- Di dalamnya tersedia Kirim via QR Code, Kirim via File/Dokumen, Terima via QR Code, dan Terima via File/Dokumen.
- QR Code pengiriman dibuat secara lokal/offline di aplikasi, tidak lagi bergantung pada layanan gambar QR eksternal.
- Terima via QR memberi petunjuk scan menggunakan Kamera iPhone/Android; konfirmasi sebelum menimpa permainan aktif tetap dipertahankan.
- Seluruh fungsi/fix versi sebelumnya dipertahankan.


### v15.5.12
- Apple/Safari voice parser recognizes common phonetic variants of HU and ZI MO.
- HU discarder detection accepts additional connector phrases and a contextual second-player fallback.
- Voice Score and Voice Game Baru perform microphone permission preflight on the Voice tap, release the temporary media stream, then start a fresh recognition session. Browser/OS remains authoritative for permission.
- Android/Chrome uses the same robust flow; all v15.5.9 behavior is retained.


## v15.6.5 Voice Diagnostic-trained parser
- Menambahkan alias ZI MO berdasarkan hasil nyata iPhone Safari id-ID: cemok, cemuk, cemuh, cemoko, gemuk.
- Menambahkan `kuat` sebagai variasi recognition QUAD dan `cong`/`kan` sebagai variasi KONG/GANG hanya di parser Quad.
- Confidence Safari tetap tidak dipakai untuk keputusan parser.
- Voice Diagnostic tetap tersedia untuk pengujian lanjutan.


## v15.6.5
- Mobile Quad wheel now uses native momentum scrolling with CSS scroll snap for smoother iPhone/Android operation; no mobile keyboard.
- Voice Diagnostic is restricted to Administrator role in both Settings visibility and function access.

## v15.6.5 — Two-role & Multi-table Live View
- Login roles: Administrator and Score Keeper only.
- Score Keeper is separate from the four players and may or may not be one of them.
- Administrator and Score Keeper can publish an active table as a QR Live Score.
- Players/viewers do not need accounts: QR Guest Live Viewer is read-only and receives updates only for that Game/Table token.
- Multiple tables are isolated by unique live-game records/tokens.
- Requires the historical v15.6.1 schema (archived in `supabase_scheme_history.sql`) and the `mahjong-user-admin` Edge Function to accept `role` on create and `set-role`.


## v15.6.5 — Simplified Account Roles
- Removed the Player account role before first v15.6 deployment.
- Only Administrator and Score Keeper can log in.
- Players follow a table by scanning its QR as Guest Live View; no player account is required.
- Guest Live View remains read-only and scoped to one live-game token.
- Legacy authenticated users without a supported role fall back to Score Keeper so an upgrade does not lock out existing operators.


## v15.6.5
- Memulihkan renderer inti kartu pemain dan kontrol winner/HU-ZI MO yang hilang.
- Mempertahankan mobile momentum Quad wheel v15.5.19 dan fondasi multi-role/multi-table v15.6.1.
- Tidak memerlukan perubahan Supabase tambahan dibanding v15.6.1.


## v15.6.5 — Role Picker + Score Keeper Backend
- Tombol Role tidak lagi memakai prompt/input teks. Administrator memilih langsung Administrator atau Score Keeper.
- Administrator tetap mewarisi seluruh kemampuan Score Keeper.
- Sertakan folder `supabase/functions/mahjong-user-admin/index.ts` sebagai replacement Edge Function yang menerima `admin` dan `scorekeeper`, termasuk aksi `set-role`.


## v15.6.5
- Fix Role picker modal stacking: Role picker now always renders above User Management.
- Current role is highlighted when the picker opens.
- No SQL/backend schema change from v15.6.3.


## v15.6.5 — User Management New User Form Reset
- Username dan PIN Tambah User selalu kosong setiap User Management dibuka.
- Setelah user berhasil ditambahkan, Username/PIN kembali kosong dan role kembali ke Score Keeper.
- Tidak ada perubahan backend/SQL pada release ini.


## v15.6.7 — Administrator Edit Username
- Administrator dapat mengubah username user dari User Management melalui tombol Edit Username.
- Username divalidasi dan harus unik; login berikutnya menggunakan username baru.
- Edge Function mahjong-user-admin menambahkan action set-username yang memperbarui email login internal dan user_metadata.username secara atomik.
- Role tetap hanya Administrator dan Score Keeper; Administrator tetap memiliki seluruh hak Score Keeper.


### v15.6.10
- Memindahkan indikator LIVE dari header ke sudut kiri atas di dalam meja hijau.
- Indikator diperkecil karena hanya berfungsi sebagai penanda status.
- Titik hijau tetap pulse saat sinkronisasi sehat; status gangguan tetap oranye.
- Tap indikator tetap membuka kontrol Live Score.


## v15.6.14
- Fix kritis Guest Live Viewer: viewer berada di dalam `.app`, sehingga `app.style.display=none` ikut menyembunyikan viewer. Mode guest sekarang menyembunyikan sibling UI Score Keeper tanpa menyembunyikan viewer.
- Error/loading Live selalu terlihat; tidak lagi menghasilkan layar kosong.


v15.6.28: Quad input and Quad correction order follows live seat winds Dong -> Nan -> Xi -> Bei. Player-index data and scoring remain unchanged.


## v15.6.28 — Guest Fullscreen Android dan Safari Mac
Tombol ikon ⛶ tersedia pada header Live Viewer untuk Android dan Safari MacBook. Pada iPhone/iPad Safari tombol disembunyikan. Tekan ikon untuk masuk/keluar fullscreen bila didukung browser; pada Safari Mac yang tidak mendukung Fullscreen API tersedia petunjuk Control + Command + F. Score Keeper tidak berubah.


v15.6.28: Sembunyikan URL panjang di dialog QR Live; tombol fullscreen Guest tampil pada Android/Mac (tanpa atribut hidden), disembunyikan pada iPhone/iPad Safari.


## v15.6.28 — Arah tempat duduk dan urutan pembuang HU
- Angin Dong → Nan → Xi → Bei mengikuti arah berlawanan jarum jam berdasarkan indeks kursi fisik.
- Pilihan pembuang HU diurutkan mundur dari angin pemenang, tidak lagi berdasarkan nomor pemain.
- Game tersimpan dimigrasi sekali untuk arah angin baru; skor, nama, dan riwayat tetap utuh.


## v15.6.32 — Voice Diagnostic Cloud Reporting
Admin can opt in with a checkbox in Voice Diagnostic. Once opted in, every real speech test, speech error and offline parser self-test is queued and automatically uploaded to Supabase. No audio files are uploaded. Offline reports retry when online or when the diagnostic screen is opened. Turning consent off stops new uploads and clears unsent local reports. For new installations, refer to the v15.6.31 section in `supabase_scheme_history.sql` and apply required historical migrations individually in order; do NOT run the whole history file. For existing v15.6.31 installations, only run `supabase_latest.sql`. The database allows authenticated admins only to upload/view reports. For reviewing data use the Supabase Table Editor (`mahjong_voice_diagnostics`) or export its rows for the next development session; the assistant cannot silently read the database in future chats. Speech test target list is not ground truth for an individual spoken utterance; raw transcription and parser outputs must be reviewed manually before adding aliases.


## v15.6.41 — Periksa Target Sekarang
Administrator dapat meminta pemeriksaan pada target ON melalui tombol **🔍 Periksa Target Sekarang**. Permintaan memakai kolom `request_id` dan `request_at` pada tabel target; perangkat aktif mengirim laporan `remote_request` dengan ID korelasi yang sama. Admin menunggu maksimal 90 detik dan melihat laporan yang masuk, kemudian dapat menekan Analisis AI. Tidak mengakses audio, layar, atau skor. Untuk fitur ini, jalankan `supabase_latest.sql` di SQL Editor sekali dan perbarui seluruh berkas GitHub Pages. Jika perangkat target belum membuka v15.6.41, permintaan tidak akan dijalankan.


## v15.6.41 — Riwayat Permainan Pagination
Riwayat Permainan memiliki header tetap (judul, navigasi nomor halaman, dan tutup) serta area hasil yang dapat digulir. Tiap halaman memuat lima hasil kecuali halaman pertama memuat sisa pembagian lima (misalnya 13 hasil: 3 / 5 / 5). Koreksi dan Hapus Quad tetap menggunakan indeks riwayat asli. Tidak ada perubahan SQL atau Edge Function.


### v15.6.55 — Modular Voice Parser
Voice parser terpisah di `js/voice-parser.js`; pengujian transkripsi manual tersedia untuk admin pada Voice Diagnostic. Sinonim bahasa Indonesia untuk ambil sendiri / ambil buangan ditambahkan. Perubahan parser perlu pembaruan cache Service Worker.


### v15.6.56 — JavaScript Folder Cleanup
`qrcode-local.js` dipindahkan ke `js/qrcode-local.js`. Semua referensi script dan cache Service Worker diperbarui. File `js/voice-parser.js` tetap. Tidak ada perubahan logika QR atau fitur lainnya.


### v15.6.57 — JavaScript Structure Cleanup
`ai-diagnostic.js` dan `auth-config.js` dipindahkan dari root ke `js/`. Semua referensi di `index.html`, cache `sw.js`, dan dokumentasi diperbarui. Tidak mengubah logika autentikasi, diagnostik AI, ataupun aturan permainan.
