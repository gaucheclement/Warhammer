# Export Foundry VTT

## Vue d'ensemble

Export d'un personnage Warhammer depuis l'application vers Foundry Virtual Tabletop au format JSON compatible. Permet utilisation du personnage dans Foundry VTT avec le systeme Warhammer Fantasy Roleplay.

### Difference vs JSON Standard

**JSON Export Standard** : Format application interne, donnees completes ou legeres, reimport direct, structure optimisee sauvegarde.

**Export Foundry** : Format specifique API Foundry VTT, transformation mapping obligatoire, import Foundry via glisser-deposer, structure conforme schema Actor Foundry.

### Etat Actuel V1

Fonction `FoundryfullExport()` desactivee dans StepResume.html (lignes 57-66).

**Raisons probables** : Incompatibilite version Foundry, mapping incomplet, tests insuffisants, simplification V1.

**Traces code** : MainMenu.html ligne 120 import commente, StepResume.html ligne 61 export commente, Code.js lignes 99/149 chargement module FoundryHelper, Code.js lignes 169-189 fonction `getFoundry()` table mapping.

### Architecture

**FoundryHelper** : Module transformation donnees. `export(CharGen, character)` transforme vers format Foundry. `import(CharGen, jsonString)` parse Foundry vers Character interne.

**FoundryCharacterData** : Structure donnees Actor Foundry, templates caracteristiques/competences/talents.

**Table Foundry** : Google Sheets mapping IDs internes vers noms Foundry. Colonnes type, subtype, label, foundryName. Resolution conflits nomenclature.

### Workflow Export

1. Declenchement bouton "Export Foundry" Resume
2. Validation personnage complet (stepIndex >= 8)
3. Transformation `FoundryfullExport(CharGen, character)`
4. Generation JSON schema Foundry Actor
5. Telechargement Blob fichier `[nom].json`
6. Import manuel glisser-deposer Foundry

### Cas d'Usage

**Import Foundry** : Creer personnage app, exporter, importer partie Foundry.
**Partage MJ-Joueurs** : MJ cree PNJ, export, envoi joueurs, import Foundry.
**Backup externe** : Sauvegarde hors app format utilisable ailleurs.
**Migration** : Transfert entre plateformes via conversion.

## Format Foundry VTT

### Structure Actor

**Racine** :
```
{
  name: "Nom Personnage",
  type: "character",
  data: { ... },
  items: [ ... ],
  flags: { ... },
  folder: null,
  sort: 0,
  permission: {default: 0}
}
```

**Champs obligatoires** :
- name : Nom personnage (details[0] ou "Personnage Sans Nom")
- type : Toujours "character" (vs "npc", "creature")
- data : Caracteristiques, derivees, details
- items : Array competences, talents, sorts, equipement
- flags : Metadonnees application source (optionnel)

### Section data - Characteristics

```
data.characteristics: {
  WS: {initial: 30, advances: 5, modifier: 0},
  BS: {initial: 28, advances: 0, modifier: 0},
  S: {initial: 32, advances: 2, modifier: 0},
  T: {initial: 31, advances: 2, modifier: 0},
  I: {initial: 40, advances: 0, modifier: 5},
  Ag: {initial: 28, advances: 0, modifier: 0},
  Dex: {initial: 24, advances: 1, modifier: 0},
  Int: {initial: 32, advances: 0, modifier: 0},
  WP: {initial: 25, advances: 0, modifier: 0},
  Fel: {initial: 31, advances: 0, modifier: 0}
}
```

### Section data - Derived Stats

```
data.status: {
  wounds: {max: 13, value: 13},
  fate: {value: 3},
  fortune: {value: 3},
  resilience: {value: 2},
  resolve: {value: 2},
  sin: {value: 0},
  corruption: {value: 0}
}
```

### Section data - Details

```
data.details: {
  species: "Human (Reiklander)",
  career: "Agitator (Rank 1)",
  age: "25",
  height: "1.75m",
  eyes: "Bruns",
  hair: "Chatain"
}
```

### Compatibilite Versions

