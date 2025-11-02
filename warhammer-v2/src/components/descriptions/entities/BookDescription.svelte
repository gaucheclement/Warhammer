<script>
  /**
   * BookDescription Component
   *
   * Affiche la description d'un livre source avec structure multi-onglets.
   * Onglets: Info (abréviation, langue, description) + Contenu (entités du livre)
   *
   * @prop {Object} data - Données structurées { sections: [...] }
   * @event navigate - Émis lors du clic sur un lien avec {type, id}
   */

  import { createEventDispatcher } from 'svelte';
  import EntityLink from '../base/EntityLink.svelte';
  import DescriptionSection from '../base/DescriptionSection.svelte';
  import DescriptionList from '../base/DescriptionList.svelte';

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
  <div class="book-description">
    {#each data.sections as section}
      {#if section.type === 'tab'}
        <!-- Onglet avec contenu imbriqué -->
        <div class="book-description__tab" data-tab={section.tabKey}>
          <div class="book-description__tab-header">
            <h3 class="book-description__tab-title">{section.tabLabel}</h3>
          </div>
          <div class="book-description__tab-content">
            {#each section.sections as subsection}
              {#if subsection.type === 'text'}
                <DescriptionSection title={subsection.label}>
                  <div class="book-description__text">{@html subsection.content}</div>
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
          <div class="book-description__text">{@html section.content}</div>
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
     BEM Component: book-description
     ======================================================================== */

  .book-description {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg, 1.5rem);
  }

  .book-description__tab {
    border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
    border-radius: var(--radius-md, 8px);
    padding: var(--spacing-md, 1rem);
    background-color: var(--color-bg-secondary, #2a221a);
  }

  .book-description__tab-header {
    margin-bottom: var(--spacing-md, 1rem);
    padding-bottom: var(--spacing-sm, 0.5rem);
    border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
  }

  .book-description__tab-title {
    margin: 0;
    font-size: var(--font-size-lg, 1.125rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #e8e0d5);
    font-family: var(--font-heading, 'Cinzel', serif);
  }

  .book-description__tab-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md, 1rem);
  }

  .book-description__text {
    color: var(--color-text-primary, #e8e0d5);
    line-height: 1.6;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .book-description {
      gap: var(--spacing-md, 1rem);
    }

    .book-description__tab {
      padding: var(--spacing-sm, 0.5rem);
    }

    .book-description__tab-header {
      margin-bottom: var(--spacing-sm, 0.5rem);
    }

    .book-description__tab-title {
      font-size: var(--font-size-base, 1rem);
    }

    .book-description__tab-content {
      gap: var(--spacing-sm, 0.5rem);
    }
  }
</style>
