import { ProjectConfig, ProjectProfile } from "../types";
import { getAiMlStandardsBlock } from "./blocks/appType/aiml";
import {
  getBackendAuthenticationBlock,
  getBackendStandardsBlock,
} from "./blocks/appType/backend";
import { getDsaStandardsBlock } from "./blocks/appType/dsa";
import { getFrontendStandardsBlock } from "./blocks/appType/frontend";
import { getCppInferenceStackBlock } from "./blocks/stack/cppInference";
import { getDsaCppStackBlock } from "./blocks/stack/dsaCpp";
import { getDsaPythonStackBlock } from "./blocks/stack/dsaPython";
import { getNextJsStackBlock } from "./blocks/stack/nextjs";
import { getNestJsStackBlock } from "./blocks/stack/nestjs";
import { getNodeTsExpressStackBlock } from "./blocks/stack/nodeTsExpress";
import { getPythonFastApiStackBlock } from "./blocks/stack/pythonFastApi";
import { getPythonFastApiServingStackBlock } from "./blocks/stack/pythonFastApiServing";
import { getRAnalyticsStackBlock } from "./blocks/stack/rAnalytics";
import { getReactViteStackBlock } from "./blocks/stack/reactVite";
import { getArchitectureBlock } from "./blocks/shared/architecture";
import { getDebuggingBlock } from "./blocks/shared/debugging";
import { getDependenciesBlock } from "./blocks/shared/dependencies";
import { getFileManagementBlock } from "./blocks/shared/fileManagement";
import { getGeneralPrinciplesBlock } from "./blocks/shared/general";
import { getRefactoringBlock } from "./blocks/shared/refactoring";
import { getResponsesBlock } from "./blocks/shared/responses";
import { getExamProfileBlock } from "./blocks/profile/exam";
import { getProductionProfileBlock } from "./blocks/profile/production";
import { getStartupProfileBlock } from "./blocks/profile/startup";
import { getArgon2OptionBlock } from "./blocks/option/argon2";
import { getBcryptOptionBlock } from "./blocks/option/bcrypt";
import { getCtestOptionBlock } from "./blocks/option/ctest";
import { getJwtOptionBlock } from "./blocks/option/jwt";
import { getPostgreSqlOptionBlock } from "./blocks/option/postgresql";
import { getPytestOptionBlock } from "./blocks/option/pytest";
import { getRedisOptionBlock } from "./blocks/option/redis";
import { getShadcnUiOptionBlock } from "./blocks/option/shadcnUi";
import { getTailwindOptionBlock } from "./blocks/option/tailwind";
import { getTanStackQueryOptionBlock } from "./blocks/option/tanstackQuery";

export function composeSharedConstitution(): string[] {
  return [
    ...getGeneralPrinciplesBlock(),
    "",
    ...getArchitectureBlock(),
    "",
    ...getDependenciesBlock(),
    "",
    ...getFileManagementBlock(),
    "",
    ...getResponsesBlock(),
    "",
    ...getRefactoringBlock(),
    "",
    ...getDebuggingBlock(),
  ];
}

export function composeProfileBlock(projectProfile: ProjectProfile): string[] {
  const blocks = [
    getExamProfileBlock(),
    getStartupProfileBlock(),
    getProductionProfileBlock(),
  ];

  const block = blocks.find((entry) => entry.profile === projectProfile);
  if (!block) {
    return [];
  }

  return block.lines;
}

export function composeAppTypeBlock(config: ProjectConfig): string[] {
  switch (config.appType) {
    case "backend": {
      const lines = [...getBackendStandardsBlock()];
      if (config.options?.securityPreset && config.options.securityPreset !== "none") {
        lines.push("", ...getBackendAuthenticationBlock());
      }
      return lines;
    }
    case "frontend":
      return getFrontendStandardsBlock();
    case "ai-ml":
      return getAiMlStandardsBlock();
    case "dsa-specific":
      return getDsaStandardsBlock();
  }
}

export function composeBackendStackBlock(config: ProjectConfig): string[] {
  switch (config.stack) {
    case "node-ts-express":
      return getNodeTsExpressStackBlock();
    case "nestjs":
      return getNestJsStackBlock();
    case "python-fastapi":
      return getPythonFastApiStackBlock();
    default:
      return [];
  }
}

export function composeFrontendStackBlock(config: ProjectConfig): string[] {
  switch (config.stack) {
    case "react-vite":
      return getReactViteStackBlock();
    case "nextjs":
      return getNextJsStackBlock();
    default:
      return [];
  }
}

