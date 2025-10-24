<script>
  /**
   * EntityEditor Component
   *
   * Modal editor for modifying any entity type (talent, spell, career, etc.)
   * Provides a dynamic form based on entity type with validation
   */

  import { createEventDispatcher } from 'svelte';
  import { getIcon } from '$lib/icons.js';
  import Badge from './Badge.svelte';
  import { getBadgeType } from '$lib/badgeUtils.js';
  import { stopEditing } from '../stores/editMode.js';

  const dispatch = createEventDispatcher();

  /**
   * @type {{entityType: string, entity: Object}}
   */
  export let editingData = null;

  // Form state
  let formData = {};
  let errors = {};
  let isDirty = false;

  // Initialize form data when editing data changes
  $: if (editingData && editingData.entity) {
    initializeFormData(editingData.entity);
  }

  /**
   * Initialize form data from entity
   */
  function initializeFormData(entity) {
    // Clone entity to avoid mutating original
    formData = { ...entity };
    // Remove metadata from form
    delete formData._meta;
    delete formData.meta;
    errors = {};
    isDirty = false;
  }

  /**
   * Get form fields based on entity type
   * Returns array of field configurations
   */
  function getFormFields(entityType) {
    // Common fields for most entities
    const commonFields = [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: false }
    ];

    // Entity-specific fields
    const specificFields = {
      talents: [
        { name: 'max', label: 'Max', type: 'number', required: false },
        { name: 'tests', label: 'Tests', type: 'text', required: false }
      ],
      skills: [
        { name: 'characteristic', label: 'Characteristic', type: 'text', required: false },
        { name: 'advanced', label: 'Advanced', type: 'checkbox', required: false }
      ],
      spells: [
        { name: 'cn', label: 'Casting Number (CN)', type: 'number', required: false },
        { name: 'range', label: 'Range', type: 'text', required: false },
        { name: 'target', label: 'Target', type: 'text', required: false },
        { name: 'duration', label: 'Duration', type: 'text', required: false },
        { name: 'lore', label: 'Lore', type: 'text', required: false }
      ],
      careers: [
        { name: 'class', label: 'Class', type: 'text', required: false },
        { name: 'species', label: 'Species', type: 'text', required: false },
        { name: 'status', label: 'Status', type: 'text', required: false }
      ],
      traits: [
        { name: 'type', label: 'Type', type: 'text', required: false }
      ],
      trappings: [
        { name: 'enc', label: 'Encumbrance', type: 'number', required: false },
        { name: 'availability', label: 'Availability', type: 'text', required: false },
        { name: 'price', label: 'Price', type: 'text', required: false }
      ]
    };

    return [
      ...commonFields,
      ...(specificFields[entityType] || [])
    ];
  }

  /**
   * Validate form data
   */
  function validateForm() {
    const fields = getFormFields(editingData.entityType);
    const newErrors = {};

    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    }

    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Handle form field change
   */
  function handleFieldChange(fieldName, value) {
    formData[fieldName] = value;
    isDirty = true;
    // Clear error for this field
    if (errors[fieldName]) {
      errors = { ...errors };
      delete errors[fieldName];
    }
  }

  /**
   * Handle save
   */
  function handleSave() {
    if (!validateForm()) {
      return;
    }

    // Create the modified fields object (only changed fields)
    const modifiedFields = {};
    const originalEntity = editingData.entity;

    for (const key in formData) {
      if (formData[key] !== originalEntity[key]) {
        modifiedFields[key] = formData[key];
      }
    }

    dispatch('save', {
      entityType: editingData.entityType,
      entityId: editingData.entity.id,
      modifiedFields,
      fullEntity: { ...editingData.entity, ...formData }
    });

    handleClose();
  }

  /**
   * Handle cancel
   */
  function handleCancel() {
    if (isDirty) {
      if (!confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        return;
      }
    }
    handleClose();
  }

  /**
   * Close the editor
   */
  function handleClose() {
    stopEditing();
    dispatch('close');
  }

  /**
   * Handle keyboard shortcuts
   */
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      handleCancel();
    } else if (event.key === 'Enter' && event.ctrlKey) {
      handleSave();
    }
  }

  /**
   * Handle backdrop click
   */
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  }

  $: fields = editingData ? getFormFields(editingData.entityType) : [];
  $: badgeType = editingData && editingData.entity ? getBadgeType(editingData.entity) : 'official';
