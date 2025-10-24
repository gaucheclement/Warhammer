<script>
  const currentYear = new Date().getFullYear()
</script>

<footer class="footer">
  <div class="footer-content">
    <div class="footer-section">
      <p class="footer-text">
        <strong>Warhammer Fantasy Roleplay 4e</strong> - Character Creation Tool
      </p>
      <p class="footer-legal">
        Warhammer Fantasy Roleplay is a trademark of Games Workshop Limited.
        This is an unofficial fan-made tool for personal use.
      </p>
    </div>

    <div class="footer-section footer-links">
      <a href="#/about" class="footer-link">About</a>
      <span class="separator" aria-hidden="true">|</span>
      <a href="#/help" class="footer-link">Help</a>
      <span class="separator" aria-hidden="true">|</span>
      <a href="#/credits" class="footer-link">Credits</a>
      <span class="separator" aria-hidden="true">|</span>
      <a href="#/privacy" class="footer-link">Privacy</a>
    </div>

    <div class="footer-section footer-info">
      <p class="footer-version">
        Version 2.0.0 | Built with Svelte
      </p>
      <p class="footer-copyright">
        &copy; {currentYear} - Community Project
      </p>
    </div>
  </div>
</footer>

<style>
  .footer {
    grid-area: footer;
    background: var(--color-bg-secondary, #2a221a);
    color: var(--color-text-secondary, #b8a89a);
    border-top: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
    padding: var(--spacing-lg, 1.5rem) var(--spacing-md, 1rem);
    font-family: var(--font-ui, 'Inter', sans-serif);
    font-size: 0.85rem;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md, 1rem);
    align-items: center;
    text-align: center;
  }

  .footer-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs, 0.25rem);
  }

  .footer-text {
    margin: 0;
    color: var(--color-text-primary, #e8e0d5);
  }

  .footer-legal {
    margin: 0;
    font-size: 0.75rem;
    color: var(--color-text-secondary, #b8a89a);
    font-style: italic;
  }

  .footer-links {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-sm, 0.5rem);
  }

  .footer-link {
    color: var(--color-text-secondary, #b8a89a);
    text-decoration: none;
    transition: color 0.2s ease;
    padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
    min-height: 32px;
    display: inline-flex;
    align-items: center;
  }

  .footer-link:hover {
    color: var(--color-accent, #8b2e1f);
    text-decoration: underline;
  }

  .footer-link:focus-visible {
    outline: 2px solid var(--color-accent, #8b2e1f);
    outline-offset: 2px;
    border-radius: 2px;
  }

  .separator {
    color: var(--color-border, rgba(255, 255, 255, 0.2));
  }

  .footer-info {
    gap: var(--spacing-xs, 0.25rem);
  }

  .footer-version,
  .footer-copyright {
    margin: 0;
    font-size: 0.75rem;
    color: var(--color-text-secondary, #b8a89a);
  }

  /* Tablet and larger */
  @media (min-width: 768px) {
    .footer-content {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      text-align: left;
    }

    .footer-section {
      flex: 1;
    }

    .footer-links {
      justify-content: center;
    }

    .footer-info {
      align-items: flex-end;
      text-align: right;
    }
  }

  /* Desktop */
  @media (min-width: 1024px) {
    .footer {
      padding: var(--spacing-xl, 2rem) var(--spacing-lg, 1.5rem);
    }

    .footer-content {
      gap: var(--spacing-xl, 2rem);
    }
  }

  /* Large desktop */
  @media (min-width: 1440px) {
    .footer {
      font-size: 0.9rem;
    }

    .footer-legal {
      font-size: 0.8rem;
    }
  }
</style>
