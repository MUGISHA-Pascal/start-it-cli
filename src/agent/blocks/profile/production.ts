import { ProjectProfile } from "../../../types";

export function getProductionProfileBlock(): {
  profile: ProjectProfile;
  lines: string[];
} {
  return {
    profile: "production",
    lines: [
      "### Production Mode",
      "",
      "Priorities:",
      "1. Maintainability",
      "2. Validation",
      "3. Logging",
      "4. Error handling",
      "5. Testing",
    ],
  };
}
