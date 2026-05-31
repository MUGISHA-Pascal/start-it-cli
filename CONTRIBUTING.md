# Contributing to start-it

This repository now uses an app-type-driven generation workflow. Contributions should fit that architecture rather than only adding flat static templates.

## Prerequisites

- Node.js 14+
- npm 6+
- TypeScript

## Local Setup

```bash
npm install
npm run build
npm test
```

Run the CLI locally with:

```bash
npm run dev
```

## Current Generator Architecture

The main flow is:

1. `src/cli.ts`
2. `src/workflow.ts`
3. `src/generator.ts`
4. stack-specific scaffold or template builder

There are currently multiple generation paths:

- `src/templates/`
  - deterministic backend/template builders and older static templates
- `src/frontend/`
  - frontend provider-baseline plus customization flow
- `src/aiml/`
  - AI/ML deterministic scaffolds
- `src/dsa/`
  - DSA-specific deterministic scaffolds

## When Adding A New Stack

1. Add the stack to the appropriate app type in [src/workflow.ts](/home/polo/Documents/Start%20It%20-%20CLI/src/workflow.ts:1).
2. Extend the relevant types in [src/types.ts](/home/polo/Documents/Start%20It%20-%20CLI/src/types.ts:1).
3. Add stack-aware prompt handling in [src/cli.ts](/home/polo/Documents/Start%20It%20-%20CLI/src/cli.ts:1).
4. Route generation in [src/generator.ts](/home/polo/Documents/Start%20It%20-%20CLI/src/generator.ts:1) if the stack needs its own scaffold path.
5. Implement the scaffold or builder in the correct module:
   - backend template builders in `src/templates/`
   - frontend in `src/frontend/`
   - AI/ML in `src/aiml/`
   - DSA in `src/dsa/`
6. Add generator coverage in [src/__tests__/generator.test.ts](/home/polo/Documents/Start%20It%20-%20CLI/src/__tests__/generator.test.ts:1).
7. Update the docs in `README.md` and `QUICK_START.md`.

## When Updating Existing Stacks

- Keep generation deterministic
- Prefer typed config changes over loosely adding raw option fields
- Keep prompts constrained to guided choices where possible
- Preserve stack-specific next-step instructions

## Project Structure

```text
src/
├── __tests__/
├── aiml/
├── dsa/
├── frontend/
├── templates/
├── cli.ts
├── generator.ts
├── types.ts
└── workflow.ts
```

## Testing Expectations

- Add or update tests for every new generation path
- Ensure `npm test` passes
- Ensure `npm run build` passes

## Code Style

- Follow existing TypeScript conventions
- Keep changes typed and explicit
- Prefer clear, deterministic file generation over opaque magic
- Update user-facing docs when behavior changes

## Submitting Changes

1. Create a branch
2. Make the change
3. Run `npm test`
4. Run `npm run build`
5. Open a pull request with a focused description

## Reporting Issues

Include:

- the selected app type and stack
- the prompt choices used
- expected behavior
- actual behavior
- Node version and OS

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
