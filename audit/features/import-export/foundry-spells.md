# Export Foundry - Sorts

## Contexte

Transformation sorts (spells) personnage vers format Foundry items type "spell". Préservation domaine magie (lore), CN, portée, durée, ingrédients.

## Structure Sorts

**Application** : Character.getSpells() → array objets {id, data: {label, lore, cn, range, target, duration, ingredient}}
**Foundry** : items array → {name, type: "spell", data: {lore, cn, range, target, duration, ingredient}}

### Mapping Noms

FR → EN via table mapping
- "Flèche enflammée" → "Flaming Arrow"
- "Projectile magique" → "Magic Dart"
- "Protection contre le mal" → "Ward Against Evil"

### Domaines Magie

**Application** : lore string ("Céleste", "Feu", "Ombres", "Petit", "Arcanique")
**Foundry** : data.lore.value string EN ("Heavens", "Fire", "Shadow", "Petty", "Arcane")

**Mapping lores** : Table foundry type="lore"

## Caractéristiques Sort

**CN (Nombre Incantation)** : data.cn.value (nombre, préservé tel quel)
**Portée** : data.range.value (string "Vous", "10 mètres", etc.)
**Cible** : data.target.value (string "1 créature", "Zone 5m", etc.)
**Durée** : data.duration.value (string "Instantané", "1 minute", "Permanent")
**Ingrédient** : data.ingredient.value (string description composant)

## Exemples Concrets

### Sort Petite Magie (Lumière)

**App** : {label: "Lumière", lore: "Petit", cn: 2, range: "Vous", duration: "1 heure"}
**Foundry** : {name: "Light", type: "spell", data: {lore: "Petty", cn: 2, range: "You", duration: "1 hour"}}

### Sort Domaine (Flèche Enflammée)

**App** : {label: "Flèche enflammée", lore: "Feu", cn: 5, range: "48 mètres", target: "1 créature", duration: "Instantané", ingredient: "Pincée de cendres"}
**Foundry** : {name: "Flaming Arrow", type: "spell", data: {lore: "Fire", cn: 5, range: "48 yards", target: "1 creature", duration: "Instant", ingredient: "Pinch of ash"}}

### Sort Complexe (Ailes Célestes)

**App** : Plusieurs effets, ingrédient rare, CN élevé
**Foundry** : Même structure, description détaillée préservée data.description

## Traduction Champs

**Texte libre** : Portée, cible, durée, ingrédient traduits FR → EN
**Fallback** : Si pas dans mapping, préserver FR (utilisateur Foundry anglophone peut éditer)

## Voir Aussi

- [foundry-mapping.md](./foundry-mapping.md) - Correspondance sorts et lores
- [../wizard/spells-lore.md](../wizard/spells-lore.md) - Gestion domaines magie
- [../magic/spells-display.md](../magic/spells-display.md) - Affichage sorts
