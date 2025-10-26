<script>
  /**
   * Admin Official Data Editor
   *
   * Issue #16 Stream C: Official Data Editor
   *
   * Provides a comprehensive interface for editing official database entries.
   * Allows admins to view, edit, create, and delete entries from all 23 entity types.
   */

  import { onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { requireAdmin } from '../lib/adminAuth.js'
  import { officialData, isDataLoading } from '../stores/data.js'
  import { db } from '../lib/db.js'
  import { getIcon } from '../lib/icons.js'

  // Entity types available for editing
  const ENTITY_TYPES = [
    { id: 'books', label: 'Books', icon: 'book' },
    { id: 'careers', label: 'Careers', icon: 'briefcase' },
    { id: 'careerLevels', label: 'Career Levels', icon: 'stairs' },
    { id: 'species', label: 'Species', icon: 'users' },
    { id: 'classes', label: 'Classes', icon: 'shield' },
    { id: 'talents', label: 'Talents', icon: 'star' },
    { id: 'characteristics', label: 'Characteristics', icon: 'chart' },
    { id: 'trappings', label: 'Trappings', icon: 'backpack' },
    { id: 'skills', label: 'Skills', icon: 'tool' },
    { id: 'spells', label: 'Spells', icon: 'wand' },
    { id: 'creatures', label: 'Creatures', icon: 'dragon' },
    { id: 'stars', label: 'Stars', icon: 'sun' },
    { id: 'gods', label: 'Gods', icon: 'temple' },
    { id: 'eyes', label: 'Eyes', icon: 'eye' },
    { id: 'hairs', label: 'Hair', icon: 'brush' },
    { id: 'details', label: 'Details', icon: 'info' },
    { id: 'traits', label: 'Traits', icon: 'badge' },
    { id: 'lores', label: 'Lores', icon: 'book-open' },
    { id: 'magicks', label: 'Magicks', icon: 'sparkles' },
    { id: 'etats', label: 'Conditions', icon: 'heart' },
    { id: 'psychologies', label: 'Psychologies', icon: 'brain' },
    { id: 'qualities', label: 'Qualities', icon: 'gem' },
    { id: 'trees', label: 'Trees', icon: 'folder' }
  ]

  // State
  let selectedEntityType = 'books'
  let searchTerm = ''
  let currentData = []
  let filteredData = []
  let editingEntity = null
  let isEditing = false
  let isCreating = false
  let showDeleteConfirm = false
  let entityToDelete = null
  let editForm = {}
  let validationErrors = {}
  let isSaving = false
  let successMessage = ''
  let errorMessage = ''

  // Pagination
  let currentPage = 1
  let itemsPerPage = 20
  let totalPages = 1

  // Admin authentication guard
  onMount(() => {
    if (!requireAdmin()) {
      push('/admin/login')
    }
  })

  // Load data when entity type changes
  $: if (selectedEntityType && $officialData) {
    loadEntityData()
  }

  // Filter data when search term changes
  $: if (searchTerm !== undefined) {
    filterData()
  }

  // Calculate pagination
  $: {
    totalPages = Math.ceil(filteredData.length / itemsPerPage)
    if (currentPage > totalPages) {
      currentPage = 1
    }
  }

  // Get paginated data
  $: paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  /**
   * Load data for selected entity type
   */
  async function loadEntityData() {
    try {
      const data = await db[selectedEntityType].toArray()
      currentData = data || []
      filterData()
      currentPage = 1
      clearMessages()
    } catch (error) {
      console.error('Error loading entity data:', error)
      errorMessage = 'Failed to load data: ' + error.message
    }
  }

  /**
   * Filter data based on search term
   */
  function filterData() {
    if (!searchTerm) {
      filteredData = [...currentData]
      return
    }

    const term = searchTerm.toLowerCase()
    filteredData = currentData.filter(entity => {
      // Search in common fields
      const searchableText = [
        entity.id,
        entity.name,
        entity.label,
        entity.desc,
        entity.description
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(term)
    })
  }

  /**
   * Get display name for an entity
   */
  function getEntityDisplayName(entity) {
    return entity.label || entity.name || entity.description || entity.id || 'Unnamed'
  }

  /**
   * Get primary fields to display in table
   */
  function getDisplayFields(entity) {
    const fields = []

    // ID (always show)
    fields.push({ label: 'ID', value: entity.id })

    // Name/Label
    if (entity.label) fields.push({ label: 'Name', value: entity.label })
    else if (entity.name) fields.push({ label: 'Name', value: entity.name })

    // Type-specific fields
    if (entity.type) fields.push({ label: 'Type', value: entity.type })
    if (entity.book) fields.push({ label: 'Book', value: entity.book })
    if (entity.page) fields.push({ label: 'Page', value: entity.page })

    return fields
  }

  /**
   * Start creating a new entity
   */
  function startCreate() {
    isCreating = true
    isEditing = true
    editingEntity = null
    editForm = getDefaultEntityForm()
    validationErrors = {}
    clearMessages()
  }

  /**
   * Get default form values for new entity
   */
  function getDefaultEntityForm() {
    const defaults = {
      id: '',
      label: '',
      desc: '',
      folder: ''
    }

    // Add entity-specific defaults
    switch (selectedEntityType) {
      case 'books':
        return { ...defaults, abr: '', language: 'en' }
      case 'careers':
        return { ...defaults, class: '', book: '', page: '' }
      case 'careerLevels':
        return { ...defaults, career: '', careerLevel: 1, status: '' }
      case 'species':
        return { ...defaults, refCareer: '', refDetail: '', refChar: '' }
      case 'talents':
        return { ...defaults, max: 1, test: '', specs: [] }
      case 'skills':
        return { ...defaults, characteristic: '', type: '', advanced: false, specs: [] }
      case 'spells':
        return { ...defaults, type: '', cn: 0, range: '', target: '', duration: '' }
      case 'trappings':
        return { ...defaults, type: '', subType: '', enc: 0 }
      default:
        return defaults
    }
  }

  /**
   * Start editing an existing entity
   */
  function startEdit(entity) {
    isCreating = false
    isEditing = true
    editingEntity = entity
    editForm = { ...entity }
    validationErrors = {}
    clearMessages()
  }

  /**
   * Cancel editing
   */
  function cancelEdit() {
    isEditing = false
    isCreating = false
    editingEntity = null
    editForm = {}
    validationErrors = {}
    clearMessages()
  }

  /**
   * Validate entity form
   */
  function validateEntityForm() {
    const errors = {}

    // ID is required
    if (!editForm.id || editForm.id.trim() === '') {
      errors.id = 'ID is required'
    }

    // Check for duplicate ID when creating
    if (isCreating && currentData.some(e => e.id === editForm.id)) {
      errors.id = 'An entity with this ID already exists'
    }

    // Label/name is usually required
    if (!editForm.label && !editForm.name && !editForm.description) {
      errors.label = 'Name/Label is required'
    }

    // Entity-specific validation
    switch (selectedEntityType) {
      case 'talents':
        if (editForm.max && (editForm.max < 1 || editForm.max > 10)) {
          errors.max = 'Max rank must be between 1 and 10'
        }
        break
      case 'spells':
        if (editForm.cn && (editForm.cn < 0 || editForm.cn > 50)) {
          errors.cn = 'Casting Number must be between 0 and 50'
        }
        break
      case 'careerLevels':
        if (!editForm.career) {
          errors.career = 'Career is required'
        }
        if (!editForm.careerLevel || editForm.careerLevel < 1 || editForm.careerLevel > 4) {
          errors.careerLevel = 'Career level must be between 1 and 4'
        }
        break
    }

    validationErrors = errors
    return Object.keys(errors).length === 0
  }

  /**
   * Save entity (create or update)
   */
  async function saveEntity() {
    if (!validateEntityForm()) {
      errorMessage = 'Please fix validation errors before saving'
      return
    }

    isSaving = true
    clearMessages()

    try {
      if (isCreating) {
        // Create new entity
        await db[selectedEntityType].add(editForm)
        successMessage = `Successfully created ${getEntityDisplayName(editForm)}`
      } else {
        // Update existing entity
        await db[selectedEntityType].update(editingEntity.id, editForm)
        successMessage = `Successfully updated ${getEntityDisplayName(editForm)}`
      }

      // Reload data and close editor
      await loadEntityData()
      cancelEdit()
    } catch (error) {
      console.error('Error saving entity:', error)
      errorMessage = 'Failed to save: ' + error.message
    } finally {
      isSaving = false
    }
  }

  /**
   * Confirm delete
   */
  function confirmDelete(entity) {
    entityToDelete = entity
    showDeleteConfirm = true
    clearMessages()
  }

  /**
   * Cancel delete
   */
  function cancelDelete() {
    entityToDelete = null
    showDeleteConfirm = false
  }

  /**
   * Delete entity
   */
  async function deleteEntity() {
    if (!entityToDelete) return

    try {
      await db[selectedEntityType].delete(entityToDelete.id)
      successMessage = `Successfully deleted ${getEntityDisplayName(entityToDelete)}`

      // Reload data
      await loadEntityData()
      cancelDelete()
    } catch (error) {
      console.error('Error deleting entity:', error)
      errorMessage = 'Failed to delete: ' + error.message
      cancelDelete()
    }
  }

  /**
   * Clear messages
   */
  function clearMessages() {
    successMessage = ''
    errorMessage = ''
  }

  /**
   * Handle entity type change
   */
  function handleEntityTypeChange() {
    searchTerm = ''
    currentPage = 1
    cancelEdit()
  }

  /**
   * Navigate to page
   */
  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page
    }
  }
