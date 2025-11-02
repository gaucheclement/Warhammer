# Issue #24: Wizard V1 vs V2 - Analyse comparative

Date: 2025-10-25

## Fichiers d'analyse

### 1. wizard-summary.md (LIRE EN PREMIER) ⭐
Résumé concis avec:
- Tableau comparatif des étapes
- 2 problèmes critiques identifiés
- Actions immédiates (14h)
- Références code rapides

### 2. wizard-comparison.md (DÉTAILS COMPLETS)
Analyse détaillée avec:
- Ordre complet des étapes V1 et V2
- Explication de chaque étape
- Logique métier (Random/XP, Talent Cascade)
- 3 options de réorganisation
- Plan d'action en 4 phases (20h)

## Résumé exécutif

### Problèmes critiques

1. **Ordre incorrect** (URGENT ⚠️)
   - V2: Details (step 1) AVANT Species (step 2)
   - V1: Details (step 7) APRÈS Species (step 1)
   - Impact: Impossible de générer l'apparence selon la race

2. **Système Random/XP manquant** (HIGH)
   - V1: Jusqu'à 145 XP de bonus via random
   - V2: 0 XP (système absent)
   - Impact: Mécanique de jeu centrale manquante

### Actions immédiates

1. Réordonner les étapes (2h) - URGENT
2. Implémenter Random/XP (8h) - HIGH
3. Fusionner étapes fragmentées (4h) - MEDIUM

**Total estimé:** 14 heures

## Structure recommandée (9 étapes)

```
1. Species          → +20 XP si random
2. Career           → +50/+25 XP si random
3. Characteristics  → +50/+25 XP si random (inclut Fate)
4. Talents          → Cascade logic
5. Skills
6. Equipment
7. Details          → APRÈS Species (refDetail)
8. Experience       → Dépenser bonus XP
9. Review           → Validation finale
```

## Comparaison rapide

| Aspect | V1 | V2 |
|--------|----|----|
| Nombre d'étapes | 9 | 16 |
| Ordre Details | Étape 7 | Étape 1 ⚠️ |
| Système Random/XP | Oui (145 XP max) | Non ❌ |
| Fate/Resilience | Dans Characteristics | Étape séparée |
| Spells | Inclus ailleurs | Étape dédiée |
| Ambitions/Party/Notes/Psychology | Post-création | Dans wizard ❌ |

## Prochaines étapes

1. Lire `wizard-summary.md` pour vue d'ensemble
2. Lire `wizard-comparison.md` pour détails complets
3. Décider: Option A (strict V1), B (étendu), ou C (V2 corrigé)
4. Implémenter Phase 1 (réordonnancer) - URGENT
5. Implémenter Phase 2 (Random/XP) - HIGH

## Fichiers source analysés

### V1 (Référence)
- `CharacterGenerator.html` - Orchestrateur (lignes 8-20)
- `Character.html` - Modèle (925 lignes)
- `StepSpecies.html` - Race (+20 XP)
- `StepCareers.html` - Carrière (+50/+25 XP)
- `StepCharacteristics.html` - Attributs (+50/+25 XP)
- `StepDetail.html` - Détails (post-race, utilise refDetail)
- `StepExperience.html` - Dépense XP
- `StepResume.html` - Validation

### V2 (Actuel)
- `epic-v2/warhammer-v2/src/routes/Creator.svelte` - Wizard (16 steps)
- `epic-v2/warhammer-v2/src/components/wizard/WizardStep*.svelte` - 16 composants
- `epic-v2/warhammer-v2/src/routes/CharacterGenerator.svelte` - Port V1 alternatif

## Contacts / Questions

Pour toute question sur cette analyse, se référer aux fichiers sources ou aux commentaires dans le code V1.
