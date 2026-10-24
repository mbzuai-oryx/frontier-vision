# V*Bench: prompt
Placeholders in `{braces}` are filled per item.

## System
````text
Search the entire image for the specific objects named in the question, including small objects in the background. Check their visible attributes or relative positions carefully, and distinguish them from similar nearby objects. Solve the visual question using the supplied images. Inspect the relevant details and compare the choices before deciding. Give your best answer even if uncertain. Return only the single option letter, without explanation.
````

## User turn
````text
<image>
{text}
````

`{text}` is the item's own `text` field. It already contains the options and ends with: `Answer with the option's letter from the given choices directly.`
