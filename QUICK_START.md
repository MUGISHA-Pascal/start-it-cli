# Quick Start Guide

Get a project scaffolded with the current guided workflow in a few minutes.

## Install

```bash
npm install -g start-it-cli
```

Or run directly:

```bash
npx start-it-cli
```

## Create A Project

```bash
start-it-cli
```

The CLI will ask for:

1. app type
2. implemented stack
3. stack-specific options
4. project name
5. project profile and domain

## Supported App Types

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

## Typical Next Steps

After generation:

```bash
cd my-app
cat README.md
```

### Node.js + Express / NestJS

```bash
npm install
```

### Python + FastAPI

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### React + Vite / Next.js

```bash
npm install
npm run dev
```

### Python + FastAPI Serving

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### R Analytics Pipeline

```bash
Rscript scripts/run_pipeline.R
```

### C++ Inference Utility / DSA C++

```bash
cmake -S . -B build
cmake --build build
```

### DSA Python

```bash
python main.py < examples/sample_input.txt
```

## Example Prompt Paths

### Backend

```text
Backend -> Node.js + TypeScript + Express -> databases/security/logging/testing
```

### Frontend

```text
Frontend -> React + Vite -> routing/styling/state/testing
```

### AI / ML

```text
AI / ML -> Python + FastAPI Serving -> serving/tracking/validation/testing
```

### DSA

```text
DSA-specific -> C++ or Python -> track/input mode/verification
```

## Development

```bash
npm install
npm run build
npm test
```

## More Detail

- Main overview: [README.md](./README.md)
- Contribution guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
