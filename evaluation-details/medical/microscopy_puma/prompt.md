# PUMA (nuclei): prompt
Placeholders in `{braces}` are filled per item. Two evaluation styles were used; `evaluation_style` in `models.yaml` gives the style for each model. Both use the same region of interest, the same four overlapping crops and Python run between turns.


## Style A: nucleus centres

### System
````text
Analyze this 1024x1024 H&E melanoma ROI. Detect every individual nucleus and assign exactly one cell type. Category-first: choose a named type and its image-specific morphology/context, then locate all nuclei of that type. Shared stain features are allowed. Resolve overlapping category hypotheses to avoid counting a nucleus twice. Types: {1: 'nuclei_endothelium', 2: 'nuclei_plasma_cell', 3: 'nuclei_stroma', 4: 'nuclei_tumor', 5: 'nuclei_histiocyte', 6: 'nuclei_apoptosis', 7: 'nuclei_epithelium', 8: 'nuclei_melanophage', 9: 'nuclei_neutrophil', 10: 'nuclei_lymphocyte'}. Use visual tissue context if helpful, but do not generate tissue masks or tissue labels. No final nucleus masks or polygons are required. Output nucleus centers in original image pixel coordinates, x horizontal and y vertical, each in [0,1024).
Return JSON with code (Python), summary (string), done (boolean). Python runs in a persistent isolated session with numpy, scipy, cv2, PIL, matplotlib, skimage and tifffile. RGB is /mnt/data/rgb.png. No labels, network or pretrained weights. Write /mnt/data/nuclei.json as {"nuclei":[{"x":123.5,"y":456.0,"class_id":4},...]} with exactly these fields. An empty list is valid only if no nuclei are visible. No duplicate center coordinates. Internal image processing is allowed; precise boundary segmentation is unnecessary. Save a complete initial prediction in the FIRST response, then inspect/refine. Display at most two diagnostic images per action using display(PIL.Image) or plt.show(); show category-colored centers across all four quadrants. You have six responses total including repairs, 180 seconds per Python action. Save and set done=true in the same final response. Do not force absent categories. Initial views: whole ROI, followed by overlapping 576px crops at (0,0),(448,0),(0,448),(448,448). Feedback is resized to <=1024px JPEG.
````

### User turn
````text
Save a complete nuclei-only prediction now, then review.
<image>
<image>
<image>
<image>
<image>
````

Multi-turn. First user turn: this text, then the whole 1024x1024 ROI and four overlapping 576x576 crops at (0,0), (448,0), (0,448) and (448,448) (PNG). After each response the harness runs the returned Python code and sends back the feedback turn below; text and images from earlier turns stay in the conversation. This prompt is used by Fable 5, Gemini 3.1 Pro, Kimi K3, Qwen3.8-Max and Muse Spark 1.3; GPT-6 Astra's differs (see below).

### Output schema
````json
{
  "type": "object",
  "properties": {
    "code": {
      "type": "string"
    },
    "summary": {
      "type": "string"
    },
    "done": {
      "type": "boolean"
    }
  },
  "required": [
    "code",
    "summary",
    "done"
  ],
  "additionalProperties": false
}
````

### Feedback turn after each Python action
````text
{"stdout": {python_stdout}, "error": {python_error}, "responses_remaining": {n}, "valid_nuclei": {count}}
<image>
<image>

{python_stdout} is the last 9,000 characters of the Python output and {python_error} the error text or null; "valid_nuclei": {count} is replaced by "validation_error": "{message}" when /mnt/data/nuclei.json fails validation. Feedback images (at most 2) are the model's own displayed images, resized to at most 1024 px JPEG. If a response is not valid action JSON, the turn is instead: Invalid action JSON: {error}. {n} responses remain.
````


## Style B: nucleus instances and tissue (coarse-to-fine)

### System
````text
You are performing a research image-analysis benchmark on an H&E-stained melanoma ROI.
Produce a complete prediction from the supplied RGB image. Work autonomously and use Python to create the required arrays; do not ask questions. No reference annotations, previous predictions, pretrained segmentation models, or network access are available.

TASK AND COORDINATES
The RGB is 1024 x 1024 pixels, scanned at 0.23 micrometres/pixel (40x). Coordinates are x rightward, y downward from top left. Segment each individual NUCLEUS, not its surrounding whole cell, keeping touching nuclei separate. Assign every nucleus one class. Also segment the larger tissue regions at every pixel.

Nucleus class codes (0 is background, not a nucleus):
1 endothelium; 2 plasma_cell; 3 stroma; 4 tumor; 5 histiocyte; 6 apoptosis; 7 epithelium; 8 melanophage; 9 neutrophil; 10 lymphocyte.
Tissue class codes: 0 white_background; 1 stroma; 2 blood_vessel; 3 tumor; 4 epidermis; 5 necrosis.
Nucleus and tissue categories are different: lymphocytes can occur inside tumor tissue; epithelial nuclei are in epidermis/adnexal epithelium; stroma includes connective/supporting tissue. A blood vessel is a tissue region including its lumen, not just endothelial nuclei. Do not turn every small pale space into background or a vessel, and do not mistake melanin pigment for nuclei.

