## v15.6.82 — Gemini fleksibel, hanya dua engine admin
- Administrator memilih Safari bertahap atau Gemini fleksibel; mode Gemini lama dimigrasikan pada pembacaan.
- Gemini menerima ucapan lengkap maupun beberapa ucapan; hasil ditambahkan ke preview tanpa mencatat skor.
- Stage hint membantu interpretasi nama + angka sebagai Quad hanya pada konteks Quad.
- Edge Function tetap memverifikasi izin admin dan validasi pemain.
- Memerlukan deploy ulang mahjong-user-admin dan mahjong-voice-interpret.

# v15.6.81 — Administrator-Assigned Voice Modes (9 Oktober 2026)

- Administrator menetapkan satu dari tiga mode Voice per akun: Safari 3 tahap, Gemini 3 tahap, Gemini sekaligus.
- Pengguna tidak dapat memilih engine; mode disimpan dalam app_metadata Supabase dan ditegakkan ulang oleh Edge Function Gemini.
- Safari tahap 1 pemenang HU/Zi Mo, tahap 2 nama + jumlah Quad (tanpa perlu menyebut Quad), tahap 3 kombinasi. Tahap 2/3 dapat dilewati.
- Gemini mode bertahap menafsirkan hanya perintah tahap aktif; mode sekaligus menafsirkan seluruh ucapan. Model menerima alternatif transkripsi dan daftar nama/kombinasi.
- Voice tetap hanya mengisi preview; tombol Catat Hasil Tangan tetap manual.
- Mode lama tanpa metadata baru default Safari bertahap. Pengaturan lama Gemini Voice digantikan pilihan mode.
- Perlu deploy ulang dua Edge Function: mahjong-user-admin dan mahjong-voice-interpret; tanpa perubahan SQL.
- Pemeriksaan sintaks JS dan struktur ZIP dilakukan; uji mikrofon Safari/Android dan Supabase aktual masih diperlukan.

## v15.6.80
- Contextual Safari Huda → HU dari, only with unique active players.
- Gemini grounding checks all Safari alternatives.
- Two player + number phrases can appear as provisional Quad values in preview, with uncertainty warning; never auto-record.
- Preserve v15.6.79 features.

## v15.6.78 — Quad Ownership Validation

- Parser diagnostik Quad memakai hasil segmen berjangkar pemain, bukan fuzzy hit yang dapat mengalihkan Quad ke Ari.
- Ejaan Fery dipetakan ke Ferry hanya dalam konteks perintah Quad lengkap dan unik.
- Grounding Gemini menolak pemilik Quad yang salah dan mencatat konflik yang sudah terselesaikan secara terpisah dari konflik belum pasti.
- Seluruh fitur v15.6.77 dipertahankan.

## v15.6.77 — Contextual Multi-Command Grounding
- Exact player-anchored HU/Quad/combination recognition, unique active-name matching for Safari drift, safe Gemini/local merge.
- No SQL or Edge Function changes.

v15.6.76 — Voice Debug dipisahkan sebagai panel keempat yang mandiri (setelah Test Voice), dengan hitungan riwayat 0–5. Tidak ada perubahan parser/AI.

## v15.6.75 — Contextual Voice Grounding and Debug Placement
- Voice Debug moved immediately below Mulai Test Voice / Hapus Hasil; dark, legible header.
- Context-scoped Safari HU repair: `<active player> ibu dari Yeni/Yenny` only when Yenny is an active player.
- Context-scoped Quad phonetic `quot` and anchored per-player validation.
- Grounding diagnostics include rejection reasons and segments.
- No SQL or Edge Function changes.

## v15.6.74 — Voice Debug & Contextual HU

- Administrator Voice Diagnostic now includes a collapsible read-only **Voice Debug · Voice permainan** panel.
- Captures Safari/Android speech transcription alternatives, local parser interpretation, local decision, Gemini response/error, and per-command grounding decisions for the most recent five debug events in browser localStorage only. No audio is recorded or uploaded by this debug panel.
- Adds a context-dependent HU correction for `Andi ku dari Yenny` / `Andi ku dari Yeni`, only when the two distinct active players can be recognized on either side of the phrase. `ku` is not a global HU alias.
- Existing voice score button, manual score confirmation, Gemini permissions, Supabase functions, and all previous features remain in place.
- No SQL or Edge Function redeployment required for this release.
- JavaScript syntax and representative parser test cases checked; live Safari/Android microphone tests pending.

## v15.6.79
- Game Baru Voice accepts four short names in 東/南/西/北 order, with or without separators, and retains numbered names.
- Edit Nama Pemain now has its own Voice button: “Ari diganti Yenny”; duplicate names require explicit resolution and save validation.
- Voice recognition shares the existing microphone lifecycle, with no automatic saving.
