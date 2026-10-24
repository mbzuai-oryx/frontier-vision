# BlindTest

**Data.** [XAI/vlmsareblind](https://huggingface.co/datasets/XAI/vlmsareblind) at revision `8c9b35b2`, valid split, 8,016 questions.

**Scoring.** The final answer is taken from the last `Answer:` line, `\boxed{}`, the last `{...}`, or the last line. Counting Grid tasks accept two `{n}` values or an `r, c` pair. All other tasks use a case- and whitespace-normalized exact match.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
