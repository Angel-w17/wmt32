<script setup>
// 身份认证页面（登录页）：
// 实验四任务10：使用 Element Plus 表单组件重构登录表单
// - el-form + el-form-item：表单容器与表单项（label、:model 绑定数据对象）
// - el-input：输入框（prefix-icon 前置图标、show-password 密码可见切换、clearable 一键清空）
// - el-alert：错误提示条
// - el-button：登录按钮（native-type="submit" 支持 enter 提交）
// - ElMessage：登录成功的轻提示
// 登录逻辑：调用 userStore.login() 设置登录状态（自动持久化到 localStorage），
// 通过编程式导航跳转：有 redirect 参数则 router.replace 回原目标页，否则跳到后台管理
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/userStore.js'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// el-form 的数据对象（:model 绑定）
const form = reactive({
  username: '',
  password: ''
})

// 简单校验：提交时检查非空（el-form 也支持 rules 异步校验，这里手动校验即可）
function handleLogin() {
  if (!form.username.trim() || !form.password.trim()) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  // 演示用：任意非空输入即可登录（实际项目应调用后端接口验证）
  // 调用 userStore 的 login action（内部会持久化到 localStorage）
  userStore.login()
  ElMessage.success(`登录成功，欢迎回来，${userStore.displayName}！`)

  // 读取 query.redirect（路由守卫拦截时携带的目标地址）
  const redirect = route.query.redirect
  if (redirect) {
    // replace：替换当前历史记录，避免返回键回到登录页
    router.replace(redirect)
  } else {
    router.push({ name: 'admin' })
  }
}
</script>

<template>
  <div class="page">
    <el-card class="login-card" shadow="hover">
      <template #header>
        <div class="login-head">
          <el-icon :size="26" color="var(--primary)"><Lock /></el-icon>
          <div>
            <h1 class="login-title">后台管理登录</h1>
            <p class="login-hint">请登录后管理个人简介、项目与文章信息</p>
          </div>
        </div>
      </template>

      <!-- el-form：登录表单（@submit.native 已废弃，Vue3 用 @keyup.enter 或按钮 submit） -->
      <el-form :model="form" label-position="top" size="large" @submit.prevent="handleLogin">
        <el-form-item label="用户名">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            clearable
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
            :prefix-icon="Lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-button type="primary" class="login-btn" native-type="submit" size="large">
          登 录
        </el-button>
      </el-form>

      <el-alert
        class="login-tip"
        title="演示环境：任意非空用户名和密码即可登录"
        type="info"
        :closable="false"
        show-icon
      />
    </el-card>
  </div>
</template>

<style scoped>
.login-card {
  max-width: 420px;
  margin: 40px auto;
}
.login-head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.login-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
}
.login-hint {
  font-size: 12px;
  color: var(--text-sub);
  margin-top: 2px;
}
.login-btn {
  width: 100%;
  margin-top: 4px;
}
.login-tip {
  margin-top: 16px;
}
</style>
