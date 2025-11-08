# Wizard Species - Application Caractéristiques de Base

## Vue d'ensemble

**Objectif** : Appliquer automatiquement caractéristiques de base lors sélection espèce.

**Déclenchement** : Immédiatement après validation espèce (voir [species-selection.md]).

**Impact** : Initialise 10 principales (CC-Soc) + dérivées (B, M, Destin, Résilience).

## Source données

**Table** : characteristics.json

**Liaison** : `species.refChar` → clé dans `characteristics[].rand`

**Format** : "Base+Roll" (ex: "20+2d10") ou fixe (ex: "4")

## Formules calcul

### Format valeur

**Structure** : Base (fixe) + Jet dés (variable)

**Exemples** :
- "20+2d10" = 20 + (2-20) → Plage 22-40
- "30+2d10" = 30 + (2-20) → Plage 32-50
- "0" = 0 (fixe, pas de jet)

### Par espèce

| Carac | Humain | Nain | Haut Elfe | Halfling | Ogre |
|-------|--------|------|-----------|----------|------|
| CC | 20+2d10 | 30+2d10 | 30+2d10 | 10+2d10 | 20+2d10 |
| CT | 20+2d10 | 20+2d10 | 30+2d10 | 30+2d10 | 10+2d10 |
| F | 20+2d10 | 20+2d10 | 20+2d10 | 10+2d10 | 35+2d10 |
| E | 20+2d10 | 30+2d10 | 20+2d10 | 20+2d10 | 35+2d10 |
| I | 20+2d10 | 20+2d10 | 40+2d10 | 20+2d10 | 0 |
| Ag | 20+2d10 | 10+2d10 | 30+2d10 | 20+2d10 | 20+2d10 |
| Dex | 20+2d10 | 20+2d10 | 30+2d10 | 30+2d10 | 10+2d10 |
| Int | 20+2d10 | 20+2d10 | 30+2d10 | 20+2d10 | 10+2d10 |
| FM | 20+2d10 | 40+2d10 | 30+2d10 | 20+2d10 | 10+2d10 |
| Soc | 20+2d10 | 10+2d10 | 30+2d10 | 20+2d10 | 10+2d10 |

**Points forts** :
- Nains : E 30, FM 40 (résistance, volonté)
- Elfes : I 40, mentales 30 (rapidité, finesse)
- Halflings : CT 30, Dex 30 (tir, agilité)
- Ogres : F 35, E 35, I 0 (force brute, lenteur)

## Caractéristiques dérivées

### Blessures (B)

**Formules** :

| Espèce | Formule |
|--------|---------|
| Humain, Nain, Elfes | BF + (2 × BE) + BFM |
| Halfling, Gnome | (2 × BE) + BFM |
| Ogre | (BF + (2 × BE) + BFM) × 2 |

**Notation** : BF = F÷10, BE = E÷10, BFM = FM÷10

**Exemple Humain** (F=30, E=35, FM=28) :
- BF=3, BE=3, BFM=2
- B = 3 + (2×3) + 2 = 11

### Mouvement (M)

| Espèce | Mouvement |
|--------|-----------|
| Humain, Ogre | 4 |
| Nain, Halfling, Gnome | 3 |
| Elfes | 5 |

**Vitesses** :
- Marche : M × 2 yards/s
- Course : M × 4 yards/s

### Destin, Résilience, Extra Points

| Espèce | Destin | Résilience | Extra Points |
|--------|--------|------------|--------------|
| Humain | 2 | 1 | 3 |
| Nain | 0 | 2 | 2 |
| Elfes | 0 | 0 | 0 |
| Halfling | 0 | 0 | 0 |
| Gnome | 2 | 1 | 2 |
| Ogre | 0 | 0 | 0 |

**Pools** : Valeurs actuelles = Max (au départ)

**Extra Points** : Distribués librement entre Destin/Résilience (étape ultérieure wizard)

## Application automatique

### Workflow

1. Validation espèce → `character.setSpecie(species)`
2. Lecture `species.refChar` (ex: "Nain")
3. Récupération `characteristics[].rand[refChar]`
4. Tirage 2d10 pour chaque caractéristique "roll"
5. Calcul B (formule espèce)
6. Application M, Destin, Résilience, Extra Points
7. Sauvegarde character

### Exemple Nain

**refChar** : "Nain"

**Tirages** :
- CC : 30 + (2d10=12) = 42
- E : 30 + (2d10=14) = 44
- FM : 40 + (2d10=9) = 49
- ... (autres)

**Dérivées** :
- B = 3 + (2×4) + 4 = 15
- M = 3
- Destin = 0, Résilience = 2, Extra = 2

## Modificateurs raciaux

### Talents modifiant caractéristiques

**Source** : Talents raciaux espèce (voir [talents-modification-caracteristiques.md])

**Exemples** :
- Costaud (Nains) : +5 E
- Chanceux : +1 Chance/rang
- Vision nocturne : Capacité spéciale (pas modificateur carac)

**Moment** : APRÈS caractéristiques base, lors attribution talents (étape ultérieure)

### Compétences

**Généralement** : Compétences raciales ne modifient pas caractéristiques

**Exception** : Certains talents débloquent modifications (voir [talents-ajout-skills-magie.md])

## Validation

### Vérifications

- `species.refChar` existe et pointe clé valide
- Toutes 10 principales + B + M + Destin + Résilience présentes
- Valeurs dans plages attendues (22-60)
- Formules B correctes selon espèce

### Messages erreur

- "Impossible déterminer caractéristiques pour {species.label}"
- "Valeur {characteristic.label} absente pour {species.refChar}"
- "Formule Blessures incorrecte pour {species.refChar}"

## Relations tables

| Table | Champ | Usage |
|-------|-------|-------|
| Species | refChar | Clé dans characteristics.rand |
| Characteristics | rand[espèce] | Valeurs base + formules |
| Characteristics | type | roll/wounds/mv/points |

## Exemples concrets

### Humain Reiklander
- CC/CT/F/E/I/Ag/Dex/Int/FM/Soc : 20+2d10 (équilibré)
- B : BF + 2BE + BFM (standard)
- M : 4 (normal)
- Destin : 2, Résilience : 1, Extra : 3

### Nain
- Forces : E 30, FM 40 (résistant, volonté)
- Faiblesses : Ag 10, Soc 10 (lent, bourru)
- B : Formule standard (robuste grâce E élevée)
- M : 3 (lent)
- Pas Destin, mais Résilience 2

### Haut Elfe
- Forces : I 40, mentales 30, CC/CT/Ag/Dex 30 (supérieur partout)
- M : 5 (rapide)
- Pas Destin ni Résilience, Extra 0 (équilibre)

### Ogre
- Forces : F 35, E 35 (brute exceptionnelle)
- Faiblesse : I 0 (très lent)
- B : Formule ×2 (très résistant)
- M : 4, Destin/Résilience/Extra : 0

## Voir aussi

- [characteristics.md](../../database/characteristics.md) - Structure table
- [species.md](../../database/species.md) - Champ refChar
- [species-selection.md](./species-selection.md) - Sélection espèce
- [talents-modification-caracteristiques.md](../../business-rules/talents-modification-caracteristiques.md) - Modificateurs
