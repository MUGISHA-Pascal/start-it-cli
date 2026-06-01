import {
  BackendDatabase,
  BackendGenerationConfig,
  ProjectConfig,
  TemplateConfig,
  TemplateOptions,
} from "../types";

const DATABASE_LABELS: Record<BackendDatabase, string> = {
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  mongodb: "MongoDB",
  redis: "Redis",
  duckdb: "DuckDB",
};

export function buildNodeTemplate(config: ProjectConfig): TemplateConfig {
  const options = getBackendOptions(config);
  const packageJson = buildPackageJson(config.projectName, options);

  return {
    name: options.template,
    description: "Configurable Express.js backend scaffold",
    files: [
      {
        path: "package.json",
        content: packageJson,
      },
      {
        path: "tsconfig.json",
        content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node", "jest"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
`,
      },
      {
        path: "jest.config.js",
        content: `module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  clearMocks: true
};
`,
      },
      {
        path: ".eslintrc.cjs",
        content: `module.exports = {
  root: true,
  env: {
    es2020: true,
    node: true,
    jest: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: ["dist"],
  rules: {
    "@typescript-eslint/no-misused-promises": "off"
  }
};
`,
      },
      {
        path: ".prettierrc",
        content: `{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all"
}
`,
      },
      {
        path: ".env.example",
        content: buildEnvExample(options),
      },
      {
        path: "src/app.ts",
        content: buildAppFile(options),
      },
      {
        path: "src/server.ts",
        content: `import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";

const app = createApp();

app.listen(env.port, () => {
  logger.info(\`\${env.appName} listening on port \${env.port}\`);
});
`,
      },
      {
        path: "src/config/env.ts",
        content: buildEnvFile(options),
      },
      {
        path: "src/config/database.ts",
        content: buildDatabaseConfig(options),
      },
      {
        path: "src/controllers/healthController.ts",
        content: `import { Request, Response } from "express";
import { env } from "../config/env";

export function getHealth(_req: Request, res: Response) {
  res.status(200).json({
    status: "ok",
    service: env.appName,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
}
`,
      },
      {
        path: "src/controllers/exampleController.ts",
        content: `import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../lib/httpError";
import { databaseService } from "../services/databaseService";
import { exampleService } from "../services/exampleService";
import { securityService } from "../services/securityService";

const echoSchema = z.object({
  message: z.string().min(1)
});

export async function listExamples(_req: Request, res: Response) {
  res.status(200).json({
    data: {
      service: exampleService.describe(),
      databases: databaseService.list(),
      security: securityService.describe()
    }
  });
}

export function echoMessage(req: Request, res: Response, next: NextFunction) {
  const result = echoSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  res.status(200).json({
    data: exampleService.echo(result.data.message)
  });
}
`,
      },
      {
        path: "src/routes/index.ts",
        content: buildRoutesIndex(options),
      },
      {
        path: "src/routes/v1/exampleRoutes.ts",
        content: `import { Router } from "express";
import { echoMessage, listExamples } from "../../controllers/exampleController";

export const exampleRouter = Router();

exampleRouter.get("/", listExamples);
exampleRouter.post("/echo", echoMessage);
`,
      },
      {
        path: "src/services/exampleService.ts",
        content: `export const exampleService = {
  describe() {
    return {
      apiStyle: "${options.apiStyle.toUpperCase()}",
      logging: "${options.logging}",
      monitoring: "${options.monitoring}"
    };
  },

  echo(message: string) {
    return {
      message,
      receivedAt: new Date().toISOString()
    };
  }
};
`,
      },
      {
        path: "src/services/databaseService.ts",
        content: `import { configuredDatabases } from "../config/database";

export const databaseService = {
  list() {
    return configuredDatabases;
  }
};
`,
      },
      {
        path: "src/services/securityService.ts",
        content: buildSecurityService(options),
      },
      {
        path: "src/middleware/errorHandler.ts",
        content: `import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../lib/httpError";
import { logger } from "../lib/logger";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        details: error.details ?? null
      }
    });
    return;
  }

  logger.error(error.message, error);

  res.status(500).json({
    error: {
      message: env.nodeEnv === "production" ? "Internal server error" : error.message
    }
  });
}
`,
      },
      {
        path: "src/middleware/notFound.ts",
        content: `import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/httpError";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, \`Route not found: \${req.method} \${req.originalUrl}\`));
}
`,
      },
      {
        path: "src/lib/httpError.ts",
        content: `export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}
`,
      },
      {
        path: "src/lib/logger.ts",
        content: buildLoggerFile(options),
      },
      ...buildMetricsFiles(options),
      ...buildTestFiles(options),
      {
        path: "README.md",
        content: buildReadme(config.projectName, options),
      },
      {
        path: ".gitignore",
        content: `node_modules/
dist/
.env
.env.local
npm-debug.log
.DS_Store
.vscode/
.idea/
*.swp
coverage/
`,
      },
    ],
  };
}

function getBackendOptions(config: ProjectConfig): BackendGenerationConfig {
  if (config.options?.template === "Express API") {
    return {
      template: "Express API",
      stack: "node-ts-express",
      projectDescription: config.options.projectDescription || "Node.js backend service",
      appName: config.options.appName || config.projectName,
      databases: config.options.databases || [],
      securityPreset: config.options.securityPreset || "none",
      logging: normalizeNodeLogging(config.options.logging),
      monitoring: config.options.monitoring || "health-only",
      testing: normalizeNodeTesting(config.options.testing),
      apiStyle: config.options.apiStyle || "rest",
    };
  }

  return {
    template: "Express API",
    stack: "node-ts-express",
    projectDescription: "Node.js backend service",
    appName: config.projectName,
    databases: [],
    securityPreset: "none",
    logging: "console",
    monitoring: "health-only",
    testing: "jest-supertest",
    apiStyle: "rest",
  };
}

function normalizeNodeTesting(
  testing: TemplateOptions["testing"] | undefined
): BackendGenerationConfig["testing"] {
  return testing === "jest" || testing === "jest-supertest"
    ? testing
    : "jest-supertest";
}

function normalizeNodeLogging(
  logging: TemplateOptions["logging"] | undefined
): BackendGenerationConfig["logging"] {
  return logging === "console" || logging === "morgan" || logging === "pino"
    ? logging
    : "console";
}

function buildPackageJson(
  projectName: string,
  options: BackendGenerationConfig
): string {
  const dependencies: Record<string, string> = {
    cors: "^2.8.5",
    dotenv: "^16.4.5",
    express: "^4.18.2",
    helmet: "^7.1.0",
    zod: "^3.23.8",
  };

  if (options.logging === "morgan") {
    dependencies.morgan = "^1.10.0";
  }

  if (options.logging === "pino") {
    dependencies.pino = "^9.3.2";
    dependencies["pino-http"] = "^10.3.0";
  }

  if (options.securityPreset === "bcrypt" || options.securityPreset === "bcrypt-jwt") {
    dependencies.bcrypt = "^5.1.1";
  }

  if (options.securityPreset === "argon2" || options.securityPreset === "argon2-jwt") {
    dependencies.argon2 = "^0.40.3";
  }

  if (options.securityPreset === "bcrypt-jwt" || options.securityPreset === "argon2-jwt") {
    dependencies.jsonwebtoken = "^9.0.2";
  }

  if (options.monitoring === "prometheus-ready") {
    dependencies["prom-client"] = "^15.1.3";
  }

  if (options.databases.includes("postgresql")) {
    dependencies.pg = "^8.12.0";
  }

  if (options.databases.includes("mysql")) {
    dependencies.mysql2 = "^3.11.0";
  }

  if (options.databases.includes("mongodb")) {
    dependencies.mongodb = "^6.8.0";
  }

  if (options.databases.includes("redis")) {
    dependencies.redis = "^4.6.15";
  }

  if (options.databases.includes("duckdb")) {
    dependencies.duckdb = "^1.8.0";
  }

  const devDependencies: Record<string, string> = {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.12.12",
    "@typescript-eslint/eslint-plugin": "^7.13.1",
    "@typescript-eslint/parser": "^7.13.1",
    eslint: "^8.57.0",
    jest: "^29.7.0",
    prettier: "^3.3.2",
    "ts-jest": "^29.1.4",
    "ts-node": "^10.9.2",
    typescript: "^5.5.2",
  };

  if (options.logging === "morgan") {
    devDependencies["@types/morgan"] = "^1.9.9";
  }

  if (options.testing === "jest-supertest") {
    devDependencies.supertest = "^7.0.0";
    devDependencies["@types/supertest"] = "^6.0.2";
  }

  const pkg = {
    name: projectName,
    version: "1.0.0",
    description: options.projectDescription,
    main: "dist/server.js",
    scripts: {
      build: "tsc -p tsconfig.json",
      dev: "ts-node src/server.ts",
      start: "node dist/server.js",
      test: "jest --runInBand",
      "test:watch": "jest --watch",
      lint: "eslint . --ext .ts",
      format: "prettier --write .",
    },
    keywords: ["backend", "express", "typescript", options.apiStyle],
    author: "",
    license: "MIT",
    dependencies,
    devDependencies,
  };

  return `${JSON.stringify(pkg, null, 2)}\n`;
}

function buildEnvExample(options: BackendGenerationConfig): string {
  const lines = [
    "NODE_ENV=development",
    "PORT=3000",
    `APP_NAME=${options.appName}`,
    "ALLOWED_ORIGINS=http://localhost:3000",
  ];

  if (options.databases.includes("postgresql")) {
    lines.push("POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/app");
  }
  if (options.databases.includes("mysql")) {
    lines.push("MYSQL_URL=mysql://root:password@localhost:3306/app");
  }
  if (options.databases.includes("mongodb")) {
    lines.push("MONGODB_URL=mongodb://localhost:27017/app");
  }
  if (options.databases.includes("redis")) {
    lines.push("REDIS_URL=redis://localhost:6379");
  }
  if (options.databases.includes("duckdb")) {
    lines.push("DUCKDB_PATH=./data/app.duckdb");
  }
  if (options.securityPreset === "bcrypt-jwt" || options.securityPreset === "argon2-jwt") {
    lines.push("JWT_SECRET=change-me");
  }

  return `${lines.join("\n")}\n`;
}

function buildEnvFile(options: BackendGenerationConfig): string {
  const schemaEntries = [
    '  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),',
    '  PORT: z.coerce.number().int().positive().default(3000),',
    `  APP_NAME: z.string().min(1).default("${options.appName}"),`,
    '  ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),',
  ];

  if (options.databases.includes("postgresql")) {
    schemaEntries.push('  POSTGRES_URL: z.string().optional(),');
  }
  if (options.databases.includes("mysql")) {
    schemaEntries.push('  MYSQL_URL: z.string().optional(),');
  }
  if (options.databases.includes("mongodb")) {
    schemaEntries.push('  MONGODB_URL: z.string().optional(),');
  }
  if (options.databases.includes("redis")) {
    schemaEntries.push('  REDIS_URL: z.string().optional(),');
  }
  if (options.databases.includes("duckdb")) {
    schemaEntries.push('  DUCKDB_PATH: z.string().optional(),');
  }
  if (options.securityPreset === "bcrypt-jwt" || options.securityPreset === "argon2-jwt") {
    schemaEntries.push('  JWT_SECRET: z.string().optional(),');
  }

  return `import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
${schemaEntries.join("\n")}
});

const parsed = envSchema.parse(process.env);

export const env = {
  nodeEnv: parsed.NODE_ENV,
  port: parsed.PORT,
  appName: parsed.APP_NAME,
  allowedOrigins: parsed.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()),
  raw: parsed
};
`;
}

function buildDatabaseConfig(options: BackendGenerationConfig): string {
  const databases = options.databases.map((database) => ({
    key: database,
    name: DATABASE_LABELS[database],
  }));

  return `export const configuredDatabases = ${JSON.stringify(databases, null, 2)} as const;

export function describeDatabaseSetup() {
  if (configuredDatabases.length === 0) {
    return "No database selected";
  }

  return configuredDatabases.map((database) => database.name).join(", ");
}
`;
}

function buildAppFile(options: BackendGenerationConfig): string {
  const loggerSetup =
    options.logging === "morgan"
      ? '  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));\n'
      : options.logging === "pino"
        ? "  app.use(httpLogger);\n"
        : "";

  const metricsImport =
    options.monitoring === "prometheus-ready"
      ? 'import { metricsRouter } from "./routes/metrics";\n'
      : "";
  const metricsUse =
    options.monitoring === "prometheus-ready"
      ? '  app.use("/metrics", metricsRouter);\n'
      : "";
  const morganImport =
    options.logging === "morgan" ? 'import morgan from "morgan";\n' : "";
  const pinoImport =
    options.logging === "pino" ? 'import { httpLogger } from "./lib/logger";\n' : "";

  return `import cors from "cors";
import express from "express";
import helmet from "helmet";
${morganImport}${pinoImport}import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFound";
import { apiRouter } from "./routes";
${metricsImport}
export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.allowedOrigins
    })
  );
  app.use(express.json());
${loggerSetup}  app.get("/", (_req, res) => {
    res.json({
      service: env.appName,
      status: "ok",
      stack: "node-ts-express",
      apiStyle: "${options.apiStyle}"
    });
  });

  app.use("/api", apiRouter);
${metricsUse}  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
`;
}

function buildRoutesIndex(options: BackendGenerationConfig): string {
  const metricsStatusRoute =
    options.monitoring === "prometheus-ready"
      ? `
apiRouter.get("/monitoring", (_req, res) => {
  res.status(200).json({ status: "metrics-enabled" });
});
`
      : "";

  return `import { Router } from "express";
import { getHealth } from "../controllers/healthController";
import { exampleRouter } from "./v1/exampleRoutes";

export const apiRouter = Router();

apiRouter.get("/health", getHealth);
${metricsStatusRoute}apiRouter.use("/v1/examples", exampleRouter);
`;
}

function buildSecurityService(options: BackendGenerationConfig): string {
  const description = securityDescription(options.securityPreset);
  const imports: string[] = [];
  const body: string[] = [];

  if (options.securityPreset === "bcrypt" || options.securityPreset === "bcrypt-jwt") {
    imports.push('import bcrypt from "bcrypt";');
    body.push(`  async hashPassword(value: string) {
    return bcrypt.hash(value, 12);
  },`);
  }

  if (options.securityPreset === "argon2" || options.securityPreset === "argon2-jwt") {
    imports.push('import argon2 from "argon2";');
    body.push(`  async hashPassword(value: string) {
    return argon2.hash(value);
  },`);
  }

  if (options.securityPreset === "none") {
    body.push(`  async hashPassword(value: string) {
    return value;
  },`);
  }

  if (options.securityPreset === "bcrypt-jwt" || options.securityPreset === "argon2-jwt") {
    imports.push('import jwt from "jsonwebtoken";');
    body.push(`  issueToken(subject: string) {
    return jwt.sign({ sub: subject }, process.env.JWT_SECRET || "change-me", {
      expiresIn: "1h"
    });
  },`);
  }

  body.push(`  describe() {
    return "${description}";
  }`);

  return `${imports.join("\n")}

export const securityService = {
${body.join("\n")}
};
`;
}

function buildLoggerFile(options: BackendGenerationConfig): string {
  if (options.logging === "pino") {
    return `import pino from "pino";
import pinoHttp from "pino-http";

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug"
});

export const httpLogger = pinoHttp({ logger });
`;
  }

  return `export const logger = {
  info(message: string, meta?: unknown) {
    console.log(JSON.stringify({ level: "info", message, meta: meta ?? null }));
  },

  error(message: string, meta?: unknown) {
    console.error(JSON.stringify({ level: "error", message, meta: meta ?? null }));
  }
};
`;
}

function buildMetricsFiles(options: BackendGenerationConfig) {
  if (options.monitoring !== "prometheus-ready") {
    return [];
  }

  return [
    {
      path: "src/routes/metrics.ts",
      content: `import { Router } from "express";
import client from "prom-client";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const metricsRouter = Router();

metricsRouter.get("/", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
`,
    },
  ];
}

function buildTestFiles(options: BackendGenerationConfig) {
  if (options.testing === "jest-supertest") {
    return [
      {
        path: "src/__tests__/health.test.ts",
        content: `import request from "supertest";
import { createApp } from "../app";

describe("Express API template", () => {
  const app = createApp();

  it("serves the health endpoint", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
`,
      },
    ];
  }

  return [
    {
      path: "src/__tests__/exampleService.test.ts",
      content: `import { exampleService } from "../services/exampleService";

describe("exampleService", () => {
  it("echoes a message", () => {
    const result = exampleService.echo("hello");

    expect(result.message).toBe("hello");
  });
});
`,
    },
  ];
}

function buildReadme(
  projectName: string,
  options: BackendGenerationConfig
): string {
  const databaseList =
    options.databases.length > 0
      ? options.databases.map((database) => `- ${DATABASE_LABELS[database]}`).join("\n")
      : "- None selected";

  return `# ${projectName}

${options.projectDescription}

## Scaffold Summary

- App type: Backend
- Stack: Node.js + TypeScript + Express
- API style: ${options.apiStyle.toUpperCase()}
- Logging: ${options.logging}
- Monitoring: ${options.monitoring}
- Security preset: ${securityDescription(options.securityPreset)}

## Selected Databases

${databaseList}

## Setup

\`\`\`bash
npm install
cp .env.example .env
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

## Quality Checks

\`\`\`bash
npm run lint
npm test
npm run build
\`\`\`

## API Endpoints

- \`GET /api/health\`
- \`GET /api/v1/examples\`
- \`POST /api/v1/examples/echo\`
`;
}

function securityDescription(preset: BackendGenerationConfig["securityPreset"]): string {
  switch (preset) {
    case "bcrypt":
      return "bcrypt password hashing";
    case "argon2":
      return "argon2 password hashing";
    case "bcrypt-jwt":
      return "bcrypt password hashing + JWT issuance";
    case "argon2-jwt":
      return "argon2 password hashing + JWT issuance";
    default:
      return "No password handling preset selected";
  }
}
