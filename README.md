# MD 编辑器

一个基于 Editor.js 构建的轻量级、极简风格的 Markdown 编辑器。

## 在线演示

访问 [https://xuperbad.github.io/mdEditor/](https://xuperbad.github.io/mdEditor/)

## 主要功能

- 📄 导入/导出 Markdown 文件
- 📂 拖放文件导入
- 📊 支持表格和分隔符
- 🔄 导出文件保持与导入文件相同的文件名
- 🧩 基于 Editor.js 的块编辑功能

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 部署到 GitHub Pages

### 方法一：使用 gh-pages 包（推荐）

1. 安装 gh-pages 包
   ```bash
   npm install gh-pages --save-dev
   ```

2. 在 package.json 中添加部署脚本
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. 在 vite.config.js 中配置基本路径
   ```javascript
   export default {
     base: '/mdEditor/', // 替换为你的仓库名
   }
   ```

4. 构建并部署
   ```bash
   npm run build
   npm run deploy
   ```

5. 在仓库设置中启用 GitHub Pages
   - 选择 "gh-pages" 分支和 "/(root)" 文件夹

### 方法二：使用 GitHub Actions

1. 创建 `.github/workflows/deploy.yml` 文件，内容如下：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

### 注意事项

- GitHub Pages URL 区分大小写，确保 `vite.config.js` 中的 `base` 路径与仓库名完全匹配
- 私有仓库的 GitHub Pages 站点仍然可以公开访问
- 更新代码后需要重新构建和部署

## 技术栈

- [Vite](https://vitejs.dev/) - 前端构建工具
- [Editor.js](https://editorjs.io/) - 块式编辑器
- [marked](https://marked.js.org/) - Markdown 解析器

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 LICENSE 文件。
