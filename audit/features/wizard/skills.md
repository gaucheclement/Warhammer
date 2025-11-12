# Wizard - Compétences

## Vue d'ensemble

L'étape Skills permet au joueur de sélectionner et d'améliorer les compétences de son personnage en deux phases : compétences d'espèce puis compétences de carrière. Les augmentations (avances) s'accumulent pour déterminer la valeur finale de test de chaque compétence.

**Objectif métier** : Permettre au joueur d'investir ses points d'augmentation raciaux et de carrière pour personnaliser son personnage.

**Calcul valeur finale** : Valeur = Caractéristique liée + Avances totales (espèce + carrière + XP). Bonus = Valeur ÷ 10.

**Interface** : Tableau (Nom | Base | Augmentation | Total) avec boutons +/- pour ajuster les augmentations, compteurs dynamiques pour suivre les points restants.

## Compétences d'espèce

### Système d'augmentations raciales

Première partie de l'étape Skills. Le joueur sélectionne quelles compétences raciales héritées de son espèce il souhaite améliorer.

**Source des compétences** : Champ `skills` de la table Species (voir [species.md](../../database/species.md)), format texte nécessitant parsing (voir [pattern-parsing.md](../../patterns/pattern-parsing.md)). Exemples : "Athlétisme, Calme, Résistance, Langue (Bataille)", "Art (Au choix) ou Métier (Au choix)".

**Répartition des points** :
- 3 compétences à +5 augmentations chacune
- 3 compétences à +3 augmentations chacune
- Total : 6 compétences sélectionnées, 24 augmentations distribuées

