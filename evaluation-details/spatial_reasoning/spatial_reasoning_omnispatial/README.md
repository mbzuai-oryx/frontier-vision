# OmniSpatial (test)

**Data.** [qizekun/OmniSpatial](https://huggingface.co/datasets/qizekun/OmniSpatial) at revision `6691f328`, test split, all 1,533 multiple-choice questions, one pass. Each question uses its one released image (the static PNG chosen by the official API evaluator, also for clip-derived questions), sent at full resolution with the original bytes.

**Scoring.** The answer is the letter in the last `Answer: X` (A–D) in the response, with no default fallback. Accuracy is the share of questions answered correctly; failed or unparseable responses count as wrong.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
