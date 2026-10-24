# MMMU-Pro-Med

**Data.** [MMMU/MMMU_Pro](https://huggingface.co/datasets/MMMU/MMMU_Pro), `standard (10 options)` setting, test split, restricted to the Health & Medicine subjects: Basic Medical Science, Clinical Medicine, Diagnostics and Laboratory Medicine, Pharmacy, Public Health. That gives 286 questions; this is a subject slice, not a random sample.

**Scoring.** The upstream MMMU-Pro parser (`parse_multi_choice_response`), including its random-choice fallback (seed 42) when no letter is found.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
