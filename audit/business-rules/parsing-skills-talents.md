# Parsing des Skills et Talents

## Patterns techniques utilisés

Cette règle métier combine les patterns suivants :

- [pattern-parsing.md](../patterns/pattern-parsing.md) - Séparation ", ", Choix exclusifs " ou ", Spécialisations, Quantités
- [pattern-specialisations.md](../patterns/pattern-specialisations.md) - "(Au choix)"
- [pattern-talent-aleatoire.md](../patterns/pattern-talent-aleatoire.md) - "X Talent aléatoire"

## Vue d'ensemble

**Objectif métier** : Convertir les chaînes `skills` et `talents` de Species en structures exploitables pour attribution aux personnages.

**Tables concernées** : Species, CareerLevels

## Exemples réels

**Humains (Reiklander)** :
- Skills: "Calme, Charme, Commandement, Corps à corps (Base), Langue (Bretonnien)"
- Talents: "Perspicace ou Affable, Destinée, 3 Talent aléatoire"

**Nains** :
- Skills: "Métier (Au choix), Langue (Khazalid), Résistance"
- Talents: "Costaud, Déterminé ou Obstiné, Lire/Écrire ou Impitoyable"

## Ordre de parsing

### 1. Séparation éléments distincts
Appliquer [pattern-parsing.md](../patterns/pattern-parsing.md) pour obtenir liste d'entrées.

### 2. Détection choix exclusifs
Pour chaque entrée, appliquer [pattern-parsing.md](../patterns/pattern-parsing.md).

**Résultat** : Entrée simple OU array de choix.

### 3. Extraction spécialisations
Appliquer [pattern-parsing.md](../patterns/pattern-parsing.md).

**Cas spéciaux** :
- "(Au choix)" → Voir [pattern-specialisations.md](../patterns/pattern-specialisations.md)
- "X Talent aléatoire" → Voir [pattern-talent-aleatoire.md](../patterns/pattern-talent-aleatoire.md)

### 4. Extraction quantités
Appliquer [pattern-parsing.md](../patterns/pattern-parsing.md) pour nombres préfixes.

## Cas d'usage métier

### Création personnage - Attribution raciale

**Processus** :
1. Parsing des chaînes skills/talents de l'espèce
2. Résolution choix exclusifs ("ou") → joueur sélectionne
3. Résolution "(Au choix)" → joueur choisit spécialisation
4. Génération aléatoires ("X Talent aléatoire") → tirage + proposition
5. Attribution finale au personnage

### Affichage lors sélection Species

**Affichage** : Liste compétences/talents avec indicateurs :
- Choix exclusifs en évidence
- "(Au choix)" clairement marqué
- Nombre talents aléatoires indiqué

**Exemple Nains** :
```
Compétences : Calme, Corps à corps (Base), Métier (Au choix), ...
Talents : Costaud, Déterminé OU Obstiné, Lire/Écrire OU Impitoyable, ...
```

## Règles spécifiques par type

### Skills
- Toujours liés à une caractéristique (table skills)
- Spécialisations fréquentes : Langue, Savoir, Métier, Corps à corps
- "(Au choix)" courant pour personnalisation

### Talents
- Peuvent avoir rangs multiples
- Certains débloquent autres talents/compétences
- "X Talent aléatoire" fréquent
- Choix exclusifs ("ou") très courants

## Parsing pour CareerLevels

**Mêmes règles** que Species pour skills/talents.

**Spécificité trappings** : Format "Nom (Quantité)" avec [pattern-parsing.md](../patterns/pattern-parsing.md)

**Exemples** :
- "Pamphlétaire (3)" = 3 exemplaires
- "Chiffon (1d10)" = nombre aléatoire
- "Marteau" = 1 implicite

**Quantités skills/talents par niveau** :
- Niveau 1 : 8-10 skills, 4 talents
- Niveau 2 : 6 skills, 4 talents
- Niveau 3 : 4 skills, 4 talents
- Niveau 4 : 2 skills, 4 talents

## Points d'attention

### Gestion des espaces
Espaces significatifs : " ou " (avec espaces) = opérateur, "ou" (sans) = partie du label.

### Liaison aux données complètes
Après parsing, lier chaque élément à tables skills/talents pour accès :
- Description complète
- Caractéristique associée (skills)
- Effets (talents)
- Tests possibles

### Combinaisons complexes
**Exemple Altdorfer Eastender** :
"Destinée, Doigts de fée ou Lire/Écrire, Ergoteur ou Fuite !, Perspicace ou Affable, Criminel ou Talent aléatoire"

**Résultat** : 5 entrées dont 4 choix exclusifs = grande variété personnages.

## Validation

**Vérifications** :
- Tous labels existent dans tables skills/talents
- Spécialisations valides ou "(Au choix)"
- Quantités cohérentes (≥1)
- Pas de doublons

**Erreurs possibles** :
- Label inconnu → bloquer
- Spécialisation invalide → bloquer
- Format incorrect → bloquer

## Références croisées

- [skills.md](../database/skills.md) - Table compétences
- [talents.md](../database/talents.md) - Table talents
- [species.md](../database/species.md) - Structure Species
- [careerLevels.md](../database/careerLevels.md) - Structure CareerLevels
