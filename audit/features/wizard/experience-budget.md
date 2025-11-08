# Wizard Experience - Budget XP

## Vue d'ensemble

L'étape "Progression" du wizard de création permet de dépenser des Points d'Expérience (PX/XP) pour améliorer le personnage. Le budget provient des bonus accumulés pendant la création.

**Contexte:** Étape finale après espèce, carrière, caractéristiques, compétences, talents, détails.

**Référence:** `calculs-xp-progression.md`, `wizard-species.md`, `star-selection.md`

## Budget XP disponible

### Sources de XP en création

**1. Bonus XP espèce**
- Humain rand 91-100: +50 XP
- Humain rand 81-90: +25 XP
- Autres races similaire selon tirage

**2. Bonus XP carrière**
- Carrière commune (rand 1-40): 0 XP
- Carrière rare (rand 71-95): +25 XP
- Carrière très rare (rand 96-100): +50 XP

**3. Bonus XP étoile natale**
- Étoile du Sorcier (subRand): +25 XP

**Total typique:** 0 à 125 XP selon tirages.

**Distribution:**
- 0 XP: ~50%, 25 XP: ~30%, 50-75 XP: ~15%, 100-125 XP: ~5%

### Affichage du budget

**Format:** `[X] Points d'Expérience à dépenser`

Où X = character.xp.max - character.xp.tmp_used (temps réel).

**Rafraîchissement:** Instantané après chaque ajustement +/-.

## Dépenses autorisées

### En création (type='creation')

**Limitation stricte:** Dépenses limitées au niveau 1 de carrière uniquement:
- 3 caractéristiques
- 8 compétences
- 4 talents

**Justification:** Personnage débute niveau 1, pas accès hors carrière.

### Post-création (type='final')

**Dépenses élargies:**
- Caractéristiques/compétences en carrière (coût normal)
- Caractéristiques/compétences hors carrière (coût ×2)

## Validation du budget

### Règles

**Budget non dépassé:** Si XP restant < 0 (création):
- Bouton "+" désactivé
- Bouton "Valider" désactivé

**Achat possible:** Bouton "+" désactivé si:
- Coût > XP restant (création)
- Élément atteint max

**Post-création:** Validation toujours possible (dette autorisée).

### Messages

**Création:** Boutons grisés (pas message texte).
**Post-création:** Aucune restriction.

## Exemples

### Exemple 1: Budget 50 XP

**Humain Pamphlétaire** (+25 espèce, +25 carrière)

**Options:**
1. Intelligence +2: 50 XP → Restant: 0
2. Art (Écriture) +5: 50 XP → Restant: 0
3. Intelligence +1 (25) + Art +2 (20) → Restant: 5

**Note:** Talent impossible (min 100 XP).

### Exemple 2: Budget 125 XP

**Elfe Érudit** (+50 espèce, +50 carrière, +25 étoile)

**Options:**
1. Talent "Calme" (100) + Intelligence +1 (25) → Restant: 0
2. Intelligence +5: 125 XP → Restant: 0
3. 3 compétences (50+50+20) → Restant: 5

### Exemple 3: Budget 0 XP

**Nain Artisan** (aucun bonus)

Aucune dépense. Personnage avec valeurs de base.

## Interface

### Structure affichée

**En-tête:** `[Budget] Points d'Expérience à dépenser`

**Sections:**
1. Caractéristiques (3)
2. Talents (4)
3. Compétences (8)

**Colonnes:** Nom | Base | Aug | Coût | Total

**Boutons:** - (remb.) | + (dépense) | Valider | Annuler

### Rafraîchissement

Clic +/- → Recalcul XP → Mise à jour budget et boutons

## Règles métier

### Règle 1: Budget strict création

Limite stricte, validation bloquée si dépassement.

### Règle 2: Liberté post-création

Budget indicatif, géré par MJ.

### Règle 3: Annulation complète

Bouton "Annuler" réinitialise avances temporaires.

### Règle 4: Visibilité coûts

Coût prochain achat affiché (jaune) en temps réel.

## Relations

### Dépendances amont

**Sources XP:**
- Species (bonus aléatoire)
- Careers (bonus rareté)
- Stars (Étoile du Sorcier)

**Éléments:** CareerLevels niveau 1 (3+8+4)

### Dépendances aval

**Sauvegarde:**
- character.xp.used: Total dépensé
- character.xp.max: Budget
- Avances tmp → permanentes

**Suite:** Résumé final

## Références croisées

**Tables:**
- `audit/database/species.md` - Bonus XP
- `audit/database/careers.md` - Bonus XP
- `audit/database/stars.md` - Bonus XP
- `audit/database/careerLevels.md` - Éléments

**Règles:**
- `calculs-xp-progression.md` - Formules coûts
- `progression-careerlevels.md` - Système

**Features:**
- `wizard-species.md` - Génération
- `star-selection.md` - Sélection
