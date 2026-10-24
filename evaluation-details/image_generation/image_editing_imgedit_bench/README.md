# ImgEdit-Bench (Basic)

**Data.** ImgEdit-Bench Basic single-turn suite from the official release (github.com/PKU-YuanGroup/ImgEdit, commit b79848168744, Benchmark/Basic/basic_edit.json; source images from the Benchmark.tar archive of the sysuyy/ImgEdit Hugging Face dataset): 737 edits across 9 edit types.

**Scoring.** Each edited image is judged by GPT-4o (snapshot gpt-4o-2024-08-06, max 1,024 output tokens) with the released per-edit-type rubric, original image first and edited image second; the released scripts parse the three 1-5 sub-scores, average them per image, then average per edit type. Edits without an output image receive no score and are reported as missing.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
