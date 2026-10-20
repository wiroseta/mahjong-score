# Pelatihan pengenal tile offline

Komponen baru ini melatih classifier dari potongan gambar berlabel; tidak mencocokkan hash foto. Detektor posisi tetap komponen terpisah dan belum diganti. Model kandidat tidak otomatis layak produksi.

Dataset JSON berisi `samples`, masing-masing `{image, source, split, tile}`. `image` adalah path relatif potongan tile, `source` adalah ID foto/sesi asal, `split` salah satu train/validation/test, `tile` salah satu 34 jenis tile. Potongan dari source yang sama wajib berada pada split yang sama. Path tidak boleh keluar folder dataset. Gambar harus sudah dipotong sesuai bounding box dan diperiksa labelnya.

`train_classifier.py dataset.json candidate.json` melatih jaringan kecil RGB24 → 64 ReLU → 34 softmax menggunakan NumPy dan Pillow. Tidak ada Gemini di proses inferensi. Kandidat menyimpan bobot, laporan held-out dan hash sumber; tidak menyimpan piksel atau jawaban per foto. Data pelatihan tidak dihapus oleh trainer. Pelatihan tidak mengatasi tile yang tidak dideteksi.

Jalankan tes sebelum menggunakan pipeline. Jangan terbitkan kandidat hanya karena akurasi training tinggi. Dibutuhkan pengujian seluruh tangan dan poin pada foto nyata terpisah, serta perbandingan dengan baseline. Bobot model baru belum tersedia. Pelatihan dan aktivasi produksi belum dilakukan.
