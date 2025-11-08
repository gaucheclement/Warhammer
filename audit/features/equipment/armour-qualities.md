# Equipment - Qualités d'armures

## Vue d'ensemble

Les qualités d'armures sont des propriétés spéciales qui modifient la protection ou l'usage d'une armure. Elles peuvent être des atouts (améliorations) ou des défauts (limitations).

## Structure des données

### Qualité d'armure

**Identifiants:**
- `id` - Identifiant unique
- `label` - Nom de la qualité

**Classification:**
- `type` - "Atout" ou "Défaut"
- `subType` - "armure"

**Informations:**
- `desc` - Description des effets
- `prefix` - Si défini, peut avoir une spécialisation
- `book` - Livre source
- `page` - Page de référence

## Exemples de qualités Warhammer

**Flexible (Souple)**
Type: Atout
Effet: N'impose pas de pénalité aux tests d'Agilité

**Impenetrable (Impénétrable)**
Type: Atout
Effet: Un coup critique contre cette armure compte comme un coup normal

**Partial (Partielle)**
Type: Défaut
Effet: Ne protège que certaines parties de la zone

**Weakpoints (Points faibles)**
Type: Défaut
Effet: Un coup critique ignore les PA de cette armure

**Fine (De qualité)**
Type: Atout
Effet: Réduit l'encombrement de moitié (arrondi supérieur)

**Durable (Durable)**
Type: Atout
Effet: L'armure résiste mieux aux dégâts et à l'usure

**Lightweight (Légère)**
Type: Atout
Effet: Encombrement réduit

**Heavy (Lourde)**
Type: Défaut
Effet: Encombrement augmenté, pénalités aux tests

**Uncomfortable (Inconfortable)**
Type: Défaut
Effet: Pénalités prolongées si portée longtemps

## Application

### Modification PA

Certaines qualités modifient l'efficacité de la protection:
- **Impenetrable** rend les coups critiques normaux
- **Weakpoints** rend l'armure vulnérable aux critiques
- **Partial** réduit la zone protégée

### Modification encombrement

Certaines qualités affectent l'encombrement:
- **Fine** réduit enc de moitié
- **Lightweight** réduit enc
- **Heavy** augmente enc

### Effets sur l'usage

Certaines qualités modifient les conditions d'utilisation:
- **Flexible** supprime pénalités Agilité
- **Uncomfortable** ajoute pénalités si port prolongé

## Relations avec d'autres systèmes

### Avec Armour
Les armures référencent leurs qualités dans `qualities`.
Voir [armour.md](./armour.md)

### Avec Database
Stockées dans la table qualities avec type="Atout"/"Défaut" et subType="armure".
Voir [audit/database/qualities.md](../../database/qualities.md)

### Avec Encumbrance
Les qualités Fine/Lightweight/Heavy modifient l'encombrement.
Voir [encumbrance-calc.md](./encumbrance-calc.md)

## Validation

### Règles métier

**Structure:**
- `type` = "Atout" ou "Défaut"
- `subType` = "armure"
- `desc` doit être défini

**Référencement:**
- Les armures doivent référencer des qualités existantes

### Vérifications

- Vérifier que les qualités référencées existent
- Vérifier type = "Atout" ou "Défaut"
- Vérifier subType = "armure"
- Alerter si qualité sans description

## Patterns réutilisés

Voir [pattern-validation-references.md](../../patterns/pattern-validation-references.md) pour la validation des références.
