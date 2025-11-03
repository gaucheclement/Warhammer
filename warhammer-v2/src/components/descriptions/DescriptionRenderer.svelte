<script>
  /**
   * DescriptionRenderer Component
   *
   * Routes entity types to their specific description components.
   * This component acts as a registry/dispatcher that delegates rendering
   * to the appropriate entity-specific component based on entity type.
   *
   * Uses lazy loading (dynamic imports) to load only the needed component,
   * reducing initial bundle size and improving performance.
   *
   * @prop {string} entityType - Entity type (talent, skill, career, etc.)
   * @prop {Object} data - Structured description data { sections: [...] }
   *
   * @event navigate - Fired when user clicks an entity link
   *   detail: { type: string, id: string }
   */

  import { createEventDispatcher } from 'svelte';

  export let entityType;  // 'talent', 'skill', 'career', etc.
  export let data;        // { sections: [...] }

  const dispatch = createEventDispatcher();

  // Component cache to avoid re-importing
  const componentCache = new Map();

  // Loading state for lazy-loaded component
  let ComponentModule = null;
  let loading = true;
  let loadError = null;

  /**
   * Propagate navigate events from child components
   */
  function handleNavigate(event) {
    dispatch('navigate', event.detail);
  }

  /**
   * Lazy load the component for the given entity type
   * @param {string} type - Entity type
   * @returns {Promise<SvelteComponent>}
   */
  async function loadComponent(type) {
    const normalized = normalizeEntityType(type);

    // Check cache first
    if (componentCache.has(normalized)) {
      return componentCache.get(normalized);
    }

    // Dynamic import map
    const componentMap = {
      'talent': () => import('./entities/TalentDescription.svelte'),
      'skill': () => import('./entities/SkillDescription.svelte'),
      'spell': () => import('./entities/SpellDescription.svelte'),
      'career': () => import('./entities/CareerDescription.svelte'),
      'careerlevel': () => import('./entities/CareerLevelDescription.svelte'),
      'creature': () => import('./entities/CreatureDescription.svelte'),
      'trapping': () => import('./entities/TrappingDescription.svelte'),
      'characteristic': () => import('./entities/CharacteristicDescription.svelte'),
      'class': () => import('./entities/ClassDescription.svelte'),
      'species': () => import('./entities/SpeciesDescription.svelte'),
      'god': () => import('./entities/GodDescription.svelte'),
      'lore': () => import('./entities/LoreDescription.svelte'),
      'book': () => import('./entities/BookDescription.svelte'),
      'tree': () => import('./entities/TreeDescription.svelte'),
      'star': () => import('./entities/StarDescription.svelte'),
      'etat': () => import('./entities/EtatDescription.svelte'),
      'psychologie': () => import('./entities/PsychologieDescription.svelte'),
      'magick': () => import('./entities/MagickDescription.svelte'),
      'quality': () => import('./entities/QualityDescription.svelte'),
      'trait': () => import('./entities/TraitDescription.svelte')
    };

    const loader = componentMap[normalized];

    if (!loader) {
      throw new Error(`Unsupported entity type: ${type}`);
    }

    try {
      const module = await loader();
      const component = module.default;
      componentCache.set(normalized, component);
      return component;
    } catch (err) {
      console.error(`Failed to load component for ${type}:`, err);
      throw err;
    }
  }

  /**
   * Normalize entity type to handle variations
   * (e.g., 'species' vs 'specie', 'careerlevel' vs 'careerLevel')
   */
  function normalizeEntityType(type) {
    if (!type) return '';
    const normalized = type.toLowerCase().trim();

    // Handle special cases
    if (normalized === 'specie' || normalized === 'species') return 'species';
    if (normalized === 'careerlevel' || normalized === 'career_level') return 'careerlevel';

    return normalized;
  }

  // Reactive loading of component when entity type changes
  $: {
    loading = true;
    loadError = null;
    ComponentModule = null;

    loadComponent(entityType)
      .then(component => {
        ComponentModule = component;
        loading = false;
      })
      .catch(err => {
        loadError = err.message;
        loading = false;
      });
  }
</script>

{#if loading}
  <div class="description-renderer__loading" role="status" aria-live="polite">
    <div class="description-renderer__spinner" aria-hidden="true"></div>
    <p>Chargement du composant...</p>
  </div>
{:else if loadError}
  <div class="description-renderer__fallback" role="alert" aria-live="assertive">
    <p class="description-renderer__error">
      Type d'entité non supporté: <strong>{entityType}</strong>
    </p>
    <p class="description-renderer__help">
      Types supportés: talent, skill, spell, career, careerlevel, creature,
      trapping, characteristic, class, species, god, lore, book, tree, star,
      etat, psychologie, magick, quality, trait
    </p>
    <p class="description-renderer__error-detail">
      {loadError}
    </p>
  </div>
{:else if ComponentModule}
  <svelte:component this={ComponentModule} {data} on:navigate={handleNavigate} />
{/if}

<style>
  .description-renderer__fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    gap: var(--spacing-md);
    text-align: center;
  }

  .description-renderer__error {
    margin: 0;
    font-size: var(--font-size-lg);
    color: var(--color-error);
  }

  .description-renderer__help {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  .description-renderer__error-detail {
    margin: var(--spacing-sm) 0 0;
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    font-family: monospace;
  }

  .description-renderer__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    gap: var(--spacing-md);
  }

  .description-renderer__spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
