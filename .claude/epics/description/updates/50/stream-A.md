---
issue: 50
stream: Composants de base réutilisables
agent: frontend-specialist
started: 2025-11-02T20:31:41Z
completed: 2025-11-02T21:30:00Z
status: completed
---

# Stream A: Composants de base réutilisables

## Scope
Créer les composants Svelte fondamentaux qui remplaceront les fonctions de génération HTML (showHelpText, toHtmlList, rankToImg, etc.)

## Files Created
- `src/components/descriptions/base/EntityLink.svelte` (remplace showHelpText)
- `src/components/descriptions/base/DescriptionSection.svelte`
- `src/components/descriptions/base/DescriptionList.svelte` (remplace toHtmlList)
- `src/components/descriptions/base/RankIcon.svelte` (remplace rankToImg)
- `src/components/descriptions/base/StatTable.svelte`

## Progress

### Completed Tasks
- [x] Créé EntityLink.svelte avec support de navigation par événement
- [x] Créé DescriptionSection.svelte comme conteneur de section avec titre optionnel
- [x] Créé DescriptionList.svelte avec support des items cliquables et simples
- [x] Créé RankIcon.svelte avec les 4 icônes de rang et support thème clair/sombre
- [x] Créé StatTable.svelte pour afficher les caractéristiques des créatures
- [x] Committé tous les composants (commit 911c0fd)

## Component Details

### EntityLink.svelte
Remplace la fonction `showHelpText()` qui générait `<span class="showHelp">`.

**Props:**
- `id`: ID de l'entité
- `type`: Type d'entité (skill, talent, career, etc.)
- `label`: Texte à afficher
- `tooltip`: Texte optionnel pour le titre
- `broken`: Booléen pour indiquer une référence cassée

**Events:**
- `navigate`: Émis avec `{type, id}` lors du clic

**Features:**
- Navigation au clavier (Enter/Space)
- Style cohérent avec les liens existants
- Support des références cassées
- Support du focus visible pour l'accessibilité

### DescriptionSection.svelte
Conteneur générique pour organiser les descriptions.

**Props:**
- `title`: Titre optionnel de la section

**Slot:**
- Contenu de la section

**Features:**
- Bordure inférieure pour le titre
- Espacement cohérent
- Responsive

### DescriptionList.svelte
Remplace la fonction `toHtmlList()`.

**Props:**
- `label`: Label de la liste
- `items`: Array d'objets `{label, id?, type?}` ou strings simples

**Events:**
- `navigate`: Propagé depuis les EntityLink

**Features:**
- Supporte les items cliquables (avec id/type) et simples (strings)
- Utilise EntityLink pour les items cliquables
- Style de liste avec puces
- Responsive

### RankIcon.svelte
Remplace la fonction `rankToImg()`.

**Props:**
- `rank`: Numéro de rang (1-4)
- `label`: Label optionnel (défaut: "Rang {rank}")

**Features:**
- 4 icônes SVG intégrées:
  - Rang 1: Croix (Cuivre, blanc)
  - Rang 2: Épée (Argent, bronze)
  - Rang 3: Crâne (Or, argent)
  - Rang 4: Bouclier (Platine, jaune)
- Support du thème clair avec icônes remplies et backgrounds de couleur
- Tooltip avec le label du rang
- Accessible (role="img" avec aria-label)

### StatTable.svelte
Pour afficher les tables de caractéristiques.

**Props:**
- `stats`: Objet avec les valeurs des caractéristiques
- `showAdditional`: Booléen pour afficher les stats additionnelles (défaut: true)

**Features:**
- Table principale avec 11 caractéristiques: M, CC, CT, F, E, I, Ag, Dex, Int, FM, Soc
- Stats additionnelles: Blessures, Bonus de Force, Bonus d'Endurance, Points de Vie
- Style cohérent avec le thème (backgrounds, borders)
- Responsive avec adaptation pour mobile
- Affiche '-' pour les valeurs non définies

## Technical Details

**Architecture:**
- Tous les composants suivent le pattern BEM pour le CSS
- Utilisation des CSS variables du thème pour cohérence
- Props typées avec JSDoc
- Événements Svelte standard (createEventDispatcher)
- Support du thème clair/sombre
- Accessibilité (ARIA, focus visible, navigation clavier)
- Responsive design

**Réutilisabilité:**
- Composants simples et focalisés sur une seule responsabilité
- Props claires et bien documentées
- Pas de dépendances entre composants (sauf EntityLink dans DescriptionList)
- Peuvent être utilisés dans n'importe quelle partie de l'application

## Next Steps (Stream B/C)

Ces composants de base sont maintenant prêts à être utilisés par:

1. **Stream B**: Refactoriser db-descriptions.js pour retourner des données structurées au lieu de HTML
2. **Stream C**: Créer les composants de description spécifiques (CareerDescription, TalentDescription, etc.) qui utiliseront ces composants de base

## Status: COMPLETED

Tous les composants de base sont créés, testés stylistiquement, et committés. Le stream A est complet et prêt pour la coordination avec les streams B et C.
