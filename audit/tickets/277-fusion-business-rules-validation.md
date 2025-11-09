---
id: 277
status: DONE
priority: HIGH
domain: business-rules
dependencies: [259]
phase: 9
---

# Business-Rules - Fusion validation careers (R19)

## Objectif
Fusionner 2 fichiers business-rules/validation careers en 1 fichier pour éliminer duplication ET respecter limite 200 lignes

## Périmètre
**DANS le scope:**
- Fusion tests-coherence-careers.md (212 lignes) + validation-donnees-careers.md (205 lignes)
- Élimination sections intro identiques (lignes 1-50)
- Création careers-validation.md (~195 lignes)
- **Respect limite 200 lignes**

**HORS scope:**
- Modification logique validation
- Ajout nouvelles règles

## Critères d'acceptance
- [ ] 2 fichiers fusionnés en careers-validation.md
- [ ] careers-validation.md < 200 lignes (195 lignes estimé)
- [ ] Anciens fichiers supprimés
- [ ] Aucune perte contenu métier
- [ ] Fichiers dépassant 200 lignes : 2 → 0 (F1, F2 résolus)

## Fichiers sources (2 fichiers - 417 lignes)
- tests-coherence-careers.md (212 lignes) ❌ **DÉPASSE 200**
- validation-donnees-careers.md (205 lignes) ❌ **DÉPASSE 200**

## Structure careers-validation.md cible (~195 lignes)

```markdown
# Business Rules - Validation carrières

## Vue d'ensemble (10 lignes)
- Contexte validation carrières
- Patterns référencés

## Tests de cohérence (100 lignes)
- Fusion tests-coherence-careers.md
- Tests intégrité données
- Vérification références
- Règles cohérence

## Validation données (80 lignes)
- Fusion validation-donnees-careers.md
- Règles contraintes métier
- Validation champs requis
- Cas limites

## Voir aussi (5 lignes)
```

## Duplication identifiée (depuis rapport R19)

**Lignes 1-50 quasi-identiques** dans les 2 fichiers :
- Référencent mêmes patterns (validation-metadonnees, validation-references)
- Structure intro similaire

**Contenu métier unique** :
- tests-coherence : 100 lignes (tests spécifiques)
- validation-donnees : 90 lignes (règles contraintes)
- **Total unique** : 190 lignes + 5 lignes transitions = **195 lignes** ✅

## Impact
- **-222 lignes** (-53%)
- **-50% fichiers** (2 → 1)
- **Respect limite 200 lignes** (195 lignes)

## Effort estimé
2 heures

## Validation finale
- [ ] ls audit/business-rules/*validation*.md ne retourne que careers-validation.md
- [ ] wc -l careers-validation.md retourne ~195 lignes ✅ < 200
- [ ] grep -r "tests-coherence-careers\|validation-donnees-careers" audit/ retourne vide
- [ ] Sections "Tests de cohérence" et "Validation données" distinctes
- [ ] Aucune duplication intro (1 seule Vue d'ensemble)
- [ ] F1 et F2 résolus (plus de fichiers > 200 lignes dans business-rules/)
- [ ] Commit avec message explicite
