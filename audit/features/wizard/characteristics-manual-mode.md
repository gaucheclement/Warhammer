# Wizard Characteristics - Mode saisie manuelle vs aléatoire

## Contexte

Le wizard offre deux modes de détermination des caractéristiques : génération aléatoire (avec bonus XP) ou saisie manuelle (contrôle total, sans bonus). Le joueur choisit sa méthode préférée.

**Relations** : Voir [characteristics.md](../../database/characteristics.md) et [characteristics-roll.md](./characteristics-roll.md)

## Toggle entre modes

### Boutons de sélection

**Bouton "Lancer"** : Active le mode aléatoire
- Génère 10 jets de 2d10
- Offre bonus XP (+50 ou +25)
- Permet relances

**Bouton "Choisir"** : Active le mode manuel
- Désactive génération aléatoire
- Initialise toutes caractéristiques à 4
- Donne 100 points à répartir
- Aucun bonus XP

### Changement de mode

**Irréversibilité** : Une fois "Choisir" activé, impossible de revenir au mode aléatoire

**État du système** : `randomState.characteristic = -1` indique mode manuel actif

**Raison** : Éviter l'abus (générer aléatoire, garder si bon, sinon passer manuel)

## Mode aléatoire

### Processus

1. Clic sur "Lancer" génère 10 jets 2d10
2. Résultats affichés avec animation
3. Options après génération :
   - Accepter tel quel : +50 XP
   - Réassigner (permuter) : +25 XP
   - Relancer : 0 XP

### Réassignation

**Flèches haut/bas** : Permutent les valeurs entre caractéristiques adjacentes

**Exemple** :
- Avant : CC=12, CT=8
- Après permutation : CC=8, CT=12

**Bonus XP** : +25 XP si validation sans relance après réassignation

### États aléatoires

**État 0** : Initial, bouton "Lancer" actif
**État 1** : Première génération acceptée sans modification (+50 XP)
**État 2** : Réassignation effectuée (+25 XP si validé)
**État 3** : Relance effectuée (bonus perdu, peut encore relancer)

## Mode manuel

### Activation

**Clic "Choisir"** :
1. Toutes caractéristiques initialisées à 4
2. Boutons +/- activés
3. Compteur "100 Points à allouer" affiché
4. Boutons "Lancer" et "Choisir" désactivés

### Saisie valeur par valeur

**Contrôles** :
- Bouton + : Augmente la caractéristique de 1
- Bouton - : Diminue la caractéristique de 1
- Points disponibles décomptés en temps réel

**Interface** :
```
CC [−] 4 [+]
CT [−] 4 [+]
...
100 Points à allouer
```

**Exemple de saisie** :
1. CC : 4 → +10 → 14 (reste 90 points)
2. CT : 4 → +8 → 12 (reste 82 points)
3. F : 4 → +12 → 16 (reste 70 points)
...

### Budget de points

**Total disponible** : 100 points exactement

**Calcul** : Somme des valeurs saisies doit égaler 100 + (10 × 4) = 140
- 10 caractéristiques × 4 (valeur initiale) = 40
- 100 points à distribuer
- Total : 140

**Validation** : Impossible de valider si points restants ≠ 0

## Validation des valeurs saisies

### Limites min/max par caractéristique

**Minimum** : 4 points par caractéristique (en mode manuel)
- Équivaut à Base + 2 (jet minimum 2d10)
- Représente caractéristique très faible

**Maximum** : 18 points par caractéristique (en mode manuel)
- Équivaut à Base + 18 (jet quasi-maximum 2d10)
- Représente caractéristique exceptionnelle

**Mode aléatoire** : Min 2, Max 20 (limites naturelles 2d10)

### Contrôles temps réel

**Bouton -** :
- Désactivé si valeur = 4 (minimum atteint)
- Désactivé si aucun point alloué à cette caractéristique

**Bouton +** :
- Désactivé si valeur = 18 (maximum atteint)
- Désactivé si points restants = 0 (budget épuisé)

**Affichage total** : Mise à jour instantanée lors de chaque modification

### Messages d'erreur

**Budget non dépensé** : "Il vous reste X Points à allouer" (validation bloquée)

**Budget dépassé** : Impossible (boutons + désactivés automatiquement)

**Valeur hors limites** : Impossible (boutons -/+ bloquent aux seuils)

## Exemples d'utilisation

### Joueur vétéran (mode manuel)

**Objectif** : Créer guerrier Nain optimisé

**Répartition** : CC 18, E 18, FM 16, F 16, CT 12, I 10, Int 8, Dex 8, Ag 4, Soc 4

**Résultat final Nain** : CC 48 (30+18), E 48 (30+18), FM 56 (40+16)

### Joueur débutant (mode aléatoire)

**Action** : Clic "Lancer" → Résultats affichés → Accepte tel quel → +50 XP

**Avantage** : Rapide, bonus XP, personnage équilibré naturellement

### Test rapide PNJ

**Action** : "Lancer" → "Valider" immédiat (+50 XP) → Étape suivante

**Durée** : < 5 secondes

## Comparaison des modes

### Mode aléatoire

**Avantages** :
- Bonus XP (+50 ou +25)
- Rapide
- Fidèle à l'esprit du jeu de rôle (hasard)

**Inconvénients** :
- Pas de contrôle total
- Peut donner personnage déséquilibré

### Mode manuel

**Avantages** :
- Contrôle total
- Optimisation possible
- Prévisibilité

**Inconvénients** :
- Aucun bonus XP
- Plus long
- Tentation min/max

## Voir aussi

- [characteristics-roll.md](./characteristics-roll.md) - Détails du mode aléatoire
- [characteristics-validation.md](./characteristics-validation.md) - Règles de validation
- [characteristics-base.md](./characteristics-base.md) - Valeurs de base
