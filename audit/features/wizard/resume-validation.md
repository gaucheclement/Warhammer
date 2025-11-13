# Vérification Cohérence du Personnage

## Contexte

L'écran de résumé effectue une vérification de cohérence globale du personnage avant validation finale. Cette validation garantit que toutes les étapes obligatoires sont complétées et que le personnage est viable selon les règles Warhammer.

## Système de validation

### Contrôle d'étape

**Bouton "Valider"** :
- Activé : Si toutes les étapes sont complétées et on est sur l'écran résumé
- Désactivé : Si des étapes précédentes sont incomplètes
- Caché : Si la création est déjà finalisée

### Dépendances d'étapes

**Étapes obligatoires :** Species, Characteristics, Careers, Talents (1 choisi carrière), Skills (distribution espèce + carrière), Trappings (équipement départ), Detail (nom, âge, taille, etc.), Experience (XP cohérente).

**Étapes optionnelles :** Stars (signe astrologique), Sorts (selon talents magiques).

## Validations implicites

### Caractéristiques

Formule validée : Total = Init espèce + Avances carrière + Modificateurs (signe + talents)

Exemple Nain : CC 30 (init) + 5 (avances) = 35 total

### Compétences

- Base : Toutes présentes avec minimum valeur caractéristique + avances espèce si applicable
- Acquises : Compétences careerLevel.skills présentes avec spécialisation définie si groupée

### Talents

**Vérifications** :
- Rang minimum 1 (talents avec 0 avances non affichés)
- Rang maximum respecté (unique: max 1, fixes: max 2-4, dynamiques: selon bonus, illimités: aucune limite)
- 1 talent de son rang de carrière choisi (création uniquement)
- Chaînes respectées (ex: Flagellant nécessite Frénésie)

### Trappings

**Équipement requis** :
- Trappings classe sociale (niveau 1)
- Trappings carrière niveau 1
- Trappings niveaux supérieurs si progression

**Encombrement** : Total ≤ Bonus Force × 10 (recommandation, pas bloquant)

### XP

**Cohérence** :
- XP Maximale = XP Actuelle + XP Dépensée
- XP Maximale = XP espèce + XP carrière + bonus aléatoires + bonus signe
- XP Dépensée = somme des coûts

**Exemple** : Nain Agitateur 20+20+25 = 65 XP max, 0 dépensé, 65 disponible

### Magie

**Si sorts présents :**
- Talent magique correspondant obligatoire (Béni/Magie des Arcanes/Magie du Chaos)
- Domaine spécialisé cohérent avec type sorts
- Dieu sélectionné si sorts Béni

**Si aucun sort :** Onglet Sorts masqué, talents magiques autorisés (préparation future)

## Messages et blocages

### Blocages silencieux

**Pas de messages d'erreur** : Le système ne génère pas de messages textuels.

**Validation visuelle** :
- Bouton désactivé si étapes incomplètes
- Protection des données lors de la validation
- Vérifications automatiques affichées dans le résumé

Aucun message n'explique pourquoi bouton désactivé.

## Validation finale

### Action de validation

Clic "Valider" déclenche :
1. stepIndex changé à -1 (marque terminé)
2. Appel defaultAction.validate(oThat, number)
3. Retour menu principal (showMenu())

Action IRRÉVERSIBLE : stepIndex = -1 empêche modifications via wizard.

### Distinction sauvegarde

Validation ne sauvegarde PAS automatiquement :
- Bouton "Valider" : Termine wizard, retour menu
- Bouton "Sauvegarder" : Sauvegarde base (séparé, avant ou après validation)

Voir [resume-save.md](./resume-save.md) pour sauvegarde.

## Relations

### Dépendances

- [resume-display.md](./resume-display.md) : Affichage données validées
- [resume-derived.md](./resume-derived.md) : Calculs dérivés vérifiés
- Étapes wizard #086-#139 (toutes)

### Tables impliquées

species (valeurs init), careers/careerLevels (avances obligatoires), characteristics (formules), skills/talents (listes acquises), trappings (équipement), stars (modificateurs).

Voir [species.md](../../database/species.md), [careers.md](../../database/careers.md), [careerLevels.md](../../database/careerLevels.md).

## Règles métier

### Ordre de validation

Validations appliquées dans ordre étapes wizard : Species → Characteristics → Careers → Stars → Talents → Skills → Trappings → Detail → Experience. Incohérence dans étape antérieure bloque validation finale.

### Tolérance

**Tolérés :**
- Encombrement > limite (avertissement visuel possible, pas blocage)
- Détails personnels vides (valeurs par défaut)
- Talents magiques sans sorts (préparation future)

**Bloquants :**
- Absence race ou carrière
- Talent carrière non choisi (1 de son rang) ou compétences espèce/carrière non distribuées
- XP totale incohérente

## Exemples Warhammer

Voir [exemples-personnages.md](../exemples-personnages.md) pour archétypes complets.

**Focus validation cohérence :**

**Validation réussie (Agitateur Humain) :** Étapes Species, Characteristics, Careers, Detail complètes → Talents Orateur, Rompu aux armes acquis → Compétences niveau 1 présentes → XP cohérente (40 totale = 20 espèce + 20 carrière) → Bouton "Valider" activé → Clic termine wizard.

**Blocage nom manquant (Répurgateur Nain) :** Étapes complètes sauf Detail (nom vide) → stepIndex reste sur Detail → Résumé affiché mais bouton "Valider" désactivé → Retour étape Detail nécessaire.

**Talent magique toléré (Sorcier Elfe) :** Talent Magie des Arcanes (Azyr) rang 1 présent → Liste sorts vide → Validation autorisée (sorts acquis ultérieurement) → Onglet Sorts affiche domaine Azyr sans sorts.

**Blocage talent obligatoire :** Carrière requiert talent spécifique → Talent manquant → stepIndex bloqué Talents → Bouton désactivé jusqu'à acquisition.

**Incohérence XP tolérée (Halfling) :** XP totale 50, dépensée 25, actuelle affichée 30 (devrait être 25) → Calcul interne corrige automatiquement → Validation possible.
