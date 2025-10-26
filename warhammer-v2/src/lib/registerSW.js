/**
 * Service Worker Registration
 *
 * Handles Service Worker registration, lifecycle management, and update detection.
 * Integrates with vite-plugin-pwa for automatic PWA functionality.
 */

let updateNotificationComponent = null

/**
 * Register the update notification component
 * This allows the SW to show update notifications when new versions are available
 * @param {Object} component - UpdateNotification component instance with show() method
 */
export function registerUpdateNotification(component) {
  updateNotificationComponent = component
}

/**
 * Initialize Service Worker registration
 * This is called automatically by vite-plugin-pwa's inline injection
 * But we export it for manual control if needed
 */
export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // The vite-plugin-pwa will inject the registration code inline
      // This function serves as a hook for additional SW logic if needed

      // Listen for controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker: New version activated')
      })

      // Check for updates periodically (every hour)
      if (navigator.serviceWorker.controller) {
        setInterval(() => {
          navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' })
        }, 60 * 60 * 1000) // 1 hour
      }
    })
  }
}

/**
 * Handle Service Worker update events
 * This is called by the injected vite-plugin-pwa code when an update is found
 * @param {ServiceWorkerRegistration} registration - The SW registration object
 */
export function onSWUpdate(registration) {
  console.log('Service Worker: Update available')

  // Show update notification if component is registered
  if (updateNotificationComponent && typeof updateNotificationComponent.show === 'function') {
    updateNotificationComponent.show()
  } else {
    console.warn('Service Worker: Update available but no notification component registered')
  }
}

/**
 * Manually check for Service Worker updates
 * Can be called by UI components to force an update check
 */
export async function checkForUpdates() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.update()
        console.log('Service Worker: Manual update check completed')
      }
    } catch (error) {
      console.error('Service Worker: Update check failed', error)
    }
  }
}

/**
 * Get Service Worker status information
 * Useful for debugging and status displays
 * @returns {Object} Status information
 */
export function getSWStatus() {
  return {
    supported: 'serviceWorker' in navigator,
    active: navigator.serviceWorker?.controller !== null,
    registration: navigator.serviceWorker?.controller
  }
}

// Initialize SW registration when module loads
if (typeof window !== 'undefined') {
  registerSW()
}
