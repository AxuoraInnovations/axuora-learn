import { NextResponse } from "next/server";

const DEFAULT_COUNT = 0;

export const dynamic = "force-dynamic";

export async function GET() {
  const scriptUrl = process.env.WAITLIST_GOOGLE_SCRIPT_URL;
  if (scriptUrl) {
    try {
      const res = await fetch(scriptUrl, { method: "GET", cache: "no-store" }).catch((err) => {
        console.warn("[waitlist-count] Script fetch failed:", err);
        return null;
      });
      if (res?.ok) {
        const text = await res.text();
        if (text.trim().startsWith("{")) {
          const data = JSON.parse(text);
          const count = typeof data?.count === "number" ? data.count : DEFAULT_COUNT;
          console.log("[waitlist-count] Script returned count:", count);
          const out = NextResponse.json({ count });
          out.headers.set("Cache-Control", "no-store, max-age=0");
          return out;
        }
        console.warn("[waitlist-count] Script returned HTML, not JSON (check deployment: Who has access = Anyone)");
      }
      if (res && !res.ok) {
        const text = await res.text();
        console.warn("[waitlist-count] Script status", res.status, text.slice(0, 150));
      }
    } catch (e) {
      console.warn("[waitlist-count] Error:", e);
    }
  } else {
    console.warn("[waitlist-count] WAITLIST_GOOGLE_SCRIPT_URL not set");
  }
  const count = Number(process.env.WAITLIST_COUNT) || DEFAULT_COUNT;
  const out = NextResponse.json({ count });
  out.headers.set("Cache-Control", "no-store, max-age=0");
  return out;
}
