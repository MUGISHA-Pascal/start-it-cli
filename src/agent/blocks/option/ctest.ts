export function getCtestOptionBlock(): string[] {
  return [
    "### CTest Rules",
    "",
    "Keep CTest coverage fast and close to the compiled behavior being verified.",
    "Prefer small deterministic test executables over heavy custom harnesses.",
    "Update build configuration and sample checks together when runtime behavior changes.",
  ];
}
