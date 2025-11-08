# Wizard Characteristics - Calcul totaux et bonus

## Contexte

Chaque caractéristique affiche sa valeur totale (somme de toutes les composantes) et son Bonus (Total ÷ 10). Le Bonus est utilisé dans tous les tests et calculs du jeu.

**Relations** : Voir [characteristics.md](../../database/characteristics.md) et [characteristics-base.md](./characteristics-base.md)

## Formule de calcul Total

### Formule complète

**Total = Base Espèce + Variable (2d10) + Avances Carrière + XP**

**Décomposition** :
1. Base Espèce : Valeur fixe de la race (ex: Humain 20, Nain 30)
2. Variable (2d10) : Jet aléatoire 2-20 OU saisie manuelle 4-18
3. Avances Carrière : 0-5 points alloués lors de la création (niveau 1 uniquement)
4. XP : 0 lors de la création (utilisé après création pour progresser)

### Application wizard

**Lors de la création** : Total = Base + Variable + Avances

**XP = 0** : Le personnage n'a pas encore dépensé d'expérience

**Exemple Humain Agitateur** :
- CC : 20 (base) + 12 (2d10) + 0 (carrière) = 32
- CT : 20 + 8 + 3 (carrière) = 31
- Int : 20 + 10 + 2 (carrière) = 32
- Soc : 20 + 11 + 0 (carrière) = 31

**Exemple Nain Artisan** :
- Dex : 20 (base) + 10 (2d10) + 3 (carrière) = 33
- F : 20 + 13 + 2 (carrière) = 35
- Soc : 10 + 6 + 0 (carrière) = 16

## Calcul du Bonus

### Formule Bonus

**Bonus = Total ÷ 10** (division entière, arrondi inférieur)

**Exemples** :
- Total 32 → Bonus 3 (32 ÷ 10 = 3,2 → 3)
- Total 48 → Bonus 4 (48 ÷ 10 = 4,8 → 4)
- Total 16 → Bonus 1 (16 ÷ 10 = 1,6 → 1)
- Total 9 → Bonus 0 (9 ÷ 10 = 0,9 → 0)

### Utilisation du Bonus

**Tests de compétences** : Valeur Compétence = Caractéristique Total + Avances Compétence

**Bonus de Force (BF)** : Dégâts au corps à corps = Arme + BF

**Bonus d'Endurance (BE)** : Calcul Points de Blessure

**Bonus de Force Mentale (BFM)** : Résistance magie, peur, corruption

**Tous les tests** : Le Bonus simplifie les calculs (pas besoin de diviser à chaque fois)

## Affichage Total et Bonus

### Colonne Total

**Position** : Dernière colonne du tableau des caractéristiques

**Calcul affiché** : Somme visible de toutes les composantes

**Exemple affichage** :
```
Carac  | Base | Jet | Aug | Total
-------|------|-----|-----|------
CC     | 20   | 12  | 0   | 32
CT     | 20   | 8   | 3   | 31
F      | 20   | 14  | 0   | 34
E      | 20   | 11  | 2   | 33
```

### Affichage Bonus

**Format** : Bonus affiché entre parenthèses ou colonne séparée

**Exemples** :
- CC 32 (Bonus 3)
- E 48 (Bonus 4)
- Soc 16 (Bonus 1)

**Mise à jour** : Bonus recalculé automatiquement à chaque modification du Total

## Mise à jour temps réel

### Événements déclencheurs

**Modification jet 2d10** : Boutons +/- en mode manuel → Total et Bonus recalculés

**Modification augmentations carrière** : Allocation des 5 points → Total et Bonus recalculés

**Relance des dés** : Nouveaux jets 2d10 → Tous Totaux et Bonus recalculés

### Processus de recalcul

**Déclencheur** : Event "change" sur champ input

**Calcul** : Total = somme des composantes affichées

**Bonus** : Division entière du Total

**Affichage** : Mise à jour des cellules Total et Bonus dans le DOM

**Validation** : Vérification contraintes (budget points, limites min/max)

## Exemples de calculs détaillés

### Humain standard (mode aléatoire)

**Base** : Toutes à 20

**Jets 2d10** : CC=12, CT=8, F=14, E=11, I=9, Ag=13, Dex=7, Int=10, FM=15, Soc=11

**Avances carrière Agitateur** : CT+3, Int+2, Soc+0

**Totaux** :
- CC : 20+12+0 = 32 (Bonus 3)
- CT : 20+8+3 = 31 (Bonus 3)
- F : 20+14+0 = 34 (Bonus 3)
- E : 20+11+0 = 31 (Bonus 3)
- I : 20+9+0 = 29 (Bonus 2)
- Ag : 20+13+0 = 33 (Bonus 3)
- Dex : 20+7+0 = 27 (Bonus 2)
- Int : 20+10+2 = 32 (Bonus 3)
- FM : 20+15+0 = 35 (Bonus 3)
- Soc : 20+11+0 = 31 (Bonus 3)

**Points de Blessure** : BF + (2 × BE) + BFM = 3 + (2 × 3) + 3 = 12

### Nain guerrier (mode manuel optimisé)

**Base** : CC=30, E=30, FM=40, autres variables

**Saisie manuelle** : CC=18, E=18, FM=16, F=16, CT=12, I=10, Int=8, Dex=8, Ag=4, Soc=4

**Avances carrière Guerrier** : CC+5, F+0, E+0

**Totaux** :
- CC : 30+18+5 = 53 (Bonus 5)
- E : 30+18+0 = 48 (Bonus 4)
- FM : 40+16+0 = 56 (Bonus 5)
- F : 20+16+0 = 36 (Bonus 3)
- CT : 20+12+0 = 32 (Bonus 3)

**Points de Blessure** : BF + (2 × BE) + BFM = 3 + (2 × 4) + 5 = 16

### Haut Elfe mage (mode aléatoire équilibré)

**Base** : I=40, Int=30, FM=30, Soc=30, CC=30, CT=30, Ag=30

**Jets 2d10** : Tous à 10 (moyenne)

**Avances carrière Apprenti Sorcier** : Int+3, FM+2, Dex+0

**Totaux** :
- I : 40+10+0 = 50 (Bonus 5)
- Int : 30+10+3 = 43 (Bonus 4)
- FM : 30+10+2 = 42 (Bonus 4)
- Soc : 30+10+0 = 40 (Bonus 4)
- CC : 30+10+0 = 40 (Bonus 4)

**Profil** : Mage puissant avec haute Initiative et Bonus mentaux

### Ogre brute (base extrêmes)

**Base** : F=35, E=35, I=0, Int=10, Ag=10, Dex=10

**Jets 2d10** : Aléatoires F=15, E=14, I=5, Int=6

**Avances carrière Brute** : F+5, E+0, CC+0

**Totaux** :
- F : 35+15+5 = 55 (Bonus 5)
- E : 35+14+0 = 49 (Bonus 4)
- I : 0+5+0 = 5 (Bonus 0)
- Int : 10+6+0 = 16 (Bonus 1)

**Points de Blessure** : (BF + (2 × BE) + BFM) × 2 = (5 + 8 + BFM) × 2 (formule spéciale Ogre)

## Voir aussi

- [characteristics-base.md](./characteristics-base.md) - Valeurs de base
- [characteristics-roll.md](./characteristics-roll.md) - Jet 2d10
- [characteristics-career-bonus.md](./characteristics-career-bonus.md) - Avances carrière
- [characteristics-derived.md](./characteristics-derived.md) - Attributs dérivés (Blessures)
