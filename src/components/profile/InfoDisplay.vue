<script setup>
// 基本信息查看模式：props 接收 person，点击“编辑信息”时 emit 通知父组件
defineProps({
  person: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit'])
</script>

<template>
  <div>
    <div class="info-row">
      <span class="info-label">学号</span>
      <span class="info-value">{{ person.studentId }}</span>
    </div>
    <div class="info-row">
      <span class="info-label">邮箱</span>
      <span class="info-value">{{ person.email }}</span>
    </div>
    <div class="info-row">
      <span class="info-label">个人简介</span>
      <span class="info-value">{{ person.intro }}</span>
    </div>

    <div class="actions">
      <button class="btn" @click="emit('edit')">编辑信息</button>
    </div>
  </div>
</template>

<style scoped>
.info-row {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-soft);
  font-size: 14px;
}
.info-label {
  width: 90px;
  color: var(--text-label);
  flex-shrink: 0;
}
.info-value {
  color: var(--text);
  flex: 1;
}
.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>
