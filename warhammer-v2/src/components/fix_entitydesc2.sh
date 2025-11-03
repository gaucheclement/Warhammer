#!/bin/bash

# Remove empty if blocks left after parseInt removal
sed -i '/if (typeof .* === '"'"'string'"'"' && \/\^\d\+\$\/.test(.*)) {$/,/^    }$/ {
  /if (typeof .* === '"'"'string'"'"' && \/\^\d\+\$\/.test(.*)) {$/d
  /^    }$/d
}' EntityDescription.svelte

# Also remove comment about normalization for clickedId since we don't normalize anymore
sed -i '/Normalize ID: data attributes are always strings, convert to number if appropriate/d' EntityDescription.svelte

echo "Fixed empty blocks"
