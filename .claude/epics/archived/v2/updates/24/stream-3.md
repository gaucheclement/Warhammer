---
issue: 24
stream: 3 - Optimiser & Fusionner Étapes
priority: P1
depends_on: stream-1, stream-2
duration: 4h
started: 2025-10-25T09:00:00Z
completed: 2025-10-25T12:30:00Z
status: completed
---

# Stream 3: Optimiser & Fusionner Étapes

## Objectif
Réduire le wizard V2 de 16 étapes à 9 étapes essentielles en fusionnant/supprimant les étapes superflues.

## Problème Actuel
V2 a **16 étapes** alors que V1 en a **9**:
- Étapes trop granulaires (Fate séparé de Characteristics)
- Étapes post-création dans le wizard (Ambitions, Party, Notes, Psychology)
- Navigation plus longue que nécessaire

## Plan d'Action

### Phase 3.1: Fusionner Fate dans Characteristics (1h)

**Problème**: Fate est une étape séparée (step 9) alors qu'il devrait être dans Characteristics.

**V1 Référence**: `StepCharacteristics.html` contient Fate et Resilience intégrés.

**Action**:
1. Lire `WizardStep9Fate.svelte` - Extraire la logique
2. Intégrer dans `WizardStep3Characteristics.svelte`:
   - Ajouter section Fate/Resilience
   - Formules: Fate dépend de species, Resilience de Willpower
3. Supprimer `WizardStep9Fate.svelte`
4. Mettre à jour `Creator.svelte` - Retirer step 9

**Tâches**:
- [ ] Lire WizardStep9Fate.svelte
- [ ] Copier logique Fate/Resilience
- [ ] Intégrer dans WizardStep3Characteristics.svelte
- [ ] Tester calculs Fate/Resilience
- [ ] Supprimer WizardStep9Fate.svelte
- [ ] Mettre à jour Creator.svelte
- [ ] Commit: "Issue #24: Stream 3.1 - Merge Fate into Characteristics step"

---

### Phase 3.2: Fusionner Spells dans Talents (1h)

**Problème**: Spells est une étape séparée (step 8) alors que les sorts sont liés aux talents magiques.

**V1 Référence**: Spells gérés dans Career/Talents en V1, pas d'étape dédiée.

**Action**:
1. Lire `WizardStep8Spells.svelte` - Extraire la logique
2. Intégrer dans `WizardStep5Talents.svelte`:
   - Détecter si le personnage a un talent magique
   - Si oui, afficher sélection de sorts
   - Sinon, skip
3. Supprimer `WizardStep8Spells.svelte`
4. Mettre à jour `Creator.svelte` - Retirer step 8

**Tâches**:
- [ ] Lire WizardStep8Spells.svelte
- [ ] Identifier talents qui donnent accès aux sorts
- [ ] Intégrer sélection sorts dans WizardStep5Talents.svelte
- [ ] Afficher conditionnellement (si talent magique)
- [ ] Tester sélection sorts
- [ ] Supprimer WizardStep8Spells.svelte
- [ ] Mettre à jour Creator.svelte
- [ ] Commit: "Issue #24: Stream 3.2 - Merge Spells into Talents step"

---

### Phase 3.3: Supprimer Étapes Post-Création (2h)

**Problème**: 5 étapes sont pour la gestion de fiche, pas la création initiale:
- Step 10: Ambitions
- Step 11: Party
- Step 13: Notes
- Step 14: Psychology
- Step 16: Complete (juste une confirmation)

**Action**:
1. **Déplacer hors du wizard** (ou supprimer si non utilisé):
   - Ambitions → Page Character Sheet séparée
   - Party → Gestion de groupe séparée
   - Notes → Character Sheet
   - Psychology → Character Sheet

2. **Garder uniquement Review** (step 15):
   - Renommer en "Review" final
   - Validation complète
   - Résumé du personnage
   - Bouton "Finaliser"

3. **Réorganiser les étapes finales**:
   ```
   Avant (16 étapes):
   8. Equipment
   9. Fate (→ fusionné dans 3)
   10. Ambitions (→ supprimer)
   11. Party (→ supprimer)
   12. Experience
   13. Notes (→ supprimer)
   14. Psychology (→ supprimer)
   15. Review (→ garder)
   16. Complete (→ supprimer)

   Après (9 étapes):
   6. Equipment
   7. Details
   8. Experience
   9. Review
   ```

