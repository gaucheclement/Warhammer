# Talents - Modification Caractéristiques

## Vue d'ensemble

Système de modification de caractéristiques via champ `addCharacteristic`. Certains talents augmentent valeurs des caractéristiques du personnage de manière permanente.

## Mécanisme addCharacteristic

### Fonctionnement

**Champ addCharacteristic**: nom exact de la caractéristique modifiée

**Effet**: bonus permanent ajouté à la valeur de la caractéristique

**Application**: bonus calculé selon caractéristique et nombre de rangs talent

**Permanence**: modification active tant que talent possédé

## Calcul des bonus

### Points de Blessures

**Formule**: +Bonus d'Endurance par rang

**Exemple**: talent rang 1, Endurance 42 (Bonus 4) → +4 Points Blessures

**Recalcul**: si Bonus End change, PB recalculés

### Mouvement, Chance, Détermination, Corruption

**Formule**: +1 par rang

**Exemple**: "Chanceux" rang 3 → +3 Points de Chance maximum

**Cumul**: chaque rang ajoute exactement +1

### Autres caractéristiques

**Formule**: +5 par rang

**Exemples**:
- Affable (Sociabilité): +5 permanent
- Très fort (Force): +5 permanent
- Réflexes foudroyants (Agilité): +5 permanent

**Application**: bonus ajouté à caractéristique de départ (avant augmentations)

## Caractéristiques modifiables

### Caractéristiques principales

**Capacité de Combat (CC)**: augmente compétence mêlée

**Capacité de Tir (CT)**: augmente compétence tir

**Force (F)**: augmente dégâts, capacité porter

**Endurance (E)**: augmente résistance, Points Blessures

**Initiative (I)**: augmente réactivité, initiative combat

**Agilité (Ag)**: augmente esquive, coordination

**Dextérité (Dex)**: augmente précision, artisanat

**Intelligence (Int)**: augmente apprentissage, savoirs

**Force Mentale (FM)**: augmente volonté, résistance mentale

**Sociabilité (Soc)**: augmente charisme, influence sociale

### Caractéristiques dérivées

**Points de Blessures (PB)**: résistance dégâts

**Mouvement (M)**: distance déplacement

**Chance**: points utilisables pour relances

**Détermination**: points pour résistance traumatismes

**Corruption**: seuil tolérance au Chaos

## Exemples de talents

### Affable (Sociabilité +5)

**Effet**: +5 permanent Sociabilité dès acquisition

**Max**: 1 rang

**Impact**: améliore tous tests sociaux basés Sociabilité

### Chanceux (Chance +1)

**Effet**: +1 Point de Chance maximum par rang

**Max**: Bonus de Sociabilité

**Impact**: personnage peut stocker plus de Points de Chance

**Progression**: Soc 35 (Bonus 3) → max 3 rangs → +3 Chance

### Âme pure (Corruption +1)

**Effet**: +1 Point de Corruption toléré par rang

**Max**: Bonus de Force Mentale

**Impact**: peut accumuler plus Corruption avant tests

**Utilité**: résistance influences Chaos

### Très fort (Force +5)

**Effet**: +5 permanent Force par rang

**Max**: Bonus de Force (avant modification)

**Impact**: Force 30 base (Bonus 3) → max 3 rangs → Force finale 45

## Interaction avec progression

### Bonus calculés

Bonus d'une caractéristique = Math.floor(valeur / 10)

**Modification recalcule bonus**:
- Sociabilité 34 (Bonus 3) + Affable (+5) → Soc 39 (Bonus 3 toujours)
- Sociabilité 36 (Bonus 3) + Affable (+5) → Soc 41 (Bonus 4 maintenant)

### Impact augmentations

Talents ajoutent aux caractéristiques de base

Augmentations de carrière s'ajoutent ensuite

**Ordre calcul**:
1. Base espèce
2. Tirage aléatoire
3. Bonus talents (addCharacteristic)
4. Bonus étoile
5. Augmentations carrière

### Synergie rangs multiples

Talents rangs dynamiques (max = formule Bonus)

Augmenter caractéristique → augmente max rangs → peut acquérir rangs supplémentaires → augmente caractéristique → cycle vertueux

**Exemple**: Très fort
- For 30 base → Bonus 3 → max 3 rangs
- 3 rangs → For 45 → Bonus 4
- Mais max reste 3 (calculé sur base, pas valeur modifiée)

## Validation et cohérence

### Vérifications

**Nom caractéristique valide**: addCharacteristic doit matcher nom dans characteristics.json

**Pas de doublons**: un talent ne peut modifier qu'une seule caractéristique

**Calcul cohérent**: vérifier formule bonus appliquée correctement

### Cas d'erreur

**Caractéristique inconnue**: addCharacteristic = "Toto" → erreur

**Formule incohérente**: "Très fort" avec addCharacteristic vide → incohérence

**Cumul illimité**: vérifier max respecté

## Impact gameplay

**Boost permanent**: modification définitive si talent conservé

**Build optimization**: cibler talents modifiant caracs clés du concept

**Seuils critiques**: passer seuils bonus (30→35→40) via talents

**Synergies**: talents modifiant carac + talents rangs basés sur cette carac
