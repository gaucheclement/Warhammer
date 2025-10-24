<script>
  import { link } from 'svelte-spa-router'

  export let character = {}
  export let onCreateAnother = () => {}
</script>

<div class="wizard-step step-complete">
  <div class="success-container">
    <div class="success-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>

    <h2>Character Created Successfully!</h2>

    <div class="character-info">
      <p class="character-name">{character.name}</p>
      <p class="character-details">
        {character.species?.name} {character.career?.name}
      </p>
      {#if character.id}
        <p class="character-id">Character ID: {character.id}</p>
      {/if}
    </div>

    <div class="success-message">
      <p>
        Your character has been saved and is ready for adventure in the grim and perilous
        world of Warhammer Fantasy Roleplay!
      </p>
    </div>

    <div class="action-buttons">
      {#if character.id}
        <a href="#/character/{character.id}" use:link class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          View Character Sheet
        </a>
      {/if}

      <button type="button" on:click={onCreateAnother} class="btn btn-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
        Create Another Character
      </button>

      <a href="#/characters" use:link class="btn btn-tertiary">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        Go to Character List
      </a>
    </div>

    <div class="next-steps">
      <h3>What's Next?</h3>
      <ul>
        <li>Review your character sheet and familiarize yourself with their abilities</li>
        <li>Share your character with your GM</li>
        <li>Prepare for your first session by reading about your career and species</li>
        <li>Consider your character's backstory and how they fit into the campaign</li>
      </ul>
    </div>
  </div>
</div>

<style>
  .wizard-step {
    max-width: 700px;
    margin: 0 auto;
  }

  .success-container {
    background: var(--color-bg-primary, white);
    padding: 3rem 2rem;
    border-radius: 8px;
    border: 1px solid var(--color-border, #ddd);
    text-align: center;
  }

  .success-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 2rem;
    background: var(--color-success, #4caf50);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .success-icon svg {
    width: 48px;
    height: 48px;
  }

  h2 {
    margin: 0 0 2rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
    font-size: 2rem;
  }

  .character-info {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 6px;
  }

  .character-name {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text-primary, #333);
  }

  .character-details {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: var(--color-text-secondary, #666);
  }

  .character-id {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
    font-family: monospace;
  }

  .success-message {
    margin-bottom: 2rem;
    padding: 0 1rem;
  }

  .success-message p {
    margin: 0;
    line-height: 1.6;
    color: var(--color-text-secondary, #666);
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 6px;
    border: 2px solid;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
  }

  .btn-primary {
    background: var(--color-accent, #8b2e1f);
    color: white;
    border-color: var(--color-accent, #8b2e1f);
  }

  .btn-primary:hover {
    background: var(--color-accent-dark, #6b1e0f);
    border-color: var(--color-accent-dark, #6b1e0f);
  }

  .btn-secondary {
    background: var(--color-bg-primary, white);
    color: var(--color-accent, #8b2e1f);
    border-color: var(--color-accent, #8b2e1f);
  }

  .btn-secondary:hover {
    background: var(--color-accent, #8b2e1f);
    color: white;
  }

  .btn-tertiary {
    background: var(--color-bg-secondary, #f5f5f5);
    color: var(--color-text-primary, #333);
    border-color: var(--color-border, #ddd);
  }

  .btn-tertiary:hover {
    background: var(--color-bg-primary, white);
    border-color: var(--color-accent, #8b2e1f);
  }

  .next-steps {
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--color-bg-info, #e3f2fd);
    border-radius: 6px;
    text-align: left;
  }

  .next-steps h3 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    color: var(--color-text-primary, #333);
  }

  .next-steps ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .next-steps li {
    margin-bottom: 0.75rem;
    line-height: 1.5;
    color: var(--color-text-secondary, #666);
  }

  .next-steps li:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    .success-container {
      padding: 2rem 1rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    .character-name {
      font-size: 1.25rem;
    }
  }
</style>
