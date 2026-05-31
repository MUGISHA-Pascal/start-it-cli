export type AppType = "backend" | "frontend" | "ai-ml" | "dsa-specific";

export type SupportedStack = string;
export type BackendStack = "node-ts-express" | "nestjs" | "python-fastapi";
export type FrontendStack = "react-vite" | "nextjs";
export type AiMlStack =
  | "python-fastapi-serving"
  | "r-analytics"
  | "cpp-inference";

export type BackendDatabase =
  | "postgresql"
  | "mysql"
  | "mongodb"
  | "redis"
  | "duckdb";

export type BackendSecurityPreset =
  | "none"
  | "bcrypt"
  | "argon2"
  | "bcrypt-jwt"
  | "argon2-jwt";

export type BackendLoggingOption =
  | "console"
  | "morgan"
  | "pino"
  | "python-logging"
  | "structlog";

export type BackendMonitoringOption =
  | "none"
  | "health-only"
  | "prometheus-ready";

export type BackendTestingOption =
  | "jest"
  | "jest-supertest"
  | "pytest"
  | "pytest-httpx";

export interface BackendGenerationConfig {
  template: "Express API" | "NestJS API" | "FastAPI Service";
  stack: BackendStack;
  projectDescription: string;
  appName: string;
  databases: BackendDatabase[];
  securityPreset: BackendSecurityPreset;
  logging: BackendLoggingOption;
  monitoring: BackendMonitoringOption;
  testing: BackendTestingOption;
  apiStyle: "rest";
}

export type FrontendStylingOption = "plain-css" | "tailwind";
export type FrontendRoutingOption = "none" | "react-router";
export type FrontendNextRouterOption = "app-router" | "pages-router";
export type FrontendUiAddon = "none" | "shadcn-ui";
export type FrontendStateOption = "none" | "context" | "zustand";
export type FrontendDataFetchingOption = "fetch" | "tanstack-query";
export type FrontendTestingOption =
  | "vitest"
  | "vitest-rtl"
  | "jest"
  | "jest-rtl";
export type FrontendBaselineSource = "auto" | "provider" | "local";

export interface FrontendGenerationConfig {
  template: "React + Vite" | "Next.js";
  stack: FrontendStack;
  projectDescription: string;
  appName: string;
  styling: FrontendStylingOption;
  routing: FrontendRoutingOption;
  nextRouter?: FrontendNextRouterOption;
  uiAddon: FrontendUiAddon;
  stateManagement: FrontendStateOption;
  dataFetching: FrontendDataFetchingOption;
  testing: FrontendTestingOption;
  baselineSource: FrontendBaselineSource;
}

export type AiMlServingMode = "realtime-api" | "realtime-plus-batch";
export type AiMlExecutionMode = "batch-pipeline" | "batch-plus-report";
export type AiMlRuntimeMode = "cli-inference" | "batch-cli";
export type AiMlModelPackagingOption =
  | "local-artifacts"
  | "huggingface-compatible"
  | "mlflow-ready"
  | "onnx-ready";
export type AiMlTrackingOption = "none" | "mlflow" | "wandb-ready";
export type AiMlValidationOption =
  | "pydantic"
  | "pydantic-plus-pandera"
  | "base-checks";
export type AiMlTestingOption =
  | "pytest"
  | "pytest-httpx"
  | "testthat"
  | "ctest";
export type AiMlLoggingOption =
  | "python-logging"
  | "structlog"
  | "r-logger"
  | "stdout-logging"
  | "spdlog-ready";

export interface AiMlGenerationConfig {
  template: "FastAPI Model Serving" | "R Analytics Pipeline" | "C++ Inference Utility";
  stack: AiMlStack;
  projectDescription: string;
  appName: string;
  servingMode?: AiMlServingMode;
  executionMode?: AiMlExecutionMode;
  runtimeMode?: AiMlRuntimeMode;
  modelPackaging: AiMlModelPackagingOption;
  tracking: AiMlTrackingOption;
  validation?: AiMlValidationOption;
  logging: AiMlLoggingOption;
  testing: AiMlTestingOption;
}

export interface TemplateOptions {
  template: string;
  stack?: SupportedStack;
  projectDescription?: string;
  appName?: string;
  databases?: BackendDatabase[];
  securityPreset?: BackendSecurityPreset;
  logging?: BackendLoggingOption | AiMlLoggingOption;
  monitoring?: BackendMonitoringOption;
  testing?: BackendTestingOption | FrontendTestingOption | AiMlTestingOption;
  apiStyle?: "rest";
  styling?: FrontendStylingOption;
  routing?: FrontendRoutingOption;
  nextRouter?: FrontendNextRouterOption;
  uiAddon?: FrontendUiAddon;
  stateManagement?: FrontendStateOption;
  dataFetching?: FrontendDataFetchingOption;
  baselineSource?: FrontendBaselineSource;
  servingMode?: AiMlServingMode;
  executionMode?: AiMlExecutionMode;
  runtimeMode?: AiMlRuntimeMode;
  modelPackaging?: AiMlModelPackagingOption;
  tracking?: AiMlTrackingOption;
  validation?: AiMlValidationOption;
}

export interface ProjectConfig {
  appType: AppType;
  framework: string;
  stack: SupportedStack;
  projectName: string;
  projectPath: string;
  options?: TemplateOptions;
}

export interface TemplateConfig {
  name: string;
  description: string;
  files: TemplateFile[];
}

export interface TemplateFile {
  path: string;
  content: string;
  isExecutable?: boolean;
}
