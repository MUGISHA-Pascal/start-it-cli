import path from "path";
import fs from "fs-extra";
import {
  AiMlExecutionMode,
  AiMlGenerationConfig,
  AiMlLoggingOption,
  AiMlRuntimeMode,
  AiMlTestingOption,
  ProjectConfig,
  TemplateOptions,
} from "../types";

export async function scaffoldAiMlProject(
  config: ProjectConfig,
  projectDir: string
): Promise<void> {
  const options = getAiMlOptions(config);

  await fs.ensureDir(projectDir);

  switch (config.stack) {
    case "python-fastapi-serving":
      await createFastApiServingProject(config.projectName, projectDir, options);
      return;
    case "r-analytics":
      await createRAnalyticsProject(config.projectName, projectDir, options);
      return;
    case "cpp-inference":
      await createCppInferenceProject(config.projectName, projectDir, options);
      return;
    default:
      throw new Error(`Unsupported ai/ml stack "${config.stack}"`);
  }
}

function getAiMlOptions(config: ProjectConfig): AiMlGenerationConfig {
  if (config.stack === "r-analytics") {
    return {
      template: "R Analytics Pipeline",
      stack: "r-analytics",
      projectDescription: config.options?.projectDescription || "R analytics pipeline",
      appName: config.options?.appName || config.projectName,
      executionMode: normalizeExecutionMode(config.options?.executionMode),
      modelPackaging: normalizeModelPackaging(config.options?.modelPackaging, "r"),
      tracking: config.options?.tracking || "none",
      validation: "base-checks",
      logging: normalizeLogging(config.options?.logging, "r"),
      testing: normalizeAiMlTesting(config.options?.testing, "r"),
    };
  }

  if (config.stack === "cpp-inference") {
    return {
      template: "C++ Inference Utility",
      stack: "cpp-inference",
      projectDescription: config.options?.projectDescription || "C++ inference utility",
      appName: config.options?.appName || config.projectName,
      runtimeMode: normalizeRuntimeMode(config.options?.runtimeMode),
      modelPackaging: normalizeModelPackaging(config.options?.modelPackaging, "cpp"),
      tracking: "none",
      validation: "base-checks",
      logging: normalizeLogging(config.options?.logging, "cpp"),
      testing: normalizeAiMlTesting(config.options?.testing, "cpp"),
    };
  }

  return {
    template: "FastAPI Model Serving",
    stack: "python-fastapi-serving",
    projectDescription: config.options?.projectDescription || "FastAPI model serving service",
    appName: config.options?.appName || config.projectName,
    servingMode: config.options?.servingMode || "realtime-api",
    modelPackaging: normalizeModelPackaging(config.options?.modelPackaging, "python"),
    tracking: config.options?.tracking || "none",
    validation: config.options?.validation || "pydantic",
    logging: normalizeLogging(config.options?.logging, "python"),
    testing: normalizeAiMlTesting(config.options?.testing, "python"),
  };
}

function normalizeAiMlTesting(
  testing: TemplateOptions["testing"] | undefined,
  stack: "python" | "r" | "cpp"
): AiMlTestingOption {
  if (stack === "r") {
    return testing === "testthat" ? testing : "testthat";
  }
  if (stack === "cpp") {
    return testing === "ctest" ? testing : "ctest";
  }
  return testing === "pytest" || testing === "pytest-httpx" ? testing : "pytest";
}

function normalizeExecutionMode(
  executionMode: TemplateOptions["executionMode"] | undefined
): AiMlExecutionMode {
  return executionMode === "batch-plus-report"
    ? "batch-plus-report"
    : "batch-pipeline";
}

function normalizeRuntimeMode(
  runtimeMode: TemplateOptions["runtimeMode"] | undefined
): AiMlRuntimeMode {
  return runtimeMode === "batch-cli" ? "batch-cli" : "cli-inference";
}

