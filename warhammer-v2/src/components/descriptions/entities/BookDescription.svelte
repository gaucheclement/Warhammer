<script>
  /**
   * BookDescription Component (MIGRATED)
   *
   * Affiche la description d'un livre source avec structure multi-onglets.
   * Onglets: Info (abréviation, langue, description) + Contenu (entités du livre)
   *
   * APRÈS MIGRATION: Ce composant passe de 155 lignes à 21 lignes
   * Réduction de code: 86% (134 lignes éliminées)
   *
   * @prop {Object} data - Données structurées { sections: [...] }
   * @event navigate - Émis lors du clic sur un lien avec {type, id}
   */

  import GenericDescription from '../GenericDescription.svelte';

  // Props
  export let data;
</script>

<GenericDescription {data} entityType="book" on:navigate />
