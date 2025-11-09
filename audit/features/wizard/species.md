# Wizard - Sélection Espèce

## Vue d'ensemble

Première étape wizard : choix espèce et variante régionale. Détermine caractéristiques base, compétences/talents raciaux, carrières, blessures, mouvement.

## Sélection et modes

### Modes sélection

**Choisir** : Active liste complète, `randomState.specie = -1`, pas bonus XP

**Lancer** : Tirage 1-100, sélection algorithmique, +20 XP si accepté, `randomState.specie = 1`, animation ~1.5s

**Mode Free** : `isFreeMode() = true`, boutons masqués, sélection directe sans bonus

### Navigation

Liste 2 niveaux : Niveau 1 = groupement `refDetail` + range probabilité. Niveau 2 = variantes.

Ex: Humain 1-90 > Reiklander, Middenheim | Nain 91-97 > Standard, Altdorfer

### États randomState.specie

| État | Signification | Liste |
|------|--------------|-------|
| 0 | Initial | Désactivée |
| 1 | Aléatoire accepté (+20 XP) | Variantes imposées |
| -1 | Choix manuel | Tous activés |
| -2 | Finalisé | - |

### Règles présélection

Tirage : 1 variante → sélection auto, plusieurs → joueur choisit. Restauration : présélection si `character.specie` existe. Mode Free : boutons masqués.

## Génération aléatoire

### Algorithme

Seuils cumulatifs `species.rand` (voir [pattern-generation-aleatoire.md](../../patterns/pattern-generation-aleatoire.md))

Distribution : Humain 90% (1-90), Nain 7% (91-97), Haut Elfe 2% (98-99), Elfe Sylvain 1% (100)

Variantes : Humains 13, Nains 5, Hauts Elfes 1, Elfes Sylvains 2, Halflings 12, Gnomes/Ogres 1

### Variantes multiples

Plusieurs species même `rand` → collecte IDs dans `imposedSpecie[]`. Si 1 : auto, si plusieurs : choix. Ex tirage 50 : 50 <= 90 → 13 variantes Humains

### Bonus XP

Condition : acceptation premier résultat sans relance/choix manuel. Workflow : "Lancer" → `randomState = 1` → tirage → save vérifie état → +20 XP "Race Aléatoire" → état -2. Exclusions : "Choisir", relance, Free.

### Animation

Tirage (Helper.dice ~1s) : range jaune, compteur 0→résultat. Résultat : species activée(s), fond orange→noir (500+300+500ms), retour normal 1.5s.

## Sélection région (Humains)

### Régions

**Middenheim** : Cité Ulric, martiale. Favorisées : Guerrier, Soldat, Prêtre Ulric. Rares : Prêtre Sigmar, maritimes

**Middenland** : Forestière. Favorisées : Garde-chasse, Chasseur, Bûcheron. Rares : Urbaines, maritimes

**Nordland** : Côtière. Favorisées : Batelier, Marin, Pêcheur. Rares : Forestières

**Reikland** : Défaut (pas clé)

### Impact carrières

Région modifie `career.rand[région]`. Numérique = accessible, "", null, absent = exclu, pas région = `career.rand.Humain`

Ex: Soldat (Humain 25, Middenheim 30), Contrebandier (Humain 85, Nordland 80, Middenheim exclu), Prêtre Ulric (Middenheim 20, Middenland 50)

Déclenchement après variante Humain. Optionnel (omis = seuils standard). Stockage `character.region`

## Application caractéristiques

### Source et formules

Source `characteristics.json` via `species.refChar`. Automatique après validation. Format "Base+Roll" (ex: "20+2d10" = 22-40) ou fixe.

**Principales par espèce** :

| Carac | Humain | Nain | Haut Elfe | Halfling | Ogre |
|-------|--------|------|-----------|----------|------|
| CC | 20+2d10 | 30+2d10 | 30+2d10 | 10+2d10 | 20+2d10 |
| CT | 20+2d10 | 20+2d10 | 30+2d10 | 30+2d10 | 10+2d10 |
| F | 20+2d10 | 20+2d10 | 20+2d10 | 10+2d10 | 35+2d10 |
| E | 20+2d10 | 30+2d10 | 20+2d10 | 20+2d10 | 35+2d10 |
| I | 20+2d10 | 20+2d10 | 40+2d10 | 20+2d10 | 0 |
| Ag | 20+2d10 | 10+2d10 | 30+2d10 | 20+2d10 | 20+2d10 |
| Dex | 20+2d10 | 20+2d10 | 30+2d10 | 30+2d10 | 10+2d10 |
| Int | 20+2d10 | 20+2d10 | 30+2d10 | 20+2d10 | 10+2d10 |
| FM | 20+2d10 | 40+2d10 | 30+2d10 | 20+2d10 | 10+2d10 |
| Soc | 20+2d10 | 10+2d10 | 30+2d10 | 20+2d10 | 10+2d10 |

Points forts : Nains E30/FM40, Elfes I40/mentales30, Halflings CT30/Dex30, Ogres F35/E35/I0

### Dérivées

**B** : Humain/Nain/Elfes = BF+2×BE+BFM | Halfling/Gnome = 2×BE+BFM | Ogre = (BF+2×BE+BFM)×2. BF=F÷10, BE=E÷10, BFM=FM÷10

**M** : Humain/Ogre 4 | Nain/Halfling/Gnome 3 | Elfes 5. Vitesses : Marche M×2 yd/s, Course M×4 yd/s

**Destin, Résilience, Extra** : Humain 2/1/3 | Nain 0/2/2 | Elfes 0/0/0 | Halfling 0/0/0 | Gnome 2/1/2 | Ogre 0/0/0. Pools actuels=Max. Extra distribués librement (étape ultérieure)

