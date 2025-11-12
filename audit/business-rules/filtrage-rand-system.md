# Système de Filtrage par Rand (Clé-Valeur)

## Vue d'ensemble

Le système de filtrage rand est un mécanisme générique permettant de déterminer l'accessibilité et la pondération d'entités selon des catégories dynamiques. Il utilise un objet clé-valeur où chaque clé représente une catégorie (espèce, région, etc.) et chaque valeur indique l'accessibilité ou la probabilité.

**Objectif métier** : Configuration flexible et granulaire de l'accessibilité des entités (carrières, sorts, etc.) selon critères multiples.

**Pattern technique** : Voir [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) pour système de tirage aléatoire complet.

## Structure de données

### Objet rand

Chaque entité possède un objet `rand` avec une propriété par catégorie :

```json
{
  "name": "Artisan",
  "rand": {
    "Humain": 3,
    "Nain": 8,
    "Middenheim": 4
  }
}
```

**Clés** : Identifiants de catégories (espèces, régions, etc.)
**Valeurs** : Nombre (1-100) ou chaîne vide ("")

## Mécanisme de correspondance

### Règles de base

**Règle 1 : Valeur numérique** → **ACCESSIBLE**
- `entité.rand[catégorie]` = nombre (1-100)
- L'entité est accessible pour cette catégorie
- Le nombre sert de seuil pour génération aléatoire

**Règle 2 : Chaîne vide** → **NON ACCESSIBLE**
- `entité.rand[catégorie]` = ""
- Exclusion intentionnelle (raisons narratives/culturelles)

**Règle 3 : Clé absente** → **NON ACCESSIBLE**
- `entité.rand[catégorie]` n'existe pas
- Par défaut, tout est interdit sauf si explicitement autorisé

### Exemples de correspondance

**Artisan (universel)** : `{"Humain": 3, "Nain": 8, "Elfe": 3}` → Toutes espèces accessibles, Nains favorisés

**Villageois (restreint)** : `{"Humain": 100, "Nain": 100, "Elfe": ""}` → Humains/Nains OK, Elfes interdits

**Sorcier village (exclusif)** : `{"Humain": 95}` → Uniquement Humains, autres clés absentes

## Utilisations du système

### Filtrage par accessibilité

**Algorithme** :
1. Pour chaque entité de la liste
2. Vérifier `entité.rand[catégorie]`
3. Si numérique → AFFICHER, sinon → MASQUER

**Exemple - Carrières Nains** :
- Artisan : `rand.Nain = 8` → AFFICHER
- Sorcier village : clé "Nain" absente → MASQUER

### Génération aléatoire pondérée

Les valeurs numériques servent de seuils pour génération aléatoire (voir [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md)).

**Principe** :
1. Filtrer entités accessibles (valeur numérique)
2. Tirer nombre aléatoire 1-100
3. Sélectionner première entité dont seuil >= tirage

**Exemple - Halfling (dé = 15)** :
- Agitateur : `rand.Halfling = 2` → 2 < 15, continuer
- Marchand : `rand.Halfling = 16` → 16 >= 15, SÉLECTIONNER

## Catégories multiples

### Ordre de priorité

Personnage avec espèce + région : catégorie spécifique remplace catégorie de base.

**Exemple - Humain Middenheim** : `rand.Humain = 25`, `rand.Middenheim = 30` → Utiliser seuil 30 (plus martial)

**Filtrage deux passes** :
1. Accessibilité : Vérifier `entité.rand[espèce]` numérique
2. Pondération : Utiliser `entité.rand[région]` si existe, sinon `entité.rand[espèce]`

## Validation

Voir [pattern-validation-references.md](../patterns/pattern-validation-references.md)

### Cohérence données

- Toute entité DOIT avoir ≥1 clé numérique
- Valeurs : nombres 1-100 ou "" uniquement
- Seuils croissants par index pour génération aléatoire

### Cohérence narrative

- Exclusions ("") justifiées culturellement
- Pondérations reflètent affinités culturelles
- Ex : Elfes pas Égoutiers (fierté), Nains favorisés artisanat

## Cas particuliers

**Entité universelle** : Toutes catégories numériques (ex : Artisan)
**Entité exclusive** : Une seule catégorie numérique (ex : Sorcier village)
**Entité semi-restreinte** : Certaines numériques, autres "" (ex : Mendiant)

### Mode libre (override)

**Fonctionnement** :
- MJ active mode libre → Ignore filtres rand
- Toutes entités accessibles
- Permet concepts uniques (Nain Sorcier, Elfe Mendiant)

### Catégorie custom

Pour nouvelle catégorie (ex : "Skaven") :
1. Définir identifiant unique
2. Ajouter clé dans `rand` des entités pertinentes
3. Numérique = accessible, "" = interdit, absent = interdit

## Applications

**Filtrage de carrières** :
- Par espèce : [filtrage-careers-espece.md](./filtrage-careers-espece.md)
- Par région : [filtrage-careers-region.md](./filtrage-careers-region.md)

**Génération aléatoire** :
- [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) - Système rand et seuils cumulatifs
- [ponderation-aleatoire-careers.md](./ponderation-aleatoire-careers.md) - Pondération carrières

## Références

- [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) - Système rand et seuils cumulatifs
- [pattern-validation-references.md](../patterns/pattern-validation-references.md) - Validation références
- [filtrage-careers-espece.md](./filtrage-careers-espece.md) - Application aux espèces
- [filtrage-careers-region.md](./filtrage-careers-region.md) - Application aux régions
