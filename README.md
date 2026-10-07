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
- Project URL dan publishable key Supabase Mahjong Score sudah dipasang di `auth-config.js`.
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
