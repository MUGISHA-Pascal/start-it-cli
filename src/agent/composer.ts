import { ProjectConfig, ProjectProfile } from "../types";
import { getAiMlStandardsBlock } from "./blocks/appType/aiml";
import {
  getBackendAuthenticationBlock,
  getBackendStandardsBlock,
} from "./blocks/appType/backend";
import { getDsaStandardsBlock } from "./blocks/appType/dsa";
import { getFrontendStandardsBlock } from "./blocks/appType/frontend";
import { getNestJsStackBlock } from "./blocks/stack/nestjs";
import { getNodeTsExpressStackBlock } from "./blocks/stack/nodeTsExpress";
import { getPythonFastApiStackBlock } from "./blocks/stack/pythonFastApi";
import { getArchitectureBlock } from "./blocks/shared/architecture";
import { getDebuggingBlock } from "./blocks/shared/debugging";
import { getDependenciesBlock } from "./blocks/shared/dependencies";
import { getFileManagementBlock } from "./blocks/shared/fileManagement";
import { getGeneralPrinciplesBlock } from "./blocks/shared/general";
import { getRefactoringBlock } from "./blocks/shared/refactoring";
import { getResponsesBlock } from "./blocks/shared/responses";
import { getExamProfileBlock } from "./blocks/profile/exam";
import { getProductionProfileBlock } from "./blocks/profile/production";
import { getStartupProfileBlock } from "./blocks/profile/startup";

export function composeSharedConstitution(): string[] {
  return [
    ...getGeneralPrinciplesBlock(),
    "",
    ...getArchitectureBlock(),
    "",
    ...getDependenciesBlock(),
    "",
    ...getFileManagementBlock(),
    "",
    ...getResponsesBlock(),
    "",
    ...getRefactoringBlock(),
    "",
    ...getDebuggingBlock(),
  ];
}

export function composeProfileBlock(projectProfile: ProjectProfile): string[] {
  const blocks = [
    getExamProfileBlock(),
    getStartupProfileBlock(),
    getProductionProfileBlock(),
  ];

  const block = blocks.find((entry) => entry.profile === projectProfile);
  if (!block) {
    return [];
  }

  return block.lines;
}

export function composeAppTypeBlock(config: ProjectConfig): string[] {
  switch (config.appType) {
    case "backend": {
      const lines = [...getBackendStandardsBlock()];
      if (config.options?.securityPreset && config.options.securityPreset !== "none") {
        lines.push("", ...getBackendAuthenticationBlock());
      }
      return lines;
    }
    case "frontend":
      return getFrontendStandardsBlock();
    case "ai-ml":
      return getAiMlStandardsBlock();
    case "dsa-specific":
      return getDsaStandardsBlock();
  }
}

export function composeBackendStackBlock(config: ProjectConfig): string[] {
  switch (config.stack) {
    case "node-ts-express":
      return getNodeTsExpressStackBlock();
    case "nestjs":
      return getNestJsStackBlock();
    case "python-fastapi":
      return getPythonFastApiStackBlock();
    default:
      return [];
  }
}

export function composeCursorPrinciples(config: ProjectConfig): string[] {
  return [
    `# cursorrules for ${config.framework} - ${config.options?.template || config.stack}`,
    "",
    "# AI Working Rules",
    "",
    "Act like: Senior Engineer + Pragmatic Architect + Fast Implementer.",
    "",
    "Prioritize:",
    "1. Correctness",
    "2. Simplicity",
    "3. Maintainability",
    "4. Speed of implementation",
    "",
    "Do not:",
    "- add dependencies unless necessary and requested",
    "- create new files when an existing file should be extended",
    "- introduce new architectural patterns without a clear reason",
    "- rewrite large areas blindly before identifying the root cause",
    "",
    "Default behavior:",
    "- read existing structure before editing",
    "- keep responses concise",
    "- return targeted changes only",
    "- preserve behavior unless explicitly asked to change it",
    "- validate critical paths before finishing",
    "",
    `Current profile: ${config.projectProfile}`,
    `Current app type: ${config.appType}`,
    `Current stack: ${config.stack}`,
  ];
}
