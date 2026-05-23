/* ============================================================================
   Authentication Module — Email/Password + Session Management
   ============================================================================ */

let currentUser = null;
let authChangeCallbacks = [];

/**
 * Wait for Supabase to be ready
 */
async function waitForSupabase() {
  let attempts = 0;
  while ((!window.sbClient) && attempts < 200) {
    await new Promise(resolve => setTimeout(resolve, 25));
    attempts++;
  }
  
  if (!window.sbClient) {
    console.error('Supabase not available after 5 seconds');
    throw new Error('Supabase initialization failed');
  }
  
  return window.sbClient;
}

// Make globally available
window.waitForSupabase = waitForSupabase;

/**
 * Sign in with Google using Supabase OAuth
 * Redirects to Google login, then returns to app with session
 */
async function signInWithGoogle() {
  try {
    const sb = await waitForSupabase();
    const { data, error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard.html',
      },
    });

    if (error) {
      console.error('Google sign-in error:', error);
      showToast('Sign-in failed. Please try again.', 'error');
      return false;
    }
    return true;
  } catch (err) {
    console.error('Unexpected sign-in error:', err);
    showToast('An unexpected error occurred.', 'error');
    return false;
  }
}

/**
 * Sign out user and clear session
 */
async function signOut() {
  try {
    const sb = await waitForSupabase();
    const { error } = await sb.auth.signOut();
    if (error) throw error;

    currentUser = null;
    localStorage.removeItem('opinionmatter_user');
    window.location.href = '/login.html';
  } catch (err) {
    console.error('Sign-out error:', err);
    showToast('Failed to sign out. Please try again.', 'error');
  }
}

/**
 * Get current authenticated user
 * Returns null if not logged in
 */
async function getUser() {
  if (currentUser) return currentUser;

  try {
    const sb = await waitForSupabase();
    const {
      data: { user },
    } = await sb.auth.getUser();

    if (user) {
      // Fetch extended user profile from users table
      const { data: profile, error } = await sb
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .single();

      if (profile) {
        currentUser = { ...user, profile };
        localStorage.setItem('opinionmatter_user', JSON.stringify(currentUser));
        return currentUser;
      }
    }
    return null;
  } catch (err) {
    console.error('Error fetching user:', err);
    return null;
  }
}

/**
 * Require authentication — redirect to login if not authenticated
 * Call this at the top of every protected page
 */
async function requireAuth() {
  const user = await getUser();

  if (!user) {
    // Redirect to login page
    window.location.href = '/login.html';
    return null;
  }

  return user;
}

// Expose getUser globally after it's defined
window.getUser = getUser;

/**
 * Listen for authentication state changes
 * Callback receives { user, event } where event is:
 * 'SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED', etc.
 */
function onAuthChange(callback) {
  authChangeCallbacks.push(callback);

  // Listen to Supabase auth state changes (if available)
  if (window.sbClient) {
    const {
      data: { subscription },
    } = window.sbClient.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        currentUser = session.user;
        localStorage.setItem('opinionmatter_user', JSON.stringify(currentUser));
      } else {
        currentUser = null;
        localStorage.removeItem('opinionmatter_user');
      }

      // Call all registered callbacks
      authChangeCallbacks.forEach((cb) => {
        cb({ user: currentUser, event });
      });
    });

    return subscription;
  } else {
    console.warn('Supabase not yet initialized for auth change listener');
    return null;
  }
}

/**
 * Check if user is logged in (sync check, may not be accurate)
 */
function isLoggedIn() {
  return !!currentUser || !!localStorage.getItem('opinionmatter_user');
}

/**
 * Get user profile from database
 */
async function getUserProfile(userId) {
  try {
    const sb = await waitForSupabase();
    const { data, error } = await sb
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}

/**
 * Update user profile in database
 */
async function updateUserProfile(userId, updates) {
  try {
    const sb = await waitForSupabase();
    const { data, error } = await sb
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error updating user profile:', err);
    showToast('Failed to update profile.', 'error');
    return null;
  }
}

/**
 * Create user record in database after first sign-up
 */
async function createUserProfile(authUser, businessName = '') {
  try {
    const sb = await waitForSupabase();
    const userEmail = authUser.email || authUser.user_metadata?.email;
    const userName = authUser.user_metadata?.name || userEmail.split('@')[0];

    const { data, error } = await sb
      .from('users')
      .insert([
        {
          auth_id: authUser.id,
          email: userEmail,
          business_name: businessName || userName,
          profile_pic_url: authUser.user_metadata?.avatar_url,
        },
      ])
      .select()
      .single();

    if (error) {
      // User might already exist, that's okay
      if (error.code !== '23505') {
        throw error;
      }
    }

    return data;
  } catch (err) {
    console.error('Error creating user profile:', err);
  }
}

/**
 * Initialize auth on page load
 * Restores session from localStorage if available
 */
async function initializeAuth() {
  const savedUser = localStorage.getItem('opinionmatter_user');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
    } catch (e) {
      localStorage.removeItem('opinionmatter_user');
    }
  }

  // Verify session is still valid
  const user = await getUser();
  return user;
}

/**
 * Show toast notification (must be called after utils.js is loaded)
 */
function showToast(message, type = 'info') {
  if (typeof window.showToast === 'function') {
    window.showToast(message, type);
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}
