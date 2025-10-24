<script>
  import { link, location } from 'svelte-spa-router'

  let currentPath = ''

  $: {
    currentPath = $location || window.location.hash.slice(1)
  }

  const suggestions = [
    { path: '/', label: 'Home', description: 'Return to the main page' },
    { path: '/browse/all', label: 'Browse Data', description: 'Explore game content' },
    { path: '/creator', label: 'Character Creator', description: 'Create a new character' },
    { path: '/admin', label: 'Admin Panel', description: 'Manage your database' },
    { path: '/settings', label: 'Settings', description: 'Customize your experience' }
  ]
</script>

<div class="not-found-page">
  <div class="not-found-content">
    <div class="error-code">404</div>

    <h1>Page Not Found</h1>

    <p class="error-message">
      The page you're looking for doesn't exist in the grim darkness of this application.
    </p>

    {#if currentPath}
      <div class="current-path">
        <span class="path-label">Attempted path:</span>
        <code class="path-value">{currentPath}</code>
      </div>
    {/if}

    <div class="suggestions">
      <h2>Where would you like to go?</h2>
      <div class="suggestion-cards">
        {#each suggestions as suggestion}
          <a href="#{suggestion.path}" use:link class="suggestion-card">
            <h3>{suggestion.label}</h3>
            <p>{suggestion.description}</p>
          </a>
        {/each}
      </div>
    </div>

    <div class="actions">
      <a href="#/" use:link class="btn btn-primary">Go to Home</a>
      <button class="btn btn-secondary" on:click={() => window.history.back()}>
        Go Back
      </button>
    </div>
  </div>

  <div class="flavor-text">
    <p>"In the grim darkness of the Old World, there are no signposts..."</p>
  </div>
</div>

<style>
  .not-found-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: var(--color-bg-primary, white);
  }

  .not-found-content {
    max-width: 800px;
    text-align: center;
  }

  .error-code {
    font-size: 8rem;
    font-weight: bold;
    color: var(--color-accent, #8b2e1f);
    line-height: 1;
    margin-bottom: 1rem;
    font-family: var(--font-heading, serif);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }

  h1 {
    font-size: 2.5rem;
    margin: 0 0 1rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .error-message {
    font-size: 1.1rem;
    color: var(--color-text-secondary, #666);
    margin: 0 0 2rem 0;
    line-height: 1.6;
  }

  .current-path {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border-radius: 8px;
    margin-bottom: 3rem;
  }

  .path-label {
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
  }

  .path-value {
    color: var(--color-accent, #8b2e1f);
    background: var(--color-bg-primary, white);
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9rem;
  }

  .suggestions {
    margin: 3rem 0;
  }

  .suggestions h2 {
    font-size: 1.5rem;
    margin: 0 0 1.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .suggestion-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .suggestion-card {
    display: block;
    padding: 1.5rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border: 2px solid transparent;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
    text-align: left;
  }

  .suggestion-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: var(--color-accent, #8b2e1f);
  }

  .suggestion-card h3 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1.1rem;
  }

  .suggestion-card p {
    margin: 0;
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
  }

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-block;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    font-weight: 600;
  }

  .btn-primary {
    background: var(--color-accent, #8b2e1f);
    color: white;
  }

  .btn-primary:hover {
    background: var(--color-accent-hover, #a63728);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 46, 31, 0.3);
  }

  .btn-secondary {
    background: var(--color-bg-secondary, #f5f5f5);
    color: var(--color-text-primary, #333);
    border: 2px solid var(--color-border, #ddd);
  }

  .btn-secondary:hover {
    background: var(--color-bg-tertiary, #e5e5e5);
    border-color: var(--color-text-secondary, #999);
  }

  .flavor-text {
    margin-top: 4rem;
    padding: 1.5rem;
    border-top: 2px solid var(--color-border, #ddd);
    max-width: 600px;
  }

  .flavor-text p {
    margin: 0;
    color: var(--color-text-secondary, #999);
    font-style: italic;
    font-family: var(--font-heading, serif);
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    .not-found-page {
      padding: 1rem;
    }

    .error-code {
      font-size: 5rem;
    }

    h1 {
      font-size: 1.75rem;
    }

    .error-message {
      font-size: 1rem;
    }

    .current-path {
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
    }

    .suggestion-cards {
      grid-template-columns: 1fr;
    }

    .actions {
      flex-direction: column;
      width: 100%;
    }

    .btn {
      width: 100%;
      text-align: center;
    }

    .flavor-text {
      margin-top: 2rem;
    }

    .flavor-text p {
      font-size: 1rem;
    }
  }
</style>
