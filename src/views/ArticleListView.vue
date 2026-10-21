<script setup>
// 文章列表页（公开访问，渲染到 /articles）：
// 实验四任务10：使用 Element Plus 列表/表格组件展示文章
// - el-table + el-table-column：文章列表表格（type="expand" 展开行查看正文）
// - el-tag：分类与标签展示（不同 type 呈现颜色语义）
// - el-select / el-option：分类筛选下拉框
// - el-input：关键词搜索输入框（prefix-icon、clearable）
// - el-empty：筛选无结果时的空状态提示
// - el-statistic：文章总数 / 累计阅读统计
// 实验四改造：使用 articleStore + storeToRefs 解构 state/getters，保持响应式
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Search } from '@element-plus/icons-vue'
import { useArticleStore } from '../stores/articleStore.js'

// 获取文章 Store 实例
const articleStore = useArticleStore()
// 使用 storeToRefs 解构 state（articles）和 getters（total、categories、totalViews），保持响应式
const { articles, total, categories, totalViews } = storeToRefs(articleStore)

// 搜索词（el-input v-model 绑定）
const keyword = ref('')
// 当前选中的分类筛选（默认"全部"）
const activeCategory = ref('全部')
// 当前展开的文章行 key（用于展开行展示正文）
const expandedRows = ref([])

// 同时按关键词与分类筛选文章
const filteredArticles = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return articles.value.filter(a => {
    const matchCategory = activeCategory.value === '全部' || a.category === activeCategory.value
    const matchKeyword =
      !kw ||
      a.title.toLowerCase().includes(kw) ||
      a.summary.toLowerCase().includes(kw) ||
      // 兼容旧数据：tags 可能为字符串（非数组）
      (Array.isArray(a.tags) ? a.tags.join(' ') : String(a.tags ?? '')).toLowerCase().includes(kw)
    return matchCategory && matchKeyword
  })
})

// 展开行变化时调用：展开某行即阅读正文，阅读量 +1（调用 articleStore action，自动持久化）
function handleExpandChange(row, expandedList) {
  expandedRows.value = expandedList.map(r => r.id)
  if (expandedList.some(r => r.id === row.id)) {
    articleStore.incrementViews(row.id)
  }
}

// 分类标签颜色映射（不同分类不同颜色，el-tag 的 type 属性）
function categoryType(category) {
  const map = { '前端基础': 'primary', '状态管理': 'success', '路由': 'warning', '工程化': 'danger', '其他': 'info' }
  return map[category] || 'info'
}
</script>

<template>
  <div class="page">
    <!-- el-card：文章列表容器 -->
    <el-card shadow="hover">
      <template #header>
        <div class="article-header-bar">
          <h2 class="section-title-inline">文章列表</h2>
          <div class="article-filters">
            <!-- el-select：分类筛选 -->
            <el-select v-model="activeCategory" style="width: 130px">
              <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
            </el-select>
            <!-- el-input：关键词搜索 -->
            <el-input
              v-model="keyword"
              placeholder="搜索标题、摘要或标签…"
              clearable
              :prefix-icon="Search"
              style="width: 220px"
            />
          </div>
        </div>
      </template>

      <!-- 统计条 -->
      <div class="article-stats">
        <el-tag effect="plain" size="large">共 {{ total }} 篇文章</el-tag>
        <el-tag type="success" effect="plain" size="large">累计阅读 {{ totalViews }} 次</el-tag>
        <el-tag type="warning" effect="plain" size="large">当前匹配 {{ filteredArticles.length }} 篇</el-tag>
      </div>

      <!-- el-table：文章表格（type="expand" 行展开查看正文） -->
      <el-table
        :data="filteredArticles"
        row-key="id"
        style="width: 100%"
        @expand-change="handleExpandChange"
      >
        <!-- 展开列：展开显示文章正文 -->
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="article-expand">
              <h4>{{ row.title }}</h4>
              <p>{{ row.content }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="#" width="56" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="110">
          <template #default="{ row }">
            <el-tag :type="categoryType(row.category)" size="small">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="标签" min-width="160">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.tags"
              :key="tag"
              type="info"
              effect="plain"
              size="small"
              class="article-tag"
            >
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="发布日期" width="120" sortable />
        <el-table-column prop="views" label="阅读量" width="100" sortable>
          <template #default="{ row }">
            <el-tag type="warning" effect="light" size="small">{{ row.views }}</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态：el-empty -->
      <el-empty
        v-if="filteredArticles.length === 0"
        description="未找到匹配的文章，换个关键词或分类试试吧～"
      />
    </el-card>
  </div>
</template>

<style scoped>
.article-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.section-title-inline {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}
.article-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.article-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.article-tag {
  margin-right: 4px;
  margin-bottom: 4px;
}
.article-expand {
  padding: 8px 16px 16px 48px;
}
.article-expand h4 {
  font-size: 14px;
  color: var(--text);
  margin-bottom: 8px;
}
.article-expand p {
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.8;
  border-left: 3px solid var(--primary);
  padding-left: 12px;
}
</style>
