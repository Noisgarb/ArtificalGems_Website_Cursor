import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, ErrorCodes } from "@/lib/api-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
