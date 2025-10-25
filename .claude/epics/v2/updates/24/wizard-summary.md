# Résumé: Wizard V1 vs V2

## Tableau comparatif rapide

| # | V1 (Référence) | V2 (Actuel) | Statut |
|---|----------------|-------------|--------|
| 1 | **Species** | Details | ⚠️ INVERSÉ |
| 2 | **Career** | Species | ⚠️ INVERSÉ |
| 3 | **Characteristics** (+Fate) | Career | ✅ |
| 4 | **Talents** | Characteristics | ✅ |
| 5 | **Skills** | Skills | ✅ |
| 6 | **Equipment** | Talents | ⚠️ INVERSÉ |
| 7 | **Details** (APRÈS race!) | Spells | ❌ NOUVEAU |
| 8 | **Experience** | Equipment | ✅ |
| 9 | **Review** | Fate | ❌ DÉJÀ dans Carac |
| - | - | Ambitions | ❌ NOUVEAU |
| - | - | Party | ❌ NOUVEAU |
| - | - | Experience | ✅ |
| - | - | Notes | ❌ NOUVEAU |
| - | - | Psychology | ❌ NOUVEAU |
| - | - | Review | ✅ |
| - | - | Complete | ❌ NOUVEAU |

## Problème CRITIQUE #1: Details avant Species

```
V1 (CORRECT):
1. Species → détermine refDetail (type racial)
2. ...
7. Details → utilise refDetail pour tables yeux/cheveux

V2 (INCORRECT):
1. Details → pas de refDetail disponible! ⚠️
2. Species → trop tard
```

**Impact:** Impossible de générer correctement l'apparence selon la race.

## Problème CRITIQUE #2: Système Random/XP manquant

| Étape V1 | Bonus XP | V2 |
|----------|----------|-----|
| Species random accepté | +20 XP | ❌ Absent |
| Career random 1er choix | +50 XP | ❌ Absent |
| Career random 2ème choix | +25 XP | ❌ Absent |
| Characteristics accepté | +50 XP | ❌ Absent |
| Characteristics réassigné | +25 XP | ❌ Absent |
| **TOTAL MAX** | **145 XP** | **0 XP** |

**Impact:** Mécanique de jeu complètement absente.

## Étapes inutiles en V2 (création initiale)

- **Spells:** Pas d'étape dédiée en V1 (inclus dans career/talents)
- **Fate:** Déjà dans Characteristics en V1
- **Ambitions:** Post-création (fiche perso)
- **Party:** Post-création (gestion de groupe)
- **Notes:** Post-création (fiche perso)
- **Psychology:** Post-création (fiche perso)
- **Complete:** Juste une page de confirmation

**Résultat:** 16 étapes au lieu de 9 nécessaires.

## Actions immédiates requises

### 1. Réordonner (2h) - URGENT ⚠️

Modifier `Creator.svelte` lignes 44-61:

```javascript
// AVANT (INCORRECT)
const steps = [
    { id: 1, name: 'Details' },    // ❌
    { id: 2, name: 'Species' },    // ❌
    ...
]

// APRÈS (CORRECT)
const steps = [
    { id: 1, name: 'Species' },    // ✅ EN PREMIER
    { id: 2, name: 'Career' },
    { id: 3, name: 'Characteristics' },
    { id: 4, name: 'Talents' },
    { id: 5, name: 'Skills' },
    { id: 6, name: 'Equipment' },
    { id: 7, name: 'Details' },    // ✅ APRÈS Species
    { id: 8, name: 'Experience' },
    { id: 9, name: 'Review' }
]
```

### 2. Implémenter Random/XP (8h) - HIGH PRIORITY

Ajouter au character model:

```javascript
character.randomState = {
    specie: 0,        // 0=none, 1=accepted(+20), -1=manual
    career: 0,        // 0=none, 1=first(+50), 2=second(+25)
    characteristic: 0 // 0=none, 1=accepted(+50), 2=reassigned(+25)
}

character.xp = {
    max: 0,    // Bonus XP gagnés
    used: 0,   // XP dépensés
    log: {}
}
```

Ajouter bouton "Lancer" à chaque étape principale.

### 3. Fusionner étapes fragmentées (4h) - MEDIUM

- Fate → intégrer dans Characteristics
- Supprimer: Ambitions, Party, Notes, Psychology, Complete
- Résultat: 9 étapes comme V1

## Ordre final recommandé

```
✅ 1. Species          (+20 XP si random)
✅ 2. Career           (+50/+25 XP si random)
✅ 3. Characteristics  (+50/+25 XP si random, inclut Fate/Resilience)
✅ 4. Talents          (avec cascade logic)
✅ 5. Skills
✅ 6. Equipment
✅ 7. Details          (APRÈS Species pour refDetail)
✅ 8. Experience       (dépenser les bonus XP)
✅ 9. Review           (validation finale)
```

## Estimation totale

**14 heures** pour corriger V2 et aligner sur V1.

## Fichiers à modifier

1. `src/routes/Creator.svelte` - Réordonner steps
2. `src/lib/characterModel.js` - Ajouter randomState, xp
3. `src/components/wizard/WizardStep1Species.svelte` - Créer (renommer Step2)
4. `src/components/wizard/WizardStep7Details.svelte` - Créer (déplacer Step1)
5. `src/components/wizard/WizardStep2Career.svelte` - Ajouter random logic
6. `src/components/wizard/WizardStep3Characteristics.svelte` - Ajouter Fate + random
7. `src/components/wizard/WizardStep8Experience.svelte` - Implémenter dépense XP

## Références rapides

**V1 Code clés:**
- `CharacterGenerator.html:8-20` - Liste des steps
- `StepSpecies.html:38-40` - Bonus +20 XP
- `StepCareers.html:33-35` - Bonus +50/+25 XP
- `StepCharacteristics.html:43-45` - Bonus +50/+25 XP
- `StepDetail.html:36-52` - Random basé sur refDetail

**V2 Code actuel:**
- `src/routes/Creator.svelte:44-61` - Steps (à corriger)
- `src/components/wizard/WizardStep1Details.svelte` - À déplacer en step 7
