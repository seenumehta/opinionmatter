# OpinionMatter — Developer Reference Guide

This guide documents the code architecture, patterns, and conventions used throughout OpinionMatter.

---

## 🏗️ Project Architecture

### Layer 1: Static Files
```
HTML Pages (UI Layer)
    ↓
CSS/JS Assets (Logic Layer)
    ↓
Client Libraries
    ↓
Backend APIs (Supabase, Gemini, Google OAuth)
```

### Data Flow Pattern
```
User Action (click, submit)
  ↓
Event Handler (js function)
  ↓
API Call (Supabase/Gemini)
  ↓
Data Processing
  ↓
DOM Update (HTML/CSS)
  ↓
Visual Feedback (toast notification)
```

---

## 📁 Code Organization

### CSS Architecture (`css/global.css`)

**Structure** (850+ lines):
1. CSS Custom Properties (lines 8-40)
2. Typography (lines 43-80)
3. Layout Utilities (lines 83-150)
4. Component Classes (lines 153-500)
5. Animations (lines 503-700)
6. Responsive Breakpoints (lines 703-850)

**Naming Convention**:
- Prefix: `.card`, `.btn`, `.badge` (noun + modifier)
- Modifier: `.btn-primary`, `.btn-large` (BEM-style)
- Utility: `.text-center`, `.mt-2` (atomic)

**Custom Properties**:
```css
--ink       /* Primary text color */
--paper     /* Background color */
--accent    /* Call-to-action color */
--accent2   /* Secondary highlight */
--muted     /* Secondary text */
--white     /* Light background */
--border    /* Border color */
--success   /* Success state */
--warning   /* Warning state */
--error     /* Error state */
```

### JavaScript Modules

#### `js/supabase-config.js` (Initialization)
- Creates global `supabase` client
- Exports nothing (initialization script)
- Must load before other JS files
- Includes SQL schema in comments

```javascript
// Load order: supabase-config.js → auth.js → page-specific
// Usage: const response = await supabase.from('table').select();
```

#### `js/auth.js` (Authentication)
- Main functions:
  - `signInWithGoogle()` - Initiates OAuth
  - `getUser()` - Gets authenticated user
  - `requireAuth()` - Guards protected pages
  - `onAuthChange(callback)` - Listens for auth changes
  - `updateUserProfile()` - Updates user record
  - `createUserProfile()` - Creates new user

- Exported functions are globally available

#### `js/gemini.js` (AI Integration)
- Main functions:
  - `generateReviewReply(text, rating, name)` - AI reply
  - `analyzeSentiment(text)` - Sentiment detection
  - `analyzeSentimentBatch(texts)` - Batch processing
  - `testGeminiConnection()` - API test

- Requires `GEMINI_API_KEY` to be set

### HTML Pages (7 Files)

#### Public Pages
- **index.html** - QR code generator (no auth required)
- **login.html** - OAuth entry point

#### Protected Pages (require `requireAuth()`)
- **dashboard.html** - Main dashboard
- **reviews.html** - Review management
- **analytics.html** - Analytics & charts
- **orders.html** - Order tracking
- **profile.html** - Business profile

---

## 🔌 API Integrations

### Supabase Integration Pattern

```javascript
// 1. Query data
const { data, error } = await supabase
  .from('reviews')
  .select('*')
  .eq('user_id', userId);

// 2. Insert data
const { data: newReview } = await supabase
  .from('reviews')
  .insert([{ user_id, text, rating, sentiment }]);

// 3. Update data
await supabase
  .from('reviews')
  .update({ reply: text, replied_at: now() })
  .eq('id', reviewId);

// 4. Listen for changes (real-time)
supabase
  .from('reviews')
  .on('*', payload => {
    // Handle changes
  })
  .subscribe();

// 5. Handle errors
if (error) {
  showToast(`Error: ${error.message}`, 'error');
  console.error(error);
}
```

### Google OAuth Pattern

```javascript
// 1. Sign in
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/dashboard.html`
  }
});

// 2. Get session
const { data: { session } } = await supabase.auth.getSession();

// 3. Listen for changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // User logged in
  }
});

