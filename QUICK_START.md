# Quick Start Guide

Get up and running with start-it-cli in 2 minutes!

## Installation

```bash
npm install -g start-it-cli
```

## Create Your First Project

```bash
start-it-cli
```

Then answer the prompts:

1. **Select Framework** - Choose from Go, Flutter, React Native, Spring Boot, Node.js, or Python
2. **Project Name** - Enter your project name (e.g., `my-app`)
3. **Select Template** - Choose a template variant for your framework

That's it! Your project is ready.

## Next Steps

Navigate to your project and follow the README:

```bash
cd my-app
cat README.md
```

## Common Commands by Framework

### Go

```bash
cd my-go-app
go mod download
go run main.go
```

### Flutter

```bash
cd my-flutter-app
flutter pub get
flutter run
```

### React Native (Expo)

```bash
cd my-rn-app
npm install
npm start
```

### Spring Boot

```bash
cd my-spring-app
mvn clean package
mvn spring-boot:run
```

### Node.js (Express)

```bash
cd my-node-app
npm install
npm run dev
```

### Python (FastAPI)

```bash
cd my-python-app
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

## Frameworks & Templates

| Framework        | Templates                        |
| ---------------- | -------------------------------- |
| **Go**           | Basic CLI, Web API, Microservice |
| **Flutter**      | Mobile App, Web App, Desktop App |
| **React Native** | Expo, Bare React Native          |
| **Spring Boot**  | REST API, Web App, Microservice  |
| **Node.js**      | Express API, Next.js, TypeScript |
| **Python**       | Django, Flask, FastAPI           |

## Need Help?

- **Installation Issues?** → See [INSTALLATION.md](./INSTALLATION.md)
- **More Examples?** → See [EXAMPLES.md](./EXAMPLES.md)
- **Want to Contribute?** → See [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Full Details?** → See [README.md](./README.md)

## Tips

- Project names can only contain letters, numbers, hyphens, and underscores
- Each template includes a README with framework-specific instructions
- All projects are ready to build and deploy
- Templates include example code and best practices

---

**Happy coding!**
