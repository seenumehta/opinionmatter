/* ============================================================================
   Supabase Configuration & Client Setup
   ============================================================================ */

const SUPABASE_URL = 'https://ytjaenatwhjwnlmgqere.supabase.co';
const SUPABASE_KEY = 'sb_publishable_TZ5w0AjBoOemBGEMBkwNbQ_-Maf4LKe';

// Store client in window
if (!window.sbClient) {
  window.sbClient = null;
  
  function initializeSupabase() {
    // Check if the actual createClient function is available from CDN
    if (window.supabase && window.supabase.createClient && !window.sbClient) {
      window.sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      console.log('✅ Supabase initialized');
      return true;
    }
    return false;
  }

  // Try initialization on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSupabase);
  } else {
    setTimeout(initializeSupabase, 50);
  }

  // Periodic check
  let attempts = 0;
  const checkInterval = setInterval(() => {
    if (initializeSupabase() || attempts > 200) {
      clearInterval(checkInterval);
    }
    attempts++;
  }, 50);
}

// Expose as window.supabase for auth.js to use
Object.defineProperty(window, '__supabase_instance', {
  get() {
    if (!window.sbClient && window.supabase && window.supabase.createClient) {
      window.sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return window.sbClient;
  },
  configurable: true
});

/* ============================================================================
   DATABASE SCHEMA — Create these tables in Supabase SQL Editor
   ============================================================================ */

/*
-- USERS TABLE
-- Stores business owner profile info and settings
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  business_name TEXT,
  business_category TEXT,
  phone TEXT,
  address TEXT,
  google_business_id TEXT, -- GMB location ID for API sync
  profile_pic_url TEXT,
  plan TEXT DEFAULT 'free', -- 'free', 'pro', 'enterprise'
  reviews_count INT DEFAULT 0,
  avg_rating FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(auth_id)
);

-- REVIEWS TABLE
-- All reviews from Google Business (auto-synced or manual entry for testing)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT,
  rating INT NOT NULL, -- 1-5 stars
  text TEXT,
  reply TEXT,
  replied_at TIMESTAMP,
  sentiment TEXT, -- 'Positive', 'Neutral', 'Negative'
  source TEXT DEFAULT 'google', -- 'google', 'manual'
  google_review_id TEXT, -- For tracking GMB review
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ORDERS TABLE
-- Track customer orders / service requests
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL, -- e.g., "Website Redesign"
  description TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  price FLOAT,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending', -- 'pending', 'in-progress', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- SERVICES TABLE
-- Services offered by the business (for templating orders)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price FLOAT,
  currency TEXT DEFAULT 'INR',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- SETTINGS TABLE
-- Business-specific settings and preferences
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  ai_reply_enabled BOOLEAN DEFAULT true,
  auto_sync_reviews BOOLEAN DEFAULT true,
  sync_frequency TEXT DEFAULT 'daily', -- 'hourly', 'daily', 'weekly'
  gmb_access_token TEXT, -- Encrypted GMB API token
  gemini_settings JSON, -- AI prompt preferences
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(reply IS NULL); -- For "pending replies"
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_services_user_id ON services(user_id);
CREATE INDEX idx_settings_user_id ON settings(user_id);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see/edit their own data
CREATE POLICY "Users can read own user data" ON users
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own user data" ON users
  FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Users can read own reviews" ON reviews
  FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can read own services" ON services
  FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can read own settings" ON settings
  FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Insert/Update policies
CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Similar for orders, services, settings...
*/

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { supabase, SUPABASE_URL, SUPABASE_KEY };
}
