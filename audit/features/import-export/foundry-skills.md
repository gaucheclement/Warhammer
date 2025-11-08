# Export Foundry - Compétences

## Contexte

Transformation compétences personnage vers format Foundry items type "skill". Préservation spécialisations, avances, et caractéristique associée.

## Structure Compétences

**Application** : Character.getSkills() → array objets {id, data, spec, specie, career, advance, tmpadvance}
**Foundry** : items array → {name, type: "skill", data: {characteristic, advances}}

### Mapping Noms

FR → EN via table mapping (voir foundry-mapping.md)
- "Athlétisme" → "Athletics"
- "Charme" → "Charm"
- "Métier (Menuiserie)" → "Trade (Carpentry)"

### Spécialisations

**Application** : spec string ("Menuiserie", "Forgeron", etc.)
**Foundry** : data.specialisation ou intégré nom ("Trade (Carpentry)")

**Cas particuliers** :
- Langue (Reikspiel) : spec préservé
- Métier (X) : spec entre parenthèses
- Compétence sans spec : spec vide

## Calcul Avances

**Total advances** : specie + career + advance + tmpadvance
**Foundry** : data.advances.value (nombre total, origine non distinguée)

### Exemple Menuisier

**Application "Métier (Menuiserie)"** :
- specie: 0, career: 10, advance: 5, tmpadvance: 2
- Total: 17 advances

**Foundry "Trade (Carpentry)"** :
- advances.value: 17
- characteristic: "Dex" (selon skill definition)

## Groupement Compétences

**Application** : Liste plate toutes compétences
**Foundry** : Organisées par catégorie (Basic, Advanced) automatiquement système

**Export** : Liste complète sans catégorisation (Foundry réorganise)

## Caractéristique Associée

**Application** : skill.data.characteristic (référence ID)
**Foundry** : data.characteristic (abréviation "WS", "Dex", etc.)

**Transformation** : Lookup mapping characteristic puis extraction abréviation

## Exemples Concrets

### Compétence Simple (Charme)

**App** : {label: "Charme", specie: 5, career: 0, characteristic: "Sociabilité"}
**Foundry** : {name: "Charm", type: "skill", data: {characteristic: "Fel", advances: {value: 5}}}

### Compétence Spécialisée (Langue Reikspiel)

**App** : {label: "Langue (Reikspiel)", spec: "Reikspiel", specie: 5}
**Foundry** : {name: "Language (Reikspiel)", specialisation: "Reikspiel", advances: {value: 5}}

### Compétence Multiple Specs (Métier)

**App** : Deux skills "Métier (Menuiserie)" et "Métier (Forgeron)"
**Foundry** : Deux items distincts "Trade (Carpentry)" et "Trade (Blacksmith)"

## Voir Aussi

- [foundry-mapping.md](./foundry-mapping.md) - Correspondance noms
- [foundry-format.md](./foundry-format.md) - Structure items
- [../wizard/skills-specialization.md](../wizard/skills-specialization.md) - Gestion specs application
