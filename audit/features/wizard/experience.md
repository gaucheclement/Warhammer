# Wizard - Expérience initiale

## Vue d'ensemble

L'étape Progression permet de dépenser des Points d'Expérience (XP) pour améliorer le personnage. Le budget provient des bonus espèce, carrière et étoile natale.

**Contexte:** Étape finale après espèce, carrière, caractéristiques, compétences, talents, détails.

## Points d'expérience départ

### Sources XP

**Espèce:** Humain rand 91-100 (+50 XP), rand 81-90 (+25 XP). Autres races distribution similaire.

**Carrière:** Commune rand 1-40 (0 XP), rare rand 71-95 (+25 XP), très rare rand 96-100 (+50 XP).

**Étoile:** Étoile du Sorcier (+25 XP).

**Total typique:** 0 à 125 XP. Distribution: 0 XP (~50%), 25 XP (~30%), 50-75 XP (~15%), 100-125 XP (~5%).

### Affichage

**Format:** `[X] Points d'Expérience à dépenser` où X = character.xp.max - character.xp.tmp_used.

**Rafraîchissement:** Instantané après chaque +/-.

## Coûts XP

### Caractéristiques (progressif par tranche 5)

| Niveau | Coût | Niveau | Coût | Niveau | Coût |
|--------|------|--------|------|--------|------|
| 1-5 | 25 | 21-25 | 70 | 41-45 | 190 |
| 6-10 | 30 | 26-30 | 90 | 46-50 | 230 |
| 11-15 | 40 | 31-35 | 120 | 51-55 | 280 |
| 16-20 | 50 | 36-40 | 150 | 56-60 | 330 |

**Calcul:** Sommer coût chaque point entre actuel et cible. Ex: Force 0→10 = 125+150 = 275 XP.

**Total:** Base (espèce+carrière+talents+étoile) + Avances.

### Compétences (progressif par tranche 5)

| Niveau | Coût | Niveau | Coût | Niveau | Coût |
|--------|------|--------|------|--------|------|
| 1-5 | 10 | 21-25 | 40 | 41-45 | 140 |
| 6-10 | 15 | 26-30 | 60 | 46-50 | 180 |
| 11-15 | 20 | 31-35 | 80 | 51-55 | 220 |
| 16-20 | 30 | 36-40 | 110 | 56-60 | 270 |

**Types:** Basic (valeur = Caractéristique), Advanced (valeur = 0, première avance = acquisition).

**Spécialisations:** Art, Métier, Langue nécessitent popup choix. Chaque spé indépendante.

**Total:** Caractéristique + Avances.

### Talents (coût fixe)

**Formule:** Rang × 100 XP. Coût cumulatif: Rang 1 (100), Rang 2 (300 total), Rang 3 (600 total).

**Exception:** Magie du Chaos = 100 XP fixe par rang.

**Rangs:** Unique (max 1), Fixes (max 2-4), Dynamiques (formule, ex: Costaud max Bonus End), Illimités (rare).

**Prérequis:** Talents chaînés (addTalent) nécessitent parent. Bouton + désactivé si absent.

## Limitations création vs post-création

### Création (type='creation')

**Limitation:** Niveau 1 carrière uniquement (3 caractéristiques, 8 compétences, 4 talents).

**Validation:** Budget strict. XP < 0 → boutons + et Valider désactivés.

### Post-création (type='final')

**En carrière (coût normal):** Éléments accumulés niveaux atteints.

**Hors carrière (coût ×2):** Caractéristiques, compétences Basic, talents. Advanced nécessite talent addSkill.

**Validation:** Permissive, dette autorisée (gérée MJ).

## Historique dépenses

### Suivi temporaire

**tmpadvance:** Avances temporaires par élément (non persisté).

**Comportement:**
- "+": tmpadvance++, XP dépensé mis à jour
- "-": tmpadvance--, remboursement intégral
- "Annuler": tmpadvance = 0, XP restant = XP max
- "Valider": tmpadvance → permanent

### Calcul temps réel

**Algorithme refreshXP():**
1. oldValue = getAdvance() - tmpadvance
2. newValue = getAdvance()
3. cost = Helper.getXPCost(elem, oldValue, newValue)
4. multiplicateur = hors carrière ? 2 : 1
5. used += cost × multiplicateur

**Stockage:** character.xp.tmp_used = total.

## Validation budget

### Création

**XP < 0:** Budget dépassé (bloquant). Bouton Valider disabled. Bouton + disabled si used + cost > xp.max.

### Post-création

**Budget indicatif.** Validation toujours possible. XP négatif affiché mais non bloquant.

### Feedback

**Blocages silencieux:** Boutons grisés, pas messages texte. Ex: Budget 50 XP, dépensé 75 → Affichage "-25 Points d'Expérience à dépenser".

## Affichage

### Structure

**En-tête:** [Budget] Points d'Expérience à dépenser.

**Sections:** 1. Caractéristiques, 2. Talents, 3. Compétences.

**Colonnes:** Nom | Base | Aug | Coût | Total.

**Boutons:** - (remb.) | + (dépense) | Valider | Annuler.

**Organisation:** Panneau gauche (en carrière), Panneau droit (hors carrière ×2, post-création uniquement).

**Colonne Aug:** tmpadvance. **Colonne Coût:** Prochain achat (jaune), temps réel.

## Exemples

### Humain Pamphlétaire (50 XP)

**Carrière:** CT, Int, Soc / Art (Écriture), Calme, Charme, Commandement, Commérage, Intuition, Résistance, Savoir / Éloquence, Étiquette, Lisez et écrivez, Sociable.

**Options:** Int +2 (50) ou Art +5 (50) ou Int +1 (25) + Art +2 (20) + 5 restant. Talent impossible (min 100).

### Elfe Érudit (125 XP)

**Budget:** +50 espèce, +50 carrière, +25 étoile.

**Options:** Calme rang 1 (100) + Int +1 (25) ou Int +5 (125) ou Érudition +5 (50) + Langue +5 (50) + Alphabet +2 (20) + 5 restant.

### Post-création Artisan niveau 2 (500 XP)

**En carrière:** F, E, Dex, Soc, Métier (Forgeron), 8 talents.

**Options:** Force +10 (350), Métier +20 (375), Costaud rang 1 (100) + Dur à cuire rang 1 (100).

**Hors carrière (×2):** Int +5 (250), Athlétisme +10 (250), Ambidextre rang 1 (200).

## Voir aussi

**Tables:** species.md, careers.md, stars.md, careerLevels.md, characteristics.md, skills.md, talents.md.

**Règles:** calculs-xp-progression.md, progression-careerlevels.md, skills-specialisations.md, talents-rangs-multiples.md, talents-deblocage-talents.md.

**Features:** wizard-species.md, star-selection.md, resume-display.md, resume-validation.md.
