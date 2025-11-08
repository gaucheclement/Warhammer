# Equipment - Catégorisation

## Vue d'ensemble

L'équipement est organisé en catégories qui facilitent l'affichage, la recherche, et la gestion de l'inventaire. Chaque objet appartient à une catégorie principale (type) et optionnellement à une sous-catégorie (subType).

## Hiérarchie de catégorisation

### Type (Catégorie principale)

**Propriété:** `type`

**Valeurs possibles:**
- `melee` - Armes de mêlée
- `ranged` - Armes à distance
- `ammunition` - Munitions
- `armor` - Armures
- `vehicle` - Véhicules
- `trapping` - Objets divers

### SubType (Sous-catégorie)

**Propriété:** `subType`

Dépend du type principal. Peut être vide pour certains objets.

## Catégories détaillées

### Armes de mêlée (melee)

**SubTypes:**
- Basic, Cavalry, Fencing, Brawling, Flail, Parry, Polearm, Two-Handed

**Exemples:**
- Épée → type: melee, subType: Basic
- Hallebarde → type: melee, subType: Polearm
- Rapière → type: melee, subType: Fencing

### Armes à distance (ranged)

**SubTypes:**
- Bow, Crossbow, Entangling, Engineering, Explosives, Sling, Throwing, Blackpowder

**Exemples:**
- Arc → type: ranged, subType: Bow
- Pistolet → type: ranged, subType: Blackpowder
- Javelot → type: ranged, subType: Throwing

### Munitions (ammunition)

**SubTypes:**
- Généralement vide ou spécifique au type de munition

**Exemples:**
- Flèches → type: ammunition, subType: (vide)
- Balles de plomb → type: ammunition, subType: (vide)

### Armures (armor)

**SubTypes:**
- Généralement vide, parfois utilisé pour des sous-types spécifiques

**Exemples:**
- Casque en cuir → type: armor, subType: (vide)
- Armure de maille → type: armor, subType: (vide)

### Véhicules (vehicle)

**SubTypes:**
- Peut indiquer le type de véhicule

**Exemples:**
- Chariot → type: vehicle, subType: (vide)
- Bateau → type: vehicle, subType: (vide)

### Objets divers (trapping)

**SubTypes:**
- Peut être utilisé pour des sous-catégories (Vêtements, Outils, Provisions, etc.)

**Exemples:**
- Corde → type: trapping, subType: (vide)
- Lanterne → type: trapping, subType: (vide)
- Vêtements → type: trapping, subType: (vide)

## Attribution de catégorie

### Par type d'objet

L'attribution du type se fait selon la fonction principale de l'objet:

**Fonction offensive:** melee ou ranged
**Fonction défensive:** armor
**Fonction utilitaire:** trapping
**Transport:** vehicle

### Cas particuliers

**Arme improvisée:**
- Peut être trapping avec propriétés de combat
- Ou melee/ranged selon usage

**Bouclier:**
- Généralement type: armor
- Parfois considéré comme arme (melee) dans certaines variantes

**Conteneurs:**
- Type: trapping
- Propriété `carry` définie (capacité)

## Affichage regroupé

L'interface regroupe généralement l'inventaire par type:

### Section Armes
- Armes de mêlée (melee)
- Armes à distance (ranged)
- Munitions (ammunition)

### Section Armures
- Toutes pièces d'armure (armor)

### Section Équipement
- Objets divers (trapping)
- Véhicules (vehicle)

Chaque section peut être sous-groupée par subType si nécessaire.

## Relations avec d'autres systèmes

### Avec Inventory
La catégorisation structure l'affichage de l'inventaire.
Voir [inventory.md](./inventory.md)

### Avec Display
Les catégories organisent la présentation à l'utilisateur.
Voir [display.md](./display.md)

### Avec Database
Les types correspondent aux structures de données dans les tables.
Voir [audit/database/trappings.md](../../database/trappings.md)

## Validation

### Règles métier

**Type obligatoire:**
- Tous les objets doivent avoir un type valide
- Type dans la liste autorisée

**SubType optionnel:**
- Doit correspondre au type si défini
- Groupes d'armes cohérents avec le type

### Vérifications

- Vérifier que type est défini
- Vérifier que type est dans la liste autorisée
- Si subType défini, vérifier cohérence avec type
- Alerter si type inconnu
