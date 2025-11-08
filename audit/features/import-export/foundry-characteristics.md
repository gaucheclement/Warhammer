# Export Foundry - Caractéristiques

## Contexte

Transformation caractéristiques personnage format application → format Foundry VTT. Préservation valeurs base, avances carrière, avances espèce, avances XP.

## Mapping Caractéristiques

**Application** : 10 caractéristiques FR (Capacité Combat, Capacité Tir, Force, Endurance, Initiative, Agilité, Dextérité, Intelligence, Force Mentale, Sociabilité)
**Foundry** : Abbréviations EN (WS, BS, S, T, I, Ag, Dex, Int, WP, Fel)

### Correspondances

- CC → WS (Weapon Skill)
- CT → BS (Ballistic Skill)
- F → S (Strength)
- E → T (Toughness)
- I → I (Initiative)
- Ag → Ag (Agility)
- Dex → Dex (Dexterity)
- Int → Int (Intelligence)
- FM → WP (Willpower)
- Soc → Fel (Fellowship)

## Structure Données

**Application** : Character.getCharacteristics() → array objets {id, data, base, specie, career, advance, tmpadvance}
**Foundry** : data.characteristics → objet clés abbréviations {WS: {initial, advances, modifier}, ...}

### Calcul Total

**Application** : total = base + specie + career + advance + tmpadvance + (modificateurs talents)
**Foundry** : value = initial + advances + modifier

**Transformation** :
- initial = base + specie (valeur initiale incluant racial)
- advances = career + advance + tmpadvance (progression carrière + XP)
- modifier = somme modificateurs talents applicables

## Exemples Concrets

### Humain Agitateur

**Application CC** :
- base: 25, specie: 5, career: 5, advance: 0
- Total: 35

**Foundry WS** :
- initial: 30 (25 base + 5 specie)
- advances: 5 (career)
- value: 35

### Nain Tueur Force

**Application F** :
- base: 30, specie: 10 (bonus nain), career: 10, advance: 2 (XP)
- Total: 52

**Foundry S** :
- initial: 40 (30 + 10)
- advances: 12 (10 + 2)
- value: 52

### Modificateurs Talents

**Talent Très Résistant** : +5 Endurance
**Application** : char.getTotal() inclut modificateur dynamiquement
**Foundry** : modifier: 5 (ajouté au calcul final)

## Préservation Calculs

**Origine valeurs** : Foundry doit pouvoir recalculer totaux indépendamment
**Avances détaillées** : Distinction specie/career/XP perdue (fusionné advances)
**Modificateurs** : Talents avec effets automatisés appliqués séparément Foundry

## Cas Limites

**Caractéristique modifiée temporairement** : Sorts, états (ignorés export, considérés temporaires)
**Valeur dépassant 100** : Préservée telle quelle (Foundry accepte >100)
**Valeur négative** : Possible (malus importants), préservée

## Voir Aussi

- [foundry-mapping.md](./foundry-mapping.md) - Table correspondance noms
- [foundry-format.md](./foundry-format.md) - Structure JSON complète
