import type { Metadata } from "next";
import "./globals.css";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "宁林宝石 | 实验室培育宝石 · 人造宝石供应商",
  description: "宁林宝石专注实验室培育宝石与人造宝石供应，支持小批量定制与长期稳定供货，适用于珠宝品牌、电商卖家及礼品渠道。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
