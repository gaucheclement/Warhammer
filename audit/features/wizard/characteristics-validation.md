# Wizard Characteristics - Validation cohérence

## Contexte

Le système valide les valeurs de caractéristiques saisies pour garantir leur conformité aux règles Warhammer. La validation diffère selon le mode (aléatoire ou manuel) et bloque la progression en cas d'erreur.

**Relations** : Voir [characteristics.md](../../database/characteristics.md) et [characteristics-manual-mode.md](./characteristics-manual-mode.md)

## Limites min/max par caractéristique

### Mode manuel

**Minimum** : 4 points par caractéristique
- Représente Base + 2 (équivalent jet minimum 2d10)
- Caractéristique très faible mais jouable
- Exemple : Ag 4 pour Nain (10 base - 6 malus théorique)

**Maximum** : 18 points par caractéristique
- Représente Base + 18 (équivalent jet quasi-maximum 2d10)
- Caractéristique exceptionnelle
- Exemple : CC 18 pour guerrier optimisé

**Contrôle** : Boutons +/- désactivés aux seuils

### Mode aléatoire

**Minimum naturel** : 2 (résultat 1+1 sur 2d10)
- Probabilité : 1%
- Très rare en pratique

**Maximum naturel** : 20 (résultat 10+10 sur 2d10)
- Probabilité : 1%
- Très rare en pratique

**Aucune limite artificielle** : Le hasard décide, toutes valeurs acceptées

## Validation formule espèce

### Base + 2d10 max

**Règle théorique** : Total ne peut dépasser Base + 20 (en mode aléatoire)

**Exemple Humain (base 20)** :
- Minimum possible : 20 + 2 = 22
- Maximum possible : 20 + 20 = 40

**Exemple Nain FM (base 40)** :
- Minimum possible : 40 + 2 = 42
- Maximum possible : 40 + 20 = 60

**Validation** : Le système vérifie que Jet ≤ 20 en mode aléatoire

### Mode manuel : Base + [4,18]

**Règle** : Total = Base + [4,18] en mode manuel

**Exemple Humain (base 20)** :
- Minimum autorisé : 20 + 4 = 24
- Maximum autorisé : 20 + 18 = 38

**Exemple Ogre I (base 0)** :
- Minimum autorisé : 0 + 4 = 4
- Maximum autorisé : 0 + 18 = 18

**Raison limites** : Éviter personnages trop déséquilibrés ou min/max extrême

## Détection valeurs aberrantes

### Seuils d'alerte

**Valeur trop basse** : Total < Base + 4
- Indique erreur de saisie ou bug
- Exemple : Humain CC = 22 (base 20, jet implicite 2)

**Valeur trop haute** : Total > Base + 20
- Indique triche ou corruption données
- Exemple : Humain CC = 45 (base 20, jet implicite 25 impossible)

### Détection automatique

**Calcul implicite du jet** : Jet = Total - Base

**Validation** :
- Si Jet < 2 → Erreur "Valeur trop faible"
- Si Jet > 20 (mode aléatoire) → Erreur "Valeur impossible"
- Si Jet < 4 ou > 18 (mode manuel) → Erreur "Hors limites autorisées"

**Exemple détection** :
- Humain CC Total = 50
- Base = 20 → Jet implicite = 30
- 30 > 20 → Alerte "Jet 2d10 ne peut dépasser 20"

## Messages d'erreur explicites

### Budget non dépensé (mode manuel)

**Message** : "Il vous reste X Points à allouer"

**Condition** : Somme des jets ≠ 100 en mode manuel

**Exemple** :
- Total alloué : 95 points
- Reste : 5 points
- Message : "Il vous reste 5 Points à allouer"
- Bouton Valider désactivé

### Valeur hors limites

**Message** : "[Caractéristique] doit être entre [Min] et [Max]"

**Condition** : Jet < 4 ou > 18 en mode manuel (impossible via UI mais vérifié)

**Exemple** :
- CC : Jet saisi = 3
- Message : "Capacité de Combat doit être entre 4 et 18"

### Valeur aberrante détectée

**Message** : "[Caractéristique] a une valeur invalide ([Valeur])"

**Condition** : Détection manipulation ou corruption

**Exemple** :
- CC Total = 50 (base 20, jet implicite 30)
- Message : "Capacité de Combat a une valeur invalide (50). Maximum autorisé : 40"

### Budget augmentations carrière

**Message** : "Vous devez allouer exactement 5 augmentations"

**Condition** : Somme augmentations ≠ 5

**Exemple** :
- CT +3, Int +1, Soc +0 = 4 total
- Message : "Vous devez allouer exactement 5 augmentations. Actuellement : 4"

## Blocage passage step suivant

### Conditions de blocage

**Bouton Valider désactivé** si :
1. Mode manuel ET budget ≠ 100
2. Augmentations carrière ≠ 5
3. Mode aléatoire ET randomState = 0 (pas encore généré)
4. Valeur hors limites détectée

**État du bouton** : `disabled="true"` + opacité réduite

### Déblocage

**Mode manuel** : Allocation exacte des 100 points

**Augmentations carrière** : Allocation exacte des 5 points

**Mode aléatoire** : Génération effectuée et validée

**Corrections** : Ajustement des valeurs dans les limites

### Indicateur visuel

**Compteur temps réel** :
- "100 Points à allouer" → "87 Points à allouer" → ... → "0 Points à allouer"
- Couleur rouge si ≠ 0, verte si = 0

**Bouton Valider** :
- Grisé si conditions non remplies
- Actif (vert) si toutes validations passent

## Exemples de cas invalides

**Budget incomplet (manuel)** : Total alloué 86/100 → "Il vous reste 14 Points à allouer" → Valider désactivé

**Valeur hors limites (manuel)** : CC = 3 via DOM → CC < 4 → "CC doit être au minimum 4" → Réinitialisation à 4

**Augmentations incomplètes** : CT+2, Int+2, Soc+0 = 4/5 → "Vous devez allouer 5 augmentations. Actuellement : 4" → Bloqué

**Augmentations dépassées** : CT+5, Int+1, Soc+1 = 7 → Impossible (boutons + désactivés à 5)

**Génération non effectuée (aléatoire)** : randomState = 0 → Bouton Lancer clignote → Valider désactivé

**Valeur corrompue** : CC = 999 → 999 > 40 (base 20 + max 20) → "Données corrompues" → Reset activé

## Voir aussi

- [characteristics-manual-mode.md](./characteristics-manual-mode.md) - Modes de saisie
- [characteristics-totals.md](./characteristics-totals.md) - Calculs des totaux
- [characteristics-base.md](./characteristics-base.md) - Valeurs de base
