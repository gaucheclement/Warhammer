# Advancement - Progression Niveaux Carrière

## Contexte

Chaque carrière possède 4 niveaux (Bronze → Silver → Gold → Gold+). La progression entre niveaux nécessite d'acheter les avantages avec XP.

## Structure 4 Niveaux

**Niveau 1 (Bronze):** Point d'entrée carrière, 3 caractéristiques +5, 8-10 compétences, 4 talents
**Niveau 2 (Silver):** 1 caractéristique +10, 6 compétences, 4 talents
**Niveau 3 (Gold):** 1 caractéristique +15, 4 compétences, 4 talents
**Niveau 4 (Gold+):** 1 caractéristique +20, 2 compétences, 4 talents

**Total cumulé:** 6 caractéristiques (+30 avances), 20-22 compétences, 16 talents

## Conditions de Passage

### Complétion Niveau (Optionnelle MJ)

**Règle stricte:** Acheter **tous les avantages** listés avant passage niveau supérieur

**Exemple Pamphlétaire niveau 1 → 2:**
- Avances caractéristiques: +5 Ag, +5 Int, +5 Soc (75 XP minimum)
- Compétences: Les 8 acquises (+avances optionnelles)
- Talents: Les 4 acquis (400 XP)
- **Total minimum:** ~500-700 XP

**Règle souple:** Passage autorisé sans complétion (V1 actuel)

### Validation MJ

Le MJ peut imposer:
- **Complétion partielle:** Au moins 2/3 avantages achetés
- **Justification narrative:** Événement RP, mentor, temps écoulé
- **Tests de compétence:** Prouver maîtrise métier

**V1:** Pas de validation (passage libre si niveau existe).

## Mécanisme de Passage

### Processus

1. Personnage au niveau N avec avantages achetés
2. Clic interface (bouton implicite ou via changement carrière)
3. Validation conditions (si règle MJ activée)
4. **Mise à jour careerLevel** (niveau N+1)
5. **Nouveaux avantages disponibles** (liste niveau N+1)

**Important:** Le passage est vers le niveau **N+1 de la MÊME carrière** (pas changement carrière).

### Conservation des Acquis

**Ce qui est CONSERVÉ:**
- Toutes avances précédentes (caractéristiques, compétences, talents)
- XP dépensé
- Status social niveau N

**Ce qui CHANGE:**
- **Niveau actuel** (N → N+1)
- **Liste "dans carrière"** (ajout nouveaux éléments niveau N+1)
- **Status social** (Bronze → Silver → Gold)
- **Salaire** (augmente avec status)

### Accumulation

Les avantages **s'accumulent** à chaque niveau:

**Pamphlétaire niveau 2:**
- Dans carrière: Éléments niveau 1 **ET** niveau 2
- Hors carrière: Tout le reste

**Exemple:**
- Niveau 1: Charme (dans carrière)
- Niveau 2: Charme reste **dans carrière** + nouvelles compétences niveau 2

## Application Nouveaux Avantages

### Nouveaux Éléments "Dans Carrière"

Le passage niveau N+1 ajoute de **nouveaux éléments** à la liste "dans carrière":

**Nouvelles caractéristiques:** 1 nouvelle (coût normal pour acheter +10/+15/+20 selon niveau)
**Nouvelles compétences:** 6/4/2 nouvelles (coût normal acquisition/avances)
**Nouveaux talents:** 4 nouveaux (coût normal 100 XP)

**Coût futur réduit:** Ces nouveaux éléments passent de "hors carrière" (×2) à "dans carrière" (×1).

### Exemple Pamphlétaire niveau 1 → 2

**Avant passage (niveau 1):**
- Éloquence: hors carrière (acquisition 20 XP)
- Commandement: hors carrière (acquisition 20 XP)

**Après passage (niveau 2):**
- Éloquence: **dans carrière** (acquisition 10 XP) ← Nouveau niveau 2
- Commandement: reste dans carrière (déjà niveau 1)

**Économie XP:** Éloquence passe de 20 XP à 10 XP (économie 10 XP sur acquisition).

## Restrictions

### Limite Niveau 4

**Maximum:** Impossible de dépasser niveau 4 d'une carrière

**Options après niveau 4:**
- Rester niveau 4 (continuer acheter avances XP)
- Changer de carrière (voir [career-change.md](./career-change.md))

### Impossibilité Retour

**Pas de retour en arrière:** Impossible de revenir niveau N-1 après passage N

## Coûts XP

### Coût du Passage

**V1 actuel:** Passage niveau N+1 est **gratuit** (aucun coût XP)

Le coût réside dans l'**achat des avantages** listés (si complétion requise).

**V2 option:** Coût fixe passage (ex: 100 XP) + achat avantages

### Optimisation Joueur

**Stratégie:** Passer niveau N+1 **avant** d'acheter les nouveaux éléments pour bénéficier coût "dans carrière" au lieu de "hors carrière".

**Exemple:**
- Niveau 1: Éloquence coûte 20 XP (hors carrière)
- Passage niveau 2 (gratuit)
- Niveau 2: Éloquence coûte 10 XP (dans carrière)
- **Économie:** 10 XP

## Status Social et Salaire

### Évolution Status

**Niveau 1 (Bronze):** Status Bronze (ex: Brass 3 = B3)
**Niveau 2 (Silver):** Status Silver (ex: Silver 2 = S2)
**Niveau 3 (Gold):** Status Gold (ex: Gold 1 = G1)
**Niveau 4 (Gold+):** Status Gold supérieur (ex: Gold 2 = G2)

**Impact:** Interactions sociales, revenus, respect NPC

### Salaire

Le salaire augmente avec le status social (règles WFRP page 50):

**Bronze:** 1-5 schillings/semaine
**Silver:** 10-20 schillings/semaine
**Gold:** 1-2 couronnes d'or/semaine

**V1:** Pas d'implémentation salaire automatique (géré par MJ).

## Validation

### Contraintes

1. **Niveau actuel < 4** (pas de niveau 5)
2. **Complétion niveau actuel** (si règle MJ activée)
3. **Validation MJ** (optionnelle)

### Messages

- "Niveau maximum atteint (niveau 4)"
- "Complétion niveau 1 requise (manque 2 talents)"
- "Passage niveau 2 confirmé (nouvelles compétences disponibles)"

## Relations

### Fichiers Liés

- [career-change.md](./career-change.md) - Changement carrière
- [career-restrictions.md](./career-restrictions.md) - Restrictions par carrière
- [out-of-career.md](./out-of-career.md) - Coûts ×2

### Tables Database

- [careerLevels.md](../../database/careerLevels.md) - 4 niveaux par carrière (~800 niveaux totaux)

### Business Rules

- [progression-careerlevels.md](../../business-rules/progression-careerlevels.md) - Système progression 4 niveaux
- [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md) - Accumulation avantages
