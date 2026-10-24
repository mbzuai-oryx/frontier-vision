# ActivityNet Captions (temporal localization)

**Data.** ActivityNet Captions `val_1`. 451 query–video pairs, from a 500-pair sample, keeping the videos that were still downloadable. 48 frames are sampled uniformly over the whole video (not around the target moment), at most 640 px wide.

**Scoring.** The last `[start, end]` pair in the reply is taken, swapped if reversed, and clipped to the video duration. It is scored as R@1 at IoU 0.7; IoU 0.3, IoU 0.5 and mIoU are also reported.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
