# Wizard - Details personnage

## Vue d'ensemble

L'etape Detail du wizard permet determiner caracteristiques physiques et identitaires du personnage selon sa race : age, yeux, cheveux, taille, nom, ambitions, dieu patron.

**Objectif metier** : Creer diversite realiste dans ranges biologiques/culturels raciaux, donner identite narrative unique.

**Champs Detail (details[])** : 0=Nom, 1=Age, 2=Yeux, 3=Cheveux, 4=Taille, 5=(reserve), 6=Ambition CT, 7=Ambition LT, 8=Dieu

## Modes selection

### Generation aleatoire
Disponible pour Age, Yeux, Cheveux, Taille. Lance formules raciales (d10, 2d10) et rempli champs automatiquement.

**Bouton Random (champ)** : Genere detail individuel
**Bouton Random All** : Genere simultanement tous details aleatoires (age, yeux, cheveux, taille)

### Saisie manuelle
Disponible pour tous champs. Usage pour personnalisation roleplay specifique (veteran, couleur rare, nom unique).

**Validation** : Contraintes souples (warnings, pas blocages) sauf Nom (requis).

### Mode hybride
Generation aleatoire puis modification manuelle. Equilibre rapidite/personnalisation.

## Details par type

### Age (details[1])

**Formule** : Age Base + (Age Roll × 1d10)

**Tables especes** :

| Espece | Formule | Range | Esperance | Interpretation |
|--------|---------|-------|-----------|----------------|
| Humain | 15 + 1d10 | 16-25 | ~60 ans | Jeunes adultes |
| Halfling | 15 + 5d10 | 20-65 | ~120 ans | Adolescents/adultes |
| Nain | 15 + 10d10 | 25-115 | 200+ ans | Jeunes guerriers |
| Haut Elfe | 30 + 10d10 | 40-130 | 1000+ ans | Adolescence elfique |
| Elfe Sylvain | 30 + 10d10 | 40-130 | 1000+ ans | Identique Hauts Elfes |
| Gnome | 20 + 10d10 | 30-120 | ~500 ans | Jeunes artisans |
| Ogre | 15 + 5d10 | 20-65 | ~120 ans | Jeunes mercenaires |

**Variabilite** : 1d10 (faible), 5d10 (moyenne), 10d10 (grande). Races longues vies ont plus latitude d'age debutants.

**Limites** : Min=Age Base, Max suggere=esperance vie - 10 ans. Warnings si < Age Base ou > 80% esperance.

**Impact roleplay** : Age jeune (inexperience, enthousiasme), Age moyen (sagesse equilibree), Age eleve (veteran, limitations).

**Source** : species.refDetail → details.json index 1-3 (Age, Age Base, Age Roll)

### Taille (details[4])

**Formule** : Height Base + (Height Roll × 1d10), arrondi 2 decimales (metres)

**Tables especes** :

| Espece | Height Base | Roll | Range (cm) | Moyenne |
|--------|-------------|------|------------|---------|
| Halfling | 90 | 5 | 100-190 | 1,00 m |
| Gnome | 100 | 2.5 | 105-150 | 1,15 m |
| Nain | 130 | 3 | 136-190 | 1,45 m |
| Humain | 145 | 5 | 155-245 | 1,75 m |
| Elfe | 180 | 2 | 184-220 | 1,90 m |
| Ogre | 235 | 6 | 247-355 | 2,75 m |

**Regle speciale Humains** : Si d10 = 10, lancer d10 supplementaire et ajouter (grande variabilite).

**Impact Blessures** : Taille influence Points Blessures via seuils raciaux :

| Espece | Seuil | Modificateur BE |
|--------|-------|-----------------|
| Halfling | < 1,35 m | -2 |
| Nain | < 1,30 m | -2 |
| Humain | < 1,52 m | -3 |
| Humain | 1,52-1,64 | -2 |
| Humain | 1,64-1,83 | -1 |
| Humain | >= 2,01 | +1 |
| Elfe | < 1,73 m | -1 |
| Ogre | >= 2,90 m | +1 |

**Calcul Blessures** : BE + BFM + BVol + Modificateur Taille

**Limites** : Min=Height Base - 10 cm, Max=Height Base + (Roll × 20) + 10 cm. Warnings si hors range typique.

**Source** : species data.height, data.rollHeight

### Nom (details[0])

