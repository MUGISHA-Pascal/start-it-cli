import { AppType, SupportedStack } from "./types";

type DisabledChoice = {
  name: string;
  value: string;
  disabled?: string;
};

export const APP_TYPE_CHOICES: DisabledChoice[] = [
  { name: "Backend", value: "backend" },
  {
    name: "Frontend",
    value: "frontend",
    disabled: "Coming soon",
  },
  {
    name: "AI / ML",
    value: "ai-ml",
    disabled: "Coming soon",
  },
  {
    name: "DSA-specific",
    value: "dsa-specific",
    disabled: "Coming soon",
  },
];

export const STACK_CHOICES: Record<AppType, DisabledChoice[]> = {
  backend: [
    {
      name: "Node.js + TypeScript + Express",
      value: "node-ts-express",
    },
  ],
  frontend: [],
  "ai-ml": [],
  "dsa-specific": [],
};

export function getStackChoices(appType: AppType): DisabledChoice[] {
  return STACK_CHOICES[appType];
}

export function getFrameworkForStack(stack: SupportedStack): string {
  switch (stack) {
    case "node-ts-express":
      return "Node.js";
    default:
      throw new Error(`Unsupported stack "${stack}"`);
  }
}
