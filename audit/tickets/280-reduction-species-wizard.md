---
id: 280
status: DONE
priority: HIGH
domain: features
dependencies: [259]
phase: 9
---

# Réduire species.md wizard à <200 lignes

## Objectif
Réduire features/wizard/species.md de 201 lignes à <200 lignes pour respecter la règle stricte de limite documentaire.

## Contexte
L'analyse consolidation (#259) a identifié que features/wizard/species.md dépasse la limite de 200 lignes :
- Fichier actuel : 201 lignes (+1 ligne au-dessus de la limite)
- Seul fichier wizard/ à dépasser la limite
- Dépassement mineur (1 ligne)

## Périmètre
**DANS le scope:**
- Réduction de features/wizard/species.md à 198-199 lignes maximum
- Suppression de lignes vides redondantes
- Conservation de tout le contenu métier essentiel

**HORS scope:**
- Modification du contenu métier
- Refactorisation majeure du fichier
- Suppression d'informations métier importantes

## Critères d'acceptance
- [ ] Fichier features/wizard/species.md réduit à <200 lignes
- [ ] Aucune perte d'information métier critique
- [ ] Fichier reste cohérent et lisible
- [ ] Validation wc -l confirme <200 lignes

## Étapes de réalisation

### 1. Analyser le fichier
- Lire C:\Users\gauch\PhpstormProjects\Warhammer\audit\features\wizard\species.md
- Identifier lignes vides multiples consécutives
- Identifier sections verbales redondantes

### 2. Réduire le fichier
Options :
- Supprimer 2-3 lignes vides redondantes
- Condenser 1 exemple verbeux si nécessaire
- Fusionner sections avec espacement excessif

### 3. Valider
- Vérifier wc -l < 200
- Relire pour cohérence
- Vérifier aucun lien cassé

## Fichiers impactés

**Modification:**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\features\wizard\species.md

## Validation finale
- [ ] wc -l features/wizard/species.md retourne <200
- [ ] Fichier reste lisible et cohérent
- [ ] Aucune information métier perdue
- [ ] Toutes les sections présentes

## Notes
- Priorité CRITIQUE selon rapport consolidation (C3)
- Dépassement mineur (1 ligne seulement)
- Effort estimé : 10 minutes
- Solution simple : suppression lignes vides redondantes
