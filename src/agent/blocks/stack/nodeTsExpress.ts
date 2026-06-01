export function getNodeTsExpressStackBlock(): string[] {
  return [
    "### Express Stack Rules",
    "",
    "Keep controllers thin and services focused on business logic.",
    "Preserve route versioning and centralized middleware wiring.",
    "Update env setup, config, and tests alongside behavior changes.",
  ];
}
