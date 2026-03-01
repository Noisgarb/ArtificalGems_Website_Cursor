import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getProducts() {
  const items = await prisma.product.findMany({
    where: { status: "online" },
    take: 50,
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
    const images = imagesJson ? (JSON.parse(imagesJson) as string[]) : [];
    return { ...rest, images };
  });
}

export default async function ProductsPage() {
  const items = await getProducts();
  return (
    <main className="min-h-screen p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">产品列表</h1>
        <Link href="/" className="text-blue-600 hover:underline">返回首页</Link>
      </header>
      {items.length === 0 ? (
        <p className="text-gray-600">暂无上架产品。</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden rounded border bg-gray-100">
                {p.images?.length ? (
                  <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">暂无图片</div>
                )}
              </div>
              <h2 className="mt-3 font-medium">{p.name}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {[p.material, p.color, p.shape].filter(Boolean).join(" / ") || "-"}
              </p>
              {p.priceRange && <p className="mt-1 text-sm text-gray-500">{p.priceRange}</p>}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
