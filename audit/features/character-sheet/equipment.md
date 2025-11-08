# Character Sheet - Équipement

## Contexte

Affichage équipement dans onglet "Possession" : possessions générales (gauche), armures et armes (droite).

**Objectif** : Consultation rapide inventaire et stats équipement en jeu.

**Source** : character.trappings[] (strings, lookup table Trappings)

## Organisation Onglet "Possession"

### Panneau Gauche : Possessions

**Filtre** : Trappings ni armures ni armes/munitions

**Format** : Liste verticale simple

**Exemples** : Sac à dos, Couverture, Corde (10m), Rations (1 semaine), Lampe, Bourse 5 CO

**Clic** : Popup si desc !== '' (Helper.searchTrapping)

### Panneau Droit : Armures

**Filtre** : type.search('Armures') !== -1

**Format tableau** :

| Nom           | Loc   | Enc | PA | Qualités      |
|---------------|-------|-----|----|---------------|
| Calotte cuir  | Tête  | 0   | 1  | —             |
| Veste cuir    | Corps | 1   | 1  | Flexible      |
| Plates        | Toutes| 6   | 5  | Encombrante 3 |

**Colonnes** : Nom, Localisation (loc), Encombrement (enc), Points Armure (pa), Qualités (qualities)

**Clic** : Popup description complète

### Panneau Droit (suite) : Armes

**Filtre** : type.search('Armes') !== -1 OU type.search('Munitions') !== -1

**Format tableau** :

| Nom          | Groupe    | Enc | Portée/Allonge | Dégâts | Qualités  |
|--------------|-----------|-----|----------------|--------|-----------|
| Épée         | Base      | 1   | Moyenne        | BF+4   | Défensive |
| Hallebarde   | Deux mains| 2   | Longue         | BF+7   | Empaleuse |
| Arc court    | Arc       | 1   | 24/48          | BF+4   | —         |
| Flèches (12) | Munitions | 0   | —              | —      | —         |

**Colonnes** : Nom, Groupe (spec), Enc, Portée/Allonge (reach), Dégâts (damage), Qualités

**Clic** : Popup description complète

## Stockage Équipement

**Format** : trappings[] = Array de strings (labels)

**Exemple** :
```javascript
["Épée", "Calotte de cuir", "Sac à dos", "Arc court", "Flèches (12)"]
```

**Lookup** : Helper.searchTrapping(label) récupère objet depuis table

**Quantités** : Incluses dans label entre parenthèses - Ex: "Rations (1 semaine)", "Flèches (12)"

## Encombrement

**Calcul Total** : Somme de tous enc

**Exemple** : Sac (1) + Calotte (0) + Veste (1) + Épée (1) + Arc (1) = 4 enc

**Limite Portage** : Bonus Force × 10

**Seuils** :
- 0 à BF×10 : Normal
- BF×10+1 à BF×20 : Surchargé (malus Mvt)
- > BF×20 : Immobilisé

**Référence** : business-rules/calcul-encombrement.md

## Qualités Armes/Armures

**Atouts armes** : Assommante, Défensive, Empaleuse, Lente, Précise, Perforante

**Défauts armes** : Encombrante X, Fragile, Longue à recharger

**Atouts armures** : Flexible, Impénétrable, Partielle

**Défauts armures** : Encombrante X, Bruyante

**Référence** : database/qualities.md (32 qualités)

## Portée/Allonge

**Corps à corps** : Courte, Moyenne, Longue, Très longue

**Distance** : Format Courte/Longue (mètres) - Ex: "24/48", "30/60"

## Dégâts

**Format** : BF+X ou valeur fixe

**Exemples** : "BF+4", "BF+7", "3" (armes ingénierie)

## Interactivité

**Popup aide** : Clic si desc !== ''

**Contenu** : Label, type, description HTML, stats complètes (enc, PA/dégâts, qualités, prix, disponibilité)

**Sans description** : Non cliquable

## Exemples Concrets

### Agitateur

**Possessions** : Sac à dos, Couverture, Corde (10m), Rations (1 semaine), Bourse 5 CO

**Armures** : Calotte cuir (Tête 0enc 1PA), Veste cuir (Corps 1enc 1PA Flexible) | Total PA: Tête 1, Corps 1

**Armes** : Épée (Base 1enc Moyenne BF+4 Défensive), Dague (Bagarre 0enc Courte BF+2 Précise)

### Guerrier Lourd

**Armures** : Plates complètes (Toutes 6enc 5PA Encombrante 3)

**Armes** : Hallebarde (Deux mains 2enc Longue BF+7 Empaleuse Lente)

### Archer

**Armes** : Arc long (Arc 1enc 30/60 BF+5), Flèches (20) (Munitions 0enc), Dague (Bagarre 0enc Courte BF+2)

## Filtrage

**Possessions** : NOT (Armures OR Armes OR Munitions)

**Armures** : type contient "Armures"

**Armes** : type contient "Armes" OR "Munitions"

## Tri

**V1** : Pas de tri, affichage ordre trappings[] (ordre d'ajout)

## Localisations Armures

**Zones** : Tête, Bras, Corps, Jambes, Toutes

**Toutes** : Protège les 4 zones simultanément

## Groupes Armes

**11 groupes** : Base, Bagarre, Cavalerie, Deux mains, Parade, Arc, Arbalète, Fronde, Armes de jet, Poudre noire, Ingénierie

**Usage** : Détermine compétence liée (Corps à corps + groupe)

## Relations

### Dépendances Tables

- **database/trappings.md** : 500+ trappings (6 types)
- **database/qualities.md** : 32 qualités

### Dépendances Features

- **character-model/trappings.md** : Stockage
- **wizard/trappings-categories.md** : Organisation par type
- **business-rules/calcul-encombrement.md** : Formules portage
- **business-rules/categorisation-trappings.md** : Types et propriétés

## Voir Aussi

- **character-sheet/live-update.md** : Recalcul encombrement temps réel
- **business-rules/prix-disponibilite-trappings.md** : Système monétaire
