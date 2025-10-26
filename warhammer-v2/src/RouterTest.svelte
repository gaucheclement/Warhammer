<script>
  /**
   * Router Test Component
   * This demonstrates the routing system working independently
   * Stream 1 will integrate this into App.svelte with the Layout
   */
  import { onMount } from 'svelte'
  import Router from 'svelte-spa-router'
  import { routes, afterRouteChange } from './lib/router.js'
  import { initializeDataStores } from './stores/data.js'

  let dataStoresInitialized = false
  let initError = null

  onMount(async () => {
    try {
      await initializeDataStores()
      dataStoresInitialized = true
      console.log('Data stores initialized successfully')
    } catch (error) {
      console.error('Failed to initialize data stores:', error)
      initError = error.message
    }
  })

  function handleRouteLoaded(event) {
    afterRouteChange(event.detail)
  }
</script>

<div class="router-test">
  {#if initError}
    <div class="init-error">
      <h1>Initialization Error</h1>
      <p>Failed to initialize the application: {initError}</p>
      <button on:click={() => window.location.reload()}>Reload</button>
    </div>
  {:else if !dataStoresInitialized}
    <div class="loading-screen">
      <div class="loader"></div>
      <p>Loading Warhammer Fantasy 4e...</p>
    </div>
  {:else}
    <Router
      {routes}
      on:routeLoaded={handleRouteLoaded}
    />
  {/if}
</div>

<style>
  .router-test {
    min-height: 100vh;
  }

  .init-error {
    text-align: center;
    padding: 3rem;
  }

  .init-error h1 {
    color: #dc3545;
    margin-bottom: 1rem;
  }

  .init-error button {
    padding: 0.75rem 1.5rem;
    background: var(--color-accent, #8b2e1f);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    color: var(--color-text-secondary, #666);
  }

  .loader {
    border: 4px solid var(--color-bg-secondary, #f5f5f5);
    border-top: 4px solid var(--color-accent, #8b2e1f);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
