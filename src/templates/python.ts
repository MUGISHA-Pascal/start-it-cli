import { TemplateConfig } from "../types";

export const pythonTemplates: Record<string, TemplateConfig> = {
  Django: {
    name: "Django",
    description: "A Django web application",
    files: [
      {
        path: "requirements.txt",
        content: `Django==4.2.7
djangorestframework==3.14.0
python-dotenv==1.0.0
`,
      },
      {
        path: "manage.py",
        content: `#!/usr/bin/env python
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
`,
        isExecutable: true,
      },
      {
        path: "config/settings.py",
        content: `import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-your-secret-key-here'

DEBUG = True

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
`,
      },
      {
        path: "config/urls.py",
        content: `from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html')),
]
`,
      },
      {
        path: "config/wsgi.py",
        content: `import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
application = get_wsgi_application()
`,
      },
      {
        path: "templates/index.html",
        content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Django App</title>
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
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Django!</h1>
        <p>Edit templates/index.html to get started</p>
    </div>
</body>
</html>
`,
      },
      {
        path: "README.md",
        content: `# Django Application

A Django web application.

## Setup

\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\\\Scripts\\\\activate
pip install -r requirements.txt
\`\`\`

## Run

\`\`\`bash
python manage.py runserver
\`\`\`

The application will be available at \`http://localhost:8000\`

## Migrations

\`\`\`bash
python manage.py migrate
python manage.py createsuperuser
\`\`\`

## Project Structure

- \`config/\` - Project configuration
- \`templates/\` - HTML templates
- \`manage.py\` - Django management script
`,
      },
      {
        path: ".gitignore",
        content: `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Django
*.log
local_settings.py
db.sqlite3
/media
/staticfiles

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
`,
      },
    ],
  },

  Flask: {
    name: "Flask",
    description: "A Flask web application",
    files: [
      {
        path: "requirements.txt",
        content: `Flask==3.0.0
python-dotenv==1.0.0
`,
      },
      {
        path: "app.py",
        content: `from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/hello')
def hello():
    return jsonify({'message': 'Hello from Flask!'})

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/echo', methods=['POST'])
def echo():
    data = request.get_json()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
`,
      },
      {
        path: "templates/index.html",
        content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Flask App</title>
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
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Flask!</h1>
        <p>Edit templates/index.html to get started</p>
    </div>
</body>
</html>
`,
      },
      {
        path: "README.md",
        content: `# Flask Application

A Flask web application.

## Setup

\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\\\Scripts\\\\activate
pip install -r requirements.txt
\`\`\`

## Run

\`\`\`bash
python app.py
\`\`\`

The application will be available at \`http://localhost:5000\`

## Endpoints

- \`GET /\` - Home page
- \`GET /api/hello\` - Hello endpoint
- \`GET /api/health\` - Health check
- \`POST /api/echo\` - Echo endpoint

## Project Structure

- \`app.py\` - Main application file
- \`templates/\` - HTML templates
- \`requirements.txt\` - Python dependencies
`,
      },
      {
        path: ".gitignore",
        content: `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Flask
instance/
.webassets-cache

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
`,
      },
    ],
  },

  FastAPI: {
    name: "FastAPI",
    description: "A FastAPI service",
    files: [
      {
        path: "requirements.txt",
        content: `fastapi==0.104.1
uvicorn==0.24.0
python-dotenv==1.0.0
`,
      },
      {
        path: "main.py",
        content: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FastAPI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI!"}

@app.post("/api/echo")
async def echo(data: dict):
    return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
`,
      },
      {
        path: "README.md",
        content: `# FastAPI Service

A FastAPI service.

## Setup

\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\\\Scripts\\\\activate
pip install -r requirements.txt
\`\`\`

## Run

\`\`\`bash
python main.py
\`\`\`

Or with uvicorn directly:

\`\`\`bash
uvicorn main:app --reload
\`\`\`

The API will be available at \`http://localhost:8000\`

## API Documentation

- Swagger UI: \`http://localhost:8000/docs\`
- ReDoc: \`http://localhost:8000/redoc\`

## Endpoints

- \`GET /health\` - Health check
- \`GET /api/hello\` - Hello endpoint
- \`POST /api/echo\` - Echo endpoint
`,
      },
      {
        path: ".gitignore",
        content: `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local

# FastAPI
.uvicorn_cache
`,
      },
    ],
  },
};
