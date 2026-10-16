// 用户 Store（Setup Store 语法）
// 管理：个人信息（person）+ 登录状态（isAuthed）
// 持久化：登录状态与个人信息通过 localStorage 保存，刷新后恢复
// 路由守卫：读取 isAuthed 判断是否放行 requiresAuth 页面
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { person as personData } from '../data/profile.js'

// localStorage 存储键
const STORAGE_KEY = 'lab4_user_state'

// 从 localStorage 读取已保存的状态（刷新后恢复）
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    console.warn('[userStore] 读取 localStorage 失败：', e)
    return null
  }
}

export const useUserStore = defineStore('user', () => {
  // —— state ——
  // 个人信息：优先使用 localStorage 中的已保存版本，否则用初始数据（深拷贝避免污染）
  const saved = loadFromStorage()
  const person = ref(saved?.person ? structuredClone(saved.person) : structuredClone(personData))
  // 登录状态：刷新后保持登录
  const isAuthed = ref(saved?.isAuthed ?? false)

  // —— getters ——
  // 登录用户名（用于后台显示当前用户）
  const displayName = computed(() => person.value.name)

  // —— actions ——
  // 将 state 同步写入 localStorage（在每次修改后调用）
  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ person: person.value, isAuthed: isAuthed.value })
      )
    } catch (e) {
      console.warn('[userStore] 写入 localStorage 失败：', e)
    }
  }

  // 登录：设置登录状态并持久化
  function login() {
    isAuthed.value = true
    persist()
  }

  // 退出登录：清除登录状态并持久化
  function logout() {
    isAuthed.value = false
    persist()
  }

  // 更新个人信息（后台管理保存时调用）
  function updatePerson(draft) {
    Object.assign(person.value, draft)
    persist()
  }

  return {
    person,
    isAuthed,
    displayName,
    login,
    logout,
    updatePerson,
    persist
  }
})
