export function getAiMlStandardsBlock(): string[] {
  return [
    "### AI / ML",
    "",
    "Preserve reproducibility and explicit runtime contracts.",
    "Do not silently change model input or output shapes.",
    "Keep validation close to ingress points.",
    "Prefer clear model-loading boundaries over scattered runtime logic.",
  ];
}
