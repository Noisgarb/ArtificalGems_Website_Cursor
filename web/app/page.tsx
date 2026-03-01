export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">人造宝石询盘型官网</h1>
        <p className="mt-2 text-gray-600">实验室培育宝石 / 人造宝石供应</p>
      </header>
      <section className="mx-auto max-w-4xl space-y-6">
        <p className="text-lg">
          欢迎访问。本项目为基础框架，包含：产品展示、询盘表单、后台管理等模块。
        </p>
        <ul className="list-inside list-disc space-y-2 text-gray-700">
          <li>
            <a href="/products" className="text-blue-600 underline">
              产品列表
            </a>
          </li>
          <li>
            <a href="/custom" className="text-blue-600 underline">
              定制服务
            </a>
          </li>
          <li>
            <a href="/contact" className="text-blue-600 underline">
              联系我们
            </a>
          </li>
          <li>
            <a href="/admin/login" className="text-blue-600 underline">
              后台登录
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