**Foundry VTT** : Compatible 0.8.x - 11.x (systeme WFRP).
**Systeme WFRP** : Module officiel Warhammer Fantasy Roleplay 4e edition.
**Format** : Evolution versions necessite adaptation mapping.

## Mapping par Type d'Entite

### Caracteristiques

**Transformation** : Caracteristiques personnage format application vers format Foundry VTT. Preservation valeurs base, avances carriere, avances espece, avances XP.

**Application** : 10 caracteristiques FR (Capacite Combat, Capacite Tir, Force, Endurance, Initiative, Agilite, Dexterite, Intelligence, Force Mentale, Sociabilite).

**Foundry** : Abreviations EN (WS, BS, S, T, I, Ag, Dex, Int, WP, Fel).

**Correspondances** : CC→WS (Weapon Skill), CT→BS (Ballistic Skill), F→S (Strength), E→T (Toughness), I→I (Initiative), Ag→Ag (Agility), Dex→Dex (Dexterity), Int→Int (Intelligence), FM→WP (Willpower), Soc→Fel (Fellowship).

**Structure donnees Application** : `Character.getCharacteristics()` retourne array objets `{id, data, base, specie, career, advance, avances temporaires}`.

**Structure donnees Foundry** : `data.characteristics` objet cles abreviations `{WS: {initial, advances, modifier}, ...}`.

**Calcul total Application** : total = base + specie + career + advance + avances temporaires + modificateurs talents.

**Calcul total Foundry** : value = initial + advances + modifier.

**Transformation** : initial = base + specie (valeur initiale incluant racial), advances = career + advance + avances temporaires (progression carriere + XP), modifier = somme modificateurs talents applicables.

**Exemple Humain Agitateur CC** : Application (base 25, specie 5, career 5, advance 0, total 35). Foundry (initial 30, advances 5, value 35).

**Exemple Nain Tueur Force** : Application (base 30, specie 10 bonus nain, career 10, advance 2 XP, total 52). Foundry (initial 40, advances 12, value 52).

**Modificateurs Talents** : Talent Tres Resistant +5 Endurance. Application `char.total` inclut modificateur dynamiquement. Foundry modifier 5 ajoute calcul final.

**Preservation calculs** : Foundry doit pouvoir recalculer totaux independamment. Avances detaillees specie/career/XP fusionnees advances. Modificateurs talents avec effets automatises appliques separement Foundry.

**Cas limites** : Caracteristique modifiee temporairement (sorts, etats) ignoree export consideree temporaire. Valeur depassant 100 preservee telle quelle (Foundry accepte >100). Valeur negative possible (malus importants) preservee.

### Competences

**Transformation** : Competences personnage vers format Foundry items type "skill". Preservation specialisations, avances, caracteristique associee.

**Structure Application** : `Character.getSkills()` retourne array objets `{id, data, spec, specie, career, advance, avances temporaires}`.

**Structure Foundry** : items array avec `{name, type: "skill", data: {characteristic, advances}}`.

**Mapping noms** : FR vers EN via table mapping. "Athletisme"→"Athletics", "Charme"→"Charm", "Metier (Menuiserie)"→"Trade (Carpentry)".

**Specialisations** : Application spec string ("Menuiserie", "Forgeron"). Foundry `data.specialisation` ou integre nom ("Trade (Carpentry)").

**Cas particuliers** : Langue (Reikspiel) spec preserve, Metier (X) spec entre parentheses, Competence sans spec vide.

**Calcul avances** : Total advances = specie + career + advance + avances temporaires. Foundry `data.advances.value` nombre total origine non distinguee.

**Exemple Menuisier** : Application "Metier (Menuiserie)" (specie 0, career 10, advance 5, avances temporaires 2, total 17). Foundry "Trade (Carpentry)" (advances.value 17, characteristic "Dex").

**Groupement** : Application liste plate toutes competences. Foundry organisees categorie (Basic, Advanced) automatiquement systeme. Export liste complete sans categorisation (Foundry reorganise).

