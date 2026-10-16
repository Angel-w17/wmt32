// main.js：创建并挂载 Vue 应用（工程入口）
// 实验四改造：引入 Pinia 状态管理 + Element Plus 组件库（任务8：安装并全局注册）
// 作用：注册根组件 App.vue、全局样式、Pinia、Vue Router 路由实例、Element Plus
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Element Plus 全局引入：组件库 + 基础样式 + 暗色主题变量（配合 html.dark 类切换）
// 全局注册方式使用简单，适合实验阶段（按需引入需 unplugin 系列插件，适合生产项目）
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// Element Plus 官方图标库（用于菜单、按钮等处的图标）
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router/index.js'
import './style.css'

// 创建 Pinia 实例
const pinia = createPinia()

// 创建应用实例
const app = createApp(App)

// 全局注册 Element Plus（app.use 后所有 <el-xxx> 组件在模板中直接可用）
app.use(ElementPlus)
// 全局注册所有图标组件：模板中 <el-icon><User /></el-icon> 直接使用
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册 Pinia → 注册路由 → 挂载到 #app
app.use(pinia).use(router).mount('#app')
