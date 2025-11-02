#!/bin/bash

# Issue #47: Update ENTITY_RELATIONSHIP_CONFIG for EntityReference objects
#
# After db-loader transformation, fields like talents, skills, traits are
# now arrays of EntityReference objects, not comma-separated strings.
#
# We need to move these from stringReferences to arrayReferences.

FILE="db-relations.js"
cp "$FILE" "${FILE}.bak"

# TALENTS - Move from stringReferences to arrayReferences
# Remove string references for talents in careerLevels, species, creatures
sed -i '/{ table: '"'"'careerLevels'"'"', field: '"'"'talents'"'"', indexed: false, parseList: true },/d' "$FILE"
sed -i '/{ table: '"'"'species'"'"', field: '"'"'talents'"'"', indexed: false, parseList: true },/d' "$FILE"
sed -i '/{ table: '"'"'creatures'"'"', field: '"'"'talents'"'"', indexed: false, parseList: true },/d' "$FILE"

# Add array references for talents
sed -i '/^  talents: {$/,/^    arrayReferences: \[\],$/c\
  talents: {\
    arrayReferences: [\
      { table: '"'"'careerLevels'"'"', field: '"'"'talents'"'"', type: '"'"'array'"'"' },\
      { table: '"'"'species'"'"', field: '"'"'talents'"'"', type: '"'"'array'"'"' },\
      { table: '"'"'creatures'"'"', field: '"'"'talents'"'"', type: '"'"'array'"'"' }\
    ],' "$FILE"

# SKILLS - Move from stringReferences to arrayReferences  
# Remove string references for skills in careerLevels, species, creatures
sed -i '/{ table: '"'"'careerLevels'"'"', field: '"'"'skills'"'"', indexed: false, parseList: true },/d' "$FILE"
sed -i '/{ table: '"'"'species'"'"', field: '"'"'skills'"'"', indexed: false, parseList: true },/d' "$FILE"
sed -i '/{ table: '"'"'creatures'"'"', field: '"'"'skills'"'"', indexed: false, parseList: true },/d' "$FILE"

# Add array references for skills
sed -i '/^  skills: {$/,/^    arrayReferences: \[\],$/c\
  skills: {\
    arrayReferences: [\
      { table: '"'"'careerLevels'"'"', field: '"'"'skills'"'"', type: '"'"'array'"'"' },\
      { table: '"'"'species'"'"', field: '"'"'skills'"'"', type: '"'"'array'"'"' },\
      { table: '"'"'creatures'"'"', field: '"'"'skills'"'"', type: '"'"'array'"'"' }\
    ],' "$FILE"

# TRAITS - Move from stringReferences to arrayReferences
sed -i '/{ table: '"'"'creatures'"'"', field: '"'"'traits'"'"', indexed: false, parseList: true }/d' "$FILE"

# Add array references for traits
sed -i '/^  traits: {$/,/^    arrayReferences: \[\],$/c\
  traits: {\
    arrayReferences: [\
      { table: '"'"'creatures'"'"', field: '"'"'traits'"'"', type: '"'"'array'"'"' },\
      { table: '"'"'creatures'"'"', field: '"'"'optionals'"'"', type: '"'"'array'"'"' }\
    ],' "$FILE"

# TRAPPINGS - Move from stringReferences to arrayReferences
sed -i '/{ table: '"'"'careerLevels'"'"', field: '"'"'trappings'"'"', indexed: false, parseList: true },/d' "$FILE"
sed -i '/{ table: '"'"'creatures'"'"', field: '"'"'trappings'"'"', indexed: false, parseList: true }/d' "$FILE"

# Update trappings array references (already has classes.trappings, add the others)
sed -i '/^  trappings: {$/,/^    arrayReferences: \[$/,/^    \],$/c\
  trappings: {\
    arrayReferences: [\
      { table: '"'"'classes'"'"', field: '"'"'trappings'"'"', type: '"'"'array'"'"' },\
      { table: '"'"'careerLevels'"'"', field: '"'"'trappings'"'"', type: '"'"'array'"'"' },\
      { table: '"'"'creatures'"'"', field: '"'"'trappings'"'"', type: '"'"'array'"'"' }\
    ],' "$FILE"

# SPELLS - Remove string reference for creatures.spells (already has array refs for gods)
sed -i '/{ table: '"'"'creatures'"'"', field: '"'"'spells'"'"', indexed: false, parseList: true }/d' "$FILE"

# Update spells array references
sed -i '/^  spells: {$/,/^    arrayReferences: \[$/,/^    \],$/c\
  spells: {\
    arrayReferences: [\
      { table: '"'"'gods'"'"', field: '"'"'blessings'"'"', type: '"'"'array'"'"' },\
      { table: '"'"'gods'"'"', field: '"'"'miracles'"'"', type: '"'"'array'"'"' },\
      { table: '"'"'talents'"'"', field: '"'"'spells'"'"', type: '"'"'array'"'"' },\
      { table: '"'"'creatures'"'"', field: '"'"'spells'"'"', type: '"'"'array'"'"' }\
    ],' "$FILE"

echo "Fixed ENTITY_RELATIONSHIP_CONFIG"
