# ETH3D (multi-view, 10 scenes): prompt
Placeholders in `{braces}` are filled per item.

## System
````text
Predict numeric 3D geometry from the supplied RGB views. All numerical geometry must be your own prediction. No external reconstruction/depth/matching model, image-based reconstruction algorithm, ground truth, internet or retrieved data may be used.
Return the specified JSON. It is a compact numeric representation of YOUR predicted dense depth, not code. A fixed decoder only rasterizes it; it never looks at RGB or optimizes geometry.
Depth is positive camera-axis Z, not Euclidean ray length. Pixels use x right, y down, z forward. Let u=(x+0.5)/width and v=(y+0.5)/height. An inverse_depth_plane [a,b,c] means Z=1/(a*u+b*v+c). A frontoparallel constant Z is [0,0,1/Z]. The base plane covers the image. Each region has a polygon of [u,v] vertices in [0,1] and its own inverse-depth plane. Regions overwrite earlier ones in order, so specify background first and foreground last. All final denominators must be strictly positive everywhere. Split surfaces into polygons to preserve occlusions and boundaries. Use up to 16 regions per output view where useful, with compact numbers. Do not invent depth texture from image brightness.
Use multi-view parallax, shared landmarks, perspective, occlusion, scene layout, support/contact and object-size priors. Account for floors, walls, furniture, vegetation and distant background as visible. Give your best numeric estimate even where evidence is uncertain. Keep the answer compact enough to finish within the token budget.
Reconstruct ALL 10 views jointly in one response, without known camera calibration. Estimate each view's intrinsics_normalized=[fx/width,fy/height,cx/width,cy/height], camera-to-world quaternion rotation_xyzw, and translation (camera center in world coordinates). World equals camera 0: its rotation must be [0,0,0,1], translation [0,0,0]. Use a single consistent scale for all camera translations and depths. Other cameras may face very different directions; infer their rotations and baselines from shared scene content. Intrinsics are positive focal lengths, usually a centered principal point. Return 10 views with view_index 0 through 9, each with its depth surface representation. Do not merely repeat the same camera pose for every image.

Return your final prediction as one JSON object matching the supplied output schema; no prose or subsequent response is needed. Prefer a complete coherent approximation over prolonged analysis of ambiguous geometry.

Geometry-oriented reconstruction guidance, adapted to joint multi-view prediction:
Construct one coherent scene layout before detailing its views. Identify the large supporting surfaces, their perspective, occlusion relationships and recurring objects, then place visible front surfaces consistently within that layout. Use multiple independent scale and perspective cues; uncertainty in an object's physical size or camera height must not silently set different scales in different views. Texture, shadows, brightness and reflections alone do not imply depth discontinuities. Preserve actual support/contact and occlusion boundaries. Use projective planar geometry where supported and avoid unstable intersections or unsupported depth extrapolation near a guessed horizon.
Treat calibration, relative cameras and depths as a coupled geometric estimate. The images are one photographic scene sequence: infer a shared lens model where consistent with the RGB rather than guessing an unrelated focal length per view. Infer field of view from perspective, orthogonal directions when visibly justified, and agreement of recurring objects across views. Do not copy a familiar camera focal length without checking its consequences. Remember fx/width and fy/height are differently normalized; equal focal lengths in pixels generally have different normalized values. Do not assume principal-point or focal values have been supplied.
Use recognizable common landmarks and surface boundaries to check your relative rotations, camera centers and depth scale jointly. Account for both camera rotation and translation instead of interpreting every displacement as parallax. A landmark should project consistently into the views in which it is visible. Keep repeated walls, ceiling, floor and furniture surfaces consistent in their world orientation and position. Use a shared scene scale for depths and baselines; fixing camera 0 defines a coordinate frame, not gravity. Do not assume camera-0 y is exactly vertical. Occlusion and contact must agree with the chosen camera arrangement. If cues disagree, revisit the camera/layout estimate rather than compensating with independent arbitrary depth scales. Choose the single geometry best supported by the RGB. Do not report internal reasoning or alternative hypotheses.
````

## User turn
````text
{"view_index":0,"width":518,"height":350}
<image>
{"view_index":1,"width":518,"height":350}
<image>
{"view_index":2,"width":518,"height":350}
<image>
{"view_index":3,"width":518,"height":350}
<image>
{"view_index":4,"width":518,"height":350}
<image>
{"view_index":5,"width":518,"height":350}
<image>
{"view_index":6,"width":518,"height":350}
<image>
{"view_index":7,"width":518,"height":350}
<image>
{"view_index":8,"width":518,"height":350}
<image>
{"view_index":9,"width":518,"height":350}
<image>
````

One user turn per scene: for each of the 10 views, a JSON line with its index and size, followed by the image (PNG). Every scene uses 518x350 images, so this text is the same for all scenes. Kimi K3, Qwen3.8-Max, Muse Spark 1.3 and Fable 5 received the same JSON lines written with a space after each colon and comma.

## Output schema
````json
{
  "type": "object",
  "properties": {
    "views": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "view_index": {
            "type": "integer"
          },
          "base_inverse_depth_plane": {
            "type": "array",
            "items": {
              "type": "number"
            },
            "minItems": 3,
            "maxItems": 3
          },
          "regions": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "polygon": {
                  "type": "array",
                  "items": {
                    "type": "array",
                    "items": {
                      "type": "number"
                    },
                    "minItems": 2,
                    "maxItems": 2
                  },
                  "minItems": 3,
                  "maxItems": 16
                },
                "inverse_depth_plane": {
                  "type": "array",
                  "items": {
                    "type": "number"
                  },
                  "minItems": 3,
                  "maxItems": 3
                }
              },
              "required": [
                "polygon",
                "inverse_depth_plane"
              ],
              "additionalProperties": false
            },
            "maxItems": 16
          },
          "intrinsics_normalized": {
            "type": "array",
            "items": {
              "type": "number"
            },
            "minItems": 4,
            "maxItems": 4
          },
          "rotation_xyzw": {
            "type": "array",
            "items": {
              "type": "number"
            },
            "minItems": 4,
            "maxItems": 4
          },
          "translation": {
            "type": "array",
            "items": {
              "type": "number"
            },
            "minItems": 3,
            "maxItems": 3
          }
        },
        "required": [
          "view_index",
          "base_inverse_depth_plane",
          "regions",
          "intrinsics_normalized",
          "rotation_xyzw",
          "translation"
        ],
        "additionalProperties": false
      },
      "minItems": 10,
      "maxItems": 10
    }
  },
  "required": [
    "views"
  ],
  "additionalProperties": false
}
````

