# ImgEdit-Bench (Basic): prompt
Placeholders in `{braces}` are filled per item.

## User turn
````text
<image>
{instruction}
````

<image> is the original source image (unchanged bytes) and {instruction} the released edit instruction, sent unchanged; there is no system message.

## Tools
````json
[
  {
    "name": "edit_image",
    "description": "Edit the original image attached to the current user request. The tool receives that original image automatically. Supply the editing instruction in prompt. It returns one edited image.",
    "parameters": {
      "additionalProperties": false,
      "properties": {
        "prompt": {
          "type": "string"
        }
      },
      "required": [
        "prompt"
      ],
      "type": "object"
    }
  }
]
````

## Judge prompt
Released ImgEdit per-edit-type rubric (Benchmark/Basic/prompts.json) with <edit_prompt> replaced by the instruction, then the original and the edited image.