export function getDependenciesBlock(): string[] {
  return [
    "## Dependencies",
    "",
    "Do not add dependencies unless requested.",
    "",
    "Before recommending a dependency ask:",
    "- Can this be implemented with existing tools?",
    "- Is the dependency solving a real problem?",
    "- Is the dependency already present?",
    "",
    "Prefer:",
    "- native APIs",
    "- existing project dependencies",
    "",
    "Avoid dependency proliferation.",
  ];
}
