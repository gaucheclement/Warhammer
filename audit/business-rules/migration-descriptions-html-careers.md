# Migration des Descriptions HTML - Carrières

## Vue d'ensemble

Les descriptions de carrières sont stockées en HTML brut dans `desc`. Ces descriptions narratives nécessitent traitement spécial lors de migration ou affichage.

**Objectif métier** : Préserver intégralement contenu narratif, permettre rendu adaptatif (web, mobile, PDF).

**Référence** : [careers.md]

## Structure descriptions

### Format actuel
Type : HTML brut, UTF-8, 500-3000 caractères

### Sections typiques
1. **Pitch** : Phrase résumée en italique `<i>`
2. **Présentation** : Contexte professionnel
3. **Organisation** : Guildes, hiérarchies, employeurs
4. **Évolution** : Parcours typique, promotions
5. **Citations** : 2-3 dialogues en gras `<b>`
6. **Accroches** : Raisons partir à l'aventure

Ordre non strict, pitch toujours premier.

## Balises HTML

### `<i>` et `<I>` - Italique
**Usage** : Pitch accroche.
**Exemple** : `<i>Charismatique et beau parleur, vous défendez votre cause...</I>`
**Variantes** : Casse mixte (`<i>...</I>`)
**Migration** : Normaliser en `<em>` ou markdown `*`

### `<BR>` et `<br>` - Retour ligne
**Usage** : Séparation paragraphes.
**Variantes** : `<BR>`, `<br>`, `<BR><BR>` (double espacement)
**Migration** : `\n` (markdown) ou `<p>` (HTML5)

### `<b>` - Gras
**Usage** : Emphase, citations, titres.
**Migration** : `<strong>` ou `**` (markdown)

### Balises absentes
Pas de `<p>`, `<div>`, `<span>`, `<a>`, `<ul>`, `<img>`.
HTML minimal, textuel uniquement.

## Problèmes cohérence

### Casse incohérente
`<BR>` vs `<br>`, `<I>` vs `<i>`.
**Solution** : Normalisation minuscules.

### Balises non fermées
`<i>Texte</I>` (ouverture ≠ fermeture).
**Solution** : Uniformiser ouverture/fermeture.

### Espacement variable
`<BR>`, `<BR><BR>` inconsistants.
**Solution** : `<BR><BR>` = paragraphe, `<BR>` = retour ligne.

## Contenu sémantique

### Références implicites
Mentions sans balises :
- **Classes** : "Artisans de la classe Citadins"
- **Carrières** : "Agitateurs deviennent Prêcheurs"
- **Lieux** : "Altdorf", "Middenheim"

**Migration** : Identifier pour créer hyperliens.

### Citations
Format : `« Citation. »<br>– Nom, Titre`
**Exemple** : `« ALTDORF À SES HABITANTS ! »<br>– Tract, Altdorf`
**Migration** : `<blockquote>` ou élément dédié.

### Listes embarquées
Texte brut : "fermiers, charbonniers, bûcherons, meuniers"
Pas de `<ul>`, uniquement virgules.
**Migration** : Conserver brut OU parser en liste.

## Stratégie migration

### Objectif
Transformer HTML brut en format structuré préservant tout le contenu.

### Étapes

**1. Normalisation**
- Uniformiser casse
- Corriger fermetures
- Standardiser espacements

**2. Parsing**
- Identifier pitch (premier `<i>`)
- Séparer paragraphes (`<BR><BR>`)
- Extraire citations (`« ... »`)

**3. Conversion**
- **Markdown** : `<i>` → `*`, `<BR><BR>` → `\n\n`, `<b>` → `**`
- **JSON structuré** : Séparer pitch, paragraphes, citations
- **HTML5 sémantique** : `<i>` → `<em>`, `<BR>` → `<p>`

**4. Préservation**
- Conserver version originale (backup)
- Permettre rollback

### Contraintes
- Perte interdite
- Intégrité narrative
- Ordre préservé

## Cas d'usage

### Affichage web
Parser HTML → Nettoyer → Injecter → CSS styles

### Export markdown
`<i>` → `*`, `<BR><BR>` → `\n\n`, `<b>` → `**`, générer `.md`

### Recherche full-text
Strip HTML → Normaliser espaces → Indexer texte brut

### Génération PDF
Parser → DocBook/LaTeX → Styles typo → PDF

## Validation

### Intégrité
- Longueur texte brut identique
- Nombre citations identique
- Aucun caractère manquant

### Tests
- Comparer rendu visuel
- Vérifier 10-20 carrières manuellement
- Tester edge cases

## Exemples transformation

### Pitch
**Original** : `<i>Charismatique et beau parleur...</I>`
**Markdown** : `*Charismatique et beau parleur...*`
**HTML5** : `<em>Charismatique et beau parleur...</em>`

### Paragraphes
**Original** : `Texte 1.<BR><BR>Texte 2.`
**Markdown** : `Texte 1.\n\nTexte 2.`
**HTML5** : `<p>Texte 1.</p><p>Texte 2.</p>`

### Citation
**Original** : `« Citation. »<br>– Auteur, Titre`
**Markdown** : `> "Citation."\n> — Auteur, Titre`
**HTML5** : `<blockquote><p>"Citation."</p><footer>— Auteur, Titre</footer></blockquote>`

## Liens entités

### Classes
Descriptions mentionnent classe.
**Migration** : Attribut `data-class-ref` pour liens.

### CareerLevels
Descriptions parlent évolution.
**Migration** : Liens internes niveaux.

### Livres
Descriptions citent livres (rare).
**Migration** : Croiser avec champ `book`.

## Recommandations

### Format cible suggéré

**Option 1 : JSON structuré**
`{"pitch": "...", "paragraphs": [...], "quotes": [...]}`
Avantages : Flexibilité, recherche, rendu adaptatif.

**Option 2 : Markdown enrichi**
Simplicité, portable, éditable.

**Option 3 : HTML5 sémantique**
Standard web, compatible, accessible.

### Non recommandé
- HTML brut tel quel (obsolète)
- Texte brut (perte formatage)
- Formats propriétaires
