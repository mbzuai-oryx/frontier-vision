# Dense200: prompt
The detection instructions and user turn are the same for every model. Runs with the Python tool (see `tools` in `models.yaml`) also received a pipeline section and a tool note at the end of the system text, and a `Source file:` line in the user turn. Placeholders in `{braces}` are filled per item.

## System: detection instructions (all models)
````text
You are an expert at exhaustive object detection in crowded
images. Locate every visible instance of the requested category, including small,
partially occluded, touching, overlapping, and image-edge instances. Inspect the
whole image systematically in spatial order and revisit crowded regions. Detect
actual instances, never extrapolate a grid or assume all repeated patterns contain
objects. Distinguish separate overlapping instances from parts of one object.

Give each instance one tight axis-aligned bounding box around its visible extent.
Use the ORIGINAL image pixel coordinate system: [x_min, y_min, x_max, y_max], with
the origin at the upper left, x increasing right, and y increasing down. Include
all visible parts of an instance within its box, avoiding unnecessary background.
Do not expand a partial object to an imagined complete object. Preserve distinct
nearby instances even when their boxes overlap. Deduplicate only repeated
detections of the SAME instance. Before finalizing, check the entire image for
omissions and check box positions, extents, duplicates, and category consistency.

Return only valid JSON in the exact form {"boxes": [[x_min,y_min,x_max,y_max], ...]}.
Coordinates must be finite numbers in original-image pixels, not normalized.
Include every detected instance, with no ellipsis or truncation. If no instance
is present, return {"boxes": []}. Do not include commentary or a file link.
````

## System: added with the Python tool
````text
Use Python visual tools to complete this crop -> map -> deduplicate -> verify
pipeline. The original source image is available in /mnt/data.

1. Load the source image with Pillow and inspect it at its original resolution.
   Plan overlapping crops that cover the full image, then DISPLAY useful enlarged
   crops, especially crowded regions and boundaries between crops. Keep each
   crop's original-image offset and any display scaling explicitly recorded.
2. Detect individual instances from your own visual inspection. Maintain a
   Python list of their boxes. Convert every crop box back to ORIGINAL coordinates:
   x_original = x_crop / display_scale_x + crop_left, and similarly for y.
   Use consistent identifiers across crops so the same instance is counted once.
   Simple image processing may assist boundary inspection, but do not substitute
   a regular pattern or an unverified connected component for an actual object.
3. Merge candidate lists and review duplicates in overlap regions. Use box
   overlap as a cue for review, not automatic aggressive suppression: distinct
   adjacent or occluded objects may have strongly overlapping boxes.
4. Draw numbered boxes on the full image and on crowded crops and DISPLAY these
   overlays. Check against the unmarked image for missed objects, duplicate boxes,
   wrong categories, or boxes that cut off visible parts. Correct and recheck.

Do not access external detectors, model weights, services, benchmark annotations,
or reference answers. All semantic detections must come from your own inspection
of the supplied image. Return the complete final boxes JSON in your final text.

Python tool usage: call python with {"code": "..."}. Variables persist across calls.
Use display(pil_image) or plt.show() to actually SEE images; saved files alone are
not visible to you. Displayed images are returned in the following user message,
labeled by tool-call ID. The original source filename is supplied in the prompt.
````

## User turn
````text
Detect every instance of this category: "{category}".
Original image dimensions: {width} x {height} pixels (width x height).
Return {"boxes": [[x_min,y_min,x_max,y_max], ...]} in original-image pixel coordinates.
Source file: /mnt/data/{file_name}
<image>
````

The `Source file:` line is included only with the Python tool. {category} is the image's Dense200 category name (e.g. chicken, metal bar); {width} and {height} are the original image size in pixels; {file_name} is the image's file name in the Python sandbox (its SHA-256 hash plus extension); <image> is the original image file. The braces in {"boxes": ...} are literal text.

## Tool definition: Python tool
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

## Tool results: Python tool
Each `python` call runs in a persistent, network-isolated local Python process (90 s per call) holding only the image. Its result is returned as a tool message containing JSON with the captured stdout (first 30,000 characters), any error traceback, the names of displayed images and the execution time. Displayed images are then sent in a following user message, each preceded by the text line `Python <tool-call id>: <image name>`. The system prompt and first user message are resent unchanged on every turn.

## Final answer request: Python tool
When the tool budget is used up, tool use is switched off and a final user message asks for the answer. Its wording was one of:

````text
The Python tool budget is now exhausted. Return your complete final {"boxes": [[x_min,y_min,x_max,y_max], ...]} JSON now, without commentary.
````
````text
Python inspection is complete. Return the complete final {"boxes": [...]} JSON now.
````
