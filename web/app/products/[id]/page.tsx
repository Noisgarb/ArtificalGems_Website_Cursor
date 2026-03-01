import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function getProduct(id: number) {
  const p = await prisma.product.findFirst({
    where: { id, status: "online" },
    include: { category: { select: { id: true, name: true } } },
  });
  if (!p) return null;
  const images = p.imagesJson ? (JSON.parse(p.imagesJson) as string[]) : [];
  const tags = p.tagsJson ? (JSON.parse(p.tagsJson) as string[]) : [];
  const { imagesJson, tagsJson, ...rest } = p;
  return { ...rest, images, tags };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id);
  if (isNaN(productId)) notFound();
  const product = await getProduct(productId);
  if (!product) notFound();

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/products" className="text-blue-600 hover:underline">← 返回产品列表</Link>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="space-y-2">
            {product.images?.length ? (
              product.images.map((url, i) => (
                <img key={i} src={url} alt="" className="w-full rounded-lg border object-cover" />
              ))
            ) : (
              <div className="aspect-square rounded-lg border bg-gray-100 flex items-center justify-center text-gray-400">暂无图片</div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            {product.category && <p className="mt-1 text-gray-600">{product.category.name}</p>}
            <dl className="mt-4 space-y-2 text-sm">
              {product.material && <div><dt className="text-gray-500">材质</dt><dd>{product.material}</dd></div>}
              {product.color && <div><dt className="text-gray-500">颜色</dt><dd>{product.color}</dd></div>}
              {product.shape && <div><dt className="text-gray-500">形状/切工</dt><dd>{product.shape}</dd></div>}
              {product.sizeRange && <div><dt className="text-gray-500">尺寸/重量</dt><dd>{product.sizeRange}</dd></div>}
              {product.priceRange && <div><dt className="text-gray-500">价格区间</dt><dd>{product.priceRange}</dd></div>}
            </dl>
            {product.description && <p className="mt-4 text-gray-700">{product.description}</p>}
            {product.tags?.length ? (
              <p className="mt-2 text-sm text-gray-500">标签：{product.tags.join(", ")}</p>
            ) : null}
            <Link href={`/contact?productId=${product.id}&productName=${encodeURIComponent(product.name)}`} className="mt-6 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">询盘此产品</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
