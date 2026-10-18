# Foto Tile — administrator pilot

One photo belongs to one selected player after the hand ends. The application never determines a winner from the photo and never saves a score automatically.

## Use

Choose the winning player in the normal form. An administrator can then open **Foto Tile (Uji)**, choose the player whose tiles will be photographed, confirm the hand has ended, and take or select a photo. Consent is required before the compressed JPEG is sent to Google Gemini through the authenticated Supabase function. Photos remain in browser memory; neither the application database nor the score history stores them. Provider processing is subject to the configured Google account's data policy.

Review and correct each group, its tile faces, and its original exposure status. Face-up tiles in an end-of-hand photo do not prove they were exposed during play. Unknown faces must be corrected. Face-down Kong tiles cannot be inferred by the model: reveal them after the hand or correct all four faces manually.

For a nonwinner only exposed groups and previously declared concealed Kongs count. All other concealed tiles are excluded, including concealed pairs and dragon groups. For a winner all photographed groups may be reviewed. Each group must be confirmed before applying results to the current form. Applying replaces that player's Kong count and optionally their single combination selection; it leaves other players, winner, Hu/Zi Mo, discarder, extra points, dealer, round, scores, and history untouched. The existing **Catat Hasil Tangan** confirmation flow remains required.

## Conservative suggestions

Supported initial suggestions: matching seat-wind set, little/big dragons, little/big winds, four Kongs; and selected whole-hand patterns only for a fully grouped winning hand without ambiguous red Jokers. Other combinations remain manual. This pilot does not validate a legal win, Fan, Joker interpretation, or all special hands.

## Deployment and limits

New Edge Function: `mahjong-photo-tiles`, JWT verification on and server-side `getUser()` administrator check. It uses the existing server-only `GEMINI_API_KEY` and optional `GEMINI_PHOTO_MODEL` (default `gemini-2.5-flash`). No schema, account permissions, subscription, payment, or existing voice function changes. Requests and responses are bounded. A best-effort per-isolate in-flight guard prevents overlapping requests; it is not a durable spending quota. General scorekeeper rollout requires real-photo accuracy evaluation and a durable usage/billing policy.

## Verification

662 automated tests pass: existing 641 plus 15 photo-rule tests and 6 endpoint tests with mocked Auth/Gemini. Browser fixture verified photo selection/compression, nonwinner hidden-group exclusion, explicit review, and application of one Kong to only the selected player's draft while all four scores stayed zero. The modal fits a 375px viewport without horizontal overflow.

Not yet established by those tests: real-world recognition accuracy, physical iPhone camera behavior, full model availability for this account, or coverage of all Mahjong Nusantara combinations. Real tile photographs must be tested before broad rollout. The browser fixture uses simulated responses and is not deployed.
