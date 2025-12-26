import { SmartAIProvider } from "./provider";
import { AIProjectRequest, AIRecommendation } from "./types";
import { getTemplate } from "../templates";
import { TemplateConfig } from "../types";
import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import ora from "ora";

export class AIProjectGenerator {
  private aiProvider: SmartAIProvider;

  constructor(apiKey?: string) {
    this.aiProvider = new SmartAIProvider(apiKey);
  }

  async generate(
    request: AIProjectRequest & { projectName: string; projectPath: string }
  ): Promise<void> {
    const spinner = ora("Analyzing project requirements...").start();

    try {
      // Get AI recommendations with generated code
      const recommendation = await this.aiProvider.generateProject(request);

      spinner.text = "Generating project structure...";

      // Create project directory
      const projectDir = path.join(request.projectPath, request.projectName);
      await fs.ensureDir(projectDir);

      // Generate files from AI-generated content
      for (const file of recommendation.structure) {
        const filePath = path.join(projectDir, file.path);
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, file.content);

        // Make executable files executable
        if (file.isExecutable) {
          await fs.chmod(filePath, 0o755);
        }
      }

      spinner.succeed("Project created successfully!");

      console.log(chalk.cyan("\nAI Recommendations:"));
      console.log(chalk.gray(`Framework: ${recommendation.framework}`));
      console.log(chalk.gray(`Template: ${recommendation.template}`));
      console.log(chalk.gray(`Reasoning: ${recommendation.reasoning}`));

      if (recommendation.dependencies.length > 0) {
        console.log(chalk.cyan("\nSuggested Dependencies:"));
        recommendation.dependencies.forEach((dep) => {
          console.log(
            chalk.gray(
              `- ${dep.name}@${dep.version || "latest"}: ${dep.purpose}`
            )
          );
        });
      }

      console.log(chalk.cyan("\nGenerated Files:"));
      recommendation.structure.forEach((file) => {
        console.log(chalk.gray(`- ${file.path}: ${file.description}`));
      });
    } catch (error) {
      spinner.fail("Failed to generate project");
      throw error;
    }
  }

  async generateIntelligentProject(
    description: string
  ): Promise<
    Omit<AIRecommendation, "template"> & { template: TemplateConfig }
  > {
    // Analyze the project description
    const features = await this.aiProvider.analyzeRequirements(description);

    // Create AI request
    const request: AIProjectRequest = {
      description,
      features,
      scale: this.determineScale(description),
      deployment: this.determineDeployment(description),
    };

    // Get AI recommendations
    const recommendation = await this.aiProvider.generateProject(request);

    // Get the actual template
    const template = getTemplate(
      recommendation.framework,
      recommendation.template
    );

    // Get smart dependencies
    const dependencies = await this.aiProvider.suggestDependencies(
      recommendation.framework,
      features
    );

    const { template: _, ...recommendationWithoutTemplate } = recommendation;

    return {
      ...recommendationWithoutTemplate,
      dependencies,
      template,
    };
  }

  async enhanceTemplate(
    template: TemplateConfig,
    features: string[]
  ): Promise<TemplateConfig> {
    const enhancedFiles = await Promise.all(
      template.files.map(async (file) => {
        return {
          ...file,
          content: await this.enhanceFileContent(file.content, features),
        };
      })
    );

    return {
      ...template,
      files: enhancedFiles,
    };
  }

  private determineScale(description: string): "small" | "medium" | "large" {
    const lowerDesc = description.toLowerCase();

    if (
      lowerDesc.includes("enterprise") ||
      lowerDesc.includes("large") ||
      lowerDesc.includes("microservice") ||
      lowerDesc.includes("distributed")
    ) {
      return "large";
    }

    if (
      lowerDesc.includes("prototype") ||
      lowerDesc.includes("small") ||
      lowerDesc.includes("simple") ||
      lowerDesc.includes("basic")
    ) {
      return "small";
    }

    return "medium";
  }

  private determineDeployment(
    description: string
  ): "local" | "cloud" | "hybrid" {
    const lowerDesc = description.toLowerCase();

    if (
      lowerDesc.includes("cloud") ||
      lowerDesc.includes("aws") ||
      lowerDesc.includes("azure") ||
      lowerDesc.includes("gcp")
    ) {
      return "cloud";
    }

    if (
      lowerDesc.includes("local") ||
      lowerDesc.includes("desktop") ||
      lowerDesc.includes("offline")
    ) {
      return "local";
    }

    return "hybrid";
  }

  private async enhanceFileContent(
    content: string,
    features: string[]
  ): Promise<string> {
    let enhanced = content;

    // Add authentication setup
    if (features.includes("authentication")) {
      enhanced = this.addAuthenticationBoilerplate(enhanced);
    }

    // Add database configuration
    if (features.includes("database")) {
      enhanced = this.addDatabaseConfig(enhanced);
    }

    // Add API documentation
    if (features.includes("api")) {
      enhanced = this.addAPIDocumentation(enhanced);
    }

    // Add testing setup
    if (features.includes("testing")) {
      enhanced = this.addTestingSetup(enhanced);
    }

    // Add logging
    if (features.includes("logging")) {
      enhanced = this.addLoggingSetup(enhanced);
    }

    return enhanced;
  }

  private addAuthenticationBoilerplate(content: string): string {
    // Add authentication imports and setup based on file type
    if (content.includes("package.json")) {
      return content.replace(
        /"dependencies": {/,
        '"dependencies": {\n    "passport": "^0.6.0",\n    "passport-local": "^1.0.0",\n    "bcryptjs": "^2.4.3",\n    "jsonwebtoken": "^9.0.0",'
      );
    }

    if (content.includes("import") && content.includes("express")) {
      return content.replace(
        /import.*express.*/,
        `$&\nimport passport from 'passport';\nimport { Strategy as LocalStrategy } from 'passport-local';\nimport jwt from 'jsonwebtoken';`
      );
    }

    return content;
  }

  private addDatabaseConfig(content: string): string {
    if (content.includes("package.json")) {
      return content.replace(
        /"dependencies": {/,
        '"dependencies": {\n    "mongoose": "^7.5.0",\n    "@types/mongoose": "^5.11.97",'
      );
    }

    if (content.includes("import") && content.includes("express")) {
      return content.replace(
        /import.*express.*/,
        `$&\nimport mongoose from 'mongoose';`
      );
    }

    return content;
  }

  private addAPIDocumentation(content: string): string {
    if (content.includes("package.json")) {
      return content.replace(
        /"dependencies": {/,
        '"dependencies": {\n    "swagger-ui-express": "^5.0.0",\n    "swagger-jsdoc": "^6.2.8",'
      );
    }

    return content;
  }

  private addTestingSetup(content: string): string {
    if (content.includes("package.json")) {
      return content.replace(
        /"devDependencies": {/,
        '"devDependencies": {\n    "jest": "^29.7.0",\n    "supertest": "^6.3.3",\n    "@types/jest": "^29.5.5",'
      );
    }

    return content;
  }

  private addLoggingSetup(content: string): string {
    if (content.includes("package.json")) {
      return content.replace(
        /"dependencies": {/,
        '"dependencies": {\n    "winston": "^3.10.0",'
      );
    }

    if (content.includes("import") && content.includes("express")) {
      return content.replace(
        /import.*express.*/,
        `$&\nimport winston from 'winston';`
      );
    }

    return content;
  }
}
