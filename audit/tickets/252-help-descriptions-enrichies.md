---
id: 252
status: DONE
priority: MEDIUM
domain: features
dependencies: [251]
phase: 7
---

# Help System - Descriptions enrichies

## Objectif
Créer `audit/features/help-system/rich-descriptions.md` documentant l'affichage descriptions avec liens cliquables et contexte

## Périmètre
**DANS le scope:**
- Transformation texte brut en HTML enrichi
- Liens automatiques entre entités
- Format affichage descriptions (popup, panel)
- Gestion HTML existant (balises <i>, <b>, <BR>)
- Exemples concrets Warhammer

**HORS scope:**
- Implémentation technique showHelpText
- Code parsing HTML
- Styles CSS

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers autres fichiers KB
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\DescriptionHelper.html
- C:\Users\gauch\PhpstormProjects\Warhammer\Helper.html (showPopin)

## Livrables
`audit/features/help-system/rich-descriptions.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome

## Exemples transformations attendues
- "Gain +5 en Agilité" → Lien vers caractéristique Agilité
- "Carrière Agitateur" → Lien vers fiche carrière complète
- "Domaine de Feu (Aqshy)" → Lien vers domaine avec sorts listés
- "Page 42 LDB" → Référence livre avec popup description
