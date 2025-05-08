// vite.config.js
export default {
  // 设置base路径为您的仓库名称
  // 如果部署到GitHub Pages的子目录，使用'/repo-name/'
  // 如果部署到根域名，使用'/'
  base: '/mdeditor/',

  build: {
    // 生成sourcemap以便于调试
    sourcemap: true,

    // 自定义构建选项
    rollupOptions: {
      output: {
        // 自定义chunk命名
        manualChunks: undefined
      }
    }
  }
}
