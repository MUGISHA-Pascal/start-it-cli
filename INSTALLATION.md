# Installation Guide

## Prerequisites

- Node.js 14.0.0 or higher
- npm 6.0.0 or higher

## Installation Methods

### 1. Global Installation (Recommended)

Install start-it globally to use it from anywhere:

```bash
npm install -g start-it
```

Then use it from any directory:

```bash
start-it
```

### 2. Local Installation

Install in your project directory:

```bash
npm install start-it
```

Then use it with npx:

```bash
npx start-it
```

### 3. Development Installation

Clone and build from source:

```bash
git clone <repository-url>
cd start-it
npm install
npm run build
npm link
```

Then use it as:

```bash
start-it
```

## Verification

To verify the installation was successful:

```bash
start-it --version
```

Or simply run:

```bash
start-it
```

You should see the welcome message and be prompted to select a framework.

## Uninstallation

### Global Installation

```bash
npm uninstall -g start-it
```

### Local Installation

```bash
npm uninstall start-it
```

### Development Installation

```bash
npm unlink start-it
```

## Troubleshooting

### Command not found

If you get "command not found: start-it" after global installation:

1. Check npm's global bin directory:

```bash
npm config get prefix
```

2. Make sure this directory is in your PATH:

```bash
echo $PATH
```

3. If not, add it to your shell profile (~/.bashrc, ~/.zshrc, etc.):

```bash
export PATH="$(npm config get prefix)/bin:$PATH"
```

### Permission denied

If you get permission errors during global installation:

```bash
sudo npm install -g start-it
```

Or configure npm to avoid using sudo:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Module not found

If you get "Cannot find module" errors:

1. Reinstall dependencies:

```bash
npm install
```

2. Rebuild the project:

```bash
npm run build
```

## System Requirements

### macOS

- Works with macOS 10.12+
- Requires Node.js 14+

### Windows

- Works with Windows 7+
- Requires Node.js 14+
- PowerShell or Command Prompt

### Linux

- Works with most modern distributions
- Requires Node.js 14+
- Bash or compatible shell

## Next Steps

After installation, run:

```bash
start-it
```

And follow the interactive prompts to create your first project!

For more examples, see [EXAMPLES.md](./EXAMPLES.md)
