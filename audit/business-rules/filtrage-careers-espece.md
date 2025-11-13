# Filtrage des Carrières par Espèce

## Patterns techniques utilisés

- [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) - Système rand et clés espèces

## Vue d'ensemble

Le système de filtrage détermine quelles professions sont accessibles à chaque race jouable, reflétant affinités culturelles et restrictions sociales.

**Objectif métier** : Garantir que seules les carrières cohérentes avec l'identité d'une espèce soient proposées.

## Principes de base

### Mécanisme de correspondance

Voir [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) pour description complète du système de filtrage par clé-valeur.

**Application aux espèces** : Chaque espèce possède `refCareer` servant de clé d'identification dans l'objet `rand` des carrières.

**Exemples clés** : Humains = "Humain", Nains = "Nain", Halflings = "Halfling"

**Règles d'accessibilité** :
- `carrière.rand[espèce.refCareer]` = nombre → **ACCESSIBLE**
- `carrière.rand[espèce.refCareer]` = "" → **NON ACCESSIBLE**
- Clé absente → **NON ACCESSIBLE**

## Types de compatibilité

### Carrières universelles
**Artisan** : `"Humain": 3, "Halfling": 7, "Nain": 8, "Haut Elfe": 3, "Elfe Sylvain": 5, "Gnome": 3, "Ogre": 1`

Toutes espèces. Nains favorisés (artisanat traditionnel).

**Villageois** : `"Humain": 100, "Halfling": 100, "Nain": 100, "Gnome": 100, "Haut Elfe": "", "Elfe Sylvain": "", "Ogre": ""`

Races sédentaires uniquement. Elfes trop nobles, Ogres nomades.

### Carrières multi-espèces restreintes
**Agitateur** : `"Humain": 1, "Halfling": 2, "Nain": 2, "Gnome": 1, autres: ""`

Elfes trop distants de politique humaine. Ogres désintéressés.

**Mendiant** : `"Humain": 10, "Halfling": 20, "Nain": 21, "Gnome": 13, "Ogre": 3, Elfes: ""`

Elfes ne mendient jamais (honneur). Ogres rarissime.

### Carrières mono-espèce
**Sorcier de village** : `"Humain": 95, autres: ""`

Tradition magique humaine pré-Collèges. Autres espèces ont propres traditions.

### Carrières interdites (Chaos)
**Magus Tzeentch** : `Toutes: ""`

Narratif uniquement, campagnes Chaos spéciales.

## Processus de sélection

### 1. Identification espèce
Récupération `refCareer` de l'espèce choisie.

**Exemple** : Nain → `refCareer = "Nain"`

### 2. Filtrage liste
Pour chaque carrière :
- Vérifier `carrière.rand["Nain"]`
- Vide/absente → MASQUER
- Numérique → AFFICHER

### 3. Organisation par classe
Regroupement par classe sociale (Citadins, Guerriers, etc.).

**Nains** :
- **Citadins** : Artisan (8), Bourgeois (14), Enquêteur (16), Marchand (20), Milicien (24)
- **Guerriers** : Soldat, Mercenaire, Tueur de Trolls
- **Pas d'Agitateur** (rare pour Nains)

## Affinités culturelles

### Nains
**Favorisées** : Artisan (8), Guerrier, Ingénieur, Forgeron

**Rares** : Agitateur (2), professions artistiques

**Interdites** : Sorcier (magie arcanique taboue)

### Halflings
**Favorisées** : Artisan (7), Bourgeois (10), Marchand (16), Cuisinier, Voleur

**Rares** : Guerrier lourd (petite taille)

**Interdites** : Chevalier (pas tradition équestre lourde)

### Elfes (Hauts et Sylvains)
**Favorisées** : Artiste (14), Mage, Éclaireur (Sylvains)

**Rares** : Métiers manuels basiques

**Interdites** : Mendiant, Ratier, Égoutier (fierté)

### Humains
**Favorisées** : TOUTES carrières humaines

**Spécificité** : Seule espèce avec Sorcier de village

## Cas d'usage

### Création Nain
1. Sélection "Nain"
2. Filtrage `rand.Nain` numérique
3. Affiche : Artisan, Bourgeois, Guerrier, Forgeron, etc.
4. **MASQUE** : Agitateur (rare), Sorcier (interdit), Mendiant (rare)

### Génération aléatoire Halfling
Voir [ponderation-aleatoire-careers.md](./ponderation-aleatoire-careers.md) pour mécanisme complet.

1. Dés : 15
2. Parcours carrières Halfling
3. "Marchand" `rand.Halfling = 16`
4. 16 >= 15 → propose "Marchand"

### Mode libre
1. MJ active mode libre
2. TOUTES carrières accessibles, ignore `rand`
3. Permet choix narratifs (Nain Sorcier, Elfe Mendiant)
4. Campagnes Chaos ou concepts uniques

## Interactions systèmes

### Avec filtrage régional
Voir [filtrage-careers-region.md](./filtrage-careers-region.md)

Filtrage espèce **indépendant** du régional.

**Combiné** :
1. Filtrer `rand[espèce]` numérique
2. Filtrer `rand[région]` numérique
3. Intersection

### Avec Career Levels
Filtrage sur **carrière globale**, pas niveaux individuels.

**Règle** : Si carrière accessible, TOUS niveaux (I-IV) le sont.

### Avec génération aléatoire
Pondération **après** filtrage.

**Ordre** : Filtrage espèce → Application seuils aléatoires → Proposition joueur

## Validation

Voir [pattern-validation-references.md](../patterns/pattern-validation-references.md)

### Cohérence données
- Carrière DOIT avoir `rand` pour ≥1 espèce
- Universelle : ≥4-5 espèces numériques
- Exclusive : 1 espèce numérique, autres ""

### Cohérence narrative
- Interdictions justifiées culturellement/biologiquement
- Halflings : pas Chevaliers lourds (trop petits)
- Elfes : pas Égoutiers (fierté, odorat sensible)

### Vérification accès
Avant attribution :
1. Vérifier `carrière.rand[personnage.espèce.refCareer]` existe
2. Vérifier numérique (pas "")
3. Échec → bloquer ou erreur

## Cas particuliers

### Carrières "presque interdites"
**Sorcier de village (Humain: 95)** : Accessible mais rare (5% probabilité, range 95-100).

### Carrières sans espèce
`rand = {}` (vide) → INTERDITE toutes espèces.

### Espèces custom
Nouvelle espèce (ex: Skaven) :
1. Définir `refCareer = "Skaven"`
2. Ajouter "Skaven" dans `rand` carrières pertinentes
3. Seuils cohérents avec culture

## Références croisées

- [careers.md](../database/careers.md) - Table carrières
- [species.md](../database/species.md) - Table espèces
- [ponderation-aleatoire-careers.md](./ponderation-aleatoire-careers.md) - Génération aléatoire
- [filtrage-careers-region.md](./filtrage-careers-region.md) - Filtrage régional
