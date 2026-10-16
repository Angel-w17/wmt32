<script setup>
// 项目列表容器：
// - items 是数据集合 → props；
// - 每个项目"长什么样"由父组件决定，列表把当前 project 和 index
//   通过【作用域插槽】暴露给父组件模板；
// - 空状态内容通过具名插槽 empty 定制。
defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div v-if="items.length" class="project-grid">
    <slot
      v-for="(project, index) in items"
      :key="project.id"
      :project="project"
      :index="index"
    />
  </div>

  <!-- 具名插槽：空数据提示（提供默认内容，父组件可覆盖） -->
  <div v-else class="project-empty">
    <slot name="empty">暂无项目</slot>
  </div>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}
.project-empty {
  text-align: center;
  padding: 48px 0;
  color: var(--text-label);
  font-size: 14px;
}
</style>
