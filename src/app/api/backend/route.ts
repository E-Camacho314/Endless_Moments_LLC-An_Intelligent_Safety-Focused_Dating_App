import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const target = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  const path = req.nextUrl.searchParams.get("path") || "/health";
  const res = await fetch(target + path, { method: "GET" });
  const data = await res.text();
  return new Response(data, { status: res.status, headers: { "content-type": res.headers.get("content-type") || "application/json" } });
}

export async function POST(req: NextRequest) {
  const target = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  const path = req.nextUrl.searchParams.get("path") || "/health";
  const body = await req.text();
  const res = await fetch(target + path, { method: "POST", body, headers: { "content-type": req.headers.get("content-type") || "application/json" } });
  const data = await res.text();
  return new Response(data, { status: res.status, headers: { "content-type": res.headers.get("content-type") || "application/json" } });
}
