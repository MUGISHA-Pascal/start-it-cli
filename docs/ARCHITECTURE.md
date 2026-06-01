# Architecture

`start-it-cli` is organized around a typed generation pipeline.

## Main Flow

1. `src/cli.ts`
2. `src/workflow.ts`
3. `src/generator.ts`
4. stack-specific generator
5. AI-control artifact injection

## Pipeline Stages

### 1. CLI Input

`src/cli.ts` handles:

- interactive prompts
- command-line flags
- partial prompt fallback
- normalization into `ProjectConfig`

`ProjectConfig` is the contract between the CLI and generation logic.

### 2. Workflow Registry

`src/workflow.ts` defines:

- available app types
- available stacks per app type
- framework inference per stack

## Generation Paths

### Backend

Backend generation is mostly builder-based.

- `src/templates/node.ts`
- `src/templates/nest.ts`
- `src/templates/fastapi.ts`

Those return `TemplateConfig` objects that are written to disk by `src/generator.ts`.

### Frontend

Frontend generation uses a baseline-plus-customization model.

- `src/frontend/scaffold.ts`

Behavior:

- prefer provider-native baseline when possible
- fall back to local baseline when necessary
- apply deterministic customizations afterward

### AI / ML

AI/ML generation is deterministic and direct-to-filesystem.

- `src/aiml/scaffold.ts`

### DSA

DSA generation is deterministic and workspace-oriented.

- `src/dsa/scaffold.ts`

## AI Guidance Layer

Every generated project gets:

- `.cursorrules`
- `.agentignore`
- `docs/AGENTS.md`
- `docs/instructions.md`

Composition lives in:

- `src/agent/composer.ts`

The guidance system is layered:

- shared blocks
- profile blocks
- app-type blocks
- stack blocks
- option blocks
- operational composition

## Legacy AI Path

There is still a secondary AI path in:

- `src/ai/generator.ts`
- `src/ai/provider.ts`

This path can use an inference provider or a rule-based fallback. It is not the main generation flow anymore.
