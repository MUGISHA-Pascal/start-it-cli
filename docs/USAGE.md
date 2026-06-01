# Usage Reference

This document covers the command-line usage patterns for `start-it-cli`, including interactive, partially guided, and non-interactive generation.

## Basic Usage

Run the CLI in fully guided mode:

```bash
start-it-cli
```

Or provide the project name up front:

```bash
start-it-cli my-app
```

## Output Directory

Use `--path`, `--dir`, or `--directory` to choose the base directory where the project folder will be created:

```bash
start-it-cli my-app --path ~/projects
```

This creates:

```text
~/projects/my-app
```

## Core Flags

```text
--name, --project-name <name>
--path, --dir, --directory <path>
--app-type <backend|frontend|ai-ml|dsa-specific>
--stack <stack>
--profile <exam|startup|production>
--domain <label>
--app-name <name>
--yes, --non-interactive
--help
```

## Interactive vs Non-Interactive

### Fully Interactive

```bash
start-it-cli
```

The CLI asks for everything.

### Partially Guided

```bash
start-it-cli fire_extinguisher_ms --app-type backend --stack python-fastapi
```

The provided values are used directly, and the remaining values are prompted for.

### Non-Interactive Defaults

```bash
start-it-cli fire_extinguisher_ms --app-type backend --stack python-fastapi --yes
```

Any missing values are filled from defaults instead of prompting.

## Stack Selection

If you provide `--stack` without `--app-type`, the CLI infers the app type automatically when possible.

Example:

```bash
start-it-cli ui-console --stack react-vite --yes
```

## Backend Flags

```text
--databases <csv>
--security-preset <none|bcrypt|argon2|bcrypt-jwt|argon2-jwt>
--logging <value>
--monitoring <none|health-only|prometheus-ready>
--testing <value>
```

Example:

```bash
start-it-cli fire_extinguisher_ms \
  --app-type backend \
  --stack python-fastapi \
  --path ~/services \
  --profile production \
  --databases postgresql,redis \
  --security-preset bcrypt-jwt \
  --logging structlog \
  --monitoring prometheus-ready \
  --testing pytest-httpx
```

## Frontend Flags

```text
--routing <none|react-router>
--next-router <app-router|pages-router>
--styling <plain-css|tailwind>
--ui-addon <none|shadcn-ui>
--state-management <none|context|zustand>
--data-fetching <fetch|tanstack-query>
--testing <value>
```

Example:

```bash
start-it-cli ops-console \
  --stack react-vite \
  --profile startup \
  --styling tailwind \
  --ui-addon shadcn-ui \
  --state-management zustand \
  --data-fetching tanstack-query \
  --testing vitest-rtl \
  --yes
```

## AI / ML Flags

```text
--serving-mode <value>
--execution-mode <value>
--runtime-mode <value>
--model-packaging <value>
--tracking <value>
--validation <value>
--logging <value>
--testing <value>
```

Example:

```bash
start-it-cli model-serving \
  --stack python-fastapi-serving \
  --profile production \
  --serving-mode realtime-plus-batch \
  --model-packaging mlflow-ready \
  --tracking mlflow \
  --validation pydantic-plus-pandera \
  --logging structlog \
  --testing pytest-httpx \
  --yes
```

## DSA Flags

```text
--track <competitive-programming|interview-prep>
--input-mode <stdin-stdout|function-first>
--testing <manual-cases|ctest|pytest>
```

Example:

```bash
start-it-cli algo-lab \
  --stack dsa-python \
  --track interview-prep \
  --input-mode function-first \
  --testing pytest \
  --yes
```

## Help

Print the command reference:

```bash
start-it-cli --help
```
