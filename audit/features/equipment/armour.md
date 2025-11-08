# Equipment - Armures

## Vue d'ensemble

Les armures protègent le personnage contre les dégâts en réduisant les blessures reçues. Elles fonctionnent par zones corporelles, chaque pièce d'armure protégeant une ou plusieurs zones avec des Points d'Armure (PA).

## Structure des données

### Armure

**Type:** `armor`

**Propriétés spécifiques:**
- `loc` - Emplacements corporels protégés
- `pa` - Points d'Armure fournis
- `qualities` - Qualités spéciales (optionnel)

**Propriétés communes:**
- `enc` - Encombrement
- `price` - Prix
- `availability` - Disponibilité

## Zones corporelles

Le corps est divisé en zones pour le calcul des dégâts et de la protection:

**Tête** (Head)
- Casques, heaumes, couvre-chefs

**Torse** (Body)
- Plastrons, brigandines, gilets, robes

**Bras** (Arms)
- Brassards, manches renforcées

**Jambes** (Legs)
- Jambières, grèves, bottes

## Points d'Armure (PA)

Le PA réduit les blessures infligées lors d'une attaque réussie.

**Fonctionnement:**
1. L'attaquant touche et calcule ses dégâts
2. Le PA de la zone touchée est soustrait des dégâts
3. Le reste (si > 0) inflige des blessures

**Valeurs typiques:**
- 0 PA - Pas de protection (vêtements normaux)
- 1 PA - Protection légère (cuir)
- 2 PA - Protection moyenne (cuir clouté, maille)
- 3 PA - Protection lourde (demi-plate)
- 4-5 PA - Protection très lourde (plate complète)

## Types d'armures

### Pièces individuelles

Protègent une seule zone corporelle.

**Exemples:**
- Casque en cuir - Tête, 1 PA
- Gilet de cuir - Torse, 1 PA
- Brassards de cuir - Bras, 1 PA
- Jambières de cuir - Jambes, 1 PA

### Armures complètes

Protègent plusieurs zones avec le même PA.

**Exemples:**
- Armure de cuir - Toutes zones, 1 PA
- Armure de maille - Torse/Bras/Jambes, 3 PA
- Armure de plates - Toutes zones, 5 PA

### Combinaisons

Le personnage peut porter plusieurs pièces qui se cumulent:
- Casque (Tête 2 PA) + Gilet de cuir (Torse 1 PA) = Tête 2 PA, Torse 1 PA

**Cumul sur une même zone:**
Les PA peuvent se cumuler si plusieurs pièces protègent la même zone (ex: gilet + plastron sur le torse).

## Emplacements (loc)

Format de la propriété `loc`:

**Une zone:** "Tête" ou "Torse" ou "Bras" ou "Jambes"

**Plusieurs zones:** Séparées par virgule
- "Torse, Bras, Jambes"
- "Toutes zones" (équivalent à "Tête, Torse, Bras, Jambes")

## Exemples concrets Warhammer

**Casque en cuir**
- type: armor
- loc: Tête
- pa: 1
- enc: 0
- price: 5 PA

**Gilet de cuir**
- type: armor
- loc: Torse
- pa: 1
- enc: 1
- price: 10 PA

**Armure de cuir complète**
- type: armor
- loc: Toutes zones
- pa: 1
- enc: 4
- price: 50 PA

**Armure de maille**
- type: armor
- loc: Torse, Bras, Jambes
- pa: 3
- enc: 3
- price: 60 CO

**Armure de plates**
- type: armor
- loc: Toutes zones
- pa: 5
- enc: 6
- price: 400 CO
- availability: Rare

## Calcul PA par zone

Pour chaque zone corporelle, le PA total est la somme de tous les PA des pièces protégeant cette zone.

**Exemple:**
Personnage portant:
- Casque en cuir (Tête 1 PA)
- Gilet de cuir (Torse 1 PA)
- Plastron de maille (Torse 2 PA)

**PA résultant:**
- Tête: 1 PA
- Torse: 3 PA (1+2)
- Bras: 0 PA
- Jambes: 0 PA

## Relations avec d'autres systèmes

### Avec Inventory
Les armures font partie de l'inventaire et contribuent à l'encombrement.
Voir [inventory.md](./inventory.md)

### Avec Qualities
Les armures peuvent avoir des qualités spéciales.
Voir [armour-qualities.md](./armour-qualities.md)

### Avec Encumbrance
Les armures sont généralement encombrantes, surtout les armures lourdes.
Voir [encumbrance-calc.md](./encumbrance-calc.md)

### Avec Worn vs Stored
Une armure doit être portée pour être efficace. Les pièces stockées ne protègent pas.
Voir [worn-vs-stored.md](./worn-vs-stored.md)

## Validation

### Règles métier

**Structure:**
- `type` = "armor"
- `loc` doit être défini (zones protégées)
- `pa` doit être un nombre >= 0

**Cohérence:**
- Les zones dans `loc` doivent être valides (Tête/Torse/Bras/Jambes)
- Le PA doit être cohérent avec le type d'armure
- Les qualités référencées doivent exister

### Vérifications

- Vérifier que type = "armor"
- Vérifier que loc contient des zones valides
- Vérifier que pa est un nombre >= 0
- Vérifier que les qualités existent
- Alerter si armure sans PA défini
