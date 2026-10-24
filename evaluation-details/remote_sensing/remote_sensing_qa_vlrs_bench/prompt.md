# VLRS-Bench: prompt
Placeholders in `{braces}` are filled per item.

## User turn
````text
<image>
…
{prompt}
````

One image part per image of the item, then `{prompt}`: the item's own `conversations[0].value` with `<image>` tokens removed. No text is added.