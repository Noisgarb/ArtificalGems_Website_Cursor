"use client";

import { useEffect, useState } from "react";
import { getAuthHeaders } from "@/lib/auth-client";

type InquiryStatus = "pending" | "in_progress" | "done" | "archived";

type InquiryListItem = {
  id: number;
  name: string;
  email: string | null;
  wechat: string | null;
  whatsapp: string | null;
  country: string | null;
  type: string;
  budgetRange: string | null;
  message: string;
  sourceChannel: string | null;
  sourceUrl: string | null;
  status: InquiryStatus | string;
  createdAt: string;
  product?: { id: number; name: string } | null;
  notesCount: number;
};

type InquiryDetail = InquiryListItem & {
  notes: {
    id: number;
    content: string;
    createdAt: string;
    operator: { id: number; username: string } | null;
  }[];
};

const statusLabel: Record<InquiryStatus, string> = {
  pending: "待处理",
  in_progress: "跟进中",
  done: "已完成",
  archived: "已归档",
};

const statusColor: Record<InquiryStatus, string> = {
  pending: "bg-yellow-50 text-yellow-800 border-yellow-200",
  in_progress: "bg-blue-50 text-blue-800 border-blue-200",
  done: "bg-green-50 text-green-800 border-green-200",
  archived: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<InquiryListItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "">("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<InquiryDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [detailStatus, setDetailStatus] = useState<InquiryStatus | "">("");
  const [detailNote, setDetailNote] = useState("");

  const pageSize = 10;

  function fetchList() {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (appliedKeyword.trim()) params.set("keyword", appliedKeyword.trim());
    if (statusFilter) params.set("status", statusFilter);
    if (typeFilter) params.set("type", typeFilter);

    fetch(`/api/v1/admin/inquiries?${params.toString()}`, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 0) {
          setItems(json.data.items);
          setTotal(json.data.total);
        }
      })
      .finally(() => setLoading(false));
  }

  function openDetail(id: number) {
    setDetailLoading(true);
    setSelected(null);
    setDetailNote("");
    fetch(`/api/v1/admin/inquiries/${id}`, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 0) {
          const data = json.data as InquiryDetail;
          setSelected(data);
          setDetailStatus((data.status as InquiryStatus) ?? "pending");
        }
      })
      .finally(() => setDetailLoading(false));
  }

  function handleApplyFilters() {
    setAppliedKeyword(keyword);
    setPage(1);
  }

  function handleUpdateDetail() {
    if (!selected || updating) return;
    const payload: { status?: InquiryStatus; note?: string } = {};
    if (detailStatus && detailStatus !== selected.status) {
      payload.status = detailStatus;
    }
    if (detailNote.trim()) {
      payload.note = detailNote.trim();
    }
    if (!payload.status && !payload.note) {
      alert("请先修改状态或填写备注。");
      return;
    }
    setUpdating(true);
    fetch(`/api/v1/admin/inquiries/${selected.id}`, {
      method: "PATCH",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 0) {
          const data = json.data as InquiryDetail;
          setSelected(data);
          setDetailStatus((data.status as InquiryStatus) ?? "pending");
          setDetailNote("");
          fetchList();
        } else {
          alert(json.message || "更新失败");
        }
      })
      .finally(() => setUpdating(false));
  }

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, appliedKeyword, statusFilter, typeFilter]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold">询盘管理</h1>
        <p className="text-sm text-gray-500">查看来自官网的客户询盘，并记录跟进情况。</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="搜索姓名、联系方式、国家或留言..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleApplyFilters();
          }}
          className="min-w-[220px] rounded-md border px-3 py-1.5 text-sm"
        />
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          <option value="">全部类型</option>
          <option value="wholesale">批发</option>
          <option value="retail">零售</option>
          <option value="custom">定制</option>
          <option value="other">其他</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as InquiryStatus | "");
            setPage(1);
          }}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          <option value="">全部状态</option>
          <option value="pending">待处理</option>
          <option value="in_progress">跟进中</option>
          <option value="done">已完成</option>
          <option value="archived">已归档</option>
        </select>
        <button
          onClick={handleApplyFilters}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          查询
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">当前暂无询盘记录。</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left">时间</th>
                <th className="px-4 py-3 text-left">客户</th>
                <th className="px-4 py-3 text-left">类型</th>
                <th className="px-4 py-3 text-left">关联产品</th>
                <th className="px-4 py-3 text-left">状态</th>
                <th className="px-4 py-3 text-left">留言摘要</th>
                <th className="px-4 py-3 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => {
                const st = (i.status as InquiryStatus) || "pending";
                const label = statusLabel[st] ?? i.status;
                const color = statusColor[st] ?? statusColor.pending;
                const createdTime = new Date(i.createdAt).toLocaleString();
                const shortMsg = i.message.length > 40 ? `${i.message.slice(0, 40)}...` : i.message;
                return (
                  <tr key={i.id} className="border-b">
                    <td className="px-4 py-3 align-top text-xs text-gray-500">{createdTime}</td>
                    <td className="px-4 py-3 align-top">
                      <div className="text-sm font-medium text-gray-900">{i.name}</div>
                      <div className="mt-1 text-xs text-gray-500">
                        {i.country || "-"}
                        {i.email && ` · ${i.email}`}
                        {i.wechat && ` · 微信: ${i.wechat}`}
                        {i.whatsapp && ` · WA: ${i.whatsapp}`}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-gray-600">
                      {i.type === "wholesale" && "批发"}
                      {i.type === "retail" && "零售"}
                      {i.type === "custom" && "定制"}
                      {i.type === "other" && "其他"}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-gray-600">
                      {i.product ? i.product.name : <span className="text-gray-400">无</span>}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${color}`}>
                        {label}
                        {i.notesCount > 0 && <span className="ml-1 text-[10px] opacity-70">· 备注 {i.notesCount}</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-gray-600">{shortMsg}</td>
                    <td className="px-4 py-3 align-top">
                      <button
                        onClick={() => openDetail(i.id)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {total > pageSize && (
        <div className="mt-4 flex gap-2 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            上一页
          </button>
          <span className="py-1">
            第 {page} 页 / 共 {Math.ceil(total / pageSize)} 页
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / pageSize)}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      )}

      {detailLoading && !selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="rounded-lg bg-white px-6 py-4 text-sm text-gray-600 shadow">
            正在加载详情...
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-end bg-black/40">
          <div className="flex h-full w-full max-w-xl flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">询盘详情 #{selected.id}</h2>
                <p className="mt-1 text-xs text-gray-500">
                  创建时间：{new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                关闭
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 text-sm">
              <section>
                <h3 className="mb-2 text-xs font-semibold text-gray-500">基本信息</h3>
                <div className="space-y-1 text-sm text-gray-800">
                  <div>
                    <span className="text-gray-500">客户：</span>
                    {selected.name}
                    {selected.country && `（${selected.country}）`}
                  </div>
                  {(selected.email || selected.wechat || selected.whatsapp) && (
                    <div className="space-x-2 text-xs text-gray-600">
                      {selected.email && <span>邮箱：{selected.email}</span>}
                      {selected.wechat && <span>微信：{selected.wechat}</span>}
                      {selected.whatsapp && <span>WhatsApp：{selected.whatsapp}</span>}
                    </div>
                  )}
                  <div className="text-xs text-gray-600">
                    类型：
                    {selected.type === "wholesale" && "批发"}
                    {selected.type === "retail" && "零售"}
                    {selected.type === "custom" && "定制"}
                    {selected.type === "other" && "其他"}
                  </div>
                  {selected.budgetRange && (
                    <div className="text-xs text-gray-600">预算区间：{selected.budgetRange}</div>
                  )}
                  {selected.product && (
                    <div className="text-xs text-gray-600">
                      关联产品：#{selected.product.id} {selected.product.name}
                    </div>
                  )}
                  {(selected.sourceChannel || selected.sourceUrl) && (
                    <div className="text-xs text-gray-500">
                      来源：
                      {selected.sourceChannel && <span>{selected.sourceChannel} </span>}
                      {selected.sourceUrl && (
                        <a
                          href={selected.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          链接
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-xs font-semibold text-gray-500">客户留言</h3>
                <div className="rounded-md border bg-gray-50 p-3 text-sm text-gray-800 whitespace-pre-line">
                  {selected.message}
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-xs font-semibold text-gray-500">当前状态</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={detailStatus}
                    onChange={(e) => setDetailStatus(e.target.value as InquiryStatus)}
                    className="rounded-md border px-3 py-1.5 text-sm"
                  >
                    <option value="pending">待处理</option>
                    <option value="in_progress">跟进中</option>
                    <option value="done">已完成</option>
                    <option value="archived">已归档</option>
                  </select>
                  <span className="text-xs text-gray-500">
                    可根据跟进进度调整，例如：初次联系后标记为“跟进中”，确认无需求可归档。
                  </span>
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-xs font-semibold text-gray-500">添加跟进备注</h3>
                <textarea
                  value={detailNote}
                  onChange={(e) => setDetailNote(e.target.value)}
                  rows={3}
                  placeholder="例如：已通过微信加好友；已发送产品规格与报价；客户暂时观望等。"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
                <button
                  onClick={handleUpdateDetail}
                  disabled={updating}
                  className="mt-2 rounded-md bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? "保存中..." : "更新状态 / 添加备注"}
                </button>
              </section>

              <section>
                <h3 className="mb-2 text-xs font-semibold text-gray-500">历史备注</h3>
                {selected.notes.length === 0 ? (
                  <p className="text-xs text-gray-500">暂无备注。</p>
                ) : (
                  <ul className="space-y-2 text-xs text-gray-700">
                    {selected.notes.map((n) => (
                      <li key={n.id} className="rounded-md border bg-white p-2">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-medium">
                            {n.operator?.username || "系统 / 未记录操作人"}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="whitespace-pre-line">{n.content}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

