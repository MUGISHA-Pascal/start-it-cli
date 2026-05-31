#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { ProjectGenerator } from "./generator";
import {
  AppType,
  BackendStack,
  BackendDatabase,
  BackendGenerationConfig,
  BackendLoggingOption,
  BackendMonitoringOption,
  BackendSecurityPreset,
  BackendTestingOption,
  ProjectConfig,
  SupportedStack,
} from "./types";
import { APP_TYPE_CHOICES, getFrameworkForStack, getStackChoices } from "./workflow";

const DATABASE_CHOICES: { name: string; value: BackendDatabase }[] = [
  { name: "PostgreSQL", value: "postgresql" },
  { name: "MySQL", value: "mysql" },
  { name: "MongoDB", value: "mongodb" },
  { name: "Redis", value: "redis" },
  { name: "DuckDB", value: "duckdb" },
];

const SECURITY_CHOICES: { name: string; value: BackendSecurityPreset }[] = [
  { name: "None", value: "none" },
  { name: "bcrypt", value: "bcrypt" },
  { name: "argon2", value: "argon2" },
  { name: "bcrypt + JWT", value: "bcrypt-jwt" },
  { name: "argon2 + JWT", value: "argon2-jwt" },
];

const LOGGING_CHOICES: { name: string; value: BackendLoggingOption }[] = [
  { name: "Console logger", value: "console" },
  { name: "Morgan HTTP logger", value: "morgan" },
  { name: "Pino structured logger", value: "pino" },
];

const NEST_LOGGING_CHOICES: { name: string; value: BackendLoggingOption }[] = [
  { name: "Nest logger", value: "console" },
  { name: "Pino structured logger", value: "pino" },
];

const FASTAPI_LOGGING_CHOICES: { name: string; value: BackendLoggingOption }[] = [
  { name: "Python logging", value: "python-logging" },
  { name: "Structlog", value: "structlog" },
];

const MONITORING_CHOICES: { name: string; value: BackendMonitoringOption }[] = [
  { name: "Health check only", value: "health-only" },
  { name: "Prometheus-ready metrics", value: "prometheus-ready" },
  { name: "No monitoring extras", value: "none" },
];

const TESTING_CHOICES: { name: string; value: BackendTestingOption }[] = [
  { name: "Jest only", value: "jest" },
  { name: "Jest + Supertest", value: "jest-supertest" },
];

const FASTAPI_TESTING_CHOICES: { name: string; value: BackendTestingOption }[] = [
  { name: "Pytest", value: "pytest" },
  { name: "Pytest + HTTPX", value: "pytest-httpx" },
];

async function main() {
  console.log(chalk.bold.cyan("\n🚀 Welcome to start-it!\n"));
  console.log(chalk.gray("Create a project from guided stack selections.\n"));

  try {
    const appType = await promptForAppType();
    const stack = await promptForStack(appType);
    const projectMeta = await promptForProjectMetadata();
    const backendOptions = await promptForBackendOptions(
      projectMeta.projectName,
      stack as BackendStack
    );

    const config: ProjectConfig = {
      appType,
      framework: getFrameworkForStack(stack),
      stack,
      projectName: projectMeta.projectName,
      projectPath: process.cwd(),
      options: {
        template: getTemplateNameForStack(stack as BackendStack),
        stack: stack as BackendStack,
        projectDescription: projectMeta.projectDescription,
        appName: backendOptions.appName,
        databases: backendOptions.databases,
        securityPreset: backendOptions.securityPreset,
        logging: backendOptions.logging,
        monitoring: backendOptions.monitoring,
        testing: backendOptions.testing,
        apiStyle: "rest",
      },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate();

    console.log(
      chalk.bold.green(`\n✓ Project "${config.projectName}" created successfully!\n`)
    );
    console.log(chalk.cyan("Next steps:"));
    console.log(chalk.gray(`  cd ${config.projectName}`));
    for (const step of getNextSteps(config.stack as BackendStack)) {
      console.log(chalk.gray(`  ${step}`));
    }
    console.log(chalk.gray("  Follow the README.md for stack-specific setup\n"));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.bold.red(`\n✗ Error: ${error.message}\n`));
    } else {
      console.error(chalk.bold.red("\n✗ An unexpected error occurred\n"));
    }
    process.exit(1);
  }
}

