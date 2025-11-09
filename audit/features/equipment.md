# Equipment - Équipement personnage

## Vue d'ensemble

Système complet gestion équipement personnage Warhammer: armes, armures, objets divers, encombrement, monnaie. Chaque objet possède propriétés définissant utilisation, poids, valeur.

**Références:** [database/trappings.md](../database/trappings.md), [database/qualities.md](../database/qualities.md)

## Types équipement

### Armes mêlée (melee)

Armes corps-à-corps.

**Propriétés:**
- type: "melee"
- subType: Groupe armes (Basic, Cavalry, Fencing, Brawling, Flail, Parry, Polearm, Two-Handed)
- damage: Dégâts infligés (format BF+X ou valeur fixe)
- reach: Allonge (Personnelle/Très courte/Courte/Moyenne/Longue/Très longue/Considérable/Variable)
- qualities: Qualités spéciales (optionnel)

**Exemples:**
- Dague: melee/Basic, BF+2, Très courte, 0 enc, 1 CO
- Épée: melee/Basic, BF+4, Moyenne, 1 enc, 10 CO
- Hallebarde: melee/Polearm, BF+5, Longue, 2 enc, 7 CO, [Defensive]

**Groupes mêlée:** Basic (épée, hache, masse), Cavalry (lance cavalerie), Fencing (rapière), Brawling (mains nues), Flail (fléau), Parry (dague parade), Polearm (hallebarde, vouge), Two-Handed (épée deux mains)

### Armes distance (ranged)

Armes attaque distance (arcs, arbalètes, armes jet, poudre).

**Propriétés:**
- type: "ranged"
- subType: Groupe armes (Bow, Crossbow, Entangling, Engineering, Explosives, Sling, Throwing, Blackpowder)
- damage: Dégâts
- reach: Portée mètres (valeur numérique)
- qualities: Qualités (optionnel)

**Modificateurs portée:** Bout portant +40%, Courte +20%, Longue +0%, Extrême -20%

**Exemples:**
- Arc: ranged/Bow, BF+3, portée 24, 1 enc, 10 PA
- Pistolet: ranged/Blackpowder, 4, portée 10, 1 enc, 30 CO, [Impact, Blackpowder]

**Groupes distance:** Bow (arcs), Crossbow (arbalètes), Entangling (filet, lasso), Engineering (catapulte, baliste), Explosives (bombes, grenades), Sling (frondes), Throwing (hachette, javelot), Blackpowder (pistolet, fusil)

### Munitions (ammunition)

Projectiles armes distance (flèches, carreaux, balles).

**Propriétés:**
- type: "ammunition"
- damage: Modificateur dégâts (optionnel)
- Compatible certains types armes

**Exemples:**
- Flèches: ammunition, 0.1 enc, 1 S pièce
- Balles plomb: ammunition, 0.1 enc, 2 S pièce

### Armures (armor)

Protection contre dégâts par zones corporelles.

**Propriétés:**
- type: "armor"
- loc: Emplacements protégés (Tête/Torse/Bras/Jambes ou combinaisons)
- pa: Points Armure fournis
- qualities: Qualités (optionnel)

**Fonctionnement:** PA réduit blessures attaque. Attaquant touche, calcule dégâts, PA zone touchée soustrait, reste inflige blessures.

**Zones corporelles:**
- Tête (casques, heaumes)
- Torse (plastrons, brigandines, gilets, robes)
- Bras (brassards, manches renforcées)
- Jambes (jambières, grèves, bottes)

**Valeurs PA:** 0 (aucune protection), 1 (cuir léger), 2 (cuir clouté, maille), 3 (demi-plate), 4-5 (plate complète)

**Cumul PA:** Plusieurs pièces même zone cumulent. Exemple: Casque 2 PA + Gilet cuir 1 PA = Tête 2 PA, Torse 1 PA

**Exemples:**
- Casque cuir: armor, loc: Tête, pa: 1, enc: 0, price: 5 PA
- Armure maille: armor, loc: Torse/Bras/Jambes, pa: 3, enc: 3, price: 60 CO
- Armure plates: armor, loc: Toutes zones, pa: 5, enc: 6, price: 400 CO, availability: Rare

### Objets divers (trapping)

Équipement varié (vêtements, outils, provisions, conteneurs).

**Propriétés:**
- type: "trapping"
- carry: Capacité stockage si conteneur (optionnel)

**Exemples:**
- Corde 10m: trapping, enc: 1, price: 5 PA
- Sac dos: trapping, enc: 1, carry: 20, price: 1 CO
- Couverture: trapping, enc: 1, price: 5 PA

## Qualités équipement

### Qualités armes

