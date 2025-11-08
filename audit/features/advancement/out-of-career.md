# Advancement - Achats Hors Carrière

## Contexte

Les personnages peuvent acheter des améliorations hors de leur carrière actuelle, mais à un **coût double** pour refléter la difficulté d'apprentissage autodidacte.

## Règle du Coût Double

**Dans carrière:** Coût normal
**Hors carrière:** Coût × 2

S'applique à:
- Caractéristiques
- Compétences (Basic et Advanced)
- Talents

**Ne s'applique PAS à:**
- Sorts (règles spécifiques, voir [cost-spells.md](./cost-spells.md))

## Détermination "Dans/Hors Carrière"

Un élément est **dans carrière** s'il apparaît dans la liste du **niveau de carrière actuel**.

### Cumul des Niveaux

Les éléments s'accumulent:
- Niveau 1: Liste niveau 1
- Niveau 2: Liste niveau 1 + niveau 2
- Etc.

**Exemple Pamphlétaire niveau 2:**
- Dans carrière: Éléments niveaux 1 ET 2
- Hors carrière: Tout le reste

## Exemples de Coûts

### Caractéristiques

| Élément | Dans Carrière | Hors Carrière |
|---------|---------------|---------------|
| +1 Soc (dans) | 25 XP | - |
| +1 End (hors) | - | 50 XP (25 × 2) |
| +1 CC (hors, palier 6-10) | - | 60 XP (30 × 2) |

### Compétences Basic

| Élément | Dans Carrière | Hors Carrière |
|---------|---------------|---------------|
| Acquisition Charme | 10 XP | 20 XP (10 × 2) |
| Avance +6 Charme (palier 6-10) | 15 XP | 30 XP (15 × 2) |
| Acquisition Calme (hors) | - | 20 XP (10 × 2) |

### Compétences Advanced

| Élément | Dans Carrière | Hors Carrière |
|---------|---------------|---------------|
| Acquisition Langue (Bretonnien) | 20 XP | 40 XP (20 × 2) |
| Avance +2 Langue | 10 XP | 20 XP (10 × 2) |

### Talents

| Élément | Dans Carrière | Hors Carrière |
|---------|---------------|---------------|
| Affable (rang 1) | 100 XP | 200 XP (100 × 2) |
| Chanceux (rang 2) | 100 XP | 200 XP (100 × 2) |

## Calcul Cumulatif

Le multiplicateur × 2 s'applique **à chaque avance individuelle**, pas au coût total.

**Exemple: Acheter Charme +5 hors carrière**
- Acquisition: 10 × 2 = 20 XP
- Avances 1-4: 4 × (10 × 2) = 80 XP
- **Total: 100 XP** (équivaut à 50 XP × 2)

## Restrictions Supplémentaires

### Pendant la Création

**Aucun achat hors carrière autorisé** (voir [career-restrictions.md](./career-restrictions.md))

Les joueurs ne peuvent dépenser XP que sur les éléments du **niveau 1 de carrière**.

### En Post-Création

Tous les achats hors carrière sont autorisés avec le multiplicateur × 2.

## Changement de Carrière

Lors d'un changement de carrière, la détermination "dans/hors" carrière **change** selon la nouvelle carrière:

**Exemple:**
- Pamphlétaire niveau 1: Charme **dans carrière** (10 XP)
- Change vers Soldat niveau 1: Charme devient **hors carrière** (20 XP)

Les **acquis précédents restent**, mais les **nouveaux achats** suivent la nouvelle carrière.

## Logique Métier

### Justification Narrative

Le multiplicateur × 2 représente:
- **Absence de mentor/formation:** Apprentissage autodidacte plus lent
- **Manque de pratique:** Pas d'utilisation quotidienne dans la profession
- **Coût opportunité:** Temps pris sur les activités professionnelles

### Justification Mécanique

Encourage les joueurs à:
- **Suivre leur carrière:** Rester dans la spécialisation choisie
- **Changements réfléchis:** Changer de carrière a un impact réel
- **Optimisation XP:** Prioriser les achats "dans carrière"

## Affichage UI

### V1 Actuel

Les éléments hors carrière sont affichés dans un **panneau séparé** (panneau droit) avec le label:
- "Compétences hors carrière (coût x2):"
- "Caractéristiques hors carrière (coût x2):"

Le coût affiché est **déjà multiplié par 2** (pas besoin de calcul mental).

### V2 Recommandé

Affichage unifié avec **indicateur visuel** (icône, couleur) pour signaler coût × 2.

## Validation

### Contraintes à Vérifier

1. **Mode création:** Aucun achat hors carrière autorisé
2. **Mode post-création:** Coût × 2 appliqué correctement
3. **Affichage:** Coût affiché = coût de base × 2
4. **Budget:** XP suffisant pour le coût multiplié

### Messages d'Erreur (V2)

- "Achat hors carrière impossible en mode création"
- "Élément hors carrière: Coût × 2 appliqué (100 XP)"

## Relations

### Fichiers Liés

- [career-restrictions.md](./career-restrictions.md) - Restrictions carrière
- [cost-characteristics.md](./cost-characteristics.md) - Coûts caractéristiques
- [cost-skills-basic.md](./cost-skills-basic.md) - Coûts compétences Basic
- [cost-skills-advanced.md](./cost-skills-advanced.md) - Coûts compétences Advanced
- [cost-talents.md](./cost-talents.md) - Coûts talents
- [career-change.md](./career-change.md) - Changement carrière

### Tables Database

- [careerLevels.md](../../database/careerLevels.md) - Listes par niveau

### Business Rules

- [progression-careerlevels.md](../../business-rules/progression-careerlevels.md) - Système progression