**Caracteristique associee** : Application `skillcharacteristic` reference ID. Foundry `data.characteristic` abreviation "WS", "Dex", etc. Transformation lookup mapping characteristic extraction abreviation.

**Exemple competence simple Charme** : App `{label: "Charme", specie: 5, career: 0, characteristic: "Sociabilite"}`. Foundry `{name: "Charm", type: "skill", data: {characteristic: "Fel", advances: {value: 5}}}`.

**Exemple competence specialisee Langue Reikspiel** : App `{label: "Langue (Reikspiel)", spec: "Reikspiel", specie: 5}`. Foundry `{name: "Language (Reikspiel)", specialisation: "Reikspiel", advances: {value: 5}}`.

**Exemple competence multiple specs Metier** : App deux skills "Metier (Menuiserie)" et "Metier (Forgeron)". Foundry deux items distincts "Trade (Carpentry)" et "Trade (Blacksmith)".

### Talents

**Transformation** : Talents personnage vers format Foundry items type "talent". Preservation rangs, specialisations, effets.

**Structure Application** : `Character.getTalents()` retourne array objets `{id, data, spec, roll}`.

**Structure Foundry** : items array avec `{name, type: "talent", data: {advances, specification}}`.

**Mapping noms** : FR vers EN via table mapping. "Perspicace"→"Savvy", "Tres resistant"→"Very Resilient", "Artiste"→"Artist", "Ambidextre"→"Ambidextrous".

**Rangs multiples** : Application roll indique rang acquis (1-N). Foundry `data.advances.value` nombre fois talent pris. Talents rangs "Tres resistant", "Tres fort", "Magie mineure". Export advances = roll (1 si unique, 2+ si multiples).

**Specialisations talents** : Cas speciaux Artiste (Musicien), Linguiste (Elfique). Application spec string. Foundry `data.specification` string. Transformation traduction spec si presente table mapping sinon preservation.

**Effets automatises** : Application talents avec modificateurs caracteristiques (Tres Resistant +5 E). Foundry `data.effects` array effets actifs automatiques. Export V1 effets NON exportes (desactivation fonctionnalite). Future mapping effets application vers Active Effects Foundry.

**Exemple talent simple Perspicace** : App `{label: "Perspicace", roll: 1}`. Foundry `{name: "Savvy", type: "talent", data: {advances: {value: 1}}}`.

**Exemple talent rangs multiples Tres Resistant x2** : App `{label: "Tres resistant", roll: 2}`. Foundry `{name: "Very Resilient", data: {advances: {value: 2}}}`.

**Exemple talent specialise Artiste Musicien** : App `{label: "Artiste", spec: "Musicien"}`. Foundry `{name: "Artist", data: {specification: "Musician"}}`.

**Exemple talent modificateur Tres Fort** : App `{label: "Tres fort", roll: 1, modificateur Force implicite}`. Foundry `{name: "Very Strong", effects: [] (non implemente V1)}`. Note modificateur Force applique manuellement Foundry ou via Active Effect futur.

**Prerequis talents** : Application relations prerequis non exportees (donnees statiques tables). Foundry systeme WFRP gere prerequis nativement (pas besoin export).

### Equipement

**Transformation** : Trappings (equipement) personnage vers format Foundry items types "weapon", "armour", "container", "money", "trapping".

**Types equipement** : Application `Character.getTrappings()` retourne array strings ou objets. Foundry items array avec type specifique selon categorie.

**Categorisation** : Armes (subtype="weapon" vers type "weapon" Foundry), Armures (subtype="armour" vers type "armour" Foundry), Conteneurs (Sacs, bourses vers type "container"), Argent (Pieces or/argent/bronze vers type "money"), Objets (Autres vers type "trapping").

**Mapping armes** : Application nom FR + proprietes (degats, groupe, portee, qualites). Foundry `{name: EN, data: {damage, range, weaponGroup, qualities}}`.

**Exemple Epee** : App "Epee", degats "CC+4", groupe "Ordinaire", qualites []. Foundry `{name: "Sword", type: "weapon", data: {damage: {value: "SB+4"}, weaponGroup: {value: "ordinary"}}}`. Transformation degats "CC+4" vers "SB+4" (CC=Capacite Combat vers SB=Strength Bonus).

