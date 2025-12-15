import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import { ProjectConfig } from "./types";
import { getTemplate } from "./templates";

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

      // Get template for the framework
      const template = getTemplate(
        this.config.framework,
        this.config.options?.template || ""
      );

      // Create all files from template
      for (const file of template.files) {
        const filePath = path.join(projectPath, file.path);
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, file.content);

        if (file.isExecutable) {
          await fs.chmod(filePath, 0o755);
        }
      }

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
