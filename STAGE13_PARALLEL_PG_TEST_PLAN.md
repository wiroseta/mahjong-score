# Tahap 13 — Rencana pengujian PostgreSQL paralel (belum dijalankan)

**DO NOT DEPLOY.** Jangan gunakan database produksi, Supabase produksi, atau data permainan aktif.

## Prasyarat
- Sediakan instance PostgreSQL **disposable** terisolasi, dua koneksi SQL independen, dan schema pengujian yang dapat dihapus seluruhnya.
- Pastikan schema dasar, auth fixture, dan enam RPC telah direview untuk kompatibilitas PostgreSQL; draft SQL saat ini sengaja fail-closed dan **tidak boleh** dieksekusi apa adanya.
- Gunakan hanya akun, sesi, permainan, dan skor sintetis. Simpan log tanpa token rahasia.

## Matriks skenario yang harus diuji
1. **Dua koneksi** mencoba commit pada game/revisi yang sama. Sinkronkan kedua transaksi sebelum commit; hanya **satu yang berhasil**, lainnya ditolak karena **stale revision**, tanpa kehilangan update.
2. Perangkat baru mengambil writer lease; **perangkat lama** mencoba commit dengan token/sesi terdahulu dan harus ditolak oleh server.
3. Commit dengan game ID yang berbeda dari current game harus ditolak, tanpa membuat atau mengganti game aktif.
4. Transaksi yang gagal harus **ROLLBACK** dan mempertahankan seluruh nilai skor, riwayat, revisi, serta lease.
5. Uji admin multi-device terpisah dari scorekeeper single-device dan periksa otorisasi di semua RPC.

## Kriteria kelulusan
- Semua hasil diverifikasi lewat query state database sebelum/sesudah, bukan hanya respons RPC.
- Jalankan beberapa interleaving (A dahulu, B dahulu, simultan) dan cek tidak ada deadlock atau overwrite.
- Jika ada kegagalan, jangan aktifkan Cloud Sync; dokumentasikan SQLSTATE dan perubahan state.

**Status:** belum dijalankan karena lingkungan PostgreSQL disposable dan kontrak RPC deployable belum tersedia. Ini dokumen persiapan, bukan bukti keamanan runtime.
