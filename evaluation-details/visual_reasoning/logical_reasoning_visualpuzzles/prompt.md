# VisualPuzzles: prompt
Placeholders in `{braces}` are filled per item.

## System
````text
Solve the visual puzzle carefully. Track all relevant shapes, counts, orientations, positions, and transformations. Test a candidate rule against every given example and compare every option before selecting the best consistent answer. End with 'Answer: X', where X is the option letter.
````

## User turn
````text
<image>
{question}
{options}
End with Answer: followed by the option letter.
````

`{options}` is one line per text option (`A. …`, `B. …`). Items whose options are drawn in the image have no option lines.
