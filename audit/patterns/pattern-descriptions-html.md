# Pattern: Descriptions HTML

## Contexte
Structure et formatage HTML des descriptions narratives.
Permet affichage riche et extraction programmatique du contenu.

---

## 1. Balises autorisées (Liste blanche)

### Formatage basique
- `<b>`, `</b>` : Gras
- `<i>`, `</i>` : Italique
- `<br>`, `<BR>` : Retour ligne (autofermante)

### Structure
- `<h3>`, `</h3>` : Titre section
- `<ul>`, `</ul>` : Liste non ordonnée
- `<li>`, `</li>` : Élément liste

### Tableaux (sorts uniquement)
- `<table>`, `<tr>`, `<td>` et fermantes

**Note :** Balises acceptées en minuscules et majuscules.

### Validation

**Balises interdites (liste noire) :**
- `script`, `style`, `iframe`, `object`, `embed`
- `form`, `input`, `button`

**Erreurs possibles :**
- `HTML_UNKNOWN_TAG` : Balise non autorisée
- `HTML_FORBIDDEN_TAG` : Balise interdite
- `HTML_DANGEROUS_ATTR` : Attribut dangereux (onclick, onload, javascript:, data:)
- `HTML_UNBALANCED` : Balise fermante sans ouvrante
- `HTML_UNCLOSED` : Balises non fermées

**Sanitization :** Retirer balises non autorisées tout en conservant le texte.

---

## 2. Pitch d'accroche (Première phrase en italique)

### Format
```html
<i>Phrase d'accroche en une ligne</i>
```

### Exemples
```html
<i>Dieu de la mer, des océans et des marins</i>
<i>Charismatique et beau parleur, vous défendez votre cause face à l'ordre établi.</i>
<i>Robustes et pragmatiques, les nains incarnent la force et la résilience.</i>
```

### Extraction
Extraire texte entre `<i>...</i>` ou `<I>...</I>` au début de la description.
Retourner `null` si absent.

### Validation

**Erreurs possibles :**
- `PITCH_MISSING` : Description présente mais pas de pitch
- `PITCH_NOT_FIRST` : Pitch pas au début
- `PITCH_TOO_SHORT` : Moins de 10 caractères
- `PITCH_TOO_LONG` : Plus de 200 caractères

### Suppression du pitch
Retirer pattern `<i>...</i>` initial et `<BR>` suivants pour obtenir corps de description.

### Affichage UI
Peut être affiché séparément (style distinct) ou dans tooltips/aperçus.

### Exceptions
Variantes d'espèces peuvent avoir description vide (héritent de l'espèce de base).

---

## 3. Sections structurées

### Format
```html
<b>Titre Section:</b> Contenu
<BR><BR>
<b>Autre Titre:</b> Autre contenu
```

### Exemples

**Carrières :**
```html
<i>Pitch</i><BR><BR>
<b>Contexte social:</b> Les agitateurs appartiennent...
<BR><BR>
<b>Évolution:</b> Un agitateur peut devenir...
<BR><BR>
<b>Accroches:</b> Une manifestation qui dégénère...
```

**Divinités :**
```html
<i>Pitch</i><BR><BR>
<b>Sphères:</b> Mer, océans, rivières
<BR><BR>
<b>Adorateurs:</b> Marins, pêcheurs
<BR><BR>
<b>Commandements:</b>
<ul>
  <li>Respecte la mer</li>
  <li>Ne refuse jamais l'aide</li>
</ul>
```

### Extraction

**Toutes sections :** Extraire paires titre/contenu après suppression pitch.
Pattern : `<b>Titre:</b>` + contenu jusqu'à prochaine section ou fin.

**Section spécifique :** Extraire contenu d'une section par son titre.

### Validation

**Erreurs possibles :**
- `SECTION_MISSING` : Section attendue absente
- `SECTION_FORMAT_INVALID` : Format titre incorrect

### Templates par type

**Carrière :**
- Pitch + Présentation
- Contexte social
- Évolution
- Accroches

**Divinité :**
- Pitch
- Sphères
- Adorateurs
- Siège du pouvoir
- Commandements

### Normalisation
Uniformiser balises (B → b, BR → br), s'assurer que titres se terminent par `:`.

---

## Tables concernées

- Species, Careers, CareerLevels
- Skills, Talents, Spells
- Gods, Lores
- Tous champs desc

---

## Voir aussi

- [pattern-relation-textuelle.md](./pattern-relation-textuelle.md) - Références entre entités
