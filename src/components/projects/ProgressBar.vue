<script setup>
// 进度条：进度数值是数据 → props（不使用插槽，因为没有需要父组件决定的模板结构）
defineProps({
  progress: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <div class="progress">
    <div class="progress__track">
      <div class="progress__bar" :style="{ width: progress + '%' }"></div>
    </div>
    <span class="progress__text">{{ progress }}%</span>
  </div>
</template>

<style scoped>
.progress {
  display: flex;
  align-items: center;
  gap: 10px;
}
.progress__track {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: var(--detail-bg);
  overflow: hidden;
}
.progress__bar {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--primary), var(--primary-dark));
  transition: width 0.3s ease;
}
.progress__text {
  font-size: 12px;
  color: var(--text-sub);
  width: 38px;
  text-align: right;
}
</style>