**Type** : Texte libre (input text)
**Obligatoire** : Oui (validation 2-50 caracteres)
**Generation** : Aucune (identite unique, saisie manuelle)

**Conventions nommage** :

**Humains** : Prenom + Nom famille (profession/lieu/trait). Noblesse "von". Ex: Johann Schreiber, Maximilian von Greifen

**Halflings** : Prenom + Multiples + Clan (nourriture/geographie). Ex: Lumpin Bouillonnechaudiere Crookback, Hisme Porridgepot Brandysnap

**Nains** : Prenom + Familial (-sson/-sdottir) + Clan. Surnoms exploits (Tueur-de-Trolls). Ex: Gotrek Gurnisson, Belegar Marteau-de-fer

**Hauts Elfes** : Prenom + Epithete descriptive (traits/nature). Ex: Teclis le Mage, Tyrion Coeur-de-dragon

**Elfes Sylvains** : Similaire Hauts Elfes, themes foret/nature. Ex: Naieth la Prophete, Drycha Coeur-de-hetre

**Gnomes** : Prenom (tradition familiale) + Clan. Ex: Fibbin Tassletock, Jodri Copperhand

**Ogres** : Prenom traditionnel OU adopte Empire + Grands Noms (titres priment). Ex: Greasus Tete-d'or, Golgfag Mangeur-d'hommes

**Source** : details.json index 0, conventions culturelles

### Yeux (details[2])

**Systeme** : Table 2d10 (courbe Gauss, resultat 2-20)

**Distribution probabilites** :

| Resultat | Probabilite | Frequence |
|----------|-------------|-----------|
| 2 | 1% | Exceptionnelles |
| 8-11 | 33% | **Tres courantes** |
| 12-14 | 24% | **Courantes** |
| 20 | 1% | Exceptionnelles |

**Couleurs dominantes** : Index 4-5 (rand 11-14) = 57% chances cumulees

**Palettes raciales** :

**Humains** : Naturelles (Vert, Bleu pale/normal, Gris pale/normal, Marron, Noisette, Marron fonce, Noir, **Au choix si 2d10=2**)

**Hauts Elfes** : Pierres precieuses (Jais, Amethyste, Aigue-marine, Saphir, Turquoise, Emeraude, Ambre, Cuivre, Citrine, Or). **Bigarres (2× 2d10)**.

**Elfes Sylvains** : Forestiere (Ivoire, Anthraciste, Vert lierre/mousse, Chataigne, Marron fonce, Ocre, Chatain clair, Violet). **Bigarres (2× 2d10)**.

**Nains** : Minerale (Houille, Sable, Brun terre, Marron fonce, Gris, Bleu acier/nuit, Ambre, Noisette, Brun)

**Halflings** : Douce (Gris clair, Bleu pale/normal, Vert, Noisette, Marron clair/fonce, Noir)

**Gnomes** : Variee (Bleu pale/normal/profond, Vert pale/normal, Noisette, Gris/fonce, Marron, Noir). **Grisonnent 200 ans**.

**Ogres** : Inhabituelle (Gris, Bleu pale/nuit/marine, Marron/fonce, Ambre, Ocre, Mauve rare). **Pupilles adaptees montagne**.

**Regles speciales** :
- **Elfes** : Bigarres (2× 2d10), combine resultats ("Turquoise mouchete d'ambre")
- **Humains** : "Au choix" si 2d10=2 (1% chance)
- **Gnomes** : Deviennent gris a 200 ans
- **Toutes races (sauf Elfes)** : Grisonnent avec age

**Source** : eyes.json (10 entrees rand 2-20), species.refDetail pour lookup

### Cheveux (details[3])

**Systeme** : Table 2d10 (identique Yeux)

**Palettes raciales** :

**Humains** : Naturelle (Blanc, Blond pale/cendre/normal, Brun clair/fonce, Chatain, Roux, Brun roux, Noir). **Pilosite faciale assortie**.

**Hauts Elfes** : Metallique (Argent, Blanc, Blond pale/normal/intense/cuivre/ambre/roux, Auburn, Roux, Noir). **Jamais grisonnent**.

**Elfes Sylvains** : Forestiere (Blond tres pale/pale/normal/dore, Brun/acajou, Chatain/roux, Brun roux, Noir). **Immuables temps**.

**Nains** : Minerale (Blanc, Gris, Blond pale, Dore, Cuivre, Bronze, Brun/fonce/roux, Noir). **Barbes longues prisees**.

