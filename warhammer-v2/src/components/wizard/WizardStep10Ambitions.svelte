<script>
  import { createEventDispatcher, onMount } from 'svelte'

  export let character = {}

  const dispatch = createEventDispatcher()

  // Initialize ambitions if not present
  if (!character.ambitions) {
    character.ambitions = {
      shortTerm: '',
      longTerm: ''
    }
  }

  function handleChange() {
    dispatch('change', character)
  }

  onMount(() => {
    dispatch('validate', { valid: true, errors: [] })
  })
</script>

<div class="wizard-step step-ambitions">
  <div class="step-header">
    <h2>Character Ambitions</h2>
    <p class="step-description">
      Every character has goals and dreams. Define what your character hopes to achieve
      in the short term and what they aspire to in the long run. These ambitions will guide
      your character's actions and provide motivation for their adventures.
    </p>
  </div>

  <div class="step-content">
    <div class="form-section">
      <div class="form-group">
        <label for="short-term">Short-Term Ambition</label>
        <textarea
          id="short-term"
          bind:value={character.ambitions.shortTerm}
          on:input={handleChange}
          placeholder="What does your character want to achieve in the near future? (e.g., 'Earn enough coin to buy a new sword' or 'Prove myself to the captain of the guard')"
          class="form-textarea"
          rows="4"
          maxlength="500"
        />
        <div class="help-text">
          Optional. A goal that can be achieved within a few sessions or adventures.
        </div>
      </div>

      <div class="form-group">
        <label for="long-term">Long-Term Ambition</label>
        <textarea
          id="long-term"
          bind:value={character.ambitions.longTerm}
          on:input={handleChange}
          placeholder="What is your character's ultimate dream or life goal? (e.g., 'Become a famous hero known throughout the Empire' or 'Establish my own trading company')"
          class="form-textarea"
          rows="4"
          maxlength="500"
        />
        <div class="help-text">
          Optional. A major goal that may take many adventures or even a lifetime to achieve.
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3>Ambition Examples</h3>
      <div class="examples-panel">
        <div class="example-category">
          <h4>Wealth & Status</h4>
          <ul>
            <li>Become wealthy enough to retire comfortably</li>
            <li>Gain a noble title or land</li>
            <li>Build a successful business empire</li>
            <li>Earn the respect of the aristocracy</li>
          </ul>
        </div>

        <div class="example-category">
          <h4>Power & Influence</h4>
          <ul>
            <li>Rise through the ranks of my organization</li>
            <li>Become an advisor to a powerful lord</li>
            <li>Master the secrets of ancient magic</li>
            <li>Lead others in a great cause</li>
          </ul>
        </div>

        <div class="example-category">
          <h4>Knowledge & Discovery</h4>
          <ul>
            <li>Uncover lost lore or artifacts</li>
            <li>Map uncharted territories</li>
            <li>Write the definitive book on a subject</li>
            <li>Solve an ancient mystery</li>
          </ul>
        </div>

        <div class="example-category">
          <h4>Personal & Moral</h4>
          <ul>
            <li>Avenge a wrong done to my family</li>
            <li>Protect the innocent from harm</li>
            <li>Find redemption for past sins</li>
            <li>Reunite with a lost loved one</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="tip-box">
      <strong>Tip:</strong> Good ambitions drive character development and give your GM hooks
      for creating personal storylines. They don't have to be elaborate - simple, clear goals
      often work best.
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

  .form-textarea {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    background: var(--color-bg-primary, white);
    color: var(--color-text-primary, #333);
    transition: border-color 0.2s;
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
  }

  .form-textarea:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .help-text {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
  }

  .examples-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .example-category h4 {
    margin: 0 0 0.75rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1rem;
    font-weight: 600;
  }

  .example-category ul {
    margin: 0;
    padding: 0 0 0 1.25rem;
    list-style-type: disc;
  }

  .example-category li {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: var(--color-text-secondary, #666);
    line-height: 1.4;
  }

  .tip-box {
    background: var(--color-bg-info, #fff8e1);
    padding: 1rem;
    border-radius: 6px;
    border-left: 4px solid var(--color-warning, #ffa000);
    margin-top: 1.5rem;
  }

  .tip-box strong {
    color: var(--color-text-primary, #333);
    display: block;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 768px) {
    .step-content {
      padding: 1rem;
    }

    .examples-panel {
      grid-template-columns: 1fr;
    }
  }
</style>
