<script>
  import { onMount } from 'svelte'
  import { uiSettings } from '../stores/ui.js'

  let settings = {
    theme: 'dark',
    language: 'en',
    fontSize: 'medium',
    autoSave: true,
    notifications: true,
    animationsEnabled: true
  }

  let activeSection = 'appearance'

  const sections = [
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'data', name: 'Data & Privacy', icon: '🔒' },
    { id: 'about', name: 'About', icon: 'ℹ️' }
  ]

  const themes = [
    { id: 'dark', name: 'Dark Theme', description: 'Grim and perilous (default)' },
    { id: 'light', name: 'Light Theme', description: 'Bright and readable' }
  ]

  const fontSizes = [
    { id: 'small', name: 'Small', description: '14px base' },
    { id: 'medium', name: 'Medium', description: '16px base' },
    { id: 'large', name: 'Large', description: '18px base' }
  ]

  onMount(() => {
    // Load settings from store or localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark'
    settings.theme = savedTheme
    applyTheme(savedTheme)
  })

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  function handleThemeChange(theme) {
    settings.theme = theme
    applyTheme(theme)
  }

  function handleFontSizeChange(size) {
    settings.fontSize = size
    // Apply font size changes
    alert('Font size changes will be fully implemented in future tasks')
  }

  function saveSettings() {
    // Save settings to localStorage
    localStorage.setItem('settings', JSON.stringify(settings))
    alert('Settings saved successfully!')
  }

  function resetSettings() {
    if (confirm('Reset all settings to defaults?')) {
      settings = {
        theme: 'dark',
        language: 'en',
        fontSize: 'medium',
        autoSave: true,
        notifications: true,
        animationsEnabled: true
      }
      applyTheme('dark')
      alert('Settings reset to defaults')
    }
  }

  function handleExportSettings() {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'warhammer-settings.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleImportSettings() {
    alert('Settings import will be implemented in future tasks')
  }
</script>

