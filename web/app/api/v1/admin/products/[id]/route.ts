import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, ErrorCodes } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-admin";
import { z } from "zod";

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
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

export async function GET(
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
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: { select: { id: true, name: true } } },
    });
    if (!product) {
      return Response.json(err(ErrorCodes.NOT_FOUND, "产品不存在"), { status: 404 });
    }
    const images: string[] = product.imagesJson ? (JSON.parse(product.imagesJson) as string[]) : [];
    const tags: string[] = product.tagsJson ? (JSON.parse(product.tagsJson) as string[]) : [];
    const { imagesJson, tagsJson, ...rest } = product;
    return Response.json(ok({ ...rest, images, tags }));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}

export async function PUT(
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
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(err(ErrorCodes.VALIDATION, "参数校验失败"), { status: 400 });
    }
    const data = parsed.data;
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.material !== undefined) updateData.material = data.material;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.shape !== undefined) updateData.shape = data.shape;
    if (data.sizeRange !== undefined) updateData.sizeRange = data.sizeRange;
    if (data.priceRange !== undefined) updateData.priceRange = data.priceRange;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.images !== undefined) updateData.imagesJson = JSON.stringify(data.images);
    if (data.tags !== undefined) updateData.tagsJson = JSON.stringify(data.tags);
    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: { category: { select: { id: true, name: true } } },
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = requireAdmin(_request);
  if (admin instanceof Response) return admin;
  try {
    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return Response.json(err(ErrorCodes.VALIDATION, "无效的产品 ID"), { status: 400 });
    }
    await prisma.product.update({
      where: { id: productId },
      data: { status: "offline" },
    });
    return Response.json(ok({ success: true }));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}
