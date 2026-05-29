/**
 * Helper to generate token-efficient agentic AI guidelines (.cursorrules)
 * for scaffolded projects.
 */
export function getAgentRules(framework: string, template: string): string {
  const genericRules = `
# 🤖 AI Agent Scaffolding Guidelines

You are assisting with development on this codebase. To keep token consumption minimal and maintain extreme focus:

## ⚡ Context & Token Efficiency
- **Be brief**: Never output massive, conversational explanations. 
- **Use local code diffs**: Do not rewrite entire unchanged files. Focus ONLY on lines needing edits.
- **Read before writing**: Scan the current folder layout, \\\`package.json\\\`, or imports to avoid recreating functions or models.
- **No placeholder code**: Avoid writing \\\'// TODO\\\' or \\\'// implement later\\\'. Write concrete code.

## 🛠️ Safe Execution
- Never alter package locks or environment file credentials (\\\`.env\\\`) without a direct request.
- Ensure all imports exist and are referenced.
`;

  const frameworkRules: Record<string, string> = {
    "Go": `
## 🐹 Go Guidelines
- Adhere to idiomatic Go formatting and patterns (\\\`go fmt\\\`).
- Always handle errors explicitly: \\\`if err != nil { return ... }\\\`.
- Restrict extra dependencies. Only use standard libraries or Gin/Fiber when already configured.
- Place CLI tools in \\\`/cmd\\\` and core business logic under \\\`/pkg\\\` or \\\`/internal\\\`.
`,
    "Flutter": `
## 🎯 Flutter & Dart Guidelines
- Enforce strict Dart null safety and sound type-checking.
- Structure layouts with small, modular widgets. Prefer \\\`const\\\` constructors.
- Avoid large widget state files; encapsulate logic inside state-management layers (BLoC / Provider / Riverpod).
`,
    "React Native": `
## ⚛️ React Native & TypeScript Guidelines
- Use React 18+ hooks and functional components strictly.
- Set explicit TypeScript types; avoid using \\\`any\\\` under any circumstances.
- Keep styles separated or grouped cleanly at the bottom using \\\`StyleSheet.create\\\`.
`,
    "Spring Boot": `
## 🍃 Spring Boot Guidelines
- Follow standard MVC layering: Controller -> Service -> Repository -> Entity.
- Use constructor injection instead of field injection (\\\`@Autowired\\\`).
- Leverage Lombok annotations (\\\`@Getter\\\`, \\\`@Setter\\\`, \\\`@RequiredArgsConstructor\\\`) to minimize file lengths.
`,
    "Node.js": `
## 🟢 Node.js & TypeScript Guidelines
- Standardize on modern ES Modules and strict TypeScript types.
- Always use async/await; avoid promise chaining or deep callbacks.
- Delegate data validation and controller logic to thin middleware and services.
`,
    "Python": `
## 🐍 Python & PEP 8 Guidelines
- Adhere strictly to PEP 8 styling conventions and explicit type hints.
- Target modern async features (e.g. FastAPI / Flask async support) if supported.
- Declare requirements clearly; never hardcode complex mockup datasets.
`
  };

  const specific = frameworkRules[framework] || "";
  return `# cursorrules for ${framework} - ${template}\n${genericRules}\n${specific}`.trim();
}

/**
 * Generates docs/AGENTS.md for newly scaffolded projects.
 */
export function getDocsAgents(framework: string, template: string): string {
  return `
# 🤖 AI Agent Project Guidelines (AGENTS.md)

Welcome, AI Agent! This guide outlines the conventions, design paradigms, and security boundaries of this **${framework} (${template})** project.

## 🧭 Architecture & Naming Conventions
- Always adapt newly implemented modules to follow the directory paradigms currently in place.
- Keep filenames clean, consistent, and correctly cased (e.g., camelCase for TypeScript, snake_case for Python, lower_case/camelCase for Go/Dart).

## 🚀 Key Rules of Engagement
1. **Never Hallucinate Libraries**: Use ONLY the packages already declared in configuration files (like \`package.json\`, \`requirements.txt\`, or \`go.mod\`) unless specifically instructed to add them.
2. **Context Window Friendly**: Output concise, precise changes. Never print complete classes or files if only two lines need to be changed.
3. **Robust Coding Standards**: Implement thorough validations, proper boundary checks, and full error-handling (never write empty catch blocks).
`.trim();
}

/**
 * Generates docs/instructions.md for newly scaffolded projects.
 */
export function getDocsInstructions(framework: string, template: string): string {
  return `
# 📖 Developer Setup & Playbook (instructions.md)

Welcome to your newly scaffolded **${framework}** project! This playbook contains onboarding instructions for configuring, developing, building, and verifying this project.

## 🛠️ Step-by-Step Local Setup

### 1. Installation
Install all dependencies needed to execute the application:
- **Node.js**: Run \\\`npm install\\\`
- **Go**: Run \\\`go mod download\\\`
- **Python**: Run \\\`pip install -r requirements.txt\\\`
- **Flutter**: Run \\\`flutter pub get\\\`

### 2. Development Execution
Run the workspace locally using hot-reloading:
- **Node.js**: Run \\\`npm run dev\\\`
- **Go**: Run \\\`go run main.go\\\`
- **Python**: Run \\\`python main.py\\\` or \\\`fastapi dev\\\`
- **Flutter**: Run \\\`flutter run\\\`

### 3. Testing
Ensure code modifications compile and pass the test suite:
- **Node.js**: Run \\\`npm test\\\`
- **Go**: Run \\\`go test ./...\\\`
- **Python**: Run \\\`pytest\\\`

## 🧩 Standards & Extensions
- Keep database migrations separate from application logic.
- Secure environment secrets inside a private \\\`.env\\\` file (never commit \\\`.env\\\` to Git).
`.trim();
}
