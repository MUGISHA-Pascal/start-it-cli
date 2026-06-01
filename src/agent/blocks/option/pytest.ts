export function getPytestOptionBlock(): string[] {
  return [
    "### Pytest Rules",
    "",
    "Prefer focused tests around critical behavior and public contracts.",
    "Keep fixtures readable and local unless reuse is substantial.",
    "Do not add broad test indirection for small projects.",
  ];
}
