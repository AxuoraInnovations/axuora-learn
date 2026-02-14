// AxuoraLearn Waitlist - paste your Sheet link or ID in SHEET_ID_OR_LINK below
// Deploy as Web app (Execute as Me, Anyone) and put the URL in .env.local

var SHEET_ID_OR_LINK = "https://docs.google.com/spreadsheets/d/17N5UK32dx3qhy_Mc9x1orLOWaWrXebI_CYRjcAcpqVg/edit?usp=sharing";

function getSheetId() {
  var s = (SHEET_ID_OR_LINK || "").trim();
  var match = /\/d\/([a-zA-Z0-9-_]+)/.exec(s);
  return match ? match[1] : s;
}

// ========== PART 1: WAITLIST COUNT (hero page "Join X others") ==========
// When your site calls this URL with GET, it returns { count: N }.
function doGet() {
  var result = { count: 0 };
  try {
    var spreadsheet = SpreadsheetApp.openById(getSheetId());
    var sheet = spreadsheet.getSheets()[0];
    var lastRow = sheet.getLastRow();
    // Row 1 is header (Email, Joined at), so count = data rows
    result.count = Math.max(0, lastRow > 0 ? lastRow - 1 : 0);
  } catch (err) {
    result.error = err.message || "Unknown error";
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========== PART 2: SIGNUP + SEND THANK YOU EMAIL ==========
// When someone joins the waitlist, your site POSTs here. We add a row and email them.
function doPost(e) {
  var result = { success: false, error: null };
  try {
    var body = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var data = JSON.parse(body);
    var email = (data.email || "").trim().toLowerCase();

    if (!email) {
      result.error = "Email is required";
      return createJsonResponse(result, 400);
    }

    var spreadsheet = SpreadsheetApp.openById(getSheetId());
    var sheet = spreadsheet.getSheets()[0];
    var headers = sheet.getRange(1, 1, 1, 2).getValues()[0];
    var hasHeaders = headers[0] && String(headers[0]).length > 0;

    if (!hasHeaders) {
      sheet.getRange(1, 1, 1, 2).setValues([["Email", "Joined at"]]);
      sheet.getRange(1, 1, 1, 2).setFontWeight("bold");
    }

    sheet.appendRow([email, new Date()]);

    var subject = "You're on the list — AxuoraLearn Waitlist";
    var htmlBody = getThankYouEmailBody(email);
    GmailApp.sendEmail(email, subject, "", { htmlBody: htmlBody });

    result.success = true;
    return createJsonResponse(result, 200);
  } catch (err) {
    result.error = err.message || "Unknown error";
    return createJsonResponse(result, 500);
  }
}

function createJsonResponse(obj, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getThankYouEmailBody(email) {
  return (
    '<div style="font-family: system-ui, sans-serif; max-width: 520px;">' +
    '<h2 style="color: #0F62FE;">Thank you for joining the waitlist</h2>' +
    '<p>Hi there,</p>' +
    '<p><strong>Your seat is confirmed on the AxuoraLearn waitlist.</strong></p>' +
    '<p>We\'re building an AI-powered exam prep platform — with predictive exam questions, Full Marks Analyzer, and step-by-step breakdowns. Built by teens, for teens.</p>' +
    '<p>We\'ll email you when AxuoraLearn is live.</p>' +
    '<p>— The AxuoraLearn team</p>' +
    '<p style="font-size: 12px; color: #6b7280;">You signed up with ' + escapeHtml(email) + '.</p>' +
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
