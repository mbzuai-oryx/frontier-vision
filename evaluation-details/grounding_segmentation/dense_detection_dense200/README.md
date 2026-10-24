# Dense200

**Data.** Dense200 from the Rex-Omni evaluation data (Hugging Face `Mountchicken/Rex-Omni-EvalData`, revision `daff862ba483f56ccaba9af5a12e118a9372ede8`; annotations `_annotations/box_eval/Dense200.jsonl`, images `dense200.tar.gz`). All 200 images are used, each with one target category and its reference boxes; images are sent as the original files at native resolution.

**Scoring.** The final reply must be a single JSON object {"boxes": [[x_min, y_min, x_max, y_max], ...]} in original-image pixels. Following the official Rex-Omni evaluator, reference boxes are matched greedily to the unused prediction with the highest IoU (at least 0.5); precision and recall are averaged over images and F1@0.5 is their harmonic mean.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
