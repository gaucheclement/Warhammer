# Export Foundry - Mapping IDs

## Contexte

Table correspondance nomenclature interne application ↔ noms officiels Foundry VTT. Résout différences dénomination (traduction FR/EN, abréviations, variantes) lors transformation export.

## Structure Table Foundry

**Stockage** : Google Sheets onglet "Foundry", fonction `getFoundry()` Code.js lignes 169-189
**Colonnes** : type, subtype, label (FR), foundryName (EN)
**Format** : Array objets `{index, type, subtype, label, foundryName}`

### Types Principaux

**characteristic** : Capacités combat, tir, force, etc. → WS, BS, S, T, I, Ag, Dex, Int, WP, Fel
**skill** : Compétences avec spécialisations → "Métier (Menuiserie)" → "Trade (Carpentry)"
**talent** : Talents → "Perspicace" → "Savvy", "Très résistant" → "Very Resilient"
**trapping** : Équipement (subtype: weapon, armour, item) → "Épée" → "Sword"
**spell** : Sorts → "Flèche enflammée" → "Flaming Arrow"
**specie** : Espèces → "Humains (Reiklander)" → "Human (Reiklander)"
**career** : Carrières → "Agitateur|1" → "Agitator (Rank 1)"

## Mapping Détaillé

### Characteristics

FR → EN canonique WFRP 4e :
- Capacité Combat → WS (Weapon Skill)
- Capacité Tir → BS (Ballistic Skill)
- Force → S, Endurance → T
- Initiative → I, Agilité → Ag, Dextérité → Dex
- Intelligence → Int, Force Mentale → WP (Willpower), Sociabilité → Fel (Fellowship)

### Skills

**Base** : Traduction directe ("Athlétisme" → "Athletics", "Charme" → "Charm")
**Spécialisations** : Préservées et traduites ("Métier (Menuiserie)" → "Trade (Carpentry)")
**Langues** : Format identique ("Langue (Reikspiel)" → "Language (Reikspiel)")

### Talents

**Simples** : Traduction nom ("Artiste" → "Artist", "Ambidextre" → "Ambidextrous")
**Rangs multiples** : Suffixe identique Foundry ("Très résistant" sans distinction rang)

### Trappings

**Catégorisation** : subtype détermine type Foundry item
- weapon : "Épée" → "Sword", "Arc" → "Bow"
- armour : "Armure de cuir" → "Leather Armour"
- item : Objets génériques traduits

**Quantités** : Gérées hors mapping (champ séparé Foundry)

### Spells

**Sorts** : Traduction directe ("Projectile magique" → "Magic Dart")
**Domaines** : Lores mappés ("Céleste" → "Heavens", "Feu" → "Fire", "Ombres" → "Shadows")

### Species et Careers

**Species** : Préservation région ("Humains (Reiklander)" → "Human (Reiklander)", "Nains" → "Dwarf")
**Careers** : Niveau transformé ("Agitateur|1" → "Agitator (Rank 1)")

## Résolution Conflits

### Entrées Absentes

**Fallback** : Si lookup échoue, utiliser label FR directement
**Translittération** : Fonction toId() normalise (lowercase, accents, trim) pour fuzzy matching
**Création dynamique** : Nouveaux mappings sauvegardés Sheets pour exports futurs

### Noms Multiples

**Priorité contexte** : Choisir mapping selon espèce, carrière actuelle personnage
**Spécialisations** : Préférer version spécialisée si disponible ("Métier (Forgeron)" vs "Métier" générique)

### Variantes Orthographiques

**Normalisation** : toId() Code.js ligne 295 (élimine accents, espaces multiples, casse)
**Exemples** : "Armure de cuir" = "Armure cuir" = "ARMURE DE CUIR" (normalisés identiques)

## Import Foundry → Application

**Process inverse** :
1. Parse foundryName JSON Foundry
2. Lookup table mapping (foundryName → label)
3. Si trouvé : ID existant, si absent : création nouvelle entrée (ID auto-incrémenté)

**Persistence** : Nouveaux mappings ajoutés onglet Foundry pour cohérence

## Exemples Concrets

### Export Humain Agitateur

**Avant** : Specie "Humains (Reiklander)", Career "Agitateur|1", CC 28
**Lookups** : 3 requêtes (type=specie, type=career, type=characteristic)
**Après** : species "Human (Reiklander)", career "Agitator (Rank 1)", WS 28

### Compétence Spécialisée

**Avant** : Skill "Métier (Menuiserie)", spec "Menuiserie"
**Lookup** : type=skill, label="Métier (Menuiserie)" → "Trade (Carpentry)"
**Export** : item.name = "Trade (Carpentry)", item.data.specialisation = "Carpentry"

### Talent Custom Non Mappé

**Avant** : Talent "Super Pouvoir" (ajouté admin, absent mapping)
**Lookup** : NOT FOUND
**Fallback** : foundryName = "Super Pouvoir" (label FR)
**Warning** : Log "Talent 'Super Pouvoir' non mappé, label original utilisé"

### Import Depuis Foundry

**JSON** : skill {name: "Athletics", ...}
**Lookup** : foundryName="Athletics" → label="Athlétisme"
**Création** : Skill ID interne référence "Athlétisme"

## Maintenance

**Ajouts** : Mise à jour manuelle onglet Foundry Sheets
**Validation** : Vérifier tous labels app ont foundryName (détection manques)
**Sync Foundry** : Updates système WFRP nécessitent revue complète mapping
**Logs** : Exports génèrent warnings pour entités non mappées (audit)

## Voir Aussi

- [foundry-overview.md](./foundry-overview.md) - Vue ensemble export Foundry
- [foundry-characteristics.md](./foundry-characteristics.md) - Export caractéristiques
- [foundry-skills.md](./foundry-skills.md) - Export compétences
- [foundry-talents.md](./foundry-talents.md) - Export talents
- [foundry-equipment.md](./foundry-equipment.md) - Export équipement
