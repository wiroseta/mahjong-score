# Sources and licenses

The standalone tile reader source (index.html, reader.js, detector.js) is provided under GNU AGPL-3.0. Copyright 2026 Mahjong Score contributors. It is supplied without warranty. See LICENSE-AGPL-3.0.txt and the published source at https://github.com/wiroseta/mahjong-score/tree/main/tile-reader.

The unmodified model.onnx originates from https://github.com/nikmomo/Mahjong-YOLO at commit 28ffceed232ad95fd019c47a6c51ae7c78791a0e, path models/nano/mahjong-yolon-best.onnx. Its embedded metadata states AGPL-3.0, distinct from the source repository's MIT notice. Model training/export sources and notebooks: https://github.com/nikmomo/Mahjong-YOLO/tree/28ffceed232ad95fd019c47a6c51ae7c78791a0e. No model training or model modification was performed for this release. Model checksum and tensor metadata are in manifest.json.

ONNX Runtime Web 1.22.0 is distributed under MIT. Copyright Microsoft Corporation. See vendor/LICENSE-ONNX-Runtime.txt and vendor/ThirdPartyNotices.txt. Corresponding runtime sources: https://github.com/microsoft/onnxruntime/tree/v1.22.0/js/web.

Only this independent reader and its model are covered by these notices. The scoring application is opened through a normal hyperlink and does not import this model or its code.
