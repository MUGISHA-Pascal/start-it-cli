export interface ProjectConfig {
  framework: string;
  projectName: string;
  projectPath: string;
  options?: Record<string, string>;
}

export interface TemplateConfig {
  name: string;
  description: string;
  files: TemplateFile[];
}

export interface TemplateFile {
  path: string;
  content: string;
  isExecutable?: boolean;
}
