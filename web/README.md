# 人造宝石询盘型官网

基于 Next.js 14 + Prisma 的询盘型品牌官网基础框架。本地开发默认使用 SQLite，生产可切换 PostgreSQL。

## 项目结构（GitHub 仓库）

仓库根目录为 **ArtificalGems_Website_Cursor**，Next.js 应用位于 **web/** 下。克隆后所有命令均在 `web` 目录中执行：

```
ArtificalGems_Website_Cursor/
├── web/                 # 本应用（在此目录执行 npm 等命令）
│   ├── app/
│   ├── prisma/
│   ├── package.json
│   └── ...
└── （其他仓库文件）
```

## 环境要求

- Node.js >= 18
- 本地开发：无需额外安装数据库（使用 SQLite）
- 生产环境：可配置 PostgreSQL（需修改 `prisma/schema.prisma` 的 provider）

## 快速开始

```bash
# 进入应用目录（若从仓库根目录克隆）
cd web

# 安装依赖（国内可设镜像：npm config set registry https://registry.npmmirror.com）
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

或一键执行（PowerShell，在 **web** 目录下）：
```powershell
.\setup.ps1
npm run dev
```

访问 http://localhost:3000

## 应用目录结构（web/ 下）

- `app/` - Next.js App Router 页面与 API
- `app/api/v1/` - RESTful API 路由
- `lib/` - 公共逻辑（Prisma、响应格式等）
- `prisma/` - 数据库模型与迁移

## 部署

- 局域网/本机访问：见 [部署与访问说明.md](./部署与访问说明.md)
- 公网部署（Vercel / VPS）：见 [公网部署.md](./公网部署.md)。Vercel 导入仓库时 **Root Directory** 填 `web`。

## API 文档

详见仓库或项目中的 `api_spec_inquiry_site.docx` / `api_text_utf8.txt`（若已包含）。
