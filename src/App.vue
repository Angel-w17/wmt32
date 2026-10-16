<!--
  App.vue：根组件，组织整个页面骨架

  实验四任务9/10：使用 Element Plus 布局组件重构整体结构
  - el-container：布局容器（外层骨架）
  - el-header：顶部导航区（内含 AppHeader，使用 el-menu 菜单组件导航）
  - el-main：主内容区（RouterView 路由出口）
  - el-footer：底部信息区

  组件树：
  el-container
  ├─ el-header → AppHeader      顶部导航（el-menu 菜单 + el-switch 主题开关）
  ├─ el-main → <RouterView>     路由出口：根据 URL 匹配路由表渲染对应页面组件
  │  ├─ ProfileView            /home  → 个人主页（el-descriptions + el-timeline 时间线）
  │  ├─ ProjectsLayout         /projects → 项目展示布局（嵌套路由父级）
  │  │  ├─ ProjectListView     /projects（默认子路由）→ 项目列表
  │  │  └─ ProjectDetailView   /projects/:id（动态路由）→ 项目详情
  │  ├─ ArticleListView        /articles → 文章列表（el-table 展示）
  │  ├─ AboutView              /about → 关于本站
  │  ├─ LoginView              /login → 身份认证页（el-form 登录表单）
  │  ├─ AdminLayout            /admin → 后台管理布局（嵌套路由父级，requiresAuth）
  │  │  ├─ EditProfileView     /admin/profile → 编辑个人信息（el-form）
  │  │  ├─ EditProjectsView    /admin/projects → 编辑项目信息（el-dialog + el-form）
  │  │  └─ EditArticlesView    /admin/articles → 文章管理（el-table + el-dialog）
  │  └─ NotFoundView           /:pathMatch(.*)* → 404 页面
  └─ el-footer → AppFooter     底部信息

  状态归属：
  - 跨路由共享的数据（person、projects、articles、isAuthed）由 Pinia Store 管理；
  - 主题状态（isDark）仍由根组件持有，切换 html.dark 类联动 Element Plus 暗色主题。
-->
<script setup>
// 实验四改造：使用 Pinia 的 userStore 替换原有全局 store
// storeToRefs 解构 person 保持响应式
import { ref, watch, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import BackToTop from './components/BackToTop.vue'
import { useUserStore } from './stores/userStore.js'
import { skills } from './data/profile.js'

const userStore = useUserStore()
// storeToRefs 解构 person（state），保持响应式
const { person } = storeToRefs(userStore)

// 主题状态（false = 亮色，true = 暗色）
// 切换 html.dark 类同时联动原生样式变量与 Element Plus 暗色主题（css-vars）
const isDark = ref(false)
watch(
  isDark,
  (val) => document.documentElement.classList.toggle('dark', val),
  { immediate: true }
)

// 导航数据：使用命名路由的 name 进行跳转（实验四新增"文章"导航）
const navItems = [
  { name: 'home', label: '个人主页' },
  { name: 'projects', label: '项目展示' },
  { name: 'articles', label: '文章' },
  { name: 'about', label: '关于' }
]

function toggleTheme() {
  isDark.value = !isDark.value
}
function handleBackTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  console.log('[mounted] Pinia + Vue Router + Element Plus 应用加载完成！')
  console.log('[mounted] 当前共有技能：', skills.length, '项；个人信息：', person.value.name)
})
</script>

<template>
  <!-- el-container：Element Plus 布局容器（子元素含 el-header/el-footer 时垂直排布） -->
  <el-container class="app-shell">
    <!-- el-header：顶部区域（高度由 CSS 控制） -->
    <el-header class="app-header-wrap" height="auto">
      <AppHeader :is-dark="isDark" :nav-items="navItems" @toggle-theme="toggleTheme" />
    </el-header>

    <!-- el-main：主内容区，路由出口 -->
    <el-main class="main-content">
      <RouterView />
    </el-main>

    <!-- el-footer：底部区域 -->
    <el-footer class="app-footer-wrap" height="auto">
      <AppFooter
        :author="person.name"
        :student-id="person.studentId"
        copyright="© 2026 魏明涛 个人主页 · 实验四 状态管理与UI组件库"
      />
    </el-footer>
  </el-container>

  <BackToTop @back-top="handleBackTop" />
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}
/* 覆盖 el-header/el-footer/el-main 的默认内边距，交给子组件控制 */
.app-header-wrap {
  padding: 0;
}
.app-footer-wrap {
  padding: 0;
}
.main-content {
  padding: 0;
}
</style>
