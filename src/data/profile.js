// 集中管理页面展示数据（数据与视图分离，便于维护）

// 个人基本信息（实验一数据迁移，已替换为本人真实信息）
export const person = {
  name: '魏明涛',
  studentId: '249980332',
  major: '计算机科学与技术',
  class: '24计科1班',
  email: 'weimingtao@example.com',
  phone: '138-0000-0000',
  address: '重庆市巴南区红光大道69号重庆工程学院',
  intro: '热爱前端开发，专注于Vue生态与Web技术实践，持续学习中。',
  avatar:
    'https://ui-avatars.com/api/?name=Wei+Mingtao&size=128&background=4a90d9&color=fff&font-size=40',
  awards: [
    '2024年 校级编程竞赛 一等奖',
    '2024年 优秀学生奖学金',
    '2023年 省级Web开发大赛 二等奖'
  ]
}

// 技能列表
export const skills = [
  'HTML5', 'CSS3', 'JavaScript', 'Vue 3', 'TypeScript',
  'Node.js', 'Git', 'Python', 'MySQL', 'Docker'
]

// 社交链接
export const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/yourname' },
  { name: '个人博客', url: 'https://example.com' },
  { name: '邮箱联系', url: 'mailto:weimingtao@example.com' }
]

// 项目展示数据（第二次实验：项目展示页面）
export const projects = [
  {
    id: 1,
    name: '校园二手交易平台',
    status: '已完成',
    intro:
      '面向在校学生的二手物品交易 Web 应用，支持商品发布、关键词搜索、在线留言与收藏，后台提供订单与举报管理。',
    tech: ['Vue 3', 'Vite', 'Node.js', 'MySQL'],
    progress: 100,
    link: 'https://github.com/yourname/campus-market',
    demo: 'https://example.com/campus-market'
  },
  {
    id: 2,
    name: '个人记账本小程序',
    status: '进行中',
    intro:
      '轻量化收支记录应用，提供分类统计、月度图表与预算提醒，数据本地持久化，支持多账本切换。',
    tech: ['Vue 3', 'Pinia', 'ECharts'],
    progress: 65,
    link: 'https://github.com/yourname/my-ledger',
    demo: ''
  },
  {
    id: 3,
    name: '可视化算法演示器',
    status: '已完成',
    intro:
      '将排序、查找等经典算法的执行过程逐帧动画化，支持单步调试、速度调节与自定义输入，用于课堂学习辅助。',
    tech: ['JavaScript', 'Canvas', 'CSS3'],
    progress: 100,
    link: 'https://github.com/yourname/algo-visualizer',
    demo: 'https://example.com/algo-visualizer'
  },
  {
    id: 4,
    name: '团队任务协作看板',
    status: '进行中',
    intro:
      '仿 Trello 的拖拽看板工具，支持任务分配、截止日期、评论通知与操作历史，正在开发实时协同编辑能力。',
    tech: ['Vue 3', 'TypeScript', 'WebSocket', 'Docker'],
    progress: 40,
    link: 'https://github.com/yourname/team-kanban',
    demo: ''
  },
  {
    id: 5,
    name: 'AI 学习助手',
    status: '规划中',
    intro:
      '计划基于大模型 API 开发课程答疑助手，支持错题整理、知识点关联与学习计划生成，预计下学期启动。',
    tech: ['Vue 3', 'Python', 'LLM API'],
    progress: 10,
    link: '',
    demo: ''
  }
]
