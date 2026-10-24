# GenEval2: prompt
Placeholders in `{braces}` are filled per item.

## User turn
````text
{prompt}
````

{prompt} is the released GenEval2 prompt, sent unchanged as the only user text (no system message, no images).

## Tools
````json
[
  {
    "name": "generate_image",
    "description": "Generate one image from the supplied prompt.",
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