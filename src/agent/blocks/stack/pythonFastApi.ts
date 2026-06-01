export function getPythonFastApiStackBlock(): string[] {
  return [
    "### FastAPI Stack Rules",
    "",
    "Keep route handlers small.",
    "Place business logic in services or core modules.",
    "Validate request and response contracts explicitly.",
  ];
}
