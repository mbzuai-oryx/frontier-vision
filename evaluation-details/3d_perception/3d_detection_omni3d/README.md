# Omni3D (test mini-1000)

**Data.** Omni3D test split, with annotations loaded through the official Omni3D data loader and filters (50 categories). A fixed 1,000-image subset of the 39,452 test images, proportional across the six sources; see `split.json`. Each image is sent with its camera intrinsics.

**Scoring.** Each detection's camera-frame center, dimensions and rotation are converted to a 3D cuboid and scored with the official Omni3D evaluation code as AP3D. An image with an invalid or missing reply counts as having no detections.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.

## Evaluation set

The item ids are listed in `split.json`.

**Selection**
1. Five images were set aside for prompt development, one each from KITTI, SUN RGB-D, Hypersim, ARKitScenes and Objectron. Every test image from the same scene was removed. Scenes are only identifiable for Hypersim, ARKitScenes and Objectron; for the other sources only the image itself was removed.
2. The 1,000 images were allocated across the six sources in proportion to the number of images remaining in each, rounding by largest remainder.
3. Within each source, images were ranked by the SHA-256 hex digest of `"20260919:subset:<image_id>"`, and the *k* images with the smallest digests were taken.

**Composition**

| Source | Mini set | Test images |
|---|---:|---:|
| Objectron | 237 | 9,314 |
| ARKitScenes | 193 | 7,610 |
| Hypersim | 191 | 7,690 |
| nuScenes | 154 | 6,019 |
| SUN RGB-D | 129 | 5,050 |
| KITTI | 96 | 3,769 |
| **Total** | **1,000** | **39,452** |

The mini set contains 4,173 evaluable objects in 775 scene groups. After the official filters, 61 images contain no evaluable object; they are kept in the set.
