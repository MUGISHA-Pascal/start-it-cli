import { TemplateConfig } from "../types";

export const nodeTemplates: Record<string, TemplateConfig> = {
  "Express API": {
    name: "Express API",
    description: "A production-ready Express.js backend with TypeScript",
    files: [
      {
        path: "package.json",
        content: `{
  "name": "express-api",
  "version": "1.0.0",
  "description": "Layered Express.js backend with TypeScript",
  "main": "dist/server.js",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "dev": "ts-node src/server.ts",
    "start": "node dist/server.js",
    "test": "jest --runInBand",
    "test:watch": "jest --watch",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write ."
  },
  "keywords": ["express", "api", "typescript", "backend"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.12",
    "@types/morgan": "^1.9.9",
    "@types/node": "^20.12.12",
    "@types/supertest": "^6.0.2",
    "@typescript-eslint/eslint-plugin": "^7.13.1",
    "@typescript-eslint/parser": "^7.13.1",
    "eslint": "^8.57.0",
    "jest": "^29.7.0",
    "prettier": "^3.3.2",
    "supertest": "^7.0.0",
    "ts-jest": "^29.1.4",
    "ts-node": "^10.9.2",
    "typescript": "^5.5.2"
  }
}
`,
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
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  clearMocks: true,
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
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['dist'],
  rules: {
    '@typescript-eslint/no-misused-promises': 'off',
  },
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
        content: `NODE_ENV=development
PORT=3000
APP_NAME=express-api
ALLOWED_ORIGINS=http://localhost:3000
`,
      },
      {
        path: "src/app.ts",
        content: `import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFound";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.allowedOrigins,
    })
  );
  app.use(express.json());
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

  app.get("/", (_req, res) => {
    res.json({
      service: env.appName,
      status: "ok",
      docs: "/api/v1/examples",
    });
  });

  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
`,
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
        content: `import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  APP_NAME: z.string().min(1).default("express-api"),
  ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
});

const parsed = envSchema.parse(process.env);

export const env = {
  nodeEnv: parsed.NODE_ENV,
  port: parsed.PORT,
  appName: parsed.APP_NAME,
  allowedOrigins: parsed.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()),
};
`,
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
    timestamp: new Date().toISOString(),
  });
}
`,
      },
      {
        path: "src/controllers/exampleController.ts",
        content: `import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../lib/httpError";
import { exampleService } from "../services/exampleService";

const echoSchema = z.object({
  message: z.string().min(1),
});

export function listExamples(_req: Request, res: Response) {
  res.status(200).json({
    data: exampleService.listCapabilities(),
  });
}

export function getExampleByName(req: Request, res: Response, next: NextFunction) {
  const item = exampleService.findCapability(req.params.name);

  if (!item) {
    next(new AppError(404, "Capability not found"));
    return;
  }

  res.status(200).json({
    data: item,
  });
}

export function echoMessage(req: Request, res: Response, next: NextFunction) {
  const result = echoSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  res.status(200).json({
    data: exampleService.echo(result.data.message),
  });
}
`,
      },
      {
        path: "src/routes/index.ts",
        content: `import { Router } from "express";
import { getHealth } from "../controllers/healthController";
import { exampleRouter } from "./v1/exampleRoutes";

export const apiRouter = Router();

apiRouter.get("/health", getHealth);
apiRouter.use("/v1/examples", exampleRouter);
`,
      },
      {
        path: "src/routes/v1/exampleRoutes.ts",
        content: `import { Router } from "express";
import {
  echoMessage,
  getExampleByName,
  listExamples,
} from "../../controllers/exampleController";

export const exampleRouter = Router();

exampleRouter.get("/", listExamples);
exampleRouter.get("/:name", getExampleByName);
exampleRouter.post("/echo", echoMessage);
`,
      },
      {
        path: "src/services/exampleService.ts",
        content: `type Capability = {
  name: string;
  description: string;
};

const capabilities: Capability[] = [
  {
    name: "health",
    description: "Health monitoring endpoint",
  },
  {
    name: "validation",
    description: "Request validation with zod",
  },
  {
    name: "errors",
    description: "Centralized error handling middleware",
  },
];

export const exampleService = {
  listCapabilities(): Capability[] {
    return capabilities;
  },

  findCapability(name: string): Capability | undefined {
    return capabilities.find(
      (capability) => capability.name.toLowerCase() === name.toLowerCase()
    );
  },

  echo(message: string) {
    return {
      message,
      receivedAt: new Date().toISOString(),
    };
  },
};
`,
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
        details: error.details ?? null,
      },
    });
    return;
  }

  logger.error(error.message, error);

  res.status(500).json({
    error: {
      message:
        env.nodeEnv === "production" ? "Internal server error" : error.message,
    },
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
        content: `export const logger = {
  info(message: string, meta?: unknown) {
    console.log(JSON.stringify({ level: "info", message, meta: meta ?? null }));
  },

  error(message: string, meta?: unknown) {
    console.error(JSON.stringify({ level: "error", message, meta: meta ?? null }));
  },
};
`,
      },
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

  it("validates echo payloads", async () => {
    const response = await request(app).post("/api/v1/examples/echo").send({});

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe("Invalid request payload");
  });
});
`,
      },
      {
        path: "README.md",
        content: `# Express API Backend

Layered Express.js backend scaffolded with TypeScript.

## Included

- Express application split into \`app\` and \`server\`
- API routes, controllers, and services
- Environment parsing with \`dotenv\` and \`zod\`
- Centralized 404 and error handling middleware
- Logging, security headers, and CORS setup
- Jest + Supertest test starter
- ESLint and Prettier configuration

## Project Structure

\`\`\`
src/
  app.ts
  server.ts
  config/
  controllers/
  lib/
  middleware/
  routes/
  services/
  __tests__/
\`\`\`

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
- \`GET /api/v1/examples/:name\`
- \`POST /api/v1/examples/echo\`
`,
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
  },
};
