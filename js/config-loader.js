/**
 * Environment Configuration Loader
 * Loads variables from .env file at runtime
 */

let envConfig = {};

/**
 * Load and parse .env file
 */
async function loadEnv() {
  try {
    const response = await fetch('/.env');
    if (!response.ok) {
      console.warn('⚠️ .env file not found. Using development defaults.');
      return;
    }

    const text = await response.text();
    const lines = text.split('\n');

    lines.forEach(line => {
      // Skip comments and empty lines
      if (!line.trim() || line.trim().startsWith('#')) return;

      // Parse KEY=VALUE
      const [key, ...valueParts] = line.split('=');
      if (key) {
        const value = valueParts.join('=').trim();
        envConfig[key.trim()] = value;
      }
    });

    console.log('✅ Environment variables loaded from .env');
  } catch (error) {
    console.warn('⚠️ Could not load .env file:', error.message);
  }
}

/**
 * Get environment variable
 * @param {string} key - Variable name
 * @param {string} defaultValue - Fallback value
 * @returns {string} - Variable value or default
 */
function getEnv(key, defaultValue = '') {
  return envConfig[key] || defaultValue;
}

/**
 * Initialize config on page load
 */
window.addEventListener('DOMContentLoaded', loadEnv);

// Make functions globally available
window.getEnv = getEnv;
window.envConfig = envConfig;