**Tâches**:
- [ ] Identifier quelles étapes supprimer
- [ ] Sauvegarder le code utile (Ambitions, etc.) pour usage futur
- [ ] Supprimer WizardStep10Ambitions.svelte
- [ ] Supprimer WizardStep11Party.svelte
- [ ] Supprimer WizardStep13Notes.svelte
- [ ] Supprimer WizardStep14Psychology.svelte
- [ ] Supprimer WizardStep16Complete.svelte
- [ ] Renommer WizardStep15Review.svelte → WizardStep9Review.svelte
- [ ] Mettre à jour Creator.svelte avec 9 étapes
- [ ] Réorganiser IDs (6→6, 7→7, 12→8, 15→9)
- [ ] Tester navigation complète
- [ ] Commit: "Issue #24: Stream 3.3 - Remove post-creation steps, consolidate to 9 steps"

---

### Phase 3.4: Mise à Jour Finale & Tests (30min)

**Tâches finales**:
1. Vérifier l'ordre final des 9 étapes
2. Tester navigation complète (début → fin)
3. Vérifier validation à chaque étape
4. Tester save/load du personnage
5. Vérifier progress bar (9 étapes)
6. Documentation des changements

**Ordre Final (9 étapes)**:
```
1. Species          (avec random +20 XP)
2. Career           (avec random +50/+25 XP)
3. Characteristics  (avec random +50 XP, Fate intégré)
4. Skills
5. Talents          (Spells intégré si applicable)
6. Equipment
7. Details
8. Experience       (dépenser les XP bonus)
9. Review           (validation finale)
```

**Checklist de test**:
- [ ] Navigation next/previous fonctionne
- [ ] Chaque étape sauvegarde correctement
- [ ] Progress bar affiche 9 étapes
- [ ] Random/XP fonctionne toujours
- [ ] Fate calculé dans Characteristics
- [ ] Spells disponibles si talent magique
- [ ] Review affiche tous les détails
- [ ] Finalisation crée le personnage

---

## Critères de Succès

**Phase 3.1**:
- [ ] Fate/Resilience intégré dans Characteristics ✓
- [ ] WizardStep9Fate.svelte supprimé ✓
- [ ] Calculs corrects ✓

**Phase 3.2**:
- [ ] Spells intégré dans Talents ✓
- [ ] WizardStep8Spells.svelte supprimé ✓
- [ ] Conditionnel sur talents magiques ✓

**Phase 3.3**:
- [ ] 5 étapes post-création supprimées ✓
- [ ] 9 étapes finales ✓
- [ ] Navigation fluide ✓

**Phase 3.4**:
- [ ] Tests complets passent ✓
- [ ] Documentation à jour ✓

**Global**:
- [ ] 9 étapes au lieu de 16
- [ ] Toutes les fonctionnalités préservées
- [ ] Navigation plus rapide
- [ ] UX améliorée
- [ ] Commits clairs (un par phase)

## Fichiers à Modifier

**Supprimer** (5 fichiers):
- `WizardStep9Fate.svelte`
- `WizardStep8Spells.svelte`
- `WizardStep10Ambitions.svelte`
- `WizardStep11Party.svelte`
- `WizardStep13Notes.svelte`
- `WizardStep14Psychology.svelte`
- `WizardStep16Complete.svelte`

**Modifier** (3 fichiers):
- `WizardStep3Characteristics.svelte` (+ Fate)
- `WizardStep5Talents.svelte` (+ Spells)
- `Creator.svelte` (9 steps au lieu de 16)

**Renommer** (1 fichier):
- `WizardStep15Review.svelte` → `WizardStep9Review.svelte`

## Références V1

**Fate dans Characteristics**: `StepCharacteristics.html:lines 120-150`
**Spells liés aux talents**: `StepTalents.html:lines 200-250`
**Pas d'étapes post-création**: V1 arrête à Review

## Durée Estimée

- Phase 3.1: 1h (Fate)
- Phase 3.2: 1h (Spells)
- Phase 3.3: 2h (Suppression + réorganisation)
- Phase 3.4: 30min (Tests)

**Total: 4h 30min** (avec marge)

## Impact Utilisateur

**Avant Stream 3**: 16 étapes, navigation longue
**Après Stream 3**: 9 étapes, création plus rapide

**Temps de création estimé**:
- Avant: ~20-25 min (16 étapes)
- Après: ~12-15 min (9 étapes)

**Gain**: ~40% plus rapide 🚀

## Next Steps

Après Stream 3, l'issue #24 sera **100% complète**:
- ✅ Ordre correct (Stream 1)
- ✅ Random/XP (Stream 2)
- ✅ 9 étapes optimales (Stream 3)

Wizard V2 atteindra ~95% de parité avec V1.
