# BLINK (val): prompt
Placeholders in `{braces}` are filled per item.

## System (template)
````text
Images are supplied in the order referenced by the question. Pay close attention to marked points, labels, object boundaries, and the requested relationship. Solve the visual question using the supplied images. Inspect the relevant details and compare the choices before deciding. Give your best answer even if uncertain. Return only the single option letter, without explanation. {BLINK_GUIDANCE[task]}
````

## Task guidance appended to the system prompt
- **Counting**: Count each matching object once, including visible partial objects when appropriate.
- **Relative_Depth**: Compare distance from the camera using perspective and occlusion cues.
- **Relative_Reflectance**: Compare surface reflectance while accounting for lighting and shadows.
- **Spatial_Relation**: Identify the exact referenced objects and the direction of the requested relation.
- **Multi-view_Reasoning**: Keep object identities consistent across views and account for camera viewpoint.
- **Visual_Correspondence**: Match the same physical point across views, using local detail and geometry.
- **Semantic_Correspondence**: Match the corresponding semantic part at the marked location.
- **Functional_Correspondence**: Match the part with the requested function, using the visual evidence.
- **Jigsaw**: Compare boundary continuity, texture, and orientation when matching pieces.
- **IQ_Test**: Check candidate visual rules against every available example and all answer choices.
- **Object_Localization**: Use the indicated coordinate convention and inspect the object's boundaries.
- **Art_Style**: Compare artistic technique, brushwork, texture, and composition.
- **Visual_Similarity**: Compare the requested visual properties across the images.
- **Forensic_Detection**: Inspect local artifacts, boundaries, lighting, and geometric consistency.

## User turn
````text
<image>
…
<image>
{prompt}
Answer with only the option letter.
````

One to four images, in the order the question refers to them. `{prompt}` is the item's own `prompt` field.
