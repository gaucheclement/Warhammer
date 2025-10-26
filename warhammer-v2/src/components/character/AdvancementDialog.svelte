<script>
  import { createEventDispatcher } from 'svelte'
  import Modal from '../Modal.svelte'
  import {
    advanceCharacteristic,
    advanceSkill,
    purchaseTalent,
    advanceCareerLevel,
    getAvailableXP,
    getCharacteristicAdvanceCost,
    getSkillAdvanceCost,
    getTalentCost,
    canAfford
  } from '../../lib/characterAdvancement.js'
  import { mergedData } from '../../stores/data.js'

  export let character
  export let onClose

  const dispatch = createEventDispatcher()

  let activeTab = 'characteristics'
  let selectedCharacteristic = null
  let selectedSkill = null
  let selectedTalent = null
  let previewAdvancement = null
  let error = null
  let processing = false

  $: availableXP = getAvailableXP(character)

  // Characteristic names
  const characteristics = [
    { key: 'M', name: 'Movement' },
    { key: 'WS', name: 'Weapon Skill' },
    { key: 'BS', name: 'Ballistic Skill' },
    { key: 'S', name: 'Strength' },
    { key: 'T', name: 'Toughness' },
    { key: 'I', name: 'Initiative' },
    { key: 'Ag', name: 'Agility' },
    { key: 'Dex', name: 'Dexterity' },
    { key: 'Int', name: 'Intelligence' },
    { key: 'WP', name: 'Willpower' },
    { key: 'Fel', name: 'Fellowship' }
  ]

  // Get available talents (not already at max rank)
  $: availableTalents = ($mergedData.talents || []).filter(talent => {
    const existing = character.talents.find(t => t.id === talent.id)
    const maxRank = talent.maxRank || 1
    return !existing || existing.times < maxRank
  })

  // Get skills with their current advances
  $: characterSkills = character.skills || []

  function selectCharacteristic(char) {
    selectedCharacteristic = char
    selectedSkill = null
    selectedTalent = null
    error = null

    const cost = getCharacteristicAdvanceCost(character, char.key)
    const currentValue = character.characteristics[char.key]
    const newValue = currentValue + 1

    previewAdvancement = {
      type: 'characteristic',
      name: char.name,
      current: currentValue,
      new: newValue,
      cost,
      canAfford: canAfford(character, cost)
    }
  }

  function selectSkill(skill) {
    selectedSkill = skill
    selectedCharacteristic = null
    selectedTalent = null
    error = null

    // Determine if skill is advanced
    const skillDef = $mergedData.skills?.find(s => s.id === skill.id)
    const isAdvanced = skillDef?.advanced || false

    const cost = getSkillAdvanceCost(character, skill.id, isAdvanced)
    const currentValue = skill.advances || 0
    const newValue = currentValue + 1

    previewAdvancement = {
      type: 'skill',
      name: skill.name,
      current: currentValue,
      new: newValue,
      cost,
      canAfford: canAfford(character, cost),
      isAdvanced
    }
  }

  function selectTalent(talent) {
    selectedTalent = talent
    selectedCharacteristic = null
    selectedSkill = null
    error = null

    const cost = getTalentCost(character, talent.id)
    const existing = character.talents.find(t => t.id === talent.id)
    const currentRank = existing ? existing.times : 0
    const newRank = currentRank + 1

    previewAdvancement = {
      type: 'talent',
      name: talent.name,
      description: talent.description,
      currentRank,
      newRank,
      cost,
      canAfford: canAfford(character, cost)
    }
  }

  async function confirmAdvancement() {
    if (!previewAdvancement || !previewAdvancement.canAfford) {
      return
    }

    processing = true
    error = null

    try {
      let result

      if (previewAdvancement.type === 'characteristic') {
        result = advanceCharacteristic(character, selectedCharacteristic.key)
      } else if (previewAdvancement.type === 'skill') {
        result = advanceSkill(character, selectedSkill.id, previewAdvancement.isAdvanced)
      } else if (previewAdvancement.type === 'talent') {
        result = purchaseTalent(character, selectedTalent)
      }

      if (result.success) {
        // Update character reference
        character = result.character

        // Dispatch event to save changes
        dispatch('advance', { character, log: result.log })

        // Clear selection
        selectedCharacteristic = null
        selectedSkill = null
        selectedTalent = null
        previewAdvancement = null
      } else {
        error = result.error
      }
    } catch (err) {
      console.error('Error during advancement:', err)
      error = 'An error occurred during advancement'
    } finally {
      processing = false
    }
  }

  function clearSelection() {
    selectedCharacteristic = null
    selectedSkill = null
    selectedTalent = null
    previewAdvancement = null
    error = null
  }
