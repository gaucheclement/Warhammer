---
issue: 24
epic: v2
analyzed: 2025-10-25T08:30:00Z
revised: 2025-10-25T08:30:00Z
approach: improve-existing-v2
streams: 3
parallel: false
---

# Issue #24 Analysis (REVISED): Verify & Fix Character Generation Pipeline

## Révision de l'approche

**Approche initiale (INCORRECTE)**: Recréer un nouveau wizard en portant V1 → V2
**Problème découvert**: V2 a déjà un wizard complet (16 étapes) créé pour issue #10
**Nouvelle approche (CORRECTE)**: Améliorer le wizard V2 existant avec les bonnes pratiques de V1

## Analyse comparative V1 vs V2

### État Actuel

**V1 (Root - Référence)**:
- 9 étapes logiques et bien ordonnées
- Système random avec bonus XP (+145 XP max)
- Ordre correct: Species → Career → ... → Details (après race)
- Logique métier complexe (talent cascade, XP, validations)

**V2 (Epic-v2 - Existant)**:
- 16 étapes (trop granulaire)
- ❌ Ordre incorrect: Details AVANT Species
- ❌ Système random/XP complètement absent
- ✅ Architecture Svelte moderne
- ✅ Composants réutilisables

### Problèmes Critiques Identifiés

#### 1. 🚨 Ordre des étapes incorrect (BLOQUANT)

```
V2 ACTUEL (INCORRECT):
1. Details (yeux, cheveux) → ❌ Pas de refDetail disponible
2. Species → Trop tard

V1 RÉFÉRENCE (CORRECT):
1. Species → Détermine refDetail (tables raciales)
...
7. Details → Utilise refDetail pour yeux/cheveux corrects
```

**Impact**: Impossible de générer l'apparence selon la race.

#### 2. 🚨 Système Random/XP manquant (CRITIQUE)

| Étape | Bonus XP V1 | V2 |
|-------|-------------|-----|
| Species random accepté | +20 XP | ❌ 0 |
| Career random 1er choix | +50 XP | ❌ 0 |
| Career random 2ème choix | +25 XP | ❌ 0 |
| Characteristics accepté | +50 XP | ❌ 0 |
| Characteristics réassigné | +25 XP | ❌ 0 |
| **TOTAL** | **145 XP** | **0 XP** |

**Impact**: Mécanique de jeu centrale complètement absente.

#### 3. ⚠️ Trop d'étapes fragmentées

V2 a 16 étapes au lieu des 9 essentielles de V1:
- Étapes inutiles en création: Ambitions, Party, Notes, Psychology, Complete
- Étapes à fusionner: Fate (dans Characteristics), Spells (dans Talents/Career)

## Nouveau Plan d'Action

### Objectif
Améliorer le wizard V2 existant pour atteindre la parité fonctionnelle avec V1, tout en gardant l'architecture Svelte moderne.

### 3 Streams Séquentiels (Non-Parallèles)

#### Stream 1: Corriger l'Ordre des Étapes (URGENT)
**Priorité**: P0 - Bloquant
**Durée**: 2 heures
**Dépendances**: Aucune

**Objectif**: Réorganiser les étapes pour que Details soit APRÈS Species.

**Tâches**:
1. Modifier `Creator.svelte` (lignes 44-61) - Réordonner le tableau steps
2. Renommer les composants:
   - `WizardStep1Details.svelte` → `WizardStep7Details.svelte`
   - `WizardStep2Species.svelte` → `WizardStep1Species.svelte`
   - (et tous les autres en conséquence)
3. Mettre à jour les imports dans Creator.svelte
4. Tester la navigation entre étapes

**Fichiers à modifier**:
```
warhammer-v2/src/routes/Creator.svelte
warhammer-v2/src/components/wizard/WizardStep*.svelte (renommer)
```

**Résultat attendu**: Ordre correct → Species en premier, Details en 7ème.

