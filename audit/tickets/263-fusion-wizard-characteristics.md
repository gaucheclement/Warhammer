---
id: 263
status: TODO
priority: HIGH
domain: features
dependencies: [259]
phase: 9
---

# Features - Fusion wizard/characteristics-* (R1)

## Objectif
Fusionner 7 fichiers wizard/characteristics-* en 1 fichier pour éliminer duplication structurelle massive (74%)

## Périmètre
**DANS le scope:**
- Fusion 7 fichiers → 1 fichier characteristics.md (~300 lignes)
- Élimination 860 lignes redondantes
- Préservation 100% contenu métier unique (250 lignes)

**HORS scope:**
- Modification logique métier
- Ajout nouvelles fonctionnalités

## Critères d'acceptance
- [ ] 7 fichiers fusionnés en characteristics.md
- [ ] characteristics.md ~300 lignes
- [ ] Anciens fichiers supprimés
- [ ] Aucune perte contenu métier
- [ ] Fichier < 350 lignes

## Fichiers sources (7 fichiers - 1,163 lignes)
- characteristics-base.md
- characteristics-roll.md
- characteristics-career-bonus.md
- characteristics-totals.md
- characteristics-base-random.md
- characteristics-manual.md
- characteristics-display.md

## Structure wizard/characteristics.md cible

```markdown
# Wizard - Caractéristiques

## Vue d'ensemble (10 lignes)
- Contexte step Caractéristiques
- Objectif global

## Valeurs de base (30 lignes)
- Base espèce (fusion characteristics-base.md)
- Table valeurs par espèce

## Jet aléatoire (40 lignes)
- Jet 2d10 (fusion characteristics-roll.md + characteristics-base-random.md)
- Distribution probabilités
- Exemples concrets

## Saisie manuelle (25 lignes)
- Mode manuel (fusion characteristics-manual.md)
- Limites et validation

## Bonus de carrière (35 lignes)
- Calcul bonus carrière (fusion characteristics-career-bonus.md)
- Répartition +5 points

## Calcul des totaux (40 lignes)
- Formule totale (fusion characteristics-totals.md)
- Bonus dérivés

## Affichage et interface (50 lignes)
- Organisation interface (fusion characteristics-display.md)
- Interactions utilisateur

## Validation (30 lignes)
- Règles validation
- Cas limites

## Exemples concrets (40 lignes)
- Humain Agitateur complet
- Nain Tueur complet

## Voir aussi (10 lignes)
```

## Duplication identifiée (depuis rapport R1)

**Structure répétée 7×** :
1. Contexte (10 lignes) - IDENTIQUE dans les 7 fichiers
2. Exemples par espèce (40 lignes) - Pattern répété
3. Structure données (15 lignes) - Format similaire
4. Affichage wizard (30 lignes) - Template identique
5. Relations (15 lignes) - Références croisées
6. Voir aussi (10 lignes) - IDENTIQUE

**Duplication quantifiée** :
- 860 lignes répétition (74%)
- 250 lignes contenu unique (réel besoin)
- 50 lignes ajout transitions

## Impact
- **-860 lignes** (-74%)
- **-86% fichiers** (7 → 1)

## Effort estimé
3 heures

## Validation finale
- [ ] ls audit/features/wizard/characteristics-*.md retourne 1 seul fichier (characteristics.md)
- [ ] wc -l characteristics.md retourne ~300 lignes
- [ ] Toutes sections présentes (Vue d'ensemble → Voir aussi)
- [ ] Aucune section "Contexte" dupliquée
- [ ] Exemples unifiés (pas 7× répétés)
- [ ] Commit avec message explicite
