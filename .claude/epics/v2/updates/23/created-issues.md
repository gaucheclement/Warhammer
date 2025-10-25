---
issue: 23
title: Created GitHub Issues
date: 2025-10-25
total_created: 8
---

# Created GitHub Issues

Successfully created 8 GitHub issues for missing or unverified features in warhammer-v2.

## Priority 0 (Critical - Blocking)

### Issue #24: [P0] Verify 8-step character generation pipeline in V2
**URL**: https://github.com/gaucheclement/Warhammer/issues/24
**Status**: Open
**Estimated Effort**: 3-5 days
**Labels**: task, epic:v2

**Summary**: Verify that all 8 character creation wizard steps are functional in V2. This is the foundational issue - all other features depend on having a working character generation pipeline.

**Key Tasks**:
- Verify each step loads correctly
- Test data flow from steps to character state
- Validate step transitions
- Confirm character state persistence
- Document any gaps

---

### Issue #25: [P0] Implement character creation modes with XP bonus system
**URL**: https://github.com/gaucheclement/Warhammer/issues/25
**Status**: Open
**Estimated Effort**: 2-3 days
**Labels**: task, epic:v2

**Summary**: Implement three character creation modes (Normal with XP bonuses, Free unrestricted, Random instant) to match root project functionality.

**Key Tasks**:
- MainMenu mode selection
- Normal mode XP bonus system (+20/+50/+25 XP)
- Free mode unrestricted creation
- Random mode automation
- Mode persistence

---

### Issue #26: [P0] Implement skill, talent, and magic specialization system
**URL**: https://github.com/gaucheclement/Warhammer/issues/26
**Status**: Open
**Estimated Effort**: 2-3 days
**Labels**: task, epic:v2

**Summary**: Implement modal-based specialization selection for skills and talents that require specializations (e.g., Language (Reikspiel), Weapon Training (Swords)).

**Key Tasks**:
- Skill specialization modal
- Talent specialization modal
- Magic talent handling
- Random assignment
- Character sheet display

---

### Issue #27: [P0] Implement save/load system with unique character codes
**URL**: https://github.com/gaucheclement/Warhammer/issues/27
**Status**: Open
**Estimated Effort**: 1-2 days
**Labels**: task, epic:v2

**Summary**: Implement save/load functionality with unique character codes using IndexedDB for storage.

**Key Tasks**:
- Generate unique save codes
- Save to IndexedDB
- Load by code from MainMenu
- List saved characters
- Continue last character
- Export/import characters

**Dependencies**: Requires #24 (character generation pipeline)

---

## Priority 1 (High - Important)

### Issue #28: [P1] Port testing framework from root to V2
**URL**: https://github.com/gaucheclement/Warhammer/issues/28
**Status**: Open
**Estimated Effort**: 3-4 days
**Labels**: task, epic:v2

**Summary**: Port comprehensive testing framework from root project, adapting for V2 architecture. Includes unit tests, integration tests, performance tests, and stability tests.

**Key Tasks**:
- Set up Jest/Vitest
- Port 5 unit tests from root
- Add V2-specific tests
- Set up CI/CD
- Achieve 80%+ coverage

---

### Issue #29: [P1] Implement fully automated random character generation
**URL**: https://github.com/gaucheclement/Warhammer/issues/29
**Status**: Open
**Estimated Effort**: 1-2 days
**Labels**: task, epic:v2

**Summary**: Implement "New (Random)" button that generates a complete character instantly with all choices made automatically.

**Key Tasks**:
- Random button in MainMenu
- Automated species selection
- Automated career selection
- Automated characteristic rolls
- Automated skill/talent/trapping selection
- Automated detail generation

**Dependencies**: Requires #24 (pipeline), #26 (specializations)

---

### Issue #30: [P1] Implement magic specialization system (spells, gods, colors)
**URL**: https://github.com/gaucheclement/Warhammer/issues/30
**Status**: Open
**Estimated Effort**: 1-2 days
**Labels**: task, epic:v2

**Summary**: Implement specialized handling for magic talents including spell selection, god selection, and magic color selection.

**Key Tasks**:
- Detect magic talents
- Spell selection modal (filtered by lore)
- God selection modal (Bless talent)
- Magic color selection (arcane magic)
- Random mode auto-assignment
- Character sheet spell display

**Dependencies**: Requires #26 (specialization system)

---

## Priority 2 (Medium - Nice to Have)

### Issue #31: [P2] Implement Foundry VTT export functionality
**URL**: https://github.com/gaucheclement/Warhammer/issues/31
**Status**: Open
**Estimated Effort**: 2-3 days
**Labels**: task, epic:v2

**Summary**: Port Foundry VTT export functionality to allow users to export characters to Foundry Virtual Tabletop platform.

**Key Tasks**:
- Port FoundryHelper module
- Map character data to Foundry format
- Map skills, talents, equipment
- Generate JSON download
- Test in Foundry VTT
- Document import process

**Dependencies**: Requires #24 (complete character generation)

---

## Summary Statistics

### By Priority
- **P0 (Critical)**: 4 issues (#24-#27)
- **P1 (High)**: 3 issues (#28-#30)
- **P2 (Medium)**: 1 issue (#31)

### By Estimated Effort
- **Total Estimated Days**: 15-24 days
- **P0 Effort**: 8-13 days
- **P1 Effort**: 5-8 days
- **P2 Effort**: 2-3 days

### Implementation Timeline
With 1 developer working full-time: **3-5 weeks**

### Critical Path
```
Issue #24 (Pipeline)
    ↓
Issue #26 (Specializations)
    ↓
Issue #25 (Modes)
    ↓
Issue #27 (Save/Load)
```

Once these 4 P0 issues are complete, V2 will have **functional character creation**.

### Parallel Work Possible
- Issue #28 (Testing) can be started after #24 is verified
- Issue #29 (Random) requires #24 and #26
- Issue #30 (Magic) requires #26
- Issue #31 (Foundry) requires #24

## Next Steps

1. **This Week**: Start verification of character generation pipeline (#24)
2. **Week 1-2**: Complete P0 issues (#24, #26, #25, #27)
3. **Week 3**: Start testing framework (#28) and high-priority features
4. **Week 4**: Complete P1 issues (#28, #29, #30)
5. **Week 5-6**: Polish and P2 features (#31)

## Related Documents

- **Feature Comparison**: .claude/epics/v2/feature-comparison.md
- **Issues to Create**: .claude/epics/v2/updates/23/issues-to-create.md
- **Stream Analyses**:
  - Stream A: .claude/epics/v2/updates/23/backend-features.md
  - Stream B: .claude/epics/v2/updates/23/ui-features.md
  - Stream C: .claude/epics/v2/updates/23/data-management-features.md
  - Stream D: .claude/epics/v2/updates/23/helper-utilities-features.md
