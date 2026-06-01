export function getNestJsStackBlock(): string[] {
  return [
    "### NestJS Stack Rules",
    "",
    "Preserve module, provider, and controller boundaries.",
    "Prefer adding behavior to existing modules before creating new modules.",
    "Keep framework wiring declarative.",
  ];
}
