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
