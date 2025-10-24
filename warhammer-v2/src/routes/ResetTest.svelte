<script>
  /**
   * Reset Functionality Test Page
   *
   * Demonstrates and tests the ResetButton component with all variants
   */

  import ResetButton from '$components/ResetButton.svelte';
  import Badge from '$components/Badge.svelte';
  import { customModifications } from '../stores/data.js';
  import { getBadgeType } from '$lib/badgeUtils.js';
  import { getModificationStats, previewResetAll } from '$lib/resetUtils.js';

  // Mock test data for demonstration
  let testEntities = [
    {
      id: 'test-custom-1',
      name: 'Custom Talent 1',
      description: 'A custom user-created talent',
      _meta: {
        isCustom: true,
        created: new Date().toISOString()
      }
    },
    {
      id: 'test-modified-1',
      name: 'Modified Official Talent',
      description: 'An official talent that was modified',
      _meta: {
        isModified: true,
        modified: new Date().toISOString(),
        originalId: 'official-talent-1'
      }
    },
    {
      id: 'test-official-1',
      name: 'Official Talent',
      description: 'An unmodified official talent'
    }
  ];

  // Stats
  $: stats = getModificationStats();
  $: preview = previewResetAll();

  // Handler for reset callback
  function handleReset(result) {
    console.log('Reset completed:', result);
    // Refresh stats after reset
    stats = getModificationStats();
  }

  // Add test modifications
  function addTestModifications() {
    const current = $customModifications;

    const updated = {
      ...current,
      talents: [
        ...(current.talents || []),
        {
          id: 'test-custom-' + Date.now(),
          name: 'Test Custom Talent',
          description: 'A test custom talent',
          _meta: {
            isCustom: true,
            created: new Date().toISOString()
          }
        }
      ],
      spells: [
        ...(current.spells || []),
        {
          id: 'test-modified-' + Date.now(),
          name: 'Test Modified Spell',
          description: 'A test modified spell',
          _meta: {
            isModified: true,
            modified: new Date().toISOString(),
            originalId: 'official-spell-1'
          }
        }
      ]
    };

    customModifications.set(updated);
  }
</script>

