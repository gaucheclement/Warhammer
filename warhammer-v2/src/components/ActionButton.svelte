<script>
  /**
   * ActionButton - Composant de bouton d'action réutilisable
   *
   * Composant générique pour créer des boutons d'action avec modale optionnelle.
   * Supporte différentes variantes, tailles, icônes, et états de chargement.
   *
   * @prop {string} variant - Style du bouton: 'primary' | 'secondary' | 'info' | 'warning' | 'error'
   * @prop {string} size - Taille du bouton: 'small' | 'medium' | 'large'
   * @prop {string} icon - Nom de l'icône (getIcon compatible)
   * @prop {string} label - Texte du bouton
   * @prop {boolean} compact - Afficher uniquement l'icône (icon-only mode)
   * @prop {boolean} disabled - Désactiver le bouton
   * @prop {boolean} loading - Afficher le spinner de chargement
   * @prop {boolean} showModal - Contrôle l'affichage de la modale
   * @prop {Object} modalConfig - Configuration de la modale
   *   - title: Titre de la modale
   *   - confirmLabel: Texte du bouton de confirmation (défaut: "Confirmer")
   *   - cancelLabel: Texte du bouton d'annulation (défaut: "Annuler")
   *   - confirmVariant: Style du bouton de confirmation (défaut: 'primary')
   * @prop {Function} onClick - Fonction appelée au clic sur le bouton
   * @prop {Function} onConfirm - Fonction appelée au clic sur le bouton de confirmation de la modale
   * @prop {Function} onCancel - Fonction appelée au clic sur le bouton d'annulation de la modale
   *
   * @slot default - Contenu principal du bouton (remplace label si fourni)
   * @slot modal-body - Contenu du corps de la modale
   */

  import { getIcon } from '../lib/icons.js';

  // Props principales
  export let variant = 'primary'; // 'primary' | 'secondary' | 'info' | 'warning' | 'error'
  export let size = 'medium'; // 'small' | 'medium' | 'large'
  export let icon = null;
  export let label = '';
  export let compact = false;
  export let disabled = false;
  export let loading = false;

  // Props modale
  export let showModal = false;
  export let modalConfig = {
    title: '',
    confirmLabel: 'Confirmer',
    cancelLabel: 'Annuler',
    confirmVariant: 'primary'
  };

  // Callbacks
  export let onClick = null;
  export let onConfirm = null;
  export let onCancel = null;

  // Taille de l'icône selon la taille du bouton
  $: iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;

  /**
   * Gestion du clic sur le bouton
   */
  function handleClick() {
    if (disabled || loading) return;
    if (onClick) {
      onClick();
    }
  }

  /**
   * Gestion de la confirmation modale
   */
  function handleConfirm() {
    if (onConfirm) {
      onConfirm();
    }
  }

  /**
   * Gestion de l'annulation modale
   */
  function handleCancel() {
    if (onCancel) {
      onCancel();
    }
  }

  /**
   * Fermeture de la modale avec Escape
   */
  function handleKeydown(event) {
    if (event.key === 'Escape' && showModal) {
      handleCancel();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<button
  type="button"
  class="action-button"
  class:variant-primary={variant === 'primary'}
  class:variant-secondary={variant === 'secondary'}
  class:variant-info={variant === 'info'}
  class:variant-warning={variant === 'warning'}
  class:variant-error={variant === 'error'}
  class:size-small={size === 'small'}
  class:size-medium={size === 'medium'}
  class:size-large={size === 'large'}
  class:compact
  {disabled}
  on:click={handleClick}
  title={compact ? label : ''}
  aria-label={label}
>
  {#if icon}
    <span class="icon" aria-hidden="true">
      {@html getIcon(icon, 'icon-svg', iconSize)}
    </span>
  {/if}

  {#if !compact}
    <span class="label">
      <slot>{label}</slot>
    </span>
  {/if}

  {#if loading}
    <span class="spinner" aria-hidden="true"></span>
  {/if}
</button>

{#if showModal}
  <div
    class="modal-backdrop"
    on:click={handleCancel}
    aria-hidden="true"
  ></div>

  <div
    class="modal"
    role="dialog"
    aria-labelledby="modal-title"
    aria-modal="true"
  >
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modal-title">{modalConfig.title}</h2>
        <button
          type="button"
          class="modal-close"
          on:click={handleCancel}
          aria-label="Fermer la modale"
          title="Fermer"
        >
          {@html getIcon('close', 'icon-svg', 20)}
        </button>
      </div>

      <div class="modal-body">
        <slot name="modal-body"></slot>
      </div>

      <div class="modal-footer">
        <button
          type="button"
          class="button button-secondary"
          on:click={handleCancel}
          disabled={loading}
        >
          {modalConfig.cancelLabel}
        </button>
        <button
          type="button"
          class="button"
          class:button-primary={modalConfig.confirmVariant === 'primary'}
          class:button-error={modalConfig.confirmVariant === 'error'}
          class:button-warning={modalConfig.confirmVariant === 'warning'}
          class:button-info={modalConfig.confirmVariant === 'info'}
          on:click={handleConfirm}
          disabled={loading}
        >
          {#if loading}
            Chargement...
          {:else}
            {modalConfig.confirmLabel}
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* ========== BOUTON D'ACTION ========== */
  .action-button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    font-family: var(--font-ui);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
    cursor: pointer;
    border: 1px solid transparent;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      transform var(--transition-fast),
      opacity var(--transition-fast);
    white-space: nowrap;
  }

  .action-button:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .action-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .action-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-button:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
  }

  /* ========== VARIANTES DE BOUTON ========== */
  .variant-primary {
    background-color: var(--color-primary);
    color: var(--color-text-on-primary);
    border-color: var(--color-primary);
  }

  .variant-primary:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
    border-color: var(--color-primary-hover);
  }

  .variant-secondary {
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
    border-color: var(--color-border);
  }

  .variant-secondary:hover:not(:disabled) {
    background-color: var(--color-bg-tertiary);
    border-color: var(--color-border-strong);
  }

  .variant-info {
    background-color: var(--color-surface, var(--color-bg-primary));
    border-color: var(--color-info);
    color: var(--color-info);
  }

  .variant-info:hover:not(:disabled) {
    background-color: var(--color-info-bg);
    border-color: var(--color-info);
  }

  .variant-warning {
    background-color: var(--color-surface, var(--color-bg-primary));
    border-color: var(--color-warning);
    color: var(--color-warning);
  }

  .variant-warning:hover:not(:disabled) {
    background-color: var(--color-warning-bg);
    border-color: var(--color-warning);
  }

  .variant-error {
    background-color: var(--color-surface, var(--color-bg-primary));
    border-color: var(--color-error);
    color: var(--color-error);
  }

  .variant-error:hover:not(:disabled) {
    background-color: var(--color-error-bg);
    border-color: var(--color-error);
  }

  /* ========== TAILLES DE BOUTON ========== */
  .size-small {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
    gap: var(--spacing-xs);
  }

  .size-medium {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-base);
    gap: var(--spacing-sm);
  }

  .size-large {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-lg);
    gap: var(--spacing-sm);
  }

  /* Mode compact (icon-only) */
  .action-button.compact {
    padding: var(--spacing-sm);
    border-radius: var(--radius-full);
  }

  .action-button.compact.size-small {
    padding: var(--spacing-xs);
  }

  .action-button.compact.size-large {
    padding: var(--spacing-md);
  }

  /* ========== ÉLÉMENTS DU BOUTON ========== */
  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .label {
    display: inline-block;
  }

  /* Spinner de chargement */
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* ========== MODALE ========== */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.2s ease-out;
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    animation: slideIn 0.3s ease-out;
  }

  .modal-content {
    background-color: var(--color-bg-primary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--color-border);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
  }

  /* En-tête modale */
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-bg-secondary);
  }

  .modal-header h2 {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    font-family: var(--font-ui);
  }

  .modal-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    color: var(--color-text-secondary);
    transition: all var(--transition-fast);
  }

  .modal-close:hover {
    background-color: var(--color-bg-tertiary, var(--color-bg-secondary));
    color: var(--color-text-primary);
  }

  .modal-close:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
  }

  /* Corps modale */
  .modal-body {
    padding: var(--spacing-lg);
    overflow-y: auto;
    flex: 1;
  }

  /* Pied modale */
  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-border);
    background-color: var(--color-bg-secondary);
  }

  /* ========== BOUTONS DE MODALE ========== */
  .button {
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    font-family: var(--font-ui);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    border: 1px solid transparent;
    transition: all var(--transition-fast);
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: var(--focus-ring-offset);
  }

  .button-primary {
    background-color: var(--color-primary);
    color: var(--color-text-on-primary);
    border-color: var(--color-primary);
  }

  .button-primary:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
    border-color: var(--color-primary-hover);
  }

  .button-secondary {
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    border-color: var(--color-border);
  }

  .button-secondary:hover:not(:disabled) {
    background-color: var(--color-bg-tertiary, var(--color-bg-secondary));
    border-color: var(--color-border-strong, var(--color-border));
  }

  .button-info {
    background-color: var(--color-info);
    color: white;
    border-color: var(--color-info);
  }

  .button-info:hover:not(:disabled) {
    background-color: var(--color-info-dark, var(--color-info));
    border-color: var(--color-info-dark, var(--color-info));
  }

  .button-warning {
    background-color: var(--color-warning);
    color: white;
    border-color: var(--color-warning);
  }

  .button-warning:hover:not(:disabled) {
    background-color: var(--color-warning-dark, var(--color-warning));
    border-color: var(--color-warning-dark, var(--color-warning));
  }

  .button-error {
    background-color: var(--color-error);
    color: white;
    border-color: var(--color-error);
  }

  .button-error:hover:not(:disabled) {
    background-color: var(--color-error-dark, var(--color-error));
    border-color: var(--color-error-dark, var(--color-error));
  }

  /* ========== ANIMATIONS ========== */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  /* ========== ACCESSIBILITÉ ========== */
  @media (prefers-reduced-motion: reduce) {
    .action-button,
    .modal-backdrop,
    .modal {
      animation: none;
      transition: none;
    }

    .action-button:hover:not(:disabled) {
      transform: none;
    }

    .spinner {
      animation: none;
    }
  }

  @media (prefers-contrast: high) {
    .action-button {
      border-width: 2px;
      font-weight: var(--font-weight-bold);
    }
  }

  /* ========== RESPONSIVE ========== */
  @media (max-width: 768px) {
    .modal {
      width: 95%;
      max-width: none;
    }
  }
</style>
