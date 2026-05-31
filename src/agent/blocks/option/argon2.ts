export function getArgon2OptionBlock(): string[] {
  return [
    "### argon2 Rules",
    "",
    "Use argon2 only for password hashing.",
    "Do not expose password hashes in responses, logs, or serialized payloads.",
    "Keep hashing and verification inside dedicated auth or security boundaries.",
  ];
}
