<script>
  import { onMount } from 'svelte'
  import Router from 'svelte-spa-router'
  import { initializeDataStores } from './stores/data.js'
  import Layout from './layouts/Layout.svelte'
  import { routes, afterRouteChange } from './lib/router.js'
  import ToastContainer from './components/ToastContainer.svelte'

  // Initialize data stores on app mount
  onMount(async () => {
    try {
      await initializeDataStores()
      console.log('Data stores initialized successfully')
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
</script>

<Layout>
  <Router
    {routes}
    on:routeLoaded={handleRouteLoaded}
    on:conditionsFailed={handleConditionsFailed}
  />
</Layout>

<ToastContainer />