export function composeAiMlStackBlock(config: ProjectConfig): string[] {
  switch (config.stack) {
    case "python-fastapi-serving":
      return getPythonFastApiServingStackBlock();
    case "r-analytics":
      return getRAnalyticsStackBlock();
    case "cpp-inference":
      return getCppInferenceStackBlock();
    default:
      return [];
  }
}

export function composeDsaStackBlock(config: ProjectConfig): string[] {
  switch (config.stack) {
    case "dsa-cpp":
      return getDsaCppStackBlock();
    case "dsa-python":
      return getDsaPythonStackBlock();
    default:
      return [];
  }
}

export function composeOptionBlocks(config: ProjectConfig): string[] {
  const lines: string[] = [];
  const options = config.options;

  if (!options) {
    return lines;
  }

  const pushBlock = (block: string[]) => {
    if (block.length === 0) {
      return;
    }
    if (lines.length > 0) {
      lines.push("");
    }
    lines.push(...block);
  };

  if (options.securityPreset === "bcrypt" || options.securityPreset === "bcrypt-jwt") {
    pushBlock(getBcryptOptionBlock());
  }
  if (options.securityPreset === "argon2" || options.securityPreset === "argon2-jwt") {
    pushBlock(getArgon2OptionBlock());
  }
  if (options.securityPreset === "bcrypt-jwt" || options.securityPreset === "argon2-jwt") {
    pushBlock(getJwtOptionBlock());
  }
  if (options.databases?.includes("postgresql")) {
    pushBlock(getPostgreSqlOptionBlock());
  }
  if (options.databases?.includes("redis")) {
    pushBlock(getRedisOptionBlock());
  }
  if (options.styling === "tailwind") {
    pushBlock(getTailwindOptionBlock());
  }
  if (options.uiAddon === "shadcn-ui") {
    pushBlock(getShadcnUiOptionBlock());
  }
  if (options.dataFetching === "tanstack-query") {
    pushBlock(getTanStackQueryOptionBlock());
  }
  if (
    options.testing === "pytest"
    || options.testing === "pytest-httpx"
    || options.testing === "testthat"
  ) {
    pushBlock(getPytestOptionBlock());
  }
  if (options.testing === "ctest") {
    pushBlock(getCtestOptionBlock());
  }

  return lines;
}

export function composeConstitutionRules(config: ProjectConfig): string[] {
  const sections: string[] = [];
  const parts = [
    composeAppTypeBlock(config),
    composeBackendStackBlock(config),
    composeFrontendStackBlock(config),
    composeAiMlStackBlock(config),
    composeDsaStackBlock(config),
    composeOptionBlocks(config),
  ];

  for (const part of parts) {
    if (part.length === 0) {
      continue;
    }
    if (sections.length > 0) {
      sections.push("");
    }
    sections.push(...part);
  }

  return sections;
}

export function composeSelectedChoiceLines(config: ProjectConfig): string[] {
  const lines = [
    `Project profile: ${config.projectProfile}`,
    `App type: ${config.appType}`,
    `Stack: ${config.stack}`,
  ];
  const options = config.options;

  if (!options) {
    return lines;
  }

  if (options.databases && options.databases.length > 0) {
    lines.push(`Databases: ${options.databases.join(", ")}`);
  }
  if (options.securityPreset) {
    lines.push(`Security preset: ${options.securityPreset}`);
  }
  if (options.logging) {
    lines.push(`Logging: ${options.logging}`);
  }
  if (options.monitoring) {
    lines.push(`Monitoring: ${options.monitoring}`);
  }
  if (options.testing) {
    lines.push(`Testing: ${options.testing}`);
  }
  if (options.routing && options.routing !== "none") {
    lines.push(`Routing: ${options.routing}`);
  }
  if (options.nextRouter) {
    lines.push(`Next router: ${options.nextRouter}`);
  }
  if (options.styling) {
    lines.push(`Styling: ${options.styling}`);
  }
  if (options.uiAddon && options.uiAddon !== "none") {
    lines.push(`UI add-on: ${options.uiAddon}`);
  }
  if (options.stateManagement && options.stateManagement !== "none") {
    lines.push(`State management: ${options.stateManagement}`);
  }
  if (options.dataFetching) {
    lines.push(`Data fetching: ${options.dataFetching}`);
  }
  if (options.servingMode) {
    lines.push(`Serving mode: ${options.servingMode}`);
  }
  if (options.executionMode) {
    lines.push(`Execution mode: ${options.executionMode}`);
  }
  if (options.runtimeMode) {
    lines.push(`Runtime mode: ${options.runtimeMode}`);
  }
  if (options.modelPackaging) {
    lines.push(`Model packaging: ${options.modelPackaging}`);
  }
  if (options.tracking) {
    lines.push(`Tracking: ${options.tracking}`);
  }
  if (options.validation) {
    lines.push(`Validation: ${options.validation}`);
  }
  if (options.track) {
    lines.push(`DSA track: ${options.track}`);
  }
  if (options.inputMode) {
    lines.push(`Input mode: ${options.inputMode}`);
  }

  return lines;
}

