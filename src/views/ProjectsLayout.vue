<script setup>
// 项目展示布局（嵌套路由父级组件）：
// 提供共享的页面介绍与统计区域，子路由（列表 / 详情）渲染到内部 <RouterView>
// 实验四改造：使用 Pinia projectStore + storeToRefs 解构统计数据（getters）
// 实验四优化：统计卡片更美观，介绍区排版更清晰
import { RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '../stores/projectStore.js'
import SectionCard from '../components/projects/SectionCard.vue'
import StatusBadge from '../components/projects/StatusBadge.vue'

const projectStore = useProjectStore()
// storeToRefs 解构 getters（total、doneCount、doingCount），保持响应式
const { total, doneCount, doingCount } = storeToRefs(projectStore)
</script>

<template>
  <div class="page">
    <!-- 共享区块：页面介绍 + 统计（子路由切换时此区域不变） -->
    <SectionCard title="项目展示">
      <p class="intro">
        这里汇总了我在课程学习与课外实践中完成的项目，涵盖 Web 应用、数据可视化与工具类开发。
        点击项目卡片或"查看详情"按钮可查看完整信息，或在列表中按名称、技术栈检索。
      </p>
      <div class="stats">
        <div class="stat-item stat-total">
          <strong>{{ total }}</strong>
          <span>项目总数</span>
        </div>
        <div class="stat-item stat-done">
          <strong>{{ doneCount }}</strong>
          <span><StatusBadge status="已完成" /></span>
        </div>
        <div class="stat-item stat-doing">
          <strong>{{ doingCount }}</strong>
          <span><StatusBadge status="进行中" /></span>
        </div>
      </div>

      <template #footer>
        数据驱动渲染：修改 projectStore 中的 projects 数据即可增删项目
      </template>
    </SectionCard>

    <!-- 嵌套路由出口：子路由（列表 / 详情）渲染到这里 -->
    <RouterView />
  </div>
</template>

<style scoped>
.intro {
  font-size: 14px;
  color: var(--text-sub);
  line-height: 1.8;
}
.stats {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}
.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 18px 12px;
  border-radius: 10px;
  background: var(--detail-bg);
  transition: transform 0.2s ease;
}
.stat-item:hover {
  transform: translateY(-2px);
}
.stat-item strong {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
}
.stat-item span {
  font-size: 13px;
  color: var(--text-label);
}
.stat-total {
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, transparent), transparent);
}
.stat-done {
  background: linear-gradient(135deg, color-mix(in srgb, var(--success) 12%, transparent), transparent);
}
.stat-doing {
  background: linear-gradient(135deg, color-mix(in srgb, var(--warning) 12%, transparent), transparent);
}

@media (max-width: 600px) {
  .stats {
    flex-direction: column;
  }
}
</style>
