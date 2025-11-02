---
issue: 24
stream: 1 - Corriger Ordre des Étapes
priority: P0
started: 2025-10-25T08:45:00Z
completed: 2025-10-25T10:15:00Z
status: completed
---

# Stream 1: Corriger l'Ordre des Étapes

## Objectif
Réorganiser les étapes du wizard V2 pour que Details soit APRÈS Species (comme V1).

## Problème Actuel
```
V2 ACTUEL (INCORRECT):
1. Details (yeux, cheveux) → Pas de refDetail disponible ❌
2. Species → Trop tard

V1 CORRECT:
1. Species → Détermine refDetail
...
7. Details → Utilise refDetail pour générer apparence selon race ✅
```

## Tâches

### 1. Analyser l'ordre actuel dans Creator.svelte
- [x] Lire Creator.svelte (lignes 44-61)
- [x] Documenter l'ordre actuel des 16 étapes
- [x] Identifier les fichiers à renommer
- [x] Créé: `.claude/epics/v2/updates/24/current-step-order.md`

### 2. Réordonner le tableau steps
- [x] Modifier Creator.svelte
- [x] Mettre Species en position 1
- [x] Mettre Details en position 7 (après Career, Characteristics, etc.)
- [x] Ajuster les IDs et chemins

### 3. Renommer les composants
- [x] WizardStep1Details.svelte → WizardStep7Details.svelte
- [x] WizardStep2Species.svelte → WizardStep1Species.svelte
- [x] WizardStep3Career.svelte → WizardStep2Career.svelte
- [x] WizardStep4Characteristics.svelte → WizardStep3Characteristics.svelte
- [x] WizardStep5Skills.svelte → WizardStep4Skills.svelte
- [x] WizardStep6Talents.svelte → WizardStep5Talents.svelte
- [x] WizardStep8Equipment.svelte → WizardStep6Equipment.svelte
- [x] WizardStep7Spells.svelte → WizardStep8Spells.svelte

### 4. Mettre à jour les imports
- [x] Modifier Creator.svelte pour importer les fichiers renommés
- [x] Vérifier qu'aucun import cassé

### 5. Tester
- [x] La navigation fonctionne
- [x] L'ordre est correct: Species → ... → Details
- [x] Aucune régression

## Fichiers Modifiés
- warhammer-v2/src/routes/Creator.svelte (84 lignes modifiées)
- 8 wizard components renommés (100% renames tracked by git)

## Critères de Succès
- [x] Species est l'étape 1
- [x] Details est l'étape 7
- [x] Navigation fonctionne entre toutes les étapes
- [x] Aucun import cassé
- [x] Commit créé (6326fcd)

## Durée Réelle
1h 30m (meilleur que prévu: 2h estimées)

## Commit
**Hash**: 6326fcd
**Branch**: epic/v2
**Message**: Issue #24: Stream 1 - Fix wizard step order (Species first, Details after)

## Résultat

### Ordre Final des Étapes

| Step # | Name | Component | Changed? |
|--------|------|-----------|----------|
| 1 | Species | WizardStep1Species.svelte | ✅ Moved from step 2 |
| 2 | Career | WizardStep2Career.svelte | ✅ Moved from step 3 |
| 3 | Characteristics | WizardStep3Characteristics.svelte | ✅ Moved from step 4 |
| 4 | Skills | WizardStep4Skills.svelte | ✅ Moved from step 5 |
| 5 | Talents | WizardStep5Talents.svelte | ✅ Moved from step 6 |
| 6 | Equipment | WizardStep6Equipment.svelte | ✅ Moved from step 8 |
| 7 | Details | WizardStep7Details.svelte | ✅ Moved from step 1 |
| 8 | Spells | WizardStep8Spells.svelte | ✅ Moved from step 7 |
| 9 | Fate | WizardStep9Fate.svelte | No change |
| 10 | Ambitions | WizardStep10Ambitions.svelte | No change |
| 11 | Party | WizardStep11Party.svelte | No change |
| 12 | Experience | WizardStep12Experience.svelte | No change |
| 13 | Notes | WizardStep13Notes.svelte | No change |
| 14 | Psychology | WizardStep14Psychology.svelte | No change |
| 15 | Review | WizardStep15Review.svelte | No change |
| 16 | Complete | WizardStep16Complete.svelte | No change |

### Impact

**FIXED**: Critical bug where Details step ran before Species was selected.

**NOW**: Details step (7) can safely access `character.species.refDetail` to generate race-specific appearance (eyes, hair, etc.) because Species is selected in step 1.

### Git Stats
```
9 files changed, 42 insertions(+), 42 deletions(-)
8 files renamed (100% similarity tracked)
```

## Next Steps

Stream 2 (Random/XP System) can now begin:
- Implement random generation with XP bonuses
- Species: +20 XP for accepting random
- Career: +50 XP (1st choice) or +25 XP (2nd choice)
- Characteristics: +50 XP (accepted) or +25 XP (reassigned)

## Notes

- Used two-phase rename strategy to avoid file name conflicts
- All renames tracked correctly by git (100% similarity)
- No functionality changes to individual components
- Only orchestration logic in Creator.svelte updated
- Pre-existing build error in CharacterSheet.svelte (unrelated to this stream)
