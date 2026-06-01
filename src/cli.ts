#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import path from "path";
import { ProjectGenerator } from "./generator";
import {
  AiMlExecutionMode,
  AiMlGenerationConfig,
  AiMlLoggingOption,
  AiMlModelPackagingOption,
  AiMlRuntimeMode,
  AiMlServingMode,
  AiMlStack,
  AiMlTestingOption,
  AiMlTrackingOption,
  AiMlValidationOption,
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
  FrontendNextRouterOption,
  FrontendRoutingOption,
  FrontendStack,
  FrontendStateOption,
  FrontendStylingOption,
  FrontendTestingOption,
  FrontendUiAddon,
  DsaGenerationConfig,
  DsaInputMode,
  DsaStack,
  DsaTestingOption,
  DsaTrackOption,
  ProjectProfile,
  ProjectConfig,
  SupportedStack,
} from "./types";
import { APP_TYPE_CHOICES, getFrameworkForStack, getStackChoices } from "./workflow";

type RawCliArgs = {
  projectName?: string;
  projectPath?: string;
  appType?: AppType;
  stack?: SupportedStack;
  projectProfile?: ProjectProfile;
  projectDomain?: string;
  appName?: string;
  databases?: BackendDatabase[];
  securityPreset?: BackendSecurityPreset;
  logging?: BackendLoggingOption | AiMlLoggingOption;
  monitoring?: BackendMonitoringOption;
  testing?: BackendTestingOption | FrontendTestingOption | AiMlTestingOption | DsaTestingOption;
  routing?: FrontendRoutingOption;
  nextRouter?: FrontendNextRouterOption;
  styling?: FrontendStylingOption;
  uiAddon?: FrontendUiAddon;
  stateManagement?: FrontendStateOption;
  dataFetching?: FrontendDataFetchingOption;
  servingMode?: AiMlServingMode;
  executionMode?: AiMlExecutionMode;
  runtimeMode?: AiMlRuntimeMode;
  modelPackaging?: AiMlModelPackagingOption;
  tracking?: AiMlTrackingOption;
  validation?: AiMlValidationOption;
  track?: DsaTrackOption;
  inputMode?: DsaInputMode;
  nonInteractive?: boolean;
  help?: boolean;
};

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

