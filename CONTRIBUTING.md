# Contributing to start-it

Thank you for your interest in contributing to start-it! This guide will help you get started.

## Getting Started

### Prerequisites

- Node.js 14+
- npm 6+
- TypeScript knowledge

### Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd start-it
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Run in development mode:

```bash
npm run dev
```

## Development Workflow

### Building

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Testing

```bash
npm test
```

Run the test suite to ensure everything works correctly.

### Adding a New Framework Template

To add a new framework template:

1. Create a new file in `src/templates/` (e.g., `src/templates/rust.ts`)

2. Define your template following this structure:

```typescript
import { TemplateConfig } from "../types";

export const rustTemplates: Record<string, TemplateConfig> = {
  "Template Name": {
    name: "Template Name",
    description: "Description of the template",
    files: [
      {
        path: "file/path.txt",
        content: "File content here",
        isExecutable: false, // optional
      },
      // ... more files
    ],
  },
};
```

3. Export your templates in `src/templates/index.ts`:

```typescript
import { rustTemplates } from "./rust";

const allTemplates: Record<string, Record<string, TemplateConfig>> = {
  // ... existing frameworks
  Rust: rustTemplates,
};
```

4. Update the CLI in `src/cli.ts` to include your framework in the FRAMEWORKS array and add framework-specific options if needed.

5. Add tests in `src/__tests__/generator.test.ts` for your new templates.

6. Update `README.md` and `EXAMPLES.md` with documentation.

### File Structure

```
start-it/
├── src/
│   ├── cli.ts                 # CLI entry point
│   ├── generator.ts           # Project generator logic
│   ├── types.ts               # TypeScript type definitions
│   ├── templates/             # Framework templates
│   │   ├── index.ts           # Template registry
│   │   ├── go.ts
│   │   ├── flutter.ts
│   │   ├── react-native.ts
│   │   ├── spring-boot.ts
│   │   ├── node.ts
│   │   └── python.ts
│   └── __tests__/
│       └── generator.test.ts   # Tests
├── dist/                      # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── jest.config.js
├── README.md
├── EXAMPLES.md
└── CONTRIBUTING.md
```

## Code Style

- Use TypeScript for all source files
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Add comments for complex logic

## Testing

- Write tests for new features
- Ensure all tests pass before submitting a PR
- Aim for good test coverage

```bash
npm test
```

## Submitting Changes

1. Create a new branch for your feature:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:

```bash
git commit -am 'Add your feature description'
```

3. Push to your fork:

```bash
git push origin feature/your-feature-name
```

4. Submit a pull request with a clear description of your changes

## Reporting Issues

If you find a bug or have a suggestion, please open an issue on GitHub with:

- A clear description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Your environment (Node version, OS, etc.)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue or discussion if you have any questions!
