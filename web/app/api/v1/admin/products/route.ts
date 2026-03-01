import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, ErrorCodes } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-admin";
import { z } from "zod";

export const dynamic = "force-dynamic";

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

export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20")));
    const categoryId = searchParams.get("categoryId");
    const keyword = searchParams.get("keyword");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = parseInt(categoryId);
    if (status) where.status = status;
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { category: { select: { id: true, name: true } } },
      }),
      prisma.product.count({ where }),
    ]);

    const itemsWithImages = items.map((p) => {
      const images: string[] = p.imagesJson ? (JSON.parse(p.imagesJson) as string[]) : [];
      const tags: string[] = p.tagsJson ? (JSON.parse(p.tagsJson) as string[]) : [];
      const { imagesJson, tagsJson, ...rest } = p;
      return { ...rest, images, tags };
    });

    return Response.json(ok({ items: itemsWithImages, page, pageSize, total }));
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
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors?.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ") ?? "参数校验失败";
      return Response.json(err(ErrorCodes.VALIDATION, msg), { status: 400 });
    }
    const data = parsed.data;
    const product = await prisma.product.create({
      data: {
        name: data.name,
        material: data.material,
        color: data.color,
        shape: data.shape,
        sizeRange: data.sizeRange,
        priceRange: data.priceRange,
        description: data.description,
        categoryId: data.categoryId,
        status: data.status ?? "online",
        imagesJson: data.images ? JSON.stringify(data.images) : "[]",
        tagsJson: data.tags ? JSON.stringify(data.tags) : "[]",
      },
    });
    const images: string[] = product.imagesJson ? (JSON.parse(product.imagesJson) as string[]) : [];
    const tags: string[] = product.tagsJson ? (JSON.parse(product.tagsJson) as string[]) : [];
    const { imagesJson, tagsJson, ...rest } = product;
    return Response.json(ok({ ...rest, images, tags }));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}
