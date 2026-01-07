# GitHub OAuth Setup Guide for NextAuth.js

This guide walks you through setting up GitHub OAuth authentication for your Next.js application.

## Prerequisites

- GitHub account
- Your Next.js application running
- Admin access to a GitHub account or organization

## Step 1: Access GitHub Developer Settings

1. Go to [GitHub.com](https://github.com) and sign in
2. Click your profile picture in the top right
3. Select **"Settings"** from dropdown menu
4. Scroll down in the left sidebar to **"Developer settings"**
5. Click **"OAuth Apps"** in the left sidebar

## Step 2: Create New OAuth Application

1. Click the **"New OAuth App"** button
2. If you don't see this button, click **"Register a new application"**

## Step 3: Fill Out Application Details

### Application Information:

**Application name:**

```
University PYQ Admin Panel
```

**Homepage URL:**

```
http://localhost:3000
```

_For development. Change to your production domain later._

**Application description:** (Optional)

```
Admin panel for managing university question papers and notes with OAuth authentication.
```

**Authorization callback URL:**

```
http://localhost:3000/api/auth/callback/github
```

_This is critical - must match exactly with NextAuth.js convention_

### Important Notes:

- **Case sensitive:** URLs are case-sensitive
- **No trailing slash:** Don't add `/` at the end
- **Protocol required:** Must include `http://` or `https://`

## Step 4: Register the Application

1. Review all information
2. Click **"Register application"**
3. You'll be redirected to your new OAuth app page

## Step 5: Get Your Credentials

On the OAuth app page, you'll see:

### Client ID

- Looks like: `Iv1.a629723000043722`
- This is **public** and can be in frontend code
- Copy this value

### Client Secret

1. Click **"Generate a new client secret"**
2. You'll see a secret like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
3. **Copy immediately** - you won't see it again!
4. Store securely

### Complete Credentials Example:

```
Client ID: Iv1.a629723000043722
Client Secret: ghp_1234567890abcdefghijklmnopqrstuvwxyz1234
```

## Step 6: Configure Environment Variables

Add to your `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# GitHub OAuth
GITHUB_ID=Iv1.a629723000043722
GITHUB_SECRET=ghp_1234567890abcdefghijklmnopqrstuvwxyz1234

# Google OAuth (if using both)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Existing Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
```

## Step 7: Test Your Setup

1. Restart your development server:

   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/login`
3. Click **"GitHub"** button
4. Should redirect to GitHub OAuth authorization
5. Click **"Authorize [your-app-name]"**
6. Redirects back to your app at `/dashboard`

## Step 8: Understanding GitHub OAuth Flow

### What happens when user clicks "GitHub":

1. **Redirect to GitHub:** User goes to GitHub OAuth page
2. **User Authorization:** User sees permissions request
3. **GitHub Callback:** GitHub redirects to your callback URL
4. **Token Exchange:** NextAuth exchanges code for access token
5. **User Data:** NextAuth fetches user profile from GitHub API
6. **Session Creation:** User is logged into your app

### GitHub Permissions Requested:

By default, GitHub OAuth requests:

- **Public profile info:** username, name, avatar
- **Email addresses:** primary and verified emails

## Production Deployment Setup

### For Vercel:

1. **Update OAuth App Settings:**

   - Go back to GitHub Developer Settings
   - Select your OAuth app
   - Update **Homepage URL:** `https://your-app.vercel.app`
   - Update **Authorization callback URL:** `https://your-app.vercel.app/api/auth/callback/github`

2. **Add Environment Variables in Vercel:**
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add all your environment variables
   - Redeploy your application

### For Custom Domain:

```
Homepage URL: https://yourdomain.com
Authorization callback URL: https://yourdomain.com/api/auth/callback/github
```

## Advanced Configuration Options

### Multiple Callback URLs

GitHub allows multiple callback URLs. Add these for different environments:

```
http://localhost:3000/api/auth/callback/github
http://localhost:3001/api/auth/callback/github
https://staging.yourdomain.com/api/auth/callback/github
https://yourdomain.com/api/auth/callback/github
```

### Restricting Access by Organization

In your NextAuth configuration, you can restrict access:

```typescript
GitHubProvider({
  clientId: process.env.GITHUB_ID!,
  clientSecret: process.env.GITHUB_SECRET!,
  authorization: {
    params: {
      scope: "read:user user:email read:org",
    },
  },
});
```

Then in your callbacks:

```typescript
async signIn({ user, account, profile }) {
  if (account?.provider === "github") {
    // Check if user belongs to your organization
    const orgs = await fetch(`https://api.github.com/user/orgs`, {
      headers: {
        Authorization: `token ${account.access_token}`
      }
    }).then(res => res.json())

    const hasAccess = orgs.some(org => org.login === 'your-organization')
    return hasAccess
  }
  return true
}
```

## Common Issues & Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause:** Callback URL doesn't match GitHub OAuth app settings
**Fix:**

- Check exact URL in GitHub settings
- Ensure no typos in protocol, domain, or path
- Remove trailing slashes

### Error: "Bad verification code"

**Cause:**

- Client Secret is incorrect
- App not properly registered
  **Fix:**
- Regenerate client secret in GitHub
- Update .env.local file
- Restart development server

### Error: "The redirect_uri MUST match"

**Cause:** URL mismatch between GitHub settings and actual callback
**Fix:**

- URLs must match exactly: `http://localhost:3000/api/auth/callback/github`
- Check for extra characters, wrong ports, or missing paths

### User Profile Missing Information

**Cause:** GitHub profile privacy settings
**Fix:**

- User needs to make email public in GitHub profile
- Or request email scope explicitly
- Handle missing data gracefully in your app

### Rate Limiting Issues

**Cause:** Too many OAuth requests in short time
**Fix:**

- GitHub has generous rate limits for OAuth
- Implement proper error handling
- Cache user sessions appropriately

## Organization OAuth Apps

### For Organization-Wide Apps:

1. Go to your **Organization** → **Settings** → **Developer settings** → **OAuth Apps**
2. Create OAuth app under organization
3. This allows better control and higher rate limits
4. Members can authorize without individual approval

### Benefits:

- Higher API rate limits
- Organization-level management
- Better security controls
- Audit logs

## Security Best Practices

### Environment Security:

- Never commit `.env.local` to git
- Use different credentials for dev/staging/production
- Rotate client secrets regularly

### Application Security:

- Validate user data from GitHub API
- Don't trust client-side data
- Implement proper session management
- Use HTTPS in production

### GitHub-Specific:

- Monitor OAuth app usage in GitHub settings
- Review authorized applications regularly
- Set up webhook notifications for security events

## API Rate Limits

### GitHub OAuth Limits:

- **OAuth requests:** Very generous, rarely hit
- **API calls with access token:** 60 requests/hour for unauthenticated, 5000/hour for authenticated
- **User profile data:** Cached by NextAuth, minimal API usage

### Monitoring Usage:

- Check GitHub Developer Settings → OAuth Apps → Your App
- Monitor API rate limit headers in responses
- Implement proper caching strategies

## Webhook Integration (Advanced)

### Setting up Webhooks:

1. In OAuth app settings, add webhook URL
2. Choose events you want to monitor
3. Handle webhook events in your app

### Common Use Cases:

- User profile updates
- Organization membership changes
- Security event notifications

This completes the GitHub OAuth setup. The system will now support authentication via GitHub accounts alongside Google and traditional credentials.
