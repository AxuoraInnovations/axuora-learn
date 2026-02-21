import { NextResponse } from "next/server";

const WAITLIST_SCRIPT_URL =
  process.env.WAITLIST_GOOGLE_SCRIPT_URL || process.env.WAITLIST_URL;

export async function POST(request: Request) {
  if (!WAITLIST_SCRIPT_URL) {
    console.error("Waitlist: WAITLIST_GOOGLE_SCRIPT_URL (or WAITLIST_URL) not set");
    return NextResponse.json(
      { success: false, message: "Waitlist not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : null;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Valid email is required" },
        { status: 400 }
      );
    }

    const base = WAITLIST_SCRIPT_URL.replace(/\/$/, "");
    const url = base.endsWith("/exec") ? base : base + "/exec";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("Waitlist script error:", res.status, text);
      return NextResponse.json(
        { success: false, message: "Failed to join waitlist" },
        { status: 502 }
      );
    }

    let data: { success?: boolean; message?: string } = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: true };
    }
    return NextResponse.json({
      success: data.success !== false,
      message: data.message ?? "Added to waitlist",
    });
  } catch (e) {
    console.error("Waitlist API error:", e);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
