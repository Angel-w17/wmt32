<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// visible 只影响当前组件的显隐，属于组件内部状态
const visible = ref(false)

function handleScroll() {
  visible.value = window.scrollY > 300
}

// 点击时向父组件报告事件，由父组件决定如何滚动
const emit = defineEmits(['back-top'])

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <button
    class="back-top"
    :class="{ show: visible }"
    title="返回顶部"
    @click="emit('back-top')"
  >
    ↑
  </button>
</template>