**Critères de succès**:
- [ ] Species est l'étape 1
- [ ] Details est l'étape 7 (après Species)
- [ ] Navigation fonctionne
- [ ] Aucune régression sur les autres étapes

---

#### Stream 2: Implémenter Système Random/XP (HAUTE PRIORITÉ)
**Priorité**: P0 - Fonctionnalité critique
**Durée**: 8 heures
**Dépendances**: Stream 1 terminé

**Objectif**: Ajouter le système de génération aléatoire avec bonus XP de V1.

**Phase 2.1: Modèle de Données (2h)**

Modifier `characterModel.js` pour ajouter:

```javascript
character.randomState = {
    specie: 0,         // 0=none, 1=accepted(+20XP), -1=manual
    career: 0,         // 0=none, 1=first(+50XP), 2=second(+25XP), -1=manual
    characteristic: 0  // 0=none, 1=accepted(+50XP), 2=reassigned(+25XP), -1=manual
}

character.xp = {
    max: 0,      // Total XP bonus gagnés
    used: 0,     // XP dépensés
    tmp_used: 0, // XP temporaires (non validés)
    log: {}      // Historique des dépenses
}
```

**Phase 2.2: Composant Random Générique (2h)**

Créer `RandomButton.svelte`:
- Bouton "Lancer les dés" 🎲
- Animation de dé
- Affichage du résultat
- Proposition de bonus XP
- Boutons: "Accepter (+XP)" | "Relancer (-XP)" | "Choisir manuellement"

**Phase 2.3: Intégration dans Species (1h)**

Modifier `WizardStep1Species.svelte`:
- Ajouter RandomButton
- Logique: d100 pour table de species
- Bonus: +20 XP si accepté
- Références V1: `StepSpecies.html:38-40`

**Phase 2.4: Intégration dans Career (2h)**

Modifier `WizardStep2Career.svelte`:
- Ajouter RandomButton pour chaque niveau de choix
- Bonus: +50 XP (1er choix random), +25 XP (2ème choix)
- Références V1: `StepCareers.html:33-35`

**Phase 2.5: Intégration dans Characteristics (1h)**

Modifier `WizardStep3Characteristics.svelte`:
- Ajouter RandomButton pour jets de caractéristiques
- Bonus: +50 XP (accepté), +25 XP (réassigné)
- Références V1: `StepCharacteristics.html:43-45`

**Fichiers à créer/modifier**:
```
warhammer-v2/src/lib/characterModel.js (modifier)
warhammer-v2/src/components/common/RandomButton.svelte (créer)
warhammer-v2/src/components/wizard/WizardStep1Species.svelte (modifier)
warhammer-v2/src/components/wizard/WizardStep2Career.svelte (modifier)
warhammer-v2/src/components/wizard/WizardStep3Characteristics.svelte (modifier)
```

**Critères de succès**:
- [ ] Modèle de données randomState et xp implémenté
- [ ] Composant RandomButton réutilisable créé
- [ ] Species: génération aléatoire + bonus +20 XP
- [ ] Career: génération aléatoire + bonus +50/+25 XP
- [ ] Characteristics: génération aléatoire + bonus +50/+25 XP
- [ ] Total XP calculé correctement
- [ ] Étape Experience peut dépenser les XP bonus

---

#### Stream 3: Optimiser & Fusionner Étapes (MOYENNE PRIORITÉ)
**Priorité**: P1 - Amélioration UX
**Durée**: 4 heures
**Dépendances**: Streams 1 & 2 terminés

**Objectif**: Réduire de 16 à 9 étapes essentielles.

**Phase 3.1: Fusionner Fate dans Characteristics (1h)**

Modifier `WizardStep3Characteristics.svelte`:
- Intégrer Fate & Resilience (actuellement step 9)
- Supprimer `WizardStep9Fate.svelte`

**Phase 3.2: Réorganiser Talents/Spells (1h)**

- Spells fait partie de Career/Talents en V1
- Fusionner logique de Spells dans Talents
- Supprimer `WizardStep7Spells.svelte`

