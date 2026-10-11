# v15.6.88 — Voice correction consent (Tahap 4)

After a score is successfully recorded, if one or more Voice transcripts differ from the recorded hand, the scorekeeper may explicitly approve sharing a **text-only** correction. Cancel means no training record is created. The hand is already recorded regardless of consent. No raw audio is saved.

The report uses the existing `mahjong_voice_diagnostics` table, `kind=voice_debug`, and `details.confirmed_correction` with `confirmed_by_user=true`, `input`, four `names`, and `expected` (method, winner, discarder, quads, patterns). It uses the existing queued insert mechanism, including offline retry. The Gemini Auto-Fix worker already filters for this exact format.

**No new SQL or Edge Function required** if `supabase_latest.sql` for v15.6.85 has already been applied and authenticated scorekeepers can insert into `mahjong_voice_diagnostics`. Do not re-run unrelated migrations.

Important limitations: This is an opt-in text correction, not an audio transcription truth oracle. The user must verify the ASR text corresponds to the spoken intent. Multiple utterances are joined in sequence; only the last eight (max 400 characters) are retained for this hand. Auto-Fix remains subject to parser regression checks; a successful GitHub Actions run with no confirmed cases makes no changes.

Test on iPhone Safari and Samsung A17 after deployment: (1) correct voice score should not prompt, (2) misrecognized voice followed by manual correction should prompt after recording, (3) Cancel should not send confirmed_correction, (4) OK should queue and upload a voice_debug record, (5) offline confirmation should queue until online, (6) scoring and dealer rotation must remain correct. These browser tests have NOT been performed in this environment.
