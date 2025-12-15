# start-it

A prompt-based CLI tool to scaffold projects for various frameworks and languages.

## Features

- Interactive prompt-based project setup
- Support for multiple frameworks:
  - Go
  - Flutter
  - React Native
  - Spring Boot
  - Node.js
  - Python
- Beautiful CLI interface with colors and spinners
- Fast project scaffolding

## Installation

```bash
npm install -g start-it
```

Or use with `npx`:

```bash
npx start-it
```

## Usage

Simply run the command:

```bash
start-it
```

Then follow the interactive prompts to:

1. Select your project type (Go, Flutter, React Native, Spring Boot, etc.)
2. Enter your project name
3. Choose additional options based on your framework
4. Watch as your project is scaffolded automatically

## Example

```bash
$ start-it
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
