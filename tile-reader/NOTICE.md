# Sources and licenses

The standalone tile reader source (index.html, reader.js, detector.js, reference-learning.js, reference-cloud.js, manual-box.js, reading-consistency.js, review-queue.js) is provided under GNU AGPL-3.0. Copyright 2026 Mahjong Score contributors. It is supplied without warranty. See LICENSE-AGPL-3.0.txt and the published source at https://github.com/wiroseta/mahjong-score/tree/main/tile-reader.

The unmodified model.onnx originates from https://github.com/nikmomo/Mahjong-YOLO at commit 28ffceed232ad95fd019c47a6c51ae7c78791a0e, path models/nano/mahjong-yolon-best.onnx. Its embedded metadata states AGPL-3.0, distinct from the source repository's MIT notice. Model training/export sources and notebooks: https://github.com/nikmomo/Mahjong-YOLO/tree/28ffceed232ad95fd019c47a6c51ae7c78791a0e. No model training or model modification was performed for this release. Model checksum and tensor metadata are in manifest.json.

ONNX Runtime Web 1.22.0 is distributed under MIT. Copyright Microsoft Corporation. See vendor/LICENSE-ONNX-Runtime.txt and vendor/ThirdPartyNotices.txt. Corresponding runtime sources: https://github.com/microsoft/onnxruntime/tree/v1.22.0/js/web.

The scoring application hosts the reader in a same-origin frame and exchanges recognized tile keys through a scoped postMessage protocol. This architecture is not a determination that the combined distribution is exempt from copyleft requirements. The upstream repository's MIT notice does not override the model's embedded AGPL notice. The proprietary application terms do not restrict rights granted by third-party licenses.

## Model licensing status
The embedded AGPL-3.0 notice is retained. Permission to distribute this particular model as part of a proprietary combined product has not been independently confirmed. Do not describe the whole product as AGPL-cleared or treat these links alone as proof of compliance. A suitable permission from the relevant rights holders, an appropriately licensed replacement, or distribution under the applicable copyleft requirements must be resolved before claiming proprietary model clearance. No commercial license was purchased and no permission was requested on the user's behalf.

License text: [GNU AGPL-3.0](./LICENSE-AGPL-3.0.txt). Upstream licensing guidance: https://www.ultralytics.com/license. Third-party source access is retained at the URLs above.
