# Equipment - Inventaire

## Vue d'ensemble

L'inventaire du personnage gère l'ensemble des possessions (trappings) qu'il transporte. Chaque objet dans l'inventaire possède des propriétés qui définissent sa nature, son utilisation, et son impact sur le personnage.

## Structure des données

### Objet d'inventaire

Chaque possession (trapping) contient:

**Identifiants:**
- `id` - Identifiant unique de l'objet
- `label` - Nom de l'objet
- `index` - Position dans la liste d'inventaire

**Classification:**
- `type` - Catégorie principale (melee/ranged/armor/ammunition/vehicle/trapping)
- `subType` - Sous-catégorie (groupe d'armes, type de vêtement, etc.)

**Propriétés économiques:**
- `price` - Prix consolidé (converti depuis gold/silver/bronze)
- `gold` - Couronnes d'or (CO)
- `silver` - Pistoles d'argent (PA)
- `bronze` - Sous (S)
- `availability` - Disponibilité (Commune/Limitée/Rare/Exotique/Unique)

**Propriétés physiques:**
- `enc` - Encombrement (valeur numérique)
- `carry` - Capacité de contenu (pour sacs, conteneurs, véhicules)

**Propriétés de combat (armes):**
- `reach` - Allonge (CaC) ou Portée (distance)
- `damage` - Dégâts infligés
- `qualities` - Liste des qualités/défauts de l'objet

**Propriétés de protection (armures):**
- `loc` - Emplacements corporels couverts
- `pa` - Points d'Armure

**Propriétés véhicules:**
- `mode` - Mode de déplacement
- `toughness` - Endurance du véhicule
- `wounds` - Points de Blessures du véhicule

**Informations:**
- `desc` - Description textuelle de l'objet
- `book` - Livre source
- `page` - Page de référence

## Exemples concrets Warhammer

### Arme de mêlée
```
Epée (Main-Weapon)
- type: melee
- subType: Basic
- damage: BF+4
- reach: Moyenne
- enc: 1
- price: 10 CO
- availability: Commune
- qualities: []
```

### Armure
```
Gilet de cuir
- type: armor
- subType: (vide)
- loc: Torse
- pa: 1
- enc: 1
- price: 10 PA
- availability: Commune
```

### Arme à distance
```
Arc
- type: ranged
- subType: Bow
- damage: BF+3
- reach: 24
- enc: 1
- price: 10 PA
- availability: Commune
- qualities: []
```

### Objet courant
```
Couverture
- type: trapping
- subType: (vide)
- enc: 1
- price: 5 PA
- availability: Commune
- carry: (vide)
```

### Conteneur
```
Sac à dos
- type: trapping
- subType: (vide)
- enc: 1
- price: 1 CO
- availability: Commune
- carry: 20 (capacité de stockage)
```

## Gestion de la liste

### Ajout d'objets

Les objets sont ajoutés à `character.trappings[]` qui est un tableau d'objets.

Sources d'objets:
- Dotation de carrière (trappings de la CareerLevel)
- Achat (sélection manuelle depuis la base de données)
- Butin (ajout libre)

### Quantités

Un même objet possédé en plusieurs exemplaires peut être:
- Soit dupliqué (plusieurs entrées identiques dans le tableau)
- Soit géré par une propriété de quantité au niveau du personnage (implémentation variable)

### Organisation

Les objets sont organisés par:
- **Type** - Regroupement par catégorie (armes/armures/autres)
- **SubType** - Sous-catégorie (groupes d'armes, types d'armures)
- **Index** - Position dans le tableau

L'ordre d'affichage peut varier selon l'interface mais suit généralement le regroupement par type/subType.

## Relations avec d'autres systèmes

### Avec Career
Les carrières définissent une liste de dotation initiale (trappings) que le personnage reçoit en débutant.
Voir [audit/database/career_levels.md](../../database/career_levels.md)

### Avec Encumbrance
Chaque objet possède une valeur `enc` (encombrement) qui contribue au calcul d'encombrement total.
Voir [encumbrance-calc.md](./encumbrance-calc.md)

### Avec Qualities
Les armes et armures peuvent avoir des qualités/défauts qui modifient leurs effets.
Voir [weapon-qualities.md](./weapon-qualities.md) et [armour-qualities.md](./armour-qualities.md)

### Avec Pricing
Le prix des objets est exprimé en système monétaire Warhammer (CO/PA/S).
Voir [pricing.md](./pricing.md) et [money.md](./money.md)

## Validation

### Règles métier

**Structure:**
- Chaque objet doit avoir un `id` et un `type`
- Le `type` doit être dans la liste autorisée (melee/ranged/armor/ammunition/vehicle/trapping)
- L'`enc` doit être un nombre >= 0

**Cohérence:**
- Si `type` = melee/ranged: `damage` et `reach` doivent être définis
- Si `type` = armor: `loc` et `pa` doivent être définis
- Si `type` = vehicle: `mode`, `toughness`, `wounds` doivent être définis
- Les qualités référencées doivent exister dans la base de données

**Prix:**
- Si défini, `price` doit être >= 0
- Les valeurs gold/silver/bronze doivent être cohérentes avec price

### Vérifications

- Vérifier que tous les objets ont un type valide
- Vérifier la cohérence entre type et propriétés requises
- Vérifier que les références aux qualités existent
- Alerter si encombrement total dépasse la limite (voir encumbrance-limit.md)

## Patterns réutilisés

Voir [pattern-validation-references.md](../../patterns/pattern-validation-references.md) pour la validation des références aux qualités.
