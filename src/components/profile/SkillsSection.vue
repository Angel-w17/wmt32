<script setup>
// 技能与兴趣：props 接收技能数组；搜索词只在本区域使用，属于组件内部状态
import { ref, computed, watch } from 'vue'
import SearchBox from '../SearchBox.vue'

const props = defineProps({
  skills: {
    type: Array,
    required: true
  }
})

// 搜索词通过 v-model 传给 SearchBox（子组件 defineModel 双向同步）
const keyword = ref('')

// 组合式 API：computed 根据关键词筛选技能
const filteredSkills = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return props.skills
  return props.skills.filter(skill => skill.toLowerCase().includes(kw))
})

// 组合式 API：watch 监听搜索词变化
watch(keyword, (newVal, oldVal) => {
  console.log(
    `[watch] 搜索关键词变化："${oldVal}" → "${newVal}"，筛选结果：${filteredSkills.value.length} 条`
  )
})
</script>

<template>
  <section>
    <h2 class="section-title">技能与兴趣</h2>

    <SearchBox v-model="keyword" placeholder="输入关键词搜索技能…" />

    <div class="skills">
      <span v-for="skill in filteredSkills" :key="skill" class="skill-tag">
        {{ skill }}
      </span>
      <p v-if="filteredSkills.length === 0" class="empty-hint">
        未找到匹配的技能
      </p>
    </div>
  </section>
</template>

<style scoped>
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.skill-tag {
  padding: 4px 14px;
  background: var(--tag-bg);
  color: var(--primary);
  border-radius: 16px;
  font-size: 13px;
}
</style>
