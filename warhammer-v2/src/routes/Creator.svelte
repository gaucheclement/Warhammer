<script>
  import { link } from 'svelte-spa-router'
  import { onMount } from 'svelte'
  import { mergedData } from '../stores/data.js'

  let currentStep = 1
  const totalSteps = 7

  let character = {
    name: '',
    species: null,
    class: null,
    career: null,
    characteristics: {},
    skills: [],
    talents: [],
    equipment: []
  }

  const steps = [
    { id: 1, name: 'Details', description: 'Name and basic info' },
    { id: 2, name: 'Species', description: 'Choose your species' },
    { id: 3, name: 'Class', description: 'Choose your class' },
    { id: 4, name: 'Career', description: 'Choose your career' },
    { id: 5, name: 'Characteristics', description: 'Roll or assign stats' },
    { id: 6, name: 'Skills & Talents', description: 'Select skills and talents' },
    { id: 7, name: 'Review', description: 'Finalize character' }
  ]

  function nextStep() {
    if (currentStep < totalSteps) {
      currentStep++
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--
    }
  }

  function handleSave() {
    alert('Character creation will be fully implemented in future tasks.\n\nThis is a placeholder for the character creator workflow.')
  }

  function handleCancel() {
    if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
      window.location.hash = '#/'
    }
  }
</script>

