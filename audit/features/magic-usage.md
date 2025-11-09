# Magic - Utilisation de la magie

## Vue d'ensemble

Utilisation pratique magie Warhammer: lancement sorts (tests incantation, CN, composants), distinction Petty vs sorts normaux, validation règles métier, affichage collections sorts, recherche et filtrage. Complète [magic-system.md](./magic-system.md) (apprentissage, domaines, talents, restrictions).

**Références:** [magic-system.md](./magic-system.md), [database/spells.md](../database/spells.md)

## Lancement sorts

### Tests incantation

Tests déterminent succès/échec sorts. Basés Langue (Magick) Arcanes, Foi Divine.

**Caractéristiques tests:**
- Arcanes: Intelligence + Test Langue (Magick)
- Divine: Force Mentale + Test Prière
- Naturelle: Force Mentale + Test Canalisation
- Sorcellerie/Chaos: Force Mentale + Test Canalisation

**Formule difficulté:**
- Base: Test Langue (Magick) ou Prière
- Modificateur CN: -CN × 10

**Exemples:**
- Sort CN 2: Langue (Magick) -20
- Sort CN 5: Langue (Magick) -50
- Sort CN 8: Langue (Magick) -80

**Petty Magic (CN 0):** Pas modificateur, réussite quasi-automatique

**Modificateurs environnement:**
- Domaine Feu: +10 si créatures En flammes proximité (max Bonus FM mètres)
- Domaine Vie: +10 milieu rural/sauvage
- Composants: Réduisent Imparfaites si échec (pas bonus test)
- Fatigue: Malus selon États Exténuer
- Distractions: Malus combat, stress

### Résultats tests

**Réussite:**
- Sort lancé avec succès
- Effets appliqués
- Degrés Réussite (DR): Peuvent prolonger durée sorts "+"

**Échec:**
- Sort non lancé
- Aucun effet
- Pas Corruption (sauf Chaos/Sorcellerie)

**Échec critique (Fumble):**
- Sort non lancé
- Imparfaites Mineures possibles
- Chaos/Sorcellerie: +1 Corruption

**Réussite critique:**
- Effet maximal
- Durée prolongée automatique (sorts "+")
- Aucun risque Imparfaites

**Degrés Réussite (DR):**
- Calcul: (Valeur compétence - Jet dé) / 10 (arrondi inférieur)
- Sorts durée "+": Chaque +2 DR ajoute durée base
- Exemple: "(Bonus FM) Rounds +" avec Bonus FM 4 et DR +4 → 4 + 4 = 8 rounds
- Dégâts certains sorts: Augmentés selon DR

### Tests par tradition

**Arcanes:**
- Compétence: Langue (Magick)
- Modificateur: -CN × 10
- Critique: Imparfaites possibles
- Attribut domaine: Appliqué après succès

**Divine:**
- Bénédictions: Pas test (automatiques)
- Miracles: Test Prière (pas CN, difficulté fixe MJ)
- Faveur divine: MJ peut modifier selon contexte

**Naturelle:**
- Compétence: Canalisation
- Composants: OBLIGATOIRES (impossible sans)
- Modificateur: Sorts simples (CN bas)

**Sorcellerie:**
- Compétence: Canalisation
- Danger: Toujours Imparfaites Mineures sans composants
- Corruption: +1 par Imparfaite

**Chaos:**
- Compétence: Canalisation
- Modificateur: -CN × 10
- Corruption: +1 par Imparfaite
- Tzeentch spécial: Cible Test Résistance ou +1 Corruption (réussite +1 Chance)

### Exemples concrets tests

**Sorcier Feu lance "Boule Feu" (CN 5):**
- Langue (Magick) 45
- Modificateur: -50 (CN 5)
- Jet requis: ≤ -5 (IMPOSSIBLE sans bonus)
- Avec +20 circonstances: Jet ≤ 15
- Réussite: Boule Feu lancée, attribut Feu appliqué (+1 En flammes)

**Prêtre Sigmar lance bénédiction:**
- Pas test requis (automatique)
- Bénédiction appliquée immédiate (+10 caractéristique cible)

**Sorcière Village lance sort naturel:**
- Composants herbes: Check (5 sous cuivre)
- Canalisation 30, CN 0
- Jet ≤ 30 (facile)
- Réussite: Sort appliqué

**Apprenti Celestial CN 2:**
- Langue (Magick) 35
- Modificateur: -20 (CN 2)
- Jet ≤ 15
- Réussite: Sort lancé, attribut Cieux appliqué (ignore PA métal)

