<script setup>
// 个人主页（公开访问页面）：
// 实验四任务9/10：使用 Element Plus 组件重构页面结构，并【新增时间线】展示个人成长经历
// 使用的 Element Plus 组件：
// - el-card：页面容器卡片（header 具名插槽放头部信息）
// - el-avatar：圆形头像
// - el-descriptions / el-descriptions-item：基本信息描述列表（带边框、双列）
// - el-tag：技能与获奖标签（type 控制颜色语义）
// - el-timeline / el-timeline-item：个人成长时间线（新增内容，按时间倒序展示重要节点）
// - el-link：社交链接（underline="never" 去下划线，href 外跳）
// - el-button / el-icon：编辑按钮（跳转后台管理）
// 实验四改造：从 Pinia userStore + storeToRefs 读取 person，保持响应式
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/userStore.js'
import { skills, socialLinks } from '../data/profile.js'

const router = useRouter()
const userStore = useUserStore()
// storeToRefs 解构 person（state），保持响应式
const { person } = storeToRefs(userStore)

// 个人成长时间线（任务9新增：个人信息页面的时间线）
// type 属性控制节点颜色：primary 主色 / success 成功 / warning 警告 / info 灰色
const timeline = [
  {
    time: '2026-10',
    title: '实验四：状态管理与 UI 组件库应用',
    content: '引入 Pinia 完成全局状态管理与持久化，使用 Element Plus 组件库重构页面并新增时间线。',
    type: 'primary'
  },
  {
    time: '2026-09',
    title: '实验三：Vue Router 路由管理',
    content: '掌握命名路由、动态路由、嵌套路由与全局前置守卫，完成个人主页多页面 SPA 改造。',
    type: 'primary'
  },
  {
    time: '2026-06',
    title: '实验二：Vue 组件化开发',
    content: '深入组件通信（props / emits / 插槽），完成项目展示模块的组件拆分与复用。',
    type: ''
  },
  {
    time: '2025-12',
    title: '获校级优秀学生奖学金',
    content: '学年综合测评成绩位列专业前列，获得 2025 年度优秀学生奖学金。',
    type: 'warning'
  },
  {
    time: '2025-05',
    title: '省级 Web 开发大赛 二等奖',
    content: '以"校园二手交易平台"项目参赛，负责前端架构与核心交互开发，获省级二等奖。',
    type: 'success'
  },
  {
    time: '2024-09',
    title: '入学重庆工程学院',
    content: '进入计算机科学与技术专业学习，开始系统学习前端开发技术栈。',
    type: 'info'
  }
]

// 点击"编辑信息"→ 编程式导航到后台管理（router.push 的应用）
// 如果未登录，beforeEach 守卫会自动重定向到登录页
function goEdit() {
  router.push({ name: 'admin-profile' })
}
</script>

<template>
  <div class="page">
    <!-- el-card：个人主页容器卡片 -->
    <el-card class="profile-card" shadow="hover">
      <!-- 头部：头像 + 姓名 + 简介 + 编辑按钮 -->
      <template #header>
        <div class="profile-head">
          <!-- el-avatar：圆形头像，size 控制尺寸 -->
          <el-avatar :size="88" :src="person.avatar" />
          <div class="profile-head-info">
            <h1 class="profile-name">{{ person.name }}</h1>
            <p class="profile-intro">{{ person.intro }}</p>
            <div class="profile-links">
              <el-link
                v-for="link in socialLinks"
                :key="link.name"
                :href="link.url"
                target="_blank"
                type="primary"
                :underline="false"
                class="profile-link"
              >
                {{ link.name }}
              </el-link>
            </div>
          </div>
          <el-button type="primary" plain @click="goEdit">
            <el-icon style="margin-right: 4px"><EditPen /></el-icon>
            编辑信息
          </el-button>
        </div>
      </template>

      <!-- 基本信息：el-descriptions 描述列表 -->
      <h2 class="section-title">基本信息</h2>
      <el-descriptions :column="2" border class="profile-desc">
        <el-descriptions-item label="姓名">{{ person.name }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ person.studentId }}</el-descriptions-item>
        <el-descriptions-item label="专业">{{ person.major }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ person.class }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ person.email }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ person.phone }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ person.address }}</el-descriptions-item>
      </el-descriptions>

      <!-- 技能：el-tag 标签组 -->
      <h2 class="section-title">技能特长</h2>
      <div class="skill-tags">
        <el-tag v-for="skill in skills" :key="skill" effect="plain" class="skill-tag">
          {{ skill }}
        </el-tag>
      </div>

      <!-- 获奖情况：el-tag success -->
      <h2 class="section-title">获奖情况</h2>
      <div class="award-tags">
        <el-tag
          v-for="award in person.awards"
          :key="award"
          type="success"
          effect="light"
          class="award-tag"
        >
          🏆 {{ award }}
        </el-tag>
      </div>

      <!-- 个人成长时间线（任务9新增）：el-timeline -->
      <h2 class="section-title">成长时间线</h2>
      <el-timeline class="profile-timeline">
        <el-timeline-item
          v-for="item in timeline"
          :key="item.time"
          :timestamp="item.time"
          :type="item.type || 'primary'"
          placement="top"
        >
          <h4 class="timeline-title">{{ item.title }}</h4>
          <p class="timeline-content">{{ item.content }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<style scoped>
.profile-card {
  max-width: 860px;
  margin: 0 auto;
}
.profile-head {
  display: flex;
  align-items: center;
  gap: 18px;
}
.profile-head-info {
  flex: 1;
}
.profile-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
}
.profile-intro {
  font-size: 13px;
  color: var(--text-sub);
  margin-top: 4px;
}
.profile-links {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}
.profile-link {
  font-size: 13px;
}
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  margin: 22px 0 12px;
}
.section-title:first-of-type {
  margin-top: 4px;
}
.profile-desc {
  width: 100%;
}
.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.skill-tag {
  font-size: 13px;
}
.award-tags {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.award-tag {
  font-size: 13px;
  height: auto;
  padding: 5px 12px;
}
.profile-timeline {
  padding-left: 4px;
}
.timeline-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}
.timeline-content {
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.7;
  margin-top: 4px;
}
@media (max-width: 600px) {
  .profile-head {
    flex-direction: column;
    text-align: center;
  }
  .profile-links,
  .award-tags {
    justify-content: center;
  }
}
</style>
