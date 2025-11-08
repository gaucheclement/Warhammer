# Pattern: "X Talent aléatoire"

## Contexte
Attribution de talents tirés aléatoirement lors de la création.
Courant dans les races pour diversifier les personnages.

## Format
```
"N Talent aléatoire"
```

Où N = nombre de talents à tirer (1-5 généralement)

## Exemples
```
"3 Talent aléatoire"
"2 Talent aléatoire"
"1 Talent aléatoire"
```

## Détection
Vérifier si le texte correspond au pattern `"N Talent aléatoire"` où N est un entier.

## Algorithme de tirage

### Tirage simple
Tirer aléatoirement N talents parmi tous les talents disponibles, sans répétition.

### Tirage avec exclusions
Exclure les talents déjà possédés par le personnage.

### Tirage avec contraintes
Exclure également :
- Talents avec prérequis non satisfaits (talents, caractéristiques)
- Talents non accessibles à la création

## Interface utilisateur

### Proposition + reroll
Afficher les N talents tirés avec possibilité de :
- Relancer un talent individuel
- Relancer tous les talents

### Sélection manuelle alternative
Permettre au joueur de choisir entre :
- Tirage aléatoire automatique
- Sélection manuelle parmi tous les talents

## Parsing de liste mixte
Une liste peut contenir :
- Talents fixes ("Destinée")
- Choix limités ("Perspicace ou Affable")
- Talents aléatoires ("3 Talent aléatoire")

Parser chaque élément selon son type.

## Validation
Vérifier que le nombre de talents aléatoires est raisonnable (1-5).

Erreurs possibles :
- Nombre < 1
- Nombre > 5 (valeur maximale autorisée)

## Tables concernées
- Species (talents)
- Certains CareerLevels (rare)

## Voir aussi
- [pattern-parsing.md](./pattern-parsing.md) - Parsing listes
- [pattern-parsing.md](./pattern-parsing.md) - Choix exclusifs