// 4. Sign out
await supabase.auth.signOut();
```

### Gemini API Pattern

```javascript
// 1. Send prompt
const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-goog-api-key': GEMINI_API_KEY
  },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 200
    }
  })
});

// 2. Parse response
const result = await response.json();
const textContent = result.candidates[0].content.parts[0].text;

// 3. Handle errors
if (!response.ok) {
  throw new Error(`API Error: ${response.statusText}`);
}
```

---

## 🎨 UI Patterns

### Toast Notifications

```javascript
// Success
showToast('Changes saved!', 'success');

// Error
showToast('Something went wrong', 'error');

// Info
showToast('Processing...', 'info');

// Implementation
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 3000);
}
```

### Modal Dialog Pattern

```javascript
// HTML
<div id="myModal" class="modal hidden">
  <div class="modal-content">
    <div class="modal-header">Title</div>
    <div class="modal-body">Content</div>
    <div class="modal-footer">
      <button onclick="closeModal()">Close</button>
    </div>
  </div>
</div>

// JavaScript
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}
```

### Loading State Pattern

```javascript
// Show loader
const loader = document.querySelector('.spinner');
loader.style.display = 'block';

// Fetch data
const data = await fetchData();

// Hide loader
loader.style.display = 'none';

// Render data
renderData(data);

// HTML
<div class="spinner"></div>
```

### Skeleton Loading Pattern

```html
<!-- Skeleton card -->
<div class="card skeleton-pulse">
  <div class="skeleton-line" style="height: 20px; width: 40%;"></div>
  <div class="skeleton-line" style="height: 16px; width: 80%;"></div>
</div>

<!-- CSS -->
<style>
  .skeleton-pulse {
    animation: shimmer 2s infinite;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
  }
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  auth_id UUID UNIQUE,
  email VARCHAR(255),
  business_name VARCHAR(255),
  business_category VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  profile_pic_url VARCHAR(255),
  reviews_count INT DEFAULT 0,
  avg_rating DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id BIGINT PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  reviewer_name VARCHAR(255),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  reply TEXT,
  sentiment VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  replied_at TIMESTAMP
);
```

### RLS Policy Pattern
```sql
-- Allow users to see only their own data
CREATE POLICY "Users see own reviews" ON reviews
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own reviews
CREATE POLICY "Users insert own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own reviews
CREATE POLICY "Users update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## 🔄 Common Patterns

### Fetch and Render
```javascript
async function loadReviews() {
  try {
    const user = await getUser();
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id);
    
    renderReviews(data);
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  }
}

function renderReviews(reviews) {
  const html = reviews.map(review => `
    <div class="review-card">
      <h3>${review.reviewer_name}</h3>
      <p>${review.text}</p>
    </div>
  `).join('');
  
  document.getElementById('reviews-container').innerHTML = html;
}
```

### Form Submission
```javascript
document.getElementById('review-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  try {
    const { error } = await supabase
      .from('reviews')
      .insert([data]);
    
    if (error) throw error;
    
    showToast('Review added!', 'success');
    e.target.reset();
    loadReviews();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  }
});
```

### Debounce Search
```javascript
let searchTimeout;

document.getElementById('search').addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  
  searchTimeout = setTimeout(() => {
    const query = e.target.value;
    filterReviews(query);
  }, 300);
});
```

### Count Up Animation
```javascript
function animateCounter(element, target, duration = 1000) {
  let current = 0;
  const increment = target / (duration / 16);
  
  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}
```

---

## 🚨 Error Handling

### Try-Catch Pattern
```javascript
try {
  const data = await someAsyncOperation();
  processData(data);
} catch (error) {
  console.error('Operation failed:', error);
  showToast(`Error: ${error.message}`, 'error');
  // Fallback UI
}
```

### API Error Handling
```javascript
const response = await fetch(url);

if (!response.ok) {
  const error = await response.json();
  throw new Error(error.message || `HTTP ${response.status}`);
}

const data = await response.json();
```

### Validation Pattern
```javascript
function validateReview(review) {
  if (!review.text || review.text.trim().length === 0) {
    throw new Error('Review text is required');
  }
  
  if (!review.rating || review.rating < 1 || review.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  
  return true;
}
```

