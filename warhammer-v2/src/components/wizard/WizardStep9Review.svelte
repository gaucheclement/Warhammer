<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { validateCompleteCharacter } from '../../lib/characterValidation.js'

  export let character = {}
  export let mergedData = {}
  export let onJumpToStep = () => {}

  const dispatch = createEventDispatcher()

  let validationResult = { valid: true, errors: [], warnings: [] }

  function validateCharacter() {
    validationResult = validateCompleteCharacter(character, {
      existingCharacters: [],
      talentDefinitions: mergedData.talents || [],
      career: mergedData.careers?.find(c => c.id === character.career?.id)
    })

    dispatch('validate', {
      valid: validationResult.valid,
      errors: validationResult.errors
    })
  }

  onMount(() => {
    validateCharacter()
  })

  $: if (character) {
    validateCharacter()
  }
</script>

<div class="wizard-step step-review">
  <div class="step-header">
    <h2>Review Your Character</h2>
    <p class="step-description">
      Review all the details of your character before finalizing. Click any "Edit" button to jump
      back to that step and make changes.
    </p>
  </div>

  <div class="step-content">
    {#if !validationResult.valid}
      <div class="error-box">
        <strong>Validation Errors:</strong>
        <ul>
          {#each validationResult.errors as error}
            <li>{error}</li>
          {/each}
        </ul>
        <p>Please correct these errors before creating your character.</p>
      </div>
    {/if}

    {#if validationResult.warnings.length > 0}
      <div class="warning-box">
        <strong>Warnings:</strong>
        <ul>
          {#each validationResult.warnings as warning}
            <li>{warning}</li>
          {/each}
        </ul>
      </div>
    {/if}

    <div class="review-section">
      <div class="section-header">
        <h3>Basic Information</h3>
        <button type="button" class="btn-edit" on:click={() => onJumpToStep(1)}>Edit</button>
      </div>
      <div class="section-content">
        <div class="review-item">
          <span class="label">Name:</span>
          <span class="value">{character.name || 'Not set'}</span>
        </div>
        <div class="review-item">
          <span class="label">Species:</span>
          <span class="value">{character.species?.name || 'Not selected'}</span>
        </div>
        <div class="review-item">
          <span class="label">Career:</span>
          <span class="value">{character.career?.name || 'Not selected'} (Level {character.career?.level || 1})</span>
        </div>
        {#if character.appearance?.eyes || character.appearance?.hair}
          <div class="review-item">
            <span class="label">Appearance:</span>
            <span class="value">
              {#if character.appearance.eyes}Eyes: {character.appearance.eyes}{/if}
              {#if character.appearance.hair}, Hair: {character.appearance.hair}{/if}
            </span>
          </div>
        {/if}
      </div>
    </div>

    <div class="review-section">
      <div class="section-header">
        <h3>Characteristics</h3>
        <button type="button" class="btn-edit" on:click={() => onJumpToStep(4)}>Edit</button>
      </div>
      <div class="section-content">
        <div class="characteristics-grid">
          {#each Object.entries(character.characteristics || {}) as [key, value]}
            <div class="char-item">
              <span class="char-name">{key}</span>
              <span class="char-value">{value}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <div class="review-section">
      <div class="section-header">
        <h3>Skills ({character.skills?.length || 0})</h3>
        <button type="button" class="btn-edit" on:click={() => onJumpToStep(5)}>Edit</button>
      </div>
      <div class="section-content">
        {#if character.skills && character.skills.length > 0}
          <div class="list-compact">
            {#each character.skills as skill}
              <div class="list-item">{skill.name} ({skill.advances})</div>
            {/each}
          </div>
        {:else}
          <div class="empty">No skills selected</div>
        {/if}
      </div>
    </div>

    <div class="review-section">
      <div class="section-header">
        <h3>Talents ({character.talents?.length || 0})</h3>
        <button type="button" class="btn-edit" on:click={() => onJumpToStep(6)}>Edit</button>
      </div>
      <div class="section-content">
        {#if character.talents && character.talents.length > 0}
          <div class="list-compact">
            {#each character.talents as talent}
              <div class="list-item">{talent.name}{talent.times > 1 ? ` x${talent.times}` : ''}</div>
            {/each}
          </div>
        {:else}
          <div class="empty">No talents selected</div>
        {/if}
      </div>
    </div>

    <div class="review-section">
      <div class="section-header">
        <h3>Spells ({character.spells?.length || 0})</h3>
        <button type="button" class="btn-edit" on:click={() => onJumpToStep(7)}>Edit</button>
      </div>
      <div class="section-content">
        {#if character.spells && character.spells.length > 0}
          <div class="list-compact">
            {#each character.spells as spell}
              <div class="list-item">{spell.name} (CN: {spell.cn})</div>
            {/each}
          </div>
        {:else}
          <div class="empty">No spells selected</div>
        {/if}
      </div>
    </div>

    <div class="review-section">
      <div class="section-header">
        <h3>Equipment ({character.trappings?.length || 0})</h3>
        <button type="button" class="btn-edit" on:click={() => onJumpToStep(8)}>Edit</button>
      </div>
      <div class="section-content">
        {#if character.trappings && character.trappings.length > 0}
          <div class="list-compact">
            {#each character.trappings as trapping}
              <div class="list-item">{trapping.name}{trapping.quantity > 1 ? ` x${trapping.quantity}` : ''}</div>
            {/each}
          </div>
        {:else}
          <div class="empty">No equipment selected</div>
        {/if}
      </div>
    </div>

    <div class="review-section">
      <div class="section-header">
        <h3>Fate & Resilience</h3>
        <button type="button" class="btn-edit" on:click={() => onJumpToStep(9)}>Edit</button>
      </div>
      <div class="section-content">
        <div class="review-item">
          <span class="label">Fate Points:</span>
          <span class="value">{character.fate?.max || 0}</span>
        </div>
        <div class="review-item">
          <span class="label">Resilience:</span>
          <span class="value">{character.resilience?.max || 0}</span>
        </div>
      </div>
    </div>

    <div class="review-section">
      <div class="section-header">
        <h3>Experience</h3>
        <button type="button" class="btn-edit" on:click={() => onJumpToStep(12)}>Edit</button>
      </div>
      <div class="section-content">
        <div class="review-item">
          <span class="label">Total XP:</span>
          <span class="value">{character.experience?.total || 0}</span>
        </div>
        <div class="review-item">
          <span class="label">Spent:</span>
          <span class="value">{character.experience?.spent || 0}</span>
        </div>
        <div class="review-item">
          <span class="label">Available:</span>
          <span class="value">{character.experience?.available || 0}</span>
        </div>
      </div>
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

  .error-box {
    background: #fff5f5;
    padding: 1rem;
    border-radius: 6px;
    border-left: 4px solid var(--color-error, #dc3545);
    margin-bottom: 2rem;
  }

  .error-box strong {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-error, #dc3545);
  }

  .error-box ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  .warning-box {
    background: #fff8e1;
    padding: 1rem;
    border-radius: 6px;
    border-left: 4px solid var(--color-warning, #ffa000);
    margin-bottom: 2rem;
  }

  .warning-box strong {
    display: block;
    margin-bottom: 0.5rem;
  }

  .warning-box ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  .review-section {
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 6px;
  }

  .review-section:last-child {
    margin-bottom: 0;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .section-header h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--color-text-primary, #333);
  }

  .btn-edit {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    background: var(--color-bg-primary, white);
    color: var(--color-accent, #8b2e1f);
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-edit:hover {
    background: var(--color-accent, #8b2e1f);
    color: white;
    border-color: var(--color-accent, #8b2e1f);
  }

  .section-content {
    padding: 0;
  }

  .review-item {
    display: flex;
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }

  .review-item .label {
    font-weight: 600;
    min-width: 120px;
    color: var(--color-text-secondary, #666);
  }

  .review-item .value {
    color: var(--color-text-primary, #333);
  }

  .characteristics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.75rem;
  }

  .char-item {
    text-align: center;
    padding: 0.75rem;
    background: var(--color-bg-primary, white);
    border-radius: 4px;
  }

  .char-name {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-secondary, #666);
    margin-bottom: 0.25rem;
  }

  .char-value {
    display: block;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text-primary, #333);
  }

  .list-compact {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.5rem;
  }

  .list-item {
    padding: 0.5rem 0.75rem;
    background: var(--color-bg-primary, white);
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .empty {
    padding: 1rem;
    text-align: center;
    color: var(--color-text-secondary, #666);
    font-style: italic;
  }

  @media (max-width: 768px) {
    .step-content {
      padding: 1rem;
    }

    .review-section {
      padding: 1rem;
    }

    .characteristics-grid,
    .list-compact {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
  }
</style>
