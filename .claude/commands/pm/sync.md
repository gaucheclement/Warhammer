---
description: Bidirectional sync between local and GitHub
---

Run the sync script:

```bash
bash .claude/scripts/pm/sync.sh v2
```

This command performs a full bidirectional sync between local task files and GitHub issues:

**GitHub → Local:**
- Updates local files when GitHub issues are newer
- Closes local tasks when GitHub issues are closed
- Archives local files when GitHub issues are deleted

**Local → GitHub:**
- Pushes local changes to GitHub when local files are newer
- Updates GitHub issue bodies from local markdown files

**Conflict Detection:**
- Identifies when both local and GitHub changed since last sync
- Reports conflicts for manual resolution

The sync uses `last_sync` timestamps to determine what changed since the last sync operation.
