# Bantuan Gemini gratis untuk pelatihan

Endpoint `mahjong-training-labels` dan `mahjong-training-worker` sudah di-deploy pada 20 Oktober 2026. Antrean privat `mahjong_training_jobs` sudah dibuat dan diuji hak akses. Status rilis website mengikuti RELEASE_v15.9.1.md.

Pemilik mengonfirmasi bahwa API key proyek gratis khusus tersimpan dengan nama `GEMINI_API_KEY`. Endpoint memakai key itu; jika tersedia, `GEMINI_TRAINING_FREE_API_KEY` didahulukan. Tidak meminta key melalui chat. Status Free Tier merupakan konfirmasi pemilik, bukan inspeksi billing otomatis. Jangan mengaktifkan billing pada proyek ini.

Model `gemini-3.8-flash` memiliki Free Tier pada dokumentasi harga yang diperiksa 20 Oktober 2026. Endpoint tidak memilih fallback atau retry berbayar. Worker membuat dua usulan per contoh dan memeriksa konsistensi/kotak/aturan; hasilnya kandidat bahan pelatihan, bukan model produksi. HTTP 429 menyimpan status menunggu selama 24 jam.

Belum diuji ujung-ke-ujung dengan foto antrean nyata dan kredensial administrator. Modul browser administrator dapat menjalankan pemrosesan antrean saat dibuka; penjadwal tanpa administrator belum dipasang. Pelatihan otomatis lokal, publikasi model, dan pembersihan foto otomatis belum terhubung. Pilihan lokasi pelatihan sedang ditanyakan kepada pemilik. Jangan menyatakan sistem selesai.
