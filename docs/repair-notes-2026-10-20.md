# Perbaikan v15.9 r6 — 20 Oktober 2026

1. Quad desktop gelap: tombol minus, angka, plus transparan/putih; tema terang tetap.
2. Semua dialog: header penuh sampai tepi; isi menggulir terpisah.
3. Kamera OFF: piala dan jumlah tangan di tengah.
4. Quad mobile gelap: garis putih tipis di atas/bawah angka terpilih.
5. Pemenang/HU/ZI MO: tekan pilihan sama untuk batal, berbeda untuk berganti. Quad/kombinasi draf dan riwayat dipertahankan.
6. About: tautan lisensi/sumber paling bawah, huruf kecil.
7. Pengecualian komponen pihak ketiga dalam ketentuan proprietary; akses sumber/AGPL/MIT dipertahankan. Izin model untuk produk proprietary gabungan BELUM terkonfirmasi; perlu izin pemegang hak, model pengganti, atau pemenuhan copyleft yang sesuai. Tidak ada pembelian atau komunikasi eksternal.
8. Foto: panduan kamera, tiga gambar lokal, dua inferensi/crop, pembaruan referensi aktif/paginasi, koreksi lengkap berkas identik berdasarkan SHA-256, ringkasan poin dan konfirmasi bila kurang pasti. Hak administrator diuji di server. Tidak ada unggah foto otomatis baru atau klaim semua foto pasti benar. Uji sintetis dibedakan dari uji foto nyata/perangkat fisik.
9. QR Android: native bila tersedia, multiukuran/crop, kamera terkunci selama pembacaan; dites ulang.

## Perbaikan lanjutan pembaca foto — r7

Contoh 17 tile Karakter diuji dengan ONNX CPU lokal: seluruh foto terbaca benar, sedangkan dua crop menghasilkan salah klasifikasi dan tangan tidak valid. Output label/confidence (tanpa piksel foto) disimpan sebagai fixture regresi. Hasil CPU dan browser dapat berbeda karena resampling.

Pembacaan seluruh foto dipertahankan sebagai acuan; crop tidak menggantikannya hanya karena lebih dekat. Alternatif diperiksa mesin aturan dengan konteks pemenang/angin, lalu dipilih berdasarkan kualitas pembacaan, bukan besarnya poin. Jika alternatif valid menghasilkan Kong/kombinasi berbeda, konfirmasi poin tetap diminta. Satu tile di bawah 70% tidak otomatis menjadikan seluruh foto meragukan. Status pembacaan selesai dipisahkan dari validitas susunan/poin. Koreksi administrator yang lengkap tetap didahulukan. Tidak ada perubahan pada model atau skor tersimpan. 800 pengujian lulus.

## Android PIN — r8

Empat kotak adalah tampilan untuk satu input password numerik dengan panjang empat digit. Tidak ada perpindahan fokus, pengosongan input, atau select() per digit yang memutus koneksi keyboard Android. Input mendukung penempelan, penghapusan native, autofill, dan composition IME. Login otomatis hanya pada empat digit lengkap dan tidak diulang oleh event composition/input yang sama. PIN tetap hanya berada di memori form, tidak disimpan di localStorage atau log. Passkey/server autentikasi tidak diubah. 802 pengujian lulus; fokus dan tampilan diuji di browser desktop. Keyboard Android fisik belum diverifikasi.

## Catatan baru 10 — diterapkan dan diperiksa 21 Oktober 2026

Pada mobile, petunjuk “(tap untuk buka)” pada nomor 4 tampak lebih besar daripada judul “Kombinasi poin setiap pemain”. Petunjuk memakai kelas muted dengan ukuran font tersendiri, sedangkan judul memiliki aturan mobile berbeda.

Permintaan: ukuran petunjuk jangan lebih besar daripada teks judul; gunakan gaya ukuran kecil dan warna aksen seperti “0–4 per pemain” pada nomor 3, dengan kontras sesuai tema terang/gelap. Terapkan konsisten pada petunjuk “tap untuk tutup” saat panel terbuka. Petunjuk buka/tutup sudah memakai warna aksen dan ukuran yang sama dengan “0–4 per pemain”: 11px desktop dan 7px mobile. Telah diperiksa ulang pada tema terang/gelap dan keadaan terbuka/tertutup saat penerapan catatan 11–12.

## Catatan baru 11 — 21 Oktober 2026 — diterapkan

Permintaan pengguna berdasarkan tangkapan layar `Screenshot 2026-10-21 at 14.49.53.png`: hapus paragraf penjelasan di bawah nomor 4 “Kombinasi poin setiap pemain”, yang diawali “Pembayaran dasar: Zi Mo = 5 poin …”. Penjelasan pembayaran sudah tersedia di “Aturan Bermain dan Cara Pembayaran”, sehingga paragraf di formulir utama dianggap berulang.

Cakupan nanti: hilangkan paragraf penjelasan berulang tersebut dari formulir utama; pertahankan isi aturan pada “Aturan Bermain dan Cara Pembayaran” serta logika perhitungan poin.

Status: diterapkan setelah pengguna meminta menjalankan perubahan yang telah dicatat. Paragraf pembayaran berulang di formulir utama dihapus; panduan aturan dan perhitungan poin dipertahankan.

## Catatan baru 12 — 21 Oktober 2026 — diterapkan

Permintaan pengguna berdasarkan tangkapan layar `Screenshot 2026-10-21 at 15.10.58.png`: hilangkan latar/background berbentuk kapsul beserta bingkai kapsul pada teks judul/petunjuk berikut agar menjadi teks biasa di atas latar panel formulir:

- Nomor 1: “Pemain yang menang …”, termasuk informasi pemain dan petunjuk lanjutannya.
- Nomor 2: “Cara menang”.
- Label “Siapa membuang?”.
- Nomor 3: “Masukkan Quad setiap pemain”.

Nomor 4 “Kombinasi poin setiap pemain” tetap memakai latar dan bingkai karena merupakan kontrol yang bisa diketuk untuk membuka/menutup bagian kombinasi. Pertahankan tombol HU/ZI MO, tombol pilihan pemain pembuang, kartu/kontrol Quad, serta latar panel formulir keseluruhan; permintaan ini hanya mengenai latar judul/petunjuk di atas, bukan seluruh kontrol di bawahnya.

Status: diterapkan setelah pengguna memberi instruksi menjalankan catatan. Latar, bingkai, bayangan, dan blur kapsul pada empat label dihilangkan; latar nomor 4 dan seluruh kontrol tetap. Diperiksa pada desktop/ponsel, tema terang/gelap.
