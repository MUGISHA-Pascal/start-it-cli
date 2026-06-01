import {
  BackendDatabase,
  BackendGenerationConfig,
  ProjectConfig,
  TemplateConfig,
  TemplateOptions,
} from "../types";

const DATABASE_LABELS: Record<BackendDatabase, string> = {
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  mongodb: "MongoDB",
  redis: "Redis",
  duckdb: "DuckDB",
};

export function buildFastApiTemplate(config: ProjectConfig): TemplateConfig {
  const options = getBackendOptions(config);

  return {
    name: options.template,
    description: "Configurable FastAPI backend scaffold",
    files: [
      {
        path: "requirements.txt",
        content: buildRequirements(options),
      },
      {
        path: ".env.example",
        content: buildEnvExample(options),
      },
      {
        path: "app/__init__.py",
        content: "",
      },
      {
        path: "app/main.py",
        content: `from fastapi import FastAPI

from app.api.routes import router
from app.core.logging import configure_logging
from app.core.settings import settings

configure_logging()

app = FastAPI(title=settings.app_name)
app.include_router(router)
`,
      },
      {
        path: "app/api/__init__.py",
        content: "",
      },
      {
        path: "app/api/routes.py",
        content: buildRoutes(options),
      },
      {
        path: "app/core/__init__.py",
        content: "",
      },
      {
        path: "app/core/settings.py",
        content: buildSettings(options),
      },
      {
        path: "app/core/logging.py",
        content: buildLogging(options),
      },
      {
        path: "app/core/security.py",
        content: buildSecurity(options),
      },
      {
        path: "app/db/__init__.py",
        content: "",
      },
      {
        path: "app/db/config.py",
        content: buildDatabaseConfig(options),
      },
      {
        path: "app/schemas/__init__.py",
        content: "",
      },
      {
        path: "app/schemas/example.py",
        content: `from pydantic import BaseModel, Field


class EchoRequest(BaseModel):
    message: str = Field(min_length=1)
`,
      },
      {
        path: "app/services/__init__.py",
        content: "",
      },
      {
        path: "app/services/example_service.py",
        content: `from datetime import datetime


class ExampleService:
    def describe(self) -> dict:
        return {
            "stack": "python-fastapi",
            "logging": "${options.logging}",
            "monitoring": "${options.monitoring}",
            "security_preset": "${options.securityPreset}",
            "databases": ${pythonListLiteral(options.databases)},
        }

    def echo(self, message: str) -> dict:
        return {
            "message": message,
            "received_at": datetime.utcnow().isoformat(),
        }


example_service = ExampleService()
`,
      },
      ...buildMetricsFiles(options),
      ...buildTests(options),
      {
        path: "README.md",
        content: buildReadme(config.projectName, options),
      },
      {
        path: ".gitignore",
        content: `__pycache__/
*.py[cod]
.pytest_cache/
.venv/
venv/
ENV/
.env
dist/
build/
.DS_Store
.vscode/
.idea/
`,
      },
    ],
  };
}

function getBackendOptions(config: ProjectConfig): BackendGenerationConfig {
  return {
    template: "FastAPI Service",
    stack: "python-fastapi",
    projectDescription: config.options?.projectDescription || "FastAPI backend service",
    appName: config.options?.appName || config.projectName,
    databases: config.options?.databases || [],
    securityPreset: config.options?.securityPreset || "none",
    logging: normalizeFastApiLogging(config.options?.logging),
    monitoring: config.options?.monitoring || "health-only",
    testing: normalizeFastApiTesting(config.options?.testing),
    apiStyle: config.options?.apiStyle || "rest",
  };
}

function normalizeFastApiTesting(
  testing: TemplateOptions["testing"] | undefined
): BackendGenerationConfig["testing"] {
  return testing === "pytest" || testing === "pytest-httpx"
    ? testing
    : "pytest-httpx";
}

function normalizeFastApiLogging(
  logging: TemplateOptions["logging"] | undefined
): BackendGenerationConfig["logging"] {
  return logging === "python-logging" || logging === "structlog"
    ? logging
    : "python-logging";
}

