---
id: 281
status: DONE
priority: MEDIUM
domain: business-rules
dependencies: [259]
phase: 9
---

# Fusionner groupe talents-* business-rules/

## Objectif
Fusionner les 5 fichiers talents-*.md de business-rules/ en 1-2 fichiers cohérents pour éliminer 40-45% de duplication structurelle et économiser ~250 lignes.

## Contexte
L'analyse consolidation (#259) a identifié le GROUPE D : TALENTS (5 fichiers, 808 lignes, 40-45% duplication) :
1. talents-modification-caracteristiques.md (182 lignes)
2. talents-deblocage-talents.md (167 lignes)
3. talents-ajout-skills-magie.md (160 lignes)
4. talents-specialisations.md (142 lignes)
5. talents-rangs-multiples.md (157 lignes)

Tous les fichiers commencent par une section "Vue d'ensemble" identique à ~50% et partagent des patterns de structure similaires.

## Périmètre
**DANS le scope:**
- Fusion des 5 fichiers en 1-2 fichiers cohérents
- Élimination des duplications (sections "Vue d'ensemble", références patterns)
- Conservation de tout le contenu métier unique
- Mise à jour des références dans la KB
- Respect limite <200 lignes par fichier

**HORS scope:**
- Modification du contenu métier
- Refactorisation d'autres fichiers business-rules/
- Ajout de nouvelles règles métier

## Critères d'acceptance
- [ ] 5 fichiers fusionnés en 1-2 fichiers
- [ ] Nouveau(x) fichier(s) <200 lignes chacun
- [ ] ~250 lignes économisées (duplication éliminée)
- [ ] Contenu métier complet préservé
- [ ] Références mises à jour dans la KB
- [ ] Anciens fichiers supprimés
- [ ] Aucun lien cassé

## Étapes de réalisation

### 1. Analyser les 5 fichiers
Lire et identifier :
- Sections communes à factoriser
- Contenu métier unique par fichier
- Structure optimale pour fusion

### 2. Définir architecture cible
Options :
- 1 fichier talents-architecture-effets.md (<200L)
- 2 fichiers : talents-effets-caracteristiques.md + talents-effets-avances.md

### 3. Créer nouveaux fichiers
- Fusionner contenu métier unique
- Factoriser sections communes
- Maintenir cohérence structurelle

### 4. Mettre à jour références
- Rechercher références aux 5 anciens fichiers
- Mettre à jour vers nouveaux fichiers
- Supprimer anciens fichiers

## Fichiers impactés

**Création (option 1):**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\talents-architecture-effets.md

**Création (option 2):**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\talents-effets-caracteristiques.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\talents-effets-avances.md

**Suppression:**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\talents-modification-caracteristiques.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\talents-deblocage-talents.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\talents-ajout-skills-magie.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\talents-specialisations.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\talents-rangs-multiples.md

**Modification:**
- Fichiers référençant les anciens fichiers talents-* (à identifier)

## Validation finale
- [ ] 5 fichiers talents-* supprimés
- [ ] 1-2 nouveaux fichiers créés, chacun <200 lignes
- [ ] grep -r "talents-modification-caracteristiques" audit/ retourne 0 résultats
- [ ] grep -r "talents-deblocage-talents" audit/ retourne 0 résultats
- [ ] grep -r "talents-ajout-skills-magie" audit/ retourne 0 résultats
- [ ] grep -r "talents-specialisations" audit/ retourne 0 résultats (ou uniquement skills-specialisations)
- [ ] grep -r "talents-rangs-multiples" audit/ retourne 0 résultats
- [ ] Contenu métier complet préservé
- [ ] ~250 lignes économisées

## Notes
- Priorité IMPORTANTE selon rapport consolidation (I1, R3)
- Gain majeur : 5 fichiers → 1-2 fichiers, ~250 lignes économisées
- Effort estimé : 3-4h
- Plus grande opportunité de fusion business-rules/
