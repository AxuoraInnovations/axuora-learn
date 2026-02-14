/**
 * AxuoraLearn Waitlist – Google Apps Script
 *
 * Paste this into Extensions → Apps Script in your Google Sheet.
 * Deploy as Web app (Execute as: Me, Who has access: Anyone).
 * Use the deployment URL in .env as WAITLIST_GOOGLE_SCRIPT_URL.
 *
 * This script:
 * 1. Appends the signup email + timestamp to the current sheet.
 * 2. Sends a thank-you email to the user confirming their seat on the waitlist.
 */

function doPost(e) {
  const result = { success: false, error: null };
  try {
    const body = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    const data = JSON.parse(body);
    const email = (data.email || "").trim().toLowerCase();

    if (!email) {
      result.error = "Email is required";
      return createJsonResponse(result, 400);
    }

    // 1. Append to this spreadsheet (first sheet)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const headers = sheet.getRange(1, 1, 1, 2).getValues()[0];
    const hasHeaders = headers[0] && String(headers[0]).length > 0;

    if (!hasHeaders) {
      sheet.getRange(1, 1, 1, 2).setValues([["Email", "Joined at"]]);
      sheet.getRange(1, 1, 1, 2).setFontWeight("bold");
    }

    const row = [email, new Date()];
    sheet.appendRow(row);

    // 2. Send thank-you email
    const subject = "You're on the list — AxuoraLearn Waitlist";
    const htmlBody = getThankYouEmailBody(email);
    GmailApp.sendEmail(email, subject, "", { htmlBody: htmlBody });

    result.success = true;
    return createJsonResponse(result, 200);
  } catch (err) {
    result.error = err.message || "Unknown error";
    return createJsonResponse(result, 500);
  }
}

function createJsonResponse(obj, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Customize the thank-you email here.
 * Use HTML for links and formatting.
 */
function getThankYouEmailBody(email) {
  return (
    '<div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto;">' +
    '<h2 style="color: #0F62FE;">Thank you for joining the waitlist</h2>' +
    '<p>Hi there,</p>' +
    '<p><strong>Your seat is confirmed on the AxuoraLearn waitlist.</strong></p>' +
    '<p>We\'re building an AI-powered exam prep platform to help you speed up your preparation — with predictive exam questions, a Full Marks Analyzer, and step-by-step breakdowns. Built by teens, for teens.</p>' +
    '<p>We\'ll email you as soon as AxuoraLearn is live so you can be among the first to try it.</p>' +
    '<p>Until then, stay sharp — and we\'ll see you in the app.</p>' +
    '<p style="margin-top: 28px;">— The AxuoraLearn team</p>' +
    '<p style="margin-top: 16px; font-size: 12px; color: #6b7280;">You signed up with ' +
    escapeHtml(email) +
    '.</p>' +
    "</div>"
  );
}

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
