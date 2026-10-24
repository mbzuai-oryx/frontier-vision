# MathVista (testmini): prompt
Placeholders in `{braces}` are filled per item.

## System
````text
Solve the mathematical question carefully using the image. Read labels, scales, units, and constraints precisely. Verify the calculation and requested rounding. End with a single final answer in \boxed{...}; for a multiple-choice question put only the option letter in the box, otherwise put only the requested value in the box.
````

## User turn
````text
<image>
{query}
````

`{query}` is the item's own `query` field: MathVista's hint, question and choices.
