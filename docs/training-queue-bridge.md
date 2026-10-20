# Penghubung antrean foto dan pelatihan offline

Setting → Foto & Pelatihan menyatukan tab Uji Foto Google dan Kelola Foto. Tombol menu memakai elemen button, ikon, teks tengah, dan kelas tema yang sama dengan tombol Setting lainnya. Halaman Kelola Foto tetap dapat dibuka langsung untuk administrator.

## Pemakaian
1. Periksa foto antrean dan simpan label yang benar hingga berstatus Siap dilatih.
2. Tekan Periksa & latih model pada Kelola Foto. Tidak perlu ekspor atau mengirim berkas ke chat.
3. Program mengambil hanya foto candidate melalui sesi administrator yang sama dan kebijakan akses yang sudah ada. Pemeriksaan foto dan label, duplikat, pembagian berdasarkan sumber foto, 42 kelas pada train, dan tersedianya train/validation/test dilakukan sebelum pelatihan.
4. Jika bahan kurang, ringkasan dan rincian kekurangan ditampilkan. Tambahkan foto baru; jangan memindahkan potongan foto yang sama antarbagian untuk memaksakan kelengkapan.
5. Jika cukup, gambar dipotong RGB24 dan dikirim ke Web Worker pada perangkat administrator. Jaringan RGB24 → 64 ReLU → 42 softmax dilatih dengan validasi, early stopping, dan laporan akurasi tile. Potongan RGB identik lintas bagian ditolak. Hentikan membatalkan worker.
6. Hasil merupakan model kandidat kompatibel dengan trained-classifier.js; tersedia tombol Unduh model kandidat untuk menyimpan. Biarkan halaman terbuka selama pelatihan. Kandidat berada di memori halaman sampai diunduh; memuat ulang akan menghapusnya.

## Batas yang jelas
Tidak ada unggahan foto baru ke penyedia lain, layanan komputasi baru, atau kunci rahasia di browser. Google hanya dipakai tombol pemrosesan anotasi yang sudah ada. Penghubung membaca antrean secara langsung; tidak memerlukan layanan lokal atau komputer pengembang yang terus menyala. Pergantian akun membatalkan pekerjaan dan menghapus hasil dari halaman. Foto antrean dan status kandidat tidak dihapus atau ditandai diterima.

Model ONNX aktif tidak diganti. Akurasi tile pada kandidat belum membuktikan akurasi seluruh susunan atau nol kesalahan poin. Kandidat tidak diterbitkan otomatis. Pemeriksaan/penerimaan model produksi dan retraining detektor lokasi tetap tahap terpisah.

Data nyata terakhir: 3 foto, 37 tile, 22/42 kelas; belum ada foto pada bagian validasi. Pelatihan data nyata akan tertahan dengan pesan kekurangan yang dapat ditindaklanjuti.