function normalizeModelPackaging(
  modelPackaging: TemplateOptions["modelPackaging"] | undefined,
  stack: "python" | "r" | "cpp"
) {
  if (stack === "cpp") {
    return modelPackaging === "onnx-ready" ? "onnx-ready" : "local-artifacts";
  }
  if (stack === "r") {
    return modelPackaging === "mlflow-ready"
      ? "mlflow-ready"
      : "local-artifacts";
  }
  return modelPackaging || "local-artifacts";
}

function normalizeLogging(
  logging: TemplateOptions["logging"] | undefined,
  stack: "python" | "r" | "cpp"
): AiMlLoggingOption {
  if (stack === "r") {
    return "r-logger";
  }
  if (stack === "cpp") {
    return logging === "spdlog-ready" ? "spdlog-ready" : "stdout-logging";
  }
  return logging === "structlog" ? "structlog" : "python-logging";
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

async function createRAnalyticsProject(
  projectName: string,
  projectDir: string,
  options: AiMlGenerationConfig
) {
  const files: Record<string, string> = {
    "DESCRIPTION": `Package: ${projectName}
Type: Project
Title: ${projectName}
Version: 0.1.0
Description: ${options.projectDescription}
Encoding: UTF-8
Depends: R (>= 4.2.0)
Imports:
    jsonlite,
    readr
`,
    ".Rprofile": `options(stringsAsFactors = FALSE)
`,
    "R/model_loader.R": buildRModelLoader(options),
    "R/pipeline.R": buildRPipeline(options),
    "R/tracking.R": buildRTracking(options),
    "scripts/run_pipeline.R": buildRRunner(options),
    "data/input/.gitkeep": "",
    "outputs/.gitkeep": "",
    "README.md": buildRReadme(projectName, options),
    ".gitignore": `.Rhistory
.RData
.Rproj.user
renv/library/
outputs/*.csv
outputs/*.html
.DS_Store
`,
  };

  if (options.testing === "testthat") {
    files["tests/testthat.R"] = `library(testthat)
library(${projectName})
`;
    files["tests/testthat/test-pipeline.R"] = `test_that("pipeline summary returns expected fields", {
  result <- summarize_scores(c(0.1, 0.2, 0.3))
  expect_true("mean_score" %in% names(result))
})
`;
  }

  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = path.join(projectDir, relativePath);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content);
  }
}

async function createCppInferenceProject(
  projectName: string,
  projectDir: string,
  options: AiMlGenerationConfig
) {
  const files: Record<string, string> = {
    "CMakeLists.txt": buildCppCMake(projectName, options),
    "include/model_runner.hpp": buildCppHeader(options),
    "src/model_runner.cpp": buildCppSource(options),
    "src/main.cpp": buildCppMain(options),
    "README.md": buildCppReadme(projectName, options),
    ".gitignore": `build/
*.o
*.obj
*.exe
.DS_Store
`,
  };

  if (options.testing === "ctest") {
    files["tests/test_main.cpp"] = `#include "model_runner.hpp"
#include <cassert>

int main() {
  ModelRunner runner;
  auto result = runner.predict({0.1, 0.2, 0.3});
  assert(result.score > 0.0);
  return 0;
}
`;
  }

  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = path.join(projectDir, relativePath);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content);
  }
}

function buildRModelLoader(options: AiMlGenerationConfig): string {
  return `load_model_reference <- function() {
  list(
    packaging = "${options.modelPackaging}",
    model_path = Sys.getenv("MODEL_PATH", "./models/model.rds")
  )
}
`;
}

function buildRPipeline(options: AiMlGenerationConfig): string {
  const reportBlock =
    options.executionMode === "batch-plus-report"
      ? `
write_report <- function(scores) {
  report_path <- file.path("outputs", "report.txt")
  summary <- summarize_scores(scores)
  writeLines(
    c(
      paste("mean_score:", summary$mean_score),
      paste("count:", summary$count)
    ),
    report_path
  )
  report_path
}
`
      : "";

  return `summarize_scores <- function(scores) {
  list(
    mean_score = mean(scores),
    count = length(scores)
  )
}

run_pipeline <- function(scores) {
  summary <- summarize_scores(scores)
  output_path <- file.path("outputs", "predictions.csv")
  readr::write_csv(
    data.frame(score = scores),
    output_path
  )
  list(output_path = output_path, summary = summary)
}
${reportBlock}`;
}

