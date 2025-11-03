<script>
  /**
   * GenericDescription Component
   *
   * Composant générique réutilisable pour afficher n'importe quelle description d'entité.
   * Élimine 95% de duplication entre les 20 composants Description spécifiques.
   *
   * @prop {Object} data - Données structurées { sections: [...] }
   * @prop {string} entityType - Type d'entité pour les classes CSS (ex: 'species', 'book', 'career')
   * @event navigate - Émis lors du clic sur un lien avec {type, id}
   *
   * Slots disponibles:
   * - tab-header-extras: Contenu additionnel dans le header d'un onglet (ex: RankIcon)
   *
   * Types de section supportés:
   * - text: Texte HTML
   * - list: Liste d'items (avec liens optionnels)
   * - link: Lien unique vers une entité
   * - tab: Onglet avec sections imbriquées
   * - stats: Table de caractéristiques (Creature)
   * - rank: Indicateur de rang (Career)
   */

  import { createEventDispatcher } from 'svelte';
  import EntityLink from './base/EntityLink.svelte';
  import DescriptionSection from './base/DescriptionSection.svelte';
  import DescriptionList from './base/DescriptionList.svelte';
  import StatTable from './base/StatTable.svelte';
  import RankIcon from './base/RankIcon.svelte';

  // Props
  export let data;
  export let entityType = 'generic';

  // Event dispatcher
  const dispatch = createEventDispatcher();

  /**
   * Gestion de la navigation depuis les composants enfants
   */
  function handleNavigate(event) {
    dispatch('navigate', event.detail);
  }

  /**
   * Génère les classes CSS BEM pour l'entité
   */
  function getClassNames(type) {
    return {
      root: `${entityType}-description`,
      tab: `${entityType}-description__tab`,
      tabHeader: `${entityType}-description__tab-header`,
      tabTitle: `${entityType}-description__tab-title`,
      tabContent: `${entityType}-description__tab-content`,
      text: `${entityType}-description__text`
    };
  }

  $: classes = getClassNames(entityType);

  /**
   * Rendu récursif d'une section (utilisé pour tabs et sections normales)
   */
  function renderSectionContent(section, isNested = false) {
    return section;
  }
</script>

{#if data && data.sections}
  <div class={classes.root}>
    {#each data.sections as section}
      {#if section.type === 'tab'}
        <!-- Onglet avec contenu imbriqué -->
        <div class={classes.tab} data-tab={section.tabKey}>
          <div class={classes.tabHeader}>
            {#if section.rank}
              <RankIcon rank={section.rank} label={section.tabLabel} />
            {/if}
            <h3 class={classes.tabTitle}>{section.tabLabel}</h3>
            <slot name="tab-header-extras" {section} />
          </div>
          <div class={classes.tabContent}>
            {#each section.sections as subsection}
              {#if subsection.type === 'stats'}
                <!-- Table de caractéristiques (Creature) -->
                <StatTable stats={subsection.stats} showAdditional={true} />
              {:else if subsection.type === 'text'}
                <DescriptionSection title={subsection.label}>
                  <div class={classes.text}>{@html subsection.content}</div>
                </DescriptionSection>
              {:else if subsection.type === 'list'}
                <DescriptionList
                  label={subsection.label}
                  items={subsection.items}
                  on:navigate={handleNavigate}
                />
              {:else if subsection.type === 'link'}
                <DescriptionSection title={subsection.label}>
                  <EntityLink
                    id={subsection.entity.id}
                    type={subsection.entity.type}
                    label={subsection.entity.label}
                    on:navigate={handleNavigate}
                  />
                </DescriptionSection>
              {/if}
            {/each}
          </div>
        </div>
      {:else if section.type === 'stats'}
        <!-- Table de caractéristiques hors onglet (Creature) -->
        <StatTable stats={section.stats} showAdditional={true} />
      {:else if section.type === 'text'}
        <DescriptionSection title={section.label}>
          <div class={classes.text}>{@html section.content}</div>
        </DescriptionSection>
      {:else if section.type === 'list'}
        <DescriptionList
          label={section.label}
          items={section.items}
          on:navigate={handleNavigate}
        />
      {:else if section.type === 'link'}
        <DescriptionSection title={section.label}>
          <EntityLink
            id={section.entity.id}
            type={section.entity.type}
            label={section.entity.label}
            on:navigate={handleNavigate}
          />
        </DescriptionSection>
      {/if}
    {/each}
  </div>
{/if}

<style>
  /* ========================================================================
     BEM Component: generic-description
     Styles génériques qui fonctionnent pour toutes les entités
     Les classes CSS sont générées dynamiquement via entityType
     ======================================================================== */

  /* Styles de base appliqués à toutes les descriptions */
  :global([class$='-description']) {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg, 1.5rem);
  }

  :global([class$='-description__tab']) {
    border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
    border-radius: var(--radius-md, 8px);
    padding: var(--spacing-md, 1rem);
    background-color: var(--color-bg-secondary, #2a221a);
  }

  :global([class$='-description__tab-header']) {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm, 0.5rem);
    margin-bottom: var(--spacing-md, 1rem);
    padding-bottom: var(--spacing-sm, 0.5rem);
    border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
  }

  :global([class$='-description__tab-title']) {
    margin: 0;
    font-size: var(--font-size-lg, 1.125rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #e8e0d5);
    font-family: var(--font-heading, 'Cinzel', serif);
  }

  :global([class$='-description__tab-content']) {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md, 1rem);
  }

  :global([class$='-description__text']) {
    color: var(--color-text-primary, #e8e0d5);
    line-height: 1.6;
  }

  /* Responsive */
  @media (max-width: 768px) {
    :global([class$='-description']) {
      gap: var(--spacing-md, 1rem);
    }

    :global([class$='-description__tab']) {
      padding: var(--spacing-sm, 0.5rem);
    }

    :global([class$='-description__tab-header']) {
      gap: var(--spacing-xs, 0.25rem);
      margin-bottom: var(--spacing-sm, 0.5rem);
    }

    :global([class$='-description__tab-title']) {
      font-size: var(--font-size-base, 1rem);
    }

    :global([class$='-description__tab-content']) {
      gap: var(--spacing-sm, 0.5rem);
    }
  }
</style>
