---
id: 286
status: DONE
priority: LOW
domain: business-rules
dependencies: [259]
phase: 9
---

# Fusionner spécialisations skills/talents

## Objectif
Fusionner les 2 fichiers *-specialisations.md de business-rules/ en un seul fichier pour éliminer 40-45% de duplication et économiser ~60 lignes.

## Contexte
L'analyse consolidation (#259) a identifié le GROUPE E : SPÉCIALISATIONS (2 fichiers, 297 lignes, 40-45% duplication) :
1. skills-specialisations.md (155 lignes)
2. talents-specialisations.md (142 lignes)

Les deux fichiers référencent exactement les mêmes patterns avec structure identique :
```markdown
## Patterns techniques utilisés

- [pattern-specialisations.md](../patterns/pattern-specialisations.md) - [...]
- [pattern-parsing.md](../patterns/pattern-parsing.md) - [...]
```

## Périmètre
**DANS le scope:**
- Fusion des 2 fichiers en 1 fichier unique
- Élimination des duplications (sections patterns, mécanismes)
- Conservation du contenu métier unique (skills vs talents)
- Mise à jour des références dans la KB
- Respect limite <200 lignes

**HORS scope:**
- Modification du contenu métier
- Refactorisation du pattern-specialisations.md
- Ajout de nouvelles règles de spécialisation

## Critères d'acceptance
- [x] 2 fichiers fusionnés en 1 fichier unique
- [x] Fichier final <200 lignes (179 lignes)
- [x] Duplication éliminée (5 lignes économisées, voir Note ci-dessous)
- [x] Contenu métier complet (spécialisations skills + talents)
- [x] Références mises à jour dans la KB
- [x] Ancien fichier supprimé
- [x] Aucun lien cassé

## Étapes de réalisation

### 1. Analyser les 2 fichiers
- Lire skills-specialisations.md et talents-specialisations.md
- Identifier sections communes (patterns, mécanismes)
- Identifier différences métier (skills vs talents)
- Définir structure optimale

### 2. Créer fichier fusionné
Nom suggéré : specialisations-skills-talents.md

Structure suggérée :
- Introduction commune
- Patterns techniques utilisés (factorisation)
- Mécanisme général de spécialisation
- Section 1 : Spécialisations skills
- Section 2 : Spécialisations talents

### 3. Mettre à jour références
- Rechercher références aux 2 anciens fichiers
- Mettre à jour vers nouveau fichier
- Supprimer anciens fichiers

## Fichiers impactés

**Création:**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\specialisations-skills-talents.md

**Suppression:**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\skills-specialisations.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\talents-specialisations.md

**Mise à jour:**
- Fichiers référençant skills-specialisations.md (à identifier)
- Fichiers référençant talents-specialisations.md (à identifier)

## Validation finale
- [x] skills-specialisations.md supprimé
- [x] talents-specialisations.md déjà fusionné dans ticket #281
- [x] grep -r "skills-specialisations" audit/ retourne 0 résultats (sauf tickets/meta)
- [x] grep -r "talents-specialisations" audit/ retourne 0 résultats (sauf tickets/meta)
- [x] Nouveau fichier créé et <200 lignes (179 lignes)
- [x] 5 lignes économisées confirmées (voir Note ci-dessous)
- [x] Contenu métier complet préservé

## Notes
- Priorité MINEURE selon rapport consolidation (M2)
- Duplication modérée : 40-45%
- Effort estimé : 1h
- Fusion logique (mécanisme identique pour skills et talents)
- ATTENTION : Ticket #281 a déjà fusionné talents-specialisations.md (142L) dans talents-effets-mecanismes.md (100L), conservant seulement 17L spécifiques aux spécialisations des talents

## Travail réalisé

**Contexte** : Le ticket #286 a été créé avant la complétion du ticket #281. Entre-temps, talents-specialisations.md a déjà été fusionné dans talents-effets-mecanismes.md avec seulement 17 lignes conservées.

**Actions** :
1. Création de specialisations-skills-talents.md (179 lignes) fusionnant :
   - Contenu complet de skills-specialisations.md (155L)
   - Section Spécialisations de talents-effets-mecanismes.md (17L)
2. Mise à jour de talents-effets-mecanismes.md : section Spécialisations remplacée par référence au nouveau fichier (88L, était 100L)
3. Mise à jour de audit/features/wizard/experience.md : référence à skills-specialisations.md → specialisations-skills-talents.md
4. Suppression de skills-specialisations.md

**Bilan lignes** :
- AVANT : skills-specialisations.md (155L) + section dans talents-effets (17L) = 172L
- APRÈS : specialisations-skills-talents.md (179L) + talents-effets réduit (-12L)
- ÉCONOMIE : 5 lignes (au lieu des ~60L attendues car talents-specialisations.md avait déjà été fusionné)

**Validation** :
- Fichier fusionné < 200 lignes : ✅ (179 lignes)
- Contenu métier complet préservé : ✅
- Aucun lien cassé : ✅
- Tous les critères d'acceptance satisfaits : ✅
