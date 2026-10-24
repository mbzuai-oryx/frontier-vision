# DrivingVQA (test)

**Data.** DrivingVQA official release, test split, 789 questions; one image per question.

**Scoring.** The upstream RIV-CoT `extract_result` reads the letters after `Answer(s):`. Exam Score is an exact match on the set of letters.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
