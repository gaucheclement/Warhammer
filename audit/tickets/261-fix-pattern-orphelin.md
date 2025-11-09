---
id: 261
status: DONE
priority: CRITICAL
domain: patterns
dependencies: [259]
phase: 9
---

# Patterns - Fusion pattern-tiret.md orphelin

## Objectif
Fusionner le contenu de pattern-tiret.md (0 références) dans pattern-validation-valeurs.md et supprimer le fichier orphelin

## Périmètre
**DANS le scope:**
- Lecture pattern-tiret.md
- Intégration contenu dans pattern-validation-valeurs.md
- Suppression pattern-tiret.md
- Mise à jour _index.md si nécessaire

**HORS scope:**
- Modification autres patterns
- Création nouveaux patterns

## Critères d'acceptance
- [ ] Contenu pattern-tiret.md intégré dans pattern-validation-valeurs.md
- [ ] Fichier pattern-tiret.md supprimé
- [ ] patterns/_index.md mis à jour (retrait référence)
- [ ] grep -r "pattern-tiret" audit/ ne retourne rien (sauf _index.md historique)
- [ ] pattern-validation-valeurs.md < 200 lignes

## Contexte (depuis rapport consolidation)

**Pattern orphelin** : pattern-tiret.md a **0 références** dans toute la KB
**Raison** : Contenu probablement redondant avec pattern-validation-valeurs.md

## Étapes d'exécution
1. Lire pattern-tiret.md
2. Identifier sections uniques non présentes dans pattern-validation-valeurs.md
3. Intégrer sections uniques dans pattern-validation-valeurs.md
4. Supprimer pattern-tiret.md
5. Mettre à jour patterns/_index.md
6. Vérifier aucune référence cassée

## Effort estimé
45 minutes

## Validation finale
- [ ] ls audit/patterns/pattern-tiret.md retourne erreur (fichier supprimé)
- [ ] grep -r "pattern-tiret" audit/ | grep -v "_index.md" retourne vide
- [ ] pattern-validation-valeurs.md contient info utile de l'ancien pattern-tiret
- [ ] Commit avec message explicite
