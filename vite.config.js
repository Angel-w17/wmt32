import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite 配置：启用 Vue 单文件组件支持
// GitHub Pages 部署配置（拓展任务）：
// Pages 线上访问路径带仓库名前缀（https://<username>.github.io/<repo>/），
// 因此【生产构建】时 base 必须设置为 '/仓库名/'（前后都要有斜杠）；
// 本地开发（mode === 'development'）仍使用 '/'，互不影响。
// ⚠️ 部署前请把下方 '你的仓库名称' 替换为你的 GitHub 仓库名！
export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  base: mode === 'production' ? '/WMT32/' : '/',
  server: {
    open: true,
    port: 5173
  }
}))
