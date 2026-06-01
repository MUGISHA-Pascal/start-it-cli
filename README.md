# start-it

`start-it` is a guided CLI for scaffolding opinionated project baselines across backend, frontend, AI/ML, and DSA workflows.

Instead of asking users to pick from a flat template list, the CLI now walks through:

1. app type
2. implemented stack
3. stack-specific options
4. project metadata
5. deterministic scaffold generation

## Current Coverage

### Backend

- `Node.js + TypeScript + Express`
- `NestJS`
- `Python + FastAPI`

### Frontend

- `React + Vite`
- `Next.js`

### AI / ML

- `Python + FastAPI Serving`
- `R Analytics Pipeline`
- `C++ Inference Utility`

### DSA-specific

- `C++`
- `Python`

## What The CLI Collects

The prompt flow is stack-aware.

- Backend: databases, security preset, logging, monitoring, testing
- Frontend: routing, styling, optional `shadcn/ui`, state, data fetching, testing
- AI / ML: serving or runtime mode, packaging, tracking, validation, logging, testing
- DSA-specific: track, runner style, verification mode

## Installation

```bash
npm install -g start-it-cli
```

Or run it without installing:

```bash
npx start-it-cli
```

## Usage

```bash
start-it-cli
```

The CLI then guides the project setup interactively.

For the full command reference, flags, output-directory options, and non-interactive examples, see [USAGE.md](./docs/USAGE.md).

## Example Flows

### Backend Example

```text
App type: Backend
Stack: Node.js + TypeScript + Express
Databases: PostgreSQL, Redis
Security preset: bcrypt + JWT
Logging: Pino
Monitoring: Prometheus-ready
Testing: Jest + Supertest
```

### Frontend Example

```text
App type: Frontend
Stack: React + Vite
Routing: React Router
Styling: Tailwind CSS
UI add-on: shadcn/ui starter
State: Zustand
Data fetching: TanStack Query
Testing: Vitest + React Testing Library
```

### AI / ML Example

```text
App type: AI / ML
Stack: Python + FastAPI Serving
Serving mode: Realtime + batch endpoints
Packaging: MLflow-ready
Tracking: MLflow
Validation: Pydantic + Pandera
Testing: Pytest + HTTPX
```

### DSA Example

```text
App type: DSA-specific
Stack: Python
Track: Interview preparation
Runner style: Function-first
Verification: Pytest
```

## Generated Project Shape

Generation is deterministic and stack-specific.

- Backend projects generate service-ready API scaffolds
- Frontend projects start from a provider-style baseline and are then customized
- AI / ML projects generate serving, analytics, or inference workspaces
- DSA projects generate practice workspaces with sample problems and runner/test setup

Each generated project also includes:

- `.cursorrules`
- `docs/AGENTS.md`
- `docs/instructions.md`
- stack-specific `README.md`

## Development

### Setup

```bash
npm install
npm run build
```

### Run Locally

```bash
npm run dev
```

### Test

```bash
npm test
```

## Developer Docs

- Contribution guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Local development: [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)
- Architecture: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- CI / CD: [docs/CI_CD.md](./docs/CI_CD.md)

## Project Structure

```text
src/
├── cli.ts
├── generator.ts
├── workflow.ts
├── types.ts
├── templates/
├── frontend/
├── aiml/
├── dsa/
└── __tests__/
```

## Notes

- Only implemented stacks are shown in the workflow
- Some older static templates still exist in the repository, but the main CLI path is now app-type driven
- Frontend generation prefers provider-style baselines when applicable, with deterministic post-processing afterward

## License

MIT
