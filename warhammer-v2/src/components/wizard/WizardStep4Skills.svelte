<script>
  import { createEventDispatcher } from 'svelte'
  import { addSkillToCharacter, removeSkillFromCharacter } from '../../lib/characterModel.js'

  export let character = {}
  export let skills = []
  export let career = null
  export let onEntityClick = null

  const dispatch = createEventDispatcher()

  let searchQuery = ''
  let showOnlyCareer = false

  $: careerSkillIds = new Set(
    (career?.skills || []).map(s => typeof s === 'string' ? s : s.id)
  )

  $: selectedSkillIds = new Set(character.skills.map(s => s.id))

  $: filteredSkills = skills.filter(skill => {
    const matchesSearch = !searchQuery ||
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (skill.description && skill.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCareerFilter = !showOnlyCareer || careerSkillIds.has(skill.id)

    return matchesSearch && matchesCareerFilter
  })

  function toggleSkill(skill) {
    if (selectedSkillIds.has(skill.id)) {
      removeSkillFromCharacter(character, skill.id)
    } else {
      addSkillToCharacter(character, skill, 0)
    }

    selectedSkillIds = new Set(character.skills.map(s => s.id))
    dispatch('change', character)
  }

  function getSkillAdvances(skillId) {
    const skill = character.skills.find(s => s.id === skillId)
    return skill ? skill.advances : 0
  }

  function updateSkillAdvances(skillId, advances) {
    const skill = character.skills.find(s => s.id === skillId)
    if (skill) {
      skill.advances = Math.max(0, Math.min(60, parseInt(advances) || 0))
      dispatch('change', character)
    }
  }

  function isCareerSkill(skillId) {
    return careerSkillIds.has(skillId)
  }
</script>

<div class="wizard-step step-skills">
  <div class="step-header">
    <h2>Skills</h2>
    <p class="step-description">
      Select your character's starting skills. Skills highlighted in gold are your
      career skills - these are recommended for your profession. You can also add skill
      advances (0-60) to represent training and experience.
    </p>
  </div>

  <div class="step-content">
    <div class="filters">
      <div class="filter-group">
        <label for="skill-search">Search Skills:</label>
        <input
          id="skill-search"
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
          <span>Show only career skills</span>
        </label>
      </div>
    </div>

    <div class="selected-summary">
      <strong>Selected Skills:</strong> {character.skills.length}
      {#if career && careerSkillIds.size > 0}
        <span class="career-indicator">
          (Career Skills: {[...careerSkillIds].filter(id => selectedSkillIds.has(id)).length} / {careerSkillIds.size})
        </span>
      {/if}
    </div>

    {#if filteredSkills.length === 0}
      <div class="empty-state">
        <p>No skills found matching your criteria.</p>
      </div>
    {:else}
      <div class="skills-list">
        {#each filteredSkills as skill}
          <div
            class="skill-item"
            class:selected={selectedSkillIds.has(skill.id)}
            class:career-skill={isCareerSkill(skill.id)}
          >
            <div class="skill-header">
              <label class="skill-checkbox">
                <input
                  type="checkbox"
                  checked={selectedSkillIds.has(skill.id)}
                  on:change={() => toggleSkill(skill)}
                />
                <span class="skill-name">
                  {skill.name}
                  {#if isCareerSkill(skill.id)}
                    <span class="career-badge">Career</span>
                  {/if}
                </span>
              </label>

              <div class="skill-meta">
                {#if skill.characteristic}
                  <span class="skill-characteristic">
                    ({skill.characteristic.toUpperCase()})
                  </span>
                {/if}
                {#if onEntityClick}
                  <button
                    class="info-button"
                    on:click|stopPropagation={() => onEntityClick('skill', skill.id)}
                    title="View skill details"
                    aria-label="View details for {skill.name}"
                  >
                    ℹ️
                  </button>
                {/if}
              </div>
            </div>

            {#if skill.description}
              <p class="skill-description">{skill.description}</p>
            {/if}

            {#if selectedSkillIds.has(skill.id)}
              <div class="skill-advances">
                <label for="advances-{skill.id}">Advances:</label>
                <input
                  id="advances-{skill.id}"
                  type="number"
                  value={getSkillAdvances(skill.id)}
                  on:input={(e) => updateSkillAdvances(skill.id, e.target.value)}
                  min="0"
                  max="60"
                  class="advances-input"
                />
                <span class="advances-help">(0-60)</span>
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

  .skills-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 600px;
    overflow-y: auto;
  }

  .skill-item {
    padding: 1rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    background: var(--color-bg-primary, white);
    transition: all 0.2s;
  }

  .skill-item:hover {
    border-color: var(--color-accent, #8b2e1f);
  }

  .skill-item.selected {
    background: var(--color-accent-light, #fef5f4);
    border-color: var(--color-accent, #8b2e1f);
  }

  .skill-item.career-skill {
    border-left: 4px solid gold;
  }

  .skill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .skill-checkbox {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    flex: 1;
  }

  .skill-checkbox input[type="checkbox"] {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }

  .skill-name {
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

  .skill-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .skill-characteristic {
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
    font-weight: 500;
  }

  .info-button {
    background: none;
    border: none;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    font-size: 1.125rem;
    border-radius: 4px;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .info-button:hover {
    background: var(--color-bg-secondary, #f5f5f5);
  }

  .info-button:active {
    background: var(--color-border, #ddd);
  }

  .skill-description {
    margin: 0.5rem 0 0 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
    line-height: 1.4;
  }

  .skill-advances {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--color-border, #ddd);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .skill-advances label {
    font-weight: 600;
    font-size: 0.875rem;
  }

  .advances-input {
    width: 80px;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .advances-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .advances-help {
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

    .skill-header {
      flex-direction: column;
      align-items: start;
      gap: 0.5rem;
    }
  }
</style>
