"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthHeaders, removeToken } from "@/lib/auth-client";

export default function AdminProfilePage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (newPassword !== confirmPassword) {
      setMessage({ type: "err", text: "两次输入的新密码不一致" });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "err", text: "新密码至少 6 位" });
      return;
    }
    setLoading(true);
    fetch("/api/v1/admin/me/password", {
      method: "PATCH",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 0) {
          setMessage({ type: "ok", text: "密码已修改，请重新登录。" });
          removeToken();
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setTimeout(() => {
            router.replace("/admin/login");
          }, 800);
        } else {
          setMessage({ type: "err", text: json.message || "修改失败" });
        }
      })
      .catch(() => setMessage({ type: "err", text: "请求失败" }))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold">修改密码</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">当前密码 <span className="text-red-500">*</span></label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            required
            autoComplete="current-password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">新密码 <span className="text-red-500">*</span></label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            required
            minLength={6}
            placeholder="至少 6 位"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">确认新密码 <span className="text-red-500">*</span></label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        {message && (
          <p className={`text-sm ${message.type === "ok" ? "text-green-600" : "text-red-600"}`}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "提交中…" : "修改密码"}
        </button>
      </form>
    </>
  );
}
