# 人造宝石询盘型官网

基于 Next.js 14 + Prisma 的询盘型品牌官网基础框架。本地开发默认使用 SQLite，生产可切换 PostgreSQL。

## 环境要求

- Node.js >= 18
- 本地开发：无需额外安装数据库（使用 SQLite）
- 生产环境：可配置 PostgreSQL（需修改 `prisma/schema.prisma` 的 provider）

## 快速开始

```bash
# 安装依赖（已配置国内源可加 npm config set registry https://registry.npmmirror.com）
npm install

# .env 已预置，DATABASE_URL 指向 SQLite 文件

# 生成 Prisma Client
npm run db:generate

# 推送数据库结构（创建 prisma/dev.db）
npm run db:push

# 执行种子数据（创建默认管理员 admin / admin123）
npm run db:seed

# 启动开发服务器
npm run dev
```

或一键执行（PowerShell）：
```powershell
.\setup.ps1
npm run dev
```

访问 http://localhost:3000

## 项目结构

- `app/` - Next.js App Router 页面与 API
- `app/api/v1/` - RESTful API 路由
- `lib/` - 公共逻辑（Prisma、响应格式等）
- `prisma/` - 数据库模型与迁移

## API 文档

详见项目根目录 `api_spec_inquiry_site.docx` 或 `api_text_utf8.txt`。