## CN (Casting Number)

### Vue ensemble CN

CN (Casting Number, Numéro Incantation) mesure difficulté et puissance sorts. Détermine modificateur test incantation et coût XP apprentissage.

**Valeurs CN:**
- CN 0: Sorts mineurs (Petty Magic) - Faciles, quasi-automatiques, pas modificateur test
- CN 1-3: Sorts faciles - Début apprentissage, modificateur test léger (-10 à -30)
- CN 4-7: Sorts moyens - Confirmés, combat utiles, modificateur test moyen (-40 à -70)
- CN 8-12: Sorts puissants - Magisters expérimentés, modificateur test sévère (-80 à -120)
- CN 13+: Sorts légendaires - Archi-mages, rituels, très difficiles, risques élevés

### Impact test incantation

**Formule:** Langue (Magick) - (CN × 10)

**Exemples calcul:**
- Langue 50, CN 2: Jet ≤ 30 (facile)
- Langue 50, CN 5: Jet ≤ 0 (difficile, bonus requis)
- Langue 70, CN 8: Jet ≤ -10 (impossible sans bonus)

**Petty (CN 0):** Langue compétence complète (pas malus)

### Impact coût XP

**Arcanes:** CN × 10 XP (dans carrière) / CN × 20 (hors)
**Chaos:** CN × 10 XP

**Exemples:**
- CN 2: 20 XP / 40 XP
- CN 5: 50 XP / 100 XP
- CN 8: 80 XP / 160 XP

**Divine:** Pas CN (bénédictions 50 XP, miracles 100 XP fixes)

### CN par tradition

**Arcanes:** CN 0 (Petty) à 30+ (légendaires)
**Divine:** Pas CN (prières fonctionnent différemment)
**Chaos:** CN 4 à 15+ (sorts corrompus puissants)
**Naturelle:** CN 0-3 (sorts simples folklore)
**Sorcellerie:** CN variable (mélanges instables)

### Progression CN

**Apprenti:** CN 0-3 (Petty + sorts faciles)
**Journeyman:** CN 4-6 (sorts moyens utiles)
**Magister:** CN 7-10 (sorts puissants maîtrise)
**Archi-mage:** CN 11+ (légendaires, rituels)

**Limite pratique:** CN 10+ rarement utilisés (trop difficiles quotidien)

### Exemples sorts CN

**CN 0 - Petty Magic:** "Alerte", "Choc", "Lumière", "Ouverture", "Son"
**CN 2:** "Arme Aethyrique", "Armure Aethyrique" (protection base)
**CN 5:** "Boule Feu" (Feu), "Terreur" (Mort), "Bénédiction Guerrière"
**CN 7:** "Forme Bête" (Bête), "Illusion Majeure" (Ombres)
**CN 8:** "Vol" (Cieux), "Transmutation" (Métal)
**CN 10+:** "Tempête Foudre" (CN 10), "Dôme Protection" (CN 15), Rituels anciens

### CN et attributs domaine

**Attributs domaine:** Appliqués après lancer réussi, indépendants CN
- Feu: +1 En flammes (tout CN)
- Cieux: Ignore PA métal (tout CN)
- Bête: Peur 1 (tout CN)

**CN détermine:** Difficulté lancer, pas puissance attribut domaine

## Sorts mineurs vs sorts normaux

### Sorts mineurs (Petty Magic)

**CN:** 0 (toujours)
**Accès:** TOUS lanceurs sorts (Arcanes, Divine, Chaos, Naturelle, Sorcellerie)
**Talent:** "Petty Magic" (optionnel, facilite mais pas obligatoire)
**Coût XP:** 30 XP (carrière) / 60 XP (hors)

**Caractéristiques:**
- Universels: Pas liés domaine spécifique
- Faciles: CN=0 (réussite automatique sauf fumble)
- Basiques: Effets simples, pratiques quotidien
- Socle commun: Base toute tradition magique

**Exemples:**
- "Alerte": Détecte danger imminent (+10 Perception)
- "Choc": Inflige 1 Sonné (contact)
- "Lumière": Éclairage magique (10 minutes)
- "Ouverture": Ouvre serrure simple
- "Son": Crée bruit distance

**Usage:** Apprentis débutent par sorts mineurs avant domaine. Magisters confirmés utilisent quotidien (lumière, rangement, etc.).

### Sorts normaux (Magie Arcanes, etc.)

