<script setup>
// 项目详情页（动态路由组件，渲染到 /projects/:id）：
// - useRoute() 获取路由参数 route.params.id（动态路由的核心）
// - useRouter() 实现编程式导航：返回上一页 go(-1)、返回列表 push
// - 无效 id 处理：显示提示并提供跳转链接
// 实验四改造：使用 Pinia projectStore 的 getProjectById action 查找项目
// 实验四优化：详情页排版更清晰，信息层次更分明
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useProjectStore } from '../stores/projectStore.js'
import StatusBadge from '../components/projects/StatusBadge.vue'
import ProgressBar from '../components/projects/ProgressBar.vue'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

// 根据 route.params.id 查找项目（调用 projectStore 的 getProjectById action）
const project = computed(() => projectStore.getProjectById(route.params.id))

// 路由参数是否有效
const isValid = computed(() => !!project.value)

// 编程式导航：返回上一页（router.go(-1) 的应用）
function goBack() {
  router.go(-1)
}

// 编程式导航：返回列表页（router.push 按命名路由跳转）
function goList() {
  router.push({ name: 'project-list' })
}

// 无效详情地址处理：replace 替换当前历史记录，跳转到 404 或列表
function handleInvalid() {
  router.replace({ name: 'not-found' })
}
</script>

<template>
  <div v-if="isValid" class="page">
    <div class="card detail-card">
      <!-- 返回操作区 -->
      <div class="detail-actions">
        <button class="btn ghost" @click="goBack">← 返回上一页</button>
        <button class="btn" @click="goList">返回列表</button>
      </div>

      <!-- 项目详情头部 -->
      <div class="detail-header">
        <div>
          <h1 class="detail-title">{{ project.name }}</h1>
          <div class="detail-meta">
            <StatusBadge :status="project.status" />
            <span class="detail-id">编号 #{{ project.id }}</span>
          </div>
        </div>
      </div>

      <!-- 项目简介 -->
      <section class="detail-section">
        <h2 class="section-title">项目简介</h2>
        <p class="detail-intro">{{ project.intro }}</p>
      </section>

      <!-- 技术栈 -->
      <section class="detail-section">
        <h2 class="section-title">技术栈</h2>
        <div class="tech-tags">
          <span v-for="tech in project.tech" :key="tech" class="tech-tag">
            {{ tech }}
          </span>
        </div>
      </section>

      <!-- 进度 -->
      <section class="detail-section">
        <h2 class="section-title">完成进度</h2>
        <ProgressBar :progress="project.progress" />
      </section>

      <!-- 相关链接 -->
      <section class="detail-section" v-if="project.link || project.demo">
        <h2 class="section-title">相关链接</h2>
        <div class="detail-links">
          <a
            v-if="project.link"
            class="btn"
            :href="project.link"
            target="_blank"
            rel="noopener noreferrer"
          >查看源码</a>
          <a
            v-if="project.demo"
            class="btn ghost"
            :href="project.demo"
            target="_blank"
            rel="noopener noreferrer"
          >在线演示</a>
        </div>
      </section>
    </div>
  </div>

  <!-- 无效详情地址：params.id 不匹配任何项目 -->
  <div v-else class="page">
    <div class="card not-found-detail">
      <h2>未找到该项目</h2>
      <p>项目编号 <strong>{{ route.params.id }}</strong> 不存在，可能已被删除或地址输入有误。</p>
      <div class="detail-actions">
        <button class="btn" @click="goList">返回项目列表</button>
        <button class="btn ghost" @click="handleInvalid">跳转到 404</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-card {
  padding: 24px 28px 32px;
}
.detail-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.detail-header {
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}
.detail-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
}
.detail-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}
.detail-id {
  font-size: 13px;
  color: var(--text-label);
}
.detail-section {
  margin-top: 28px;
}
.detail-intro {
  font-size: 14px;
  color: var(--text-sub);
  line-height: 1.9;
}
.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tech-tag {
  padding: 4px 14px;
  font-size: 13px;
  border-radius: 16px;
  background: var(--tag-bg);
  color: var(--primary);
}
.detail-links {
  display: flex;
  gap: 12px;
}

.not-found-detail {
  padding: 48px 28px;
  text-align: center;
}
.not-found-detail h2 {
  font-size: 18px;
  color: var(--text);
  margin-bottom: 12px;
}
.not-found-detail p {
  font-size: 14px;
  color: var(--text-sub);
  margin-bottom: 24px;
}
.not-found-detail .detail-actions {
  justify-content: center;
}
</style>
