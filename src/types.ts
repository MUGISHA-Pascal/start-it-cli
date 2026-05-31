export type AppType = "backend" | "frontend" | "ai-ml" | "dsa-specific";

export type SupportedStack = string;
export type BackendStack = "node-ts-express" | "nestjs" | "python-fastapi";

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
