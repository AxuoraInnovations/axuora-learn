import { NextResponse } from "next/server";

/**
 * GET /api/auth/google/check
 * Returns the redirect URI the app would send to Google. Use this to verify
 * it exactly matches one of your Authorized redirect URIs in Google Cloud Console.
 */
export async function GET() {
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI ?? null;
  const hasClientId = Boolean(process.env.GOOGLE_CLIENT_ID);
  return NextResponse.json({
    redirectUri,
    hasClientId,
    message: redirectUri
      ? "Compare the redirectUri above with Authorized redirect URIs in Google Cloud Console. They must match exactly (no trailing slash, same protocol/host/port)."
      : "GOOGLE_CALENDAR_REDIRECT_URI is not set. Add it to .env.local and restart the dev server.",
  });
}
