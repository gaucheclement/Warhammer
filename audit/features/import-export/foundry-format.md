# Export Foundry - Format JSON Complet

## Contexte

Structure complète JSON export Foundry VTT conforme API Actor système WFRP. Document autonome utilisable dans Foundry sans modification.

## Structure Racine Actor

```
{
  name: string,
  type: "character",
  data: { ... },
  items: [ ... ],
  flags: { ... },
  folder: null,
  sort: 0,
  permission: {default: 0}
}
```

### Champs Obligatoires

**name** : Nom personnage (character.details[0] ou "Personnage Sans Nom")
**type** : Toujours "character" (vs "npc", "creature")
**data** : Objet données caractéristiques, dérivées, détails
**items** : Array compétences, talents, sorts, équipement
**flags** : Métadonnées application source (optionnel)

## Section data

### Characteristics

```
data.characteristics: {
  WS: {initial: 30, advances: 5, modifier: 0},
  BS: {initial: 28, advances: 0, modifier: 0},
  S: {initial: 32, advances: 2, modifier: 0},
  T: {initial: 31, advances: 2, modifier: 0},
  I: {initial: 40, advances: 0, modifier: 5},
  Ag: {initial: 28, advances: 0, modifier: 0},
  Dex: {initial: 24, advances: 1, modifier: 0},
  Int: {initial: 32, advances: 0, modifier: 0},
  WP: {initial: 25, advances: 0, modifier: 0},
  Fel: {initial: 31, advances: 0, modifier: 0}
}
```

### Derived Stats

```
data.status: {
  wounds: {max: 13, value: 13},
  fate: {value: 3},
  fortune: {value: 3},
  resilience: {value: 2},
  resolve: {value: 2},
  sin: {value: 0},
  corruption: {value: 0}
}
```

### Details

```
data.details: {
  species: "Human (Reiklander)",
  career: "Agitator (Rank 1)",
  age: "25",
  height: "1.75m",
  eyes: "Bruns",
  hair: "Châtain"
}
```

## Section items

### Item Skill

```
{
  name: "Athletics",
  type: "skill",
  data: {
    characteristic: {value: "Ag"},
    advances: {value: 10},
    modifier: {value: 0}
  }
}
```

### Item Talent

```
{
  name: "Savvy",
  type: "talent",
  data: {
    advances: {value: 1},
    specification: {value: ""}
  }
}
```

### Item Weapon

```
{
  name: "Sword",
  type: "weapon",
  data: {
    damage: {value: "SB+4"},
    reach: {value: "average"},
    weaponGroup: {value: "ordinary"},
    qualities: {value: []},
    flaws: {value: []}
  }
}
```

### Item Spell

```
{
  name: "Flaming Arrow",
  type: "spell",
  data: {
    lore: {value: "Fire"},
    cn: {value: 5},
    range: {value: "48 yards"},
    target: {value: "1 creature"},
    duration: {value: "Instant"}
  }
}
```

## Section flags

**Métadonnées application source** :
```
flags: {
  "warhammer-character-generator": {
    version: "1.0",
    exportDate: "2025-01-15T10:30:00Z",
    characterId: "abc123"
  }
}
```

**Utilité** : Traçabilité origine, possibilité réimport futur

## Validation Format

**JSON valide** : Parsable sans erreur
**Champs requis** : name, type="character", data, items (array)
**Types items** : skill, talent, weapon, armour, trapping, spell, money
**Characteristics** : 10 clés WS/BS/S/T/I/Ag/Dex/Int/WP/Fel obligatoires

## Exemples Complets

### Personnage Minimal

Humain début carrière, aucune compétence advance, équipement basique, ~15 KB JSON

### Personnage Expérimenté

Rang 3, 50+ compétences, 15 talents, équipement varié, sorts, ~80 KB JSON

### Personnage Complexe

Multi-carrières, talents rangs multiples, effets actifs, historique XP, ~150 KB JSON

## Compatibilité Versions

**Foundry VTT** : 0.8.x - 11.x
**Système WFRP** : 6.x - 7.x (évolutions mineures)
**Rétrocompatibilité** : Anciens exports peuvent nécessiter adaptation champs

## Voir Aussi

- [foundry-overview.md](./foundry-overview.md) - Vue ensemble
- [foundry-characteristics.md](./foundry-characteristics.md) - Détails characteristics
- [foundry-skills.md](./foundry-skills.md) - Détails skills items
- [foundry-talents.md](./foundry-talents.md) - Détails talents items
- [foundry-equipment.md](./foundry-equipment.md) - Détails equipment items
- [foundry-spells.md](./foundry-spells.md) - Détails spells items
