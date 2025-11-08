# Wizard Talents - Gestion rangs multiples

## Vue d'ensemble

Talents acquérables plusieurs fois (rangs). Affichage rang actuel vs max, acquisition séquentielle, effets cumulatifs.

## Types rangs

### Unique (max=1)

Acquis 1 fois. Ex: "Béni", "Affable", "Caïd"

### Fixes (max=nombre)

Max défini. Ex: "Ambidextre" (max 2)

### Dynamiques (max=formule)

Max calculé depuis bonus carac. Ex: "Artiste" (max Bonus Dex)

**Formules**: "Bonus d'Agilité", "Bonus de Dextérité", "Bonus de Force"...

**Calcul**: Bonus = floor(carac / 10), évolution si carac augmente

### Illimités (max="Aucun")

Pas limite théorique (rare)

**Voir**: [talents-rangs-multiples.md](../../business-rules/talents-rangs-multiples.md)

## Acquisition création

### Règles

**Séquentiel**: Rangs acquis ordre (rang 1 avant rang 2)

**Création**: Généralement rang 1 uniquement à création

**Exception**: Doublons sources (espèce + carrière) → cumul possible

## Affichage wizard

### Format simple

**Nom**: "Chanceux"

**Info rang**: "(Rang 1)" ou "1/3" si max connu

### Doublons sources

Talent présent espèce ET carrière.

**Exemple**: "Lire/Écrire" racial + "Lire/Écrire" carrière

**Traitement**:
- Max=1: Déduplication, marqué acquis espèce, 1 seul affiché
- Rangs multiples: 2 rangs acquis, affiché "Lire/Écrire (Rang 2)" ou "2/X"

### Indicateurs visuels

**Badge rang**: "×2" ou "Rang 2"

**Barre progression** (optionnel): 2/5 rangs

**Couleur**: Rang 1 normal, rangs multiples surligné

## Exemples

**Ambidextre (max 2)**: Rang 1 → -10 pénalité (vs -20), Rang 2 → Aucune pénalité. Affichage: "Ambidextre (Rang 1)"

**Artiste (max Bonus Dex)**: Dex 35 → Bonus 3 → Max 3. Acquisition "Artiste (Peinture)" → "1/3". Si Dex→42: max devient 4

**Chanceux (max Bonus Chance)**: Chance 10 → Bonus 1 → Max 1. Acquisition signe → "Chanceux 1/1"

## Interactions spécialisations

Même talent, spés différentes = rangs différents.

**Exemple**: Acquisition "Artiste (Peinture)" puis "Artiste (Sculpture)"

**Comptage**: 2 talents distincts, chacun compte pour max global

**Limite**: Total toutes spés ≤ max talent

**Cas**: Artiste max 3, possède "Peinture" et "Sculpture" → Peut acquérir 1 autre spé

**Voir**: [talents-specialization.md](./talents-specialization.md)

## Validation

### Vérifications création

**Rang 1 obligatoire**: Pas acquisition rang 2 sans rang 1

**Max respecté**: Rang actuel ≤ max calculé

**Formule valide**: Si max dynamique, carac existe et valeur connue

### Erreurs

**Dépassement max**: "Vous avez atteint le maximum pour [Talent]"

**Formule invalide**: "Impossible calculer max pour [Talent]" (erreur données)

**Rang manquant**: "Rang précédent requis" (création normalement rang 1 seulement)

## Cumul effets

**Additif**: Bonus chaque rang s'ajoutent. Ex: "Bonnes jambes" 3 rangs → +3 DR sauts

**Progressif**: Chaque rang améliore. Ex: "Ambidextre" rang 1 (-10) puis rang 2 (0)

**Seuil**: Rangs débloquent effets spécifiques selon niveau

**Voir**: [talents-effects.md](./talents-effects.md)

## Affichage récapitulatif

**Section "Talents possédés"**:
- Costaud
- Chanceux (Rang 1)
- Artiste (Peinture) 1/3
- Lire/Écrire (acquis 2 fois: espèce + carrière) → Afficher "Lire/Écrire 2/X" ou "(Rang 2)"

**Total talents**: 4 talents (ou 3 + 1 rang supplémentaire selon comptage)

## Cas particuliers

**Max dynamique**: Formule basée carac actuelles (espèce + signe). Évolution post-création gérée advancement

**Max="Aucun"**: Affichage "Talent (Rang 1)" sans "/X" (rare)

**Triple sources**: Espèce + Signe + Carrière même talent (très rare) → Max=1: dédup, Rangs: 3 rangs si max ≥3

## Workflow

### Phase 1: Collecte

1. Parsing talents 3 sources (espèce, signe, carrière)
2. Identification doublons (même label, même spé)
3. Comptage occurrences par talent

### Phase 2: Vérification max

1. Récupération champ `max` talent
2. Si formule: calcul depuis caractéristiques actuelles
3. Si nombre: utilisation directe
4. Comparaison rangs acquis vs max

### Phase 3: Affichage

1. Déduplication si max=1
2. Cumul rangs si max >1
3. Construction label affiché: "Nom (Rang X)" ou "X/Max"
4. Indicateurs visuels

### Phase 4: Attribution

1. Ajout talent personnage avec rang
2. Application effets × rang
3. Stockage rang actuel

## Voir aussi

- [talents-rangs-multiples.md](../../business-rules/talents-rangs-multiples.md) - Règles métier complètes
- [talents.md](../../database/talents.md) - Champ max
- [talents-specialization.md](./talents-specialization.md) - Spés comptent séparément
- [talents-effects.md](./talents-effects.md) - Cumul effets
