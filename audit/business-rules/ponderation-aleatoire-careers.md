# Pondération Aléatoire des Carrières

## Patterns techniques utilisés

- [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) - Système rand 1-100, Algorithmes de tirage

## Vue d'ensemble

Le système de pondération détermine la probabilité qu'une carrière soit proposée lors de la génération aléatoire, reflétant fréquences des professions dans Warhammer.

**Objectif métier** : Génération aléatoire cohérente avec rareté/fréquence des professions, avec bonus XP pour encourager le hasard.

## Principes

Voir [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) pour fonctionnement objet `rand` et seuils cumulatifs.

### Seuils cumulatifs
**Important** : Non des pourcentages indépendants, mais **cumulatifs**. Plus bas seuil = apparaît tôt dans parcours.

## Mécanisme de génération

### Processus
Voir [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) pour algorithme détaillé.

**Étapes** :
1. **Filtrage** : Éliminer carrières non accessibles (espèce/région)
2. **Tirage** : Nombre aléatoire 1-100
3. **Parcours** : Carrières filtrées dans ordre fichier
4. **Sélection** : Première où `rand[critère] >= aléatoire`
5. **Proposition** : Offrir au joueur

### Exemple : Humain standard
**Carrières** : Agitateur (1), Artisan (3), Bourgeois (6), Enquêteur (7), Marchand (8), Mendiant (10), Milicien (11), Ratier (13)

**Probabilités réelles** (ranges entre seuils) :
- **Agitateur** (1) : [1-1] → 1%
- **Artisan** (3) : [2-3] → 2%
- **Bourgeois** (6) : [4-6] → 3%
- **Enquêteur** (7) : [7-7] → 1%

**Formule** : Probabilité = (Seuil_actuel - Seuil_précédent)

### Rareté
**Communes (1-20)** : Métiers urbains fréquents (Agitateur, Artisan, Bourgeois).

**Moyennes (20-50)** : Professions spécialisées.

**Rares (90-100)** : Sorcier de village (95), Villageois (100) → 5-10% max.

## Influence régionale

### Seuils différents
**Exemple Soldat** : `Humain=25, Middenheim=30, Middenland=25, Nordland=28`

**Application** :
- Humain Middenheim → seuil 30 (culture martiale ulricaine)
- Humain Nordland → seuil 28
- Humain sans région → seuil 25

**Règle** : Seuil le plus spécifique (région si définie, sinon espèce).

## Système multi-tirages

### Bonus XP
**Tirage 1** : 1 carrière générée. Accepter → **+50 XP**. Refuser → Tirage 2.

**Tirage 2** : 2 carrières supplémentaires (total 3). Choisir parmi 3 → **+25 XP**. Refuser → Tirage 3.

**Tirage 3** : Choix manuel parmi TOUTES carrières. **Aucun bonus**.

### Gestion doublons
Système stocke carrières proposées, évite doublons. Garantit 3 carrières distinctes si possible.

### Carrières même seuil
**Exemple** : Agitateur et Charlatan tous deux seuil 1.

**Comportement** :
- Trouve les DEUX
- Propose les deux au joueur
- Joueur choisit entre elles

**Raison** : Fréquence égale = chances égales.

## Cas d'usage

### Génération rapide
Accepter 1er tirage → +50 XP, gain de temps.

### Génération flexible
Refuser tirage 1, obtenir 3 choix au tirage 2 → +25 XP, compromis hasard/choix.

### Sélection manuelle
Refuser tirages, choisir parmi toutes carrières regroupées par classe → Aucun XP, contrôle total.

## Interactions

### Avec filtrage espèce
Filtrage **préalable** à pondération.

**Ordre** : Filtrer accessibles → Appliquer pondération → Proposer

**Exemple** : Elfe ne peut tirer "Mendiant" (filtré avant).

### Avec filtrage régional
Filtrage préalable + utilisation seuil régional.

**Ordre** : Filtrer espèce → Filtrer région → Pondération avec seuil régional

### Avec mode libre
Filtrage ET pondération **désactivés**. Toutes carrières affichées, choix manuel uniquement.

## Validation

Voir [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) pour règles de validation des seuils.

### Cohérence seuils
- Seuils **croissants ou égaux** (jamais décroissants)
- Permet parcours linéaire

### Couverture complète
Dernière carrière doit avoir seuil proche 100 pour capturer valeurs élevées.

**Invalide** : Dernière carrière seuil 50 → Tirages 51-100 ne sélectionnent rien.

### Seuils identiques valides
Plusieurs carrières même seuil = OK (fréquence égale).

## Cas particuliers

### Carrières seuil 100
**Villageois (100)** : Dernière, capte tirages très élevés. Probabilité = 100 - seuil_précédent.

### Carrières sans tirage
**Chaos (tous "")** : Filtrées avant pondération, jamais proposées aléatoirement.

### Espèces peu de carrières
**Elfes** : Peu accessibles, distribution concentrée. Probabilités individuelles plus élevées.

## Références croisées

- [careers.md](../database/careers.md) - Table carrières
- [filtrage-careers-espece.md](./filtrage-careers-espece.md) - Filtrage par espèce
- [filtrage-careers-region.md](./filtrage-careers-region.md) - Filtrage par région
