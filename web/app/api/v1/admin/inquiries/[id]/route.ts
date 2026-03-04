import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, ErrorCodes } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-admin";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateInquirySchema = z.object({
  status: z.enum(["pending", "in_progress", "done", "archived"]).optional(),
  note: z
    .string()
    .transform((v) => v.trim())
    .optional(),
});

async function getInquiryDetail(id: number) {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: {
      product: { select: { id: true, name: true } },
      notes: {
        orderBy: { createdAt: "desc" },
        include: {
          operator: { select: { id: true, username: true } },
        },
      },
    },
  });
  if (!inquiry) return null;

  return inquiry;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;

  const id = parseInt(params.id, 10);
  if (!id || Number.isNaN(id)) {
    return Response.json(err(ErrorCodes.VALIDATION, "ID 不正确"), { status: 400 });
  }

  try {
    const inquiry = await getInquiryDetail(id);
    if (!inquiry) {
      return Response.json(err(ErrorCodes.NOT_FOUND, "记录不存在"), { status: 404 });
    }
    return Response.json(ok(inquiry));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;

  const id = parseInt(params.id, 10);
  if (!id || Number.isNaN(id)) {
    return Response.json(err(ErrorCodes.VALIDATION, "ID 不正确"), { status: 400 });
  }

  try {
    const body = await request.json();
    const parsed = updateInquirySchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(err(ErrorCodes.VALIDATION, "参数校验失败"), { status: 400 });
    }
    const data = parsed.data;

    const updates: Promise<unknown>[] = [];

    if (data.status) {
      updates.push(
        prisma.inquiry.update({
          where: { id },
          data: { status: data.status },
        }),
      );
    }

    if (data.note && data.note.length > 0) {
      updates.push(
        prisma.inquiryNote.create({
          data: {
            inquiryId: id,
            operatorId: admin.userId,
            content: data.note,
          },
        }),
      );
    }

    if (updates.length === 0) {
      return Response.json(err(ErrorCodes.VALIDATION, "没有需要更新的内容"), { status: 400 });
    }

    await Promise.all(updates);

    const inquiry = await getInquiryDetail(id);
    if (!inquiry) {
      return Response.json(err(ErrorCodes.NOT_FOUND, "记录不存在"), { status: 404 });
    }

    return Response.json(ok(inquiry));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}

