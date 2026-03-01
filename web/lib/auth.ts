import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production";
const JWT_EXPIRES_IN = "7d";

export type TokenPayload = {
  userId: number;
  username: string;
  role: string;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function getExpiredAt(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString();
}

export async function authenticateAdmin(
  username: string,
  password: string
): Promise<{ id: number; username: string; role: string } | null> {
  const user = await prisma.adminUser.findUnique({
    where: { username },
  });
  if (!user || user.status !== "active") return null;
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;
  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
}

export function getTokenFromRequest(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}