PYTHON ACTION PROTOCOL
Your response must be a JSON object with action, code, summary. For action='python', put runnable Python in code. The host executes it in a persistent isolated Python session, then supplies stdout/errors and any displayed images in the next turn, always at original image detail. You may iterate to inspect, fix and improve your prediction. For action='submit', use code='' once the output file has been created and checked.
Available: numpy, scipy, cv2, PIL, matplotlib, skimage, tifffile. The original image is /mnt/data/rgb.png. Use display(PIL.Image) or plt.show() for visual feedback. Each call may display up to 8 images, each at most 2048 x 2048; prefer native crops or sensible 2x zooms. The filesystem is isolated, contains only this image and your own files, and has no network. Python variables persist across calls. Native shell, web, and other tools are unavailable. You have up to 32 response rounds and 60 minutes. Use sufficient visual review, but avoid redundant diagnostics once the output is ready.

OUTPUT CONTRACT
Write /mnt/data/prediction.npz using np.savez_compressed with exactly three arrays:
- instances: integer (1024,1024), background=0, a distinct positive ID for each individual nucleus. Every ID must form one connected object.
- classes: integer (1024,1024), 0 outside nuclei, a single class 1..10 throughout each instance.
- tissue: integer (1024,1024), class 0..5 at every pixel.
Example serialization: np.savez_compressed('/mnt/data/prediction.npz', instances=instances.astype(np.int32), classes=classes.astype(np.uint8), tissue=tissue.astype(np.uint8)).
Inspect your overlays and confirm the saved arrays have correct shape, class codes, and separate instances before submitting. Do not fabricate performance or claim access to ground truth. Your summary should briefly describe your image-analysis method and its limitations.

COARSE-TO-FINE REVIEW PROTOCOL
You receive the whole ROI followed by four overlapping 576 x 576 native crops: top-left (x0=0,y0=0), top-right (448,0), bottom-left (0,448), bottom-right (448,448). These are views of the SAME image, not extra cases. All final arrays use original full-image coordinates.
1. Use the whole ROI to identify tissue architecture and draw/refine coherent tissue regions. Inspect representative native-resolution crops for ambiguous boundaries, vessels and necrosis.
2. Use image processing to propose nuclear masks: stain/color separation or optical-density channels, locally adapted thresholds, multiscale blobs/markers, and watershed are useful. Estimate sensible nuclear sizes from this image. Separate touching nuclei, avoid splitting one nucleus into multiple nucleoli, and recover pale tumor nuclei. Filter pigment, erythrocytes, collagen and image artifacts. Treat automated proposals as candidates to review, not truth.
3. Display numbered/outlined proposals in all four image quadrants; compare overlays with unmarked crops. Correct missed nuclei, merged instances and false proposals. Keep crop overlaps from creating duplicate instances. Every quadrant should receive visual coverage.
4. Classify by local histomorphology and tissue context, using object features and visual review of small contact sheets/ambiguous objects when helpful. Tumor nuclei are often atypical/pleomorphic; lymphocytes small and densely round; plasma cells often eccentric with coarse chromatin; stromal nuclei often spindle-shaped; endothelium lines vessels; histiocytes have macrophage morphology; melanophages contain pigment; neutrophils have segmented nuclei; apoptosis has condensed/fragmenting nuclear material. These are guides, not hard size rules. Distinguish rare classes where the image supports them; do not force classes to be present.
5. Review the final nucleus outlines/class assignments and tissue overlay, correct material errors, then save and submit. Prefer localized corrections supported by the RGB over assigning one class indiscriminately to all nuclei.
````
### User turn
````text
Analyze this ROI and produce both nucleus instances/types and tissue segmentation. Begin your Python-assisted analysis.
<image>
<image>
<image>
<image>
<image>
(the whole ROI and the same four 576x576 crops)
````
### Feedback turn after each Python action
````text
{"python_stdout": {python_stdout}, "python_error": {python_error}, "rounds_remaining": {n}, "instruction": "Continue analysis/correction, or submit when prediction.npz is ready."}
<image> (0-8 displayed images)
````
### Message on an invalid submission
````text
 Output validation failed: {error}. Correct this in Python and resubmit.
````
### Output schema
````text
{"type": "object", "properties": {"action": {"type": "string", "enum": ["python", "submit"]}, "code": {"type": "string"}, "summary": {"type": "string"}}, "required": ["action", "code", "summary"], "additionalProperties": false}
````
