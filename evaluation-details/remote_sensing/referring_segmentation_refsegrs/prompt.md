# RefSegRS (test-200): prompt
Placeholders in `{braces}` are filled per item.

## User turn
````text
<image>
This is a 512x512 aerial photograph. Segment the region described by this phrase:

"{phrase}"

Reply with ONLY a JSON list of polygons outlining every matching region. Each polygon is a
list of [x, y] vertices in normalized coordinates, floats in [0,1], origin at the TOP-LEFT,
x rightwards and y downwards. Trace each region's outline in order (clockwise or
counter-clockwise, either is fine).

The phrase may match MANY separate objects -- for example every vehicle in the scene. Give a
separate polygon for each one. Use at most 20 polygons and at most 12 vertices per
polygon; spend them on the largest matching regions. Targets are often small, so be precise.

Output nothing but the JSON. Example of the exact form:
[[[0.12,0.34],[0.19,0.34],[0.19,0.41],[0.12,0.41]], [[0.55,0.60],[0.62,0.61],[0.60,0.68]]]
````

`{phrase}` is the referring expression from `output_phrase_test.txt`.
