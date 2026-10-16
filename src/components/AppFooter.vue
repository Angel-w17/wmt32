<script setup>
// 底部信息：纯展示组件，所有内容通过 props 传入
defineProps({
  author: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  copyright: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <footer class="app-footer">
    <p>{{ copyright }}</p>
    <p>{{ author }}（学号：{{ studentId }}） · 基于 Vue 3 组合式 API 构建</p>
  </footer>
</template>
