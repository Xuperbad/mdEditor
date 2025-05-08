// vite.config.js
export default {
  // 如果部署到GitHub Pages的子目录，请取消注释下面这行并替换为您的仓库名称
  base: '/mdEditor/',
  
  // 如果部署到根域名，保持base为'/'
  base: '/',
  
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