**Halflings** : Douce (Blond pale/normal, Sable, Chataigne, Gingembre, Brun clair/fonce, Roux, Chatain, Noir)

**Gnomes** : Variee (Blond pale/normal/dore, Auburn, Roux, Brun clair/fonce, Chatain, Noir). **Finit argent (pas blanc) avec age**.

**Ogres** : Sombre (Blond cendre, Brun clair, Chatain, Lie de vin, Marron fonce/normal, Brun/fonce, Noir). **Males chauves 30+ ans, barbe avec restes nourriture**.

**Regles vieillissement** :

**Races mortelles** (Humains/Nains/Halflings/Gnomes/Ogres) : Grisonnent progressivement, deviennent blancs vieillesse.

**Races immortelles** (Elfes) : Apparence eternellement jeune, jamais grisonnent meme 1000+ ans.

**Pilosite faciale** : Humains/Nains (barbe assortie), Ogres (barbe symbole statut), Gnomes (selon mode clanique).

**Note detectee** : hairs[7].Gnome = "Bond dore" (probable typo "Blond dore").

**Source** : hairs.json (10 entrees rand 2-20), species.refDetail pour lookup

### Dieu patron (details[8])

**Type** : Selection manuelle (pas generation aleatoire, choix profondement personnel)

**Divinites disponibles (16)** :

**Majeurs Empire (10)** : Manann (Mer), Morr (Mort), Myrmidia (Strategie), Ranald (Ruse), Rhya (Fertilite), Shallya (Misericorde), Sigmar (Empire), Taal (Nature), Ulric (Guerre), Verena (Sagesse)

**Mineurs (3)** : Handrich (Commerce), Solkan (Justice vengeresse), Stromfels (Pirates, heretique)

**Gnomes (3)** : Evawn (Voyages), Mabyn (Ombres), Ringil (Divertissement)

**Filtrage** :
- **Gnomes** : Limites Evawn/Mabyn/Ringil (exclusivite raciale)
- **Autres races** : Acces tous dieux Empire

**Preferences culturelles** : Reikland (Sigmar), Middenland (Ulric), Cotes (Manann), Rural (Taal/Rhya), Urbain (Verena/Ranald/Shallya)

**Affinites carrieres** : Pretres (sorts divins), Guerriers (Ulric/Sigmar/Myrmidia), Voleurs (Ranald), Medecins (Shallya), Erudits (Verena)

**Informations affichees** : Nom, Titre, Description HTML (spheres, adorateurs, offrandes, commandements), Benedictions (6 par dieu), Miracles

**Commandements** : Regles morales devotees. Transgression = perte faveur divine.

**Source** : gods.json (16 divinites), spells.json (benedictions/miracles), species (filtrage gnomes)

### Ambitions (details[6-7])

**Champs** :
- **Court terme (details[6])** : Jours/semaines (2-3 sessions), locale/personnelle/realisable
- **Long terme (details[7])** : Mois/annees (campagne), regionale/ambitieuse/structurante

**Type** : Texte libre (textarea), optionnel, max 200 caracteres

**Exemples CT** : Ruiner reputation rival, recuperer dette, prouver innocence

**Exemples LT** : Posseder relais poste, devenir champion Sigmar, eradiquer culte Chaos

**Source** : details.json index 9-10

## Stockage et affichage

### Structure
**Emplacement** : details[] (array indices 0-8)
**Format** :
- details[0] : String nom (requis)
- details[1] : Number age (annees)
- details[2] : String couleur yeux
- details[3] : String couleur cheveux
- details[4] : Number taille (metres, 2 decimales)
- details[6] : String ambition CT (optionnel)
- details[7] : String ambition LT (optionnel)
- details[8] : String reference dieu (optionnel)

### Interface wizard
**Champs** : detail_0 a detail_7 (input text ou textarea)
**Labels** : Depuis details.json selon index
**Descriptions** : Regles speciales selon species.refDetail

### Persistance
- **Save** : Collecte via $('.details').val(), stocke details[], recalcule Blessures si taille
- **Load** : Affichage depuis details[]
- **Reset** : Efface details[] et champs

## Validation

### Contraintes strictes
**Nom (details[0])** :
- Non vide (min 2 car, max 50 car)
- Alphanumeriques + espaces/tirets/apostrophes
- Messages : "Nom requis", "Trop court/long"