**Règles de sélection** :
- Choix parmi uniquement les skills de l'espèce (liste fermée)
- Chaque compétence peut recevoir 0, 3 ou 5 augmentations (pas d'autres valeurs)
- Une compétence ne peut pas avoir à la fois +3 et +5 (exclusif)
- Validation : exactement 3 compétences à +5 ET 3 compétences à +3

**Affichage** : Panneau gauche avec deux compteurs dynamiques (slots restants 3→0) pour "+5 Augmentations" et "+3 Augmentations". Boutons +/- pour cycle 0→3→5. Bouton "Valider" activé uniquement si exactement 3 skills à +5 ET 3 skills à +3.

### Spécialisations héritées

**Spécialisations prédéfinies** : Exemple Humain "Langue (Bataille)" → spécialisation déjà définie, pas de choix à faire, affichage direct "Langue (Bataille)".

**Spécialisations "Au choix"** : Exemple Humain "Art (Au choix)" → le joueur doit choisir. Popup de sélection affichée lors du clic sur la compétence. Liste des specs provient du champ `specs` de la table Skills. Affichage après choix : "Art (Peinture)". Voir [pattern-specialisations.md](../../patterns/pattern-specialisations.md).

**Opérateur "ou"** : Voir [pattern-parsing.md](../../patterns/pattern-parsing.md). Exemple Humain "Art (Au choix) ou Métier (Au choix)" → le joueur choisit l'une des deux options.

### Exemples espèce

**Humain (Reiklander)** : Skills = Athlétisme, Calme, Résistance, Langue (Bataille), Art (Au choix) ou Métier (Au choix), Animaux ou Charme, Commerage ou Ragots. Sélection : Art (Peinture), Charme. Répartition : +5 (Art Peinture, Athlétisme, Calme), +3 (Résistance, Langue Bataille, Charme). Résultat : Art (Peinture) 28+5=33, Athlétisme 25+5=30, Calme 32+5=37, Résistance 30+3=33, Langue (Bataille) 32+3=35, Charme 35+3=38.

**Nain** : Skills = Résistance, Endurance, Calme, Corps à corps (Base), Métier (Au choix), Langue (Khazalid), Connaissance (Géologie) ou Connaissance (Métallurgie). Sélection : Métier (Forgeron), Connaissance (Métallurgie). Répartition : +5 (Métier Forgeron, Résistance, Endurance), +3 (Calme, Corps à corps Base, Connaissance Métallurgie). Résultat : Métier (Forgeron) 30+5=35, Résistance 40+5=45, Endurance 40+5=45, Calme 42+3=45, Corps à corps (Base) 30+3=33, Connaissance (Métallurgie) 28+3=31.

**Halfling** : Skills = Calme, Charme, Esquive, Intuition, Discrétion (Rurale), Perception, Animaux ou Ragots. Sélection : Ragots. Répartition : +5 (Charme, Calme, Ragots), +3 (Intuition, Perception, Esquive). Résultat : Charme 30+5=35, Calme 35+5=40, Ragots 30+5=35, Intuition 30+3=33, Perception 25+3=28, Esquive 25+3=28.

### Mode Free espèce

En mode Free : toutes les compétences de la base de données disponibles (pas seulement celles de l'espèce), compétences raciales surlignées (class `highlighting`), pas de limite de +10 par compétence, validation non bloquante (peut valider avec 0 sélections ou répartition non conforme).

## Compétences de carrière

### Système d'allocation de 40 points

Deuxième partie de l'étape Skills. Après avoir sélectionné les compétences raciales, le joueur répartit 40 points d'augmentation parmi les compétences du niveau 1 de carrière.

**Source des compétences** : Champ `skills` de la table CareerLevels pour le niveau 1 (voir [careerLevels.md](../../database/careerLevels.md), parsing voir [pattern-parsing.md](../../patterns/pattern-parsing.md)). Exemples : "Athlétisme, Esquive, Intuition, Corps à corps (Base), Calme, Charme, Commandement, Ragots". Quantité : généralement 8-10 compétences pour le niveau 1.

**Type de compétences** : Basic (accessibles à tous : Athlétisme, Calme, Esquive), Advanced (spécifiques à certaines carrières : Guérison, Crochetage, Navigation).

**Règles de répartition** :
- Total de 40 points à répartir librement
- Limite : Maximum 10 points par compétence
- Pas de minimum : une compétence peut rester à 0
- Validation : tous les 40 points doivent être alloués
- Bouton "Valider" désactivé si points restants ≠ 0

**Affichage** : Panneau gauche avec compteur dynamique affichant points restants (40 → 0). Boutons +/- pour ajustement par incrément de 1, limite 0-10 par skill. Bouton "Valider" activé uniquement si les 40 points sont entièrement alloués.

### Cumul avec compétences d'espèce

**Compétences communes** : Si une compétence est à la fois dans l'espèce ET dans la carrière, les augmentations se cumulent. Exemple : Un Humain (Athlétisme +5 d'espèce) devenant Agitateur (Athlétisme niveau 1) peut avoir Athlétisme avec Base + 5 (espèce) + 10 (carrière) = Total +15.

**Compétences distinctes** : Les compétences uniquement dans la carrière commencent à 0 augmentation d'espèce. Les compétences uniquement dans l'espèce ne sont pas modifiables à cette étape.

**Affichage cumul** : Colonne "Augmentation" = Cumul espèce + carrière (ex: 5+7=12). Colonne "Total" = Base + Augmentation (ex: 30+12=42).

### Spécialisations héritées et nouvelles

**Spécialisations héritées** : Si la compétence a déjà été sélectionnée avec spécialisation à l'étape espèce, la spécialisation est conservée. Exemple : Art (Peinture) choisi à l'étape espèce → Art (Peinture) affiché ici.

**Spécialisations à définir** : Si la carrière liste une compétence groupée sans spécialisation, le joueur doit choisir. Popup de sélection affichée lors du premier clic. Exemple : Corps à corps (?) → choix parmi (Bagarre, Escrime, Base, etc.).

**Opérateur "Au choix"** : Certaines carrières offrent "Compétence A ou Compétence B ou Compétence C". Le joueur sélectionne celle(s) qu'il souhaite développer. Toutes les options sont affichées, seules celles avec points > 0 sont conservées.

### Exemples carrière

**Agitateur (Humain Reiklander)** : Skills carrière = Athlétisme, Esquive, Intuition, Corps à corps (Base), Calme, Charme, Commandement, Ragots. Espèce (rappel) = Athlétisme +5, Calme +5, Charme +3. Répartition 40pts : Athlétisme +5, Calme +5, Charme +10, Commandement +10, Ragots +10. Résultat : Athlétisme 25+5+5=35, Calme 32+5+5=42, Charme 35+3+10=48, Commandement 35+10=45, Ragots 35+10=45.

**Artisan (Nain)** : Skills carrière = Calme, Résistance, Métier (Forgeron), Corps à corps (Base), Perception, Marchandage, Ragots, Évaluation. Espèce (rappel) = Résistance +5, Métier (Forgeron) +5, Calme +3, Corps à corps (Base) +3. Répartition 40pts : Métier (Forgeron) +10, Évaluation +10, Marchandage +10, Perception +10. Résultat : Métier (Forgeron) 30+5+10=45, Évaluation 28+10=38, Marchandage 30+10=40, Perception 28+10=38.

**Bourgeois (Halfling)** : Skills carrière = Charme, Résistance, Commandement, Ragots, Intuition, Connaissance (Reikland), Art ou Métier (Au choix), Langue (Au choix). Espèce (rappel) = Charme +5, Ragots +5, Intuition +3. Choix : Métier (Cuisine), Langue (Tiléen). Répartition 40pts : Charme +10, Ragots +10, Commandement +10, Métier (Cuisine) +5, Langue (Tiléen) +5. Résultat : Charme 30+5+10=45, Ragots 30+5+10=45, Commandement 30+10=40, Métier (Cuisine) 25+5=30, Langue (Tiléen) 25+5=30.

### Mode Free carrière

En mode Free : toutes les compétences disponibles (pas seulement celles de la carrière), compétences de carrière surlignées (class `highlighting`), pas de limite de +10 par compétence, validation non bloquante.

## Gestion des choix

### Format "Au choix" dans les données

Gestion des compétences marquées "Au choix" dans les listes de skills d'espèce ou de carrière. Le joueur doit sélectionner parmi plusieurs options proposées.

**Parsing du format** (voir [pattern-parsing.md](../../patterns/pattern-parsing.md)) : Opérateur "ou" = "Compétence A ou Compétence B ou Compétence C". Exemples : "Art (Au choix) ou Métier (Au choix)", "Animaux ou Charme", "Connaissance (Géologie) ou Connaissance (Métallurgie)".

**Provenance** : Champ `skills` de la table Species ("Art (Au choix) ou Métier (Au choix), Animaux ou Charme"), champ `skills` de la table CareerLevels niveau 1 ("Art (Au choix) ou Métier (Au choix), Langue (Au choix)").

### Logique de sélection

**Affichage des options** : Toutes les options sont affichées dans la liste des compétences. Le joueur peut allouer des points à n'importe laquelle des options. Seules les compétences avec points > 0 sont conservées.

**Sélection exclusive vs multiple** : Format "A ou B" = le joueur peut choisir A, B, ou les deux (pas d'exclusion stricte). Dans la pratique : le joueur alloue ses points limités, donc choisit naturellement.

**Validation nombre de choix** : Pas de contrainte explicite sur le nombre de choix. La limite vient des points disponibles (espèce : 6 skills avec points, carrière : 40 points).

### Combinaison "Au choix" + spécialisation

**Format** : "Art (Au choix)" signifie compétence groupée nécessitant spécialisation. Le joueur doit : 1) Choisir "Art" parmi "Art ou Métier", 2) Choisir la spécialisation (ex: Peinture). Popup de spécialisation affichée lors du premier clic (voir section Spécialisations).

