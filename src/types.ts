export type AppType = "backend" | "frontend" | "ai-ml" | "dsa-specific";

export type SupportedStack = string;
export type BackendStack = "node-ts-express" | "nestjs" | "python-fastapi";
export type FrontendStack = "react-vite";

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
export type FrontendUiAddon = "none" | "shadcn-ui";
export type FrontendStateOption = "none" | "context" | "zustand";
export type FrontendDataFetchingOption = "fetch" | "tanstack-query";
export type FrontendTestingOption = "vitest" | "vitest-rtl";
export type FrontendBaselineSource = "auto" | "provider" | "local";

export interface FrontendGenerationConfig {
  template: "React + Vite";
  stack: FrontendStack;
  projectDescription: string;
  appName: string;
  styling: FrontendStylingOption;
  routing: FrontendRoutingOption;
  uiAddon: FrontendUiAddon;
  stateManagement: FrontendStateOption;
  dataFetching: FrontendDataFetchingOption;
  testing: FrontendTestingOption;
  baselineSource: FrontendBaselineSource;
}

export interface TemplateOptions {
  template: string;
  stack?: SupportedStack;
  projectDescription?: string;
  appName?: string;
  databases?: BackendDatabase[];
  securityPreset?: BackendSecurityPreset;
  logging?: BackendLoggingOption;
  monitoring?: BackendMonitoringOption;
  testing?: BackendTestingOption;
  apiStyle?: "rest";
  styling?: FrontendStylingOption;
  routing?: FrontendRoutingOption;
  uiAddon?: FrontendUiAddon;
  stateManagement?: FrontendStateOption;
  dataFetching?: FrontendDataFetchingOption;
  baselineSource?: FrontendBaselineSource;
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
