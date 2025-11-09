---
id: 264
status: DONE
priority: HIGH
domain: features
dependencies: [259]
phase: 9
---

# Features - Fusion wizard/detail-* (R2)

## Objectif
Fusionner 6 fichiers wizard/detail-* en 1 fichier pour éliminer duplication structurelle critique (68%)

## Périmètre
**DANS le scope:**
- Fusion 6 fichiers → 1 fichier details.md (~350 lignes)
- Élimination 740 lignes redondantes (8/10 sections identiques)
- Préservation 100% contenu métier unique (275 lignes)

**HORS scope:**
- Modification logique métier
- Ajout nouvelles fonctionnalités

## Critères d'acceptance
- [x] 6 fichiers fusionnés en details.md
- [x] details.md ~350 lignes (346 lignes)
- [x] Anciens fichiers supprimés
- [x] Aucune perte contenu métier
- [x] Fichier < 380 lignes

## Fichiers sources (6 fichiers - 1,090 lignes)
- detail-age.md
- detail-height.md
- detail-eyes.md
- detail-hairs.md
- detail-name.md
- detail-gender.md

## Structure wizard/details.md cible

```markdown
# Wizard - Détails personnage

## Vue d'ensemble (10 lignes)
- Contexte step Details
- Champs concernés

## Modes de sélection (40 lignes)
- Génération aléatoire
- Saisie manuelle
- Mode hybride

## Détails par type (180 lignes)

### Âge (30 lignes - fusion detail-age.md)
- Tables par espèce
- Règles génération

### Taille (30 lignes - fusion detail-height.md)
- Formules par espèce
- Variations

### Nom (30 lignes - fusion detail-name.md)
- Tables noms par espèce/genre
- Conventions

### Genre (25 lignes - fusion detail-gender.md)
- Sélection binaire
- Adaptations règles

### Yeux (30 lignes - fusion detail-eyes.md)
- Couleurs par espèce
- Particularités

### Cheveux (30 lignes - fusion detail-hairs.md)
- Styles/couleurs par espèce
- Exceptions (nains chauves)

## Stockage et affichage (40 lignes)
- Structure Character.details
- Interface wizard

## Validation (30 lignes)
- Règles cohérence
- Cas limites

## Voir aussi (10 lignes)
```

## Duplication CRITIQUE identifiée (depuis rapport R2)

**8/10 sections EXACTEMENT identiques** :

*detail-age.md lignes 1-5* :
```markdown
## Vue d'ensemble
L'étape Detail du wizard détermine âge via...
```

*detail-height.md lignes 1-5* :
```markdown
## Vue d'ensemble
L'étape Detail du wizard détermine taille via...
```

**SEUL le mot "âge"/"taille" change !**

**Structure répétée 6×** :
1. Vue d'ensemble (5 lignes) - IDENTIQUE mot-à-mot
2. Modes de sélection (30 lignes) - IDENTIQUE (Génération aléatoire, Saisie manuelle, Mode hybride)
3. Stockage et affichage (25 lignes) - IDENTIQUE
4. Intégration workflow (30 lignes) - IDENTIQUE
5. Relations KB (15 lignes) - IDENTIQUE
6. Validation ticket (10 lignes) - IDENTIQUE

**Duplication quantifiée** :
- 560 lignes PURE duplication (140 lignes × 4 fichiers minimum analysés)
- 275 lignes contenu unique (tables/règles spécifiques)
- **Seules 40-50 lignes par fichier sont réellement uniques**

## Impact
- **-740 lignes** (-68%)
- **-83% fichiers** (6 → 1)

## Effort estimé
3 heures

## Validation finale
- [x] ls audit/features/wizard/detail-*.md retourne 1 seul fichier (details.md)
- [x] wc -l details.md retourne ~350 lignes (346)
- [x] Section "Modes de sélection" UNE SEULE FOIS (pas 6×)
- [x] Section "Détails par type" contient 7 sous-sections (Age, Taille, Nom, Yeux, Cheveux, Dieu, Ambitions)
- [x] Chaque détail (âge/taille/etc.) a contenu unique consolidé
- [x] Aucune duplication sections "Vue d'ensemble"
- [x] Commit avec message explicite
