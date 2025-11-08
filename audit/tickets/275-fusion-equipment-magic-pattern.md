---
id: 275
status: TODO
priority: HIGH
domain: features
dependencies: [259]
phase: 9
---

# Features - Fusion equipment/* + magic/* + pattern partagé (R16+R17)

## Objectif
Fusionner equipment/* (14→1) + magic/* (13→2) + créer pattern-validation-display.md pour cross-duplication

## Périmètre
**27 fichiers → 4 fichiers** :
1. **equipment.md** (~950 lignes) - fusion 14 fichiers equipment/*
2. **magic-system.md** (~600 lignes) - fusion domains + learning rules
3. **magic-usage.md** (~480 lignes) - fusion casting + validation + display
4. **pattern-validation-display.md** (~150 lignes) - NOUVEAU pattern partagé

## Fichiers sources equipment/* (14 fichiers - 2,350 lignes)
- weapons.md, armour.md, weapon-qualities.md, armour-qualities.md
- encumbrance-calc.md, encumbrance-limit.md, encumbrance-penalties.md
- categorization.md, pricing.md, worn-vs-stored.md, money.md
- inventory.md, validation.md, display.md

## Fichiers sources magic/* (13 fichiers - 2,280 lignes)
- domains.md, learning.md, career-restrictions.md, talent-prerequisites.md
- xp-cost.md, multiple-lores.md, petty-vs-spells.md, ingredients.md
- casting-tests.md, casting-number.md, validation.md, display.md, search.md

## CROSS-DUPLICATION CRITIQUE identifiée

**equipment/validation.md** et **magic/validation.md** partagent le MÊME template :
- Section "Vue d'ensemble" (5 lignes) IDENTIQUE
- Section "Domaines de validation" / "Validations X" (structure similaire)
- Section "Cas limites" (format similaire)

**equipment/display.md** et **magic/display.md** partagent le MÊME template :
- Section "Vue d'ensemble" → "Organisation" → "Informations affichées" → "Tri"

**→ 200 lignes de structure identique entre equipment/* et magic/***

## Structure pattern-validation-display.md (~150 lignes)

```markdown
# Pattern - Validation et Affichage

## Validation d'une entité
### Structure type
- Vue d'ensemble (définition)
- Domaines de validation (catégories 3-5)
- Validation structurelle
- Validation métier
- Validation références
- Cas limites

## Affichage d'une collection
### Structure type
- Vue d'ensemble (objectif)
- Organisation de l'affichage (groupement/catégories)
- Informations affichées par item
- Tri et ordre
- Filtrage (optionnel)
- Interactions utilisateur

## Utilisation
Référencé par equipment.md, magic-*.md, et potentiellement autres features
```

## Structure equipment.md (~950 lignes)

```markdown
# Equipment - Équipement personnage

## Vue d'ensemble (10 lignes)

## Types d'équipement (150 lignes)
- Armes (mêlée, distance, munitions) - fusion weapons.md
- Armures (zones, PA) - fusion armour.md
- Qualités (armes/armures) - fusion weapon-qualities.md + armour-qualities.md
- Objets divers (trappings)

## Encombrement (180 lignes)
- Calcul total - fusion encumbrance-calc.md
- Limite (Force + Endurance) - fusion encumbrance-limit.md
- Pénalités si dépassement - fusion encumbrance-penalties.md

## Organisation inventaire (120 lignes)
- Catégorisation - fusion categorization.md
- Porté vs stocké - fusion worn-vs-stored.md
- Monnaie - fusion money.md

## Économie (90 lignes)
- Pricing - fusion pricing.md
- Disponibilité

## Affichage et validation (200 lignes)
- Interface inventaire - fusion display.md + inventory.md
- Règles validation - fusion validation.md
- **Référence pattern-validation-display.md**

## Exemples concrets (100 lignes)
- Personnages types avec équipement complet

## Voir aussi (10 lignes)
```

## Structure magic-system.md (~600 lignes)

```markdown
# Magic - Système de magie

## Vue d'ensemble (10 lignes)

## Domaines de magie (195 lignes)
- Trois grandes catégories (Arcanes, Divine, Chaos)
- Huit domaines arcanes (Vents de Magie)
- Domaines alternatifs
- Fusion domains.md

## Apprentissage et prérequis (400 lignes)
- Talents requis - fusion talent-prerequisites.md
- Restrictions carrières - fusion career-restrictions.md
- Règles par domaine - fusion learning.md
- Coûts XP - fusion xp-cost.md
- Multi-domaines - fusion multiple-lores.md
- Progression domaine

## Voir aussi (5 lignes)
```

## Structure magic-usage.md (~480 lignes)

```markdown
# Magic - Utilisation de la magie

## Vue d'ensemble (10 lignes)

## Lancement de sorts (300 lignes)
- Tests de lancement - fusion casting-tests.md
- Calcul CN - fusion casting-number.md
- Composants et ingrédients - fusion ingredients.md
- Petty vs sorts majeurs - fusion petty-vs-spells.md

## Validation et recherche (170 lignes)
- Validation magie - fusion validation.md (élimine overlap avec equipment/*)
- Affichage sorts - fusion display.md (élimine overlap avec equipment/*)
- Recherche sorts - fusion search.md
- **Référence pattern-validation-display.md**

## Voir aussi (5 lignes)
```

## Impact combiné
- **27 fichiers → 4 fichiers** (-85%)
- **4,630 lignes → 2,180 lignes** (-53%)
- **Élimination 200 lignes cross-duplication** (validation/display partagés)

## Impact détaillé
- equipment/* : 14 fichiers → 1 fichier, -1,400 lignes (-60%)
- magic/* : 13 fichiers → 2 fichiers, -1,200 lignes (-53%)
- Pattern partagé : +150 lignes (réutilisable autres features)

## Effort estimé
12 heures (fusion complexe + création pattern partagé)

## Critères d'acceptance
- [ ] equipment.md créé (~950 lignes)
- [ ] magic-system.md créé (~600 lignes)
- [ ] magic-usage.md créé (~480 lignes)
- [ ] patterns/pattern-validation-display.md créé (~150 lignes)
- [ ] 27 anciens fichiers supprimés
- [ ] equipment.md et magic-*.md référencent pattern-validation-display.md
- [ ] Aucune section "Vue d'ensemble" + "Organisation" dupliquée
- [ ] Total lignes ~2,180 (vs 4,630 avant)
- [ ] Aucune perte contenu métier
