<script>
  /**
   * CreatureDescription Component
   *
   * Affiche la description d'une créature avec structure multi-onglets.
   * Onglets: Info, Stats (avec table de caractéristiques), Capacités, Sorts, Équipement
   *
   * @prop {Object} data - Données structurées { sections: [...] }
   * @event navigate - Émis lors du clic sur un lien avec {type, id}
   */

  import { createEventDispatcher } from 'svelte';
  import EntityLink from '../base/EntityLink.svelte';
  import DescriptionSection from '../base/DescriptionSection.svelte';
  import DescriptionList from '../base/DescriptionList.svelte';
  import StatTable from '../base/StatTable.svelte';

  // Props
  export let data;

  // Event dispatcher
  const dispatch = createEventDispatcher();

  /**
   * Gestion de la navigation depuis les composants enfants
   */
  function handleNavigate(event) {
    dispatch('navigate', event.detail);
  }
</script>

{#if data && data.sections}
  <div class="creature-description">
    {#each data.sections as section}
      {#if section.type === 'tab'}
        <!-- Onglet avec contenu imbriqué -->
        <div class="creature-description__tab" data-tab={section.tabKey}>
          <div class="creature-description__tab-header">
            <h3 class="creature-description__tab-title">{section.tabLabel}</h3>
          </div>
          <div class="creature-description__tab-content">
            {#each section.sections as subsection}
              {#if subsection.type === 'stats'}
                <!-- Table de caractéristiques -->
                <StatTable stats={subsection.stats} showAdditional={true} />
              {:else if subsection.type === 'text'}
                <DescriptionSection title={subsection.label}>
                  <div class="creature-description__text">{@html subsection.content}</div>
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
        <!-- Table de caractéristiques hors onglet -->
        <StatTable stats={section.stats} showAdditional={true} />
      {:else if section.type === 'text'}
        <DescriptionSection title={section.label}>
          <div class="creature-description__text">{@html section.content}</div>
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
     BEM Component: creature-description
     ======================================================================== */

  .creature-description {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg, 1.5rem);
  }

  .creature-description__tab {
    border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
    border-radius: var(--radius-md, 8px);
    padding: var(--spacing-md, 1rem);
    background-color: var(--color-bg-secondary, #2a221a);
  }

  .creature-description__tab-header {
    margin-bottom: var(--spacing-md, 1rem);
    padding-bottom: var(--spacing-sm, 0.5rem);
    border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
  }

  .creature-description__tab-title {
    margin: 0;
    font-size: var(--font-size-lg, 1.125rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #e8e0d5);
    font-family: var(--font-heading, 'Cinzel', serif);
  }

  .creature-description__tab-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md, 1rem);
  }

  .creature-description__text {
    color: var(--color-text-primary, #e8e0d5);
    line-height: 1.6;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .creature-description {
      gap: var(--spacing-md, 1rem);
    }

    .creature-description__tab {
      padding: var(--spacing-sm, 0.5rem);
    }

    .creature-description__tab-header {
      margin-bottom: var(--spacing-sm, 0.5rem);
    }

    .creature-description__tab-title {
      font-size: var(--font-size-base, 1rem);
    }

    .creature-description__tab-content {
      gap: var(--spacing-sm, 0.5rem);
    }
  }
</style>
