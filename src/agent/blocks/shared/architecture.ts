export function getArchitectureBlock(): string[] {
  return [
    "## Architecture",
    "",
    "Always follow the existing project architecture.",
    "",
    "Do not:",
    "- introduce new patterns",
    "- mix architectural styles",
    "- create unnecessary layers",
    "",
    "Before creating a new file:",
    "- check whether an existing file is responsible",
    "",
    "Prefer extending existing code over creating new abstractions.",
  ];
}
