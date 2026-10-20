# Mahjong Score 15.9.1 — 20 Oktober 2026

Rilis tahap pengumpulan data untuk meningkatkan pembaca offline. Belum ada bobot model baru; akurasi foto belum diklaim meningkat.

- Keterangan “tap untuk buka/tutup” diperkecil dan memakai warna petunjuk sesuai tema, seperti batas Quad.
- Hasil foto menampilkan potongan dan pilihan jenis tiap tile. Pengguna dapat memperbaiki jenis, membuang deteksi palsu, dan menambah tile terlewat. Koreksi tidak mencatat skor permainan secara otomatis.
- Poin menggunakan susunan pembacaan yang sama dengan kartu tile yang ditampilkan. Pencocokan hash/koreksi foto lama tidak lagi menggantikan hasil model.
- Foto yang gagal atau tidak digunakan masuk antrean privat, dengan alasan berbeda. Pemberitahuan penggunaan foto ditampilkan. Foto dibatasi maksimal 800 KB, maksimal tiga foto menunggu per akun di perangkat dan 128 foto aktif di server (sekitar 100 MB payload). Saat penuh, foto baru tidak disimpan; pencatatan permainan tetap berjalan.
- Administrator dapat memproses antrean melalui Gemini proyek gratis yang dikonfirmasi pemilik. Dua usulan diperiksa posisi/jenis/konsistensi dan aturan. Usulan meragukan menunggu konfirmasi; usulan yang lolos menjadi kandidat dataset, bukan model langsung. Kuota habis menunggu 24 jam, tanpa fallback berbayar.
- Sesuai keputusan pemilik, kumpulkan data dahulu dan jalankan pelatihan secara manual. Ekspor dataset serta trainer classifier RGB24 disediakan. Pelatihan harus mencakup seluruh kelas dan memakai foto uji terpisah. Detektor posisi model lama belum diganti.
- Belum ada pelatihan terjadwal, publikasi model otomatis, atau penghapusan foto otomatis yang diaktifkan. Penghapusan ditahan sampai data selesai digunakan dan model lolos; data uji yang dipertahankan tidak boleh ikut dibuang. Foto tidak dihapus hanya karena Gemini menyetujui label.
- Cache aplikasi diperbarui ke 15.9.1. Aset pembaca lokal didaftarkan untuk offline; model/runtime besar diunduh bila tersedia. Penggunaan pertama tetap memerlukan unduhan, dan penyimpanan browser dapat dibersihkan oleh perangkat.

## Verifikasi dan batas
Tes kode, trainer dengan data sintetis, dan RLS antrean telah dijalankan. Ini bukan pengukuran akurasi model baru. Belum diuji pada kamera fisik Android/iPhone atau alur Gemini dengan foto antrean nyata. Model ONNX lama tetap memiliki keterangan lisensi AGPL di NOTICE; rilis ini tidak menyatakan persoalan lisensi upstream sudah selesai.
