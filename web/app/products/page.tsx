import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getCategoriesForOverview() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { products: true } },
      children: {
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: true } } },
      },
    },
  });
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    directCount: c._count.products,
    childrenCount: c.children.reduce((sum, ch) => sum + ch._count.products, 0),
    totalCount: c._count.products + c.children.reduce((sum, ch) => sum + ch._count.products, 0),
  }));
}

export default async function ProductsOverviewPage() {
  const categories = await getCategoriesForOverview();
  const totalProducts = await prisma.product.count({ where: { status: "online" } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <nav className="mb-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-emerald-600">首页</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">产品中心</span>
      </nav>

      {/* 概述区 */}
      <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">产品中心</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          宁林宝石提供实验室培育宝石、立方氧化锆等人造宝石产品，按品类划分便于您快速找到所需规格。支持多种切工、颜色与尺寸，适用于电商饰品、品牌系列与礼品定制等场景；如需来图定制或批量询价，欢迎通过下方「询盘」与我们联系。
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-600"
          >
            询盘 / 联系我们
          </Link>
          <Link
            href="/products/list"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-600"
          >
            浏览全部产品
          </Link>
        </div>
      </section>

      {/* 分类入口 */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">按品类浏览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* 全部产品入口 */}
          <Link
            href="/products/list"
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:ring-2 hover:ring-emerald-500/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600">
              <span className="text-lg font-semibold">全</span>
            </div>
            <h3 className="mt-4 font-semibold text-slate-900 group-hover:text-emerald-700">
              全部产品
            </h3>
            <p className="mt-2 flex-1 text-sm text-slate-600">
              查看所有在售产品，按上新时间排序。
            </p>
            <p className="mt-3 text-xs font-medium text-emerald-600">
              共 {totalProducts} 款 →
            </p>
          </Link>

          {/* 各分类入口 */}
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/category/${cat.id}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:ring-2 hover:ring-emerald-500/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100">
                <span className="text-lg font-semibold">{cat.name.slice(0, 1)}</span>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 group-hover:text-emerald-700">
                {cat.name}
              </h3>
              <p className="mt-2 flex-1 text-sm text-slate-600">
                该品类下的实验室培育宝石与人造宝石产品，含多种切工与颜色可选。
              </p>
              <p className="mt-3 text-xs font-medium text-emerald-600">
                共 {cat.totalCount} 款 →
              </p>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            暂无分类，您可先浏览「全部产品」或联系我们将为您推荐合适品类。
          </p>
        )}
      </section>

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
