# Wizard - Caractéristiques

## Vue d'ensemble

L'étape Caractéristiques du wizard détermine les 10 caractéristiques de base du personnage (CC, CT, F, E, I, Ag, Dex, Int, FM, Soc), héritées de l'espèce et modifiées par jets aléatoires ou saisie manuelle, puis augmentées par bonus de carrière. Le joueur peut générer aléatoirement (avec bonus XP) ou choisir manuellement (contrôle total). Après détermination, le système calcule automatiquement les attributs dérivés (Mouvement, Points de Blessure, Destin, Résolution).

**Relations** : Voir [characteristics.md](../../database/characteristics.md), [species.md](../../database/species.md), [career-levels.md](../../database/careerLevels.md)

## Valeurs de base par espèce

### 10 Caractéristiques de base

**Combat** : CC (Capacité de Combat), CT (Capacité de Tir)

**Physiques** : F (Force), E (Endurance), I (Initiative), Ag (Agilité), Dex (Dextérité)

**Mentales** : Int (Intelligence), FM (Force Mentale), Soc (Sociabilité)

### Format stocké

**Table source** : characteristics.json, champ `rand` avec valeurs par espèce

**Structure** : `{ "Humain": 20, "Nain": 30, "Haut Elfe": 30, ... }`

**Application** : Lors de la sélection d'une espèce, le système récupère `species.refChar` puis charge les valeurs depuis `characteristics.rand[refChar]`

### Valeurs par espèce

**Humain** : Toutes à 20. Équilibré, aucune faiblesse.

**Nain** : E (30), CC (30), FM (40), faibles Ag (10), Soc (10). Guerrier robuste et volontaire.

**Haut Elfe** : I (40), Int (30), FM (30), Soc (30), CC/CT (30). Noble intelligent et agile.

**Elfe Sylvain** : I (40), Ag (30), CT (30). Archer et forestier.

**Halfling** : CT (30), Dex (30), faible F (10). Artisan habile mais fragile.

**Gnome** : FM (30-40), Dex (30-40). Magicien artisan.

**Ogre** : F (35), E (35), faibles I (0), Int (10), Ag (10), Dex (10). Brute physique.

## Jet aléatoire 2d10

### Formule et distribution

**Formule** : Lancer 2 dés à 10 faces et additionner (plage 2-20)

**Distribution** : Courbe en cloche, résultats centraux plus probables (10-12 à ~9% chacun), extrêmes rares (2 ou 20 à 1%)

**Application** : Valeur totale = Base Espèce + Résultat 2d10

**Exemple Humain** : CC : 20 (base) + 12 (2d10) = 32, E : 20 + 11 = 31, FM : 20 + 15 = 35

**Exemple Nain** : CC : 30 + 9 = 39, E : 30 + 12 = 42, FM : 40 + 11 = 51

### Relance et bonus XP

**Règle** : Joueur peut relancer autant de fois qu'il souhaite

**Conséquence XP** :
- Première génération acceptée : +50 XP
- Réassignation sans relance : +25 XP
- Relance : 0 XP

**États** :
- État 0 : Pas encore généré
- État 1 : Première génération (+50 XP si acceptée)
- État 2 : Réassignation (+25 XP si validée)
- État 3 : Relance effectuée (bonus perdu)
- État -1 : Mode manuel activé
- État -2 : Sélection finalisée

### Affichage

**Colonnes** : Nom | Base | Jet | Total

**Animation** : Dés virtuels roulent, résultats apparaissent séquentiellement, ligne surlignée, total mis à jour dynamiquement

## Saisie manuelle

### Activation mode manuel

**Bouton "Choisir"** : Active mode manuel (irréversible)
- Initialise toutes caractéristiques à 4
- Donne 100 points à répartir
- Aucun bonus XP
- État système : `randomState.characteristic = -1`

**Raison irréversibilité** : Éviter abus (générer, garder si bon, sinon passer manuel)

### Saisie valeur par valeur

**Contrôles** : Boutons +/- modifient caractéristique de 1, points décomptés en temps réel

**Budget** : Total disponible 100 points exactement. Validation impossible si points restants ≠ 0

**Limites** :
- Minimum : 4 points par caractéristique (équivaut Base + 2)
- Maximum : 18 points par caractéristique (équivaut Base + 18)

**Exemple** : CC 4 → +10 → 14 (reste 90), CT 4 → +8 → 12 (reste 82), F 4 → +12 → 16 (reste 70)

### Comparaison modes

