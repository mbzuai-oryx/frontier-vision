# Anywhere3D-v2 (mini-1000)

**Data.** Anywhere3D-v2 ([txwang98/Anywhere3D_v2](https://huggingface.co/datasets/txwang98/Anywhere3D_v2) at `0ae1211b`, scene graphs from [anywhere-3d/Anywhere3D](https://github.com/anywhere-3d/Anywhere3D) at `48546fd`). A fixed 1,000-expression subset of the 2,886-expression release; see `split.json`.

**Scoring.** The final reply must be a JSON object with `center` and `size`: three finite numbers each, with positive sizes. It is scored with the benchmark's IoU: XY IoU for area-level items, projected IoU for thin parts, otherwise 3D IoU against the yaw-rotated ground-truth box. Accuracy is at IoU 0.25. Invalid or missing output counts as IoU 0.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.

## Evaluation set

The item ids are listed in `split.json`.

**Selection**
1. Five expressions were set aside for prompt development. All 71 expressions from their five scenes were removed, so the mini set shares no scene with them. This leaves 2,815 expressions.
2. The remaining expressions were grouped by source dataset × grounding level × expression type (56 groups). The 1,000 slots were allocated in proportion to group size, with at least one per group and rounding by largest remainder.
3. Within each group, expressions were sorted by `db_id`, shuffled with `random.Random(f"20260919:{group}")`, where `group` is the Python tuple `(dataset, grounding_level, expression_type)`, and the first *k* were taken.

**Composition.** 260 scenes.

| Grounding level | Items |
|---|---:|
| Space | 418 |
| Object | 330 |
| Part | 185 |
| Area | 67 |

| Source dataset | Items |
|---|---:|
| ScanNet | 515 |
| ARKitScenes | 331 |
| 3RScan | 126 |
| MultiScan | 28 |

Accuracy is a plain mean over the 1,000 items. It is not reweighted by group.
