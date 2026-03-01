"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "./AdminNav";
import { getAuthHeaders } from "@/lib/auth-client";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/v1/auth/me", { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 0) setUser(json.data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav user={user} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
