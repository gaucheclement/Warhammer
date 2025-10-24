<script>
  /**
   * CharacterTableRow.svelte
   *
   * Table row component for displaying a character in table view.
   * Shows character info in a tabular format with action buttons.
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

<tr class="character-row">
  <td class="name-cell">
    <a href="#/character/{character.id}" use:link class="character-link">
      {character.name || 'Unnamed Character'}
    </a>
  </td>
  <td class="species-cell">{speciesName}</td>
  <td class="career-cell">{careerName}</td>
  <td class="level-cell">
    <span class="level-badge">Level {careerLevel}</span>
  </td>
  <td class="date-cell">{formatDate(character.created)}</td>
  <td class="date-cell">{formatDate(character.updated)}</td>
  <td class="actions-cell">
    <div class="action-buttons">
      <a
        href="#/character/{character.id}"
        use:link
        class="action-btn action-view"
        title="View character sheet"
        aria-label="View {character.name}"
      >
        {@html getIcon('eye', 'icon-svg', 18)}
      </a>

      <a
        href="#/character/{character.id}?edit=true"
        use:link
        class="action-btn action-edit"
        title="Edit character"
        aria-label="Edit {character.name}"
      >
        {@html getIcon('edit', 'icon-svg', 18)}
      </a>

      <button
        class="action-btn action-duplicate"
        on:click={handleDuplicate}
        title="Duplicate character"
        aria-label="Duplicate {character.name}"
      >
        {@html getIcon('copy', 'icon-svg', 18)}
      </button>

      <button
        class="action-btn action-export"
        on:click={handleExport}
        title="Export as JSON"
        aria-label="Export {character.name}"
      >
        {@html getIcon('download', 'icon-svg', 18)}
      </button>

      <button
        class="action-btn action-delete"
        on:click={handleDelete}
        title="Delete character"
        aria-label="Delete {character.name}"
      >
        {@html getIcon('trash', 'icon-svg', 18)}
      </button>
    </div>
  </td>
</tr>

<style>
  .character-row {
    border-bottom: 1px solid var(--color-border);
    transition: background-color 0.2s;
  }

  .character-row:hover {
    background: var(--color-bg-tertiary);
  }

  .character-row:last-child {
    border-bottom: none;
  }

  td {
    padding: 1rem;
    color: var(--color-text-primary);
  }

  .name-cell {
    font-weight: 500;
  }

  .character-link {
    color: var(--color-text-primary);
    text-decoration: none;
    transition: color 0.2s;
  }

  .character-link:hover {
    color: var(--color-accent);
  }

  .species-cell,
  .career-cell {
    color: var(--color-text-secondary);
  }

  .level-cell {
    text-align: center;
  }

  .level-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: var(--color-accent);
    color: white;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .date-cell {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
  }

  .actions-cell {
    padding: 0.5rem 1rem;
  }

  .action-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0.5rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .action-btn:hover {
    transform: scale(1.1);
    border-color: var(--color-border-strong);
  }

  .action-view:hover {
    background: var(--color-info-bg, #e6f3ff);
    color: var(--color-info, #0066cc);
    border-color: var(--color-info, #0066cc);
  }

  .action-edit:hover {
    background: var(--color-warning-bg, #fff7e6);
    color: var(--color-warning, #ff9800);
    border-color: var(--color-warning, #ff9800);
  }

  .action-duplicate:hover {
    background: var(--color-success-bg, #e6f4ea);
    color: var(--color-success, #28a745);
    border-color: var(--color-success, #28a745);
  }

  .action-export:hover {
    background: var(--color-info-bg, #e6f3ff);
    color: var(--color-info, #0066cc);
    border-color: var(--color-info, #0066cc);
  }

  .action-delete:hover {
    background: var(--color-error-bg, #ffebee);
    color: var(--color-error, #dc3545);
    border-color: var(--color-error, #dc3545);
  }

  @media (max-width: 1024px) {
    .date-cell:first-of-type {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .character-row {
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-areas:
        "name level"
        "species species"
        "career career"
        "date date"
        "actions actions";
      gap: 0.5rem;
      padding: 1rem;
    }

    td {
      padding: 0;
      border: none;
    }

    .name-cell {
      grid-area: name;
    }

    .level-cell {
      grid-area: level;
      text-align: right;
    }

    .species-cell {
      grid-area: species;
      font-size: 0.9rem;
    }

    .career-cell {
      grid-area: career;
      font-size: 0.9rem;
    }

    .date-cell {
      grid-area: date;
      font-size: 0.85rem;
    }

    .date-cell:first-of-type {
      display: none;
    }

    .actions-cell {
      grid-area: actions;
      padding-top: 0.5rem;
    }

    .action-buttons {
      justify-content: flex-start;
    }
  }
</style>
