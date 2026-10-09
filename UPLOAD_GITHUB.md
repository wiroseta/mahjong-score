# Upload GitHub — Mahjong v15.6.89 (GitHub Desktop)

ZIP ini menyertakan folder tersembunyi `.github/workflows/`. Jangan menghapusnya.

**Penting:** Upload via browser GitHub (Add file → Upload files) kadang tidak memasukkan folder tersembunyi `.github`. Pastikan kedua workflow berikut terlihat pada tab Actions setelah merge:

- `.github/workflows/gemini-voice-autofix.yml`
- `.github/workflows/voice-parser-guard.yml`

Jangan upload ZIP sebagai satu file ke repository; ekstrak dahulu. Pastikan file `.github/workflows` benar-benar ter-commit.

Folder `tests/` dan `scripts/` **WAJIB**: workflow menjalankan `node tests/voice-parser.test.cjs` dan `node scripts/voice-autofix.mjs`. Jangan dihapus.

Workflow hanya mengizinkan PR Auto-Fix menyentuh `js/voice-parser.js`. File `index.html` tidak berubah pada paket ini.

**Belum otomatis memperbaiki tanpa data koreksi terkonfirmasi.** Lihat `AUTO_FIX_SETUP.md`.

## Pembaruan Pull Request #3
Ekstrak ZIP ini lalu salin isinya ke folder repository pada branch `update-v15.6.89`. Jangan salin file ZIP sebagai satu file. Commit perubahan, Push origin, lalu periksa Pull Request #3. Jangan merge sebelum check **Voice Parser Regression** berhasil dan perubahan diperiksa. Tidak ada jadwal otomatis dan tidak ada auto-merge.
