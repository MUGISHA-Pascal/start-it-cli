import path from "path";
import { spawnSync } from "child_process";
import fs from "fs-extra";
import {
  FrontendGenerationConfig,
  FrontendNextRouterOption,
  FrontendTestingOption,
  ProjectConfig,
  TemplateOptions,
} from "../types";

export async function scaffoldFrontendProject(
  config: ProjectConfig,
  projectDir: string
): Promise<void> {
  const options = getFrontendOptions(config);

  if (config.stack === "react-vite") {
    await scaffoldReactViteProject(config.projectName, projectDir, options);
    return;
  }

  if (config.stack === "nextjs") {
    await scaffoldNextJsProject(config.projectName, projectDir, options);
    return;
  }

  throw new Error(`Unsupported frontend stack "${config.stack}"`);
}

function getFrontendOptions(config: ProjectConfig): FrontendGenerationConfig {
  return {
    template: config.stack === "nextjs" ? "Next.js" : "React + Vite",
    stack: config.stack === "nextjs" ? "nextjs" : "react-vite",
    projectDescription: config.options?.projectDescription || "React frontend application",
    appName: config.options?.appName || config.projectName,
    styling: config.options?.styling || "plain-css",
    routing: config.options?.routing || "none",
    nextRouter:
      config.stack === "nextjs"
        ? normalizeNextRouter(config.options?.nextRouter)
        : undefined,
    uiAddon: config.options?.uiAddon || "none",
    stateManagement: config.options?.stateManagement || "none",
    dataFetching: config.options?.dataFetching || "fetch",
    testing: normalizeFrontendTesting(config.stack, config.options?.testing),
    baselineSource: config.options?.baselineSource || "auto",
  };
}

function normalizeFrontendTesting(
  stack: ProjectConfig["stack"],
  testing: TemplateOptions["testing"] | undefined
): FrontendTestingOption {
  if (stack === "nextjs") {
    return testing === "jest" || testing === "jest-rtl" ? testing : "jest";
  }

  return testing === "vitest" || testing === "vitest-rtl" ? testing : "vitest";
}

function normalizeNextRouter(
  nextRouter: TemplateOptions["nextRouter"] | undefined
): FrontendNextRouterOption {
  return nextRouter === "pages-router" ? "pages-router" : "app-router";
}

async function scaffoldReactViteProject(
  projectName: string,
  projectDir: string,
  options: FrontendGenerationConfig
) {
  const shouldUseProvider =
    options.baselineSource === "provider" ||
    (options.baselineSource === "auto" && process.env.NODE_ENV !== "test");

  if (shouldUseProvider) {
    const result = spawnSync(
      "npm",
      ["create", "vite@latest", projectName, "--", "--template", "react-ts"],
      {
        cwd: path.dirname(projectDir),
        stdio: "ignore",
        shell: process.platform === "win32",
      }
    );

    if (result.status !== 0 || !fs.existsSync(projectDir)) {
      await fs.ensureDir(projectDir);
      await createLocalReactViteBaseline(projectName, projectDir);
    }
  } else {
    await fs.ensureDir(projectDir);
    await createLocalReactViteBaseline(projectName, projectDir);
  }

  await customizeReactViteProject(projectName, projectDir, options);
}

async function scaffoldNextJsProject(
  projectName: string,
  projectDir: string,
  options: FrontendGenerationConfig
) {
  const shouldUseProvider =
    options.baselineSource === "provider" ||
    (options.baselineSource === "auto" && process.env.NODE_ENV !== "test");

  if (shouldUseProvider) {
    const providerArgs = [
      "create-next-app@latest",
      projectName,
      "--ts",
      "--eslint",
      "--src-dir",
      "--use-npm",
      "--import-alias",
      "@/*",
      options.nextRouter === "pages-router" ? "--no-app" : "--app",
    ];
    const result = spawnSync("npx", providerArgs, {
      cwd: path.dirname(projectDir),
      stdio: "ignore",
      shell: process.platform === "win32",
    });

    if (result.status !== 0 || !fs.existsSync(projectDir)) {
      await fs.ensureDir(projectDir);
      await createLocalNextBaseline(projectName, projectDir, options.nextRouter || "app-router");
    }
  } else {
    await fs.ensureDir(projectDir);
    await createLocalNextBaseline(projectName, projectDir, options.nextRouter || "app-router");
  }

  await customizeNextJsProject(projectName, projectDir, options);
}

