import {
  AIProvider,
  AIProjectRequest,
  AIRecommendation,
  DependencyRecommendation,
  FileStructure,
} from "./types";

export class SmartAIProvider implements AIProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || "";
    this.baseUrl = process.env.AI_BASE_URL || "https://api.openai.com/v1";
  }

  async generateProject(request: AIProjectRequest): Promise<AIRecommendation> {
    // Fallback to rule-based recommendations if no API key
    if (!this.apiKey) {
      return this.generateRuleBasedRecommendation(request);
    }

    const prompt = this.buildProjectPrompt(request);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseAIResponse(data.choices[0].message.content);
    } catch (error) {
      console.warn(
        "AI service unavailable, falling back to rule-based recommendations"
      );
      return this.generateRuleBasedRecommendation(request);
    }
  }

  async analyzeRequirements(description: string): Promise<string[]> {
    const features = [
      "authentication",
      "database",
      "api",
      "frontend",
      "backend",
      "testing",
      "logging",
      "monitoring",
      "cache",
      "queue",
      "websocket",
      "file-upload",
      "email",
      "payment",
      "search",
    ];

    const found: string[] = [];
    const lowerDesc = description.toLowerCase();

    features.forEach((feature) => {
      if (this.containsFeature(lowerDesc, feature)) {
        found.push(feature);
      }
    });

    return found;
  }

  async suggestDependencies(
    framework: string,
    features: string[]
  ): Promise<DependencyRecommendation[]> {
    const dependencyMap: Record<
      string,
      Record<string, DependencyRecommendation>
    > = {
      "Node.js": {
        authentication: {
          name: "passport",
          purpose: "Authentication middleware",
          optional: false,
        },
        database: { name: "mongoose", purpose: "MongoDB ODM", optional: false },
        api: { name: "express", purpose: "Web framework", optional: false },
        testing: {
          name: "jest",
          purpose: "Testing framework",
          optional: false,
        },
        logging: {
          name: "winston",
          purpose: "Logging library",
          optional: true,
        },
        monitoring: {
          name: "prometheus-client",
          purpose: "Metrics collection",
          optional: true,
        },
        cache: { name: "redis", purpose: "Caching layer", optional: true },
        queue: { name: "bull", purpose: "Job queue", optional: true },
      },
      Go: {
        authentication: {
          name: "github.com/golang-jwt/jwt",
          purpose: "JWT tokens",
          optional: false,
        },
        database: {
          name: "gorm.io/gorm",
          purpose: "ORM library",
          optional: false,
        },
        api: {
          name: "github.com/gin-gonic/gin",
          purpose: "Web framework",
          optional: false,
        },
        testing: {
          name: "github.com/stretchr/testify",
          purpose: "Testing utilities",
          optional: false,
        },
        logging: {
          name: "github.com/sirupsen/logrus",
          purpose: "Structured logging",
          optional: true,
        },
        monitoring: {
          name: "github.com/prometheus/client_golang",
          purpose: "Metrics",
          optional: true,
        },
      },
      Python: {
        authentication: {
          name: "django-auth",
          purpose: "Django auth system",
          optional: false,
        },
        database: { name: "sqlalchemy", purpose: "SQL ORM", optional: false },
        api: {
          name: "fastapi",
          purpose: "Modern web framework",
          optional: false,
        },
        testing: {
          name: "pytest",
          purpose: "Testing framework",
          optional: false,
        },
        logging: {
          name: "structlog",
          purpose: "Structured logging",
          optional: true,
        },
        monitoring: {
          name: "prometheus-client",
          purpose: "Metrics",
          optional: true,
        },
      },
    };

    const frameworkDeps = dependencyMap[framework] || {};
    return features.map((feature) => frameworkDeps[feature]).filter(Boolean);
  }

  private containsFeature(description: string, feature: string): boolean {
    const keywords = this.getFeatureKeywords(feature);
    return keywords.some((keyword) => description.includes(keyword));
  }

  private getFeatureKeywords(feature: string): string[] {
    const keywordMap: Record<string, string[]> = {
      authentication: ["auth", "login", "user", "session", "token", "jwt"],
      database: ["database", "db", "storage", "persist", "model", "orm"],
      api: ["api", "rest", "endpoint", "service", "backend"],
      frontend: ["ui", "frontend", "interface", "gui", "web"],
      backend: ["backend", "server", "service", "logic"],
      testing: ["test", "spec", "unit", "integration"],
      logging: ["log", "audit", "track", "monitor"],
      monitoring: ["monitor", "metrics", "analytics", "performance"],
      cache: ["cache", "redis", "memory", "fast"],
      queue: ["queue", "job", "task", "worker", "background"],
      websocket: ["websocket", "real-time", "socket", "live"],
      "file-upload": ["upload", "file", "image", "document"],
      email: ["email", "mail", "notification", "send"],
      payment: ["payment", "stripe", "billing", "subscription"],
      search: ["search", "elasticsearch", "query", "filter"],
    };

    return keywordMap[feature] || [feature];
  }

  private generateRuleBasedRecommendation(
    request: AIProjectRequest
  ): AIRecommendation {
    const framework = request.framework || this.suggestFramework(request);
    const template = this.suggestTemplate(framework, request);

    // Generate basic file structure based on framework and description
    const structure = this.generateBasicFileStructure(
      framework,
      template,
      request
    );

    return {
      framework,
      template,
      dependencies: this.generateBasicDependencies(framework, request.features),
      structure,
      reasoning: `Based on your requirements: ${request.description}, I recommend ${framework} with ${template} template.`,
    };
  }

  private generateBasicFileStructure(
    framework: string,
    template: string,
    request: AIProjectRequest
  ): any[] {
    const files = [];

    // Basic package.json
    files.push({
      path: "package.json",
      content: this.generatePackageJson(framework, request),
      description: "Package configuration",
      isExecutable: false,
    });

    // Main application file
    files.push({
      path: this.getMainFilePath(framework),
      content: this.generateMainFile(framework, template, request),
      description: "Main application entry point",
      isExecutable: true,
    });

    // Add framework-specific files
    if (framework === "Node.js" && request.features.includes("api")) {
      files.push({
        path: "src/routes/index.ts",
        content: this.generateBasicRoutes(request),
        description: "API routes",
        isExecutable: false,
      });
    }

    if (request.features.includes("database")) {
      files.push({
        path: "src/models/index.ts",
        content: this.generateBasicModels(request),
        description: "Database models",
        isExecutable: false,
      });
    }

    return files;
  }

  private generatePackageJson(
    framework: string,
    request: AIProjectRequest
  ): string {
    const basePackage = {
      name: "generated-project",
      version: "1.0.0",
      description: request.description,
      main: this.getMainFilePath(framework),
      scripts: {
        start: framework === "Node.js" ? "node dist/index.js" : "start",
        dev: framework === "Node.js" ? "ts-node src/index.ts" : "dev",
        build: framework === "Node.js" ? "tsc" : "build",
      },
      dependencies: {},
      devDependencies:
        framework === "Node.js"
          ? {
              "@types/node": "^20.0.0",
              typescript: "^5.0.0",
              "ts-node": "^10.0.0",
            }
          : {},
    };

    return JSON.stringify(basePackage, null, 2);
  }

  private generateMainFile(
    framework: string,
    template: string,
    request: AIProjectRequest
  ): string {
    if (framework === "Node.js") {
      return `// Auto-generated ${template} for ${request.description}
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: '${request.description} API' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

export default app;`;
    }

    return `// Generated ${framework} application
console.log('${request.description}');`;
  }

  private generateBasicRoutes(request: AIProjectRequest): string {
    return `// API routes for ${request.description}
import { Router } from 'express';

const router = Router();

// Example routes based on project description
router.get('/', (req, res) => {
  res.json({ message: '${request.description} API endpoints' });
});

${
  request.features.includes("authentication")
    ? `
router.post('/auth/login', (req, res) => {
  // Login logic here
  res.json({ token: 'sample-token' });
});

router.post('/auth/register', (req, res) => {
  // Registration logic here
  res.json({ message: 'User registered' });
});
`
    : ""
}

${
  request.features.includes("database")
    ? `
router.get('/data', (req, res) => {
  // Data retrieval logic here
  res.json({ data: [] });
});

router.post('/data', (req, res) => {
  // Data creation logic here
  res.json({ message: 'Data created' });
});
`
    : ""
}

export default router;`;
  }

  private generateBasicModels(request: AIProjectRequest): string {
    return `// Database models for ${request.description}
export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

${
  request.features.includes("authentication")
    ? `
export interface User extends BaseModel {
  email: string;
  password: string;
  name: string;
}
`
    : ""
}

${
  request.description.toLowerCase().includes("hospital")
    ? `
export interface Patient extends BaseModel {
  name: string;
  dateOfBirth: Date;
  medicalRecord: string;
}

export interface Doctor extends BaseModel {
  name: string;
  specialization: string;
  licenseNumber: string;
}
`
    : ""
}`;
  }

  private getMainFilePath(framework: string): string {
    switch (framework) {
      case "Node.js":
        return "src/index.ts";
      case "Python":
        return "main.py";
      case "Go":
        return "main.go";
      default:
        return "index.js";
    }
  }

  private generateBasicDependencies(
    framework: string,
    features: string[]
  ): any[] {
    const deps = [];

    if (framework === "Node.js") {
      deps.push({
        name: "express",
        version: "^4.18.0",
        purpose: "Web framework",
        optional: false,
      });
      deps.push({
        name: "cors",
        version: "^2.8.5",
        purpose: "CORS support",
        optional: false,
      });

      if (features.includes("database")) {
        deps.push({
          name: "mongoose",
          version: "^7.0.0",
          purpose: "MongoDB ODM",
          optional: false,
        });
      }

      if (features.includes("authentication")) {
        deps.push({
          name: "jsonwebtoken",
          version: "^9.0.0",
          purpose: "JWT tokens",
          optional: false,
        });
        deps.push({
          name: "bcryptjs",
          version: "^2.4.3",
          purpose: "Password hashing",
          optional: false,
        });
      }
    }

    return deps;
  }

  private suggestFramework(request: AIProjectRequest): string {
    const desc = request.description.toLowerCase();

    if (desc.includes("mobile") || desc.includes("app")) {
      return desc.includes("cross-platform") ? "Flutter" : "React Native";
    }
    if (desc.includes("enterprise") || desc.includes("java")) {
      return "Spring Boot";
    }
    if (
      desc.includes("python") ||
      desc.includes("ml") ||
      desc.includes("data")
    ) {
      return "Python";
    }
    if (desc.includes("performance") || desc.includes("concurrent")) {
      return "Go";
    }

    return "Node.js"; // Default
  }

  private suggestTemplate(
    framework: string,
    request: AIProjectRequest
  ): string {
    const desc = request.description.toLowerCase();
    const scale = request.scale;

    switch (framework) {
      case "Node.js":
        if (desc.includes("api") || desc.includes("backend"))
          return "Express API";
        if (desc.includes("fullstack") || desc.includes("ssr"))
          return "Next.js";
        return "TypeScript Project";

      case "Go":
        if (desc.includes("api") || desc.includes("web")) return "Web API";
        if (scale === "large") return "Microservice";
        return "Basic CLI";

      case "Flutter":
        if (desc.includes("web")) return "Web App";
        if (desc.includes("desktop")) return "Desktop App";
        return "Mobile App";

      case "Python":
        if (desc.includes("api") || desc.includes("fast")) return "FastAPI";
        if (desc.includes("full") || desc.includes("admin")) return "Django";
        return "Flask";

      default:
        return "Basic";
    }
  }

  private buildProjectPrompt(request: AIProjectRequest): string {
    return `
As an expert software architect and full-stack developer, analyze this project request and generate a complete, production-ready project:

Project Description: ${request.description}
Preferred Framework: ${request.framework || "Auto-detect"}
Key Features: ${request.features.join(", ")}
Project Scale: ${request.scale}
Deployment Target: ${request.deployment || "Not specified"}

Generate a JSON response with:
1. Recommended framework and template
2. Essential dependencies with purposes and versions
3. Complete file structure with ACTUAL CODE CONTENT
4. Clear reasoning for choices

For each file, provide real, working code that implements the described functionality. Include:
- Package.json with proper dependencies
- Main application files with actual implementation
- Configuration files
- Example routes/models/controllers based on the description
- Basic error handling and validation
- Proper TypeScript types if applicable

Format as:
{
  "framework": "...",
  "template": "...",
  "dependencies": [{"name": "...", "version": "...", "purpose": "...", "optional": false}],
  "structure": [
    {
      "path": "package.json",
      "content": "...",
      "description": "Package configuration",
      "isExecutable": false
    },
    {
      "path": "src/index.ts",
      "content": "...",
      "description": "Main application entry point",
      "isExecutable": true
    }
  ],
  "reasoning": "..."
}

IMPORTANT: Provide complete, working code files that would actually run and implement the described functionality.
`;
  }

  private parseAIResponse(response: string): AIRecommendation {
    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error("Invalid AI response format");
    }
  }
}
