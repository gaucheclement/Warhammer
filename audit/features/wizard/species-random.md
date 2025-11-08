# Wizard Species - Génération Aléatoire Pondérée

## Vue d'ensemble

**Objectif** : Générer aléatoirement espèce en respectant probabilités Warhammer (Humains 90%, Nains 7%, Elfes 3%).

**Mécanisme** : Seuils cumulatifs via `species.rand` (voir [pattern-generation-aleatoire.md]).

**Bonus** : +20 XP si acceptation premier résultat.

## Algorithme de sélection

### Principe seuils cumulatifs

**Format `rand`** : Valeur 1-100 = seuil maximal (NON pourcentage direct).

**Sélection** :
1. Tirer R entre 1-100
2. Parcourir species dans ordre fichier
3. Sélectionner première où `rand >= R`

**Exemples** :

| Tirage | Seuil | Espèce | Probabilité |
|--------|-------|--------|-------------|
| 1-90 | 90 | Humain | 90% |
| 91-97 | 97 | Nain | 7% |
| 98-99 | 99 | Haut Elfe | 2% |
| 100 | 100 | Elfe Sylvain | 1% |

## Tables de probabilité

### Distribution standard

**Humains** (90%) : 13 variantes (Reiklander, Middenheim, Nordland...)

**Nains** (7%) : 5 variantes (Standard, Altdorfer, Norse, Clans)

**Hauts Elfes** (2%) : 1 variante (Asur)

**Elfes Sylvains** (1%) : 2 variantes (Asrai, Éonirs)

**Halflings** : Inclus dans 91-100 selon config, 12 variantes

**Gnomes/Ogres** : Très rares, 1 variante chacun

### Par contexte

**Empire classique** : Humains 90%, Nains 7%, Elfes 2%, Halflings 1%

**Old World** : Ajout Gnomes/Ogres dans 98-100

**Reikland seul** : Humains 95%, autres 5%

## Gestion variantes (même rand)

### Problème

Plusieurs species partagent même `rand` (ex: 13 variantes Humain = 90).

### Solution

**Étape 1 - Collecte** :
1. Trouver première species où `rand >= tirage`
2. Stocker target = `species.rand`
3. Continuer tant que `species.rand == target`
4. Collecter IDs dans `imposedSpecie[]`

**Étape 2 - Proposition** :
- 1 variante → sélection automatique
- Plusieurs → joueur choisit parmi activées

**Exemple tirage 50** :
- 50 <= 90 → Humains
- Collecte 13 variantes Humain
- Affichage 13 choix, joueur sélectionne

## Sous-espèce aléatoire

**Système** : Si `species.subRand` existe, second tirage 1-100 pour sous-espèce.

**Exemple** : Halflings → village Moot spécifique.

**Statut** : Préparé mais non implémenté (voir [pattern-subrand.md]).

## Bonus XP (+20 XP)

### Règle

**Condition** : Acceptation PREMIER résultat sans relance ni choix manuel.

**Montant** : +20 XP label "Race Aléatoire"

**Raison** : Récompenser acceptation du destin (philosophie Warhammer).

### Mécanisme

**États randomState.specie** :
- `0` : Initial
- `1` : Tirage accepté → +20 XP
- `-1` : Choix manuel → pas de bonus
- `-2` : Finalisé

**Workflow** :
1. Clic "Lancer" → `randomState.specie = 1`
2. Tirage + animation
3. `saveAction()` vérifie état = 1
4. Si oui : `addXP('Race Aléatoire', 20)`
5. Marquer état = -2

**Exclusions** :
- Clic "Choisir" avant "Lancer"
- Relance tirage
- Mode Free

## Animation visuelle

**Avant** : Bouton "Lancer" activé (classe `clickMe`), liste désactivée

**Pendant** (Helper.dice ~1s) :
1. Range en jaune
2. Animation compteur 0 → résultat
3. Callback chaque étape

**Résultat** :
1. Species activée(s)
2. Animation fond orange → noir (500ms + 300ms + 500ms)
3. Retour normal après 1.5s

**Après** : Boutons désactivés, seules variantes imposées cliquables

## Modes génération

### Standard
- Boutons "Lancer" et "Choisir" visibles
- Tirage optionnel avec bonus XP
- Choix manuel sans bonus

### Mode Free
- `isFreeMode() == true`
- Boutons masqués
- Sélection directe
- Pas de bonus XP

## Exemples concrets

### Scénario 1 - Acceptation
1. Clic "Lancer" → Tirage 45 → Humains (90)
2. 13 variantes proposées
3. Choix "Reiklander"
4. Validation : +20 XP
5. État -2

### Scénario 2 - Manuel
1. Clic "Choisir" → État -1
2. Toutes activées
3. Choix "Nains"
4. Validation : Pas bonus
5. État -2

### Scénario 3 - Rare
1. Clic "Lancer" → Tirage 98 → Hauts Elfes (99)
2. 1 variante → auto-sélection
3. Validation auto : +20 XP
4. Passage étape suivante

## Validation

### Algorithme
- Ranges 1-100 sans trous
- `rand` croissant (90, 97, 99, 100)
- Somme = 100%

### Données
- `rand` numérique 1-100
- Pas doublons espèces distinctes
- Variantes même `refDetail` pour même `rand`

## Relations tables

| Table | Champ | Usage |
|-------|-------|-------|
| Species | rand | Seuil probabilité |
| Species | refDetail | Groupement variantes |
| Species | subRand | Sous-espèces (préparé) |

## Voir aussi

- [species.md](../../database/species.md) - Champ rand
- [species-selection.md](./species-selection.md) - Interface
- [pattern-generation-aleatoire.md](../../patterns/pattern-generation-aleatoire.md) - Système rand
- [pattern-subrand.md](../../patterns/pattern-subrand.md) - Sous-catégories
