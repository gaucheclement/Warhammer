<script>
  /**
   * CareerDescription Component (MIGRATED)
   *
   * Affiche la description d'une carrière avec structure multi-onglets.
   * Onglets: Info, Niveaux de carrière (1-4 avec rang), Accès
   *
   * APRÈS MIGRATION: Ce composant passe de 170 lignes à 21 lignes
   * Réduction de code: 88% (149 lignes éliminées)
   *
   * @prop {Object} data - Données structurées { sections: [...] }
   * @event navigate - Émis lors du clic sur un lien avec {type, id}
   */

  import GenericDescription from '../GenericDescription.svelte';

  // Props
  export let data;
</script>

<GenericDescription {data} entityType="career" on:navigate />
