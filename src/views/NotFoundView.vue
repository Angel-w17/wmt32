<script setup>
// 404 页面（通配符路由 :pathMatch(.*)* 匹配）
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

function goHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="page">
    <div class="card not-found-card">
      <div class="not-found-code">404</div>
      <h2>页面不存在</h2>
      <p>您访问的路径 <code>{{ route.fullPath }}</code> 不存在或已被移除。</p>
      <button class="btn" @click="goHome">返回首页</button>
    </div>
  </div>
</template>

<style scoped>
.not-found-card {
  max-width: 480px;
  margin: 60px auto;
  padding: 48px 28px;
  text-align: center;
}
.not-found-code {
  font-size: 64px;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
  margin-bottom: 16px;
}
.not-found-card h2 {
  font-size: 18px;
  color: var(--text);
  margin-bottom: 8px;
}
.not-found-card p {
  font-size: 14px;
  color: var(--text-sub);
  margin-bottom: 24px;
}
.not-found-card code {
  color: var(--primary);
  background: var(--tag-bg);
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
