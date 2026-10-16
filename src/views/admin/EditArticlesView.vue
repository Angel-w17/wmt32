<script setup>
// 文章管理页（后台管理子路由，requiresAuth 保护）：
// 实验四任务10：使用 Element Plus 表格 + 对话框 + 表单组件实现文章的增删改查
// - el-table / el-table-column：文章数据表格
// - el-dialog：新增文章对话框、编辑文章对话框（v-model 控制显示，destroy-on-close 关闭销毁）
// - el-form / el-form-item：文章编辑表单（:model 绑定 + :rules 校验规则）
// - el-input / el-input type=textarea：文本输入（含多行正文）
// - el-select / el-option：分类下拉选择
// - el-date-picker：发布日期选择（value-format 绑定字符串日期）
// - el-button：操作按钮（type/size/图标）
// - el-popconfirm：删除前气泡确认（替代原生 confirm）
// - ElMessage：操作结果反馈（成功/警告）
// 所有修改通过 articleStore 的 actions 调用，并自动持久化到 localStorage
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useArticleStore } from '../../stores/articleStore.js'

// 获取文章 Store 实例
const articleStore = useArticleStore()
// storeToRefs 解构 state 和 getters（响应式），actions 直接从实例取
const { articles, total } = storeToRefs(articleStore)

// 分类选项
const categoryOptions = ['前端基础', '状态管理', '路由', '工程化', '其他']

// 表单校验规则（el-form :rules）
const formRules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  summary: [{ required: true, message: '请输入文章摘要', trigger: 'blur' }]
}

// —— 新增文章对话框 ——
const addDialogVisible = ref(false)
const addFormRef = ref(null)
const newArticle = reactive({
  title: '',
  category: '前端基础',
  summary: '',
  content: '',
  tags: '',
  date: new Date().toISOString().slice(0, 10)
})

function openAdd() {
  addDialogVisible.value = true
}

function handleAdd() {
  // el-form validate：触发表单校验，通过后执行回调
  addFormRef.value.validate((valid) => {
    if (!valid) return
    const article = {
      title: newArticle.title,
      category: newArticle.category,
      summary: newArticle.summary,
      content: newArticle.content,
      tags: newArticle.tags.split(/[,，、\s]+/).filter(Boolean),
      date: newArticle.date,
      views: 0
    }
    const newId = articleStore.addArticle(article)
    ElMessage.success(`文章添加成功！编号 #${newId}`)
    addDialogVisible.value = false
    // 重置表单
    Object.assign(newArticle, {
      title: '', category: '前端基础', summary: '', content: '', tags: '',
      date: new Date().toISOString().slice(0, 10)
    })
  })
}

// —— 编辑文章对话框 ——
const editDialogVisible = ref(false)
const editFormRef = ref(null)
const editingId = ref(null)
const editDraft = reactive({
  title: '', category: '前端基础', summary: '', content: '', tags: '', date: ''
})

function startEdit(article) {
  editingId.value = article.id
  Object.assign(editDraft, { ...article, tags: article.tags.join(', ') })
  editDialogVisible.value = true
}

function handleEditSave() {
  editFormRef.value.validate((valid) => {
    if (!valid) return
    articleStore.updateArticle(editingId.value, {
      title: editDraft.title,
      category: editDraft.category,
      summary: editDraft.summary,
      content: editDraft.content,
      tags: editDraft.tags.split(/[,，、\s]+/).filter(Boolean),
      date: editDraft.date
    })
    ElMessage.success('文章更新成功！')
    editDialogVisible.value = false
  })
}

// —— 删除（el-popconfirm 气泡确认后调用） ——
function handleDelete(article) {
  articleStore.deleteArticle(article.id)
  ElMessage.info(`文章「${article.title}」已删除`)
}
</script>

<template>
  <div class="admin-articles">
    <!-- 工具栏 -->
    <div class="admin-toolbar">
      <el-button type="primary" @click="openAdd">
        <el-icon style="margin-right: 4px"><Plus /></el-icon>
        新增文章
      </el-button>
      <el-tag effect="plain" size="large">共 {{ total }} 篇文章</el-tag>
    </div>

    <!-- el-table：文章管理表格 -->
    <el-card shadow="never">
      <el-table :data="articles" row-key="id" style="width: 100%">
        <el-table-column prop="id" label="#" width="56" />
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="110">
          <template #default="{ row }">
            <el-tag size="small">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="summary" label="摘要" min-width="200" show-overflow-tooltip />
        <el-table-column prop="date" label="日期" width="115" sortable />
        <el-table-column prop="views" label="阅读" width="80" sortable />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" plain @click="startEdit(row)">
              <el-icon><EditPen /></el-icon>
            </el-button>
            <!-- el-popconfirm：气泡确认框，confirm 事件触发删除 -->
            <el-popconfirm
              title="确定删除这篇文章吗？"
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

    <!-- 新增文章对话框：el-dialog + el-form -->
    <el-dialog v-model="addDialogVisible" title="新增文章" width="560px" destroy-on-close>
      <el-form ref="addFormRef" :model="newArticle" :rules="formRules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="newArticle.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="newArticle.category" style="width: 100%">
            <el-option v-for="c in categoryOptions" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="newArticle.summary" type="textarea" :rows="2" placeholder="请输入文章摘要" />
        </el-form-item>
        <el-form-item label="正文">
          <el-input v-model="newArticle.content" type="textarea" :rows="5" placeholder="请输入文章正文" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="newArticle.tags" placeholder="用逗号分隔，如：Vue 3, Pinia" />
        </el-form-item>
        <el-form-item label="发布日期">
          <!-- el-date-picker：日期选择，value-format 使 v-model 得到字符串 -->
          <el-date-picker
            v-model="newArticle.date"
            type="date"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">确认新增</el-button>
      </template>
    </el-dialog>

    <!-- 编辑文章对话框：el-dialog + el-form -->
    <el-dialog v-model="editDialogVisible" title="编辑文章" width="560px" destroy-on-close>
      <el-form ref="editFormRef" :model="editDraft" :rules="formRules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="editDraft.title" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="editDraft.category" style="width: 100%">
            <el-option v-for="c in categoryOptions" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="editDraft.summary" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="正文">
          <el-input v-model="editDraft.content" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="editDraft.tags" />
        </el-form-item>
        <el-form-item label="发布日期">
          <el-date-picker v-model="editDraft.date" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
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
</style>