export function composeSetupCommands(config: ProjectConfig): string[] {
  switch (config.stack) {
    case "node-ts-express":
    case "nestjs":
    case "react-vite":
    case "nextjs":
      return ["npm install"];
    case "python-fastapi":
    case "python-fastapi-serving":
      return [
        "python -m venv .venv",
        "source .venv/bin/activate",
        "pip install -r requirements.txt",
      ];
    case "r-analytics":
      return ["Install the required R packages from DESCRIPTION before running the pipeline."];
    case "cpp-inference":
    case "dsa-cpp":
      return [
        "cmake -S . -B build",
        "cmake --build build",
      ];
    case "dsa-python":
      return config.options?.testing === "pytest"
        ? ["pip install -r requirements.txt"]
        : ["No dependency installation is required for the default manual workflow."];
    default:
      return ["Follow the stack-specific README generated in the project root."];
  }
}

export function composeRunCommands(config: ProjectConfig): string[] {
  switch (config.stack) {
    case "node-ts-express":
    case "nestjs":
    case "react-vite":
    case "nextjs":
      return ["npm run dev"];
    case "python-fastapi":
    case "python-fastapi-serving":
      return ["uvicorn app.main:app --reload"];
    case "r-analytics":
      return ["Rscript scripts/run_pipeline.R"];
    case "cpp-inference":
      return ["./build/<project-binary>"];
    case "dsa-cpp":
      return ["./build/<project-binary> < examples/sample_input.txt"];
    case "dsa-python":
      return ["python main.py < examples/sample_input.txt"];
    default:
      return [];
  }
}

export function composeVerificationCommands(config: ProjectConfig): string[] {
  switch (config.stack) {
    case "node-ts-express":
    case "nestjs":
    case "react-vite":
    case "nextjs":
      return ["npm test"];
    case "python-fastapi":
    case "python-fastapi-serving":
      return ["pytest"];
    case "r-analytics":
      return ["Run `testthat` for the generated test suite."];
    case "cpp-inference":
      return ["ctest --test-dir build"];
    case "dsa-cpp":
      return config.options?.testing === "ctest"
        ? ["ctest --test-dir build"]
        : ["Run the sample case script in `scripts/run_cases.sh`."];
    case "dsa-python":
      return config.options?.testing === "pytest"
        ? ["pytest"]
        : ["Run the sample case script in `scripts/run_cases.sh`."];
    default:
      return ["Use the generated tests for the scaffold's critical paths."];
  }
}

export function composeProjectInventory(config: ProjectConfig): string[] {
  switch (config.stack) {
    case "node-ts-express":
      return [
        "`src/app.ts` wires middleware and API routes.",
        "`src/server.ts` boots the application.",
        "`src/controllers/` owns response-facing request handlers.",
        "`src/services/` owns business logic.",
        "`src/config/` holds environment and data-store configuration.",
      ];
    case "nestjs":
      return [
        "`src/main.ts` boots the Nest application.",
        "`src/app.module.ts` is the root composition point.",
        "`src/example/` demonstrates feature module structure.",
        "`src/common/` holds shared cross-cutting pieces.",
      ];
    case "python-fastapi":
      return [
        "`app/main.py` is the application entry point.",
        "`app/api/` contains route wiring.",
        "`app/core/` contains settings, logging, and security helpers.",
        "`app/db/` contains data-store configuration.",
      ];
    case "react-vite":
      return [
        "`src/main.tsx` composes root providers.",
        "`src/routes.tsx` defines routing when routing is enabled.",
        "`src/lib/` holds query or state helpers.",
        "`src/components/` contains reusable UI primitives.",
      ];
    case "nextjs":
      return [
        "Router entry points live under the generated Next.js route structure.",
        "`src/components/` contains shared UI and providers.",
        "`src/lib/` contains query or state helpers.",
      ];
    case "python-fastapi-serving":
      return [
        "`app/main.py` boots the serving API.",
        "`app/api/routes.py` defines inference routes.",
        "`app/core/` holds logging, settings, model loading, and tracking.",
        "`app/services/` contains inference logic.",
      ];
    case "r-analytics":
      return [
        "`R/` contains pipeline and tracking logic.",
        "`scripts/` contains execution entrypoints.",
        "`tests/testthat/` contains regression coverage.",
      ];
    case "cpp-inference":
      return [
        "`src/main.cpp` is the runtime entry point.",
        "`src/model_runner.cpp` owns inference flow.",
        "`include/` contains shared interfaces.",
        "`tests/` contains CTest coverage.",
      ];
    case "dsa-cpp":
      return [
        "`src/main.cpp` is the runner entry point.",
        "`src/solver.cpp` holds the main algorithm.",
        "`include/solver.hpp` declares the solver contract.",
        "`problems/` and `examples/` store problem notes and sample cases.",
      ];
    case "dsa-python":
      return [
        "`main.py` is the runner entry point.",
        "`src/solver.py` holds the main algorithm.",
        "`problems/` and `examples/` store problem notes and sample cases.",
        "`tests/` contains pytest coverage when enabled.",
      ];
    default:
      return ["Read the generated README to identify the scaffold's extension points."];
  }
}

