# Export Foundry - Talents

## Contexte

Transformation talents personnage vers format Foundry items type "talent". Préservation rangs, spécialisations, et effets.

## Structure Talents

**Application** : Character.getTalents() → array objets {id, data, spec, roll}
**Foundry** : items array → {name, type: "talent", data: {advances, specification}}

### Mapping Noms

FR → EN via table mapping
- "Perspicace" → "Savvy"
- "Très résistant" → "Very Resilient"
- "Artiste" → "Artist"
- "Ambidextre" → "Ambidextrous"

### Rangs Multiples

**Application** : roll indique rang acquis (1-N)
**Foundry** : data.advances.value (nombre fois talent pris)

**Talents à rangs** : "Très résistant", "Très fort", "Magie mineure", etc.
**Export** : advances = roll (1 si unique, 2+ si multiples)

## Spécialisations Talents

**Cas spéciaux** : Artiste (Musicien), Linguiste (Elfique), etc.

**Application** : spec string
**Foundry** : data.specification string

**Transformation** : Traduction spec si présente table mapping, sinon préservation

## Effets Automatisés

**Application** : Talents avec modificateurs caractéristiques (Très Résistant +5 E)
**Foundry** : data.effects array (effets actifs automatiques)

**Export V1** : Effets NON exportés (désactivation fonctionnalité)
**Future** : Mapping effets application → Active Effects Foundry

## Exemples Concrets

### Talent Simple (Perspicace)

**App** : {label: "Perspicace", roll: 1}
**Foundry** : {name: "Savvy", type: "talent", data: {advances: {value: 1}}}

### Talent Rangs Multiples (Très Résistant x2)

**App** : {label: "Très résistant", roll: 2}
**Foundry** : {name: "Very Resilient", data: {advances: {value: 2}}}

### Talent Spécialisé (Artiste Musicien)

**App** : {label: "Artiste", spec: "Musicien"}
**Foundry** : {name: "Artist", data: {specification: "Musician"}}

### Talent Modificateur (Très Fort)

**App** : {label: "Très fort", roll: 1, modificateur Force implicite}
**Foundry** : {name: "Very Strong", effects: [] (non implémenté V1)}
**Note** : Modificateur Force appliqué manuellement Foundry ou via Active Effect futur

## Prérequis Talents

**Application** : Relations prérequis non exportées (données statiques tables)
**Foundry** : Système WFRP gère prérequis nativement (pas besoin export)

## Voir Aussi

- [foundry-mapping.md](./foundry-mapping.md) - Correspondance noms
- [../wizard/talents-choice.md](../wizard/talents-choice.md) - Sélection talents
- [../wizard/talents-ranks.md](../wizard/talents-ranks.md) - Gestion rangs
