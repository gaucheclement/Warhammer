<script>
  import { createEventDispatcher } from 'svelte'
  import { addTalentToCharacter, removeTalentFromCharacter } from '../../lib/characterModel.js'

  export let character = {}
  export let talents = []
  export let career = null

  const dispatch = createEventDispatcher()

  let searchQuery = ''
  let showOnlyCareer = false

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
</script>

<div class="wizard-step step-talents">
  <div class="step-header">
    <h2>Talents</h2>
    <p class="step-description">
      Select your character's starting talents. Talents are special abilities and traits
      that make your character unique. Talents highlighted in gold are your career talents.
      Some talents can be taken multiple times.
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

              {#if canTakeMultipleTimes(talent)}
                <span class="max-rank">Max Rank: {talent.maxRank}</span>
              {/if}
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

  .max-rank {
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
    font-weight: 500;
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

  @media (max-width: 768px) {
    .step-content {
      padding: 1rem;
    }

    .filters {
      flex-direction: column;
      align-items: stretch;
    }

    .talent-header {
      flex-direction: column;
      align-items: start;
      gap: 0.5rem;
    }
  }
</style>
