import { TemplateConfig } from "../types";

export const springBootTemplates: Record<string, TemplateConfig> = {
  "REST API": {
    name: "REST API",
    description: "A Spring Boot REST API",
    files: [
      {
        path: "pom.xml",
        content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>rest-api</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>REST API</name>
    <description>Spring Boot REST API</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.5</version>
        <relativePath/>
    </parent>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
`,
      },
      {
        path: "src/main/java/com/example/Application.java",
        content: `package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
`,
      },
      {
        path: "src/main/java/com/example/controller/ApiController.java",
        content: `package com.example.controller;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping("/hello")
    public Map<String, String> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from Spring Boot!");
        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        return response;
    }

    @PostMapping("/echo")
    public Map<String, Object> echo(@RequestBody Map<String, Object> request) {
        return request;
    }
}
`,
      },
      {
        path: "src/main/resources/application.properties",
        content: `spring.application.name=rest-api
server.port=8080
`,
      },
      {
        path: "README.md",
        content: `# Spring Boot REST API

A RESTful API built with Spring Boot.

## Prerequisites

- Java 17+
- Maven 3.6+

## Build

\`\`\`bash
mvn clean package
\`\`\`

## Run

\`\`\`bash
mvn spring-boot:run
\`\`\`

The API will be available at \`http://localhost:8080\`

## Endpoints

- \`GET /api/hello\` - Hello endpoint
- \`GET /api/health\` - Health check
- \`POST /api/echo\` - Echo endpoint

## Project Structure

- \`src/main/java/com/example/Application.java\` - Main application class
- \`src/main/java/com/example/controller/\` - REST controllers
- \`src/main/resources/\` - Configuration files
`,
      },
      {
        path: ".gitignore",
        content: `# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties
.mvn/wrapper/maven-wrapper.jar

# IDE
.idea/
*.iml
*.iws
*.ipr
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
`,
      },
    ],
  },

  "Web Application": {
    name: "Web Application",
    description: "A Spring Boot web application",
    files: [
      {
        path: "pom.xml",
        content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>web-app</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>Web Application</name>
    <description>Spring Boot Web Application</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.5</version>
        <relativePath/>
    </parent>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
`,
      },
      {
        path: "src/main/java/com/example/Application.java",
        content: `package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
`,
      },
      {
        path: "src/main/java/com/example/controller/WebController.java",
        content: `package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("title", "Welcome to Spring Boot");
        model.addAttribute("message", "This is a web application");
        return "index";
    }

    @GetMapping("/about")
    public String about(Model model) {
        model.addAttribute("title", "About");
        return "about";
    }
}
`,
      },
      {
        path: "src/main/resources/templates/index.html",
        content: `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title th:text="\${title}">Home</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
        }
        p {
            color: #666;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 th:text="\${title}">Welcome</h1>
        <p th:text="\${message}">Message</p>
        <p><a href="/about">About</a></p>
    </div>
</body>
</html>
`,
      },
      {
        path: "src/main/resources/templates/about.html",
        content: `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title th:text="\${title}">About</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
        }
        p {
            color: #666;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 th:text="\${title}">About</h1>
        <p>This is a Spring Boot web application.</p>
        <p><a href="/">Back to Home</a></p>
    </div>
</body>
</html>
`,
      },
      {
        path: "src/main/resources/application.properties",
        content: `spring.application.name=web-app
server.port=8080
`,
      },
      {
        path: "README.md",
        content: `# Spring Boot Web Application

A web application built with Spring Boot and Thymeleaf.

## Prerequisites

- Java 17+
- Maven 3.6+

## Build

\`\`\`bash
mvn clean package
\`\`\`

## Run

\`\`\`bash
mvn spring-boot:run
\`\`\`

The application will be available at \`http://localhost:8080\`

## Project Structure

- \`src/main/java/com/example/\` - Java source code
- \`src/main/resources/templates/\` - HTML templates
- \`src/main/resources/\` - Configuration files
`,
      },
      {
        path: ".gitignore",
        content: `# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties
.mvn/wrapper/maven-wrapper.jar

# IDE
.idea/
*.iml
*.iws
*.ipr
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
`,
      },
    ],
  },

  Microservice: {
    name: "Microservice",
    description: "A Spring Boot microservice",
    files: [
      {
        path: "pom.xml",
        content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>microservice</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>Microservice</name>
    <description>Spring Boot Microservice</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.5</version>
        <relativePath/>
    </parent>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
`,
      },
      {
        path: "src/main/java/com/example/Application.java",
        content: `package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
`,
      },
      {
        path: "src/main/java/com/example/controller/ServiceController.java",
        content: `package com.example.controller;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/service")
public class ServiceController {

    private final String serviceId = UUID.randomUUID().toString();

    @GetMapping("/info")
    public Map<String, Object> info() {
        Map<String, Object> response = new HashMap<>();
        response.put("id", serviceId);
        response.put("name", "Microservice");
        response.put("version", "1.0.0");
        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service_id", serviceId);
        return response;
    }

    @GetMapping("/ready")
    public Map<String, Boolean> ready() {
        Map<String, Boolean> response = new HashMap<>();
        response.put("ready", true);
        return response;
    }
}
`,
      },
      {
        path: "src/main/resources/application.properties",
        content: `spring.application.name=microservice
server.port=8080
management.endpoints.web.exposure.include=health,info
`,
      },
      {
        path: "README.md",
        content: `# Spring Boot Microservice

A microservice template built with Spring Boot.

## Features

- Service discovery endpoints
- Health checks
- Readiness checks
- Actuator endpoints

## Prerequisites

- Java 17+
- Maven 3.6+

## Build

\`\`\`bash
mvn clean package
\`\`\`

## Run

\`\`\`bash
mvn spring-boot:run
\`\`\`

## Endpoints

- \`GET /service/info\` - Service information
- \`GET /service/health\` - Health check
- \`GET /service/ready\` - Readiness check
- \`GET /actuator/health\` - Actuator health
`,
      },
      {
        path: ".gitignore",
        content: `# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties
.mvn/wrapper/maven-wrapper.jar

# IDE
.idea/
*.iml
*.iws
*.ipr
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
`,
      },
    ],
  },
};
