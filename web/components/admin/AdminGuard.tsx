"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getAuthHeaders } from "@/lib/auth-client";
import { AdminShell } from "./AdminShell";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    fetch("/api/v1/auth/me", { headers: getAuthHeaders() })
      .then((res) => {
        if (!res.ok) {
          router.replace("/admin/login");
          return;
        }
        setReady(true);
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }
  return <AdminShell>{children}</AdminShell>;
}
