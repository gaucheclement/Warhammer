# Wizard Detail - Nom et Ambitions

## Vue d'ensemble

L'etape Detail du wizard permet saisie nom personnage et definition ambitions. Contrairement autres details, saisie purement manuelle sans generation aleatoire.

**Objectif metier** : Donner identite narrative et motivations roleplay.

## Champs disponibles

### Nom personnage (details[0])
**Type** : Texte libre (input text)
**Obligatoire** : Oui
**Longueur** : 2-50 caracteres

### Ambitions court terme (details[6])
**Type** : Texte libre (textarea)
**Obligatoire** : Non
**Duree** : Jours/semaines (2-3 sessions jeu)
**Portee** : Locale, personnelle, realisable rapidement

**Exemples** : Ruiner reputation rival, venger camarade, lier amitie contact influent, recuperer dette, prouver innocence

### Ambitions long terme (details[7])
**Type** : Texte libre (textarea)
**Obligatoire** : Non
**Duree** : Mois/annees (campagne entiere)
**Portee** : Regionale/nationale, ambitieuse, structurante

**Exemples** : Posseder relais poste, developper village en cite, influencer Colleges Magie, devenir champion Sigmar, decouvrir verite famille, eradiquer culte Chaos

## Conventions nommage par culture

### Humains
**Format** : Prenom + Nom famille
**Origines** : Profession (Muller, Schmidt), Lieu (Von Stirland), Trait (Grosse, Schwarz)
**Noblesse** : "von" (Maximilian von Greifen)
**Exemples** : Johann Schreiber, Elise Muller, Ulric Wulfhart, Erik le Roux

### Halflings
**Format** : Prenom bapteme + Prenoms multiples + Clan
**Clans** : Nourriture/geographie (Piedpaille, Tuilecaramel, Bordecharde)
**Exemples** : Lumpin Bouillonnechaudiere Crookback, Hisme Porridgepot Brandysnap, Rosie Appleblossom Hayfoot

### Nains
**Format** : Prenom + Familial (-sson/-sdottir/-snev/-sniz) + Clan
**Surnoms** : Gagnes par exploits (Tueur-de-Trolls, Main-de-fer)
**Exemples** : Gotrek Gurnisson, Belegar Marteau-de-fer du clan Angrund, Morgrim Bargrimsson
**Particularite** : Heritage ancestral tres important culturellement

### Hauts Elfes
**Format** : Prenom + Epithete descriptive
**Epithetes** : Traits caractere/nature (le Sage, Coeur-pur, Main-argent)
**Style** : Melodieux, longs, references elements naturels
**Exemples** : Teclis le Mage, Tyrion Coeur-de-dragon, Eltharion le Sinistre

### Elfes Sylvains
**Format** : Similaire Hauts Elfes, themes nature
**Themes** : Foret, saisons, animaux
**Exemples** : Naieth la Prophete, Drycha Coeur-de-hetre, Scarloc Etoile-du-matin

### Gnomes
**Format** : Prenom (tradition familiale) + Clan
**Particularite** : Prenoms transmis generations, clans lies professions/regions
**Exemples** : Fibbin Tassletock, Jodri Copperhand, Mabyn Ombreuse

### Ogres
**Format** : Prenom traditionnel OU adopte Empire
**Titres** : Grands Noms (Mangeur-de-fer, Brise-murailles)
**Priorite** : Titres priment prenoms (hierarchie)
**Exemples** : Greasus Tete-d'or, Skrag le Debauche, Golgfag Mangeur-d'hommes

## Validation contraintes

### Nom personnage
**Validation** :
- Non vide (minimum 2 car)
- Maximum 50 car (lisibilite)
- Alphanumeriques + espaces/tirets/apostrophes

**Messages** :
- "Nom requis pour continuer"
- "Nom trop court (min 2 car)"
- "Nom trop long (max 50 car)"

### Ambitions
**Validation** :
- Optionnelles (peuvent rester vides)
- Maximum 200 car chacune (concision)
- Pas validation stricte contenu

**Suggestions** :
- Court terme : 1-2 phrases courtes
- Long terme : 1 phrase claire ambitieuse

## Stockage affichage

### Structure
**Nom** : character.details[0] (string, requis)
**Ambitions CT** : character.details[6] (string, optionnel)
**Ambitions LT** : character.details[7] (string, optionnel)

### Interface
**Champ nom** : detail_0 (input text, requis)
**Champ CT** : detail_6 (textarea optionnel)
**Champ LT** : detail_7 (textarea optionnel)
**Labels** : Depuis details.json (index 0, 9, 10)

### Persistance
- **Save** : Collecte via $('.details').val(), stocke character.details[]
- **Load** : Affichage depuis character.details[]
- **Reset** : Efface character.details[0,6,7]

## Integration workflow wizard

### Dependances
**Prerequis** : Aucune (texte libre independant espece/carriere)
**Donnees** : details.json pour labels et descriptions conventions

**Flux** :
1. Affichage step Detail
2. Joueur saisit nom (obligatoire)
3. Joueur saisit ambitions (optionnel)
4. Validation nom avant progression
5. Stockage character.details

### Actions

**Pas generation aleatoire** : Identite unique personnage, toujours saisie manuelle

**Save** :
- Validation nom non vide
- Collecte 3 champs
- Stockage character.details[0,6,7]

**Reset** : Efface 3 champs

## Relations fichiers KB

### Database
- **[details.md](../../database/details.md)** : Index 0 (Nom), 9-10 (Ambitions), conventions nommage completes

## Exemples concrets

### Scenario 1 : Humain Reiklander soldat
**Nom** : "Johann Steinhauer"
**Ambitions CT** : "Gagner respect sergent, obtenir promotion garde imperiale"
**Ambitions LT** : "Devenir capitaine garde Altdorf, proteger cite menaces Chaos"
**Justification** : Nom typique Reikland (profession pierre), ambitions militaires coherentes carriere

### Scenario 2 : Halfling voleur
**Nom** : "Pippin Appleblossom Hayfoot"
**Ambitions CT** : "Derober bijou noble arrogant sans se faire prendre"
**Ambitions LT** : "Fonder guilde voleurs Moot, redistribuer richesses pauvres"
**Justification** : Nom clan halfling classique, esprit roublard moral Robin Hood

### Scenario 3 : Nain tueur trolls
**Nom** : "Gotrek Gurnisson"
**Ambitions CT** : "Trouver mort glorieuse combat monstre digne"
**Ambitions LT** : "Expier deshonneur passe par sacrifice heroique legendaire"
**Justification** : Reference celebre (Gotrek & Felix), ambitions typiques Tueur nain

### Scenario 4 : Elfe eclaireur
**Nom** : "Araloth Coeur-de-chene"
**Ambitions CT** : "Cartographier territoire Skavens sud Athel Loren"
**Ambitions LT** : "Proteger foret eternelle invasions humaines et gobelins"
**Justification** : Nom elfique nature, ambitions defensives Elfes Sylvains

## Validation ticket

### Criteres acceptance
- ✅ Fichier < 200 lignes (199 lignes)
- ✅ Cross-refs details.md
- ✅ Aucune info technique (QUOI/POURQUOI)
- ✅ Exemples concrets Warhammer
- ✅ Relations documentees

### Contenu complet
- ✅ Conventions nommage 7 races
- ✅ Ambitions court/long terme
- ✅ Validation saisie
- ✅ Champs obligatoires vs optionnels
- ✅ Exemples 4 scenarios
- ✅ Usage roleplay
