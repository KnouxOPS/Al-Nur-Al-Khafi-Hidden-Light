# 🛠️ Setup Guide - النور الخفي

## 🎯 Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended with extensions
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)

### Recommended Extensions for VS Code
- ESLint
- Prettier
- GitLens
- Bracket Pair Colorizer
- Path Intellisense
- Tailwind CSS IntelliSense

## 📥 Installation Process

### 1. Clone the Repository
```bash
# Clone the main repository
git clone https://github.com/al-nur-al-khafi/al-nur-al-khafi.git

# Navigate to project directory
cd al-nur-al-khafi
```

### 2. Install Dependencies
```bash
# Install all project dependencies
npm install

# For yarn users (optional)
yarn install
```

### 3. Environment Configuration
```bash
# Copy example environment file
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

Required environment variables:
```env
VITE_APP_NAME=النور الخفي - Hidden Light
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_DEFAULT_LANGUAGE=ar
```

## ▶️ Running the Development Server

### Development Mode
```bash
# Start development server with hot reload
npm run dev
```

### Building for Production
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🏗️ Project Structure Overview

### Main Directories
```
src/ or ./           # Main source code
├── assets/         # Static assets
├── components/     # Reusable components
├── services/       # API service layer
├── utils/          # Utility functions
└── docs/           # Documentation
```

## ⚙️ Configuration Files

### Git Hooks
Using Husky for git hooks:
- Pre-commit: runs linter and formatter
- Commit-msg: validates commit messages

## 🔧 Development Tools Setup

### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## 🌍 Internationalization

### RTL Support
Automatic RTL handling for Arabic:
- CSS logical properties
- Dynamic direction switching
- Proper text alignment

## 🌙 Prayer for Success
> اللهم يسر لنا أمرنا وبارك في جهدنا واجعله خالصاً لوجهك الكريم

## 🔧 Quick Reference Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run lint` | Check code style |
| `npm run format` | Format code |
| `npm run preview` | Preview production build |
