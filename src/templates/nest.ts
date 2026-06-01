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

export function buildNestTemplate(config: ProjectConfig): TemplateConfig {
  const options = getBackendOptions(config);

  return {
    name: options.template,
    description: "Configurable NestJS backend scaffold",
    files: [
      {
        path: "package.json",
        content: buildPackageJson(config.projectName, options),
      },
      {
        path: "tsconfig.json",
        content: `{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "strict": true,
    "skipLibCheck": true,
    "strictPropertyInitialization": false
  }
}
`,
      },
      {
        path: "tsconfig.build.json",
        content: `{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
`,
      },
      {
        path: "nest-cli.json",
        content: `{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src"
}
`,
      },
      {
        path: "jest.config.js",
        content: `module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\\\.spec\\\\.ts$",
  transform: {
    "^.+\\\\.(t|j)s$": "ts-jest"
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "node"
};
`,
      },
      {
        path: ".eslintrc.cjs",
        content: `module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: [".eslintrc.cjs", "dist"]
};
`,
      },
      {
        path: ".prettierrc",
        content: `{
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true
}
`,
      },
      {
        path: ".env.example",
        content: buildEnvExample(options),
      },
      {
        path: "src/main.ts",
        content: buildMainFile(options),
      },
      {
        path: "src/app.module.ts",
        content: buildAppModule(options),
      },
      {
        path: "src/config/app.config.ts",
        content: `export default () => ({
  appName: process.env.APP_NAME || '${options.appName}',
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim()),
});
`,
      },
      {
        path: "src/config/database.config.ts",
        content: buildDatabaseConfig(options),
      },
      {
        path: "src/common/logger/app-logger.service.ts",
        content: buildLoggerService(options),
      },
      {
        path: "src/common/security/security.service.ts",
        content: buildSecurityService(options),
      },
      {
        path: "src/health/health.module.ts",
        content: `import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
`,
      },
      {
        path: "src/health/health.controller.ts",
        content: `import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { describeDatabaseSetup } from '../config/database.config';

@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: this.configService.get<string>('appName'),
      databases: describeDatabaseSetup(),
      timestamp: new Date().toISOString(),
    };
  }
}
`,
      },
      {
        path: "src/example/example.module.ts",
        content: `import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';
import { SecurityService } from '../common/security/security.service';

@Module({
  controllers: [ExampleController],
  providers: [ExampleService, SecurityService],
})
export class ExampleModule {}
`,
      },
      {
        path: "src/example/example.service.ts",
        content: `import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleService {
  describe() {
    return {
      stack: 'nestjs',
      logging: '${options.logging}',
      monitoring: '${options.monitoring}',
      securityPreset: '${options.securityPreset}',
      databases: ${JSON.stringify(options.databases)},
    };
  }

  echo(message: string) {
    return {
      message,
      receivedAt: new Date().toISOString(),
    };
  }
}
`,
      },
      {
        path: "src/example/dto/echo.dto.ts",
        content: `import { IsString, MinLength } from 'class-validator';

export class EchoDto {
  @IsString()
  @MinLength(1)
  message!: string;
}
`,
      },
      {
        path: "src/example/example.controller.ts",
        content: `import { Body, Controller, Get, Post } from '@nestjs/common';
import { SecurityService } from '../common/security/security.service';
import { EchoDto } from './dto/echo.dto';
import { ExampleService } from './example.service';

@Controller('api/v1/examples')
export class ExampleController {
  constructor(
    private readonly exampleService: ExampleService,
    private readonly securityService: SecurityService,
  ) {}

  @Get()
  getExamples() {
    return {
      data: this.exampleService.describe(),
    };
  }

  @Post('echo')
  async echo(@Body() dto: EchoDto) {
    return {
      data: this.exampleService.echo(dto.message),
      security: this.securityService.describe(),
    };
  }
}
`,
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
coverage/
.DS_Store
.vscode/
.idea/
`,
      },
    ],
  };
}

function getBackendOptions(config: ProjectConfig): BackendGenerationConfig {
  return {
    template: "NestJS API",
    stack: "nestjs",
    projectDescription: config.options?.projectDescription || "NestJS backend service",
    appName: config.options?.appName || config.projectName,
    databases: config.options?.databases || [],
    securityPreset: config.options?.securityPreset || "none",
    logging: normalizeNestLogging(config.options?.logging),
    monitoring: config.options?.monitoring || "health-only",
    testing: normalizeNestTesting(config.options?.testing),
    apiStyle: config.options?.apiStyle || "rest",
  };
}

function normalizeNestTesting(
  testing: TemplateOptions["testing"] | undefined
): BackendGenerationConfig["testing"] {
  return testing === "jest" || testing === "jest-supertest"
    ? testing
    : "jest-supertest";
}

function normalizeNestLogging(
  logging: TemplateOptions["logging"] | undefined
): BackendGenerationConfig["logging"] {
  return logging === "console" || logging === "pino" ? logging : "console";
}

function buildPackageJson(projectName: string, options: BackendGenerationConfig): string {
  const dependencies: Record<string, string> = {
    "@nestjs/common": "^10.4.2",
    "@nestjs/config": "^3.2.3",
    "@nestjs/core": "^10.4.2",
    "@nestjs/platform-express": "^10.4.2",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "reflect-metadata": "^0.2.2",
    rxjs: "^7.8.1",
  };

  if (options.logging === "pino") {
    dependencies["nestjs-pino"] = "^4.1.0";
    dependencies.pino = "^9.3.2";
  }

  if (options.securityPreset === "bcrypt" || options.securityPreset === "bcrypt-jwt") {
    dependencies.bcrypt = "^5.1.1";
  }
  if (options.securityPreset === "argon2" || options.securityPreset === "argon2-jwt") {
    dependencies.argon2 = "^0.40.3";
  }
  if (options.securityPreset === "bcrypt-jwt" || options.securityPreset === "argon2-jwt") {
    dependencies["@nestjs/jwt"] = "^10.2.0";
    dependencies.jsonwebtoken = "^9.0.2";
  }

  if (options.monitoring === "prometheus-ready") {
    dependencies["prom-client"] = "^15.1.3";
  }

  if (options.databases.includes("postgresql")) dependencies.pg = "^8.12.0";
  if (options.databases.includes("mysql")) dependencies.mysql2 = "^3.11.0";
  if (options.databases.includes("mongodb")) dependencies.mongodb = "^6.8.0";
  if (options.databases.includes("redis")) dependencies.redis = "^4.6.15";
  if (options.databases.includes("duckdb")) dependencies.duckdb = "^1.8.0";

  const devDependencies: Record<string, string> = {
    "@nestjs/cli": "^10.4.5",
    "@nestjs/schematics": "^10.1.4",
    "@nestjs/testing": "^10.4.2",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.12.12",
    "@typescript-eslint/eslint-plugin": "^7.13.1",
    "@typescript-eslint/parser": "^7.13.1",
    eslint: "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    jest: "^29.7.0",
    prettier: "^3.3.2",
    "ts-jest": "^29.1.4",
    "ts-loader": "^9.5.1",
    "ts-node": "^10.9.2",
    typescript: "^5.5.2",
  };

  if (options.testing === "jest-supertest") {
    devDependencies.supertest = "^7.0.0";
    devDependencies["@types/supertest"] = "^6.0.2";
  }

  const pkg = {
    name: projectName,
    version: "1.0.0",
    description: options.projectDescription,
    private: true,
    scripts: {
      build: "nest build",
      "start:dev": "nest start --watch",
      start: "node dist/main",
      lint: "eslint \"{src,test}/**/*.ts\" --fix",
      test: "jest",
      format: "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    },
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
  if (options.databases.includes("postgresql")) lines.push("POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/app");
  if (options.databases.includes("mysql")) lines.push("MYSQL_URL=mysql://root:password@localhost:3306/app");
  if (options.databases.includes("mongodb")) lines.push("MONGODB_URL=mongodb://localhost:27017/app");
  if (options.databases.includes("redis")) lines.push("REDIS_URL=redis://localhost:6379");
  if (options.databases.includes("duckdb")) lines.push("DUCKDB_PATH=./data/app.duckdb");
  if (options.securityPreset === "bcrypt-jwt" || options.securityPreset === "argon2-jwt") {
    lines.push("JWT_SECRET=change-me");
  }
  return `${lines.join("\n")}\n`;
}

function buildMainFile(options: BackendGenerationConfig): string {
  const pinoImport = options.logging === "pino" ? "import { Logger } from 'nestjs-pino';\n" : "";
  const pinoUse = options.logging === "pino" ? "  app.useLogger(app.get(Logger));\n" : "";
  return `import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
${pinoImport}import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
${pinoUse}  app.setGlobalPrefix('');
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
`;
}

function buildAppModule(options: BackendGenerationConfig): string {
  const metricsImport =
    options.monitoring === "prometheus-ready"
      ? "import { MetricsModule } from './metrics/metrics.module';\n"
      : "";
  const metricsModule = options.monitoring === "prometheus-ready" ? "    MetricsModule,\n" : "";
  const loggerImport = options.logging === "pino" ? "import { LoggerModule } from 'nestjs-pino';\n" : "";
  const loggerModule =
    options.logging === "pino"
      ? `    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      },
    }),
`
      : "";
  return `import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
${loggerImport}${metricsImport}import appConfig from './config/app.config';
import { ExampleModule } from './example/example.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
${loggerModule}    HealthModule,
    ExampleModule,
${metricsModule}  ],
})
export class AppModule {}
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
    return 'No database selected';
  }

  return configuredDatabases.map((database) => database.name).join(', ');
}
`;
}

function buildLoggerService(options: BackendGenerationConfig): string {
  if (options.logging === "pino") {
    return `import { Injectable, LoggerService } from '@nestjs/common';