### Contraintes souples (warnings)
**Age** : Warning si < Age Base ou > esperance × 0.8
**Taille** : Warning si hors range typique
**Ambitions** : Max 200 caracteres, pas validation contenu

### Cas limites
- **Elfes** : Lancent 2× 2d10 yeux (bigarres)
- **Humains taille** : Si d10=10, relance supplementaire
- **Gnomes dieu** : Filtrage strict (uniquement 3 dieux gnomes)
- **Ogres cheveux** : Males chauves 30+ ans
- **Dieu** : Optionnel (peut rester vide)

## Integration workflow wizard

### Dependances
**Prerequis** : Species selectionnee (species.refDetail, data.height, data.rollHeight)

**Flux** :
1. WizardStepSpecies : Selection espece
2. WizardStepDetail : Chargement details.json, eyes.json, hairs.json, gods.json
3. Generation aleatoire ou saisie manuelle
4. Validation (Nom requis, autres warnings)
5. Stockage details[]
6. Recalcul Blessures si taille modifiee

### Actions disponibles

**Random (champ individuel)** : Lance formule/2d10, rempli champ specifique, trigger 'change'

**Random All** : Genere simultanement age, yeux, cheveux, taille (pas nom/ambitions/dieu)

**Save** : Collecte tous champs, valide Nom, stocke details[], sauvegarde character, recalcule Blessures

**Reset** : Efface tous details[] et champs interface

## Relations fichiers KB

### Database
- **[species.md](../../database/species.md)** : refDetail, data.height, data.rollHeight
- **[details.md](../../database/details.md)** : Tables details.json (labels/descriptions), eyes.json, hairs.json (10 entrees chaque)
- **[gods.md](../../database/gods.md)** : 16 divinites, benedictions/miracles
- **[characteristics.md](../../database/characteristics.md)** : Impact taille sur Blessures
- **[spells.md](../../database/spells.md)** : Benedictions/Miracles divins

### Business-rules
- **[calculs-details-physiques.md](../../business-rules/calculs-details-physiques.md)** : Formules completes age/taille, algorithmes 2d10

### Patterns
- **[pattern-generation-aleatoire.md](../../patterns/pattern-generation-aleatoire.md)** : Systeme rand (d10, 2d10)

## Exemples concrets

### Scenario 1 : Creation rapide Humain Reiklander
1. Random All : Age 23, Yeux Gris, Cheveux Brun fonce, Taille 1.85 m
2. Saisie Nom : "Johann Steinhauer"
3. Selection Dieu : Sigmar (suggestion Reikland)
4. Ambitions CT : "Gagner respect sergent"
5. Ambitions LT : "Devenir capitaine garde Altdorf"
6. Save → Stockage complet

### Scenario 2 : Haut Elfe ancien personnalise
1. Random Age : 98 ans (adolescent elfe)
2. Random Yeux : Premier 2d10=11 (Turquoise), Second 2d10=12 (Emeraude) → "Turquoise mouchete d'emeraude"
3. Random Cheveux : "Blond intense" (jamais grisonne)
4. Modification Taille : 1.90 m → 2.05 m (elfe grand)
5. Nom manuel : "Teclis le Mage"
6. Pas dieu (optionnel)
7. Verification taille >= 2.01 m → +1 BE (recalcul Blessures)

### Scenario 3 : Nain veteran avec age impact
1. Random Age : 58 ans
2. Joueur veut veteran : Modification manuelle 135 ans
3. Random Cheveux : "Bronze" → Joueur ajuste "Bronze grisonnant" (coherence age)
4. Random Yeux : "Marron fonce"
5. Random Taille : 1.45 m (pas impact Blessures >= 1.30 m)
6. Nom : "Morgrim Bargrimsson"
7. Dieu : Aucun

### Scenario 4 : Gnome restrictions raciales
1. Species Gnome selectionnee
2. Dieux affiches : **UNIQUEMENT** Evawn, Mabyn, Ringil (filtrage strict)
3. Autres details normaux
4. Selection Dieu : Evawn (voyages/commerce)
5. Note : Cheveux finissent argent 200+ ans

### Scenario 5 : Ogre particularites
1. Random Age : 35 ans
2. Cheveux : Males chauves 30+ ans → Saisie "Chauve (barbe chatain avec restes)"
3. Yeux : "Marron" (pupilles dilatees climat tempere)
4. Taille : 2.95 m → Verification >= 2.90 m → +1 BE
5. Nom : "Golgfag Mangeur-d'hommes"
