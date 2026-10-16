<script setup>
// 可复用项目卡片：
// - 标题、状态是简单数据 → props；
// - 项目简介/技术标签等主体内容结构多变 → 默认插槽；
// - 操作按钮、底部进度由父组件按需定制 → 具名插槽 actions / footer。
// 实验四优化：添加 hover 悬停效果、点击整卡可跳转（pointer 交互提示）
import StatusBadge from './StatusBadge.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
})
</script>

<template>
  <article class="project-card card">
    <header class="project-card__header">
      <h3 class="project-card__title">{{ title }}</h3>
      <StatusBadge :status="status" />
    </header>

    <!-- 默认插槽：项目主体内容（简介、技术标签等由父组件决定） -->
    <div class="project-card__body">
      <slot />
    </div>

    <footer v-if="$slots.actions || $slots.footer" class="project-card__footer">
      <div v-if="$slots.footer" class="project-card__meta">
        <!-- 具名插槽 footer：进度等底部信息 -->
        <slot name="footer" />
      </div>
      <div v-if="$slots.actions" class="project-card__actions">
        <!-- 具名插槽 actions：按钮组合由父组件决定 -->
        <slot name="actions" />
      </div>
    </footer>
  </article>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  border: 1px solid transparent;
}
.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px var(--shadow);
  border-color: var(--primary);
}
.project-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 18px 20px 0;
}
.project-card__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}
.project-card__body {
  padding: 14px 20px;
  flex: 1;
}
.project-card__footer {
  padding: 14px 20px 18px;
  border-top: 1px solid var(--border-soft);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.project-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