import pino from 'pino';

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  });

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error({ trace }, message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }
}
`;
  }

  return `import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLoggerService extends Logger {}
`;
}

function buildSecurityService(options: BackendGenerationConfig): string {
  const imports: string[] = ["import { Injectable } from '@nestjs/common';"];
  const body: string[] = [];

  if (options.securityPreset === "bcrypt" || options.securityPreset === "bcrypt-jwt") {
    imports.push("import bcrypt from 'bcrypt';");
    body.push(`  async hashPassword(value: string) {
    return bcrypt.hash(value, 12);
  }`);
  } else if (options.securityPreset === "argon2" || options.securityPreset === "argon2-jwt") {
    imports.push("import argon2 from 'argon2';");
    body.push(`  async hashPassword(value: string) {
    return argon2.hash(value);
  }`);
  } else {
    body.push(`  async hashPassword(value: string) {
    return value;
  }`);
  }

  if (options.securityPreset === "bcrypt-jwt" || options.securityPreset === "argon2-jwt") {
    imports.push("import jwt from 'jsonwebtoken';");
    body.push(`  issueToken(subject: string) {
    return jwt.sign({ sub: subject }, process.env.JWT_SECRET || 'change-me', {
      expiresIn: '1h',
    });
  }`);
  }

  body.push(`  describe() {
    return '${securityDescription(options.securityPreset)}';
  }`);

  return `${imports.join("\n")}

