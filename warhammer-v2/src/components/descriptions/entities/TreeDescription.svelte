<script>
  /**
   * TreeDescription Component (MIGRATED)
   *
   * Affiche la description d'un dossier/arborescence.
   * Sections possibles: type, parent, sous-dossiers, entités
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

<GenericDescription {data} entityType="tree" on:navigate />
