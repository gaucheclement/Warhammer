<script>
  /**
   * EntityLink Component
   *
   * Composant de lien cliquable pour naviguer vers une entité.
   * Remplace la fonction showHelpText() qui générait <span class="showHelp">.
   *
   * @prop {string} id - ID de l'entité
   * @prop {string} type - Type d'entité (skill, talent, career, etc.)
   * @prop {string} label - Texte à afficher
   * @prop {string} [tooltip] - Texte optionnel pour l'attribut title
   * @prop {boolean} [broken=false] - Si true, indique une référence cassée
   *
   * @event navigate - Émis lors du clic avec {type, id}
   */

  import { createEventDispatcher } from 'svelte';

  // Props
  export let id;
  export let type;
  export let label;
  export let tooltip = null;
  export let broken = false;

  // Event dispatcher
  const dispatch = createEventDispatcher();

  /**
   * Gestion du clic sur le lien
   */
  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch('navigate', { type, id });
  }

  /**
   * Gestion de la navigation au clavier
   */
  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }
  }
</script>

<span
  class="entity-link"
  class:entity-link--broken={broken}
  role="button"
  tabindex="0"
  title={tooltip}
  on:click={handleClick}
  on:keydown={handleKeydown}
  data-type={type}
  data-id={id}
>
  {label}
</span>

<style>
  /* ========================================================================
     BEM Component: entity-link
     ======================================================================== */

  .entity-link {
    color: var(--color-primary, #8b2e1f);
    text-decoration: underline;
    cursor: pointer;
    transition: color var(--transition-fast, 150ms);
    display: inline;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    line-height: inherit;
  }

  .entity-link:hover {
    color: var(--color-primary-dark, #a63728);
    text-decoration: underline;
  }

  .entity-link:focus-visible {
    outline: var(--focus-ring-width, 2px) solid var(--color-border-focus, #8b2e1f);
    outline-offset: var(--focus-ring-offset, 2px);
    border-radius: var(--radius-sm, 4px);
  }

  .entity-link:active {
    color: var(--color-primary-darker, #6a1f13);
  }

  /* Référence cassée */
  .entity-link--broken {
    color: var(--color-error, #d32f2f);
    text-decoration: line-through;
    cursor: not-allowed;
  }

  .entity-link--broken:hover {
    color: var(--color-error, #d32f2f);
  }

  /* Support du mode réduit de mouvement */
  @media (prefers-reduced-motion: reduce) {
    .entity-link {
      transition: none;
    }
  }

  /* Support du mode haut contraste */
  @media (prefers-contrast: high) {
    .entity-link {
      text-decoration: underline;
      font-weight: var(--font-weight-bold, 600);
    }
  }
</style>
