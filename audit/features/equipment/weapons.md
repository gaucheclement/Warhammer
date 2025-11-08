# Equipment - Armes

## Vue d'ensemble

Les armes permettent au personnage d'infliger des dégâts en combat. Elles se divisent en deux grandes catégories: armes de mêlée (melee) et armes à distance (ranged), chacune avec ses propres caractéristiques et groupes d'armes.

## Types d'armes

### Armes de mêlée (Melee)

**Type:** `melee`

Armes utilisées au corps-à-corps.

**Propriétés spécifiques:**
- `reach` - Allonge de l'arme
- `damage` - Dégâts infligés
- `subType` - Groupe d'armes

### Armes à distance (Ranged)

**Type:** `ranged`

Armes utilisées à distance (arcs, arbalètes, armes de jet, armes à poudre).

**Propriétés spécifiques:**
- `reach` - Portée maximale en mètres
- `damage` - Dégâts infligés
- `subType` - Groupe d'armes

### Munitions (Ammunition)

**Type:** `ammunition`

Projectiles utilisés avec les armes à distance (flèches, carreaux, balles).

**Propriétés spécifiques:**
- `damage` - Modificateur de dégâts (optionnel)
- Compatible avec certains types d'armes à distance

## Groupes d'armes (subType)

Les armes sont organisées en groupes qui définissent les compétences nécessaires pour les utiliser.

### Groupes de mêlée
- Basic - Armes de base (épée, hache, masse)
- Cavalry - Armes de cavalerie (lance de cavalerie)
- Fencing - Armes d'escrime (rapière)
- Brawling - Combat à mains nues (poing, coup de pied)
- Flail - Fléaux (fléau d'armes)
- Parry - Armes de parade (dague de parade)
- Polearm - Armes d'hast (hallebarde, vouge)
- Two-Handed - Armes à deux mains (épée à deux mains)

### Groupes à distance
- Bow - Arcs (arc court, arc long)
- Crossbow - Arbalètes (arbalète légère, lourde)
- Entangling - Armes d'entrave (filet, lasso)
- Engineering - Armes de siège (catapulte, baliste)
- Explosives - Explosifs (bombes, grenades)
- Sling - Frondes
- Throwing - Armes de jet (hachette, javelot)
- Blackpowder - Armes à poudre (pistolet, fusil)

## Caractéristiques des armes

### Dégâts (damage)

Format: `BF+X` ou valeur fixe

**BF** = Bonus de Force du personnage

**Exemples:**
- Dague: BF+2
- Epée: BF+4
- Marteau de guerre: BF+5
- Arc: BF+3
- Arbalète: 4 (dégâts fixes)

Les dégâts sont ajoutés au test de combat réussi pour déterminer les blessures infligées.

### Allonge (reach) - Mêlée

Définit la distance à laquelle l'arme peut frapper.

**Valeurs:** Personnelle / Très courte / Courte / Moyenne / Longue / Très longue / Considérable / Variable

Une arme avec une allonge supérieure peut frapper en premier ou tenir l'adversaire à distance.

### Portée (reach) - Distance

Valeur numérique en mètres (ex: 16, 24, 30).

**Modificateurs:** Bout portant +40% / Courte +20% / Longue +0% / Extrême -20%

### Qualités

Les armes peuvent avoir des qualités spéciales qui modifient leurs effets.

Voir [weapon-qualities.md](./weapon-qualities.md) pour la liste complète.

## Exemples concrets Warhammer

**Dague** - melee/Basic, BF+2, Très courte, 0 enc, 1 CO
**Epée** - melee/Basic, BF+4, Moyenne, 1 enc, 10 CO
**Hallebarde** - melee/Polearm, BF+5, Longue, 2 enc, 7 CO, [Defensive]
**Arc** - ranged/Bow, BF+3, portée 24, 1 enc, 10 PA
**Pistolet** - ranged/Blackpowder, 4, portée 10, 1 enc, 30 CO, [Impact, Blackpowder]

## Relations avec d'autres systèmes

### Avec Skills
Chaque groupe d'armes correspond à une compétence spécifique (Melee Basic, Ranged Bow, etc.).
Le personnage doit posséder la compétence correspondante pour utiliser efficacement l'arme.
Voir [audit/database/skills.md](../../database/skills.md)

### Avec Qualities
Les armes peuvent avoir des qualités qui modifient leurs effets en combat.
Voir [weapon-qualities.md](./weapon-qualities.md)

### Avec Inventory
Les armes font partie de l'inventaire du personnage et contribuent à l'encombrement.
Voir [inventory.md](./inventory.md)

### Avec Pricing
Les armes ont un prix et une disponibilité variables selon leur rareté.
Voir [pricing.md](./pricing.md)

## Validation

### Règles métier

**Structure arme de mêlée:**
- `type` = "melee"
- `subType` doit être un groupe valide (Basic/Cavalry/Fencing/etc.)
- `damage` doit être défini (format BF+X ou valeur)
- `reach` doit être dans la liste autorisée

**Structure arme à distance:**
- `type` = "ranged"
- `subType` doit être un groupe valide (Bow/Crossbow/Blackpowder/etc.)
- `damage` doit être défini
- `reach` doit être un nombre > 0 (portée en mètres)

**Cohérence:**
- Les qualités référencées doivent exister
- Le groupe d'armes doit correspondre au type (melee/ranged)
- L'encombrement doit être >= 0

### Vérifications

- Vérifier que `type` = melee ou ranged
- Vérifier que `subType` correspond au type
- Vérifier que `damage` et `reach` sont définis
- Vérifier que les qualités existent dans la base
- Alerter si arme sans groupe (subType manquant)
