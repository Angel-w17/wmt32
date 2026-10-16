// 全局共享状态 store
// 跨路由组件共享的数据（个人信息、登录状态）集中管理，
// 避免通过 props 在多层组件间传递（路由组件无法像普通子组件那样直接接收父组件 props）
import { reactive, ref } from 'vue'
import { person as personData, projects as projectsData } from '../data/profile.js'

// 个人信息：深拷贝原始数据，避免修改影响 data 模块中的原始数据
export const store = reactive({
  person: JSON.parse(JSON.stringify(personData)),
  projects: JSON.parse(JSON.stringify(projectsData)),
  isAuthed: false
})

// 更新个人信息（后台管理保存时调用）
export function updatePerson(draft) {
  Object.assign(store.person, draft)
}

// 更新单个项目（后台管理编辑项目时调用）
export function updateProject(id, draft) {
  const idx = store.projects.findIndex(p => p.id === id)
  if (idx !== -1) {
    store.projects[idx] = { ...store.projects[idx], ...draft }
  }
}

// 新增项目
export function addProject(project) {
  const newId = store.projects.length
    ? Math.max(...store.projects.map(p => p.id)) + 1
    : 1
  store.projects.push({ ...project, id: newId })
  return newId
}

// 删除项目
export function deleteProject(id) {
  const idx = store.projects.findIndex(p => p.id === id)
  if (idx !== -1) {
    store.projects.splice(idx, 1)
  }
}

// 根据 id 获取单个项目
export function getProjectById(id) {
  const numId = Number(id)
  return store.projects.find(p => p.id === numId)
}
