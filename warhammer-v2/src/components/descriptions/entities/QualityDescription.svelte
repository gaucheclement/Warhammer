<script>
  /**
   * QualityDescription Component
   *
   * Affiche la description d'une qualité d'arme.
   * Sections possibles: type, description
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
  <div class="quality-description">
    {#each data.sections as section}
      {#if section.type === 'text'}
        <DescriptionSection title={section.label}>
          <div class="quality-description__text">{@html section.content}</div>
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
     BEM Component: quality-description
     ======================================================================== */

  .quality-description {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md, 1rem);
  }

  .quality-description__text {
    color: var(--color-text-primary, #e8e0d5);
    line-height: 1.6;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .quality-description {
      gap: var(--spacing-sm, 0.5rem);
    }
  }
</style>
