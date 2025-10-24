<script>
  import { onMount } from 'svelte'
  import { link } from 'svelte-spa-router'
  import { db } from '../lib/db.js'
  import { updateCharacter, deleteCharacter, duplicateCharacter } from '../lib/dataOperations.js'
  import { characters } from '../stores/data.js'
  import CharacterHeader from '../components/character/CharacterHeader.svelte'
  import CharacteristicsBlock from '../components/character/CharacteristicsBlock.svelte'
  import SkillsBlock from '../components/character/SkillsBlock.svelte'
  import TalentsBlock from '../components/character/TalentsBlock.svelte'
  import SpellsBlock from '../components/character/SpellsBlock.svelte'
  import EquipmentBlock from '../components/character/EquipmentBlock.svelte'
  import NotesBlock from '../components/character/NotesBlock.svelte'
  import AdvancementBlock from '../components/character/AdvancementBlock.svelte'
  import LoadingSpinner from '../components/LoadingSpinner.svelte'
  import Modal from '../components/Modal.svelte'
  import AdvancementDialog from '../components/character/AdvancementDialog.svelte'
  import { advanceCharacteristic, advanceSkill, purchaseTalent, advanceCareerLevel } from '../lib/characterAdvancement.js'

  export let params = {}

  let character = null
  let editableCharacter = null
  let loading = true
  let notFound = false
  let isEditMode = false
  let showDeleteModal = false
  let showDuplicateModal = false
  let duplicateName = ''
  let saving = false
  let error = null
  let showAdvancementDialog = false

  $: characterId = params.id ? parseInt(params.id) : null

  onMount(() => {
    loadCharacter()
  })

  $: if (characterId) {
    loadCharacter()
  }

  async function loadCharacter() {
    if (!characterId) {
      notFound = true
      loading = false
      return
    }

    loading = true
    notFound = false
    error = null

    try {
      const data = await db.characters.get(characterId)
      if (data) {
        character = data
        editableCharacter = JSON.parse(JSON.stringify(data))
        notFound = false
      } else {
        notFound = true
      }
    } catch (err) {
      console.error('Error loading character:', err)
      error = 'Failed to load character: ' + err.message
      notFound = true
    } finally {
      loading = false
    }
  }

  function enterEditMode() {
    isEditMode = true
    editableCharacter = JSON.parse(JSON.stringify(character))
  }

  function cancelEdit() {
    isEditMode = false
    editableCharacter = JSON.parse(JSON.stringify(character))
  }

  async function saveCharacter() {
    saving = true
    error = null

    try {
      const result = await updateCharacter(characterId, editableCharacter)
      if (result.success) {
        character = result.data
        isEditMode = false
      } else {
        error = result.error || 'Failed to save character'
      }
    } catch (err) {
      console.error('Error saving character:', err)
      error = 'Failed to save character: ' + err.message
    } finally {
      saving = false
    }
  }

  function exportCharacter() {
    const dataStr = JSON.stringify(character, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `character-${character.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function openDuplicateModal() {
    duplicateName = `${character.name} (Copy)`
    showDuplicateModal = true
  }

  async function confirmDuplicate() {
    saving = true
    error = null

    try {
      const result = await duplicateCharacter(characterId, duplicateName)
      if (result.success) {
        showDuplicateModal = false
        // Navigate to the new character
        window.location.hash = `/character/${result.data.id}`
      } else {
        error = result.error || 'Failed to duplicate character'
      }
    } catch (err) {
      console.error('Error duplicating character:', err)
      error = 'Failed to duplicate character: ' + err.message
    } finally {
      saving = false
    }
  }

  function openDeleteModal() {
    showDeleteModal = true
  }

  async function confirmDelete() {
    saving = true
    error = null

    try {
      const result = await deleteCharacter(characterId)
      if (result.success) {
        showDeleteModal = false
        // Navigate to character list or home
        window.location.hash = '/'
      } else {
        error = result.error || 'Failed to delete character'
      }
    } catch (err) {
      console.error('Error deleting character:', err)
      error = 'Failed to delete character: ' + err.message
    } finally {
      saving = false
    }
  }

  function printCharacter() {
    window.print()
  }

  async function handleAdvancement(event) {
    const { type, data } = event.detail

    // Apply advancement based on type
    let result
    switch (type) {
      case 'characteristic':
        result = advanceCharacteristic(character, data.characteristic)
        break
      case 'skill':
        result = advanceSkill(character, data.skillId, data.isAdvanced)
        break
      case 'talent':
        result = purchaseTalent(character, data.talent)
        break
      case 'career':
        result = advanceCareerLevel(character)
        break
      default:
        console.error('Unknown advancement type:', type)
        return
    }

    if (result.success) {
      // Save to database
      const saveResult = await updateCharacter(characterId, result.character)
      if (saveResult.success) {
        character = saveResult.data
        editableCharacter = JSON.parse(JSON.stringify(character))
      } else {
        error = saveResult.error || 'Failed to save advancement'
      }
    } else {
      error = result.error || 'Advancement failed'
    }
  }
</script>

<div class="character-sheet-page">
  {#if loading}
    <div class="loading-container">
      <LoadingSpinner />
      <p>Loading character...</p>
    </div>
  {:else if notFound}
    <div class="not-found">
      <h1>Character Not Found</h1>
      <p>The character with ID "{characterId}" could not be found.</p>
      <a href="#/" use:link class="btn btn-primary">Return to Home</a>
    </div>
  {:else if character}
    <div class="sheet-container">
      <!-- Actions Bar -->
      <div class="actions-bar no-print">
        <div class="actions-left">
          <a href="#/" use:link class="btn btn-text">← Back</a>
        </div>
        <div class="actions-right">
          {#if isEditMode}
            <button class="btn btn-secondary" on:click={cancelEdit} disabled={saving}>
              Cancel
            </button>
            <button class="btn btn-primary" on:click={saveCharacter} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          {:else}
            <button class="btn btn-secondary" on:click={enterEditMode}>
              Edit
            </button>
            <button class="btn btn-secondary" on:click={() => showAdvancementDialog = true}>
              Advancement
            </button>
            <button class="btn btn-secondary" on:click={exportCharacter}>
              Export JSON
            </button>
            <button class="btn btn-secondary" on:click={openDuplicateModal}>
              Duplicate
            </button>
            <button class="btn btn-secondary" on:click={printCharacter}>
              Print
            </button>
            <button class="btn btn-danger" on:click={openDeleteModal}>
              Delete
            </button>
          {/if}
        </div>
      </div>

      {#if error}
        <div class="error-message no-print">
          <p>{error}</p>
        </div>
      {/if}

      <!-- Character Sheet Content -->
      <div class="sheet-content">
        <CharacterHeader
          bind:character={isEditMode ? editableCharacter : character}
          {isEditMode}
        />

        <div class="sheet-grid">
          <div class="sheet-column">
            <CharacteristicsBlock
              bind:characteristics={isEditMode ? editableCharacter.characteristics : character.characteristics}
              {isEditMode}
            />

            <AdvancementBlock
              bind:experience={isEditMode ? editableCharacter.experience : character.experience}
              {isEditMode}
            />
          </div>

          <div class="sheet-column">
            <SkillsBlock
              bind:skills={isEditMode ? editableCharacter.skills : character.skills}
              {isEditMode}
            />

            <TalentsBlock
              bind:talents={isEditMode ? editableCharacter.talents : character.talents}
              {isEditMode}
            />
          </div>

          <div class="sheet-column">
            {#if character.spells && character.spells.length > 0}
              <SpellsBlock
                bind:spells={isEditMode ? editableCharacter.spells : character.spells}
                {isEditMode}
              />
            {/if}

            <EquipmentBlock
              bind:trappings={isEditMode ? editableCharacter.trappings : character.trappings}
              {isEditMode}
            />

            <NotesBlock
              bind:notes={isEditMode ? editableCharacter.notes : character.notes}
              bind:appearance={isEditMode ? editableCharacter.appearance : character.appearance}
              {isEditMode}
            />
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Advancement Dialog -->
{#if showAdvancementDialog && character}
  <AdvancementDialog
    bind:isOpen={showAdvancementDialog}
    {character}
    on:advance={handleAdvancement}
    on:close={() => showAdvancementDialog = false}
  />
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal}
  <Modal
    title="Delete Character"
    onClose={() => showDeleteModal = false}
  >
    <div class="modal-content">
      <p>Are you sure you want to delete <strong>{character.name}</strong>?</p>
      <p class="warning">This action cannot be undone.</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" on:click={() => showDeleteModal = false} disabled={saving}>
          Cancel
        </button>
        <button class="btn btn-danger" on:click={confirmDelete} disabled={saving}>
          {saving ? 'Deleting...' : 'Delete Character'}
        </button>
      </div>
    </div>
  </Modal>
{/if}

<!-- Duplicate Modal -->
{#if showDuplicateModal}
  <Modal
    title="Duplicate Character"
    onClose={() => showDuplicateModal = false}
  >
    <div class="modal-content">
      <p>Create a duplicate of <strong>{character.name}</strong></p>
      <div class="form-group">
        <label for="duplicate-name">New Character Name:</label>
        <input
          id="duplicate-name"
          type="text"
          bind:value={duplicateName}
          class="form-control"
          placeholder="Enter new name"
        />
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" on:click={() => showDuplicateModal = false} disabled={saving}>
          Cancel
        </button>
        <button class="btn btn-primary" on:click={confirmDuplicate} disabled={saving || !duplicateName.trim()}>
          {saving ? 'Duplicating...' : 'Create Duplicate'}
        </button>
      </div>
    </div>
  </Modal>
{/if}

<style>
  .character-sheet-page {
    min-height: 100vh;
    background: var(--color-bg-primary, #fff);
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    gap: 1rem;
  }

  .loading-container p {
    color: var(--color-text-secondary, #666);
  }

  .not-found {
    text-align: center;
    padding: 3rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .not-found h1 {
    color: var(--color-text-primary, #333);
    margin-bottom: 1rem;
    font-family: var(--font-heading, serif);
  }

  .not-found p {
    color: var(--color-text-secondary, #666);
    margin-bottom: 1.5rem;
  }

  .sheet-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem;
  }

  .actions-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 8px;
    gap: 1rem;
  }

  .actions-left,
  .actions-right {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .error-message {
    background: #fee;
    border: 1px solid #fcc;
    color: #c00;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .error-message p {
    margin: 0;
  }

  .sheet-content {
    background: var(--color-bg-primary, #fff);
  }

  .sheet-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .sheet-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Buttons */
  .btn {
    display: inline-block;
    padding: 0.6rem 1.2rem;
    font-size: 0.95rem;
    font-weight: 500;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    white-space: nowrap;
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

  .btn-danger {
    background: #dc3545;
    color: white;
  }

  .btn-danger:hover:not(:disabled) {
    background: #c82333;
  }

  .btn-text {
    background: transparent;
    color: var(--color-accent, #8b2e1f);
    padding: 0.5rem;
  }

  .btn-text:hover {
    background: var(--color-bg-secondary, #f5f5f5);
  }

  /* Modal Styles */
  .modal-content {
    padding: 1rem;
  }

  .modal-content p {
    margin: 0 0 1rem 0;
    color: var(--color-text-primary, #333);
  }

  .modal-content .warning {
    color: #dc3545;
    font-weight: 500;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary, #333);
    font-weight: 500;
  }

  .form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border, #ddd);
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit;
  }

  .form-control:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }

  /* Print Styles */
  @media print {
    .no-print {
      display: none !important;
    }

    .sheet-container {
      max-width: 100%;
      padding: 0;
    }

    .sheet-grid {
      display: block;
    }

    .sheet-column {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .sheet-container {
      padding: 0.5rem;
    }

    .actions-bar {
      flex-direction: column;
      align-items: stretch;
    }

    .actions-left,
    .actions-right {
      width: 100%;
      justify-content: stretch;
    }

    .actions-right {
      flex-direction: column;
    }

    .btn {
      width: 100%;
      text-align: center;
    }

    .sheet-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style>
