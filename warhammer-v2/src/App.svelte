<script>
  import { onMount } from 'svelte'
  import { getInitStatus, forceReInitialize } from './lib/initData.js'

  let status = null
  let loading = true
  let reInitializing = false

  onMount(async () => {
    await loadStatus()
  })

  async function loadStatus() {
    loading = true
    status = await getInitStatus()
    loading = false
  }

  async function handleReInitialize() {
    if (confirm('This will clear and reload all data. Continue?')) {
      reInitializing = true
      const result = await forceReInitialize()
      reInitializing = false
      await loadStatus()
      alert(result.success ? 'Re-initialization successful!' : `Error: ${result.error}`)
    }
  }
</script>

<main>
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
      </div>
    </div>
  {/if}

  <div class="info">
    <p>This is the foundational build of the Warhammer Fantasy 4e application.</p>
    <p>The application uses a single HTML file with embedded data and IndexedDB for storage.</p>
  </div>
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
  }

  h1 {
    color: #333;
    text-align: center;
    margin-bottom: 2rem;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  .status-card {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  h2 {
    margin-top: 0;
    color: #444;
  }

  .status-info p {
    margin: 0.5rem 0;
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
    margin-top: 2rem;
  }

  h3 {
    color: #555;
    margin-bottom: 1rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.5rem;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    background: white;
    border-radius: 4px;
  }

  .stat-label {
    color: #666;
  }

  .stat-count {
    font-weight: bold;
    color: #333;
  }

  .actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
  }

  button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: #007bff;
    color: white;
    transition: background 0.2s;
  }

  button:hover:not(:disabled) {
    background: #0056b3;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button.danger {
    background: #dc3545;
  }

  button.danger:hover:not(:disabled) {
    background: #c82333;
  }

  .info {
    text-align: center;
    color: #666;
    margin-top: 2rem;
    padding: 1rem;
    border-top: 1px solid #ddd;
  }

  .info p {
    margin: 0.5rem 0;
  }
</style>