export function composeChangeProtocol(config: ProjectConfig): string[] {
  const base = [
    "Before adding a new file, confirm that an existing file is not already responsible.",
    "When behavior changes, update tests or sample verification in the same change.",
    "Do not introduce new dependencies without checking existing tools first.",
  ];

  if (config.appType === "backend") {
    base.push(
      "When changing API behavior, keep route, controller, service, validation, and response shape aligned.",
      "When changing auth or database behavior, update env examples and configuration files together."
    );
  }

  if (config.appType === "frontend") {
    base.push(
      "When adding data access, keep API code out of presentational components.",
      "When changing UI structure, preserve the existing provider and routing composition."
    );
  }

  if (config.appType === "dsa-specific") {
    base.push(
      "When changing solver behavior, re-run sample cases and complexity sanity checks.",
      "Keep the runner compatible with the selected input mode."
    );
  }

  return base;
}

export function composeAgentIgnore(config: ProjectConfig): string {
  const lines = [
    "# Files and directories AI agents should avoid editing unless explicitly requested.",
    "# Generated by start-it.",
    "",
    "# Secrets and local environment state",
    ".env",
    ".env.*",
    "!.env.example",
    "",
    "# Dependency locks",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "poetry.lock",
    "Pipfile.lock",
    "",
    "# Generated dependencies and caches",
    "node_modules/",
    ".next/",
    "dist/",
    "build/",
    "coverage/",
    ".turbo/",
    ".cache/",
    ".venv/",
    "venv/",
    "__pycache__/",
    ".pytest_cache/",
    "",
    "# IDE and OS artifacts",
    ".idea/",
    ".vscode/",
    ".DS_Store",
  ];

  if (config.appType === "backend") {
    lines.push("", "# Backend runtime artifacts", "*.log");
  }

  if (config.appType === "ai-ml") {
    lines.push(
      "",
      "# Model and experiment artifacts",
      "models/",
      "artifacts/",
      "mlruns/",
      "wandb/"
    );
  }

  if (config.stack === "cpp-inference" || config.stack === "dsa-cpp") {
    lines.push("", "# Native build outputs", "*.o", "*.out", "*.exe");
  }

  return `${lines.join("\n")}\n`;
}

export function composeCursorPrinciples(config: ProjectConfig): string[] {
  return [
    `# cursorrules for ${config.framework} - ${config.options?.template || config.stack}`,
    "",
    "# AI Working Rules",
    "",
    "Before making changes:",
    "1. Read `docs/AGENTS.md` for project rules and constraints.",
    "2. Read `docs/instructions.md` for setup, verification, and extension workflow.",
    "3. Treat these documents as the source of truth for repository-specific agent behavior.",
    "",
    "Act like: Senior Engineer + Pragmatic Architect + Fast Implementer.",
    "",
    "Prioritize:",
    "1. Correctness",
    "2. Simplicity",
    "3. Maintainability",
    "4. Speed of implementation",
    "",
    "Do not:",
    "- add dependencies unless necessary and requested",
    "- create new files when an existing file should be extended",
    "- introduce new architectural patterns without a clear reason",
    "- rewrite large areas blindly before identifying the root cause",
    "",
    "Default behavior:",
    "- read existing structure before editing",
    "- keep responses concise",
    "- return targeted changes only",
    "- preserve behavior unless explicitly asked to change it",
    "- validate critical paths before finishing",
    "",
    `Current profile: ${config.projectProfile}`,
    `Current app type: ${config.appType}`,
    `Current stack: ${config.stack}`,
  ];
}
