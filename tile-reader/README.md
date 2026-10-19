# Pembaca Foto Mahjong — browser release

Open ../tile-reader/ from Mahjong Score using Baca Foto Lokal. Select a JPEG, PNG or WebP (up to 20 MB), or take a camera photo. Images are decoded and inferred inside the browser; they are not sent to an AI service or stored on the server. Initial model/runtime assets total approximately 21 MB. A network connection is required to load assets. This page has no guaranteed offline mode.

The proposed area can be adjusted by dragging Ubah area. Seluruh foto includes all visible players. Results are ordered by visual row, then left-to-right. Each result shows the original image crop, model identity/confidence, correction selector and review checkbox. Correct labels, review tile boxes and confirm coverage. Export JSON retains original predictions separately from human labels, with the image checksum and explicit completeness flags. Keep the original image with the export. Rechecking recognition or changing photos resets review.

Export does not update the model. The model has no flower output class; unknown/flower faces must be handled manually. Undetected faces cannot be added in this release: retry the area/photo, or use the main manual scoring form. This tool neither groups Pong/Kong nor proves exposed/concealed state, a legal win or a score. Return to the main app to record scores.

The reviewed two-row photograph achieved 15/17 correct model identities in the browser before manual corrections. One photo is not a broad accuracy test. User photographs and label datasets are intentionally excluded from the public release.

Run detector tests with node --test tests/local-tile-detector.test.cjs and full app regression with node --test tests/*.test.cjs. Source, model and runtime notices are in NOTICE.md; pinned hashes are in manifest.json.
