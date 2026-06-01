export function getRedisOptionBlock(): string[] {
  return [
    "### Redis Rules",
    "",
    "Use Redis for clearly scoped caching, queues, sessions, or ephemeral state.",
    "Do not let cache keys or TTL policy become implicit knowledge.",
    "Keep fallback behavior explicit when Redis is unavailable.",
  ];
}
