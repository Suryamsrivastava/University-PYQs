# Vercel PDF Upload Configuration Guide

## ✅ What's Been Fixed

1. **Increased file size limit** from 4.5MB to 10MB
2. **Fixed Cloudinary configuration** for serverless environment
3. **Added proper error handling** with detailed logging
4. **Configured timeout** (120 seconds for large files)
5. **Fixed resource_type** to 'raw' for PDFs
6. **Updated Next.js config** for App Router

## 🔧 Required Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables and add:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
MONGODB_URI=your-mongodb-connection-string
```

### Where to find these values:

1. **Cloudinary Credentials:**

   - Login to https://cloudinary.com/console
   - Cloud Name: Top left corner
   - API Key & Secret: https://cloudinary.com/console/settings/security

2. **MongoDB URI:**
   - From your MongoDB Atlas dashboard

### Important Notes:

- ✅ Add variables to **ALL environments** (Production, Preview, Development)
- ✅ **Redeploy after adding** environment variables
- ✅ No quotes needed in Vercel environment variables
- ✅ Trim any extra spaces

## 📝 Deployment Steps

1. **Commit your changes:**

   ```bash
   git add .
   git commit -m "Fix PDF uploads for Vercel"
   git push
   ```

2. **Verify environment variables** in Vercel dashboard

3. **Trigger a new deployment** or wait for auto-deploy

4. **Test the upload** after deployment

## 🧪 Testing Your Setup

### Test Cloudinary Connection:

```
https://your-app.vercel.app/api/cloudinary/test
```

Expected response if working:

```json
{
  "success": true,
  "message": "Cloudinary credentials are valid and working!",
  "cloudName": "your-cloud-name"
}
```

### Test File Upload:

Use your upload form or test with curl:

```bash
curl -X POST https://your-app.vercel.app/api/files/upload \
  -F "file=@test.pdf" \
  -F "collegeName=Test College" \
  -F "courseName=Computer Science" \
  -F "year=2024" \
  -F "branch=Main" \
  -F "fileType=PYQ" \
  -F "semester=1" \
  -F "paperType=Theory"
```

## 🐛 Common Issues & Solutions

### Issue 1: "Invalid JSON" or "500 Error"

**Cause:** Wrong CLOUDINARY_CLOUD_NAME or credentials
**Solution:**

- Double-check cloud name spelling (case-sensitive)
- Verify credentials at https://cloudinary.com/console/settings/security
- Make sure to redeploy after updating env vars

### Issue 2: "Upload Timeout"

**Cause:** File too large or slow connection
**Solution:**

- Keep PDFs under 10MB
- Optimize/compress PDF before upload
- Increase timeout in vercel.json (already set to 60s)

### Issue 3: "All fields are required"

**Cause:** Missing form data
**Solution:** Ensure all fields are sent in the form data

### Issue 4: Works locally but not on Vercel

**Cause:** Environment variables not set in Vercel
**Solution:**

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add all required variables
3. Click "Redeploy" button

### Issue 5: "Configuration incomplete"

**Cause:** Missing Cloudinary env variables
**Solution:** Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to Vercel

## 📊 Vercel Limits

- **Free tier:** 4.5MB body size limit (we use streaming to bypass)
- **Hobby tier:** Same limits
- **Pro tier:** 4.5MB request body, but we stream to Cloudinary
- **Function timeout:** 10s (Free), 60s (Configured in vercel.json)
- **Function memory:** 3008MB (Configured in vercel.json)

## ✨ File Size Recommendations

- **Optimal:** Under 5MB for fast uploads
- **Maximum:** 10MB (configured limit)
- **For larger files:** Consider compressing PDFs or using direct Cloudinary upload widget

## 🔍 Debugging

Check Vercel logs:

1. Go to Vercel Dashboard
2. Click on your deployment
3. Click "Functions" tab
4. Find `/api/files/upload`
5. Check the logs for errors

Look for these log messages:

- ✅ `✓ Cloudinary config loaded` - Config working
- 📤 `📤 Starting Cloudinary upload` - Upload starting
- ✅ `✅ Upload successful` - Upload completed
- ❌ Any error messages with specific details

## 📞 Need Help?

If issues persist:

1. Check the function logs in Vercel
2. Test the `/api/cloudinary/test` endpoint
3. Verify all environment variables are set
4. Make sure you redeployed after adding env vars
5. Check Cloudinary dashboard for account status
