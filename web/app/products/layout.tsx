import Link from "next/link";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
              宁
            </div>
            <div>
              <div className="text-base font-semibold tracking-wide text-slate-900">宁林宝石</div>
              <div className="text-xs text-slate-500">实验室培育宝石 · 人造宝石供应商</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
            <Link href="/products" className="font-medium text-emerald-600">
              产品中心
            </Link>
            <Link href="/custom" className="hover:text-emerald-600">
              定制服务
            </Link>
            <Link href="/contact" className="hover:text-emerald-600">
              联系我们
            </Link>
            <a
              href="/admin/login"
              className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
            >
              后台登录
            </a>
          </nav>
        </div>
      </header>

      {children}

      <footer className="mt-12 border-t border-slate-200 bg-white py-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-slate-500 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} 宁林宝石</span>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-emerald-600">首页</Link>
            <Link href="/contact" className="hover:text-emerald-600">联系我们</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
