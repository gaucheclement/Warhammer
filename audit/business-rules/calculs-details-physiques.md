# Calculs des Détails Physiques

## Vue d'ensemble

Les détails physiques (âge, taille, couleur yeux/cheveux) sont générés à partir de formules spécifiques par race stockées dans la table Details. Ces formules utilisent des jets de dés (d10) pour créer de la variété entre personnages d'une même race.

**Objectif métier** : Fournir des caractéristiques physiques uniques et réalistes pour chaque personnage selon sa race, avec variabilité aléatoire contrôlée.

## Structure des données Details

### Champs de la table details.json
- **label** : Nom du détail ("Nom", "Age", "Age Base", "Age Roll", "Couleur des yeux", "Couleur des cheveux", "Taille")
- **desc** : Valeurs ou descriptions par race (utilise `refDetail` de Species)
- **allDesc** : Description générale applicable à toutes les races

### Relation avec Species
Chaque species possède un champ `refDetail` (ex: "Humain", "Nain", "Haut Elfe") qui détermine quelle colonne de `desc` utiliser.

## Formules de calcul

### 1. Calcul de l'âge
**Formule** : Âge = Age Base + (Age Roll × 1d10)

**Processus** :
1. Récupérer Age Base de `details.json` selon refDetail
2. Récupérer Age Roll (nombre de d10 à lancer)
3. Lancer Age Roll fois un d10 et additionner les résultats
4. Ajouter au Age Base

**Exemples par race** :

| Race | Age Base | Age Roll | Formule complète | Range résultant |
|------|----------|----------|------------------|-----------------|
| Humain | 15 | 1 | 15 + 1d10 | 16-25 ans |
| Halfling | 15 | 5 | 15 + 5d10 | 20-65 ans |
| Nain | 15 | 10 | 15 + 10d10 | 25-115 ans |
| Haut Elfe | 30 | 10 | 30 + 10d10 | 40-130 ans |
| Elfe Sylvain | 30 | 10 | 30 + 10d10 | 40-130 ans |
| Gnome | 20 | 10 | 20 + 10d10 | 30-120 ans |
| Ogre | 15 | 5 | 15 + 5d10 | 20-65 ans |

**Interprétation métier** :
- Humains : Jeunes adultes (16-25), espérance de vie ~60 ans
- Halflings : Adolescents/jeunes adultes (20-65), espérance de vie ~120 ans
- Nains : Jeunes guerriers (25-115), espérance de vie > 200 ans
- Elfes : Jeunes selon standards elfiques (40-130), espérance de vie millénaire
- Gnomes : Jeunes artisans (30-120), espérance de vie ~500 ans
- Ogres : Jeunes mercenaires (20-65), espérance de vie ~120 ans (rarement atteinte)

### 2. Couleur des yeux
**Formule** : 2d10 → Lookup dans table eyes

**Processus** :
1. Lancer 2d10 (résultat entre 2 et 20)
2. Parcourir la table `eyes` dans l'ordre
3. Sélectionner la première entrée où `rand >= valeur_obtenue`
4. Utiliser `label[refDetail]` pour obtenir le nom de la couleur selon la race

**Spécificités** : **Elfes** lancent 2 fois pour yeux bigarrés (nature magique). **Gnomes** : couleur change avec âge, gris à 200 ans. **Ogres** : pupilles adaptées montagne/désert, dilatées en climat tempéré.

### 3. Couleur des cheveux
**Formule** : 2d10 → Lookup dans table hairs

**Processus** : Identique à la couleur des yeux
1. Lancer 2d10
2. Parcourir table `hairs`
3. Première entrée où `rand >= valeur`
4. Utiliser `label[refDetail]`

**Spécificités** : **Toutes races (sauf Elfes)** : grisonnent avec âge, blancs en vieillesse. **Elfes** : éternellement jeunes. **Gnomes** : deviennent argent (pas blanc), pilosité selon mode clanique. **Ogres** : épais/sombres, mâles chauves après 30 ans, barbe prisée avec restes nourriture. **Humains/Nains** : pilosité faciale assortie à chevelure.

### 4. Calcul de la taille
**Formule** : Taille = Height Base + (Height Roll × 1d10)

**Processus** :
1. Récupérer Height Base selon refDetail (stocké dans species data)
2. Récupérer Height Roll (nombre de d10)
3. Lancer Height Roll fois un d10 et additionner
4. Ajouter au Height Base
5. Arrondir à 2 décimales

**Moyennes par race** (selon details.json) :

| Race | Taille moyenne | Range typique |
|------|----------------|---------------|
| Halfling | 1,00 m | ~0,90-1,10 m |
| Gnome | 1,15 m | ~1,05-1,25 m |
| Nain | 1,45 m | ~1,35-1,55 m |
| Humain | 1,75 m | Variable (voir règle spéciale) |
| Elfe | 1,90 m | ~1,80-2,00 m |
| Ogre | 2,75 m (mâles) | > 2,65 m |

