<script>
  /**
   * ImportCharacter Component
   *
   * Provides a dialog for importing characters from JSON files
   * with validation, preview, and error handling.
   */

  import { createEventDispatcher } from 'svelte'
  import { parseCharacterJSON, previewCharacterImport, importCharacters } from '../../lib/characterImport.js'
  import { mergedData } from '../../stores/data.js'
  import Modal from '../Modal.svelte'
  import LoadingSpinner from '../LoadingSpinner.svelte'

  export let isOpen = false
  export let existingCharacters = []

  const dispatch = createEventDispatcher()

  let fileInput
  let selectedFile = null
  let jsonContent = ''
  let previewData = null
  let importResult = null
  let isLoading = false
  let currentStep = 'select' // select, preview, import, result

  // Import options
  let assignNewId = true
  let replaceIfExists = false

  $: options = {
    assignNewId,
    replaceIfExists,
    existingCharacters,
    mergedData: $mergedData,
    validateData: true
  }

  /**
   * Handle file selection
   */
  function handleFileSelect(event) {
    const file = event.target.files[0]
    if (!file) return

    selectedFile = file

    // Read file content
    const reader = new FileReader()
    reader.onload = (e) => {
      jsonContent = e.target.result
      handlePreview()
    }
    reader.onerror = () => {
      dispatch('error', { message: 'Failed to read file' })
    }
    reader.readAsText(file)
  }

  /**
   * Handle preview
   */
  function handlePreview() {
    try {
      previewData = previewCharacterImport(jsonContent, options)
      if (previewData.success) {
        currentStep = 'preview'
      } else {
        dispatch('error', {
          message: 'Invalid JSON format',
          errors: previewData.errors
        })
      }
    } catch (error) {
      dispatch('error', {
        message: 'Failed to parse JSON',
        errors: [error.message]
      })
    }
  }

  /**
   * Handle import
   */
  async function handleImport() {
    if (!previewData || !previewData.success) return

    isLoading = true
    currentStep = 'import'

    try {
      const parseResult = parseCharacterJSON(jsonContent)
      if (!parseResult.success) {
        throw new Error(parseResult.errors.join(', '))
      }

      const { characters } = parseResult.data
      const result = await importCharacters(characters, options)

      importResult = result
      currentStep = 'result'

      if (result.success) {
        dispatch('import', {
          characters: result.data.results.filter(r => r.success).map(r => r.data),
          count: result.data.imported
        })
      }
    } catch (error) {
      dispatch('error', {
        message: 'Import failed',
        errors: [error.message]
      })
      currentStep = 'preview'
    } finally {
      isLoading = false
    }
  }

  /**
   * Handle close
   */
  function handleClose() {
    // Reset state
    selectedFile = null
    jsonContent = ''
    previewData = null
    importResult = null
    currentStep = 'select'
    if (fileInput) {
      fileInput.value = ''
    }

    dispatch('close')
    isOpen = false
  }

  /**
   * Handle back to file selection
   */
  function handleBack() {
    currentStep = 'select'
    previewData = null
  }

  /**
   * Get validation status icon
   */
  function getStatusIcon(valid) {
    return valid ? '✓' : '✗'
  }

  /**
   * Get validation status class
   */
  function getStatusClass(valid) {
    return valid ? 'text-green-600' : 'text-red-600'
  }
</script>

