# Accumulation des Avantages par Niveau (CareerLevels)

## Vue d'ensemble

En progressant dans une carrière (niveaux 1 → 2 → 3 → 4), le personnage accumule des avantages selon des règles spécifiques à chaque type d'élément.

**Principe général:** La progression additive permet au personnage de conserver les acquis des niveaux précédents tout en gagnant de nouveaux avantages.

**Référence:** `audit/database/careerLevels.md`, `progression-careerlevels.md`

## Règles d'accumulation par type

### Characteristics (Cumulatif)

**Règle:** Les avances de caractéristiques s'additionnent niveau par niveau.

**Fonctionnement:**
- Niveau 1: Personnage reçoit +5 aux 3 caractéristiques listées
- Niveau 2: Personnage conserve le +5×3 ET reçoit +5 à la 1 nouvelle caractéristique
- Niveau 3: Personnage conserve tout ET reçoit +5 à la 1 nouvelle caractéristique
- Niveau 4: Personnage conserve tout ET reçoit +5 à la 1 nouvelle caractéristique

**Exemple Artisan:**
- Niveau 1: Force +5, Endurance +5, Dextérité +5 = Total 15 points
- Niveau 2: + Sociabilité +5 = Total 20 points cumulés
- Niveau 3: + Force Mentale +5 = Total 25 points cumulés
- Niveau 4: + Intelligence +5 = Total 30 points cumulés

**Au niveau 4:** 6 caractéristiques améliorées, 30 points distribués

### Skills (Cumulatif)

**Règle:** Les compétences s'accumulent niveau par niveau. Le personnage garde toutes les compétences acquises.

**Fonctionnement:**
- Niveau 1: Personnage reçoit 8-10 skills
- Niveau 2: Personnage conserve les 8-10 skills ET reçoit 6 nouveaux skills
- Niveau 3: Personnage conserve les 14-16 skills ET reçoit 4 nouveaux skills
- Niveau 4: Personnage conserve les 18-20 skills ET reçoit 2 nouveaux skills

**Exemple Artisan:**
- Niveau 1: 8 skills
- Niveau 2: 8 + 6 = 14 skills cumulés
- Niveau 3: 14 + 4 = 18 skills cumulés
- Niveau 4: 18 + 2 = 20 skills cumulés

**Au niveau 4:** 20 compétences totales

**Note:** Si une même skill (avec même spécialisation) apparaît à plusieurs niveaux, elle n'est comptée qu'une fois.

### Talents (Cumulatif)

**Règle:** Les talents s'accumulent niveau par niveau. Le personnage garde tous les talents acquis.

**Fonctionnement:**
- Niveau 1: Personnage reçoit 4 talents
- Niveau 2: Personnage conserve les 4 talents ET reçoit 4 nouveaux talents
- Niveau 3: Personnage conserve les 8 talents ET reçoit 4 nouveaux talents
- Niveau 4: Personnage conserve les 12 talents ET reçoit 4 nouveaux talents

**Exemple Artisan:**
- Niveau 1: 4 talents
- Niveau 2: 4 + 4 = 8 talents cumulés
- Niveau 3: 8 + 4 = 12 talents cumulés
- Niveau 4: 12 + 4 = 16 talents cumulés

**Au niveau 4:** 16 talents totaux

**Note talents multiples:** Certains talents peuvent être acquis plusieurs fois (rangs multiples). Si le même talent apparaît à plusieurs niveaux, il est compté autant de fois.

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

## Calcul des totaux à un niveau donné

### Niveau 1

**Characteristics:** 3 améliorées, 15 points (3×5)
**Skills:** 8-10 compétences
**Talents:** 4 talents
**Trappings:** Trappings classe + trappings niveau 1

### Niveau 2

**Characteristics:** 4 améliorées, 20 points (3×5 + 1×5)
**Skills:** 14-16 compétences (8-10 + 6)
**Talents:** 8 talents (4 + 4)
**Trappings:** Trappings niveau 2 uniquement

### Niveau 3

**Characteristics:** 5 améliorées, 25 points (3×5 + 1×5 + 1×5)
**Skills:** 18-20 compétences (8-10 + 6 + 4)
**Talents:** 12 talents (4 + 4 + 4)
**Trappings:** Trappings niveau 3 uniquement

### Niveau 4

**Characteristics:** 6 améliorées, 30 points (3×5 + 1×5 + 1×5 + 1×5)
**Skills:** 20-22 compétences (8-10 + 6 + 4 + 2)
**Talents:** 16 talents (4 + 4 + 4 + 4)
**Trappings:** Trappings niveau 4 uniquement

## Changement de carrière

### Conservation des acquis

Quand un personnage change de carrière, il conserve TOUS les avantages acquis dans l'ancienne carrière.

**Conservation:**
- ✅ Characteristics: Tous les bonus sont conservés
- ✅ Skills: Toutes les compétences sont conservées
- ✅ Talents: Tous les talents sont conservés
- ❌ Trappings: Équipement actuel conservé (pas lié à la carrière)

**Nouvelle carrière:** Le personnage commence au niveau 1 de la nouvelle carrière et peut acquérir de nouveaux avantages.

### Exemple

**Agitateur niveau 3 change pour Artisan:**

**Avant changement:**
- Characteristics: 5 améliorées (15 points du niveau 1-3 d'Agitateur)
- Skills: 18 skills d'Agitateur
- Talents: 12 talents d'Agitateur

**Après changement (Artisan niveau 1):**
- Characteristics: 5 d'Agitateur + 3 d'Artisan niveau 1 = 8 améliorées, 40 points
- Skills: 18 d'Agitateur + 8 d'Artisan niveau 1 = 26 skills
- Talents: 12 d'Agitateur + 4 d'Artisan niveau 1 = 16 talents
- Trappings: Trappings classe Artisan + trappings Artisan niveau 1

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
- `parsing-avances-caracteristiques.md` - Format des avances
- `calculs-xp-progression.md` - Coûts XP pour progresser