**Exemples** : "Art (Au choix) ou Métier (Au choix)" → Joueur choisit Métier → Popup pour spécialiser (Forgeron, Charpentier...). "Connaissance (Géologie) ou Connaissance (Métallurgie)" → Spécialisations prédéfinies, pas de popup.

### Parsing "ou"

**Format** : Opérateur " ou " (espace + ou + espace) pour choix multiples. Voir [pattern-parsing.md](../../patterns/pattern-parsing.md).

**Traitement étape Skills** : Chaque option devient une compétence disponible. Le joueur alloue des points librement parmi les options. Seules les compétences avec points > 0 sont conservées (pas d'exclusion stricte dans Skills, contrairement aux Talents).

## Spécialisations

### Compétences nécessitant spécialisation

Gestion des spécialisations de compétences groupées durant l'étape Skills. Certaines compétences nécessitent une spécialisation (ex: Art → Peinture, Métier → Forgeron, Langue → Bretonnien).

**Compétences groupées** (voir [skills.md](../../database/skills.md)) : Champ `specs` non vide indique une compétence groupée. Exemples : Art, Métier, Langue, Connaissance, Focalisation, Corps à corps, Projectiles, Discrétion.

**Format specs** : Liste séparée par virgules : "Item1, Item2, Item3". Exemple Art : "Calligraphie, Cartographie, Écriture, Gravure, Icones, Mosaïque, Peinture, Sculpture, Tatouage, Tissage".

### Types de spécialisations

**Liste fermée** : Spécialisations définies dans le champ `specs` de la table Skills. Le joueur doit choisir parmi les options disponibles. Exemples : Art (10 options), Corps à corps (8 options), Focalisation (9 Vents de Magie).

**Liste ouverte "(Au choix)"** : Marqueur spécial dans species.skills ou careerLevels.skills. Format : "Métier (Au choix)", "Langue (Au choix)". Le joueur peut saisir librement OU choisir parmi les specs de la table Skills.

**Spécialisation prédéfinie** : Format "Langue (Bataille)", "Corps à corps (Base)" → Pas de choix à faire, la spécialisation est fixée, affichage direct avec la spécialisation.

**Spécialisation à définir** : Format "Art (Au choix)", "Métier (?)" → Popup de sélection affichée au premier clic sur la compétence. Blocage jusqu'à sélection (impossible d'allouer des points sans spécialisation).

