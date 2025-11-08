# Advancement - Restrictions Carrière

## Contexte

Le système de carrières dans Warhammer impose des restrictions sur ce qui peut être acheté avec les XP selon le niveau de carrière actuel.

Cette documentation décrit les règles de restriction d'avancement liées à la carrière du personnage.

## Types de Restrictions

### Pendant la Création (Wizard)

**Restriction stricte:**
- Seulement **3 caractéristiques** du niveau 1 de carrière
- Seulement **compétences** du niveau 1 de carrière
- Seulement **4 talents** du niveau 1 de carrière
- **Aucun changement de carrière** autorisé
- **Aucune progression de niveau** autorisée (bloqué niveau 1)

**Exemple Pamphlétaire niveau 1:**
- Caractéristiques: Agilité, Intelligence, Sociabilité (3 seules autorisées)
- Compétences: Charme, Ragot, Commandement, Intuition, Perception, etc. (8 listées)
- Talents: 4 parmi ceux listés (Affable, Éloquent, etc.)
- Impossible d'acheter: Force, Calme, Langue (Bretonnien), etc. (hors carrière niveau 1)

### En Post-Création (Mode Advancement)

**Libertés avec coût:**
- **Toutes caractéristiques** accessibles (coût × 2 si hors carrière actuelle)
- **Toutes compétences Basic** accessibles (coût × 2 si hors carrière)
- **Toutes compétences Advanced** accessibles (coût × 2 si hors carrière)
- **Tous talents** accessibles (coût × 2 si hors carrière, si pré-requis OK)
- **Changement de carrière** autorisé (voir [career-change.md](./career-change.md))
- **Progression de niveau** autorisée (voir [career-levels.md](./career-levels.md))

## Détermination "Dans Carrière"

Un élément (caractéristique, compétence, talent) est considéré **dans carrière** s'il apparaît dans **le niveau de carrière actuel**.

### Exemple Pamphlétaire

**Niveau 1 (Bronze):**
- Caractéristiques: Ag, Int, Soc
- Skills: Charme, Ragot, Commandement, Intuition, Perception, Athlétisme, Corps à Corps (base), Divertissement
- Talents: Affable, Éloquent, Étiquette, etc.

**Si le personnage est au niveau 1:**
- Charme → **dans carrière** (coût normal)
- Calme → **hors carrière** (coût × 2)

**Si le personnage passe au niveau 2:**
- Nouvelles compétences du niveau 2 deviennent **dans carrière**
- Compétences du niveau 1 restent **dans carrière** (cumul)

## Complétion de Niveau

### Règle Optionnelle

Certains MJ peuvent imposer la **complétion du niveau actuel** avant de passer au suivant:

**Complétion = Acheter toutes les avances listées:**
- Toutes les caractéristiques (+5 ou +10 selon niveau)
- Toutes les compétences
- Tous les talents

**Exemple Pamphlétaire niveau 1 → 2:**
- Faut-il avoir acheté +5 Ag, +5 Int, +5 Soc?
- Faut-il avoir acquis toutes les 8 compétences?
- Faut-il avoir acquis les 4 talents?

**V1:** Pas de vérification de complétion (optionnel MJ)
**V2 recommandé:** Option configurable (strict/souple/optionnel)

## Limites par Niveau

### Avances Caractéristiques

**Niveau 1:** +5 maximum dans les 3 caractéristiques listées
**Niveau 2:** +10 maximum dans 1 caractéristique listée
**Niveau 3:** +15 maximum dans 1 caractéristique listée
**Niveau 4:** +20 maximum dans 1 caractéristique listée

**Cumul:** +30 maximum (3×5 + 1×10 + 1×5 + 1×5) dans toutes les caractéristiques de la carrière complète

**Note:** Ces limites s'appliquent aux **avances carrière**, pas aux **avances achetées XP**.

### Compétences

Nombre de compétences par niveau (typique):
- **Niveau 1:** 8-10 compétences
- **Niveau 2:** 6 compétences
- **Niveau 3:** 4 compétences
- **Niveau 4:** 2 compétences

**Cumul:** ~20-22 compétences totales sur les 4 niveaux

### Talents

**Chaque niveau:** 4 talents listés

**Cumul:** 16 talents totaux sur les 4 niveaux d'une carrière

## Exemples Concrets

### Exemple 1: Agitateur niveau 1 en création

**Autorisé:**
- Acheter +3 Sociabilité (dans carrière niveau 1)
- Acheter Charme +5 (dans carrière niveau 1)
- Acheter talent Affable (dans carrière niveau 1)

**Interdit:**
- Acheter +1 Endurance (hors carrière niveau 1)
- Acheter Calme (hors carrière niveau 1)
- Passer niveau 2 (création bloquée niveau 1)

### Exemple 2: Agitateur niveau 1 en post-création

**Autorisé avec coût normal:**
- Acheter +1 Sociabilité (25 XP)
- Acheter Charme +1 (10 XP acquisition)

**Autorisé avec coût × 2:**
- Acheter +1 Endurance (50 XP au lieu de 25 XP)
- Acheter Calme +1 (20 XP au lieu de 10 XP)

**Autorisé si complétion:**
- Passer niveau 2 (si conditions MJ satisfaites)

### Exemple 3: Pamphlétaire niveau 2

**Dans carrière (coût normal):**
- Toutes les caractéristiques/compétences/talents des niveaux 1 ET 2

**Hors carrière (coût × 2):**
- Caractéristiques/compétences/talents NON listés dans niveaux 1-2

## Règles Métier

### Cumul des Niveaux

Les éléments "dans carrière" **s'accumulent** à chaque niveau:
- Niveau 1: Liste 1
- Niveau 2: Liste 1 + Liste 2
- Niveau 3: Liste 1 + Liste 2 + Liste 3
- Niveau 4: Liste 1 + Liste 2 + Liste 3 + Liste 4

### Changement de Carrière

Lors d'un changement de carrière (voir [career-change.md](./career-change.md)):
- Les acquis de l'ancienne carrière **restent**
- Les éléments "dans carrière" **changent** (nouvelle carrière)
- Les coûts × 2 s'appliquent selon la **nouvelle carrière actuelle**

## Validation

### Contraintes à Vérifier

1. **Mode création:** Élément dans liste carrière niveau 1 uniquement
2. **Mode post-création:** Coût × 2 si hors liste carrière niveau actuel
3. **Complétion niveau** (si règle MJ activée)
4. **Niveau maximum:** Impossible de dépasser niveau 4 d'une carrière

### Messages d'Erreur (V2)

- "Élément hors carrière: Coût × 2 (100 XP au lieu de 50 XP)"
- "Mode création: Seulement éléments du niveau 1 autorisés"
- "Complétion niveau 1 requise avant passage niveau 2 (manque 2 talents)"

## Relations

### Fichiers Liés

- [out-of-career.md](./out-of-career.md) - Multiplicateur × 2 hors carrière
- [career-levels.md](./career-levels.md) - Progression niveaux carrière
- [career-change.md](./career-change.md) - Changement de carrière
- [validation.md](./validation.md) - Validation achats XP

### Tables Database

- [careerLevels.md](../../database/careerLevels.md) - Structure 4 niveaux par carrière

### Business Rules

- [progression-careerlevels.md](../../business-rules/progression-careerlevels.md) - Système progression