const NEXT_ROUTER_CHOICES: { name: string; value: FrontendNextRouterOption }[] = [
  { name: "App Router", value: "app-router" },
  { name: "Pages Router", value: "pages-router" },
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

const NEXT_TESTING_CHOICES: { name: string; value: FrontendTestingOption }[] = [
  { name: "Jest", value: "jest" },
  { name: "Jest + React Testing Library", value: "jest-rtl" },
];

const AI_ML_SERVING_CHOICES: { name: string; value: AiMlServingMode }[] = [
  { name: "Realtime API", value: "realtime-api" },
  { name: "Realtime + batch endpoints", value: "realtime-plus-batch" },
];

const AI_ML_EXECUTION_CHOICES: { name: string; value: AiMlExecutionMode }[] = [
  { name: "Batch pipeline", value: "batch-pipeline" },
  { name: "Batch pipeline + report output", value: "batch-plus-report" },
];

const AI_ML_RUNTIME_CHOICES: { name: string; value: AiMlRuntimeMode }[] = [
  { name: "CLI inference utility", value: "cli-inference" },
  { name: "CLI with batch input support", value: "batch-cli" },
];

const AI_ML_PACKAGING_CHOICES: {
  name: string;
  value: AiMlModelPackagingOption;
}[] = [
  { name: "Local model artifacts", value: "local-artifacts" },
  { name: "Hugging Face compatible", value: "huggingface-compatible" },
  { name: "MLflow-ready packaging", value: "mlflow-ready" },
];

const AI_ML_TRACKING_CHOICES: { name: string; value: AiMlTrackingOption }[] = [
  { name: "No experiment tracking", value: "none" },
  { name: "MLflow", value: "mlflow" },
  { name: "Weights & Biases ready", value: "wandb-ready" },
];

const AI_ML_VALIDATION_CHOICES: { name: string; value: AiMlValidationOption }[] = [
  { name: "Pydantic only", value: "pydantic" },
  { name: "Pydantic + Pandera", value: "pydantic-plus-pandera" },
];

const AI_ML_TESTING_CHOICES: { name: string; value: AiMlTestingOption }[] = [
  { name: "Pytest", value: "pytest" },
  { name: "Pytest + HTTPX", value: "pytest-httpx" },
];

const AI_ML_R_TESTING_CHOICES: { name: string; value: AiMlTestingOption }[] = [
  { name: "testthat", value: "testthat" },
];

const AI_ML_CPP_TESTING_CHOICES: { name: string; value: AiMlTestingOption }[] = [
  { name: "CTest", value: "ctest" },
];

const AI_ML_R_LOGGING_CHOICES: { name: string; value: AiMlLoggingOption }[] = [
  { name: "R logger", value: "r-logger" },
];

const AI_ML_CPP_LOGGING_CHOICES: { name: string; value: AiMlLoggingOption }[] = [
  { name: "stdout logging", value: "stdout-logging" },
  { name: "spdlog-ready", value: "spdlog-ready" },
];

const DSA_TRACK_CHOICES: { name: string; value: DsaTrackOption }[] = [
  { name: "Competitive programming", value: "competitive-programming" },
  { name: "Interview preparation", value: "interview-prep" },
];

const DSA_INPUT_MODE_CHOICES: { name: string; value: DsaInputMode }[] = [
  { name: "stdin / stdout", value: "stdin-stdout" },
  { name: "Function-first runner", value: "function-first" },
];

const DSA_CPP_TESTING_CHOICES: { name: string; value: DsaTestingOption }[] = [
  { name: "Manual sample cases", value: "manual-cases" },
  { name: "CTest", value: "ctest" },
];

const DSA_PYTHON_TESTING_CHOICES: { name: string; value: DsaTestingOption }[] = [
  { name: "Manual sample cases", value: "manual-cases" },
  { name: "Pytest", value: "pytest" },
];

async function main() {
  console.log(chalk.bold.cyan("\n🚀 Welcome to start-it!\n"));
  console.log(chalk.gray("Create a project from guided stack selections.\n"));

  try {
    const cliArgs = parseCliArgs(process.argv.slice(2));

    if (cliArgs.help) {
      printHelp();
      return;
    }

    const appType = await promptForAppType(cliArgs);
    const stack = await promptForStack(appType, cliArgs);
    const projectMeta = await promptForProjectMetadata(appType, cliArgs);
    const config = await buildProjectConfig(appType, stack, projectMeta, cliArgs);

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

async function promptForAppType(cliArgs: RawCliArgs): Promise<AppType> {
  if (cliArgs.appType) {
    return cliArgs.appType;
  }

  if (cliArgs.stack) {
    return inferAppTypeFromStack(cliArgs.stack);
  }

  if (cliArgs.nonInteractive) {
    return "backend";
  }

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

async function promptForStack(
  appType: AppType,
  cliArgs: RawCliArgs
): Promise<SupportedStack> {
  if (cliArgs.stack) {
    const validStacks = getStackChoices(appType).map((choice) => choice.value);
    if (!validStacks.includes(cliArgs.stack)) {
      throw new Error(`Stack "${cliArgs.stack}" is not valid for app type "${appType}"`);
    }
    return cliArgs.stack;
  }

  if (cliArgs.nonInteractive) {
    return getStackChoices(appType)[0].value;
  }

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

async function promptForProjectMetadata(
  appType: AppType,
  cliArgs: RawCliArgs
): Promise<{
  projectName: string;
  projectDescription: string;
  projectProfile: ProjectProfile;
}> {
  const projectDomainChoices =
    appType === "frontend"
      ? [
          "General product UI",
          "SaaS dashboard",
          "Content platform frontend",
          "E-commerce storefront",
          "Internal operations console",
        ]
      : appType === "ai-ml"
        ? [
            "Prediction service",
            "Classification API",
            "Embedding service",
            "Recommendation engine",
            "Internal ML utility",
          ]
        : appType === "dsa-specific"
          ? [
              "Competitive programming workbook",
              "Interview prep workspace",
              "Algorithms kata repository",
              "Contest practice set",
              "Data structures revision kit",
            ]
        : [
            "General business API",
            "SaaS platform API",
            "E-commerce backend",
            "Content platform API",
            "Internal operations service",
          ];

  const defaultProfile =
    appType === "dsa-specific"
      ? "exam"
      : appType === "frontend"
        ? "startup"
        : "production";

  if (cliArgs.nonInteractive) {
    const projectProfile = cliArgs.projectProfile || defaultProfile;
    const projectDomain = cliArgs.projectDomain || projectDomainChoices[0];
    const projectName = cliArgs.projectName || "my-app";
    const validation = validateProjectName(projectName);
    if (validation !== true) {
      throw new Error(validation);
    }

    return {
      projectName,
      projectDescription: `${formatProjectProfileLabel(projectProfile)} ${projectDomain}`.trim(),
      projectProfile,
    };
  }

  return inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Project name:",
      default: cliArgs.projectName || "my-app",
      validate: validateProjectName,
    },
    {
      type: "list",
      name: "projectDomain",
      message: "Choose the project domain:",
      choices: projectDomainChoices,
      default: cliArgs.projectDomain || projectDomainChoices[0],
    },
    {
      type: "list",
      name: "projectProfile",
      message: "Choose the AI engineering profile:",
      choices: [
        { name: "Exam mode", value: "exam" as ProjectProfile },
        { name: "Startup mode", value: "startup" as ProjectProfile },
        { name: "Production mode", value: "production" as ProjectProfile },
      ],
      default: cliArgs.projectProfile || defaultProfile,
    },
  ]).then((answers) => ({
    projectName: answers.projectName,
    projectDescription: `${formatProjectProfileLabel(answers.projectProfile)} ${answers.projectDomain}`.trim(),
    projectProfile: answers.projectProfile,
  }));
}

function formatProjectProfileLabel(projectProfile: ProjectProfile): string {
  switch (projectProfile) {
    case "exam":
      return "Exam mode";
    case "startup":
      return "Startup mode";
    case "production":
      return "Production baseline";
  }
}

async function buildProjectConfig(
  appType: AppType,
  stack: SupportedStack,
  projectMeta: {
    projectName: string;
    projectDescription: string;
    projectProfile: ProjectProfile;
  },
  cliArgs: RawCliArgs
): Promise<ProjectConfig> {
  if (appType === "backend") {
    const backendOptions = await promptForBackendOptions(
      projectMeta.projectName,
      stack as BackendStack,
      cliArgs
    );

    return {
      appType,
      framework: getFrameworkForStack(stack),
      stack,
      projectProfile: projectMeta.projectProfile,
      projectName: projectMeta.projectName,
      projectPath: resolveProjectPath(cliArgs.projectPath),
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
    const frontendOptions = await promptForFrontendOptions(
      projectMeta.projectName,
      stack as FrontendStack,
      cliArgs
    );

    return {
      appType,
      framework: getFrameworkForStack(stack),
      stack,
      projectProfile: projectMeta.projectProfile,
      projectName: projectMeta.projectName,
      projectPath: resolveProjectPath(cliArgs.projectPath),
      options: {
        template: getFrontendTemplateName(stack as FrontendStack),
        stack: stack as FrontendStack,
        projectDescription: projectMeta.projectDescription,
        appName: frontendOptions.appName,
        styling: frontendOptions.styling,
        routing: frontendOptions.routing,
        nextRouter: frontendOptions.nextRouter,
        uiAddon: frontendOptions.uiAddon,
        stateManagement: frontendOptions.stateManagement,
        dataFetching: frontendOptions.dataFetching,
        testing: frontendOptions.testing,
        baselineSource: "auto",
      },
    };
  }

  if (appType === "ai-ml") {
    const aiMlOptions = await promptForAiMlOptions(
      projectMeta.projectName,
      stack as AiMlStack,
      cliArgs
    );

    return {
      appType,
      framework: getFrameworkForStack(stack),
      stack,
      projectProfile: projectMeta.projectProfile,
      projectName: projectMeta.projectName,
      projectPath: resolveProjectPath(cliArgs.projectPath),
      options: {
        template: getAiMlTemplateName(stack as AiMlStack),
        stack: stack as AiMlStack,
        projectDescription: projectMeta.projectDescription,
        appName: aiMlOptions.appName,
        servingMode: aiMlOptions.servingMode,
        executionMode: aiMlOptions.executionMode,
        runtimeMode: aiMlOptions.runtimeMode,
        modelPackaging: aiMlOptions.modelPackaging,
        tracking: aiMlOptions.tracking,
        validation: aiMlOptions.validation,
        logging: aiMlOptions.logging,
        testing: aiMlOptions.testing,
      },
    };
  }

  if (appType === "dsa-specific") {
    const dsaOptions = await promptForDsaOptions(
      projectMeta.projectName,
      stack as DsaStack,
      cliArgs
    );

    return {
      appType,
      framework: getFrameworkForStack(stack),
      stack,
      projectProfile: projectMeta.projectProfile,
      projectName: projectMeta.projectName,
      projectPath: resolveProjectPath(cliArgs.projectPath),
      options: {
        template: getDsaTemplateName(stack as DsaStack),
        stack: stack as DsaStack,
        projectDescription: projectMeta.projectDescription,
        appName: dsaOptions.appName,
        track: dsaOptions.track,
        inputMode: dsaOptions.inputMode,
        testing: dsaOptions.testing,
      },
    };
  }

  throw new Error(`Unsupported app type "${appType}"`);
}

async function promptForBackendOptions(
  projectName: string,
  stack: BackendStack,
  cliArgs: RawCliArgs
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

  if (cliArgs.nonInteractive) {
    return {
      appName: cliArgs.appName || projectName,
      databases: cliArgs.databases || [],
      securityPreset: (cliArgs.securityPreset as BackendSecurityPreset) || securityDefault,
      logging: (cliArgs.logging as BackendLoggingOption) || loggingDefault,
      monitoring: cliArgs.monitoring || "health-only",
      testing: (cliArgs.testing as BackendTestingOption) || testingDefault,
    };
  }

  return inquirer.prompt([
    {
      type: "input",
      name: "appName",
      message: "Application name for runtime metadata:",
      default: cliArgs.appName || projectName,
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
      default: cliArgs.databases || [],
    },
    {
      type: "list",
      name: "securityPreset",
      message: "Choose a password and token handling preset:",
      choices: SECURITY_CHOICES,
      default: cliArgs.securityPreset || securityDefault,
    },
    {
      type: "list",
      name: "logging",
      message: "Choose the logging approach:",
      choices: loggingChoices,
      default: cliArgs.logging || loggingDefault,
    },
    {
      type: "list",
      name: "monitoring",
      message: "Choose the monitoring setup:",
      choices: MONITORING_CHOICES,
      default: cliArgs.monitoring || "health-only",
    },
    {
      type: "list",
      name: "testing",
      message: "Choose the testing setup:",
      choices: testingChoices,
      default: cliArgs.testing || testingDefault,
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
  projectName: string,
  stack: FrontendStack,
  cliArgs: RawCliArgs
): Promise<
  Pick<
    FrontendGenerationConfig,
    | "appName"
    | "routing"
    | "nextRouter"
    | "styling"
    | "uiAddon"
    | "stateManagement"
    | "dataFetching"
    | "testing"
  >
> {
  const testingChoices =
    stack === "nextjs" ? NEXT_TESTING_CHOICES : FRONTEND_TESTING_CHOICES;
  const testingDefault = stack === "nextjs" ? "jest-rtl" : "vitest-rtl";

  if (cliArgs.nonInteractive) {
    return {
      appName: cliArgs.appName || projectName,
      routing:
        stack === "nextjs"
          ? "none"
          : (cliArgs.routing as FrontendRoutingOption) || "react-router",
      nextRouter:
        stack === "nextjs"
          ? (cliArgs.nextRouter as FrontendNextRouterOption) || "app-router"
          : undefined,
      styling: cliArgs.styling || "tailwind",
      uiAddon:
        cliArgs.styling === "plain-css"
          ? "none"
          : cliArgs.uiAddon || "none",
      stateManagement: cliArgs.stateManagement || "zustand",
      dataFetching: cliArgs.dataFetching || "tanstack-query",
      testing: (cliArgs.testing as FrontendTestingOption) || testingDefault,
    };
  }

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "appName",
      message: "Application name for UI metadata:",
      default: cliArgs.appName || projectName,
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
      choices:
        stack === "nextjs"
          ? [{ name: "Built into Next.js", value: "none" as FrontendRoutingOption }]
          : FRONTEND_ROUTING_CHOICES,
      default: cliArgs.routing || "react-router",
      when: stack !== "nextjs",
    },
    {
      type: "list",
      name: "nextRouter",
      message: "Choose the Next.js router mode:",
      choices: NEXT_ROUTER_CHOICES,
      default: cliArgs.nextRouter || "app-router",
      when: stack === "nextjs",
    },
    {
      type: "list",
      name: "styling",
      message: "Choose the styling baseline:",
      choices: FRONTEND_STYLING_CHOICES,
      default: cliArgs.styling || "tailwind",
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
      default: cliArgs.uiAddon || "none",
    },
    {
      type: "list",
      name: "stateManagement",
      message: "Choose the shared state approach:",
      choices: FRONTEND_STATE_CHOICES,
      default: cliArgs.stateManagement || "zustand",
    },
    {
      type: "list",
      name: "dataFetching",
      message: "Choose the data fetching setup:",
      choices: FRONTEND_DATA_CHOICES,
      default: cliArgs.dataFetching || "tanstack-query",
    },
    {
      type: "list",
      name: "testing",
      message: "Choose the testing setup:",
      choices: testingChoices,
      default: cliArgs.testing || testingDefault,
    },
  ]);

  return answers as Pick<
    FrontendGenerationConfig,
    | "appName"
    | "routing"
    | "nextRouter"
    | "styling"
    | "uiAddon"
    | "stateManagement"
    | "dataFetching"
    | "testing"
  >;
}

function getFrontendTemplateName(
  stack: FrontendStack
): FrontendGenerationConfig["template"] {
  switch (stack) {
    case "react-vite":
      return "React + Vite";
    case "nextjs":
      return "Next.js";
  }
}

async function promptForAiMlOptions(
  projectName: string,
  stack: AiMlStack,
  cliArgs: RawCliArgs
): Promise<
  Pick<
    AiMlGenerationConfig,
    | "appName"
    | "servingMode"
    | "executionMode"
    | "runtimeMode"
    | "modelPackaging"
    | "tracking"
    | "validation"
    | "logging"
    | "testing"
  >
> {
  const packagingChoices =
    stack === "cpp-inference"
      ? [
          { name: "Local model artifacts", value: "local-artifacts" as AiMlModelPackagingOption },
          { name: "ONNX-ready packaging", value: "onnx-ready" as AiMlModelPackagingOption },
        ]
      : AI_ML_PACKAGING_CHOICES.filter((choice) => choice.value !== "onnx-ready");
  const loggingChoices =
    stack === "r-analytics"
      ? AI_ML_R_LOGGING_CHOICES
      : stack === "cpp-inference"
        ? AI_ML_CPP_LOGGING_CHOICES
        : FASTAPI_LOGGING_CHOICES;
  const testingChoices =
    stack === "r-analytics"
      ? AI_ML_R_TESTING_CHOICES
      : stack === "cpp-inference"
        ? AI_ML_CPP_TESTING_CHOICES
        : AI_ML_TESTING_CHOICES;
  const testingDefault =
    stack === "r-analytics"
      ? "testthat"
      : stack === "cpp-inference"
        ? "ctest"
        : "pytest-httpx";

  if (cliArgs.nonInteractive) {
    return {
      appName: cliArgs.appName || projectName,
      servingMode:
        stack === "python-fastapi-serving"
          ? (cliArgs.servingMode as AiMlServingMode) || "realtime-api"
          : undefined,
      executionMode:
        stack === "r-analytics"
          ? (cliArgs.executionMode as AiMlExecutionMode) || "batch-pipeline"
          : undefined,
      runtimeMode:
        stack === "cpp-inference"
          ? (cliArgs.runtimeMode as AiMlRuntimeMode) || "cli-inference"
          : undefined,
      modelPackaging: cliArgs.modelPackaging || "local-artifacts",
      tracking: cliArgs.tracking || "mlflow",
      validation:
        stack === "python-fastapi-serving"
          ? (cliArgs.validation as AiMlValidationOption) || "pydantic"
          : "base-checks",
      logging:
        (cliArgs.logging as AiMlLoggingOption)
        || (stack === "r-analytics"
          ? "r-logger"
          : stack === "cpp-inference"
            ? "stdout-logging"
            : "structlog"),
      testing: (cliArgs.testing as AiMlTestingOption) || testingDefault,
    };
  }

  return inquirer.prompt([
    {
      type: "input",
      name: "appName",
      message: "Application name for service metadata:",
      default: cliArgs.appName || projectName,
      validate: (input: string) => {
        if (!input.trim()) {
          return "Application name cannot be empty";
        }
        return true;
      },
    },
    {
      type: "list",
      name: "servingMode",
      message: "Choose the serving mode:",
      choices: AI_ML_SERVING_CHOICES,
      default: cliArgs.servingMode || "realtime-api",
      when: stack === "python-fastapi-serving",
    },
    {
      type: "list",
      name: "executionMode",
      message: "Choose the pipeline execution mode:",
      choices: AI_ML_EXECUTION_CHOICES,
      default: cliArgs.executionMode || "batch-pipeline",
      when: stack === "r-analytics",
    },
    {
      type: "list",
      name: "runtimeMode",
      message: "Choose the C++ runtime mode:",
      choices: AI_ML_RUNTIME_CHOICES,
      default: cliArgs.runtimeMode || "cli-inference",
      when: stack === "cpp-inference",
    },
    {
      type: "list",
      name: "modelPackaging",
      message: "Choose the model packaging strategy:",
      choices: packagingChoices,
      default: cliArgs.modelPackaging || "local-artifacts",
    },
    {
      type: "list",
      name: "tracking",
      message: "Choose the experiment tracking setup:",
      choices: AI_ML_TRACKING_CHOICES,
      default: cliArgs.tracking || "mlflow",
    },
    {
      type: "list",
      name: "validation",
      message: "Choose the validation setup:",
      choices:
        stack === "python-fastapi-serving"
          ? AI_ML_VALIDATION_CHOICES.filter((choice) => choice.value !== "base-checks")
          : [{ name: "Base checks", value: "base-checks" as AiMlValidationOption }],
      default:
        cliArgs.validation
        || (stack === "python-fastapi-serving" ? "pydantic" : "base-checks"),
    },
    {
      type: "list",
      name: "logging",
      message: "Choose the logging approach:",
      choices: loggingChoices,
      default: cliArgs.logging
        || (stack === "r-analytics"
          ? "r-logger"
          : stack === "cpp-inference"
            ? "stdout-logging"
            : "structlog"),
    },
    {
      type: "list",
      name: "testing",
      message: "Choose the testing setup:",
      choices: testingChoices,
      default: cliArgs.testing || testingDefault,
    },
  ]);
}

function getAiMlTemplateName(
  stack: AiMlStack
): AiMlGenerationConfig["template"] {
  switch (stack) {
    case "python-fastapi-serving":
      return "FastAPI Model Serving";
    case "r-analytics":
      return "R Analytics Pipeline";
    case "cpp-inference":
      return "C++ Inference Utility";
  }
}

async function promptForDsaOptions(
  projectName: string,
  stack: DsaStack,
  cliArgs: RawCliArgs
): Promise<Pick<DsaGenerationConfig, "appName" | "track" | "inputMode" | "testing">> {
  if (stack !== "dsa-cpp" && stack !== "dsa-python") {
    throw new Error(`Unsupported dsa stack "${stack}"`);
  }

  const testingChoices =
    stack === "dsa-python" ? DSA_PYTHON_TESTING_CHOICES : DSA_CPP_TESTING_CHOICES;

  if (cliArgs.nonInteractive) {
    return {
      appName: cliArgs.appName || projectName,
      track: cliArgs.track || "competitive-programming",
      inputMode:
        cliArgs.inputMode
        || (cliArgs.track === "interview-prep" ? "function-first" : "stdin-stdout"),
      testing:
        (cliArgs.testing as DsaTestingOption)
        || (cliArgs.track === "interview-prep"
          ? stack === "dsa-python"
            ? "pytest"
            : "ctest"
          : "manual-cases"),
    };
  }

  return inquirer.prompt([
    {
      type: "input",
      name: "appName",
      message: "Workspace name for metadata:",
      default: cliArgs.appName || projectName,
      validate: (input: string) => {
        if (!input.trim()) {
          return "Workspace name cannot be empty";
        }
        return true;
      },
    },
    {
      type: "list",
      name: "track",
      message: "Choose the primary DSA workflow:",
      choices: DSA_TRACK_CHOICES,
      default: cliArgs.track || "competitive-programming",
    },
    {
      type: "list",
      name: "inputMode",
      message: "Choose the runner style:",
      choices: DSA_INPUT_MODE_CHOICES,
      default: cliArgs.inputMode || ((answers: { track: DsaTrackOption }) =>
        answers.track === "interview-prep" ? "function-first" : "stdin-stdout"),
    },
    {
      type: "list",
      name: "testing",
      message: "Choose the verification setup:",
      choices: testingChoices,
      default: cliArgs.testing || ((answers: { track: DsaTrackOption }) =>
        answers.track === "interview-prep"
          ? stack === "dsa-python"
            ? "pytest"
            : "ctest"
          : "manual-cases"),
    },
  ]);
}

function getDsaTemplateName(
  stack: DsaStack
): DsaGenerationConfig["template"] {
  switch (stack) {
    case "dsa-cpp":
      return "C++ DSA Workspace";
    case "dsa-python":
      return "Python DSA Workspace";
  }
}

function getNextSteps(stack: SupportedStack): string[] {
  switch (stack) {
    case "python-fastapi":
    case "python-fastapi-serving":
      return [
        "python -m venv .venv",
        "source .venv/bin/activate",
        "pip install -r requirements.txt",
      ];
    case "r-analytics":
      return ["Rscript scripts/run_pipeline.R"];
    case "cpp-inference":
    case "dsa-cpp":
      return [
        "cmake -S . -B build",
        "cmake --build build",
      ];
    case "dsa-python":
      return ["python main.py < examples/sample_input.txt"];
    case "react-vite":
      return ["npm install", "npm run dev"];
    case "nextjs":
      return ["npm install", "npm run dev"];
    case "node-ts-express":
    case "nestjs":
      return ["npm install"];
  }
  throw new Error(`Unsupported stack "${stack}"`);
}

function resolveProjectPath(projectPath: string | undefined): string {
  return projectPath ? path.resolve(projectPath) : process.cwd();
}

function validateProjectName(input: string): true | string {
  if (!input.trim()) {
    return "Project name cannot be empty";
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(input)) {
    return "Project name can only contain letters, numbers, hyphens, and underscores";
  }
  return true;
}

function parseCliArgs(argv: string[]): RawCliArgs {
  const args: RawCliArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      if (!args.projectName) {
        args.projectName = token;
        continue;
      }
      throw new Error(`Unexpected argument "${token}"`);
    }

    const [rawKey, inlineValue] = token.split("=", 2);
    const key = rawKey.slice(2);

    switch (key) {
      case "help":
      case "h":
        args.help = true;
        break;
      case "yes":
      case "non-interactive":
        args.nonInteractive = true;
        break;
      default: {
        const value = inlineValue ?? readFlagValue(argv, key, index);
        if (inlineValue === undefined) {
          index += 1;
        }

        switch (key) {
          case "name":
          case "project-name":
            args.projectName = value;
            break;
          case "path":
          case "dir":
          case "directory":
            args.projectPath = value;
            break;
          case "app-type":
            args.appType = parseEnumValue(key, value, [
              "backend",
              "frontend",
              "ai-ml",
              "dsa-specific",
            ]) as AppType;
            break;
          case "stack":
            args.stack = value;
            break;
          case "profile":
            args.projectProfile = parseEnumValue(key, value, [
              "exam",
              "startup",
              "production",
            ]) as ProjectProfile;
            break;
          case "domain":
            args.projectDomain = value;
            break;
          case "app-name":
            args.appName = value;
            break;
          case "databases":
            args.databases = value.split(",").filter(Boolean) as BackendDatabase[];
            break;
          case "security-preset":
            args.securityPreset = parseEnumValue(key, value, [
              "none",
              "bcrypt",
              "argon2",
              "bcrypt-jwt",
              "argon2-jwt",
            ]) as BackendSecurityPreset;
            break;
          case "logging":
            args.logging = value as BackendLoggingOption | AiMlLoggingOption;
            break;
          case "monitoring":
            args.monitoring = parseEnumValue(key, value, [
              "none",
              "health-only",
              "prometheus-ready",
            ]) as BackendMonitoringOption;
            break;
          case "testing":
            args.testing = value as RawCliArgs["testing"];
            break;
          case "routing":
            args.routing = parseEnumValue(key, value, ["none", "react-router"]) as FrontendRoutingOption;
            break;
          case "next-router":
            args.nextRouter = parseEnumValue(key, value, [
              "app-router",
              "pages-router",
            ]) as FrontendNextRouterOption;
            break;
          case "styling":
            args.styling = parseEnumValue(key, value, ["plain-css", "tailwind"]) as FrontendStylingOption;
            break;
          case "ui-addon":
            args.uiAddon = parseEnumValue(key, value, ["none", "shadcn-ui"]) as FrontendUiAddon;
            break;
          case "state-management":
            args.stateManagement = parseEnumValue(key, value, [
              "none",
              "context",
              "zustand",
            ]) as FrontendStateOption;
            break;
          case "data-fetching":
            args.dataFetching = parseEnumValue(key, value, [
              "fetch",
              "tanstack-query",
            ]) as FrontendDataFetchingOption;
            break;
          case "serving-mode":
            args.servingMode = parseEnumValue(key, value, [
              "realtime-api",
              "realtime-plus-batch",
            ]) as AiMlServingMode;
            break;
          case "execution-mode":
            args.executionMode = parseEnumValue(key, value, [
              "batch-pipeline",
              "batch-plus-report",
            ]) as AiMlExecutionMode;
            break;
          case "runtime-mode":
            args.runtimeMode = parseEnumValue(key, value, [
              "cli-inference",
              "batch-cli",
            ]) as AiMlRuntimeMode;
            break;
          case "model-packaging":
            args.modelPackaging = value as AiMlModelPackagingOption;
            break;
          case "tracking":
            args.tracking = parseEnumValue(key, value, [
              "none",
              "mlflow",
              "wandb-ready",
            ]) as AiMlTrackingOption;
            break;
          case "validation":
            args.validation = value as AiMlValidationOption;
            break;
          case "track":
            args.track = parseEnumValue(key, value, [
              "competitive-programming",
              "interview-prep",
            ]) as DsaTrackOption;
            break;
          case "input-mode":
            args.inputMode = parseEnumValue(key, value, [
              "stdin-stdout",
              "function-first",
            ]) as DsaInputMode;
            break;
          default:
            throw new Error(`Unknown flag "--${key}"`);
        }
        break;
      }
    }
  }

  if (args.projectName) {
    const validation = validateProjectName(args.projectName);
    if (validation !== true) {
      throw new Error(validation);
    }
  }

  if (args.appType && args.stack) {
    const validStacks = getStackChoices(args.appType).map((choice) => choice.value);
    if (!validStacks.includes(args.stack)) {
      throw new Error(`Stack "${args.stack}" is not valid for app type "${args.appType}"`);
    }
  }

  return args;
}

function readFlagValue(argv: string[], key: string, index: number): string {
  const nextValue = argv[index + 1];
  if (!nextValue || nextValue.startsWith("--")) {
    throw new Error(`Flag "--${key}" requires a value`);
  }
  return nextValue;
}

function parseEnumValue<T extends string>(
  key: string,
  value: string,
  allowed: T[]
): T {
  if (!allowed.includes(value as T)) {
    throw new Error(
      `Invalid value "${value}" for "--${key}". Allowed values: ${allowed.join(", ")}`
    );
  }
  return value as T;
}

function inferAppTypeFromStack(stack: SupportedStack): AppType {
  for (const appType of APP_TYPE_CHOICES.map((choice) => choice.value as AppType)) {
    const values = getStackChoices(appType).map((choice) => choice.value);
    if (values.includes(stack)) {
      return appType;
    }
  }

  throw new Error(`Unable to infer app type from stack "${stack}"`);
}

function printHelp() {
  console.log(`Usage:
  start-it-cli [project-name] [options]

Core options:
  --name, --project-name <name>     Project name
  --path, --dir <path>              Base directory where the project folder will be created
  --app-type <type>                 backend | frontend | ai-ml | dsa-specific
  --stack <stack>                   Stack within the selected app type
  --profile <profile>               exam | startup | production
  --domain <label>                  Project domain label used in generated metadata
  --app-name <name>                 Runtime/application display name
  --yes, --non-interactive          Use defaults for any missing prompts
  --help                            Show this help

Backend options:
  --databases <csv>                 e.g. postgresql,redis
  --security-preset <preset>        none | bcrypt | argon2 | bcrypt-jwt | argon2-jwt
  --logging <value>
  --monitoring <value>              none | health-only | prometheus-ready
  --testing <value>

Frontend options:
  --routing <value>                 none | react-router
  --next-router <value>             app-router | pages-router
  --styling <value>                 plain-css | tailwind
  --ui-addon <value>                none | shadcn-ui
  --state-management <value>        none | context | zustand
  --data-fetching <value>           fetch | tanstack-query

AI/ML options:
  --serving-mode <value>
  --execution-mode <value>
  --runtime-mode <value>
  --model-packaging <value>
  --tracking <value>
  --validation <value>

DSA options:
  --track <value>                   competitive-programming | interview-prep
  --input-mode <value>              stdin-stdout | function-first
`);
}

main();
