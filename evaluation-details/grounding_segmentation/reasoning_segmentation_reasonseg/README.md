# ReasonSeg (val)

**Data.** ReasonSeg validation split from LISA (github.com/JIA-Lab-research/LISA, revision 3cb2d4301f1a; official Google Drive val archive): all 200 images, first query text of each image only.

**Scoring.** Each model writes a binary mask at the image's native resolution; it is compared with the ground-truth mask rasterised exactly as in the official LISA code, with ignore-labelled pixels excluded. Reported metrics are gIoU (mean of per-image foreground IoU) and cIoU (cumulative intersection over cumulative union); a missing or invalid mask is an IoU-0 failure in fail-zero gIoU.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
