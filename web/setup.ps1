# 人造宝石询盘型官网 - 首次启动脚本
$ErrorActionPreference = "Stop"
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Set-Location $PSScriptRoot

Write-Host "1. 生成 Prisma Client..."
npx prisma generate

Write-Host "2. 初始化数据库..."
npx prisma db push

Write-Host "3. 执行种子数据（创建管理员 admin / admin123）..."
npx tsx prisma/seed.ts

Write-Host "完成。启动开发服务器： npm run dev"
