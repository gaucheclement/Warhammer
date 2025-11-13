# Character Model - Calculs et Attributs Dérivés

## Objectif

Règles métier pour le calcul des valeurs finales, attributs dérivés, application effets talents et gestion XP.

## Calcul Caractéristiques

### Valeur initiale

Valeur espèce + roll 2d10 + bonus signe astral + bonus talents.

Exemple : Humain CC=30, Nain E=40.

### Avances

Avances permanentes (XP dépensé) + Avances temporaires (en test, annulables).

### Valeur finale

Valeur initiale + Total avances.

Bonus = Valeur finale ÷ 10 arrondi bas.

## Calcul Compétences

Valeur base (= valeur caractéristique liée) + Avances (permanentes + temporaires).

Bonus = Valeur finale ÷ 10 arrondi bas.

Voir [../../database/skills.md](../../database/skills.md) pour caractéristiques liées.

## Calcul Talents

Rang actuel (permanentes + temporaires) ≤ Rang maximum.

Maximum selon type : Fixe, Formule (ex: Bonus caractéristique), ou Illimité.

Voir [../../business-rules/talents-effets-mecanismes.md](../../business-rules/talents-effets-mecanismes.md).

## Application Effets Talents

Recalcul automatique à chaque changement talent.

Types effets :
- Bonus caractéristique (ex: Résistant +5E par rang)
- Ajout compétence (ex: Linguistique → Langue)
- Ajout sorts (ex: Béni → bénédictions dieu)
- Ajout talent (ex: Savoirs Histoire → Lire/Écrire)

Nettoyage : Si talent perdu et aucune autre origine, éléments ajoutés supprimés.

Voir [../../business-rules/talents-effets-mecanismes.md](../../business-rules/talents-effets-mecanismes.md).

## Attributs Dérivés

### Mouvement

Base espèce + modificateurs talents (Véloce, armure lourde).

### Points de Blessures

Formule selon espèce :
- Humain/Elfe/Halfling : (BE × 2) + BFM
- Nain : BF + (BE × 2) + BFM
- Ogre : ((BF + (BE × 2) + BFM) × 2)

Modificateurs : Robuste +BE/rang, Dur à Cuire +BE/rang.

Minimum : 1 PB.

### Destin et Résilience

Chance = Destin total. Détermination = Résilience total.

### Corruption

BE + BFM (seuil résistance Chaos).

### Encombrement

Limite = BF + BE.

Actuel = Σ(quantité × enc unitaire).

États : Normal (≤ limite), Encombré (> limite, malus).

## Gestion XP

### Budget

XP Maximale = XP départ + XP gagnées.
XP Disponible = XP Max - XP Utilisée - XP Temporaire.

### Coûts

Caractéristiques : 25 XP/avance.
Compétences : 10 XP/avance.
Talents : 100 XP/rang.

Multiplicateur ×2 si hors carrière.

Voir [../../business-rules/calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md).

### Avances Temporaires

Phase test avant validation définitive.

Workflow : Test → Validation (permanent) OU Annulation (reset).

## Voir aussi

- [character-structure.md](./character-structure.md) - Structure données personnage
- [character-mutations.md](./character-mutations.md) - Ajout et modification éléments
- [../../business-rules/talents-effets-mecanismes.md](../../business-rules/talents-effets-mecanismes.md) - Détails effets talents
- [../../business-rules/calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md) - Formules coûts XP
- [../../database/characteristics.md](../../database/characteristics.md) - Table caractéristiques
- [../../patterns/pattern-modificateurs-caracteristiques.md](../../patterns/pattern-modificateurs-caracteristiques.md) - Application modificateurs
