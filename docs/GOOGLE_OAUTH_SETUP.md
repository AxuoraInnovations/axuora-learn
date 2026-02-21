# Google OAuth & Supabase – Step-by-step setup

Make "Continue with Google" show **"Axuora Learn"** and your logo (instead of the Supabase URL).

---

## Part 1: Brand the "Choose an account" screen (Google Cloud)

So users see **"to continue to Axuora Learn"** and your logo.

### 1.1 Open the OAuth consent screen

1. Go to **[Google Cloud Console](https://console.cloud.google.com)** and sign in.
2. Select your project **AxuoraLearn** (or the one you use for this app).
3. In the left sidebar, go to **APIs & Services** → **OAuth consent screen**.

### 1.2 Set app name and logo

1. On the **OAuth consent screen** you’ll see the app configuration. The exact layout depends on your project:
   - **If you see a form** with fields like "App name", "User support email", and "App logo" — use that form.
   - **If you see a summary** (e.g. "App information" with current name/logo) and a button such as **"EDIT APP"**, **"App information"**, or **"MAKE EXTERNAL"** (for first-time setup), click that to open the form.
   - **If the screen only shows "User type"** (Internal/External), choose **External** if you want anyone with a Google account to sign in, then continue; the next screen or section usually has the app name and logo.
2. In the app form, fill in:
   - **App name:** **`Axuora Learn`** (this is what can appear as "to continue to Axuora Learn").
   - **User support email:** pick your email from the dropdown (e.g. your Axuora email).
   - **App logo:** click **Upload** and choose your app icon (square image, e.g. 120×120 px). This shows at the top of the "Choose an account" screen.
   - **App domain** (optional): add **Homepage** `https://axuoralearn.com` and **Privacy Policy** / **Terms of Service** if you have them.
   - **Developer contact:** add your email.
3. Click **Save and Continue** (or **Save**).

### 1.3 Scopes (if asked)

1. If you see "Scopes", click **Add or remove scopes**.
2. Keep only what Supabase needs (usually **email**, **profile**, **openid**). Supabase adds these by default.
3. Click **Save and Continue**, then **Back to dashboard**.

After this, when users click "Continue with Google", the account picker should show **Axuora Learn** and your logo. It may take a short time to update.

---

## Part 2: Custom domain for redirect URL (optional)

So the redirect URL is **`https://auth.axuoralearn.com/auth/v1/callback`** instead of **`https://ezxxlcfjzhkpiquuxpho.supabase.co/auth/v1/callback`**.

### 2.1 Find “Custom Domains” in Supabase

1. Go to **[Supabase Dashboard](https://supabase.com/dashboard)** and open your project.
2. Click the **gear icon** in the left sidebar → **Project Settings**.
3. In the **Settings** sidebar, look for **Custom Domains** under **PROJECT SETTINGS** (it may be under **General** – click **General** and scroll down the main content on the right to see if “Custom domain” appears there).
4. If you don’t see **Custom Domains** anywhere, Supabase may only offer it on certain plans or regions; you can skip Part 2 and keep using **`https://ezxxlcfjzhkpiquuxpho.supabase.co/auth/v1/callback`** in Google (it works the same, just less pretty).

### 2.2 Add the custom domain in Supabase

1. On the **Custom Domains** (or **Custom domain**) page, click **Add custom domain** or **Add domain**.
2. Enter the subdomain: **`auth.axuoralearn.com`** (no `https://`, no path).
3. Supabase will show a **CNAME** record you must add in your DNS. Copy or note:
   - **Host / Name:** e.g. `auth` or `auth.axuoralearn.com`
   - **Value / Target / Points to:** e.g. `ezxxlcfjzhkpiquuxpho.supabase.co` (Supabase shows the exact value for your project).
4. Keep this page open; you’ll need these values in the next step.

### 2.3 Add the CNAME record in your DNS

1. Log in to the place where **axuoralearn.com** is managed (e.g. **Vercel**, **Cloudflare**, **Namecheap**, **GoDaddy**, or your registrar).
2. Open **DNS** (or **DNS records**, **Manage DNS**, **Domain settings**).
3. **Add a new record:**
   - **Type:** CNAME
   - **Name / Host / Subdomain:** `auth`  
     (Some providers want only `auth`, others want `auth.axuoralearn.com` – use what Supabase showed. If you enter `auth`, the full name will be `auth.axuoralearn.com`.)
   - **Value / Target / Points to / Canonical name:** the exact value from Supabase (e.g. `ezxxlcfjzhkpiquuxpho.supabase.co`). Do not add `https://` or a path.
   - **TTL:** 300 (or Auto / default).
4. **Save** the record. DNS can take 5–60 minutes to update.

### 2.4 Wait for Supabase to verify

1. In Supabase **Custom Domains**, click **Verify** or wait until the domain status is **Verified** (green).
2. If it fails, double-check the CNAME name and value, and wait a bit longer for DNS to propagate.

### 2.5 Update redirect URI in Google Cloud

1. Go to **Google Cloud Console** → **APIs & Services** → **Credentials**.
2. Open your **OAuth 2.0 Client ID** (Web application).
3. Under **Authorized redirect URIs**:
   - Remove: `https://ezxxlcfjzhkpiquuxpho.supabase.co/auth/v1/callback`
   - Add: **`https://auth.axuoralearn.com/auth/v1/callback`**
4. Click **Save**.

### 2.6 Tell Supabase to use the custom domain (if required)

1. In Supabase, go to **Authentication** → **URL Configuration**.
2. If there is a **Redirect URL** or **Site URL** that still uses `*.supabase.co`, update it to use **`https://axuoralearn.com`** where users should land after login. The **callback** itself will be `https://auth.axuoralearn.com/auth/v1/callback` (handled by Supabase when you use the custom domain).
3. Save.

Your app code does **not** need to change: Supabase will serve auth on the custom domain once it’s set and verified.

---

## Quick checklist

**Part 1 (branding):**

- [ ] OAuth consent screen → App name = **Axuora Learn**
- [ ] App logo uploaded
- [ ] User support email and developer contact set
- [ ] Saved

**Part 2 (custom domain, optional):**

- [ ] Custom domain added in Supabase (e.g. `auth.axuoralearn.com`)
- [ ] CNAME added in DNS
- [ ] Domain verified in Supabase
- [ ] Google Cloud redirect URI updated to `https://auth.axuoralearn.com/auth/v1/callback`
- [ ] Saved in Google Cloud

After both parts, "Continue with Google" should show **Axuora Learn** and your logo, and the redirect URL will be clean.
