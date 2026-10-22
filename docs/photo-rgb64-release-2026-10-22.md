# Pembaca foto RGB64 — 22 Oktober 2026

Model utama memakai face-residual64.onnx (64×64 RGB). Foto dinilai berdasarkan posisi duduk, Fan, susunan dan tangan menang lengkap; Bunga/Musim tidak masuk jumlah tile utama. Hasil foto akhir yang sah tidak menunggu pemilihan pemenang untuk menilai bentuk tangan.

Hanya tile berkeyakinan di bawah85% yang ditampilkan untuk centang konfirmasi. Setelah seluruh konfirmasi, model membaca foto ulang pada dua area; identitas dan posisi harus sesuai. Konflik pembacaan tetap ditahan. Poin tambahan mengisi isian penilaian tanpa dijumlahkan berulang. Tombol Terapkan poin tampil di bawah ringkasan; tanpa tambahan poin hanya tampil informasi. Saldo/riwayat satu tangan tetap dicatat melalui alur aplikasi dengan Hu/Zi Mo dan pembuang yang sesuai.

Regresi lima foto permainan: model48 63/64 tile, model64 64/64 (5/5 foto tepat jenis dan jumlah). Regresi publik dengan kotak acuan manusia: 582/634 menjadi586/634. Foto pengembangan sudah pernah diamati; bukan pengukuran independen atau jaminan100%. Tidak ada foto pribadi, potongan dataset, checkpoint latihan atau model96 yang disertakan dalam rilis ini.

Model64 SHA-256: b6bf46c57be45020e702f349ce6cc4dab654309cb489a4a46052b06ffdc4cbcd. Model48 tetap tersedia untuk pemulihan. Revisi cache r21 memuat model dan aset baru.
