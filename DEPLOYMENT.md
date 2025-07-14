# ShiftNote AI Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# Preview deployment
npm run deploy:preview

# Production deployment
npm run deploy
```

### Step 4: Set Environment Variables
In your Vercel dashboard, add these environment variables:

```
OPENAI_API_KEY=your_openai_api_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
JWT_SECRET=your_jwt_secret_here_use_a_strong_random_string
NEXTAUTH_URL=https://your-custom-domain.com
```

### Step 5: Add Custom Domain
1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update your DNS settings as instructed

---

## 🌐 Alternative: Deploy to Netlify

### Step 1: Build the app
```bash
npm run build
```

### Step 2: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 3: Deploy
```bash
# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=.next
```

---

## 🔧 Pre-Deployment Checklist

### ✅ Environment Variables
- [ ] OPENAI_API_KEY set
- [ ] STRIPE_PUBLISHABLE_KEY set (use live keys for production)
- [ ] STRIPE_SECRET_KEY set (use live keys for production)
- [ ] STRIPE_WEBHOOK_SECRET set
- [ ] JWT_SECRET set (generate a strong random string)
- [ ] NEXTAUTH_URL set to your custom domain

### ✅ Stripe Configuration
- [ ] Update Stripe webhook endpoint to: `https://your-domain.com/api/stripe/webhook`
- [ ] Switch from test to live API keys
- [ ] Update success/cancel URLs in Stripe checkout

### ✅ Database
- [ ] Ensure database file is writable (or migrate to cloud database)
- [ ] Consider using a cloud database for production (MongoDB, PostgreSQL)

### ✅ Domain Setup
- [ ] Point your domain to hosting provider
- [ ] Configure SSL certificate
- [ ] Update NEXTAUTH_URL to your custom domain

---

## 🛠️ Production Optimizations

### 1. Environment Variables
Create a `.env.production` file:
```env
OPENAI_API_KEY=your_production_openai_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_production_stripe_key
STRIPE_SECRET_KEY=sk_live_your_production_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
JWT_SECRET=your_super_secure_jwt_secret
NEXTAUTH_URL=https://your-custom-domain.com
```

### 2. Update Stripe Configuration
Update the success/cancel URLs in your Stripe configuration:
```javascript
success_url: `https://your-custom-domain.com/dashboard?success=true`,
cancel_url: `https://your-custom-domain.com/dashboard?cancelled=true`,
```

### 3. Database Migration (Recommended)
Consider migrating from JSON file to a cloud database:
- **MongoDB Atlas** (free tier available)
- **PostgreSQL** (Vercel Postgres, PlanetScale)
- **Supabase** (free tier available)

---

## 📊 Post-Deployment Steps

### 1. Test Everything
- [ ] User registration/login
- [ ] Shift note creation
- [ ] Stripe checkout flow
- [ ] Dashboard functionality
- [ ] API endpoints

### 2. Monitor Performance
- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Track user engagement

### 3. SEO & Analytics
- Add Google Analytics
- Set up Search Console
- Optimize meta tags

---

## 🔐 Security Considerations

### 1. API Keys
- Use environment variables only
- Never commit sensitive data to Git
- Use different keys for development/production

### 2. HTTPS
- Ensure SSL certificate is active
- Redirect HTTP to HTTPS

### 3. Rate Limiting
- Consider implementing rate limiting for API routes
- Monitor for abuse

---

## 📱 Custom Domain Setup

### 1. Purchase Domain
- Namecheap, GoDaddy, or similar

### 2. DNS Configuration
Add these DNS records:
```
Type: CNAME
Name: www
Value: your-app-name.vercel.app

Type: A
Name: @
Value: 76.76.19.61 (Vercel's IP)
```

### 3. SSL Certificate
- Most hosting providers provide free SSL
- Ensure HTTPS is enforced

---

## 🚨 Troubleshooting

### Common Issues:
1. **Build fails**: Check for TypeScript errors
2. **API routes not working**: Verify environment variables
3. **Database errors**: Check file permissions or migrate to cloud DB
4. **Stripe webhooks failing**: Verify webhook URL and secret

### Need Help?
- Check Vercel/Netlify logs
- Test locally first
- Verify all environment variables are set