### Interface de sélection

**Popup de spécialisation** : Déclenchement automatique au premier clic sur une compétence avec "(Au choix)" ou sans spécialisation définie. Fonction : `showSpecialisationPopin(character, elem, change, null, true)`.

**Contenu** : Titre "Choisissez une spécialisation pour [Nom de la compétence]", liste des spécialisations disponibles (provenant de `skills.specs`), bouton "Valider" pour confirmer.

**Options d'affichage** : Si liste fermée = radio buttons ou dropdown avec les specs de la table Skills. Si "(Au choix)" = champ texte libre OU dropdown des specs courantes.

**Comportement** : Le joueur clique sur une spécialisation ou saisit du texte. Clic sur "Valider" enregistre le choix. La popup se ferme et la compétence affiche maintenant "Nom (Spécialisation)". Bouton "Annuler" ou clic hors de la popup = la compétence reste non spécialisée, impossible d'allouer des points tant que la spécialisation n'est pas définie.

### Exemples spécialisations

**Art (Au choix) - Humain** : Source = species.skills pour Humain = "Art (Au choix) ou Métier (Au choix)". Scénario : Joueur choisit Art parmi "Art ou Métier", puis doit spécialiser. Options disponibles : Calligraphie, Cartographie, Écriture, Gravure, Icones, Mosaïque, Peinture, Sculpture, Tatouage, Tissage. Sélection : Joueur choisit "Peinture". Résultat : La compétence devient "Art (Peinture)" et peut recevoir des augmentations.

**Métier (Forgeron) - Nain** : Source = species.skills pour Nain = "Métier (Au choix)". Scénario : Spécialisation à définir parmi liste ouverte. Options suggérées : Forgeron, Charpentier, Menuisier, Maçon, Tanneur, Brasseur, Boulanger, Boucher... Sélection : Joueur choisit ou saisit "Forgeron". Résultat : "Métier (Forgeron)".

**Langue (Bataille) - Humain** : Source = species.skills pour Humain = "Langue (Bataille)". Scénario : Spécialisation prédéfinie. Comportement : Pas de popup, la compétence est directement "Langue (Bataille)". Résultat : Aucune action requise du joueur.

**Focalisation - Mage** : Source = talent "Mage Mineur" ajoute "Focalisation". Options disponibles : Aqshy, Azyr, Chamon, Dhar, Ghur, Ghyran, Hysh, Shyish, Ulgu (9 Vents de Magie). Sélection : Joueur choisit son domaine de magie (ex: "Azyr"). Résultat : "Focalisation (Azyr)".

### Contraintes spécialisations

**Spécialisation obligatoire** : Toute compétence groupée doit avoir une spécialisation définie. Impossible de valider l'étape avec des spécialisations manquantes.

**Unicité** : Chaque combinaison (Nom, Spécialisation) est une compétence distincte. Exemple : Art (Peinture) ≠ Art (Sculpture). Un personnage peut acquérir plusieurs spécialisations de la même compétence groupée.

**Cohérence avec table Skills** : Si liste fermée = la spécialisation doit exister dans `skills.specs`. Si "(Au choix)" = validation plus souple, accepte texte libre.

**Cas particulier Focalisation** : Compétence hybride, groupée (avec 9 Vents de Magie) pour les mages formés, non groupée (sans spécialisation) pour ceux sans formation magique. Détermination du mode : Si acquise via talent (Mage Mineur, Magie des Arcanes) → groupée, nécessite spécialisation. Si acquise autrement → non groupée, pas de spécialisation.

