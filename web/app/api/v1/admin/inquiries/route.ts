import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, ErrorCodes } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20")));
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const keyword = searchParams.get("keyword");

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }
    if (type) {
      where.type = type;
    }
    if (keyword) {
      const k = keyword.trim();
      if (k) {
        where.OR = [
          { name: { contains: k } },
          { email: { contains: k } },
          { wechat: { contains: k } },
          { whatsapp: { contains: k } },
          { country: { contains: k } },
          { message: { contains: k } },
        ];
      }
    }

    const [items, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          product: { select: { id: true, name: true } },
          _count: { select: { notes: true } },
        },
      }),
      prisma.inquiry.count({ where }),
    ]);

    const mapped = items.map((i) => ({
      id: i.id,
      name: i.name,
      email: i.email,
      wechat: i.wechat,
      whatsapp: i.whatsapp,
      country: i.country,
      type: i.type,
      budgetRange: i.budgetRange,
      message: i.message,
      sourceChannel: i.sourceChannel,
      sourceUrl: i.sourceUrl,
      status: i.status,
      createdAt: i.createdAt,
      product: i.product,
      notesCount: (i as unknown as { _count?: { notes?: number } })._count?.notes ?? 0,
    }));

    return Response.json(ok({ items: mapped, page, pageSize, total }));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}

