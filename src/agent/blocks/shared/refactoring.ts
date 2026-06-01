export function getRefactoringBlock(): string[] {
  return [
    "## Refactoring",
    "",
    "Preserve behavior.",
    "",
    "Avoid:",
    "- changing APIs",
    "- changing database schemas",
    "- renaming files",
    "",
    "unless explicitly requested.",
  ];
}
