---
id: 283
status: DONE
priority: MEDIUM
domain: business-rules
dependencies: [259]
phase: 9
---

# Créer filtrage-rand-system.md commun

## Objectif
Créer un fichier commun filtrage-rand-system.md pour factoriser le système de correspondance rand identique dans les 3 fichiers filtrage-*.md et économiser ~150 lignes.

## Contexte
L'analyse consolidation (#259) a identifié le GROUPE A : FILTRAGE (3 fichiers, 537 lignes, 60-70% duplication) :
1. filtrage-careers-espece.md (190 lignes)
2. filtrage-careers-region.md (154 lignes)
3. filtrage-spells-lore.md (183 lignes)

Les 3 fichiers partagent une section "Mécanisme de correspondance" identique à 100% décrivant le système rand.

**Duplication identifiée (citations rapport) :**
```markdown
**Règles** :
- `carrière.rand[espèce.refCareer]` = nombre → **ACCESSIBLE**
- `carrière.rand[espèce.refCareer]` = "" → **NON ACCESSIBLE**
- Clé absente → **NON ACCESSIBLE**
```

Structure identique, seule la clé change (espèce.refCareer, région, lore).

## Périmètre
**DANS le scope:**
- Création filtrage-rand-system.md décrivant le mécanisme générique
- Refactorisation des 3 fichiers pour référencer le fichier commun
- Conservation du contenu spécifique par domaine
- Respect limite <200 lignes par fichier

**HORS scope:**
- Modification des règles métier
- Ajout de nouveaux types de filtrage
- Refactorisation d'autres fichiers business-rules/

## Critères d'acceptance
- [ ] Fichier filtrage-rand-system.md créé (<150 lignes)
- [ ] Mécanisme rand générique documenté
- [ ] 3 fichiers filtrage-*.md refactorisés pour référencer le fichier commun
- [ ] ~150 lignes économisées (duplication éliminée)
- [ ] Contenu spécifique préservé dans chaque fichier
- [ ] Tous fichiers <200 lignes
- [ ] Références cohérentes

## Étapes de réalisation

### 1. Créer filtrage-rand-system.md
- Documenter le système rand générique
- Expliquer mécanisme clé-valeur (nombre/""/""/absent)
- Fournir exemples génériques
- Référencer pattern-generation-aleatoire.md

### 2. Refactoriser les 3 fichiers filtrage-*
Pour chaque fichier :
- Supprimer section "Mécanisme de correspondance" dupliquée
- Ajouter référence vers filtrage-rand-system.md
- Conserver contenu spécifique au domaine
- Vérifier cohérence

### 3. Valider
- Vérifier tous fichiers <200 lignes
- Calculer lignes économisées
- Vérifier liens fonctionnent

## Fichiers impactés

**Création:**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\filtrage-rand-system.md

**Modification:**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\filtrage-careers-espece.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\filtrage-careers-region.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\business-rules\filtrage-spells-lore.md

## Validation finale
- [ ] filtrage-rand-system.md créé et <150 lignes
- [ ] 3 fichiers filtrage-*.md référencent filtrage-rand-system.md
- [ ] Section "Mécanisme de correspondance" supprimée des 3 fichiers
- [ ] ~150 lignes économisées confirmées
- [ ] Tous fichiers <200 lignes
- [ ] Contenu spécifique préservé dans chaque fichier

## Notes
- Priorité IMPORTANTE selon rapport consolidation (I3, R6)
- Duplication très élevée : 60-70%
- Effort estimé : 2h
- Approche : factorisation plutôt que fusion complète
