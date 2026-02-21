import { NextRequest, NextResponse } from "next/server";
import { setPending, createPendingId } from "@/lib/calendar-pending";

export async function POST(request: NextRequest) {
  let body: { events?: Array<{ title: string; date: string; startTime: string; endTime: string; subject?: string }> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const events = body?.events;
  if (!Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ error: "events array required" }, { status: 400 });
  }
  const valid = events.every(
    (e) => e && typeof e.title === "string" && typeof e.date === "string" && typeof e.startTime === "string" && typeof e.endTime === "string"
  );
  if (!valid) {
    return NextResponse.json({ error: "Each event must have title, date, startTime, endTime" }, { status: 400 });
  }
  const pendingId = createPendingId();
  setPending(pendingId, events);
  return NextResponse.json({ pendingId });
}
