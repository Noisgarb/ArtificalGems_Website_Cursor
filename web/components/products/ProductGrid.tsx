import Link from "next/link";

export type ProductItem = {
  id: number;
  name: string;
  material: string | null;
  color: string | null;
  shape: string | null;
  priceRange: string | null;
  images: string[];
};

export function ProductGrid({ items }: { items: ProductItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-slate-600">该分类下暂无上架产品。</p>
        <p className="mt-2 text-sm text-slate-500">欢迎通过下方按钮了解定制与询盘服务。</p>
        <Link
          href="/contact"
          className="mt-4 inline-flex rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600"
        >
          联系我们
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => {
        const specs = [p.material, p.color, p.shape].filter(Boolean);
        return (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:ring-2 hover:ring-emerald-500/20"
          >
            <div className="aspect-square overflow-hidden bg-slate-100">
              {p.images?.length ? (
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <span className="text-sm">暂无图片</span>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <h2 className="line-clamp-2 font-semibold text-slate-900 group-hover:text-emerald-700">
                {p.name}
              </h2>
              {specs.length > 0 && (
                <p className="mt-2 text-sm text-slate-600">{specs.join(" · ")}</p>
              )}
              {p.priceRange && (
                <p className="mt-1 text-sm font-medium text-emerald-600">{p.priceRange}</p>
              )}
              <span className="mt-3 inline-flex items-center text-xs font-medium text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100">
                查看详情
                <span className="ml-1">→</span>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
