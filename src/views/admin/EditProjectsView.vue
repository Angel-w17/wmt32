<script setup>
// 编辑项目信息（后台管理子路由，requiresAuth 保护）：
// 实验四任务10：使用 Element Plus 表格 + 对话框 + 表单组件实现项目的增删改查
// - el-table：项目数据表格（el-tag 显示状态、el-progress 显示进度）
// - el-dialog：新增/编辑项目对话框
// - el-form + :rules：表单校验
// - el-input / el-select / el-slider / el-date-picker 等表单控件
// - el-popconfirm：删除气泡确认；ElMessage：结果反馈
// 所有增删改通过 projectStore 的 actions 调用（内部自动持久化到 localStorage）
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useProjectStore } from '../../stores/projectStore.js'

// 获取项目 Store 实例
const projectStore = useProjectStore()
// storeToRefs 解构 projects、total（state/getters），保持响应式
const { projects, total } = storeToRefs(projectStore)

// 状态选项
const statusOptions = ['已完成', '进行中', '规划中']

// 状态标签颜色映射
function statusType(status) {
  const map = { '已完成': 'success', '进行中': 'warning', '规划中': 'info' }
  return map[status] || 'info'
}

// 表单校验规则
const formRules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  intro: [{ required: true, message: '请输入项目简介', trigger: 'blur' }]
}

// —— 新增项目对话框 ——
const addDialogVisible = ref(false)
const addFormRef = ref(null)
const newProject = reactive({
  name: '', status: '规划中', intro: '', tech: '', progress: 0, link: '', demo: ''
})

function handleAdd() {
  addFormRef.value.validate((valid) => {
    if (!valid) return
    const newId = projectStore.addProject({
      name: newProject.name,
      status: newProject.status,
      intro: newProject.intro,
      tech: newProject.tech.split(/[,，、\s]+/).filter(Boolean),
      progress: Number(newProject.progress) || 0,
      link: newProject.link,
      demo: newProject.demo
    })
    ElMessage.success(`项目添加成功！编号 #${newId}`)
    addDialogVisible.value = false
    Object.assign(newProject, { name: '', status: '规划中', intro: '', tech: '', progress: 0, link: '', demo: '' })
  })
}

// —— 编辑项目对话框 ——
const editDialogVisible = ref(false)
const editFormRef = ref(null)
const editingId = ref(null)
const editDraft = reactive({
  name: '', status: '规划中', intro: '', tech: '', progress: 0, link: '', demo: ''
})

function startEdit(project) {
  editingId.value = project.id
  // 兼容旧数据：localStorage 中 tech 可能为字符串（非数组），统一转为逗号分隔文本
  const techText = Array.isArray(project.tech) ? project.tech.join(', ') : String(project.tech ?? '')
  Object.assign(editDraft, { ...project, tech: techText })
  editDialogVisible.value = true
}

function handleEditSave() {
  editFormRef.value.validate((valid) => {
    if (!valid) return
    projectStore.updateProject(editingId.value, {
      name: editDraft.name,
      status: editDraft.status,
      intro: editDraft.intro,
      tech: editDraft.tech.split(/[,，、\s]+/).filter(Boolean),
      progress: Number(editDraft.progress) || 0,
      link: editDraft.link,
      demo: editDraft.demo
    })
    ElMessage.success('项目更新成功！')
    editDialogVisible.value = false
  })
}

// —— 删除 ——
function handleDelete(project) {
  projectStore.deleteProject(project.id)
  ElMessage.info(`项目「${project.name}」已删除`)
}
</script>

<template>
  <div class="admin-projects">
    <!-- 工具栏 -->
    <div class="admin-toolbar">
      <el-button type="primary" @click="addDialogVisible = true">
        <el-icon style="margin-right: 4px"><Plus /></el-icon>
        新增项目
      </el-button>
      <el-tag effect="plain" size="large">共 {{ total }} 个项目</el-tag>
    </div>

    <!-- el-card + el-table：项目列表 -->
    <el-card shadow="never">
      <el-table :data="projects" row-key="id" style="width: 100%">
        <el-table-column prop="id" label="#" width="56" />
        <el-table-column prop="name" label="项目名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="intro" label="简介" min-width="220" show-overflow-tooltip />
        <el-table-column label="技术栈" min-width="160">
          <template #default="{ row }">
            <el-tag
              v-for="tech in row.tech"
              :key="tech"
              type="info"
              effect="plain"
              size="small"
              class="tech-chip"
            >
              {{ tech }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="进度" width="150">
          <template #default="{ row }">
            <!-- el-progress：进度条组件（:percentage 0-100） -->
            <el-progress :percentage="row.progress" :stroke-width="10" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" plain @click="startEdit(row)">
              <el-icon><EditPen /></el-icon>
            </el-button>
            <el-popconfirm
              title="确定删除这个项目吗？"
              confirm-button-text="删除"
              cancel-button-text="取消"
              confirm-button-type="danger"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button type="danger" size="small" plain>
                  <el-icon><Delete /></el-icon>
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增项目对话框 -->
    <el-dialog v-model="addDialogVisible" title="新增项目" width="560px" destroy-on-close>
      <el-form ref="addFormRef" :model="newProject" :rules="formRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="newProject.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="newProject.status" style="width: 100%">
            <el-option v-for="s in statusOptions" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <el-input v-model="newProject.intro" type="textarea" :rows="3" placeholder="请输入项目简介" />
        </el-form-item>
        <el-form-item label="技术栈">
          <el-input v-model="newProject.tech" placeholder="用逗号分隔，如：Vue 3, Pinia" />
        </el-form-item>
        <el-form-item label="进度">
          <!-- el-slider：滑块选择进度（0-100，显示输入框） -->
          <el-slider v-model="newProject.progress" show-input style="width: 100%" />
        </el-form-item>
        <el-form-item label="源码链接">
          <el-input v-model="newProject.link" placeholder="https://github.com/…" />
        </el-form-item>
        <el-form-item label="演示链接">
          <el-input v-model="newProject.demo" placeholder="https://demo.example.com" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">确认新增</el-button>
      </template>
    </el-dialog>

    <!-- 编辑项目对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑项目" width="560px" destroy-on-close>
      <el-form ref="editFormRef" :model="editDraft" :rules="formRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editDraft.name" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editDraft.status" style="width: 100%">
            <el-option v-for="s in statusOptions" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <el-input v-model="editDraft.intro" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="技术栈">
          <el-input v-model="editDraft.tech" />
        </el-form-item>
        <el-form-item label="进度">
          <el-slider v-model="editDraft.progress" show-input style="width: 100%" />
        </el-form-item>
        <el-form-item label="源码链接">
          <el-input v-model="editDraft.link" />
        </el-form-item>
        <el-form-item label="演示链接">
          <el-input v-model="editDraft.demo" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.admin-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.tech-chip {
  margin-right: 4px;
  margin-bottom: 4px;
}
</style>
