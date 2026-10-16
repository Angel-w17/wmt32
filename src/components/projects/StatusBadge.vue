<script setup>
import { computed } from 'vue'

// 状态徽章：状态是简单字符串数据 → props；展示样式由组件内部映射
const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const badgeClass = computed(() => {
  const map = {
    已完成: 'is-done',
    进行中: 'is-doing',
    规划中: 'is-plan'
  }
  return map[props.status] || ''
})
</script>

<template>
  <span class="badge" :class="badgeClass">{{ status }}</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 1.6;
  white-space: nowrap;
}
.badge.is-done {
  background: color-mix(in srgb, var(--success) 16%, transparent);
  color: var(--success);
}
.badge.is-doing {
  background: color-mix(in srgb, var(--warning) 18%, transparent);
  color: var(--warning);
}
.badge.is-plan {
  background: color-mix(in srgb, var(--info) 18%, transparent);
  color: var(--info);
}
</style>
