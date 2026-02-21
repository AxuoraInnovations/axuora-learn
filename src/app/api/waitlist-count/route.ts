import { NextResponse } from "next/server";

const WAITLIST_SCRIPT_URL =
  process.env.WAITLIST_GOOGLE_SCRIPT_URL || process.env.WAITLIST_URL;

export async function GET() {
  if (!WAITLIST_SCRIPT_URL) {
    return NextResponse.json({ count: 0 });
  }

  try {
    const base = WAITLIST_SCRIPT_URL.replace(/\/$/, "");
    const url = base.endsWith("/exec") ? base : base + "/exec";
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("Waitlist count script error:", res.status, text);
      return NextResponse.json({ count: 0 });
    }

    let data: { count?: number } = {};
    try {
      data = JSON.parse(text);
    } catch {
      const n = parseInt(text.trim(), 10);
      if (!Number.isNaN(n) && n >= 0) return NextResponse.json({ count: n });
      return NextResponse.json({ count: 0 });
    }

    const count = typeof data.count === "number" ? data.count : Number(data.count) || 0;
    return NextResponse.json({ count });
  } catch (e) {
    console.error("Waitlist count API error:", e);
    return NextResponse.json({ count: 0 });
  }
}
