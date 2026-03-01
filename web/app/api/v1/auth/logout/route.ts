import { NextResponse } from "next/server";
import { ok } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function POST() {
  return Response.json(ok(null));
}
