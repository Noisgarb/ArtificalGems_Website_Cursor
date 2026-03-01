import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, ErrorCodes } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20")));
    const categoryId = searchParams.get("categoryId");
    const keyword = searchParams.get("keyword");

    const where: Record<string, unknown> = { status: "online" };
    if (categoryId) where.categoryId = parseInt(categoryId);
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
        select: {
          id: true,
          name: true,
          material: true,
          color: true,
          shape: true,
          sizeRange: true,
          priceRange: true,
          imagesJson: true,
          status: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    const itemsWithImages = items.map((p) => {
      const { imagesJson, ...rest } = p;
      const images: string[] = imagesJson ? (JSON.parse(imagesJson) as string[]) : [];
      return { ...rest, images };
    });

    return Response.json(
      ok({
        items: itemsWithImages,
        page,
        pageSize,
        total,
      })
    );
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), { status: 500 });
  }
}
