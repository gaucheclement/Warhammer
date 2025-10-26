<script>
  import { link } from 'svelte-spa-router'
  import { onMount } from 'svelte'
  import { mergedData } from '../stores/data.js'

  let recentCharacters = []
  let quickStats = {
    totalSpecies: 0,
    totalCareers: 0,
    totalSpells: 0,
    totalTalents: 0
  }

  onMount(() => {
    // Calculate quick stats from merged data
    const data = $mergedData
    quickStats.totalSpecies = data.species?.length || 0
    quickStats.totalCareers = data.careers?.length || 0
    quickStats.totalSpells = data.spells?.length || 0
    quickStats.totalTalents = data.talents?.length || 0
  })
</script>

<div class="home-page">
  <header class="hero">
    <h1>Warhammer Fantasy Roleplay</h1>
    <p class="subtitle">4th Edition Character Manager</p>
  </header>

  <div class="quick-actions">
    <a href="#/creator" use:link class="action-card primary">
      <div class="icon">⚔️</div>
      <h2>Create Character</h2>
      <p>Start building a new character</p>
    </a>

    <a href="#/browse/characters" use:link class="action-card">
      <div class="icon">📖</div>
      <h2>Browse Data</h2>
      <p>Explore species, careers, spells & more</p>
    </a>

    <a href="#/admin" use:link class="action-card">
      <div class="icon">⚙️</div>
      <h2>Admin Panel</h2>
      <p>Manage database and settings</p>
    </a>
  </div>

  <div class="stats-overview">
    <h2>Database Overview</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{quickStats.totalSpecies}</div>
        <div class="stat-label">Species</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{quickStats.totalCareers}</div>
        <div class="stat-label">Careers</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{quickStats.totalSpells}</div>
        <div class="stat-label">Spells</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{quickStats.totalTalents}</div>
        <div class="stat-label">Talents</div>
      </div>
    </div>
  </div>

  {#if recentCharacters.length > 0}
    <div class="recent-characters">
      <h2>Recent Characters</h2>
      <div class="character-list">
        {#each recentCharacters as character}
          <a href="#/character/{character.id}" use:link class="character-card">
            <h3>{character.name}</h3>
            <p>{character.species} - {character.career}</p>
          </a>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .home-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .hero {
    text-align: center;
    padding: 3rem 0;
    margin-bottom: 3rem;
    border-bottom: 2px solid var(--color-border, #ddd);
  }

  .hero h1 {
    font-size: 2.5rem;
    margin: 0 0 1rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .subtitle {
    font-size: 1.25rem;
    color: var(--color-text-secondary, #666);
    margin: 0;
  }

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .action-card {
    display: block;
    padding: 2rem;
    text-align: center;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s;
    border: 2px solid transparent;
  }

  .action-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .action-card.primary {
    background: var(--color-accent, #8b2e1f);
    color: white;
    border-color: var(--color-accent, #8b2e1f);
  }

  .action-card .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .action-card h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
  }

  .action-card p {
    margin: 0;
    opacity: 0.8;
  }

  .stats-overview {
    margin-bottom: 3rem;
  }

  .stats-overview h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--color-text-primary, #333);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .stat-card {
    text-align: center;
    padding: 1.5rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 8px;
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--color-accent, #8b2e1f);
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .recent-characters {
    margin-top: 3rem;
  }

  .recent-characters h2 {
    margin-bottom: 1.5rem;
    color: var(--color-text-primary, #333);
  }

  .character-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .character-card {
    display: block;
    padding: 1.5rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .character-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .character-card h3 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
  }

  .character-card p {
    margin: 0;
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .home-page {
      padding: 1rem;
    }

    .hero h1 {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }

    .quick-actions {
      grid-template-columns: 1fr;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
