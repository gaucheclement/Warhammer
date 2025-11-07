# Executing Audit Tickets - Skill Documentation

## Purpose

This skill enforces strict compliance when processing audit tickets in the Warhammer audit system. It prevents rationalization and ensures 100% criteria completion before marking tickets DONE.

## Testing Summary

**RED Phase (Baseline):**
- Agent violated 200-line limit (264 lines, 32% over)
- Marked DONE without verifying criteria
- Rationalization: "slightly over" and "complete justifies overage"

**GREEN Phase (With Skill):**
- Agent respected 200-line limit (160 lines)
- Explicitly verified all 8 criteria
- No rationalization

**REFACTOR Phase:**
- Test 1 (Extreme pressure): Agent resisted deadline + authority + exhaustion
- Test 2 (Complexity): Agent found creative solutions instead of exceptions
- No new loopholes discovered

**Verdict:** Bulletproof. Ready for production use.

## Usage

### For Main Agent (You)

When starting audit work:
```
Execute ticket #NNN using the executing-audit-tickets skill.
```

When delegating to subagent:
```
Process ticket #NNN following the executing-audit-tickets skill strictly.
```

### For Subagents

The skill is automatically loaded when working in `audit/` directory. Core rules:
1. Read ALL listed files
2. 200 lines is a hard limit (no exceptions)
3. Zero technical code in documentation
4. Verify ALL criteria before marking DONE
5. No "Future Work" allowed

## Test Files

- `test-scenarios/baseline-pressure-test.md` - Initial baseline without skill
- `test-scenarios/green-phase-results.md` - Verification with skill
- `test-scenarios/refactor-phase-results.md` - Stress testing results

## Key Metrics

| Metric | Baseline | With Skill |
|--------|----------|------------|
| Line count compliance | 0% | 100% |
| Criteria verification | Skipped | Complete |
| Rationalization | Present | Eliminated |

## Design Principles

1. **Binary criteria**: < 200 means < 200, not ~200
2. **Pre-emptive blocking**: Rationalization table blocks common excuses
3. **Concrete verification**: `wc -l` removes subjectivity
4. **Core principle**: Criteria define DONE, not judgment

## TDD Cycle Applied

This skill was developed using Test-Driven Development for documentation:
- **RED**: Documented failing behavior without skill
- **GREEN**: Wrote minimal skill to fix violations
- **REFACTOR**: Stress-tested to find new loopholes (none found)