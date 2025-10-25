<script>
  import { createEventDispatcher, onMount } from 'svelte'

  export let character = {}

  const dispatch = createEventDispatcher()

  // Initialize party info if not present
  if (!character.party) {
    character.party = {
      name: '',
      role: '',
      notes: ''
    }
  }

  const suggestedRoles = [
    'Leader',
    'Tank/Defender',
    'Damage Dealer',
    'Support/Healer',
    'Scout/Reconnaissance',
    'Face/Diplomat',
    'Spellcaster',
    'Specialist',
    'Backup/Utility'
  ]

  function handleChange() {
    dispatch('change', character)
  }

  onMount(() => {
    dispatch('validate', { valid: true, errors: [] })
  })
</script>

<div class="wizard-step step-party">
  <div class="step-header">
    <h2>Party Information</h2>
    <p class="step-description">
      If you're creating this character as part of an adventuring party, you can record
      party details here. This information is entirely optional and can be updated later.
    </p>
  </div>

  <div class="step-content">
    <div class="form-section">
      <div class="form-group">
        <label for="party-name">Party Name</label>
        <input
          id="party-name"
          type="text"
          bind:value={character.party.name}
          on:input={handleChange}
          placeholder="e.g., The Silver Company, Reikland Rangers, etc."
          class="form-input"
          maxlength="100"
        />
        <div class="help-text">
          Optional. The name of your adventuring party or group.
        </div>
      </div>

      <div class="form-group">
        <label for="party-role">Your Role in the Party</label>
        <input
          id="party-role"
          type="text"
          bind:value={character.party.role}
          on:input={handleChange}
          placeholder="Select or type a custom role..."
          class="form-input"
          list="role-suggestions"
          maxlength="100"
        />
        <datalist id="role-suggestions">
          {#each suggestedRoles as role}
            <option value={role}></option>
          {/each}
        </datalist>
        <div class="help-text">
          Optional. What role does your character fill in the party?
        </div>
      </div>

      <div class="form-group">
        <label for="party-notes">Party Notes</label>
        <textarea
          id="party-notes"
          bind:value={character.party.notes}
          on:input={handleChange}
          placeholder="Any additional notes about your party, relationships with other members, party goals, etc."
          class="form-textarea"
          rows="5"
          maxlength="1000"
        />
        <div class="help-text">
          Optional. Record any relevant information about your party and your place in it.
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3>About Party Roles</h3>
      <div class="info-grid">
        <div class="info-item">
          <strong>Combat Roles</strong>
          <p>Tank, Damage Dealer, Support - traditional combat positions.</p>
        </div>
        <div class="info-item">
          <strong>Social Roles</strong>
          <p>Face, Diplomat, Negotiator - characters who handle social situations.</p>
        </div>
        <div class="info-item">
          <strong>Utility Roles</strong>
          <p>Scout, Specialist, Backup - characters who provide specific skills.</p>
        </div>
        <div class="info-item">
          <strong>Leadership Roles</strong>
          <p>Leader, Strategist - characters who coordinate party actions.</p>
        </div>
      </div>
    </div>

    <div class="tip-box">
      <strong>Note:</strong> Party information is purely for organizational purposes. It doesn't
      affect your character's abilities or statistics. You can leave these fields blank if you're
      creating a character for solo play or haven't formed a party yet.
    </div>
  </div>
</div>

<style>
  .wizard-step {
    max-width: 800px;
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
    margin: 0 0 1rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1.25rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border, #ddd);
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

  .form-input,
  .form-textarea {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    background: var(--color-bg-primary, white);
    color: var(--color-text-primary, #333);
    transition: border-color 0.2s;
  }

  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .form-textarea {
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
  }

  .help-text {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .info-item {
    padding: 1rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 6px;
  }

  .info-item strong {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary, #333);
  }

  .info-item p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-text-secondary, #666);
    line-height: 1.4;
  }

  .tip-box {
    background: var(--color-bg-info, #e8f5e9);
    padding: 1rem;
    border-radius: 6px;
    border-left: 4px solid var(--color-success, #4caf50);
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

    .info-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
