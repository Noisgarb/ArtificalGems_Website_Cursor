import { NextRequest } from "next/server";
import { ok, err, ErrorCodes } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-admin";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function getExt(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
  };
  return map[mime] ?? ".jpg";
}

export async function POST(request: NextRequest) {
  const admin = requireAdmin(request);
  if (admin instanceof Response) return admin;
  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];
    if (!files.length) {
      return Response.json(err(ErrorCodes.VALIDATION, "请选择要上传的文件"), { status: 400 });
    }
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const urls: string[] = [];
    for (const file of files) {
      if (!file.size || !file.type) continue;
      if (!ALLOWED_TYPES.includes(file.type)) {
        return Response.json(err(ErrorCodes.VALIDATION, "仅支持 JPG/PNG/GIF/WebP 图片"), { status: 400 });
      }
      if (file.size > MAX_SIZE) {
        return Response.json(err(ErrorCodes.VALIDATION, "单张图片不超过 5MB"), { status: 400 });
      }
      const ext = getExt(file.type);
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
      const filePath = path.join(uploadDir, name);
      const buf = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buf);
      urls.push(`/uploads/${name}`);
    }
    return Response.json(ok({ urls }));
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "上传失败"), { status: 500 });
  }
}
