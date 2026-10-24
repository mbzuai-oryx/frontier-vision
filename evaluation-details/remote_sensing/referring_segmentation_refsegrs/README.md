# RefSegRS (test-200)

**Data.** [JessicaYuan/RefSegRS](https://huggingface.co/datasets/JessicaYuan/RefSegRS) test split. A fixed 200-expression subset; see `split.json`.

**Scoring.** Polygons are parsed from the JSON reply and rasterized to the 512×512 ground-truth mask. Each polygon needs at least 3 points; at most 20 polygons with 12 vertices each are kept. Scored as mIoU; an empty or unparseable reply scores IoU 0.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.

## Evaluation set

The item ids are listed in `split.json`.

**Selection**
1. Two properties were computed from each expression's ground-truth mask:
   - the number of separate regions, grouped as 1, 2–5, 6–20 or 21+;
   - the quartile of foreground area, with quartiles computed over the full split.
2. The 200 were allocated across the region-count × area-quartile cells in proportion to cell size, rounding by largest remainder. 16 cells are non-empty.
3. Within each cell, candidates were shuffled with a shared `random.Random(42)`, then ordered so that the least-used images come first.
