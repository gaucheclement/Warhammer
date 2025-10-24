---
issue: 18
analyzed: 2025-10-24T16:53:35Z
parallel_streams: 3
status: open
---

# Work Stream Analysis: Issue #18

## Overview

Issue #18 "Offline Support & Service Worker" is a medium task (12-16 hours) that can be decomposed into 3 parallel work streams with minimal file conflicts. The key strategy is to separate Service Worker infrastructure, UI components, and configuration, allowing multiple agents to work simultaneously.

Dependencies: Tasks 12 (completed) and 17 (completed) are satisfied, so all streams can begin immediately.

## Stream 1: Service Worker Infrastructure
**Agent Type:** general-purpose
**Can Start:** immediately
**Dependencies:** none

**Scope:**
- Implement core Service Worker using Workbox/vite-plugin-pwa
- Configure cache strategies (cache-first for app shell)
- Set up pre-caching and runtime caching
- Implement SW lifecycle management (install, activate, update)

**Files:**
- `warhammer-v2/vite.config.js` - Add vite-plugin-pwa configuration
- `warhammer-v2/src/lib/registerSW.js` - SW registration logic
- `warhammer-v2/package.json` - Add vite-plugin-pwa dependency

**Estimated Effort:** 5 hours

**Implementation Details:**
1. Install vite-plugin-pwa: `npm install -D vite-plugin-pwa`
2. Configure plugin in vite.config.js with Workbox options
3. Set up cache-first strategy for static assets
4. Configure runtime caching for external resources (fonts, etc.)
5. Implement SW registration with update detection
6. Handle updatefound events

## Stream 2: Offline Detection UI
**Agent Type:** general-purpose
**Can Start:** immediately
**Dependencies:** none

**Scope:**
- Create offline indicator component
- Implement online/offline event listeners
- Design and style offline banner
- Handle edge cases (network transitions)

**Files:**
- `warhammer-v2/src/components/OfflineIndicator.svelte` - Offline banner component
- `warhammer-v2/src/styles/components.css` - Styling for offline indicator
- `warhammer-v2/src/App.svelte` - Integration point (minor, coordinate with Stream 3)

**Estimated Effort:** 3 hours

**Implementation Details:**
1. Create OfflineIndicator.svelte component
2. Use navigator.onLine API
3. Listen to window online/offline events
4. Show warning banner when offline
5. Auto-hide when back online
6. Add appropriate ARIA labels for accessibility

## Stream 3: Update Notification System
**Agent Type:** general-purpose
**Can Start:** immediately
**Dependencies:** Stream 1 (for SW update events)

**Scope:**
- Create update notification component
- Implement toast/modal for update prompt
- Handle reload functionality
- User can dismiss or reload immediately

**Files:**
- `warhammer-v2/src/components/UpdateNotification.svelte` - Update toast component
- `warhammer-v2/src/lib/toastStore.js` - Store for update state (if not exists)
- `warhammer-v2/src/styles/components.css` - Styling for update notification
- `warhammer-v2/src/App.svelte` - Integration point

**Estimated Effort:** 4 hours

**Implementation Details:**
1. Create UpdateNotification.svelte component
2. Export show() method to trigger from SW registration
3. Implement "Update Now" button → window.location.reload()
4. Implement "Later" button → dismiss notification
5. Style as toast notification (non-blocking)
6. Connect to SW registration updatefound event

## Coordination Notes

### File Conflicts
Potential conflict: `src/App.svelte` is modified by both Stream 2 and Stream 3.

**Resolution:**
- Both streams only add component imports and instantiations
- Stream 2 adds `<OfflineIndicator />`
- Stream 3 adds `<UpdateNotification bind:this={updateNotif} />`
- Can be done in either order, minimal conflict risk
- If conflict occurs, manually merge both additions

