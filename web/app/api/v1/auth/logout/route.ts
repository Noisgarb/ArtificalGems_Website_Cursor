import { NextResponse } from "next/server";
import { ok } from "@/lib/api-response";

export async function POST() {
  return Response.json(ok(null));
}
