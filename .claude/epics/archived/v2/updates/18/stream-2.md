---
issue: 18
stream: Offline Detection UI
agent: general-purpose
started: 2025-10-24T16:53:35Z
completed: 2025-10-24T17:15:00Z
status: completed
---

# Stream 2: Offline Detection UI

## Scope
Create offline indicator component with online/offline event listeners and styled banner.

## Files
- `warhammer-v2/src/components/OfflineIndicator.svelte`
- `warhammer-v2/src/styles/components.css`
- `warhammer-v2/src/App.svelte` (integration)

## Progress
- ✅ Created OfflineIndicator.svelte component
- ✅ Implemented navigator.onLine API for online/offline detection
- ✅ Added window online/offline event listeners with proper cleanup
- ✅ Designed warning banner with slide-in animation
- ✅ Added ARIA labels for accessibility (role="alert", aria-live="assertive")
- ✅ Styled using theme variables (warning colors, non-intrusive positioning)
- ✅ Added responsive styles for mobile devices
- ✅ Integrated component into App.svelte with clear comment marker
- ✅ Added utility styles to components.css
- ✅ Implemented auto-show on offline, auto-hide on online behavior

## Implementation Details

### Component Features
- Uses `navigator.onLine` API to check initial connection state
- Listens to `window.addEventListener('online/offline')` events
- Shows warning banner at top of viewport when offline
- Auto-hides when connection restored
- Warning icon (triangle with exclamation) for visual indication
- Informative message: "You are offline. All data is saved locally and will sync when you reconnect."

### Accessibility
- `role="alert"` for screen reader announcements
- `aria-live="assertive"` for immediate notification
- `aria-atomic="true"` to read entire message
- `aria-hidden="true"` on decorative icon
- Respects `prefers-reduced-motion` for animations

### Styling
- Fixed positioning at top of viewport (z-index: var(--z-toast))
- Warning color scheme using theme tokens (--color-warning, --color-warning-bg)
- Slide-in animation for smooth appearance
- Responsive design (smaller text and icon on mobile)
- 2px border-bottom for emphasis

### Coordination with Stream 3
- Component added to App.svelte with comment: "<!-- Stream 2: Offline Indicator (Issue #18) -->"
- Placed before Layout component to ensure banner appears above all content
- No conflicts with Stream 3 (UpdateNotification) - different integration points

## Testing Notes
To test this component:
1. Open DevTools > Network tab
2. Set throttling to "Offline"
3. Verify warning banner appears at top
4. Re-enable network
5. Verify banner disappears

## Status
Stream 2 is 100% complete. All acceptance criteria met.
