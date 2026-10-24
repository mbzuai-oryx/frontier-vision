# ReasonSeg (val): prompt
Placeholders in `{braces}` are filled per item.

## System: task instructions
````text
You perform reasoning segmentation. Identify the region requested by
the user's query in the provided image and produce its precise pixel segmentation mask.
Use the python tool to inspect the image, zoom/crop as helpful, and create the mask.
You may use Python image processing (numpy, Pillow, OpenCV, etc.). Use your own visual
understanding; do not use pretrained models, external services, web resources, or
benchmark annotations. Include all visible pixels of the requested object(s) or
region(s), following their actual boundaries, and exclude background and occluders.
````

## System: saving and returning the mask
````text
The source image is /mnt/data/image.jpg. Save /mnt/data/mask.png as a single-channel
binary PNG with exactly the original image width and height, target pixels 255 and
background 0. Do not resize the final mask, add labels, or draw an overlay in this file.
You have at most three Python calls. Variables persist. Use display(PIL_image) or
plt.show() to actually see crops or overlays. Up to two displayed images per call are
returned in a following user message labelled with the tool-call ID, thumbnailed to
1024x1024 as needed. You may inspect intermediate images and revise your work.
When finished, return only {"mask_path":"/mnt/data/mask.png"}. The file must already
exist and contain your final mask. Do not put base64, Python code, or a placeholder
in the final answer. No mask is provided by the evaluator.
````

## User turn
````text
{query}
Native image dimensions: {width} x {height} pixels (width x height).
<image>
````

{query} is the first annotation text wrapped as "What is {text} in this image? Please output segmentation mask." for phrase queries or "{text} Please output segmentation mask." for sentence queries; {width} x {height} are the native pixel dimensions; the image is the original JPEG.

## Tool definition
````json
[
  {
    "name": "python",
    "description": "Execute Python in a persistent isolated notebook. Use display(PIL_image) or plt.show() to inspect crops and overlays. Pillow, numpy, matplotlib, and cv2 are installed. Files are in /mnt/data. Variables persist across calls. No network, detectors, or benchmark answers are available.",
    "parameters": {
      "additionalProperties": false,
      "properties": {
        "code": {
          "type": "string"
        }
      },
      "required": [
        "code"
      ],
      "type": "object"
    }
  }
]
````

## Tool-loop follow-up message (after each Python call)
````text
Images displayed by your Python call {tool_call_id}:
<image> (up to two displayed images)
{n} Python calls remain. Inspect or revise if useful, or submit your final mask_path JSON.
````

## Follow-up message after the third Python call (final turn; no further tool use)
````text
Images displayed by your Python call {tool_call_id}:
<image>
0 Python calls remain. Submit your final mask_path JSON now.
````
