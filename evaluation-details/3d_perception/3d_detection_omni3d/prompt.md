# Omni3D (test mini-1000): prompt
Placeholders in `{braces}` are filled per item.

## System
````text
Perform monocular 3D object detection from this single RGB image and its camera calibration.
Detect visible instances of the supplied 50 category names. Do not restrict the vocabulary using guesses about the source dataset.
Return distinct detections, with no duplicate boxes for the same object. Estimate full amodal physical extents, including occluded parts.
Camera coordinates: +X right, +Y down, +Z forward away from the camera; all 3D lengths are meters.
center_cam is the geometric box center [X,Y,Z], not its ground-contact point.
dimensions is [width,height,length] along the box's local X,Y,Z axes before rotation.
rotation_xyz_deg contains extrinsic rotations about camera X, then Y, then Z, in degrees; R=Rz@Ry@Rx maps local offsets into the camera frame.
Zero rotation aligns local axes with camera axes. Camera tilt/roll must be represented, not discarded. A 180-degree box-axis symmetry is acceptable.
score is confidence in correct class AND localization between 0 and 1. Estimate metric depth from visual evidence, calibration, and plausible physical size; do not confuse pixel height with physical height.
All 8 corners must have positive camera Z. The evaluator derives the 2D box by projecting all 8 corners and clipping to the original image.
Use only the supplied image and calibration. Output only the detection JSON. An empty detections array is allowed.

Establish scene scale, perspective, and gravity cues first. Inventory relevant objects, including partially occluded ones.
Use u=fx*X/Z+cx and v=fy*Y/Z+cy. Ground-contact points and geometric centers differ.
Choose dimensions and depth jointly so the projected cuboid agrees with the visible silhouette and perspective. Check width/height/length ordering, object orientation, occlusion, and duplicated detections.
When available, use crop_image for unresolved visual details and project_boxes to inspect projected candidate cuboids. The tools calculate from your estimates only; they do not detect objects or provide ground truth. Revise estimates if the overlay contradicts the image.
Complete the detection even if metric scale is uncertain; express uncertainty with the confidence score.
````

## User turn
````text
{"image_width":{width},"image_height":{height},"camera_intrinsics_K":{K},"category_names":["chair","table","cabinet","car","lamp","books","sofa","pedestrian","picture","window","pillow","truck","door","blinds","sink","shelves","television","shoes","cup","bottle","bookcase","laptop","desk","cereal box","floor mat","traffic cone","mirror","barrier","counter","camera","bicycle","toilet","bus","bed","refrigerator","trailer","box","oven","clothes","van","towel","motorcycle","night stand","stove","machine","stationery","bathtub","cyclist","curtain","bin"]}
<image>
````

`{width}` and `{height}` are the image size in pixels and `{K}` the 3×3 camera intrinsics. The 50 category names are the same for every image.

## Output schema
````json
{
  "additionalProperties": false,
  "properties": {
    "detections": {
      "items": {
        "additionalProperties": false,
        "properties": {
          "category": {
            "enum": [
              "chair",
              "table",
              "cabinet",
              "car",
              "lamp",
              "books",
              "sofa",
              "pedestrian",
              "picture",
              "window",
              "pillow",
              "truck",
              "door",
              "blinds",
              "sink",
              "shelves",
              "television",
              "shoes",
              "cup",
              "bottle",
              "bookcase",
              "laptop",
              "desk",
              "cereal box",
              "floor mat",
              "traffic cone",
              "mirror",
              "barrier",
              "counter",
              "camera",
              "bicycle",
              "toilet",
              "bus",
              "bed",
              "refrigerator",
              "trailer",
              "box",
              "oven",
              "clothes",
              "van",
              "towel",
              "motorcycle",
              "night stand",
              "stove",
              "machine",
              "stationery",
              "bathtub",
              "cyclist",
              "curtain",
              "bin"
            ],
            "type": "string"
          },
          "center_cam": {
            "items": {
              "type": "number"
            },
            "maxItems": 3,
            "minItems": 3,
            "type": "array"
          },
          "dimensions": {
            "items": {
              "type": "number"
            },
            "maxItems": 3,
            "minItems": 3,
            "type": "array"
          },
          "rotation_xyz_deg": {
            "items": {
              "type": "number"
            },
            "maxItems": 3,
            "minItems": 3,
            "type": "array"
          },
          "score": {
            "maximum": 1,
            "minimum": 0,
            "type": "number"
          }
        },
        "required": [
          "category",
          "score",
          "center_cam",
          "dimensions",
          "rotation_xyz_deg"
        ],
        "type": "object"
      },
      "type": "array"
    }
  },
  "required": [
    "detections"
  ],
  "type": "object"
}
````

