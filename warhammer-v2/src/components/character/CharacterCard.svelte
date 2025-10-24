<script>
  /**
   * CharacterCard.svelte
   *
   * Card component for displaying a character in grid view.
   * Shows basic character info and action buttons.
   */
  import { createEventDispatcher } from 'svelte'
  import { link } from 'svelte-spa-router'
  import { getIcon } from '../../lib/icons.js'

  export let character

  const dispatch = createEventDispatcher()

  // Get species name (handle both object and string)
  $: speciesName = character.species
    ? typeof character.species === 'object'
      ? character.species.name
      : character.species
    : 'Unknown'

  // Get career name (handle both object and string)
  $: careerName = character.career
    ? typeof character.career === 'object'
      ? character.career.name
      : character.career
    : 'Unknown'

  // Get career level
  $: careerLevel = character.career?.level || 1

  // Format date
  function formatDate(dateString) {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format time ago
  function timeAgo(dateString) {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)

    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    const weeks = Math.floor(days / 7)
    if (weeks < 4) return `${weeks}w ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months}mo ago`
    const years = Math.floor(days / 365)
    return `${years}y ago`
  }

  function handleDuplicate() {
    dispatch('duplicate')
  }

  function handleDelete() {
    dispatch('delete')
  }

  function handleExport() {
    dispatch('export')
  }
</script>

<div class="character-card">
  <div class="card-header">
    <h3 class="character-name">
      <a href="#/character/{character.id}" use:link>
        {character.name || 'Unnamed Character'}
      </a>
    </h3>
    <div class="level-badge">Lvl {careerLevel}</div>
  </div>

  <div class="card-body">
    <div class="character-info">
      <div class="info-row">
        <span class="info-label">Species:</span>
        <span class="info-value">{speciesName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Career:</span>
        <span class="info-value">{careerName}</span>
      </div>
    </div>

    {#if character.description}
      <p class="character-description">
        {character.description.substring(0, 100)}{character.description.length > 100 ? '...' : ''}
      </p>
    {/if}

    <div class="card-meta">
      <div class="meta-item">
        <span class="meta-label">Updated:</span>
        <span class="meta-value" title={formatDate(character.updated)}>
          {timeAgo(character.updated)}
        </span>
      </div>
    </div>
  </div>

  <div class="card-actions">
    <a
      href="#/character/{character.id}"
      use:link
      class="action-btn action-view"
      title="View character sheet"
    >
      {@html getIcon('eye', 'icon-svg', 18)}
      <span>View</span>
    </a>

    <a
      href="#/character/{character.id}?edit=true"
      use:link
      class="action-btn action-edit"
      title="Edit character"
    >
      {@html getIcon('edit', 'icon-svg', 18)}
      <span>Edit</span>
    </a>

    <button
      class="action-btn action-duplicate"
      on:click={handleDuplicate}
      title="Duplicate character"
    >
      {@html getIcon('copy', 'icon-svg', 18)}
      <span>Duplicate</span>
    </button>

    <button
      class="action-btn action-export"
      on:click={handleExport}
      title="Export as JSON"
    >
      {@html getIcon('download', 'icon-svg', 18)}
      <span>Export</span>
    </button>

    <button
      class="action-btn action-delete"
      on:click={handleDelete}
      title="Delete character"
    >
      {@html getIcon('trash', 'icon-svg', 18)}
      <span>Delete</span>
    </button>
  </div>
</div>

<style>
  .character-card {
    display: flex;
    flex-direction: column;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s;
  }

  .character-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--color-border-strong);
  }

  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.25rem 0 1.25rem;
  }

  .character-name {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    flex: 1;
  }

  .character-name a {
    color: var(--color-text-primary);
    text-decoration: none;
    transition: color 0.2s;
  }

  .character-name a:hover {
    color: var(--color-accent);
  }

  .level-badge {
    padding: 0.25rem 0.75rem;
    background: var(--color-accent);
    color: white;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
    flex-shrink: 0;
  }

  .card-body {
    padding: 1.25rem;
    flex: 1;
  }

  .character-info {
    margin-bottom: 1rem;
  }

  .info-row {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .info-label {
    font-weight: 500;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
  }

  .info-value {
    color: var(--color-text-primary);
    font-size: 0.9rem;
  }

  .character-description {
    margin: 0 0 1rem 0;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--color-border);
  }

  .meta-item {
    display: flex;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .meta-label {
    color: var(--color-text-secondary);
  }

  .meta-value {
    color: var(--color-text-primary);
    font-weight: 500;
  }

  .card-actions {
    display: flex;
    border-top: 1px solid var(--color-border);
    background: var(--color-bg-tertiary);
  }

  .action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 0.5rem;
    background: transparent;
    border: none;
    border-right: 1px solid var(--color-border);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .action-btn:last-child {
    border-right: none;
  }

  .action-btn:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }

  .action-view:hover {
    color: var(--color-info, #0066cc);
  }

  .action-edit:hover {
    color: var(--color-warning, #ff9800);
  }

  .action-duplicate:hover {
    color: var(--color-success, #28a745);
  }

  .action-export:hover {
    color: var(--color-info, #0066cc);
  }

  .action-delete:hover {
    color: var(--color-error, #dc3545);
  }

  .action-btn :global(.icon-svg) {
    flex-shrink: 0;
  }

  .action-btn span {
    display: none;
  }

  @media (min-width: 400px) {
    .action-btn span {
      display: inline;
    }
  }

  @media (max-width: 768px) {
    .character-card {
      margin-bottom: 1rem;
    }

    .card-actions {
      flex-wrap: wrap;
    }

    .action-btn {
      flex: 1 1 calc(33.333% - 2px);
      border-right: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
    }

    .action-btn:nth-child(3n) {
      border-right: none;
    }

    .action-btn:nth-last-child(-n+3) {
      border-bottom: none;
    }
  }
</style>