**Règle spéciale Humains** : Pour taille vraiment aléatoire, si un des dés obtient 10, lancer un dé supplémentaire et ajouter le résultat. Cela reflète la grande variabilité de taille chez les Humains.

**Spécificité Ogres** : Ogres femelles à peine plus petites que mâles. Culturellement, le poids compte plus que la taille : plus lourd = mieux.

## Cas d'usage métier

### Génération aléatoire complète
**Objectif** : Créer rapidement tous les détails physiques d'un personnage

**Processus** :
1. **Âge** : Calculer selon formule (Age Base + rolls)
2. **Yeux** : 2d10 → lookup table eyes (×2 pour elfes)
3. **Cheveux** : 2d10 → lookup table hairs
4. **Taille** : Calculer selon formule (Height Base + rolls)

**Avantage** : Génération rapide, valeurs réalistes garanties, variété entre personnages.

### Saisie manuelle
**Objectif** : Permettre au joueur de choisir précisément l'apparence

**Contraintes** :
- Âge doit être dans le range réaliste (min = Age Base, max raisonnable selon espérance de vie)
- Couleurs yeux/cheveux doivent être cohérentes avec la race
- Taille doit être proche de la moyenne raciale

**Usage** : Joueurs expérimentés avec concept précis de personnage.

### Génération partielle
**Objectif** : Générer certains détails, laisser d'autres au choix

**Exemple** : Générer âge et taille aléatoirement, choisir couleurs yeux/cheveux manuellement pour correspondre à l'imaginaire du joueur.

## Points d'attention

### Cohérence avec l'espérance de vie
Les âges générés sont toujours ceux de jeunes adultes aptes à l'aventure :
- Humains 16-25 ans : jeunes et vigoureux
- Nains 25-115 ans : relativement jeunes pour race vivant 200+ ans
- Elfes 40-130 ans : adolescence/jeune adulte pour race millénaire

**Raison métier** : Personnages doivent être capables physiquement pour carrière d'aventurier.

### Variabilité réaliste
Le nombre de d10 contrôle la variabilité :
- 1d10 (Humains) : peu de variabilité (10 ans max)
- 10d10 (Nains, Elfes, Gnomes) : grande variabilité (100 ans max)

**Interprétation** : Races longévives ont plus de latitude d'âge pour débuter aventures.

### Tables eyes/hairs pondérées
Les tables utilisent le système de seuils (comme species.rand) :
- Valeurs fréquentes : seuils bas (ex: rand=10 → 2-10 = 45% de chances)
- Valeurs rares : seuils hauts (ex: rand=20 → seulement 20 = 2,5% de chances)

**Usage** : Couleurs communes (brun, noir) ont seuils bas, couleurs rares (doré, argenté) ont seuils hauts.

### Arrondi de taille
Taille arrondie à 2 décimales pour précision réaliste sans excès.
**Exemple** : 1,7834 m → 1,78 m

### Stockage des valeurs
Une fois générés, les détails sont stockés dans `character.details[]` :
- Index 0 : Nom
- Index 1 : Âge
- Index 2 : Couleur yeux
- Index 3 : Couleur cheveux
- Index 4 : Taille

## Exemples complets

### Humain Reiklander
**Génération aléatoire** :
1. Âge : 15 + 1d10 = 15 + 7 = **22 ans**
2. Yeux : 2d10 = 5+8 = 13 → **Marron** (rand=15, 15>=13)
3. Cheveux : 2d10 = 3+9 = 12 → **Châtain** (rand=14, 14>=12)
4. Taille : 1,60 + 2d10 cm = 1,60 + 0,15 = **1,75 m**

**Résultat** : Humain de 22 ans, yeux marron, cheveux châtains, 1,75 m.

### Nain
**Génération aléatoire** :
1. Âge : 15 + 10d10 = 15 + (3+7+5+9+2+4+8+6+5+7) = 15 + 56 = **71 ans**
2. Yeux : 2d10 = 6+6 = 12 → **Gris** (rand=13, 13>=12)
3. Cheveux : 2d10 = 8+7 = 15 → **Roux** (rand=16, 16>=15)
4. Taille : 1,30 + 2d10 cm = 1,30 + 0,12 = **1,42 m**

**Résultat** : Nain de 71 ans (jeune pour sa race), yeux gris, barbe rousse, 1,42 m.

### Haut Elfe
**Génération aléatoire** :
1. Âge : 30 + 10d10 = 30 + 68 = **98 ans**
2. Yeux : 2d10 + 2d10 (bigarrés) = (4+7) + (9+3) = 11 et 12 → **Bleu saphir moucheté d'or**
3. Cheveux : 2d10 = 10+10 = 20 → **Argenté** (rand=20, couleur rare)
4. Taille : 1,75 + 2d10 cm = 1,75 + 0,18 = **1,93 m**

**Résultat** : Elfe de 98 ans (jeune), yeux bigarrés bleu/or, cheveux argentés (rare), 1,93 m.

## Cross-références
[species.md] (champ refDetail détermine quelle colonne utiliser), [character-creation.md] (étape Détails dans processus création)
