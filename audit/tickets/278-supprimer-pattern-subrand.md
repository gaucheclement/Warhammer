---
id: 278
status: DONE
priority: HIGH
domain: patterns
dependencies: [259]
phase: 9
---

# Patterns - Supprimer pattern-subrand.md (NON IMPLÉMENTÉ)

## Objectif
Supprimer le pattern-subrand.md qui documente une fonctionnalité non implémentée et toujours vide, et mettre à jour les 6 références.

## Contexte
Le rapport d'analyse #259 a identifié que pattern-subrand.md documente un "système de tirage aléatoire à deux niveaux" explicitement marqué comme "NON IMPLÉMENTÉ" avec toutes les valeurs `subRand` vides dans les tables.

**Citation du pattern** :
> Statut actuel: NON IMPLÉMENTÉ - Fonctionnalité future potentielle
> Dans toutes les tables actuelles, `subRand` vaut ""

## Périmètre

**DANS le scope:**
- Suppression du fichier `audit/patterns/pattern-subrand.md`
- Identification des 6 références au pattern
- Mise à jour ou suppression des références
- Mise à jour `patterns/_index.md`
- Vérification qu'aucune logique métier ne dépend de subRand

**HORS scope:**
- Implémentation future du système subRand
- Modification des tables de données
- Ajout de nouvelles fonctionnalités

## Critères d'acceptance
- [ ] Fichier `pattern-subrand.md` supprimé
- [ ] Les 6 références identifiées et mises à jour
- [ ] `patterns/_index.md` ne liste plus pattern-subrand
- [ ] Aucun lien mort vers pattern-subrand.md
- [ ] Grep "pattern-subrand" retourne 0 résultats dans audit/
- [ ] Grep "subRand" dans database/*.md confirme toujours "" (aucune utilisation)

## Étapes de réalisation

### 1. Identifier toutes les références
```bash
grep -rn "pattern-subrand" audit/
```

### 2. Mettre à jour les références
Pour chaque fichier référençant pattern-subrand :
- Si simple mention dans liste patterns : supprimer la ligne
- Si explication d'utilisation : supprimer la section ou remplacer par note "Non utilisé actuellement"

### 3. Mettre à jour patterns/_index.md
- Retirer pattern-subrand de la liste
- Ajuster le compteur total (17 → 16 patterns)

### 4. Supprimer le fichier
```bash
rm audit/patterns/pattern-subrand.md
```

### 5. Validation finale
```bash
# Aucune référence ne doit subsister
grep -rn "pattern-subrand\|subrand" audit/

# Vérifier que les liens ne sont pas cassés
# Lire quelques fichiers qui référençaient pattern-subrand
```

## Fichiers impactés (estimation)
- `audit/patterns/pattern-subrand.md` (SUPPRESSION)
- `audit/patterns/_index.md` (mise à jour)
- ~6 fichiers avec références (mise à jour)

## Validation finale
- [ ] `pattern-subrand.md` n'existe plus
- [ ] Aucune erreur grep "pattern-subrand"
- [ ] `_index.md` liste 16 patterns (au lieu de 17)
- [ ] Aucun lien mort détecté

## Notes
- Pattern documentait fonctionnalité future jamais implémentée
- Toutes les tables ont `subRand: ""` (vide)
- Suppression ne cause aucune perte d'information métier
- Si besoin futur de subRand, le pattern pourra être recréé
