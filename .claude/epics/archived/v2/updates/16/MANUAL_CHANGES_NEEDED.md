# Manual Changes Required for Issue #16 Stream B

Due to file locking issues, the following changes need to be applied manually:

## 1. Header.svelte

**File:** `C:/Users/gauch/PhpstormProjects/epic-v2/warhammer-v2/src/layouts/Header.svelte`

### Add imports to script section (after existing imports):
```javascript
import { push } from 'svelte-spa-router'
import { isAdminActive } from '../stores/admin.js'
import { logout } from '../lib/adminAuth.js'
import { adminStore } from '../stores/admin.js'
```

### Add these functions to script section:
```javascript
/**
 * Handle admin logout
 */
function handleLogout() {
  if (confirm('Are you sure you want to log out of admin mode?')) {
    logout()
    adminStore.logout()
    push('/')
  }
}

/**
 * Navigate to admin dashboard
 */
function goToAdminDashboard() {
  push('/admin')
}
```

### Add admin badge after the logo div (inside header-left):
```svelte
<!-- Issue #16 Stream B: Admin Badge -->
{#if $isAdminActive}
  <button class="admin-badge" on:click={goToAdminDashboard} title="Go to Admin Dashboard">
    <span class="badge-icon">🔑</span>
    <span class="badge-text">Admin Mode</span>
  </button>
{/if}
```

### Add logout button before ThemeToggle (inside user-actions):
```svelte
<!-- Issue #16 Stream B: Admin logout button -->
{#if $isAdminActive}
  <button
    class="admin-logout-button"
    on:click={handleLogout}
    title="Logout from Admin Mode"
  >
    Logout
  </button>
{/if}
```

### Add these styles to the <style> section:
```css
/* Issue #16 Stream B: Admin Badge Styles */
.admin-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
}

.admin-badge:hover {
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
  transform: translateY(-1px);
}

.badge-icon {
  font-size: 1rem;
  line-height: 1;
}

.badge-text {
  font-family: var(--font-ui, 'Inter', sans-serif);
}

/* Issue #16 Stream B: Admin Logout Button */
.admin-logout-button {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary, #e8e0d5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-ui, 'Inter', sans-serif);
}

.admin-logout-button:hover {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
  color: #fca5a5;
}
```

### Add mobile responsive styles (inside @media (max-width: 767px)):
```css
/* Issue #16 Stream B: Mobile admin badge */
.admin-badge {
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
  gap: 0.25rem;
}

.badge-text {
  display: none;
}

.badge-icon {
  font-size: 1.25rem;
}

.admin-logout-button {
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
}
```

### Add to .header-left styles:
```css
.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md, 1rem);
}
```

And in mobile section update gap:
```css
.header-left {
  gap: 0.5rem;
}
```

### Update .user-actions to ensure alignment:
```css
.user-actions {
  display: flex;
  gap: var(--spacing-sm, 0.5rem);
  align-items: center;  /* Add this line */
}
```

---

## 2. router.js

**File:** `C:/Users/gauch/PhpstormProjects/epic-v2/warhammer-v2/src/lib/router.js`

### Replace the '/admin' route (around line 75-78):

**Change FROM:**
```javascript
// Admin panel - lazy loaded
'/admin': wrap({
  asyncComponent: () => import('../routes/Admin.svelte')
}),
```

**Change TO:**
```javascript
// Issue #16 Stream B: Admin dashboard - lazy loaded
'/admin': wrap({
  asyncComponent: () => import('../pages/AdminDashboard.svelte')
}),

// Admin database management - lazy loaded
'/admin/database': wrap({
  asyncComponent: () => import('../routes/Admin.svelte')
}),
```

### Update the page titles (around line 136-146):

**Add after '/admin/review' title:**
```javascript
'/admin': 'Admin Dashboard - Warhammer Fantasy 4e',
'/admin/database': 'Database Management - Warhammer Fantasy 4e',
```

**Replace existing:**
```javascript
'/admin': 'Admin Panel - Warhammer Fantasy 4e',
```

**With:**
```javascript
'/admin': 'Admin Dashboard - Warhammer Fantasy 4e',
'/admin/database': 'Database Management - Warhammer Fantasy 4e',
```

---

## 3. App.svelte

**File:** `C:/Users/gauch/PhpstormProjects/epic-v2/warhammer-v2/src/App.svelte`

### Add import at the top:
```javascript
import { initializeAdminStore } from './stores/admin.js'
```

### In the onMount function, add after initializeDataStores:
```javascript
onMount(async () => {
  try {
    await initializeDataStores()
    console.log('Data stores initialized successfully')

    // Issue #16 Stream B: Initialize admin store
    initializeAdminStore()
  } catch (error) {
    console.error('Failed to initialize data stores:', error)
  }
})
```

---

## Testing Checklist

After making these changes:

- [ ] Admin login at `/admin/login` redirects to dashboard at `/admin`
- [ ] Admin badge appears in header when logged in
- [ ] Admin badge shows "🔑 Admin Mode" text on desktop
- [ ] Admin badge shows only icon on mobile
- [ ] Clicking admin badge navigates to dashboard
- [ ] Logout button appears in header when logged in
- [ ] Clicking logout logs out and redirects to home
- [ ] Dashboard displays correct statistics
- [ ] Dashboard quick action buttons work
- [ ] Protected route redirects to login when not authenticated
- [ ] Responsive design works on all screen sizes

---

## Verification

Once all changes are applied, verify the integration by:

1. Navigate to `http://localhost:5173/#/admin/login`
2. Login with password: `admin123`
3. Should see dashboard with stats
4. Header should show admin badge and logout button
5. Test all navigation and logout functionality
