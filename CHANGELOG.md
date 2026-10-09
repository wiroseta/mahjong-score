## v15.6.55 — Modular Voice Parser (2026-10-09)
- Memisahkan fungsi parser Voice dan daftar sinonim ke `js/voice-parser.js` tanpa mengubah mesin mikrofon, UI skor, atau pencatatan skor.
- Menambah frasa Bahasa Indonesia untuk ZI MO dan HU, termasuk “ambil sendiri” dan “ambil buangan”.
- Menambah Test Parser Manual admin di Voice Diagnostic; hanya menampilkan hasil, tidak mengubah state permainan.
- Memperluas Self Diagnostic parser untuk sinonim baru dan memperbarui cache PWA.

## v15.6.54 — Judul Riwayat dan Rekap Score Konsisten

- Menyamakan judul popup Riwayat Score dan Rekap Score dengan menu utama.
- Menyamakan judul bagian Riwayat Score dan Rekap Score pada Guest Live Viewer.
- Tidak mengubah ikon, struktur data, perhitungan skor, atau perilaku tombol.
- Memperbarui penanda versi dan cache Service Worker.

## v15.6.53 — Header Menu Alignment & Undo Icon

- Menyamakan tinggi tombol menu header dengan tombol Edit Nama, termasuk pada layar mobile.
- Mengganti label menu menjadi Riwayat Score dan Rekap Score; ikon lama tetap.
- Memperbaiki ikon footer Undo yang sebelumnya terlihat seperti titik hitam: SVG sekarang memakai fill none dan stroke seperti ikon Ronde Baru, dibalik horizontal.
- Memperbarui penanda versi aplikasi, dokumen, manifest, dan cache Service Worker.
- Tidak mengubah aturan skor atau penyimpanan.

## v15.6.52 — Menu Navigation & Undo Icon (9 Oktober 2026)

- Tombol Game Baru dipindahkan dari header ke posisi pertama menu utama; Edit Nama tetap di header.
- Menu header `•••` diganti ikon tiga garis horizontal; urutan menu: Game Baru, Riwayat Permainan, Rekap Semua Pemain, Ronde Baru, Live Score, Transfer Score, Bagikan Score, Setting, Logout.
- Ikon Game Baru memakai karakter Hong Zhong `中` hitam; ikon semua menu lain (termasuk Riwayat dan Rekap) dipertahankan dari versi sebelumnya.
- Tombol footer `•••` diganti ikon Ronde Baru yang dicerminkan secara horizontal; menu Undo dan Reset tetap dibuka, tidak menjalankan Undo langsung.
- Penanda versi aplikasi, dokumen, manifest dan cache Service Worker diselaraskan ke v15.6.52.
- Tidak mengubah logika skor, penyimpanan, Voice, autentikasi, atau Supabase.

## v15.6.51 — Perbaikan kritis persistensi data (9 Oktober 2026)

- Memperbaiki akar masalah v15.6.50: wrapper penyimpanan memanggil `window.mahjongStorageRead/Write/Remove` yang tidak pernah didefinisikan, sehingga semua akses gagal dan permainan kembali ke awal saat reload.
- Menggunakan `window.localStorage.getItem/setItem/removeItem` langsung dengan penanganan error; tetap menggunakan kunci `mahjong_table_v3` untuk membaca permainan lama.
- Menolak pencatatan, Game Baru, Reset, edit nama, Ronde Baru, Undo, koreksi skor, dan penerimaan transfer jika pemeriksaan penyimpanan gagal. Data tidak boleh diam-diam ditimpa ketika gagal dibaca.
- Memisahkan kegagalan membaca/parse data dari kondisi belum pernah menyimpan; peringatan tampil bila data tidak dapat dibaca.
- Memperbarui cache service worker untuk mencegah HTML lama bertahan setelah pembaruan.
- Belum diuji pada Safari iPhone fisik atau Supabase live; verifikasi pada perangkat tetap diperlukan.

## v15.6.50 — Penyimpanan defensif (9 Oktober 2026)

- Menangani penolakan akses localStorage dan JSON permainan yang rusak agar inisialisasi tidak langsung berhenti.
- Menampilkan peringatan bila skor tidak dapat disimpan; tidak menimpa data permainan yang tidak dapat dibaca.
- AI Diagnostic tetap dapat diinisialisasi bila ID perangkat tidak bisa disimpan.
- Tidak ada perubahan aturan skor, Supabase SQL, atau tata letak normal.
- Uji sintaks dilakukan; Safari iOS asli dan alur autentikasi cloud belum diverifikasi.

## v15.6.50 — koreksi struktur CSS (9 Oktober 2026)

- Memperbaiki blok Safari touch reliability yang sebelumnya berada di luar tag `<style>` sehingga terlihat sebagai teks mentah.
- Tidak mengubah logika skor atau fungsi JavaScript.
- Pengujian browser Chromium dan audit statis dicatat setelah verifikasi.

# Mahjong Score 4P PWA — Changelog

