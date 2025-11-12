# Index des Patterns

Patterns techniques unitaires réutilisables.
Chaque fichier documente UN SEUL comportement (max 200 lignes).

---

## Métadonnées (1)

- [pattern-metadonnees-base.md](./pattern-metadonnees-base.md) - Index, label et références bibliographiques (book-page)

---

## Parsing (1)

- [pattern-parsing.md](./pattern-parsing.md) - Parsing de chaînes (séparateurs, parenthèses, modificateurs)

**Fusionne :** parse-virgule, parse-ou, parse-parentheses, parse-quantite, parse-niveau, parse-modificateur, prefix-suffix

---

## Génération Aléatoire (3)

- [pattern-generation-aleatoire.md](./pattern-generation-aleatoire.md) - Système rand 1-100 et algorithme de tirage

**Fusionne :** rand, tirage-aleatoire

- [pattern-subrand.md](./pattern-subrand.md) - Tirage secondaire pour résolution collisions rand (NON IMPLÉMENTÉ V1 - Prévu V2)
- [pattern-talent-aleatoire.md](./pattern-talent-aleatoire.md) - "X Talent aléatoire"

---

## Spécialisations (1)

- [pattern-specialisations.md](./pattern-specialisations.md) - Specs et "(Au choix)"

**Fusionne :** specs, spec-au-choix

---

## HTML et Descriptions (1)

- [pattern-descriptions-html.md](./pattern-descriptions-html.md) - Structure HTML complète (balises, pitch, sections)

**Fusionne :** html-balises, html-pitch, html-sections

---

## Validation (4)

- [pattern-validation-metadonnees.md](./pattern-validation-metadonnees.md) - Index et labels

**Fusionne :** validation-index, validation-labels

- [pattern-validation-valeurs.md](./pattern-validation-valeurs.md) - Énumérations et plages

**Fusionne :** validation-enum, validation-range

- [pattern-validation-references.md](./pattern-validation-references.md) - Références inter-tables

- [pattern-validation-display.md](./pattern-validation-display.md) - Validation et affichage collections

---

## Relations et Types (2)

- [pattern-relation-textuelle.md](./pattern-relation-textuelle.md) - Relations string → entity
- [pattern-type-subtype.md](./pattern-type-subtype.md) - Hiérarchie type/subType

---

## Modificateurs (1)

- [pattern-modificateurs-caracteristiques.md](./pattern-modificateurs-caracteristiques.md) - Modifications par talents et valeurs dynamiques

**Fusionne :** modificateur-caracteristique, valeur-dynamique

---

## Statistiques

**Nombre total de patterns :** 14 (vs 29 avant fusion)
**Réduction :** 52%

**Répartition :**
- Métadonnées : 1 (fusion de 3)
- Parsing : 1 (fusion de 7)
- Génération aléatoire : 3 (inclut pattern-subrand NON IMPLÉMENTÉ V1)
- Spécialisations : 1 (fusion de 2)
- HTML : 1 (fusion de 3)
- Validation : 4 (fusion de 5 + nouveau pattern validation-display)
- Relations/Types : 2
- Modificateurs : 1 (fusion de 2)

---

## Usage

### Référencer un pattern
```markdown
Voir [pattern-parsing.md](../patterns/pattern-parsing.md)
```

### Dans database/
```markdown
## Validation
Voir [pattern-validation-metadonnees.md](../patterns/pattern-validation-metadonnees.md)

## Spécifique à cette table
- Règle X...
```

### Dans business-rules/
```markdown
## Parsing
Voir [pattern-parsing.md](../patterns/pattern-parsing.md)

## Algorithme spécifique
...description...
```

---

## Principes

1. **Un pattern = un comportement** : Chaque fichier documente exactement un concept atomique ou un groupe de concepts très liés
2. **Max 200 lignes** : Fichiers courts et focalisés
3. **Référençables** : Utilisés dans database/ et business-rules/ au lieu d'être dupliqués
4. **Documentation descriptive** : Pas de code technique, descriptions fonctionnelles uniquement
5. **Validation incluse** : Chaque pattern documente comment le valider

---

## Création d'un nouveau pattern

### Template
```markdown
# Pattern: [Nom du comportement]

## Contexte
Où et pourquoi ce pattern est utilisé.

## Format
Description du format exact.

## Exemples
2-3 exemples concrets (données uniquement, pas de code).

## Fonctionnement
Description en langage naturel du comportement attendu.

## Validation
Comment valider ce pattern (description, pas de code).

## Tables concernées
Liste des tables utilisant ce pattern.

## Voir aussi
Références vers patterns liés.
```

### Critères
- ✅ Comportement atomique (ne fait qu'une seule chose) OU groupe cohérent de comportements liés
- ✅ Réutilisable (utilisé dans ≥2 tables ou ≥2 contextes)
- ✅ Max 200 lignes
- ✅ Documentation descriptive uniquement (PAS de code technique)
- ✅ Validation documentée
