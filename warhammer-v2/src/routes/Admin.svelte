<script>
  import { onMount } from 'svelte'
  import { getInitStatus, forceReInitialize } from '../lib/initData.js'
  import { initializeDataStores, mergedData, getCustomModificationsCount } from '../stores/data.js'
  import { runAllTests } from '../lib/__tests__/dataLayer.test.js'

  let status = null
  let loading = true
  let reInitializing = false
  let dataStoresInitialized = false
  let customModsCount = 0
  let activeTab = 'database'

  const tabs = [
    { id: 'database', name: 'Database', icon: '💾' },
    { id: 'data', name: 'Data Management', icon: '📊' },
    { id: 'testing', name: 'Testing', icon: '🧪' },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧' }
  ]

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

  function handleExportData() {
    alert('Data export functionality will be implemented in future tasks')
  }

  function handleImportData() {
    alert('Data import functionality will be implemented in future tasks')
  }

  function handleClearCache() {
    if (confirm('Clear all cached data?')) {
      alert('Cache clearing will be implemented in future tasks')
    }
  }

  function handleBackup() {
    alert('Database backup will be implemented in future tasks')
  }

  function handleRestore() {
    alert('Database restore will be implemented in future tasks')
  }
</script>

<div class="admin-page">
  <header class="page-header">
    <h1>Admin Panel</h1>
    <p class="subtitle">Database management and system administration</p>
  </header>

  <div class="tab-navigation">
    {#each tabs as tab}
      <button
        class="tab-btn"
        class:active={activeTab === tab.id}
        on:click={() => activeTab = tab.id}
      >
        <span class="tab-icon">{tab.icon}</span>
        <span class="tab-name">{tab.name}</span>
      </button>
    {/each}
  </div>

  <div class="admin-content">
    {#if activeTab === 'database'}
      <div class="tab-panel">
        <h2>Database Status</h2>

        {#if loading}
          <div class="loading-state">
            <p>Loading database status...</p>
          </div>
        {:else if status}
          <div class="status-card">
            <div class="status-info">
              <div class="status-row">
                <span class="label">Initialized:</span>
                <span class="value" class:success={status.initialized} class:error={!status.initialized}>
                  {status.initialized ? 'Yes' : 'No'}
                </span>
              </div>
              <div class="status-row">
                <span class="label">Data Version:</span>
                <span class="value">{status.version || 'N/A'}</span>
              </div>
              <div class="status-row">
                <span class="label">Current Version:</span>
                <span class="value">{status.currentVersion}</span>
              </div>
            </div>

            {#if status.initialized && status.stats}
              <div class="stats-section">
                <h3>Data Statistics</h3>
                <div class="stats-grid">
                  {#each Object.entries(status.stats) as [table, count]}
                    <div class="stat-item">
                      <span class="stat-label">{table}</span>
                      <span class="stat-count">{count}</span>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}

            {#if dataStoresInitialized}
              <div class="stores-section">
                <h3>Data Stores</h3>
                <div class="status-row">
                  <span class="label">Status:</span>
                  <span class="value success">Initialized</span>
                </div>
                <div class="status-row">
                  <span class="label">Custom Modifications:</span>
                  <span class="value">{customModsCount}</span>
                </div>
              </div>
            {/if}
          </div>

          <div class="actions-section">
            <button class="btn btn-secondary" on:click={loadStatus} disabled={reInitializing}>
              Refresh Status
            </button>
            <button class="btn btn-danger" on:click={handleReInitialize} disabled={reInitializing}>
              {reInitializing ? 'Re-initializing...' : 'Re-initialize Database'}
            </button>
          </div>
        {/if}
      </div>
    {:else if activeTab === 'data'}
      <div class="tab-panel">
        <h2>Data Management</h2>
        <p class="description">Import, export, and manage game data.</p>

        <div class="action-cards">
          <div class="action-card">
            <h3>Export Data</h3>
            <p>Export all game data to JSON format for backup or sharing.</p>
            <button class="btn btn-primary" on:click={handleExportData}>Export</button>
          </div>

          <div class="action-card">
            <h3>Import Data</h3>
            <p>Import game data from JSON files to update or restore data.</p>
            <button class="btn btn-primary" on:click={handleImportData}>Import</button>
          </div>

          <div class="action-card">
            <h3>Custom Modifications</h3>
            <p>View and manage custom modifications to game data.</p>
            <button class="btn btn-secondary">Manage ({customModsCount})</button>
          </div>
        </div>
      </div>
    {:else if activeTab === 'testing'}
      <div class="tab-panel">
        <h2>Testing & Diagnostics</h2>
        <p class="description">Run tests and diagnostics on the data layer.</p>

        <div class="test-section">
          <div class="test-card">
            <h3>Data Layer Tests</h3>
            <p>Run comprehensive tests on the data layer functionality.</p>
            <button
              class="btn btn-primary"
              on:click={handleRunTests}
              disabled={!dataStoresInitialized}
            >
              Run Tests
            </button>
          </div>

          <div class="test-info">
            <p class="note">
              Tests will run in the browser console. Open Developer Tools to see detailed results.
            </p>
          </div>
        </div>
      </div>
    {:else if activeTab === 'maintenance'}
      <div class="tab-panel">
        <h2>Maintenance</h2>
        <p class="description">Perform maintenance tasks and system cleanup.</p>

        <div class="action-cards">
          <div class="action-card">
            <h3>Clear Cache</h3>
            <p>Clear all cached data to free up storage space.</p>
            <button class="btn btn-secondary" on:click={handleClearCache}>Clear Cache</button>
          </div>

          <div class="action-card">
            <h3>Backup Database</h3>
            <p>Create a complete backup of the database.</p>
            <button class="btn btn-primary" on:click={handleBackup}>Create Backup</button>
          </div>

          <div class="action-card">
            <h3>Restore Database</h3>
            <p>Restore database from a previous backup.</p>
            <button class="btn btn-danger" on:click={handleRestore}>Restore</button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .admin-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .page-header h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .subtitle {
    color: var(--color-text-secondary, #666);
    margin: 0;
  }

  .tab-navigation {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    border-bottom: 2px solid var(--color-border, #ddd);
    overflow-x: auto;
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    color: var(--color-text-secondary, #666);
    transition: all 0.2s;
    white-space: nowrap;
  }

  .tab-btn:hover {
    color: var(--color-text-primary, #333);
    background: var(--color-bg-secondary, #f5f5f5);
  }

  .tab-btn.active {
    color: var(--color-accent, #8b2e1f);
    border-bottom-color: var(--color-accent, #8b2e1f);
  }

  .tab-icon {
    font-size: 1.2rem;
  }

  .admin-content {
    background: var(--color-bg-secondary, #f5f5f5);
    padding: 2rem;
    border-radius: 8px;
    min-height: 500px;
  }

  .tab-panel h2 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .description {
    color: var(--color-text-secondary, #666);
    margin: 0 0 2rem 0;
  }

  .loading-state {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-secondary, #666);
  }

  .status-card {
    background: var(--color-bg-primary, white);
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .status-info,
  .stores-section {
    margin-bottom: 2rem;
  }

  .status-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .status-row:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: 600;
    color: var(--color-text-secondary, #666);
  }

  .value {
    color: var(--color-text-primary, #333);
  }

  .success {
    color: #28a745;
    font-weight: bold;
  }

  .error {
    color: #dc3545;
    font-weight: bold;
  }

  .stats-section,
  .stores-section {
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border, #ddd);
  }

  .stats-section h3,
  .stores-section h3 {
    margin: 0 0 1rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1.1rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.75rem;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 6px;
  }

  .stat-label {
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
  }

  .stat-count {
    font-weight: bold;
    color: var(--color-accent, #8b2e1f);
  }

  .actions-section {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .action-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .action-card {
    background: var(--color-bg-primary, white);
    padding: 1.5rem;
    border-radius: 8px;
  }

  .action-card h3 {
    margin: 0 0 0.75rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1.1rem;
  }

  .action-card p {
    margin: 0 0 1rem 0;
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .test-section {
    display: grid;
    gap: 1.5rem;
  }

  .test-card {
    background: var(--color-bg-primary, white);
    padding: 1.5rem;
    border-radius: 8px;
  }

  .test-card h3 {
    margin: 0 0 0.75rem 0;
    color: var(--color-text-primary, #333);
  }

  .test-card p {
    margin: 0 0 1rem 0;
    color: var(--color-text-secondary, #666);
  }

  .test-info {
    padding: 1rem;
    background: var(--color-bg-primary, white);
    border-left: 4px solid var(--color-accent, #8b2e1f);
    border-radius: 4px;
  }

  .note {
    margin: 0;
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: var(--color-accent, #8b2e1f);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--color-accent-hover, #a63728);
  }

  .btn-secondary {
    background: var(--color-bg-secondary, #f5f5f5);
    color: var(--color-text-primary, #333);
    border: 1px solid var(--color-border, #ddd);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--color-bg-tertiary, #e5e5e5);
  }

  .btn-danger {
    background: #dc3545;
    color: white;
  }

  .btn-danger:hover:not(:disabled) {
    background: #c82333;
  }

  @media (max-width: 768px) {
    .admin-page {
      padding: 1rem;
    }

    .page-header h1 {
      font-size: 1.5rem;
    }

    .admin-content {
      padding: 1rem;
    }

    .action-cards {
      grid-template-columns: 1fr;
    }

    .actions-section {
      flex-direction: column;
    }

    .actions-section .btn {
      width: 100%;
    }
  }
</style>
