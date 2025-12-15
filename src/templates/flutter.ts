import { TemplateConfig } from "../types";

export const flutterTemplates: Record<string, TemplateConfig> = {
  "Mobile App": {
    name: "Mobile App",
    description: "A Flutter mobile application",
    files: [
      {
        path: "pubspec.yaml",
        content: `name: my_app
description: A Flutter mobile application.

publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

flutter:
  uses-material-design: true
`,
      },
      {
        path: "lib/main.dart",
        content: `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Home'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '\$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
`,
      },
      {
        path: "README.md",
        content: `# Flutter Mobile App

A Flutter mobile application template.

## Getting Started

This project is a starting point for a Flutter application.

### Prerequisites

- Flutter SDK
- Dart SDK

### Setup

\`\`\`bash
flutter pub get
\`\`\`

### Run

\`\`\`bash
flutter run
\`\`\`

### Build

\`\`\`bash
# Android
flutter build apk

# iOS
flutter build ios
\`\`\`

## Project Structure

- \`lib/main.dart\` - Main application entry point
- \`pubspec.yaml\` - Project dependencies and configuration
`,
      },
      {
        path: ".gitignore",
        content: `# Miscellaneous
*.class
*.log
*.pyc
*.swp
.DS_Store
.atom/
.buildlog/
.history
.svn/
migrate_working_dir/

# IntelliJ related
*.iml
*.ipr
*.iws
.idea/

# The .vscode folder contains launch configuration and tasks you configure in
# VS Code which you may wish to be committed to version control.
.vscode/

# Flutter/Dart/Pub related
**/doc/api/
**/ios/Flutter/.last_build_id
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
.packages
.pub-cache/
.pub/
/build/

# Symbolication related
app.*.symbols

# Obfuscation related
app.*.map.json

# iOS/macOS
**/ios/**/*.mode1v3
**/ios/**/*.mode2v3
**/ios/**/*.moved-aside
**/ios/**/*.pbxuser
**/ios/**/*.perspectivev3
**/ios/**/*sync/
**/ios/**/.sconsign.dblite
**/ios/**/.tags*
**/ios/**/.vagrant
**/ios/**/DerivedData/
**/ios/**/Icon?
**/ios/**/Pods/
**/ios/**/.symlinks/
**/ios/**/Flutter/Flutter.framework
**/ios/**/Flutter/Flutter.podspec
**/ios/**/Flutter/Generated.xcconfig
**/ios/**/Flutter/ephemeral/
**/ios/**/Flutter/app.flx
**/ios/**/Flutter/app.zip
**/ios/**/Flutter/flutter_assets/
**/ios/**/Flutter/flutter_export_environment.sh
**/ios/**/ServiceDefinitions.json
**/ios/**/Runner/GeneratedPluginRegistrant.*

# macOS
**/macos/Flutter/GeneratedPluginRegistrant.swift

# Android
**/android/**/gradle-wrapper.jar
**/android/.gradle
**/android/captures/
**/android/gradlew
**/android/gradlew.bat
**/android/local.properties
**/android/**/GeneratedPluginRegistrant.java

# iOS/macOS
**/ios/**/*.mode1v3
**/ios/**/*.mode2v3
**/ios/**/*.moved-aside
**/ios/**/*.pbxuser
**/ios/**/*.perspectivev3
**/ios/**/*sync/
**/ios/**/.sconsign.dblite
**/ios/**/.tags*
**/ios/**/.vagrant
**/ios/**/DerivedData/
**/ios/**/Icon?
**/ios/**/Pods/
**/ios/**/.symlinks/
**/ios/**/Flutter/Flutter.framework
**/ios/**/Flutter/Flutter.podspec
**/ios/**/Flutter/Generated.xcconfig
**/ios/**/Flutter/ephemeral/
**/ios/**/Flutter/app.flx
**/ios/**/Flutter/app.zip
**/ios/**/Flutter/flutter_assets/
**/ios/**/Flutter/flutter_export_environment.sh
**/ios/**/ServiceDefinitions.json
**/ios/**/Runner/GeneratedPluginRegistrant.*

# Coverage
coverage/

# Exceptions to above rules.
!/packages/flutter_tools/test/data/dart_dependencies_test/**/.packages
`,
      },
    ],
  },

  "Web App": {
    name: "Web App",
    description: "A Flutter web application",
    files: [
      {
        path: "pubspec.yaml",
        content: `name: my_web_app
description: A Flutter web application.

publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

flutter:
  uses-material-design: true
`,
      },
      {
        path: "lib/main.dart",
        content: `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Web App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Web'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Welcome to Flutter Web!',
              style: TextStyle(fontSize: 24),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {},
              child: const Text('Click Me'),
            ),
          ],
        ),
      ),
    );
  }
}
`,
      },
      {
        path: "README.md",
        content: `# Flutter Web App

A Flutter web application template.

## Getting Started

### Prerequisites

- Flutter SDK with web support enabled

### Setup

\`\`\`bash
flutter pub get
\`\`\`

### Run

\`\`\`bash
flutter run -d chrome
\`\`\`

### Build

\`\`\`bash
flutter build web
\`\`\`

## Project Structure

- \`lib/main.dart\` - Main application entry point
- \`pubspec.yaml\` - Project dependencies and configuration
- \`web/\` - Web-specific files
`,
      },
      {
        path: ".gitignore",
        content: `# Miscellaneous
*.class
*.log
*.pyc
*.swp
.DS_Store
.atom/
.buildlog/
.history
.svn/
migrate_working_dir/

# IntelliJ related
*.iml
*.ipr
*.iws
.idea/

# The .vscode folder contains launch configuration and tasks you configure in
# VS Code which you may wish to be committed to version control.
.vscode/

# Flutter/Dart/Pub related
**/doc/api/
**/ios/Flutter/.last_build_id
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
.packages
.pub-cache/
.pub/
/build/
`,
      },
    ],
  },

  "Desktop App": {
    name: "Desktop App",
    description: "A Flutter desktop application",
    files: [
      {
        path: "pubspec.yaml",
        content: `name: my_desktop_app
description: A Flutter desktop application.

publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

flutter:
  uses-material-design: true
`,
      },
      {
        path: "lib/main.dart",
        content: `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Desktop App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Desktop'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Desktop Application',
              style: TextStyle(fontSize: 24),
            ),
            const SizedBox(height: 20),
            Text(
              '\$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
`,
      },
      {
        path: "README.md",
        content: `# Flutter Desktop App

A Flutter desktop application template.

## Getting Started

### Prerequisites

- Flutter SDK with desktop support enabled

### Setup

\`\`\`bash
flutter pub get
\`\`\`

### Run

\`\`\`bash
flutter run -d windows  # Windows
flutter run -d macos    # macOS
flutter run -d linux    # Linux
\`\`\`

### Build

\`\`\`bash
flutter build windows
flutter build macos
flutter build linux
\`\`\`
`,
      },
      {
        path: ".gitignore",
        content: `# Miscellaneous
*.class
*.log
*.pyc
*.swp
.DS_Store
.atom/
.buildlog/
.history
.svn/
migrate_working_dir/

# IntelliJ related
*.iml
*.ipr
*.iws
.idea/

# The .vscode folder contains launch configuration and tasks you configure in
# VS Code which you may wish to be committed to version control.
.vscode/

# Flutter/Dart/Pub related
**/doc/api/
**/ios/Flutter/.last_build_id
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
.packages
.pub-cache/
.pub/
/build/
`,
      },
    ],
  },
};
