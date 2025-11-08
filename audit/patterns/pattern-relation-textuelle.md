# Pattern: Relation textuelle (string → entity)

## Contexte
Référence d'une entité vers une autre via son label (string).
Type de relation le plus courant dans les tables.

## Format
Un champ contient le label (string) de l'entité cible.

## Exemples

### Careers → Classes
`{ "label": "Agitateur", "class": "Citadins" }`

Référence : `Careers.class` → `Classes.label`

### Species → Characteristics
`{ "label": "Humain", "refChar": "Humain" }`

Référence : `Species.refChar` → `Characteristics.label`

### Talents → Skills
`{ "label": "Acuité auditive", "addSkill": "Perception (Ouïe)" }`

Référence : `Talents.addSkill` → `Skills.label` (avec spécialisation)

## Résolution

### Résolution simple
Trouver l'entité cible dont le label correspond à la valeur du champ.

Retourner `null` si non trouvé.

### Résolution avec spécialisation
Si la référence contient une spécialisation entre parenthèses, extraire le nom et la spécialisation séparément.

## Validation
Voir [pattern-validation-references.md](./pattern-validation-references.md)

## Relations bidirectionnelles

### Navigation inverse
Trouver toutes les entités sources qui référencent une entité cible donnée.

Exemple : Trouver toutes les carrières de la classe "Citadins"

### Index "où utilisé"
Construire un index inverse pour optimiser les recherches de références.

## Avantages / Inconvénients

### Avantages
- Lisible en JSON
- Facile à éditer manuellement
- Pas de jointure complexe

### Inconvénients
- Pas de contrainte d'intégrité native
- Si le label change, toutes les références sont cassées
- Validation manuelle nécessaire

## Alternatives

### Référence par index
`{ classIndex: 0 }` au lieu de `{ class: "Citadins" }`

Avantage : Le label peut changer
Inconvénient : Moins lisible

### Référence par ID
`{ classId: "uuid-1234" }`

Avantage : Unique et stable
Inconvénient : Nécessite un mapping

## Tables concernées
Toutes les tables avec relations

## Voir aussi
- [pattern-validation-references.md](./pattern-validation-references.md) - Validation
- [pattern-parsing.md](./pattern-parsing.md) - Avec spécialisation
