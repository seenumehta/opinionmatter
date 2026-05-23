# OpinionMatter — Setup Checklist

Complete this checklist to get OpinionMatter fully configured and running.

---

## Phase 1: Supabase Setup ✅

- [ ] **Create Supabase Account**
  - [ ] Visit https://supabase.com
  - [ ] Sign up with email or GitHub
  - [ ] Verify email

- [ ] **Create Supabase Project**
  - [ ] Click "New Project"
  - [ ] Name: `opinionmatter`
  - [ ] Generate database password
  - [ ] Select region (closest to you)
  - [ ] Wait for project creation (2-3 min)

- [ ] **Get API Credentials**
  - [ ] Go to Project Settings → API
  - [ ] Copy Project URL (looks like: `https://xxxxx.supabase.co`)
  - [ ] Copy Anon Public Key
  - [ ] Save somewhere safe

- [ ] **Update js/supabase-config.js**
  - [ ] Open file in editor
  - [ ] Line 9: Replace `YOUR_SUPABASE_URL` with your URL
  - [ ] Line 10: Replace `YOUR_SUPABASE_ANON_KEY` with your key
  - [ ] Save file

- [ ] **Create Database Tables**
  - [ ] Open Supabase dashboard
  - [ ] Go to SQL Editor
  - [ ] Click "New Query"
  - [ ] Copy ALL SQL from js/supabase-config.js (between comment blocks)
  - [ ] Paste into SQL editor
  - [ ] Click "Run"
  - [ ] Verify tables created:
    - [ ] users table exists
    - [ ] reviews table exists
    - [ ] orders table exists
    - [ ] services table exists
    - [ ] settings table exists

- [ ] **Enable RLS Policies**
  - [ ] In Supabase, check each table's RLS is enabled
  - [ ] Go to Authentication → Policies
  - [ ] Verify all policies are active

---

## Phase 2: Google OAuth Setup 🔐

- [ ] **Enable Google Provider in Supabase**
  - [ ] Go to Authentication → Providers
  - [ ] Click "Google"
  - [ ] Toggle "Enable Google Provider"

- [ ] **Create Google OAuth Credentials**
  - [ ] Visit https://console.cloud.google.com
  - [ ] Create new project or use existing
  - [ ] Go to APIs & Services → Credentials
  - [ ] Click "Create Credentials" → "OAuth 2.0 Client ID"
  - [ ] Application type: "Web application"
  - [ ] Add authorized redirect URIs:
    - [ ] `https://[YOUR_PROJECT_ID].supabase.co/auth/v1/callback`
    - [ ] `http://localhost:3000/dashboard.html` (for local testing)
  - [ ] Add authorized JavaScript origins:
    - [ ] `https://yourdomain.com` (your deployment URL)
    - [ ] `http://localhost:3000` (for testing)
  - [ ] Copy Client ID
  - [ ] Copy Client Secret

- [ ] **Configure in Supabase**
  - [ ] Go to Supabase → Authentication → Google provider
  - [ ] Paste Client ID from Google
  - [ ] Paste Client Secret from Google
  - [ ] Click "Save"

- [ ] **Test OAuth Flow**
  - [ ] Open `/login.html`
  - [ ] Click "Sign in with Google"
  - [ ] Complete Google login
  - [ ] Verify redirect to `/dashboard.html`
  - [ ] Check user profile loads

---

## Phase 3: Gemini API Setup (Optional) 🤖

- [ ] **Get Gemini API Key**
  - [ ] Visit https://ai.google.dev
  - [ ] Click "Get API Key"
  - [ ] Create new API key
  - [ ] Copy key to clipboard

- [ ] **Update js/gemini.js**
  - [ ] Open file in editor
  - [ ] Line 3: Replace `YOUR_GEMINI_API_KEY_HERE` with your key
  - [ ] Save file

- [ ] **Test Gemini Connection**
  - [ ] Open any page in browser
  - [ ] Press F12 to open DevTools
  - [ ] Go to Console tab
  - [ ] Paste: `await testGeminiConnection()`
  - [ ] Verify success message

- [ ] **Test AI Reply Generation**
  - [ ] Go to `/reviews.html`
  - [ ] Find or add a review
  - [ ] Click "✨ Generate AI Reply"
  - [ ] Verify AI generates a response

---

## Phase 4: Testing 🧪

