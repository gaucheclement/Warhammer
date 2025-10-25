<script>
  import { onMount } from 'svelte'
  import Router from 'svelte-spa-router'
  import { initializeDataStores } from './stores/data.js'
  import { initializeAdminStore } from './stores/admin.js'
  import Layout from './layouts/Layout.svelte'
  import { routes, afterRouteChange } from './lib/router.js'
  import ToastContainer from './components/ToastContainer.svelte'
  import OfflineIndicator from './components/OfflineIndicator.svelte'
  // Stream 3: Update Notification
  import UpdateNotification from './components/UpdateNotification.svelte'

  // Stream 3: Update Notification component reference
  let updateNotification

  // Initialize data stores on app mount
  onMount(async () => {
    try {
      await initializeDataStores()
      console.log('Data stores initialized successfully')

      // Issue #16 Stream B: Initialize admin store
      initializeAdminStore()
    } catch (error) {
      console.error('Failed to initialize data stores:', error)
    }
  })

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