---

## 🎭 Page Lifecycle

### Typical Protected Page Flow

```javascript
// 1. On page load
window.addEventListener('DOMContentLoaded', async () => {
  // Check auth
  const user = await getUser();
  if (!user) {
    window.location.href = '/login.html';
    return;
  }
  
  // Update UI with user
  document.querySelector('.user-name').textContent = user.business_name;
  
  // Load data
  await loadData();
  
  // Setup event listeners
  setupEventListeners();
});

// 2. Load data
async function loadData() {
  try {
    const user = await getUser();
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id);
    
    renderData(data);
  } catch (error) {
    handleError(error);
  }
}

// 3. Setup listeners
function setupEventListeners() {
  document.getElementById('add-btn')?.addEventListener('click', openModal);
  document.getElementById('form')?.addEventListener('submit', handleSubmit);
  document.getElementById('search')?.addEventListener('input', handleSearch);
}

// 4. Handle actions
async function handleSubmit(e) {
  e.preventDefault();
  
  try {
    // Validate
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Send to API
    const { error } = await supabase
      .from('table')
      .insert([data]);
    
    if (error) throw error;
    
    // Show success
    showToast('Success!', 'success');
    
    // Reload data
    loadData();
    
    // Close modal
    closeModal();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  }
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile first */
/* Default: < 480px */

/* Tablet: 480px - 768px */
@media (min-width: 480px) {
  /* Tablet styles */
}

/* Tablet: 768px */
@media (min-width: 768px) {
  /* Desktop styles */
}

/* Desktop: 1200px+ */
@media (min-width: 1200px) {
  /* Large desktop styles */
}
```

### Mobile vs Desktop Navigation
```html
<!-- Sidebar (hidden on mobile) -->
<aside id="sidebar" class="sidebar">
  <!-- Navigation items -->
</aside>

<!-- Bottom nav (visible on mobile only) -->
<nav id="bottom-nav" class="bottom-nav">
  <!-- Navigation items -->
</nav>

<!-- CSS -->
<style>
  #sidebar {
    display: none;
  }
  
  @media (min-width: 768px) {
    #sidebar {
      display: block;
    }
    
    #bottom-nav {
      display: none;
    }
  }
</style>
```

---

## 🧪 Testing Checklist for New Features

- [ ] Data loads correctly
- [ ] Form validation works
- [ ] API calls succeed
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] Toast notifications show
- [ ] Loading states display
- [ ] No console errors
- [ ] Works across browsers
- [ ] Performance acceptable

---

## 📝 Naming Conventions

### Functions
```javascript
// Prefix with verb
loadData()
fetchReviews()
handleClick()
validateForm()
showModal()
closeModal()
```

### Variables
```javascript
// camelCase for variables
const userData = {};
let isLoading = false;
const reviewList = [];
```

### CSS Classes
```css
/* Component classes */
.card
.btn
.badge

/* Modifier classes */
.btn-primary
.badge-success
.card-large

/* State classes */
.hidden
.active
.disabled
.loading
```

### IDs
```html
<!-- Use kebab-case with descriptive names -->
<div id="user-profile"></div>
<form id="review-form"></form>
<button id="add-review-btn"></button>
```

---

## 🚀 Performance Tips

1. **Minimize re-renders**
   - Update only changed DOM elements
   - Use element IDs instead of selectors when possible

2. **Batch API calls**
   - Use `analyzeSentimentBatch()` for multiple items
   - Load all data in one query

3. **Cache data**
   - Store user info in variable
   - Avoid refetching on every interaction

4. **Optimize images**
   - Use CDN-hosted images
   - Compress images before upload

5. **Lazy load content**
   - Load analytics charts only when needed
   - Pagination for large lists

---

## 📚 Additional Resources

- **JavaScript**: [MDN Web Docs](https://developer.mozilla.org)
- **Supabase**: [Supabase Docs](https://supabase.com/docs)
- **CSS**: [CSS Tricks](https://css-tricks.com)
- **Web APIs**: [Web.dev](https://web.dev)

---

**Happy coding!** 🎉

For questions about specific code patterns, refer to the HTML files or contact support.
