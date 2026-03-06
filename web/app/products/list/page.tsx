import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductGrid, type ProductItem } from "@/components/products/ProductGrid";

export const dynamic = "force-dynamic";

async function getAllProducts(): Promise<ProductItem[]> {
  const items = await prisma.product.findMany({
    where: { status: "online" },
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

export default async function ProductsListPage() {
  const items = await getAllProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <nav className="mb-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-emerald-600">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-emerald-600">产品中心</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">全部产品</span>
      </nav>

      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">全部产品</h1>
          <p className="mt-2 text-sm text-slate-600">
            以下为当前在售产品，按上新时间排序。如需按品类查看，请返回产品中心选择分类。
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
