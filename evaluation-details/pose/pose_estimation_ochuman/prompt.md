# OCHuman (test-500): prompt
Placeholders in `{braces}` are filled per item.

## User turn
````text
<image>
This photo contains one or more people, often heavily overlapping.
Estimate the 2D body pose of the SINGLE person whose bounding box is
  [x1, y1, x2, y2] = {box}
in normalized image coordinates (origin top-left, each value in [0,1]).
Other people may overlap this box -- annotate only the person it frames.

Return the 17 COCO keypoints, in this exact order:
  1. nose
  2. left_eye
  3. right_eye
  4. left_ear
  5. right_ear
  6. left_shoulder
  7. right_shoulder
  8. left_elbow
  9. right_elbow
  10. left_wrist
  11. right_wrist
  12. left_hip
  13. right_hip
  14. left_knee
  15. right_knee
  16. left_ankle
  17. right_ankle

Answer with ONLY a JSON list of 17 [x, y] pairs, normalized to the FULL IMAGE (not the box), each value a float in [0,1] with 3 decimals. Estimate occluded joints too -- give your best guess for every one of the 17, never null.
Example: [[0.512, 0.211], [0.523, 0.201], ... ] (17 pairs total)
````

`{box}` is the target person's ground-truth box `[x, y, w, h]` converted to `[x1, y1, x2, y2]` normalized by the image width and height, rounded to 3 decimals.
