# 全球大学智能匹配系统 - 前端

## 项目简介

这是一个基于Next.js的留学择校辅助系统前端应用，提供直观的用户界面和流畅的用户体验。

## 功能特性

- 🎯 **智能学校推荐**：根据学生背景和家庭需求推荐合适的大学
- 🤖 **GPT个性化分析**：使用AI生成个性化的选校建议
- 👥 **匿名用户系统**：无需注册即可使用，数据持久化保存
- 📊 **家长评估**：基于学生信息的个性化择校建议
- 🧠 **学生测评**：人格类型测评和学校匹配
- 📱 **响应式设计**：支持桌面和移动设备

## 技术栈

- **框架**：Next.js 15.4.5
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **图标**：Lucide React
- **HTTP客户端**：Axios
- **状态管理**：React Hooks
- **构建工具**：Turbopack

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 环境配置

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

应用将在 `http://localhost:3000` 启动

## 项目结构

```
frontend/
├── public/                 # 静态资源
│   ├── favicon.ico
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── globals.css    # 全局样式
│   │   ├── layout.tsx     # 根布局
│   │   ├── page.tsx       # 首页
│   │   ├── knowledge/     # 知识页面
│   │   ├── parent-eval/   # 家长评估
│   │   │   ├── start/     # 评估开始页
│   │   │   └── result/    # 评估结果页
│   │   ├── student-test/  # 学生测评
│   │   │   ├── start/     # 测评开始页
│   │   │   └── result/    # 测评结果页
│   │   └── universities/  # 大学库页面
│   └── lib/               # 工具库
│       ├── api.ts         # API客户端
│       └── useAnonymousUser.ts # 匿名用户管理
├── package.json           # 项目配置
├── next.config.ts         # Next.js配置
├── tailwind.config.js     # Tailwind配置
├── tsconfig.json          # TypeScript配置
└── README.md              # 项目说明
```

## 页面说明

### 首页 (`/`)
- 系统功能介绍
- 快速导航到各个功能模块
- 响应式设计，适配各种设备

### 家长评估 (`/parent-eval/start`)
- 三步式问卷设计
- 学生基本信息收集
- 兴趣偏好调查
- 家庭取向分析

### 家长评估结果 (`/parent-eval/result`)
- 学生画像展示
- 推荐学校列表
- 申请策略建议
- GPT个性化分析

### 学生测评 (`/student-test/start`)
- 8个问题的人格测评
- 实时进度显示
- 流畅的交互体验

### 学生测评结果 (`/student-test/result`)
- 人格类型分析
- 推荐学校匹配
- 分享和下载功能

### 大学库 (`/universities`)
- 学校列表展示
- 多维度筛选
- 详细信息查看

### 知识页面 (`/knowledge`)
- 留学知识内容
- 选校策略指南

## 核心功能

### 匿名用户系统

使用localStorage实现无需注册的用户体验：

```typescript
// 生成匿名用户ID
const userId = getAnonymousUserId();

// 检查是否有用户ID
const hasId = hasAnonymousUserId();

// 清除用户ID
clearAnonymousUserId();
```

### API集成

封装了完整的API调用：

```typescript
// 创建家长评估
const result = await evaluationAPI.createParentEvaluation(data);

// 获取评估结果
const evaluation = await evaluationAPI.getParentEvaluation(id);

// 获取大学列表
const universities = await universityAPI.getUniversities(params);
```

### 响应式设计

使用Tailwind CSS实现响应式布局：

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 响应式网格布局 */}
</div>
```

## 开发指南

### 添加新页面

1. 在 `src/app/` 目录下创建新的文件夹
2. 添加 `page.tsx` 文件
3. 更新导航链接

### 添加新组件

1. 在 `src/components/` 目录下创建组件文件
2. 使用TypeScript定义props接口
3. 添加必要的样式和交互

### API调用

使用 `src/lib/api.ts` 中定义的API客户端：

```typescript
import { evaluationAPI } from '@/lib/api';

const handleSubmit = async (data) => {
  try {
    const result = await evaluationAPI.createParentEvaluation(data);
    // 处理结果
  } catch (error) {
    // 错误处理
  }
};
```

### 样式开发

使用Tailwind CSS类名：

```tsx
<div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
  <h2 className="text-xl font-bold text-gray-900 mb-4">
    标题
  </h2>
  <p className="text-gray-600">
    内容
  </p>
</div>
```

## 构建和部署

### 开发环境

```bash
npm run dev
```

### 生产构建

```bash
npm run build
npm start
```

### 部署到Vercel

1. 连接GitHub仓库
2. 配置环境变量
3. 自动部署

### 环境变量

```env
# API地址
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# 生产环境
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## 性能优化

### 图片优化

使用Next.js的Image组件：

```tsx
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority
/>
```

### 代码分割

Next.js自动进行代码分割，提高加载性能。

### 缓存策略

使用SWR或React Query进行数据缓存：

```typescript
import useSWR from 'swr';

const { data, error } = useSWR('/api/universities', fetcher);
```

## 测试

### 运行测试

```bash
npm run test
```

### 类型检查

```bash
npm run type-check
```

### 代码检查

```bash
npm run lint
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。

## 更新日志

### v1.0.0
- 初始版本发布
- 实现匿名用户系统
- 完成家长评估和学生测评功能
- 集成GPT个性化分析
- 响应式设计优化
