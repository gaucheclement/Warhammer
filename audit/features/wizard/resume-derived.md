# Calculs Dérivés Finaux du Personnage

## Contexte

L'écran de résumé affiche les attributs dérivés finaux calculés à partir des caractéristiques de base, bonus espèce, avances carrière, et modificateurs talents/signe astrologique.

## Mouvement

### Valeur de base

Mouvement (Mvt) défini par espèce dans species.details.mv : Humains 4, Nains 3, Elfes 5, Halflings 3, Gnomes 3, Ogres 6.

### Modificateurs et dérivés

Talents : Course à pied +1, Véloce +1 (cumulable).
Formule : Mvt final = Mvt espèce + Modificateurs talents

Dérivés :
- Marche = Mvt × 2 (yards/round déplacement normal)
- Course = Mvt × 4 (yards/round sprint)

Exemple Humain Mvt 4 : Marche 8, Course 16
Exemple Elfe avec Course à pied (5+1=6) : Marche 12, Course 24

## Blessures

### Formules par espèce

Points de Blessures (PB) selon species.details.wounds :

**Humains/Halflings :** 2×BE + BFM
**Nains :** BF + 2×BE + BFM
**Elfes/Gnomes :** 2×BE + BFM
**Ogres :** (BF + 2×BE + BFM) × 2

Bonus = Caractéristique ÷ 10 (arrondi inférieur)

### Modificateurs

Talents : Endurci +Bonus End/rang (cumulable), Dur à cuire +1 PB/rang (max Bonus End), Très fort +1 PB (via bonus F).

Formule : PB final = Formule espèce + Modificateurs talents

### Exemples

Nain de base (End 30, F 30, FM 30) : BF 3 + 2×BE 3 + BFM 3 = 12 PB

Nain End 40, Endurci rang 2 : BE 4 → +8 (rang 2), PB = BF 3 + 2×(BE 4 +4) + BFM 3 = 3 + 16 + 3 = 22 PB

## Destin et Résolution

### Destin (permanent)

Valeur initiale species.details.fate : Humains 2-4, Nains 1-3, Elfes 0-2, Halflings 2-4, Gnomes 1-2, Ogres 0.

Modificateurs : Signe astrologique ±1, Chanceux +1/rang (max Bonus FM), Né sous une bonne étoile +1.

Formule : Destin final = Valeur espèce + Modificateurs

### Fortune (consommable)

Chance = points consommables de Destin. Valeur initiale = Destin final, consommation -1 par utilisation, régénération à Destin début session.

Affichage : Chance courante / Destin max (ex: 1/3 après 2 utilisations)

## Résilience et Détermination

### Résilience (permanent)

Valeur initiale species.details.resilience : Humains 1-3, Nains 2-4, Elfes 1-2, Halflings 2-3, Gnomes 1-2, Ogres 3-5.

Modificateurs : Signe ±1, Imperturbable +1/rang (max Bonus FM).

Formule : Résilience finale = Valeur espèce + Modificateurs

### Détermination (consommable)

Identique à Fortune pour Destin : Valeur initiale = Résilience, consommation -1, régénération début session.

Affichage : Détermination courante / Résilience max

## Encombrement

### Calcul

Encombrement total = Somme trappings.enc de tous objets. Objets dans contenants (carry) peuvent avoir enc réduit.

### Limites

Limite portage = Bonus Force × 10

Seuils :
- Normal : enc ≤ Bonus F × 10 (aucune pénalité)
- Surchargé : enc > Bonus F × 10 et ≤ Bonus F × 20 (Mvt ÷2, Ag -10)
- Immobilisé : enc > Bonus F × 20 (déplacement impossible)

Exemple Humain F 30 (Bonus 3) : Normal 0-30, Surchargé 31-60, Immobilisé 61+

Résumé affiche total enc mais pas seuils/pénalités (gérés par feuille personnage).

Voir [calcul-encombrement.md](../../business-rules/calcul-encombrement.md).

## Corruption

### Valeur initiale

Tous personnages commencent à Corruption 0.

### Accumulation

Sources : Sorts Chaos (NI÷10 arrondi sup), exposition Chaos (narratif), talents Chaos, mutations.

Seuils (non affichés résumé) : 1-3 Mineure, 4-6 Modérée, 7-9 Grave, 10+ Extrême.

En création wizard : Corruption toujours 0 (aucune source possible).

## Relations

### Dépendances

- [resume-display.md](./resume-display.md) : Affichage valeurs
- [characteristics.md](./characteristics.md) : Valeurs base

### Tables

species (formules PB, Mvt/Destin/Résilience), characteristics (Bonus), talents (modificateurs), stars (modificateurs), trappings (enc).

Voir [species.md](../../database/species.md), [characteristics.md](../../database/characteristics.md), [talents.md](../../database/talents.md).

## Exemples Warhammer

Voir [exemples-personnages-types.md](../exemples-personnages-types.md) pour archétypes complets.

**Focus calculs dérivés :**

**Agitateur Humain :** Mvt 4 (Marche 8, Course 16) → PB 9 (2×BE 3 + BFM 3) → Destin 3 (base 2 + signe 1), Chance 3/3 → Résilience 2, Détermination 2/2 → Enc 5 (limite BF×10 = 30, Normal).

**Répurgateur Nain niveau 2 :** PB 13 (BF 3 + 2×BE 4 + BFM 3) avec talent Endurci potentiel (+BE/rang) → Destin 2, Résilience 4 (base Nain robuste) → Mvt 3 (Marche 6, Course 12).

**Sorcier Elfe Azyr :** Mvt 5 (base Elfe) potentiellement +1 avec talent Véloce → PB 10 (2×BE 3 + BFM 4) → Destin 1, Résilience 2 (base Elfe faible).

**Halfling Bourgeois :** PB 6 (2×BE 2 + BFM 2) → Fragile mais Destin 2, Résilience 3 compensent → Mvt 3 → Enc faible (F 10, BF 1 → limite 10).

**Surchargé :** Enc > Bonus F × 10 → Pénalités Mvt ÷2, Ag -10 → Résumé affiche enc total, calcul pénalités interne feuille personnage.

**Corruption :** Toujours 0 en création wizard (sources externes uniquement post-création).
