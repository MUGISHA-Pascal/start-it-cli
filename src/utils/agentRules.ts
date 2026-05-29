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