<Modal bind:isOpen on:close={handleClose} size="large">
  <div slot="header">
    <h2 class="text-xl font-bold">Import Character</h2>
  </div>

  <div slot="body" class="space-y-4">
    {#if currentStep === 'select'}
      <!-- File Selection -->
      <div class="space-y-4">
        <div>
          <label for="file-upload" class="block text-sm font-medium text-gray-700 mb-2">
            Select JSON file to import
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".json,application/json"
            bind:this={fileInput}
            on:change={handleFileSelect}
            class="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
          />
        </div>

        <!-- Import Options -->
        <div class="border-t pt-4">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Import Options</h3>
          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                bind:checked={assignNewId}
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700">Assign new ID (recommended)</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                bind:checked={replaceIfExists}
                disabled={assignNewId}
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              />
              <span class="text-sm text-gray-700">Replace if ID exists</span>
            </label>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-gray-700">
          <strong>Note:</strong> Characters will be validated before import. Any errors will be shown in the preview.
        </div>
      </div>

    {:else if currentStep === 'preview'}
      <!-- Preview -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">Preview Import</h3>
          <button
            type="button"
            on:click={handleBack}
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Back to file selection
          </button>
        </div>

        {#if previewData && previewData.data}
          <div class="space-y-2">
            <p class="text-sm text-gray-600">
              <strong>Export Type:</strong> {previewData.data.exportType}
            </p>
            <p class="text-sm text-gray-600">
              <strong>Characters to import:</strong> {previewData.data.count}
            </p>
            {#if previewData.data.metadata?.exported}
              <p class="text-sm text-gray-600">
                <strong>Exported:</strong> {new Date(previewData.data.metadata.exported).toLocaleString()}
              </p>
            {/if}
          </div>

          <!-- Character Previews -->
          <div class="space-y-3 max-h-96 overflow-y-auto">
            {#each previewData.data.previews as preview, i}
              <div class="border rounded p-3 {preview.validation.valid ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2">
                      <span class="text-lg {getStatusClass(preview.validation.valid)}">
                        {getStatusIcon(preview.validation.valid)}
                      </span>
                      <h4 class="font-medium">{preview.character.name}</h4>
                    </div>
                    <p class="text-sm text-gray-600">
                      {preview.character.species} - {preview.character.career}
                    </p>
                    {#if preview.character.id}
                      <p class="text-xs text-gray-500">ID: {preview.character.id}</p>
                    {/if}
                  </div>
                </div>

                {#if preview.validation.errors?.length > 0}
                  <div class="mt-2 space-y-1">
                    <p class="text-xs font-medium text-red-700">Errors:</p>
                    {#each preview.validation.errors as error}
                      <p class="text-xs text-red-600">• {error}</p>
                    {/each}
                  </div>
                {/if}

                {#if preview.validation.warnings?.length > 0}
                  <div class="mt-2 space-y-1">
                    <p class="text-xs font-medium text-yellow-700">Warnings:</p>
                    {#each preview.validation.warnings as warning}
                      <p class="text-xs text-yellow-600">• {warning}</p>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>

          <!-- Validation Summary -->
          <div class="border-t pt-4">
            {#if previewData.data.previews.every(p => p.validation.valid)}
              <p class="text-sm text-green-600 font-medium">
                ✓ All characters are valid and ready to import
              </p>
            {:else}
              <p class="text-sm text-red-600 font-medium">
                ✗ Some characters have validation errors and cannot be imported
              </p>
            {/if}
          </div>
        {/if}
      </div>

    {:else if currentStep === 'import'}
      <!-- Importing -->
      <div class="flex flex-col items-center justify-center py-8 space-y-4">
        <LoadingSpinner size="large" />
        <p class="text-gray-600">Importing characters...</p>
      </div>

    {:else if currentStep === 'result'}
      <!-- Import Result -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium">Import Complete</h3>

        {#if importResult}
          <div class="space-y-2">
            <p class="text-sm text-gray-600">
              <strong>Total characters:</strong> {importResult.data.total}
            </p>
            <p class="text-sm text-green-600">
              <strong>Successfully imported:</strong> {importResult.data.imported}
            </p>
            {#if importResult.data.failed > 0}
              <p class="text-sm text-red-600">
                <strong>Failed:</strong> {importResult.data.failed}
              </p>
            {/if}
          </div>

          {#if importResult.errors?.length > 0}
            <div class="border border-red-300 bg-red-50 rounded p-3 space-y-1">
              <p class="text-sm font-medium text-red-700">Errors:</p>
              {#each importResult.errors as error}
                <p class="text-xs text-red-600">• {error}</p>
              {/each}
            </div>
          {/if}

          {#if importResult.warnings?.length > 0}
            <div class="border border-yellow-300 bg-yellow-50 rounded p-3 space-y-1">
              <p class="text-sm font-medium text-yellow-700">Warnings:</p>
              {#each importResult.warnings as warning}
                <p class="text-xs text-yellow-600">• {warning}</p>
              {/each}
            </div>
          {/if}
        {/if}
      </div>
    {/if}
  </div>

  <div slot="footer" class="flex justify-end space-x-2">
    {#if currentStep === 'select'}
      <button
        type="button"
        on:click={handleClose}
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
      >
        Cancel
      </button>
    {:else if currentStep === 'preview'}
      <button
        type="button"
        on:click={handleBack}
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
      >
        Back
      </button>
      <button
        type="button"
        on:click={handleImport}
        disabled={!previewData || !previewData.data.previews.every(p => p.validation.valid)}
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Import
      </button>
    {:else if currentStep === 'result'}
      <button
        type="button"
        on:click={handleClose}
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Close
      </button>
    {/if}
  </div>
</Modal>
