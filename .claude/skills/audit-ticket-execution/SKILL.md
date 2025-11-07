---
name: executing-audit-tickets
description: Use when processing audit tickets in the audit/ directory, before starting work on database or feature documentation - enforces strict compliance with ticket criteria, 200-line limit, no technical code, and mandatory verification before marking DONE. Prevents rationalization that leads to incomplete or non-compliant deliverables.
---

# Executing Audit Tickets

## Overview

Audit tickets document business logic WITHOUT technical implementation details. Each ticket has explicit acceptance criteria that are BINARY - either met or not met. No partial credit, no "good enough", no "Future Work".

**Core Principle:** Criteria define DONE. Not your judgment of usefulness.

## When to Use

Use this skill when:
- Processing tickets in `audit/tickets/`
- Creating documentation in `audit/database/`, `audit/features/`, or `audit/business-rules/`
- About to mark a ticket status as DONE
- Tempted to add "TODO" or "Future Work" sections

## Core Rules (Non-Negotiable)

### Rule 1: Read ALL Listed Files

**Requirement:** Read every file in "Fichiers à analyser" section.

**No shortcuts:**
- ❌ "I understand the pattern" → Read the files
- ❌ "First file gave me enough context" → Read ALL files
- ❌ "This one probably isn't relevant" → Read it anyway

**Verification:** Can you list what you learned from EACH file?

### Rule 2: 200 Lines is a Hard Limit

**Requirement:** Output file < 200 lines. Period.

**Not negotiable:**
- ❌ "Just 210 lines, barely over" → Still over. Reduce.
- ❌ "But it's complete and structured" → Make it complete in < 200 lines
- ❌ "Content quality matters more" → Both matter. Meet the limit.
- ❌ "Légèrement" or "slightly" for ANY overage → Still a violation

**How to fix:** Split into multiple files, use more concise language, remove redundancy.

**Verification:** `wc -l filename` must show < 200.

### Rule 3: Zero Technical Code in KB

**Requirement:** Business logic ONLY. No code from source files.

**Forbidden:**
- Code snippets from implementation
- Function signatures
- Class definitions
- Import statements
- Technical jargon when business terms exist

**Allowed:**
- "WHAT the system does" (business logic)
- "WHY" (business rules)
- Data formats and structures (as tables/bullets)
- Examples with sample data

**Verification:** Grep for `function|const|class|import` should return nothing.

### Rule 4: ALL Criteria Must Be Checked

**Requirement:** Every checkbox in "Critères d'acceptance" must be verified and mentally checked before marking DONE.

**Process:**
1. Read criterion
2. Verify it's met (actually check, don't assume)
3. If not met: fix it or ticket stays IN_PROGRESS
4. Repeat for ALL criteria

**Not allowed:**
- ❌ Updating frontmatter to DONE without checking criteria
- ❌ "Obviously met" without verification
- ❌ Leaving checkboxes unchecked
- ❌ ANY criterion failing while ticket is DONE

**Verification:** Can you explicitly state how each criterion is satisfied?

### Rule 5: No "Future Work" Allowed

**Requirement:** Ticket marked DONE = 100% complete. No deferred sections.

**Forbidden phrases in DONE tickets:**
- "TODO"
- "Future work"
- "To be completed later"
- "Out of scope for now"
- "Phase 2"
- "Nice to have"

**If not done:** Keep ticket IN_PROGRESS or add new ticket for missing work.

## Execution Process

### Before Starting

1. Read ticket file completely
2. Note ALL files in "Fichiers à analyser"
3. Review ALL criteria in "Critères d'acceptance"
4. Update ticket status to IN_PROGRESS

### During Work

1. Read EVERY listed file (no shortcuts)
2. Extract business logic only (no technical code)
3. Create documentation following template
4. Monitor line count continuously
5. Stop at 180 lines to review for conciseness

### Before Marking DONE

1. Run `wc -l` on output file → Must be < 200
2. Grep for technical code → Must find none
3. Read EACH acceptance criterion
4. Verify EACH is met (explicitly, not assuming)
5. If ANY criterion fails → Fix OR keep IN_PROGRESS
6. Only if ALL pass → Update frontmatter to DONE

## Rationalization Table

| Excuse | Reality |
|--------|---------|
| "Légèrement" or "slightly" over 200 lines | Still a violation. Reduce to < 200. |
| "Complete and structured justifies overage" | Both quality AND limits required. Not either/or. |
| "Doc is useful, that's what matters" | Useful AND compliant both required. |
| "Criteria are obviously met" | Obvious ≠ verified. Check explicitly. |
| "I can mark DONE, criteria implied" | DONE requires explicit verification, not implication. |
| "Good enough for now" | "Good enough" = IN_PROGRESS. DONE = criteria met. |
| "Too much important content to cut" | Content prioritization IS the task. Cut or split. |
| "This violates the spirit not letter" | Violating letter IS violating spirit. |

## Red Flags - STOP and Fix

If you're thinking ANY of these, you're about to violate:
- "Just X lines over, barely matters"
- "Content quality beats arbitrary limits"
- "I'll mark DONE, it's essentially complete"
- "Checking each criterion is tedious"
- "This is good enough to move forward"
- Adding "TODO" or "Future Work" sections
- Including code snippets "for reference"

**All of these mean: STOP. Re-read Core Rules. Fix violations BEFORE marking DONE.**

## Common Mistakes

### Mistake 1: Confusing "work done" with "criteria met"

**Wrong:** "I documented the table, ticket is done."
**Right:** "I documented the table. Does it meet ALL criteria? Let me verify each one."

### Mistake 2: Minimizing overages

**Wrong:** "264 lines is only slightly more than 200."
**Right:** "264 > 200. I need to reduce by 64+ lines or split into multiple files."

### Mistake 3: Skipping formal verification

**Wrong:** (Updates frontmatter to DONE without reviewing criteria)
**Right:** (Reads each criterion, verifies, THEN updates frontmatter)

### Mistake 4: Treating limits as guidelines

**Wrong:** "200 lines is a guideline, quality matters more."
**Right:** "200 lines is a hard requirement. Quality within that constraint."

## Success Criteria

Ticket properly DONE when:
- ✅ Output file < 200 lines (verified with `wc -l`)
- ✅ No technical code (verified with grep)
- ✅ ALL "Fichiers à analyser" were read
- ✅ ALL "Critères d'acceptance" verified individually
- ✅ Zero "TODO" or "Future Work" sections
- ✅ Frontmatter status = DONE

If ANY of these fails: Ticket is NOT done. Keep IN_PROGRESS.
