# PUMA (nuclei)

**Data.** PUMA challenge (https://puma.grand-challenge.org), track 2: nucleus detection and classification on H&E regions of interest (1024×1024, 40×) of primary and metastatic melanoma, from the public training set.

**Scoring.** Predicted nuclei are matched to ground-truth nuclei per class with the official PUMA track-2 rule (greedy, centroid distance under 15 px). TP/FP/FN are summed over the ROIs, an F1 is computed per class, and the score is the macro F1 over all ten nucleus classes (classes with no matches count as 0). In style B the submission is nucleus instance masks and their centroids are matched; in style A it is nucleus centre points. Tissue segmentation is not scored.

The prompt is in `prompt.md`; settings per model are in `models.yaml`.