<div class="settings-page">
  <header class="page-header">
    <h1>Settings</h1>
    <p class="subtitle">Customize your Warhammer Fantasy experience</p>
  </header>

  <div class="settings-layout">
    <aside class="settings-sidebar">
      {#each sections as section}
        <button
          class="section-btn"
          class:active={activeSection === section.id}
          on:click={() => activeSection = section.id}
        >
          <span class="section-icon">{section.icon}</span>
          <span class="section-name">{section.name}</span>
        </button>
      {/each}
    </aside>

    <main class="settings-content">
      {#if activeSection === 'appearance'}
        <div class="settings-section">
          <h2>Appearance</h2>
          <p class="section-description">Customize the visual appearance of the application</p>

          <div class="setting-group">
            <h3>Theme</h3>
            <p class="setting-description">Choose between dark and light themes</p>
            <div class="theme-options">
              {#each themes as theme}
                <div
                  class="theme-card"
                  class:selected={settings.theme === theme.id}
                  on:click={() => handleThemeChange(theme.id)}
                  on:keydown={(e) => e.key === 'Enter' && handleThemeChange(theme.id)}
                  tabindex="0"
                  role="button"
                >
                  <h4>{theme.name}</h4>
                  <p>{theme.description}</p>
                </div>
              {/each}
            </div>
          </div>

          <div class="setting-group">
            <h3>Font Size</h3>
            <p class="setting-description">Adjust the base font size for better readability</p>
            <div class="font-size-options">
              {#each fontSizes as size}
                <button
                  class="size-btn"
                  class:selected={settings.fontSize === size.id}
                  on:click={() => handleFontSizeChange(size.id)}
                >
                  {size.name}
                  <span class="size-description">{size.description}</span>
                </button>
              {/each}
            </div>
          </div>
        </div>
      {:else if activeSection === 'preferences'}
        <div class="settings-section">
          <h2>Preferences</h2>
          <p class="section-description">Configure application behavior and features</p>

          <div class="setting-group">
            <div class="checkbox-setting">
              <input
                type="checkbox"
                id="auto-save"
                bind:checked={settings.autoSave}
              />
              <label for="auto-save">
                <span class="setting-name">Auto-save</span>
                <span class="setting-hint">Automatically save changes as you work</span>
              </label>
            </div>

            <div class="checkbox-setting">
              <input
                type="checkbox"
                id="notifications"
                bind:checked={settings.notifications}
              />
              <label for="notifications">
                <span class="setting-name">Notifications</span>
                <span class="setting-hint">Show toast notifications for important events</span>
              </label>
            </div>

            <div class="checkbox-setting">
              <input
                type="checkbox"
                id="animations"
                bind:checked={settings.animationsEnabled}
              />
              <label for="animations">
                <span class="setting-name">Enable Animations</span>
                <span class="setting-hint">Use smooth transitions and animations</span>
              </label>
            </div>
          </div>
        </div>
      {:else if activeSection === 'data'}
        <div class="settings-section">
          <h2>Data & Privacy</h2>
          <p class="section-description">Manage your data and privacy settings</p>

          <div class="setting-group">
            <h3>Export & Import</h3>
            <div class="action-buttons">
              <button class="btn btn-secondary" on:click={handleExportSettings}>
                Export Settings
              </button>
              <button class="btn btn-secondary" on:click={handleImportSettings}>
                Import Settings
              </button>
            </div>
          </div>

          <div class="setting-group">
            <h3>Storage Information</h3>
            <p class="storage-info">
              All data is stored locally in your browser using IndexedDB. No data is sent to external servers.
            </p>
          </div>
        </div>
      {:else if activeSection === 'about'}
        <div class="settings-section">
          <h2>About</h2>
          <p class="section-description">Information about this application</p>

          <div class="about-card">
            <h3>Warhammer Fantasy Roleplay 4e</h3>
            <p class="version">Version 2.0.0</p>
            <p class="about-text">
              A comprehensive character management and reference tool for Warhammer Fantasy Roleplay 4th Edition.
              Built with Svelte and designed to work as a single-file progressive web application.
            </p>
            <div class="about-links">
              <a href="https://github.com/gaucheclement/Warhammer" target="_blank" rel="noopener noreferrer" class="link-btn">
                View on GitHub
              </a>
            </div>
          </div>

          <div class="credits">
            <h3>Credits</h3>
            <p>Warhammer Fantasy Roleplay is copyright of Games Workshop and Cubicle 7 Entertainment.</p>
            <p>This is an unofficial fan-made tool.</p>
          </div>
        </div>
      {/if}
    </main>
  </div>

  <div class="settings-actions">
    <button class="btn btn-secondary" on:click={resetSettings}>
      Reset to Defaults
    </button>
    <button class="btn btn-primary" on:click={saveSettings}>
      Save Settings
    </button>
  </div>
</div>

<style>
  .settings-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .page-header h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .subtitle {
    color: var(--color-text-secondary, #666);
    margin: 0;
  }

  .settings-layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .settings-sidebar {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .section-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--color-bg-secondary, #f5f5f5);
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    color: var(--color-text-primary, #333);
    transition: all 0.2s;
    text-align: left;
  }

  .section-btn:hover {
    background: var(--color-bg-tertiary, #e5e5e5);
  }

  .section-btn.active {
    background: var(--color-accent, #8b2e1f);
    color: white;
    border-color: var(--color-accent, #8b2e1f);
  }

  .section-icon {
    font-size: 1.5rem;
  }

  .section-name {
    font-weight: 600;
  }

  .settings-content {
    background: var(--color-bg-secondary, #f5f5f5);
    padding: 2rem;
    border-radius: 8px;
    min-height: 500px;
  }

  .settings-section h2 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .section-description {
    color: var(--color-text-secondary, #666);
    margin: 0 0 2rem 0;
  }

  .setting-group {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .setting-group:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .setting-group h3 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-size: 1.1rem;
  }

  .setting-description {
    color: var(--color-text-secondary, #666);
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
  }

  .theme-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .theme-card {
    padding: 1.5rem;
    background: var(--color-bg-primary, white);
    border: 2px solid var(--color-border, #ddd);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .theme-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .theme-card.selected {
    border-color: var(--color-accent, #8b2e1f);
    background: var(--color-accent-light, #fef5f4);
  }

  .theme-card h4 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
  }

  .theme-card p {
    margin: 0;
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
  }

  .font-size-options {
    display: flex;
    gap: 1rem;
  }

  .size-btn {
    flex: 1;
    padding: 1rem;
    background: var(--color-bg-primary, white);
    border: 2px solid var(--color-border, #ddd);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .size-btn:hover {
    border-color: var(--color-accent, #8b2e1f);
  }

  .size-btn.selected {
    border-color: var(--color-accent, #8b2e1f);
    background: var(--color-accent-light, #fef5f4);
  }

  .size-description {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #666);
  }

  .checkbox-setting {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    background: var(--color-bg-primary, white);
    border-radius: 8px;
    margin-bottom: 0.75rem;
  }

  .checkbox-setting input[type="checkbox"] {
    margin-top: 0.25rem;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .checkbox-setting label {
    flex: 1;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .setting-name {
    font-weight: 600;
    color: var(--color-text-primary, #333);
  }

  .setting-hint {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #666);
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .storage-info {
    padding: 1rem;
    background: var(--color-bg-primary, white);
    border-left: 4px solid var(--color-accent, #8b2e1f);
    border-radius: 4px;
    color: var(--color-text-secondary, #666);
    line-height: 1.6;
  }

  .about-card {
    background: var(--color-bg-primary, white);
    padding: 2rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .about-card h3 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
  }

  .version {
    color: var(--color-text-secondary, #666);
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
  }

  .about-text {
    line-height: 1.6;
    color: var(--color-text-secondary, #666);
    margin-bottom: 1.5rem;
  }

  .about-links {
    display: flex;
    gap: 1rem;
  }

  .link-btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: var(--color-accent, #8b2e1f);
    color: white;
    text-decoration: none;
    border-radius: 6px;
    transition: background 0.2s;
  }

  .link-btn:hover {
    background: var(--color-accent-hover, #a63728);
  }

  .credits {
    background: var(--color-bg-primary, white);
    padding: 1.5rem;
    border-radius: 8px;
  }

  .credits h3 {
    margin: 0 0 1rem 0;
    color: var(--color-text-primary, #333);
  }

  .credits p {
    margin: 0.5rem 0;
    color: var(--color-text-secondary, #666);
    font-size: 0.9rem;
  }

  .settings-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding-top: 2rem;
    border-top: 2px solid var(--color-border, #ddd);
  }

  .btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: var(--color-accent, #8b2e1f);
    color: white;
  }

  .btn-primary:hover {
    background: var(--color-accent-hover, #a63728);
  }

  .btn-secondary {
    background: var(--color-bg-secondary, #f5f5f5);
    color: var(--color-text-primary, #333);
    border: 1px solid var(--color-border, #ddd);
  }

  .btn-secondary:hover {
    background: var(--color-bg-tertiary, #e5e5e5);
  }

  @media (max-width: 768px) {
    .settings-page {
      padding: 1rem;
    }

    .page-header h1 {
      font-size: 1.5rem;
    }

    .settings-layout {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .settings-sidebar {
      flex-direction: row;
      overflow-x: auto;
    }

    .section-btn {
      flex-shrink: 0;
    }

    .settings-content {
      padding: 1rem;
    }

    .font-size-options {
      flex-direction: column;
    }

    .settings-actions {
      flex-direction: column;
    }

    .settings-actions .btn {
      width: 100%;
    }
  }
</style>