**CN:** 2 à 30+ (variable selon puissance)
**Accès:** Selon domaine et talent spécifique
**Spécialisation:** Liés tradition magique (Arcanes, Divine, Chaos)
**Coût XP:** CN × 10 (Arcanes), 50-100 (Divine), etc.

**Caractéristiques:**
- Spécialisés: Domaine spécifique requis
- Puissants: Effets significatifs combat/aventure
- Difficiles: Tests incantation requis, échecs possibles
- Progression: CN augmente avec puissance

**Exemples Arcanes:**
- "Boule Feu" (CN 5): Dégâts zone, En flammes
- "Forme Bête" (CN 7): Transformation animale
- "Vol" (CN 8): Lévitation Bonus FM mètres
- "Dôme Protection" (CN 6): Barrière magique

**Exemples Divine:**
- Bénédictions (pas CN): Bonus +10 caractéristique
- Miracles (pas CN): Effets majeurs (Encalminer navire, Guérison miraculeuse)

### Différences clés

| Aspect | Petty Magic | Sorts normaux |
|--------|-------------|---------------|
| CN | 0 (fixe) | 2-30+ (variable) |
| Accès | Tous lanceurs | Domaine spécifique |
| Talent | Petty Magic (optionnel) | Domaine requis |
| Coût XP | 30 XP | CN × 10 ou fixe |
| Puissance | Faible, utilitaire | Fort, combat/aventure |
| Difficulté | Facile (automatique) | Variable (tests requis) |
| Spécialisation | Aucune | Domaine obligatoire |

### Transition mineurs → normaux

**Apprenti Sorcier:**
1. Début: Apprend sorts mineurs (Petty Magic)
2. Formation: Acquiert "Arcane Magic (Domaine)"
3. Progression: Apprend sorts domaine CN croissant (2 → 4 → 6 → 8+)

**Initié:**
1. Début: Apprend bénédictions (équivalents "mineurs" Divine)
2. Ordination: Acquiert "Invoke (Dieu)"
3. Progression: Apprend miracles puissants

### Sorts mineurs par tradition

**Arcanes:** Petty Magic socle avant spécialisation domaine
**Divine:** Bénédictions équivalent (CN N/A mais simples)
**Chaos:** Mélange Petty + sorts Chaos puissants
**Naturelle:** Sorts simples (CN bas, 0-2) folklore
**Sorcellerie:** Petty + sorts mélanges (dangereux)

### CN 0-2 zone grise

Certains sorts CN 1-2 frontière mineurs/normaux:
- **CN 0:** Définitifs sorts mineurs (Petty)
- **CN 1-2:** Sorts Arcanes très faciles, début apprentissage
- **CN 3+:** Sorts normaux confirmés

**Exemple:** "Arme Aethyrique" (CN 2) = sort Arcanes facile, mais PAS Petty Magic (domaine requis).

## Ingrédients sorts

### Composants par domaine

**Arcanes (Huit Vents) - OPTIONNELS:**
- Effet: Réduisent risque Imparfaites Mineures
- Coût: NI pistoles argent par incantation
- Composants typiques: Bête (fourrure, os, organes animaux), Cieux (instruments astronomiques, viscères), Feu (inflammables, ignifuges), Lumière (artefacts sacrés, cristaux), Métal (métaux lourds, outils forge), Mort (os, symboles mortalité), Ombres (objets dissimulation), Vie (plantes vivantes, éléments naturels)

**Naturelle - OBLIGATOIRES:**
- Effet: Aucun sort sans composants
- Coût: 5 sous cuivre OU DR+1 Herboristerie
- Composants: Herbes préparées strictement (recettes traditionnelles)
- Préparation: 1 heure préparation + connaissances herboristerie

**Sorcellerie - OBLIGATOIRES (sauf acceptation Imparfaites):**
- Effet: Sans composants → Toujours Imparfaites Mineures
- Coût: NI sous cuivre (sacrifices animaux vivants)
- Composants: Animaux sacrifiés rituellement
- Danger: +1 Corruption par sort Imparfait lancé

**Divine - Aucun:**
- Bénédictions: Foi suffit, pas composants matériels
- Miracles: Pouvoir divin direct, pas ingrédients
- Symboles: Symboles saints optionnels (roleplay, pas mécanique)

**Chaos - OPTIONNELS:**
- Effet: Réduisent Imparfaites
- Coût: NI pistoles argent
- Composants: Substances corrompues, victimes sacrifice (interdit)

