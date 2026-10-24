# DAVIS-2017 (val)

**Data.** DAVIS 2017 semi-supervised video object segmentation, validation split at 480p (DAVIS-2017-trainval-480p from https://davischallenge.org/davis2017/code.html): all 30 videos, 1,999 frames, 61 object tracks. Only the frame-0 annotation is given to the model; the 1,969 later frames are split into 262 calls of up to 8 consecutive frames.

**Scoring.** Each call returns, for every target frame and every reference object ID, outer polygons and hole polygons in coordinates normalized to 0-1000. Polygons are rasterized at native resolution (holes subtracted; lower IDs win overlaps) with no post-processing; a call with invalid or missing output scores empty masks for its frames. Masks are scored with the official davis2017-evaluation code (semi-supervised, val): J&F is the mean of region similarity J and boundary accuracy F, averaged over the 61 object tracks.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
