# OCHuman (test-500)

**Data.** OCHuman test annotations (OCHumanApi). A fixed 500-person subset; see `split.json`. The target person is given as a box in the prompt.

**Scoring.** The last JSON list of 17 `[x, y]` pairs is scaled to the image and scored with stock pycocotools COCO keypoint evaluation (OKS AP). All 500 people stay in the ground truth, so an unanswered person counts as a miss.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.

## Evaluation set

The item ids are listed in `split.json`.

**Selection**
1. Each person was given three labels:
   - an occlusion tier from their largest box IoU with another person in the same image: below 0.5, 0.5–0.75, or 0.75 and above;
   - a scale tercile from box area as a fraction of image area, with terciles computed over the full split;
   - whether they are the only person annotated in the image or one of several.
2. The 500 were allocated across the resulting 18 cells in proportion to cell size, rounding by largest remainder.
3. Cells were visited in sorted order, and people were drawn without replacement using `numpy.random.default_rng(42)` over sorted ids. If a cell had fewer people than its quota, the shortfall was topped up at random from the people not yet chosen.

**Composition.** 500 people in 478 images; 22 images contribute two people. The scoring ground-truth file contains only the selected people, so people in the same images who were not selected do not count as missed detections.
