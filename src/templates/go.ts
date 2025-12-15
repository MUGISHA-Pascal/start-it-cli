import { TemplateConfig } from "../types";

export const goTemplates: Record<string, TemplateConfig> = {
  "Basic CLI": {
    name: "Basic CLI",
    description: "A basic Go CLI application",
    files: [
      {
        path: "go.mod",
        content: "module github.com/user/project\n\ngo 1.21\n",
      },
      {
        path: "main.go",
        content: `package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: app <command>")
		os.Exit(1)
	}

	command := os.Args[1]

	switch command {
	case "hello":
		fmt.Println("Hello, World!")
	case "version":
		fmt.Println("Version 1.0.0")
	default:
		fmt.Printf("Unknown command: %s\\n", command)
		os.Exit(1)
	}
}
`,
      },
      {
        path: "README.md",
        content: `# Go CLI Application

A basic Go command-line application.

## Build

\`\`\`bash
go build -o app
\`\`\`

## Run

\`\`\`bash
./app hello
./app version
\`\`\`

## Development

\`\`\`bash
go run main.go hello
\`\`\`
`,
      },
      {
        path: ".gitignore",
        content: `# Binaries for programs and plugins
*.exe
*.exe~
*.dll
*.so
*.so.*
*.dylib

# Test binary, built with \`go test -c\`
*.test

# Output of the go coverage tool
*.out

# Go workspace file
go.work

# Dependency directories
vendor/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
`,
      },
    ],
  },

  "Web API": {
    name: "Web API",
    description: "A Go web API using Gin framework",
    files: [
      {
        path: "go.mod",
        content: `module github.com/user/project

go 1.21

require github.com/gin-gonic/gin v1.9.1
`,
      },
      {
        path: "main.go",
        content: `package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	// API endpoints
	router.GET("/api/hello", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello from Go API!",
		})
	})

	router.POST("/api/echo", func(c *gin.Context) {
		var data map[string]interface{}
		c.BindJSON(&data)
		c.JSON(200, data)
	})

	router.Run(":8080")
}
`,
      },
      {
        path: "README.md",
        content: `# Go Web API

A RESTful API built with Go and Gin framework.

## Setup

\`\`\`bash
go mod download
\`\`\`

## Run

\`\`\`bash
go run main.go
\`\`\`

The API will be available at \`http://localhost:8080\`

## Endpoints

- \`GET /health\` - Health check
- \`GET /api/hello\` - Hello endpoint
- \`POST /api/echo\` - Echo endpoint

## Build

\`\`\`bash
go build -o api
./api
\`\`\`
`,
      },
      {
        path: ".gitignore",
        content: `# Binaries for programs and plugins
*.exe
*.exe~
*.dll
*.so
*.so.*
*.dylib

# Test binary, built with \`go test -c\`
*.test

# Output of the go coverage tool
*.out

# Go workspace file
go.work

# Dependency directories
vendor/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
`,
      },
    ],
  },

  Microservice: {
    name: "Microservice",
    description: "A Go microservice template",
    files: [
      {
        path: "go.mod",
        content: `module github.com/user/project

go 1.21

require (
	github.com/gin-gonic/gin v1.9.1
	github.com/google/uuid v1.5.0
)
`,
      },
      {
        path: "main.go",
        content: `package main

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Service struct {
	ID   string
	Name string
}

func main() {
	router := gin.Default()

	service := Service{
		ID:   uuid.New().String(),
		Name: "My Microservice",
	}

	// Service info endpoint
	router.GET("/service/info", func(c *gin.Context) {
		c.JSON(200, service)
	})

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "healthy",
			"service_id": service.ID,
		})
	})

	// Ready check
	router.GET("/ready", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"ready": true,
		})
	})

	router.Run(":8080")
}
`,
      },
      {
        path: "README.md",
        content: `# Go Microservice

A microservice template built with Go and Gin.

## Features

- Service discovery endpoints
- Health checks
- UUID generation

## Run

\`\`\`bash
go mod download
go run main.go
\`\`\`

## Endpoints

- \`GET /service/info\` - Service information
- \`GET /health\` - Health check
- \`GET /ready\` - Readiness check
`,
      },
      {
        path: ".gitignore",
        content: `# Binaries for programs and plugins
*.exe
*.exe~
*.dll
*.so
*.so.*
*.dylib

# Test binary, built with \`go test -c\`
*.test

# Output of the go coverage tool
*.out

# Go workspace file
go.work

# Dependency directories
vendor/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
`,
      },
    ],
  },
};
