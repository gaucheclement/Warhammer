/**
 * Admin Authentication Utilities
 *
 * Issue #16 Stream A: Authentication & Session Management
 *
 * Client-side authentication for admin mode using Web Crypto API
 * for password hashing and localStorage for session persistence.
 *
 * Security Note: This is client-side only authentication, acceptable
 * for single admin use case. Not production-grade for multi-user scenarios.
 */

/**
 * Pre-computed SHA-256 hash of admin password
 *
 * To generate a new hash, use:
 * const hash = await crypto.subtle.digest(
 *   'SHA-256',
 *   new TextEncoder().encode('your-password')
 * )
 * const hashHex = Array.from(new Uint8Array(hash))
 *   .map(b => b.toString(16).padStart(2, '0'))
 *   .join('')
 *
 * Default password for development: "admin123"
 * Hash below is for "admin123"
 */
const ADMIN_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'

/**
 * localStorage key for admin session
 */
const ADMIN_SESSION_KEY = 'adminAuth'

/**
 * Hash a password using SHA-256
 *
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hex-encoded hash
 */
export async function hashPassword(password) {
  try {
    const hash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(password)
    )
    const hashHex = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    return hashHex
  } catch (error) {
    console.error('Password hashing failed:', error)
    throw new Error('Failed to hash password')
  }
}

/**
 * Verify password against stored hash
 *
 * @param {string} password - Plain text password to verify
 * @returns {Promise<boolean>} - True if password matches
 */
export async function verifyPassword(password) {
  try {
    const hash = await hashPassword(password)
    return hash === ADMIN_HASH
  } catch (error) {
    console.error('Password verification failed:', error)
    return false
  }
}

/**
 * Log in as admin
 *
 * @param {string} password - Plain text password
 * @returns {Promise<boolean>} - True if login successful
 */
export async function login(password) {
  const isValid = await verifyPassword(password)
  if (isValid) {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true')
    console.log('Admin login successful')
    return true
  }
  console.warn('Admin login failed: Invalid password')
  return false
}

/**
 * Check if current session is admin
 *
 * @returns {boolean} - True if admin session active
 */
export function isAdmin() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true'
}

/**
 * Log out admin session
 */
export function logout() {
  localStorage.removeItem(ADMIN_SESSION_KEY)
  console.log('Admin logout successful')
}

/**
 * Check if admin session exists and is valid
 * Used for route guards
 *
 * @returns {boolean} - True if valid admin session
 */
export function requireAdmin() {
  const isAdminSession = isAdmin()
  if (!isAdminSession) {
    console.warn('Admin access required')
  }
  return isAdminSession
}

/**
 * Initialize admin auth state
 * Call this on app startup to check for existing session
 *
 * @returns {boolean} - True if admin session exists
 */
export function initializeAdminAuth() {
  const hasAdminSession = isAdmin()
  if (hasAdminSession) {
    console.log('Admin session restored from localStorage')
  }
  return hasAdminSession
}
