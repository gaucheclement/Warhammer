# Import Foundry - Import Personnage

## Contexte

Import personnage depuis JSON Foundry VTT vers application. Transformation inverse export : Actor Foundry → Character interne.

## État V1

**Fonctionnalité commentée** : Code MainMenu.html ligne 120 `FoundryHelper.import()` désactivé
**Raisons** : Complexité mapping inverse, risques données incohérentes, priorisation export sur import

## Process Import (Prévu)

### Workflow

1. **Upload** : Input file JSON Foundry
2. **Parsing** : JSON.parse(fileContent)
3. **Validation** : Vérifier structure Actor type="character"
4. **Transformation** : Foundry → format application interne
5. **Reconstruction** : Création Character via CharGen.character = new Character()
6. **Chargement** : character.load(transformedData)
7. **Affichage** : Wizard Resume (stepIndex = -1)

### Transformation Inverse

**Characteristics** : WS/BS/S/T/... → CC/CT/F/E/... avec calculs inverses (initial+advances → base+specie+career)
**Skills** : items type="skill" → Character.getSkills() avec extraction specs
**Talents** : items type="talent" → Talents avec roll = advances
**Trappings** : items weapon/armour/trapping → Trappings strings ou objets
**Spells** : items type="spell" → Spells avec lore EN → FR

## Défis Mapping Inverse

**Perte information** : Foundry ne distingue pas specie vs career advances (fusionné total)
**Reconstruction** : Deviner distribution base/specie/career/XP impossible sans métadata
**Fallback** : Placer tout dans base, laisser 0 pour specie/career/advance (utilisateur ajuste manuellement)

### Spécialisations

**Skills** : Extraction spec depuis nom "Trade (Carpentry)" → label "Métier", spec "Menuiserie"
**Parsing** : Regex extraction parenthèses, lookup mapping inverse

## Validation Import

**Format** : JSON valide Foundry Actor
**Version** : Système WFRP compatible
**Complétude** : Données minimales présentes (name, characteristics, species, career)

### Erreurs Possibles

**JSON invalide** : Parse exception → Message "Fichier corrompu"
**Type incorrect** : type != "character" → Message "Seuls personnages importables"
**Données manquantes** : Characteristics absentes → Message "Format incomplet"

## Gestion Contenus Manquants

**Entités inconnues** : Skill/Talent/Spell absent tables app → Création entrée custom (flag customContent)
**IDs nouveaux** : Attribution IDs auto-incrémentés pour entités non reconnues

## Exemples Concrets

### Import Foundry Standard

**JSON** : Actor exporté Foundry (créé manuellement VTT)
**Process** : Parse → Lookup inverse mappings → Reconstruction character
**Résultat** : Personnage importé, stepIndex -1, éditable wizard

### Import avec Contenus Custom

**JSON** : Actor avec talent custom "Homebrew Talent"
**Process** : Lookup échoue → Création talent custom flag
**Résultat** : Talent importé, marqué custom (éditable admin seulement)

### Import Incomplet

**JSON** : Actor sans characteristics
**Validation** : Échec check obligatoires
**Résultat** : Erreur "Données manquantes", import annulé

## Cas d'Usage

**Migration Foundry → App** : MJ crée PNJ Foundry, export, import app pour génération fiche détaillée
**Récupération** : Personnage perdu app mais sauvegardé Foundry, réimport
**Partage inversé** : Joueur Foundry envoie personnage à joueur application

## Limitations

**Perte précision** : Distribution advances (specie/career/XP) non reconstituable exactement
**Contenus custom** : Talents/Skills custom Foundry peuvent ne pas avoir équivalent app
**Historique** : XP dépensée détaillée perdue (seulement totaux)

## Voir Aussi

- [foundry-overview.md](./foundry-overview.md) - Export Foundry
- [foundry-mapping.md](./foundry-mapping.md) - Tables correspondance
- [json-import.md](./json-import.md) - Import JSON standard
