<script>
  import { createEventDispatcher } from 'svelte'

  export let open = true
  export let isMobile = false

  const dispatch = createEventDispatcher()

  // Placeholder menu items - will be populated by actual data
  const menuSections = [
    {
      title: 'Character Creation',
      items: [
        { label: 'New Character', href: '#/creator', icon: 'user-plus' },
        { label: 'Load Character', href: '#/characters', icon: 'folder-open' }
      ]
    },
    {
      title: 'Browse Data',
      items: [
        { label: 'Species', href: '#/browse/species', icon: 'users' },
        { label: 'Careers', href: '#/browse/careers', icon: 'briefcase' },
        { label: 'Skills', href: '#/browse/skills', icon: 'book' },
        { label: 'Talents', href: '#/browse/talents', icon: 'star' },
        { label: 'Spells', href: '#/browse/spells', icon: 'wand' },
        { label: 'Trappings', href: '#/browse/trappings', icon: 'package' }
      ]
    },
    {
      title: 'Reference',
      items: [
        { label: 'Rules', href: '#/rules', icon: 'book-open' },
        { label: 'Glossary', href: '#/glossary', icon: 'list' }
      ]
    }
  ]

  function handleNavClick() {
    dispatch('navigate')
  }

  function getIconPath(iconName) {
    // Simple icon placeholders - will use proper SVG sprites later
    const icons = {
      'user-plus': 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6',
      'folder-open': 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
      'users': 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
      'briefcase': 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
      'book': 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M20 22V2H6.5A2.5 2.5 0 0 0 4 4.5v15',
      'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      'wand': 'M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5',
      'package': 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.3 7l8.7 5 8.7-5M12 22V12',
      'book-open': 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
      'list': 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'
    }
    return icons[iconName] || icons['book']
  }
</script>

<aside class="sidebar" class:open aria-label="Sidebar navigation">
  <div class="sidebar-content">
    {#each menuSections as section}
      <div class="menu-section">
        <h2 class="section-title">{section.title}</h2>
        <nav class="menu-items">
          {#each section.items as item}
            <a
              href={item.href}
              class="menu-item"
              on:click={handleNavClick}
            >
              <svg class="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d={getIconPath(item.icon)} />
              </svg>
              <span class="menu-label">{item.label}</span>
            </a>
          {/each}
        </nav>
      </div>
    {/each}
  </div>
</aside>

<style>
  .sidebar {
    grid-area: sidebar;
    background: var(--color-bg-secondary, #2a221a);
    border-right: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
    overflow-y: auto;
    overflow-x: hidden;
    transition: transform 0.3s ease;
    width: 250px;
  }

  .sidebar:not(.open) {
    transform: translateX(-100%);
  }

  .sidebar-content {
    padding: var(--spacing-md, 1rem);
    min-height: 100%;
  }

  .menu-section {
    margin-bottom: var(--spacing-lg, 1.5rem);
  }

  .section-title {
    margin: 0 0 var(--spacing-sm, 0.5rem) 0;
    padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-secondary, #b8a89a);
    font-family: var(--font-ui, 'Inter', sans-serif);
  }

  .menu-items {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm, 0.5rem);
    padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
    color: var(--color-text-primary, #e8e0d5);
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.2s ease;
    font-family: var(--font-ui, 'Inter', sans-serif);
    font-size: 0.9rem;
    min-height: 44px;
  }

  .menu-item:hover {
    background: var(--color-bg-hover, rgba(255, 255, 255, 0.1));
    color: var(--color-accent, #8b2e1f);
  }

  .menu-item:focus-visible {
    outline: 2px solid var(--color-accent, #8b2e1f);
    outline-offset: -2px;
  }

  .menu-icon {
    flex-shrink: 0;
    color: var(--color-text-secondary, #b8a89a);
    transition: color 0.2s ease;
  }

  .menu-item:hover .menu-icon {
    color: var(--color-accent, #8b2e1f);
  }

  .menu-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Scrollbar styling */
  .sidebar::-webkit-scrollbar {
    width: 6px;
  }

  .sidebar::-webkit-scrollbar-track {
    background: transparent;
  }

  .sidebar::-webkit-scrollbar-thumb {
    background: var(--color-border, rgba(255, 255, 255, 0.2));
    border-radius: 3px;
  }

  .sidebar::-webkit-scrollbar-thumb:hover {
    background: var(--color-border-hover, rgba(255, 255, 255, 0.3));
  }

  /* Mobile layout */
  @media (max-width: 767px) {
    .sidebar {
      position: fixed;
      top: 56px;
      left: 0;
      bottom: 0;
      z-index: 999;
      width: 280px;
      max-width: 80vw;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
    }

    .sidebar:not(.open) {
      transform: translateX(-100%);
    }
  }

  /* Tablet layout */
  @media (min-width: 768px) and (max-width: 1023px) {
    .sidebar {
      width: 220px;
    }
  }

  /* Large desktop layout */
  @media (min-width: 1440px) {
    .sidebar {
      width: 280px;
    }

    .sidebar-content {
      padding: var(--spacing-lg, 1.5rem);
    }

    .menu-item {
      font-size: 0.95rem;
    }
  }
</style>