### Mécaniques ingrédients

**Avec composants:**
- Test Incantation normal
- Si échec: Pas Imparfaites Mineures automatiques (sauf Sorcellerie)
- Composants consommés chaque incantation

**Sans composants:**
- Arcanes/Chaos: Test normal mais risque Imparfaites si échec critique
- Naturelle: IMPOSSIBLE lancer
- Sorcellerie: Toujours Imparfaites Mineures

### Disponibilité ingrédients

**Urbain:** Boutiques alchimie, herboristerie
- Arcanes/Chaos: NI pistoles (cher)
- Naturelle: 5 sous cuivre (accessible)

**Rural:** Cueillette, préparation
- Naturelle: DR+1 Herboristerie (gratuit mais temps)
- Arcanes: Difficile trouver (MJ)

**Illégal:** Marché noir
- Sorcellerie: Animaux vivants (suspect)
- Chaos: Substances proscrites (exécution si découvert)

### Exemples concrets composants

**Magister Feu lance "Boule Feu" (CN 5):**
- Sans composants: Test normal, risque Imparfaite si échec critique
- Avec composants (huile, charbon, 4 pistoles): Échec critique réduit Imparfaite

**Sorcière Village lance sort naturel:**
- DOIT avoir herbes préparées (5 sous cuivre)
- Sans herbes: IMPOSSIBLE lancer
- Préparation: 1h cueillette + DR Herboristerie

**Sorcière mélange Vents:**
- Sans sacrifice animal: TOUJOURS Imparfaites Mineures
- Avec sacrifice (3 sous cuivre, animal vivant): Test normal
- +1 Corruption par Imparfaite quand même

**Prêtre Sigmar lance bénédiction:**
- Aucun composant requis (foi suffit)
- Symbole Sigmar optionnel (marteau) roleplay

### Coûts récapitulatif

| Domaine | Obligatoire | Coût | Effet |
|---------|-------------|------|-------|
| Arcanes Couleurs | Non | NI pistoles | Réduit Imparfaites |
| Naturelle | OUI | 5 sous OU DR+1 | Requis lancer |
| Sorcellerie | OUI (sinon pénalité) | NI sous | Évite Imparfaites auto |
| Divine | Non | N/A | Foi suffit |
| Chaos | Non | NI pistoles | Réduit Imparfaites |

## Validation et affichage

### Validation magie

Voir [pattern-validation-display.md](../patterns/pattern-validation-display.md) pour structure générale.

**Domaines validation:**

**Prérequis talents:**
- Arcanes → "Arcane Magic (Domaine)" possédé
- Divine → "Bless" ou "Invoke (Dieu)" possédé
- Chaos → "Chaos Magic (Dieu)" possédé
- Petty → Au moins un talent magie

**Erreurs:** "Sort {nom} nécessite talent {type}"

**Domaine correspond (Arcanes):**
- Sort subType correspond talent domaine
- Pas mélange domaines (corruption)

**Erreurs:** "Mélange domaines interdit", "Sort domaine {X} inaccessible (talent {Y})"

**Dieu correspond (Divine):**
- Miracle subType correspond talent Invoke

**Erreurs:** "Miracle {dieu} nécessite Invoke ({dieu})"

**Accès carrière:**
- Répurgateur/Soldat → Aucune magie
- Apprenti/Initié → Sorts domaine OK
- Autres → Hors carrière (coût double)

**Erreurs:** "Carrière {nom} interdit magie", "Coût double hors carrière"

**Exclusivité Arcanes:**
- Maximum 1 domaine Arcanes
- Vérifier talent correspond

**Erreurs:** "Plusieurs domaines: {liste}", "Mélange Vents = corruption"

**Multi-dieux Divine:**
- Vérifier talent Invoke par dieu
- Bénédictions universelles OK

**Erreurs:** "Miracle sans talent Invoke"

**Composants:**
- Naturelle obligatoires: Composants requis inventaire, coût 5 sous cuivre ou Herboristerie
- Sorcellerie pénalités: Sans composants → Imparfaites Mineures, alerter risque Corruption

**Erreurs/Avertissements:** "Sort impossible sans composants", "Imparfaites automatiques", "+1 Corruption/Imparfaite"

**CN progression:**
- Débutant: CN 0-3, Confirmé: CN 4-7, Expert: CN 8+
- Petty avant sorts puissants recommandé

**Avertissements:** "CN élevé pour niveau", "Progression atypique"

