# Eyes & Hairs - Tables de données

## Vue d'ensemble

Les tables Eyes et Hairs stockent les options de couleur pour les yeux et cheveux des personnages selon leur race. Chaque table contient 10 entrées correspondant aux résultats possibles d'un jet de 2d10.

**Objectif métier** : Fournir des détails physiques variés lors de la création de personnage, avec des options adaptées à chaque espèce.

## Structure des données

### Champs communs (Eyes et Hairs)

- **index** : Position dans le tableau (0-9)
- **rand** : Seuil pour génération 2d10 (2, 3, 4, 7, 11, 14, 17, 18, 19, 20)
- **label** : Objet contenant les couleurs par race

### Objet label

Contient une propriété par race jouable :
- Humain
- Halfling
- Nain
- Haut Elfe
- Elfe Sylvain
- Gnome
- Ogre

**Exemple** (Eyes, index 0) :
- Humain : "Au choix"
- Halfling : "Gris clair"
- Nain : "Houille"
- Haut Elfe : "Jais"
- Elfe Sylvain : "Ivoire"
- Gnome : "Bleu pâle"
- Ogre : "Gris"

## Génération aléatoire (2d10)

### Méthode de sélection

**Processus** :
1. Lancer 2d10 (résultat entre 2 et 20)
2. Parcourir la table dans l'ordre croissant de `rand`
3. Sélectionner la première entrée où `rand >= résultat_2d10`

**Distribution des probabilités** :
Le système 2d10 crée une courbe en cloche (résultats centraux plus probables).

| Résultat 2d10 | Index | Probabilité |
|---------------|-------|-------------|
| 2 | 0 | 1% |
| 3 | 1 | 2% |
| 4 | 2 | 3% |
| 5-7 | 3 | 12% (5=4%, 6=5%, 7=3%) |
| 8-11 | 4 | 18% (8=5%, 9=5%, 10=5%, 11=3%) |
| 12-14 | 5 | 15% (12=5%, 13=5%, 14=3%) |
| 15-17 | 6 | 12% (15=4%, 16=4%, 17=1%) |
| 18 | 7 | 5% |
| 19 | 8 | 4% |
| 20 | 9 | 1% |

**Conséquence métier** : Les couleurs aux index 4 et 5 (rand 11-14) sont les plus courantes.

### Couleurs fréquentes par race

**Eyes (couleurs communes, index 4-5)** :
- Humain : Gris pâle, Gris
- Halfling : Vert, Noisette
- Nain : Brun terre, Marron foncé
- Haut Elfe : Turquoise, Emeraude
- Elfe Sylvain : Châtaigne (apparaît 2x)
- Gnome : Vert pâle, Noisette
- Ogre : Marron, Marron foncé

**Hairs (couleurs communes, index 4-5)** :
- Humain : Brun clair, Brun foncé
- Halfling : Châtaigne, Gingembre
- Nain : Cuivre, Bronze
- Haut Elfe : Blond intense, Blond cuivré
- Elfe Sylvain : Brun, Brun acajou
- Gnome : Auburn, Roux
- Ogre : Lie de vin, Marron foncé

## Variété par race

### Spectre chromatique

**Humains (Eyes)** : Vert, Bleu (pâle/normal), Gris (pâle/normal), Marron, Noisette, Marron foncé, Noir, Au choix
- Palette naturelle et réaliste

**Haut Elfe (Eyes)** : Jais, Améthyste, Aigue-marine, Saphir, Turquoise, Emeraude, Ambre, Cuivre, Citrine, Or
- Palette de pierres précieuses

**Haut Elfe (Hairs)** : Argent, Blanc, Blond (pâle/normal/intense/cuivré/ambré), Auburn, Roux, Noir
- Palette métallique et noble

**Elfes Sylvains (Eyes)** : Ivoire, Anthraciste, Vert (lierre/mousse), Châtaigne, Marron foncé, Ocre, Châtain clair, Violet
- Palette forestière et naturelle

**Nains (Hairs)** : Blanc, Gris, Blond pâle, Doré, Cuivre, Bronze, Brun (normal/foncé/roux), Noir
- Palette minérale

**Ogres** : Couleurs inhabituelles (Mauve, Bleu nuit, Lie de vin)
- Palette exotique

### Option "Au choix"

**Eyes (Humain, index 0)** : Résultat 2 = "Au choix"
- Probabilité 1% d'avoir le choix libre
- Permet personnalisation tout en gardant rareté

## Relations avec autres tables

### Utilisation dans le wizard

**Étape WizardStep7Details** (voir [features/wizard-details.md]) :
- Sélection automatique des yeux via jet 2d10
- Sélection automatique des cheveux via jet 2d10
- Filtre basé sur la race choisie (refDetail de la species)

**Dépendances** :
- Requiert `species.refDetail` pour déterminer quelle colonne de `label` utiliser
- Voir [species.md] pour mapping refDetail

### Utilisation dans le modèle personnage

**Stockage** :
- `character.eyes` : Chaîne de texte (couleur sélectionnée)
- `character.hairs` : Chaîne de texte (couleur sélectionnée)

**Affichage** :
- Fiche identité personnage (voir [features/character-sheet.md])
- Section détails physiques avec âge, taille, yeux, cheveux

## Validation des données

### Règles de cohérence

**Structure** :
- Exactement 10 entrées par table
- Index séquentiels de 0 à 9
- Valeurs `rand` : 2, 3, 4, 7, 11, 14, 17, 18, 19, 20 (couvre 2d10)
- Objet `label` présent dans chaque entrée

**Complétude** :
- Chaque `label` DOIT contenir les 7 races : Humain, Halfling, Nain, Haut Elfe, Elfe Sylvain, Gnome, Ogre
- Aucune valeur vide ou null

**Unicité** :
- Pas de doublons exacts dans les valeurs `rand`
- Pas de gaps dans les valeurs 2d10 (tous résultats couverts)

### Points d'attention

**Typos détectées** :
- Hairs index 7, Gnome : "Bond doré" (probablement "Blond doré")

**Cohérence thématique** :
- Les couleurs doivent correspondre à l'univers Warhammer
- Respect des stéréotypes raciaux (ex: Elfes = couleurs nobles)

## Différences avec Species/Careers

**Tables statiques** :
- Eyes et Hairs sont des tables de lookup pures
- Pas de relations vers autres entités
- Pas de données narratives (desc) ou références bibliographiques

**Pas de variantes** :
- Contrairement à species (13 variantes Humains), Eyes/Hairs ont 1 couleur par race par index
- Pas de gestion de sous-types ou régions

**Génération simple** :
- 2d10 direct sans pondération complexe
- Pas de bonus XP ou choix multiples
- Sélection unique et immédiate

## Exemples d'utilisation

**Création Humain Reiklander** :
1. Jet eyes : 2d10 = 8 → index 4 → "Gris pâle"
2. Jet hairs : 2d10 = 13 → index 5 → "Brun foncé"

**Création Haut Elfe** :
1. Jet eyes : 2d10 = 11 → index 4 → "Turquoise"
2. Jet hairs : 2d10 = 17 → index 6 → "Blond ambré"

**Création Ogre** :
1. Jet eyes : 2d10 = 19 → index 8 → "Mauve"
2. Jet hairs : 2d10 = 4 → index 2 → "Blond cendré"

**Cas spécial Humain** :
1. Jet eyes : 2d10 = 2 → index 0 → "Au choix"
2. Joueur choisit librement (ex: "Hétérochromie", "Violet", etc.)
