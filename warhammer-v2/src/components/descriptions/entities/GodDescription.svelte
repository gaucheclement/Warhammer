<script>
  /**
   * GodDescription Component (MIGRATED)
   *
   * Affiche la description d'une divinité.
   * Sections possibles: description, bénédictions, miracles
   *
   * APRÈS MIGRATION: Ce composant passe de 81 lignes à 21 lignes
   * Réduction de code: 74% (60 lignes éliminées)
   *
   * @prop {Object} data - Données structurées { sections: [...] }
   * @event navigate - Émis lors du clic sur un lien avec {type, id}
   */

  import GenericDescription from '../GenericDescription.svelte';

  // Props
  export let data;
</script>

<GenericDescription {data} entityType="god" on:navigate />
