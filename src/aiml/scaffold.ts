import path from "path";
import fs from "fs-extra";
import {
  AiMlGenerationConfig,
  AiMlTestingOption,
  ProjectConfig,
  TemplateOptions,
} from "../types";

export async function scaffoldAiMlProject(
  config: ProjectConfig,
  projectDir: string
): Promise<void> {
  const options = getAiMlOptions(config);

  if (config.stack !== "python-fastapi-serving") {
    throw new Error(`Unsupported ai/ml stack "${config.stack}"`);
  }

  await fs.ensureDir(projectDir);
  await createFastApiServingProject(config.projectName, projectDir, options);
}

function getAiMlOptions(config: ProjectConfig): AiMlGenerationConfig {
  return {
    template: "FastAPI Model Serving",
    stack: "python-fastapi-serving",
    projectDescription: config.options?.projectDescription || "FastAPI model serving service",
    appName: config.options?.appName || config.projectName,
    servingMode: config.options?.servingMode || "realtime-api",
    modelPackaging: config.options?.modelPackaging || "local-artifacts",
    tracking: config.options?.tracking || "none",
    validation: config.options?.validation || "pydantic",
    logging:
      config.options?.logging === "structlog" ? "structlog" : "python-logging",
    testing: normalizeAiMlTesting(config.options?.testing),
  };
}

function normalizeAiMlTesting(
  testing: TemplateOptions["testing"] | undefined
): AiMlTestingOption {
  return testing === "pytest" || testing === "pytest-httpx"
    ? testing
    : "pytest";
}

async function createFastApiServingProject(
  projectName: string,
  projectDir: string,
  options: AiMlGenerationConfig
) {
  const files: Record<string, string> = {
    "requirements.txt": buildRequirements(options),
    ".env.example": buildEnvExample(options),
    "app/__init__.py": "",
    "app/main.py": buildMainFile(options),
    "app/api/__init__.py": "",
    "app/api/routes.py": buildRoutes(options),
    "app/core/__init__.py": "",
    "app/core/settings.py": buildSettings(options),
    "app/core/logging.py": buildLogging(options),
    "app/core/model_loader.py": buildModelLoader(options),
    "app/core/tracking.py": buildTracking(options),
    "app/schemas/__init__.py": "",
    "app/schemas/prediction.py": buildSchemas(options),
    "app/services/__init__.py": "",
    "app/services/inference.py": buildInferenceService(options),
    "models/.gitkeep": "",
    "README.md": buildReadme(projectName, options),
    ".gitignore": "__pycache__/\n*.py[cod]\n.pytest_cache/\n.venv/\nvenv/\nENV/\n.env\n.DS_Store\n.vscode/\n.idea/\n",
  };

  if (options.testing === "pytest-httpx") {
    files["tests/test_predict.py"] = `from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_predict() -> None:
    response = client.post("/predict", json={"features": [0.1, 0.2, 0.3]})

    assert response.status_code == 200
    assert "prediction" in response.json()["data"]
`;
  } else {
    files["tests/test_inference.py"] = `from app.services.inference import inference_service


def test_inference_service() -> None:
    result = inference_service.predict([0.1, 0.2, 0.3])

    assert "prediction" in result
`;
  }

  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = path.join(projectDir, relativePath);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content);
  }
}

function buildRequirements(options: AiMlGenerationConfig): string {
  const requirements = [
    "fastapi==0.115.0",
    "uvicorn[standard]==0.30.6",
    "pydantic==2.9.2",
    "pydantic-settings==2.5.2",
    "python-dotenv==1.0.1",
  ];

  if (options.logging === "structlog") {
    requirements.push("structlog==24.4.0");
  }
  if (options.validation === "pydantic-plus-pandera") {
    requirements.push("pandera==0.20.4");
    requirements.push("pandas==2.2.3");
  }
  if (options.tracking === "mlflow" || options.modelPackaging === "mlflow-ready") {
    requirements.push("mlflow==2.16.2");
  }
  if (options.tracking === "wandb-ready") {
    requirements.push("wandb==0.18.1");
  }
  if (options.modelPackaging === "huggingface-compatible") {
    requirements.push("transformers==4.45.1");
  }
  if (options.testing === "pytest" || options.testing === "pytest-httpx") {
    requirements.push("pytest==8.3.3");
  }
  if (options.testing === "pytest-httpx") {
    requirements.push("httpx==0.27.2");
  }

  return `${requirements.join("\n")}\n`;
}

function buildEnvExample(options: AiMlGenerationConfig): string {
  const lines = [
    "NODE_ENV=development",
    "PORT=8000",
    `APP_NAME=${options.appName}`,
    "MODEL_PATH=./models/model.bin",
  ];

  if (options.tracking === "mlflow" || options.modelPackaging === "mlflow-ready") {
    lines.push("MLFLOW_TRACKING_URI=http://localhost:5000");
  }
  if (options.tracking === "wandb-ready") {
    lines.push("WANDB_PROJECT=my-ml-service");
  }

  return `${lines.join("\n")}\n`;
}

