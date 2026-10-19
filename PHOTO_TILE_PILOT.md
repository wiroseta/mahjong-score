# Foto Tile — administrator pilot

One photo belongs to one selected player after the hand ends. The application never determines a winner from the photo and never saves a score automatically.

## Use

An administrator selects the player first, then takes or selects one photo. After consent the photo is analyzed automatically and the detected groups and scoring suggestions are displayed read-only. There are no Pong/Kong or exposure selectors. A single confirmation applies the result; a wrong reading must be retaken or entered through the normal manual form. Read-only devices may recognize photos; write control and a selected winner are required before applying results. Consent is required before the compressed JPEG is sent to Google Gemini through the authenticated Supabase function. Photos remain in browser memory; neither the application database nor the score history stores them. Provider processing is subject to the configured Google account's data policy.

Review the detected groups and tile faces. Retake an incorrect reading or use the existing manual scoring form. Face-up tiles in an end-of-hand photo do not prove they were exposed during play. Unknown faces must be corrected. Face-down Kong tiles cannot be inferred by the model: reveal them after the hand and retake the photo.

For a nonwinner only exposed groups and previously declared concealed Kongs count. All other concealed tiles are excluded, including concealed pairs and dragon groups. For a winner all photographed groups may be reviewed. A single review confirmation is required before applying results; no group-type choices are required. Applying replaces that player's Kong count and the highest supported combination suggestion when one is detected; it leaves other players, winner, Hu/Zi Mo, discarder, extra points, dealer, round, scores, and history untouched. The existing **Catat Hasil Tangan** confirmation flow remains required.

## Conservative suggestions

Supported initial suggestions: matching seat-wind set, little/big dragons, little/big winds, four Kongs; and selected whole-hand patterns only for a fully grouped winning hand without ambiguous red Jokers. Other combinations remain manual. This pilot does not validate a legal win, Fan, Joker interpretation, or all special hands.

## Deployment and limits

New Edge Function: `mahjong-photo-tiles`, JWT verification on and server-side `getUser()` administrator check. It uses the existing server-only `GEMINI_API_KEY` with the fixed photo model `gemini-3.8-flash` and low thinking, as explicitly requested by the user. No schema, account permissions, subscription, payment, or existing voice function changes. Requests and responses are bounded. A best-effort per-isolate in-flight guard prevents overlapping requests; it is not a durable spending quota. General scorekeeper rollout requires real-photo accuracy evaluation and a durable usage/billing policy.

## Verification

670 automated tests pass: existing 641 plus 19 photo-rule tests and 10 endpoint tests with mocked Auth/Gemini. Browser fixture verified photo selection/compression, nonwinner hidden-group exclusion, explicit review, and application of one Kong to only the selected player's draft while all four scores stayed zero. The modal fits a 375px viewport without horizontal overflow.

Not yet established by those tests: real-world recognition accuracy, physical iPhone camera behavior, full model availability for this account, or coverage of all Mahjong Nusantara combinations. Real tile photographs must be tested before broad rollout. The browser fixture uses simulated responses and is not deployed.

## Live provider investigation

The first live requests reached Google but returned 404 NOT_FOUND for gemini-2.5-flash. The photo-only default was changed to gemini-3.1-flash-lite. That model returned 503 UNAVAILABLE in live attempts, so image recognition has not yet been demonstrated successfully. Provider status/model/error-code logs contain no photos, tokens or raw provider payloads. Temporary 5xx responses retry once within a bounded time; model errors and quota errors have distinct messages. Existing voice model configuration is unchanged.

## Model selection correction

The user explicitly requires Gemini 3.8. Photo recognition now uses exactly `gemini-3.8-flash`, with `thinkingLevel: low`, and does not fall back to 2.5 or 3.1. Live photo recognition still requires successful verification; the earlier 3.1 service failure is not evidence of 3.8 availability.

## Gemini 3.8 live verification

After the model was changed to gemini-3.8-flash, the authenticated production browser flow returned observations successfully: 14 tile faces in six groups for the selected table photograph. This confirms end-to-end provider connectivity, not the accuracy of every face, inferred group or score. The picture includes multiple table areas and is not a controlled single-player accuracy fixture. No result was applied and no score was recorded. Evidence: output/photo-gemini38-live-success.png in the task workspace. Physical iPhone camera tests and systematic real-photo accuracy evaluation remain pending.

## Uncertain readings

Eligible groups marked uncertain, containing unknown faces, or left ungrouped cannot be applied, even after the confirmation checkbox is checked. More than four eligible sets or more than eighteen non-flower scoring tiles is rejected as an invalid single-player observation. Concealed nonwinner groups remain ignored and do not block valid exposed/declared-Kong observations. Provider notes are displayed as plain text; no group-type choices were introduced.


## Perbaikan batas waktu 19 Oktober 2026
Log kegagalan menunjukkan durasi sekitar 20,2 detik, sesuai batas server lama. Batas pembacaan Gemini 3.8 menjadi 60 detik untuk seluruh percobaan termasuk pengulangan 5xx; browser menunggu 75 detik. Timeout AI kini HTTP 504, sambungan provider 502, hasil tidak valid 422. Log diagnostik hanya tahap, nama error dan durasi. Pengujian otomatis mencakup timeout, pelepasan kunci, respons lambat simulasi 25 detik, dan JSON rusak. Keberhasilan foto pengguna setelah perubahan masih perlu diverifikasi.

Sesuai permintaan pengguna, kotak persetujuan pengiriman dihapus; pemilihan foto langsung memicu AI. Keterangan layanan tetap ada. Konfirmasi hasil sebelum menerapkan skor tetap diwajibkan.
