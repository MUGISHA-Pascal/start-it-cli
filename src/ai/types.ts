export interface AIProjectRequest {
  description: string;
  framework?: string;
  features: string[];
  scale: "small" | "medium" | "large";
  deployment?: "local" | "cloud" | "hybrid";
}

export interface AIRecommendation {
  framework: string;
  template: string;
  dependencies: DependencyRecommendation[];
  structure: FileStructure[];
  reasoning: string;
}

export interface DependencyRecommendation {
  name: string;
  version?: string;
  purpose: string;
  optional: boolean;
}

export interface FileStructure {
  path: string;
  content: string;
  description: string;
  isExecutable?: boolean;
}

export interface AIProvider {
  generateProject(request: AIProjectRequest): Promise<AIRecommendation>;
  analyzeRequirements(description: string): Promise<string[]>;
  suggestDependencies(
    framework: string,
    features: string[]
  ): Promise<DependencyRecommendation[]>;
}
