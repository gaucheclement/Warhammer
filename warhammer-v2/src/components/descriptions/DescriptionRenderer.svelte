<script>
  /**
   * DescriptionRenderer Component
   *
   * Routes entity types to their specific description components.
   * This component acts as a registry/dispatcher that delegates rendering
   * to the appropriate entity-specific component based on entity type.
   *
   * @prop {string} entityType - Entity type (talent, skill, career, etc.)
   * @prop {Object} data - Structured description data { sections: [...] }
   *
   * @event navigate - Fired when user clicks an entity link
   *   detail: { type: string, id: string }
   */

  import { createEventDispatcher } from 'svelte';

  // Import all 20 entity-specific components
  import TalentDescription from './entities/TalentDescription.svelte';
  import SkillDescription from './entities/SkillDescription.svelte';
  import SpellDescription from './entities/SpellDescription.svelte';
  import CareerDescription from './entities/CareerDescription.svelte';
  import CareerLevelDescription from './entities/CareerLevelDescription.svelte';
  import CreatureDescription from './entities/CreatureDescription.svelte';
  import TrappingDescription from './entities/TrappingDescription.svelte';
  import CharacteristicDescription from './entities/CharacteristicDescription.svelte';
  import ClassDescription from './entities/ClassDescription.svelte';
  import SpeciesDescription from './entities/SpeciesDescription.svelte';
  import GodDescription from './entities/GodDescription.svelte';
  import LoreDescription from './entities/LoreDescription.svelte';
  import BookDescription from './entities/BookDescription.svelte';
  import TreeDescription from './entities/TreeDescription.svelte';
  import StarDescription from './entities/StarDescription.svelte';
  import EtatDescription from './entities/EtatDescription.svelte';
  import PsychologieDescription from './entities/PsychologieDescription.svelte';
  import MagickDescription from './entities/MagickDescription.svelte';
  import QualityDescription from './entities/QualityDescription.svelte';
  import TraitDescription from './entities/TraitDescription.svelte';

  export let entityType;  // 'talent', 'skill', 'career', etc.
  export let data;        // { sections: [...] }

  const dispatch = createEventDispatcher();

  /**
   * Propagate navigate events from child components
   */
  function handleNavigate(event) {
    dispatch('navigate', event.detail);
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

  // Normalize entity type for comparison
  $: normalizedType = normalizeEntityType(entityType);
</script>

{#if normalizedType === 'talent'}
  <TalentDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'skill'}
  <SkillDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'spell'}
  <SpellDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'career'}
  <CareerDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'careerlevel'}
  <CareerLevelDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'creature'}
  <CreatureDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'trapping'}
  <TrappingDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'characteristic'}
  <CharacteristicDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'class'}
  <ClassDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'species'}
  <SpeciesDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'god'}
  <GodDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'lore'}
  <LoreDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'book'}
  <BookDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'tree'}
  <TreeDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'star'}
  <StarDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'etat'}
  <EtatDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'psychologie'}
  <PsychologieDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'magick'}
  <MagickDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'quality'}
  <QualityDescription {data} on:navigate={handleNavigate} />
{:else if normalizedType === 'trait'}
  <TraitDescription {data} on:navigate={handleNavigate} />
{:else}
  <div class="description-renderer__fallback">
    <p class="description-renderer__error">
      Type d'entité non supporté: <strong>{entityType}</strong>
    </p>
    <p class="description-renderer__help">
      Types supportés: talent, skill, spell, career, careerlevel, creature,
      trapping, characteristic, class, species, god, lore, book, tree, star,
      etat, psychologie, magick, quality, trait
    </p>
  </div>
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
</style>
