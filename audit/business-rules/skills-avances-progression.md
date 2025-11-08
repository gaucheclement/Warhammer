# Système d'Avances et Progression des Compétences

## Vue d'ensemble

Les compétences dans Warhammer Fantasy Roleplay progressent par **avances**. Chaque avance augmente la valeur de test de la compétence de 1%. Un personnage peut acquérir des avances de multiples sources et les faire progresser en dépensant de l'XP.

## Composantes d'une compétence

### Valeur de base

**Définition** : Valeur de la caractéristique associée à la compétence.

**Calcul** : Caractéristique totale du personnage (incluant espèce, lancé initial, étoile, talents, avances de caractéristique).

**Exemple** :
- Compétence "Art" liée à "Dextérité"
- Personnage avec Dextérité totale = 35
- Valeur de base de "Art" = 35

### Avances cumulées

**Sources d'avances** :
- **Espèce** (specie) : Avances données lors de la création (3 skills à +5, 3 skills à +3)
- **Carrière** (career) : Avances données lors de la création (40 points à répartir, max 10 par skill)
- **Progression XP** (advance) : Avances achetées avec l'XP après création
- **Temporaires** (tmpadvance) : Avances provisoires (utilisées lors de transitions)

**Calcul total des avances** :
```
Avances totales = specie + career + advance + tmpadvance
```

### Valeur finale de test

**Formule** :
```
Valeur de test = Caractéristique totale + Avances totales
```

**Exemple complet** :
- Personnage : Dextérité 35
- Compétence "Art (Peinture)" : specie +5, career +8, advance +12
- Avances totales = 5 + 8 + 12 = 25
- Valeur de test = 35 + 25 = 60%
- Test : lancer 1d100, réussir si ≤ 60

### Bonus de compétence

**Calcul** : `Math.floor(Valeur de test / 10)`

**Utilité** : Certaines règles utilisent le bonus plutôt que la valeur brute.

**Exemple** :
- Valeur de test = 67
- Bonus = Math.floor(67 / 10) = 6

## Système de coûts XP

### Coûts par paliers (compétences)

Les avances coûtent de plus en plus cher à mesure que la compétence progresse :

| Avances | XP/av | Total palier | Avances | XP/av | Total palier |
|---------|-------|--------------|---------|-------|--------------|
| 1-5 | 10 | 50 | 36-40 | 110 | 550 |
| 6-10 | 15 | 75 | 41-45 | 140 | 700 |
| 11-15 | 20 | 100 | 46-50 | 180 | 900 |
| 16-20 | 30 | 150 | 51-55 | 220 | 1100 |
| 21-25 | 40 | 200 | 56-60 | 270 | 1350 |
| 26-30 | 60 | 300 | 61-65 | 320 | 1600 |
| 31-35 | 80 | 400 | 66-70 | 380 | 1900 |

**Coûts cumulatifs** : 0→10: 125 XP, 0→20: 375 XP, 0→30: 975 XP, 0→40: 2025 XP, 0→50: 3525 XP, 0→70: 9975 XP

### Multiplicateur carrière

**Règle** : Le coût XP dépend de si la compétence est dans la carrière actuelle.

**Compétence de carrière** (in-career) :
- Coût normal selon le tableau ci-dessus

**Compétence hors carrière** (out-of-career) :
- Coût × 2 (doublé)

**Vérification** : Une compétence est "de carrière" si elle apparaît dans l'un des niveaux de la carrière actuelle.

**Exemple** :
- Avance 15 → 16 pour une compétence de carrière : 30 XP
- Avance 15 → 16 pour une compétence hors carrière : 60 XP

### Réductions de coût

**Principe** : Certaines sources peuvent réduire le coût d'une avance.

**Stockage** : Champ `reduced` sur la compétence.

**Application** : Soustrait du coût calculé.

**Exemple** :
- Coût normal : 30 XP
- Réduction : 10 XP
- Coût final : 20 XP

## Règles de progression

### Limites d'avances initiales

**Lors de la création** :
- Avances d'espèce : 3 skills à +5, 3 skills à +3 (fixes)
- Avances de carrière : 40 points à répartir, maximum 10 par compétence

**Après création** : Aucune limite théorique, limité uniquement par l'XP disponible.

### Progression post-création

**Acquisition** :
1. Identifier la compétence à faire progresser
2. Vérifier si elle est de carrière ou hors carrière
3. Calculer le coût selon le palier actuel et le multiplicateur
4. Dépenser l'XP
5. Incrémenter les avances de +1

**Progression incrémentale** : On ne peut acheter qu'une avance à la fois, pas de "sauts".

**Exemple de progression** :
- "Athlétisme" à 18 avances (hors carrière)
- Passer à 19 coûte : 30 XP × 2 = 60 XP
- Passer à 20 coûte : 30 XP × 2 = 60 XP
- Passer à 21 coûte : 40 XP × 2 = 80 XP

### Log XP

**Traçabilité** : Chaque dépense XP est enregistrée dans un log.

**Format** : "Type: Nom avance_ancienne => avance_nouvelle, coût XP"

**Exemple** : "Compétence: Art (Peinture) 15 => 16, -30 XP"

**Utilité** : Historique de progression, vérification, annulation possible.

## Cas particuliers

### Compétences groupées

**Règle** : Chaque spécialisation est une compétence distincte avec sa propre progression.

**Exemple** :
- "Art (Peinture)" à +20
- "Art (Sculpture)" à +5
- Deux progressions totalement indépendantes

### Compétences de base vs avancées

**Type de compétence** : N'affecte PAS le coût de progression.

**Différence** :
- Type "base" : accessible à tous sans carrière
- Type "avancée" : nécessite une carrière pour acquisition initiale

**Progression** : Une fois acquise, le coût XP est identique (seul le statut de carrière compte).

### Compétences ajoutées par talents

**Acquisition** : Certains talents donnent accès à de nouvelles compétences.

**Progression** : Ces compétences progressent normalement selon les règles ci-dessus.

**Statut de carrière** : Généralement considérées hors carrière sauf si elles apparaissent aussi dans les niveaux de carrière.

## Exemples de calculs

**Ex 1 - Création** : Humain Soldat, Dex 30, alloue +7 à "Athlétisme" → valeur 30+7 = 37%

**Ex 2 - Progression de carrière** : "Athlétisme" +7→+15 (8 avances) = 45 XP (palier 6-10) + 100 XP (palier 11-15) = 145 XP total, valeur finale 45%

**Ex 3 - Hors carrière** : "Art (Peinture)" Dex 30, achète 5 avances hors carrière = 5×10×2 = 100 XP (vs 50 si de carrière), valeur 35%

## Relations avec autres tables

**Characteristics** (voir audit/database/characteristics.md) : Chaque skill utilise une caractéristique comme base. Augmenter Dex de 30→35 augmente toutes les compétences Dex de +5.

**Species** (voir audit/database/species.md) : Espèce définit avances initiales (+5 et +3), non modifiables après choix.

**Careers** (voir audit/database/careers.md) : 40 points de carrière à répartir (max 10/skill). Détermine statut de carrière (×1 ou ×2 coût XP).

**Talents** (voir audit/database/talents.md) : Ajoutent compétences à 0 avances, peuvent réduire coûts (`reduced`), affectent caractéristiques indirectement.

**Système XP** (voir audit/business-rules/calculs-xp-progression.md) : Avances consomment budget XP, toutes dépenses tracées dans log.
