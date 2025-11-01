<script>
  import { createEventDispatcher } from 'svelte'
  import { addTalentToCharacter, removeTalentFromCharacter, addSpellToCharacter, removeSpellFromCharacter } from '../../lib/characterModel.js'

  export let character = {}
  export let talents = []
  export let spells = []
  export let career = null
  export let onEntityClick = null

  const dispatch = createEventDispatcher()

  let searchQuery = ''
  let showOnlyCareer = false
  let spellSearchQuery = ''
  let selectedLore = 'all'

  $: careerTalentIds = new Set(
    (career?.talents || []).map(t => typeof t === 'string' ? t : t.id)
  )

  $: selectedTalentIds = new Set(character.talents.map(t => t.id))

  $: filteredTalents = talents.filter(talent => {
    const matchesSearch = !searchQuery ||
      talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (talent.description && talent.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCareerFilter = !showOnlyCareer || careerTalentIds.has(talent.id)

    return matchesSearch && matchesCareerFilter
  })

  function toggleTalent(talent) {
    if (selectedTalentIds.has(talent.id)) {
      removeTalentFromCharacter(character, talent.id)
    } else {
      // Check prerequisites (simplified - would need more complex logic in production)
      addTalentToCharacter(character, talent)
    }

    selectedTalentIds = new Set(character.talents.map(t => t.id))
    dispatch('change', character)
  }

  function getTalentTimes(talentId) {
    const talent = character.talents.find(t => t.id === talentId)
    return talent ? talent.times : 0
  }

  function updateTalentTimes(talentId, times) {
    const talent = character.talents.find(t => t.id === talentId)
    const talentDef = talents.find(t => t.id === talentId)
    const maxRank = talentDef?.maxRank || 1

    if (talent) {
      talent.times = Math.max(1, Math.min(maxRank, parseInt(times) || 1))
      dispatch('change', character)
    }
  }

  function isCareerTalent(talentId) {
    return careerTalentIds.has(talentId)
  }

  function canTakeMultipleTimes(talent) {
    return talent.maxRank && talent.maxRank > 1
  }

  // Spell-related functions
  function hasMagicTalent() {
    return character.talents.some(t =>
      t.name?.toLowerCase().includes('magic') ||
      t.name?.toLowerCase().includes('arcane') ||
      t.name?.toLowerCase().includes('petty') ||
      t.name?.toLowerCase().includes('witch') ||
      t.name?.toLowerCase().includes('lore') ||
      t.name?.toLowerCase().includes('channel')
    ) || (career && (
      career.name?.toLowerCase().includes('wizard') ||
      career.name?.toLowerCase().includes('priest') ||
      career.name?.toLowerCase().includes('witch') ||
      career.class?.toLowerCase().includes('magic')
    ))
  }

  $: selectedSpellIds = new Set(character.spells.map(s => s.id))
  $: availableLores = [...new Set(spells.map(s => s.lore).filter(Boolean))]
  $: hasMagic = hasMagicTalent()

  $: filteredSpells = spells.filter(spell => {
    const matchesSearch = !spellSearchQuery ||
      spell.name.toLowerCase().includes(spellSearchQuery.toLowerCase()) ||
      (spell.description && spell.description.toLowerCase().includes(spellSearchQuery.toLowerCase()))

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

<div class="wizard-step step-talents">
  <div class="step-header">
    <h2>Talents & Spells</h2>
    <p class="step-description">
      Select your character's starting talents. Talents are special abilities and traits
      that make your character unique. Talents highlighted in gold are your career talents.
      Some talents can be taken multiple times. If you have magic talents, spell selection will appear below.
    </p>
  </div>

  <div class="step-content">
    <div class="filters">
      <div class="filter-group">
        <label for="talent-search">Search Talents:</label>
        <input
          id="talent-search"
          type="text"
          bind:value={searchQuery}
          placeholder="Search by name or description..."
          class="search-input"
        />
      </div>

      <div class="filter-checkbox">
        <label>
          <input
            type="checkbox"
            bind:checked={showOnlyCareer}
          />
          <span>Show only career talents</span>
        </label>
      </div>
    </div>

    <div class="selected-summary">
      <strong>Selected Talents:</strong> {character.talents.length}
      {#if career && careerTalentIds.size > 0}
        <span class="career-indicator">
          (Career Talents: {[...careerTalentIds].filter(id => selectedTalentIds.has(id)).length} / {careerTalentIds.size})
        </span>
      {/if}
    </div>

    {#if filteredTalents.length === 0}
      <div class="empty-state">
        <p>No talents found matching your criteria.</p>
      </div>
    {:else}
      <div class="talents-list">
        {#each filteredTalents as talent}
          <div
            class="talent-item"
            class:selected={selectedTalentIds.has(talent.id)}
            class:career-talent={isCareerTalent(talent.id)}
          >
            <div class="talent-header">
              <label class="talent-checkbox">
                <input
                  type="checkbox"
                  checked={selectedTalentIds.has(talent.id)}
                  on:change={() => toggleTalent(talent)}
                />
                <span class="talent-name">
                  {talent.name}
                  {#if isCareerTalent(talent.id)}
                    <span class="career-badge">Career</span>
                  {/if}
                </span>
              </label>

              <div class="talent-meta">
                {#if canTakeMultipleTimes(talent)}
                  <span class="max-rank">Max Rank: {talent.maxRank}</span>
                {/if}
                {#if onEntityClick}
                  <button
                    class="info-button"
                    on:click|stopPropagation={() => onEntityClick('talent', talent.id)}
                    title="View talent details"
                    aria-label="View details for {talent.name}"
                  >
                    ℹ️
                  </button>
                {/if}
              </div>
            </div>

            {#if talent.description}
              <p class="talent-description">{talent.description}</p>
            {/if}

            {#if talent.tests}
              <div class="talent-tests">
                <strong>Tests:</strong> {talent.tests}
              </div>
            {/if}

            {#if selectedTalentIds.has(talent.id) && canTakeMultipleTimes(talent)}
              <div class="talent-times">
                <label for="times-{talent.id}">Times Taken:</label>
                <input
                  id="times-{talent.id}"
                  type="number"
                  value={getTalentTimes(talent.id)}
                  on:input={(e) => updateTalentTimes(talent.id, e.target.value)}
                  min="1"
                  max={talent.maxRank}
                  class="times-input"
                />
                <span class="times-help">(1-{talent.maxRank})</span>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

    <!-- Spells Section (conditionally shown if character has magic talents) -->
    {#if hasMagic}
      <div class="spells-section">
        <div class="section-divider"></div>
        <h3 class="spells-header">Spells</h3>
        <p class="spells-description">
          Your magical talents grant you access to spells. Select the spells your character knows.
        </p>

        <div class="filters spell-filters">
          <div class="filter-group">
            <label for="spell-search">Search Spells:</label>
            <input
              id="spell-search"
              type="text"
              bind:value={spellSearchQuery}
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
                    {#if onEntityClick}
                      <button
                        class="info-button"
                        on:click|stopPropagation={() => onEntityClick('spell', spell.id)}
                        title="View spell details"
                        aria-label="View details for {spell.name}"
                      >
                        ℹ️
                      </button>
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
                  <div class="spell-meta">
                    <strong>Duration:</strong> {spell.duration}
                  </div>
                {/if}

                {#if spell.target}
                  <div class="spell-meta">
                    <strong>Target:</strong> {spell.target}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
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

  .filters {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .filter-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-group label {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--color-text-primary, #333);
  }

  .search-input {
    padding: 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 6px;
    font-size: 0.875rem;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .filter-checkbox label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-weight: 500;
  }

  .selected-summary {
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 6px;
    font-size: 0.875rem;
  }

  .career-indicator {
    color: var(--color-accent, #8b2e1f);
    font-weight: 600;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-secondary, #666);
  }

  .talents-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 600px;
    overflow-y: auto;
  }

  .talent-item {
    padding: 1rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    background: var(--color-bg-primary, white);
    transition: all 0.2s;
  }

  .talent-item:hover {
    border-color: var(--color-accent, #8b2e1f);
  }

  .talent-item.selected {
    background: var(--color-accent-light, #fef5f4);
    border-color: var(--color-accent, #8b2e1f);
  }

  .talent-item.career-talent {
    border-left: 4px solid gold;
  }

  .talent-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .talent-checkbox {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    flex: 1;
  }

  .talent-checkbox input[type="checkbox"] {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }

  .talent-name {
    font-weight: 600;
    color: var(--color-text-primary, #333);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .career-badge {
    background: gold;
    color: #333;
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .talent-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .max-rank {
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
    font-weight: 500;
  }

  .info-button {
    background: none;
    border: none;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    font-size: 1.125rem;
    border-radius: 4px;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .info-button:hover {
    background: var(--color-bg-secondary, #f5f5f5);
  }

  .info-button:active {
    background: var(--color-border, #ddd);
  }

  .talent-description {
    margin: 0.5rem 0 0 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
    line-height: 1.4;
  }

  .talent-tests {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
  }

  .talent-tests strong {
    color: var(--color-text-primary, #333);
  }

  .talent-times {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--color-border, #ddd);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .talent-times label {
    font-weight: 600;
    font-size: 0.875rem;
  }

  .times-input {
    width: 80px;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .times-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .times-help {
    font-size: 0.75rem;
    color: var(--color-text-secondary, #666);
  }

  /* Spells Section */
  .spells-section {
    margin-top: 2rem;
  }

  .section-divider {
    height: 2px;
    background: linear-gradient(to right, var(--color-accent, #8b2e1f), transparent);
    margin-bottom: 2rem;
  }

  .spells-header {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1.5rem;
    font-family: var(--font-heading, serif);
  }

  .spells-description {
    color: var(--color-text-secondary, #666);
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
  }

  .spell-filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .lore-select {
    padding: 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 6px;
    font-size: 0.875rem;
  }

  .lore-select:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .spells-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 500px;
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

  .spell-meta {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
  }

  .spell-meta strong {
    color: var(--color-text-primary, #333);
  }

  @media (max-width: 768px) {
    .step-content {
      padding: 1rem;
    }

    .filters,
    .spell-filters {
      flex-direction: column;
      align-items: stretch;
      grid-template-columns: 1fr;
    }

    .talent-header,
    .spell-header {
      flex-direction: column;
      align-items: start;
      gap: 0.5rem;
    }
  }
</style>
