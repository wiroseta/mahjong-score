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
