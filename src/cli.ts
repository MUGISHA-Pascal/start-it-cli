#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { ProjectGenerator } from "./generator";
import { AIProjectGenerator } from "./ai/generator";
import { ProjectConfig } from "./types";

const FRAMEWORKS = [
  "Go",
  "Flutter",
  "React Native",
  "Spring Boot",
  "Node.js",
  "Python",
];

const GENERATION_TYPES = [
  { name: "Traditional (Template-based)", value: "traditional" },
  { name: "AI-Powered (Smart recommendations)", value: "ai" },
];

async function main() {
  console.log(chalk.bold.cyan("\n🚀 Welcome to start-it!\n"));
  console.log(chalk.gray("Create a new project with ease.\n"));

  try {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "generationType",
        message: "Choose project generation method:",
        choices: GENERATION_TYPES,
      },
      {
        type: "list",
        name: "framework",
        message: "What type of project would you like to create?",
        choices: FRAMEWORKS,
        when: (answers) => answers.generationType === "traditional",
      },
      {
        type: "input",
        name: "projectName",
        message: "Project name:",
        default: "my-app",
        validate: (input: string) => {
          if (!input.trim()) {
            return "Project name cannot be empty";
          }
          if (!/^[a-zA-Z0-9_-]+$/.test(input)) {
            return "Project name can only contain letters, numbers, hyphens, and underscores";
          }
          return true;
        },
      },
    ]);

    const config: ProjectConfig = {
      framework: answers.framework,
      projectName: answers.projectName,
      projectPath: process.cwd(),
    };

    if (answers.generationType === "traditional") {
      // Get framework-specific options
      const frameworkOptions = await getFrameworkOptions(config.framework);
      config.options = frameworkOptions;

      const generator = new ProjectGenerator(config);
      await generator.generate();
    } else {
      // AI-powered generation
      const aiAnswers = await inquirer.prompt([
        {
          type: "input",
          name: "description",
          message: "Describe your project:",
          validate: (input: string) => {
            if (!input.trim()) {
              return "Project description cannot be empty";
            }
            return true;
          },
        },
        {
          type: "list",
          name: "scale",
          message: "Project scale:",
          choices: ["small", "medium", "large"],
        },
        {
          type: "input",
          name: "deployment",
          message: "Deployment target (optional):",
        },
        {
          type: "checkbox",
          name: "features",
          message: "Select features you need:",
          choices: [
            "authentication",
            "database",
            "api",
            "frontend",
            "backend",
            "testing",
            "logging",
            "monitoring",
            "cache",
            "queue",
            "websocket",
            "file-upload",
            "email",
            "payment",
            "search",
          ],
        },
      ]);

      const aiGenerator = new AIProjectGenerator();
      await aiGenerator.generate({
        projectName: answers.projectName,
        projectPath: process.cwd(),
        description: aiAnswers.description,
        framework: undefined,
        scale: aiAnswers.scale,
        deployment: aiAnswers.deployment,
        features: aiAnswers.features,
      });
    }

    console.log(
      chalk.bold.green(
        `\n✓ Project "${config.projectName}" created successfully!\n`
      )
    );
    console.log(chalk.cyan(`Next steps:`));
    console.log(chalk.gray(`  cd ${config.projectName}`));
    console.log(
      chalk.gray(`  Follow the README.md for further instructions\n`)
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.bold.red(`\n✗ Error: ${error.message}\n`));
    } else {
      console.error(chalk.bold.red("\n✗ An unexpected error occurred\n"));
    }
    process.exit(1);
  }
}

async function getFrameworkOptions(
  framework: string
): Promise<Record<string, string>> {
  const options: Record<string, string> = {};

  switch (framework) {
    case "Go":
      const goTemplate = await inquirer.prompt([
        {
          type: "list",
          name: "template",
          message: "Select Go template:",
          choices: ["Basic CLI", "Web API", "Microservice"],
        },
      ]);
      options.template = goTemplate.template;
      break;

    case "Flutter":
      const flutterTemplate = await inquirer.prompt([
        {
          type: "list",
          name: "template",
          message: "Select Flutter template:",
          choices: ["Mobile App", "Web App", "Desktop App"],
        },
      ]);
      options.template = flutterTemplate.template;
      break;

    case "React Native":
      const rnTemplate = await inquirer.prompt([
        {
          type: "list",
          name: "template",
          message: "Select React Native template:",
          choices: ["Expo", "Bare React Native"],
        },
      ]);
      options.template = rnTemplate.template;
      break;

    case "Spring Boot":
      const sbTemplate = await inquirer.prompt([
        {
          type: "list",
          name: "template",
          message: "Select Spring Boot template:",
          choices: ["REST API", "Web Application", "Microservice"],
        },
      ]);
      options.template = sbTemplate.template;
      break;

    case "Node.js":
      const nodeTemplate = await inquirer.prompt([
        {
          type: "list",
          name: "template",
          message: "Select Node.js template:",
          choices: ["Express API", "Next.js", "TypeScript Project"],
        },
      ]);
      options.template = nodeTemplate.template;
      break;

    case "Python":
      const pyTemplate = await inquirer.prompt([
        {
          type: "list",
          name: "template",
          message: "Select Python template:",
          choices: ["Django", "Flask", "FastAPI"],
        },
      ]);
      options.template = pyTemplate.template;
      break;
  }

  return options;
}

main();
