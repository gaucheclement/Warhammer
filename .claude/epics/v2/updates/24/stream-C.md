---
issue: 24
stream: C - Port Wizard to V2
agent: general-purpose
started: 2025-10-25T07:43:52Z
status: in_progress
---

# Stream C: Port Wizard Steps to V2

## Scope
Convert V1 HTML wizard steps to V2 Svelte components while preserving all business logic.

## Dependencies
- ✅ Stream A: Audit report available
- ✅ Stream B: Character persistence layer ready

## Files to Create
- warhammer-v2/src/routes/character-generator/+page.svelte (orchestrator)
- warhammer-v2/src/lib/components/wizard/StepSpecies.svelte
- warhammer-v2/src/lib/components/wizard/StepCareers.svelte
- warhammer-v2/src/lib/components/wizard/StepCharacteristics.svelte
- warhammer-v2/src/lib/components/wizard/StepTalents.svelte
- warhammer-v2/src/lib/components/wizard/StepSkills.svelte
- warhammer-v2/src/lib/components/wizard/StepTrappings.svelte
- warhammer-v2/src/lib/components/wizard/StepDetail.svelte
- warhammer-v2/src/lib/components/wizard/StepExperience.svelte
- warhammer-v2/src/lib/components/wizard/StepResume.svelte
- warhammer-v2/src/lib/components/wizard/WizardNavigation.svelte
- warhammer-v2/src/lib/stores/wizardState.js

## Progress

### Phase 1: Foundation
- ✅ wizardState.js - Complete
- ✅ Orchestrator page (CharacterGenerator.svelte) - Complete

### Phase 2: Simple Steps
- ⏳ StepSpecies.svelte - Pending
- ⏳ StepDetail.svelte - Pending
- ⏳ StepTrappings.svelte - Pending

### Phase 3: Medium Steps
- ⏳ StepCareers.svelte - Pending
- ⏳ StepSkills.svelte - Pending
- ⏳ StepResume.svelte - Pending

### Phase 4: Complex Steps
- ⏳ StepCharacteristics.svelte - Pending
- ⏳ StepTalents.svelte - Pending
- ⏳ StepExperience.svelte - Pending

## Notes
- V1 wizard has 9 main steps + 1 final experience step
- Steps: Species → Careers → Characteristics → Talents → Skills → Trappings → Detail → Experience → Resume
- Must preserve all business logic, XP bonuses, validation rules
- Use Stream B's characterStore API for persistence
- Reference Stream A audit report for critical porting notes
