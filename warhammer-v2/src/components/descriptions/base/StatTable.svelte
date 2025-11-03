<script>
  /**
   * StatTable Component
   *
   * Affiche une table de caractéristiques pour les créatures et personnages.
   * Utilisé dans les descriptions d'entités pour afficher les valeurs de stats.
   *
   * @prop {Object} stats - Objet contenant les valeurs des caractéristiques
   *   Les clés possibles: m, cc, ct, f, e, i, ag, dex, int, fm, soc, b, bf, be, pv
   * @prop {boolean} [showAdditional=true] - Afficher les stats additionnelles (Blessures, BF, BE, PV)
   */

  // Props
  export let stats;
  export let showAdditional = true;

  // Configuration de l'ordre et labels des caractéristiques principales
  const mainCharOrder = ['m', 'cc', 'ct', 'f', 'e', 'i', 'ag', 'dex', 'int', 'fm', 'soc'];
  const mainCharLabels = ['M', 'CC', 'CT', 'F', 'E', 'I', 'Ag', 'Dex', 'Int', 'FM', 'Soc'];

  // Configuration des stats additionnelles
  const additionalStats = [
    { key: 'b', label: 'Blessures' },
    { key: 'bf', label: 'Bonus de Force' },
    { key: 'be', label: "Bonus d'Endurance" },
    { key: 'pv', label: 'Points de Vie' }
  ];

  /**
   * Récupère la valeur d'une stat ou '-' si non définie
   */
  function getStatValue(key) {
    return stats && stats[key] !== undefined ? stats[key] : '-';
  }

  /**
   * Vérifie si une stat additionnelle existe
   */
  function hasAdditionalStat(key) {
    return stats && stats[key] !== undefined && stats[key] !== null;
  }

  /**
   * Vérifie si au moins une stat additionnelle existe
   */
  $: hasAnyAdditionalStat = showAdditional && additionalStats.some(stat => hasAdditionalStat(stat.key));
</script>

<div class="stat-table">
  <div class="stat-table__main">
    <strong class="stat-table__label">Caractéristiques:</strong>
    <table class="stat-table__grid">
      <thead>
        <tr class="stat-table__row stat-table__row--header">
          {#each mainCharLabels as label}
            <th class="stat-table__header">{label}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        <tr class="stat-table__row stat-table__row--values">
          {#each mainCharOrder as key}
            <td class="stat-table__cell">{getStatValue(key)}</td>
          {/each}
        </tr>
      </tbody>
    </table>
  </div>

  {#if hasAnyAdditionalStat}
    <div class="stat-table__additional">
      {#each additionalStats as stat}
        {#if hasAdditionalStat(stat.key)}
          <div class="stat-table__additional-item">
            <strong class="stat-table__additional-label">{stat.label}:</strong>
            <span class="stat-table__additional-value">{stats[stat.key]}</span>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  /* ========================================================================
     BEM Component: stat-table
     ======================================================================== */

  .stat-table {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md, 1rem);
    margin-bottom: var(--spacing-lg, 1.5rem);
  }

  .stat-table:last-child {
    margin-bottom: 0;
  }

  .stat-table__main {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs, 0.25rem);
  }

  .stat-table__label {
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #e8e0d5);
    font-size: var(--font-size-base, 1rem);
  }

  .stat-table__grid {
    width: 100%;
    border-collapse: collapse;
    background-color: var(--color-bg-secondary, #2a221a);
    border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
    border-radius: var(--radius-md, 8px);
    overflow: hidden;
  }

  .stat-table__row {
    border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
  }

  .stat-table__row:last-child {
    border-bottom: none;
  }

  .stat-table__row--header {
    background-color: var(--color-bg-tertiary, #3a2f25);
  }

  .stat-table__header {
    padding: var(--spacing-sm, 0.5rem) var(--spacing-xs, 0.25rem);
    text-align: center;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #e8e0d5);
    font-size: var(--font-size-sm, 0.875rem);
    border-right: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
    font-family: var(--font-ui, 'Inter', sans-serif);
  }

  .stat-table__header:last-child {
    border-right: none;
  }

  .stat-table__cell {
    padding: var(--spacing-sm, 0.5rem) var(--spacing-xs, 0.25rem);
    text-align: center;
    color: var(--color-text-primary, #e8e0d5);
    font-size: var(--font-size-base, 1rem);
    border-right: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
    font-weight: var(--font-weight-medium, 500);
  }

  .stat-table__cell:last-child {
    border-right: none;
  }

  .stat-table__additional {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs, 0.25rem);
    padding: var(--spacing-sm, 0.5rem);
    background-color: var(--color-bg-secondary, #2a221a);
    border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
    border-radius: var(--radius-md, 8px);
  }

  .stat-table__additional-item {
    display: flex;
    gap: var(--spacing-xs, 0.25rem);
    line-height: 1.5;
  }

  .stat-table__additional-label {
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #e8e0d5);
    font-size: var(--font-size-base, 1rem);
  }

  .stat-table__additional-value {
    color: var(--color-text-primary, #e8e0d5);
    font-size: var(--font-size-base, 1rem);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .stat-table {
      gap: var(--spacing-sm, 0.5rem);
      margin-bottom: var(--spacing-md, 1rem);
    }

    .stat-table__label {
      font-size: var(--font-size-sm, 0.875rem);
    }

    .stat-table__header {
      padding: var(--spacing-xs, 0.25rem);
      font-size: 0.75rem;
    }

    .stat-table__cell {
      padding: var(--spacing-xs, 0.25rem);
      font-size: var(--font-size-sm, 0.875rem);
    }

    .stat-table__additional {
      padding: var(--spacing-xs, 0.25rem);
    }

    .stat-table__additional-label,
    .stat-table__additional-value {
      font-size: var(--font-size-sm, 0.875rem);
    }
  }

  @media (max-width: 480px) {
    .stat-table__header {
      font-size: 0.625rem;
      padding: 2px;
    }

    .stat-table__cell {
      font-size: 0.75rem;
      padding: 2px;
    }
  }
</style>
