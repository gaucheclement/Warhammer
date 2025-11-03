<script>
  /**
   * DescriptionList Component
   *
   * Affiche une liste avec un label, remplaçant toHtmlList().
   * Peut contenir des éléments simples ou des liens vers d'autres entités.
   *
   * @prop {string} label - Label de la liste
   * @prop {Array<Object|string>} items - Éléments de la liste
   *   Chaque item peut être:
   *   - Une string simple
   *   - Un objet avec {label, id?, type?}
   *
   * @event navigate - Émis lors du clic sur un lien avec {type, id}
   */

  import { createEventDispatcher } from 'svelte';
  import EntityLink from './EntityLink.svelte';

  // Props
  export let label;
  export let items = [];

  // Event dispatcher
  const dispatch = createEventDispatcher();

  /**
   * Gestion de la navigation depuis un EntityLink
   */
  function handleNavigate(event) {
    dispatch('navigate', event.detail);
  }

  /**
   * Vérifie si un item est un objet avec type (donc cliquable)
   */
  function isClickableItem(item) {
    return typeof item === 'object' && item.type && item.id !== undefined;
  }

  /**
   * Récupère le label d'un item (string ou objet)
   */
  function getItemLabel(item) {
    if (typeof item === 'string') {
      return item;
    }
    return item.label || item.name || item.id || '';
  }
</script>

{#if items && items.length > 0}
  <div class="description-list">
    <strong class="description-list__label">{label}:</strong>
    <ul class="description-list__items">
      {#each items as item}
        <li class="description-list__item">
          {#if isClickableItem(item)}
            <EntityLink
              id={item.id}
              type={item.type}
              label={getItemLabel(item)}
              tooltip={item.tooltip}
              broken={item.broken}
              on:navigate={handleNavigate}
            />
          {:else}
            {getItemLabel(item)}
          {/if}
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  /* ========================================================================
     BEM Component: description-list
     ======================================================================== */

  .description-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs, 0.25rem);
    margin-bottom: var(--spacing-md, 1rem);
  }

  .description-list:last-child {
    margin-bottom: 0;
  }

  .description-list__label {
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #e8e0d5);
    font-size: var(--font-size-base, 1rem);
  }

  .description-list__items {
    list-style: disc;
    margin: 0;
    padding-left: var(--spacing-lg, 1.5rem);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs, 0.25rem);
  }

  .description-list__item {
    color: var(--color-text-primary, #e8e0d5);
    line-height: 1.6;
    font-size: var(--font-size-base, 1rem);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .description-list {
      gap: var(--spacing-xs, 0.25rem);
      margin-bottom: var(--spacing-sm, 0.5rem);
    }

    .description-list__label {
      font-size: var(--font-size-sm, 0.875rem);
    }

    .description-list__items {
      padding-left: var(--spacing-md, 1rem);
    }

    .description-list__item {
      font-size: var(--font-size-sm, 0.875rem);
    }
  }
</style>
