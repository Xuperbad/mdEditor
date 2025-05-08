# MD Editor

A lightweight, minimalist Markdown editor built with Editor.js.

## Online Demo

Visit [https://xuperbad.github.io/mdEditor/](https://xuperbad.github.io/mdEditor/) to use the editor online without installation.

## Features

- 🖋️ Clean, minimalist interface
- 📝 Import and export Markdown files
- 📊 Support for tables and delimiters
- 🖱️ Drag and drop file import
- 🔄 Exported files keep the same filename as imported files
- 📱 Responsive design
- 🌐 Can be deployed to GitHub Pages or other static hosting services
- 🧩 Block-based editing with Editor.js
- 📋 Supports common Markdown elements (headers, lists, code blocks, etc.)

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/xuperbad/mdEditor.git
   cd mdEditor
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build Locally

```bash
npm run preview
```

## Usage

### Importing Markdown

1. Click the "Import" button (↑) in the top-right corner
2. Select a Markdown (.md) file from your computer
3. The file will be loaded into the editor

**OR**

- Simply drag and drop a Markdown file directly onto the editor area

### Editing Content

- Use the Editor.js interface to edit your content
- Click the "+" button to add new blocks
- Use the toolbar to format text
- Add tables, delimiters, and other block elements

### Exporting to Markdown

1. Click the "Export" button (↓) in the top-right corner
2. A Markdown file will be downloaded to your computer
   - If you previously imported a file, the exported file will have the same name
   - Otherwise, it will be named "document.md"

## Deployment to GitHub Pages

### Method 1: Using gh-pages package (Recommended)

1. Install gh-pages package (if not already installed)
   ```bash
   npm install gh-pages --save-dev
   ```

2. Add a deploy script to package.json
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. Configure the base path in vite.config.js
   ```javascript
   // vite.config.js
   export default {
     base: '/mdEditor/', // Replace with your repository name
     // ...other config
   }
   ```

4. Build the project
   ```bash
   npm run build
   ```

5. Deploy to GitHub Pages
   ```bash
   npm run deploy
   ```

6. Enable GitHub Pages in your repository settings
   - Go to your GitHub repository page
   - Click "Settings" > "Pages"
   - Under "Build and deployment", select "Deploy from a branch"
   - Select "gh-pages" branch and "/(root)" folder
   - Click "Save"

7. Wait for deployment to complete (usually takes a few minutes)
   - Once complete, your site will be available at `https://username.github.io/repository-name/`

### Method 2: Using GitHub Actions

1. Create a `.github/workflows` directory in your repository
2. Create a `deploy.yml` file in that directory with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]  # or your default branch name

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

3. Push this file to your repository
4. GitHub Actions will automatically build and deploy your project

### Important Notes

- GitHub Pages URLs are case-sensitive, ensure the `base` path in `vite.config.js` exactly matches your repository name (including case)
- If your repository is private, the deployed GitHub Pages site will still be publicly accessible
- After updating your code, you need to rebuild and redeploy to update the version on GitHub Pages

## Built With

- [Vite](https://vitejs.dev/) - Frontend build tool
- [Editor.js](https://editorjs.io/) - Block-style editor
- [marked](https://marked.js.org/) - Markdown parser and compiler

## License

This project is licensed under the MIT License - see the LICENSE file for details.
