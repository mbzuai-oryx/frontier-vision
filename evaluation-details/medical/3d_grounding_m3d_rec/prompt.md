# M3D-Bench REC (test-200): prompt
Placeholders in `{braces}` are filled per item.

## User turn
````text
<image>
SLICE 0
<image>
SLICE 1
…
<image>
SLICE 31
These are 32 axial CT slices of an abdomen, ordered from the top of the volume
(SLICE 0) to the bottom (SLICE 31). They are windowed for abdominal soft tissue.

Where is the {organ} in this volume? Give its 3D bounding box.

Reply with ONLY a JSON list of six numbers [x1, y1, z1, x2, y2, z2], floats in [0,1]:
  x = position along the SLICE axis (0 = SLICE 0, 1 = SLICE 31)
  y = vertical position within a slice (0 = top)
  z = horizontal position within a slice (0 = left)
x1<x2, y1<y2, z1<z2. Output nothing but the six numbers.
Example: [0.31, 0.22, 0.40, 0.68, 0.55, 0.72]
````

`{organ}` is one of liver, kidney, spleen or pancreas.
