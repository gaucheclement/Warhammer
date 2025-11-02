# Manual Testing Guide for Issue #46

## Overview
This guide provides step-by-step instructions for manually testing the fixes for Issue #46 in a browser environment.

## Prerequisites
- Dev server must be running on http://localhost:5173
- Browser with developer console open (F12)
- Test should be performed in the Browse page

## Test Scenarios

### Test 1: Species with Index 0
**Objective**: Verify that the first species (index 0) can be opened without errors

**Steps**:
1. Navigate to http://localhost:5173/browse
2. Click on the "Species" category
3. Find and click on the FIRST species in the list (index 0)
4. Observe the modal that opens

**Expected Results**:
- Modal opens successfully (no "Entity type and ID are required" error)
- Species name and details are displayed in the Info tab
- No console errors
- Console log shows: `Opening entity: { type: 'specie', id: 0 }`

**Failure Indicators**:
- Modal shows error message
- Modal is blank or shows loading spinner indefinitely
- Console shows "Entity type and ID are required"

---

### Test 2: Career with ID 0
**Objective**: Verify careers use numeric ID, not string name

**Steps**:
1. Navigate to http://localhost:5173/browse
2. Click on the "Careers" category
3. Find and click on a career (preferably the first one)
4. Check the console log for the opening message

**Expected Results**:
- Modal opens with career details
- Console log shows: `Opening entity: { type: 'career', id: <numeric> }`
- ID should be a NUMBER, not a string like "Agitateur"
- Info tab displays career information

**Failure Indicators**:
- Console shows: `Entity not found: career with ID "Agitateur"` (string name instead of number)
- Modal fails to load

---

### Test 3: Info Tab Content Display
**Objective**: Verify Info tab shows content for all entity types

**Steps**:
1. Test each entity type from the Browse page:
   - Species
   - Careers
   - Skills
   - Talents
   - Spells
   - Traits
   - Trappings
   - Creatures

2. For each type:
   - Click on an entity
   - Verify the Info tab is selected by default
   - Check that content is displayed

**Expected Results**:
- All entity types display content in the Info tab
- Content includes entity-specific details (name, description, attributes, etc.)
- No blank or empty tabs

**Failure Indicators**:
- Info tab is blank
- Shows "No description available" for entities that should have content
- Loading spinner never completes

---

### Test 4: Related Tab Functionality
**Objective**: Verify Related tab shows relationships or appropriate message

**Steps**:
1. Open an entity modal
2. Click on the "Related" tab
3. Observe the content

**Expected Results**:
- Related tab shows a list of related entities OR
- Related tab shows "No relations found" message (if entity has no relationships)
- No console warnings about "No relationship configuration found"

**Failure Indicators**:
- Related tab is blank
- Console shows: `No relationship configuration found for entity type: specie`
- Tab shows loading spinner indefinitely

---

### Test 5: Tab Switching
**Objective**: Verify smooth switching between Info and Related tabs

**Steps**:
1. Open any entity modal
2. Click on the "Related" tab
3. Click back on the "Info" tab
4. Repeat 2-3 times

**Expected Results**:
- Tabs switch immediately without delay
- Content updates correctly for each tab
- No flickering or re-loading
- Tab selection is visually indicated (active tab highlighted)

**Failure Indicators**:
- Tabs don't switch when clicked
- Content doesn't update
- Console errors on tab switch

---

### Test 6: Console Error Check
**Objective**: Ensure no console errors when opening entities

**Steps**:
1. Clear browser console (click trash icon)
2. Open entities from each category:
   - Species (including first one with index 0)
   - Careers
   - Skills
   - Talents
   - Spells
3. Check console after each entity is opened

**Expected Results**:
- No red error messages in console
- Only info/log messages like "Opening entity: ..."
- No warnings about missing configurations

**Failure Indicators**:
- Red error messages
- "Entity not found" errors
- "No relationship configuration found" warnings
- "Entity type and ID are required" errors

---

### Test 7: Regression Testing (Non-Zero IDs)
**Objective**: Ensure entities with IDs 1+ still work correctly

**Steps**:
1. Open entities that are NOT the first in their category
2. Verify they open normally
3. Check both Info and Related tabs

**Expected Results**:
- All entities with ID > 0 work exactly as before
- No degradation in functionality
- Same behavior as entities with ID 0

---

## Quick Verification Checklist

Use this checklist for rapid testing:

- [ ] First species (index 0) opens successfully
- [ ] Career modal uses numeric ID (check console)
- [ ] Info tab shows content for all entity types
- [ ] Related tab shows relationships or "No relations" message
- [ ] Tabs switch smoothly between Info ↔ Related
- [ ] No console errors when opening any entity
- [ ] Entities with ID > 0 still work (regression check)

## Test Data Suggestions

### Recommended Test Entities
- **Species**: First species in list (index 0)
- **Careers**: First 3 careers in list
- **Skills**: Any skill from the list
- **Talents**: Any talent from the list
- **Spells**: Any spell from the list

### Console Commands for Verification

You can also test the validation logic directly in the browser console:

```javascript
// Test ID 0 validation
const entityId = 0;
const isValid = (entityId !== null && entityId !== undefined);
console.log('ID 0 is valid:', isValid); // Should be true

// Test ID extraction for species
const species = { index: 0, id: 'human', name: 'Human' };
const speciesId = species.index !== null && species.index !== undefined ? species.index : species.id;
console.log('Extracted species ID:', speciesId); // Should be 0

// Test ID extraction for career
const career = { id: 0, name: 'Agitateur' };
const careerId = career.id !== null && career.id !== undefined ? career.id : (career.name || career.label);
console.log('Extracted career ID:', careerId); // Should be 0, not 'Agitateur'
```

## Reporting Issues

If any test fails, document:
1. Which test scenario failed
2. Steps to reproduce
3. Console errors (screenshot or copy text)
4. Expected vs actual behavior
5. Browser and version used

## Automation Note

Automated tests have been created in:
- `warhammer-v2/src/lib/issue-46-integration.test.js`

Run with: `npm test -- issue-46-integration.test.js`

These tests verify the logic fixes but cannot test the actual UI interaction.
