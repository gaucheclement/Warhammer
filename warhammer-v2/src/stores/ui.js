/**
 * UI State Store - Manages application UI state
 *
 * This module provides Svelte stores for managing UI-related state like
 * theme, active filters, search queries, and view preferences.
 */

import { writable, derived } from 'svelte/store'

/**
 * @typedef {Object} FilterState
 * @property {string[]} entityTypes - Selected entity types to display
 * @property {string[]} sources - Selected source books
 * @property {string[]} tags - Selected tags
 * @property {boolean} showOfficial - Show official content
 * @property {boolean} showCustom - Show custom modifications
 */

/**
 * Theme preference (dark/light)
 * @type {import('svelte/store').Writable<'dark'|'light'>}
 */
export const theme = writable('dark')

/**
 * Current search query
 * @type {import('svelte/store').Writable<string>}
 */
export const searchQuery = writable('')

/**
 * Active entity type (current view)
 * @type {import('svelte/store').Writable<string|null>}
 */
export const activeEntityType = writable(null)

/**
 * Active filters
 * @type {import('svelte/store').Writable<FilterState>}
 */
export const filters = writable({
  entityTypes: [],
  sources: [],
  tags: [],
  showOfficial: true,
  showCustom: true
})

/**
 * Selected item ID (for detail view)
 * @type {import('svelte/store').Writable<string|number|null>}
 */
export const selectedItemId = writable(null)

/**
 * Admin mode state
 * @type {import('svelte/store').Writable<boolean>}
 */
export const isAdminMode = writable(false)

/**
 * Sidebar collapsed state
 * @type {import('svelte/store').Writable<boolean>}
 */
export const isSidebarCollapsed = writable(false)

/**
 * Current view mode (list/grid/detail)
 * @type {import('svelte/store').Writable<'list'|'grid'|'detail'>}
 */
export const viewMode = writable('list')

/**
 * Toast notification state
 * @type {import('svelte/store').Writable<{message: string, type: 'info'|'success'|'warning'|'error'}|null>}
 */
export const toast = writable(null)

/**
 * Modal state
 * @type {import('svelte/store').Writable<{component: any, props: Object}|null>}
 */
export const modal = writable(null)

/**
 * Loading states for async operations
 * @type {import('svelte/store').Writable<{[key: string]: boolean}>}
 */
export const loadingStates = writable({})

// Load theme from localStorage
if (typeof window !== 'undefined') {
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme === 'dark' || storedTheme === 'light') {
    theme.set(storedTheme)
  } else {
    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.set(prefersDark ? 'dark' : 'light')
  }

  // Load other UI preferences
  const storedFilters = localStorage.getItem('filters')
  if (storedFilters) {
    try {
      filters.set(JSON.parse(storedFilters))
    } catch (e) {
      console.error('Error loading filters:', e)
    }
  }

  const storedViewMode = localStorage.getItem('viewMode')
  if (storedViewMode === 'list' || storedViewMode === 'grid' || storedViewMode === 'detail') {
    viewMode.set(storedViewMode)
  }

  const storedSidebarState = localStorage.getItem('isSidebarCollapsed')
  if (storedSidebarState !== null) {
    isSidebarCollapsed.set(storedSidebarState === 'true')
  }

  // Load description panel width preference
  const storedPanelWidth = localStorage.getItem('descriptionPanelWidth')
  if (storedPanelWidth) {
    const width = parseInt(storedPanelWidth, 10)
    if (!isNaN(width) && width >= 300 && width <= 800) {
      descriptionPanelWidth.set(width)
    }
  }
}

// Subscribe to theme changes and persist
theme.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', value)
    document.documentElement.setAttribute('data-theme', value)
  }
})

// Subscribe to filters changes and persist
filters.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('filters', JSON.stringify(value))
  }
})

// Subscribe to viewMode changes and persist
viewMode.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('viewMode', value)
  }
})

// Subscribe to sidebar state and persist
isSidebarCollapsed.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('isSidebarCollapsed', value.toString())
  }
})

// Subscribe to description panel width and persist
descriptionPanelWidth.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('descriptionPanelWidth', value.toString())
  }
})

/**
 * Toggle theme between dark and light
 * @returns {void}
 */
