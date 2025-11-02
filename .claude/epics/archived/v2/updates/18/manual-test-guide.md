# Issue #18: Manual Testing Guide - Offline Support & Service Worker

## 🎯 Test Environment

**Dev Server:** http://localhost:5175
**Status:** ✅ Running
**Browser:** Chrome/Edge recommended (best DevTools support)

---

## Test 1: Offline Indicator ⚠️

### Objective
Verify that the offline warning banner appears when network is disabled and disappears when re-enabled.

### Steps

1. **Open Application**
   ```
   🌐 Navigate to: http://localhost:5175
   ```

2. **Open DevTools**
   - Press `F12` or `Ctrl+Shift+I` (Windows)
   - Press `Cmd+Option+I` (Mac)

3. **Go to Network Tab**
   - Click on "Network" tab in DevTools
   - You should see network requests loading

4. **Simulate Offline Mode**
   - Find the throttling dropdown (usually says "No throttling" or "Online")
   - Select "**Offline**" from the dropdown
   - ⚠️ Alternative: Click the "Offline" checkbox if available

5. **Expected Result** ✅
   - A **yellow/orange warning banner** should appear at the **top of the page**
   - Banner should show:
     - ⚠️ Warning icon (triangle with exclamation)
     - Message: "You are offline. All data is saved locally and will sync when you reconnect."
   - Banner should **slide in** from the top with animation

6. **Re-enable Network**
   - Change throttling back to "**Online**" or "**No throttling**"

7. **Expected Result** ✅
   - Banner should **automatically disappear** (slide out)
   - No manual action required

### ✅ Success Criteria
- [ ] Banner appears within 1 second of going offline
- [ ] Banner is visible and readable at top of page
- [ ] Banner disappears automatically when back online
- [ ] No JavaScript errors in console

### 🐛 Troubleshooting
- If banner doesn't appear: Check console for errors, verify OfflineIndicator is imported in App.svelte
- If banner stays visible: Refresh page, check network status

---

## Test 2: Service Worker Registration 🔧

### Objective
Verify that the Service Worker is properly registered and caching assets.

### Steps

1. **Open Application**
   ```
   🌐 Navigate to: http://localhost:5175
   ```
   - Wait for page to fully load

2. **Open DevTools → Application Tab**
   - Press `F12` to open DevTools
   - Click on "**Application**" tab (or "Application" in Chrome)
   - If you don't see it, click the ">>" icon to show more tabs

3. **Check Service Worker**
   - In left sidebar, click on "**Service Workers**" under "Application"
   - You should see an entry for localhost:5175

4. **Expected Result** ✅
   ```
   Source: /dev-sw.js?dev-sw (development mode)
   Status: activated and is running
   ```
   - In production build, source would be: /sw.js

5. **Verify it's Active**
   - Status should show green circle with "activated and is running"
   - Should show registration ID and scope

6. **Check Cache Storage** (Production Build Only)
   - In left sidebar, click on "**Cache Storage**"
   - You should see cache entries like:
     - `workbox-precache-v2-...`
     - `google-fonts-cache` (if fonts loaded)

### ✅ Success Criteria
- [ ] Service Worker shows as "activated and is running"
- [ ] No errors in Service Worker section
- [ ] In production: Cache storage contains precached assets

### 📝 Note
In **development mode**, the Service Worker may behave differently than in production. For full testing, use production build:
```bash
npm run build
npm run preview
```

---

## Test 3: Offline Functionality 📴

### Objective
Verify that the app works 100% offline after initial load.

### Steps

1. **Load Application Online**
   ```
   🌐 Navigate to: http://localhost:5175
   ```
   - Wait for complete page load
   - Navigate to a few routes (Home, Browse, Settings)

2. **Open DevTools → Network Tab**
   - Press `F12` → "Network" tab
   - Set throttling to "**Offline**"

3. **Test Navigation** (While Offline)
   - Click on different navigation links:
     - Home → Browse → Creator → Settings
   - Try using the app's features

4. **Expected Result** ✅
   - ⚠️ Offline banner appears at top
   - App continues to work normally
   - All routes load without network requests
   - No "Failed to fetch" or connection errors

5. **Refresh Page** (While Still Offline)
   - Press `F5` or `Ctrl+R` to refresh

6. **Expected Result** ✅
   - Page should reload successfully from cache
   - Offline banner appears immediately
   - App is fully functional

### ✅ Success Criteria
- [ ] App works offline after initial load
- [ ] Navigation between routes works offline
- [ ] Page refresh works offline (in production build)
- [ ] Offline banner shows throughout

### 🐛 Troubleshooting
- If app doesn't work offline: This is normal in **development mode**. Test with production build:
  ```bash
  npm run build
  npm run preview
  ```

---

## Test 4: Update Notification 🔔

### Objective
Verify that update notification appears when a new app version is available.

### Steps

**⚠️ This test requires production build**

