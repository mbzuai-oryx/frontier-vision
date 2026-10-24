# VSI-Bench (tiny-400)

**Data.** [nyu-visionx/VSI-Bench](https://huggingface.co/datasets/nyu-visionx/VSI-Bench), 5,130-question release. A fixed 400-question subset, 50 per reported task; see `split.json`. 32 frames per video, sampled uniformly, at native resolution.

**Scoring.** The upstream thinking-in-space scorer: exact match for multiple-choice questions and mean relative accuracy for numeric ones.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.

## Evaluation set

The item ids are listed in `split.json`.

The VSI-Bench paper describes a 400-question "tiny" set with 50 questions per task, but its ids were never released. This is our own sample, built to the same 50-per-task design.

**Selection**
1. Questions were grouped into the 8 reported tasks. The three relative-direction difficulty levels count as one task. Each task gets 50 questions.
2. Within a task, questions were split into strata by:
   - difficulty level (relative direction only);
   - source dataset (ScanNet, ScanNet++, ARKitScenes);
   - answer: the correct option letter for multiple-choice questions, or the quartile of the ground-truth value for numeric ones, with quartiles computed on the full set.

   The 50 were allocated in proportion to stratum size, rounding by largest remainder.
3. Tasks were processed in sorted order with a single `random.Random(42)`. Within each stratum, candidates were shuffled, then ordered so that questions from the least-used scenes come first.

**Composition**
- 50 questions per reported task. The relative-direction task is 11 easy, 19 medium and 20 hard.
- By source: ScanNet 160, ARKitScenes 133, ScanNet++ 107.
- 265 scenes.