</script>

<Modal title="Character Advancement" {onClose}>
  <div class="advancement-dialog">
    <!-- XP Display -->
    <div class="xp-display">
      <div class="xp-label">Available XP:</div>
      <div class="xp-value">{availableXP}</div>
    </div>

    {#if error}
      <div class="error-banner">
        {error}
      </div>
    {/if}

    <!-- Tabs -->
    <div class="tabs">
      <button
        class="tab"
        class:active={activeTab === 'characteristics'}
        on:click={() => { activeTab = 'characteristics'; clearSelection(); }}
      >
        Characteristics
      </button>
      <button
        class="tab"
        class:active={activeTab === 'skills'}
        on:click={() => { activeTab = 'skills'; clearSelection(); }}
      >
        Skills
      </button>
      <button
        class="tab"
        class:active={activeTab === 'talents'}
        on:click={() => { activeTab = 'talents'; clearSelection(); }}
      >
        Talents
      </button>
      <button
        class="tab"
        class:active={activeTab === 'career'}
        on:click={() => { activeTab = 'career'; clearSelection(); }}
      >
        Career
      </button>
    </div>

    <div class="tab-content">
      <!-- Characteristics Tab -->
      {#if activeTab === 'characteristics'}
        <div class="characteristics-grid">
          {#each characteristics as char}
            {@const cost = getCharacteristicAdvanceCost(character, char.key)}
            {@const canBuy = canAfford(character, cost)}
            <button
              class="advancement-option"
              class:selected={selectedCharacteristic?.key === char.key}
              class:disabled={!canBuy}
              on:click={() => selectCharacteristic(char)}
              disabled={!canBuy}
            >
              <div class="option-name">{char.name}</div>
              <div class="option-current">{character.characteristics[char.key]}</div>
              <div class="option-cost">{cost} XP</div>
            </button>
          {/each}
        </div>
      {/if}

      <!-- Skills Tab -->
      {#if activeTab === 'skills'}
        <div class="skills-list">
          {#each characterSkills as skill}
            {@const skillDef = $mergedData.skills?.find(s => s.id === skill.id)}
            {@const isAdvanced = skillDef?.advanced || false}
            {@const cost = getSkillAdvanceCost(character, skill.id, isAdvanced)}
            {@const canBuy = canAfford(character, cost)}
            <button
              class="advancement-option list-item"
              class:selected={selectedSkill?.id === skill.id}
              class:disabled={!canBuy}
              on:click={() => selectSkill(skill)}
              disabled={!canBuy}
            >
              <div class="option-details">
                <div class="option-name">{skill.name}</div>
                <div class="option-meta">
                  Advances: {skill.advances || 0}
                  {#if isAdvanced}
                    <span class="advanced-badge">Advanced</span>
                  {/if}
                </div>
              </div>
              <div class="option-cost">{cost} XP</div>
            </button>
          {/each}
        </div>
      {/if}

      <!-- Talents Tab -->
      {#if activeTab === 'talents'}
        <div class="talents-list">
          {#each availableTalents as talent}
            {@const cost = getTalentCost(character, talent.id)}
            {@const canBuy = canAfford(character, cost)}
            {@const existing = character.talents.find(t => t.id === talent.id)}
            {@const currentRank = existing ? existing.times : 0}
            <button
              class="advancement-option list-item"
              class:selected={selectedTalent?.id === talent.id}
              class:disabled={!canBuy}
              on:click={() => selectTalent(talent)}
              disabled={!canBuy}
            >
              <div class="option-details">
                <div class="option-name">{talent.name}</div>
                <div class="option-description">{talent.description || ''}</div>
                {#if currentRank > 0}
                  <div class="option-meta">Current Rank: {currentRank}</div>
                {/if}
              </div>
              <div class="option-cost">{cost} XP</div>
            </button>
          {/each}
        </div>
      {/if}

      <!-- Career Tab -->
      {#if activeTab === 'career'}
        <div class="career-info">
          <h3>{character.career.name}</h3>
          <p>Current Level: {character.career.level || 1}</p>
          <p class="info-text">
            Career advancement is typically determined by the GM and represents
            progressing through the career tiers. Advancing your career may unlock
            new skills, talents, and abilities.
          </p>
          <button
            class="btn btn-secondary"
            on:click={() => {
              const result = advanceCareerLevel(character)
              if (result.success) {
                character = result.character
                dispatch('advance', { character, log: result.log })
              } else {
                error = result.error
              }
            }}
            disabled={character.career.level >= 4}
          >
            Advance to Level {(character.career.level || 1) + 1}
          </button>
        </div>
      {/if}
    </div>

    <!-- Preview Panel -->
    {#if previewAdvancement}
      <div class="preview-panel">
        <h3>Preview Advancement</h3>
        <div class="preview-content">
          <div class="preview-row">
            <span class="preview-label">{previewAdvancement.type === 'talent' ? 'Talent' : 'Name'}:</span>
            <span class="preview-value">{previewAdvancement.name}</span>
          </div>

          {#if previewAdvancement.type === 'talent'}
            {#if previewAdvancement.description}
              <div class="preview-row">
                <span class="preview-label">Description:</span>
                <span class="preview-value">{previewAdvancement.description}</span>
              </div>
            {/if}
            <div class="preview-row">
              <span class="preview-label">Rank:</span>
              <span class="preview-value">
                {previewAdvancement.currentRank} → {previewAdvancement.newRank}
              </span>
            </div>
          {:else}
            <div class="preview-row">
              <span class="preview-label">Change:</span>
              <span class="preview-value">
                {previewAdvancement.current} → {previewAdvancement.new}
              </span>
            </div>
          {/if}

          <div class="preview-row highlight">
            <span class="preview-label">Cost:</span>
            <span class="preview-value">{previewAdvancement.cost} XP</span>
          </div>

          <div class="preview-row">
            <span class="preview-label">Remaining XP:</span>
            <span class="preview-value">{availableXP - previewAdvancement.cost}</span>
          </div>
        </div>

        <div class="preview-actions">
          <button class="btn btn-secondary" on:click={clearSelection}>
            Cancel
          </button>
          <button
            class="btn btn-primary"
            on:click={confirmAdvancement}
            disabled={!previewAdvancement.canAfford || processing}
          >
            {processing ? 'Processing...' : 'Spend XP'}
          </button>
        </div>
      </div>
    {/if}
  </div>
</Modal>

<style>
  .advancement-dialog {
    padding: 1rem;
    min-width: 600px;
    max-width: 800px;
  }

  .xp-display {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: linear-gradient(135deg, var(--color-accent, #8b2e1f) 0%, #a63728 100%);
    color: white;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .xp-label {
    font-size: 1.2rem;
    font-weight: 500;
  }

  .xp-value {
    font-size: 2rem;
    font-weight: bold;
  }

  .error-banner {
    background: #fee;
    border: 1px solid #fcc;
    color: #c00;
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    text-align: center;
  }

  .tabs {
    display: flex;
    gap: 0.5rem;
    border-bottom: 2px solid var(--color-border, #ddd);
    margin-bottom: 1rem;
  }

  .tab {
    padding: 0.75rem 1.5rem;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    font-weight: 500;
    color: var(--color-text-secondary, #666);
    transition: all 0.2s;
  }

  .tab:hover {
    color: var(--color-text-primary, #333);
    background: var(--color-bg-secondary, #f5f5f5);
  }

  .tab.active {
    color: var(--color-accent, #8b2e1f);
    border-bottom-color: var(--color-accent, #8b2e1f);
  }

  .tab-content {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 1rem;
    padding: 0.5rem;
  }

  .characteristics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.75rem;
  }

  .advancement-option {
    padding: 1rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
  }

  .advancement-option:hover:not(.disabled) {
    border-color: var(--color-accent, #8b2e1f);
    background: var(--color-bg-primary, #fff);
  }

  .advancement-option.selected {
    border-color: var(--color-accent, #8b2e1f);
    background: #fef5f4;
  }

  .advancement-option.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .advancement-option.list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    margin-bottom: 0.5rem;
  }

  .option-name {
    font-weight: 600;
    color: var(--color-text-primary, #333);
    margin-bottom: 0.25rem;
  }

  .option-current {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text-primary, #333);
    margin: 0.5rem 0;
  }

  .option-cost {
    font-size: 0.9rem;
    color: var(--color-accent, #8b2e1f);
    font-weight: 600;
  }

  .option-details {
    flex: 1;
  }

  .option-description {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #666);
    margin-top: 0.25rem;
  }

  .option-meta {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #666);
    margin-top: 0.25rem;
  }

  .advanced-badge {
    display: inline-block;
    background: var(--color-accent, #8b2e1f);
    color: white;
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    font-size: 0.75rem;
    margin-left: 0.5rem;
  }

  .skills-list,
  .talents-list {
    display: flex;
    flex-direction: column;
  }

  .career-info {
    padding: 1rem;
    text-align: center;
  }

  .career-info h3 {
    color: var(--color-text-primary, #333);
    margin-bottom: 1rem;
  }

  .career-info p {
    margin: 0.5rem 0;
    color: var(--color-text-secondary, #666);
  }

  .info-text {
    font-size: 0.9rem;
    font-style: italic;
    margin: 1rem 0 !important;
  }

  .preview-panel {
    border-top: 2px solid var(--color-border, #ddd);
    padding-top: 1rem;
    margin-top: 1rem;
  }

  .preview-panel h3 {
    margin: 0 0 1rem 0;
    color: var(--color-text-primary, #333);
  }

  .preview-content {
    background: var(--color-bg-secondary, #f5f5f5);
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .preview-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .preview-row:last-child {
    border-bottom: none;
  }

  .preview-row.highlight {
    background: #fef5f4;
    margin: 0 -1rem;
    padding: 0.75rem 1rem;
    border-bottom: none;
  }

  .preview-label {
    font-weight: 600;
    color: var(--color-text-secondary, #666);
  }

  .preview-value {
    color: var(--color-text-primary, #333);
    font-weight: 500;
  }

  .preview-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.95rem;
    font-weight: 500;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary {
    background: var(--color-accent, #8b2e1f);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--color-accent-hover, #a63728);
  }

  .btn-secondary {
    background: var(--color-bg-secondary, #f5f5f5);
    color: var(--color-text-primary, #333);
    border: 1px solid var(--color-border, #ddd);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--color-bg-tertiary, #e5e5e5);
  }

  @media (max-width: 768px) {
    .advancement-dialog {
      min-width: unset;
      width: 100%;
    }

    .characteristics-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .tabs {
      overflow-x: auto;
    }

    .tab {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  }
</style>
