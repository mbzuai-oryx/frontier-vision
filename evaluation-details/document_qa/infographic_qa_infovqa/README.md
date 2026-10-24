# InfoVQA (val)

**Data.** InfoVQA validation, 2,801 questions, from the VLMEvalKit `InfoVQA_VAL` TSV (md5 `2342e9c2…`). Images are sent at original resolution; images above 30,000 patches are split into tiles.

**Scoring.** Whitespace, a leading `answer:` and surrounding quotes are stripped, then ANLS (threshold 0.5) is computed with VLMEvalKit.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