function buildRequirements(options: BackendGenerationConfig): string {
  const requirements = [
    "fastapi==0.115.0",
    "uvicorn[standard]==0.30.6",
    "pydantic==2.9.2",
    "pydantic-settings==2.5.2",
    "python-dotenv==1.0.1",
  ];

  if (options.securityPreset === "bcrypt" || options.securityPreset === "bcrypt-jwt") {
    requirements.push("bcrypt==4.2.0");
  }
  if (options.securityPreset === "argon2" || options.securityPreset === "argon2-jwt") {
    requirements.push("argon2-cffi==23.1.0");
  }
  if (options.securityPreset === "bcrypt-jwt" || options.securityPreset === "argon2-jwt") {
    requirements.push("python-jose[cryptography]==3.3.0");
  }
  if (options.logging === "structlog") {
    requirements.push("structlog==24.4.0");
  }
  if (options.monitoring === "prometheus-ready") {
    requirements.push("prometheus-client==0.21.0");
  }
  if (options.databases.includes("postgresql")) {
    requirements.push("psycopg[binary]==3.2.1");
  }
  if (options.databases.includes("mysql")) {
    requirements.push("mysqlclient==2.2.4");
  }
  if (options.databases.includes("mongodb")) {
    requirements.push("pymongo==4.8.0");
  }
  if (options.databases.includes("redis")) {
    requirements.push("redis==5.0.8");
  }
  if (options.databases.includes("duckdb")) {
    requirements.push("duckdb==1.1.0");
  }
  if (options.testing === "pytest" || options.testing === "pytest-httpx") {
    requirements.push("pytest==8.3.3");
  }
  if (options.testing === "pytest-httpx") {
    requirements.push("httpx==0.27.2");
  }

  return `${requirements.join("\n")}\n`;
}

function buildEnvExample(options: BackendGenerationConfig): string {
  const lines = [
    "NODE_ENV=development",
    "PORT=8000",
    `APP_NAME=${options.appName}`,
    "ALLOWED_ORIGINS=http://localhost:3000",
  ];

  if (options.databases.includes("postgresql")) {
    lines.push("POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/app");
  }
  if (options.databases.includes("mysql")) {
    lines.push("MYSQL_URL=mysql://root:password@localhost:3306/app");
  }
  if (options.databases.includes("mongodb")) {
    lines.push("MONGODB_URL=mongodb://localhost:27017/app");
  }
  if (options.databases.includes("redis")) {
    lines.push("REDIS_URL=redis://localhost:6379");
  }
  if (options.databases.includes("duckdb")) {
    lines.push("DUCKDB_PATH=./data/app.duckdb");
  }
  if (options.securityPreset === "bcrypt-jwt" || options.securityPreset === "argon2-jwt") {
    lines.push("JWT_SECRET=change-me");
  }

  return `${lines.join("\n")}\n`;
}

function buildSettings(options: BackendGenerationConfig): string {
  const optionalFields: string[] = [];

  if (options.databases.includes("postgresql")) {
    optionalFields.push("    postgres_url: str | None = None");
  }
  if (options.databases.includes("mysql")) {
    optionalFields.push("    mysql_url: str | None = None");
  }
  if (options.databases.includes("mongodb")) {
    optionalFields.push("    mongodb_url: str | None = None");
  }
  if (options.databases.includes("redis")) {
    optionalFields.push("    redis_url: str | None = None");
  }
  if (options.databases.includes("duckdb")) {
    optionalFields.push("    duckdb_path: str | None = None");
  }
  if (options.securityPreset === "bcrypt-jwt" || options.securityPreset === "argon2-jwt") {
    optionalFields.push("    jwt_secret: str | None = None");
  }

  return `from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "${options.appName}"
    port: int = 8000
    node_env: str = "development"
    allowed_origins: str = "http://localhost:3000"
${optionalFields.join("\n")}

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
`;
}

function buildLogging(options: BackendGenerationConfig): string {
  if (options.logging === "structlog") {
    return `import logging
import sys

import structlog


def configure_logging() -> None:
    logging.basicConfig(format="%(message)s", stream=sys.stdout, level=logging.INFO)
    structlog.configure(
        processors=[
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.JSONRenderer(),
        ]
    )
`;
  }

  return `import logging


def configure_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
`;
}

function buildSecurity(options: BackendGenerationConfig): string {
  if (options.securityPreset === "bcrypt" || options.securityPreset === "bcrypt-jwt") {
    return `import bcrypt
${jwtHelper(options)}


def hash_password(value: str) -> str:
    return bcrypt.hashpw(value.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def describe_security() -> str:
    return "${securityDescription(options.securityPreset)}"
`;
  }

  if (options.securityPreset === "argon2" || options.securityPreset === "argon2-jwt") {
    return `from argon2 import PasswordHasher
${jwtHelper(options)}

password_hasher = PasswordHasher()


def hash_password(value: str) -> str:
    return password_hasher.hash(value)


def describe_security() -> str:
    return "${securityDescription(options.securityPreset)}"
`;
  }

  return `def hash_password(value: str) -> str:
    return value


def describe_security() -> str:
    return "${securityDescription(options.securityPreset)}"
`;
}

