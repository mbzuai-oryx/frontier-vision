# MathVista (testmini)

**Data.** [AI4Math/MathVista](https://huggingface.co/datasets/AI4Math/MathVista) at revision `2b6ad694`, testmini split, 1,000 questions. The user text is the dataset's `query` field.

**Scoring.** The final answer is read from `\boxed{}`. Multiple-choice letters are mapped to their option text, and numeric answers are rounded to the item's precision before an exact match. No LLM answer extraction is used.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
