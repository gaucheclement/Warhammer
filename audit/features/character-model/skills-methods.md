# Character Model - Méthodes skills

## Objectif

Documenter les méthodes de gestion des compétences: ajout, parsing, fusion sources multiples, calcul valeurs finales.

## Contexte Warhammer

Les compétences (Skills) représentent les savoir-faire du personnage. Sources multiples:
- **Espèce**: Compétences raciales (ex: Athlétisme pour Humains)
- **Carrière**: Compétences de profession (ex: Corps-à-corps Base pour Soldat)
- **Talents**: Certains talents ajoutent des compétences (ex: Linguistique → Langue supplémentaire)

Voir [database/skills.md](../database/skills.md)

## Structure d'une skill

Propriétés:
- **id**: Identifiant de la compétence
- **spec**: Spécialisation fixe (ex: 'Reikspiel' pour Langue)
- **specs**: Spécialisations possibles (tableau, pour "Au choix")
- **specie**: Bonus racial (toujours 0 actuellement)
- **career**: Bonus de carrière (toujours 0 actuellement)
- **advance**: Avances payées en XP
- **tmpadvance**: Avances temporaires
- **data**: Référence vers database
- **origins**: Sources (espèce, carrières, 'talent')

Méthodes:
- **getCharacteristic()**: Retourne la caractéristique liée
- **getBase()**: Valeur de la caractéristique liée
- **getAdvance()**: advance + specie + career + tmpadvance
- **getTotal()**: getBase() + getAdvance()
- **getBonus()**: Math.floor(getTotal() / 10)

## Méthodes principales

### addSkills(skills, source)

**Rôle**: Ajouter une liste de compétences avec une source commune.

**Entrée**:
- skills: Tableau de compétences (strings ou objets)
- source: Source commune ('specie', 'career|level', 'talent')

**Comportement**:
1. Parse chaque skill (gestion parenthèses, "ou", "Au choix")
2. Pour chaque skill parsée:
   - Recherche si déjà présente (id + spec)
   - Si trouvée: ajoute origin
   - Sinon: crée et ajoute au tableau

3. Retourne le tableau mis à jour

**Parsing**: "Athlétisme" → simple, "Langue (X)" → avec spec, "Métier (Au choix)" → avec specs, "X ou Y" → deux skills.
Voir [pattern-parsing.md](../../patterns/pattern-parsing.md)

### getSkills()

**Rôle**: Retourner toutes les compétences triées alphabétiquement.

**Retour**: Tableau trié par getLabel()

### getAllSkills(all)

**Rôle**: Ajouter automatiquement les compétences de base manquantes.

**Paramètres**:
- all: false = seulement skills de type 'base', true = toutes

**Comportement**:
1. Parcourt CharGen.data.skills
2. Pour chaque skill de base non présente: l'ajoute avec advance=0
3. Retourne getSkills()

**Usage**: Permet d'afficher toutes les compétences de base même non acquises (avec valeur = caractéristique de base).

### searchSkill(id, specs, strict, origin, withAdvance, withTalent)

**Rôle**: Rechercher une compétence avec critères complexes.

**Paramètres**:
- id: Identifiant
- specs: Spécialisation(s) cherchée(s)
- strict: true = spec exacte requise, false = accepte vide
- origin: Filtrer par origine
- withAdvance: true = seulement avec avances > 0
- withTalent: true = accepte origin='talent'

**Retour**: Objet skill ou false

**Exemples**:
- searchSkill('athletisme') → skill Athlétisme
- searchSkill('langue', 'Reikspiel') → skill Langue (Reikspiel)
- searchSkill('langue', '', false) → première Langue trouvée

### createSkill(skill)

**Rôle**: Créer un objet skill complet avec toutes ses méthodes.

**Comportement**: Initialise propriétés et ajoute méthodes getCharacteristic, getLabel, getSymbol, getBase, getAdvance, getTotal, getBonus, addOrigins, hasOrigin.

### setSkill(skill, index)

**Rôle**: Ajouter ou mettre à jour une skill.

**Comportement**:
1. Si index: remplace à cette position
2. Si pas index ET déjà existante: ajoute origins
3. Sinon: crée et ajoute

## Merge sources multiples

Quand une compétence provient de plusieurs sources, elles fusionnent en un seul objet avec origins multiple.

**Exemple Athlétisme**:
- Source 1 (espèce humaine): origins=['humain']
- Source 2 (carrière éclaireur|1): origins=['humain', 'eclaireur|1']
- Source 3 (carrière éclaireur|2): origins=['humain', 'eclaireur|1', 'eclaireur|2']

**Avantage**: Coût XP réduit si hasOrigin(currentCareer) = true

## Calcul valeurs finales

### getBase()

Retourne la valeur totale de la caractéristique liée.

**Exemple Athlétisme (Agilité)**:
- Si Ag totale = 35
- getBase() = 35

### getAdvance()

Somme: advance + specie + career + tmpadvance

**Note**: specie et career toujours 0 dans le système actuel (bonus intégrés dans advance).

### getTotal()

**Formule**: getBase() + getAdvance()

**Exemple Athlétisme avec Ag=35 et 10 avances**:
- getTotal() = 35 + 10 = 45

### getBonus()

**Formule**: Math.floor(getTotal() / 10)

**Exemple skill=45**: getBonus() = 4

## Gestion spécialisations

### Spec fixe

Compétence avec spécialisation définie: "Langue (Reikspiel)"
- spec = 'Reikspiel'
- specs = undefined

### Spec "Au choix"

Compétence avec choix ouvert: "Métier (Au choix)"
- spec = '' (vide tant que non choisi)
- specs = tableau des options possibles
- L'utilisateur doit choisir avant validation

Voir [pattern-specialisations.md](../../patterns/pattern-specialisations.md)

## Exemples concrets

**Athlétisme Humain Éclaireur**: id='athletisme', advance=8, origins=['humain','eclaireur|1'], Ag=35, total=43

**Langue (Reikspiel) Humain**: id='langue', spec='Reikspiel', origins=['humain'], Int=30, total=30

**Corps-à-corps (Base) Soldat|2**: id='corps-a-corps', spec='Base', advance=10, origins=['soldat|1','soldat|2'], CC=47, total=57, hasOrigin('soldat|2')=true

**Langue (Au choix) talent**: id='langue', spec='', specs=[...], origins=['talent'], nécessite choix utilisateur

## Validation

Contraintes:
- Si specs défini (Au choix): spec doit être choisi avant finalisation
- advance >= 0
- origins non vide
- Si origin='talent': le talent correspondant doit avoir getTotal() > 0

Voir [validation.md](./validation.md)

## Voir aussi

- [database/skills.md](../database/skills.md) - Liste des compétences
- [specie-methods.md](./specie-methods.md) - Compétences raciales
- [career-methods.md](./career-methods.md) - Compétences de carrière
- [apply-talent.md](./apply-talent.md) - Compétences ajoutées par talents
- [characteristics.md](./characteristics.md) - Caractéristiques liées
- [pattern-parsing.md](../../patterns/pattern-parsing.md) - Parsing des compétences
- [pattern-specialisations.md](../../patterns/pattern-specialisations.md) - Gestion spécialisations
