# Character Model - Accesseurs et recherche

## Objectif

Documenter les méthodes de récupération, recherche et accès aux collections (skills, talents, spells, trappings).

## Méthodes skills

**getSkills()**: Retourne toutes compétences triées alphabétiquement
**getAllSkills(all)**: Ajoute compétences de base manquantes avec advance=0. all=false (base seulement) ou true (toutes)
**searchSkill(id, specs, strict, origin, withAdvance, withTalent)**: Recherche par id+specs. strict=true (spec exacte), false (accepte vide). withAdvance=true (seulement advance>0). Exemples: searchSkill('athletisme'), searchSkill('langue','Reikspiel')
**createSkill(skill)**: Crée objet avec méthodes getCharacteristic, getLabel, getSymbol, getBase, getAdvance, getTotal, getBonus, addOrigins, hasOrigin
**setSkill(skill, index)**: Ajoute ou met à jour. Si index: remplace, si existante: ajoute origins, sinon: crée

## Méthodes talents

**getTalents()**: Retourne tous talents (ordre d'acquisition, non trié)
**searchTalent(id, specs, strict, origin, withAdvance, withTalent)**: Critères similaires searchSkill. strict=false accepte spec vide/"Au choix", withAdvance=true (seulement advance>0)
**createTalent(talent)**: Crée objet avec méthodes getLabel, getSymbol, getBase, getAdvance, getTotal, getBonus, getMax, getSkill, getTalent, addOrigins, hasOrigin
**setTalent(talent, index)**: Ajoute ou met à jour (similaire setSkill)

## Méthodes spells

**getSpells()**: Retourne tous sorts
**searchSpell(id, spec)**: Recherche par id+spec (domaine Magie Arcanes). Retour: spell ou false
**setSpell(spell, index)**: Ajoute sort. Si index: remplace, si existant: retourne, sinon: crée. Appelé par wizard ou applyTalent() pour Béni.

## Filtrage et organisation

### Skills par source

getSkills().filter(s => s.hasOrigin('humain')) → Compétences raciales Humain
getSkills().filter(s => s.hasOrigin('soldat|1')) → Compétences carrière Soldat
getSkills().filter(s => s.origins.includes('talent')) → Compétences de talents

### Skills par caractéristique

getSkills().filter(s => s.getCharacteristic().id === 'ag') → Compétences Agilité

### Talents par rang

getTalents().filter(t => t.getTotal() > 0) → Talents actifs
getTalents().filter(t => t.getTotal() === t.getMax()) → Talents au maximum

### Sorts par type/domaine

**Par type**: getSpells().filter(s => s.data.type === 'Bénédictions') → Sorts divins
**Par domaine**: getSpells().filter(s => s.spec === 'Feu') → Sorts Feu uniquement

## Méthodes trappings

**getTrappings()**: Retourne tout équipement
**Par catégorie**: filter(t => t.type === 'Arme'/'Armure'/'Équipement')

## Méthodes characteristics

**getCharacteristics()**: Retourne tableau 15 caractéristiques (10 principales + 5 dérivées)
**searchCharacteristic(id, origin)**: Recherche par id. origin optionnel (filtre). Retour: characteristic ou null. Ex: searchCharacteristic('cc')
**createCharacteristic(characteristic)**: Crée objet, propriétés à 0 (roll, talent, advance), méthodes getBase, getAdvance, getTotal, getBonus, getLabel, getSymbol, getDescription, addOrigins, hasOrigin
**setCharacteristic(characteristic, index)**: Ajoute ou maj. Si index: remplace, si existante: ajoute origins, sinon: crée. Initialise 15 au démarrage.

## Merge sources multiples

Quand skill/talent provient de plusieurs sources, fusion en objet unique avec origins multiple.

**Exemple Athlétisme**:
- Source 1 (humain): origins=['humain']
- Source 2 (eclaireur|1): origins=['humain', 'eclaireur|1']
- Source 3 (eclaireur|2): origins=['humain', 'eclaireur|1', 'eclaireur|2']

Avantage: Coût XP réduit si hasOrigin(currentCareer).

## Spécialisations

### Spec fixe

Compétence/talent avec spécialisation définie: "Langue (Reikspiel)", "Béni (Sigmar)"
- spec = 'Reikspiel'/'Sigmar'
- specs = undefined

### Spec "Au choix"

Compétence/talent avec choix ouvert: "Métier (Au choix)", "Savoirs (Au choix)"
- spec = '' (vide tant que non choisi)
- specs = tableau options possibles
- Utilisateur doit choisir avant validation

Merge: Si deux "Savoirs (Au choix)" de sources différentes, créent deux instances séparées (choix distincts).

Voir [pattern-specialisations.md](../../patterns/pattern-specialisations.md)

## Relation avec talents dérivés

Certains talents ajoutent automatiquement skills/spells/talents:

**addSkill**: Linguistique → Langue (Au choix), skill.getSkill() retourne compétence à ajouter
**addMagic**: Béni → Bénédictions auto, Magie Arcanes → Sorts domaine
**addTalent**: Savoirs Histoire → Lire/Écrire, talent.getTalent() retourne talent à ajouter

Gérés par career.getTalents() et applyTalent().

## Exemples concrets

**Recherche Athlétisme Humain Éclaireur**: searchSkill('athletisme') → {id:'athletisme', advance:8, origins:['humain','eclaireur|1'], getCharacteristic()→Ag=35, getTotal()→43}

**Recherche Corps-à-corps Base Soldat|2**: searchSkill('corps-a-corps','Base') → {id:'corps-a-corps', spec:'Base', advance:10, origins:['soldat|1','soldat|2'], hasOrigin('soldat|2')→true}

**Sorts Feu Sorcier**: getSpells().filter(s => s.spec==='Feu') → [Dard de feu, Boule de feu]

**Talents actifs**: getTalents().filter(t => t.getTotal()>0) → [Résistant rang2, Vision nocturne rang1, ...]

## Validation

Contraintes recherche:
- Si specs défini (Au choix): spec doit être choisi avant finalisation
- advance >= 0
- origins non vide
- Si origin='talent': talent correspondant doit avoir getTotal() > 0

Voir [character-validation.md](./character-validation.md)

## Voir aussi

- [character-structure.md](./character-structure.md) - Structure collections
- [database/skills.md](../database/skills.md) - Liste compétences
- [database/talents.md](../database/talents.md) - Liste talents
- [database/spells.md](../database/spells.md) - Liste sorts
- [database/trappings.md](../database/trappings.md) - Liste équipement
- [pattern-specialisations.md](../../patterns/pattern-specialisations.md) - Gestion spécialisations