function jwtHelper(options: BackendGenerationConfig): string {
  if (options.securityPreset !== "bcrypt-jwt" && options.securityPreset !== "argon2-jwt") {
    return "";
  }

  return `from jose import jwt

from app.core.settings import settings


def issue_token(subject: str) -> str:
    return jwt.encode({"sub": subject}, settings.jwt_secret or "change-me", algorithm="HS256")
`;
}

function buildDatabaseConfig(options: BackendGenerationConfig): string {
  const entries = options.databases.map((database) => ({
    key: database,
    name: DATABASE_LABELS[database],
  }));

  return `configured_databases = ${pythonDictListLiteral(entries)}


def describe_database_setup() -> str:
    if not configured_databases:
        return "No database selected"

    return ", ".join(database["name"] for database in configured_databases)
`;
}

function buildRoutes(options: BackendGenerationConfig): string {
  const metricsImport =
    options.monitoring === "prometheus-ready"
      ? "from app.metrics import metrics_router\n"
      : "";
  const metricsInclude =
    options.monitoring === "prometheus-ready"
      ? "router.include_router(metrics_router)\n"
      : "";

  return `from fastapi import APIRouter

from app.core.security import describe_security
from app.db.config import describe_database_setup
${metricsImport}from app.schemas.example import EchoRequest
from app.services.example_service import example_service

router = APIRouter()


@router.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "service": "${options.appName}",
        "databases": describe_database_setup(),
        "security": describe_security(),
    }


@router.get("/api/v1/examples")
def list_examples() -> dict:
    return {"data": example_service.describe()}


@router.post("/api/v1/examples/echo")
def echo(payload: EchoRequest) -> dict:
    return {"data": example_service.echo(payload.message)}


${metricsInclude}`;
}

function buildMetricsFiles(options: BackendGenerationConfig) {
  if (options.monitoring !== "prometheus-ready") {
    return [];
  }

  return [
    {
      path: "app/metrics.py",
      content: `from fastapi import APIRouter, Response
from prometheus_client import CONTENT_TYPE_LATEST, CollectorRegistry, generate_latest
from prometheus_client import ProcessCollector, PlatformCollector

registry = CollectorRegistry()
ProcessCollector(registry=registry)
PlatformCollector(registry=registry)

metrics_router = APIRouter()


@metrics_router.get("/metrics")
def metrics() -> Response:
    return Response(generate_latest(registry), media_type=CONTENT_TYPE_LATEST)
`,
    },
  ];
}

function buildTests(options: BackendGenerationConfig) {
  if (options.testing === "pytest-httpx") {
    return [
      {
        path: "tests/test_health.py",
        content: `from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
`,
      },
    ];
  }

  return [
    {
      path: "tests/test_example_service.py",
      content: `from app.services.example_service import example_service


def test_echo() -> None:
    result = example_service.echo("hello")

    assert result["message"] == "hello"
`,
    },
  ];
}

function buildReadme(projectName: string, options: BackendGenerationConfig): string {
  const databases =
    options.databases.length > 0
      ? options.databases.map((database) => `- ${DATABASE_LABELS[database]}`).join("\n")
      : "- None selected";

  return `# ${projectName}

${options.projectDescription}

## Scaffold Summary

- App type: Backend
- Stack: Python + FastAPI
- API style: ${options.apiStyle.toUpperCase()}
- Logging: ${options.logging}
- Monitoring: ${options.monitoring}
- Security preset: ${securityDescription(options.securityPreset)}

## Selected Databases

${databases}

## Setup

\`\`\`bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
\`\`\`

## Development

\`\`\`bash
uvicorn app.main:app --reload
\`\`\`

## Quality Checks

\`\`\`bash
pytest
\`\`\`

## API Endpoints

- \`GET /health\`
- \`GET /api/v1/examples\`
- \`POST /api/v1/examples/echo\`
`;
}

function pythonListLiteral(values: string[]): string {
  return `[${values.map((value) => `'${value}'`).join(", ")}]`;
}

function pythonDictListLiteral(values: Array<{ key: string; name: string }>): string {
  return `[${values
    .map((value) => `{"key": "${value.key}", "name": "${value.name}"}`)
    .join(", ")}]`;
}

function securityDescription(preset: BackendGenerationConfig["securityPreset"]): string {
  switch (preset) {
    case "bcrypt":
      return "bcrypt password hashing";
    case "argon2":
      return "argon2 password hashing";
    case "bcrypt-jwt":
      return "bcrypt password hashing + JWT issuance";
    case "argon2-jwt":
      return "argon2 password hashing + JWT issuance";
    default:
      return "No password handling preset selected";
  }
}
