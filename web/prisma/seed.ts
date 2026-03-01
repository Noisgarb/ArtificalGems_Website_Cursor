import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash: hash,
      role: "admin",
      status: "active",
    },
  });

  await prisma.siteConfig.upsert({
    where: { key: "siteTitle" },
    update: {},
    create: {
      key: "siteTitle",
      value: JSON.stringify("人造宝石询盘型官网"),
      description: "站点标题",
    },
  });

  await prisma.siteConfig.upsert({
    where: { key: "contact" },
    update: {},
    create: {
      key: "contact",
      value: JSON.stringify({
        phone: "",
        email: "info@example.com",
        wechat: "",
        whatsapp: "",
      }),
      description: "联系方式",
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
