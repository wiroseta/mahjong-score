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
