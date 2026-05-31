import { ProjectConfig, TemplateOptions } from "../types";
import {
  composeCursorPrinciples,
  composeProfileBlock,
  composeSharedConstitution,
} from "../agent/composer";

export interface AiGuidanceSet {
  cursorRules: string;
  agents: string;
  instructions: string;
}

export function buildAiGuidance(config: ProjectConfig): AiGuidanceSet {
  return {
    cursorRules: buildCursorRules(config),
    agents: buildAgentsGuide(config),
    instructions: buildInstructionsGuide(config),
  };
}

export function buildLegacyAiGuidance(
  framework: string,
  template: string
): AiGuidanceSet {
  const stack = mapLegacyStack(framework, template);
  const config: ProjectConfig = {
    appType: mapLegacyAppType(stack),
    framework,
    stack,
    projectProfile: "startup",
    projectName: "generated-project",
    projectPath: process.cwd(),
    options: {
      template,
    },
  };

  return buildAiGuidance(config);
}

function buildCursorRules(config: ProjectConfig): string {
  const lines = composeCursorPrinciples(config);

  const stackRule = getCursorStackRule(config);
  if (stackRule) {
    lines.push("", stackRule);
  }

  return lines.join("\n").trim();
}

function buildAgentsGuide(config: ProjectConfig): string {
  const sections = [
    "# AI Agent Constitution",
    "",
    `This project was scaffolded as **${config.framework} (${config.options?.template || config.stack})**.`,
    "",
    "## Engineering Identity",
    "",
    "Act like:",
    "- Senior Engineer",
    "- Pragmatic Architect",
    "- Fast Implementer",
    "",
    "Do not act like:",
    "- Startup influencer",
    "- Dribbble designer",
    "- Framework collector",
    "",
    ...composeSharedConstitution(),
    "",
    "## Current Project Profile",
    "",
    ...composeProfileBlock(config.projectProfile),
    "",
    "## Stack-Specific Rules",
    "",
    ...buildStackRules(config),
    "",
    "## Selected Project Choices",
    "",
    ...buildSelectedChoiceLines(config),
  ];

  return sections.join("\n").trim();
}

function buildInstructionsGuide(config: ProjectConfig): string {
  const sections = [
    "# Developer Setup & Playbook",
    "",
    `Project: **${config.projectName}**`,
    `Stack: **${config.stack}**`,
    `Profile: **${config.projectProfile}**`,
    "",
    "## Setup Commands",
    "",
    ...toBullets(getSetupCommands(config)),
    "",
    "## Development / Execution",
    "",
    ...toBullets(getRunCommands(config)),
    "",
    "## Verification",
    "",
    ...toBullets(getVerificationCommands(config)),
    "",
    "## Project Inventory",
    "",
    ...toBullets(getProjectInventory(config)),
    "",
    "## Change Protocol",
    "",
    ...toBullets(getChangeProtocol(config)),
  ];

  const selectedChoices = buildSelectedChoiceLines(config);
  if (selectedChoices.length > 0) {
    sections.push("", "## Selected Scaffold Choices", "", ...toBullets(selectedChoices));
  }

  return sections.join("\n").trim();
}

