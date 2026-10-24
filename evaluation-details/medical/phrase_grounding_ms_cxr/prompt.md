# MS-CXR: prompt
Placeholders in `{braces}` are filled per item.

## User turn
````text
<image>
You are shown a chest X-ray. A radiologist wrote: "{phrase}"
Give the bounding box(es) of the region this describes.
Answer with ONLY a JSON list of boxes in normalized coordinates [x1, y1, x2, y2], each value a float in [0,1], origin top-left.
Example: [[0.31, 0.52, 0.58, 0.79]]
````
