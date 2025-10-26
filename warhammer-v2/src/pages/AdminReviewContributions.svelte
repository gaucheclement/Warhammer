<script>
  /**
   * Admin Review Contributions Page
   *
   * Issue #16 Stream D: Community Contribution Review Workflow
   *
   * Allows admins to upload, review, and approve/reject community contributions.
   * Features:
   * - Upload JSON contribution files
   * - Parse and validate contributions
   * - Display before/after diffs for modifications
   * - Approve/reject/edit individual entries
   * - Bulk approve/reject all entries
   * - Merge approved changes into officialData
   */

  import { onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { requireAdmin } from '../lib/adminAuth.js'
  import { exportOfficialData } from '../lib/adminExport.js'
  import { officialData } from '../stores/data.js'
  import { get } from 'svelte/store'

  // Page state
  let isLoading = false
  let errorMessage = ''
  let successMessage = ''
  let uploadedFile = null
  let contributions = []
  let parsedContributions = null

  // Contribution states
  const CONTRIBUTION_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    EDITED: 'edited'
  }

  // Check admin auth on mount
  onMount(() => {
    if (!requireAdmin()) {
      push('/admin/login')
    }
  })

  /**
   * Handle file upload
   */
  function handleFileUpload(event) {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.json')) {
      errorMessage = 'Please upload a valid JSON file'
      return
    }

    uploadedFile = file
    errorMessage = ''
    successMessage = ''

    // Read and parse file
    parseContributionFile(file)
  }

  /**
   * Parse uploaded contribution JSON file
   */
  async function parseContributionFile(file) {
    isLoading = true
    errorMessage = ''

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Validate contribution structure
      const validation = validateContributionStructure(data)
      if (!validation.valid) {
        errorMessage = `Invalid contribution file: ${validation.errors.join(', ')}`
        isLoading = false
        return
      }

      // Parse contributions and compare with official data
      parsedContributions = parseContributions(data)
      contributions = parsedContributions.all

      successMessage = `Loaded ${contributions.length} contributions from file`
      console.log('Parsed contributions:', parsedContributions)
    } catch (error) {
      console.error('Error parsing contribution file:', error)
      errorMessage = `Failed to parse file: ${error.message}`
    } finally {
      isLoading = false
    }
  }

  /**
   * Validate contribution file structure
   */
  function validateContributionStructure(data) {
    const errors = []

    if (!data || typeof data !== 'object') {
      errors.push('Data must be an object')
      return { valid: false, errors }
    }

    // Check for valid entity types
    const validTypes = [
      'book', 'career', 'careerLevel', 'specie', 'class', 'talent',
      'characteristic', 'trapping', 'skill', 'spell', 'creature',
      'star', 'god', 'eye', 'hair', 'detail', 'trait', 'lore',
      'magick', 'etat', 'psychologie', 'quality', 'tree'
    ]

    const hasValidData = Object.keys(data).some(key => validTypes.includes(key))
    if (!hasValidData) {
      errors.push('No valid entity types found in contribution file')
    }

    return { valid: errors.length === 0, errors }
  }

  /**
   * Parse contributions and compare with official data
   * Returns categorized contributions: new entries, modifications
   */
  function parseContributions(contributionData) {
    const official = get(officialData)
    const all = []
    const newEntries = []
    const modifications = []

    // Map singular keys (contribution file) to plural keys (store)
    const keyMapping = {
      'book': 'books',
      'career': 'careers',
      'careerLevel': 'careerLevels',
      'specie': 'species',
      'class': 'classes',
      'talent': 'talents',
      'characteristic': 'characteristics',
      'trapping': 'trappings',
      'skill': 'skills',
      'spell': 'spells',
      'creature': 'creatures',
      'star': 'stars',
      'god': 'gods',
      'eye': 'eyes',
      'hair': 'hairs',
      'detail': 'details',
      'trait': 'traits',
      'lore': 'lores',
      'magick': 'magicks',
      'etat': 'etats',
      'psychologie': 'psychologies',
      'quality': 'qualities',
      'tree': 'trees'
    }

    // Process each entity type in contribution
    for (const [singularKey, pluralKey] of Object.entries(keyMapping)) {
      const contributedEntities = contributionData[singularKey] || []
      const officialEntities = official[pluralKey] || []

      for (const entity of contributedEntities) {
        // Find existing entity in official data
        const existingEntity = officialEntities.find(e => e.id === entity.id)

        const contribution = {
          id: `${pluralKey}-${entity.id}`,
          entityType: pluralKey,
          entityId: entity.id,
          data: entity,
          originalData: existingEntity || null,
          isNew: !existingEntity,
          isModification: !!existingEntity,
          status: CONTRIBUTION_STATUS.PENDING,
          editedData: null
        }

        all.push(contribution)

        if (contribution.isNew) {
          newEntries.push(contribution)
        } else {
          modifications.push(contribution)
        }
      }
    }

    return { all, newEntries, modifications }
  }

  /**
   * Get diff between original and contributed data
   */
  function getDiff(original, contributed) {
    if (!original) return null

    const diff = []
    const allKeys = new Set([...Object.keys(original), ...Object.keys(contributed)])

    for (const key of allKeys) {
      // Skip internal metadata
      if (key.startsWith('_')) continue

      const originalValue = original[key]
      const contributedValue = contributed[key]

      if (JSON.stringify(originalValue) !== JSON.stringify(contributedValue)) {
        diff.push({
          field: key,
          before: originalValue,
          after: contributedValue
        })
      }
    }

    return diff
  }

  /**
   * Approve a single contribution
   */
  function approveContribution(contributionId) {
    const contribution = contributions.find(c => c.id === contributionId)
    if (!contribution) return

    contribution.status = CONTRIBUTION_STATUS.APPROVED
    contributions = contributions // Trigger reactivity
  }

  /**
   * Reject a single contribution
   */
  function rejectContribution(contributionId) {
    const contribution = contributions.find(c => c.id === contributionId)
    if (!contribution) return

    contribution.status = CONTRIBUTION_STATUS.REJECTED
    contributions = contributions // Trigger reactivity
  }

  /**
   * Start editing a contribution
   */
  function editContribution(contributionId) {
    const contribution = contributions.find(c => c.id === contributionId)
    if (!contribution) return

    // Create editable copy
    contribution.editedData = JSON.stringify(contribution.data, null, 2)
    contribution.status = CONTRIBUTION_STATUS.EDITED
    contributions = contributions // Trigger reactivity
  }

  /**
   * Save edited contribution
   */
  function saveEditedContribution(contributionId) {
    const contribution = contributions.find(c => c.id === contributionId)
    if (!contribution) return

    try {
      const editedData = JSON.parse(contribution.editedData)
      contribution.data = editedData
      contribution.editedData = null
      contribution.status = CONTRIBUTION_STATUS.PENDING
      contributions = contributions // Trigger reactivity
      successMessage = 'Changes saved successfully'
    } catch (error) {
      errorMessage = 'Invalid JSON in edited data'
    }
  }

  /**
   * Cancel editing a contribution
   */
  function cancelEditContribution(contributionId) {
    const contribution = contributions.find(c => c.id === contributionId)
    if (!contribution) return

    contribution.editedData = null
    contribution.status = CONTRIBUTION_STATUS.PENDING
    contributions = contributions // Trigger reactivity
  }

  /**
   * Bulk approve all pending contributions
   */
  function approveAll() {
    contributions.forEach(c => {
      if (c.status === CONTRIBUTION_STATUS.PENDING) {
        c.status = CONTRIBUTION_STATUS.APPROVED
      }
    })
    contributions = contributions // Trigger reactivity
    successMessage = 'All pending contributions approved'
  }

  /**
   * Bulk reject all pending contributions
   */
  function rejectAll() {
    contributions.forEach(c => {
      if (c.status === CONTRIBUTION_STATUS.PENDING) {
        c.status = CONTRIBUTION_STATUS.REJECTED
      }
    })
    contributions = contributions // Trigger reactivity
    successMessage = 'All pending contributions rejected'
  }

  /**
   * Merge approved contributions into official data
   */
  async function mergeApprovedContributions() {
    const approved = contributions.filter(c => c.status === CONTRIBUTION_STATUS.APPROVED)

    if (approved.length === 0) {
      errorMessage = 'No approved contributions to merge'
      return
    }

    // Confirm action
    const confirmMessage = `Merge ${approved.length} approved contributions into official data? This will update the database.`
    if (!confirm(confirmMessage)) return

    isLoading = true
    errorMessage = ''

    try {
      // Get current official data
      const currentOfficial = get(officialData)

      // Group approved contributions by entity type
      const updatesByType = {}
      for (const contribution of approved) {
        if (!updatesByType[contribution.entityType]) {
          updatesByType[contribution.entityType] = []
        }
        updatesByType[contribution.entityType].push(contribution.data)
      }

      // Merge updates into official data
      const updatedOfficial = { ...currentOfficial }
      for (const [entityType, updates] of Object.entries(updatesByType)) {
        const existingEntities = updatedOfficial[entityType] || []

        // Create a map for efficient lookups
        const entityMap = new Map(existingEntities.map(e => [e.id, e]))

        // Apply updates
        for (const update of updates) {
          entityMap.set(update.id, update)
        }

        // Convert back to array
        updatedOfficial[entityType] = Array.from(entityMap.values())
      }

      // Update the store
      officialData.set(updatedOfficial)

      successMessage = `Successfully merged ${approved.length} contributions into official data`

      // Ask if user wants to export updated data
      if (confirm('Export updated official data as JSON file?')) {
        const result = exportOfficialData()
        if (result.success) {
          successMessage += ` | Exported as ${result.filename}`
        }
      }

      // Clear contributions after successful merge
      setTimeout(() => {
        contributions = []
        parsedContributions = null
        uploadedFile = null
      }, 2000)

    } catch (error) {
      console.error('Error merging contributions:', error)
      errorMessage = `Failed to merge contributions: ${error.message}`
    } finally {
      isLoading = false
    }
  }

  /**
   * Clear uploaded file and contributions
   */
  function clearContributions() {
    if (confirm('Clear all loaded contributions? Any unsaved changes will be lost.')) {
      contributions = []
      parsedContributions = null
      uploadedFile = null
      errorMessage = ''
      successMessage = ''
    }
  }

  // Computed stats
  $: stats = {
    total: contributions.length,
    pending: contributions.filter(c => c.status === CONTRIBUTION_STATUS.PENDING).length,
    approved: contributions.filter(c => c.status === CONTRIBUTION_STATUS.APPROVED).length,
    rejected: contributions.filter(c => c.status === CONTRIBUTION_STATUS.REJECTED).length,
    newEntries: parsedContributions?.newEntries.length || 0,
    modifications: parsedContributions?.modifications.length || 0
  }
