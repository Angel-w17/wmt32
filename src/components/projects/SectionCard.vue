<script setup>
// 可复用区块容器：
// - title 是简单文本数据 → 用 props；
// - 右上角操作区与底部区结构由父组件决定 → 用具名插槽；
// - 主体内容结构不固定 → 用默认插槽。
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <section class="card section-card">
    <header class="section-card__header">
      <h2>{{ title }}</h2>
      <div class="section-card__actions">
        <!-- 具名插槽：标题右侧操作区（如按钮、筛选器） -->
        <slot name="actions" />
      </div>
    </header>

    <!-- 默认插槽：区块主体 -->
    <div class="section-card__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="section-card__footer">
      <!-- 具名插槽：底部补充信息 -->
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.section-card {
  margin-bottom: 24px;
}
.section-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 22px;
  border-bottom: 1px solid var(--border);
}
.section-card__header h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}
.section-card__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.section-card__body {
  padding: 22px;
}
.section-card__footer {
  padding: 12px 22px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-label);
}
</style>
