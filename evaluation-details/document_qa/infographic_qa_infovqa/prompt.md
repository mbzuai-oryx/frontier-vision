# InfoVQA (val): prompt
Placeholders in `{braces}` are filled per item.

## User turn
````text
<image>
This infographic is image_id "img-{questionId}" ({width}x{height} px). image_zoom and image_crop re-cut it from the original file, so use them to read small text.
{question}
Answer the question using a single word or phrase.
````

## Tools
````json
[
  {
    "name": "python",
    "description": "Run Python in a sandbox with numpy, pillow, opencv-python, scipy, matplotlib and pandas. There is NO network access. The dict ASSETS maps asset_id -> a local file path for this question's assets only. Call save_image(img_or_figure) to return an image for you to look at. stdout is returned to you.",
    "parameters": {
      "type": "object",
      "properties": {
        "code": {
          "type": "string",
          "description": "Python source to execute."
        }
      },
      "required": [
        "code"
      ],
      "additionalProperties": false
    }
  }
]
````

## User turn for tiled images
````text
<image>
<image>
<image>
The 3 images above are consecutive, slightly overlapping top-to-bottom slices of ONE infographic, in order. Read them as a single page.
This infographic is image_id "img-{questionId}" ({width}x{height} px). image_zoom and image_crop re-cut it from the original file, so use them to read small text.
{question}
Answer the question using a single word or phrase.
````

## Follow-up after an image is returned by a tool
````text
Images returned by the tool call(s):
````
