import { NextResponse } from "next/server";

const WAITLIST_GOOGLE_SCRIPT_URL =
  process.env.WAITLIST_GOOGLE_SCRIPT_URL ||
  process.env.WAITLIST_SCRIPT_URL ||
  process.env.WAITLIST_URL;

// When a user joins the waitlist, this endpoint is called.
// If WAITLIST_GOOGLE_SCRIPT_URL is set, we forward the email to your Google Apps Script,
// which can append it to a Sheet and send a thank-you email (see docs/WAITLIST_GOOGLE_SETUP.md).
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : null;
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (WAITLIST_GOOGLE_SCRIPT_URL) {
      const res = await fetch(WAITLIST_GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch((err: unknown) => {
        console.error("[waitlist] Google Script fetch failed:", err);
        return null;
      });
      // Don’t fail the request if the script fails (e.g. quota, network)
      if (res) {
        const text = await res.text();
        if (!res.ok) {
          console.warn("[waitlist] Google Script returned", res.status, text.slice(0, 200));
        } else {
          console.log("[waitlist] Google Script OK", text.slice(0, 100));
        }
      }
    } else {
      console.warn("[waitlist] No waitlist script URL env set");
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
