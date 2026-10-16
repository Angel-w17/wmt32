<script setup>
// 基本信息编辑模式：
// - defineModel('person') 双向绑定父组件传入的编辑草稿；
// - 保存/取消动作通过 defineEmits 上报，由父组件决定数据如何更新。
const person = defineModel('person', {
  type: Object,
  required: true
})

const emit = defineEmits(['save', 'cancel'])
</script>

<template>
  <div>
    <div class="form-row">
      <label>姓名</label>
      <input type="text" v-model="person.name">
    </div>
    <div class="form-row">
      <label>学号</label>
      <input type="text" v-model="person.studentId">
    </div>
    <div class="form-row">
      <label>专业</label>
      <input type="text" v-model="person.major">
    </div>
    <div class="form-row">
      <label>班级</label>
      <input type="text" v-model="person.class">
    </div>
    <div class="form-row">
      <label>邮箱</label>
      <input type="text" v-model="person.email">
    </div>
    <div class="form-row">
      <label>电话</label>
      <input type="text" v-model="person.phone">
    </div>
    <div class="form-row">
      <label>地址</label>
      <input type="text" v-model="person.address">
    </div>
    <div class="form-row">
      <label>头像URL</label>
      <input type="text" v-model="person.avatar">
    </div>
    <div class="form-row">
      <label>个人简介</label>
      <textarea v-model="person.intro"></textarea>
    </div>

    <div class="actions">
      <button class="btn" @click="emit('save')">保存</button>
      <button class="btn ghost" @click="emit('cancel')">取消</button>
    </div>
  </div>
</template>

<style scoped>
.form-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-soft);
  font-size: 14px;
}
.form-row label {
  width: 90px;
  color: var(--text-label);
  flex-shrink: 0;
}
.form-row input,
.form-row textarea {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  background: var(--card-bg);
  color: var(--text);
  transition: border-color 0.2s;
}
.form-row input:focus,
.form-row textarea:focus {
  border-color: var(--primary);
}
.form-row textarea {
  resize: vertical;
  min-height: 60px;
}
.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>
