import path from "path";
import fs from "fs-extra";
import {
  DsaGenerationConfig,
  DsaInputMode,
  DsaStack,
  DsaTestingOption,
  DsaTrackOption,
  ProjectConfig,
  TemplateOptions,
} from "../types";

export async function scaffoldDsaProject(
  config: ProjectConfig,
  projectDir: string
): Promise<void> {
  const options = getDsaOptions(config);

  await fs.ensureDir(projectDir);

  switch (options.stack) {
    case "dsa-cpp":
      await createCppDsaProject(config.projectName, projectDir, options);
      return;
    case "dsa-python":
      await createPythonDsaProject(config.projectName, projectDir, options);
      return;
    default:
      throw new Error(`Unsupported dsa-specific stack "${config.stack}"`);
  }
}

function getDsaOptions(config: ProjectConfig): DsaGenerationConfig {
  const stack = normalizeDsaStack(config.stack);
  const isPython = stack === "dsa-python";

  return {
    template: isPython ? "Python DSA Workspace" : "C++ DSA Workspace",
    stack,
    projectDescription: config.options?.projectDescription
      || (isPython ? "Python DSA practice workspace" : "C++ DSA practice workspace"),
    appName: config.options?.appName || config.projectName,
    track: normalizeTrack(config.options?.track),
    inputMode: normalizeInputMode(config.options?.inputMode),
    testing: normalizeTesting(config.options?.testing, stack),
  };
}

function normalizeDsaStack(stack: string): DsaStack {
  if (stack === "dsa-python") {
    return "dsa-python";
  }

  return "dsa-cpp";
}

function normalizeTrack(track: TemplateOptions["track"] | undefined): DsaTrackOption {
  return track === "interview-prep"
    ? "interview-prep"
    : "competitive-programming";
}

function normalizeInputMode(
  inputMode: TemplateOptions["inputMode"] | undefined
): DsaInputMode {
  return inputMode === "function-first" ? "function-first" : "stdin-stdout";
}

function normalizeTesting(
  testing: TemplateOptions["testing"] | undefined,
  stack: DsaStack
): DsaTestingOption {
  if (stack === "dsa-python") {
    return testing === "pytest" ? "pytest" : "manual-cases";
  }

  return testing === "ctest" ? "ctest" : "manual-cases";
}

async function createCppDsaProject(
  projectName: string,
  projectDir: string,
  options: DsaGenerationConfig
) {
  const files: Record<string, string> = {
    "CMakeLists.txt": buildCMakeLists(projectName, options),
    ".gitignore": "build/\n.vscode/\n.idea/\n*.out\n*.exe\n.DS_Store\n",
    "README.md": buildReadme(projectName, options),
    "include/solver.hpp": buildSolverHeader(),
    "src/solver.cpp": buildSolverImplementation(options),
    "src/main.cpp": buildCppMainFile(options),
    "problems/two_sum.md": buildProblemStatement(options),
    "examples/sample_input.txt": buildSampleInput(options),
    "examples/sample_output.txt": buildSampleOutput(options),
  };

  if (options.testing === "ctest") {
    files["tests/test_solver.cpp"] = buildCppTestFile();
  } else {
    files["scripts/run_cases.sh"] = buildCppRunScript(projectName);
  }

  await writeFiles(projectDir, files);
}

async function createPythonDsaProject(
  projectName: string,
  projectDir: string,
  options: DsaGenerationConfig
) {
  const files: Record<string, string> = {
    ".gitignore": "__pycache__/\n.pytest_cache/\n.venv/\nvenv/\n.env\n.DS_Store\n",
    "README.md": buildReadme(projectName, options),
    "requirements.txt": buildPythonRequirements(options),
    "main.py": buildPythonMainFile(options),
    "src/__init__.py": "",
    "src/solver.py": buildPythonSolver(options),
    "problems/two_sum.md": buildProblemStatement(options),
    "examples/sample_input.txt": buildSampleInput(options),
    "examples/sample_output.txt": buildSampleOutput(options),
  };

  if (options.testing === "pytest") {
    files["tests/test_solver.py"] = buildPythonTestFile();
  } else {
    files["scripts/run_cases.sh"] = buildPythonRunScript();
  }

  await writeFiles(projectDir, files);
}

