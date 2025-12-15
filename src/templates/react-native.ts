import { TemplateConfig } from "../types";

export const reactNativeTemplates: Record<string, TemplateConfig> = {
  Expo: {
    name: "Expo",
    description: "A React Native app using Expo",
    files: [
      {
        path: "package.json",
        content: `{
  "name": "my-expo-app",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~49.0.0",
    "expo-status-bar": "~1.6.0",
    "react": "18.2.0",
    "react-native": "0.72.4",
    "react-native-web": "~0.19.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}
`,
      },
      {
        path: "app.json",
        content: `{
  "expo": {
    "name": "my-expo-app",
    "slug": "my-expo-app",
    "version": "1.0.0",
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTabletMode": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
`,
      },
      {
        path: "App.tsx",
        content: `import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Expo!</Text>
      <Text style={styles.subtitle}>Edit App.tsx to get started</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
`,
      },
      {
        path: "tsconfig.json",
        content: `{
  "extends": "expo/tsconfig",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
`,
      },
      {
        path: "README.md",
        content: `# Expo React Native App

A React Native application using Expo.

## Getting Started

### Prerequisites

- Node.js and npm
- Expo CLI

### Setup

\`\`\`bash
npm install
\`\`\`

### Run

\`\`\`bash
npm start
\`\`\`

Then:
- Press \`i\` for iOS simulator
- Press \`a\` for Android emulator
- Press \`w\` for web

### Build

\`\`\`bash
expo build:ios
expo build:android
\`\`\`

## Project Structure

- \`App.tsx\` - Main application component
- \`app.json\` - Expo configuration
- \`package.json\` - Dependencies
`,
      },
      {
        path: ".gitignore",
        content: `node_modules/
.expo/
.expo-shared/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
.env
.env.local
`,
      },
    ],
  },

  "Bare React Native": {
    name: "Bare React Native",
    description: "A bare React Native project",
    files: [
      {
        path: "package.json",
        content: `{
  "name": "my-rn-app",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "start": "react-native start",
    "test": "jest"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.4"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@babel/preset-env": "^7.20.0",
    "@babel/preset-react": "^7.18.0",
    "@babel/preset-typescript": "^7.18.0",
    "@react-native/eslint-config": "^0.72.0",
    "@react-native/metro-config": "^0.72.0",
    "@tsconfig/react-native": "^2.0.2",
    "@types/jest": "^29.5.0",
    "@types/react": "^18.0.0",
    "@types/react-native": "^0.72.0",
    "babel-jest": "^29.5.0",
    "jest": "^29.5.0",
    "metro-react-native-babel-preset": "0.76.5",
    "prettier": "^2.8.0",
    "typescript": "4.8.4"
  },
  "engines": {
    "node": ">=16"
  }
}
`,
      },
      {
        path: "App.tsx",
        content: `import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to React Native!</Text>
          <Text style={styles.subtitle}>Edit App.tsx to get started</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default App;
`,
      },
      {
        path: "index.js",
        content: `import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
`,
      },
      {
        path: "app.json",
        content: `{
  "name": "my-rn-app",
  "displayName": "MyRNApp"
}
`,
      },
      {
        path: "tsconfig.json",
        content: `{
  "extends": "@tsconfig/react-native/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
`,
      },
      {
        path: "README.md",
        content: `# Bare React Native App

A bare React Native application.

## Getting Started

### Prerequisites

- Node.js and npm
- Xcode (for iOS)
- Android Studio (for Android)

### Setup

\`\`\`bash
npm install
\`\`\`

### Run

\`\`\`bash
# iOS
npm run ios

# Android
npm run android

# Start development server
npm start
\`\`\`

## Project Structure

- \`App.tsx\` - Main application component
- \`index.js\` - Application entry point
- \`app.json\` - App configuration
`,
      },
      {
        path: ".gitignore",
        content: `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Dependencies
node_modules/

# Misc
.DS_Store
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# React Native
android/
ios/
.gradle/
.m2/
`,
      },
    ],
  },
};
