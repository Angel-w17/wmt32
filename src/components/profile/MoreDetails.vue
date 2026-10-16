<script setup>
// 更多详情：props 接收 person / links；
// showDetail 只控制本区块显隐，不影响其他组件，因此保留为组件内部状态。
import { ref } from 'vue'

defineProps({
  person: {
    type: Object,
    required: true
  },
  links: {
    type: Array,
    default: () => []
  }
})

const showDetail = ref(false)
</script>

<template>
  <section>
    <h2 class="section-title">更多详情</h2>

    <button class="btn" @click="showDetail = !showDetail">
      {{ showDetail ? '收起详情' : '展开详情' }}
    </button>

    <!-- v-show 控制显隐（切换 CSS display，DOM 仍保留） -->
    <div v-show="showDetail" class="detail-content">
      <span class="label">获奖经历：</span>
      <ul>
        <li v-for="(award, index) in person.awards" :key="index">
          {{ award }}
        </li>
      </ul>

      <span class="label">联系方式：</span>
      <p>电话：{{ person.phone }}</p>
      <p>地址：{{ person.address }}</p>

      <span class="label">社交链接：</span>
      <div class="links">
        <a
          v-for="link in links"
          :key="link.name"
          class="link-item"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
        >{{ link.name }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.detail-content {
  margin-top: 14px;
  padding: 16px 18px;
  background: var(--detail-bg);
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.9;
  color: var(--text-sub);
  transition: background 0.25s;
}
.detail-content .label {
  font-weight: 600;
  color: var(--text);
  margin-top: 8px;
  display: block;
}
.detail-content .label:first-child {
  margin-top: 0;
}
.detail-content ul {
  margin-left: 18px;
}
.links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}
</style>
