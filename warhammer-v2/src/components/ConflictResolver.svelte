<script>
  /**
   * ConflictResolver Component
   *
   * Provides a UI for resolving conflicts when importing modifications.
   * Shows side-by-side comparison of existing vs imported entities and allows
   * users to choose resolution strategy for each conflict.
   *
   * @prop {Object} conflicts - Conflicts object from detectConflicts()
   * @prop {Function} onResolve - Callback when user confirms resolutions
   * @prop {Function} onCancel - Callback when user cancels
   */

  import { getIcon } from '../lib/icons.js';
  import { compareEntities } from '../lib/importModifications.js';
  import Badge from './Badge.svelte';

  export let conflicts = null;
  export let onResolve = () => {};
  export let onCancel = () => {};

  // Resolution state for each conflict (key: entityId, value: 'keep' | 'overwrite' | 'merge')
  let resolutions = {};

  // Current entity type being viewed
  let currentEntityType = null;

  // Current conflict index within the entity type
  let currentConflictIndex = 0;

  // Expanded state for field details
  let expandedSections = {
    existing: true,
    imported: true,
    differences: true
  };

  // Initialize on mount
  $: if (conflicts && conflicts.conflicts) {
    // Initialize resolutions with default 'keep' for all conflicts
    const entityTypes = Object.keys(conflicts.conflicts);
    if (entityTypes.length > 0 && !currentEntityType) {
      currentEntityType = entityTypes[0];
    }

    // Initialize all resolutions to 'keep' by default
    for (const entityType of entityTypes) {
      for (const conflict of conflicts.conflicts[entityType]) {
        if (!resolutions[conflict.id]) {
          resolutions[conflict.id] = conflict.resolution || 'keep';
        }
      }
    }
  }

  // Get current conflict
  $: currentConflict = currentEntityType && conflicts?.conflicts[currentEntityType]
    ? conflicts.conflicts[currentEntityType][currentConflictIndex]
    : null;

  // Get all entity types with conflicts
  $: entityTypes = conflicts ? Object.keys(conflicts.conflicts || {}) : [];

  // Get current entity type conflicts
  $: currentEntityConflicts = currentEntityType && conflicts?.conflicts
    ? conflicts.conflicts[currentEntityType] || []
    : [];

  // Compare current entities
  $: differences = currentConflict
    ? compareEntities(currentConflict.existing, currentConflict.imported)
    : null;

  /**
   * Set resolution for current conflict
   */
  function setResolution(resolution) {
    if (currentConflict) {
      resolutions[currentConflict.id] = resolution;
      resolutions = { ...resolutions }; // Trigger reactivity
    }
  }

  /**
   * Apply resolution to all conflicts of the same type
   */
  function applyToAllInType(resolution) {
    if (currentEntityType && conflicts?.conflicts[currentEntityType]) {
      for (const conflict of conflicts.conflicts[currentEntityType]) {
        resolutions[conflict.id] = resolution;
      }
      resolutions = { ...resolutions }; // Trigger reactivity
    }
  }

  /**
   * Apply resolution to all conflicts globally
   */
  function applyToAll(resolution) {
    for (const entityType of entityTypes) {
      for (const conflict of conflicts.conflicts[entityType]) {
        resolutions[conflict.id] = resolution;
      }
    }
    resolutions = { ...resolutions }; // Trigger reactivity
  }

  /**
   * Navigate to next conflict
   */
  function nextConflict() {
    if (currentConflictIndex < currentEntityConflicts.length - 1) {
      currentConflictIndex++;
    } else {
      // Move to next entity type
      const currentIndex = entityTypes.indexOf(currentEntityType);
      if (currentIndex < entityTypes.length - 1) {
        currentEntityType = entityTypes[currentIndex + 1];
        currentConflictIndex = 0;
      }
    }
  }

  /**
   * Navigate to previous conflict
   */
  function previousConflict() {
    if (currentConflictIndex > 0) {
      currentConflictIndex--;
    } else {
      // Move to previous entity type
      const currentIndex = entityTypes.indexOf(currentEntityType);
      if (currentIndex > 0) {
        currentEntityType = entityTypes[currentIndex - 1];
        const prevConflicts = conflicts.conflicts[currentEntityType] || [];
        currentConflictIndex = prevConflicts.length - 1;
      }
    }
  }

  /**
   * Confirm and apply resolutions
   */
  function handleConfirm() {
    onResolve(resolutions);
  }

  /**
   * Cancel conflict resolution
   */
  function handleCancel() {
    onCancel();
  }

  /**
   * Toggle section expansion
   */
  function toggleSection(section) {
    expandedSections[section] = !expandedSections[section];
    expandedSections = { ...expandedSections }; // Trigger reactivity
  }

  /**
   * Format field value for display
   */
  function formatValue(value) {
    if (value === null || value === undefined) {
      return '(empty)';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }

  /**
   * Get resolution counts
   */
  function getResolutionCounts() {
    const counts = { keep: 0, overwrite: 0, merge: 0 };
    for (const resolution of Object.values(resolutions)) {
      counts[resolution]++;
    }
    return counts;
  }

  $: resolutionCounts = getResolutionCounts();

  /**
   * Get current position info
   */
  $: {
    let totalProcessed = 0;
    let currentPosition = 0;

    for (let i = 0; i < entityTypes.length; i++) {
      const entityType = entityTypes[i];
      const conflictCount = conflicts?.conflicts[entityType]?.length || 0;

      if (entityType === currentEntityType) {
        currentPosition = totalProcessed + currentConflictIndex + 1;
        break;
      }
      totalProcessed += conflictCount;
    }
  }

  $: totalConflicts = conflicts?.totalConflicts || 0;
  $: currentPosition = (() => {
    let pos = 0;
    for (let i = 0; i < entityTypes.length; i++) {
      const entityType = entityTypes[i];
      if (entityType === currentEntityType) {
        return pos + currentConflictIndex + 1;
      }
      pos += (conflicts?.conflicts[entityType]?.length || 0);
    }
    return pos;
  })();

  $: canGoBack = currentPosition > 1;
  $: canGoNext = currentPosition < totalConflicts;
</script>

<div class="conflict-resolver">
  <!-- Header -->
  <div class="header">
    <div class="header-content">
      <h2 class="title">Resolve Import Conflicts</h2>
      <p class="subtitle">
        {totalConflicts} conflict{totalConflicts !== 1 ? 's' : ''} found.
        Choose how to handle each conflict.
      </p>
    </div>
    <button
      class="close-button"
      on:click={handleCancel}
      aria-label="Close"
      title="Close conflict resolver"
    >
      {@html getIcon('close', 'icon-svg', 20)}
    </button>
  </div>

  <!-- Progress -->
  <div class="progress">
    <div class="progress-bar-container">
      <div
        class="progress-bar"
        style="width: {(currentPosition / totalConflicts) * 100}%"
      />
    </div>
    <div class="progress-text">
      Conflict {currentPosition} of {totalConflicts}
    </div>
  </div>

  <!-- Navigation -->
  <div class="navigation">
    <button
      class="nav-button"
      on:click={previousConflict}
      disabled={!canGoBack}
      title="Previous conflict"
    >
      {@html getIcon('chevronLeft', 'icon-svg', 20)}
      <span>Previous</span>
    </button>

    <div class="entity-type-info">
      <span class="entity-type-label">{currentEntityType}</span>
      <span class="entity-conflict-count">
        ({currentConflictIndex + 1} of {currentEntityConflicts.length})
      </span>
    </div>

    <button
      class="nav-button"
      on:click={nextConflict}
      disabled={!canGoNext}
      title="Next conflict"
    >
      <span>Next</span>
      {@html getIcon('chevronRight', 'icon-svg', 20)}
    </button>
  </div>

  {#if currentConflict}
    <!-- Conflict Content -->
    <div class="conflict-content">
      <!-- Resolution Options -->
      <div class="resolution-options">
        <h3 class="section-title">Choose Resolution</h3>

        <div class="resolution-buttons">
          <button
            class="resolution-button"
            class:active={resolutions[currentConflict.id] === 'keep'}
            on:click={() => setResolution('keep')}
            title="Keep your existing version"
          >
            <div class="resolution-icon">
              {@html getIcon('shield', 'icon-svg', 24)}
            </div>
            <div class="resolution-content">
              <div class="resolution-title">Keep Existing</div>
              <div class="resolution-description">
                Ignore the imported version and keep your current data
              </div>
            </div>
            {#if resolutions[currentConflict.id] === 'keep'}
              <div class="resolution-check">
                {@html getIcon('check', 'icon-svg', 20)}
              </div>
            {/if}
          </button>

          <button
            class="resolution-button"
            class:active={resolutions[currentConflict.id] === 'overwrite'}
            on:click={() => setResolution('overwrite')}
            title="Replace with imported version"
          >
            <div class="resolution-icon">
              {@html getIcon('download', 'icon-svg', 24)}
            </div>
            <div class="resolution-content">
              <div class="resolution-title">Use Import</div>
              <div class="resolution-description">
                Replace your current data with the imported version
              </div>
            </div>
            {#if resolutions[currentConflict.id] === 'overwrite'}
              <div class="resolution-check">
                {@html getIcon('check', 'icon-svg', 20)}
              </div>
            {/if}
          </button>

          <button
            class="resolution-button"
            class:active={resolutions[currentConflict.id] === 'merge'}
            on:click={() => setResolution('merge')}
            title="Merge both versions (imported fields override existing)"
          >
            <div class="resolution-icon">
              {@html getIcon('refresh', 'icon-svg', 24)}
            </div>
            <div class="resolution-content">
              <div class="resolution-title">Merge</div>
              <div class="resolution-description">
                Combine both versions (imported fields override existing)
              </div>
            </div>
            {#if resolutions[currentConflict.id] === 'merge'}
              <div class="resolution-check">
                {@html getIcon('check', 'icon-svg', 20)}
              </div>
            {/if}
          </button>
        </div>

        <!-- Apply to Multiple -->
        <div class="bulk-actions">
          <button
            class="bulk-action-button"
            on:click={() => applyToAllInType(resolutions[currentConflict.id])}
            title="Apply this choice to all conflicts in {currentEntityType}"
          >
            Apply to all {currentEntityType}
          </button>
          <button
            class="bulk-action-button"
            on:click={() => applyToAll(resolutions[currentConflict.id])}
            title="Apply this choice to all conflicts"
          >
            Apply to all conflicts
          </button>
        </div>
      </div>

      <!-- Comparison -->
      <div class="comparison">
        <!-- Existing Version -->
        <div class="comparison-section">
          <button
            class="section-header"
            on:click={() => toggleSection('existing')}
          >
            <h3 class="section-title">
              <span class="section-icon">
                {@html getIcon(expandedSections.existing ? 'chevronDown' : 'chevronRight', 'icon-svg', 16)}
              </span>
              Your Existing Version
            </h3>
            <Badge type={currentConflict.existing.isCustom ? 'custom' : 'modified'} />
          </button>

          {#if expandedSections.existing}
            <div class="entity-details">
              {#each Object.entries(currentConflict.existing) as [key, value]}
                {#if key !== '_meta' && key !== 'id'}
                  <div class="field">
                    <div class="field-key">{key}</div>
                    <div class="field-value">{formatValue(value)}</div>
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        </div>

        <!-- Imported Version -->
        <div class="comparison-section">
          <button
            class="section-header"
            on:click={() => toggleSection('imported')}
          >
            <h3 class="section-title">
              <span class="section-icon">
                {@html getIcon(expandedSections.imported ? 'chevronDown' : 'chevronRight', 'icon-svg', 16)}
              </span>
              Imported Version
            </h3>
            <Badge type={currentConflict.imported.isCustom ? 'custom' : 'modified'} />
          </button>

          {#if expandedSections.imported}
            <div class="entity-details">
              {#each Object.entries(currentConflict.imported) as [key, value]}
                {#if key !== '_meta' && key !== 'id'}
                  <div class="field">
                    <div class="field-key">{key}</div>
                    <div class="field-value">{formatValue(value)}</div>
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        </div>

        <!-- Differences -->
        {#if differences}
          <div class="comparison-section full-width">
            <button
              class="section-header"
              on:click={() => toggleSection('differences')}
            >
              <h3 class="section-title">
                <span class="section-icon">
                  {@html getIcon(expandedSections.differences ? 'chevronDown' : 'chevronRight', 'icon-svg', 16)}
                </span>
                Differences ({differences.changed.length + differences.added.length + differences.removed.length})
              </h3>
            </button>

            {#if expandedSections.differences}
              <div class="differences-list">
                {#if differences.changed.length === 0 && differences.added.length === 0 && differences.removed.length === 0}
                  <p class="no-differences">No differences found (entities are identical)</p>
                {:else}
                  {#each differences.changed as diff}
                    <div class="difference changed">
                      <div class="diff-header">
                        <span class="diff-icon">
                          {@html getIcon('edit', 'icon-svg', 16)}
                        </span>
                        <span class="diff-key">{diff.key}</span>
                        <span class="diff-label">Changed</span>
                      </div>
                      <div class="diff-values">
                        <div class="diff-old">
                          <span class="diff-value-label">Existing:</span>
                          <span class="diff-value">{formatValue(diff.oldValue)}</span>
                        </div>
                        <div class="diff-new">
                          <span class="diff-value-label">Import:</span>
                          <span class="diff-value">{formatValue(diff.newValue)}</span>
                        </div>
                      </div>
                    </div>
                  {/each}

                  {#each differences.added as diff}
                    <div class="difference added">
                      <div class="diff-header">
                        <span class="diff-icon">
                          {@html getIcon('plus', 'icon-svg', 16)}
                        </span>
                        <span class="diff-key">{diff.key}</span>
                        <span class="diff-label">Added in Import</span>
                      </div>
                      <div class="diff-value">{formatValue(diff.value)}</div>
                    </div>
                  {/each}

                  {#each differences.removed as diff}
                    <div class="difference removed">
                      <div class="diff-header">
                        <span class="diff-icon">
                          {@html getIcon('minus', 'icon-svg', 16)}
                        </span>
                        <span class="diff-key">{diff.key}</span>
                        <span class="diff-label">Only in Existing</span>
                      </div>
                      <div class="diff-value">{formatValue(diff.value)}</div>
                    </div>
                  {/each}
                {/if}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Footer -->
  <div class="footer">
    <div class="resolution-summary">
      <span class="summary-item">
        Keep: <strong>{resolutionCounts.keep}</strong>
      </span>
      <span class="summary-item">
        Overwrite: <strong>{resolutionCounts.overwrite}</strong>
      </span>
      <span class="summary-item">
        Merge: <strong>{resolutionCounts.merge}</strong>
      </span>
    </div>

    <div class="footer-actions">
      <button class="button button-secondary" on:click={handleCancel}>
        Cancel
      </button>
      <button class="button button-primary" on:click={handleConfirm}>
        Apply Resolutions
      </button>
    </div>
  </div>
</div>

<style>
  .conflict-resolver {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 90vh;
    background-color: var(--color-bg-primary);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  /* Header */
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-bg-secondary);
  }

  .header-content {
    flex: 1;
  }

  .title {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    font-family: var(--font-ui);
  }

  .subtitle {
    margin: var(--spacing-xs) 0 0;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .close-button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    color: var(--color-text-secondary);
    transition: all var(--transition-fast);
  }

  .close-button:hover {
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-primary);
  }

  /* Progress */
  .progress {
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
  }

  .progress-bar-container {
    height: 4px;
    background-color: var(--color-bg-tertiary);
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-bottom: var(--spacing-sm);
  }

  .progress-bar {
    height: 100%;
    background-color: var(--color-primary);
    transition: width var(--transition-normal);
  }

  .progress-text {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-align: center;
  }

  /* Navigation */
  .navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-bg-secondary);
  }

  .nav-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .nav-button:hover:not(:disabled) {
    background-color: var(--color-bg-tertiary);
    border-color: var(--color-border-strong);
  }

  .nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .entity-type-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-base);
  }

  .entity-type-label {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  .entity-conflict-count {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }

  /* Conflict Content */
  .conflict-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-lg);
  }

  /* Resolution Options */
  .resolution-options {
    margin-bottom: var(--spacing-xl);
  }

  .section-title {
    margin: 0 0 var(--spacing-md);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .section-icon {
    display: inline-flex;
    align-items: center;
  }

  .resolution-buttons {
    display: grid;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  .resolution-button {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: var(--spacing-md);
    align-items: center;
    padding: var(--spacing-md);
    background-color: var(--color-bg-secondary);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
  }

  .resolution-button:hover {
    border-color: var(--color-border-strong);
    background-color: var(--color-bg-tertiary);
  }

  .resolution-button.active {
    border-color: var(--color-primary);
    background-color: var(--color-primary-bg);
  }

  .resolution-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    background-color: var(--color-bg-primary);
    color: var(--color-primary);
  }

  .resolution-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .resolution-title {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  .resolution-description {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .resolution-check {
    display: flex;
    align-items: center;
    color: var(--color-primary);
  }

  /* Bulk Actions */
  .bulk-actions {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }

  .bulk-action-button {
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .bulk-action-button:hover {
    background-color: var(--color-bg-tertiary);
    border-color: var(--color-border-strong);
    color: var(--color-text-primary);
  }

  /* Comparison */
  .comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }

  .comparison-section {
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .comparison-section.full-width {
    grid-column: 1 / -1;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--spacing-md);
    background-color: var(--color-bg-tertiary);
    border: none;
    border-bottom: 1px solid var(--color-border);
    cursor: pointer;
    transition: background-color var(--transition-fast);
    text-align: left;
  }

  .section-header:hover {
    background-color: var(--color-bg-secondary);
  }

  .entity-details {
    padding: var(--spacing-md);
    max-height: 400px;
    overflow-y: auto;
  }

  .field {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--color-border);
  }

  .field:last-child {
    border-bottom: none;
  }

  .field-key {
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }

  .field-value {
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    word-break: break-word;
    white-space: pre-wrap;
  }

  /* Differences */
  .differences-list {
    padding: var(--spacing-md);
    max-height: 400px;
    overflow-y: auto;
  }

  .no-differences {
    padding: var(--spacing-md);
    text-align: center;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }

  .difference {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-sm);
    border-radius: var(--radius-md);
    border-left: 3px solid;
  }

  .difference:last-child {
    margin-bottom: 0;
  }

  .difference.changed {
    background-color: var(--color-warning-bg);
    border-color: var(--color-warning);
  }

  .difference.added {
    background-color: var(--color-success-bg);
    border-color: var(--color-success);
  }

  .difference.removed {
    background-color: var(--color-error-bg);
    border-color: var(--color-error);
  }

  .diff-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }

  .diff-icon {
    display: flex;
    align-items: center;
  }

  .diff-key {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    flex: 1;
  }

  .diff-label {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    background-color: var(--color-bg-primary);
  }

  .diff-values {
    display: grid;
    gap: var(--spacing-sm);
  }

  .diff-old,
  .diff-new {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .diff-value-label {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
  }

  .diff-value {
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
    word-break: break-word;
    white-space: pre-wrap;
  }

  /* Footer */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-border);
    background-color: var(--color-bg-secondary);
  }

  .resolution-summary {
    display: flex;
    gap: var(--spacing-lg);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .summary-item strong {
    color: var(--color-text-primary);
  }

  .footer-actions {
    display: flex;
    gap: var(--spacing-sm);
  }

  .button {
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    font-family: var(--font-ui);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    border: 1px solid transparent;
    transition: all var(--transition-fast);
  }

  .button-primary {
    background-color: var(--color-primary);
    color: var(--color-text-on-primary);
    border-color: var(--color-primary);
  }

  .button-primary:hover {
    background-color: var(--color-primary-hover);
    border-color: var(--color-primary-hover);
  }

  .button-secondary {
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    border-color: var(--color-border);
  }

  .button-secondary:hover {
    background-color: var(--color-bg-tertiary);
    border-color: var(--color-border-strong);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .comparison {
      grid-template-columns: 1fr;
    }

    .navigation {
      flex-wrap: wrap;
      gap: var(--spacing-sm);
    }

    .entity-type-info {
      order: -1;
      width: 100%;
      justify-content: center;
    }

    .resolution-summary {
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .footer {
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .footer-actions {
      width: 100%;
      justify-content: stretch;
    }

    .footer-actions .button {
      flex: 1;
    }
  }
</style>
