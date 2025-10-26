/**
 * Router Configuration for Warhammer Fantasy 4e
 *
 * Hash-based routing using svelte-spa-router
 * Routes support lazy loading for code splitting
 *
 * Issue #19 Stream B: Implemented lazy loading for all routes except Home
 * to reduce initial bundle size and improve performance
 */

import { wrap } from 'svelte-spa-router/wrap'

// Import only Home component directly (critical path)
import Home from '../routes/Home.svelte'

// Issue #19 Stream B: Lazy load all other routes for code splitting
// This reduces initial bundle size and improves Time to Interactive

/**
 * Route definitions
 * Format: { path: component }
 *
 * Supported route patterns:
 * - / - Home page (loaded immediately)
 * - /browse/:category - Browse data by category (lazy loaded)
 * - /character/:id - Character detail page (lazy loaded)
 * - /creator - Character creation wizard (lazy loaded)
 * - /admin - Database management (lazy loaded)
 * - /settings - User settings (lazy loaded)
 * - * - 404 page (lazy loaded)
 *
 * Issue #19 Stream B: Routes use lazy loading via wrap() to enable code splitting
 */
export const routes = {
  // Home page - loaded immediately (critical path)
  '/': Home,

  // Browse routes with optional category parameter - lazy loaded
  '/browse': wrap({
    asyncComponent: () => import('../routes/Browse.svelte')
  }),
  '/browse/:category': wrap({
    asyncComponent: () => import('../routes/Browse.svelte')
  }),

  // Character routes - lazy loaded
  //ROUTE-ADDED: Issue #10 Stream 5 - Character List
  '/characters': wrap({
    asyncComponent: () => import('../routes/CharacterList.svelte')
  }),
  '/character/:id': wrap({
    asyncComponent: () => import('../routes/CharacterSheet.svelte')
  }),

  // Character creator - lazy loaded
  '/creator': wrap({
    asyncComponent: () => import('../routes/Creator.svelte')
  }),

  // Issue #16 Stream A: Admin login page
  '/admin/login': wrap({
    asyncComponent: () => import('../pages/AdminLogin.svelte')
  }),

  // Admin panel - lazy loaded
  '/admin': wrap({
    asyncComponent: () => import('../routes/Admin.svelte')
  }),

  // Settings - lazy loaded
  '/settings': wrap({
    asyncComponent: () => import('../routes/Settings.svelte')
  }),

  // 404 catch-all - lazy loaded - must be last
  '*': wrap({
    asyncComponent: () => import('../routes/NotFound.svelte')
  })
}

/**
 * Route guards and navigation hooks
 * Can be used to protect routes or perform actions on navigation
 */

/**
 * Before each route change
 * @param {Object} detail - Route change details
 * @returns {boolean} - Return false to prevent navigation
 */
export function beforeRouteChange(detail) {
  // Log navigation for debugging
  if (import.meta.env.DEV) {
    console.log('Navigating to:', detail.location)
  }

  // Example: Check if user can access admin panel
  // Uncomment when authentication is implemented
  // if (detail.location.startsWith('/admin') && !isAuthenticated()) {
  //   return false
  // }

  return true
}

/**
 * After route change
 * @param {Object} detail - Route change details
 */
export function afterRouteChange(detail) {
  // Scroll to top on route change
  window.scrollTo(0, 0)

  // Update page title based on route
  updatePageTitle(detail.location)

  // Track page view (for analytics, when implemented)
  // trackPageView(detail.location)
}

/**
 * Update document title based on current route
 * @param {string} location - Current route location
 */
function updatePageTitle(location) {
  const titles = {
    '/': 'Warhammer Fantasy 4e',
    '/browse': 'Browse - Warhammer Fantasy 4e',
    '/characters': 'Characters - Warhammer Fantasy 4e',
    '/character': 'Character - Warhammer Fantasy 4e',
    '/creator': 'Character Creator - Warhammer Fantasy 4e',
    '/admin/login': 'Admin Login - Warhammer Fantasy 4e',
    '/admin': 'Admin Panel - Warhammer Fantasy 4e',
    '/settings': 'Settings - Warhammer Fantasy 4e'
  }

  // Find matching title
  let title = 'Warhammer Fantasy 4e'
  for (const [path, pageTitle] of Object.entries(titles)) {
    if (location.startsWith(path)) {
      title = pageTitle
      break
    }
  }

  document.title = title
}

/**
 * Navigation helpers
 */

/**
 * Check if a route exists
 * @param {string} path - Route path to check
 * @returns {boolean}
 */
export function routeExists(path) {
  return Object.keys(routes).some(route => {
    if (route === '*') return false
    // Simple pattern matching (doesn't handle complex patterns)
    const pattern = route.replace(/:\w+/g, '[^/]+')
    const regex = new RegExp(`^${pattern}$`)
    return regex.test(path)
  })
}

/**
 * Build route path with parameters
 * @param {string} route - Route pattern (e.g., '/character/:id')
 * @param {Object} params - Route parameters
 * @returns {string} - Built path
 *
 * @example
 * buildPath('/character/:id', { id: '123' }) // '/character/123'
 */
export function buildPath(route, params = {}) {
  let path = route
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, value)
  }
  return path
}

/**
 * Parse route parameters from path
 * @param {string} pattern - Route pattern (e.g., '/character/:id')
 * @param {string} path - Actual path (e.g., '/character/123')
 * @returns {Object} - Parsed parameters
 *
 * @example
 * parseParams('/character/:id', '/character/123') // { id: '123' }
 */
export function parseParams(pattern, path) {
  const params = {}
  const patternParts = pattern.split('/')
  const pathParts = path.split('/')

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      const paramName = patternParts[i].slice(1)
      params[paramName] = pathParts[i]
    }
  }

  return params
}

/**
 * Get current route location
 * @returns {string} - Current route path without hash
 */
export function getCurrentLocation() {
  return window.location.hash.slice(1) || '/'
}

/**
 * Navigate to a route programmatically
 * @param {string} path - Path to navigate to
 */
export function navigateTo(path) {
  window.location.hash = path
}

/**
 * Go back in history
 */
export function goBack() {
  window.history.back()
}

/**
 * Go forward in history
 */
export function goForward() {
  window.history.forward()
}

export default routes
