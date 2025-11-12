---
id: 285
status: DONE
priority: LOW
domain: business-rules
dependencies: [259]
phase: 9
---

# Fusionner parsing-* business-rules/

## Objectif
Fusionner les 2 fichiers parsing-*.md de business-rules/ en un seul fichier pour éliminer 35-40% de duplication et économiser ~80 lignes.

## Contexte
L'analyse consolidation (#259) a identifié le GROUPE B : PARSING (2 fichiers, 307 lignes, 35-40% duplication) :
1. parsing-avances-caracteristiques.md (170 lignes)
2. parsing-skills-talents.md (137 lignes)

Les deux fichiers commencent par une section "Patterns techniques utilisés" identique à 100% :
```markdown
## Patterns techniques utilisés

- [pattern-parsing.md](../patterns/pattern-parsing.md) - Séparation ", "
```

## Périmètre
**DANS le scope:**
- Fusion des 2 fichiers en 1 fichier unique
- Élimination des duplications (sections "Patterns techniques", introductions)
- Conservation du contenu métier unique
- Mise à jour des références dans la KB
- Respect limite <200 lignes

**HORS scope:**
- Modification du contenu métier
- Refactorisation d'autres fichiers parsing
- Ajout de nouvelles règles de parsing

## Critères d'acceptance
- [ ] 2 fichiers fusionnés en 1 fichier unique
- [ ] Fichier final <200 lignes
- [ ] ~80 lignes économisées (duplication éliminée)
- [ ] Contenu métier complet (avances caractéristiques + skills/talents)
- [ ] Références mises à jour dans la KB
- [ ] Ancien fichier supprimé
- [ ] Aucun lien cassé

## Étapes de réalisation

### 1. Analyser les 2 fichiers
- Lire parsing-avances-caracteristiques.md et parsing-skills-talents.md
- Identifier sections communes (patterns, introduction)
- Identifier contenu unique par domaine
- Définir structure optimale

### 2. Créer fichier fusionné
Options de nommage :
- parsing-avances-wizard.md
- parsing-champs-multiples.md
- parsing-wizard-data.md

Structure suggérée :
- Introduction commune
- Patterns techniques utilisés (factorisation)
- Section 1 : Parsing avances caractéristiques
- Section 2 : Parsing skills/talents

### 3. Mettre à jour références
- Rechercher références aux 2 anciens fichiers
- Mettre à jour vers nouveau fichier
- Supprimer anciens fichiers

## Fichiers impactés

**Création:**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\parsing-avances-wizard.md (ou autre nom)

**Suppression:**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\parsing-avances-caracteristiques.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\parsing-skills-talents.md

**Mise à jour:**
- Fichiers référençant les anciens fichiers parsing-* (à identifier)

## Validation finale
- [ ] parsing-avances-caracteristiques.md supprimé
- [ ] parsing-skills-talents.md supprimé
- [ ] grep -r "parsing-avances-caracteristiques" audit/ retourne 0 résultats
- [ ] grep -r "parsing-skills-talents" audit/ retourne 0 résultats
- [ ] Nouveau fichier créé et <200 lignes
- [ ] ~80 lignes économisées confirmées
- [ ] Contenu métier complet préservé

## Notes
- Priorité MINEURE selon rapport consolidation (M1, R9)
- Duplication modérée : 35-40%
- Effort estimé : 1h
- Gain modéré mais fusion pertinente (sujets liés)