@Injectable()
export class SecurityService {
${body.join("\n\n")}
}
`;
}

function buildMetricsFiles(options: BackendGenerationConfig) {
  if (options.monitoring !== "prometheus-ready") {
    return [];
  }

  return [
    {
      path: "src/metrics/metrics.module.ts",
      content: `import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';

@Module({
  controllers: [MetricsController],
})
export class MetricsModule {}
`,
    },
    {
      path: "src/metrics/metrics.controller.ts",
      content: `import { Controller, Get, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import client from 'prom-client';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

@Controller('metrics')
export class MetricsController {
  @Get()
  @Header('Content-Type', register.contentType)
  async getMetrics(@Res() response: Response) {
    response.end(await register.metrics());
  }
}
`,
    },
  ];
}

function buildTestFiles(options: BackendGenerationConfig) {
  if (options.testing === "jest-supertest") {
    return [
      {
        path: "src/health/health.controller.spec.ts",
        content: `import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns service status', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      controllers: [HealthController],
    }).compile();

    const controller = moduleRef.get(HealthController);
    const result = controller.getHealth();

    expect(result.status).toBe('ok');
  });
});
`,
      },
    ];
  }

  return [
    {
      path: "src/example/example.service.spec.ts",
      content: `import { ExampleService } from './example.service';

describe('ExampleService', () => {
  it('echoes a message', () => {
    const service = new ExampleService();
    const result = service.echo('hello');

    expect(result.message).toBe('hello');
  });
});
`,
    },
  ];
}

function buildReadme(projectName: string, options: BackendGenerationConfig): string {
  const databases =
    options.databases.length > 0
      ? options.databases.map((database) => `- ${DATABASE_LABELS[database]}`).join("\n")
      : "- None selected";

  return `# ${projectName}

${options.projectDescription}

## Scaffold Summary

- App type: Backend
- Stack: NestJS
- API style: ${options.apiStyle.toUpperCase()}
- Logging: ${options.logging}
- Monitoring: ${options.monitoring}
- Security preset: ${securityDescription(options.securityPreset)}

## Selected Databases

${databases}

## Setup

\`\`\`bash
npm install
cp .env.example .env
\`\`\`

## Development

\`\`\`bash
npm run start:dev
\`\`\`

## Quality Checks

\`\`\`bash
npm run lint
npm test
npm run build
\`\`\`

## API Endpoints

- \`GET /health\`
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
