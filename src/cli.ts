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
  FrontendDataFetchingOption,
  FrontendGenerationConfig,
  FrontendRoutingOption,
  FrontendStack,
  FrontendStateOption,
  FrontendStylingOption,
  FrontendTestingOption,
  FrontendUiAddon,
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

const FRONTEND_ROUTING_CHOICES: { name: string; value: FrontendRoutingOption }[] = [
  { name: "No routing", value: "none" },
  { name: "React Router", value: "react-router" },
];

const FRONTEND_STYLING_CHOICES: { name: string; value: FrontendStylingOption }[] = [
  { name: "Plain CSS", value: "plain-css" },
  { name: "Tailwind CSS", value: "tailwind" },
];

const FRONTEND_STATE_CHOICES: { name: string; value: FrontendStateOption }[] = [
  { name: "No shared state", value: "none" },
  { name: "React Context", value: "context" },
  { name: "Zustand", value: "zustand" },
];

const FRONTEND_DATA_CHOICES: { name: string; value: FrontendDataFetchingOption }[] = [
  { name: "Native fetch", value: "fetch" },
  { name: "TanStack Query", value: "tanstack-query" },
];

const FRONTEND_TESTING_CHOICES: { name: string; value: FrontendTestingOption }[] = [
  { name: "Vitest", value: "vitest" },
  { name: "Vitest + React Testing Library", value: "vitest-rtl" },
];

async function main() {
  console.log(chalk.bold.cyan("\n🚀 Welcome to start-it!\n"));
  console.log(chalk.gray("Create a project from guided stack selections.\n"));

  try {
    const appType = await promptForAppType();
    const stack = await promptForStack(appType);
    const projectMeta = await promptForProjectMetadata();
    const config = await buildProjectConfig(appType, stack, projectMeta);

    const generator = new ProjectGenerator(config);
    await generator.generate();

    console.log(
      chalk.bold.green(`\n✓ Project "${config.projectName}" created successfully!\n`)
    );
    console.log(chalk.cyan("Next steps:"));
    console.log(chalk.gray(`  cd ${config.projectName}`));
    for (const step of getNextSteps(config.stack)) {
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

async function buildProjectConfig(
  appType: AppType,
  stack: SupportedStack,
  projectMeta: { projectName: string; projectDescription: string }
): Promise<ProjectConfig> {
  if (appType === "backend") {
    const backendOptions = await promptForBackendOptions(
      projectMeta.projectName,
      stack as BackendStack
    );

    return {
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
  }

  if (appType === "frontend") {
    const frontendOptions = await promptForFrontendOptions(projectMeta.projectName);

    return {
      appType,
      framework: getFrameworkForStack(stack),
      stack,
      projectName: projectMeta.projectName,
      projectPath: process.cwd(),
      options: {
        template: "React + Vite",
        stack: stack as FrontendStack,
        projectDescription: projectMeta.projectDescription,
        appName: frontendOptions.appName,
        styling: frontendOptions.styling,
        routing: frontendOptions.routing,
        uiAddon: frontendOptions.uiAddon,
        stateManagement: frontendOptions.stateManagement,
        dataFetching: frontendOptions.dataFetching,
        testing: frontendOptions.testing,
        baselineSource: "auto",
      },
    };
  }

  throw new Error(`Unsupported app type "${appType}"`);
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

async function promptForFrontendOptions(
  projectName: string
): Promise<
  Pick<
    FrontendGenerationConfig,
    "appName" | "routing" | "styling" | "uiAddon" | "stateManagement" | "dataFetching" | "testing"
  >
> {
  return inquirer.prompt([
    {
      type: "input",
      name: "appName",
      message: "Application name for UI metadata:",
      default: projectName,
      validate: (input: string) => {
        if (!input.trim()) {
          return "Application name cannot be empty";
        }
        return true;
      },
    },
    {
      type: "list",
      name: "routing",
      message: "Choose the routing setup:",
      choices: FRONTEND_ROUTING_CHOICES,
      default: "react-router",
    },
    {
      type: "list",
      name: "styling",
      message: "Choose the styling baseline:",
      choices: FRONTEND_STYLING_CHOICES,
      default: "tailwind",
    },
    {
      type: "list",
      name: "uiAddon",
      message: "Choose the UI add-on layer:",
      choices: (answers: { styling: FrontendStylingOption }) =>
        answers.styling === "tailwind"
          ? [
              { name: "None", value: "none" as FrontendUiAddon },
              { name: "shadcn/ui starter", value: "shadcn-ui" as FrontendUiAddon },
            ]
          : [{ name: "None", value: "none" as FrontendUiAddon }],
      default: "none",
    },
    {
      type: "list",
      name: "stateManagement",
      message: "Choose the shared state approach:",
      choices: FRONTEND_STATE_CHOICES,
      default: "zustand",
    },
    {
      type: "list",
      name: "dataFetching",
      message: "Choose the data fetching setup:",
      choices: FRONTEND_DATA_CHOICES,
      default: "tanstack-query",
    },
    {
      type: "list",
      name: "testing",
      message: "Choose the testing setup:",
      choices: FRONTEND_TESTING_CHOICES,
      default: "vitest-rtl",
    },
  ]);
}

function getNextSteps(stack: SupportedStack): string[] {
  switch (stack) {
    case "python-fastapi":
      return [
        "python -m venv .venv",
        "source .venv/bin/activate",
        "pip install -r requirements.txt",
      ];
    case "react-vite":
      return ["npm install", "npm run dev"];
    case "node-ts-express":
    case "nestjs":
      return ["npm install"];
  }
  throw new Error(`Unsupported stack "${stack}"`);
}

main();