function buildRTracking(options: AiMlGenerationConfig): string {
  if (options.tracking === "mlflow") {
    return `tracking_context <- function() {
  list(provider = "mlflow")
}
`;
  }

  return `tracking_context <- function() {
  list(provider = "none")
}
`;
}

function buildRRunner(options: AiMlGenerationConfig): string {
  const reportLine =
    options.executionMode === "batch-plus-report"
      ? `  report_path <- write_report(scores)
  message("report written to ", report_path)
`
      : "";

  return `source("R/model_loader.R")
source("R/pipeline.R")
source("R/tracking.R")

scores <- c(0.12, 0.38, 0.91, 0.44)
model_ref <- load_model_reference()
result <- run_pipeline(scores)

message("using packaging: ", model_ref$packaging)
message("output written to ", result$output_path)
message("tracking provider: ", tracking_context()$provider)
${reportLine}`;
}

function buildRReadme(projectName: string, options: AiMlGenerationConfig): string {
  return `# ${projectName}

${options.projectDescription}

## Scaffold Summary

- App type: AI / ML
- Stack: R analytics pipeline
- Execution mode: ${options.executionMode}
- Model packaging: ${options.modelPackaging}
- Tracking: ${options.tracking}
- Logging: ${options.logging}
- Testing: ${options.testing}

## Run

\`\`\`bash
Rscript scripts/run_pipeline.R
\`\`\`
`;
}

function buildCppCMake(projectName: string, options: AiMlGenerationConfig): string {
  const testBlock =
    options.testing === "ctest"
      ? `
enable_testing()
add_executable(${projectName}_tests tests/test_main.cpp src/model_runner.cpp)
target_include_directories(${projectName}_tests PRIVATE include)
add_test(NAME ${projectName}_tests COMMAND ${projectName}_tests)
`
      : "";

  return `cmake_minimum_required(VERSION 3.16)
project(${projectName} LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(${projectName} src/main.cpp src/model_runner.cpp)
target_include_directories(${projectName} PRIVATE include)
${testBlock}`;
}

function buildCppHeader(options: AiMlGenerationConfig): string {
  return `#pragma once

#include <string>
#include <vector>

struct PredictionResult {
  double score;
  std::string packaging;
};

class ModelRunner {
 public:
  PredictionResult predict(const std::vector<double>& features) const;
};
`;
}

function buildCppSource(options: AiMlGenerationConfig): string {
  return `#include "model_runner.hpp"

#include <numeric>

PredictionResult ModelRunner::predict(const std::vector<double>& features) const {
  const double sum = std::accumulate(features.begin(), features.end(), 0.0);
  const double score = features.empty() ? 0.0 : sum / static_cast<double>(features.size());
  return PredictionResult{score, "${options.modelPackaging}"};
}
`;
}

function buildCppMain(options: AiMlGenerationConfig): string {
  const batchBlock =
    options.runtimeMode === "batch-cli"
      ? `
  std::cout << "batch mode enabled" << std::endl;
`
      : "";
  const loggingLine =
    options.logging === "spdlog-ready"
      ? `  std::cout << "[spdlog-ready] score=" << result.score << std::endl;
`
      : `  std::cout << "score=" << result.score << std::endl;
`;

  return `#include "model_runner.hpp"

#include <iostream>
#include <vector>

int main() {
  ModelRunner runner;
  auto result = runner.predict({0.1, 0.2, 0.3});
${loggingLine}${batchBlock}  std::cout << "packaging=" << result.packaging << std::endl;
  return 0;
}
`;
}

function buildCppReadme(projectName: string, options: AiMlGenerationConfig): string {
  return `# ${projectName}

${options.projectDescription}

## Scaffold Summary

- App type: AI / ML
- Stack: C++ inference utility
- Runtime mode: ${options.runtimeMode}
- Model packaging: ${options.modelPackaging}
- Logging: ${options.logging}
- Testing: ${options.testing}

## Build

\`\`\`bash
cmake -S . -B build
cmake --build build
\`\`\`
`;
}