Propriétés spéciales modifiant comportement armes combat.

**Structure:**
- type: "Atout" ou "Défaut"
- subType: "arme"
- desc: Description effets

**Atouts:** Accurate (+10% attaque), Defensive (+1 Avantage défense), Damaging (+1 dégâts finaux), Fast (+1 Avantage), Hack (ignore 1 PA), Impact (ignore PA certaines situations), Impale (critiques supplémentaires), Penetrating (ignore PA), Pummel (assommer), Entangle (entraver), Wrap (contourne parades)

**Défauts:** Slow (-1 Avantage), Tiring (fatigue), Unreliable (malfonctionnement), Blackpowder (rechargement requis)

**Spécialisations:** Blast (X) (zone X mètres), Dangerous (malfonctionnement), Range (X) (modificateur portée)

**Application:** Combat: qualités appliquées automatiquement. Attaque: Accurate/Fast/Slow modifient test/Avantage, Defensive appliquée parade. Dégâts: Damaging/Hack/Penetrating/Impact affectent calcul, Impale critiques. Effets spéciaux: Entangle immobilise, Pummel assomme, Wrap contourne parades, Blackpowder rechargement.

### Qualités armures

Propriétés modifiant protection ou usage armures.

**Structure:**
- type: "Atout" ou "Défaut"
- subType: "armure"
- desc: Description effets

**Atouts:** Flexible (pas pénalité Agilité), Impenetrable (critique devient normal), Fine (enc moitié arrondi sup), Durable (résiste dégâts), Lightweight (enc réduit)

**Défauts:** Partial (protège partiellement zone), Weakpoints (critique ignore PA), Heavy (enc augmenté, pénalités), Uncomfortable (pénalités prolongées)

**Application:** Modification PA (Impenetrable/Weakpoints/Partial), Modification encombrement (Fine/Lightweight/Heavy), Effets usage (Flexible supprime pénalités, Uncomfortable ajoute pénalités)

## Encombrement

### Calcul total

Somme valeurs enc tous objets portés.

**Formule:** Encombrement Total = Σ (enc × quantité) pour chaque objet porté

**Par objet:**
- Objet unique: 1 épée (enc 1) = 1 encombrement
- Multiples: 10 flèches (enc 0.1 chacune) = 1 total
- Sans encombrement: enc = 0 (pièces monnaie, petits objets)

**Porté vs Stocké:**
- Porté (worn): Compte encombrement (armures portées, armes ceinture, sac dos)
- Stocké (stored): Dépend localisation. Dans sac porté: compte. Sur monture/chariot/camp: compte pas.

**Affichage:** Format X / Y où X=actuel, Y=limite. Codes couleur: Vert (<80%), Orange (80-100%), Rouge (>100%)

**Exemples:**
- Personnage léger: Dague (0) + Arc (1) + 20 flèches (2) + Gilet cuir (1) + Sac (1) + Couverture (1) + Rations (1) = 7 enc
- Personnage lourd: Épée (1) + Hallebarde (2) + Bouclier (1) + Armure maille (3) + Casque (0) + Sac (1) + Corde (1) + Divers (3) = 12 enc

### Limite encombrement

Poids maximum sans pénalités.

**Formule:** Limite = Force + Endurance

**Calcul:** Valeurs totales caractéristiques (base + avancées). Exemple: Force 30 + Endurance 35 = Limite 65

**Modification dynamique:** Limite change si Force/Endurance change (avancée XP, talent modificateur, effet temporaire, blessure, maladie). Dépassement survient si caractéristiques baissent, équipement augmente, effet temporaire termine.

**États:**
- Normal: Encombrement ≤ Limite, aucune pénalité, déplacement normal
- Surchargé: Encombrement > Limite, pénalités appliquées

**Indicateurs:** Codes couleur (Vert <80%, Orange 80-100%, Rouge >100%), Icônes (✓ limite, ⚠ proche, ✗ surcharge)

**Exemples:**
- Faible: Force 25, End 30 = Limite 55 (armure légère OK)
- Moyen: Force 35, End 35 = Limite 70 (maille + armes + équipement)
- Fort: Force 45, End 40 = Limite 85 (plates + armes + lourd)

### Pénalités surcharge

Dépassement limite inflige pénalités mouvement et tests.

**Condition:** Encombrement > Limite

**Paliers:**
- Légère (+1 à +10): Mouvement -1, Tests physiques -5%
- Moyenne (+11 à +20): Mouvement -2, Tests physiques -10%, Tests Agilité -10% supplémentaire
- Lourde (+21+): Mouvement -3, Tests physiques -20%, Tests Agilité -20% supplémentaire, Impossible courir

