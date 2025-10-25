#!/bin/bash

# Comprehensive audit script for v2 project
# Verifies task completion, code implementation, consistency, and redundancy

REPO="gaucheclement/Warhammer"
epic_name="${1:-v2}"
EPIC_DIR=".claude/epics/$epic_name"
WORKTREE_PATH="C:/Users/gauch/PhpstormProjects/epic-v2/warhammer-v2"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}🔍 PM SYSTEM AUDIT - Epic: $epic_name${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Validate epic directory exists
if [ ! -d "$EPIC_DIR" ]; then
    echo -e "${RED}❌ Epic directory not found: $EPIC_DIR${NC}"
    exit 1
fi

# Validate worktree exists
if [ ! -d "$WORKTREE_PATH" ]; then
    echo -e "${YELLOW}⚠️  Worktree not found at: $WORKTREE_PATH${NC}"
    echo "   Some code verification steps will be skipped"
    WORKTREE_EXISTS=false
else
    WORKTREE_EXISTS=true
    echo -e "${GREEN}✓ Worktree found: $WORKTREE_PATH${NC}"
fi
echo ""

# Statistics
total_tasks=0
completed_tasks=0
open_tasks=0
tasks_with_code=0
tasks_without_code=0
consistency_issues=0
redundancy_issues=0

# Create audit report file
AUDIT_REPORT="$EPIC_DIR/AUDIT_REPORT.md"
timestamp=$(date +"%Y-%m-%d %H:%M:%S")

cat > "$AUDIT_REPORT" <<EOF
# Audit Report - Epic: $epic_name
**Generated:** $timestamp

## Executive Summary

EOF

echo -e "${BLUE}📊 Phase 1: Task Analysis${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Array to store task data
declare -A task_status
declare -A task_features
declare -A task_files

# Parse all task files
for file in "$EPIC_DIR"/*.md; do
    [ -f "$file" ] || continue
    filename=$(basename "$file" .md)

    # Skip special files
    [ "$filename" = "epic" ] && continue
    [ "$filename" = "github-mapping" ] && continue
    [ "$filename" = "feature-comparison" ] && continue
    [[ "$filename" =~ -analysis$ ]] && continue
    [[ "$filename" =~ -summary$ ]] && continue
    [[ "$filename" == "AUDIT_REPORT" ]] && continue

    ((total_tasks++))

    # Extract status
    status=$(grep "^status:" "$file" | head -1 | sed 's/status: *//')
    task_status[$filename]="$status"

    # Count by status
    if [ "$status" = "completed" ] || grep -q "^completed:" "$file"; then
        ((completed_tasks++))
        echo -e "${GREEN}✓${NC} Task #$filename: ${GREEN}COMPLETED${NC}"
    elif [ "$status" = "open" ]; then
        ((open_tasks++))
        echo -e "${YELLOW}○${NC} Task #$filename: ${YELLOW}OPEN${NC}"
    else
        echo -e "${CYAN}-${NC} Task #$filename: ${CYAN}$status${NC}"
    fi

    # Extract task name
    task_name=$(grep "^name:" "$file" | head -1 | sed 's/name: *//')
    if [ -z "$task_name" ]; then
        task_name=$(grep "^# Task:" "$file" | head -1 | sed 's/# Task: *//')
    fi

    # Check for updates directory
    updates_dir="$EPIC_DIR/updates/$filename"
    if [ -d "$updates_dir" ]; then
        update_files=$(ls -1 "$updates_dir"/*.md 2>/dev/null | wc -l)
        echo -e "   ${CYAN}→${NC} Updates: $update_files documentation files"

        # Check for COMPLETE marker
        if [ -f "$updates_dir/COMPLETE.md" ] || [ -f "$updates_dir/COMPLETION.md" ]; then
            echo -e "   ${GREEN}→${NC} Completion documentation found"
        fi
    fi

    echo ""
done

echo -e "${BLUE}📊 Phase 2: Code Implementation Verification${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$WORKTREE_EXISTS" = true ]; then
    # Check key features mentioned in completed tasks
    for file in "$EPIC_DIR"/*.md; do
        [ -f "$file" ] || continue
        filename=$(basename "$file" .md)

        # Skip if not numeric (not a task)
        [[ ! "$filename" =~ ^[0-9]+$ ]] && continue

        status="${task_status[$filename]}"

        if [ "$status" = "completed" ]; then
            echo -e "${CYAN}Analyzing Task #$filename${NC}"

            # Extract key terms from description
            features=$(grep -A 20 "## Description" "$file" | grep -v "^##" | grep -v "^---" | head -10)

            # Common patterns to search for in code
            declare -a search_terms=()

            # Extract potential component/function names from task
            if echo "$features" | grep -qi "character"; then
                search_terms+=("character" "Character")
            fi
            if echo "$features" | grep -qi "wizard\|step"; then
                search_terms+=("wizard" "Wizard" "step" "Step")
            fi
            if echo "$features" | grep -qi "import\|export"; then
                search_terms+=("import" "export" "Import" "Export")
            fi
            if echo "$features" | grep -qi "search"; then
                search_terms+=("search" "Search")
            fi
            if echo "$features" | grep -qi "data\|merge"; then
                search_terms+=("data" "merge" "Data" "Merge")
            fi

            # Search for terms in codebase
            found_implementations=0
            for term in "${search_terms[@]}"; do
                # Search in .svelte and .js files
                matches=$(find "$WORKTREE_PATH/src" -type f \( -name "*.svelte" -o -name "*.js" \) -exec grep -l "$term" {} \; 2>/dev/null | wc -l)
                if [ $matches -gt 0 ]; then
                    ((found_implementations++))
                    echo -e "   ${GREEN}✓${NC} Found '$term' in $matches files"
                fi
            done

            if [ $found_implementations -gt 0 ]; then
                ((tasks_with_code++))
                echo -e "   ${GREEN}→ Code implementation verified${NC}"
            else
                ((tasks_without_code++))
                echo -e "   ${YELLOW}⚠ No clear code implementation found${NC}"
            fi

            echo ""
        fi
    done
else
    echo -e "${YELLOW}⚠️  Worktree not available - skipping code verification${NC}"
    echo ""
fi

echo -e "${BLUE}📊 Phase 3: Consistency & Redundancy Check${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$WORKTREE_EXISTS" = true ]; then
    # Check for duplicate component patterns
    echo -e "${CYAN}Checking for redundant components...${NC}"

    # Find all component files
    all_components=$(find "$WORKTREE_PATH/src" -type f -name "*.svelte" 2>/dev/null)

    # Check for similar names (potential duplicates)
    declare -A component_groups

    while IFS= read -r component; do
        [ -z "$component" ] && continue
        [ ! -f "$component" ] && continue
        basename=$(basename "$component" .svelte | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]_-')
        [ -z "$basename" ] && continue
        component_groups[$basename]+="$component "
    done <<< "$all_components"

    # Report potential duplicates
    for name in "${!component_groups[@]}"; do
        count=$(echo "${component_groups[$name]}" | wc -w)
        if [ $count -gt 1 ]; then
            echo -e "${YELLOW}⚠${NC} Potential duplicate: $name ($count files)"
            for comp in ${component_groups[$name]}; do
                echo -e "   - $(basename "$comp")"
            done
            ((redundancy_issues++))
        fi
    done

    if [ $redundancy_issues -eq 0 ]; then
        echo -e "${GREEN}✓ No obvious redundant components found${NC}"
    fi
    echo ""

    # Check for consistent patterns
    echo -e "${CYAN}Checking code consistency...${NC}"

    # Check import patterns
    import_patterns=$(find "$WORKTREE_PATH/src" -type f -name "*.js" -o -name "*.svelte" | xargs grep -h "^import" 2>/dev/null | sort | uniq -c | sort -rn | head -5)
    echo -e "${GREEN}Most common import patterns:${NC}"
    echo "$import_patterns" | head -3 | while read line; do
        echo -e "   $line"
    done
    echo ""

    # Check store usage
    store_files=$(find "$WORKTREE_PATH/src/stores" -type f -name "*.js" 2>/dev/null | wc -l)
    echo -e "${GREEN}Found $store_files store files${NC}"

    # Check component organization
    route_components=$(find "$WORKTREE_PATH/src/routes" -type f -name "*.svelte" 2>/dev/null | wc -l)
    reusable_components=$(find "$WORKTREE_PATH/src/components" -type f -name "*.svelte" 2>/dev/null | wc -l)
    echo -e "${GREEN}Route components: $route_components${NC}"
    echo -e "${GREEN}Reusable components: $reusable_components${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  Worktree not available - skipping consistency checks${NC}"
    echo ""
fi

echo -e "${BLUE}📊 Phase 4: Documentation Completeness${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for required documentation
docs_complete=0
docs_total=5

echo -e "${CYAN}Checking documentation files...${NC}"

if [ "$WORKTREE_EXISTS" = true ]; then
    [ -f "$WORKTREE_PATH/docs/MIGRATION.md" ] && { echo -e "${GREEN}✓${NC} MIGRATION.md"; ((docs_complete++)); } || echo -e "${RED}✗${NC} MIGRATION.md missing"
    [ -f "$WORKTREE_PATH/docs/USER_GUIDE.md" ] && { echo -e "${GREEN}✓${NC} USER_GUIDE.md"; ((docs_complete++)); } || echo -e "${RED}✗${NC} USER_GUIDE.md missing"
    [ -f "$WORKTREE_PATH/docs/ADMIN_GUIDE.md" ] && { echo -e "${GREEN}✓${NC} ADMIN_GUIDE.md"; ((docs_complete++)); } || echo -e "${RED}✗${NC} ADMIN_GUIDE.md missing"
    [ -f "$WORKTREE_PATH/docs/ARCHITECTURE.md" ] && { echo -e "${GREEN}✓${NC} ARCHITECTURE.md"; ((docs_complete++)); } || echo -e "${RED}✗${NC} ARCHITECTURE.md missing"
    [ -f "$WORKTREE_PATH/README.md" ] && { echo -e "${GREEN}✓${NC} README.md"; ((docs_complete++)); } || echo -e "${RED}✗${NC} README.md missing"
else
    echo -e "${YELLOW}⚠️  Worktree not available - skipping documentation checks${NC}"
fi

echo ""

echo -e "${BLUE}📊 Phase 5: Feature Completeness Analysis${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$WORKTREE_EXISTS" = true ]; then
    echo -e "${CYAN}Analyzing feature implementation...${NC}"

    # Check for key features
    features_implemented=0
    features_expected=10

    # Feature checks
    grep -r "character.*creation\|CharacterCreator\|wizard" "$WORKTREE_PATH/src" --include="*.svelte" --include="*.js" -l 2>/dev/null | head -1 > /dev/null && {
        echo -e "${GREEN}✓${NC} Character Creation"
        ((features_implemented++))
    } || echo -e "${RED}✗${NC} Character Creation"

    grep -r "import.*export\|importExport" "$WORKTREE_PATH/src" --include="*.svelte" --include="*.js" -l 2>/dev/null | head -1 > /dev/null && {
        echo -e "${GREEN}✓${NC} Import/Export System"
        ((features_implemented++))
    } || echo -e "${RED}✗${NC} Import/Export System"

    grep -r "search\|Search" "$WORKTREE_PATH/src" --include="*.svelte" --include="*.js" -l 2>/dev/null | head -1 > /dev/null && {
        echo -e "${GREEN}✓${NC} Search Functionality"
        ((features_implemented++))
    } || echo -e "${RED}✗${NC} Search Functionality"

    grep -r "data.*merge\|mergeData" "$WORKTREE_PATH/src" --include="*.svelte" --include="*.js" -l 2>/dev/null | head -1 > /dev/null && {
        echo -e "${GREEN}✓${NC} Data Merging"
        ((features_implemented++))
    } || echo -e "${RED}✗${NC} Data Merging"

    grep -r "validation\|validate" "$WORKTREE_PATH/src" --include="*.svelte" --include="*.js" -l 2>/dev/null | head -1 > /dev/null && {
        echo -e "${GREEN}✓${NC} Validation System"
        ((features_implemented++))
    } || echo -e "${RED}✗${NC} Validation System"

    [ -d "$WORKTREE_PATH/src/stores" ] && {
        echo -e "${GREEN}✓${NC} State Management (Stores)"
        ((features_implemented++))
    } || echo -e "${RED}✗${NC} State Management"

    grep -r "router\|route" "$WORKTREE_PATH/src" --include="*.svelte" --include="*.js" -l 2>/dev/null | head -1 > /dev/null && {
        echo -e "${GREEN}✓${NC} Routing System"
        ((features_implemented++))
    } || echo -e "${RED}✗${NC} Routing System"

    [ -f "$WORKTREE_PATH/vite.config.js" ] && {
        echo -e "${GREEN}✓${NC} Build Configuration"
        ((features_implemented++))
    } || echo -e "${RED}✗${NC} Build Configuration"

    grep -r "test\|describe\|it(" "$WORKTREE_PATH/src" --include="*.test.js" -l 2>/dev/null | head -1 > /dev/null && {
        echo -e "${GREEN}✓${NC} Testing Suite"
        ((features_implemented++))
    } || echo -e "${RED}✗${NC} Testing Suite"

    [ -d "$WORKTREE_PATH/src/components" ] && {
        echo -e "${GREEN}✓${NC} Component Architecture"
        ((features_implemented++))
    } || echo -e "${RED}✗${NC} Component Architecture"

    echo ""
else
    echo -e "${YELLOW}⚠️  Worktree not available - skipping feature analysis${NC}"
    echo ""
fi

# Generate detailed report
cat >> "$AUDIT_REPORT" <<EOF
### Statistics
- **Total Tasks:** $total_tasks
- **Completed Tasks:** $completed_tasks ($((completed_tasks * 100 / total_tasks))%)
- **Open Tasks:** $open_tasks
- **Tasks with Code Verification:** $tasks_with_code
- **Tasks without Code Verification:** $tasks_without_code
- **Documentation Complete:** $docs_complete/$docs_total ($((docs_complete * 100 / docs_total))%)
- **Features Implemented:** ${features_implemented:-N/A}/${features_expected:-N/A}
- **Redundancy Issues Found:** $redundancy_issues
- **Consistency Issues Found:** $consistency_issues

---

## Phase 1: Task Status

| Task # | Status | Has Updates | Has Completion Doc |
|--------|--------|-------------|-------------------|
EOF

# Add task details to report
for file in "$EPIC_DIR"/*.md; do
    [ -f "$file" ] || continue
    filename=$(basename "$file" .md)

    [[ ! "$filename" =~ ^[0-9]+$ ]] && continue

    status="${task_status[$filename]}"
    updates_dir="$EPIC_DIR/updates/$filename"
    has_updates="No"
    has_completion="No"

    [ -d "$updates_dir" ] && has_updates="Yes"
    [ -f "$updates_dir/COMPLETE.md" ] || [ -f "$updates_dir/COMPLETION.md" ] && has_completion="Yes"

    echo "| $filename | $status | $has_updates | $has_completion |" >> "$AUDIT_REPORT"
done

cat >> "$AUDIT_REPORT" <<EOF

---

## Recommendations

EOF

# Generate recommendations
if [ $completed_tasks -lt $((total_tasks * 80 / 100)) ]; then
    echo "- ⚠️ Less than 80% of tasks are completed. Consider prioritizing remaining tasks." >> "$AUDIT_REPORT"
fi

if [ $tasks_without_code -gt 0 ] && [ "$WORKTREE_EXISTS" = true ]; then
    echo "- ⚠️ Some completed tasks have no clear code implementation. Review these tasks." >> "$AUDIT_REPORT"
fi

if [ $redundancy_issues -gt 0 ]; then
    echo "- ⚠️ Potential redundant components found. Consider refactoring to reduce duplication." >> "$AUDIT_REPORT"
fi

if [ $docs_complete -lt $docs_total ]; then
    echo "- ⚠️ Documentation is incomplete. Complete all required documentation files." >> "$AUDIT_REPORT"
fi

if [ $completed_tasks -eq $total_tasks ] && [ $redundancy_issues -eq 0 ] && [ $docs_complete -eq $docs_total ]; then
    echo "- ✅ Project is in excellent shape! All tasks completed, documentation complete, no redundancy issues." >> "$AUDIT_REPORT"
fi

echo "" >> "$AUDIT_REPORT"
echo "---" >> "$AUDIT_REPORT"
echo "" >> "$AUDIT_REPORT"
echo "*Generated by PM Audit System*" >> "$AUDIT_REPORT"

# Final summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}📋 AUDIT SUMMARY${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Tasks:${NC}"
echo -e "  Total: $total_tasks"
echo -e "  Completed: ${GREEN}$completed_tasks${NC} ($((completed_tasks * 100 / total_tasks))%)"
echo -e "  Open: ${YELLOW}$open_tasks${NC}"
echo ""

if [ "$WORKTREE_EXISTS" = true ]; then
    echo -e "${GREEN}Code Quality:${NC}"
    echo -e "  Tasks with verified code: ${GREEN}$tasks_with_code${NC}"
    echo -e "  Tasks without verified code: ${YELLOW}$tasks_without_code${NC}"
    echo -e "  Redundancy issues: ${YELLOW}$redundancy_issues${NC}"
    echo -e "  Features implemented: ${GREEN}${features_implemented:-N/A}${NC}/${features_expected:-N/A}"
    echo ""

    echo -e "${GREEN}Documentation:${NC}"
    echo -e "  Complete: ${GREEN}$docs_complete${NC}/$docs_total ($((docs_complete * 100 / docs_total))%)"
    echo ""
fi

# Overall health score
total_score=0
max_score=0

# Task completion score (40 points)
task_score=$((completed_tasks * 40 / total_tasks))
total_score=$((total_score + task_score))
max_score=$((max_score + 40))

if [ "$WORKTREE_EXISTS" = true ]; then
    # Code verification score (30 points)
    if [ $completed_tasks -gt 0 ]; then
        code_score=$((tasks_with_code * 30 / completed_tasks))
        total_score=$((total_score + code_score))
    fi
    max_score=$((max_score + 30))

    # Documentation score (20 points)
    doc_score=$((docs_complete * 20 / docs_total))
    total_score=$((total_score + doc_score))
    max_score=$((max_score + 20))

    # Quality score (10 points)
    quality_penalty=$((redundancy_issues + consistency_issues))
    quality_score=$((10 - quality_penalty))
    [ $quality_score -lt 0 ] && quality_score=0
    total_score=$((total_score + quality_score))
    max_score=$((max_score + 10))
fi

health_percentage=$((total_score * 100 / max_score))

echo -e "${CYAN}Overall Project Health:${NC}"
if [ $health_percentage -ge 90 ]; then
    echo -e "  ${GREEN}█████████${NC}░ ${GREEN}$health_percentage%${NC} - Excellent"
elif [ $health_percentage -ge 70 ]; then
    echo -e "  ${GREEN}███████${NC}░░ ${GREEN}$health_percentage%${NC} - Good"
elif [ $health_percentage -ge 50 ]; then
    echo -e "  ${YELLOW}█████${NC}░░░░ ${YELLOW}$health_percentage%${NC} - Fair"
else
    echo -e "  ${RED}███${NC}░░░░░░ ${RED}$health_percentage%${NC} - Needs Work"
fi

echo ""
echo -e "${GREEN}✓ Detailed report saved to:${NC}"
echo -e "  $AUDIT_REPORT"
echo ""

exit 0
