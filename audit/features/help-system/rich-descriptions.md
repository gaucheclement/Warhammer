# Help System - Descriptions enrichies

## Vue d'ensemble

Le système de descriptions enrichies transforme automatiquement le texte brut des descriptions en HTML interactif avec liens cliquables. Chaque mention d'une entité du jeu devient un lien permettant d'afficher instantanément sa fiche détaillée.

## Transformation automatique

Le système parcourt chaque description et détecte les mentions d'entités:
- Comparaison avec l'index allForHelp
- Correspondance exacte (insensible à la casse et aux accents)
- Labels les plus longs testés en premier

### Gestion des variantes

**Pluriels:** "Compétence" détecte "Compétences", ajout automatique de "s"

**Modificateurs:** "+5 en Agilité" → Lien sur "Agilité", préserve "+5"

**Spécialisations:** "Art (Calligraphie)" → Détection complète avec parenthèses

## Format d'affichage

### Liens cliquables

Format HTML: `<span class="showHelp" data-type="talent" data-id="affable">Affable</span>`

Attributs: class (identifie lien aide), data-type (type entité), data-id (ID unique)

### Popup d'aide

Au clic: récupération depuis data[type].parID[id], génération HTML, affichage popup

**Desktop:** Panel latéral `.right_panel` avec onglets possibles
**Mobile:** Modal dialog centré avec overlay

## Gestion du HTML existant

### Balises préservées

Formatage: `<i>`, `<b>`, `<BR>` → Préservés
Structure: `<ul><li>`, `<table>` → Préservés

### Algorithme

1. Parsing HTML préservant balises existantes
2. Transformation du texte hors balises uniquement
3. Remplacement progressif par liens
4. Reconstruction HTML final

### Évitement des conflits

- Pas de re-transformation si déjà dans `<span class="showHelp">`
- Balises avec attributs préservées intactes

## Exemples de transformations

### Gain de caractéristique

**Texte original:**
```
Gain +5 en Agilité
```

**HTML généré:**
```
Gain +5 en <span class="showHelp" data-type="characteristic" data-id="agilite">Agilité</span>
```

### Référence de carrière

**Texte original:**
```
Carrière Agitateur niveau 2
```

**HTML généré:**
```
Carrière <span class="showHelp" data-type="career" data-id="agitateur">Agitateur</span> niveau 2
```

### Domaine magique

**Texte original:**
```
Domaine de Feu (Aqshy)
```

**HTML généré:**
```
<span class="showHelp" data-type="lore" data-id="feu">Domaine de Feu (Aqshy)</span>
```

### Référence bibliographique

**Texte original:**
```
Page 42 LDB
```

**HTML généré:**
```
<span class="showHelp" data-type="book" data-id="ldb">Page 42 LDB</span>
```

## Contenu des popups

### Structure

**Avec onglets:** Générés si `desc` est un objet multi-clés (Info, Effets, Règles)
**Simple:** Titre + description si une seule section

### Métadonnées

En-tête: Titre entité, référence livre ("LDB p124")
Sections: Description, Effets, Restrictions, Règles

### Aide récursive

Popups contiennent des liens vers autres entités, navigation en cascade possible

## Règles métier

### Priorités

1. Labels longs avant courts
2. Spécialisations avant génériques ("Art (Calligraphie)" avant "Art")
3. Labels exacts avant variantes

### Exclusions

Pas de transformation si:
- Déjà dans `<span class="showHelp">`
- Auto-référence (entité ne se lie pas à elle-même)

### Cas spéciaux

**Bonus:** "Bonus de Force" ou "BF" → Lien vers "Force" (via champ `abr`)
**Groupes:** "Compétences de base" → Pas de lien (trop général)

## Validation

**Intégrité:** data-id vers entités existantes, data-type valides, pas de liens cassés
**Qualité:** HTML bien formé, pas de doublons, liens cliquables
**Performance:** Transformation une fois, résultat en cache, regex précompilées

## Voir aussi

- [inverse-relations.md](./inverse-relations.md) - Relations "Utilisé par" affichées dans les popups
- [bidirectional-navigation.md](./bidirectional-navigation.md) - Navigation entre entités via les liens
- [book-references.md](./book-references.md) - Affichage des références de pages
- [global-index.md](./global-index.md) - Index allForHelp utilisé pour la détection
