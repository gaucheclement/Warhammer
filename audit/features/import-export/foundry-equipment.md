# Export Foundry - Équipement

## Contexte

Transformation trappings (équipement) personnage vers format Foundry items types "weapon", "armour", "container", "money", "trapping".

## Types Équipement

**Application** : Character.getTrappings() → array strings ou objets
**Foundry** : items array avec type spécifique selon catégorie

### Catégorisation

**Armes** : subtype="weapon" → type "weapon" Foundry
**Armures** : subtype="armour" → type "armour" Foundry
**Conteneurs** : Sacs, bourses → type "container"
**Argent** : Pièces or/argent/bronze → type "money"
**Objets** : Autres → type "trapping"

## Mapping Armes

**Application** : Nom FR + propriétés (dégâts, groupe, portée, qualités)
**Foundry** : {name: EN, data: {damage, range, weaponGroup, qualities}}

### Exemple Épée

**App** : "Épée", dégâts "CC+4", groupe "Ordinaire", qualités []
**Foundry** : {name: "Sword", type: "weapon", data: {damage: {value: "SB+4"}, weaponGroup: {value: "ordinary"}}}

**Transformation dégâts** : "CC+4" → "SB+4" (CC=Capacité Combat → SB=Strength Bonus)

## Mapping Armures

**Application** : Nom FR + points armure par localisation
**Foundry** : {name: EN, data: {AP: {head, body, rArm, lArm, rLeg, lLeg}}}

### Exemple Armure Cuir

**App** : "Armure de cuir", corps 1, bras 1, jambes 1
**Foundry** : {name: "Leather Armour", data: {AP: {body: 1, lArm: 1, rArm: 1, lLeg: 1, rLeg: 1}}}

## Quantités

**Application** : Quantité dans string "Rations (3 jours)" ou champ séparé
**Foundry** : data.quantity.value (nombre)

**Parsing** : Extraction nombre entre parenthèses si présent, sinon 1

## Encombrement

**Application** : Calcul basé sur enc par item
**Foundry** : data.encumbrance.value (poids individuel)

**Total** : Foundry calcule automatiquement encumbrance total personnage

## Exemples Concrets

### Arme (Arc Long)

**App** : "Arc long", dégâts "CT+4", portée "30/60", qualités ["Trait 1"]
**Foundry** : {name: "Longbow", type: "weapon", data: {damage: {value: "SB+4"}, range: {normal: 30, long: 60}, qualities: [{name: "Trait 1"}]}}

### Armure Complète (Plates)

**App** : "Armure de plaques complète", AP tête 5, corps 5, membres 5
**Foundry** : {name: "Full Plate Armour", data: {AP: {head: 5, body: 5, lArm: 5, rArm: 5, lLeg: 5, rLeg: 5}}}

### Objets Multiples (Rations)

**App** : "Rations (7 jours)"
**Foundry** : {name: "Rations", type: "trapping", data: {quantity: {value: 7}}}

### Argent

**App** : Champ character.money (couronnes or, pistoles argent, sous bronze)
**Foundry** : {type: "money", data: {gc: X, ss: Y, bp: Z}} (gold crowns, silver shillings, brass pennies)

## Voir Aussi

- [foundry-mapping.md](./foundry-mapping.md) - Correspondance noms
- [../wizard/trappings-encumbrance.md](../wizard/trappings-encumbrance.md) - Calcul encombrement
