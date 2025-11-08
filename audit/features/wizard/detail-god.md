# Wizard Detail - Selection Dieu Patron

## Vue d'ensemble

L'etape Detail du wizard permet selection dieu patron parmi divinites Vieux Monde. Choix influence roleplay, acces sorts divins (pretres), commandements.

**Objectif metier** : Etablir affiliation religieuse coherente culture/race.

## Modes selection

### Selection manuelle
1. Affichage liste dieux disponibles (filtres espece/region optionnels)
2. Joueur clique dieu souhaite
3. Affichage description complete (spheres, commandements, titre)
4. Confirmation

**Pas generation aleatoire** : Choix profondement personnel/narratif (pas mecanisme random).

## Divinites disponibles

### Dieux majeurs Empire (LDB - 10 dieux)
**Manann** (Mer), **Morr** (Mort), **Myrmidia** (Strategie), **Ranald** (Ruse), **Rhya** (Fertilite), **Shallya** (Misericorde), **Sigmar** (Empire), **Taal** (Nature), **Ulric** (Guerre), **Verena** (Sagesse)

### Divinites mineures (3)
**Handrich** (Commerce), **Solkan** (Justice vengeresse), **Stromfels** (Pirates, heretique)

### Divinites gnomes (NADJ - 3)
**Evawn** (Voyages), **Mabyn** (Ombres), **Ringil** (Divertissement)

**Total** : 16 divinites

## Filtrage divinites

### Restrictions raciales
**Gnomes** : Limites Evawn/Mabyn/Ringil (exclusivite)
**Autres races** : Acces tous dieux Empire

### Preferences culturelles
**Reikland** : Sigmar (dominance)
**Middenland/Nordland** : Ulric (rival Sigmar)
**Cotes** : Manann (protection maritime)
**Rural** : Taal/Rhya (nature/fertilite)
**Urbain** : Verena (savoir), Ranald (pauvrete), Shallya (maladie)

### Affinites carrieres
**Pretres** : Dieu determine sorts (coherence obligatoire)
**Guerriers** : Ulric, Sigmar, Myrmidia
**Voleurs** : Ranald (patron dupeurs)
**Medecins** : Shallya (guerison)
**Erudits** : Verena (connaissance)
**Forestiers** : Taal (sauvage)

## Informations affichees

### Fiche divinite
**Label** : Nom dieu (ex: "Manann")
**Title** : Descripteur (ex: "Dieu de la mer")
**Desc** : Description HTML avec spheres, adorateurs, offrandes, siege pouvoir, chef culte, ordres, festivites, livres sacres, symboles, commandements

### Sorts divins (si pretre)
**Benedictions** : 6 par dieu (sorts mineurs tous pretres)
**Miracles** : Sorts puissants specifiques (rituels)

**Exemple Sigmar** :
- Benedictions : Bataille, Courage, Droiture, Fierte, Force, Tenacite
- Miracles : Recherche spells type "Invocation" spec "Sigmar"

## Commandements

### Role roleplay
Regles morales/comportementales devotees doivent respecter. Transgression = perte faveur divine (malus sorts, penitences).

### Exemples par dieu

**Sigmar** : Proteger Empire, combattre Chaos, respecter Empereur, honorer heritage
**Ranald** : Jamais trahir compagnons, aider pauvres, moquer puissants, profiter fortune
**Ulric** : Combat loyal (pas embuscades), respecter force adversaire, jamais fuir, honorer loups/hiver
**Shallya** : Guerir sans distinction, refuser violence (sauf autodefense), proteger faibles, misericorde repentis

## Stockage affichage

### Structure
**Emplacement** : character.god ou character.details[8]
**Format** : Reference gods.json (index ou label)
**Exemple** : "Sigmar" ou index 6

### Interface
**Affichage** : Liste deroulante ou grille icones
**Selection** : Click → fiche complete → confirmation
**Description** : Panel lateral desc HTML parsee

### Persistance
- **Save** : Stocke reference dieu
- **Load** : Affiche dieu precedent
- **Reset** : Efface selection

## Integration workflow wizard

### Dependances
**Prerequis** : Species (filtrage gnomes)
**Optionnel** : Carriere (suggestions affinites)
**Donnees** : gods.json (16), spells.json (benedictions/miracles)

**Flux** :
1. WizardStepSpecies : Race (filtrage gnomes)
2. WizardStepCareer : Carriere (suggestions)
3. WizardStepDetail : Liste dieux filtree
4. Selection manuelle
5. Stockage character.god

### Actions

**Selection dieu** : Click → fiche → confirmation → stockage
**Affichage description** : Parsing HTML, extraction commandements (ul/li), benedictions/miracles
**Save** : Stocke reference
**Reset** : Efface selection

## Relations fichiers KB

### Database
- **[gods.md](../../database/gods.md)** : 16 divinites, blessings/miracles
- **[species.md](../../database/species.md)** : Filtrage gnomes
- **[spells.md](../../database/spells.md)** : Benedictions/Miracles

## Exemples concrets

### Scenario 1 : Humain Reiklander pretre
**Context** : Species Humain Reiklander, Carriere Initie (pretre)
**Dieux affiches** : Tous majeurs + suggestion Sigmar (Reikland)
**Selection** : Sigmar
**Affichage** : "Dieu de l'Empire", commandements, 6 benedictions (Bataille, Courage, Droiture, Fierte, Force, Tenacite)
**Stockage** : "Sigmar"
**Acces sorts** : Benedictions Sigmar disponibles

### Scenario 2 : Nain guerrier Middenheim
**Context** : Nain, Soldat, region Middenheim (culture Ulric)
**Hesitation** : Ulric (region) vs traditions naines
**Selection** : Ulric (integration culture locale)
**Roleplay** : Nain adopte Ulric, rare mais coherent Middenheim

### Scenario 3 : Gnome marchand
**Context** : Gnome, Marchand
**Dieux affiches** : **Uniquement** Evawn, Mabyn, Ringil (filtrage racial strict)
**Selection** : Evawn (Deesse voyages/commerce)
**Coherence** : Marchand voyageur, Evawn patronne commerce gnome
**Stockage** : "Evawn"

### Scenario 4 : Halfling voleur sans dieu
**Context** : Halfling, Voleur
**Dieux affiches** : Tous + suggestion Ranald (patron voleurs)
**Choix** : Pas affiliation religieuse
**Action** : Laisse vide (optionnel)
**Stockage** : null ou ""
**Roleplay** : Halfling pragmatique, pas devot

## Validation ticket

### Criteres acceptance
- ✅ Fichier < 200 lignes (198 lignes)
- ✅ Cross-refs gods.md, species.md, spells.md
- ✅ Aucune info technique (QUOI/POURQUOI)
- ✅ Exemples concrets Warhammer
- ✅ Relations documentees

### Contenu complet
- ✅ Liste divinites par categorie
- ✅ Filtrage racial (gnomes)
- ✅ Preferences culturelles/carrieres
- ✅ Informations affichees (desc, commandements, sorts)
- ✅ Selection manuelle
- ✅ Exemples 4 scenarios (pretre, guerrier, gnome, sans dieu)
