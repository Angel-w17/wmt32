<script setup>
// 关于本站页面：展示个人信息、技术栈、联系方式
// 实验四改造：使用 Pinia userStore + storeToRefs 解构 person
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/userStore.js'
import { skills, socialLinks } from '../data/profile.js'

const userStore = useUserStore()
// storeToRefs 解构 person（state），保持响应式
const { person } = storeToRefs(userStore)
</script>

<template>
  <div class="page">
    <div class="card about-card">
      <div class="about-header">
        <img class="about-avatar" :src="person.avatar" :alt="person.name">
        <h1>{{ person.name }}</h1>
        <p class="about-sub">{{ person.major }} · {{ person.class }}</p>
        <p class="about-id">学号：{{ person.studentId }}</p>
      </div>

      <div class="about-body">
        <h2 class="section-title">关于本站</h2>
        <p class="about-text">
          本站是基于 Vue 3 + Vue Router + Pinia 构建的个人主页 SPA 应用，涵盖个人主页、
          项目展示、文章列表、后台管理等页面。采用组合式 API 开发，使用 Vite 作为构建工具。
          本实验主要实践了 Pinia 状态管理的 Store 设计、storeToRefs 响应式解构、
          localStorage 状态持久化、以及结合路由守卫实现登录状态访问控制等核心功能。
        </p>

        <h2 class="section-title">技术栈</h2>
        <div class="skill-list">
          <span v-for="skill in skills" :key="skill" class="skill-tag">{{ skill }}</span>
        </div>

        <h2 class="section-title">获奖经历</h2>
        <ul class="award-list">
          <li v-for="(award, i) in person.awards" :key="i">{{ award }}</li>
        </ul>

        <h2 class="section-title">联系方式</h2>
        <div class="contact-info">
          <p>邮箱：{{ person.email }}</p>
          <p>电话：{{ person.phone }}</p>
          <p>地址：{{ person.address }}</p>
        </div>

        <h2 class="section-title">社交链接</h2>
        <div class="links">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            class="link-item"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
          >{{ link.name }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-card { padding: 32px 28px; }
.about-header {
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.about-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}
.about-header h1 {
  font-size: 20px;
  font-weight: 600;
  margin-top: 12px;
  color: var(--text);
}
.about-sub, .about-id {
  font-size: 13px;
  color: var(--text-sub);
  margin-top: 4px;
}
.about-body { padding-top: 24px; }
.about-text {
  font-size: 14px;
  color: var(--text-sub);
  line-height: 1.9;
}
.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.skill-tag {
  padding: 4px 14px;
  background: var(--tag-bg);
  color: var(--primary);
  border-radius: 16px;
  font-size: 13px;
}
.award-list {
  margin-left: 18px;
  font-size: 14px;
  color: var(--text-sub);
  line-height: 2;
}
.contact-info p {
  font-size: 14px;
  color: var(--text-sub);
  line-height: 1.9;
}
.links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
