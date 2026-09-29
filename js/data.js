// Scores from Table 1 of the paper (assets/results.csv in the report repo).
// null = not run / not reportable ("–"), "ns" = output type not supported.
window.ASTRA = (() => {
  const models = [
    { id: "gpt",    name: "GPT-6 Astra",    logo: "assets/logos/gpt.svg" },
    { id: "fable",  name: "Fable 5",        logo: "assets/logos/fable.svg" },
    { id: "kimi",   name: "Kimi K3",        logo: "assets/logos/kimi.svg" },
    { id: "gemini", name: "Gemini 3.1 Pro", logo: "assets/logos/gemini.svg" },
    { id: "qwen",   name: "Qwen 3.8-Max",   logo: "assets/logos/qwen.svg" },
    { id: "muse",   name: "Muse Spark 1.3", logo: "assets/logos/musespark.svg" },
  ];

  const groups = [
    { id: "g1", name: "Recognition & visual reading", icon: "eye" },
    { id: "g2", name: "Visual reasoning", icon: "bulb" },
    { id: "g3", name: "Spatial reasoning", icon: "cube" },
    { id: "g4", name: "2D grounding & segmentation", icon: "frame" },
    { id: "g5", name: "3D perception & geometry", icon: "axes" },
    { id: "g6", name: "Video understanding", icon: "play" },
    { id: "g7", name: "Generation, editing & restoration", icon: "palette" },
    { id: "g8", name: "Robotics & driving", icon: "robot" },
    { id: "g9", name: "Expert domains", icon: "microscope" },
  ];

  // Figure 9 of the paper rates Visual Recognition against the specialist even though the human reference is higher.
  const refKindOverride = { recognition: "S" };

  // [key, group, capability, metric, lowerIsBetter, scores[6], specialist, human]
  const rows = [
    ["recognition",  "g1", "Visual Recognition",          "Accuracy",   false, [77.0, 71.5, 70.9, 69.6, 72.7, 72.7], 61.1, 98.9],
    ["finegrained",  "g1", "Fine-Grained Discrimination", "Accuracy",   false, [86.1, 70.0, 64.0, 69.5, 75.6, 77.0], null, 96.5],
    ["counting",     "g1", "Visual Counting",             "Accuracy",   false, [82.7, 69.6, 74.0, 78.5, 80.3, 76.1], null, 94.0],
    ["ocr",          "g1", "OCR & Text Recognition",      "Accuracy",   false, [98.1, 97.5, 96.3, 93.8, 94.8, 96.3], null, 98.0],
    ["documents",    "g1", "Doc & Chart Understanding",   "Accuracy",   false, [92.8, 91.7, 90.3, 89.8, 91.2, 89.5], null, 89.3],
    ["logical",      "g2", "Visual Logical Reasoning",    "Accuracy",   false, [81.1, 61.3, 61.2, 60.5, 67.5, 57.6], null, 87.0],
    ["math",         "g2", "Visual Math Reasoning",       "Accuracy",   false, [92.5, 78.8, 80.4, 82.3, 82.0, 79.3], null, 78.7],
    ["scientific",   "g2", "Scientific Reasoning",        "Accuracy",   false, [86.8, 81.2, 81.6, 80.5, 82.3, 81.2], null, 88.6],
    ["spatial2d",    "g3", "2D Spatial Reasoning",        "Accuracy",   false, [96.0, 79.3, 87.0, 84.2, 89.1, 82.6], null, 95.8],
    ["spatial3d",    "g3", "3D & Multiview Reasoning",    "Accuracy",   false, [89.6, 75.2, 76.8, 66.8, 77.0, 77.2], null, 94.1],
    ["detection",    "g4", "2D Object Detection",         "F1@IoU=0.5", false, [89.1, 31.1, 67.7, 69.7, 87.0, 46.5], 78.4, null],
    ["grounding",    "g4", "2D Visual Grounding",         "Accuracy",   false, [93.1, 87.0, 77.4, 79.6, 87.7, 82.5], null, 96.2],
    ["segmentation", "g4", "Segmentation",                "gIoU",       false, [81.3, 70.9, 41.3, 56.6, 68.0, 47.3], 77.0, null],
    ["pose2d",       "g4", "2D Pose Estimation",          "OKS AP",     false, [75.2, 19.6, 43.5, 32.0, 52.5, 38.1], 83.6, null],
    ["depth",        "g5", "Depth Estimation",            "AbsRel",     true,  [0.63, 0.89, 1.00, 1.19, 1.29, 0.82], 0.44, null],
    ["detection3d",  "g5", "3D Object Detection",         "AP3D",       false, [17.3, 13.8, 8.0, 6.6, 7.1, 7.9], 16.8, null],
    ["grounding3d",  "g5", "3D Visual Grounding",         "Acc@IoU0.25",false, [73.8, 63.1, 55.8, 59.4, 48.1, 62.1], 46.5, 95.0],
    ["reconstruction","g5","3D Reconstruction",           "Error (m)",  true,  [1.40, 1.85, 1.96, 1.81, 1.72, 1.89], 0.61, null],
    ["video",        "g6", "Video Understanding",         "Accuracy",   false, [74.3, 59.0, 64.1, 53.0, 70.2, 75.6], 71.5, 82.6],
    ["temporal",     "g6", "Temporal Localization",       "R@1 IoU=0.7",false, [38.6, 23.7, 24.6, 22.6, 28.6, 25.3], 35.9, null],
    ["videoseg",     "g6", "Video Segmentation",          "J&F",        false, [84.5, 57.9, 34.5, 34.9, 32.0, 33.8], 91.0, null],
    ["t2i",          "g7", "Text-to-Image Generation",    "Soft-TIFA GM",false,[96.2, "ns", "ns", 67.4, 92.1, 92.4], 92.6, null],
    ["editing",      "g7", "Instruction-Guided Editing",  "Score (1–5)",false, [4.80, "ns", "ns", 4.20, 4.67, 4.40], 4.64, null],
    ["restoration",  "g7", "Image Restoration",           "PSNR (dB)",  false, [17.7, "ns", 17.3, 17.5, 17.4, 17.2], 30.7, null],
    ["quality",      "g7", "Image Quality Assessment",    "Accuracy",   false, [86.2, "ns", 83.1, 79.5, 81.1, 78.4], 84.9, null],
    ["driving",      "g8", "Driving-Scene Reasoning",     "Accuracy",   false, [80.8, 75.8, 71.6, 71.2, 77.1, 76.5], 73.1, 88.1],
    ["embodied",     "g8", "Embodied Understanding",      "Accuracy",   false, [82.3, 70.0, 65.2, 68.0, 77.8, 76.5], 78.5, null],
    ["navigation",   "g8", "Robotic Navigation",          "Success rate",false,[78.0, 64.0, 48.0, 60.0, 70.0, 67.0], null, null],
    ["medical",      "g9", "Medical Understanding",       "Accuracy",   false, [86.0, 79.7, 73.9, 78.3, 78.1, 78.3], 81.5, 45.5],
    ["medground2d",  "g9", "2D Medical Grounding",        "mAP@0.5",    false, [61.5, 35.9, 20.8, 35.0, 58.2, 37.8], 81.8, null],
    ["medground3d",  "g9", "3D Medical Grounding",        "mIoU",       false, [73.9, 38.0, 38.4, 24.4, 46.0, 43.8], 59.4, null],
    ["pathology",    "g9", "Microscopy & Pathology",      "Macro-F1",   false, [23.8, 22.1, 16.7, 14.1, 21.4, 23.1], 57.1, 82.0],
    ["remote",       "g9", "Remote-Sensing Reasoning",    "Accuracy",   false, [46.3, 42.7, 39.7, 50.0, 48.2, 45.8], 43.9, null],
    ["remoteground", "g9", "Remote-Sensing Grounding",    "mIoU",       false, [26.4, 16.8, 20.2, 11.2, 16.1, 13.1], 75.5, null],
  ].map(([key, group, name, metric, lower, scores, specialist, human]) => {
    const num = scores.filter((s) => typeof s === "number");
    const best = lower ? Math.min(...num) : Math.max(...num);
    const refs = [
      specialist != null && { kind: "S", value: specialist },
      human != null && { kind: "H", value: human },
    ].filter(Boolean);
    // Strongest available reference (lower is better for ↓ metrics); Table 1 always uses this one.
    const strongestRef = refs.length
      ? refs.reduce((a, b) => (lower ? (b.value < a.value ? b : a) : (b.value > a.value ? b : a)))
      : null;
    // Tier views follow Figure 9, which pins a different reference for some capabilities.
    const ref = (refKindOverride[key] && refs.find((r) => r.kind === refKindOverride[key])) || strongestRef;
    const pct = ref ? (lower ? ref.value / best : best / ref.value) * 100 : null;
    return { key, group, name, metric, lower, scores, specialist, human, best, ref, strongestRef, pct };
  });

  const tiers = [
    { id: "exceeds",  name: "Exceeds reference level", range: "> 110%",      test: (p) => p > 110 },
    { id: "at",       name: "At reference level",      range: "100 – 110%",  test: (p) => p >= 99.5 },
    { id: "near",     name: "Approaching",             range: "85 – 100%",   test: (p) => p >= 85 },
    { id: "gap",      name: "Substantial gap",         range: "< 85%",       test: () => true },
  ];
  rows.forEach((r) => { r.tier = r.pct == null ? null : tiers.find((t) => t.test(r.pct)).id; });

  // Hero mosaic: tile image + short label per capability, laid out as in Figure 1.
  const mosaic = [
    { group: "g1", tiles: [["recognition", "Recognition"], ["finegrained", "Fine-grained"], ["counting", "Counting"], ["ocr", "OCR"], ["documents", "Doc & charts"]] },
    { group: "g3", tiles: [["spatial2d", "2D spatial"], ["spatial3d", "3D & multiview"]] },
    { group: "g2", tiles: [["logical", "Logical reasoning"], ["math", "Math reasoning"], ["scientific", "Scientific reasoning"]] },
    { group: "g4", tiles: [["detection", "2D detection"], ["grounding", "Grounding"], ["segmentation", "Segmentation"], ["pose2d", "Pose estimation"]] },
    { group: "g5", tiles: [["depth", "Monocular depth"], ["detection3d", "3D detection"], ["grounding3d", "3D grounding"], ["reconstruction", "Reconstruction"]] },
    { group: "g7", tiles: [["t2i", "Text-to-image"], ["editing", "Instruction editing"], ["restoration", "Restoration"]] },
    { group: "g6", tiles: [["video", "Temporal reasoning"], ["videoseg", "Video segmentation"]] },
    { group: "g8", tiles: [["driving", "Driving scenes"], ["embodied", "Embodied"]] },
    { group: "g9", tiles: [["medical", "Medical"], ["pathology", "Pathology"], ["remote", "Remote sensing"]] },
  ];
  // Tile image file names (from the paper's hero_6 figure).
  const tileImg = {
    recognition: "g1_recognition", finegrained: "g1_finegrained", counting: "g1_counting", ocr: "g1_ocr",
    documents: "g1_documents", logical: "g2_logical", math: "g2_math", scientific: "g2_scientific",
    spatial2d: "g3_spatial2d", spatial3d: "g3_spatial3d", detection: "g4_detection", grounding: "g4_grounding",
    segmentation: "g4_segmentation", pose2d: "g4_pose2d", depth: "g5_depth", detection3d: "g5_detection3d",
    grounding3d: "g5_grounding3d", reconstruction: "g5_reconstruction", video: "g6_video", videoseg: "g6_videoseg",
    t2i: "g7_t2i", editing: "g7_editing", restoration: "g7_restoration", driving: "g8_driving",
    embodied: "g8_embodied", medical: "g9_medical", pathology: "g9_pathology", remote: "g9_remote",
  };

  return { models, groups, rows, tiers, mosaic, tileImg, byKey: Object.fromEntries(rows.map((r) => [r.key, r])) };
})();