async function createLocalNextBaseline(
  projectName: string,
  projectDir: string,
  nextRouter: FrontendNextRouterOption
) {
  const files: Record<string, string> = {
    "package.json": `{
  "name": "${projectName}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.13",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.12.12",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.13",
    "typescript": "^5.5.3"
  }
}
`,
    "next-env.d.ts": `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
`,
    "next.config.js": `/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;
`,
    "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`,
    "src/styles/globals.css": `:root {
  color: #0f172a;
  background: #f8fafc;
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}
`,
  };

  if (nextRouter === "app-router") {
    files["src/app/layout.tsx"] = `import "../styles/globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
    files["src/app/page.tsx"] = `export default function Home() {
  return <main>Hello Next.js</main>;
}
`;
  } else {
    files["src/pages/_app.tsx"] = `import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
`;
    files["src/pages/index.tsx"] = `export default function Home() {
  return <main>Hello Next.js</main>;
}
`;
  }

  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = path.join(projectDir, relativePath);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content);
  }
}

async function createLocalReactViteBaseline(
  projectName: string,
  projectDir: string
) {
  const files: Record<string, string> = {
    "package.json": `{
  "name": "${projectName}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.1"
  }
}
`,
    "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    "tsconfig.json": `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
`,
    "tsconfig.app.json": `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
`,
    "tsconfig.node.json": `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
`,
    "vite.config.ts": `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`,
    "src/main.tsx": `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
    "src/App.tsx": `export default function App() {
  return <h1>Hello Vite</h1>;
}
`,
    "src/index.css": `:root {
  font-family: Inter, system-ui, sans-serif;
}

body {
  margin: 0;
}
`,
  };

  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = path.join(projectDir, relativePath);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content);
  }
}

async function customizeReactViteProject(
  projectName: string,
  projectDir: string,
  options: FrontendGenerationConfig
) {
  const packageJsonPath = path.join(projectDir, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);

  packageJson.name = projectName;
  packageJson.scripts = {
    ...packageJson.scripts,
    test: "vitest",
    lint: "eslint . --ext ts,tsx",
  };

  packageJson.devDependencies = {
    ...(packageJson.devDependencies || {}),
    eslint: "^8.57.0",
    "@types/node": "^20.12.12",
    vitest: "^2.1.1",
  };

  if (options.routing === "react-router") {
    packageJson.dependencies["react-router-dom"] = "^6.26.2";
  }
  if (options.stateManagement === "zustand") {
    packageJson.dependencies.zustand = "^4.5.5";
  }
  if (options.dataFetching === "tanstack-query") {
    packageJson.dependencies["@tanstack/react-query"] = "^5.56.2";
  }
  if (options.styling === "tailwind") {
    packageJson.devDependencies.tailwindcss = "^3.4.13";
    packageJson.devDependencies.postcss = "^8.4.47";
    packageJson.devDependencies.autoprefixer = "^10.4.20";
  }
  if (options.uiAddon === "shadcn-ui") {
    packageJson.dependencies.clsx = "^2.1.1";
    packageJson.dependencies["class-variance-authority"] = "^0.7.0";
    packageJson.dependencies["tailwind-merge"] = "^2.5.2";
    packageJson.dependencies["lucide-react"] = "^0.441.0";
  }
  if (options.testing === "vitest-rtl") {
    packageJson.devDependencies["@testing-library/jest-dom"] = "^6.6.3";
    packageJson.devDependencies["@testing-library/react"] = "^16.0.1";
    packageJson.devDependencies["@testing-library/user-event"] = "^14.5.2";
    packageJson.devDependencies.jsdom = "^25.0.0";
  }

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  await fs.writeFile(path.join(projectDir, "src/main.tsx"), buildMainFile(options));
  await fs.writeFile(path.join(projectDir, "src/App.tsx"), buildAppFile(options));
  await fs.writeFile(path.join(projectDir, "src/index.css"), buildIndexCss(options));
  await fs.writeFile(path.join(projectDir, "README.md"), buildReadme(projectName, options));
  await fs.writeFile(path.join(projectDir, ".gitignore"), `node_modules/\ndist/\n.vscode/\n.idea/\n.DS_Store\n`);
  await fs.ensureDir(path.join(projectDir, "src/components"));
  await fs.ensureDir(path.join(projectDir, "src/features/home"));
  await fs.ensureDir(path.join(projectDir, "src/lib"));
  await fs.ensureDir(path.join(projectDir, "src/test"));

  await fs.writeFile(
    path.join(projectDir, "src/features/home/HomePage.tsx"),
    buildHomePage(options)
  );
  await fs.writeFile(
    path.join(projectDir, "src/lib/config.ts"),
    `export const appConfig = {
  appName: "${options.appName}",
  description: "${options.projectDescription}"
} as const;
`
  );

  if (options.routing === "react-router") {
    await fs.writeFile(
      path.join(projectDir, "src/routes.tsx"),
      buildRoutesFile()
    );
  }

  if (options.stateManagement === "zustand") {
    await fs.writeFile(
      path.join(projectDir, "src/lib/store.ts"),
      `import { create } from "zustand";

type UiState = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
`
    );
  }

  if (options.dataFetching === "tanstack-query") {
    await fs.writeFile(
      path.join(projectDir, "src/lib/queryClient.ts"),
      `import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
`
    );
  }

  if (options.styling === "tailwind") {
    await fs.writeFile(
      path.join(projectDir, "tailwind.config.js"),
      `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`
    );
    await fs.writeFile(
      path.join(projectDir, "postcss.config.js"),
      `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`
    );
  }

  if (options.uiAddon === "shadcn-ui") {
    await fs.writeFile(
      path.join(projectDir, "components.json"),
      `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
`
    );
    await fs.writeFile(
      path.join(projectDir, "src/lib/utils.ts"),
      `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`
    );
    await fs.writeFile(
      path.join(projectDir, "src/components/button.tsx"),
      `import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-700",
        ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props} />
  );
}
`
    );
  }

  if (options.testing === "vitest-rtl") {
    await fs.writeFile(
      path.join(projectDir, "src/test/setup.ts"),
      `import "@testing-library/jest-dom";
`
    );
    await fs.writeFile(
      path.join(projectDir, "vitest.config.ts"),
      `import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
`
    );
  }
}

