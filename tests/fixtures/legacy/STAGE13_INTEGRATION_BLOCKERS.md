# Tahap 13 — Audit lanjutan dan gerbang integrasi (12 Oktober 2026)

## Status: BLOCKED — bukan PASS

Baseline checkpoint `244PASS_DO_NOT_DEPLOY` diuji ulang: `node --test tests/*.test.cjs` menghasilkan 244 PASS, 0 FAIL. Angka tersebut hanya mencakup tes Node lokal.

## Pemeriksaan kode aktual

- `supabase_sync_rpc_draft.sql` sengaja berhenti pada perintah `RAISE EXCEPTION 'UNSAFE DRAFT...'` sebelum transaksi. **Jangan hapus guard atau jalankan pada production.**
- `mahjong_sync_open` memeriksa `auth.uid()`, `auth.jwt().session_id`, baris `auth.sessions`, role dan status akun; menggunakan `FOR UPDATE` untuk serialisasi serta preflight revisi sebelum mengambil alih writer.
- `mahjong_sync_commit` memeriksa token hash, generasi sesi, Auth session, writer lease, dan revisi sebelum mutasi. Pengujian konkuren sungguhan tetap diperlukan.
- Tes statis dan mock tidak membuktikan `SECURITY DEFINER`, RLS, GRANT/REVOKE, keunikan index, ataupun serialisasi pada database aktual.

## Prasyarat yang belum dipenuhi

1. Disposable Supabase/PostgreSQL yang kompatibel dengan Auth dan RLS (bukan production).
2. Kredensial pengujian terpisah untuk admin, scorekeeper single-device/multi-device, dan akun nonaktif.
3. Eksekusi 15 skenario dalam `POSTGRES_INTEGRATION_TEST_PLAN.md` disertai log dan bukti rollback.

## Keputusan keselamatan

Cloud sync tetap OFF. Tidak ada SQL yang dipasang, akun yang diubah, atau GitHub deployment. Tahap 11 dan 12 juga belum dinyatakan selesai karena memerlukan verifikasi data nyata dan server.

## Lanjutan otomatis — checkpoint 248 PASS (12 Oktober 2026)
- Ditambahkan `scripts/stage13-environment-preflight.cjs`, pemeriksaan **read-only tanpa koneksi** untuk memastikan URL PostgreSQL disposable eksplisit, acknowledgment, penolakan target production, dan keberadaan dokumen integrasi. URL/password tidak dicetak.
- Ditambahkan empat tes regresi di `tests/sync-stage13-environment-preflight.test.cjs` untuk konfigurasi kosong, target disposable, target production, serta protokol/acknowledgment tidak valid.
- `node --test tests/*.test.cjs`: **248 PASS, 0 FAIL**; log `tests/stage13_preflight_248pass.log`.
- Skrip ini **bukan** bukti keamanan target database dan **tidak menjalankan** 15 skenario PostgreSQL. Belum tersedia disposable Supabase dengan Auth/RLS. Tahap 13 tetap BLOCKED. Draf SQL tetap tidak boleh dieksekusi.

## Lanjutan otomatis — 251 PASS (12 Oktober 2026)
- Memperketat preflight agar nama database wajib menandakan target disposable (`disposable`, `ephemeral`, `throwaway`, atau `test_`/`test-`).
- Menolak koneksi tanpa username/password eksplisit; target remote membutuhkan pengakuan isolasi terpisah `MAHJONG_STAGE13_REMOTE_ISOLATED=I_VERIFIED_NO_PRODUCTION_DATA`.
- Menambahkan 3 tes regresi baru, total **251 PASS, 0 FAIL** (`tests/stage13_preflight_251pass.log`).
- Preflight tetap **hanya pemeriksaan konfigurasi, tidak melakukan koneksi**. Persetujuan eksplisit dan nama disposable **tidak membuktikan** target aman; integrasi nyata belum dijalankan. Cloud sync OFF, SQL guard utuh, tidak deploy.

## Checkpoint 254 PASS
- Read-only URL preflight diperketat terhadap query connection overrides, fragmen, separator database ter-encode, dan hostname ambigu; 3 tes baru PASS.
- Tidak tersedia database pengujian terisolasi; Tahap 13 tetap BLOCKED. Tidak boleh menggunakan production untuk mengatasi hambatan ini.

## Checkpoint 258 PASS terverifikasi
Validasi percent-encoding path database kini fail-closed saat UTF-8 rusak; dua tes regresi ditambahkan. Pengujian PostgreSQL/Supabase Auth/RLS nyata masih membutuhkan lingkungan terisolasi. Tidak ada koneksi atau mutasi production.

## Checkpoint 262 PASS
Karakter kontrol ter-encode dalam username/password database ditolak oleh preflight read-only. 262 tes lokal PASS. Integrasi PostgreSQL/Supabase Auth+RLS tetap terblokir sampai lingkungan disposable tersedia.
