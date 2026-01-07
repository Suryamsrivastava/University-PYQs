# Google OAuth Setup Guide for NextAuth.js

This guide walks you through setting up Google OAuth authentication for your Next.js application.

## Prerequisites

- Google account
- Your Next.js application running
- Access to Google Cloud Console

## Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Accept terms of service if prompted

## Step 2: Create or Select a Project

### Option A: Create New Project

1. Click the project dropdown at the top of the page
2. Click "New Project"
3. Enter project name (e.g., "University PYQ Auth")
4. Select organization if applicable
5. Click "Create"
6. Wait for project creation (30-60 seconds)
7. Select the new project from the dropdown

### Option B: Use Existing Project

1. Click the project dropdown
2. Select your existing project

## Step 3: Enable Google+ API (Required for OAuth)

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on "Google+ API" from results
4. Click **"Enable"** button
5. Wait for API to be enabled

**Alternative APIs you can use:**

- **Google Identity** (recommended for new projects)
- **People API** (for accessing user profile info)

## Step 4: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** (unless you have Google Workspace)
3. Click **"Create"**

### Fill out the OAuth consent screen:

**App Information:**

- **App name:** University PYQ Admin Panel
- **User support email:** Your email address
- **App logo:** Upload your app logo (optional, 120x120px PNG/JPG)

**App domain:**

- **Application home page:** `http://localhost:3000` (for development)
- **Application privacy policy link:** Your privacy policy URL (optional)
- **Application terms of service link:** Your terms URL (optional)

**Developer contact information:**

- **Email addresses:** Your email address

4. Click **"Save and Continue"**

## Step 5: Configure Scopes (Optional)

1. On the "Scopes" page, click **"Add or Remove Scopes"**
2. For basic authentication, you need:

   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`

3. These are usually added automatically for OAuth
4. Click **"Save and Continue"**

## Step 6: Add Test Users (For Development)

1. On "Test users" page, click **"Add Users"**
2. Add email addresses that will test your app:

   - Your email
   - Any other developers' emails
   - Test user accounts

3. Click **"Save and Continue"**
4. Click **"Back to Dashboard"**

## Step 7: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **"Create Credentials"** > **"OAuth client ID"**

### Configure OAuth Client:

**Application type:** Web application

**Name:** University PYQ Web Client

**Authorized JavaScript origins:**

```
http://localhost:3000
http://127.0.0.1:3000
```

**Authorized redirect URIs:**

```
http://localhost:3000/api/auth/callback/google
http://127.0.0.1:3000/api/auth/callback/google
```

**For Production, add:**

```
https://yourdomain.com
https://yourdomain.com/api/auth/callback/google
```

3. Click **"Create"**

## Step 8: Get Your Credentials

After creating, you'll see a popup with:

- **Client ID** (looks like: `1234567890-xxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx`)

**Important:** Copy these immediately and store them securely.

## Step 9: Add to Environment Variables

Create or update your `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=1234567890-xxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx

# Existing variables
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
```

## Step 10: Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use online generator: https://generate-secret.vercel.app/32

## Step 11: Test Your Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/login`
3. Click "Google" button
4. Should redirect to Google OAuth consent screen
5. After approval, redirects back to your app

## Production Setup

### For Vercel Deployment:

1. **Update OAuth Credentials:**

   - Go back to Google Cloud Console > Credentials
   - Edit your OAuth client
   - Add production URLs:
     ```
     https://your-app.vercel.app
     https://your-app.vercel.app/api/auth/callback/google
     ```

2. **Update Environment Variables:**

   ```env
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

3. **Publish Your App:**
   - In Google Cloud Console > OAuth consent screen
   - Click "Publish App" to make it available to all users
   - Or keep in testing mode for limited users

### For Custom Domain:

Replace `your-app.vercel.app` with your actual domain in all configurations.

## Common Issues & Troubleshooting

### Error: "redirect_uri_mismatch"

- **Cause:** Redirect URI in Google Console doesn't match NextAuth callback
- **Fix:** Ensure exact match including protocol (http/https)

### Error: "access_blocked"

- **Cause:** App not published or user not in test users list
- **Fix:** Add user to test users or publish the app

### Error: "invalid_client"

- **Cause:** Wrong Client ID or Client Secret
- **Fix:** Double-check credentials in .env.local

### Users can't sign in after testing

- **Cause:** App still in testing mode with limited users
- **Fix:** Publish the app or add more test users

### Error: "API not enabled"

- **Cause:** Google+ API or required APIs not enabled
- **Fix:** Enable required APIs in Google Cloud Console

## Security Best Practices

1. **Never commit credentials to git**
2. **Use different credentials for development/production**
3. **Regularly rotate your Client Secret**
4. **Monitor API usage in Google Cloud Console**
5. **Set up proper CORS and redirect URI restrictions**

## API Quotas & Limits

- **Default quota:** 100 requests per 100 seconds per user
- **Daily quota:** Usually sufficient for most apps
- **Monitor usage:** Google Cloud Console > APIs & Services > Quotas

If you need higher limits, you can request quota increases in the Google Cloud Console.
