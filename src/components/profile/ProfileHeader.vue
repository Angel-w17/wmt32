<script setup>
// 个人主页头部：纯展示组件，通过 props 接收个人信息
defineProps({
  person: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="profile-header">
    <img class="avatar" :src="person.avatar" :alt="person.name">
    <h1>{{ person.name }}</h1>
    <p>{{ person.major }} · {{ person.class }}</p>
  </div>
</template>

<style scoped>
.profile-header {
  padding: 32px 28px;
  text-align: center;
  border-bottom: 1px solid var(--border);
}
.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}
.profile-header h1 {
  font-size: 22px;
  font-weight: 600;
  margin-top: 14px;
  color: var(--text);
}
.profile-header p {
  font-size: 13px;
  color: var(--text-sub);
  margin-top: 4px;
}
</style>
