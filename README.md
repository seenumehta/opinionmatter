# OpinionMatter — AI-Powered Business Review Management App

A complete web application for managing Google reviews with AI-powered replies, analytics, order tracking, and more. Built with vanilla HTML/CSS/JavaScript and Supabase.

## 📁 Project Structure

```
opinionmatter/
├── index.html              # QR Code Generator (Public landing page)
├── login.html              # Google OAuth Sign-In
├── dashboard.html          # Main dashboard with stats & recent reviews
├── reviews.html            # Manage reviews with AI reply generation
├── analytics.html          # Charts & performance metrics (Chart.js)
├── orders.html             # Track customer orders & services
├── profile.html            # Business profile & settings
├── css/
│   └── global.css          # Design system & shared styles
└── js/
    ├── supabase-config.js  # Supabase client setup & SQL schema
    ├── auth.js             # Authentication & session management
    └── gemini.js           # Google Gemini API integration for AI replies
```

## 🚀 Quick Setup

### 1. **Install Supabase**
   - Create a free account at [supabase.com](https://supabase.com)
   - Create a new project
   - Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY`

### 2. **Setup Database**
   - Go to SQL Editor in Supabase
   - Copy the SQL schema from [js/supabase-config.js](js/supabase-config.js)
   - Uncomment and run all the CREATE TABLE statements
   - Enable Row Level Security (RLS) policies

### 3. **Configure APIs**
   
   **Supabase Config** — Update [js/supabase-config.js](js/supabase-config.js):
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIs...';
   ```

   **Google OAuth** — Configure in Supabase:
   - Go to Authentication → Providers → Google
   - Add Google OAuth credentials
   - Set redirect URL to your app domain

   **Gemini API** — Update [js/gemini.js](js/gemini.js):
   ```javascript
   const GEMINI_API_KEY = 'your-api-key-from-google-ai-studio';
   ```
   - Get your key from [ai.google.dev](https://ai.google.dev)

### 4. **Deploy**
   - Host files on Vercel, Netlify, GitHub Pages, or any static host
   - Update URLs in supabase-config.js OAuth redirect
   - Test all pages

## 📄 File Descriptions

### Public Pages

| File | Purpose | Features |
|------|---------|----------|
| `index.html` | QR Code Generator | Generate, preview, download QR codes for Google reviews |
| `login.html` | Authentication | Google OAuth sign-in for businesses |

### Protected Pages (Require Auth)

| File | Purpose | Features |
|------|---------|----------|
| `dashboard.html` | Dashboard Overview | Stats cards, recent reviews, count-up animations |
| `reviews.html` | Review Management | View, filter, search, AI-reply generation |
| `analytics.html` | Performance Metrics | 4+ charts (Chart.js), trends, distributions |
| `orders.html` | Order Tracking | CRUD operations, status updates, full management |
| `profile.html` | Business Settings | Profile editing, GMB connection, profile completion % |

### Stylesheets & Scripts

| File | Purpose |
|------|---------|
| `css/global.css` | Design system, variables, components, responsive layouts |
| `js/supabase-config.js` | Supabase client init, database schema documentation |
| `js/auth.js` | Google OAuth, session mgmt, user profiles |
| `js/gemini.js` | AI reply generation, sentiment analysis |

## 🎨 Design System

### Colors
- **Primary**: `#0d0d0d` (Ink)
- **Accent**: `#ff4d00` (Orange)
- **Accent2**: `#ffb800` (Yellow)
- **Background**: `#f5f0e8` (Paper)
- **Text**: `#7a7060` (Muted)

### Typography
- **Headings**: Syne (800 weight)
- **Body**: DM Sans (400-500 weight)

### Components
- Cards with hover effects
- Buttons (primary, secondary, accent, outline)
- Forms with validation
- Badges & pills
- Toast notifications
- Modal dialogs
- Loading spinners

## 🔐 Authentication Flow

1. User clicks "Sign In with Google" on login.html
2. Redirects to Google OAuth consent screen
3. On success, creates/fetches user record in `users` table
4. Stores JWT session token (managed by Supabase)
5. Redirects to dashboard.html
6. `requireAuth()` checks session on protected pages

## 📊 Database Schema

### Tables
- **users**: Business profiles
- **reviews**: Customer reviews (with AI sentiment)
- **orders**: Customer orders/service requests
- **services**: Business service templates
- **settings**: Business preferences & API tokens

All tables have RLS enabled for security.

## 🤖 AI Features

### Sentiment Analysis
```javascript
const sentiment = await analyzeSentiment(reviewText);
// Returns: 'Positive', 'Neutral', or 'Negative'
```

### AI Reply Generation
```javascript
const reply = await generateReviewReply(reviewText, rating, businessName);
// Uses Gemini Pro to generate contextual, authentic replies
```

## 📈 Analytics Dashboard

Charts built with **Chart.js**:
- 📈 Reviews Per Month (Bar chart)
- 😊 Sentiment Distribution (Doughnut chart)
- ⭐ Rating Trend (Line chart)
- ⭐ Rating Distribution (Horizontal bar)

All charts animate on load and update with real data.

## 🔧 Environment Variables

Create a `.env` file (for reference):
```
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_KEY=anon-key
VITE_GEMINI_API_KEY=your-gemini-key
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

*(Note: Keys should be injected at deployment)*

## 🎯 Key Features Implemented

✅ QR Code generation & download  
✅ Google OAuth authentication  
✅ Dashboard with live stats  
✅ Review management with filters  
✅ AI-powered reply generation  
✅ Sentiment analysis  
✅ Analytics with 4 interactive charts  
✅ Order/service tracking  
✅ Business profile management  
✅ Profile completion tracker  
✅ Toast notifications  
✅ Loading states & animations  
✅ Fully responsive (mobile/tablet/desktop)  
✅ Dark mode CSS variables ready  

## 🚀 Next Steps

1. **Connect Google Business Profile API**
   - Auto-sync reviews from Google
   - Post replies directly to Google
   - Pull business photos/info

2. **Add Email Notifications**
   - Notify on new reviews
   - Summary emails
   - Reply reminders

3. **Batch Operations**
   - Export reviews to CSV
   - Bulk reply templates
   - Mass update orders

4. **Premium Features**
   - Advanced analytics
   - Review monitoring alerts
   - Competitor tracking
   - Custom branding

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

Free to use. Modify & deploy for your business.

## 💡 Tips

- Use `opinionmatter/index.html` as a standalone QR generator for non-registered users
- Share the QR code page link on social media
- Print QR codes for physical locations
- Use dashboard for daily review monitoring
- Setup daily email digest for reviews (future feature)

---

**Built with ♥ for small business growth**