async function writeFiles(projectDir: string, files: Record<string, string>) {
  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = path.join(projectDir, relativePath);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content);

    if (relativePath.endsWith(".sh")) {
      await fs.chmod(filePath, 0o755);
    }
  }
}

function buildCMakeLists(projectName: string, options: DsaGenerationConfig): string {
  const testingBlock =
    options.testing === "ctest"
      ? `
enable_testing()

add_executable(${projectName}_tests tests/test_solver.cpp src/solver.cpp)
add_test(NAME solver_tests COMMAND ${projectName}_tests)
`
      : "";

  return `cmake_minimum_required(VERSION 3.16)
project(${projectName} LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

include_directories(include)

add_executable(${projectName} src/main.cpp src/solver.cpp)
${testingBlock}`.trimStart();
}

function buildSolverHeader(): string {
  return `#pragma once

#include <string>
#include <vector>

std::vector<int> solve_two_sum(const std::vector<int>& nums, int target);
std::string format_answer(const std::vector<int>& indices);
`;
}

function buildSolverImplementation(options: DsaGenerationConfig): string {
  const trackComment =
    options.track === "competitive-programming"
      ? "// Competitive-programming baseline: optimize for fast iteration."
      : "// Interview-prep baseline: keep the solver easy to explain.";

  return `#include "solver.hpp"

#include <sstream>
#include <stdexcept>
#include <unordered_map>

${trackComment}
std::vector<int> solve_two_sum(const std::vector<int>& nums, int target) {
  std::unordered_map<int, int> seen;

  for (int index = 0; index < static_cast<int>(nums.size()); ++index) {
    const int complement = target - nums[index];
    const auto found = seen.find(complement);

    if (found != seen.end()) {
      return {found->second, index};
    }

    seen[nums[index]] = index;
  }

  throw std::runtime_error("No valid pair found");
}

std::string format_answer(const std::vector<int>& indices) {
  std::ostringstream stream;

  for (std::size_t index = 0; index < indices.size(); ++index) {
    if (index > 0) {
      stream << " ";
    }
    stream << indices[index];
  }

  return stream.str();
}
`;
}

function buildCppMainFile(options: DsaGenerationConfig): string {
  if (options.inputMode === "function-first") {
    return `#include "solver.hpp"

#include <iostream>
#include <vector>

int main() {
  std::vector<int> nums = {2, 7, 11, 15};
  const int target = 9;
  const auto answer = solve_two_sum(nums, target);

  std::cout << "two_sum indices: " << format_answer(answer) << std::endl;
  return 0;
}
`;
  }

  return `#include "solver.hpp"

#include <iostream>
#include <vector>

int main() {
  std::ios::sync_with_stdio(false);
  std::cin.tie(nullptr);

  int count = 0;
  int target = 0;
  std::cin >> count >> target;

  std::vector<int> nums(count);
  for (int index = 0; index < count; ++index) {
    std::cin >> nums[index];
  }

  const auto answer = solve_two_sum(nums, target);
  std::cout << format_answer(answer) << std::endl;
  return 0;
}
`;
}

function buildPythonRequirements(options: DsaGenerationConfig): string {
  const requirements = options.testing === "pytest" ? ["pytest==8.3.3"] : [];
  return `${requirements.join("\n")}${requirements.length > 0 ? "\n" : ""}`;
}

function buildPythonSolver(options: DsaGenerationConfig): string {
  const trackComment =
    options.track === "competitive-programming"
      ? "# Competitive-programming baseline: optimize for fast iteration."
      : "# Interview-prep baseline: keep the solver easy to explain.";

  return `${trackComment}
from typing import List


def solve_two_sum(nums: List[int], target: int) -> List[int]:
    seen: dict[int, int] = {}

    for index, value in enumerate(nums):
        complement = target - value
        if complement in seen:
            return [seen[complement], index]
        seen[value] = index

    raise ValueError("No valid pair found")


def format_answer(indices: List[int]) -> str:
    return " ".join(str(index) for index in indices)
`;
}

