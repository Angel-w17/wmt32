// 项目 Store（Setup Store 语法）
// 管理：项目列表（projects）的增删改查
// 持久化：项目数据通过 localStorage 保存，刷新后恢复
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { projects as projectsData } from '../data/profile.js'

// localStorage 存储键
const STORAGE_KEY = 'lab4_projects'

// 从 localStorage 读取已保存的项目列表
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    console.warn('[projectStore] 读取 localStorage 失败：', e)
    return null
  }
}

export const useProjectStore = defineStore('project', () => {
  // —— state ——
  // 项目列表：优先从 localStorage 恢复，否则使用初始数据（深拷贝）
  const saved = loadFromStorage()
  const projects = ref(saved ? structuredClone(saved) : structuredClone(projectsData))

  // —— getters ——
  // 项目总数
  const total = computed(() => projects.value.length)
  // 已完成项目数
  const doneCount = computed(() => projects.value.filter(p => p.status === '已完成').length)
  // 进行中项目数
  const doingCount = computed(() => projects.value.filter(p => p.status === '进行中').length)

  // 根据 id 获取单个项目
  function getProjectById(id) {
    const numId = Number(id)
    return projects.value.find(p => p.id === numId)
  }

  // —— actions ——
  // 将项目列表同步写入 localStorage
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects.value))
    } catch (e) {
      console.warn('[projectStore] 写入 localStorage 失败：', e)
    }
  }

  // 新增项目
  function addProject(project) {
    const newId = projects.value.length
      ? Math.max(...projects.value.map(p => p.id)) + 1
      : 1
    projects.value.push({ ...project, id: newId })
    persist()
    return newId
  }

  // 更新单个项目
  function updateProject(id, draft) {
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      projects.value[idx] = { ...projects.value[idx], ...draft }
      persist()
    }
  }

  // 删除项目
  function deleteProject(id) {
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      projects.value.splice(idx, 1)
      persist()
    }
  }

  return {
    projects,
    total,
    doneCount,
    doingCount,
    getProjectById,
    addProject,
    updateProject,
    deleteProject,
    persist
  }
})
