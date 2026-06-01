export function getTanStackQueryOptionBlock(): string[] {
  return [
    "### TanStack Query Rules",
    "",
    "Use TanStack Query for server-state concerns, not for arbitrary local UI state.",
    "Keep query keys stable and intentional.",
    "Place request logic in API or query-layer utilities, not inside presentational components.",
  ];
}
