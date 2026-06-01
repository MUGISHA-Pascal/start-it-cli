export function getJwtOptionBlock(): string[] {
  return [
    "### JWT Rules",
    "",
    "Keep authentication token handling explicit and centralized.",
    "Validate protected endpoints consistently.",
    "Do not scatter token parsing logic across unrelated modules.",
  ];
}
