import { NextRequest } from "next/server";
import { ok, err, ErrorCodes } from "@/lib/api-response";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json(
        err(ErrorCodes.UNAUTHORIZED, "未登录或 Token 已失效"),
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return Response.json(
        err(ErrorCodes.UNAUTHORIZED, "Token 无效或已过期"),
        { status: 401 }
      );
    }

    return Response.json(
      ok({
        id: payload.userId,
        username: payload.username,
        role: payload.role,
      })
    );
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), {
      status: 500,
    });
  }
}