**Modificateurs affectés:**
- Mouvement: Valeur réduite (base 4 humain devient 4 - pénalité)
- Tests compétences physiques: Athlétisme, Escalade, Natation, Esquive (malus %)
- Tests Agilité: Malus supplémentaire (poids entrave mouvements rapides/précis)

**Application automatique:** Recalcul quand encombrement change, limite change, objet porté/stocké. Retrait automatique si redescend sous limite.

**Exemple guerrier surchargé:**
Force 35, End 30 = Limite 65. Équipement: Plates (6) + Bouclier (1) + Épée 2 mains (2) + Épée (1) + Arc (1) + 20 flèches (2) + Sac (55) = 68 enc. Dépassement +3 (légère): Mouvement 4→3, Tests physiques -5%

**Gestion:** Choix tactiques protection vs mobilité, polyvalence vs encombrement, survie vs combat. Solutions: laisser matériel camp, monture/chariot, conteneurs, améliorer Force/Endurance XP.

## Organisation inventaire

### Catégorisation

Équipement organisé catégories (type) et sous-catégories (subType).

**Hiérarchie:**
- Type (catégorie principale): melee/ranged/ammunition/armor/vehicle/trapping
- SubType (sous-catégorie): Groupes armes, types objets (optionnel)

**Types détaillés:**
- melee: SubTypes Basic/Cavalry/Fencing/Brawling/Flail/Parry/Polearm/Two-Handed
- ranged: SubTypes Bow/Crossbow/Entangling/Engineering/Explosives/Sling/Throwing/Blackpowder
- ammunition: SubType généralement vide
- armor: SubType généralement vide
- vehicle: SubType peut indiquer type véhicule
- trapping: SubType pour sous-catégories (Vêtements, Outils, Provisions)

**Affichage regroupé:**
- Section Armes: Mêlée/Distance/Munitions
- Section Armures: Toutes pièces
- Section Équipement: Objets divers/Véhicules
Sous-groupement par subType si nécessaire.

### État porté/stocké

Équipement porté (worn/equipped) ou stocké (stored).

**Porté:** Directement personnage, prêt emploi. Compte encombrement, immédiatement utilisable, fournit protection (armures), accessible un tour (armes).

**Stocké:** Rangé, non accessible. Peut/peut pas compter encombrement selon localisation (dans sac porté: compte, sur monture/chariot/camp: compte pas). Nécessite action accès, pas protection (armures), pas utilisable immédiatement (armes).

**Impact combat:**
- Armes portées: En main (utilisable ce tour), ceinture (dégainable action gratuite/rapide), dos (dégainable action rapide)
- Armes stockées: Sac fermé (1 tour sortir), monture (1+ tours), camp (inaccessible combat)
- Armures portées: PA appliqués, défense immédiate
- Armures stockées: Aucun PA, nécessite temps équiper (plusieurs minutes)

**Changement état:**
- Porter stocké: Ouvrir sac/conteneur, sortir objet, porter/équiper. Temps: objet simple 1 action/tour, armure complète 10+ minutes
- Stocker porté: Retirer objet, ranger conteneur, fermer. Temps: objet simple 1 action, armure 5+ minutes

**Exemples:**
- Guerrier marche: Porté (maille 3, épée 1, bouclier 1, sac 1), Stocké sac (rations 2, corde 1, couverture 1). Total: 10 enc (6 porté + 4 sac porté)
- Scout: Porté (gilet cuir 1, arc 1, carquois 1, dague 0) = 3 enc mobile. Stocké camp (maille, épée, bivouac). Encombrement 3, peut courir/grimper.

## Économie

### Monnaie

Système trois types pièces taux conversion fixes.

**Types:**
- Couronne Or (CO): Plus haute valeur, achats importants (armures, armes qualité, chevaux), couleur or
- Pistole Argent (PA): Monnaie courante, achats quotidiens (nourriture, logement, équipement basique), couleur argent
- Sou (S): Petite monnaie, petits achats (pain, bière, petits objets), couleur cuivre/laiton

**Conversions:**
```
1 CO = 20 PA
1 PA = 12 S
1 CO = 240 S
```

**Exemples conversion:**
- 5 CO = 100 PA
- 3 CO + 10 PA = 70 PA
- 1 PA = 12 S
- 40 PA = 2 CO

**Gestion inventaire:** Stockée propriété personnage (gold/silver/bronze) ou objets "monnaie" trappings. Affichage: "Bourse: 15 CO, 8 PA, 23 S" ou consolidé "Richesse: 15 CO 8 PA 23 S (= 308 PA total)"

