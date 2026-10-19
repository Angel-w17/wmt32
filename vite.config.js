import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite 配置：启用 Vue 单文件组件支持
// GitHub Pages 部署配置（拓展任务）：
// Pages 线上访问路径带仓库名前缀（https://<username>.github.io/<repo>/），
// 因此【生产构建】时 base 必须设置为 '/仓库名/'（前后都要有斜杠，且必须小写，GitHub Pages 路径区分大小写）；
// 本地开发（mode === 'development'）仍使用 '/'，互不影响。
// 本仓库为 https://github.com/Angel-w17/wmt32，Pages 地址：https://angel-w17.github.io/wmt32/
export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  base: mode === 'production' ? '/wmt32/' : '/',
  server: {
    open: true,
    port: 5173
  }
}))
