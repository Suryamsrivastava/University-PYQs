# Environment Variables for OAuth Authentication

Add these environment variables to your `.env.local` file:

## NextAuth Configuration

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. For production: `https://yourdomain.com/api/auth/callback/google`

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## GitHub OAuth

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. For production: `https://yourdomain.com/api/auth/callback/github`

```env
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

## Existing Admin Credentials

```env
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-admin-password
```

## Complete .env.local Example

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

## Production Setup

For production deployment, update:

- `NEXTAUTH_URL` to your production domain
- OAuth callback URLs in Google/GitHub settings
- Use strong, unique `NEXTAUTH_SECRET` (you can generate one at https://generate-secret.now.sh/32)
