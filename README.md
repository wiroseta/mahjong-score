## Version v12.1

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
