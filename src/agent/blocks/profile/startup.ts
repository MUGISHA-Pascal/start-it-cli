import { ProjectProfile } from "../../../types";

export function getStartupProfileBlock(): {
  profile: ProjectProfile;
  lines: string[];
} {
  return {
    profile: "startup",
    lines: [
      "### Startup Mode",
      "",
      "Priorities:",
      "1. Rapid delivery",
      "2. Simplicity",
      "3. Reasonable structure",
      "",
      "Accept small technical debt when it accelerates delivery.",
    ],
  };
}
