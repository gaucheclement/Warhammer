# Tests de Cohérence - Carrières

## Patterns techniques utilisés

- [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md) - Unicité index, Unicité labels
- [pattern-validation-references.md](../patterns/pattern-validation-references.md) - Cohérence références
- [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) - Validation rand
- [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md) - Validation HTML

## Vue d'ensemble

Tests de cohérence vérifient l'intégrité des données de carrières et leurs relations. Garantissent respect des règles métier.

**Objectif métier** : Détecter incohérences avant qu'elles affectent l'expérience joueur (carrières inaccessibles, seuils invalides, liens brisés).

## Tests de structure

### Unicité index
Voir [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md)

**Test** : Tous `index` uniques (0-116)

**Échec** : Deux carrières même index → Ambiguïté identification

### Unicité label
Voir [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md)

**Test** : Tous `label` uniques

**Échec** : Deux carrières même nom → Confusion joueur, erreurs filtrage

### Présence champs obligatoires
**Test** : Tous carrières ont `index`, `label`, `class`, `desc`, `book`, `page`, `rand`

**Échec** : Champ manquant → Erreur affichage

## Tests objet rand

Voir [pattern-generation-aleatoire.md](../patterns/pattern-generation-aleatoire.md) pour règles complètes.

### Structure complète
**Test** : Chaque `rand` contient exactement 10 clés (7 espèces + 3 régions)

**Échec** : Clé manquante → Filtrage incomplet

**Clés attendues** : Humain, Halfling, Nain, Haut Elfe, Elfe Sylvain, Gnome, Ogre, Middenheim, Middenland, Nordland

### Valeurs valides
**Test** : Chaque valeur `rand` soit numérique (1-100) soit chaîne vide ""

**Échec** : Valeur invalide (null, 0, -1, 101) → Erreur filtrage

### Seuils cohérents
**Test** : Pour chaque espèce/région, seuils croissants ou égaux entre carrières

**Échec** : Seuil décroissant → Génération aléatoire incohérente

### Couverture probabilités
**Test** : Pour chaque espèce, au moins une carrière a seuil proche 100

**Échec** : Dernière carrière seuil 50 → Tirages 51-100 ne sélectionnent rien

**Attendu** : Dernière carrière seuil ≥95

## Tests relations avec Species

Voir [pattern-validation-references.md](../patterns/pattern-validation-references.md)

### Clés espèces valides
**Test** : Toutes clés espèces dans `rand` correspondent à `species.refCareer` existants

**Échec** : Clé orpheline → Jamais utilisée

### Espèces ont carrières accessibles
**Test** : Pour chaque species, au moins 5 carrières accessibles (rand numérique)

**Échec** : Espèce avec 0-2 carrières → Génération personnage impossible

## Tests relations avec CareerLevels

Voir [relation-careers-careerlevels.md](./relation-careers-careerlevels.md)

### Existence 4 niveaux
**Test** : Pour chaque carrière, exactement 4 CareerLevels avec `career=label`

**Échec** : 3 ou 5 niveaux → Progression incohérente

### Séquence niveaux
**Test** : CareerLevels ont `careerLevel` = 1, 2, 3, 4 (sans trou)

**Échec** : Niveaux 1, 2, 4 (manque 3) → Progression bloquée

## Tests filtrage espèce

Voir [filtrage-careers-espece.md](./filtrage-careers-espece.md)

### Carrières universelles accessibles
**Test** : Carrières universelles (Artisan, Villageois) accessibles à ≥4 espèces

**Échec** : "Artisan" seulement Humains → Incohérent métier universel

### Carrières exclusives cohérentes
**Test** : Carrières mono-espèce (Sorcier de village) ont 1 seule espèce numérique, autres ""

**Échec** : "Sorcier de village" accessible Elfes → Incohérent lore

## Tests filtrage région

Voir [filtrage-careers-region.md](./filtrage-careers-region.md)

### Carrières régionales présentes
**Test** : Carrières maritimes (Batelier, Marin) ont `Nordland` numérique

**Échec** : Batelier `Nordland=""` → Incohérent géographie

### Carrières urbaines middenheim
**Test** : Carrières martiales (Soldat, Guerrier) ont `Middenheim` ≥ autres régions

**Échec** : Soldat `Middenheim=5` < `Nordland=20` → Incohérent culture ulricaine

## Tests descriptions

Voir [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md)

### Format HTML minimal
**Test** : `desc` contient uniquement balises autorisées

**Échec** : `<script>` ou `<iframe>` → Risque sécurité

### Longueur raisonnable
**Test** : `desc` entre 100 et 5000 caractères

**Échec** : <100 → Trop court, >5000 → Trop verbeux

### Présence pitch
Voir [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md)

**Test** : `desc` commence par `<i>` ou `<I>`

**Échec** : Pas de pitch → Incohérence format

## Tests intégrité classes

Voir [pattern-validation-references.md](../patterns/pattern-validation-references.md)

### Classe existe
**Test** : Chaque `class` correspond à classe existante dans `classes.json`

**Échec** : `class="Inexistant"` → Lien brisé

**Classes valides** : Citadins, Courtisans, Guerriers, Itinérants, Ruraux, Chaos

### Répartition classes
**Test** : Chaque classe a ≥5 carrières

**Échec** : Classe avec 1 carrière → Choix limité joueur

## Tests cas limites

### Carrières Chaos
**Test** : Carrières classe "Chaos" ont tous `rand` vides ("")

**Échec** : Carrière Chaos accessible aléatoirement → Incohérent narratif

### SubRand vide
**Test** : Tous `subRand` vides (fonctionnalité non implémentée)

**Échec** : `subRand` numérique → Fonctionnalité orpheline

### Livres sources valides
**Test** : Champs `book` et `page` renseignés

**Échec** : `book=""` ou `page=null` → Perte traçabilité

## Scénarios de test

### Test génération Nain
1. Filtrer carrières `rand.Nain` numérique
2. Vérifier ≥10 carrières trouvées
3. Tirer aléatoire 50 fois
4. Vérifier distribution cohérente avec seuils
5. Aucun tirage ne retourne carrière interdite

### Test progression Artisan
1. Vérifier "Artisan" existe
2. Vérifier 4 CareerLevels : "Apprenti Artisan", "Artisan", "Maître artisan", "Maître de guilde"
3. Vérifier séquence niveaux 1-4
4. Vérifier progression statut (Bronze → Argent → Or)

### Test cohérence régionale
1. Filtrer carrières `rand.Middenheim` numérique
2. Vérifier Soldat, Guerrier présents
3. Vérifier seuils Middenheim ≥ autres régions pour carrières martiales
4. Vérifier carrières maritimes absentes ou rares

## Recommandations

### Automatisation
Tests doivent être automatisés (script validation exécuté avant commit).

### Rapport erreurs
Chaque échec doit identifier carrière exacte et nature problème.

### Données référence
Maintenir jeu de données "gold standard" passant 100% tests.

## Références croisées

- [careers.md](../database/careers.md) - Table carrières
- [validation-donnees-careers.md](./validation-donnees-careers.md) - Règles validation
- [filtrage-careers-espece.md](./filtrage-careers-espece.md) - Filtrage espèce
- [filtrage-careers-region.md](./filtrage-careers-region.md) - Filtrage région
