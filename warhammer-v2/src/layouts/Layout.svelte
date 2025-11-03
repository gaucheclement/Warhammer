<script>
  import { onMount } from 'svelte'
  import Header from './Header.svelte'
  import Sidebar from './Sidebar.svelte'
  import Footer from './Footer.svelte'
  // Issue #38 Stream D: Import NavigationBar component
  import NavigationBar from '../components/NavigationBar.svelte'

  // Sidebar state management
  let sidebarOpen = true
  let isMobile = false

  onMount(() => {
    // Check if mobile on mount
    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  })

  function checkMobile() {
    const mobile = window.innerWidth < 768
    if (mobile !== isMobile) {
      isMobile = mobile
      // Auto-close sidebar on mobile
      if (isMobile) {
        sidebarOpen = false
      } else {
        sidebarOpen = true
      }
    }
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen
  }

  function closeSidebar() {
    if (isMobile) {
      sidebarOpen = false
    }
  }
</script>

<div class="layout" class:sidebar-open={sidebarOpen}>
  <Header on:toggle-sidebar={toggleSidebar} {sidebarOpen} />

  <Sidebar bind:open={sidebarOpen} {isMobile} on:navigate={closeSidebar} />

  <!-- Backdrop for mobile when sidebar is open -->
  {#if isMobile && sidebarOpen}
    <div class="backdrop" on:click={closeSidebar} role="presentation"></div>
  {/if}

  <!-- Issue #38 Stream D: Navigation Bar for entity navigation -->
  <div class="navigation-bar-container">
    <NavigationBar />
  </div>

  <main class="main-content">
    <slot />
  </main>

  <Footer />
</div>

<style>
  .layout {
    display: grid;
    grid-template-areas:
      "header header"
      "sidebar navbar"
      "sidebar main"
      "footer footer";
    grid-template-columns: 250px 1fr;
    grid-template-rows: auto auto 1fr auto;
    min-height: 100vh;
    transition: grid-template-columns 0.3s ease;
  }

  .layout:not(.sidebar-open) {
    grid-template-columns: 0 1fr;
  }

  /* Issue #38 Stream D: Navigation bar container styling */
  .navigation-bar-container {
    grid-area: navbar;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .main-content {
    grid-area: main;
    padding: var(--spacing-md, 1rem);
    overflow-x: hidden;
    overflow-y: auto;
    background: var(--color-bg-primary, #f5f5f5);
  }

  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Mobile layout */
  @media (max-width: 767px) {
    .layout {
      grid-template-areas:
        "header"
        "navbar"
        "main"
        "footer";
      grid-template-columns: 1fr;
    }

    .layout:not(.sidebar-open) {
      grid-template-columns: 1fr;
    }

    .main-content {
      padding: var(--spacing-sm, 0.5rem);
    }
  }

  /* Tablet layout */
  @media (min-width: 768px) and (max-width: 1023px) {
    .layout {
      grid-template-columns: 220px 1fr;
    }

    .layout:not(.sidebar-open) {
      grid-template-columns: 0 1fr;
    }
  }

  /* Large desktop layout */
  @media (min-width: 1440px) {
    .layout {
      grid-template-columns: 280px 1fr;
    }

    .layout:not(.sidebar-open) {
      grid-template-columns: 0 1fr;
    }
  }
</style>
