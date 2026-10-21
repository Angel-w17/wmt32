<script setup>
// 项目列表（嵌套路由子组件，默认渲染到 /projects）：
// 复用实验二的 SearchBox / SectionCard / ProjectList / ProjectCard 等组件
// 每张卡片可点击跳转到动态路由 /projects/:id 查看详情
// 实验四改造：使用 Pinia projectStore + storeToRefs 解构 projects
// 实验四优化：点击整张卡片可跳转详情，"查看详情"按钮更突出
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useProjectStore } from '../stores/projectStore.js'
import SearchBox from '../components/SearchBox.vue'
import SectionCard from '../components/projects/SectionCard.vue'
import ProjectList from '../components/projects/ProjectList.vue'
import ProjectCard from '../components/projects/ProjectCard.vue'
import StatusBadge from '../components/projects/StatusBadge.vue'
import ProgressBar from '../components/projects/ProgressBar.vue'

const projectStore = useProjectStore()
const router = useRouter()
// storeToRefs 解构 projects（state），保持响应式
const { projects } = storeToRefs(projectStore)

// 搜索词（v-model 传给复用组件 SearchBox）
const keyword = ref('')

// 状态筛选
const statusList = ['全部', '已完成', '进行中', '规划中']
const activeStatus = ref('全部')

// 同时按关键词与状态筛选
const filteredProjects = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return projects.value.filter(p => {
    const matchStatus = activeStatus.value === '全部' || p.status === activeStatus.value
    const matchKeyword =
      !kw ||
      p.name.toLowerCase().includes(kw) ||
      p.intro.toLowerCase().includes(kw) ||
      // 兼容旧数据：tech 可能为字符串（非数组）
      (Array.isArray(p.tech) ? p.tech.join(' ') : String(p.tech ?? '')).toLowerCase().includes(kw)
    return matchStatus && matchKeyword
  })
})

// 点击整张卡片跳转到详情页
function goDetail(id) {
  router.push({ name: 'project-detail', params: { id } })
}

watch(keyword, (newVal, oldVal) => {
  console.log(
    `[watch] 项目搜索词变化："${oldVal}" → "${newVal}"，匹配项目：${filteredProjects.value.length} 个`
  )
})
</script>

<template>
  <!-- 区块：项目列表（actions 具名插槽放搜索与筛选） -->
  <SectionCard title="项目列表">
    <template #actions>
      <div class="filters">
        <button
          v-for="s in statusList"
          :key="s"
          class="filter-btn"
          :class="{ active: activeStatus === s }"
          @click="activeStatus = s"
        >
          {{ s }}
        </button>
      </div>
      <SearchBox v-model="keyword" placeholder="搜索项目名称或技术栈…" />
    </template>

    <!-- ProjectList 通过作用域插槽把当前 project/index 提供给父组件 -->
    <ProjectList :items="filteredProjects">
      <template #default="{ project, index }">
        <div class="project-card-wrapper" @click="goDetail(project.id)">
          <ProjectCard :title="project.name" :status="project.status">
            <p class="project-intro">{{ project.intro }}</p>
            <div class="tech-tags">
              <span v-for="tech in project.tech" :key="tech" class="tech-tag">
                {{ tech }}
              </span>
            </div>
            <p class="project-index">No.{{ index + 1 }}</p>

            <template #footer>
              <ProgressBar :progress="project.progress" />
            </template>

            <template #actions>
              <!-- 查看详情按钮：突出显示，整卡也可点击 -->
              <span class="btn small detail-btn">查看详情 →</span>
              <a
                v-if="project.link"
                class="btn ghost small"
                :href="project.link"
                target="_blank"
                rel="noopener noreferrer"
                @click.stop
              >源码</a>
            </template>
          </ProjectCard>
        </div>
      </template>

      <template #empty>
        未找到匹配的项目，换个关键词或状态试试吧～
      </template>
    </ProjectList>
  </SectionCard>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.filter-btn {
  padding: 6px 14px;
  background: transparent;
  color: var(--text-sub);
  border: 1px solid var(--input-border);
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.filter-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

/* 卡片容器：可点击，鼠标手型 */
.project-card-wrapper {
  cursor: pointer;
  height: 100%;
}

.project-intro {
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.tech-tag {
  padding: 2px 10px;
  font-size: 12px;
  border-radius: 12px;
  background: var(--tag-bg);
  color: var(--primary);
}
.project-index {
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-label);
}

/* 查看详情按钮：突出显示，独占一行占满宽度 */
.detail-btn {
  background: var(--primary);
  color: #fff;
  flex: 1 1 100%;
  width: 100%;
  text-align: center;
}
.btn.small {
  padding: 6px 16px;
  font-size: 13px;
  text-decoration: none;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn.small.ghost {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
}
.btn.small.ghost:hover {
  background: var(--tag-bg);
}

:deep(.section-card__actions .search-box) {
  width: 200px;
}

@media (max-width: 700px) {
  :deep(.section-card__header) {
    flex-direction: column;
    align-items: stretch;
  }
  :deep(.section-card__actions) {
    flex-direction: column;
    align-items: stretch;
  }
  :deep(.section-card__actions .search-box) {
    width: 100%;
  }
}
</style>
