# VLRS-Bench

**Data.** [thislzm/VLRS-Bench](https://huggingface.co/datasets/thislzm/VLRS-Bench), 2,000 questions. The prompt is each question's own text from the dataset, which already includes its answer-format instruction.

**Scoring.** Tiered score per question:
- single-choice and true/false: 1 or 0;
- multi-choice: 1, or 0.5 for a correct proper subset, otherwise 0;
- fill-in-the-blank: per blank, correct if cosine similarity is at least 0.8 under all-MiniLM-L6-v2.

The overall score is the mean.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
