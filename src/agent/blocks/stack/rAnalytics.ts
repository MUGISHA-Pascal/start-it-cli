export function getRAnalyticsStackBlock(): string[] {
  return [
    "### R Analytics Rules",
    "",
    "Keep pipeline stages explicit and easy to trace.",
    "Do not hide core transformations behind unnecessary abstraction.",
    "Preserve reproducible script entrypoints and testthat coverage.",
  ];
}