export function toggleTheme() {
  theme.update((current) => (current === 'dark' ? 'light' : 'dark'))
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {'info'|'success'|'warning'|'error'} type - Type of notification
 * @param {number} duration - Duration in milliseconds (default 3000)
 * @returns {void}
 */
export function showToast(message, type = 'info', duration = 3000) {
  toast.set({ message, type })
  if (duration > 0) {
    setTimeout(() => toast.set(null), duration)
  }
}

/**
 * Close the toast notification
 * @returns {void}
 */
export function closeToast() {
  toast.set(null)
}

/**
 * Open a modal
 * @param {any} component - Svelte component to render
 * @param {Object} props - Props to pass to the component
 * @returns {void}
 */
export function openModal(component, props = {}) {
  modal.set({ component, props })
}

/**
 * Close the modal
 * @returns {void}
 */
export function closeModal() {
  modal.set(null)
}

/**
 * Set a loading state
 * @param {string} key - Identifier for the loading operation
 * @param {boolean} isLoading - Loading state
 * @returns {void}
 */
export function setLoadingState(key, isLoading) {
  loadingStates.update((states) => ({
    ...states,
    [key]: isLoading
  }))
}

/**
 * Toggle sidebar collapsed state
 * @returns {void}
 */
export function toggleSidebar() {
  isSidebarCollapsed.update((collapsed) => !collapsed)
}

/**
 * Toggle admin mode
 * @returns {void}
 */
export function toggleAdminMode() {
  isAdminMode.update((mode) => !mode)
}

/**
 * Reset all filters
 * @returns {void}
 */
export function resetFilters() {
  filters.set({
    entityTypes: [],
    sources: [],
    tags: [],
    showOfficial: true,
    showCustom: true
  })
}

/**
 * Clear search query
 * @returns {void}
 */
export function clearSearch() {
  searchQuery.set('')
}

/**
 * Open description panel with entity
 * @param {string} entityType - Entity type (talent, skill, spell, etc.)
 * @param {string} entityId - Entity ID
 * @returns {void}
 */
export function openDescriptionPanel(entityType, entityId) {
  descriptionPanelEntity.set({ type: entityType, id: entityId })
  descriptionPanelOpen.set(true)
}

/**
 * Close description panel
 * @returns {void}
 */
export function closeDescriptionPanel() {
  descriptionPanelOpen.set(false)
  // Keep entity data for potential re-opening
}

/**
 * Toggle description panel
 * @param {string} [entityType] - Entity type (if opening)
 * @param {string} [entityId] - Entity ID (if opening)
 * @returns {void}
 */
export function toggleDescriptionPanel(entityType, entityId) {
  descriptionPanelOpen.update((isOpen) => {
    if (!isOpen && entityType && entityId) {
      descriptionPanelEntity.set({ type: entityType, id: entityId })
      return true
    }
    return !isOpen
  })
}

/**
 * Set description panel width
 * @param {number} width - Width in pixels (300-800)
 * @returns {void}
 */
export function setDescriptionPanelWidth(width) {
  const clampedWidth = Math.max(300, Math.min(800, width))
  descriptionPanelWidth.set(clampedWidth)
}

/**
 * Derived store: is any filter active?
 * @type {import('svelte/store').Readable<boolean>}
 */
export const hasActiveFilters = derived(filters, ($filters) => {
  return (
    $filters.entityTypes.length > 0 ||
    $filters.sources.length > 0 ||
    $filters.tags.length > 0 ||
    !$filters.showOfficial ||
    !$filters.showCustom
  )
})

/**
 * Derived store: is anything loading?
 * @type {import('svelte/store').Readable<boolean>}
 */
export const isLoading = derived(loadingStates, ($states) => {
  return Object.values($states).some((state) => state === true)
})

/**
 * Description panel state (open/closed)
 * @type {import('svelte/store').Writable<boolean>}
 */
export const descriptionPanelOpen = writable(false)

/**
 * Description panel width
 * @type {import('svelte/store').Writable<number>}
 */
export const descriptionPanelWidth = writable(400)

/**
 * Current entity displayed in description panel
 * @type {import('svelte/store').Writable<{type: string, id: string}|null>}
 */
export const descriptionPanelEntity = writable(null)