**Mapping armures** : Application nom FR + points armure par localisation. Foundry `{name: EN, data: {AP: {head, body, rArm, lArm, rLeg, lLeg}}}`.

**Exemple Armure Cuir** : App "Armure de cuir", corps 1, bras 1, jambes 1. Foundry `{name: "Leather Armour", data: {AP: {body: 1, lArm: 1, rArm: 1, lLeg: 1, rLeg: 1}}}`.

**Quantites** : Application quantite dans string "Rations (3 jours)" ou champ separe. Foundry `data.quantity.value` nombre. Parsing extraction nombre entre parentheses si present sinon 1.

**Encombrement** : Application calcul base enc par item. Foundry `data.encumbrance.value` poids individuel. Total Foundry calcule automatiquement encumbrance total personnage.

**Exemple arme Arc Long** : App "Arc long", degats "CT+4", portee "30/60", qualites ["Trait 1"]. Foundry `{name: "Longbow", type: "weapon", data: {damage: {value: "SB+4"}, range: {normal: 30, long: 60}, qualities: [{name: "Trait 1"}]}}`.

**Exemple armure complete Plates** : App "Armure de plaques complete", AP tete 5, corps 5, membres 5. Foundry `{name: "Full Plate Armour", data: {AP: {head: 5, body: 5, lArm: 5, rArm: 5, lLeg: 5, rLeg: 5}}}`.

**Exemple objets multiples Rations** : App "Rations (7 jours)". Foundry `{name: "Rations", type: "trapping", data: {quantity: {value: 7}}}`.

**Exemple Argent** : App champ money (couronnes or, pistoles argent, sous bronze). Foundry `{type: "money", data: {gc: X, ss: Y, bp: Z}}` (gold crowns, silver shillings, brass pennies).

### Sorts

**Transformation** : Sorts (spells) personnage vers format Foundry items type "spell". Preservation domaine magie (lore), CN, portee, duree, ingredients.

**Structure Application** : `Character.getSpells()` retourne array objets `{id, data: {label, lore, cn, range, target, duration, ingredient}}`.

**Structure Foundry** : items array avec `{name, type: "spell", data: {lore, cn, range, target, duration, ingredient}}`.

**Mapping noms** : FR vers EN via table mapping. "Fleche enflammee"→"Flaming Arrow", "Projectile magique"→"Magic Dart", "Protection contre le mal"→"Ward Against Evil".

**Domaines magie** : Application lore string ("Celeste", "Feu", "Ombres", "Petit", "Arcanique"). Foundry `data.lore.value` string EN ("Heavens", "Fire", "Shadow", "Petty", "Arcane"). Mapping lores table foundry type="lore".

**Caracteristiques sort** : CN (Nombre Incantation) `data.cn.value` nombre preserve tel quel. Portee `data.range.value` string "Vous", "10 metres", etc. Cible `data.target.value` string "1 creature", "Zone 5m", etc. Duree `data.duration.value` string "Instantane", "1 minute", "Permanent". Ingredient `data.ingredient.value` string description composant.

**Exemple sort Petite Magie Lumiere** : App `{label: "Lumiere", lore: "Petit", cn: 2, range: "Vous", duration: "1 heure"}`. Foundry `{name: "Light", type: "spell", data: {lore: "Petty", cn: 2, range: "You", duration: "1 hour"}}`.

**Exemple sort Domaine Fleche Enflammee** : App `{label: "Fleche enflammee", lore: "Feu", cn: 5, range: "48 metres", target: "1 creature", duration: "Instantane", ingredient: "Pincee de cendres"}`. Foundry `{name: "Flaming Arrow", type: "spell", data: {lore: "Fire", cn: 5, range: "48 yards", target: "1 creature", duration: "Instant", ingredient: "Pinch of ash"}}`.

**Exemple sort Complexe Ailes Celestes** : Plusieurs effets, ingredient rare, CN eleve. Foundry meme structure, description detaillee preservee `data.description`.

