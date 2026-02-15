# Waitlist: Google Sheet + Thank You Email

When someone joins the waitlist, the app can:

1. **Save their email** (and timestamp) to a Google Sheet.
2. **Send a thank-you email** from your Gmail saying their seat is confirmed on the AxuoraLearn waitlist.

This is done via a **Google Apps Script** web app. Your Next.js API forwards the signup to that script; the script writes to the sheet and sends the email.

---

## 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet (e.g. “AxuoraLearn Waitlist”).
2. In the first row, add headers, for example:
   - **A1:** `Email`
   - **B1:** `Joined at`

---

## 2. Add the Apps Script

1. In the sheet, open **Extensions → Apps Script**.
2. Delete any sample code and paste the contents of **`waitlist-google-apps-script.js`** (in this folder).
3. Save the project (e.g. name it “Waitlist Web App”).

---

## 3. Deploy as a web app

1. In the Apps Script editor: **Deploy → New deployment**.
2. Click the gear icon next to “Select type” and choose **Web app**.
3. Set:
   - **Description:** e.g. “Waitlist endpoint”
   - **Execute as:** **Me** (your Google account)
   - **Who has access:** **Anyone**
4. Click **Deploy**.
5. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/.../exec`). You’ll use this in the Next.js env.

---

## 4. Authorize the script (first run)

1. Run the script once from the editor: select the function **`doPost`** (or the name you gave the POST handler) and click **Run**.
2. When prompted, **Review permissions** → choose your Google account → **Advanced** → **Go to … (unsafe)** → **Allow**.
3. The first run may “fail” because no POST body was sent; that’s fine. The important part is that permissions are granted for the next deployment.

---

## 5. Configure Next.js

Add this to your `.env.local` **and** to your **Vercel** project (Settings → Environment Variables):

```bash
WAITLIST_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Use the **exact** Web app URL you copied in step 3.

- **Local:** Restart the dev server after changing env.
- **Vercel:** If you don’t add this variable in Vercel, the live site will show **0** for “Join … others on the waitlist” and signups won’t be saved to the sheet. Add it for Production (and Preview if you want), then redeploy.

---

## 6. Optional: customize the thank-you email

In the Apps Script, edit the **`getThankYouEmailBody`** function to change the subject and HTML body of the confirmation email (e.g. add your logo link, social links, or different wording).

---

## How it works

1. **Count on homepage:** Next.js `GET /api/waitlist-count` calls your Apps Script with a **GET** request. The script's `doGet()` returns `{ "count": N }` (number of signups). The "Join … others on the waitlist" number uses this. Add **`doGet`** to your script (see `waitlist-google-apps-script.js`) and set **`WAITLIST_GOOGLE_SCRIPT_URL` in Vercel**, or the live site will always show 0.
2. **Signup:** User submits their email on the waitlist page.
2. Next.js `POST /api/waitlist` receives it and, if `WAITLIST_GOOGLE_SCRIPT_URL` is set, sends a POST request to your Apps Script URL with `{ "email": "user@example.com" }`.
3. The Apps Script:
   - Appends a new row to the sheet: `[email, timestamp]`.
   - Sends a thank-you email to that address from your Gmail with the “seat confirmed” message.

If the script URL is not set, signups still return success; they just aren’t recorded in the sheet and no email is sent.
