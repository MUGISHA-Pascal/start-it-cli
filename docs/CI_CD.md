# CI / CD Guide

This repository ships with GitHub Actions workflows for quality, security, Docker validation, and GHCR publishing.

## Workflows

### CI

File:

- `.github/workflows/ci.yml`

Behavior:

- installs dependencies
- runs `npm run build`
- runs `npm test`
- runs a CLI `--help` smoke test
- runs `npm pack --dry-run`

### Security

File:

- `.github/workflows/security.yml`

Behavior:

- dependency review on pull requests
- `npm audit` checks
- CodeQL analysis
- Trivy filesystem scan with SARIF upload

### Docker

File:

- `.github/workflows/docker.yml`

Behavior:

- validates Docker builds on pull requests
- runs Trivy image scan on PR builds
- pushes images to GHCR on `main`, `master`, and version tags

## Container Image

Files:

- `Dockerfile`
- `.dockerignore`

The image builds the CLI in a builder stage and ships a runtime image that executes:

```bash
node dist/cli.js
```

## GHCR Publishing

Published image name:

```text
ghcr.io/<owner>/<repo>
```

Tags are generated from:

- branch refs
- git tags
- commit SHA
- `latest` on the default branch

## Local Validation Before Push

```bash
npm test
npm run build
docker build -t start-it-cli:local .
```

## When Updating Workflows

- keep local build/test commands aligned with CI
- avoid adding checks that the repo cannot satisfy locally
- document new workflow expectations in this file
