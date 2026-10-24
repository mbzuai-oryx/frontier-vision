# ETH3D (multi-view, 10 scenes)

**Data.** ETH3D high-resolution multi-view benchmark (https://www.eth3d.net/datasets), training scenes with public ground truth: 10 of the 13 scenes (kicker, meadow, pipes not included). Per scene, 10 undistorted DSLR images are sampled with a fixed seed and resized to 518x350; no calibration is given to the model.

**Scoring.** The model returns, as JSON, a piecewise-planar inverse-depth map (polygons with inverse-depth planes), intrinsics and a camera-to-world pose for each of the 10 views; a fixed decoder rasterizes depth and unprojects all views into one point cloud. After one similarity (scale, rotation, translation) alignment to the ground-truth points, accuracy (prediction to ground truth) and completeness (ground truth to prediction) mean nearest-neighbour distances in metres are averaged into Overall (lower is better), then averaged over scenes. Outputs that fail to decode (wrong schema, non-positive depth, camera 0 not the identity) receive no score. This is not the official ETH3D F-score.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
