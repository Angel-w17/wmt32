<script setup>
// 后台管理布局（嵌套路由父级组件，meta.requiresAuth 保护）：
// 实验四任务10：使用 Element Plus 组件重构后台管理布局
// - el-menu（vertical 垂直模式 + router 模式）：后台侧边导航菜单
// - el-button：退出登录按钮
// 子路由渲染到内部 <RouterView>；
// 退出登录：调用 userStore.logout() 清除登录状态（自动持久化），replace 回首页
import { computed } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../stores/userStore.js'

const router = useRouter()
const userStore = useUserStore()
// storeToRefs 解构 person 和 displayName（state/getters），保持响应式
const { displayName } = storeToRefs(userStore)

// 管理导航（实验四新增"文章管理"）
const adminNav = [
  { name: 'admin-profile', path: '/admin/profile', label: '编辑个人信息', icon: 'User' },
  { name: 'admin-projects', path: '/admin/projects', label: '编辑项目信息', icon: 'Folder' },
  { name: 'admin-articles', path: '/admin/articles', label: '文章管理', icon: 'Document' }
]

// 当前激活菜单项：跟随当前路由路径
const activeMenu = computed(() => router.currentRoute.value.path)

// 退出登录：调用 userStore 的 logout action（内部会持久化到 localStorage）
function logout() {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.replace({ name: 'home' })
}
</script>

<template>
  <div class="page admin-page">
    <div class="card admin-layout">
      <!-- 后台管理侧边栏：el-menu 垂直菜单（router 模式 index 即路径） -->
      <aside class="admin-sidebar">
        <h3 class="admin-title">后台管理</h3>
        <p class="admin-user">当前用户：{{ displayName }}</p>

        <el-menu :default-active="activeMenu" router class="admin-menu">
          <el-menu-item v-for="item in adminNav" :key="item.name" :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </el-menu-item>
        </el-menu>

        <el-button type="danger" plain class="admin-logout" @click="logout">
          <el-icon style="margin-right: 4px"><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </aside>

      <!-- 子路由出口 -->
      <div class="admin-content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 400px;
}
.admin-sidebar {
  width: 200px;
  flex-shrink: 0;
  padding: 24px 14px;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}
.admin-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  padding-left: 8px;
}
.admin-user {
  font-size: 12px;
  color: var(--text-label);
  margin: 4px 0 16px;
  padding-left: 8px;
}
.admin-menu {
  border-right: none;
  background: transparent;
}
.admin-logout {
  margin-top: auto;
}
.admin-content {
  flex: 1;
  /* min-width: 0 让 flex 子项可收缩，否则内部表格的固有宽度会撑破卡片导致右侧列被裁掉 */
  min-width: 0;
  padding: 24px 28px;
  overflow-x: auto;
}

@media (max-width: 600px) {
  .admin-layout { flex-direction: column; }
  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}
</style>
