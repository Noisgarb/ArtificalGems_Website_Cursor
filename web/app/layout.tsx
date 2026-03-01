import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "人造宝石询盘型官网",
  description: "实验室培育宝石 / 人造宝石供应",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
