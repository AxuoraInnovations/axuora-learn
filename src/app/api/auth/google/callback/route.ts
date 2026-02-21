import { NextRequest, NextResponse } from "next/server";
import { getAndDeletePending } from "@/lib/calendar-pending";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_EVENTS_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

type EventItem = { title: string; date: string; startTime: string; endTime: string; subject?: string };

async function exchangeCode(clientId: string, clientSecret: string, redirectUri: string, code: string) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || "Token exchange failed");
  }
  return res.json() as Promise<{ access_token: string; refresh_token?: string; expires_in?: number }>;
}

function toCalendarEvent(e: EventItem) {
  const [y, m, d] = e.date.split("-").map(Number);
  const [sh, sm] = e.startTime.split(":").map(Number);
  const [eh, em] = e.endTime.split(":").map(Number);
  const start = new Date(y, (m ?? 1) - 1, d ?? 1, sh ?? 9, sm ?? 0, 0);
  const end = new Date(y, (m ?? 1) - 1, d ?? 1, eh ?? 10, em ?? 0, 0);
  return {
    summary: e.title,
    start: { dateTime: start.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    end: { dateTime: end.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
  };
}

async function createCalendarEvents(accessToken: string, events: EventItem[]) {
  const created: string[] = [];
  for (const e of events) {
    const res = await fetch(CALENDAR_EVENTS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toCalendarEvent(e)),
    });
    if (res.ok) {
      const data = (await res.json()) as { id?: string };
      if (data.id) created.push(data.id);
    } else {
      const errText = await res.text();
      console.error("[Google Calendar API]", res.status, e.title, errText.slice(0, 200));
    }
  }
  return created;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state") ?? "";
  const errorParam = request.nextUrl.searchParams.get("error");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  const redirectTo = `${baseUrl}/dashboard/chat`;

  if (errorParam) {
    const errorDesc = request.nextUrl.searchParams.get("error_description") ?? errorParam;
    return NextResponse.redirect(`${redirectTo}?calendar=denied&error=${encodeURIComponent(errorDesc)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${redirectTo}?calendar=error`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(`${redirectTo}?calendar=error`);
  }

  try {
    const tokens = await exchangeCode(clientId, clientSecret, redirectUri, code);
    const events = state ? getAndDeletePending(state) : null;

    if (!events || events.length === 0) {
      console.warn("[Google Calendar callback] No pending events found for state. If using serverless, the in-memory store may not persist across requests.");
      return NextResponse.redirect(`${redirectTo}?calendar=no_events`);
    }

    if (!tokens.access_token) {
      return NextResponse.redirect(`${redirectTo}?calendar=error`);
    }

    const created = await createCalendarEvents(tokens.access_token, events);
    if (created.length > 0) {
      return NextResponse.redirect(`${redirectTo}?calendar=success&count=${created.length}`);
    }
    return NextResponse.redirect(`${redirectTo}?calendar=error`);
  } catch (err) {
    console.error("[Google Calendar callback]", err);
    return NextResponse.redirect(`${redirectTo}?calendar=error`);
  }
}
