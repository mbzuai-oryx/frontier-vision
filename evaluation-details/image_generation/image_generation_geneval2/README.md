# GenEval2

**Data.** GenEval2 prompt set from the official release (github.com/facebookresearch/GenEval2, commit a6e82d2289e8, geneval2_data.jsonl): all 800 prompts, one image generated per prompt.

**Scoring.** Each generated image is judged with the released GenEval2 Soft-TIFA code and its official judge Qwen3-VL-8B-Instruct (pinned revision): per-prompt VQA atoms are scored by the judge's answer probability and aggregated as the per-prompt arithmetic mean (AM) and geometric mean (GM), averaged over prompts. Prompts without a generated image are excluded from the released metrics.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
