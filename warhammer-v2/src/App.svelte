<script>
  import { onMount } from 'svelte'
  import { getInitStatus, forceReInitialize } from './lib/initData.js'
  import { initializeDataStores, mergedData, getCustomModificationsCount } from './stores/data.js'
  import { runAllTests } from './lib/__tests__/dataLayer.test.js'
  import Layout from './layouts/Layout.svelte'

  let status = null
  let loading = true
  let reInitializing = false
  let dataStoresInitialized = false
  let customModsCount = 0

  onMount(async () => {
    await loadStatus()
    await initStores()
  })

  async function loadStatus() {
    loading = true
    status = await getInitStatus()
    loading = false
  }

  async function initStores() {
    try {
      await initializeDataStores()
      dataStoresInitialized = true
      customModsCount = getCustomModificationsCount()
      console.log('Data stores initialized successfully')
    } catch (error) {
      console.error('Failed to initialize data stores:', error)
    }
  }

  async function handleReInitialize() {
    if (confirm('This will clear and reload all data. Continue?')) {
      reInitializing = true
      const result = await forceReInitialize()
      reInitializing = false
      await loadStatus()
      await initStores()
      alert(result.success ? 'Re-initialization successful!' : `Error: ${result.error}`)
    }
  }

  function handleRunTests() {
    console.log('Running data layer tests...')
    const success = runAllTests()
    alert(success ? 'All tests passed! Check console for details.' : 'Some tests failed. Check console for details.')
  }
</script>

<Layout>
  <div class="content-wrapper">
  <h1>Warhammer Fantasy 4e - Version 2</h1>

  {#if loading}
    <div class="loading">
      <p>Loading database status...</p>
    </div>
  {:else if status}
    <div class="status-card">
      <h2>Database Status</h2>
      <div class="status-info">
        <p>
          <strong>Initialized:</strong>
          <span class:success={status.initialized} class:error={!status.initialized}>
            {status.initialized ? 'Yes' : 'No'}
          </span>
        </p>
        <p><strong>Data Version:</strong> {status.version || 'N/A'}</p>
        <p><strong>Current Version:</strong> {status.currentVersion}</p>
      </div>

      {#if status.initialized && status.stats}
        <div class="stats">
          <h3>Data Statistics</h3>
          <div class="stats-grid">
            {#each Object.entries(status.stats) as [table, count]}
              <div class="stat-item">
                <span class="stat-label">{table}:</span>
                <span class="stat-count">{count}</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <div class="actions">
        <button on:click={loadStatus} disabled={reInitializing}>
          Refresh Status
        </button>
        <button on:click={handleReInitialize} disabled={reInitializing} class="danger">
          {reInitializing ? 'Re-initializing...' : 'Re-initialize Data'}
        </button>
        <button on:click={handleRunTests} disabled={!dataStoresInitialized} class="test">
          Run Data Layer Tests
        </button>
      </div>

      {#if dataStoresInitialized}
        <div class="stores-info">
          <h3>Data Stores</h3>
          <p><strong>Status:</strong> <span class="success">Initialized</span></p>
          <p><strong>Custom Modifications:</strong> {customModsCount}</p>
        </div>
      {/if}
    </div>
  {/if}

  <div class="info">
    <p>This is the foundational build of the Warhammer Fantasy 4e application.</p>
    <p>The application uses a single HTML file with embedded data and IndexedDB for storage.</p>
    <p><strong>Task #15:</strong> Data Layer & State Management implemented with Svelte stores, search engine, and CRUD operations.</p>
    <p><strong>Task #17 (Stream 1):</strong> Layout System & Responsive Design implemented with CSS Grid and mobile-first approach.</p>
  </div>
  </div>
</Layout>

<style>
  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-lg, 1.5rem);
  }

  h1 {
    color: var(--color-text-primary);
    text-align: center;
    margin-bottom: var(--spacing-xl, 2rem);
    font-family: var(--font-heading);
  }

  .loading {
    text-align: center;
    padding: var(--spacing-xl, 2rem);
    color: var(--color-text-secondary);
  }

  .status-card {
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md, 8px);
    padding: var(--spacing-xl, 2rem);
    margin-bottom: var(--spacing-xl, 2rem);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border);
  }

  h2 {
    margin-top: 0;
    color: var(--color-text-primary);
  }

  .status-info p {
    margin: var(--spacing-sm, 0.5rem) 0;
    font-size: 1.1rem;
  }

  .success {
    color: #28a745;
    font-weight: bold;
  }

  .error {
    color: #dc3545;
    font-weight: bold;
  }

  .stats {
    margin-top: var(--spacing-xl, 2rem);
  }

  h3 {
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-md, 1rem);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-sm, 0.5rem);
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-sm, 0.5rem);
    background: var(--color-bg-primary);
    border-radius: var(--radius-sm, 4px);
    border: 1px solid var(--color-border);
  }

  .stat-label {
    color: var(--color-text-secondary);
  }

  .stat-count {
    font-weight: bold;
    color: var(--color-text-primary);
  }

  .actions {
    margin-top: var(--spacing-xl, 2rem);
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md, 1rem);
  }

  button.danger {
    background: #dc3545;
  }

  button.danger:hover:not(:disabled) {
    background: #c82333;
  }

  button.test {
    background: #28a745;
  }

  button.test:hover:not(:disabled) {
    background: #218838;
  }

  .stores-info {
    margin-top: var(--spacing-xl, 2rem);
    padding-top: var(--spacing-xl, 2rem);
    border-top: 1px solid var(--color-border);
  }

  .stores-info p {
    margin: var(--spacing-sm, 0.5rem) 0;
  }

  .info {
    text-align: center;
    color: var(--color-text-secondary);
    margin-top: var(--spacing-xl, 2rem);
    padding: var(--spacing-md, 1rem);
    border-top: 1px solid var(--color-border);
  }

  .info p {
    margin: var(--spacing-sm, 0.5rem) 0;
    font-size: 0.9rem;
  }

  /* Mobile responsive */
  @media (max-width: 767px) {
    .content-wrapper {
      padding: var(--spacing-md, 1rem);
    }

    .status-card {
      padding: var(--spacing-md, 1rem);
    }

    .actions {
      flex-direction: column;
    }

    .actions button {
      width: 100%;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
