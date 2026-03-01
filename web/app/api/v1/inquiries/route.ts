import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, ErrorCodes } from "@/lib/api-response";
import { z } from "zod";

const createInquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  wechat: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  country: z.string().min(1),
  type: z.enum(["wholesale", "retail", "custom", "other"]),
  budgetRange: z.string().optional(),
  message: z.string().min(1),
  sourceChannel: z.string().optional(),
  sourceUrl: z.string().optional(),
  productId: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createInquirySchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(err(ErrorCodes.VALIDATION, "参数校验失败"), { status: 400 });
    }

    const { name, country, type, message, ...rest } = parsed.data;
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        country,
        type,
        message,
        ...rest,
      },
    });

    return Response.json(ok({ id: inquiry.id }));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}
