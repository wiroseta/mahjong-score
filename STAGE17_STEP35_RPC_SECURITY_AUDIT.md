# Tahap 17 — Langkah 35: Audit kontrak keamanan lima RPC (lokal)

**Status:** pemeriksaan statis kontrak keamanan selesai; **bukan** audit keamanan final atau bukti integrasi runtime.

## Yang diperiksa
- `open`: validasi sesi Auth, penguncian akun, pengecekan ulang setelah lock, high-water sesi lama, token writer.
- `commit`: validasi payload hardened, lock akun, validasi sesi ulang, kepemilikan lease, token hash, generation, CAS revision; payload penulis dicabut tidak disimpan dalam tabel konflik.
- `open_reader`: pemisahan hak baca dari writer; butuh uji runtime kebijakan role dan pergantian perangkat.
- `read`: verifikasi lease terkait sesi Auth, pembatalan hak reader jika izin multi-device dimatikan.
- `lease_status`: pemeriksaan sesi dan generation; status hanya advisory, `commit` tetap boundary tulis.
- Eksekusi SQL kandidat masih dihentikan oleh sentinel `RAISE EXCEPTION` di bagian atas; **jangan hapus sentinel atau deploy**.

## Batas pembuktian dan temuan
1. Kontrak dicek secara statis dan regresi Node; pengujian sesi Auth sungguhan, race lintas perangkat, role toggling, token expiry dan takeover **belum dilaksanakan**.
2. Kesesuaian 12/12 fixture PostgreSQL hanya berlaku untuk validator sementara; produksi tetap menerima 9 payload invalid.
3. `supabase_latest.sql` **tidak diubah**, karena belum ada persetujuan migrasi dan pengujian rollback instalasi.
4. Uji SQL `SECURITY DEFINER` terhadap privilege `auth.sessions`, perubahan grant, RLS, dan batas konkurensi wajib sebelum deploy.
5. `open_reader` dan `read` perlu verifikasi runtime khusus skenario penonaktifan izin multi-device dan sesi lama.

## Langkah berikutnya
Audit interaksi lima RPC menggunakan PostgreSQL transaction rollback dan sesi Auth nyata pada lingkungan uji, lalu review migrasi `supabase_latest.sql` secara terpisah. Cloud Sync OFF / DO NOT DEPLOY.

## GitHub Desktop
Summary: `v15.7.15 - Stage 17 RPC security contract audit (no deploy)`
Description: `Add static regression tests for five RPC security contracts; document remaining live Auth and concurrency gates. Keep cloud sync disabled and SQL production unchanged.`
