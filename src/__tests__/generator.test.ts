import { ProjectGenerator } from "../generator";
import { ProjectConfig } from "../types";
import fs from "fs-extra";
import path from "path";

describe("ProjectGenerator", () => {
  const testDir = path.join(__dirname, "../../test-output");

  beforeEach(async () => {
    if (fs.existsSync(testDir)) {
      await fs.remove(testDir);
    }
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    if (fs.existsSync(testDir)) {
      await fs.remove(testDir);
    }
  });

  test("should create a Go Basic CLI project", async () => {
    const config: ProjectConfig = {
      appType: "backend",
      framework: "Go",
      stack: "go-basic-cli",
      projectName: "test-go-app",
      projectPath: testDir,
      options: { template: "Basic CLI" },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate();

    const projectPath = path.join(testDir, "test-go-app");
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "main.go"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "go.mod"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "README.md"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, ".cursorrules"))).toBe(true);
    const cursorRules = await fs.readFile(path.join(projectPath, ".cursorrules"), "utf-8");
    expect(cursorRules).toContain("🤖 AI Agent Scaffolding Guidelines");
    expect(cursorRules).toContain("🐹 Go Guidelines");

    expect(fs.existsSync(path.join(projectPath, "docs/AGENTS.md"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "docs/instructions.md"))).toBe(true);
    const docsAgents = await fs.readFile(path.join(projectPath, "docs/AGENTS.md"), "utf-8");
    expect(docsAgents).toContain("🤖 AI Agent Project Guidelines");
    expect(docsAgents).toContain("Welcome, AI Agent!");
  });

  test("should create a Node.js Express API project", async () => {
    const config: ProjectConfig = {
      appType: "backend",
      framework: "Node.js",
      stack: "node-ts-express",
      projectName: "test-express-app",
      projectPath: testDir,
      options: {
        template: "Express API",
        stack: "node-ts-express",
        projectDescription: "A production-ready API",
        appName: "test-express-app",
        databases: ["postgresql", "redis"],
        securityPreset: "bcrypt-jwt",
        logging: "pino",
        monitoring: "prometheus-ready",
        testing: "jest-supertest",
        apiStyle: "rest",
      },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate();

    const projectPath = path.join(testDir, "test-express-app");
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "package.json"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/app.ts"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/server.ts"))).toBe(true);
    expect(
      fs.existsSync(path.join(projectPath, "src/routes/v1/exampleRoutes.ts"))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(projectPath, "src/controllers/exampleController.ts"))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(projectPath, "src/services/exampleService.ts"))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(projectPath, "src/middleware/errorHandler.ts"))
    ).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/config/database.ts"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, ".env.example"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "jest.config.js"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, ".eslintrc.cjs"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/routes/metrics.ts"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "tsconfig.json"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, ".cursorrules"))).toBe(true);
    const cursorRules = await fs.readFile(path.join(projectPath, ".cursorrules"), "utf-8");
    expect(cursorRules).toContain("🟢 Node.js & TypeScript Guidelines");

    const appFile = await fs.readFile(
      path.join(projectPath, "src/app.ts"),
      "utf-8"
    );
    expect(appFile).toContain("app.use(\"/api\", apiRouter)");
    expect(appFile).toContain("errorHandler");

    const packageJson = await fs.readFile(
      path.join(projectPath, "package.json"),
      "utf-8"
    );
    expect(packageJson).toContain("\"lint\": \"eslint . --ext .ts\"");
    expect(packageJson).toContain("\"supertest\"");
    expect(packageJson).toContain("\"pg\"");
    expect(packageJson).toContain("\"redis\"");
    expect(packageJson).toContain("\"pino\"");
    expect(packageJson).toContain("\"prom-client\"");

    const envExample = await fs.readFile(
      path.join(projectPath, ".env.example"),
      "utf-8"
    );
    expect(envExample).toContain("POSTGRES_URL=");
    expect(envExample).toContain("REDIS_URL=");
    expect(envExample).toContain("JWT_SECRET=");

    expect(fs.existsSync(path.join(projectPath, "docs/AGENTS.md"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "docs/instructions.md"))).toBe(true);
    const docsInstructions = await fs.readFile(path.join(projectPath, "docs/instructions.md"), "utf-8");
    expect(docsInstructions).toContain("Developer Setup & Playbook");
    expect(docsInstructions).toContain("Node.js");
  });

  test("should create a NestJS API project", async () => {
    const config: ProjectConfig = {
      appType: "backend",
      framework: "Node.js",
      stack: "nestjs",
      projectName: "test-nest-app",
      projectPath: testDir,
      options: {
        template: "NestJS API",
        stack: "nestjs",
        projectDescription: "Production baseline SaaS platform API",
        appName: "test-nest-app",
        databases: ["mongodb", "redis"],
        securityPreset: "argon2-jwt",
        logging: "pino",
        monitoring: "prometheus-ready",
        testing: "jest-supertest",
        apiStyle: "rest",
      },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate();

    const projectPath = path.join(testDir, "test-nest-app");
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "package.json"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "nest-cli.json"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/main.ts"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/app.module.ts"))).toBe(true);
    expect(
      fs.existsSync(path.join(projectPath, "src/example/example.module.ts"))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(projectPath, "src/common/security/security.service.ts"))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(projectPath, "src/metrics/metrics.controller.ts"))
    ).toBe(true);

    const packageJson = await fs.readFile(
      path.join(projectPath, "package.json"),
      "utf-8"
    );
    expect(packageJson).toContain("\"@nestjs/common\"");
    expect(packageJson).toContain("\"nestjs-pino\"");
    expect(packageJson).toContain("\"mongodb\"");
    expect(packageJson).toContain("\"redis\"");
    expect(packageJson).toContain("\"argon2\"");
    expect(packageJson).toContain("\"@nestjs/jwt\"");
    expect(packageJson).toContain("\"prom-client\"");

    const appModule = await fs.readFile(
      path.join(projectPath, "src/app.module.ts"),
      "utf-8"
    );
    expect(appModule).toContain("MetricsModule");
    expect(appModule).toContain("LoggerModule.forRoot");

    const envExample = await fs.readFile(
      path.join(projectPath, ".env.example"),
      "utf-8"
    );
    expect(envExample).toContain("MONGODB_URL=");
    expect(envExample).toContain("REDIS_URL=");
    expect(envExample).toContain("JWT_SECRET=");
  });

  test("should create a React Vite frontend project", async () => {
    const config: ProjectConfig = {
      appType: "frontend",
      framework: "Frontend",
      stack: "react-vite",
      projectName: "test-react-vite-app",
      projectPath: testDir,
      options: {
        template: "React + Vite",
        stack: "react-vite",
        projectDescription: "MVP Content platform API",
        appName: "test-react-vite-app",
        styling: "tailwind",
        routing: "react-router",
        uiAddon: "shadcn-ui",
        stateManagement: "zustand",
        dataFetching: "tanstack-query",
        testing: "vitest-rtl",
        baselineSource: "local",
      },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate();

    const projectPath = path.join(testDir, "test-react-vite-app");
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "package.json"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/main.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/routes.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/lib/queryClient.ts"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/lib/store.ts"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/components/button.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "tailwind.config.js"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "vitest.config.ts"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "components.json"))).toBe(true);

    const packageJson = await fs.readFile(
      path.join(projectPath, "package.json"),
      "utf-8"
    );
    expect(packageJson).toContain("\"react-router-dom\"");
    expect(packageJson).toContain("\"@tanstack/react-query\"");
    expect(packageJson).toContain("\"zustand\"");
    expect(packageJson).toContain("\"tailwindcss\"");
    expect(packageJson).toContain("\"@testing-library/react\"");

    const mainFile = await fs.readFile(
      path.join(projectPath, "src/main.tsx"),
      "utf-8"
    );
    expect(mainFile).toContain("RouterProvider");
    expect(mainFile).toContain("QueryClientProvider");

    const cursorRules = await fs.readFile(
      path.join(projectPath, ".cursorrules"),
      "utf-8"
    );
    expect(cursorRules).toContain("Frontend");
  });

  test("should create a Python FastAPI project", async () => {
    const config: ProjectConfig = {
      appType: "backend",
      framework: "Python",
      stack: "python-fastapi",
      projectName: "test-fastapi-app",
      projectPath: testDir,
      options: {
        template: "FastAPI Service",
        stack: "python-fastapi",
        projectDescription: "Production baseline Internal operations service",
        appName: "test-fastapi-app",
        databases: ["postgresql", "duckdb"],
        securityPreset: "argon2-jwt",
        logging: "structlog",
        monitoring: "prometheus-ready",
        testing: "pytest-httpx",
        apiStyle: "rest",
      },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate();

    const projectPath = path.join(testDir, "test-fastapi-app");
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "app/main.py"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "requirements.txt"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "app/core/settings.py"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "app/core/security.py"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "app/db/config.py"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "app/metrics.py"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "tests/test_health.py"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, ".cursorrules"))).toBe(true);
    const cursorRules = await fs.readFile(path.join(projectPath, ".cursorrules"), "utf-8");
    expect(cursorRules).toContain("🐍 Python & PEP 8 Guidelines");

    const requirements = await fs.readFile(
      path.join(projectPath, "requirements.txt"),
      "utf-8"
    );
    expect(requirements).toContain("fastapi==");
    expect(requirements).toContain("structlog==");
    expect(requirements).toContain("psycopg[binary]==");
    expect(requirements).toContain("duckdb==");
    expect(requirements).toContain("python-jose[cryptography]==");
    expect(requirements).toContain("prometheus-client==");

    const envExample = await fs.readFile(
      path.join(projectPath, ".env.example"),
      "utf-8"
    );
    expect(envExample).toContain("POSTGRES_URL=");
    expect(envExample).toContain("DUCKDB_PATH=");
    expect(envExample).toContain("JWT_SECRET=");

    expect(fs.existsSync(path.join(projectPath, "docs/AGENTS.md"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "docs/instructions.md"))).toBe(true);
    const docsAgents = await fs.readFile(path.join(projectPath, "docs/AGENTS.md"), "utf-8");
    expect(docsAgents).toContain("AI Agent Project Guidelines");
  });

  test("should throw error if directory already exists", async () => {
    const config: ProjectConfig = {
      appType: "backend",
      framework: "Go",
      stack: "go-basic-cli",
      projectName: "test-go-app",
      projectPath: testDir,
      options: { template: "Basic CLI" },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate();

    const generator2 = new ProjectGenerator(config);
    await expect(generator2.generate()).rejects.toThrow(
      'Directory "test-go-app" already exists'
    );
  });

  test("should create project with valid file contents", async () => {
    const config: ProjectConfig = {
      appType: "backend",
      framework: "Go",
      stack: "go-web-api",
      projectName: "test-go-web",
      projectPath: testDir,
      options: { template: "Web API" },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate();

    const projectPath = path.join(testDir, "test-go-web");
    const mainGoPath = path.join(projectPath, "main.go");
    const mainGoContent = await fs.readFile(mainGoPath, "utf-8");

    expect(mainGoContent).toContain("package main");
    expect(mainGoContent).toContain("github.com/gin-gonic/gin");
    expect(mainGoContent).toContain("router.Run");
  });
});