### Integration Points
1. **Stream 1 + Stream 3:** Stream 1's `registerSW.js` needs to call Stream 3's `UpdateNotification.show()` method
   - Stream 1 should export reference to update notification
   - Stream 3 should provide public show() method
   - Coordinate: Stream 1 imports and calls `updateNotification.show()`

2. **Stream 2 + Stream 3:** Both add components to App.svelte
   - No functional dependency, just file modification
   - Last to commit should merge both changes

3. **All Streams:** Should follow same styling conventions
   - Use theme tokens from Stream 3 of Issue #17 (completed)
   - Consistent component structure

### Testing Strategy
- **Stream 1:** Test SW registration in DevTools Application tab, verify caching
- **Stream 2:** Test by toggling network in DevTools, verify banner shows/hides
- **Stream 3:** Test by simulating SW update (modify cache version), verify toast appears
- **Integration:** Test complete flow: go offline → see banner, trigger update → see notification

### Dependencies on External Libraries
- **Stream 1:** Requires `vite-plugin-pwa` (install: `npm install -D vite-plugin-pwa`)
- **Stream 2:** No external dependencies (uses browser APIs)
- **Stream 3:** No external dependencies (pure Svelte)

## Suggested Start Order

### Phase 1: Start Immediately (Parallel)
All 3 streams can begin work simultaneously:
- **Stream 1:** Service Worker Infrastructure
- **Stream 2:** Offline Detection UI
- **Stream 3:** Update Notification System

**Note:** Stream 3 has soft dependency on Stream 1 for integration, but can be developed independently and integrated later.

### Phase 2: Integration (Sequential)
After all streams complete their individual work (estimated 5 hours for longest stream):
1. Stream 2 adds OfflineIndicator to App.svelte
2. Stream 3 adds UpdateNotification to App.svelte
3. Stream 1 connects SW registration to UpdateNotification.show()
4. Test all three features together
5. Verify offline functionality end-to-end

### Phase 3: Testing & Polish (Sequential)
- Test with network disabled (offline mode)
- Test SW update flow (change version, verify notification)
- Test on multiple browsers (Chrome, Firefox, Safari)
- Mobile testing on real devices
- Verify no console errors
- Performance check (SW shouldn't slow down app)

## Risk Assessment

### Low Risk
- Streams 2 & 3: Standard Svelte components, well-defined scope
- Stream 1: Workbox is well-documented and stable

### Medium Risk
- App.svelte merge conflict (both streams 2 & 3 modify it)
- SW update detection timing (might be tricky to test)

### Mitigation Strategies
1. **App.svelte conflict:** Use clear comments for each stream's additions, manual merge if needed
2. **SW testing:** Use DevTools Application tab to unregister/update SW manually
3. **File:// protocol limitation:** Document as known limitation if SW doesn't work on file://

## Success Criteria

All acceptance criteria from Issue #18 must be met:
- ✅ Service Worker registered and active
- ✅ Cache-first strategy for HTML/CSS/JS
- ✅ App works 100% offline after first load
- ✅ Offline indicator appears when network unavailable
- ✅ Update notification when new version available
- ✅ Pre-cache all critical assets
- ✅ SW lifecycle managed properly
- ✅ No console errors
- ✅ Works on localhost/HTTPS (file:// documented as limitation if not working)

## Estimated Total Effort

**Sum of individual streams:** 12 hours
**With parallelization (3 streams):** ~5 hours wall-clock time (assuming 3 agents)
**Integration and testing:** +3 hours
**Total project time with parallelization:** ~8 hours wall-clock time

## Recommended Agent Assignment

Given that all streams can start immediately with minimal dependencies:

1. **Assign 3 general-purpose agents** to streams 1-3 simultaneously
2. Each agent works independently on their stream
3. After ~5 hours (when longest stream completes), do integration phase with 1-2 agents
4. Final testing and polish with 1 agent

This parallelization reduces the 12-hour sequential timeline to approximately 8 hours wall-clock time, achieving ~33% time savings through concurrent work.
