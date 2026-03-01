import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, ErrorCodes } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-admin";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  parentId: z.number().nullable().optional(),
  sortOrder: z.number().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  try {
    const { id } = await params;
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return Response.json(err(ErrorCodes.VALIDATION, "无效的分类 ID"), { status: 400 });
    }
    const body = await request.json();
    const parsed = updateCategorySchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(err(ErrorCodes.VALIDATION, "参数校验失败"), { status: 400 });
    }
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: parsed.data,
    });
    return Response.json(ok(category));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = requireAdmin(_request);
  if (admin instanceof Response) return admin;
  try {
    const { id } = await params;
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return Response.json(err(ErrorCodes.VALIDATION, "无效的分类 ID"), { status: 400 });
    }
    await prisma.category.delete({ where: { id: categoryId } });
    return Response.json(ok({ success: true }));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}