**Traduction champs** : Texte libre portee, cible, duree, ingredient traduits FR vers EN. Fallback si pas dans mapping preserver FR (utilisateur Foundry anglophone peut editer).

### Mapping IDs

**Table correspondance** : Nomenclature interne application vers noms officiels Foundry VTT. Resout differences denomination (traduction FR/EN, abreviations, variantes) lors transformation export.

**Stockage** : Google Sheets onglet "Foundry", fonction `getFoundry()` Code.js lignes 169-189. Colonnes type, subtype, label (FR), foundryName (EN). Format array objets `{index, type, subtype, label, foundryName}`.

**Types principaux** : characteristic (Capacites combat, tir, force vers WS, BS, S, T, I, Ag, Dex, Int, WP, Fel), skill (Competences avec specialisations "Metier (Menuiserie)"→"Trade (Carpentry)"), talent (Talents "Perspicace"→"Savvy", "Tres resistant"→"Very Resilient"), trapping (Equipement subtype weapon, armour, item "Epee"→"Sword"), spell (Sorts "Fleche enflammee"→"Flaming Arrow"), specie (Especes "Humains (Reiklander)"→"Human (Reiklander)"), career (Carrieres "Agitateur|1"→"Agitator (Rank 1)").

**Resolution conflits** : Entrees absentes fallback utiliser label FR directement. Translitteration fonction toId() normalise (lowercase, accents, trim) pour fuzzy matching. Creation dynamique nouveaux mappings sauvegardes Sheets pour exports futurs. Noms multiples priorite contexte choisir mapping selon espece carriere actuelle personnage. Specialisations preferer version specialisee si disponible ("Metier (Forgeron)" vs "Metier" generique). Variantes orthographiques normalisation toId() Code.js ligne 295 (elimine accents, espaces multiples, casse). Exemples "Armure de cuir" = "Armure cuir" = "ARMURE DE CUIR" normalises identiques.

**Exemple export Humain Agitateur** : Avant Specie "Humains (Reiklander)", Career "Agitateur|1", CC 28. Lookups 3 requetes (type=specie, type=career, type=characteristic). Apres species "Human (Reiklander)", career "Agitator (Rank 1)", WS 28.

**Exemple competence specialisee** : Avant Skill "Metier (Menuiserie)", spec "Menuiserie". Lookup type=skill, label="Metier (Menuiserie)" vers "Trade (Carpentry)". Export item.name = "Trade (Carpentry)", itemspecialisation = "Carpentry".

**Exemple talent custom non mappe** : Avant Talent "Super Pouvoir" (ajoute admin, absent mapping). Lookup NOT FOUND. Fallback foundryName = "Super Pouvoir" (label FR). Warning Log "Talent 'Super Pouvoir' non mappe, label original utilise".

**Maintenance** : Ajouts mise jour manuelle onglet Foundry Sheets. Validation verifier tous labels app ont foundryName (detection manques). Sync Foundry updates systeme WFRP necessitent revue complete mapping. Logs exports generent warnings pour entites non mappees (audit).

## Validation et Import

### Validation Export

**Verifications pre-export** : Garantissent JSON genere valide, complet, importable Foundry VTT sans erreurs.

**Validation personnage** : Completude personnage termine (stepIndex >= 8) ou minimum avoir specie + career + characteristics. Coherence valeurs caracteristiques dans plages valides (0-100 generalement). Donnees requises nom, espece, carriere presents.

**Checks obligatoires** : Specie definie (getSpecie() not null), Career defini (getCareerLevel() not null), 10 caracteristiques presentes, Nom personnage non vide (ou fallback "Unnamed Character").

**Validation items** : Skills chaque skill a characteristic valide advances >= 0. Talents nom mappe Foundry advances >= 1. Trappings type determine (weapon/armour/trapping) nom mappe. Spells lore valide CN >= 0.

**Checks items** : Aucun item avec name vide. Tous skills ont characteristic referencant WS/BS/S/T/I/Ag/Dex/Int/WP/Fel. Tous items ont type valide (skill/talent/weapon/armour/spell/trapping/money).

