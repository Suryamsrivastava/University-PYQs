# 🚀 QUICK DEPLOYMENT CHECKLIST

## ✅ What's Fixed

### Backend Changes:

- ✅ Increased file size limit to 10MB (from 4.5MB)
- ✅ Fixed Cloudinary upload method (using base64 with `resource_type: 'raw'`)
- ✅ Added comprehensive error handling and logging
- ✅ Set 120s timeout for large file uploads
- ✅ Fixed Next.js config for App Router
- ✅ Added Cloudinary test endpoint

### Files Modified:

1. `src/app/api/files/upload/route.ts` - Enhanced with logging & error handling
2. `src/lib/cloudinary.ts` - Fixed upload method & error messages
3. `next.config.js` - Removed deprecated config
4. `src/app/api/cloudinary/test/route.ts` - New test endpoint

## 📋 Deployment Steps

### Step 1: Set Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables for **ALL environments** (Production, Preview, Development):

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGODB_URI=your_mongodb_uri
```

**⚠️ Important:**

- No quotes around values
- No extra spaces
- Must be EXACT values from Cloudinary console

**Where to find Cloudinary values:**

- Login: https://cloudinary.com/console
- Cloud Name: Top left of dashboard
- API Key/Secret: https://cloudinary.com/console/settings/security

### Step 2: Deploy to Vercel

```bash
# Commit all changes
git add .
git commit -m "Fix PDF uploads for Vercel deployment"
git push

# Or trigger manual deployment in Vercel dashboard
```

### Step 3: Test After Deployment

#### A. Test Cloudinary Connection

Visit: `https://your-app.vercel.app/api/cloudinary/test`

**✅ Expected (Success):**

```json
{
  "success": true,
  "message": "Cloudinary credentials are valid and working!",
  "cloudName": "your-cloud-name"
}
```

**❌ If you see error:**

- Check environment variables in Vercel
- Make sure you redeployed after adding env vars
- Verify credentials at https://cloudinary.com/console

#### B. Test File Upload

1. Go to: `https://your-app.vercel.app/dashboard/upload`
2. Upload a small PDF (< 2MB) first
3. Check Vercel Function logs for any errors
4. Try larger files (5-10MB) if small files work

### Step 4: Check Logs

**In Vercel Dashboard:**

1. Go to your deployment
2. Click "Functions" tab
3. Find `/api/files/upload`
4. Check for these log messages:

**Success indicators:**

```
✓ Cloudinary config loaded
📤 Starting Cloudinary upload
✅ Upload successful
```

**Error indicators:**

```
❌ Missing Cloudinary configuration
❌ Cloudinary upload failed
❌ AUTHENTICATION FAILED
```

## 🔍 Troubleshooting

### Issue: "Invalid JSON" or "500 Error"

**Problem:** Wrong CLOUDINARY_CLOUD_NAME or credentials  
**Fix:**

1. Double-check cloud name (case-sensitive!)
2. Copy fresh credentials from https://cloudinary.com/console/settings/security
3. Redeploy after updating

### Issue: "Authentication Failed"

**Problem:** Wrong API_KEY or API_SECRET  
**Fix:**

1. Go to https://cloudinary.com/console/settings/security
2. Copy the EXACT API Key and API Secret
3. Update in Vercel → Redeploy

### Issue: "Configuration incomplete"

**Problem:** Environment variables not set in Vercel  
**Fix:**

1. Vercel → Settings → Environment Variables
2. Add all 3 Cloudinary variables
3. Make sure they're added to Production environment
4. Click "Redeploy" button

### Issue: Works locally but not on Vercel

**Problem:** Env vars not configured in Vercel  
**Fix:**

1. Local .env file is NOT used on Vercel
2. Must set variables in Vercel dashboard
3. Must redeploy after adding variables

### Issue: "File too large"

**Current limit:** 10MB  
**Fix:** Compress PDF or split into smaller files

### Issue: Upload timeout

**Problem:** File too large or slow connection  
**Fix:**

1. Try smaller file first (< 2MB)
2. Check internet connection
3. Compress PDF if > 5MB

## 📊 Vercel Configuration (Already Set)

Your `vercel.json` is configured with:

- ✅ Max duration: 60 seconds
- ✅ Memory: 3008MB
- ✅ Proper CORS headers

## 🎯 Key Points

1. **Local vs Production:**

   - Local uses `.env.local` file
   - Vercel uses environment variables from dashboard
   - They are SEPARATE - must set both!

2. **After changing env vars:**

   - Must click "Redeploy" or push new commit
   - Changes don't apply to existing deployment

3. **File size limits:**

   - Frontend shows 10MB limit
   - Backend enforces 10MB limit
   - Cloudinary free tier: 10MB max
   - Vercel serverless: We bypass the 4.5MB limit by streaming

4. **Cloudinary resource_type:**
   - Set to `'raw'` for PDFs (not `'auto'`)
   - Critical for document uploads

## ✨ Success Criteria

✅ Test endpoint returns success  
✅ Can upload small PDF (< 2MB)  
✅ Can upload larger PDF (5-10MB)  
✅ Files visible in Cloudinary dashboard  
✅ Files saved to MongoDB  
✅ No errors in Vercel logs

## 🆘 Still Having Issues?

1. Run the test endpoint first: `/api/cloudinary/test`
2. Check Vercel function logs for specific errors
3. Verify all 3 Cloudinary env vars are set
4. Make sure you redeployed after setting env vars
5. Try uploading a very small file (< 1MB) first
6. Check Cloudinary dashboard for account status

## 📞 Quick Links

- **Cloudinary Console:** https://cloudinary.com/console
- **Cloudinary Settings:** https://cloudinary.com/console/settings/account
- **Cloudinary Security:** https://cloudinary.com/console/settings/security
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Test Endpoint:** `https://your-app.vercel.app/api/cloudinary/test`
