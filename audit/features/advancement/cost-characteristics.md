# Advancement - Coût XP Caractéristiques

## Contexte

Après la création du personnage, les joueurs peuvent dépenser des Points d'Expérience (XP) pour améliorer leurs caractéristiques. Le coût XP augmente progressivement avec le niveau actuel de la caractéristique.

Cette documentation décrit le calcul du coût XP pour acheter des avances de caractéristiques, que ce soit pendant la phase de création (budget XP initial) ou en post-création (aventures).

## Formule de Coût

### Coût par Palier

Le coût XP pour augmenter une caractéristique de +1 dépend du palier actuel (rang/avance actuel):

| Palier (Avance) | Coût XP par +1 | Cumul XP |
|-----------------|----------------|----------|
| 1-5             | 25 XP          | 125 XP   |
| 6-10            | 30 XP          | 275 XP   |
| 11-15           | 40 XP          | 475 XP   |
| 16-20           | 50 XP          | 725 XP   |
| 21-25           | 70 XP          | 1075 XP  |
| 26-30           | 90 XP          | 1525 XP  |
| 31-35           | 120 XP         | 2125 XP  |
| 36-40           | 150 XP         | 2875 XP  |
| 41-45           | 190 XP         | 3825 XP  |
| 46-50           | 230 XP         | 4975 XP  |
| 51-55           | 280 XP         | 6375 XP  |
| 56-60           | 330 XP         | 8025 XP  |
| 61-65           | 390 XP         | 9975 XP  |
| 66-70           | 450 XP         | 12225 XP |

### Logique de Calcul

Le coût XP est calculé par **tranche de 5 avances**. Plus la caractéristique est élevée, plus il coûte cher de l'augmenter davantage.

**Formule générale:**
- Avance 1-5: 25 XP chacune
- Avance 6-10: 30 XP chacune
- Avance 11-15: 40 XP chacune
- etc.

Le coût est **cumulatif** : pour passer de 0 à +10, il faut dépenser (5 × 25) + (5 × 30) = 275 XP.

## Exemples Concrets

### Exemple 1: Agitateur Humain améliore sa Sociabilité

**Situation initiale:**
- Sociabilité (Soc) base: 30
- Avances espèce: +5
- Avances carrière: +10
- **Total actuel: 45**
- **Avances achetées: 0**

**Achats XP:**
1. Première avance (+1): Palier 1-5 → **25 XP** (Total: 46)
2. Deuxième avance (+2): Palier 1-5 → **25 XP** (Total: 47)
3. Cinquième avance (+5): Palier 1-5 → **25 XP** (Total: 50)
4. Sixième avance (+6): Palier 6-10 → **30 XP** (Total: 51)

**Coût total pour +6 avances: 155 XP**

### Exemple 2: Nain Répurgateur améliore son Endurance

**Situation initiale:**
- Endurance (End) base: 35
- Avances espèce: +10
- Avances carrière: +5
- **Total actuel: 50**
- **Avances achetées: 0**

**Achats XP:**
1. Avance +1: Palier 1-5 → **25 XP** (Total: 51)
2. Avance +10: Palier 6-10 → **30 XP** (Total: 60)
3. Avance +15: Palier 11-15 → **40 XP** (Total: 65)

