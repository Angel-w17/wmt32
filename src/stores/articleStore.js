// 文章 Store（Setup Store 语法）
// 管理：文章列表（articles）的增删改查
// 持久化：文章数据通过 localStorage 保存，刷新后恢复
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { articles as articlesData } from '../data/articles.js'

// localStorage 存储键
const STORAGE_KEY = 'lab4_articles'

// 从 localStorage 读取已保存的文章列表
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    console.warn('[articleStore] 读取 localStorage 失败：', e)
    return null
  }
}

export const useArticleStore = defineStore('article', () => {
  // —— state ——
  // 文章列表：优先从 localStorage 恢复，否则使用初始数据（深拷贝）
  const saved = loadFromStorage()
  const articles = ref(saved ? structuredClone(saved) : structuredClone(articlesData))

  // —— getters ——
  // 文章总数
  const total = computed(() => articles.value.length)
  // 总阅读量
  const totalViews = computed(() => articles.value.reduce((sum, a) => sum + (a.views || 0), 0))
  // 所有分类（去重）
  const categories = computed(() => {
    const set = new Set(articles.value.map(a => a.category))
    return ['全部', ...set]
  })

  // 根据 id 获取单篇文章
  function getArticleById(id) {
    const numId = Number(id)
    return articles.value.find(a => a.id === numId)
  }

  // —— actions ——
  // 将文章列表同步写入 localStorage
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles.value))
    } catch (e) {
      console.warn('[articleStore] 写入 localStorage 失败：', e)
    }
  }

  // 新增文章
  function addArticle(article) {
    const newId = articles.value.length
      ? Math.max(...articles.value.map(a => a.id)) + 1
      : 1
    articles.value.push({ ...article, id: newId })
    persist()
    return newId
  }

  // 更新文章
  function updateArticle(id, draft) {
    const idx = articles.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      articles.value[idx] = { ...articles.value[idx], ...draft }
      persist()
    }
  }

  // 删除文章
  function deleteArticle(id) {
    const idx = articles.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      articles.value.splice(idx, 1)
      persist()
    }
  }

  // 增加阅读量
  function incrementViews(id) {
    const idx = articles.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      articles.value[idx].views = (articles.value[idx].views || 0) + 1
      persist()
    }
  }

  return {
    articles,
    total,
    totalViews,
    categories,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle,
    incrementViews,
    persist
  }
})
