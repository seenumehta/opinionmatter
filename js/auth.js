/* ============================================================================
   Authentication Module — Fixed Version
   ============================================================================ */

let currentUser = null;
let authChangeCallbacks = [];

/**
 * Wait for Supabase to be ready
 */
async function waitForSupabase() {
  let attempts = 0;
  while (!window.sbClient && attempts < 200) {
    await new Promise(resolve => setTimeout(resolve, 25));
    attempts++;
  }
  if (!window.sbClient) {
    throw new Error('Supabase initialization failed');
  }
  return window.sbClient;
}
window.waitForSupabase = waitForSupabase;

/**
 * Sign in with Google OAuth
 */
async function signInWithGoogle() {
  try {
    const sb = await waitForSupabase();
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard.html',
      },
    });
    if (error) {
      showToast('Sign-in failed. Please try again.', 'error');
      return false;
    }
    return true;
  } catch (err) {
    console.error('Sign-in error:', err);
    showToast('An unexpected error occurred.', 'error');
    return false;
  }
}

/**
 * Sign in with Email + Password
 */
async function signInWithEmail(email, password) {
  try {
    const sb = await waitForSupabase();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      showToast(error.message, 'error');
      return null;
    }
    return data.user;
  } catch (err) {
    console.error('Email sign-in error:', err);
    showToast('Sign-in failed.', 'error');
    return null;
  }
}

/**
 * Sign up with Email + Password
 */
async function signUpWithEmail(email, password, businessName = '') {
  try {
    const sb = await waitForSupabase();
    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) {
      showToast(error.message, 'error');
      return null;
    }
    if (data.user) {
      await createUserProfile(data.user, businessName);
    }
    return data.user;
  } catch (err) {
    console.error('Sign-up error:', err);
    showToast('Sign-up failed.', 'error');
    return null;
  }
}

/**
 * Sign out
 */
async function signOut() {
  try {
    const sb = await waitForSupabase();
    await sb.auth.signOut();
    currentUser = null;
    localStorage.removeItem('opinionmatter_user');
    window.location.href = 'login.html'; // ✅ no leading slash
  } catch (err) {
    console.error('Sign-out error:', err);
    showToast('Failed to sign out.', 'error');
  }
}

/**
 * Get current user — FIXED
 * Profile nahi mili toh bhi user return karta hai
 */
async function getUser() {
  // Already cached
  if (currentUser) return currentUser;

  try {
    const sb = await waitForSupabase();

    // Supabase se actual session lo
    const { data: { user }, error } = await sb.auth.getUser();

    // Session nahi hai — genuinely logged out
    if (error || !user) return null;

    // Profile fetch karo — fail hone pe bhi block mat karo
    let profile = null;
    try {
      const { data } = await sb
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .single();
      profile = data;
    } catch (profileErr) {
      console.warn('Profile not found in DB, creating...');
    }

    // Profile nahi mili toh abhi banao
    if (!profile) {
      profile = await createUserProfile(user);
    }

    currentUser = { ...user, profile };
    localStorage.setItem('opinionmatter_user', JSON.stringify(currentUser));
    return currentUser;

  } catch (err) {
    console.error('getUser error:', err);
    return null;
  }
}
window.getUser = getUser;

/**
 * requireAuth — FIXED
 * Protected pages pe call karo
 */
async function requireAuth() {
  const user = await getUser();
  if (!user) {
    window.location.href = 'login.html'; // ✅ no leading slash
    return null;
  }
  return user;
}
window.requireAuth = requireAuth;

/**
 * Auth state change listener
 */
function onAuthChange(callback) {
  authChangeCallbacks.push(callback);

  waitForSupabase().then(sb => {
    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        currentUser = { ...session.user, profile: currentUser?.profile || null };
        localStorage.setItem('opinionmatter_user', JSON.stringify(currentUser));
      } else {
        currentUser = null;
        localStorage.removeItem('opinionmatter_user');
      }
      authChangeCallbacks.forEach(cb => cb({ user: currentUser, event }));
    });
    return subscription;
  });
}

/**
 * Sync check — logged in ya nahi
 */
function isLoggedIn() {
  return !!currentUser || !!localStorage.getItem('opinionmatter_user');
}

/**
 * Profile fetch by userId
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
    console.error('getUserProfile error:', err);
    return null;
  }
}

/**
 * Profile update
 */
async function updateUserProfile(userId, updates) {
  try {
    const sb = await waitForSupabase();
    const { data, error } = await sb
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('updateUserProfile error:', err);
    showToast('Failed to update profile.', 'error');
    return null;
  }
}

/**
 * Profile create — FIXED
 * Duplicate hone pe crash nahi karta
 */
async function createUserProfile(authUser, businessName = '') {
  try {
    const sb = await waitForSupabase();
    const userEmail = authUser.email || authUser.user_metadata?.email || '';
    const userName = authUser.user_metadata?.name || userEmail.split('@')[0] || 'Business';

    // Pehle check karo exist karta hai kya
    const { data: existing } = await sb
      .from('users')
      .select('*')
      .eq('auth_id', authUser.id)
      .single();

    if (existing) return existing; // Already hai — return karo

    // Naya banao
    const { data, error } = await sb
      .from('users')
      .insert([{
        auth_id: authUser.id,
        email: userEmail,
        business_name: businessName || userName,
        profile_pic_url: authUser.user_metadata?.avatar_url || null,
      }])
      .select()
      .single();

    if (error && error.code !== '23505') throw error;
    return data;

  } catch (err) {
    console.error('createUserProfile error:', err);
    return null;
  }
}

/**
 * Initialize auth — page load pe call karo
 */
async function initializeAuth() {
  // LocalStorage se restore karo
  const saved = localStorage.getItem('opinionmatter_user');
  if (saved) {
    try { currentUser = JSON.parse(saved); } 
    catch (e) { localStorage.removeItem('opinionmatter_user'); }
  }
  // Verify with Supabase
  return await getUser();
}

/**
 * Toast helper
 */
function showToast(message, type = 'info') {
  if (typeof window.showToast === 'function') {
    window.showToast(message, type);
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}