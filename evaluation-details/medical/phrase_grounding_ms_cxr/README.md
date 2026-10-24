# MS-CXR

**Data.** MS-CXR v1.1.0 (PhysioNet, credentialed access) with MIMIC-CXR-JPG images, 176 phrase-grounding questions.

**Scoring.** The raw reply is passed to the RadVLM box evaluator (regex box extraction, greedy IoU matching) and scored as mAP@0.5.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
