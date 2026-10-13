# Stage 21 — Audit awal sesi lintas-browser (13 Oktober 2026)

Sumber: ZIP pengguna mahjong-score-main(7).zip. Tidak ada perubahan runtime, SQL, Edge Function, atau deployment.

## Bukti kode
- index.html:2303 `logoutMahjong()` memakai `mahjongSupabase.auth.signOut()` tanpa scope. Supabase Auth signOut default menggunakan global scope sehingga sesi refresh lintas-browser dapat dicabut; ini konsisten dengan observasi logout Chrome berpengaruh pada Firefox. Perlu validasi runtime karena access token yang sudah terbit dapat tetap valid sampai expiry.
- index.html:2175 `MAHJONG_CLOUD_SYNC_ENABLED=false`, sehingga `scheduleMahjongCloudAuth()` pada baris ~2230 tidak mengaktifkan bridge. Automatic Session Transfer belum berjalan pada aplikasi saat ini.
- index.html:2248 listener auth hanya menerapkan event SIGNED_IN/TOKEN_REFRESHED; tidak ada pemeriksaan ownership perangkat saat login dalam jalur aplikasi aktif.
- supabase/functions/mahjong-user-admin/index.ts:77–81 toggle multi-device mengubah app_metadata; ini bukan enforcement sesi saat sign-in.

## Temuan
1. Logout lintas-browser: mekanisme default signOut global kemungkinan penyebab utama, belum dibuktikan dari log Supabase.
2. Login perangkat kedua tidak otomatis menonaktifkan perangkat pertama karena cloud activation digate OFF.
3. Mengubah logout menjadi local saja tidak cukup untuk single-device enforcement; perlu server-side device binding, revoked writer authorization, polling/focus guard, dan uji nyata.
4. Jangan mengaktifkan Cloud Sync hanya untuk menguji logout; keselamatan data permainan tetap prioritas.

## Pengujian
`node --test tests/*.test.cjs`: 623 PASS / 0 FAIL pada source ZIP ini.

## Rencana perbaikan aman
- Pisahkan logout lokal browser dari administrator/global session revocation, setelah audit semua alur signout dan test yang relevan.
- Enforce single-device OFF pada login baru melalui operasi server yang atomik, bukan metadata UI saja.
- Old browser harus mendeteksi revoke pada focus/polling dan fail closed untuk semua operasi menulis.
- Verifikasi login Chrome → Firefox, reload, logout Chrome, logout Firefox, serta permainan cloud penuh sebelum deployment.

STATUS: AUDIT SAJA; DO NOT DEPLOY; Stage 21 belum selesai.
