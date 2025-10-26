<script>
  /**
   * DataTable Demo Component
   *
   * Demonstrates the virtualized DataTable with 1000+ rows
   * Includes performance monitoring and testing features
   */

  import { onMount } from 'svelte';
  import DataTable from '../components/DataTable.svelte';
  import {
    generateMockData,
    generateSimpleData,
    mockCharacterColumns,
    simpleColumns,
    sortData
  } from './testData.js';

  // State
  let dataSize = $state(1000);
  let data = $state([]);
  let sortedData = $state([]);
  let columns = $state(mockCharacterColumns);
  let sortKey = $state(null);
  let sortDirection = $state('asc');
  let selectedItems = $state([]);
  let enableSelection = $state(true);
  let tableHeight = $state('600px');
  let useSimpleData = $state(false);

  // Performance metrics
  let fps = $state(0);
  let lastFrameTime = 0;
  let frameCount = 0;
  let fpsHistory = $state([]);
  let isMonitoringFPS = $state(false);

  // Initialize data
  onMount(() => {
    regenerateData();
  });

  // Update sorted data when sort changes
  $effect(() => {
    if (sortKey) {
      sortedData = sortData(data, sortKey, sortDirection);
    } else {
      sortedData = data;
    }
  });

  /**
   * Generate new data
   */
  function regenerateData() {
    if (useSimpleData) {
      data = generateSimpleData(dataSize);
      columns = simpleColumns;
    } else {
      data = generateMockData(dataSize);
      columns = mockCharacterColumns;
    }
    sortKey = null;
    sortDirection = 'asc';
    selectedItems = [];
  }

  /**
   * Handle sort
   */
  function handleSort(key, direction) {
    sortKey = key;
    sortDirection = direction;
  }

  /**
   * Handle selection change
   */
  function handleSelectionChange(newSelection) {
    selectedItems = newSelection;
  }

  /**
   * Handle row click
   */
  function handleRowClick(item) {
    console.log('Row clicked:', item);
  }

  /**
   * Start FPS monitoring
   */
  function startFPSMonitoring() {
    if (isMonitoringFPS) return;

    isMonitoringFPS = true;
    fpsHistory = [];
    lastFrameTime = performance.now();
    frameCount = 0;

    const measureFPS = () => {
      if (!isMonitoringFPS) return;

      const now = performance.now();
      frameCount++;

      // Update FPS every second
      if (now - lastFrameTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (now - lastFrameTime));
        fpsHistory = [...fpsHistory, fps].slice(-30); // Keep last 30 samples
        frameCount = 0;
        lastFrameTime = now;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  /**
   * Stop FPS monitoring
   */
  function stopFPSMonitoring() {
    isMonitoringFPS = false;
  }

  /**
   * Calculate average FPS
   */
  let averageFPS = $derived(
    fpsHistory.length > 0
      ? Math.round(fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length)
      : 0
  );

  /**
   * Calculate minimum FPS
   */
  let minFPS = $derived(
    fpsHistory.length > 0 ? Math.min(...fpsHistory) : 0
  );
</script>

<div class="demo-container">
  <header class="demo-header">
    <h1>DataTable Performance Demo</h1>
    <p>Testing virtualized table with {data.length.toLocaleString()} rows</p>
  </header>

  <div class="demo-controls">
    <div class="control-group">
      <label for="dataSize">Number of Rows:</label>
      <input
        id="dataSize"
        type="number"
        bind:value={dataSize}
        min="10"
        max="10000"
        step="100"
      />
      <button onclick={regenerateData}>Regenerate Data</button>
    </div>

    <div class="control-group">
      <label for="tableHeight">Table Height:</label>
      <input
        id="tableHeight"
        type="text"
        bind:value={tableHeight}
        placeholder="600px"
      />
    </div>

    <div class="control-group">
      <label>
        <input type="checkbox" bind:checked={enableSelection} />
        Enable Selection
      </label>
    </div>

    <div class="control-group">
      <label>
        <input type="checkbox" bind:checked={useSimpleData} onchange={regenerateData} />
        Use Simple Data
      </label>
    </div>

    <div class="control-group">
      {#if !isMonitoringFPS}
        <button onclick={startFPSMonitoring} class="fps-button">
          Start FPS Monitoring
        </button>
      {:else}
        <button onclick={stopFPSMonitoring} class="fps-button fps-button--active">
          Stop FPS Monitoring
        </button>
      {/if}
    </div>
  </div>

  {#if isMonitoringFPS}
    <div class="fps-display">
      <div class="fps-metric">
        <span class="fps-label">Current FPS:</span>
        <span class="fps-value" class:fps-value--good={fps >= 55} class:fps-value--warning={fps >= 30 && fps < 55} class:fps-value--bad={fps < 30}>
          {fps}
        </span>
      </div>
      <div class="fps-metric">
        <span class="fps-label">Average FPS:</span>
        <span class="fps-value">{averageFPS}</span>
      </div>
      <div class="fps-metric">
        <span class="fps-label">Min FPS:</span>
        <span class="fps-value">{minFPS}</span>
      </div>
      <div class="fps-history">
        {#each fpsHistory.slice(-10) as fpsValue}
          <div
            class="fps-bar"
            style:height={`${(fpsValue / 60) * 100}%`}
            class:fps-bar--good={fpsValue >= 55}
            class:fps-bar--warning={fpsValue >= 30 && fpsValue < 55}
            class:fps-bar--bad={fpsValue < 30}
          ></div>
        {/each}
      </div>
    </div>
  {/if}

  {#if selectedItems.length > 0}
    <div class="selection-info">
      Selected {selectedItems.length} of {data.length} items
      <button onclick={() => (selectedItems = [])} class="clear-button">Clear Selection</button>
    </div>
  {/if}

  <div class="demo-table">
    <DataTable
      data={sortedData}
      {columns}
      {sortKey}
      {sortDirection}
      onSort={handleSort}
      {enableSelection}
      {selectedItems}
      onSelectionChange={handleSelectionChange}
      onRowClick={handleRowClick}
      height={tableHeight}
      emptyMessage="No data available. Click 'Regenerate Data' to create test data."
    />
  </div>

  <div class="demo-info">
    <h3>Performance Tips:</h3>
    <ul>
      <li>Scroll rapidly to test FPS performance</li>
      <li>Target: 60 FPS for smooth scrolling</li>
      <li>Acceptable: 30-60 FPS</li>
      <li>Virtual scrolling renders only ~50-100 visible rows at a time</li>
      <li>Total dataset can contain 10,000+ rows without performance issues</li>
    </ul>

    <h3>Features:</h3>
    <ul>
      <li>Virtual scrolling for efficient rendering</li>
      <li>Column sorting (click headers)</li>
      <li>Row selection with checkboxes</li>
      <li>Responsive design (320px - 2560px)</li>
      <li>Touch-friendly targets (48px minimum)</li>
      <li>Keyboard accessible</li>
    </ul>
  </div>
</div>

<style>
  .demo-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: var(--spacing-lg, 1.5rem);
  }

  .demo-header {
    margin-bottom: var(--spacing-lg, 1.5rem);
    text-align: center;
  }

  .demo-header h1 {
    margin: 0 0 var(--spacing-sm, 0.5rem) 0;
    color: var(--color-text-primary, #e8e0d5);
    font-size: 2rem;
  }

  .demo-header p {
    margin: 0;
    color: var(--color-text-secondary, #b8a89a);
  }

  .demo-controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md, 1rem);
    margin-bottom: var(--spacing-lg, 1.5rem);
    padding: var(--spacing-md, 1rem);
    background-color: var(--color-bg-secondary, #2a221a);
    border-radius: 4px;
  }

  .control-group {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm, 0.5rem);
  }

  .control-group label {
    font-size: 0.875rem;
    color: var(--color-text-primary, #e8e0d5);
    white-space: nowrap;
  }

  .control-group input[type="number"],
  .control-group input[type="text"] {
    width: 120px;
    padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
    background-color: var(--color-bg-primary, #1a1410);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    color: var(--color-text-primary, #e8e0d5);
    font-size: 0.875rem;
  }

  .control-group input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  button {
    padding: var(--spacing-xs, 0.25rem) var(--spacing-md, 1rem);
    background-color: var(--color-accent, #8b2e1f);
    color: white;
    border: none;
    border-radius: 3px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.15s;
  }

  button:hover {
    background-color: var(--color-accent-hover, #a63728);
  }

  .fps-button--active {
    background-color: #2d7a2d;
  }

  .fps-button--active:hover {
    background-color: #358535;
  }

  .fps-display {
    display: flex;
    gap: var(--spacing-lg, 1.5rem);
    align-items: center;
    margin-bottom: var(--spacing-lg, 1.5rem);
    padding: var(--spacing-md, 1rem);
    background-color: rgba(139, 46, 31, 0.1);
    border: 1px solid var(--color-accent, #8b2e1f);
    border-radius: 4px;
  }

  .fps-metric {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs, 0.25rem);
  }

  .fps-label {
    font-size: 0.75rem;
    color: var(--color-text-secondary, #b8a89a);
  }

  .fps-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text-primary, #e8e0d5);
  }

  .fps-value--good {
    color: #4caf50;
  }

  .fps-value--warning {
    color: #ff9800;
  }

  .fps-value--bad {
    color: #f44336;
  }

  .fps-history {
    flex: 1;
    display: flex;
    gap: 4px;
    align-items: flex-end;
    height: 60px;
  }

  .fps-bar {
    flex: 1;
    min-width: 8px;
    background-color: var(--color-accent, #8b2e1f);
    border-radius: 2px 2px 0 0;
    transition: height 0.2s ease;
  }

  .fps-bar--good {
    background-color: #4caf50;
  }

  .fps-bar--warning {
    background-color: #ff9800;
  }

  .fps-bar--bad {
    background-color: #f44336;
  }

  .selection-info {
    margin-bottom: var(--spacing-md, 1rem);
    padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
    background-color: rgba(139, 46, 31, 0.15);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-text-primary, #e8e0d5);
  }

  .clear-button {
    padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
    font-size: 0.75rem;
  }

  .demo-table {
    margin-bottom: var(--spacing-lg, 1.5rem);
  }

  .demo-info {
    padding: var(--spacing-md, 1rem);
    background-color: var(--color-bg-secondary, #2a221a);
    border-radius: 4px;
  }

  .demo-info h3 {
    margin: var(--spacing-md, 1rem) 0 var(--spacing-sm, 0.5rem) 0;
    color: var(--color-text-primary, #e8e0d5);
    font-size: 1rem;
  }

  .demo-info h3:first-child {
    margin-top: 0;
  }

  .demo-info ul {
    margin: 0;
    padding-left: var(--spacing-lg, 1.5rem);
    color: var(--color-text-secondary, #b8a89a);
    font-size: 0.875rem;
  }

  .demo-info li {
    margin-bottom: var(--spacing-xs, 0.25rem);
  }

  @media (max-width: 768px) {
    .demo-controls {
      flex-direction: column;
      align-items: stretch;
    }

    .control-group {
      flex-direction: column;
      align-items: stretch;
    }

    .control-group label {
      text-align: left;
    }

    .control-group input[type="number"],
    .control-group input[type="text"] {
      width: 100%;
    }

    .fps-display {
      flex-direction: column;
      align-items: stretch;
    }

    .fps-metric {
      flex-direction: row;
      justify-content: space-between;
    }
  }
</style>
