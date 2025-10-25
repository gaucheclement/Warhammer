<script>
  import { createEventDispatcher } from 'svelte'
  import { createCharacterFromSpecies } from '../../lib/characterModel.js'

  export let character = {}
  export let species = []

  const dispatch = createEventDispatcher()

  let selectedSpecies = null

  function selectSpecies(speciesData) {
    selectedSpecies = speciesData

    // Apply species modifiers to character
    const updatedCharacter = createCharacterFromSpecies(speciesData)

    // Merge with existing character data (preserve name, appearance, etc.)
    character.species = updatedCharacter.species
    character.characteristics = updatedCharacter.characteristics

    // Merge species skills and talents (don't overwrite existing)
    if (updatedCharacter.skills.length > 0) {
      const existingSkillIds = new Set(character.skills.map(s => s.id))
      updatedCharacter.skills.forEach(skill => {
        if (!existingSkillIds.has(skill.id)) {
          character.skills.push(skill)
        }
      })
    }

    if (updatedCharacter.talents.length > 0) {
      const existingTalentIds = new Set(character.talents.map(t => t.id))
      updatedCharacter.talents.forEach(talent => {
        if (!existingTalentIds.has(talent.id)) {
          character.talents.push(talent)
        }
      })
    }

    dispatch('change', character)
    dispatch('validate', {
      valid: true,
      errors: []
    })
  }

  $: if (character.species?.id) {
    selectedSpecies = species.find(s => s.id === character.species.id)
  }
</script>

<div class="wizard-step step-species">
  <div class="step-header">
    <h2>Choose Species</h2>
    <p class="step-description">
      Select your character's species. Each species has unique characteristic
      modifiers, talents, and skills that shape your character's strengths and weaknesses.
    </p>
  </div>

  <div class="step-content">
    {#if species.length === 0}
      <div class="empty-state">
        <p>Loading species data...</p>
      </div>
    {:else}
      <div class="species-grid">
        {#each species as speciesData}
          <div
            class="species-card"
            class:selected={selectedSpecies?.id === speciesData.id}
            on:click={() => selectSpecies(speciesData)}
            on:keydown={(e) => e.key === 'Enter' && selectSpecies(speciesData)}
            tabindex="0"
            role="button"
          >
            <div class="species-header">
              <h3>{speciesData.name}</h3>
              {#if selectedSpecies?.id === speciesData.id}
                <span class="selected-badge">✓ Selected</span>
              {/if}
            </div>

            {#if speciesData.description}
              <p class="species-description">
                {speciesData.description.substring(0, 150)}
                {speciesData.description.length > 150 ? '...' : ''}
              </p>
            {/if}

            {#if speciesData.characteristics}
              <div class="species-stats">
                <h4>Characteristics:</h4>
                <div class="stat-list">
                  {#each Object.entries(speciesData.characteristics || {}) as [stat, value]}
                    {#if value && value !== 0}
                      <span class="stat-badge">
                        {stat.toUpperCase()}: {value > 0 ? '+' : ''}{value}
                      </span>
                    {/if}
                  {/each}
                </div>
              </div>
            {/if}

            {#if speciesData.skills && speciesData.skills.length > 0}
              <div class="species-extras">
                <strong>Species Skills:</strong>
                {speciesData.skills.length} skills
              </div>
            {/if}

            {#if speciesData.talents && speciesData.talents.length > 0}
              <div class="species-extras">
                <strong>Species Talents:</strong>
                {speciesData.talents.length} talents
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
    max-width: 1200px;
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
    background: var(--color-bg-secondary, #f5f5f5);
    padding: 2rem;
    border-radius: 8px;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-secondary, #666);
  }

  .species-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  .species-card {
    background: var(--color-bg-primary, white);
    border: 2px solid var(--color-border, #ddd);
    border-radius: 8px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .species-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .species-card.selected {
    border-color: var(--color-accent, #8b2e1f);
    background: var(--color-accent-light, #fef5f4);
    box-shadow: 0 0 0 3px rgba(139, 46, 31, 0.1);
  }

  .species-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 1rem;
  }

  .species-header h3 {
    margin: 0;
    color: var(--color-text-primary, #333);
    font-size: 1.25rem;
    font-family: var(--font-heading, serif);
  }

  .selected-badge {
    background: var(--color-accent, #8b2e1f);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .species-description {
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 1rem;
  }

  .species-stats {
    margin-bottom: 1rem;
  }

  .species-stats h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    color: var(--color-text-primary, #333);
    font-weight: 600;
  }

  .stat-list {
    display: flex;
    flex-wrap: wrap;
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

  .species-card.selected .stat-badge {
    background: rgba(139, 46, 31, 0.1);
    color: var(--color-accent, #8b2e1f);
  }

  .species-extras {
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
  }

  .species-extras strong {
    color: var(--color-text-primary, #333);
  }

  @media (max-width: 768px) {
    .step-content {
      padding: 1rem;
    }

    .species-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
