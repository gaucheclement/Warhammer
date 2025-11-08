# Talents - Table de données

## Description

150+ talents Warhammer Fantasy (capacités innées, formations, avantages). Modifient caractéristiques, débloquent compétences/magie ou donnent accès à autres talents.

---

## Schéma

### Champs d'identification

| Champ | Type | Description | Pattern |
|-------|------|-------------|---------|
| `index` | number | ID unique 0-150+ | [pattern-index.md](../patterns/pattern-index.md) |
| `label` | string | Nom du talent | [pattern-label.md](../patterns/pattern-label.md) |
| `book` | string | Référence source | [pattern-book-page.md](../patterns/pattern-book-page.md) |
| `page` | number | Page source | [pattern-book-page.md](../patterns/pattern-book-page.md) |

### Champs de règles

| Champ | Type | Description | Pattern |
|-------|------|-------------|---------|
| `desc` | string | Description effets HTML | [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md) |
| `test` | string | Quand utiliser | - |
| `max` | mixed | Rangs maximum | [pattern-validation-valeurs.md](../patterns/pattern-validation-valeurs.md) |

### Champs d'effets

| Champ | Type | Référence | Description | Pattern |
|-------|------|-----------|-------------|---------|
| `addSkill` | string | → [skills.md](./skills.md) | Compétence ajoutée | [pattern-relation-textuelle.md](../patterns/pattern-relation-textuelle.md) |
| `addMagic` | string | → [lores.md](./lores.md) | Domaine magie | [pattern-relation-textuelle.md](../patterns/pattern-relation-textuelle.md) |
| `addCharacteristic` | string | → [characteristics.md](./characteristics.md) | Carac modifiée | [pattern-modificateurs-caracteristiques.md](../patterns/pattern-modificateurs-caracteristiques.md) |
| `addTalent` | string | → talents | Talent débloqué | [pattern-relation-textuelle.md](../patterns/pattern-relation-textuelle.md) |

### Champs de spécialisations

| Champ | Type | Description | Pattern |
|-------|------|-------------|---------|
| `specName` | string | Type de spécialisation | - |
| `specs` | string | Liste spécialisations | [pattern-specialisations.md](../patterns/pattern-specialisations.md) |

### Champs de génération

| Champ | Type | Description | Pattern |
|-------|------|-------------|---------|
| `rand` | string | Tirage aléatoire 1-100 | [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) |

---

## Exemples de données

### Talent simple - Ambidextre
```json
{
  "index": 5,
  "label": "Ambidextre",
  "max": 2,
  "desc": "1 rang = -10 main secondaire, 2 rangs = aucune pénalité"
}
```

### Talent + Compétence - Artiste
```json
{
  "index": 12,
  "label": "Artiste",
  "max": "Bonus de Dextérité",
  "addSkill": "Art (Au choix)",
  "specs": "Calligraphie, Peinture, Sculpture"
}
```

### Talent + Caractéristique - Affable
```json
{
  "index": 3,
  "label": "Affable",
  "max": 1,
  "addCharacteristic": "Sociabilité"
}
```

### Talent Magie - Béni
```json
{
  "index": 18,
  "label": "Béni",
  "max": 1,
  "addMagic": "Béni",
  "specs": "Manann, Morr, Sigmar"
}
```

---

## Relations

### → Characteristics
**Champ**: `talents.addCharacteristic`
**Cible**: `characteristics.label`
**Pattern**: [pattern-modificateurs-caracteristiques.md](../patterns/pattern-modificateurs-caracteristiques.md)

### → Skills
**Champ**: `talents.addSkill`
**Cible**: `skills.label`
**Pattern**: [pattern-relation-textuelle.md](../patterns/pattern-relation-textuelle.md)

### → Lores
**Champ**: `talents.addMagic`
**Cible**: Domaine magique
**Pattern**: [pattern-relation-textuelle.md](../patterns/pattern-relation-textuelle.md)

### → Talents (auto-référence)
**Champ**: `talents.addTalent`
**Cible**: `talents.label`
**Pattern**: [pattern-relation-textuelle.md](../patterns/pattern-relation-textuelle.md)

---

## Particularités du format

### Champ `max`
**Types de valeurs**:
- **Nombre** (1, 2): max absolu
- **"Aucun"**: illimité
- **Formule** ("Bonus de Dextérité"): calculé depuis bonus carac

**Pattern**: [pattern-validation-valeurs.md](../patterns/pattern-validation-valeurs.md), [pattern-modificateurs-caracteristiques.md](../patterns/pattern-modificateurs-caracteristiques.md)

### Champ `addCharacteristic`
**Effets par rang**:
- Points Blessures: +Bonus Endurance
- Mouvement/Chance/Détermination/Corruption: +1
- Autres: +5

**Pattern**: [pattern-modificateurs-caracteristiques.md](../patterns/pattern-modificateurs-caracteristiques.md)

### Champ `addMagic`
**Valeurs**: "Béni", "Magie mineure", "Magie des Arcanes", "Magie du Chaos", "Invocation"

### Champ `specs`
**Format**: CSV "A, B, C" ou "Au choix"
**Pattern**: [pattern-specialisations.md](../patterns/pattern-specialisations.md), [pattern-specialisations.md](../patterns/pattern-specialisations.md)

---

## Contraintes de validation

### Structurelles
- `index`: ≥0, unique - [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md)
- `label`: unique, ≤100 car - [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md)

### Références
- `addCharacteristic` existe dans `characteristics` - [pattern-validation-references.md](../patterns/pattern-validation-references.md)
- `addSkill` base dans `skills`
- `addMagic` domaine valide
- `addTalent` existe, pas de cycle

### Format
- `max`: nombre >0, "Aucun" ou "Bonus de {Carac}"
- `specs`: format "A, B, C", pas doublons
- `desc`: HTML valide - [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md)

---

## Règles métier associées

**Note**: Les règles métier ne sont PAS dans ce fichier.

Voir:
- [talents-rangs-multiples.md](../business-rules/talents-rangs-multiples.md)
- [talents-specialisations.md](../business-rules/talents-specialisations.md)
- [talents-deblocage-talents.md](../business-rules/talents-deblocage-talents.md)
- [talents-modification-caracteristiques.md](../business-rules/talents-modification-caracteristiques.md)
- [talents-ajout-skills-magie.md](../business-rules/talents-ajout-skills-magie.md)
- [application-effets-talents.md](../business-rules/application-effets-talents.md)

---

## Voir aussi

- [characteristics.md](./characteristics.md) - Caractéristiques
- [skills.md](./skills.md) - Compétences
- [lores.md](./lores.md) - Domaines magiques
- [spells.md](./spells.md) - Sorts
