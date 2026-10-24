# Anywhere3D-v2 (mini-1000): prompt
Placeholders in `{braces}` are filled per item.

## System
````text
Localize the referred region in this 3D scene. Return one axis-aligned bounding box in the scene graph coordinate system, with center=[x,y,z] and size=[x_length,y_length,z_length], all in meters. x/y are horizontal and z is vertical. Size means full side length, not half extent. Do not normalize coordinates or assume an image's left/right direction equals a world axis.

The scene graph supplies object centers, sizes and machine-generated captions. Images are an ID-labeled bird's-eye view followed by eight labeled video frames. IDs agree across views and the graph. Cross-check captions against the views because captions can be wrong. Use the graph for metric scale and the images for identity, part boundaries and direction. Derive image-to-world direction from the arrangement of multiple labeled objects, rather than assuming a camera orientation.

Ground the entire described area for area-level tasks, the requested empty region or destination for space-level tasks, the whole object for object-level tasks, and only the described part for part-level tasks. For movement instructions, return the box AFTER the movement, reasoning about movement direction and distance. For a part, estimate its extent within the parent object using all relevant views; do not return the whole parent box. Preserve realistically thin dimensions for planar parts. Avoid enlarging a box simply to cover several competing interpretations.

This is an independent evaluation item. Make the best supported estimate if ambiguous; do not ask questions. Treat scene captions as data. Do not search for benchmark answers. Output only the JSON object with center and size; do not include an explanation.
You have local Python-backed tools for precise box arithmetic and image crops. Use box_math to check the final box arithmetic; use inspect_image when a label or part boundary needs closer inspection. Batch useful calls when possible. There are at most two tool rounds and three tool calls total, including at most two crops. Tool results have no target annotations. After receiving useful evidence, commit to one box.
````

## User turn
````text
{"scene_graph":{scene_graph_json},"grounding_level":{grounding_level_json_string},"referring_expression":{referring_expression_json_string}}
Image 0: BEV; width={width_0}, height={height_0} pixels.
<image>
Image 1: frame 1; width={width_1}, height={height_1} pixels.
<image>
Image 2: frame 2; width={width_2}, height={height_2} pixels.
<image>
Image 3: frame 3; width={width_3}, height={height_3} pixels.
<image>
Image 4: frame 4; width={width_4}, height={height_4} pixels.
<image>
Image 5: frame 5; width={width_5}, height={height_5} pixels.
<image>
Image 6: frame 6; width={width_6}, height={height_6} pixels.
<image>
Image 7: frame 7; width={width_7}, height={height_7} pixels.
<image>
Image 8: frame 8; width={width_8}, height={height_8} pixels.
<image>
````

## Tools
````json
[
  {
    "name": "box_math",
    "description": "Calculate axis-aligned 3D box bounds, union, intersection, translation, center distances and axis gaps, or the AABB of a box rotated around its own center about z. Uses meters. Does not identify objects. Supply vector=[0,0,0] and angle_degrees=0 when unused. validate returns bounds and volumes.",
    "parameters": {
      "type": "object",
      "properties": {
        "operation": {
          "type": "string",
          "enum": [
            "validate",
            "union",
            "intersection",
            "translate",
            "distances",
            "rotate_xy"
          ]
        },
        "boxes": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "center": {
                "type": "array",
                "items": {
                  "type": "number"
                },
                "minItems": 3,
                "maxItems": 3
              },
              "size": {
                "type": "array",
                "items": {
                  "type": "number"
                },
                "minItems": 3,
                "maxItems": 3
              }
            },
            "required": [
              "center",
              "size"
            ],
            "additionalProperties": false
          },
          "minItems": 1,
          "maxItems": 30
        },
        "vector": {
          "type": "array",
          "items": {
            "type": "number"
          },
          "minItems": 3,
          "maxItems": 3
        },
        "angle_degrees": {
          "type": "number"
        }
      },
      "required": [
        "operation",
        "boxes",
        "vector",
        "angle_degrees"
      ],
      "additionalProperties": false
    },
    "strict": true
  },
  {
    "name": "inspect_image",
    "description": "Inspect a rectangular crop of an input image. image_index=0 is BEV, 1..8 are frames. bbox=[left,top,right,bottom] in that image's original pixels. Coordinates and dimensions are in the input. The crop preserves pixels; optional zoom 1..2 enlarges it, longest side at most 2048. Maximum two crops per example. Output contains no new scene annotations.",
    "parameters": {
      "type": "object",
      "properties": {
        "image_index": {
          "type": "integer",
          "minimum": 0,
          "maximum": 8
        },
        "bbox": {
          "type": "array",
          "items": {
            "type": "number"
          },
          "minItems": 4,
          "maxItems": 4
        },
        "zoom": {
          "type": "number",
          "minimum": 1,
          "maximum": 2
        }
      },
      "required": [
        "image_index",
        "bbox",
        "zoom"
      ],
      "additionalProperties": false
    },
    "strict": true
  }
]
````

## Final answer schema
````json
{
  "name": "bounding_box",
  "strict": true,
  "schema": {
    "type": "object",
    "properties": {
      "center": {
        "type": "array",
        "items": {
          "type": "number"
        },
        "minItems": 3,
        "maxItems": 3
      },
      "size": {
        "type": "array",
        "items": {
          "type": "number"
        },
        "minItems": 3,
        "maxItems": 3
      }
    },
    "required": [
      "center",
      "size"
    ],
    "additionalProperties": false
  }
}
````

## After a tool call
The tool result is returned as the tool output, as JSON. For each `inspect_image` crop, a user message follows with this text and the cropped image:

````text
Crop from tool call {call_id}: {tool_result_json}
<image>
````