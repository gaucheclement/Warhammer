# Parsing des Données du Wizard

## Vue d'ensemble

Ce document décrit les règles de parsing pour les données du wizard de création et des careerLevels :
- **Avances de caractéristiques** (careerLevels.characteristics)
- **Skills et talents** (species/careerLevels)

Données stockées sous forme de chaînes textuelles parsées pour attribution aux personnages.

## Patterns techniques utilisés

- [pattern-parsing.md](../patterns/pattern-parsing.md) - Séparation ", ", Choix " ou ", Spécialisations, Quantités
- [pattern-specialisations.md](../patterns/pattern-specialisations.md) - "(Au choix)"
- [pattern-talent-aleatoire.md](../patterns/pattern-talent-aleatoire.md) - "X Talent aléatoire"

---

# PARTIE 1 : Avances de Caractéristiques

## Format de données

```
"characteristics": "Nom1, Nom2, Nom3"
```

**Règles** :
- Noms séparés par virgules (voir [pattern-parsing.md](../patterns/pattern-parsing.md))
- **Niveau 1 (création)** : Liste les 3 caractéristiques disponibles pour distribution 5 points
- **Niveaux 2-4 (progression)** : Liste la caractéristique supplémentaire accessible "en carrière" (coût XP normal)
- Espaces ignorés

**Exemples** :
```
Niveau 1 (création) : "Capacité de Tir, Intelligence, Sociabilité" → 3 listées, joueur distribue 5 points
Niveau 2 (progression) : "Agilité" → 1 listée, achat XP coût normal (pas ×2)
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

**Ordre** :
1. Split sur ", "
2. Trim espaces
3. Mapping vers objets characteristics
4. Validation existence

**Signification par contexte** :
```
Création (wizard) : "Force, Endurance, Dextérité" → 3 caractéristiques disponibles, 5 points distribués
Progression (XP) : "Sociabilité" → 1 caractéristique accessible "en carrière"
```

## Accumulation

Les caractéristiques "en carrière" s'accumulent de niveau en niveau.

**Artisan - Progression complète** :
- Niveau 1 : Dex, F, Soc accessibles "en carrière"
- Niveau 2 : + Int accessible "en carrière" → 4 caractéristiques "en carrière"
- Niveau 3 : + FM accessible "en carrière" → 5 caractéristiques "en carrière"
- Niveau 4 : + E accessible "en carrière" → 6 caractéristiques "en carrière"

**Résultat** : 6 caractéristiques achetables coût XP normal (au lieu de ×2).

**Répétition** : Si caractéristique apparaît à plusieurs niveaux, reste accessible (pas de doublon).

## Validation

**Contraintes** :
- Niveau 1 : Exactement 3 noms valides
- Niveaux 2-4 : Exactement 1 nom valide

**Erreurs** :
```
"Force, Machin, Dextérité" → ERREUR: "Machin" n'existe pas
"Force, Endurance" (niveau 1) → ERREUR: Niveau 1 requiert 3 caractéristiques
"Force, Endurance" (niveau 2+) → ERREUR: Niveaux 2-4 requièrent 1 caractéristique
```

---

# PARTIE 2 : Skills et Talents

## Exemples réels

**Humains (Reiklander)** :
- Skills: "Calme, Charme, Commandement, Corps à corps (Base), Langue (Bretonnien)"
- Talents: "Perspicace ou Affable, Destinée, 3 Talent aléatoire"

**Nains** :
- Skills: "Métier (Au choix), Langue (Khazalid), Résistance"
- Talents: "Costaud, Déterminé ou Obstiné, Lire/Écrire ou Impitoyable"

## Ordre de parsing

1. **Séparation éléments** : Appliquer [pattern-parsing.md](../patterns/pattern-parsing.md)
2. **Détection choix exclusifs** : " ou " → array de choix
3. **Extraction spécialisations** : Voir [pattern-parsing.md](../patterns/pattern-parsing.md)
   - "(Au choix)" → [pattern-specialisations.md](../patterns/pattern-specialisations.md)
   - "X Talent aléatoire" → [pattern-talent-aleatoire.md](../patterns/pattern-talent-aleatoire.md)
4. **Extraction quantités** : Nombres préfixes

## Cas d'usage métier

### Création personnage - Attribution raciale

1. Parsing des chaînes skills/talents de l'espèce
2. Résolution choix exclusifs ("ou") → joueur sélectionne
3. Résolution "(Au choix)" → joueur choisit spécialisation
4. Génération aléatoires ("X Talent aléatoire") → tirage + proposition
5. Attribution finale au personnage

### Affichage lors sélection Species

Liste compétences/talents avec indicateurs :
- Choix exclusifs en évidence
- "(Au choix)" clairement marqué
- Nombre talents aléatoires indiqué

**Exemple Nains** :
```
Compétences : Calme, Corps à corps (Base), Métier (Au choix), ...
Talents : Costaud, Déterminé ou Obstiné, Lire/Écrire ou Impitoyable, ...
```

## Règles spécifiques

### Skills
- Toujours liés à une caractéristique (table skills)
- Spécialisations fréquentes : Langue, Savoir, Métier, Corps à corps
- "(Au choix)" courant pour personnalisation

### Talents
- Peuvent avoir rangs multiples
- Certains débloquent autres talents/compétences
- "X Talent aléatoire" fréquent
- Choix exclusifs ("ou") très courants

## Points d'attention

### Gestion des espaces
Espaces significatifs : " ou " (avec espaces) = opérateur, "ou" (sans) = partie du label.

### Liaison aux données complètes
Après parsing, lier éléments à tables skills/talents pour accès description, caractéristique, effets, tests.

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

**Erreurs** : Label inconnu, spécialisation invalide, format incorrect → bloquer

---

# Références croisées

- [characteristics.md](../database/characteristics.md) - Table des caractéristiques
- [skills.md](../database/skills.md) - Table compétences
- [talents.md](../database/talents.md) - Table talents
- [species.md](../database/species.md) - Structure Species
- [careerLevels.md](../database/careerLevels.md) - Structure CareerLevels
- [accumulation-avantages-careerlevels.md](./accumulation-avantages-careerlevels.md) - Cumul avances
- [progression-careerlevels.md](./progression-careerlevels.md) - Système de progression
