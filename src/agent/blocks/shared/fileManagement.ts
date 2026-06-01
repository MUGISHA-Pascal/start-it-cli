export function getFileManagementBlock(): string[] {
  return [
    "## File Management",
    "",
    "Avoid creating files unnecessarily.",
    "",
    "Prefer:",
    "- modifying existing files",
    "- keeping related logic together",
    "",
    "Only create a new file when:",
    "- responsibility is clearly separate",
    "- file size becomes unreasonable",
    "- architecture requires separation",
  ];
}
