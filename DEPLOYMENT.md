# Vercel Deployment Guide

This guide will help you deploy your NapkinAI project to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your Firebase project credentials
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Project

Make sure your project is committed to a Git repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel will auto-detect your Vite project
5. Configure the following:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add the following environment variables (from your Firebase project):

   ```
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   VITE_FIREBASE_MEASUREMENT_ID
   ```

3. Make sure to add them for **Production**, **Preview**, and **Development** environments
4. After adding variables, **redeploy** your project for changes to take effect

## Step 4: Configure Firebase for Production

1. In your Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add your Vercel domain (e.g., `your-project.vercel.app`)
3. If you have a custom domain, add that as well

## Step 5: Verify Deployment

1. Visit your deployment URL (provided by Vercel)
2. Test all features:
   - User authentication
   - Dashboard functionality
   - All routes and navigation

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18.x by default)
- Check build logs in Vercel dashboard

### Environment Variables Not Working
- Make sure variables start with `VITE_` prefix
- Redeploy after adding/updating variables
- Check variable names match exactly (case-sensitive)

### Routing Issues
- The `vercel.json` file handles SPA routing
- All routes redirect to `index.html` for client-side routing

### Firebase Errors
- Verify Firebase config in environment variables
- Check Firebase console for authorized domains
- Ensure Firebase project is active

## Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Firebase authorized domains with your custom domain

## Continuous Deployment

Vercel automatically deploys when you push to your main branch:
- **Production**: Deploys from `main` branch
- **Preview**: Deploys from other branches and pull requests

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

