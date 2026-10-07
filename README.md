## Version v15.2.7

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
