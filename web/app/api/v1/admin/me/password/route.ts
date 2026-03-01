import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, ErrorCodes } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-admin";
import { verifyPassword, hashPassword } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  currentPassword: z.string().min(1, "请输入当前密码"),
  newPassword: z.string().min(6, "新密码至少 6 位"),
});

export async function PATCH(request: NextRequest) {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join("; ");
      return Response.json(err(ErrorCodes.VALIDATION, msg), { status: 400 });
    }
    const { currentPassword, newPassword } = parsed.data;
    const user = await prisma.adminUser.findUnique({
      where: { id: admin.userId },
    });
    if (!user) {
      return Response.json(err(ErrorCodes.NOT_FOUND, "用户不存在"), { status: 404 });
    }
    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return Response.json(err(ErrorCodes.VALIDATION, "当前密码错误"), { status: 400 });
    }
    const passwordHash = await hashPassword(newPassword);
    await prisma.adminUser.update({
      where: { id: admin.userId },
      data: { passwordHash },
    });
    return Response.json(ok({ success: true }));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}
