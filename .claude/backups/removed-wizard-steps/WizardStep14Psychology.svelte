<script>
  import { createEventDispatcher, onMount } from 'svelte'

  export let character = {}
  export let psychologies = []
  export let conditions = []

  const dispatch = createEventDispatcher()

  // Initialize psychologies and conditions if not present
  if (!character.psychologies) {
    character.psychologies = []
  }
  if (!character.conditions) {
    character.conditions = []
  }

  function handleChange() {
    dispatch('change', character)
  }

  function togglePsychology(psychologyId) {
    const index = character.psychologies.indexOf(psychologyId)
    if (index > -1) {
      character.psychologies = character.psychologies.filter(id => id !== psychologyId)
    } else {
      character.psychologies = [...character.psychologies, psychologyId]
    }
    handleChange()
  }

  function toggleCondition(conditionId) {
    const index = character.conditions.indexOf(conditionId)
    if (index > -1) {
      character.conditions = character.conditions.filter(id => id !== conditionId)
    } else {
      character.conditions = [...character.conditions, conditionId]
    }
    handleChange()
  }

  onMount(() => {
    dispatch('validate', { valid: true, errors: [] })
  })
</script>

<div class="wizard-step step-psychology">
  <div class="step-header">
    <h2>Psychology & Conditions</h2>
    <p class="step-description">
      Select any psychological traits or ongoing conditions your character has. These are typically
      acquired during play, but some characters may start with certain traits based on their
      background or species.
    </p>
  </div>

  <div class="step-content">
    <div class="form-section">
      <h3>Psychologies</h3>
      <p class="section-description">
        Psychological traits that affect how your character behaves in certain situations.
      </p>
      {#if psychologies && psychologies.length > 0}
        <div class="selection-grid">
          {#each psychologies as psychology}
            <div class="selection-item">
              <label>
                <input
                  type="checkbox"
                  checked={character.psychologies.includes(psychology.id)}
                  on:change={() => togglePsychology(psychology.id)}
                />
                <span class="selection-name">{psychology.name}</span>
              </label>
              {#if psychology.description}
                <p class="selection-description">{psychology.description}</p>
              {/if}
            </div>
          {/each}
        </div>
      {:else}
        <div class="empty-state">
          No psychologies available in the dataset.
        </div>
      {/if}
    </div>

    <div class="form-section">
      <h3>Conditions</h3>
      <p class="section-description">
        Ongoing conditions or states affecting your character (e.g., Poisoned, Stunned, Fatigued).
        Most characters start without conditions.
      </p>
      {#if conditions && conditions.length > 0}
        <div class="selection-grid">
          {#each conditions as condition}
            <div class="selection-item">
              <label>
                <input
                  type="checkbox"
                  checked={character.conditions.includes(condition.id)}
                  on:change={() => toggleCondition(condition.id)}
                />
                <span class="selection-name">{condition.name}</span>
              </label>
              {#if condition.description || condition.effect}
                <p class="selection-description">{condition.description || condition.effect}</p>
              {/if}
            </div>
          {/each}
        </div>
      {:else}
        <div class="empty-state">
          No conditions available in the dataset.
        </div>
      {/if}
    </div>

    <div class="tip-box">
      <strong>Note:</strong> Most new characters don't have psychologies or active conditions.
      These are typically acquired through gameplay. You can leave these selections empty for a
      standard starting character.
    </div>
  </div>
</div>

<style>
  .wizard-step {
    max-width: 900px;
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

  .form-section {
    margin-bottom: 2rem;
  }

  .form-section:last-child {
    margin-bottom: 0;
  }

  .form-section h3 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1.25rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .section-description {
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
    color: var(--color-text-secondary, #666);
  }

  .selection-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  .selection-item {
    padding: 1rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 6px;
    border: 2px solid transparent;
    transition: all 0.2s;
  }

  .selection-item:has(input:checked) {
    background: var(--color-bg-selected, #e3f2fd);
    border-color: var(--color-accent, #8b2e1f);
  }

  .selection-item label {
    display: flex;
    align-items: flex-start;
    cursor: pointer;
    margin-bottom: 0.5rem;
  }

  .selection-item input[type="checkbox"] {
    margin-right: 0.75rem;
    margin-top: 0.25rem;
    cursor: pointer;
  }

  .selection-name {
    font-weight: 600;
    color: var(--color-text-primary, #333);
  }

  .selection-description {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
    line-height: 1.4;
    padding-left: 1.75rem;
  }

  .empty-state {
    padding: 2rem;
    text-align: center;
    color: var(--color-text-secondary, #666);
    font-style: italic;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 6px;
  }

  .tip-box {
    background: var(--color-bg-info, #fff8e1);
    padding: 1rem;
    border-radius: 6px;
    border-left: 4px solid var(--color-warning, #ffa000);
    margin-top: 1.5rem;
  }

  .tip-box strong {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary, #333);
  }

  @media (max-width: 768px) {
    .step-content {
      padding: 1rem;
    }

    .selection-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
