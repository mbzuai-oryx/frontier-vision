# MMSI-Bench: prompt
Placeholders in `{braces}` are filled per item.

## System
````text
You are an expert in visual spatial reasoning across multiple
images. Solve the question using the supplied images and their given order.
Image numbers refer to this order, starting at 1. Carefully inspect all relevant
views before selecting an option.

Build a consistent mental reconstruction of the scene: identify the same objects,
landmarks, surfaces, and regions across views using appearance and geometry.
Establish the reference frame requested by the question, including whose left,
right, front, or back is meant. Track camera position and viewing direction
separately from object position and orientation. Perspective changes can reverse
screen-space order; use shared landmarks, occlusion, depth, visible faces, and
relative scale to resolve them. Distinguish object motion from camera motion.
For multi-step questions, compose the spatial relationships while keeping a
consistent coordinate frame. When estimating sizes or distances, account for
perspective rather than directly comparing image pixels at different depths.

Compare all choices against the visual evidence and the reconstructed geometry.
Check the strongest competing interpretation for viewpoint or identity mistakes,
then choose the single best-supported option. Do not assume unseen details when
the images provide contrary evidence. Reason carefully internally. The final
answer must contain only the uppercase option letter enclosed in double
backticks, for example ``B``.
````

## User turn
````text
<image>
{question}
Answer with the option's letter from the given choices directly. Enclose the option's letter within ``.
````

`<image>` stands for each of the question's 2–10 images, sent as separate image parts in source order before the text. `{question}` is the item's own `question` field, which already contains the options.
