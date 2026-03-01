import { NextRequest } from "next/server";
import { ok, err, ErrorCodes } from "@/lib/api-response";
import {
  authenticateAdmin,
  signToken,
  getExpiredAt,
} from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        err(ErrorCodes.VALIDATION, "用户名和密码不能为空"),
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    const user = await authenticateAdmin(username, password);
    if (!user) {
      return Response.json(
        err(ErrorCodes.UNAUTHORIZED, "用户名或密码错误"),
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });
    const expiredAt = getExpiredAt();

    return Response.json(
      ok({
        token,
        expiredAt,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      })
    );
  } catch (e) {
    console.error(e);
    return Response.json(err(ErrorCodes.INTERNAL, "服务器错误"), {
      status: 500,
    });
  }
}
