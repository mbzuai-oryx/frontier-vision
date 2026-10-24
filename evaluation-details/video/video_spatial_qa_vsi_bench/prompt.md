# VSI-Bench (tiny-400): prompt
Placeholders in `{braces}` are filled per item.

## User turn: multiple-choice questions
````text
<image> × 32 (video frames)
These are frames of a video.
{question}
Options:
{option_1, e.g. "A. ..."}
{option_2}
{option_n}
Answer with the option's letter from the given choices directly.
````

32 frame images, then one text part.

## User turn: numeric questions (same 32 frames first)
````text
These are frames of a video.
{question}
Do not response anything other than a single number!
````
