// 文章初始数据（实验四新增）
// 集中管理文章展示数据，便于 Store 初始化与维护
export const articles = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 入门指南',
    category: '前端基础',
    summary:
      '介绍 Vue 3 组合式 API 的核心概念，包括 setup 函数、ref 与 reactive 的区别、computed 与 watch 的使用场景，帮助初学者快速上手。',
    content:
      'Vue 3 的组合式 API（Composition API）是一种全新的逻辑组织方式。相比选项式 API，它能够更好地复用逻辑、按功能而非选项类型组织代码。ref 用于基本类型，reactive 用于对象；computed 提供缓存特性，watch 用于副作用。掌握这些基础后，可以灵活应对各种复杂场景。',
    tags: ['Vue 3', '组合式 API', '前端'],
    date: '2026-03-15',
    views: 128
  },
  {
    id: 2,
    title: 'Pinia 状态管理最佳实践',
    category: '状态管理',
    summary:
      '深入理解 Pinia 的 Store 设计模式，对比 Setup Store 与 Option Store 的差异，掌握 state、getters、actions 的合理划分与持久化方案。',
    content:
      'Pinia 是 Vue 官方推荐的状态管理库，相比 Vuex 更加轻量。Setup Store 使用组合式函数语法，更灵活；Option Store 类似选项式 API。state 用 ref/reactive，getters 用 computed，actions 用普通函数。持久化可通过 localStorage 手动实现，或使用 pinia-plugin-persistedstate 插件。',
    tags: ['Pinia', '状态管理', 'Vue 3'],
    date: '2026-03-22',
    views: 256
  },
  {
    id: 3,
    title: 'Vue Router 路由守卫实战',
    category: '路由',
    summary:
      '详解 Vue Router 的全局守卫、路由独享守卫与组件内守卫，结合 Pinia 实现基于登录状态的访问控制与权限管理。',
    content:
      'Vue Router 提供三类守卫：全局守卫（beforeEach/afterEach）、路由独享守卫（beforeEnter）、组件内守卫（beforeRouteEnter 等）。实际项目中，常在 beforeEach 中读取 Pinia 的用户 Store 判断登录状态，结合 meta.requiresAuth 灵活控制页面访问权限。',
    tags: ['Vue Router', '路由守卫', '权限控制'],
    date: '2026-04-01',
    views: 189
  },
  {
    id: 4,
    title: 'Vite 构建工具深度解析',
    category: '工程化',
    summary:
      '从源码层面理解 Vite 的依赖预构建、按需编译与 HMR 机制，掌握生产环境优化配置与插件开发基础。',
    content:
      'Vite 利用浏览器原生 ES Module 实现极速启动。开发时按需编译，生产时用 Rollup 打包。依赖预构建将 CommonScript 转为 ESM。HMR 通过 WebSocket 精准更新模块。掌握这些原理，能够更好地优化构建配置与排查问题。',
    tags: ['Vite', '构建工具', '工程化'],
    date: '2026-04-10',
    views: 95
  }
]
