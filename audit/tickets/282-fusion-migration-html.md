---
id: 282
status: DONE
priority: MEDIUM
domain: business-rules
dependencies: [259]
phase: 9
---

# Fusionner migration-descriptions-html*

## Objectif
Fusionner les 2 fichiers migration-descriptions-html*.md en un seul fichier pour éliminer 70-75% de duplication et économiser ~120 lignes.

## Contexte
L'analyse consolidation (#259) a identifié le GROUPE C : MIGRATION HTML (2 fichiers, 345 lignes, 70-75% duplication) :
1. migration-descriptions-html.md (159 lignes)
2. migration-descriptions-html-careers.md (186 lignes)

Les 2 fichiers détaillent les MÊMES balises HTML (<i>, <b>, <br>, etc.) avec MÊMES exemples et structure 90% identique.

## Périmètre
**DANS le scope:**
- Fusion des 2 fichiers en migration-descriptions-html.md unique
- Élimination des duplications (balises HTML, exemples)
- Conservation des spécificités careers si nécessaire
- Mise à jour des références dans la KB
- Respect limite <200 lignes

**HORS scope:**
- Modification du contenu métier
- Refactorisation d'autres fichiers migration
- Ajout de nouvelles règles de migration

## Critères d'acceptance
- [ ] 2 fichiers fusionnés en 1 fichier unique
- [ ] Fichier final <200 lignes
- [ ] ~120 lignes économisées (duplication éliminée)
- [ ] Contenu métier complet (balises HTML, exemples, règles)
- [ ] Spécificités careers intégrées (si nécessaire)
- [ ] Références mises à jour dans la KB
- [ ] Ancien fichier supprimé
- [ ] Aucun lien cassé

## Étapes de réalisation

### 1. Analyser les 2 fichiers
- Lire migration-descriptions-html.md et migration-descriptions-html-careers.md
- Identifier contenu strictement identique (balises, exemples)
- Identifier spécificités du fichier careers
- Calculer contenu unique à préserver

### 2. Créer fichier fusionné
- Base : migration-descriptions-html.md
- Intégrer spécificités careers (section dédiée si nécessaire)
- Factoriser balises HTML communes
- Unifier exemples

### 3. Mettre à jour références
- Rechercher références à migration-descriptions-html-careers.md
- Mettre à jour vers migration-descriptions-html.md
- Supprimer ancien fichier careers

## Fichiers impactés

**Modification:**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\migration-descriptions-html.md (fusion)

**Suppression:**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\migration-descriptions-html-careers.md

**Mise à jour:**
- Fichiers référençant migration-descriptions-html-careers.md (à identifier)

## Validation finale
- [ ] migration-descriptions-html-careers.md supprimé
- [ ] grep -r "migration-descriptions-html-careers" audit/ retourne 0 résultats
- [ ] migration-descriptions-html.md contient toutes les balises HTML
- [ ] Spécificités careers préservées
- [ ] Fichier final <200 lignes
- [ ] ~120 lignes économisées confirmées

## Notes
- Priorité IMPORTANTE selon rapport consolidation (I2, R4)
- Duplication très élevée : 70-75%
- Effort estimé : 1-2h
- Fusion simple (contenu quasi-identique)
