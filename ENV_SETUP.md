# 🔐 Environment Configuration Guide

This project uses a `.env` file to securely store API keys and sensitive configuration.

## 📋 Setup Instructions

### 1. Copy Environment Template
```bash
cp .env.example .env
```

### 2. Update Your Credentials in `.env`
Edit the `.env` file and add your actual credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key-here

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 3. How to Get Your Credentials

#### 🔷 Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a project or open existing one
3. Settings → API
4. Copy `Project URL` and `Anon Key`

#### 🌐 Google Gemini API
1. Go to [ai.google.dev](https://ai.google.dev)
2. Click "Get API Key" → Create new API key
3. Copy the key to `.env`

#### 🔑 Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Copy the Client ID to `.env`

---

## ✅ Security Best Practices

### ✔️ DO
- ✅ Add `.env` to `.gitignore` (already done)
- ✅ Keep `.env` file on your local machine only
- ✅ Rotate API keys periodically
- ✅ Use different keys for development and production
- ✅ Never commit `.env` to GitHub

### ❌ DON'T
- ❌ Never commit `.env` to version control
- ❌ Don't share API keys in emails or messages
- ❌ Don't use production keys in development
- ❌ Don't expose keys in error messages
- ❌ Don't hardcode keys in your code

---

## 🚀 How It Works

1. **config-loader.js** automatically loads your `.env` file on page load
2. Environment variables are available globally via `getEnv('KEY_NAME')`
3. Fallback values are used if `.env` is not found
4. No build tool required!

### Example Usage in Code
```javascript
const apiKey = getEnv('GEMINI_API_KEY', 'default-key');
const supabaseUrl = getEnv('SUPABASE_URL');
```

---

## 🔍 Troubleshooting

### ".env file not found" Warning
- Ensure `.env` exists in the project root
- Copy from `.env.example` if missing
- Check file permissions (should be readable)

### API Keys Not Working
1. Open browser DevTools (F12)
2. Check Console for loading status
3. Verify keys are correct in `.env`
4. Ensure keys haven't expired or been revoked

### Variables Still Showing as Undefined
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page (Ctrl+R)
- Check that `js/config-loader.js` is loaded first in HTML

---

## 📝 Files Structure

```
opinionmatter/
├── .env              ← Your actual credentials (DO NOT COMMIT)
├── .env.example      ← Template file (check into git)
├── .gitignore        ← Excludes .env from git
└── js/
    └── config-loader.js  ← Loads env variables
```

---

## 🛡️ For Production Deployment

For security in production:
1. **Never** use `.env` files with frontend code
2. Use environment variables provided by your hosting platform:
   - Vercel: Environment Variables in Settings
   - Netlify: Build Environment Variables
   - GitHub Pages: Use Actions secrets
3. Create a backend API to proxy sensitive requests
4. Use OAuth 2.0 with secure token exchange

See [DEPLOYMENT_SECURITY.md](DEPLOYMENT_SECURITY.md) for details.

---

**Questions?** Check the main [README.md](README.md) or [SETUP.md](SETUP.md)