**Mode aléatoire** : Bonus XP (+50/+25), rapide, fidèle esprit JdR, pas de contrôle total

**Mode manuel** : Contrôle total, optimisation possible, aucun bonus XP, plus long, tentation min/max

## Bonus de carrière

### Avances de caractéristiques par carrière

**Source** : Champ `careerLevels.characteristics` (string avec noms séparés par virgules)

**Exemples** :
- Agitateur N1 : "Capacité de Tir, Intelligence, Sociabilité"
- Artisan N1 : "Dextérité, Force, Sociabilité"
- Bourgeois N1 : "Agilité, Dextérité, Sociabilité"

**Règle implicite** : +5 points par caractéristique listée (non écrit dans données)

**Nombre niveau 1** : Toujours 3 caractéristiques = 15 points potentiels

### Répartition des 5 points

**Règle wizard** : Joueur répartit 5 augmentations (non 15) parmi les 3 caractéristiques de carrière

**Contraintes** : Maximum 5 par caractéristique, minimum 0 autorisé

**Exemples valides** : 5+0+0 (spécialisation), 3+1+1 (équilibré), 2+2+1 (mixte)

**Affichage** : Colonne "Aug" affiche 0-5, caractéristiques de carrière surlignées, compteur "X Points à allouer" en temps réel

### Exemples par carrière

**Agitateur** : CT, Int, Soc. Répartition exemple : Soc +3, Int +2 → Humain Soc 20+11+3=34, Int 20+10+2=32

**Artisan** : Dex, F, Soc. Répartition exemple : Dex +3, F +2 → Nain Dex 20+10+3=33, F 20+13+2=35

**Bourgeois** : Ag, Dex, Soc. Répartition exemple : Soc +4, Dex +1 → Haut Elfe Soc 30+12+4=46, Dex 20+8+1=29

**Limitation wizard** : Applique UNIQUEMENT niveau 1. Niveaux 2-4 non concernés (progression ultérieure via XP)

## Calcul des totaux

### Formule complète

**Total = Base Espèce + Variable (2d10) + Avances Carrière + XP**

**Lors création** : Total = Base + Variable + Avances (XP = 0)

**Bonus = Total ÷ 10** (division entière, arrondi inférieur)

**Exemples** : Total 32 → Bonus 3, Total 48 → Bonus 4, Total 16 → Bonus 1

### Utilisation du Bonus

**Tests compétences** : Valeur Compétence = Caractéristique Total + Avances

**Bonus Force (BF)** : Dégâts corps à corps = Arme + BF

**Bonus Endurance (BE)** : Calcul Points de Blessure

**Bonus Force Mentale (BFM)** : Résistance magie, peur, corruption

### Affichage

**Tableau** : Carac | Base | Jet | Aug | Total

**Mise à jour temps réel** : Modification jet 2d10, augmentations carrière ou relance → Total et Bonus recalculés instantanément

### Exemples détaillés

**Humain Agitateur (mode aléatoire)** : CC 20+12+0=32 (B3), CT 20+8+3=31 (B3), Int 20+10+2=32 (B3), Soc 20+11+0=31 (B3) → Points Blessure 3+(2×3)+3=12

**Nain guerrier (mode manuel optimisé)** : CC 30+18+5=53 (B5), E 30+18+0=48 (B4), FM 40+16+0=56 (B5), F 20+16+0=36 (B3) → Points Blessure 3+(2×4)+5=16

**Haut Elfe mage** : I 40+10+0=50 (B5), Int 30+10+3=43 (B4), FM 30+10+2=42 (B4), Soc 30+10+0=40 (B4)

## Validation

### Limites par mode

**Mode manuel** : Min 4, Max 18 par caractéristique (boutons +/- désactivés aux seuils)

**Mode aléatoire** : Min 2, Max 20 naturels (limites 2d10, aucune limite artificielle)

### Détection valeurs aberrantes

**Calcul implicite jet** : Jet = Total - Base

**Validation** :
- Si Jet < 2 → Erreur "Valeur trop faible"
- Si Jet > 20 (aléatoire) → Erreur "Valeur impossible"
- Si Jet < 4 ou > 18 (manuel) → Erreur "Hors limites"

**Exemple détection** : Humain CC Total = 50, Base = 20 → Jet implicite = 30 → 30 > 20 → Alerte

### Messages d'erreur

**Budget non dépensé** : "Il vous reste X Points à allouer" (validation bloquée)

**Valeur hors limites** : "[Caractéristique] doit être entre [Min] et [Max]"

