<script>
  import { createEventDispatcher } from 'svelte'
  import { applyCareerToCharacter, addXPBonus } from '../../lib/characterModel.js'
  import RandomButton from '../common/RandomButton.svelte'

  export let character = {}
  export let careers = []

  const dispatch = createEventDispatcher()

  let selectedCareer = null
  let selectedClass = 'all'
  let searchQuery = ''
  let showManualSelector = false
  let randomClassChosen = false
  let randomCareerClass = null

  const careerClasses = [
    'all',
    'Academic',
    'Burgher',
    'Courtier',
    'Peasant',
    'Ranger',
    'Riverfolk',
    'Rogue',
    'Warrior'
  ]

  /**
   * Roll random career class (first level - +50 XP)
   */
  function rollCareerClass() {
    if (careers.length === 0) return 'Loading...'

    const availableClasses = careerClasses.filter(c => c !== 'all')
    const index = Math.floor(Math.random() * availableClasses.length)
    return availableClasses[index]
  }

  /**
   * Accept random career class and gain +50 XP
   */
  function acceptCareerClass(event) {
    const { result } = event.detail

    randomCareerClass = result
    selectedClass = result
    randomClassChosen = true

    // Add first level XP bonus (+50)
    addXPBonus(character, 'career', 50, 1)
  }

  /**
   * Roll specific career from selected class (second level - +25 XP)
   */
  function rollSpecificCareer() {
    if (careers.length === 0) return 'Loading...'

    const classFilter = randomCareerClass || selectedClass
    const careersInClass = careers.filter(c => c.class === classFilter)

    if (careersInClass.length === 0) {
      return 'No careers in this class'
    }

    const index = Math.floor(Math.random() * careersInClass.length)
    return careersInClass[index].name
  }

  /**
   * Accept random career and gain +25 XP (if first random was accepted)
   */
  function acceptRandomCareer(event) {
    const { result } = event.detail

    // Find the career by name
    const careerData = careers.find(c => c.name === result)
    if (!careerData) return

    // Apply career to character
    applyCareer(careerData)

    // Add second level XP bonus (+25) if first was random
    if (character.randomState.career === 1) {
      // Update from 1 (first level) to 2 (second level)
      character.randomState.career = 2
      character.xp.max += 25
    }

    showManualSelector = false
  }

  /**
   * Choose manually (no XP bonus)
   */
  function chooseManually() {
    character.randomState.career = -1
    showManualSelector = true
  }

  /**
   * Choose class manually (second level)
   */
  function chooseClassManually() {
    // If first level was random, don't get second level bonus
    if (character.randomState.career === 1) {
      character.randomState.career = -1
    }
    showManualSelector = true
  }

  /**
   * Select career manually
   */
  function selectCareer(careerData) {
    applyCareer(careerData)

    // Only mark as manual if not already accepted via random
    if (character.randomState.career === 0) {
      character.randomState.career = -1
    }
  }

  /**
   * Apply career to character
   */
  function applyCareer(careerData) {
    selectedCareer = careerData

    // Apply career to character
    applyCareerToCharacter(character, careerData)

    dispatch('change', character)
    dispatch('validate', {
      valid: true,
      errors: []
    })
  }

  $: if (character.career?.id) {
    selectedCareer = careers.find(c => c.id === character.career.id)
    // If career already selected, show manual selector
    if (character.randomState.career !== 0) {
      showManualSelector = true
    }
  }

  $: filteredCareers = careers.filter(career => {
    const matchesClass = selectedClass === 'all' || career.class === selectedClass
    const matchesSearch = !searchQuery ||
      career.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (career.description && career.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesClass && matchesSearch
  })
</script>

<div class="wizard-step step-career">
  <div class="step-header">
    <h2>Choose Career</h2>
    <p class="step-description">
      Select your character's starting career. Your career determines available skills,
      talents, and trappings. You'll start at Career Level 1 and can advance through
      higher levels as you gain experience.
    </p>
  </div>

  <div class="step-content">
    <!-- Level 1: Random Career Class (if not selected yet) -->
    {#if !selectedCareer && !showManualSelector && !randomClassChosen}
      <div class="random-section">
        <h3>Random Career Class</h3>
        <p class="random-description">
          Roll the dice to randomly select a career class and earn <strong>+50 XP bonus</strong>!
          Then you can roll again for a specific career to earn another <strong>+25 XP</strong>.
        </p>
        <RandomButton
          label="Roll Random Career Class"
          xpBonus={50}
          rollFunction={rollCareerClass}
          on:accept={acceptCareerClass}
          on:manual={chooseManually}
        />
      </div>
    {/if}

    <!-- Level 2: Random Specific Career (if class was randomly chosen) -->
    {#if randomClassChosen && !selectedCareer && !showManualSelector}
      <div class="random-section">
        <h3>Random Career in {randomCareerClass}</h3>
        <p class="random-description">
          Roll again to select a specific career from <strong>{randomCareerClass}</strong> and earn <strong>+25 XP bonus</strong>!
        </p>
        <RandomButton
          label="Roll Random Career"
          xpBonus={25}
          rollFunction={rollSpecificCareer}
          on:accept={acceptRandomCareer}
          on:manual={chooseClassManually}
        />
      </div>
    {/if}

    <!-- Manual Selection -->
    {#if showManualSelector || selectedCareer}
      <div class="filters">
        <div class="filter-group">
          <label for="career-search">Search Careers:</label>
          <input
            id="career-search"
            type="text"
            bind:value={searchQuery}
            placeholder="Search by name..."
            class="search-input"
          />
        </div>

        <div class="filter-group">
          <label for="career-class">Filter by Class:</label>
          <select
            id="career-class"
            bind:value={selectedClass}
            class="class-select"
          >
            {#each careerClasses as careerClass}
              <option value={careerClass}>
                {careerClass === 'all' ? 'All Classes' : careerClass}
              </option>
            {/each}
          </select>
        </div>
      </div>

      {#if filteredCareers.length === 0}
        <div class="empty-state">
          <p>No careers found matching your criteria.</p>
        </div>
      {:else}
        <div class="careers-grid">
          {#each filteredCareers as careerData}
            <div
              class="career-card"
              class:selected={selectedCareer?.id === careerData.id}
              on:click={() => selectCareer(careerData)}
              on:keydown={(e) => e.key === 'Enter' && selectCareer(careerData)}
              tabindex="0"
              role="button"
            >
              <div class="career-header">
                <div>
                  <h3>{careerData.name}</h3>
                  <div class="career-class">{careerData.class}</div>
                </div>
                {#if selectedCareer?.id === careerData.id}
                  <span class="selected-badge">✓ Selected</span>
                {/if}
              </div>

              {#if careerData.description}
                <p class="career-description">
                  {careerData.description.substring(0, 120)}
                  {careerData.description.length > 120 ? '...' : ''}
                </p>
              {/if}

              <div class="career-details">
                {#if careerData.status}
                  <div class="detail-item">
                    <strong>Status:</strong> {careerData.status}
                  </div>
                {/if}

                {#if careerData.skills && careerData.skills.length > 0}
                  <div class="detail-item">
                    <strong>Career Skills:</strong> {careerData.skills.length}
                  </div>
                {/if}

                {#if careerData.talents && careerData.talents.length > 0}
                  <div class="detail-item">
                    <strong>Career Talents:</strong> {careerData.talents.length}
                  </div>
                {/if}

                {#if careerData.trappings && careerData.trappings.length > 0}
                  <div class="detail-item">
                    <strong>Starting Trappings:</strong> {careerData.trappings.length} items
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
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

  .random-section {
    max-width: 600px;
    margin: 0 auto 2rem;
    padding: 2rem;
    background: var(--color-bg-primary, white);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .random-section h3 {
    margin: 0 0 0.75rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
    font-size: 1.5rem;
    text-align: center;
  }

  .random-description {
    text-align: center;
    color: var(--color-text-secondary, #666);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .random-description strong {
    color: gold;
    font-weight: 700;
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

  .filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
    background: var(--color-bg-primary, white);
    padding: 1rem;
    border-radius: 8px;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-group label {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--color-text-primary, #333);
  }

  .search-input,
  .class-select {
    padding: 0.5rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 6px;
    font-size: 0.875rem;
  }

  .search-input:focus,
  .class-select:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-secondary, #666);
    background: var(--color-bg-primary, white);
    border-radius: 8px;
  }

  .careers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  .career-card {
    background: var(--color-bg-primary, white);
    border: 2px solid var(--color-border, #ddd);
    border-radius: 8px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .career-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .career-card.selected {
    border-color: var(--color-accent, #8b2e1f);
    background: var(--color-accent-light, #fef5f4);
    box-shadow: 0 0 0 3px rgba(139, 46, 31, 0.1);
  }

  .career-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 1rem;
  }

  .career-header h3 {
    margin: 0 0 0.25rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1.25rem;
    font-family: var(--font-heading, serif);
  }

  .career-class {
    display: inline-block;
    background: var(--color-bg-secondary, #f5f5f5);
    color: var(--color-accent, #8b2e1f);
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .selected-badge {
    background: var(--color-accent, #8b2e1f);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .career-description {
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 1rem;
  }

  .career-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .detail-item {
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
  }

  .detail-item strong {
    color: var(--color-text-primary, #333);
  }

  @media (max-width: 768px) {
    .step-content {
      padding: 1rem;
    }

    .filters {
      grid-template-columns: 1fr;
    }

    .careers-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
