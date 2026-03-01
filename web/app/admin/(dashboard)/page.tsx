import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <>
      <h1 className="mb-6 text-xl font-semibold">管理首页</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/inquiries"
          className="rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="font-medium">询盘管理</h3>
          <p className="mt-1 text-sm text-gray-500">查看和跟进客户询盘</p>
        </Link>
        <Link
          href="/admin/products"
          className="rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="font-medium">产品管理</h3>
          <p className="mt-1 text-sm text-gray-500">管理产品与分类</p>
        </Link>
        <Link
          href="/admin/config"
          className="rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="font-medium">站点配置</h3>
          <p className="mt-1 text-sm text-gray-500">联系方式与 SEO 配置</p>
        </Link>
        <Link
          href="/admin/profile"
          className="rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h3 className="font-medium">修改密码</h3>
          <p className="mt-1 text-sm text-gray-500">修改当前管理员登录密码</p>
        </Link>
      </div>
    </>
  );
}