**Valeur aberrante** : "[Caractéristique] a une valeur invalide ([Valeur])"

**Budget augmentations** : "Vous devez allouer exactement 5 augmentations"

### Blocage progression

**Bouton Valider désactivé** si :
- Mode manuel ET budget ≠ 100
- Augmentations carrière ≠ 5
- Mode aléatoire ET randomState = 0 (pas généré)
- Valeur hors limites détectée

**Indicateur visuel** : Compteur temps réel (rouge si ≠ 0, vert si = 0), bouton grisé ou actif (vert)

## Attributs dérivés

### Mouvement (M)

**Source** : Champ `characteristics.rand[espèce]` pour "Mouvement" (index 16, type "mv")

**Valeurs fixes** : Humain 4, Halfling/Nain/Gnome 3, Haut Elfe/Elfe Sylvain 5, Ogre 6

**Signification** : M3 = 6 km/h marche (12 course), M4 = 8/16, M5 = 10/20, M6 = 12/24

**Limitation wizard** : Affiche seulement valeur base espèce, sans modificateurs talents/traits

### Points de Blessure (B)

**Formules selon espèce** :
- Standard (Humain, Nain, Elfes) : BF + (2 × BE) + BFM
- Halfling/Gnome : (2 × BE) + BFM (pas de BF)
- Ogre : (BF + (2 × BE) + BFM) × 2 (double résistance)

**Exemples** : Humain BF3 BE3 BFM3 → 3+(2×3)+3=12, Nain BF3 BE4 BFM5 → 3+(2×4)+5=16, Halfling BE3 BFM3 → (2×3)+3=9, Ogre BF5 BE4 BFM2 → (5+(2×4)+2)×2=30

**Importance** : Endurance compte double (×2) dans toutes formules, Force Mentale contribue aussi (lien corps-esprit)

### Destin et Résolution

**Destin base** : Source `characteristics.rand[espèce]` index 11. Valeurs : Humain/Gnome 2, autres 0

**Résolution base** : Source index 13. Toutes espèces 0

**Extra Points** : Source index 15. Valeurs : Humain 3, Halfling 3, Nain 2, Gnome 1, autres 0. Joueur distribue entre Destin et Résolution

**Exemples** : Humain Destin 2 + Extra 3 → +2 Destin +1 Résolution → Final D4 R1, Nain Destin 0 + Extra 2 → +0 D +2 R → Final D0 R2

**Interface** : Boutons +/- pour allouer, validation bloquée si Extra Points ≠ 0

### Points de Fortune (Chance)

**Valeur initiale** : 0 pour toutes espèces (caractéristique index 12)

**Acquisition** : Uniquement par talents "Chanceux" (+1 par rang, cumul illimité)

**Utilisation** : Relancer jet (comme Destin) mais ressource renouvelable quotidiennement

### Affichage wizard

**Étape Extra Points** : Écran séparé après caractéristiques roll et carrière. Colonnes : Attribut | Base | Allocation | Total

**Mouvement/Blessures** : Affichage automatique lecture seule, calculés sans interaction joueur, mise à jour temps réel si F/E/FM modifiées

## Exemples complets par espèce

**Humain Agitateur** : Bases 20, Jets aléatoires moyens, Carrière CT+3 Int+2 Soc+0, Total CT 31 Int 32 Soc 31, M4 B12 D4 R1 (Extra 3 répartis)

**Nain Artisan** : Bases E30 CC30 FM40, Manuel optimisé Dex 33 F 35, M3 B16 D0 R2 (Extra 2 en Résolution)

**Haut Elfe Mage** : Bases I40 Int30 FM30 Soc30, Jets moyens +10, Carrière Int+3 FM+2, Totaux I50 Int43 FM42 Soc40, M5 B13 D0 R0

**Halfling** : Bases CT30 Dex30 F10, Faible physique, Formule Blessures sans BF, M3 B9 D0 R3 (Extra 3 répartis)

**Ogre** : Bases F35 E35 I0 Int10, Jets F+15 E+14 I+5, Carrière F+5, Totaux F55 E49 I5 Int16, M6 B30 (×2) D0 R0

## Voir aussi

- [characteristics.md](../../database/characteristics.md) - Structure complète table
- [species.md](../../database/species.md) - Valeurs espèces
- [career-levels.md](../../database/careerLevels.md) - Structure niveaux
- [parsing-avances-caracteristiques.md](../../business-rules/parsing-avances-caracteristiques.md) - Parsing avances
- [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md) - Cumul multi-niveaux
