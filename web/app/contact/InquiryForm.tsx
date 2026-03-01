"use client";

import { useState } from "react";

export function InquiryForm({
  defaultProductId,
  defaultProductName,
}: {
  defaultProductId?: number;
  defaultProductName?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wechat, setWechat] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState<"wholesale" | "retail" | "custom" | "other">("wholesale");
  const [budgetRange, setBudgetRange] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !country.trim() || !message.trim()) {
      alert("请填写姓名、国家/地区和留言内容。");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || null,
          wechat: wechat.trim() || null,
          whatsapp: whatsapp.trim() || null,
          country: country.trim(),
          type,
          budgetRange: budgetRange.trim() || undefined,
          message: message.trim(),
          productId: defaultProductId,
        }),
      });
      const json = await res.json();
      if (json.code === 0) {
        setDone(true);
        setName("");
        setEmail("");
        setWechat("");
        setWhatsapp("");
        setCountry("");
        setBudgetRange("");
        setMessage("");
      } else {
        alert(json.message || "提交失败，请稍后重试。");
      }
    } catch {
      alert("网络错误，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-medium text-green-800">询盘已提交成功</p>
        <p className="mt-2 text-sm text-green-700">我们会尽快与您联系。</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
      {defaultProductName && (
        <p className="text-sm text-gray-600">询盘产品：{defaultProductName}</p>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">姓名 <span className="text-red-500">*</span></label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" required placeholder="您的姓名或公司" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">国家/地区 <span className="text-red-500">*</span></label>
        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" required placeholder="如：中国、美国" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">邮箱</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="email@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">微信</label>
          <input type="text" value={wechat} onChange={(e) => setWechat(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
        <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">询盘类型 <span className="text-red-500">*</span></label>
        <select value={type} onChange={(e) => setType(e.target.value as "wholesale" | "retail" | "custom" | "other")} className="mt-1 w-full rounded-md border px-3 py-2" required>
          <option value="wholesale">批发</option>
          <option value="retail">零售</option>
          <option value="custom">定制</option>
          <option value="other">其他</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">预算区间</label>
        <input type="text" value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="如：$1000-$5000" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">留言 <span className="text-red-500">*</span></label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" rows={4} required placeholder="请描述您的需求..." />
      </div>
      <button type="submit" disabled={submitting} className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
        {submitting ? "提交中…" : "提交询盘"}
      </button>
    </form>
  );
}