**Coût total pour +15 avances: 575 XP**
- (5 × 25) + (5 × 30) + (5 × 40) = 125 + 150 + 200 = 475 XP (erreur dans l'exemple précédent)

### Exemple 3: Elfe Érudit améliore son Intelligence

**Situation initiale:**
- Intelligence (Int) base: 30
- Avances espèce: +10
- Avances carrière: +15
- **Total actuel: 55**
- **Avances achetées: 0**

**Achats XP:**
1. Passer de 55 à 56 (+1): Palier 1-5 → **25 XP**
2. Passer de 56 à 60 (+5): Palier 1-5 → 4 × 25 = **100 XP**

**Coût total pour +5 avances: 125 XP**

## Règles Métier

### Pendant la Création (Mode Creation)

**Restrictions:**
- Les joueurs ne peuvent améliorer que les **3 caractéristiques** disponibles dans leur niveau de carrière actuel
- Budget XP limité (typiquement 0-200 XP selon espèce/carrière/étoile)
- Les achats sont **bloqués** si le budget XP est dépassé

**Exemple:**
Un Pamphlétaire (carrière niveau 1) peut améliorer: **Agilité, Intelligence, Sociabilité**
Il ne peut PAS améliorer: Capacité de Combat, Force, Endurance, etc. (hors carrière)

### En Post-Création (Après validation)

**Libertés:**
- Les joueurs peuvent améliorer **toutes les caractéristiques**
- Caractéristiques **dans carrière**: coût normal
- Caractéristiques **hors carrière**: coût **× 2** (voir [out-of-career.md](./out-of-career.md))
- Pas de blocage strict du budget (le MJ peut autoriser une "dette" XP temporaire)

**Exemple:**
Un Pamphlétaire niveau 2 peut toujours améliorer Agilité/Int/Soc au coût normal, mais améliorer sa Force coûtera **× 2**.

## Valeur Finale

La valeur finale d'une caractéristique est calculée ainsi:

**Valeur Finale = Base + Avances Espèce + Avances Carrière + Avances Achetées (XP) + Modificateurs Talents**

**Exemple complet:**
- Intelligence base: 30
- Avances espèce (Elfe): +10
- Avances carrière (Érudit niveau 1): +5
- Avances achetées (XP): +8
- Modificateur talent (Perspicace): +5
- **Total final: 58**

## Limites et Contraintes

### Limite Technique

Le système V1 impose une **limite théorique de +70 avances** (visible dans le code), mais cette limite est **rarement atteinte** en jeu réel étant donné les coûts XP astronomiques.

**Coût pour +70:** 12225 XP (cumul de tous les paliers)

### Limite Narrative

Les MJ peuvent imposer des limites narratives:
- Maximum racial (ex: Halflings ne dépassent pas 40 en Force)
- Maximum temporel (une campagne de 2 ans ne permet pas 70 avances)
- Justification narrative (entraînement, mentor, événements)

## Interaction avec Talents

Certains talents modifient les caractéristiques **après** le calcul des avances XP:

**Talents donnant +5:**
- Perspicace (+5 Int)
- Affable (+5 Soc)
- Très fort (+5 For)

**Talents donnant +Bonus:**
- Résistance à la magie (+Bonus FM en Points de Magie)

Ces modifications **ne coûtent pas d'XP supplémentaire**, elles sont incluses dans le coût du talent (100 XP par rang).

## Validation

### Contraintes à Vérifier

1. **Budget XP suffisant** (mode création uniquement)
2. **Caractéristique dans carrière** (mode création) ou accepter coût × 2 (post-création)
3. **Palier correct** : Le coût affiché correspond au palier actuel
4. **Limite max** : Avances ≤ 70 (technique) ou limite MJ (narrative)

### Messages d'Erreur (V2)

**V1 actuel:** Désactivation silencieuse du bouton [+]
**V2 recommandé:**
- "Budget XP insuffisant (125 XP nécessaires, 80 XP disponibles)"
- "Caractéristique hors carrière: coût × 2 (50 XP au lieu de 25 XP)"
- "Limite maximale atteinte (+70 avances)"

## Relations

### Fichiers Liés

- [experience-budget.md](../wizard/experience-budget.md) - Budget XP initial en création
- [experience-characteristics.md](../wizard/experience-characteristics.md) - Dépenses XP en caractéristiques (wizard)
- [out-of-career.md](./out-of-career.md) - Multiplicateur × 2 hors carrière
- [xp-budget.md](./xp-budget.md) - Gestion budget XP disponible
- [validation.md](./validation.md) - Validation des achats XP

### Tables Database

- [characteristics.md](../../database/characteristics.md) - Structure des 18 caractéristiques
- [careerLevels.md](../../database/careerLevels.md) - Caractéristiques disponibles par niveau

### Patterns

- [pattern-validation-valeurs.md](../../patterns/pattern-validation-valeurs.md) - Validation plages de valeurs