- [ ] **Local Testing (Optional)**
  - [ ] Open terminal in project folder
  - [ ] Run: `python -m http.server 3000`
  - [ ] Open http://localhost:3000/index.html
  - [ ] Test QR generator
  - [ ] Test sign in flow
  - [ ] Test dashboard loading
  - [ ] Test review management

- [ ] **Test QR Generator** (Public page)
  - [ ] Open `/index.html`
  - [ ] Enter business name
  - [ ] Enter Google review link
  - [ ] Click "Generate QR Code"
  - [ ] Verify QR displays
  - [ ] Click "Download"
  - [ ] Verify PNG downloads

- [ ] **Test Authentication**
  - [ ] Open `/login.html`
  - [ ] Sign in with Google
  - [ ] Verify redirects to `/dashboard.html`
  - [ ] Verify user info displays
  - [ ] Refresh page → verify still logged in
  - [ ] Go to `/profile.html`
  - [ ] Click "Sign Out"
  - [ ] Verify redirects to `/login.html`

- [ ] **Test Dashboard**
  - [ ] Load `/dashboard.html`
  - [ ] Verify stats cards load
  - [ ] Verify count-up animation works
  - [ ] Verify recent reviews display
  - [ ] Test on mobile (resize to <480px)

- [ ] **Test Reviews Page**
  - [ ] Load `/reviews.html`
  - [ ] Verify existing reviews load
  - [ ] Test search filter
  - [ ] Test status filters (All, Pending, Replied, etc.)
  - [ ] Test sentiment filter
  - [ ] Click "Add Review" button
  - [ ] Create test review
  - [ ] Generate AI reply
  - [ ] Edit and save reply

- [ ] **Test Analytics**
  - [ ] Load `/analytics.html`
  - [ ] Verify all 4 charts render:
    - [ ] Reviews per month (bar chart)
    - [ ] Sentiment breakdown (doughnut)
    - [ ] Rating trend (line chart)
    - [ ] Rating distribution (horizontal bar)
  - [ ] Verify stat boxes show numbers

- [ ] **Test Orders**
  - [ ] Load `/orders.html`
  - [ ] Click "Add Order"
  - [ ] Create order with all details
  - [ ] Verify order appears in list
  - [ ] Click order to edit
  - [ ] Change status
  - [ ] Delete order

- [ ] **Test Profile**
  - [ ] Load `/profile.html`
  - [ ] Update business name
  - [ ] Select category
  - [ ] Enter phone number
  - [ ] Click "Save"
  - [ ] Refresh page
  - [ ] Verify data persisted

- [ ] **Test Responsive Design**
  - [ ] Resize browser to 480px (mobile)
  - [ ] Verify bottom nav appears
  - [ ] Verify sidebar hidden
  - [ ] Click nav items → pages load
  - [ ] Resize to 768px (tablet)
  - [ ] Verify layout adapts
  - [ ] Resize to 1200px (desktop)
  - [ ] Verify sidebar appears

---

## Phase 5: Deployment 🚀

Choose ONE deployment option:

### Option A: Vercel (Recommended)

- [ ] **Setup Vercel**
  - [ ] Visit https://vercel.com
  - [ ] Sign up (GitHub recommended)
  - [ ] Connect GitHub account

- [ ] **Deploy Project**
  - [ ] Install Vercel CLI: `npm install -g vercel`
  - [ ] Navigate to project folder
  - [ ] Run: `vercel`
  - [ ] Follow prompts
  - [ ] Get deployment URL

- [ ] **Configure Environment Variables**
  - [ ] Go to Vercel dashboard
  - [ ] Select project
  - [ ] Settings → Environment Variables
  - [ ] Add `VITE_SUPABASE_URL` = your Supabase URL
  - [ ] Add `VITE_SUPABASE_ANON_KEY` = your key
  - [ ] Add `VITE_GEMINI_API_KEY` = your API key
  - [ ] Redeploy

- [ ] **Test Production Deployment**
  - [ ] Open your Vercel URL
  - [ ] Test authentication
  - [ ] Test database operations
  - [ ] Test AI replies

- [ ] **Update Google OAuth Redirect URL**
  - [ ] Go to Google Cloud Console
  - [ ] Update OAuth settings with:
    - [ ] Authorized redirect URI: `https://your-vercel-url.com/dashboard.html`
    - [ ] Authorized JavaScript origin: `https://your-vercel-url.com`
  - [ ] Update Supabase OAuth callback URL

