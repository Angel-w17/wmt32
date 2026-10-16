<script setup>
// 可复用搜索框：使用 defineModel 实现双向绑定
// 父组件用法：<SearchBox v-model="keyword" placeholder="..." />
defineProps({
  placeholder: {
    type: String,
    default: '请输入关键词搜索…'
  }
})

// defineModel 等价于接收 modelValue prop + 触发 update:modelValue 事件
const keyword = defineModel()
</script>

<template>
  <input
    class="search-box"
    type="text"
    :placeholder="placeholder"
    v-model="keyword"
  >
</template>
