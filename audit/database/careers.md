# Careers - Table de données

## Description

Table des 117 carrières disponibles avec classification sociale et pondérations par espèce/région.

---

## Schéma

### Champs d'identification

| Champ | Type | Description | Pattern |
|-------|------|-------------|---------|
| `index` | number | Identifiant unique 0-116 | [pattern-metadonnees-base.md](../patterns/pattern-metadonnees-base.md) |
| `label` | string | Nom de la carrière | [pattern-metadonnees-base.md](../patterns/pattern-metadonnees-base.md) |
| `book` | string | Code du livre source | [pattern-metadonnees-base.md](../patterns/pattern-metadonnees-base.md) |
| `page` | number | Numéro de page | [pattern-metadonnees-base.md](../patterns/pattern-metadonnees-base.md) |

### Champs de classification

| Champ | Type | Référence | Description |
|-------|------|-----------|-------------|
| `class` | string | → [classes.md](./classes.md) | Classe sociale |

### Champs de génération

| Champ | Type | Description | Pattern |
|-------|------|-------------|---------|
| `rand` | object | Pondérations par espèce/région | [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) |
| `subRand` | string | Toujours `""` (non implémenté) | - |

### Champs descriptifs

| Champ | Type | Description | Pattern |
|-------|------|-------------|---------|
| `desc` | string | Description narrative HTML | [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md) |

---

## Exemples de données

### Agitateur
```json
{
  "index": 0,
  "label": "Agitateur",
  "class": "Citadins",
  "rand": {"Humain": 1, "Halfling": 2, "Nain": 2, "Haut Elfe": "", ...},
  "desc": "<i>Charismatique...</i><BR><BR>...",
  "book": "LDB",
  "page": 50
}
```

### Artisan
```json
{
  "index": 1,
  "label": "Artisan",
  "class": "Citadins",
  "rand": {"Humain": 3, "Halfling": 7, "Nain": 8, ...},
  "desc": "<i>Travailleur qualifié...</i><BR><BR>...",
  "book": "LDB",
  "page": 52
}
```

---

## Relations

### → Classes
**Champ**: `careers.class`
**Cible**: `classes.label`
**Pattern**: [pattern-relation-textuelle.md](../patterns/pattern-relation-textuelle.md)

### → CareerLevels
**Type**: One-to-Many (1 carrière → 4 niveaux)
**Référence inverse**: `careerLevels.career` → `careers.label`

### → Species (via rand)
**Champ**: Clés dans `careers.rand`
**Pattern**: [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md)

**Bidirectionnel**:
- `species.refCareer` : Carrières disponibles POUR espèce
- `careers.rand[espèce]` : Pondération carrière POUR espèce

---

## Particularités du format

### Champ `rand`
**Format**: Objet avec 10 clés (7 espèces + 3 régions)

**Valeurs**:
- **Nombre (1-100)**: Seuil de pondération
- **Chaîne vide ""**: NON ACCESSIBLE

**Exemples**:
- `"Humain": 1` → Commune (seuil bas)
- `"Nain": 8` → Favorisée pour nains
- `"Haut Elfe": ""` → Non accessible
- `"Humain": 95` → Rare et exclusive

**Pattern**: [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md), [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md)

### Champ `desc`
**Format**: HTML avec pitch en italique

**Pattern**: [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md), [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md)

### Clés `rand`
**Espèces**: Humain, Halfling, Nain, Haut Elfe, Elfe Sylvain, Gnome, Ogre
**Régions**: Middenheim, Middenland, Nordland

### Seuils typiques
- **Très communes (1-10)**: Agitateur (1), Artisan (3)
- **Communes (10-20)**: Milicien (11)
- **Rares (90-100)**: Sorcier de village (95)

### Cas particuliers
**Mono-espèce**: Tous `rand` vides sauf une (ex: Sorcier = Humain uniquement)
**Chaos**: Tous `rand` vides → Non accessibles en génération

---

## Contraintes de validation

### Structurelles
- `index`: 0-116, unique, séquentiel - [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md)
- `label`: unique, 3-100 car - [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md)

### Références
- `class` existe dans `classes` - [pattern-validation-references.md](../patterns/pattern-validation-references.md)
- `rand`: exactement 10 clés (7 espèces + 3 régions)
- Valeurs `rand`: nombre (1-100) OU chaîne vide ""

### Format
- `desc`: HTML valide - [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md)
- `desc`: commence par pitch `<i>` - [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md)
- `subRand`: toujours `""` (non implémenté)

### Cohérences
- 4 entrées `careerLevels` par carrière (niveaux I-IV)
- Clés `rand` correspondent aux labels `species`

---

## Cardinalités

- **Careers**: 117 (Citadins: 8, Courtisans: 8, Guerriers: 23, Itinérants: 12, Ruraux: 16)
- **Classes**: 6 catégories
- **CareerLevels**: 4 par carrière (468 total)

---

## Sources de données

**Livres**: `LDB` (Livre de Base), `EDO` (Ennemis dans l'Ombre), `AA` (Archives des Magnus)

---

## Règles métier associées

**Note**: Les règles métier ne sont PAS dans ce fichier.

Voir:
- [filtrage-careers-espece.md](../business-rules/filtrage-careers-espece.md)
- [filtrage-careers-region.md](../business-rules/filtrage-careers-region.md)
- [ponderation-aleatoire-careers.md](../business-rules/ponderation-aleatoire-careers.md)
- [progression-careerlevels.md](../business-rules/progression-careerlevels.md)
- [tests-coherence-careers.md](../business-rules/tests-coherence-careers.md)
- [validation-donnees-careers.md](../business-rules/validation-donnees-careers.md)
- [migration-descriptions-html.md](../business-rules/migration-descriptions-html.md)

---

## Voir aussi

- [careerLevels.md](./careerLevels.md) - Niveaux de progression
- [classes.md](./classes.md) - Classes sociales
- [species.md](./species.md) - Espèces jouables
