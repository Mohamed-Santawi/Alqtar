# Vercel Deployment Guide for Firebase API

## 🚀 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your Git repository
4. **Root Directory**: Set to `firebase-api`
5. Click **"Deploy"**

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to firebase-api directory
cd i:\Freelance\napkinAI\firebase-api

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

---

## ⚙️ Environment Variables

After deployment, add these environment variables in Vercel Dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add the following:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
...your private key...
-----END PRIVATE KEY-----
```

**Important:** For `FIREBASE_PRIVATE_KEY`, copy the entire key including the BEGIN/END lines.

---

## 🔗 Get Your Production URL

After deployment, Vercel will give you a URL like:

```
https://firebase-api-xxxxx.vercel.app
```

Or if you set a custom domain:

```
https://api.thekrakhir.cloud
```

---

## ✅ Test Your Deployment

```bash
# Test health endpoint
curl https://your-firebase-api.vercel.app/health

# Test get balance
curl https://your-firebase-api.vercel.app/api/user/testUser/balance

# Test deduct balance
curl -X POST https://your-firebase-api.vercel.app/api/user/testUser/deduct-balance \
  -H "Content-Type: application/json" \
  -d '{"amount": 5.50}'
```

---

## 📝 Update n8n Workflow

After deployment, update your n8n workflow URLs:

**From:**

```
http://localhost:3001/api/user/...
```

**To:**

```
https://your-firebase-api.vercel.app/api/user/...
```

---

## 🔒 Security (Optional but Recommended)

Add API key authentication to prevent unauthorized access:

1. Add to environment variables:

   ```env
   API_SECRET_KEY=your-secret-key-here
   ```

2. Update `server.js` to validate API key
3. Add API key to n8n HTTP Request headers

---

## Troubleshooting

**Error: "Firebase credentials not found"**

- Ensure all environment variables are set in Vercel
- Redeploy after adding env vars

**Error: "Cannot find module"**

- Make sure `package.json` is in `firebase-api/` directory
- Run `vercel --prod` again

**Error: "Function timeout"**

- Upgrade to Vercel Pro for longer timeouts (if needed)

---

## Next Steps

1. ✅ Deploy Firebase API to Vercel
2. ✅ Copy production URL
3. ✅ Update n8n workflow with production URL
4. ✅ Test end-to-end
