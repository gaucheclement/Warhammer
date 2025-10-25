<script>
  /**
   * Admin Dashboard - Main hub for admin functionality
   *
   * Issue #16 Stream B: Admin Dashboard & UI Framework
   *
   * Central dashboard showing statistics and quick access to admin functions.
   * Displays official data counts, custom modifications, and provides navigation
   * to admin tools for editing, reviewing contributions, and exporting data.
   */

  import { onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { requireAdmin, logout } from '../lib/adminAuth.js'
  import { officialData, customModifications } from '../stores/data.js'
  import { adminStore } from '../stores/admin.js'
  import LoadingSpinner from '../components/LoadingSpinner.svelte'

  let isLoading = true
  let stats = {
    totalOfficialEntries: 0,
    officialByType: {},
    totalCustomModifications: 0,
    pendingContributions: 0 // Placeholder for future feature
  }

  // Redirect if not admin
  onMount(() => {
    if (!requireAdmin()) {
      console.warn('Admin access required, redirecting to login')
      push('/admin/login')
      return
    }

    // Calculate stats from stores
    calculateStats()
    isLoading = false
  })

  /**
   * Calculate statistics from data stores
   */
  function calculateStats() {
    const official = $officialData
    const custom = $customModifications

    // Calculate total official entries
    let totalOfficial = 0
    const byType = {}

    const entityTypes = [
      'books', 'careers', 'careerLevels', 'species', 'classes',
      'talents', 'characteristics', 'trappings', 'skills', 'spells',
      'creatures', 'stars', 'gods', 'eyes', 'hairs', 'details',
      'traits', 'lores', 'magicks', 'etats', 'psychologies',
      'qualities', 'trees'
    ]

    for (const type of entityTypes) {
      const count = (official[type] || []).length
      if (count > 0) {
        byType[type] = count
        totalOfficial += count
      }
    }

    // Calculate total custom modifications
    let totalCustom = 0
    for (const type of entityTypes) {
      totalCustom += (custom[type] || []).length
    }

    stats = {
      totalOfficialEntries: totalOfficial,
      officialByType: byType,
      totalCustomModifications: totalCustom,
      pendingContributions: 0 // Placeholder
    }
  }

  /**
   * Format entity type name for display
   */
  function formatTypeName(type) {
    const names = {
      books: 'Books',
      careers: 'Careers',
      careerLevels: 'Career Levels',
      species: 'Species',
      classes: 'Classes',
      talents: 'Talents',
      characteristics: 'Characteristics',
      trappings: 'Trappings',
      skills: 'Skills',
      spells: 'Spells',
      creatures: 'Creatures',
      stars: 'Stars',
      gods: 'Gods',
      eyes: 'Eyes',
      hairs: 'Hairs',
      details: 'Details',
      traits: 'Traits',
      lores: 'Lores',
      magicks: 'Magicks',
      etats: 'States',
      psychologies: 'Psychologies',
      qualities: 'Qualities',
      trees: 'Trees'
    }
    return names[type] || type
  }

  /**
   * Navigate to edit data page (will be created by Stream C)
   */
  function navigateToEditData() {
    // TODO: Update this path once Stream C creates the page
    push('/admin/edit')
  }

  /**
   * Navigate to review contributions page (will be created by Stream D)
   */
  function navigateToReviewContributions() {
    // TODO: Update this path once Stream D creates the page
    push('/admin/review')
  }

  /**
   * Export official database (will be implemented by Stream E)
   */
  function exportDatabase() {
    // TODO: Implement once Stream E provides the export function
    console.log('Export database - to be implemented by Stream E')
    alert('Export functionality will be implemented by Stream E')
  }

  /**
   * Handle logout
   */
  function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
      logout()
      adminStore.logout()
      push('/')
    }
  }

  /**
   * Refresh stats
   */
  function refreshStats() {
    isLoading = true
    setTimeout(() => {
      calculateStats()
      isLoading = false
    }, 300)
  }
</script>

