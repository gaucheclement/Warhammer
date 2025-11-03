<script>
  /**
   * CreatureDescription Component (MIGRATED)
   *
   * Affiche la description d'une créature avec structure multi-onglets.
   * Onglets: Info, Stats (avec table de caractéristiques), Capacités, Sorts, Équipement
   *
   * APRÈS MIGRATION: Ce composant passe de 162 lignes à 21 lignes
   * Réduction de code: 87% (141 lignes éliminées)
   *
   * @prop {Object} data - Données structurées { sections: [...] }
   * @event navigate - Émis lors du clic sur un lien avec {type, id}
   */

  import GenericDescription from '../GenericDescription.svelte';

  // Props
  export let data;
</script>

<GenericDescription {data} entityType="creature" on:navigate />