1. **Build and Serve Production Version**
   ```bash
   cd C:/Users/gauch/PhpstormProjects/epic-v2/warhammer-v2
   npm run build
   npm run preview
   ```
   - Note the URL (usually http://localhost:4173)

2. **Open Application**
   ```
   🌐 Navigate to production preview URL
   ```
   - Let app fully load

3. **Simulate an Update**
   - Keep the browser tab open
   - In terminal, make a small change to trigger rebuild:
     ```bash
     # In a new terminal
     cd C:/Users/gauch/PhpstormProjects/epic-v2/warhammer-v2

     # Modify vite.config.js to bump cache version
     # Or touch any source file to trigger rebuild
     npm run build
     ```

4. **Wait for Update Detection**
   - The app should detect the new Service Worker version
   - May take 1-2 minutes

5. **Expected Result** ✅
   - A **toast notification** appears in **bottom-right corner**
   - Toast should show:
     - Title: "A new version is available!"
     - Two buttons:
       - "**Update Now**" (primary button)
       - "**Later**" (secondary button)

6. **Test "Update Now" Button**
   - Click "**Update Now**"

7. **Expected Result** ✅
   - Page should reload automatically
   - New version loads
   - Toast disappears

8. **Test "Later" Button** (Repeat Test)
   - Trigger another update (rebuild)
   - When toast appears, click "**Later**"

9. **Expected Result** ✅
   - Toast dismisses (disappears)
   - App continues running current version
   - User can manually reload later

### ✅ Success Criteria
- [ ] Update notification appears when new version available
- [ ] Toast positioned in bottom-right corner
- [ ] "Update Now" button reloads the page
- [ ] "Later" button dismisses the notification
- [ ] Toast is accessible (keyboard navigation works)

### 🐛 Troubleshooting
- If toast doesn't appear: Check if Service Worker is registered (Test 2)
- If update not detected: Wait longer (can take 1-2 minutes), or manually trigger SW update in DevTools

---

## Test 5: Mobile Responsiveness 📱

### Objective
Verify offline indicator and update notification work on mobile screen sizes.

### Steps

1. **Open DevTools → Device Mode**
   - Press `F12` → Click device icon (📱) or press `Ctrl+Shift+M`
   - Select a mobile device (e.g., "iPhone 12 Pro")

2. **Test Offline Indicator**
   - Set Network to "Offline"
   - Verify banner appears at top
   - Check that text and icon are readable on mobile

3. **Expected Result** ✅
   - Banner is full width on mobile
   - Smaller font size (12px instead of 14px)
   - Smaller icon (16px instead of 20px)
   - Still readable and accessible

4. **Test Update Notification** (Production)
   - Trigger update (rebuild)
   - Wait for toast notification

5. **Expected Result** ✅
   - Toast is **full width** on mobile (not bottom-right)
   - Buttons are stacked vertically on mobile
   - Touch targets are adequate (min 48px height)

### ✅ Success Criteria
- [ ] Offline banner responsive on mobile
- [ ] Update toast full-width on mobile
- [ ] Touch targets adequate for mobile use
- [ ] No horizontal scrolling

---

## Test 6: Accessibility ♿

### Objective
Verify components are accessible with screen readers and keyboard navigation.

### Steps

1. **Test Keyboard Navigation**
   - Navigate using only keyboard:
     - `Tab` to move between elements
     - `Enter` to click buttons
     - `Esc` to dismiss toast

2. **Expected Result** ✅
   - Can focus on "Update Now" and "Later" buttons
   - `Esc` key dismisses update notification
   - Focus visible on all interactive elements

3. **Check ARIA Labels** (DevTools → Elements)
   - Inspect offline banner:
     - Should have `role="alert"`
     - Should have `aria-live="assertive"`
   - Inspect update notification:
     - Should have `role="alert"`
     - Buttons should have `aria-label`

4. **Lighthouse Audit**
   - Open DevTools → "Lighthouse" tab
   - Select "Accessibility" category
   - Click "Analyze page load"

5. **Expected Result** ✅
   - Accessibility score > 90
   - No critical accessibility issues

### ✅ Success Criteria
- [ ] All interactive elements keyboard accessible
- [ ] ARIA labels present and correct
- [ ] Lighthouse accessibility score > 90
- [ ] No color contrast issues

---

## Summary Checklist ✅

### Functional Tests
- [ ] **Test 1:** Offline indicator shows/hides correctly
- [ ] **Test 2:** Service Worker registered and active
- [ ] **Test 3:** App works 100% offline (production)
- [ ] **Test 4:** Update notification appears and functions
- [ ] **Test 5:** Mobile responsive design works
- [ ] **Test 6:** Accessibility standards met

### Edge Cases
- [ ] Rapid online/offline toggling handled gracefully
- [ ] Multiple update notifications don't stack
- [ ] Offline banner doesn't block critical UI
- [ ] Update toast dismisses properly

### Performance
- [ ] No performance degradation with SW
- [ ] Cache doesn't grow unbounded
- [ ] Page load time acceptable

---

## 📋 Recording Results

After completing tests, document results in:
`.claude/epics/v2/updates/18/manual-test-results.md`

Include:
- ✅ Tests passed
- ❌ Tests failed (with details)
- 📸 Screenshots (optional but helpful)
- 🐛 Issues discovered
- ✏️ Notes and observations

---

## 🚀 Next Steps After Testing

1. **If All Tests Pass:**
   - Update progress.md with completion: 100%
   - Sync to GitHub: `/pm:issue-sync 18`
   - Close issue: `gh issue close 18 --repo gaucheclement/Warhammer`

2. **If Issues Found:**
   - Document issues in manual-test-results.md
   - Create follow-up tasks if needed
   - Fix critical issues before closing

3. **Optional Enhancements:**
   - Add PWA icons (currently placeholders)
   - Lighthouse PWA audit (aim for score > 80)
   - Cross-browser testing (Firefox, Safari)
   - Real mobile device testing (not just emulator)

---

**Good luck with testing! 🎉**
