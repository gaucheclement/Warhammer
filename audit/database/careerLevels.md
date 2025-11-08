# CareerLevels - Table de données

## Description

Définit les 4 niveaux de progression pour chaque carrière. Chaque carrière possède exactement 4 niveaux représentant l'évolution du personnage.

---

## Schéma

### Champs d'identification

| Champ | Type | Description | Pattern |
|-------|------|-------------|---------|
| `index` | number | Identifiant unique | [pattern-index.md](../patterns/pattern-index.md) |
| `label` | string | Nom du niveau | [pattern-label.md](../patterns/pattern-label.md) |
| `book` | string | Livre source | [pattern-book-page.md](../patterns/pattern-book-page.md) |
| `page` | number | Page source | [pattern-book-page.md](../patterns/pattern-book-page.md) |

### Champs de relation

| Champ | Type | Référence | Description |
|-------|------|-----------|-------------|
| `career` | string | → [careers.md](./careers.md) | Nom de la carrière parente |
| `careerLevel` | number | - | Numéro du niveau (1-4) |

### Champs de progression

| Champ | Type | Description | Pattern |
|-------|------|-------------|---------|
| `status` | string | Statut social (Bronze/Argent/Or 1-10) | [pattern-validation-valeurs.md](../patterns/pattern-validation-valeurs.md) |
| `characteristics` | string | Caractéristiques à améliorer | [pattern-parsing.md](../patterns/pattern-parsing.md) |
| `skills` | string | Compétences acquises | [pattern-parsing.md](../patterns/pattern-parsing.md) |
| `talents` | string | Talents acquis | [pattern-parsing.md](../patterns/pattern-parsing.md) |
| `trappings` | string | Équipement fourni | [pattern-parsing.md](../patterns/pattern-parsing.md) |

---

## Exemples de données

### Agitateur niveau 1 - Pamphlétaire
```json
{
  "index": 0,
  "label": "Pamphlétaire",
  "career": "Agitateur",
  "careerLevel": 1,
  "status": "Bronze 1",
  "characteristics": "Capacité de Tir, Intelligence, Sociabilité",
  "skills": "Art (Écriture), Charme, Marchandage, ...",
  "talents": "Baratiner, Faire la manche, Lire/Écrire, Sociable",
  "trappings": "Nécessaire d'écriture, Marteau, Clou, ..."
}
```

---

## Relations

### → Careers
**Champ**: `careerLevels.career`
**Cible**: `careers.label`
**Pattern**: [pattern-relation-textuelle.md](../patterns/pattern-relation-textuelle.md)

**Cardinalité**: Chaque carrière a exactement 4 niveaux (1-4)

### → Characteristics
**Champ**: `careerLevels.characteristics` (parsing requis)
**Cible**: `characteristics.label`
**Pattern**: [pattern-parsing.md](../patterns/pattern-parsing.md)

### → Skills
**Champ**: `careerLevels.skills` (parsing requis)
**Cible**: `skills.label`
**Patterns**: [pattern-parsing.md](../patterns/pattern-parsing.md), [pattern-parsing.md](../patterns/pattern-parsing.md), [pattern-specialisations.md](../patterns/pattern-specialisations.md)

### → Talents
**Champ**: `careerLevels.talents` (parsing requis)
**Cible**: `talents.label`
**Patterns**: [pattern-parsing.md](../patterns/pattern-parsing.md), [pattern-parsing.md](../patterns/pattern-parsing.md)

### → Trappings
**Champ**: `careerLevels.trappings` (parsing requis)
**Cible**: `trappings.label`
**Patterns**: [pattern-parsing.md](../patterns/pattern-parsing.md), [pattern-parsing.md](../patterns/pattern-parsing.md)

---

## Particularités du format

### Champ `characteristics`
**Format**: Noms séparés par virgules
**Quantités**: Niveau 1 = 3, Niveaux 2-4 = 1
**Pattern**: [pattern-parsing.md](../patterns/pattern-parsing.md)

### Champ `skills`
**Format**: CSV avec spécialisations et choix
**Quantités**: N1=8-10, N2=6, N3=4, N4=2
**Patterns**: [pattern-parsing.md](../patterns/pattern-parsing.md), [pattern-specialisations.md](../patterns/pattern-specialisations.md)

**Exemples**: `"Métier (Au choix)"`, `"Corps à corps (Bagarre)"`

### Champ `talents`
**Format**: CSV avec choix exclusifs
**Quantité**: Exactement 4 talents par niveau
**Pattern**: [pattern-parsing.md](../patterns/pattern-parsing.md)

**Exemples**: `"Perspicace ou Affable"`, `"Savoir-vivre (Au choix)"`

### Champ `trappings`
**Format**: CSV avec quantités
**Particularité N1**: Hérite des trappings de `careers.class`
**Pattern**: [pattern-parsing.md](../patterns/pattern-parsing.md)

**Exemples**: `"Pamphlétaire (3)"`, `"Chiffon (1d10)"`

### Champ `status`
**Format**: "{Métal} {Niveau}"
**Valeurs**: Bronze/Argent/Or 1-10
**Pattern**: [pattern-validation-valeurs.md](../patterns/pattern-validation-valeurs.md)

---

## Contraintes de validation

### Structurelles
- `index`: unique, séquentiel - [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md)
- `label`: unique, non vide - [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md)
- `careerLevel`: 1-4 - [pattern-validation-valeurs.md](../patterns/pattern-validation-valeurs.md)

### Références
- `career` existe dans `careers` - [pattern-validation-references.md](../patterns/pattern-validation-references.md)
- `characteristics` parsables vers `characteristics.label`
- `skills` parsables vers `skills.label`
- `talents` parsables vers `talents.label`
- `trappings` parsables vers `trappings.label`

### Format
- `status`: format "{Métal} {Niveau}" valide
- `characteristics`: 3 noms (N1) ou 1 nom (N2-4)
- `skills`: 8-10 (N1), 6 (N2), 4 (N3), 2 (N4)
- `talents`: exactement 4

### Cohérences
- Chaque carrière a exactement 4 niveaux (careerLevel 1-4)
- Pas de doublons careerLevel pour même carrière

---

## Cardinalités

- **CareerLevels**: ~800 niveaux (200 carrières × 4)
- **Careers**: 117 carrières
- **Characteristics**: 3 au N1 + 3 aux N2-4 = 6 par carrière
- **Skills**: 20 total (8+6+4+2)
- **Talents**: 16 total (4×4)

---

## Règles métier associées

**Note**: Les règles métier ne sont PAS dans ce fichier.

Voir:
- [progression-careerlevels.md](../business-rules/progression-careerlevels.md)
- [parsing-avances-caracteristiques.md](../business-rules/parsing-avances-caracteristiques.md)
- [parsing-skills-talents.md](../business-rules/parsing-skills-talents.md)
- [accumulation-avantages-careerlevels.md](../business-rules/accumulation-avantages-careerlevels.md)
- [calculs-xp-progression.md](../business-rules/calculs-xp-progression.md)

---

## Voir aussi

- [careers.md](./careers.md) - Carrières parentes
- [characteristics.md](./characteristics.md) - Caractéristiques améliorables
- [skills.md](./skills.md) - Compétences
- [talents.md](./talents.md) - Talents
- [trappings.md](./trappings.md) - Équipement
