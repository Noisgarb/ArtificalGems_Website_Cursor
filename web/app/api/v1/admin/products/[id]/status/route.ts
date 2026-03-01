import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, ErrorCodes } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-admin";
import { z } from "zod";

export const dynamic = "force-dynamic";

const statusSchema = z.object({ status: z.enum(["online", "offline"]) });

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  try {
    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return Response.json(err(ErrorCodes.VALIDATION, "无效的产品 ID"), { status: 400 });
    }
    const body = await request.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(err(ErrorCodes.VALIDATION, "status 需为 online 或 offline"), { status: 400 });
    }
    await prisma.product.update({
      where: { id: productId },
      data: { status: parsed.data.status },
    });
    return Response.json(ok({ success: true }));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}
