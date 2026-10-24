# MMSI-Bench

**Data.** [RunsenXu/MMSI-Bench](https://huggingface.co/datasets/RunsenXu/MMSI-Bench) at revision `ec7c92bf`, all 1,000 multiple-choice questions, single pass on the original options. Each question has 2 to 10 images, sent with their original bytes in source order.

**Scoring.** The answer letter is extracted with the official MMSI-Bench single-choice extractor (text inside backticks if present, then the first standalone letter A–D). Accuracy is the share of questions answered correctly; failed or unparseable responses count as wrong.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