**Coûts XP:**
- Arcanes: CN × 10 (carrière) / CN × 20 (hors)
- Divine: 50 (bénédictions) / 100 (miracles)
- Vérifier XP disponibles, soustraire coûts appris

**Erreurs:** "Coût XP incorrect: {dépensé} vs {attendu}", "XP insuffisants: {requis} vs {disponible}"

**Messages types:**
- Bloquants: Talent manquant, domaine interdit, carrière interdit, XP insuffisants
- Avertissements: CN élevé, progression atypique, composants manquants
- Informations: Coût hors carrière, multi-dieux possible, composants optionnels

**Exemples validations:**
- Sorcier Feu → "Forme Bête": ECHEC (Bête ≠ Feu), "Mélange domaines interdit", Inaccessible
- Érudit → Sort Feu: Talent OK, Hors carrière, "Coût double (CN × 20)", Accessible coût augmenté
- Répurgateur → Magie: Carrière ECHEC, "Carrière interdit magie", Aucune magie
- Prêtre Sigmar + Ulric: Talents "Invoke (Sigmar)" + "Invoke (Ulric)", Validation OK (talents distincts), Miracles deux dieux + bénédictions

### Affichage sorts

Voir [pattern-validation-display.md](../patterns/pattern-validation-display.md) pour structure générale.

**Organisation:** Groupement tradition: Arcanes (par domaine Feu/Cieux/Bête), Divine (Bénédictions universelles / Miracles par dieu), Mineurs (Petty Magic section séparée), Autres (Naturelle, Sorcellerie sections propres).

**Tri sorts:** Par CN croissant (CN 0 → 2 → 5 → 8+), Par alphabétique (si même CN), Séparer connus/disponibles (distinction visuelle claire).

**Détails sorts:** Essentiels: Nom (label sort), CN (Casting Number sauf Divine), Portée (Contact, 6m, (FM) mètres), Cible (nombre ou description), Durée (Instantanée, Rounds, Heures). Additionnels: Type/SubType (tradition et domaine/dieu), Coût XP (si non appris), Description courte (résumé effet principal), Composants (si requis Naturelle ou optionnels Arcanes).

**Distinction connus/disponibles:**
- Sorts connus: Affichés prominent (gras, couleur, icône), détails complets visibles, accès description complète
- Sorts disponibles: Affichés secondaire (gris, italique), résumé uniquement, coût XP visible, prérequis indiqués si manquants
- Sorts inaccessibles: Masqués OU affichés grisés verrouillés, message prérequis manquants. Exemples: Autres domaines Arcanes, Miracles autres dieux

**Informations contextuelles:**
- Attributs domaine: Feu ("+1 En flammes automatique"), Cieux ("Ignore PA métal, frappe 2m"), Bête ("Peur 1 ennemis")
- Environnements favorables: Feu ("+10 si En flammes proximité"), Vie ("+10 rural/sauvage")
- Prérequis manquants: Talent requis manquant ("Nécessite Arcane Magic (Domaine)"), Carrière interdite ("Interdit carrière actuelle"), XP insuffisants ("Requis {X} XP, disponible {Y}")

**Exemples affichage:**

Sorcier Feu:
```
SORTS MINEURS
[X] Alerte (CN 0) - Détecte danger
[X] Choc (CN 0) - 1 Sonné contact
[ ] Lumière (CN 0) - 30 XP

FEU (Attribut: +1 En flammes)
[X] Arme Enflammée (CN 3)
[X] Boule Feu (CN 5)
[ ] Lames Ardentes (CN 7) - 70 XP
[ ] Mur Flammes (CN 9) - 90 XP

AUTRES DOMAINES
[VERROUILLÉ] Bête, Cieux, Lumière, Métal, Mort, Ombres, Vie
(Mélange domaines = corruption)
```

Prêtre Sigmar:
```
BENEDICTIONS (Universelles)
[X] Bénédiction Bataille
[X] Bénédiction Courage
[ ] Bénédiction Protection - 50 XP

MIRACLES SIGMAR
[X] Courroux Sigmar
[ ] Protection Divine - 100 XP
[ ] Guérison Miraculeuse - 100 XP

AUTRES DIEUX
[ ] Manann, Ulric, Ranald...
(Nécessitent talents Invoke distincts)
```

### Recherche sorts

