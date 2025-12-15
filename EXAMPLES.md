# start-it Examples

## Installation

### Global Installation

```bash
npm install -g start-it
```

### Local Installation

```bash
npm install start-it
npx start-it
```

## Usage Examples

### Creating a Go Project

```bash
$ start-it
? What type of project would you like to create? Go
? Project name: my-go-app
? Select Go template: Web API

✓ Project created successfully!

Next steps:
  cd my-go-app
  Follow the README.md for further instructions
```

Then navigate to your project:

```bash
cd my-go-app
go mod download
go run main.go
```

### Creating a Flutter Mobile App

```bash
$ start-it
? What type of project would you like to create? Flutter
? Project name: my-flutter-app
? Select Flutter template: Mobile App

✓ Project created successfully!

Next steps:
  cd my-flutter-app
  Follow the README.md for further instructions
```

Then:

```bash
cd my-flutter-app
flutter pub get
flutter run
```

### Creating a React Native App with Expo

```bash
$ start-it
? What type of project would you like to create? React Native
? Project name: my-rn-app
? Select React Native template: Expo

✓ Project created successfully!

Next steps:
  cd my-rn-app
  Follow the README.md for further instructions
```

Then:

```bash
cd my-rn-app
npm install
npm start
```

### Creating a Spring Boot REST API

```bash
$ start-it
? What type of project would you like to create? Spring Boot
? Project name: my-api
? Select Spring Boot template: REST API

✓ Project created successfully!

Next steps:
  cd my-api
  Follow the README.md for further instructions
```

Then:

```bash
cd my-api
mvn clean package
mvn spring-boot:run
```

### Creating a Node.js Express API

```bash
$ start-it
? What type of project would you like to create? Node.js
? Project name: my-express-api
? Select Node.js template: Express API

✓ Project created successfully!

Next steps:
  cd my-express-api
  Follow the README.md for further instructions
```

Then:

```bash
cd my-express-api
npm install
npm run dev
```

### Creating a Next.js Application

```bash
$ start-it
? What type of project would you like to create? Node.js
? Project name: my-nextjs-app
? Select Node.js template: Next.js

✓ Project created successfully!

Next steps:
  cd my-nextjs-app
  Follow the README.md for further instructions
```

Then:

```bash
cd my-nextjs-app
npm install
npm run dev
```

### Creating a Python FastAPI Service

```bash
$ start-it
? What type of project would you like to create? Python
? Project name: my-fastapi-service
? Select Python template: FastAPI

✓ Project created successfully!

Next steps:
  cd my-fastapi-service
  Follow the README.md for further instructions
```

Then:

```bash
cd my-fastapi-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Creating a Django Application

```bash
$ start-it
? What type of project would you like to create? Python
? Project name: my-django-app
? Select Python template: Django

✓ Project created successfully!

Next steps:
  cd my-django-app
  Follow the README.md for further instructions
```

Then:

```bash
cd my-django-app
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Available Templates

### Go

- **Basic CLI** - Command-line application with argument parsing
- **Web API** - REST API using Gin framework
- **Microservice** - Microservice with health checks and service discovery

### Flutter

- **Mobile App** - Native mobile application
- **Web App** - Web application using Flutter for web
- **Desktop App** - Desktop application (Windows, macOS, Linux)

### React Native

- **Expo** - Managed React Native with Expo
- **Bare React Native** - Bare React Native project

### Spring Boot

- **REST API** - RESTful API with Spring Web
- **Web Application** - Web app with Thymeleaf templates
- **Microservice** - Microservice with actuator endpoints

### Node.js

- **Express API** - REST API with Express.js
- **Next.js** - Full-stack React framework
- **TypeScript Project** - Pure TypeScript project

### Python

- **Django** - Full-featured web framework
- **Flask** - Lightweight web framework
- **FastAPI** - Modern async API framework

## Project Structure

Each generated project includes:

- Pre-configured build and development scripts
- TypeScript/language-specific configuration
- .gitignore file
- README with setup instructions
- Example code and endpoints

## Development

To contribute or modify templates, clone the repository and edit the template files in `src/templates/`.

```bash
git clone <repository>
cd start-it
npm install
npm run build
npm run dev
```

## License

MIT