function buildStackRules(config: ProjectConfig): string[] {
  const rules: string[] = [];

  if (config.appType === "backend") {
    rules.push(
      "### Backend Standards",
      "",
      "Controllers:",
      "- request parsing",
      "- response handling",
      "",
      "Services:",
      "- business logic",
      "",
      "Middleware:",
      "- cross-cutting concerns",
      "",
      "Validators:",
      "- request validation",
      "",
      "Routes:",
      "- endpoint definitions only",
      "",
      "### API Design",
      "",
      "Use REST conventions.",
      "Use plural resources.",
      "Use consistent naming.",
      "",
      "### API Responses",
      "",
      "Success shape:",
      '`{ "success": true, "data": ... }`',
      "",
      "Failure shape:",
      '`{ "success": false, "message": ... }`',
      "",
      "### Error Handling",
      "",
      "Never swallow errors.",
      "Return meaningful messages and correct status codes.",
      "",
      "### Validation",
      "",
      "Validate all external input.",
      "Never trust request body, params, or query values."
    );

    if (config.options?.securityPreset && config.options.securityPreset !== "none") {
      rules.push(
        "",
        "### Authentication",
        "",
        "Use JWT for protected flows when token auth is selected.",
        "Store passwords using bcrypt or argon2 based on the current scaffold.",
        "Never store plain text passwords.",
        "Never expose password hashes."
      );
    }
  }

  if (config.appType === "frontend") {
    rules.push(
      "### Frontend",
      "",
      "Keep components focused.",
      "Prefer composition and reusable components.",
      "Avoid large monolithic components and duplicated logic.",
      "",
      "### State",
      "",
      "Prefer local UI state first.",
      "Use global state only when necessary.",
      "Use TanStack Query for server-state flows when included in the scaffold.",
      "",
      "### API Access",
      "",
      "Do not place API calls directly inside presentational UI components.",
      "Place API logic in dedicated modules and consume it through hooks or query layers.",
      "",
      "### UI Style",
      "",
      "Avoid gradients, glassmorphism, neon colors, excessive shadows, and decorative animation.",
      "Prefer clean spacing, practical forms, readable tables, and clear navigation.",
      "",
      "### Accessibility",
      "",
      "Always label inputs, provide button text, and use semantic HTML."
    );
  }

  if (config.appType === "ai-ml") {
    rules.push(
      "### AI / ML",
      "",
      "Preserve reproducibility and explicit runtime contracts.",
      "Do not silently change model input or output shapes.",
      "Keep validation close to ingress points.",
      "Prefer clear model-loading boundaries over scattered runtime logic."
    );
  }

  if (config.appType === "dsa-specific") {
    rules.push(
      "### DSA Workflow",
      "",
      "Prioritize correctness first, then time/space complexity.",
      "Avoid overengineering helper layers for small problem sets.",
      "Keep solver code easy to run against sample cases and tests.",
      "If the track is interview prep, prefer readability and explainability."
    );
  }

  switch (config.stack) {
    case "node-ts-express":
      rules.push(
        "",
        "### Express Stack Rules",
        "",
        "Keep controllers thin and services focused on business logic.",
        "Preserve route versioning and centralized middleware wiring.",
        "Update env setup, config, and tests alongside behavior changes."
      );
      break;
    case "nestjs":
      rules.push(
        "",
        "### NestJS Stack Rules",
        "",
        "Preserve module, provider, and controller boundaries.",
        "Prefer adding behavior to existing modules before creating new modules.",
        "Keep framework wiring declarative."
      );
      break;
    case "python-fastapi":
    case "python-fastapi-serving":
      rules.push(
        "",
        "### FastAPI Stack Rules",
        "",
        "Keep route handlers small.",
        "Place business logic in services or core modules.",
        "Validate request and response contracts explicitly."
      );
      break;
    case "react-vite":
      rules.push(
        "",
        "### React + Vite Rules",
        "",
        "Preserve provider composition in `src/main.tsx`.",
        "Route wiring belongs in routing modules, not scattered through components."
      );
      break;
    case "nextjs":
      rules.push(
        "",
        "### Next.js Rules",
        "",
        "Respect the chosen router mode.",
        "Do not mix App Router and Pages Router patterns in the same flow."
      );
      break;
    case "dsa-cpp":
      rules.push(
        "",
        "### DSA C++ Rules",
        "",
        "Keep the runner simple and judge-compatible.",
        "Do not introduce unnecessary classes or framework-style layers."
      );
      break;
    case "dsa-python":
      rules.push(
        "",
        "### DSA Python Rules",
        "",
        "Prefer a direct solver function and a minimal runner.",
        "Keep imports standard-library-first and avoid unnecessary helpers."
      );
      break;
  }

  return rules;
}

function buildSelectedChoiceLines(config: ProjectConfig): string[] {
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

function getSetupCommands(config: ProjectConfig): string[] {
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

function getRunCommands(config: ProjectConfig): string[] {
  switch (config.stack) {
    case "node-ts-express":
    case "nestjs":
      return ["npm run dev"];
    case "react-vite":
    case "nextjs":
      return ["npm run dev"];
    case "python-fastapi":
      return ["uvicorn app.main:app --reload"];
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

function getVerificationCommands(config: ProjectConfig): string[] {
  switch (config.stack) {
    case "node-ts-express":
    case "nestjs":
      return ["npm test"];
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

function getProjectInventory(config: ProjectConfig): string[] {
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

function getChangeProtocol(config: ProjectConfig): string[] {
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

function getCursorStackRule(config: ProjectConfig): string {
  switch (config.appType) {
    case "backend":
      return "Backend rule: preserve route/controller/service boundaries and keep response shapes consistent.";
    case "frontend":
      return "Frontend rule: keep components focused, API logic outside UI components, and UI styling practical.";
    case "ai-ml":
      return "AI/ML rule: preserve explicit model contracts, validation, and reproducibility.";
    case "dsa-specific":
      return "DSA rule: prioritize correctness and simple solver-oriented code over abstraction.";
  }
}

function toBullets(lines: string[]): string[] {
  return lines.map((line) => `- ${line}`);
}

function mapLegacyStack(framework: string, template: string): string {
  if (framework === "Node.js" && template === "Express API") {
    return "node-ts-express";
  }
  if (framework === "Node.js" && template === "NestJS API") {
    return "nestjs";
  }
  if (framework === "Python" && template === "FastAPI Service") {
    return "python-fastapi";
  }
  return template.toLowerCase().replace(/\s+/g, "-");
}

function mapLegacyAppType(stack: string): ProjectConfig["appType"] {
  if (stack.startsWith("react") || stack.startsWith("next")) {
    return "frontend";
  }
  if (stack.startsWith("python-fastapi-serving") || stack === "r-analytics" || stack === "cpp-inference") {
    return "ai-ml";
  }
  if (stack.startsWith("dsa-")) {
    return "dsa-specific";
  }
  return "backend";
}
