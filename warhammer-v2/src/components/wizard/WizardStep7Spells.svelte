<script>
  import { createEventDispatcher } from 'svelte'
  import { addSpellToCharacter, removeSpellFromCharacter } from '../../lib/characterModel.js'

  export let character = {}
  export let spells = []
  export let career = null

  const dispatch = createEventDispatcher()

  let searchQuery = ''
  let selectedLore = 'all'

  // Check if career is a spellcaster
  $: isSpellcaster = career && (
    career.name?.toLowerCase().includes('wizard') ||
    career.name?.toLowerCase().includes('priest') ||
    career.name?.toLowerCase().includes('witch') ||
    career.class?.toLowerCase().includes('magic')
  )

  $: selectedSpellIds = new Set(character.spells.map(s => s.id))

  $: availableLores = [...new Set(spells.map(s => s.lore).filter(Boolean))]

  $: filteredSpells = spells.filter(spell => {
    const matchesSearch = !searchQuery ||
      spell.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (spell.description && spell.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesLore = selectedLore === 'all' || spell.lore === selectedLore

    return matchesSearch && matchesLore
  })

  function toggleSpell(spell) {
    if (selectedSpellIds.has(spell.id)) {
      removeSpellFromCharacter(character, spell.id)
    } else {
      addSpellToCharacter(character, spell)
    }

    selectedSpellIds = new Set(character.spells.map(s => s.id))
    dispatch('change', character)
  }
</script>

<div class="wizard-step step-spells">
  <div class="step-header">
    <h2>Spells</h2>
    <p class="step-description">
      {#if isSpellcaster}
        Select your character's starting spells. As a spellcaster, you have access to
        magical powers. Choose spells that complement your career and playstyle.
      {:else}
        This step is for spellcasters only. Your career typically doesn't have access
        to spells. You can skip this step or add spells if your GM allows it.
      {/if}
    </p>
  </div>

  <div class="step-content">
    {#if !isSpellcaster}
      <div class="notice-box">
        <h3>Non-Spellcaster Career</h3>
        <p>
          Your current career ({career?.name || 'None'}) is not typically a spellcasting
          profession. Spells are usually reserved for Wizards, Priests, and other magical careers.
        </p>
        <p>
          If your GM has granted you access to magic, you may select spells below.
          Otherwise, you can proceed to the next step.
        </p>
      </div>
    {/if}

    <div class="filters">
      <div class="filter-group">
        <label for="spell-search">Search Spells:</label>
        <input
          id="spell-search"
          type="text"
          bind:value={searchQuery}
          placeholder="Search by name or description..."
          class="search-input"
        />
      </div>

      <div class="filter-group">
        <label for="spell-lore">Filter by Lore:</label>
        <select
          id="spell-lore"
          bind:value={selectedLore}
          class="lore-select"
        >
          <option value="all">All Lores</option>
          {#each availableLores as lore}
            <option value={lore}>{lore}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="selected-summary">
      <strong>Selected Spells:</strong> {character.spells.length}
    </div>

    {#if filteredSpells.length === 0}
      <div class="empty-state">
        <p>No spells found matching your criteria.</p>
      </div>
    {:else}
      <div class="spells-list">
        {#each filteredSpells as spell}
          <div
            class="spell-item"
            class:selected={selectedSpellIds.has(spell.id)}
          >
            <div class="spell-header">
              <label class="spell-checkbox">
                <input
                  type="checkbox"
                  checked={selectedSpellIds.has(spell.id)}
                  on:change={() => toggleSpell(spell)}
                />
                <span class="spell-name">{spell.name}</span>
              </label>

              <div class="spell-stats">
                {#if spell.cn}
                  <span class="spell-stat">CN: {spell.cn}</span>
                {/if}
                {#if spell.range}
                  <span class="spell-stat">Range: {spell.range}</span>
                {/if}
              </div>
            </div>

            {#if spell.lore}
              <div class="spell-lore">
                <strong>Lore:</strong> {spell.lore}
              </div>
            {/if}

            {#if spell.description}
              <p class="spell-description">{spell.description}</p>
            {/if}

            {#if spell.duration}
              <div class="spell-duration">
                <strong>Duration:</strong> {spell.duration}
              </div>
            {/if}

            {#if spell.target}
              <div class="spell-target">
                <strong>Target:</strong> {spell.target}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .wizard-step {
    max-width: 1000px;
    margin: 0 auto;
  }

  .step-header {
    margin-bottom: 2rem;
  }

  .step-header h2 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
    font-size: 1.75rem;
  }

  .step-description {
    color: var(--color-text-secondary, #666);
    margin: 0;
    line-height: 1.5;
  }

  .step-content {
    background: var(--color-bg-primary, white);
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid var(--color-border, #ddd);
  }

  .notice-box {
    background: #fff3cd;
    border: 2px solid #ffc107;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .notice-box h3 {
    margin: 0 0 0.5rem 0;
    color: #856404;
    font-size: 1.1rem;
  }

  .notice-box p {
    margin: 0.5rem 0;
    color: #856404;
    line-height: 1.5;
  }

  .filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-group label {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--color-text-primary, #333);
  }

  .search-input,
  .lore-select {
    padding: 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 6px;
    font-size: 0.875rem;
  }

  .search-input:focus,
  .lore-select:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .selected-summary {
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 6px;
    font-size: 0.875rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-secondary, #666);
  }

  .spells-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 600px;
    overflow-y: auto;
  }

  .spell-item {
    padding: 1rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    background: var(--color-bg-primary, white);
    transition: all 0.2s;
  }

  .spell-item:hover {
    border-color: var(--color-accent, #8b2e1f);
  }

  .spell-item.selected {
    background: var(--color-accent-light, #fef5f4);
    border-color: var(--color-accent, #8b2e1f);
  }

  .spell-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .spell-checkbox {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    flex: 1;
  }

  .spell-checkbox input[type="checkbox"] {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }

  .spell-name {
    font-weight: 600;
    color: var(--color-text-primary, #333);
    font-size: 1rem;
  }

  .spell-stats {
    display: flex;
    gap: 1rem;
  }

  .spell-stat {
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
    font-weight: 500;
  }

  .spell-lore {
    margin: 0.5rem 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
  }

  .spell-lore strong {
    color: var(--color-accent, #8b2e1f);
  }

  .spell-description {
    margin: 0.5rem 0 0 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
    line-height: 1.4;
  }

  .spell-duration,
  .spell-target {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
  }

  .spell-duration strong,
  .spell-target strong {
    color: var(--color-text-primary, #333);
  }

  @media (max-width: 768px) {
    .step-content {
      padding: 1rem;
    }

    .filters {
      grid-template-columns: 1fr;
    }

    .spell-header {
      flex-direction: column;
      align-items: start;
      gap: 0.5rem;
    }
  }
</style>
