# Experimental tile-face classifier

The application loads face-cnn-candidate.onnx only in the administrator comparison page. It does not replace the active location detector, change scores, or train on selected photographs. The JSON manifest pins its SHA-256 and defines RGB24 NCHW normalization and 42 output labels. releaseApproved remains false.

Trained with our own training scripts on Camerash/mahjong-dataset (d18e40041039bae5bf86f636cf1903600fec8afb), MahjongVis (983491f30e88be28863c3df7edcd2e7a55fab105), and 37 user-reviewed development crops. Dataset repositories declare MIT; license texts are included. Camerash describes sourcing images from search/marketplaces, so its original image rights are not independently established. No source images or private photographs are included here.

On 57 held-out public images (634 ground-truth crops), tile-type accuracy was 555/634, 87.54%; all tile types correct in 21/57 images. These are crop classification results, not full detection or point-scoring accuracy. The comparison page uses one whole-image pass of the existing detector, and has no automatic promotion path.
