export function getCppInferenceStackBlock(): string[] {
  return [
    "### C++ Inference Rules",
    "",
    "Keep runtime entrypoints explicit and dependency-light.",
    "Preserve the separation between runner code and inference logic.",
    "Do not introduce framework-style abstractions for small utilities.",
  ];
}
