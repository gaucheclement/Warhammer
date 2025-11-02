#!/bin/bash

# Remove parseInt normalization throughout EntityDescription.svelte
# Issue #47: Entity IDs are now strings like "skill-athletisme", not numbers

# Remove lines 77-79 (first normalization block in init)
sed -i '77,79d' EntityDescription.svelte

# Since we deleted 3 lines, all subsequent line numbers shift down by 3
# Original line 115 is now line 112
# But let's just run a global replacement instead

# Replace all parseInt normalization patterns
sed -i 's/if (typeof \(.*\) === '"'"'string'"'"' && \/\^\d\+\$\/.test(\1)) {/\/\/ Issue #47: IDs are now strings, no parseInt needed/' EntityDescription.svelte
sed -i '/normalizedId = parseInt(.*, 10);/d' EntityDescription.svelte
sed -i '/clickedId = parseInt(.*, 10);/d' EntityDescription.svelte

echo "Done fixing EntityDescription.svelte"