<div class="reset-test-page">
  <header class="page-header">
    <h1>Reset Functionality Test</h1>
    <p class="page-description">
      Test page for the ResetButton component and reset utilities.
    </p>
  </header>

  <div class="content">
    <!-- Statistics Section -->
    <section class="section">
      <h2>Modification Statistics</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Modifications</div>
          <div class="stat-value">{stats.total}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Custom Entities</div>
          <div class="stat-value">{stats.custom}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Modified Entities</div>
          <div class="stat-value">{stats.modified}</div>
        </div>
      </div>

      <div class="actions">
        <button type="button" class="test-button" on:click={addTestModifications}>
          Add Test Modifications
        </button>
      </div>
    </section>

    <!-- Individual Reset Examples -->
    <section class="section">
      <h2>Individual Entity Reset</h2>
      <p class="section-description">
        Reset individual entities back to official data. Custom entities are deleted, modified entities revert to original.
      </p>

      <div class="entity-list">
        {#each testEntities as entity}
          <div class="entity-card">
            <div class="entity-header">
              <div class="entity-info">
                <h3 class="entity-name">{entity.name}</h3>
                <Badge type={getBadgeType(entity)} />
              </div>
              <ResetButton
                variant="individual"
                entityType="talents"
                entityId={entity.id}
                {entity}
                onReset={handleReset}
              />
            </div>
            <p class="entity-description">{entity.description}</p>
          </div>
        {/each}
      </div>

      <h3>Compact Variant</h3>
      <div class="compact-examples">
        {#each testEntities as entity}
          <div class="compact-example">
            <span>{entity.name}</span>
            <ResetButton
              variant="individual"
              entityType="talents"
              entityId={entity.id}
              {entity}
              compact={true}
              onReset={handleReset}
            />
          </div>
        {/each}
      </div>
    </section>

    <!-- Type Reset Examples -->
    <section class="section">
      <h2>Entity Type Reset</h2>
      <p class="section-description">
        Reset all modifications for a specific entity type. This removes all custom and modified entities of that type.
      </p>

      <div class="type-reset-grid">
        <div class="type-card">
          <h3>Talents</h3>
          <div class="type-stats">
            <div>
              {stats.byType.talents?.total || 0} modification(s)
            </div>
            <div class="type-breakdown">
              {stats.byType.talents?.custom || 0} custom, {stats.byType.talents?.modified || 0} modified
            </div>
          </div>
          <ResetButton variant="type" entityType="talents" onReset={handleReset} />
        </div>

        <div class="type-card">
          <h3>Spells</h3>
          <div class="type-stats">
            <div>
              {stats.byType.spells?.total || 0} modification(s)
            </div>
            <div class="type-breakdown">
              {stats.byType.spells?.custom || 0} custom, {stats.byType.spells?.modified || 0} modified
            </div>
          </div>
          <ResetButton variant="type" entityType="spells" onReset={handleReset} />
        </div>

        <div class="type-card">
          <h3>Skills</h3>
          <div class="type-stats">
            <div>
              {stats.byType.skills?.total || 0} modification(s)
            </div>
            <div class="type-breakdown">
              {stats.byType.skills?.custom || 0} custom, {stats.byType.skills?.modified || 0} modified
            </div>
          </div>
          <ResetButton variant="type" entityType="skills" onReset={handleReset} />
        </div>
      </div>
    </section>

    <!-- Bulk Reset Examples -->
    <section class="section">
      <h2>Bulk Reset (All Modifications)</h2>
      <p class="section-description">
        Nuclear option: Reset ALL modifications across all entity types. Use with extreme caution!
      </p>

      <div class="bulk-reset-info">
        <div class="info-card warning">
          <h3>What will be reset:</h3>
          <ul>
            <li>Total modifications: {preview.total}</li>
            <li>Custom entities: {preview.custom}</li>
            <li>Modified entities: {preview.modified}</li>
            {#if preview.total > 0}
              <li>
                Affected types:
                {Object.keys(preview.byType).join(', ')}
              </li>
            {/if}
          </ul>
        </div>
      </div>

      <div class="bulk-reset-actions">
        <ResetButton variant="all" onReset={handleReset} />
      </div>
    </section>

    <!-- Usage Examples -->
    <section class="section">
      <h2>Usage Examples</h2>

      <div class="code-example">
        <h3>Individual Reset</h3>
        <pre><code>&lt;script&gt;
  import ResetButton from '$components/ResetButton.svelte';

  let entity = {'{'}
    id: 'talent-123',
    name: 'Custom Talent',
    _meta: {'{'} isCustom: true {'}'}
  {'}'};
&lt;/script&gt;

&lt;ResetButton
  variant="individual"
  entityType="talents"
  entityId={'{'}entity.id{'}'}
  entity={'{'}entity{'}'}
  onReset={'{'}(result) => console.log('Reset:', result){'}'}
/&gt;</code></pre>
      </div>

      <div class="code-example">
        <h3>Type Reset</h3>
        <pre><code>&lt;ResetButton
  variant="type"
  entityType="talents"
  onReset={'{'}handleReset{'}'}
/&gt;</code></pre>
      </div>

      <div class="code-example">
        <h3>Bulk Reset</h3>
        <pre><code>&lt;ResetButton
  variant="all"
  onReset={'{'}handleReset{'}'}
/&gt;</code></pre>
      </div>

      <div class="code-example">
        <h3>Compact Variant</h3>
        <pre><code>&lt;ResetButton
  variant="individual"
  entityType="talents"
  entityId={'{'}entity.id{'}'}
  entity={'{'}entity{'}'}
  compact={'{'}true{'}'}
/&gt;</code></pre>
      </div>
    </section>
  </div>
</div>

<style>
  .reset-test-page {
    padding: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: var(--spacing-xl);
  }

  .page-header h1 {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
    margin: 0 0 var(--spacing-sm) 0;
  }

  .page-description {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    margin: 0;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .section {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
  }

  .section h2 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
    margin: 0 0 var(--spacing-sm) 0;
  }

  .section-description {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0 0 var(--spacing-lg) 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .stat-card {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    text-align: center;
  }

  .stat-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xs);
  }

  .stat-value {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
  }

  .actions {
    display: flex;
    gap: var(--spacing-md);
  }

  .test-button {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .test-button:hover {
    background-color: var(--color-surface-hover);
    border-color: var(--color-border-hover);
  }

  .entity-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .entity-card {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
  }

  .entity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-sm);
  }

  .entity-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .entity-name {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
    margin: 0;
  }

  .entity-description {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0;
  }

  .compact-examples {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .compact-example {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm);
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
  }

  .type-reset-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-md);
  }

  .type-card {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
  }

  .type-card h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
    margin: 0 0 var(--spacing-sm) 0;
  }

  .type-stats {
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-sm);
    color: var(--color-text);
  }

  .type-breakdown {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    margin-top: var(--spacing-xs);
  }

  .bulk-reset-info {
    margin-bottom: var(--spacing-lg);
  }

  .info-card {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
  }

  .info-card.warning {
    background-color: var(--color-warning-bg);
    border-color: var(--color-warning);
  }

  .info-card h3 {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
    margin: 0 0 var(--spacing-sm) 0;
  }

  .info-card ul {
    margin: 0;
    padding-left: var(--spacing-lg);
    color: var(--color-text);
  }

  .info-card li {
    margin-bottom: var(--spacing-xs);
  }

  .bulk-reset-actions {
    display: flex;
    justify-content: center;
  }

  .code-example {
    margin-bottom: var(--spacing-lg);
  }

  .code-example h3 {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
    margin: 0 0 var(--spacing-sm) 0;
  }

  .code-example pre {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    overflow-x: auto;
    margin: 0;
  }

  .code-example code {
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    color: var(--color-text);
    line-height: 1.6;
  }
</style>
