---
id: 255
status: DONE
priority: MEDIUM
domain: features
dependencies: [251]
phase: 7
---

# Help System - Index global

## Objectif
Créer `audit/features/help-system/global-index.md` documentant la structure de l'index global CharGen.match

## Périmètre
**DANS le scope:**
- Structure données CharGen.match
- Organisation par type d'entité
- Clés d'indexation multiples (label, abr, labelItem)
- Peuplement index au chargement données
- Règles métier indexation

**HORS scope:**
- Implémentation technique DataHelper.initData
- Code parcours JSON
- Optimisation performance

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Structure index documentée

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\DataHelper.html (initData)
- C:\Users\gauch\PhpstormProjects\Warhammer\DescriptionHelper.html (initHelpData, updateMatch)

## Livrables
`audit/features/help-system/global-index.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome

## Structure index attendue
```
CharGen.match = {
  talent: {
    "Affable": {
      specie: ["Halfling", "Humain"],
      careerLevel: {1: ["Artiste"], 2: ["Charlatan"]}
    }
  },
  spell: {
    "Arme aethyrique": {
      lore: ["Lumière"],
      talent: ["Magie des Arcanes"]
    }
  },
  book: {
    "LDB": {
      talent: {"Affable": {id: 42, text: "page 124"}}
    }
  }
}
```
