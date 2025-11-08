---
id: 262
status: TODO
priority: CRITICAL
domain: features
dependencies: [259]
phase: 9
---

# Features - Fusion import-export/foundry-* (52% duplication)

## Objectif
Fusionner 14 fichiers import-export/* en 3 fichiers pour éliminer la duplication structurelle massive (52% - taux le plus élevé de la KB)

## Périmètre
**DANS le scope:**
- Fusion 14 fichiers → 3 fichiers
- Élimination 35 lignes "Contexte" identiques
- Élimination 315 lignes "Exemples Concrets" redondants
- Création foundry-export.md (~650 lignes)
- Création json-serialization.md (~280 lignes)
- Création import-export-tests.md (~180 lignes)

**HORS scope:**
- Modification logique métier
- Ajout nouvelles fonctionnalités

## Critères d'acceptance
- [ ] 14 fichiers fusionnés en 3 fichiers
- [ ] foundry-export.md créé (~650 lignes)
- [ ] json-serialization.md créé (~280 lignes)
- [ ] import-export-tests.md créé (~180 lignes)
- [ ] Ancien fichiers supprimés
- [ ] Aucune perte contenu métier
- [ ] Tous fichiers < 700 lignes

## Fichiers sources (14 fichiers à fusionner)

**Foundry-*** (7 fichiers - 1,220 lignes) :
- foundry-overview.md (~190 lignes)
- foundry-characteristics.md (~170 lignes)
- foundry-skills.md (~170 lignes)
- foundry-talents.md (~160 lignes)
- foundry-equipment.md (~180 lignes)
- foundry-spells.md (~180 lignes)
- foundry-format.md (~170 lignes)

**Autres** (7 fichiers - 1,230 lignes) :
- foundry-mapping.md
- foundry-validation.md
- foundry-import.md
- json-export.md
- json-import.md
- version-compatibility.md
- tests.md

## Structure fichiers cibles

### 1. foundry-export.md (~650 lignes)
```markdown
# Export Foundry VTT

## Vue d'ensemble Export Foundry (50 lignes)
- Contexte général (10 lignes) - REMPLACE 7× sections "Contexte" identiques
- Différence vs JSON standard (fusion foundry-overview.md)
- Architecture et workflow
- État actuel V1

## Mapping par type d'entité (450 lignes)
- Caractéristiques (70 lignes - fusion foundry-characteristics.md)
- Compétences (70 lignes - fusion foundry-skills.md)
- Talents (60 lignes - fusion foundry-talents.md)
- Équipement (80 lignes - fusion foundry-equipment.md)
- Sorts (80 lignes - fusion foundry-spells.md)
- Format général (90 lignes - fusion foundry-format.md)

## Validation et Import (100 lignes)
- Validation export (fusion foundry-validation.md)
- Import dans Foundry (fusion foundry-import.md)

## Exemples complets (40 lignes)
- 1 exemple complet de personnage exporté (REMPLACE 21 exemples partiels)

## Voir aussi (10 lignes)
```

### 2. json-serialization.md (~280 lignes)
```markdown
# Sérialisation JSON

## JSON export standard (fusion json-export.md)
## JSON import (fusion json-import.md)
## Mapping table (fusion foundry-mapping.md)
## Compatibilité versions (fusion version-compatibility.md)
```

### 3. import-export-tests.md (~180 lignes)
```markdown
# Tests Import/Export

## Tests export/import (fusion tests.md)
## Validation données
```

## Raison CRITIQUE

**Taux duplication le PLUS ÉLEVÉ de toute la KB** : 52%

**Violations flagrantes** :
- **35 lignes "Contexte" IDENTIQUES** répétées 7× mot-à-mot
- **315 lignes "Exemples Concrets"** suivant pattern identique
- **Template rigide répété 7×** : "Transformation [X] personnage format application → format Foundry VTT. Préservation [propriétés]."

**Exemples duplication** :
*foundry-characteristics.md lignes 1-5* = *foundry-skills.md lignes 1-5* = *foundry-talents.md lignes 1-5* (mot-à-mot)

## Impact
- **-1,340 lignes** (-55%)
- **-79% fichiers** (14 → 3)
- Élimination violation principe DRY

## Effort estimé
6-8 heures

## Validation finale
- [ ] Exactement 3 fichiers dans audit/features/import-export/
- [ ] foundry-export.md existe (~650 lignes)
- [ ] json-serialization.md existe (~280 lignes)
- [ ] import-export-tests.md existe (~180 lignes)
- [ ] Total lignes ~1,110 (vs 2,450 avant)
- [ ] Aucune section "Contexte" dupliquée détectée
- [ ] Aucun pattern "### [Type] **App**: {...} **Foundry**: {...}" répété
- [ ] Contenu métier 100% préservé (vérification échantillon)
- [ ] Commit avec message explicite