<div class="admin-dashboard">
  <header class="dashboard-header">
    <div class="header-content">
      <div class="title-section">
        <h1>Admin Dashboard</h1>
        <p class="subtitle">Manage official data and community contributions</p>
      </div>
      <div class="header-actions">
        <button class="btn-secondary" on:click={refreshStats}>
          Refresh Stats
        </button>
        <button class="btn-danger" on:click={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  </header>

  {#if isLoading}
    <div class="loading-container">
      <LoadingSpinner />
    </div>
  {:else}
    <div class="dashboard-content">
      <!-- Stats Cards -->
      <section class="stats-section">
        <h2>Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-info">
              <div class="stat-label">Total Official Entries</div>
              <div class="stat-value">{stats.totalOfficialEntries.toLocaleString()}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">✏️</div>
            <div class="stat-info">
              <div class="stat-label">Custom Modifications</div>
              <div class="stat-value">{stats.totalCustomModifications.toLocaleString()}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⏳</div>
            <div class="stat-info">
              <div class="stat-label">Pending Contributions</div>
              <div class="stat-value">{stats.pendingContributions}</div>
              <div class="stat-note">Feature coming soon</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Official Data Breakdown -->
      <section class="breakdown-section">
        <h2>Official Data by Type</h2>
        <div class="breakdown-grid">
          {#each Object.entries(stats.officialByType).sort((a, b) => b[1] - a[1]) as [type, count]}
            <div class="breakdown-item">
              <span class="breakdown-type">{formatTypeName(type)}</span>
              <span class="breakdown-count">{count.toLocaleString()}</span>
            </div>
          {/each}
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="actions-section">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <button class="action-card" on:click={navigateToEditData}>
            <div class="action-icon">📝</div>
            <div class="action-info">
              <h3>Edit Official Data</h3>
              <p>Modify or add entries to the official database</p>
            </div>
            <div class="action-arrow">→</div>
          </button>

          <button class="action-card" on:click={navigateToReviewContributions}>
            <div class="action-icon">👁️</div>
            <div class="action-info">
              <h3>Review Contributions</h3>
              <p>Approve or reject community submissions</p>
            </div>
            <div class="action-arrow">→</div>
          </button>

          <button class="action-card" on:click={exportDatabase}>
            <div class="action-icon">💾</div>
            <div class="action-info">
              <h3>Export Database</h3>
              <p>Download official data as JSON file</p>
            </div>
            <div class="action-arrow">→</div>
          </button>
        </div>
      </section>

      <!-- Recent Activity (Optional - Placeholder) -->
      <section class="activity-section">
        <h2>Recent Activity</h2>
        <div class="activity-placeholder">
          <p>Activity log will be available in a future update</p>
        </div>
      </section>
    </div>
  {/if}
</div>

<style>
  .admin-dashboard {
    min-height: calc(100vh - 60px);
    background: var(--color-bg-secondary, #f5f5f5);
  }

  .dashboard-header {
    background: var(--color-bg-primary, #fff);
    border-bottom: 1px solid var(--color-border, #ddd);
    padding: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .title-section h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .subtitle {
    margin: 0;
    color: var(--color-text-secondary, #666);
    font-size: 1rem;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
  }

  .btn-secondary,
  .btn-danger {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary {
    background: var(--color-bg-secondary, #f5f5f5);
    color: var(--color-text-primary, #333);
    border: 1px solid var(--color-border, #ddd);
  }

  .btn-secondary:hover {
    background: var(--color-bg-hover, #e8e8e8);
  }

  .btn-danger {
    background: #dc3545;
    color: white;
  }

  .btn-danger:hover {
    background: #c82333;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }

  .dashboard-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  section {
    background: var(--color-bg-primary, #fff);
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  section h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 8px;
    border: 1px solid var(--color-border, #ddd);
  }

  .stat-icon {
    font-size: 3rem;
    line-height: 1;
  }

  .stat-info {
    flex: 1;
  }

  .stat-label {
    font-size: 0.9rem;
    color: var(--color-text-secondary, #666);
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-accent, #8b2e1f);
  }

  .stat-note {
    font-size: 0.8rem;
    color: var(--color-text-secondary, #999);
    margin-top: 0.25rem;
    font-style: italic;
  }

  /* Breakdown Grid */
  .breakdown-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .breakdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 6px;
    border: 1px solid var(--color-border, #ddd);
  }

  .breakdown-type {
    font-weight: 500;
    color: var(--color-text-primary, #333);
  }

  .breakdown-count {
    font-weight: 700;
    color: var(--color-accent, #8b2e1f);
  }

  /* Actions Grid */
  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .action-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--color-bg-primary, #fff);
    border: 2px solid var(--color-border, #ddd);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .action-card:hover {
    border-color: var(--color-accent, #8b2e1f);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .action-icon {
    font-size: 2.5rem;
    line-height: 1;
  }

  .action-info {
    flex: 1;
  }

  .action-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: var(--color-text-primary, #333);
  }

  .action-info p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-text-secondary, #666);
  }

  .action-arrow {
    font-size: 1.5rem;
    color: var(--color-accent, #8b2e1f);
    transition: transform 0.2s;
  }

  .action-card:hover .action-arrow {
    transform: translateX(4px);
  }

  /* Activity Section */
  .activity-placeholder {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-secondary, #666);
    font-style: italic;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .dashboard-header {
      padding: 1.5rem 1rem;
    }

    .header-content {
      flex-direction: column;
      align-items: flex-start;
    }

    .title-section h1 {
      font-size: 1.5rem;
    }

    .header-actions {
      width: 100%;
    }

    .btn-secondary,
    .btn-danger {
      flex: 1;
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
    }

    .dashboard-content {
      padding: 1rem;
    }

    section {
      padding: 1.5rem;
    }

    section h2 {
      font-size: 1.25rem;
    }

    .stats-grid,
    .actions-grid {
      grid-template-columns: 1fr;
    }

    .breakdown-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }

    .action-card {
      padding: 1rem;
    }

    .action-icon {
      font-size: 2rem;
    }
  }
</style>
