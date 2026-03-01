"use client";

import { useState, useEffect } from "react";

export type ProductFormData = {
  id?: number;
  name: string;
  material: string;
  color: string;
  shape: string;
  sizeRange: string;
  priceRange: string;
  description: string;
  categoryId: number | null;
  tags: string[];
  images: string[];
  status: "online" | "offline";
};

const emptyForm: ProductFormData = {
  name: "",
  material: "",
  color: "",
  shape: "",
  sizeRange: "",
  priceRange: "",
  description: "",
  categoryId: null,
  tags: [],
  images: [],
  status: "online",
};

type Category = { id: number; name: string; parentId: number | null };

export function ProductForm({
  product,
  categories,
  onSave,
  onCancel,
  getAuthHeaders,
}: {
  product?: ProductFormData | null;
  categories: Category[];
  onSave: (data: ProductFormData) => void;
  onCancel: () => void;
  getAuthHeaders: () => Record<string, string>;
}) {
  const [form, setForm] = useState<ProductFormData>(product ?? emptyForm);
  const [imageList, setImageList] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm(product);
      setImageList(product.images ?? []);
      setTagsText(product.tags.join(", "));
    } else {
      setForm(emptyForm);
      setImageList([]);
      setTagsText("");
    }
    setUrlInput("");
  }, [product]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tags = tagsText.split(/[,，]/).map((s) => s.trim()).filter(Boolean);
    onSave({ ...form, images: imageList, tags });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append("file", files[i]);
    fetch("/api/v1/admin/upload", {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 0 && json.data?.urls?.length) {
          setImageList((prev) => [...prev, ...json.data.urls]);
        } else {
          alert(json.message || "上传失败");
        }
      })
      .catch(() => alert("上传失败"))
      .finally(() => {
        setUploading(false);
        e.target.value = "";
      });
  }

  function addUrls() {
    const urls = urlInput.split("\n").map((s) => s.trim()).filter(Boolean);
    if (urls.length) {
      setImageList((prev) => [...prev, ...urls]);
      setUrlInput("");
    }
  }

  function removeImage(index: number) {
    setImageList((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">产品名称 <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 block w-full rounded-md border px-3 py-2"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">材质</label>
          <input
            type="text"
            value={form.material}
            onChange={(e) => setForm({ ...form, material: e.target.value })}
            className="mt-1 block w-full rounded-md border px-3 py-2"
            placeholder="如：实验室培育钻石"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">颜色</label>
          <input
            type="text"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="mt-1 block w-full rounded-md border px-3 py-2"
            placeholder="如：D、F"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">形状/切工</label>
          <input
            type="text"
            value={form.shape}
            onChange={(e) => setForm({ ...form, shape: e.target.value })}
            className="mt-1 block w-full rounded-md border px-3 py-2"
            placeholder="如：圆形、公主方"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">尺寸/重量范围</label>
          <input
            type="text"
            value={form.sizeRange}
            onChange={(e) => setForm({ ...form, sizeRange: e.target.value })}
            className="mt-1 block w-full rounded-md border px-3 py-2"
            placeholder="如：0.9-1.1ct"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">价格区间</label>
        <input
          type="text"
          value={form.priceRange}
          onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
          className="mt-1 block w-full rounded-md border px-3 py-2"
          placeholder="如：$100 - $150 或 联系报价"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">分类</label>
        <select
          value={form.categoryId ?? ""}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value ? parseInt(e.target.value) : null })}
          className="mt-1 block w-full rounded-md border px-3 py-2"
        >
          <option value="">-- 请选择 --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">产品描述</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 block w-full rounded-md border px-3 py-2"
          rows={3}
          placeholder="详细描述..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">产品图片</label>
        {imageList.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {imageList.map((url, i) => (
              <div key={i} className="relative inline-block">
                <img src={url} alt="" className="h-16 w-16 rounded border object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white hover:bg-red-600" title="移除">×</button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <label className="cursor-pointer rounded border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm hover:bg-gray-100">
            {uploading ? "上传中…" : "本地上传"}
            <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple className="hidden" onChange={handleFileChange} disabled={uploading} />
          </label>
          <span className="text-gray-500">或</span>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrls())}
            className="flex-1 min-w-[120px] rounded border px-2 py-1.5 text-sm"
            placeholder="输入图片 URL 后按回车或点添加"
          />
          <button type="button" onClick={addUrls} className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50">添加 URL</button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">标签</label>
        <input
          type="text"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2"
          placeholder="lab, diamond, 裸石（逗号分隔）"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">状态</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as "online" | "offline" })}
          className="mt-1 block w-full rounded-md border px-3 py-2"
        >
          <option value="online">上架</option>
          <option value="offline">下架</option>
        </select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="rounded-md border px-4 py-2 hover:bg-gray-50">
          取消
        </button>
        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          保存
        </button>
      </div>
    </form>
  );
}
