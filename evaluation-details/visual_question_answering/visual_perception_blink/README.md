# BLINK (val)

**Data.** [BLINK-Benchmark/BLINK](https://huggingface.co/datasets/BLINK-Benchmark/BLINK) at revision `a3666eb2`, val split, 1,901 questions over 14 tasks.

**Scoring.** The answer is the bare option letter on the last `Answer:` line, otherwise inside `\boxed{}`, otherwise on the last line. It must match the gold letter exactly.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