# v15.6.50 — iPhone button reliability
- Merged v15.6.48 mobile tap rules into the existing stylesheet (removed separate patch style block).
- Improved mobile modal scroll and safe-center positioning so bottom action buttons remain reachable on iPhone SE / Larger Text.
- Protected Game Baru Batal and Mulai from speech engine cleanup exceptions using try/finally in closeNew.
- Kept all scoring, Voice, Supabase, sharing and permission logic unchanged.
- Static checks only; real Safari interaction and authenticated cloud workflows still require device testing.
---

# v15.6.49 — Game Baru iPhone Batal / Mulai

- Memperbaiki error JavaScript pada `closeNew()`: pemanggilan `closeIOSNewGameVoiceFallback()` yang sudah tidak didefinisikan dihapus.
- Tombol Batal kini menutup dialog setelah menghentikan sesi voice.
- Tombol Mulai menggunakan `newGame()` yang sama dan kini dapat menuntaskan `closeNew()` tanpa error setelah menyimpan permainan.
- Versi tampilan dan service worker cache diperbarui.
- Tidak ada perubahan pada peraturan skor, Supabase, Live Sharing, atau alur voice lainnya.
- Belum diuji langsung pada iPhone Safari.
---

# v15.6.48 — iPhone Safari tap / menu stabilization

- Moved CSS that had been appended **after `</html>`** into the document `<head>` so WebKit parses it consistently.
- Removed superseded v12.7 footer-menu override and consolidated the mobile footer controls and popup into one scoped rule set.
- Corrected stacking for an expanded top menu and ensured menu touch targets receive pointer events.
- Kept score, voice, user management, Live Sharing, Supabase, and game rules unchanged.
- Static inspection only: real iPhone Safari touch and visual regression tests are still required.
---

# v15.6.47 — Compact User Management

- User list defaults to collapsed with a clickable “Daftar Pengguna (N)” heading.
- Each username row and action button is more compact.
- Add User form remains visible pending user decision about collapsing it.
- Live Sharing panel and all existing functions preserved.
- No SQL or Edge Function changes.

---

## Arsip Cleanup & Audit (digabung dari CLEANUP_AUDIT.md)

# v15.6.44 — CSS usage audit and regression

Baseline: v15.6.43.

- Parsed 29 CSS style blocks, 897 qualified rules and 433 distinct selector strings.
- Scanned static HTML, inline JavaScript and local JavaScript for selector references.
- Removed eight provably unreferenced CSS rules (nine class references; one rule contains two).
- Retained nine duplicate selector/declaration combinations because cascade context could affect behavior.
- Retained historic CSS overrides where responsive cascade could be meaningful.
- No score, voice, Supabase, or game algorithms changed.
- Chromium browser navigation was attempted on desktop, iPhone SE and Samsung A17 emulation, but this runtime returned ERR_BLOCKED_BY_ADMINISTRATOR for both file and localhost URLs. Visual regression tests could not run; do not treat this build as visually verified.
- Physical iPhone/Android, microphone, Supabase, and interaction regression remain outstanding.

Removed CSS selectors:
- `.mobileScore`
- `.guide-note`
- `.mjtile.dragon-red`
- `.mjtile.dragon-green`
- `.mjtile.dragon-white .whitebox`
- `.rules-close`
- `.live-view-card`
- `.live-link-detail`

---

## Arsip CSS Audit — data dari CSS_AUDIT.json (v15.6.50)

Laporan historis ini merupakan hasil analisis statis, **bukan** file yang digunakan aplikasi saat berjalan. Angka berikut menggambarkan saat audit dibuat, bukan pengukuran ulang versi ini.

- Blok CSS: **29**
- Aturan CSS: **897**
- String selector unik: **433**
- Duplikasi aturan identik terdeteksi: **9**
- Referensi selector yang diduga tidak digunakan: **9** (belum tentu aman dihapus).

### Daftar aturan duplikat yang dilaporkan (selector — nomor urut aturan audit)

- `.patterns` — 86
- `.name` — 73
- `.top .muted` — 134
- `.dealer-label,.dealer-name` — 144
- `.dealer-label` — 145
- `.dealer-name` — 146
- `.player .muted` — 225
- `.brand-instruction` — 634
- `.center` — 363

### Referensi selector yang diduga tidak digunakan

- `.mobileScore` (class `mobileScore`)
- `.guide-note` (class `guide-note`)
- `.mjtile.dragon-red` (class `dragon-red`)
- `.mjtile.dragon-green` (class `dragon-green`)
- `.mjtile.dragon-white .whitebox` (class `dragon-white`)
- `.mjtile.dragon-white .whitebox` (class `whitebox`)
- `.rules-close` (class `rules-close`)
- `.live-view-card` (class `live-view-card`)
- `.live-link-detail` (class `live-link-detail`)

**Tindakan dokumentasi:** `CSS_AUDIT.json` dihapus dari ZIP dan seluruh ringkasan serta rincian laporannya diarsipkan di sini. Tidak ada CSS, JavaScript, HTML, atau logika aplikasi yang diubah. Selector yang diduga tidak digunakan tidak dihapus lagi pada perubahan dokumentasi ini.
