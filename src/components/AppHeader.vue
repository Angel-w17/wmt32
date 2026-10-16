<script setup>
// 顶部导航（实验四任务10：使用 Element Plus 菜单组件实现导航）
// - el-menu（horizontal 水平模式）：顶部导航菜单容器
// - el-menu-item + router 模式：index 即路由路径，点击自动 router.push 跳转
// - el-menu 的 active 高亮由 default-active（当前路由路径）控制，替代原 router-link-active
// - el-switch：暗色/亮色主题切换开关
// - el-button + 图标：后台管理/登录入口
// 实验四改造：使用 Pinia userStore + storeToRefs 解构 isAuthed，保持响应式
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/userStore.js'

defineProps({
  isDark: {
    type: Boolean,
    default: false
  },
  navItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['toggle-theme'])
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
// storeToRefs 解构 isAuthed（state），保持响应式（直接解构会丢失响应性）
const { isAuthed } = storeToRefs(userStore)

// 当前激活的菜单项：项目详情页 /projects/1 也要高亮 /projects
const activeMenu = computed(() =>
  route.path.startsWith('/projects') ? '/projects' : route.path
)

// 编程式导航：跳转到后台管理（如果已登录）或登录页
function goAdmin() {
  if (isAuthed.value) {
    router.push({ name: 'admin' })
  } else {
    router.push({ name: 'login' })
  }
}
</script>

<template>
  <header class="app-header">
    <div class="nav-container">
      <div class="brand"><span class="brand-icon">◆</span>我的个人主页</div>

      <!-- el-menu：水平导航菜单（router 模式下 index 即跳转路径） -->
      <el-menu
        mode="horizontal"
        :default-active="activeMenu"
        :ellipsis="false"
        router
        class="nav-menu"
      >
        <el-menu-item v-for="item in navItems" :key="item.name" :index="'/' + item.name">
          {{ item.label }}
        </el-menu-item>
      </el-menu>

      <div class="nav-actions">
        <el-button type="primary" plain round @click="goAdmin">
          <el-icon style="margin-right: 4px"><Setting /></el-icon>
          {{ isAuthed ? '后台管理' : '登录' }}
        </el-button>
        <!-- el-switch：主题切换开关（active-text 等属性控制文案） -->
        <el-switch
          :model-value="isDark"
          inline-prompt
          active-text="暗"
          inactive-text="亮"
          @change="emit('toggle-theme')"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-container {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
}
.brand {
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
  white-space: nowrap;
}
.brand-icon {
  color: var(--primary);
}
.nav-menu {
  flex: 1;
  border-bottom: none !important;
  background: transparent;
}
/* 让菜单项与页面整体风格协调 */
.nav-menu :deep(.el-menu-item) {
  font-size: 14px;
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
}
@media (max-width: 700px) {
  .nav-container {
    flex-wrap: wrap;
  }
  .nav-menu {
    order: 3;
    width: 100%;
  }
}
</style>
