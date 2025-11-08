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

### Rule 6: Check Patterns Before Creating

**Requirement:** Verify content doesn't duplicate existing `audit/patterns/`.

**Process:** Read `_index.md` → Grep for similar → If exists: reference it (`Voir [pattern-name.md](../patterns/pattern-name.md)`) → If new: create it.

### Rule 7: Consolidate Duplicates Into Patterns

**Requirement:** If `features/` or `business-rules/` contains reusable content (≥2 uses OR atomic behavior):

**Process:** Extract → create `patterns/pattern-[name].md` → Update `_index.md` → Replace original with reference → Verify.

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
3. Check patterns (Rule 6): Read `_index.md`, search for duplicates
4. Check consolidation (Rule 7): Grep features/business-rules for extractable content
5. Read EACH acceptance criterion
6. Verify EACH is met (explicitly, not assuming)
7. If ANY criterion fails → Fix OR keep IN_PROGRESS
8. Only if ALL pass → Update frontmatter to DONE

### After Marking DONE

1. Update `audit/tickets/_status.md`:
   - Increment DONE count, decrement TODO/IN_PROGRESS
   - Update domain progress stats
   - Update global progress bar
2. Commit and push:
   - `git add` ticket + created files + _status.md
   - Commit message: "Audit: [ticket title]"
   - `git push` to remote

## Rationalization Table

| Excuse | Reality |
|--------|---------|
| "Légèrement/slightly" over 200 lines OR "Complete justifies overage" | Still a violation. Quality AND limits both required. |
| "Doc is useful, that's what matters" OR "Criteria obviously met" | Useful+compliant both required. Obvious ≠ verified. |
| "Good enough" OR "I can mark DONE, criteria implied" | "Good enough" = IN_PROGRESS. DONE = explicit verification. |
| "Too much content to cut" OR "Violates spirit not letter" | Prioritization IS the task. Violating letter = violating spirit. |

## Red Flags - STOP and Fix

If thinking ANY of these, you're about to violate:
- "Just X lines over" / "Quality beats limits" / "Essentially complete"
- "Checking criteria is tedious" / "Good enough to move forward"
- Adding "TODO/Future Work" / Including code snippets "for reference"

**STOP. Re-read Core Rules. Fix violations BEFORE marking DONE.**

## Common Mistakes

**Confusing "work done" with "criteria met":**
- ❌ "I documented the table, ticket is done."
- ✅ "Does it meet ALL criteria? Let me verify each one."

**Minimizing violations:**
- ❌ "264 lines is only slightly over" OR "200 is a guideline"
- ✅ "264 > 200. Reduce or split." 200 is a hard requirement.

**Skipping verification:**
- ❌ Updates frontmatter to DONE without reviewing criteria
- ✅ Reads each criterion, verifies, THEN updates frontmatter

## Success Criteria

Ticket properly DONE when ALL true:
- ✅ Output < 200 lines (`wc -l`) + No technical code (grep)
- ✅ ALL "Fichiers à analyser" read + ALL criteria verified
- ✅ No "TODO/Future Work" + Patterns checked (Rule 6+7)
- ✅ Frontmatter DONE + _status updated + Committed/pushed

If ANY fails: Keep IN_PROGRESS.
