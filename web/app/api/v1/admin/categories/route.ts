import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, ErrorCodes } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-admin";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createCategorySchema = z.object({
  name: z.string().min(1),
  parentId: z.number().nullable().optional(),
  sortOrder: z.number().optional(),
});

export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }],
    });
    return Response.json(ok(categories));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  try {
    const body = await request.json();
    const parsed = createCategorySchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(err(ErrorCodes.VALIDATION, "参数校验失败"), { status: 400 });
    }
    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        parentId: parsed.data.parentId ?? null,
        sortOrder: parsed.data.sortOrder ?? 0,
      },
    });
    return Response.json(ok(category));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}
