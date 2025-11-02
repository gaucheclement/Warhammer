<script>
  /**
   * DescriptionSection Component
   *
   * Conteneur générique de section avec titre optionnel.
   * Utilisé pour organiser les descriptions en sections logiques.
   *
   * @prop {string} [title] - Titre optionnel de la section
   * @slot - Contenu de la section
   */

  // Props
  export let title = null;
</script>

<div class="description-section">
  {#if title}
    <h3 class="description-section__title">{title}</h3>
  {/if}
  <div class="description-section__content">
    <slot />
  </div>
</div>

<style>
  /* ========================================================================
     BEM Component: description-section
     ======================================================================== */

  .description-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md, 1rem);
    margin-bottom: var(--spacing-lg, 1.5rem);
  }

  .description-section:last-child {
    margin-bottom: 0;
  }

  .description-section__title {
    margin: 0;
    font-size: var(--font-size-lg, 1.125rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #e8e0d5);
    font-family: var(--font-heading, 'Cinzel', serif);
    line-height: 1.3;
    border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
    padding-bottom: var(--spacing-sm, 0.5rem);
  }

  .description-section__content {
    color: var(--color-text-primary, #e8e0d5);
    line-height: 1.6;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .description-section {
      gap: var(--spacing-sm, 0.5rem);
      margin-bottom: var(--spacing-md, 1rem);
    }

    .description-section__title {
      font-size: var(--font-size-base, 1rem);
    }
  }
</style>