### Workflow

1. Validation → `setSpecie(species)` 2. Lecture `species.refChar` 3. Récup `characteristics[].rand[refChar]` 4. Tirage 2d10 par "roll" 5. Calcul B 6. Application M/Destin/Résilience/Extra 7. Save

### Modificateurs talents

Appliqués APRÈS carac base, lors attribution talents. Ex: Costaud +5 E. Voir [talents-modification-caracteristiques.md](../../business-rules/talents-modification-caracteristiques.md)

## Affichage détails

### Descriptifs

**Description** : `species.desc` (HTML), contexte culturel, apparence, règles

**Compétences** : `species.skills` (parsing), liste virgules, spéc parenthèses, "(Au choix)" souligné, 8-10. Ex Nains : "Calme, Corps à corps (Base), Métier (Au choix)...". Voir [pattern-parsing.md](../../patterns/pattern-parsing.md), [pattern-specialisations.md](../../patterns/pattern-specialisations.md)

**Talents** : `species.talents` (parsing), liste virgules, " ou ", "X Talent aléatoire", 4-6. Ex Nains : "Costaud, Déterminé ou Obstiné, Résistance magie...". Voir [pattern-talent-aleatoire.md](../../patterns/pattern-talent-aleatoire.md)

**Carrières** : Via `refCareer`, indicatif. Voir [filtrage-careers-espece.md](../../business-rules/filtrage-careers-espece.md)

### Modificateurs affichés

**Carac** : Tableau couleurs. 30+ vert (élevée), 20 neutre, ≤10 rouge (faible). Ex Nain : E30/FM40 verts, Ag10/Soc10 rouges

**B/M/Destin/Résilience** : Formules + valeurs

**Badges** : Vision nocturne (Nains/Elfes/Gnomes), Résistance magie (Nains), Résistance Chaos (Halflings), Costaud (Nains), Petit (Halflings/Gnomes)

### Détails physiques

**Taille/Âge** : `details.rand[species.refDetail]`, "Base+Roll" range. Ex Humain 160+2d10 cm (160-180), 16+2d10 ans (16-36). Voir [calculs-details-physiques.md](../../business-rules/calculs-details-physiques.md)

**Yeux/Cheveux** : Tables eyes/hairs (2d10)

### Organisation

Sections : Titre+Desc, Carac tableau, Modif B/M/Destin/Rés, Compétences, Talents+badges, Détails physiques. Colonnes : Gauche=Desc/Comp/Talents, Droite=Carac/Modif/Capacités

## Exemples Warhammer

**Humains** : 90% (1-90), 13 variantes. 20+2d10 partout (équilibré). B=BF+2BE+BFM, M4. Destin2/Rés1/Extra3. Toutes carrières

**Nains** : 7% (91-97), 5 variantes. E30/FM40, Ag10/Soc10. B standard, M3. Destin0/Rés2/Extra2. Vision nocturne 20y, Résistance magie, artisanat/combat

**Halflings** : 12 variantes. CT30/Dex30, autres 10-20. B=2BE+BFM (pas BF), M3. 0/0/0. Petit, Résistance Chaos (immunité mutations)

**Hauts Elfes** : 2% (98-99). I40, autres 30. B=BF+2BE+BFM, M5. 0/0/0. Vision nocturne, magie/diplomatie

**Elfes Sylvains** : 1% (100), 2 variantes. I40, autres 30. M5. Vision nocturne, foresterie/magie

**Gnomes** : Très rares. Dex30-40, FM30-40. B=2BE+BFM, M3. 2/1/2. Petit, illusionnisme

**Ogres** : Très rares. F35/E35, I0. B=(BF+2BE+BFM)×2, M4. 0/0/0. Limités mentalement, restreints

## Validation et sauvegarde

### Vérifications

**Espèce** : `character.specie` ≠ null, `randomState.specie = -2` après save, +20 XP si aléatoire

**Région** : Si variante régionale, sélectionnée ou omise, cohérence `species.refCareer` ↔ région, `character.region` persisté

**Carac** : `species.refChar` valide, 10 principales + B + M + Destin + Résilience, valeurs 22-60, formules B correctes

### Données persistées

`character.specie`, `character.randomState.specie`, `character.randomState.imposedSpecie`, `character.region`

### Bouton Validate

Initial désactivé. Activation dès sélection (clic niveau 2). Action : save puis étape suivante

## Relations tables

| Table | Champ | Usage |
|-------|-------|-------|
| Species | label, refDetail, rand, desc | Affichage, navigation |
| Species | skills, talents | Parsing |
| Species | refCareer | Filtrage carrières, région |
| Species | refChar | Carac base |
| Characteristics | rand[espèce], type | Valeurs, formules |
| Details | rand[espèce] | Taille, âge |
| Careers | rand[région] | Filtrage |
| Skills, Talents | label, spec | Résolution |

## Voir aussi

**Database** : [species.md](../../database/species.md), [characteristics.md](../../database/characteristics.md), [careers.md](../../database/careers.md)

**Business Rules** : [filtrage-careers-espece.md](../../business-rules/filtrage-careers-espece.md), [filtrage-careers-region.md](../../business-rules/filtrage-careers-region.md), [talents-modification-caracteristiques.md](../../business-rules/talents-modification-caracteristiques.md), [calculs-details-physiques.md](../../business-rules/calculs-details-physiques.md)

**Patterns** : [pattern-generation-aleatoire.md](../../patterns/pattern-generation-aleatoire.md), [pattern-parsing.md](../../patterns/pattern-parsing.md), [pattern-specialisations.md](../../patterns/pattern-specialisations.md), [pattern-talent-aleatoire.md](../../patterns/pattern-talent-aleatoire.md)