</script>

<div class="review-page">
  <div class="page-header">
    <h1>Review Community Contributions</h1>
    <p class="subtitle">Upload and review JSON contribution files from the community</p>
  </div>

  <!-- Upload Area -->
  <div class="upload-section">
    <div class="upload-card">
      <div class="upload-icon">📤</div>
      <h2>Upload Contribution File</h2>
      <p>Select a JSON file containing community contributions to review</p>

      <label for="file-upload" class="upload-button">
        Choose JSON File
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".json,application/json"
        on:change={handleFileUpload}
        style="display: none;"
      />

      {#if uploadedFile}
        <div class="file-info">
          <span class="file-name">{uploadedFile.name}</span>
          <button class="clear-button" on:click={clearContributions}>Clear</button>
        </div>
      {/if}
    </div>
  </div>

  <!-- Messages -->
  {#if errorMessage}
    <div class="message error-message" role="alert">
      {errorMessage}
    </div>
  {/if}

  {#if successMessage}
    <div class="message success-message" role="status">
      {successMessage}
    </div>
  {/if}

  <!-- Loading State -->
  {#if isLoading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Processing contributions...</p>
    </div>
  {/if}

  <!-- Stats and Actions -->
  {#if contributions.length > 0}
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{stats.total}</div>
          <div class="stat-label">Total</div>
        </div>
        <div class="stat-card new">
          <div class="stat-value">{stats.newEntries}</div>
          <div class="stat-label">New Entries</div>
        </div>
        <div class="stat-card modified">
          <div class="stat-value">{stats.modifications}</div>
          <div class="stat-label">Modifications</div>
        </div>
        <div class="stat-card pending">
          <div class="stat-value">{stats.pending}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="stat-card approved">
          <div class="stat-value">{stats.approved}</div>
          <div class="stat-label">Approved</div>
        </div>
        <div class="stat-card rejected">
          <div class="stat-value">{stats.rejected}</div>
          <div class="stat-label">Rejected</div>
        </div>
      </div>

      <div class="bulk-actions">
        <button class="bulk-button approve-all" on:click={approveAll} disabled={isLoading || stats.pending === 0}>
          Approve All Pending
        </button>
        <button class="bulk-button reject-all" on:click={rejectAll} disabled={isLoading || stats.pending === 0}>
          Reject All Pending
        </button>
        <button class="bulk-button merge" on:click={mergeApprovedContributions} disabled={isLoading || stats.approved === 0}>
          Merge {stats.approved} Approved
        </button>
      </div>
    </div>

    <!-- Contributions List -->
    <div class="contributions-section">
      <h2>Contribution Details</h2>

      {#each contributions as contribution (contribution.id)}
        <div class="contribution-card" class:approved={contribution.status === CONTRIBUTION_STATUS.APPROVED} class:rejected={contribution.status === CONTRIBUTION_STATUS.REJECTED}>
          <div class="contribution-header">
            <div class="contribution-info">
              <h3>
                {#if contribution.isNew}
                  <span class="badge new">NEW</span>
                {:else}
                  <span class="badge modified">MODIFIED</span>
                {/if}
                {contribution.entityType} #{contribution.entityId}
              </h3>
              <span class="status-badge status-{contribution.status}">{contribution.status}</span>
            </div>
          </div>

          <div class="contribution-body">
            {#if contribution.editedData !== null}
              <!-- Edit Mode -->
              <div class="edit-mode">
                <label for="edit-{contribution.id}">Edit JSON:</label>
                <textarea
                  id="edit-{contribution.id}"
                  bind:value={contribution.editedData}
                  rows="15"
                  class="json-editor"
                ></textarea>
                <div class="edit-actions">
                  <button class="save-button" on:click={() => saveEditedContribution(contribution.id)}>
                    Save Changes
                  </button>
                  <button class="cancel-button" on:click={() => cancelEditContribution(contribution.id)}>
                    Cancel
                  </button>
                </div>
              </div>
            {:else}
              <!-- View Mode -->
              {#if contribution.isNew}
                <!-- Show full content for new entries -->
                <div class="new-entry">
                  <h4>Proposed New Entry:</h4>
                  <pre class="json-display">{JSON.stringify(contribution.data, null, 2)}</pre>
                </div>
              {:else}
                <!-- Show diff for modifications -->
                <div class="modification">
                  <h4>Changes:</h4>
                  {#each getDiff(contribution.originalData, contribution.data) || [] as change}
                    <div class="diff-item">
                      <div class="diff-field">{change.field}</div>
                      <div class="diff-values">
                        <div class="diff-before">
                          <strong>Before:</strong>
                          <code>{JSON.stringify(change.before)}</code>
                        </div>
                        <div class="diff-arrow">→</div>
                        <div class="diff-after">
                          <strong>After:</strong>
                          <code>{JSON.stringify(change.after)}</code>
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}

              <!-- Action buttons -->
              {#if contribution.status === CONTRIBUTION_STATUS.PENDING}
                <div class="contribution-actions">
                  <button class="action-button approve" on:click={() => approveContribution(contribution.id)}>
                    Approve
                  </button>
                  <button class="action-button reject" on:click={() => rejectContribution(contribution.id)}>
                    Reject
                  </button>
                  <button class="action-button edit" on:click={() => editContribution(contribution.id)}>
                    Edit
                  </button>
                </div>
              {:else if contribution.status === CONTRIBUTION_STATUS.APPROVED}
                <div class="contribution-actions">
                  <button class="action-button reject" on:click={() => rejectContribution(contribution.id)}>
                    Undo Approval
                  </button>
                </div>
              {:else if contribution.status === CONTRIBUTION_STATUS.REJECTED}
                <div class="contribution-actions">
                  <button class="action-button approve" on:click={() => approveContribution(contribution.id)}>
                    Undo Rejection
                  </button>
                </div>
              {/if}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .review-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .page-header h1 {
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .subtitle {
    color: var(--color-text-secondary, #666);
    font-size: 1.1rem;
  }

  /* Upload Section */
  .upload-section {
    margin-bottom: 2rem;
  }

  .upload-card {
    background: var(--color-bg-primary, #fff);
    border: 2px dashed var(--color-border, #ddd);
    border-radius: 12px;
    padding: 3rem;
    text-align: center;
  }

  .upload-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .upload-card h2 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
  }

  .upload-card p {
    color: var(--color-text-secondary, #666);
    margin-bottom: 1.5rem;
  }

  .upload-button {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: var(--color-accent, #8b2e1f);
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
  }

  .upload-button:hover {
    background: var(--color-accent-dark, #6b1e0f);
  }

  .file-info {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .file-name {
    font-weight: 600;
    color: var(--color-text-primary, #333);
  }

  .clear-button {
    padding: 0.25rem 0.75rem;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
  }

  .clear-button:hover {
    background: #c82333;
  }

  /* Messages */
  .message {
    padding: 1rem 1.5rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  .error-message {
    background: #fee;
    border: 1px solid #fcc;
    color: #c33;
  }

  .success-message {
    background: #efe;
    border: 1px solid #cfc;
    color: #3c3;
  }

  /* Loading */
  .loading {
    text-align: center;
    padding: 3rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 1rem;
    border: 4px solid var(--color-border, #ddd);
    border-top-color: var(--color-accent, #8b2e1f);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Stats Section */
  .stats-section {
    margin-bottom: 2rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    background: var(--color-bg-primary, #fff);
    border: 2px solid var(--color-border, #ddd);
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
  }

  .stat-card.new { border-color: #28a745; }
  .stat-card.modified { border-color: #ffc107; }
  .stat-card.pending { border-color: #6c757d; }
  .stat-card.approved { border-color: #28a745; }
  .stat-card.rejected { border-color: #dc3545; }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-text-primary, #333);
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.9rem;
    color: var(--color-text-secondary, #666);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Bulk Actions */
  .bulk-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .bulk-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
  }

  .bulk-button:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .bulk-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .bulk-button.approve-all {
    background: #28a745;
    color: white;
  }

  .bulk-button.reject-all {
    background: #dc3545;
    color: white;
  }

  .bulk-button.merge {
    background: var(--color-accent, #8b2e1f);
    color: white;
  }

  /* Contributions Section */
  .contributions-section {
    margin-top: 2rem;
  }

  .contributions-section h2 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
    color: var(--color-text-primary, #333);
  }

  /* Contribution Card */
  .contribution-card {
    background: var(--color-bg-primary, #fff);
    border: 2px solid var(--color-border, #ddd);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .contribution-card.approved {
    border-color: #28a745;
    background: #f8fff9;
  }

  .contribution-card.rejected {
    border-color: #dc3545;
    background: #fff8f8;
  }

  .contribution-header {
    margin-bottom: 1rem;
  }

  .contribution-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .contribution-info h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 1.25rem;
  }

  .badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .badge.new {
    background: #28a745;
    color: white;
  }

  .badge.modified {
    background: #ffc107;
    color: #333;
  }

  .status-badge {
    padding: 0.35rem 0.75rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-badge.status-pending {
    background: #6c757d;
    color: white;
  }

  .status-badge.status-approved {
    background: #28a745;
    color: white;
  }

  .status-badge.status-rejected {
    background: #dc3545;
    color: white;
  }

  .status-badge.status-edited {
    background: #17a2b8;
    color: white;
  }

  /* Contribution Body */
  .contribution-body {
    margin-top: 1rem;
  }

  .new-entry h4,
  .modification h4 {
    margin: 0 0 1rem 0;
    color: var(--color-text-primary, #333);
  }

  .json-display {
    background: var(--color-bg-secondary, #f5f5f5);
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    line-height: 1.5;
    max-height: 400px;
    overflow-y: auto;
  }

  /* Diff Display */
  .diff-item {
    background: var(--color-bg-secondary, #f5f5f5);
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 0.75rem;
  }

  .diff-field {
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary, #333);
  }

  .diff-values {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    align-items: center;
  }

  .diff-before,
  .diff-after {
    padding: 0.5rem;
    border-radius: 4px;
  }

  .diff-before {
    background: #ffe6e6;
  }

  .diff-after {
    background: #e6ffe6;
  }

  .diff-arrow {
    font-size: 1.5rem;
    color: var(--color-text-secondary, #666);
  }

  .diff-values code {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.85rem;
    word-break: break-word;
  }

  /* Edit Mode */
  .edit-mode {
    margin-top: 1rem;
  }

  .edit-mode label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--color-text-primary, #333);
  }

  .json-editor {
    width: 100%;
    padding: 0.75rem;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 4px;
    background: var(--color-bg-primary, #fff);
    resize: vertical;
  }

  .json-editor:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .edit-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.75rem;
  }

  .save-button,
  .cancel-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
  }

  .save-button {
    background: #28a745;
    color: white;
  }

  .save-button:hover {
    background: #218838;
  }

  .cancel-button {
    background: #6c757d;
    color: white;
  }

  .cancel-button:hover {
    background: #5a6268;
  }

  /* Action Buttons */
  .contribution-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .action-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .action-button.approve {
    background: #28a745;
    color: white;
  }

  .action-button.approve:hover {
    background: #218838;
  }

  .action-button.reject {
    background: #dc3545;
    color: white;
  }

  .action-button.reject:hover {
    background: #c82333;
  }

  .action-button.edit {
    background: #17a2b8;
    color: white;
  }

  .action-button.edit:hover {
    background: #138496;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .review-page {
      padding: 1rem;
    }

    .page-header h1 {
      font-size: 2rem;
    }

    .upload-card {
      padding: 2rem 1rem;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .bulk-actions {
      flex-direction: column;
    }

    .bulk-button {
      width: 100%;
    }

    .diff-values {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .diff-arrow {
      transform: rotate(90deg);
    }

    .contribution-actions {
      flex-direction: column;
    }

    .action-button {
      width: 100%;
    }
  }
</style>
