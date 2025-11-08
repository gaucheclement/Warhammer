# Advancement - Coût XP Sorts

## Contexte

Les sorts permettent aux personnages de lancer des incantations magiques. Le coût XP varie selon le type de magie et le nombre de sorts déjà appris.

Cette documentation décrit le calcul du coût XP pour apprendre de nouveaux sorts.

## Types de Magie

### Catégories de Sorts

**Béni (Miracles):** Sorts divins accordés par les dieux
**Magie mineure:** Petits sorts utilitaires (Arcane, Chaos, Divine)
**Magie des Arcanes:** Sorts des 8 domaines de couleur (Ghur, Azyr, Aqshy, etc.)
**Magie du Chaos:** Sorts corrompus et instables
**Invocation:** Sorts d'invocation de démons/créatures

## Formule de Coût XP

### Magie des Arcanes

**Formule:** Ceil(Nombre sorts appris / Bonus Intelligence) × 100 XP

Le coût augmente par **paliers** en fonction du Bonus d'Intelligence.

**Exemple avec Bonus Int = 4:**
- Sort 1-4: (1/4) = 0.25 → Ceil = 1 → **100 XP chacun**
- Sort 5-8: (5/4) = 1.25 → Ceil = 2 → **200 XP chacun**
- Sort 9-12: (9/4) = 2.25 → Ceil = 3 → **300 XP chacun**

**Logique:** Plus on apprend de sorts dans un domaine, plus c'est difficile d'en apprendre davantage.

### Invocation

**Formule:** (Nombre sorts - 1) × 100 XP

Le premier sort est **gratuit** (inclus dans le talent), les suivants coûtent 100 XP chacun.

**Exemple:**
- Sort 1: **0 XP** (gratuit avec talent Béni/Invocation)
- Sort 2: **100 XP**
- Sort 3: **200 XP**
- Sort 4: **300 XP**

### Béni (Miracles)

Identique à Invocation: premier sort gratuit, suivants 100 XP chacun.

### Magie mineure

**Coût:** Généralement **gratuit** ou inclus dans le talent Magie mineure.

Les sorts mineurs sont considérés comme des cantrips accessibles sans coût XP supplémentaire.

### Magie du Chaos

**Coût du talent:** 100 XP fixe (voir [cost-talents.md](./cost-talents.md))
**Coût des sorts:** Variable selon implémentation (V1 non documenté clairement)

## Exemples Concrets

### Exemple 1: Sorcier Ghur apprend sorts Arcanes (Int 35, Bonus = 3)

Domaine Ghur, Bonus Int = 3:
- Sorts 1-3: 100 XP chacun = **300 XP total**
- Sorts 4-6: 200 XP chacun = **600 XP total**
- **Total 6 sorts: 900 XP**

### Exemple 2: Prêtre de Sigmar apprend miracles (Béni)

Talent Béni acquis (100 XP):
- Miracle 1 (Bénédiction de Courage): **0 XP** (gratuit)
- Miracle 2 (Bénédiction de Résistance): **100 XP**
- Miracle 3 (Bénédiction de Bataille): **200 XP**
- **Total 3 miracles: 300 XP** (hors talent)

### Exemple 3: Démoniste apprend sorts Invocation

Talent Invocation acquis (100 XP):
- Sort 1 (Invoquer diablotin): **0 XP** (gratuit)
- Sort 2 (Invoquer furie): **100 XP**
- **Total 2 sorts: 100 XP** (hors talent)

## Règles Métier

### Pré-requis Talents

**Magie des Arcanes:** Nécessite talents **Sens de la magie** + **Magie des Arcanes (domaine)**
**Béni:** Nécessite talent **Béni** (lié à un dieu)
**Invocation:** Nécessite talent **Invocation**
**Magie mineure:** Nécessite talent **Magie mineure** (type)

### Spécialisations

**Magie des Arcanes:** Chaque domaine (Ghur, Azyr, etc.) compte séparément. Les sorts d'un domaine ne comptent pas pour un autre.
**Béni/Invocation:** Les sorts sont liés au dieu/domaine choisi (spécialisation du talent).

**Exemple:**
- Ghur: 6 sorts (900 XP)
- Azyr: 3 sorts (300 XP)
- **Total: 1200 XP** (deux domaines indépendants)

### Pendant la Création

**Restriction:** Aucun sort ne peut être appris pendant la phase Experience du wizard de création (budget XP ne permet pas).
**Exception:** Sorts offerts par talents (premier sort Béni/Invocation gratuit).

### En Post-Création

Tous les sorts accessibles selon talents acquis, pas de limite stricte (sauf Bonus Int pour Arcanes).

## Limites et Contraintes

### Limite Magie des Arcanes

Le nombre de sorts Arcanes d'un domaine est **théoriquement illimité**, mais le coût devient prohibitif:
- 40 sorts (Bonus Int = 4) → Sort 40 coûte **1000 XP**

### Limite Béni/Invocation

Nombre de sorts disponibles limité par la liste du dieu/domaine (voir [spells.md](../../database/spells.md)).

### Validation CN (Niveau de Chance)

Certains sorts ont un **CN** (Niveau de Chance) minimum requis pour être lancés. Ce n'est **pas une contrainte XP**, mais une contrainte de lancement.

## Validation

### Contraintes à Vérifier

1. **Talent prérequis acquis** (Sens de la magie, Magie des Arcanes, Béni, etc.)
2. **Domaine/Spécialisation choisi** (pour Arcanes, Béni, Invocation)
3. **Budget XP suffisant**
4. **Calcul correct** selon Bonus Int (Arcanes) ou nombre sorts (Invocation/Béni)
5. **Sort pas déjà appris** (pas de doublons)

### Messages d'Erreur (V2)

- "Talent Magie des Arcanes (Ghur) requis"
- "Sort déjà appris: Pattes d'araignée"
- "Budget XP insuffisant (200 XP nécessaires, 150 XP disponibles)"

## Relations

### Fichiers Liés

- [cost-talents.md](./cost-talents.md) - Coût talents magiques
- [experience-talents.md](../wizard/experience-talents.md) - Talents en création
- [xp-budget.md](./xp-budget.md) - Gestion budget XP

### Tables Database

- [spells.md](../../database/spells.md) - Structure 200+ sorts
- [magicks.md](../../database/magicks.md) - 16 domaines magiques
- [lores.md](../../database/lores.md) - Domaines de magie
- [talents.md](../../database/talents.md) - Talents magiques

### Business Rules

- [filtrage-spells-lore.md](../../business-rules/filtrage-spells-lore.md) - Filtrage sorts par domaine
