# Automatic low-light photo correction

Dark photographs can obscure tile markings before detection and classification. The reader now enables “Perbaiki cahaya otomatis” by default, applies bounded luminance correction before inference, and displays the corrected photograph. Turning it off rereads the original image. Bright images stay unchanged; correction preserves channel ratios and alpha, limits gain, and does not synthesize markings or change confidence thresholds.

Prepared images are discarded if the player context changes while processing. The service worker cache and reader asset versions are updated together. Existing scoring and confirmation rules remain in place. No private photographs, training datasets, or experimental model weights are included.

Validation: all 945 application tests passed, including 241 photo-related tests, including lighting, image preprocessing, reset handling, and toggling between corrected and original pixels. Browser verification loaded the application option and ran the existing RGB64 model. On 1,156 previously fitted reference crops with synthetic dark lighting, classification improved from 1,096 to 1,152 correct after correction. This is a development diagnostic using known boxes, not independent real-low-light or end-to-end accuracy. On one synthetic dark 36-tile character reference image, the corrected output recovered the expected count of four tiles per character class; detections meeting 85% confidence rose from 11 to 31.

A separately trained candidate was rejected because public classifier regression declined from 586/634 to 584/634. The existing RGB64 model is retained.
