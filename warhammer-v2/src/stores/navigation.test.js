/**
 * Unit Tests for Navigation Store
 * Tests navigation history, back/forward navigation, and circular detection
 *
 * Issue #38 Stream A: Core navigation logic tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
  navigationState,
  currentEntry,
  canNavigateBack,
  canNavigateForward,
  navigateToEntity,
  navigateBack,
  navigateForward,
  getHistory,
  getBreadcrumbs,
  clearHistory,
  jumpToHistoryIndex,
  getNavigationStats
} from './navigation.js';

// Mock data.js (Issue #48 Stream B: Updated from dataStore.js)
vi.mock('./data.js', () => ({
  dataQueries: {
    getById: (type, id) => ({
      name: `Mock ${type} ${id}`,
      id: id
    })
  }
}));

describe('Navigation Store', () => {
  beforeEach(() => {
    clearHistory();
  });

  describe('Initial State', () => {
    it('should have empty history initially', () => {
      const state = get(navigationState);
      expect(state.history).toEqual([]);
      expect(state.currentIndex).toBe(-1);
    });

    it('should have null current entry initially', () => {
      const entry = get(currentEntry);
      expect(entry).toBeNull();
    });

    it('should not allow navigation back or forward initially', () => {
      expect(get(canNavigateBack)).toBe(false);
      expect(get(canNavigateForward)).toBe(false);
    });
  });

  describe('navigateToEntity', () => {
    it('should add entry to history', () => {
      const result = navigateToEntity('talents', 'talent-1');

      expect(result).toBe(true);
      const state = get(navigationState);
      expect(state.history.length).toBe(1);
      expect(state.history[0].type).toBe('talents');
      expect(state.history[0].id).toBe('talent-1');
      expect(state.history[0].label).toContain('Mock');
      expect(state.history[0].timestamp).toBeGreaterThan(0);
      expect(state.currentIndex).toBe(0);
    });

    it('should update current entry', () => {
      navigateToEntity('talents', 'talent-1');

      const entry = get(currentEntry);
      expect(entry).not.toBeNull();
      expect(entry.type).toBe('talents');
      expect(entry.id).toBe('talent-1');
    });

    it('should allow navigation back after navigating', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('careers', 'career-1');

      expect(get(canNavigateBack)).toBe(true);
      expect(get(canNavigateForward)).toBe(false);
    });

    it('should not navigate to same entity twice in a row', () => {
      navigateToEntity('talents', 'talent-1');
      const result = navigateToEntity('talents', 'talent-1');

      expect(result).toBe(false);
      const state = get(navigationState);
      expect(state.history.length).toBe(1);
    });

    it('should require type and id parameters', () => {
      const result1 = navigateToEntity(null, 'id');
      const result2 = navigateToEntity('type', null);

      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    it('should truncate forward history when navigating after going back', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('talents', 'talent-2');
      navigateToEntity('talents', 'talent-3');

      navigateBack(); // Go back to talent-2
      navigateToEntity('careers', 'career-1'); // Navigate to new entity

      const state = get(navigationState);
      expect(state.history.length).toBe(3);
      expect(state.history[2].type).toBe('careers');
      expect(state.history[2].id).toBe('career-1');
    });
  });

  describe('FIFO Behavior (Max 50 items)', () => {
    it('should enforce max history size of 50', () => {
      // Add 55 entries
      for (let i = 1; i <= 55; i++) {
        navigateToEntity('talents', `talent-${i}`);
      }

      const state = get(navigationState);
      expect(state.history.length).toBe(50);
      // First entry should be talent-6 (oldest 5 removed)
      expect(state.history[0].id).toBe('talent-6');
      // Last entry should be talent-55
      expect(state.history[49].id).toBe('talent-55');
    });

    it('should maintain current index correctly after FIFO removal', () => {
      // Add 55 entries
      for (let i = 1; i <= 55; i++) {
        navigateToEntity('talents', `talent-${i}`);
      }

      const state = get(navigationState);
      // Current index should point to last item
      expect(state.currentIndex).toBe(49);
      expect(state.history[state.currentIndex].id).toBe('talent-55');
    });
  });

  describe('navigateBack', () => {
    it('should navigate to previous entry', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('talents', 'talent-2');

      const entry = navigateBack();

      expect(entry).not.toBeNull();
      expect(entry.id).toBe('talent-1');
      expect(get(navigationState).currentIndex).toBe(0);
    });

    it('should return null when at beginning of history', () => {
      navigateToEntity('talents', 'talent-1');

      const entry = navigateBack();

      expect(entry).toBeNull();
      expect(get(navigationState).currentIndex).toBe(0);
    });

    it('should allow multiple back navigations', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('talents', 'talent-2');
      navigateToEntity('talents', 'talent-3');

      navigateBack();
      const entry = navigateBack();

      expect(entry.id).toBe('talent-1');
      expect(get(navigationState).currentIndex).toBe(0);
    });
  });

  describe('navigateForward', () => {
    it('should navigate to next entry after going back', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('talents', 'talent-2');
      navigateBack();

      const entry = navigateForward();

      expect(entry).not.toBeNull();
      expect(entry.id).toBe('talent-2');
      expect(get(navigationState).currentIndex).toBe(1);
    });

    it('should return null when at end of history', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('talents', 'talent-2');

      const entry = navigateForward();

      expect(entry).toBeNull();
      expect(get(navigationState).currentIndex).toBe(1);
    });

    it('should allow multiple forward navigations', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('talents', 'talent-2');
      navigateToEntity('talents', 'talent-3');
      navigateBack();
      navigateBack();

      navigateForward();
      const entry = navigateForward();

      expect(entry.id).toBe('talent-3');
      expect(get(navigationState).currentIndex).toBe(2);
    });
  });

  describe('Circular Navigation Detection', () => {
    it('should detect A→B→A→B pattern', () => {
      navigateToEntity('talents', 'talent-A');
      navigateToEntity('talents', 'talent-B');
      navigateToEntity('talents', 'talent-A');
      const result = navigateToEntity('talents', 'talent-B');

      expect(result).toBe(false);
      const state = get(navigationState);
      // Should have 3 entries (blocked 4th)
      expect(state.history.length).toBe(3);
    });

    it('should detect A→B→C→A→B→C pattern', () => {
      navigateToEntity('talents', 'talent-A');
      navigateToEntity('talents', 'talent-B');
      navigateToEntity('talents', 'talent-C');
      navigateToEntity('talents', 'talent-A');
      navigateToEntity('talents', 'talent-B');
      const result = navigateToEntity('talents', 'talent-C');

      expect(result).toBe(false);
      const state = get(navigationState);
      // Should have 5 entries (blocked 6th)
      expect(state.history.length).toBe(5);
    });

    it('should allow non-circular navigation patterns', () => {
      navigateToEntity('talents', 'talent-A');
      navigateToEntity('talents', 'talent-B');
      navigateToEntity('talents', 'talent-C');
      const result = navigateToEntity('talents', 'talent-D');

      expect(result).toBe(true);
      const state = get(navigationState);
      expect(state.history.length).toBe(4);
    });

    it('should allow A→B→A (single return)', () => {
      navigateToEntity('talents', 'talent-A');
      navigateToEntity('talents', 'talent-B');
      const result = navigateToEntity('talents', 'talent-A');

      expect(result).toBe(true);
      const state = get(navigationState);
      expect(state.history.length).toBe(3);
    });
  });

  describe('getHistory', () => {
    it('should return full history in reverse order', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('talents', 'talent-2');
      navigateToEntity('talents', 'talent-3');

      const history = getHistory();

      expect(history.length).toBe(3);
      expect(history[0].id).toBe('talent-3'); // Most recent first
      expect(history[1].id).toBe('talent-2');
      expect(history[2].id).toBe('talent-1');
    });

    it('should limit history when limit specified', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('talents', 'talent-2');
      navigateToEntity('talents', 'talent-3');

      const history = getHistory(2);

      expect(history.length).toBe(2);
      expect(history[0].id).toBe('talent-3');
      expect(history[1].id).toBe('talent-2');
    });
  });

  describe('getBreadcrumbs', () => {
    it('should return last N entries including current', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('talents', 'talent-2');
      navigateToEntity('talents', 'talent-3');
      navigateToEntity('talents', 'talent-4');
      navigateToEntity('talents', 'talent-5');

      const breadcrumbs = getBreadcrumbs(3);

      expect(breadcrumbs.length).toBe(3);
      expect(breadcrumbs[0].id).toBe('talent-3'); // Oldest in breadcrumb
      expect(breadcrumbs[1].id).toBe('talent-4');
      expect(breadcrumbs[2].id).toBe('talent-5'); // Current
    });

    it('should return all entries when count exceeds history', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('talents', 'talent-2');

      const breadcrumbs = getBreadcrumbs(5);

      expect(breadcrumbs.length).toBe(2);
    });

    it('should return empty array when no navigation', () => {
      const breadcrumbs = getBreadcrumbs(5);

      expect(breadcrumbs).toEqual([]);
    });

    it('should return breadcrumbs up to current index', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('talents', 'talent-2');
      navigateToEntity('talents', 'talent-3');
      navigateBack(); // Current index = 1

      const breadcrumbs = getBreadcrumbs(5);

      expect(breadcrumbs.length).toBe(2);
      expect(breadcrumbs[0].id).toBe('talent-1');
      expect(breadcrumbs[1].id).toBe('talent-2');
    });
  });

  describe('jumpToHistoryIndex', () => {
    it('should jump to specific history index', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('talents', 'talent-2');
      navigateToEntity('talents', 'talent-3');

      const entry = jumpToHistoryIndex(1);

      expect(entry).not.toBeNull();
      expect(entry.id).toBe('talent-2');
      expect(get(navigationState).currentIndex).toBe(1);
    });

    it('should return null for invalid index', () => {
      navigateToEntity('talents', 'talent-1');

      const entry = jumpToHistoryIndex(5);

      expect(entry).toBeNull();
      expect(get(navigationState).currentIndex).toBe(0); // Unchanged
    });

    it('should handle negative index', () => {
      navigateToEntity('talents', 'talent-1');

      const entry = jumpToHistoryIndex(-1);

      expect(entry).toBeNull();
    });
  });

  describe('clearHistory', () => {
    it('should clear all history', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('talents', 'talent-2');
      navigateToEntity('talents', 'talent-3');

      clearHistory();

      const state = get(navigationState);
      expect(state.history).toEqual([]);
      expect(state.currentIndex).toBe(-1);
    });

    it('should reset current entry to null', () => {
      navigateToEntity('talents', 'talent-1');
      clearHistory();

      const entry = get(currentEntry);
      expect(entry).toBeNull();
    });
  });

  describe('getNavigationStats', () => {
    it('should return correct statistics', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('talents', 'talent-2');

      const stats = getNavigationStats();

      expect(stats.historySize).toBe(2);
      expect(stats.currentIndex).toBe(1);
      expect(stats.canGoBack).toBe(true);
      expect(stats.canGoForward).toBe(false);
      expect(stats.currentEntry).not.toBeNull();
      expect(stats.currentEntry.id).toBe('talent-2');
      expect(stats.maxHistorySize).toBe(50);
    });

    it('should handle empty history', () => {
      const stats = getNavigationStats();

      expect(stats.historySize).toBe(0);
      expect(stats.currentIndex).toBe(-1);
      expect(stats.canGoBack).toBe(false);
      expect(stats.canGoForward).toBe(false);
      expect(stats.currentEntry).toBeNull();
    });
  });

  describe('Derived Stores', () => {
    it('should update canNavigateBack reactively', () => {
      expect(get(canNavigateBack)).toBe(false);

      navigateToEntity('talents', 'talent-1');
      expect(get(canNavigateBack)).toBe(false);

      navigateToEntity('talents', 'talent-2');
      expect(get(canNavigateBack)).toBe(true);
    });

    it('should update canNavigateForward reactively', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('talents', 'talent-2');

      expect(get(canNavigateForward)).toBe(false);

      navigateBack();
      expect(get(canNavigateForward)).toBe(true);
    });

    it('should update currentEntry reactively', () => {
      navigateToEntity('talents', 'talent-1');
      let entry = get(currentEntry);
      expect(entry.id).toBe('talent-1');

      navigateToEntity('talents', 'talent-2');
      entry = get(currentEntry);
      expect(entry.id).toBe('talent-2');

      navigateBack();
      entry = get(currentEntry);
      expect(entry.id).toBe('talent-1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid navigation', () => {
      for (let i = 0; i < 10; i++) {
        navigateToEntity('talents', `talent-${i}`);
      }

      const state = get(navigationState);
      expect(state.history.length).toBe(10);
      expect(state.currentIndex).toBe(9);
    });

    it('should handle navigation across different entity types', () => {
      navigateToEntity('talents', 'talent-1');
      navigateToEntity('careers', 'career-1');
      navigateToEntity('skills', 'skill-1');

      const state = get(navigationState);
      expect(state.history.length).toBe(3);
      expect(state.history[0].type).toBe('talents');
      expect(state.history[1].type).toBe('careers');
      expect(state.history[2].type).toBe('skills');
    });

    it('should handle back/forward at boundaries', () => {
      navigateToEntity('talents', 'talent-1');

      // Try going back when already at start
      let entry = navigateBack();
      expect(entry).toBeNull();

      // Try going forward when already at end
      entry = navigateForward();
      expect(entry).toBeNull();
    });
  });
});
