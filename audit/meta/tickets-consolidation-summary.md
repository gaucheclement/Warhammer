# Tickets de Consolidation KB - Récapitulatif

**Date création** : 2025-11-09
**Source** : Rapport d'analyse #259 (`consolidation-report2.md`)
**Tickets créés** : 10 tickets (#278 à #287)

---

## Vue d'ensemble

Suite à l'analyse détaillée de la base de connaissances (#259), 10 tickets ont été créés pour implémenter les recommandations de consolidation.

**Impact total estimé** :
- **Fichiers réduits** : ~20 fichiers en moins
- **Lignes économisées** : ~1,100-1,300 lignes
- **Effort estimé** : 15-25 heures

---

## PRIORITÉ CRITIQUE (3 tickets)

### #278 - Supprimer pattern-subrand.md
**Domaine** : patterns
**Problème** : Pattern documentant fonctionnalité NON IMPLÉMENTÉE, toujours vide
**Action** : Supprimer fichier + mettre à jour 6 références
**Impact** : 1 fichier supprimé, 78 lignes
**Effort** : 30 min

### #279 - Fusionner patterns métadonnées
**Domaine** : patterns
**Problème** : 3 petits fichiers (index, label, book-page) traitant concepts liés
**Action** : Créer pattern-metadonnees-base.md unique
**Impact** : 3 fichiers → 1 fichier, 152 lignes finales, 27 références à mettre à jour
**Effort** : 1h

### #280 - Réduire species.md wizard à <200 lignes
**Domaine** : features
**Problème** : Fichier dépasse limite (201 lignes)
**Action** : Supprimer lignes vides redondantes, condenser "Voir aussi"
**Impact** : 201 → 198-199 lignes
**Effort** : 10-15 min

**Total CRITIQUE** : 4 fichiers réduits, économie ~80 lignes, effort ~2h

---

## PRIORITÉ IMPORTANTE (4 tickets)

### #281 - Fusionner groupe talents-* business-rules/
**Domaine** : business-rules
**Problème** : 5 fichiers talents-*.md avec 40-45% duplication structurelle
**Action** : Créer talents-architecture-effets.md unique
**Impact** : 5 fichiers → 1-2 fichiers, 808 → ~450 lignes, économie ~250-350 lignes
**Effort** : 3-4h

### #282 - Fusionner groupe migration-descriptions-html
**Domaine** : business-rules
**Problème** : 2 fichiers avec 70-75% duplication (balises HTML identiques)
**Action** : Fusionner en migration-descriptions-html.md unique
**Impact** : 2 fichiers → 1 fichier, 345 → ~220 lignes, économie ~120 lignes
**Effort** : 1-2h

### #283 - Créer filtrage-rand-system.md commun
**Domaine** : business-rules
**Problème** : 3 fichiers filtrage-*.md avec règles `rand` 100% identiques
**Action** : Créer fichier commun + alléger les 3 existants
**Impact** : 3 fichiers allégés + 1 nouveau, 537 → ~395 lignes, économie ~140 lignes
**Effort** : 2h

### #284 - Créer exemples-personnages-types.md
**Domaine** : features
**Problème** : Mêmes 3-5 exemples répétés dans 13 fichiers wizard/ (~390 lignes dupliquées)
**Action** : Créer fichier centralisé + références dans les 13 fichiers
**Impact** : 13 fichiers allégés, économie ~135-200 lignes
**Effort** : 2-3h

**Total IMPORTANT** : ~20 fichiers impactés, économie ~645-810 lignes, effort ~8-11h

---

## PRIORITÉ MINEURE (3 tickets)

### #285 - Fusionner groupe parsing-* business-rules/
**Domaine** : business-rules
**Problème** : 2 fichiers parsing-*.md avec 35-40% duplication
**Action** : Créer parsing-data-structures.md unique
**Impact** : 2 fichiers → 1 fichier, 307 → ~230 lignes, économie ~80 lignes
**Effort** : 1h

### #286 - Fusionner spécialisations skills/talents
**Domaine** : business-rules
**Problème** : 2 fichiers *-specialisations.md avec 40-45% duplication
**Action** : Créer systeme-specialisations.md unique
**Impact** : 2 fichiers → 1 fichier, 297 → ~240 lignes, économie ~60 lignes
**Effort** : 1h

### #287 - Évaluer fusion groupe resume-* wizard/
**Domaine** : features
**Problème** : 5 fichiers resume-*.md avec 31% duplication
**Action** : **Phase 1** Investigation GO/NO-GO, **Phase 2** Fusion SI validée
**Impact** : SI GO : 5 fichiers → 1 fichier, 854 → ~580-600 lignes, économie ~250-270 lignes
**Effort** : Investigation 1-2h, Exécution SI GO 3-4h

**Total MINEUR** : ~9 fichiers impactés, économie ~140-410 lignes (selon GO/NO-GO #269), effort ~3-7h

---

## RÉCAPITULATIF GLOBAL

| Priorité | Tickets | Fichiers impactés | Économie lignes | Effort estimé |
|----------|---------|-------------------|-----------------|---------------|
| **CRITIQUE** | 3 | 4 | ~80 lignes | ~2h |
| **IMPORTANTE** | 4 | ~20 | ~645-810 lignes | ~8-11h |
| **MINEURE** | 3 | ~9 | ~140-410 lignes | ~3-7h |
| **TOTAL** | **10** | **~33** | **~865-1,300 lignes** | **~13-20h** |

---

## ORDRE D'EXÉCUTION RECOMMANDÉ

### Sprint 1 : Actions critiques (2h)
1. **#278** - Supprimer pattern-subrand (30 min)
2. **#280** - Réduire species.md (15 min)
3. **#279** - Fusionner patterns métadonnées (1h)

**Validation** : Tous fichiers respectent limite 200 lignes ✅, patterns orphelins éliminés ✅

### Sprint 2 : Consolidation business-rules/ (5-7h)
4. **#282** - Fusionner migration-html (1-2h)
5. **#283** - Créer filtrage-rand-system (2h)
6. **#281** - Fusionner talents-* (3-4h)

**Validation** : ~600 lignes économisées, architecture business-rules/ clarifiée

### Sprint 3 : Consolidation features/ (2-3h)
7. **#284** - Créer exemples-personnages-types (2-3h)

**Validation** : Exemples centralisés, 13 fichiers wizard/ allégés

### Sprint 4 (Optionnel) : Actions mineures (3-7h)
8. **#285** - Fusionner parsing-* (1h)
9. **#286** - Fusionner spécialisations (1h)
10. **#287** - Évaluer fusion resume-* (1-5h selon décision)

---

## VALIDATION GLOBALE APRÈS TOUS TICKETS

### Métriques cibles
- [ ] Aucun fichier >200 lignes
- [ ] Aucun pattern non utilisé (0 références)
- [ ] Aucun code technique dans KB
- [ ] Réduction ≥15% fichiers avec redondances
- [ ] Réduction ≥800 lignes totales

### Tests de non-régression
- [ ] Tous liens internes valides (aucun lien mort)
- [ ] Toutes références patterns valides
- [ ] Contenu métier 100% préservé
- [ ] Navigation améliorée (fichiers consolidés plus clairs)

---

## DÉPENDANCES ENTRE TICKETS

**Aucune dépendance stricte** - Tous les tickets peuvent être exécutés indépendamment dans n'importe quel ordre (sauf ordre recommandé pour efficacité).

**Recommandation** : Exécuter dans l'ordre des priorités (CRITIQUE → IMPORTANTE → MINEURE) pour maximiser l'impact rapidement.

---

## NOTES IMPORTANTES

### Respect de la limite 200 lignes
Tous les nouveaux fichiers créés doivent respecter la limite stricte de 200 lignes. Si un fichier fusionné dépasse légèrement (ex: #263 talents-architecture-effets.md), envisager split en 2 fichiers thématiques.

### Préservation du contenu métier
**AUCUNE perte d'information métier acceptable**. Les fusions consolident la structure répétée, pas le contenu unique.

### Validation après chaque ticket
Après chaque ticket, valider :
1. `wc -l` sur tous fichiers modifiés
2. `grep -rn "ancien-fichier.md"` → 0 résultats
3. Lecture rapide fichiers fusionnés (cohérence)

---

**Création tickets** : 2025-11-09
**Prêt pour exécution** : ✅
