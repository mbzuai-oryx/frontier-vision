# M3D-Bench REC (test-200)

**Data.** M3D-Seg test annotations for AbdomenCT-1K. A fixed 200-question subset, 50 per organ; see `split.json`. Each question shows 32 axial slices rendered from the original Hounsfield-unit CT volumes.

**Scoring.** Boxes are parsed with the upstream M3D `extract_box_from_text` and scored as mean IoU using the true box union.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.

## Evaluation set

The item ids are listed in `split.json`.

M3D-Seg's `image.npy` files are not in Hounsfield units, so the CT slices were rebuilt from the original AbdomenCT-1K volumes (Zenodo 5903099, 5903846, 5903769).

**Selection**
1. Exactly 50 questions per organ.
2. Within each organ, questions were split by two tertiles:
   - volume depth (slice count), with tertiles computed over all 799 questions;
   - target size (bounding-box volume as a fraction of the scan), with tertiles computed within the organ.

   The 50 were allocated in proportion to stratum size, rounding by largest remainder.
3. Within each stratum, candidates were shuffled with a shared `random.Random(42)`, then ordered so that the least-used cases come first.

**Composition.** 50 questions per organ, drawn from 193 of the 200 volumes.
