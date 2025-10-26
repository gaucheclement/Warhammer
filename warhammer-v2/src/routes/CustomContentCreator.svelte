<script>
  import { onMount } from 'svelte';
  import { customModifications, saveCustomModifications } from '../stores/data.js';
  import {
    getEntityTypeOptions,
    getSchema,
    getRequiredFields,
    getOptionalFields,
    hasOptionalFields
  } from '../lib/formSchemas.js';
  import {
    validateEntity,
    validateField,
    getWarnings,
    sanitizeFormValues,
    generateIdFromName,
    getErrorMessages,
    hasErrors
  } from '../lib/validators.js';
  import { getBadgeType } from '../lib/badgeUtils.js';
  import Badge from '../components/Badge.svelte';
  import { getIcon } from '../lib/icons.js';

  // State
  let selectedEntityType = '';
  let formValues = {};
  let errors = {};
  let warnings = [];
  let showOptionalFields = false;
  let isSubmitting = false;
  let showPreview = false;
  let submitSuccess = false;
  let submitMessage = '';

  // Get entity type options for dropdown
  const entityTypeOptions = getEntityTypeOptions();

  // Reactive values
  $: schema = selectedEntityType ? getSchema(selectedEntityType) : null;
  $: requiredFields = selectedEntityType ? getRequiredFields(selectedEntityType) : [];
  $: optionalFields = selectedEntityType ? getOptionalFields(selectedEntityType) : [];
  $: hasOptional = selectedEntityType ? hasOptionalFields(selectedEntityType) : false;
  $: previewEntity = createPreviewEntity(formValues);

  /**
   * Handle entity type selection change
   */
  function handleEntityTypeChange() {
    // Reset form when changing entity type
    formValues = {};
    errors = {};
    warnings = [];
    showOptionalFields = false;
    submitSuccess = false;
    submitMessage = '';
  }

  /**
   * Handle field value change with live validation
   */
  function handleFieldChange(fieldName, value) {
    formValues[fieldName] = value;

    // Live validation for this field
    const result = validateField(selectedEntityType, fieldName, value, formValues);
    if (result.valid) {
      // Remove error if field is now valid
      delete errors[fieldName];
      errors = errors; // Trigger reactivity
    } else {
      errors[fieldName] = result.error;
      errors = errors; // Trigger reactivity
    }

    // Auto-generate ID from name if name field changes and ID is empty
    if (fieldName === 'name' && !formValues.id) {
      const generatedId = generateIdFromName(value, selectedEntityType);
      formValues.id = generatedId;
      // Validate the generated ID
      const idResult = validateField(selectedEntityType, 'id', generatedId, formValues);
      if (!idResult.valid) {
        errors.id = idResult.error;
      } else {
        delete errors.id;
      }
      errors = errors; // Trigger reactivity
    }

    // Update warnings
    warnings = getWarnings(selectedEntityType, formValues);
  }

  /**
   * Handle form submission
   */
  async function handleSubmit() {
    if (!selectedEntityType) {
      return;
    }

    isSubmitting = true;
    submitSuccess = false;
    submitMessage = '';

    // Sanitize values
    const sanitized = sanitizeFormValues(formValues);

    // Validate entire entity
    const validation = validateEntity(selectedEntityType, sanitized);

    if (!validation.valid) {
      errors = validation.errors;
      isSubmitting = false;
      submitMessage = 'Please fix the errors before submitting.';
      return;
    }

    // Clear errors
    errors = {};

    try {
      // Create the entity with metadata
      const entity = {
        ...sanitized,
        _meta: {
          isCustom: true,
          created: new Date().toISOString()
        }
      };

      // Add to customModifications store
      customModifications.update(store => {
        const updated = { ...store };
        if (!updated[selectedEntityType]) {
          updated[selectedEntityType] = [];
        }
        updated[selectedEntityType] = [...updated[selectedEntityType], entity];
        return updated;
      });

      // Save to localStorage
      saveCustomModifications();

      // Show success message
      submitSuccess = true;
      submitMessage = `${schema.label} "${sanitized.name}" created successfully!`;

      // Clear form after a delay
      setTimeout(() => {
        clearForm();
      }, 2000);

    } catch (error) {
      console.error('Error creating custom content:', error);
      submitMessage = 'An error occurred while creating the content. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }

  /**
   * Clear the form
   */
  function clearForm() {
    formValues = {};
    errors = {};
    warnings = [];
    showOptionalFields = false;
    submitSuccess = false;
    submitMessage = '';
  }

  /**
   * Create preview entity object
   */
  function createPreviewEntity(values) {
    return {
      ...values,
      _meta: {
        isCustom: true,
        created: new Date().toISOString()
      }
    };
  }

  /**
   * Toggle optional fields visibility
   */
  function toggleOptionalFields() {
    showOptionalFields = !showOptionalFields;
  }

  /**
   * Toggle preview visibility
   */
  function togglePreview() {
    showPreview = !showPreview;
  }

  /**
   * Render field input based on field type
   */
  function getFieldValue(fieldName) {
    return formValues[fieldName] || '';
  }

  /**
   * Check if field has error
   */
  function hasFieldError(fieldName) {
    return fieldName in errors;
  }

  /**
   * Get field error message
   */
  function getFieldError(fieldName) {
    return errors[fieldName] || '';
  }
</script>

<div class="custom-content-creator">
  <header class="page-header">
    <h1>Custom Content Creator</h1>
    <p class="subtitle">Create your own talents, spells, careers, and more</p>
  </header>

  <div class="creator-layout">
    <!-- Entity Type Selection -->
    <section class="entity-type-section">
      <label for="entityType" class="section-label">
        <span class="label-icon">{@html getIcon('folder', 'icon-svg', 20)}</span>
        What do you want to create?
      </label>

      <select
        id="entityType"
        bind:value={selectedEntityType}
        on:change={handleEntityTypeChange}
        class="entity-type-select"
      >
        <option value="">Select entity type...</option>
        {#each entityTypeOptions as option}
          <option value={option.value}>
            {option.label} - {option.description}
          </option>
        {/each}
      </select>
    </section>

    {#if schema}
      <div class="form-and-preview">
        <!-- Form Section -->
        <section class="form-section">
          <div class="form-header">
            <h2>
              <span class="header-icon">{@html getIcon(schema.icon || 'plus', 'icon-svg', 24)}</span>
              New {schema.label}
            </h2>
            <p class="form-description">{schema.description}</p>
          </div>

          <form on:submit|preventDefault={handleSubmit} class="content-form">
            <!-- Required Fields -->
            <div class="field-group">
              <h3 class="group-title">Required Fields</h3>

              {#each requiredFields as field}
                <div class="form-field" class:has-error={hasFieldError(field.name)}>
                  <label for={field.name} class="field-label">
                    {field.label}
                    <span class="required-indicator" title="Required">*</span>
                  </label>

                  {#if field.type === 'textarea'}
                    <textarea
                      id={field.name}
                      bind:value={formValues[field.name]}
                      on:input={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder || ''}
                      rows={field.rows || 4}
                      class="field-input"
                      class:error={hasFieldError(field.name)}
                    />
                  {:else if field.type === 'select'}
                    <select
                      id={field.name}
                      bind:value={formValues[field.name]}
                      on:change={(e) => handleFieldChange(field.name, e.target.value)}
                      class="field-input"
                      class:error={hasFieldError(field.name)}
                    >
                      <option value="">Select {field.label}...</option>
                      {#each field.options as option}
                        <option value={option.value}>{option.label}</option>
                      {/each}
                    </select>
                  {:else if field.type === 'number'}
                    <input
                      id={field.name}
                      type="number"
                      bind:value={formValues[field.name]}
                      on:input={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder || ''}
                      min={field.min}
                      max={field.max}
                      class="field-input"
                      class:error={hasFieldError(field.name)}
                    />
                  {:else if field.type === 'checkbox'}
                    <input
                      id={field.name}
                      type="checkbox"
                      bind:checked={formValues[field.name]}
                      on:change={(e) => handleFieldChange(field.name, e.target.checked)}
                      class="field-checkbox"
                    />
                  {:else}
                    <input
                      id={field.name}
                      type="text"
                      bind:value={formValues[field.name]}
                      on:input={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder || ''}
                      pattern={field.pattern}
                      class="field-input"
                      class:error={hasFieldError(field.name)}
                    />
                  {/if}

                  {#if field.helpText}
                    <span class="field-help">{field.helpText}</span>
                  {/if}

                  {#if hasFieldError(field.name)}
                    <span class="field-error">
                      {@html getIcon('alert', 'icon-svg', 16)}
                      {getFieldError(field.name)}
                    </span>
                  {/if}
                </div>
              {/each}
            </div>

            <!-- Optional Fields (Collapsible) -->
            {#if hasOptional}
              <div class="field-group optional-group">
                <button
                  type="button"
                  class="group-toggle"
                  on:click={toggleOptionalFields}
                  aria-expanded={showOptionalFields}
                >
                  <span class="toggle-icon" class:expanded={showOptionalFields}>
                    {@html getIcon('chevronRight', 'icon-svg', 20)}
                  </span>
                  <h3 class="group-title">Optional Fields ({optionalFields.length})</h3>
                </button>

                {#if showOptionalFields}
                  <div class="optional-fields-content">
                    {#each optionalFields as field}
                      <div class="form-field" class:has-error={hasFieldError(field.name)}>
                        <label for={field.name} class="field-label">
                          {field.label}
                        </label>

                        {#if field.type === 'textarea'}
                          <textarea
                            id={field.name}
                            bind:value={formValues[field.name]}
                            on:input={(e) => handleFieldChange(field.name, e.target.value)}
                            placeholder={field.placeholder || ''}
                            rows={field.rows || 3}
                            class="field-input"
                            class:error={hasFieldError(field.name)}
                          />
                        {:else if field.type === 'select'}
                          <select
                            id={field.name}
                            bind:value={formValues[field.name]}
                            on:change={(e) => handleFieldChange(field.name, e.target.value)}
                            class="field-input"
                            class:error={hasFieldError(field.name)}
                          >
                            <option value="">Select {field.label}...</option>
                            {#each field.options as option}
                              <option value={option.value}>{option.label}</option>
                            {/each}
                          </select>
                        {:else if field.type === 'number'}
                          <input
                            id={field.name}
                            type="number"
                            bind:value={formValues[field.name]}
                            on:input={(e) => handleFieldChange(field.name, e.target.value)}
                            placeholder={field.placeholder || ''}
                            min={field.min}
                            max={field.max}
                            class="field-input"
                            class:error={hasFieldError(field.name)}
                          />
                        {:else if field.type === 'checkbox'}
                          <label class="checkbox-label">
                            <input
                              id={field.name}
                              type="checkbox"
                              bind:checked={formValues[field.name]}
                              on:change={(e) => handleFieldChange(field.name, e.target.checked)}
                              class="field-checkbox"
                            />
                            <span>{field.helpText || field.label}</span>
                          </label>
                        {:else}
                          <input
                            id={field.name}
                            type="text"
                            bind:value={formValues[field.name]}
                            on:input={(e) => handleFieldChange(field.name, e.target.value)}
                            placeholder={field.placeholder || ''}
                            pattern={field.pattern}
                            class="field-input"
                            class:error={hasFieldError(field.name)}
                          />
                        {/if}

                        {#if field.helpText && field.type !== 'checkbox'}
                          <span class="field-help">{field.helpText}</span>
                        {/if}

                        {#if hasFieldError(field.name)}
                          <span class="field-error">
                            {@html getIcon('alert', 'icon-svg', 16)}
                            {getFieldError(field.name)}
                          </span>
                        {/if}
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}

            <!-- Warnings -->
            {#if warnings.length > 0}
              <div class="warnings-section">
                <h4 class="warnings-title">
                  {@html getIcon('alert', 'icon-svg', 20)}
                  Suggestions
                </h4>
                <ul class="warnings-list">
                  {#each warnings as warning}
                    <li>{warning}</li>
                  {/each}
                </ul>
              </div>
            {/if}

            <!-- Submit Message -->
            {#if submitMessage}
              <div class="submit-message" class:success={submitSuccess} class:error={!submitSuccess}>
                {#if submitSuccess}
                  {@html getIcon('checkCircle', 'icon-svg', 20)}
                {:else}
                  {@html getIcon('alert', 'icon-svg', 20)}
                {/if}
                {submitMessage}
              </div>
            {/if}

            <!-- Action Buttons -->
            <div class="form-actions">
              <button
                type="button"
                on:click={togglePreview}
                class="btn btn-secondary"
                disabled={!formValues.name}
              >
                {@html getIcon('eye', 'icon-svg', 20)}
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>

              <button
                type="button"
                on:click={clearForm}
                class="btn btn-secondary"
                disabled={Object.keys(formValues).length === 0}
              >
                {@html getIcon('close', 'icon-svg', 20)}
                Clear Form
              </button>

              <button
                type="submit"
                class="btn btn-primary"
                disabled={isSubmitting || hasErrors(errors)}
              >
                {#if isSubmitting}
                  {@html getIcon('refresh', 'icon-svg', 20)}
                  Creating...
                {:else}
                  {@html getIcon('plus', 'icon-svg', 20)}
                  Create {schema.label}
                {/if}
              </button>
            </div>
          </form>
        </section>

        <!-- Preview Section -->
        {#if showPreview && formValues.name}
          <section class="preview-section">
            <div class="preview-header">
              <h2>Preview</h2>
              <Badge type={getBadgeType(previewEntity)} />
            </div>

            <div class="preview-content">
              <div class="preview-title">
                <h3>{formValues.name || 'Untitled'}</h3>
                {#if formValues.id}
                  <span class="preview-id">ID: {formValues.id}</span>
                {/if}
              </div>

              {#if formValues.description}
                <div class="preview-description">
                  <h4>Description</h4>
                  <p>{formValues.description}</p>
                </div>
              {/if}

              <div class="preview-details">
                <h4>Details</h4>
                <dl class="preview-list">
                  {#each Object.entries(formValues) as [key, value]}
                    {#if key !== 'id' && key !== 'name' && key !== 'description' && value}
                      <div class="preview-item">
                        <dt>{key}</dt>
                        <dd>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</dd>
                      </div>
                    {/if}
                  {/each}
                </dl>
              </div>

              <div class="preview-meta">
                <p class="preview-note">
                  {@html getIcon('info', 'icon-svg', 16)}
                  This is how your custom content will appear in the app
                </p>
              </div>
            </div>
          </section>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .custom-content-creator {
    max-width: 1400px;
    margin: 0 auto;
    padding: var(--spacing-xl);
  }

  .page-header {
    margin-bottom: var(--spacing-xl);
  }

  .page-header h1 {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin: 0 0 var(--spacing-sm) 0;
  }

  .subtitle {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    margin: 0;
  }

  .creator-layout {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  /* Entity Type Selection */
  .entity-type-section {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
  }

  .section-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-md);
  }

  .label-icon {
    display: flex;
    color: var(--color-accent);
  }

  .entity-type-select {
    width: 100%;
    padding: var(--spacing-md);
    font-size: var(--font-size-base);
    background: var(--color-bg);
    color: var(--color-text-primary);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: border-color var(--transition-fast);
  }

  .entity-type-select:focus {
    outline: none;
    border-color: var(--color-accent);
  }

  /* Form and Preview Layout */
  .form-and-preview {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }

  @media (min-width: 1024px) {
    .form-and-preview {
      grid-template-columns: 1fr 400px;
    }
  }

  /* Form Section */
  .form-section {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
  }

  .form-header {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
  }

  .form-header h2 {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin: 0 0 var(--spacing-sm) 0;
  }

  .header-icon {
    display: flex;
    color: var(--color-accent);
  }

  .form-description {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    margin: 0;
  }

  /* Field Groups */
  .field-group {
    margin-bottom: var(--spacing-xl);
  }

  .group-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin: 0 0 var(--spacing-md) 0;
  }

  .optional-group .group-toggle {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    width: 100%;
    padding: var(--spacing-md);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color var(--transition-fast);
    margin-bottom: var(--spacing-md);
  }

  .optional-group .group-toggle:hover {
    background: var(--color-surface-hover);
  }

  .toggle-icon {
    display: flex;
    transition: transform var(--transition-fast);
  }

  .toggle-icon.expanded {
    transform: rotate(90deg);
  }

  .optional-fields-content {
    padding-left: var(--spacing-md);
  }

  /* Form Fields */
  .form-field {
    margin-bottom: var(--spacing-lg);
  }

  .field-label {
    display: block;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-xs);
  }

  .required-indicator {
    color: var(--color-error);
    margin-left: var(--spacing-xs);
  }

  .field-input,
  .field-textarea {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-base);
    font-family: var(--font-body);
    background: var(--color-bg);
    color: var(--color-text-primary);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    transition: border-color var(--transition-fast);
  }

  .field-input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--color-accent);
  }

  .field-input.error,
  textarea.error {
    border-color: var(--color-error);
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  .field-checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
  }

  .field-help {
    display: block;
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    margin-top: var(--spacing-xs);
  }

  .field-error {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-sm);
    color: var(--color-error);
    margin-top: var(--spacing-xs);
  }

  /* Warnings */
  .warnings-section {
    padding: var(--spacing-md);
    background: var(--color-warning-bg);
    border: 1px solid var(--color-warning);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-lg);
  }

  .warnings-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--color-warning);
    margin: 0 0 var(--spacing-sm) 0;
  }

  .warnings-list {
    margin: 0;
    padding-left: var(--spacing-lg);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }

  .warnings-list li {
    margin-bottom: var(--spacing-xs);
  }

  /* Submit Message */
  .submit-message {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-lg);
  }

  .submit-message.success {
    background: var(--color-success-bg);
    color: var(--color-success);
    border: 1px solid var(--color-success);
  }

  .submit-message.error {
    background: var(--color-error-bg);
    color: var(--color-error);
    border: 1px solid var(--color-error);
  }

  /* Form Actions */
  .form-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: flex-end;
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--color-border);
  }

  .btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: var(--color-accent);
    color: var(--color-text-on-accent);
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--color-accent-hover);
  }

  .btn-secondary {
    background: var(--color-surface);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--color-surface-hover);
  }

  /* Preview Section */
  .preview-section {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    position: sticky;
    top: var(--spacing-xl);
    max-height: calc(100vh - var(--spacing-xl) * 2);
    overflow-y: auto;
  }

  .preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
  }

  .preview-header h2 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin: 0;
  }

  .preview-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .preview-title h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin: 0 0 var(--spacing-xs) 0;
  }

  .preview-id {
    font-size: var(--font-size-sm);
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
  }

  .preview-description h4,
  .preview-details h4 {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 var(--spacing-sm) 0;
  }

  .preview-description p {
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
    line-height: 1.6;
    margin: 0;
  }

  .preview-list {
    display: grid;
    gap: var(--spacing-sm);
  }

  .preview-item {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    background: var(--color-bg);
    border-radius: var(--radius-sm);
  }

  .preview-item dt {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    text-transform: capitalize;
  }

  .preview-item dd {
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
    margin: 0;
  }

  .preview-meta {
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border);
  }

  .preview-note {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-xs);
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    margin: 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .custom-content-creator {
      padding: var(--spacing-md);
    }

    .form-actions {
      flex-direction: column;
    }

    .btn {
      width: 100%;
      justify-content: center;
    }

    .preview-section {
      position: static;
      max-height: none;
    }
  }
</style>
