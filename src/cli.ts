#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
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
    const appType = await promptForAppType();
    const stack = await promptForStack(appType);
    const projectMeta = await promptForProjectMetadata(appType);
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

async function promptForProjectMetadata(appType: AppType): Promise<{
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
      message: "Choose the project domain:",
      choices: projectDomainChoices,
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
      default:
        appType === "dsa-specific"
          ? "exam"
          : appType === "frontend"
            ? "startup"
            : "production",
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
  }
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
      projectProfile: projectMeta.projectProfile,
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
    const frontendOptions = await promptForFrontendOptions(
      projectMeta.projectName,
      stack as FrontendStack
    );

    return {
      appType,
      framework: getFrameworkForStack(stack),
      stack,
      projectProfile: projectMeta.projectProfile,
      projectName: projectMeta.projectName,
      projectPath: process.cwd(),
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
      stack as AiMlStack
    );

    return {
      appType,
      framework: getFrameworkForStack(stack),
      stack,
      projectProfile: projectMeta.projectProfile,
      projectName: projectMeta.projectName,
      projectPath: process.cwd(),
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
      stack as DsaStack
    );

    return {
      appType,
      framework: getFrameworkForStack(stack),
      stack,
      projectProfile: projectMeta.projectProfile,
      projectName: projectMeta.projectName,
      projectPath: process.cwd(),
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
  projectName: string,
  stack: FrontendStack
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
  const answers = await inquirer.prompt([
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
      choices:
        stack === "nextjs"
          ? [{ name: "Built into Next.js", value: "none" as FrontendRoutingOption }]
          : FRONTEND_ROUTING_CHOICES,
      default: "react-router",
      when: stack !== "nextjs",
    },
    {
      type: "list",
      name: "nextRouter",
      message: "Choose the Next.js router mode:",
      choices: NEXT_ROUTER_CHOICES,
      default: "app-router",
      when: stack === "nextjs",
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
      choices: testingChoices,
      default: testingDefault,
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
  stack: AiMlStack
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

  return inquirer.prompt([
    {
      type: "input",
      name: "appName",
      message: "Application name for service metadata:",
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
      name: "servingMode",
      message: "Choose the serving mode:",
      choices: AI_ML_SERVING_CHOICES,
      default: "realtime-api",
      when: stack === "python-fastapi-serving",
    },
    {
      type: "list",
      name: "executionMode",
      message: "Choose the pipeline execution mode:",
      choices: AI_ML_EXECUTION_CHOICES,
      default: "batch-pipeline",
      when: stack === "r-analytics",
    },
    {
      type: "list",
      name: "runtimeMode",
      message: "Choose the C++ runtime mode:",
      choices: AI_ML_RUNTIME_CHOICES,
      default: "cli-inference",
      when: stack === "cpp-inference",
    },
    {
      type: "list",
      name: "modelPackaging",
      message: "Choose the model packaging strategy:",
      choices: packagingChoices,
      default: "local-artifacts",
    },
    {
      type: "list",
      name: "tracking",
      message: "Choose the experiment tracking setup:",
      choices: AI_ML_TRACKING_CHOICES,
      default: "mlflow",
    },
    {
      type: "list",
      name: "validation",
      message: "Choose the validation setup:",
      choices:
        stack === "python-fastapi-serving"
          ? AI_ML_VALIDATION_CHOICES.filter((choice) => choice.value !== "base-checks")
          : [{ name: "Base checks", value: "base-checks" as AiMlValidationOption }],
      default: stack === "python-fastapi-serving" ? "pydantic" : "base-checks",
    },
    {
      type: "list",
      name: "logging",
      message: "Choose the logging approach:",
      choices: loggingChoices,
      default:
        stack === "r-analytics"
          ? "r-logger"
          : stack === "cpp-inference"
            ? "stdout-logging"
            : "structlog",
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
  stack: DsaStack
): Promise<Pick<DsaGenerationConfig, "appName" | "track" | "inputMode" | "testing">> {
  if (stack !== "dsa-cpp" && stack !== "dsa-python") {
    throw new Error(`Unsupported dsa stack "${stack}"`);
  }

  const testingChoices =
    stack === "dsa-python" ? DSA_PYTHON_TESTING_CHOICES : DSA_CPP_TESTING_CHOICES;

  return inquirer.prompt([
    {
      type: "input",
      name: "appName",
      message: "Workspace name for metadata:",
      default: projectName,
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
      default: "competitive-programming",
    },
    {
      type: "list",
      name: "inputMode",
      message: "Choose the runner style:",
      choices: DSA_INPUT_MODE_CHOICES,
      default: (answers: { track: DsaTrackOption }) =>
        answers.track === "interview-prep" ? "function-first" : "stdin-stdout",
    },
    {
      type: "list",
      name: "testing",
      message: "Choose the verification setup:",
      choices: testingChoices,
      default: (answers: { track: DsaTrackOption }) =>
        answers.track === "interview-prep"
          ? stack === "dsa-python"
            ? "pytest"
            : "ctest"
          : "manual-cases",
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

main();
