<script setup>
// 编辑个人信息（后台管理子路由，requiresAuth 保护）：
// 实验四任务10：使用 Element Plus 表单组件重构个人信息编辑
// - el-form / el-form-item：编辑表单（:model + :rules 校验）
// - el-input：文本输入（含 textarea 多行简介）
// - el-button：保存/取消
// - ElMessage：保存结果反馈
// 保存时调用 userStore.updatePerson 更新全局状态（自动持久化到 localStorage），replace 返回
// 实验四改造：使用 Pinia userStore + storeToRefs 解构 person
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../stores/userStore.js'

const router = useRouter()
const userStore = useUserStore()
// storeToRefs 解构 person（state），保持响应式
const { person } = storeToRefs(userStore)

// 编辑草稿：深拷贝当前 person 到 reactive 对象，编辑过程不影响正式数据
const draft = reactive(JSON.parse(JSON.stringify(person.value)))

// 表单校验规则
const formRules = {
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  studentId: [{ required: true, message: '学号不能为空', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
}

const formRef = ref(null)

function handleSave() {
  // el-form validate：校验通过后再保存
  formRef.value.validate((valid) => {
    if (!valid) return
    // 保存：调用 userStore 的 updatePerson action（内部会持久化到 localStorage）
    userStore.updatePerson({ ...draft })
    ElMessage.success('个人信息保存成功！')
    // replace：替换历史记录，避免返回键回到编辑页
    router.replace({ name: 'home' })
  })
}
function handleCancel() {
  // 取消：丢弃草稿，返回上一页
  router.go(-1)
}
</script>

<template>
  <div>
    <h2 class="section-title">编辑个人信息</h2>

    <!-- el-form：个人信息编辑表单 -->
    <el-form ref="formRef" :model="draft" :rules="formRules" label-width="90px" class="profile-form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="draft.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学号" prop="studentId">
            <el-input v-model="draft.studentId" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="专业">
            <el-input v-model="draft.major" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="班级">
            <el-input v-model="draft.class" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="draft.email" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话">
            <el-input v-model="draft.phone" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="地址">
        <el-input v-model="draft.address" />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input v-model="draft.intro" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item label="头像地址">
        <el-input v-model="draft.avatar" placeholder="头像图片 URL" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSave">
          <el-icon style="margin-right: 4px"><Check /></el-icon>
          保存
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.profile-form {
  max-width: 720px;
}
</style>
