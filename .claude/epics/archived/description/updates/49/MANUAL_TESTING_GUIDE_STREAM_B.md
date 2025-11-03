# Manual Testing Guide - Issue #49 Stream B

## Purpose
Verify that the entity specialization fix in `db-descriptions.js` correctly displays only the specific specializations defined for species skills/talents, not all possible specializations.

## Test Environment
- **Worktree**: `C:\Users\gauch\PhpstormProjects\epic-description`
- **Dev Server**: Run `npm run dev` in `warhammer-v2` directory
- **URL**: http://localhost:5173 (or configured port)

## Starting the Dev Server

```bash
cd C:\Users\gauch\PhpstormProjects\epic-description\warhammer-v2
npm run dev
```

## Test Case 1: Wood Elf Species - Skills

### Steps:
1. Open the application in browser
2. Navigate to the Species section
3. Select "Elfe Sylvain" (Wood Elf)
4. Click on the "Comps/Talents" tab
5. Look at the "Compétences de race" section

### Expected Results:
- **"Corps à corps (Base)"** - Should show only "(Base)", NOT all melee specializations
  - ❌ WRONG: "Corps à corps (Armes d'hast, À deux mains, Bagarre, Base, Cavalerie, Escrime, Fléau, Parade)"
  - ✅ CORRECT: "Corps à corps (Base)"

- **"Langue (Elthárin)"** - Should show only "(Elthárin)", NOT all languages
  - ❌ WRONG: "Langue (Albionais, Bataille, Bretonnien, Classique, Elthárin, Estalien, Ghassalli, Gospodarin...)"
  - ✅ CORRECT: "Langue (Elthárin)"

- **"Discrétion (Rurale)"** - Should show only "(Rurale)"
  - ❌ WRONG: "Discrétion (Rurale, Urbaine)"
  - ✅ CORRECT: "Discrétion (Rurale)"

- **"Projectiles (Arc)"** - Should show only "(Arc)"
  - ❌ WRONG: "Projectiles (Arc, Arbalète, Arme de jet, Arme de poing, Artillerie, Arme d'ingénierie, Fronde)"
  - ✅ CORRECT: "Projectiles (Arc)"

- **"Sens aiguisé (Vue)"** - Should show only "(Vue)"
  - ❌ WRONG: "Sens aiguisé (Ouïe, Odorat, Goût, Toucher, Vue)"
  - ✅ CORRECT: "Sens aiguisé (Vue)"

### Pass Criteria:
- [ ] All 5 skills show ONLY their specific specialization
- [ ] No skill shows all possible specializations

## Test Case 2: Other Species (Regression Check)

### Steps:
1. Navigate to "Humain" (Human)
2. Check "Comps/Talents" tab
3. Navigate to "Nain" (Dwarf)
4. Check "Comps/Talents" tab
5. Navigate to "Halfling"
6. Check "Comps/Talents" tab

### Expected Results:
- All species skills/talents display correctly
- Skills without specializations show no parentheses
- Skills with specializations show only the species-specific ones

### Pass Criteria:
- [ ] Human skills display correctly
- [ ] Dwarf skills display correctly
- [ ] Halfling skills display correctly
- [ ] No console errors

## Test Case 3: Classes (Regression Check)

### Steps:
1. Navigate to the Classes section
2. Select a class with trappings (e.g., "Rangers")
3. Check the "Possessions" section

### Expected Results:
- All trappings display correctly
- Specialized trappings show only specific variants if defined

### Pass Criteria:
- [ ] Class trappings display correctly
- [ ] No console errors

## Browser Console

Keep the browser console open during testing:
- **F12** to open Developer Tools
- Check the "Console" tab
- Look for any errors or warnings

### Expected:
- [ ] No JavaScript errors
- [ ] No console warnings about broken references

## Performance Check

### Steps:
1. Navigate between several species quickly
2. Check that page loads and displays are fast

### Expected:
- [ ] No noticeable slowdown
- [ ] Page transitions remain smooth

### Pass Criteria:
- [ ] Performance is same or better than before

## Final Checklist

- [ ] Test Case 1: Wood Elf displays specific specializations only
- [ ] Test Case 2: Other species work correctly (no regressions)
- [ ] Test Case 3: Classes work correctly (no regressions)
- [ ] No console errors
- [ ] No performance degradation

## If Tests Fail

If any test fails:
1. Note the exact issue and which test case failed
2. Check the browser console for errors
3. Take a screenshot of the incorrect display
4. Report findings in stream-B.md

## If Tests Pass

If all tests pass:
1. Mark Stream B as fully completed in stream-B.md
2. Update the status to include manual testing confirmation
3. Proceed with confidence that the fix is working correctly

## Test Report Template

```markdown
## Manual Testing Results - Stream B

**Date**: [Date]
**Tester**: [Name]
**Environment**: [Browser, OS]

### Test Case 1: Wood Elf Species - Skills
- Corps à corps (Base): [✅ PASS / ❌ FAIL - details]
- Langue (Elthárin): [✅ PASS / ❌ FAIL - details]
- Discrétion (Rurale): [✅ PASS / ❌ FAIL - details]
- Projectiles (Arc): [✅ PASS / ❌ FAIL - details]
- Sens aiguisé (Vue): [✅ PASS / ❌ FAIL - details]

### Test Case 2: Other Species
- Human: [✅ PASS / ❌ FAIL - details]
- Dwarf: [✅ PASS / ❌ FAIL - details]
- Halfling: [✅ PASS / ❌ FAIL - details]

### Test Case 3: Classes
- Classes display: [✅ PASS / ❌ FAIL - details]

### Console Errors
- JavaScript errors: [None / List errors]
- Warnings: [None / List warnings]

### Performance
- Page load speed: [Same / Faster / Slower]
- Navigation speed: [Same / Faster / Slower]

### Overall Result
[✅ ALL TESTS PASS / ❌ SOME TESTS FAIL]

### Notes
[Any additional observations]
```
