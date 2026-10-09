# Upload GitHub — Mahjong v15.6.87

ZIP ini menyertakan folder tersembunyi `.github/workflows/`. Jangan menghapusnya.

**Penting:** Upload via browser GitHub (Add file → Upload files) kadang tidak memasukkan folder tersembunyi `.github`. Jika setelah upload tab Actions masih hanya menampilkan `pages-build-deployment`, gunakan Git di Mac Terminal untuk commit/push seluruh folder, atau buat dua file workflow di GitHub UI dengan isi dari ZIP:

- `.github/workflows/gemini-voice-autofix.yml`
- `.github/workflows/voice-parser-guard.yml`

Jangan upload ZIP sebagai satu file ke repository; ekstrak dahulu. Pastikan file `.github/workflows` benar-benar ter-commit.

Folder `tests/` dan `scripts/` **WAJIB**: workflow menjalankan `node tests/voice-parser.test.cjs` dan `node scripts/voice-autofix.mjs`. Jangan dihapus.

Workflow hanya mengizinkan PR Auto-Fix menyentuh `js/voice-parser.js`. File `index.html` tidak berubah pada paket ini.

**Belum otomatis memperbaiki tanpa data koreksi terkonfirmasi.** Lihat `AUTO_FIX_SETUP.md`.
