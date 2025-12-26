# start-it

A prompt-based CLI tool to scaffold projects for various frameworks and languages.

## Features

- Interactive prompt-based project setup
- **AI-Powered project generation** with intelligent code generation
- Traditional template-based scaffolding
- Support for multiple frameworks:
  - Go
  - Flutter
  - React Native
  - Spring Boot
  - Node.js
  - Python
- Beautiful CLI interface with colors and spinners
- Fast project scaffolding
- Context-aware code generation based on project description
- Feature-based file creation (authentication, database, API, etc.)

## Installation

```bash
npm install -g start-it-cli
```

Or use with `npx`:

```bash
npx start-it-cli
```

## Usage

Simply run the command:

```bash
start-it-cli
```

Then follow the interactive prompts to:

1. **Choose generation method**: Traditional (Template-based) or AI-Powered (Smart recommendations)
2. **For Traditional**: Select your project type (Go, Flutter, React Native, Spring Boot, etc.)
3. **For AI-Powered**: Describe your project in natural language
4. Enter your project name
5. Choose additional options based on your framework or AI recommendations
6. Watch as your project is scaffolded automatically

### AI-Powered Generation

The AI feature analyzes your project description and generates:

- **Smart framework recommendations** based on your requirements
- **Contextual code** tailored to your specific use case
- **Feature-based architecture** (authentication, database, API routes, etc.)
- **Production-ready file structure** with actual working code
- **Domain-specific models** (e.g., Patient/Doctor models for hospital systems)

Example AI workflow:

```bash
$ start-it-cli
? Choose project generation method: AI-Powered (Smart recommendations)
? Project name: hospital-management
? Describe your project: A comprehensive hospital management system with patient records
? Project scale: large
? Select features you need: authentication, database, api, frontend, backend, testing

AI Recommendations:
Framework: Node.js
Template: TypeScript Project
Reasoning: Based on your requirements, I recommend Node.js with TypeScript for scalability

Generated Files:
- package.json: Complete with dependencies for auth, database, testing
- src/index.ts: Express server with middleware setup
- src/routes/index.ts: API endpoints for hospital operations
- src/models/index.ts: Patient, Doctor, and User interfaces
```

## Example

```bash
$ start-it-cli
? What type of project would you like to create? (Use arrow keys)
❯ Go
  Flutter
  React Native
  Spring Boot
  Node.js
  Python

? Project name: my-awesome-app
? Select Go template: (Use arrow keys)
❯ Basic CLI
  Web API
  Microservice

Project created successfully!
```

## Supported Frameworks

### Go

- Basic CLI application
- Web API (using Gin)
- Microservice template

### Flutter

- Mobile app
- Web app
- Desktop app

### React Native

- Expo project
- Bare React Native project

### Spring Boot

- REST API
- Web application
- Microservice

### Node.js

- Express API
- Next.js application
- TypeScript project

### Python

- Django project
- Flask application
- FastAPI service

## Development

### Setup

```bash
npm install
npm run build
```

### Development Mode

```bash
npm run dev
```

### Testing

```bash
npm test
```

## License

MIT