**Encombrement:** Pièces individuelles enc=0 (négligeable). Grandes quantités poids significatif. Seuils suggérés: <100 pièces enc 0, 100-500 enc 1, 500-1000 enc 2.

**Exemples prix:**
- Nourriture: Repas simple 6 S, Bon repas 1 PA, Bière 3 S, Vin 5 PA
- Logement: Lit commun 5 S, Chambre privée 1 PA, Belle auberge 5 PA
- Équipement: Corde 10m 5 PA, Lanterne 9 PA, Couverture 5 PA, Sac 1 CO
- Armes: Dague 1 CO, Épée 10 CO, Arc 10 PA, Flèche 1 S
- Armures: Gilet cuir 10 PA, Armure cuir complète 50 PA, Maille 60 CO, Plates 400 CO
- Animaux: Mule 20 CO, Cheval trait 50 CO, Cheval guerre 300 CO

### Prix disponibilité

Chaque objet prix et disponibilité reflétant rareté/valeur.

**Structure:**
- gold/silver/bronze: Nombres pièces
- price: Prix consolidé (converti valeur unique)
- availability: Niveau disponibilité

**Niveaux disponibilité:**
- Commune: Disponible partout, facilement trouvable (dague 1 CO, gilet cuir 10 PA, corde 5 PA, rations 3 S jour)
- Limitée: Villes, rare villages (épée qualité 15 CO, maille légère 30 CO, arbalète 25 CO)
- Rare: Difficile trouver, grandes villes (plates 400 CO, pistolet 30 CO, arme elfique)
- Exotique: Très rare, importé, prix élevé (armes naines runiques, armures elfiques, objets magiques mineurs)
- Unique: Objet unique, pas vente normale (artefacts, armes légendaires, objets questés)

**Variations régionales:**
- Villes impériales: Meilleur accès Communs/Limités, prix standards
- Zones rurales: Moins choix, Rares quasi introuvables, prix parfois élevés
- Régions spécialisées: Nuln (armes poudre accessibles), Averland (chevaux accessibles), Ports (exotiques accessibles)

## Inventaire

### Structure données

Chaque possession (trapping) contient:

**Identifiants:** id (unique), label (nom), index (position liste)

**Classification:** type (catégorie principale), subType (sous-catégorie)

**Propriétés économiques:** price (consolidé), gold/silver/bronze (monnaies), availability (disponibilité)

**Propriétés physiques:** enc (encombrement), carry (capacité contenu sacs/conteneurs/véhicules)

**Propriétés combat armes:** reach (allonge CaC/portée distance), damage (dégâts), qualities (liste qualités/défauts)

**Propriétés protection armures:** loc (emplacements corporels couverts), pa (Points Armure)

**Propriétés véhicules:** mode (déplacement), toughness (endurance), wounds (Points Blessures)

**Informations:** desc (description textuelle), book (livre source), page (référence)

### Gestion liste

Objets ajoutés `character.trappings[]` (tableau). Sources: dotation carrière (CareerLevel trappings), achat (sélection base données), butin (ajout libre).

**Quantités:** Même objet plusieurs exemplaires dupliqué (plusieurs entrées) ou géré propriété quantité niveau personnage (implémentation variable).

**Organisation:** Par type (regroupement armes/armures/autres), subType (sous-catégorie), index (position tableau). Ordre affichage varie interface, suit généralement type/subType.

## Validation et affichage

### Validation équipement

Voir [pattern-validation-display.md](../patterns/pattern-validation-display.md) pour structure générale.

**Domaines validation:**

**Structurelle:** Chaque objet id+type, type valide (melee/ranged/armor/ammunition/vehicle/trapping), propriétés requises selon type présentes. Arme melee/ranged: damage+reach requis. Armor: loc+pa requis. Vehicle: mode+toughness+wounds requis.

**Encombrement:** Calculer total, comparer limite (Force+Endurance), alerter si dépassement. Si dépassement: afficher pénalités applicables, suggérer solutions (retirer objets, augmenter caractéristiques).

**Équipement porté:** Armures: vérifier pas plusieurs pièces incompatibles, alerter protection excessive (cumul autorisé mais peut être limité). Armes: vérifier cohérence (pas tenir 3 armes 2 mains), alerter trop armes équipées. Boucliers: maximum 1, nécessite main libre.

**Références:** Toutes qualités référencées existent base, type+subType cohérents. Voir [pattern-validation-references.md](../patterns/pattern-validation-references.md)

**Prix disponibilité:** price >= 0, cohérence gold/silver/bronze et price consolidé, availability valeur liste autorisée (Commune/Limitée/Rare/Exotique/Unique), cohérence type objet.

