import { ProjectProfile } from "../../../types";

export function getExamProfileBlock(): {
  profile: ProjectProfile;
  lines: string[];
} {
  return {
    profile: "exam",
    lines: [
      "### Exam Mode",
      "",
      "Priorities:",
      "1. Working functionality",
      "2. Speed",
      "3. Simplicity",
      "",
      "Avoid:",
      "- enterprise patterns",
      "- advanced abstractions",
      "- excessive modularization",
      "- unnecessary optimization",
    ],
  };
}