async function promptForAppType(): Promise<AppType> {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "appType",
      message: "Which app type do you want to generate?",
      choices: APP_TYPE_CHOICES,
    },
  ]);

  return answers.appType;
}

async function promptForStack(appType: AppType): Promise<SupportedStack> {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "stack",
      message: "Choose the implementation stack:",
      choices: getStackChoices(appType),
    },
  ]);

  return answers.stack;
}

async function promptForProjectMetadata(): Promise<{
  projectName: string;
  projectDescription: string;
}> {
  return inquirer.prompt([
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
    {
      type: "list",
      name: "projectDomain",
      message: "Choose the backend domain:",
      choices: [
        "General business API",
        "SaaS platform API",
        "E-commerce backend",
        "Content platform API",
        "Internal operations service",
      ],
    },
    {
      type: "list",
      name: "deliveryProfile",
      message: "Choose the initial delivery profile:",
      choices: [
        "Prototype",
        "MVP",
        "Production baseline",
      ],
    },
  ]).then((answers) => ({
    projectName: answers.projectName,
    projectDescription: `${answers.deliveryProfile} ${answers.projectDomain}`.trim(),
  }));
}

async function promptForBackendOptions(
  projectName: string,
  stack: BackendStack
): Promise<
  Pick<
    BackendGenerationConfig,
    "appName" | "databases" | "securityPreset" | "logging" | "monitoring" | "testing"
  >
> {
  const loggingChoices =
    stack === "nestjs"
      ? NEST_LOGGING_CHOICES
      : stack === "python-fastapi"
        ? FASTAPI_LOGGING_CHOICES
        : LOGGING_CHOICES;
  const testingChoices =
    stack === "python-fastapi" ? FASTAPI_TESTING_CHOICES : TESTING_CHOICES;
  const securityDefault =
    stack === "python-fastapi" ? "argon2-jwt" : "bcrypt-jwt";
  const loggingDefault =
    stack === "python-fastapi" ? "structlog" : "pino";
  const testingDefault =
    stack === "python-fastapi" ? "pytest-httpx" : "jest-supertest";

  return inquirer.prompt([
    {
      type: "input",
      name: "appName",
      message: "Application name for runtime metadata:",
      default: projectName,
      validate: (input: string) => {
        if (!input.trim()) {
          return "Application name cannot be empty";
        }
        return true;
      },
    },
    {
      type: "checkbox",
      name: "databases",
      message: "Select all databases and data stores this backend should prepare for:",
      choices: DATABASE_CHOICES,
    },
    {
      type: "list",
      name: "securityPreset",
      message: "Choose a password and token handling preset:",
      choices: SECURITY_CHOICES,
      default: securityDefault,
    },
    {
      type: "list",
      name: "logging",
      message: "Choose the logging approach:",
      choices: loggingChoices,
      default: loggingDefault,
    },
    {
      type: "list",
      name: "monitoring",
      message: "Choose the monitoring setup:",
      choices: MONITORING_CHOICES,
      default: "health-only",
    },
    {
      type: "list",
      name: "testing",
      message: "Choose the testing setup:",
      choices: testingChoices,
      default: testingDefault,
    },
  ]);
}

function getTemplateNameForStack(stack: BackendStack): BackendGenerationConfig["template"] {
  switch (stack) {
    case "node-ts-express":
      return "Express API";
    case "nestjs":
      return "NestJS API";
    case "python-fastapi":
      return "FastAPI Service";
  }
}

function getNextSteps(stack: BackendStack): string[] {
  switch (stack) {
    case "python-fastapi":
      return [
        "python -m venv .venv",
        "source .venv/bin/activate",
        "pip install -r requirements.txt",
      ];
    case "node-ts-express":
    case "nestjs":
      return ["npm install"];
  }
}

main();
