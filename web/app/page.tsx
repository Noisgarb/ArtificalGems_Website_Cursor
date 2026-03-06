import { ShowcaseCarousel } from "@/components/home/ShowcaseCarousel";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* 顶部导航 */}
      <header className="border-b bg-white/80 backdrop-blur nl-animate-fade-up">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
              宁
            </div>
            <div>
              <div className="text-base font-semibold tracking-wide text-slate-900">
                宁林宝石
              </div>
              <div className="text-xs text-slate-500">
                实验室培育宝石 · 人造宝石供应商
              </div>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
            <a href="/products" className="hover:text-emerald-600">
              产品中心
            </a>
            <a href="/custom" className="hover:text-emerald-600">
              定制服务
            </a>
            <a href="/contact" className="hover:text-emerald-600">
              联系我们
            </a>
            <a
              href="/admin/login"
              className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
            >
              后台登录
            </a>
          </nav>
        </div>
      </header>

      {/* 首屏 Hero 区域 */}
      <section className="border-b bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900 nl-animate-gradient">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:py-24">
          <div className="flex-1 space-y-6 text-left text-white nl-animate-fade-up">
            <p className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-emerald-100">
              宁林宝石 · 小批量灵活供货
            </p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              为珠宝品牌、电商卖家
              <br className="hidden sm:block" />
              提供稳定可靠的人造宝石供应
            </h1>
            <p className="max-w-xl text-sm text-slate-200 sm:text-base">
              宁林宝石专注实验室培育宝石、立方氧化锆等人造宝石，为中小企业提供稳定品质、灵活规格与可追溯的供货服务，支持打样、小批量到长期合作。
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2 text-sm font-medium text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-emerald-600"
              >
                立即发送询盘
              </a>
              <a
                href="/products"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-2 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5 hover:border-white"
              >
                浏览全部产品
              </a>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-300">
              <span>✔ 支持小批量定制</span>
              <span>✔ 多种切工与颜色</span>
              <span>✔ 稳定交期与质量管控</span>
            </div>
          </div>

          <div className="mt-8 flex-1 lg:mt-0">
            <ShowcaseCarousel />
          </div>
        </div>
      </section>

      {/* 关于宁林宝石 / 公司简介 */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_minmax(0,1fr)] lg:py-16">
          <div className="space-y-4 nl-animate-fade-up">
            <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              关于宁林宝石
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              宁林宝石是一家专注于实验室培育宝石与人造宝石的供应商，面向珠宝品牌、电商卖家及礼品公司提供灵活、稳定的用料方案。我们深知中小企业在选料、库存和成本上的压力，因此提供从打样、小批量到稳定供货的一站式支持。
            </p>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              无论您是需要用于镶嵌的主石、辅石，还是用于饰品、礼品的点缀宝石，我们都可以根据切工、颜色、规格进行配套推荐，并结合您的渠道与客群，给出更适配的用料建议。
            </p>
            <div className="grid gap-4 text-sm text-slate-700 sm:grid-cols-3">
              <div>
                <div className="text-xs font-medium text-emerald-600">主打品类</div>
                <div className="mt-1 text-sm">
                  实验室培育宝石
                  <br />
                  立方氧化锆
                  <br />
                  合成立方宝石
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-emerald-600">合作客户</div>
                <div className="mt-1 text-sm">
                  珠宝品牌
                  <br />
                  跨境电商卖家
                  <br />
                  礼品与饰品工厂
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-emerald-600">服务特点</div>
                <div className="mt-1 text-sm">
                  小起订量
                  <br />
                  规格可定制
                  <br />
                  持续供货支持
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-700 nl-animate-fade-up-delay-1">
            <h3 className="text-sm font-semibold text-slate-900">
              适合正在寻找稳定人造宝石供应商的你
            </h3>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li>· 有成熟渠道，但缺少稳定的宝石用料供应；</li>
              <li>· 希望控制成本，同时保持产品观感与品质；</li>
              <li>· 产品款式更新较快，需要灵活的调色与切工方案；</li>
              <li>· 不想自己跑工厂、跑原料，希望有长期合作伙伴。</li>
            </ul>
            <a
              href="/contact"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-xs font-medium text-white hover:bg-emerald-600"
            >
              简单介绍一下您的需求，我们来配合方案
            </a>
          </div>
        </div>
      </section>

      {/* 产品与应用场景概览 */}
      <section className="border-b bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                产品与应用场景
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                支持多种切工、颜色与规格，可覆盖从入门电商饰品到中高端珠宝线的不同定位。
              </p>
            </div>
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-600"
            >
              查看详细产品列表
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 nl-animate-fade-up">
              <div className="mb-3 h-1.5 w-12 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-semibold text-slate-900">
                实验室培育宝石
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                适用于中高端珠宝款式，光学性能接近天然宝石，可根据设计需求匹配颜色与尺寸，适合品牌线与私人定制业务。
              </p>
              <div className="mt-3 text-xs text-slate-500">
                常见应用：主石、戒托、项链与耳饰等核心视觉石位。
              </div>
            </div>
            <div className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 nl-animate-fade-up-delay-1">
              <div className="mb-3 h-1.5 w-12 rounded-full bg-sky-500" />
              <h3 className="text-sm font-semibold text-slate-900">
                立方氧化锆 / 人造锆石
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                性价比高、闪耀度好，适合大部分电商饰品和礼品类产品，可提供多种火彩效果与切工形状，满足批量生产需求。
              </p>
              <div className="mt-3 text-xs text-slate-500">
                常见应用：电商爆款、礼品随附饰品、快时尚饰品。
              </div>
            </div>
            <div className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 nl-animate-fade-up-delay-2">
              <div className="mb-3 h-1.5 w-12 rounded-full bg-amber-500" />
              <h3 className="text-sm font-semibold text-slate-900">
                定制颜色与规格
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                针对有品牌识别度需求的客户，可根据指定潘通色、品牌主色或产品线风格，配合切工、尺寸做定制化搭配。
              </p>
              <div className="mt-3 text-xs text-slate-500">
                常见应用：品牌联名款、主题系列、限定礼盒。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 为什么选择宁林宝石 */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              为什么选择宁林宝石
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              我们希望成为你可以长期信赖的用料伙伴，而不仅是一家一次性的供应商。
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 nl-animate-fade-up">
              <div className="text-xs font-semibold text-emerald-600">
                01 · 稳定品质
              </div>
              <p className="mt-2 text-sm leading-relaxed">
                严选上游工厂与批次管理，对颜色偏差、切工对称性和杂质控制有稳定标准，减少因用料问题导致的退货率。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 nl-animate-fade-up-delay-1">
              <div className="text-xs font-semibold text-emerald-600">
                02 · 灵活起订量
              </div>
              <p className="mt-2 text-sm leading-relaxed">
                支持从打样、小批量开始，陪伴你从产品验证期走向稳定放量，不用一开始就承担过高库存压力。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 nl-animate-fade-up-delay-2">
              <div className="text-xs font-semibold text-emerald-600">
                03 · 沟通直接高效
              </div>
              <p className="mt-2 text-sm leading-relaxed">
                直接对接具体需求与产品应用场景，比单纯报规格更关注“你要卖给什么样的客户”，一起把产品做顺畅。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 nl-animate-fade-up-delay-3">
              <div className="text-xs font-semibold text-emerald-600">
                04 · 透明与长期
              </div>
              <p className="mt-2 text-sm leading-relaxed">
                对价格构成、交期和可替代方案保持透明，帮助你对上游有掌握感，更安心地规划自己的产品线与渠道。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 行动召唤 CTA */}
      <section className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                有意向合作或想先打样？
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                可以简单介绍一下你的品类方向、销售渠道和大致需求量，我们会结合经验给出更合适的宝石用料建议和沟通方式。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-600"
              >
                填写在线询盘表单
              </a>
              <a
                href="/products"
                className="inline-flex items-center justify-center rounded-full border border-slate-500 px-6 py-2 text-sm font-medium text-slate-100 hover:border-emerald-400 hover:text-emerald-100"
              >
                先看看现有产品
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-[11px] text-slate-400 sm:flex-row sm:px-6">
          <div>© {new Date().getFullYear()} 宁林宝石 · 实验室培育宝石 / 人造宝石供应商</div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="/contact" className="hover:text-emerald-300">
              联系方式与询盘
            </a>
            <span className="h-3 w-px bg-slate-700" />
            <a href="/admin/login" className="hover:text-emerald-300">
              后台管理入口
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
