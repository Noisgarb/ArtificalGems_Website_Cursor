import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "./auth";
import { err, ErrorCodes } from "./api-response";

export function requireAdmin(request: Request): { userId: number; username: string; role: string } | NextResponse {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json(err(ErrorCodes.UNAUTHORIZED, "未登录或 Token 已失效"), { status: 401 });
  }
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json(err(ErrorCodes.UNAUTHORIZED, "Token 无效或已过期"), { status: 401 });
  }
  return payload;
}
