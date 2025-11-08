# Migration des Descriptions HTML

## Patterns techniques utilisés

- [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md) - Balises autorisées, Pitch en italique, Structuration sections

## Vue d'ensemble

Les descriptions dans Species (champ `desc`) utilisent du HTML pour formatter le contenu narratif et créer des liens interactifs vers d'autres entités.

**Objectif métier** : Préserver contenu narratif riche tout en modernisant format pour maintenance facilitée et meilleure UX.

## Structure actuelle

Voir [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md) pour liste complète balises utilisées.

**Balises principales** : `<b>`, `<br>`, `<h3>`, `<ul>`, `<li>`, `<span class="showHelp">`

### Exemples de contenu

**Humains** :
```html
<b>Exemples</b>: Adhemar, Anders, Artur...<br><br>
Au Reikland, les noms de famille...
```

**Ogres avec sections** :
```html
<h3> Titres des ogres </h3><br><br>
Les ogres adoptent souvent un titre...<br><br>
<b>Exemples :</b> Dents d'Or, Peaux de Fer...
```

### Sections typiques

Voir [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md) pour structuration détaillée.

1. **Contexte culturel** : Conventions de nommage/apparence
2. **Exemples concrets** : Listes noms, traits
3. **Variations régionales** : Différences sous-groupes
4. **Points de vue** : Opinion sur autres races
5. **Règles spécifiques** : Mécaniques particulières

## Génération de liens interactifs

### Détection automatique
**Mécanisme** : Scan descriptions, détecte noms d'entités (skills, talents, careers), transforme en liens cliquables.

**Processus** :
1. Parcourir labels connus
2. Chercher labels dans texte
3. Remplacer par `<span class="showHelp" data-type="skill" data-id="123">Label</span>`
4. Générer index relations bidirectionnelles

**Règles** : Ignore auto-références, détecte variations, priorise labels longs, supporte "(Au choix)".

**Exemple** :
```
Original : "Les Humains reçoivent Calme, Charme et Destinée"
Après : "Les Humains reçoivent <span...>Calme</span>, <span...>Charme</span> et <span...>Destinée</span>"
```

### Index bidirectionnel "Où utilisé"
**Objectif** : Navigation inverse (où cette compétence est mentionnée ?).

**Usage** : Voir toutes races mentionnant "Calme", tous careers mentionnant "Destinée".

## Stratégies de migration

### Option 1 : Markdown avec composants (RECOMMANDÉ)
**Conversion** : `<b>` → `**`, `<br>` → double newline, `<h3>` → `###`, `<span class="showHelp">` → React `<EntityLink>`

**Avantages** : Lisible/éditable, standardisé, parsing simple.

**Inconvénients** : Parser custom pour liens, perte formatting complexe.

**Exemple** :
```markdown
**Prénoms nains**
Les prénoms nains sont courts et percutants...

**Exemples**: Alrik, Bronda, Dimzad

**Compétences**: [Calme](skill:12), [Intimidation](skill:35)
```

### Option 2 : HTML sémantique
**Conversion** : Normaliser balises, ajouter `<section>`, `<article>`, `<header>`.

**Avantages** : Migration minimale, support natif navigateurs, CSS flexible.

**Inconvénients** : Moins lisible édition, risque XSS, mix content/présentation.

### Option 3 : JSON structuré
**Format** : Séparer structure/contenu avec schéma JSON.

**Avantages** : Séparation structure/contenu, validation schéma, queries simples.

**Inconvénients** : Migration complexe, édition moins naturelle, perte expressivité.

## Préservation sémantique

### À préserver
1. **Hiérarchie** : Introduction, sections thématiques, exemples
2. **Emphases** : Mots-clés gras, titres, listes
3. **Références** : Liens vers skills/talents, mentions careers/traits
4. **Structure** : Paragraphes, listes, citations

### Pertes acceptables
1. Formatting redondant (`<br><br>` multiples)
2. Mix `<b>`/`<B>` → Standardisé
3. `<div>` sans classe
4. Espaces inconsistants

## Recommandation migration

**Phase 1** : Normaliser HTML
- Standardiser balises (voir [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md))
- Améliorer liens auto
- Sanitize XSS

**Phase 2** : Markdown + composants
- Convertir HTML→MD
- `<EntityLink>` React
- Parser `[Label](entity:type:id)`

**Phase 3** : Éditeur WYSIWYG
- Markdown preview
- Auto-complétion entités
- Validation liens

**Raison** : Balance lisibilité (Markdown) et richesse interactive (composants).

## Points d'attention

### Variantes HTML
Mix `<b>`/`<B>`, `<br>`/`<BR>` → Normaliser avant conversion (voir [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md)).

### Liens cassés
Vérifier tous liens pointent vers entités existantes.

### Performance
Génération automatique liens coûteuse → Build time, pas runtime.

### Édition collaborative
Markdown évite conflits Git vs HTML.

## Spells : Tables HTML complexes

Sorts Chaos contiennent tables HTML avec résultats aléatoires (ex: Allure démoniaque = 1d10 × 4 colonnes).

**Recommandation** : Tables critiques gameplay → Privilégier HTML sémantique ou JSON + renderer custom.

## Références croisées

- [species.md](../database/species.md) - Champ desc Species
- [spells.md](../database/spells.md) - Champ desc Spells
- [skills.md](../database/skills.md) - Entités liées
- [talents.md](../database/talents.md) - Entités liées
