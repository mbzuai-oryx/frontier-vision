# DIODE (val-350): prompt
Placeholders in `{braces}` are filled per item.

## System
````text
Estimate a dense metric depth map from this single RGB image.
Image width 1024, height 768. Pixel coordinates x right, y down. Camera intrinsics, pose and height are unknown. Depth means axial camera Z in meters, not Euclidean range or normalized depth.
Use only the RGB image. No pretrained depth or segmentation models, external data, internet, other images, annotations or ground truth are available.
An optional Python tool is available with numpy, scipy, cv2, PIL and matplotlib. /mnt/data/rgb.png contains this image. You decide whether a tool would help and what to do with it. Tool use is not required or rewarded. You may make zero, one, or two Python calls for any image inspection, measurement, computation, candidate prediction or checking you find useful. You can stop using tools whenever you judge you have enough information. You can display images with display(PIL_image) or plt.show(). The tool returns its output to you before you make the final submission. You are free to use, partly use, revise, or discard the tool result. Do not treat calling a tool as submitting your final prediction.
Your final answer is JSON containing a submission choice, code, a tool_result_use label, and one concise decision_summary describing the observable use of any tool result. Do not provide a chain of thought. If a tool-created depth.npy is your final prediction, choose submission="existing_artifact" and code="". Otherwise choose submission="new_program" and provide a complete standalone Python program that creates /mnt/data/depth.npy from the RGB image and any of your own saved files you choose to use. No other final prose is needed. Final code will be executed only to materialize your numeric prediction; you will not receive feedback from that execution. If you report discarding tool output, the final program is executed in a fresh RGB-only workspace.
The final depth.npy must be a float32 array of shape (768,1024), finite and strictly positive everywhere, in axial meters. A colorized preview is not a numeric prediction. Your reasoning should decide the depth-estimation method and whether tool results are useful. Make your best metric estimate despite ambiguous monocular scale.

Displayed Python images are returned in a following user message labeled with the tool-call ID. Tool text and images are feedback from your own computation.
````

## User turn
````text
Estimate and submit metric depth for this image. Decide for yourself whether Python is helpful.
<image>
````

## Tools
````json
[
  {
    "name": "python",
    "description": "Optional Python computation or image inspection in an isolated RGB-only workspace. Results return to you for assessment; you may use or discard them. At most two optional invocations.",
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

## Final answer schema
````json
{
  "additionalProperties": false,
  "properties": {
    "code": {
      "type": "string"
    },
    "decision_summary": {
      "type": "string"
    },
    "submission": {
      "enum": [
        "existing_artifact",
        "new_program"
      ],
      "type": "string"
    },
    "tool_result_use": {
      "enum": [
        "not_called",
        "used",
        "partly_used",
        "discarded"
      ],
      "type": "string"
    }
  },
  "required": [
    "submission",
    "code",
    "tool_result_use",
    "decision_summary"
  ],
  "type": "object"
}
````
