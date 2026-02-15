import { NextResponse } from "next/server";

const DEFAULT_COUNT = 0;

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const debug = searchParams.get("debug") === "1";

  const scriptUrl =
    process.env.WAITLIST_GOOGLE_SCRIPT_URL ||
    process.env.WAITLIST_SCRIPT_URL ||
    process.env.WAITLIST_URL;

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
          const body: Record<string, unknown> = { count };
          if (debug) body._hint = "ok";
          const out = NextResponse.json(body);
          out.headers.set("Cache-Control", "no-store, max-age=0");
          return out;
        }
        console.warn("[waitlist-count] Script returned HTML, not JSON (check deployment: Who has access = Anyone)");
        if (debug) {
          return NextResponse.json({
            count: DEFAULT_COUNT,
            _hint: "script_not_json",
            _preview: text.trim().slice(0, 120),
          });
        }
      }
      if (res && !res.ok) {
        const text = await res.text();
        console.warn("[waitlist-count] Script status", res.status, text.slice(0, 150));
        if (debug) {
          return NextResponse.json({ count: DEFAULT_COUNT, _hint: "script_error", _status: res.status });
        }
      }
      if (res === null && debug) {
        return NextResponse.json({ count: DEFAULT_COUNT, _hint: "script_fetch_failed" });
      }
    } catch (e) {
      console.warn("[waitlist-count] Error:", e);
      if (debug) {
        return NextResponse.json({ count: DEFAULT_COUNT, _hint: "exception" });
      }
    }
  } else {
    if (debug) {
      return NextResponse.json({ count: DEFAULT_COUNT, _hint: "url_not_set" });
    }
  }

  const count = Number(process.env.WAITLIST_COUNT) || DEFAULT_COUNT;
  const body: Record<string, unknown> = { count };
  if (debug) body._hint = "fallback";
  const out = NextResponse.json(body);
  out.headers.set("Cache-Control", "no-store, max-age=0");
  return out;
}
