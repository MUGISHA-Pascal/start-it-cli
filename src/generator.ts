import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import { ProjectConfig } from "./types";
import { getTemplate } from "./templates";
import { scaffoldFrontendProject } from "./frontend/scaffold";
import { scaffoldAiMlProject } from "./aiml/scaffold";
import { scaffoldDsaProject } from "./dsa/scaffold";
import { buildAiGuidance } from "./utils/agentRules";

export class ProjectGenerator {
  private config: ProjectConfig;

  constructor(config: ProjectConfig) {
    this.config = config;
  }

  async generate(): Promise<void> {
    const projectPath = path.join(
      this.config.projectPath,
      this.config.projectName
    );

    // Check if directory already exists
    if (fs.existsSync(projectPath)) {
      throw new Error(`Directory "${this.config.projectName}" already exists`);
    }

    const spinner = ora("Creating project structure...").start();

    try {
      // Create project directory
      await fs.ensureDir(projectPath);

      if (this.config.appType === "frontend") {
        await scaffoldFrontendProject(this.config, projectPath);
      } else if (this.config.appType === "ai-ml") {
        await scaffoldAiMlProject(this.config, projectPath);
      } else if (this.config.appType === "dsa-specific") {
        await scaffoldDsaProject(this.config, projectPath);
      } else {
        const template = getTemplate(this.config);

        for (const file of template.files) {
          const filePath = path.join(projectPath, file.path);
          await fs.ensureDir(path.dirname(filePath));
          await fs.writeFile(filePath, file.content);

          if (file.isExecutable) {
            await fs.chmod(filePath, 0o755);
          }
        }
      }

      // Add agentic AI guidelines for token efficiency
      const guidance = buildAiGuidance(this.config);
      await fs.writeFile(path.join(projectPath, ".cursorrules"), guidance.cursorRules);

      // Create docs directory and write default instruction files
      const docsDir = path.join(projectPath, "docs");
      await fs.ensureDir(docsDir);
      await fs.writeFile(
        path.join(docsDir, "AGENTS.md"),
        guidance.agents
      );
      await fs.writeFile(
        path.join(docsDir, "instructions.md"),
        guidance.instructions
      );

      spinner.succeed("Project structure created");
    } catch (error) {
      spinner.fail("Failed to create project");
      // Clean up on error
      if (fs.existsSync(projectPath)) {
        await fs.remove(projectPath);
      }
      throw error;
    }
  }
}