async function customizeNextJsProject(
  projectName: string,
  projectDir: string,
  options: FrontendGenerationConfig
) {
  const packageJsonPath = path.join(projectDir, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);

  packageJson.name = projectName;
  packageJson.scripts = {
    ...packageJson.scripts,
    test: options.testing === "jest" ? "jest" : "jest --watchAll=false",
  };
  packageJson.devDependencies = {
    ...(packageJson.devDependencies || {}),
    jest: "^29.7.0",
    "ts-jest": "^29.1.4",
    "@types/jest": "^29.5.12",
    "jest-environment-jsdom": "^29.7.0",
  };

  if (options.stateManagement === "zustand") {
    packageJson.dependencies.zustand = "^4.5.5";
  }
  if (options.dataFetching === "tanstack-query") {
    packageJson.dependencies["@tanstack/react-query"] = "^5.56.2";
  }
  if (options.styling === "tailwind") {
    packageJson.devDependencies.tailwindcss = "^3.4.13";
    packageJson.devDependencies.postcss = "^8.4.47";
    packageJson.devDependencies.autoprefixer = "^10.4.20";
  }
  if (options.uiAddon === "shadcn-ui") {
    packageJson.dependencies.clsx = "^2.1.1";
    packageJson.dependencies["class-variance-authority"] = "^0.7.0";
    packageJson.dependencies["tailwind-merge"] = "^2.5.2";
    packageJson.dependencies["lucide-react"] = "^0.441.0";
  }
  if (options.testing === "jest-rtl") {
    packageJson.devDependencies["@testing-library/jest-dom"] = "^6.6.3";
    packageJson.devDependencies["@testing-library/react"] = "^16.0.1";
    packageJson.devDependencies["@testing-library/user-event"] = "^14.5.2";
  }

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  await fs.ensureDir(path.join(projectDir, "src/components"));
  await fs.ensureDir(path.join(projectDir, "src/features/home"));
  await fs.ensureDir(path.join(projectDir, "src/lib"));
  await fs.ensureDir(path.join(projectDir, "src/test"));
  await fs.writeFile(
    path.join(projectDir, "src/lib/config.ts"),
    `export const appConfig = {
  appName: "${options.appName}",
  description: "${options.projectDescription}",
} as const;
`
  );
  await fs.writeFile(
    path.join(projectDir, "src/features/home/HomePage.tsx"),
    buildNextHomePage(options)
  );
  await fs.writeFile(
    path.join(projectDir, "src/styles/globals.css"),
    buildNextGlobalCss(options)
  );
  await fs.writeFile(
    path.join(projectDir, "README.md"),
    buildNextReadme(projectName, options)
  );
  await fs.writeFile(
    path.join(projectDir, ".gitignore"),
    "node_modules/\n.next/\nout/\n.vscode/\n.idea/\n.DS_Store\n"
  );
  await fs.writeFile(
    path.join(projectDir, "jest.config.js"),
    `const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

module.exports = createJestConfig(customJestConfig);
`
  );
  await fs.writeFile(
    path.join(projectDir, "src/test/setup.ts"),
    options.testing === "jest-rtl" ? 'import "@testing-library/jest-dom";\n' : ""
  );

  if (options.stateManagement === "zustand") {
    await fs.writeFile(
      path.join(projectDir, "src/lib/store.ts"),
      `import { create } from "zustand";

type UiState = {
  navOpen: boolean;
  toggleNav: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  navOpen: false,
  toggleNav: () => set((state) => ({ navOpen: !state.navOpen })),
}));
`
    );
  }

  if (options.dataFetching === "tanstack-query") {
    await fs.writeFile(
      path.join(projectDir, "src/lib/queryClient.ts"),
      `import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
`
    );
    await fs.writeFile(
      path.join(projectDir, "src/components/Providers.tsx"),
      buildNextProviders(options)
    );
  }

  if (options.styling === "tailwind") {
    await fs.writeFile(
      path.join(projectDir, "tailwind.config.js"),
      `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`
    );
    await fs.writeFile(
      path.join(projectDir, "postcss.config.js"),
      `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`
    );
  }

  if (options.uiAddon === "shadcn-ui") {
    await fs.writeFile(
      path.join(projectDir, "components.json"),
      `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
`
    );
    await fs.writeFile(
      path.join(projectDir, "src/lib/utils.ts"),
      `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`
    );
    await fs.writeFile(
      path.join(projectDir, "src/components/button.tsx"),
      `import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-700",
        ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props} />
  );
}
`
    );
  }

  if (options.nextRouter === "app-router") {
    await fs.writeFile(
      path.join(projectDir, "src/app/layout.tsx"),
      buildNextAppLayout(options)
    );
    await fs.writeFile(
      path.join(projectDir, "src/app/page.tsx"),
      buildNextAppPage(options)
    );
  } else {
    await fs.writeFile(
      path.join(projectDir, "src/pages/_app.tsx"),
      buildNextPagesApp(options)
    );
    await fs.writeFile(
      path.join(projectDir, "src/pages/index.tsx"),
      buildNextPagesIndex()
    );
  }
}