**Messages types:**
- Erreur bloquante: Données manquantes obligatoires, type invalide, référence inexistante
- Avertissement: Encombrement dépassé, équipement incohérent, prix anormal
- Information: Suggestions optimisation, objets non utilisés, redondances

**Exemples messages:**
```
⚠ Encombrement dépassé: 75/60
Pénalités actives: Mouvement -2, Tests physiques -10%
Suggestion: Retirer 15 enc revenir limite

⚠ Vous portez 3 armes deux mains
Armes deux mains nécessitent deux mains utiliser

❌ Qualité "Tranchante" introuvable
Arme "Épée elfique" référence qualité inexistante
```

**Validation temps réel:** Déclenchement quand objet ajouté/retiré inventaire, état changé (porté↔stocké), caractéristique modifiée (Force/Endurance), propriété objet modifiée. Feedback immédiat: état encombrement (code couleur), pénalités actives, alertes équipement.

### Affichage inventaire

Voir [pattern-validation-display.md](../patterns/pattern-validation-display.md) pour structure générale.

**Organisation:** Regroupement catégories: Armes (mêlée/distance/munitions), Armures (toutes pièces par zone ou liste), Équipement (objets divers/conteneurs/véhicules), Monnaie (section séparée, format X CO, Y PA, Z S).

**Tri ordre:** Par défaut: regroupé type, puis subType, puis alphabétique. Options: encombrement (lourd→léger), prix (cher→moins cher), ordre ajout (récent→ancien).

**Informations par objet:** Base: nom, quantité, enc, état porté/stocké. Armes: groupe, dégâts, allonge/portée, qualités. Armures: zones (loc), PA, qualités. Objets: capacité (carry) si conteneur. Prix: au survol, format X CO Y PA Z S.

**Affichage encombrement:** Format X/Y (X=actuel, Y=limite), Couleurs Vert (<80%), Orange (80-100%), Rouge (>100%), Si surcharge afficher pénalités (Mouvement, Tests).

**Affichage armures par zone:** Tableau Zone | PA | Pièces portées. Permet voir protection totale, zones vulnérables.

**Interactions:** Sur objet: Voir détails (clic/survol), Équiper/Déséquiper (applicable), Porter/Stocker (changer état), Vendre (boutique), Jeter/Abandonner. Sur inventaire: Ajouter objet, Trier/Filtrer, Chercher objet, Optimiser encombrement (suggestions).

**Détails objet:** Au clic/survol afficher description complète, toutes caractéristiques, prix+disponibilité, livre source/page (applicable), qualités détaillées.

## Relations systèmes

**Skills:** Chaque groupe armes correspond compétence spécifique (Melee Basic, Ranged Bow). Personnage doit posséder compétence utiliser efficacement arme. Voir [database/skills.md](../database/skills.md)

**Qualities:** Armes/armures peuvent qualités modifiant effets combat. Voir [database/qualities.md](../database/qualities.md)

**Career:** Carrières définissent dotation initiale (trappings) personnage reçoit débutant. Voir [database/career_levels.md](../database/career_levels.md)

**Characteristics:** Limite encombrement dépend Force+Endurance. Pénalités affectent Mouvement, tests caractéristiques. Voir [database/characteristics.md](../database/characteristics.md)

## Exemples concrets

**Guerrier standard:**
- Armes: Épée (1), Bouclier (1), Dague (0)
- Armure: Maille (3)
- Équipement: Sac (1), Corde (1), Rations (1), Couverture (1)
- Total: 9 enc / 70 limite ✓ Tout OK

**Scout mobile:**
- Armes: Arc (1), Carquois 20 flèches (2), Dague (0)
- Armure: Gilet cuir (1)
- Équipement: Sac léger (3)
- Total: 7 enc / 55 limite ✓ Mobile, peut courir

**Paladin lourdement armé:**
- Armes: Épée (1), Hallebarde (2), Bouclier (1)
- Armure: Plates complète (6), Casque (0)
- Équipement: Sac (1), Matériel (4)
- Total: 15 enc / 85 limite ✓ Protection maximale

## Voir aussi

- [database/trappings.md](../database/trappings.md) - Base données équipement
- [database/qualities.md](../database/qualities.md) - Qualités armes/armures
- [database/skills.md](../database/skills.md) - Compétences armes
- [database/career_levels.md](../database/career_levels.md) - Dotations carrières
- [database/characteristics.md](../database/characteristics.md) - Force/Endurance limite
- [pattern-validation-display.md](../patterns/pattern-validation-display.md) - Pattern validation/affichage
- [pattern-type-subtype.md](../patterns/pattern-type-subtype.md) - Hiérarchie types