function buildMainFile(options: AiMlGenerationConfig): string {
  return `from fastapi import FastAPI

from app.api.routes import router
from app.core.logging import configure_logging
from app.core.settings import settings

configure_logging()

app = FastAPI(title=settings.app_name)
app.include_router(router)
`;
}

function buildRoutes(options: AiMlGenerationConfig): string {
  const batchRoute =
    options.servingMode === "realtime-plus-batch"
      ? `

@router.post("/predict-batch")
def predict_batch(payload: BatchPredictRequest) -> dict:
    return {"data": inference_service.predict_batch(payload.rows)}
`
      : "";

  return `from fastapi import APIRouter

from app.schemas.prediction import BatchPredictRequest, PredictRequest
from app.services.inference import inference_service

router = APIRouter()


@router.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "${options.appName}"}


@router.post("/predict")
def predict(payload: PredictRequest) -> dict:
    return {"data": inference_service.predict(payload.features)}${batchRoute}
`;
}

function buildSettings(options: AiMlGenerationConfig): string {
  const extraFields: string[] = [];
  if (options.tracking === "mlflow" || options.modelPackaging === "mlflow-ready") {
    extraFields.push("    mlflow_tracking_uri: str | None = None");
  }
  if (options.tracking === "wandb-ready") {
    extraFields.push("    wandb_project: str | None = None");
  }

  return `from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "${options.appName}"
    port: int = 8000
    node_env: str = "development"
    model_path: str = "./models/model.bin"
${extraFields.join("\n")}

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
`;
}

function buildLogging(options: AiMlGenerationConfig): string {
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

function buildModelLoader(options: AiMlGenerationConfig): string {
  const packagingHint =
    options.modelPackaging === "huggingface-compatible"
      ? "Hugging Face compatible model bundle"
      : options.modelPackaging === "mlflow-ready"
        ? "MLflow model directory"
        : "local artifact file";

  return `from app.core.settings import settings


class ModelLoader:
    def __init__(self) -> None:
        self.model_reference = settings.model_path

    def load(self) -> dict:
        return {
            "model_reference": self.model_reference,
            "packaging": "${packagingHint}",
        }


model_loader = ModelLoader()
`;
}

function buildTracking(options: AiMlGenerationConfig): string {
  if (options.tracking === "mlflow") {
    return `from app.core.settings import settings


def tracking_context() -> dict:
    return {"provider": "mlflow", "tracking_uri": settings.mlflow_tracking_uri}
`;
  }

  if (options.tracking === "wandb-ready") {
    return `from app.core.settings import settings


def tracking_context() -> dict:
    return {"provider": "wandb", "project": settings.wandb_project}
`;
  }

  return `def tracking_context() -> dict:
    return {"provider": "none"}
`;
}

function buildSchemas(options: AiMlGenerationConfig): string {
  const validationImport =
    options.validation === "pydantic-plus-pandera"
      ? "\n# Add Pandera dataframe validation in the service layer when tabular batches are introduced."
      : "";

  return `from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    features: list[float] = Field(min_length=1)


class BatchPredictRequest(BaseModel):
    rows: list[list[float]] = Field(default_factory=list)
${validationImport}
`;
}

function buildInferenceService(options: AiMlGenerationConfig): string {
  const trackingLine =
    options.tracking !== "none"
      ? '            "tracking": tracking_context(),'
      : "";

  return `from statistics import mean

from app.core.model_loader import model_loader
from app.core.tracking import tracking_context


class InferenceService:
    def predict(self, features: list[float]) -> dict:
        model_info = model_loader.load()
        prediction = round(mean(features), 4)
        return {
            "prediction": prediction,
            "model": model_info["packaging"],
${trackingLine}
        }

    def predict_batch(self, rows: list[list[float]]) -> dict:
        return {
            "predictions": [self.predict(row) for row in rows],
            "count": len(rows),
        }


inference_service = InferenceService()
`;
}

function buildReadme(projectName: string, options: AiMlGenerationConfig): string {
  return `# ${projectName}

${options.projectDescription}

## Scaffold Summary

- App type: AI / ML
- Stack: Python + FastAPI model serving
- Serving mode: ${options.servingMode}
- Model packaging: ${options.modelPackaging}
- Tracking: ${options.tracking}
- Validation: ${options.validation}
- Logging: ${options.logging}
- Testing: ${options.testing}

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

## Endpoints

- \`GET /health\`
- \`POST /predict\`
${options.servingMode === "realtime-plus-batch" ? "- `POST /predict-batch`\n" : ""}`;
}
