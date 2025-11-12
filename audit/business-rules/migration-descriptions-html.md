# Migration des Descriptions HTML

## Patterns techniques utilisés

- [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md) - Balises autorisées, Pitch en italique, Structuration sections

## Vue d'ensemble

Les descriptions dans Species (champ `desc`) et Careers utilisent du HTML pour formatter le contenu narratif et créer des liens interactifs vers d'autres entités.

**Objectif métier** : Préserver contenu narratif riche tout en modernisant format pour maintenance facilitée et meilleure UX.

## Structure actuelle

Voir [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md) pour liste complète balises utilisées.

**Balises principales** : `<b>`, `<br>`, `<h3>`, `<ul>`, `<li>`, `<span class="showHelp">`, `<i>`

### Exemples de contenu

**Species** :
```html
<b>Exemples</b>: Adhemar, Anders, Artur...<br><br>
<h3> Titres des ogres </h3><br><br>
Les ogres adoptent souvent un titre...
```

**Careers** :
```html
<i>Charismatique et beau parleur...</I><BR><BR>
Les Agitateurs sont des orateurs...<br><br>
« ALTDORF À SES HABITANTS ! »<br>– Tract, Altdorf
```

### Sections typiques

**Species** : Contexte culturel, exemples concrets, variations régionales, points de vue, règles spécifiques (voir [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md))

**Careers** (ordre non strict, pitch toujours premier) : Pitch (italique `<i>`), Présentation, Organisation, Évolution, Citations (`<b>`), Accroches

## Balises HTML

### `<i>` et `<I>` - Italique
**Usage** : Pitch accroche (Careers), emphase (Species)
**Variantes** : Casse mixte (`<i>...</I>`)
**Migration** : `<em>` ou markdown `*`

### `<BR>` et `<br>` - Retour ligne
**Usage** : Séparation paragraphes
**Variantes** : `<BR>`, `<br>`, `<BR><BR>` (double espacement)
**Migration** : `\n` (markdown) ou `<p>` (HTML5)
**Règle** : `<BR><BR>` = paragraphe, `<BR>` = retour ligne

### `<b>` - Gras
**Usage** : Emphase, citations, titres
**Migration** : `<strong>` ou `**` (markdown)

### Problèmes cohérence
1. **Casse incohérente** : `<BR>` vs `<br>`, `<I>` vs `<i>` → Normaliser minuscules
2. **Balises non fermées** : `<i>Texte</I>` → Uniformiser
3. **Espacement variable** → Standardiser
4. Mix `<b>`/`<B>` → Standardisé (voir [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md))

## Génération de liens interactifs

### Détection automatique
**Mécanisme** : Scan descriptions, détecte noms d'entités (skills, talents, careers), transforme en liens cliquables.

**Processus** : Parcourir labels connus → Chercher dans texte → Remplacer par `<span class="showHelp" data-type="skill" data-id="123">Label</span>` → Générer index bidirectionnel

**Règles** : Ignore auto-références, détecte variations, priorise labels longs, supporte "(Au choix)".

**Exemple** :
```
Original : "Les Humains reçoivent Calme, Charme et Destinée"
Après : "Les Humains reçoivent <span...>Calme</span>, <span...>Charme</span> et <span...>Destinée</span>"
```

### Index bidirectionnel
**Objectif** : Navigation inverse (où cette compétence est mentionnée ?)
**Usage** : Voir toutes races mentionnant "Calme", tous careers mentionnant "Destinée"

## Contenu sémantique

### Références implicites
Mentions sans balises :
- **Classes** : "Artisans de la classe Citadins" (Careers)
- **Carrières** : "Agitateurs deviennent Prêcheurs" (Careers)
- **Lieux** : "Altdorf", "Middenheim"
- **Skills/Talents** : Auto-détectés (voir Génération liens)

**Migration** : Créer hyperliens (attribut `data-class-ref`, liens internes niveaux)

### Citations (Careers)
Format : `« Citation. »<br>– Nom, Titre`
**Migration** : `<blockquote>` ou élément dédié

### Listes embarquées
Texte brut virgules (pas `<ul>`)
**Migration** : Conserver brut OU parser en liste

## Stratégies de migration

### Option 1 : Markdown avec composants (RECOMMANDÉ)
**Conversion** : `<b>` → `**`, `<br>` → double newline, `<h3>` → `###`, `<span class="showHelp">` → React `<EntityLink>`

**Avantages** : Lisible/éditable, standardisé, parsing simple, évite conflits Git

**Inconvénients** : Parser custom pour liens, perte formatting complexe

**Exemples** :
```markdown
**Prénoms nains**
Les prénoms nains sont courts...

**Compétences**: [Calme](skill:12), [Intimidation](skill:35)
```

```markdown
*Charismatique et beau parleur...*

> "ALTDORF À SES HABITANTS !"
> — Tract, Altdorf
```

### Option 2 : HTML sémantique
**Conversion** : Normaliser balises, ajouter `<section>`, `<article>`, `<header>`

**Avantages** : Migration minimale, support natif navigateurs, CSS flexible

**Inconvénients** : Moins lisible édition, risque XSS, mix content/présentation

### Option 3 : JSON structuré
**Format** : Séparer structure/contenu avec schéma JSON
**Careers** : `{"pitch": "...", "paragraphs": [...], "quotes": [...]}`

**Avantages** : Séparation structure/contenu, validation schéma, queries simples, rendu adaptatif

**Inconvénients** : Migration complexe, édition moins naturelle, perte expressivité

## Préservation sémantique

### À préserver
Hiérarchie, emphases, références (liens skills/talents/careers/traits), structure (paragraphes, listes, citations, pitch Careers)

### Pertes acceptables
Formatting redondant (`<br><br>` multiples), mix `<b>`/`<B>`, `<div>` sans classe, espaces inconsistants

### Contraintes strictes
Perte contenu interdite, intégrité narrative, ordre préservé

## Recommandation migration

**Phase 1 - Normaliser HTML** : Standardiser balises (voir [pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md)), améliorer liens auto, sanitize XSS

**Phase 2 - Markdown + composants** : Convertir HTML→MD, `<EntityLink>` React, parser `[Label](entity:type:id)`

**Phase 3 - Éditeur WYSIWYG** : Markdown preview, auto-complétion entités, validation liens

**Raison** : Balance lisibilité (Markdown) et richesse interactive (composants)

## Validation

### Tests intégrité
Longueur texte brut identique, nombre citations identique (Careers), aucun caractère manquant, comparer rendu visuel, vérifier 10-20 entités manuellement, tester edge cases

### Vérifications liens
Tous liens pointent vers entités existantes, auto-références ignorées, variations détectées

## Points d'attention

### Performance
Génération automatique liens coûteuse → Build time, pas runtime

### Spells : Tables HTML complexes
Sorts Chaos contiennent tables HTML avec résultats aléatoires (ex: Allure démoniaque = 1d10 × 4 colonnes)

**Recommandation** : Tables critiques gameplay → Privilégier HTML sémantique ou JSON + renderer custom

## Références croisées

- [species.md](../database/species.md) - Champ desc Species
- [careers.md](../database/careers.md) - Champ desc Careers
- [spells.md](../database/spells.md) - Champ desc Spells
- [skills.md](../database/skills.md) - Entités liées
- [talents.md](../database/talents.md) - Entités liées
