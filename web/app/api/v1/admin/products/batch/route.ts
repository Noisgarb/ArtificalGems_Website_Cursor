import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, ErrorCodes } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-admin";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(1),
  material: z.string().optional(),
  color: z.string().optional(),
  shape: z.string().optional(),
  sizeRange: z.string().optional(),
  priceRange: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.number().nullable().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(["online", "offline"]).optional(),
});

const batchSchema = z.object({
  products: z.array(createProductSchema),
});

export async function POST(request: NextRequest) {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  try {
    const body = await request.json();
    const parsed = batchSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors?.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ") ?? "参数校验失败";
      return Response.json(err(ErrorCodes.VALIDATION, msg), { status: 400 });
    }
    const created: { id: number; name: string }[] = [];
    const failed: { row: number; message: string }[] = [];
    for (let i = 0; i < parsed.data.products.length; i++) {
      const data = parsed.data.products[i];
      try {
        const product = await prisma.product.create({
          data: {
            name: data.name,
            material: data.material,
            color: data.color,
            shape: data.shape,
            sizeRange: data.sizeRange,
            priceRange: data.priceRange,
            description: data.description,
            categoryId: data.categoryId ?? undefined,
            status: data.status ?? "online",
            imagesJson: data.images?.length ? JSON.stringify(data.images) : "[]",
            tagsJson: data.tags?.length ? JSON.stringify(data.tags) : "[]",
          },
        });
        created.push({ id: product.id, name: product.name });
      } catch (e) {
        failed.push({ row: i + 1, message: e instanceof Error ? e.message : "创建失败" });
      }
    }
    return Response.json(ok({ created: created.length, failed: failed.length, createdIds: created, errors: failed }));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}
