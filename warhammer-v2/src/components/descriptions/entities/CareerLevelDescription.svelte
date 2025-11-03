<script>
  /**
   * CareerLevelDescription Component (MIGRATED)
   *
   * Affiche les métadonnées d'un niveau de carrière.
   * Note: Ce composant gère les métadonnées de tab_actif et careerLevel
   * provenant de generateCareerLevelDescription()
   *
   * APRÈS MIGRATION: Ce composant passe de 82 lignes à 21 lignes
   * Réduction de code: 74% (61 lignes éliminées)
   *
   * @prop {Object} data - Données structurées { sections: [...], metadata: {...} }
   * @event navigate - Émis lors du clic sur un lien avec {type, id}
   */

  import GenericDescription from '../GenericDescription.svelte';

  // Props
  export let data;
</script>

<GenericDescription {data} entityType="career-level" on:navigate />