### Option B: Netlify

- [ ] **Deploy to Netlify**
  - [ ] Visit https://netlify.com
  - [ ] Drag & drop `opinionmatter` folder
  - [ ] Get Netlify URL

- [ ] **Configure Environment Variables**
  - [ ] Go to Netlify site settings
  - [ ] Build & Deploy → Environment
  - [ ] Add environment variables (same as Vercel)

- [ ] **Update OAuth Configuration**
  - [ ] Same as Option A, replace URLs

### Option C: GitHub Pages

- [ ] **Initialize Git**
  - [ ] `git init`
  - [ ] Create `.gitignore` with: `node_modules/`, `.env`
  - [ ] `git add .`
  - [ ] `git commit -m "Initial OpinionMatter commit"`

- [ ] **Create GitHub Repository**
  - [ ] Visit https://github.com/new
  - [ ] Create repository `opinionmatter`
  - [ ] Push code: `git push origin main`

- [ ] **Enable GitHub Pages**
  - [ ] Repository Settings → Pages
  - [ ] Branch: `main`, folder: `/`
  - [ ] Wait for deployment

- [ ] **Configure Custom Domain (Optional)**
  - [ ] Add CNAME record to DNS
  - [ ] Add domain in GitHub Pages settings

---

## Phase 6: Post-Deployment 🎉

- [ ] **Verify All Pages Load**
  - [ ] Test each page on production URL
  - [ ] Verify no console errors (F12)
  - [ ] Verify responsive design

- [ ] **Test All Features**
  - [ ] Sign up with new Google account
  - [ ] Add reviews
  - [ ] Generate AI replies
  - [ ] Check analytics
  - [ ] Manage orders

- [ ] **Performance Check**
  - [ ] Use Google PageSpeed Insights
  - [ ] Check all assets loading (CSS, JS, images)
  - [ ] Monitor database queries

- [ ] **Security Check**
  - [ ] Verify HTTPS is enforced
  - [ ] Check sensitive data isn't exposed
  - [ ] Verify RLS policies active
  - [ ] Test OAuth flow thoroughly

- [ ] **Setup Monitoring (Optional)**
  - [ ] Setup Vercel/Netlify analytics
  - [ ] Configure error tracking
  - [ ] Setup uptime monitoring

---

## Phase 7: Future Enhancements 📈

Future features to add:

- [ ] Google Business auto-sync
- [ ] Email notifications
- [ ] Bulk operations
- [ ] Export to CSV
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Team management
- [ ] Custom branding

---

## Troubleshooting 🆘

### Issue: Login redirects back to login page
- [ ] Check Google OAuth enabled in Supabase
- [ ] Verify Client ID/Secret are correct
- [ ] Check redirect URL matches exactly
- [ ] Clear browser cookies and cache

### Issue: Reviews not loading
- [ ] Check user is signed in
- [ ] Open DevTools → Network tab
- [ ] Verify API requests complete
- [ ] Check RLS policies

### Issue: AI replies not generating
- [ ] Verify Gemini API key is set
- [ ] Check API key is valid at ai.google.dev
- [ ] Check browser console for errors
- [ ] Verify API quotas not exceeded

### Issue: Charts not showing on analytics
- [ ] Check Chart.js CDN is loading
- [ ] Verify data fetching from database
- [ ] Clear cache and refresh
- [ ] Check browser console for errors

### Issue: Deployment fails
- [ ] Verify all files are committed to Git
- [ ] Check build logs in hosting dashboard
- [ ] Verify environment variables are set
- [ ] Try deploying from a fresh clone

---

## Final Verification ✅

- [ ] QR code generation works (no login needed)
- [ ] Google login works
- [ ] Dashboard loads with data
- [ ] Reviews can be viewed and managed
- [ ] AI replies generate correctly
- [ ] Analytics charts display
- [ ] Orders can be created/edited
- [ ] Profile settings save
- [ ] Mobile responsive design works
- [ ] No console errors
- [ ] All pages accessible from nav

---

**Once all items are checked, your OpinionMatter instance is production-ready!** 🎉

Start with Phase 1 → complete all phases → launch! 🚀

---

**Need help?**
- See SETUP.md for detailed instructions
- Check README.md for feature overview
- Review code comments in files
- Test in browser DevTools (F12)