**Validation mapping** : Noms manquants entites sans correspondance table Foundry generent warnings (export continue avec fallback). IDs invalides references cassees detectees avant export.

**Logs warnings** : Export genere liste warnings "Talent 'X' non mappe, utilisation label FR", "Skill 'Y' characteristic inconnue, fallback Ag", "Spell 'Z' lore absent mapping, preservation FR".

**Validation JSON** : Syntaxe JSON.stringify doit reussir sans exception. Taille fichier < 10 MB (securite, performance Foundry). Encodage UTF-8 (accents francais preserves).

**Tests structure** : Apres generation JSON parser verifier JSON.parse(output) ne throw pas. Objet a proprietes {name, type, data, items}. items est array. data.characteristics a 10 cles.

**Messages erreur** : Personnage incomplet "Personnage incomplet. Finalisez espece, carriere et caracteristiques avant export." Mapping manquant "Attention : 3 entites non mappees (voir logs). Export poursuivi avec noms francais." Donnees invalides "Erreur : Caracteristique Initiative valeur -10 invalide. Corrigez avant export."

**Blocage vs Warning** : Blocage personnage incomplet JSON invalide export annule. Warning mappings manquants specs absentes export continue avec fallback.

**Exemple export valide Agitateur complet** : Personnage stepIndex 8. Toutes donnees presentes. Tous mappings trouves. Resultat export reussit aucun warning.

**Exemple export warning talent custom** : Personnage complet. Talent "Mon Talent Perso" ajoute admin (absent mapping). Resultat warning logged export reussit talent nom FR dans JSON.

**Exemple export bloque incomplet** : Personnage stepIndex 2 (seulement specie + career). Caracteristiques non initialisees. Resultat erreur "Finalisez personnage" export annule.

**Validation post-import Foundry** : Test recommande apres export importer dans Foundry test verifier Actor cree sans erreur, Caracteristiques affichees correctement, Competences calculees, Equipement present, Sorts accessibles.

### Import Foundry

**Import personnage** : Depuis JSON Foundry VTT vers application. Transformation inverse export Actor Foundry vers Character interne.

**Etat V1** : Fonctionnalite commentee code MainMenu.html ligne 120 `Foundryimport()` desactive. Raisons complexite mapping inverse, risques donnees incoherentes, priorisation export sur import.

**Process import prevu** : Workflow Upload input file JSON Foundry, Parsing JSON.parse(fileContent), Validation verifier structure Actor type="character", Transformation Foundry vers format application interne, Reconstruction creation Character via character = new Character(), Chargement load(transformedData), Affichage Wizard Resume (stepIndex = -1).

**Transformation inverse** : Characteristics WS/BS/S/T vers CC/CT/F/E avec calculs inverses (initial+advances vers base+specie+career). Skills items type="skill" vers Character.getSkills() avec extraction specs. Talents items type="talent" vers Talents avec roll = advances. Trappings items weapon/armour/trapping vers Trappings strings ou objets. Spells items type="spell" vers Spells avec lore EN vers FR.

**Defis mapping inverse** : Perte information Foundry ne distingue pas specie vs career advances (fusionne total). Reconstruction deviner distribution base/specie/career/XP impossible sans metadata. Fallback placer tout dans base laisser 0 pour specie/career/advance (utilisateur ajuste manuellement). Specialisations Skills extraction spec depuis nom "Trade (Carpentry)" vers label "Metier", spec "Menuiserie". Parsing regex extraction parentheses lookup mapping inverse.

**Validation import** : Format JSON valide Foundry Actor. Version systeme WFRP compatible. Completude donnees minimales presentes (name, characteristics, species, career).

**Erreurs possibles** : JSON invalide parse exception message "Fichier corrompu". Type incorrect type != "character" message "Seuls personnages importables". Donnees manquantes Characteristics absentes message "Format incomplet".

**Gestion contenus manquants** : Entites inconnues Skill/Talent/Spell absent tables app creation entree custom (flag customContent). IDs nouveaux attribution IDs auto-incrementes pour entites non reconnues.

