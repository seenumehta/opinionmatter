# OpinionMatter — Quick Start (5 Minutes)

## 🎯 Fastest Way to Get Started

### Step 1: Get Your Supabase Credentials (2 min)
1. Go to [supabase.com](https://supabase.com) → Create free account
2. Click "New Project" → Fill in details → Wait 2-3 minutes
3. Go to Settings → API → Copy:
   - Project URL
   - Anon Key

### Step 2: Update Configuration (1 min)
1. Open `js/supabase-config.js`
2. Replace at line 9-10:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Paste here
   const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Paste here
   ```
3. Save file

### Step 3: Setup Database (1 min)
1. In Supabase → SQL Editor → New Query
2. Open `js/supabase-config.js` in text editor
3. Find the section between `/*` and `*/` comments with CREATE TABLE statements
4. Copy all SQL, paste into Supabase, click "Run"

### Step 4: Configure Google OAuth (1 min)
1. In Supabase → Authentication → Providers → Google
2. Enable it
3. Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com)
4. Fill in Supabase Google settings

### Step 5: Test (Optional)
```bash
# Run local server
python -m http.server 3000

# Open in browser
http://localhost:3000/index.html
```

---

## 🚀 Deploy in 60 Seconds

### Option A: Vercel (Best)
```bash
npm install -g vercel
cd opinionmatter
vercel
```

### Option B: Netlify
1. Drag & drop `opinionmatter` folder to [netlify.com](https://netlify.com)
2. Set environment variables in Site Settings

### Option C: GitHub Pages
```bash
git push to GitHub
# Enable Pages in Settings
```

---

## ✅ You're Done!

Your app is live. Next steps:
1. Open `/index.html` → test QR generator
2. Go to `/login.html` → sign in with Google
3. Try generating reviews
4. Generate AI replies on `/reviews.html`

---

## 📚 Full Documentation

- **SETUP.md** — Complete configuration guide
- **README.md** — Project overview
- **Code comments** — In each file

---

## 🤖 AI Replies (Optional)

To enable AI replies:
1. Get API key from [ai.google.dev](https://ai.google.dev)
2. Update `js/gemini.js` line 3:
   ```javascript
   const GEMINI_API_KEY = 'YOUR_KEY_HERE';
   ```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Login fails | Check Google OAuth is enabled in Supabase |
| Reviews not showing | Clear cache & refresh, check RLS policies |
| Charts blank | Verify Chart.js CDN is loading |
| CORS error | Use Vercel/Netlify deployment |

---

**Everything is built. Just add your API keys and you're live!** 🎉

See SETUP.md for complete details.