</script>

<div class="admin-edit-data">
  <div class="page-header">
    <h1>Official Data Editor</h1>
    <p class="subtitle">Edit official database entries for all entity types</p>
  </div>

  {#if $isDataLoading}
    <div class="loading">Loading data...</div>
  {:else}
    <!-- Entity Type Selector -->
    <div class="controls">
      <div class="entity-selector">
        <label for="entity-type">Entity Type:</label>
        <select
          id="entity-type"
          bind:value={selectedEntityType}
          on:change={handleEntityTypeChange}
          disabled={isEditing}
        >
          {#each ENTITY_TYPES as entityType}
            <option value={entityType.id}>{entityType.label}</option>
          {/each}
        </select>
        <span class="count">{currentData.length} total</span>
      </div>

      <div class="search-box">
        <input
          type="text"
          placeholder="Search..."
          bind:value={searchTerm}
          disabled={isEditing}
        />
        {#if searchTerm}
          <span class="search-results">{filteredData.length} results</span>
        {/if}
      </div>

      <button class="create-button" on:click={startCreate} disabled={isEditing}>
        + Create New
      </button>
    </div>

    <!-- Messages -->
    {#if successMessage}
      <div class="message success">{successMessage}</div>
    {/if}
    {#if errorMessage}
      <div class="message error">{errorMessage}</div>
    {/if}

    <!-- Editor Modal -->
    {#if isEditing}
      <div class="modal-overlay" on:click={cancelEdit}>
        <div class="modal" on:click|stopPropagation>
          <div class="modal-header">
            <h2>{isCreating ? 'Create' : 'Edit'} {ENTITY_TYPES.find(e => e.id === selectedEntityType)?.label}</h2>
            <button class="close-button" on:click={cancelEdit}>&times;</button>
          </div>

          <div class="modal-body">
            <form on:submit|preventDefault={saveEntity}>
              <!-- ID Field -->
              <div class="form-group">
                <label for="edit-id">
                  ID <span class="required">*</span>
                </label>
                <input
                  id="edit-id"
                  type="text"
                  bind:value={editForm.id}
                  disabled={!isCreating}
                  class:error={validationErrors.id}
                />
                {#if validationErrors.id}
                  <span class="error-text">{validationErrors.id}</span>
                {/if}
              </div>

              <!-- Label/Name Field -->
              <div class="form-group">
                <label for="edit-label">
                  Name <span class="required">*</span>
                </label>
                <input
                  id="edit-label"
                  type="text"
                  bind:value={editForm.label}
                  class:error={validationErrors.label}
                />
                {#if validationErrors.label}
                  <span class="error-text">{validationErrors.label}</span>
                {/if}
              </div>

              <!-- Description Field -->
              <div class="form-group">
                <label for="edit-desc">Description</label>
                <textarea
                  id="edit-desc"
                  bind:value={editForm.desc}
                  rows="4"
                ></textarea>
              </div>

              <!-- Entity-specific fields -->
              {#if selectedEntityType === 'books'}
                <div class="form-group">
                  <label for="edit-abr">Abbreviation</label>
                  <input id="edit-abr" type="text" bind:value={editForm.abr} />
                </div>
              {/if}

              {#if selectedEntityType === 'talents'}
                <div class="form-group">
                  <label for="edit-max">Max Rank</label>
                  <input
                    id="edit-max"
                    type="number"
                    bind:value={editForm.max}
                    min="1"
                    max="10"
                    class:error={validationErrors.max}
                  />
                  {#if validationErrors.max}
                    <span class="error-text">{validationErrors.max}</span>
                  {/if}
                </div>
              {/if}

              {#if selectedEntityType === 'spells'}
                <div class="form-group">
                  <label for="edit-cn">Casting Number</label>
                  <input
                    id="edit-cn"
                    type="number"
                    bind:value={editForm.cn}
                    min="0"
                    max="50"
                    class:error={validationErrors.cn}
                  />
                  {#if validationErrors.cn}
                    <span class="error-text">{validationErrors.cn}</span>
                  {/if}
                </div>
                <div class="form-group">
                  <label for="edit-range">Range</label>
                  <input id="edit-range" type="text" bind:value={editForm.range} />
                </div>
                <div class="form-group">
                  <label for="edit-target">Target</label>
                  <input id="edit-target" type="text" bind:value={editForm.target} />
                </div>
                <div class="form-group">
                  <label for="edit-duration">Duration</label>
                  <input id="edit-duration" type="text" bind:value={editForm.duration} />
                </div>
              {/if}

              {#if selectedEntityType === 'careerLevels'}
                <div class="form-group">
                  <label for="edit-career">Career ID <span class="required">*</span></label>
                  <input
                    id="edit-career"
                    type="text"
                    bind:value={editForm.career}
                    class:error={validationErrors.career}
                  />
                  {#if validationErrors.career}
                    <span class="error-text">{validationErrors.career}</span>
                  {/if}
                </div>
                <div class="form-group">
                  <label for="edit-level">Level <span class="required">*</span></label>
                  <input
                    id="edit-level"
                    type="number"
                    bind:value={editForm.careerLevel}
                    min="1"
                    max="4"
                    class:error={validationErrors.careerLevel}
                  />
                  {#if validationErrors.careerLevel}
                    <span class="error-text">{validationErrors.careerLevel}</span>
                  {/if}
                </div>
              {/if}

              <!-- Common fields -->
              {#if editForm.book !== undefined}
                <div class="form-group">
                  <label for="edit-book">Book</label>
                  <input id="edit-book" type="text" bind:value={editForm.book} />
                </div>
              {/if}

              {#if editForm.page !== undefined}
                <div class="form-group">
                  <label for="edit-page">Page</label>
                  <input id="edit-page" type="text" bind:value={editForm.page} />
                </div>
              {/if}

              <div class="modal-actions">
                <button type="button" class="cancel-button" on:click={cancelEdit}>
                  Cancel
                </button>
                <button type="submit" class="save-button" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    {/if}

    <!-- Delete Confirmation Modal -->
    {#if showDeleteConfirm}
      <div class="modal-overlay" on:click={cancelDelete}>
        <div class="modal confirm-modal" on:click|stopPropagation>
          <div class="modal-header">
            <h2>Confirm Delete</h2>
          </div>
          <div class="modal-body">
            <p>
              Are you sure you want to delete <strong>{getEntityDisplayName(entityToDelete)}</strong>?
            </p>
            <p class="warning">This action cannot be undone!</p>
          </div>
          <div class="modal-actions">
            <button class="cancel-button" on:click={cancelDelete}>Cancel</button>
            <button class="delete-button" on:click={deleteEntity}>Delete</button>
          </div>
        </div>
      </div>
    {/if}

    <!-- Data Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Details</th>
            <th class="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each paginatedData as entity (entity.id)}
            <tr>
              <td class="id-column">{entity.id}</td>
              <td class="name-column">{getEntityDisplayName(entity)}</td>
              <td class="details-column">
                {#each getDisplayFields(entity).slice(2) as field}
                  <div class="detail-item">
                    <span class="detail-label">{field.label}:</span>
                    <span class="detail-value">{field.value}</span>
                  </div>
                {/each}
              </td>
              <td class="actions-column">
                <button class="edit-button" on:click={() => startEdit(entity)} title="Edit">
                  Edit
                </button>
                <button class="delete-button" on:click={() => confirmDelete(entity)} title="Delete">
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="pagination">
        <button
          class="page-button"
          on:click={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span class="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <button
          class="page-button"
          on:click={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .admin-edit-data {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .page-header h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
  }

  .subtitle {
    color: var(--color-text-secondary, #666);
    margin: 0;
  }

  .loading {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-secondary, #666);
  }

  .controls {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .entity-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .entity-selector label {
    font-weight: 600;
  }

  .entity-selector select {
    padding: 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    background: var(--color-bg-primary, #fff);
  }

  .count {
    font-size: 0.9rem;
    color: var(--color-text-secondary, #666);
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 200px;
  }

  .search-box input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
  }

  .search-results {
    font-size: 0.9rem;
    color: var(--color-text-secondary, #666);
  }

  .create-button {
    padding: 0.5rem 1rem;
    background: var(--color-accent, #8b2e1f);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
  }

  .create-button:hover:not(:disabled) {
    background: var(--color-accent-dark, #6b1e0f);
  }

  .create-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .message {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
  }

  .message.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .table-container {
    background: var(--color-bg-primary, #fff);
    border: 1px solid var(--color-border, #ddd);
    border-radius: 8px;
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table thead {
    background: var(--color-bg-secondary, #f5f5f5);
  }

  .data-table th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid var(--color-border, #ddd);
  }

  .data-table td {
    padding: 1rem;
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .data-table tbody tr:hover {
    background: var(--color-bg-secondary, #f5f5f5);
  }

  .id-column {
    font-family: monospace;
    font-size: 0.9rem;
    color: var(--color-text-secondary, #666);
  }

  .name-column {
    font-weight: 600;
  }

  .details-column {
    font-size: 0.9rem;
  }

  .detail-item {
    margin-bottom: 0.25rem;
  }

  .detail-label {
    font-weight: 600;
    margin-right: 0.25rem;
  }

  .detail-value {
    color: var(--color-text-secondary, #666);
  }

  .actions-column {
    text-align: right;
    white-space: nowrap;
  }

  .edit-button,
  .delete-button {
    padding: 0.35rem 0.75rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-left: 0.5rem;
  }

  .edit-button {
    background: #0056b3;
    color: white;
  }

  .edit-button:hover {
    background: #003d82;
  }

  .delete-button {
    background: #dc3545;
    color: white;
  }

  .delete-button:hover {
    background: #c82333;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .page-button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--color-border, #ddd);
    background: var(--color-bg-primary, #fff);
    border-radius: 4px;
    cursor: pointer;
  }

  .page-button:hover:not(:disabled) {
    background: var(--color-bg-secondary, #f5f5f5);
  }

  .page-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-info {
    font-weight: 600;
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal {
    background: var(--color-bg-primary, #fff);
    border-radius: 8px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: var(--color-text-secondary, #666);
    line-height: 1;
  }

  .close-button:hover {
    color: var(--color-text-primary, #333);
  }

  .modal-body {
    padding: 1.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .required {
    color: #dc3545;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    font-family: inherit;
  }

  .form-group input.error,
  .form-group textarea.error,
  .form-group select.error {
    border-color: #dc3545;
  }

  .error-text {
    display: block;
    margin-top: 0.25rem;
    color: #dc3545;
    font-size: 0.9rem;
  }

  .modal-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    padding: 1.5rem;
    border-top: 1px solid var(--color-border, #ddd);
  }

  .cancel-button,
  .save-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
  }

  .cancel-button {
    background: #6c757d;
    color: white;
  }

  .cancel-button:hover {
    background: #5a6268;
  }

  .save-button {
    background: var(--color-accent, #8b2e1f);
    color: white;
  }

  .save-button:hover:not(:disabled) {
    background: var(--color-accent-dark, #6b1e0f);
  }

  .save-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .confirm-modal {
    max-width: 400px;
  }

  .warning {
    color: #dc3545;
    font-weight: 600;
    margin-top: 0.5rem;
  }

  @media (max-width: 768px) {
    .admin-edit-data {
      padding: 1rem;
    }

    .controls {
      flex-direction: column;
      align-items: stretch;
    }

    .search-box {
      min-width: auto;
    }

    .data-table {
      font-size: 0.9rem;
    }

    .data-table th,
    .data-table td {
      padding: 0.5rem;
    }
  }
</style>
