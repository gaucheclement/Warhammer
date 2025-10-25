/**
 * Admin State Management Store
 *
 * Issue #16 Stream A: Authentication & Session Management
 *
 * Writable store for managing admin authentication state and related UI
 * throughout the application. Syncs with localStorage for persistence.
 */

import { writable, derived } from 'svelte/store'
import { isAdmin as checkIsAdmin, logout as logoutAdmin, initializeAdminAuth } from '../lib/adminAuth.js'

/**
 * Create admin store with initial state from localStorage
 */
function createAdminStore() {
  // Initialize from localStorage
  const initialState = {
    isAuthenticated: initializeAdminAuth(),
    lastLoginTime: null,
    sessionStartTime: null
  }

  const { subscribe, set, update } = writable(initialState)

  return {
    subscribe,

    /**
     * Set admin authentication state
     * Called after successful login
     */
    login: () => {
      const now = new Date().toISOString()
      update(state => ({
        ...state,
        isAuthenticated: true,
        lastLoginTime: now,
        sessionStartTime: now
      }))
    },

    /**
     * Clear admin authentication state
     * Called on logout
     */
    logout: () => {
      logoutAdmin() // Clear localStorage
      set({
        isAuthenticated: false,
        lastLoginTime: null,
        sessionStartTime: null
      })
    },

    /**
     * Check and update authentication status
     * Useful for validating session is still active
     */
    checkAuth: () => {
      const isValid = checkIsAdmin()
      update(state => ({
        ...state,
        isAuthenticated: isValid
      }))
      return isValid
    },

    /**
     * Refresh store from localStorage
     * Useful after manual localStorage changes or on app resume
     */
    refresh: () => {
      const isAuthenticated = checkIsAdmin()
      update(state => ({
        ...state,
        isAuthenticated
      }))
    }
  }
}

/**
 * Admin store instance
 * Use this throughout the app to check admin status
 */
export const adminStore = createAdminStore()

/**
 * Derived store for simple boolean admin check
 * More convenient for UI components that only need to know if user is admin
 */
export const isAdminActive = derived(
  adminStore,
  $admin => $admin.isAuthenticated
)

/**
 * Derived store for session duration (in minutes)
 * Useful for displaying session info in admin UI
 */
export const sessionDuration = derived(
  adminStore,
  $admin => {
    if (!$admin.isAuthenticated || !$admin.sessionStartTime) {
      return 0
    }
    const start = new Date($admin.sessionStartTime)
    const now = new Date()
    return Math.floor((now - start) / 1000 / 60) // minutes
  }
)

/**
 * Helper function to guard admin-only actions
 * Returns true if admin, false otherwise
 *
 * @param {Function} callback - Optional callback to execute if admin
 * @returns {boolean}
 */
export function guardAdmin(callback = null) {
  const isValid = checkIsAdmin()
  if (isValid && callback) {
    callback()
  } else if (!isValid) {
    console.warn('Admin access required for this action')
  }
  return isValid
}

/**
 * Initialize admin store on app load
 * Call this in App.svelte or main.js
 */
export function initializeAdminStore() {
  const isAuthenticated = initializeAdminAuth()
  if (isAuthenticated) {
    adminStore.login()
    console.log('Admin store initialized with existing session')
  }
  return isAuthenticated
}
