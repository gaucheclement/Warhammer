<script>
  /**
   * Badge Component Test Page
   *
   * Visual test for Badge component with all types
   */

  import Badge from '../components/Badge.svelte';
  import { getBadgeType, hasModifications, getBadgeLabel, formatModificationTimestamp } from '$lib/badgeUtils.js';

  // Test entities
  const testEntities = [
    {
      id: 1,
      name: 'Official Talent',
      description: 'This is an official talent from the rulebook'
    },
    {
      id: 2,
      name: 'Custom Talent',
      description: 'This is a custom user-created talent',
      _meta: {
        isCustom: true,
        created: new Date(Date.now() - 7200000) // 2 hours ago
      }
    },
    {
      id: 3,
      name: 'Modified Talent',
      description: 'This is an official talent that has been modified',
      _meta: {
        isModified: true,
        originalId: 'talent-123',
        modified: new Date(Date.now() - 86400000) // 1 day ago
      }
    },
    {
      id: 4,
      name: 'Deleted Talent',
      description: 'This talent has been soft deleted',
      _meta: {
        isDeleted: true,
        deleted: new Date(Date.now() - 3600000) // 1 hour ago
      }
    }
  ];
</script>

<div class="badge-test">
  <header>
    <h1>Badge Component Test</h1>
    <p>Visual testing of all badge types and utility functions</p>
  </header>

  <section class="test-section">
    <h2>Badge Types</h2>
    <div class="badge-grid">
      <div class="badge-example">
        <h3>Official</h3>
        <Badge type="official" />
        <p class="note">Note: Official badges are hidden by default</p>
      </div>

      <div class="badge-example">
        <h3>Custom</h3>
        <Badge type="custom" />
        <Badge type="custom" minimal={true} />
      </div>

      <div class="badge-example">
        <h3>Modified</h3>
        <Badge type="modified" />
        <Badge type="modified" minimal={true} />
      </div>

      <div class="badge-example">
        <h3>Deleted</h3>
        <Badge type="deleted" />
        <Badge type="deleted" minimal={true} />
      </div>
    </div>
  </section>

  <section class="test-section">
    <h2>Entity Badge Detection</h2>
    <div class="entity-list">
      {#each testEntities as entity}
        <div class="entity-card">
          <div class="entity-header">
            <h3>{entity.name}</h3>
            <Badge type={getBadgeType(entity)} />
          </div>
          <p>{entity.description}</p>
          <div class="entity-meta">
            <p><strong>Badge Type:</strong> {getBadgeLabel(getBadgeType(entity))}</p>
            <p><strong>Has Modifications:</strong> {hasModifications(entity) ? 'Yes' : 'No'}</p>
            {#if entity._meta}
              <p><strong>Modified:</strong> {formatModificationTimestamp(entity)}</p>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section class="test-section">
    <h2>Usage Example</h2>
    <pre><code>{`<script>
  import Badge from '$components/Badge.svelte';
  import { getBadgeType } from '$lib/badgeUtils.js';

  let entity = {
    name: 'Custom Talent',
    _meta: { isCustom: true }
  };
<\/script>

<Badge type={getBadgeType(entity)} />
<Badge type="custom" minimal={true} />`}</code></pre>
  </section>
</div>

<style>
  .badge-test {
    padding: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
  }

  header {
    margin-bottom: var(--spacing-2xl);
  }

  h1 {
    font-family: var(--font-heading);
    font-size: var(--font-size-3xl);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-sm);
  }

  h2 {
    font-family: var(--font-heading);
    font-size: var(--font-size-2xl);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-lg);
  }

  h3 {
    font-family: var(--font-heading);
    font-size: var(--font-size-lg);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-sm);
  }

  p {
    font-family: var(--font-body);
    color: var(--color-text-secondary);
  }

  .test-section {
    margin-bottom: var(--spacing-2xl);
    padding: var(--spacing-lg);
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }

  .badge-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-lg);
  }

  .badge-example {
    padding: var(--spacing-md);
    background-color: var(--color-bg-tertiary);
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .note {
    font-size: var(--font-size-xs);
    font-style: italic;
    color: var(--color-text-tertiary);
  }

  .entity-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .entity-card {
    padding: var(--spacing-md);
    background-color: var(--color-bg-tertiary);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .entity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-sm);
  }

  .entity-meta {
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border);
    font-size: var(--font-size-sm);
  }

  .entity-meta p {
    margin: var(--spacing-xs) 0;
  }

  pre {
    background-color: var(--color-bg-tertiary);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    overflow-x: auto;
    border: 1px solid var(--color-border);
  }

  code {
    font-family: 'Courier New', monospace;
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
  }

  @media (max-width: 768px) {
    .badge-test {
      padding: var(--spacing-md);
    }

    .badge-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
