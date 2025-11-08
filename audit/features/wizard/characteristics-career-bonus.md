# Wizard Characteristics - Ajout bonus carrière

## Contexte

Après avoir déterminé les caractéristiques de base (espèce + jet 2d10), le joueur répartit 5 augmentations parmi les caractéristiques liées à sa carrière de niveau 1. Ces augmentations représentent la formation initiale du personnage.

**Relations** : Voir [career-levels.md](../../database/careerLevels.md), [characteristics.md](../../database/characteristics.md) et [parsing-avances-caracteristiques.md](../../business-rules/parsing-avances-caracteristiques.md)

## Avances de caractéristiques par niveau carrière

### Format stocké

**Champ** : `careerLevels.characteristics` (type : string)

**Syntaxe** : Noms de caractéristiques séparés par virgules

**Exemples** :
- Agitateur N1 : "Capacité de Tir, Intelligence, Sociabilité"
- Artisan N1 : "Dextérité, Force, Sociabilité"
- Bourgeois N1 : "Agilité, Dextérité, Sociabilité"

### Règle d'augmentation implicite

**Valeur par caractéristique** : +5 points (implicite, non écrit dans les données)

**Nombre au niveau 1** : Toujours 3 caractéristiques listées

**Total niveau 1** : 3 caractéristiques × 5 = 15 points d'augmentations possibles

## Application lors de la création

### Distribution des 5 points

**Règle** : Le joueur répartit 5 augmentations (non 15) parmi les 3 caractéristiques de carrière

**Contrainte** : Maximum 5 augmentations par caractéristique

**Minimum** : Le joueur peut choisir de ne pas augmenter une caractéristique (0 augmentation autorisée)

**Exemples de répartitions valides** :
- 5 en CT, 0 en Int, 0 en Soc (spécialisation totale)
- 3 en CT, 1 en Int, 1 en Soc (équilibré)
- 2 en CT, 2 en Int, 1 en Soc (mixte)

### Affichage séparé

**Colonne "Aug"** : Affiche le nombre d'augmentations allouées (0 à 5)

**Colonne "Total"** : Base + Jet + Augmentations

**Mise en valeur** : Les 3 caractéristiques de carrière sont surlignées pour guider le joueur

**Compteur** : "X Points à allouer" affiché en temps réel (initial : 5, diminue à chaque allocation)

## Calcul automatique lors sélection carrière

### Chargement des caractéristiques éligibles

**Processus** :
1. Récupération du niveau 1 de carrière via `character.getCareerLevel()`
2. Lecture du champ `characteristics` du niveau 1
3. Parsing de la chaîne (séparation par virgules)
4. Mapping vers les objets characteristics

**Exemple Agitateur** :
- Champ : "Capacité de Tir, Intelligence, Sociabilité"
- Parsing : ["Capacité de Tir", "Intelligence", "Sociabilité"]
- Mapping : [CT, Int, Soc]

### Filtrage de l'affichage

**Mode normal** : Seules les 3 caractéristiques de carrière sont affichées dans le tableau

**Mode libre** : Toutes les 10 caractéristiques roll sont affichées, avec mise en évidence des 3 de carrière

**Raison** : Focaliser le joueur sur les caractéristiques pertinentes pour sa carrière

## Exemples par carrière

### Agitateur (Pamphlétaire)

**Caractéristiques niveau 1** : CT, Int, Soc

**Profil** : Orateur et tireur

**Exemple de répartition** :
- Soc +3 (persuasion)
- Int +2 (rhétorique)
- Total : Base + Jet + Aug

**Résultat Humain** : Soc 20+11+3=34, Int 20+10+2=32, CT 20+8+0=28

### Artisan (Apprenti)

**Caractéristiques niveau 1** : Dex, F, Soc

**Profil** : Artisan manuel

**Exemple de répartition** :
- Dex +3 (précision artisanale)
- F +2 (endurance au travail)

**Résultat Nain** : Dex 20+10+3=33, F 20+13+2=35, Soc 10+6+0=16

### Bourgeois (Échevin)

**Caractéristiques niveau 1** : Ag, Dex, Soc

**Profil** : Noble urbain

**Exemple de répartition** :
- Soc +4 (commandement)
- Dex +1 (élégance)

**Résultat Haut Elfe** : Soc 30+12+4=46, Dex 20+8+1=29, Ag 30+11+0=41

### Enquêteur (Enquêteur de base)

**Caractéristiques niveau 1** : Ag, Dex, Int

**Profil** : Détective

**Exemple de répartition équilibrée** :
- Int +2, Ag +2, Dex +1

**Résultat Humain** : Int 20+10+2=32, Ag 20+13+2=35, Dex 20+7+1=28

## Application cumulative multi-niveaux

### Limitation au wizard

**Scope** : Le wizard de création applique UNIQUEMENT les augmentations du niveau 1

**Raison** : Le personnage débute au niveau 1, pas aux niveaux supérieurs

**Niveaux 2-4** : Non concernés par le wizard de création, seulement par la progression ultérieure

### Progression ultérieure

**Après création** : Les niveaux 2-4 sont accessibles via dépense XP

**Cumul** : Les augmentations de carrière se cumulent avec l'avancement
- N1 : 3 caractéristiques
- N2 : 1 caractéristique supplémentaire
- N3 : 1 caractéristique supplémentaire
- N4 : 1 caractéristique supplémentaire
- Total niveau 4 : 6 caractéristiques améliorées

**Exemple Agitateur complet** :
- N1 : CT, Int, Soc (+5 chacune potentiel)
- N2 : F (+5)
- N3 : Dex (+5)
- N4 : CC (+5)

**Cumul total** : 30 points d'augmentations possibles sur 4 niveaux

**Voir** : [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md)

## Voir aussi

- [characteristics-base.md](./characteristics-base.md) - Valeurs de base
- [characteristics-roll.md](./characteristics-roll.md) - Jet 2d10
- [characteristics-totals.md](./characteristics-totals.md) - Calcul des totaux
- [career-levels.md](../../database/careerLevels.md) - Structure des niveaux
