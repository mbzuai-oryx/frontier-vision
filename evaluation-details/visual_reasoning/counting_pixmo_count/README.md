# PixMo-Count (test)

**Data.** [allenai/pixmo-count](https://huggingface.co/datasets/allenai/pixmo-count) at revision `ebf51cf7`, test split, 540 questions. The dataset ships image URLs; the images used here come from the [Jessemel/pixmocount-test](https://huggingface.co/datasets/Jessemel/pixmocount-test) mirror at `dc6d6ca8`, matched by the original image hash (the mirror's bytes are re-encoded, not the original files). 6 test images are missing from the mirror, leaving 534 answerable questions.

**Scoring.** The response's final answer (an explicit `Answer:` line, a boxed value, or else the last line) must be a single non-negative integer; it is compared with the human-verified count by exact match. Unparseable or failed responses count as wrong.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
