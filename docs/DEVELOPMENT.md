# Development Guide

This document covers local development workflow for `start-it-cli`.

## Prerequisites

- Node.js 18+ recommended
- npm

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

This compiles TypeScript from `src/` into `dist/`.

## Run Locally

Interactive mode:

```bash
npm run dev
```

Command-driven examples:

```bash
npm run dev -- my-app --stack react-vite --yes
```

```bash
npm run dev -- fire_extinguisher_ms --app-type backend --stack python-fastapi --path /tmp --yes
```

## Test

```bash
npm test
```

The test suite validates generated project structure and generated guidance artifacts.

## Common Workflow

1. Update prompt, config, or generation logic.
2. Run `npm test`.
3. Run `npm run build`.
4. Update user-facing docs if CLI behavior changed.

## Where To Work

- `src/cli.ts`
  - CLI parsing and prompts
- `src/workflow.ts`
  - available app types and stacks
- `src/generator.ts`
  - generation routing
- `src/templates/`
  - backend builders and older static templates
- `src/frontend/`
  - frontend scaffolders
- `src/aiml/`
  - AI/ML scaffolders
- `src/dsa/`
  - DSA scaffolders
- `src/agent/`
  - AI guidance composition

## Packaging Smoke Check

```bash
npm pack --dry-run
```

## Docker Smoke Check

```bash
docker build -t start-it-cli:local .
docker run --rm start-it-cli:local --help
```
