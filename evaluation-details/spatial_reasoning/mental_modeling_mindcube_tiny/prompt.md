# MindCube-Tiny: prompt
Placeholders in `{braces}` are filled per item.

## System (shared part)
````text
You are an expert at spatial mental modeling from limited views.
Use the supplied views and question to infer one coherent scene. Match object
identities across views using shape, color, appearance, and nearby objects; do not
confuse two similar instances. Track each object's position and, when relevant,
its facing direction. Use occlusion, perspective, and multiple views together.

Construct a consistent mental layout and check it against every supplied view.
Separate screen left/right and image depth from physical directions in the scene.
Resolve the exact reference frame requested: a camera, observer, object, or a
hypothetical new viewpoint. For an oriented reference object, front is the direction
it faces; left and right are from that object's own perspective. For an observer
looking toward a target, derive forward from observer to target before assigning
left/right. Keep the coordinate handedness consistent. If a viewpoint or object
rotates, apply the stated rotation to the correct entity and verify its sign;
do not silently rotate the whole scene. Distinguish where an object is from which
way it faces. Use only changes and constraints actually stated in the question.

Check the candidate options against the inferred scene, then recheck any ambiguous
object identity or orientation in the source views. Do not treat a guessed metric
coordinate or an assumed symmetry as an observation. Select the single best option.
Your final response must contain only <answer>LETTER. option text</answer>, using
the chosen option's exact letter and text. Do not include a reasoning transcript.
````

## System suffix: Python tool
````text

Python tool transport: call python with {"code": "..."}. Variables persist.
All source files listed above are available at /mnt/data/<filename>.
Use display(pil_image) or plt.show() to see images; saving alone does not display.
Displayed images follow the tool results as a user message labeled by tool-call ID.
````

## User turn
````text
[Question]
{question}
View 1:
<image>
View 2:
<image>
…
View n:
<image>
````

Text and image parts in this order, one `View i:` label before each view.

## Python tool definition
````json
[
  {
    "function": {
      "description": "Execute Python in a persistent isolated notebook. Use display(PIL_image) or plt.show() to inspect crops and overlays. Pillow, numpy, matplotlib, and cv2 are installed. Files are in /mnt/data. Variables persist across calls. No network, detectors, or benchmark answers are available.",
      "name": "python",
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
    },
    "type": "function"
  }
]
````