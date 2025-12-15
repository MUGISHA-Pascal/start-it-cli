import { TemplateConfig } from "../types";
import { goTemplates } from "./go";
import { flutterTemplates } from "./flutter";
import { reactNativeTemplates } from "./react-native";
import { springBootTemplates } from "./spring-boot";
import { nodeTemplates } from "./node";
import { pythonTemplates } from "./python";

const allTemplates: Record<string, Record<string, TemplateConfig>> = {
  Go: goTemplates,
  Flutter: flutterTemplates,
  "React Native": reactNativeTemplates,
  "Spring Boot": springBootTemplates,
  "Node.js": nodeTemplates,
  Python: pythonTemplates,
};

export function getTemplate(
  framework: string,
  templateName: string
): TemplateConfig {
  const frameworkTemplates = allTemplates[framework];

  if (!frameworkTemplates) {
    throw new Error(`Framework "${framework}" not found`);
  }

  const template = frameworkTemplates[templateName];

  if (!template) {
    // Return first available template as default
    const firstTemplate = Object.values(frameworkTemplates)[0];
    if (!firstTemplate) {
      throw new Error(`No templates available for "${framework}"`);
    }
    return firstTemplate;
  }

  return template;
}
