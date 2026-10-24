# ActivityNet Captions (temporal localization): prompt
Placeholders in `{braces}` are filled per item.

## User turn
````text
<image> × 48 (frames 1 to 48)
You are given 48 frames sampled uniformly from a video that is {dur:.1f} seconds long.
Frame 1 is at 0.0 s and frame 48 is at {dur:.1f} s, evenly spaced.

Find the single moment that best matches this description:
"{q}"

Answer with ONLY a JSON list of two numbers, the start and end of that moment in seconds: [start, end]. Both must lie within 0 and {dur:.1f}. Example: [12.4, 31.8]
````

48 frame images, then one text part. `{dur:.1f}` is the video duration and `{q}` the query.
