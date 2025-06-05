# YxwdWiki - 英雄无敌战争纪元 Wiki

一个基于 Vue3、TypeScript 和 Vite 构建的现代化移动端 Wiki 文档网站，适配 750px 设计稿，并在 PC 端提供优雅的浏览体验。

## 功能特点

- **移动端优先设计**：基于 750px 设计稿，完美适配各种移动设备
- **响应式布局**：在 PC 端提供固定宽度的内容区，两侧留白，优化阅读体验
- **多级目录结构**：支持类似 Wikipedia 的分类体系
- **Markdown 渲染**：支持丰富的 Markdown 语法和代码高亮
- **搜索功能**：全文搜索或关键词搜索
- **暗黑模式**：支持亮色/暗色主题切换
- **离线支持**：PWA 功能，支持离线缓存重要文档
- **触摸优化**：移动端支持触摸滑动翻页、手势操作

## 技术栈

- **构建工具**：Vite
- **前端框架**：Vue 3 + TypeScript
- **状态管理**：Pinia
- **UI 组件库**：
  - 移动端：Vant
  - PC 端：自适应组件
- **CSS 方案**：
  - Tailwind CSS
  - PostCSS (px 转 rem)
- **Markdown 解析**：markdown-it
- **代码高亮**：Prism.js
- **路由管理**：Vue Router
- **HTTP 请求**：Axios

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── assets/              # 静态资源
├── components/          # 通用组件
│   ├── mobile/          # 移动端专用组件
│   └── desktop/         # PC端专用组件
├── composables/         # 组合式函数
├── layouts/             # 页面布局
├── pages/               # 页面组件
├── router/              # 路由配置
├── stores/              # 状态管理
├── styles/              # 全局样式
├── utils/               # 工具函数
├── views/               # 视图组件
└── App.vue              # 根组件
```

## 移动端适配

项目使用 rem 布局方案，自动将设计稿尺寸转换为适配不同屏幕的单位：

- 基准：1rem = 100px（基于 750px 设计稿）
- 使用 postcss-pxtorem 自动转换 px 为 rem
- 根字体大小根据设备宽度动态调整

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件
