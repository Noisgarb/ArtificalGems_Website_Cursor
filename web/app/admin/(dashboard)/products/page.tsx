"use client";

import { useCallback, useEffect, useState } from "react";
import { getAuthHeaders } from "@/lib/auth-client";
import { ProductForm, type ProductFormData } from "@/components/admin/ProductForm";
import { ProductImportModal } from "@/components/admin/ProductImportModal";

type Product = {
  id: number;
  name: string;
  material: string | null;
  color: string | null;
  shape: string | null;
  sizeRange: string | null;
  priceRange: string | null;
  status: string;
  images: string[];
  category?: { id: number; name: string } | null;
};

type Category = { id: number; name: string; parentId: number | null };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProductFormData | null | "new">(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showImport, setShowImport] = useState(false);

  const pageSize = 10;

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (appliedKeyword) params.set("keyword", appliedKeyword);
    if (statusFilter) params.set("status", statusFilter);
    if (categoryFilter) params.set("categoryId", categoryFilter);
    fetch(`/api/v1/admin/products?${params}`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 0) {
          setProducts(json.data.items);
          setTotal(json.data.total);
        }
      })
      .finally(() => setLoading(false));
  }, [page, appliedKeyword, statusFilter, categoryFilter]);

  function fetchCategories() {
    fetch("/api/v1/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 0) {
          const flat: Category[] = [];
          const collect = (list: { id: number; name: string; parentId: number | null; children?: unknown[] }[]) => {
            for (const c of list) {
              flat.push({ id: c.id, name: c.name, parentId: c.parentId });
              if (c.children?.length) collect(c.children as never);
            }
          };
          collect(json.data);
          setCategories(flat);
        }
      });
  }

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleSave(data: ProductFormData) {
    const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };
    if (data.id) {
      fetch(`/api/v1/admin/products/${data.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.code === 0) {
            setEditing(null);
            fetchProducts();
          } else alert(json.message);
        });
    } else {
      fetch("/api/v1/admin/products", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.code === 0) {
            setEditing(null);
            fetchProducts();
          } else alert(json.message);
        });
    }
  }

  function handleToggleStatus(p: Product) {
    const next = p.status === "online" ? "offline" : "online";
    fetch(`/api/v1/admin/products/${p.id}/status`, {
      method: "PATCH",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    }).then(() => fetchProducts());
  }

  function handleDelete(id: number) {
    if (!confirm("确定要下架该产品吗？")) return;
    setDeleting(id);
    fetch(`/api/v1/admin/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 0) {
          setDeleting(null);
          fetchProducts();
        } else alert(json.message);
      })
      .finally(() => setDeleting(null));
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold">产品管理</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="rounded-md border border-blue-600 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
          >
            批量导入
          </button>
          <button
            onClick={() => setEditing("new")}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            新增产品
          </button>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="搜索产品名称..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setAppliedKeyword(keyword);
              setPage(1);
            }
          }}
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          <option value="">全部分类</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          <option value="">全部状态</option>
          <option value="online">上架</option>
          <option value="offline">下架</option>
        </select>
        <button
          onClick={() => {
            setAppliedKeyword(keyword);
            setPage(1);
          }}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          查询
        </button>
      </div>
      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">图片</th>
                <th className="px-4 py-3 text-left">名称</th>
                <th className="px-4 py-3 text-left">材质/颜色</th>
                <th className="px-4 py-3 text-left">价格区间</th>
                <th className="px-4 py-3 text-left">分类</th>
                <th className="px-4 py-3 text-left">状态</th>
                <th className="px-4 py-3 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="px-4 py-3">{p.id}</td>
                  <td className="px-4 py-3">
                    {p.images?.length ? (
                      <img src={p.images[0]} alt="" className="h-10 w-10 rounded border object-cover" />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.material ?? "-"} / {p.color ?? "-"}</td>
                  <td className="px-4 py-3">{p.priceRange ?? "-"}</td>
                  <td className="px-4 py-3">{p.category?.name ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className={p.status === "online" ? "text-green-600" : "text-gray-400"}>
                      {p.status === "online" ? "上架" : "下架"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleStatus(p)}
                      className="mr-2 text-blue-600 hover:underline"
                    >
                      {p.status === "online" ? "下架" : "上架"}
                    </button>
                    <button
                      onClick={() => {
                        fetch(`/api/v1/admin/products/${p.id}`, { headers: getAuthHeaders() })
                          .then((res) => res.json())
                          .then((json) => {
                            if (json.code === 0) {
                              const d = json.data;
                              setEditing({
                                id: d.id,
                                name: d.name,
                                material: d.material ?? "",
                                color: d.color ?? "",
                                shape: d.shape ?? "",
                                sizeRange: d.sizeRange ?? "",
                                priceRange: d.priceRange ?? "",
                                description: d.description ?? "",
                                categoryId: d.category?.id ?? null,
                                tags: d.tags ?? [],
                                images: d.images ?? [],
                                status: d.status,
                              });
                            }
                          });
                      }}
                      className="mr-2 text-blue-600 hover:underline"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => {
                        fetch(`/api/v1/admin/products/${p.id}`, { headers: getAuthHeaders() })
                          .then((res) => res.json())
                          .then((json) => {
                            if (json.code === 0) {
                              const d = json.data;
                              setEditing({
                                name: d.name + " (复制)",
                                material: d.material ?? "",
                                color: d.color ?? "",
                                shape: d.shape ?? "",
                                sizeRange: d.sizeRange ?? "",
                                priceRange: d.priceRange ?? "",
                                description: d.description ?? "",
                                categoryId: d.category?.id ?? null,
                                tags: d.tags ?? [],
                                images: d.images ?? [],
                                status: d.status,
                              });
                            }
                          });
                      }}
                      className="mr-2 text-gray-600 hover:underline"
                    >
                      复制
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      className="text-red-600 hover:underline disabled:opacity-50"
                    >
                      {deleting === p.id ? "处理中" : "删除"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {total > pageSize && (
        <div className="mt-4 flex gap-2">
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
      {showImport && (
        <ProductImportModal
          onClose={() => setShowImport(false)}
          onSuccess={() => fetchProducts()}
          getAuthHeaders={getAuthHeaders}
        />
      )}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">{editing === "new" || !editing.id ? "新增产品" : "编辑产品"}</h2>
            <ProductForm
              product={editing === "new" ? undefined : editing}
              categories={categories}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
              getAuthHeaders={getAuthHeaders}
            />
          </div>
        </div>
      )}
    </>
  );
}
