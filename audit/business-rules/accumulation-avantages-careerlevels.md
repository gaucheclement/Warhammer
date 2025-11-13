# Accumulation des Avantages par Niveau (CareerLevels)

## Vue d'ensemble

En progressant dans une carrière (niveaux 1 → 2 → 3 → 4), le personnage accumule des avantages selon des règles spécifiques à chaque type d'élément.

**Principe général:** La progression additive permet au personnage de conserver les acquis des niveaux précédents tout en gagnant de nouveaux avantages.

**Référence:** `audit/database/careerLevels.md`, `progression-careerlevels.md`

## Règles d'accumulation par type

### Characteristics (Cumulatif)

**Règle:** Les avances de caractéristiques s'accumulent niveau par niveau via dépense XP.

**Fonctionnement:**
- Niveau 1: 3 caractéristiques listées accessibles en carrière
- Niveau 2: + 1 caractéristique accessible en carrière
- Niveau 3: + 1 caractéristique accessible en carrière
- Niveau 4: + 1 caractéristique accessible en carrière

**En carrière** : Coût XP normal
**Hors carrière** : Coût XP ×2

**Exemple Artisan N4:**
Si achat +5 dans chaque carac listée N1-N4 (6 carac):
- 6 caractéristiques améliorées
- Coût total selon paliers XP (voir calculs-xp-progression.md)

### Skills (Accessibilité Cumulative)

**Règle:** Chaque niveau débloque de nouvelles compétences achetables en carrière.

**Fonctionnement:**
- Niveau 1: 8-10 skills accessibles en carrière
- Niveau 2: + 6 skills accessibles en carrière
- Niveau 3: + 4 skills accessibles en carrière
- Niveau 4: + 2 skills accessibles en carrière

**Acquisition:** Achat avec XP (coût normal si en carrière, ×2 sinon)

**Exemple Artisan N4:**
- 20 skills différentes accessibles en carrière (8+6+4+2)
- Personnage achète celles voulues avec XP
- Skills niveau inférieur restent achetables (N2 peut acheter skills N1)

**Note:** Même skill apparaissant à plusieurs niveaux = débloquée au premier niveau.

### Talents (Accessibilité NON Rétroactive)

**Règle:** Chaque niveau débloque de nouveaux talents achetables en carrière. **IMPORTANT:** Talents niveau inférieur deviennent inaccessibles.

**Fonctionnement:**
- Niveau 1: 4 talents accessibles en carrière
- Niveau 2: 4 nouveaux talents accessibles, **talents N1 bloqués**
- Niveau 3: 4 nouveaux talents accessibles, **talents N1-N2 bloqués**
- Niveau 4: 4 nouveaux talents accessibles, **talents N1-N3 bloqués**

**Acquisition:** Achat avec XP (coût normal si en carrière, ×2 sinon)

**Exemple Artisan N2:**
- 4 talents N2 achetables en carrière
- 4 talents N1 **NON achetables** (niveau dépassé)
- Si talent N1 non acheté avant N2 → perdu

**Exception:** Talents rangs multiples peuvent progresser si déjà acquis au rang 1.

### Trappings (Non cumulatif)

**Règle:** Les trappings NE s'accumulent PAS automatiquement. Chaque niveau fournit uniquement ses propres trappings.

**Exception niveau 1:** Le niveau 1 hérite automatiquement des trappings de la classe (définis dans la table careers).

**Fonctionnement:**
- Niveau 1: Trappings de la classe + trappings du niveau 1
- Niveau 2: Trappings du niveau 2 uniquement (pas ceux du niveau 1)
- Niveau 3: Trappings du niveau 3 uniquement
- Niveau 4: Trappings du niveau 4 uniquement

**Exemple Artisan:**
- Niveau 1: Trappings classe + Craie, Justaucorps de cuir, Chiffon (1d10)
- Niveau 2: Licence de Guilde, Outils professionnels (ne garde PAS les trappings niveau 1)
- Niveau 3: Apprenti, Atelier (ne garde PAS les trappings niveaux 1-2)
- Niveau 4: Guilde, Vêtements de qualité (ne garde PAS les trappings niveaux 1-3)

**Raison métier:** Les trappings représentent l'équipement approprié au statut actuel, pas un cumul d'objets.

## Accessibilité par niveau

### Niveau 1

**Characteristics:** 3 accessibles en carrière
**Skills:** 8-10 accessibles en carrière
**Talents:** 4 accessibles en carrière
**Trappings:** Classe + niveau 1

### Niveau 2

**Characteristics:** 4 accessibles (3 N1 + 1 N2)
**Skills:** 14-16 accessibles (8-10 N1 + 6 N2)
**Talents:** 4 accessibles N2 (N1 bloqués)
**Trappings:** Niveau 2 uniquement

### Niveau 3

**Characteristics:** 5 accessibles (3 N1 + 1 N2 + 1 N3)
**Skills:** 18-20 accessibles (8-10 N1 + 6 N2 + 4 N3)
**Talents:** 4 accessibles N3 (N1-N2 bloqués)
**Trappings:** Niveau 3 uniquement

### Niveau 4

**Characteristics:** 6 accessibles (3 N1 + 1 N2 + 1 N3 + 1 N4)
**Skills:** 20-22 accessibles (8-10 N1 + 6 N2 + 4 N3 + 2 N4)
**Talents:** 4 accessibles N4 (N1-N3 bloqués)
**Trappings:** Niveau 4 uniquement

## Changement de carrière

### Conservation des acquis

Quand un personnage change de carrière (coût 100 XP), il conserve TOUS avantages achetés.

**Conservation:**
- ✅ Characteristics: Toutes avances conservées
- ✅ Skills: Toutes compétences conservées
- ✅ Talents: Tous talents conservés
- ✅ Trappings: Équipement conservé

**Nouvelle carrière:** Niveau 1, statut nouveau métier. Éléments accessibles en carrière changent.

**Gain automatique:** SEULEMENT le nouveau statut

### Exemple

**Agitateur niveau 3 change pour Artisan:**

**Avant changement:**
- XP dépensé pour acheter avances Agitateur N1-N3
- Statut: Agitateur N3

**Après changement (coût 100 XP):**
- Conservation: TOUTES avances achetées
- Nouveau statut: Artisan N1
- Nouveaux éléments en carrière: Artisan N1 (skills/talents/carac)
- Anciens éléments Agitateur: deviennent hors carrière (coût ×2)

## Progression non-linéaire

Un personnage peut changer de carrière puis y revenir ultérieurement.

**Exemple:**
1. Agitateur niveaux 1-3 (18 skills acquis)
2. Change pour Artisan niveaux 1-2 (14 skills Artisan acquis)
3. Revient à Agitateur niveau 4 (2 nouveaux skills Agitateur)

**Total:** 18 + 14 + 2 = 34 skills (Agitateur + Artisan)

**Note:** Les skills/talents des différentes carrières s'ajoutent, permettant des personnages très polyvalents.

## Références croisées

**Tables:**
- `audit/database/careerLevels.md` - Structure complète
- `audit/database/characteristics.md` - Caractéristiques
- `audit/database/skills.md` - Compétences
- `audit/database/talents.md` - Talents

**Règles métier:**
- `progression-careerlevels.md` - Système de progression
- `../patterns/pattern-parsing.md` - Format des avances
- `calculs-xp-progression.md` - Coûts XP pour progresser
