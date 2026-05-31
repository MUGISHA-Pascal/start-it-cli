export function getBcryptOptionBlock(): string[] {
  return [
    "### bcrypt Rules",
    "",
    "Use bcrypt only for password hashing.",
    "Do not expose password hashes in responses, logs, or serialized payloads.",
    "Keep hashing and verification inside dedicated auth or security boundaries.",
  ];
}
