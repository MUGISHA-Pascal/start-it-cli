export function getPostgreSqlOptionBlock(): string[] {
  return [
    "### PostgreSQL Rules",
    "",
    "Prefer explicit schemas and clear table or model naming.",
    "Keep relational data normalized unless denormalization is justified by an actual access pattern.",
    "When data contracts change, update configuration, tests, and documentation together.",
  ];
}
