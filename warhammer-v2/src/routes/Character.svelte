<script>
  import { link } from 'svelte-spa-router'
  import { onMount } from 'svelte'

  export let params = {}

  let characterId = params.id
  let character = null
  let loading = true
  let notFound = false

  $: {
    characterId = params.id
    loadCharacter()
  }

  onMount(() => {
    loadCharacter()
  })

  async function loadCharacter() {
    loading = true
    notFound = false

    // TODO: Load character from database
    // For now, show placeholder
    setTimeout(() => {
      // Simulated load
      character = {
        id: characterId,
        name: 'Sample Character',
        species: 'Human',
        career: 'Soldier',
        characteristics: {
          WS: 35,
          BS: 30,
          S: 30,
          T: 30,
          I: 30,
          Ag: 30,
          Dex: 30,
          Int: 30,
          WP: 30,
          Fel: 30
        },
        skills: [],
        talents: [],
        equipment: []
      }
      loading = false
    }, 500)
  }

  function handleEdit() {
    alert('Edit functionality will be implemented in future tasks')
  }

  function handleDelete() {
    if (confirm('Are you sure you want to delete this character?')) {
      alert('Delete functionality will be implemented in future tasks')
    }
  }

  function handleExport() {
    alert('Export functionality will be implemented in future tasks')
  }
</script>

<div class="character-page">
  {#if loading}
    <div class="loading-state">
      <p>Loading character...</p>
    </div>
  {:else if notFound}
    <div class="not-found">
      <h1>Character Not Found</h1>
      <p>The character with ID "{characterId}" could not be found.</p>
      <a href="#/" use:link class="btn">Return to Home</a>
    </div>
  {:else if character}
    <header class="character-header">
      <div class="header-content">
        <h1>{character.name}</h1>
        <p class="subtitle">{character.species} {character.career}</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" on:click={handleEdit}>Edit</button>
        <button class="btn btn-secondary" on:click={handleExport}>Export</button>
        <button class="btn btn-danger" on:click={handleDelete}>Delete</button>
      </div>
    </header>

    <div class="character-content">
      <section class="character-section">
        <h2>Characteristics</h2>
        <div class="characteristics-grid">
          {#each Object.entries(character.characteristics) as [name, value]}
            <div class="characteristic">
              <div class="char-name">{name}</div>
              <div class="char-value">{value}</div>
            </div>
          {/each}
        </div>
      </section>

      <section class="character-section">
        <h2>Skills</h2>
        {#if character.skills.length === 0}
          <p class="empty-message">No skills yet</p>
        {:else}
          <div class="skills-list">
            {#each character.skills as skill}
              <div class="skill-item">
                <span class="skill-name">{skill.name}</span>
                <span class="skill-value">{skill.advances}</span>
              </div>
            {/each}
          </div>
        {/if}
      </section>

      <section class="character-section">
        <h2>Talents</h2>
        {#if character.talents.length === 0}
          <p class="empty-message">No talents yet</p>
        {:else}
          <div class="talents-list">
            {#each character.talents as talent}
              <div class="talent-item">
                <h3>{talent.name}</h3>
                <p>{talent.description || ''}</p>
              </div>
            {/each}
          </div>
        {/if}
      </section>

      <section class="character-section">
        <h2>Equipment</h2>
        {#if character.equipment.length === 0}
          <p class="empty-message">No equipment yet</p>
        {:else}
          <div class="equipment-list">
            {#each character.equipment as item}
              <div class="equipment-item">{item.name}</div>
            {/each}
          </div>
        {/if}
      </section>
    </div>
  {/if}
</div>

<style>
  .character-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .loading-state,
  .not-found {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-secondary, #666);
  }

  .not-found h1 {
    color: var(--color-text-primary, #333);
    margin-bottom: 1rem;
  }

  .character-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-border, #ddd);
  }

  .header-content h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .subtitle {
    color: var(--color-text-secondary, #666);
    margin: 0;
    font-size: 1.1rem;
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
  }

  .btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    background: var(--color-accent, #8b2e1f);
    color: white;
  }

  .btn:hover {
    background: var(--color-accent-hover, #a63728);
  }

  .btn-secondary {
    background: var(--color-bg-secondary, #f5f5f5);
    color: var(--color-text-primary, #333);
    border: 1px solid var(--color-border, #ddd);
  }

  .btn-secondary:hover {
    background: var(--color-bg-tertiary, #e5e5e5);
  }

  .btn-danger {
    background: #dc3545;
    color: white;
  }

  .btn-danger:hover {
    background: #c82333;
  }

  .character-content {
    display: grid;
    gap: 2rem;
  }

  .character-section {
    background: var(--color-bg-secondary, #f5f5f5);
    padding: 1.5rem;
    border-radius: 8px;
  }

  .character-section h2 {
    margin: 0 0 1rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1.5rem;
    font-family: var(--font-heading, serif);
  }

  .characteristics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 1rem;
  }

  .characteristic {
    text-align: center;
    padding: 1rem;
    background: var(--color-bg-primary, white);
    border-radius: 6px;
    border: 2px solid var(--color-border, #ddd);
  }

  .char-name {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #666);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }

  .char-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-accent, #8b2e1f);
  }

  .empty-message {
    color: var(--color-text-secondary, #999);
    font-style: italic;
    margin: 0;
  }

  .skills-list,
  .equipment-list {
    display: grid;
    gap: 0.75rem;
  }

  .skill-item,
  .equipment-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--color-bg-primary, white);
    border-radius: 6px;
  }

  .skill-name {
    color: var(--color-text-primary, #333);
  }

  .skill-value {
    font-weight: bold;
    color: var(--color-accent, #8b2e1f);
  }

  .talents-list {
    display: grid;
    gap: 1rem;
  }

  .talent-item {
    padding: 1rem;
    background: var(--color-bg-primary, white);
    border-radius: 6px;
  }

  .talent-item h3 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1.1rem;
  }

  .talent-item p {
    margin: 0;
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .character-page {
      padding: 1rem;
    }

    .character-header {
      flex-direction: column;
      gap: 1rem;
    }

    .header-actions {
      width: 100%;
      justify-content: stretch;
    }

    .header-actions .btn {
      flex: 1;
      text-align: center;
    }

    .characteristics-grid {
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
    }

    .characteristic {
      padding: 0.75rem 0.5rem;
    }

    .char-name {
      font-size: 0.75rem;
    }

    .char-value {
      font-size: 1.25rem;
    }
  }
</style>
