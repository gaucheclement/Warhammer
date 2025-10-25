#!/bin/bash

# Bidirectional sync between local task files and GitHub issues
# Usage: /pm:sync [epic_name]

REPO="gaucheclement/Warhammer"
epic_name="${1:-v2}"
EPIC_DIR=".claude/epics/$epic_name"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔄 Starting Bidirectional Sync${NC}"
echo ""

# Validate epic directory exists
if [ ! -d "$EPIC_DIR" ]; then
    echo -e "${RED}❌ Epic directory not found: $EPIC_DIR${NC}"
    echo ""
    echo "Available epics:"
    for dir in .claude/epics/*/; do
        [ -d "$dir" ] && echo "  • $(basename "$dir")"
    done
    exit 1
fi

# Get current timestamp
current_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Fetch GitHub state
echo -e "${BLUE}📥 Pulling from GitHub...${NC}"
gh issue list --label "task" --limit 1000 --json number,title,state,body,updatedAt --repo "$REPO" > /tmp/gh-tasks-sync.json 2>&1
gh issue list --label "epic" --limit 1000 --json number,title,state,body,updatedAt --repo "$REPO" > /tmp/gh-epics-sync.json 2>&1

# Parse GitHub data
declare -A gh_issues
declare -A gh_states
declare -A gh_updated

while IFS= read -r line; do
    number=$(echo "$line" | grep -o '"number":[0-9]*' | cut -d: -f2)
    state=$(echo "$line" | grep -o '"state":"[^"]*"' | cut -d'"' -f4)
    updated=$(echo "$line" | grep -o '"updatedAt":"[^"]*"' | cut -d'"' -f4)

    if [ -n "$number" ]; then
        gh_issues[$number]=1
        gh_states[$number]="$state"
        gh_updated[$number]="$updated"
    fi
done < <(cat /tmp/gh-tasks-sync.json /tmp/gh-epics-sync.json 2>/dev/null | grep -o '{[^}]*}')

echo -e "${GREEN}✓ Found ${#gh_issues[@]} issues on GitHub${NC}"
echo ""

# Counters
gh_to_local=0
local_to_gh=0
archived_count=0
conflicts=0

echo -e "${BLUE}📂 Processing local files...${NC}"
echo ""

# Process each local file
for file in "$EPIC_DIR"/*.md; do
    [ -f "$file" ] || continue
    filename=$(basename "$file" .md)

    # Skip special files
    [ "$filename" = "epic" ] && continue
    [ "$filename" = "github-mapping" ] && continue
    [[ "$filename" =~ -analysis$ ]] && continue

    # Get issue number from filename or github URL
    if [[ "$filename" =~ ^[0-9]+$ ]]; then
        issue_num="$filename"
    else
        github_url=$(grep "^github:" "$file" | head -1 | sed 's/github: *//')
        if [ -n "$github_url" ]; then
            issue_num=$(echo "$github_url" | grep -o '[0-9]*$')
        else
            # No GitHub URL - needs to be created
            echo -e "${YELLOW}⚠️  No GitHub issue for: $filename${NC}"
            echo "   Run /pm:epic-sync to create issues for new tasks"
            echo ""
            continue
        fi
    fi

    # Check if issue exists on GitHub
    if [ -z "${gh_issues[$issue_num]}" ]; then
        # Issue deleted on GitHub
        github_url=$(grep "^github:" "$file" | head -1)
        if [ -n "$github_url" ]; then
            echo -e "${YELLOW}📦 Archiving #$issue_num (deleted on GitHub)${NC}"
            echo "   File: $filename"

            # Add archived status if not already present
            if ! grep -q "^archived:" "$file"; then
                sed -i "/^status:/a archived: true\narchived_at: $current_time\narchived_reason: GitHub issue deleted" "$file"
                ((archived_count++))
            fi
            echo ""
        fi
    else
        # Issue exists on GitHub
        gh_state="${gh_states[$issue_num]}"
        gh_time="${gh_updated[$issue_num]}"

        local_time=$(grep "^updated:" "$file" | head -1 | sed 's/updated: *//')
        local_sync=$(grep "^last_sync:" "$file" | head -1 | sed 's/last_sync: *//')
        local_status=$(grep "^status:" "$file" | head -1 | sed 's/status: *//')

        # Determine sync direction
        gh_changed=false
        local_changed=false

        if [ -n "$local_sync" ]; then
            # Has been synced - check if changed since
            [ "$gh_time" \> "$local_sync" ] && gh_changed=true
            [ "$local_time" \> "$local_sync" ] && local_changed=true
        else
            # Never synced - check if GH is newer
            if [ -n "$local_time" ] && [ "$gh_time" \> "$local_time" ]; then
                gh_changed=true
            elif [ -z "$local_time" ]; then
                gh_changed=true
            fi
        fi

        # Handle sync based on what changed
        if [ "$gh_changed" = true ] && [ "$local_changed" = true ]; then
            # Conflict - both changed
            echo -e "${RED}⚠️  Conflict detected: #$issue_num${NC}"
            echo "   File: $filename"
            echo "   GitHub updated: $gh_time"
            echo "   Local updated: $local_time"
            echo "   Last sync: ${local_sync:-never}"
            echo "   Keeping local version (manual resolution needed)"
            ((conflicts++))
            echo ""

        elif [ "$gh_changed" = true ]; then
            # Pull from GitHub
            echo -e "${GREEN}⬇️  Updating #$issue_num from GitHub${NC}"
            echo "   File: $filename"

            # Map GitHub state to local status
            gh_status_mapped=""
            case "$gh_state" in
                "OPEN") gh_status_mapped="open" ;;
                "CLOSED") gh_status_mapped="completed" ;;
                *) gh_status_mapped="open" ;;
            esac

            # Update status if changed
            if [ "$local_status" != "$gh_status_mapped" ]; then
                echo "   Status: $local_status → $gh_status_mapped"
                sed -i "s/^status: .*/status: $gh_status_mapped/" "$file"

                # Add completed timestamp if closed
                if [ "$gh_status_mapped" = "completed" ] && ! grep -q "^completed:" "$file"; then
                    sed -i "/^status:/a completed: $gh_time" "$file"
                fi
            fi

            # Update timestamps
            sed -i "s/^updated: .*/updated: $gh_time/" "$file"
            if grep -q "^last_sync:" "$file"; then
                sed -i "s/^last_sync: .*/last_sync: $current_time/" "$file"
            else
                sed -i "/^updated:/a last_sync: $current_time" "$file"
            fi

            ((gh_to_local++))
            echo ""

        elif [ "$local_changed" = true ]; then
            # Push to GitHub
            echo -e "${BLUE}⬆️  Updating GitHub #$issue_num from local${NC}"
            echo "   File: $filename"

            # Update GitHub issue
            gh issue edit "$issue_num" --body-file "$file" --repo "$REPO" 2>&1

            # Update local sync timestamp
            if grep -q "^last_sync:" "$file"; then
                sed -i "s/^last_sync: .*/last_sync: $current_time/" "$file"
            else
                sed -i "/^updated:/a last_sync: $current_time" "$file"
            fi

            ((local_to_gh++))
            echo ""
        fi
    fi
done

# Summary
echo ""
echo -e "${GREEN}✅ Sync Complete${NC}"
echo ""
echo -e "${BLUE}GitHub → Local:${NC}"
echo "  Updated: $gh_to_local files"
echo "  Archived: $archived_count files"
echo ""
echo -e "${BLUE}Local → GitHub:${NC}"
echo "  Updated: $local_to_gh issues"
echo ""

if [ $conflicts -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Conflicts: $conflicts files need manual resolution${NC}"
    echo ""
fi

echo -e "${GREEN}Status: All files synced${NC}"

# Cleanup
rm -f /tmp/gh-tasks-sync.json /tmp/gh-epics-sync.json
