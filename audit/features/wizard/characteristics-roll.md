# Wizard Characteristics - Jet 2d10 variables

## Contexte

Le jet de 2d10 détermine la part variable des caractéristiques. Chaque caractéristique de type "roll" reçoit un résultat de 2 à 20, qui s'ajoute à la valeur de base de l'espèce.

**Relations** : Voir [characteristics.md](../../database/characteristics.md) et [characteristics-base.md](./characteristics-base.md)

## Formule 2d10

### Principe

**Formule** : Lancer 2 dés à 10 faces (d10) et additionner les résultats

**Plage de résultats** : 2 (1+1) à 20 (10+10)

**Distribution** : Courbe en cloche, résultats centraux plus probables (10-12 à ~9% chacun), extrêmes rares (2 ou 20 à 1% chacun)

### Application aux caractéristiques

**Caractéristiques concernées** : Les 10 caractéristiques de type "roll" (indices 0-9)
- CC, CT, F, E, I, Ag, Dex, Int, FM, Soc

**Calcul final** : Valeur totale = Base Espèce + Résultat 2d10

**Exemple Humain** :
- CC : 20 (base) + 12 (2d10) = 32
- E : 20 (base) + 11 (2d10) = 31
- FM : 20 (base) + 15 (2d10) = 35

**Exemple Nain** :
- CC : 30 (base) + 9 (2d10) = 39
- E : 30 (base) + 12 (2d10) = 42
- FM : 40 (base) + 11 (2d10) = 51

## Caractéristiques variables selon espèce

### Toutes espèces

Chaque espèce applique 2d10 sur TOUTES les 10 caractéristiques de type "roll". Il n'y a pas de distinction entre caractéristiques fixes et variables par espèce : toutes reçoivent le jet.

**Raison** : La variabilité vient des bases différentes (Nain 30 vs Humain 20 en E), pas du nombre de dés.

### Exemples de distributions

**Humain (toutes bases à 20)** :
- Plage possible CC : 22 à 40
- Plage possible Soc : 22 à 40
- Variabilité identique sur toutes caractéristiques

**Nain (bases variables)** :
- CC (base 30) : 32 à 50
- Ag (base 10) : 12 à 30
- FM (base 40) : 42 à 60
- Variabilité identique (±18 points), mais ranges différents

**Ogre (bases extrêmes)** :
- F (base 35) : 37 à 55
- I (base 0) : 2 à 20
- Même jet 2d10, résultats finaux très différents

## Relance des dés

### Possibilité de relance

**Règle** : Le joueur peut relancer les dés autant de fois qu'il le souhaite

**Conséquence XP** : Relancer annule le bonus XP de génération aléatoire
- Première génération acceptée : +50 XP
- Réassignation sans relance : +25 XP
- Relance : 0 XP

**Fonctionnement** : Chaque relance génère 10 nouveaux jets 2d10 indépendants, un par caractéristique

### États de génération

**État 0** : Pas encore généré. Bouton "Lancer" actif.

**État 1** : Première génération. Si acceptée sans modification : +50 XP.

**État 2** : Réassignation (permutation sans relance). Si validée : +25 XP.

**État 3** : Relance effectuée. Bonus XP perdus. Peut encore relancer.

**État -1** : Mode manuel activé (bouton "Choisir"). Plus de génération aléatoire possible.

**État -2** : Sélection finalisée et sauvegardée.

## Affichage du résultat

### Tableau de visualisation

**Colonnes** :
- Caractéristique : Nom complet (CC, CT, F, etc.)
- Base : Valeur de l'espèce
- Jet : Résultat 2d10 affiché
- Total : Base + Jet

**Animation lors du jet** :
- Dés virtuels s'affichent et roulent
- Résultats apparaissent séquentiellement (un par un)
- Ligne surlignée lors de l'apparition du résultat
- Total mis à jour dynamiquement

### Détails des jets

**Transparence** : Le système affiche les 2 valeurs individuelles des d10 pendant l'animation

**Exemple d'animation** :
1. CC : Dés roulent → 6 et 6 → Total 12 → CC = 20+12 = 32
2. CT : Dés roulent → 4 et 4 → Total 8 → CT = 20+8 = 28
3. F : Dés roulent → 7 et 7 → Total 14 → F = 20+14 = 34
...

**Stockage** : Les valeurs individuelles (die1, die2) ne sont utilisées que pour l'animation, seul le total (value) est conservé

## Génération complète aléatoire

### Bouton "Lancer"

**Fonction** : Génère simultanément les 10 jets de 2d10 pour toutes les caractéristiques

**Processus** :
1. Génération de 10 résultats indépendants (2d10 chacun)
2. Stockage dans randomState.imposedCharacteristics
3. Animation séquentielle des résultats
4. Mise à jour de l'état (randomState.characteristic)

### Mode automatique complet

**Bouton "Tout générer aléatoirement"** : Génère TOUT le personnage en un clic
1. Jets 2d10 pour les 10 caractéristiques roll
2. Distribution aléatoire des Extra Points (Destin/Résilience)
3. Répartition aléatoire des 5 augmentations de carrière
4. Validation automatique et passage à l'étape suivante

**Usage** : Création ultra-rapide pour PNJ ou test

## Exemples de jets

### Jet typique Humain

Base uniforme (20), jets variables créent profil unique :
- CC : 20+12=32 (bon combattant)
- CT : 20+8=28 (tireur moyen)
- F : 20+14=34 (fort)
- E : 20+11=31 (résistant)
- I : 20+9=29 (réactif)
- Ag : 20+13=33 (agile)
- Dex : 20+7=27 (dextérité moyenne)
- Int : 20+10=30 (intelligent)
- FM : 20+15=35 (volonté forte)
- Soc : 20+11=31 (charismatique)

### Jet typique Nain

Bases hautes (E 30, CC 30, FM 40), jets amplifient forces :
- CC : 30+14=44 (excellent guerrier)
- E : 30+16=46 (très robuste)
- FM : 40+13=53 (volonté exceptionnelle)
- Ag : 10+8=18 (peu agile malgré jet moyen)

### Jet exceptionnel (rare)

Tous jets ≥15 (probabilité ~0.0001%) :
- Humain avec 10 jets à 15+ : toutes caractéristiques ≥35
- Nain avec jets élevés : FM peut atteindre 60, E peut atteindre 50

### Jet médiocre (rare)

Tous jets ≤7 (probabilité ~0.1%) :
- Humain avec 10 jets à 7- : toutes caractéristiques ≤27
- Personnage faible mais jouable

## Voir aussi

- [characteristics-base.md](./characteristics-base.md) - Valeurs de base par espèce
- [characteristics-manual-mode.md](./characteristics-manual-mode.md) - Saisie manuelle alternative
- [characteristics-totals.md](./characteristics-totals.md) - Calcul des totaux et bonus
