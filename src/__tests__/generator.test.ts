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

  test("should create a Python FastAPI project", async () => {
    const config: ProjectConfig = {
      appType: "backend",
      framework: "Python",
      stack: "python-fastapi",
      projectName: "test-fastapi-app",
      projectPath: testDir,
      options: { template: "FastAPI" },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate();

    const projectPath = path.join(testDir, "test-fastapi-app");
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "main.py"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "requirements.txt"))).toBe(
      true
    );
    expect(fs.existsSync(path.join(projectPath, ".cursorrules"))).toBe(true);
    const cursorRules = await fs.readFile(path.join(projectPath, ".cursorrules"), "utf-8");
    expect(cursorRules).toContain("🐍 Python & PEP 8 Guidelines");

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