**Exemple import Foundry standard** : JSON Actor exporte Foundry (cree manuellement VTT). Process Parse, Lookup inverse mappings, Reconstruction  Resultat Personnage importe stepIndex -1 editable wizard.

**Exemple import avec contenus custom** : JSON Actor avec talent custom "Homebrew Talent". Process Lookup echoue creation talent custom flag. Resultat Talent importe marque custom (editable admin seulement).

**Exemple import incomplet** : JSON Actor sans characteristics. Validation echec check obligatoires. Resultat Erreur "Donnees manquantes" import annule.

**Cas d'usage** : Migration Foundry vers App MJ cree PNJ Foundry export import app pour generation fiche detaillee. Recuperation personnage perdu app mais sauvegarde Foundry reimport. Partage inverse joueur Foundry envoie personnage joueur application.

**Limitations** : Perte precision distribution advances (specie/career/XP) non reconstituable exactement. Contenus custom Talents/Skills custom Foundry peuvent ne pas avoir equivalent app. Historique XP depensee detaillee perdue (seulement totaux).

## Exemples Complets

### Exemple 1 - Export Agitateur Humain

**Personnage** : Johann Schmidt, Humain Reiklander, Agitateur niveau 1.

**Declencheur** : Clic bouton "Export Foundry".

**Generation** : `FoundryfullExport()` transforme Specie "Humain (Reiklander)" vers Foundry species "human", Career "Agitateur|1" vers Foundry career "Agitator", Characteristics array vers Foundry characteristics object, Skills array vers Foundry items type "skill", Talents array vers Foundry items type "talent".

**Fichier** : `Johann-Schmidt.json` (~30 KB).

**Import Foundry** : Glisser fichier, Actor cree avec toutes donnees.

### Exemple 2 - Export Sorcier avec Sorts

**Personnage** : Elara Windcaller, Elfe, Apprenti Sorcier.

**Specificite** : 8 sorts domaine Celeste.

**Transformation** : Sorts vers Foundry items type "spell" avec CN, portee, duree, ingredients.

**Resultat** : Sorts affiches onglet Foundry, utilisables avec jet automatique.

**Utilite** : Lanceurs sorts beneficient automation Foundry (gestion ingredients, degats, etc.).

### Exemple 3 - Export Nain Tueur

**Personnage** : Gotrek Gurnisson, Nain, Tueur de Trolls.

**Specificite** : Equipement lourd (hache runique +10%, armure lourde).

**Transformation** : Trappings vers Foundry items type "weapon"/"armour" avec proprietes (degats, qualites).

**Import** : Armes/armures directement equipables dans Foundry, bonus auto-calcules.

### Exemple 4 - Personnage Minimal

Humain debut carriere, aucune competence advance, equipement basique, ~15 KB JSON.

### Exemple 5 - Personnage Experimente

Rang 3, 50+ competences, 15 talents, equipement varie, sorts, ~80 KB JSON.

### Exemple 6 - Personnage Complexe

Multi-carrieres, talents rangs multiples, effets actifs, historique XP, ~150 KB JSON.

## Limitations V1

**Export desactive** : Fonctionnalite commentee non accessible utilisateur.

**Mapping incomplet** : Certains talents/competences sans equivalent Foundry.

**Pas validation** : Export sans verification coherence donnees.

**Import unidirectionnel** : Foundry vers App non implemente.

**Dependance version** : Changements API Foundry necessitent mise jour.

**Perte precision** : Distribution advances (specie/career/XP) non reconstituable exactement lors import inverse.

**Contenus custom** : Talents/Skills custom Foundry peuvent ne pas avoir equivalent app.

**Historique** : XP depensee detaillee perdue (seulement totaux).

## Voir Aussi

- [json-serialization.md](./json-serialization.md) - JSON standard et compatibilite versions
- [import-export-tests.md](./import-export-tests.md) - Tests validation import/export
- [../save-load/json-export.md](../save-load/json-export.md) - Export sauvegarde interne
- [../wizard/resume.md](../wizard/resume.md) - Etape finale wizard (point depart export)
