# 🔍 DEBUGGING GUIDE - Vercel Deployment Issues

## Current Issues
1. ❌ File uploads failing on Vercel (works locally)
2. ❌ College dropdown not showing institutions

## 🚀 DEPLOY UPDATED CODE

```bash
git add .
git commit -m "Add comprehensive logging for Vercel debugging"
git push
```

**Wait for deployment to complete, then follow the steps below.**

---

## 📊 Step 1: Test Environment Variables

Visit this endpoint FIRST to check if all variables are set:

```
https://your-app.vercel.app/api/test-env
```

### ✅ Expected (Good):
```json
{
  "success": true,
  "message": "✅ All required environment variables are set!",
  "details": {
    "cloudinary": {
      "CLOUDINARY_CLOUD_NAME": { "exists": true, "value": "your-cloud-name" },
      "CLOUDINARY_API_KEY": { "exists": true, "preview": "12345678***" },
      "CLOUDINARY_API_SECRET": { "exists": true, "preview": "abcd***" }
    }
  }
}
```

### ❌ If Variables Missing:
```json
{
  "success": false,
  "message": "❌ Some required environment variables are missing!",
  "instructions": { ... }
}
```

**If missing:** Go to Vercel → Settings → Environment Variables → Add them → Redeploy

---

## 📝 Step 2: Check Detailed Logs

### For File Upload Issue:

1. Try uploading a file on your site
2. Go to: **Vercel Dashboard → Your Deployment → Functions**
3. Click on `/api/files/upload`
4. Look for these specific log messages:

#### 🔍 What to Look For:

**A. Environment Variables Check:**
```
🔍 CLOUDINARY ENV VARS CHECK:
  CLOUDINARY_CLOUD_NAME: "your-cloud-name"
  CLOUDINARY_API_KEY: 12345678***
  CLOUDINARY_API_SECRET: abcd***
```

**B. File Processing:**
```
📄 File details:
  Original name: test.pdf
  MIME type: application/pdf
  Buffer size: 123456 bytes
```

**C. Cloudinary API Call:**
```
🌐 Cloudinary API Details:
  Endpoint: https://api.cloudinary.com/v1_1/YOUR-CLOUD-NAME/raw/upload
  Cloud Name: YOUR-CLOUD-NAME
```

**D. The Error:**
Look for the exact error message. It will show:
- `❌ WRONG CLOUDINARY_CLOUD_NAME` - Cloud name doesn't exist
- `❌ Authentication failed` - Wrong API key/secret
- `❌ Account suspended` - Account issue

---

### For Dropdown Issue:

1. Go to your upload page
2. Open browser DevTools (F12) → Console tab
3. Check Vercel function logs for: `/api/colleges/dropdown`

#### 🔍 What to Look For:

```
📊 DROPDOWN API: Total colleges in database: X
📊 DROPDOWN API: Active colleges found: Y
📋 DROPDOWN API: Active colleges data: [...]
```

**If colleges = 0:**
- No colleges added to database yet
- Go to `/dashboard/institutions` and add colleges

**If colleges > 0 but dropdown empty:**
- Check browser console for JavaScript errors
- Check if `SearchableDropdown` component is working

---

## 🐛 Common Issues & Solutions

### Issue 1: "CLOUDINARY_CLOUD_NAME: ❌ NOT SET"
**Problem:** Environment variable not set in Vercel
**Solution:**
1. Go to: Vercel → Your Project → Settings → Environment Variables
2. Click "Add New"
3. Name: `CLOUDINARY_CLOUD_NAME`
4. Value: Your exact cloud name (get from https://cloudinary.com/console)
5. Select: **Production** (important!)
6. Click "Save"
7. Click **"Redeploy"** button

### Issue 2: "WRONG CLOUDINARY_CLOUD_NAME"
**Problem:** Cloud name is incorrect (doesn't exist on Cloudinary)
**Solution:**
1. Go to: https://cloudinary.com/console
2. Look at **top-left corner** - that's your exact cloud name
3. It's **case-sensitive** and must match exactly
4. Update in Vercel → Redeploy

### Issue 3: "Authentication failed"
**Problem:** API_KEY or API_SECRET is wrong
**Solution:**
1. Go to: https://cloudinary.com/console/settings/security
2. Copy the **exact** API Key and API Secret
3. Update in Vercel:
   - `CLOUDINARY_API_KEY` = [your key]
   - `CLOUDINARY_API_SECRET` = [your secret]
4. Redeploy

### Issue 4: Dropdown shows 0 colleges
**Problem:** No colleges in database
**Solution:**
1. Go to: `https://your-app.vercel.app/dashboard/institutions`
2. Add at least one college
3. Make sure to check "Active" checkbox
4. Save
5. Refresh the upload page

### Issue 5: Works locally but not on Vercel
**Problem:** Local uses `.env.local`, Vercel uses dashboard variables
**Solution:**
- These are **separate** - you must set both!
- Local: `.env.local` file in your project
- Vercel: Dashboard → Settings → Environment Variables
- They must have the **same values**

---

## 📸 What the Logs Will Show

After deploying the updated code, the logs will be VERY detailed:

### Success Flow:
```
========================================
📥 UPLOAD API CALLED
========================================
⏰ Timestamp: 2025-12-23T...
🌍 Environment: production

🔍 CLOUDINARY ENV VARS CHECK:
  CLOUDINARY_CLOUD_NAME: "your-cloud-name"
  CLOUDINARY_API_KEY: 12345678***
  CLOUDINARY_API_SECRET: abcd***

🔗 Step 1: Connecting to MongoDB...
✅ MongoDB connected successfully

📋 Step 2: Parsing form data...
✅ Form data parsed

📝 Form Fields Received:
  File: "test.pdf" (123456 bytes)
  College: Test College
  Course: CS
  ...

☁️ Step 5: Uploading to Cloudinary...
🌐 Will POST to: https://api.cloudinary.com/v1_1/your-cloud/raw/upload

✅✅✅ CLOUDINARY UPLOAD SUCCESS! ✅✅✅
  Public ID: 1234567890-test_pdf
  Secure URL: https://res.cloudinary.com/...

🎉 SUCCESS! Upload complete
```

### Error Flow:
```
❌❌❌ CLOUDINARY UPLOAD FAILED! ❌❌❌
┌─────────────────────────────────────
│ Error Details:
├─────────────────────────────────────
│ Message: Server return invalid JSON...
│ HTTP Code: 500
└─────────────────────────────────────

🚨 DIAGNOSIS: Cloudinary returned HTML error page
This means ONE of these problems:

1. ❌ WRONG CLOUD_NAME (most likely!)
   - You used: "wrong-name"
   - This name does NOT exist on Cloudinary
   ✅ FIX: Go to https://cloudinary.com/console
```

---

## ✅ Quick Checklist

Before testing:
- [ ] Deployed updated code with logging
- [ ] All 4 env vars set in Vercel (Production)
- [ ] Clicked "Redeploy" after setting variables
- [ ] Cloud name matches exactly (check Cloudinary console)
- [ ] Using fresh API credentials
- [ ] At least one active college in database

---

## 🆘 Still Not Working?

1. **Test env endpoint first:** `/api/test-env`
2. **Check Vercel function logs** for the detailed error
3. **Copy the EXACT error message** from logs
4. **Check which step failed** (Step 1-7 in upload logs)
5. **Verify cloud name** at https://cloudinary.com/console (top-left)

The new logs will pinpoint EXACTLY where the issue is!
