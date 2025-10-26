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
  import { exportOfficialData } from '../lib/adminExport.js'

  let isLoading = true
  let stats = {
    totalOfficialEntries: 0,
    officialByType: {},
    totalCustomModifications: 0,
    pendingContributions: 0 // Placeholder for future feature
  }
  let metadataStats = {
    byBook: {},
    byFolder: {},
    missingBook: [],
    missingPage: [],
    missingDesc: [],
    completeness: {}
  }
  let selectedBook = 'all'
  let selectedFolder = 'all'
  let showMetadataSection = false

  // Redirect if not admin
  onMount(() => {
    if (!requireAdmin()) {
      console.warn('Admin access required, redirecting to login')
      push('/admin/login')
      return
    }

    // Calculate stats from stores
    calculateStats()
    calculateMetadataStats()
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
   * Navigate to edit data page (Stream C)
   */
  function navigateToEditData() {
    push('/admin/edit-data')
  }

  /**
   * Navigate to review contributions page (Stream D)
   */
  function navigateToReviewContributions() {
    push('/admin/review')
  }

  /**
   * Export official database (Stream E)
   */
  function exportDatabase() {
    try {
      const result = exportOfficialData()
      if (result.success) {
        alert(`✅ Export successful!\n\nFile: ${result.filename}\nSize: ${(result.size / 1024).toFixed(2)} KB\nTotal entities: ${result.stats.total}`)
      } else {
        alert(`❌ Export failed:\n\n${result.errors.join('\n')}`)
      }
    } catch (error) {
      console.error('Export error:', error)
      alert(`❌ Export failed: ${error.message}`)
    }
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
      calculateMetadataStats()
      isLoading = false
    }, 300)
  }

  /**
   * Calculate metadata statistics
   */
  function calculateMetadataStats() {
    const official = $officialData
    const byBook = {}
    const byFolder = {}
    const missingBook = []
    const missingPage = []
    const missingDesc = []
    const completeness = {}

    const entityTypes = [
      'books', 'careers', 'careerLevels', 'species', 'classes',
      'talents', 'characteristics', 'trappings', 'skills', 'spells',
      'creatures', 'stars', 'gods', 'eyes', 'hairs', 'details',
      'traits', 'lores', 'magicks', 'etats', 'psychologies',
      'qualities', 'trees'
    ]

    for (const type of entityTypes) {
      const entities = official[type] || []
      let withBook = 0
      let withPage = 0
      let withDesc = 0

      for (const entity of entities) {
        // Track by book
        if (entity.book) {
          byBook[entity.book] = (byBook[entity.book] || 0) + 1
          withBook++
        } else {
          missingBook.push({ type, id: entity.id, label: entity.label || entity.name || entity.id })
        }

        // Track by folder
        if (entity.folder) {
          byFolder[entity.folder] = (byFolder[entity.folder] || 0) + 1
        }

        // Track page
        if (entity.page) {
          withPage++
        } else if (entity.book) {
          missingPage.push({ type, id: entity.id, label: entity.label || entity.name || entity.id, book: entity.book })
        }

        // Track description
        if (entity.desc || entity.description) {
          withDesc++
        } else {
          missingDesc.push({ type, id: entity.id, label: entity.label || entity.name || entity.id })
        }
      }

      // Calculate completeness for this type
      if (entities.length > 0) {
        completeness[type] = {
          total: entities.length,
          withBook,
          withPage,
          withDesc,
          bookPercent: Math.round((withBook / entities.length) * 100),
          pagePercent: Math.round((withPage / entities.length) * 100),
          descPercent: Math.round((withDesc / entities.length) * 100)
        }
      }
    }

    metadataStats = {
      byBook,
      byFolder,
      missingBook,
      missingPage,
      missingDesc,
      completeness
    }
  }

  /**
   * Get entities filtered by book and folder
   */
  function getFilteredEntities() {
    const official = $officialData
    const results = []

    const entityTypes = [
      'books', 'careers', 'careerLevels', 'species', 'classes',
      'talents', 'characteristics', 'trappings', 'skills', 'spells',
      'creatures', 'stars', 'gods', 'eyes', 'hairs', 'details',
      'traits', 'lores', 'magicks', 'etats', 'psychologies',
      'qualities', 'trees'
    ]

    for (const type of entityTypes) {
      const entities = official[type] || []
      for (const entity of entities) {
        // Apply filters
        if (selectedBook !== 'all' && entity.book !== selectedBook) continue
        if (selectedFolder !== 'all' && entity.folder !== selectedFolder) continue

        results.push({
          type,
          id: entity.id,
          label: entity.label || entity.name || entity.id,
          book: entity.book || '-',
          page: entity.page || '-',
          folder: entity.folder || '-',
          hasDesc: !!(entity.desc || entity.description)
        })
      }
    }

    return results.slice(0, 100) // Limit to 100 for performance
  }

  /**
   * Toggle metadata section
   */
  function toggleMetadataSection() {
    showMetadataSection = !showMetadataSection
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

      <!-- Entity Metadata Section -->
      <section class="metadata-section">
        <div class="section-header">
          <h2>Entity Metadata</h2>
          <button class="btn-toggle" on:click={toggleMetadataSection}>
            {showMetadataSection ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        <!-- Metadata Summary -->
        <div class="metadata-summary">
          <div class="summary-card">
            <div class="summary-icon">📚</div>
            <div class="summary-info">
              <div class="summary-label">Books Referenced</div>
              <div class="summary-value">{Object.keys(metadataStats.byBook).length}</div>
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-icon">📁</div>
            <div class="summary-info">
              <div class="summary-label">Folder Categories</div>
              <div class="summary-value">{Object.keys(metadataStats.byFolder).length}</div>
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-icon">⚠️</div>
            <div class="summary-info">
              <div class="summary-label">Missing Book Reference</div>
              <div class="summary-value">{metadataStats.missingBook.length}</div>
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-icon">📄</div>
            <div class="summary-info">
              <div class="summary-label">Missing Page Number</div>
              <div class="summary-value">{metadataStats.missingPage.length}</div>
            </div>
          </div>
        </div>

        {#if showMetadataSection}
          <!-- Metadata Completeness by Type -->
          <div class="metadata-details">
            <h3>Metadata Completeness by Type</h3>
            <div class="completeness-grid">
              {#each Object.entries(metadataStats.completeness).sort((a, b) => b[1].total - a[1].total) as [type, stats]}
                <div class="completeness-card">
                  <div class="completeness-header">
                    <span class="type-name">{formatTypeName(type)}</span>
                    <span class="type-count">{stats.total} items</span>
                  </div>
                  <div class="completeness-bars">
                    <div class="completeness-bar">
                      <span class="bar-label">Book</span>
                      <div class="bar-container">
                        <div class="bar-fill" style="width: {stats.bookPercent}%"></div>
                      </div>
                      <span class="bar-percent">{stats.bookPercent}%</span>
                    </div>
                    <div class="completeness-bar">
                      <span class="bar-label">Page</span>
                      <div class="bar-container">
                        <div class="bar-fill" style="width: {stats.pagePercent}%"></div>
                      </div>
                      <span class="bar-percent">{stats.pagePercent}%</span>
                    </div>
                    <div class="completeness-bar">
                      <span class="bar-label">Desc</span>
                      <div class="bar-container">
                        <div class="bar-fill" style="width: {stats.descPercent}%"></div>
                      </div>
                      <span class="bar-percent">{stats.descPercent}%</span>
                    </div>
                  </div>
                </div>
              {/each}
            </div>

            <!-- Distribution by Book -->
            <h3>Distribution by Source Book</h3>
            <div class="distribution-grid">
              {#each Object.entries(metadataStats.byBook).sort((a, b) => b[1] - a[1]) as [book, count]}
                <div class="distribution-item">
                  <span class="dist-label">{book}</span>
                  <span class="dist-count">{count.toLocaleString()}</span>
                </div>
              {/each}
            </div>

            <!-- Distribution by Folder -->
            <h3>Distribution by Folder</h3>
            <div class="distribution-grid">
              {#each Object.entries(metadataStats.byFolder).sort((a, b) => b[1] - a[1]) as [folder, count]}
                <div class="distribution-item">
                  <span class="dist-label">{folder || '(none)'}</span>
                  <span class="dist-count">{count.toLocaleString()}</span>
                </div>
              {/each}
            </div>

            <!-- Entity Browser with Filters -->
            <h3>Entity Browser</h3>
            <div class="entity-filters">
              <div class="filter-group">
                <label for="book-filter">Filter by Book:</label>
                <select id="book-filter" bind:value={selectedBook}>
                  <option value="all">All Books</option>
                  {#each Object.keys(metadataStats.byBook).sort() as book}
                    <option value={book}>{book}</option>
                  {/each}
                </select>
              </div>

              <div class="filter-group">
                <label for="folder-filter">Filter by Folder:</label>
                <select id="folder-filter" bind:value={selectedFolder}>
                  <option value="all">All Folders</option>
                  {#each Object.keys(metadataStats.byFolder).sort() as folder}
                    <option value={folder}>{folder || '(none)'}</option>
                  {/each}
                </select>
              </div>
            </div>

            <div class="entity-table-container">
              <table class="entity-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Label</th>
                    <th>Book</th>
                    <th>Page</th>
                    <th>Folder</th>
                    <th>Desc</th>
                  </tr>
                </thead>
                <tbody>
                  {#each getFilteredEntities() as entity}
                    <tr>
                      <td class="cell-type">{formatTypeName(entity.type)}</td>
                      <td class="cell-label">{entity.label}</td>
                      <td class="cell-book">{entity.book}</td>
                      <td class="cell-page">{entity.page}</td>
                      <td class="cell-folder">{entity.folder}</td>
                      <td class="cell-desc">{entity.hasDesc ? '✓' : '-'}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
              <p class="table-note">Showing first 100 results. Use filters to narrow down.</p>
            </div>
          </div>
        {/if}
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

  /* Metadata Section */
  .metadata-section {
    margin-top: 2rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .btn-toggle {
    padding: 0.5rem 1rem;
    background: var(--color-accent, #8b2e1f);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .btn-toggle:hover {
    background: var(--color-accent-hover, #a63728);
  }

  .metadata-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .summary-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 8px;
    border: 1px solid var(--color-border, #ddd);
  }

  .summary-icon {
    font-size: 2.5rem;
    line-height: 1;
  }

  .summary-info {
    flex: 1;
  }

  .summary-label {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #666);
    margin-bottom: 0.5rem;
  }

  .summary-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-accent, #8b2e1f);
  }

  .metadata-details {
    margin-top: 2rem;
  }

  .metadata-details h3 {
    margin: 2rem 0 1rem 0;
    font-size: 1.2rem;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .completeness-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .completeness-card {
    background: var(--color-bg-secondary, #f5f5f5);
    border: 1px solid var(--color-border, #ddd);
    border-radius: 6px;
    padding: 1rem;
  }

  .completeness-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .type-name {
    font-weight: 600;
    color: var(--color-text-primary, #333);
  }

  .type-count {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #666);
  }

  .completeness-bars {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .completeness-bar {
    display: grid;
    grid-template-columns: 40px 1fr 50px;
    align-items: center;
    gap: 0.5rem;
  }

  .bar-label {
    font-size: 0.8rem;
    color: var(--color-text-secondary, #666);
  }

  .bar-container {
    height: 16px;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--color-border, #ddd);
  }

  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-accent, #8b2e1f), #a63728);
    transition: width 0.3s ease;
  }

  .bar-percent {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-text-primary, #333);
    text-align: right;
  }

  .distribution-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .distribution-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border: 1px solid var(--color-border, #ddd);
    border-radius: 6px;
  }

  .dist-label {
    font-size: 0.9rem;
    color: var(--color-text-primary, #333);
  }

  .dist-count {
    font-weight: 700;
    color: var(--color-accent, #8b2e1f);
  }

  .entity-filters {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-group label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text-primary, #333);
  }

  .filter-group select {
    padding: 0.5rem 1rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 6px;
    background: white;
    font-size: 0.9rem;
    color: var(--color-text-primary, #333);
    cursor: pointer;
    min-width: 200px;
  }

  .filter-group select:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .entity-table-container {
    overflow-x: auto;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 6px;
    padding: 1rem;
  }

  .entity-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
  }

  .entity-table thead {
    background: var(--color-bg-secondary, #f5f5f5);
  }

  .entity-table th {
    padding: 0.75rem;
    text-align: left;
    font-weight: 600;
    color: var(--color-text-primary, #333);
    border-bottom: 2px solid var(--color-border, #ddd);
    font-size: 0.9rem;
  }

  .entity-table td {
    padding: 0.75rem;
    border-bottom: 1px solid var(--color-border, #ddd);
    font-size: 0.9rem;
  }

  .entity-table tbody tr:hover {
    background: var(--color-bg-secondary, #f5f5f5);
  }

  .cell-type {
    color: var(--color-text-secondary, #666);
    font-size: 0.85rem;
  }

  .cell-label {
    color: var(--color-text-primary, #333);
    font-weight: 500;
  }

  .cell-book,
  .cell-page,
  .cell-folder {
    color: var(--color-text-secondary, #666);
  }

  .cell-desc {
    text-align: center;
    color: var(--color-accent, #8b2e1f);
    font-weight: bold;
  }

  .table-note {
    margin-top: 1rem;
    font-size: 0.85rem;
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

    .metadata-summary {
      grid-template-columns: 1fr;
    }

    .completeness-grid,
    .distribution-grid {
      grid-template-columns: 1fr;
    }

    .entity-filters {
      flex-direction: column;
    }

    .filter-group select {
      min-width: 100%;
    }

    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .btn-toggle {
      width: 100%;
    }
  }
</style>
