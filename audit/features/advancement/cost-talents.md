# Advancement - Coût XP Talents

## Contexte

Les talents offrent des capacités spéciales aux personnages. Certains peuvent être acquis plusieurs fois (rangs multiples), d'autres une seule fois.

Cette documentation décrit le calcul du coût XP pour acquérir des talents et leurs rangs supplémentaires.

## Formule de Coût XP

### Coût Standard

**Dans carrière:** 100 XP par rang
**Hors carrière:** 200 XP par rang (× 2)

### Coût par Rang

Pour les talents à rangs multiples, le coût est **multiplicatif**:

| Rang | Coût (dans carrière) | Coût (hors carrière) | Cumul (dans) |
|------|----------------------|----------------------|--------------|
| 1    | 100 XP               | 200 XP               | 100 XP       |
| 2    | 100 XP               | 200 XP               | 200 XP       |
| 3    | 100 XP               | 200 XP               | 300 XP       |
| 4    | 100 XP               | 200 XP               | 400 XP       |
| 5    | 100 XP               | 200 XP               | 500 XP       |

**Formule:** Coût rang N = 100 XP (ou 200 XP hors carrière)

**Note:** Le coût est **fixe par rang**, contrairement aux caractéristiques/compétences qui ont des paliers progressifs.

## Rangs Multiples

### Types de Rangs

**Unique (max = 1):** La plupart des talents (ex: Ambidextre, Éloquent, Maîtrise)
**Rangs fixes (max = 2-5):** Talents avec limite définie (ex: Résistance +, Réflexes éclair)
**Rangs dynamiques (max = Bonus Carac):** Talents liés à une caractéristique (ex: Chanceux max = Bonus Chance)
**Rangs illimités:** Très rares (ex: Dur à cuire)

### Acquisition Séquentielle

Les rangs doivent être acquis **dans l'ordre** : impossible d'acheter Rang 3 sans avoir Rang 1 et 2.

## Exemples Concrets

### Exemple 1: Soldat acquiert Maîtrise (Épées) - dans carrière

Talent unique (max 1) → Acquisition rang 1: **100 XP**

### Exemple 2: Prêtre acquiert Chanceux (rang 1-3) - dans carrière

Chance 35 (Bonus = 3) → Max 3 rangs
- Rang 1: 100 XP → +1 Chance (36)
- Rang 2: 100 XP → +1 Chance (37)
- Rang 3: 100 XP → +1 Chance (38)
**Total: 300 XP** pour +3 Chance

### Exemple 3: Guerrier acquiert Dur à cuire (rangs illimités) - hors carrière

Talent hors carrière → Rang 1: 200 XP, Rang 2: 200 XP
**Total: 400 XP** pour 2 rangs (+2 Blessures)

### Exemple 4: Sorcier acquiert Magie mineure (Chaos)

Talent magique spécial → 100 XP (voir [cost-spells.md](./cost-spells.md) pour sorts associés)

## Talents Spéciaux

### Talents avec Spécialisations

Certains talents nécessitent une spécialisation:
- **Maîtrise** (Armes de base, Armes blanches, etc.)
- **Armes naturelles** (Créatures uniquement)
- **Artiste** (Au choix)

Chaque spécialisation compte comme un **talent distinct**.

**Exemple:**
- Maîtrise (Épées): 100 XP
- Maîtrise (Armes d'hast): 100 XP
- **Total: 200 XP** (deux talents séparés)

### Talents Magiques

Certains talents débloquent l'accès à la magie:
- **Sens de la magie** (prérequis pour Magie des Arcanes)
- **Magie mineure** (Arcane/Chaos/Divine)
- **Magie des Arcanes** (domaine Ghur, Azyr, etc.)
- **Bénédiction** (miracles divins)

Le talent lui-même coûte 100 XP, les sorts associés ont leurs propres coûts (voir [cost-spells.md](./cost-spells.md)).

## Cas Spécial: Magie du Chaos

**Coût fixe:** 100 XP (pas de rangs multiples)

Le talent Magie du Chaos coûte toujours 100 XP, indépendamment du nombre de sorts Chaos appris.

## Règles Métier

**Création:** Seulement talents listés carrière niveau 1, acquisition rang 1 uniquement.
**Post-création:** Tous talents accessibles (si pré-requis satisfaits), rangs multiples autorisés, coût × 2 hors carrière.

### Pré-requis

Certains talents nécessitent d'autres talents:
- **Frénésie** → débloqué par **Flagellant**
- **Magie des Arcanes** → nécessite **Sens de la magie**

Le système vérifie les pré-requis avant autoriser l'achat.

## Effets des Talents

Les talents peuvent:
- **Modifier caractéristiques:** +5 ou +Bonus (Affable +5 Soc, Chanceux +1 Chance)
- **Ajouter compétences:** Linguistique ajoute Langue (au choix)
- **Ajouter magie:** Magie mineure ajoute sorts mineurs
- **Débloquer talents:** Flagellant → Frénésie
- **Effets spéciaux:** Ambidextre (pas pénalité main gauche)

Ces effets sont **automatiques** et inclus dans le coût du talent (pas de XP supplémentaire).

## Validation

### Contraintes à Vérifier

1. **Pré-requis satisfaits** : Talents chaînés vérifiés
2. **Rang séquentiel** : Ne peut pas acheter rang N+1 sans rang N
3. **Rang maximum** : Respecte max (fixe, dynamique, ou illimité)
4. **Spécialisation choisie** : Si nécessaire (Maîtrise, Artiste, etc.)
5. **Budget XP suffisant**
6. **Talent dans carrière** (création) ou coût × 2 (post-création)

### Messages d'Erreur (V2)

- "Pré-requis manquant: Sens de la magie requis pour Magie des Arcanes"
- "Rang maximum atteint (3/3): Bonus Chance = 3"
- "Acquérir rang 1 avant rang 2"
- "Spécialisation requise: Choisissez un type d'arme pour Maîtrise"

## Relations

### Fichiers Liés

- [experience-talents.md](../wizard/experience-talents.md) - Dépenses XP talents (wizard)
- [cost-spells.md](./cost-spells.md) - Coût sorts magiques
- [out-of-career.md](./out-of-career.md) - Multiplicateur × 2 hors carrière

### Tables Database

- [talents.md](../../database/talents.md) - Structure 150+ talents

### Business Rules

- [talents-rangs-multiples.md](../../business-rules/talents-rangs-multiples.md) - Système rangs
- [talents-specialisations.md](../../business-rules/talents-specialisations.md) - Spécialisations
- [talents-deblocage-talents.md](../../business-rules/talents-deblocage-talents.md) - Chaînes talents
- [application-effets-talents.md](../../business-rules/application-effets-talents.md) - Application effets