function buildMainFile(options: FrontendGenerationConfig): string {
  const queryImports =
    options.dataFetching === "tanstack-query"
      ? 'import { QueryClientProvider } from "@tanstack/react-query";\nimport { queryClient } from "./lib/queryClient";\n'
      : "";
  const routerImport =
    options.routing === "react-router"
      ? 'import { RouterProvider } from "react-router-dom";\nimport { router } from "./routes";\n'
      : "";

  const appTree =
    options.routing === "react-router"
      ? "<RouterProvider router={router} />"
      : "<App />";

  const wrappedTree =
    options.dataFetching === "tanstack-query"
      ? `<QueryClientProvider client={queryClient}>
      ${appTree}
    </QueryClientProvider>`
      : appTree;

  return `import React from "react";
import ReactDOM from "react-dom/client";
${routerImport}${queryImports}import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    ${wrappedTree}
  </React.StrictMode>
);
`;
}

function buildAppFile(options: FrontendGenerationConfig): string {
  if (options.routing === "react-router") {
    return `export default function App() {
  return null;
}
`;
  }

  return `import { HomePage } from "./features/home/HomePage";

export default function App() {
  return <HomePage />;
}
`;
}

function buildRoutesFile(): string {
  return `import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./features/home/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);
`;
}

function buildHomePage(options: FrontendGenerationConfig): string {
  const buttonImport =
    options.uiAddon === "shadcn-ui"
      ? 'import { Button } from "../../components/button";\n'
      : "";
  const buttonBlock =
    options.uiAddon === "shadcn-ui"
      ? `<Button>Open dashboard</Button>`
      : `<button className="cta">Open dashboard</button>`;

  return `${buttonImport}import { appConfig } from "../../lib/config";

export function HomePage() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">React + Vite baseline</p>
        <h1>{appConfig.appName}</h1>
        <p>{appConfig.description}</p>
        <div className="actions">
          ${buttonBlock}
        </div>
      </section>
    </main>
  );
}
`;
}

