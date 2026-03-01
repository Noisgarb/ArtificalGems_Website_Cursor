"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { removeToken, getAuthHeaders } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type User = { id: number; username: string; role: string };

export function AdminNav({ user }: { user: User | null }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    fetch("/api/v1/auth/logout", {
      method: "POST",
      headers: getAuthHeaders(),
    }).finally(() => {
      removeToken();
      router.replace("/admin/login");
      router.refresh();
    });
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <nav className="flex gap-4">
          <Link
            href="/admin"
            className={`text-sm ${pathname === "/admin" ? "font-semibold text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
          >
            首页
          </Link>
          <Link
            href="/admin/inquiries"
            className={`text-sm ${pathname?.startsWith("/admin/inquiries") ? "font-semibold text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
          >
            询盘
          </Link>
          <Link
            href="/admin/products"
            className={`text-sm ${pathname?.startsWith("/admin/products") ? "font-semibold text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
          >
            产品
          </Link>
          <Link
            href="/admin/config"
            className={`text-sm ${pathname?.startsWith("/admin/config") ? "font-semibold text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
          >
            配置
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm text-gray-600">{user.username}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-blue-600 hover:underline"
              >
                退出
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