<div class="creator-page">
  <header class="creator-header">
    <h1>Character Creator</h1>
    <p class="subtitle">Create a new Warhammer Fantasy character</p>
  </header>

  <div class="progress-bar">
    <div class="progress-fill" style="width: {(currentStep / totalSteps) * 100}%"></div>
  </div>

  <div class="step-indicators">
    {#each steps as step}
      <div
        class="step-indicator"
        class:active={step.id === currentStep}
        class:completed={step.id < currentStep}
      >
        <div class="step-number">{step.id}</div>
        <div class="step-info">
          <div class="step-name">{step.name}</div>
          <div class="step-description">{step.description}</div>
        </div>
      </div>
    {/each}
  </div>

  <div class="creator-content">
    {#if currentStep === 1}
      <div class="step-content">
        <h2>Character Details</h2>
        <div class="form-group">
          <label for="char-name">Character Name</label>
          <input
            id="char-name"
            type="text"
            bind:value={character.name}
            placeholder="Enter character name"
            class="form-input"
          />
        </div>
        <p class="help-text">
          Choose a name that fits the grim and perilous world of Warhammer Fantasy.
        </p>
      </div>
    {:else if currentStep === 2}
      <div class="step-content">
        <h2>Choose Species</h2>
        <div class="options-grid">
          {#each $mergedData.species || [] as species}
            <div
              class="option-card"
              class:selected={character.species?.id === species.id}
              on:click={() => character.species = species}
              on:keydown={(e) => e.key === 'Enter' && (character.species = species)}
              tabindex="0"
              role="button"
            >
              <h3>{species.name}</h3>
              {#if species.description}
                <p>{species.description.substring(0, 100)}...</p>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {:else if currentStep === 3}
      <div class="step-content">
        <h2>Choose Class</h2>
        <div class="options-grid">
          {#each ['Academic', 'Burgher', 'Courtier', 'Peasant', 'Ranger', 'Riverfolk', 'Rogue', 'Warrior'] as className}
            <div
              class="option-card"
              class:selected={character.class === className}
              on:click={() => character.class = className}
              on:keydown={(e) => e.key === 'Enter' && (character.class = className)}
              tabindex="0"
              role="button"
            >
              <h3>{className}</h3>
            </div>
          {/each}
        </div>
      </div>
    {:else if currentStep === 4}
      <div class="step-content">
        <h2>Choose Career</h2>
        <div class="options-grid">
          {#each ($mergedData.careers || []).filter(c => !character.class || c.class === character.class) as career}
            <div
              class="option-card"
              class:selected={character.career?.id === career.id}
              on:click={() => character.career = career}
              on:keydown={(e) => e.key === 'Enter' && (character.career = career)}
              tabindex="0"
              role="button"
            >
              <h3>{career.name}</h3>
              <p class="career-class">{career.class}</p>
            </div>
          {/each}
        </div>
      </div>
    {:else if currentStep === 5}
      <div class="step-content">
        <h2>Characteristics</h2>
        <p class="help-text">
          Roll for characteristics or use point-buy system.
        </p>
        <div class="characteristics-placeholder">
          <p>Characteristics generation will be implemented in future tasks.</p>
        </div>
      </div>
    {:else if currentStep === 6}
      <div class="step-content">
        <h2>Skills & Talents</h2>
        <p class="help-text">
          Select your starting skills and talents based on your career.
        </p>
        <div class="skills-placeholder">
          <p>Skills and talents selection will be implemented in future tasks.</p>
        </div>
      </div>
    {:else if currentStep === 7}
      <div class="step-content">
        <h2>Review Character</h2>
        <div class="review-section">
          <div class="review-item">
            <span class="review-label">Name:</span>
            <span class="review-value">{character.name || 'Not set'}</span>
          </div>
          <div class="review-item">
            <span class="review-label">Species:</span>
            <span class="review-value">{character.species?.name || 'Not selected'}</span>
          </div>
          <div class="review-item">
            <span class="review-label">Class:</span>
            <span class="review-value">{character.class || 'Not selected'}</span>
          </div>
          <div class="review-item">
            <span class="review-label">Career:</span>
            <span class="review-value">{character.career?.name || 'Not selected'}</span>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <div class="creator-actions">
    <button class="btn btn-secondary" on:click={handleCancel}>Cancel</button>
    <div class="navigation-buttons">
      {#if currentStep > 1}
        <button class="btn btn-secondary" on:click={prevStep}>Previous</button>
      {/if}
      {#if currentStep < totalSteps}
        <button class="btn btn-primary" on:click={nextStep}>Next</button>
      {:else}
        <button class="btn btn-primary" on:click={handleSave}>Save Character</button>
      {/if}
    </div>
  </div>
</div>

<style>
  .creator-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .creator-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .creator-header h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .subtitle {
    color: var(--color-text-secondary, #666);
    margin: 0;
  }

  .progress-bar {
    height: 8px;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 4px;
    margin-bottom: 2rem;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--color-accent, #8b2e1f);
    transition: width 0.3s ease;
  }

  .step-indicators {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .step-indicator {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 8px;
    opacity: 0.5;
    transition: all 0.2s;
  }

  .step-indicator.active {
    opacity: 1;
    background: var(--color-accent, #8b2e1f);
    color: white;
  }

  .step-indicator.completed {
    opacity: 0.8;
  }

  .step-number {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-primary, white);
    color: var(--color-text-primary, #333);
    border-radius: 50%;
    font-weight: bold;
    flex-shrink: 0;
  }

  .step-indicator.active .step-number {
    background: white;
    color: var(--color-accent, #8b2e1f);
  }

  .step-info {
    flex: 1;
    min-width: 0;
  }

  .step-name {
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  .step-description {
    font-size: 0.75rem;
    opacity: 0.8;
  }

  .creator-content {
    background: var(--color-bg-secondary, #f5f5f5);
    padding: 2rem;
    border-radius: 8px;
    min-height: 400px;
    margin-bottom: 2rem;
  }

  .step-content h2 {
    margin: 0 0 1.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .help-text {
    color: var(--color-text-secondary, #666);
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--color-text-primary, #333);
  }

  .form-input {
    width: 100%;
    max-width: 400px;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    background: var(--color-bg-primary, white);
    color: var(--color-text-primary, #333);
  }

  .form-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .option-card {
    padding: 1.5rem;
    background: var(--color-bg-primary, white);
    border: 2px solid var(--color-border, #ddd);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .option-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .option-card.selected {
    border-color: var(--color-accent, #8b2e1f);
    background: var(--color-accent-light, #fef5f4);
  }

  .option-card h3 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1.1rem;
  }

  .option-card p {
    margin: 0;
    color: var(--color-text-secondary, #666);
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .career-class {
    color: var(--color-accent, #8b2e1f);
    font-weight: 600;
  }

  .characteristics-placeholder,
  .skills-placeholder {
    padding: 2rem;
    text-align: center;
    background: var(--color-bg-primary, white);
    border-radius: 8px;
    border: 2px dashed var(--color-border, #ddd);
    color: var(--color-text-secondary, #999);
  }

  .review-section {
    background: var(--color-bg-primary, white);
    padding: 2rem;
    border-radius: 8px;
  }

  .review-item {
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .review-item:last-child {
    border-bottom: none;
  }

  .review-label {
    font-weight: 600;
    color: var(--color-text-secondary, #666);
  }

  .review-value {
    color: var(--color-text-primary, #333);
  }

  .creator-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .navigation-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: var(--color-accent, #8b2e1f);
    color: white;
  }

  .btn-primary:hover {
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

  @media (max-width: 768px) {
    .creator-page {
      padding: 1rem;
    }

    .creator-header h1 {
      font-size: 1.5rem;
    }

    .step-indicators {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }

    .step-indicator {
      padding: 0.5rem;
    }

    .step-description {
      display: none;
    }

    .creator-content {
      padding: 1rem;
    }

    .options-grid {
      grid-template-columns: 1fr;
    }

    .creator-actions {
      flex-direction: column;
    }

    .navigation-buttons {
      width: 100%;
    }

    .navigation-buttons .btn {
      flex: 1;
    }
  }
</style>
