/**
 * Virtual Scrolling Utilities
 *
 * Provides efficient virtual scrolling calculations for rendering large lists.
 * Only visible rows + buffer are rendered to maintain 60fps performance.
 */

/**
 * Calculate which items should be rendered based on scroll position
 * @param {Object} options - Calculation options
 * @param {number} options.scrollTop - Current scroll position in pixels
 * @param {number} options.containerHeight - Height of the scrollable container
 * @param {number} options.rowHeight - Height of each row in pixels
 * @param {number} options.totalItems - Total number of items in the dataset
 * @param {number} options.overscan - Number of extra rows to render above/below visible area (default: 5)
 * @returns {Object} Render information
 */
export function calculateVisibleRange({
  scrollTop,
  containerHeight,
  rowHeight,
  totalItems,
  overscan = 5
}) {
  // Calculate visible range
  const startIndex = Math.floor(scrollTop / rowHeight)
  const visibleCount = Math.ceil(containerHeight / rowHeight)
  const endIndex = startIndex + visibleCount

  // Add overscan to reduce flickering during fast scrolling
  const overscanStartIndex = Math.max(0, startIndex - overscan)
  const overscanEndIndex = Math.min(totalItems, endIndex + overscan)

  // Calculate the total scrollable height
  const totalHeight = totalItems * rowHeight

  // Calculate offset for positioning the visible items
  const offsetY = overscanStartIndex * rowHeight

  return {
    startIndex: overscanStartIndex,
    endIndex: overscanEndIndex,
    visibleStartIndex: startIndex,
    visibleEndIndex: endIndex,
    totalHeight,
    offsetY,
    visibleCount: overscanEndIndex - overscanStartIndex
  }
}

/**
 * Create a virtual scroll manager for a list
 * @param {Object} options - Manager options
 * @param {number} options.rowHeight - Height of each row
 * @param {number} options.overscan - Overscan count (default: 5)
 * @returns {Object} Virtual scroll manager
 */
export function createVirtualScrollManager({ rowHeight, overscan = 5 }) {
  let containerHeight = 0
  let scrollTop = 0
  let totalItems = 0

  return {
    /**
     * Update scroll state
     * @param {Object} state - New state
     */
    update({
      scrollTop: newScrollTop,
      containerHeight: newContainerHeight,
      totalItems: newTotalItems
    }) {
      if (newScrollTop !== undefined) scrollTop = newScrollTop
      if (newContainerHeight !== undefined) containerHeight = newContainerHeight
      if (newTotalItems !== undefined) totalItems = newTotalItems
    },

    /**
     * Get current visible range
     * @returns {Object} Visible range information
     */
    getVisibleRange() {
      return calculateVisibleRange({
        scrollTop,
        containerHeight,
        rowHeight,
        totalItems,
        overscan
      })
    },

    /**
     * Get total scrollable height
     * @returns {number} Total height in pixels
     */
    getTotalHeight() {
      return totalItems * rowHeight
    },

    /**
     * Calculate scroll position for a specific item index
     * @param {number} index - Item index
     * @returns {number} Scroll position in pixels
     */
    getScrollTop(index) {
      return index * rowHeight
    },

    /**
     * Check if an item is in the visible range
     * @param {number} index - Item index
     * @returns {boolean} True if item is visible
     */
    isItemVisible(index) {
      const range = this.getVisibleRange()
      return index >= range.startIndex && index < range.endIndex
    }
  }
}

/**
 * Throttle function to limit execution rate
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, wait) {
  let timeout = null
  let previous = 0

  return function executedFunction(...args) {
    const now = Date.now()
    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(this, args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func.apply(this, args)
      }, remaining)
    }
  }
}

/**
 * Request animation frame with fallback
 * @param {Function} callback - Callback function
 * @returns {number} Request ID
 */
export function requestAnimationFramePolyfill(callback) {
  return window.requestAnimationFrame
    ? window.requestAnimationFrame(callback)
    : setTimeout(callback, 16)
}

/**
 * Cancel animation frame with fallback
 * @param {number} id - Request ID
 */
export function cancelAnimationFramePolyfill(id) {
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(id)
  } else {
    clearTimeout(id)
  }
}

/**
 * Optimized scroll handler using RAF
 * @param {Function} callback - Callback function to execute on scroll
 * @returns {Function} Scroll handler function
 */
export function createRAFScrollHandler(callback) {
  let rafId = null
  let latestScrollTop = null

  return function handleScroll(event) {
    latestScrollTop = event.target.scrollTop

    if (rafId === null) {
      rafId = requestAnimationFramePolyfill(() => {
        callback(latestScrollTop)
        rafId = null
      })
    }
  }
}