function buildIndexCss(options: FrontendGenerationConfig): string {
  if (options.styling === "tailwind") {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color: #0f172a;
  background: #f8fafc;
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}
`;
  }

  return `:root {
  color: #0f172a;
  background:
    radial-gradient(circle at top left, #dbeafe, transparent 32%),
    linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%);
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

.app-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
}

.hero {
  max-width: 48rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  padding: 3rem;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.75rem;
  color: #475569;
}

.actions {
  margin-top: 1.5rem;
}

.cta {
  border: 0;
  border-radius: 999px;
  padding: 0.9rem 1.3rem;
  background: #0f172a;
  color: white;
  font: inherit;
}
`;
}

function buildReadme(projectName: string, options: FrontendGenerationConfig): string {
  return `# ${projectName}

${options.projectDescription}

## Scaffold Summary

- App type: Frontend
- Stack: React + Vite + TypeScript
- Routing: ${options.routing}
- Styling: ${options.styling}
- UI add-on: ${options.uiAddon}
- State: ${options.stateManagement}
- Data fetching: ${options.dataFetching}
- Testing: ${options.testing}

## Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

## Notes

- This project starts from a Vite React TypeScript baseline.
- The scaffold then applies the selected routing, styling, data, and testing choices.
`;
}

function buildNextProviders(options: FrontendGenerationConfig): string {
  if (options.dataFetching === "tanstack-query") {
    return `"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { queryClient } from "@/lib/queryClient";

export function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
`;
  }

  return `"use client";

import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
`;
}

function buildNextAppLayout(options: FrontendGenerationConfig): string {
  const providersImport =
    options.dataFetching === "tanstack-query"
      ? 'import { Providers } from "@/components/Providers";\n'
      : "";
  const bodyContent =
    options.dataFetching === "tanstack-query"
      ? `<Providers>{children}</Providers>`
      : "{children}";

  return `import "@/styles/globals.css";
import type { ReactNode } from "react";
${providersImport}
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>${bodyContent}</body>
    </html>
  );
}
`;
}

function buildNextAppPage(options: FrontendGenerationConfig): string {
  return `import { HomePage } from "@/features/home/HomePage";

export default function Home() {
  return <HomePage />;
}
`;
}

function buildNextPagesApp(options: FrontendGenerationConfig): string {
  const providersImport =
    options.dataFetching === "tanstack-query"
      ? 'import { Providers } from "@/components/Providers";\n'
      : "";
  const wrapperOpen =
    options.dataFetching === "tanstack-query" ? "<Providers>" : "<>";
  const wrapperClose =
    options.dataFetching === "tanstack-query" ? "</Providers>" : "</>";

  return `import type { AppProps } from "next/app";
import "@/styles/globals.css";
${providersImport}
export default function App({ Component, pageProps }: AppProps) {
  return (
    ${wrapperOpen}
      <Component {...pageProps} />
    ${wrapperClose}
  );
}
`;
}

function buildNextPagesIndex(): string {
  return `import { HomePage } from "@/features/home/HomePage";

export default function Home() {
  return <HomePage />;
}
`;
}

function buildNextHomePage(options: FrontendGenerationConfig): string {
  const buttonImport =
    options.uiAddon === "shadcn-ui"
      ? 'import { Button } from "@/components/button";\n'
      : "";
  const buttonBlock =
    options.uiAddon === "shadcn-ui"
      ? `<Button>Launch workspace</Button>`
      : `<button className="cta">Launch workspace</button>`;

  return `${buttonImport}import { appConfig } from "@/lib/config";

export function HomePage() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Next.js baseline</p>
        <h1>{appConfig.appName}</h1>
        <p>{appConfig.description}</p>
        <div className="actions">
          ${buttonBlock}
        </div>
      </section>
    </main>
  );
}
`;
}

function buildNextGlobalCss(options: FrontendGenerationConfig): string {
  if (options.styling === "tailwind") {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color: #0f172a;
  background: #f8fafc;
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}
`;
  }

  return `:root {
  color: #0f172a;
  background:
    radial-gradient(circle at top left, #dcfce7, transparent 32%),
    linear-gradient(180deg, #f8fafc 0%, #ecfeff 100%);
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.app-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
}

.hero {
  max-width: 48rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.9);
  padding: 3rem;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.75rem;
  color: #475569;
}

.actions {
  margin-top: 1.5rem;
}

.cta {
  border: 0;
  border-radius: 999px;
  padding: 0.9rem 1.3rem;
  background: #0f172a;
  color: white;
  font: inherit;
}
`;
}

function buildNextReadme(projectName: string, options: FrontendGenerationConfig): string {
  return `# ${projectName}

${options.projectDescription}

## Scaffold Summary

- App type: Frontend
- Stack: Next.js + TypeScript
- Router mode: ${options.nextRouter}
- Styling: ${options.styling}
- UI add-on: ${options.uiAddon}
- State: ${options.stateManagement}
- Data fetching: ${options.dataFetching}
- Testing: ${options.testing}

## Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

## Notes

- This project starts from a Next.js baseline.
- The scaffold then applies the selected router, styling, data, and testing choices.
`;
}
