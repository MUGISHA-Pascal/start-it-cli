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
      projectProfile: "production",
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
    expect(fs.existsSync(path.join(projectPath, ".agentignore"))).toBe(true);
    const cursorRules = await fs.readFile(path.join(projectPath, ".cursorrules"), "utf-8");
    expect(cursorRules).toContain("AI Working Rules");
    expect(cursorRules).toContain("Current profile: production");
    const agentIgnore = await fs.readFile(path.join(projectPath, ".agentignore"), "utf-8");
    expect(agentIgnore).toContain(".env");
    expect(agentIgnore).toContain("node_modules/");

    expect(fs.existsSync(path.join(projectPath, "docs/AGENTS.md"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "docs/instructions.md"))).toBe(true);
    const docsAgents = await fs.readFile(path.join(projectPath, "docs/AGENTS.md"), "utf-8");
    expect(docsAgents).toContain("AI Agent Constitution");
    expect(docsAgents).toContain("General Principles");
  });

  test("should create a Node.js Express API project", async () => {
    const config: ProjectConfig = {
      appType: "backend",
      framework: "Node.js",
      stack: "node-ts-express",
      projectProfile: "production",
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
    expect(fs.existsSync(path.join(projectPath, ".agentignore"))).toBe(true);
    const cursorRules = await fs.readFile(path.join(projectPath, ".cursorrules"), "utf-8");
    expect(cursorRules).toContain("Current stack: node-ts-express");
    expect(cursorRules).toContain("Backend rule");
    const agentIgnore = await fs.readFile(path.join(projectPath, ".agentignore"), "utf-8");
    expect(agentIgnore).toContain(".env");
    expect(agentIgnore).toContain("package-lock.json");

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
    const docsAgents = await fs.readFile(path.join(projectPath, "docs/AGENTS.md"), "utf-8");
    expect(docsAgents).toContain("JWT Rules");
    expect(docsAgents).toContain("bcrypt Rules");
    expect(docsAgents).toContain("PostgreSQL Rules");
    expect(docsAgents).toContain("Redis Rules");
    const docsInstructions = await fs.readFile(path.join(projectPath, "docs/instructions.md"), "utf-8");
    expect(docsInstructions).toContain("Developer Setup & Playbook");
    expect(docsInstructions).toContain("npm install");
    expect(docsInstructions).toContain("`src/app.ts` wires middleware and API routes.");
  });

  test("should create a NestJS API project", async () => {
    const config: ProjectConfig = {
      appType: "backend",
      framework: "Node.js",
      stack: "nestjs",
      projectProfile: "production",
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
      projectProfile: "startup",
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
    expect(cursorRules).toContain("Current stack: react-vite");
    const docsAgents = await fs.readFile(
      path.join(projectPath, "docs/AGENTS.md"),
      "utf-8"
    );
    expect(docsAgents).toContain("Tailwind Rules");
    expect(docsAgents).toContain("shadcn/ui Rules");
    expect(docsAgents).toContain("TanStack Query Rules");
  });

  test("should create a Next.js frontend project", async () => {
    const config: ProjectConfig = {
      appType: "frontend",
      framework: "Frontend",
      stack: "nextjs",
      projectProfile: "startup",
      projectName: "test-next-app",
      projectPath: testDir,
      options: {
        template: "Next.js",
        stack: "nextjs",
        projectDescription: "Production baseline Content platform API",
        appName: "test-next-app",
        styling: "tailwind",
        uiAddon: "shadcn-ui",
        stateManagement: "zustand",
        dataFetching: "tanstack-query",
        testing: "jest-rtl",
        baselineSource: "local",
        nextRouter: "app-router",
      },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate();

    const projectPath = path.join(testDir, "test-next-app");
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "package.json"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/app/layout.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/app/page.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/components/Providers.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/lib/queryClient.ts"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/lib/store.ts"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/components/button.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "tailwind.config.js"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "jest.config.js"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "components.json"))).toBe(true);

    const packageJson = await fs.readFile(
      path.join(projectPath, "package.json"),
      "utf-8"
    );
    expect(packageJson).toContain("\"next\"");
    expect(packageJson).toContain("\"@tanstack/react-query\"");
    expect(packageJson).toContain("\"zustand\"");
    expect(packageJson).toContain("\"tailwindcss\"");
    expect(packageJson).toContain("\"@testing-library/react\"");

    const layoutFile = await fs.readFile(
      path.join(projectPath, "src/app/layout.tsx"),
      "utf-8"
    );
    expect(layoutFile).toContain("Providers");

    const cursorRules = await fs.readFile(
      path.join(projectPath, ".cursorrules"),
      "utf-8"
    );
    expect(cursorRules).toContain("Current stack: nextjs");
    const docsAgents = await fs.readFile(
      path.join(projectPath, "docs/AGENTS.md"),
      "utf-8"
    );
    expect(docsAgents).toContain("Tailwind Rules");
    expect(docsAgents).toContain("shadcn/ui Rules");
    expect(docsAgents).toContain("TanStack Query Rules");
  });

  test("should create an AI/ML FastAPI serving project", async () => {
    const config: ProjectConfig = {
      appType: "ai-ml",
      framework: "Python",
      stack: "python-fastapi-serving",
      projectProfile: "production",
      projectName: "test-aiml-app",
      projectPath: testDir,
      options: {
        template: "FastAPI Model Serving",
        stack: "python-fastapi-serving",
        projectDescription: "MVP Prediction service",
        appName: "test-aiml-app",
        servingMode: "realtime-plus-batch",
        modelPackaging: "mlflow-ready",
        tracking: "mlflow",
        validation: "pydantic-plus-pandera",
        logging: "structlog",
        testing: "pytest-httpx",
      },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate();

    const projectPath = path.join(testDir, "test-aiml-app");
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "requirements.txt"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "app/main.py"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "app/api/routes.py"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "app/core/model_loader.py"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "app/core/tracking.py"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "tests/test_predict.py"))).toBe(true);

    const requirements = await fs.readFile(
      path.join(projectPath, "requirements.txt"),
      "utf-8"
    );
    expect(requirements).toContain("fastapi==");
    expect(requirements).toContain("mlflow==");
    expect(requirements).toContain("structlog==");
    expect(requirements).toContain("pandera==");
    expect(requirements).toContain("httpx==");

    const routes = await fs.readFile(
      path.join(projectPath, "app/api/routes.py"),
      "utf-8"
    );
    expect(routes).toContain('/predict-batch');

    const envExample = await fs.readFile(
      path.join(projectPath, ".env.example"),
      "utf-8"
    );
    expect(envExample).toContain("MLFLOW_TRACKING_URI=");
    const docsAgents = await fs.readFile(
      path.join(projectPath, "docs/AGENTS.md"),
      "utf-8"
    );
    expect(docsAgents).toContain("Pytest Rules");
  });

  test("should create an AI/ML R analytics project", async () => {
    const config: ProjectConfig = {
      appType: "ai-ml",
      framework: "R",
      stack: "r-analytics",
      projectProfile: "production",
      projectName: "test-r-analytics",
      projectPath: testDir,
      options: {
        template: "R Analytics Pipeline",
        stack: "r-analytics",
        projectDescription: "Production baseline Recommendation engine",
        appName: "test-r-analytics",
        executionMode: "batch-plus-report",
        modelPackaging: "mlflow-ready",
        tracking: "mlflow",
        validation: "base-checks",
        logging: "r-logger",
        testing: "testthat",
      },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate();

    const projectPath = path.join(testDir, "test-r-analytics");
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "DESCRIPTION"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "R/pipeline.R"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "R/tracking.R"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "scripts/run_pipeline.R"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "tests/testthat/test-pipeline.R"))).toBe(true);

    const pipelineFile = await fs.readFile(
      path.join(projectPath, "R/pipeline.R"),
      "utf-8"
    );
    expect(pipelineFile).toContain("write_report");

    const readme = await fs.readFile(
      path.join(projectPath, "README.md"),
      "utf-8"
    );
    expect(readme).toContain("R analytics pipeline");
  });

  test("should create an AI/ML C++ inference project", async () => {
    const config: ProjectConfig = {
      appType: "ai-ml",
      framework: "C++",
      stack: "cpp-inference",
      projectProfile: "startup",
      projectName: "test-cpp-inference",
      projectPath: testDir,
      options: {
        template: "C++ Inference Utility",
        stack: "cpp-inference",
        projectDescription: "MVP Internal ML utility",
        appName: "test-cpp-inference",
        runtimeMode: "batch-cli",
        modelPackaging: "onnx-ready",
        tracking: "none",
        validation: "base-checks",
        logging: "spdlog-ready",
        testing: "ctest",
      },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate();

    const projectPath = path.join(testDir, "test-cpp-inference");
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "CMakeLists.txt"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "include/model_runner.hpp"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/model_runner.cpp"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/main.cpp"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "tests/test_main.cpp"))).toBe(true);

    const mainFile = await fs.readFile(
      path.join(projectPath, "src/main.cpp"),
      "utf-8"
    );
    expect(mainFile).toContain("batch mode enabled");
    expect(mainFile).toContain("[spdlog-ready]");

    const cmakeFile = await fs.readFile(
      path.join(projectPath, "CMakeLists.txt"),
      "utf-8"
    );
    expect(cmakeFile).toContain("enable_testing()");
    const docsAgents = await fs.readFile(
      path.join(projectPath, "docs/AGENTS.md"),
      "utf-8"
    );
    expect(docsAgents).toContain("CTest Rules");
  });

  test("should create a DSA-specific C++ project", async () => {
    const config: ProjectConfig = {
      appType: "dsa-specific",
      framework: "C++",
      stack: "dsa-cpp",
      projectProfile: "exam",
      projectName: "test-dsa-cpp",
      projectPath: testDir,
      options: {
        template: "C++ DSA Workspace",
        stack: "dsa-cpp",
        projectDescription: "MVP Competitive programming workbook",
        appName: "test-dsa-cpp",
        track: "competitive-programming",
        inputMode: "stdin-stdout",
        testing: "ctest",
      },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate();

    const projectPath = path.join(testDir, "test-dsa-cpp");
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "CMakeLists.txt"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "include/solver.hpp"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/solver.cpp"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/main.cpp"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "problems/two_sum.md"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "examples/sample_input.txt"))).toBe(
      true
    );
    expect(fs.existsSync(path.join(projectPath, "tests/test_solver.cpp"))).toBe(
      true
    );

    const mainFile = await fs.readFile(
      path.join(projectPath, "src/main.cpp"),
      "utf-8"
    );
    expect(mainFile).toContain("std::ios::sync_with_stdio(false)");
    expect(mainFile).toContain("std::cin >> count >> target");

    const readme = await fs.readFile(
      path.join(projectPath, "README.md"),
      "utf-8"
    );
    expect(readme).toContain("competitive-programming");
    expect(readme).toContain("stdin/stdout execution");

    const cmakeFile = await fs.readFile(
      path.join(projectPath, "CMakeLists.txt"),
      "utf-8"
    );
    expect(cmakeFile).toContain("enable_testing()");

    const cursorRules = await fs.readFile(
      path.join(projectPath, ".cursorrules"),
      "utf-8"
    );
    expect(cursorRules).toContain("C++");
    const docsAgents = await fs.readFile(
      path.join(projectPath, "docs/AGENTS.md"),
      "utf-8"
    );
    expect(docsAgents).toContain("CTest Rules");
  });

  test("should create a DSA-specific Python project", async () => {
    const config: ProjectConfig = {
      appType: "dsa-specific",
      framework: "Python",
      stack: "dsa-python",
      projectProfile: "exam",
      projectName: "test-dsa-python",
      projectPath: testDir,
      options: {
        template: "Python DSA Workspace",
        stack: "dsa-python",
        projectDescription: "MVP Interview prep workspace",
        appName: "test-dsa-python",
        track: "interview-prep",
        inputMode: "function-first",
        testing: "pytest",
      },
    };

    const generator = new ProjectGenerator(config);
    await generator.generate();

    const projectPath = path.join(testDir, "test-dsa-python");
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "main.py"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "src/solver.py"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "tests/test_solver.py"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "requirements.txt"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "problems/two_sum.md"))).toBe(true);

    const mainFile = await fs.readFile(
      path.join(projectPath, "main.py"),
      "utf-8"
    );
    expect(mainFile).toContain("nums = [2, 7, 11, 15]");
    expect(mainFile).toContain('print(f"two_sum indices: {format_answer(answer)}")');

    const solverFile = await fs.readFile(
      path.join(projectPath, "src/solver.py"),
      "utf-8"
    );
    expect(solverFile).toContain("def solve_two_sum");
    expect(solverFile).toContain("keep the solver easy to explain");

    const requirements = await fs.readFile(
      path.join(projectPath, "requirements.txt"),
      "utf-8"
    );
    expect(requirements).toContain("pytest==");

    const cursorRules = await fs.readFile(
      path.join(projectPath, ".cursorrules"),
      "utf-8"
    );
    expect(cursorRules).toContain("Python");
    const docsAgents = await fs.readFile(
      path.join(projectPath, "docs/AGENTS.md"),
      "utf-8"
    );
    expect(docsAgents).toContain("Pytest Rules");
  });

  test("should create a Python FastAPI project", async () => {
    const config: ProjectConfig = {
      appType: "backend",
      framework: "Python",
      stack: "python-fastapi",
      projectProfile: "production",
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
    expect(cursorRules).toContain("Current stack: python-fastapi");
    expect(cursorRules).toContain("Backend rule");

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
    expect(docsAgents).toContain("AI Agent Constitution");
    expect(docsAgents).toContain("Production Mode");
  });

  test("should throw error if directory already exists", async () => {
    const config: ProjectConfig = {
      appType: "backend",
      framework: "Go",
      stack: "go-basic-cli",
      projectProfile: "production",
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
      projectProfile: "production",
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