**Phase 3.3: Supprimer Étapes Post-Création (2h)**

Supprimer (déplacer hors wizard):
- `WizardStep10Ambitions.svelte` → Page séparée
- `WizardStep11Party.svelte` → Page séparée
- `WizardStep13Notes.svelte` → Page séparée
- `WizardStep14Psychology.svelte` → Page séparée
- `WizardStep16Complete.svelte` → Juste une confirmation

Garder uniquement:
1. Species
2. Career
3. Characteristics (+ Fate)
4. Talents (+ Spells)
5. Skills
6. Equipment
7. Details
8. Experience
9. Review

**Fichiers à modifier/supprimer**:
```
warhammer-v2/src/routes/Creator.svelte (mettre à jour steps)
warhammer-v2/src/components/wizard/WizardStep3Characteristics.svelte (fusionner Fate)
warhammer-v2/src/components/wizard/WizardStep6Talents.svelte (fusionner Spells)
Supprimer: WizardStep9Fate, WizardStep7Spells, WizardStep10+
```

**Critères de succès**:
- [ ] 9 étapes au lieu de 16
- [ ] Fate intégré dans Characteristics
- [ ] Spells intégré dans Talents
- [ ] Étapes post-création déplacées hors wizard
- [ ] Navigation fluide entre les 9 étapes
- [ ] Aucune perte de fonctionnalité

---

## Timeline Révisé

```
Stream 1 (2h):  Corriger ordre des étapes
Stream 2 (8h):  Implémenter Random/XP
                 ├─ Phase 2.1: Modèle (2h)
                 ├─ Phase 2.2: RandomButton (2h)
                 ├─ Phase 2.3: Species (1h)
                 ├─ Phase 2.4: Career (2h)
                 └─ Phase 2.5: Characteristics (1h)
Stream 3 (4h):  Optimiser et fusionner étapes
                 ├─ Phase 3.1: Fate → Characteristics (1h)
                 ├─ Phase 3.2: Spells → Talents (1h)
                 └─ Phase 3.3: Supprimer post-création (2h)
```

**Total: 14 heures** (1-2 jours)

## Dépendances

```
Stream 1 (Ordre) → Stream 2 (Random/XP) → Stream 3 (Optimisation)
     ↓                    ↓                        ↓
  BLOQUANT           CRITIQUE               AMÉLIORATION
```

**Exécution séquentielle requise** (pas de parallélisme possible).

## Références Clés

### V1 Code à Porter
- **Random/XP Species**: `StepSpecies.html:38-40`
- **Random/XP Career**: `StepCareers.html:33-35`
- **Random/XP Characteristics**: `StepCharacteristics.html:43-45`
- **Details après Species**: `StepDetail.html:36-52` (utilise `specie.refDetail`)
- **Modèle randomState**: `Character.html:34-40`
- **Modèle XP**: `Character.html:828-865`

### V2 Fichiers Existants
- **Orchestrateur**: `src/routes/Creator.svelte:44-61` (steps à réordonner)
- **Étapes wizard**: `src/components/wizard/WizardStep*.svelte` (16 fichiers)
- **Modèle character**: `src/lib/characterModel.js` (à étendre)

### Documentation Détaillée
Tous les détails dans:
- `.claude/epics/v2/updates/24/wizard-summary.md` - Tableau comparatif
- `.claude/epics/v2/updates/24/wizard-comparison.md` - Analyse complète
- `.claude/epics/v2/updates/24/ANALYSIS_COMPLETE.md` - Rapport final

## Notes Importantes

1. **Stream B (Persistence) toujours valide**: La couche de persistence IndexedDB créée est compatible et sera utilisée
2. **Architecture V2 préservée**: On ne recrée rien, on améliore l'existant
3. **Ordre critique**: Stream 1 doit être fait en premier (bloquant)
4. **Tests**: Tester chaque stream avant de passer au suivant
5. **Commits fréquents**: Un commit par stream/phase
