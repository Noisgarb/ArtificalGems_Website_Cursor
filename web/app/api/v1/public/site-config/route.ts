import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, ErrorCodes } from "@/lib/api-response";

export async function GET() {
  try {
    const configs = await prisma.siteConfig.findMany();
    const map: Record<string, unknown> = {};
    for (const c of configs) {
      try {
        map[c.key] = JSON.parse(c.value);
      } catch {
        map[c.key] = c.value;
      }
    }

    const data = {
      siteTitle: (map.siteTitle as string) ?? "人造宝石询盘型官网",
      siteSubtitle: (map.siteSubtitle as string) ?? "实验室培育宝石 / 人造宝石供应",
      contact: (map.contact as Record<string, string>) ?? {},
      seo: (map.seo as Record<string, string>) ?? {},
    };

    return Response.json(ok(data));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}
