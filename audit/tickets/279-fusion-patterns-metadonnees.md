---
id: 279
status: DONE
priority: HIGH
domain: patterns
dependencies: [259]
phase: 9
---

# Fusion patterns métadonnées (index + label + book-page)

## Objectif
Fusionner les 3 patterns métadonnées fragmentés (pattern-index.md, pattern-label.md, pattern-book-page.md) en un seul fichier pattern-metadonnees-base.md pour éliminer la fragmentation et améliorer la cohérence.

## Contexte
L'analyse consolidation (#259) a identifié que 3 petits patterns (41, 45, 66 lignes) traitent tous des métadonnées de base (identifiants et sources) de manière fragmentée :
- pattern-index.md : ID numérique unique (8 références)
- pattern-label.md : ID textuel unique (11 références)
- pattern-book-page.md : Référence bibliographique (8 références)

Total : 152 lignes, 27 références combinées

## Périmètre
**DANS le scope:**
- Fusion des 3 fichiers en pattern-metadonnees-base.md
- Conservation de tout le contenu métier
- Mise à jour des 27 références dans la KB
- Suppression des 3 anciens fichiers
- Mise à jour de patterns/_index.md

**HORS scope:**
- Modification du contenu métier
- Refactorisation d'autres patterns
- Ajout de nouvelles métadonnées

## Critères d'acceptance
- [ ] Fichier pattern-metadonnees-base.md créé (152 lignes)
- [ ] Contenu des 3 patterns fusionné sans perte d'information
- [ ] Structure cohérente avec 3 sections principales (index, label, book-page)
- [ ] 27 références mises à jour dans features/, business-rules/, database/
- [ ] 3 anciens fichiers supprimés (pattern-index.md, pattern-label.md, pattern-book-page.md)
- [ ] patterns/_index.md mis à jour
- [ ] Aucun lien cassé dans la KB
- [ ] Fichier final <200 lignes

## Étapes de réalisation

### 1. Créer pattern-metadonnees-base.md
- Créer C:\Users\gauch\PhpstormProjects\Warhammer\audit\patterns\pattern-metadonnees-base.md
- Structure en 3 sections : Index, Label, Book-Page
- Fusionner le contenu des 3 fichiers sources

### 2. Identifier toutes les références
Rechercher dans la KB :
- Références à pattern-index.md (8 attendues)
- Références à pattern-label.md (11 attendues)
- Références à pattern-book-page.md (8 attendues)

### 3. Mettre à jour les références
- Remplacer tous les liens vers les 3 anciens patterns
- Pointer vers pattern-metadonnees-base.md avec ancres si nécessaire

### 4. Nettoyer
- Supprimer les 3 anciens fichiers
- Mettre à jour patterns/_index.md
- Vérifier aucun lien cassé

## Fichiers impactés

**Création:**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\patterns\pattern-metadonnees-base.md

**Suppression:**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\patterns\pattern-index.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\patterns\pattern-label.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\patterns\pattern-book-page.md

**Modification:**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\patterns\_index.md
- 27 fichiers dans features/, business-rules/, database/ (à identifier)

## Validation finale
- [ ] grep -r "pattern-index\.md" audit/ retourne 0 résultats
- [ ] grep -r "pattern-label\.md" audit/ retourne 0 résultats
- [ ] grep -r "pattern-book-page\.md" audit/ retourne 0 résultats
- [ ] grep -r "pattern-metadonnees-base\.md" audit/ retourne 27+ résultats
- [ ] Tous les liens fonctionnent
- [ ] Aucun fichier >200 lignes créé

## Notes
- Priorité CRITIQUE selon rapport consolidation (R2)
- Gain : 3 fichiers → 1 fichier, amélioration cohérence
- Effort estimé : 1h (fusion + mise à jour 27 références)
- Impact : Réduction fragmentation patterns/
