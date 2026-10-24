# DAVIS-2017 (val): prompt
Placeholders in `{braces}` are filled per item.

## System
````text
Perform semi-supervised video instance segmentation from the supplied visual inputs.
The first image is the original reference frame. The second image is that same
frame with an unoccluded colored first-mask overlay and an ID legend below the
original image content. The third image is a clean indexed-color first-mask panel
with the same ID legend below the original image content. These legend bands are
outside the image; they do not change the original frame's coordinate system.
All subsequent images are unannotated target frames in the specified order.
Track exactly the reference object IDs and segment each object's visible pixels
in every target frame. Keep identities consistent through motion and occlusion.
Do not segment shadows, reflections, cast light, or occluders as part of an object.
Return JSON only in the supplied schema. Each frame must list every reference ID.
Use polygons tracing actual visible outlines, not bounding boxes. Multiple outer
polygons represent disconnected visible components; holes remove background
inside those outer polygons. Fully invisible objects have empty polygons and holes.
Coordinates are [x,y] normalized to [0,1000] across each target image, with [0,0]
at its top-left and [1000,1000] at its bottom-right. Trace each ring in boundary
order without repeating its initial point. Use enough vertices to preserve shape.
Work only from the supplied images. No web, tools, other files, or external models.

First establish the exact object identities and what belongs to each instance
from the colored first-frame annotation. Then inspect each target frame at its
native image scale. Locate extrema and use them to anchor coordinates. Trace
each silhouette in order with roughly 24-80 vertices per main component, placing
extra vertices at high curvature, narrow limbs, tails, necks, wheel rims and
occlusion intersections. Simple components may use fewer vertices. Include small
visible disconnected parts. Preserve background holes (e.g. bicycle wheel/triangle
interiors and gaps between limbs), using explicit hole rings when enclosed. Do
not join separate objects, fill large concavities, or hallucinate hidden contours.
When two objects touch, assign their shared border to the correct IDs using
appearance and temporal correspondence. Check each ring for self-intersections
and against the target image before emitting the final JSON. Prioritize both
pixel overlap and precise visible boundary placement.
````

## User turn
````text
{"task": "Track the reference objects and segment every target frame.", "image_order": ["reference original frame 0", "reference label-free colored mask overlay with external legend", "reference exact indexed-color instance map with external legend", "target frame {t1}", ..., "target frame {tN}"], "target_frame_ids": [{t1}, ..., {tN}], "reference_object_ids": {reference_object_ids}, "image_width": {width}, "image_height": {height}, "reference_rendering": {"arm": "corrected_reference", "original_size": [{width}, {height}], "content_bbox_xyxy": [0, 0, {width}, {height}], "bbox_convention": "half-open pixel bounds", "panel_size": [{width}, {panel_height}], "legend_bbox_xyxy": [0, {height}, {width}, {panel_height}], "object_ids": {reference_object_ids}, "colors": {id_colors}, "object_pixel_counts": {id_pixel_counts}, "overlay_alpha": 0.55, "labels_inside_image": false, "contours_drawn_over_image": false, "indexed_mask_preserves_annotation_values": true, "annotation_frame": 0, "coordinate_note": "Legend is outside content. Target output coordinates refer to the original target image, never the panel."}, "overlay_colors": {id_colors}}
<image>
<image>
<image>
<image>
<image>
<image>
<image>
<image>
<image>
<image>
<image>
````

One user turn per call: a JSON text block, then 11 images in this order: frame 0 RGB; frame 0 with the first-frame masks as a 55% color overlay and an ID legend band appended below the image; the exact indexed-color frame-0 mask with the same legend band; then the 8 target frames (JPEG, 480p). {t1}..{tN} are the target frame numbers (8 per call; the last call of a video may have fewer), {reference_object_ids} the object IDs in the frame-0 annotation, {width}/{height} the frame size (854x480 for 28 videos), {panel_height} the panel height including the legend band, {id_colors} the ID-to-RGB overlay colors and {id_pixel_counts} the frame-0 pixel count per ID. Every call of a video repeats the same three frame-0 images.

## Output schema
````json
{
  "type": "object",
  "properties": {
    "detections": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "frame": {
            "type": "integer"
          },
          "objects": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "integer"
                },
                "polygons": {
                  "type": "array",
                  "items": {
                    "type": "array",
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "number"
                      },
                      "minItems": 2,
                      "maxItems": 2
                    },
                    "minItems": 3
                  }
                },
                "holes": {
                  "type": "array",
                  "items": {
                    "type": "array",
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "number"
                      },
                      "minItems": 2,
                      "maxItems": 2
                    },
                    "minItems": 3
                  }
                }
              },
              "required": [
                "id",
                "polygons",
                "holes"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "frame",
          "objects"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "detections"
  ],
  "additionalProperties": false
}
````

## Example user text (bike-packing, first call)
````text
{"task": "Track the reference objects and segment every target frame.", "image_order": ["reference original frame 0", "reference label-free colored mask overlay with external legend", "reference exact indexed-color instance map with external legend", "target frame 1", "target frame 2", "target frame 3", "target frame 4", "target frame 5", "target frame 6", "target frame 7", "target frame 8"], "target_frame_ids": [1, 2, 3, 4, 5, 6, 7, 8], "reference_object_ids": [1, 2], "image_width": 910, "image_height": 480, "reference_rendering": {"arm": "corrected_reference", "original_size": [910, 480], "content_bbox_xyxy": [0, 0, 910, 480], "bbox_convention": "half-open pixel bounds", "panel_size": [910, 540], "legend_bbox_xyxy": [0, 480, 910, 540], "object_ids": [1, 2], "colors": {"1": [255, 65, 65], "2": [55, 255, 80]}, "object_pixel_counts": {"1": 30321, "2": 43392}, "overlay_alpha": 0.55, "labels_inside_image": false, "contours_drawn_over_image": false, "indexed_mask_preserves_annotation_values": true, "annotation_frame": 0, "coordinate_note": "Legend is outside content. Target output coordinates refer to the original target image, never the panel."}, "overlay_colors": {"1": [255, 65, 65], "2": [55, 255, 80]}}
````