export function getShadcnUiOptionBlock(): string[] {
  return [
    "### shadcn/ui Rules",
    "",
    "Treat generated UI primitives as part of the local codebase, not as an external design system abstraction.",
    "Prefer extending existing primitives before introducing parallel component variants.",
    "Keep the visual language practical and consistent.",
  ];
}