function buildPythonMainFile(options: DsaGenerationConfig): string {
  if (options.inputMode === "function-first") {
    return `from src.solver import format_answer, solve_two_sum


def main() -> None:
    nums = [2, 7, 11, 15]
    target = 9
    answer = solve_two_sum(nums, target)
    print(f"two_sum indices: {format_answer(answer)}")


if __name__ == "__main__":
    main()
`;
  }

  return `from src.solver import format_answer, solve_two_sum


def main() -> None:
    count, target = map(int, input().split())
    nums = list(map(int, input().split()))
    answer = solve_two_sum(nums[:count], target)
    print(format_answer(answer))


if __name__ == "__main__":
    main()
`;
}

function buildProblemStatement(options: DsaGenerationConfig): string {
  const prepFocus =
    options.track === "interview-prep"
      ? "Explain the time and space complexity after solving."
      : "Aim for an O(n) solution with hash-based lookup.";

  return `# Two Sum

Given an array of integers and a target value, return the indices of the two numbers that add up to the target.

## Input
- Array of integers
- Target integer

## Output
- Two zero-based indices separated by spaces

## Notes
- Exactly one valid answer is assumed
- ${prepFocus}
`;
}

function buildSampleInput(options: DsaGenerationConfig): string {
  if (options.inputMode === "function-first") {
    return "Function-mode scaffold uses in-code sample data.\n";
  }

  return "4 9\n2 7 11 15\n";
}

function buildSampleOutput(options: DsaGenerationConfig): string {
  return options.inputMode === "function-first"
    ? "two_sum indices: 0 1\n"
    : "0 1\n";
}

function buildCppTestFile(): string {
  return `#include "solver.hpp"

#include <stdexcept>
#include <vector>

int main() {
  const std::vector<int> nums = {2, 7, 11, 15};
  const auto answer = solve_two_sum(nums, 9);

  if (answer.size() != 2 || answer[0] != 0 || answer[1] != 1) {
    throw std::runtime_error("solve_two_sum returned an unexpected result");
  }

  return 0;
}
`;
}

function buildPythonTestFile(): string {
  return `from src.solver import solve_two_sum


def test_solve_two_sum() -> None:
    assert solve_two_sum([2, 7, 11, 15], 9) == [0, 1]
`;
}

function buildCppRunScript(projectName: string): string {
  return `#!/usr/bin/env bash
set -euo pipefail

cmake -S . -B build
cmake --build build
./build/${projectName} < examples/sample_input.txt
`;
}

function buildPythonRunScript(): string {
  return `#!/usr/bin/env bash
set -euo pipefail

python main.py < examples/sample_input.txt
`;
}

function buildReadme(projectName: string, options: DsaGenerationConfig): string {
  const workflowLine =
    options.inputMode === "stdin-stdout"
      ? "The workspace is wired for stdin/stdout execution, matching most online judges."
      : "The workspace starts with a function-first entry point, useful for interview walkthroughs.";
  const testingLine =
    options.testing === "ctest"
      ? "CTest is configured for quick regression checks."
      : options.testing === "pytest"
        ? "Pytest is configured for quick solver regression checks."
        : "A simple run script is included for manual sample-case verification.";
  const structureLines =
    options.stack === "dsa-python"
      ? [
          "- `src/solver.py`: algorithm implementation",
          "- `main.py`: runner entry point",
          "- `tests/`: pytest cases when enabled",
        ]
      : [
          "- `include/solver.hpp`: solver declarations",
          "- `src/solver.cpp`: algorithm implementation",
          "- `src/main.cpp`: runner entry point",
        ];
  const runBlock =
    options.stack === "dsa-python"
      ? `python main.py < examples/sample_input.txt`
      : `cmake -S . -B build
cmake --build build
./build/${projectName} < examples/sample_input.txt`;

  return `# ${projectName}

${options.projectDescription}

## Workspace focus

- Track: ${options.track}
- Input mode: ${options.inputMode}
- Testing: ${options.testing}

${workflowLine}
${testingLine}

## Structure

${structureLines.join("\n")}
- \`problems/\`: prompt notes and problem statements
- \`examples/\`: sample inputs and outputs

## Run

\`\`\`bash
${runBlock}
\`\`\`

## Extend

- Add more problems under \`problems/\`
- Swap in a different solver signature as needed
- Add more tests or sample cases before each submission
`;
}
