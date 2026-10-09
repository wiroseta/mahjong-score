## v15.6.72 — Structured Multi-Command Voice Architecture

- Parser splits at exact active player names, preventing Quad ownership leakage across commands.
- Repairs contextual Safari transcription drift: Andikku dari Yeni, Hudariyeni, Gangsatu, Sat Mulia.
- Validates and previews each independent command; ambiguous HU does not suppress confirmed Quad or combination.
- Gemini Edge Function returns typed command objects (hu/zimo/quad/combination); frontend validates typed objects without reparsing Gemini prose.
- Gemini commands are checked against the corresponding original player-anchored speech segment; unsupported actions are not applied.
- Preserves manual Catat Hasil Tangan, prior settings, scoring, and live sharing.
- Requires redeploy of mahjong-voice-interpret Edge Function; no SQL changes.
- Automated parser tests pass for representative inputs; live microphone/Gemini tests pending.
