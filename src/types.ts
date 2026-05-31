export type AppType = "backend" | "frontend" | "ai-ml" | "dsa-specific";

export type SupportedStack = string;

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

export type BackendLoggingOption = "console" | "morgan" | "pino";

export type BackendMonitoringOption =
  | "none"
  | "health-only"
  | "prometheus-ready";

export type BackendTestingOption = "jest" | "jest-supertest";

export interface BackendGenerationConfig {
  template: "Express API";
  stack: "node-ts-express";
  projectDescription: string;
  appName: string;
  databases: BackendDatabase[];
  securityPreset: BackendSecurityPreset;
  logging: BackendLoggingOption;
  monitoring: BackendMonitoringOption;
  testing: BackendTestingOption;
  apiStyle: "rest";
}

export interface ProjectConfig {
  appType: AppType;
  framework: string;
  stack: SupportedStack;
  projectName: string;
  projectPath: string;
  options?: BackendGenerationConfig;
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
