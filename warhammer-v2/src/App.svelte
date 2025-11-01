<script>
  import { onMount, onDestroy } from 'svelte'
  import Router from 'svelte-spa-router'
  import { initializeDataStores } from './stores/data.js'
  import { initializeAdminStore } from './stores/admin.js'
  import Layout from './layouts/Layout.svelte'
  import { routes, afterRouteChange } from './lib/router.js'
  import ToastContainer from './components/ToastContainer.svelte'
  import OfflineIndicator from './components/OfflineIndicator.svelte'
  // Stream 3: Update Notification
  import UpdateNotification from './components/UpdateNotification.svelte'
  // Issue #38 Stream C: Navigation keyboard shortcuts
  import { initBrowserIntegration, navigateBack, navigateForward } from './stores/navigation.js'

  // Stream 3: Update Notification component reference
  let updateNotification

  // Issue #38 Stream C: Browser integration cleanup function
  let cleanupBrowserIntegration = null

  // Initialize data stores on app mount
  onMount(async () => {
    try {
      await initializeDataStores()
      console.log('Data stores initialized successfully')

      // Issue #16 Stream B: Initialize admin store
      initializeAdminStore()

      // Issue #38 Stream C: Initialize browser history integration
      cleanupBrowserIntegration = initBrowserIntegration()

      // Issue #38 Stream C: Set up keyboard shortcuts
      window.addEventListener('keydown', handleKeyboardShortcuts)
    } catch (error) {
      console.error('Failed to initialize data stores:', error)
    }
  })

  // Issue #38 Stream C: Clean up browser integration and keyboard listeners
  onDestroy(() => {
    if (cleanupBrowserIntegration) {
      cleanupBrowserIntegration()
    }
    window.removeEventListener('keydown', handleKeyboardShortcuts)
  })

  /**
   * Issue #38 Stream C: Handle keyboard shortcuts for navigation
   * Alt+Left: Navigate back
   * Alt+Right: Navigate forward
   */
  function handleKeyboardShortcuts(event) {
    // Alt+Left Arrow: Navigate back
    if (event.altKey && event.key === 'ArrowLeft') {
      event.preventDefault() // Prevent default browser back behavior
      navigateBack()
    }
    // Alt+Right Arrow: Navigate forward
    else if (event.altKey && event.key === 'ArrowRight') {
      event.preventDefault() // Prevent default browser forward behavior
      navigateForward()
    }
  }

  function handleRouteLoaded(event) {
    afterRouteChange(event.detail)
  }

  function handleConditionsFailed(event) {
    console.error('Route conditions failed:', event.detail)
  }

  // Stream 3: Export function for Service Worker to trigger update notification
  export function showUpdateNotification() {
    if (updateNotification) {
      updateNotification.show()
    }
  }
</script>

<!-- Stream 2: Offline Indicator (Issue #18) -->
<OfflineIndicator />

<Layout>
  <Router
    {routes}
    on:routeLoaded={handleRouteLoaded}
    on:conditionsFailed={handleConditionsFailed}
  />
</Layout>

<ToastContainer />

<!-- Stream 3: Update Notification (Issue #18) -->
<UpdateNotification bind:this={updateNotification} />
