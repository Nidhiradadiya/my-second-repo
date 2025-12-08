# Vercel Deployment Guide

This project is configured for deployment on Vercel as a monorepo.

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/bill-demo)

## Manual Deployment

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

From the root directory:

```bash
vercel
```

### 4. Configure Environment Variables

In your Vercel dashboard, add these environment variables:

#### Backend Environment Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bill-demo
JWT_ACCESS_SECRET=your-production-access-secret-key
JWT_REFRESH_SECRET=your-production-refresh-secret-key
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=14208185012723
SMTP_PASS=f3dde739f862a1
SMTP_FROM=noreply@billdemo.com
SMTP_FROM_NAME=Bill Demo
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

**Note:** For production, use a production SMTP service like SendGrid instead of Mailtrap.

### 5. Deploy to Production

```bash
vercel --prod
```

## Project Structure for Vercel

```
bill-demo/
├── vercel.json              # Root Vercel config (monorepo routing)
├── backend/
│   ├── api/index.js         # Serverless function entry
│   └── vercel.json          # Backend Vercel config
└── frontend/
    └── package.json         # Contains vercel-build script
```

## How It Works

1. **Backend**: Deployed as serverless functions via `backend/api/index.js`
   - All `/api/*` routes are proxied to the backend
   - Express app runs as a serverless function

2. **Frontend**: Built as static site with Vite
   - Uses `vercel-build` script to create production build
   - Outputs to `frontend/dist`
   - All non-API routes serve the frontend

## MongoDB Setup for Production

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist all IPs (0.0.0.0/0) for Vercel
4. Get connection string and add to Vercel environment variables

## Email Service for Production

### Option 1: SendGrid (Recommended)
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Option 2: Gmail (For testing)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
```

## Vercel Configuration Files

### Root vercel.json
Routes API requests to backend and everything else to frontend.

### Backend vercel.json
Configures the Express app as a serverless function.

## Common Issues

### 1. API Routes Not Working
- Ensure `FRONTEND_URL` in Vercel matches your deployment URL
- Check that environment variables are set in Vercel dashboard

### 2. Database Connection Failed
- Whitelist all IPs (0.0.0.0/0) in MongoDB Atlas
- Verify `MONGODB_URI` is correct

### 3. Email Not Sending
- For production, use SendGrid or another production SMTP service
- Mailtrap is for testing only

## Local Testing

Before deploying, test locally:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

Visit http://localhost:3000

## Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Production SMTP service configured (SendGrid recommended)
- [ ] All environment variables added to Vercel
- [ ] Strong random secrets for JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
- [ ] FRONTEND_URL set to your Vercel deployment URL
- [ ] Tested locally with production-like configuration
- [ ] Deployed with `vercel --prod`

## Monitoring

After deployment:
1. Check Vercel deployment logs
2. Test user registration
3. Test login
4. Test password reset email
5. Test all API endpoints

## Troubleshooting Vercel Deployments

View logs:
```bash
vercel logs [deployment-url]
```

View environment variables:
```bash
vercel env ls
```

Add environment variable:
```bash
vercel env add VARIABLE_NAME
```
