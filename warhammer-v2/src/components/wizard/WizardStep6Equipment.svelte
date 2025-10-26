<script>
  import { createEventDispatcher } from 'svelte'
  import { addTrappingToCharacter, removeTrappingFromCharacter } from '../../lib/characterModel.js'
  import { calculateEncumbrance } from '../../lib/characterCalculations.js'

  export let character = {}
  export let trappings = []
  export let career = null

  const dispatch = createEventDispatcher()

  let searchQuery = ''
  let showOnlyCareer = false

  $: careerTrappingIds = new Set(
    (career?.trappings || []).map(t => typeof t === 'string' ? t : t.id)
  )

  $: selectedTrappingIds = new Set(character.trappings.map(t => t.id))

  $: totalEncumbrance = calculateEncumbrance(character.trappings)

  $: filteredTrappings = trappings.filter(trapping => {
    const matchesSearch = !searchQuery ||
      trapping.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trapping.description && trapping.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCareerFilter = !showOnlyCareer || careerTrappingIds.has(trapping.id)

    return matchesSearch && matchesCareerFilter
  })

  function toggleTrapping(trapping) {
    if (selectedTrappingIds.has(trapping.id)) {
      removeTrappingFromCharacter(character, trapping.id)
    } else {
      addTrappingToCharacter(character, trapping, 1)
    }

    selectedTrappingIds = new Set(character.trappings.map(t => t.id))
    dispatch('change', character)
  }

  function getTrappingQuantity(trappingId) {
    const trapping = character.trappings.find(t => t.id === trappingId)
    return trapping ? trapping.quantity : 0
  }

  function updateTrappingQuantity(trappingId, quantity) {
    const trapping = character.trappings.find(t => t.id === trappingId)
    if (trapping) {
      trapping.quantity = Math.max(1, parseInt(quantity) || 1)
      dispatch('change', character)
    }
  }

  function isCareerTrapping(trappingId) {
    return careerTrappingIds.has(trappingId)
  }

  // Auto-add career trappings on mount
  import { onMount } from 'svelte'

  onMount(() => {
    if (career && career.trappings && career.trappings.length > 0 && character.trappings.length === 0) {
      career.trappings.forEach(trappingRef => {
        const trappingId = typeof trappingRef === 'string' ? trappingRef : trappingRef.id
        const trappingData = trappings.find(t => t.id === trappingId)
        if (trappingData && !selectedTrappingIds.has(trappingId)) {
          addTrappingToCharacter(character, trappingData, 1)
        }
      })
      selectedTrappingIds = new Set(character.trappings.map(t => t.id))
      dispatch('change', character)
    }
  })
</script>

<div class="wizard-step step-equipment">
  <div class="step-header">
    <h2>Equipment & Trappings</h2>
    <p class="step-description">
      Select your character's starting equipment. Career trappings (highlighted in gold)
      are automatically included with your profession. You can add additional items as needed.
    </p>
  </div>

  <div class="step-content">
    <div class="filters">
      <div class="filter-group">
        <label for="equipment-search">Search Equipment:</label>
        <input
          id="equipment-search"
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
          <span>Show only career trappings</span>
        </label>
      </div>
    </div>

    <div class="selected-summary">
      <div>
        <strong>Selected Items:</strong> {character.trappings.length}
        {#if career && careerTrappingIds.size > 0}
          <span class="career-indicator">
            (Career Items: {[...careerTrappingIds].filter(id => selectedTrappingIds.has(id)).length} / {careerTrappingIds.size})
          </span>
        {/if}
      </div>
      <div class="encumbrance-display">
        <strong>Total Encumbrance:</strong> {totalEncumbrance}
      </div>
    </div>

    {#if filteredTrappings.length === 0}
      <div class="empty-state">
        <p>No equipment found matching your criteria.</p>
      </div>
    {:else}
      <div class="equipment-list">
        {#each filteredTrappings as trapping}
          <div
            class="equipment-item"
            class:selected={selectedTrappingIds.has(trapping.id)}
            class:career-item={isCareerTrapping(trapping.id)}
          >
            <div class="equipment-header">
              <label class="equipment-checkbox">
                <input
                  type="checkbox"
                  checked={selectedTrappingIds.has(trapping.id)}
                  on:change={() => toggleTrapping(trapping)}
                />
                <span class="equipment-name">
                  {trapping.name}
                  {#if isCareerTrapping(trapping.id)}
                    <span class="career-badge">Career</span>
                  {/if}
                </span>
              </label>

              <div class="equipment-stats">
                {#if trapping.encumbrance}
                  <span class="stat-badge">Enc: {trapping.encumbrance}</span>
                {/if}
                {#if trapping.price}
                  <span class="stat-badge">{trapping.price}</span>
                {/if}
              </div>
            </div>

            {#if trapping.description}
              <p class="equipment-description">{trapping.description}</p>
            {/if}

            {#if selectedTrappingIds.has(trapping.id)}
              <div class="equipment-quantity">
                <label for="quantity-{trapping.id}">Quantity:</label>
                <input
                  id="quantity-{trapping.id}"
                  type="number"
                  value={getTrappingQuantity(trapping.id)}
                  on:input={(e) => updateTrappingQuantity(trapping.id, e.target.value)}
                  min="1"
                  max="999"
                  class="quantity-input"
                />
                {#if trapping.encumbrance}
                  <span class="quantity-enc">
                    Total Enc: {trapping.encumbrance * getTrappingQuantity(trapping.id)}
                  </span>
                {/if}
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
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  .encumbrance-display {
    color: var(--color-accent, #8b2e1f);
    font-weight: 600;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-secondary, #666);
  }

  .equipment-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 600px;
    overflow-y: auto;
  }

  .equipment-item {
    padding: 1rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    background: var(--color-bg-primary, white);
    transition: all 0.2s;
  }

  .equipment-item:hover {
    border-color: var(--color-accent, #8b2e1f);
  }

  .equipment-item.selected {
    background: var(--color-accent-light, #fef5f4);
    border-color: var(--color-accent, #8b2e1f);
  }

  .equipment-item.career-item {
    border-left: 4px solid gold;
  }

  .equipment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .equipment-checkbox {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    flex: 1;
  }

  .equipment-checkbox input[type="checkbox"] {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }

  .equipment-name {
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

  .equipment-stats {
    display: flex;
    gap: 0.5rem;
  }

  .stat-badge {
    background: var(--color-bg-secondary, #f5f5f5);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-primary, #333);
  }

  .equipment-description {
    margin: 0.5rem 0 0 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
    line-height: 1.4;
  }

  .equipment-quantity {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--color-border, #ddd);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .equipment-quantity label {
    font-weight: 600;
    font-size: 0.875rem;
  }

  .quantity-input {
    width: 80px;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .quantity-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .quantity-enc {
    font-size: 0.75rem;
    color: var(--color-text-secondary, #666);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .step-content {
      padding: 1rem;
    }

    .filters {
      flex-direction: column;
      align-items: stretch;
    }

    .selected-summary {
      flex-direction: column;
      align-items: start;
      gap: 0.5rem;
    }

    .equipment-header {
      flex-direction: column;
      align-items: start;
      gap: 0.5rem;
    }
  }
</style>