## Calcul des valeurs

### Formule de calcul

Calcul de la valeur finale de chaque compétence et de son bonus associé. La valeur finale est utilisée pour les tests de compétences en jeu.

**Valeur finale** : Valeur = Caractéristique liée + Avances totales. Exemples : Athlétisme (Agilité 25 + Avances 10) = 35, Charme (Sociabilité 35 + Avances 13) = 48.

**Caractéristique liée** : Définie dans le champ `characteristic` de la table Skills (voir [skills.md](../../database/skills.md)). Valeur provient de la table Characteristics du personnage. Exemples : Art → Dextérité, Calme → Force Mentale, Corps à corps → Capacité de Combat.

**Avances totales** : Cumul espèce + carrière + XP. Exemples : 5+10=15, 3+7=10, 0+10+5=15.

**Bonus** : Bonus = Valeur ÷ 10 (division entière). Exemples : Valeur 35 → Bonus +3, Valeur 48 → Bonus +4, Valeur 63 → Bonus +6. Utilisation : tests (Bonus de Calme pour résister à la peur), dégâts au corps à corps (Bonus de Force), capacités diverses (Bonus d'Agilité pour talents).

### Affichage valeurs

**Colonne "Base"** : Valeur de la caractéristique liée. Exemple : Dextérité 28 pour Art → Base 28.

**Colonne "Augm" ou "Augmentation"** : Total des avances (espèce + carrière + XP). Exemple : 5+10 = 15.

**Colonne "Total"** : Valeur finale = Base + Augmentation. Exemple : 28 + 15 = 43.

**Affichage Bonus** (si nécessaire) : Format "Valeur (Bonus)". Exemple : "43 (+4)".

### Mise à jour temps réel

**Déclencheurs de recalcul** : Changement de caractéristique (avances de carrière sur caractéristiques), modification d'avances de skills, application d'effets de talents (modificateurs de caractéristiques).

**Affichage dynamique** : Les colonnes "Base" et "Total" se mettent à jour automatiquement. Recalcul instantané lors de l'allocation de points.

### Exemples de calculs

**Humain Agitateur - Athlétisme** : Caractéristique liée = Agilité 25. Avances = 5 (espèce) + 5 (carrière) = 10. Valeur = 25 + 10 = 35. Bonus = 35 ÷ 10 = +3.

**Humain Agitateur - Charme** : Caractéristique liée = Sociabilité 35. Avances = 3 (espèce) + 10 (carrière) = 13. Valeur = 35 + 13 = 48. Bonus = 48 ÷ 10 = +4.

**Nain Artisan - Métier (Forgeron)** : Caractéristique liée = Dextérité 30. Avances = 5 (espèce) + 10 (carrière) = 15. Valeur = 30 + 15 = 45. Bonus = 45 ÷ 10 = +4.

**Elfe Éclaireur - Corps à corps (Escrime)** : Caractéristique liée = Capacité de Combat 35. Avances = 5 (espèce) + 8 (carrière) = 13. Valeur = 35 + 13 = 48. Bonus = 48 ÷ 10 = +4.

### Dépendances de calcul

**Ordre de calcul** :
1. Caractéristiques de base (espèce + tirage/saisie)
2. Modificateurs de caractéristiques (signe astrologique, talents)
3. Avances de skills (espèce + carrière)
4. Valeurs finales de skills (caractéristique + avances)

**Recalcul en cascade** : Si caractéristique change → toutes les skills liées recalculées. Exemple : Talent "Affable" (+5 Sociabilité) → Charme, Commandement, etc. recalculés.

### Caractéristiques liées par type

**Combat** : Corps à corps (CC), Projectiles (CT).

**Physiques** : Athlétisme (Ag), Escalade (F), Chevaucher (Ag), Esquive (Ag), Résistance (E).

**Mentales** : Calme (FM), Intuition (I), Perception (I), Focalisation (FM), Langues (Int).

**Sociales** : Charme (Soc), Commandement (Soc), Intimidation (F ou FM), Ragots (Soc).

**Spécialisées** : Métier (Dex), Art (Dex), Guérison (Int), Crochetage (Dex), Navigation (Int).

### Limites valeurs

**Valeur minimale** : Caractéristique sans avances (ex: Dextérité 20 + 0 avances = 20). Minimum théorique : 0 (si caractéristique et avances à 0, cas rarissime).

**Valeur maximale à la création** : Caractéristique max (~45-50 selon espèce et modificateurs) + Avances max (15) = ~60-65. Exemple extrême : Nain Endurance 40 + Modificateurs +5 + Avances 15 = 60.

**Bonus max à la création** : Généralement +4 à +6 pour les skills principales. Exemple : Valeur 60 → Bonus +6.

## Regroupement et affichage

### Groupement par type Basic/Advanced

Organisation visuelle et regroupement des compétences affichées dans l'étape Skills. Les compétences sont organisées pour faciliter la lecture et la navigation.

**Compétences Basic** : Type "base" dans la table Skills (voir [skills.md](../../database/skills.md)). Accessibles à tous les personnages sans formation particulière. Exemples : Athlétisme, Calme, Charme, Esquive, Intuition, Perception, Résistance.

**Compétences Advanced** : Type "avancée" dans la table Skills. Nécessitent formation spécifique (listées dans carrière). Exemples : Crochetage, Focalisation, Guérison, Langue, Navigation.

**Affichage groupé** : Section "Compétences de base" = toutes les skills type="base". Section "Compétences avancées" = toutes les skills type="avancée". Séparateur visuel ou titre de section entre les deux groupes.

### Organisation par caractéristique liée

**Groupement par attribut** : Compétences regroupées selon le champ `characteristic`. Sous-sections : CC, CT, F, E, I, Ag, Dex, Int, FM, Soc.

**Exemples de groupes** :
- **CC** (Capacité de Combat) : Corps à corps (toutes specs)
- **CT** (Capacité de Tir) : Projectiles (toutes specs)
- **Ag** (Agilité) : Athlétisme, Esquive, Chevaucher, Discrétion
- **Dex** (Dextérité) : Art, Métier, Crochetage, Escamotage, Passe-passe
- **Int** (Intelligence) : Connaissance, Guérison, Langue, Navigation, Recherche
- **FM** (Force Mentale) : Calme, Focalisation, Commandement (en partie)
- **Soc** (Sociabilité) : Charme, Commandement, Commerage, Marchandage, Ragots

**Utilité** : Visualiser rapidement quelles compétences bénéficient d'une caractéristique élevée. Comprendre les synergies entre caractéristiques et compétences.

### Ordre alphabétique

**Tri** : Compétences triées alphabétiquement par label au sein de chaque groupe/section. Exemple section Ag : Athlétisme, Chevaucher, Discrétion (Rurale), Esquive.

**Gestion des spécialisations** : Tri sur le label complet incluant spécialisation. Exemple : Art (Calligraphie), Art (Peinture), Art (Sculpture). Corps à corps (Bagarre), Corps à corps (Base), Corps à corps (Escrime).

### Mode d'affichage

**Affichage par défaut (probable)** : Liste unique triée alphabétiquement, pas de regroupement visuel (simple tri).

**Affichage alternatif (possible)** : Regroupement Basic/Advanced avec titres de section ou regroupement par caractéristique.

**Filtrage (non implémenté dans wizard)** : Possible amélioration future = filtrer par type ou caractéristique. Non présent dans le code actuel de StepSkills.html.

## Calcul des avances

### Sources d'avances

Calcul des augmentations (avances) de compétences selon leur source (espèce, carrière, expérience). Les avances déterminent le bonus ajouté à la caractéristique de base.

**Espèce** (voir section Compétences d'espèce) : 3 compétences à +5 avances chacune, 3 compétences à +3 avances chacune. Défini lors de l'étape Species Skills du wizard.

**Carrière niveau 1** (voir section Compétences de carrière) : 40 points à répartir librement, maximum 10 points par compétence. Défini lors de l'étape Career Skills du wizard.

**Expérience ultérieure** (hors wizard) : Dépenses XP pour augmenter les compétences après création. Coûts par paliers (voir [calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md)).

### Cumul des avances

**Règle de cumul** : Les avances de toutes les sources s'additionnent. Formule : Avances totales = Avances espèce + Avances carrière + Avances XP.

**Type de compétences et avances initiales** :
- **Compétences de base** (type "base") : Toujours disponibles, même sans formation. Avances initiales = espèce + carrière (selon sélections). Exemples : Athlétisme, Calme, Esquive, Perception.
- **Compétences avancées** (type "avancée") : Nécessitent formation (listées dans carrière). Avances initiales = uniquement si dans espèce OU carrière. Exemples : Guérison, Crochetage, Navigation, Focalisation.

**Affichage par source** :
- Colonne "Augm" dans Species Skills : affiche uniquement les avances d'espèce (0, 3 ou 5). Exemples : Art (Peinture) → 5, Calme → 3.
- Colonne "Augmentation" dans Career Skills : affiche le cumul espèce + carrière. Exemples : Charme (espèce +3, carrière +10) → 13.

**Stockage par source** : Champ `specie` = avances d'espèce (0/3/5). Champ `career` = avances de carrière (0-10). Champ `advance` ou `xp` = avances par dépense XP (après création).

### Avances initiales (création de personnage)

**Espèce uniquement** : 6 compétences de l'espèce reçoivent des avances (3×+5, 3×+3). Total : 24 avances d'espèce distribuées.

**Carrière niveau 1** : 40 points à répartir parmi les 8-10 compétences de carrière. Max 10 par compétence. Cumul possible avec avances d'espèce.

**Total maximum à la création** : Une compétence peut avoir maximum 5 (espèce) + 10 (carrière) = 15 avances. Si non dans espèce : maximum 10 avances (carrière seulement). Si non dans carrière : maximum 5 avances (espèce seulement).

### Avances par XP (après création)

**Mécanisme** (voir [calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md)) : Coûts par paliers : 1-5 (10 XP), 6-10 (15 XP), 11-15 (20 XP), etc. Multiplicateur ×2 si compétence hors carrière actuelle/passée. Les avances XP s'ajoutent aux avances initiales.

**Exemple progression** : Personnage créé avec Athlétisme 10 avances (5 espèce + 5 carrière). Dépense 15 XP pour passer à 11 avances. Dépense 15 XP pour passer à 12 avances. Etc.

### Distinction compétences base vs avancées

**Compétences de base** : Peuvent être augmentées par XP même si non dans carrière. Coût normal (non multiplié par 2). Exemples : Athlétisme, Calme, Esquive.

**Compétences avancées** : Doivent être dans carrière actuelle ou passée pour être augmentées. Sinon : coût ×2 (hors carrière). Exemples : Guérison, Crochetage, Focalisation.

## Validation

### Validation spécialisations

Validation de la cohérence des compétences sélectionnées lors de l'étape Skills du wizard. Vérifications avant de permettre la progression vers l'étape suivante.

**Spécialisations obligatoires** : Toute compétence groupée (champ `specs` non vide) doit avoir une spécialisation définie. Format attendu : "Nom (Spécialisation)". Exemples valides : "Art (Peinture)", "Métier (Forgeron)", "Langue (Bataille)".

**Détection spécialisations manquantes** : Parcours de toutes les compétences avec points > 0. Vérification que le champ `spec` est rempli pour les compétences groupées. Popup automatique si spécialisation manquante lors de l'allocation de points.

**Validation format** : Spécialisation non vide (longueur > 0). Spécialisation cohérente avec le champ `specs` de Skills (si liste fermée).

### Détection compétences en double

**Unicité (Nom, Spécialisation)** : Chaque combinaison doit être unique dans la liste du personnage. Exemples valides : Art (Peinture) + Art (Sculpture) = 2 skills distinctes. Exemple invalide : Art (Peinture) apparaît 2 fois = doublon.

**Cas d'erreur théorique** : Dans le wizard, les doublons sont structurellement impossibles (sélection unique). Validation utile si import/export ou édition manuelle des données.

**Message d'erreur** : "La compétence {Nom} ({Spécialisation}) est présente plusieurs fois".

### Validation pré-requis compétences Advanced

**Compétences avancées hors carrière** : Type "avancée" dans Skills nécessite qu'elle soit dans la carrière actuelle ou passée. Dans le wizard de création : vérifier que skills avancées sont bien dans espèce OU carrière.

**Exception Mode Free** : En mode Free, toutes les compétences sont accessibles sans restriction.

**Validation** : Parcours des skills avancées avec points > 0. Vérification que la skill est présente dans species.skills OU careerLevels.skills. Message : "La compétence avancée {Nom} n'est pas accessible (pas dans espèce ou carrière)".

### Messages d'erreur

**Spécialisation manquante** : "La compétence {Nom} nécessite une spécialisation. Veuillez en sélectionner une." Popup affichée automatiquement lors du clic.

**Spécialisation invalide** (si liste fermée) : "La spécialisation '{Spec}' n'est pas valide pour {Nom}. Choisissez parmi : {Liste}".

**Points non alloués complètement** : Espèce = "Vous devez sélectionner exactement 3 compétences à +5 et 3 compétences à +3". Carrière = "Il reste {N} points à allouer".

**Affichage** : Messages en rouge ou popup modale. Bouton "Valider" désactivé si erreurs présentes. Compteurs visuels (points restants) en temps réel.

### Critères de validation

**Espèce** :
- Critère 1 : Exactement 3 compétences à +5 ET 3 compétences à +3
- Critère 2 : Toutes les compétences groupées avec points > 0 ont une spécialisation définie
- Critère 3 : Uniquement les compétences de l'espèce sont sélectionnables (sauf mode Free)

**Carrière** :
- Critère 1 : Exactement 40 points alloués
- Critère 2 : Aucune compétence ne dépasse 10 points (sauf mode Free)
- Critère 3 : Toutes les compétences groupées avec points > 0 ont une spécialisation définie
- Critère 4 : Uniquement les compétences de carrière sont sélectionnables (sauf mode Free)

### Activation bouton "Valider"

**Conditions d'activation** : Espèce = 3×+5 ET 3×+3 exactement. Carrière = 40 points exactement alloués. Toutes spécialisations définies.

**Feedback visuel** : Bouton grisé si conditions non remplies. Compteurs en rouge si objectifs non atteints. Compteurs en vert si objectifs atteints.

### Mode Free validation

**Désactivation des validations** : Pas de limite de points, toutes les compétences accessibles, pas de validation bloquante, bouton "Valider" toujours actif. Utilité : tests, création rapide de personnages, personnages avancés hors règles standards.

## Exemples concrets

Voir [exemples-personnages-types.md](../exemples-personnages-types.md) pour archétypes complets.

**Focus répartition compétences :**

### Humain Agitateur

**Species Skills :** Sélection Art (Peinture), Charme, Ragots parmi options "Au choix" et "ou". Répartition +5 (Art Peinture, Athlétisme, Calme), +3 (Résistance, Langue Bataille, Charme).

**Career Skills :** 40 points sur Athlétisme, Calme, Charme, Commandement, Ragots. Cumul avec espèce : Charme atteint 53 (base 40 + espèce 3 + carrière 10).

### Nain Artisan

**Species Skills :** Choix Métier (Forgeron) et Connaissance (Métallurgie). Répartition +5 (Métier Forgeron, Résistance, Endurance), +3 (Calme, Corps à corps Base, Connaissance Métallurgie).

**Career Skills :** 40 points concentrés sur Métier (Forgeron) +10, Évaluation +10, Marchandage +10, Perception +10. Métier (Forgeron) total 48 (base 33 + espèce 5 + carrière 10).

### Halfling Bourgeois

**Species Skills :** Choix Ragots parmi "Animaux ou Ragots". Répartition +5 (Charme, Calme, Ragots), +3 (Intuition, Perception, Esquive).

**Career Skills :** Choix Métier (Cuisine) et Langue (Tiléen) parmi options "Au choix". 40 points : Charme +10, Ragots +10, Commandement +10, Métier (Cuisine) +5, Langue (Tiléen) +5. Charme et Ragots atteignent 49.

## Voir aussi

**Tables database** :
- [species.md](../../database/species.md) - Compétences raciales
- [careerLevels.md](../../database/careerLevels.md) - Compétences de carrière
- [skills.md](../../database/skills.md) - Table Skills (characteristic, type, specs)
- [characteristics.md](../../database/characteristics.md) - Table Characteristics

**Business rules** :
- [calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md) - Coûts XP paliers
- [resume-derived.md](../wizard/resume-derived.md) - Caractéristiques dérivées (PB, Mouvement)

**Patterns** :
- [pattern-parsing.md](../../patterns/pattern-parsing.md) - Parsing listes (virgule, "ou", parenthèses)
- [pattern-specialisations.md](../../patterns/pattern-specialisations.md) - Gestion spécialisations

**Étapes wizard** :
- [species-selection.md](./species-selection.md) - Étape précédente (sélection espèce)
- [talents-choice.md](./talents-choice.md) - Étape suivante (sélection talents)
