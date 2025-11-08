# Wizard Characteristics - Calculs dérivés

## Contexte

Après détermination des 10 caractéristiques de base, le système calcule automatiquement les attributs dérivés : Mouvement, Points de Blessure, Destin, Résolution et Points de Fortune. Ces valeurs dépendent de l'espèce et des caractéristiques.

**Relations** : Voir [characteristics.md](../../database/characteristics.md), [species.md](../../database/species.md) et [characteristics-totals.md](./characteristics-totals.md)

## Mouvement (M)

### Valeur selon espèce

**Source** : Champ `characteristics.rand[espèce]` pour la caractéristique "Mouvement" (index 16, type "mv")

**Valeurs fixes** :
- Humain : 4
- Halfling : 3
- Nain : 3
- Gnome : 3
- Haut Elfe : 5
- Elfe Sylvain : 5
- Ogre : 6

**Aucun calcul** : Valeur directement lue depuis la table, pas de formule

### Modificateurs possibles

**Talents** : Certains talents modifient le Mouvement
- Exemple : "Foulée puissante" (+1 Mouvement)
- Application après création du personnage

**Traits** : Créatures peuvent avoir modificateurs spéciaux
- Exemple : Monture rapide, Vol

**Limitation wizard** : Le wizard affiche seulement la valeur de base de l'espèce, sans modificateurs

### Signification

**Mouvement 3** : 6 km/h en marche, 12 km/h en course (Halfling, Nain, Gnome)

**Mouvement 4** : 8 km/h en marche, 16 km/h en course (Humain)

**Mouvement 5** : 10 km/h en marche, 20 km/h en course (Elfes)

**Mouvement 6** : 12 km/h en marche, 24 km/h en course (Ogre)

## Points de Blessure (B)

### Formules complexes selon espèce

**Formule standard** : BF + (2 × BE) + BFM
- Utilisée par : Humain, Nain, Haut Elfe, Elfe Sylvain

**Formule Halfling/Gnome** : (2 × BE) + BFM
- Pas de BF (petites tailles, moins robustes)

**Formule Ogre** : (BF + (2 × BE) + BFM) × 2
- Double résistance physique

**Notation** : BF = Bonus Force, BE = Bonus Endurance, BFM = Bonus Force Mentale

### Exemples de calculs

**Humain** : BF 3, BE 3, BFM 3 → 3 + (2×3) + 3 = 12

**Nain** : BF 3, BE 4, BFM 5 → 3 + (2×4) + 5 = 16

**Halfling** : BE 3, BFM 3 → (2×3) + 3 = 9

**Haut Elfe** : BF 3, BE 3, BFM 4 → 3 + (2×3) + 4 = 13

**Ogre** : BF 5, BE 4, BFM 2 → (5 + (2×4) + 2) × 2 = 30

### Importance capitale

**Survie** : Détermine combats survivables avant mort

**Équilibre** : Endurance compte double (×2) dans toutes formules

**Force Mentale** : Résistance mentale contribue aussi à la robustesse physique (lien corps-esprit)

## Destin et Résolution

### Destin de base

**Source** : Champ `characteristics.rand[espèce]` pour "Destin" (index 11, type "extra")

**Valeurs par espèce** :
- Humain : 2
- Gnome : 2
- Halfling : 0
- Nain : 0
- Haut Elfe : 0
- Elfe Sylvain : 0
- Ogre : 0

**Signification** : Points de Destin permettent de relancer jets ou éviter mort (ressource limitée)

### Résolution de base

**Source** : Champ `characteristics.rand[espèce]` pour "Résolution" (index 13, type "extra")

**Valeurs par espèce** : Toutes espèces commencent avec 0 Résolution de base

**Signification** : Points de Résolution permettent d'ignorer États (Assourdi, Aveuglé, etc.)

### Extra Points à répartir

**Source** : Champ `characteristics.rand[espèce]` pour "Extra Points" (index 15, type "points")

**Valeurs par espèce** :
- Humain : 3
- Nain : 2
- Haut Elfe : 0
- Elfe Sylvain : 0
- Halfling : 3
- Gnome : 1
- Ogre : 0

**Répartition** : Joueur distribue ces points entre Destin et Résolution lors du wizard

**Exemple Humain** : Destin base 2 + Extra 3 → +2 Destin, +1 Résolution → Final Destin 4, Résolution 1

**Exemple Nain** : Destin base 0 + Extra 2 → +0 Destin, +2 Résolution → Final Destin 0, Résolution 2

**Interface** : Boutons +/- pour allouer. Validation bloquée si Extra Points ≠ 0

## Points de Fortune (Chance)

### Initialisation

**Valeur initiale** : 0 pour toutes espèces

**Type** : Caractéristique index 12 (pas de type spécifique)

**Source** : characteristics.json (Chance)

### Acquisition ultérieure

**Talents** : "Chanceux" donne +1 Chance par rang
- Rangs illimités possibles
- Cumul : Rang 1 = +1, Rang 5 = +5 Chance

**Progression** : Points de Fortune augmentent uniquement par talents, pas lors création

**Limitation wizard** : Affiche 0 lors création (sauf si espèce a talent Chanceux de base)

### Utilisation

**Fonction** : Relancer jet de dés (comme Destin) mais ressource renouvelable

**Recharge** : Points de Fortune se rechargent quotidiennement (contrairement au Destin)

**Stratégie** : Personnages chanceux investissent dans talent Chanceux pour sécurité quotidienne

## Affichage dans le wizard

### Étape dédiée "Extra Points"

**Après caractéristiques roll et carrière** : Écran séparé pour Destin/Résolution

**Colonnes** :
- Attribut : Destin / Résolution
- Base : Valeur espèce
- Allocation : Points ajoutés via Extra Points
- Total : Base + Allocation

**Validation** : Bouton Valider activé seulement si tous Extra Points dépensés

### Mouvement et Blessures en lecture seule

**Affichage automatique** : Calculés et affichés sans interaction joueur

**Mouvement** : Affiché dans section caractéristiques spéciales (non modifiable)

**Blessures** : Calculées dès que F, E, FM finalisées

**Mise à jour temps réel** : Si joueur modifie F, E ou FM, Blessures recalculées instantanément

## Exemples par espèce

**Humain** : M=4, B=12 (BF 3 + 2×BE 3 + BFM 3), Destin base 2 + 3 Extra Points à répartir

**Nain** : M=3, B=16 (BF 3 + 2×BE 4 + BFM 5), Destin base 0 + 2 Extra Points à répartir

**Haut Elfe** : M=5, B=13 (BF 3 + 2×BE 3 + BFM 4), Destin base 0 + 0 Extra Points (aucune répartition)

**Elfe Sylvain** : M=5, B=12 (BF 3 + 2×BE 3 + BFM 3), Destin base 0 + 0 Extra Points

**Halfling** : M=3, B=9 (2×BE 3 + BFM 3), Destin base 0 + 3 Extra Points à répartir

**Gnome** : M=3, B=10 (2×BE 3 + BFM 4), Destin base 2 + 1 Extra Point à répartir

**Ogre** : M=6, B=30 ((BF 5 + 2×BE 4 + BFM 2) × 2), Destin base 0 + 0 Extra Points

## Voir aussi

- [characteristics.md](../../database/characteristics.md) - Structure complète
- [characteristics-totals.md](./characteristics-totals.md) - Calcul des Bonus
- [species.md](../../database/species.md) - Valeurs de base par espèce
