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
