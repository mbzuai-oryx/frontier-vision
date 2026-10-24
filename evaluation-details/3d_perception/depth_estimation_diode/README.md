# DIODE (val-350)

**Data.** Official DIODE validation archive (771 images, indoor and outdoor). A fixed 350-image subset; see `split.json`. Images are sent at their original 1024×768 resolution with no camera parameters.

**Scoring.** The model submits Python code that writes a 768×1024 depth map in metres. It is scored with the official DIODE metric code on valid ground-truth pixels, with no scale alignment, and reported as AbsRel averaged over images. Images where the model returned no valid depth map are excluded from the average.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.

## Evaluation set

The item ids are listed in `split.json`.

**Selection**
1. Five images were drawn for prompt development: 3 indoor and 2 outdoor, each from a different scene, with seed 20260919.
2. Another 345 images were drawn uniformly at random from the remaining 766, sorted by image ID, using `random.Random(20260920).sample(remaining, 345)`.
3. The mini set is these 5 + 345 images.

**Composition.** 150 indoor and 200 outdoor images. The split is not stratified by domain; this ratio is how the random draw fell. The five prompt-development images are part of the 350 and are marked `"prompt_development": true` in the file.
