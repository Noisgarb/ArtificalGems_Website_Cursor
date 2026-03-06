"use client";

import { useEffect, useState } from "react";

type Slide = {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
};

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "电商爆款 · 性价比优先",
    subtitle: "适合淘宝 / 天猫 / 独立站等渠道的大批量饰品生产。",
    badge: "场景 01",
  },
  {
    id: 2,
    title: "品牌系列 · 观感与调性",
    subtitle: "更注重视觉统一与质感，用于品牌主线与系列款式。",
    badge: "场景 02",
  },
  {
    id: 3,
    title: "礼品项目 · 小批量定制",
    subtitle: "适合企业礼品、会员福利、联名活动等主题项目。",
    badge: "场景 03",
  },
];

export function ShowcaseCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const current = SLIDES[active];

  function goTo(index: number) {
    setActive((index + SLIDES.length) % SLIDES.length);
  }

  function next() {
    goTo(active + 1);
  }

  function prev() {
    goTo(active - 1);
  }

  return (
    <div className="relative mx-auto max-w-md rounded-3xl bg-white/5 p-5 shadow-2xl shadow-emerald-900/40 ring-1 ring-white/10 nl-animate-fade-up-delay-1">
      {/* 上方渐变“橱窗”区域 */}
      <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-slate-900/80 sm:h-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,#22c55e33,transparent_60%),radial-gradient(circle_at_100%_0,#38bdf833,transparent_55%),radial-gradient(circle_at_0_100%,#f9731633,transparent_55%),radial-gradient(circle_at_100%_100%,#e879f933,transparent_60%)] nl-animate-gradient" />
        <div className="absolute inset-0 grid grid-cols-3 gap-2 px-3 py-3 sm:px-4 sm:py-4">
          <div className="rounded-xl bg-white/10 shadow-sm shadow-emerald-500/20 backdrop-blur" />
          <div className="rounded-xl bg-white/10 shadow-sm shadow-sky-500/20 backdrop-blur" />
          <div className="rounded-xl bg-white/10 shadow-sm shadow-fuchsia-500/20 backdrop-blur" />
          <div className="rounded-xl bg-white/5 shadow-sm shadow-emerald-400/15 backdrop-blur" />
          <div className="rounded-xl bg-white/5 shadow-sm shadow-sky-400/15 backdrop-blur" />
          <div className="rounded-xl bg-gradient-to-br from-slate-900/70 via-slate-950/90 to-slate-900/70 shadow-inner shadow-black/60 backdrop-blur" />
        </div>

        {/* 左右切换按钮 */}
        <button
          type="button"
          onClick={prev}
          aria-label="上一条推荐"
          className="absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-[11px] text-slate-100 backdrop-blur hover:bg-black/55"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="下一条推荐"
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-[11px] text-slate-100 backdrop-blur hover:bg-black/55"
        >
          ›
        </button>
      </div>

      {/* 文本与指示点 */}
      <div key={current.id} className="mt-4 space-y-2 text-xs text-slate-200 sm:text-sm nl-carousel-fade">
        <div className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-medium text-emerald-100 ring-1 ring-emerald-500/40">
          {current.badge} · 应用场景推荐
        </div>
        <div className="text-sm font-semibold text-white sm:text-base">{current.title}</div>
        <div className="text-xs text-slate-300 sm:text-[13px]">{current.subtitle}</div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`切换到推荐 ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === active ? "w-6 bg-emerald-400" : "w-2 bg-slate-600 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
          <a
            href="/products"
            className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-emerald-600"
          >
            对应产品
            <span className="text-xs">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}


