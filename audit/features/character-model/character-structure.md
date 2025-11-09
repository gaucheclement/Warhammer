# Character Model - Structure et initialisation

## Objectif

Documenter la structure du modèle Character et son initialisation: propriétés, méthodes de définition espèce/carrière, relations entre composants.

## Contexte Warhammer

Un personnage Warhammer est défini par son espèce (Humain, Nain, Elfe, Halfling), sa carrière et niveau, ses caractéristiques, compétences, talents, équipement, sorts et expérience.

## Structure principale

### Propriétés de contrôle

**mode**: Type de création ('guidé' pour wizard, 'libre' pour free mode)
**stepIndex**: Indice étape courante (null=non démarré, 0-N=en cours, -1=terminé)

### Propriétés d'identité

**specie**: Espèce avec wrapper {id, data, getLabel(), getSkills()}
**careerLevel**: Carrière+niveau avec wrapper {id, data, getLabel(), getCareer(), getCharacteristics(), getTalents(), getSkills()}
**star**: Signe astral (bonus +3 à 1-2 caractéristiques)
**god**: Divinité (détectée depuis talent Béni ou Invocation)
**magic**: Domaine magique (détecté depuis talents de magie)

### Collections d'attributs

**characteristics**: Tableau 15 caractéristiques (10 principales + 5 dérivées)
**skills**: Tableau compétences (espèce + carrière + talents)
**talents**: Tableau talents (espèce + carrière + progression)
**spells**: Tableau sorts (vide pour non-magiciens)
**trappings**: Tableau équipement avec quantités
**details**: Tableau détails personnels (âge, taille, nom, etc.)

### Gestion expérience

**xp**: {max: 0, log: {}, used: 0, tmp_used: 0} - Budget XP, historique dépenses, dépensé validé, temporaire

### État aléatoire

**randomState**: {specie, imposedSpecie, career, imposedCareers, star, imposedStar, characteristic, imposedCharacteristics, imposedTalents} - Conservation seeds et impositions pour reproductibilité

## Méthodes d'initialisation espèce

### setSpecie(specie)

Définit l'espèce du personnage:
1. Crée wrapper {id, data, getLabel(), getSkills()}
2. getLabel() → nom espèce
3. getSkills() → parse compétences raciales avec origin=specie.id
4. Stocke dans this.specie

**Parsing compétences**: "Athlétisme" → {id:'athletisme', spec:''}, "Langue (Reikspiel)" → {id:'langue', spec:'Reikspiel'}, "X ou Y" → deux compétences. Voir [pattern-parsing.md](../../patterns/pattern-parsing.md)

**Caractéristiques de base**: Récupérées via characteristic.getSpecie() (CC base Humain=30, E base Nain=40, etc.)

**Talents raciaux**: Appliqués lors sélection espèce dans wizard (Nain: Vision nocturne, Résistance Chaos, Résolu, Résistance Magie)

### getSpecie()

Retourne objet specie si défini, null sinon.

## Méthodes d'initialisation carrière

### setCareerLevel(career)

Définit carrière+niveau du personnage:
1. Crée wrapper {id, data, getLabel(), getCareer(), getCharacteristics(), getTalents(), getSkills()}
2. getLabel() → "Carrière Niveau X"
3. getCaracteristics() → retourne caractéristiques améliorables avec origin
4. getTalents() → talents du niveau avec gestion specs/rangs/addTalent
5. getSkills() → compétences du niveau avec origin

**Gestion talents complexe**:
- Recherche si déjà présent avec même spec ET origin
- Gère talents ajoutés par d'autres talents (addTalent)
- Talents multi-rangs: origins multiples, advance incrémenté

**Exemple Soldat|1**: Carac CC/E/F/FM, Talents Menaçant/Résistant ou Robuste/Vivacité, Skills Athlétisme/Commandement/Corps-à-corps Base/Esquive/Intimidation

### getCareerLevel()

Retourne objet careerLevel si défini, null sinon.

## Historique carrières

Les origins conservent TOUS les niveaux traversés: Soldat|1 → Soldat|2 → Sergent|1. Avantage: coût XP réduit si hasOrigin(currentCareer).

## Relations entre propriétés

**Dépendances calculées**:
- characteristics: Impactées par specie (base), star (bonus), talents (modificateurs)
- skills: Construites depuis specie + careerLevel + talents
- spells: Construites depuis talents magiques
- god/magic: Détectés automatiquement depuis talents

**Cohérence métier**:
- Si mode='guidé': stepIndex progresse séquentiellement
- Si specie: characteristics ont valeurs de base correspondantes
- Si careerLevel: skills/talents incluent ceux de carrière
- Si talents addMagic: spells contient sorts correspondants
- Si talents addSkill: skills contient compétence ajoutée

## Structure objets enrichis

### Characteristic

Propriétés: id, specie (base), roll (tirage), talent (bonus talents), star (bonus astral), career (bonus carrière), advance (payé XP), tmpadvance (temporaire), data, origins

Méthodes: getBase() = specie+roll+talent+star, getAdvance() = advance+career+tmpadvance, getTotal() = base+advance, getBonus() = floor(total/10)

### Skill

Propriétés: id, spec (spécialisation fixe), specs (options "Au choix"), specie/career/advance/tmpadvance, data, origins

Méthodes: getCharacteristic() (liée), getBase() (valeur carac), getAdvance(), getTotal(), getBonus()

### Talent

Propriétés: id, spec, specs, advance, tmpadvance, roll (aléatoire), data, origins

Méthodes: getBase() (toujours 0), getAdvance(), getTotal() (rang actuel), getMax() (rang maximum), getSkill() (si addSkill), getTalent() (si addTalent)

### Spell

Propriétés: id, spec (domaine pour Magie Arcanes), data

Méthodes: getLabel() (nom + spec)

**Note**: Spells n'ont PAS advance/origins, soit acquis soit non.

### Trapping

Structure simple: {label, type, qty, enc} - Pas d'id, pas de data, pas de méthodes complexes.

## Exemples concrets

**Humain Soldat débutant**: mode='guidé', stepIndex=-1, specie=humain, careerLevel=soldat|1, characteristics CC=43(30+8+5), skills=8 actives, talents=Résistant, spells=[], xp={max:0, used:0}

**Nain Prêtre expérimenté**: mode='libre', specie=nain, careerLevel=pretre|3, god='grungni', E=70(40+10+15+5), talents=Béni(Grungni), spells=3 bénédictions auto, xp={max:2000, used:1850}

## Validation

Contraintes: mode obligatoire ('guidé'|'libre'), specie obligatoire si stepIndex>0, careerLevel si stepIndex>2, characteristics exactement 15 éléments, xp.max >= xp.used + xp.tmp_used

Voir [character-validation.md](./character-validation.md)

## Voir aussi

- [database/species.md](../database/species.md) - Liste espèces
- [database/career-levels.md](../database/career-levels.md) - Niveaux de carrière
- [character-characteristics.md](./character-characteristics.md) - Gestion caractéristiques détaillée
- [character-skills.md](./character-skills.md) - Gestion compétences détaillée
- [character-talents.md](./character-talents.md) - Gestion talents détaillée
- [pattern-parsing.md](../../patterns/pattern-parsing.md) - Parsing skills/talents
