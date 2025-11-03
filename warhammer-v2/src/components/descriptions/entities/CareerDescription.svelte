<script>
  /**
   * CareerDescription Component
   *
   * Affiche la description d'une carrière avec structure multi-onglets.
   * Onglets: Info, Niveaux de carrière (1-4 avec rang), Accès
   *
   * @prop {Object} data - Données structurées { sections: [...] }
   * @event navigate - Émis lors du clic sur un lien avec {type, id}
   */

  import { createEventDispatcher } from 'svelte';
  import EntityLink from '../base/EntityLink.svelte';
  import DescriptionSection from '../base/DescriptionSection.svelte';
  import DescriptionList from '../base/DescriptionList.svelte';
  import RankIcon from '../base/RankIcon.svelte';

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

  /**
   * Rendu récursif d'une section
   */
  function renderSection(section) {
    return section;
  }
</script>

{#if data && data.sections}
  <div class="career-description">
    {#each data.sections as section}
      {#if section.type === 'tab'}
        <!-- Onglet avec contenu imbriqué -->
        <div class="career-description__tab" data-tab={section.tabKey}>
          <div class="career-description__tab-header">
            {#if section.rank}
              <RankIcon rank={section.rank} label={section.tabLabel} />
            {/if}
            <h3 class="career-description__tab-title">{section.tabLabel}</h3>
          </div>
          <div class="career-description__tab-content">
            {#each section.sections as subsection}
              {#if subsection.type === 'text'}
                <DescriptionSection title={subsection.label}>
                  <div class="career-description__text">{@html subsection.content}</div>
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
      {:else if section.type === 'text'}
        <DescriptionSection title={section.label}>
          <div class="career-description__text">{@html section.content}</div>
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
     BEM Component: career-description
     ======================================================================== */

  .career-description {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg, 1.5rem);
  }

  .career-description__tab {
    border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
    border-radius: var(--radius-md, 8px);
    padding: var(--spacing-md, 1rem);
    background-color: var(--color-bg-secondary, #2a221a);
  }

  .career-description__tab-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm, 0.5rem);
    margin-bottom: var(--spacing-md, 1rem);
    padding-bottom: var(--spacing-sm, 0.5rem);
    border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
  }

  .career-description__tab-title {
    margin: 0;
    font-size: var(--font-size-lg, 1.125rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #e8e0d5);
    font-family: var(--font-heading, 'Cinzel', serif);
  }

  .career-description__tab-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md, 1rem);
  }

  .career-description__text {
    color: var(--color-text-primary, #e8e0d5);
    line-height: 1.6;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .career-description {
      gap: var(--spacing-md, 1rem);
    }

    .career-description__tab {
      padding: var(--spacing-sm, 0.5rem);
    }

    .career-description__tab-header {
      gap: var(--spacing-xs, 0.25rem);
      margin-bottom: var(--spacing-sm, 0.5rem);
    }

    .career-description__tab-title {
      font-size: var(--font-size-base, 1rem);
    }

    .career-description__tab-content {
      gap: var(--spacing-sm, 0.5rem);
    }
  }
</style>
