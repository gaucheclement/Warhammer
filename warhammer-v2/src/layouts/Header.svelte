<script>
  import { createEventDispatcher } from 'svelte'

  export let sidebarOpen = true

  const dispatch = createEventDispatcher()

  function handleMenuClick() {
    dispatch('toggle-sidebar')
  }
</script>

<header class="header">
  <div class="header-left">
    <button
      class="menu-button"
      on:click={handleMenuClick}
      aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      aria-expanded={sidebarOpen}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        {#if sidebarOpen}
          <!-- X icon for close -->
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        {:else}
          <!-- Hamburger menu icon -->
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        {/if}
      </svg>
    </button>

    <div class="logo">
      <h1>Warhammer Fantasy 4e</h1>
    </div>
  </div>

  <nav class="header-nav" aria-label="Main navigation">
    <!-- Placeholder for future navigation items -->
    <!-- SearchBar component will be added by Stream 4 -->
    <div class="nav-items">
      <a href="#/" class="nav-link">Home</a>
      <a href="#/browse" class="nav-link">Browse</a>
      <a href="#/creator" class="nav-link">Creator</a>
    </div>
  </nav>

  <div class="header-right">
    <!-- Theme toggle will be added by Stream 3 -->
    <!-- User menu placeholder -->
    <div class="user-actions">
      <button class="icon-button" aria-label="Settings">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m6-12l-3 3m-3 3l-3 3m12 0l-3-3m-3-3l-3-3m12 6h-6m-6 0H1"></path>
        </svg>
      </button>
    </div>
  </div>
</header>

<style>
  .header {
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
    background: var(--color-bg-secondary, #2a221a);
    color: var(--color-text-primary, #e8e0d5);
    border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
    height: 60px;
    position: sticky;
    top: 0;
    z-index: 999;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-md, 1rem);
  }

  .menu-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
    background: transparent;
    border: none;
    color: var(--color-text-primary, #e8e0d5);
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  .menu-button:hover {
    background: var(--color-bg-hover, rgba(255, 255, 255, 0.1));
  }

  .menu-button:focus-visible {
    outline: 2px solid var(--color-accent, #8b2e1f);
    outline-offset: 2px;
  }

  .logo h1 {
    margin: 0;
    font-size: clamp(1rem, 3vw, 1.5rem);
    font-family: var(--font-heading, 'Cinzel', serif);
    font-weight: 700;
    color: var(--color-text-primary, #e8e0d5);
  }

  .header-nav {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .nav-items {
    display: flex;
    gap: var(--spacing-md, 1rem);
  }

  .nav-link {
    padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
    color: var(--color-text-secondary, #b8a89a);
    text-decoration: none;
    font-family: var(--font-ui, 'Inter', sans-serif);
    font-size: 0.95rem;
    font-weight: 500;
    border-radius: 4px;
    transition: all 0.2s ease;
    min-height: 44px;
    display: flex;
    align-items: center;
  }

  .nav-link:hover {
    color: var(--color-text-primary, #e8e0d5);
    background: var(--color-bg-hover, rgba(255, 255, 255, 0.1));
  }

  .nav-link:focus-visible {
    outline: 2px solid var(--color-accent, #8b2e1f);
    outline-offset: 2px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm, 0.5rem);
  }

  .user-actions {
    display: flex;
    gap: var(--spacing-sm, 0.5rem);
  }

  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
    background: transparent;
    border: none;
    color: var(--color-text-primary, #e8e0d5);
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  .icon-button:hover {
    background: var(--color-bg-hover, rgba(255, 255, 255, 0.1));
  }

  .icon-button:focus-visible {
    outline: 2px solid var(--color-accent, #8b2e1f);
    outline-offset: 2px;
  }

  /* Mobile responsive */
  @media (max-width: 767px) {
    .header {
      padding: var(--spacing-sm, 0.5rem);
      height: 56px;
    }

    .logo h1 {
      font-size: 1rem;
    }

    .nav-items {
      display: none;
    }

    .header-nav {
      display: none;
    }
  }

  /* Tablet responsive */
  @media (min-width: 768px) and (max-width: 1023px) {
    .nav-items {
      gap: var(--spacing-sm, 0.5rem);
    }

    .nav-link {
      font-size: 0.9rem;
      padding: var(--spacing-sm, 0.5rem);
    }
  }
</style>
