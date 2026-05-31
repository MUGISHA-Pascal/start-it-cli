import { ProjectConfig, TemplateConfig } from "../types";
import { goTemplates } from "./go";
import { flutterTemplates } from "./flutter";
import { reactNativeTemplates } from "./react-native";
import { springBootTemplates } from "./spring-boot";
import { buildNodeTemplate } from "./node";
import { pythonTemplates } from "./python";

const allTemplates: Record<string, Record<string, TemplateConfig>> = {
  Go: goTemplates,
  Flutter: flutterTemplates,
  "React Native": reactNativeTemplates,
  "Spring Boot": springBootTemplates,
  Python: pythonTemplates,
};

export function getTemplate(config: ProjectConfig): TemplateConfig {
  if (config.stack === "node-ts-express") {
    return buildNodeTemplate(config);
  }

  const frameworkTemplates = allTemplates[config.framework];

  if (!frameworkTemplates) {
    throw new Error(`Framework "${config.framework}" not found`);
  }

  const template = frameworkTemplates[config.options?.template || ""];

  if (!template) {
    const firstTemplate = Object.values(frameworkTemplates)[0];
    if (!firstTemplate) {
      throw new Error(`No templates available for "${config.framework}"`);
    }
    return firstTemplate;
  }

  return template;
}
