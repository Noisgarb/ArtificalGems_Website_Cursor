import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductGrid, type ProductItem } from "@/components/products/ProductGrid";

export const dynamic = "force-dynamic";

async function getCategory(id: number) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      children: { select: { id: true } },
      _count: { select: { products: true } },
    },
  });
}

async function getProductsByCategory(categoryId: number): Promise<ProductItem[]> {
  const category = await getCategory(categoryId);
  if (!category) return [];

  const childIds = category.children.map((c) => c.id);
  const categoryIds = [categoryId, ...childIds];

  const items = await prisma.product.findMany({
    where: {
      status: "online",
      categoryId: { in: categoryIds },
    },
    take: 100,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      material: true,
      color: true,
      shape: true,
      priceRange: true,
      imagesJson: true,
    },
  });

  return items.map((p) => {
    const { imagesJson, ...rest } = p;
    let images: string[] = [];
    if (imagesJson && imagesJson.trim()) {
      try {
        images = JSON.parse(imagesJson) as string[];
        if (!Array.isArray(images)) images = [];
      } catch {
        images = [];
      }
    }
    return { ...rest, images };
  });
}

export default async function ProductsCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) notFound();

  const [category, items] = await Promise.all([
    getCategory(id),
    getProductsByCategory(id),
  ]);

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <nav className="mb-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-emerald-600">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-emerald-600">产品中心</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{category.name}</span>
      </nav>

      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            {category.name}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            该品类下的实验室培育宝石与人造宝石产品，支持多种切工与颜色，可按需求询盘。
          </p>
        </div>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 sm:mt-0"
        >
          询盘 / 联系我们
        </Link>
      </div>

      <ProductGrid items={items} />

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <p className="text-slate-600">未找到合适规格？支持来图定制与小批量供货。</p>
        <Link
          href="/contact"
          className="mt-3 inline-flex rounded-full border border-emerald-500 px-5 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
        >
          发送询盘
        </Link>
      </div>
    </div>
  );
}