</script>

{#if editingData}
  <div
    class="modal-backdrop"
    on:click={handleBackdropClick}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="editor-title"
    tabindex="-1"
  >
    <div class="modal-content">
      <header class="modal-header">
        <div class="header-title">
          <h2 id="editor-title">
            Edit {editingData.entityType.slice(0, -1)}
          </h2>
          <Badge type={badgeType} />
        </div>
        <button
          class="close-button"
          on:click={handleCancel}
          aria-label="Close editor"
          title="Close (Esc)"
        >
          {@html getIcon('close', 'icon-svg', 24)}
        </button>
      </header>

      <div class="modal-body">
        <form class="entity-form" on:submit|preventDefault={handleSave}>
          {#each fields as field}
            <div class="form-field" class:has-error={errors[field.name]}>
              <label for="field-{field.name}" class="field-label">
                {field.label}
                {#if field.required}
                  <span class="required-indicator" aria-label="required">*</span>
                {/if}
              </label>

              {#if field.type === 'textarea'}
                <textarea
                  id="field-{field.name}"
                  class="field-input"
                  rows="4"
                  value={formData[field.name] || ''}
                  on:input={(e) => handleFieldChange(field.name, e.target.value)}
                  required={field.required}
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={errors[field.name] ? `error-${field.name}` : null}
                ></textarea>
              {:else if field.type === 'checkbox'}
                <input
                  type="checkbox"
                  id="field-{field.name}"
                  class="field-checkbox"
                  checked={formData[field.name]}
                  on:change={(e) => handleFieldChange(field.name, e.target.checked)}
                  aria-invalid={!!errors[field.name]}
                />
              {:else if field.type === 'number'}
                <input
                  type="number"
                  id="field-{field.name}"
                  class="field-input"
                  value={formData[field.name] || ''}
                  on:input={(e) => handleFieldChange(field.name, e.target.value)}
                  required={field.required}
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={errors[field.name] ? `error-${field.name}` : null}
                />
              {:else}
                <input
                  type="text"
                  id="field-{field.name}"
                  class="field-input"
                  value={formData[field.name] || ''}
                  on:input={(e) => handleFieldChange(field.name, e.target.value)}
                  required={field.required}
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={errors[field.name] ? `error-${field.name}` : null}
                />
              {/if}

              {#if errors[field.name]}
                <span class="field-error" id="error-{field.name}" role="alert">
                  {@html getIcon('alertCircle', 'icon-svg', 16)}
                  {errors[field.name]}
                </span>
              {/if}
            </div>
          {/each}
        </form>
      </div>

      <footer class="modal-footer">
        <button
          class="button button-secondary"
          on:click={handleCancel}
          type="button"
        >
          {@html getIcon('close', 'icon-svg', 18)}
          Cancel
        </button>
        <button
          class="button button-primary"
          on:click={handleSave}
          disabled={Object.keys(errors).length > 0}
          type="button"
          title="Save changes (Ctrl+Enter)"
        >
          {@html getIcon('save', 'icon-svg', 18)}
          Save Changes
        </button>
      </footer>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--spacing-md, 1rem);
    backdrop-filter: blur(2px);
  }

  .modal-content {
    background-color: var(--color-bg-primary, #fff);
    border-radius: var(--radius-lg, 12px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg, 1.5rem);
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm, 0.5rem);
  }

  .modal-header h2 {
    margin: 0;
    font-size: var(--font-size-xl, 1.5rem);
    font-family: var(--font-heading, serif);
    color: var(--color-text-primary, #333);
    text-transform: capitalize;
  }

  .close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md, 6px);
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary, #666);
    transition: background-color var(--transition-fast, 0.15s);
  }

  .close-button:hover {
    background-color: var(--color-bg-secondary, #f5f5f5);
    color: var(--color-text-primary, #333);
  }

  .close-button:focus-visible {
    outline: var(--focus-ring-width, 2px) solid var(--color-border-focus, #0066cc);
    outline-offset: var(--focus-ring-offset, 2px);
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-lg, 1.5rem);
  }

  .entity-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg, 1.5rem);
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs, 0.25rem);
  }

  .field-label {
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text-primary, #333);
  }

  .required-indicator {
    color: var(--color-error, #dc3545);
    margin-left: var(--spacing-xs, 0.25rem);
  }

  .field-input {
    padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
    font-size: var(--font-size-base, 1rem);
    font-family: var(--font-body, sans-serif);
    color: var(--color-text-primary, #333);
    background-color: var(--color-bg-primary, #fff);
    border: 2px solid var(--color-border, #ddd);
    border-radius: var(--radius-md, 6px);
    transition: border-color var(--transition-fast, 0.15s);
  }

  textarea.field-input {
    resize: vertical;
    min-height: 80px;
  }

  .field-input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .field-input[aria-invalid="true"] {
    border-color: var(--color-error, #dc3545);
  }

  .field-checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .form-field.has-error .field-input {
    border-color: var(--color-error, #dc3545);
  }

  .field-error {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs, 0.25rem);
    color: var(--color-error, #dc3545);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .field-error :global(.icon-svg) {
    flex-shrink: 0;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--spacing-md, 1rem);
    padding: var(--spacing-lg, 1.5rem);
    border-top: 1px solid var(--color-border, #ddd);
    background-color: var(--color-bg-secondary, #f5f5f5);
  }

  .button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm, 0.5rem);
    padding: var(--spacing-sm, 0.5rem) var(--spacing-lg, 1.5rem);
    font-size: var(--font-size-base, 1rem);
    font-weight: var(--font-weight-semibold, 600);
    font-family: var(--font-ui, sans-serif);
    border-radius: var(--radius-md, 6px);
    border: 2px solid transparent;
    cursor: pointer;
    transition:
      background-color var(--transition-fast, 0.15s),
      border-color var(--transition-fast, 0.15s),
      transform var(--transition-fast, 0.15s);
  }

  .button:hover {
    transform: translateY(-1px);
  }

  .button:active {
    transform: translateY(0);
  }

  .button:focus-visible {
    outline: var(--focus-ring-width, 2px) solid var(--color-border-focus, #0066cc);
    outline-offset: var(--focus-ring-offset, 2px);
  }

  .button-primary {
    background-color: var(--color-accent, #8b2e1f);
    color: white;
    border-color: var(--color-accent, #8b2e1f);
  }

  .button-primary:hover:not(:disabled) {
    background-color: var(--color-accent-hover, #6d2318);
  }

  .button-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .button-secondary {
    background-color: transparent;
    color: var(--color-text-primary, #333);
    border-color: var(--color-border, #ddd);
  }

  .button-secondary:hover {
    background-color: var(--color-bg-tertiary, #e5e5e5);
    border-color: var(--color-border-strong, #999);
  }

  .button :global(.icon-svg) {
    width: 18px;
    height: 18px;
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .modal-content {
      max-width: 100%;
      max-height: 100vh;
      border-radius: 0;
    }

    .modal-header,
    .modal-body,
    .modal-footer {
      padding: var(--spacing-md, 1rem);
    }

    .modal-header h2 {
      font-size: var(--font-size-lg, 1.25rem);
    }

    .button {
      padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
      font-size: var(--font-size-sm, 0.875rem);
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .modal-backdrop,
    .field-input,
    .button {
      transition: none;
    }

    .button:hover {
      transform: none;
    }
  }
</style>
