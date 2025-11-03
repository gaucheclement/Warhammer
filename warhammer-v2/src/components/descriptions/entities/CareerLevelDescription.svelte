<script>
  /**
   * CareerLevelDescription Component
   *
   * Affiche les métadonnées d'un niveau de carrière.
   * Note: Ce composant gère les métadonnées de tab_actif et careerLevel
   * provenant de generateCareerLevelDescription()
   *
   * @prop {Object} data - Données structurées { sections: [...], metadata: {...} }
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
  <div class="career-level-description">
    {#each data.sections as section}
      {#if section.type === 'text'}
        <DescriptionSection title={section.label}>
          <div class="career-level-description__text">{@html section.content}</div>
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
     BEM Component: career-level-description
     ======================================================================== */

  .career-level-description {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md, 1rem);
  }

  .career-level-description__text {
    color: var(--color-text-primary, #e8e0d5);
    line-height: 1.6;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .career-level-description {
      gap: var(--spacing-sm, 0.5rem);
    }
  }
</style>
