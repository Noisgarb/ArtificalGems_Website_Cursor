"use client";

import { useState } from "react";

const TSV_HEADER = "产品名称\t材质\t颜色\t形状\t尺寸范围\t价格区间\t分类ID\t描述\t图片URL(多张用|分隔)\t标签(逗号分隔)\t状态";

function parseTSV(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const rows: Record<string, string>[] = [];
  const keys = ["name", "material", "color", "shape", "sizeRange", "priceRange", "categoryId", "description", "images", "tags", "status"];
  for (let i = 0; i < lines.length; i++) {
    const cells = lines[i].split("\t").map((c) => c.trim());
    if (i === 0 && cells[0]?.includes("产品名称")) continue;
    const row: Record<string, string> = {};
    keys.forEach((k, j) => {
      row[k] = cells[j] ?? "";
    });
    if (row.name) rows.push(row);
  }
  return rows;
}

function rowToProduct(row: Record<string, string>): {
  name: string;
  material?: string;
  color?: string;
  shape?: string;
  sizeRange?: string;
  priceRange?: string;
  description?: string;
  categoryId?: number | null;
  tags?: string[];
  images?: string[];
  status?: "online" | "offline";
} {
  const categoryId = row.categoryId ? parseInt(row.categoryId, 10) : null;
  const images = row.images ? row.images.split("|").map((s) => s.trim()).filter(Boolean) : [];
  const tags = row.tags ? row.tags.split(/[,，]/).map((s) => s.trim()).filter(Boolean) : [];
  const status = (row.status === "offline" ? "offline" : "online") as "online" | "offline";
  return {
    name: row.name,
    material: row.material || undefined,
    color: row.color || undefined,
    shape: row.shape || undefined,
    sizeRange: row.sizeRange || undefined,
    priceRange: row.priceRange || undefined,
    description: row.description || undefined,
    categoryId: categoryId && !isNaN(categoryId) ? categoryId : null,
    tags: tags.length ? tags : undefined,
    images: images.length ? images : undefined,
    status,
  };
}

export function ProductImportModal({
  onClose,
  onSuccess,
  getAuthHeaders,
}: {
  onClose: () => void;
  onSuccess: () => void;
  getAuthHeaders: () => Record<string, string>;
}) {
  const [text, setText] = useState(TSV_HEADER + "\n");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ created: number; failed: number; errors: { row: number; message: string }[] } | null>(null);

  function handleImport() {
    const rows = parseTSV(text);
    if (rows.length === 0) {
      alert("没有可导入的数据，请粘贴表格内容（可从 Excel 复制，制表符分隔）");
      return;
    }
    const products = rows.map(rowToProduct);
    setImporting(true);
    setResult(null);
    fetch("/api/v1/admin/products/batch", {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ products }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 0) {
          setResult({
            created: json.data.created,
            failed: json.data.failed,
            errors: json.data.errors ?? [],
          });
          if (json.data.created > 0) onSuccess();
        } else {
          alert(json.message || "导入失败");
        }
      })
      .catch(() => alert("导入请求失败"))
      .finally(() => setImporting(false));
  }

  function downloadTemplate() {
    const blob = new Blob(["\uFEFF" + TSV_HEADER + "\n示例产品\t锆石\t红色\t圆形\t0.5ct\t$10/pcs\t\t\t\t裸石\tonline"], { type: "text/tab-separated-values;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "产品导入模板.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-bold">批量导入产品</h2>
        <p className="mb-3 text-sm text-gray-500">
          从 Excel 复制表格粘贴到下方（第一行可为表头），或{" "}
          <button type="button" onClick={downloadTemplate} className="text-blue-600 hover:underline">
            下载模板
          </button>
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mb-3 w-full rounded border px-3 py-2 font-mono text-sm"
          rows={12}
          placeholder={TSV_HEADER}
        />
        {result && (
          <div className="mb-3 rounded border border-green-200 bg-green-50 p-3 text-sm">
            成功导入 {result.created} 条，失败 {result.failed} 条
            {result.errors.length > 0 && (
              <ul className="mt-1 list-inside text-red-600">
                {result.errors.map((e) => (
                  <li key={e.row}>第{e.row}行: {e.message}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 hover:bg-gray-50">
            关闭
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={importing}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {importing ? "导入中..." : "开始导入"}
          </button>
        </div>
      </div>
    </div>
  );
}
