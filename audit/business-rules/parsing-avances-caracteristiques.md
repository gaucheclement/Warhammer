# Parsing des Avances de Caractéristiques (CareerLevels)

## Patterns techniques utilisés

- [pattern-parsing.md](../patterns/pattern-parsing.md) - Séparation ", "

## Vue d'ensemble

Les avances de caractéristiques dans careerLevels sont stockées sous forme de chaîne contenant les noms des caractéristiques à améliorer.

**Valeur implicite** : Chaque caractéristique listée = +5 points.

## Format de données

### Structure
```
"characteristics": "Nom1, Nom2, Nom3"
```

Voir [pattern-parsing.md](../patterns/pattern-parsing.md) pour règles de parsing.

**Règles** :
- Noms séparés par virgules
- Aucune valeur numérique explicite
- +5 implicite pour chaque nom
- Espaces ignorés

### Exemples
**Niveau 1 (3 caractéristiques)** :
```
"characteristics": "Capacité de Tir, Intelligence, Sociabilité"
"characteristics": "Force, Endurance, Dextérité"
```

**Niveau 2+ (1 caractéristique)** :
```
"characteristics": "Agilité"
"characteristics": "Force Mentale"
```

## Noms des caractéristiques

| Nom complet | Description |
|-------------|-------------|
| Capacité de Combat | Habileté au corps-à-corps |
| Capacité de Tir | Habileté à distance |
| Force | Puissance physique |
| Endurance | Résistance physique |
| Initiative | Rapidité de réaction |
| Agilité | Dextérité et coordination |
| Dextérité | Habileté manuelle |
| Intelligence | Capacité intellectuelle |
| Force Mentale | Volonté et résistance mentale |
| Sociabilité | Charisme et relations sociales |

**IMPORTANT** : Toujours nom complet, jamais abréviations (pas "CC", "CT", "FM").

## Parsing

### Ordre
1. Split sur ", " (voir [pattern-parsing.md](../patterns/pattern-parsing.md))
2. Trim espaces
3. Mapping vers objets characteristics
4. Validation existence

### Valeur implicite (+5)
**Exemple Artisan niveau 1** :
```
"characteristics": "Force, Endurance, Dextérité"
→ Force +5, Endurance +5, Dextérité +5 = 15 points
```

**Exemple Artisan niveau 2** :
```
"characteristics": "Sociabilité"
→ Sociabilité +5 = 5 points
```

## Accumulation

Les avances s'accumulent de niveau en niveau.

**Artisan - Progression complète** :
- Niveau 1 : Force +5, Endurance +5, Dextérité +5 = 15 points
- Niveau 2 : + Sociabilité +5 = 20 points cumulés
- Niveau 3 : + Force Mentale +5 = 25 points cumulés
- Niveau 4 : + Intelligence +5 = 30 points cumulés

**Résultat final** : 6 caractéristiques améliorées, 30 points (6 × 5).

**Répétition** : Si une caractéristique apparaît à plusieurs niveaux, valeurs s'additionnent (rare).

## Exemples par niveau

**Niveau 1 (3 caractéristiques)** :
- Agitateur : "Capacité de Tir, Intelligence, Sociabilité" → 15 points
- Bourgeois : "Agilité, Intelligence, Sociabilité" → 15 points
- Enquêteur : "Initiative, Agilité, Intelligence" → 15 points

**Niveaux 2-4 (1 caractéristique)** :
- Agitateur niveau 2 : "Agilité" → 5 points
- Artisan niveau 3 : "Force Mentale" → 5 points
- Bourgeois niveau 4 : "Force Mentale" → 5 points

## Validation

### Contraintes
**Niveau 1** : Exactement 3 noms valides séparés par virgules.

**Niveaux 2-4** : Exactement 1 nom valide.

### Erreurs
**Nom invalide** :
```
"characteristics": "Force, Machin, Dextérité"
→ ERREUR: "Machin" n'existe pas
```

**Mauvais nombre (niveau 1)** :
```
"characteristics": "Force, Endurance"
→ ERREUR: Niveau 1 requiert 3 caractéristiques
```

**Mauvais nombre (niveau 2+)** :
```
"characteristics": "Force, Endurance"
→ ERREUR: Niveaux 2-4 requièrent 1 caractéristique
```

## Relation avec XP

**En carrière (coût normal)** :
- Amélioration des characteristics du niveau actuel
- Coût XP = formule standard

**Hors carrière (coût × 2)** :
- Amélioration d'autres characteristics
- Coût XP = formule standard × 2

**Exemple** :
- Pamphlétaire niveau 1 peut améliorer Capacité de Tir, Intelligence, Sociabilité au coût 1×
- Toutes les autres characteristics au coût 2×

## Exemples de progression

### Création personnage (Pamphlétaire niveau 1)
**Characteristics disponibles** : Capacité de Tir, Intelligence, Sociabilité

**Amélioration possible** :
- CT : 20 → 25 (coût XP normal)
- Int : 20 → 30 (coût XP normal)
- Force : 20 → 25 (coût XP × 2, hors carrière)

### Post-création (Artisan niveau 2)
**En carrière** : Sociabilité (niveau 2) + Force, Endurance, Dextérité (niveau 1)

**Hors carrière** : Capacité de Combat, Capacité de Tir, Initiative, Agilité, Intelligence, Force Mentale

**Choix** :
- Améliorer Sociabilité (coût 1×)
- Améliorer Force Mentale (coût 2×)

## Références croisées

- [characteristics.md](../database/characteristics.md) - Table des caractéristiques
- [careerLevels.md](../database/careerLevels.md) - Structure careerLevels
- [accumulation-avantages-careerlevels.md](./accumulation-avantages-careerlevels.md) - Cumul des avances
- [calculs-xp-progression.md](./calculs-xp-progression.md) - Coûts XP
- [progression-careerlevels.md](./progression-careerlevels.md) - Système de progression
