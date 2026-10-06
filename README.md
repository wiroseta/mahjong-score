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