**Critères recherche:**
- Par nom: Recherche textuelle partielle, insensible casse. Exemple: "Feu" trouve "Boule Feu", "Arme Enflammée", "Mur Flammes"
- Par domaine/lore: Arcanes (Bête, Cieux, Feu, Lumière, Métal, Mort, Ombres, Vie), Divine (par dieu), Mineurs (Petty Magic), Autres (Naturelle, Sorcellerie, Chaos)
- Par CN: Plages (CN 0, CN 1-3, CN 4-6, CN 7-9, CN 10+), Slider (CN min/max), Divine (pas CN, filtrer séparément)
- Par disponibilité: Connus (sorts déjà appris), Disponibles (accessibles avec talents actuels), Inaccessibles (prérequis manquants)
- Par carrière: Dans carrière (coût normal), Hors carrière (coût double), Interdit (carrière bloque Répurgateur)

**Filtres combinables:** Exemples: Feu + CN 4-6 + Disponibles ("Boule Feu" CN 5, "Lames Ardentes" CN 6), Divine + Sigmar + Non appris (miracles Sigmar non connus, coût XP affiché), Petty + Connus (sorts mineurs déjà appris), Tous + CN 0-3 (sorts faciles toutes traditions)

**Tri résultats:** Ordres: Par CN (croissant 0→10+), Par nom (alphabétique), Par domaine (grouper traditions), Par coût (XP croissant), Par disponibilité (connus d'abord). Tri défaut: CN croissant puis nom alphabétique.

**Recherche avancée:** Par description (texte description sort, exemples: "dégâts", "guérison", "protection"), Par effets (états infligés "Sonné", "En flammes", "Aveugle", types dégâts "feu", "foudre", "magique"), Par portée (Contact, Vous, 6m, 12m, (FM) mètres), Par durée (Instantanée, Rounds, Heures, Permanent)

**Filtres rapides presets:** Débutant (CN 0-3, disponibles), Expert (CN 7+, disponibles), Économique (coût ≤ 50 XP), Hors carrière (coûteux, accessibles), Petty (CN 0, universels)

**Résultats vides:** Messages suggestions: "Aucun sort disponible domaine Bête (talent manquant)", "Aucun sort CN 10+ connu (progression requise)", "Recherche '{texte}' aucun résultat". Suggestions alternatives: Afficher sorts proches critères, proposer élargir recherche, indiquer prérequis manquants.

## Exemples concrets

**Apprenti Celestial début:**
- Apprend Petty: "Lumière", "Alerte", "Choc" (30 XP chacun, CN=0)
- Acquiert "Arcane Magic (Cieux)"
- Apprend sorts Cieux: "Aethyrique Armure" (CN 2, 20 XP), "Foudre" (CN 6, 60 XP)

**Prêtre Sigmar:**
- Apprend bénédictions: "Bénédiction Bataille", "Bénédiction Courage" (50 XP, simples)
- Apprend miracles: "Courroux Sigmar" (100 XP, puissant)

**Sorcière:**
- Connait Petty: "Ouverture", "Son" (utilitaire discret)
- Lance sorts Sorcellerie: Mélanges dangereux, +1 Corruption

**Magister Feu lance "Boule Feu":**
- Langue (Magick) 60, CN 5 → Jet ≤ 10
- Réussite: Dégâts zone, +1 En flammes automatique (attribut Feu)
- Si créatures En flammes proximité: +10 bonus environnement

**Magister Jade lance "Régénération" forêt:**
- Milieu sauvage: +10 bonus environnement
- Attribut Vie: Retire Exténuer allié ciblé
- Bonus vs morts-vivants si applicable

## Relations systèmes

**Magic-system:** Domaines, talents, apprentissage, restrictions. Voir [magic-system.md](./magic-system.md)

**Spells:** Base données sorts, propriétés, effets. Voir [database/spells.md](../database/spells.md)

**Lores:** Domaines magie, attributs, philosophies. Voir [database/lores.md](../database/lores.md)

**Skills:** Langue (Magick), Prière, Canalisation tests. Voir [database/skills.md](../database/skills.md)

**Talents:** Prérequis lancer sorts. Voir [database/talents.md](../database/talents.md)

## Voir aussi

- [magic-system.md](./magic-system.md) - Domaines, talents, apprentissage, restrictions
- [database/spells.md](../database/spells.md) - Base données sorts
- [database/lores.md](../database/lores.md) - Domaines magie
- [database/skills.md](../database/skills.md) - Compétences incantation
- [pattern-validation-display.md](../patterns/pattern-validation-display.md) - Pattern validation/affichage
