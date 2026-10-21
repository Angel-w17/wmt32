// Vue Router 配置：路由表 + 全局前置守卫
// 实验四改造：守卫改用 Pinia 的 userStore 判断登录状态
// 综合应用：基础路由、命名路由、动态路由、嵌套路由、重定向、路由元信息、路由守卫
import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '../stores/userStore.js'

// 路由表
const routes = [
  // 根路径重定向到首页（redirect 的应用）
  { path: '/', redirect: '/home' },

  // 首页：个人主页（命名路由 + meta 标题）
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/ProfileView.vue'),
    meta: { title: '个人主页' }
  },

  // 项目展示：嵌套路由（父路由提供布局，子路由渲染到 <RouterView>）
  {
    path: '/projects',
    name: 'projects',
    component: () => import('../views/ProjectsLayout.vue'),
    meta: { title: '项目展示' },
    children: [
      // 子路由默认渲染项目列表
      {
        path: '',
        name: 'project-list',
        component: () => import('../views/ProjectListView.vue'),
        meta: { title: '项目列表' }
      },
      // 动态路由：:id 匹配不同项目编号
      {
        path: ':id',
        name: 'project-detail',
        component: () => import('../views/ProjectDetailView.vue'),
        meta: { title: '项目详情' }
      }
    ]
  },

  // 文章列表（实验四新增：公开访问页面）
  {
    path: '/articles',
    name: 'articles',
    component: () => import('../views/ArticleListView.vue'),
    meta: { title: '文章列表' }
  },

  // 关于页面
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { title: '关于本站' }
  },

  // 登录页面（身份认证）
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: '登录' }
  },

  // 后台管理：嵌套路由 + meta.requiresAuth 路由守卫
  {
    path: '/admin',
    name: 'admin',
    // redirect 直接放在父路由上（避免空路径子路由触发 Vue Router 命名警告）
    redirect: '/admin/profile',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { title: '后台管理', requiresAuth: true },
    children: [
      {
        path: 'profile',
        name: 'admin-profile',
        component: () => import('../views/admin/EditProfileView.vue'),
        meta: { title: '编辑个人信息', requiresAuth: true }
      },
      {
        path: 'projects',
        name: 'admin-projects',
        component: () => import('../views/admin/EditProjectsView.vue'),
        meta: { title: '编辑项目信息', requiresAuth: true }
      },
      // 实验四新增：文章管理子路由
      {
        path: 'articles',
        name: 'admin-articles',
        component: () => import('../views/admin/EditArticlesView.vue'),
        meta: { title: '文章管理', requiresAuth: true }
      }
    ]
  },

  // 404 通配符路由（必须放在最后）
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  // Hash 模式（URL 带 # 号，如 /#/home）
  // 原因：GitHub Pages 是静态托管，History 模式下刷新非首页子路由会 404；
  // Hash 模式的路由信息在 # 后，静态服务器始终返回 index.html，刷新不再报错
  // （若想恢复无 # 的 History 模式：改回 createWebHistory()，并在部署时另配 404.html 重定向）
  history: createWebHashHistory(),
  routes,
  // 路由切换时滚动到顶部
  scrollBehavior() {
    return { top: 0 }
  }
})

// 全局前置守卫 beforeEach
// 实验四改造：在守卫内部调用 useUserStore()（而非模块顶层），确保 Pinia 已完成初始化
// 1. 根据 meta.title 动态更新浏览器标题
// 2. 根据 meta.requiresAuth 结合 userStore 的登录状态判断是否放行
router.beforeEach((to, from, next) => {
  // 更新浏览器标题（meta 的应用）
  const baseTitle = '魏明涛个人主页'
  document.title = to.meta.title ? `${to.meta.title} · ${baseTitle}` : baseTitle

  // 在守卫内部获取 userStore 实例（确保 Pinia 已初始化）
  const userStore = useUserStore()

  // 路由守卫：访问需要认证的页面时检查登录状态
  if (to.meta.requiresAuth && !userStore.isAuthed) {
    // 未登录 → 重定向到登录页，并携带 redirect 参数记录目标地址
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
